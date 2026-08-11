import type { AssessmentAnswers } from './assessment/types'

export type ScoreCategory = 'HOT' | 'WARM' | 'STANDARD'

/**
 * Internal-only prioritization score — never shown to the customer. See
 * docs/assessment-platform-architecture.md section D for the point table.
 */
export function scoreLead(answers: AssessmentAnswers): { score: number; category: ScoreCategory } {
  let score = 0

  if (answers.urgency === 'emergency') score += 40
  if (answers.propertyType === 'industrial') score += 25
  if (answers.propertyType === 'commercial' || answers.propertyType === 'retail-hospitality') score += 20
  if (answers.projectStage === 'new-construction') score += 20
  if (answers.need === 'installation' && answers.installPlan === 'complete-installation') score += 20
  if (answers.need === 'solar' && (answers.solarGoal === 'new-solar' || answers.solarGoal === 'new-building-solar')) {
    score += 20
  }
  if (answers.need === 'design-consultancy') score += 15
  if (answers.need === 'maintenance' || answers.primaryGoal === 'ongoing-maintenance') score += 15
  if (['large-commercial', 'large-facility', 'office-complex', 'factory', 'manufacturing-plant', 'estate'].includes(answers.projectSize ?? '')) {
    score += 15
  }
  if (answers.urgency === 'today' || answers.urgency === 'within-48h') score += 15

  score = Math.min(score, 100)

  const category: ScoreCategory = score >= 60 ? 'HOT' : score >= 30 ? 'WARM' : 'STANDARD'
  return { score, category }
}
