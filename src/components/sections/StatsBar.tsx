'use client'

import { useReducedMotion } from 'framer-motion'
import { MeterPlate } from '@/components/ui/MeterPlate'
import { company } from '@/content/company'

export function StatsBar() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section className="bg-petrol-600 py-16 md:py-20">
      <div className="container-content">
        <div className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-paper/40">
          Instrument reading — verified, not asserted
        </div>

        {/* One panel, one bezel — four gauges read off it rather than four
            separate stat cards, and the rating (the one genuinely bounded
            metric) leads at a larger face. */}
        <div className="relative border border-copper/25 bg-petrol-700/50 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.7)]">
          <span className="absolute left-2.5 top-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />
          <span className="absolute right-2.5 top-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />
          <span className="absolute bottom-2.5 left-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />
          <span className="absolute bottom-2.5 right-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />

          <div className="grid grid-cols-1 divide-y divide-paper/10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:divide-x md:divide-y-0">
            <MeterPlate
              value={company.trust.googleRating}
              decimals={1}
              label={`Google rating · ${company.trust.googleReviewCount} reviews`}
              ladderOf5
              lead
              reduceMotion={reduceMotion}
            />
            <MeterPlate
              value={company.yearsExperience}
              suffix="+"
              label="Years of engineering experience"
              reduceMotion={reduceMotion}
            />
            <MeterPlate value={company.serviceAreas.length} label="Service zones across Abuja" reduceMotion={reduceMotion} />
            <MeterPlate value={24} suffix="/7" label="Emergency response availability" reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>
    </section>
  )
}
