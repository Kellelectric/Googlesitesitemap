import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emergencySubmitSchema } from '@/lib/validation/assessment'
import { generateReference } from '@/lib/reference'
import { sendEmail } from '@/lib/email'
import { internalEmergencyEmail } from '@/lib/emailTemplates'
import { getSettings } from '@/lib/settings'
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit'

export const runtime = 'nodejs'

const CONTACT_ENUM: Record<string, string> = { phone: 'PHONE', whatsapp: 'WHATSAPP', email: 'EMAIL' }

export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKeyFromRequest(request, 'assessment-emergency'), 10, 60_000)
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  const parsed = emergencySubmitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload', issues: parsed.error.issues }, { status: 422 })
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, reference: generateReference('KE') })
  }

  const reference = generateReference('KE')
  const emergencyService = await db.service.findUnique({ where: { slug: 'emergency-electrical-response' } })

  const lead = await db.lead.create({
    data: {
      reference,
      name: parsed.data.name,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp || null,
      preferredContact: CONTACT_ENUM[parsed.data.preferredContact] as never,
      need: 'emergency',
      propertyType: 'other',
      location: parsed.data.location as never,
      urgency: 'EMERGENCY',
      additionalInfo: parsed.data.issueDescription,
      isEmergency: true,
      recommendedServiceId: emergencyService?.id,
      recommendationReasons: ['This is an immediate electrical safety concern requiring emergency response.'],
      score: 100,
      scoreCategory: 'HOT',
      source: 'assessment-emergency',
    },
  })

  await db.assessment.create({
    data: { leadId: lead.id, answers: { emergency: true } as never, completed: true, isEmergency: true },
  })

  const settings = await getSettings()
  const internal = internalEmergencyEmail({
    reference,
    name: parsed.data.name,
    phone: parsed.data.phone,
    location: `${parsed.data.location.area}, ${parsed.data.location.city}`,
    issue: parsed.data.issueDescription,
  })
  await sendEmail({ to: settings.notification_email, ...internal, type: 'internal_emergency', relatedLeadId: lead.id })

  return NextResponse.json({ ok: true, reference, leadId: lead.id, whatsappNumber: settings.whatsapp_number })
}
