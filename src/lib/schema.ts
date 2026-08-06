import { company } from '@/content/company'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ElectricalContractor',
    name: company.name,
    legalName: company.legalName,
    image: `${company.domain}/og-image.jpg`,
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
    foundingDate: `${new Date().getFullYear() - company.yearsExperience}`,
    slogan: company.tagline,
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
