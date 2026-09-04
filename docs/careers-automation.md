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
| Webhook signing, retry, duplicate guard, error handling | **IMPLEMENTED** - live in this repo |
| Central routing config (`src/content/careerFormRouting.ts`) | **IMPLEMENTED** - live in this repo |
| Google Apps Script router + form-field inspector | **IMPLEMENTED as code** - written and ready, **not deployed** (no Google account access exists in this environment) |
| Zoho Flow webhook + routing | **REQUIRES EXTERNAL CONFIGURATION** - no Zoho Flow access exists in this environment; documented below, not built |
| Google Form field ID mapping (`formConfig.gs`) | **REQUIRES EXTERNAL CONFIGURATION** - placeholders only, an admin must run `listFormItems()` and fill them in |
| Applicant confirmation email, internal notification | **REQUIRES EXTERNAL CONFIGURATION** - no email provider exists in this codebase; recommended approach documented below (Zoho Flow's own email action, not new website infrastructure) |
| End-to-end test (website -> Zoho Flow -> Apps Script -> Google Form -> Sheet) | **NOT VERIFIED** - cannot be, without the above being deployed. Only the website-side legs were actually tested (see Testing section). |

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
  v
CAREERS_WEBHOOK_URL (HMAC-signed JSON POST)
  |
  v
Zoho Flow  <-- REQUIRES EXTERNAL CONFIGURATION, see below
  |
  v
Google Apps Script Web App (scripts/google-apps-script/)
  |
  |-- verifies the same HMAC signature
  |-- durable duplicate check (CacheService, 6h TTL)
  |-- looks up the track in FORM_CONFIG
  |
  +-- apprenticeship        -> Apprenticeship Google Form   -> its Google Sheet
  +-- industrial-training   -> Industrial Training Google Form -> its Google Sheet
  +-- internship            -> Internship Google Form       -> its Google Sheet
  +-- job-openings          -> (no form - acknowledged only, stays in the
  |                             on-site pipeline / a future applicant DB)
  +-- anything else (e.g. nysc-placement) -> logged, acknowledged, NOT
                                              silently discarded - see
                                              "Unmapped tracks" below
```

### Why Google Apps Script instead of Zoho Flow branching directly into 3 Google Forms

Two viable designs exist. This pipeline uses Apps Script as the routing
layer for one concrete reason: **Google Forms has no documented public API
for submitting a response by field name from outside Apps Script.** The
only reliable way to programmatically submit into a Google Form is
`FormApp` from inside Apps Script, running under an account with edit
access to that form. Zoho Flow's own Google Forms connector (where it
exists) has the same constraint under the hood.

This also means Zoho Flow's own job stays simple: **one webhook trigger,
one HTTP action** (POST the payload to the Apps Script Web App URL). No
branching logic needs to live in Zoho Flow at all - Apps Script's
`FORM_CONFIG` already knows how to route by `trackSlug`. If you'd rather
have Zoho Flow branch explicitly (matching a literal reading of "Zoho Flow
Router" in the original brief), that's also possible: give Zoho Flow 3+1
IF branches on `trackSlug` and point each at a *different* Apps Script Web
App deployment (or the same one - it doesn't care), but there's no
functional benefit to doing it that way, and it's more Zoho Flow steps to
maintain.

**You can also skip Zoho Flow entirely** for this specific pipeline and
point `CAREERS_WEBHOOK_URL` directly at the Apps Script Web App URL. The
only reason to keep Zoho Flow in the middle is the future integration the
original brief asked for (Zoho CRM, Zoho Recruit, Zoho People, Zoho Cliq
notifications) - Zoho Flow is the natural place to fan out to those later
without touching the website or the Apps Script code again.

### Unmapped tracks (nysc-placement)

The real site has 5 career tracks (`src/content/careers.ts`): NYSC
Placement, Internship, Industrial Training, Apprenticeship, Job Openings.
The careers-automation brief named only 4 sources (Apprenticeship,
Industrial Training/SIWES, Internship, Job Openings) - NYSC Placement was
not mentioned.

Before this round, `careers.ts` had a now-removed `applicationFormUrl`
field that (incorrectly, and unused anywhere in the UI) pointed
NYSC Placement at what is actually the Internship form. That mismatch is
now gone - `nysc-placement` has **no** Google Form route configured in
`careerFormRouting.ts` or `formConfig.gs`. It still forwards normally to
`CAREERS_WEBHOOK_URL` (Zoho Flow can still send it wherever makes sense -
Zoho CRM, a plain email notification, etc.), and the Apps Script router
logs and acknowledges it rather than erroring, but it will not land in any
Google Form until the client confirms where it should go.

## Environment variables

See `.env.example` for the complete list with descriptions. The ones this
specific pipeline uses:

- `CAREERS_WEBHOOK_URL` - Zoho Flow's webhook trigger URL, or the Apps
  Script Web App URL directly. **Required** for applications to go
  anywhere; without it the form tells the applicant it isn't connected yet
  and nothing is lost.
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

### Field mapping - REQUIRES EXTERNAL CONFIGURATION

Per the brief this pipeline follows: **do not guess Google Form field
(entry) IDs from the public viewform URL** - there is no reliable public
contract for them. `scripts/google-apps-script/formConfig.gs` ships with
`REPLACE_ME_*` placeholders instead of invented IDs.

To fill them in:

1. Open the Apps Script project (see Deployment below) and run
   `listFormItems()` (in `listFormItems.gs`).
2. Check **View > Logs** (or **Executions**). For each of the 3 forms it
   prints every question's title, type, and item ID.
3. Copy the real IDs into `formConfig.gs`'s `fields` object for the
   matching form, matching each question to `reference`, `fullName`,
   `email`, `phone`, `institution` (courseOrInstitution), `message`.
4. If a form doesn't ask one of these questions, leave that key out of its
   `fields` object entirely (the router skips fields with no mapping - see
   `careerApplicationRouter.gs`'s `submitToForm_()`).

**Recommendation**: if none of the 3 forms currently has a question for
the application reference, add one ("Application Reference" - a short
text question) to each form before finishing this setup. It's the
easiest way to cross-reference a Google Sheet row back to a specific
website submission, and it costs nothing to add.

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

## Google Apps Script setup (REQUIRES EXTERNAL CONFIGURATION)

The code is written and ready in `scripts/google-apps-script/`:

- `formConfig.gs` - the routing table (form URLs + field ID placeholders).
- `listFormItems.gs` - the admin inspector utility.
- `careerApplicationRouter.gs` - the `doPost` handler that does the actual
  routing, signing verification, and duplicate protection.

None of this has been deployed - deploying it requires a Google account
with edit access to the 3 forms, which this session does not have. To
deploy:

1. Go to [script.google.com](https://script.google.com), create a new
   project.
2. Create 3 files matching the names above and paste in each file's
   contents.
3. **Project Settings (gear icon) > Script Properties > Add script
   property**: name `CAREERS_WEBHOOK_SECRET`, value = the exact same
   string as the website's `CAREERS_WEBHOOK_SECRET` env var. This is how
   the secret gets into the script without ever being hardcoded.
4. Run `listFormItems()` once (see "Field mapping" above), fill in the
   real item IDs in `formConfig.gs`.
5. **Deploy > New deployment > Select type: Web app.** Execute as
   **Me**, Who has access **Anyone**. Deploy, copy the Web App URL.
6. Set the website's `CAREERS_WEBHOOK_URL` to that URL directly, **or**
   configure Zoho Flow to call it (see below) and point
   `CAREERS_WEBHOOK_URL` at Zoho Flow's own webhook trigger URL instead.
7. Every time you edit the script after the first deploy, use **Deploy >
   Manage deployments > edit (pencil icon) > New version** - editing the
   code alone does not update the live Web App URL's behavior.

### A known Apps Script limitation

Web App responses **cannot set a custom HTTP status code** - this is a
platform constraint, not a bug in `careerApplicationRouter.gs`. Every
response is HTTP 200 from Apps Script's side; success/failure is conveyed
in the JSON body's `ok` field instead. Whoever configures Zoho Flow's
error-handling branch on this step needs to check the response body, not
the HTTP status.

## Zoho Flow configuration (REQUIRES EXTERNAL CONFIGURATION)

No Zoho Flow access exists in this environment - this section is a
configuration guide, not something built or verified here.

**Recommended design** (simplest, matches "Zoho Flow should have ONE
incoming webhook" from the brief):

```
TRIGGER: Webhook (Zoho Flow generates a URL - set this as the website's
         CAREERS_WEBHOOK_URL)
  |
ACTION: HTTP request (POST) -> the Apps Script Web App URL from step 5
        above. Forward the request body as-is; forward the
        x-webhook-signature header if Zoho Flow's HTTP action supports
        custom headers (if it doesn't, see "Signature verification"
        below for the fallback).
  |
(optional, for future Zoho integration - not required for Google Forms
 to work) ACTION: Zoho CRM / Zoho Recruit / Zoho People / Zoho Cliq /
 Zoho Mail actions, using the same webhook payload's fields.
```

If Zoho Flow's HTTP action **cannot** forward a custom header, the
payload's JSON body can carry the signature instead - the field name
`__signature` is already handled as a fallback in
`careerApplicationRouter.gs`'s signature check (see that file). Include it
as an extra top-level field if you go this route.

### Payload fields Zoho Flow (and anything downstream of it) will see

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

Recommended: use **Zoho Flow's own email action**, not new website
infrastructure. No email-sending service (Resend, SendGrid, etc.) exists
anywhere in this codebase, and introducing one is a real infrastructure
decision (a new paid account, new secrets) that shouldn't be made
silently on the client's behalf. Zoho Flow already sits in this pipeline
and can send email natively as a flow step - zero new code, zero new
services.

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
  2. Apps Script-side (`careerApplicationRouter.gs`): `CacheService`
     keyed on the application `reference`, 6-hour TTL - durable across
     executions, catches Zoho Flow retries and network-level duplicate
     deliveries. This is the layer that actually matters for correctness;
     the website-side one is a UX nicety for the common case.
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
| `CAREERS_WEBHOOK_URL` unset -> 503 `not_configured`, form shows the "email/call us instead" fallback | **PASS** |
| Rate limit (6th request in 10 minutes from one IP) -> 429 `rate_limited` | **PASS** |
| **Successful forward** (mock webhook receiver on `127.0.0.1:4000`) -> `{ ok: true, reference }`, receiver got a JSON body matching the documented shape exactly, with the honeypot field, raw hCaptcha token, and `renderedAt` all absent | **PASS** - actually observed, not assumed |
| **Webhook signature correctness** - manually recomputed `HMAC-SHA256(body, secret)` in a separate `node -e` process and compared byte-for-byte against the `x-webhook-signature` header the route sent | **PASS** - exact match |
| **Duplicate detection** - same track+email+phone submitted twice within 2 minutes -> first call forwarded and got a reference, second call returned `{ ok: true, duplicate: true, reference: <same reference as the first> }` and the mock receiver's log confirms only ONE webhook delivery occurred | **PASS** - actually observed, not assumed |
| `job-openings` track -> forwards correctly with `roleAppliedFor` populated, same payload shape | **PASS** |

Exact commands are in the "Reproducing these tests" section below.

### What could NOT be tested (no external access)

- Actual delivery to a real Zoho Flow webhook (no Zoho Flow instance
  connected to this session).
- Actual submission into any of the 3 Google Forms via
  `careerApplicationRouter.gs` (Apps Script isn't deployed - see Status
  table).
- Signature verification round-trip against a live Apps Script deployment.
- hCaptcha and hCaptcha-failure paths (no real site/secret key pair
  configured in this environment).

### Full manual test plan (for whoever deploys the Apps Script + Zoho Flow)

Once both are live, verify each track end-to-end:

1. **Apprenticeship** - submit with `trackSlug=apprenticeship`. Expect:
   website returns a `KE-APP-...` reference -> Zoho Flow receives the
   webhook -> Apps Script logs a successful submission -> a new row
   appears in the Apprenticeship form's linked Google Sheet, with the
   reference visible in whichever column it was mapped to.
2. **Industrial Training** - same, `trackSlug=industrial-training`,
   check the Industrial Training sheet.
3. **Internship** - same, `trackSlug=internship`, check the **Internship**
   sheet specifically (previously this track's data would have gone to
   the Industrial Training sheet under the old, now-removed mapping -
   confirm that's no longer happening).
4. **Job Openings** - submit with `trackSlug=job-openings`. Expect: no
   Google Form submission occurs (there isn't one for this track) - the
   Apps Script logs "acknowledging without a form submission" and returns
   `routed: false`.
5. Negative cases from the brief not already covered by the automated
   table above: CAPTCHA failure (needs real hCaptcha keys), Zoho Flow
   unavailable (temporarily disable the Zoho Flow trigger and confirm the
   website's retry-then-502 behavior), Google Apps Script unavailable
   (point `CAREERS_WEBHOOK_URL` at a URL that 404s and confirm the same),
   invalid webhook signature (send a request to the Apps Script URL
   directly with a wrong signature and confirm 401 `invalid_signature`).

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
   `src/content/careerFormRouting.ts` (website side) **and**
   `scripts/google-apps-script/formConfig.gs` (Apps Script side) with the
   real form URL - never guess one.
3. Run `listFormItems()` again to get that form's real field IDs, fill
   them into `formConfig.gs`.
4. If it should route to something other than a Google Form (e.g.
   straight into Zoho CRM/Recruit), that's a Zoho Flow-side branch on
   `trackSlug` - no website or Apps Script change needed, since the full
   payload already reaches Zoho Flow regardless of where Apps Script
   routes it.
5. No code change is needed to the API route itself
   (`src/app/api/careers-application/route.ts`) - it already reads the
   track dynamically from `careers.ts` and doesn't hardcode any track
   name.

## Troubleshooting

- **"Online submission isn't connected yet" shown to applicants** -
  `CAREERS_WEBHOOK_URL` is unset in the current environment (Vercel:
  check Production specifically, not just Preview/Development).
- **Applications arrive at Zoho Flow but never reach a Google Form** -
  check the Apps Script project's **Executions** log for the specific
  invocation. Common causes: `formConfig.gs` still has `REPLACE_ME_*`
  placeholders (nothing gets submitted for that field, but this alone
  won't stop the response from being created - check the log for "Skipping
  unconfigured field" lines to see which ones), or the Web App wasn't
  redeployed as a **new version** after the last code edit.
- **401 `invalid_signature` from the Apps Script URL** - the
  `CAREERS_WEBHOOK_SECRET` Script Property doesn't match the website's env
  var exactly (whitespace, wrong environment). If intentionally testing
  without a secret, remove the Script Property entirely rather than
  setting it to an empty string.
- **A track's applications aren't in the sheet you expect** - see
  "Google Forms" above; confirm you're checking the sheet for the correct
  `trackSlug`, since this exact confusion (Internship vs Industrial
  Training) is the bug this round fixed.
