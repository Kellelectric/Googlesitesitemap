import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { faqCategories } from '@/content/faqs'
import { industries } from '@/content/industries'
import { serviceSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { process } from '@/content/process'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Home Automation & Smart Building Systems',
  description:
    'Smart lighting, climate, and access control integrated at the electrical layer, not bolted on — for homes, offices, and new builds across ' +
    company.serviceRegion +
    '.',
  path: '/home-automation',
})

const servicesIncluded = [
  'Smart lighting and switch circuit design',
  'Smart switches and smart sockets',
  'Voice control integration',
  'Scenes and schedules',
  'Smart curtains and blinds',
  'Smart AC / HVAC control',
  'Smart fans',
  'Home theatre and multi-room audio wiring',
  'Smart TV integration',
  'Smart locks and smart doorbells',
  'Intercom systems',
  'Gate automation',
  'Security system integration',
  'Energy monitoring',
  'Centralized control panel and app setup',
  'Solar/battery system integration',
]

const problemsWeSolve = [
  'Switches and controls scattered with no central system',
  'Lights, AC, or appliances left running because there’s no schedule or remote control',
  'No way to monitor or control the property while away',
  'Automation devices bought piecemeal that don’t talk to each other',
  'Smart devices retrofitted onto wiring that wasn’t designed for them',
  'No integration between lighting, security, and access control',
]

const technicalConsiderations = [
  {
    title: 'Automation is only as good as the wiring behind it',
    description:
      'A smart switch on a poorly designed circuit is still a poorly designed circuit. We integrate automation into the electrical design itself — circuit layout, load calculations, and control wiring — rather than treating it as an add-on to existing switches.',
  },
  {
    title: 'Plan for the platform you actually want to use',
    description:
      "Voice control, app control, and scene scheduling all depend on the control panel and hub you choose. We scope the electrical and control-panel infrastructure around your platform, so it's compatible from day one rather than requiring rework later.",
  },
  {
    title: 'New build vs. retrofit changes the approach',
    description:
      'A new build lets us design wiring and control layout together. A retrofit works around your existing circuits, which usually means a site assessment first to confirm what can be automated without a full rewire.',
  },
]

export default function HomeAutomationPage() {
  const homeAutomation = getServiceBySlug('home-automation')
  const cctv = getServiceBySlug('cctv-surveillance')
  const gates = getServiceBySlug('automated-gates-access-control')
  const faqs = faqCategories.find((c) => c.category === 'Home Automation')?.items ?? []

  return (
    <>
      {homeAutomation && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              serviceSchema({
                name: 'Home Automation & Smart Building Systems',
                description: homeAutomation.description,
                slug: homeAutomation.slug,
              }),
            ),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Home Automation', url: `${company.domain}/home-automation` },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/home-automation-hero-smart-panel.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[60%_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-24 md:py-28">
          <span className="eyebrow text-yellow">Home Automation</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Smart building infrastructure, integrated at the electrical layer
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            {homeAutomation?.description ??
              'We integrate smart lighting, climate, and access control into the electrical design itself, so switches, circuits, and control systems work together rather than as a patchwork of retrofitted devices.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact?service=home-automation" variant="primary">
              Request a Quote
            </Button>
            <Button href="/contact" variant="secondary">
              Book a Site Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Overview</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              Automation designed with the wiring, not added after it
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">
              Automation systems installed after the fact tend to fight the
              existing wiring. We design smart lighting, climate, and access
              control into the electrical layout itself — for new builds and
              retrofits alike — so the system is reliable, not a patchwork of
              devices bolted onto circuits that weren&rsquo;t built for them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services included */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Services included</span>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              What&rsquo;s covered under home automation
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicesIncluded.map((item) => (
              <MotionDiv key={item} variants={staggerItem} className="flex gap-3 border border-paper/15 p-4 text-sm text-paper/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Problems we solve */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Problems we solve</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {problemsWeSolve.map((item) => (
              <MotionDiv key={item} variants={staggerItem} className="flex gap-3 border-b border-ink/10 pb-3 text-sm text-ink/75">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Who we serve</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((i) => (
              <MotionDiv key={i.slug} variants={staggerItem} className="border-t-2 border-yellow pt-4">
                <h3 className="text-sm font-semibold text-paper">{i.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-paper/65">{i.summary}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Our process */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Our process</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
              Assess, design, install, test &amp; handover
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <MotionDiv key={step.step} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <span className="font-display text-sm text-petrol/70">{step.step}</span>
                <h3 className="mt-2 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Why choose Kell Electricals</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              'COREN and NEMSA certified',
              `${company.teamExperienceYears}+ years of combined engineering experience`,
              'Automation designed into the electrical layout, not bolted onto existing wiring',
              `${company.trust.googleRating}★ Google rating from ${company.trust.googleReviewCount}+ reviews`,
            ].map((item) => (
              <MotionDiv key={item} variants={staggerItem} className="flex gap-3 border-b border-paper/15 pb-3 text-sm text-paper/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Technical considerations */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Technical considerations</span>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {technicalConsiderations.map((item) => (
              <MotionDiv key={item.title} variants={staggerItem} className="border-t-2 border-petrol pt-5">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={faqs} viewAllHref="/faq" />

      {/* Related services */}
      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Related services</span>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-4">
            {[homeAutomation, cctv, gates]
              .filter((s): s is NonNullable<typeof s> => Boolean(s))
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="link-underline border border-ink/15 px-5 py-3 text-sm font-medium text-ink hover:border-petrol"
                >
                  {s.name}
                </Link>
              ))}
            <Link
              href="/cctv-security-systems"
              className="link-underline border border-ink/15 px-5 py-3 text-sm font-medium text-ink hover:border-petrol"
            >
              CCTV &amp; Security Systems
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        heading="Ready to design your smart building system?"
        body="Tell us what you want to control and we'll scope the electrical infrastructure to support it."
        serviceSlug="home-automation"
      />
    </>
  )
}
