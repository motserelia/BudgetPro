const test = require('node:test'), assert = require('node:assert/strict');
const { validateTranscript: v, analyzeTranscriptScript: a } = require('../../www/voice/transcript-validator');
for (const [lang,text,valid] of [['ka','გამარჯობა',true],['ka','Сегодня я пошёл домой',false],['ka','Hello',false],['ka','25',true],['ka','16:30',true],['ka','25 ₾',true],['ka','123 abc',false],['ka','',false],['ru','Кофе',true],['en','Coffee',true]]) test(`${lang} ${text}: ${valid}`,()=>assert.equal(v(text,lang).valid,valid));
test('Unicode script counts include Georgian Mtavruli',()=> { const s = a('Გა Яa25'); assert.equal(s.georgian,2); assert.equal(s.cyrillic,1); assert.equal(s.latin,1); assert.equal(s.digits,2); assert.equal(s.georgianRatio,.5); });
