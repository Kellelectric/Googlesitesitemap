import { describe, expect, it } from 'vitest'
import { buildWhatsAppBookingMessage, buildWhatsAppUrl } from './whatsapp'

describe('buildWhatsAppBookingMessage', () => {
  it('includes all provided fields in a readable order', () => {
    const message = buildWhatsAppBookingMessage({
      name: 'Ada Obi',
      service: 'Electrical Site Assessment',
      propertyType: 'Residential',
      location: 'Maitama, Abuja',
      preferredDate: '2026-08-20',
      preferredTime: '10:00',
      reference: 'KE-AB12CD',
    })
    expect(message).toContain('Ada Obi')
    expect(message).toContain('Electrical Site Assessment')
    expect(message).toContain('Residential')
    expect(message).toContain('Maitama, Abuja')
    expect(message).toContain('2026-08-20')
    expect(message).toContain('KE-AB12CD')
  })

  it('omits optional fields cleanly when not provided', () => {
    const message = buildWhatsAppBookingMessage({
      name: 'Ada Obi',
      service: 'Electrical Fault Diagnosis',
      location: 'Wuse, Abuja',
      reference: 'KE-XYZ999',
    })
    expect(message).not.toContain('undefined')
    expect(message).not.toContain('Preferred date:')
  })
})

describe('buildWhatsAppUrl', () => {
  it('strips non-digit characters from the phone number', () => {
    const url = buildWhatsAppUrl('+234 814 020 5895', 'hello')
    expect(url).toBe('https://wa.me/2348140205895?text=hello')
  })

  it('URL-encodes the message body', () => {
    const url = buildWhatsAppUrl('2348140205895', 'Line one\nLine two & more')
    expect(url).toContain('https://wa.me/2348140205895?text=')
    expect(url).not.toContain('\n')
    expect(url).not.toContain(' ')
  })
})
