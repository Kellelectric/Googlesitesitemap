/**
 * Career application router - Google Apps Script Web App.
 *
 * Receives the structured application payload (forwarded by Zoho Flow, or
 * directly from the website if CAREERS_WEBHOOK_URL is pointed straight at
 * this deployment's Web App URL - see docs/careers-automation.md), verifies
 * it's genuinely from Kell Electricals' pipeline, and submits it into the
 * correct Google Form for the applicant's track using FormApp - which
 * writes to that form's own linked Google Sheet automatically, exactly as
 * a real form submission would.
 *
 * DEPLOYMENT (do this in the Apps Script editor, not from this repo):
 *   1. Create a new Apps Script project (script.google.com), paste in this
 *      file plus form_config.gs and list_form_items.gs.
 *   2. Project Settings > Script Properties > add CAREERS_WEBHOOK_SECRET,
 *      set to the SAME value as the website's CAREERS_WEBHOOK_SECRET env
 *      var. Never hardcode it here.
 *   3. Run listFormItems() once, fill in FORM_CONFIG's field IDs in
 *      form_config.gs (see that file's own instructions).
 *   4. Deploy > New deployment > type "Web app". Execute as "Me", Who has
 *      access "Anyone". Copy the deployment URL.
 *   5. Either point Zoho Flow's action at that URL, or (skipping Zoho Flow
 *      entirely) set the website's CAREERS_WEBHOOK_URL directly to it.
 *
 * Nothing above has been done from this coding session - no Google
 * account access exists here. This file is the code; deployment is a
 * REQUIRES EXTERNAL CONFIGURATION step for the client/admin.
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, reason: 'invalid_json' }, 400)
    }

    var body
    try {
      body = JSON.parse(e.postData.contents)
    } catch (err) {
      return jsonResponse_({ ok: false, reason: 'invalid_json' }, 400)
    }

    // --- Signature verification -------------------------------------
    var secret = PropertiesService.getScriptProperties().getProperty(
      'CAREERS_WEBHOOK_SECRET',
    )
    if (secret) {
      var signature =
        (e.parameter && e.parameter['x-webhook-signature']) ||
        (e.headers && e.headers['x-webhook-signature']) ||
        body.__signature // fallback if the caller can't set custom headers
      if (!signature || !verifySignature_(e.postData.contents, secret, signature)) {
        Logger.log('Rejected request with invalid/missing signature.')
        return jsonResponse_({ ok: false, reason: 'invalid_signature' }, 401)
      }
    }
    // If CAREERS_WEBHOOK_SECRET is not set in Script Properties, requests
    // are accepted unsigned - set it before going live. Documented in
    // docs/careers-automation.md's security section.

    // --- Required-field validation ------------------------------------
    var required = ['reference', 'trackSlug', 'fullName', 'email', 'phone']
    for (var i = 0; i < required.length; i++) {
      if (!body[required[i]]) {
        return jsonResponse_({ ok: false, reason: 'missing_field', field: required[i] }, 422)
      }
    }

    var trackSlug = body.trackSlug
    var reference = body.reference

    // --- Duplicate protection (durable, TTL-based) ---------------------
    // CacheService persists across executions (unlike an in-memory map),
    // so this catches Zoho Flow retries, Apps Script's own retry-on-error
    // behavior, and network-level duplicate deliveries. 6 hours is the
    // maximum TTL CacheService allows - plenty for this use case.
    var cache = CacheService.getScriptCache()
    var cacheKey = 'careerapp_' + reference
    if (cache.get(cacheKey)) {
      Logger.log('Duplicate submission for reference ' + reference + ' - skipped.')
      return jsonResponse_({ ok: true, duplicate: true, reference: reference }, 200)
    }

    // job-openings (and any other track with no FORM_CONFIG entry) never
    // reaches a Google Form - acknowledge success without submitting
    // anywhere, so Zoho Flow's own next step (e.g. writing to the central
    // applicant sheet, or a Zoho CRM/Recruit action) can take over.
    var formConfig = FORM_CONFIG[trackSlug]
    if (!formConfig) {
      Logger.log(
        'No Google Form configured for track "' +
          trackSlug +
          '" (reference ' +
          reference +
          ') - acknowledging without a form submission. This is expected for job-openings.',
      )
      cache.put(cacheKey, '1', 6 * 60 * 60)
      return jsonResponse_({ ok: true, reference: reference, routed: false }, 200)
    }

    submitToForm_(formConfig, body)
    cache.put(cacheKey, '1', 6 * 60 * 60)
    Logger.log('Application ' + reference + ' (' + trackSlug + ') submitted to Google Form.')
    return jsonResponse_({ ok: true, reference: reference, routed: true }, 200)
  } catch (err) {
    // Never leak internal details in the response - log them, return a
    // generic failure with the reference if we got far enough to have one.
    Logger.log('doPost error: ' + err + (err.stack ? '\n' + err.stack : ''))
    return jsonResponse_(
      { ok: false, reason: 'internal_error', reference: (typeof body !== 'undefined' && body.reference) || null },
      500,
    )
  }
}

/**
 * Builds a FormResponse from formConfig.fields -> body's matching value and
 * submits it. A payload field with no corresponding entry in this form's
 * `fields` map (e.g. roleAppliedFor on a training form that doesn't ask
 * for it) is silently skipped rather than erroring - not every form asks
 * every question.
 */
function submitToForm_(formConfig, body) {
  var form = FormApp.openByUrl(formConfig.formUrl)
  var formResponse = form.createResponse()

  var valueByFieldKey = {
    reference: body.reference,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    institution: body.courseOrInstitution || '',
    message: body.message || '',
  }

  Object.keys(formConfig.fields).forEach(function (fieldKey) {
    var itemId = formConfig.fields[fieldKey]
    if (!itemId || itemId.indexOf('REPLACE_ME') === 0) {
      // Not configured yet - see form_config.gs's setup instructions.
      Logger.log(
        'Skipping unconfigured field "' + fieldKey + '" - run listFormItems() and set its real item ID.',
      )
      return
    }
    var value = valueByFieldKey[fieldKey]
    if (value === undefined || value === null || value === '') return

    var item = form.getItemById(itemId)
    if (!item) {
      Logger.log('Item ID "' + itemId + '" for field "' + fieldKey + '" not found on this form.')
      return
    }
    var itemResponse = buildItemResponse_(item, String(value))
    if (itemResponse) formResponse.withItemResponse(itemResponse)
  })

  formResponse.submit()
}

/**
 * Builds the right kind of ItemResponse for the item's actual type. Every
 * field this pipeline sends is free-text, so TEXT and PARAGRAPH_TEXT cover
 * the real cases; anything else logs a warning rather than throwing, since
 * a form question of an unexpected type (e.g. multiple choice) needs a
 * human to decide how to map an arbitrary string onto it.
 */
function buildItemResponse_(item, value) {
  var type = item.getType()
  if (type === FormApp.ItemType.TEXT) {
    return item.asTextItem().createResponse(value)
  }
  if (type === FormApp.ItemType.PARAGRAPH_TEXT) {
    return item.asParagraphTextItem().createResponse(value)
  }
  Logger.log(
    'Item "' + item.getTitle() + '" is type ' + type + ', not TEXT/PARAGRAPH_TEXT - skipped. ' +
      'If this field should receive a value, either change the question type in the Google Form, ' +
      'or extend buildItemResponse_() to handle it.',
  )
  return null
}

/** Hex-encoded HMAC-SHA256, matching the website's signPayload() exactly. */
function computeHmacHex_(payload, secret) {
  var signatureBytes = Utilities.computeHmacSha256Signature(payload, secret)
  return signatureBytes
    .map(function (byte) {
      var hex = (byte < 0 ? byte + 256 : byte).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    })
    .join('')
}

/** Constant-time-ish comparison - avoids a naive === that short-circuits on first mismatch. */
function verifySignature_(payload, secret, providedSignature) {
  var expected = computeHmacHex_(payload, secret)
  if (expected.length !== providedSignature.length) return false
  var mismatch = 0
  for (var i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ providedSignature.charCodeAt(i)
  }
  return mismatch === 0
}

function jsonResponse_(body, statusCode) {
  // Apps Script Web Apps cannot set a custom HTTP status code on the
  // response (a platform limitation, not a bug here) - status is
  // conveyed in the JSON body's `ok`/`reason` fields instead. Document
  // this for whoever configures Zoho Flow's error handling on this step.
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
