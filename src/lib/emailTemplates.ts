import { company } from '@/content/company'

function shell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F7F5F0;font-family:Helvetica,Arial,sans-serif;color:#0E1712;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background:#FFFFFF;border-radius:4px;overflow:hidden;">
            <tr>
              <td style="background:#13322C;padding:24px 32px;">
                <span style="color:#F7F5F0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;">${company.name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="font-size:20px;margin:0 0 16px;color:#13322C;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;border-top:1px solid #ECEAE4;">
                <p style="font-size:12px;color:#5E625F;margin:0;">${company.name} · ${company.address.full}<br/>${company.phone} · ${company.email}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function assessmentReceivedEmail(params: { name: string; recommendedService: string; reference: string }) {
  const html = shell(
    'We’ve received your assessment',
    `<p style="font-size:15px;line-height:1.6;">Thank you, ${params.name}. Based on what you told us, we recommend <strong>${params.recommendedService}</strong>.</p>
     <p style="font-size:15px;line-height:1.6;">Reference: <strong>${params.reference}</strong></p>
     <p style="font-size:15px;line-height:1.6;">We’ll contact you using your preferred contact method to confirm next steps.</p>`,
  )
  return { subject: `Your electrical assessment — ${params.reference}`, html }
}

export function bookingRequestedEmail(params: {
  name: string
  service: string
  date: string
  time: string
  reference: string
}) {
  const html = shell(
    'Your request is with our team',
    `<p style="font-size:15px;line-height:1.6;">Thank you, ${params.name}. We’ve received your request for <strong>${params.service}</strong>.</p>
     <p style="font-size:15px;line-height:1.6;">Preferred date: <strong>${params.date}</strong><br/>Preferred time: <strong>${params.time}</strong></p>
     <p style="font-size:15px;line-height:1.6;">Reference: <strong>${params.reference}</strong></p>
     <p style="font-size:15px;line-height:1.6;">We’ll contact you using your preferred contact method to confirm the appointment.</p>`,
  )
  return { subject: `Booking request received — ${params.reference}`, html }
}

export function internalNewLeadEmail(params: {
  reference: string
  need: string
  urgency: string
  scoreCategory: string
  name: string
  phone: string
  location: string
}) {
  const html = shell(
    `New ${params.scoreCategory} lead`,
    `<p style="font-size:15px;line-height:1.6;">${params.name} · ${params.phone}<br/>
     Need: ${params.need}<br/>Urgency: ${params.urgency}<br/>Location: ${params.location}</p>
     <p style="font-size:15px;line-height:1.6;">Reference: <strong>${params.reference}</strong></p>`,
  )
  return { subject: `[${params.scoreCategory}] New lead — ${params.reference}`, html }
}

export function internalEmergencyEmail(params: { reference: string; name: string; phone: string; location: string; issue: string }) {
  const html = shell(
    'EMERGENCY request',
    `<p style="font-size:15px;line-height:1.6;color:#F06000;font-weight:bold;">Immediate response required.</p>
     <p style="font-size:15px;line-height:1.6;">${params.name} · ${params.phone}<br/>Location: ${params.location}</p>
     <p style="font-size:15px;line-height:1.6;">${params.issue}</p>
     <p style="font-size:15px;line-height:1.6;">Reference: <strong>${params.reference}</strong></p>`,
  )
  return { subject: `EMERGENCY — ${params.reference}`, html }
}
