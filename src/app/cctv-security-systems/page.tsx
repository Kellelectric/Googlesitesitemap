import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { faqCategories } from '@/content/faqs'
import { industries } from '@/content/industries'
import { serviceSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { process } from '@/content/process'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'CCTV & Security Systems',
  description:
    'Camera systems positioned and cabled by engineers, with power and network infrastructure built to last, across ' +
    company.serviceRegion +
    '.',
  path: '/cctv-security-systems',
})

const servicesIncluded = [
  'CCTV design and site survey',
  'IP camera installation',
  'Indoor and outdoor cameras',
  'Bullet and dome cameras',
  'PTZ (pan-tilt-zoom) cameras',
  'Night vision and motion detection',
  'Remote monitoring setup',
  'NVR / DVR installation and configuration',
  'Cloud recording setup',
  'Intruder alarms',
  'Door and window sensors',
  'Glass-break detection',
  'Panic buttons',
  'Access control and biometric systems',
  'RFID access',
  'Intercom and visitor management',
  'Gate automation integration',
  'Electric fencing (where applicable)',
  'Fire alarm systems',
  'Maintenance contracts',
]

const problemsWeSolve = [
  'Blind spots from poorly planned camera placement',
  'Unreliable footage from underspecified cabling or power',
  'No remote monitoring or alerts while off-site',
  'Security systems that don’t talk to gates or access control',
  'Poor night visibility in low-light areas',
  'No recorded evidence trail after an incident',
]

const technicalConsiderations = [
  {
    title: 'Coverage is a design problem, not a camera count',
    description:
      'More cameras positioned badly still leave blind spots. We survey the site and design placement for actual coverage of entry points, perimeter, and specific assets — then size the cabling and power to match.',
  },
  {
    title: 'PoE power and structured cabling matter as much as the camera',
    description:
      'A camera is only as reliable as the power and network run behind it. We install Power-over-Ethernet cabling and structured runs correctly the first time, rather than leaving cameras dependent on unreliable Wi-Fi or ad-hoc wiring.',
  },
  {
    title: 'Plan integration up front, not after installation',
    description:
      "If you want CCTV working with gate automation, access control, or alarms, that's easier to design in from the start than to bolt on afterward — worth flagging during the site survey.",
  },
]

export default function CCTVSecuritySystemsPage() {
  const cctv = getServiceBySlug('cctv-surveillance')
  const gates = getServiceBySlug('automated-gates-access-control')
  const faqs = faqCategories.find((c) => c.category === 'CCTV & Security')?.items ?? []

  return (
    <>
      {cctv && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              serviceSchema({
                name: 'CCTV & Security Systems',
                description: cctv.description,
                slug: cctv.slug,
              }),
            ),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'CCTV & Security Systems', url: `${company.domain}/cctv-security-systems` },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-24 md:py-28">
          <span className="eyebrow text-yellow">CCTV & Security Systems</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Surveillance systems engineered, not just installed
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            {cctv?.description ??
              'A surveillance system is only as reliable as the electrical and network infrastructure behind it. We design camera placement for actual coverage needs and run structured cabling and power correctly the first time.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact?service=cctv-surveillance" variant="primary">
              Request a Quote
            </Button>
            <Button href="/contact" variant="secondary">
              Book a Site Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Overview</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              Coverage designed around your property, not a fixed package
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">
              We treat CCTV and security as an electrical engineering
              problem first: proper camera placement, structured cabling,
              reliable power, and correctly configured recording and remote
              access. That&rsquo;s what makes the difference between a
              system that works when you need it and one that just looks
              installed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services included */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Services included</span>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicesIncluded.map((item) => (
              <MotionDiv key={item} variants={staggerItem} className="flex gap-3 border border-paper/15 p-4 text-sm text-paper/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Problems we solve */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Problems we solve</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {problemsWeSolve.map((item) => (
              <MotionDiv key={item} variants={staggerItem} className="flex gap-3 border-b border-ink/10 pb-3 text-sm text-ink/75">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Who we serve</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((i) => (
              <MotionDiv key={i.slug} variants={staggerItem} className="border-t-2 border-yellow pt-4">
                <h3 className="text-sm font-semibold text-paper">{i.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-paper/65">{i.summary}</p>
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
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Why choose Kell Electricals</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              'COREN and NEMSA certified',
              `${company.teamExperienceYears}+ years of combined engineering experience`,
              'Structured cabling and PoE power installed by electrical engineers, not just camera technicians',
              `${company.trust.googleRating}★ Google rating from ${company.trust.googleReviewCount}+ reviews`,
            ].map((item) => (
              <MotionDiv key={item} variants={staggerItem} className="flex gap-3 border-b border-paper/15 pb-3 text-sm text-paper/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Technical considerations */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Technical considerations</span>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {technicalConsiderations.map((item) => (
              <MotionDiv key={item.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={faqs} viewAllHref="/faq" />

      {/* Related services */}
      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Related services</span>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-4">
            {[cctv, gates]
              .filter((s): s is NonNullable<typeof s> => Boolean(s))
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="link-underline border border-ink/15 px-5 py-3 text-sm font-medium text-ink hover:border-petrol"
                >
                  {s.name}
                </Link>
              ))}
            <Link
              href="/home-automation"
              className="link-underline border border-ink/15 px-5 py-3 text-sm font-medium text-ink hover:border-petrol"
            >
              Home Automation
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        heading="Ready to secure your property?"
        body="Book a site survey and we'll design coverage for your actual layout, not a generic package."
        serviceSlug="cctv-surveillance"
      />
    </>
  )
}
