// Shared by both public write endpoints that can be gated behind hCaptcha
// (app/api/quote/route.ts and app/api/book/route.ts) - same
// HCAPTCHA_SECRET_KEY env var, same verification call, so there's one
// place this logic lives rather than two copies that could drift.
export async function verifyHCaptcha(token: string, secret: string): Promise<boolean> {
  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (error) {
    console.error('hCaptcha verification request failed', error)
    return false
  }
}
