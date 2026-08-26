export type ProcessStep = {
  step: string
  title: string
  description: string
}

export const process: ProcessStep[] = [
  {
    step: '01',
    title: 'Assess',
    description:
      'Site survey, load assessment, and diagnostics. We measure the actual conditions before proposing a scope.',
  },
  {
    step: '02',
    title: 'Design',
    description:
      'A specified, documented design against the assessed load: circuit schedules and single-line diagrams, not verbal estimates.',
  },
  {
    step: '03',
    title: 'Install',
    description:
      'Work executed by our certified team to the documented design, with safety isolation and site protocols observed throughout.',
  },
  {
    step: '04',
    title: 'Test & Handover',
    description:
      'Commissioning tests, compliance checks, and as-built documentation handed over. Not just a completed job, a documented one.',
  },
]
