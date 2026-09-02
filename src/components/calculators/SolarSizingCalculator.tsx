'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { calculateSolarSizing, ABUJA_AVERAGE_PEAK_SUN_HOURS } from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

export function SolarSizingCalculator({ dark = false }: { dark?: boolean }) {
  const [criticalLoadWatts, setCriticalLoadWatts] = useState(1500)
  const [backupHours, setBackupHours] = useState(8)

  const result = useMemo(
    () => calculateSolarSizing({ criticalLoadWatts, backupHours }),
    [criticalLoadWatts, backupHours],
  )

  const labelClass = dark ? 'text-paper/60' : 'text-ink/60'
  const textClass = dark ? 'text-paper/70' : 'text-ink/70'
  const headingClass = dark ? 'text-paper' : 'text-ink'
  const borderClass = dark ? 'border-paper/15' : 'border-ink/10'

  return (
    <div className={`border ${borderClass} p-6 md:p-8 ${dark ? 'text-paper' : 'bg-paper'}`}>
      <span className={`eyebrow ${dark ? 'text-yellow' : 'text-petrol/70'}`}>Solar sizing calculator</span>
      <h2 className={`mt-2 text-xl font-semibold ${headingClass}`}>
        Get a rough starting point for your system size
      </h2>
      <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${textClass}`}>
        Enter the load you want backed up and how many hours you need it to
        run, and this gives an indicative battery and panel size based on
        Abuja&rsquo;s average sun hours. Your actual system is sized from a
        real consumption audit, not this estimate - see our{' '}
        <Link href="/solar-energy-systems" className="link-underline font-semibold">
          sizing methodology
        </Link>
        .
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={`eyebrow ${labelClass}`}>Critical load to back up (watts)</span>
          <input
            type="number"
            min={0}
            step={50}
            value={criticalLoadWatts}
            onChange={(e) => setCriticalLoadWatts(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
          <span className={`mt-1 block text-xs ${labelClass}`}>
            e.g. lighting, fridge, networking, security - the circuits that must stay on
          </span>
        </label>
        <label className="block">
          <span className={`eyebrow ${labelClass}`}>Backup duration needed (hours)</span>
          <input
            type="number"
            min={1}
            max={48}
            value={backupHours}
            onChange={(e) => setBackupHours(Math.max(1, Number(e.target.value) || 1))}
            className={`${inputClass} mt-2`}
          />
        </label>
      </div>

      <div className={`mt-8 grid grid-cols-1 gap-4 border-t-2 border-yellow pt-6 sm:grid-cols-3`}>
        <div>
          <span className={`eyebrow ${dark ? 'text-yellow' : 'text-petrol/70'}`}>Battery capacity</span>
          <p className={`mt-1 text-2xl font-semibold ${headingClass}`}>{result.batteryCapacityKwh} kWh</p>
        </div>
        <div>
          <span className={`eyebrow ${dark ? 'text-yellow' : 'text-petrol/70'}`}>Panel array</span>
          <p className={`mt-1 text-2xl font-semibold ${headingClass}`}>{result.panelArrayKw} kW</p>
        </div>
        <div>
          <span className={`eyebrow ${dark ? 'text-yellow' : 'text-petrol/70'}`}>Inverter (min.)</span>
          <p className={`mt-1 text-2xl font-semibold ${headingClass}`}>
            {result.recommendedInverterWatts.toLocaleString()} W
          </p>
        </div>
      </div>

      <p className={`mt-6 text-xs leading-relaxed ${labelClass}`}>
        Assumes {ABUJA_AVERAGE_PEAK_SUN_HOURS} average peak sun hours/day, an 80% usable battery
        depth-of-discharge, and typical system losses - a planning estimate,
        not a quote.{' '}
        <Link href="/contact" className="link-underline font-semibold text-yellow">
          Request a sizing consultation
        </Link>
        .
      </p>
    </div>
  )
}
