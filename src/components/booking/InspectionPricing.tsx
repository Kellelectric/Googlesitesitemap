'use client'

import { useState } from 'react'
import {
  inspectionAreas,
  residentialPricing,
  commercialPricing,
  industrialPricing,
  electricalAuditPricing,
} from '@/content/inspectionPricing'

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

function formatRange(min: number, max: number): string {
  return `${formatNaira(min)} - ${formatNaira(max)}`
}

// Residential is the only property type priced per area (near/"within
// town" tier vs. a >15km tier - see inspectionPricing.ts) - an accordion
// lets a visitor select their area rather than showing all 16 at once.
// Commercial, industrial, and a full electrical inspection & audit are
// each one flat range across all of Abuja, shown as separate cards below.
export function InspectionPricing() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  return (
    <div>
      <span className="eyebrow text-petrol/70">Inspection pricing</span>
      <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
        What an inspection costs
      </h2>

      {/* Residential, by area */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-ink">Residential inspection</h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/75">
          Select your area below to see the standard residential
          inspection fee. Areas within town (up to ~15km) are priced
          lower than areas further out.
        </p>

        <div className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
          {inspectionAreas.map((area) => {
            const isOpen = openSlug === area.slug
            return (
              <div key={area.slug}>
                <button
                  type="button"
                  onClick={() => setOpenSlug(isOpen ? null : area.slug)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="font-semibold text-ink">{area.name}</span>
                  <span
                    className={`shrink-0 text-petrol transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5 text-sm leading-relaxed text-ink/75">
                    {area.tier === 'near' ? (
                      <p>
                        {formatNaira(residentialPricing.near.withoutReport)} without an
                        inspection report,{' '}
                        <span className="font-semibold text-ink">
                          {formatNaira(residentialPricing.near.withReport)}
                        </span>{' '}
                        with a custom report.
                      </p>
                    ) : (
                      <p>
                        <span className="font-semibold text-ink">
                          {formatRange(residentialPricing.far.min, residentialPricing.far.max)}
                        </span>{' '}
                        - {area.name} is more than 15km from the town center.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Commercial, industrial, electrical audit - flat, not area-based */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-ink/10 p-6">
          <span className="eyebrow text-petrol/70">Commercial</span>
          <p className="mt-3 text-lg font-semibold text-ink">
            {formatRange(commercialPricing.min, commercialPricing.max)}
          </p>
        </div>
        <div className="border border-ink/10 p-6">
          <span className="eyebrow text-petrol/70">Industrial</span>
          <p className="mt-3 text-lg font-semibold text-ink">
            {formatRange(industrialPricing.min, industrialPricing.max)}
          </p>
          <p className="mt-2 text-xs text-ink/60">{industrialPricing.note}</p>
        </div>
        <div className="border border-ink/10 bg-petrol/[0.04] p-6">
          <span className="eyebrow text-petrol/70">Electrical inspection &amp; audit</span>
          <p className="mt-3 text-lg font-semibold text-ink">
            From {formatRange(electricalAuditPricing.min, electricalAuditPricing.max)}
          </p>
          <p className="mt-2 text-xs text-ink/60">{electricalAuditPricing.note}</p>
        </div>
      </div>
    </div>
  )
}
