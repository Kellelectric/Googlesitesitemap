// Reference data for the load and solar sizing calculators
// (src/app/calculators, plus the homepage solar widget).
//
// Appliance wattages below are commonly cited, publicly available typical
// figures (the kind found in any electrical/solar sizing reference) — they
// are NOT Kell Electricals-specific measurements or claims. Every
// calculator built from this data is labeled as an indicative planning
// estimate, not a substitute for a real load assessment, consistent with
// how /solar-energy-systems already frames its own worked example
// ("your actual numbers come from your own consumption audit, not this
// example"). Do not remove that framing when editing these calculators.

export type ApplianceCategory = {
  key: string
  label: string
  watts: number
}

// Generic, widely-used approximate running wattages. Editable — these are
// planning defaults, not fixed facts.
export const applianceCatalog: ApplianceCategory[] = [
  { key: 'led-bulb', label: 'LED bulb', watts: 10 },
  { key: 'ceiling-fan', label: 'Ceiling fan', watts: 75 },
  { key: 'standing-fan', label: 'Standing fan', watts: 60 },
  { key: 'fridge', label: 'Refrigerator (medium)', watts: 150 },
  { key: 'freezer', label: 'Chest freezer', watts: 200 },
  { key: 'tv', label: 'TV (LED, 40–55")', watts: 100 },
  { key: 'laptop', label: 'Laptop', watts: 65 },
  { key: 'desktop', label: 'Desktop computer', watts: 200 },
  { key: 'router', label: 'Router / modem', watts: 15 },
  { key: 'microwave', label: 'Microwave', watts: 1200 },
  { key: 'kettle', label: 'Electric kettle', watts: 1800 },
  { key: 'washing-machine', label: 'Washing machine', watts: 500 },
  { key: 'iron', label: 'Electric iron', watts: 1000 },
  { key: 'ac-1.5hp', label: 'Air conditioner (1.5HP)', watts: 1300 },
  { key: 'water-heater', label: 'Water heater', watts: 3000 },
  { key: 'printer', label: 'Printer / photocopier', watts: 300 },
  { key: 'pos', label: 'POS machine', watts: 30 },
  { key: 'security-light', label: 'Security / flood light', watts: 100 },
  { key: 'cctv', label: 'CCTV recorder (DVR/NVR)', watts: 50 },
  { key: 'power-tool', label: 'Power tool (drill, grinder, etc.)', watts: 600 },
  { key: 'welder', label: 'Small welding machine', watts: 3500 },
]

function findWatts(key: string): number {
  return applianceCatalog.find((a) => a.key === key)?.watts ?? 0
}

export type BuildingType = {
  slug: string
  label: string
  // Sensible starting quantities for this building type — fully editable
  // by the user in the calculator, not a fixed spec.
  defaults: { key: string; quantity: number }[]
}

export const buildingTypes: BuildingType[] = [
  {
    slug: 'residential-apartment',
    label: 'Residential — Apartment / Flat',
    defaults: [
      { key: 'led-bulb', quantity: 8 },
      { key: 'ceiling-fan', quantity: 2 },
      { key: 'fridge', quantity: 1 },
      { key: 'tv', quantity: 1 },
      { key: 'router', quantity: 1 },
      { key: 'ac-1.5hp', quantity: 1 },
      { key: 'washing-machine', quantity: 1 },
      { key: 'iron', quantity: 1 },
    ],
  },
  {
    slug: 'residential-house',
    label: 'Residential — Family Home',
    defaults: [
      { key: 'led-bulb', quantity: 16 },
      { key: 'ceiling-fan', quantity: 4 },
      { key: 'fridge', quantity: 1 },
      { key: 'freezer', quantity: 1 },
      { key: 'tv', quantity: 2 },
      { key: 'router', quantity: 1 },
      { key: 'ac-1.5hp', quantity: 3 },
      { key: 'washing-machine', quantity: 1 },
      { key: 'water-heater', quantity: 2 },
      { key: 'iron', quantity: 1 },
      { key: 'microwave', quantity: 1 },
    ],
  },
  {
    slug: 'office',
    label: 'Office',
    defaults: [
      { key: 'led-bulb', quantity: 20 },
      { key: 'ceiling-fan', quantity: 2 },
      { key: 'ac-1.5hp', quantity: 4 },
      { key: 'desktop', quantity: 8 },
      { key: 'laptop', quantity: 4 },
      { key: 'printer', quantity: 2 },
      { key: 'router', quantity: 2 },
      { key: 'security-light', quantity: 2 },
      { key: 'cctv', quantity: 1 },
    ],
  },
  {
    slug: 'retail',
    label: 'Retail Shop',
    defaults: [
      { key: 'led-bulb', quantity: 12 },
      { key: 'ceiling-fan', quantity: 2 },
      { key: 'ac-1.5hp', quantity: 1 },
      { key: 'fridge', quantity: 1 },
      { key: 'pos', quantity: 2 },
      { key: 'security-light', quantity: 2 },
      { key: 'cctv', quantity: 1 },
    ],
  },
  {
    slug: 'workshop',
    label: 'Workshop / Light Industrial',
    defaults: [
      { key: 'led-bulb', quantity: 10 },
      { key: 'security-light', quantity: 4 },
      { key: 'power-tool', quantity: 2 },
      { key: 'welder', quantity: 1 },
      { key: 'cctv', quantity: 1 },
    ],
  },
]

export function getBuildingTypeBySlug(slug: string): BuildingType | undefined {
  return buildingTypes.find((b) => b.slug === slug)
}

export { findWatts }
