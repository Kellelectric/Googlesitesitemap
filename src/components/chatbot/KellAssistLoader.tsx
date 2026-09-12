'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { trackEvent } from '@/lib/analytics'

// Owns the floating launcher button and the open/closed state itself, and
// only dynamically imports the real KellAssist panel (600 lines plus the
// full services/industries content arrays it imports for its quick-reply
// flows) once the visitor actually clicks to open it - not merely after
// hydration. A plain `dynamic(..., { ssr: false })` mounted unconditionally
// (the previous approach) still fetches that chunk right after hydration,
// which Lighthouse's "unused JavaScript" audit keeps counting as loaded-
// but-mostly-unexecuted; gating the import behind the click itself is what
// actually keeps it out of the page until someone wants it.
const KellAssistPanel = dynamic(
  () => import('@/components/chatbot/KellAssist').then((mod) => mod.KellAssist),
  { ssr: false },
)

export function KellAssistLoader() {
  const [open, setOpen] = useState(false)
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)

  function handleOpen() {
    setOpen(true)
    if (!hasOpenedOnce) {
      trackEvent('chat_opened')
      setHasOpenedOnce(true)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open Kell Assist chat"
        className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-petrol text-paper transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow md:bottom-6 md:right-6"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
          <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-4.3 3.6A.5.5 0 0 1 4 20.2V17H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        </svg>
      </button>
    )
  }

  return <KellAssistPanel onClose={() => setOpen(false)} />
}
