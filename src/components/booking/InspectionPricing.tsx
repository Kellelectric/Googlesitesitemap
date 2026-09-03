'use client'

import { useState } from 'react'
import { inspectionFees, buildingAuditNote } from '@/content/inspectionPricing'
import { company } from '@/content/company'

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

// Accordion, not a plain price table: the client asked for "click an area,
// see the price" rather than everything shown at once. Any area whose fee
// is still `null` (see inspectionPricing.ts - real figures haven't been
// supplied yet) shows a "confirm your fee" call to action instead of a
// placeholder number, so nothing invented ever reaches a visitor.
export function InspectionPricing() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  return (
    <div>
      <span className="eyebrow text-petrol/70">Inspection pricing</span>
      <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
        What a site inspection costs, by area
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink/75">
        Select your area below to see the standard inspection fee. This
        covers a scheduled visit to assess and document your electrical
        system - separate from a full building audit, which is priced per
        property (see below).
      </p>

      <div className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
        {inspectionFees.map((area) => {
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
                  {area.fee !== null ? (
                    <p>
                      Standard inspection in {area.name}:{' '}
                      <span className="font-semibold text-ink">{formatNaira(area.fee)}</span>
                    </p>
                  ) : (
                    <p>
                      We&rsquo;re finalizing the standard fee for {area.name}. Call{' '}
                      <span className="font-semibold text-ink">{company.phone}</span> or book a
                      site visit below and we&rsquo;ll confirm your inspection price directly.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 border border-ink/10 bg-petrol/[0.04] p-6">
        <span className="eyebrow text-petrol/70">Building audit</span>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">{buildingAuditNote}</p>
      </div>
    </div>
  )
}
