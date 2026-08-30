import { StarRating } from '@/components/ui/StarRating'
import { GoogleReviewBadge } from '@/components/ui/GoogleReviewBadge'
import { TrustpilotReviewBadge } from '@/components/ui/TrustpilotReviewBadge'
import { getReviewUrl, getTrustpilotUrl, type Testimonial } from '@/content/testimonials'

export function TestimonialCard({
  testimonial,
  size = 'default',
  className = '',
}: {
  testimonial: Testimonial
  size?: 'default' | 'large'
  className?: string
}) {
  const large = size === 'large'
  const isGoogle = testimonial.source === 'Google'
  const sourceUrl = isGoogle ? getReviewUrl() : getTrustpilotUrl()

  return (
    <figure
      className={`flex h-full flex-col justify-between border border-ink/10 bg-paper p-6 ${large ? 'p-10' : ''} ${className}`}
    >
      <div>
        <StarRating rating={testimonial.rating} />
        <blockquote
          className={`mt-4 leading-relaxed text-ink/80 ${large ? 'text-xl md:text-2xl' : 'text-sm'}`}
        >
          {testimonial.review.split(/\n+/).map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </blockquote>
        {testimonial.truncated && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-2 inline-block text-xs font-semibold text-petrol"
          >
            Read full review on {testimonial.source} &rarr;
          </a>
        )}
      </div>

      <figcaption className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
        <div>
          <p className="text-sm font-semibold text-ink">{testimonial.customerName}</p>
          <p className="text-xs text-ink/65">{testimonial.date}</p>
        </div>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline shrink-0"
          aria-label={`View this review on ${testimonial.source}`}
        >
          {isGoogle ? <GoogleReviewBadge /> : <TrustpilotReviewBadge />}
        </a>
      </figcaption>
    </figure>
  )
}
