import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-petrol text-paper">
      <div className="absolute inset-0 bg-circuit-grid bg-grid opacity-40" />
      <CircuitLines className="pointer-events-none absolute -right-24 top-0 h-full w-[60%] text-paper/10" />

      <div className="container-content relative py-24 md:py-32">
        <span className="eyebrow inline-block border border-paper/20 px-3 py-1.5 text-yellow">
          RC {company.rcNumber} · {company.certifications.map((c) => c.name).join(' & ')} Certified
        </span>

        <h1 className="mt-8 max-w-3xl font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] text-paper">
          {company.tagline}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
          {company.positioning}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">
            Request a Quote
          </Button>
          <Button href="/services" variant="secondary">
            View Services
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/10 pt-8 text-sm text-paper/60">
          <span>{company.yearsExperience}+ years in the field</span>
          <span>
            {company.trust.googleRating}★ rating · {company.trust.googleReviewCount} Google reviews
          </span>
          <span>{company.serviceAreas.length} service zones across Abuja</span>
          <span>24/7 emergency response</span>
        </div>
      </div>
    </section>
  )
}
