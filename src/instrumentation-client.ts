import * as Sentry from '@sentry/nextjs'

// Client-side (browser) error tracking. Next.js auto-loads this file (no
// import needed anywhere else) - see
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation#client-instrumentation.
// Same no-op-until-configured behavior as the server config: without
// NEXT_PUBLIC_SENTRY_DSN set, this init() call disables itself.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Session Replay is off by default - it can capture visitor input
  // (the 3 site forms collect name/email/phone), and turning it on
  // should be a deliberate call with masking configured, not a default.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  debug: false,
})

// Required by the SDK to instrument client-side route transitions (App
// Router navigations) - without exporting this, Sentry can still capture
// errors but won't tie them to navigation/pageload performance spans.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
