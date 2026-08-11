import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import type { AdminRole } from '@prisma/client'

export const SESSION_COOKIE = 'kell_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 hours

export type SessionPayload = {
  adminUserId: string
  role: AdminRole
  email: string
  exp: number
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET is not set (or too short) — see .env.example')
  }
  return secret
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url')
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url')
}

export function createSessionToken(payload: Omit<SessionPayload, 'exp'>): string {
  const full: SessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }
  const body = base64url(JSON.stringify(full))
  const signature = sign(body)
  return `${body}.${signature}`
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = sign(body)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  }
}

/** Server Component / Server Action helper — reads the current admin session, if any. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

const ROLE_HIERARCHY: AdminRole[] = ['CUSTOMER_SERVICE', 'TECHNICIAN', 'ENGINEER', 'ADMINISTRATOR', 'SUPER_ADMIN']

/** True if `role` is at or above `minimum` in the access hierarchy. */
export function roleAtLeast(role: AdminRole, minimum: AdminRole): boolean {
  return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minimum)
}
