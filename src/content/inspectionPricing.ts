import { areas } from '@/content/areas'

// Real pricing, confirmed by the client. Residential is the only
// property type priced per area - split into two distance tiers rather
// than a fixed number per area. Client explicitly named Wuse, Wuse 2,
// Gwarinpa, and Maitama as the near/"within town" tier; the remaining 12
// areas were split by the client confirming Claude's own suggested
// geographic grouping (Central Business District, Garki, Asokoro,
// Utako, Jabi, Katampe, and Guzape as near/≤15km; Kubwa, Lugbe, Life
// Camp, Apo, and Lokogoma as the >15km tier) - not invented.
const NEAR_AREA_SLUGS = [
  'wuse',
  'wuse-2',
  'gwarinpa',
  'maitama',
  'central-business-district',
  'garki',
  'asokoro',
  'utako',
  'jabi',
  'katampe',
  'guzape',
]

export type ResidentialTier = 'near' | 'far'

export type InspectionArea = {
  slug: string
  name: string
  tier: ResidentialTier
}

export const inspectionAreas: InspectionArea[] = areas.map((area) => ({
  slug: area.slug,
  name: area.name,
  tier: NEAR_AREA_SLUGS.includes(area.slug) ? 'near' : 'far',
}))

// Residential: near tier is a flat fee with/without a report; far tier is
// a range (the client gave one range for that tier, not a with/without
// report split).
export const residentialPricing = {
  near: { withoutReport: 70000, withReport: 100000 },
  far: { min: 100000, max: 150000 },
}

// Commercial and industrial inspections aren't priced per area - one
// range applies across all of Abuja for each.
export const commercialPricing = { min: 80000, max: 800000 }
export const industrialPricing = {
  min: 300000,
  max: 800000,
  note: 'Includes a full inspection report.',
}

// A full electrical inspection & audit (distinct from a standard
// inspection above) - also not tied to area.
export const electricalAuditPricing = {
  min: 300000,
  max: 2000000,
  note: 'Includes an electrical plan.',
}
