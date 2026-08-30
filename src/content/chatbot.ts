import { company } from '@/content/company'
import { services } from '@/content/services'
import { industries } from '@/content/industries'
import { faqCategories } from '@/content/faqs'
import { careerTracks } from '@/content/careers'

// Structured knowledge base for the Kell Assist chatbot. This is the ONLY
// source of factual content the chatbot's system prompt is built from — it
// composes from the same typed content files the rest of the site renders
// from, so the chatbot can never know something the website doesn't already
// say, and updating a service/FAQ/company fact here updates the chatbot too.
// Do not hardcode chatbot responses in the UI layer — add facts here instead.

export const conversationStarters = [
  'Electrical Service',
  'Solar & Inverter',
  'CCTV & Security',
  'Smart Home',
  'Commercial Project',
  'Industrial Project',
  'Emergency',
  'Request a Quote',
] as const

export type LeadField =
  | 'name'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'location'
  | 'propertyType'
  | 'serviceRequired'
  | 'projectDescription'
  | 'urgency'
  | 'preferredDate'

export const leadFieldLabels: Record<LeadField, string> = {
  name: 'Full name',
  phone: 'Phone number',
  whatsapp: 'WhatsApp number',
  email: 'Email address',
  location: 'Location',
  propertyType: 'Property type',
  serviceRequired: 'Service required',
  projectDescription: 'Project description',
  urgency: 'Urgency',
  preferredDate: 'Preferred date',
}

// Keywords that trigger the deterministic emergency-safety flow BEFORE any
// message reaches the LLM — this must never depend on model availability or
// behavior. Matched case-insensitively against the user's message.
export const emergencyKeywords = [
  'fire',
  'smoke',
  'smoking',
  'spark',
  'burning smell',
  'burnt smell',
  'exposed wire',
  'exposed live',
  'shock',
  'electrocut',
  'explod',
  'overheat',
]

export const emergencySafetyMessage =
  'Please prioritize your safety. If it is safe to do so, switch off the main electrical supply and keep away from the affected area. Do not touch exposed conductors or attempt repairs.'

export const uncertainResponseMessage =
  "I don't want to give you incorrect information. Let me connect you with the Kell Electricals team."

// Questions asked, one at a time, when a user indicates interest in solar —
// per the brief, the chatbot must never produce a final system size from
// this alone; it always closes with the "requires a proper assessment" line.
export const solarFlowQuestions = [
  'What area of Abuja (or Nigeria) is the property in?',
  'Is this for a residential, commercial, or industrial property?',
  'Roughly how many people/occupants regularly use the property?',
  'What are the major appliances or loads you want backed up (A/C, fridge, pumps, machinery, etc.)?',
  'What power sources do you currently have (grid, generator, existing inverter, existing solar)?',
  'Do you already have a battery, and if so, what type/capacity?',
  'How many hours of backup would you like during an outage?',
  'Do you know your approximate electricity consumption (from a meter reading or bill)?',
] as const

export const solarAssessmentDisclaimer =
  'An accurate system recommendation requires a proper load assessment and site assessment.'

// Composed knowledge sections — assembled once, not per-request, and passed
// into the chat API's system prompt. Keep this in sync with the site: it IS
// the site's content, restated for the model rather than duplicated.
export function buildKnowledgeBase() {
  const serviceLines = services.map(
    (s) => `- ${s.name} (${s.slug}): ${s.summary}`,
  )

  const industryLines = industries.map((i) => `- ${i.name}: ${i.summary}`)

  const faqLines = faqCategories.flatMap((cat) =>
    cat.items.map((item) => `Q: ${item.question}\nA: ${item.answer}`),
  )

  const careerLines = careerTracks.map((t) => `- ${t.name}: ${t.summary}`)

  return {
    company: {
      name: company.name,
      legalName: company.legalName,
      rcNumber: company.rcNumber,
      positioning: company.positioning,
      teamExperienceYears: company.teamExperienceYears,
      certifications: company.certifications.map((c) => `${c.name} (${c.fullName})`),
      address: company.address.full,
      serviceAreas: company.serviceAreas,
      serviceRegion: company.serviceRegion,
      businessHours: company.businessHours,
      phone: company.phone,
      email: company.email,
      emergencyEmail: company.emergencyEmail,
      emergencyResponseTarget: company.emergencyResponseTarget,
      whatsappHref: company.whatsappHref,
      googleRating: company.trust.googleRating,
      googleReviewCount: company.trust.googleReviewCount,
    },
    serviceLines,
    industryLines,
    faqLines,
    careerLines,
  }
}
