import { randomBytes } from 'crypto'

/** Human-readable reference, e.g. KE-8F3D2A. Not a security token — just a
 * lookup/reference number shown to customers and staff. */
export function generateReference(prefix: 'KE' | 'APT'): string {
  const random = randomBytes(4).toString('hex').toUpperCase().slice(0, 6)
  return `${prefix}-${random}`
}
