// Single source of truth for where each career track's automation
// downstream should route a submitted application. Distinct from
// careers.ts's `careerTracks` (the marketing content shown on /careers
// pages) - this file exists only to configure the server-side
// automation, per docs/careers-automation.md.
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
// The three Google Form URLs below were supplied directly by the client.
//
// ROUTING MECHANISM — pre-filled link, not Apps Script auto-submit:
// listFormItems() (see scripts/google-apps-script/) revealed each of
// these 3 forms is a full 40-50 question application with several
// REQUIRED file-upload questions (passport photo, ID, CV, certificates)
// and other required non-text questions (DOB, consent checkboxes,
// signature). Google Apps Script's Forms API has no method to submit a
// file-upload answer at all, and FormResponse.submit() throws if any
// required question is unanswered - so silently auto-submitting the
// website's short form into these forms would fail on every real
// application. Instead, the applicant is handed a Google Forms
// "pre-filled link" (native Google feature: ?entry.<itemId>=value query
// params) with the fields we collected already filled in, and finishes
// the rest (photo, DOB, consent, signature) on Google's own page. The
// form's own linked Sheet is the resulting record - no Apps Script
// submission step is needed for these 3 tracks.
export type CareerFormFieldKey = 'fullName' | 'email' | 'phone' | 'institution'

export type CareerFormRoute = {
  trackSlug: string
  // null = no Google Form for this track; the application stays in the
  // on-site pipeline (CAREERS_WEBHOOK_URL only, no downstream form).
  googleFormUrl: string | null
  // Item IDs (from listFormItems()) for fields with a real, unambiguous
  // matching question on that specific form. `message` and `reference`
  // are deliberately absent everywhere below - none of the 3 forms has a
  // generic freeform note or an application-reference question, and
  // guessing a wrong mapping would corrupt an applicant's real answer to
  // a differently-worded question instead. The reference number is still
  // shown to the applicant on the site's own thank-you page for their
  // own tracking.
  prefillEntryIds?: Partial<Record<CareerFormFieldKey, string>>
}

export const careerFormRouting: CareerFormRoute[] = [
  {
    trackSlug: 'apprenticeship',
    googleFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScyQUddIgthC752dLwSulX9vRT8V4rPdvlz3Wr7EM0VTktE9A/viewform',
    prefillEntryIds: {
      fullName: '167298745', // "Full Name"
      phone: '1804383934', // "Phone Number"
      email: '1003328689', // "Email Address"
      // No institution/course question on this form (apprenticeship
      // doesn't assume the applicant is currently enrolled anywhere).
    },
  },
  {
    trackSlug: 'industrial-training',
    googleFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform',
    prefillEntryIds: {
      fullName: '1214169229', // "Full Name"
      phone: '653729691', // "Phone Number"
      email: '400573904', // "Email Address"
      // This form has two differently-scoped "Institution Name"
      // questions (item 148861999 under ABOUT YOU, item 1015554489 under
      // EDUCATION & TRAINING next to "Course of Study"). Mapped to the
      // latter as the clearer match for courseOrInstitution's intent -
      // confirm with the client if the other was meant instead.
      institution: '1015554489', // "Institution Name" (Education & Training section)
    },
  },
  {
    trackSlug: 'internship',
    googleFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform',
    prefillEntryIds: {
      fullName: '322884199', // "Full Legal Name"
      email: '1049550588', // "Email"
      phone: '118987505', // "Phone number"
      institution: '96946990', // "Most Recent Institution Attended"
    },
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

// Builds a Google Forms pre-filled link from whichever of the route's
// mapped fields have a non-empty value. Returns the plain form URL (no
// query string) if the route has no entry-ID map at all, and null if
// there's no Google Form for this track in the first place.
export function buildPrefillUrl(
  route: CareerFormRoute,
  values: Partial<Record<CareerFormFieldKey, string | undefined>>,
): string | null {
  if (!route.googleFormUrl) return null
  if (!route.prefillEntryIds) return route.googleFormUrl

  const params = new URLSearchParams({ usp: 'pp_url' })
  let hasAny = false
  ;(Object.keys(route.prefillEntryIds) as CareerFormFieldKey[]).forEach((key) => {
    const entryId = route.prefillEntryIds?.[key]
    const value = values[key]
    if (entryId && value && value.trim().length > 0) {
      params.set(`entry.${entryId}`, value.trim())
      hasAny = true
    }
  })

  return hasAny ? `${route.googleFormUrl}?${params.toString()}` : route.googleFormUrl
}
