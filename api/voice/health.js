'use strict';
const { health } = require('../../server/voice/asr');
const { setCors } = require('../../server/voice/cors');
module.exports = (req, res) => {
  if (!setCors(req, res)) { res.statusCode = 403; res.end(JSON.stringify({ ok: false, error: 'CORS_DENIED' })); return; }
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'GET') { res.statusCode = 405; res.end(JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' })); return; }
  res.statusCode = 200; res.end(JSON.stringify(health()));
};
