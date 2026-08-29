'use client'

import { company } from '@/content/company'
import { trackEvent } from '@/lib/analytics'

// Header's call-to-action lives in the desktop nav bar; on mobile that bar
// scrolls away with the page, so a visitor mid-scroll on a service or
// industry page has no quick path to call or WhatsApp without scrolling
// back to the top. This keeps the two highest-intent actions one tap away
// at all times on small screens (hidden on md+, where the header CTA is
// always visible).
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-paper/10 bg-petrol md:hidden">
      <a
        href={company.phoneHref}
        onClick={() => trackEvent('contact', { channel: 'phone', placement: 'mobile_bar' })}
        className="flex flex-1 items-center justify-center gap-2 border-r border-paper/10 py-3.5 text-sm font-semibold text-paper"
      >
        Call {company.phone}
      </a>
      <a
        href={company.whatsappHref}
        onClick={() => trackEvent('contact', { channel: 'whatsapp', placement: 'mobile_bar' })}
        className="flex flex-1 items-center justify-center gap-2 bg-yellow py-3.5 text-sm font-semibold text-ink"
      >
        WhatsApp
      </a>
    </div>
  )
}
