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
    // The editor (file) URL, NOT the /d/e/.../viewform public link -
    // FormApp.openByUrl() only reliably resolves the editor's file ID.
    formUrl: 'https://docs.google.com/forms/d/1PUL21ktvqnla3ku5tRMRjpXLgDeYPTdnL0-heQwcPgI/edit',
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
    formUrl: 'https://docs.google.com/forms/d/1XAvz5I9itv04EzR9bDVH4NjMcGaZ1ZQuxWaEMgVjGsg/edit',
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
    formUrl: 'https://docs.google.com/forms/d/1xxE4bOP0qaWC47WHApN26kIrTn4NBjSrPJDlq156ANM/edit',
    fields: {
      reference: 'REPLACE_ME_REFERENCE_ITEM_ID',
      fullName: 'REPLACE_ME_FULLNAME_ITEM_ID',
      email: 'REPLACE_ME_EMAIL_ITEM_ID',
      phone: 'REPLACE_ME_PHONE_ITEM_ID',
      institution: 'REPLACE_ME_INSTITUTION_ITEM_ID',
      message: 'REPLACE_ME_MESSAGE_ITEM_ID',
    },
  },
  // 'job-openings' has no Google Form and stays on-site - it's absent
  // from FORM_CONFIG for that reason.
  //
  // 'nysc-placement' now DOES have a real, client-supplied Google Form
  // (see careerFormRouting.ts on the website side), but it's still
  // absent here on purpose: FORM_CONFIG in this file is only ever read
  // by listFormItems() as a diagnostic helper - this webhook never
  // submits into any Google Form itself (see careerApplicationRouter.gs's
  // header comment), so an entry here isn't required for the pre-filled
  // link to work. The NYSC form's real entry.<id> field mappings already
  // live in the website's careerFormRouting.ts, sourced directly from the
  // client's own "Get pre-filled link" export rather than from
  // listFormItems() run against this form. Add an entry here only if
  // someone needs to run listFormItems() against the NYSC form later
  // (e.g. to map more fields than the 4 currently prefilled).
}

/**
 * A field that exists in the incoming payload but not in a given form's
 * `fields` map (e.g. roleAppliedFor, cvLink - none of the three training
 * forms ask for these) is simply skipped rather than causing an error.
 * See career_application_router.gs's submitToForm_().
 */
