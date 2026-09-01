// ⚠️ Most programme specifics below (duration, stipend, intake windows,
// eligibility) are PLACEHOLDER — invented at the client's explicit request
// ("Build Real content that are still missing, you can invent everything
// and I'll make changes later"), overriding this file's earlier no-invent
// note. Verify and correct every number, date, and eligibility rule before
// treating this as final. Application form URLs are real and unchanged.
//
// Exception: the `apprenticeship` track's `duration` and `programmeFee`
// (2-year/₦400,000 or 4-year/₦700,000), and `industrial-training`'s
// `applicationChecklist`, are REAL — sourced from the client's June 2026
// site audit report, not invented. Do not treat those two fields as
// placeholder or "fix later."
export type CareerTrack = {
  slug: string
  name: string
  summary: string
  description: string
  whoItsFor: string[]
  whatToExpect: string[]
  applicationFormUrl: string
  duration?: string
  stipend?: string
  programmeFee?: string
  intake?: string
  eligibility?: string[]
  applicationChecklist?: string[]
  // True only when duration/fee/etc. below are confirmed real (currently
  // just `apprenticeship`) — controls whether the detail page shows the
  // "indicative, unconfirmed" caveat or not.
  programmeDetailsConfirmed?: boolean
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
    duration: '8–12 weeks',
    stipend: 'Modest stipend to cover transport and feeding',
    intake: 'Rolling intake, reviewed quarterly',
    eligibility: [
      'Currently enrolled in an engineering, technical, or vocational programme',
      'Basic understanding of electrical fundamentals (coursework or self-study)',
      'Able to commit to full placement days on-site',
    ],
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
    duration: '6 months, aligned to your institution’s SIWES calendar',
    stipend: 'Transport allowance per attendance day',
    intake: 'Aligned to the academic SIWES calendar (typically two intakes a year)',
    eligibility: [
      'Enrolled in a polytechnic or university programme with a mandatory SIWES/industrial-training requirement',
      'A letter of introduction from your institution',
      'Electrical/electronic engineering or a closely related technical discipline',
    ],
    applicationChecklist: [
      'Updated CV',
      'Student ID card',
      'SIWES introduction letter from your institution',
    ],
  },
  {
    slug: 'apprenticeship',
    name: 'Apprenticeship',
    summary:
      'A paid-tuition, structured 2-year or 4-year track for candidates building toward a career as a qualified electrical technician.',
    description:
      "An apprenticeship is a longer-term, hands-on path for candidates who want to build real electrical trade skills under working technicians and engineers, rather than a short placement. It's aimed at people committing to electrical work as a career, not a one-off exposure. Unlike our internship and industrial training tracks, this is a paid-tuition programme with a defined fee structure (see below), not a stipend placement.",
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
    duration: '2-year or 4-year track',
    programmeFee: '₦400,000 (2-year track) or ₦700,000 (4-year track)',
    intake: 'Rolling intake, reviewed quarterly',
    eligibility: [
      'WAEC/SSCE or equivalent, minimum age 18',
      'Some technical aptitude or prior trade exposure preferred but not required',
      'Able to commit to and pay the full programme fee for the chosen track',
    ],
    programmeDetailsConfirmed: true,
  },
  {
    slug: 'job-openings',
    name: 'Job Openings',
    summary:
      "Current openings and roles we're actively considering candidates for at Kell Electricals Ltd — apply even if your exact role isn't listed.",
    description:
      "We don't currently maintain a live, self-updating job board on this site. Below are roles we're actively considering candidates for; if you'd like to be considered for a role not listed, or want to ask whether we're hiring for a specific position, fill out the application form below.",
    whoItsFor: [
      'Licensed Electrician (Journeyman level) — residential & commercial installation and fault-finding',
      'Site Supervisor — coordinating multi-trade electrical fit-outs on active construction sites',
      'Solar & Inverter Installation Technician — hybrid solar/battery system installation and commissioning',
    ],
    whatToExpect: [
      'Direct application review by our engineering team, not an automated filter',
      'A practical/technical assessment as part of the interview process',
      'Placement on live jobs within your specialization once onboarded',
    ],
    applicationFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform',
  },
]

export function getCareerTrackBySlug(slug: string): CareerTrack | undefined {
  return careerTracks.find((track) => track.slug === slug)
}
