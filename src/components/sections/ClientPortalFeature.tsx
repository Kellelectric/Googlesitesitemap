import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { clientPortal } from '@/content/clientPortal'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function ClientPortalFeature() {
  return (
    <section className="relative overflow-hidden bg-petrol-700 py-24 text-paper">
      <CircuitLines className="pointer-events-none absolute -left-24 -bottom-16 h-full w-1/2 text-paper/5" />
      <div className="container-content relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr,1fr] lg:items-center">
        <Reveal>
          <span className="eyebrow text-yellow">{clientPortal.eyebrow}</span>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
            {clientPortal.heading}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-paper/70">{clientPortal.body}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Get Set Up
            </Button>
          </div>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-4">
          {clientPortal.features.map((item) => (
            <MotionDiv
              key={item}
              variants={staggerItem}
              className="flex gap-3 border border-paper/15 p-5 text-sm text-paper/85"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
              {item}
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
