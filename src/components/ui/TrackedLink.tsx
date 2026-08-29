'use client'

import { AnchorHTMLAttributes } from 'react'
import { trackEvent } from '@/lib/analytics'

type Channel = 'phone' | 'whatsapp' | 'email'

// Plain <a> wrapper for tel:/wa.me/mailto: links that live inside server
// components (Footer, Contact page cards) — fires the same GA4 conversion
// event the Button component fires, so every call/WhatsApp/email touchpoint
// on the site is measurable regardless of which component renders it.
export function TrackedLink({
  channel,
  ...rest
}: { channel: Channel } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent('contact', { channel })
        rest.onClick?.(e)
      }}
    />
  )
}
