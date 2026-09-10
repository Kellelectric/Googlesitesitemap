import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'
import { pageMetadata } from '@/lib/metadata'

// A real, bookmarkable step in the funnel rather than an inline message
// that vanishes on refresh — this URL is what gets marked as the
// conversion goal in GA4/Google Ads once the domain is live.
export const metadata: Metadata = pageMetadata({
  title: 'Request Received',
  description: 'Your quote request has been received by Kell Electricals Ltd.',
  path: '/contact/thank-you',
  noIndex: true,
})

export default async function ThankYouPage(
  props: {
    searchParams: Promise<{ urgency?: string; ref?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const isEmergency = searchParams.urgency === 'emergency'
  // Only accept a reference that matches our own generated format
  // (KE-YYYY-XXXXXX) — this is a display value, not a security boundary,
  // but there's no reason to render arbitrary query-string content.
  const reference =
    searchParams.ref && /^KE-\d{4}-[A-Z0-9]{6}$/.test(searchParams.ref) ? searchParams.ref : null

  return (
    <section className="relative overflow-hidden bg-petrol text-paper">
      <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
      <div className="container-content relative py-24">
        <span className="eyebrow text-yellow">Request received</span>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
          Thanks - our team will review the job details and get back to you.
        </h1>
        {reference && (
          <p className="mt-4 text-sm text-paper/60">
            Your reference: <span className="font-semibold text-paper">{reference}</span>
          </p>
        )}
        <p className="mt-5 max-w-lg text-paper/70">
          We respond by phone or email with a scoped assessment. Have your
          phone nearby: we may call to confirm details before quoting.
        </p>

        {isEmergency ? (
          <div className="mt-8 max-w-lg border border-orange/40 bg-orange/10 p-6">
            <p className="font-semibold text-paper">
              You flagged this as an emergency.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">
              Don&rsquo;t wait on the form response - call{' '}
              <TrackedLink channel="phone" href={company.phoneHref} className="link-underline font-semibold text-paper">
                {company.phone}
              </TrackedLink>{' '}
              now. We aim to respond {company.emergencyResponseTarget} for
              active electrical hazards.
            </p>
          </div>
        ) : (
          <div className="mt-8 max-w-lg border border-paper/20 bg-paper/5 p-6">
            <p className="text-sm leading-relaxed text-paper/75">
              Need to reach us sooner, or add details to your request?
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <TrackedLink channel="phone" href={company.phoneHref} className="link-underline font-semibold text-paper">
                Call {company.phone}
              </TrackedLink>
              <TrackedLink channel="whatsapp" href={company.whatsappHref} className="link-underline font-semibold text-paper">
                Message us on WhatsApp
              </TrackedLink>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/services" variant="secondary">
            Browse our services
          </Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>

        <p className="mt-10 text-xs text-paper/50">
          Wrong page? <Link href="/contact" className="link-underline">Submit another request</Link>.
        </p>
      </div>
    </section>
  )
}
