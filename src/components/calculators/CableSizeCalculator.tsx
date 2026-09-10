'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { calculateMinimumCableSize, type ConductorMaterial, type CablePhase } from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

export function CableSizeCalculator() {
  const [currentAmps, setCurrentAmps] = useState(20)
  const [lengthMeters, setLengthMeters] = useState(30)
  const [material, setMaterial] = useState<ConductorMaterial>('copper')
  const [phase, setPhase] = useState<CablePhase>('single')
  const [systemVoltage, setSystemVoltage] = useState(230)
  const [maxDropPercent, setMaxDropPercent] = useState(3)

  const result = useMemo(
    () =>
      calculateMinimumCableSize({
        currentAmps,
        lengthMeters,
        material,
        phase,
        systemVoltage,
        maxDropPercent,
      }),
    [currentAmps, lengthMeters, material, phase, systemVoltage, maxDropPercent],
  )

  return (
    <div className="border border-ink/10 bg-paper p-6 md:p-8">
      <span className="eyebrow text-petrol/70">Cable size calculator</span>
      <h2 className="mt-2 text-xl font-semibold text-ink">
        Find the minimum cable size for a given run
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        Works out the smallest standard cable cross-section that keeps
        voltage drop within your chosen limit for this specific current
        and run length - not a generic size picked from habit.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="eyebrow text-ink/60">Load current (A)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={currentAmps}
            onChange={(e) => setCurrentAmps(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">One-way cable length (m)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={lengthMeters}
            onChange={(e) => setLengthMeters(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Max acceptable drop (%)</span>
          <input
            type="number"
            min={0.5}
            step={0.5}
            value={maxDropPercent}
            onChange={(e) => setMaxDropPercent(Math.max(0.5, Number(e.target.value) || 0.5))}
            className={`${inputClass} mt-2`}
          />
          <span className="mt-1 block text-xs text-ink/60">3% and 5% are both common planning thresholds.</span>
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Conductor material</span>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as ConductorMaterial)}
            className={`${inputClass} mt-2`}
          >
            <option value="copper">Copper</option>
            <option value="aluminium">Aluminium</option>
          </select>
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Circuit type</span>
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value as CablePhase)}
            className={`${inputClass} mt-2`}
          >
            <option value="single">Single-phase</option>
            <option value="three">Three-phase</option>
          </select>
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">System voltage (V)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={systemVoltage}
            onChange={(e) => setSystemVoltage(Math.max(1, Number(e.target.value) || 1))}
            className={`${inputClass} mt-2`}
          />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t-2 border-petrol pt-6 sm:grid-cols-3">
        <div>
          <span className="eyebrow text-petrol/70">Minimum required</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.minimumCsaMm2} mm²</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Recommended standard size</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.recommendedStandardSizeMm2} mm²</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Actual drop at that size</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.voltageDropAtRecommendedPercent}%</p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/60">
        Sized on current-carrying and voltage-drop math only - the real
        cable schedule also accounts for installation method (conduit,
        bundling, buried) and ambient temperature, which can call for a
        larger size than this alone suggests.{' '}
        <Link href="/contact" className="link-underline font-semibold text-petrol">
          Request a real cable schedule
        </Link>
        .
      </p>
    </div>
  )
}
