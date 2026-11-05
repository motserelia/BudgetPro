'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../../www/index.js'), 'utf8');
function extract(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}
function fixture() {
  const context = { window: {}, CATEGORY_EMOJI_MATCHES: [], detectEmojiByText: (_name, _type, fallback) => fallback };
  vm.createContext(context);
  for (const name of ['normalizeEmojiSearchText', 'splitEmojiLabel', 'composeEmojiLabel', 'getSubcategoryIcon', 'getDisplaySubcategoryLabel']) vm.runInContext(extract(name), context);
  const start = source.indexOf('const STANDARD_EXPENSE_SUBCATEGORY_ICONS =');
  vm.runInContext(source.slice(start, source.indexOf('\n\nfunction getSubcategoryIcon', start)), context);
  vm.runInContext(source.slice(source.indexOf('window.categories = {'), source.indexOf('window.incomeCategories = {')), context);
  return context;
}
test('every shipped expense subcategory has a thematic icon without mutating names or data', () => {
  const c = fixture(), before = JSON.stringify(c.window.categories);
  const subcategories = Object.values(c.window.categories).flatMap(category => category.subcats);
  assert.equal(subcategories.length, 23);
  for (const name of subcategories) {
    const icon = c.getSubcategoryIcon(name);
    assert.ok(icon && icon !== '🔖', name);
    assert.equal(c.getDisplaySubcategoryLabel(name), `${icon} ${name}`);
  }
  assert.equal(JSON.stringify(c.window.categories), before);
});
test('aliases, user emoji and unknown user subcategories preserve the original label', () => {
  const c = fixture();
  for (const [ka, ru, en] of [['წყალი','Вода','Water'], ['პური','Хлеб','Bread'], ['ბენზინი','Бензин','Gasoline']]) {
    assert.equal(c.getSubcategoryIcon(ka), c.getSubcategoryIcon(ru));
    assert.equal(c.getSubcategoryIcon(ru), c.getSubcategoryIcon(en));
  }
  assert.equal(c.getDisplaySubcategoryLabel('💧 წყალი'), '💧 წყალი');
  assert.equal(c.getDisplaySubcategoryLabel('წყალი 💧'), 'წყალი 💧');
  assert.equal(c.getDisplaySubcategoryLabel('My 🌟 project'), 'My 🌟 project');
  assert.equal(c.getDisplaySubcategoryLabel('🧪 ჩემი ახალი ქვეკატეგორია'), '🧪 ჩემი ახალი ქვეკატეგორია');
  assert.equal(c.getDisplaySubcategoryLabel('My custom item'), '🔖 My custom item');
  assert.equal(c.getDisplaySubcategoryLabel(''), '');
  assert.equal(c.getDisplaySubcategoryLabel('Bonus','income'), 'Bonus');
});
