/**
 * Admin utility - run this manually from the Apps Script editor
 * (Run > listFormItems) to print every question's title, type, and item
 * ID for each of the 3 career-application Google Forms. Use the output to
 * fill in FORM_CONFIG's `fields` maps in form_config.gs.
 *
 * This exists specifically because the spec this pipeline follows
 * forbids guessing entry.xxxxx-style field IDs from a public viewform
 * URL - there is no reliable public contract for those, so the only
 * trustworthy source is asking each Form object directly via FormApp.
 *
 * Output goes to View > Logs (or Executions) in the Apps Script editor.
 */
function listFormItems() {
  Object.keys(FORM_CONFIG).forEach(function (trackSlug) {
    var config = FORM_CONFIG[trackSlug]
    Logger.log('=== FORM: ' + trackSlug + ' ===')
    Logger.log('URL: ' + config.formUrl)

    var form
    try {
      form = FormApp.openByUrl(config.formUrl)
    } catch (err) {
      Logger.log(
        'Could NOT open this form. Confirm the script is running as an account with edit access to it, and that the URL is correct. Error: ' +
          err,
      )
      return
    }

    var items = form.getItems()
    if (items.length === 0) {
      Logger.log('(This form has no questions.)')
    }
    items.forEach(function (item) {
      Logger.log(
        'Item: ' +
          item.getTitle() +
          '  |  Type: ' +
          item.getType() +
          '  |  ID: ' +
          item.getId(),
      )
    })
    Logger.log('') // blank line between forms
  })

  Logger.log(
    'Copy the ID values above into FORM_CONFIG in form_config.gs, matching each question to the right field (reference, fullName, email, phone, institution, message).',
  )
}
