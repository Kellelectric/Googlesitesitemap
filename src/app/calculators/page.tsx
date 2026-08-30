import type { Metadata } from 'next'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'
import { LoadCalculator } from '@/components/calculators/LoadCalculator'
import { SolarSizingCalculator } from '@/components/calculators/SolarSizingCalculator'
import { company } from '@/content/company'
import { calculatorsFAQs } from '@/content/faqs'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Load & Solar Sizing Calculators',
  description:
    'Free electrical load calculator and solar/battery sizing calculator for homes and businesses in Abuja. Indicative planning estimates, not a substitute for a real load assessment.',
  path: '/calculators',
})

export default function CalculatorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Calculators', url: `${company.domain}/calculators` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Free tools</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Load &amp; Solar Sizing Calculators
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Two quick planning tools: estimate your property&rsquo;s
            connected electrical load, or get a rough starting point for a
            solar and battery system size. Both are indicative estimates —
            we still run a real load assessment before quoting any job.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <Reveal>
            <LoadCalculator />
          </Reveal>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <SolarSizingCalculator dark />
          </Reveal>
        </div>
      </section>

      <FAQSection items={calculatorsFAQs} viewAllHref="/faq" />

      <CTASection />
    </>
  )
}
