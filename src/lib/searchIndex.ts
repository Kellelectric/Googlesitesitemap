import { services } from '@/content/services'
import { industries } from '@/content/industries'
import { articles } from '@/content/resources'
import { projects } from '@/content/projects'
import { careerTracks } from '@/content/careers'
import { areas } from '@/content/areas'
import { news } from '@/content/news'

export type SearchEntry = {
  title: string
  description: string
  href: string
  category: string
}

// Flat, client-bundled index over content already shipped in every page's
// JS anyway (services/industries/etc. are small, static arrays) — no
// separate JSON fetch, no search backend. Rebuilt at build time whenever
// content changes, same as every other page that maps over these arrays.
const staticPages: SearchEntry[] = [
  { title: 'Home', description: 'Kell Electricals Ltd - COREN and NEMSA certified electrical engineering in Abuja.', href: '/', category: 'Page' },
  { title: 'About Us', description: 'Who we are, our process, and our credentials.', href: '/about', category: 'Page' },
  { title: 'Leadership', description: 'Meet the team behind Kell Electricals Ltd.', href: '/leadership', category: 'Page' },
  { title: 'Services Overview', description: 'All 16 electrical engineering service lines.', href: '/services', category: 'Page' },
  { title: 'Solar & Hybrid Energy Systems', description: 'Solar, inverter, and hybrid power systems.', href: '/solar-energy-systems', category: 'Page' },
  { title: '24/7 Emergency Electrical Services', description: 'Emergency electrical response.', href: '/emergency-electrical-services', category: 'Page' },
  { title: 'Home Automation', description: 'Smart home and building automation.', href: '/home-automation', category: 'Page' },
  { title: 'CCTV & Security Systems', description: 'Camera systems and surveillance.', href: '/cctv-security-systems', category: 'Page' },
  { title: 'Certifications & Compliance', description: 'COREN, NEMSA, and regulatory compliance.', href: '/certifications-compliance', category: 'Page' },
  { title: 'Maintenance & AMC', description: 'Preventive maintenance contracts.', href: '/maintenance-amc', category: 'Page' },
  { title: 'Health, Safety & Environment', description: 'HSE policy and site safety.', href: '/hse', category: 'Page' },
  { title: 'For Developers, Architects & Contractors', description: 'Working with construction partners.', href: '/developers-architects-contractors', category: 'Page' },
  { title: 'Industries We Serve', description: 'Sectors we engineer for.', href: '/industries', category: 'Page' },
  { title: 'Projects', description: 'Completed project case studies.', href: '/projects', category: 'Page' },
  { title: 'Resources & Technical Guides', description: 'Technical guides and how-tos.', href: '/resources', category: 'Page' },
  { title: 'News & Updates', description: 'Project spotlights and site advisories.', href: '/news', category: 'Page' },
  { title: 'FAQ', description: 'Frequently asked questions.', href: '/faq', category: 'Page' },
  { title: 'Testimonials', description: 'Real customer reviews.', href: '/testimonials', category: 'Page' },
  { title: 'Load & Solar Calculators', description: 'Estimate load and solar system sizing.', href: '/calculators', category: 'Page' },
  { title: 'Book an Appointment', description: 'Schedule a site visit or inspection.', href: '/book-appointment', category: 'Page' },
  { title: 'Careers', description: 'NYSC, internship, apprenticeship, and job openings.', href: '/careers', category: 'Page' },
  { title: 'Contact', description: 'Request a quote or reach the team.', href: '/contact', category: 'Page' },
]

export function buildSearchIndex(): SearchEntry[] {
  return [
    ...staticPages,
    ...services.map((s) => ({
      title: s.name,
      description: s.summary,
      href: `/services/${s.slug}`,
      category: 'Service',
    })),
    ...industries.map((i) => ({
      title: i.name,
      description: i.summary,
      href: `/industries/${i.slug}`,
      category: 'Industry',
    })),
    ...articles.map((a) => ({
      title: a.title,
      description: a.summary,
      href: `/resources/${a.slug}`,
      category: 'Resource',
    })),
    ...news.map((n) => ({
      title: n.title,
      description: n.summary,
      href: `/news/${n.slug}`,
      category: 'News',
    })),
    ...projects.map((p) => ({
      title: p.title,
      description: p.summary,
      href: `/projects/${p.slug}`,
      category: 'Project',
    })),
    ...careerTracks.map((t) => ({
      title: t.name,
      description: t.summary,
      href: `/careers/${t.slug}`,
      category: 'Careers',
    })),
    ...areas.map((a) => ({
      title: `Electrician in ${a.name}, Abuja`,
      description: `Electrical services in ${a.name}.`,
      href: `/electrician/${a.slug}`,
      category: 'Service Area',
    })),
  ]
}

const TOKEN_RE = /\s+/

function score(entry: SearchEntry, queryTokens: string[]): number {
  const title = entry.title.toLowerCase()
  const description = entry.description.toLowerCase()
  let total = 0
  for (const token of queryTokens) {
    if (!token) continue
    if (title === token) total += 10
    else if (title.startsWith(token)) total += 6
    else if (title.includes(token)) total += 4
    else if (description.includes(token)) total += 1
    else return -1 // every token must match somewhere, or this entry is out
  }
  return total
}

export function searchEntries(index: SearchEntry[], query: string, limit = 20): SearchEntry[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []
  const tokens = trimmed.split(TOKEN_RE)
  return index
    .map((entry) => ({ entry, points: score(entry, tokens) }))
    .filter((r) => r.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((r) => r.entry)
}
