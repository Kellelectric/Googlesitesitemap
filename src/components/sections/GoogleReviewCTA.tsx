import { Button } from '@/components/ui/Button'
import { getWriteReviewUrl } from '@/content/testimonials'
import { Reveal } from '@/components/ui/Reveal'

export function GoogleReviewCTA() {
  return (
    <section className="bg-petrol-700 text-paper">
      <Reveal className="container-content flex flex-col items-start gap-8 py-20 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="max-w-lg text-3xl font-semibold md:text-4xl">
            Had a great experience with Kell Electricals?
          </h2>
          <p className="mt-4 max-w-md text-paper/65">
            Share your experience with us on Google.
          </p>
        </div>
        <Button href={getWriteReviewUrl()} variant="primary" target="_blank" rel="noopener noreferrer">
          Write a Google Review
        </Button>
      </Reveal>
    </section>
  )
}
