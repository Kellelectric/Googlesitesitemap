import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'
import { getAreaBySlug, areas } from '@/content/areas'
import { services, categoryLabels } from '@/content/services'
import { company } from '@/content/company'
import { faqCategories } from '@/content/faqs'
import { breadcrumbSchema, localServiceSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

type Props = { params: { area: string } }

export function generateStaticParams() {
  return areas.map((area) => ({ area: area.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const area = getAreaBySlug(params.area)
  if (!area) return {}
  // "CBD" is the common, real-world local shorthand for Central Business
  // District (used locally, not an invented abbreviation) — used only in
  // the <title> tag to fit Google's ~60-char display budget; the on-page
  // H1 below still shows the full "Central Business District" for clarity.
  const metaAreaName = area.name === 'Central Business District' ? 'CBD' : area.name
  return pageMetadata({
    title: `Electrician in ${metaAreaName}, Abuja`,
    description: `COREN and NEMSA certified electrical services in ${area.name}, Abuja - wiring, solar, CCTV, home automation, and emergency response.`,
    path: `/electrician/${area.slug}`,
  })
}

const faqs = [
  ...(faqCategories.find((c) => c.category === 'General')?.items ?? []),
  ...(faqCategories.find((c) => c.category === 'Services & scheduling')?.items ?? []),
]

export default function AreaPage({ params }: Props) {
  const area = getAreaBySlug(params.area)
  if (!area) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: `Electrician in ${area.name}`, url: `${company.domain}/electrician/${area.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            localServiceSchema({
              name: `Electrician in ${area.name}`,
              description: `COREN and NEMSA certified electrical services in ${area.name}, Abuja - wiring, solar, CCTV, home automation, and emergency response.`,
              url: `${company.domain}/electrician/${area.slug}`,
              areaServed: [area.name],
            }),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/electrician-area-hero-onsite.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[75%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">{area.name}, Abuja</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Electrician in {area.name}, Abuja
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            COREN and NEMSA certified electrical engineering for homes and
            businesses in {area.name} - wiring, solar, CCTV, home
            automation, and emergency response.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Services in {area.name}</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              Everything we install and maintain, available across {area.name}
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <MotionDiv key={service.slug} variants={staggerItem} className="border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">{categoryLabels[service.category]}</span>
                <Link
                  href={`/services/${service.slug}`}
                  className="link-underline mt-2 block text-base font-semibold text-ink"
                >
                  {service.name}
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{service.summary}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Why choose Kell Electricals</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'COREN and NEMSA certified',
              `${company.teamExperienceYears}+ years of combined engineering experience`,
              `${company.trust.googleRating}★ Google rating from ${company.trust.googleReviewCount}+ reviews`,
              `Emergency response ${company.emergencyResponseTarget}`,
            ].map((item) => (
              <MotionDiv
                key={item}
                variants={staggerItem}
                className="flex gap-3 border-b border-paper/15 pb-3 text-sm text-paper/80"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <FAQSection items={faqs} viewAllHref="/faq" />

      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Other areas we serve</span>
          </Reveal>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {areas
              .filter((other) => other.slug !== area.slug)
              .map((other) => (
                <MotionDiv key={other.slug} variants={staggerItem}>
                  <Link
                    href={`/electrician/${other.slug}`}
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
        heading={`Need an electrician in ${area.name}?`}
        body="Tell us the details and we'll respond with a scoped assessment."
      />
    </>
  )
}
