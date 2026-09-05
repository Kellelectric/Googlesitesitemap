import { company } from '@/content/company'
import { services } from '@/content/services'
import { expandDayRange, to24Hour } from '@/lib/businessHours'
import { getReviewUrl } from '@/content/testimonials'

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
    // 'Electrician' is the real schema.org type for this business -
    // Thing > Organization > LocalBusiness > HomeAndConstructionBusiness >
    // Electrician. The previous 'ElectricalContractor' isn't a type
    // schema.org defines at all, so Google's parser had nothing to map it
    // to and likely wasn't treating this as a LocalBusiness/Electrician
    // entity for Knowledge Graph purposes despite every property below
    // being present and valid.
    '@type': 'Electrician',
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
    // Real, confirmed professional/regulatory certifications from
    // company.ts (COREN, NEMSA) - not previously wired into this schema at
    // all, despite being genuine, displayed facts elsewhere on the site.
    hasCredential: company.certifications.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: cert.fullName,
      recognizedBy: {
        '@type': 'Organization',
        name: cert.fullName,
      },
    })),
    // No aggregateRating here on purpose: Google removed LocalBusiness/
    // Organization eligibility for the star-rating rich result entirely -
    // a business can no longer publish its own review data about itself
    // and have it produce review snippets. Search Console was flagging
    // this as an actual structured-data error ("Invalid object type for
    // field 'parent_node'" under Review snippets), not just ignoring it.
    // The 4.8★/192-review figure is still shown visually across the site
    // (StatsBar, WhyChooseUs, TrustSection) - that's the channel Google
    // actually supports for it now.
    areaServed: company.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    foundingDate: `${company.foundedYear}`,
    slogan: company.tagline,
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [
      // The real Google Business Profile URL (same one used sitewide for
      // "View all reviews" - see testimonials.ts) - linking it here helps
      // Google connect this site's entity to the Business Profile entity,
      // which is a real local-ranking (Google Maps/Local Pack) signal,
      // not just a social link.
      getReviewUrl(),
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
      '@type': 'Electrician',
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
      '@type': 'Electrician',
      name: company.name,
      telephone: company.phone,
      address: company.address.full,
    },
    areaServed: params.areaServed ?? company.serviceAreas,
    url: params.url,
  }
}

// Real, named staff (see src/content/team.ts's own header comment for the
// provenance of each name/title/photo) as schema.org Person entities —
// only fields already shown on /about (name, title, photo) are used here,
// nothing additional is invented (no sameAs profile links, no alumniOf).
export function teamSchema(members: { name: string; title: string; photo?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': members.map((member) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.title,
      worksFor: {
        '@type': 'Organization',
        name: company.name,
        url: company.domain,
      },
      ...(member.photo ? { image: `${company.domain}${member.photo}` } : {}),
    })),
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
