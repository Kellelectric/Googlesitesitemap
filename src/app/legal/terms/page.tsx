import type { Metadata } from 'next'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { termsSections, termsLastUpdated } from '@/content/legal'
import { pageMetadata } from '@/lib/metadata'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Terms & Conditions',
  description: 'Terms and conditions for use of the Kell Electricals Ltd website.',
  path: '/legal/terms',
  noIndex: true,
})

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Legal</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-5 max-w-xl text-paper/60">{termsLastUpdated}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content max-w-3xl space-y-10">
          {termsSections.map((section) => (
            <Reveal key={section.heading}>
              <h2 className="text-xl font-semibold text-ink">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="leading-relaxed text-ink/75">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
