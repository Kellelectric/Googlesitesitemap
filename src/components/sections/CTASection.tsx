import { Button } from '@/components/ui/Button'
import { company } from '@/content/company'

export function CTASection() {
  return (
    <section className="bg-petrol-700 text-paper">
      <div className="container-content flex flex-col items-start gap-8 py-20 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="max-w-lg text-3xl font-semibold md:text-4xl">
            Scope a job with our team
          </h2>
          <p className="mt-4 max-w-md text-paper/65">
            Tell us what you need engineered, repaired, or installed. We
            respond with a scoped assessment, not a guess.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button href="/assessment" variant="primary">
            Start Assessment
          </Button>
          <Button href="/contact" variant="secondary">
            Request a Quote
          </Button>
          <Button href={company.phoneHref} variant="secondary">
            Call {company.phone}
          </Button>
        </div>
      </div>
    </section>
  )
}
