import type { Metadata } from 'next'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { services } from '@/content/services'
import { industries } from '@/content/industries'
import { articles } from '@/content/resources'
import { careerTracks } from '@/content/careers'
import { legalNav } from '@/content/nav'
import { pageMetadata } from '@/lib/metadata'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Sitemap',
  description:
    'A full index of every page on the Kell Electricals Ltd website: services, industries, resources, careers, and company pages.',
  path: '/site-map',
})

type LinkGroup = {
  heading: string
  links: { label: string; href: string }[]
}

const groups: LinkGroup[] = [
  {
    heading: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Contact & Request a Quote', href: '/contact' },
    ],
  },
  {
    heading: 'Flagship Capabilities',
    links: [
      { label: 'Solar & Hybrid Energy Systems', href: '/solar-energy-systems' },
      { label: '24/7 Emergency Electrical Services', href: '/emergency-electrical-services' },
      { label: 'Home Automation', href: '/home-automation' },
      { label: 'CCTV & Security Systems', href: '/cctv-security-systems' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Services Overview', href: '/services' },
      ...services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
    ],
  },
  {
    heading: 'Industries We Serve',
    links: [
      { label: 'Industries Overview', href: '/industries' },
      ...industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
    ],
  },
  {
    heading: 'Resources & Technical Guides',
    links: [
      { label: 'Resources Overview', href: '/resources' },
      ...articles.map((a) => ({ label: a.title, href: `/resources/${a.slug}` })),
    ],
  },
  {
    heading: 'Careers',
    links: [
      { label: 'Careers Overview', href: '/careers' },
      ...careerTracks.map((t) => ({ label: t.name, href: `/careers/${t.slug}` })),
    ],
  },
  {
    heading: 'Legal',
    links: legalNav
      .filter((l) => l.href !== '/site-map')
      .map((l) => ({ label: l.label, href: l.href })),
  },
]

export default function SitemapPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Sitemap</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Every page on this site
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            A full index for finding a page directly, or for search engines
            crawling the site&rsquo;s structure.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Reveal key={group.heading}>
              <h2 className="eyebrow border-b border-ink/10 pb-3 text-petrol/70">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-ink/80 hover:text-petrol"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  )
}
