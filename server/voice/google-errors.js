'use strict';
// Return allowlisted technical reasons; Google's raw messages may contain account
// identifiers and are never sent to the renderer or printed by CLI commands.
const messages = {
  API_DISABLED: 'Speech-to-Text API is disabled for the configured Google project.',
  BILLING_DISABLED: 'Google Cloud billing is disabled or unavailable.',
  PERMISSION_DENIED: 'Service account lacks permission. Check roles/speech.client and speech.recognizers.recognize.',
  REGION_UNAVAILABLE: 'The configured region/model is unavailable to this project.',
  QUOTA_EXCEEDED: 'Google Speech quota or request capacity has been exceeded.',
  AUTH_ERROR: 'Google service-account authentication failed.',
  STT_ERROR: 'Google Speech rejected the transcription request.',
};
function googleError(status, body = {}) {
  const error = body.error && typeof body.error === 'object' ? body.error : body;
  const details = Array.isArray(error.details) ? error.details : [];
  const reason = details.map(d => d.reason || '').join(' ').toUpperCase();
  const message = String(error.message || error.error_description || '').toLowerCase();
  let code = 'STT_ERROR';
  if (/SERVICE_DISABLED|API_DISABLED/.test(reason) || /api.*(not.*enabled|disabled)|has not been used/.test(message)) code = 'API_DISABLED';
  else if (/BILLING/.test(reason) || /billing/.test(message)) code = 'BILLING_DISABLED';
  else if (status === 429 || error.status === 'RESOURCE_EXHAUSTED' || /QUOTA/.test(reason)) code = 'QUOTA_EXCEEDED';
  else if (/LOCATION|REGION|MODEL_UNAVAILABLE/.test(reason) || /(?:region|location|model).*(?:not available|unavailable|not supported|unsupported)|expected resource location|model.*not.*(?:available|support)/.test(message)) code = 'REGION_UNAVAILABLE';
  else if (status === 401 || /invalid_grant|invalid_client|unauthenticated/.test(String(error.status || error.error || '') + ' ' + message)) code = 'AUTH_ERROR';
  else if (status === 403 || error.status === 'PERMISSION_DENIED') code = 'PERMISSION_DENIED';
  return Object.assign(new Error(code), { code, status: code === 'QUOTA_EXCEEDED' ? 429 : 502, technicalReason: messages[code] });
}
module.exports = { googleError };
