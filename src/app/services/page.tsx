import type { Metadata } from 'next'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { CTASection } from '@/components/sections/CTASection'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { services, categoryLabels, ServiceCategory } from '@/content/services'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Electrical Engineering Services',
  description:
    '16 electrical service lines across power systems, energy & solar, security & automation, industrial, and maintenance, delivered by a COREN and NEMSA certified team in Abuja.',
  alternates: { canonical: '/services' },
}

const categoryOrder: ServiceCategory[] = [
  'power',
  'energy',
  'security-automation',
  'industrial',
  'maintenance',
]

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-16 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Services</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            16 service lines, one certified engineering team
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Every service below runs through the same process: assess,
            design, install, test and hand over. Documented, not just
            done.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content space-y-16">
          {categoryOrder.map((category) => {
            const items = services.filter((s) => s.category === category)
            if (items.length === 0) return null
            return (
              <div key={category}>
                <Reveal>
                  <h2 className="eyebrow text-petrol/60">
                    {categoryLabels[category]}
                  </h2>
                </Reveal>
                <StaggerGroup className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((service) => (
                    <MotionDiv key={service.slug} variants={staggerItem}>
                      <ServiceCard service={service} />
                    </MotionDiv>
                  ))}
                </StaggerGroup>
              </div>
            )
          })}
        </div>
      </section>

      <CTASection />
    </>
  )
}
