import type { Metadata } from 'next'
import { BookingConfirmation } from '@/components/booking/BookingConfirmation'

export const metadata: Metadata = {
  title: 'Booking Confirmation',
  robots: { index: false, follow: false },
}

export default function BookingConfirmationPage() {
  return <BookingConfirmation />
}
