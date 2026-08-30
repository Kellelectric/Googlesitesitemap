---
version: alpha
name: Kell Electricals
description: >
  Formal record of the visual identity already shipped on this site,
  written using the DESIGN.md format (github.com/google/design.md) so any
  agent or contributor works from the same source of truth. This is a
  documentation pass, not a rebrand: every token below matches the live
  values in tailwind.config.ts and src/app/globals.css.
colors:
  primary: "#13322C"
  primary-700: "#0E2621"
  primary-600: "#1B4038"
  primary-500: "#245349"
  secondary: "#F5B700"
  tertiary: "#F06000"
  neutral: "#F7F5F0"
  on-neutral: "#0E1712"
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 3rem
    fontWeight: 600
    letterSpacing: -0.02em
  display-md:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: 600
    letterSpacing: -0.02em
  headline:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: 600
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  eyebrow:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 600
    letterSpacing: 0.08em
rounded:
  none: 0px
  control: 4px
spacing:
  section-y: 5rem
  card-padding: 1.5rem
  gutter: 1.5rem
  container-max: 1280px
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-neutral}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-secondary-on-dark:
    backgroundColor: transparent
    textColor: "{colors.neutral}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-neutral}"
    rounded: "{rounded.none}"
    padding: "24px"
  cta-band:
    backgroundColor: "{colors.primary-700}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.none}"
    padding: "80px 24px"
  section-panel-alt:
    backgroundColor: "{colors.primary-600}"
    textColor: "{colors.neutral}"
  section-panel-hover:
    backgroundColor: "{colors.primary-500}"
    textColor: "{colors.neutral}"
---

## Overview

An engineering firm's site, not a marketing agency's. Kell Electricals is
a COREN- and NEMSA-certified electrical contractor working residential,
commercial, and industrial sites in Abuja — the design has to read as
credentialed and exact before it reads as inviting. The register is closer
to an electrical schematic or a technical datasheet than a lifestyle
brand: high-contrast blocks, hairline rules, and a single warm accent
used sparingly for the one action that matters on a given screen.

The audience is a homeowner comparing contractors, a facilities manager
scoping an industrial job, and a technician checking a job spec — three
readers who all need the same thing first: is this outfit legitimate and
precise. Confidence comes from restraint, not decoration.

## Colors

A deep petrol green carries almost the entire interface, paired with a
warm off-white paper. Two accents are rationed: energy yellow drives every
primary call-to-action across the site, and burnt orange is reserved for
urgency (emergency service, alerts) so it never competes with yellow for
attention.

- **Primary — Petrol (#13322C):** The dominant surface color for hero
  sections, dark full-bleed bands, and the header/footer. Three tonal
  steps (`primary-700` #0E2621, `primary-600` #1B4038, `primary-500`
  #245349) darken or lighten it for layered dark sections without
  introducing a second hue.
- **Secondary — Energy Yellow (#F5B700):** The only color used for primary
  buttons and the single most important action on any screen (Request a
  Quote, Apply Now, Write a Review). Never used for body text or as a
  background for anything but a button or a small accent mark.
- **Tertiary — Burnt Orange (#F06000):** Reserved for urgency and warning
  contexts only — the emergency-services CTA, alert-style callouts. If
  yellow and orange both appear in the same view, orange must be the
  rarer of the two.
- **Neutral — Paper (#F7F5F0):** The light-mode canvas. A warm off-white,
  never pure white, so it sits comfortably next to the petrol dark
  sections without a jarring brightness jump.
- **On-neutral — Ink (#0E1712):** Body text and headings on paper
  backgrounds. Not pure black — it carries a faint green cast that ties
  it back to the primary hue.

## Typography

Two families split the work cleanly: **Space Grotesk** for every heading
(h1–h4, always with tight letter-spacing) and **Inter** for everything
else — body copy, labels, buttons, navigation.

- **Display (Space Grotesk, 600, -0.02em tracking):** Page `h1`s (3rem
  desktop / smaller on mobile) and section `h2`s (2.25rem). Space
  Grotesk's geometric, slightly technical character is what keeps the
  site from reading as a generic corporate brochure.
- **Headline (Space Grotesk, 600):** Card and subsection titles (1.5rem).
  Same family and tracking as display, one size down.
- **Body (Inter, 400, 1.6 line-height):** All paragraph copy. Inter at
  16px for primary reading, 14px for secondary/caption text.
- **Eyebrow (Inter, 600, uppercase, 0.08em tracking, 13px):** The small
  uppercase label that precedes almost every section heading site-wide
  ("Services", "Why Choose Kell Electricals"). It is the closest thing
  this system has to a signature typographic move — never skip it above
  a section heading, and never use a different casing or tracking for it.

## Layout

A single centered content column, capped at 1280px
(`container-content`), with 24px horizontal padding on mobile widening to
32px at the `md` breakpoint. Full-bleed sections alternate between paper
and petrol backgrounds to create rhythm down a long page without ever
introducing a second background hue.

Vertical rhythm is section-based, not grid-based: every full-bleed
section uses 80px (`5rem`) of vertical padding regardless of content
density, so the page reads as a sequence of distinct blocks rather than a
continuous scroll. Card grids use a 24px gutter and step from one column
on mobile to two or three at `sm`/`lg`.

## Elevation & Depth

Flat, deliberately. There are no drop shadows anywhere on the site.
Hierarchy is conveyed two ways only: background contrast (a dark petrol
section reads as "important" relative to the paper sections around it)
and hairline borders (`border-ink/10` on paper, `border-paper/15` on
petrol) that separate cards and list items without adding weight. If a
component needs to stand out, darken its background or add a 2px
top-border accent — never add a shadow.

## Shapes

Architectural sharpness. Cards, sections, and containers all have square
corners — no `rounded-*` class is ever applied to a card, section, or
image wrapper. The one exception is interactive controls: buttons alone
carry a minimal 4px radius (`rounded`, the Tailwind default), just enough
to soften a click target without contradicting the sharp-edged system
around it. A hairline `2px` accent border (petrol or yellow) on the top
edge of a card is the system's substitute for a rounded "featured" state.

## Components

- **Button — primary:** Energy yellow background, ink text, 4px radius,
  12px/24px padding, semibold. Used for exactly one action per view — the
  thing the visitor should do next (Request a Quote, Apply Now).
- **Button — secondary:** Transparent background with a hairline border
  (paper/40 on dark surfaces, ink/30 via `data-on-light`), inverting to a
  solid fill on hover. Used for the secondary action next to a primary
  button (Call Us, View on Google) — never used alone as the only action
  on a screen.
- **Button — ghost:** Underlined text link, no border or fill. Used
  inline, never for a standalone CTA block.
- **Card:** Paper background, `border-ink/10` hairline border, no
  rounding, 24px padding. A 2px petrol or yellow top-border marks a
  featured or highlighted variant instead of a shadow or scale transform.
- **Eyebrow label:** See Typography — always directly above a section
  `h2`, always uppercase, always the accent color appropriate to the
  section's background (petrol/70 on paper, yellow on petrol).

## Do's and Don'ts

- **Do** keep energy yellow to one primary action per screen. Two yellow
  buttons competing in the same view dilutes the "one clear next step"
  signal the whole CTA hierarchy depends on.
- **Do** reserve burnt orange for urgency/emergency contexts. It should
  never become a second "brand accent" alongside yellow.
- **Do** put an eyebrow label above every section heading. It's the
  system's most consistent typographic signature — skipping it makes a
  section look unfinished, not minimal.
- **Do** use hairline borders and background contrast for hierarchy, not
  shadows or scale.
- **Don't** round the corners of cards, sections, images, or full-bleed
  blocks. Sharp corners are structural, not a default that got missed —
  the 4px radius on buttons is the only exception in the system.
- **Don't** add drop shadows anywhere. If something needs to lift off the
  page, darken the background or add a top-border accent instead.
- **Don't** introduce a second display typeface. Space Grotesk carries
  every heading; Inter carries everything else. No third family.
- **Don't** let petrol tonal steps (700/600/500) get used interchangeably
  with the base `primary` — each is a specific section-layering role
  (e.g. `primary-700` for the darkest CTA band), not a random pick.
- **Don't** ignore `prefers-reduced-motion`. All reveal/stagger animations
  must collapse to instant with no transform when it's set.
