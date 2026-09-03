# Next Steps

## `/about` page rewritten with the client's real copy (this round)

The client supplied a full rewrite of `/about`'s body content in the
company's real voice, replacing the earlier generic descriptions.
Mapped onto the existing page structure (`src/app/about/page.tsx`) -
same components/layout, new text:

- **Who we are** - now states the real registration framing ("RC
  1852579... accountable to a body that can actually check our work")
  in place of the earlier generic paragraph.
- **The problem we solve** - new section, didn't exist before.
- **Our mission** - shortened to the client's real one-line mission
  ("Do the job once, do it right, and don't make you think about it
  again."). Our Vision (in the same tinted box) is unchanged - no
  replacement text was supplied for it.
- **What we stand for** (was "Our values") - replaced the earlier
  5-item list with the client's real 4-point list (`whatWeStandFor` in
  page.tsx).
- **What makes us different** (was "Competitive advantages") -
  replaced the earlier 4-card grid with the client's real narrative
  copy, rendered as paragraphs rather than forced into a card format
  so the wording stays exactly as given.
- **Why clients trust us** - new section, didn't exist before.

**Additional named clients**: this rewrite's "What makes us different"
section names **Manreng Estate** and **Navy Holdings**, alongside
**CBN Headquarters** and **Kaduna State Government House** already
named in `ceoMessage.ts` (see that entry below). All four are now
public-facing on `/about` - same flag as before: confirm Kell has
clearance to publicly reference these four clients, since `projects.ts`'s
case studies deliberately avoid naming any client anywhere else on the
site.

Untouched (no replacement copy was supplied): Our Vision, Our
Expertise ("Four functions, one process"), Our Process, the team
roster, the milestone timeline, Service Coverage, and Credentials
sidebar.

## Production hardening audit: two open items resolved by the client (this round)

- **Team experience figure: 15+ years is correct, not 20+.** A prior
  production-hardening request asked to standardize the whole site on
  "20+ years." The client explicitly reconfirmed **15+ is correct** -
  `company.teamExperienceYears` stays at 15 (already the case; no code
  change needed). This is now confirmed twice by the client (first when
  it was corrected from 20 to 15 per their own site audit, now again
  here) - do not change this figure again without a new, explicit
  client instruction.
- **CEO message on `/about`: now finalized with Gabriel's real words,
  supplied directly by the client.** `src/content/ceoMessage.ts` no
  longer holds the AI-drafted placeholder - it's Gabriel's actual
  message as given, disclaimer comment removed. Worth flagging: this
  message names **CBN Headquarters** and **Kaduna State Government
  House** as past projects - the only place on the site that names
  specific institutional clients (`projects.ts`'s case studies
  deliberately avoid naming any client, per that file's own stated
  policy). Confirm this naming is intentional and Kell has clearance
  to publicly reference these two clients before this goes live, if
  that hasn't already been considered.

## Pricing moved into the booking flow + Paystack payment gate (this round)

**Pricing only shows while booking, gated by service type** —
per client direction, pricing is no longer a page section anyone can
browse. `/book-appointment`'s booking widget (`BookingWidget.tsx`) now
opens with "Step 1 - What do you need service for?": Residential /
Commercial / Industrial / Electrical Inspection & Audit. A price only
appears once a category is picked (and, for Residential, an area and
report-choice too) - the standalone `InspectionPricing.tsx` section/
component is deleted, its pricing logic lives in
`src/content/inspectionPricing.ts` and is now driven entirely by that
first booking step.

**Payment confirms the appointment, where a real fee applies** — the
client asked for payment to validate the appointment. Only the
residential near tier resolves to one exact number (₦70,000 or
₦100,000, depending on the report choice); everything else (the
residential far tier, commercial, industrial, electrical audit) is
priced as a range, so there's no single figure to charge upfront for
those - they still book directly, with the real fee settled after
scoping/on-site, same as before this round. Flag this to the client if
a different behavior was intended for the range-priced categories
(e.g. charging the range's low end as a deposit).

Built with **Paystack** (per the client's choice) via
`src/lib/paystack.ts` and a payment step inserted into `BookingWidget.tsx`
between entering details and final submission, whenever an exact price
applies. The flow: the visitor pays via Paystack's inline checkout
popup (`https://js.paystack.co/v1/inline.js`) → the reference it
returns is sent to `/api/book` → the server independently re-verifies
that reference against Paystack's own API (status, amount in kobo,
currency) via `verifyPaystackTransaction` *before* creating the
calendar event - the client-side "payment succeeded" callback is never
trusted on its own. **Inert until configured**, same pattern as every
other integration here: set

- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - the Paystack public key, used
  client-side to open the checkout popup.
- `PAYSTACK_SECRET_KEY` - the Paystack secret key, used server-side to
  verify transactions. Never expose this one client-side.

Until both are set, the booking flow works exactly as it did before
payment existed (no payment step is ever shown, even for the
residential near tier).

## Real inspection pricing filled in (client-confirmed figures)

Pricing figures now used throughout (`src/content/inspectionPricing.ts`):

- **Residential** (per area, click-to-expand accordion): Wuse, Wuse 2,
  Gwarinpa, and Maitama were given directly by the client as the
  "near/within town" tier - ₦70,000 without an inspection report,
  ₦100,000 with one. The other 12 areas were split between that same
  near tier and a >15km tier (₦100,000-₦150,000) using Claude's own
  geographic grouping (Central Business District, Garki, Asokoro,
  Utako, Jabi, Katampe, and Guzape as near; Kubwa, Lugbe, Life Camp,
  Apo, and Lokogoma as >15km), which the client explicitly confirmed
  as correct.
- **Commercial**: ₦80,000-₦800,000, flat (not area-based).
- **Industrial**: ₦300,000-₦800,000, includes a full inspection
  report, flat.
- **Electrical inspection & audit** (the more comprehensive offering,
  distinct from a standard inspection): from ₦300,000-₦2,000,000,
  includes an electrical plan, flat.

This replaces the earlier round's placeholder "building audit is
priced per property, custom quote" framing with these real ranges.

**Career applications** (`/careers/[slug]`) — the external "Apply via
Google Form" redirect is replaced with a form built into the site
(`src/components/careers/CareerApplicationForm.tsx`), submitted via
`/api/careers-application` and forwarded to a configurable webhook set
via `CAREERS_WEBHOOK_URL` (same pattern as `QUOTE_WEBHOOK_URL` - point it
at Zapier/Make/Zoho Flow to land in a Google Sheet or wherever). Same spam
protections as the quote form (honeypot, time-trap, rate limit, optional
hCaptcha via the same `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`/`HCAPTCHA_SECRET_KEY`
pair). A new `/careers/thank-you` page confirms submission, mirroring
`/contact/thank-you`.

**Not yet done — needs the client's help to finish**: the client asked for
submissions to also land in the same Google Forms already in use per
track, not just a new destination. I attempted to pull each form's real
field structure myself (so nothing further would be needed from the
client) by fetching the live Google Form pages directly, but this
session's sandboxed network blocks/resets connections to
`docs.google.com` and `accounts.google.com`, so that wasn't possible here.

Also worth flagging: `src/content/careers.ts`'s `applicationFormUrl`
values show only **3 distinct Google Forms across the 5 tracks** -
`nysc-placement` and `job-openings` share one URL, and `internship` and
`industrial-training` share another. Confirm whether that's intentional
(one shared form covering multiple tracks) before treating it as a bug.

To wire real submissions into an existing Google Form, the fastest path
that needs no API credentials: open that Google Form → the 3-dot menu →
"Get pre-filled link" → fill every question with a placeholder answer →
copy the resulting URL. That URL contains each question's real
`entry.XXXXXXX` field ID. Send those 3 pre-filled links (one per distinct
form) and the exact question each `entry.` ID corresponds to, and the
application form can be wired to submit into those same Forms/response
sheets directly, in addition to (or instead of) `CAREERS_WEBHOOK_URL`.

## Back on Botpress for now - Zoho SalesIQ needs a paid subscription (this round)

The Zoho SalesIQ switch (previous round) is reverted at the site level:
`src/app/layout.tsx` renders the Botpress `<Script>` tags again, since the
client doesn't have a paid Zoho SalesIQ subscription yet (required to
actually use the bot). Nothing was deleted - `src/components/chat/
ZohoSalesIQ.tsx` and `docs/zoho-salesiq-zobot.md` (full conversation
design + Deluge script + real Zoho CRM `Leads` field mappings) are both
still in the repo, ready to swap back in the moment a subscription exists:
restore the `<ZohoSalesIQ />` import/render in `layout.tsx` in place of the
Botpress `<Script>` tags, and set `NEXT_PUBLIC_ZOHOSALESIQ_WIDGET_CODE`.

The client has also started building the bot directly in Zoho SalesIQ's
own **Answer Bot** visual flow builder (Button Cards: one message + up to
10 buttons per card) rather than the Deluge script route - a full card-by-
card message/button breakdown matching that builder was given in-session,
distinct from the script in `docs/zoho-salesiq-zobot.md`. That card
breakdown isn't saved to a repo file since it's just a way of typing into
the SalesIQ UI, not code - reference this session's transcript if it needs
regenerating, or ask for it again once the subscription is active.

## Zoho SalesIQ Zobot replaces the Botpress trial (earlier round)

The client decided: Zoho SalesIQ wins over the Botpress trial embed.
`src/app/layout.tsx` now renders `<ZohoSalesIQ />`
(`src/components/chat/ZohoSalesIQ.tsx`) instead of the Botpress `<Script>`
tags - inert until `NEXT_PUBLIC_ZOHOSALESIQ_WIDGET_CODE` is set, same
pattern as every other integration here. The full bot design (conversation
flow for website visitors/customers, job applicants across all 5 careers
tracks, and general inquiries), a complete copy-paste Deluge script with
buttons at every step, real Zoho CRM `Leads` field mappings (verified via
the CRM's own field metadata, not guessed), and the step-by-step Zoho
SalesIQ dashboard setup are all in **`docs/zoho-salesiq-zobot.md`** - I
can't configure SalesIQ itself from here (no API access to it, unlike Zoho
CRM), so that doc is the complete handoff.

## On-site appointment booking, backed by Google Calendar (this round)

`/book-appointment` now has a custom-built date/time picker
(`src/components/booking/BookingWidget.tsx`) instead of an embedded
Google-hosted calendar page — visitors never see or get redirected to
Google's own UI. It reads real availability from, and writes real events
to, the business's actual Google Calendar via a service account (no
`googleapis` dependency — `src/lib/googleCalendar.ts` implements the
JWT-bearer OAuth2 flow directly with `node:crypto` and `fetch`, matching
this codebase's existing preference for hand-rolled REST over adding an
SDK).

**Inert until configured** — until then, the widget silently falls back
to embedding the original Google-hosted booking page (`company.bookingUrl`
in `content/company.ts`), so the page keeps working during setup:

1. In Google Cloud Console, create a project (or reuse one), enable the
   **Google Calendar API**, then create a **Service Account** under
   IAM & Admin → Service Accounts.
2. Open that service account → Keys → Add Key → Create new key → JSON.
   Download it.
3. In Google Calendar, open the calendar to book against → Settings and
   sharing → "Share with specific people" → add the service account's
   email (from the JSON, `client_email`) with **"Make changes to
   events"** permission.
4. Set these in the Vercel deployment environment, from that same JSON
   file:
   - `GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL` — the `client_email` field.
   - `GOOGLE_CALENDAR_PRIVATE_KEY` — the `private_key` field, pasted as-is
     (its literal `\n` sequences are unescaped in code, the standard
     pattern for private keys in env vars).
   - `GOOGLE_CALENDAR_ID` — the calendar's ID (usually just the Google
     account's email address once shared as above).
   - `GOOGLE_CALENDAR_TIMEZONE` (optional) — defaults to `Africa/Lagos`.

Slots are generated from `company.businessHours` (`src/lib/bookingSlots.ts`,
60-minute slots, 2-hour minimum lead time, bookable up to 21 days out —
all adjustable constants in that file), narrowed against the calendar's
real `freeBusy` response, and re-checked once more at booking time to
close the race window between two visitors viewing the same open slot.
Same spam protections as the quote form (honeypot, time-trap, per-IP
rate limit, optional hCaptcha via the same `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
/`HCAPTCHA_SECRET_KEY` pair). A successful booking is also best-effort
forwarded to `QUOTE_WEBHOOK_URL` if set, so it shows up alongside quote
leads in whatever CRM that points at — this never blocks or fails the
booking itself.

## Sitewide title/meta-description length audit (earlier round)

Wrote `scripts/audit-seo.mjs` — a production-server crawl of every URL in
`sitemap.xml` checking title/description length against Google's real
display budgets, canonical/H1 presence, and broken internal links. First
run: 24 of 58 pages over/under budget, 0 broken links. All fixed; re-run
after confirmed clean (0 issues). Re-run this after adding new content —
it's a real dev tool now, not a one-off script (`npm run build && npm run
start -- -p 3999 &` then `PORT=3999 node scripts/audit-seo.mjs`).

- New optional `seoTitle` on `Article` (resources.ts) and `Service`
  (services.ts) — used only for the `<title>` tag, never the on-page
  H1/heading, which stays exactly as-is. Set for the 9 resource articles
  and 2 services whose full descriptive title (plus the unavoidable
  `" - Kell Electricals Ltd"` suffix Next.js's title template adds to
  every page) ran past 60 characters.
- Trimmed 11 hub-page meta descriptions to fit the ~160-char cutoff —
  wording only, no facts removed or added.
- **Real bug found and fixed**, not just a length issue: `/about`'s meta
  description was hardcoded `"20+ years of combined engineering
  experience"` — stale copy left over from before `company.
  teamExperienceYears` was corrected to 15 in an earlier round (see that
  round's note above). Every other one of the ~14 places this figure
  appears sitewide already correctly used the live variable; this was
  the one that got missed. Now a template literal referencing the same
  field, so it can't drift out of sync again.
- `/careers/job-openings` had an oddly terse 42-char summary versus the
  other 3 tracks' 130-150 char ones — rewrote using only the real fact
  already stated in that page's own body copy (no live job board, apply
  via the form even for unlisted roles).
- `/electrician/[area]`: dropped the redundant trailing "from Kell
  Electricals" from the shared description template, and used "CBD" —
  the genuinely common local shorthand for Central Business District,
  not an invented abbreviation — in the `<title>` tag only for that one
  area (the one whose full name doesn't fit); its on-page H1 still reads
  "Central Business District" in full, unchanged.

## Speed Insights, PWA manifest, structured data, favicon (this round)

Continuing improvements while domain attachment stays on hold per the
client's instruction ("leave domain set up for now").

- **Vercel Speed Insights** — `@vercel/speed-insights` wired into
  `layout.tsx`. No-op until the app is actually deployed to Vercel and
  visited; gives real-user Core Web Vitals in the Vercel dashboard once
  live, distinct from synthetic Lighthouse runs.
- **`docs/local-seo-citations.md`** — a standardized NAP (Name/Address/
  Phone) block plus a prioritized, individually-verified (via live web
  search, not memory) list of real local-SEO directories: NEMSA's actual
  public contractor directory, COREN's verification portal,
  ConnectNigeria, Abuja Galleria. Off-site work — no submissions were
  made, this just gives whoever manages listings a ready reference.
  Deliberately excludes low-quality "SEO backlink package" directories.
- **`src/app/manifest.ts`** — the site had no PWA manifest at all (no
  add-to-homescreen support). Uses the existing `public/brand/icon-192.png`
  /`icon-512.png` and the real brand colors (`#13322C` petrol, `#F7F5F0`
  paper) — no new artwork.
- **`src/app/favicon.ico`** — also entirely missing; some crawlers/older
  browsers still request this path specifically regardless of the
  `<link rel="icon">` tag. Generated a real 16/32/48px multi-resolution
  `.ico` from the existing `icon-192.png` (no new artwork), verified it
  coexists correctly with the existing PNG icon/apple-touch-icon link
  tags rather than overriding them.
- **`localServiceSchema()`** (new, in `lib/schema.ts`) — `/electrician/
  [area]` and `/industries/[slug]` previously only emitted `BreadcrumbList`
  JSON-LD despite both being genuinely service-focused pages; the existing
  `serviceSchema()` is shaped for the 16 individual `/services/[slug]`
  pages specifically (slug → URL), so a new function was added rather than
  overloading that one. Area pages get a `Service` scoped to that single
  area (`areaServed: [area.name]`); industry pages reuse the real,
  already-written `industry.description` field verbatim — no new copy
  invented anywhere. Verified all four JSON-LD blocks (Organization,
  Breadcrumb, Service, FAQPage) parse correctly on both page types via a
  production server + `curl`.

Considered and deliberately skipped this round: adding `AggregateRating`
to the new `Service` schema entries — duplicating the same org-level
4.8★/192-review rating across dozens of area/industry pages reads as
manipulative to Google, not additive; the single canonical rating on
`organizationSchema()` is the correct pattern and already exists. Also
held off on writing a new `/resources` article speculatively — the
existing 9 already cover the site's core technical topics without
overlap, and a 10th needs a genuine content gap identified, not just
inventing one to hit a number.

## Fixed: hero content invisible on first load (this round)

Client-reported bug: on a fresh page load, the homepage hero's headline,
eyebrow badge, buttons, and stats row were completely invisible (only the
background photo showed) until navigating to another page and back. Root
cause confirmed via SSR HTML inspection: `Hero.tsx`'s `motion.div` used
`initial={reduceMotion ? undefined : 'hidden'}`, so Framer Motion baked
`style="opacity:0"` directly into the server-rendered markup for every
hero element, and the fade-in animation only ran once client-side JS
finished hydrating. Any delay or hiccup in hydration on the initial load
left the hero permanently invisible; a client-side navigation (which
reuses an already-hydrated page) masked the bug entirely, matching the
report exactly.

Fixed by changing `initial='hidden'` to `initial={false}` on the hero's
motion wrapper — this is above-the-fold, most-important content, so it
should never depend on JS for basic visibility. With `initial={false}`,
Framer Motion skips applying the hidden variant during SSR entirely;
verified via `curl` that the server-rendered `<h1>` now has
`opacity:1;transform:none` baked in from the start, with no animation
gamble. Scroll-triggered reveal animations elsewhere on the page
(`Reveal`/`StaggerGroup`, using `whileInView`) are unaffected and still
correctly fade in — those are lower-risk since hydration has virtually
always finished by the time a user scrolls that far down.

Separately, found (via `get_project_deployment_protection`) that Vercel
Authentication (SSO protection) was enabled for all deployment URLs
except a custom domain — and since no custom domain is attached yet,
every URL including the ones being tested required a Vercel login,
which is what caused the "shows me to login" report in an incognito
window. Disabled it via `update_project_deployment_protection`
(`ssoProtection: {enabled: false}`) so the site is now publicly viewable
at its `.vercel.app` URLs without authentication. Re-enable this (or
just attach the real custom domain, which bypasses it anyway) once
launch is closer if the site shouldn't be publicly crawlable/visible
yet — right now nothing is blocking public access.

## Patched nanoid (this round)

`npm audit` flagged 6 high-severity advisories. 5 of them (Next.js itself,
and `glob`/`@next/eslint-plugin-next` via the ESLint config) only have a
fix through a Next.js 15/16 major upgrade — already documented as
deliberately deferred in the "Dependency note" below, since none of the
underlying features (Middleware, Server Actions, custom Image
Optimization remote patterns) are used here. The 6th, `nanoid` (a
transitive dependency of PostCSS, used only at build time — not part of
the runtime attack surface), had a non-breaking fix available via `npm
audit fix` (no `--force`). Applied it: `package-lock.json` only,
`nanoid` 3.3.17 → 3.3.18, no `package.json` change. Down to 5 remaining
advisories, all still gated on the same deferred major upgrade.

## Security headers added (this round)

`next.config.js` had no security headers at all. Given the quote form
collects real contact details (name, phone, email, project details), added
the standard baseline via `headers()`, applied to every route:
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (nothing on
this site needs to be iframe-embedded elsewhere), `Referrer-Policy:
strict-origin-when-cross-origin`, `Permissions-Policy` denying
camera/microphone/geolocation (none are used anywhere on the site), and
`Strict-Transport-Security` (HSTS, 2-year max-age with subdomains and
preload — safe since the whole site is served over HTTPS via Vercel).
Verified via `curl -I` that all five headers render, and re-ran a full
Lighthouse pass to confirm nothing regressed (Best Practices still 100).
Did a broader accessibility/SEO regression sweep across 18 pages while at
it — everything is 100/100 except the two pages already intentionally
`noindex` (`/legal/terms`, `/projects`), so the one bug caught and fixed in
the previous round was the only real regression out there.

## Accessibility regression fixed: calculator components (this round)

Re-ran a Lighthouse pass across the site after several rounds of new
content and found `/calculators` had dropped to 95 accessibility (home,
about, and the new resource article all still scored 100). Two real
findings in `LoadCalculator.tsx`/`SolarSizingCalculator.tsx`:
- `text-ink/50` (3.4:1 on Paper) failed WCAG AA's 4.5:1 minimum for small
  text — same category of bug fixed sitewide in an earlier round, just
  introduced fresh in these two newer components. Bumped to `text-ink/60`
  (4.64:1), matching the precedent set elsewhere in the codebase.
- Both components used an `h3` for their card heading with no `h2`
  anywhere before them on the page (a heading-order/skip violation).
  Changed both to `h2`, matching how every other section component's
  heading sits directly under the page's `h1`.
Verified via Lighthouse: `/calculators` and `/` (which also embeds
`SolarSizingCalculator`) both back to 100/100 accessibility.

## FAQ section added to /calculators (this round)

`/calculators` was the only remaining hub-style page without an FAQ
section (services, industries, and the service/industry detail templates
all got one in an earlier round). Added `calculatorsFAQs` to
`src/content/faqs.ts` (4 questions) using the reusable `FAQSection`
component — same `FAQPage` JSON-LD pattern as elsewhere. Content is
policy/methodology only, no invented facts: what the tools' output does
and doesn't represent, the exact assumptions cited in
`src/lib/calculatorMath.ts` (80% DoD, 90% round-trip efficiency, ~75%
system losses, ~5 peak sun hours), and why the load calculator applies a
25% safety margin.

## New resource article: generator sizing (this round)

Added a 9th `/resources` guide, `how-to-size-a-backup-generator`
(category `Solar & Energy`, matching `generator-vs-solar-vs-hybrid`'s
category). This closes a real content gap: the existing generator
content compares generator/solar/hybrid as backup options, and the
inverter-sizing guide covers hybrid systems, but nothing on the site
explained how to size a generator itself. Covers kVA vs. kW (power
factor), starting/surge current vs. running load (the usual cause of
"correctly sized on paper, trips anyway" installs), the real cost of
oversizing (wet-stacking, inefficiency), and fuel type as a sizing input
rather than an afterthought. Generic engineering knowledge only, same
register as the other 8 articles — no company-specific claims. Cross-links
to `generator-installation-maintenance`, `energy-audits`, and
`preventive-maintenance-contracts` via `relatedServiceSlugs`.

## Client portal / electronic invoicing (previous round)

Added a real capability, confirmed directly by the client: Kell
Electricals offers clients a portal for electronic invoices and quote
approval, plus project tracking from anywhere in the world. No portal
login URL or platform name was supplied, so the CTA points to `/contact`
("Get Set Up") rather than a direct login link — do not invent one.
- `src/content/clientPortal.ts` — the copy, with a header comment noting
  this is a real, client-confirmed capability, not invented.
- New homepage section `ClientPortalFeature` (between Trust and Team
  preview, breaking up what was becoming a long run of light sections).
- Added FAQ: "Can I manage my project if I'm not in Nigeria?" under the
  General category.
- Added a bullet to `/about`'s "Why choose us" list.

## Fixed: oversized mobile testimonial cards

`TestimonialCarousel`'s track was a flex row with no `align-items`
override, so it used flexbox's default `stretch` — every card in the
entire (doubled, for the seamless loop) set stretched to match the
height of the single longest testimonial anywhere in the carousel. On
mobile, where one card fills most of the viewport, a short review (e.g.
Kelechi Nnajiofor's 2-line review) rendered with a huge empty gap below
the text before the name/badge footer, because it had inherited the
height of a much longer review elsewhere in the loop. Fixed by adding
`items-start` to the track, so each card now sizes to its own content.
`TestimonialGrid` didn't have this bug (CSS grid's per-row stretch only
matches cards in the same row, and mobile is single-column there anyway).

## CEO message, homepage expansion, and calculators (this round)

- **CEO message — DRAFT, pending Gabriel's sign-off.** `src/content/
  ceoMessage.ts` holds a placeholder founder's message on `/about`,
  written by request ("draft a placeholder for review") since no real
  message from Gabriel was supplied. The file's header comment marks it
  loudly as not his actual words — uses only facts already established
  elsewhere (2010 founding, COREN/NEMSA, documented-process values) but
  the phrasing itself is AI-drafted. **Get Gabriel's sign-off (or his
  real words) before treating this as final; don't leave it live
  indefinitely unreviewed.**
- **Mission/Vision** — already existed on `/about` (not rebuilt); confirmed
  still present and unchanged.
- **Homepage expanded** with two new real-content sections (no invented
  facts): `TeamPreview` (photo grid of all 6 team members, links to
  `/about`) and `AreasPreview` (links to all 7 `/electrician/[area]`
  pages), plus the new embedded Solar Sizing Calculator (below). Section
  order: Hero → Stats → Services → Solar feature → **Solar calculator** →
  Process → Industries → **Areas** → Trust → **Team** → Testimonials →
  Partners → CTA.
- **New: Load & Solar Sizing Calculators** (`/calculators`, plus the
  Solar Sizing Calculator embedded directly on the homepage per request).
  Two client-side tools, `src/components/calculators/`:
  - **Solar Sizing Calculator** — user enters critical load (W) and
    desired backup hours, gets an indicative battery (kWh), panel array
    (kW), and minimum inverter size. Deliberately different from the
    "solar savings calculator" already rejected earlier this session:
    this one only uses physics/engineering constants (Abuja's ~5 average
    peak sun hours, 80% battery depth-of-discharge, ~75% system
    efficiency — all cited in `src/lib/calculatorMath.ts`), never an
    assumed electricity tariff or a ₦ savings figure, so it doesn't
    contradict `/solar-energy-systems`'s "measured, not estimated"
    positioning — it's explicitly framed as a rough starting point, with
    a link to that page's real methodology and a "request a sizing
    consultation" CTA.
  - **Load Calculator** — user picks a building type (apartment, house,
    office, retail, workshop) and gets a pre-filled, fully editable
    appliance checklist (generic, publicly known typical wattages, see
    `src/content/calculators.ts` — not Kell-specific data) that sums to
    a total connected load and a recommended minimum inverter/generator
    size (with a standard 1.25× safety margin for motor start-up).
  - Both tools are explicitly labeled as indicative planning estimates
    throughout, not a quote or a substitute for a real load assessment —
    keep that framing if these are ever edited.
  - `/calculators` added to sitemap.xml, `/site-map`, and footer nav; not
    added to the primary header nav (already at 10 items) to avoid
    crowding, matching how `/emergency-electrical-services` was handled.

## Design system

`/DESIGN.md` (repo root) is now the formal, machine-checkable record of
this site's visual identity, written in the [DESIGN.md
format](https://github.com/google/design.md) (tokens + prose, validated
with `npx @google/design.md lint DESIGN.md`, currently 0 errors/0
warnings). It documents the brand exactly as already shipped — petrol
green / energy yellow / burnt orange / paper / ink, Space Grotesk
headings + Inter body, sharp corners everywhere except a 4px radius on
buttons, no drop shadows, hairline borders for hierarchy — it is
documentation of the existing system, not a rebrand. Auditing the site
against it caught one real inconsistency, since fixed: the Kell Assist
chatbot panel and its floating button had rounded corners and drop
shadows the rest of the site doesn't use (`src/components/chatbot/
KellAssist.tsx`). Re-run the linter after any deliberate palette/type
change and keep this file in sync with `tailwind.config.ts`.

## New resource article (this round)

Added an 8th `/resources` guide, `ev-charger-installation-what-your-property-
needs`, matching the existing register (generic engineering knowledge, no
company-specific claims): load assessment before charger selection, why a
dedicated protected circuit is required, and how solar/generator integration
changes the load-management picture. Cross-links to the real
`/services/ev-charging-installation`, `panel-repair-upgrades`, and
`solar-inverter-systems` service pages via `relatedServiceSlugs`. This was
the one genuine content gap left after confirming the client's audit
report's other two "missing service page" findings (generator, EV charger)
were already built — the service pages existed, but no resource guide
covered EV charging specifically, unlike solar and generators. Considered
and explicitly skipped a "solar savings calculator" (also from the audit)
since it would need an assumed grid-tariff figure to produce a number, which
directly contradicts this site's established solar-page philosophy
("measured, not estimated" — see `/solar-energy-systems`) and every
existing article and service page's discipline against inventing numbers.

## Rate limiting and local SEO pages (this round)

- **`/api/chat` rate limiting — done.** Extracted the quote endpoint's
  in-memory per-IP rate limiter into a shared `src/lib/rateLimit.ts`
  (`createRateLimiter`, `getClientIp`) and wired it into `/api/chat` too
  (20 requests / 10 minutes per IP — looser than the quote form's 5,
  since a normal chat conversation is naturally several turns). This was
  flagged as a gap: `/api/chat` calls a real (billed) Anthropic API once
  `ANTHROPIC_API_KEY` is set, and had no abuse protection at all. Same
  caveat as before — in-memory, resets on cold start, won't stop a
  distributed attack, but does stop a single script hammering the
  endpoint.
- **Location-specific service-area pages — new.** Per the client's audit
  report's SEO recommendation ("Electrician in Gwarinpa", etc.), added
  `/electrician/[area]` for all 7 real service areas already in
  `company.serviceAreas` (`src/content/areas.ts` derives the slug list
  directly from that array — no separate list to drift). Each page lists
  every real service with a link to its detail page, the same
  certifications/experience/rating stats used sitewide, and general FAQs
  — no area-specific claims are invented (no per-area review counts,
  project counts, or completed-job claims). Linked from `/about`'s
  "Service coverage" list (now real links instead of plain text),
  `/site-map`, and `sitemap.xml`. Not added to primary/footer nav to
  avoid crowding — discoverable via About, the sitemap, and search.
  Recommendation #1/#2 from the same audit report (dedicated generator
  and EV-charger service pages) turned out to be **already built** on
  this site at `/services/generator-installation-maintenance` and
  `/services/ev-charging-installation` — no action needed there.

## Remaining pages (in suggested build order)

Shipped since the original brief: `/about` (rewritten this round — see
below), `/solar-energy-systems`, `/emergency-electrical-services` (new
this round), `/industries` (+ 7 sector pages), `/resources` (+ 7
articles), `/faq` (categorized, real/sourced content only), `/testimonials`
(real Google reviews), `/careers` (+ 4 track pages), a site-wide "Kell
Assist" chatbot (new this round — see below), and a first draft of
`/legal/terms` and `/legal/privacy`. Still blocked on real data:

1. **`/projects`** — **built this round, but every case study is
   INVENTED PLACEHOLDER CONTENT**, per explicit client direction
   ("Build Real content that are still missing, you can invent
   everything and I'll make changes later") — a deliberate, narrow
   override of this file's general anti-fabrication rule, not a
   precedent for other content. See the disclaimer comment at the top
   of `src/content/projects.ts` for the full rationale. 6 fabricated
   case studies (2 residential, 2 commercial, 2 industrial) with
   generic area names (no street addresses), no named clients (to
   avoid misrepresenting a real third party), and no contract values
   (per the client's standing direction never to publish project
   financials). Both `/projects` and `/projects/[slug]` are
   `robots: noindex` and intentionally left out of `sitemap.xml` (same
   treatment as `/legal/*`) so none of this is search-indexed. **Do
   not remove `noIndex` until the client has reviewed and replaced
   this content with real case studies** (real scope, real location,
   real photos, real outcome — client/ops team to confirm, do not
   estimate).
2. **`/careers` track pages — programme specifics added this round,
   but INVENTED.** Duration, stipend, intake windows, and eligibility
   criteria for all 4 tracks (and 3 sample job openings under
   `/careers/job-openings`) are placeholder, added under the same
   client-authorized override as `/projects` above — see the updated
   disclaimer at the top of `src/content/careers.ts`. Unlike
   `/projects`, these pages are **not** `noindex` (career pages were
   already indexed pre-existing content) — **flag to the client
   specifically: verify or replace every number, date, and eligibility
   rule in `src/content/careers.ts` before treating this as final**,
   since it is currently live/indexable placeholder data, not
   sandboxed like the case studies. `applicationFormUrl` values are
   real (Google Forms supplied directly by the client) and unchanged.
   Note: Internship and Industrial Training were given the identical
   form URL by the client — this is intentional, not a deduplication
   bug, and must not be "corrected."
3. **`/legal/terms`** and **`/legal/privacy`** — **lawyer-reviewed and
   approved (client-confirmed).** `noIndex` removed from both pages' metadata
   and both added to `sitemap.xml`; `termsLastUpdated`/`privacyLastUpdated`
   in `src/content/legal.ts` now read "Last updated: September 2026" instead
   of the unpublished placeholder. No DPO is named in the Privacy Policy
   (none has been designated); add one to section 8 once appointed. If
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` is ever set, revisit privacy section 2's
   "We do not currently use third-party analytics" line — it needs to
   change to disclose GA4 before that goes live, per the policy's own
   wording.

## Functional work

- **Wire the contact/quote form to a backend.** `app/api/quote/route.ts`
  already forwards validated submissions to any URL set as
  `QUOTE_WEBHOOK_URL` (Zoho Flow, Zapier, Make, etc.) — no destination is
  hardcoded. Set that env var in the deployment to go live. Spam
  protection now includes a honeypot field, a time-trap (rejects
  submissions completed faster than 3 seconds after the form renders),
  and a best-effort in-memory per-IP rate limit (5 requests / 10 minutes;
  resets on cold start, so it will not stop a distributed attack). Add
  hCaptcha — wired in, gated on env vars. Set `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
  (client-side, embedded in the page) and `HCAPTCHA_SECRET_KEY`
  (server-side, verifies the token against hCaptcha's API in
  `app/api/quote/route.ts`) to activate it — until both are set, the form
  works exactly as before with no widget shown and no token required.
  - **Webhook hardening (optional but recommended).** Set
    `QUOTE_WEBHOOK_SECRET` in the deployment to have the route sign each
    forwarded payload with an `x-webhook-signature` header (HMAC-SHA256 of
    the raw JSON body, hex-encoded, using this secret as the key). Zoho
    Flow (or whatever receives `QUOTE_WEBHOOK_URL`) can verify that header
    to confirm a request genuinely came from this server, not from someone
    who obtained the webhook URL. Left unsigned if this var isn't set, so
    existing setups keep working unchanged.
  - Each submission gets a short reference (`KE-YYYY-XXXXXX`) generated
    server-side, included in the forwarded webhook payload and shown back
    to the customer on `/contact/thank-you` — useful for matching a
    phone/WhatsApp follow-up to the right lead in Zoho.
  - A failed forward to `QUOTE_WEBHOOK_URL` is retried once (after a
    500ms delay) before giving up, so a single transient network blip or
    5xx from Zoho Flow doesn't silently drop a lead. A 4xx isn't retried
    — that means the webhook itself rejected the payload, and retrying an
    identical request would just fail the same way.
- **WhatsApp click-to-chat.** Confirmed WhatsApp-enabled — `company.whatsappHref`
  now points at the real business short-link (`wa.me/message/74H7FYXECPMXH1`)
  pulled from the live site.
- **Fixed missing favicon.** `app/icon.png` existed and was being served fine
  as a static file, but no `<link rel="icon">` tag was ever rendered in any
  page's `<head>` — verified via curl. Root cause: `layout.tsx`'s metadata
  export set `icons: { apple: '/apple-touch-icon.png' }`, and Next.js only
  auto-detects the `app/icon.png` file convention when `metadata.icons` is
  left unset entirely; explicitly setting it (even partially, for `apple`
  only) disables that auto-detection for every icon type you didn't list.
  Fixed by explicitly adding `icon: '/icon.png'` alongside `apple` in that
  same object. Verified after the fix: both `<link rel="icon">` and
  `<link rel="apple-touch-icon">` now render on every page.
- **Typography refinement (design-technique pass).** The client shared a
  design-system writeup of Claude/Anthropic's own marketing site (cream
  canvas, coral CTAs, serif display type). Per direction, we did not adopt
  Anthropic's specific palette or typeface — Kell Electricals keeps its own
  petrol/yellow/orange brand and Space Grotesk display font — but borrowed
  one transferable technique: tighter (`tracking-tight`) letter-spacing on
  all display headings (h1–h4), applied once in `globals.css` so it's
  sitewide without touching individual pages. Also audited every page's
  section background sequence for the "don't stack two identical full-bleed
  bands" issue that was previously found and fixed on the homepage — no
  further instances found; the few consecutive light (`bg-paper`) sections
  that do exist are intentional continuous content blocks, not a rhythm bug.
- **SEO fixes and enhancements.** Found and fixed a real bug: `pageMetadata()`
  (used by every page except the homepage) set its own `openGraph`/`twitter`
  objects with no `images` field, and Next.js does not deep-merge those
  nested objects with the root layout's — so every subpage was silently
  missing `og:image`/`twitter:image` entirely (verified via curl: zero
  `og:image` tags rendered). Fixed by giving `pageMetadata()` an optional
  `image` param (defaulting to the site `/og-image.jpg`) and wiring in each
  page's own hero photo, so shared links now get a distinct, correct
  preview image per page instead of none at all. Also enhanced
  `organizationSchema()` in `lib/schema.ts`: added `logo`, added Trustpilot
  to `sameAs`, added a real `openingHoursSpecification` (parsed from
  `company.businessHours` rather than hand-duplicated, so it can't drift),
  and a `hasOfferCatalog` listing all 16 real services. Added a new
  `articleSchema()` (schema.org `TechArticle`) wired into every
  `/resources/[slug]` page — intentionally omits `datePublished` since no
  real publish date exists for these guides (Google treats it as
  recommended, not required, so omitting is correct over inventing one).
- **Human-readable sitemap page.** Added `/site-map` — a full index of every
  page on the site grouped by section (Company, Flagship Capabilities,
  Services, Industries, Resources, Careers, Legal), linked from the
  footer's legal row and included in `sitemap.ts` (the XML sitemap).
  Distinct from `/sitemap.xml` (the machine-readable one Next.js already
  generated, unchanged apart from the new `/site-map` entry).
- **Deeper content structure sitewide.** Per client request to make the
  site "more detailed" without inventing anything new, added cross-links
  and stats sections that draw entirely from facts already established
  elsewhere in the content model:
  - `/services/[slug]` (16 pages) gained a "Where this is used" section
    (industries that need that service, reverse-mapped from
    `industries.ts`'s `serviceSlugs`), a "Why choose Kell Electricals"
    stats block (same COREN/NEMSA/experience/rating/projects facts used
    elsewhere), and an FAQ section (General + Services & scheduling).
  - `/services` hub gained the same "Why choose us" stats block between
    the category grid and the FAQ preview.
  - Each `/resources/[slug]` article gained a new `relatedServiceSlugs`
    field in `resources.ts`, editorially mapped from each article's actual
    subject matter to the real services it discusses, rendered as a
    "Related services" cross-link card.
  - The homepage gained two new sections: `IndustriesPreview` (all 7
    industries, linking to `/industries/[slug]`) and `TestimonialsPreview`
    (3 featured real reviews + the review summary, linking to
    `/testimonials`) — placed to keep the light/dark section rhythm
    alternating (`ProcessSection` → `IndustriesPreview` → `TrustSection`)
    rather than stacking two dark full-bleed sections back to back.
- **Hero photography on every page.** Every remaining bare petrol-color hero
  (careers hub, contact, FAQ, industries hub, resources hub, testimonials,
  solar, emergency, home automation, CCTV, and the shared services/industries/
  resources/careers detail templates — 14 in total) now has a licensed Adobe
  Stock photo behind the standard gradient overlay. See "Hero photography" in
  `docs/sitemap-and-content-model.md` for the file locations and the
  one-photo-per-template convention on detail pages.
- **Header nav restructured for wide/tablet screens.** The desktop nav used
  to squeeze logo + all 10 primary links + phone + CTA into one row, which
  broke down once Industries/Resources/Testimonials/Careers were added —
  narrow laptop and tablet widths pushed the CTA button oddly to the side.
  `Header.tsx` now renders two rows at `lg:` (1024px+): a top row with logo
  + phone + "Request a Quote", and a full-width nav row centered below it.
  Below `lg`, phones and tablets alike get the compact hamburger menu (the
  breakpoint moved from `md` to `lg` specifically so tablets no longer hit
  the cramped single-row squeeze). `MobileCallBar` and the body's bottom
  padding in `layout.tsx` were updated to the same `lg` breakpoint to match.
- **Real social links.** `company.social` now has the client's real Instagram
  and LinkedIn profile URLs (replacing earlier placeholders) plus a new
  `trustpilot` field, linked from the footer's social row alongside
  Facebook. `src/content/testimonials.ts` also gained `getWriteReviewUrl()`
  (`g.page/r/CTxnaFyO9LMyEBE/review`), the direct Google review composer
  link — distinct from the existing `getReviewUrl()`, which points to the
  full review list on the Business Profile and is still used for "View all
  reviews." `GoogleReviewCTA`'s "Write a Google Review" button now uses
  `getWriteReviewUrl()`.
- **Testimonials carousel simplified per client instruction.** Removed the
  standalone large "Featured Testimonial" section on `/testimonials` (the
  client asked that a review "should only remain on the review slide," not
  be extended into a separate showcase block) and removed the visible
  prev/next arrow buttons from `TestimonialCarousel` — the carousel is
  still fully navigable by keyboard (arrow keys) and touch/swipe scroll.
  Autoplay interval was reduced from 5500ms to 3000ms for a faster feel.
  `carouselItems`/`gridItems` on the testimonials page now show the full
  `testimonials` set (previously one review, Amara's, was excluded to
  avoid duplicating it with the removed featured section).
- **Real photography.** This round added four licensed Adobe Stock photos
  (`public/images/photos/*.jpg`, resized to a 2000px long edge and
  compressed to keep page weight down — originals were 6-11MB each) as
  hero/section imagery: `hero-control-panel.jpg` (homepage hero
  background), `solar-roof-install.jpg` (solar feature section on the
  homepage), `about-blueprint-review.jpg` (About page), and
  `services-substation.jpg` (Services hub hero background). These are
  **generic stock photography, not photos of Kell Electricals' own team or
  jobsites** — captions/alt text describe them generically ("engineers
  reviewing blueprints") and never claim they depict this company's actual
  staff, premises, or completed work; do not caption them otherwise. The
  `/industries` and `/services` category icons remain the earlier
  AI-generated monoline illustrations (`/images/industries/*.png`,
  `/images/services/*.png`) — those two image sets can coexist, but if real
  jobsite photography becomes available (control panels, technicians,
  solar installs on an actual Kell Electricals job), it should replace the
  stock photos first since it's strictly more valuable (real, attributable,
  and specific to this company) — keep the blueprint/circuit-trace overlay
  treatment for consistency when swapping.
- **Analytics + Search Console.** `src/components/analytics/GoogleAnalytics.tsx`
  renders the GA4 script only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
  in the deployment env — nothing renders without it, no ID is hardcoded.
  Set that env var once a real GA4 property exists. Search Console
  verification and `sitemap.xml` submission still need to happen once the
  domain is live.
- **Domain/hosting decision.** Vercel project `googlesitesitemap`
  (`prj_ZtOKha3gjKpkU7k1KPOV7mh5GdF8`) is the one to attach
  `kellelectricals.com` to — confirmed correctly detected as Next.js, and
  its Vercel Authentication is already scoped to exclude custom domains
  (`ssoProtection.deploymentType: all_except_custom_domains`), so the real
  domain won't hit a login wall once attached. Steps: add the domain in
  the Vercel dashboard (Settings → Domains), add the DNS records it shows
  at the registrar, wait for propagation/SSL. The other Vercel project
  linked to this same repo (`kellelectricalsst`) has framework detection
  showing `null` — do not point the domain there without fixing that
  first. Decide separately whether the old Google Sites version is
  retired or left as-is once the real domain is live.
- **Conversion funnel wiring — done.** The site previously only measured
  page views; every actual conversion action is now a trackable event
  (`src/lib/analytics.ts`, a no-op until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is
  set, so nothing breaks pre-launch):
  - `contact` event on every phone/WhatsApp/email link sitewide (`Button`,
    `TrackedLink`, `Header`, new `MobileCallBar`), tagged with `channel` and,
    for the new mobile bar, `placement`.
  - `generate_lead` event on a successful quote submission, tagged with
    `service` and `urgency`.
  - Quote submission now redirects to a real `/contact/thank-you` page
    (`noindex`, still linked from the site so it's crawlable-but-not-ranked)
    instead of swapping in a message that disappears on refresh — this is
    the URL to mark as the conversion goal in GA4/Google Ads once live, and
    it branches into an emergency-specific message when `?urgency=emergency`.
  - "Request a Quote" buttons on service detail pages now link to
    `/contact?service={slug}`, which pre-selects that service in the quote
    form dropdown (`QuoteForm` takes `initialServiceSlug`) — one less step
    between a visitor reading about a specific service and submitting a
    lead for it. The bottom CTA on service pages also uses the
    service-specific heading/copy via `CTASection`'s new optional props.
  - Added a mobile-only sticky call/WhatsApp bar (`MobileCallBar`, fixed to
    viewport bottom, hidden `md:` and up where the header's own CTA is
    always visible) so a visitor scrolled deep into a service/industry page
    on a phone doesn't have to scroll back up to act.
  - **Still needed for this to actually function as a funnel:** set
    `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `QUOTE_WEBHOOK_URL` (see above), then
    in GA4 mark `generate_lead` as a key event and `/contact/thank-you` as a
    conversion-linked page; import that conversion into Google Ads once ads
    run. None of this fires anywhere without those two env vars set.
- **Legacy-path redirects — done.** `next.config.js` 301s the one path
  from the old site's `sitemap9.xml` that doesn't match 1:1 on the new
  site: `/home` → `/`. `/about`, `/services`, `/contact`, and
  `/testimonials` already match the old paths exactly (a real
  `/testimonials` page now exists, so the earlier placeholder redirect to
  `/` was removed), so no redirect was needed for those. Verified live:
  `curl` against a freshly built+served instance confirmed the redirect
  fires (308) and the unredirected paths still serve directly (200, no
  loop).
- **`/testimonials` — done.** Built from real, verbatim Google reviews
  supplied directly by the client (from the Kell Electricals Google
  Business Profile) — `src/content/testimonials.ts` holds the exact
  review text, star ratings, customer names, and relative dates as
  supplied, with a `truncated` flag preserved on the handful captured
  from a screenshot that cut the review short (only the text actually
  supplied is shown; nothing is invented to complete a cut-off review).
  Never displays every Google review, only this curated set of 16 — the
  hero explicitly links out to the full profile
  (`https://maps.app.goo.gl/CUDxCDE74MvUX3HRA?g_st=ic`) via "View all
  reviews on Google." `company.trust.googleRating`/`googleReviewCount`
  were updated to the client's current figures (4.8 / 192) — the source
  brief also mentioned "184+" in some literal template copy; 192 was used
  throughout instead since it's the number stated under the profile's own
  "Google Review Count," and using one consistent figure sitewide (it also
  feeds the existing `AggregateRating` schema in `organizationSchema()`)
  beats displaying two different counts on the same page. Reusable
  components: `StarRating`, `GoogleReviewBadge` (labels the source as
  "Google Review" only — never "Google Certified" or anything implying
  Google verified the business through this site), `ReviewSummary`,
  `TestimonialCard`, `TestimonialCarousel` (autoplay, pause on
  hover/focus, keyboard arrow-key nav, touch swipe via native scroll-snap,
  respects `prefers-reduced-motion`), `TestimonialGrid` (load-more), and
  `GoogleReviewCTA`. No per-review `Review`/schema.org markup was added —
  only the existing, already-real `AggregateRating` on the org schema —
  since self-hosted review schema without Google's own verification is
  the kind of "fake review schema" this task explicitly said not to
  build.
- **"20+ years" experience framing — done, scoped decision made with the
  user.** The client asked to "use 20+ years consistently," but the site's
  own founding date (2010, sourced from the client's earlier content
  extract, with a real 2010–2024 milestone timeline) is only 16 years ago.
  Resolved by asking the user directly: `company.teamExperienceYears = 20`
  is now a distinct field for the team's *combined* engineering experience
  (which predates the company's own incorporation) — used in all headline
  marketing copy (Hero, StatsBar, About, Testimonials trust bar) as "20+
  years of combined engineering experience," never as "years in business."
  `company.foundedYear` (2010) and the About page milestone timeline are
  unchanged and still describe the company's actual founding history — the
  two numbers intentionally coexist and are labeled differently so neither
  contradicts the other. Do not derive `teamExperienceYears` from
  `foundedYear` or vice versa.
- **`/about` — rewritten this round** to the requested structure (headline
  "Engineering Power. Building Trust.", Who We Are / What We Do / Our
  Mission / Our Vision / Our Values / Why Choose Us / Our Expertise / Our
  Process / Credentials / Service Coverage / CTA). Every fact used is one
  already established elsewhere in the codebase (certifications, service
  areas, response target, ratings) — no new claims were introduced. The
  Credentials card now reads "Certification details available upon
  request" beneath the two confirmed certifications (COREN, NEMSA), per
  the brief's instruction not to imply anything beyond what's confirmed.
- **`/emergency-electrical-services` — new flagship page**, built to the
  requested long-form structure (Hero, Overview, Problems We Solve, Who We
  Serve, Our Process, Why Choose Us, Technical Considerations, FAQ, CTA,
  Related Services). Content is either a real company fact (response
  target, certifications, contact channels) or general, non-company-specific
  electrical-safety knowledge (why not to reset a tripped breaker
  repeatedly, isolating power near water) in the same register as the
  `/resources` articles — nothing about this page claims a specific
  incident count, credential, or capability that isn't already established.
  Linked from the footer nav and `sitemap.xml`; not added to the (already
  10-item) primary header nav to avoid crowding it — the chatbot's
  "Emergency" quick-start and the sitewide mobile call bar cover the
  high-visibility path instead.
- **"Kell Assist" chatbot — built this round, real functionality without
  fabricated capability.** A persistent floating widget
  (`src/components/chatbot/KellAssist.tsx`), bottom-right on desktop,
  full-screen on mobile, added globally in `layout.tsx`. What actually
  ships:
  - **Deterministic flows that work with zero configuration:** the 8
    conversation-starter quick replies; an emergency-keyword detector that
    fires the exact safety message from the brief plus CALL NOW/WHATSAPP
    NOW buttons *before* any message reaches an LLM (so this never depends
    on an API key or model behavior); a step-by-step solar/inverter
    question flow that always closes with "An accurate system
    recommendation requires a proper load assessment and site assessment."
    and never outputs a system size; a lead-capture form that reuses the
    existing `/api/quote` endpoint (tagged `channel: 'kell_assist_chatbot'`
    for attribution) — no new backend integration needed.
  - **Free-text conversation** goes through a new `/api/chat` route
    (`src/app/api/chat/route.ts`) that calls the Anthropic Messages API
    directly via `fetch` (no SDK dependency added) with a system prompt
    built entirely from `src/content/chatbot.ts`, which composes from the
    *existing* typed content files (`services.ts`, `industries.ts`,
    `faqs.ts`, `careers.ts`, `company.ts`) — the model can't know anything
    the website doesn't already say, and it's instructed to reply with the
    brief's exact fallback line ("I don't want to give you incorrect
    information...") rather than invent an answer. **This needs
    `ANTHROPIC_API_KEY` set in the deployment to actually respond to free
    text — same env-var-gated pattern as `QUOTE_WEBHOOK_URL` and
    `NEXT_PUBLIC_GA_MEASUREMENT_ID`.** Without it, `/api/chat` returns
    `not_configured` and the widget falls back to a grounded, non-AI
    summary pulled from the same content files, then offers Request a
    Quote / WhatsApp — the guided flows above are unaffected either way.
  - **Analytics**: fires `chat_opened`, `service_selected`,
    `quote_requested`, `consultation_requested`, `emergency_selected`,
    `whatsapp_clicked`, `call_clicked`, and `lead_submitted` via the
    existing `trackEvent()` helper — same no-op-until-GA4-configured
    behavior as the rest of the site.
  - **Not yet built / deliberately deferred:** an admin UI for editing the
    knowledge base (it's structured TypeScript data today, editable by a
    developer, not a non-technical admin panel — building a real admin UI
    was out of scope for this round given everything else requested); rate
    limiting on `/api/chat` (the quote endpoint has one, this doesn't yet —
    worth adding before `ANTHROPIC_API_KEY` is set, to avoid a cost-abuse
    vector); persisting chat history server-side (currently client-only,
    lost on refresh).
- **Full 7-category service page restructure — done, all 7.** The brief
  asked for seven top-level service category pages (Residential,
  Commercial, Industrial, Solar & Inverter, Home Automation, CCTV &
  Security, Emergency), each with long-form sections (overview, services
  included, problems solved, process, why choose us, FAQ, CTA, related
  services). Final state:
  - **Solar & Inverter** — `/solar-energy-systems` (pre-existing flagship page).
  - **Emergency** — `/emergency-electrical-services`.
  - **Home Automation** — `/home-automation` (services included, problems
    solved, who we serve, process, why choose us, technical
    considerations, FAQ, CTA, related services — sourced from
    `services.ts`/`industries.ts`/`process.ts`, plus 3 new FAQs under a
    "Home Automation" category in `faqs.ts`, which also enriches `/faq`).
  - **CCTV & Security** — `/cctv-security-systems` (same structure; 3 new
    FAQs under "CCTV & Security").
  - **Residential / Commercial / Industrial** — deepened in place at their
    existing `/industries/[slug]` URLs (the recommended approach noted
    previously: reuses existing URLs, avoids content/SEO overlap with a
    duplicate top-level page). `src/app/industries/[slug]/page.tsx` now
    renders Problems We Solve (the existing `challenges` list, retitled),
    Services Included (expanded from a sidebar link list into full cards
    with each service's summary), Our Process (shared `process.ts`
    4-stage flow), Why Choose Us (real certifications/experience/rating
    stats), an FAQ section (General + Services & scheduling categories),
    and the existing "Other properties we serve" cross-links — applied
    uniformly across all 7 industry pages (not just the three requested),
    since hospitality/education/healthcare/retail benefit from the same
    depth and splitting them would have left the site inconsistent.

## Content imported from the live site (this session)

A verbatim content extract from the current live `kellelectricals.com`
(Google Sites build) was provided directly by the client. Real, verified
facts from it are now wired into the codebase:

- `src/content/company.ts`: emergency email, business hours, social links
  (Facebook/Instagram/LinkedIn), the real WhatsApp business link, founding
  year (2010, used to compute `yearsExperience` dynamically instead of a
  hardcoded number), Google rating (4.8, updated this round from an
  earlier 4.9), a Google review count (192, updated from 187), and a
  completed-projects count (100+).
- `/about`: real dated milestones (2010–2024) added as a timeline.
- `/services`: real FAQ content added (with schema.org `FAQPage` markup).
- `/contact`: business hours and emergency email added to the contact cards.

**Deliberately not imported:**
- **Team bios** (names/roles from the live site) — the client's own extract
  flagged these as possibly outdated versus the current staff roster.
  Do not add without confirmation these are current.
- **`/projects`** — per prior client direction, still blocked on real
  case-study data (see below). The live site's extract additionally
  reveals the site links out to a Paystack-hosted online store and a
  Blogspot "Solution Hub" — noted here for future scope, not built.

## Content still needed from the client (do not fabricate)

- Case study detail for any project to be featured on a future `/projects`
  page (scope, sector, outcome — no contract amounts).
- Real careers/programme specifics (duration, stipend, intake dates,
  eligibility) for the four `/careers` track pages, which currently carry
  generic, non-fabricated placeholder copy — see the `/careers` entry
  above. **Update:** the `apprenticeship` track's duration and fee, and
  `industrial-training`'s application checklist, are now real (see
  `src/content/careers.ts` — sourced from the client's June 2026 site
  audit report). Internship and industrial-training's stipend/intake
  are still invented placeholders.
- ~~Current team roster~~ **Done, now with photos.** Real names/titles/
  bios for the full 6-person team are in `src/content/team.ts`, shown on
  `/about` in a photo-card grid. Thelma Dogwoh (Managing Director) and
  Gabriel Ioryem's names/bio facts came from the June 2026 audit report;
  the client later corrected Gabriel's title directly to **Founder &
  CEO** (was "Lead Electrical Engineer" per the audit — his bio was
  updated to match while keeping the COREN/15-years facts, which the
  client hasn't retracted). Justina (Procurement & Inventory Manager),
  Folashade (Customer Relations Manager), Anthony (Interior Design &
  Finishing Expert), and Sunday (Head of HVAC Systems) — names, titles,
  and real headshots — were supplied directly by the client afterward;
  no bio detail beyond title was given for these four, so their bios are
  a plain restatement of the role, not invented specifics. Photos live
  in `public/images/team/` (resized to 640×640, JPEG). Thelma's photo
  was supplied afterward too — all 6 team members now have a real
  headshot.
- Any additional named client references cleared for public use as a trust
  bar (logos require written permission per client).
- Additional Google or Trustpilot reviews beyond the 23 already added to
  `src/content/testimonials.ts`, if more should be featured — add them
  verbatim to that file, following the same no-rewrite rule.
- **Partner/supplier logos — done, client-confirmed real and permitted.**
  `src/content/partners.ts` holds 24 real supplier/platform names (Schneider
  Electric, Hager, ABB, Siemens, JinkoSolar, Starlink, Hikvision, etc.), each
  with a logo file under `public/images/partners/`, rendered via the
  `PartnerLogos` marquee on both `/` and `/about`. To add another, drop the
  logo file under `public/images/partners/` and add an entry to the
  `partners` array per the file's header comment — still real names/logos
  only, never placeholder or invented entries.

## Dependency note

Shipped on Next.js 14.2.35 (latest patched 14.x) rather than the newer
Next 16 major. `npm audit` flags several CVEs in the 14.x→16.3.0 range, but
they concern Middleware, Server Actions, and custom Image Optimization
`remotePatterns` — none of which this build currently uses (no middleware,
no server actions, no `next/image` remote patterns configured). Re-evaluate
before adding any of those features, or when scheduling a Next 15/16
upgrade.

## Testing before launch

- **Lighthouse run completed this session** (desktop, production build,
  headless Chromium) across home, about, solar, a service detail page, a
  resource article, contact, an industry page, and legal/privacy.
  Performance 93-99, Accessibility 96-100, Best Practices 96, SEO 100
  (69 on `/legal/privacy`, expected: that's the intentional `noindex`).
  All comfortably clear the 90+ target. Re-run once deployed to a real
  domain, since mobile and real-network conditions weren't tested here.
- **Color contrast bug found and fixed this session.** The `eyebrow`
  label's `text-petrol/60` (3.83:1 on Paper) and the inactive breadcrumb
  segment's `text-paper/50` (4.31:1 on Petrol) both failed WCAG AA's
  4.5:1 minimum for small text, sitewide (every page using either
  pattern). Bumped to `text-petrol/70` (5.09:1) and `text-paper/60`
  (5.57:1) respectively across all files; verified via Lighthouse
  afterward that zero contrast findings remain anywhere tested.
- **Touch-target (WCAG 2.2, 2.5.8) finding fixed.** Header/footer nav links,
  the phone/email links, and legal-nav links were all inline elements where
  vertical padding didn't affect the hit-test box; converted to
  `inline-flex`/`flex` so padding actually expands touch-target size.
  Verified via Lighthouse: 100/100 accessibility across all 32 routes.
- Validate structured data with Google's Rich Results Test once deployed
  (this session validated that every page's JSON-LD parses as valid JSON
  with the expected schema.org `@type`s, but Rich Results Test itself
  needs a public URL).
