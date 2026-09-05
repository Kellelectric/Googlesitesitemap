import type { Metadata } from 'next'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { serviceSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  // "Solar Company in Abuja" - real, accurate, and the flagship solar
  // page's own dedicated keyword target, distinct from the
  // /services/solar-inverter-systems service listing's "Solar in Abuja"
  // seoTitle (see services.ts) so the two pages don't cannibalize each
  // other's ranking for near-identical phrasing.
  title: 'Solar Company in Abuja',
  description:
    'Certified solar company in Abuja - load-analyzed solar and hybrid inverter systems sized for Nigeria\'s real grid, not a generic panel count.',
  path: '/solar-energy-systems',
  image: '/images/photos/solar-hero-panel-install.jpg',
})

const methodology = [
  {
    step: '01',
    title: 'Consumption audit',
    description:
      'We measure actual circuit-level consumption over time, not a guess from your utility bill, to establish a real load profile, including peak demand and what runs during an outage.',
  },
  {
    step: '02',
    title: 'System sizing',
    description:
      'Panel array, battery bank, and inverter capacity are sized against the measured load and your backup priorities, with headroom for future additions rather than a system that’s maxed out on day one.',
  },
  {
    step: '03',
    title: 'Component selection',
    description:
      'Hybrid inverter and battery chemistry selected for your duty cycle. Daily cycling for backup-only systems is a different spec than a system designed to reduce generator hours materially.',
  },
  {
    step: '04',
    title: 'Installation & integration',
    description:
      'Grid, solar, and generator integrated with automatic transfer, installed to the documented design with safety isolation observed throughout.',
  },
  {
    step: '05',
    title: 'Commissioning & handover',
    description:
      'Performance testing against the design spec, monitoring setup, and documented handover, so you know the system is delivering what it was sized to deliver.',
  },
]

const tiers = [
  {
    name: 'Backup essentials',
    summary:
      'Keeps critical circuits running through an outage: lighting, networking, security systems, refrigeration.',
    fit: 'Homes and small offices prioritizing outage continuity over full independence from the grid.',
  },
  {
    name: 'Full home or office',
    summary:
      'Sized to carry the majority of daily consumption, including air conditioning and larger appliance loads, with the grid or generator as backup rather than the primary source.',
    fit: 'Households and businesses looking to materially cut grid/generator dependence, not just ride out outages.',
  },
  {
    name: 'Commercial & industrial',
    summary:
      'Three-phase hybrid systems integrated with existing generator infrastructure and load management, sized against measured industrial or commercial demand profiles.',
    fit: 'Businesses where generator fuel cost or downtime risk justifies a larger, professionally load-managed system.',
  },
]

export default function SolarEnergySystemsPage() {
  const solar = getServiceBySlug('solar-inverter-systems')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: 'Solar & Hybrid Energy Systems',
              description:
                'Load-analyzed solar and hybrid inverter systems sized for Nigeria’s grid reality.',
              slug: 'solar-inverter-systems',
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
              { name: 'Solar & Energy Systems', url: `${company.domain}/solar-energy-systems` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/solar-hero-panel-install.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[55%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-24 md:py-28">
          <span className="eyebrow text-yellow">Flagship capability</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Solar & Hybrid Energy Systems
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Reliable power in Nigeria means designing for the grid you
            actually have. We run a full load analysis before specifying a
            single panel, then size and install a system to match real
            consumption, not a generic panel count.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Request a Sizing Consultation
            </Button>
            {solar && (
              <Button href={`/services/${solar.slug}`} variant="secondary">
                View service scope
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Our sizing methodology</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
              Measured, not estimated
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">
              Most oversized or undersized solar installs trace back to one
              thing: sizing from an assumption instead of a measurement. Our
              process starts with data.
            </p>
          </Reveal>

          <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {methodology.map((step) => (
              <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <span className="font-display text-sm text-petrol/70">{step.step}</span>
                <h3 className="mt-2 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">System tiers</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
              Sized to what the system actually needs to do
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-paper/70">
              These are starting points for the conversation, not fixed
              packages. Your exact panel count, battery capacity, and
              inverter rating come out of the consumption audit above.
            </p>
          </Reveal>

          <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <MotionDiv key={tier.name} variants={staggerItem} className="border border-paper/15 p-6">
                <h3 className="text-lg font-semibold text-yellow">{tier.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/75">{tier.summary}</p>
                <p className="mt-4 border-t border-paper/15 pt-4 text-xs uppercase tracking-[0.06em] text-paper/60">
                  Best fit
                </p>
                <p className="mt-2 text-sm leading-relaxed text-paper/70">{tier.fit}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal className="border border-ink/10 p-8 md:p-10">
            <span className="eyebrow text-petrol/70">Illustrative example</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              What the sizing process looks like in practice
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/70">
              Worked in general terms to show the logic. Your actual
              numbers come from your own consumption audit, not this
              example.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="eyebrow text-petrol/70">Measure</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Circuit-level monitoring identifies which loads run
                  during a typical outage and for how long. This
                  becomes the backup load profile.
                </p>
              </div>
              <div>
                <p className="eyebrow text-petrol/70">Size</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Battery capacity is sized to that backup load profile
                  plus a safety margin; panel array is sized to recharge
                  that capacity within the available daylight hours.
                </p>
              </div>
              <div>
                <p className="eyebrow text-petrol/70">Verify</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Commissioning tests confirm the system actually carries
                  the backup load profile for the duration it was designed
                  for, not just that it powers on.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  )
}
