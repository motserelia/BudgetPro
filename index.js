// ========== ПОЛНАЯ ЛОГИКА ПРИЛОЖЕНИЯ С ПОДДЕРЖКОЙ МНОГОЯЗЫЧНОСТИ ==========
// Глобальные переменные
let transactions = [];
let startBalanceRub = 70000;
let incomeCategories = ["Работа", "Аренда"];
let expenseCategories = ["Продукты", "Транспорт", "Коммуналка", "Кафе"];
let categoryGroups = {};
let allCategoriesOrder = [];
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
let currentOpType = "expense";
let editingOpIndex = null;

// Статистика
let statsResetDate = null;
let currentStatsPeriod = "month";
let statsAnimationFrame = null;
let currentDisplayPercentExpense = 0,
  currentDisplayPercentIncome = 0;

// Вспомогательные функции
function sym() {
  const symbols = {
    RUB: "₽",
    USD: "$",
    EUR: "€",
    GEL: "₾",
    GBP: "£",
    KZT: "₸",
  };
  return symbols[displayCurrency] || displayCurrency;
}
function toDisp(r) {
  return r * (exchangeRates[displayCurrency] || 1);
}
function toRub(d) {
  return d / (exchangeRates[displayCurrency] || 1);
}
function esc(str) {
  return String(str || "").replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString();
  } catch (e) {
    return d;
  }
}

// ========== РАБОТА С ХРАНИЛИЩЕМ ==========
function updateAllCategoriesOrder() {
  let allSet = new Set([...incomeCategories, ...expenseCategories]);
  let newOrder = [];
  for (let cat of allCategoriesOrder) if (allSet.has(cat)) newOrder.push(cat);
  for (let cat of allSet) if (!newOrder.includes(cat)) newOrder.push(cat);
  allCategoriesOrder = newOrder;
}

function saveAll() {
  localStorage.setItem(
    "budget_pro_full",
    JSON.stringify({
      transactions,
      startBalanceRub,
      incomeCategories,
      expenseCategories,
      categoryGroups,
      displayCurrency,
      exchangeRates,
      lastRateUpdate,
      allCategoriesOrder,
      statsResetDate,
    }),
  );
}

function loadAll() {
  let raw = localStorage.getItem("budget_pro_full");
  if (raw) {
    let d = JSON.parse(raw);
    transactions = d.transactions || [];
    startBalanceRub = d.startBalanceRub ?? 70000;
    incomeCategories = d.incomeCategories || ["Работа", "Аренда"];
    expenseCategories = d.expenseCategories || [
      "Продукты",
      "Транспорт",
      "Коммуналка",
      "Кафе",
    ];
    categoryGroups = d.categoryGroups || {};
    displayCurrency = d.displayCurrency || "GEL";
    if (d.exchangeRates)
      exchangeRates = { ...exchangeRates, ...d.exchangeRates };
    lastRateUpdate = d.lastRateUpdate || null;
    allCategoriesOrder = d.allCategoriesOrder || [];
    statsResetDate = d.statsResetDate || null;
  }
  // Инициализация групп
  [...incomeCategories, ...expenseCategories].forEach((cat) => {
    if (!categoryGroups[cat])
      categoryGroups[cat] = {
        income: { subcats: [] },
        expense: { subcats: [] },
      };
  });
  if (!categoryGroups["Продукты"])
    categoryGroups["Продукты"] = {
      income: { subcats: [] },
      expense: { subcats: ["овощи", "фрукты"] },
    };
  if (!categoryGroups["Транспорт"])
    categoryGroups["Транспорт"] = {
      income: { subcats: [] },
      expense: { subcats: ["метро", "такси"] },
    };
  updateAllCategoriesOrder();
}

function ensureGroup(cat, type) {
  if (!categoryGroups[cat])
    categoryGroups[cat] = { income: { subcats: [] }, expense: { subcats: [] } };
  if (!categoryGroups[cat][type]) categoryGroups[cat][type] = { subcats: [] };
}
function getSubcats(cat, type) {
  return categoryGroups[cat]?.[type]?.subcats || [];
}
function addSubcat(cat, type, sub) {
  ensureGroup(cat, type);
  let arr = categoryGroups[cat][type].subcats;
  if (!arr.includes(sub)) arr.push(sub);
  if (type === "income" && !incomeCategories.includes(cat))
    incomeCategories.push(cat);
  if (type === "expense" && !expenseCategories.includes(cat))
    expenseCategories.push(cat);
  updateAllCategoriesOrder();
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

// ========== БАЛАНС И ОПЕРАЦИИ ==========
function updateBalance() {
  let inc = 0,
    exp = 0;
  // ИСПРАВЛЕНО: переменная цикла переименована с 't' в 'tx'
  for (let tx of transactions) {
    if (tx.type === "income") inc += tx.amountRub;
    else exp += tx.amountRub;
  }
  let net = startBalanceRub + inc - exp;
  let s = sym();
  document.getElementById("balanceCards").innerHTML = `
    <div class="bal-card"><div class="bal-label">💰 ${t("salary")}</div><div class="bal-value">${toDisp(startBalanceRub).toFixed(2)} ${s}</div></div>
    <div class="bal-card"><div class="bal-label">📈 ${t("income")}</div><div class="bal-value positive">${toDisp(inc).toFixed(2)} ${s}</div></div>
    <div class="bal-card"><div class="bal-label">📉 ${t("expense")}</div><div class="bal-value negative">${toDisp(exp).toFixed(2)} ${s}</div></div>
    <div class="bal-card"><div class="bal-label">💎 ${t("balance")}</div><div class="bal-value ${net >= 0 ? "positive" : "negative"}">${toDisp(net).toFixed(2)} ${s}</div></div>
  `;
  let symSpan = document.getElementById("modalCurSymbol");
  if (symSpan) symSpan.textContent = s;
  let editSymSpan = document.getElementById("editModalCurSymbol");
  if (editSymSpan) editSymSpan.textContent = s;
}

function buildOpCard(op, idx) {
  let isIncome = op.type === "income";
  let amount = toDisp(op.amountRub).toFixed(2);
  let s = sym();
  let card = document.createElement("div");
  card.className = "op-card";
  card.dataset.index = idx;
  let noteHtml = op.note
    ? `<span title="${esc(op.note)}">📝 ${esc(op.note).substring(0, 30)}${op.note.length > 30 ? "…" : ""}</span>`
    : "";
  card.innerHTML = `
    <div class="op-body">
      <div class="op-row1">
        <span class="op-cat">${esc(op.category)}${op.subcategory ? " / " + esc(op.subcategory) : ""}</span>
        <span class="op-amount ${isIncome ? "income" : "expense"}">${isIncome ? "+" : "−"}${amount} ${s}</span>
      </div>
      <div class="op-row2">
        <span>${isIncome ? "💰 " + t("income") : "💸 " + t("expense")}</span>
        <span>📅 ${fmtDate(op.date)}</span>
        ${noteHtml}
      </div>
    </div>
    <button class="op-del" data-idx="${idx}" title="${t("delete")}">✕</button>
  `;
  card.querySelector(".op-del").addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(t("confirm_delete"))) {
      transactions.splice(idx, 1);
      saveAll();
      refreshAll();
    }
  });
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("op-del")) return;
    openEditOpModal(idx);
  });
  return card;
}

function renderRecentOps() {
  let container = document.getElementById("recentOpsList");
  if (!container) return;
  container.innerHTML = "";
  // ИСПРАВЛЕНО: переменная цикла переименована с 't' в 'tx'
  let sorted = [...transactions]
    .map((tx, i) => ({ ...tx, _i: i }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);
  if (sorted.length === 0) {
    container.innerHTML = `<div class="empty-msg">${t("no_operations")}</div>`;
    return;
  }
  for (let op of sorted) container.appendChild(buildOpCard(op, op._i));
}

function renderAllOps() {
  let container = document.getElementById("allOpsList");
  if (!container) return;
  container.innerHTML = "";
  // ИСПРАВЛЕНО: переменная цикла переименована с 't' в 'tx'
  let filtered = transactions.map((tx, i) => ({ ...tx, _i: i }));
  let search = (
    document.getElementById("searchText")?.value || ""
  ).toLowerCase();
  let from = document.getElementById("searchFrom")?.value;
  let to = document.getElementById("searchTo")?.value;
  let type = document.getElementById("searchType")?.value;
  if (type) filtered = filtered.filter((tx) => tx.type === type);
  if (from) filtered = filtered.filter((tx) => (tx.date || "") >= from);
  if (to) filtered = filtered.filter((tx) => (tx.date || "") <= to);
  if (search)
    filtered = filtered.filter((tx) =>
      (tx.category + (tx.subcategory || "") + (tx.note || ""))
        .toLowerCase()
        .includes(search),
    );
  filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-msg">${t("no_operations_criteria")}</div>`;
    return;
  }
  for (let op of filtered) container.appendChild(buildOpCard(op, op._i));
}

function openEditOpModal(index) {
  let op = transactions[index];
  if (!op) return;
  editingOpIndex = index;
  document.getElementById("editModalDate").value = op.date || today();
  document.getElementById("editModalAmount").value = toDisp(
    op.amountRub,
  ).toFixed(2);
  document.getElementById("editModalNote").value = op.note || "";
  let isIncome = op.type === "income";
  document.getElementById("editTypeExpenseBtn").className =
    "type-btn" + (isIncome ? "" : " active");
  document.getElementById("editTypeIncomeBtn").className =
    "type-btn" + (isIncome ? " active" : "");
  let cats = isIncome ? incomeCategories : expenseCategories;
  let catSelect = document.getElementById("editModalCat");
  catSelect.innerHTML = "";
  for (let c of cats) catSelect.appendChild(new Option(c, c));
  catSelect.value = op.category;
  refreshEditModalSubcats();
  let subcatField = document.getElementById("editModalSubcatField");
  let subcatSelect = document.getElementById("editModalSubcat");
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
  let cat = document.getElementById("editModalCat").value;
  let type = document
    .getElementById("editTypeIncomeBtn")
    .classList.contains("active")
    ? "income"
    : "expense";
  let subs = getSubcats(cat, type);
  let field = document.getElementById("editModalSubcatField");
  let sel = document.getElementById("editModalSubcat");
  if (subs.length) {
    field.style.display = "flex";
    sel.innerHTML = '<option value="">— ' + t("not_specified") + " —</option>";
    subs.forEach((s) => sel.appendChild(new Option(s, s)));
  } else {
    field.style.display = "none";
  }
}

function saveEditedOp() {
  if (editingOpIndex === null) return;
  let type = document
    .getElementById("editTypeIncomeBtn")
    .classList.contains("active")
    ? "income"
    : "expense";
  let cat = document.getElementById("editModalCat").value;
  let subcat =
    document.getElementById("editModalSubcatField").style.display !== "none"
      ? document.getElementById("editModalSubcat").value
      : "";
  let amount = parseFloat(document.getElementById("editModalAmount").value);
  let date = document.getElementById("editModalDate").value;
  let note = document.getElementById("editModalNote").value.trim();
  if (!cat) {
    alert(t("select_category"));
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert(t("enter_amount"));
    return;
  }
  let amountRub = toRub(amount);
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
  if (editingOpIndex !== null && confirm(t("confirm_delete"))) {
    transactions.splice(editingOpIndex, 1);
    saveAll();
    refreshAll();
    closeModal("editOpModal");
    editingOpIndex = null;
  }
}

// ========== КАТЕГОРИИ ==========
function renderCatManager() {
  let container = document.getElementById("catManager");
  if (!container) return;
  container.innerHTML = "";
  for (let cat of allCategoriesOrder) {
    let inInc = incomeCategories.includes(cat);
    let inExp = expenseCategories.includes(cat);
    if (!inInc && !inExp) continue;
    let typeLabel =
      inInc && inExp
        ? "🔄 " + t("both")
        : inInc
          ? "💰 " + t("income")
          : "💸 " + t("expense");
    let div = document.createElement("div");
    div.className = "cat-card";
    div.innerHTML = `<div style="flex:1;"><div><strong style="cursor:pointer;" class="cat-rename" data-cat="${esc(cat)}">📁 ${esc(cat)}</strong> <span style="font-size:0.7rem;">${typeLabel}</span></div>`;
    div.innerHTML += `<div class="subcats-wrap"><div class="subcats-label">💰 ${t("income")}</div><div class="subcats-row" id="subs-inc-${cat.replace(/\s/g, "_")}"></div></div>`;
    div.innerHTML += `<div class="subcats-wrap"><div class="subcats-label">💸 ${t("expense")}</div><div class="subcats-row" id="subs-exp-${cat.replace(/\s/g, "_")}"></div></div>`;
    div.innerHTML += `<div class="cat-actions-row"><button class="btn-sm add-sub" data-cat="${esc(cat)}" data-type="income">+ ${t("add_subcat_income")}</button><button class="btn-sm add-sub" data-cat="${esc(cat)}" data-type="expense">+ ${t("add_subcat_expense")}</button><button class="btn-sm del-cat" data-cat="${esc(cat)}">🗑 ${t("delete")}</button></div></div>`;
    container.appendChild(div);
    fillSubcatRow(cat, "income", `subs-inc-${cat.replace(/\s/g, "_")}`);
    fillSubcatRow(cat, "expense", `subs-exp-${cat.replace(/\s/g, "_")}`);
    div
      .querySelector(".cat-rename")
      .addEventListener("click", () => renameCategory(cat));
    div.querySelectorAll(".add-sub").forEach((btn) =>
      btn.addEventListener("click", () => {
        let btnCat = btn.dataset.cat,
          btnType = btn.dataset.type;
        let newSub = prompt(t("enter_subcategory_name"));
        if (newSub && newSub.trim()) {
          addSubcat(btnCat, btnType, newSub.trim());
          renderCatManager();
          refreshModalCats();
        }
      }),
    );
    div.querySelector(".del-cat").addEventListener("click", () => {
      if (confirm(t("confirm_delete_category").replace("%s", cat))) {
        incomeCategories = incomeCategories.filter((c) => c !== cat);
        expenseCategories = expenseCategories.filter((c) => c !== cat);
        delete categoryGroups[cat];
        updateAllCategoriesOrder();
        saveAll();
        renderCatManager();
        refreshModalCats();
      }
    });
  }
}

function fillSubcatRow(cat, type, containerId) {
  let container = document.getElementById(containerId);
  if (!container) return;
  let subs = getSubcats(cat, type);
  container.innerHTML = "";
  for (let sub of subs) {
    let chip = document.createElement("span");
    chip.className = "subcat-chip";
    chip.innerHTML = `${esc(sub)} <button class="subcat-del" data-cat="${esc(cat)}" data-type="${type}" data-sub="${esc(sub)}">✕</button>`;
    chip.querySelector(".subcat-del").addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(t("confirm_delete_subcategory").replace("%s", sub))) {
        removeSubcat(cat, type, sub);
        renderCatManager();
        refreshModalCats();
      }
    });
    chip.addEventListener("click", (e) => {
      if (e.target.classList.contains("subcat-del")) return;
      openEditSubcatModal(cat, type, sub);
    });
    container.appendChild(chip);
  }
}

function renameCategory(oldName) {
  let newName = prompt(t("enter_new_category_name"), oldName);
  if (!newName || newName === oldName) return;
  if ([...incomeCategories, ...expenseCategories].includes(newName)) {
    alert(t("category_exists"));
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
  let idx = allCategoriesOrder.indexOf(oldName);
  if (idx !== -1) allCategoriesOrder[idx] = newName;
  // ИСПРАВЛЕНО: переменная цикла переименована с 't' в 'tx'
  transactions.forEach((tx) => {
    if (tx.category === oldName) tx.category = newName;
  });
  saveAll();
  renderCatManager();
  refreshModalCats();
  refreshAll();
}

function openEditSubcatModal(cat, type, sub) {
  let modal = document.getElementById("editSubcatModal");
  modal.dataset.cat = cat;
  modal.dataset.type = type;
  modal.dataset.oldSub = sub;
  document.getElementById("editSubcatName").value = sub;
  openModal("editSubcatModal");
}
function saveSubcatEdit() {
  let modal = document.getElementById("editSubcatModal");
  let cat = modal.dataset.cat,
    type = modal.dataset.type,
    oldSub = modal.dataset.oldSub;
  let newSub = document.getElementById("editSubcatName").value.trim();
  if (!newSub) {
    alert(t("subcategory_name_empty"));
    return;
  }
  if (oldSub !== newSub) {
    let subs = getSubcats(cat, type);
    if (subs.includes(newSub)) {
      alert(t("subcategory_exists"));
      return;
    }
    let idx = subs.indexOf(oldSub);
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
  let modal = document.getElementById("editSubcatModal");
  let cat = modal.dataset.cat,
    type = modal.dataset.type,
    sub = modal.dataset.oldSub;
  if (confirm(t("confirm_delete_subcategory").replace("%s", sub))) {
    removeSubcat(cat, type, sub);
    renderCatManager();
    refreshModalCats();
    closeModal("editSubcatModal");
  }
}

// ========== КОНВЕРТЕР ==========
function doConvert() {
  let amount = parseFloat(document.getElementById("convAmount").value);
  let from = document.getElementById("convFrom").value;
  let to = document.getElementById("convTo").value;
  if (isNaN(amount)) {
    document.getElementById("convResult").textContent = "";
    return;
  }
  let rub = from === "RUB" ? amount : amount / (exchangeRates[from] || 1);
  let result = rub * (exchangeRates[to] || 1);
  document.getElementById("convResult").textContent =
    `${amount} ${from} = ${result.toFixed(4)} ${to}`;
  convHistory.unshift({
    from,
    to,
    amount,
    result,
    ts: new Date().toLocaleString(),
  });
  if (convHistory.length > 200) convHistory.pop();
  localStorage.setItem("conv_hist_full", JSON.stringify(convHistory));
  renderConvHistory();
}
function renderConvHistory() {
  let el = document.getElementById("convHistoryList");
  if (!el) return;
  if (convHistory.length === 0) {
    el.innerHTML = `<div class="empty-msg">${t("no_history")}</div>`;
    return;
  }
  let last5 = convHistory.slice(0, 5);
  el.innerHTML = last5
    .map(
      (h, i) => `
    <div class="conv-hist-item">
      <span>${h.amount} ${h.from} → ${h.result.toFixed(4)} ${h.to}</span>
      <button class="hist-del" data-idx="${i}">✕</button>
    </div>
  `,
    )
    .join("");
  el.querySelectorAll(".hist-del").forEach((btn) => {
    btn.addEventListener("click", () => {
      let idx = parseInt(btn.dataset.idx);
      convHistory.splice(idx, 1);
      localStorage.setItem("conv_hist_full", JSON.stringify(convHistory));
      renderConvHistory();
      if (
        document.getElementById("convHistoryModal").classList.contains("open")
      )
        renderFullConvHistoryModal();
    });
  });
}
function renderFullConvHistoryModal() {
  let container = document.getElementById("convHistoryFullList");
  if (!container) return;
  container.innerHTML = "";
  if (convHistory.length === 0) {
    container.innerHTML = `<div class="empty-msg">${t("no_history")}</div>`;
    return;
  }
  convHistory.forEach((h, idx) => {
    let card = document.createElement("div");
    card.className = "op-card";
    card.innerHTML = `
      <div class="op-body">
        <div>${h.amount} ${h.from} → ${h.to} = ${h.result.toFixed(4)} ${h.to}</div>
        <div style="font-size:0.7rem;">🕒 ${esc(h.ts)}</div>
      </div>
      <button class="hist-del" data-idx="${idx}">✕</button>
    `;
    card.querySelector(".hist-del").addEventListener("click", () => {
      convHistory.splice(idx, 1);
      localStorage.setItem("conv_hist_full", JSON.stringify(convHistory));
      renderFullConvHistoryModal();
      renderConvHistory();
    });
    container.appendChild(card);
  });
}
function clearConvHistory() {
  convHistory = [];
  localStorage.setItem("conv_hist_full", "[]");
  renderConvHistory();
  if (document.getElementById("convHistoryModal").classList.contains("open"))
    renderFullConvHistoryModal();
}

// ========== КАЛЬКУЛЯТОР ==========
let calcExpr = "",
  calcJustEvaled = false;
function renderCalcDisplay() {
  document.getElementById("calcDisplay").textContent = calcExpr || "0";
}
function calcEval() {
  try {
    let res = Function('"use strict"; return (' + calcExpr + ")")();
    if (isFinite(res)) {
      calcHistory.unshift({
        expr: calcExpr,
        result: res,
        ts: new Date().toLocaleString(),
      });
      if (calcHistory.length > 50) calcHistory.pop();
      localStorage.setItem("calc_hist_full", JSON.stringify(calcHistory));
      calcExpr = String(res);
      calcJustEvaled = true;
    } else calcExpr = t("error");
  } catch (e) {
    calcExpr = t("error");
  }
  renderCalcDisplay();
  renderCalcPreview();
}
function handleCalc(action) {
  if (calcExpr === t("error")) {
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
  } else if (action === "sign") {
    if (calcExpr && calcExpr !== "0") {
      if (calcExpr.startsWith("-")) calcExpr = calcExpr.slice(1);
      else calcExpr = "-" + calcExpr;
    }
  } else if (action === "=") {
    calcEval();
    return;
  } else {
    if (calcJustEvaled && !"+-*/".includes(action)) calcExpr = "";
    calcJustEvaled = false;
    if (
      "+-*/".includes(action) &&
      calcExpr &&
      "+-*/".includes(calcExpr.slice(-1))
    )
      calcExpr = calcExpr.slice(0, -1);
    calcExpr += action;
  }
  renderCalcDisplay();
}
function renderCalcPreview() {
  let el = document.getElementById("calcHistoryPreview");
  if (el)
    el.innerHTML =
      calcHistory
        .slice(0, 3)
        .map((h) => `${h.expr}=${h.result}`)
        .join(" | ") || t("no_history");
}
function buildCalcGrid() {
  let grid = document.getElementById("calcGrid");
  if (!grid) return;
  let keys = [
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
  grid.innerHTML = "";
  keys.forEach(([label, action]) => {
    let btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "calc-btn";
    if (action === "clear" || action === "back") btn.classList.add("clear");
    if (["/", "*", "-", "+", "="].includes(action)) btn.classList.add("op");
    btn.onclick = () => handleCalc(action);
    grid.appendChild(btn);
  });
}
function renderFullCalcHistory() {
  let container = document.getElementById("calcHistoryFullList");
  if (!container) return;
  container.innerHTML = "";
  if (calcHistory.length === 0) {
    container.innerHTML = `<div class="empty-msg">${t("no_history")}</div>`;
    return;
  }
  calcHistory.forEach((h, idx) => {
    let card = document.createElement("div");
    card.className = "calc-hist-item";
    card.innerHTML = `
      <span>${h.expr} = ${h.result}</span>
      <div><span style="font-size:0.7rem;">${h.ts}</span><button class="hist-del" data-idx="${idx}" style="margin-left:8px;">✕</button></div>
    `;
    card.querySelector(".hist-del").addEventListener("click", () => {
      calcHistory.splice(idx, 1);
      localStorage.setItem("calc_hist_full", JSON.stringify(calcHistory));
      renderFullCalcHistory();
      renderCalcPreview();
    });
    container.appendChild(card);
  });
}
function clearCalcHistory() {
  calcHistory = [];
  localStorage.setItem("calc_hist_full", "[]");
  renderCalcPreview();
  if (document.getElementById("calcHistoryModal").classList.contains("open"))
    renderFullCalcHistory();
}

// ========== БЛОКНОТ ==========
function loadNotebook() {
  let saved = localStorage.getItem("notebook_pages");
  if (saved) notebookPages = JSON.parse(saved);
  else
    notebookPages = [
      {
        id: Date.now(),
        title: t("example"),
        date: today(),
        content: t("example_content"),
      },
    ];
  saveNotebook();
}
function saveNotebook() {
  localStorage.setItem("notebook_pages", JSON.stringify(notebookPages));
}
function renderNotebookList() {
  let container = document.getElementById("notebookList");
  if (!container) return;
  container.innerHTML = "";
  if (notebookPages.length === 0) {
    container.innerHTML = `<div class="empty-msg">${t("no_pages")}</div>`;
    return;
  }
  let sorted = [...notebookPages].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
  for (let page of sorted) {
    let card = document.createElement("div");
    card.className = "nb-card";
    let preview = (page.content || "").replace(/\n/g, " ").substring(0, 70);
    card.innerHTML = `
      <div class="nb-card-top"><span class="nb-title">📄 ${esc(page.title)}</span><span class="nb-date">${fmtDate(page.date)}</span></div>
      <div class="nb-preview">${esc(preview) || "(пусто)"}</div>
    `;
    card.addEventListener("click", () => openNotebookEdit(page.id));
    container.appendChild(card);
  }
}
function openNotebookEdit(id) {
  let page = notebookPages.find((p) => p.id === id);
  if (!page) return;
  currentNbId = id;
  document.getElementById("nbTitle").value = page.title;
  document.getElementById("nbDate").value = page.date;
  document.getElementById("nbContent").value = page.content;
  openModal("notebookModal");
}
function saveNotebookPage() {
  if (currentNbId === null) return;
  let title = document.getElementById("nbTitle").value.trim();
  let date = document.getElementById("nbDate").value;
  let content = document.getElementById("nbContent").value;
  if (!title) {
    alert(t("title_empty"));
    return;
  }
  let conflict = notebookPages.some(
    (p) =>
      p.id !== currentNbId && p.title.toLowerCase() === title.toLowerCase(),
  );
  if (conflict) {
    alert(t("page_exists").replace("%s", title));
    return;
  }
  let page = notebookPages.find((p) => p.id === currentNbId);
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
  if (confirm(t("confirm_delete_page"))) {
    notebookPages = notebookPages.filter((p) => p.id !== currentNbId);
    saveNotebook();
    renderNotebookList();
    closeModal("notebookModal");
    currentNbId = null;
  }
}
function createNotebookPage() {
  let maxNum = 0;
  notebookPages.forEach((p) => {
    let m = p.title.match(/\d+/);
    if (m && parseInt(m[0]) > maxNum) maxNum = parseInt(m[0]);
  });
  let title = `${t("page")} ${maxNum + 1}`;
  let newPage = { id: Date.now(), title, date: today(), content: "" };
  notebookPages.push(newPage);
  saveNotebook();
  renderNotebookList();
  openNotebookEdit(newPage.id);
}

// ========== СТАТИСТИКА ==========
function showTemporaryMessage(text, duration = 15000) {
  const msgDiv = document.getElementById("statsTempMessageInline");
  if (!msgDiv) return;
  msgDiv.textContent = text;
  msgDiv.style.opacity = "1";
  setTimeout(() => {
    msgDiv.style.opacity = "0";
  }, duration);
}
function getStartDateForPeriod(period) {
  const now = new Date();
  if (period === "day") return today();
  if (period === "week") {
    let start = new Date(now);
    start.setDate(now.getDate() - 7);
    return start.toISOString().slice(0, 10);
  }
  let start = new Date(now);
  start.setDate(now.getDate() - 30);
  return start.toISOString().slice(0, 10);
}
function getStatsForPeriod(period) {
  let startPeriod = getStartDateForPeriod(period);
  let resetDate = statsResetDate || "1970-01-01";
  let effectiveStart = startPeriod > resetDate ? startPeriod : resetDate;
  let totalIncomeRub = 0,
    totalExpenseRub = 0;
  // ИСПРАВЛЕНО: переменная цикла переименована с 't' в 'tx'
  for (let tx of transactions) {
    if (!tx.date) continue;
    if (tx.date >= effectiveStart) {
      if (tx.type === "income") totalIncomeRub += tx.amountRub;
      else totalExpenseRub += tx.amountRub;
    }
  }
  totalIncomeRub += startBalanceRub;
  return { incomeRub: totalIncomeRub, expenseRub: totalExpenseRub };
}
function getChartColors() {
  const isDark = document.body.classList.contains("dark");
  return {
    expense: isDark ? "#fc8181" : "#e05c4b",
    income: isDark ? "#6aa8ff" : "#1a7a4a",
    bg: isDark ? "rgba(150,150,150,0.25)" : "rgba(150,150,150,0.15)",
    stroke: isDark ? "rgba(255,255,255,0.2)" : "var(--border)",
  };
}
function drawChartAnimated(
  targetExpensePercent,
  targetIncomePercent,
  duration = 800,
) {
  const canvas = document.getElementById("statsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.parentElement.clientWidth;
  canvas.width = w;
  canvas.height = w;
  const centerX = w / 2,
    centerY = w / 2,
    radius = w / 2 - 10;
  const startAngle = -Math.PI / 2;
  const colors = getChartColors();
  let startTime = null;
  let startExpense = currentDisplayPercentExpense;
  let startIncome = currentDisplayPercentIncome;
  let diffExpense = targetExpensePercent - startExpense;
  let diffIncome = targetIncomePercent - startIncome;
  if (statsAnimationFrame) cancelAnimationFrame(statsAnimationFrame);
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsed = timestamp - startTime;
    let progress = Math.min(1, elapsed / duration);
    let currentExpense = startExpense + diffExpense * progress;
    let currentIncome = startIncome + diffIncome * progress;
    if (currentExpense < 0) currentExpense = 0;
    if (currentIncome < 0) currentIncome = 0;
    currentDisplayPercentExpense = currentExpense;
    currentDisplayPercentIncome = currentIncome;
    document.getElementById("statsPercent").innerHTML =
      `${Math.round(currentExpense)}% / ${Math.round(currentIncome)}%`;
    ctx.clearRect(0, 0, w, w);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = colors.bg;
    ctx.fill();
    let expenseAngle = (currentExpense / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + expenseAngle);
    ctx.fillStyle = colors.expense;
    ctx.fill();
    let incomeAngle = (currentIncome / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      radius,
      startAngle + expenseAngle,
      startAngle + expenseAngle + incomeAngle,
    );
    ctx.fillStyle = colors.income;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    if (progress < 1) {
      statsAnimationFrame = requestAnimationFrame(animate);
    } else {
      statsAnimationFrame = null;
      currentDisplayPercentExpense = targetExpensePercent;
      currentDisplayPercentIncome = targetIncomePercent;
      document.getElementById("statsPercent").innerHTML =
        `${Math.round(targetExpensePercent)}% / ${Math.round(targetIncomePercent)}%`;
    }
  }
  statsAnimationFrame = requestAnimationFrame(animate);
}
function updateStats(animate = true) {
  let { incomeRub, expenseRub } = getStatsForPeriod(currentStatsPeriod);
  let total = incomeRub + expenseRub;
  let targetPercentIncome = total === 0 ? 0 : (incomeRub / total) * 100;
  let targetPercentExpense = total === 0 ? 0 : (expenseRub / total) * 100;
  let s = sym();
  let incomeDisp = toDisp(incomeRub);
  let expenseDisp = toDisp(expenseRub);
  let balanceDisp = incomeDisp - expenseDisp;
  let periodLabel =
    currentStatsPeriod === "day"
      ? t("today")
      : currentStatsPeriod === "week"
        ? t("last_7_days")
        : t("last_30_days");
  let resetInfo = statsResetDate
    ? `${t("since")} ${statsResetDate}`
    : t("since_beginning");
  document.getElementById("statsPeriodLabel").innerHTML =
    `📊 ${periodLabel} (${resetInfo})`;
  document.getElementById("statsIncomeAmount").innerHTML =
    `💰 ${t("income")}: ${incomeDisp.toFixed(2)} ${s} (${Math.round(targetPercentIncome)}%)`;
  document.getElementById("statsExpenseAmount").innerHTML =
    `💸 ${t("expense")}: ${expenseDisp.toFixed(2)} ${s} (${Math.round(targetPercentExpense)}%)`;
  document.getElementById("statsBalance").innerHTML =
    `💎 ${t("balance")}: ${balanceDisp.toFixed(2)} ${s}`;
  const colors = getChartColors();
  document.querySelectorAll(".legend-color")[0].style.background =
    colors.expense;
  document.querySelectorAll(".legend-color")[1].style.background =
    colors.income;
  if (animate) {
    currentDisplayPercentExpense = 0;
    currentDisplayPercentIncome = 0;
    drawChartAnimated(targetPercentExpense, targetPercentIncome, 800);
  } else {
    currentDisplayPercentExpense = targetPercentExpense;
    currentDisplayPercentIncome = targetIncomePercent;
    document.getElementById("statsPercent").innerHTML =
      `${Math.round(targetPercentExpense)}% / ${Math.round(targetPercentIncome)}%`;
    const canvas = document.getElementById("statsChart");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const w = canvas.parentElement.clientWidth;
      canvas.width = w;
      canvas.height = w;
      const centerX = w / 2,
        centerY = w / 2,
        radius = w / 2 - 10;
      const startAngle = -Math.PI / 2;
      let expenseAngle = (targetPercentExpense / 100) * 2 * Math.PI;
      let incomeAngle = (targetPercentIncome / 100) * 2 * Math.PI;
      ctx.clearRect(0, 0, w, w);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = colors.bg;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + expenseAngle);
      ctx.fillStyle = colors.expense;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle + expenseAngle,
        startAngle + expenseAngle + incomeAngle,
      );
      ctx.fillStyle = colors.income;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }
}
function resetStats() {
  if (confirm(t("confirm_reset_stats"))) {
    statsResetDate = today();
    saveAll();
    currentDisplayPercentExpense = 0;
    currentDisplayPercentIncome = 0;
    const canvas = document.getElementById("statsChart");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const w = canvas.parentElement.clientWidth;
      canvas.width = w;
      canvas.height = w;
      const centerX = w / 2,
        centerY = w / 2,
        radius = w / 2 - 10;
      const colors = getChartColors();
      ctx.clearRect(0, 0, w, w);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = colors.bg;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    document.getElementById("statsPercent").innerHTML = "0% / 0%";
    updateStats(true);
    showTemporaryMessage(
      `${t("stats_reset_message")} ${statsResetDate}`,
      15000,
    );
  }
}
function setPeriod(period) {
  currentStatsPeriod = period;
  document.querySelectorAll(".period-btn").forEach((btn) => {
    if (btn.dataset.period === period) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  updateStats(true);
}

// ========== ОБЩИЕ ФУНКЦИИ ==========
function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}
function initTheme() {
  let dark = localStorage.getItem("budget_theme") === "dark";
  document.body.classList.toggle("dark", dark);
  let chk = document.getElementById("themeToggleCheckbox");
  if (chk) {
    chk.checked = dark;
    chk.onchange = (e) => {
      document.body.classList.toggle("dark", e.target.checked);
      localStorage.setItem("budget_theme", e.target.checked ? "dark" : "light");
      updateStats(true);
    };
  }
}
function setActiveTab(tabId) {
  document
    .querySelectorAll(".tab-pane")
    .forEach((p) => p.classList.remove("active"));
  document
    .getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`)
    .classList.add("active");
  document
    .querySelectorAll(".nav-item")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`.nav-item[data-tab="${tabId}"]`)
    .classList.add("active");
  let panel = document.getElementById("balancePanel");
  if (tabId === "home") panel.classList.remove("compact");
  else panel.classList.add("compact");
  if (tabId === "operations") renderAllOps();
  if (tabId === "categories") renderCatManager();
  if (tabId === "notebook") renderNotebookList();
  if (tabId === "stats") updateStats(true);
}
function refreshAll() {
  updateBalance();
  renderRecentOps();
  if (document.getElementById("tabOperations").classList.contains("active"))
    renderAllOps();
  if (document.getElementById("tabCategories").classList.contains("active"))
    renderCatManager();
  if (document.getElementById("tabNotebook").classList.contains("active"))
    renderNotebookList();
  if (document.getElementById("tabStats").classList.contains("active"))
    updateStats(true);
  doConvert();
}
function refreshModalCats() {
  let sel = document.getElementById("modalCat");
  if (!sel) return;
  let cats = currentOpType === "income" ? incomeCategories : expenseCategories;
  sel.innerHTML = "";
  for (let c of cats) sel.appendChild(new Option(c, c));
  refreshModalSubcats();
}
function refreshModalSubcats() {
  let field = document.getElementById("modalSubcatField");
  let sel = document.getElementById("modalSubcat");
  let cat = document.getElementById("modalCat").value;
  let subs = getSubcats(cat, currentOpType);
  if (subs.length) {
    field.style.display = "flex";
    sel.innerHTML = '<option value="">— ' + t("not_specified") + " —</option>";
    subs.forEach((s) => sel.appendChild(new Option(s, s)));
  } else {
    field.style.display = "none";
  }
}

// ========== ОБРАБОТЧИКИ И ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener("DOMContentLoaded", () => {
  loadAll();
  initTheme();
  buildCalcGrid();
  loadNotebook();
  let savedConv = localStorage.getItem("conv_hist_full");
  if (savedConv) convHistory = JSON.parse(savedConv);
  else convHistory = [];
  let savedCalc = localStorage.getItem("calc_hist_full");
  if (savedCalc) calcHistory = JSON.parse(savedCalc);
  renderConvHistory();
  renderCalcPreview();
  updateBalance();
  renderRecentOps();
  renderAllOps();
  renderCatManager();
  renderNotebookList();
  refreshModalCats();

  document.getElementById("fabBtn").onclick = () => {
    document.getElementById("modalDate").value = today();
    openModal("addOpModal");
  };
  document.getElementById("homeQuickAddBtn").onclick = () => {
    document.getElementById("modalDate").value = today();
    openModal("addOpModal");
  };
  const collapsible = document.getElementById("quickActionBlock");
  const header = collapsible.querySelector(".collapsible-header");
  header.addEventListener("click", () => {
    collapsible.classList.toggle("collapsed");
  });
  document.getElementById("helpBtn").onclick = () => openModal("helpModal");
  document.getElementById("closeHelpModal").onclick = () =>
    closeModal("helpModal");
  document.getElementById("closeAddOpModal").onclick = () =>
    closeModal("addOpModal");
  document.getElementById("closeEditOpModal").onclick = () =>
    closeModal("editOpModal");
  document.getElementById("modalAddBtn").onclick = () => {
    let cat = document.getElementById("modalCat").value;
    let amount = parseFloat(document.getElementById("modalAmount").value);
    let date = document.getElementById("modalDate").value || today();
    if (cat && amount > 0) {
      transactions.push({
        type: currentOpType,
        category: cat,
        subcategory:
          document.getElementById("modalSubcatField").style.display !== "none"
            ? document.getElementById("modalSubcat").value
            : null,
        amountRub: toRub(amount),
        note: document.getElementById("modalNote").value.trim() || null,
        date,
      });
      saveAll();
      refreshAll();
      closeModal("addOpModal");
    } else alert(t("fill_fields"));
  };
  document.getElementById("typeExpenseBtn").onclick = () => {
    currentOpType = "expense";
    document.getElementById("typeExpenseBtn").classList.add("active");
    document.getElementById("typeIncomeBtn").classList.remove("active");
    refreshModalCats();
  };
  document.getElementById("typeIncomeBtn").onclick = () => {
    currentOpType = "income";
    document.getElementById("typeIncomeBtn").classList.add("active");
    document.getElementById("typeExpenseBtn").classList.remove("active");
    refreshModalCats();
  };
  document
    .getElementById("modalCat")
    .addEventListener("change", refreshModalSubcats);
  document.getElementById("modalAddCatBtn").onclick = () => {
    let newCat = prompt(t("enter_category_name"));
    if (
      newCat &&
      !incomeCategories.includes(newCat) &&
      !expenseCategories.includes(newCat)
    ) {
      if (currentOpType === "income") incomeCategories.push(newCat);
      else expenseCategories.push(newCat);
      ensureGroup(newCat, currentOpType);
      updateAllCategoriesOrder();
      saveAll();
      refreshModalCats();
      renderCatManager();
    }
  };
  document.getElementById("modalDelCatBtn").onclick = () => {
    let cat = document.getElementById("modalCat").value;
    if (confirm(t("confirm_delete_category").replace("%s", cat))) {
      if (currentOpType === "income")
        incomeCategories = incomeCategories.filter((c) => c !== cat);
      else expenseCategories = expenseCategories.filter((c) => c !== cat);
      delete categoryGroups[cat];
      updateAllCategoriesOrder();
      saveAll();
      refreshModalCats();
      renderCatManager();
    }
  };
  document.getElementById("clearAllBtn").onclick = () => {
    if (confirm(t("confirm_clear_all"))) {
      transactions = [];
      saveAll();
      refreshAll();
    }
  };
  document.getElementById("viewAllOpsBtn").onclick = () =>
    setActiveTab("operations");
  document.getElementById("editStartBtn").onclick = () => {
    let val = prompt(
      `${t("enter_salary")} (${sym()}):`,
      toDisp(startBalanceRub).toFixed(2),
    );
    if (val && !isNaN(parseFloat(val))) {
      startBalanceRub = toRub(parseFloat(val));
      saveAll();
      updateBalance();
      if (document.getElementById("tabStats").classList.contains("active"))
        updateStats(true);
    }
  };
  document.getElementById("displayCurrencySelect").onchange = () => {
    displayCurrency = document.getElementById("displayCurrencySelect").value;
    saveAll();
    refreshAll();
  };
  document.getElementById("refreshRatesBtn").onclick = async () => {
    try {
      let res = await fetch("https://api.exchangerate-api.com/v4/latest/RUB");
      let data = await res.json();
      exchangeRates = { RUB: 1 };
      for (let c of ["USD", "EUR", "GEL", "GBP", "KZT"])
        exchangeRates[c] = data.rates[c] || exchangeRates[c];
      lastRateUpdate = new Date().toLocaleString();
      document.getElementById("rateStatus").textContent =
        `✅ ${t("updated")}: ${lastRateUpdate}`;
      saveAll();
      refreshAll();
    } catch (e) {
      document.getElementById("rateStatus").textContent =
        `⚠️ ${t("update_error")}`;
    }
  };
  document.getElementById("convBtn").onclick = doConvert;
  document.getElementById("convAmount").oninput = doConvert;
  document.getElementById("convFrom").onchange = doConvert;
  document.getElementById("convTo").onchange = doConvert;
  document.getElementById("openConvHistoryBtn").onclick = () => {
    renderFullConvHistoryModal();
    openModal("convHistoryModal");
  };
  document.getElementById("closeConvHistoryModal").onclick = () =>
    closeModal("convHistoryModal");
  document.getElementById("clearConvHistoryBtn").onclick = () => {
    if (confirm(t("confirm_clear_conv_history"))) clearConvHistory();
  };
  document.getElementById("clearFullConvHistoryBtn").onclick = () => {
    if (confirm(t("confirm_clear_conv_history"))) clearConvHistory();
  };
  document.getElementById("openCalcHistoryBtn").onclick = () => {
    renderFullCalcHistory();
    openModal("calcHistoryModal");
  };
  document.getElementById("closeCalcHistoryModal").onclick = () =>
    closeModal("calcHistoryModal");
  document.getElementById("clearCalcHistoryBtn").onclick = () => {
    if (confirm(t("confirm_clear_calc_history"))) clearCalcHistory();
  };
  document.getElementById("applySearchBtn").onclick = () => renderAllOps();
  document.getElementById("resetSearchBtn").onclick = () => {
    document.getElementById("searchText").value = "";
    document.getElementById("searchFrom").value = "";
    document.getElementById("searchTo").value = "";
    document.getElementById("searchType").value = "";
    renderAllOps();
  };
  document
    .getElementById("searchText")
    .addEventListener("input", () => renderAllOps());
  document
    .getElementById("searchFrom")
    .addEventListener("change", () => renderAllOps());
  document
    .getElementById("searchTo")
    .addEventListener("change", () => renderAllOps());
  document
    .getElementById("searchType")
    .addEventListener("change", () => renderAllOps());
  document.getElementById("addCatGroupBtn").onclick = () => {
    let newCat = prompt(t("enter_category_name"));
    if (
      newCat &&
      !incomeCategories.includes(newCat) &&
      !expenseCategories.includes(newCat)
    ) {
      expenseCategories.push(newCat);
      ensureGroup(newCat, "expense");
      updateAllCategoriesOrder();
      saveAll();
      renderCatManager();
      refreshModalCats();
    }
  };
  document.getElementById("newPageBtn").onclick = createNotebookPage;
  document.getElementById("saveNbPageBtn").onclick = saveNotebookPage;
  document.getElementById("deleteNbPageBtn").onclick = deleteNotebookPage;
  document.getElementById("closeNotebookModal").onclick = () =>
    closeModal("notebookModal");
  document.getElementById("saveSubcatBtn").onclick = saveSubcatEdit;
  document.getElementById("deleteSubcatBtn").onclick = deleteSubcatFromModal;
  document.getElementById("closeEditSubcatModal").onclick = () =>
    closeModal("editSubcatModal");
  document.getElementById("editTypeExpenseBtn").onclick = () => {
    document.getElementById("editTypeExpenseBtn").classList.add("active");
    document.getElementById("editTypeIncomeBtn").classList.remove("active");
    refreshEditModalSubcats();
  };
  document.getElementById("editTypeIncomeBtn").onclick = () => {
    document.getElementById("editTypeIncomeBtn").classList.add("active");
    document.getElementById("editTypeExpenseBtn").classList.remove("active");
    refreshEditModalSubcats();
  };
  document
    .getElementById("editModalCat")
    .addEventListener("change", refreshEditModalSubcats);
  document.getElementById("saveOpBtn").onclick = saveEditedOp;
  document.getElementById("deleteOpBtn").onclick = deleteEditedOp;
  document.getElementById("resetStatsBtn").onclick = resetStats;
  document.querySelectorAll(".period-btn").forEach((btn) => {
    btn.addEventListener("click", () => setPeriod(btn.dataset.period));
  });
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.onclick = () => setActiveTab(btn.dataset.tab);
  });
  window.addEventListener("resize", () => {
    if (document.getElementById("tabStats").classList.contains("active"))
      updateStats(true);
  });
  const observer = new MutationObserver(() => {
    if (document.getElementById("tabStats").classList.contains("active"))
      updateStats(false);
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Сообщаем i18n, что приложение готово
  window._appReady = true;

  // Применяем язык ещё раз после инициализации всех элементов
  if (window.setLanguage) {
    window.setLanguage(localStorage.getItem("app_lang") || "ru");
  }
});

// Экспортируем для i18n
window.refreshAll = refreshAll;
window.updateStats = updateStats;
