import type { MetadataRoute } from 'next'
import { company } from '@/content/company'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // No admin/dashboard routes exist on this site - the only routes
      // under /api/* are POST-only form/booking endpoints (quote,
      // careers-application, book, availability), not indexable content.
      disallow: '/api/',
    },
    sitemap: `${company.domain}/sitemap.xml`,
  }
}
