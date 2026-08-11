import { db } from '@/lib/db'

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text?: string
  relatedLeadId?: string
  type: string
}

export interface EmailProvider {
  send(input: SendEmailInput): Promise<{ ok: boolean; error?: string }>
}

/** Default provider — logs the email and never fails a request because an
 * integration isn't configured yet. Swapped for Resend automatically once
 * RESEND_API_KEY is set (see sendEmail below). */
class ConsoleEmailProvider implements EmailProvider {
  async send(input: SendEmailInput) {
    console.log(`[email:${input.type}] to=${input.to} subject="${input.subject}"`)
    return { ok: true }
  }
}

class ResendEmailProvider implements EmailProvider {
  constructor(private apiKey: string) {}

  async send(input: SendEmailInput) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? 'Kell Electricals <no-reply@kellelectricals.com>',
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      })
      if (!response.ok) {
        return { ok: false, error: `Resend responded ${response.status}` }
      }
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'unknown error' }
    }
  }
}

function getProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY
  return apiKey ? new ResendEmailProvider(apiKey) : new ConsoleEmailProvider()
}

/** Sends an email via the configured provider and always records a
 * Notification row, so delivery is auditable even when the provider is the
 * console fallback. */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const provider = getProvider()
  const result = await provider.send(input)

  await db.notification.create({
    data: {
      type: input.type,
      channel: 'EMAIL',
      recipient: input.to,
      subject: input.subject,
      body: input.text ?? input.html,
      status: result.ok ? 'SENT' : 'FAILED',
      relatedLeadId: input.relatedLeadId,
    },
  })

  if (!result.ok) {
    console.error(`[email:${input.type}] failed to send to ${input.to}: ${result.error}`)
  }
}
