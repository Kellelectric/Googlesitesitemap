'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { calculateGeneratorRunningCost } from '@/lib/calculatorMath'

const inputClass =
  'w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-petrol'

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`
}

export function GeneratorRunningCostCalculator() {
  const [fuelConsumptionLitresPerHour, setFuelConsumptionLitresPerHour] = useState(3)
  const [fuelPricePerLitre, setFuelPricePerLitre] = useState(1200)
  const [hoursPerDay, setHoursPerDay] = useState(6)
  const [daysPerMonth, setDaysPerMonth] = useState(30)

  const result = useMemo(
    () =>
      calculateGeneratorRunningCost({
        fuelConsumptionLitresPerHour,
        fuelPricePerLitre,
        hoursPerDay,
        daysPerMonth,
      }),
    [fuelConsumptionLitresPerHour, fuelPricePerLitre, hoursPerDay, daysPerMonth],
  )

  return (
    <div className="border border-ink/10 bg-paper p-6 md:p-8">
      <span className="eyebrow text-petrol/70">Generator running cost calculator</span>
      <h2 className="mt-2 text-xl font-semibold text-ink">
        Work out what a generator actually costs to run
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        Enter your generator&rsquo;s fuel consumption (check the spec sheet
        or manual, since this varies by make and load) and today&rsquo;s
        fuel price, and this works out the running cost - a figure worth
        comparing against a solar/hybrid system&rsquo;s upfront cost over
        time.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="eyebrow text-ink/60">Fuel use (L/hour)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={fuelConsumptionLitresPerHour}
            onChange={(e) => setFuelConsumptionLitresPerHour(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Fuel price (₦/litre)</span>
          <input
            type="number"
            min={0}
            step={10}
            value={fuelPricePerLitre}
            onChange={(e) => setFuelPricePerLitre(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Hours run per day</span>
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/60">Days per month</span>
          <input
            type="number"
            min={0}
            max={31}
            step={1}
            value={daysPerMonth}
            onChange={(e) => setDaysPerMonth(Math.max(0, Number(e.target.value) || 0))}
            className={`${inputClass} mt-2`}
          />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t-2 border-petrol pt-6 sm:grid-cols-3">
        <div>
          <span className="eyebrow text-petrol/70">Cost per hour</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{formatNaira(result.costPerHour)}</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Cost per day</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{formatNaira(result.costPerDay)}</p>
        </div>
        <div>
          <span className="eyebrow text-petrol/70">Cost per month</span>
          <p className="mt-1 text-2xl font-semibold text-ink">{formatNaira(result.costPerMonth)}</p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/60">
        Fuel cost only - doesn&rsquo;t include maintenance, servicing, or
        wear on the generator. Figures are only as accurate as the fuel
        consumption and price you enter.{' '}
        <Link href="/solar-energy-systems" className="link-underline font-semibold text-petrol">
          Compare against a solar/hybrid system
        </Link>
        .
      </p>
    </div>
  )
}
