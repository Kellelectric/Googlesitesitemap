import { describe, expect, it } from 'vitest'
import { recommendService } from './recommendation'
import type { AssessmentAnswers } from './assessment/types'

describe('recommendService', () => {
  it('routes burning smell / sparks to emergency response even without urgency=emergency', () => {
    const result = recommendService({ need: 'repair', propertyType: 'residential', issue: 'burning-smell' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('emergency-electrical-response')
  })

  it('routes urgency=emergency to emergency response regardless of need', () => {
    const result = recommendService({ need: 'maintenance', urgency: 'emergency' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('emergency-electrical-response')
  })

  it('routes "not sure" to the generic professional assessment', () => {
    const result = recommendService({ need: 'not-sure' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('electrical-site-assessment')
  })

  it('routes solar + inverter-fault to the solar diagnostic path with matching reasoning', () => {
    const result = recommendService({ need: 'solar', solarGoal: 'inverter-fault' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('solar-inverter-systems')
    expect(result.headline).toContain('Diagnostic')
  })

  it('routes industrial repair to the industrial assessment, not generic fault finding', () => {
    const result = recommendService({ need: 'repair', propertyType: 'industrial', issue: 'frequent-tripping' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('industrial-electrical-systems')
  })

  it('routes residential repair to fault-finding-diagnostics and includes the stated issue in reasoning', () => {
    const result = recommendService({ need: 'repair', propertyType: 'residential', issue: 'frequent-tripping' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('fault-finding-diagnostics')
    expect(result.reasoning.join(' ')).toContain('Frequent circuit breaker trips')
  })

  it('routes new-construction installation to the design & installation assessment', () => {
    const result = recommendService({
      need: 'installation',
      propertyType: 'residential',
      projectStage: 'new-construction',
    } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('electrical-wiring-installation')
    expect(result.headline).toContain('Design & Installation')
  })

  it('routes a large industrial installation to the industrial project assessment', () => {
    const result = recommendService({
      need: 'installation',
      propertyType: 'industrial',
      projectStage: 'existing-property',
      projectSize: 'factory',
    } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('industrial-electrical-systems')
  })

  it('routes maintenance need to the preventive maintenance assessment', () => {
    const result = recommendService({ need: 'maintenance' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('preventive-maintenance-contracts')
  })

  it('routes existing property + upgrade goal to panel repair & upgrades', () => {
    const result = recommendService({
      need: 'upgrade',
      projectStage: 'existing-property',
      primaryGoal: 'upgrade',
    } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('panel-repair-upgrades')
  })

  it('falls back to the generic site assessment when nothing more specific matches', () => {
    const result = recommendService({ need: 'upgrade', propertyType: 'residential' } as AssessmentAnswers)
    expect(result.serviceSlug).toBe('electrical-site-assessment')
  })

  it('always returns at least one reasoning sentence', () => {
    const result = recommendService({} as AssessmentAnswers)
    expect(result.reasoning.length).toBeGreaterThan(0)
  })
})
