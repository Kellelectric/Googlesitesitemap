import { Button } from '@/components/ui/Button'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { services } from '@/content/services'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function ServicesPreview() {
  const featured = services.filter((s) => s.flagship).concat(
    services.filter((s) => !s.flagship).slice(0, 5),
  )

  return (
    <section className="bg-paper py-24">
      <div className="container-content">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-petrol/60">What we do</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
              16 service lines, one engineering process
            </h2>
          </div>
          <Button href="/services" variant="secondary" data-on-light="true">
            View all services
          </Button>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <MotionDiv key={service.slug} variants={staggerItem}>
              <ServiceCard service={service} />
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
