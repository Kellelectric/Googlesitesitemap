import { company } from '@/content/company'
import { Reveal } from '@/components/ui/Reveal'

export function TrustSection() {
  return (
    <section className="bg-paper py-24">
      <div className="container-content grid grid-cols-1 gap-12 md:grid-cols-2">
        <Reveal className="border border-ink/10 p-8">
          <span className="eyebrow text-petrol/70">Verified track record</span>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-5xl font-semibold text-petrol">
              {company.trust.googleRating}★
            </span>
            <span className="text-sm text-ink/60">
              across {company.trust.googleReviewCount} Google reviews
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink/70">
            Our rating reflects work carried out across {company.serviceAreas.join(', ')}, and wider {company.serviceRegion.replace('Abuja and ', '')}, verifiable on our Google Business Profile.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="border border-ink/10 bg-petrol p-8 text-paper">
          <span className="eyebrow text-yellow">Certified & compliant</span>
          <h3 className="mt-4 text-xl font-semibold">
            {company.certifications.map((c) => c.name).join(' & ')} certified engineering
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-paper/70">
            Every installation runs through the same documented process
            (assess, design, install, test and hand over) to{' '}
            {company.certifications.map((c) => c.fullName).join(' and ')}{' '}
            standards.
          </p>
          <div className="mt-6 border-t border-paper/15 pt-5">
            <span className="eyebrow text-paper/60">Registered company</span>
            <p className="mt-1 font-display text-2xl font-semibold text-yellow">
              RC {company.rcNumber}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
