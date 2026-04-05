// ========== ПОЛНОСТЬЮ РАБОЧАЯ ЛОГИКА + РЕДАКТИРОВАНИЕ + ИНСТРУКЦИЯ + СВОРАЧИВАЕМЫЙ БЛОК ==========
let transactions = [];
let startBalanceRub = 70000;
let incomeCategories = ["Работа", "Аренда"];
let expenseCategories = ["Продукты", "Транспорт", "Коммуналка", "Кафе"];
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
let currentOpType = "expense";
let editingOpIndex = null;

const SYM = {
  RUB: "₽",
  USD: "$",
  EUR: "€",
  GEL: "₾",
  GBP: "£",
  KZT: "₸",
};
function sym() {
  return SYM[displayCurrency] || displayCurrency;
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
    return new Date(d + "T00:00:00").toLocaleDateString("ru-RU");
  } catch (e) {
    return d;
  }
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
  }
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
}

function ensureGroup(cat, type) {
  if (!categoryGroups[cat])
    categoryGroups[cat] = {
      income: { subcats: [] },
      expense: { subcats: [] },
    };
  if (!categoryGroups[cat][type]) categoryGroups[cat][type] = { subcats: [] };
}
function getSubcats(cat, type) {
  return categoryGroups[cat]?.[type]?.subcats || [];
}
function addSubcat(cat, type, sub) {
  ensureGroup(cat, type);
  let arr = categoryGroups[cat][type].subcats;
  if (!arr.includes(sub)) arr.push(sub);
  saveAll();
}
function removeSubcat(cat, type, sub) {
  if (categoryGroups[cat]?.[type])
    categoryGroups[cat][type].subcats = categoryGroups[cat][
      type
    ].subcats.filter((s) => s !== sub);
  saveAll();
}

function updateBalance() {
  let inc = 0,
    exp = 0;
  for (let t of transactions) {
    if (t.type === "income") inc += t.amountRub;
    else exp += t.amountRub;
  }
  let net = startBalanceRub + inc - exp;
  let s = sym();
  document.getElementById("balanceCards").innerHTML = `
      <div class="bal-card"><div class="bal-label">💰 Зарплата</div><div class="bal-value">${toDisp(startBalanceRub).toFixed(2)} ${s}</div></div>
      <div class="bal-card"><div class="bal-label">📈 Доходы</div><div class="bal-value positive">${toDisp(inc).toFixed(2)} ${s}</div></div>
      <div class="bal-card"><div class="bal-label">📉 Расходы</div><div class="bal-value negative">${toDisp(exp).toFixed(2)} ${s}</div></div>
      <div class="bal-card"><div class="bal-label">💎 Остаток</div><div class="bal-value ${net >= 0 ? "positive" : "negative"}">${toDisp(net).toFixed(2)} ${s}</div></div>
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
  card.innerHTML = `<div class="op-body"><div class="op-row1"><span class="op-cat">${esc(op.category)}${op.subcategory ? " / " + esc(op.subcategory) : ""}</span><span class="op-amount ${isIncome ? "income" : "expense"}">${isIncome ? "+" : "−"}${amount} ${s}</span></div><div class="op-row2"><span>${isIncome ? "💰 Доход" : "💸 Расход"}</span><span>📅 ${fmtDate(op.date)}</span>${noteHtml}</div></div><button class="op-del" data-idx="${idx}" title="Удалить">✕</button>`;
  card.querySelector(".op-del").addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Удалить операцию?")) {
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
    sel.innerHTML = '<option value="">— не указывать —</option>';
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
    alert("Выберите категорию");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Введите сумму больше 0");
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
  if (editingOpIndex !== null && confirm("Удалить операцию?")) {
    transactions.splice(editingOpIndex, 1);
    saveAll();
    refreshAll();
    closeModal("editOpModal");
    editingOpIndex = null;
  }
}

function renderRecentOps() {
  let container = document.getElementById("recentOpsList");
  if (!container) return;
  container.innerHTML = "";
  let sorted = [...transactions]
    .map((t, i) => ({ ...t, _i: i }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);
  if (sorted.length === 0) {
    container.innerHTML =
      '<div class="empty-msg">Нет операций. Нажмите ＋ чтобы добавить.</div>';
    return;
  }
  for (let op of sorted) container.appendChild(buildOpCard(op, op._i));
}

function renderAllOps() {
  let container = document.getElementById("allOpsList");
  if (!container) return;
  container.innerHTML = "";
  let filtered = transactions.map((t, i) => ({ ...t, _i: i }));
  let search = (
    document.getElementById("searchText")?.value || ""
  ).toLowerCase();
  let from = document.getElementById("searchFrom")?.value;
  let to = document.getElementById("searchTo")?.value;
  let type = document.getElementById("searchType")?.value;
  if (type) filtered = filtered.filter((t) => t.type === type);
  if (from) filtered = filtered.filter((t) => (t.date || "") >= from);
  if (to) filtered = filtered.filter((t) => (t.date || "") <= to);
  if (search)
    filtered = filtered.filter((t) =>
      (t.category + (t.subcategory || "") + (t.note || ""))
        .toLowerCase()
        .includes(search),
    );
  filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-msg">Нет операций</div>';
    return;
  }
  for (let op of filtered) container.appendChild(buildOpCard(op, op._i));
}

function renderCatManager() {
  let container = document.getElementById("catManager");
  if (!container) return;
  container.innerHTML = "";
  let allCats = [...new Set([...incomeCategories, ...expenseCategories])];
  for (let cat of allCats) {
    let inInc = incomeCategories.includes(cat);
    let inExp = expenseCategories.includes(cat);
    let typeLabel =
      inInc && inExp ? "🔄 Оба" : inInc ? "💰 Доход" : "💸 Расход";
    let div = document.createElement("div");
    div.className = "cat-card";
    div.innerHTML = `<div style="flex:1;"><div><strong style="cursor:pointer;" class="cat-rename" data-cat="${esc(cat)}">📁 ${esc(cat)}</strong> <span style="font-size:0.7rem;">${typeLabel}</span></div>`;
    if (inInc) {
      let subsInc = getSubcats(cat, "income");
      if (subsInc.length)
        div.innerHTML += `<div class="subcats-wrap"><div class="subcats-label">💰 Доход</div><div class="subcats-row" id="subs-inc-${cat}"></div></div>`;
    }
    if (inExp) {
      let subsExp = getSubcats(cat, "expense");
      if (subsExp.length)
        div.innerHTML += `<div class="subcats-wrap"><div class="subcats-label">💸 Расход</div><div class="subcats-row" id="subs-exp-${cat}"></div></div>`;
    }
    div.innerHTML += `<div class="cat-actions-row"><button class="btn-sm add-sub" data-cat="${esc(cat)}" data-type="income">+ Подкат. доход</button><button class="btn-sm add-sub" data-cat="${esc(cat)}" data-type="expense">+ Подкат. расход</button><button class="btn-sm del-cat" data-cat="${esc(cat)}">🗑 Удалить</button></div></div>`;
    container.appendChild(div);
    if (inInc) fillSubcatRow(cat, "income", `subs-inc-${cat}`);
    if (inExp) fillSubcatRow(cat, "expense", `subs-exp-${cat}`);
    div
      .querySelector(".cat-rename")
      .addEventListener("click", () => renameCategory(cat));
    div.querySelectorAll(".add-sub").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        let cat = btn.dataset.cat,
          type = btn.dataset.type;
        let newSub = prompt("Название подкатегории:");
        if (newSub && newSub.trim()) {
          addSubcat(cat, type, newSub.trim());
          renderCatManager();
          refreshModalCats();
        }
      }),
    );
    div.querySelector(".del-cat").addEventListener("click", () => {
      if (confirm(`Удалить категорию "${cat}"?`)) {
        incomeCategories = incomeCategories.filter((c) => c !== cat);
        expenseCategories = expenseCategories.filter((c) => c !== cat);
        delete categoryGroups[cat];
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
      if (confirm(`Удалить подкатегорию "${sub}"?`)) {
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
  let newName = prompt("Новое название категории:", oldName);
  if (!newName || newName === oldName) return;
  if ([...incomeCategories, ...expenseCategories].includes(newName)) {
    alert("Категория уже существует");
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
    alert("Название не может быть пустым");
    return;
  }
  if (oldSub !== newSub) {
    let subs = getSubcats(cat, type);
    if (subs.includes(newSub)) {
      alert("Такая подкатегория уже есть");
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
  if (confirm(`Удалить подкатегорию "${sub}"?`)) {
    removeSubcat(cat, type, sub);
    renderCatManager();
    refreshModalCats();
    closeModal("editSubcatModal");
  }
}

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
    el.innerHTML = '<div class="empty-msg">Нет истории</div>';
    return;
  }
  let last5 = convHistory.slice(0, 5);
  el.innerHTML = last5
    .map(
      (h, i) =>
        `<div class="conv-hist-item"><span>${h.amount} ${h.from} → ${h.result.toFixed(4)} ${h.to}</span><button class="hist-del" data-idx="${i}">✕</button></div>`,
    )
    .join("");
  el.querySelectorAll(".hist-del").forEach((btn) => {
    btn.addEventListener("click", (e) => {
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
    container.innerHTML = '<div class="empty-msg">История пуста</div>';
    return;
  }
  convHistory.forEach((h, idx) => {
    let card = document.createElement("div");
    card.className = "op-card";
    card.innerHTML = `<div class="op-body"><div>${h.amount} ${h.from} → ${h.to} = ${h.result.toFixed(4)} ${h.to}</div><div style="font-size:0.7rem;">🕒 ${esc(h.ts)}</div></div><button class="hist-del" data-idx="${idx}">✕</button>`;
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
    } else calcExpr = "Ошибка";
  } catch (e) {
    calcExpr = "Ошибка";
  }
  renderCalcDisplay();
  renderCalcPreview();
}
function handleCalc(action) {
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
        .join(" | ") || "Нет истории";
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
    ["-", "-"],
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
    container.innerHTML = '<div class="empty-msg">Нет истории</div>';
    return;
  }
  calcHistory.forEach((h, idx) => {
    let card = document.createElement("div");
    card.className = "calc-hist-item";
    card.innerHTML = `<span>${h.expr} = ${h.result}</span><div><span style="font-size:0.7rem;">${h.ts}</span><button class="hist-del" data-idx="${idx}" style="margin-left:8px;">✕</button></div>`;
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

function loadNotebook() {
  let saved = localStorage.getItem("notebook_pages");
  if (saved) notebookPages = JSON.parse(saved);
  else
    notebookPages = [
      {
        id: Date.now(),
        title: "Пример",
        date: today(),
        content: "Здесь можно писать заметки ✍️",
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
    container.innerHTML =
      '<div class="empty-msg">Нет страниц. Нажмите ➕ для создания.</div>';
    return;
  }
  let sorted = [...notebookPages].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
  for (let page of sorted) {
    let card = document.createElement("div");
    card.className = "nb-card";
    let preview = (page.content || "").replace(/\n/g, " ").substring(0, 70);
    card.innerHTML = `<div class="nb-card-top"><span class="nb-title">📄 ${esc(page.title)}</span><span class="nb-date">${fmtDate(page.date)}</span></div><div class="nb-preview">${esc(preview) || "(пусто)"}</div>`;
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
    alert("Название не может быть пустым");
    return;
  }
  let conflict = notebookPages.some(
    (p) =>
      p.id !== currentNbId && p.title.toLowerCase() === title.toLowerCase(),
  );
  if (conflict) {
    alert(`Страница "${title}" уже существует`);
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
  if (confirm("Удалить эту страницу?")) {
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
    let m = p.title.match(/Страница (\d+)/i);
    if (m && parseInt(m[1]) > maxNum) maxNum = parseInt(m[1]);
  });
  let title = `Страница ${maxNum + 1}`;
  let newPage = { id: Date.now(), title, date: today(), content: "" };
  notebookPages.push(newPage);
  saveNotebook();
  renderNotebookList();
  openNotebookEdit(newPage.id);
}

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
    sel.innerHTML = '<option value="">— не указывать —</option>';
    subs.forEach((s) => sel.appendChild(new Option(s, s)));
  } else field.style.display = "none";
}

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

  // FAB и кнопка быстрого действия на главной
  document.getElementById("fabBtn").onclick = () => {
    document.getElementById("modalDate").value = today();
    openModal("addOpModal");
  };
  document.getElementById("homeQuickAddBtn").onclick = () => {
    document.getElementById("modalDate").value = today();
    openModal("addOpModal");
  };

  // Сворачиваемый блок
  const collapsible = document.getElementById("quickActionBlock");
  const header = collapsible.querySelector(".collapsible-header");
  header.addEventListener("click", () => {
    collapsible.classList.toggle("collapsed");
  });

  // Помощь
  document.getElementById("helpBtn").onclick = () => openModal("helpModal");
  document.getElementById("closeHelpModal").onclick = () =>
    closeModal("helpModal");

  // Закрытие модалок
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
    } else alert("Заполните категорию и сумму");
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
    let newCat = prompt("Название категории");
    if (
      newCat &&
      !incomeCategories.includes(newCat) &&
      !expenseCategories.includes(newCat)
    ) {
      if (currentOpType === "income") incomeCategories.push(newCat);
      else expenseCategories.push(newCat);
      ensureGroup(newCat, currentOpType);
      saveAll();
      refreshModalCats();
      renderCatManager();
    }
  };
  document.getElementById("modalDelCatBtn").onclick = () => {
    let cat = document.getElementById("modalCat").value;
    if (confirm(`Удалить "${cat}"?`)) {
      if (currentOpType === "income")
        incomeCategories = incomeCategories.filter((c) => c !== cat);
      else expenseCategories = expenseCategories.filter((c) => c !== cat);
      delete categoryGroups[cat];
      saveAll();
      refreshModalCats();
      renderCatManager();
    }
  };
  document.getElementById("clearAllBtn").onclick = () => {
    if (confirm("Удалить ВСЕ операции?")) {
      transactions = [];
      saveAll();
      refreshAll();
    }
  };
  document.getElementById("viewAllOpsBtn").onclick = () =>
    setActiveTab("operations");
  document.getElementById("editStartBtn").onclick = () => {
    let val = prompt(
      `Зарплата (${sym()}):`,
      toDisp(startBalanceRub).toFixed(2),
    );
    if (val && !isNaN(parseFloat(val))) {
      startBalanceRub = toRub(parseFloat(val));
      saveAll();
      updateBalance();
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
        `✅ Обновлено: ${lastRateUpdate}`;
      saveAll();
      refreshAll();
    } catch (e) {
      document.getElementById("rateStatus").textContent =
        "⚠️ Ошибка обновления";
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
    if (confirm("Очистить всю историю конвертации?")) clearConvHistory();
  };
  document.getElementById("clearFullConvHistoryBtn").onclick = () => {
    if (confirm("Очистить всю историю?")) clearConvHistory();
  };
  document.getElementById("openCalcHistoryBtn").onclick = () => {
    renderFullCalcHistory();
    openModal("calcHistoryModal");
  };
  document.getElementById("closeCalcHistoryModal").onclick = () =>
    closeModal("calcHistoryModal");
  document.getElementById("clearCalcHistoryBtn").onclick = () => {
    if (confirm("Очистить историю калькулятора?")) clearCalcHistory();
  };
  document.getElementById("applySearchBtn").onclick = renderAllOps;
  document.getElementById("resetSearchBtn").onclick = () => {
    document.getElementById("searchText").value = "";
    document.getElementById("searchFrom").value = "";
    document.getElementById("searchTo").value = "";
    document.getElementById("searchType").value = "";
    renderAllOps();
  };
  document.getElementById("addCatGroupBtn").onclick = () => {
    let newCat = prompt("Название новой категории");
    if (
      newCat &&
      !incomeCategories.includes(newCat) &&
      !expenseCategories.includes(newCat)
    ) {
      expenseCategories.push(newCat);
      ensureGroup(newCat, "expense");
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
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.onclick = () => setActiveTab(btn.dataset.tab);
  });
});
