import { describe, expect, it } from 'vitest'
import { assessmentSubmitSchema, emergencySubmitSchema } from './assessment'

const validAnswers = {
  need: 'repair',
  propertyType: 'residential',
  issue: 'frequent-tripping',
  urgency: 'within-48h',
  location: { city: 'Abuja', area: 'Maitama' },
  contact: { name: 'Ada Obi', phone: '+2348140205895', preferredContact: 'phone' as const },
}

describe('assessmentSubmitSchema', () => {
  it('accepts a minimal valid payload', () => {
    const result = assessmentSubmitSchema.safeParse({ answers: validAnswers })
    expect(result.success).toBe(true)
  })

  it('rejects a payload missing required contact fields', () => {
    const result = assessmentSubmitSchema.safeParse({
      answers: { ...validAnswers, contact: { name: 'Ada Obi', preferredContact: 'phone' } },
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid phone number', () => {
    const result = assessmentSubmitSchema.safeParse({
      answers: { ...validAnswers, contact: { ...validAnswers.contact, phone: 'not-a-phone' } },
    })
    expect(result.success).toBe(false)
  })

  it('rejects a payload with a filled honeypot field', () => {
    const result = assessmentSubmitSchema.safeParse({ answers: validAnswers, website: 'http://spam.example' })
    expect(result.success).toBe(false)
  })

  it('rejects a location missing the required area', () => {
    const result = assessmentSubmitSchema.safeParse({
      answers: { ...validAnswers, location: { city: 'Abuja' } },
    })
    expect(result.success).toBe(false)
  })
})

describe('emergencySubmitSchema', () => {
  it('accepts a minimal valid emergency payload', () => {
    const result = emergencySubmitSchema.safeParse({
      name: 'Ada Obi',
      phone: '+2348140205895',
      location: { city: 'Abuja', area: 'Wuse' },
      issueDescription: 'Sparks from the distribution board.',
      preferredContact: 'phone',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an issue description that is too short to be useful', () => {
    const result = emergencySubmitSchema.safeParse({
      name: 'Ada Obi',
      phone: '+2348140205895',
      location: { city: 'Abuja', area: 'Wuse' },
      issueDescription: 'ok',
      preferredContact: 'phone',
    })
    expect(result.success).toBe(false)
  })
})
