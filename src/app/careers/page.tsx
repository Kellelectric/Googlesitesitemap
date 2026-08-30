import type { Metadata } from 'next'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { careerTracks } from '@/content/careers'
import { company } from '@/content/company'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Careers',
  description:
    'Internship, industrial training, apprenticeship, and job opportunities at Kell Electricals Ltd, a COREN and NEMSA certified electrical engineering company in Abuja.',
  path: '/careers',
})

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-16 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Careers</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Build your career with a certified engineering team
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            From student placements to skilled trade development, here&rsquo;s
            how to get hands-on experience with Kell Electricals Ltd.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {careerTracks.map((track) => (
              <MotionDiv key={track.slug} variants={staggerItem}>
                <Link
                  href={`/careers/${track.slug}`}
                  className="group relative flex h-full flex-col justify-between border border-ink/10 bg-paper p-8 transition-colors duration-200 hover:border-yellow"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
                  <div>
                    <h2 className="text-2xl font-semibold text-ink">{track.name}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">
                      {track.summary}
                    </p>
                  </div>
                  <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-petrol">
                    Learn more
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </MotionDiv>
            ))}
          </StaggerGroup>

          <Reveal delay={0.12} className="mt-16 border border-ink/10 bg-petrol/5 p-8">
            <span className="eyebrow text-petrol/70">Speculative applications</span>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75">
              Don&rsquo;t see the right fit listed, but want to apply anyway?
              Send your CV to{' '}
              <a href={`mailto:${company.email}`} className="link-underline font-semibold text-ink">
                {company.email}
              </a>{' '}
              with a short note on what you&rsquo;re looking for and we&rsquo;ll
              keep it on file.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection
        heading="Questions about a career at Kell Electricals?"
        body="Reach out directly and our team will point you to the right programme."
        primaryLabel="Email us"
        primaryHref={`mailto:${company.email}`}
      />
    </>
  )
}
