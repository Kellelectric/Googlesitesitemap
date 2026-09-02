import { NextRequest, NextResponse } from 'next/server'
import { createHmac, randomUUID } from 'node:crypto'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import { verifyHCaptcha } from '@/lib/hcaptcha'

export const runtime = 'nodejs'

// A short, human-readable reference shown to the customer and included in
// the forwarded webhook payload, so a phone/WhatsApp follow-up can locate
// the same enquiry Zoho Flow received. Not a database key — just a
// display/reference string, safe to generate per-request.
function generateEnquiryReference(): string {
  const year = new Date().getFullYear()
  const suffix = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `KE-${year}-${suffix}`
}

// Lets the receiving end (Zoho Flow, or whatever QUOTE_WEBHOOK_URL points
// at) verify a forwarded request actually came from this server, not from
// someone who obtained the webhook URL. Optional: only signs when
// QUOTE_WEBHOOK_SECRET is configured, so this doesn't break an existing
// webhook set up before this was added.
function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

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
  captchaToken?: string // hCaptcha response token, only present when configured
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

  // hCaptcha: only enforced once a real secret key is configured, so this
  // stays a no-op (form works exactly as before) until then.
  const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY
  if (hcaptchaSecret) {
    const token = typeof body.captchaToken === 'string' ? body.captchaToken : ''
    if (!token || !(await verifyHCaptcha(token, hcaptchaSecret))) {
      return NextResponse.json({ ok: false, reason: 'captcha_failed' }, { status: 422 })
    }
  }

  const webhookUrl = process.env.QUOTE_WEBHOOK_URL
  if (!webhookUrl) {
    console.error(
      'QUOTE_WEBHOOK_URL is not configured - quote request was received but not forwarded anywhere.',
    )
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  const reference = generateEnquiryReference()
  const payload = JSON.stringify({
    reference,
    source: 'kellelectricals.com quote form',
    submittedAt: new Date().toISOString(),
    ...body,
  })
  const secret = process.env.QUOTE_WEBHOOK_SECRET
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (secret) {
    headers['x-webhook-signature'] = signPayload(payload, secret)
  }

  // One retry on a transient failure (timeout, network error, or a 5xx from
  // the receiving end) before giving up — a single dropped connection to
  // Zoho Flow shouldn't lose a lead. A 4xx is not retried: that means the
  // webhook itself rejected the payload, and retrying an identical request
  // would just fail the same way.
  const maxAttempts = 2
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const forwarded = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: payload,
        signal: AbortSignal.timeout(8000),
      })

      if (forwarded.ok) {
        return NextResponse.json({ ok: true, reference })
      }

      const responseText = await forwarded.text()
      console.error('Quote webhook forward failed', forwarded.status, responseText)
      if (forwarded.status < 500 || attempt === maxAttempts) {
        return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
      }
    } catch (error) {
      lastError = error
      console.error(`Quote webhook forward errored (attempt ${attempt}/${maxAttempts})`, error)
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  if (lastError) {
    return NextResponse.json({ ok: false, reason: 'forward_errored' }, { status: 502 })
  }
  return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
}
