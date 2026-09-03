import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { CareerApplicationForm } from '@/components/careers/CareerApplicationForm'
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
    title: `${track.name} - Careers`,
    description: track.summary,
    path: `/careers/${track.slug}`,
    image: '/images/photos/career-detail-hero-vocational-training.jpg',
  })
}

export default function CareerTrackPage({ params }: Props) {
  const track = getCareerTrackBySlug(params.slug)
  if (!track) notFound()

  const isJobOpenings = track.slug === 'job-openings'
  // Job openings lists full descriptive strings ("Licensed Electrician
  // (Journeyman level) - residential & commercial installation..."), so
  // the role picker in the application form only needs the label before
  // the first " - ".
  const roleOptions = isJobOpenings
    ? track.whoItsFor.map((item) => item.split(' - ')[0].trim())
    : undefined

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
            <Button href="#apply" variant="primary">
              Apply Now
            </Button>
            <Button href={company.phoneHref} variant="secondary">
              Call {company.phone}
            </Button>
          </div>
        </div>
      </section>

      {(track.duration || track.stipend || track.programmeFee || track.intake || (track.eligibility && track.eligibility.length > 0)) && (
        <section className="bg-paper pt-20">
          <div className="container-content">
            <Reveal>
              <span className="eyebrow text-petrol/70">Programme details</span>
              <p className="mt-2 max-w-2xl text-xs text-ink/60">
                {track.programmeDetailsConfirmed
                  ? 'Confirmed programme terms.'
                  : 'Indicative - confirmed directly once we hear from you.'}
              </p>
            </Reveal>
            <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {track.duration && (
                <MotionDiv variants={staggerItem} className="border border-ink/10 p-5">
                  <span className="eyebrow text-petrol/70">Duration</span>
                  <p className="mt-2 text-sm text-ink/80">{track.duration}</p>
                </MotionDiv>
              )}
              {track.programmeFee && (
                <MotionDiv variants={staggerItem} className="border border-ink/10 p-5">
                  <span className="eyebrow text-petrol/70">Programme fee</span>
                  <p className="mt-2 text-sm text-ink/80">{track.programmeFee}</p>
                </MotionDiv>
              )}
              {track.stipend && (
                <MotionDiv variants={staggerItem} className="border border-ink/10 p-5">
                  <span className="eyebrow text-petrol/70">Stipend</span>
                  <p className="mt-2 text-sm text-ink/80">{track.stipend}</p>
                </MotionDiv>
              )}
              {track.intake && (
                <MotionDiv variants={staggerItem} className="border border-ink/10 p-5">
                  <span className="eyebrow text-petrol/70">Intake</span>
                  <p className="mt-2 text-sm text-ink/80">{track.intake}</p>
                </MotionDiv>
              )}
              {track.eligibility && track.eligibility.length > 0 && (
                <MotionDiv variants={staggerItem} className="border border-ink/10 p-5 sm:col-span-2 lg:col-span-1">
                  <span className="eyebrow text-petrol/70">Eligibility</span>
                  <ul className="mt-2 space-y-1.5">
                    {track.eligibility.map((item) => (
                      <li key={item} className="text-sm text-ink/80">
                        &middot; {item}
                      </li>
                    ))}
                  </ul>
                </MotionDiv>
              )}
            </StaggerGroup>
          </div>
        </section>
      )}

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
                Apply directly below - the whole process, from application
                to confirmation, is handled online. Programme specifics
                (duration, schedule, and current availability) are
                confirmed directly once we hear from you. You can also
                reach us by email at{' '}
                <a href={`mailto:${company.email}`} className="link-underline font-semibold text-ink">
                  {company.email}
                </a>
                .
              </p>
              {track.applicationChecklist && track.applicationChecklist.length > 0 && (
                <div className="mt-5 border-t border-ink/10 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                    What to include
                  </span>
                  <ul className="mt-2 space-y-1.5">
                    {track.applicationChecklist.map((item) => (
                      <li key={item} className="text-sm text-ink/75">
                        &middot; {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="apply" className="scroll-mt-16 border-t border-ink/10 bg-paper py-20">
        <div className="container-content max-w-2xl">
          <Reveal>
            <span className="eyebrow text-petrol/70">Apply now</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              Apply for {track.name}
            </h2>
          </Reveal>
          <div className="mt-8">
            <CareerApplicationForm
              trackSlug={track.slug}
              trackName={track.name}
              roleOptions={roleOptions}
            />
          </div>
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
        primaryHref="#apply"
      />
    </>
  )
}
