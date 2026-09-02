'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { calculateVoltageDrop, type ConductorMaterial, type CablePhase } from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

export function VoltageDropCalculator() {
  const [currentAmps, setCurrentAmps] = useState(20)
  const [lengthMeters, setLengthMeters] = useState(30)
  const [csaMm2, setCsaMm2] = useState(4)
  const [material, setMaterial] = useState<ConductorMaterial>('copper')
  const [phase, setPhase] = useState<CablePhase>('single')
  const [systemVoltage, setSystemVoltage] = useState(230)

  const result = useMemo(
    () => calculateVoltageDrop({ currentAmps, lengthMeters, csaMm2, material, phase, systemVoltage }),
    [currentAmps, lengthMeters, csaMm2, material, phase, systemVoltage],
  )

  const isHigh = result.voltageDropPercent > 5
  const isBorderline = result.voltageDropPercent > 3 && result.voltageDropPercent <= 5

  return (
    <div className="border border-ink/10 bg-paper p-6 md:p-8">
      <span className="eyebrow text-petrol/70">Voltage drop calculator</span>
      <h2 className="mt-2 text-xl font-semibold text-ink">
        Check whether a cable run is too long for the load
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        A cable that&rsquo;s correctly rated for current can still cause
        dimming, sluggish motor starting, or unreliable electronics if the
        run is too long for its cross-section. See{' '}
        <Link href="/resources/understanding-cable-sizes-for-residential-electrical" className="link-underline font-semibold">
          why cable size depends on run length
        </Link>{' '}
        for the reasoning behind this.
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
          <span className="eyebrow text-ink/60">Cable cross-section (mm²)</span>
          <input
            type="number"
            min={0.5}
            step={0.5}
            value={csaMm2}
            onChange={(e) => setCsaMm2(Math.max(0.5, Number(e.target.value) || 0.5))}
            className={`${inputClass} mt-2`}
          />
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

      <div className="mt-8 grid grid-cols-1 gap-4 border-t-2 border-petrol pt-6 sm:grid-cols-2">
        <div>
          <span className="eyebrow text-petrol/70">Voltage drop</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{result.voltageDropVolts} V</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">As a percentage of system voltage</span>
          <p className={`mt-1 text-2xl font-semibold ${isHigh ? 'text-red-600' : isBorderline ? 'text-orange' : 'text-ink'}`}>
            {result.voltageDropPercent}%
          </p>
          <p className="mt-1 text-xs text-ink/60">
            {isHigh
              ? 'Above the 5% figure widely used as an upper planning limit — a larger cable is worth checking.'
              : isBorderline
                ? 'Above the more conservative 3% planning threshold, though within the wider 5% figure some references allow.'
                : 'Within the 3% figure commonly used as a conservative planning threshold.'}
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/60">
        Planning estimate using standard resistivity figures, not a
        substitute for a real cable schedule that accounts for
        installation method and ambient temperature derating.{' '}
        <Link href="/contact" className="link-underline font-semibold text-petrol">
          Request a real assessment
        </Link>
        .
      </p>
    </div>
  )
}
