import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'

export const metadata: Metadata = {
  title: 'Electrical Assessment',
  description:
    'Answer a few questions about your property and electrical needs. We\'ll recommend the right service and next step — no account required, about 2 minutes.',
}

const trustPoints = [
  'No account required',
  'Takes approximately 2 minutes',
  'Professional service recommendation',
  'Your information remains private',
]

export default function AssessmentLandingPage() {
  return (
    <section className="relative overflow-hidden bg-petrol text-paper">
      <div className="absolute inset-0 bg-circuit-grid bg-grid opacity-40" />
      <CircuitLines className="pointer-events-none absolute -right-32 top-0 h-full w-[55%] text-paper/10" />

      <div className="container-content relative py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-yellow">{company.name} · 2-Minute Electrical Assessment</p>

          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-[1.1]">
            Let’s find the right electrical solution for your project.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            Answer a few questions about your property, electrical needs, and project goals. We’ll
            recommend the right service and next step.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm text-paper/75">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow" />
                {point}
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/assessment/start" variant="primary">
              Start Assessment
            </Button>
            <Button href="/book" variant="secondary">
              Book a Service Directly
            </Button>
          </div>

          <p className="mt-8 max-w-lg text-sm text-paper/50">
            Immediate electrical safety concern — sparks, burning smell, or total power loss?{' '}
            <a href="/assessment/emergency" className="link-underline text-yellow">
              Request emergency assistance
            </a>{' '}
            instead.
          </p>
        </div>
      </div>
    </section>
  )
}
