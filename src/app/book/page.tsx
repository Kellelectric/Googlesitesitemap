import type { Metadata } from 'next'
import { BookingForm } from '@/components/sections/BookingForm'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'

export const metadata: Metadata = {
  title: 'Book a Site Assessment',
  description:
    'Reserve a site assessment or consultation with Kell Electricals Ltd — COREN and NEMSA certified engineers, for commercial and industrial clients scoping a contractor before committing budget.',
  alternates: { canonical: '/book' },
}

export default function BookPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <h1 className="max-w-2xl text-4xl font-semibold [text-wrap:balance] md:text-5xl">
            Reserve a site assessment
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            For commercial and industrial clients scoping a contractor
            before committing budget — pick what the visit is for, a
            preferred date and window, and our team confirms the exact
            slot within one business day.
          </p>
          <p className="mt-8 font-mono text-[0.8125rem] text-paper/55">
            RC {company.rcNumber} · {company.certifications.map((c) => c.name).join(' · ')} CERTIFIED
          </p>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <BookingForm />
        </div>
      </section>
    </>
  )
}
