'use client'

import dynamic from 'next/dynamic'

// Code-split out of the main bundle and mounted client-side only - the
// real KellAssist is a 600-line component plus the full services/
// industries content arrays it imports for its quick-reply flows,
// previously shipped and hydrated on EVERY page via a static import in the
// root layout even though most visitors never open the chat widget
// (flagged by Lighthouse as unused JS on initial load). Loading it after
// hydration instead - same deferred-until-needed treatment the Zoho
// SalesIQ and old Botpress scripts already got via strategy="lazyOnload".
// `ssr: false` isn't allowed inside a Server Component (the root layout),
// hence this one-line client-only wrapper.
const KellAssist = dynamic(
  () => import('@/components/chatbot/KellAssist').then((mod) => mod.KellAssist),
  { ssr: false },
)

export function KellAssistLoader() {
  return <KellAssist />
}
