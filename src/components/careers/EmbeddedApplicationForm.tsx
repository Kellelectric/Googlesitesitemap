'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

type Props = {
  formUrl: string
  reference: string | null
  trackName?: string
}

// Embeds the applicant's pre-filled Google Form directly on the thank-you
// page instead of sending them off-site to open it themselves. Completion
// is detected with a well-known (if imperfect) heuristic: Google's embedded
// form reloads the same iframe to its own "response recorded" confirmation
// page on submit, so the iframe's second load event is the strongest signal
// available without reading its cross-origin contents. A false positive
// (e.g. the applicant manually reloading the form) only costs an extra
// "received" email, never a broken flow - the fallback "open in a new tab"
// link below still works regardless of whether this ever fires.
export function EmbeddedApplicationForm({ formUrl, reference, trackName }: Props) {
  const [loadCount, setLoadCount] = useState(0)
  const [completed, setCompleted] = useState(false)

  const embedUrl = (() => {
    try {
      const url = new URL(formUrl)
      url.searchParams.set('embedded', 'true')
      return url.toString()
    } catch {
      return formUrl
    }
  })()

  function handleLoad() {
    setLoadCount((prev) => {
      const next = prev + 1
      if (next >= 2 && !completed) {
        setCompleted(true)
        fetch('/api/careers-application/form-submitted', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        }).catch(() => {
          // Best-effort - the confirmation shown below doesn't depend on
          // this succeeding (see form-submitted/route.ts).
        })
      }
      return next
    })
  }

  if (completed) {
    return (
      <>
        <span className="eyebrow text-yellow">Application received</span>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
          Thanks{trackName ? ` for completing your ${trackName} application` : ''} - our team
          will review it and get back to you.
        </h1>
        <div className="mt-8 max-w-lg border border-yellow/40 bg-yellow/10 p-6">
          <p className="text-sm leading-relaxed text-paper/75">
            We&rsquo;ve sent a confirmation to your email. We review applications directly -
            no automated filter - so if your background fits what we&rsquo;re looking for,
            we&rsquo;ll follow up by phone or email.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <span className="eyebrow text-yellow">One step left</span>
      <h1 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
        Thanks{trackName ? ` for starting your application to ${trackName}` : ''} - finish the
        form below to complete it.
      </h1>
      <div className="mt-8 max-w-2xl border border-yellow/40 bg-yellow/10 p-6">
        <p className="text-sm font-semibold text-paper">One more step</p>
        <p className="mt-2 text-sm leading-relaxed text-paper/75">
          Your application isn&rsquo;t complete yet. Your details have been pre-filled into
          our official {trackName ?? 'programme'} application form below - please finish it now
          (photo, ID/documents, and your signature are required there).
        </p>
        <div className="mt-4 overflow-hidden border border-paper/20 bg-paper">
          <iframe
            src={embedUrl}
            onLoad={handleLoad}
            title={`${trackName ?? 'Application'} form`}
            className="h-[80vh] w-full"
          >
            Loading…
          </iframe>
        </div>
        <p className="mt-3 text-xs text-paper/60">Trouble viewing the form above?</p>
        <Button
          href={formUrl}
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2"
        >
          Open it in a new tab
        </Button>
      </div>
    </>
  )
}
