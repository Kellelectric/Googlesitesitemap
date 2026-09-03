import Image from 'next/image'
import { process } from '@/content/process'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

// Was a uniform 4-col text-only grid - four identical boxes reading as a
// generic "how it works" template. Now asymmetric: step 01 gets a real
// supporting photo and a featured layout (the only step visitors need to
// see slowed down on - it's where the relationship starts), steps 02-04
// keep a tighter three-up rhythm with large ghost numerals as background
// texture instead of a small caption line, echoing the numbered-index
// device used elsewhere on the homepage.
export function ProcessSection() {
  const [first, ...rest] = process

  return (
    <section className="bg-paper py-28">
      <div className="container-content">
        <Reveal>
          <span className="eyebrow text-petrol/70">How we work</span>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
            The same engineering process, every job
          </h2>
        </Reveal>

        <Reveal
          delay={0.05}
          className="mt-14 grid grid-cols-1 gap-8 border-t-2 border-petrol pt-8 lg:grid-cols-[1fr,1.15fr] lg:items-center lg:gap-16"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/photos/about-blueprint-review.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              quality={70}
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-display block text-7xl font-semibold leading-none text-petrol/10 md:text-8xl">
              {first.step}
            </span>
            <h3 className="-mt-5 text-2xl font-semibold text-ink md:-mt-6 md:text-3xl">{first.title}</h3>
            <p className="mt-4 max-w-md text-ink/65 leading-relaxed">{first.description}</p>
          </div>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-10 border-t border-ink/10 pt-10 sm:grid-cols-3">
          {rest.map((step) => (
            <MotionDiv key={step.step} variants={staggerItem} className="relative">
              <span className="font-display block text-6xl font-semibold leading-none text-petrol/10">
                {step.step}
              </span>
              <h3 className="-mt-3 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.description}</p>
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
