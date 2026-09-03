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

export type ServiceCategory = 'residential' | 'commercial' | 'industrial' | 'electrical-audit'
export type ReportChoice = 'without' | 'with'

export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'electrical-audit', label: 'Electrical Inspection & Audit' },
]

export function getResidentialTier(areaSlug: string): ResidentialTier | undefined {
  return inspectionAreas.find((a) => a.slug === areaSlug)?.tier
}

// Human-readable price line for a category (+ area/report choice for
// residential) - used to show a visitor what they're booking, before any
// payment is involved.
export function describePrice(
  category: ServiceCategory,
  areaSlug: string | null,
  reportChoice: ReportChoice | null,
): string | null {
  if (category === 'residential') {
    if (!areaSlug) return null
    const tier = getResidentialTier(areaSlug)
    if (tier === 'near') {
      return reportChoice === 'with'
        ? `₦${residentialPricing.near.withReport.toLocaleString('en-NG')} (with a custom report)`
        : `₦${residentialPricing.near.withoutReport.toLocaleString('en-NG')} (without a report)`
    }
    if (tier === 'far') {
      return `₦${residentialPricing.far.min.toLocaleString('en-NG')} - ₦${residentialPricing.far.max.toLocaleString('en-NG')}`
    }
    return null
  }
  if (category === 'commercial') {
    return `₦${commercialPricing.min.toLocaleString('en-NG')} - ₦${commercialPricing.max.toLocaleString('en-NG')}`
  }
  if (category === 'industrial') {
    return `₦${industrialPricing.min.toLocaleString('en-NG')} - ₦${industrialPricing.max.toLocaleString('en-NG')}`
  }
  return `From ₦${electricalAuditPricing.min.toLocaleString('en-NG')} - ₦${electricalAuditPricing.max.toLocaleString('en-NG')}`
}

// Returns a single exact amount (in Naira) only when the category and
// selections pin down one definite number - the residential near tier,
// once a with/without-report choice is made. Everything else (the
// residential far tier, commercial, industrial, electrical audit) is
// priced as a range, so there is no single figure to charge upfront:
// those bookings proceed without a payment gate, and the real fee is
// settled after scoping/on-site, same as before this round.
export function computeExactPrice(
  category: ServiceCategory,
  areaSlug: string | null,
  reportChoice: ReportChoice | null,
): number | null {
  if (category !== 'residential' || !areaSlug || !reportChoice) return null
  if (getResidentialTier(areaSlug) !== 'near') return null
  return reportChoice === 'with'
    ? residentialPricing.near.withReport
    : residentialPricing.near.withoutReport
}
