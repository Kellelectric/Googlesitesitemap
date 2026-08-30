import { Button } from '@/components/ui/Button'
import { ReviewSummary } from '@/components/ui/ReviewSummary'
import { TestimonialCard } from '@/components/sections/TestimonialCard'
import { testimonials } from '@/content/testimonials'
import { company } from '@/content/company'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function TestimonialsPreview() {
  const featured = testimonials.filter((t) => t.featured).slice(0, 3)

  return (
    <section className="bg-paper py-24">
      <div className="container-content">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-petrol/70">Trusted by our customers</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
              Real experiences, not marketing copy
            </h2>
            <ReviewSummary
              rating={company.trust.googleRating}
              reviewCount={company.trust.googleReviewCount}
              className="mt-6"
            />
          </div>
          <Button href="/testimonials" variant="secondary" data-on-light="true">
            Read all reviews
          </Button>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((testimonial) => (
            <MotionDiv key={testimonial.id} variants={staggerItem}>
              <TestimonialCard testimonial={testimonial} />
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
