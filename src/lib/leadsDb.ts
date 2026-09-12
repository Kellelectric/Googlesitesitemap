import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

export { isSupabaseConfigured }

export type LeadIntent =
  | 'general_enquiry'
  | 'quote_request'
  | 'inspection_request'
  | 'electrical_installation'
  | 'electrical_repair'
  | 'solar_inverter'
  | 'cctv_security'
  | 'maintenance'
  | 'existing_customer_support'
  | 'careers'
  | 'complaint'
  | 'payment_invoice'
  | 'human_request'
  | 'emergency'
  | 'other'

export type LeadSourceChannel = 'website_chat' | 'website_form' | 'whatsapp' | 'phone' | 'manual'

type RecordLeadInput = {
  sourceChannel: LeadSourceChannel
  intent: LeadIntent
  name: string
  phone?: string
  email?: string
  location?: string
  propertyType?: string
  serviceInterest?: string
  description?: string
  urgency?: 'normal' | 'urgent' | 'emergency'
  preferredDate?: string
  externalZohoId?: string
}

// Best-effort, additive record of every lead-generating form/flow into the
// AI receptionist platform's own database (leads.customer_id fk'd to
// customers, matched by phone/email so repeat enquiries link to one
// customer record). This is independent of Zoho CRM/WhatsApp/email - a
// failure here is logged and swallowed, never blocking the caller's own
// response to the visitor. No-ops entirely when Supabase isn't configured.
export async function recordLead(input: RecordLeadInput): Promise<{ leadId: string } | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  try {
    let customerId: string | null = null

    if (input.phone || input.email) {
      const orFilters: string[] = []
      if (input.phone) orFilters.push(`phone.eq.${input.phone}`)
      if (input.email) orFilters.push(`email.eq.${input.email}`)

      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .or(orFilters.join(','))
        .limit(1)
        .maybeSingle()

      if (existing) {
        customerId = existing.id as string
        await supabase
          .from('customers')
          .update({
            full_name: input.name,
            phone: input.phone,
            email: input.email,
            address: input.location,
            updated_at: new Date().toISOString(),
          })
          .eq('id', customerId)
      }
    }

    if (!customerId) {
      const { data: created, error } = await supabase
        .from('customers')
        .insert({
          full_name: input.name,
          phone: input.phone,
          email: input.email,
          address: input.location,
        })
        .select('id')
        .single()

      if (error) throw error
      customerId = created.id as string
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        customer_id: customerId,
        source_channel: input.sourceChannel,
        intent: input.intent,
        service_interest: input.serviceInterest,
        description: input.description,
        property_type: input.propertyType,
        urgency: input.urgency ?? 'normal',
        preferred_date: input.preferredDate,
        external_zoho_id: input.externalZohoId,
      })
      .select('id')
      .single()

    if (leadError) throw leadError

    await supabase.from('audit_log').insert({
      actor_type: 'system',
      action: 'lead_created',
      entity_type: 'lead',
      entity_id: lead.id,
      details: { source_channel: input.sourceChannel, intent: input.intent },
    })

    return { leadId: lead.id as string }
  } catch (error) {
    console.error('Supabase recordLead (best-effort) failed', error)
    return null
  }
}
