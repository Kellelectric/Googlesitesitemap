import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { careerTracks, getCareerTrackBySlug } from '@/content/careers'
import { company } from '@/content/company'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return careerTracks.map((track) => ({ slug: track.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const track = getCareerTrackBySlug(params.slug)
  if (!track) return {}
  return pageMetadata({
    title: `${track.name} — Careers`,
    description: track.summary,
    path: `/careers/${track.slug}`,
    image: '/images/photos/career-detail-hero-vocational-training.jpg',
  })
}

export default function CareerTrackPage({ params }: Props) {
  const track = getCareerTrackBySlug(params.slug)
  if (!track) notFound()

  const isJobOpenings = track.slug === 'job-openings'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Careers', url: `${company.domain}/careers` },
              { name: track.name, url: `${company.domain}/careers/${track.slug}` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/career-detail-hero-vocational-training.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <nav className="eyebrow flex gap-2 text-paper/60" aria-label="Breadcrumb">
            <Link href="/careers" className="hover:text-paper">
              Careers
            </Link>
            <span>/</span>
            <span className="text-paper/80">{track.name}</span>
          </nav>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold md:text-5xl">{track.name}</h1>
          <p className="mt-5 max-w-xl text-paper/70">{track.description}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              href={track.applicationFormUrl}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </Button>
            <Button href={company.phoneHref} variant="secondary">
              Call {company.phone}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 md:grid-cols-3">
          {track.whoItsFor.length > 0 && (
            <div>
              <Reveal>
                <h2 className="text-xl font-semibold text-ink">Who it&rsquo;s for</h2>
                <ul className="mt-5 space-y-3">
                  {track.whoItsFor.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          )}

          {track.whatToExpect.length > 0 && (
            <div>
              <Reveal delay={0.08}>
                <h2 className="text-xl font-semibold text-ink">What to expect</h2>
                <ul className="mt-5 space-y-3">
                  {track.whatToExpect.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          )}

          <aside>
            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">How to apply</span>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">
                Fill out our{' '}
                <a
                  href={track.applicationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-semibold text-ink"
                >
                  {track.name} application form
                </a>{' '}
                and our team will follow up. Programme specifics (duration,
                schedule, and current availability) are confirmed directly
                once we hear from you. You can also reach us by email at{' '}
                <a href={`mailto:${company.email}`} className="link-underline font-semibold text-ink">
                  {company.email}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Other ways to get involved</span>
          </Reveal>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {careerTracks
              .filter((t) => t.slug !== track.slug)
              .map((other) => (
                <MotionDiv key={other.slug} variants={staggerItem}>
                  <Link
                    href={`/careers/${other.slug}`}
                    className="link-underline block border border-paper/15 p-5 text-sm font-medium text-paper/90 hover:border-yellow"
                  >
                    {other.name}
                  </Link>
                </MotionDiv>
              ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection
        heading="Ready to apply?"
        body="Fill out the application form and we'll follow up with next steps."
        primaryLabel="Apply Now"
        primaryHref={track.applicationFormUrl}
        primaryExternal
      />
    </>
  )
}
