export type FieldTool = {
  slug: string
  label: string
  summary: string
}

// The four capabilities behind every site visit — grounded in the actual
// stages of the field team's own load-audit platform (Load Audit, Cable &
// Protection, Solar & Generator, Inspection), translated into what a
// client actually gets from each, not the internal tool's own labels.
export const fieldTools: FieldTool[] = [
  {
    slug: 'load-audits',
    label: 'Load audits',
    summary:
      'Circuit-level consumption measured on site, not estimated — the same audit that seeds every sizing recommendation that follows it.',
  },
  {
    slug: 'cable-protection-sizing',
    label: 'Cable & protection sizing',
    summary:
      'Every cable run and protective device sized to the measured load and logged against the job’s own single-line diagram, not a rule of thumb.',
  },
  {
    slug: 'solar-generator-sizing',
    label: 'Solar & generator sizing',
    summary:
      'Panel, battery, inverter, and generator capacity sized from real consumption data and backup priorities — the grid you actually have, not a generic panel count.',
  },
  {
    slug: 'standards-referenced-inspections',
    label: 'Standards-referenced inspections',
    summary:
      'Findings checked against COREN/NEMSA-referenced checklists on site, with photo evidence attached to each finding — not a verbal walk-through.',
  },
]
