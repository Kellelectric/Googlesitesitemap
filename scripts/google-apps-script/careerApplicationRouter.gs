/**
 * Career application webhook - Google Apps Script Web App.
 *
 * Receives the structured application payload the website's
 * /api/careers-application route best-effort forwards to
 * CAREERS_WEBHOOK_URL, verifies it's genuinely from Kell Electricals'
 * pipeline, and logs/acknowledges it.
 *
 * IMPORTANT - this endpoint no longer submits into the applicant's Google
 * Form itself. listFormItems() revealed each of the 3 career Google Forms
 * (apprenticeship, industrial-training, internship) has several REQUIRED
 * file-upload questions (passport photo, ID, CV, certificates) - Apps
 * Script's Forms API has no method to submit a file-upload answer at all,
 * and FormResponse.submit() throws if any required question is left
 * unanswered. So auto-submitting here would fail on every real
 * application. Instead, the website itself builds a Google Forms
 * "pre-filled link" (native ?entry.<id>=value query params) and sends the
 * applicant there directly to finish the form - see
 * src/content/careerFormRouting.ts and docs/careers-automation.md. This
 * webhook is now just a lightweight record/notification point (useful if
 * you later want it to write into an internal tracking Sheet, or trigger
 * a Zoho CRM/email step) - CAREERS_WEBHOOK_URL is REQUIRED for
 * job-openings/nysc-placement (no Google Form, this is their only
 * delivery path) and OPTIONAL/best-effort for the 3 Google Form tracks.
 *
 * DEPLOYMENT (do this in the Apps Script editor, not from this repo):
 *   1. Create a new Apps Script project (script.google.com), paste in this
 *      file plus formConfig.gs and listFormItems.gs.
 *   2. Project Settings > Script Properties > add CAREERS_WEBHOOK_SECRET,
 *      set to the SAME value as the website's CAREERS_WEBHOOK_SECRET env
 *      var. Never hardcode it here.
 *   3. Deploy > New deployment > type "Web app". Execute as "Me", Who has
 *      access "Anyone". Copy the deployment URL.
 *   4. Set the website's CAREERS_WEBHOOK_URL to that deployment URL (in
 *      Vercel's Production environment variables).
 *
 * Nothing above has been done from this coding session - no Google
 * account access exists here. This file is the code; deployment is a
 * REQUIRES EXTERNAL CONFIGURATION step for the client/admin.
 */

function doPost(e) {
  var body
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, reason: 'invalid_json' }, 400)
    }

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
    // so this catches retries and network-level duplicate deliveries. 6
    // hours is the maximum TTL CacheService allows - plenty for this use
    // case.
    var cache = CacheService.getScriptCache()
    var cacheKey = 'careerapp_' + reference
    if (cache.get(cacheKey)) {
      Logger.log('Duplicate submission for reference ' + reference + ' - skipped.')
      return jsonResponse_({ ok: true, duplicate: true, reference: reference }, 200)
    }

    cache.put(cacheKey, '1', 6 * 60 * 60)
    Logger.log(
      'Application ' + reference + ' (' + trackSlug + ') acknowledged. ' +
        (FORM_CONFIG[trackSlug]
          ? 'Applicant was sent a pre-filled link to this track\'s Google Form by the website directly.'
          : 'No Google Form for this track - stays on-site.'),
    )
    return jsonResponse_({ ok: true, reference: reference }, 200)
  } catch (err) {
    // Never leak internal details in the response - log them, return a
    // generic failure with the reference if we got far enough to have one.
    Logger.log('doPost error: ' + err + (err.stack ? '\n' + err.stack : ''))
    return jsonResponse_(
      { ok: false, reason: 'internal_error', reference: (body && body.reference) || null },
      500,
    )
  }
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
  // conveyed in the JSON body's `ok`/`reason` fields instead.
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
