import type { MetadataRoute } from 'next'
import { services } from '@/content/services'
import { company } from '@/content/company'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.domain

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/about`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/services`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/solar-energy-systems`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: new Date(),
    priority: service.flagship ? 0.9 : 0.7,
    changeFrequency: 'monthly',
  }))

  return [...staticRoutes, ...serviceRoutes]
}
