// Sends an internal WhatsApp notification for every quote request,
// appointment booking, and career application, via the WhatsApp Business
// Cloud API (Meta) - the same "someone on the team should know a lead just
// came in" role Slack already plays for careers, on a channel this
// business's team plausibly already lives on day-to-day (see
// company.whatsappHref sitewide). Independent of Slack/Resend/Zoho CRM -
// each fires on its own, gated on its own env vars, and a failure here
// never blocks or slows down the visitor's own submission response.
//
// UNLIKE THE SITE'S OTHER SELF-SERVE INTEGRATIONS, this one has one
// external-approval step - see #2 below - though it's a same-day Meta
// review, not the open-ended manual process Google Business Profile API
// access requires.
//
// Setup (all in Meta's own consoles, not this repo):
// 1. developers.facebook.com -> create an app -> add the "WhatsApp"
//    product. Under WhatsApp > API Setup, either use the built-in test
//    number to start, or add/verify the business's own WhatsApp number.
//    Then generate a PERMANENT access token (the default one shown in API
//    Setup expires in 24h): Meta Business Settings -> Users -> System
//    Users -> create one -> assign it the app with "Manage" permission on
//    WhatsApp -> Generate Token (no expiry).
// 2. WhatsApp requires an approved MESSAGE TEMPLATE for any
//    business-initiated message sent outside a 24-hour customer-initiated
//    conversation window - which this always is, since the visitor never
//    messaged the business's WhatsApp number first. Meta Business Manager
//    -> WhatsApp Manager -> Message Templates -> create one, category
//    "Utility", with exactly ONE body variable so this file never needs
//    updating if the wording changes later, e.g.:
//      "New lead from the website: {{1}}"
//    Approval is typically automatic or within a few hours. Name it
//    whatever WHATSAPP_TEMPLATE_NAME below is set to (e.g.
//    "website_lead_alert").
// 3. Set:
//      WHATSAPP_ACCESS_TOKEN    - the permanent System User token
//      WHATSAPP_PHONE_NUMBER_ID - from WhatsApp > API Setup (the sending
//                                 number's ID, not the phone number itself)
//      WHATSAPP_NOTIFY_TO       - the team's own WhatsApp number to notify,
//                                 E.164 digits only, no leading "+" or
//                                 spaces (e.g. 2348140205895)
//      WHATSAPP_TEMPLATE_NAME   - the approved template's name
//      WHATSAPP_TEMPLATE_LANG   - optional, defaults to "en_US" - must
//                                 match the template's approved language
export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_NOTIFY_TO &&
      process.env.WHATSAPP_TEMPLATE_NAME,
  )
}

export type WhatsAppNotification = {
  // Single line, becomes the approved template's one {{1}} body variable -
  // deliberately just one field (see #2 above) so this integration never
  // needs a template edit/re-approval to change what the message says.
  summary: string
}

// Best-effort - throws on failure so the caller decides how to log/ignore
// it; never blocks the visitor's own submission response (see each call
// site's fire-and-forget .catch()).
export async function sendWhatsAppNotification(input: WhatsAppNotification): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const to = process.env.WHATSAPP_NOTIFY_TO
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME
  if (!token || !phoneNumberId || !to || !templateName) {
    throw new Error('WhatsApp env vars not fully set')
  }
  const language = process.env.WHATSAPP_TEMPLATE_LANG || 'en_US'

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: language },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: input.summary }],
          },
        ],
      },
    }),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`WhatsApp send failed (${res.status}): ${text}`)
  }
}
