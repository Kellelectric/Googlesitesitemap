import { createSign } from 'node:crypto'

// Talks to the Google Calendar API directly via a service-account JWT
// (the "JWT Bearer Token" OAuth2 flow) using only `fetch` and Node's
// built-in `crypto` - no `googleapis` dependency, matching this codebase's
// existing preference for hand-rolled REST calls over adding an SDK (see
// the webhook HMAC signing in app/api/quote/route.ts for the same style).
//
// Setup (see docs/next-steps.md for the full walkthrough): create a Google
// Cloud service account, download its JSON key, share the target Google
// Calendar with that service account's email (grant "Make changes to
// events"), then set these three env vars from the JSON key:
//   GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL - the key's client_email
//   GOOGLE_CALENDAR_PRIVATE_KEY           - the key's private_key
//   GOOGLE_CALENDAR_ID                    - the calendar to read/write
//     (usually the business's own Gmail address, once shared as above)
const SCOPE = 'https://www.googleapis.com/auth/calendar'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const API_BASE = 'https://www.googleapis.com/calendar/v3'

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_CALENDAR_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  )
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Env vars can't hold real newlines cleanly, so private keys are stored
// with literal "\n" sequences and unescaped here - the standard pattern
// for pasting a service-account private_key into a platform's env UI.
function getPrivateKey(): string {
  return (process.env.GOOGLE_CALENDAR_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token
  }

  const email = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL
  if (!email) throw new Error('GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL not set')
  const privateKey = getPrivateKey()

  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({
      iss: email,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  )
  const signInput = `${header}.${claims}`
  const signer = createSign('RSA-SHA256')
  signer.update(signInput)
  signer.end()
  const signature = base64url(signer.sign(privateKey))
  const assertion = `${signInput}.${signature}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Google token exchange failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

export type BusyPeriod = { start: string; end: string }

// Real, current busy blocks on the calendar for the given ISO window -
// nothing invented or cached beyond the access token itself, so this
// always reflects the calendar's actual state at request time.
export async function getBusyPeriods(timeMinIso: string, timeMaxIso: string): Promise<BusyPeriod[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID not set')
  const token = await getAccessToken()

  const res = await fetch(`${API_BASE}/freeBusy`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      items: [{ id: calendarId }],
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Google freeBusy query failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as {
    calendars: Record<string, { busy: BusyPeriod[] }>
  }
  return data.calendars[calendarId]?.busy ?? []
}

export async function createCalendarEvent(params: {
  startIso: string
  endIso: string
  summary: string
  description: string
  attendeeEmail?: string
}): Promise<{ id: string; htmlLink: string }> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID not set')
  const token = await getAccessToken()

  const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE || 'Africa/Lagos'
  const body = {
    summary: params.summary,
    description: params.description,
    start: { dateTime: params.startIso, timeZone },
    end: { dateTime: params.endIso, timeZone },
    ...(params.attendeeEmail ? { attendees: [{ email: params.attendeeEmail }] } : {}),
  }

  // sendUpdates=all asks Google to email the attendee an invite - whether
  // that email actually goes out depends on the calendar's own sharing
  // settings, so this is a best-effort nicety, not a guarantee.
  const res = await fetch(
    `${API_BASE}/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    },
  )
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Google event creation failed (${res.status}): ${text}`)
  }
  return (await res.json()) as { id: string; htmlLink: string }
}
