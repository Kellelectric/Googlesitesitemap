import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { articles } from '@/content/resources'
import { pageMetadata } from '@/lib/metadata'
import { StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

// Same per-article hero mapping used on /resources/[slug] (see the comment
// there), reused here so the hub cards carry the same distinct real photos
// instead of the plain bordered text boxes this grid had before.
const heroImageBySlug: Record<string, string> = {
  'sizing-a-hybrid-inverter-system': '/images/photos/solar-hero-panel-install.jpg',
  'nemsa-compliance-commercial-fitout': '/images/photos/compliance-hero-inspection.jpg',
  'signs-your-panel-needs-upgrading': '/images/photos/hero-control-panel.jpg',
  'generator-vs-solar-vs-hybrid': '/images/photos/maintenance-hero-solar-check.jpg',
  'cctv-camera-placement-and-cabling-basics': '/images/photos/cctv-hero-camera-install.jpg',
  'three-phase-power-basics-for-facility-managers': '/images/photos/about-blueprint-review.jpg',
  'earthing-and-lightning-protection-what-to-know': '/images/photos/hse-hero-site-safety.jpg',
  'ev-charger-installation-what-your-property-needs': '/images/photos/solar-roof-install.jpg',
  'how-to-size-a-backup-generator': '/images/photos/electrician-area-hero-onsite.jpg',
  'understanding-cable-sizes-for-residential-electrical': '/images/photos/service-detail-hero-wiring.jpg',
  'common-solar-installation-mistakes-nigeria': '/images/photos/developers-hero-site-review.jpg',
  'why-does-my-breaker-keep-tripping': '/images/photos/hero-control-panel.jpg',
  'how-often-you-need-an-electrical-safety-inspection': '/images/photos/resource-detail-hero-manual.jpg',
}

export const metadata: Metadata = pageMetadata({
  title: 'Resources & Technical Guides',
  description:
    'Technical guides on solar sizing, NEMSA compliance, electrical maintenance, and security systems from a COREN and NEMSA certified team in Abuja.',
  path: '/resources',
  image: '/images/photos/resources-hero-engineer-blueprint.jpg',
})

export default function ResourcesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/resources-hero-engineer-blueprint.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[55%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-16 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Resources</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Technical guides, not marketing copy
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Written by the same team that does the sizing, testing, and
            compliance work on site.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <MotionDiv key={article.slug} variants={staggerItem}>
                <Link
                  href={`/resources/${article.slug}`}
                  className="group relative flex h-full min-h-[20rem] flex-col justify-end overflow-hidden border border-ink/10"
                >
                  <Image
                    src={heroImageBySlug[article.slug]}
                    alt=""
                    fill
                    quality={65}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
                  <div className="relative p-6">
                    <span className="eyebrow text-yellow">{article.category}</span>
                    <h2 className="mt-3 text-xl font-semibold text-paper">
                      {article.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-paper/75">
                      {article.summary}
                    </p>
                    <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-yellow">
                      Read guide
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection />
    </>
  )
}
