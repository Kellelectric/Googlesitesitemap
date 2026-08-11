// Fixed, single-region business facts. Configurable operational values
// (working hours, buffer time, WhatsApp number, etc.) live in the
// `Setting` table and are read via src/lib/settings.ts — this file is only
// for values that aren't meaningfully "settings" (currency, timezone).

export const TIMEZONE = 'Africa/Lagos'
export const CURRENCY = 'NGN'
export const CURRENCY_SYMBOL = '₦'
export const COUNTRY_DIAL_CODE = '+234'

export function formatNaira(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'Quoted after assessment'
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-NG')}`
}
