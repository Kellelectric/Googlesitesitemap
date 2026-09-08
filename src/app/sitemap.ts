import type { MetadataRoute } from 'next'
import { services } from '@/content/services'
import { industries } from '@/content/industries'
import { articles } from '@/content/resources'
import { news } from '@/content/news'
import { careerTracks } from '@/content/careers'
import { areas } from '@/content/areas'
import { projects } from '@/content/projects'
import { company } from '@/content/company'

// No `lastModified` field on any entry below, deliberately - this content
// isn't tracked with genuine per-page modification timestamps, and Next.js
// would otherwise default every entry to the current build time. That
// makes every URL look "just changed" on every deploy (including deploys
// that touched nothing on that page), which is exactly the fabricated-date
// pattern Google's own sitemap guidance warns against. Omitting `lastmod`
// entirely is the correct call until real per-page modification dates
// exist - do not add `lastModified: new Date()` back in.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.domain

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/about`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/leadership`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${base}/services`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/solar-energy-systems`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/emergency-electrical-services`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/home-automation`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/cctv-security-systems`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/certifications-compliance`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/maintenance-amc`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/hse`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/developers-architects-contractors`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/industries`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/projects`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/resources`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/news`, priority: 0.6, changeFrequency: 'weekly' },
    { url: `${base}/faq`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/testimonials`, priority: 0.6, changeFrequency: 'weekly' },
    { url: `${base}/calculators`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/book-appointment`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/careers`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${base}/contact`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/site-map`, priority: 0.3, changeFrequency: 'monthly' },
    { url: `${base}/legal/terms`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${base}/legal/privacy`, priority: 0.3, changeFrequency: 'yearly' },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    priority: service.flagship ? 0.9 : 0.7,
    changeFrequency: 'monthly',
  }))

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${base}/industries/${industry.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${base}/resources/${article.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  const newsRoutes: MetadataRoute.Sitemap = news.map((post) => ({
    url: `${base}/news/${post.slug}`,
    priority: 0.5,
    changeFrequency: 'monthly',
  }))

  const careerRoutes: MetadataRoute.Sitemap = careerTracks.map((track) => ({
    url: `${base}/careers/${track.slug}`,
    priority: 0.4,
    changeFrequency: 'monthly',
  }))

  const areaRoutes: MetadataRoute.Sitemap = areas.map((area) => ({
    url: `${base}/electrician/${area.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...articleRoutes,
    ...newsRoutes,
    ...careerRoutes,
    ...areaRoutes,
    ...projectRoutes,
  ]
}
