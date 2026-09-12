import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Service-role Supabase client for server-side API routes only (quote,
// book, careers-application, chat) - bypasses Row Level Security, so this
// must never be imported into client-side code or exposed to the browser.
// Used to write leads/customers/conversations/messages/audit_log rows.
// Without both vars set, every function below no-ops safely - the rest of
// the site (Zoho CRM, WhatsApp, email notifications) is unaffected, this
// is purely an additional durable record of the same activity.
let cached: SupabaseClient | null | undefined

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  cached =
    url && serviceRoleKey
      ? createClient(url, serviceRoleKey, { auth: { persistSession: false } })
      : null
  return cached
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
