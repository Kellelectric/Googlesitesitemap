import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { StatsBar } from '@/components/sections/StatsBar'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { SolarFeature } from '@/components/sections/SolarFeature'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { CTASection } from '@/components/sections/CTASection'

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
      <ProcessSection />
      <TrustSection />
      <CTASection />
    </>
  )
}
