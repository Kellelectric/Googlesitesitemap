import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// SSR Supabase client for the /admin dashboard - reads the signed-in
// staff member's session from cookies and enforces Row Level Security
// (the is_active_staff() policies from the init migration), unlike
// supabaseAdmin.ts's service-role client which bypasses RLS entirely and
// must never be used for anything a browser session drives.
//
// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY -
// see .env.example. Throws if unset, since the admin dashboard has no
// meaningful degraded mode (unlike every public-facing integration in this
// codebase, which no-ops safely).
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not configured - the admin dashboard cannot authenticate.',
    )
  }

  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Called from a Server Component render, where cookies can't be
          // mutated - safe to ignore because middleware.ts refreshes the
          // session on every request anyway.
        }
      },
    },
  })
}

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
