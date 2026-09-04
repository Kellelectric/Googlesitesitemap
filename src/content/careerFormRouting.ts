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
//   - `job-openings` and `nysc-placement` were both pointing at what is
//     actually the Internship form, when neither should redirect to a
//     training-programme form at all - job-openings never has (it stays
//     on-site), and the client has directed nysc-placement to be treated
//     the same way "for now".
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
  {
    // Client-confirmed direction: "Use the Job Openings [treatment] for
    // now" - same as job-openings, no Google Form, stays in the on-site
    // pipeline only. Previously (incorrectly, in the now-removed
    // applicationFormUrl field) pointed at the Internship form - that
    // mismatch is gone. Revisit if the client later wants NYSC routed
    // somewhere specific (its own form, Zoho CRM, etc).
    trackSlug: 'nysc-placement',
    googleFormUrl: null,
  },
]

export function getCareerFormRoute(trackSlug: string): CareerFormRoute | undefined {
  return careerFormRouting.find((route) => route.trackSlug === trackSlug)
}
