import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { getArticleBySlug } from '@/content/resources'
import { breadcrumbSchema, serviceSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Maintenance & AMC',
  description:
    'Annual maintenance contracts covering scheduled panel inspection, thermal imaging, and generator/solar checks - with a documented report after every visit.',
  path: '/maintenance-amc',
  image: '/images/photos/maintenance-hero-solar-check.jpg',
})

const whatsCovered = [
  {
    title: 'Panel and circuit inspection',
    description:
      'Scheduled visual and thermal inspection of distribution boards and switchgear, checking for loose connections, thermal hotspots, and signs of wear before they become failures.',
  },
  {
    title: 'Thermal imaging surveys',
    description:
      'Thermal imaging catches developing faults (loose connections, overloaded circuits, failing components) that a visual inspection alone misses, since these show up as heat before they show up as visible damage.',
  },
  {
    title: 'Generator and solar/inverter checks',
    description:
      'Scheduled testing and servicing so backup systems are actually ready when an outage happens, not discovered to be faulty during one. Covers load testing, battery health, and automatic transfer switch function.',
  },
  {
    title: 'Testing and compliance documentation',
    description:
      'Earth loop impedance, insulation resistance, and protective device testing, with a written report after every visit - the same documentation trail covered on our certifications and compliance page.',
  },
]

const maintenanceTiers = [
  {
    name: 'Standard',
    cadence: 'Quarterly visits',
    description: 'Scheduled inspection and core system checks for dependable baseline coverage.',
    features: [
      'Quarterly electrical panel inspection',
      'Circuit and earthing continuity checks',
      'Visual thermal-risk assessment',
      'Digital inspection report after each visit',
    ],
  },
  {
    name: 'Gold',
    cadence: 'Bi-monthly visits',
    description: 'Everything in Standard, plus air-conditioning servicing and faster response when issues arise.',
    features: [
      'Everything in Standard',
      'Bi-monthly HVAC and AC servicing',
      'Solar and inverter performance checks',
      'Priority scheduling for repair callouts',
    ],
  },
  {
    name: 'Platinum',
    cadence: 'Monthly visits',
    description: 'Full-coverage plan for clients who need maintenance treated as a fixed, predictable cost.',
    features: [
      'Everything in Gold',
      'Monthly full-system inspection',
      'Repair costs covered up to plan threshold',
      'Dedicated account engineer',
    ],
  },
]

const whoItsFor = [
  {
    title: 'Commercial and industrial sites',
    description: 'Documented, scheduled compliance is often a requirement, not a nice-to-have, and downtime has a direct cost.',
  },
  {
    title: 'Property managers overseeing multiple sites',
    description: 'One schedule and one point of contact across a portfolio, instead of reactive callouts handled site by site.',
  },
  {
    title: 'Homeowners wanting proactive maintenance',
    description: "Catching a developing fault at a scheduled visit costs less, in money and disruption, than an emergency callout after it's failed.",
  },
]

export default function MaintenanceAmcPage() {
  const maintenanceService = getServiceBySlug('preventive-maintenance-contracts')
  const faultFinding = getServiceBySlug('fault-finding-diagnostics')
  const generatorService = getServiceBySlug('generator-installation-maintenance')
  const inspectionArticle = getArticleBySlug('how-often-you-need-an-electrical-safety-inspection')
  const relatedServices = [maintenanceService, faultFinding, generatorService].filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  )

  return (
    <>
      {maintenanceService && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              serviceSchema({
                name: 'Maintenance & AMC',
                description: maintenanceService.description,
                slug: 'maintenance-amc',
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
              { name: 'Maintenance & AMC', url: `${company.domain}/maintenance-amc` },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/maintenance-hero-solar-check.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[55%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Maintenance &amp; AMC</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Scheduled maintenance that catches faults before they become outages
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            {maintenanceService?.description ??
              'Most electrical failures are preventable with scheduled inspection - an annual maintenance contract handles the timing for you.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Request an AMC Quote
            </Button>
            <Button href={company.whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
              WHATSAPP
            </Button>
          </div>
        </div>
      </section>

      {/* What's covered */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">What&rsquo;s covered</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              A fixed schedule, not a reactive callout
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {whatsCovered.map((item) => (
              <MotionDiv key={item.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Tiered plans */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Three tiers of ongoing protection</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              Pick the cadence that matches your risk
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
              Every plan replaces reactive, unplanned callouts with scheduled
              inspection and servicing, so small issues are caught before
              they become expensive failures.
            </p>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {maintenanceTiers.map((tier) => (
              <MotionDiv key={tier.name} variants={staggerItem} className="border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">{tier.cadence}</span>
                <h3 className="mt-2 text-xl font-semibold text-ink">{tier.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{tier.description}</p>
                <ul className="mt-5 space-y-2 border-t border-ink/10 pt-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-ink/75">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </MotionDiv>
            ))}
          </StaggerGroup>
          <p className="mt-6 text-xs text-ink/60">
            Full plan inclusions, pricing, and response-time commitments are detailed in your individual proposal.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Who it&rsquo;s for</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
              Built around your property, not a one-size schedule
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {whoItsFor.map((item) => (
              <MotionDiv key={item.title} variants={staggerItem} className="border-t-2 border-yellow pt-5">
                <h3 className="text-base font-semibold text-paper">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{item.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Learn more */}
      {inspectionArticle && (
        <section className="bg-paper py-20">
          <div className="container-content">
            <Reveal>
              <span className="eyebrow text-petrol/70">Related reading</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                How often you actually need an inspection
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">{inspectionArticle.summary}</p>
              <Link
                href={`/resources/${inspectionArticle.slug}`}
                className="link-underline mt-4 inline-block text-sm font-semibold text-petrol"
              >
                Read the full guide
              </Link>
            </Reveal>
          </div>
        </section>
      )}

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
        heading="Ready to put maintenance on a schedule?"
        body="Tell us about your property and we'll scope a maintenance contract around its actual risk profile."
        primaryLabel="Request an AMC Quote"
        primaryHref="/contact"
        secondaryLabel="WHATSAPP"
        secondaryHref={company.whatsappHref}
      />
    </>
  )
}
