# Careers Application Automation

How a career application submitted on kellelectricals.com reaches the
right Google Form and Google Sheet, and what's actually live today versus
what still needs external configuration outside this repository.

**Read this before touching anything else in this pipeline.** It's the
single reference for the architecture, every environment variable, the
Google Apps Script setup, and the exact testing procedure.

## Status at a glance

| Layer | Status |
|---|---|
| Website form, validation, spam protection, reference generation | **IMPLEMENTED** - live in this repo |
| Pre-filled Google Form link generation (`buildPrefillUrl`) | **IMPLEMENTED** - live in this repo, real field IDs confirmed via `listFormItems()` |
| Central routing config (`src/content/careerFormRouting.ts`) | **IMPLEMENTED** - live in this repo |
| Google Apps Script webhook (optional notification endpoint) | **IMPLEMENTED as code**, deployed by the client (Web App URL confirmed working) |
| Zoho Flow webhook + routing | **NOT USED** - see "Why a pre-filled link, not Zoho Flow -> Apps Script -> auto-submit" below |
| Applicant confirmation email, internal notification | **REQUIRES EXTERNAL CONFIGURATION** - optional, not built |
| End-to-end test (website -> pre-filled Google Form link -> applicant completes it -> Sheet) | **PARTIALLY VERIFIED** - `buildPrefillUrl()` output confirmed to carry the right `entry.<id>` params for real, live-inspected forms; an applicant actually completing one end-to-end has not been observed from this session. |

Nothing here is claimed as "connected" that hasn't actually been run and
observed working.

## Architecture

```
Applicant
  |
Kell Electricals /careers/[slug] page
  |
CareerApplicationForm (src/components/careers/CareerApplicationForm.tsx)
  |
POST /api/careers-application (src/app/api/careers-application/route.ts)
  |
  |-- rate limit, origin check, payload-size check
  |-- validation (required fields, email/phone format)
  |-- honeypot + time-trap (silently accepted, never forwarded)
  |-- hCaptcha verification (if configured)
  |-- duplicate check (same track+email+phone within 2 minutes -> returns
  |   the existing reference instead of creating a new one)
  |-- generates KE-APP-YYYY-XXXXXX reference
  |
  +-- apprenticeship / industrial-training / internship:
  |     buildPrefillUrl() (src/content/careerFormRouting.ts) builds a
  |     Google Forms pre-filled link for that track using real
  |     entry.<itemId> values, and the response hands it back as
  |     `redirectUrl`. The /careers/thank-you page shows it as a "one
  |     more step" CTA. CAREERS_WEBHOOK_URL, if set, also gets a
  |     best-effort (non-blocking) copy of the payload for internal
  |     notification purposes only.
  |     Applicant clicks through -> finishes the form on Google's own
  |     page (required photo/ID/CV uploads, DOB, consent, signature) ->
  |     Google Forms writes the row to that form's own linked Sheet.
  |
  +-- job-openings / nysc-placement (no Google Form):
        forwarded to CAREERS_WEBHOOK_URL (required for this path -
        signed, retried on 5xx) for whatever downstream handling the
        client wants (a tracking Sheet, Zoho CRM, email, etc.)
```

### Why a pre-filled link, not Zoho Flow -> Apps Script -> auto-submit

The original design (documented in earlier revisions of this file) routed
every application through Zoho Flow to a Google Apps Script Web App,
which used `FormApp` to auto-submit a `FormResponse` into the matching
Google Form. That design was abandoned after actually inspecting the 3
real forms with `listFormItems()` (see `scripts/google-apps-script/`):
each one is a full 40-50 question application with several **required
file-upload questions** (passport photo, means of ID, CV, certificates).

Two hard constraints rule out auto-submission entirely:

1. **Apps Script's Forms API has no method to submit a file-upload answer
   at all.** This isn't a workaround-able bug - Google doesn't expose one.
2. **`FormResponse.submit()` throws if any required question is
   unanswered**, and these forms have many required fields (DOB, state of
   origin, consent checkboxes, signature) the website's short "Apply Now"
   form never collects.

So auto-submission would have failed on every real application. Instead,
the website builds a **Google Forms pre-filled link** - a native Google
feature (`?entry.<itemId>=value` query params on the public `viewform`
URL) - with the fields it already collected (name, email, phone, and an
institution/course field where a form has an unambiguous match) filled
in, and hands the applicant that link to finish the rest themselves. No
Apps Script submission step is needed for these 3 tracks at all; the
form's own linked Sheet remains the record, exactly as if the applicant
had opened the form directly - they just arrive with several fields
already done.

The Apps Script Web App still exists (`careerApplicationRouter.gs`), but
its role changed: it's now an **optional, best-effort notification
endpoint** (useful if the client later wants it to log to an internal
tracking Sheet or trigger a Zoho step) rather than the actual delivery
mechanism. It is **not required** for the 3 Google Form tracks to work.
Zoho Flow is not used in this design at all - it added no value once
Apps Script's job stopped being "submit into the form."

### NYSC Placement routing

The real site has 5 career tracks (`src/content/careers.ts`): NYSC
Placement, Internship, Industrial Training, Apprenticeship, Job Openings.
The careers-automation brief named only 4 sources - NYSC Placement wasn't
one of them, and before this round `careers.ts` had a now-removed
`applicationFormUrl` field that (incorrectly, and unused anywhere in the
UI) pointed it at what is actually the Internship form.

**Client-confirmed direction: treat `nysc-placement` the same as
`job-openings` for now** - no Google Form, stays entirely in the on-site
pipeline (`careerFormRouting.ts` and `formConfig.gs` both map it to `null`).
It still forwards normally to `CAREERS_WEBHOOK_URL`, so Zoho Flow can
still route it elsewhere later (Zoho CRM, a plain email notification,
etc.) without any website or Apps Script change. Revisit if the client
later wants it pointed at a specific form.

## Environment variables

See `.env.example` for the complete list with descriptions. The ones this
specific pipeline uses:

- `CAREERS_WEBHOOK_URL` - the Apps Script Web App URL (optional
  notification endpoint). **Required only** for `job-openings` and
  `nysc-placement` (no Google Form - it's their only delivery path);
  without it those two tracks tell the applicant it isn't connected yet
  and nothing is lost. For `apprenticeship`/`industrial-training`/
  `internship` it's optional and best-effort - the pre-filled Google Form
  link is generated and returned regardless of whether this is set.
- `CAREERS_WEBHOOK_SECRET` - shared HMAC-SHA256 signing secret. Must match
  the `CAREERS_WEBHOOK_SECRET` Script Property set in the Apps Script
  project (see below) exactly. Optional but strongly recommended.
- `CAREERS_ALLOWED_ORIGINS` - optional comma-separated origin allowlist
  (e.g. `https://kellelectricals.com,https://www.kellelectricals.com`).
  Unset by default (no enforcement change from before this round).
- `HCAPTCHA_SECRET_KEY` / `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - already shared
  with the quote and booking forms; setting them activates hCaptcha here
  too automatically.

None of these are set to real values anywhere in this repository or in
this document. Set them in Vercel's dashboard, per environment
(Development/Preview/Production), never in code.

## Google Forms

Three real forms, supplied directly by the client:

| Track (`trackSlug`) | Programme | Form URL |
|---|---|---|
| `apprenticeship` | Apprenticeship | `.../1FAIpQLScyQUddIgthC752dLwSulX9vRT8V4rPdvlz3Wr7EM0VTktE9A/viewform` |
| `industrial-training` | Industrial Training / SIWES | `.../1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform` |
| `internship` | Internship | `.../1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform` |
| `job-openings` | Job Openings | *(none - stays on-site)* |

Full URLs are in `src/content/careerFormRouting.ts` and
`scripts/google-apps-script/formConfig.gs`. **This was a real
correction**: before this round, `internship` shared the Industrial
Training form and `job-openings` pointed at what is actually the
Internship form (both in the now-removed, entirely unused
`applicationFormUrl` field). Neither mistake was ever live-facing (nothing
read that field), but it would have misrouted every application once an
automation was wired up to it.

### Field mapping - DONE, via `listFormItems()`

Per the brief this pipeline follows: **do not guess Google Form field
(entry) IDs from the public viewform URL** - there is no reliable public
contract for them. `listFormItems()` was actually run against all 3 live
forms (client-confirmed ownership, authorized under `kellelectricals@gmail.com`)
and its real output is what populates `src/content/careerFormRouting.ts`'s
`prefillEntryIds` maps.

Each of the 3 forms turned out to be a full 40-50 question application
(see "Why a pre-filled link" above) - only fields with a real,
unambiguous matching question were mapped:

| Track | `fullName` | `email` | `phone` | `institution` |
|---|---|---|---|---|
| `apprenticeship` | ✓ ("Full Name") | ✓ ("Email Address") | ✓ ("Phone Number") | *(no matching question on this form)* |
| `industrial-training` | ✓ ("Full Name") | ✓ ("Email Address") | ✓ ("Phone Number") | ✓ ("Institution Name", Education & Training section - **note**: this form has two differently-scoped "Institution Name" questions; confirm with the client this is the intended one) |
| `internship` | ✓ ("Full Legal Name") | ✓ ("Email") | ✓ ("Phone number") | ✓ ("Most Recent Institution Attended") |

`reference` and `message` are **deliberately not mapped anywhere** - none
of the 3 forms has a generic freeform note or an application-reference
question, and guessing a wrong mapping would silently overwrite an
applicant's real answer to a differently-worded required question
instead. The reference number is still shown to the applicant on the
site's own `/careers/thank-you` page for their own records.

`scripts/google-apps-script/formConfig.gs` still carries `REPLACE_ME_*`
placeholders in its `fields` object - that file is now unused by the live
pipeline (see "Why a pre-filled link" above) and kept only as a record of
the form URLs / item IDs discovered. It is safe to leave as-is.

## Google Sheets

Each Google Form already writes its responses to its own linked Google
Sheet (Google Forms does this automatically once a form has a "Responses"
destination sheet set up - if any of the 3 forms doesn't have one yet, add
it from the form's own **Responses > Sheet icon**). No second spreadsheet
is created by this pipeline - the existing per-form sheets are exactly
where applications will appear once field mapping (above) is complete.

### Recommended central applicant database

For a single cross-programme view (useful once volume grows, or for
`job-openings` and `nysc-placement` which have no per-form sheet), a
separate Google Sheet with these columns is recommended:

```
Application Reference | Application Date | Programme | Applicant Name |
Email | Phone | Institution | Course | Role Applied For | CV Link |
Message | Source | Application Status | Interview Status |
Interview Date | Reviewed By | Review Notes | Final Decision | Last Updated
```

Default `Application Status` on creation: `New`. Suggested lifecycle:
`New -> Under Review -> Shortlisted -> Interview -> Accepted`, with
`Rejected` / `On Hold` / `Withdrawn` as alternative terminal states. This
is a recommendation, not something built in this round - it would be
populated either by a Zoho Flow step (write a row on every webhook
delivery, regardless of track) or by extending `careerApplicationRouter.gs`
to also append a row via `SpreadsheetApp`.

## Google Apps Script setup (DEPLOYED - client-confirmed working)

The code lives in `scripts/google-apps-script/`:

- `formConfig.gs` - the form URLs + field ID reference table. No longer
  used by `doPost` (see "Why a pre-filled link" above) - kept as a record
  of what `listFormItems()` found.
- `listFormItems.gs` - the admin inspector utility. Already run
  successfully against all 3 live forms.
- `careerApplicationRouter.gs` - the `doPost` handler: verifies the HMAC
  signature, durable duplicate check, logs/acknowledges. Optional
  notification endpoint only - see architecture section above.

Deployed by the client under `kellelectricals@gmail.com` (confirmed owner
of all 3 Google Forms). To redeploy after editing the code:

1. Go to [script.google.com](https://script.google.com), open the "Kell
   Careers Router" project.
2. Paste updated file contents into the matching `.gs` file, save.
3. **Deploy > Manage deployments > edit (pencil icon) > New version** -
   editing the code alone does not update the live Web App URL's
   behavior; a new version must be deployed.

One-time setup (already done):

- **Project Settings (gear icon) > Script Properties > Add script
  property**: name `CAREERS_WEBHOOK_SECRET`, value = the exact same
  string as the website's `CAREERS_WEBHOOK_SECRET` env var.
- **Deploy > New deployment > Select type: Web app.** Execute as **Me**,
  Who has access **Anyone**.
- Set the website's `CAREERS_WEBHOOK_URL` (Vercel, Production
  environment) to the resulting Web App URL.

### A real setup issue hit and fixed this round

`FormApp.openByUrl()` only reliably resolves a form's **editor URL**
(`docs.google.com/forms/d/{fileId}/edit`), not the **published/response
URL** (`docs.google.com/forms/d/e/{publishedId}/viewform`) - these are two
different IDs for the same form. Using the published URL (which is what
the client originally supplied, and what `careerFormRouting.ts` still
uses as the base for pre-filled links, since that part is correct) made
`listFormItems()` fail with a misleading "no item with the given ID...
you do not have permission" error even though the account genuinely owned
the forms and had full Forms API authorization. Fixed by switching
`formConfig.gs`'s `formUrl` values to the editor URL for the
`listFormItems()` run only - `careerFormRouting.ts` (the website side,
used to build pre-filled links) correctly keeps the published `viewform`
URL, since that's the one applicants are meant to actually open.

### A known Apps Script limitation

Web App responses **cannot set a custom HTTP status code** - this is a
platform constraint, not a bug in `careerApplicationRouter.gs`. Every
response is HTTP 200 from Apps Script's side; success/failure is conveyed
in the JSON body's `ok` field instead. Whoever configures Zoho Flow's
error-handling branch on this step needs to check the response body, not
the HTTP status.

## Zoho Flow - not used in this design

Earlier revisions of this pipeline routed through Zoho Flow as a
pass-through step between the website and Apps Script. That's no longer
part of the design (see "Why a pre-filled link, not Zoho Flow -> Apps
Script -> auto-submit" above) - once Apps Script's job stopped being "submit
into the form," Zoho Flow added a hop with no function. `CAREERS_WEBHOOK_URL`
points directly at the Apps Script Web App URL.

If the client later wants a Zoho CRM/Recruit/People/Cliq/Mail integration
(the original brief's future-integration ask), Zoho Flow is still the
natural place to add it - point `CAREERS_WEBHOOK_URL` at a Zoho Flow
webhook trigger instead, with one HTTP action forwarding to the Apps
Script Web App URL exactly as before, plus whatever Zoho actions are
wanted alongside it. Nothing about `careerFormRouting.ts` or the pre-fill
mechanism needs to change for that - only where `CAREERS_WEBHOOK_URL`
points.

### Payload fields the (optional) webhook receiver sees

```json
{
  "reference": "KE-APP-2026-482731",
  "source": "kellelectricals.com careers application form",
  "trackSlug": "apprenticeship",
  "trackName": "Apprenticeship",
  "fullName": "Applicant Name",
  "email": "applicant@example.com",
  "phone": "+234...",
  "courseOrInstitution": "Electrical Engineering / University",
  "roleAppliedFor": "",
  "cvLink": "",
  "message": "Application message",
  "submittedAt": "2026-09-04T10:00:00.000Z",
  "userAgent": "Mozilla/5.0 ...",
  "ipHash": "a1b2c3d4e5f6a7b8"
}
```

`ipHash` is a truncated SHA-256 hash of the submitter's IP, never the raw
address - it's there only so a spam pattern (many submissions from the
same source) is detectable without storing anything that identifies a
person directly. The honeypot field, the raw hCaptcha token, and the
client-side `renderedAt` timestamp are deliberately **not** included -
they're validated and discarded server-side before this payload is built.

### Applicant confirmation email + internal notification

For `apprenticeship`/`industrial-training`/`internship`, the applicant's
confirmation of receipt is effectively Google Forms' own built-in
submission confirmation once they finish the form - no extra email is
strictly needed. For `job-openings`/`nysc-placement` (and if the client
wants a confirmation email for the other 3 tracks too, sent immediately
on the website step rather than waiting for form completion),
recommended: wire `CAREERS_WEBHOOK_URL` through **Zoho Flow** and use its
own email action, not new website infrastructure. No email-sending
service (Resend, SendGrid, etc.) exists anywhere in this codebase, and
introducing one is a real infrastructure decision (a new paid account,
new secrets) that shouldn't be made silently on the client's behalf.

**Applicant confirmation** - subject and body to configure in Zoho Flow's
email action, using the webhook payload's fields:

> Subject: `Kell Electricals Ltd — Application Received | {{reference}}`
>
> Thank you for your interest in joining Kell Electricals Ltd. Your
> application for **{{trackName}}** has been received and is now under
> review.
>
> **Reference:** {{reference}}
>
> Our team reviews applications directly - not an automated filter. If
> your background fits what we're looking for, we'll follow up by phone
> or email.
>
> Questions? Call {{company phone}} or reply to this email.
>
> — Kell Electricals Ltd

Do not promise employment, acceptance, or a specific response time in
this email - matches the same caution already applied sitewide to
response-time claims (see `docs/next-steps.md`'s emergency-response
wording note).

**Internal notification** - a second Zoho Flow email/Cliq action, sent to
the team:

> NEW CAREER APPLICATION
> Reference: {{reference}}
> Programme: {{trackName}}
> Applicant: {{fullName}}
> Email: {{email}}
> Phone: {{phone}}
> Institution/Course: {{courseOrInstitution}}
> Role: {{roleAppliedFor}}
> Submitted: {{submittedAt}}
> CV: {{cvLink}}

## Security

- **Rate limiting**: 5 requests / 10 minutes per IP (in-memory, resets on
  cold start - stops a single script hammering the endpoint, not a
  distributed attack; see `src/lib/rateLimit.ts`'s own header comment).
- **hCaptcha**: active once `HCAPTCHA_SECRET_KEY` /
  `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` are both set; inert (no widget shown,
  no token required) until then.
- **Honeypot**: a hidden `website` field - a bot filling it in gets a
  silent `{ ok: true }` with nothing forwarded anywhere.
- **Time-trap**: submissions completed in under 3 seconds after the form
  renders are silently accepted but never forwarded (same honeypot-style
  fake success, so a bot doesn't learn it was caught).
- **Webhook signing**: HMAC-SHA256 over the exact JSON string sent, hex-
  encoded, in the `x-webhook-signature` header. `careerApplicationRouter.gs`
  verifies it with a constant-time-safe comparison (`verifySignature_()`)
  rather than a naive `===`.
- **Duplicate protection**: two layers -
  1. Website-side (`src/app/api/careers-application/route.ts`): an
     in-memory, 2-minute window, best-effort guard keyed on track + email
     + phone. Resets on cold start, not shared across serverless
     instances - stops a double-click or an impatient retry from one warm
     instance.
  2. Apps Script-side (`careerApplicationRouter.gs`, if
     `CAREERS_WEBHOOK_URL` is set): `CacheService` keyed on the
     application `reference`, 6-hour TTL - durable across executions,
     catches network-level duplicate deliveries to that optional
     notification endpoint. For `apprenticeship`/`industrial-training`/
     `internship`, the real duplicate-prevention boundary is Google
     Forms itself (nothing stops an applicant from submitting the
     pre-filled form twice, same as any public Google Form).
- **Origin allowlist**: optional, off by default (`CAREERS_ALLOWED_ORIGINS`
  unset = no enforcement, unchanged from before this round).
- **Payload size limit**: requests with a `Content-Length` over 20KB are
  rejected with 413 before the body is even parsed.
- **No secret leakage**: every error response to the browser is a generic
  `{ ok: false, reason: '...' }` - no stack traces, webhook URLs, or
  upstream error text ever reach the client. Full detail is logged
  server-side only (`console.error`/`Logger.log`).
- **Input validation**: server-side only is trusted - the client-side
  `validate()` in `CareerApplicationForm.tsx` is a UX convenience, not a
  security boundary; `isValidPayload()` in the API route re-validates
  everything independently.

## Testing

### What was actually run this round (PASS/FAIL against the real code)

| Test | Result |
|---|---|
| `npx tsc --noEmit` | **PASS** |
| `npm run build` | **PASS** |
| Missing required field (`fullName`) -> 422 `invalid_payload` | **PASS** |
| Invalid email format -> 422 `invalid_payload` | **PASS** |
| Invalid/unknown `trackSlug` -> 422 `invalid_payload` | **PASS** |
| Honeypot filled -> 200 `{ ok: true }`, nothing forwarded | **PASS** |
| Malformed JSON body -> 400 `invalid_json` | **PASS** |
| Oversized payload (`Content-Length` > 20KB) -> 413 `payload_too_large` | **PASS** |
| `CAREERS_WEBHOOK_URL` unset -> `job-openings`/`nysc-placement` return 503 `not_configured`; `apprenticeship`/`industrial-training`/`internship` still succeed with a `redirectUrl` (webhook is optional on that path) | **PASS** |
| Rate limit (6th request in 10 minutes from one IP) -> 429 `rate_limited` | **PASS** |
| **Successful forward, `job-openings` track** (mock webhook receiver on `127.0.0.1:4000`) -> `{ ok: true, reference }`, receiver got a JSON body matching the documented shape exactly, with the honeypot field, raw hCaptcha token, and `renderedAt` all absent | **PASS** - actually observed, not assumed |
| **Webhook signature correctness** - manually recomputed `HMAC-SHA256(body, secret)` in a separate `node -e` process and compared byte-for-byte against the `x-webhook-signature` header the route sent | **PASS** - exact match |
| **Duplicate detection** - same track+email+phone submitted twice within 2 minutes -> first call forwarded and got a reference, second call returned `{ ok: true, duplicate: true, reference: <same reference as the first> }` and the mock receiver's log confirms only ONE webhook delivery occurred | **PASS** - actually observed, not assumed |
| **`buildPrefillUrl()` output** for all 3 Google Form tracks, given real `fullName`/`email`/`phone`/`courseOrInstitution` values -> URL contains the exact `entry.<itemId>` params from the live `listFormItems()` run (see "Field mapping" table above), correctly URL-encoded | **PASS** - checked against the actual logged item IDs |
| `listFormItems()` run against all 3 live Google Forms (client-run, in the Apps Script editor, under `kellelectricals@gmail.com`) | **PASS** - real item IDs obtained, now in `careerFormRouting.ts` |
| Apps Script `doPost` deployed as a Web App, URL confirmed reachable | **PASS** - client-provided deployment URL |

Exact commands for the website-side tests are in "Reproducing the
website-side tests" below.

### What could NOT be tested from this session

- An applicant actually opening a pre-filled link and completing the rest
  of a real Google Form end-to-end (no browser session as an applicant
  was run from here - the client should do one real test submission per
  track before announcing the pipeline live).
- The Apps Script webhook (`careerApplicationRouter.gs`) receiving a real
  POST from the live website in production (only the website's own
  best-effort `fetch()` call and its error handling were exercised
  locally against a mock receiver).
- hCaptcha and hCaptcha-failure paths (no real site/secret key pair
  configured in this environment).

### Full manual test plan (client-run, one pass before announcing live)

1. **Apprenticeship / Industrial Training / Internship** - submit the
   on-site form for each track. Expect: website redirects to
   `/careers/thank-you` showing a "Continue to the application form" CTA
   -> clicking it opens the real Google Form with Full Name/Email/Phone
   (and Institution, where mapped) already filled in -> complete the
   remaining required fields (photo, DOB, consent, signature, etc.) and
   submit -> confirm a new row appears in that form's own linked Google
   Sheet.
2. **Job Openings / NYSC Placement** - submit with `trackSlug=job-openings`
   or `nysc-placement`. Expect: no Google Form redirect (there isn't one
   for these tracks) - if `CAREERS_WEBHOOK_URL` is set, confirm the
   configured downstream (tracking Sheet, Zoho CRM, etc.) received it;
   if unset, confirm the applicant sees the "email/call us instead"
   fallback rather than a silent failure.
3. Negative cases: CAPTCHA failure (needs real hCaptcha keys), Apps
   Script webhook unavailable for `job-openings`/`nysc-placement` (point
   `CAREERS_WEBHOOK_URL` at a URL that 404s, confirm the retry-then-502
   behavior), invalid webhook signature (send a request to the Apps
   Script URL directly with a wrong signature and confirm 401
   `invalid_signature`).

### Reproducing the website-side tests locally

```bash
npm run build && npm run start -- -p 3999 &
# missing field
curl -s -X POST http://localhost:3999/api/careers-application \
  -H 'Content-Type: application/json' \
  -d '{"trackSlug":"apprenticeship","email":"a@b.com","phone":"+2348000000000","message":"hi"}'
# -> {"ok":false,"reason":"invalid_payload"}

# honeypot
curl -s -X POST http://localhost:3999/api/careers-application \
  -H 'Content-Type: application/json' \
  -d '{"trackSlug":"apprenticeship","fullName":"Test","email":"a@b.com","phone":"+2348000000000","message":"hi","website":"spam"}'
# -> {"ok":true}

# malformed JSON
curl -s -X POST http://localhost:3999/api/careers-application \
  -H 'Content-Type: application/json' -d '{not json'
# -> {"ok":false,"reason":"invalid_json"}
```

## Adding another career programme

1. Add the track to `src/content/careers.ts`'s `careerTracks` array (real
   content only - see that file's own header comment on the no-invent
   policy).
2. If it needs a Google Form destination, add an entry to
   `src/content/careerFormRouting.ts` with the real, live `googleFormUrl`
   (the public `viewform` link - never guess one) and a `prefillEntryIds`
   map.
3. To get that form's real field IDs: temporarily add its editor URL
   (`docs.google.com/forms/d/{fileId}/edit` - **not** the `viewform`
   link, see "A real setup issue hit and fixed this round" above) to
   `formConfig.gs`'s `FORM_CONFIG` and run `listFormItems()` again in the
   Apps Script editor. Map only fields with a real, unambiguous matching
   question - leave a field out entirely rather than guessing (see
   "Field mapping" above for why `reference`/`message` are skipped on all
   3 existing forms).
4. If it should route to something other than a Google Form (e.g.
   straight into Zoho CRM/Recruit), set `googleFormUrl: null` for it in
   `careerFormRouting.ts` and forward it via `CAREERS_WEBHOOK_URL` -
   same treatment as `job-openings`/`nysc-placement`.
5. No code change is needed to the API route itself
   (`src/app/api/careers-application/route.ts`) - it already reads the
   track dynamically from `careers.ts` and routes dynamically from
   `careerFormRouting.ts`, no track name is hardcoded.

## Troubleshooting

- **"Online submission isn't connected yet" shown to applicants on
  job-openings/nysc-placement** - `CAREERS_WEBHOOK_URL` is unset in the
  current environment (Vercel: check Production specifically, not just
  Preview/Development). This should never happen on
  apprenticeship/industrial-training/internship, since those don't
  require `CAREERS_WEBHOOK_URL` at all.
- **Pre-filled Google Form link opens but a field is blank that should be
  filled** - check `careerFormRouting.ts`'s `prefillEntryIds` for that
  track; either the field genuinely has no match on that specific form
  (see the "Field mapping" table above), or the applicant left it empty
  on the website's own form.
- **`FormApp.openByUrl()` fails with "No item with the given ID could be
  found... you do not have permission"** when running `listFormItems()`
  - almost always means the URL in `formConfig.gs` is the published
  `/d/e/{id}/viewform` link rather than the editor `/d/{id}/edit` link;
  see "A real setup issue hit and fixed this round" above. Confirm with
  `Session.getEffectiveUser().getEmail()` that the script is actually
  running as an account with edit access to the form (Forms sharing, not
  just Drive-level sharing).
- **401 `invalid_signature` from the Apps Script URL** - the
  `CAREERS_WEBHOOK_SECRET` Script Property doesn't match the website's env
  var exactly (whitespace, wrong environment). If intentionally testing
  without a secret, remove the Script Property entirely rather than
  setting it to an empty string.
- **A track's applications aren't in the sheet you expect** - see
  "Google Forms" above; confirm you're checking the sheet for the correct
  `trackSlug`, since this exact confusion (Internship vs Industrial
  Training) is the bug an earlier round of this pipeline fixed.
