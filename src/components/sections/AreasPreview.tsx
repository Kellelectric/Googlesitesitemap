import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { areas } from '@/content/areas'
import { company } from '@/content/company'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function AreasPreview() {
  return (
    <section className="border-y border-ink/10 bg-paper py-20">
      <div className="container-content">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-petrol/70">Where we work</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
              Serving all of Abuja, plus project work across Nigeria
            </h2>
          </div>
          <Button href="/contact" variant="secondary" data-on-light="true">
            Check your area
          </Button>
        </Reveal>

        <p className="mt-6 max-w-2xl text-sm text-ink/70">
          Featured districts with a dedicated page below — every other part
          of Abuja is covered too.
        </p>
        <StaggerGroup className="mt-6 flex flex-wrap gap-3">
          {areas.map((area) => (
            <MotionDiv key={area.slug} variants={staggerItem}>
              <Link
                href={`/electrician/${area.slug}`}
                className="link-underline block border border-ink/10 px-5 py-3 text-sm font-medium text-ink hover:border-petrol"
              >
                {area.name}
              </Link>
            </MotionDiv>
          ))}
        </StaggerGroup>
        <p className="mt-6 text-sm text-ink/60">
          Plus project work in {company.serviceRegion}.
        </p>
      </div>
    </section>
  )
}
