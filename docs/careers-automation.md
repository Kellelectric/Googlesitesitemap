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
| Google Sheet applicant log (`appendToSheet_` in the Apps Script router) | **IMPLEMENTED as code** - opt-in via a `SPREADSHEET_ID` Script Property; no spreadsheet is created or assumed until that's set |
| Zoho CRM Lead creation (`src/lib/zohoCrm.ts`) | **IMPLEMENTED as code** - direct REST integration (self-client OAuth), independent of Zoho Flow; real "Leads" module confirmed live in the org via `getModules`/`getFields` |
| Slack notification (`src/lib/slackNotify.ts`) | **IMPLEMENTED as code** - Incoming Webhook, one message per application |
| Resend email (`src/lib/resendEmail.ts`) - internal notification + applicant confirmation | **IMPLEMENTED as code** |
| Zoho Flow webhook + routing | **NOT USED** - see "Why a pre-filled link, not Zoho Flow -> Apps Script -> auto-submit" below |
| End-to-end test (website -> pre-filled Google Form link -> applicant completes it -> Sheet) | **PARTIALLY VERIFIED** - `buildPrefillUrl()` output confirmed to carry the right `entry.<id>` params for real, live-inspected forms; an applicant actually completing one end-to-end has not been observed from this session. |
| All 4 direct integrations above (Zoho CRM, Slack, Resend, Sheet log) | **CODE ONLY, UNTESTED END-TO-END** - no live credentials exist in this environment for any of them (see "What could NOT be tested" below). Each is independently env-var gated and no-ops safely when unset. |

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
  +-- apprenticeship / industrial-training / internship / nysc-placement:
  |     buildPrefillUrl() (src/content/careerFormRouting.ts) builds a
  |     Google Forms pre-filled link for that track using real
  |     entry.<itemId> values, and the response hands it back as
  |     `redirectUrl`. Rather than sending the applicant off-site,
  |     /careers/thank-you EMBEDS that pre-filled form directly on the
  |     page (src/components/careers/EmbeddedApplicationForm.tsx, iframe
  |     with ?embedded=true) so they never leave kellelectricals.com.
  |     markPendingCareerApplication() (src/lib/kv.ts, Redis-backed)
  |     stashes the applicant's details, keyed by reference, since the
  |     initial response never carries their email/name back to the
  |     browser. CAREERS_WEBHOOK_URL, if set, also gets a best-effort
  |     (non-blocking) copy of the payload for internal notification/Sheet-
  |     log purposes only - it no longer sends the applicant any email for
  |     this path (see careerApplicationRouter.gs's own header note).
  |     Applicant finishes the form in the embed (required photo/ID/CV
  |     uploads, DOB, consent, signature) -> Google Forms writes the row
  |     to that form's own linked Sheet AND reloads the iframe to its own
  |     confirmation page. The site detects that reload (the iframe's
  |     second `load` event - the strongest signal available without
  |     reading its cross-origin contents) and calls
  |     POST /api/careers-application/form-submitted with the reference,
  |     which looks up the stashed details and sends the applicant an
  |     "application received" email via Resend - the same one the
  |     on-site-only tracks get immediately, just deferred until they've
  |     actually finished applying.
  |
  +-- job-openings / nysc-placement (no Google Form):
        forwarded to CAREERS_WEBHOOK_URL (required for this path -
        signed, retried on 5xx) for whatever downstream handling the
        client wants (a tracking Sheet, Zoho CRM, email, etc.)

  +-- (every track, in parallel with the above, each independently
        env-var gated - see "Direct integrations" below):
        -> Zoho CRM: creates a Lead        (src/lib/zohoCrm.ts)
        -> Slack: posts a notification     (src/lib/slackNotify.ts)
        -> Resend: internal + applicant
           confirmation email              (src/lib/resendEmail.ts)
      All three are fire-and-forget - a failure is logged server-side,
      never surfaced to the applicant and never blocks their own
      success response.
```

## Direct integrations (Zoho CRM, Slack, Resend, Sheet log)

Four integrations run directly from the website's API route (or, for the
Sheet log, from the existing Apps Script webhook) - independent of
`CAREERS_WEBHOOK_URL`/Zoho Flow, and independent of each other. Each is
purely additive: leave its env vars unset and it's a no-op, exactly like
every other optional feature in this codebase (Paystack, Google Calendar
booking, etc.).

### Zoho CRM - creates a Lead per application

`src/lib/zohoCrm.ts` posts directly to Zoho CRM's REST API using a
self-client OAuth refresh-token flow (no SDK, no Zoho Flow hop). The real
Leads module in the client's own Zoho CRM org (confirmed live via
`getModules`/`getFields` - standard `Leads`, not a custom "Candidates"
module, since none exists) receives one Lead per application: name, email,
phone, `Designation` (role/track), and a `Description` containing the
reference, track, role, institution, CV link, and the applicant's message.
`Lead_Source` is deliberately left unset - none of the org's real picklist
values ("Web Download", "Web Research", etc.) accurately describes "the
on-site careers form," and guessing one would misrepresent the source in
reporting.

Setup:

1. [api-console.zoho.com](https://api-console.zoho.com) -> **Add Client**
   -> **Self Client**.
2. Generate a code with scope `ZOHOCRM.modules.leads.CREATE` (10-minute
   validity - use it right away in the next step).
3. Exchange it once for a refresh token:
   ```bash
   curl -X POST https://accounts.zoho.<dc>/oauth/v2/token \
     -d client_id=<CLIENT_ID> \
     -d client_secret=<CLIENT_SECRET> \
     -d code=<GRANT_CODE> \
     -d grant_type=authorization_code
   ```
   The response's `refresh_token` is a one-time value - store it
   immediately (Zoho does not show it again).
4. Set `ZOHO_CRM_CLIENT_ID`, `ZOHO_CRM_CLIENT_SECRET`,
   `ZOHO_CRM_REFRESH_TOKEN`, and `ZOHO_CRM_DC` (the account's data-center
   domain suffix, e.g. `com`, `eu`, `in`) in Vercel's Production
   environment.

### Slack - one message per application

`src/lib/slackNotify.ts` posts to a Slack **Incoming Webhook**. Setup:
Slack -> **Apps** -> search "Incoming Webhooks" -> **Add to Slack** -> pick
a channel -> copy the generated URL into `CAREERS_SLACK_WEBHOOK_URL`.

### Resend - internal notification + applicant confirmation

`src/lib/resendEmail.ts` sends two independent emails via the [Resend
API](https://resend.com):

- **Internal notification** (`sendInternalNotificationEmail`) - to
  `CAREERS_NOTIFY_EMAIL`, on every application, every track. Requires
  `RESEND_API_KEY` + `CAREERS_FROM_EMAIL` + `CAREERS_NOTIFY_EMAIL` all set.
- **Applicant confirmation** (`sendApplicantConfirmationEmail`) - fires
  from two places now: immediately, for tracks with **no** Google Form
  (`job-openings`); and from `POST /api/careers-application/form-submitted`
  for the 4 Google-Form-backed tracks, once the applicant finishes the
  form embedded on `/careers/thank-you` (see the flow diagram above).
  Requires `RESEND_API_KEY` + `CAREERS_FROM_EMAIL` either way; the embedded-
  form path additionally requires `UPSTASH_REDIS_REST_URL`/
  `UPSTASH_REDIS_REST_TOKEN` (src/lib/kv.ts) to stash the applicant's
  details between the two requests - without Redis, that email is simply
  never sent (no error, no duplicate; the on-page confirmation still
  shows).

**Duplicate-email warning**: the Apps Script webhook
(`careerApplicationRouter.gs`), if `CAREERS_WEBHOOK_URL` is configured,
still sends its own "received" confirmation via `MailApp` for
`job-openings` (its `sendContinueApplicationEmail_` for the 4 Google-Form
tracks is no longer called from `doPost` - see that file's header note,
since the website's embedded-form flow now owns that email). That leaves
one remaining overlap: for `job-openings`, both `MailApp` (Apps Script) and
Resend can send a "received" email if both are configured at once. Pick
one: either leave `RESEND_API_KEY` unset and keep using the Apps Script's
`MailApp` send, or set it and remove the `sendApplicantConfirmationEmail_`
call from `careerApplicationRouter.gs`. The internal-notification email has
no such overlap - nothing else currently sends one.

Setup: create a Resend account, verify a sending domain (or use Resend's
own test sender while developing), create an API key, then set
`RESEND_API_KEY`, `CAREERS_FROM_EMAIL` (a verified sender address), and
`CAREERS_NOTIFY_EMAIL` (where internal notifications land).

### Provisioned this session (real, live resources - not invented)

- **Resend**: `kellelectricals.com` was already a verified sending domain
  in the client's Resend account. A dedicated, sending-only API key named
  "Careers Application Pipeline" was created scoped to that domain. The
  key itself was shown once to the user in chat and is not stored in this
  repo - set it as `RESEND_API_KEY` in Vercel directly.
- **Google Sheet**: created at
  `https://docs.google.com/spreadsheets/d/1LmCOGdVL8x2RPI0rHAtqsTi1n1ZX4AtllTkO2Rj69Bc/edit`,
  already owned by `kellelectricals@gmail.com` (same account the Apps
  Script router deploys under - no sharing step needed). Set
  `SPREADSHEET_ID=1LmCOGdVL8x2RPI0rHAtqsTi1n1ZX4AtllTkO2Rj69Bc` as a Script
  Property once the updated `careerApplicationRouter.gs` (with
  `appendToSheet_`) is redeployed.
- **Zoho CRM self-client** and **Slack Incoming Webhook** were NOT
  provisioned this session - both require a manual step in each service's
  own console under an account this session doesn't have access to
  (Zoho's API Console, Slack's App directory). See their setup steps
  above.

### Google Sheet applicant log

Extends the already-deployed Apps Script webhook rather than adding a new
one - `appendToSheet_()` in `careerApplicationRouter.gs` appends one row
per acknowledged application (every track) to an "Applications" sheet,
using the exact column set recommended earlier in this doc. Opt-in: set a
`SPREADSHEET_ID` Script Property (the ID from the sheet's URL, between
`/d/` and `/edit`) in the same Apps Script project already handling
`CAREERS_WEBHOOK_URL`. The "Applications" tab (with a frozen header row)
is created automatically on the first application received after this is
set - no manual sheet setup needed beyond creating the spreadsheet itself
and copying its ID.

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
- `ZOHO_CRM_CLIENT_ID` / `ZOHO_CRM_CLIENT_SECRET` / `ZOHO_CRM_REFRESH_TOKEN`
  / `ZOHO_CRM_DC` - direct Zoho CRM Lead creation, all four required
  together. See "Direct integrations" below.
- `CAREERS_SLACK_WEBHOOK_URL` - direct Slack notification per application.
- `RESEND_API_KEY` / `CAREERS_FROM_EMAIL` / `CAREERS_NOTIFY_EMAIL` - direct
  email (internal notification + applicant confirmation). See the
  duplicate-email warning under "Direct integrations" before setting this
  alongside an already-configured `CAREERS_WEBHOOK_URL`.

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
- **The 4 direct integrations (Zoho CRM, Slack, Resend, Sheet log) end-to-
  end** - `npx tsc --noEmit` and `npm run build` pass with them wired in,
  and each function's request shape was built directly from confirmed-live
  schema (`getModules`/`getFields` against the client's actual Zoho CRM
  org for the Leads-module mapping), but no live `ZOHO_CRM_*`,
  `CAREERS_SLACK_WEBHOOK_URL`, `RESEND_API_KEY`, or `SPREADSHEET_ID` exists
  in this environment to exercise a real request against. Before relying
  on any one of them, set its env var(s) in a non-production environment
  and submit one real test application per track, then confirm: a Lead
  appears in Zoho CRM, a Slack message arrives, the emails send, and/or a
  row appears in the Sheet.

### Full manual test plan (client-run, one pass before announcing live)

1. **Apprenticeship / Industrial Training / Internship / NYSC Placement** -
   submit the on-site form for each track. Expect: website redirects to
   `/careers/thank-you`, which embeds the real Google Form (Full
   Name/Email/Phone, and Institution where mapped, already filled in)
   directly on the page -> complete the remaining required fields (photo,
   DOB, consent, signature, etc.) and submit inside the embed -> confirm
   (a) a new row appears in that form's own linked Google Sheet, (b) the
   page swaps to the "Application received" panel without a full
   navigation, and (c) an "application received" email arrives at the
   applicant's address (requires `UPSTASH_REDIS_REST_URL`/
   `UPSTASH_REDIS_REST_TOKEN` and `RESEND_API_KEY`/`CAREERS_FROM_EMAIL` set
   - without Redis configured, the on-page confirmation still shows, just
   without the email, since there's nowhere to durably stash the
   applicant's details between the two requests).
2. **Job Openings** - submit with `trackSlug=job-openings`. Expect: no
   Google Form embed (there isn't one for this track) - if
   `CAREERS_WEBHOOK_URL` is set, confirm the configured downstream
   (tracking Sheet, Zoho CRM, etc.) received it; if unset, confirm the
   applicant sees the "email/call us instead" fallback rather than a
   silent failure.
3. Negative cases: Apps Script webhook unavailable for `job-openings`
   (point `CAREERS_WEBHOOK_URL` at a URL that 404s, confirm the
   retry-then-502 behavior), invalid webhook signature (send a request to
   the Apps Script URL directly with a wrong signature and confirm 401
   `invalid_signature`), and `POST /api/careers-application/form-submitted`
   with a made-up/expired reference (expect a plain `{ok:true}` with no
   email sent, never an error).

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
