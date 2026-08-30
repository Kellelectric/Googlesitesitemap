# Next Steps

## Remaining pages (in suggested build order)

Shipped since the original brief: `/about`, `/solar-energy-systems`,
`/industries` (+ 7 sector pages), `/resources` (+ 7 articles), `/faq`
(categorized, real/sourced content only), `/testimonials` (real Google
reviews), `/careers` (+ 4 track pages), and a first draft of
`/legal/terms` and `/legal/privacy`. Still blocked on real data:

1. **`/projects`** — case studies hub. Per client direction, contract
   values/amounts are not to be published on the site — case studies should
   describe scope, sector, and outcome only. **Needs real data before
   publishing:** scope breakdown, before/after photos, timeline — confirm
   with the client/ops team, do not estimate. Filterable by sector
   (residential/commercial/industrial) and service type once 3+ case
   studies exist.
2. **`/careers` track pages — done, but generic.** Built the hub plus
   `/careers/internship`, `/careers/industrial-training`,
   `/careers/apprenticeship`, and `/careers/job-openings` (matching the
   old site's nav structure), but with **no programme specifics** —
   duration, stipend, intake dates, and eligibility criteria were never
   provided, so each page describes what the track generally is (in
   standard industry terms) and directs applicants to email `company.email`
   with details confirmed directly rather than fabricating numbers or
   dates. `/careers/job-openings` is honest that there's no live job board:
   it invites speculative applications by email. **If real programme
   details or actual open roles become available, replace the generic
   copy in `src/content/careers.ts` — do not leave it generic once real
   data exists.**
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
  above.
- Current team roster (names/roles/photos) if a team section is wanted —
  the old site's list should be treated as unverified.
- Any additional named client references cleared for public use as a trust
  bar (logos require written permission per client).
- Additional Google reviews beyond the 16 already added to
  `src/content/testimonials.ts`, if more should be featured — add them
  verbatim to that file, following the same no-rewrite rule.

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
