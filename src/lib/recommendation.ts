import type { AssessmentAnswers } from './assessment/types'
import {
  issueOptions,
  needOptions,
  primaryGoalOptions,
  projectStageOptions,
  propertyTypeOptions,
  solarGoalOptions,
} from './assessment/steps'

export type RecommendationResult = {
  serviceSlug: string
  headline: string
  reasoning: string[]
}

function labelFor(options: { value: string; label: string }[], value?: string): string | undefined {
  return options.find((o) => o.value === value)?.label
}

/**
 * Pure rule-based recommendation engine. Rule order is significant — see
 * docs/assessment-platform-architecture.md section D for the full table.
 * Every branch builds `reasoning` from the customer's actual answers so
 * `/assessment/result` can show a genuine "why we recommend this."
 */
export function recommendService(answers: AssessmentAnswers): RecommendationResult {
  const propertyLabel = labelFor(propertyTypeOptions, answers.propertyType)
  const needLabel = labelFor(needOptions, answers.need)

  const isEmergency =
    answers.urgency === 'emergency' || answers.issue === 'burning-smell' || answers.issue === 'sparks'

  if (isEmergency) {
    return {
      serviceSlug: 'emergency-electrical-response',
      headline: 'Emergency Electrical Response',
      reasoning: [
        'What you\'ve described is a safety concern that needs an immediate response, not a scheduled assessment.',
      ],
    }
  }

  if (answers.need === 'not-sure') {
    return {
      serviceSlug: 'electrical-site-assessment',
      headline: 'Professional Electrical Assessment',
      reasoning: [
        'You told us you\'re not sure which service is right — a professional assessment is the right starting point so an engineer can diagnose the situation before recommending a scope.',
      ],
    }
  }

  if (answers.need === 'solar') {
    const goalLabel = labelFor(solarGoalOptions, answers.solarGoal)
    if (answers.solarGoal === 'inverter-fault') {
      return {
        serviceSlug: 'solar-inverter-systems',
        headline: 'Solar/Inverter Diagnostic Assessment',
        reasoning: [
          'You told us your existing inverter needs troubleshooting — a diagnostic visit lets our engineer trace the fault before recommending a repair.',
        ],
      }
    }
    return {
      serviceSlug: 'solar-inverter-systems',
      headline: 'Solar & Inverter Site Assessment',
      reasoning: [
        goalLabel
          ? `You told us your goal is "${goalLabel}" — solar and inverter systems need to be sized against your actual consumption, not a generic package.`
          : 'Solar and inverter systems need to be sized against your actual consumption, not a generic package.',
      ],
    }
  }

  if (answers.need === 'repair') {
    const issueLabel = labelFor(issueOptions, answers.issue)
    if (answers.propertyType === 'industrial') {
      return {
        serviceSlug: 'industrial-electrical-systems',
        headline: 'Industrial Electrical Assessment',
        reasoning: [
          'This is an industrial facility, so we recommend an industrial electrical assessment — faults on three-phase and factory-floor systems carry different stakes than residential work.',
        ],
      }
    }
    return {
      serviceSlug: 'fault-finding-diagnostics',
      headline: 'Electrical Fault Diagnosis',
      reasoning: [
        issueLabel
          ? `You told us: "${issueLabel}" — this needs systematic fault tracing with proper test equipment before any repair work.`
          : 'This needs systematic fault tracing with proper test equipment before any repair work.',
      ],
    }
  }

  if (answers.need === 'installation') {
    if (answers.projectStage === 'new-construction') {
      return {
        serviceSlug: 'electrical-wiring-installation',
        headline: 'Electrical Design & Installation Assessment',
        reasoning: [
          'This is new construction — a design and installation assessment sizes the electrical system correctly for the finished building rather than retrofitting afterwards.',
        ],
      }
    }
    const isLargeCommercialOrIndustrial =
      (answers.propertyType === 'commercial' || answers.propertyType === 'industrial') &&
      ['large-commercial', 'large-facility', 'office-complex', 'factory', 'manufacturing-plant'].includes(
        answers.projectSize ?? '',
      )
    if (isLargeCommercialOrIndustrial) {
      const slug = answers.propertyType === 'industrial' ? 'industrial-electrical-systems' : 'commercial-office-fitout'
      return {
        serviceSlug: slug,
        headline:
          answers.propertyType === 'industrial'
            ? 'Industrial Electrical Design & Project Assessment'
            : 'Commercial Electrical Design & Project Assessment',
        reasoning: [
          `A ${propertyLabel?.toLowerCase() ?? 'commercial'} project of this size needs a project-level assessment to scope power distribution before design work starts.`,
        ],
      }
    }
    return {
      serviceSlug: 'electrical-wiring-installation',
      headline: 'Electrical Design & Installation Assessment',
      reasoning: [
        needLabel
          ? `You told us you need ${needLabel.toLowerCase()} — an installation assessment lets us design the circuits correctly before work starts.`
          : 'An installation assessment lets us design the circuits correctly before work starts.',
      ],
    }
  }

  if (answers.need === 'home-automation') {
    return {
      serviceSlug: 'home-automation',
      headline: 'Home Automation Assessment',
      reasoning: ['Automation is planned into the electrical circuits from the start for a reliable result — this assessment scopes your space.'],
    }
  }

  if (answers.need === 'cctv-security') {
    return {
      serviceSlug: 'cctv-surveillance',
      headline: 'CCTV & Security Systems Assessment',
      reasoning: ['A surveillance system is only as reliable as the electrical and network infrastructure behind it — this assessment covers that scope.'],
    }
  }

  if (answers.need === 'commercial-industrial') {
    const slug = answers.propertyType === 'industrial' ? 'industrial-electrical-systems' : 'commercial-office-fitout'
    return {
      serviceSlug: slug,
      headline: 'Commercial/Industrial Electrical Assessment',
      reasoning: ['Commercial and industrial electrical work is scoped against your facility and build programme before any design work starts.'],
    }
  }

  if (answers.need === 'maintenance') {
    return {
      serviceSlug: 'preventive-maintenance-contracts',
      headline: 'Preventive Electrical Maintenance Assessment',
      reasoning: ['A maintenance assessment scopes a contract around your property\'s actual condition and risk areas, rather than a one-size-fits-all schedule.'],
    }
  }

  if (answers.need === 'inspection' || answers.primaryGoal === 'improve-safety') {
    return {
      serviceSlug: 'fault-finding-diagnostics',
      headline: 'Electrical Safety Inspection',
      reasoning: ['You\'re looking for inspection, testing, or improved safety — this is best served by a safety inspection with proper test equipment.'],
    }
  }

  if (answers.need === 'design-consultancy') {
    return {
      serviceSlug: 'electrical-site-assessment',
      headline: 'Electrical Design & Consultancy Assessment',
      reasoning: ['Engineering advice is most useful once an engineer has seen the site — this assessment is the starting point for design consultancy.'],
    }
  }

  if (answers.projectStage === 'existing-property' && answers.primaryGoal === 'upgrade') {
    return {
      serviceSlug: 'panel-repair-upgrades',
      headline: 'Electrical Inspection & Upgrade Assessment',
      reasoning: ['This is an existing property and your goal is an upgrade — an inspection first confirms the current condition and capacity before we scope the upgrade.'],
    }
  }

  return {
    serviceSlug: 'electrical-site-assessment',
    headline: 'Electrical Site Assessment',
    reasoning: [
      'Based on the information you\'ve provided, a professional assessment is the best next step. Our engineer will evaluate the existing installation, identify the requirements, and recommend the appropriate solution.',
    ],
  }
}

export function projectStageLabel(value?: string): string | undefined {
  return labelFor(projectStageOptions, value)
}

export function primaryGoalLabel(value?: string): string | undefined {
  return labelFor(primaryGoalOptions, value)
}
