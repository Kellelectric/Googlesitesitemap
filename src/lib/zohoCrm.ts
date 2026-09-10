// Creates a Lead in Zoho CRM via a self-client OAuth refresh-token flow -
// same hand-rolled-REST style as googleCalendar.ts's service-account JWT
// flow (no SDK dependency). Real module confirmed live in the client's
// Zoho CRM org: standard "Leads" (api_name `Leads`), with Company,
// First_Name, Last_Name, Email, Phone, Designation, Description fields -
// no custom "Candidates" module exists, so Leads is the genuine match,
// not an invented one.
//
// Setup: Zoho API Console (api-console.zoho.com) -> Self Client -> generate
// a grant token for scope `ZOHOCRM.modules.leads.CREATE` -> exchange it
// once (curl, see docs/careers-automation.md) for a refresh token. Then set:
//   ZOHO_CRM_CLIENT_ID
//   ZOHO_CRM_CLIENT_SECRET
//   ZOHO_CRM_REFRESH_TOKEN
//   ZOHO_CRM_DC - the account's data center domain suffix (e.g. "com",
//     "eu", "in", "com.au") - determines both the accounts and API host.
export function isZohoCrmConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CRM_CLIENT_ID &&
      process.env.ZOHO_CRM_CLIENT_SECRET &&
      process.env.ZOHO_CRM_REFRESH_TOKEN &&
      process.env.ZOHO_CRM_DC,
  )
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token
  }

  const dc = process.env.ZOHO_CRM_DC
  const clientId = process.env.ZOHO_CRM_CLIENT_ID
  const clientSecret = process.env.ZOHO_CRM_CLIENT_SECRET
  const refreshToken = process.env.ZOHO_CRM_REFRESH_TOKEN
  if (!dc || !clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho CRM env vars not fully set')
  }

  const res = await fetch(`https://accounts.zoho.${dc}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Zoho CRM token refresh failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

export type CareerLeadInput = {
  fullName: string
  email: string
  phone: string
  trackName: string
  roleAppliedFor?: string
  courseOrInstitution?: string
  cvLink?: string
  message: string
  reference: string
}

// Splits on the last space - Zoho CRM's Leads module requires Last_Name,
// so a single-word name goes entirely into Last_Name rather than being
// dropped or guessed at.
function splitName(fullName: string): { firstName?: string; lastName: string } {
  const trimmed = fullName.trim()
  const lastSpace = trimmed.lastIndexOf(' ')
  if (lastSpace === -1) return { lastName: trimmed }
  return { firstName: trimmed.slice(0, lastSpace), lastName: trimmed.slice(lastSpace + 1) }
}

// Best-effort - throws on failure so the caller decides how to log/ignore
// it; never blocks the applicant's own submission response.
export async function createCareerLead(input: CareerLeadInput): Promise<void> {
  const dc = process.env.ZOHO_CRM_DC
  if (!dc) throw new Error('ZOHO_CRM_DC not set')
  const token = await getAccessToken()
  const { firstName, lastName } = splitName(input.fullName)

  const descriptionLines = [
    `Application reference: ${input.reference}`,
    `Career track: ${input.trackName}`,
    input.roleAppliedFor ? `Role applied for: ${input.roleAppliedFor}` : null,
    input.courseOrInstitution ? `Course / institution: ${input.courseOrInstitution}` : null,
    input.cvLink ? `CV link: ${input.cvLink}` : null,
    '',
    input.message,
  ].filter((line): line is string => line !== null)

  const res = await fetch(`https://www.zohoapis.${dc}/crm/v2/Leads`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [
        {
          First_Name: firstName,
          Last_Name: lastName,
          Email: input.email,
          Phone: input.phone,
          Company: 'Kell Electricals Ltd - Applicant',
          Designation: input.roleAppliedFor || input.trackName,
          // Lead_Source deliberately left unset - none of this org's real
          // picklist values ("Web Download", "Web Research", etc.) is an
          // accurate match for "submitted the on-site careers form", and
          // guessing one would misrepresent the source in reporting.
          Description: descriptionLines.join('\n'),
        },
      ],
    }),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Zoho CRM lead create failed (${res.status}): ${text}`)
  }
  const body = (await res.json()) as { data?: Array<{ status?: string; message?: string }> }
  if (body.data?.[0]?.status !== 'success') {
    throw new Error(`Zoho CRM lead create rejected: ${JSON.stringify(body.data?.[0])}`)
  }
}
