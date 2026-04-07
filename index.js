// ========== БЮДЖЕТ PRO — ПОЛНАЯ ЛОГИКА ==========
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
let statsResetDate = null;
let currentStatsPeriod = "month";
let statsAnimationFrame = null;
let currentDisplayPercentExpense = 0,
  currentDisplayPercentIncome = 0;
let trendAnimationId = null;

// ========== ГАЙД ==========
const guideSteps = [
  {
    target: "#balancePanel",
    titleKey: "guide_step1_title",
    descKey: "guide_step1_desc",
    defaultTitle: "💰 Панель баланса",
    defaultDesc:
      "Здесь отображается ваш финансовый баланс: начальная зарплата, доходы, расходы и остаток. Нажмите «Зарплата», чтобы установить начальный баланс.",
    navTo: null,
  },
  {
    target: ".fab",
    titleKey: "guide_step2_title",
    descKey: "guide_step2_desc",
    defaultTitle: "➕ Добавление операции",
    defaultDesc:
      "Нажмите эту кнопку, чтобы добавить новую операцию — доход или расход. Укажите категорию, сумму, дату и заметку.",
    navTo: null,
  },
  {
    target: ".bottom-nav",
    titleKey: "guide_step3_title",
    descKey: "guide_step3_desc",
    defaultTitle: "🗂️ Навигация",
    defaultDesc:
      "Главная — последние операции. Операции — полный список с поиском. Категории — управление категориями. Инструменты — калькулятор и конвертер. Блокнот — заметки. Данные — статистика.",
    navTo: null,
  },
  {
    target: "#tabStats",
    navTo: "stats",
    titleKey: "guide_step4_title",
    descKey: "guide_step4_desc",
    defaultTitle: "📊 Статистика",
    defaultDesc:
      "Кольцевая диаграмма показывает соотношение расходов и доходов в процентах. Стрелочная диаграмма — динамику за период: рост вверх = доходы, падение вниз = расходы.",
  },
  {
    target: "#tabNotebook",
    navTo: "notebook",
    titleKey: "guide_step5_title",
    descKey: "guide_step5_desc",
    defaultTitle: "📓 Блокнот",
    defaultDesc:
      "Личный блокнот для заметок. Создавайте страницы, редактируйте их, удаляйте. Страницы выглядят как настоящий блокнот с линиями.",
  },
  {
    target: ".help-btn",
    titleKey: "guide_step6_title",
    descKey: "guide_step6_desc",
    defaultTitle: "❔ Помощь",
    defaultDesc:
      "Нажмите кнопку ❔ в шапке, чтобы открыть подробную инструкцию по всем функциям приложения в любое время.",
    navTo: null,
  },
];

let currentGuideStep = 0;
let guideActive = false;

function startGuide() {
  guideActive = true;
  currentGuideStep = 0;
  document.getElementById("guideOverlay").style.display = "block";
  setActiveTab("home");
  showGuideStep(0);
}

function showGuideStep(idx) {
  const step = guideSteps[idx];
  if (!step) {
    endGuide();
    return;
  }

  if (step.navTo) setActiveTab(step.navTo);

  const overlay = document.getElementById("guideOverlay");
  const spotlight = document.getElementById("guideSpotlight");
  const tooltip = document.getElementById("guideTooltip");
  overlay.style.display = "block";
  overlay.style.pointerEvents = "none";
  tooltip.style.pointerEvents = "all";

  document.getElementById("guideCounter").textContent =
    `Шаг ${idx + 1} из ${guideSteps.length}`;
  document.getElementById("guideTitle").textContent = t(step.titleKey);
  document.getElementById("guideDesc").textContent = t(step.descKey);
  document.getElementById("guideSkipBtn").textContent = t("guide_skip");

  const prog = document.getElementById("guideProgress");
  prog.innerHTML = guideSteps
    .map((_, i) => `<div class="guide-dot ${i === idx ? "active" : ""}"></div>`)
    .join("");

  const nextBtn = document.getElementById("guideNextBtn");
  nextBtn.textContent =
    idx === guideSteps.length - 1
      ? t("guide_finish") || "Готово ✓"
      : t("guide_next");

  requestAnimationFrame(() => {
    const targetEl = document.querySelector(step.target);
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const pad = 8;
      spotlight.style.left = rect.left - pad + "px";
      spotlight.style.top = rect.top - pad + "px";
      spotlight.style.width = rect.width + pad * 2 + "px";
      spotlight.style.height = rect.height + pad * 2 + "px";

      let tTop, tLeft;
      const tw = 280,
        th = 200;
      const viewH = window.innerHeight,
        viewW = window.innerWidth;

      if (rect.bottom + th + 20 < viewH) {
        tTop = rect.bottom + pad + 10;
      } else if (rect.top - th - 20 > 0) {
        tTop = rect.top - th - 10;
      } else {
        tTop = viewH / 2 - th / 2;
      }

      tLeft = rect.left + rect.width / 2 - tw / 2;
      if (tLeft + tw > viewW - 10) tLeft = viewW - tw - 10;
      if (tLeft < 10) tLeft = 10;
      if (tTop < 10) tTop = 10;

      tooltip.style.top = tTop + "px";
      tooltip.style.left = tLeft + "px";
      tooltip.style.maxWidth = tw + "px";
    } else {
      spotlight.style.left = "-100px";
      spotlight.style.top = "-100px";
      spotlight.style.width = "0px";
      spotlight.style.height = "0px";
      tooltip.style.top = window.innerHeight / 2 - 100 + "px";
      tooltip.style.left = window.innerWidth / 2 - 140 + "px";
    }
  });
}

function endGuide() {
  guideActive = false;
  document.getElementById("guideOverlay").style.display = "none";
  localStorage.setItem("guide_shown", "1");
  setActiveTab("home");
}

// ========== УТИЛИТЫ ==========
function setDateValue(inputId, value) {
  const el = document.getElementById(inputId);
  if (!el) return;
  if (window._dpSetValue) window._dpSetValue(el, value);
  else el.value = value;
}

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
  return String(str || "").replace(
    /[&<>]/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m] || m,
  );
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

// ========== БАЛАНС ==========
function updateBalance() {
  let inc = 0,
    exp = 0;
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

// ========== КАРТОЧКИ ОПЕРАЦИЙ ==========
function buildOpCard(op, idx) {
  let isIncome = op.type === "income";
  let amount = toDisp(op.amountRub).toFixed(2);
  let s = sym();
  let card = document.createElement("div");
  card.className = `op-card ${isIncome ? "income-card" : "expense-card"}`;
  card.dataset.index = idx;
  let noteHtml = op.note
    ? `<span title="${esc(op.note)}">📝 ${esc(op.note).substring(0, 28)}${op.note.length > 28 ? "…" : ""}</span>`
    : "";
  card.innerHTML = `
    <div class="op-body">
      <div class="op-row1">
        <span class="op-cat">${esc(op.category)}${op.subcategory ? " · " + esc(op.subcategory) : ""}</span>
        <span class="op-amount ${isIncome ? "income" : "expense"}">${isIncome ? "+" : "−"}${amount} ${s}</span>
      </div>
      <div class="op-row2">
        <span>${isIncome ? "💰" : "💸"} ${isIncome ? t("income") : t("expense")}</span>
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

// ========== РЕДАКТИРОВАНИЕ ОПЕРАЦИИ ==========
function openEditOpModal(index) {
  let op = transactions[index];
  if (!op) return;
  editingOpIndex = index;
  setDateValue("editModalDate", op.date || today());
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
    div.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div><strong style="cursor:pointer;" class="cat-rename" data-cat="${esc(cat)}">📁 ${esc(cat)}</strong> <span style="font-size:0.68rem;color:var(--text-muted);">${typeLabel}</span></div>
      </div>
      <div class="cat-actions-row">
        <button class="btn-sm add-sub" data-cat="${esc(cat)}" data-type="income">+ ${t("add_subcat_income")}</button>
        <button class="btn-sm add-sub" data-cat="${esc(cat)}" data-type="expense">+ ${t("add_subcat_expense")}</button>
        <button class="btn-danger-sm del-cat" data-cat="${esc(cat)}">🗑</button>
      </div>
      <div class="subcats-wrap"><div class="subcats-label">💰 ${t("income")}</div><div class="subcats-row" id="subs-inc-${cat.replace(/\s/g, "_")}"></div></div>
      <div class="subcats-wrap"><div class="subcats-label">💸 ${t("expense")}</div><div class="subcats-row" id="subs-exp-${cat.replace(/\s/g, "_")}"></div></div>
    `;
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
      if (!e.target.classList.contains("subcat-del"))
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
    let idx2 = subs.indexOf(oldSub);
    if (idx2 !== -1) {
      subs[idx2] = newSub;
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
function updateConversionDisplay() {
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
    el.innerHTML = `<div class="empty-msg">${t("no_history")}</div>`;
    return;
  }
  let last5 = convHistory.slice(0, 5);
  el.innerHTML = last5
    .map(
      (h, i) =>
        `<div class="conv-hist-item"><span>${h.amount} ${h.from} → ${h.result.toFixed(4)} ${h.to}</span><button class="hist-del" data-idx="${i}">✕</button></div>`,
    )
    .join("");
  el.querySelectorAll(".hist-del").forEach((btn) =>
    btn.addEventListener("click", () => {
      let idx = parseInt(btn.dataset.idx);
      convHistory.splice(idx, 1);
      localStorage.setItem("conv_hist_full", JSON.stringify(convHistory));
      renderConvHistory();
      if (
        document.getElementById("convHistoryModal").classList.contains("open")
      )
        renderFullConvHistoryModal();
    }),
  );
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
    card.innerHTML = `<div class="op-body"><div>${h.amount} ${h.from} → ${h.to} = ${h.result.toFixed(4)} ${h.to}</div><div style="font-size:0.68rem;color:var(--text-muted);">🕒 ${esc(h.ts)}</div></div><button class="hist-del" data-idx="${idx}">✕</button>`;
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
        .join(" · ") || t("no_history");
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
    card.innerHTML = `<span>${h.expr} = ${h.result}</span><div><span style="font-size:0.65rem;color:var(--text-muted);">${h.ts}</span><button class="hist-del" data-idx="${idx}" style="margin-left:8px;">✕</button></div>`;
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
    let preview = (page.content || "").replace(/\n/g, " ").substring(0, 60);
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
  setDateValue("nbDate", page.date);
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
    expense: isDark ? "#f07060" : "#d94f3d",
    income: isDark ? "#4db87e" : "#2a9d60",
    bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    stroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    gridLine: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    text: isDark ? "rgba(232,237,233,0.5)" : "rgba(26,31,28,0.4)",
  };
}

// Кольцевая диаграмма с анимацией
function drawChartAnimated(
  targetExpensePercent,
  targetIncomePercent,
  duration = 700,
) {
  const canvas = document.getElementById("statsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  if (!parent) return;

  let w = parent.clientWidth;
  if (w < 20) w = 220;
  canvas.width = w;
  canvas.height = w;
  const cx = w / 2,
    cy = w / 2;
  let outerR = w / 2 - 4;
  let innerR = outerR * 0.55;
  if (outerR < 5) outerR = 5;
  if (innerR < 5) innerR = 5;

  const startAngle = -Math.PI / 2;
  const colors = getChartColors();
  let startTime = null;
  let startExpense = currentDisplayPercentExpense;
  let startIncome = currentDisplayPercentIncome;
  let diffExpense = targetExpensePercent - startExpense;
  let diffIncome = targetIncomePercent - startIncome;

  if (statsAnimationFrame) cancelAnimationFrame(statsAnimationFrame);

  function drawDonut(expPct, incPct) {
    ctx.clearRect(0, 0, w, w);
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, 2 * Math.PI);
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI, true);
    ctx.fillStyle = colors.bg;
    ctx.fill();

    const total = expPct + incPct;
    if (total > 0) {
      let expAngle = (expPct / 100) * 2 * Math.PI;
      let incAngle = (incPct / 100) * 2 * Math.PI;

      if (expAngle > 0.01) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, outerR, startAngle, startAngle + expAngle);
        ctx.arc(cx, cy, innerR, startAngle + expAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors.expense;
        ctx.shadowColor = colors.expense + "60";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (incAngle > 0.01) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(
          cx,
          cy,
          outerR,
          startAngle + expAngle,
          startAngle + expAngle + incAngle,
        );
        ctx.arc(
          cx,
          cy,
          innerR,
          startAngle + expAngle + incAngle,
          startAngle + expAngle,
          true,
        );
        ctx.closePath();
        ctx.fillStyle = colors.income;
        ctx.shadowColor = colors.income + "60";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, 2 * Math.PI);
      ctx.arc(cx, cy, innerR, 0, 2 * Math.PI, true);
      ctx.fillStyle = isDarkMode()
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.04)";
      ctx.fill();
    }
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = Math.min(1, (timestamp - startTime) / duration);
    let eased = 1 - Math.pow(1 - progress, 3);
    let curExp = startExpense + diffExpense * eased;
    let curInc = startIncome + diffIncome * eased;
    if (curExp < 0) curExp = 0;
    if (curInc < 0) curInc = 0;
    currentDisplayPercentExpense = curExp;
    currentDisplayPercentIncome = curInc;
    drawDonut(curExp, curInc);
    const pEl = document.getElementById("statsPercent");
    if (pEl)
      pEl.textContent = `${Math.round(curExp)}% / ${Math.round(curInc)}%`;
    if (progress < 1) statsAnimationFrame = requestAnimationFrame(animate);
    else {
      statsAnimationFrame = null;
      currentDisplayPercentExpense = targetExpensePercent;
      currentDisplayPercentIncome = targetIncomePercent;
      drawDonut(targetExpensePercent, targetIncomePercent);
      if (pEl)
        pEl.textContent = `${Math.round(targetExpensePercent)}% / ${Math.round(targetIncomePercent)}%`;
    }
  }
  statsAnimationFrame = requestAnimationFrame(animate);
}

function isDarkMode() {
  return document.body.classList.contains("dark");
}

// Трендовая диаграмма с плавным рисованием линии
function drawTrendChart(animate = true, animationDuration = 1500) {
  const canvas = document.getElementById("trendChart");
  if (!canvas) return;
  const container = canvas.parentElement;
  const W = container.clientWidth - 32;
  const H = 100;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.translate(0.5, 0.5);
  const colors = getChartColors();

  const days = 7;
  const now = new Date();
  const dailyData = [];
  for (let i = days - 1; i >= 0; i--) {
    let d = new Date(now);
    d.setDate(now.getDate() - i);
    let dateStr = d.toISOString().slice(0, 10);
    let inc = 0,
      exp = 0;
    for (let tx of transactions) {
      if (tx.date === dateStr) {
        if (tx.type === "income") inc += toDisp(tx.amountRub);
        else exp += toDisp(tx.amountRub);
      }
    }
    dailyData.push({ date: dateStr, inc, exp });
  }

  const maxVal = Math.max(...dailyData.map((d) => Math.max(d.inc, d.exp)), 1);
  const padX = 8,
    padY = 12;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;
  const xStep = chartW / Math.max(dailyData.length - 1, 1);

  function getPoints(arr, key) {
    return arr.map((d, i) => ({
      x: padX + i * xStep,
      y: padY + chartH - (d[key] / maxVal) * chartH,
    }));
  }
  const incPoints = getPoints(dailyData, "inc");
  const expPoints = getPoints(dailyData, "exp");

  function drawFullArea(points, color) {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, padY + chartH);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1],
        curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.lineTo(points[points.length - 1].x, padY + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padY, 0, padY + chartH);
    grad.addColorStop(0, color + "40");
    grad.addColorStop(1, color + "00");
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function drawLineAndPoints(points, color, progress) {
    if (points.length < 2) return;
    let totalLength = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      totalLength += Math.hypot(dx, dy);
    }
    const targetLength = totalLength * progress;
    let accumulated = 0;
    let endIdx = 0,
      t = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const segLen = Math.hypot(dx, dy);
      if (accumulated + segLen >= targetLength) {
        endIdx = i;
        t = (targetLength - accumulated) / segLen;
        break;
      }
      accumulated += segLen;
      endIdx = i;
    }
    if (endIdx === 0) {
      endIdx = 1;
      t = 0;
    }
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < endIdx; i++) {
      const prev = points[i - 1],
        curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    if (endIdx < points.length) {
      const prev = points[endIdx - 1],
        curr = points[endIdx];
      const interpX = prev.x + (curr.x - prev.x) * t;
      const interpY = prev.y + (curr.y - prev.y) * t;
      const cpx = (prev.x + interpX) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, interpY, interpX, interpY);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowColor = color + "80";
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (let i = 0; i < endIdx; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
    if (endIdx < points.length && t > 0) {
      const interpX =
        points[endIdx - 1].x + (points[endIdx].x - points[endIdx - 1].x) * t;
      const interpY =
        points[endIdx - 1].y + (points[endIdx].y - points[endIdx - 1].y) * t;
      ctx.beginPath();
      ctx.arc(interpX, interpY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  function drawGrid() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 2; i++) {
      let y = padY + chartH * (i / 2);
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(W - padX, y);
      ctx.stroke();
    }
  }

  if (animate) {
    drawGrid();
    drawFullArea(incPoints, colors.income);
    drawFullArea(expPoints, colors.expense);
    const startTime = performance.now();
    if (trendAnimationId) cancelAnimationFrame(trendAnimationId);
    function animateTrend(nowTime) {
      const elapsed = nowTime - startTime;
      let progress = Math.min(1, elapsed / animationDuration);
      let eased = 1 - Math.pow(1 - progress, 3);
      drawGrid();
      drawFullArea(incPoints, colors.income);
      drawFullArea(expPoints, colors.expense);
      drawLineAndPoints(incPoints, colors.income, eased);
      drawLineAndPoints(expPoints, colors.expense, eased);
      if (progress < 1) trendAnimationId = requestAnimationFrame(animateTrend);
      else trendAnimationId = null;
    }
    trendAnimationId = requestAnimationFrame(animateTrend);
  } else {
    drawGrid();
    drawFullArea(incPoints, colors.income);
    drawFullArea(expPoints, colors.expense);
    drawLineAndPoints(incPoints, colors.income, 1);
    drawLineAndPoints(expPoints, colors.expense, 1);
  }
}

function updateStats(animate = true, animationDuration = 1500) {
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
  document.getElementById("statsPeriodLabel").textContent =
    `📊 ${periodLabel} (${resetInfo})`;
  const inc = document.getElementById("statsIncomeAmount");
  const exp = document.getElementById("statsExpenseAmount");
  const bal = document.getElementById("statsBalance");
  if (inc)
    inc.innerHTML = `<span>💰 ${t("income")}</span><span style="font-family:'DM Mono',monospace;color:var(--accent)">${incomeDisp.toFixed(2)} ${s} (${Math.round(targetPercentIncome)}%)</span>`;
  if (exp)
    exp.innerHTML = `<span>💸 ${t("expense")}</span><span style="font-family:'DM Mono',monospace;color:var(--red-text)">${expenseDisp.toFixed(2)} ${s} (${Math.round(targetPercentExpense)}%)</span>`;
  if (bal)
    bal.innerHTML = `<span>💎 ${t("balance")}</span><span style="font-family:'DM Mono',monospace;color:${balanceDisp >= 0 ? "var(--accent)" : "var(--red-text)"}">${balanceDisp.toFixed(2)} ${s}</span>`;
  if (animate) {
    currentDisplayPercentExpense = 0;
    currentDisplayPercentIncome = 0;
    drawChartAnimated(targetPercentExpense, targetPercentIncome, 700);
  } else {
    currentDisplayPercentExpense = targetPercentExpense;
    currentDisplayPercentIncome = targetIncomePercent;
    const pEl = document.getElementById("statsPercent");
    if (pEl)
      pEl.textContent = `${Math.round(targetPercentExpense)}% / ${Math.round(targetPercentIncome)}%`;
    drawChartAnimated(targetPercentExpense, targetPercentIncome, 0);
  }
  drawTrendChart(animate, animationDuration);
}

function resetStats() {
  if (confirm(t("confirm_reset_stats"))) {
    statsResetDate = today();
    saveAll();
    currentDisplayPercentExpense = 0;
    currentDisplayPercentIncome = 0;
    updateStats(true);
    showTemporaryMessage(
      `${t("stats_reset_message")} ${statsResetDate}`,
      12000,
    );
  }
}

function setPeriod(period) {
  currentStatsPeriod = period;
  document.querySelectorAll(".period-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.period === period);
  });
  updateStats(true);
}

// ========== МОДАЛКИ ==========
function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

// ========== ТЕМА ==========
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

// ========== НАВИГАЦИЯ ==========
function setActiveTab(tabId) {
  document
    .querySelectorAll(".tab-pane")
    .forEach((p) => p.classList.remove("active"));
  const tabEl = document.getElementById(
    `tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`,
  );
  if (tabEl) tabEl.classList.add("active");
  document
    .querySelectorAll(".nav-item")
    .forEach((btn) => btn.classList.remove("active"));
  const navEl = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if (navEl) navEl.classList.add("active");
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
  if (document.getElementById("tabOperations")?.classList.contains("active"))
    renderAllOps();
  if (document.getElementById("tabCategories")?.classList.contains("active"))
    renderCatManager();
  if (document.getElementById("tabNotebook")?.classList.contains("active"))
    renderNotebookList();
  if (document.getElementById("tabStats")?.classList.contains("active"))
    updateStats(true);
  updateConversionDisplay();
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

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener("DOMContentLoaded", () => {
  loadAll();
  initTheme();
  buildCalcGrid();
  loadNotebook();

  let savedConv = localStorage.getItem("conv_hist_full");
  convHistory = savedConv ? JSON.parse(savedConv) : [];
  let savedCalc = localStorage.getItem("calc_hist_full");
  calcHistory = savedCalc ? JSON.parse(savedCalc) : [];

  renderConvHistory();
  renderCalcPreview();
  updateBalance();
  renderRecentOps();
  renderAllOps();
  renderCatManager();
  renderNotebookList();
  refreshModalCats();

  document.getElementById("fabBtn").onclick = () => {
    setDateValue("modalDate", today());
    openModal("addOpModal");
  };
  document.getElementById("homeQuickAddBtn").onclick = () => {
    setDateValue("modalDate", today());
    openModal("addOpModal");
  };

  const collapsible = document.getElementById("quickActionBlock");
  collapsible
    .querySelector(".collapsible-header")
    .addEventListener("click", () => {
      collapsible.classList.toggle("collapsed");
    });

  document.getElementById("helpBtn").onclick = () => {
    const helpBody = document.getElementById("helpModalBody");
    if (helpBody) {
      helpBody.innerHTML = `
        <p style="color:var(--text-secondary);font-size:0.88rem;line-height:1.7;">${t("help_intro")}</p><br>
        <div style="font-weight:600;margin-bottom:10px;">${t("help_features")}</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:12px 14px;font-size:0.82rem;line-height:1.6;">${t("help_balance")}</div>
          <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:12px 14px;font-size:0.82rem;line-height:1.6;">${t("help_operations")}</div>
          <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:12px 14px;font-size:0.82rem;line-height:1.6;">${t("help_categories")}</div>
          <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:12px 14px;font-size:0.82rem;line-height:1.6;">${t("help_tools")}</div>
          <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:12px 14px;font-size:0.82rem;line-height:1.6;">${t("help_notebook")}</div>
          <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:12px 14px;font-size:0.82rem;line-height:1.6;">${t("help_stats")}</div>
        </div><br>
        <div style="text-align:center;"><button class="btn-sm guide-restart-btn" id="restartGuideBtn">${t("guide_restart")}</button></div>
      `;
      document
        .getElementById("restartGuideBtn")
        ?.addEventListener("click", () => {
          closeModal("helpModal");
          startGuide();
        });
    }
    openModal("helpModal");
  };

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
      document.getElementById("modalAmount").value = "";
      document.getElementById("modalNote").value = "";
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
  document.getElementById("convAmount").oninput = updateConversionDisplay;
  document.getElementById("convFrom").onchange = updateConversionDisplay;
  document.getElementById("convTo").onchange = updateConversionDisplay;
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
    setDateValue("searchFrom", "");
    setDateValue("searchTo", "");
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
  document
    .querySelectorAll(".period-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => setPeriod(btn.dataset.period)),
    );

  document
    .querySelectorAll(".nav-item")
    .forEach((btn) => (btn.onclick = () => setActiveTab(btn.dataset.tab)));

  window.addEventListener("resize", () => {
    if (document.getElementById("tabStats")?.classList.contains("active"))
      updateStats(false);
  });

  const observer = new MutationObserver(() => {
    if (document.getElementById("tabStats")?.classList.contains("active"))
      updateStats(false);
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  document.getElementById("guideNextBtn").onclick = () => {
    currentGuideStep++;
    if (currentGuideStep >= guideSteps.length) endGuide();
    else showGuideStep(currentGuideStep);
  };
  document.getElementById("guideSkipBtn").onclick = endGuide;

  if (!localStorage.getItem("guide_shown")) {
    setTimeout(() => startGuide(), 800);
  }

  window._appReady = true;
  if (window.setLanguage)
    window.setLanguage(localStorage.getItem("app_lang") || "ru");
  updateConversionDisplay();
});

window.refreshAll = refreshAll;
window.updateStats = updateStats;
window.startGuide = startGuide;
