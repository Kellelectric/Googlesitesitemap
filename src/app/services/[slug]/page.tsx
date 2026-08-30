import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'
import { getServiceBySlug, services, categoryLabels } from '@/content/services'
import { industries } from '@/content/industries'
import { process } from '@/content/process'
import { company } from '@/content/company'
import { faqCategories } from '@/content/faqs'
import { serviceSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

const faqs = [
  ...(faqCategories.find((c) => c.category === 'General')?.items ?? []),
  ...(faqCategories.find((c) => c.category === 'Services & scheduling')?.items ?? []),
]

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceBySlug(params.slug)
  if (!service) return {}
  return pageMetadata({
    title: service.name,
    description: service.summary,
    path: `/services/${service.slug}`,
  })
}

export default function ServiceDetailPage({ params }: Props) {
  const service = getServiceBySlug(params.slug)
  if (!service) notFound()

  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3)

  const relatedIndustries = industries.filter((i) => i.serviceSlugs.includes(service.slug))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: service.name,
              description: service.description,
              slug: service.slug,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Services', url: `${company.domain}/services` },
              { name: service.name, url: `${company.domain}/services/${service.slug}` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/service-detail-hero-wiring.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[65%_45%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <nav className="eyebrow flex gap-2 text-paper/60" aria-label="Breadcrumb">
            <Link href="/services" className="hover:text-paper">
              Services
            </Link>
            <span>/</span>
            <span className="text-paper/80">{service.name}</span>
          </nav>

          <span className="eyebrow mt-6 inline-block text-yellow">
            {categoryLabels[service.category]}
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            {service.name}
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">{service.description}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={`/contact?service=${service.slug}`} variant="primary">
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
            <h2 className="text-2xl font-semibold text-ink">Scope of work</h2>
            <ul className="mt-6 space-y-4">
              {service.scope.map((item) => (
                <li key={item} className="flex gap-3 border-b border-ink/10 pb-4 text-ink/75">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-petrol" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl font-semibold text-ink">Our process</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {process.map((step) => (
                <div key={step.step} className="border-t-2 border-petrol pt-4">
                  <span className="font-display text-xs text-petrol/70">{step.step}</span>
                  <h3 className="mt-1 font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Typical use cases</span>
              <ul className="mt-4 space-y-4">
                {service.useCases.map((useCase) => (
                  <li key={useCase} className="text-sm leading-relaxed text-ink/75">
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>

            {related.length > 0 && (
              <div className="mt-8 border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">Related services</span>
                <ul className="mt-4 space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/services/${r.slug}`}
                        className="link-underline text-sm font-medium text-ink"
                      >
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {relatedIndustries.length > 0 && (
        <section className="bg-petrol-700 py-20 text-paper">
          <div className="container-content">
            <Reveal>
              <span className="eyebrow text-yellow">Where this is used</span>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold md:text-3xl">
                Properties that typically need {service.name.toLowerCase()}
              </h2>
            </Reveal>
            <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedIndustries.map((industry) => (
                <MotionDiv key={industry.slug} variants={staggerItem}>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="link-underline block border border-paper/15 p-5 text-sm font-medium text-paper/90 hover:border-yellow"
                  >
                    {industry.name}
                  </Link>
                </MotionDiv>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Why choose Kell Electricals</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              'COREN and NEMSA certified',
              `${company.teamExperienceYears}+ years of combined engineering experience`,
              `${company.trust.googleRating}★ Google rating from ${company.trust.googleReviewCount}+ reviews`,
              `${company.trust.projectsCompleted}+ projects completed`,
            ].map((item) => (
              <MotionDiv
                key={item}
                variants={staggerItem}
                className="flex gap-3 border-b border-ink/10 pb-3 text-sm text-ink/75"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <FAQSection items={faqs} viewAllHref="/faq" />

      <CTASection
        heading={`Ready to scope your ${service.name.toLowerCase()} job?`}
        body="Tell us the details and we'll respond with a scoped assessment for this service specifically."
        serviceSlug={service.slug}
      />
    </>
  )
}
