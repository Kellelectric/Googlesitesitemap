import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { PartnerLogos } from '@/components/sections/PartnerLogos'
import { CompanyTimeline } from '@/components/sections/CompanyTimeline'
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
  {
    year: '2010',
    title: 'Company founded',
    description: 'Company founded to provide reliable electrical services in Abuja.',
  },
  {
    year: '2012',
    title: 'First major residential project',
    description: 'Electrical installations for a 50-unit housing estate.',
  },
  {
    year: '2015',
    title: 'Commercial expansion',
    description: 'Expansion into commercial services, with contracts for office and retail projects.',
  },
  {
    year: '2018',
    title: 'Industry recognition',
    description: 'Recognition and certification for quality and safety standards.',
  },
  {
    year: '2020',
    title: 'Solar & smart home launch',
    description: 'Solar and smart home solutions launched.',
  },
  {
    year: '2023',
    title: 'Beyond Abuja',
    description: 'Expansion of project work beyond Abuja.',
  },
  {
    year: '2024',
    title: 'Largest project to date',
    description: 'Electrical work completed for a 200-home estate.',
  },
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

// Real copy, supplied directly by the client, replacing the earlier
// generic descriptions - names CBN Headquarters, Kaduna State Government
// House, Manreng Estate, and Navy Holdings as past clients (see the
// header note on ceoMessage.ts for the same naming pattern there).
const whatWeStandFor = [
  {
    title: "Safety isn't negotiable.",
    description: 'Earthing, protection, load sizing, done correctly every time, not when it’s convenient.',
  },
  {
    title: 'We work from calculations, not guesses.',
    description: 'If a job needs a load audit or a proper design before we touch anything, that happens first.',
  },
  {
    title: 'We own what we install.',
    description: 'If something needs revisiting, we revisit it. No disappearing act.',
  },
  {
    title: "We tell you what's actually going on.",
    description: 'Real costs, real timelines, no inflated promises to close the job.',
  },
]

const whatMakesUsDifferent = [
  "We've kept the team small on purpose. No large subcontractor network diluting who actually shows up to your site. The people who plan the job are often the people executing it.",
  'Certification isn’t something we say about ourselves, COREN and NEMSA hold us to it.',
  'We do the technical groundwork others skip past, load audits before a solar install, proper sizing before a panel upgrade, not just fitting equipment and hoping.',
  'Our work speaks for itself: CBN Headquarters, Kaduna State Government House, Manreng Estate, Navy Holdings, plus residential and commercial clients across Wuse 2, Gwarinpa, Maitama, Asokoro, Guzape, and Katampe.',
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
          <span className="eyebrow text-yellow">About Us</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Engineering Power. Building Trust.
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">{company.positioning}</p>
          <a
            href="/downloads/kell-electricals-company-profile.pdf"
            download
            className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow"
          >
            Download Company Profile (PDF)
          </a>
        </div>
      </section>

      {/* Leadership - full-width, own section, not squeezed into the
          narrow main column alongside the sidebar. team.length currently
          gives an even 3-column grid (2 full rows of 6); the responsive
          steps below (1 / 2 / 3-4 columns) keep it balanced whether the
          roster is trimmed or grown later. */}
      <section id="team" className="scroll-mt-24 bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Leadership</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              Who you&rsquo;ll be working with
            </h2>
          </Reveal>
          <StaggerGroup
            className={`mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${
              team.length === 3 ? 'lg:mx-auto lg:max-w-3xl' : ''
            }`}
          >
            {team.map((member) => (
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
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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

      <CompanyTimeline milestones={milestones} />

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-[1fr,380px]">
          <div className="min-w-0">
            {/* Who We Are */}
            <Reveal>
              <span className="eyebrow text-petrol/70">Who we are</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                A professional electrical engineering and technical services
                company, based in Abuja
              </h2>
              <p className="mt-5 leading-relaxed text-ink/75">
                {company.name} is a COREN and NEMSA certified electrical
                company based in {company.address.district}, Abuja. For over{' '}
                {company.teamExperienceYears} years, we&rsquo;ve handled
                installations, repairs, solar systems, and technical
                consulting for homes and businesses across Abuja and beyond.
              </p>
              <p className="mt-4 leading-relaxed text-ink/75">
                We&rsquo;re registered under RC {company.rcNumber}. That&rsquo;s
                not decoration, it means we&rsquo;re accountable to a body
                that can actually check our work.
              </p>
            </Reveal>

            {/* The Problem We Solve */}
            <Reveal delay={0.08} className="mt-14">
              <span className="eyebrow text-petrol/70">The problem we solve</span>
              <p className="mt-4 leading-relaxed text-ink/75">
                Anyone can call themselves an electrician. Fewer people can
                size a cable correctly, earth a panel the way it&rsquo;s
                supposed to be earthed, or finish a job without leaving
                something behind that turns into a fire risk a year later.
              </p>
              <p className="mt-4 leading-relaxed text-ink/75">
                That&rsquo;s the gap we work in. Between &ldquo;can wire a
                socket&rdquo; and &ldquo;you&rsquo;d trust this person with
                your building.&rdquo; We do the parts most electricians skip:
                load calculations, voltage drop checks, proper protection,
                work you can still explain to the next person who touches it.
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

            {/* Mission / Vision - a tinted callout instead of another pair of
                top-bordered cards, so it reads as a distinct pull-out moment
                rather than the seventh identical block in the column. */}
            <Reveal delay={0.1} className="mt-14 border border-ink/10 bg-petrol/[0.04] p-6 md:p-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <span className="eyebrow text-petrol/70">Our mission</span>
                  <p className="mt-3 leading-relaxed text-ink/75">
                    Do the job once, do it right, and don&rsquo;t make you
                    think about it again.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-8 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                  <span className="eyebrow text-petrol/70">Our vision</span>
                  <p className="mt-3 leading-relaxed text-ink/75">
                    To be the electrical engineering partner Nigerian homes,
                    businesses, and industrial sites trust by default - known
                    for work that is engineered, documented, and built to
                    last.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* What We Stand For */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">What we stand for</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                What every job is held to
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {whatWeStandFor.map((value) => (
                <MotionDiv key={value.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                  <h3 className="text-lg font-semibold text-ink">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{value.description}</p>
                </MotionDiv>
              ))}
            </StaggerGroup>

            {/* What Makes Us Different - narrative paragraphs rather than
                title/description cards, since the client's real copy here
                is continuous prose (small team, certification, technical
                rigor, named clients) rather than four discrete points. */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">What makes us different</span>
            </Reveal>
            <StaggerGroup className="mt-6 space-y-4">
              {whatMakesUsDifferent.map((paragraph, i) => (
                <MotionDiv key={i} variants={staggerItem}>
                  <p className="leading-relaxed text-ink/75">{paragraph}</p>
                </MotionDiv>
              ))}
            </StaggerGroup>

            {/* Why Clients Trust Us */}
            <Reveal delay={0.1} className="mt-14 border border-ink/10 bg-petrol/[0.04] p-6 md:p-8">
              <span className="eyebrow text-petrol/70">Why clients trust us</span>
              <p className="mt-4 leading-relaxed text-ink/75">
                If you&rsquo;re wondering whether to hand us your project,
                here&rsquo;s the honest answer: fifteen years of clients
                calling us back is the proof. Someone who books a small
                repair today is often the same person calling two years
                later for a solar installation or a full commercial build.
                That doesn&rsquo;t happen by accident. It happens because
                the first job held up.
              </p>
              <p className="mt-4 leading-relaxed text-ink/75">
                Whether it&rsquo;s one outlet or a full commercial design and
                build, we treat your electrical system the way we&rsquo;d
                treat our own.
              </p>
            </Reveal>

            {/* Our Expertise - the FAQSection-style numeral + split layout,
                reinforcing the numbering device used sitewide instead of
                another top-bordered card grid. */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">Our expertise</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                Four functions, one process
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
              {teamRoles.map((role, i) => (
                <MotionDiv
                  key={role.title}
                  variants={staggerItem}
                  className="grid grid-cols-1 gap-x-8 gap-y-3 py-6 md:grid-cols-[minmax(0,260px)_1fr]"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl font-semibold leading-none text-petrol/15">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-semibold text-ink">{role.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/65">{role.description}</p>
                </MotionDiv>
              ))}
            </StaggerGroup>

            {/* Partners & Suppliers */}
            {partners.length > 0 && (
              <div className="mt-14">
                <PartnerLogos partners={partners} />
              </div>
            )}

            {/* Our Process - the same large ghost-numeral device
                ProcessSection uses on the homepage, instead of a small
                caption-line step number. */}
            <Reveal delay={0.1} className="mt-14">
              <span className="eyebrow text-petrol/70">Our process</span>
              <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                Assess, design, install, test &amp; handover
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {process.map((step) => (
                <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                  <span className="font-display block text-6xl font-semibold leading-none text-petrol/10">
                    {step.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.description}</p>
                </MotionDiv>
              ))}
            </StaggerGroup>
          </div>

          <aside className="space-y-8">
            {/* Why Choose Us */}
            <Reveal delay={0.16} className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Why choose us</span>
              <ul className="mt-4 space-y-3">
                {whyChooseUs.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
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
