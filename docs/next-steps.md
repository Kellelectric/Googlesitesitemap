# Next Steps

## Remaining pages (in suggested build order)

1. **`/about`** — company story, mission, COREN/NEMSA/RC 1852579 compliance
   section, role-based team (no named individuals per brand voice), Nigeria/
   West Africa footprint map. Add "About" to primary nav once live.
2. **`/solar-energy-systems`** — flagship product-style treatment for solar/
   hybrid (load analysis, sizing methodology, system tiers, financing note if
   applicable). The current `/services/solar-inverter-systems` detail page
   can seed this content but the flagship page should go deeper (diagrams,
   sizing calculator or worked example, financing/payback framing).
3. **`/projects`** — case studies hub. Per client direction, contract
   values/amounts are not to be published on the site — case studies should
   describe scope, sector, and outcome only. **Needs real data before
   publishing:** scope breakdown, before/after photos, timeline — confirm
   with the client/ops team, do not estimate. Filterable by sector
   (residential/commercial/industrial) and service type once 3+ case
   studies exist.
4. **`/industries`** hub + sector pages (residential, commercial, industrial,
   hospitality) — mostly recombination of existing service content by
   audience; low effort once `/services` content is final.
5. **`/resources`** — technical articles/energy audit guides for SEO and
   authority. Suggest starting with 3 articles tied to real search intent:
   "How to size a hybrid inverter system in Nigeria," "What NEMSA compliance
   actually requires for a commercial fit-out," "Signs your panel needs
   upgrading before it fails."
6. **`/careers`** — apprenticeship programme details. **Needs real data:**
   programme structure, duration, intake schedule, eligibility — currently
   no source material provided.
7. **`/legal/terms`** and **`/legal/privacy`** — Privacy Policy must be
   NDPA 2023 compliant (lawful basis, data subject rights, DPO contact if
   designated, breach notification). Do not publish a generic template;
   have this reviewed by counsel before launch given NDPA enforcement risk.

## Functional work

- **Wire the contact/quote form to a backend.** Form schema
  (`src/content` + form component) is already service-type-branched and
  structured to map cleanly onto Zoho Forms/Books fields. Needs: a Zoho
  Forms endpoint or a serverless route (`app/api/quote/route.ts`) that
  forwards to Zoho, plus spam protection (hCaptcha or similar) before
  going live.
- **WhatsApp click-to-chat.** Phone number is present; add a WhatsApp deep
  link (`wa.me/2348140205895`) alongside the phone CTA in header/footer/
  contact page once confirmed that number is WhatsApp-enabled.
- **Real photography.** Every image slot in the current build is a
  composited/illustrative placeholder using the brand's linework system —
  no stock photography was used. Replace with real jobsite photography
  (control panels, technicians, solar installs, thermal imaging) as it
  becomes available; keep the blueprint/circuit-trace overlay treatment for
  consistency.
- **Analytics + Search Console.** Add GA4 (or privacy-friendlier
  alternative) and verify Google Search Console once the domain is live;
  submit `sitemap.xml`.
- **Domain/hosting decision.** Confirm `kellelectricals.com` DNS points at
  the new Vercel deployment and whether the existing Google Sites/other
  Vercel/Netlify properties are retired or redirected (301s from old
  Google Sites URLs in the legacy `sitemap9.xml` to their new equivalents
  would preserve any existing SEO equity).

## Content still needed from the client (do not fabricate)

- Total completed-projects count (for the homepage stats bar).
- Case study detail for any project to be featured on a future `/projects`
  page (scope, sector, outcome — no contract amounts).
- Careers/apprenticeship programme specifics.
- Any additional named client references cleared for public use as a trust
  bar (logos require written permission per client).
- Confirmation that +234 814 020 5895 is WhatsApp-enabled.

## Dependency note

Shipped on Next.js 14.2.35 (latest patched 14.x) rather than the newer
Next 16 major. `npm audit` flags several CVEs in the 14.x→16.3.0 range, but
they concern Middleware, Server Actions, and custom Image Optimization
`remotePatterns` — none of which this build currently uses (no middleware,
no server actions, no `next/image` remote patterns configured). Re-evaluate
before adding any of those features, or when scheduling a Next 15/16
upgrade.

## Testing before launch

- Run Lighthouse (mobile + desktop) on all shipped pages; target 90+ across
  Performance/Accessibility/Best Practices/SEO.
- Manually verify color contrast on any new component combining Petrol/
  Yellow/Orange against the ratios documented in `design-system.md`.
- Validate structured data with Google's Rich Results Test once deployed.
