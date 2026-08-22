import { process } from '@/content/process'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function ProcessSection() {
  return (
    <section className="bg-paper py-24">
      <div className="container-content">
        <Reveal>
          <span className="eyebrow text-petrol/60">How we work</span>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
            The same engineering process, every job
          </h2>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step) => (
            <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-petrol pt-5">
              <span className="font-display text-sm text-petrol/50">
                {step.step}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                {step.description}
              </p>
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
