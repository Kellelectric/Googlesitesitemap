export const company = {
  name: 'Kell Electricals Ltd',
  legalName: 'Kell Electricals Limited',
  rcNumber: '1852579',
  tagline: 'Engineering Trust. Powering Lives.',
  positioning:
    "The engineering partner Abuja's homes, businesses, and industrial sites call when electrical infrastructure has to work the first time and every time.",
  phone: '+234 814 020 5895',
  phoneHref: 'tel:+2348140205895',
  whatsappHref: 'https://wa.me/2348140205895',
  email: 'info@kellelectricals.com',
  address: {
    street: '741 Alexandria Crescent',
    district: 'Wuse 2',
    city: 'Abuja',
    country: 'Nigeria',
    full: '741 Alexandria Crescent, Wuse 2, Abuja, Nigeria',
  },
  yearsExperience: 15,
  certifications: [
    {
      name: 'COREN',
      fullName: 'Council for the Regulation of Engineering in Nigeria',
    },
    {
      name: 'NEMSA',
      fullName: 'Nigerian Electricity Management Services Agency',
    },
  ],
  serviceAreas: [
    'Wuse 2',
    'Gwarinpa',
    'Central Business District',
    'Guzape',
    'Asokoro',
    'Maitama',
    'Katampe',
  ],
  serviceRegion: 'Abuja and wider Nigeria',
  trust: {
    googleRating: 4.8,
    googleReviewCount: 187,
  },
  domain: 'https://kellelectricals.com',
} as const

// Real, named flagship project. Only the confirmed contract-scope figure is
// used here — timeline, equipment list, and before/after detail are not yet
// confirmed and are intentionally withheld rather than estimated. See
// docs/next-steps.md.
export const flagshipProject = {
  client: 'Modish Formals / M3 Group',
  title: 'Factory conversion — full electrical systems overhaul',
  contractValue: '₦33,000,000',
  summary:
    'Full electrical systems engineering for a factory conversion, delivered end-to-end by our team from load assessment through commissioning.',
  status: 'NEEDS REAL DATA' as const,
} as const
