import { Button } from '@/components/ui/Button'
import { company } from '@/content/company'
import { Reveal } from '@/components/ui/Reveal'

type CTASectionProps = {
  heading?: string
  body?: string
  serviceSlug?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function CTASection({
  heading = 'Scope a job with our team',
  body = 'Tell us what you need engineered, repaired, or installed. We respond with a scoped assessment, not a guess.',
  serviceSlug,
  primaryLabel = 'Request a Quote',
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps = {}) {
  const resolvedPrimaryHref =
    primaryHref ?? (serviceSlug ? `/contact?service=${serviceSlug}` : '/contact')
  const resolvedSecondaryLabel = secondaryLabel ?? `Call ${company.phone}`
  const resolvedSecondaryHref = secondaryHref ?? company.phoneHref

  return (
    <section className="bg-petrol-700 text-paper">
      <Reveal className="container-content flex flex-col items-start gap-8 py-20 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="max-w-lg text-3xl font-semibold md:text-4xl">{heading}</h2>
          <p className="mt-4 max-w-md text-paper/65">{body}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button href={resolvedPrimaryHref} variant="primary">
            {primaryLabel}
          </Button>
          <Button href={resolvedSecondaryHref} variant="secondary">
            {resolvedSecondaryLabel}
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
