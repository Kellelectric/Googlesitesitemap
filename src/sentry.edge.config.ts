import * as Sentry from '@sentry/nextjs'

// Same config as sentry.server.config.ts, for code that runs in the Edge
// runtime (middleware, if any is added later) rather than Node.js.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
})
