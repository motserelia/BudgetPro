'use strict';
function normalize(text) { return String(text).normalize('NFC').toLowerCase().replace(/[\p{P}\p{S}]/gu,' ').replace(/\s+/g,' ').trim(); }
function distance(a,b) { let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));row=next;}return row[b.length]; }
function metrics(reference,transcript) { const a=normalize(reference),b=normalize(transcript),aw=a?a.split(' '):[],bw=b?b.split(' '):[];return {CER:distance([...a],[...b])/Math.max(1,[...a].length),WER:distance(aw,bw)/Math.max(1,aw.length)}; }
function accept(fixture,transcript) {
  const { normalizeNumbers }=require('../../www/voice/number-normalizer');
  const validator=require('../../www/voice/transcript-validator').validateTranscript(transcript,fixture.language);
  const normalized=normalizeNumbers(transcript,fixture.language),reference=normalizeNumbers(fixture.expected,fixture.language),scores=metrics(reference,normalized);
  const numericExpected=reference.match(/\d+(?:[.,]\d+)?/g)||[],numericActual=normalized.match(/\d+(?:[.,]\d+)?/g)||[];
  const numberNormalization=numericExpected.length?JSON.stringify(numericExpected)===JSON.stringify(numericActual):true;
  const keyWords=fixture.keywords||[];const keywordMatch=keyWords.every(word=>normalize(normalized).includes(normalize(word)));
  return {...scores,scriptValidation:validator.reason,numberNormalization,normalizedTranscript:normalized,keywordMatch,accepted:validator.valid&&keywordMatch&&numberNormalization&&scores.CER<=(fixture.maxCER??.25)};
}
module.exports={normalize,distance,metrics,accept};
