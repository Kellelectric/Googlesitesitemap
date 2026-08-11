// Payment architecture only — see docs/assessment-platform-architecture.md
// section H. Not every service requires payment (free consultation vs.
// inspection fee vs. deposit vs. full payment), so callers decide *whether*
// to charge; this module only decides *how*, given a provider.

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_PAID'

export type InitializePaymentInput = {
  amountNgn: number
  email: string
  reference: string
  metadata?: Record<string, unknown>
}

export type InitializePaymentResult = {
  authorizationUrl: string
  reference: string
}

export interface PaymentProvider {
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>
  verify(reference: string): Promise<{ status: PaymentStatus; amountNgn: number }>
}

/** Never stores card data — providers redirect to a hosted checkout page
 * (Paystack/Flutterwave) and this app only ever sees a reference + status. */
class MockPaymentProvider implements PaymentProvider {
  async initialize(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    return {
      authorizationUrl: `/book/payment-not-configured?ref=${encodeURIComponent(input.reference)}`,
      reference: input.reference,
    }
  }

  async verify(): Promise<{ status: PaymentStatus; amountNgn: number }> {
    return { status: 'PENDING', amountNgn: 0 }
  }
}

// TODO(payments): implement PaystackProvider using PAYSTACK_SECRET_KEY —
// POST https://api.paystack.co/transaction/initialize, verify via
// GET https://api.paystack.co/transaction/verify/:reference.
// TODO(payments): implement FlutterwaveProvider using FLUTTERWAVE_SECRET_KEY
// following the same initialize/verify shape.

export function getPaymentProvider(): PaymentProvider {
  return new MockPaymentProvider()
}
