import type { AssessmentAnswers } from './types'

export type Option = {
  value: string
  label: string
  description?: string
  icon?: string
}

export type StepDefinition = {
  key: string
  question: string
  supporting?: string
  kind: 'single-select' | 'multi-select' | 'form'
  options?: Option[]
  optionsFor?: (answers: AssessmentAnswers) => Option[]
  showIf?: (answers: AssessmentAnswers) => boolean
}

export const needOptions: Option[] = [
  { value: 'installation', label: 'Electrical Installation', description: 'New wiring, circuits, or a full build-out', icon: 'bolt' },
  { value: 'repair', label: 'Electrical Repair / Fault', description: 'Something isn’t working correctly', icon: 'wrench' },
  { value: 'inspection', label: 'Electrical Inspection & Testing', description: 'Condition checks, testing, certification', icon: 'search' },
  { value: 'maintenance', label: 'Electrical Maintenance', description: 'Scheduled or preventive maintenance', icon: 'calendar' },
  { value: 'upgrade', label: 'Electrical Upgrade / Renovation', description: 'Improving or expanding an existing system', icon: 'trending-up' },
  { value: 'solar', label: 'Solar & Inverter Solutions', description: 'Backup power, solar, hybrid inverters', icon: 'sun' },
  { value: 'design-consultancy', label: 'Electrical Design & Consultancy', description: 'Engineering advice before you build', icon: 'drafting' },
  { value: 'home-automation', label: 'Home Automation', description: 'Smart lighting, climate, and control', icon: 'cpu' },
  { value: 'cctv-security', label: 'CCTV & Security Systems', description: 'Cameras and access control', icon: 'camera' },
  { value: 'commercial-industrial', label: 'Commercial / Industrial Electrical', description: 'Facility, plant, or fit-out electrical work', icon: 'factory' },
  { value: 'emergency', label: 'Emergency Electrical Service', description: 'This can’t wait for a scheduled visit', icon: 'siren' },
  { value: 'not-sure', label: 'I’m not sure — I need professional advice', description: 'Tell us what’s happening and we’ll recommend the next step', icon: 'help' },
]

export const propertyTypeOptions: Option[] = [
  { value: 'residential', label: 'Residential', icon: 'home' },
  { value: 'commercial', label: 'Office / Commercial', icon: 'building' },
  { value: 'retail-hospitality', label: 'Retail / Hospitality', icon: 'store' },
  { value: 'industrial', label: 'Industrial', icon: 'factory' },
  { value: 'construction', label: 'Construction / New Development', icon: 'crane' },
  { value: 'estate-facility', label: 'Estate / Facility', icon: 'estate' },
  { value: 'other', label: 'Other', icon: 'dots' },
]

export const issueOptions: Option[] = [
  { value: 'complete-outage', label: 'Complete power outage' },
  { value: 'partial-outage', label: 'Partial power outage' },
  { value: 'frequent-tripping', label: 'Frequent circuit breaker trips' },
  { value: 'flickering-lights', label: 'Lights flickering' },
  { value: 'sockets-not-working', label: 'Sockets not working' },
  { value: 'burning-smell', label: 'Burning smell / overheating' },
  { value: 'sparks', label: 'Sparks or unusual electrical behaviour' },
  { value: 'generator-changeover', label: 'Generator/changeover issue' },
  { value: 'unknown-fault', label: 'Unknown electrical fault' },
  { value: 'other', label: 'Other' },
]

export const installPlanOptions: Option[] = [
  { value: 'new-building', label: 'New building' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'new-lighting', label: 'New lighting' },
  { value: 'additional-sockets', label: 'Additional sockets' },
  { value: 'additional-circuits', label: 'Additional circuits' },
  { value: 'db-upgrade', label: 'Distribution board upgrade' },
  { value: 'ac-supply', label: 'Air-conditioning electrical supply' },
  { value: 'generator-changeover', label: 'Generator/changeover installation' },
  { value: 'ev-charging', label: 'EV charging installation' },
  { value: 'complete-installation', label: 'Complete electrical installation' },
  { value: 'other', label: 'Other' },
]

export const solarGoalOptions: Option[] = [
  { value: 'backup-power', label: 'Backup power' },
  { value: 'reduce-generator', label: 'Reduce generator usage' },
  { value: 'reduce-costs', label: 'Reduce electricity costs' },
  { value: 'new-solar', label: 'New solar installation' },
  { value: 'hybrid-inverter', label: 'Hybrid inverter installation' },
  { value: 'lithium-upgrade', label: 'Lithium battery upgrade' },
  { value: 'inverter-fault', label: 'Existing inverter troubleshooting' },
  { value: 'system-upgrade', label: 'Solar system upgrade' },
  { value: 'new-building-solar', label: 'Solar system for new building' },
  { value: 'other', label: 'Other' },
]

export const urgencyOptions: Option[] = [
  { value: 'emergency', label: 'Emergency — I need help now', icon: 'siren' },
  { value: 'today', label: 'Today' },
  { value: 'within-48h', label: 'Within 24–48 hours' },
  { value: 'this-week', label: 'This week' },
  { value: 'within-2-weeks', label: 'Within 1–2 weeks' },
  { value: 'planning-ahead', label: 'Planning ahead' },
]

export const abujaAreas = [
  'Maitama', 'Asokoro', 'Wuse', 'Garki', 'Jabi', 'Gwarinpa', 'Life Camp',
  'Katampe', 'Guzape', 'Apo', 'Lokogoma', 'Kubwa', 'Lugbe', 'Airport Road',
  'Karsana', 'Other',
]

export const projectStageOptions: Option[] = [
  { value: 'existing-property', label: 'Existing property' },
  { value: 'new-construction', label: 'New construction' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'under-development', label: 'Property under development' },
  { value: 'occupied-facility', label: 'Facility currently occupied' },
  { value: 'planning-stage', label: 'Planning stage' },
  { value: 'other', label: 'Other' },
]

const residentialSizeOptions: Option[] = [
  { value: 'single-room', label: 'Single room' },
  { value: 'apartment', label: 'Apartment' },
  { value: '2-bedroom', label: '2-bedroom' },
  { value: '3-bedroom', label: '3-bedroom' },
  { value: '4-bedroom', label: '4-bedroom' },
  { value: '5-bedroom-plus', label: '5+ bedroom' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'large-residence', label: 'Large residence' },
  { value: 'estate', label: 'Estate' },
]

const commercialSizeOptions: Option[] = [
  { value: 'small-office', label: 'Small office' },
  { value: 'medium-office', label: 'Medium office' },
  { value: 'large-commercial', label: 'Large commercial property' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hotel / Hospitality' },
  { value: 'school', label: 'School' },
  { value: 'healthcare', label: 'Hospital / Healthcare' },
  { value: 'office-complex', label: 'Office complex' },
  { value: 'estate', label: 'Estate' },
  { value: 'other', label: 'Other' },
]

const industrialSizeOptions: Option[] = [
  { value: 'small-facility', label: 'Small facility' },
  { value: 'medium-facility', label: 'Medium facility' },
  { value: 'large-facility', label: 'Large facility' },
  { value: 'factory', label: 'Factory' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'manufacturing-plant', label: 'Manufacturing plant' },
  { value: 'industrial-estate', label: 'Industrial estate' },
  { value: 'other', label: 'Other' },
]

export function projectSizeOptionsFor(propertyType?: string): Option[] {
  if (propertyType === 'industrial') return industrialSizeOptions
  if (propertyType === 'commercial' || propertyType === 'retail-hospitality' || propertyType === 'estate-facility') {
    return commercialSizeOptions
  }
  return residentialSizeOptions
}

export const documentationOptions: Option[] = [
  { value: 'nothing-yet', label: 'Nothing yet' },
  { value: 'existing-installation', label: 'Existing electrical installation' },
  { value: 'drawings', label: 'Electrical drawings' },
  { value: 'boq', label: 'BOQ' },
  { value: 'inspection-report', label: 'Previous inspection report' },
  { value: 'previous-quotation', label: 'Previous quotation' },
  { value: 'solar-specs', label: 'Solar/inverter specifications' },
  { value: 'photos-videos', label: 'Photos/videos' },
  { value: 'site-plan', label: 'Site plan' },
  { value: 'other', label: 'Other' },
]

export const primaryGoalOptions: Option[] = [
  { value: 'fix-problem', label: 'Fix the immediate problem' },
  { value: 'improve-safety', label: 'Improve electrical safety' },
  { value: 'upgrade', label: 'Upgrade the existing installation' },
  { value: 'improve-reliability', label: 'Improve reliability' },
  { value: 'reduce-costs', label: 'Reduce power costs' },
  { value: 'backup-power', label: 'Install backup power' },
  { value: 'install-solar', label: 'Install solar' },
  { value: 'new-system', label: 'Build a new electrical system' },
  { value: 'meet-project-requirements', label: 'Meet project requirements' },
  { value: 'professional-advice', label: 'Obtain professional engineering advice' },
  { value: 'ongoing-maintenance', label: 'Ongoing maintenance' },
]

export const appointmentTypeOptions: Option[] = [
  { value: 'phone-consultation', label: 'Phone consultation' },
  { value: 'whatsapp-consultation', label: 'WhatsApp consultation' },
  { value: 'site-inspection', label: 'Site inspection' },
  { value: 'video-consultation', label: 'Video consultation' },
  { value: 'on-site-assessment', label: 'On-site technical assessment' },
]

export const preferredContactOptions: Option[] = [
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
]

// Ordered step list. `showIf` gates conditional steps so the wizard's
// progress bar reflects the customer's actual path — see
// docs/assessment-platform-architecture.md section C.
export const steps: StepDefinition[] = [
  {
    key: 'need',
    question: 'What can we help you with?',
    supporting: 'Choose the option that best describes what you need.',
    kind: 'single-select',
    options: needOptions,
  },
  {
    key: 'propertyType',
    question: 'Where is the work?',
    kind: 'single-select',
    options: propertyTypeOptions,
  },
  {
    key: 'issue',
    question: 'What is happening?',
    kind: 'single-select',
    options: issueOptions,
    showIf: (a) => a.need === 'repair',
  },
  {
    key: 'installPlan',
    question: 'What are you planning?',
    kind: 'single-select',
    options: installPlanOptions,
    showIf: (a) => a.need === 'installation',
  },
  {
    key: 'solarGoal',
    question: 'What are you looking to achieve?',
    kind: 'single-select',
    options: solarGoalOptions,
    showIf: (a) => a.need === 'solar',
  },
  {
    key: 'urgency',
    question: 'How soon do you need assistance?',
    kind: 'single-select',
    options: urgencyOptions,
  },
  {
    key: 'location',
    question: 'Where is the property located?',
    kind: 'form',
  },
  {
    key: 'projectStage',
    question: 'What stage is the project at?',
    kind: 'single-select',
    options: projectStageOptions,
  },
  {
    key: 'projectSize',
    question: 'What is the approximate size?',
    kind: 'single-select',
    optionsFor: (a) => projectSizeOptionsFor(a.propertyType),
  },
  {
    key: 'documentation',
    question: 'Do you already have any project information?',
    kind: 'multi-select',
    options: documentationOptions,
  },
  {
    key: 'primaryGoal',
    question: 'What is the main outcome you’re looking for?',
    kind: 'single-select',
    options: primaryGoalOptions,
  },
  {
    key: 'contact',
    question: 'Where should we send your assessment?',
    kind: 'form',
  },
  {
    key: 'additionalInfo',
    question: 'Anything else we should know?',
    kind: 'form',
  },
  {
    key: 'appointment',
    question: 'How would you like us to help?',
    kind: 'form',
  },
]

export function visibleSteps(answers: AssessmentAnswers): StepDefinition[] {
  return steps.filter((step) => (step.showIf ? step.showIf(answers) : true))
}
