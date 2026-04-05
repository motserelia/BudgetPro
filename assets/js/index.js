"use strict";

// ========== EMOJI MAP ==========
const EMOJI_MAP = [
  [/квартир|аренд|жиль|недвижим/i, "🏠"],
  [/коммунал|свет|вода|газ|электр|отоплен|мусор/i, "💡"],
  [/продукт|еда|магазин|супермаркет/i, "🛒"],
  [/кафе|ресторан|обед|ужин|завтрак/i, "🍽️"],
  [/транспорт|такси|автобус|метро|бензин|машин|авто/i, "🚗"],
  [/одежд|гардероб|обувь/i, "👕"],
  [/ребён|ребенок|дети|детск|игрушк/i, "👶"],
  [/жен|супруг/i, "👩"],
  [/медицин|врач|аптек|здоровь|лечен|больниц/i, "🏥"],
  [/образован|курс|учёб|учеб|школ|универ|книг|репетит/i, "📚"],
  [/подписк|netflix|spotify|онлайн|стриминг/i, "📱"],
  [/ремонт|хозтовар|инструмент|строит/i, "🔧"],
  [/подарок|праздник|день рожд|свадьб/i, "🎁"],
  [/связь|телефон|интернет|мобильн/i, "📞"],
  [/развлечен|кино|театр|игр|отдых/i, "🎭"],
  [/сбережен|инвест|накоплен|депозит/i, "💰"],
  [/взнос|кредит|ипотек|займ|долг/i, "🏦"],
  [/работ|зарплат|доход|оклад|гонорар/i, "💼"],
  [/ненужн|лишн/i, "🗑️"],
];

function getEmoji(name) {
  const n = (name || "").toLowerCase();
  for (const [re, emoji] of EMOJI_MAP) if (re.test(n)) return emoji;
  return "📌";
}

// ========== STATE ==========
let transactions = [];
let startBalanceRub = 70000;
let incomeCategories = ["Работа", "Аренда квартиры"];
let expenseCategories = [
  "коммуналка", "ежемесячные взносы", "продукты", "кафе / рестораны",
  "одежда ребёнка", "одежда жены", "одежда моя", "транспорт", "подписки",
  "образование", "ремонт / хозтовары", "подарки / праздники", "связь",
  "развлечения", "сбережения", "неожиданные расходы", "медицина ребёнка",
  "медицина жены", "медицина моя", "ненужные траты"
];
let categoryGroups = {};
let exchangeRates = { RUB: 1, USD: 0.012, EUR: 0.011, GEL: 0.031, GBP: 0.0095, KZT: 5.2 };
let displayCurrency = "GEL";
let lastRateUpdate = null;
let calcHistory = [];
let convHistory = [];
let notebookPages = [];
let currentNbId = null;
let selectedCatType = null;
let calcExpr = "", calcJustEvaled = false;
let currentOpType = "expense";
let editingOpIndex = null;

// ========== CURRENCY ==========
const SYM = { RUB: "₽", USD: "$", EUR: "€", GEL: "₾", GBP: "£", KZT: "₸" };
const sym = () => SYM[displayCurrency] || displayCurrency;
const toDisp = r => r * (exchangeRates[displayCurrency] || 1);
const toRub = d => d / (exchangeRates[displayCurrency] || 1);

// ========== UTILS ==========
function esc(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDate(d) {
  if (!d) return "—";
  try { return new Date(d + "T00:00:00").toLocaleDateString("ru-RU"); } catch { return d; }
}
function $(id) { return document.getElementById(id); }

// ========== STORAGE ==========
function saveAll() {
  localStorage.setItem("budget_pro_v6", JSON.stringify({
    transactions, startBalanceRub, incomeCategories, expenseCategories,
    categoryGroups, displayCurrency, exchangeRates, lastRateUpdate
  }));
}
function loadAll() {
  const raw = localStorage.getItem("budget_pro_v6");
  if (raw) {
    const d = JSON.parse(raw);
    transactions = d.transactions || [];
    startBalanceRub = d.startBalanceRub ?? 70000;
    incomeCategories = d.incomeCategories || ["Работа", "Аренда квартиры"];
    expenseCategories = d.expenseCategories || expenseCategories;
    categoryGroups = d.categoryGroups || {};
    displayCurrency = d.displayCurrency || "GEL";
    if (d.exchangeRates) exchangeRates = { ...exchangeRates, ...d.exchangeRates };
    lastRateUpdate = d.lastRateUpdate || null;
  }
  const sel = $("displayCurrencySelect");
  if (sel) sel.value = displayCurrency;
}

// ========== SUBCATS ==========
function ensureGroup(cat, type) {
  if (!categoryGroups[cat]) categoryGroups[cat] = {};
  const g = categoryGroups[cat];
  if (Array.isArray(g.subcats)) {
    const old = g.subcats;
    delete g.subcats;
    g.income = { subcats: [...old] };
    g.expense = { subcats: [...old] };
  }
  if (!g[type]) g[type] = { subcats: [] };
}
function getSubcats(cat, type) {
  const g = categoryGroups[cat];
  if (!g) return [];
  if (g[type]) return g[type].subcats || [];
  return [];
}

// ========== BALANCE & OPERATIONS ==========
function updateBalance() {
  let inc = 0, exp = 0;
  for (const t of transactions) {
    if (t.type === "income") inc += t.amountRub;
    else exp += t.amountRub;
  }
  const s = sym();
  const net = startBalanceRub + inc - exp;
  $("balanceCards").innerHTML = `
    <div class="bal-card"><div class="bal-label">💰 Зарплата</div><div class="bal-value">${toDisp(startBalanceRub).toFixed(2)} ${s}</div></div>
    <div class="bal-card"><div class="bal-label">📈 Доходы</div><div class="bal-value positive">${toDisp(inc).toFixed(2)} ${s}</div></div>
    <div class="bal-card"><div class="bal-label">📉 Расходы</div><div class="bal-value negative">${toDisp(exp).toFixed(2)} ${s}</div></div>
    <div class="bal-card"><div class="bal-label">💎 Остаток</div><div class="bal-value ${net >= 0 ? "positive" : "negative"}">${toDisp(net).toFixed(2)} ${s}</div></div>
  `;
}

function buildOpCard(op, deleteIndex) {
  const isIncome = op.type === "income";
  const emoji = getEmoji(op.category);
  const amount = toDisp(op.amountRub).toFixed(2);
  const s = sym();
  const card = document.createElement("div");
  card.className = "op-card";
  card.dataset.index = deleteIndex;
  card.innerHTML = `
    <div class="op-emoji">${emoji}</div>
    <div class="op-body">
      <div class="op-row1"><span class="op-cat">${esc(op.category)}${op.subcategory ? " / " + esc(op.subcategory) : ""}</span><span class="op-amount ${isIncome ? "income" : "expense"}">${isIncome ? "+" : "−"}${amount} ${s}</span></div>
      <div class="op-row2"><span class="op-tag">${isIncome ? "💰 Доход" : "💸 Расход"}</span><span class="op-date">📅 ${fmtDate(op.date)}</span></div>
      ${op.note ? `<div class="op-note">📝 ${esc(op.note)}</div>` : ""}
    </div>
    <button class="op-del" data-idx="${deleteIndex}" title="Удалить">✕</button>
  `;
  card.querySelector(".op-del").addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Удалить операцию?")) {
      transactions.splice(deleteIndex, 1);
      saveAll();
      refreshAll();
    }
  });
  return card;
}

function renderRecentOps() {
  const container = $("recentOpsList");
  if (!container) return;
  container.innerHTML = "";
  const sorted = [...transactions].map((t, i) => ({ ...t, _i: i })).sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 5);
  if (sorted.length === 0) {
    container.innerHTML = '<div class="empty-msg">Нет операций. Нажмите ＋ чтобы добавить.</div>';
    return;
  }
  for (const op of sorted) container.appendChild(buildOpCard(op, op._i));
}

function renderAllOps() {
  const container = $("allOpsList");
  if (!container) return;
  container.innerHTML = "";
  const searchText = ($("searchText")?.value || "").toLowerCase();
  const dateFrom = $("searchFrom")?.value || "";
  const dateTo = $("searchTo")?.value || "";
  const typeFilter = $("searchType")?.value || "";
  let filtered = transactions.map((t, i) => ({ ...t, _i: i }));
  if (typeFilter) filtered = filtered.filter(t => t.type === typeFilter);
  if (dateFrom) filtered = filtered.filter(t => (t.date || "") >= dateFrom);
  if (dateTo) filtered = filtered.filter(t => (t.date || "") <= dateTo);
  if (searchText) filtered = filtered.filter(t => (t.category + " " + (t.subcategory || "") + " " + (t.note || "")).toLowerCase().includes(searchText));
  const sorted = filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (sorted.length === 0) {
    container.innerHTML = '<div class="empty-msg">Нет операций по заданным критериям.</div>';
    return;
  }
  for (const op of sorted) container.appendChild(buildOpCard(op, op._i));
}

// ========== OPERATION MODAL ==========
function refreshModalCats() {
  const cats = currentOpType === "income" ? incomeCategories : expenseCategories;
  const sel = $("modalCat");
  const prev = sel.value;
  sel.innerHTML = "";
  cats.forEach(c => sel.appendChild(new Option(`${getEmoji(c)} ${c}`, c)));
  if (cats.includes(prev)) sel.value = prev;
}
function setOpType(type) {
  currentOpType = type;
  $("typeExpenseBtn").className = "type-btn" + (type === "expense" ? " active" : "");
  $("typeIncomeBtn").className = "type-btn" + (type === "income" ? " active" : "");
  refreshModalCats();
}
function submitOp() {
  const cat = $("modalCat").value;
  const amount = parseFloat($("modalAmount").value);
  const note = $("modalNote").value.trim();
  const date = $("modalDate").value || today();
  if (!cat) { alert("Выберите категорию"); return; }
  if (isNaN(amount) || amount <= 0) { alert("Введите сумму больше 0"); return; }
  transactions.push({
    type: currentOpType,
    category: cat,
    subcategory: null,
    amountRub: toRub(amount),
    note: note || null,
    date,
  });
  saveAll();
  refreshAll();
  closeModal("addOpModal");
  $("modalAmount").value = "";
  $("modalNote").value = "";
}
function openAddOpModal() {
  $("modalDate").value = today();
  $("modalAmount").value = "";
  $("modalNote").value = "";
  setOpType("expense");
  openModal("addOpModal");
  setTimeout(() => $("modalAmount").focus(), 120);
}

// ========== CATEGORY MODAL ==========
function openAddCatModal() {
  selectedCatType = null;
  $("addCatName").value = "";
  $("confirmAddCat").disabled = true;
  openModal("addCatModal");
}
window.selectCatType = function(type) {
  selectedCatType = type;
  $("confirmAddCat").disabled = false;
};
window.confirmAddCategory = function() {
  const name = $("addCatName").value.trim();
  if (!name) { alert("Введите название"); return; }
  if (!selectedCatType) { alert("Выберите тип"); return; }
  if (selectedCatType === "expense" || selectedCatType === "both") {
    if (!expenseCategories.includes(name)) expenseCategories.push(name);
  }
  if (selectedCatType === "income" || selectedCatType === "both") {
    if (!incomeCategories.includes(name)) incomeCategories.push(name);
  }
  saveAll();
  closeModal("addCatModal");
};

// ========== CALCULATOR ==========
function renderCalcDisplay() { $("calcDisplay").textContent = calcExpr || "0"; }
function buildCalcGrid() {
  const keys = [
    ["C", "clear"], ["⌫", "back"], ["%", "%"], ["÷", "/"],
    ["7", "7"], ["8", "8"], ["9", "9"], ["×", "*"],
    ["4", "4"], ["5", "5"], ["6", "6"], ["−", "-"],
    ["1", "1"], ["2", "2"], ["3", "3"], ["+", "+"],
    ["+/−", "sign"], ["0", "0"], [".", "."], ["=", "="]
  ];
  const grid = $("calcGrid");
  if (!grid) return;
  grid.innerHTML = "";
  keys.forEach(([label, action]) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "calc-btn";
    btn.addEventListener("click", () => handleCalc(action));
    grid.appendChild(btn);
  });
}
function handleCalc(action) {
  if (action === "clear") { calcExpr = ""; calcJustEvaled = false; }
  else if (action === "back") { calcExpr = calcExpr.slice(0, -1); }
  else if (action === "=") {
    try { calcExpr = String(eval(calcExpr)); } catch { calcExpr = "Ошибка"; }
    calcJustEvaled = true;
  }
  else { calcExpr += action; }
  renderCalcDisplay();
}

// ========== CONVERTER ==========
function doConvert() {
  const amount = parseFloat($("convAmount").value);
  const from = $("convFrom").value;
  const to = $("convTo").value;
  if (isNaN(amount)) { $("convResult").textContent = ""; return; }
  const rub = from === "RUB" ? amount : amount / (exchangeRates[from] || 1);
  const result = rub * (exchangeRates[to] || 1);
  $("convResult").textContent = `${amount} ${from} = ${result.toFixed(4)} ${to}`;
}

// ========== RATES ==========
async function fetchRates() {
  const statusEl = $("rateStatus");
  if (statusEl) statusEl.textContent = "⏳ Обновление курсов...";
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/RUB");
    if (!res.ok) throw new Error("Network");
    const data = await res.json();
    exchangeRates = { RUB: 1 };
    for (const cur of ["USD", "EUR", "GEL", "GBP", "KZT"]) exchangeRates[cur] = data.rates[cur] || exchangeRates[cur];
    lastRateUpdate = new Date().toLocaleString("ru-RU");
    if (statusEl) statusEl.textContent = `✅ Обновлено: ${lastRateUpdate}`;
    saveAll();
  } catch {
    if (statusEl) statusEl.textContent = lastRateUpdate ? `⚠️ Офлайн. Последнее: ${lastRateUpdate}` : "⚠️ Офлайн (используются встроенные курсы)";
  }
  refreshAll();
}

// ========== REFRESH ALL ==========
function refreshAll() {
  updateBalance();
  renderRecentOps();
  if ($("tabOperations").classList.contains("active")) renderAllOps();
  doConvert();
}

// ========== MODAL HELPERS ==========
function openModal(id) { $(id).classList.add("open"); }
function closeModal(id) { $(id).classList.remove("open"); }

// ========== THEME ==========
function initTheme() {
  const saved = localStorage.getItem("budget_theme") || "light";
  const isDark = saved === "dark";
  document.body.classList.toggle("dark", isDark);
  const chk = $("themeToggleCheckbox");
  if (chk) chk.checked = isDark;
  chk.addEventListener("change", (e) => {
    const dark = e.target.checked;
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("budget_theme", dark ? "dark" : "light");
  });
}

// ========== TABS ==========
function initTabs() {
  document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    $("tab" + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add("active");
    if (tab === "operations") renderAllOps();
  }));
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  loadAll();
  initTheme();
  initTabs();
  buildCalcGrid();
  renderCalcDisplay();
  refreshAll();
  $("fabBtn").addEventListener("click", openAddOpModal);
  document.querySelectorAll(".modal-overlay").forEach(overlay => overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); }));
  $("closeAddOpModal").addEventListener("click", () => closeModal("addOpModal"));
  $("closeAddCatModal").addEventListener("click", () => closeModal("addCatModal"));
  $("clearAllBtn").addEventListener("click", () => { if (confirm("Удалить ВСЕ операции?")) { transactions = []; saveAll(); refreshAll(); } });
  $("viewAllOpsBtn").addEventListener("click", () => document.querySelector('.nav-item[data-tab="operations"]').click());
  $("editStartBtn").addEventListener("click", () => { const cur = toDisp(startBalanceRub).toFixed(2); const v = prompt(`Введите зарплату (${sym()}):`, cur); if (v !== null && !isNaN(+v) && +v >= 0) { startBalanceRub = toRub(+v); saveAll(); updateBalance(); } });
  $("displayCurrencySelect").addEventListener("change", () => { displayCurrency = $("displayCurrencySelect").value; saveAll(); refreshAll(); });
  $("refreshRatesBtn").addEventListener("click", fetchRates);
  $("addCatGroupBtn").addEventListener("click", openAddCatModal);
  $("typeExpenseBtn").addEventListener("click", () => setOpType("expense"));
  $("typeIncomeBtn").addEventListener("click", () => setOpType("income"));
  $("modalAddBtn").addEventListener("click", submitOp);
  $("modalAddCatBtn").addEventListener("click", openAddCatModal);
  $("modalDate").value = today();
  refreshModalCats();
  $("convBtn").addEventListener("click", doConvert);
  $("convAmount").addEventListener("input", doConvert);
  $("convFrom").addEventListener("change", doConvert);
  $("convTo").addEventListener("change", doConvert);
  $("newPageBtn").addEventListener("click", () => alert("Блокнот в разработке"));
  $("applySearchBtn").addEventListener("click", renderAllOps);
  $("resetSearchBtn").addEventListener("click", () => { $("searchText").value = ""; $("searchFrom").value = ""; $("searchTo").value = ""; $("searchType").value = ""; renderAllOps(); });
  $("searchText").addEventListener("input", renderAllOps);
  fetchRates();
});
