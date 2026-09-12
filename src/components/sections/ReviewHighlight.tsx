import Link from 'next/link'
import { ReviewSummary } from '@/components/ui/ReviewSummary'
import { TestimonialCard } from '@/components/sections/TestimonialCard'
import { testimonials } from '@/content/testimonials'
import { Reveal } from '@/components/ui/Reveal'
import { getTrustStats } from '@/lib/googleBusinessProfile'

// A compact trust band for pages that otherwise carry zero review content -
// /services/[slug], /projects/[slug], and /industries/[slug] (56 pages
// combined) previously only showed reviews on the homepage and
// /testimonials. Reuses the same real, already-vetted testimonials.ts data
// and TestimonialCard component - no new review content, no per-service
// linkage invented (testimonials aren't tagged to a specific service, so
// this deliberately doesn't claim a shown review is "about" the page it's
// on, unlike a genuine service-specific review would).
//
// `seedKey` (the page's own slug) picks a stable, varied pair of featured
// reviews per page via a simple string hash - not random (no hydration
// mismatch risk), just avoids every one of the 56 pages showing the exact
// same 2 reviews.
function stableIndex(seedKey: string, length: number): number {
  let hash = 0
  for (let i = 0; i < seedKey.length; i += 1) {
    hash = (hash * 31 + seedKey.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % length
}

export async function ReviewHighlight({ seedKey }: { seedKey: string }) {
  const featured = testimonials.filter((t) => t.featured)
  if (featured.length === 0) return null

  const start = stableIndex(seedKey, featured.length)
  const picked = [featured[start], featured[(start + 1) % featured.length]]
  const trust = await getTrustStats()

  return (
    <section className="border-t border-ink/10 bg-paper py-16">
      <div className="container-content">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:w-64 lg:shrink-0">
            <span className="eyebrow text-petrol/70">Trusted by our customers</span>
            <ReviewSummary
              rating={trust.googleRating}
              reviewCount={trust.googleReviewCount}
              className="mt-5 flex-col items-start gap-4"
            />
            <Link
              href="/testimonials"
              className="link-underline mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-petrol"
            >
              Read all reviews
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex-1">
            {picked.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
