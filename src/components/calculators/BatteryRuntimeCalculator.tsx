'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  calculateBatteryRuntimeHours,
  BATTERY_DEPTH_OF_DISCHARGE,
  BATTERY_ROUND_TRIP_EFFICIENCY,
} from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

export function BatteryRuntimeCalculator() {
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState(5)
  const [loadWatts, setLoadWatts] = useState(700)

  const runtimeHours = useMemo(
    () => calculateBatteryRuntimeHours({ batteryCapacityKwh, loadWatts }),
    [batteryCapacityKwh, loadWatts],
  )

  return (
    <div className="border border-ink/10 bg-paper p-6 md:p-8">
      <span className="eyebrow text-petrol/70">Battery runtime calculator</span>
      <h2 className="mt-2 text-xl font-semibold text-ink">
        Estimate how long a battery bank will carry a given load
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        Enter your battery bank&rsquo;s rated capacity and the load you want
        it to carry, and this applies a typical usable depth-of-discharge
        and round-trip efficiency to estimate real-world runtime.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-ink/60">Battery capacity (kWh)</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={batteryCapacityKwh}
            onChange={(e) => setBatteryCapacityKwh(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
          <span className="mt-1 block text-xs text-ink/60">Rated capacity, e.g. 5 kWh or 10 kWh.</span>
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Load to carry (watts)</span>
          <input
            type="number"
            min={0}
            step={50}
            value={loadWatts}
            onChange={(e) => setLoadWatts(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
      </div>

      <div className="mt-8 border-t-2 border-petrol pt-6">
        <span className="eyebrow text-petrol/70">Estimated runtime</span>
        <p className="mt-1 text-3xl font-semibold text-ink">
          {runtimeHours} <span className="text-lg font-normal text-ink/60">hours</span>
        </p>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/60">
        Assumes a {Math.round(BATTERY_DEPTH_OF_DISCHARGE * 100)}% usable depth-of-discharge (typical for a
        lithium battery bank — lead-acid systems are usually derated
        further) and {Math.round(BATTERY_ROUND_TRIP_EFFICIENCY * 100)}% round-trip efficiency — a planning
        estimate, not a measurement of your actual battery bank.{' '}
        <Link href="/contact" className="link-underline font-semibold text-petrol">
          Request a sizing consultation
        </Link>
        .
      </p>
    </div>
  )
}
