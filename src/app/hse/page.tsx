import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Health, Safety & Environment',
  description:
    'How Kell Electricals runs site safety: PPE and isolation procedure, hazard-specific practice for live and confined work, and incident reporting on every job.',
  path: '/hse',
  image: '/images/photos/hse-hero-site-safety.jpg',
})

const sitePractices = [
  {
    title: 'PPE is mandatory, not situational',
    description:
      'Hard hats, safety glasses, insulated gloves rated for the work being done, and appropriate footwear are standard on every site, for every technician, on every visit - not reserved for jobs that look risky.',
  },
  {
    title: 'Isolation before investigation',
    description:
      "A circuit is isolated and verified dead with a proper tester before it's opened up or worked on - never assumed safe from a breaker position or a label. This applies whether the job is a routine repair or a fault diagnosis.",
  },
  {
    title: 'Hazard-specific procedure for live and confined work',
    description:
      'Work that genuinely requires a live circuit (fault-finding under load, for example) follows a specific safe method of work, not the same general caution used for de-energized jobs. Confined spaces and elevated work get their own access and rescue planning before work starts.',
  },
  {
    title: 'Site handover briefing',
    description:
      "On a multi-trade site, our team briefs on the specific hazards of that day's work before starting - what's isolated, what's live, and what other trades need to know is happening nearby.",
  },
]

const incidentReporting = [
  'Every site visit is logged, whether or not anything went wrong - a record exists, not just a memory of the job',
  'Near-misses are reported and reviewed the same as actual incidents, since a near-miss is a preventable incident that didn\'t happen this time',
  'Any incident gets a documented root-cause review, not just a fix and move on',
]

export default function HSEPage() {
  const emergencyService = getServiceBySlug('emergency-electrical-response')
  const faultFinding = getServiceBySlug('fault-finding-diagnostics')
  const earthing = getServiceBySlug('earthing-lightning-protection')
  const relatedServices = [emergencyService, faultFinding, earthing].filter(
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
              { name: 'Health, Safety & Environment', url: `${company.domain}/hse` },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/hse-hero-site-safety.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[65%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Health, Safety &amp; Environment</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Site safety is a documented procedure, not a slogan
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Electrical work carries real risk, on our team and on the site
            around us. Here is how we actually run safety on every job, not
            just what we say about it.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Discuss a Site HSE Requirement
            </Button>
            <Button href={company.whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
              WHATSAPP
            </Button>
          </div>
        </div>
      </section>

      {/* Site practices */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">On every site</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              How our team actually works
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {sitePractices.map((item) => (
              <MotionDiv key={item.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Incident reporting */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Incident &amp; near-miss reporting</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
              A documented record, not an informal one
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-4">
            {incidentReporting.map((item) => (
              <MotionDiv
                key={item}
                variants={staggerItem}
                className="flex gap-3 border border-paper/15 p-4 text-sm text-paper/85"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Certifications tie-in */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Backed by certification</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              COREN and NEMSA certified, with documentation to match
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
              Safety practice and regulatory compliance run together on our
              jobs - see what certification means in practice and the
              documentation handed over on every job.
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
        heading="Need a contractor with a documented HSE process?"
        body="Tell us about your site's requirements and we'll scope the work with your safety expectations built in."
        primaryLabel="Request a Quote"
        primaryHref="/contact"
        secondaryLabel="WHATSAPP"
        secondaryHref={company.whatsappHref}
      />
    </>
  )
}
