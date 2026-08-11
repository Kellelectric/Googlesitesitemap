import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { assessmentSubmitSchema } from '@/lib/validation/assessment'
import { recommendService } from '@/lib/recommendation'
import { scoreLead } from '@/lib/leadScore'
import { generateReference } from '@/lib/reference'
import { sendEmail } from '@/lib/email'
import { assessmentReceivedEmail, internalNewLeadEmail } from '@/lib/emailTemplates'
import { getSettings } from '@/lib/settings'
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit'
import type { AssessmentAnswers } from '@/lib/assessment/types'
import { needOptions, urgencyOptions, propertyTypeOptions } from '@/lib/assessment/steps'

export const runtime = 'nodejs'

const URGENCY_ENUM: Record<string, string> = {
  emergency: 'EMERGENCY',
  today: 'TODAY',
  'within-48h': 'WITHIN_48H',
  'this-week': 'THIS_WEEK',
  'within-2-weeks': 'WITHIN_2_WEEKS',
  'planning-ahead': 'PLANNING_AHEAD',
}

const CONTACT_ENUM: Record<string, string> = { phone: 'PHONE', whatsapp: 'WHATSAPP', email: 'EMAIL' }

function labelFor(options: { value: string; label: string }[], value?: string) {
  return options.find((o) => o.value === value)?.label ?? value ?? ''
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKeyFromRequest(request, 'assessment-submit'), 10, 60_000)
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  const parsed = assessmentSubmitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload', issues: parsed.error.issues }, { status: 422 })
  }

  if (parsed.data.website) {
    // Honeypot tripped — pretend success, do nothing.
    return NextResponse.json({ ok: true, reference: generateReference('KE') })
  }

  const answers = parsed.data.answers as AssessmentAnswers
  const recommendation = recommendService(answers)
  const { score, category } = scoreLead(answers)
  const reference = generateReference('KE')

  const service = await db.service.findUnique({ where: { slug: recommendation.serviceSlug } })

  const lead = await db.lead.create({
    data: {
      reference,
      name: answers.contact!.name,
      phone: answers.contact!.phone,
      whatsapp: answers.contact!.whatsapp || null,
      email: answers.contact!.email || null,
      company: answers.contact!.company || null,
      jobTitle: answers.contact!.jobTitle || null,
      preferredContact: CONTACT_ENUM[answers.contact!.preferredContact] as never,
      need: answers.need!,
      propertyType: answers.propertyType!,
      issueDetail: answers.issue || answers.installPlan || answers.solarGoal || null,
      location: answers.location as never,
      urgency: URGENCY_ENUM[answers.urgency!] as never,
      projectStage: answers.projectStage || null,
      projectSize: answers.projectSize || null,
      documentation: answers.documentation ?? [],
      primaryGoal: answers.primaryGoal || null,
      additionalInfo: answers.additionalInfo || null,
      isEmergency: false,
      recommendedServiceId: service?.id,
      recommendationReasons: recommendation.reasoning,
      score,
      scoreCategory: category,
      source: 'assessment',
      ...parsed.data.utm,
    },
  })

  const assessment = await db.assessment.create({
    data: {
      leadId: lead.id,
      answers: answers as never,
      completed: true,
    },
  })

  const answerRows = Object.entries(answers)
    .filter(([, value]) => value !== undefined)
    .map(([questionKey, answerValue]) => ({
      assessmentId: assessment.id,
      questionKey,
      answerValue: answerValue as never,
    }))
  if (answerRows.length > 0) {
    await db.assessmentAnswer.createMany({ data: answerRows })
  }

  const settings = await getSettings()

  if (answers.contact!.email) {
    const email = assessmentReceivedEmail({
      name: answers.contact!.name,
      recommendedService: service?.name ?? recommendation.headline,
      reference,
    })
    await sendEmail({ to: answers.contact!.email, ...email, type: 'assessment_received', relatedLeadId: lead.id })
  }

  const internal = internalNewLeadEmail({
    reference,
    need: labelFor(needOptions, answers.need),
    urgency: labelFor(urgencyOptions, answers.urgency),
    scoreCategory: category,
    name: answers.contact!.name,
    phone: answers.contact!.phone,
    location: `${answers.location!.area}, ${answers.location!.city}`,
  })
  await sendEmail({ to: settings.notification_email, ...internal, type: 'internal_new_lead', relatedLeadId: lead.id })

  return NextResponse.json({
    ok: true,
    reference,
    leadId: lead.id,
    assessmentId: assessment.id,
    recommendation: {
      ...recommendation,
      propertyTypeLabel: labelFor(propertyTypeOptions, answers.propertyType),
    },
    service: service
      ? {
          slug: service.slug,
          name: service.name,
          description: service.description,
          included: service.included,
          priceFromNgn: service.priceFromNgn,
          inspectionFeeNgn: service.inspectionFeeNgn,
          durationMinutes: service.durationMinutes,
        }
      : null,
  })
}
