import type { Metadata } from 'next'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Kell Electricals Ltd is a COREN and NEMSA certified electrical engineering company based in Wuse 2, Abuja, serving homes, businesses, and industrial sites across Abuja and wider Nigeria.',
  alternates: { canonical: '/about' },
}

const foundingYear = new Date().getFullYear() - company.yearsExperience

const teamRoles = [
  {
    title: 'Engineering & design',
    description:
      'Load assessments, circuit design, and system sizing — the documented specification every job is built against before any work starts on site.',
  },
  {
    title: 'Installation & technical crew',
    description:
      'Certified technicians executing the documented design, following safety isolation and site protocols on every job, residential through industrial.',
  },
  {
    title: 'Testing & compliance',
    description:
      'Commissioning tests and compliance checks against COREN and NEMSA standards, with as-built documentation produced on handover — not just a completed job, a documented one.',
  },
  {
    title: 'Client & project coordination',
    description:
      'The point of contact from first assessment through handover, keeping scope, timeline, and communication in one place for every job.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">About Us</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            {company.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">{company.positioning}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-[1fr,380px]">
          <div>
            <Reveal>
              <span className="eyebrow text-petrol/60">Our mission</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                Electrical work that holds up under Nigeria&rsquo;s real
                operating conditions
              </h2>
              <p className="mt-5 leading-relaxed text-ink/75">
                Since {foundingYear}, {company.name} has worked on the
                assumption that electrical infrastructure in Nigeria has to
                be engineered for the grid conditions that actually exist —
                not the ones on paper. That means load analysis before
                design, documented specifications before installation, and
                compliance testing before handover, on every job regardless
                of size.
              </p>
              <p className="mt-4 leading-relaxed text-ink/75">
                We don&rsquo;t put a name on the door. The team behind every
                job — engineers, technicians, and project coordinators —
                works to the same documented process, so the standard of
                work doesn&rsquo;t depend on which crew shows up.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/60">How the team is organized</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                Four functions, one process
              </h2>
            </Reveal>

            <StaggerGroup className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {teamRoles.map((role) => (
                <MotionDiv key={role.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                  <h3 className="text-lg font-semibold text-ink">{role.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    {role.description}
                  </p>
                </MotionDiv>
              ))}
            </StaggerGroup>
          </div>

          <aside className="space-y-8">
            <Reveal className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/60">Certified & registered</span>
              <ul className="mt-4 space-y-4">
                {company.certifications.map((cert) => (
                  <li key={cert.name}>
                    <p className="font-semibold text-ink">{cert.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">
                      {cert.fullName}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-ink/10 pt-4 text-xs text-ink/50">
                RC {company.rcNumber} · {company.legalName}
              </p>
            </Reveal>

            <Reveal delay={0.08} className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/60">Where we work</span>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                {company.serviceAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
              <p className="mt-4 border-t border-ink/10 pt-4 text-xs text-ink/50">
                Plus project work across {company.serviceRegion.replace('Abuja and ', '')}.
              </p>
            </Reveal>

            <Reveal delay={0.16} className="border border-orange/30 bg-orange/5 p-6">
              <span className="eyebrow text-orange">{company.yearsExperience}+ years</span>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                in electrical engineering across residential, commercial,
                and industrial sites.
              </p>
            </Reveal>
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  )
}
