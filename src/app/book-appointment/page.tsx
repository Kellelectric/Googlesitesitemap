import type { Metadata } from 'next'
import Image from 'next/image'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { Reveal } from '@/components/ui/Reveal'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { InspectionPricing } from '@/components/booking/InspectionPricing'
import { company } from '@/content/company'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = pageMetadata({
  title: 'Book an Appointment',
  description:
    'Schedule a site visit or consultation with Kell Electricals Ltd directly on our calendar - pick a time that works for you.',
  path: '/book-appointment',
  image: '/images/photos/contact-hero-consultation.jpg',
})

// The booking flow itself lives in BookingWidget.tsx: a custom on-site
// date/time picker backed by the real Google Calendar API (see
// lib/googleCalendar.ts), so visitors never see or get redirected to
// Google's own booking page. That component falls back to embedding the
// original Google-hosted calendar page only if GOOGLE_CALENDAR_* env vars
// aren't configured yet, so the page still works during setup.
export default function BookAppointmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Book an Appointment', url: `${company.domain}/book-appointment` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/contact-hero-consultation.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[60%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Book an Appointment</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Pick a time that works for you
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Schedule a site visit or consultation directly on our calendar.
            You&rsquo;ll get a confirmation once it&rsquo;s booked - no back
            and forth over email.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-[1fr,380px]">
          <Reveal>
            <BookingWidget />
          </Reveal>

          <aside className="space-y-8">
            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Prefer to talk first?</span>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-ink">Phone</p>
                  <TrackedLink channel="phone" href={company.phoneHref} className="link-underline text-ink/70">
                    {company.phone}
                  </TrackedLink>
                </div>
                <div>
                  <p className="font-semibold text-ink">WhatsApp</p>
                  <TrackedLink channel="whatsapp" href={company.whatsappHref} className="link-underline text-ink/70">
                    Message us on WhatsApp
                  </TrackedLink>
                </div>
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <TrackedLink channel="email" href={`mailto:${company.email}`} className="link-underline text-ink/70">
                    {company.email}
                  </TrackedLink>
                </div>
              </div>
            </div>

            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Business hours</span>
              <ul className="mt-4 space-y-2 text-sm text-ink/70">
                {company.businessHours.map((entry) => (
                  <li key={entry.days} className="flex justify-between gap-4">
                    <span>{entry.days}</span>
                    <span className="text-ink/65">{entry.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-orange/30 bg-orange/5 p-6">
              <span className="eyebrow text-ink">Emergency?</span>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                For active electrical hazards, call {company.phone}{' '}
                directly rather than booking an appointment - we aim to
                respond {company.emergencyResponseTarget} for emergency
                cases.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper py-20">
        <div className="container-content max-w-3xl">
          <Reveal>
            <InspectionPricing />
          </Reveal>
        </div>
      </section>
    </>
  )
}
