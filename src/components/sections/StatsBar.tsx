import { StatCounter } from '@/components/ui/StatCounter'
import { company } from '@/content/company'

export function StatsBar() {
  return (
    <section className="border-y border-paper/10 bg-petrol-600">
      <div className="container-content grid grid-cols-2 gap-8 py-16 md:grid-cols-4">
        <StatCounter value={company.teamExperienceYears} suffix="+" label="Years of combined engineering experience" />
        <StatCounter
          value={company.trust.googleRating}
          decimals={1}
          suffix="★"
          label={`Google rating from ${company.trust.googleReviewCount} reviews`}
        />
        <StatCounter value={company.serviceAreas.length} label="Service zones across Abuja" />
        <StatCounter value={24} suffix="/7" label="Emergency response availability" />
      </div>
    </section>
  )
}
