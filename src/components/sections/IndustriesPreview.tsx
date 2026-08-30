import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { industries } from '@/content/industries'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function IndustriesPreview() {
  return (
    <section className="bg-petrol-700 py-24 text-paper">
      <div className="container-content">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-yellow">Who we serve</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
              Engineered for the property in front of us
            </h2>
          </div>
          <Button href="/industries" variant="secondary">
            View all industries
          </Button>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <MotionDiv key={industry.slug} variants={staggerItem}>
              <Link
                href={`/industries/${industry.slug}`}
                className="link-underline block h-full border border-paper/15 p-6 text-paper/90 hover:border-yellow"
              >
                <h3 className="text-base font-semibold text-paper">{industry.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">{industry.summary}</p>
              </Link>
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
