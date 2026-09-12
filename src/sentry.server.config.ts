import * as Sentry from '@sentry/nextjs'

// No-op until SENTRY_DSN is set (see src/instrumentation.ts's comment).
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Errors only by default - 100% trace sampling on a low-traffic
  // marketing/lead-gen site is cheap, but starts here at a conservative
  // rate rather than assuming Sentry's paid-plan headroom. Raise once
  // there's a reason to (e.g. investigating a specific slow route).
  tracesSampleRate: 0.1,
  // Server-side stack traces/request bodies can contain applicant PII
  // (name, email, phone from the 3 site forms) - keep this off unless a
  // specific investigation needs it, and never enable sendDefaultPii.
  debug: false,
})
