'use strict';
const { productionOrigin } = require('../../www/api-config');
const defaultOrigins = [productionOrigin, 'https://budgetpro.app', 'null'];
function setCors(req, res) {
  const origins = (process.env.VOICE_ALLOWED_ORIGINS || defaultOrigins.join(',')).split(',').map(s => s.trim()).filter(s => s && s !== '*');
  const origin = req.headers.origin;
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'Origin');
  if (origin && !origins.includes(origin)) return false;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  return true;
}
module.exports = { setCors };
