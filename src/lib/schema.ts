import { company } from '@/content/company'
import { services } from '@/content/services'

// Business hours are authored as free text ("Monday – Friday", "8:00 AM
// – 5:00 PM") for human display; schema.org's openingHoursSpecification
// needs a day list and 24-hour times instead. This derives one from the
// other rather than hand-maintaining a second copy that could drift.
const dayOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

function expandDayRange(days: string): string[] {
  if (!days.includes('–') && !days.includes('-')) return [days.trim()]
  const [start, end] = days.split(/[–-]/).map((d) => d.trim())
  const startIdx = dayOrder.indexOf(start)
  const endIdx = dayOrder.indexOf(end)
  if (startIdx === -1 || endIdx === -1) return [days.trim()]
  return dayOrder.slice(startIdx, endIdx + 1)
}

function to24Hour(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return time
  let [, hourStr, minute, meridiem] = match
  let hour = parseInt(hourStr, 10)
  if (meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${minute}`
}

function openingHoursSpecification() {
  return company.businessHours
    .filter((entry) => entry.hours !== 'Closed')
    .flatMap((entry) => {
      const [opens, closes] = entry.hours.split(/[–-]/).map((t) => to24Hour(t.trim()))
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: expandDayRange(entry.days),
        opens,
        closes,
      }
    })
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ElectricalContractor',
    name: company.name,
    legalName: company.legalName,
    image: `${company.domain}/og-image.jpg`,
    logo: `${company.domain}/brand/logo-on-light.png`,
    url: company.domain,
    telephone: company.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.district,
      addressRegion: company.address.city,
      addressCountry: 'NG',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: company.trust.googleRating,
      reviewCount: company.trust.googleReviewCount,
    },
    areaServed: company.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    foundingDate: `${company.foundedYear}`,
    slogan: company.tagline,
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [
      company.social.facebook,
      company.social.instagram,
      company.social.linkedin,
      company.social.trustpilot,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Electrical engineering services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.summary,
          url: `${company.domain}/services/${service.slug}`,
        },
      })),
    },
  }
}

export function serviceSchema(params: {
  name: string
  description: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: params.name,
    name: params.name,
    description: params.description,
    provider: {
      '@type': 'ElectricalContractor',
      name: company.name,
      telephone: company.phone,
      address: company.address.full,
    },
    areaServed: company.serviceAreas,
    url: `${company.domain}/services/${params.slug}`,
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function articleSchema(params: {
  title: string
  summary: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: params.title,
    description: params.summary,
    url: `${company.domain}/resources/${params.slug}`,
    author: {
      '@type': 'Organization',
      name: company.name,
      url: company.domain,
    },
    publisher: {
      '@type': 'Organization',
      name: company.name,
      logo: {
        '@type': 'ImageObject',
        url: `${company.domain}/brand/logo-on-light.png`,
      },
    },
  }
}

// For pages that describe Kell Electricals' services in a specific context
// (a service area or an industry) rather than a single named service —
// distinct from serviceSchema() above, which is for the 16 individual
// /services/[slug] detail pages. areaServed defaults to every real service
// area rather than being omitted, since a Service without one is less
// useful for local search than one scoped to where the work actually happens.
export function localServiceSchema(params: {
  name: string
  description: string
  url: string
  areaServed?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: params.name,
    name: params.name,
    description: params.description,
    provider: {
      '@type': 'ElectricalContractor',
      name: company.name,
      telephone: company.phone,
      address: company.address.full,
    },
    areaServed: params.areaServed ?? company.serviceAreas,
    url: params.url,
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
