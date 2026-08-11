import type { Metadata } from 'next'
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard'

export const metadata: Metadata = {
  title: 'Assessment',
  robots: { index: false, follow: false },
}

export default function AssessmentStartPage() {
  return <AssessmentWizard />
}
