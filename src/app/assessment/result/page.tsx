import type { Metadata } from 'next'
import { AssessmentResult } from '@/components/assessment/AssessmentResult'

export const metadata: Metadata = {
  title: 'Your Recommendation',
  robots: { index: false, follow: false },
}

export default function AssessmentResultPage() {
  return <AssessmentResult />
}
