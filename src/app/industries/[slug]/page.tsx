import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { getIndustryBySlug, industries } from '@/content/industries'
import { getServiceBySlug } from '@/content/services'
import { company } from '@/content/company'
import { breadcrumbSchema } from '@/lib/schema'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const industry = getIndustryBySlug(params.slug)
  if (!industry) return {}
  return {
    title: `${industry.name} Electrical Services`,
    description: industry.summary,
    alternates: { canonical: `/industries/${industry.slug}` },
  }
}

export default function IndustryDetailPage({ params }: Props) {
  const industry = getIndustryBySlug(params.slug)
  if (!industry) notFound()

  const relatedServices = industry.serviceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Industries', url: `${company.domain}/industries` },
              { name: industry.name, url: `${company.domain}/industries/${industry.slug}` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <nav className="eyebrow flex gap-2 text-paper/60" aria-label="Breadcrumb">
            <Link href="/industries" className="hover:text-paper">
              Industries
            </Link>
            <span>/</span>
            <span className="text-paper/80">{industry.name}</span>
          </nav>

          <div className="mt-6 flex items-start gap-6">
            <div className="hidden shrink-0 rounded bg-paper p-3 sm:block">
              <Image
                src={`/images/industries/${industry.slug}.png`}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16"
              />
            </div>
            <div>
              <h1 className="max-w-2xl text-4xl font-semibold md:text-5xl">
                {industry.name}
              </h1>
              <p className="mt-5 max-w-xl text-paper/70">{industry.description}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Request a Quote
            </Button>
            <Button href={company.phoneHref} variant="secondary">
              Call {company.phone}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="md:col-span-2">
            <Reveal>
              <h2 className="text-2xl font-semibold text-ink">What we plan for</h2>
              <ul className="mt-6 space-y-4">
                {industry.challenges.map((challenge) => (
                  <li key={challenge} className="flex gap-3 border-b border-ink/10 pb-4 text-ink/75">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-petrol" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <aside>
            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Relevant services</span>
              <ul className="mt-4 space-y-3">
                {relatedServices.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="link-underline text-sm font-medium text-ink"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Other properties we serve</span>
          </Reveal>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {industries
              .filter((i) => i.slug !== industry.slug)
              .map((other) => (
                <MotionDiv key={other.slug} variants={staggerItem}>
                  <Link
                    href={`/industries/${other.slug}`}
                    className="link-underline block border border-paper/15 p-5 text-sm font-medium text-paper/90 hover:border-yellow"
                  >
                    {other.name}
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
