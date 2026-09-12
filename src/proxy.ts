import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Gates every /admin/* route behind a signed-in Supabase Auth session,
// refreshing the session cookie on each request (required by @supabase/ssr
// so a session doesn't silently expire mid-visit). Public site routes are
// untouched by the matcher below. If Supabase Auth isn't configured yet,
// /admin is left inaccessible with a clear message rather than open.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return new NextResponse(
      'Admin dashboard is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      { status: 503 },
    )
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!user && !isLoginPage) {
    const redirectUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/leads', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
