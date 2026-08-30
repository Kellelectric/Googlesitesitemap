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
  yearsExperience: new Date().getFullYear() - 2010,
  social: {
    facebook: 'https://facebook.com/kellelectricals',
    instagram: 'https://instagram.com/kell_electricals',
    linkedin: 'https://linkedin.com/in/kellelectricals',
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
    googleReviewCount: 192,
    projectsCompleted: 100,
  },
  domain: 'https://kellelectricals.com',
} as const
