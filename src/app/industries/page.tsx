import type { Metadata } from 'next'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { industries } from '@/content/industries'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description:
    'Electrical engineering for residential, commercial, industrial, hospitality, education, healthcare, and retail properties across Abuja, engineered for the demands specific to each.',
  alternates: { canonical: '/industries' },
}

export default function IndustriesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-16 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Industries</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Built for what each property actually demands
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            A home, an office, a factory floor, and a hotel kitchen fail
            differently when the power goes. We size and specify for the
            property in front of us, not a generic template.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {industries.map((industry) => (
              <MotionDiv key={industry.slug} variants={staggerItem}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group relative flex h-full flex-col justify-between border border-ink/10 bg-paper p-8 transition-colors duration-200 hover:border-yellow"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
                  <div>
                    <h2 className="text-2xl font-semibold text-ink">
                      {industry.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">
                      {industry.summary}
                    </p>
                  </div>
                  <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-petrol">
                    View services
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection />
    </>
  )
}
