import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { FAQSection } from '@/components/sections/FAQSection'
import { getIndustryBySlug, industries } from '@/content/industries'
import { getServiceBySlug } from '@/content/services'
import { company } from '@/content/company'
import { process } from '@/content/process'
import { faqCategories } from '@/content/faqs'
import { breadcrumbSchema, localServiceSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const industry = getIndustryBySlug(params.slug)
  if (!industry) return {}
  return pageMetadata({
    title: `${industry.name} Electrical Services`,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
    image: industry.heroImage,
  })
}

const faqs = [
  ...(faqCategories.find((c) => c.category === 'General')?.items ?? []),
  ...(faqCategories.find((c) => c.category === 'Services & scheduling')?.items ?? []),
]

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            localServiceSchema({
              name: `Electrical Services for ${industry.name}`,
              description: industry.description,
              url: `${company.domain}/industries/${industry.slug}`,
            }),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src={industry.heroImage}
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[60%_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
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
                {industry.name} Electrical Services
              </h1>
              <p className="mt-5 max-w-xl text-paper/70">{industry.description}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={`/contact?service=${relatedServices[0]?.slug ?? ''}`} variant="primary">
              Request a Quote
            </Button>
            <Button href="/contact" variant="secondary">
              Book a Site Assessment
            </Button>
            <Button href={company.phoneHref} variant="secondary">
              Call {company.phone}
            </Button>
          </div>
        </div>
      </section>

      {/* Overview / Problems we solve */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Problems we solve</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              What we plan for on {industry.name.toLowerCase()} properties
            </h2>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {industry.challenges.map((challenge) => (
              <MotionDiv key={challenge} variants={staggerItem} className="flex gap-3 border-b border-ink/10 pb-4 text-sm text-ink/75">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                {challenge}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Services included */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Services included</span>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Relevant services for {industry.name.toLowerCase()} properties
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((service) => (
              <MotionDiv key={service.slug} variants={staggerItem} className="border border-paper/15 p-6">
                <Link href={`/services/${service.slug}`} className="link-underline text-base font-semibold text-paper">
                  {service.name}
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{service.summary}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Our process */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Our process</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
              Assess, design, install, test &amp; handover
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <span className="font-display text-sm text-petrol/70">{step.step}</span>
                <h3 className="mt-2 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Why choose us */}
      <WhyChooseUs layout="compact" />

      {/* FAQ */}
      <FAQSection items={faqs} viewAllHref="/faq" />

      {/* Related services / other properties */}
      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Other properties we serve</span>
          </Reveal>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {industries
              .filter((i) => i.slug !== industry.slug)
              .map((other) => (
                <MotionDiv key={other.slug} variants={staggerItem}>
                  <Link
                    href={`/industries/${other.slug}`}
                    className="link-underline block border border-ink/10 p-5 text-sm font-medium text-ink hover:border-petrol"
                  >
                    {other.name}
                  </Link>
                </MotionDiv>
              ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection
        heading={`Ready to scope your ${industry.name.toLowerCase()} job?`}
        body="Tell us the details and we'll respond with a scoped assessment."
        serviceSlug={relatedServices[0]?.slug}
      />
    </>
  )
}
