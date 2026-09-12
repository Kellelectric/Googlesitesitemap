import { NextResponse } from 'next/server'
import { isZohoCrmConfigured } from '@/lib/zohoCrm'
import { isSlackNotifyConfigured } from '@/lib/slackNotify'
import { isResendConfigured, isCareerNotifyEmailConfigured } from '@/lib/resendEmail'
import { isCalendarConfigured } from '@/lib/googleCalendar'
import { isGoogleBusinessProfileConfigured } from '@/lib/googleBusinessProfile'

export const runtime = 'nodejs'

// Read-only health check for the site's optional third-party integrations -
// reports only whether each one's required env vars are present (booleans),
// never the actual secret values. Exists so "is X configured?" can be
// answered by curling a URL instead of reading Vercel's env var dashboard or
// guessing from a live form submission's side effects. Safe to leave live
// permanently; each is*Configured() check already exists elsewhere in the
// codebase to gate real behavior (see careers-application/route.ts, etc.) -
// this route just surfaces the same booleans over HTTP.
export async function GET() {
  return NextResponse.json({
    zohoCrmLeads: isZohoCrmConfigured(),
    slackNotify: isSlackNotifyConfigured(),
    resendEmail: isResendConfigured(),
    resendInternalNotify: isCareerNotifyEmailConfigured(),
    googleCalendarBooking: isCalendarConfigured(),
    careersWebhook: Boolean(process.env.CAREERS_WEBHOOK_URL),
    quoteWebhook: Boolean(process.env.QUOTE_WEBHOOK_URL),
    paystack: Boolean(
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && process.env.PAYSTACK_SECRET_KEY,
    ),
    groqChat: Boolean(process.env.GROQ_API_KEY),
    zohoSalesIq: Boolean(process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGET_CODE),
    ga4: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    sentry: Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN),
    durableRateLimit: Boolean(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
    ),
    googleBusinessProfileLiveRating: isGoogleBusinessProfileConfigured(),
  })
}
