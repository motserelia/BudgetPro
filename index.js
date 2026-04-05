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
  "коммуналка",
  "ежемесячные взносы",
  "продукты",
  "кафе / рестораны",
  "одежда ребёнка",
  "одежда жены",
  "одежда моя",
  "транспорт",
  "подписки",
  "образование",
  "ремонт / хозтовары",
  "подарки / праздники",
  "связь",
  "развлечения",
  "сбережения",
  "неожиданные расходы",
  "медицина ребёнка",
  "медицина жены",
  "медицина моя",
  "ненужные траты",
];
let categoryGroups = {};
let exchangeRates = {
  RUB: 1,
  USD: 0.012,
  EUR: 0.011,
  GEL: 0.031,
  GBP: 0.0095,
  KZT: 5.2,
};
let displayCurrency = "GEL";
let lastRateUpdate = null;
let calcHistory = [];
let convHistory = [];
let notebookPages = [];
let currentNbId = null;
let selectedCatType = null;
let calcExpr = "",
  calcJustEvaled = false;
let currentOpType = "expense";
let editingOpIndex = null; // для редактирования операции

// ========== CURRENCY ==========
const SYM = {
  RUB: "₽",
  USD: "$",
  EUR: "€",
  GEL: "₾",
  GBP: "£",
  KZT: "₸",
};
const sym = () => SYM[displayCurrency] || displayCurrency;
const toDisp = (r) => r * (exchangeRates[displayCurrency] || 1);
const toRub = (d) => d / (exchangeRates[displayCurrency] || 1);

// ========== UTILS ==========
function esc(str) {
  return String(str || "").replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[m],
  );
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("ru-RU");
  } catch {
    return d;
  }
}
function $(id) {
  return document.getElementById(id);
}

// ========== STORAGE ==========
function saveAll() {
  localStorage.setItem(
    "budget_pro_v6",
    JSON.stringify({
      transactions,
      startBalanceRub,
      incomeCategories,
      expenseCategories,
      categoryGroups,
      displayCurrency,
      exchangeRates,
      lastRateUpdate,
    }),
  );
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
    if (d.exchangeRates)
      exchangeRates = { ...exchangeRates, ...d.exchangeRates };
    lastRateUpdate = d.lastRateUpdate || null;
  }
  ensureDefaultSubcats();
  loadCalcHistory();
  loadConvHistory();
  loadNotebook();
  const sel = $("displayCurrencySelect");
  if (sel) sel.value = displayCurrency;
}

// ========== SUBCATS ==========
function ensureDefaultSubcats() {
  const defs = {
    коммуналка: {
      type: "expense",
      subs: ["свет", "вода", "газ", "сбор мусора", "интернет"],
    },
    продукты: {
      type: "expense",
      subs: ["овощи", "фрукты", "мясо", "рыба", "молочные", "хлеб"],
    },
    транспорт: {
      type: "expense",
      subs: ["метро", "автобус", "такси", "бензин"],
    },
  };
  for (const [cat, { type, subs }] of Object.entries(defs)) {
    ensureGroup(cat, type);
    for (const s of subs)
      if (!categoryGroups[cat][type].subcats.includes(s))
        categoryGroups[cat][type].subcats.push(s);
  }
}
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
function addSubcat(cat, type, sub) {
  ensureGroup(cat, type);
  const arr = categoryGroups[cat][type].subcats;
  if (!arr.includes(sub)) arr.push(sub);
  saveAll();
}
function removeSubcat(cat, type, sub) {
  if (categoryGroups[cat]?.[type]) {
    categoryGroups[cat][type].subcats = categoryGroups[cat][
      type
    ].subcats.filter((s) => s !== sub);
    saveAll();
  }
}

// ========== CALC HISTORY ==========
function loadCalcHistory() {
  try {
    calcHistory = JSON.parse(localStorage.getItem("calc_hist") || "[]");
  } catch {
    calcHistory = [];
  }
}
function saveCalcHistory() {
  localStorage.setItem("calc_hist", JSON.stringify(calcHistory.slice(0, 30)));
}
function addCalcHistory(expr, result) {
  if (!expr || !isFinite(result)) return;
  calcHistory.unshift({ expr, result, ts: new Date().toLocaleString() });
  if (calcHistory.length > 30) calcHistory.pop();
  saveCalcHistory();
  renderCalcPreview();
}
function renderCalcPreview() {
  const el = $("calcHistoryPreview");
  if (!el) return;
  if (calcHistory.length === 0) {
    el.textContent = "Нет истории";
    return;
  }
  el.innerHTML = calcHistory
    .slice(0, 5)
    .map(
      (h) =>
        `<span style="margin-right:10px;">${esc(h.expr)} = ${h.result}</span>`,
    )
    .join("");
}

// ========== CONV HISTORY ==========
function loadConvHistory() {
  try {
    convHistory = JSON.parse(localStorage.getItem("conv_hist") || "[]");
  } catch {
    convHistory = [];
  }
  renderConvHistory();
}
function saveConvHistory() {
  localStorage.setItem("conv_hist", JSON.stringify(convHistory.slice(0, 15)));
}
function addConvHistory(from, to, amount, result) {
  convHistory.unshift({
    from,
    to,
    amount,
    result,
    ts: new Date().toLocaleString(),
  });
  if (convHistory.length > 15) convHistory.pop();
  saveConvHistory();
  renderConvHistory();
}
function renderConvHistory() {
  const el = $("convHistoryList");
  if (!el) return;
  if (convHistory.length === 0) {
    el.innerHTML = '<div class="empty-msg">Нет истории</div>';
    return;
  }
  el.innerHTML = convHistory
    .slice(0, 10)
    .map(
      (h, i) =>
        `<div class="conv-hist-item"><span>${h.amount} ${h.from} → ${h.result.toFixed(4)} ${h.to}</span><button class="op-del" data-idx="${i}">✕</button></div>`,
    )
    .join("");
  el.querySelectorAll(".op-del").forEach((btn) =>
    btn.addEventListener("click", () => {
      convHistory.splice(parseInt(btn.dataset.idx), 1);
      saveConvHistory();
      renderConvHistory();
    }),
  );
}
function clearConvHistory() {
  convHistory = [];
  saveConvHistory();
  renderConvHistory();
}

// ========== NOTEBOOK ==========
function loadNotebook() {
  try {
    notebookPages = JSON.parse(localStorage.getItem("notebook_v2") || "[]");
  } catch {
    notebookPages = [];
  }
  if (notebookPages.length === 0)
    notebookPages.push({
      id: Date.now(),
      title: "Пример",
      date: today(),
      content: "Здесь можно писать заметки ✍️",
    });
  saveNotebook();
}
function saveNotebook() {
  localStorage.setItem("notebook_v2", JSON.stringify(notebookPages));
}
function renderNotebookList() {
  const container = $("notebookList");
  if (!container) return;
  container.innerHTML = "";
  if (notebookPages.length === 0) {
    container.innerHTML =
      '<div class="empty-msg">Нет страниц. Нажмите ➕ для создания.</div>';
    return;
  }
  const sorted = [...notebookPages].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
  sorted.forEach((page) => {
    const card = document.createElement("div");
    card.className = "nb-card";
    const preview = (page.content || "").replace(/\n/g, " ").substring(0, 70);
    card.innerHTML = `<div class="nb-card-top"><span class="nb-title">📄 ${esc(page.title)}</span><span class="nb-date">${fmtDate(page.date)}</span></div><div class="nb-preview">${esc(preview) || "(пусто)"}</div>`;
    card.addEventListener("click", () => openNotebookEdit(page.id));
    container.appendChild(card);
  });
}
function openNotebookEdit(id) {
  const page = notebookPages.find((p) => p.id === id);
  if (!page) return;
  currentNbId = id;
  $("nbTitle").value = page.title;
  $("nbDate").value = page.date;
  $("nbContent").value = page.content;
  openModal("notebookModal");
}
function saveNotebookPage() {
  if (currentNbId === null) return;
  const title = $("nbTitle").value.trim();
  const date = $("nbDate").value;
  const content = $("nbContent").value;
  if (!title) {
    alert("Название не может быть пустым");
    return;
  }
  const conflict = notebookPages.some(
    (p) =>
      p.id !== currentNbId && p.title.toLowerCase() === title.toLowerCase(),
  );
  if (conflict) {
    alert(`Страница "${title}" уже существует`);
    return;
  }
  const page = notebookPages.find((p) => p.id === currentNbId);
  if (page) {
    page.title = title;
    page.date = date;
    page.content = content;
  }
  saveNotebook();
  renderNotebookList();
  closeModal("notebookModal");
}
function deleteNotebookPage() {
  if (currentNbId === null) return;
  if (!confirm("Удалить эту страницу?")) return;
  notebookPages = notebookPages.filter((p) => p.id !== currentNbId);
  saveNotebook();
  renderNotebookList();
  closeModal("notebookModal");
  currentNbId = null;
}
function createNotebookPage() {
  let maxNum = 0;
  notebookPages.forEach((p) => {
    const m = p.title.match(/Страница (\d+)/i);
    if (m && parseInt(m[1]) > maxNum) maxNum = parseInt(m[1]);
  });
  const title = `Страница ${maxNum + 1}`;
  const newPage = { id: Date.now(), title, date: today(), content: "" };
  notebookPages.push(newPage);
  saveNotebook();
  renderNotebookList();
  openNotebookEdit(newPage.id);
}

// ========== BALANCE & OPERATIONS ==========
function updateBalance() {
  let inc = 0,
    exp = 0;
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
  const symSpan = $("modalCurSymbol");
  if (symSpan) symSpan.textContent = sym();
  const editSymSpan = $("editModalCurSymbol");
  if (editSymSpan) editSymSpan.textContent = sym();
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
  // Удаление
  card.querySelector(".op-del").addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Удалить операцию?")) {
      transactions.splice(deleteIndex, 1);
      saveAll();
      refreshAll();
    }
  });
  // Редактирование по клику на карточку (не на кнопку удаления)
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("op-del")) return;
    openEditOpModal(deleteIndex);
  });
  return card;
}
function openEditOpModal(index) {
  const op = transactions[index];
  if (!op) return;
  editingOpIndex = index;
  // Заполняем модалку
  $("editModalDate").value = op.date || today();
  $("editModalAmount").value = toDisp(op.amountRub).toFixed(2);
  $("editModalNote").value = op.note || "";
  // Тип
  const isIncome = op.type === "income";
  $("editTypeExpenseBtn").className = "type-btn" + (isIncome ? "" : " active");
  $("editTypeIncomeBtn").className = "type-btn" + (isIncome ? " active" : "");
  // Категории
  const cats = isIncome ? incomeCategories : expenseCategories;
  const catSelect = $("editModalCat");
  catSelect.innerHTML = "";
  cats.forEach((c) =>
    catSelect.appendChild(new Option(`${getEmoji(c)} ${c}`, c)),
  );
  catSelect.value = op.category;
  // Подкатегории
  refreshEditModalSubcats();
  const subcatField = $("editModalSubcatField");
  const subcatSelect = $("editModalSubcat");
  if (
    op.subcategory &&
    getSubcats(op.category, op.type).includes(op.subcategory)
  ) {
    subcatField.style.display = "flex";
    subcatSelect.value = op.subcategory;
  } else {
    subcatField.style.display = "none";
  }
  openModal("editOpModal");
}
function refreshEditModalSubcats() {
  const cat = $("editModalCat").value;
  const type = $("editTypeIncomeBtn").classList.contains("active")
    ? "income"
    : "expense";
  const subs = getSubcats(cat, type);
  const field = $("editModalSubcatField");
  const sel = $("editModalSubcat");
  if (subs.length > 0) {
    field.style.display = "flex";
    sel.innerHTML = '<option value="">— не указывать —</option>';
    subs.forEach((s) => sel.appendChild(new Option(s, s)));
  } else {
    field.style.display = "none";
  }
}
function saveEditedOp() {
  if (editingOpIndex === null) return;
  const type = $("editTypeIncomeBtn").classList.contains("active")
    ? "income"
    : "expense";
  const cat = $("editModalCat").value;
  const subcat =
    $("editModalSubcatField").style.display !== "none"
      ? $("editModalSubcat").value
      : "";
  let amount = parseFloat($("editModalAmount").value);
  const date = $("editModalDate").value;
  const note = $("editModalNote").value.trim();
  if (!cat) {
    alert("Выберите категорию");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Введите сумму больше 0");
    return;
  }
  // конвертируем сумму из текущей валюты в рубли
  const amountRub = toRub(amount);
  transactions[editingOpIndex] = {
    type,
    category: cat,
    subcategory: subcat || null,
    amountRub,
    note: note || null,
    date,
  };
  saveAll();
  refreshAll();
  closeModal("editOpModal");
  editingOpIndex = null;
}
function deleteEditedOp() {
  if (editingOpIndex !== null && confirm("Удалить операцию?")) {
    transactions.splice(editingOpIndex, 1);
    saveAll();
    refreshAll();
    closeModal("editOpModal");
    editingOpIndex = null;
  }
}
function renderRecentOps() {
  const container = $("recentOpsList");
  if (!container) return;
  container.innerHTML = "";
  const sorted = [...transactions]
    .map((t, i) => ({ ...t, _i: i }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);
  if (sorted.length === 0) {
    container.innerHTML =
      '<div class="empty-msg">Нет операций. Нажмите ＋ чтобы добавить.</div>';
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
  if (typeFilter) filtered = filtered.filter((t) => t.type === typeFilter);
  if (dateFrom) filtered = filtered.filter((t) => (t.date || "") >= dateFrom);
  if (dateTo) filtered = filtered.filter((t) => (t.date || "") <= dateTo);
  if (searchText)
    filtered = filtered.filter((t) =>
      (t.category + " " + (t.subcategory || "") + " " + (t.note || ""))
        .toLowerCase()
        .includes(searchText),
    );
  const sorted = filtered.sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
  if (sorted.length === 0) {
    container.innerHTML =
      '<div class="empty-msg">Нет операций по заданным критериям.</div>';
    return;
  }
  for (const op of sorted) container.appendChild(buildOpCard(op, op._i));
}

// ========== CATEGORIES MANAGER (with clickable subcats) ==========
function buildSubcatSection(cat, type, label, subs) {
  const chips = subs
    .map(
      (s) =>
        `<span class="subcat-chip" data-cat="${esc(cat)}" data-type="${type}" data-sub="${esc(s)}">${esc(s)}<button class="subcat-del" data-cat="${esc(cat)}" data-type="${type}" data-sub="${esc(s)}">✕</button></span>`,
    )
    .join("");
  return `<div class="subcats-wrap">${label ? `<div class="subcats-label">${label}</div>` : ""}<div class="subcats-row">${chips}</div></div>`;
}
function renderCatManager() {
  const container = $("catManager");
  if (!container) return;
  container.innerHTML = "";
  const allCats = new Set([...incomeCategories, ...expenseCategories]);
  for (const catName of allCats) {
    const inInc = incomeCategories.includes(catName);
    const inExp = expenseCategories.includes(catName);
    const emoji = getEmoji(catName);
    let badge = "";
    if (inInc && inExp)
      badge = '<span class="cat-type-badge badge-both">🔄 Оба</span>';
    else if (inInc)
      badge = '<span class="cat-type-badge badge-income">💰 Доход</span>';
    else badge = '<span class="cat-type-badge badge-expense">💸 Расход</span>';
    let subcatHtml = "";
    if (inInc && inExp) {
      const incS = getSubcats(catName, "income");
      const expS = getSubcats(catName, "expense");
      if (incS.length)
        subcatHtml += buildSubcatSection(catName, "income", "📈 Доход", incS);
      if (expS.length)
        subcatHtml += buildSubcatSection(catName, "expense", "📉 Расход", expS);
    } else {
      const type = inInc ? "income" : "expense";
      const subs = getSubcats(catName, type);
      if (subs.length)
        subcatHtml += buildSubcatSection(catName, type, "", subs);
    }
    const card = document.createElement("div");
    card.className = "cat-card";
    card.innerHTML = `<div class="cat-card-header"><div class="cat-emoji-wrap">${emoji}</div><div class="cat-name-wrap"><span class="cat-name-text" data-cat="${esc(catName)}">${esc(catName)}</span>${badge}</div></div><div class="cat-actions-row">${inInc && inExp ? `<button class="btn-sm ghost add-sub-btn" data-cat="${esc(catName)}" data-type="income">+ Подкат. доход</button><button class="btn-sm ghost add-sub-btn" data-cat="${esc(catName)}" data-type="expense">+ Подкат. расход</button>` : `<button class="btn-sm ghost add-sub-btn" data-cat="${esc(catName)}" data-type="${inInc ? "income" : "expense"}">+ Подкатегория</button>`}<button class="btn-sm danger del-cat-btn" data-cat="${esc(catName)}">🗑 Удалить</button></div>${subcatHtml}`;
    card.querySelector(".cat-name-text").addEventListener("click", () => {
      const newName = prompt(`Переименовать "${catName}":`, catName);
      if (newName && newName.trim() && newName.trim() !== catName)
        renameCategory(catName, newName.trim());
    });
    card.querySelectorAll(".add-sub-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const cat = btn.dataset.cat,
          type = btn.dataset.type,
          sub = prompt(`Подкатегория для "${cat}":`);
        if (sub?.trim() && !getSubcats(cat, type).includes(sub.trim())) {
          addSubcat(cat, type, sub.trim());
          renderCatManager();
          refreshModalCats();
        }
      }),
    );
    card.querySelector(".del-cat-btn").addEventListener("click", () => {
      if (confirm(`Удалить категорию "${catName}"?`)) {
        incomeCategories = incomeCategories.filter((c) => c !== catName);
        expenseCategories = expenseCategories.filter((c) => c !== catName);
        delete categoryGroups[catName];
        saveAll();
        renderCatManager();
        refreshModalCats();
        updateBalance();
      }
    });
    container.appendChild(card);
  }
  // attach events for subcat chips (click to edit)
  document.querySelectorAll(".subcat-chip").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      if (e.target.classList.contains("subcat-del")) return;
      const cat = chip.dataset.cat,
        type = chip.dataset.type,
        sub = chip.dataset.sub;
      openEditSubcatModal(cat, type, sub);
    });
  });
  document.querySelectorAll(".subcat-del").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const cat = btn.dataset.cat,
        type = btn.dataset.type,
        sub = btn.dataset.sub;
      if (confirm(`Удалить подкатегорию "${sub}"?`)) {
        removeSubcat(cat, type, sub);
        renderCatManager();
        refreshModalCats();
      }
    });
  });
}
function renameCategory(oldName, newName) {
  const all = [...incomeCategories, ...expenseCategories];
  if (all.includes(newName)) {
    alert(`Категория "${newName}" уже существует`);
    return;
  }
  incomeCategories = incomeCategories.map((c) => (c === oldName ? newName : c));
  expenseCategories = expenseCategories.map((c) =>
    c === oldName ? newName : c,
  );
  if (categoryGroups[oldName]) {
    categoryGroups[newName] = categoryGroups[oldName];
    delete categoryGroups[oldName];
  }
  transactions.forEach((t) => {
    if (t.category === oldName) t.category = newName;
  });
  saveAll();
  refreshAll();
}
function openEditSubcatModal(cat, type, sub) {
  const modal = $("editSubcatModal");
  $("editSubcatName").value = sub;
  modal.dataset.cat = cat;
  modal.dataset.type = type;
  modal.dataset.oldSub = sub;
  openModal("editSubcatModal");
}
function saveSubcatEdit() {
  const modal = $("editSubcatModal");
  const cat = modal.dataset.cat,
    type = modal.dataset.type,
    oldSub = modal.dataset.oldSub;
  const newSub = $("editSubcatName").value.trim();
  if (!newSub) {
    alert("Название не может быть пустым");
    return;
  }
  if (oldSub !== newSub) {
    const subs = getSubcats(cat, type);
    if (subs.includes(newSub)) {
      alert("Такая подкатегория уже существует");
      return;
    }
    const idx = subs.indexOf(oldSub);
    if (idx !== -1) {
      subs[idx] = newSub;
      categoryGroups[cat][type].subcats = subs;
      saveAll();
      renderCatManager();
      refreshModalCats();
    }
  }
  closeModal("editSubcatModal");
}
function deleteSubcatFromModal() {
  const modal = $("editSubcatModal");
  const cat = modal.dataset.cat,
    type = modal.dataset.type,
    sub = modal.dataset.oldSub;
  if (confirm(`Удалить подкатегорию "${sub}"?`)) {
    removeSubcat(cat, type, sub);
    renderCatManager();
    refreshModalCats();
    closeModal("editSubcatModal");
  }
}

// ========== OPERATION MODAL (добавление) ==========
function refreshModalCats() {
  const cats =
    currentOpType === "income" ? incomeCategories : expenseCategories;
  const sel = $("modalCat");
  const prev = sel.value;
  sel.innerHTML = "";
  cats.forEach((c) => sel.appendChild(new Option(`${getEmoji(c)} ${c}`, c)));
  if (cats.includes(prev)) sel.value = prev;
  refreshModalSubcats();
}
function refreshModalSubcats() {
  const cat = $("modalCat").value;
  const subs = getSubcats(cat, currentOpType);
  const field = $("modalSubcatField");
  const sel = $("modalSubcat");
  if (subs.length > 0) {
    field.style.display = "flex";
    sel.innerHTML = '<option value="">— не указывать —</option>';
    subs.forEach((s) => sel.appendChild(new Option(s, s)));
  } else field.style.display = "none";
}
function setOpType(type) {
  currentOpType = type;
  $("typeExpenseBtn").className =
    "type-btn" + (type === "expense" ? " active" : "");
  $("typeIncomeBtn").className =
    "type-btn" + (type === "income" ? " active" : "");
  refreshModalCats();
}
function submitOp() {
  const cat = $("modalCat").value;
  const subcat =
    $("modalSubcatField").style.display !== "none"
      ? $("modalSubcat").value
      : "";
  const amount = parseFloat($("modalAmount").value);
  const note = $("modalNote").value.trim();
  const date = $("modalDate").value || today();
  if (!cat) {
    alert("Выберите категорию");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Введите сумму больше 0");
    return;
  }
  transactions.push({
    type: currentOpType,
    category: cat,
    subcategory: subcat || null,
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
function deleteCurrentModalCat() {
  const val = $("modalCat").value;
  if (!val) return;
  const arr = currentOpType === "income" ? incomeCategories : expenseCategories;
  if (arr.length <= 1) {
    alert("Нельзя удалить последнюю категорию");
    return;
  }
  if (!confirm(`Удалить категорию "${val}"?`)) return;
  if (currentOpType === "income")
    incomeCategories = incomeCategories.filter((c) => c !== val);
  else expenseCategories = expenseCategories.filter((c) => c !== val);
  saveAll();
  renderCatManager();
  refreshModalCats();
}

// ========== CATEGORY MODAL ==========
function openAddCatModal() {
  selectedCatType = null;
  $("addCatName").value = "";
  $("confirmAddCat").disabled = true;
  document
    .querySelectorAll("#catBtnExpense, #catBtnIncome, #catBtnBoth")
    .forEach((btn) => (btn.className = "cat-type-btn"));
  openModal("addCatModal");
  setTimeout(() => $("addCatName").focus(), 120);
}
window.selectCatType = function (type) {
  selectedCatType = type;
  ["catBtnExpense", "catBtnIncome", "catBtnBoth"].forEach(
    (id) => ($(id).className = "cat-type-btn"),
  );
  if (type === "expense")
    $("catBtnExpense").className = "cat-type-btn selected-expense";
  if (type === "income")
    $("catBtnIncome").className = "cat-type-btn selected-income";
  if (type === "both") $("catBtnBoth").className = "cat-type-btn selected-both";
  $("confirmAddCat").disabled = false;
};
window.confirmAddCategory = function () {
  const name = $("addCatName").value.trim();
  if (!name) {
    alert("Введите название");
    return;
  }
  if (!selectedCatType) {
    alert("Выберите тип");
    return;
  }
  let added = false;
  if (selectedCatType === "expense" || selectedCatType === "both") {
    if (!expenseCategories.includes(name)) {
      expenseCategories.push(name);
      added = true;
    }
  }
  if (selectedCatType === "income" || selectedCatType === "both") {
    if (!incomeCategories.includes(name)) {
      incomeCategories.push(name);
      added = true;
    }
  }
  if (!added) {
    alert(`Категория "${name}" уже существует`);
    return;
  }
  if (selectedCatType === "both") {
    ensureGroup(name, "income");
    ensureGroup(name, "expense");
  } else ensureGroup(name, selectedCatType);
  saveAll();
  renderCatManager();
  refreshModalCats();
  closeModal("addCatModal");
};

// ========== CALCULATOR ==========
function renderCalcDisplay() {
  $("calcDisplay").textContent = calcExpr || "0";
}
function calcEval() {
  if (!calcExpr) return;
  try {
    const res = Function('"use strict"; return (' + calcExpr + ")")();
    if (isFinite(res)) {
      const result = +res.toPrecision(12);
      addCalcHistory(calcExpr, result);
      calcExpr = String(result);
      calcJustEvaled = true;
    } else {
      calcExpr = "Ошибка";
    }
  } catch {
    calcExpr = "Ошибка";
    calcJustEvaled = false;
  }
  renderCalcDisplay();
}
function handleCalc(action) {
  const isOp = "+-*/".includes(action);
  if (calcExpr === "Ошибка") {
    calcExpr = "";
    calcJustEvaled = false;
  }
  if (action === "clear") {
    calcExpr = "";
    calcJustEvaled = false;
  } else if (action === "back") {
    if (calcJustEvaled) {
      calcExpr = "";
      calcJustEvaled = false;
    } else calcExpr = calcExpr.slice(0, -1);
  } else if (action === "=") {
    calcEval();
    return;
  } else if (action === "sign") {
    if (!calcExpr || calcExpr === "0") {
      calcExpr = "-";
      calcJustEvaled = false;
    } else if (!isNaN(calcExpr)) {
      calcExpr = String(-+calcExpr);
      calcJustEvaled = false;
    } else {
      calcExpr = calcExpr.startsWith("-(")
        ? calcExpr.slice(2, -1)
        : `-(${calcExpr})`;
      calcJustEvaled = false;
    }
  } else if (action === "%") {
    try {
      const v = Function('"use strict"; return (' + calcExpr + ")")();
      if (isFinite(v)) {
        calcExpr = String(v / 100);
        calcJustEvaled = false;
      }
    } catch {}
  } else {
    if (calcJustEvaled) {
      if (!isOp) calcExpr = "";
      calcJustEvaled = false;
    }
    if (isOp && calcExpr && "+-*/".includes(calcExpr.slice(-1)))
      calcExpr = calcExpr.slice(0, -1);
    if (
      action === "." &&
      calcExpr
        .split(/[+\-*/]/)
        .pop()
        .includes(".")
    ) {
      renderCalcDisplay();
      return;
    }
    calcExpr += action;
  }
  renderCalcDisplay();
}
function buildCalcGrid() {
  const keys = [
    ["C", "clear"],
    ["⌫", "back"],
    ["%", "%"],
    ["÷", "/"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    ["×", "*"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["−", "-"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["+", "+"],
    ["+/−", "sign"],
    ["0", "0"],
    [".", "."],
    ["=", "="],
  ];
  const grid = $("calcGrid");
  if (!grid) return;
  grid.innerHTML = "";
  keys.forEach(([label, action]) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "calc-btn";
    if (action === "clear" || action === "back") btn.classList.add("clear");
    if (["/", "*", "-", "+", "="].includes(action)) btn.classList.add("op");
    btn.addEventListener("click", () => handleCalc(action));
    grid.appendChild(btn);
  });
}
function renderCalcHistoryModal() {
  const container = $("calcHistoryList");
  if (!container) return;
  container.innerHTML = "";
  if (calcHistory.length === 0) {
    container.innerHTML = '<div class="empty-msg">История пуста</div>';
    return;
  }
  calcHistory.forEach((h, idx) => {
    const card = document.createElement("div");
    card.className = "op-card";
    card.innerHTML = `<div class="op-body"><div class="op-row1"><span class="op-cat">${esc(h.expr)}</span><span class="op-amount income">= ${h.result}</span></div><div class="op-row2"><span class="op-date">🕒 ${esc(h.ts)}</span></div></div><button class="op-del" data-idx="${idx}">✕</button>`;
    card.querySelector(".op-del").addEventListener("click", () => {
      calcHistory.splice(idx, 1);
      saveCalcHistory();
      renderCalcHistoryModal();
      renderCalcPreview();
    });
    container.appendChild(card);
  });
}

// ========== CONVERTER ==========
function doConvert() {
  const amount = parseFloat($("convAmount").value);
  const from = $("convFrom").value;
  const to = $("convTo").value;
  if (isNaN(amount)) {
    $("convResult").textContent = "";
    return;
  }
  const rub = from === "RUB" ? amount : amount / (exchangeRates[from] || 1);
  const result = rub * (exchangeRates[to] || 1);
  $("convResult").textContent =
    `${amount} ${from} = ${result.toFixed(4)} ${to}`;
  addConvHistory(from, to, amount, result);
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
    for (const cur of ["USD", "EUR", "GEL", "GBP", "KZT"])
      exchangeRates[cur] = data.rates[cur] || exchangeRates[cur];
    lastRateUpdate = new Date().toLocaleString("ru-RU");
    if (statusEl) statusEl.textContent = `✅ Обновлено: ${lastRateUpdate}`;
    saveAll();
  } catch {
    if (statusEl)
      statusEl.textContent = lastRateUpdate
        ? `⚠️ Офлайн. Последнее: ${lastRateUpdate}`
        : "⚠️ Офлайн (используются встроенные курсы)";
  }
  refreshAll();
}

// ========== REFRESH ALL ==========
function refreshAll() {
  updateBalance();
  renderRecentOps();
  if ($("tabOperations").classList.contains("active")) renderAllOps();
  if ($("tabCategories").classList.contains("active")) renderCatManager();
  if ($("tabNotebook").classList.contains("active")) renderNotebookList();
  doConvert();
}

// ========== MODAL HELPERS ==========
function openModal(id) {
  $(id).classList.add("open");
}
function closeModal(id) {
  $(id).classList.remove("open");
}

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
  document.querySelectorAll(".nav-item").forEach((btn) =>
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document
        .querySelectorAll(".nav-item")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document
        .querySelectorAll(".tab-pane")
        .forEach((p) => p.classList.remove("active"));
      $("tab" + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add(
        "active",
      );
      if (tab === "operations") renderAllOps();
      if (tab === "categories") renderCatManager();
      if (tab === "notebook") renderNotebookList();
    }),
  );
}

// ========== SERVICE WORKER ==========
function registerSW() {
  if ("serviceWorker" in navigator)
    navigator.serviceWorker
      .register("/sw.js")
      .catch((e) => console.warn("SW:", e));
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  loadAll();
  initTheme();
  initTabs();
  buildCalcGrid();
  renderCalcDisplay();
  renderCalcPreview();
  refreshAll();
  $("fabBtn").addEventListener("click", openAddOpModal);
  document.querySelectorAll(".modal-overlay").forEach((overlay) =>
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    }),
  );
  $("closeAddOpModal").addEventListener("click", () =>
    closeModal("addOpModal"),
  );
  $("closeAddCatModal").addEventListener("click", () =>
    closeModal("addCatModal"),
  );
  $("closeCalcHistoryModal").addEventListener("click", () =>
    closeModal("calcHistoryModal"),
  );
  $("closeNotebookModal").addEventListener("click", () =>
    closeModal("notebookModal"),
  );
  $("closeEditSubcatModal").addEventListener("click", () =>
    closeModal("editSubcatModal"),
  );
  $("closeEditOpModal").addEventListener("click", () =>
    closeModal("editOpModal"),
  );
  $("clearAllBtn").addEventListener("click", () => {
    if (confirm("Удалить ВСЕ операции?")) {
      transactions = [];
      saveAll();
      refreshAll();
    }
  });
  $("viewAllOpsBtn").addEventListener("click", () =>
    document.querySelector('.nav-item[data-tab="operations"]').click(),
  );
  $("editStartBtn").addEventListener("click", () => {
    const cur = toDisp(startBalanceRub).toFixed(2);
    const v = prompt(`Введите зарплату (${sym()}):`, cur);
    if (v !== null && !isNaN(+v) && +v >= 0) {
      startBalanceRub = toRub(+v);
      saveAll();
      updateBalance();
    }
  });
  $("displayCurrencySelect").addEventListener("change", () => {
    displayCurrency = $("displayCurrencySelect").value;
    saveAll();
    refreshAll();
  });
  $("refreshRatesBtn").addEventListener("click", fetchRates);
  $("addCatGroupBtn").addEventListener("click", openAddCatModal);
  $("addCatName").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && selectedCatType) confirmAddCategory();
  });
  $("openCalcHistoryBtn").addEventListener("click", () => {
    renderCalcHistoryModal();
    openModal("calcHistoryModal");
  });
  $("clearCalcHistoryBtn").addEventListener("click", () => {
    if (confirm("Очистить историю?")) {
      calcHistory = [];
      saveCalcHistory();
      renderCalcHistoryModal();
      renderCalcPreview();
    }
  });
  $("convBtn").addEventListener("click", doConvert);
  $("convAmount").addEventListener("input", doConvert);
  $("convFrom").addEventListener("change", doConvert);
  $("convTo").addEventListener("change", doConvert);
  $("newPageBtn").addEventListener("click", createNotebookPage);
  $("saveNbPageBtn").addEventListener("click", saveNotebookPage);
  $("deleteNbPageBtn").addEventListener("click", deleteNotebookPage);
  $("applySearchBtn").addEventListener("click", renderAllOps);
  $("resetSearchBtn").addEventListener("click", () => {
    $("searchText").value = "";
    $("searchFrom").value = "";
    $("searchTo").value = "";
    $("searchType").value = "";
    renderAllOps();
  });
  $("searchText").addEventListener("input", renderAllOps);
  $("typeExpenseBtn").addEventListener("click", () => setOpType("expense"));
  $("typeIncomeBtn").addEventListener("click", () => setOpType("income"));
  $("modalCat").addEventListener("change", refreshModalSubcats);
  $("modalAddBtn").addEventListener("click", submitOp);
  $("modalRepeatBtn").addEventListener("click", () => {
    const last = [...transactions].reverse().find((t) => t.type === "expense");
    if (!last) {
      alert("Нет расходов");
      return;
    }
    setOpType("expense");
    setTimeout(() => {
      $("modalCat").value = last.category;
      refreshModalSubcats();
      if (last.subcategory) $("modalSubcat").value = last.subcategory;
      $("modalAmount").focus();
    }, 50);
  });
  $("modalAddCatBtn").addEventListener("click", openAddCatModal);
  $("modalDelCatBtn").addEventListener("click", deleteCurrentModalCat);
  $("modalDate").value = today();
  refreshModalCats();
  $("clearConvHistoryBtn").addEventListener("click", clearConvHistory);
  $("saveSubcatBtn").addEventListener("click", saveSubcatEdit);
  $("deleteSubcatBtn").addEventListener("click", deleteSubcatFromModal);
  // Редактирование операции
  $("editTypeExpenseBtn").addEventListener("click", () => {
    $("editTypeExpenseBtn").classList.add("active");
    $("editTypeIncomeBtn").classList.remove("active");
    refreshEditModalSubcats();
  });
  $("editTypeIncomeBtn").addEventListener("click", () => {
    $("editTypeIncomeBtn").classList.add("active");
    $("editTypeExpenseBtn").classList.remove("active");
    refreshEditModalSubcats();
  });
  $("editModalCat").addEventListener("change", refreshEditModalSubcats);
  $("saveOpBtn").addEventListener("click", saveEditedOp);
  $("deleteOpBtn").addEventListener("click", deleteEditedOp);
  fetchRates();
  registerSW();
});
