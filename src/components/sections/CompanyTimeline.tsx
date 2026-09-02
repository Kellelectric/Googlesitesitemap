import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export type Milestone = {
  year: string
  title: string
  description: string
}

// Three distinct layouts, not one layout scaled down - each is its own
// markup so every breakpoint gets a version actually designed for it:
// - Desktop (lg+): a horizontal roadmap, alternating above/below a single
//   connecting line, using the full section width. Alternation via CSS
//   Grid's three explicit rows (labels above / dot+line / labels below) -
//   each row auto-sizes to its own tallest cell across every column, so
//   every dot lands on the same horizontal line regardless of how long an
//   individual milestone's text runs.
// - Tablet (md–lg): a 2-column card grid - deliberately not a squeezed
//   version of the desktop roadmap, which reads as cramped at this width.
// - Mobile (below md): a vertical line-and-dot timeline.
// All three are plain CSS/HTML - no JavaScript is required for any of
// them to render their content; Reveal/StaggerGroup only animate an
// already-visible entrance (see Reveal.tsx), they don't gate visibility.
export function CompanyTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <section className="bg-paper py-20">
      <div className="container-content">
        <Reveal>
          <span className="eyebrow text-petrol/70">Company history</span>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-ink md:text-3xl">
            From startup to Abuja&rsquo;s go-to electrical engineering team
          </h2>
        </Reveal>

        {/* Desktop: horizontal roadmap, alternating above/below the line.
            Every cell gets an explicit column (not just row) - mixing an
            explicit row with auto column placement doesn't coexist safely
            with the col-span-full line item: verified via a real render
            that it pushed every dot into stray implicit columns off the
            end of the grid instead of under its milestone. */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-7">
          {milestones.map((milestone, i) => {
            const above = i % 2 === 0
            return (
              <div
                key={`${milestone.year}-above`}
                style={{ gridColumnStart: i + 1 }}
                className="row-start-1 flex items-end justify-center px-2 pb-5 text-center"
              >
                {above ? <MilestoneLabel milestone={milestone} /> : null}
              </div>
            )
          })}
          <div className="relative col-span-full row-start-2 h-0">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-petrol/20" aria-hidden="true" />
          </div>
          {milestones.map((milestone, i) => (
            <div
              key={`${milestone.year}-dot`}
              style={{ gridColumnStart: i + 1 }}
              className="row-start-2 flex items-center justify-center py-3"
            >
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-petrol bg-paper"
                aria-hidden="true"
              />
            </div>
          ))}
          {milestones.map((milestone, i) => {
            const above = i % 2 === 0
            return (
              <div
                key={`${milestone.year}-below`}
                style={{ gridColumnStart: i + 1 }}
                className="row-start-3 flex items-start justify-center px-2 pt-5 text-center"
              >
                {above ? null : <MilestoneLabel milestone={milestone} />}
              </div>
            )
          })}
        </div>

        {/* Tablet: 2-column card grid */}
        <StaggerGroup className="mt-12 hidden grid-cols-2 gap-6 md:grid lg:hidden">
          {milestones.map((milestone) => (
            <MotionDiv
              key={milestone.year}
              variants={staggerItem}
              className="border-t-2 border-petrol pt-5"
            >
              <span className="font-display text-xl font-semibold text-petrol">{milestone.year}</span>
              <h3 className="mt-1 text-sm font-semibold text-ink">{milestone.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{milestone.description}</p>
            </MotionDiv>
          ))}
        </StaggerGroup>

        {/* Mobile: vertical line-and-dot timeline */}
        <div className="relative mt-10 md:hidden">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-petrol/20" aria-hidden="true" />
          <StaggerGroup className="space-y-9">
            {milestones.map((milestone) => (
              <MotionDiv key={milestone.year} variants={staggerItem} className="relative pl-8">
                <span
                  className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-petrol bg-paper"
                  aria-hidden="true"
                />
                <span className="font-display text-xl font-semibold text-petrol">{milestone.year}</span>
                <h3 className="mt-1 text-sm font-semibold text-ink">{milestone.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{milestone.description}</p>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}

function MilestoneLabel({ milestone }: { milestone: Milestone }) {
  // No fixed max-width: this sits inside a minmax(0,1fr) grid column, so
  // its real available width varies with viewport (7 columns means as
  // little as ~135px at the lg breakpoint) - a fixed guess overflowed
  // past the container at 1024px, verified via a real overflow check.
  // Letting it size to the column and wrap naturally fixes that at every
  // width in between, not just the ones spot-checked.
  return (
    <div className="w-full">
      <span className="font-display text-lg font-semibold text-petrol">{milestone.year}</span>
      <h3 className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink">{milestone.title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{milestone.description}</p>
    </div>
  )
}
