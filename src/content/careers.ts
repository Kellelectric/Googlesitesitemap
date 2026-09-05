// ⚠️ Most programme specifics below (duration, stipend, intake windows,
// eligibility) are PLACEHOLDER — invented at the client's explicit request
// ("Build Real content that are still missing, you can invent everything
// and I'll make changes later"), overriding this file's earlier no-invent
// note. Verify and correct every number, date, and eligibility rule before
// treating this as final.
//
// The `applicationFormUrl` field this file used to carry has been removed -
// it was dead code (never read anywhere in the UI, since applications are
// submitted on-site via CareerApplicationForm -> /api/careers-application,
// not a Google Form redirect) and its values had drifted incorrect
// (Internship was pointing at the Industrial Training form; NYSC and Job
// Openings both pointed at what is actually the Internship form). The
// correct routing for the careers-automation pipeline now lives in the
// single-source-of-truth src/content/careerFormRouting.ts.
//
// Confirmed REAL fields (do not treat as placeholder or "fix later"):
// - `apprenticeship`: `duration` (2-year/₦400,000 or 4-year/₦700,000
//   `programmeFee`) and `stipend` (₦25,000/month) — sourced from the
//   client's June 2026 site audit report and a direct client confirmation.
// - `industrial-training`: real programme details supplied directly by
//   the client — standard placement is 6 months, with a newly-opened
//   3-month track for students whose school requires a shorter
//   placement (supersedes an earlier round's "we do not accept 3-month
//   placements" statement — that's no longer accurate). Every applicant
//   goes through a 1-week trial before formal acceptance. `applicationChecklist`
//   is unchanged. `stipend` is confirmed real (a stipend is paid, same
//   as apprenticeship) but the specific naira figure is deliberately not
//   published on-site — client asked for internship and
//   industrial-training to state only that a stipend is provided.
// - All tracks: applications are processed entirely online via the
//   linked Google Form — no in-person/paper application step.
// - `internship` and `industrial-training` `eligibility` lists and
//   `intake` windows — client-approved recommendations (client signed
//   off on Claude's suggested eligibility criteria and confirmed
//   Internship intake is tied to academic term/semester breaks,
//   matching Industrial Training's SIWES-calendar pattern).
// - `job-openings`: the 3 listed roles (Licensed Electrician, Site
//   Supervisor, Solar & Inverter Installation Technician) are
//   client-confirmed as genuinely open right now, not placeholder.
//
// - `internship`: `duration` (6 months, matching Industrial Training's
//   duration) - client-confirmed. A tiered stipend by intern
//   skill/experience level is paid, but the specific naira figures are
//   deliberately not published on-site (see `industrial-training` note
//   above).
//
// - `nysc-placement`: real track, content supplied directly by the client.
//
// All career tracks are now confirmed real. No placeholder fields remain.
export type CareerTrack = {
  slug: string
  name: string
  summary: string
  description: string
  whoItsFor: string[]
  whatToExpect: string[]
  duration?: string
  stipend?: string
  programmeFee?: string
  intake?: string
  eligibility?: string[]
  applicationChecklist?: string[]
  // True only when duration/fee/etc. below are confirmed real — controls
  // whether the detail page shows the "indicative, unconfirmed" caveat.
  programmeDetailsConfirmed?: boolean
}

export const careerTracks: CareerTrack[] = [
  {
    slug: 'nysc-placement',
    name: 'NYSC Placement',
    summary:
      'For NYSC Corps Members seeking a Place of Primary Assignment (PPA) - real experience across engineering and business functions, subject to availability.',
    description:
      "Kell Electricals Ltd welcomes NYSC Corps Members seeking a Place of Primary Assignment (PPA) with our team in Abuja, alongside other motivated young professionals looking for real industry experience. Depending on available opportunities, placement can span Electrical Engineering, Solar & Renewable Energy, HVAC, CCTV & Security Systems, Home Automation, Project Management, Procurement, Administration, Customer Relations, and Marketing. Placement is matched to available departmental needs and is never automatic - it's subject to available positions, company requirements, and a successful assessment.",
    whoItsFor: [
      'Electrical & Electronics Engineering, Mechanical Engineering, Renewable Energy, or Mechatronics graduates',
      'Computer Science & Information Technology graduates',
      'Business Administration, Accounting & Finance, or Procurement & Supply Chain graduates',
      'Marketing & Communications, Human Resources, Project Management, or Administration graduates',
      'Other related disciplines - placement is matched to available departmental needs',
    ],
    whatToExpect: [
      'Hands-on exposure across live projects, installations, inspections, and maintenance work - not just observation',
      'Mentorship from experienced engineers, technicians, and business professionals across departments',
      'Placement matched to your discipline where possible, across our technical and business functions',
      'Practical experience and documentation that strengthens your CV for what comes after service year',
    ],
    duration: 'For the duration of your official NYSC service year, per your posting',
    intake: 'Aligned to NYSC batch call-up and redeployment periods',
    eligibility: [
      'Currently serving NYSC Corps Member seeking a Place of Primary Assignment (PPA), or preparing for an upcoming posting',
      'Willing to learn, professional, punctual, and team-oriented',
      'Comfortable following workplace and safety procedures',
      'Placement is subject to available positions, departmental requirements, and a successful assessment - not automatic',
    ],
    applicationChecklist: [
      'CV',
      'NYSC call-up/posting information, where applicable',
      'Course of study and institution details',
      'Short statement on why you’d like to join Kell Electricals',
    ],
    programmeDetailsConfirmed: true,
  },
  {
    slug: 'internship',
    name: 'Internship',
    summary:
      'Short-term, supervised placements for students and early-career candidates to get hands-on exposure to electrical engineering work.',
    description:
      "An internship at Kell Electricals puts you alongside our engineering and technical teams on real jobs - assessments, installations, testing, and documentation - under supervision. It's a way to see how a COREN and NEMSA certified electrical contractor actually operates day to day, not classroom theory.",
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
    duration: '6 months, same duration as our Industrial Training placements - no shorter placements accepted',
    stipend: 'A monthly stipend is provided, based on experience and skill level',
    intake: 'Aligned to academic term/semester breaks (typically two intakes a year)',
    eligibility: [
      'Currently enrolled in an electrical/electronic engineering, technical, or vocational programme',
      'Basic understanding of electrical fundamentals (coursework or self-study)',
      'Able to commit to full placement days on-site for the duration',
      'No prior professional experience required',
    ],
    programmeDetailsConfirmed: true,
  },
  {
    slug: 'industrial-training',
    name: 'Industrial Training',
    summary:
      'Real electrical work experience, not filing and errand-running - a 6-month standard placement, or 3 months for a shorter school requirement.',
    description:
      "We run an Industrial Training (IT) programme for students who want real electrical work experience, not filing and errand-running. Before anyone is formally accepted, every applicant goes through a 1-week trial period - this isn't a formality, it's where we see how you work: whether you show up on time, ask questions when you're unsure, and handle basic tasks on-site. Students who do well in that week move on to a full placement; students who don't are told honestly and released without hard feelings.",
    whoItsFor: [
      'Students in an electrical, electronic, or related engineering programme who need an IT placement',
      'Willing to actually learn, not just collect a completion letter at the end',
    ],
    whatToExpect: [
      'A 1-week trial period before formal acceptance - how you show up, ask questions, and handle basic on-site tasks decides whether you move to a full placement',
      'Real jobs, under supervision, alongside our technicians - not sitting in an office watching from a distance',
      'Depending on what\'s running that period: residential wiring, panel work, solar installations, or site inspections',
    ],
    duration: '6 months (our standard placement), or 3 months where your school\'s programme requires a shorter placement - indicate which you need on the application form',
    stipend: 'A monthly stipend is provided',
    intake: 'Aligned to the academic SIWES calendar (typically two intakes a year)',
    eligibility: [
      'Enrolled in an electrical, electronic, or related engineering programme with an IT/SIWES requirement',
      'Willing to actually learn on-site, not just collect a completion letter',
      'Your institution\'s IT requirements and timeline (indicate on the application form if you need the 3-month track)',
    ],
    applicationChecklist: [
      'Updated CV',
      'Student ID card',
      'Your institution\'s IT requirements (and note if you need the 3-month track instead of the standard 6 months)',
      'Application is in two steps: submit the form on this page, then complete the second step via the link on the thank-you page - applications aren\'t considered complete until both are done',
    ],
    programmeDetailsConfirmed: true,
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
    duration: '2-year or 4-year track',
    programmeFee: '₦400,000 (2-year track) or ₦700,000 (4-year track)',
    stipend: '₦25,000/month',
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
      "Current openings and roles we're actively considering candidates for at Kell Electricals Ltd - apply even if your exact role isn't listed.",
    description:
      "We don't currently maintain a live, self-updating job board on this site. Below are roles we're actively considering candidates for; if you'd like to be considered for a role not listed, or want to ask whether we're hiring for a specific position, fill out the application form below.",
    whoItsFor: [
      'Licensed Electrician (Journeyman level) - residential & commercial installation and fault-finding',
      'Site Supervisor - coordinating multi-trade electrical fit-outs on active construction sites',
      'Solar & Inverter Installation Technician - hybrid solar/battery system installation and commissioning',
    ],
    whatToExpect: [
      'Direct application review by our engineering team, not an automated filter',
      'A practical/technical assessment as part of the interview process',
      'Placement on live jobs within your specialization once onboarded',
    ],
  },
]

export function getCareerTrackBySlug(slug: string): CareerTrack | undefined {
  return careerTracks.find((track) => track.slug === slug)
}
