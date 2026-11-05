'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const source = fs.readFileSync(path.join(__dirname, '../../www/index.js'), 'utf8');
function extract(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}
function node() {
  return { innerHTML: '', value: '', style: { setProperty(name, value) { this[name] = value; } }, dataset: {}, handlers: {}, focus() {},
    classList: { add() {}, remove() {}, contains() { return false; } },
    addEventListener(event, fn) { this.handlers[event] = fn; },
    querySelectorAll() { return []; }, querySelector() { return null; } };
}
function fixture(instant = '2026-11-01T08:00:00Z') {
  const elements = new Map(['mainContent', 'balanceSummaryContainer', 'opsList', 'searchInput', 'searchResultsCount'].map(id => [id, node()]));
  const quickDates = ['today', 'yesterday', 'startOfMonth'].map(qd => { const button = node(); button.dataset.qd = qd; return button; });
  const context = {
    Date: class extends Date { constructor(...args) { super(...(args.length ? args : [instant])); } },
    transactions: [], homeOperationsExpanded: false, startBalanceRub: 100, currentFilter: null, historyFilter: 'allTime',
    displayCurrency: 'RUB', exchangeRates: { RUB: 1, GEL: 0.03 }, currentLang: 'ru',
    currentTab: 'home', simpleMode: false, addModalLastClosedAt: 0, addModalCommitted: false,
    categories: { Coffee: { subcats: [] } }, incomeCategories: { Salary: { subcats: [] } },
    categoryBudgets: {}, addType: 'expense', _lastBalVals: { bal: null, inc: null, exp: null, sal: null },
    document: { getElementById: id => elements.get(id) || null,
      createElement: node, querySelectorAll: selector => selector === '.quick-date-btn' ? quickDates : [],
      head: { appendChild() {} }, body: { appendChild() {} } },
    sym: () => '₽', t: key => key, esc: value => String(value),
    traceApp() {}, traceLayoutSnapshot() {}, updateHeroTrendText() {},
    requestAnimationFrame() {}, setTimeout() {}, haptic() {}, showToast() {},
    updateFrequentStats() {}, updateSuggestions() {}, openModal() {},
    saveAll() { context.saves++; }, saves: 0,
    closeModal(id) { elements.delete(id); },
    createModal(id) {
      const modal = node(); elements.set(id, modal);
      for (const field of ['catLabel', 'addCategorySelect', 'addSubcatDiv', 'addSubcatSelect', 'addAmount', 'addDate', 'addDateDisplay', 'addDateBtn', 'addNote', 'saveAddBtn', 'saveAsTemplateBtn', 'editCategory', 'editAmount', 'editDate', 'editDateDisplay', 'editDateBtn', 'editNote', 'saveEditBtn', 'deleteItemBtn']) elements.set(field, node());
      elements.get('addDate').value = context.today();
      return modal;
    },
    bindTapSafeAction() {}, addSwipeToDelete() {}, showFullHistory() {},
    // Financial rendering runs without a voice module or live browser subscription.
    bindHomeVoiceButton() {}, localStorage: { getItem() { return null; } },
    getCategoryStyle: () => ({ icon: 'x' }),
    getCategoryUiPalette: () => ({ style: { icon: 'x' } }),
    getDisplaySubcategoryLabel: value => value || '',
    showCoinAnimation() {}, showMoneyFlyEffect() {},
    askConfirm(_message, yes) { yes(); },
  };
  context.window = context;
  vm.createContext(context);
  for (const name of ['toDisp', 'toRub', 'localCalendarDate', 'today', 'fmtDate', 'fmt', 'parseMoneyInput', 'isInitialBalanceTx', 'getMoneyTransactions', 'getFinancialTotals', 'filterByTime', 'getFilteredOperations', 'getTopBlockDisplayValues', 'getHomeToolsMarkup', 'getHomeVoiceButtonMarkup', 'getVoiceDraftLabels', 'getFloatingBtnSetting', 'createHomeOperationViewCache', 'animateHomeHeight', 'bindHomeDetailsMotion', 'getHomeOperationsToggleText', 'getHomeOperationsToggleMarkup', 'bindHomeOperationsToggle', 'bindHomeHistoryTools', 'refreshHomeList', 'debounce', 'getDateGroupLabel', 'renderBalanceSummary', 'renderOpsList', 'renderSimpleHome', 'updateTopBlocks', 'refreshOperationViews', 'enhanceSubcategorySelect', 'openAddModal', 'openEditModal', 'updateOperationViewport', 'trackOperationViewport']) vm.runInContext(extract(name), context);
  return { c: context, elements, quickDates };
}
const sample = () => [
  { id: '__initial_balance__', _initial: true, type: 'income', amountRub: 100, date: '2026-11-01' },
  { type: 'income', category: 'Salary', amountRub: 50, date: '2026-10-31' },
  { type: 'expense', category: 'Coffee', subcategory: 'Latte', note: 'Morning', amountRub: 20, date: '2026-11-01' },
];
test('actual balance is invariant under search/type/date filters; initial balance counted once', () => {
  const { c, elements: e } = fixture(); c.transactions = sample();
  for (const filter of [null, 'income', 'expense']) for (const period of ['allTime', 'today', 'thisMonth']) {
    c.currentFilter = filter; c.historyFilter = period; e.get('searchInput').value = 'latte';
    c.renderOpsList();
    assert.equal(c.getTopBlockDisplayValues().balD, 130);
    assert.match(e.get('balanceSummaryContainer').innerHTML, /row-balance[^]*?130\.00 ₽/);
  }
});
test('list and scoped income/expense share search and date filters', () => {
  const { c, elements: e } = fixture(); c.transactions = sample(); c.historyFilter = 'today';
  for (const query of ['LATTE', 'morning', '2026-11-01', '20,00']) {
    e.get('searchInput').value = query; c.renderOpsList();
    assert.match(e.get('opsList').innerHTML, /Coffee/);
    assert.doesNotMatch(e.get('opsList').innerHTML, /Salary/);
    assert.match(e.get('balanceSummaryContainer').innerHTML, /row-expense[^]*?−20\.00 ₽/);
    assert.match(e.get('balanceSummaryContainer').innerHTML, /Результаты поиска/);
  }
  c.currentFilter = 'income'; c.renderOpsList();
  assert.equal(c.getFilteredOperations('latte').length, 0);
  assert.match(e.get('balanceSummaryContainer').innerHTML, /row-expense[^]*?−0\.00 ₽/);
});
test('simple view applies both filters, keeps minus, correct label and currency', () => {
  const { c, elements: e } = fixture(); c.transactions = sample(); c.startBalanceRub = 0;
  c.transactions[2].amountRub = 200; c.simpleMode = true; c.currentFilter = 'expense'; c.historyFilter = 'today';
  c.renderSimpleHome();
  assert.match(e.get('mainContent').innerHTML, /Текущий баланс/);
  assert.match(e.get('mainContent').innerHTML, /-150\.00/);
  assert.match(e.get('mainContent').innerHTML, /Coffee/);
  assert.doesNotMatch(e.get('mainContent').innerHTML, />Salary</);
  c.displayCurrency = 'GEL'; c.sym = () => '₾'; c.renderSimpleHome();
  assert.match(e.get('mainContent').innerHTML, /-4\.50/);
  assert.equal(c.getTopBlockDisplayValues().balD, -4.5);
});
test('actual add/edit/delete handlers refresh normal and simple views once', () => {
  for (const simple of [false, true]) {
    const { c, elements: e } = fixture(); c.simpleMode = simple;
    let renders = 0;
    const original = c[simple ? 'renderSimpleHome' : 'renderOpsList'];
    c[simple ? 'renderSimpleHome' : 'renderOpsList'] = () => { renders++; original(); };
    for (const [type, category, amount] of [['income', 'Salary', '50'], ['expense', 'Coffee', '20']]) {
      c.openAddModal(type); e.get('addCategorySelect').value = category; e.get('addAmount').value = amount;
      e.get('saveAddBtn').handlers.click();
    }
    assert.equal(c.getTopBlockDisplayValues().balD, 130); assert.equal(renders, 2);
    c.openEditModal(1); e.get('editAmount').value = '30'; e.get('editCategory').value = 'Coffee';
    e.get('editDate').value = c.today(); e.get('saveEditBtn').handlers.click();
    assert.equal(c.getTopBlockDisplayValues().balD, 120); assert.equal(renders, 3);
    c.openEditModal(1); e.get('deleteItemBtn').handlers.click();
    assert.equal(c.getTopBlockDisplayValues().balD, 150); assert.equal(renders, 4); assert.equal(c.saves, 4);
    c.displayCurrency = 'GEL'; c.sym = () => '₾'; c.refreshOperationViews();
    assert.equal(c.getTopBlockDisplayValues().balD, 4.5);
  }
});
test('calendar boundaries in Tbilisi, negative UTC offset, leap day and DST', () => {
  const code = `const assert=require('node:assert/strict');
    ${extract('localCalendarDate')}\n${extract('today')}\n${extract('filterByTime')}
    const RealDate=Date;
    for(const [instant,expected] of JSON.parse(process.env.CASES)) {
      global.Date=class extends RealDate {constructor(...args){super(...(args.length?args:[instant]));}};
      assert.equal(today(),expected);
    }
    assert.equal(localCalendarDate(new Date(2024,1,29)), '2024-02-29');`;
  for (const [tz, cases] of [
    ['Asia/Tbilisi', [['2026-10-31T19:59:00Z','2026-10-31'],['2026-10-31T20:01:00Z','2026-11-01'],['2026-12-31T20:01:00Z','2027-01-01']]],
    ['America/Los_Angeles', [['2026-11-01T06:59:00Z','2026-10-31'],['2026-11-01T07:01:00Z','2026-11-01'],['2026-03-08T09:59:00Z','2026-03-08'],['2026-03-08T10:01:00Z','2026-03-08']]],
  ]) {
    const result = spawnSync(process.execPath, ['-e', code], { env: { ...process.env, TZ: tz, CASES: JSON.stringify(cases) }, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
});
test('week is Monday–Sunday, month excludes adjacent months, yesterday/two days ago', () => {
  const { c } = fixture('2026-11-01T08:00:00Z');
  const dates = ['2026-10-25','2026-10-26','2026-10-30','2026-10-31','2026-11-01','2026-11-02','2026-11-30','2026-12-01'];
  const rows = dates.map(date => ({ date }));
  const selected = period => Array.from(c.filterByTime(rows, period), tx => tx.date);
  assert.deepEqual(selected('thisWeek'), dates.slice(1,5));
  assert.deepEqual(selected('thisMonth'), dates.slice(4,7));
  assert.deepEqual(selected('yesterday'), ['2026-10-31']);
  assert.deepEqual(selected('twoDaysAgo'), ['2026-10-30']);
});

test('actual quick-date handlers use the local calendar at Tbilisi midnight', () => {
  const previousTZ = process.env.TZ;
  process.env.TZ = 'Asia/Tbilisi';
  try {
    const { c, elements: e, quickDates } = fixture('2026-10-31T20:01:00Z');
    c.openAddModal();
    for (const [index, expected] of [[0, '2026-11-01'], [1, '2026-10-31'], [2, '2026-11-01']]) {
      quickDates[index].handlers.click();
      assert.equal(e.get('addDate').value, expected);
    }
    const yesterday = [{date: '2026-10-31'}, {date: '2026-11-01'}];
    assert.deepEqual(Array.from(c.filterByTime(yesterday, 'yesterday'), tx => tx.date), ['2026-10-31']);
  } finally {
    if (previousTZ === undefined) delete process.env.TZ;
    else process.env.TZ = previousTZ;
  }
});

test('monthly hero totals exclude other months and initial balance, without changing overall balance', () => {
  const { c } = fixture(); c.transactions = sample();
  c.transactions.push({type:'income',category:'Gift',amountRub:75,date:'2026-11-01'});
  const totals = c.getTopBlockDisplayValues();
  assert.equal(totals.balD, 205);
  assert.equal(totals.incD, 75);
  assert.equal(totals.expD, 20);
  c.currentFilter = 'expense'; c.historyFilter = 'yesterday';
  assert.equal(c.getTopBlockDisplayValues().incD, 75);
  c.displayCurrency='GEL';
  assert.equal(c.getTopBlockDisplayValues().incD, 2.25);
});
test('both home previews cap at three; full result totals are not truncated', () => {
  const { c, elements:e } = fixture();
  c.transactions = Array.from({length:6}, (_,i)=>({type:'expense',category:'Item'+i,amountRub:10,date:'2026-11-01',time:'12:0'+i}));
  c.renderOpsList();
  assert.equal((e.get('opsList').innerHTML.match(/class="op-card"/g)||[]).length, 3);
  assert.match(e.get('opsList').innerHTML, /Item5/);
  assert.doesNotMatch(e.get('opsList').innerHTML, /Item0/);
  assert.match(e.get('balanceSummaryContainer').innerHTML, /−60\.00 ₽/);
  assert.equal(c.getFilteredOperations().length, 6);
  c.simpleMode=true; c.renderSimpleHome();
  assert.equal((e.get('mainContent').innerHTML.match(/class="sm-op-row"/g)||[]).length, 3);
  assert.match(e.get('mainContent').innerHTML, /Item5/);
  assert.match(e.get('mainContent').innerHTML, /homeDetails/);
});

for (const simple of [false, true]) {
  test(`home expand/collapse: 0, 1, 3, 5, 20 and 2000 rows; simple=${simple}`, () => {
    for (const count of [0, 1, 3, 5, 20, 2000]) {
      const { c, elements: e } = fixture(); c.simpleMode = simple;
      c.transactions = Array.from({length:count}, (_,i)=>({id:'tx'+i,type:'expense',category:'Item'+i,amountRub:i+1,date:'2026-11-01',time:'12:00'}));
      const original = JSON.stringify(c.transactions);
      const render = () => simple ? c.renderSimpleHome() : c.renderOpsList();
      const html = () => e.get(simple ? 'mainContent' : 'opsList').innerHTML;
      const rowCount = () => (html().match(simple ? /class="sm-op-row"/g : /class="op-card"/g)||[]).length;
      render();
      assert.equal(rowCount(), Math.min(count, 3));
      assert.equal(html().includes('id="homeOpsToggleBtn"'), count > 3);
      if (count > 3) {
        assert.ok(html().includes(`Показать все (${count})`));
        e.set('homeOpsToggleBtn', node());
        c.bindHomeOperationsToggle(); e.get('homeOpsToggleBtn').handlers.click();
        assert.equal(rowCount(), count);
        const indexes = Array.from(html().matchAll(simple ? /class="sm-op-row" data-idx="(\d+)"/g : /class="op-card" data-idx="(\d+)"/g), match => Number(match[1]));
        assert.deepEqual(indexes, Array.from({length:count}, (_,i)=>i));
        assert.ok(html().includes('aria-expanded="true"'));
        assert.ok(html().includes('Свернуть'));
        c.refreshOperationViews(); assert.equal(rowCount(), count);
        e.get('homeOpsToggleBtn').handlers.click(); assert.equal(rowCount(), 3);
      }
      assert.equal(JSON.stringify(c.transactions), original);
      assert.equal(c.saves, 0);
    }
  });
}
test('expanded state survives filtering, empty results, data refresh and mode switches', () => {
  const { c, elements:e } = fixture();
  c.transactions = Array.from({length:20},(_,i)=>({id:'tx'+i,type:i<5?'income':'expense',category:'Item'+i,amountRub:i+1,date:i<10?'2026-11-01':'2026-10-01'}));
  c.homeOperationsExpanded=true; c.currentFilter='income'; c.renderOpsList();
  assert.ok(e.get('opsList').innerHTML.includes('Свернуть'));
  assert.equal((e.get('opsList').innerHTML.match(/class="op-card"/g)||[]).length, 5);
  e.get('searchInput').value='does not exist'; c.renderOpsList();
  assert.doesNotMatch(e.get('opsList').innerHTML, /homeOpsToggleBtn/);
  assert.equal(c.homeOperationsExpanded,true);
  e.get('searchInput').value=''; c.currentFilter=null; c.historyFilter='today'; c.renderOpsList();
  assert.equal((e.get('opsList').innerHTML.match(/class="op-card"/g)||[]).length, 10);
  c.simpleMode=true; c.refreshOperationViews();
  assert.equal((e.get('mainContent').innerHTML.match(/class="sm-op-row"/g)||[]).length, 10);
  c.transactions.push({id:'new',type:'expense',category:'New',amountRub:42,date:'2026-11-01'});
  c.refreshOperationViews();
  assert.equal((e.get('mainContent').innerHTML.match(/class="sm-op-row"/g)||[]).length, 11);
  c.transactions.splice(0,1); c.refreshOperationViews();
  assert.equal((e.get('mainContent').innerHTML.match(/class="sm-op-row"/g)||[]).length, 10);
  c.simpleMode=false; c.refreshOperationViews();
  assert.equal((e.get('opsList').innerHTML.match(/class="op-card"/g)||[]).length, 10);
});

test('operation viewport tracks keyboard resize once and leaves other dialogs untouched', () => {
  const { c, elements:e } = fixture();
  const add = node(), voice = node(), auth = node(), confirm = node();
  e.set('addModal',add); e.set('voiceModal',voice); e.set('authModal',auth); e.set('confirmOverlay',confirm);
  const listeners = [];
  c.innerHeight = 740;
  c.visualViewport = { height:440, offsetTop:20, addEventListener(type, handler) { listeners.push({type,handler}); } };
  c.addEventListener = (type,handler) => listeners.push({type,handler});
  c.requestAnimationFrame = fn => fn();
  c.trackOperationViewport(add); c.trackOperationViewport(add);
  assert.equal(listeners.length,3);
  assert.equal(add.style['--operation-viewport-height'],'440px');
  assert.equal(add.style['--operation-viewport-top'],'20px');
  assert.equal(add.style['--operation-viewport-bottom'],'280px');
  assert.equal(confirm.style['--operation-viewport-height'],'440px');
  assert.equal(voice.style['--operation-viewport-height'],undefined);
  assert.equal(auth.style['--operation-viewport-height'],undefined);
  c.visualViewport.height=740; c.visualViewport.offsetTop=0; listeners[0].handler();
  assert.equal(add.style['--operation-viewport-bottom'],'0px');
  assert.equal(add.style['--operation-viewport-height'],'740px');
});

test('large home lists reuse category/date presentation within a render and invalidate it on the next', () => {
  const { c } = fixture(); let styles=0, palettes=0, dates=0;
  c.getCategoryStyle=()=>({icon:++styles});
  c.getCategoryUiPalette=()=>({icon:++palettes});
  c.fmtDate=()=>String(++dates);
  const cache=c.createHomeOperationViewCache();
  const tx={type:'expense',category:'Food',date:'2026-11-01'};
  for(let i=0;i<2000;i++){cache.style(tx);cache.palette(tx);cache.date(tx);}
  assert.equal(styles,1); assert.equal(palettes,1); assert.equal(dates,1);
  const next=c.createHomeOperationViewCache(); next.style(tx);next.palette(tx);next.date(tx);
  assert.equal(styles,2); assert.equal(palettes,2); assert.equal(dates,2);
});
test('show-all counter uses the actual type, period and search result count in both modes', () => {
  for (const simple of [false,true]) {
    const { c, elements:e }=fixture(); c.simpleMode=simple;
    c.transactions=Array.from({length:20},(_,i)=>({id:'row'+i,type:i<15?'expense':'income',category:'Item'+i,amountRub:100+i,date:i<10?'2026-11-01':'2025-01-01'}));
    const render=query=>{e.get('searchInput').value=query; if(simple)c.renderSimpleHome(query);else c.renderOpsList();return e.get(simple?'mainContent':'opsList').innerHTML;};
    c.currentFilter='expense';assert.ok(render('').includes('Показать все (15)'));
    c.historyFilter='today';assert.ok(render('').includes('Показать все (10)'));
    assert.doesNotMatch(render('Item1'),/id="homeOpsToggleBtn"/);
    c.historyFilter='allTime';assert.ok(render('Item1').includes('Показать все (6)'));
  }
});


test('home motion cancels stale completion and restores styles; reduced motion is immediate', () => {
  const { c } = fixture();
  const element = node(), animations = [];
  element.isConnected = true;
  element.style = { height: '', overflow: 'visible', opacity: '' };
  c.getComputedStyle = () => ({ opacity: '.8' });
  c.matchMedia = () => ({ matches: false });
  element.animate = (frames, options) => {
    const animation = { frames, options, cancel() { this.cancelled = true; } };
    animations.push(animation); return animation;
  };
  let completed = 0;
  c.animateHomeHeight(element, 0, 300, () => { completed++; });
  assert.equal(animations[0].options.duration, 260);
  const stale = animations[0].onfinish;
  c.animateHomeHeight(element, 120, 0, () => { completed += 10; }, true);
  assert.equal(animations[0].cancelled, true);
  stale(); assert.equal(completed, 0);
  animations[1].onfinish();
  assert.equal(completed, 10);
  assert.equal(element.style.overflow, 'visible');
  assert.equal(element._homeMotion, null);
  c.matchMedia = () => ({ matches: true });
  c.animateHomeHeight(element, 0, 300, () => { completed++; });
  assert.equal(completed, 11);
  assert.equal(animations.length, 2);
});
