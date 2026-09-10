import { company } from '@/content/company'

// Derived directly from company.serviceAreas — the single real source for
// which districts Kell Electricals covers. Do not maintain a separate list
// here or add an area not already in company.serviceAreas.
export type Area = {
  slug: string
  name: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const areas: Area[] = company.serviceAreas.map((name) => ({
  slug: slugify(name),
  name,
}))

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((area) => area.slug === slug)
}
