import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth'
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit'
import { z } from 'zod'

export const runtime = 'nodejs'

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKeyFromRequest(request, 'admin-login'), 8, 60_000)
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: 'invalid_credentials' }, { status: 401 })
  }

  const admin = await db.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  const genericFailure = () => NextResponse.json({ ok: false, reason: 'invalid_credentials' }, { status: 401 })

  if (!admin || !admin.active) return genericFailure()

  const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash)
  if (!valid) return genericFailure()

  const token = createSessionToken({ adminUserId: admin.id, role: admin.role, email: admin.email })
  const response = NextResponse.json({ ok: true, role: admin.role })
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return response
}
