import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { getServiceBySlug } from '@/content/services'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Certifications & Compliance',
  description: `${company.legalName} (RC ${company.rcNumber}) is COREN and NEMSA certified. What that means in practice, and the documentation every job hands over.`,
  path: '/certifications-compliance',
  image: '/images/photos/compliance-hero-inspection.jpg',
})

const documentation = [
  'As-built drawings reflecting what was actually installed, not just the original design',
  'Circuit schedules identifying every circuit, its protective device rating, and what it feeds',
  'Earth loop impedance and insulation resistance test results',
  'Commissioning and performance test records for solar, generator, and inverter systems',
  'A written inspection report with findings and recommended actions, not a verbal sign-off',
]

const whyItMatters = [
  {
    title: 'A certificate is a starting point, not the whole standard',
    description:
      'COREN and NEMSA certification means the company and its practice meet the regulatory bar for electrical engineering work in Nigeria. It does not, on its own, guarantee any individual job was done correctly - that comes from the documented process behind the certification, applied consistently on every job.',
  },
  {
    title: 'Documentation protects you, not just us',
    description:
      "A property with no circuit schedule or as-built record is harder to maintain, harder to sell or insure with confidence, and harder to safely modify later, since the next electrician has to work partly from guesswork. Documentation handed over at the end of a job is what makes future work on that property safer and faster.",
  },
  {
    title: 'Compliance work needs testing, not just installation',
    description:
      'Earthing, bonding, and protective device function are things that have to be measured and recorded, not assumed from correct-looking wiring. A job that skips testing can look complete and still fail on the specific safety checks that matter.',
  },
]

export default function CertificationsCompliancePage() {
  const earthing = getServiceBySlug('earthing-lightning-protection')
  const maintenance = getServiceBySlug('preventive-maintenance-contracts')
  const faultFinding = getServiceBySlug('fault-finding-diagnostics')
  const relatedServices = [earthing, maintenance, faultFinding].filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Certifications & Compliance', url: `${company.domain}/certifications-compliance` },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/compliance-hero-inspection.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[60%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Certifications &amp; Compliance</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            COREN and NEMSA certified, with the documentation to prove every job
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Certification is the regulatory bar. What makes it mean something
            on your property is the documented process behind it - which is
            what you actually receive at handover.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Request a Compliance Assessment
            </Button>
            <Button href={company.whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
              WHATSAPP
            </Button>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Our certifications</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
              {company.legalName} (RC {company.rcNumber})
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {company.certifications.map((cert) => (
              <MotionDiv key={cert.name} variants={staggerItem} className="border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">{cert.name}</span>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{cert.fullName}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>

          <Reveal delay={0.08} className="mt-14">
            <span className="eyebrow text-petrol/70">Corporate registration</span>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
              Legal standing as a registered Nigerian business, separate from
              the engineering-competence certifications above.
            </p>
          </Reveal>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {company.registrations.map((reg) => (
              <MotionDiv key={reg.name} variants={staggerItem} className="border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">{reg.name}</span>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{reg.fullName}</p>
                <p className="mt-3 text-xs font-semibold text-ink/60">{reg.number}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
          <p className="mt-6 text-xs text-ink/50">
            TIN {company.tinNumber}
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">Why it matters</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
              What certification actually means for your job
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {whyItMatters.map((item) => (
              <MotionDiv key={item.title} variants={staggerItem} className="border-t-2 border-yellow pt-5">
                <h3 className="text-base font-semibold text-paper">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{item.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Documentation on handover */}
      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">What you receive</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              Documentation handed over on every job
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {documentation.map((item) => (
              <MotionDiv
                key={item}
                variants={staggerItem}
                className="flex gap-3 border border-ink/10 p-4 text-sm text-ink/75"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-petrol" />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Related services */}
      <section className="bg-paper pb-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">Related services</span>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-4">
            {relatedServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="link-underline border border-ink/15 px-5 py-3 text-sm font-medium text-ink hover:border-petrol"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Need documentation for an existing property?"
        body="Whether it's a pre-purchase check, an insurance requirement, or you simply don't have a circuit schedule on file, we can assess and document what's there."
        primaryLabel="Request an Assessment"
        primaryHref="/contact"
        secondaryLabel="WHATSAPP"
        secondaryHref={company.whatsappHref}
      />
    </>
  )
}
