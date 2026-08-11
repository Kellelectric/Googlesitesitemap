import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { seedDatabase } from '@/lib/seedDatabase'
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit'

export const runtime = 'nodejs'

// One-time (but safe to re-run — everything below is an upsert or an
// existence check) production bootstrap: creates the service catalogue,
// engineers, default settings, and the first SUPER_ADMIN user on a freshly
// provisioned database. Gated behind SEED_TOKEN because there's no shell
// access to a Vercel-hosted Postgres database to run `npm run db:seed`
// against it directly — see docs/assessment-platform-deployment.md.
//
// Usage once SEED_TOKEN is set in the Vercel project's environment
// variables:
//   curl -X POST https://<your-domain>/api/admin/bootstrap \
//     -H "x-seed-token: <SEED_TOKEN value>"

function tokenMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKeyFromRequest(request, 'admin-bootstrap'), 5, 60_000)
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  const expectedToken = process.env.SEED_TOKEN
  if (!expectedToken || expectedToken.length < 16) {
    return NextResponse.json(
      { ok: false, reason: 'not_configured', message: 'SEED_TOKEN is not set on this deployment.' },
      { status: 503 },
    )
  }

  const providedToken = request.headers.get('x-seed-token')
  if (!tokenMatches(providedToken, expectedToken)) {
    return NextResponse.json({ ok: false, reason: 'invalid_token' }, { status: 401 })
  }

  let body: { adminEmail?: string; adminPassword?: string } = {}
  try {
    body = await request.json()
  } catch {
    // No body is fine — falls back to env vars / defaults.
  }

  try {
    const summary = await seedDatabase(db, {
      adminEmail: body.adminEmail,
      adminPassword: body.adminPassword,
    })
    return NextResponse.json({ ok: true, summary })
  } catch (error) {
    console.error('Bootstrap seed failed', error)
    return NextResponse.json(
      { ok: false, reason: 'seed_failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
