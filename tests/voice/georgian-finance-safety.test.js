'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const { normalizeNumbers } = require('../../www/voice/number-normalizer');
const source = fs.readFileSync('www/index.js', 'utf8');
function extract(name) { const start = source.indexOf(`function ${name}(`); assert.ok(start >= 0); return source.slice(start, source.indexOf('\n}', start) + 2); }
function fixture() {
  const context = { currentLang: 'ka', BudgetPROVoiceNumberNormalizer: { normalizeNumbers }, findVoiceLearningHint: () => null, findVoiceCategoryByLabel: () => '', findVoiceSubcategory: () => ({}), getVoiceCategoryObject: type => type === 'income' ? { 'Зарплата': {} } : { 'Кофе': {}, 'Транспорт': {} } };
  for (const name of ['normalizeVoiceMeaningText', 'parseVoiceNumericCandidate', 'parseGeorgianCompactNumberToken', 'parseVoiceTokenNumber', 'parseVoiceNumericPhrase', 'parseGeorgianMoneyUnits', 'resolveVoiceExistingCategory', 'parseVoiceNumberWords', 'extractVoiceCurrencyPairAmount', 'extractVoiceAmount', 'buildVoiceDraftFromText']) vm.runInNewContext(extract(name), context);
  return context;
}
test('actual baseline/context transcripts remain unknown amounts; clean text controls cover GEL/tetri (text only)', () => {
  const ctx = fixture();
  const cases = [
    ['baseline actual', 'ავაში არვა ლარი გადავიხადე.', null, 'expense', ''],
    ['ka-context actual', 'ავაში არვა ლარი გადავიხადე', null, 'expense', ''],
    ['control, not Vosk result', 'ყავაში რვა ლარი გადავიხადე', 8, 'expense', 'Кофе'],
    ['control, not Vosk result', 'ყავაში რვა ლარი ორმოცდაათი თეთრი გადავიხადე', 8.5, 'expense', 'Кофе'],
    ['control, not Vosk result', 'ხელფასი ორი ათას ხუთასი ლარი მივიღე', 2500, 'income', 'Зарплата'],
    ['control, not Vosk result', 'ყავაში ოცდარვა ლარი გადავიხადე', 28, 'expense', 'Кофе'],
    ['missing amount', 'ყავაში ლარი გადავიხადე', null, 'expense', 'Кофе'],
  ];
  for (const [label, text, amount, type, category] of cases) {
    const draft = ctx.buildVoiceDraftFromText(normalizeNumbers(text, 'ka'));
    assert.equal(draft.amount, amount, label + ': ' + text); assert.equal(draft.type, type); assert.equal(draft.category, category);
    assert.equal(Object.hasOwn(draft, 'currency'), false); // Currency is not independently inferred by this parser.
  }
});
test('standalone fifty tetri is 0.50, not 50', () => {
  assert.equal(fixture().buildVoiceDraftFromText(normalizeNumbers('ყავაში ორმოცდაათი თეთრი გადავიხადე', 'ka')).amount, .5);
});
test('ordinary save rejects missing/zero/negative amounts before any write or conversion (no phone clicks)', () => {
  let notices = 0;
  const ctx = { getVoiceDraftLabels: () => ({ amountMissing: 'missing' }), showToast: () => notices++, today: () => '2026-11-02', toRub: () => { throw Error('MUST_NOT_CONVERT_OR_SAVE'); }, transactions: [] };
  const start = source.indexOf('function saveVoiceDraftTransaction(');
  vm.runInNewContext(source.slice(start, source.indexOf('\nfunction openVoiceQuickModal', start)), ctx);
  for (const amount of [undefined, null, NaN, 0, -1, Infinity]) assert.equal(ctx.saveVoiceDraftTransaction({ type: 'expense', category: 'Кофе', amount }), false);
  assert.equal(notices, 6); assert.equal(ctx.transactions.length, 0);
});
