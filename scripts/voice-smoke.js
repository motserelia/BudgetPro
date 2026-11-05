'use strict';
const { args, smoke, safeError } = require('./voice-cli-common');
(async()=> {
  const result = await smoke(args());
  console.log(JSON.stringify({ ok:true, voiceApiUrl:result.voiceApiUrl, httpStatus:result.httpStatus, locale:result.requestedLocale, model:result.model, location:result.region, transcript:result.transcript, normalizedTranscript:result.normalizedTranscript, durationMs:result.requestDurationMs, validation:result.scriptValidation, confidence:result.confidence },null,2));
})().catch(e=>{console.error(JSON.stringify(safeError(e)));process.exitCode=1;});
