// Communicates "this testimonial came from our Trustpilot profile" —
// nothing more. Never relabel this as "Trustpilot Verified" or imply
// Trustpilot has certified anything about the business through this site.
export function TrustpilotReviewBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60 ${className}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
        <rect width="24" height="24" fill="#00B67A" rx="2" />
        <path
          fill="#fff"
          d="M12 3.5l2.02 6.2h6.52l-5.28 3.84 2.02 6.2L12 15.9l-5.28 3.84 2.02-6.2L3.46 9.7h6.52z"
        />
      </svg>
      Trustpilot Review
    </span>
  )
}
