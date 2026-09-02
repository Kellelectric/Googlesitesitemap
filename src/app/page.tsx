import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/sections/Hero'
import { StatsBar } from '@/components/sections/StatsBar'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { SolarFeature } from '@/components/sections/SolarFeature'
import { SolarSizingCalculator } from '@/components/calculators/SolarSizingCalculator'
import { IndustriesPreview } from '@/components/sections/IndustriesPreview'
import { AreasPreview } from '@/components/sections/AreasPreview'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { TestimonialsPreview } from '@/components/sections/TestimonialsPreview'
import { PartnerLogos } from '@/components/sections/PartnerLogos'
import { partners } from '@/content/partners'
import { CTASection } from '@/components/sections/CTASection'
import { Reveal } from '@/components/ui/Reveal'
import { team } from '@/content/team'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Certified Electrical Engineering in Abuja',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesPreview />
      <SolarFeature />

      <section className="bg-paper py-24">
        <div className="container-content">
          <Reveal>
            <SolarSizingCalculator />
          </Reveal>
          <p className="mt-6 text-sm text-ink/60">
            Need a full connected-load estimate instead?{' '}
            <Link href="/calculators" className="link-underline font-semibold text-petrol">
              Try the load calculator
            </Link>
            .
          </p>
        </div>
      </section>

      <ProcessSection />
      <IndustriesPreview />
      <AreasPreview />
      <TrustSection />

      <section className="bg-paper py-14">
        <div className="container-content flex flex-col items-center text-center">
          <Reveal>
            <div className="flex justify-center -space-x-3">
              {team.map((member) =>
                member.photo ? (
                  <div
                    key={member.name}
                    className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-paper shadow-sm"
                  >
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ) : null
              )}
            </div>
            <p className="mt-5 text-ink/70">
              Real engineers, not a call center - see who&rsquo;s behind the work.
            </p>
            <Link
              href="/about#team"
              className="link-underline mt-3 inline-block font-semibold text-petrol"
            >
              View Our Team →
            </Link>
          </Reveal>
        </div>
      </section>

      <TestimonialsPreview />
      <PartnerLogos partners={partners} />
      <CTASection />
    </>
  )
}
