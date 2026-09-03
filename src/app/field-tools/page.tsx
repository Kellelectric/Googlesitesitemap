import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { fieldTools } from '@/content/fieldTools'
import { company } from '@/content/company'

export const metadata: Metadata = {
  title: 'Field Engineering Tools',
  description:
    'The four capabilities behind every Kell Electricals site visit — load audits, cable & protection sizing, solar & generator sizing, and standards-referenced inspections.',
  alternates: { canonical: '/field-tools' },
}

export default function FieldToolsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <h1 className="max-w-2xl text-4xl font-semibold [text-wrap:balance] md:text-5xl">
            The tools behind every site visit
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Every Kell Electricals engagement — a quote, a booked site
            assessment, an emergency callout — runs through the same four
            capabilities on site, and ends in a documented report, not a
            verbal opinion.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/book" variant="primary">
              Book a Site Assessment
            </Button>
            <Button href="/services" variant="secondary">
              View Services
            </Button>
          </div>
          <p className="mt-16 font-mono text-[0.8125rem] text-paper/70">
            RC {company.rcNumber} · {company.certifications.map((c) => c.name).join(' · ')} CERTIFIED
          </p>
        </div>
      </section>

      {/* One instrument panel, four divided readouts — not four separate
          stat cards (the "hero-metric template" the site's own design
          system bans). See DESIGN.md, The One Shadow Per Cluster Rule. */}
      <section className="bg-petrol-600 py-20">
        <div className="container-content">
          <div className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-paper/40">
            Field capability — run on every visit
          </div>
          <div className="relative border border-copper/25 bg-petrol-700/50 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.7)]">
            <span className="absolute left-2.5 top-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />
            <span className="absolute bottom-2.5 left-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />
            <span className="absolute bottom-2.5 right-2.5 h-1 w-1 rounded-full bg-copper/60" aria-hidden="true" />

            <div className="grid grid-cols-1 divide-y divide-paper/10 md:grid-cols-2 md:divide-x md:divide-y-0">
              {fieldTools.map((tool, i) => (
                <div key={tool.slug} className="p-8">
                  <span className="font-mono text-xs text-copper">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-3 font-display text-xl font-semibold text-paper">
                    {tool.label}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-paper/70">
                    {tool.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-content grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="max-w-lg text-3xl font-semibold text-ink [text-wrap:balance] md:text-4xl">
              Every visit ends in a report, not an opinion
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70">
              Findings, sizing calculations, and photo evidence from each of
              the four tools above are compiled into a single documented
              report and handover certificate before the job is closed —
              the same standard whether the visit was a load audit alone
              or a complete site assessment.
            </p>
            <div className="mt-8">
              <Button href="/book" variant="primary">
                Book a Site Assessment
              </Button>
            </div>
          </div>

          <div className="border border-ink/10 bg-petrol-700/[0.03] p-8">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-petrol/60">
              What a booked visit covers
            </span>
            <ul className="mt-5 space-y-4">
              {[
                'Site & client intake, logged against a persistent client record',
                'Load audit and, where relevant, an electrical plan',
                'Cable & protection sizing or solar/generator sizing, as scoped',
                'Standards-referenced inspection with photo evidence',
                'Commissioning notes and a handover report on close',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
