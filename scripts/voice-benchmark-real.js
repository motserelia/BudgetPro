'use strict';
const fs=require('node:fs'),path=require('node:path');
const {args,smoke,safeError}=require('./voice-cli-common');
const {accept}=require('../server/voice/metrics');
(async()=>{
 const options=args(),manifest=require('../tests/voice/fixtures/manifest.json');const rows=[];let skipped=0,failed=0;
 for(const fixture of manifest){const file=path.join('tests/voice/fixtures',fixture.file);if(!fs.existsSync(file)){skipped++;continue;}
  try{const r=await smoke({...options,file,lang:fixture.language,mode:fixture.mode});const a=accept(fixture,r.transcript);rows.push({language:fixture.language,fixture:fixture.file,reference:fixture.expected,transcript:r.transcript,CER:a.CER.toFixed(3),WER:a.WER.toFixed(3),duration:r.requestDurationMs,scriptValidation:a.scriptValidation,numberNormalization:a.numberNormalization,accepted:a.accepted});if(!a.accepted)failed++;}
  catch(e){rows.push({language:fixture.language,fixture:fixture.file,...safeError(e)});failed++;}
 }
 console.table(rows);console.log(JSON.stringify({realTestsExecuted:rows.length,missingHumanFixtures:skipped,failed}));if(!rows.length||failed)process.exitCode=1;
})().catch(e=>{console.error(JSON.stringify(safeError(e)));process.exitCode=1;});
