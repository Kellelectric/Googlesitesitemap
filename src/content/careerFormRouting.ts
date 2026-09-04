// Single source of truth for where each career track's automation
// downstream (Zoho Flow / Google Apps Script) should route a submitted
// application. Distinct from careers.ts's `careerTracks` (the marketing
// content shown on /careers pages) - this file exists only to configure
// the server-side webhook/automation pipeline, per docs/careers-automation.md.
//
// IMPORTANT — corrects a real mismatch found in careers.ts's now-removed
// `applicationFormUrl` field, which was dead code (grep confirmed it was
// never read anywhere in the UI) but held INCORRECT form URLs:
//   - `internship` was pointing at the industrial-training form (sharing
//     it), when the client has confirmed Internship has its own form.
//   - `job-openings` was pointing at a Google Form at all, when job
//     openings should never redirect to a training-programme form - they
//     stay entirely in the on-site application pipeline.
// The three Google Form URLs below were supplied directly by the client
// in this round and are the authoritative mapping.
export type CareerFormRoute = {
  trackSlug: string
  // null = no Google Form for this track; the application stays in the
  // on-site pipeline (CAREERS_WEBHOOK_URL only, no downstream form).
  googleFormUrl: string | null
}

export const careerFormRouting: CareerFormRoute[] = [
  {
    trackSlug: 'apprenticeship',
    googleFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScyQUddIgthC752dLwSulX9vRT8V4rPdvlz3Wr7EM0VTktE9A/viewform',
  },
  {
    trackSlug: 'industrial-training',
    googleFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform',
  },
  {
    trackSlug: 'internship',
    googleFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform',
  },
  {
    trackSlug: 'job-openings',
    googleFormUrl: null,
  },
  // `nysc-placement` is intentionally NOT listed here - the client's
  // careers-automation brief named only 4 sources (Apprenticeship,
  // Industrial Training/SIWES, Internship, Job Openings). NYSC Placement
  // is a real track on the site but has no confirmed Google Form target
  // for this automation; it previously pointed (incorrectly) at the
  // Internship form. Flag this to the client before assuming a route -
  // don't guess one.
]

export function getCareerFormRoute(trackSlug: string): CareerFormRoute | undefined {
  return careerFormRouting.find((route) => route.trackSlug === trackSlug)
}
