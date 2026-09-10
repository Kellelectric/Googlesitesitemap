// Server-side verification of a Paystack transaction - mirrors
// lib/hcaptcha.ts's shape. Used by app/api/book/route.ts to confirm a
// payment actually succeeded (and for the right amount/currency) before
// creating the calendar event, rather than trusting the client's
// "payment succeeded" callback alone - that callback fires in the
// visitor's own browser and could be spoofed.
export async function verifyPaystackTransaction(
  reference: string,
  secretKey: string,
): Promise<{ ok: boolean; amountKobo?: number; currency?: string }> {
  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        signal: AbortSignal.timeout(8000),
      },
    )
    const data = (await res.json()) as {
      status?: boolean
      data?: { status?: string; amount?: number; currency?: string }
    }
    if (!res.ok || data.status !== true || data.data?.status !== 'success') {
      return { ok: false }
    }
    return { ok: true, amountKobo: data.data.amount, currency: data.data.currency }
  } catch (error) {
    console.error('Paystack verification request failed', error)
    return { ok: false }
  }
}
