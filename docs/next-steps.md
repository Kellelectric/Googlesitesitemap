# Next Steps

## Remaining pages (in suggested build order)

Shipped since the original brief: `/about`, `/solar-energy-systems`,
`/industries` (+ 7 sector pages), `/resources` (+ 7 articles), `/faq`
(categorized, real/sourced content only), and a first draft of
`/legal/terms` and `/legal/privacy`. Still blocked on real data:

1. **`/projects`** — case studies hub. Per client direction, contract
   values/amounts are not to be published on the site — case studies should
   describe scope, sector, and outcome only. **Needs real data before
   publishing:** scope breakdown, before/after photos, timeline — confirm
   with the client/ops team, do not estimate. Filterable by sector
   (residential/commercial/industrial) and service type once 3+ case
   studies exist.
2. **`/careers`** — apprenticeship programme details. **Needs real data:**
   programme structure, duration, intake schedule, eligibility — currently
   no source material provided.
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
- **Real photography.** Every image on the site is still an abstract
  illustration, not a photo — this round added a set of on-brand generated
  icons (`/images/industries/*.png`, `/images/services/*.png`: a monoline
  petrol-and-yellow icon per industry sector and per service category,
  shown on the `/industries` and `/services` hubs and industry detail
  pages), but these are explicitly abstract/illustrative, not stand-ins for
  real jobsite photos. Replace with real jobsite photography (control
  panels, technicians, solar installs, thermal imaging) as it becomes
  available; keep the blueprint/circuit-trace overlay treatment for
  consistency. No photorealistic AI images were generated for this site,
  deliberately, since those would look like real jobsite photos of work
  that didn't happen.
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
- **Legacy-path redirects — done.** `next.config.js` now 301s the two
  paths from the old site's `sitemap9.xml` that don't match 1:1 on the
  new site: `/home` → `/`, `/testimonials` → `/` (temporary target — no
  real `/testimonials` page exists yet; point this at `/testimonials`
  once real quotes are provided, see the content-still-needed list
  above). `/about`, `/services`, and `/contact` already matched the old
  paths exactly, so no redirect was needed for those. Verified live:
  `curl` against a freshly built+served instance confirmed both redirects
  fire (308) and the unredirected paths still serve directly (200, no
  loop).

## Content imported from the live site (this session)

A verbatim content extract from the current live `kellelectricals.com`
(Google Sites build) was provided directly by the client. Real, verified
facts from it are now wired into the codebase:

- `src/content/company.ts`: emergency email, business hours, social links
  (Facebook/Instagram/LinkedIn), the real WhatsApp business link, founding
  year (2010, used to compute `yearsExperience` dynamically instead of a
  hardcoded number), Google rating (4.9), and a completed-projects count
  (100+).
- `/about`: real dated milestones (2010–2024) added as a timeline.
- `/services`: real FAQ content added (with schema.org `FAQPage` markup).
- `/contact`: business hours and emergency email added to the contact cards.

**Deliberately not imported:**
- **Team bios** (names/roles from the live site) — the client's own extract
  flagged these as possibly outdated versus the current staff roster.
  Do not add without confirmation these are current.
- **Testimonials** — the live site has a Testimonials nav item, but the
  extract provided contains no actual testimonial text/quotes/names, only
  the fact that the page exists. Do not fabricate testimonial content;
  wait for verbatim quotes with attribution.
- **`/projects`, `/careers`** — per prior client direction, still blocked on
  real case-study/programme data (see below). The live site's extract
  additionally reveals `/careers` has four subpages (Internship, Industrial
  Training, Apprenticeship, Job Openings) and the site links out to a
  Paystack-hosted online store and a Blogspot "Solution Hub" — noted here
  for future scope, not built.

## Content still needed from the client (do not fabricate)

- Case study detail for any project to be featured on a future `/projects`
  page (scope, sector, outcome — no contract amounts).
- Careers/apprenticeship programme specifics for the four subpages above.
- Real, attributed testimonial quotes for a `/testimonials` page.
- Current team roster (names/roles/photos) if a team section is wanted —
  the old site's list should be treated as unverified.
- Any additional named client references cleared for public use as a trust
  bar (logos require written permission per client).

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
