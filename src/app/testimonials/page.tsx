import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { ReviewSummary } from '@/components/ui/ReviewSummary'
import { TestimonialCard } from '@/components/sections/TestimonialCard'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { TestimonialGrid } from '@/components/sections/TestimonialGrid'
import { GoogleReviewCTA } from '@/components/sections/GoogleReviewCTA'
import { testimonials, featuredTestimonials, getReviewUrl } from '@/content/testimonials'
import { company } from '@/content/company'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Google Reviews & Testimonials',
    description:
      'Read real customer reviews and testimonials for Kell Electricals Ltd, a professional electrical, solar, inverter, CCTV and power solutions company in Abuja, Nigeria.',
    path: '/testimonials',
  }),
  title: { absolute: 'Google Reviews & Testimonials | Kell Electricals Ltd Abuja' },
}

// The one review used for the large featured quote — kept out of the
// carousel/grid below so it isn't shown twice back to back.
const featuredId = 11 // Amara
const featuredReview = testimonials.find((t) => t.id === featuredId)!
const carouselItems = featuredTestimonials.filter((t) => t.id !== featuredId)
const gridItems = testimonials.filter((t) => t.id !== featuredId)

const trustSignals = [
  `${company.teamExperienceYears}+ Years Combined Experience`,
  `${company.trust.googleRating}★ Google Rating`,
  `${company.trust.googleReviewCount}+ Google Reviews`,
  'Licensed & Insured',
  'Residential • Commercial • Industrial',
]

export default function TestimonialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Testimonials', url: `${company.domain}/testimonials` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Testimonials</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Trusted by Our Customers
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Real experiences from customers who have trusted Kell Electricals
            with their electrical, power and technical needs.
          </p>

          <ReviewSummary
            rating={company.trust.googleRating}
            reviewCount={company.trust.googleReviewCount}
            dark
            className="mt-10"
          />

          <div className="mt-10">
            <Button href={getReviewUrl()} variant="secondary" target="_blank" rel="noopener noreferrer">
              View all reviews on Google
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">What customers are saying</span>
          </Reveal>
          <div className="mt-8">
            <TestimonialCarousel items={carouselItems} />
          </div>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content flex justify-center">
          <Reveal className="max-w-3xl">
            <TestimonialCard testimonial={featuredReview} size="large" className="bg-paper" />
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-petrol/70">More Customer Experiences</span>
            <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
              More reviews from Google
            </h2>
          </Reveal>
          <div className="mt-10">
            <TestimonialGrid items={gridItems} />
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper py-10">
        <div className="container-content flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-sm font-medium text-ink/70">
          {trustSignals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </section>

      <GoogleReviewCTA />
    </>
  )
}
