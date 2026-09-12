// Server + edge runtime error tracking. Registered automatically by
// Next.js's instrumentation hook (no import needed anywhere else) - see
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation.
//
// Entirely optional, matching every other third-party integration in this
// codebase: Sentry.init() with an empty/undefined dsn is a documented no-op
// (the SDK disables itself), so nothing changes for anyone until
// SENTRY_DSN is actually set. Get a DSN from sentry.io -> create a Next.js
// project -> Settings -> Client Keys (DSN).
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Reports errors from Server Components/Actions that Next.js's own error
// boundary catches before a Sentry SDK call site would ever see them -
// without this hook, those specifically go unreported even with the SDK
// otherwise initialized. See https://nextjs.org/docs/app/building-your-application/configuring/error-handling.
export async function onRequestError(
  ...args: Parameters<
    typeof import('@sentry/nextjs').captureRequestError
  >
) {
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureRequestError(...args)
}
