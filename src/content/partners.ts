// Real partner/supplier logos, supplied directly by the client. Do NOT
// invent partnerships, logos, or brand names beyond what's supplied here.
// PartnerLogos (see src/components/sections/PartnerLogos.tsx) renders
// nothing when this array is empty.
//
// To add another once supplied: drop the logo file under
// public/images/partners/ and add an entry below, e.g.
//   { name: 'Example Manufacturer', logo: '/images/partners/example.png', category: 'Equipment supplier', url: 'https://example.com' }
export type Partner = {
  name: string
  logo: string
  category?: string
  url?: string
}

export const partners: Partner[] = [
  {
    name: 'Schneider Electric',
    logo: '/images/partners/schneider-electric.png',
    category: 'Equipment supplier',
  },
  {
    name: 'Hager',
    logo: '/images/partners/hager.png',
    category: 'Equipment supplier',
  },
  {
    name: 'SIASE',
    logo: '/images/partners/siase.png',
    category: 'Equipment supplier',
  },
  {
    name: 'CHINT',
    logo: '/images/partners/chint.png',
    category: 'Equipment supplier',
  },
  {
    name: 'Deye',
    logo: '/images/partners/deye.png',
    category: 'Equipment supplier',
  },
  {
    name: 'ABB',
    logo: '/images/partners/abb.png',
    category: 'Equipment supplier',
  },
  {
    name: 'Vell.Max',
    logo: '/images/partners/vell-max.png',
    category: 'Equipment supplier',
  },
  {
    name: 'Siemens',
    logo: '/images/partners/siemens.png',
    category: 'Equipment supplier',
  },
  {
    name: 'Legrand',
    logo: '/images/partners/legrand.png',
    category: 'Equipment supplier',
  },
  {
    name: 'JA Solar',
    logo: '/images/partners/ja-solar.png',
    category: 'Equipment supplier',
  },
  {
    name: 'JinkoSolar',
    logo: '/images/partners/jinko-solar.png',
    category: 'Equipment supplier',
  },
  {
    name: 'Felicity Solar',
    logo: '/images/partners/felicity-solar.png',
    category: 'Equipment supplier',
  },
]
