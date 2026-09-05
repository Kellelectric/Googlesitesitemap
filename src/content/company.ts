export const company = {
  name: 'Kell Electricals Ltd',
  legalName: 'Kell Electricals Limited',
  rcNumber: '1852579',
  tinNumber: '24042535-0001',
  smedanNumber: 'SUID-1632-5774-5650-6732',
  tagline: 'Engineering Trust. Powering Lives.',
  positioning:
    "The engineering partner Abuja's homes, businesses, and industrial sites call when electrical infrastructure has to work the first time and every time.",
  phone: '+234 814 020 5895',
  phoneHref: 'tel:+2348140205895',
  whatsappHref: 'https://wa.me/message/74H7FYXECPMXH1',
  // Real Google Calendar Appointment Schedule booking page, supplied
  // directly by the client - used on /book-appointment. Google's own
  // embed pattern (append ?gv=true) shows the same page inline via
  // iframe; the bare URL is used for the "open in a new tab" fallback
  // and anywhere else a plain link is needed.
  bookingUrl: 'https://calendar.app.google/xfG7u58pyNSd3mSq8',
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
  // Corporate registration, distinct from the professional/regulatory
  // certifications above - these confirm Kell Electricals Ltd's legal
  // standing as a registered business, not its engineering competence.
  registrations: [
    {
      name: 'CAC',
      fullName: 'Corporate Affairs Commission',
      number: 'RC 1852579',
    },
    {
      name: 'SMEDAN',
      fullName: 'Small and Medium Enterprises Development Agency of Nigeria',
      number: 'SUID-1632-5774-5650-6732',
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
    'Jahi',
    'Kado',
    'Idu',
    'Mabushi',
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
