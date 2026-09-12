'use client'

import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client for the /admin login form - signs in with
// the staff member's email/password against Supabase Auth, then relies on
// middleware.ts + supabaseServer.ts to read that session on subsequent
// requests. See .env.example for the two NEXT_PUBLIC_ vars this needs.
export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
