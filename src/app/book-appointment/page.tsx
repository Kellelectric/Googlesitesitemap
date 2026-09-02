import type { Metadata } from 'next'
import Image from 'next/image'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { Button } from '@/components/ui/Button'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { Reveal } from '@/components/ui/Reveal'
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

// Real Google Calendar Appointment Schedule, supplied directly by the
// client (see company.ts's bookingUrl comment). The iframe uses Google's
// documented embed pattern (appending ?gv=true) so the schedule shows
// inline; the "Open booking page" button underneath is a real fallback,
// not decoration - some visitors block third-party iframes, and this way
// booking still works with one click either way.
export default function BookAppointmentPage() {
  const embedUrl = `${company.bookingUrl}?gv=true`

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
          <div className="mt-8">
            <Button href={company.bookingUrl} target="_blank" rel="noopener noreferrer">
              Open booking page
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-[1fr,380px]">
          <Reveal>
            <div className="border border-ink/10 bg-paper">
              <iframe
                src={embedUrl}
                title="Book an appointment with Kell Electricals"
                className="h-[720px] w-full"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-sm text-ink/60">
              Having trouble with the calendar above?{' '}
              <a
                href={company.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-petrol"
              >
                Open the booking page in a new tab
              </a>
              .
            </p>
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
    </>
  )
}
