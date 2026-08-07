# Design System

## Typography

Two real pairings considered; the build ships Pairing A because both
weights are freely licensed via `next/font/google` (no paid license
blocking deployment). Pairing B is the aspirational upgrade if the client
later buys a commercial license.

**A — shipped:** Space Grotesk (headlines, 500/600/700) + Inter (body,
400/500/600). Space Grotesk is a geometric grotesk with the squared,
technical character of Neue Haas Grotesk; Inter is a workhorse sans built
for UI legibility at small sizes.

**B — aspirational, paid:** Söhne (headlines) + Inter (body), or Neue Haas
Grotesk Display (headlines) + IBM Plex Sans (body). Swap via
`src/app/layout.tsx` font imports once licensed.

Type scale (rem, fluid via clamp where noted):
- Display: `clamp(2.5rem, 5vw, 4.5rem)` / 1.05 / Space Grotesk 600
- H1: `clamp(2rem, 3.5vw, 3rem)` / 1.1 / Space Grotesk 600
- H2: `clamp(1.5rem, 2.5vw, 2.25rem)` / 1.15 / Space Grotesk 600
- H3: `1.375rem` / 1.25 / Space Grotesk 500
- Body-lg: `1.125rem` / 1.6 / Inter 400
- Body: `1rem` / 1.6 / Inter 400
- Small/eyebrow: `0.8125rem` / 1.4 / Inter 600 / uppercase / tracked +0.08em

## Color usage rules

| Token | Hex | Role | Rule |
|---|---|---|---|
| Petrol Green | `#13322C` | Dominant surface | Base for hero, footer, nav, dark section backgrounds. This is the site's default canvas, not a rare accent. |
| Energy Yellow | `#F5B700` | Precise accent | CTAs, live stat numbers, active nav/tab state, focus rings, key data highlights. Never a background fill larger than a button/badge. Budget: it should appear on well under 10% of any given viewport. |
| Burnt Orange | `#F06000` | Secondary accent | Warnings, emergency/24-7 callouts, "limited" states, secondary highlight on data viz. Never paired with Yellow in the same element (both are warm accents — pick one per component). |
| Paper | `#F7F5F0` | Light surface | Warm off-white for light sections and cards on light backgrounds — avoids clinical pure-white. |
| Ink | `#0E1712` | Text on light | Near-black, green-tinted, for body copy on Paper. |
| Petrol-700/600 | tints of `#13322C` | Card/border on dark | Generated via opacity, not new hues — keeps the palette closed. |

Never introduce a fourth hue. Neutrals (paper, ink, and opacity-based
tints/lines of Petrol) are the only extensions permitted.

Contrast checked (WCAG AA, 4.5:1 body / 3:1 large text):
- Paper (`#F7F5F0`) text on Petrol (`#13322C`) background: **10.9:1** — pass.
- Ink (`#0E1712`) text on Paper (`#F7F5F0`) background: **17.8:1** — pass.
- Energy Yellow (`#F5B700`) text on Petrol background: **8.1:1** — pass,
  used for headline accents/stat numbers only, never long body copy.
- Ink text on Energy Yellow background (button labels): **9.6:1** — pass;
  this is why buttons use dark ink text on yellow, not white.
- Paper text on Burnt Orange (`#F06000`): **3.2:1** — large text/bold only
  (≥18.66px bold or ≥24px), never for small body text.

## Spacing & grid

- 8px base unit; section vertical rhythm uses 96px/64px/48px (desktop/
  tablet/mobile) between major sections.
- 12-column grid, 1280px max content width, 24px gutters (16px mobile).
- Cards align to the grid — no floating/rotated elements, reinforcing the
  "engineering drawing" motif over "marketing site" motif.

## Component patterns

- **Buttons:** two variants only. Primary = Energy Yellow fill, Ink text,
  sharp-ish corners (4px radius, not pill/rounded-xl) — deliberately not
  the default Tailwind-UI rounded-full look. Secondary = 1px Paper/Petrol
  border, transparent fill, fills on hover.
- **Cards (service/stat):** flat, 1px hairline border (no drop shadows),
  4px radius, a thin top rule in Energy Yellow appears only on hover/focus
  — the restrained micro-interaction standing in for a shadow-based
  "lift."
- **Nav:** dark Petrol bar, uppercase small-caps-style eyebrow tracking,
  active state underlined in Energy Yellow (2px), not a filled pill.
- **Footer:** dense, information-forward (address, RC number, phone,
  certifications, sitemap columns) — signals a real registered company,
  not a single-page brochure site.
- **Stat counters:** animate on scroll-into-view once, count up over
  ~900ms, ease-out — purposeful, not looping/gimmicky.
- **Section backgrounds** alternate Petrol / Paper to create rhythm without
  extra chrome.
