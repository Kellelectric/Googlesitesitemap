import type { Metadata } from 'next'
import { QuoteForm } from '@/components/sections/QuoteForm'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Contact & Request a Quote',
  description:
    'Request a quote from Kell Electricals Ltd, COREN and NEMSA certified electrical engineers serving Wuse 2, Gwarinpa, Maitama, Asokoro, Guzape, Katampe, and wider Nigeria.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Contact</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Scope your job with our team
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Submit the details below and our team will respond with a
            scoped assessment. For active hazards, call us directly.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-[1fr,380px]">
          <QuoteForm />

          <aside className="space-y-8">
            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Direct contact</span>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-ink">Phone</p>
                  <a href={company.phoneHref} className="link-underline text-ink/70">
                    {company.phone}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-ink">WhatsApp</p>
                  <a href={company.whatsappHref} className="link-underline text-ink/70">
                    Message us on WhatsApp
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <a href={`mailto:${company.email}`} className="link-underline text-ink/70">
                    {company.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Office</span>
              <address className="mt-4 text-sm not-italic leading-relaxed text-ink/70">
                {company.address.street}
                <br />
                {company.address.district}, {company.address.city}
                <br />
                {company.address.country}
              </address>
              <p className="mt-4 text-xs text-ink/65">
                RC {company.rcNumber} · {company.certifications.map((c) => c.name).join(' & ')} certified
              </p>
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
                For active electrical hazards (sparking, burning smell,
                exposed live wiring), call {company.phone} directly rather
                than submitting the form.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Email:{' '}
                <a href={`mailto:${company.emergencyEmail}`} className="link-underline text-ink">
                  {company.emergencyEmail}
                </a>
                <br />
                We aim to respond {company.emergencyResponseTarget} for
                emergency cases.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
