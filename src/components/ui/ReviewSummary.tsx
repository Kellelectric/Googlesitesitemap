import { StarRating } from '@/components/ui/StarRating'
import { GoogleReviewBadge } from '@/components/ui/GoogleReviewBadge'

export function ReviewSummary({
  rating,
  reviewCount,
  className = '',
  dark = false,
}: {
  rating: number
  reviewCount: number
  className?: string
  dark?: boolean
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}>
      <div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-semibold ${dark ? 'text-paper' : 'text-ink'}`}>
            {rating.toFixed(1)}
          </span>
          <span className={dark ? 'text-paper/60' : 'text-ink/60'}>/ 5</span>
        </div>
        <StarRating rating={rating} className="mt-2" />
        <p className={`mt-1 text-xs ${dark ? 'text-paper/60' : 'text-ink/60'}`}>Google Rating</p>
      </div>

      <div className={`h-10 w-px ${dark ? 'bg-paper/20' : 'bg-ink/15'}`} />

      <div>
        <span className={`text-4xl font-semibold ${dark ? 'text-paper' : 'text-ink'}`}>
          {reviewCount}+
        </span>
        <p className={`mt-1 text-xs ${dark ? 'text-paper/60' : 'text-ink/60'}`}>Google Reviews</p>
      </div>

      <GoogleReviewBadge className={dark ? '!text-paper/70' : ''} />
    </div>
  )
}
