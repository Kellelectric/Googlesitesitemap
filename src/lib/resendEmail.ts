// Sends career-application emails via the Resend API (plain fetch, no
// SDK dependency - same hand-rolled-REST style as googleCalendar.ts and
// zohoCrm.ts). Two emails, matching the templates already drafted in
// docs/careers-automation.md: an applicant confirmation and an internal
// notification to the hiring team.
//
// Setup: create a Resend account, verify the sending domain (or use
// Resend's own onboarding@resend.dev for testing), create an API key,
// then set:
//   RESEND_API_KEY
//   CAREERS_FROM_EMAIL   - verified sender, e.g. careers@kellelectricals.com
//   CAREERS_NOTIFY_EMAIL - internal recipient for new-application alerts
import { company } from '@/content/company'

const RESEND_API_URL = 'https://api.resend.com/emails'

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CAREERS_FROM_EMAIL)
}

export function isCareerNotifyEmailConfigured(): boolean {
  return isResendConfigured() && Boolean(process.env.CAREERS_NOTIFY_EMAIL)
}

type CareerEmailInput = {
  reference: string
  trackName: string
  fullName: string
  email: string
  phone: string
  courseOrInstitution?: string
  roleAppliedFor?: string
  cvLink?: string
  message: string
  submittedAt: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function sendEmail(payload: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CAREERS_FROM_EMAIL
  if (!apiKey || !from) throw new Error('RESEND_API_KEY / CAREERS_FROM_EMAIL not set')

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${company.name} <${from}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend send failed (${res.status}): ${text}`)
  }
}

// Wording matches docs/careers-automation.md's drafted applicant-
// confirmation copy exactly - no employment/acceptance/response-time
// promises, per that doc's own caution note.
export async function sendApplicantConfirmationEmail(input: CareerEmailInput): Promise<void> {
  const html = `
    <p>Thank you for your interest in joining ${escapeHtml(company.name)}. Your application for <strong>${escapeHtml(input.trackName)}</strong> has been received and is now under review.</p>
    <p><strong>Reference:</strong> ${escapeHtml(input.reference)}</p>
    <p>Our team reviews applications directly - not an automated filter. If your background fits what we're looking for, we'll follow up by phone or email.</p>
    <p>Questions? Call ${escapeHtml(company.phone)} or reply to this email.</p>
    <p>— ${escapeHtml(company.name)}</p>
  `.trim()

  await sendEmail({
    to: input.email,
    subject: `${company.name} — Application Received | ${input.reference}`,
    html,
  })
}

export async function sendInternalNotificationEmail(input: CareerEmailInput): Promise<void> {
  const notifyEmail = process.env.CAREERS_NOTIFY_EMAIL
  if (!notifyEmail) throw new Error('CAREERS_NOTIFY_EMAIL not set')

  const rows: Array<[string, string | undefined]> = [
    ['Reference', input.reference],
    ['Programme', input.trackName],
    ['Applicant', input.fullName],
    ['Email', input.email],
    ['Phone', input.phone],
    ['Institution/Course', input.courseOrInstitution],
    ['Role', input.roleAppliedFor],
    ['Submitted', input.submittedAt],
    ['CV', input.cvLink],
  ]

  const html = `
    <h2>New career application</h2>
    <table cellpadding="4" cellspacing="0">
      ${rows
        .filter(([, value]) => value)
        .map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value!)}</td></tr>`)
        .join('\n')}
    </table>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(input.message).replace(/\n/g, '<br>')}</p>
  `.trim()

  await sendEmail({
    to: notifyEmail,
    subject: `New career application — ${input.trackName} (${input.reference})`,
    html,
  })
}
