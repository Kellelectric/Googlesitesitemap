import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { process } from '@/content/process'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Developers, Architects & Contractors',
  description:
    'Electrical engineering that coordinates with your build programme - documented design, on-schedule delivery, and paperwork that survives a snagging review.',
  path: '/developers-architects-contractors',
  image: '/images/photos/developers-hero-site-review.jpg',
})

const whatWeBring = [
  {
    title: 'Coordination with the wider build programme',
    description:
      'Electrical scope specified and sequenced against your programme, not delivered as an isolated trade - first-fix and second-fix timed to match the wider build, with early flagging if a design decision elsewhere affects electrical scope.',
  },
  {
    title: 'Documented design before installation starts',
    description:
      'Circuit schedules and single-line diagrams specified against the assessed load before work begins, so a change of scope mid-project is a design revision, not a rip-out.',
  },
  {
    title: 'Handover documentation that survives a snagging review',
    description:
      'As-built drawings, circuit schedules, and commissioning test records handed over at completion - the same documentation covered on our certifications and compliance page, ready for a client or facilities team to actually use.',
  },
  {
    title: 'One point of contact across a multi-trade site',
    description:
      "A single engineering lead for the electrical scope, coordinating directly with architects and M&E consultants rather than routing every decision through a generalist project manager.",
  },
]

export default function DevelopersArchitectsContractorsPage() {
  const commercialFitout = getServiceBySlug('commercial-office-fitout')
  const industrial = getServiceBySlug('industrial-electrical-systems')
  const wiring = getServiceBySlug('electrical-wiring-installation')
  const relatedServices = [commercialFitout, industrial, wiring].filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              {
                name: 'For Developers, Architects & Contractors',
                url: `${company.domain}/developers-architects-contractors`,
              },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/developers-hero-site-review.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">For Developers, Architects &amp; Contractors</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            An electrical partner that coordinates with your programme, not around it
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            {commercialFitout?.description ??
              'Fit-out and new-build electrical scope delivered on schedule, documented at every stage, and coordinated with the wider construction programme.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Discuss a Build Programme
            </Button>
            <Button href={company.whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
              WHATSAPP
            </Button>
          </div>
        </div>
      </section>

      {/* What we bring */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">What we bring to a build</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              Engineering that fits into a construction programme
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {whatWeBring.map((item) => (
              <MotionDiv key={item.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Our process */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Our process</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
              Assess, design, install, test and hand over
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-yellow pt-5">
                <span className="font-display text-sm text-paper/60">{step.step}</span>
                <h3 className="mt-2 text-base font-semibold text-paper">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{step.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Certifications tie-in */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Certified and documented</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              COREN and NEMSA certified, with paperwork to match
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
              What certification means for a build programme, and the
              documentation your team receives at every handover.
            </p>
            <Link
              href="/certifications-compliance"
              className="link-underline mt-4 inline-block text-sm font-semibold text-petrol"
            >
              Certifications &amp; Compliance
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Related services */}
      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Related services</span>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-4">
            {relatedServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="link-underline border border-ink/15 px-5 py-3 text-sm font-medium text-ink hover:border-petrol"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Planning a build with an electrical scope to coordinate?"
        body="Tell us about the programme and we'll scope the electrical work around it."
        primaryLabel="Discuss a Build Programme"
        primaryHref="/contact"
        secondaryLabel="WHATSAPP"
        secondaryHref={company.whatsappHref}
      />
    </>
  )
}
