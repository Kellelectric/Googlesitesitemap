import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { StatsBar } from '@/components/sections/StatsBar'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { SolarFeature } from '@/components/sections/SolarFeature'
import { TrustSection } from '@/components/sections/TrustSection'
import { CTASection } from '@/components/sections/CTASection'
import { FaqSection } from '@/components/sections/FaqSection'

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
      <ProcessSection />
      <SolarFeature />
      <TrustSection />
      <CTASection />
      <FaqSection />
    </>
  )
}
