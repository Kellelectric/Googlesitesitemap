import { Button } from '@/components/ui/Button'
import { company } from '@/content/company'
import { Reveal } from '@/components/ui/Reveal'

export function CTASection() {
  return (
    <section className="bg-petrol-700 text-paper">
      <Reveal className="container-content flex flex-col items-start gap-8 py-20 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="max-w-lg text-3xl font-semibold md:text-4xl">
            Scope a job with our team
          </h2>
          <p className="mt-4 max-w-md text-paper/65">
            Tell us what you need engineered, repaired, or installed. We
            respond with a scoped assessment, not a guess.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/contact" variant="primary">
            Request a Quote
          </Button>
          <Button href="/book" variant="secondary">
            Book a Site Assessment
          </Button>
          <a href={company.phoneHref} className="link-underline text-sm text-paper/70">
            or call {company.phone}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
