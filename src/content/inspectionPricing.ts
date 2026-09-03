import { areas } from '@/content/areas'

// Site inspection fees, by area - the client said these would be sent
// separately and has not yet supplied the real per-area figures, so every
// fee here is `null` (never a placeholder number) until the client
// confirms them. InspectionPricing.tsx renders a "confirm your fee" call
// to action for any area with a `null` fee rather than showing a made-up
// price - do not fill these in with invented amounts.
export type InspectionFee = {
  slug: string
  name: string
  fee: number | null
}

export const inspectionFees: InspectionFee[] = areas.map((area) => ({
  slug: area.slug,
  name: area.name,
  fee: null,
}))

// Building audits are priced per property after scope review (size,
// number of circuits/panels, occupied vs. under-construction, etc.) -
// never a fixed number, unlike the flat per-area inspection fee above.
export const buildingAuditNote =
  'A full building electrical audit is scoped and priced per property - not a fixed fee like a standard inspection. Book a site visit below and we will confirm the price after reviewing the property.'
