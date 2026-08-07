// Decorative circuit-trace linework used in place of stock photography /
// clip-art bolts. Pure SVG, no external assets.
export function CircuitLines({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.5">
        <path d="M0 120 H240 L280 160 H520" />
        <path d="M0 320 H140 L180 280 H420 L460 320 H800" />
        <path d="M60 0 V80 L100 120" />
        <path d="M600 0 V140 L560 180 V360" />
        <path d="M800 460 H620 L580 500 H340 L300 460 H120" />
        <path d="M240 600 V500 L280 460" />
        <path d="M720 600 V480" />
      </g>
      <g fill="currentColor">
        <circle cx="240" cy="120" r="5" />
        <circle cx="520" cy="160" r="5" />
        <circle cx="60" cy="80" r="4" />
        <circle cx="600" cy="140" r="4" />
        <circle cx="560" cy="360" r="4" />
        <circle cx="140" cy="320" r="5" />
        <circle cx="460" cy="320" r="5" />
        <circle cx="580" cy="500" r="4" />
        <circle cx="120" cy="460" r="4" />
        <circle cx="720" cy="480" r="4" />
      </g>
    </svg>
  )
}
