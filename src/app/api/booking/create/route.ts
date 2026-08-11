import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookingSchema } from '@/lib/validation/booking'
import { createAppointment, SlotUnavailableError } from '@/lib/booking'
import { generateReference } from '@/lib/reference'
import { sendEmail } from '@/lib/email'
import { bookingRequestedEmail } from '@/lib/emailTemplates'
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit'
import { scoreLead } from '@/lib/leadScore'

export const runtime = 'nodejs'

const CONTACT_ENUM: Record<string, string> = { phone: 'PHONE', whatsapp: 'WHATSAPP', email: 'EMAIL' }

export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKeyFromRequest(request, 'booking-create'), 10, 60_000)
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload', issues: parsed.error.issues }, { status: 422 })
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, reference: generateReference('APT') })
  }

  const service = await db.service.findUnique({ where: { slug: parsed.data.serviceSlug } })
  if (!service || !service.active || !service.bookable) {
    return NextResponse.json({ ok: false, reason: 'unknown_service' }, { status: 404 })
  }

  let leadId = parsed.data.leadId
  if (!leadId) {
    if (!parsed.data.contact || !parsed.data.location) {
      return NextResponse.json({ ok: false, reason: 'contact_required' }, { status: 422 })
    }
    const { score, category } = scoreLead({ need: 'direct-booking' as never, propertyType: undefined, urgency: undefined })
    const lead = await db.lead.create({
      data: {
        reference: generateReference('KE'),
        name: parsed.data.contact.name,
        phone: parsed.data.contact.phone,
        whatsapp: parsed.data.contact.whatsapp || null,
        email: parsed.data.contact.email || null,
        company: parsed.data.contact.company || null,
        preferredContact: CONTACT_ENUM[parsed.data.contact.preferredContact] as never,
        need: 'direct-booking',
        propertyType: 'other',
        location: parsed.data.location as never,
        urgency: 'WITHIN_2_WEEKS',
        additionalInfo: parsed.data.notes || null,
        recommendedServiceId: service.id,
        recommendationReasons: ['Customer booked this service directly, without the guided assessment.'],
        score,
        scoreCategory: category,
        source: 'direct-booking',
      },
    })
    leadId = lead.id
  }

  try {
    const appointment = await createAppointment({
      leadId,
      serviceSlug: parsed.data.serviceSlug,
      appointmentType: parsed.data.appointmentType,
      date: parsed.data.date,
      time: parsed.data.time,
    })

    const lead = await db.lead.findUnique({ where: { id: leadId } })
    if (lead?.email) {
      const email = bookingRequestedEmail({
        name: lead.name,
        service: service.name,
        date: parsed.data.date,
        time: parsed.data.time,
        reference: appointment.reference,
      })
      await sendEmail({ to: lead.email, ...email, type: 'booking_requested', relatedLeadId: leadId })
    }

    return NextResponse.json({
      ok: true,
      reference: appointment.reference,
      appointmentId: appointment.id,
      service: { name: service.name },
      startsAt: appointment.startsAt,
    })
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return NextResponse.json({ ok: false, reason: 'slot_unavailable' }, { status: 409 })
    }
    console.error('Booking creation failed', error)
    return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 })
  }
}
