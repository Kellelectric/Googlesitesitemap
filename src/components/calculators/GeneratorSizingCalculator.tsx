'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  calculateGeneratorSizing,
  motorSurgeProfiles,
  DEFAULT_POWER_FACTOR,
} from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

export function GeneratorSizingCalculator() {
  const [totalRunningKw, setTotalRunningKw] = useState(5)
  const [largestMotorKw, setLargestMotorKw] = useState(1.1)
  const [surgeKey, setSurgeKey] = useState(motorSurgeProfiles[2].key) // AC unit default
  const surgeProfile = motorSurgeProfiles.find((p) => p.key === surgeKey) ?? motorSurgeProfiles[0]

  const result = useMemo(
    () =>
      calculateGeneratorSizing({
        totalRunningKw,
        largestMotorKw,
        surgeMultiplier: surgeProfile.multiplier,
      }),
    [totalRunningKw, largestMotorKw, surgeProfile],
  )

  return (
    <div className="border border-ink/10 bg-paper p-6 md:p-8">
      <span className="eyebrow text-petrol/70">Generator sizing calculator</span>
      <h2 className="mt-2 text-xl font-semibold text-ink">
        Estimate the generator size you need
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        Enter your total running load and the single largest motor load on
        the property (a borehole pump or AC compressor, for example) - this
        checks both the steady running load and the starting surge that
        load draws, and sizes to whichever needs more. See{' '}
        <Link href="/resources/how-to-size-a-backup-generator" className="link-underline font-semibold">
          how generator sizing actually works
        </Link>{' '}
        for the reasoning behind this.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-ink/60">Total running load (kW)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={totalRunningKw}
            onChange={(e) => setTotalRunningKw(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
          <span className="mt-1 block text-xs text-ink/60">
            Sum of everything running at once - use the load calculator above if you need this.
          </span>
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Largest motor load (kW)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={largestMotorKw}
            onChange={(e) => setLargestMotorKw(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
          <span className="mt-1 block text-xs text-ink/60">
            Included within the total above, not added on top of it.
          </span>
        </label>
      </div>

      <div className="mt-6 max-w-sm">
        <label className="block">
          <span className="eyebrow text-ink/60">Type of largest motor load</span>
          <select
            value={surgeKey}
            onChange={(e) => setSurgeKey(e.target.value)}
            className={`${inputClass} mt-2`}
          >
            {motorSurgeProfiles.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t-2 border-petrol pt-6 sm:grid-cols-3">
        <div>
          <span className="eyebrow text-petrol/70">Running load</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.runningKva} kVA</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Starting surge</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.surgeKva} kVA</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Recommended minimum</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.recommendedKva} kVA</p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/60">
        Assumes a {Math.round(DEFAULT_POWER_FACTOR * 100)}% power factor, a typical planning figure
        for a mixed load - a real load assessment measures your actual
        power factor and running load before we size anything.{' '}
        <Link href="/contact" className="link-underline font-semibold text-petrol">
          Request a real load assessment
        </Link>
        .
      </p>
    </div>
  )
}
