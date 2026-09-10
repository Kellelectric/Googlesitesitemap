import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { careerTracks } from '@/content/careers'
import { company } from '@/content/company'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

// Hub cards previously had no imagery at all (plain bordered text boxes).
// Assigned real, distinct photos per track from public/images/photos/ -
// career-detail-hero-vocational-training.jpg and
// careers-hero-apprentice-training.jpg were sitting unused on disk.
const heroImageBySlug: Record<string, string> = {
  'nysc-placement': '/images/photos/about-hero-team.jpg',
  internship: '/images/photos/career-detail-hero-vocational-training.jpg',
  'industrial-training': '/images/photos/careers-hero-apprentice-training.jpg',
  apprenticeship: '/images/photos/electrician-area-hero-onsite.jpg',
  'job-openings': '/images/photos/hero-control-panel.jpg',
}

export const metadata: Metadata = pageMetadata({
  title: 'Careers',
  description:
    'NYSC placement, internship, industrial training, apprenticeship, and job opportunities at Kell Electricals Ltd, a COREN and NEMSA certified engineering company.',
  path: '/careers',
  image: '/images/photos/about-hero-team.jpg',
})

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/about-hero-team.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[70%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-16 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Careers</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Build your career with a certified engineering team
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            From NYSC placement and student programmes to skilled trade
            development, here&rsquo;s how to get hands-on experience with
            Kell Electricals Ltd.
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
                  className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden border border-ink/10"
                >
                  <Image
                    src={heroImageBySlug[track.slug]}
                    alt=""
                    fill
                    quality={65}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
                  <div className="relative p-8">
                    <h2 className="text-2xl font-semibold text-paper">{track.name}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-paper/75">
                      {track.summary}
                    </p>
                    <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-yellow">
                      Learn more
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
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

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Why train with Kell Electricals</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              'COREN and NEMSA certified engineering team',
              `${company.teamExperienceYears}+ years of combined engineering experience to learn from`,
              `${company.trust.projectsCompleted}+ projects completed across residential, commercial, and industrial sites`,
              'Hands-on exposure to our documented process: assess, design, install, test, hand over',
            ].map((item) => (
              <MotionDiv
                key={item}
                variants={staggerItem}
                className="flex gap-3 border-b border-paper/15 pb-3 text-sm text-paper/80"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
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
