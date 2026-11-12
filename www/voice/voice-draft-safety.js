(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.VoiceDraftSafety=api;})(globalThis,()=>{
 'use strict';
 function check(text,configuredCurrency){
  const s=String(text).toLowerCase(), currencies=[];
  for(const [code,re]of Object.entries({GEL:/ლარ(?:ი|ს|ად)|თეთრ|\b(?:gel|lar[ry]*i?(?:e?s)?|tet[ry]*a?i?(?:e?s)?)\b|лар[р]?и|тет[р]?и|₾/u,USD:/\busd\b|dollars?|доллар|\$/u,EUR:/\beur\b|euros?|евро|€/u,RUB:/(?<![\p{L}])(?:руб(?:ль|ля|лей|ли|лях)?|копе(?:йка|йки|ек|йку)|rub)(?![\p{L}])|₽/u}))if(re.test(s))currencies.push(code);
  if(/(?:^|[\s(])(?:[-−]|минус\s+|minus\s+|მინუს\s+)\d/u.test(s))return {valid:false,error:'VOICE_AMBIGUOUS_AMOUNT'};
  if(/(?<![\p{L}])цент(?:а|ов)?(?![\p{L}])/u.test(s))return {valid:false,error:'VOICE_AMBIGUOUS_AMOUNT'};
  if(currencies.length>1)return {valid:false,error:'VOICE_AMBIGUOUS_AMOUNT'};
  if(currencies[0]&&currencies[0]!==configuredCurrency)return {valid:false,error:'VOICE_CURRENCY_MISMATCH',currency:currencies[0]};
  const money=[...s.matchAll(/[−+-]?\d+(?:[.,]\d+)?\s*(ლარი|ლარს|თეთრი|лар[р]?и|тет[р]?и|lar[ry]*i?(?:e?s)?|gel|tet[ry]*a?i?(?:e?s)?|usd|eur|rub|руб\p{L}*|коп\p{L}*|доллар\p{L}*|евро|dollars?|cents?|[₾$€₽])(?![\p{L}])/gu)];
  if(!money.length&&[...s.matchAll(/\d+(?:[.,]\d+)?/gu)].length>1)return {valid:false,error:'VOICE_MULTIPLE_OPERATIONS'};
  let independent=0;
  for(let i=0;i<money.length;i++){
   const minor=/^(თეთრი|tet[ry]*a?i?(?:e?s)?|тет[р]?и|коп|cents?)/u.test(money[i][1]);
   const previous=money[i-1],gap=previous?s.slice(previous.index+previous[0].length,money[i].index):'';
   if(!(minor&&previous&&!/^(თეთრი|tet[ry]*a?i?(?:e?s)?|тет[р]?и|коп|cents?)/u.test(previous[1])&&/^\s*(?:და|и|and)?\s*$/u.test(gap)))independent++;
  }
  if(independent>1)return {valid:false,error:'VOICE_MULTIPLE_OPERATIONS'};
  return {valid:true,currency:currencies[0]||null};
 }
 return {check};
});
