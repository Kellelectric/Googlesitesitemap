export type NeedKey =
  | 'installation'
  | 'repair'
  | 'inspection'
  | 'maintenance'
  | 'upgrade'
  | 'solar'
  | 'design-consultancy'
  | 'home-automation'
  | 'cctv-security'
  | 'commercial-industrial'
  | 'emergency'
  | 'not-sure'

export type PropertyTypeKey =
  | 'residential'
  | 'commercial'
  | 'retail-hospitality'
  | 'industrial'
  | 'construction'
  | 'estate-facility'
  | 'other'

export type UrgencyKey = 'emergency' | 'today' | 'within-48h' | 'this-week' | 'within-2-weeks' | 'planning-ahead'

export type PreferredContactKey = 'phone' | 'whatsapp' | 'email'

export type AppointmentTypeKey =
  | 'phone-consultation'
  | 'whatsapp-consultation'
  | 'site-inspection'
  | 'video-consultation'
  | 'on-site-assessment'

export type LocationAnswer = {
  city: string
  area: string
  address?: string
  landmark?: string
}

export type ContactAnswer = {
  name: string
  phone: string
  whatsapp?: string
  email?: string
  company?: string
  jobTitle?: string
  preferredContact: PreferredContactKey
}

export type AppointmentAnswer = {
  type: AppointmentTypeKey
  preferredDate?: string
  preferredTime?: string
  alternativeDate?: string
  alternativeTime?: string
}

export type AssessmentAnswers = {
  need?: NeedKey
  propertyType?: PropertyTypeKey
  issue?: string
  installPlan?: string
  solarGoal?: string
  urgency?: UrgencyKey
  location?: LocationAnswer
  projectStage?: string
  projectSize?: string
  documentation?: string[]
  primaryGoal?: string
  contact?: ContactAnswer
  additionalInfo?: string
  appointment?: AppointmentAnswer
}
