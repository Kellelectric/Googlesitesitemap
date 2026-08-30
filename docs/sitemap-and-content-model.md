# Sitemap & Content Model

## Full sitemap (target — see "Build status" for what exists in this session)

```
/                                Home
/about                           About (story, mission, compliance, footprint)
/services                        Services hub (all 16 lines)
/services/[slug]                 16 service detail pages
/solar-energy-systems            Flagship product-style page for solar/hybrid
/projects                        Case studies index (filterable)
/projects/[slug]                 Individual case study
/industries                      Industries served hub
/industries/[slug]               Residential / Commercial / Industrial / Hospitality / Education / Healthcare / Retail
/resources                       Insights/technical articles index
/resources/[slug]                Article detail
/faq                             Full FAQ hub, categorized
/testimonials                    Google review testimonials
/careers                         Careers hub
/careers/[slug]                  Internship / Industrial Training / Apprenticeship / Job Openings
/contact                         Contact / quote request
/legal/terms                     Terms & Conditions
/legal/privacy                   Privacy Policy (NDPA 2023)
/sitemap.xml                     Generated (next/sitemap route)
/robots.txt                      Generated
```

## Build status for this session

Built and shipped: `/`, `/about`, `/services`, `/services/[slug]` (all 16
slugs render from real content), `/solar-energy-systems`, `/industries`,
`/industries/[slug]` (7 sector pages), `/resources`, `/resources/[slug]`
(7 technical articles), `/faq` (categorized, all real/sourced content),
`/testimonials` (real, verbatim Google reviews — see caveat below),
`/careers` + `/careers/[slug]` (4 tracks, generic non-fabricated copy —
see caveat below), `/contact`, `/legal/terms`, `/legal/privacy` (drafted,
see caveat below), plus `sitemap.xml` and `robots.txt`.

Not yet built: `/projects` + detail pages — still blocked on real client
data per the anti-fabrication rule (see "Content still needed from the
client" below) — do not build this with invented content.

**Careers caveat:** `/careers/[slug]` pages describe each track (Internship,
Industrial Training, Apprenticeship, Job Openings) in general, industry-
standard terms only — no programme duration, stipend, intake dates, or
eligibility specifics are stated anywhere, since none were supplied.
Applicants are directed to email `company.email` for current details. See
`next-steps.md` before adding real programme specifics.

**Testimonials caveat:** `/testimonials` shows only the 16 reviews supplied
verbatim in `src/content/testimonials.ts`, not the full Google review set —
the page links out to the real profile for the rest. Do not add a review
here that wasn't supplied verbatim by the client.

Primary navigation intentionally links only to pages that exist in this
build — no dead links. It now includes Industries and Resources. `/legal/*`
pages are linked only from the footer bottom bar, not primary nav, and are
excluded from `sitemap.xml` (see legal caveat below).

**Legal pages caveat:** `/legal/terms` and `/legal/privacy` are a first
drafted pass, not reviewed by counsel. They are marked `robots: noindex`
and excluded from the sitemap for that reason. Do not remove the noindex
flag or add them to the sitemap until a lawyer has reviewed them,
particularly the Privacy Policy's NDPA 2023 compliance (see `next-steps.md`).

## Content model

Content lives in typed data files under `src/content/`, not hardcoded in
layout/JSX, so non-engineers can edit copy without touching components.

### `src/content/company.ts`
Single source of truth for company facts (name, RC number, address, phone,
tagline, certifications, service areas, trust stats). Referenced by
structured data (JSON-LD), footer, contact page, and header.

### `src/content/services.ts`
Array of 16 `Service` objects:
```ts
type Service = {
  slug: string
  name: string
  category: 'power' | 'energy' | 'security-automation' | 'industrial' | 'maintenance'
  summary: string          // 1-sentence, used on hub cards
  description: string      // 2-3 sentences, used on detail page hero
  scope: string[]          // 4-6 bullets: what's included
  useCases: string[]       // 3 bullets: when clients need this
  flagship?: boolean       // true only for solar-inverter-systems
}
```

### `src/content/industries.ts`
7 `Industry` objects (residential, commercial, industrial, hospitality,
education, healthcare, retail), each with a `challenges` list and
`serviceSlugs` cross-references into `services.ts`.

### `src/content/resources.ts`
7 `Article` objects across 5 categories (Solar & Energy, Compliance,
Maintenance, Security & Automation, Industrial) — general electrical-
engineering explainers, not company-specific claims, so none of it is
blocked on client data.

### Generated illustration assets
`public/images/industries/*.png` (one per industry slug) and
`public/images/services/*.png` (power, energy, security-automation,
maintenance — not industrial, not generated this round) are AI-generated
monoline icons in the site's own petrol/yellow palette, matching the
existing `CircuitLines` engineering-drawing motif. These are deliberately
abstract, not photorealistic — see the "Real photography" note in
`next-steps.md` for why photorealistic AI images were not generated.
Note: these live under `public/images/...`, not `public/industries/...`
or `public/services/...` directly — those paths collide with the
`/industries/[slug]` and `/services/[slug]` app routes, which Next.js's
router matches before falling through to the public folder.

### `src/content/faqs.ts`
`servicesFAQs` (4 items, shown on `/services`) plus `faqCategories` (the
full categorized set shown on `/faq`: General, Services & scheduling,
Emergency & safety). The General and Emergency categories interpolate
real values straight from `company.ts` (service areas, business hours,
RC number, emergency response target) so they can't drift out of sync.

### `src/content/process.ts`
The shared 4-stage engineering process (Assess → Design → Install →
Test & Handover) used across every service detail page — this is the
"systems thinking" pillar made visible in the UI, not just claimed in copy.

### `src/content/testimonials.ts`
16 `Testimonial` objects — real, verbatim Google reviews (customer name,
star rating, relative date, review text, and a `truncated` flag where a
review was captured mid-sentence from a screenshot) supplied directly by
the client from the Kell Electricals Google Business Profile. Review text
is never rewritten, paraphrased, or completed here — see the file's own
header comment before editing.

### `src/content/careers.ts`
4 `CareerTrack` objects (internship, industrial-training, apprenticeship,
job-openings) matching the old site's Careers nav structure. Deliberately
excludes programme duration/stipend/intake/eligibility specifics — none
were supplied — see the file's header comment and the Careers caveat above.

### `src/content/nav.ts`
Primary and footer navigation arrays, gated to built pages only (see
Build status above).

## Placeholders flagged for real data

Per the brief's anti-fabrication rule, nothing below is invented. Where a
number wasn't supplied, it is either omitted or explicitly marked:

- **Projects completed (total count):** sourced from the live site's own
  content extract (100+) and now in `company.trust.projectsCompleted`.
- **Case studies / project financials:** per client direction, project
  contract values are not to be published on the site. `/projects` is not
  yet built — still blocked on real per-project data (scope, sector,
  outcome, photos), see `next-steps.md`.
- **Client logos / trust bar:** not built — no client has been confirmed
  for public logo use. Do not add logos without written permission from
  each client.
- **Google review count/rating:** updated to 4.8★ / 192 reviews, sourced
  directly from the client's stated Google Business Profile figures
  (supplied alongside the 16 testimonials). Re-verify against the live
  profile periodically since these drift as new reviews come in.
- **Careers programme details, current team roster:** still blocked on
  real data from the client — see `next-steps.md`.
