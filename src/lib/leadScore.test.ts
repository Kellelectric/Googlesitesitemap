import { describe, expect, it } from 'vitest'
import { scoreLead } from './leadScore'
import type { AssessmentAnswers } from './assessment/types'

describe('scoreLead', () => {
  it('never exposes a category above HOT for a maxed-out answer set, and caps at 100', () => {
    const { score, category } = scoreLead({
      urgency: 'emergency',
      propertyType: 'industrial',
      projectStage: 'new-construction',
      need: 'installation',
      installPlan: 'complete-installation',
      projectSize: 'factory',
    } as AssessmentAnswers)
    expect(score).toBeLessThanOrEqual(100)
    expect(category).toBe('HOT')
  })

  it('scores a minimal, low-urgency residential enquiry as STANDARD', () => {
    const { category } = scoreLead({
      urgency: 'planning-ahead',
      propertyType: 'residential',
      need: 'inspection',
    } as AssessmentAnswers)
    expect(category).toBe('STANDARD')
  })

  it('scores an empty answer set as STANDARD with zero score', () => {
    const { score, category } = scoreLead({} as AssessmentAnswers)
    expect(score).toBe(0)
    expect(category).toBe('STANDARD')
  })

  it('a commercial property with urgent timeline lands in WARM or HOT, never STANDARD', () => {
    const { category } = scoreLead({
      propertyType: 'commercial',
      urgency: 'today',
    } as AssessmentAnswers)
    expect(['WARM', 'HOT']).toContain(category)
  })
})
