'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { calculateBreakerSize, BREAKER_SAFETY_MARGIN } from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

export function BreakerSizeCalculator() {
  const [loadCurrentAmps, setLoadCurrentAmps] = useState(18)

  const result = useMemo(() => calculateBreakerSize({ loadCurrentAmps }), [loadCurrentAmps])

  return (
    <div className="border border-ink/10 bg-paper p-6 md:p-8">
      <span className="eyebrow text-petrol/70">Breaker size calculator</span>
      <h2 className="mt-2 text-xl font-semibold text-ink">
        Find a standard MCB rating for a circuit&rsquo;s load current
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        Enter the circuit&rsquo;s running current and this rounds up to the
        nearest standard breaker size, with a margin so the breaker
        isn&rsquo;t sitting right at its trip threshold under normal load.
        Use the cable size calculator alongside this - the cable and
        breaker on a circuit need to be sized together.
      </p>

      <div className="mt-6 max-w-xs">
        <label className="block">
          <span className="eyebrow text-ink/60">Load current (A)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={loadCurrentAmps}
            onChange={(e) => setLoadCurrentAmps(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t-2 border-petrol pt-6 sm:grid-cols-2">
        <div>
          <span className="eyebrow text-petrol/70">Minimum rating needed</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.minimumRatingAmps} A</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Recommended standard breaker</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.recommendedBreakerAmps} A</p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/60">
        Assumes a {BREAKER_SAFETY_MARGIN}x continuous-load margin, a typical
        planning figure - not a substitute for a real circuit schedule,
        which also checks the breaker against the cable&rsquo;s actual
        current-carrying capacity for its installation method.{' '}
        <Link href="/contact" className="link-underline font-semibold text-petrol">
          Request a real circuit schedule
        </Link>
        .
      </p>
    </div>
  )
}
