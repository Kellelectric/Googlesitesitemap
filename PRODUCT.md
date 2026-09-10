# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: facilities managers, homeowners, and business/industrial site operators in Abuja (Wuse 2, Gwarinpa, Central Business District, Guzape, Asokoro, Maitama, Katampe) and wider Nigeria who need electrical infrastructure work — new installation, panel/inverter upgrades, solar/hybrid systems, industrial power, or emergency fault response — done by a certified team, and who evaluate contractors on verifiable credentials and process, not marketing claims.

Secondary: procurement officers and property managers scoping commercial/industrial contracts, who specifically look for COREN/NEMSA certification and documented process before shortlisting a contractor.

## Product Purpose

Kell Electricals Ltd is a COREN- and NEMSA-certified electrical engineering contractor. The website's job is to convert a visitor with an electrical need (wiring, panel repair, solar/hybrid inverter systems, security/automation, industrial power, emergency response, or one of the other 16 service lines) into a submitted quote request or an emergency call/WhatsApp contact, by demonstrating engineering rigor and reliability rather than asserting it.

## Positioning

"The engineering partner Abuja's homes, businesses, and industrial sites call when electrical infrastructure has to work the first time and every time." Differentiator: a documented, disciplined process (assess → design → install → test & handover) applied to every job regardless of size, backed by COREN/NEMSA certification and 15+ years of continuous operation — where competitors sell labor, Kell Electricals sells engineering method with paper trail (circuit schedules, single-line diagrams, as-built documentation).

## Operating Context

- Visitors arrive either planning a project (new build, rewire, solar system) or reacting to a fault/outage (time-pressured, may be using the 24/7 emergency line or WhatsApp from a phone).
- The quote form is the primary conversion action; it branches by service type, urgency, and location zone and posts to `src/app/api/quote/route.ts`.
- 16 service lines across 5 categories (Power Systems, Energy & Solar, Security & Automation, Industrial, Maintenance & Response) are modeled in `src/content/services.ts`.
- Solar & Inverter Systems is the flagship service — Nigeria's unreliable grid makes it the most consequential purchase decision on the site and gets a dedicated deep page.

## Capabilities and Constraints

- Existing codebase: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion. React Three Fiber + drei + three already added for the hero's 3D scene (Phase 1 shipped: ignition-sweep single-line diagram, transparent-to-solid header).
- Case studies with contract values must not be published (client direction) — scope, sector, and outcome only, no ₦ amounts.
- No stock photography or clip-art bolts anywhere in the system — circuit-trace linework and, going forward, the 3D circuit language stand in for photography until real jobsite photography is supplied.
- No named individuals in public copy — "our team," "our engineers" only; the company is positioned as institutional, built to outlast any one person.
- Mobile must not pay the WebGL cost: below 768px width the site already falls back to the flat CircuitLines SVG; this constraint carries forward into any new work.
- No image generation tool is available in this environment — all visual work is code-first (SVG, CSS, WebGL/three.js primitives), not image-comp-first.

## Brand Commitments

- Name: Kell Electricals Ltd (legal: Kell Electricals Limited), RC 1852579.
- Tagline: "Engineering Trust. Powering Lives."
- Voice: precise over promotional, confident and understated, plural/institutional, numbers over adjectives (see `docs/` positioning doc for the full voice rules — no exclamation points, no manufactured urgency).
- Committed visual direction: **The Live Circuit** — the site as a single-line electrical diagram made dimensional; the visitor traces current from grid intake through distribution to the load, and the "load" node is the conversion CTA. Full spec already produced and approved by the user as two design documents (creative direction + section-by-section UX map) and partially implemented (hero scene). This direction is committed, not open for replacement — Impeccable's job from here is executing it to a materially higher craft bar (composition, lighting/material fidelity, motion precision, detail), not proposing an alternative.
- Palette (fixed, do not introduce a fourth hue): Petrol `#13322C` (dominant surface), Energy Yellow `#F5B700` (precise accent, CTAs/live states, <10% of any viewport), Burnt Orange `#F06000` (secondary/warning accent), Copper `#B8733A` (busbar material — the one addition beyond the original 2D brand system, justified by real electrical hardware), Paper `#F7F5F0` (light surface), Ink `#0E1712` (text on light).
- Typography (fixed): Space Grotesk (display, 500/600/700) + Inter (body, 400/500/600), both via `next/font/google`, already wired in `src/app/layout.tsx`. JetBrains Mono added for instrument/data readouts only (voltage/amperage labels, coordinates, HUD eyebrows) — never headlines or body copy.
- Certifications named explicitly only in About/Compliance sections and credential chips, never in hero headlines.

## Evidence on Hand

- Full content model already in code: `src/content/company.ts` (facts: 15+ years, 4.8★/187 Google reviews, 7 service zones, phone/WhatsApp/email/address), `src/content/services.ts` (all 16 services with summary/description/scope/use-cases), `src/content/process.ts` (4-step Assess/Design/Install/Test & Handover), `src/content/nav.ts`.
- No case-study data, no careers/apprenticeship data, no real jobsite photography yet — do not fabricate; state absence rather than inventing testimonials or numbers beyond what's in `company.ts`.
- Two prior design documents (published as Claude artifacts, not in-repo): "The Live Circuit" (creative direction — concept, palette, type, lighting, materials, 3D elements, motion, conversion goal) and "Circuit Map" (full hero-to-footer UX/UI spec: nav, 9 home-page scroll beats, interior pages, forms, FAQ, mobile fallback states). Treat both as the authoritative brief for `new-work`/`shape` — do not re-derive from scratch.
- Phase 1 already shipped in this codebase: `src/components/three/HeroCircuitScene.tsx` and `HeroScene.tsx` (ignition-sweep hero circuit, capability-gated to ≥768px width, reduced-motion-safe), transparent-to-solid `Header.tsx`.

## Product Principles

1. Every 3D object on the site must be something Kell Electricals' engineers actually draw, install, or test (panel, busbar, breaker, inverter, earthing rod) — nothing decorative that the brand can't defend in a client meeting.
2. Motion always represents energy transfer or a real mechanical action (current flowing, a door hinging, a needle settling) — no idle/ambient animation without a motivated reason, one exception (the always-on WhatsApp/emergency-line pulse).
3. 3D spend is proportional to conversion intent: full traversed-circuit budget on Home; one hero object on interior pages; zero WebGL below 768px width or under prefers-reduced-motion (frozen lit end-frame instead).
4. Certifications and numbers do the persuading, not adjectives — restraint itself is a credibility signal for an institutional/enterprise buyer.
5. Nothing ships that regresses the existing Lighthouse/accessibility/lint baseline; usability and keyboard/screen-reader operability are non-negotiable under the visual ambition.

## Accessibility & Inclusion

WCAG AA already validated for the base palette (see design-system doc: Paper-on-Petrol 10.9:1, Ink-on-Paper 17.8:1, etc.). `prefers-reduced-motion` must freeze every 3D scene on a static lit frame rather than removing it or leaving it mid-animation. All interactive 3D affordances (breaker rows, service toggles) need a non-hover/non-hover-only path for touch and keyboard.
