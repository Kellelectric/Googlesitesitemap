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
//     training-programme form at all.
// `job-openings` still has no Google Form and stays on the on-site
// pipeline only. `nysc-placement` originally matched that treatment "for
// now," but the client has since supplied a real, dedicated NYSC
// Placement Google Form (see its entry below) - it's routed the same way
// as the other 3 form-backed tracks now.
//
// ROUTING MECHANISM — pre-filled link, not Apps Script auto-submit:
// listFormItems() (see scripts/google-apps-script/) revealed the
// apprenticeship/industrial-training/internship forms are each a full
// 40-50 question application with several REQUIRED file-upload questions
// (passport photo, ID, CV, certificates) and other required non-text
// questions (DOB, consent checkboxes, signature). Google Apps Script's
// Forms API has no method to submit a file-upload answer at all, and
// FormResponse.submit() throws if any required question is unanswered -
// so silently auto-submitting the website's short form into these forms
// would fail on every real application. Instead, the applicant is handed
// a Google Forms "pre-filled link" (native Google feature:
// ?entry.<itemId>=value query params) with the fields we collected
// already filled in, and finishes the rest (photo, DOB, consent,
// signature) on Google's own page. The form's own linked Sheet is the
// resulting record - no Apps Script submission step is needed for any of
// the 4 form-backed tracks. All 4 now have prefillEntryIds mapped (see
// each entry's own comment below for how its IDs were sourced).
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
    // Client-supplied real NYSC Placement Google Form (shortlink
    // https://forms.gle/rnGjtFtRYMZy8Ufr5, resolved to its canonical
    // /viewform URL below - buildPrefillUrl appends query params, which a
    // shortlink redirect isn't guaranteed to preserve). Entry IDs below
    // came from the client's own "Get pre-filled link" export (not
    // listFormItems(), which needs Apps Script access to this specific
    // form) - matched by the sample values they filled into each field
    // when generating that link. This form also asks for a state of
    // origin, address, emergency contact, NYSC call-up number, batch,
    // and several NYSC-specific questions with no equivalent field on
    // the site's short application - left unmapped rather than guessed,
    // same as the other 3 form-backed tracks above.
    trackSlug: 'nysc-placement',
    googleFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSciHkZ1zMLeIvGXkmoqRSISSaWV2JuhbzTxI6oyMQ-xXEkVGQ/viewform',
    prefillEntryIds: {
      fullName: '1004492518', // "Full Name"
      phone: '455131045', // "Phone Number"
      email: '1630505554', // "Email Address"
      institution: '31462287', // Institution/school field
    },
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
