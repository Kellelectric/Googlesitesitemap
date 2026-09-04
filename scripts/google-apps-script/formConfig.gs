/**
 * Career application -> Google Form routing configuration.
 *
 * This is the ONE place form IDs and field mappings live for the Apps
 * Script side of the pipeline - mirrors src/content/careerFormRouting.ts
 * on the website side, so the two stay conceptually in sync even though
 * they're deployed separately (website on Vercel, this on Google's
 * infrastructure).
 *
 * SETUP STEPS (do this before career_application_router.gs will work):
 *
 * 1. Run listFormItems() (see list_form_items.gs) once for each of the 3
 *    forms below. It logs every question's title, type, and item ID.
 * 2. Copy the real item IDs it prints into the `fields` object for each
 *    form below, replacing the `REPLACE_ME_...` placeholders.
 * 3. Do NOT guess these IDs from the public viewform URL - Google does
 *    not expose a reliable public contract for entry IDs, which is why
 *    listFormItems() exists.
 *
 * The three form URLs below are real, supplied directly by the client.
 * Do not change them without the client's confirmation.
 */

var FORM_CONFIG = {
  apprenticeship: {
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScyQUddIgthC752dLwSulX9vRT8V4rPdvlz3Wr7EM0VTktE9A/viewform',
    fields: {
      // Run listFormItems() and paste the real item IDs here.
      reference: 'REPLACE_ME_REFERENCE_ITEM_ID',
      fullName: 'REPLACE_ME_FULLNAME_ITEM_ID',
      email: 'REPLACE_ME_EMAIL_ITEM_ID',
      phone: 'REPLACE_ME_PHONE_ITEM_ID',
      institution: 'REPLACE_ME_INSTITUTION_ITEM_ID', // courseOrInstitution
      message: 'REPLACE_ME_MESSAGE_ITEM_ID',
    },
  },
  'industrial-training': {
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform',
    fields: {
      reference: 'REPLACE_ME_REFERENCE_ITEM_ID',
      fullName: 'REPLACE_ME_FULLNAME_ITEM_ID',
      email: 'REPLACE_ME_EMAIL_ITEM_ID',
      phone: 'REPLACE_ME_PHONE_ITEM_ID',
      institution: 'REPLACE_ME_INSTITUTION_ITEM_ID',
      message: 'REPLACE_ME_MESSAGE_ITEM_ID',
    },
  },
  internship: {
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform',
    fields: {
      reference: 'REPLACE_ME_REFERENCE_ITEM_ID',
      fullName: 'REPLACE_ME_FULLNAME_ITEM_ID',
      email: 'REPLACE_ME_EMAIL_ITEM_ID',
      phone: 'REPLACE_ME_PHONE_ITEM_ID',
      institution: 'REPLACE_ME_INSTITUTION_ITEM_ID',
      message: 'REPLACE_ME_MESSAGE_ITEM_ID',
    },
  },
  // 'job-openings' is deliberately absent - job applications never go to a
  // Google Form (see docs/careers-automation.md). If nysc-placement should
  // also route to a form, get the client to confirm which one before
  // adding an entry here - it previously pointed (incorrectly) at the
  // Internship form and should not be assumed.
}

/**
 * A field that exists in the incoming payload but not in a given form's
 * `fields` map (e.g. roleAppliedFor, cvLink - none of the three training
 * forms ask for these) is simply skipped rather than causing an error.
 * See career_application_router.gs's submitToForm_().
 */
