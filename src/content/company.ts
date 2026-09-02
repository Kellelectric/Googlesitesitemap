export const company = {
  name: 'Kell Electricals Ltd',
  legalName: 'Kell Electricals Limited',
  rcNumber: '1852579',
  tagline: 'Engineering Trust. Powering Lives.',
  positioning:
    "The engineering partner Abuja's homes, businesses, and industrial sites call when electrical infrastructure has to work the first time and every time.",
  phone: '+234 814 020 5895',
  phoneHref: 'tel:+2348140205895',
  whatsappHref: 'https://wa.me/message/74H7FYXECPMXH1',
  // The Zoho Books client portal login URL, set as NEXT_PUBLIC_CLIENT_PORTAL_URL
  // in the deployment environment once the client supplies it. The website
  // must never build its own client portal — this is a link out to the
  // existing Zoho Books portal only. Left undefined (not a guessed URL)
  // until configured; call sites fall back to a "contact us" CTA.
  clientPortalUrl: process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || undefined,
  email: 'info@kellelectricals.com',
  emergencyEmail: 'emergency@kellelectricals.com',
  emergencyResponseTarget: 'within 30 minutes',
  address: {
    street: '741 Alexandria Crescent',
    district: 'Wuse 2',
    city: 'Abuja',
    country: 'Nigeria',
    full: '741 Alexandria Crescent, Wuse 2, Abuja, Nigeria',
  },
  businessHours: [
    { days: 'Monday – Friday', hours: '8:00 AM – 5:00 PM' },
    { days: 'Saturday', hours: '10:00 AM – 3:00 PM' },
    { days: 'Sunday', hours: 'Closed' },
  ],
  foundedYear: 2010,
  // Company age (years since incorporation) — used for the milestone
  // timeline on /about, not for headline marketing copy.
  yearsExperience: new Date().getFullYear() - 2010,
  // Combined electrical engineering experience of the team (engineers and
  // technicians), which predates the company's own 2010 incorporation —
  // this is the "15+ years" figure used in headline marketing copy
  // sitewide, distinct from and not a substitute for the founding date
  // above. Do not derive this from foundedYear. Corrected from a prior
  // 20 to 15 per the client's site audit (matches Gabriel's real ~15
  // years as lead engineer) — do not revert without client confirmation.
  teamExperienceYears: 15,
  social: {
    facebook: 'https://facebook.com/kellelectricals',
    instagram: 'https://www.instagram.com/kell_electricalsltd?igsi=MXhzNGh4Y3Vkbmk0Yg==',
    linkedin: 'https://www.linkedin.com/company/kellelectricalslimited/',
    trustpilot: 'https://www.trustpilot.com/review/kellelectricals.com',
  },
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
  // These are the featured districts with dedicated /electrician/[area]
  // pages, not an exhaustive list — the client confirmed directly that
  // coverage is all of Abuja, not limited to these seven. Any copy using
  // this array must not imply Abuja coverage stops here; pair it with
  // serviceRegion (or a phrase like "and every other part of Abuja") for
  // that reason.
  serviceAreas: [
    'Wuse 2',
    'Wuse',
    'Gwarinpa',
    'Central Business District',
    'Guzape',
    'Asokoro',
    'Maitama',
    'Katampe',
    'Garki',
    'Jabi',
    'Utako',
    'Lokogoma',
    'Apo',
    'Life Camp',
    'Kubwa',
    'Lugbe',
  ],
  // What's covered beyond Abuja itself — confirmed directly by the
  // client: neighboring states, then project work nationwide. Does NOT
  // include "Abuja" itself (that's covered by serviceAreas / the
  // "all of Abuja" framing above) — use this value as-is, no leading
  // "Abuja and " to strip.
  serviceRegion: 'neighboring states and wider Nigeria',
  trust: {
    googleRating: 4.8,
    googleReviewCount: 192,
    projectsCompleted: 1000,
  },
  domain: 'https://kellelectricals.com',
} as const
