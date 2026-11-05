(function(root, factory) { const api = factory(); if (typeof module === 'object') module.exports = api; root.VoiceTranscriptValidator = api; })(globalThis, () => {
  'use strict';
  function analyzeTranscriptScript(text) {
    const count = pattern => (String(text).match(pattern) || []).length;
    const georgian = count(/\p{Script=Georgian}/gu), cyrillic = count(/\p{Script=Cyrillic}/gu), latin = count(/\p{Script=Latin}/gu), digits = count(/\p{Nd}/gu);
    const letters = count(/\p{L}/gu) || 1;
    return { georgian, cyrillic, latin, digits, georgianRatio: georgian / letters, cyrillicRatio: cyrillic / letters, latinRatio: latin / letters };
  }
  function validateTranscript(text, language) {
    text = String(text || '').normalize('NFC').trim();
    const script = analyzeTranscriptScript(text);
    if (!text) return { valid: false, reason: 'NO_SPEECH', script };
    const numeric = /\p{Nd}/u.test(text) && /^[\p{Nd}\s.,:;!?+\-()%₾$€£₽/]+$/u.test(text);
    const expected = { ka: 'georgian', ru: 'cyrillic', en: 'latin' }[language];
    const valid = numeric || !expected || script[expected] > 0;
    return { valid, reason: valid ? 'valid' : 'invalid-script', script };
  }
  return { analyzeTranscriptScript, validateTranscript };
});
