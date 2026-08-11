import { z } from 'zod'

export const locationSchema = z.object({
  city: z.string().trim().min(1).max(100),
  area: z.string().trim().min(1).max(100),
  address: z.string().trim().max(300).optional(),
  landmark: z.string().trim().max(200).optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(150),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s()-]{7,20}$/, 'Enter a valid phone number'),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[+0-9\s()-]{7,20}$/, 'Enter a valid WhatsApp number')
    .optional()
    .or(z.literal('')),
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  company: z.string().trim().max(150).optional(),
  jobTitle: z.string().trim().max(150).optional(),
  preferredContact: z.enum(['phone', 'whatsapp', 'email']),
})

export const appointmentSchema = z.object({
  type: z.enum(['phone-consultation', 'whatsapp-consultation', 'site-inspection', 'video-consultation', 'on-site-assessment']),
  preferredDate: z.string().trim().min(1).optional(),
  preferredTime: z.string().trim().min(1).optional(),
  alternativeDate: z.string().trim().optional(),
  alternativeTime: z.string().trim().optional(),
})

export const utmSchema = z.object({
  utmSource: z.string().trim().max(150).optional(),
  utmMedium: z.string().trim().max(150).optional(),
  utmCampaign: z.string().trim().max(150).optional(),
  utmTerm: z.string().trim().max(150).optional(),
  utmContent: z.string().trim().max(150).optional(),
})

export const assessmentAnswersSchema = z.object({
  need: z.string().trim().min(1),
  propertyType: z.string().trim().min(1),
  issue: z.string().trim().optional(),
  installPlan: z.string().trim().optional(),
  solarGoal: z.string().trim().optional(),
  urgency: z.string().trim().min(1),
  location: locationSchema,
  projectStage: z.string().trim().optional(),
  projectSize: z.string().trim().optional(),
  documentation: z.array(z.string()).default([]),
  primaryGoal: z.string().trim().optional(),
  contact: contactSchema,
  additionalInfo: z.string().trim().max(2000).optional(),
  appointment: appointmentSchema.optional(),
})

export const assessmentSubmitSchema = z.object({
  answers: assessmentAnswersSchema,
  utm: utmSchema.optional(),
  // Honeypot — real users never fill this in.
  website: z.string().max(0).optional().or(z.literal('')),
})

export const emergencySubmitSchema = z.object({
  name: z.string().trim().min(2).max(150),
  phone: z.string().trim().regex(/^[+0-9\s()-]{7,20}$/),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[+0-9\s()-]{7,20}$/)
    .optional()
    .or(z.literal('')),
  location: locationSchema,
  issueDescription: z.string().trim().min(5).max(2000),
  preferredContact: z.enum(['phone', 'whatsapp', 'email']),
  website: z.string().max(0).optional().or(z.literal('')),
})

export type AssessmentSubmitInput = z.infer<typeof assessmentSubmitSchema>
export type EmergencySubmitInput = z.infer<typeof emergencySubmitSchema>
