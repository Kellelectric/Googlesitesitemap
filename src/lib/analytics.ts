// Thin wrapper around gtag so every conversion action in the funnel (phone
// click, WhatsApp click, quote submitted) is measurable, not just page
// views. Safe no-op when GA4 isn't configured (see GoogleAnalytics.tsx) —
// never throws, never blocks the click/nav it's attached to.
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('event', name, params)
}
