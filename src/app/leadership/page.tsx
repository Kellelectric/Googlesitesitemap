import type { Metadata } from 'next'
import Image from 'next/image'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { team } from '@/content/team'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema, teamSchema } from '@/lib/schema'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Leadership',
  description: `Meet the people behind ${company.name} - the founder, management, and specialists who plan and execute every job.`,
  path: '/leadership',
  image: '/images/photos/about-hero-team.jpg',
})

// The first two entries in team.ts (Gabriel, Thelma) hold the company's
// two leadership titles (Founder & CEO, Managing Director); the rest hold
// functional/specialist titles - see team.ts's own header comment for the
// real source of each. Splitting the same array into two groups here is a
// presentation choice, not new data - no bio content is added beyond what
// team.ts already has for each person.
const [leadership, restOfTeam] = [team.slice(0, 2), team.slice(2)]

export default function LeadershipPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'About', url: `${company.domain}/about` },
              { name: 'Leadership', url: `${company.domain}/leadership` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema(team)) }}
      />

      {/* Hero */}
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
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Leadership</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            The people behind every job
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            {company.name} stays a small team on purpose - the same people
            who plan a job are often the ones executing it. Here&rsquo;s who
            you&rsquo;ll actually be working with.
          </p>
        </div>
      </section>

      {/* Leadership - Gabriel and Thelma, given more room here than the
          compact /about card grid: full-width bios, larger portraits. */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Leadership</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              Founder &amp; management
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 space-y-10">
            {leadership.map((member) => (
              <MotionDiv
                key={member.name}
                variants={staggerItem}
                className="grid grid-cols-1 gap-8 border-t border-ink/10 pt-10 sm:grid-cols-[220px,1fr]"
              >
                {member.photo && (
                  <div className="relative aspect-square w-full max-w-[220px] overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-ink">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-petrol/80">{member.title}</p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink/75">{member.bio}</p>
                </div>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Our Team */}
      <section className="border-t border-ink/10 bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Our team</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              The specialists on every job
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {restOfTeam.map((member) => (
              <MotionDiv
                key={member.name}
                variants={staggerItem}
                className="flex h-full flex-col border border-ink/10"
              >
                {member.photo && (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col border-t-2 border-petrol p-5">
                  <h3 className="text-lg font-semibold text-ink">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-petrol/80">{member.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{member.bio}</p>
                </div>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection
        heading="Interested in working with us?"
        body="Whether you're a client with a project to scope, or a candidate who wants to join the team, we'd like to hear from you."
        primaryLabel="Request a Quote"
        secondaryLabel="View careers"
        secondaryHref="/careers"
      />
    </>
  )
}
