---
name: Kell Electricals Ltd
description: The Live Circuit — a single-line electrical diagram made dimensional, engineering method over marketing claim.
colors:
  petrol: "#13322C"
  petrol-700: "#0E2621"
  petrol-600: "#1B4038"
  petrol-500: "#245349"
  yellow: "#F5B700"
  orange: "#F06000"
  copper: "#B8733A"
  paper: "#F7F5F0"
  ink: "#0E1712"
typography:
  display:
    fontFamily: "Space Grotesk, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  sm: "4px"
spacing:
  section-lg: "96px"
  section-md: "64px"
  section-sm: "48px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.yellow}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
---

# Design System: Kell Electricals Ltd

## Overview

**Creative North Star: "The Live Circuit"**

The site is a single-line electrical diagram made dimensional. A visitor doesn't scroll past marketing sections — they trace current from grid intake through distribution to a load, and the load node is the conversion action. Every 3D object that appears is something Kell Electricals' engineers actually draw, install, or test — a panel, a busbar, a breaker — never a decorative abstraction. The 2D pages (services, about, legal) carry the same palette, type, and material logic at a lighter footprint: this is one system operating at two intensities, not two systems.

The system rejects the "local electrician" visual vocabulary on purpose — no caution-tape yellow/black, no stock photography of thumbs-up hard hats, no exclamation points. Restraint is the credibility signal: Petrol is the dominant surface, Energy Yellow is a precise, rationed accent, and copy states scope and method rather than asserting quality.

**Key Characteristics:**
- Dark Petrol as the default canvas, not an occasional dark-mode section
- Energy Yellow reserved for CTAs, live/active states, and instrument readouts — never a large fill
- A dedicated monospace face exists only to carry data (credentials, stats, coordinates), and is banned from headlines and body copy
- 3D budget is spent where conversion intent is highest (the home hero) and drops to zero below 1024px width or under `prefers-reduced-motion`, where a static SVG frame stands in

## Colors

Closed palette — five hues plus two neutrals. No sixth hue without a documented reason (Copper was added this build specifically because real busbars are copper, not for mood).

### Primary
- **Energy Yellow** (`#F5B700`): The only warm, saturated color permitted to read as "action." CTAs, live circuit traces, active nav underline, focus rings, instrument readout digits. Budget: under 10% of any viewport. Never a background fill larger than a button or a lit indicator.

### Secondary
- **Burnt Orange** (`#F06000`): Warning/heat register — emergency-line emphasis, thermal/overload states. Never paired with Yellow in the same element; both are warm accents, pick one per component.
- **Copper** (`#B8733A`): Real hardware material, not a mood color — busbar geometry in the 3D scene, and the corner-rivet / bezel detailing on instrument-panel components in 2D. Used at low opacity for structural bezels (`copper/20`–`/30`), full strength only on small marks (corner dots, the RC-number readout).

### Neutral
- **Petrol** (`#13322C`) / **Petrol-700** (`#0E2621`) / **Petrol-600** (`#1B4038`) / **Petrol-500** (`#245349`): The dominant surface family — base canvas, card backgrounds, WebGL scene fog/background, unlit circuit traces. Petrol-700 reads as "recessed" (canvas/scene background), Petrol-600 as "panel" (a section or plate sitting on the canvas).
- **Paper** (`#F7F5F0`): Light-mode surface for body-content sections (service detail copy, about, legal). Warm off-white, never clinical pure white.
- **Ink** (`#0E1712`): Text on Paper.

### Named Rules
**The Rationed Accent Rule.** Energy Yellow signals "live" or "actionable" and nothing else. If an element isn't a call to action, a lit/active state, or a data readout, it doesn't get yellow.

**The One Hue at a Time Rule.** Burnt Orange and Energy Yellow never co-occur in a single component — both are warm accents and stacking them collapses the "which one means what" signal the palette depends on.

## Typography

**Display Font:** Space Grotesk (with Arial Narrow, sans-serif fallback)
**Body Font:** Inter (with -apple-system, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** A geometric grotesk (Space Grotesk) with the squared, technical character of an engineering typeface, paired with a workhorse UI sans (Inter) for legibility at small sizes, plus a true monospace reserved exclusively for the moments the page is quoting an instrument rather than talking to the visitor.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 6vw, 5.25rem)`, 0.98 line-height, -0.01em tracking): Hero H1 only. Set with `[text-wrap:balance]`.
- **Headline** (600, `clamp(1.5rem, 2.5vw, 2.25rem)`, 1.15): Section H2s.
- **Title** (500, 1.375rem, 1.25): Card/component H3s.
- **Body** (400, 1rem, 1.6): Paragraph copy, 65–75ch measure.
- **Label/Mono** (400–500, 0.8125rem, 0.06em tracking): Instrument and credential readouts (RC number, certification strip, meter-plate digits, HUD coordinates). Digits set `tabular-nums`.
- **Micro-label** (400, 0.7rem, 0.08–0.1em tracking, uppercase): Fieldset legends and compact instrument captions where 0.8125rem reads too heavy — form-step legends ("01 · What's this appointment for"), ticket-row labels, date-chip weekday/month. Same mono/uppercase treatment as Label, one step down; never used for anything a visitor reads as prose.

### Named Rules
**The Instrument-Only Mono Rule.** JetBrains Mono renders data — numbers, IDs, coordinates, certifications — never a headline, a button label, or a sentence of body copy. The moment mono type carries prose, it has become a costume instead of a readout.

**No Kicker Rule.** No small tracked label sits above a headline as an eyebrow to introduce a section. The heading carries its own weight. (A category tag *inside* a card, e.g. "Power Systems" above a service name, is a classification label on repeated content, not this pattern, and stays permitted.)

## Layout

12-column grid, 1280px max content width (`max-w-content`), 24px gutters (16px on mobile), via the shared `.container-content` utility. Section vertical rhythm: 96px desktop / 64px tablet / 48px mobile between major sections — more space above a heading than below it. Sections alternate Petrol and Paper backgrounds to create rhythm without added chrome.

3D scenes are viewport-gated, not just visually hidden: the hero's WebGL canvas doesn't mount below 1024px width (`src/components/three/HeroScene.tsx`), so mobile pays zero WebGL cost rather than a hidden-but-loaded one.

## Elevation & Depth

Mostly flat by design — the "engineering drawing" register uses hairline borders and tonal layering (Petrol-700 vs Petrol-600) over drop shadows. Where a shadow appears, it always carries a real offset and blur (never a zero-offset colored halo), signaling a physically-recessed instrument face rather than a decorative card lift.

### Shadow Vocabulary
- **panel** (`box-shadow: 0 10px 30px -16px rgba(0,0,0,0.7)`): The instrument-panel bezel (`StatsBar`) — one shadow on the whole panel, not per-item.
- **plate** (`box-shadow: 0 8px 20px -12px rgba(0,0,0,0.6)`): A standalone recessed plate/card.

### Named Rules
**The One Shadow Per Cluster Rule.** A group of related instruments (e.g. the four trust-metric gauges) sits inside one bezeled panel with one shadow and internal dividers — never one shadow per item. Four separately-lifted cards is the "hero-metric template" the floor bans; one panel with four readouts is an instrument.

## Shapes

4px corner radius as the system default (`borderRadius.DEFAULT` in Tailwind config) — deliberately not the rounded-xl/pill look of default Tailwind UI. Circuit traces and panel edges are orthogonal (right-angle routing), matching real single-line-diagram convention; no organic or diagonal geometry anywhere in the 3D language.

## Components

### Buttons
- **Shape:** 4px radius (`rounded`, the Tailwind default override).
- **Primary:** Yellow fill (`bg-yellow`), Ink text, `px-6 py-3`, semibold, tracked.
- **Secondary:** 1px Paper/40 border, transparent fill, fills solid on hover (`hover:bg-paper hover:text-ink`).
- **Ghost:** Ink text, underline, used inline in body copy only.
- **Focus:** 2px Yellow outline, 2px offset, on every variant.

### Meter Plate (signature component)
The trust-metric instrument introduced this build, replacing a conventional stat-counter grid. One bezeled panel (Petrol-700/50, Copper/25 border, corner-dot rivets, single panel-level shadow) hosts 2–4 readouts side by side, divided by hairline rules rather than gaps between separate cards. The panel's most persuasive, genuinely-bounded metric (a /5 rating) leads at a larger type size with a 5-light indicator ladder; unbounded counts (years, zones, "24/7") get a plain tabular-nums mono readout plus a fixed decorative tick scale — never a fabricated 0–100% arc implying a maximum that doesn't exist. Values settle with a back-out ease (slight mechanical overshoot, then rest) on first scroll into view, once, never looping.

### Cards
- **Corner style:** 0 radius (hairline, not rounded) — a deliberate deviation from the 4px system default, reinforcing the "engineering drawing" register over "product card."
- **Background:** Paper on light sections; Petrol-700/60 on dark instrument panels.
- **Border:** 1px `ink/10` (light) or `paper/10` (dark); brightens to Yellow on hover.
- **Signature detail:** a 2px top rule in Energy Yellow that grows from 0 to full width on hover — the restrained stand-in for a drop-shadow "lift."

### Navigation
Fixed (not in-flow) header, transparent over every page's dark hero, solidifying to a filled Petrol bar with a hairline border once the page scrolls past ~120px. Desktop: horizontal links, mono-adjacent uppercase tracked labels, Yellow 2px underline on the active/hover state. Mobile: hamburger opens a full-bleed Petrol overlay.

## Do's and Don'ts

### Do:
- **Do** treat every 3D object as real hardware — panel, busbar, breaker, inverter — never an abstract decorative form.
- **Do** gate WebGL behind a width check (currently 1024px) and `prefers-reduced-motion`, with a static SVG/CSS frame as the fallback, never a spinner or blank space.
- **Do** settle animated numbers with a back-out ease once per view, never on a loop.
- **Do** keep the RC number / certification strip in the instrument-mono voice, positioned as data below the primary CTA, not as a badge above the headline.

### Don't:
- **Don't** put a tracked eyebrow label above a page-level heading (Hero, section H2s) — removed from the Hero in this build specifically because of this rule; do not reintroduce it.
- **Don't** render four related metrics as four separately-shadowed, identically-shaped cards — that is the "hero-metric template" the craft floor bans. Use one bezeled panel with internal dividers instead.
- **Don't** fabricate a proportional gauge (an arc, a percentage ring) for a metric with no real maximum. Reserve the needle/ladder treatment for genuinely bounded values (a /5 rating).
- **Don't** let JetBrains Mono carry a headline, button label, or body sentence.
- **Don't** mix Burnt Orange and Energy Yellow in the same component.
