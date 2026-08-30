// Programme-specific details (duration, stipend, intake dates, eligibility
// criteria) are deliberately NOT included here — no source material for
// those specifics has been provided. Each track below describes what the
// programme generally is, in industry-standard terms, and points to a real
// contact channel for current details. Do not invent numbers, dates, or
// eligibility rules for any of these tracks.
export type CareerTrack = {
  slug: string
  name: string
  summary: string
  description: string
  whoItsFor: string[]
  whatToExpect: string[]
  applicationFormUrl: string
}

export const careerTracks: CareerTrack[] = [
  {
    slug: 'internship',
    name: 'Internship',
    summary:
      'Short-term, supervised placements for students and early-career candidates to get hands-on exposure to electrical engineering work.',
    description:
      "An internship at Kell Electricals puts you alongside our engineering and technical teams on real jobs — assessments, installations, testing, and documentation — under supervision. It's a way to see how a COREN and NEMSA certified electrical contractor actually operates day to day, not classroom theory.",
    whoItsFor: [
      'Students currently enrolled in an engineering or technical programme',
      'Recent graduates exploring electrical engineering as a career path',
      'Anyone who wants structured, supervised exposure to real job sites before committing to the field',
    ],
    whatToExpect: [
      'Supervised exposure across residential, commercial, and industrial job sites',
      'Working alongside engineers, technicians, and project coordinators on live jobs',
      'Direct exposure to our documented process: assess, design, install, test, hand over',
    ],
    applicationFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform',
  },
  {
    slug: 'industrial-training',
    name: 'Industrial Training',
    summary:
      "Placement for polytechnic and university students completing a mandatory Students' Industrial Work Experience Scheme (SIWES) or equivalent.",
    description:
      "Industrial Training placements are for students who need to complete a formal work-experience component of their academic programme (SIWES or a university-required equivalent). Placement with Kell Electricals means real fieldwork on electrical jobs under supervision, with the documentation your institution typically requires for sign-off.",
    whoItsFor: [
      'Polytechnic or university students with a mandatory industrial training (SIWES) requirement',
      'Students in electrical/electronic engineering or related technical programmes',
    ],
    whatToExpect: [
      'Supervised fieldwork alongside our technical team on live jobs',
      'Exposure to the documented assess-design-install-test-handover process on real sites',
      'Institution-required attendance and completion documentation, coordinated with your school',
    ],
    applicationFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform',
  },
  {
    slug: 'apprenticeship',
    name: 'Apprenticeship',
    summary:
      'Structured, hands-on skills development for candidates building toward a career as a qualified electrical technician.',
    description:
      "An apprenticeship is a longer-term, hands-on path for candidates who want to build real electrical trade skills under working technicians and engineers, rather than a short placement. It's aimed at people committing to electrical work as a career, not a one-off exposure.",
    whoItsFor: [
      'Candidates committing to electrical installation and maintenance as a trade',
      'People with some technical aptitude or prior training looking to build practical, on-the-job skill',
    ],
    whatToExpect: [
      'Hands-on skills development under working technicians on live jobs',
      'Progressive exposure to more complex installation, testing, and fault-finding work over time',
      'Working to the same safety and documentation standards as our certified team',
    ],
    applicationFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScyQUddIgthC752dLwSulX9vRT8V4rPdvlz3Wr7EM0VTktE9A/viewform',
  },
  {
    slug: 'job-openings',
    name: 'Job Openings',
    summary: 'Current vacancies at Kell Electricals Ltd.',
    description:
      "We don't currently maintain a live, self-updating job board on this site. If you'd like to be considered for a role, or want to ask whether we're hiring for a specific position, fill out the application form below — we do review speculative applications, and it's the fastest way to reach our team.",
    whoItsFor: [],
    whatToExpect: [],
    applicationFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform',
  },
]

export function getCareerTrackBySlug(slug: string): CareerTrack | undefined {
  return careerTracks.find((track) => track.slug === slug)
}
