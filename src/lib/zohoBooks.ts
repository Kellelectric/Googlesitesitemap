// Creates a Contact + Estimate in Zoho Books for every "Request a Quote"
// submission - same hand-rolled self-client OAuth refresh-token flow as
// zohoCrm.ts (no SDK dependency). Real org confirmed live (organization_id
// 899637093, "Kell Electricals Limited", NGN): the "Sales" account
// (7353435000000000388) is the only real income account for this, and
// "Vat" (7353435000000836024, 7.5%) is the applicable tax - both confirmed
// via list_chart_of_accounts / list_taxes, not guessed.
//
// Scope deliberately limited to quote requests only, per client direction -
// booking and careers submissions are not wired into Zoho Books.
//
// The Estimate's line-item rate is left at 0: nothing has been priced yet
// at submission time, this just gives the office a ready-made draft to
// fill in once they've quoted the job, rather than re-typing customer +
// service details by hand.
//
// Setup: Zoho API Console (api-console.zoho.com) -> Self Client -> generate
// a grant token for scope `ZohoBooks.fullaccess.all` -> exchange it once
// for a refresh token (see docs/careers-automation.md for the equivalent
// CRM flow - same exchange shape). Then set:
//   ZOHO_BOOKS_CLIENT_ID
//   ZOHO_BOOKS_CLIENT_SECRET
//   ZOHO_BOOKS_REFRESH_TOKEN
//   ZOHO_BOOKS_DC - data center domain suffix (e.g. "com", "eu", "in")
//   ZOHO_BOOKS_ORGANIZATION_ID - "899637093" for the live org
const SALES_ACCOUNT_ID = '7353435000000000388'
const VAT_TAX_ID = '7353435000000836024'

export function isZohoBooksConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_BOOKS_CLIENT_ID &&
      process.env.ZOHO_BOOKS_CLIENT_SECRET &&
      process.env.ZOHO_BOOKS_REFRESH_TOKEN &&
      process.env.ZOHO_BOOKS_DC &&
      process.env.ZOHO_BOOKS_ORGANIZATION_ID,
  )
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token
  }

  const dc = process.env.ZOHO_BOOKS_DC
  const clientId = process.env.ZOHO_BOOKS_CLIENT_ID
  const clientSecret = process.env.ZOHO_BOOKS_CLIENT_SECRET
  const refreshToken = process.env.ZOHO_BOOKS_REFRESH_TOKEN
  if (!dc || !clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho Books env vars not fully set')
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
    throw new Error(`Zoho Books token refresh failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

async function booksFetch(path: string, init: RequestInit): Promise<Response> {
  const dc = process.env.ZOHO_BOOKS_DC
  const organizationId = process.env.ZOHO_BOOKS_ORGANIZATION_ID
  const token = await getAccessToken()
  const separator = path.includes('?') ? '&' : '?'
  return fetch(`https://www.zohoapis.${dc}/books/v3${path}${separator}organization_id=${organizationId}`, {
    ...init,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    signal: AbortSignal.timeout(8000),
  })
}

export type QuoteEstimateInput = {
  name: string
  email: string
  phone: string
  serviceName: string
  propertyType: string
  urgency?: string
  location: string
  details: string
  reference: string
}

// Looks up an existing contact by email first (this org already has
// linked/historical contacts - see list_contacts) to avoid creating
// duplicate customer records for repeat enquirers.
async function findContactIdByEmail(email: string): Promise<string | null> {
  const res = await booksFetch(`/contacts?email=${encodeURIComponent(email)}`, { method: 'GET' })
  if (!res.ok) return null
  const body = (await res.json()) as { contacts?: Array<{ contact_id: string }> }
  return body.contacts?.[0]?.contact_id ?? null
}

async function createContact(input: QuoteEstimateInput): Promise<string> {
  const res = await booksFetch('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      contact_name: input.name,
      customer_sub_type: 'individual',
      email: input.email,
      phone: input.phone,
      contact_persons: [
        { first_name: input.name, email: input.email, phone: input.phone, is_primary_contact: true },
      ],
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Zoho Books contact create failed (${res.status}): ${text}`)
  }
  const body = (await res.json()) as { contact?: { contact_id: string } }
  if (!body.contact?.contact_id) {
    throw new Error(`Zoho Books contact create rejected: ${JSON.stringify(body)}`)
  }
  return body.contact.contact_id
}

async function getOrCreateContactId(input: QuoteEstimateInput): Promise<string> {
  const existing = await findContactIdByEmail(input.email)
  if (existing) return existing
  return createContact(input)
}

export async function createQuoteEstimate(input: QuoteEstimateInput): Promise<void> {
  const contactId = await getOrCreateContactId(input)

  const descriptionLines = [
    `Quote reference: ${input.reference}`,
    `Property type: ${input.propertyType}`,
    input.urgency ? `Urgency: ${input.urgency}` : null,
    `Location: ${input.location}`,
    '',
    input.details,
  ].filter((line): line is string => line !== null)

  const res = await booksFetch('/estimates', {
    method: 'POST',
    body: JSON.stringify({
      customer_id: contactId,
      reference_number: input.reference,
      line_items: [
        {
          name: input.serviceName,
          description: descriptionLines.join('\n'),
          rate: 0,
          quantity: 1,
          account_id: SALES_ACCOUNT_ID,
          tax_id: VAT_TAX_ID,
        },
      ],
      notes: 'Auto-created from a website quote request. Fill in the rate once priced.',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Zoho Books estimate create failed (${res.status}): ${text}`)
  }
  const body = (await res.json()) as { estimate?: { estimate_id?: string } }
  if (!body.estimate?.estimate_id) {
    throw new Error(`Zoho Books estimate create rejected: ${JSON.stringify(body)}`)
  }
}
