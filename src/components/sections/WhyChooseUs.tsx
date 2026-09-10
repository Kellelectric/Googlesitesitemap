import { company } from '@/content/company'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

// The same 4 trust facts were copy-pasted as a plain bullet list (dot +
// text, border-b divider) across the services hub, service detail,
// industries hub, and industry detail templates - 4 near-identical blocks,
// none using imagery or real hierarchy. One shared component now, styled
// as the same "instrument panel" hairline-divider readout StatsBar uses on
// the homepage, so this recurring trust block reads as a deliberate,
// consistent device sitewide rather than a bullet list stamped four times.
const FACTS = [
  'COREN and NEMSA certified',
  `${company.teamExperienceYears}+ years of combined engineering experience`,
  `${company.trust.googleRating}★ Google rating from ${company.trust.googleReviewCount}+ reviews`,
  `${company.trust.projectsCompleted}+ projects completed`,
]

type WhyChooseUsProps = {
  dark?: boolean
  heading?: string
  // 'full' = full-width container, single row of 4 at lg: (safe for a
  // hairline divide-x, matching StatsBar's own md:-only-divide fix).
  // 'compact' = a narrower column (sidebar/half-width) where 4 items never
  // reach a true single row, so this uses a 2x2 grid with no divide-x
  // (that hairline-border trick only works when DOM order matches visual
  // row order, i.e. one row of 4 - see StatsBar.tsx's comment).
  layout?: 'full' | 'compact'
}

export function WhyChooseUs({ dark = true, heading, layout = 'full' }: WhyChooseUsProps) {
  const bg = dark ? 'bg-petrol-700 text-paper' : 'bg-paper text-ink'
  const eyebrowColor = dark ? 'text-yellow' : 'text-petrol/70'
  const dividerColor = dark ? 'divide-paper/15' : 'divide-ink/10'
  const markColor = dark ? 'bg-yellow' : 'bg-petrol'

  return (
    <section className={bg}>
      <div className="container-content py-20">
        <Reveal>
          <span className={`eyebrow ${eyebrowColor}`}>Why choose Kell Electricals</span>
          {heading && (
            <h2 className="mt-3 max-w-xl text-2xl font-semibold md:text-3xl">{heading}</h2>
          )}
        </Reveal>

        {layout === 'full' ? (
          <StaggerGroup
            className={`mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0 lg:divide-x ${dividerColor}`}
          >
            {FACTS.map((item, i) => (
              <MotionDiv key={item} variants={staggerItem} className={i === 0 ? '' : 'lg:pl-6'}>
                <span className={`inline-block h-1.5 w-1.5 shrink-0 ${markColor}`} />
                <p className="mt-3 max-w-[22ch] text-sm leading-relaxed">{item}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        ) : (
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FACTS.map((item) => (
              <MotionDiv
                key={item}
                variants={staggerItem}
                className={`flex gap-3 border-b pb-3 text-sm ${dark ? 'border-paper/15 text-paper/80' : 'border-ink/10 text-ink/75'}`}
              >
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${markColor}`} />
                {item}
              </MotionDiv>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  )
}
