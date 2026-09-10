import { StatCounter } from '@/components/ui/StatCounter'
import { company } from '@/content/company'

// "Instrument panel" treatment, not a plain 4-up stat grid: hairline
// dividers between readouts (divide-x, matching the hairline-hierarchy
// rule in DESIGN.md — no shadows, no rounding) and one stat rendered at a
// visibly larger display size than the other three, echoing the big-numeral
// precedent already set by TrustSection's 5★ figure. The circuit-grid
// texture (same class combo as Hero.tsx) reinforces the electrical-engineering
// register instead of leaving the band flat.
export function StatsBar() {
  return (
    <section className="relative overflow-hidden border-y border-paper/10 bg-petrol-600">
      <div className="absolute inset-0 bg-circuit-grid bg-grid opacity-10" />
      {/* divide-x only applies from md: up: below that this is a 2x2 grid, and
          the divide utility's `border-left on every child but the first in
          DOM order` can't tell a genuine row-start (item 3) from a mid-row
          item (item 2) - applying it there would draw a spurious line down
          the left of "1000+". At md: and up it's a true single row of four,
          where that selector is always correct. */}
      <div className="container-content relative grid grid-cols-2 gap-y-10 py-20 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-paper/10">
        <div className="pr-6">
          <StatCounter
            value={company.teamExperienceYears}
            suffix="+"
            label="Years of combined engineering experience"
            featured
          />
        </div>
        <div className="flex flex-col justify-end px-6">
          <StatCounter
            value={company.trust.googleRating}
            decimals={1}
            suffix="★"
            label={`Google rating from ${company.trust.googleReviewCount} reviews`}
          />
        </div>
        <div className="flex flex-col justify-end px-6">
          <StatCounter value={company.trust.projectsCompleted} suffix="+" label="Projects completed across Abuja" />
        </div>
        <div className="flex flex-col justify-end px-6">
          <StatCounter value={24} suffix="/7" label="Emergency response availability" />
        </div>
      </div>
    </section>
  )
}
