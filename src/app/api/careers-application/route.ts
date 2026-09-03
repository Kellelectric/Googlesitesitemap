import { NextRequest, NextResponse } from 'next/server'
import { createHmac, randomUUID } from 'node:crypto'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import { verifyHCaptcha } from '@/lib/hcaptcha'
import { getCareerTrackBySlug } from '@/content/careers'

export const runtime = 'nodejs'

// Same short-reference pattern as app/api/quote/route.ts.
function generateApplicationReference(): string {
  const year = new Date().getFullYear()
  const suffix = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `KE-APP-${year}-${suffix}`
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

type ApplicationPayload = {
  trackSlug: string
  fullName: string
  email: string
  phone: string
  courseOrInstitution?: string
  roleAppliedFor?: string
  cvLink?: string
  message: string
  website?: string // honeypot
  renderedAt?: number
  captchaToken?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidPayload(body: unknown): body is ApplicationPayload {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    typeof b.trackSlug === 'string' &&
    b.trackSlug.trim().length > 0 &&
    typeof b.fullName === 'string' &&
    b.fullName.trim().length > 0 &&
    typeof b.email === 'string' &&
    EMAIL_RE.test(b.email.trim()) &&
    typeof b.phone === 'string' &&
    /^[+0-9\s()-]{7,}$/.test(b.phone.trim()) &&
    typeof b.message === 'string' &&
    b.message.trim().length > 0
  )
}

const MIN_SUBMIT_SECONDS = 3

const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })

// Forwards validated career applications to a configurable webhook (Zoho
// Flow, Zapier, Make, etc.) set via CAREERS_WEBHOOK_URL - same pattern as
// QUOTE_WEBHOOK_URL in app/api/quote/route.ts. No destination is hardcoded.
//
// This replaces the external "Apply via Google Form" redirect with an
// on-site form, but does NOT yet also submit into the client's existing
// Google Forms for each track - that requires the real field entry IDs
// from those forms (Google Forms → "Get pre-filled link"), which the
// client still needs to supply. See docs/next-steps.md.
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

  const track = getCareerTrackBySlug(body.trackSlug)
  if (!track) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload' }, { status: 422 })
  }

  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (typeof body.renderedAt === 'number') {
    const elapsedSeconds = (Date.now() - body.renderedAt) / 1000
    if (elapsedSeconds < MIN_SUBMIT_SECONDS) {
      return NextResponse.json({ ok: true })
    }
  }

  const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY
  if (hcaptchaSecret) {
    const token = typeof body.captchaToken === 'string' ? body.captchaToken : ''
    if (token && !(await verifyHCaptcha(token, hcaptchaSecret))) {
      return NextResponse.json({ ok: false, reason: 'captcha_failed' }, { status: 422 })
    }
  }

  const webhookUrl = process.env.CAREERS_WEBHOOK_URL
  if (!webhookUrl) {
    console.error(
      'CAREERS_WEBHOOK_URL is not configured - application was received but not forwarded anywhere.',
    )
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  const reference = generateApplicationReference()
  const payload = JSON.stringify({
    reference,
    source: 'kellelectricals.com careers application form',
    trackName: track.name,
    submittedAt: new Date().toISOString(),
    ...body,
  })
  const secret = process.env.CAREERS_WEBHOOK_SECRET
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (secret) {
    headers['x-webhook-signature'] = signPayload(payload, secret)
  }

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
      console.error('Careers webhook forward failed', forwarded.status, responseText)
      if (forwarded.status < 500 || attempt === maxAttempts) {
        return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
      }
    } catch (error) {
      lastError = error
      console.error(`Careers webhook forward errored (attempt ${attempt}/${maxAttempts})`, error)
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
