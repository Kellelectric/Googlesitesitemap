import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'
import { getCareerTrackBySlug } from '@/content/careers'
import { pageMetadata } from '@/lib/metadata'

// Same bookmarkable-conversion-goal pattern as contact/thank-you/page.tsx.
export const metadata: Metadata = pageMetadata({
  title: 'Application Received',
  description: 'Your application has been received by Kell Electricals Ltd.',
  path: '/careers/thank-you',
  noIndex: true,
})

// Only allow http(s) URLs pointed at Google's own form host - `continue`
// is an attacker-controlled query param, and this page renders it as a
// clickable/auto-followed link, so an open redirect elsewhere is a real
// risk if this check is ever loosened.
function sanitizeContinueUrl(value: string | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return null
    if (url.hostname !== 'docs.google.com') return null
    return url.toString()
  } catch {
    return null
  }
}

export default function CareersThankYouPage({
  searchParams,
}: {
  searchParams: { track?: string; ref?: string; continue?: string }
}) {
  const track = searchParams.track ? getCareerTrackBySlug(searchParams.track) : undefined
  const reference =
    searchParams.ref && /^KE-APP-\d{4}-[A-Z0-9]{6}$/.test(searchParams.ref)
      ? searchParams.ref
      : null
  const continueUrl = sanitizeContinueUrl(searchParams.continue)

  return (
    <section className="relative overflow-hidden bg-petrol text-paper">
      <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
      <div className="container-content relative py-24">
        <span className="eyebrow text-yellow">Application received</span>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
          Thanks{track ? ` for applying to ${track.name}` : ''} - our team will review your
          application and get back to you.
        </h1>
        {reference && (
          <p className="mt-4 text-sm text-paper/60">
            Your reference: <span className="font-semibold text-paper">{reference}</span>
          </p>
        )}

        {continueUrl ? (
          <div className="mt-8 max-w-lg border border-yellow/40 bg-yellow/10 p-6">
            <p className="text-sm font-semibold text-paper">One more step</p>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">
              Your details have been pre-filled into our official{' '}
              {track ? track.name : 'programme'} application form - please open it now to
              finish (photo, ID/documents, and your signature are required
              there).
            </p>
            <Button href={continueUrl} className="mt-4" target="_blank" rel="noopener noreferrer">
              Continue to the application form
            </Button>
          </div>
        ) : (
          <p className="mt-5 max-w-lg text-paper/70">
            We review applications directly - no automated filter. If your
            background fits what we&rsquo;re looking for, we&rsquo;ll follow
            up by phone or email.
          </p>
        )}

        <div className="mt-8 max-w-lg border border-paper/20 bg-paper/5 p-6">
          <p className="text-sm leading-relaxed text-paper/75">
            Questions about your application, or want to add something you
            missed?
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <TrackedLink channel="phone" href={company.phoneHref} className="link-underline font-semibold text-paper">
              Call {company.phone}
            </TrackedLink>
            <TrackedLink channel="email" href={`mailto:${company.email}`} className="link-underline font-semibold text-paper">
              Email {company.email}
            </TrackedLink>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/careers" variant="secondary">
            View other career tracks
          </Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>

        <p className="mt-10 text-xs text-paper/50">
          Wrong page?{' '}
          <Link href="/careers" className="link-underline">
            Submit another application
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
