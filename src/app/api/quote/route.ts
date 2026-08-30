import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

type QuotePayload = {
  name: string
  phone: string
  email?: string
  serviceSlug: string
  propertyType: string
  urgency?: string
  location: string
  details: string
  website?: string // honeypot — real users never fill this in
  renderedAt?: number // client timestamp when the form mounted
}

function isValidPayload(body: unknown): body is QuotePayload {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    typeof b.name === 'string' &&
    b.name.trim().length > 0 &&
    typeof b.phone === 'string' &&
    /^[+0-9\s()-]{7,}$/.test(b.phone.trim()) &&
    typeof b.serviceSlug === 'string' &&
    b.serviceSlug.trim().length > 0 &&
    typeof b.propertyType === 'string' &&
    b.propertyType.trim().length > 0 &&
    typeof b.location === 'string' &&
    b.location.trim().length > 0 &&
    typeof b.details === 'string' &&
    b.details.trim().length > 0
  )
}

// Minimum plausible time (seconds) between the form rendering and a real
// person submitting it. Scripted submissions that build and POST the
// payload immediately after loading the page get rejected here.
const MIN_SUBMIT_SECONDS = 3

const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })

// Forwards validated quote requests to a configurable webhook (Zoho Flow,
// Zapier, Make, etc.) set via QUOTE_WEBHOOK_URL. No destination is
// hardcoded — see docs/next-steps.md for setup.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload' }, { status: 422 })
  }

  // Honeypot: bots tend to fill every field, real users never see this one.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  // Time-trap: reject submissions completed faster than a human plausibly
  // could. Missing/invalid renderedAt is treated as suspicious, not fatal,
  // since older cached clients won't send it.
  if (typeof body.renderedAt === 'number') {
    const elapsedSeconds = (Date.now() - body.renderedAt) / 1000
    if (elapsedSeconds < MIN_SUBMIT_SECONDS) {
      return NextResponse.json({ ok: true })
    }
  }

  const webhookUrl = process.env.QUOTE_WEBHOOK_URL
  if (!webhookUrl) {
    console.error(
      'QUOTE_WEBHOOK_URL is not configured — quote request was received but not forwarded anywhere.',
    )
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  try {
    const forwarded = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'kellelectricals.com quote form',
        submittedAt: new Date().toISOString(),
        ...body,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!forwarded.ok) {
      console.error('Quote webhook forward failed', forwarded.status, await forwarded.text())
      return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Quote webhook forward errored', error)
    return NextResponse.json({ ok: false, reason: 'forward_errored' }, { status: 502 })
  }
}
