import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { PartnerLogos } from '@/components/sections/PartnerLogos'
import { company } from '@/content/company'
import { partners } from '@/content/partners'
import { team } from '@/content/team'
import { ceoMessage } from '@/content/ceoMessage'
import { areas } from '@/content/areas'
import { process } from '@/content/process'
import { pageMetadata } from '@/lib/metadata'
import { teamSchema } from '@/lib/schema'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'About Us',
  description: `COREN and NEMSA certified electrical engineering in Wuse 2, Abuja - ${company.teamExperienceYears}+ years of combined experience in residential, commercial, and industrial work.`,
  path: '/about',
  image: '/images/photos/about-blueprint-review.jpg',
})

const milestones = [
  { year: '2010', description: 'Company founded to provide reliable electrical services in Abuja.' },
  { year: '2012', description: 'First major residential project: electrical installations for a 50-unit housing estate.' },
  { year: '2015', description: 'Expansion into commercial services, with contracts for office and retail projects.' },
  { year: '2018', description: 'Industry recognition and certification for quality and safety standards.' },
  { year: '2020', description: 'Solar and smart home solutions launched.' },
  { year: '2023', description: 'Expansion of project work beyond Abuja.' },
  { year: '2024', description: 'Largest project to date completed: electrical work for a 200-home estate.' },
]

const whatWeDo = [
  'Residential electrical installation and repair',
  'Commercial electrical fit-outs and maintenance',
  'Industrial electrical systems and power distribution',
  'Solar and inverter systems',
  'Home automation and smart building infrastructure',
  'CCTV and security systems',
  'Preventive and emergency electrical maintenance',
]

const values = [
  {
    title: 'Safety first',
    description:
      'Every job follows documented safety isolation and site protocols, not shortcuts, regardless of how routine the work looks.',
  },
  {
    title: 'Documented, not just done',
    description:
      'A specified design, commissioning tests, and as-built documentation on handover - so the client has a record, not just a memory.',
  },
  {
    title: 'Engineered for real conditions',
    description:
      "Load analysis and design decisions based on Nigeria's actual grid conditions, not textbook assumptions.",
  },
  {
    title: 'One standard, every crew',
    description:
      "The same documented process on every job, so the quality of the work doesn't depend on which technician shows up.",
  },
]

const whyChooseUs = [
  `${company.teamExperienceYears}+ years of combined engineering experience across residential, commercial, and industrial sites`,
  `COREN and NEMSA certified`,
  `${company.trust.googleRating}★ Google rating from ${company.trust.googleReviewCount}+ customer reviews`,
  `Emergency response target of ${company.emergencyResponseTarget}`,
  `${company.trust.projectsCompleted}+ projects completed`,
  `Service coverage across all of Abuja, plus project work in ${company.serviceRegion}`,
]

const teamRoles = [
  {
    title: 'Engineering & design',
    description:
      'Load assessments, circuit design, and system sizing: the documented specification every job is built against before any work starts on site.',
  },
  {
    title: 'Installation & technical crew',
    description:
      'Certified technicians executing the documented design, following safety isolation and site protocols on every job, residential through industrial.',
  },
  {
    title: 'Testing & compliance',
    description:
      'Commissioning tests and compliance checks against COREN and NEMSA standards, with as-built documentation produced on handover. Not just a completed job, a documented one.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema(team)) }}
      />
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">About Us</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Engineering Power. Building Trust.
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">{company.positioning}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-[1fr,380px]">
          <div>
            {/* Who We Are */}
            <Reveal>
              <span className="eyebrow text-petrol/70">Who we are</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                A professional electrical engineering and technical services
                company, based in Abuja
              </h2>
              <p className="mt-5 leading-relaxed text-ink/75">
                {company.name} ({company.legalName}, RC {company.rcNumber}) is
                a COREN and NEMSA certified electrical engineering company
                serving homes, businesses, and industrial sites across Abuja
                and wider Nigeria. Our team brings {company.teamExperienceYears}+
                years of combined engineering experience to every job, from a
                single socket repair to a full industrial power distribution
                build-out.
              </p>
              <p className="mt-4 leading-relaxed text-ink/75">
                We don&rsquo;t put a name on the door. The team behind every
                job (engineers, technicians, and project coordinators) works
                to the same documented process, so the standard of work
                doesn&rsquo;t depend on which crew shows up.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="relative mt-10 h-64 overflow-hidden sm:h-80">
              <Image
                src="/images/photos/about-blueprint-review.jpg"
                alt="Engineers reviewing project blueprints on site"
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover"
              />
            </Reveal>

            {/* CEO Message */}
            <Reveal delay={0.1} className="mt-14 border-l-2 border-yellow bg-petrol/5 p-6 md:p-8">
              <span className="eyebrow text-petrol/70">{ceoMessage.heading}</span>
              {ceoMessage.message.map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-lg leading-relaxed text-ink/80 ${i === 0 ? 'mt-5' : 'mt-4'}`}
                >
                  {paragraph}
                </p>
              ))}
              <p className="mt-5 font-display text-base font-semibold text-ink">
                {ceoMessage.signOff}
                <span className="ml-2 text-sm font-normal text-ink/60">
                  {ceoMessage.signOffTitle}
                </span>
              </p>
            </Reveal>

            {/* Leadership */}
            <div id="team" className="scroll-mt-24">
              <Reveal delay={0.1} className="mt-14">
                <span className="eyebrow text-petrol/70">Leadership</span>
                <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                  Who you&rsquo;ll be working with
                </h2>
              </Reveal>
            </div>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <MotionDiv key={member.name} variants={staggerItem} className="border border-ink/10">
                  {member.photo && (
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="border-t-2 border-petrol p-5">
                    <h3 className="text-lg font-semibold text-ink">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-petrol/80">{member.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">{member.bio}</p>
                  </div>
                </MotionDiv>
              ))}
            </StaggerGroup>

            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">Company history</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                From startup to Abuja&rsquo;s go-to electrical engineering team
              </h2>
            </Reveal>

            <StaggerGroup className="mt-8 space-y-6 border-l-2 border-petrol/20 pl-6">
              {milestones.map((milestone) => (
                <MotionDiv key={milestone.year} variants={staggerItem}>
                  <span className="font-display text-sm font-semibold text-petrol">
                    {milestone.year}
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    {milestone.description}
                  </p>
                </MotionDiv>
              ))}
            </StaggerGroup>

            {/* What We Do */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">What we do</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                Electrical engineering across every property type
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {whatWeDo.map((item) => (
                <MotionDiv
                  key={item}
                  variants={staggerItem}
                  className="flex gap-3 border-b border-ink/10 pb-3 text-sm text-ink/75"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                  {item}
                </MotionDiv>
              ))}
            </StaggerGroup>

            {/* Mission / Vision */}
            <Reveal delay={0.1} className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="border-t-2 border-petrol pt-5">
                <span className="eyebrow text-petrol/70">Our mission</span>
                <p className="mt-3 leading-relaxed text-ink/75">
                  To engineer electrical infrastructure for the grid
                  conditions that actually exist in Nigeria - with load
                  analysis before design, documented specifications before
                  installation, and compliance testing before handover, on
                  every job regardless of size.
                </p>
              </div>
              <div className="border-t-2 border-petrol pt-5">
                <span className="eyebrow text-petrol/70">Our vision</span>
                <p className="mt-3 leading-relaxed text-ink/75">
                  To be the electrical engineering partner Nigerian homes,
                  businesses, and industrial sites trust by default - known
                  for work that is engineered, documented, and built to last.
                </p>
              </div>
            </Reveal>

            {/* Our Values */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">Our values</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                What every job is held to
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {values.map((value) => (
                <MotionDiv key={value.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                  <h3 className="text-lg font-semibold text-ink">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{value.description}</p>
                </MotionDiv>
              ))}
            </StaggerGroup>

            {/* Our Expertise */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">Our expertise</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                Four functions, one process
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {teamRoles.map((role) => (
                <MotionDiv key={role.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                  <h3 className="text-lg font-semibold text-ink">{role.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{role.description}</p>
                </MotionDiv>
              ))}
            </StaggerGroup>

            {/* Partners & Suppliers */}
            {partners.length > 0 && (
              <div className="mt-14">
                <PartnerLogos partners={partners} />
              </div>
            )}

            {/* Our Process */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">Our process</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                Assess, design, install, test &amp; handover
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {process.map((step) => (
                <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                  <span className="font-display text-sm font-semibold text-petrol">{step.step}</span>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.description}</p>
                </MotionDiv>
              ))}
            </StaggerGroup>
          </div>

          <aside className="space-y-8">
            {/* Why Choose Us */}
            <Reveal delay={0.16} className="border border-orange/30 bg-orange/5 p-6">
              <span className="eyebrow text-ink">Why choose us</span>
              <ul className="mt-4 space-y-3">
                {whyChooseUs.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Credentials */}
            <Reveal className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Credentials</span>
              <ul className="mt-4 space-y-4">
                {company.certifications.map((cert) => (
                  <li key={cert.name}>
                    <p className="font-semibold text-ink">{cert.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">{cert.fullName}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-ink/10 pt-4 text-xs text-ink/65">
                RC {company.rcNumber} · {company.legalName}
              </p>
              <p className="mt-3 text-xs text-ink/65">
                Certification details available upon request.
              </p>
            </Reveal>

            {/* Service Coverage */}
            <Reveal delay={0.08} className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Service coverage</span>
              <p className="mt-3 text-sm text-ink/70">
                We serve all of Abuja. Featured districts with a dedicated page:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                {areas.map((area) => (
                  <li key={area.slug}>
                    <Link href={`/electrician/${area.slug}`} className="link-underline">
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-ink/10 pt-4 text-xs text-ink/65">
                Plus project work in {company.serviceRegion}.
              </p>
            </Reveal>
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  )
}
