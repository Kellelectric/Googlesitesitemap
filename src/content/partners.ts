// No partner or supplier logos/names have been supplied for this site yet.
// Do NOT invent partnerships, logos, or brand names here — leave this array
// empty until the client provides real assets. PartnerLogos (see
// src/components/sections/PartnerLogos.tsx) renders nothing when this array
// is empty, so the Home and About pages stay clean until real data exists.
//
// To add a real partner once assets are supplied: drop the logo file under
// public/images/partners/ and add an entry below, e.g.
//   { name: 'Example Manufacturer', logo: '/images/partners/example.png', category: 'Equipment supplier', url: 'https://example.com' }
export type Partner = {
  name: string
  logo: string
  category?: string
  url?: string
}

export const partners: Partner[] = []
