import type { Metadata } from 'next'
import { EmergencyForm } from '@/components/assessment/EmergencyForm'

export const metadata: Metadata = {
  title: 'Emergency Electrical Assistance',
  robots: { index: false, follow: false },
}

export default function AssessmentEmergencyPage() {
  return (
    <section className="container-content py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow text-orange">Electrical Emergency Response</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Let’s get you help right away.</h1>
        <p className="mt-4 text-ink/60">
          If there is an immediate electrical safety concern, keep people away from the affected area and
          avoid touching exposed electrical components. Our team can help assess the situation.
        </p>
        <div className="mt-8">
          <EmergencyForm />
        </div>
      </div>
    </section>
  )
}
