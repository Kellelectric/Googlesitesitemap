import type { MetadataRoute } from 'next'
import { services } from '@/content/services'
import { industries } from '@/content/industries'
import { articles } from '@/content/resources'
import { careerTracks } from '@/content/careers'
import { areas } from '@/content/areas'
import { company } from '@/content/company'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.domain

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/about`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/services`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/solar-energy-systems`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/emergency-electrical-services`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/home-automation`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/cctv-security-systems`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/certifications-compliance`, lastModified: new Date(), priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/maintenance-amc`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/industries`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/resources`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/faq`, lastModified: new Date(), priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/testimonials`, lastModified: new Date(), priority: 0.6, changeFrequency: 'weekly' },
    { url: `${base}/calculators`, lastModified: new Date(), priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/careers`, lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/site-map`, lastModified: new Date(), priority: 0.3, changeFrequency: 'monthly' },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: new Date(),
    priority: service.flagship ? 0.9 : 0.7,
    changeFrequency: 'monthly',
  }))

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${base}/industries/${industry.slug}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${base}/resources/${article.slug}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  const careerRoutes: MetadataRoute.Sitemap = careerTracks.map((track) => ({
    url: `${base}/careers/${track.slug}`,
    lastModified: new Date(),
    priority: 0.4,
    changeFrequency: 'monthly',
  }))

  const areaRoutes: MetadataRoute.Sitemap = areas.map((area) => ({
    url: `${base}/electrician/${area.slug}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...articleRoutes,
    ...careerRoutes,
    ...areaRoutes,
  ]
}
