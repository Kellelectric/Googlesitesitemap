import { z } from 'zod'
import { contactSchema, locationSchema } from './assessment'

export const bookingSchema = z.object({
  leadId: z.string().trim().min(1).optional(),
  serviceSlug: z.string().trim().min(1),
  appointmentType: z.enum(['phone-consultation', 'whatsapp-consultation', 'site-inspection', 'video-consultation', 'on-site-assessment']),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Select a date'),
  time: z.string().trim().regex(/^\d{2}:\d{2}$/, 'Select a time'),
  contact: contactSchema.optional(),
  location: locationSchema.optional(),
  notes: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional().or(z.literal('')),
})

export type BookingInput = z.infer<typeof bookingSchema>
