import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { getServiceBySlug } from '@/content/services'
import { Reveal } from '@/components/ui/Reveal'

export function SolarFeature() {
  const solar = getServiceBySlug('solar-inverter-systems')
  if (!solar) return null

  return (
    <section className="relative overflow-hidden bg-petrol text-paper">
      <CircuitLines className="pointer-events-none absolute -left-32 -top-16 h-[140%] w-[70%] text-paper/5" />
      <div className="container-content relative grid grid-cols-1 gap-12 py-24 md:grid-cols-2 md:items-center">
        <Reveal>
          <span className="eyebrow text-yellow">Featured capability</span>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            {solar.name}
          </h2>
          <p className="mt-5 text-paper/70 leading-relaxed">
            {solar.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={`/services/${solar.slug}`} variant="primary">
              Explore solar systems
            </Button>
            <Button href="/contact" variant="secondary">
              Request a sizing consultation
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="border border-paper/15 p-8">
          <span className="eyebrow text-paper/50">System design covers</span>
          <ul className="mt-5 space-y-4">
            {solar.scope.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-paper/80">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
