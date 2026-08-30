# Next Steps

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
3. **`/legal/terms`** and **`/legal/privacy`** — drafted (see
   `src/content/legal.ts`), covering standard site terms and an NDPA 2023
   structure (lawful basis, data subject rights, breach notification). This
   is a first pass only, not reviewed by counsel, and both pages are
   currently `robots: noindex` and excluded from `sitemap.xml` for that
   reason. **Do not remove noindex or publish this as final** until a
   lawyer has reviewed it, particularly the Privacy Policy given NDPA
   enforcement risk. No DPO is named (none has been designated); add one
   once appointed.

## Functional work

- **Wire the contact/quote form to a backend.** `app/api/quote/route.ts`
  already forwards validated submissions to any URL set as
  `QUOTE_WEBHOOK_URL` (Zoho Flow, Zapier, Make, etc.) — no destination is
  hardcoded. Set that env var in the deployment to go live. Spam
  protection now includes a honeypot field, a time-trap (rejects
  submissions completed faster than 3 seconds after the form renders),
  and a best-effort in-memory per-IP rate limit (5 requests / 10 minutes;
  resets on cold start, so it will not stop a distributed attack). Add
  hCaptcha or similar on top of this if abuse becomes a real problem after
  launch — none is wired in since that needs a real site/secret key pair
  we don't have.
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
  in `public/images/team/` (resized to 640×640, JPEG). Thelma has no
  photo yet — add if supplied.
- Any additional named client references cleared for public use as a trust
  bar (logos require written permission per client).
- Additional Google or Trustpilot reviews beyond the 23 already added to
  `src/content/testimonials.ts`, if more should be featured — add them
  verbatim to that file, following the same no-rewrite rule.
- **Partner/supplier logos.** `src/content/partners.ts` and the reusable
  `PartnerLogos` component (wired into both `/` and `/about`, immediately
  after "Our expertise") are built and ready, but the `partners` array is
  intentionally empty — no partnerships were confirmed, so nothing is
  rendered (the component returns `null` on an empty array; this is by
  design, not a bug). Once the client supplies real partner/supplier
  names, logo files, and (optionally) their website URLs and written
  permission to display the logo, drop the logo under
  `public/images/partners/` and add an entry to the `partners` array per
  the file's header comment. Do not add placeholder or invented entries.

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
