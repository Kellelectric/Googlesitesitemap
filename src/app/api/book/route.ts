import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import { verifyHCaptcha } from '@/lib/hcaptcha'
import { createCalendarEvent, getBusyPeriods, isCalendarConfigured } from '@/lib/googleCalendar'
import { computeAvailableSlots, isDateBookable, localSlotToDate, SLOT_MINUTES } from '@/lib/bookingSlots'

export const runtime = 'nodejs'

function generateBookingReference(): string {
  const year = new Date().getFullYear()
  const suffix = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `KE-APPT-${year}-${suffix}`
}

type BookingPayload = {
  name: string
  phone: string
  email: string
  address: string
  notes?: string
  date: string // YYYY-MM-DD, Africa/Lagos
  time: string // HH:mm, Africa/Lagos
  website?: string // honeypot — real users never fill this in
  renderedAt?: number
  captchaToken?: string
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidPayload(body: unknown): body is BookingPayload {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    typeof b.name === 'string' &&
    b.name.trim().length > 0 &&
    typeof b.phone === 'string' &&
    /^[+0-9\s()-]{7,}$/.test(b.phone.trim()) &&
    typeof b.email === 'string' &&
    EMAIL_RE.test(b.email.trim()) &&
    typeof b.address === 'string' &&
    b.address.trim().length > 0 &&
    typeof b.date === 'string' &&
    DATE_RE.test(b.date) &&
    typeof b.time === 'string' &&
    TIME_RE.test(b.time)
  )
}

const MIN_SUBMIT_SECONDS = 3
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })

// Creates a real event on the business's Google Calendar for a slot the
// visitor picked on /book-appointment - see lib/googleCalendar.ts for the
// service-account setup this depends on, and lib/bookingSlots.ts for how
// slots are generated from company.businessHours. Inert (503
// not_configured) until GOOGLE_CALENDAR_* env vars are set.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  if (!isCalendarConfigured()) {
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
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
    if (!token || !(await verifyHCaptcha(token, hcaptchaSecret))) {
      return NextResponse.json({ ok: false, reason: 'captcha_failed' }, { status: 422 })
    }
  }

  if (!isDateBookable(body.date)) {
    return NextResponse.json({ ok: false, reason: 'date_closed' }, { status: 422 })
  }

  try {
    // Re-check the calendar's real availability right before booking,
    // not just trusting whatever the visitor's browser last fetched -
    // closes the race window between two people viewing the same open
    // slot and one of them being seconds slower to submit.
    const dayStart = localSlotToDate(body.date, 0).toISOString()
    const dayEnd = localSlotToDate(body.date, 24 * 60).toISOString()
    const busy = await getBusyPeriods(dayStart, dayEnd)
    const stillAvailable = computeAvailableSlots(body.date, busy).includes(body.time)
    if (!stillAvailable) {
      return NextResponse.json({ ok: false, reason: 'slot_taken' }, { status: 409 })
    }

    const [hour, minute] = body.time.split(':').map(Number)
    const startDate = localSlotToDate(body.date, hour * 60 + minute)
    const endDate = new Date(startDate.getTime() + SLOT_MINUTES * 60 * 1000)

    const reference = generateBookingReference()
    const descriptionLines = [
      `Reference: ${reference}`,
      `Phone: ${body.phone}`,
      `Email: ${body.email}`,
      `Address: ${body.address}`,
      body.notes ? `Notes: ${body.notes}` : null,
      'Booked via kellelectricals.com',
    ].filter((line): line is string => line !== null)

    const event = await createCalendarEvent({
      startIso: startDate.toISOString(),
      endIso: endDate.toISOString(),
      summary: `Appointment - ${body.name}`,
      description: descriptionLines.join('\n'),
      attendeeEmail: body.email,
    })

    // Best-effort: also forward to the same lead webhook quote requests
    // use, so bookings show up alongside quotes in whatever CRM
    // QUOTE_WEBHOOK_URL points at. Never blocks or fails the booking
    // itself - the calendar event is the source of truth here.
    const webhookUrl = process.env.QUOTE_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          source: 'kellelectricals.com appointment booking',
          submittedAt: new Date().toISOString(),
          name: body.name,
          phone: body.phone,
          email: body.email,
          address: body.address,
          notes: body.notes,
          appointmentDate: body.date,
          appointmentTime: body.time,
          calendarEventId: event.id,
        }),
        signal: AbortSignal.timeout(8000),
      }).catch((error) => console.error('Booking webhook forward failed (non-fatal)', error))
    }

    return NextResponse.json({ ok: true, reference })
  } catch (error) {
    console.error('Booking failed', error)
    return NextResponse.json({ ok: false, reason: 'booking_failed' }, { status: 502 })
  }
}
