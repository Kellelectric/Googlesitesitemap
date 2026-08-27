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
/careers                         Careers & apprenticeship programme
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
`/contact`, `/legal/terms`, `/legal/privacy` (drafted, see caveat below),
plus `sitemap.xml` and `robots.txt`.

Not yet built: `/projects` + detail pages, `/careers`. Both are blocked on
real client data per the anti-fabrication rule (see "Content still needed
from the client" below) — do not build these with invented content.

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
- **Google review count/rating:** rating (4.9★) sourced from the live
  site's content extract; review count (187) is still an earlier
  unverified figure — re-verify both against the live Google Business
  Profile before the next site update.
- **Testimonials, careers programme details, current team roster:** still
  blocked on real data from the client — see `next-steps.md`.
