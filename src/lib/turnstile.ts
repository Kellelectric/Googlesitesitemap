// Shared by every public write endpoint that can be gated behind Cloudflare
// Turnstile (app/api/quote/route.ts, app/api/book/route.ts,
// app/api/careers-application/route.ts) - same TURNSTILE_SECRET_KEY env
// var, same verification call, so there's one place this logic lives
// rather than several copies that could drift.
export async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification request failed', error)
    return false
  }
}
