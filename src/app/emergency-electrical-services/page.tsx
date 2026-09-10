import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { faqCategories } from '@/content/faqs'
import { industries } from '@/content/industries'
import { serviceSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  // "Emergency Electrician in Abuja" - one of the highest-intent local
  // search terms this site can target; this flagship page owns it.
  // /services/emergency-electrical-response's own <title> deliberately
  // doesn't repeat "Abuja" (see services.ts) so the two pages don't
  // compete against each other in search.
  title: 'Emergency Electrician in Abuja',
  description: `Emergency electrical response across Abuja and beyond for outages, sparking, burning smells, and exposed wiring. Target response ${company.emergencyResponseTarget}.`,
  path: '/emergency-electrical-services',
  image: '/images/photos/emergency-hero-switchboard.jpg',
})

const problemsWeSolve = [
  'Power outages affecting part or all of a property',
  'Short circuits',
  'Breakers that keep tripping',
  'Burning smells from outlets, panels, or fittings',
  'Sparking outlets, switches, or panels',
  'Exposed or damaged live wires',
  'Overheating cables, panels, or equipment',
  'Switchboard and distribution board faults',
  'Generator faults during an outage',
  'Inverter faults or failures',
  'Electrical fires (call the fire service and us)',
  'Water-affected electrical systems (flooding, roof leaks)',
]

const whoWeServe = industries.map((i) => ({ name: i.name, summary: i.summary }))

const emergencyProcess = [
  {
    step: '01',
    title: 'Call or WhatsApp',
    description: `Reach us on ${company.phone} or WhatsApp. For anything involving fire, smoke, or shock risk, call the fire service first if needed, then us.`,
  },
  {
    step: '02',
    title: 'Safety triage',
    description:
      'We walk you through immediate safety steps over the phone if needed - switching off the main supply, keeping clear of the affected area, not touching exposed conductors.',
  },
  {
    step: '03',
    title: 'Dispatch & diagnosis',
    description: `A technician is dispatched, with a target response time of ${company.emergencyResponseTarget}, to diagnose the fault on site.`,
  },
  {
    step: '04',
    title: 'Repair or safe isolation',
    description:
      'Where a full repair can be completed safely on the spot, it is. Where the fix requires parts or scoped follow-up work, the area is made safe first and a repair is scheduled.',
  },
]

const technicalConsiderations = [
  {
    title: 'Why you should isolate power, not investigate it',
    description:
      "A tripped breaker or blown fuse is a protective device doing its job - repeatedly resetting it without diagnosing the cause risks re-energizing a fault. Isolating the circuit (or the main supply, if the fault location isn't obvious) and waiting for a technician is safer than testing it yourself.",
  },
  {
    title: 'Burning smells don’t always trace to the obvious source',
    description:
      'Heat and smell can travel along cable runs and through wall cavities, so the smell’s location isn’t always the fault’s location. Proper diagnosis needs thermal and circuit testing, not a visual check alone.',
  },
  {
    title: 'Water and electricity: isolate before you approach',
    description:
      'Flooding or a roof leak near electrical equipment is treated as live until proven otherwise. Do not enter standing water near a panel or outlet, and isolate supply at the main switch if it can be reached safely.',
  },
]

export default function EmergencyElectricalServicesPage() {
  const emergencyService = getServiceBySlug('emergency-electrical-response')
  const faultFinding = getServiceBySlug('fault-finding-diagnostics')
  const panelRepair = getServiceBySlug('panel-repair-upgrades')
  const emergencyFaqs = faqCategories.find((c) => c.category === 'Emergency & safety')?.items ?? []

  return (
    <>
      {emergencyService && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              serviceSchema({
                name: '24/7 Emergency Electrical Services',
                description: emergencyService.description,
                slug: emergencyService.slug,
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
              { name: 'Emergency Electrical Services', url: `${company.domain}/emergency-electrical-services` },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/emergency-hero-switchboard.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[60%_45%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-24 md:py-28">
          <span className="eyebrow text-yellow">24/7 Emergency Electrical Services</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            An active electrical hazard doesn&rsquo;t wait for a scheduled callout
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            For sparking, burning smells, exposed wiring, or a total power
            loss, call now. Our target response time is{' '}
            {company.emergencyResponseTarget}.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={company.phoneHref} variant="primary">
              CALL NOW
            </Button>
            <Button href={company.whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
              WHATSAPP
            </Button>
            <Button href="/contact" variant="secondary">
              Request Emergency Assistance
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
              A dedicated emergency line, not a general contact form
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">
              {emergencyService?.description ??
                'Electrical faults that pose a safety or business-continuity risk get a same-day, any-hour response from our team.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Problems we solve */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Problems we solve</span>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              What counts as an electrical emergency
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problemsWeSolve.map((problem) => (
              <MotionDiv
                key={problem}
                variants={staggerItem}
                className="flex gap-3 border border-paper/15 p-4 text-sm text-paper/85"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {problem}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Who we serve</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              Homes, businesses, and industrial sites
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whoWeServe.map((w) => (
              <MotionDiv key={w.name} variants={staggerItem} className="border-t-2 border-petrol pt-4">
                <h3 className="text-sm font-semibold text-ink">{w.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">{w.summary}</p>
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
              From call to safe again
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {emergencyProcess.map((step) => (
              <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-yellow pt-5">
                <span className="font-display text-sm text-paper/60">{step.step}</span>
                <h3 className="mt-2 text-base font-semibold text-paper">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{step.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Why choose Kell Electricals */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Why choose Kell Electricals</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              `COREN and NEMSA certified`,
              `${company.teamExperienceYears}+ years of combined engineering experience`,
              `Target emergency response: ${company.emergencyResponseTarget}`,
              `${company.trust.googleRating}★ Google rating from ${company.trust.googleReviewCount}+ reviews`,
            ].map((item) => (
              <MotionDiv key={item} variants={staggerItem} className="flex gap-3 border-b border-ink/10 pb-3 text-sm text-ink/75">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Technical considerations */}
      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Technical considerations</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              What to know before we arrive
            </h2>
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
      <FAQSection items={emergencyFaqs} viewAllHref="/faq" />

      {/* Related services */}
      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Related services</span>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-4">
            {[emergencyService, faultFinding, panelRepair]
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
          </div>
        </div>
      </section>

      <div className="container-content pb-4 text-center text-xs text-ink/65">
        Prefer to talk it through first? Call{' '}
        <TrackedLink channel="phone" href={company.phoneHref} className="link-underline font-semibold text-ink">
          {company.phone}
        </TrackedLink>{' '}
        directly.
      </div>

      <CTASection
        heading="Have an active electrical emergency?"
        body="Don't wait for a scheduled visit - call or WhatsApp us now."
        primaryLabel="CALL NOW"
        primaryHref={company.phoneHref}
        secondaryLabel="WHATSAPP"
        secondaryHref={company.whatsappHref}
      />
    </>
  )
}
