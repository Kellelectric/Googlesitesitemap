import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type BookingPayload = {
  name: string
  company?: string
  phone: string
  email?: string
  engagementSlug: string
  siteAddress: string
  preferredDate: string // ISO date, yyyy-mm-dd
  preferredTimeSlotId: string
  notes?: string
  website?: string // honeypot — real users never fill this in
}

function isValidPayload(body: unknown): body is BookingPayload {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    typeof b.name === 'string' &&
    b.name.trim().length > 0 &&
    typeof b.phone === 'string' &&
    /^[+0-9\s()-]{7,}$/.test(b.phone.trim()) &&
    typeof b.engagementSlug === 'string' &&
    b.engagementSlug.trim().length > 0 &&
    typeof b.siteAddress === 'string' &&
    b.siteAddress.trim().length > 0 &&
    typeof b.preferredDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.preferredDate) &&
    typeof b.preferredTimeSlotId === 'string' &&
    b.preferredTimeSlotId.trim().length > 0
  )
}

// Forwards validated appointment requests to a configurable webhook.
// Reuses QUOTE_WEBHOOK_URL by default (same downstream destination as the
// quote form) unless a dedicated BOOKING_WEBHOOK_URL is set — either way
// the payload is tagged so the receiving system can route it separately.
export async function POST(request: NextRequest) {
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

  const webhookUrl = process.env.BOOKING_WEBHOOK_URL || process.env.QUOTE_WEBHOOK_URL
  if (!webhookUrl) {
    console.error(
      'BOOKING_WEBHOOK_URL / QUOTE_WEBHOOK_URL is not configured — booking request was received but not forwarded anywhere.',
    )
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  try {
    const forwarded = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'site_assessment_booking',
        source: 'kellelectricals.com booking form',
        submittedAt: new Date().toISOString(),
        ...body,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!forwarded.ok) {
      console.error('Booking webhook forward failed', forwarded.status, await forwarded.text())
      return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Booking webhook forward errored', error)
    return NextResponse.json({ ok: false, reason: 'forward_errored' }, { status: 502 })
  }
}
