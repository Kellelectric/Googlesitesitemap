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
/industries/[slug]               Residential / Commercial / Industrial / Hospitality
/resources                       Insights/technical articles index
/resources/[slug]                Article detail
/careers                         Careers & apprenticeship programme
/contact                         Contact / quote request
/legal/terms                     Terms & Conditions
/legal/privacy                   Privacy Policy (NDPA 2023)
/sitemap.xml                     Generated (next/sitemap route)
/robots.txt                      Generated
```

## Build status for this session

Built and shipped: `/`, `/services`, `/services/[slug]` (all 16 slugs render
from real content), `/contact`, plus `sitemap.xml` and `robots.txt`.

Not yet built (see `next-steps.md`): `/about`, `/solar-energy-systems`,
`/projects` + detail pages, `/industries`, `/resources`, `/careers`,
`/legal/terms`, `/legal/privacy`. Primary navigation intentionally links
only to pages that exist in this build — no dead links — so the header
does **not** yet show About/Projects/Industries/Resources/Careers. Add
those nav items as each page ships.

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
  category: 'power' | 'security' | 'energy' | 'automation' | 'industrial'
  summary: string          // 1-sentence, used on hub cards
  description: string      // 2-3 sentences, used on detail page hero
  scope: string[]          // 4-6 bullets: what's included
  useCases: string[]       // 3 bullets: when clients need this
  flagship?: boolean       // true only for solar-inverter-systems
}
```

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

- **Projects completed (total count):** not supplied — omitted from stats
  bar rather than guessed. Add once a real number is confirmed.
- **Case studies / project financials:** per client direction, project
  contract values are not to be published on the site. If a `/projects`
  section is built later, case studies should describe scope and outcome
  without disclosing contract amounts.
- **Client logos / trust bar:** not built — no client has been confirmed
  for public logo use. Do not add logos without written permission from
  each client.
- **Google review count/rating (4.8★, 187 reviews):** used as supplied;
  re-verify against the live Google Business Profile before each site
  update, since review counts change.
