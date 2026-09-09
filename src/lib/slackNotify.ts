// Posts a formatted message to a Slack Incoming Webhook - the simplest
// Slack integration (no bot token, no app install beyond the webhook
// itself). Setup: Slack -> Apps -> "Incoming Webhooks" -> Add to Slack ->
// pick a channel -> copy the generated URL into CAREERS_SLACK_WEBHOOK_URL.
export function isSlackNotifyConfigured(): boolean {
  return Boolean(process.env.CAREERS_SLACK_WEBHOOK_URL)
}

export type CareerSlackNotification = {
  reference: string
  trackName: string
  fullName: string
  email: string
  phone: string
  roleAppliedFor?: string
  cvLink?: string
}

// Best-effort - throws on failure so the caller decides how to log/ignore
// it; never blocks the applicant's own submission response.
export async function sendCareerSlackNotification(input: CareerSlackNotification): Promise<void> {
  const webhookUrl = process.env.CAREERS_SLACK_WEBHOOK_URL
  if (!webhookUrl) throw new Error('CAREERS_SLACK_WEBHOOK_URL not set')

  const lines = [
    `*New career application* — ${input.trackName}`,
    `*Reference:* ${input.reference}`,
    `*Name:* ${input.fullName}`,
    `*Email:* ${input.email}`,
    `*Phone:* ${input.phone}`,
    input.roleAppliedFor ? `*Role:* ${input.roleAppliedFor}` : null,
    input.cvLink ? `*CV:* ${input.cvLink}` : null,
  ].filter((line): line is string => line !== null)

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lines.join('\n') }),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Slack webhook forward failed (${res.status}): ${text}`)
  }
}
