export type WhatsAppBookingMessageInput = {
  name: string
  service: string
  propertyType?: string
  location: string
  preferredDate?: string
  preferredTime?: string
  reference: string
}

export function buildWhatsAppBookingMessage(input: WhatsAppBookingMessageInput): string {
  const lines = [
    'Hello Kell Electricals,',
    '',
    `I would like to book ${input.service}.`,
    '',
    `Name: ${input.name}`,
    `Service: ${input.service}`,
  ]
  if (input.propertyType) lines.push(`Property: ${input.propertyType}`)
  lines.push(`Location: ${input.location}`)
  if (input.preferredDate) lines.push(`Preferred date: ${input.preferredDate}`)
  if (input.preferredTime) lines.push(`Preferred time: ${input.preferredTime}`)
  lines.push(`Assessment reference: ${input.reference}`, '', 'Thank you.')
  return lines.join('\n')
}

export function buildWhatsAppUrl(phoneNumberE164Digits: string, message: string): string {
  const digits = phoneNumberE164Digits.replace(/[^0-9]/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
