'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  applianceCatalog,
  buildingTypes,
  getBuildingTypeBySlug,
} from '@/content/calculators'
import { totalConnectedWatts, recommendedInverterWatts } from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

export function LoadCalculator() {
  const [buildingSlug, setBuildingSlug] = useState(buildingTypes[0].slug)
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(buildingTypes[0].defaults.map((d) => [d.key, d.quantity])),
  )

  function selectBuildingType(slug: string) {
    setBuildingSlug(slug)
    const building = getBuildingTypeBySlug(slug)
    setQuantities(Object.fromEntries((building?.defaults ?? []).map((d) => [d.key, d.quantity])))
  }

  const building = getBuildingTypeBySlug(buildingSlug) ?? buildingTypes[0]

  const items = useMemo(
    () =>
      building.defaults
        .map((d) => {
          const appliance = applianceCatalog.find((a) => a.key === d.key)
          if (!appliance) return null
          return { key: d.key, label: appliance.label, watts: appliance.watts, quantity: quantities[d.key] ?? 0 }
        })
        .filter((i): i is NonNullable<typeof i> => Boolean(i)),
    [building, quantities],
  )

  const connectedWatts = totalConnectedWatts(items)
  const inverterWatts = recommendedInverterWatts(connectedWatts)

  return (
    <div className="border border-ink/10 bg-paper p-6 md:p-8">
      <span className="eyebrow text-petrol/70">Load calculator</span>
      <h3 className="mt-2 text-xl font-semibold text-ink">
        Estimate your connected electrical load
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        Pick a building type, adjust the quantities to match your property,
        and get an indicative connected load and recommended minimum
        inverter/generator size. This is a planning estimate — a real load
        assessment measures your actual consumption before we size anything.
      </p>

      <div className="mt-6 max-w-sm">
        <label className="block">
          <span className="eyebrow text-ink/60">Building type</span>
          <select
            value={buildingSlug}
            onChange={(e) => selectBuildingType(e.target.value)}
            className={`${inputClass} mt-2`}
          >
            {buildingTypes.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
            <div>
              <p className="text-sm font-medium text-ink">{item.label}</p>
              <p className="text-xs text-ink/50">{item.watts}W each</p>
            </div>
            <input
              type="number"
              min={0}
              max={99}
              value={item.quantity}
              onChange={(e) =>
                setQuantities((q) => ({ ...q, [item.key]: Math.max(0, Number(e.target.value) || 0) }))
              }
              className={`${inputClass} w-20 text-center`}
              aria-label={`Quantity of ${item.label}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t-2 border-petrol pt-6 sm:grid-cols-2">
        <div>
          <span className="eyebrow text-petrol/70">Total connected load</span>
          <p className="mt-1 text-3xl font-semibold text-ink">
            {connectedWatts.toLocaleString()} <span className="text-lg font-normal text-ink/60">W</span>
          </p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Recommended minimum inverter/generator</span>
          <p className="mt-1 text-3xl font-semibold text-ink">
            {inverterWatts.toLocaleString()} <span className="text-lg font-normal text-ink/60">W</span>
          </p>
          <p className="mt-1 text-xs text-ink/50">Includes a standard safety margin for motor start-up loads.</p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/50">
        Indicative estimate only, based on typical appliance wattages — not
        a measured load assessment.{' '}
        <Link href="/contact" className="link-underline font-semibold text-petrol">
          Request a real load assessment
        </Link>
        .
      </p>
    </div>
  )
}
