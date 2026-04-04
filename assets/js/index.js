const EMOJI_MAP = [
  [/квартира|аренда|жильё|жилье|недвижимость/i, "🏠"],
  [/коммуналки|свет|вода|газ|электрэнергия|отопление|сбор мусора/i, "💡"],
  [/продукты|еда|магазин|супермаркет|продовольствие/i, "🛒"],
  [/кафе|ресторан|обед|ужин|завтрак|еда вне/i, "🍽️"],
  [/транспорт|такси|автобус|метро|бензин|машина|авто/i, "🚗"],
  [/одежда|гардероб|обувь/i, "👕"],
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
  [/неожидан|прочее|разное|другое/i, "❓"],
  [/ненужн|лишн/i, "🗑️"],
  [/помидор|огурец|овощ|фрукт|зелень/i, "🥦"],
  [/мясо|рыба|курица|говядина/i, "🥩"],
  [/хлеб|выпечк|булк/i, "🍞"],
  [/молок|сыр|творог|кефир|йогурт/i, "🥛"],
];
function getEmoji(name) {
  const n = name.toLowerCase();
  for (const [re, emoji] of EMOJI_MAP) if (re.test(n)) return emoji;
  return "📌";
}
let transactions = [],
  startBalanceRub = 70000;
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
// categoryGroups now supports: { income: { subcats: [] }, expense: { subcats: [] } } or legacy { subcats: [] }
let categoryGroups = {},
  exchangeRates = {
    RUB: 1,
    USD: 0.012,
    EUR: 0.011,
    GEL: 0.031,
    GBP: 0.0095,
    KZT: 5.2,
  };
let displayCurrency = "GEL",
  lastCat = null,
  lastSubcat = null,
  lastRateUpdate = null;
let calcHistory = [],
  convHistory = [];

// ---- Category group helpers supporting dual income/expense subcats ----
function getSubcats(catName, type) {
  const g = categoryGroups[catName];
  if (!g) return [];
  // New format: { income: { subcats: [] }, expense: { subcats: [] } }
  if (g[type] && Array.isArray(g[type].subcats)) return g[type].subcats;
  // Legacy format: { subcats: [] }
  if (Array.isArray(g.subcats)) return g.subcats;
  return [];
}
function ensureGroup(catName, type) {
  if (!categoryGroups[catName]) categoryGroups[catName] = {};
  const g = categoryGroups[catName];
  // Migrate legacy format
  if (Array.isArray(g.subcats)) {
    const old = g.subcats;
    delete g.subcats;
    g.income = { subcats: [...old] };
    g.expense = { subcats: [...old] };
  }
  if (!g[type]) g[type] = { subcats: [] };
}
function addSubcat(catName, type, subName) {
  ensureGroup(catName, type);
  const g = categoryGroups[catName][type];
  if (!g.subcats.includes(subName)) g.subcats.push(subName);
}
function removeSubcat(catName, type, subName) {
  if (!categoryGroups[catName] || !categoryGroups[catName][type]) return;
  categoryGroups[catName][type].subcats = categoryGroups[catName][
    type
  ].subcats.filter((s) => s !== subName);
}

// ---- Selected cat type in modal ----
let selectedCatType = null;
function selectCatType(type) {
  selectedCatType = type;
  document.getElementById("catTypeBtnExpense").className =
    "add-cat-type-btn" + (type === "expense" ? " selected-expense" : "");
  document.getElementById("catTypeBtnIncome").className =
    "add-cat-type-btn" + (type === "income" ? " selected-income" : "");
  document.getElementById("catTypeBtnBoth").className =
    "add-cat-type-btn" + (type === "both" ? " selected-both" : "");
  document.getElementById("addCatBothNote").style.display =
    type === "both" ? "block" : "none";
  document.getElementById("addCatConfirmBtn").disabled = false;
}
function openAddCatModal() {
  selectedCatType = null;
  document.getElementById("addCatNameInput").value = "";
  document.getElementById("addCatConfirmBtn").disabled = true;
  document.getElementById("addCatBothNote").style.display = "none";
  ["catTypeBtnExpense", "catTypeBtnIncome", "catTypeBtnBoth"].forEach((id) => {
    document.getElementById(id).className = "add-cat-type-btn";
  });
  document.getElementById("addCatModal").style.display = "flex";
  setTimeout(() => document.getElementById("addCatNameInput").focus(), 100);
}
function closeAddCatModal() {
  document.getElementById("addCatModal").style.display = "none";
}
function confirmAddCategory() {
  const name = document.getElementById("addCatNameInput").value.trim();
  if (!name) {
    alert("Введите название категории");
    return;
  }
  if (!selectedCatType) {
    alert("Выберите тип категории");
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
    alert(`Категория "${name}" уже существует в этом типе`);
    return;
  }
  // Ensure separate group entries for both types
  if (selectedCatType === "both") {
    ensureGroup(name, "income");
    ensureGroup(name, "expense");
  } else {
    ensureGroup(name, selectedCatType);
  }
  saveAll();
  refreshSelectCategories();
  renderCatManager();
  refreshNotebookAccordionHeight();
  closeAddCatModal();
}

// Keyboard shortcut for type selection in modal
document.addEventListener("keydown", function (e) {
  const modal = document.getElementById("addCatModal");
  if (modal.style.display !== "flex") return;
  if (document.activeElement === document.getElementById("addCatNameInput"))
    return;
  const key = e.key.toLowerCase();
  if (key === "р" || key === "r") selectCatType("expense");
  else if (key === "д" || key === "d") selectCatType("income");
  else if (key === "b" || key === "о") selectCatType("both");
  else if (key === "escape") closeAddCatModal();
  else if (key === "enter" && selectedCatType) confirmAddCategory();
});

// Also handle key in name input for Enter
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("addCatNameInput")
    ?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && selectedCatType) confirmAddCategory();
    });
});

function loadConvHistory() {
  const raw = localStorage.getItem("conv_history");
  if (raw)
    try {
      convHistory = JSON.parse(raw);
      if (!Array.isArray(convHistory)) convHistory = [];
    } catch (e) {}
  renderConvHistory();
}
function saveConvHistory() {
  localStorage.setItem(
    "conv_history",
    JSON.stringify(convHistory.slice(0, 15)),
  );
}
function addConvHistory(from, to, amount, result) {
  convHistory.unshift({
    from,
    to,
    amount,
    result,
    timestamp: new Date().toLocaleString(),
  });
  if (convHistory.length > 15) convHistory.pop();
  saveConvHistory();
  renderConvHistory();
}
function deleteConvHistoryItem(index) {
  convHistory.splice(index, 1);
  saveConvHistory();
  renderConvHistory();
}
function clearConvHistory() {
  if (confirm("Очистить всю историю конвертера?")) {
    convHistory = [];
    saveConvHistory();
    renderConvHistory();
  }
}
function renderConvHistory() {
  const div = document.getElementById("convHistory");
  if (!div) return;
  if (convHistory.length === 0) {
    div.innerHTML =
      "<strong>📜 История конвертации:</strong><br><span>нет записей</span>";
    return;
  }
  let html = "<strong>📜 История конвертации:</strong><br>";
  convHistory.forEach((h, idx) => {
    html += `<div class='conv-history-item'><span>${h.amount} ${h.from} → ${h.result.toFixed(4)} ${h.to}</span><button class='del-conv-item' data-idx='${idx}'>✖</button></div>`;
  });
  html += `<button class='conv-clear-all'>🗑️ Очистить всю историю</button>`;
  div.innerHTML = html;
  document.querySelectorAll(".del-conv-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteConvHistoryItem(parseInt(btn.dataset.idx));
    });
  });
  document
    .querySelector(".conv-clear-all")
    ?.addEventListener("click", () => clearConvHistory());
}
function loadCalcHistory() {
  const raw = localStorage.getItem("calc_history");
  if (raw)
    try {
      calcHistory = JSON.parse(raw);
      if (!Array.isArray(calcHistory)) calcHistory = [];
    } catch (e) {}
}
function saveCalcHistory() {
  localStorage.setItem(
    "calc_history",
    JSON.stringify(calcHistory.slice(0, 30)),
  );
}
function addToCalcHistory(expr, result) {
  if (!expr || result === undefined || !isFinite(result)) return;
  calcHistory.unshift({
    expr,
    result,
    timestamp: new Date().toLocaleString(),
  });
  if (calcHistory.length > 30) calcHistory.pop();
  saveCalcHistory();
  renderCalcHistoryPreview();
}
function renderCalcHistoryPreview() {
  const previewDiv = document.getElementById("calcHistoryPreview");
  if (!previewDiv) return;
  if (calcHistory.length === 0) {
    previewDiv.innerHTML = "📋 История: пусто";
    return;
  }
  let html = "📋 Последние: ";
  calcHistory.slice(0, 5).forEach((h) => {
    html += `<span style="display:inline-block;margin-right:12px;background:rgba(0,0,0,0.05);padding:3px 8px;border-radius:20px;">${escapeHtml(h.expr)} = ${h.result}</span>`;
  });
  previewDiv.innerHTML = html;
}
function mergeCats(saved, defaults) {
  const r = [...saved];
  for (const c of defaults) if (!r.includes(c)) r.push(c);
  return r;
}
function ensureDefaultSubcats() {
  const defaultSubs = {
    коммуналка: ["свет", "вода", "газ", "сбор мусора", "интернет"],
    продукты: ["овощи", "фрукты", "мясо", "рыба", "молочные", "хлеб"],
    транспорт: ["метро", "автобус", "такси", "бензин"],
  };
  for (const [cat, subs] of Object.entries(defaultSubs)) {
    ensureGroup(cat, "expense");
    for (const s of subs)
      if (!categoryGroups[cat].expense.subcats.includes(s))
        categoryGroups[cat].expense.subcats.push(s);
  }
}
function loadData() {
  const raw = localStorage.getItem("budget_pro_v5");
  if (raw) {
    try {
      const d = JSON.parse(raw);
      transactions = d.transactions || [];
      startBalanceRub = d.startBalanceRub ?? 70000;
      incomeCategories = mergeCats(d.incomeCategories || [], [
        "Работа",
        "Аренда квартиры",
      ]);
      expenseCategories = mergeCats(
        d.expenseCategories || [],
        expenseCategories,
      );
      categoryGroups = d.categoryGroups || {};
      displayCurrency = d.displayCurrency || "GEL";
      lastCat = d.lastCat || null;
      lastSubcat = d.lastSubcat || null;
      if (d.exchangeRates)
        exchangeRates = { ...exchangeRates, ...d.exchangeRates };
      lastRateUpdate = d.lastRateUpdate || null;
    } catch (e) {}
  }
  ensureDefaultSubcats();
  document.getElementById("displayCurrencySelect").value = displayCurrency;
  loadCalcHistory();
  loadConvHistory();
}
function saveAll() {
  localStorage.setItem(
    "budget_pro_v5",
    JSON.stringify({
      transactions,
      startBalanceRub,
      incomeCategories,
      expenseCategories,
      categoryGroups,
      displayCurrency,
      lastCat,
      lastSubcat,
      exchangeRates,
      lastRateUpdate,
    }),
  );
}
const SYM = {
  RUB: "₽",
  USD: "$",
  EUR: "€",
  GEL: "₾",
  GBP: "£",
  KZT: "₸",
};
const sym = () => SYM[displayCurrency] || displayCurrency;
const rubToDisp = (r) => r * (exchangeRates[displayCurrency] || 1);
const dispToRub = (d) => d / (exchangeRates[displayCurrency] || 1);
function renameCategory(oldName, newName) {
  if (!oldName || !newName || oldName === newName) return false;
  newName = newName.trim();
  if (newName === "") return false;
  const allCurrent = [...incomeCategories, ...expenseCategories];
  if (allCurrent.includes(newName) && newName !== oldName) {
    alert(`Категория "${newName}" уже существует!`);
    return false;
  }
  incomeCategories = incomeCategories.map((c) => (c === oldName ? newName : c));
  expenseCategories = expenseCategories.map((c) =>
    c === oldName ? newName : c,
  );
  if (categoryGroups[oldName]) {
    categoryGroups[newName] = categoryGroups[oldName];
    delete categoryGroups[oldName];
  } else if (categoryGroups[newName] === undefined)
    categoryGroups[newName] = {};
  transactions.forEach((t) => {
    if (t.category === oldName) t.category = newName;
  });
  if (lastCat === oldName) lastCat = newName;
  saveAll();
  refreshAllUI();
  return true;
}
function escapeHtml(str) {
  return String(str).replace(
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
function renderOperationCards(
  containerId,
  transactionsArray,
  withDelete = true,
) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  const s = sym();
  const sorted = [...transactionsArray].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
  sorted.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "op-card";
    card.innerHTML = `<div class="op-card-header" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;"><span style="font-weight:700;background:var(--cat-bg);padding:4px 14px;border-radius:40px;">${getEmoji(item.category)} ${escapeHtml(item.category)}</span><span style="font-size:1.3rem;font-weight:800;">${rubToDisp(item.amountRub).toFixed(2)} ${s}</span></div><div style="font-size:0.85rem;">${item.type === "income" ? "💰 Доход" : "💸 Расход"}${item.subcategory ? ` / ${escapeHtml(item.subcategory)}` : ""}</div><div style="font-size:0.8rem;color:#64748b;margin-top:8px;"><span>📅 ${item.date || "—"}</span>${item.note ? `<span> 📝 ${escapeHtml(item.note)}</span>` : ""}</div>${withDelete ? `<button class="delete-card-btn" data-idx="${idx}">✖ Удалить</button>` : ""}`;
    container.appendChild(card);
  });
  if (withDelete)
    document
      .querySelectorAll(`#${containerId} .delete-card-btn`)
      .forEach((btn) => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx);
          const target = sorted[idx];
          if (target && confirm("Удалить операцию?")) {
            transactions.splice(transactions.indexOf(target), 1);
            saveAll();
            refreshAllUI();
            if (containerId === "fullListCards") renderFullListModal();
            if (containerId === "historyCardsContainer") applySearch();
          }
        };
      });
}
function updateBalanceAndTable() {
  let inc = 0,
    exp = 0;
  for (const t of transactions)
    t.type === "income" ? (inc += t.amountRub) : (exp += t.amountRub);
  const s = sym();
  const balDiv = document.getElementById("balanceContainer");
  if (balDiv)
    balDiv.innerHTML = `<div class="balance-item"><div class="balance-label">💰 Зарплата</div><div class="balance-value">${rubToDisp(startBalanceRub).toFixed(2)} ${s}</div></div><div class="balance-item"><div class="balance-label">📈 Доходы</div><div class="balance-value">${rubToDisp(inc).toFixed(2)} ${s}</div></div><div class="balance-item"><div class="balance-label">📉 Расходы</div><div class="balance-value">${rubToDisp(exp).toFixed(2)} ${s}</div></div><div class="balance-item"><div class="balance-label">💎 Остаток</div><div class="balance-value">${rubToDisp(startBalanceRub + inc - exp).toFixed(2)} ${s}</div></div>`;
  const tbody = document.getElementById("entriesTable");
  if (tbody) {
    tbody.innerHTML = "";
    const sorted = [...transactions]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 20);
    sorted.forEach((item, i) => {
      const row = tbody.insertRow();
      row.innerHTML = `<td>${item.type === "income" ? "Доход" : "Расход"}</td><td>${getEmoji(item.category)} ${escapeHtml(item.category)}</td><td>${item.subcategory ? escapeHtml(item.subcategory) : "—"}</td><td>${rubToDisp(item.amountRub).toFixed(2)} ${s}</td><td style="word-break:break-word">${escapeHtml(item.note || "")}</td><td>${item.date || "—"}</td><td><button class="delete-btn" data-idx="${i}">✖</button></td>`;
    });
    document.querySelectorAll("#entriesTable .delete-btn").forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        const target = sorted[idx];
        if (target) {
          transactions.splice(transactions.indexOf(target), 1);
          saveAll();
          refreshAllUI();
        }
      };
    });
  }
}
function renderFullListModal() {
  renderOperationCards("fullListCards", transactions, true);
}
function renderCatManager() {
  const container = document.getElementById("catManager");
  if (!container) return;
  container.innerHTML = "";
  let allCatsSet = new Set([...incomeCategories, ...expenseCategories]);
  for (let cat in categoryGroups) allCatsSet.add(cat);
  for (const catName of allCatsSet) {
    const inIncome = incomeCategories.includes(catName);
    const inExpense = expenseCategories.includes(catName);
    const emoji = getEmoji(catName);
    const catCard = document.createElement("div");
    catCard.className = "cat-card";
    const header = document.createElement("div");
    header.className = "cat-header";
    const nameSpan = document.createElement("div");
    nameSpan.className = "cat-name";
    let typeBadge = "";
    if (inIncome && inExpense)
      typeBadge = `<span class="cat-type-badge cat-type-both">💰+💸 Оба</span>`;
    else if (inIncome)
      typeBadge = `<span class="cat-type-badge cat-type-income">💰 Доход</span>`;
    else
      typeBadge = `<span class="cat-type-badge cat-type-expense">💸 Расход</span>`;
    nameSpan.innerHTML = `${emoji} ${escapeHtml(catName)} ${typeBadge}`;
    nameSpan.style.cursor = "pointer";
    nameSpan.title = "Нажмите, чтобы переименовать";
    nameSpan.onclick = (e) => {
      e.stopPropagation();
      const newName = prompt(
        `Введите новое название для "${catName}":`,
        catName,
      );
      if (newName && newName.trim() !== catName)
        renameCategory(catName, newName.trim());
    };
    const btnGroup = document.createElement("div");
    btnGroup.className = "flex-buttons";
    // Add subcat buttons — show per type if both
    if (inIncome && inExpense) {
      const addSubIncome = document.createElement("button");
      addSubIncome.className = "small add-sub-btn";
      addSubIncome.textContent = "+ Подкат. (доход)";
      addSubIncome.dataset.cat = catName;
      addSubIncome.dataset.type = "income";
      const addSubExpense = document.createElement("button");
      addSubExpense.className = "small add-sub-btn";
      addSubExpense.textContent = "+ Подкат. (расход)";
      addSubExpense.dataset.cat = catName;
      addSubExpense.dataset.type = "expense";
      btnGroup.appendChild(addSubIncome);
      btnGroup.appendChild(addSubExpense);
    } else {
      const addSubBtn = document.createElement("button");
      addSubBtn.className = "small add-sub-btn";
      addSubBtn.textContent = "+ Подкатегория";
      addSubBtn.dataset.cat = catName;
      addSubBtn.dataset.type = inIncome ? "income" : "expense";
      btnGroup.appendChild(addSubBtn);
    }
    const delCatBtn = document.createElement("button");
    delCatBtn.className = "small del-cat-btn";
    delCatBtn.textContent = "🗑 Удалить";
    delCatBtn.dataset.cat = catName;
    btnGroup.appendChild(delCatBtn);
    header.appendChild(nameSpan);
    header.appendChild(btnGroup);
    catCard.appendChild(header);
    // Render subcats: if both types, show separate sections
    if (inIncome && inExpense) {
      const incSubs = getSubcats(catName, "income");
      const expSubs = getSubcats(catName, "expense");
      if (incSubs.length > 0) {
        const sec = document.createElement("div");
        sec.className = "subcats-section";
        sec.innerHTML = `<div class="subcats-section-label">📈 Подкатегории (доход)</div>`;
        const list = document.createElement("div");
        list.className = "subcats-list";
        incSubs.forEach((sub) => {
          const d = document.createElement("div");
          d.className = "subcat-item";
          d.innerHTML = `<span>${escapeHtml(sub)}</span><button class="del-sub" data-cat="${escapeHtml(catName)}" data-sub="${escapeHtml(sub)}" data-type="income">✖</button>`;
          list.appendChild(d);
        });
        sec.appendChild(list);
        catCard.appendChild(sec);
      }
      if (expSubs.length > 0) {
        const sec = document.createElement("div");
        sec.className = "subcats-section";
        sec.innerHTML = `<div class="subcats-section-label">📉 Подкатегории (расход)</div>`;
        const list = document.createElement("div");
        list.className = "subcats-list";
        expSubs.forEach((sub) => {
          const d = document.createElement("div");
          d.className = "subcat-item";
          d.innerHTML = `<span>${escapeHtml(sub)}</span><button class="del-sub" data-cat="${escapeHtml(catName)}" data-sub="${escapeHtml(sub)}" data-type="expense">✖</button>`;
          list.appendChild(d);
        });
        sec.appendChild(list);
        catCard.appendChild(sec);
      }
    } else {
      const type = inIncome ? "income" : "expense";
      const subs = getSubcats(catName, type);
      if (subs.length > 0) {
        const list = document.createElement("div");
        list.className = "subcats-list";
        subs.forEach((sub) => {
          const d = document.createElement("div");
          d.className = "subcat-item";
          d.innerHTML = `<span>${escapeHtml(sub)}</span><button class="del-sub" data-cat="${escapeHtml(catName)}" data-sub="${escapeHtml(sub)}" data-type="${type}">✖</button>`;
          list.appendChild(d);
        });
        catCard.appendChild(list);
      }
    }
    container.appendChild(catCard);
  }
  document.querySelectorAll(".add-sub-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const cat = btn.dataset.cat,
        type = btn.dataset.type;
      let newSub = prompt(
        `Подкатегория для "${cat}" (${type === "income" ? "доход" : "расход"}):`,
      );
      if (!newSub || !newSub.trim()) return;
      newSub = newSub.trim();
      const existing = getSubcats(cat, type);
      if (existing.includes(newSub)) {
        alert("Уже есть");
        return;
      }
      addSubcat(cat, type, newSub);
      saveAll();
      renderCatManager();
      refreshSelectCategories();
    };
  });
  document.querySelectorAll(".del-sub").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      removeSubcat(btn.dataset.cat, btn.dataset.type, btn.dataset.sub);
      saveAll();
      renderCatManager();
      refreshSelectCategories();
    };
  });
  document.querySelectorAll(".del-cat-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const cat = btn.dataset.cat;
      if (!confirm(`Удалить категорию "${cat}"?`)) return;
      incomeCategories = incomeCategories.filter((c) => c !== cat);
      expenseCategories = expenseCategories.filter((c) => c !== cat);
      delete categoryGroups[cat];
      saveAll();
      renderCatManager();
      refreshSelectCategories();
      refreshAllUI();
    };
  });
  refreshNotebookAccordionHeight();
}
function toggleSubcatField() {
  const type = document.getElementById("typeSelect")?.value;
  const cat = document.getElementById("categorySelect")?.value;
  const subs = getSubcats(cat, type);
  const field = document.getElementById("subcatField"),
    sel = document.getElementById("subcatSelect");
  if (!field) return;
  field.style.display = subs.length > 0 ? "block" : "none";
  if (subs.length > 0 && sel) {
    sel.innerHTML = "<option value=''>— не указывать —</option>";
    subs.forEach((s) => sel.appendChild(new Option(s, s)));
    if (lastCat === cat && lastSubcat && subs.includes(lastSubcat))
      sel.value = lastSubcat;
  }
}
function refreshSelectCategories() {
  const type = document.getElementById("typeSelect")?.value;
  const cats = type === "income" ? incomeCategories : expenseCategories;
  const sel = document.getElementById("categorySelect");
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = "";
  cats.forEach((c) => sel.appendChild(new Option(`${getEmoji(c)} ${c}`, c)));
  if (cats.includes(prev)) sel.value = prev;
  else sel.value = cats[0] || "";
  toggleSubcatField();
}
function addCategory() {
  openAddCatModal();
}
function deleteCategoryFromSelect() {
  const type = document.getElementById("typeSelect")?.value,
    val = document.getElementById("categorySelect")?.value;
  if (!val) return;
  if (type === "income") {
    if (incomeCategories.length <= 1) {
      alert("Нельзя удалить последнюю категорию доходов");
      return;
    }
    incomeCategories = incomeCategories.filter((c) => c !== val);
  } else {
    if (expenseCategories.length <= 1) {
      alert("Нельзя удалить последнюю категорию расходов");
      return;
    }
    expenseCategories = expenseCategories.filter((c) => c !== val);
  }
  saveAll();
  refreshSelectCategories();
  renderCatManager();
  refreshNotebookAccordionHeight();
}
function addTransaction() {
  const type = document.getElementById("typeSelect")?.value,
    cat = document.getElementById("categorySelect")?.value;
  const subcatField = document.getElementById("subcatField");
  const subcat =
    subcatField && subcatField.style.display !== "none"
      ? document.getElementById("subcatSelect")?.value
      : "";
  let amt = parseFloat(document.getElementById("amountInput")?.value);
  const note = document.getElementById("noteInput")?.value || "";
  const date =
    document.getElementById("dateInput")?.value ||
    new Date().toISOString().slice(0, 10);
  if (isNaN(amt) || amt <= 0) {
    alert(`Сумма > 0 в ${displayCurrency}`);
    return;
  }
  if (!cat) {
    alert("Выберите категорию");
    return;
  }
  lastCat = cat;
  lastSubcat = subcat || null;
  transactions.push({
    type,
    category: cat,
    subcategory: subcat || null,
    amountRub: dispToRub(amt),
    note,
    date,
  });
  saveAll();
  document.getElementById("amountInput").value = "";
  document.getElementById("noteInput").value = "";
  refreshAllUI();
}
function repeatLastExpense() {
  const last = [...transactions].reverse().find((t) => t.type === "expense");
  if (!last) {
    alert("Нет расходов");
    return;
  }
  document.getElementById("typeSelect").value = "expense";
  refreshSelectCategories();
  document.getElementById("categorySelect").value = last.category;
  toggleSubcatField();
  if (last.subcategory) {
    const sel = document.getElementById("subcatSelect");
    if (sel && [...sel.options].some((o) => o.value === last.subcategory))
      sel.value = last.subcategory;
  }
  document.getElementById("amountInput").focus();
}
function showHistoryModal() {
  document.getElementById("historyModal").style.display = "flex";
  applySearch();
}
function applySearch() {
  const text = document.getElementById("searchText")?.value.toLowerCase() || "";
  const df = document.getElementById("searchDateFrom")?.value || "",
    dt = document.getElementById("searchDateTo")?.value || "";
  const tf = document.getElementById("searchType")?.value || "";
  const filtered = transactions.filter((t) => {
    if (tf && t.type !== tf) return false;
    if (df && t.date < df) return false;
    if (dt && t.date > dt) return false;
    if (text) {
      const s =
        `${t.category} ${t.subcategory || ""} ${t.note || ""}`.toLowerCase();
      return s.includes(text);
    }
    return true;
  });
  renderOperationCards("historyCardsContainer", filtered, true);
}
function resetSearch() {
  ["searchText", "searchDateFrom", "searchDateTo"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const typeEl = document.getElementById("searchType");
  if (typeEl) typeEl.value = "";
  applySearch();
}
function changeStartBalance() {
  let v = prompt(
    `Зарплата (${displayCurrency} ${sym()}):`,
    rubToDisp(startBalanceRub).toFixed(2),
  );
  if (v !== null && !isNaN(+v) && +v > 0) {
    startBalanceRub = dispToRub(+v);
    saveAll();
    refreshAllUI();
  }
}
function changeDisplayCurrency() {
  displayCurrency =
    document.getElementById("displayCurrencySelect")?.value || "GEL";
  saveAll();
  refreshAllUI();
}
function clearAll() {
  if (confirm("Удалить ВСЕ операции?")) {
    transactions = [];
    saveAll();
    refreshAllUI();
  }
}
function refreshAllUI() {
  refreshSelectCategories();
  updateBalanceAndTable();
  renderCatManager();
  updateConverter();
  renderFullListModal();
  applySearch();
}
function updateConverter() {
  const amount = parseFloat(document.getElementById("convAmount")?.value),
    from = document.getElementById("convFrom")?.value,
    to = document.getElementById("convTo")?.value;
  if (isNaN(amount) || !from || !to) return;
  const rub = from === "RUB" ? amount : amount / (exchangeRates[from] || 1);
  const result = rub * (exchangeRates[to] || 1);
  const resDiv = document.getElementById("convResult");
  if (resDiv)
    resDiv.textContent = `${amount} ${from} = ${result.toFixed(4)} ${to}`;
  addConvHistory(from, to, amount, result);
}
function initAccordion() {
  const header = document.getElementById("catSectionHeader"),
    content = document.getElementById("accordionContent");
  if (!header || !content) return;
  const setExpanded = (expand) => {
    if (expand) {
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("expanded");
    } else {
      content.style.maxHeight = "0px";
      content.classList.remove("expanded");
    }
  };
  const isCollapsed =
    localStorage.getItem("budget_categories_collapsed") === "true";
  if (isCollapsed) {
    setExpanded(false);
    header.parentElement.classList.add("collapsed");
  } else {
    setExpanded(true);
    header.parentElement.classList.remove("collapsed");
  }
  header.addEventListener("click", () => {
    const parent = header.parentElement;
    const collapsed = parent.classList.contains("collapsed");
    if (collapsed) {
      setExpanded(true);
      parent.classList.remove("collapsed");
      localStorage.setItem("budget_categories_collapsed", "false");
    } else {
      setExpanded(false);
      parent.classList.add("collapsed");
      localStorage.setItem("budget_categories_collapsed", "true");
    }
  });
}
function initTheme() {
  const saved = localStorage.getItem("budget_theme") || "light";
  if (saved === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
  document.getElementById("sunIcon").onclick = () => {
    document.body.classList.remove("dark");
    localStorage.setItem("budget_theme", "light");
  };
  document.getElementById("moonIcon").onclick = () => {
    document.body.classList.add("dark");
    localStorage.setItem("budget_theme", "dark");
  };
}
let calcExpr = "",
  calcResult = null,
  calcJustEvaled = false;
function calcRender() {
  const display = document.getElementById("calcDisplay"),
    sub = document.getElementById("calcSub");
  if (display) display.textContent = calcExpr || "0";
  if (sub)
    sub.textContent =
      calcResult !== null && !calcJustEvaled ? `= ${calcResult}` : "\u00a0";
}
function calcEval() {
  if (!calcExpr) return;
  try {
    const res = Function('"use strict"; return (' + calcExpr + ")")();
    if (isFinite(res)) {
      calcResult = +res.toPrecision(12);
      addToCalcHistory(calcExpr, calcResult);
      calcExpr = String(calcResult);
      calcJustEvaled = true;
    }
  } catch (e) {
    calcExpr = "";
    calcResult = null;
  }
  calcRender();
}
function handleCalc(action) {
  const isOp = "+-*/".includes(action);
  if (action === "clear") {
    calcExpr = "";
    calcResult = null;
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
    if (!calcExpr) calcExpr = "-";
    else if (!isNaN(calcExpr)) calcExpr = String(-+calcExpr);
    else
      calcExpr = calcExpr.startsWith("-(")
        ? calcExpr.slice(2, -1)
        : `-(${calcExpr})`;
    calcJustEvaled = false;
  } else if (action === "%") {
    try {
      const v = Function('"use strict"; return (' + calcExpr + ")")();
      if (isFinite(v)) {
        calcExpr = String(v / 100);
        calcJustEvaled = false;
      }
    } catch (e) {}
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
      calcRender();
      return;
    }
    calcExpr += action;
  }
  calcRender();
}
function buildCalcButtons() {
  const keys = [
    ["C", "clr", "clear"],
    ["⌫", "bsp", "back"],
    ["%", "op", "%"],
    ["÷", "op", "/"],
    ["7", "", "7"],
    ["8", "", "8"],
    ["9", "", "9"],
    ["×", "op", "*"],
    ["4", "", "4"],
    ["5", "", "5"],
    ["6", "", "6"],
    ["−", "op", "-"],
    ["1", "", "1"],
    ["2", "", "2"],
    ["3", "", "3"],
    ["+", "op", "+"],
    ["+/−", "sign", "sign"],
    ["0", "", "0"],
    [".", ".", "."],
    [" = ", "eq", "="],
  ];
  const grid = document.getElementById("calcGrid");
  if (grid) {
    grid.innerHTML = "";
    keys.forEach(([label, cls, action]) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      if (cls) btn.className = cls;
      btn.onclick = () => handleCalc(action);
      grid.appendChild(btn);
    });
  }
}
async function fetchRates() {
  const statusDiv = document.getElementById("rateStatus");
  statusDiv.textContent = "⏳ Обновление...";
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/RUB");
    if (!res.ok) throw new Error();
    const data = await res.json();
    exchangeRates = { RUB: 1 };
    for (let cur of ["USD", "EUR", "GEL", "GBP", "KZT"])
      exchangeRates[cur] = data.rates[cur] || exchangeRates[cur];
    lastRateUpdate = new Date().toLocaleString();
    statusDiv.textContent = `✅ Курсы: ${lastRateUpdate}`;
    saveAll();
    refreshAllUI();
  } catch (err) {
    statusDiv.textContent = "⚠️ Офлайн курсы (используются сохранённые)";
    refreshAllUI();
  }
}
function renderFullCalcHistoryModal() {
  const container = document.getElementById("calcHistoryList");
  if (!container) return;
  if (calcHistory.length === 0) {
    container.innerHTML = "<div class='op-card'>Нет записей</div>";
    return;
  }
  container.innerHTML = "";
  calcHistory.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "op-card";
    card.innerHTML = `<div><strong>${escapeHtml(item.expr)} = ${item.result}</strong></div><div class="op-details">🕒 ${escapeHtml(item.timestamp)}</div><button class="delete-card-btn" data-idx="${idx}">✖ Удалить</button>`;
    container.appendChild(card);
  });
  document
    .querySelectorAll("#calcHistoryList .delete-card-btn")
    .forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        calcHistory.splice(idx, 1);
        saveCalcHistory();
        renderFullCalcHistoryModal();
        renderCalcHistoryPreview();
      };
    });
}

// ---- NOTEBOOK ----
let notebookPages = [];
function refreshNotebookAccordionHeight() {
  const content = document.getElementById("notebookAccordionContent");
  if (content && content.classList.contains("expanded"))
    content.style.maxHeight = content.scrollHeight + "px";
}
function loadNotebook() {
  const raw = localStorage.getItem("notebook_pages_v1");
  if (raw) {
    try {
      notebookPages = JSON.parse(raw);
      if (!Array.isArray(notebookPages)) notebookPages = [];
    } catch (e) {}
  }
  if (notebookPages.length === 0) {
    notebookPages.push({
      id: Date.now(),
      title: "Пример",
      date: new Date().toISOString().slice(0, 10),
      content: "Здесь можно писать заметки ✍️",
    });
    saveNotebook();
  }
  renderNotebookList();
}
function saveNotebook() {
  localStorage.setItem("notebook_pages_v1", JSON.stringify(notebookPages));
}
function generateUniqueTitle(base) {
  let counter = 1,
    newTitle = base;
  const titles = notebookPages.map((p) => p.title.toLowerCase());
  while (titles.includes(newTitle.toLowerCase())) {
    newTitle = `${base} ${counter}`;
    counter++;
  }
  return newTitle;
}
function createNotebookPage() {
  let baseTitle = "Страница 1",
    maxNum = 0;
  notebookPages.forEach((p) => {
    const match = p.title.match(/Страница (\d+)/i);
    if (match && parseInt(match[1]) > maxNum) maxNum = parseInt(match[1]);
  });
  if (maxNum > 0) baseTitle = `Страница ${maxNum + 1}`;
  const uniqueTitle = generateUniqueTitle(baseTitle);
  notebookPages.push({
    id: Date.now(),
    title: uniqueTitle,
    date: new Date().toISOString().slice(0, 10),
    content: "",
  });
  saveNotebook();
  renderNotebookList();
  refreshNotebookAccordionHeight();
}
function deleteNotebookPage(id) {
  if (confirm("Удалить эту страницу?")) {
    notebookPages = notebookPages.filter((p) => p.id !== id);
    if (currentEditPageId === id) closeNotebookModal();
    saveNotebook();
    renderNotebookList();
    refreshNotebookAccordionHeight();
  }
}
function updateNotebookPage(id, newTitle, newDate, newContent) {
  const page = notebookPages.find((p) => p.id === id);
  if (!page) return false;
  if (newTitle.trim() === "") {
    alert("Название не может быть пустым");
    return false;
  }
  const conflict = notebookPages.some(
    (p) =>
      p.id !== id && p.title.toLowerCase() === newTitle.trim().toLowerCase(),
  );
  if (conflict) {
    alert(`Страница с именем "${newTitle}" уже существует!`);
    return false;
  }
  page.title = newTitle.trim();
  page.date = newDate;
  page.content = newContent;
  saveNotebook();
  renderNotebookList();
  refreshNotebookAccordionHeight();
  return true;
}
function renderNotebookList() {
  const container = document.getElementById("notebookPagesList");
  if (!container) return;
  if (notebookPages.length === 0) {
    container.innerHTML =
      "<div style='padding:20px;text-align:center'>Нет страниц. Создайте первую!</div>";
    return;
  }
  const sorted = [...notebookPages].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
  container.innerHTML = "";
  sorted.forEach((page) => {
    const card = document.createElement("div");
    card.className = "notebook-card";
    const preview = (page.content || "").replace(/\n/g, " ").substring(0, 60);
    const formattedDate = page.date
      ? new Date(page.date).toLocaleDateString("ru-RU")
      : "без даты";
    card.innerHTML = `<div class="notebook-card-header"><span class="notebook-title">📄 ${escapeHtml(page.title)}</span><span class="notebook-date">📅 ${escapeHtml(formattedDate)}</span></div><div class="notebook-preview">${escapeHtml(preview) || "(пусто)"}</div>`;
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      openNotebookModal(page.id);
    });
    container.appendChild(card);
  });
}
let currentEditPageId = null;
function openNotebookModal(id) {
  const page = notebookPages.find((p) => p.id === id);
  if (!page) return;
  currentEditPageId = id;
  document.getElementById("notebookEditTitle").value = page.title;
  document.getElementById("notebookEditDate").value = page.date;
  document.getElementById("notebookEditContent").value = page.content;
  document.getElementById("notebookModal").style.display = "flex";
}
function closeNotebookModal() {
  document.getElementById("notebookModal").style.display = "none";
  currentEditPageId = null;
}
function saveCurrentNotebookPage() {
  if (currentEditPageId === null) return;
  const success = updateNotebookPage(
    currentEditPageId,
    document.getElementById("notebookEditTitle").value,
    document.getElementById("notebookEditDate").value,
    document.getElementById("notebookEditContent").value,
  );
  if (success) closeNotebookModal();
}
function initNotebookAccordion() {
  const header = document.getElementById("notebookSectionHeader"),
    content = document.getElementById("notebookAccordionContent");
  if (!header || !content) return;
  const setExpanded = (expand) => {
    if (expand) {
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("expanded");
    } else {
      content.style.maxHeight = "0px";
      content.classList.remove("expanded");
    }
  };
  const isCollapsed = localStorage.getItem("notebook_collapsed") === "true";
  if (isCollapsed) {
    setExpanded(false);
    header.parentElement.classList.add("collapsed");
  } else {
    setExpanded(true);
    header.parentElement.classList.remove("collapsed");
  }
  header.addEventListener("click", () => {
    const parent = header.parentElement;
    const collapsed = parent.classList.contains("collapsed");
    if (collapsed) {
      setExpanded(true);
      parent.classList.remove("collapsed");
      localStorage.setItem("notebook_collapsed", "false");
    } else {
      setExpanded(false);
      parent.classList.add("collapsed");
      localStorage.setItem("notebook_collapsed", "true");
    }
  });
  window.addEventListener("resize", () => {
    if (
      content.classList.contains("expanded") &&
      !header.parentElement.classList.contains("collapsed")
    )
      content.style.maxHeight = content.scrollHeight + "px";
  });
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", async () => {
  loadData();
  buildCalcButtons();
  calcRender();
  renderCalcHistoryPreview();
  document.getElementById("dateInput").value = new Date()
    .toISOString()
    .slice(0, 10);
  refreshAllUI();
  initAccordion();
  initTheme();

  document.getElementById("openFullListBtn")?.addEventListener("click", () => {
    renderFullListModal();
    document.getElementById("fullListModal").style.display = "flex";
  });
  document
    .getElementById("closeFullListModal")
    ?.addEventListener(
      "click",
      () => (document.getElementById("fullListModal").style.display = "none"),
    );
  document
    .getElementById("closeHistoryModal")
    ?.addEventListener(
      "click",
      () => (document.getElementById("historyModal").style.display = "none"),
    );
  document
    .getElementById("closeCalcHistoryModal")
    ?.addEventListener(
      "click",
      () =>
        (document.getElementById("calcHistoryModal").style.display = "none"),
    );
  window.onclick = (e) => {
    if (e.target.classList.contains("modal")) e.target.style.display = "none";
  };
  document
    .getElementById("typeSelect")
    ?.addEventListener("change", refreshSelectCategories);
  document
    .getElementById("categorySelect")
    ?.addEventListener("change", toggleSubcatField);
  document.getElementById("addBtn")?.addEventListener("click", addTransaction);
  document
    .getElementById("editStartBtn")
    ?.addEventListener("click", changeStartBalance);
  document.getElementById("addCatBtn")?.addEventListener("click", addCategory);
  document
    .getElementById("delCatBtn")
    ?.addEventListener("click", deleteCategoryFromSelect);
  document.getElementById("clearAllBtn")?.addEventListener("click", clearAll);
  document
    .getElementById("displayCurrencySelect")
    ?.addEventListener("change", changeDisplayCurrency);
  document
    .getElementById("addCatGroupBtn")
    ?.addEventListener("click", openAddCatModal);
  document
    .getElementById("repeatLastBtn")
    ?.addEventListener("click", repeatLastExpense);
  document
    .getElementById("showHistoryBtn")
    ?.addEventListener("click", showHistoryModal);
  document
    .getElementById("applySearchBtn")
    ?.addEventListener("click", applySearch);
  document
    .getElementById("resetSearchBtn")
    ?.addEventListener("click", resetSearch);
  document
    .getElementById("refreshRatesBtn")
    ?.addEventListener("click", async () => {
      await fetchRates();
      refreshAllUI();
    });
  document
    .getElementById("quickAddCatBtn")
    ?.addEventListener("click", openAddCatModal);
  document
    .getElementById("convBtn")
    ?.addEventListener("click", updateConverter);
  document
    .getElementById("convAmount")
    ?.addEventListener("input", updateConverter);
  document
    .getElementById("convFrom")
    ?.addEventListener("change", updateConverter);
  document
    .getElementById("convTo")
    ?.addEventListener("change", updateConverter);
  document
    .getElementById("openCalcHistoryBtn")
    ?.addEventListener("click", () => {
      renderFullCalcHistoryModal();
      document.getElementById("calcHistoryModal").style.display = "flex";
    });
  document
    .getElementById("clearCalcHistoryBtn")
    ?.addEventListener("click", () => {
      if (confirm("Очистить историю вычислений?")) {
        calcHistory = [];
        saveCalcHistory();
        renderCalcHistoryPreview();
        renderFullCalcHistoryModal();
      }
    });

  loadNotebook();
  initNotebookAccordion();
  document
    .getElementById("newPageBtn")
    ?.addEventListener("click", createNotebookPage);
  document
    .getElementById("closeNotebookModal")
    ?.addEventListener("click", closeNotebookModal);
  document
    .getElementById("saveNotebookBtn")
    ?.addEventListener("click", saveCurrentNotebookPage);
  document
    .getElementById("deleteNotebookPageBtn")
    ?.addEventListener("click", () => {
      if (currentEditPageId !== null) deleteNotebookPage(currentEditPageId);
    });

  await fetchRates();
  updateConverter();
});
