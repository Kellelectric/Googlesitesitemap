'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { company } from '@/content/company'

// Only rendered when an error escapes every other error boundary in the
// app (a crash in the root layout itself) - Next.js requires this file to
// define its own <html>/<body>, since the root layout that would normally
// provide them is what crashed. Reports to Sentry (a no-op if SENTRY_DSN
// isn't set, same as everywhere else Sentry is called in this codebase)
// before showing a minimal, dependency-free fallback - deliberately not
// using Header/Footer/Tailwind utility classes tied to globals.css, since
// whatever broke the root layout could plausibly break those too.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: '0.75rem', color: '#555' }}>
          Please call {company.phone} or WhatsApp us directly, or try reloading the page.
        </p>
      </body>
    </html>
  )
}
