function injectGuideStyles() {
  if (document.getElementById("guideStyles")) return;
  const isDark = document.body.classList.contains("dark");
  const s = document.createElement("style");
  s.id = "guideStyles";
  s.textContent = `
    .guide-highlight {
      position: fixed; z-index: 9990; pointer-events: none;
      border-radius: 14px;
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.65);
      outline: 3px solid ${isDark ? "#a78bfa" : "#f97316"};
      outline-offset: 4px;
      animation: guideHiPulse 1.5s ease-in-out infinite;
    }
    @keyframes guideHiPulse {
      0%,100%{outline-color:${isDark ? "#a78bfa" : "#f97316"}}
      50%{outline-color:${isDark ? "#f472b6" : "#ec4899"}}
    }
    .guide-tooltip {
      position: fixed; z-index: 9991;
      background: ${isDark ? "rgba(18,8,48,0.97)" : "rgba(255,252,248,0.97)"};
      border: 1px solid ${isDark ? "rgba(167,139,250,0.5)" : "rgba(249,115,22,0.35)"};
      border-radius: 20px; padding: 18px 18px 14px;
      width: min(320px, calc(100vw - 32px));
      box-shadow: 0 16px 48px rgba(0,0,0,0.5);
      animation: guideTipIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both;
    }
    @keyframes guideTipIn { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:none} }
    .guide-tooltip-title {
      font-size: 16px; font-weight: 800; margin-bottom: 8px;
      color: ${isDark ? "#c4b5fd" : "#f97316"};
    }
    .guide-tooltip-desc {
      font-size: 13px; line-height: 1.6; margin-bottom: 16px;
      color: ${isDark ? "#d4c8f8" : "#44403c"};
    }
    .guide-tooltip-actions { display: flex; gap: 8px; }
    .guide-btn-skip {
      flex: 1; padding: 10px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer;
      background: ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"};
      border: 1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)"};
      color: ${isDark ? "rgba(196,181,253,0.7)" : "#9a3412"};
      font-family: inherit;
    }
    .guide-btn-next {
      flex: 2; padding: 10px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer;
      background: ${isDark ? "linear-gradient(135deg,#a78bfa,#f472b6)" : "linear-gradient(135deg,#f97316,#ec4899)"};
      border: 1px solid rgba(255,255,255,0.22); color: #fff;
      box-shadow: 0 4px 14px ${isDark ? "rgba(167,139,250,0.4)" : "rgba(249,115,22,0.35)"};
      font-family: inherit;
    }
    .guide-btn-skip:active,.guide-btn-next:active { transform: scale(0.94); }
  `;
  document.head.appendChild(s);
}
const CREATOR_SECRET = "";

// ═══════════════════════════════════════════════════════════
// VAPID-публичный ключ (тот же, что и в серверной функции)
// ═══════════════════════════════════════════════════════════
const VAPID_PUBLIC_KEY = "";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let isCreatorMode = false;
let backgroundRecoveryStarted = false;
let deferredUiStarted = false;
// ============================================================
// КАТЕГОРИИ
// ============================================================
window.categories = {
  Коммуналка: { subcats: ["Свет", "Вода", "Газ", "Интернет", "Сбор мусора"] },
  Продукты: {
    subcats: [
      "Хлеб",
      "Яйца",
      "Зелень",
      "Сыр",
      "Молоко",
      "Огурцы",
      "Помидоры",
      "Яблоки",
      "Бананы",
    ],
  },
  "Заём банка": { subcats: ["Банк TBC", "Банк Sakartvelo"] },
  "Ежемесячные взносы": {
    subcats: ["Телефон", "Ноутбук", "Планшет", "Ломбард", "Транспорт"],
  },
  Транспорт: {
    subcats: ["Метро", "Автобус", "Маршрутка", "Трамвай", "Бензин", "Самолёт"],
  },
  "Неожиданные траты": { subcats: [] },
};
window.incomeCategories = {
  Зарплата: { subcats: [] },
  Подарок: { subcats: [] },
  Фриланс: { subcats: [] },
};
window.initialCategories = JSON.parse(JSON.stringify(window.categories));
var categories = window.categories;
var incomeCategories = window.incomeCategories;

// ============================================================
// ПЕРЕВОДЫ
// ============================================================
const translations = {
  ru: {
    appName: "$ БюджетPRO",
    slogan: "Твой капитал — Твои правила",
    balance: "Мой баланс",
    income: "Доходы",
    expense: "Расходы",
    salary: "Нач. сумма",
    home: "Главная",
    stats: "Статистика",
    tools: "Инструменты",
    notebook: "Блокнот",
    categories: "Категории",
    settings: "Настройки",
    add: "Добавить",
    quickSuggestions: "📌 Быстрые предложения",
    yourTemplates: "⭐ Ваши шаблоны",
    saveAsTemplate: "⭐ Шаблон",
    manageTemplates: "🗂 Управление шаблонами",
    deleteTemplate: "Удалить шаблон",
    noTemplates: "Шаблоны не добавлены",
    edit: "Изменить",
    delete: "Удалить",
    save: "Сохранить",
    cancel: "Отмена",
    type: "Что добавить?",
    expenseType: "💸 Расход",
    incomeType: "💰 Доход",
    initialCapital: "Стартовый капитал",
    initialCategory: "Начальная сумма",
    toastIncomeFilter: "📈 Ваши доходы",
    toastExpenseFilter: "📉 Ваши расходы",
    category: "Категория",
    subcategory: "Подкатегория",
    amount: "Сумма",
    hours: "Часы",
    minutes: "Минуты",
    chooseDate: "📅 Выбрать дату",
    chooseTimeBtn: "🕒 Выбрать время",
    date: "Дата",
    today: "Сегодня",
    yesterday: "Вчера",
    startOfMonth: "Начало месяца",
    note: "Заметка",
    selectCategory: "— выберите категорию —",
    noSubcategory: "— без подкатегории —",
    allHistory: "📜 Вся история",
    historyHint: "Нажмите чтобы увидеть все записи",
    editBalance: "Изменить начальную сумму",
    editSalaryHint: "👆 Нажмите чтобы изменить",
    totalIncome: "📈 Всего доходов",
    totalExpense: "📉 Всего расходов",
    currentBalance: "💎 Текущий баланс",
    salary_label: "💼 Начальная сумма",
    noOperations: "Пока нет записей.\nНажмите «+» внизу ↓",
    newOperation: "Новая операция",
    editOperation: "Изменить запись",
    confirmDelete: "Удалить эту запись?",
    confirmDeleteAll: "Удалить ВСЕ записи?",
    enterAmount: "Введите сумму",
    enterPositive: "Сумма должна быть больше нуля",
    selectCategoryFirst: "Пожалуйста, выберите категорию",
    calculator: "🧮 Калькулятор",
    converter: "💱 Конвертер валют",
    calcHint: "Нажимайте цифры и знаки",
    convHint: "Введите сумму и выберите валюты",
    fromCurrency: "Из валюты",
    toCurrency: "В валюту",
    sumLabel: "Сумма",
    history: "История",
    clearHistory: "Очистить историю",
    convert: "Перевести",
    newPage: "Новая страница",
    pageTitle: "Название страницы",
    content: "Текст заметки",
    noPages: "Нет страниц.",
    notebookHint: "Заметки, номера телефонов, планы.",
    addCategory: "Добавить категорию",
    deleteCategory: "Удалить категорию",
    addSubcategory: "Добавить подкатегорию",
    incomeCats: "💰 Категории доходов",
    expCatsTitle: "📉 Категории расходов",
    catHint: "Нажмите на категорию чтобы изменить.",
    editCatTitle: "Изменить категорию",
    editSubcatTitle: "Изменить подкатегорию",
    newSubcatTitle: "Новая подкатегория",
    catNameLabel: "Введите название:",
    newName: "Новое название:",
    inCategoryLabel: "В категории:",
    theme: "🎨 Оформление",
    language: "🌐 Язык",
    data: "💾 Данные",
    updateRates: "🔄 Обновить курсы",
    resetAll: "🗑️ Сбросить всё",
    currency: "🌍 Валюта отображения",
    currRUB: "₽ Рубль",
    currUSD: "$ Доллар",
    currEUR: "€ Евро",
    currGEL: "₾ Лари",
    currGBP: "£ Фунт",
    currKZT: "₸ Тенге",
    rub: "₽",
    usd: "$",
    eur: "€",
    gel: "₾",
    gbp: "£",
    kzt: "₸",
    ok: "Понятно",
    error: "Ошибка",
    allOps: "Все операции",
    clearAllOps: "Удалить историю",
    saved: "✓ Сохранено",
    deleted: "🗑 Удалено",
    ratesUpdated: "✓ Курсы обновлены",
    resetDone: "✓ Всё сброшено",
    welcomeTitle: "Добро пожаловать! 👋",
    welcomeText: "Нажмите «+» чтобы начать.",
    welcomeClose: "Понятно!",
    searchPlaceholder: "Поиск по категориям, заметкам, сумме...",
    searchFound: "Найдено",
    searchOf: "из",
    searchRecords: "записей",
    expCategory: "Категория расходов",
    incCategory: "Категория доходов",
    noteHint: "Можно оставить пустым",
    cardHintSalary: "👆 Нажмите чтобы изменить",
    cardHintBalance: "Сколько у вас сейчас",
    cardHintIncome: "Всего получено",
    cardHintExpense: "Всего потрачено",
    budgetDesc: "Лимиты расходов по категориям на месяц",
    shareTitle: "🔗 Дать доступ",
    shareDesc:
      "Другой пользователь сможет войти в этот профиль с другого устройства",
    shareCreate: "Создать доступ",
    shareRevoke: "Отозвать доступ",
    shareActive: "✅ Доступ активен",
    shareCode: "Код доступа",
    shareCodeHint:
      "Отправьте этот код пользователю через WhatsApp, Telegram или email",
    sharePassword: "Пароль для входа (необязательно)",
    sharePasswordHint: "Без пароля любой с кодом сможет войти",
    shareChangePassword: "Изменить пароль",
    shareRemovePassword: "Убрать пароль",
    shareSetPassword: "Установить пароль",
    sharePermissions: "⚙️ Разрешения для гостя",
    permAdd: "➕ Добавлять операции",
    permDelete: "🗑 Удалять операции",
    permEdit: "✏️ Редактировать операции",
    permStats: "📊 Просматривать статистику",
    permNotes: "📓 Вести заметки",
    permBudgets: "💰 Управлять бюджетами",
    permCats: "🗂 Управлять категориями",
    permExport: "📤 Экспортировать данные",
    permLabels: {
      add: "Добавление",
      del: "Удаление",
      edit: "Редактирование",
      stats: "Статистика",
      notes: "Заметки",
      budgets: "Бюджеты",
      cats: "Категории",
      export: "Экспорт",
      viewOwner: "Просматривать мои данные",
    },
    permViewOwner: "👁 Разрешить просматривать мой профиль",
    permViewOwnerDesc: "Гость сможет видеть ваши операции и статистику",
    shareDownload: "⬇️ Скачать пакет данных",
    shareSyncSend: "📤 Отправить мои изменения",
    exitGuestMode: "🚪 Выйти из гостевого режима",
    exitGuestDone: "Вы вернулись в свой профиль",
    whosProfile: "Ваш профиль:",
    guestProfile: "Гостевой профиль:",
    shareSyncReceive: "📥 Получить обновления",
    shareLink: "🔗 Поделиться ссылкой",
    shareLinkHint:
      "Получатель открывает ссылку — и сразу попадает в свой профиль",
    shareLinkCopied: "✅ Ссылка скопирована",
    shareInviteFile: "📄 Скачать приглашение",
    shareCloudLink: "🔗 Создать ссылку",
    shareCloudLinkHint: "Создаёт настоящую ссылку — получатель просто нажимает",
    shareNoHosting: "Для ссылок нужен URL приложения",
    shareLinkReady: "✅ Ссылка готова! Отправьте её в WhatsApp/Telegram",
    shareLinkCreating: "⏳ Создаю ссылку...",
    shareLinkFail: "❌ Не удалось. Используйте файл-приглашение",
    shareOpenNetlify: "Открыть Netlify Drop",
    shareInviteFileHint:
      "HTML-файл. Отправьте его в WhatsApp/Telegram — получатель открывает файл в браузере",
    shareFileWarning:
      "⚠️ Ссылка работает только на вашем устройстве (файл локальный).",
    shareOpenInApp: "Открыть в BudgetPRO",
    shareAppUrlLabel: "URL приложения",
    shareAppUrlHint: "Например: https://yourname.netlify.app/",
    shareLinkGenerate: "Создать ссылку",
    shareLocked: "🔒 Профиль заблокирован",
    shareLockToggle: "Заблокировать профиль",
    shareUnlock: "Разблокировать",
    shareLockDesc: "Пользователь не сможет войти пока профиль заблокирован",
    shareProfileOpen: "🔓 Профиль открыт",
    shareWelcome: "Вас приглашают в профиль",
    shareWelcomeJoin: "Войти в профиль",
    shareWelcomeLocked: "Этот профиль заблокирован владельцем",
    shareWelcomePwd: "Введите пароль для входа",
    connectProfile: "Подключиться к чужому профилю",
    connectCode: "Введите код доступа",
    connectPassword: "Пароль (если требуется)",
    connectImportData: "Импортировать пакет данных",
    connectBtn: "Подключиться",
    guestMode: "👤 Гостевой режим",
    guestOf: "Гость профиля:",
    noAccess: "🚫 Нет доступа",
    noAccessDesc: "Владелец профиля не разрешил доступ к этому разделу",
    shareCopyCode: "📋 Скопировать код",
    shareCopied: "✅ Код скопирован",
    shareGenerate: "🔄 Обновить доступ",
    deleteLinkBtn: "🗑 Удалить ссылку",
    langSwitchHint: "Язык / Language / ენა",
    syncTitle: "Синхронизация данных",
    syncHint: "Обменивайтесь файлами через WhatsApp, Telegram или email",
    profilesTitle: "👥 Профили",
    profilesDesc: "Отдельные бюджеты для каждого члена семьи",
    addProfile: "+ Добавить профиль",
    profileActive: "Активный",
    profileSwitch: "Переключить",
    profileRename: "Переименовать",
    profileDelete: "Удалить профиль",
    profileDeleteConfirm: "Удалить этот профиль? Все данные будут потеряны.",
    profileNameLabel: "Имя профиля",
    profileEmojiLabel: "Аватар",
    profileNew: "Новый профиль",
    profilesMax: "Максимум 10 профилей",
    profileNamePlaceholder: "Например: Мама, Папа, Иван...",
    recurringFreqLabel: "Частота",
    budgetCategory: "Категория",
    editNote: "Изм. заметку",
    explanationCurrency: "Валюта отображения",
    explanationLanguage: "Язык интерфейса",
    explanationRates: "Курсы валют",
    explanationTheme: "Цветовая тема",
    historyEmpty: "История пуста",
    light: "Светлая",
    recurringDay: "День месяца",
    recurringFreq: "Частота",
    guideSkip: "Пропустить",
    guideNext: "Далее →",
    guideFinish: "Готово",
    close: "Закрыть",
    simpleModeOn: "Простой режим вкл",
    simpleModeOff: "Простой режим выкл",
    versionFooter: "БюджетPRO v2.3 · Офлайн 📴",
    biometryTitle: "🫆 Биометрия",
    biometryDesc: "Face ID / Touch ID / отпечаток пальца",
    biometryToggleLabel: "Вход по биометрии",
    biometrySupported: "✅ Биометрия доступна на этом устройстве",
    biometryNotSupported: "❌ Биометрия недоступна на этом устройстве",
    subcatIconLabel: "Подкатегория",
    recentOpsLabel: "📋 История операций",
    recentOpsHint: "Нажмите чтобы изменить или удалить",
    addCatModalTitle: "Добавить категорию",
    catTypeLabel: "Тип категории",
    catTypeExpenseTitle: "💸 Расходы",
    catTypeIncomeTitle: "💰 Доходы",
    catNamePlaceholder: "Например: «Аптека»",
    noStatsYet: "Добавьте первые записи\nчтобы увидеть статистику",
    salaryModalHint: "💡 Начальная сумма — деньги с которых начинается учёт.",
    loading: "⏳ Загрузка...",
    ariaDeleteOp: "Удалить",
    incomeAdded: "✓ Доход добавлен!",
    expenseAdded: "✓ Расход добавлен!",
    newNotebookTitle: "📝 Новая заметка",
    notebookPlaceholder: "Пишите здесь...",
    currencyChanged: "✓ Валюта изменена",
    themeChanged: "✓ Тема изменена",
    resetConfirmMsg:
      "Все записи и настройки будут удалены. Это нельзя отменить.",
    yesDeleteAll: "✓ Да, удалить всё",
    resetConfirmTitle: "Сбросить всё?",
    defaultNotePage: "📝 Заметка",
    calcError: "Ошибка",
    confirmOkBtn: "✓ Да, удалить",
    weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    pickDate: "Выберите дату",
    helpTitle: "📘 Как пользоваться",
    helpContent: `<div style="font-family:inherit;line-height:1.8;color:var(--text);">
<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:var(--primary);">$ БюджетPRO — Полная инструкция</h2>
<div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);"><b>💡 Идея:</b> Записывайте доходы и расходы, следите за бюджетом, делитесь профилем с семьёй — всё офлайн, без регистрации.</div>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🏠 Главная</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>4 карточки сверху — <b>баланс, доходы, расходы, начальная сумма</b>. Нажмите на любую для быстрого просмотра.</li>
<li>Нажмите на <b>«Начальная сумма»</b> чтобы задать стартовый баланс.</li>
<li>Список операций — нажмите для редактирования, <b>смахните влево</b> для удаления.</li>
<li>Кнопка <b>➕</b> — добавить операцию.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">➕ Добавление операции</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>Выберите <b>Расход</b> или <b>Доход</b>, категорию, сумму и дату.</li>
<li>Нажмите ⭐ чтобы сохранить как шаблон — для быстрого повтора.</li>
<li>Шаблоны показываются снизу — одно нажатие для заполнения.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">📊 Статистика</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>Круговые диаграммы расходов и доходов по категориям.</li>
<li>Линейный график за период, тепловая карта дней.</li>
<li>Прогноз на конец месяца, сравнение с прошлым периодом.</li>
<li>Кнопки периода: неделя / месяц / квартал / год / всё время.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">⚙️ Настройки</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li><b>Бюджеты</b> — задайте лимит расходов по категории за месяц.</li>
<li><b>Повторяющиеся</b> — аренда, кредит, подписки — добавятся автоматически.</li>
<li><b>Шаблоны</b> — редактируйте и удаляйте сохранённые операции.</li>
<li><b>PIN + Биометрия</b> — защита приложения.</li>
<li><b>6 тем</b> — белая, зелёная, закат, ночная, синяя, золотая.</li>
<li><b>Профили</b> — отдельные бюджеты для каждого члена семьи.</li>
<li><b>🔗 Поделиться профилем</b> — отправьте ссылку, получатель подключится.</li>
<li><b>Экспорт</b> — JSON, CSV, PDF.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🔗 Как поделиться профилем</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>Настройки → Профили → нажмите 🔗 рядом с профилем</li>
<li>Нажмите <b>«Создать ссылку»</b> — скопируйте и отправьте</li>
<li>Получатель открывает ссылку → нажимает «Войти в профиль»</li>
<li>Можно настроить разрешения (только просмотр / добавление) и пароль</li>
</ul>
<div style="background:var(--gold-pale);border-radius:14px;padding:14px;margin-top:16px;border-left:4px solid var(--gold);"><b>🚀 Возможности:</b> Офлайн · Статистика · Несколько профилей · Ссылки · PIN · Биометрия · 3 языка · 6 тем · Напоминания</div>
</div>`,
    guideNext: "Далее",
    guideSkip: "Пропустить",
    guideFinish: "Готово",
    guideSteps: [
      {
        element: ".top-cards",
        title: "Карточки сводки",
        desc: "Баланс, доходы, расходы и начальная сумма.",
      },
      {
        element: ".fab",
        title: "Добавить операцию",
        desc: "Зелёная кнопка — добавить доход или расход.",
      },
      {
        element: ".bottom-nav",
        title: "Навигация",
        desc: "Переключение между разделами приложения.",
      },
    ],
    compareTitle: "📊 Сравнение с прошлым месяцем",
    compareIncome: "Доходы",
    compareExpense: "Расходы",
    forecastTitle: "🔮 Прогноз на следующий месяц",
    forecastIncome: "📈 Ожидаемые доходы",
    forecastExpense: "📉 Ожидаемые расходы",
    forecastBalance: "💎 Прогнозируемый остаток",
    forecastNote: "На основе средних трат за 30 дней",
    lineChartTitle: "📈 Динамика баланса",
    lineChartExplanation: "Баланс на конец каждого месяца.",
    pieChartTop5: "(топ-5)",
    periodThisMonth: "Этот месяц",
    periodLastMonth: "Прошлый месяц",
    periodAllTime: "Всё время",
    periodFilter: "Период:",
    groupToday: "Сегодня",
    groupYesterday: "Вчера",
    filterToday: "Сегодня",
    filterYesterday: "Вчера",
    filterTwoDaysAgo: "2 дня назад",
    filterThisWeek: "За неделю",
    filterThisMonth: "За месяц",
    filterAllTime: "Всё время",
    filterLabel: "Период:",
    budgets: "💰 Бюджеты по категориям",
    addBudget: "+ Добавить бюджет",
    budgetLimit: "Лимит в месяц",
    budgetNoBudgets: "Бюджеты не заданы.",
    budgetOverLimit: "⚠️ Лимит превышен!",
    budgetDeleteConfirm: "Удалить бюджет?",
    recurring: "🔄 Повторяющиеся операции",
    addRecurring: "+ Добавить",
    recurringMonthly: "Ежемесячно",
    recurringWeekly: "Еженедельно",
    recurringDaily: "Ежедневно",
    recurringNone: "Повторяющихся нет.",
    recurringApplied: "✓ Добавлено автоматически:",
    recurringDeleteConfirm: "Удалить?",
    pinCode: "🔒 Пин-код",
    pinEnable: "Включить пин-код",
    pinSet: "Установить пин-код",
    pinChange: "Изменить пин-код",
    pinDisable: "Отключить",
    pinEnter: "Введите пин-код",
    pinConfirm: "Подтвердите пин-код",
    pinWrong: "Неверный пин-код",
    pinMismatch: "Пин-коды не совпадают",
    pinSet4: "Введите 4 цифры",
    pinSaved: "✓ Пин-код установлен",
    pinDisabled: "✓ Пин отключён",
    trendTitle: "📊 Тренд по категориям",
    trendVsLastMonth: "vs прошлый месяц",
    heatmapTitle: "🗓 Активность по дням недели",
    heatmapSubtitle: "Средние расходы",
    exportPDF: "📄 Экспорт PDF",
    pdfTitle: "Финансовый отчёт",
    cloudBackup: "☁️ Резервное копирование",
    cloudSave: "☁️ Сохранить в облако",
    cloudLoad: "☁️ Загрузить из ссылки",
    cloudCopied: "✓ Ссылка скопирована",
    cloudLoadHint: "Вставьте резервную ссылку",
    reminders: "🔔 Напоминания",
    remindersDesc: "Не забывайте записывать траты",
    remindersEnable: "Включить напоминания",
    remindersInterval: "Интервал",
    remindersDaily: "Каждый день",
    remindersEvery3Days: "Раз в 3 дня",
    remindersWeekly: "Раз в неделю",
    remindersCustom: "Своё время",
    remindersCustomLabel: "Часов",
    remindersMinutes: "мин",
    remindersHours: "ч",
    remindersPermissionDenied: "Разрешите уведомления",
    remindersPermissionGranted: "Напоминания включены",
    remindersDisabled: "Напоминания отключены",
    exportCSV: "📎 Экспорт в CSV",
    exportSuccess: "Данные экспортированы",
    exportJSON: "📤 Экспорт JSON",
    importJSON: "📥 Импорт JSON",
    resetThemeBtn: "🔄 Сбросить к дефолту",
    themeDay: "☀️ Дневные темы",
    themeNight: "🌙 Ночные темы",
    themeCardTitle: "🎨 Цветовая гамма",
    themeCardDesc: "Выберите стиль оформления",
    pinProtect: "Защитите приложение от чужих глаз",
    recurringDayLabel: "День месяца",
    recurringDescLabel: "Описание",
    statsRemaining: "Остаток",
    statsSaved2: "сберегается",
    statsSpentOf2: "трат",
    statsTips: "🧠 Советы",
    statsSummaryTable: "📋 Итого",
    statsStartAmt: "💼 Начальная сумма",
    statsTotalIncLabel: "📈 Всего доходов",
    statsTotalExpLabel: "📉 Всего расходов",
    statsBalanceLabel: "💎 Текущий остаток",
    statsTotalOpsLabel: "📁 Всего операций",
    statsSavingsLabel: "💾 Доля сбережений",
    statsBudgetMinus: "Бюджет в минусе",
    statsBudgetMinusDesc: "Расходы превышают поступления на",
    statsBudgetGreat: "Отличный результат!",
    statsBudgetGreatDesc: "Вы сберегаете",
    statsBudgetOk: "Бюджет в норме",
    statsBudgetOkDesc: "Сбережения:",
    statsBudgetAlmost: "Почти в ноль",
    statsBudgetAlmostDesc: "Сберегается только",
    statsRec: "зап.",
    statsInc2: "дох.",
    statsExp2: "расх.",
    statsSavingsGauge: "💾 Сбережения",
    statsRatio: "⚖️ Соотношение",
    statsMonthlyDyn: "📅 Динамика по месяцам",
    statsExpCats: "📉 На что уходят деньги",
    statsIncCats: "📈 Источники дохода",
    statsBudgetStatus: "Статус бюджета",
    statsKeyMetrics: "Ключевые показатели",
    statsTipHighCat: "категория занимает % всех расходов.",
    statsTipSaveLow: "Рекомендуется сберегать минимум 10% доходов.",
    statsTipNoIncome: "Добавьте источники дохода для полной картины.",
    statsTipGoodSaving: "Отличный показатель! Подумайте об инвестировании.",
    statsMoreCats: "ещё",
    simpleMode: "🔤 Упрощённый режим",
    normalMode: "✨ Обычный режим",
    simpleModeDesc: "Крупный текст, минимум кнопок — легко для всех",
    simpleModeOn: "Упрощённый режим включён",
    simpleModeOff: "Обычный режим включён",
    accessibilityTitle: "♿ Доступность",
    accessibilityDesc: "Настройки для комфортного использования",
    fontSizeLabel: "Размер текста",
    fontSmall: "Маленький",
    fontNormal: "Обычный",
    fontLarge: "Крупный",
    fontXL: "Очень крупный",
    animationsLabel: "Анимации и эффекты",
    hapticLabel: "Вибрация при действиях",
    supportTitle: "Поддержка",
    supportDesc: "Напишите нам — мы отвечаем в течение 24 часов",
    supportName: "Ваше имя",
    supportEmail: "Email (необязательно)",
    supportCategory: "Тема обращения",
    supportCatBug: "🐛 Нашёл ошибку",
    supportCatIdea: "💡 Предложение",
    supportCatHelp: "❓ Нужна помощь",
    supportCatOther: "💬 Другое",
    supportMessage: "Сообщение",
    supportSend: "📤 Отправить",
    supportSent: "✅ Сообщение отправлено! Спасибо.",
    supportRequired: "Заполните обязательные поля",
    supportPlaceholder: "Опишите вашу проблему или идею подробно...",
    budgetWarning80: "⚠️ 80% лимита исчерпано",
    offlineMode: "📴 Офлайн",
    onlineMode: "✅ Снова онлайн",
    budgetWarning80Desc: "Осталось",
    budgetWarning80Of: "от лимита",
    themeLabels: {
      white: "☀️ Золотой час",
      default: "🌅 Рассвет",
      sunset: "💫 Призма",
      ocean: "🌊 Морская пена",
      dark: "🌌 Северное сияние",
      navy: "🌌 Полночный синий",
      gold: "✨ Золотое напыление",
    },
    themeDescs: {
      white: "Тёплые лучи заходящего солнца",
      default: "Восход — тёплые оранжевые тона",
      sunset: "Радужные переливы на белом",
      ocean: "Бирюзовые волны и морской бриз",
      dark: "Полярное сияние в ночном небе",
      navy: "Звёздное небо над океаном",
      gold: "Тёмный с золотыми акцентами",
    },
  },
  en: {
    appName: "🌿 BudgetPRO",
    slogan: "Your capital — Your rules",
    balance: "Balance",
    income: "Income",
    expense: "Expenses",
    salary: "Starting sum",
    home: "Home",
    stats: "Stats",
    tools: "Tools",
    notebook: "Notebook",
    categories: "Categories",
    settings: "Settings",
    add: "Add",
    quickSuggestions: "📌 Quick suggestions",
    yourTemplates: "⭐ Your templates",
    saveAsTemplate: "⭐ Template",
    manageTemplates: "🗂 Manage templates",
    deleteTemplate: "Delete template",
    noTemplates: "No templates yet",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    type: "What to add?",
    expenseType: "💸 Expense",
    incomeType: "💰 Income",
    initialCapital: "Starting capital",
    initialCategory: "Starting amount",
    toastIncomeFilter: "📈 Your income",
    toastExpenseFilter: "📉 Your expenses",
    category: "Category",
    subcategory: "Subcategory",
    amount: "Amount",
    hours: "Hours",
    minutes: "Minutes",
    chooseDate: "📅 Pick date",
    chooseTimeBtn: "🕒 Pick time",
    date: "Date",
    today: "Today",
    yesterday: "Yesterday",
    startOfMonth: "Start of month",
    note: "Note",
    selectCategory: "— select category —",
    noSubcategory: "— no subcategory —",
    allHistory: "📜 Full history",
    historyHint: "Tap to see all records",
    editBalance: "Edit starting amount",
    editSalaryHint: "👆 Tap to change",
    totalIncome: "📈 Total income",
    totalExpense: "📉 Total expenses",
    currentBalance: "💎 Current balance",
    salary_label: "💼 Starting amount",
    noOperations: "No records yet.\nTap «+» below ↓",
    newOperation: "New transaction",
    editOperation: "Edit record",
    confirmDelete: "Delete this record?",
    confirmDeleteAll: "Delete ALL records?",
    enterAmount: "Enter amount",
    enterPositive: "Amount must be > 0",
    selectCategoryFirst: "Please select a category",
    calculator: "🧮 Calculator",
    converter: "💱 Currency converter",
    calcHint: "Tap numbers and signs",
    convHint: "Enter amount and select currencies",
    fromCurrency: "From",
    toCurrency: "To",
    sumLabel: "Amount",
    history: "History",
    clearHistory: "Clear history",
    convert: "Convert",
    newPage: "New page",
    pageTitle: "Page title",
    content: "Note text",
    noPages: "No pages.",
    notebookHint: "Notes, reminders, plans.",
    addCategory: "Add category",
    deleteCategory: "Delete category",
    addSubcategory: "Add subcategory",
    incomeCats: "💰 Income categories",
    expCatsTitle: "📉 Expense categories",
    catHint: "Tap category name to edit.",
    editCatTitle: "Edit category",
    editSubcatTitle: "Edit subcategory",
    newSubcatTitle: "New subcategory",
    catNameLabel: "Enter name:",
    newName: "New name:",
    inCategoryLabel: "In category:",
    theme: "🎨 Theme",
    language: "🌐 Language",
    data: "💾 Data",
    updateRates: "🔄 Update rates",
    resetAll: "🗑️ Reset all",
    currency: "🌍 Display currency",
    currRUB: "₽ Ruble",
    currUSD: "$ Dollar",
    currEUR: "€ Euro",
    currGEL: "₾ Lari",
    currGBP: "£ Pound",
    currKZT: "₸ Tenge",
    rub: "₽",
    usd: "$",
    eur: "€",
    gel: "₾",
    gbp: "£",
    kzt: "₸",
    ok: "OK",
    error: "Error",
    allOps: "All operations",
    clearAllOps: "Delete history",
    saved: "✓ Saved",
    deleted: "🗑 Deleted",
    ratesUpdated: "✓ Rates updated",
    resetDone: "✓ All reset",
    welcomeTitle: "Welcome! 👋",
    welcomeText: "Tap «+» to start.",
    welcomeClose: "Got it!",
    searchPlaceholder: "Search by category, note, amount...",
    searchFound: "Found",
    searchOf: "of",
    searchRecords: "records",
    expCategory: "Expense category",
    incCategory: "Income category",
    noteHint: "Can be empty",
    cardHintSalary: "👆 Tap to change",
    cardHintBalance: "Current amount",
    cardHintIncome: "Total received",
    cardHintExpense: "Total spent",
    budgetDesc: "Monthly spending limits by category",
    shareTitle: "🔗 Grant Access",
    shareDesc:
      "Another user will be able to access this profile from another device",
    shareCreate: "Create access",
    shareRevoke: "Revoke access",
    shareActive: "✅ Access active",
    shareCode: "Access code",
    shareCodeHint: "Send this code to the user via WhatsApp, Telegram or email",
    sharePassword: "Entry password (optional)",
    sharePasswordHint: "Without a password anyone with the code can enter",
    shareChangePassword: "Change password",
    shareRemovePassword: "Remove password",
    shareSetPassword: "Set password",
    sharePermissions: "⚙️ Guest permissions",
    permAdd: "➕ Add operations",
    permDelete: "🗑 Delete operations",
    permEdit: "✏️ Edit operations",
    permStats: "📊 View statistics",
    permNotes: "📓 Write notes",
    permBudgets: "💰 Manage budgets",
    permCats: "🗂 Manage categories",
    permExport: "📤 Export data",
    permLabels: {
      add: "Adding",
      del: "Deleting",
      edit: "Editing",
      stats: "Statistics",
      notes: "Notes",
      budgets: "Budgets",
      cats: "Categories",
      export: "Export",
      viewOwner: "View my data",
    },
    permViewOwner: "👁 Allow viewing my profile",
    permViewOwnerDesc: "Guest will see your transactions and statistics",
    shareDownload: "⬇️ Download data package",
    shareSyncSend: "📤 Send my changes",
    exitGuestMode: "🚪 Exit guest mode",
    exitGuestDone: "You returned to your own profile",
    whosProfile: "Your profile:",
    guestProfile: "Guest profile:",
    shareSyncReceive: "📥 Receive updates",
    shareLink: "🔗 Share via link",
    shareLinkHint:
      "Recipient opens the link and lands directly in their profile",
    shareLinkCopied: "✅ Link copied",
    shareInviteFile: "📄 Download invitation",
    shareCloudLink: "🔗 Create link",
    shareCloudLinkHint: "Creates a real link — recipient just taps it",
    shareNoHosting: "App URL required for links",
    shareLinkReady: "✅ Link ready! Send via WhatsApp/Telegram",
    shareLinkCreating: "⏳ Creating link...",
    shareLinkFail: "❌ Failed. Use invitation file instead",
    shareOpenNetlify: "Open Netlify Drop",
    shareInviteFileHint:
      "HTML file. Send via WhatsApp/Telegram — recipient opens it in browser",
    shareFileWarning: "⚠️ The link only works on your device (local file).",
    shareOpenInApp: "Open in BudgetPRO",
    shareAppUrlLabel: "App URL (if hosted online)",
    shareAppUrlHint: "E.g.: https://yourname.netlify.app/",
    shareLinkGenerate: "Create link",
    shareLocked: "🔒 Profile locked",
    shareLockToggle: "Lock profile",
    shareUnlock: "Unlock",
    shareLockDesc: "User cannot enter while the profile is locked",
    shareProfileOpen: "🔓 Profile open",
    shareWelcome: "You are invited to a profile",
    shareWelcomeJoin: "Enter profile",
    shareWelcomeLocked: "This profile is locked by the owner",
    shareWelcomePwd: "Enter password to enter",
    connectProfile: "🔗 Connect to shared profile",
    connectCode: "Enter access code",
    connectPassword: "Password (if required)",
    connectImportData: "Import data package",
    connectBtn: "Connect",
    guestMode: "👤 Guest mode",
    guestOf: "Guest of profile:",
    noAccess: "🚫 No access",
    noAccessDesc: "The profile owner has not allowed access to this section",
    shareCopyCode: "📋 Copy code",
    shareCopied: "✅ Code copied",
    shareGenerate: "🔄 Update access",
    deleteLinkBtn: "🗑 Delete link",
    langSwitchHint: "Language / Язык / ენა",
    syncTitle: "Data synchronization",
    syncHint: "Exchange files via WhatsApp, Telegram or email",
    profilesTitle: "👥 Profiles",
    profilesDesc: "Separate budgets for each family member",
    addProfile: "+ Add profile",
    profileActive: "Active",
    profileSwitch: "Switch",
    profileRename: "Rename",
    profileDelete: "Delete profile",
    profileDeleteConfirm: "Delete this profile? All data will be lost.",
    profileNameLabel: "Profile name",
    profileEmojiLabel: "Avatar",
    profileNew: "New profile",
    profilesMax: "Maximum 10 profiles",
    profileNamePlaceholder: "E.g. Mom, Dad, John...",
    searchFound: "Found",
    searchOf: "of",
    searchRecords: "records",
    recurringFreqLabel: "Frequency",
    budgetCategory: "Category",
    editNote: "Edit note",
    explanationCurrency: "Display currency",
    explanationLanguage: "Interface language",
    explanationRates: "Exchange rates",
    explanationTheme: "Color theme",
    historyEmpty: "History empty",
    light: "Light",
    recurringDay: "Day of month",
    recurringFreq: "Frequency",
    guideSkip: "Skip",
    guideNext: "Next →",
    guideFinish: "Done",
    close: "Close",
    simpleModeOn: "Simple mode on",
    simpleModeOff: "Simple mode off",
    versionFooter: "BudgetPRO v2.3 · Offline 📴",
    biometryTitle: "🫆 Biometry",
    biometryDesc: "Face ID / Touch ID / Fingerprint",
    biometryToggleLabel: "Login with biometry",
    biometrySupported: "✅ Biometry available on this device",
    biometryNotSupported: "❌ Biometry not available",
    subcatIconLabel: "Subcategory",
    recentOpsLabel: "📋 History",
    recentOpsHint: "Tap to edit or delete",
    addCatModalTitle: "Add category",
    catTypeLabel: "Category type",
    catTypeExpenseTitle: "💸 Expenses",
    catTypeIncomeTitle: "💰 Income",
    catNamePlaceholder: "E.g. «Pharmacy»",
    noStatsYet: "Add first records\nto see statistics",
    salaryModalHint: "💡 Starting amount — money you begin tracking with.",
    loading: "⏳ Loading...",
    ariaDeleteOp: "Delete",
    incomeAdded: "✓ Income added!",
    expenseAdded: "✓ Expense added!",
    newNotebookTitle: "📝 New note",
    notebookPlaceholder: "Write here...",
    currencyChanged: "✓ Currency changed",
    themeChanged: "✓ Theme changed",
    resetConfirmMsg: "All records and settings will be deleted.",
    yesDeleteAll: "✓ Yes, delete all",
    resetConfirmTitle: "Reset everything?",
    defaultNotePage: "📝 Note",
    calcError: "Error",
    confirmOkBtn: "✓ Yes, delete",
    weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    pickDate: "Pick a date",
    helpTitle: "📘 How to use",
    helpContent: `<div style="font-family:inherit;line-height:1.8;color:var(--text);">
<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:var(--primary);">🌿 BudgetPRO — Full Guide</h2>
<div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);"><b>💡 Idea:</b> Track income and expenses, manage your budget, share your profile with family — all offline, no sign-up required.</div>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🏠 Home</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>4 cards at top — <b>balance, income, expenses, starting amount</b>. Tap any for quick view.</li>
<li>Tap <b>"Starting amount"</b> to set your initial balance.</li>
<li>Operations list — tap to edit, <b>swipe left</b> to delete.</li>
<li><b>➕ button</b> — add a transaction.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">➕ Adding a transaction</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>Choose <b>Expense</b> or <b>Income</b>, category, amount and date.</li>
<li>Tap ⭐ to save as a template for quick reuse.</li>
<li>Templates appear below — one tap to fill in everything.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">📊 Statistics</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>Pie charts for expenses and income by category.</li>
<li>Line chart by period, daily heatmap.</li>
<li>Month-end forecast, comparison with previous period.</li>
<li>Period buttons: week / month / quarter / year / all time.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">⚙️ Settings</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li><b>Budgets</b> — set monthly spending limits per category.</li>
<li><b>Recurring</b> — rent, loan, subscriptions — added automatically.</li>
<li><b>Templates</b> — edit and delete saved transactions.</li>
<li><b>PIN + Biometrics</b> — app protection.</li>
<li><b>6 themes</b> — white, green, sunset, dark, navy, gold.</li>
<li><b>Profiles</b> — separate budgets for each family member.</li>
<li><b>🔗 Share profile</b> — send a link, recipient connects instantly.</li>
<li><b>Export</b> — JSON, CSV, PDF.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🔗 How to share a profile</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>Settings → Profiles → tap 🔗 next to your profile</li>
<li>Tap <b>"Create link"</b> — copy and send it</li>
<li>Recipient opens the link → taps "Join profile"</li>
<li>You can set permissions (view-only / add) and a password</li>
</ul>
<div style="background:var(--gold-pale);border-radius:14px;padding:14px;margin-top:16px;border-left:4px solid var(--gold);"><b>🚀 Features:</b> Offline · Statistics · Multi-profile · Share links · PIN · Biometrics · 3 languages · 6 themes · Reminders</div>
</div>`,
    guideNext: "Next",
    guideSkip: "Skip",
    guideFinish: "Finish",
    guideSteps: [
      {
        element: ".top-cards",
        title: "Summary cards",
        desc: "Balance, income, expenses and starting amount.",
      },
      {
        element: ".fab",
        title: "Add transaction",
        desc: "Green button to add income or expense.",
      },
      {
        element: ".bottom-nav",
        title: "Navigation",
        desc: "Switch between sections.",
      },
    ],
    compareTitle: "📊 vs Last month",
    compareIncome: "Income",
    compareExpense: "Expenses",
    forecastTitle: "🔮 Next month forecast",
    forecastIncome: "📈 Expected income",
    forecastExpense: "📉 Expected expenses",
    forecastBalance: "💎 Projected balance",
    forecastNote: "Based on last 30 days",
    lineChartTitle: "📈 Balance dynamics",
    lineChartExplanation: "Balance at end of each month.",
    pieChartTop5: "(top 5)",
    periodThisMonth: "This month",
    periodLastMonth: "Last month",
    periodAllTime: "All time",
    periodFilter: "Period:",
    groupToday: "Today",
    groupYesterday: "Yesterday",
    filterToday: "Today",
    filterYesterday: "Yesterday",
    filterTwoDaysAgo: "2 days ago",
    filterThisWeek: "This week",
    filterThisMonth: "This month",
    filterAllTime: "All time",
    filterLabel: "Period:",
    budgets: "💰 Category budgets",
    addBudget: "+ Add budget",
    budgetLimit: "Monthly limit",
    budgetNoBudgets: "No budgets set.",
    budgetOverLimit: "⚠️ Limit exceeded!",
    budgetDeleteConfirm: "Delete budget?",
    recurring: "🔄 Recurring operations",
    addRecurring: "+ Add",
    recurringMonthly: "Monthly",
    recurringWeekly: "Weekly",
    recurringDaily: "Daily",
    recurringNone: "No recurring operations.",
    recurringApplied: "✓ Auto-added:",
    recurringDeleteConfirm: "Delete?",
    pinCode: "🔒 PIN code",
    pinEnable: "Enable PIN",
    pinSet: "Set PIN",
    pinChange: "Change PIN",
    pinDisable: "Disable PIN",
    pinEnter: "Enter PIN",
    pinConfirm: "Confirm PIN",
    pinWrong: "Wrong PIN",
    pinMismatch: "PINs don't match",
    pinSet4: "Enter 4 digits",
    pinSaved: "✓ PIN set",
    pinDisabled: "✓ PIN disabled",
    trendTitle: "📊 Expense trend by category",
    trendVsLastMonth: "vs last month",
    heatmapTitle: "🗓 Activity by day of week",
    heatmapSubtitle: "Average expenses",
    exportPDF: "📄 Export PDF",
    pdfTitle: "Financial Report",
    cloudBackup: "☁️ Cloud backup",
    cloudSave: "☁️ Save to cloud",
    cloudLoad: "☁️ Load from link",
    cloudCopied: "✓ Link copied",
    cloudLoadHint: "Paste backup link",
    reminders: "🔔 Reminders",
    remindersDesc: "Don't forget to record expenses",
    remindersEnable: "Enable reminders",
    remindersInterval: "Interval",
    remindersDaily: "Daily",
    remindersEvery3Days: "Every 3 days",
    remindersWeekly: "Weekly",
    remindersCustom: "Custom",
    remindersCustomLabel: "Hours",
    remindersMinutes: "min",
    remindersHours: "h",
    remindersPermissionDenied: "Allow notifications",
    remindersPermissionGranted: "Reminders enabled",
    remindersDisabled: "Reminders disabled",
    exportCSV: "📎 Export CSV",
    exportSuccess: "Data exported",
    exportJSON: "📤 Export JSON",
    importJSON: "📥 Import JSON",
    resetThemeBtn: "🔄 Reset to default",
    themeDay: "☀️ Day themes",
    themeNight: "🌙 Night themes",
    themeCardTitle: "🎨 Color scheme",
    themeCardDesc: "Choose your style",
    pinProtect: "Protect app from others",
    recurringDayLabel: "Day of month",
    recurringDescLabel: "Description",
    statsRemaining: "Remaining",
    statsSaved2: "saved",
    statsSpentOf2: "spent",
    statsTips: "🧠 Tips",
    statsSummaryTable: "📋 Summary",
    statsStartAmt: "💼 Starting amount",
    statsTotalIncLabel: "📈 Total income",
    statsTotalExpLabel: "📉 Total expenses",
    statsBalanceLabel: "💎 Balance",
    statsTotalOpsLabel: "📁 Records",
    statsSavingsLabel: "💾 Savings rate",
    statsBudgetMinus: "Deficit",
    statsBudgetMinusDesc: "Expenses exceed income by",
    statsBudgetGreat: "Excellent!",
    statsBudgetGreatDesc: "You save",
    statsBudgetOk: "Healthy",
    statsBudgetOkDesc: "Savings:",
    statsBudgetAlmost: "Break-even",
    statsBudgetAlmostDesc: "Only",
    statsRec: "rec.",
    statsInc2: "inc.",
    statsExp2: "exp.",
    statsSavingsGauge: "💾 Savings",
    statsRatio: "⚖️ Ratio",
    statsMonthlyDyn: "📅 Monthly dynamics",
    statsExpCats: "📉 Where money goes",
    statsIncCats: "📈 Income sources",
    statsBudgetStatus: "Budget status",
    statsKeyMetrics: "Key metrics",
    statsTipHighCat: "category takes % of expenses.",
    statsTipSaveLow: "Experts recommend saving at least 10%.",
    statsTipNoIncome: "Add income sources for full picture.",
    statsTipGoodSaving: "Great! Consider investing.",
    statsMoreCats: "more",
    simpleMode: "🔤 Simple mode",
    normalMode: "✨ Normal mode",
    simpleModeDesc: "Large text, fewer buttons — easy for everyone",
    simpleModeOn: "Simple mode enabled",
    simpleModeOff: "Normal mode enabled",
    accessibilityTitle: "♿ Accessibility",
    accessibilityDesc: "Settings for comfortable use",
    fontSizeLabel: "Text size",
    fontSmall: "Small",
    fontNormal: "Normal",
    fontLarge: "Large",
    fontXL: "Extra large",
    animationsLabel: "Animations & effects",
    hapticLabel: "Vibration on actions",
    supportTitle: "💬 Support",
    supportDesc: "Write to us — we reply within 24 hours",
    supportName: "Your name",
    supportEmail: "Email (optional)",
    supportCategory: "Topic",
    supportCatBug: "🐛 Found a bug",
    supportCatIdea: "💡 Suggestion",
    supportCatHelp: "❓ Need help",
    supportCatOther: "💬 Other",
    supportMessage: "Message",
    supportSend: "📤 Send",
    supportSent: "✅ Message sent! Thank you.",
    supportRequired: "Please fill required fields",
    supportPlaceholder: "Describe your issue or idea in detail...",
    budgetWarning80: "⚠️ 80% of limit used",
    offlineMode: "📴 Offline",
    onlineMode: "✅ Back online",
    budgetWarning80Desc: "Remaining",
    budgetWarning80Of: "of limit",
    themeLabels: {
      white: "☀️ Golden Hour",
      default: "🌅 Sunrise",
      sunset: "💫 Prism",
      ocean: "🌊 Ocean Waves",
      dark: "🌌 Northern Lights",
      navy: "🌌 Midnight Blue",
      gold: "✨ Gold Dust",
    },
    themeDescs: {
      white: "Warm rays of sunset",
      default: "Sunrise warm orange tones",
      sunset: "Rainbow light on white",
      ocean: "Teal waves and sea breeze",
      dark: "Aurora borealis in night sky",
      navy: "Starry sky above the ocean",
      gold: "Dark with golden accents",
    },
  },
  ka: {
    appName: "🌿 ბიუჯეტPRO",
    slogan: "შენი კაპიტალი — შენი წესები",
    balance: "ბალანსი / ნაშთი",
    income: "შემოსავალი",
    expense: "ხარჯი",
    salary: "საწყისი თანხა",
    home: "მთავარი",
    stats: "სტატისტიკა",
    tools: "ინსტრუმენტები",
    notebook: "ბლოკნოტი",
    categories: "კატეგორიები",
    settings: "პარამეტრები",
    add: "დამატება",
    quickSuggestions: "📌 სწრაფი წინადადებები",
    yourTemplates: "⭐ შაბლონები",
    saveAsTemplate: "⭐ შაბლონი",
    manageTemplates: "🗂 შაბლონების მართვა",
    deleteTemplate: "შაბლონის წაშლა",
    noTemplates: "შაბლონები არ არის",
    edit: "შეცვლა",
    delete: "წაშლა",
    save: "შენახვა",
    cancel: "გაუქმება",
    type: "რა დავამატო?",
    expenseType: "💸 ხარჯი",
    incomeType: "💰 შემოსავალი",
    initialCapital: "საწყისი კაპიტალი",
    initialCategory: "საწყისი თანხა",
    toastIncomeFilter: "📈 შემოსავლები",
    toastExpenseFilter: "📉 ხარჯები",
    category: "კატეგორია",
    subcategory: "ქვეკატეგორია",
    amount: "თანხა",
    hours: "საათები",
    minutes: "წუთები",
    chooseDate: "📅 აირჩიეთ თარიღი",
    chooseTimeBtn: "🕒 აირჩიეთ დრო",
    date: "თარიღი",
    today: "დღეს",
    yesterday: "გუშინ",
    startOfMonth: "თვის დასაწყისი",
    note: "შენიშვნა",
    selectCategory: "— კატეგორია —",
    noSubcategory: "— ქვეკატეგორიის გარეშე —",
    allHistory: "📜 სრული ისტორია",
    historyHint: "დააჭირეთ ყველა ჩანაწერის სანახავად",
    editBalance: "საწყისი თანხის შეცვლა",
    editSalaryHint: "👆 შეცვლა",
    totalIncome: "📈 სულ შემოსავალი",
    totalExpense: "📉 სულ ხარჯი",
    currentBalance: "💎 მიმდინარე ნაშთი",
    salary_label: "💼 საწყისი თანხა",
    noOperations: "ჩანაწერები არ არის.\nდააჭირეთ «+»",
    newOperation: "ახალი ოპერაცია",
    editOperation: "ჩანაწერის შეცვლა",
    confirmDelete: "წაიშალოს?",
    confirmDeleteAll: "წაიშალოს ყველა?",
    enterAmount: "თანხა",
    enterPositive: "თანხა > 0",
    selectCategoryFirst: "აირჩიეთ კატეგორია",
    calculator: "🧮 კალკულატორი",
    converter: "💱 კონვერტერი",
    calcHint: "დააჭირეთ ციფრებს",
    convHint: "შეიყვანეთ თანხა",
    fromCurrency: "საიდან",
    toCurrency: "სად",
    sumLabel: "თანხა",
    history: "ისტორია",
    clearHistory: "გასუფთავება",
    convert: "გადაყვანა",
    newPage: "ახალი გვერდი",
    pageTitle: "სათაური",
    content: "ტექსტი",
    noPages: "გვერდები არ არის.",
    notebookHint: "შენიშვნები.",
    addCategory: "კატეგორიის დამატება",
    deleteCategory: "წაშლა",
    addSubcategory: "ქვეკატეგორია",
    incomeCats: "💰 შემოსავლები",
    expCatsTitle: "📉 ხარჯები",
    catHint: "დააჭირეთ კატეგორიის შესაცვლელად.",
    editCatTitle: "კატეგორია",
    editSubcatTitle: "ქვეკატეგორია",
    newSubcatTitle: "ახალი ქვეკატეგორია",
    catNameLabel: "სახელი:",
    newName: "ახალი სახელი:",
    inCategoryLabel: "კატეგორიაში:",
    theme: "🎨 თემა",
    language: "🌐 ენა",
    data: "💾 მონაცემები",
    updateRates: "🔄 კურსის განახლება",
    resetAll: "🗑️ ყველაფრის წაშლა",
    currency: "🌍 ვალუტა",
    currRUB: "₽ რუბლი",
    currUSD: "$ დოლარი",
    currEUR: "€ ევრო",
    currGEL: "₾ ლარი",
    currGBP: "£ ფუნტი",
    currKZT: "₸ ტენგე",
    rub: "₽",
    usd: "$",
    eur: "€",
    gel: "₾",
    gbp: "£",
    kzt: "₸",
    ok: "კარგი",
    error: "შეცდომა",
    allOps: "ყველა",
    clearAllOps: "ისტორიის წაშლა",
    saved: "✓ შენახულია",
    deleted: "🗑 წაშლილია",
    ratesUpdated: "✓ კურსი განახლდა",
    resetDone: "✓ წაიშალა",
    welcomeTitle: "კეთილი იყოს! 👋",
    welcomeText: "დააჭირეთ «+» დასაწყებად.",
    welcomeClose: "გასაგებია!",
    searchPlaceholder: "ძიება...",
    searchFound: "ნაპოვნია",
    searchOf: "სულ",
    searchRecords: "ჩანაწერი",
    expCategory: "ხარჯის კატეგორია",
    incCategory: "შემოსავლის კატეგორია",
    noteHint: "შეიძლება ცარიელი",
    cardHintSalary: "👆 შეცვლა",
    cardHintBalance: "მიმდინარე თანხა",
    cardHintIncome: "სულ მიღებული",
    cardHintExpense: "სულ დახარჯული",
    budgetDesc: "ყოველთვიური ხარჯების ლიმიტი კატეგორიების მიხედვით",
    shareTitle: "🔗 წვდომის მიცემა",
    shareDesc:
      "სხვა მომხმარებელს შეუძლია ამ პროფილზე წვდომა სხვა მოწყობილობიდან",
    shareCreate: "წვდომის შექმნა",
    shareRevoke: "წვდომის გაუქმება",
    shareActive: "✅ წვდომა აქტიურია",
    shareCode: "წვდომის კოდი",
    shareCodeHint: "გაუგზავნეთ ეს კოდი WhatsApp-ით, Telegram-ით ან email-ით",
    sharePassword: "შესვლის პაროლი (არასავალდებულო)",
    sharePasswordHint: "პაროლის გარეშე ნებისმიერი შევა",
    shareChangePassword: "პაროლის შეცვლა",
    shareRemovePassword: "პაროლის მოხსნა",
    shareSetPassword: "პაროლის დაყენება",
    sharePermissions: "⚙️ სტუმრის ნებართვები",
    permAdd: "➕ ოპერაციების დამატება",
    permDelete: "🗑 ოპერაციების წაშლა",
    permEdit: "✏️ ოპერაციების რედაქტირება",
    permStats: "📊 სტატისტიკის ნახვა",
    permNotes: "📓 შენიშვნების წერა",
    permBudgets: "💰 ბიუჯეტების მართვა",
    permCats: "🗂 კატეგორიების მართვა",
    permExport: "📤 მონაცემების ექსპორტი",
    permLabels: {
      add: "დამატება",
      del: "წაშლა",
      edit: "რედაქტირება",
      stats: "სტატისტიკა",
      notes: "შენიშვნები",
      budgets: "ბიუჯეტები",
      cats: "კატეგორიები",
      export: "ექსპორტი",
      viewOwner: "ჩემი მონაცემების ნახვა",
    },
    permViewOwner: "👁 ჩემი პროფილის ნახვის ნება",
    permViewOwnerDesc: "სტუმარი შეძლებს თქვენი ოპერაციების ნახვას",
    shareDownload: "⬇️ მონაცემების პაკეტის გადმოწერა",
    shareSyncSend: "📤 ჩემი ცვლილებების გაგზავნა",
    exitGuestMode: "🚪 სტუმრის რეჟიმიდან გასვლა",
    exitGuestDone: "თქვენ დაბრუნდით საკუთარ პროფილში",
    whosProfile: "თქვენი პროფილი:",
    guestProfile: "სტუმრის პროფილი:",
    shareSyncReceive: "📥 განახლებების მიღება",
    shareLink: "🔗 ბმულით გაზიარება",
    shareLinkHint: "მიმღები ხსნის ბმულს და პირდაპირ ხვდება პროფილში",
    shareLinkCopied: "✅ ბმული დაკოპირდა",
    shareInviteFile: "📄 მოწვევის გადმოწერა",
    shareCloudLink: "🔗 ბმულის შექმნა",
    shareCloudLinkHint: "ქმნის ნამდვილ ბმულს — მიმღები უბრალოდ აჭერს",
    shareNoHosting: "ბმულებისთვის საჭიროა აპლიკაციის URL",
    shareLinkReady: "✅ ბმული მზადაა! გაუგზავნეთ WhatsApp/Telegram-ში",
    shareLinkCreating: "⏳ ბმული იქმნება...",
    shareLinkFail: "❌ ვერ მოხერხდა. გამოიყენეთ მოწვევის ფაილი",
    shareOpenNetlify: "Netlify Drop-ის გახსნა",
    shareInviteFileHint:
      "HTML ფაილი. გაუგზავნეთ WhatsApp/Telegram-ით — მიმღები ხსნის ბრაუზერში",
    shareFileWarning:
      "⚠️ ბმული მუშაობს მხოლოდ თქვენს მოწყობილობაზე (ლოკალური ფაილი).",
    shareOpenInApp: "BudgetPRO-ში გახსნა",
    shareAppUrlLabel: "აპლიკაციის URL",
    shareAppUrlHint: "მაგ: https://yourname.netlify.app/",
    shareLinkGenerate: "ბმულის შექმნა",
    shareLocked: "🔒 პროფილი დაბლოკილია",
    shareLockToggle: "პროფილის დაბლოკვა",
    shareUnlock: "განბლოკვა",
    shareLockDesc: "მომხმარებელს არ შეუძლია შესვლა სანამ პროფილი დაბლოკილია",
    shareProfileOpen: "🔓 პროფილი ღიაა",
    shareWelcome: "გიწვევენ პროფილში",
    shareWelcomeJoin: "პროფილში შესვლა",
    shareWelcomeLocked: "ეს პროფილი დაბლოკილია მფლობელის მიერ",
    shareWelcomePwd: "შეიყვანეთ პაროლი შესასვლელად",
    connectProfile: "🔗 სხვის პროფილთან დაკავშირება",
    connectCode: "შეიყვანეთ წვდომის კოდი",
    connectPassword: "პაროლი (საჭიროების შემთხვევაში)",
    connectImportData: "მონაცემების პაკეტის იმპორტი",
    connectBtn: "დაკავშირება",
    guestMode: "👤 სტუმრის რეჟიმი",
    guestOf: "პროფილის სტუმარი:",
    noAccess: "🚫 წვდომა არ არის",
    noAccessDesc: "პროფილის მფლობელმა ამ განყოფილებაზე წვდომა არ გასცა",
    shareCopyCode: "📋 კოდის კოპირება",
    shareCopied: "✅ კოდი დაკოპირდა",
    shareGenerate: "🔄 წვდომის განახლება",
    deleteLinkBtn: "🗑 ბმულის წაშლა",
    langSwitchHint: "ენა / Language / Язык",
    syncTitle: "მონაცემების სინქრონიზაცია",
    syncHint: "გაცვალეთ ფაილები WhatsApp-ის, Telegram-ის ან email-ის მეშვეობით",
    profilesTitle: "👥 პროფილები",
    profilesDesc: "ოჯახის თითოეული წევრის ცალკე ბიუჯეტი",
    addProfile: "+ პროფილის დამატება",
    profileActive: "აქტიური",
    profileSwitch: "გადართვა",
    profileRename: "გადარქმევა",
    profileDelete: "პროფილის წაშლა",
    profileDeleteConfirm: "პროფილი წაიშალოს? ყველა მონაცემი წაიშლება.",
    profileNameLabel: "პროფილის სახელი",
    profileEmojiLabel: "ავატარი",
    profileNew: "ახალი პროფილი",
    profilesMax: "მაქსიმუმ 10 პროფილი",
    profileNamePlaceholder: "მაგ: მამა, დედა, ვანო...",
    searchFound: "ნაპოვნია",
    searchOf: "სულ",
    searchRecords: "ჩანაწერი",
    recurringFreqLabel: "სიხშირე",
    budgetCategory: "კატეგორია",
    editNote: "შენიშვნა",
    explanationCurrency: "ვალუტა",
    explanationLanguage: "ინტერფეისის ენა",
    explanationRates: "კურსები",
    explanationTheme: "ფერის თემა",
    historyEmpty: "ისტორია ცარიელია",
    light: "ღია",
    recurringDay: "თვის დღე",
    recurringFreq: "სიხშირე",
    guideSkip: "გამოტოვება",
    guideNext: "შემდეგი →",
    guideFinish: "მზადაა",
    close: "დახურვა",
    simpleModeOn: "მარტივი რეჟიმი ჩართ",
    simpleModeOff: "მარტივი რეჟიმი გამ",
    versionFooter: "ბიუჯეტPRO v2.3 · ოფლაინ 📴",
    biometryTitle: "🫆 ბიომეტრია",
    biometryDesc: "Face ID / Touch ID / თითის ანაბეჭდი",
    biometryToggleLabel: "ბიომეტრიით შესვლა",
    biometrySupported: "✅ ბიომეტრია ხელმისაწვდომია ამ მოწყობილობაზე",
    biometryNotSupported: "❌ ბიომეტრია მიუწვდომელია",
    subcatIconLabel: "ქვეკატეგორია",
    recentOpsLabel: "📋 ისტორია",
    recentOpsHint: "დააჭირეთ შესაცვლელად",
    addCatModalTitle: "კატეგორიის დამატება",
    catTypeLabel: "ტიპი",
    catTypeExpenseTitle: "💸 ხარჯი",
    catTypeIncomeTitle: "💰 შემოსავალი",
    catNamePlaceholder: "მაგ: «აფთიაქი»",
    noStatsYet: "დაამატეთ ჩანაწერები\nსტატისტიკის სანახავად",
    salaryModalHint: "💡 საწყისი თანხა.",
    loading: "⏳ იტვირთება...",
    ariaDeleteOp: "წაშლა",
    incomeAdded: "✓ შემოსავალი!",
    expenseAdded: "✓ ხარჯი!",
    newNotebookTitle: "📝 ახალი",
    notebookPlaceholder: "დაწერეთ...",
    currencyChanged: "✓ ვალუტა",
    themeChanged: "✓ თემა",
    resetConfirmMsg: "ყველა ჩანაწერი წაიშლება.",
    yesDeleteAll: "✓ წაშლა",
    resetConfirmTitle: "წაშლა?",
    defaultNotePage: "📝 შენიშვნა",
    calcError: "შეცდომა",
    confirmOkBtn: "✓ წაშლა",
    weekdaysShort: ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვ"],
    months: [
      "იანვარი",
      "თებერვალი",
      "მარტი",
      "აპრილი",
      "მაისი",
      "ივნისი",
      "ივლისი",
      "აგვისტო",
      "სექტემბერი",
      "ოქტომბერი",
      "ნოემბერი",
      "დეკემბერი",
    ],
    pickDate: "თარიღი",
    helpTitle: "📘 გამოყენება",
    helpContent: `<div style="font-family:inherit;line-height:1.8;color:var(--text);">
<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:var(--primary);">🌿 ბიუჯეტPRO — სრული სახელმძღვანელო</h2>
<div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);"><b>💡 იდეა:</b> ჩაიწერეთ შემოსავლები და ხარჯები, მართეთ ბიუჯეტი, გაუზიარეთ პროფილი ოჯახს — ყველაფერი ოფლაინ, რეგისტრაციის გარეშე.</div>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🏠 მთავარი</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>4 ბარათი ზედა — <b>ბალანსი / ნაშთი</b>, შემოსავალი, ხარჯები, საწყისი თანხა</b>. სწრაფი ნახვისთვის დააჭირეთ.</li>
<li><b>«საწყისი თანხა»</b> — დასაყენებლად დააჭირეთ.</li>
<li>ოპერაციების სია — დასარედაქტირებლად დააჭირეთ, <b>გადაფურცვლა მარცხნივ</b> — წაშლისთვის.</li>
<li><b>➕ ღილაკი</b> — ოპერაციის დამატება.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">➕ ოპერაციის დამატება</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>აირჩიეთ <b>ხარჯი</b> ან <b>შემოსავალი</b>, კატეგორია, თანხა და თარიღი.</li>
<li>⭐ დააჭირეთ შაბლონად შესანახად — სწრაფი გამეორებისთვის.</li>
<li>შაბლონები ქვემოთ ჩანს — ერთი კლიკი ყველა ველის შესავსებად.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">📊 სტატისტიკა</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>სექტორული დიაგრამები კატეგორიების მიხედვით.</li>
<li>ხაზოვანი გრაფიკი, სიხშირის რუკა დღეების მიხედვით.</li>
<li>პროგნოზი თვის ბოლოსთვის, შედარება წინა პერიოდთან.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">⚙️ პარამეტრები</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li><b>ბიუჯეტები</b> — ყოველთვიური ლიმიტი კატეგორიის მიხედვით.</li>
<li><b>განმეორებადი</b> — ქირა, კრედიტი, გამოწერები — ავტომატურად ემატება.</li>
<li><b>შაბლონები</b> — შენახული ოპერაციების რედაქტირება და წაშლა.</li>
<li><b>PIN + ბიომეტრია</b> — აპლიკაციის დაცვა.</li>
<li><b>6 თემა</b> — თეთრი, მწვანე, მზის ჩასვლა, ღამის, ლურჯი, ოქროს.</li>
<li><b>პროფილები</b> — ოჯახის თითოეული წევრისთვის ცალკე ბიუჯეტი.</li>
<li><b>🔗 პროფილის გაზიარება</b> — გაუგზავნეთ ბმული, მიმღები სწრაფად დაუკავშირდება.</li>
<li><b>ექსპორტი</b> — JSON, CSV, PDF.</li>
</ul>
<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🔗 პროფილის გაზიარება</h3>
<ul style="margin:0 0 8px 16px;display:flex;flex-direction:column;gap:6px;">
<li>პარამეტრები → პროფილები → დააჭირეთ 🔗 პროფილის გვერდით</li>
<li>დააჭირეთ <b>«ბმულის შექმნა»</b> — დააკოპირეთ და გაუგზავნეთ</li>
<li>მიმღები ხსნის ბმულს → «შეერთება» — დასრულდა</li>
<li>შეგიძლიათ დაარეგულიროთ ნებართვები და პაროლი</li>
</ul>
<div style="background:var(--gold-pale);border-radius:14px;padding:14px;margin-top:16px;border-left:4px solid var(--gold);"><b>🚀 შესაძლებლობები:</b> ოფლაინ · სტატისტიკა · მრავალი პროფილი · ბმულები · PIN · ბიომეტრია · 3 ენა · 6 თემა · შეხსენებები</div>
</div>`,
    guideNext: "შემდეგი",
    guideSkip: "გამოტოვება",
    guideFinish: "დასრულება",
    guideSteps: [
      {
        element: ".top-cards",
        title: "ბარათები",
        desc: "ბალანსი / ნაშთი, შემოსავალი, ხარჯი და საწყისი თანხა.",
      },
      { element: ".fab", title: "დამატება", desc: "ახალი ოპერაციის დამატება." },
      {
        element: ".bottom-nav",
        title: "ნავიგაცია",
        desc: "სექციებს შორის გადართვა.",
      },
    ],
    compareTitle: "📊 გასულ თვესთან",
    compareIncome: "შემოსავალი",
    compareExpense: "ხარჯი",
    forecastTitle: "🔮 შემდეგი თვის პროგნოზი",
    forecastIncome: "📈 მოსალოდნელი შემოსავალი",
    forecastExpense: "📉 მოსალოდნელი ხარჯი",
    forecastBalance: "💎 პროგნოზირებული ნაშთი",
    forecastNote: "ბოლო 30 დღის საფუძველზე",
    lineChartTitle: "📈 ბალანსის დინამიკა",
    lineChartExplanation: "ბალანსი თვის ბოლოს.",
    pieChartTop5: "(ტოპ 5)",
    periodThisMonth: "ეს თვე",
    periodLastMonth: "გასული თვე",
    periodAllTime: "ყველა",
    periodFilter: "პერიოდი:",
    groupToday: "დღეს",
    groupYesterday: "გუშინ",
    filterToday: "დღეს",
    filterYesterday: "გუშინ",
    filterTwoDaysAgo: "2 დღის წინ",
    filterThisWeek: "კვირა",
    filterThisMonth: "თვე",
    filterAllTime: "ყველა",
    filterLabel: "პერიოდი:",
    budgets: "💰 ბიუჯეტები",
    addBudget: "+ ბიუჯეტი",
    budgetLimit: "თვიური ლიმიტი",
    budgetNoBudgets: "ბიუჯეტები არ არის.",
    budgetOverLimit: "⚠️ ლიმიტი გადაჭარბებულია!",
    budgetDeleteConfirm: "ბიუჯეტი წაიშალოს?",
    recurring: "🔄 განმეორებადი",
    addRecurring: "+ დამატება",
    recurringMonthly: "ყოველთვიურად",
    recurringWeekly: "ყოველ კვირას",
    recurringDaily: "ყოველდღე",
    recurringNone: "განმეორებადი ოპერაციები არ არის.",
    recurringApplied: "✓ ავტომატურად დაემატა:",
    recurringDeleteConfirm: "წაიშალოს?",
    pinCode: "🔒 PIN კოდი",
    pinEnable: "PIN-ის ჩართვა",
    pinSet: "PIN-ის დაყენება",
    pinChange: "PIN-ის შეცვლა",
    pinDisable: "PIN-ის გამორთვა",
    pinEnter: "PIN კოდი",
    pinConfirm: "დაადასტურეთ PIN",
    pinWrong: "არასწორი PIN",
    pinMismatch: "PIN-ები არ ემთხვევა",
    pinSet4: "4 ციფრი",
    pinSaved: "✓ PIN დაყენებულია",
    pinDisabled: "✓ PIN გამორთულია",
    trendTitle: "📊 ხარჯების ტრენდი",
    trendVsLastMonth: "vs გასული თვე",
    heatmapTitle: "🗓 აქტივობა კვირის დღეების მიხედვით",
    heatmapSubtitle: "საშუალო ხარჯები",
    exportPDF: "📄 PDF",
    pdfTitle: "ფინანსური ანგარიში",
    cloudBackup: "☁️ სარეზერვო კოპია",
    cloudSave: "☁️ ღრუბელში შენახვა",
    cloudLoad: "☁️ ჩატვირთვა",
    cloudCopied: "✓ ბმული დაკოპირებულია",
    cloudLoadHint: "ჩასვით სარეზერვო ბმული",
    reminders: "🔔 შეხსენებები",
    remindersDesc: "ხარჯების ჩასაწერი შეხსენება",
    remindersEnable: "შეხსენებების ჩართვა",
    remindersInterval: "ინტერვალი",
    remindersDaily: "ყოველდღე",
    remindersEvery3Days: "3 დღეში",
    remindersWeekly: "კვირაში",
    remindersCustom: "სხვა",
    remindersCustomLabel: "საათი",
    remindersMinutes: "წთ",
    remindersHours: "სთ",
    remindersPermissionDenied: "ნება მიეცით შეტყობინებებს",
    remindersPermissionGranted: "შეხსენებები ჩართულია",
    remindersDisabled: "გამორთულია",
    exportCSV: "📎 CSV",
    exportSuccess: "მონაცემები ექსპორტირებულია",
    exportJSON: "📤 JSON ექსპორტი",
    importJSON: "📥 JSON იმპორტი",
    resetThemeBtn: "🔄 ნაგულისხმევი",
    themeDay: "☀️ დღის თემები",
    themeNight: "🌙 ღამის თემები",
    themeCardTitle: "🎨 ფერის სქემა",
    themeCardDesc: "აირჩიეთ სტილი",
    pinProtect: "აპლიკაციის დაცვა",
    recurringDayLabel: "თვის დღე",
    recurringDescLabel: "აღწერა",
    statsRemaining: "ნაშთი",
    statsSaved2: "ინახება",
    statsSpentOf2: "ხარჯი",
    statsTips: "🧠 რჩევები",
    statsSummaryTable: "📋 ჯამი",
    statsStartAmt: "💼 საწყისი",
    statsTotalIncLabel: "📈 შემოსავალი",
    statsTotalExpLabel: "📉 ხარჯი",
    statsBalanceLabel: "💎 ნაშთი",
    statsTotalOpsLabel: "📁 ჩანაწერები",
    statsSavingsLabel: "💾 დანაზოგი",
    statsBudgetMinus: "მინუსი",
    statsBudgetMinusDesc: "ხარჯი > შემოსავალი",
    statsBudgetGreat: "შესანიშნავი!",
    statsBudgetGreatDesc: "ზოგავთ",
    statsBudgetOk: "ნორმაშია",
    statsBudgetOkDesc: "დანაზოგი:",
    statsBudgetAlmost: "ნულზე",
    statsBudgetAlmostDesc: "მხოლოდ",
    statsRec: "ჩ.",
    statsInc2: "შემ.",
    statsExp2: "ხარ.",
    statsSavingsGauge: "💾 დანაზოგი",
    statsRatio: "⚖️ თანაფარდობა",
    statsMonthlyDyn: "📅 დინამიკა",
    statsExpCats: "📉 ხარჯები",
    statsIncCats: "📈 შემოსავლები",
    statsBudgetStatus: "სტატუსი",
    statsKeyMetrics: "მაჩვენებლები",
    statsTipHighCat: "კატეგორია — % ხარჯი.",
    statsTipSaveLow: "10% დაზოგვა რეკომენდებულია.",
    statsTipNoIncome: "დაამატეთ შემოსავლები.",
    statsTipGoodSaving: "შესანიშნავი!",
    statsMoreCats: "კატ.",
    simpleMode: "🔤 გამარტივებული რეჟიმი",
    normalMode: "✨ ჩვეულებრივი რეჟიმი",
    simpleModeDesc: "დიდი ტექსტი, ნაკლები ღილაკები — მოსახერხებელია ყველასთვის",
    simpleModeOn: "გამარტივებული რეჟიმი ჩართულია",
    simpleModeOff: "ჩვეულებრივი რეჟიმი ჩართულია",
    accessibilityTitle: "♿ ხელმისაწვდომობა",
    accessibilityDesc: "კომფორტული გამოყენების პარამეტრები",
    fontSizeLabel: "ტექსტის ზომა",
    fontSmall: "პატარა",
    fontNormal: "ჩვეულებრივი",
    fontLarge: "დიდი",
    fontXL: "ძალიან დიდი",
    animationsLabel: "ანიმაციები და ეფექტები",
    hapticLabel: "ვიბრაცია მოქმედებებზე",
    supportTitle: "💬 მხარდაჭერა",
    supportDesc: "მოგვწერეთ — ვპასუხობთ 24 საათში",
    supportName: "თქვენი სახელი",
    supportEmail: "Email (არასავალდებულო)",
    supportCategory: "თემა",
    supportCatBug: "🐛 შეცდომა ვიპოვე",
    supportCatIdea: "💡 წინადადება",
    supportCatHelp: "❓ დახმარება მჭირდება",
    supportCatOther: "💬 სხვა",
    supportMessage: "შეტყობინება",
    supportSend: "📤 გაგზავნა",
    supportSent: "✅ შეტყობინება გაიგზავნა! გმადლობთ.",
    supportRequired: "შეავსეთ სავალდებულო ველები",
    supportPlaceholder: "დეტალურად აღწერეთ თქვენი პრობლემა ან იდეა...",
    budgetWarning80: "⚠️ ლიმიტის 80% ამოწურულია",
    offlineMode: "📴 ოფლაინი",
    onlineMode: "✅ ისევ ონლაინ",
    budgetWarning80Desc: "დარჩენილია",
    budgetWarning80Of: "ლიმიტიდან",
    themeLabels: {
      white: "☀️ ოქროს საათი",
      default: "🌅 გამთენია",
      sunset: "💫 პრიზმა",
      ocean: "🌊 ზღვის ტალღები",
      dark: "🌌 ჩრდილოეთის ნათება",
      navy: "🌌 შუაღამის ლურჯი",
      gold: "✨ ოქროს მტვერი",
    },
    themeDescs: {
      white: "მზის ჩასვლის თბილი სხივები",
      default: "მზის ამოსვლა — თბილი ფერები",
      sunset: "ცისარტყელა თეთრ ფონზე",
      ocean: "ბირიუზა ტალღები და ზღვის ბრიზი",
      dark: "პოლარული ნათება ღამის ცაში",
      navy: "ვარსკვლავიანი ცა ოკეანეზე",
      gold: "მუქი ოქროს აქცენტებით",
    },
  },
};

// ============================================================
// ТЕКУЩИЙ ЯЗЫК И ФУНКЦИИ ПЕРЕВОДА
// ============================================================
let currentLang = localStorage.getItem("lang") || "ru";

Object.assign(translations.ru, {
  alreadyExists: "⚠️ Уже существует",
  chooseCategoryAndAmountFirst: "Сначала выберите категорию и сумму",
  templateSavedToast: "⭐ Шаблон сохранён",
  newUserMessages: "У вас новые сообщения от пользователей",
  restoredFromBackup: "🔄 Данные восстановлены из резервной копии",
  restoredFromFirebase: "🚀 Данные восстановлены из Firebase",
  restoredFromCloud: "☁️ Данные восстановлены из облака (JSONBin)",
  noMainProfileFound: "Главный профиль не найден",
  websocketReconnect: "🔌 Переподключение WebSocket...",
  allDataDeleted: "🗑️ Все данные удалены",
  ownProfileToast: "🏠 Вы в своём профиле",
  profileNotFound: "Профиль не найден",
  creatorModeOff: "👋 Режим создателя выключен",
  noReplyContact: "Пользователь не указал контакт для ответа",
  replyTextPlaceholder: "Введите текст ответа...",
  enterReplyText: "Введите текст ответа",
  supportPhoneLabel: "📱 Телефон (WhatsApp, Viber)",
  supportDisabled: "Приём сообщений временно отключён",
  allCategoriesBudgeted: "Все категории уже имеют бюджет",
  jsonExported: "✅ JSON экспортирован",
  invalidFormat: "❌ Неверный формат",
  importedOk: "✅ Импортировано",
  importError: "❌ Ошибка",
  pdfSavedHtml: "✅ PDF-отчёт сохранён как HTML (откройте и напечатайте)",
  fileSaved: "✅ Файл сохранён",
  cloudLoaded: "✅ Данные загружены из облака",
  cloudLoadError: "❌ Ошибка загрузки",
  reconnectSocket: "🔌 Переподключить WebSocket",
  noReminders: "Нет напоминаний",
  reminderName: "Название",
  reminderNamePlaceholder: "Например: Оплата аренды",
  reminderDateTime: "Дата и время",
  scheduleReminder: "Запланировать",
  recurringShort: "Повторяющиеся",
  dangerZone: "⛔ Опасная зона",
  appFooterVersion: "БюджетPRO v8.0 · Офлайн 📴",
  backToTopics: "← Темы",
  guideReady: "Готово ✓",
  guideStepsShort: "шагов",
  goalSubtract: "Убрать сумму",
  goalDeleteConfirm: "Удалить цель?",
  goalAddedAmount: "Добавлено",
  goalSubtractedAmount: "Убрано",
  emailPlaceholder: "email@example.com",
  replySent: "✅ Ответ отправлен",
  newMessageFrom: "📬 Новое сообщение от",
  creatorToggleVisibility: "Показать/скрыть",
  guestModeActivated: "Гостевой режим",
  switchedToOwnProfile: "👤 Вы перешли в свой профиль",
  savedMark: "✅",
  fileDownloaded: "📄 Файл скачан",
  amountSubtracted: "−",
  goalTargetWord: "цель",
  goalFillNameTarget: "Заполните название и цель",
  goalAchieved: "🏆 Цель достигнута!",
  goalAddPromptPrefix: "Пополнить",
  goalSubtractPromptPrefix: "Убрать из",
  goalSubtractMax: "макс",
  enterKey: "Введите ключ",
  iconLabel: "Иконка",
  colorLabel: "Цвет",
  heroUpdatedJustNow: "↑ Обновлено только что",
  moreLabel: "Ещё",
  sharePlain: "Поделиться",
  confirmTitleText: "Вы уверены?",
});

Object.assign(translations.en, {
  alreadyExists: "⚠️ Already exists",
  chooseCategoryAndAmountFirst: "Choose a category and amount first",
  templateSavedToast: "⭐ Template saved",
  newUserMessages: "New messages from users",
  restoredFromBackup: "🔄 Data restored from backup",
  restoredFromFirebase: "🚀 Data restored from Firebase",
  restoredFromCloud: "☁️ Data restored from cloud (JSONBin)",
  noMainProfileFound: "Main profile not found",
  websocketReconnect: "🔌 Reconnecting WebSocket...",
  allDataDeleted: "🗑️ All data deleted",
  ownProfileToast: "🏠 You are in your profile",
  profileNotFound: "Profile not found",
  creatorModeOff: "👋 Creator mode turned off",
  noReplyContact: "The user did not provide a contact for reply",
  replyTextPlaceholder: "Enter your reply...",
  enterReplyText: "Enter reply text",
  supportPhoneLabel: "📱 Phone (WhatsApp, Viber)",
  supportDisabled: "Receiving messages is temporarily disabled",
  allCategoriesBudgeted: "All categories already have budgets",
  jsonExported: "✅ JSON exported",
  invalidFormat: "❌ Invalid format",
  importedOk: "✅ Imported",
  importError: "❌ Error",
  pdfSavedHtml: "✅ PDF report saved as HTML (open and print)",
  fileSaved: "✅ File saved",
  cloudLoaded: "✅ Data loaded from cloud",
  cloudLoadError: "❌ Loading error",
  reconnectSocket: "🔌 Reconnect WebSocket",
  noReminders: "No reminders",
  reminderName: "Name",
  reminderNamePlaceholder: "E.g. Pay rent",
  reminderDateTime: "Date and time",
  scheduleReminder: "Schedule",
  recurringShort: "Recurring",
  dangerZone: "⛔ Danger zone",
  appFooterVersion: "BudgetPRO v8.0 · Offline 📴",
  backToTopics: "← Topics",
  guideReady: "Done ✓",
  guideStepsShort: "steps",
  goalSubtract: "Subtract",
  goalDeleteConfirm: "Delete this goal?",
  goalAddedAmount: "Added",
  goalSubtractedAmount: "Removed",
  emailPlaceholder: "email@example.com",
  replySent: "✅ Reply sent",
  newMessageFrom: "📬 New message from",
  creatorToggleVisibility: "Show/hide",
  guestModeActivated: "Guest mode",
  switchedToOwnProfile: "👤 Switched to your profile",
  savedMark: "✅",
  fileDownloaded: "📄 File downloaded",
  amountSubtracted: "−",
  goalTargetWord: "target",
  goalFillNameTarget: "Fill in name and target",
  goalAchieved: "🏆 Goal achieved!",
  goalAddPromptPrefix: "Add to",
  goalSubtractPromptPrefix: "Remove from",
  goalSubtractMax: "max",
  enterKey: "Enter key",
  iconLabel: "Icon",
  colorLabel: "Color",
  heroUpdatedJustNow: "↑ Updated just now",
  moreLabel: "More",
  sharePlain: "Share",
  confirmTitleText: "Are you sure?",
});

Object.assign(translations.ka, {
  alreadyExists: "⚠️ უკვე არსებობს",
  chooseCategoryAndAmountFirst: "ჯერ აირჩიეთ კატეგორია და თანხა",
  templateSavedToast: "⭐ შაბლონი შენახულია",
  newUserMessages: "მომხმარებლებისგან ახალი შეტყობინებებია",
  restoredFromBackup: "🔄 მონაცემები აღდგა სარეზერვოდან",
  restoredFromFirebase: "🚀 მონაცემები აღდგა Firebase-დან",
  restoredFromCloud: "☁️ მონაცემები აღდგა ღრუბლიდან (JSONBin)",
  noMainProfileFound: "მთავარი პროფილი ვერ მოიძებნა",
  websocketReconnect: "🔌 WebSocket თავიდან ერთდება...",
  allDataDeleted: "🗑️ ყველა მონაცემი წაიშალა",
  ownProfileToast: "🏠 თქვენ საკუთარ პროფილში ხართ",
  profileNotFound: "პროფილი ვერ მოიძებნა",
  creatorModeOff: "👋 შემქმნელის რეჟიმი გამორთულია",
  noReplyContact: "მომხმარებელს საპასუხო კონტაქტი არ მიუთითებია",
  replyTextPlaceholder: "შეიყვანეთ პასუხის ტექსტი...",
  enterReplyText: "შეიყვანეთ პასუხის ტექსტი",
  supportPhoneLabel: "📱 ტელეფონი (WhatsApp, Viber)",
  supportDisabled: "შეტყობინებების მიღება დროებით გამორთულია",
  allCategoriesBudgeted: "ყველა კატეგორიას უკვე აქვს ბიუჯეტი",
  jsonExported: "✅ JSON ექსპორტირებულია",
  invalidFormat: "❌ არასწორი ფორმატი",
  importedOk: "✅ იმპორტირებულია",
  importError: "❌ შეცდომა",
  pdfSavedHtml: "✅ PDF ანგარიში HTML-ად შეინახა (გახსენით და დაბეჭდეთ)",
  fileSaved: "✅ ფაილი შენახულია",
  cloudLoaded: "✅ მონაცემები ღრუბლიდან ჩაიტვირთა",
  cloudLoadError: "❌ ჩატვირთვის შეცდომა",
  reconnectSocket: "🔌 WebSocket-ის ხელახლა დაკავშირება",
  noReminders: "შეხსენებები არ არის",
  reminderName: "სახელი",
  reminderNamePlaceholder: "მაგ: ქირის გადახდა",
  reminderDateTime: "თარიღი და დრო",
  scheduleReminder: "დაგეგმვა",
  recurringShort: "განმეორებადი",
  dangerZone: "⛔ საფრთხის ზონა",
  appFooterVersion: "ბიუჯეტPRO v8.0 · ოფლაინი 📴",
  backToTopics: "← თემები",
  guideReady: "მზადაა ✓",
  guideStepsShort: "ნაბიჯი",
  goalSubtract: "თანხის გამოკლება",
  goalDeleteConfirm: "წავშალოთ ეს მიზანი?",
  goalAddedAmount: "დამატებულია",
  goalSubtractedAmount: "გამოკლებულია",
  emailPlaceholder: "email@example.com",
  replySent: "✅ პასუხი გაიგზავნა",
  newMessageFrom: "📬 ახალი შეტყობინება:",
  creatorToggleVisibility: "ჩვენება/დამალვა",
  guestModeActivated: "სტუმრის რეჟიმი",
  switchedToOwnProfile: "👤 საკუთარ პროფილზე გადახვედით",
  savedMark: "✅",
  fileDownloaded: "📄 ფაილი ჩამოტვირთულია",
  amountSubtracted: "−",
  goalTargetWord: "მიზანი",
  goalFillNameTarget: "შეავსეთ სახელი და მიზანი",
  goalAchieved: "🏆 მიზანი მიღწეულია!",
  goalAddPromptPrefix: "დაამატეთ",
  goalSubtractPromptPrefix: "გამოაკელით",
  goalSubtractMax: "მაქს",
  enterKey: "შეიყვანეთ გასაღები",
  iconLabel: "იკონა",
  colorLabel: "ფერი",
  heroUpdatedJustNow: "↑ ახლახან განახლდა",
  moreLabel: "მეტი",
  sharePlain: "გაზიარება",
  confirmTitleText: "დარწმუნებული ხართ?",
});

// ============================================================
// IndexedDB helpers – аварийное восстановление данных
// ============================================================
const DB_NAME = "BudgetPRO_Backup";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("profiles")) {
        db.createObjectStore("profiles", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


/** Сохраняет все данные всех профилей и глобальных настроек в IndexedDB */
async function saveAllToIndexedDB() {
  try {
    const db = await openDB();
    const tx = db.transaction("profiles", "readwrite");
    const store = tx.objectStore("profiles");
    // сохраняем текущий профиль
    const profileData = localStorage.getItem(getProfileStorageKey());
    if (profileData) {
      await store.put({
        id: activeProfileId,
        data: profileData,
        timestamp: Date.now(),
      });
    }
    // сохраняем остальные профили
    for (const p of profiles) {
      if (p.id === activeProfileId) continue;
      const data = localStorage.getItem(getProfileStorageKey(p.id));
      if (data) {
        await store.put({ id: p.id, data: data, timestamp: Date.now() });
      }
    }
    // сохраняем глобальные настройки
    const globalData = localStorage.getItem(getGlobalStorageKey());
    if (globalData) {
      await store.put({
        id: "_global_",
        data: globalData,
        timestamp: Date.now(),
      });
    }
    await tx.complete;
    console.log("✅ IndexedDB backup saved");
  } catch (e) {
    console.warn("IndexedDB save error:", e);
  }
}

/** Восстанавливает данные из IndexedDB в localStorage */
async function loadAllFromIndexedDB() {
  try {
    const db = await openDB();
    const tx = db.transaction("profiles", "readonly");
    const store = tx.objectStore("profiles");

    // Используем getAll, если доступен, иначе собираем через курсор
    let all;
    if (typeof store.getAll === "function") {
      const result = await store.getAll();
      all = Array.isArray(result) ? result : [];
    } else {
      // Запасной вариант для старых браузеров
      all = await new Promise((resolve, reject) => {
        const items = [];
        const request = store.openCursor();
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            items.push(cursor.value);
            cursor.continue();
          } else {
            resolve(items);
          }
        };
        request.onerror = () => reject(request.error);
      });
    }

    if (all.length === 0) return false;

    for (const item of all) {
      if (item.id === "_global_") {
        localStorage.setItem(getGlobalStorageKey(), item.data);
      } else {
        localStorage.setItem(getProfileStorageKey(item.id), item.data);
      }
    }
    console.log("🔄 Data restored from IndexedDB");
    return true;
  } catch (e) {
    console.warn("IndexedDB load error:", e);
    return false;
  }
}

/** Полностью удаляет резервную копию из IndexedDB */
async function clearIndexedDB() {
  try {
    const db = await openDB();
    const tx = db.transaction("profiles", "readwrite");
    const store = tx.objectStore("profiles");
    await store.clear();
    await tx.complete;
  } catch (e) {}
}

function t(k) {
  const v = translations[currentLang]?.[k];
  return v !== undefined ? v : k;
}
function tObj(k) {
  const v = translations[currentLang]?.[k];
  return v && typeof v === "object" ? v : {};
}

function updateHeroTrendText() {
  const heroTrend = document.getElementById("heroTrend");
  if (!heroTrend) return;
  heroTrend.textContent =
    {
      ru: "↑ Обновлено только что",
      en: "↑ Updated just now",
      ka: "↑ ახლახან განახლდა",
    }[currentLang] || "↑ Updated just now";
}

function updateHeroChipLabels(root = document) {
  const labels = {
    ru: {
      income: "Доход",
      expense: "Расход",
      salary: "Старт",
    },
    en: {
      income: "Income",
      expense: "Spent",
      salary: "Start",
    },
    ka: {
      income: "შემოს.",
      expense: "ხარჯ.",
      salary: "საწყისი",
    },
  }[currentLang] || {
    income: "Income",
    expense: "Spent",
    salary: "Start",
  };

  const incomeLabel = root.querySelector("#incomeHeroLabel");
  const expenseLabel = root.querySelector("#expenseHeroLabel");
  const salaryLabel = root.querySelector("#salaryHeroLabel");
  if (incomeLabel) incomeLabel.textContent = labels.income;
  if (expenseLabel) expenseLabel.textContent = labels.expense;
  if (salaryLabel) salaryLabel.textContent = labels.salary;
}

function forceHeroChipLayout(root = document) {
  root.querySelectorAll(".hero-chips").forEach((wrap) => {
    wrap.style.setProperty("display", "grid", "important");
    wrap.style.setProperty(
      "grid-template-columns",
      "repeat(3, minmax(0, 1fr))",
      "important",
    );
    wrap.style.setProperty("gap", "6px", "important");
    wrap.style.setProperty("align-items", "stretch", "important");

    wrap.querySelectorAll(".hero-chip").forEach((card) => {
      card.style.setProperty("grid-column", "auto / span 1", "important");
      card.style.setProperty("grid-row", "auto", "important");
      card.style.setProperty("width", "auto", "important");
      card.style.setProperty("max-width", "none", "important");
      card.style.setProperty("min-width", "0", "important");
      card.style.setProperty("min-height", "78px", "important");
      card.style.setProperty("display", "flex", "important");
      card.style.setProperty("flex-direction", "column", "important");
      card.style.setProperty("align-items", "center", "important");
      card.style.setProperty("justify-content", "center", "important");
      card.style.setProperty("padding", "8px 5px", "important");
      card.style.setProperty("text-align", "center", "important");
    });

    wrap.querySelectorAll(".hc-label").forEach((label) => {
      label.style.setProperty("white-space", "normal", "important");
      label.style.setProperty("overflow", "visible", "important");
      label.style.setProperty("text-overflow", "clip", "important");
      label.style.setProperty("line-height", "1.1", "important");
      label.style.setProperty("min-height", "18px", "important");
      label.style.setProperty("display", "flex", "important");
      label.style.setProperty("align-items", "center", "important");
      label.style.setProperty("justify-content", "center", "important");
      label.style.setProperty("text-align", "center", "important");
    });

    wrap.querySelectorAll(".hc-value").forEach((value) => {
      value.style.setProperty("text-align", "center", "important");
      value.style.setProperty("line-height", "1.1", "important");
      value.style.setProperty("min-height", "14px", "important");
    });
  });
}

function perm(p) {
  if (!sharedAccessProfile) return true;
  return sharedAccessProfile.perms[p] !== false;
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  applyTranslations();
  updateHeroTrendText();
  updateHeroChipLabels();
  forceHeroChipLayout();
  updateHeader();
  updateTopBlocks();
  ensureHomeHeroStable();
  const lse = document.getElementById("langSelect");
  if (lse) lse.value = currentLang;
  setTab(currentTab);
  updateHeaderButtons();
  if (typeof updateOfflineBar === "function") setTimeout(updateOfflineBar, 100);
}

const localeMap = { ru: "ru-RU", en: "en-US", ka: "ka-GE" };

function sym() {
  return (
    {
      RUB: t("rub"),
      USD: t("usd"),
      EUR: t("eur"),
      GEL: t("gel"),
      GBP: t("gbp"),
      KZT: t("kzt"),
    }[displayCurrency] || displayCurrency
  );
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (translations[currentLang][k])
      el.textContent = translations[currentLang][k];
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const k = el.getAttribute("data-i18n-aria-label");
    if (translations[currentLang][k])
      el.setAttribute("aria-label", translations[currentLang][k]);
  });
  updateHeroTrendText();
  // Update offline bar text in current language
  if (typeof updateOfflineBar === "function") updateOfflineBar();
  const logo = document.querySelector(".app-logo");
  if (logo) logo.textContent = t("appName");
  // Update slogan
  const slogan = document.getElementById("appSlogan");
  if (slogan) slogan.textContent = t("slogan");
  const fab = document.querySelector(".fab-text");
  if (fab) fab.textContent = t("add");
  const hintKeys = {
    cardHintBalance: ".balance-card .card-hint",
    cardHintIncome: ".income-card .card-hint",
    cardHintExpense: ".expense-card .card-hint",
    cardHintSalary: ".salary-card .card-hint",
  };
  Object.entries(hintKeys).forEach(([k, sel]) => {
    const el = document.querySelector(sel);
    if (el && t(k)) el.textContent = t(k);
  });
}

let transactions = [];

let startBalanceRub = 70000;
let displayCurrency = "GEL";
let currencyWebSocket = null;
let currencyWsReconnectTimer = null;
let exchangeRates = {
  RUB: 1,
  USD: 0.012,
  EUR: 0.011,
  GEL: 0.031,
  GBP: 0.0095,
  KZT: 5.2,
};
let notebookPages = [];
let currentTab = "home";
let editingOpIndex = null;
let editingNoteId = null;
let addType = "expense";
let addModalCommitted = false;
let addModalLastClosedAt = 0;
let addModalWatcher = null;
let heroWrapObserver = null;
let heroWrapAnchor = null;
let addModalRecoveryTimers = [];
let appTracePanel = null;
let appTraceLines = [];
let appTraceMainObserver = null;
let appTraceHeroObserver = null;
let appInitDone = false;
let appBooting = false;
let appBootTraceTimers = [];
const APP_TRACE_ENABLED =
  localStorage.getItem("budgetpro_trace") === "1" ||
  localStorage.getItem("heroDebug") === "1";
let backgroundServicesStarted = false;
let calcHistory = [];
let convHistory = [];
let currentFilter = null;
let remindersEnabled = false;
let remindersInterval = "daily";
let reminderIntervals = JSON.parse(
  localStorage.getItem("reminderIntervals") || '{"daily":true}',
);
let customReminderDate = localStorage.getItem("customReminderDate") || "";
let customReminderTime = localStorage.getItem("customReminderTime") || "";
let customReminderText = localStorage.getItem("customReminderText") || "";
let customReminderTimestamp =
  localStorage.getItem("customReminderTimestamp") || null;
let customReminderTimeout = null;
let reminderTimer = null;
let categoryCustomizations = {};
let statsPeriod = "thisMonth";
let historyFilter = "allTime"; // фильтр истории по времени

// Новые структуры данных
let categoryBudgets = {}; // { "Продукты": 5000 } в рублях
let recurringOps = []; // повторяющиеся операции
let pinHash = null; // хеш пин-кода
let pinEnabled = false;
let supportMessages = [];

// Профили и состояние
let _creatorTaps = 0;
let _creatorTapTimer = null;
let suggestionsEnabled = localStorage.getItem("suggestionsEnabled") !== "false";
let reminderMode = localStorage.getItem("reminderMode") || "interval";
let customReminderDatetime =
  localStorage.getItem("customReminderDatetime") || "";

let profiles = [];
let activeProfileId = "default";
let sharedAccessProfile = null;
// Тема и доступность
let colorTheme = localStorage.getItem("colorTheme") || "default";
let biometryEnabled = false;
let biometryCredId = null;
let simpleMode = localStorage.getItem("simpleMode") === "true";
let fontSize = localStorage.getItem("fontSize") || "normal";
let animationsEnabled = localStorage.getItem("animationsEnabled") !== "false";
let hapticEnabled = localStorage.getItem("hapticEnabled") !== "false";
let guideSteps = [];
let curGuideStep = 0;

// ============================================================
// ИКОНКИ И ЦВЕТА
// ============================================================
const categoryIcons = {
  Коммуналка: { icon: "💡", color: "#f59e0b" },
  Продукты: { icon: "🛒", color: "#10b981" },
  "Заём банка": { icon: "🏦", color: "#ef4444" },
  "Ежемесячные взносы": { icon: "📅", color: "#8b5cf6" },
  Транспорт: { icon: "🚌", color: "#3b82f6" },
  "Неожиданные траты": { icon: "⚡", color: "#f97316" },
  Зарплата: { icon: "💼", color: "#22c55e" },
  Подарок: { icon: "🎁", color: "#ec4899" },
  Фриланс: { icon: "💻", color: "#06b6d4" },
  defaultExpense: { icon: "💸", color: "#ef4444" },
  defaultIncome: { icon: "💰", color: "#22c55e" },
};

// ============================================================
// ЦВЕТОВЫЕ ТЕМЫ
// ============================================================
const COLOR_THEMES = {
  sunrise: {
    label: "🌅 Рассвет",
    dark: false,
    accent: "#f97316",
    vars: {
      "--primary": "#f97316",
      "--primary-med": "#fb923c",
      "--primary-light": "#fdba74",
      "--primary-pale": "rgba(249,115,22,0.10)",
      "--gold": "#d97706",
      "--gold-pale": "rgba(217,119,6,0.10)",
      "--gold-border": "rgba(217,119,6,0.25)",
      "--income-color": "#16a34a",
      "--income-pale": "rgba(22,163,74,0.10)",
      "--expense-color": "#dc2626",
      "--expense-pale": "rgba(220,38,38,0.08)",
      "--balance-pale": "rgba(249,115,22,0.12)",
      "--text": "#1c1917",
      "--text-soft": "#44403c",
      "--text-muted": "#a8a29e",
      "--card-bg": "rgba(255,255,255,0.92)",
      "--cream": "#fff8f2",
      "--cream-dark": "rgba(249,115,22,0.06)",
      "--cream-border": "rgba(249,115,22,0.14)",
      "--shadow-sm": "0 2px 12px rgba(0,0,0,0.06)",
      "--shadow-md": "0 6px 24px rgba(0,0,0,0.10)",
      "--shadow-lg": "0 16px 48px rgba(0,0,0,0.14)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
  white: {
    label: "☀️ Золотой час",
    dark: false,
    accent: "#f59e0b",
    vars: {
      "--primary": "#f97316",
      "--primary-med": "#fb923c",
      "--primary-light": "#fdba74",
      "--primary-pale": "rgba(249,115,22,0.10)",
      "--gold": "#d97706",
      "--gold-pale": "rgba(217,119,6,0.10)",
      "--gold-border": "rgba(217,119,6,0.25)",
      "--income-color": "#16a34a",
      "--income-pale": "rgba(22,163,74,0.10)",
      "--expense-color": "#dc2626",
      "--expense-pale": "rgba(220,38,38,0.08)",
      "--balance-pale": "rgba(249,115,22,0.12)",
      "--text": "#1c1917",
      "--text-soft": "#334155",
      "--text-muted": "#a8a29e",
      "--card-bg": "rgba(255,255,255,1.0)",
      "--cream": "#ffffff",
      "--cream-dark": "rgba(249,115,22,0.06)",
      "--cream-border": "rgba(249,115,22,0.14)",
      "--shadow-sm": "0 1px 8px rgba(0,0,0,0.06)",
      "--shadow-md": "0 4px 24px rgba(0,0,0,0.10)",
      "--shadow-lg": "0 12px 48px rgba(0,0,0,0.14)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
  default: {
    label: "🌅 Рассвет (авто)",
    dark: false,
    accent: "#f97316",
    vars: {
      "--primary": "#f97316",
      "--primary-med": "#fb923c",
      "--primary-light": "#fdba74",
      "--primary-pale": "rgba(249,115,22,0.10)",
      "--gold": "#d97706",
      "--gold-pale": "rgba(217,119,6,0.10)",
      "--gold-border": "rgba(217,119,6,0.25)",
      "--income-color": "#16a34a",
      "--income-pale": "rgba(22,163,74,0.10)",
      "--expense-color": "#dc2626",
      "--expense-pale": "rgba(220,38,38,0.08)",
      "--balance-pale": "rgba(249,115,22,0.12)",
      "--text": "#1c1917",
      "--text-soft": "#44403c",
      "--text-muted": "#a8a29e",
      "--card-bg": "rgba(255,255,255,0.92)",
      "--cream": "#fff8f2",
      "--cream-dark": "rgba(249,115,22,0.06)",
      "--cream-border": "rgba(249,115,22,0.14)",
      "--shadow-sm": "0 2px 12px rgba(0,0,0,0.06)",
      "--shadow-md": "0 6px 24px rgba(0,0,0,0.10)",
      "--shadow-lg": "0 16px 48px rgba(0,0,0,0.14)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
  sunset: {
    label: "💫 Призма",
    dark: false,
    accent: "#8b5cf6",
    vars: {
      "--primary": "#8b5cf6",
      "--primary-med": "#a78bfa",
      "--primary-light": "#c4b5fd",
      "--primary-pale": "rgba(139,92,246,0.10)",
      "--gold": "#d97706",
      "--gold-pale": "rgba(217,119,6,0.10)",
      "--gold-border": "rgba(217,119,6,0.25)",
      "--income-color": "#16a34a",
      "--income-pale": "rgba(22,163,74,0.10)",
      "--expense-color": "#dc2626",
      "--expense-pale": "rgba(220,38,38,0.08)",
      "--balance-pale": "rgba(139,92,246,0.12)",
      "--text": "#1c1917",
      "--text-soft": "#44403c",
      "--text-muted": "#6b7280",
      "--card-bg": "rgba(255,255,255,0.92)",
      "--cream": "#fafaff",
      "--cream-dark": "rgba(139,92,246,0.06)",
      "--cream-border": "rgba(139,92,246,0.16)",
      "--shadow-sm": "0 2px 12px rgba(139,92,246,0.08)",
      "--shadow-md": "0 6px 24px rgba(139,92,246,0.12)",
      "--shadow-lg": "0 16px 48px rgba(139,92,246,0.16)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
  ocean: {
    label: "🌊 Морская пена",
    dark: false,
    accent: "#0891b2",
    vars: {
      "--primary": "#0891b2",
      "--primary-med": "#06b6d4",
      "--primary-light": "#67e8f9",
      "--primary-pale": "rgba(8,145,178,0.10)",
      "--gold": "#d97706",
      "--gold-pale": "rgba(217,119,6,0.10)",
      "--gold-border": "rgba(217,119,6,0.25)",
      "--income-color": "#16a34a",
      "--income-pale": "rgba(22,163,74,0.10)",
      "--expense-color": "#dc2626",
      "--expense-pale": "rgba(220,38,38,0.08)",
      "--balance-pale": "rgba(8,145,178,0.12)",
      "--text": "#0c1a2e",
      "--text-soft": "#1e3a5f",
      "--text-muted": "#5b8db8",
      "--card-bg": "rgba(255,255,255,0.88)",
      "--cream": "#f0fdff",
      "--cream-dark": "rgba(8,145,178,0.06)",
      "--cream-border": "rgba(8,145,178,0.16)",
      "--shadow-sm": "0 2px 12px rgba(8,145,178,0.10)",
      "--shadow-md": "0 6px 24px rgba(8,145,178,0.14)",
      "--shadow-lg": "0 16px 48px rgba(8,145,178,0.18)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
  dark: {
    label: "🌙 Тёмная ночь",
    dark: true,
    accent: "#a78bfa",
    vars: {
      "--primary": "#a78bfa",
      "--primary-med": "#c4b5fd",
      "--primary-light": "#ddd6fe",
      "--primary-pale": "rgba(167,139,250,0.18)",
      "--gold": "#fbbf24",
      "--gold-pale": "rgba(251,191,36,0.13)",
      "--gold-border": "rgba(251,191,36,0.25)",
      "--income-color": "#2dd4bf",
      "--income-pale": "rgba(45,212,191,0.14)",
      "--expense-color": "#f87171",
      "--expense-pale": "rgba(248,113,113,0.13)",
      "--balance-pale": "rgba(167,139,250,0.18)",
      "--text": "#f0eaff",
      "--text-soft": "#d4c8f8",
      "--text-muted": "rgba(196,181,253,0.60)",
      "--card-bg": "rgba(255,255,255,0.10)",
      "--cream": "#0d0820",
      "--cream-dark": "rgba(255,255,255,0.08)",
      "--cream-border": "rgba(255,255,255,0.14)",
      "--shadow-sm": "0 2px 12px rgba(0,0,0,0.45)",
      "--shadow-md": "0 6px 24px rgba(0,0,0,0.55)",
      "--shadow-lg": "0 16px 48px rgba(0,0,0,0.65)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
  navy: {
    label: "🌌 Полночный синий",
    dark: true,
    accent: "#60a5fa",
    vars: {
      "--primary": "#60a5fa",
      "--primary-med": "#93c5fd",
      "--primary-light": "#bfdbfe",
      "--primary-pale": "rgba(96,165,250,0.18)",
      "--gold": "#fbbf24",
      "--gold-pale": "rgba(251,191,36,0.13)",
      "--gold-border": "rgba(251,191,36,0.25)",
      "--income-color": "#34d399",
      "--income-pale": "rgba(52,211,153,0.14)",
      "--expense-color": "#f87171",
      "--expense-pale": "rgba(248,113,113,0.13)",
      "--balance-pale": "rgba(96,165,250,0.18)",
      "--text": "#e2ecff",
      "--text-soft": "#90b8e0",
      "--text-muted": "rgba(147,197,253,0.60)",
      "--card-bg": "rgba(8,14,30,0.98)",
      "--cream": "#060c24",
      "--cream-dark": "rgba(255,255,255,0.07)",
      "--cream-border": "rgba(255,255,255,0.12)",
      "--shadow-sm": "0 2px 18px rgba(0,0,0,0.65)",
      "--shadow-md": "0 6px 38px rgba(0,0,0,0.78)",
      "--shadow-lg": "0 16px 64px rgba(0,0,0,0.88)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
  gold: {
    label: "✨ Золотое напыление",
    dark: true,
    accent: "#fbbf24",
    vars: {
      "--primary": "#fbbf24",
      "--primary-med": "#fcd34d",
      "--primary-light": "#fde68a",
      "--primary-pale": "rgba(251,191,36,0.18)",
      "--gold": "#fbbf24",
      "--gold-pale": "rgba(251,191,36,0.14)",
      "--gold-border": "rgba(251,191,36,0.30)",
      "--income-color": "#4ade80",
      "--income-pale": "rgba(74,222,128,0.14)",
      "--expense-color": "#f87171",
      "--expense-pale": "rgba(248,113,113,0.13)",
      "--balance-pale": "rgba(251,191,36,0.18)",
      "--text": "#f0ece4",
      "--text-soft": "#c8c4b8",
      "--text-muted": "rgba(253,230,138,0.55)",
      "--card-bg": "rgba(30,30,38,0.98)",
      "--cream": "#1c1005",
      "--cream-dark": "rgba(255,255,255,0.07)",
      "--cream-border": "rgba(255,255,255,0.12)",
      "--shadow-sm": "0 2px 16px rgba(0,0,0,0.50)",
      "--shadow-md": "0 6px 32px rgba(0,0,0,0.62)",
      "--shadow-lg": "0 14px 56px rgba(0,0,0,0.72)",
      "--radius-sm": "14px",
      "--radius-md": "20px",
      "--radius-lg": "26px",
      "--radius-xl": "34px",
    },
  },
};

function applyColorTheme(themeKey) {
  colorTheme = themeKey || "default";
  localStorage.setItem("colorTheme", colorTheme);
  const theme = COLOR_THEMES[colorTheme];
  if (!theme) return;
  [
    "theme-white",
    "theme-default",
    "theme-sunset",
    "theme-ocean",
    "theme-dark",
    "theme-navy",
    "theme-gold",
    "theme-sunrise",
    "dark",
  ].forEach((cls) => document.body.classList.remove(cls));
  if (theme.dark) document.body.classList.add("dark");
  document.body.classList.add("theme-" + colorTheme);
  // Force re-render of hero gradient and nav for day themes
  if (!theme.dark) {
    const hc = document.querySelector(".balance-card");
    if (hc) {
      hc.style.transition = "background 0.4s ease";
    }
  }
  Object.entries(theme.vars || {}).forEach(([k, v]) =>
    document.body.style.setProperty(k, v),
  );
  document.getElementById("themeStars")?.remove();
  document.getElementById("themeShimmer")?.remove();
  document.getElementById("themeAurora")?.remove();
  const inj = (id, css) => {
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = css;
      document.head.appendChild(s);
    }
  };
  if (colorTheme === "navy") {
    const el = document.createElement("canvas");
    el.id = "themeStars";
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.7;";
    document.body.insertBefore(el, document.body.firstChild);
    const ctx = el.getContext("2d");
    function ds() {
      el.width = window.innerWidth;
      el.height = window.innerHeight;
      ctx.clearRect(0, 0, el.width, el.height);
      const n = Math.floor((el.width * el.height) / 6000);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * el.width,
          y = Math.random() * el.height,
          r = Math.random() * 1.5 + 0.3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${180 + ~~(Math.random() * 75)},${200 + ~~(Math.random() * 55)},255,${Math.random() * 0.8 + 0.2})`;
        ctx.fill();
      }
    }
    ds();
    window.addEventListener("resize", ds, { once: true });
  }
  if (colorTheme === "gold") {
    inj(
      "goldKf",
      "@keyframes goldFloat{0%{transform:translateY(0) rotate(0deg);opacity:0}20%{opacity:1}100%{transform:translateY(-120px) rotate(360deg);opacity:0}}",
    );
    const el = document.createElement("div");
    el.id = "themeShimmer";
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;";
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      const sz = Math.random() * 4 + 2;
      p.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(200,149,42,.7);left:${Math.random() * 100}%;bottom:${Math.random() * 30 - 10}%;animation:goldFloat ${4 + Math.random() * 8}s ${Math.random() * 6}s ease-in infinite;`;
      el.appendChild(p);
    }
    document.body.insertBefore(el, document.body.firstChild);
  }
  if (colorTheme === "sunset") {
    // Живой эффект восхода/заката
    inj("sunsetKf", `
      @keyframes sunRise {
        0%   { transform: translateY(60px) scale(0.7); opacity: 0.2; }
        40%  { opacity: 1; }
        100% { transform: translateY(-30px) scale(1.1); opacity: 0.85; }
      }
      @keyframes sunPulse {
        0%,100% { box-shadow: 0 0 40px 10px rgba(251,146,60,0.35), 0 0 80px 30px rgba(251,146,60,0.15); }
        50%     { box-shadow: 0 0 70px 20px rgba(251,146,60,0.55), 0 0 140px 60px rgba(251,146,60,0.25); }
      }
      @keyframes cloudDrift {
        0%   { transform: translateX(-60px); opacity: 0; }
        15%  { opacity: 0.7; }
        85%  { opacity: 0.7; }
        100% { transform: translateX(110vw); opacity: 0; }
      }
      @keyframes skyGlow {
        0%,100% { opacity: 0.55; }
        50%     { opacity: 0.9; }
      }
      @keyframes rayRotate {
        0%   { transform: rotate(0deg); opacity: 0.18; }
        50%  { opacity: 0.32; }
        100% { transform: rotate(360deg); opacity: 0.18; }
      }
    `);
    const wrap = document.createElement("div");
    wrap.id = "themeAurora";
    wrap.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;";

    // Небесный градиент
    const sky = document.createElement("div");
    sky.style.cssText = "position:absolute;inset:0;background:linear-gradient(180deg,rgba(251,146,60,0.13) 0%,rgba(251,191,36,0.09) 40%,transparent 100%);animation:skyGlow 6s ease-in-out infinite;";
    wrap.appendChild(sky);

    // Солнце
    const sun = document.createElement("div");
    sun.style.cssText = "position:absolute;left:50%;bottom:18%;width:64px;height:64px;margin-left:-32px;border-radius:50%;background:radial-gradient(circle,#fde68a 0%,#fb923c 60%,rgba(251,146,60,0) 100%);animation:sunRise 8s ease-out forwards, sunPulse 4s 2s ease-in-out infinite;";
    wrap.appendChild(sun);

    // Лучи солнца
    const rays = document.createElement("div");
    rays.style.cssText = "position:absolute;left:50%;bottom:calc(18% + 32px);width:160px;height:160px;margin-left:-80px;margin-bottom:-80px;background:conic-gradient(rgba(251,191,36,0.18) 0deg,transparent 30deg,rgba(251,191,36,0.14) 60deg,transparent 90deg,rgba(251,191,36,0.18) 120deg,transparent 150deg,rgba(251,191,36,0.14) 180deg,transparent 210deg,rgba(251,191,36,0.18) 240deg,transparent 270deg,rgba(251,191,36,0.14) 300deg,transparent 330deg,rgba(251,191,36,0.18) 360deg);border-radius:50%;animation:rayRotate 12s linear infinite;";
    wrap.appendChild(rays);

    // Облака
    const cloudColors = ["rgba(251,191,36,0.22)","rgba(251,146,60,0.18)","rgba(253,186,116,0.20)"];
    [
      {w:180,h:38,b:"28%",delay:"0s",dur:"18s",top:"auto"},
      {w:120,h:26,b:"38%",delay:"5s",dur:"24s",top:"auto"},
      {w:220,h:32,b:"22%",delay:"10s",dur:"30s",top:"auto"},
    ].forEach((c, i) => {
      const cloud = document.createElement("div");
      cloud.style.cssText = `position:absolute;left:-220px;bottom:${c.b};width:${c.w}px;height:${c.h}px;border-radius:999px;background:${cloudColors[i]};filter:blur(8px);animation:cloudDrift ${c.dur} ${c.delay} linear infinite;`;
      wrap.appendChild(cloud);
    });

    // Горизонтальное сияние
    const glow = document.createElement("div");
    glow.style.cssText = "position:absolute;left:0;right:0;bottom:16%;height:60px;background:linear-gradient(transparent,rgba(251,191,36,0.22),transparent);filter:blur(8px);animation:skyGlow 5s 1s ease-in-out infinite;";
    wrap.appendChild(glow);

    document.body.insertBefore(wrap, document.body.firstChild);
  }

  if (colorTheme === "white") {
    // Золотой час — мягкое утреннее солнце с частицами пыльцы
    inj("whiteKf", `
      @keyframes goldenRise {
        0%   { transform: translateY(40px); opacity: 0; }
        100% { transform: translateY(0px); opacity: 1; }
      }
      @keyframes goldenPulse {
        0%,100% { box-shadow: 0 0 50px 15px rgba(251,191,36,0.3), 0 0 100px 40px rgba(251,191,36,0.12); }
        50%     { box-shadow: 0 0 80px 25px rgba(251,191,36,0.5), 0 0 160px 70px rgba(251,191,36,0.2); }
      }
      @keyframes goldenFloat {
        0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
        15%  { opacity: 0.8; }
        85%  { opacity: 0.6; }
        100% { transform: translateY(-140px) translateX(${Math.random()>0.5?'':'-'}30px) rotate(180deg); opacity: 0; }
      }
      @keyframes goldenGlow {
        0%,100% { opacity: 0.4; }
        50%     { opacity: 0.75; }
      }
      @keyframes goldenRay {
        0%   { transform: rotate(0deg); opacity: 0.12; }
        100% { transform: rotate(360deg); opacity: 0.12; }
      }
    `);
    const wrap = document.createElement("div");
    wrap.id = "themeShimmer";
    wrap.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;";

    // Фоновое сияние
    const bg = document.createElement("div");
    bg.style.cssText = "position:absolute;inset:0;background:radial-gradient(ellipse 90% 60% at 30% 80%,rgba(251,191,36,0.18) 0%,rgba(251,146,60,0.10) 40%,transparent 75%);animation:goldenGlow 7s ease-in-out infinite;";
    wrap.appendChild(bg);

    // Солнце низко у горизонта
    const sun = document.createElement("div");
    sun.style.cssText = "position:absolute;left:28%;bottom:12%;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,#fef3c7 0%,#fde68a 40%,#fb923c 75%,rgba(251,146,60,0) 100%);animation:goldenRise 2s ease-out forwards, goldenPulse 5s 2s ease-in-out infinite;";
    wrap.appendChild(sun);

    // Лучи
    const rays = document.createElement("div");
    rays.style.cssText = "position:absolute;left:28%;bottom:calc(12% + 40px);width:200px;height:200px;margin-left:-60px;margin-bottom:-100px;background:conic-gradient(rgba(251,191,36,0.15) 0deg,transparent 25deg,rgba(251,191,36,0.12) 50deg,transparent 75deg,rgba(251,191,36,0.15) 100deg,transparent 125deg,rgba(251,191,36,0.12) 150deg,transparent 175deg,rgba(251,191,36,0.15) 200deg,transparent 225deg,rgba(251,191,36,0.12) 250deg,transparent 275deg,rgba(251,191,36,0.15) 300deg,transparent 325deg,rgba(251,191,36,0.12) 350deg,transparent 360deg);border-radius:50%;animation:goldenRay 20s linear infinite;";
    wrap.appendChild(rays);

    // Частицы пыльцы/пыли
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("div");
      const sz = Math.random() * 5 + 2;
      const colors = ["rgba(251,191,36,0.7)","rgba(251,146,60,0.6)","rgba(253,224,71,0.65)","rgba(252,211,77,0.7)"];
      p.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;background:${colors[~~(Math.random()*colors.length)]};left:${Math.random()*100}%;bottom:${Math.random()*40}%;filter:blur(${Math.random()<0.4?1:0}px);animation:goldenFloat ${5+Math.random()*10}s ${Math.random()*8}s ease-in-out infinite;`;
      wrap.appendChild(p);
    }

    // Горизонтальная дымка
    const haze = document.createElement("div");
    haze.style.cssText = "position:absolute;left:0;right:0;bottom:10%;height:80px;background:linear-gradient(transparent,rgba(251,191,36,0.18),transparent);filter:blur(12px);animation:goldenGlow 6s ease-in-out infinite;";
    wrap.appendChild(haze);

    document.body.insertBefore(wrap, document.body.firstChild);
  }
  // Force CSS recalc for all themed elements
  requestAnimationFrame(() => {
    document
      .querySelectorAll(
        ".balance-card, .nav-fab-circle, .app-logo, .btn-primary",
      )
      .forEach((el) => {
        el.style.transition = "all 0.35s ease";
      });
    // Trigger repaint
    void document.body.offsetHeight;
  });
}

function getCategoryStyle(cat, type) {
  if (categoryCustomizations?.[cat])
    return {
      icon: categoryCustomizations[cat].icon,
      color: categoryCustomizations[cat].color,
    };
  if (categoryIcons[cat])
    return { icon: categoryIcons[cat].icon, color: categoryIcons[cat].color };
  return type === "income"
    ? { icon: "💰", color: "#22c55e" }
    : { icon: "💸", color: "#ef4444" };
}

// ============================================================
// ШАБЛОНЫ
// ============================================================
let userTemplates = [];
let frequentStats = {};

function saveFrequentStats() {
  localStorage.setItem("frequentStats", JSON.stringify(frequentStats));
}
function saveUserTemplates() {
  localStorage.setItem("userTemplates", JSON.stringify(userTemplates));
}
function loadUserTemplates() {
  const r = localStorage.getItem("userTemplates");
  if (r) userTemplates = JSON.parse(r);
}
function updateFrequentStats(tx) {
  const k = `${tx.category}|${tx.amountRub}`;
  frequentStats[k] = (frequentStats[k] || 0) + 1;
  saveFrequentStats();
}
function getFrequentSuggestions(limit = 5) {
  return Object.entries(frequentStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k, c]) => {
      const [cat, amt] = k.split("|");
      return {
        type: "auto",
        category: cat,
        amountRub: parseFloat(amt),
        count: c,
      };
    });
}
function addUserTemplate(tpl) {
  userTemplates.push({ id: Date.now(), ...tpl });
  saveUserTemplates();
}
function removeUserTemplate(id) {
  userTemplates = userTemplates.filter((t) => t.id !== id);
  saveUserTemplates();
}

// Обновлённый рендер предложений с кнопкой удаления
function updateSuggestions() {
  const sb = document.getElementById("suggestionsList");
  if (!sb) return;
  if (!suggestionsEnabled) {
    const bl = document.getElementById("suggestionsBlock");
    if (bl) bl.style.display = "none";
    return;
  }

  const sl = document.getElementById("suggestionsList");
  if (!sl) return;
  const auto = getFrequentSuggestions(3);
  const manual = userTemplates.slice(0, 5);
  let html = "";
  if (auto.length) {
    html += `<div class="suggestions-subtitle">⚡ ${t("quickSuggestions")}</div>`;
    auto.forEach((s) => {
      html += `<button class="suggestion-item" data-type="auto" data-category="${esc(s.category)}" data-amount="${s.amountRub}"><span>📌 ${esc(s.category)} · ${fmt(s.amountRub)}</span></button>`;
    });
  }
  if (manual.length) {
    html += `<div class="suggestions-subtitle">⭐ ${t("yourTemplates")}</div>`;
    manual.forEach((tpl) => {
      const icon = tpl.type === "expense" ? "💸" : "💰";
      html += `<div class="suggestion-item-wrap">
        <button class="suggestion-item" data-type="manual" data-id="${tpl.id}" data-category="${esc(tpl.category)}" data-subcategory="${esc(tpl.subcategory || "")}" data-amount="${tpl.amountRub}" data-note="${esc(tpl.note || "")}">
          <span>${icon} ${esc(tpl.name)} · ${fmt(tpl.amountRub)}</span>
        </button>
        <button class="suggestion-delete-btn" data-id="${tpl.id}" title="${t("deleteTemplate")}">✕</button>
      </div>`;
    });
  }
  if (!auto.length && !manual.length)
    html = `<div class="suggestions-empty">${t("noStatsYet")}</div>`;
  sl.innerHTML = html;

  // Обработчики применения
  sl.querySelectorAll(".suggestion-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.type === "auto") {
        const cs = document.getElementById("addCategorySelect");
        if (cs) {
          cs.value = btn.dataset.category;
          cs.dispatchEvent(new Event("change"));
        }
        const af = document.getElementById("addAmount");
        if (af) af.value = toDisp(parseFloat(btn.dataset.amount)).toFixed(2);
      } else {
        const tpl = userTemplates.find(
          (t) => t.id === parseInt(btn.dataset.id),
        );
        if (!tpl) return;
        addType = tpl.type;
        const modal = document.getElementById("addModal");
        if (modal) {
          modal
            .querySelectorAll(".type-btn")
            .forEach((b) => b.classList.remove("active"));
          const tb = modal.querySelector(`.type-btn.${tpl.type}`);
          if (tb) tb.classList.add("active");
        }
        document.getElementById("catLabel").textContent =
          tpl.type === "expense" ? t("expCategory") : t("incCategory");
        const cs = document.getElementById("addCategorySelect");
        const eo =
          `<option value="">${t("selectCategory")}</option>` +
          Object.keys(categories)
            .map((c) => `<option value="${c}">${c}</option>`)
            .join("");
        const io =
          `<option value="">${t("selectCategory")}</option>` +
          Object.keys(incomeCategories)
            .map((c) => `<option value="${c}">${c}</option>`)
            .join("");
        cs.innerHTML = tpl.type === "expense" ? eo : io;
        cs.value = tpl.category;
        cs.dispatchEvent(new Event("change"));
        if (tpl.subcategory) {
          setTimeout(() => {
            const s = document.getElementById("addSubcatSelect");
            if (s) s.value = tpl.subcategory;
          }, 50);
        }
        const af = document.getElementById("addAmount");
        if (af) af.value = toDisp(tpl.amountRub).toFixed(2);
        if (tpl.note) document.getElementById("addNote").value = tpl.note;
      }
    });
  });

  // Обработчики удаления
  sl.querySelectorAll(".suggestion-delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      askConfirm(
        t("deleteTemplate"),
        () => {
          removeUserTemplate(parseInt(btn.dataset.id));
          updateSuggestions();
          showToast(t("deleted"));
        },
        { icon: "🗑️" },
      );
    });
  });
}

let calcExpr = "";

// ============================================================
// УТИЛИТЫ
// ============================================================
function toDisp(rub) {
  return rub * (exchangeRates[displayCurrency] || 1);
}
function toRub(disp) {
  return disp / (exchangeRates[displayCurrency] || 1);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString(currentLang);
  } catch (e) {
    return d;
  }
}
function esc(str) {
  if (!str) return "";
  return String(str).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}
function fmt(n) {
  return toDisp(n).toFixed(2) + " " + sym();
}
function debounce(fn, delay) {
  let t;
  return function (...a) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, a), delay);
  };
}

// Хеш пин-кода (простой, без сервера)

function getDateGroupLabel(dateStr) {
  const todayStr = today();
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterdayStr = d.toISOString().slice(0, 10);
  if (dateStr === todayStr) return t("groupToday");
  if (dateStr === yesterdayStr) return t("groupYesterday");
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString(currentLang, {
      day: "numeric",
      month: "long",
    });
  } catch (e) {
    return dateStr;
  }
}

// Фильтрация по времени для истории
function filterByTime(txList, filter) {
  const now = new Date();
  const todayStr = today();
  const d1 = new Date();
  d1.setDate(d1.getDate() - 1);
  const yesterdayStr = d1.toISOString().slice(0, 10);
  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const twoDaysStr = d2.toISOString().slice(0, 10);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  switch (filter) {
    case "today":
      return txList.filter((tx) => tx.date === todayStr);
    case "yesterday":
      return txList.filter((tx) => tx.date === yesterdayStr);
    case "twoDaysAgo":
      return txList.filter((tx) => tx.date === twoDaysStr);
    case "thisWeek":
      return txList.filter(
        (tx) => tx.date && new Date(tx.date + "T00:00:00") >= weekAgo,
      );
    case "thisMonth":
      return txList.filter(
        (tx) => tx.date && new Date(tx.date + "T00:00:00") >= monthStart,
      );
    default:
      return txList;
  }
}

function getTransactionsForPeriod(period) {
  const now = new Date();
  const y = now.getFullYear(),
    m = now.getMonth();
  if (period === "thisMonth")
    return transactions.filter((tx) => {
      if (!tx.date) return false;
      const d = new Date(tx.date + "T00:00:00");
      return d.getFullYear() === y && d.getMonth() === m;
    });
  if (period === "lastMonth") {
    const lm = m === 0 ? 11 : m - 1,
      ly = m === 0 ? y - 1 : y;
    return transactions.filter((tx) => {
      if (!tx.date) return false;
      const d = new Date(tx.date + "T00:00:00");
      return d.getFullYear() === ly && d.getMonth() === lm;
    });
  }
  return transactions;
}

// ============================================================
// ЗАГРУЗКА / СОХРАНЕНИЕ
// ============================================================
function getProfileStorageKey(pid) {
  return "budget_profile_" + (pid || activeProfileId);
}
function getGlobalStorageKey() {
  return "budget_pro_global";
}

function loadProfiles() {
  const raw = localStorage.getItem(getGlobalStorageKey());
  if (!raw) {
    profiles = [
      {
        id: "default",
        name: "Я",
        emoji: "👤",
        color: "#2d6a4f",
        role: "owner",
      },
    ];
    activeProfileId = "default";
    // Migrate from old single-profile format
    const old = localStorage.getItem("budget_pro_full");
    if (old) {
      try {
        const d = JSON.parse(old);
        localStorage.setItem(getProfileStorageKey("default"), old);
        if (d.displayCurrency) displayCurrency = d.displayCurrency;
        if (d.exchangeRates)
          exchangeRates = { ...exchangeRates, ...d.exchangeRates };
      } catch (e) {}
    }
    return;
  }
  try {
    const g = JSON.parse(raw);
    profiles = g.profiles || [
      { id: "default", name: "Я", emoji: "👤", color: "#2d6a4f" },
    ];
    activeProfileId = g.activeProfileId || "default";
    if (g.sharedAccessProfile) sharedAccessProfile = g.sharedAccessProfile;
    pinHash = g.pinHash || null;
    pinEnabled = g.pinEnabled || false;
    biometryEnabled = g.biometryEnabled || false;
    biometryCredId = g.biometryCredId || null;
    colorTheme =
      g.colorTheme || localStorage.getItem("colorTheme") || "default";
    displayCurrency = g.displayCurrency || "GEL";
    if (g.exchangeRates)
      exchangeRates = { ...exchangeRates, ...g.exchangeRates };
    if (colorTheme) applyColorTheme(colorTheme);
  } catch (e) {}
}

function saveGlobal() {
  localStorage.setItem(
    getGlobalStorageKey(),
    JSON.stringify({
      profiles,
      activeProfileId,
      pinHash,
      pinEnabled,
      biometryEnabled,
      biometryCredId,
      colorTheme,
      displayCurrency,
      exchangeRates,
      sharedAccessProfile,
    }),
  );
}

function loadProfileData(pid) {
  const key = getProfileStorageKey(pid);
  const raw = localStorage.getItem(key);
  if (!raw) {
    transactions = [];
    startBalanceRub = 0;
    notebookPages = [];
    categories = JSON.parse(JSON.stringify(window.initialCategories));
    incomeCategories = {
      Зарплата: { subcats: [] },
      Подарок: { subcats: [] },
      Фриланс: { subcats: [] },
    };
    calcHistory = [];
    convHistory = [];
    userTemplates = [];
    frequentStats = {};
    categoryCustomizations = {};
    categoryBudgets = {};
    recurringOps = [];
    return;
  }
  try {
    const d = JSON.parse(raw);
    transactions = d.transactions || [];
    startBalanceRub = d.startBalanceRub ?? 0;
    if (d.notebookPages) notebookPages = d.notebookPages;
    if (d.categories) categories = d.categories;
    if (d.categoryCustomizations)
      categoryCustomizations = d.categoryCustomizations;
    if (d.incomeCategories) {
      if (Array.isArray(d.incomeCategories)) {
        incomeCategories = {};
        d.incomeCategories.forEach((c2) => {
          incomeCategories[c2] = { subcats: [] };
        });
      } else incomeCategories = d.incomeCategories;
    }
    calcHistory = d.calcHistory || [];
    convHistory = d.convHistory || [];
    userTemplates = d.userTemplates || [];
    frequentStats = d.frequentStats || {};
    categoryBudgets = d.categoryBudgets || {};
    recurringOps = d.recurringOps || [];
    supportMessages = d.supportMessages || [];
    categoryCustomizations = d.categoryCustomizations || {};
    transactions.forEach((tx) => {
      if (
        tx.category === "Начальная сумма" ||
        tx.category === "Starting amount" ||
        tx.category === "საწყისი თანხა"
      )
        tx._initial = true;
    });
  } catch (e) {}

  // Проверка флага новых сообщений для владельца
  if (
    activeProfileId === pid &&
    localStorage.getItem("has_new_support_messages") === "true" &&
    isCreator()
  ) {
    setTimeout(() => {
      showToast(
        "📬 " + t("newUserMessages"),
        "success",
        3000,
      );
      localStorage.removeItem("has_new_support_messages");
    }, 500);
  }
}

function saveProfileData() {
  localStorage.setItem(
    getProfileStorageKey(),
    JSON.stringify({
      transactions,
      startBalanceRub,
      notebookPages,
      categories,
      incomeCategories,
      calcHistory,
      convHistory,
      userTemplates,
      frequentStats,
      categoryCustomizations,
      categoryBudgets,
      recurringOps,
      supportMessages, // <-- добавили
    }),
  );
}

function switchProfile(pid) {
  const targetProf = profiles.find((p) => p.id === pid);
  if (!targetProf) return;

  // Если переключаемся на обычный профиль (не гостевой) — выходим из гостевого режима
  if (!targetProf.isShared) {
    sharedAccessProfile = null;
  } else {
    sharedAccessProfile = {
      profileId: pid,
      perms: targetProf.sharePerms || { ...DEFAULT_PERMS },
    };
  }

  saveProfileData(); // сохраняем текущий профиль перед сменой
  activeProfileId = pid;

  // Сбрасываем категории и загружаем данные нового профиля
  categories = JSON.parse(JSON.stringify(window.initialCategories));
  incomeCategories = {
    Зарплата: { subcats: [] },
    Подарок: { subcats: [] },
    Фриланс: { subcats: [] },
  };
  loadProfileData(pid);
  saveGlobal();
  syncStartBalanceTransaction();
  applyRecurringOps();
  updateTopBlocks();
  setTab("home");

  const pname = profiles.find((p) => p.id === pid)?.name || pid;
  showToast("👤 " + pname);

  // Проверка флага новых сообщений ПОСЛЕ завершения переключения
  setTimeout(() => {
    if (
      localStorage.getItem("has_new_support_messages") === "true" &&
      isCreator()
    ) {
      showToast("📬 " + t("newUserMessages"), "success");
      localStorage.removeItem("has_new_support_messages");
    }
  }, 100); // небольшая задержка, чтобы тост профиля не перебивал
}

async function recoverMissingDataInBackground() {
  if (backgroundRecoveryStarted) return false;
  backgroundRecoveryStarted = true;

  let restored = false;

  try {
    const idbRestored = await loadAllFromIndexedDB();
    if (idbRestored) {
      loadProfiles();
      loadProfileData(activeProfileId);
      showToast(t("restoredFromBackup"), "success");
      restored = true;
    }
  } catch (e) {
    console.warn("IndexedDB restore failed", e);
  }

  if (!restored && transactions.length === 0) {
    const fbCfg = JSON.parse(
      localStorage.getItem("budgetpro_firebase") || "{}",
    );
    if (fbCfg.databaseURL) {
      try {
        if (typeof initFirebase === "function") await initFirebase();
        const snap = await _fbDB.ref("budgetpro_all_data").once("value");
        const cloudData = snap.val();
        if (
          cloudData &&
          cloudData.transactions &&
          cloudData.transactions.length > 0
        ) {
          transactions = cloudData.transactions;
          startBalanceRub = cloudData.startBalanceRub ?? startBalanceRub;
          saveProfileData();
          showToast(t("restoredFromFirebase"), "success");
          restored = true;
        }
      } catch (e) {
        console.warn("Firebase restore failed", e);
      }
    }
  }

  if (!restored && transactions.length === 0) {
    try {
      const backup = await jsonBinLoadBackup();
      if (backup && backup.transactions && backup.transactions.length > 0) {
        transactions = backup.transactions;
        startBalanceRub = backup.startBalanceRub ?? startBalanceRub;
        notebookPages = backup.notebookPages || [];
        categories = backup.categories || categories;
        incomeCategories = backup.incomeCategories || incomeCategories;
        calcHistory = backup.calcHistory || [];
        convHistory = backup.convHistory || [];
        userTemplates = backup.userTemplates || [];
        frequentStats = backup.frequentStats || {};
        categoryCustomizations = backup.categoryCustomizations || {};
        categoryBudgets = backup.categoryBudgets || {};
        recurringOps = backup.recurringOps || [];
        saveProfileData();
        showToast(t("restoredFromCloud"), "success");
        restored = true;
      }
    } catch (e) {
      console.warn("JSONBin restore failed", e);
    }
  }

  if (!restored) return false;

  syncStartBalanceTransaction();
  applyRecurringOps();
  updateTopBlocks();
  if (appInitDone && currentTab === "home") setTab("home");
  return true;
}

function loadAll() {
  loadProfiles();

  // Принудительно назначаем роли, если их нет
  profiles.forEach((p) => {
    if (p.id === "default") {
      p.role = "owner";
    } else if (!p.role) {
      p.role = p.isShared ? "guest" : "user";
    }
  });
  saveGlobal();

  loadProfileData(activeProfileId);

  // Если активный профиль гостевой, но мы не в гостевом режиме, переключаемся на владельца
  const activeProf = profiles.find((p) => p.id === activeProfileId);
  if (activeProf?.isShared && !sharedAccessProfile) {
    const ownerProfile =
      profiles.find((p) => p.role === "owner") ||
      profiles.find((p) => p.id === "default");
    if (ownerProfile && ownerProfile.id !== activeProfileId) {
      activeProfileId = ownerProfile.id;
      saveGlobal();
      loadProfileData(ownerProfile.id);
    }
  }

  // Пересоздаём начальную сумму после возможного восстановления
  syncStartBalanceTransaction();
  applyRecurringOps();
  updateTopBlocks(); // обновляем цифры на главной
  if (appInitDone && currentTab === "home") setTab("home"); // перерисовываем главную

  if (transactions.length === 0) {
    setTimeout(() => {
      recoverMissingDataInBackground().catch((e) => {
        console.warn("Background restore failed", e);
      });
    }, 120);
  }
}

function saveAll() {
  saveProfileData();
  saveGlobal();
  saveAllToIndexedDB().catch(() => {});

  // Автосохранение в JSONBin
  const backup = {
    type: "full_backup",
    transactions: transactions,
    startBalanceRub: startBalanceRub,
    notebookPages: notebookPages,
    categories: categories,
    incomeCategories: incomeCategories,
    calcHistory: calcHistory,
    convHistory: convHistory,
    userTemplates: userTemplates,
    frequentStats: frequentStats,
    categoryCustomizations: categoryCustomizations,
    categoryBudgets: categoryBudgets,
    recurringOps: recurringOps,
    timestamp: Date.now(),
  };
  jsonBinSaveBackup(backup).catch(() => {});
}

function syncStartBalanceTransaction() {
  // 1. Удаляем абсолютно все старые операции с _initial
  transactions = transactions.filter((tx) => !tx._initial);

  // 2. Если начальная сумма > 0 – создаём одну операцию-якорь
  if (startBalanceRub > 0) {
    transactions.push({
      type: "income",
      category: t("initialCategory"),
      subcategory: null,
      amountRub: startBalanceRub,
      date: today(),
      note: t("initialCapital"),
      _initial: true,
    });
  }
  transactions.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

// ============================================================
// ПОВТОРЯЮЩИЕСЯ ОПЕРАЦИИ
// ============================================================
function applyRecurringOps() {
  if (!recurringOps.length) return;
  const todayStr = today();
  const now = new Date();
  let applied = 0;

  recurringOps.forEach((op) => {
    // 🔽 Генерируем постоянный уникальный идентификатор для этой повторяющейся операции
    if (!op._rid)
      op._rid =
        "rec_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);

    if (!op.lastApplied) op.lastApplied = null;
    let shouldApply = false;
    let targetDate = null; // <-- новая переменная для даты операции

    if (op.freq === "monthly") {
      const targetDay = op.day || 1;
      const targetDateObj = new Date(
        now.getFullYear(),
        now.getMonth(),
        targetDay,
      );
      targetDate = targetDateObj.toISOString().slice(0, 10);
      if (
        now.getDate() >= targetDay &&
        op.lastApplied !== targetDate.slice(0, 7)
      ) {
        op.lastApplied = targetDate.slice(0, 7);
        shouldApply = true;
        // ❌ Убираем transactions.push отсюда
      }
    } else if (op.freq === "daily") {
      targetDate = todayStr;
      if (op.lastApplied !== todayStr) {
        op.lastApplied = todayStr;
        shouldApply = true;
        // ❌ Убираем transactions.push отсюда
      }
    } else if (op.freq === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const lastDate = op.lastApplied
        ? new Date(op.lastApplied + "T00:00:00")
        : weekAgo;
      targetDate = todayStr;
      if (lastDate <= weekAgo) {
        op.lastApplied = todayStr;
        shouldApply = true;
        // ❌ Убираем transactions.push отсюда
      }
    }

    // 🔽 Единое место для добавления операции с проверкой на дубликаты
    if (shouldApply) {
      const alreadyExists = transactions.some(
        (tx) =>
          tx._recurring === true &&
          tx._rid === op._rid &&
          tx.date === targetDate,
      );

      if (!alreadyExists) {
        transactions.push({
          type: op.type,
          category: op.category,
          subcategory: op.subcategory || null,
          amountRub: op.amountRub,
          date: targetDate,
          note: (op.note || "") + " 🔄",
          _recurring: true,
          _rid: op._rid, // <-- обязательно добавляем идентификатор
        });
        applied++;
      }
    }
  });
  if (applied > 0) {
    transactions.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    saveAll();
    if (applied > 0)
      setTimeout(() => showToast(`${t("recurringApplied")} ${applied}`), 1000);
  }
}

// ============================================================
// ПИН-КОД
// ============================================================
function showPinScreen(onSuccess) {
  if (!pinEnabled || !pinHash) {
    onSuccess();
    return;
  }
  const overlay = document.createElement("div");
  overlay.id = "pinScreen";
  overlay.style.cssText = `position:fixed;inset:0;background:var(--cream);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;`;
  overlay.innerHTML = `
    <div style="font-size:40px;">🔒</div>
    <div style="font-size:20px;font-weight:800;color:var(--text);">${t("pinEnter")}</div>
    <div id="pinDots" style="display:flex;gap:12px;margin:8px 0;">
      ${[0, 1, 2, 3].map(() => `<div style="width:16px;height:16px;border-radius:50%;border:2px solid var(--primary);background:transparent;"></div>`).join("")}
    </div>
    <div id="pinError" style="color:var(--expense-color);font-size:14px;font-weight:700;min-height:20px;"></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:280px;">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => `<button class="pin-key" data-key="${k}" style="height:64px;border-radius:16px;border:1.5px solid var(--cream-border);background:var(--card-bg);font-size:22px;font-weight:700;cursor:pointer;color:var(--text);font-family:inherit;">${k}</button>`).join("")}
    </div>`;
  document.body.appendChild(overlay);
  let entered = "";
  const dots = overlay.querySelectorAll("#pinDots div");
  const updateDots = () => {
    dots.forEach((d, i) => {
      d.style.background =
        i < entered.length ? "var(--primary)" : "transparent";
    });
  };
  overlay.querySelectorAll(".pin-key").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const k = btn.dataset.key;
      if (k === "") return;
      if (k === "⌫") {
        entered = entered.slice(0, -1);
        updateDots();
        return;
      }
      if (entered.length >= 4) return;
      entered += k;
      updateDots();
      if (entered.length === 4) {
        const h = await hashPin(entered);
        if (h === pinHash) {
          overlay.remove();
          onSuccess();
        } else {
          document.getElementById("pinError").textContent = t("pinWrong");
          entered = "";
          updateDots();
          setTimeout(() => {
            const e = document.getElementById("pinError");
            if (e) e.textContent = "";
          }, 1500);
        }
      }
    });
  });
}

// ============================================================
// TOAST / CONFIRM
// ============================================================
let toastTimer = null;
function showToast(msg, type = "success") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast " + type;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
}
function askConfirm(
  msg,
  onYes,
  { icon = "⚠️", yesText = null, title = null } = {},
) {
  const ov = document.getElementById("confirmOverlay");
  document.getElementById("confirmIcon").textContent = icon;
  document.getElementById("confirmTitle").textContent =
    title || t("confirmDelete");
  document.getElementById("confirmMsg").textContent = msg;
  document.getElementById("confirmOk").textContent =
    yesText || t("confirmOkBtn");
  const cb = document.getElementById("confirmCancel");
  if (cb) cb.innerHTML = `✕ ${t("cancel")}`;
  ov.classList.add("open");
  const close = () => ov.classList.remove("open");
  document.getElementById("confirmCancel").onclick = close;
  document.getElementById("confirmOk").onclick = () => {
    close();
    onYes();
  };
}

// ============================================================
// ШАПКА
// ============================================================
function updateHeader() {
  const el = document.getElementById("headerDate");
  if (el) {
    const now = new Date();
    const weekdays = t("weekdaysShort");
    const months = t("months");
    const dayOfWeek = weekdays[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    if (currentLang === "en") {
      el.textContent = `${dayOfWeek}, ${month} ${day}, ${year}`;
    } else if (currentLang === "ka") {
      el.textContent = `${dayOfWeek}, ${day} ${month}, ${year}`;
    } else {
      el.textContent = `${dayOfWeek}, ${day} ${month} ${year} года`;
    }
  }

  // ── ПЕРСОНАЛИЗИРОВАННОЕ ПРИВЕТСТВИЕ ──
  const logo = document.getElementById("appLogoBtn");
  if (logo) {
    const prof = profiles.find((p) => p.id === activeProfileId);
    const userName = prof?.name || "";
    const hour = new Date().getHours();
    let greetEmoji = "🌿";
    let greetWord = "";
    if (currentLang === "ru") {
      if (hour >= 5 && hour < 12) {
        greetWord = "Доброе утро";
        greetEmoji = "🌅";
      } else if (hour < 18) {
        greetWord = "Добрый день";
        greetEmoji = "☀️";
      } else if (hour < 22) {
        greetWord = "Добрый вечер";
        greetEmoji = "🌆";
      } else {
        greetWord = "Доброй ночи";
        greetEmoji = "🌙";
      }
    } else if (currentLang === "en") {
      if (hour >= 5 && hour < 12) {
        greetWord = "Good morning";
        greetEmoji = "🌅";
      } else if (hour < 18) {
        greetWord = "Good afternoon";
        greetEmoji = "☀️";
      } else if (hour < 22) {
        greetWord = "Good evening";
        greetEmoji = "🌆";
      } else {
        greetWord = "Good night";
        greetEmoji = "🌙";
      }
    } else {
      if (hour >= 5 && hour < 12) {
        greetWord = "დილა მშვიდობისა";
        greetEmoji = "🌅";
      } else if (hour < 18) {
        greetWord = "მშვიდობისა";
        greetEmoji = "☀️";
      } else if (hour < 22) {
        greetWord = "საღამო მშვიდობისა";
        greetEmoji = "🌆";
      } else {
        greetWord = "ღამე მშვიდობისა";
        greetEmoji = "🌙";
      }
    }
    if (userName && greetWord) {
      logo.textContent = `${greetEmoji} ${greetWord}, ${userName}!`;
    } else {
      logo.textContent = t("appName");
    }
    if (isCreator()) logo.innerHTML += " 👑";
  }
  // Update slogan
  const sl = document.getElementById("appSlogan");
  if (sl) sl.textContent = t("slogan");
}
function addHeaderButtons() {
  ["headerGuideBtn", "headerHelpBtn", "headerLangBtn", "themeToggle"].forEach(
    (id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const nb = btn.cloneNode(true);
      btn.parentNode.replaceChild(nb, btn);
      if (id === "headerGuideBtn") nb.addEventListener("click", startGuide);
      if (id === "headerHelpBtn") nb.addEventListener("click", showHelpModal);
      if (id === "headerLangBtn")
        nb.addEventListener("click", () => {
          const ls = ["ru", "en", "ka"];
          setLanguage(ls[(ls.indexOf(currentLang) + 1) % ls.length]);
        });
      if (id === "themeToggle") {
        nb.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
        nb.addEventListener("click", () => {
          const isDark = document.body.classList.contains("dark");
          // Mark as manual override so time-theme doesn't auto-revert
          localStorage.setItem("themeManualOverride", "1");
          applyColorTheme(isDark ? "default" : "navy");
          const b = document.getElementById("themeToggle");
          if (b)
            b.textContent = document.body.classList.contains("dark")
              ? "☀️"
              : "🌙";
          showToast("🎨 " + t("themeChanged"));
          haptic("light");
          if (typeof renderSettings === "function") renderSettings();
        });
        return;
      }
    },
  );
  updateHeaderButtons();
}
function updateHeaderButtons() {
  const lb = document.getElementById("headerLangBtn");
  if (lb)
    lb.textContent = { ru: "🇷🇺", en: "🇬🇧", ka: "🇬🇪" }[currentLang] || "🌐";
}
function animateValue(el, from, to, suffix, duration) {
  if (!el || from === to) {
    el && (el.textContent = to.toFixed(2) + " " + suffix);
    return;
  }
  const start = performance.now();
  const diff = to - from;
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = from + diff * eased;
    el.textContent = current.toFixed(2) + " " + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

let _lastBalVals = { bal: null, inc: null, exp: null, sal: null };

function getTopBlockDisplayValues() {
  let inc = 0,
    exp = 0,
    realInc = 0;
  for (const tx of transactions) {
    if (tx.type === "income") {
      inc += tx.amountRub;
      if (!tx._initial) realInc += tx.amountRub;
    } else {
      exp += tx.amountRub;
    }
  }
  return {
    balD: toDisp(inc - exp),
    incD: toDisp(realInc),
    expD: toDisp(exp),
    salD: toDisp(startBalanceRub),
  };
}

function updateTopBlocks() {
  const s = sym();
  // Balance = full inc (includes startBalance) - exp
  // incomeCard shows only REAL income (not starting balance)
  // salaryCard shows startBalanceRub
  const { balD, incD, expD, salD } = getTopBlockDisplayValues();
  const els = {
    balanceValue: { val: balD, prev: _lastBalVals.bal },
    incomeValue: { val: incD, prev: _lastBalVals.inc },
    expenseValue: { val: expD, prev: _lastBalVals.exp },
    salaryValue: { val: salD, prev: _lastBalVals.sal },
  };
  const shouldAnimate = Object.values(els).some(
    (e) => e.prev !== null && e.prev !== e.val,
  );
  Object.entries(els).forEach(([id, { val, prev }]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (shouldAnimate && prev !== null && prev !== val) {
      animateValue(el, prev, val, s, 600);
      // Pop animation on balance card
      if (id === "balanceValue") {
        el.classList.remove("updated");
        void el.offsetWidth; // reflow
        el.classList.add("updated");
        setTimeout(() => el.classList.remove("updated"), 400);
      }
    } else {
      el.textContent = val.toFixed(2) + " " + s;
    }
  });
  _lastBalVals = { bal: balD, inc: incD, exp: expD, sal: salD };
  updateHeroTrendText();
}

// ============================================================
// ВКЛАДКИ
// ============================================================
function setTab(tab, onRendered) {
  currentTab = tab;
  traceApp("setTab", { tab, simpleMode });
  traceLayoutSnapshot(`setTab:${tab}`);
  updateHeroDebugOverlay();
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector(`.nav-btn[data-tab="${tab}"]`)
    ?.classList.add("active");
  // Показываем/скрываем hero-карточку: только на главной и только в обычном режиме
  const heroWrap = document.getElementById("heroCardWrap");
  if (heroWrap)
    heroWrap.style.display = tab === "home" && !simpleMode ? "" : "none";
  // Обновляем активную кнопку в обоих навах
  document
    .querySelectorAll("#simpleNav .nav-btn, #mainNav .nav-btn")
    .forEach((b) => b.classList.remove("active"));
  const mainActiveBtn = document.querySelector(
    "#mainNav .nav-btn[data-tab='" + tab + "']",
  );
  if (mainActiveBtn) mainActiveBtn.classList.add("active");
  const simpleActiveBtn = document.querySelector(
    "#simpleNav .nav-btn[data-tab='" + tab + "']",
  );
  if (simpleActiveBtn) simpleActiveBtn.classList.add("active");
  // Если вкладка в шторке "Ещё" — подсвечиваем кнопку "•••"
  const moreTabsSet = new Set(["tools", "settings", "notebook"]);
  if (moreTabsSet.has(tab)) {
    document.getElementById("moreNavBtn")?.classList.add("active");
    document.getElementById("moreNavBtnSimple")?.classList.add("active");
  }
  // Scroll to top smoothly on tab switch
  window.scrollTo({ top: 0, behavior: "instant" });
  const content = document.getElementById("mainContent");
  content.style.opacity = "0";
  content.style.transform = "translateY(8px)";
  setTimeout(() => {
    switch (tab) {
      case "home":
        renderHome();
        setTimeout(() => {
          ensureHomeHeroStable();
          updateHeroDebugOverlay();
        }, 30);
        break;
      case "stats":
        renderStats();
        break;
      case "tools":
        renderTools();
        break;
      case "notebook":
        renderNotebook();
        break;
      case "categories":
        renderCategories();
        break;
      case "settings":
        renderSettings();
        break;
    }
    content.style.transition = "opacity 0.22s ease, transform 0.22s ease";
    content.style.opacity = "1";
    content.style.transform = "translateY(0)";
    // Clear transition after animation completes so it doesn't interfere with JS updates
    setTimeout(() => {
      content.style.transition = "";
      content.style.transform = "";
    }, 280);
    if (typeof onRendered === "function") setTimeout(onRendered, 60);
  }, 160);
}

// ============================================================
// ГЛАВНАЯ — УПРОЩЁННЫЙ РЕЖИМ
// ============================================================
function renderSimpleHome() {
  const mc = document.getElementById("mainContent");
  if (!mc) return;
  const heroWrap = document.getElementById("heroCardWrap");
  if (heroWrap) heroWrap.style.display = "none";

  // Считаем суммы
  let inc = 0,
    exp = 0,
    realInc = 0;
  transactions.forEach((tx) => {
    if (tx.type === "income") {
      inc += tx.amountRub;
      if (!tx._initial) realInc += tx.amountRub;
    } else exp += tx.amountRub;
  });
  const bal = inc - exp;
  const s = sym();
  const L = currentLang;

  // Тексты — простые, без терминов
  const T = {
    bal: { ru: "Мой кошелёк", en: "My Wallet", ka: "ჩემი საფულე" }[L],
    inc: { ru: "Доход", en: "Income", ka: "შემოს." }[L],
    exp: { ru: "Расход", en: "Spent", ka: "ხარჯ." }[L],
    sal: { ru: "Старт", en: "Start", ka: "საწყისი" }[L],
    gotMoney: {
      ru: "💰 Получил деньги",
      en: "💰 Got Money",
      ka: "💰 ფული მივიღე",
    }[L],
    spentMon: {
      ru: "🛍 Потратил деньги",
      en: "🛍 Spent Money",
      ka: "🛍 ფული დავხარჯე",
    }[L],
    gotSub: {
      ru: "зарплата, подарок...",
      en: "salary, gift...",
      ka: "ხელფასი, საჩ...",
    }[L],
    spentSub: {
      ru: "продукты, кафе...",
      en: "groceries, cafe...",
      ka: "საკვები, კაფე...",
    }[L],
    history: {
      ru: "📋 Вся история",
      en: "📋 Full History",
      ka: "📋 სრული ისტ.",
    }[L],
    quick: {
      ru: "Быстро добавить расход",
      en: "Quick expense",
      ka: "სწრაფი ხარჯი",
    }[L],
    recent: { ru: "Последние записи", en: "Recent records", ka: "ბოლო ჩანაწ." }[
      L
    ],
    all: { ru: "Смотреть все →", en: "See all →", ka: "ყველა →" }[L],
    noOps: {
      ru: "Записей пока нет.\nНажмите «Получил» или «Потратил» чтобы добавить первую запись.",
      en: "No records yet.\nTap 'Got Money' or 'Spent Money' to add the first one.",
      ka: "ჩანაწ. ჯერ არ არის.\nდააჭ. 'მივიღე' ან 'დავხარჯე'.",
    }[L],
    hint: {
      ru: "Нажмите на любую запись чтобы изменить или удалить её",
      en: "Tap any record to edit or delete it",
      ka: "დააჭირეთ ჩანაწ. შეცვლა ან წაშლა",
    }[L],
  };

  // Последние 5 операций (без начальной суммы)
  const recent = [...transactions]
    .filter((tx) => !tx._initial)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  // 8 быстрых категорий для расходов
  const quickCats = [
    {
      icon: "🛒",
      label: { ru: "Продукты", en: "Groceries", ka: "საკვები" },
      cat: { ru: "Продукты", en: "Groceries", ka: "Groceries" },
    },
    {
      icon: "🚌",
      label: { ru: "Транспорт", en: "Transport", ka: "ტრანსპ." },
      cat: { ru: "Транспорт", en: "Transport", ka: "Transport" },
    },
    {
      icon: "☕",
      label: { ru: "Кафе", en: "Cafe", ka: "კაფე" },
      cat: { ru: "Кафе", en: "Cafe", ka: "Cafe" },
    },
    {
      icon: "💊",
      label: { ru: "Аптека", en: "Pharmacy", ka: "აფთ." },
      cat: { ru: "Аптека", en: "Pharmacy", ka: "Pharmacy" },
    },
    {
      icon: "🏠",
      label: { ru: "Жильё", en: "Housing", ka: "საცხ." },
      cat: { ru: "Коммуналка", en: "Housing", ka: "Housing" },
    },
    {
      icon: "🍽",
      label: { ru: "Ресторан", en: "Restaurant", ka: "რესტ." },
      cat: { ru: "Ресторан", en: "Restaurant", ka: "Restaurant" },
    },
    {
      icon: "👕",
      label: { ru: "Одежда", en: "Clothes", ka: "ტანს." },
      cat: { ru: "Одежда", en: "Clothes", ka: "Clothes" },
    },
    {
      icon: "🎁",
      label: { ru: "Подарок", en: "Gift", ka: "საჩ." },
      cat: { ru: "Подарок", en: "Gift", ka: "Gift" },
    },
  ];

  // Цвет баланса
  const balColor = bal >= 0 ? "#bbf7d0" : "#fecaca";

  mc.innerHTML = `<div class="tab-anim">

    <!-- ── БАЛАНС ── -->
    <div class="simple-hero">
      <div class="sh-label">${T.bal}</div>
      <div class="sh-value" style="color:${balColor}">
        <span class="sh-currency" style="color:rgba(255,255,255,.65)">${s}</span>${toDisp(Math.abs(bal)).toFixed(2)}
      </div>
      <div class="sh-sub">${
        bal >= 0
          ? {
              ru: "📈 Всё в порядке",
              en: "📈 Looking good",
              ka: "📈 ყველაფერი კარგია",
            }[L]
          : {
              ru: "📉 Расходы превышают доходы",
              en: "📉 Spending exceeds income",
              ka: "📉 ხარჯები შემოსავალს აჭარბებს",
            }[L]
      }</div>
      <div class="hero-chips" style="margin-top:14px; grid-template-columns:repeat(3, minmax(0, 1fr));">
        <div class="hero-chip hc-income sm-chip-tap" data-type="income" role="button" tabindex="0">
          <div class="hc-label">${T.inc}</div>
          <div class="hc-value">+${toDisp(realInc).toFixed(2)}</div>
        </div>
        <div class="hero-chip hc-expense sm-chip-tap" data-type="expense" role="button" tabindex="0">
          <div class="hc-label">${T.exp}</div>
          <div class="hc-value">−${toDisp(exp).toFixed(2)}</div>
        </div>
        <div class="hero-chip hc-salary sm-chip-tap" data-type="salary" role="button" tabindex="0">
          <div class="hc-label">${T.sal}</div>
          <div class="hc-value">${toDisp(startBalanceRub).toFixed(2)}</div>
        </div>
      </div>
    </div>

    <!-- ── МИНИ-СТАТИСТИКА ── -->
    <div class="sm-mini-stats">
      <div class="sm-stat-item">
        <div class="sm-stat-icon">📅</div>
        <div class="sm-stat-info">
          <div class="sm-stat-val">${{ ru: "Сегодня", en: "Today", ka: "დღეს" }[L]}: <span style="font-weight:900;color:${(() => {
            const todayExp = transactions
              .filter((t) => t.date === today() && t.type === "expense")
              .reduce((s, t) => s + t.amountRub, 0);
            return todayExp > 0 ? "#fca5a5" : "#5eead4";
          })()}">−${s}${fmt(transactions.filter((t) => t.date === today() && t.type === "expense").reduce((s2, t) => s2 + t.amountRub, 0))}</span></div>
          <div class="sm-stat-sub">${{ ru: "потрачено за сегодня", en: "spent today", ka: "დღეს დახარჯული" }[L]}</div>
        </div>
      </div>
      <div class="sm-stat-divider"></div>
      <div class="sm-stat-item">
        <div class="sm-stat-icon">📊</div>
        <div class="sm-stat-info">
          <div class="sm-stat-val">${{ ru: "Операций", en: "Records", ka: "ჩანაწ." }[L]}: <span style="font-weight:900;color:#c4b5fd">${transactions.filter((t) => !t._initial).length}</span></div>
          <div class="sm-stat-sub">${{ ru: "всего в истории", en: "total records", ka: "სულ ისტ." }[L]}</div>
        </div>
      </div>
    </div>

    <!-- ── ДВЕ БОЛЬШИЕ КНОПКИ ── -->
    <div class="sm-two-btns">
      <button class="sm-big-btn sm-btn-income sm-add-income">
        <div class="sm-big-icon">💰</div>
        <div class="sm-big-lbl">${T.gotMoney}</div>
        <div class="sm-big-sub">${T.gotSub}</div>
      </button>
      <button class="sm-big-btn sm-btn-expense sm-add-expense">
        <div class="sm-big-icon">🛍</div>
        <div class="sm-big-lbl">${T.spentMon}</div>
        <div class="sm-big-sub">${T.spentSub}</div>
      </button>
    </div>

    <!-- ── БЫСТРЫЕ КАТЕГОРИИ ── -->
    <div class="sm-section-title">${T.quick}</div>
    <div class="sm-quick-grid">
      ${quickCats
        .map(
          (c) => `
        <button class="sm-quick-btn" data-cat="${c.cat[L] || c.cat.ru}" data-type="expense">
          <div class="sm-quick-icon">${c.icon}</div>
          <div class="sm-quick-lbl">${c.label[L] || c.label.ru}</div>
        </button>`,
        )
        .join("")}
    </div>

    <!-- ── КНОПКА ИСТОРИИ ── -->
    <button class="sm-history-btn sm-open-history">
      ${T.history}
    </button>

    <!-- ── ПОСЛЕДНИЕ ЗАПИСИ ── -->
    <div class="sm-section-title" style="margin-top:16px">${T.recent}</div>
    ${
      recent.length
        ? `
      <div class="sm-hint">💡 ${T.hint}</div>
      <div class="sm-ops-list">
        ${recent
          .map((tx) => {
            const st2 = getCategoryStyle(tx.category, tx.type);
            const sign = tx.type === "income" ? "+" : "−";
            const isInc = tx.type === "income";
            const icoBg = isInc
              ? "rgba(45,212,191,0.18)"
              : "rgba(248,113,113,0.16)";
            const amtColor = isInc ? "#5eead4" : "#fca5a5";
            const idx2 = transactions.indexOf(tx);
            const dateStr = fmtDate(tx.date) + (tx.time ? " · " + tx.time : "");
            return `<div class="sm-op-row" data-idx="${idx2}">
            <div class="sm-op-icon" style="background:${icoBg}">${st2.icon}</div>
            <div class="sm-op-info">
              <div class="sm-op-name">${esc(tx.category)}</div>
              <div class="sm-op-date">${dateStr}</div>
            </div>
            <div class="sm-op-amount" style="color:${amtColor}">${sign}${s}${fmt(tx.amountRub)}</div>
          </div>`;
          })
          .join("")}
      </div>
      <button class="sm-all-btn sm-open-history">${T.all}</button>
    `
        : `
      <div class="sm-empty">
        <div style="font-size:52px;margin-bottom:12px">📭</div>
        <div style="font-size:16px;font-weight:700;opacity:.7;white-space:pre-line;text-align:center">${T.noOps}</div>
      </div>
    `
    }

  </div>`;

  // ── Обработчики ──
  // Кнопки «Получил» / «Потратил»
  mc.querySelector(".sm-add-income")?.addEventListener("click", () =>
    openAddModal("income"),
  );
  mc.querySelector(".sm-add-expense")?.addEventListener("click", () =>
    openAddModal("expense"),
  );

  // Быстрые категории
  mc.querySelectorAll(".sm-quick-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      openAddModal("expense", btn.dataset.cat),
    );
    btn.addEventListener(
      "touchstart",
      () => {
        btn.style.transform = "scale(.90)";
      },
      { passive: true },
    );
    btn.addEventListener(
      "touchend",
      () => {
        btn.style.transform = "";
      },
      { passive: true },
    );
  });

  // Открыть историю
  mc.querySelectorAll(".sm-open-history").forEach((btn) => {
    btn.addEventListener("click", showFullHistory);
  });

  // Нажать на операцию — редактировать/удалить
  mc.querySelectorAll(".sm-op-row").forEach((row) => {
    row.addEventListener("click", () =>
      openEditModal(parseInt(row.dataset.idx)),
    );
    row.addEventListener(
      "touchstart",
      () => {
        row.style.background = "rgba(167,139,250,0.12)";
      },
      { passive: true },
    );
    row.addEventListener(
      "touchend",
      () => {
        row.style.background = "";
      },
      { passive: true },
    );
  });

  // Клик на chip дохода/расхода/нач.суммы в упрощённом режиме
  mc.querySelectorAll(".sm-chip-tap").forEach((chip) => {
    chip.style.cursor = "pointer";
    chip.addEventListener("click", () => {
      const type = chip.dataset.type;
      haptic("light");
      if (type === "salary") {
        openSalaryModal();
        return;
      }
      if (type === "income" || type === "expense") {
        currentFilter = type;
        // Перерисовать список операций и прокрутить
        renderSimpleHome();
        setTimeout(() => {
          const opsList = document.querySelector(".sm-ops-list, .sm-empty");
          if (opsList)
            opsList.scrollIntoView({ behavior: "smooth", block: "start" });
          showToast(
            type === "income"
              ? t("toastIncomeFilter")
              : t("toastExpenseFilter"),
            "success",
          );
        }, 100);
      }
    });
    chip.addEventListener(
      "touchstart",
      () => {
        chip.style.transform = "scale(.93)";
      },
      { passive: true },
    );
    chip.addEventListener(
      "touchend",
      () => {
        chip.style.transform = "";
      },
      { passive: true },
    );
  });
}

function renderHome() {
  // setTab уже управляет видимостью heroCardWrap
  // Simple mode redirect
  if (simpleMode) {
    traceApp("renderHome->simpleMode");
    renderSimpleHome();
    return;
  }
  traceApp("renderHome-start", {
    transactions: transactions.length,
    historyFilter,
    currentFilter,
  });
  traceLayoutSnapshot("renderHome:start");
  const sw = !localStorage.getItem("welcomeSeen") && transactions.length === 0;
  let html = createHeroWrapNode().outerHTML;
  if (sw)
    html += `<div class="welcome-tip"><div class="welcome-tip-icon">👋</div><div class="welcome-tip-text"><h3>${t("welcomeTitle")}</h3><p>${t("welcomeText")}</p><button class="welcome-tip-close" id="welcomeClose">${t("welcomeClose")}</button></div></div>`;
  html += `<div id="balanceSummaryContainer"></div><div id="searchContainer"></div>`;

  // Фильтр по времени
  html += `<div class="history-time-filter">
    <span class="htf-label">${t("filterLabel")}</span>
    <div class="htf-btns">
      ${["allTime", "today", "yesterday", "twoDaysAgo", "thisWeek", "thisMonth"].map((f) => `<button class="htf-btn${historyFilter === f ? " active" : ""}" data-hf="${f}">${t("filter" + f.charAt(0).toUpperCase() + f.slice(1))}</button>`).join("")}
    </div>
  </div>`;

  html += `<div class="history-btn-wrap"><button class="history-btn" id="showAllHistoryBtn">${t("allHistory")}</button><div class="history-btn-hint">💡 ${t("historyHint")}</div></div><div id="opsList"></div>`;
  document.getElementById("mainContent").innerHTML = html;
  document.getElementById("mainContent").classList.add("tab-anim");
  restoreHomeHeroIfNeeded();
  updateTopBlocks();
  attachAppTraceObservers();
  traceApp("renderHome-done", {
    heroExists: !!document.getElementById("heroCardWrap"),
    heroParent:
      document.getElementById("heroCardWrap")?.parentElement?.id ||
      document.getElementById("heroCardWrap")?.parentElement?.className ||
      null,
  });
  traceLayoutSnapshot("renderHome:done");

  // Поиск
  if (!document.getElementById("searchInput")) {
    const sc = document.getElementById("searchContainer");
    if (sc) {
      sc.innerHTML = `<div class="search-container"><div class="search-input-wrapper"><span class="search-icon">🔍</span><input type="text" id="searchInput" class="search-input" placeholder="${t("searchPlaceholder")}" autocomplete="off"><button class="search-clear" id="clearSearchBtn" style="display:none;">✕</button></div><div class="search-results-count" id="searchResultsCount"></div></div>`;
      const sf = document.getElementById("searchInput"),
        csb = document.getElementById("clearSearchBtn");
      const dr = debounce(() => renderOpsList(), 200);
      if (sf) {
        sf.addEventListener("input", function () {
          if (csb) csb.style.display = this.value ? "flex" : "none";
          dr();
        });
        sf.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            this.value = "";
            if (csb) csb.style.display = "none";
            renderOpsList();
          }
        });
      }
      if (csb) {
        csb.addEventListener("click", function () {
          if (sf) sf.value = "";
          this.style.display = "none";
          renderOpsList();
        });
      }
    }
  }

  // Фильтр по времени — обработчики
  document.querySelectorAll(".htf-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      historyFilter = btn.dataset.hf;
      document
        .querySelectorAll(".htf-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderOpsList();
    });
  });

  document
    .getElementById("showAllHistoryBtn")
    ?.addEventListener("click", showFullHistory);
  document.getElementById("welcomeClose")?.addEventListener("click", () => {
    localStorage.setItem("welcomeSeen", "1");
    renderHome();
  });
  renderBalanceSummary();
  renderOpsList();
  ensureHomeHeroStable(4, 100);
}

function renderBalanceSummary() {
  const c = document.getElementById("balanceSummaryContainer");
  if (!c) return;
  const si = document.getElementById("searchInput");
  let filtered = [...transactions];
  if (currentFilter === "income")
    filtered = filtered.filter((tx) => tx.type === "income");
  else if (currentFilter === "expense")
    filtered = filtered.filter((tx) => tx.type === "expense");
  const sq = si ? si.value.toLowerCase().trim() : "";
  if (sq)
    filtered = filtered.filter(
      (tx) =>
        (tx.category && tx.category.toLowerCase().includes(sq)) ||
        (tx.note && tx.note.toLowerCase().includes(sq)) ||
        (tx.amountRub && tx.amountRub.toString().includes(sq)),
    );
  const inc = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amountRub, 0);
  const exp = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amountRub, 0);
  const bal = inc - exp;
  c.innerHTML = `<div class="balance-summary">
    <div class="balance-row row-salary" id="salaryRowBtn" role="button" tabindex="0">
      <div class="balance-row-left"><span class="balance-row-dot dot-salary"></span><span class="balance-row-label">${t("salary_label")}</span></div>
      <div><span class="balance-row-value">${fmt(startBalanceRub)}</span><div class="balance-row-sub">${t("editSalaryHint")}</div></div>
    </div>
    <div class="balance-row row-income"><div class="balance-row-left"><span class="balance-row-dot dot-income"></span><span class="balance-row-label">${t("totalIncome")}</span></div><span class="balance-row-value income">+${fmt(inc)}</span></div>
    <div class="balance-row row-expense"><div class="balance-row-left"><span class="balance-row-dot dot-expense"></span><span class="balance-row-label">${t("totalExpense")}</span></div><span class="balance-row-value expense">−${fmt(exp)}</span></div>
    <div class="balance-row row-balance"><div class="balance-row-left"><span class="balance-row-dot dot-balance"></span><span class="balance-row-label">${t("currentBalance")}</span></div><span class="balance-row-value ${bal >= 0 ? "positive" : "negative"}">${fmt(bal)}</span></div>
  </div>`;
  document
    .getElementById("salaryRowBtn")
    ?.addEventListener("click", openSalaryModal);
  document.getElementById("salaryRowBtn")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openSalaryModal();
  });
}

function renderOpsList() {
  const c = document.getElementById("opsList");
  if (!c) return;
  const si = document.getElementById("searchInput");
  const sq = si ? si.value.toLowerCase().trim() : "";
  let filtered = [...transactions];
  if (currentFilter === "income")
    filtered = filtered.filter((tx) => tx.type === "income");
  else if (currentFilter === "expense")
    filtered = filtered.filter((tx) => tx.type === "expense");
  // Фильтр по времени
  filtered = filterByTime(filtered, historyFilter);
  if (sq)
    filtered = filtered.filter(
      (tx) =>
        (tx.category && tx.category.toLowerCase().includes(sq)) ||
        (tx.subcategory && tx.subcategory.toLowerCase().includes(sq)) ||
        (tx.note && tx.note.toLowerCase().includes(sq)) ||
        (tx.amountRub && tx.amountRub.toString().includes(sq)) ||
        (tx.date && tx.date.includes(sq)),
    );
  const rsc = document.getElementById("searchResultsCount");
  if (rsc)
    rsc.textContent = sq
      ? `${t("searchFound") || { ru: "Найдено", en: "Found", ka: "ნაპოვნია" }[currentLang]}: ${filtered.length} ${t("of") || { ru: "из", en: "of", ka: "/ " }[currentLang]} ${transactions.length}`
      : `${filtered.length} ${t("searchRecords")}`;
  let html = "";
  if (currentFilter) {
    html += `<div class="ops-section-header" style="display:flex;justify-content:space-between;align-items:center;"><div class="ops-section-label">${currentFilter === "income" ? "📈 " + t("income") : "📉 " + t("expense")}</div><button id="clearFilterBtn" class="btn-secondary" style="padding:8px 14px;font-size:13px;">✖ ${t("cancel")}</button></div>`;
  } else {
    html += `<div class="ops-section-header"><div class="ops-section-label">${t("recentOpsLabel")}</div><div class="ops-section-hint">💡 ${t("recentOpsHint")}</div></div>`;
  }
  const recent = filtered
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 100);
  if (!recent.length) {
    html += sq
      ? `<div class="empty-block"><div class="empty-emoji">🔍</div><p>Ничего не найдено «${esc(sq)}»</p></div>`
      : `<div class="empty-block" style="padding:56px 24px;text-align:center;">
      <div style="font-size:64px;margin-bottom:14px;opacity:0.6;">💸</div>
      <div style="font-size:17px;font-weight:800;color:var(--text);margin-bottom:8px;">${
        { ru: "Пока пусто", en: "Nothing here yet", ka: "ჯერ ცარიელია" }[
          currentLang
        ] || "No records yet"
      }</div>
      <div style="font-size:14px;color:var(--text-muted);line-height:1.6;">${
        {
          ru: "Нажмите <b style='color:var(--primary)'>+</b> внизу чтобы добавить первую операцию",
          en: "Tap <b style='color:var(--primary)'>+</b> below to add your first transaction",
          ka: "<b style='color:var(--primary)'>+</b> ღილაკი ქვემოთ",
        }[currentLang] || ""
      }</div>
    </div>`;
  } else {
    let lastDate = null;
    html += '<div class="ops-list">';
    recent.forEach((tx) => {
      const idx = transactions.indexOf(tx);
      const txDate = tx.date || today();
      if (txDate !== lastDate) {
        lastDate = txDate;
        html += `<div class="ops-date-group">${getDateGroupLabel(txDate)}</div>`;
      }
      const sign = tx.type === "income" ? "+" : " −";
      const style = getCategoryStyle(tx.category, tx.type);
      let dcat = esc(tx.category);
      if (sq && tx.category.toLowerCase().includes(sq))
        dcat = `<span style="background:var(--gold-pale);border-radius:4px;padding:0 2px;">${esc(tx.category)}</span>`;
      html += `<div class="op-card" data-idx="${idx}" data-type="${tx.type}">
        <div class="op-icon-wrap">${style.icon}</div>
        <div class="op-info" style="flex:1;min-width:0;">
          <div class="op-category" style="font-size:13px;font-weight:700;">${dcat}${tx.subcategory ? ` · <span style="font-weight:400;font-size:11px;">${esc(tx.subcategory)}</span>` : ""}</div>
          ${tx.note ? `<div class="op-note" style="font-size:11px;opacity:.7;">📝 ${esc(tx.note.substring(0, 50))}</div>` : ""}
          ${tx._recurring ? `<div class="op-note" style="font-size:11px;opacity:.7;">🔄 ${t("recurring") || "повтор."}</div>` : ""}
          <div class="op-time" style="font-size:10px;font-weight:600;opacity:.55;margin-top:1px;">${tx.time || ""}</div>
        </div>
        <div class="op-right" style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;">
          <div class="op-amount ${tx.type === "income" ? "income-amount" : tx.type === "salary" ? "salary-amount" : "expense-amount"}" style="font-size:14px;font-weight:800;font-variant-numeric:tabular-nums;">${sign}${fmt(tx.amountRub)}</div>
          <button class="op-delete" data-idx="${idx}" aria-label="${t("ariaDeleteOp")}" style="opacity:0;font-size:14px;padding:4px;cursor:pointer;color:#f87171;">✕</button>
        </div>
      </div>`;
    });
    html += "</div>";
  }
  c.innerHTML = html;
  c.querySelectorAll(".op-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("op-delete")) return;
      openEditModal(parseInt(card.dataset.idx));
    });
  });
  c.querySelectorAll(".op-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      askConfirm(
        t("confirmDelete"),
        () => {
          const _di1 = parseInt(btn.dataset.idx);
          const _dt1 = transactions[_di1];
          transactions.splice(_di1, 1);
          if (_dt1 && _dt1._initial) {
            startBalanceRub = 0;
            localStorage.removeItem("startBalanceRub");
          }
          saveAll();
          updateTopBlocks();
          renderBalanceSummary();
          renderOpsList();
          showToast(t("deleted"));
        },
        { icon: "🗑️" },
      );
    });
  });
  const cfb = document.getElementById("clearFilterBtn");
  if (cfb)
    cfb.addEventListener("click", () => {
      currentFilter = null;
      renderBalanceSummary();
      renderOpsList();
    });
  addSwipeToDelete(c);
}

function addSwipeToDelete(container) {
  let sX = 0,
    sY = 0,
    aC = null,
    aI = null,
    revealEl = null;

  function clearReveal() {
    revealEl?.remove();
    revealEl = null;
  }

  container.querySelectorAll(".op-card").forEach((card) => {
    card.addEventListener(
      "touchstart",
      (e) => {
        sX = e.touches[0].clientX;
        sY = e.touches[0].clientY;
        aC = card;
        aI = parseInt(card.dataset.idx);
        clearReveal();
      },
      { passive: true },
    );

    card.addEventListener(
      "touchmove",
      (e) => {
        if (!aC) return;
        const dx = e.touches[0].clientX - sX;
        const dy = e.touches[0].clientY - sY;
        if (Math.abs(dy) > Math.abs(dx) + 4) {
          aC = null;
          clearReveal();
          return;
        }
        if (dx < -6) {
          const pull = Math.min(Math.abs(dx), 130);
          const pct = Math.min(pull / 100, 1);
          aC.style.transform = `translateX(${-pull}px)`;
          aC.style.transition = "none";
          // Create/update reveal background
          if (!revealEl) {
            revealEl = document.createElement("div");
            revealEl.style.cssText = [
              "position:absolute;top:0;right:0;bottom:0;",
              "border-radius:inherit;",
              "display:flex;align-items:center;justify-content:flex-end;",
              "padding-right:20px;",
              "background:linear-gradient(135deg,#ef4444,#dc2626);",
              "color:#fff;font-size:20px;pointer-events:none;",
              "transition:opacity 0.1s;",
            ].join("");
            revealEl.textContent = "🗑️";
            aC.parentElement.style.position = "relative";
            aC.parentElement.insertBefore(revealEl, aC);
          }
          revealEl.style.width = pull + "px";
          revealEl.style.opacity = pct;
        }
      },
      { passive: true },
    );

    card.addEventListener(
      "touchend",
      (e) => {
        if (!aC) return;
        const dx = e.changedTouches[0].clientX - sX;
        if (dx < -80) {
          aC.style.transform = "translateX(-110%)";
          aC.style.opacity = "0";
          aC.style.transition = "transform .28s ease,opacity .28s ease";
          const cardRef = aC,
            idxRef = aI;
          clearReveal();
          setTimeout(() => {
            askConfirm(
              t("confirmDelete"),
              () => {
                const _dt2 = transactions[idxRef];
                transactions.splice(idxRef, 1);
                if (_dt2 && _dt2._initial) {
                  startBalanceRub = 0;
                  localStorage.removeItem("startBalanceRub");
                }
                saveAll();
                updateTopBlocks();
                renderBalanceSummary();
                renderOpsList();
                showToast(t("deleted"));
              },
              { icon: "🗑️" },
            );
            cardRef.style.transform = "";
            cardRef.style.opacity = "1";
            cardRef.style.transition = "";
            aC = null;
          }, 280);
        } else {
          clearReveal();
          if (aC) {
            aC.style.transform = "";
            aC.style.transition = "transform .2s ease";
            setTimeout(() => {
              if (aC) aC.style.transition = "";
            }, 200);
          }
          aC = null;
        }
      },
      { passive: true },
    );
  });
}

function getOpEmoji(tx) {
  const cat = (tx.category || "").toLowerCase();
  const map = {
    коммунал: "💡",
    продукт: "🛒",
    заём: "🏦",
    банк: "🏦",
    транспорт: "🚌",
    зарплат: "💼",
    подарок: "🎁",
    фриланс: "💻",
    ежемесячн: "📅",
    неожидан: "⚡",
    еда: "🍽️",
    кафе: "☕",
    одежда: "👗",
    здоровь: "💊",
    аптека: "💊",
    спорт: "🏃",
    развлечен: "🎭",
    путешеств: "✈️",
  };
  for (const [k, v] of Object.entries(map)) if (cat.includes(k)) return v;
  return tx.type === "income" ? "💰" : "💸";
}

// ============================================================
// ПОЛНАЯ ИСТОРИЯ
// ============================================================
function showFullHistory() {
  const all = [...transactions].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
  if (!all.length) {
    showToast(t("noOperations").split("\n")[0]);
    return;
  }
  let html = '<div class="history-list">';
  all.forEach((op) => {
    const ri = transactions.indexOf(op),
      sign = op.type === "income" ? "+" : "−";
    html += `<div class="history-item"><div class="history-item-info"><div class="history-item-cat">${getOpEmoji(op)} ${esc(op.category)}${op.subcategory ? ` (${esc(op.subcategory)})` : ""}</div><div class="history-item-meta">${fmtDate(op.date)}${op.note ? " 📝 " + esc(op.note.substring(0, 30)) : ""}</div></div><div class="history-item-amt ${op.type}">${sign}${fmt(op.amountRub)}</div><div class="history-item-btns"><button class="icon-btn edit" data-idx="${ri}">✏️</button><button class="icon-btn delete" data-idx="${ri}">🗑</button></div></div>`;
  });
  html += `</div><div style="margin-top:16px;"><button class="btn-danger" id="clearAllHistoryBtn" style="width:100%">🗑 ${t("clearAllOps")}</button></div>`;
  const modal = createModal("fullHistoryModal", t("allHistory"), html);
  document.body.appendChild(modal);
  openModal("fullHistoryModal");
  modal.querySelectorAll(".icon-btn.edit").forEach((b) =>
    b.addEventListener("click", () => {
      closeModal("fullHistoryModal");
      setTimeout(() => openEditModal(parseInt(b.dataset.idx)), 200);
    }),
  );
  modal.querySelectorAll(".icon-btn.delete").forEach((b) =>
    b.addEventListener("click", () => {
      askConfirm(
        t("confirmDelete"),
        () => {
          const _di3 = parseInt(b.dataset.idx);
          const _dt3 = transactions[_di3];
          transactions.splice(_di3, 1);
          if (_dt3 && _dt3._initial) {
            startBalanceRub = 0;
            localStorage.removeItem("startBalanceRub");
          }
          saveAll();
          updateTopBlocks();
          renderBalanceSummary();
          renderOpsList();
          closeModal("fullHistoryModal");
          setTimeout(showFullHistory, 200);
          showToast(t("deleted"));
        },
        { icon: "🗑️" },
      );
    }),
  );
  document
    .getElementById("clearAllHistoryBtn")
    ?.addEventListener("click", () => {
      askConfirm(
        t("confirmDeleteAll"),
        () => {
          transactions = [];
          saveAll();
          updateTopBlocks();
          renderBalanceSummary();
          renderOpsList();
          closeModal("fullHistoryModal");
          showToast(t("deleted"));
        },
        {
          icon: "⚠️",
          title: t("confirmDeleteAll"),
          yesText: t("yesDeleteAll"),
        },
      );
    });
}

// ============================================================
// DATEPICKER
// ============================================================
function openDatePicker(initialDate, onSelect) {
  // Если дата не передана, всегда берём СЕГОДНЯШНЮЮ локальную дату
  if (!initialDate) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    initialDate = `${yyyy}-${mm}-${dd}`;
  }
  const date = new Date(initialDate + "T12:00:00");
  let vY = date.getFullYear(),
    vM = date.getMonth();
  const months = t("months"),
    weekdays = t("weekdaysShort");
  function rc() {
    const fd = new Date(vY, vM, 1);
    let sd = fd.getDay();
    sd = sd === 0 ? 6 : sd - 1;
    const dim = new Date(vY, vM + 1, 0).getDate();
    let dh = "";
    for (let i = 0; i < sd; i++)
      dh += `<div class="datepicker-day empty"></div>`;
    for (let d = 1; d <= dim; d++) {
      const ds = `${vY}-${String(vM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      dh += `<div class="datepicker-day${initialDate === ds ? " selected" : ""}" data-date="${ds}">${d}</div>`;
    }
    return `<div class="datepicker-header"><button class="datepicker-nav" id="dpPrev">←</button><span class="datepicker-month">${months[vM]} ${vY}</span><button class="datepicker-nav" id="dpNext">→</button></div><div class="datepicker-weekdays">${weekdays.map((w) => `<div class="datepicker-weekday">${w}</div>`).join("")}</div><div class="datepicker-days">${dh}</div>`;
  }
  const modal = createModal(
    "datepickerModal",
    t("pickDate"),
    `<div class="datepicker-content"><div id="dpCal">${rc()}</div><div class="datepicker-actions"><button class="btn-secondary" id="dpCancel">${t("cancel")}</button></div></div>`,
  );
  document.body.appendChild(modal);
  openModal("datepickerModal");
  function upd() {
    document.getElementById("dpCal").innerHTML = rc();
    att();
    document.getElementById("dpPrev").addEventListener("click", () => {
      vM--;
      if (vM < 0) {
        vM = 11;
        vY--;
      }
      upd();
    });
    document.getElementById("dpNext").addEventListener("click", () => {
      vM++;
      if (vM > 11) {
        vM = 0;
        vY++;
      }
      upd();
    });
  }
  function att() {
    document
      .querySelectorAll("#dpCal .datepicker-day[data-date]")
      .forEach((d) =>
        d.addEventListener("click", () => {
          closeModal("datepickerModal");
          onSelect(d.dataset.date);
        }),
      );
  }
  upd();
  document
    .getElementById("dpCancel")
    .addEventListener("click", () => closeModal("datepickerModal"));
}

function openTimePickerCompact(initialTime, onSelect) {
  let hours = 9,
    minutes = 0;
  if (initialTime) {
    const parts = initialTime.split(":");
    hours = parseInt(parts[0]) || 9;
    minutes = parseInt(parts[1]) || 0;
  }

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
      <div style="display:flex;gap:8px;align-items:center;justify-content:center;">
        <div class="field-group" style="margin-bottom:0;flex:0 0 auto;width:80px;">
          <label class="field-label" style="text-align:center;">${t("hours")}</label>
          <input type="number" id="tpHours" class="modal-input" min="0" max="23" value="${hours}" 
            style="font-size:20px;font-weight:700;text-align:center;padding:8px;width:100%;">
        </div>
        <div style="font-size:24px;font-weight:900;color:var(--text-muted);margin-top:18px;">:</div>
        <div class="field-group" style="margin-bottom:0;flex:0 0 auto;width:80px;">
          <label class="field-label" style="text-align:center;">${t("minutes")}</label>
          <input type="number" id="tpMinutes" class="modal-input" min="0" max="59" value="${minutes}"
            style="font-size:20px;font-weight:700;text-align:center;padding:8px;width:100%;">
        </div>
      </div>
      <div class="modal-actions" style="width:100%;margin-top:8px;">
        <button class="btn-secondary" id="tpCancel" style="flex:1;">${t("cancel")}</button>
        <button class="btn-primary" id="tpSave" style="flex:1;">${t("save")}</button>
      </div>
    </div>
  `;

  updateHeroChipLabels(mc);
  forceHeroChipLayout(mc);

  const modal = createModal("timePickerModal", t("chooseTime"), html);
  document.body.appendChild(modal);
  openModal("timePickerModal");

  document.getElementById("tpCancel").onclick = () =>
    closeModal("timePickerModal");
  document.getElementById("tpSave").onclick = () => {
    const h = document
      .getElementById("tpHours")
      .value.toString()
      .padStart(2, "0");
    const m = document
      .getElementById("tpMinutes")
      .value.toString()
      .padStart(2, "0");
    closeModal("timePickerModal");
    onSelect(`${h}:${m}`);
  };
}

// ============================================================
// МОДАЛКА РЕДАКТИРОВАНИЯ ОПЕРАЦИИ
// ============================================================
function openEditModal(idx) {
  const op = transactions[idx];
  if (!op) return;
  editingOpIndex = idx;
  const html = `
    <div class="field-group"><label class="field-label">${t("category")}</label><input type="text" id="editCategory" class="modal-input" value="${esc(op.category)}"></div>
    <div class="field-group"><label class="field-label">${t("amount")} (${sym()})</label><input type="number" id="editAmount" class="modal-input" step="any" min="0.01" value="${toDisp(op.amountRub).toFixed(2)}" inputmode="decimal"></div>
    <div class="field-group"><label class="field-label">${t("date")}</label><div class="date-input-wrapper"><input type="text" id="editDateDisplay" class="modal-input" readonly value="${fmtDate(op.date || today())}"><input type="hidden" id="editDate" value="${op.date || today()}"><button type="button" class="datepicker-btn" id="editDateBtn">📅</button></div></div>
    <div class="field-group"><label class="field-label">${t("note")}</label><textarea id="editNote" class="modal-textarea" rows="2">${esc(op.note || "")}</textarea></div>
    <div class="modal-actions"><button class="btn-danger" id="deleteItemBtn">🗑 ${t("delete")}</button><button class="btn-primary" id="saveEditBtn">💾 ${t("save")}</button></div>`;
  const modal = createModal("editModal", t("editOperation"), html);
  document.body.appendChild(modal);
  openModal("editModal");
  document.getElementById("editDateBtn").addEventListener("click", () =>
    openDatePicker(document.getElementById("editDate").value, (d) => {
      document.getElementById("editDate").value = d;
      document.getElementById("editDateDisplay").value = fmtDate(d);
    }),
  );
  document.getElementById("saveEditBtn")?.addEventListener("click", () => {
    const a = parseFloat(document.getElementById("editAmount").value);
    if (isNaN(a) || a <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    transactions[editingOpIndex].category =
      document.getElementById("editCategory").value.trim() || "—";
    transactions[editingOpIndex].amountRub = toRub(a);
    transactions[editingOpIndex].date =
      document.getElementById("editDate").value;
    transactions[editingOpIndex].note = document
      .getElementById("editNote")
      .value.trim();
    saveAll();
    updateTopBlocks();
    renderBalanceSummary();
    renderOpsList();
    closeModal("editModal");
    showToast(t("saved"));
  });
  document.getElementById("deleteItemBtn")?.addEventListener("click", () => {
    askConfirm(
      t("confirmDelete"),
      () => {
        const _dt4 = transactions[editingOpIndex];
        transactions.splice(editingOpIndex, 1);
        if (_dt4 && _dt4._initial) {
          startBalanceRub = 0;
          localStorage.removeItem("startBalanceRub");
        }
        saveAll();
        updateTopBlocks();
        renderBalanceSummary();
        renderOpsList();
        closeModal("editModal");
        showToast(t("deleted"));
      },
      { icon: "🗑️" },
    );
  });
}

// ============================================================
// МОДАЛКА ЗАРПЛАТЫ
// ============================================================
function openSalaryModal() {
  const initialAmount = toDisp(startBalanceRub).toFixed(2);
  const html = `
    <div class="section-hint">${t("salaryModalHint")}</div>
    <div class="field-group">
      <label class="field-label">${t("salary_label")} (${sym()})</label>
      <input type="text" id="salaryAmount" class="modal-input" value="${initialAmount}" inputmode="decimal" autofocus>
    </div>
    <div class="quick-numpad">
      <div class="numpad-row"><button class="numpad-btn" data-salary-numpad="1">1</button><button class="numpad-btn" data-salary-numpad="2">2</button><button class="numpad-btn" data-salary-numpad="3">3</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-salary-numpad="4">4</button><button class="numpad-btn" data-salary-numpad="5">5</button><button class="numpad-btn" data-salary-numpad="6">6</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-salary-numpad="7">7</button><button class="numpad-btn" data-salary-numpad="8">8</button><button class="numpad-btn" data-salary-numpad="9">9</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-salary-numpad="0">0</button><button class="numpad-btn" data-salary-numpad=".">.</button><button class="numpad-btn clear" data-salary-numpad="backspace">⌫</button></div>
      <div class="numpad-row"><button class="numpad-btn clear" data-salary-numpad="clear">C</button></div>
    </div>
    <div class="modal-actions"><button class="btn-primary" id="saveSalaryBtn">💾 ${t("save")}</button></div>`;
  const modal = createModal("salaryModal", t("editBalance"), html);
  document.body.appendChild(modal);
  openModal("salaryModal");
  let salaryDraft = initialAmount;
  const salaryInput = document.getElementById("salaryAmount");
  modal.querySelectorAll("[data-salary-numpad]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const v = btn.dataset.salaryNumpad;
      if (v === "clear") salaryDraft = "";
      else if (v === "backspace") salaryDraft = salaryDraft.slice(0, -1);
      else if (v === ".") {
        if (!salaryDraft.includes(".")) salaryDraft += v;
      } else salaryDraft += v;
      if (salaryInput) salaryInput.value = salaryDraft;
    }),
  );
  if (salaryInput) {
    salaryInput.addEventListener("input", (e) => {
      salaryDraft = e.target.value;
    });
  }
  document.getElementById("saveSalaryBtn")?.addEventListener("click", () => {
    const v = parseFloat(document.getElementById("salaryAmount").value);
    if (isNaN(v) || v < 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    startBalanceRub = toRub(v);

    // Удаляем ВСЕ старые операции с _initial
    transactions = transactions.filter((tx) => !tx._initial);

    // Если новая сумма > 0 – добавляем одну запись-якорь
    if (startBalanceRub > 0) {
      transactions.push({
        type: "income",
        category: t("initialCategory"),
        subcategory: null,
        amountRub: startBalanceRub,
        date: today(),
        note: t("initialCapital"),
        _initial: true,
      });
    }

    saveAll();
    updateTopBlocks();
    renderBalanceSummary();
    renderOpsList();
    closeModal("salaryModal");
    if (simpleMode) renderHome();
    showToast(t("saved"));
  });
}

// ============================================================
// МОДАЛКА КАТЕГОРИЙ
// ============================================================
function openEditCategoryModal(cat, isIncome) {
  const catObj = isIncome ? incomeCategories : categories;
  const cur =
    categoryCustomizations[cat] ||
    categoryIcons[cat] ||
    (isIncome
      ? { icon: "💰", color: "#22c55e" }
      : { icon: "💸", color: "#ef4444" });
  const icons = [
    "💰",
    "💸",
    "💡",
    "🛒",
    "🏦",
    "📅",
    "🚌",
    "⚡",
    "💼",
    "🎁",
    "💻",
    "🍔",
    "☕",
    "🍕",
    "🚗",
    "✈️",
    "🚲",
    "⛽",
    "🏠",
    "🔥",
    "💧",
    "📱",
    "💊",
    "📚",
    "⚽",
    "🎬",
    "🎮",
    "🐶",
    "👕",
    "💄",
    "🔧",
    "📌",
    "⭐",
    "❤️",
    "✨",
    "🏃",
    "🎭",
    "🛍️",
    "🎓",
    "🧴",
    "🏥",
  ];
  const html = `
    <div class="field-group"><label class="field-label">${t("catNameLabel")}</label><input type="text" id="editCatName" class="modal-input" value="${esc(cat)}"></div>
    <div class="field-group"><label class="field-label">${t("iconLabel")}</label><select id="editCatIcon" class="modal-select">${icons.map((i) => `<option value="${i}"${i === cur.icon ? " selected" : ""}>${i}</option>`).join("")}</select></div>
    <div class="field-group"><label class="field-label">${t("colorLabel")}</label><input type="color" id="editCatColor" class="modal-input" value="${cur.color}"></div>
    <div class="modal-actions"><button class="btn-secondary" id="cancelEditCat">${t("cancel")}</button><button class="btn-primary" id="saveEditCat">${t("save")}</button></div>`;
  const modal = createModal("editCategoryModal", t("editCatTitle"), html);
  document.body.appendChild(modal);
  openModal("editCategoryModal");
  document
    .getElementById("cancelEditCat")
    .addEventListener("click", () => closeModal("editCategoryModal"));
  document.getElementById("saveEditCat").addEventListener("click", () => {
    const nn = document.getElementById("editCatName").value.trim();
    const ni = document.getElementById("editCatIcon").value,
      nc = document.getElementById("editCatColor").value;
    if (!nn) {
      showToast(t("enterAmount"), "error");
      return;
    }
    if (nn !== cat && catObj[nn]) {
      showToast(t("alreadyExists"), "error");
      return;
    }
    if (nn !== cat) {
      catObj[nn] = catObj[cat];
      delete catObj[cat];
      if (categoryCustomizations[cat]) {
        categoryCustomizations[nn] = categoryCustomizations[cat];
        delete categoryCustomizations[cat];
      }
    }
    categoryCustomizations[nn] = { icon: ni, color: nc };
    saveAll();
    renderCategories();
    closeModal("editCategoryModal");
    showToast(t("saved"));
  });
}

// ============================================================
// МОДАЛКА ДОБАВЛЕНИЯ
// ============================================================
function openAddModal(defaultType = "expense", presetCategory = null) {
  if (document.getElementById("addModal")) return;
  if (Date.now() - addModalLastClosedAt < 450) return;
  addModalCommitted = false;
  traceApp("openAddModal", {
    defaultType,
    presetCategory,
    currentTab,
    simpleMode,
  });
  const eo =
    `<option value="">${t("selectCategory")}</option>` +
    Object.keys(window.categories)
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
  const io =
    `<option value="">${t("selectCategory")}</option>` +
    Object.keys(window.incomeCategories)
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
  let ca = "";
  const html = `
    <div id="addModalTopAnchor" style="height:1px;"></div>
    <div class="field-group"><label class="field-label">${t("type")}</label><div class="type-toggle"><button class="type-btn expense ${defaultType === "expense" ? "active" : ""}" data-type="expense">${t("expenseType")}</button><button class="type-btn income ${defaultType === "income" ? "active" : ""}" data-type="income">${t("incomeType")}</button></div></div>
    <div class="field-group"><label class="field-label" id="catLabel">${defaultType === "expense" ? t("expCategory") : t("incCategory")}</label><select id="addCategorySelect" class="modal-select">${defaultType === "expense" ? eo : io}</select></div>
    <div class="field-group" id="addSubcatDiv" style="display:none"><label class="field-label">${t("subcategory")}</label><select id="addSubcatSelect" class="modal-select"></select></div>
    <div class="field-group"><label class="field-label">${t("amount")} (${sym()})</label><input type="text" id="addAmount" class="modal-input" placeholder="0.00" inputmode="decimal"></div>
    <div class="quick-numpad">
      <div class="numpad-row"><button class="numpad-btn" data-numpad="1">1</button><button class="numpad-btn" data-numpad="2">2</button><button class="numpad-btn" data-numpad="3">3</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-numpad="4">4</button><button class="numpad-btn" data-numpad="5">5</button><button class="numpad-btn" data-numpad="6">6</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-numpad="7">7</button><button class="numpad-btn" data-numpad="8">8</button><button class="numpad-btn" data-numpad="9">9</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-numpad="0">0</button><button class="numpad-btn" data-numpad=".">.</button><button class="numpad-btn clear" data-numpad="backspace">⌫</button></div>
      <div class="numpad-row"><button class="numpad-btn clear" data-numpad="clear">C</button></div>
    </div>
    <div id="suggestionsBlock" class="suggestions-block" style="margin-top:12px;"><div class="suggestions-title">${t("quickSuggestions")}</div><div id="suggestionsList" class="suggestions-list"></div></div>
    <div class="field-group"><label class="field-label">${t("date")}</label><div class="date-input-wrapper"><input type="text" id="addDateDisplay" class="modal-input" readonly value="${fmtDate(today())}"><input type="hidden" id="addDate" value="${today()}"><button class="datepicker-btn" id="addDateBtn">📅</button></div><div class="quick-dates"><button type="button" class="quick-date-btn" data-qd="today">${t("today")}</button><button type="button" class="quick-date-btn" data-qd="yesterday">${t("yesterday")}</button><button type="button" class="quick-date-btn" data-qd="startOfMonth">${t("startOfMonth")}</button></div></div>
    <div class="field-group"><label class="field-label">${t("note")}</label><textarea id="addNote" class="modal-textarea" rows="2" placeholder="${t("noteHint")}"></textarea></div>
    <div class="modal-actions" style="flex-wrap:wrap;gap:8px;"><button class="btn-secondary" id="saveAsTemplateBtn">${t("saveAsTemplate")}</button><button class="btn-primary" id="saveAddBtn">✓ ${t("add")}</button></div>`;
  const modal = createModal("addModal", t("newOperation"), html);
  document.body.appendChild(modal);
  openModal("addModal");
  addType = defaultType;
  const resetAddModalViewport = () => {
    const modalBody = modal.querySelector(".modal-body");
    const sheet = modal.querySelector(".add-modal-sheet");
    const topAnchor = modal.querySelector("#addModalTopAnchor");
    if (modalBody) {
      modalBody.scrollTop = 0;
      if (typeof modalBody.scrollTo === "function") {
        modalBody.scrollTo({ top: 0, behavior: "instant" });
      }
    }
    if (topAnchor && typeof topAnchor.scrollIntoView === "function") {
      topAnchor.scrollIntoView({ block: "start", inline: "nearest" });
    }
    if (sheet && !sheet.classList.contains("dragging")) {
      sheet.style.transform = "";
    }
  };

  // Начальная установка категорий
  document.getElementById("catLabel").textContent =
    addType === "expense" ? t("expCategory") : t("incCategory");
  document.getElementById("addCategorySelect").innerHTML =
    addType === "expense" ? eo : io;

  // Предустановка категории (из быстрых пилюль упрощённого режима)
  if (presetCategory) {
    const sel = document.getElementById("addCategorySelect");
    if (sel) {
      const optFound = [...sel.options].find(
        (o) =>
          o.value === presetCategory ||
          o.value.includes(presetCategory.replace(/^\S+\s/, "")),
      );
      if (optFound) sel.value = optFound.value;
    }
  }

  modal.querySelectorAll("[data-numpad]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const v = btn.dataset.numpad;
      if (v === "clear") ca = "";
      else if (v === "backspace") ca = ca.slice(0, -1);
      else if (v === ".") {
        if (!ca.includes(".")) ca += v;
      } else ca += v;
      const af = document.getElementById("addAmount");
      if (af) af.value = ca;
    }),
  );
  const af = document.getElementById("addAmount");
  if (af) af.addEventListener("input", (e) => (ca = e.target.value));
  document.getElementById("addDateBtn").addEventListener("click", () =>
    openDatePicker(document.getElementById("addDate").value, (d) => {
      document.getElementById("addDate").value = d;
      document.getElementById("addDateDisplay").value = fmtDate(d);
    }),
  );
  document.querySelectorAll(".quick-date-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      let nd = new Date();
      if (btn.dataset.qd === "yesterday") nd.setDate(nd.getDate() - 1);
      else if (btn.dataset.qd === "startOfMonth")
        nd = new Date(nd.getFullYear(), nd.getMonth(), 1);
      const ds = nd.toISOString().slice(0, 10);
      document.getElementById("addDate").value = ds;
      document.getElementById("addDateDisplay").value = fmtDate(ds);
    }),
  );
  modal.querySelectorAll(".type-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      addType = btn.dataset.type;
      modal
        .querySelectorAll(".type-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("catLabel").textContent =
        addType === "expense" ? t("expCategory") : t("incCategory");
      document.getElementById("addCategorySelect").innerHTML =
        addType === "expense" ? eo : io;
      document.getElementById("addSubcatDiv").style.display = "none";
    }),
  );
  document.getElementById("addCategorySelect").onchange = () => {
    const cat = document.getElementById("addCategorySelect").value;
    const sc =
      addType === "expense"
        ? window.categories[cat]?.subcats || []
        : window.incomeCategories[cat]?.subcats || [];
    const sd = document.getElementById("addSubcatDiv"),
      ss = document.getElementById("addSubcatSelect");
    if (sc.length) {
      ss.innerHTML =
        `<option value="">${t("noSubcategory")}</option>` +
        sc.map((s) => `<option value="${s}">${s}</option>`).join("");
      sd.style.display = "block";
    } else sd.style.display = "none";
  };
  document.getElementById("saveAddBtn")?.addEventListener("click", () => {
    const cat = document.getElementById("addCategorySelect").value;
    const sub = document.getElementById("addSubcatSelect")?.value || "";
    const amt = parseFloat(document.getElementById("addAmount").value);
    const date = document.getElementById("addDate").value;
    const note = document.getElementById("addNote").value.trim();
    if (!cat) {
      showToast(t("selectCategoryFirst"), "error");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    if (addType === "expense" && categoryBudgets[cat]) {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const spent = transactions
        .filter(
          (tx) =>
            tx.type === "expense" &&
            tx.category === cat &&
            tx.date &&
            new Date(tx.date + "T00:00:00") >= monthStart,
        )
        .reduce((s, tx) => s + tx.amountRub, 0);
      const limit = categoryBudgets[cat];
      const newSpent = spent + toRub(amt);
      if (newSpent > limit) {
        const msg =
          { ru: "Продолжить?", en: "Continue?", ka: "გაგრძელება?" }[
            currentLang
          ] || "Continue?";
        if (!confirm(t("budgetOverLimit") + " " + fmt(limit) + ". " + msg))
          return;
      } else if (newSpent / limit >= 0.8) {
        const remaining = limit - newSpent;
        showToast(
          t("budgetWarning80") +
            " · " +
            fmt(remaining) +
            " " +
            t("budgetWarning80Desc"),
          "error",
          3500,
        );
      }
    }
    const tx = {
      type: addType,
      category: cat,
      subcategory: sub || null,
      amountRub: toRub(amt),
      date,
      note: note || null,
    };
    traceApp("addModal-save", {
      type: addType,
      category: cat,
      amount: amt,
    });
    addModalCommitted = true;
    transactions.push(tx);
    updateFrequentStats(tx);
    saveAll();
    updateTopBlocks();
    renderBalanceSummary();
    renderOpsList();
    closeModal("addModal");
    setTimeout(() => {
      updateTopBlocks();
      renderBalanceSummary();
      renderOpsList();
      // Если простой режим — перерисовываем главную страницу
      if (simpleMode) {
        renderHome();
      }
      setTimeout(() => {
        if (tx.type === "income") showCoinAnimation();
        else showMoneyFlyEffect();
      }, 380);
    }, 50);
    showToast(addType === "income" ? t("incomeAdded") : t("expenseAdded"));
  });
  document
    .getElementById("saveAsTemplateBtn")
    ?.addEventListener("click", () => {
      const cat = document.getElementById("addCategorySelect").value;
      const sub = document.getElementById("addSubcatSelect")?.value || "";
      const amt = parseFloat(document.getElementById("addAmount").value);
      const note = document.getElementById("addNote").value.trim();
      if (!cat || isNaN(amt) || amt <= 0) {
        showToast(t("chooseCategoryAndAmountFirst"), "error");
        return;
      }
      addUserTemplate({
        name: `${cat} ${amt} ${sym()}`,
        type: addType,
        category: cat,
        subcategory: sub,
        amountRub: toRub(amt),
        note,
      });
      showToast(t("templateSavedToast"));
      updateSuggestions();
    });
  updateSuggestions();
  resetAddModalViewport();
  requestAnimationFrame(resetAddModalViewport);
  setTimeout(resetAddModalViewport, 80);
  setTimeout(resetAddModalViewport, 220);
  setTimeout(resetAddModalViewport, 420);
}

// ============================================================
// СТАТИСТИКА
// ============================================================
function renderStats() {
  const content = document.getElementById("mainContent");
  content.innerHTML = `<div class="stats-loading"><div class="spinner"></div><p>${t("loading")}</p></div>`;
  setTimeout(() => {
    if (!transactions.length) {
      content.innerHTML = `<div class="stats-empty-state"><div class="stats-empty-icon">📊</div><div class="stats-empty-title">${t("noStatsYet").split("\n")[0]}</div></div>`;
      injectStatsStyles();
      return;
    }
    const periodHtml = `<div class="stats-period-bar"><span class="stats-period-label">${t("periodFilter")}</span><div class="stats-period-btns">${["thisMonth", "lastMonth", "allTime"].map((p) => `<button class="stats-period-btn${statsPeriod === p ? " active" : ""}" data-period="${p}">${t("period" + p.charAt(0).toUpperCase() + p.slice(1))}</button>`).join("")}</div></div>`;
    const ptx = getTransactionsForPeriod(statsPeriod);
    const ptxPrev =
      statsPeriod === "thisMonth" ? getTransactionsForPeriod("lastMonth") : [];
    let inc = 0,
      exp = 0;
    const catExp = {},
      catInc = {},
      monthlyData = {};
    for (const tx of ptx) {
      if (tx.type === "income") {
        inc += tx.amountRub;
        catInc[tx.category] = (catInc[tx.category] || 0) + tx.amountRub;
      } else {
        exp += tx.amountRub;
        catExp[tx.category] = (catExp[tx.category] || 0) + tx.amountRub;
      }
      if (tx._initial && tx.type === "income") continue;
      const mo = (tx.date || today()).slice(0, 7);
      if (!monthlyData[mo]) monthlyData[mo] = { inc: 0, exp: 0 };
      if (tx.type === "income") monthlyData[mo].inc += tx.amountRub;
      else monthlyData[mo].exp += tx.amountRub;
    }
    // Баланс всего времени
    let incAll = 0,
      expAll = 0;
    for (const tx of transactions) {
      if (tx.type === "income") incAll += tx.amountRub;
      else expAll += tx.amountRub;
    }
    const bal = incAll - expAll;
    const totalFlow = inc,
      spentPct =
        totalFlow > 0 ? Math.min(100, Math.round((exp / totalFlow) * 100)) : 0;
    const savedAmt = totalFlow - exp,
      savedPct =
        totalFlow > 0
          ? Math.max(0, Math.round((savedAmt / totalFlow) * 100))
          : 0;
    const nInc = ptx.filter(
        (tx) => tx.type === "income" && !tx._initial,
      ).length,
      nExp = ptx.filter((tx) => tx.type === "expense").length;
    const topExp = Object.entries(catExp)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    const topInc = Object.entries(catInc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    const mwa = Object.keys(monthlyData)
      .filter((m) => monthlyData[m].inc > 0 || monthlyData[m].exp > 0)
      .sort();
    const allM = mwa.slice(-6);
    const maxB =
      allM.length > 0
        ? Math.max(
            ...allM.map((m) =>
              Math.max(monthlyData[m].inc, monthlyData[m].exp),
            ),
          )
        : 1;
    let sE = "",
      sT = "",
      sD = "",
      sC = "";
    if (exp > totalFlow && totalFlow > 0) {
      sE = "🚨";
      sT = t("statsBudgetMinus");
      sD = t("statsBudgetMinusDesc") + " " + fmt(exp - totalFlow);
      sC = "danger";
    } else if (savedPct >= 30) {
      sE = "🌟";
      sT = t("statsBudgetGreat");
      sD = t("statsBudgetGreatDesc").replace("%", savedPct + "%");
      sC = "healthy";
    } else if (savedPct >= 10) {
      sE = "✅";
      sT = t("statsBudgetOk");
      sD = t("statsBudgetOkDesc").replace("%", savedPct + "%");
      sC = "healthy";
    } else {
      sE = "⚠️";
      sT = t("statsBudgetAlmost");
      sD = t("statsBudgetAlmostDesc").replace("%", savedPct + "%");
      sC = "warning";
    }
    const tips = [];
    if (topExp.length) {
      const tc = topExp[0],
        tp = exp > 0 ? Math.round((tc[1] / exp) * 100) : 0;
      if (tp > 40) tips.push(`💡 «${tc[0]}» — ${tp}% ${t("statsTipHighCat")}`);
    }
    if (savedPct < 10 && ptx.length > 3)
      tips.push("💡 " + t("statsTipSaveLow"));
    if (nExp > 0 && nInc === 0) tips.push("💡 " + t("statsTipNoIncome"));
    if (savedPct >= 20) tips.push("💡 " + t("statsTipGoodSaving"));
    const gC =
      savedPct >= 20
        ? "var(--income-color)"
        : savedPct >= 10
          ? "var(--gold)"
          : "var(--expense-color)";
    const months = t("months");
    let chartBars = "";
    allM.forEach((m) => {
      const d = monthlyData[m];
      const iH = Math.round((toDisp(d.inc) / toDisp(maxB)) * 64),
        eH = Math.round((toDisp(d.exp) / toDisp(maxB)) * 64);
      const [, mn] = m.split("-");
      const lbl = months[parseInt(mn) - 1]?.slice(0, 3) || m.slice(5);
      chartBars += `<div class="stat-chart-col"><div class="stat-chart-bars" style="display:flex;align-items:flex-end;gap:3px;height:80px"><div class="stat-chart-bar inc" style="height:${iH}px;min-width:10px" title="+${fmt(d.inc)}"></div><div class="stat-chart-bar exp" style="height:${eH}px;min-width:10px" title="−${fmt(d.exp)}"></div></div><div class="stat-chart-label">${lbl}</div></div>`;
    });
    const isDME = document.body.classList.contains("dark");
    const CE = isDME
      ? ["#f87171", "#fb923c", "#fbbf24", "#f472b6", "#a78bfa", "#60a5fa"]
      : ["#dc2626", "#ea580c", "#d97706", "#db2777", "#7c3aed", "#1d4ed8"];
    let ceR = "";
    topExp.forEach(([cat, amt], i) => {
      const p = exp > 0 ? Math.round((amt / exp) * 100) : 0,
        cl = CE[i] || CE[CE.length - 1];
      ceR += `<div class="stat-cat-row"><div class="stat-cat-dot" style="background:${cl}"></div><div class="stat-cat-info"><div class="stat-cat-top"><span class="stat-cat-name">${getOpEmoji({ type: "expense", category: cat })} ${esc(cat)}</span><span class="stat-cat-amount" style="color:${cl}">−${fmt(amt)}</span></div><div class="stat-cat-bar-wrap"><div class="stat-cat-bar" style="width:${p}%;background:${cl}"></div></div></div><div class="stat-cat-pct" style="color:${cl}">${p}%</div></div>`;
    });
    const isDM = document.body.classList.contains("dark");
    const CI = isDM
      ? ["#5eead4", "#34d399", "#6ee7b7", "#a7f3d0"]
      : ["#16a34a", "#15803d", "#166534", "#14532d"];
    let ciR = "";
    topInc.forEach(([cat, amt], i) => {
      const p = inc > 0 ? Math.round((amt / inc) * 100) : 0,
        cl = CI[i] || CI[CI.length - 1];
      ciR += `<div class="stat-cat-row"><div class="stat-cat-dot" style="background:${cl}"></div><div class="stat-cat-info"><div class="stat-cat-top"><span class="stat-cat-name">${getOpEmoji({ type: "income", category: cat })} ${esc(cat)}</span><span class="stat-cat-amount" style="color:${cl}">+${fmt(amt)}</span></div><div class="stat-cat-bar-wrap"><div class="stat-cat-bar" style="width:${p}%;background:${cl}"></div></div></div><div class="stat-cat-pct" style="color:${cl}">${p}%</div></div>`;
    });
    // Пирог
    const pd = Object.entries(catExp)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const pt = pd.reduce((s, [, a]) => s + a, 0);
    let pieSvg = "",
      legHtml = "";
    if (pd.length) {
      let cum = 0;
      const pc = document.body.classList.contains("dark")
        ? ["#f87171", "#fb923c", "#fbbf24", "#f472b6", "#a78bfa"]
        : ["#dc2626", "#ea580c", "#d97706", "#db2777", "#7c3aed"];
      pd.forEach(([cat, amt], idx) => {
        const pct = (amt / pt) * 100,
          cl = pc[idx] || pc[pc.length - 1];
        if (pd.length === 1 || pct >= 99.99) {
          pieSvg += `<circle cx="50" cy="50" r="40" fill="${cl}" stroke="var(--card-bg)" stroke-width="1.5" class="pie-slice" style="animation:pieIn .8s ease forwards;animation-delay:${idx * 0.1}s;opacity:0;transform-origin:50% 50%;"/>`;
        } else {
          const sA = cum * 3.6,
            eA = (cum + pct) * 3.6,
            la = pct > 50 ? 1 : 0;
          const x1 = 50 + 40 * Math.cos(((sA - 90) * Math.PI) / 180),
            y1 = 50 + 40 * Math.sin(((sA - 90) * Math.PI) / 180),
            x2 = 50 + 40 * Math.cos(((eA - 90) * Math.PI) / 180),
            y2 = 50 + 40 * Math.sin(((eA - 90) * Math.PI) / 180);
          pieSvg += `<path d="M 50 50 L ${x1} ${y1} A 40 40 0 ${la} 1 ${x2} ${y2} Z" fill="${cl}" stroke="var(--card-bg)" stroke-width="1.5" class="pie-slice" style="animation:pieIn .8s ease forwards;animation-delay:${idx * 0.1}s;opacity:0;transform-origin:50% 50%;"></path>`;
        }
        cum += pct;
        legHtml += `<div class="pie-legend-item"><div class="pie-legend-color" style="background:${cl}"></div><span class="pie-legend-name">${esc(cat)}</span><span class="pie-legend-value">${fmt(amt)} (${pct.toFixed(1)}%)</span></div>`;
      });
    } else {
      pieSvg = `<circle cx="50" cy="50" r="40" fill="var(--cream-dark)"/>`;
      legHtml = `<div class="pie-legend-item">${t("noStatsYet").split("\n")[0]}</div>`;
    }
    // Income pie chart
    const incPd = Object.entries(catInc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const incPt = incPd.reduce((s, [, a]) => s + a, 0);
    let incPieSvg = "",
      incLegHtml = "";
    const incPc = document.body.classList.contains("dark")
      ? ["#5eead4", "#34d399", "#6ee7b7", "#4ade80", "#86efac"]
      : ["#16a34a", "#15803d", "#166534", "#14532d", "#052e16"];
    if (incPd.length) {
      let cum2 = 0;
      incPd.forEach(([cat, amt], idx) => {
        const pct = (amt / incPt) * 100,
          cl = incPc[idx] || incPc[incPc.length - 1];
        if (incPd.length === 1 || pct >= 99.99) {
          incPieSvg += `<circle cx="50" cy="50" r="40" fill="${cl}" stroke="var(--card-bg)" stroke-width="1.5"/>`;
        } else {
          const sA = cum2 * 3.6,
            eA = (cum2 + pct) * 3.6,
            la = pct > 50 ? 1 : 0;
          const x1 = 50 + 40 * Math.cos(((sA - 90) * Math.PI) / 180),
            y1 = 50 + 40 * Math.sin(((sA - 90) * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos(((eA - 90) * Math.PI) / 180),
            y2 = 50 + 40 * Math.sin(((eA - 90) * Math.PI) / 180);
          incPieSvg += `<path d="M 50 50 L ${x1} ${y1} A 40 40 0 ${la} 1 ${x2} ${y2} Z" fill="${cl}" stroke="var(--card-bg)" stroke-width="1.5" style="animation:pieIn .8s ease forwards;animation-delay:${idx * 0.1}s;opacity:0;transform-origin:50% 50%;"></path>`;
        }
        cum2 += pct;
        incLegHtml += `<div class="pie-legend-item"><div class="pie-legend-color" style="background:${cl}"></div><span class="pie-legend-name">${esc(cat)}</span><span class="pie-legend-value">+${fmt(amt)}</span></div>`;
      });
    } else {
      incPieSvg = `<circle cx="50" cy="50" r="40" fill="var(--cream-dark)"/>`;
      incLegHtml = `<div class="pie-legend-item">${t("noStatsYet").split("\n")[0]}</div>`;
    }

    // Тренд по категориям
    let prevCatExp = {};
    for (const tx of ptxPrev) {
      if (tx.type === "expense")
        prevCatExp[tx.category] = (prevCatExp[tx.category] || 0) + tx.amountRub;
    }
    let trendHtml = "";
    if (statsPeriod === "thisMonth" && Object.keys(prevCatExp).length) {
      const allCats = [
        ...new Set([...Object.keys(catExp), ...Object.keys(prevCatExp)]),
      ];
      const rows = allCats
        .map((cat) => {
          const cur = catExp[cat] || 0,
            prev = prevCatExp[cat] || 0,
            diff = cur - prev,
            pct = prev > 0 ? Math.round((Math.abs(diff) / prev) * 100) : 0;
          return { cat, cur, prev, diff, pct };
        })
        .filter((r) => r.cur > 0 || r.prev > 0)
        .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
        .slice(0, 5);
      if (rows.length) {
        trendHtml = `<div class="stat-trend-section"><div class="stat-section-label">${t("trendTitle")}</div>`;
        rows.forEach((r) => {
          const cl =
            r.diff > 0
              ? "var(--expense-color)"
              : r.diff < 0
                ? "var(--income-color)"
                : "var(--text-muted)";
          const ic = r.diff > 0 ? "↑" : r.diff < 0 ? "↓" : "→";
          trendHtml += `<div class="trend-row"><span class="trend-cat">${getOpEmoji({ type: "expense", category: r.cat })} ${esc(r.cat)}</span><span class="trend-val" style="color:${cl}">${ic} ${r.pct}% (${fmt(Math.abs(r.diff))})</span></div>`;
        });
        trendHtml += "</div>";
      }
    }
    // Тепловая карта
    const dayTotals = [0, 0, 0, 0, 0, 0, 0]; // Пн=0...Вс=6
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    transactions
      .filter((tx) => tx.type === "expense" && tx.date)
      .forEach((tx) => {
        let dow = new Date(tx.date + "T00:00:00").getDay();
        dow = dow === 0 ? 6 : dow - 1;
        dayTotals[dow] += tx.amountRub;
        dayCounts[dow]++;
      });
    const dayAvg = dayTotals.map((t, i) =>
      dayCounts[i] > 0 ? t / dayCounts[i] : 0,
    );
    const maxDay = Math.max(...dayAvg) || 1;
    const wd = t("weekdaysShort");
    let heatHtml = `<div class="stat-heatmap-card"><div class="stat-section-label">${t("heatmapTitle")}</div><div class="stat-section-desc">${t("heatmapSubtitle")}</div><div class="heatmap-grid">`;
    dayAvg.forEach((avg, i) => {
      const pct = Math.round((avg / maxDay) * 100);
      const op = 0.15 + (pct / 100) * 0.85;
      const heatOpacity = op;
      const heatHeight = Math.max(4, pct * 0.6);
      heatHtml += `<div class="heatmap-cell"><div class="heatmap-bar heatmap-bar-val" style="height:${heatHeight}px;--heat-op:${heatOpacity};border-radius:4px 4px 0 0;"></div><div class="heatmap-day">${wd[i]}</div><div class="heatmap-val">${avg > 0 ? fmt(avg) : ""}</div></div>`;
    });
    heatHtml += "</div></div>";
    // Бюджеты
    let budgetHtml = "";
    if (Object.keys(categoryBudgets).length) {
      const now2 = new Date();
      const ms = new Date(now2.getFullYear(), now2.getMonth(), 1);
      budgetHtml = `<div class="stat-budgets-card"><div class="stat-section-label">${t("budgets")}</div>`;
      Object.entries(categoryBudgets).forEach(([cat, limit]) => {
        const spent = transactions
          .filter(
            (tx) =>
              tx.type === "expense" &&
              tx.category === cat &&
              tx.date &&
              new Date(tx.date + "T00:00:00") >= ms,
          )
          .reduce((s, tx) => s + tx.amountRub, 0);
        const pct = Math.min(100, Math.round((spent / limit) * 100));
        const over = spent > limit;
        const cl = over
          ? "var(--expense-color)"
          : pct > 80
            ? "var(--gold)"
            : "var(--income-color)";
        budgetHtml += `<div class="budget-row"><div class="budget-header"><span class="budget-cat">${getCategoryStyle(cat, "expense").icon} ${esc(cat)}</span><span class="budget-numbers" style="color:${cl}">${fmt(spent)} / ${fmt(limit)}</span></div><div class="budget-bar-wrap"><div class="budget-bar" style="width:${pct}%;background:${cl};"></div></div>${over ? `<div class="budget-over">${t("budgetOverLimit")}</div>` : ""}</div>`;
      });
      budgetHtml += "</div>";
    }
    // Сравнение
    const sma = mwa;
    let lmd = null,
      pmd = null;
    if (sma.length >= 2) {
      lmd = monthlyData[sma[sma.length - 1]];
      pmd = monthlyData[sma[sma.length - 2]];
    } else if (sma.length === 1) {
      lmd = monthlyData[sma[0]];
      pmd = { inc: 0, exp: 0 };
    }
    let cmpHtml = "";
    if (lmd) {
      const ic = pmd ? lmd.inc - pmd.inc : lmd.inc,
        ec = pmd ? lmd.exp - pmd.exp : lmd.exp;
      const ip = pmd?.inc
          ? Math.round((ic / pmd.inc) * 100)
          : lmd.inc > 0
            ? 100
            : 0,
        ep = pmd?.exp
          ? Math.round((ec / pmd.exp) * 100)
          : lmd.exp > 0
            ? 100
            : 0;
      cmpHtml = `<div class="compare-card"><div class="compare-title">${t("compareTitle")}</div><div class="compare-row"><span>${ic >= 0 ? "📈" : "📉"} ${t("compareIncome")}</span><span class="${ic >= 0 ? "positive" : "negative"}">${ic >= 0 ? "+" : ""}${fmt(ic)} (${ip > 0 ? "+" : ""}${ip}%)</span></div><div class="compare-row"><span>${ec >= 0 ? "📈" : "📉"} ${t("compareExpense")}</span><span class="${ec <= 0 ? "positive" : "negative"}">${ec >= 0 ? "+" : ""}${fmt(ec)} (${ep > 0 ? "+" : ""}${ep}%)</span></div></div>`;
    }
    // Прогноз
    const nd = new Date(),
      td = new Date(nd);
    td.setDate(nd.getDate() - 30);
    const rt = transactions.filter(
      (tx) => new Date(tx.date) >= td && !tx._initial,
    );
    let rI = 0,
      rE = 0;
    rt.forEach((tx) => {
      if (tx.type === "income") rI += tx.amountRub;
      else rE += tx.amountRub;
    });
    const fB = bal + rI - rE;
    const fcHtml = `<div class="forecast-card"><div class="forecast-title">${t("forecastTitle")}</div><div class="forecast-row"><span>${t("forecastIncome")}</span><span class="positive">+${fmt(rI)}</span></div><div class="forecast-row"><span>${t("forecastExpense")}</span><span class="negative">−${fmt(rE)}</span></div><div class="forecast-row forecast-balance"><span>${t("forecastBalance")}</span><span class="${fB >= 0 ? "positive" : "negative"}">${fmt(fB)}</span></div><div class="forecast-note">${t("forecastNote")}</div></div>`;

    const html = `<div class="stats-v2">
      ${periodHtml}
      <div class="stat-status-card ${sC}"><div class="stat-status-left"><div class="stat-status-emoji">${sE}</div><div><div class="stat-status-title">${sT}</div><div class="stat-status-desc">${sD}</div></div></div><div class="stat-status-count">${ptx.length}<span>${t("statsRec")}</span></div></div>
      <div class="stat-kpi-grid">
        <div class="stat-kpi balance"><div class="stat-kpi-icon">💎</div><div class="stat-kpi-val ${bal >= 0 ? "pos" : "neg"}">${fmt(bal)}</div><div class="stat-kpi-label">${t("statsRemaining")}</div></div>
        <div class="stat-kpi start"><div class="stat-kpi-icon">💼</div><div class="stat-kpi-val">${fmt(startBalanceRub)}</div><div class="stat-kpi-label">${t("salary")}</div></div>
        <div class="stat-kpi income"><div class="stat-kpi-icon">📈</div><div class="stat-kpi-val inc">+${fmt(inc)}</div><div class="stat-kpi-label">${nInc} ${t("statsInc2")}</div></div>
        <div class="stat-kpi expense"><div class="stat-kpi-icon">📉</div><div class="stat-kpi-val exp">−${fmt(exp)}</div><div class="stat-kpi-label">${nExp} ${t("statsExp2")}</div></div>
      </div>
      <div class="stat-visual-row">
        <div class="stat-gauge-card"><div class="stat-section-label">${t("statsSavingsGauge")}</div><div class="stat-gauge-wrap"><svg viewBox="0 0 160 95" class="stat-gauge-svg"><path d="M 18 88 A 62 62 0 0 1 142 88" fill="none" stroke="var(--cream-dark)" stroke-width="14" stroke-linecap="round"/><path d="M 18 88 A 62 62 0 0 1 142 88" fill="none" stroke="${gC}" stroke-width="14" stroke-linecap="round" stroke-dasharray="195" stroke-dashoffset="${195 - (savedPct / 100) * 195}" class="gauge-arc"/><text x="80" y="22" font-size="9" fill="var(--text-muted)" text-anchor="middle">50%</text></svg><div class="stat-gauge-center"><div class="stat-gauge-pct" style="color:${gC}">${savedPct}%</div><div class="stat-gauge-sub">${t("statsSaved2")}</div></div></div><div class="stat-gauge-amount" style="color:${gC}">${savedAmt >= 0 ? "+" : ""}${fmt(savedAmt)}</div></div>
        <div class="stat-donut-card"><div class="stat-section-label">${t("statsRatio")}</div><div class="stat-donut2-wrap"><svg viewBox="0 0 100 100" class="stat-donut2-svg"><circle cx="50" cy="50" r="38" fill="none" stroke="var(--income-color)" stroke-width="18"/><circle cx="50" cy="50" r="38" fill="none" stroke="var(--expense-color)" stroke-width="18" stroke-dasharray="${spentPct * 2.388} ${(100 - spentPct) * 2.388}" stroke-dashoffset="0" transform="rotate(-90 50 50)" class="donut-arc"/></svg><div class="stat-donut2-center"><div class="stat-donut2-pct" style="color:var(--expense-color)">${spentPct}%</div><div class="stat-donut2-sub">${t("statsSpentOf2")}</div></div></div><div class="stat-donut2-legend"><span class="stat-legend-dot" style="background:var(--income-color)"></span>${t("income")}<span class="stat-legend-dot" style="background:var(--expense-color);margin-left:8px"></span>${t("expense")}</div></div>
      </div>
      ${budgetHtml}
      ${trendHtml}
      ${heatHtml}
      ${cmpHtml}${fcHtml}
      ${allM.length > 1 ? `<div class="stat-chart-card"><div class="stat-section-label">${t("statsMonthlyDyn")}</div><div class="stat-chart-legend"><span class="stat-legend-dot" style="background:var(--income-color)"></span>${t("income")}<span class="stat-legend-dot" style="background:var(--expense-color);margin-left:12px"></span>${t("expense")}</div><div class="stat-chart-grid">${chartBars}</div></div>` : ""}
      <div class="line-chart-card"><div class="line-chart-title">${t("lineChartTitle")}</div><div class="line-chart-container"><canvas id="balanceLineChart"></canvas></div><div class="line-chart-note">${t("lineChartExplanation")}</div></div>
      <div class="pie-chart-card"><div class="pie-chart-title">🍩 ${t("statsExpCats")} ${t("pieChartTop5")}</div><div class="pie-chart-wrapper"><div class="pie-svg-container"><svg viewBox="0 0 100 100" style="width:100%;height:100%;">${pieSvg}</svg></div><div class="pie-legend">${legHtml}</div></div></div>
      ${incPieSvg ? `<div class="pie-chart-card" style="border-left-color:var(--income-color);"><div class="pie-chart-title">🍩 ${t("statsIncCats")} ${t("pieChartTop5")}</div><div class="pie-chart-wrapper"><div class="pie-svg-container"><svg viewBox="0 0 100 100" style="width:100%;height:100%;">${incPieSvg}</svg></div><div class="pie-legend">${incLegHtml}</div></div></div>` : ""}
      ${topExp.length ? `<div class="stat-cats-card"><div class="stat-section-label">${t("statsExpCats")}</div><div class="stat-cats-list">${ceR}</div></div>` : ""}
      ${topInc.length ? `<div class="stat-cats-card income-cats"><div class="stat-section-label">${t("statsIncCats")}</div><div class="stat-cats-list">${ciR}</div></div>` : ""}
      ${tips.length ? `<div class="stat-tips-card"><div class="stat-section-label">${t("statsTips")}</div>${tips.map((tip) => `<div class="stat-tip-item">${tip}</div>`).join("")}</div>` : ""}
      <div class="stat-summary-table"><div class="stat-section-label">${t("statsSummaryTable")}</div>
        <div class="stat-sum-row"><span class="stat-sum-label">${t("statsStartAmt")}</span><span class="stat-sum-val">${fmt(startBalanceRub)}</span></div>
        <div class="stat-sum-row inc-row"><span class="stat-sum-label">${t("statsTotalIncLabel")}</span><span class="stat-sum-val" style="color:var(--income-color)">+${fmt(inc)}</span></div>
        <div class="stat-sum-row exp-row"><span class="stat-sum-label">${t("statsTotalExpLabel")}</span><span class="stat-sum-val" style="color:var(--expense-color)">−${fmt(exp)}</span></div>
        <div class="stat-sum-row bal-row"><span class="stat-sum-label">${t("statsBalanceLabel")}</span><span class="stat-sum-val" style="color:${bal >= 0 ? "#2563eb" : "var(--expense-color)"};font-size:20px">${fmt(bal)}</span></div>
        <div class="stat-sum-row"><span class="stat-sum-label">${t("statsTotalOpsLabel")}</span><span class="stat-sum-val">${ptx.length}</span></div>
        <div class="stat-sum-row"><span class="stat-sum-label">${t("statsSavingsLabel")}</span><span class="stat-sum-val" style="color:${gC}">${savedPct}% (${fmt(Math.max(0, savedAmt))})</span></div>
      </div>
    </div>`;
    content.innerHTML = html;
    injectStatsStyles();
    content.querySelectorAll(".stats-period-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        statsPeriod = btn.dataset.period;
        renderStats();
      }),
    );
    setTimeout(() => {
      const canvas = document.getElementById("balanceLineChart");
      if (!canvas) return;
      // Ensure container is visible
      const container = canvas.parentElement;
      if (container) {
        container.style.position = "relative";
        container.style.height = "220px";
        container.style.width = "100%";
      }
      const allMs = Object.keys(monthlyData).sort();
      let rb = startBalanceRub;
      const md = [];
      allMs.forEach((mo) => {
        const d = monthlyData[mo];
        rb = rb + (d.inc || 0) - (d.exp || 0);
        md.push({ month: mo, balance: rb });
      });
      const labels = md.map((d) => {
        const [, m] = d.month.split("-");
        return months[parseInt(m) - 1]?.slice(0, 3) || d.month.slice(5);
      });
      const values = md.map((d) => toDisp(d.balance));
      const ec = Chart.getChart("balanceLineChart");
      if (ec) ec.destroy();
      new Chart(canvas, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: t("balance") + " (" + sym() + ")",
              data: values,
              borderColor: document.body.classList.contains("dark")
                ? "#a78bfa"
                : "#f97316",
              backgroundColor: document.body.classList.contains("dark")
                ? "rgba(167,139,250,0.08)"
                : "rgba(249,115,22,0.06)",
              borderWidth: 2.5,
              pointBackgroundColor: document.body.classList.contains("dark")
                ? "#a78bfa"
                : "#f97316",
              pointBorderColor: "var(--card-bg)",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} ${sym()}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: { color: "var(--cream-border)" },
              ticks: { callback: (v) => v + " " + sym() },
            },
            x: {
              grid: { display: false },
              ticks: {
                color: document.body.classList.contains("dark")
                  ? "rgba(196,181,253,0.6)"
                  : "#9ca3af",
              },
            },
          },
        },
      });
    }, 100);
  }, 20);
}

// ============================================================
// СТИЛИ СТАТИСТИКИ
// ============================================================
function injectStatsStyles() {
  if (document.getElementById("statsV2Styles")) return;
  const style = document.createElement("style");
  style.id = "statsV2Styles";
  style.textContent = `
  @keyframes pieIn{from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);}}
  .stats-v2{display:flex;flex-direction:column;gap:14px;animation:fadeUp .4s ease both;}
  .stats-empty-state{text-align:center;padding:60px 20px;}
  .stats-empty-icon{font-size:64px;margin-bottom:16px;}
  .stats-empty-title{font-size:20px;font-weight:800;color:var(--text);}
  .stats-period-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--card-bg);border-radius:var(--radius-md);padding:12px 16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stats-period-label{font-size:13px;font-weight:700;color:var(--text-muted);white-space:nowrap;}
  .stats-period-btns{display:flex;gap:6px;flex-wrap:wrap;}
  .stats-period-btn{padding:8px 14px;border-radius:99px;border:1.5px solid var(--cream-border);background:var(--cream-dark);font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;transition:var(--transition);color:var(--text-soft);}
  .stats-period-btn:hover{border-color:var(--primary);color:var(--primary);}
  .stats-period-btn.active{background:var(--primary);color:white;border-color:var(--primary);}
  .stat-status-card{border-radius:var(--radius-lg);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1.5px solid transparent;}
  .stat-status-card.healthy{background:var(--income-pale);border-color:rgba(26,115,64,0.25);}
  .stat-status-card.warning{background:var(--gold-pale);border-color:var(--gold-border);}
  .stat-status-card.danger{background:var(--expense-pale);border-color:rgba(193,53,21,0.25);}
  .stat-status-left{display:flex;align-items:center;gap:12px;}
  .stat-status-emoji{font-size:34px;line-height:1;flex-shrink:0;}
  .stat-status-title{font-size:17px;font-weight:800;color:var(--text);margin-bottom:2px;}
  .stat-status-desc{font-size:13px;color:var(--text-soft);line-height:1.4;}
  .stat-status-count{font-size:28px;font-weight:900;color:var(--text-muted);text-align:right;flex-shrink:0;line-height:1;}
  .stat-status-count span{display:block;font-size:11px;font-weight:700;}
  .stat-section-label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:var(--text-muted);margin-bottom:12px;}
  .stat-section-desc{font-size:12px;color:var(--text-muted);margin-bottom:10px;}
  .stat-kpi-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;}
  @media(max-width:480px){.stat-kpi-grid{grid-template-columns:1fr 1fr;}}
  .stat-kpi{background:var(--card-bg);border-radius:var(--radius-md);padding:14px 10px;text-align:center;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);transition:var(--transition);}
  .stat-kpi:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
  .stat-kpi.balance{border-top:3px solid #2563eb;}.stat-kpi.income{border-top:3px solid var(--income-color);}
  .stat-kpi.expense{border-top:3px solid var(--expense-color);}.stat-kpi.start{border-top:3px solid var(--gold);}
  .stat-kpi-icon{font-size:22px;margin-bottom:6px;}
  .stat-kpi-val{font-size:clamp(12px,3vw,16px);font-weight:900;color:var(--text);line-height:1.1;word-break:break-all;}
  .stat-kpi-val.pos{color:#2563eb;}.stat-kpi-val.neg{color:var(--expense-color);}
  .stat-kpi-val.inc{color:var(--income-color);}.stat-kpi-val.exp{color:var(--expense-color);}
  .stat-kpi-label{font-size:11px;font-weight:700;color:var(--text-muted);margin-top:4px;}
  .stat-visual-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  @media(max-width:360px){.stat-visual-row{grid-template-columns:1fr;}}
  .stat-gauge-card,.stat-donut-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stat-gauge-wrap{position:relative;display:flex;justify-content:center;}
  .stat-gauge-svg{width:100%;max-width:180px;overflow:visible;}
  .gauge-arc{transition:stroke-dashoffset 1.3s cubic-bezier(0.34,1.3,0.64,1);}
  .stat-gauge-center{position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;}
  .stat-gauge-pct{font-size:22px;font-weight:900;line-height:1;}
  .stat-gauge-sub{font-size:10px;color:var(--text-muted);font-weight:700;margin-top:2px;}
  .stat-gauge-amount{text-align:center;font-size:14px;font-weight:800;margin-top:6px;}
  .stat-donut2-wrap{position:relative;width:86px;height:86px;margin:0 auto 8px;}
  .stat-donut2-svg{width:86px;height:86px;}
  .donut-arc{transition:stroke-dasharray 1s ease;}
  .stat-donut2-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .stat-donut2-pct{font-size:18px;font-weight:900;line-height:1;}
  .stat-donut2-sub{font-size:9px;color:var(--text-muted);font-weight:700;}
  .stat-donut2-legend{font-size:11px;font-weight:700;color:var(--text-muted);text-align:center;display:flex;align-items:center;justify-content:center;gap:4px;}
  .stat-legend-dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .stat-chart-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stat-chart-legend{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:12px;}
  .stat-chart-grid{display:flex;align-items:flex-end;justify-content:space-around;gap:4px;height:80px;padding:0 4px;}
  .stat-chart-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;}
  .stat-chart-bars{display:flex;align-items:flex-end;gap:2px;height:64px;}
  .stat-chart-bar{width:13px;border-radius:4px 4px 0 0;min-height:3px;transition:height .8s cubic-bezier(0.34,1.3,0.64,1);}
  .stat-chart-bar.inc{background:var(--income-color);opacity:.85;}
  .stat-chart-bar.exp{background:var(--expense-color);opacity:.85;}
  .stat-chart-label{font-size:9px;font-weight:700;color:var(--text-muted);margin-top:4px;white-space:nowrap;}
  .stat-cats-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);border-left:5px solid var(--expense-color);}
  .stat-cats-card.income-cats{border-left-color:var(--income-color);}
  .stat-cats-list{display:flex;flex-direction:column;gap:14px;}
  .stat-cat-row{display:flex;align-items:center;gap:10px;}
  .stat-cat-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
  .stat-cat-info{flex:1;min-width:0;}
  .stat-cat-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;gap:8px;}
  .stat-cat-name{font-size:14px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;}
  .stat-cat-amount{font-size:14px;font-weight:900;white-space:nowrap;flex-shrink:0;}
  .stat-cat-bar-wrap{height:6px;background:var(--cream-dark);border-radius:99px;overflow:hidden;}
  .stat-cat-bar{height:100%;border-radius:99px;transition:width .9s cubic-bezier(0.34,1.3,0.64,1);}
  .stat-cat-pct{font-size:12px;font-weight:800;min-width:32px;text-align:right;flex-shrink:0;}
  .stat-tips-card{background:linear-gradient(135deg,var(--primary-pale),rgba(255,255,255,0.4));border:1.5px solid rgba(64,145,108,0.3);border-radius:var(--radius-lg);padding:16px;}
  body.dark .stat-tips-card{background:linear-gradient(135deg,var(--primary-pale),rgba(0,0,0,0.1));}
  .stat-tip-item{font-size:14px;color:var(--text-soft);line-height:1.5;padding:8px 0;border-bottom:1px solid var(--cream-border);}
  .stat-tip-item:last-child{border-bottom:none;padding-bottom:0;}
  .stat-summary-table{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stat-sum-row{display:flex;justify-content:space-between;align-items:center;padding:10px 6px;border-bottom:1px solid var(--cream-border);gap:12px;}
  .stat-sum-row:last-child{border-bottom:none;}
  .stat-sum-row.bal-row{background:rgba(37,99,235,.05);margin:0 -4px;padding:10px;border-radius:8px;border-bottom:none;margin-top:4px;}
  .stat-sum-row.inc-row{background:rgba(26,115,64,.04);margin:0 -4px;padding:10px;border-radius:8px;border-bottom:none;}
  .stat-sum-row.exp-row{background:rgba(193,53,21,.04);margin:0 -4px;padding:10px;border-radius:8px;border-bottom:none;}
  .stat-sum-label{font-size:14px;color:var(--text-soft);font-weight:600;}
  .stat-sum-val{font-size:16px;font-weight:900;color:var(--text);text-align:right;}
  .pie-chart-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .pie-chart-title{font-size:16px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;color:var(--text);}
  .pie-chart-wrapper{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:20px;}
  .pie-svg-container{flex-shrink:0;width:180px;height:180px;}
  .pie-legend{flex:1;min-width:150px;display:flex;flex-direction:column;gap:10px;}
  .pie-legend-item{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:var(--text-soft);}
  .pie-legend-color{width:16px;height:16px;border-radius:4px;flex-shrink:0;}
  .pie-legend-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .pie-legend-value{font-weight:800;color:var(--text);}
  .line-chart-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .line-chart-title{font-size:16px;font-weight:800;margin-bottom:16px;color:var(--text);}
  .line-chart-container{position:relative;width:100%;height:220px;}
  .line-chart-note{margin-top:8px;font-size:11px;color:var(--text-muted);text-align:center;font-style:italic;}
  .compare-card,.forecast-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .compare-title,.forecast-title{font-size:14px;font-weight:800;margin-bottom:12px;color:var(--text);}
  .compare-row,.forecast-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cream-border);}
  .compare-row:last-child,.forecast-row:last-child{border-bottom:none;}
  .forecast-balance{font-weight:700;margin-top:4px;padding-top:12px;border-top:2px dashed var(--cream-border);}
  .forecast-note{font-size:11px;color:var(--text-muted);margin-top:10px;text-align:right;font-style:italic;}
  .positive{color:var(--income-color);font-weight:700;}.negative{color:var(--expense-color);font-weight:700;}
  .ops-date-group{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);padding:8px 4px 4px;margin-top:4px;border-bottom:1px solid var(--cream-border);}
  /* Тренд */
  .stat-trend-section{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .trend-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cream-border);}
  .trend-row:last-child{border-bottom:none;}
  .trend-cat{font-size:14px;font-weight:700;color:var(--text);}
  .trend-val{font-size:14px;font-weight:800;}
  /* Тепловая карта */
  .stat-heatmap-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .heatmap-grid{display:flex;gap:6px;align-items:flex-end;justify-content:space-around;margin-top:12px;}
  .heatmap-cell{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}
  .heatmap-bar{width:100%;border-radius:4px 4px 0 0;min-height:4px;transition:height .8s ease;}
  .heatmap-day{font-size:11px;font-weight:700;color:var(--text-muted);}
  .heatmap-val{font-size:10px;color:var(--text-muted);text-align:center;white-space:nowrap;}
  /* Бюджеты */
  .stat-budgets-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .budget-row{margin-bottom:14px;}
  .budget-row:last-child{margin-bottom:0;}
  .budget-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
  .budget-cat{font-size:14px;font-weight:700;color:var(--text);}
  .budget-numbers{font-size:13px;font-weight:800;}
  .budget-bar-wrap{height:8px;background:var(--cream-dark);border-radius:99px;overflow:hidden;}
  .budget-bar{height:100%;border-radius:99px;transition:width .8s ease;}
  .budget-over{font-size:12px;color:var(--expense-color);font-weight:700;margin-top:4px;}
  /* Фильтр времени */
  .history-time-filter{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 0 12px;overflow-x:auto;}
  .htf-label{font-size:12px;font-weight:700;color:var(--text-muted);white-space:nowrap;}
  .htf-btns{display:flex;gap:6px;flex-wrap:nowrap;overflow-x:auto;}
  .htf-btn{padding:6px 12px;border-radius:99px;border:1.5px solid var(--cream-border);background:var(--cream-dark);font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;color:var(--text-soft);transition:var(--transition);}
  .htf-btn.active{background:var(--primary);color:white;border-color:var(--primary);}
  /* Шаблоны с кнопкой удаления */
  .suggestion-item-wrap{display:flex;align-items:center;gap:4px;}
  .suggestion-delete-btn{background:var(--expense-pale);border:none;border-radius:50%;width:24px;height:24px;font-size:12px;cursor:pointer;color:var(--expense-color);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:var(--transition);}
  .suggestion-delete-btn:hover{background:var(--expense-color);color:white;}
  `;
  document.head.appendChild(style);
}

// ============================================================
// ИНСТРУМЕНТЫ
// ============================================================
function renderTools() {
  const currencies = ["RUB", "USD", "EUR", "GEL", "GBP", "KZT"];
  const opts = currencies.map((c) => `<option>${c}</option>`).join("");
  const html = `
    <div class="tool-card tab-anim">
      <div class="tool-card-header"><div class="tool-card-title">${t("calculator")}</div><button class="btn-secondary" id="showCalcHistoryBtn" style="padding:8px 14px;">📜 ${t("history")}</button></div>
      <div class="section-hint">${t("calcHint")}</div>
      <div class="calc-display" id="calcDisplay">0</div><div class="calc-grid" id="calcGrid"></div>
    </div>
    <div class="tool-card">
      <div class="tool-card-header"><div class="tool-card-title">${t("converter")}</div><button class="btn-secondary" id="showConvHistoryBtn" style="padding:8px 14px;">📜 ${t("history")}</button></div>
      <div class="section-hint">${t("convHint")}</div>
      <div class="field-group"><label class="field-label">${t("sumLabel")}</label><input type="number" id="convAmount" class="modal-input" value="100"></div>
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:end;margin-bottom:12px;">
        <div><label class="field-label">${t("fromCurrency")}</label><select id="convFrom" class="modal-select">${opts}</select></div>
        <div style="padding-bottom:12px;font-size:20px;text-align:center;opacity:.6;">→</div>
        <div><label class="field-label">${t("toCurrency")}</label><select id="convTo" class="modal-select">${currencies.map((c, i) => `<option${i === 3 ? " selected" : ""}>${c}</option>`).join("")}</select></div>
      </div>
      <button class="btn-primary" id="convBtn">${t("convert")}</button>
      <div id="convResult" style="display:none" class="conv-result"></div>
    </div>`;
  document.getElementById("mainContent").innerHTML = html;
  buildCalcGrid();
  document.getElementById("convBtn").addEventListener("click", () => {
    const amt = parseFloat(document.getElementById("convAmount").value),
      from = document.getElementById("convFrom").value,
      to = document.getElementById("convTo").value;
    if (isNaN(amt)) {
      showToast(t("enterAmount"), "error");
      return;
    }
    const rub = from === "RUB" ? amt : amt / (exchangeRates[from] || 1);
    const res = rub * (exchangeRates[to] || 1);
    const el = document.getElementById("convResult");
    el.style.display = "block";
    el.textContent = `${amt} ${from} = ${res.toFixed(4)} ${to}`;
    convHistory.unshift({
      from,
      to,
      amt,
      res,
      ts: new Date().toLocaleString(),
    });
    if (convHistory.length > 50) convHistory.pop();
    saveAll();
  });
  document
    .getElementById("showCalcHistoryBtn")
    .addEventListener("click", showCalcHistoryModal);
  document
    .getElementById("showConvHistoryBtn")
    .addEventListener("click", showConvHistoryModal);
}

function buildCalcGrid() {
  const grid = document.getElementById("calcGrid");
  if (!grid) return;
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
    ["+", ["+"]],
    ["+/−", "sign"],
    ["0", "0"],
    [".", "."],
    ["=", "="],
  ];
  grid.innerHTML = "";
  keys.forEach(([lbl, act]) => {
    const btn = document.createElement("button");
    btn.textContent = lbl;
    btn.className = "calc-key";
    if (act === "clear" || act === "back") btn.classList.add("clear");
    if (["/", "*", "-", "+", "%"].includes(act)) btn.classList.add("op-key");
    if (act === "=") {
      btn.classList.remove("op-key");
      btn.classList.add("eq-key");
    }
    btn.addEventListener("click", () =>
      handleCalc(Array.isArray(act) ? act[0] : act),
    );
    grid.appendChild(btn);
  });
}
function handleCalc(action) {
  if ([t("calcError"), "Error"].includes(calcExpr)) calcExpr = "";
  if (action === "clear") calcExpr = "";
  else if (action === "back") calcExpr = calcExpr.slice(0, -1);
  else if (action === "sign")
    calcExpr = calcExpr.startsWith("-") ? calcExpr.slice(1) : "-" + calcExpr;
  else if (action === "=") {
    try {
      const r = Function('"use strict";return(' + calcExpr + ")")();
      if (isFinite(r)) {
        calcHistory.unshift({
          expr: calcExpr,
          res: r,
          ts: new Date().toLocaleString(),
        });
        if (calcHistory.length > 50) calcHistory.pop();
        calcExpr = String(r);
        saveAll();
      } else calcExpr = t("calcError");
    } catch (e) {
      calcExpr = t("calcError");
    }
  } else {
    if (
      "+-*/".includes(action) &&
      calcExpr &&
      "+-*/".includes(calcExpr.slice(-1))
    )
      calcExpr = calcExpr.slice(0, -1);
    calcExpr += action;
  }
  document.getElementById("calcDisplay").textContent = calcExpr || "0";
}
function showCalcHistoryModal() {
  let html = '<div class="history-list">';
  if (!calcHistory.length)
    html += `<p style="padding:20px;color:var(--text-muted);">${t("historyEmpty")}</p>`;
  else
    calcHistory.forEach((it, i) => {
      html += `<div class="history-item"><div class="history-item-info"><div class="history-item-cat">${esc(it.expr)} = <strong>${it.res}</strong></div><div class="history-item-meta">${it.ts}</div></div><button class="icon-btn delete" data-idx="${i}">✕</button></div>`;
    });
  html += `</div><div style="margin-top:16px;"><button class="btn-danger" id="clearCalcHist" style="width:100%">🗑 ${t("clearHistory")}</button></div>`;
  const modal = createModal("calcHistoryModal", t("history"), html);
  document.body.appendChild(modal);
  openModal("calcHistoryModal");
  modal.querySelectorAll(".icon-btn.delete").forEach((b) =>
    b.addEventListener("click", () => {
      askConfirm(
        t("confirmDelete"),
        () => {
          calcHistory.splice(parseInt(b.dataset.idx), 1);
          saveAll();
          closeModal("calcHistoryModal");
          setTimeout(showCalcHistoryModal, 200);
        },
        { icon: "🗑️" },
      );
    }),
  );
  document.getElementById("clearCalcHist")?.addEventListener("click", () => {
    calcHistory = [];
    saveAll();
    closeModal("calcHistoryModal");
  });
}
function showConvHistoryModal() {
  let html = '<div class="history-list">';
  if (!convHistory.length)
    html += `<p style="padding:20px;color:var(--text-muted);">${t("historyEmpty")}</p>`;
  else
    convHistory.forEach((it, i) => {
      html += `<div class="history-item"><div class="history-item-info"><div class="history-item-cat">${it.amt} ${it.from} → ${it.res.toFixed(4)} ${it.to}</div><div class="history-item-meta">${it.ts}</div></div><button class="icon-btn delete" data-idx="${i}">✕</button></div>`;
    });
  html += `</div><div style="margin-top:16px;"><button class="btn-danger" id="clearConvHist" style="width:100%">🗑 ${t("clearHistory")}</button></div>`;
  const modal = createModal("convHistoryModal", t("history"), html);
  document.body.appendChild(modal);
  openModal("convHistoryModal");
  modal.querySelectorAll(".icon-btn.delete").forEach((b) =>
    b.addEventListener("click", () => {
      askConfirm(
        t("confirmDelete"),
        () => {
          convHistory.splice(parseInt(b.dataset.idx), 1);
          saveAll();
          closeModal("convHistoryModal");
          setTimeout(showConvHistoryModal, 200);
        },
        { icon: "🗑️" },
      );
    }),
  );
  document.getElementById("clearConvHist").addEventListener("click", () => {
    convHistory = [];
    saveAll();
    closeModal("convHistoryModal");
  });
}

// ============================================================
// БЛОКНОТ
// ============================================================
function renderNotebook() {
  const html = `<div class="section-hint">💡 ${t("notebookHint")}</div><button class="btn-primary" id="newNotebookBtn" style="width:100%;margin-bottom:16px;padding:16px;">✚ ${t("newPage")}</button><div id="notebookList" class="notebook-grid"></div>`;
  document.getElementById("mainContent").innerHTML = html;
  document.getElementById("newNotebookBtn").addEventListener("click", () => {
    notebookPages.push({
      id: Date.now(),
      title: t("newNotebookTitle"),
      date: today(),
      content: "",
    });
    saveAll();
    renderNotebook();
  });
  const container = document.getElementById("notebookList");
  if (!notebookPages.length) {
    container.innerHTML = `<div class="empty-block"><div class="empty-emoji">📓</div><p>${t("noPages")}</p></div>`;
    return;
  }
  [...notebookPages].reverse().forEach((p) => {
    const div = document.createElement("div");
    div.className = "note-card";
    div.innerHTML = `<div class="note-title">${esc(p.title)}</div><div class="note-date">📅 ${fmtDate(p.date)}</div><div class="note-preview">${esc(p.content.substring(0, 100))}${p.content.length > 100 ? "…" : ""}</div>`;
    div.addEventListener("click", () => openNotebookModal(p.id));
    container.appendChild(div);
  });
}
function openNotebookModal(id) {
  const page = notebookPages.find((p) => p.id === id);
  if (!page) return;
  editingNoteId = id;
  const html = `<div class="field-group"><label class="field-label">${t("pageTitle")}</label><input type="text" id="nbTitle" class="modal-input" value="${esc(page.title)}"></div><div class="field-group"><label class="field-label">${t("date")}</label><div class="date-input-wrapper"><input type="text" id="nbDateDisplay" class="modal-input" readonly value="${fmtDate(page.date)}"><input type="hidden" id="nbDate" value="${page.date}"><button type="button" class="datepicker-btn" id="nbDateBtn">📅</button></div></div><div class="field-group"><label class="field-label">${t("content")}</label><textarea id="nbContent" class="modal-textarea" rows="8" placeholder="${t("notebookPlaceholder")}">${esc(page.content)}</textarea></div><div class="modal-actions"><button class="btn-danger" id="deleteNbBtn">🗑 ${t("delete")}</button><button class="btn-primary" id="saveNbBtn">💾 ${t("save")}</button></div>`;
  const modal = createModal("notebookModal", t("editNote"), html);
  document.body.appendChild(modal);
  openModal("notebookModal");
  document.getElementById("nbDateBtn").addEventListener("click", () =>
    openDatePicker(document.getElementById("nbDate").value, (d) => {
      document.getElementById("nbDate").value = d;
      document.getElementById("nbDateDisplay").value = fmtDate(d);
    }),
  );
  document.getElementById("saveNbBtn").addEventListener("click", () => {
    const p = notebookPages.find((p) => p.id === editingNoteId);
    if (p) {
      p.title =
        document.getElementById("nbTitle").value.trim() || t("defaultNotePage");
      p.date = document.getElementById("nbDate").value;
      p.content = document.getElementById("nbContent").value;
      saveAll();
      renderNotebook();
      closeModal("notebookModal");
      showToast(t("saved"));
    }
  });
  document.getElementById("deleteNbBtn").addEventListener("click", () => {
    askConfirm(
      t("confirmDelete"),
      () => {
        notebookPages = notebookPages.filter((p) => p.id !== editingNoteId);
        saveAll();
        renderNotebook();
        closeModal("notebookModal");
        showToast(t("deleted"));
      },
      { icon: "🗑️" },
    );
  });
}

// ============================================================
// КАТЕГОРИИ
// ============================================================
function openAddCategoryModal(defType = "expense") {
  let sel = defType;
  const html = `<div class="field-group"><label class="field-label">${t("catTypeLabel")}</label><div class="cat-type-toggle"><button class="cat-type-btn expense ${defType === "expense" ? "active" : ""}" data-type="expense"><div class="cat-type-icon">💸</div><div class="cat-type-title">${t("catTypeExpenseTitle")}</div></button><button class="cat-type-btn income ${defType === "income" ? "active" : ""}" data-type="income"><div class="cat-type-icon">💰</div><div class="cat-type-title">${t("catTypeIncomeTitle")}</div></button></div></div><div class="field-group"><label class="field-label">${t("catNameLabel")}</label><input type="text" id="newCatName" class="modal-input" placeholder="${t("catNamePlaceholder")}" autofocus></div><div class="modal-actions"><button class="btn-secondary" id="addCatCancel">${t("cancel")}</button><button class="btn-primary" id="addCatSave">✚ ${t("save")}</button></div>`;
  const modal = createModal("addCatModal", t("addCatModalTitle"), html);
  document.body.appendChild(modal);
  openModal("addCatModal");
  // Устанавливаем active класс для дефолтного типа при открытии
  modal.querySelectorAll(".cat-type-btn.active").forEach((b) => {
    b.classList.add("active-" + b.dataset.type);
  });
  modal.querySelectorAll(".cat-type-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      sel = btn.dataset.type;
      modal.querySelectorAll(".cat-type-btn").forEach((b) => {
        b.classList.remove("active", "active-expense", "active-income");
      });
      btn.classList.add("active", "active-" + btn.dataset.type);
      haptic && haptic("light");
    }),
  );
  document
    .getElementById("addCatCancel")
    .addEventListener("click", () => closeModal("addCatModal"));
  document.getElementById("addCatSave").addEventListener("click", () => {
    const name = document.getElementById("newCatName").value.trim();
    if (!name) {
      showToast(t("enterAmount"), "error");
      return;
    }
    if (sel === "expense") {
      if (categories[name]) {
        showToast("⚠️ " + name, "error");
        return;
      }
      categories[name] = { subcats: [] };
    } else {
      if (incomeCategories[name]) {
        showToast("⚠️ " + name, "error");
        return;
      }
      incomeCategories[name] = { subcats: [] };
    }
    saveAll();
    renderCategories();
    closeModal("addCatModal");
    showToast(t("saved"));
  });
}
function renderCategories() {
  let html = `<div class="section-hint">💡 ${t("catHint")}</div><button class="cat-unified-add-btn" id="addCatUnifiedBtn"><span class="cat-unified-icon">✚</span><div><div class="cat-unified-title">${t("addCatModalTitle")}</div></div></button><div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("expCatsTitle")}</div></div><div id="categoriesList"></div></div><div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("incomeCats")}</div></div><div id="incomeList"></div></div>`;
  document.getElementById("mainContent").innerHTML = html;
  document
    .getElementById("addCatUnifiedBtn")
    .addEventListener("click", () => openAddCategoryModal("expense"));
  function buildCatList(container, catObj, isIncome) {
    container.innerHTML = "";
    for (const [cat, data] of Object.entries(catObj)) {
      const div = document.createElement("div");
      div.className = "cat-item";
      const safeId =
        "chips-" + (isIncome ? "inc-" : "") + cat.replace(/\s/g, "_");
      const style = getCategoryStyle(cat, isIncome ? "income" : "expense");
      div.innerHTML = `<div class="cat-item-header"><div class="cat-item-name">${style.icon} ${esc(cat)}</div><button class="icon-btn delete" data-delcat="${esc(cat)}">✕</button></div><div class="chips-row" id="${safeId}"></div><button class="cat-add-sub-btn add-sub" data-cat="${esc(cat)}">＋ ${t("addSubcategory")}</button>`;
      container.appendChild(div);
      const chips = document.getElementById(safeId);
      data.subcats.forEach((sub) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = `${esc(sub)} <button class="chip-del" data-cat="${esc(cat)}" data-sub="${esc(sub)}">✕</button>`;
        chip.addEventListener("click", (e) => {
          if (e.target.classList.contains("chip-del")) return;
          openInputModal(t("editSubcatTitle"), t("newName"), sub, (nn) => {
            if (nn?.trim()) {
              const i = catObj[cat].subcats.indexOf(sub);
              if (i !== -1) {
                catObj[cat].subcats[i] = nn.trim();
                saveAll();
                renderCategories();
              }
            }
          });
        });
        chip.querySelector(".chip-del").addEventListener("click", (e) => {
          e.stopPropagation();
          askConfirm(
            `${t("delete")}: «${sub}»?`,
            () => {
              catObj[cat].subcats = catObj[cat].subcats.filter(
                (s) => s !== sub,
              );
              saveAll();
              renderCategories();
            },
            { icon: "🗑️" },
          );
        });
        chips.appendChild(chip);
      });
      div
        .querySelector(".cat-item-name")
        .addEventListener("click", () => openEditCategoryModal(cat, isIncome));
      div.querySelector("[data-delcat]").addEventListener("click", () => {
        askConfirm(
          `${t("delete")}: «${cat}»?`,
          () => {
            delete catObj[cat];
            saveAll();
            renderCategories();
          },
          { icon: "🗑️" },
        );
      });
      div.querySelector(".add-sub").addEventListener("click", () => {
        openInputModal(
          t("newSubcatTitle"),
          `${t("inCategoryLabel")} «${cat}»`,
          "",
          (sub) => {
            if (sub?.trim()) {
              catObj[cat].subcats.push(sub.trim());
              saveAll();
              renderCategories();
            }
          },
        );
      });
    }
  }
  buildCatList(document.getElementById("categoriesList"), categories, false);
  buildCatList(document.getElementById("incomeList"), incomeCategories, true);
}

// ============================================================
// НАСТРОЙКИ — расширенные
// ============================================================
function renderProfilesBody() {
  const activeProf = profiles.find((p) => p.id === activeProfileId);
  const currentUserRole = activeProf?.role;
  const isGuest = currentUserRole === "guest";

  if (!profiles.length)
    profiles = [
      {
        id: "default",
        name: "Я",
        emoji: "👤",
        color: "#2d6a4f",
        role: "owner",
      },
    ];

  const profilesHtml = profiles
    .map((p) => {
      // Гость видит только свой профиль (роль guest и активный)
      if (isGuest) {
        if (p.role !== "guest" || p.id !== activeProfileId) return "";
      }

      const isActive = p.id === activeProfileId;
      const pRaw = localStorage.getItem("budget_profile_" + p.id);
      let pTxCount = 0,
        pBalance = 0;
      if (pRaw) {
        try {
          const pd = JSON.parse(pRaw);
          pTxCount = (pd.transactions || []).length;
          const inc = (pd.transactions || [])
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + t.amountRub, 0);
          const exp = (pd.transactions || [])
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + t.amountRub, 0);
          pBalance = inc - exp;
        } catch (e) {}
      } else if (isActive) {
        let inc = 0,
          exp = 0;
        transactions.forEach((t) => {
          if (t.type === "income") inc += t.amountRub;
          else exp += t.amountRub;
        });
        pBalance = inc - exp;
        pTxCount = transactions.length;
      }
      const accentColor = p.color || "#2d6a4f";

      let buttonsHtml = "";
      if (currentUserRole === "owner" || currentUserRole === "user") {
        buttonsHtml = `
          ${!isActive && !isGuest ? `<button class="icon-btn edit" data-switchpid="${p.id}" style="width:34px;height:34px;font-size:14px;" title="${t("profileSwitch")}">▶</button>` : ""}
          <button class="icon-btn edit" data-renamepid="${p.id}" style="width:34px;height:34px;font-size:14px;" title="${t("profileRename")}">✏️</button>
          <button class="icon-btn edit" data-sharepid="${p.id}" style="width:34px;height:34px;font-size:14px;background:var(--primary-pale);color:var(--primary);" title="${t("shareTitle")}">🔗</button>
          ${profiles.length > 1 && p.id !== "default" ? `<button class="icon-btn delete" data-deletepid="${p.id}" style="width:34px;height:34px;font-size:14px;" title="${t("profileDelete")}">🗑</button>` : ""}
        `;
      } else if (currentUserRole === "guest") {
        if (isActive) {
          buttonsHtml = `<button class="icon-btn edit" data-renamepid="${p.id}" style="width:34px;height:34px;font-size:14px;" title="${t("profileRename")}">✏️</button>`;
        }
      }

      return `<div style="display:flex;align-items:center;gap:12px;padding:12px;margin-bottom:8px;background:${
        isActive ? "var(--primary-pale)" : "var(--cream-dark)"
      };border-radius:16px;border:2px solid ${
        isActive ? "var(--primary)" : "var(--cream-border)"
      };">
      <div style="width:44px;height:44px;border-radius:50%;background:${accentColor};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${
        p.emoji || "👤"
      }</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:15px;font-weight:800;color:var(--text);">${esc(p.name)}${
          isActive
            ? ` <span style="font-size:11px;font-weight:700;color:var(--primary);background:var(--primary-pale);padding:2px 8px;border-radius:99px;">${t("profileActive")}</span>`
            : ""
        }</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${pTxCount} ${t("statsRec")} · ${fmt(pBalance)}</div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;">${buttonsHtml}</div>
    </div>`;
    })
    .join("");

  // Кнопки выхода / возврата только для владельца
  const isOwnerInGuestMode =
    activeProf?.role === "owner" && activeProf?.isShared === true;
  const isOwnerInOtherProfile =
    currentUserRole === "owner" &&
    activeProf?.id !== "default" &&
    !activeProf?.isShared;

  let actionBtn = "";
  if (isOwnerInGuestMode) {
    actionBtn = `
      <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--cream-border);">
        <button class="btn-primary" id="exitGuestModeBtn" style="width:100%; background:var(--expense-color);">🚪 ${t("exitGuestMode")}</button>
      </div>
    `;
  } else if (isOwnerInOtherProfile) {
    actionBtn = `
      <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--cream-border);">
        <button class="btn-primary" id="backToMainProfileBtn" style="width:100%; background:var(--gold);">👑 Вернуться в главный профиль</button>
      </div>
    `;
  }

  return profilesHtml + actionBtn;
}

// ============================================================
// БИОМЕТРИЯ (WebAuthn)
// ============================================================
async function isBiometryAvailable() {
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (e) {
    return false;
  }
}

async function biometryRegister() {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "БюджетPRO", id: location.hostname || "localhost" },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: "user",
          displayName: "Пользователь",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
      },
    });
    if (!cred) return null;
    biometryCredId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
    biometryEnabled = true;
    saveAll();
    return true;
  } catch (e) {
    console.warn("biometry register:", e);
    return null;
  }
}

async function biometryVerify() {
  if (!biometryCredId) return false;
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const rawId = Uint8Array.from(atob(biometryCredId), (c2) =>
      c2.charCodeAt(0),
    );
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: location.hostname || "localhost",
        allowCredentials: [{ type: "public-key", id: rawId }],
        userVerification: "required",
        timeout: 60000,
      },
    });
    return !!assertion;
  } catch (e) {
    console.warn("biometry verify:", e);
    return false;
  }
}

// ============================================================
// ПИН-КОД
// ============================================================
async function hashPin(pin) {
  const data = new TextEncoder().encode(pin + "budget_salt_2024");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function openEditTemplateModal(tplIdx) {
  const tpl = userTemplates[tplIdx];
  if (!tpl) return;
  const iType = tpl.type || "expense";
  const cats =
    iType === "expense"
      ? Object.keys(categories)
      : Object.keys(incomeCategories);
  const html = `
    <div class="field-group"><label class="field-label">${t("type")}</label>
      <div class="type-toggle">
        <button class="type-btn expense${iType === "expense" ? " active" : ""}" data-type="expense">${t("expenseType")}</button>
        <button class="type-btn income${iType === "income" ? " active" : ""}" data-type="income">${t("incomeType")}</button>
      </div></div>
    <div class="field-group"><label class="field-label">${t("category")}</label>
      <select id="etCat" class="modal-select">
        ${cats.map((c2) => `<option value="${c2}"${c2 === tpl.category ? " selected" : ""}>${c2}</option>`).join("")}
      </select></div>
    <div class="field-group"><label class="field-label">${t("amount")} (${sym()})</label>
      <input type="number" id="etAmt" class="modal-input" value="${toDisp(tpl.amountRub || 0).toFixed(2)}" min="0.01" step="any"></div>
    <div class="field-group"><label class="field-label">${t("note")}</label>
      <input type="text" id="etNote" class="modal-input" value="${esc(tpl.note || "")}"></div>
    <div class="modal-actions">
      <button class="btn-secondary" id="etCancel">${t("cancel")}</button>
      <button class="btn-primary" id="etSave">💾 ${t("save")}</button>
    </div>`;
  const modal = createModal("etModal", t("edit"), html);
  document.body.appendChild(modal);
  openModal("etModal");
  let curType = iType;
  modal.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      curType = btn.dataset.type;
      modal
        .querySelectorAll(".type-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const newCats =
        curType === "expense"
          ? Object.keys(categories)
          : Object.keys(incomeCategories);
      document.getElementById("etCat").innerHTML = newCats
        .map((c2) => `<option value="${c2}">${c2}</option>`)
        .join("");
    });
  });
  document
    .getElementById("etCancel")
    ?.addEventListener("click", () => closeModal("etModal"));
  document.getElementById("etSave")?.addEventListener("click", () => {
    const amt = parseFloat(document.getElementById("etAmt").value);
    const cat = document.getElementById("etCat").value;
    if (!cat || isNaN(amt) || amt <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    tpl.type = curType;
    tpl.category = cat;
    tpl.amountRub = toRub(amt);
    tpl.note = document.getElementById("etNote").value.trim();
    tpl.name = cat + " " + toDisp(tpl.amountRub).toFixed(0) + " " + sym();
    saveAll();
    closeModal("etModal");
    renderSettings();
    showToast(t("saved"));
    haptic("success");
  });
}

function renderSettings() {
  // === Принудительно убираем обрезание для галочек тем ===
  setTimeout(() => {
    document.querySelectorAll('.set-theme-check').forEach(check => {
      let el = check.parentElement;
      while (el && el !== document.body) {
        el.style.setProperty('overflow', 'visible', 'important');
        el.style.setProperty('clip', 'unset', 'important');
        el = el.parentElement;
      }
    });
  }, 0);
  const cs = getCreatorSettings();
  const canContact = cs.contactEnabled !== false;
  const L = currentLang;

  // ── Активный профиль ──
  const activeProf = profiles.find((p) => p.id === activeProfileId) || {
    name: "Я",
    emoji: "👤",
    color: "#a78bfa",
  };
  let totalInc = 0,
    totalExp = 0;
  transactions.forEach((tx) => {
    if (tx.type === "income") totalInc += tx.amountRub;
    else totalExp += tx.amountRub;
  });
  const profBal = totalInc - totalExp;
  const profBalStr =
    (profBal >= 0 ? "+" : "−") + sym() + fmt(Math.abs(profBal));

  const html = `
  <!-- ═══ ПРОФИЛЬ ═══ -->
  <div class="set-profile-card" id="sec-profiles">
    <div class="set-prof-av" style="background:${activeProf.color || "#a78bfa"}">${activeProf.emoji || "👤"}</div>
    <div class="set-prof-info">
      <div class="set-prof-name">${esc(activeProf.name || "Я")}</div>
      <div class="set-prof-sub">${transactions.filter((t) => !t._initial).length} ${
        { ru: "записей", en: "records", ka: "ჩანაწ." }[L]
      } · ${profBalStr}</div>
    </div>
    <button class="set-prof-switch" id="profileSwitchBtn">
      ${profiles.length > 1 ? { ru: "Сменить", en: "Switch", ka: "შეცვ." }[L] : { ru: "Добавить", en: "Add", ka: "დამ." }[L]}
    </button>
  </div>

  <!-- ═══ УПРОЩЁННЫЙ РЕЖИМ (самая заметная кнопка) ═══ -->
  <div class="set-simple-toggle" id="sec-access">
    <div class="set-simple-left">
      <div class="set-simple-ico">🌟</div>
      <div>
        <div class="set-simple-title">${t("simpleMode")}</div>
        <div class="set-simple-sub">${t("simpleModeDesc")}</div>
      </div>
    </div>
    <label class="switch"><input type="checkbox" id="simpleModeToggle" ${simpleMode ? "checked" : ""}><span class="slider round"></span></label>
  </div>

  <!-- ═══ ОФОРМЛЕНИЕ ═══ -->
  <div class="set-section-title" id="sec-appearance">${{ ru: "🎨 Оформление", en: "🎨 Appearance", ka: "🎨 გარემო" }[L]}</div>
  <div class="set-card">
    <div class="set-row">
      <div class="set-row-ico">🌙</div>
      <div class="set-row-label">${t("theme")}</div>
      <select id="themeSelect" class="settings-select set-inline-select">
        <option value="light">${t("light")}</option>
        <option value="dark">${t("dark")}</option>
      </select>
    </div>
  </div>

  <!-- Свотчи тем прямо на экране -->
  <div class="set-themes-wrap">
    <div class="set-themes-label">${t("themeDay")}</div>
    <div class="set-themes-row">
      ${["white", "default", "sunset", "ocean"]
        .map((k) => {
          const th = COLOR_THEMES[k];
          const labels = tObj("themeLabels");
          const descs = tObj("themeDescs");
          const icons = {
            white: "☀️",
            default: "🌅",
            sunset: "💫",
            ocean: "🌊",
          };
          const acc = th.accent || th.vars["--primary"] || "#a78bfa";
          const med = th.vars["--primary-med"] || acc;
          const active = colorTheme === k;
          return `<button class="set-theme-sw${active ? " active" : ""}" data-theme="${k}" style="${active ? "border-color:" + acc + ";" : ""}">
          <div class="set-theme-dot" style="background:linear-gradient(135deg,${acc},${med})">${icons[k]}</div>
          <div class="set-theme-lbl">${labels[k] || k}</div>
          ${active ? `<div class="set-theme-check" style="background:${acc}">✓</div>` : ""}
        </button>`;
        })
        .join("")}
    </div>
    <div class="set-themes-label" style="margin-top:12px">${t("themeNight")}</div>
    <div class="set-themes-row">
      ${["dark", "navy", "gold"]
        .map((k) => {
          const th = COLOR_THEMES[k];
          const labels = tObj("themeLabels");
          const descs = tObj("themeDescs");
          const icons = { dark: "🌙", navy: "🌌", gold: "✨" };
          const acc = th.accent || th.vars["--primary"] || "#a78bfa";
          const med = th.vars["--primary-med"] || acc;
          const active = colorTheme === k;
          return `<button class="set-theme-sw${active ? " active" : ""}" data-theme="${k}" style="${active ? "border-color:" + acc + ";" : ""}">
          <div class="set-theme-dot" style="background:linear-gradient(135deg,${acc},${med})">${icons[k]}</div>
          <div class="set-theme-lbl">${labels[k] || k}</div>
          ${active ? `<div class="set-theme-check" style="background:${acc}">✓</div>` : ""}
        </button>`;
        })
        .join("")}
    </div>
    <button class="set-reset-theme-btn" id="resetThemeBtn">${t("resetThemeBtn")}</button>
  </div>

  <!-- ═══ ОСНОВНЫЕ ═══ -->
  <div class="set-section-title" id="sec-general">${{ ru: "⚙️ Основные", en: "⚙️ General", ka: "⚙️ ზოგადი" }[L]}</div>
  <div class="set-card">
    <div class="set-row">
      <div class="set-row-ico">💱</div>
      <div class="set-row-label">${t("currency")}</div>
      <select id="currencySelect" class="settings-select set-inline-select">
        <option value="RUB">🇷🇺 ${t("currRUB")}</option>
        <option value="USD">🇺🇸 ${t("currUSD")}</option>
        <option value="EUR">🇪🇺 ${t("currEUR")}</option>
        <option value="GEL">🇬🇪 ${t("currGEL")}</option>
        <option value="GBP">🇬🇧 ${t("currGBP")}</option>
        <option value="KZT">🇰🇿 ${t("currKZT")}</option>
      </select>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">🌍</div>
      <div class="set-row-label">${t("language")}</div>
      <select id="langSelect" class="settings-select set-inline-select">
        <option value="ru">🇷🇺 Русский</option>
        <option value="en">🇬🇧 English</option>
        <option value="ka">🇬🇪 ქართული</option>
      </select>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">📳</div>
      <div class="set-row-label">${t("hapticLabel")}</div>
      <label class="switch"><input type="checkbox" id="hapticToggle" ${hapticEnabled ? "checked" : ""}><span class="slider round"></span></label>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">✨</div>
      <div class="set-row-label">${t("animationsLabel")}</div>
      <label class="switch"><input type="checkbox" id="animationsToggle" ${animationsEnabled ? "checked" : ""}><span class="slider round"></span></label>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">📌</div>
      <div class="set-row-label set-row-label-sub">
        <span>${{ ru: "Быстрые предложения", en: "Quick suggestions", ka: "სწრაფი წინ." }[L]}</span>
        <span class="set-row-sub">${{ ru: "Шаблоны в форме добавления", en: "Templates in add form", ka: "შაბლონები ფორმაში" }[L]}</span>
      </div>
      <label class="switch"><input type="checkbox" id="suggestionsToggle" ${suggestionsEnabled ? "checked" : ""}><span class="slider round"></span></label>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">🕐</div>
      <div class="set-row-label set-row-label-sub">
        <span>${{ ru: "12-часовой формат", en: "12-hour format", ka: "12-სთ. ფორმატი" }[L]}</span>
        <span class="set-row-sub">AM/PM</span>
      </div>
      <label class="switch"><input type="checkbox" id="time12hToggle" ${localStorage.getItem("timeFormat12h") === "true" ? "checked" : ""}><span class="slider round"></span></label>
    </div>
  </div>

  <!-- Размер шрифта -->
  <div class="set-card" style="padding:14px 16px">
    <div class="set-row-label" style="margin-bottom:10px;font-size:14px;font-weight:700">${t("fontSizeLabel")}</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      ${["small", "normal", "large", "xl"]
        .map(
          (s) => `<button class="font-size-btn set-font-btn" data-size="${s}"
        style="padding:10px 4px;border-radius:12px;border:2px solid ${fontSize === s ? "var(--primary)" : "var(--cream-border)"};
        background:${fontSize === s ? "var(--primary-pale)" : "var(--cream-dark)"};
        font-size:${s === "small" ? "12px" : s === "normal" ? "14px" : s === "large" ? "17px" : "20px"};
        font-weight:700;cursor:pointer;font-family:inherit;color:var(--text);">
        ${t("font" + s.charAt(0).toUpperCase() + s.slice(1))}</button>`,
        )
        .join("")}
    </div>
  </div>

  <!-- ═══ БЕЗОПАСНОСТЬ ═══ -->
  <div class="set-section-title" id="sec-security">${{ ru: "🔒 Безопасность", en: "🔒 Security", ka: "🔒 უსაფრთხ." }[L]}</div>
  <div class="set-card">
    <div class="set-row">
      <div class="set-row-ico">🔐</div>
      <div class="set-row-label set-row-label-sub">
        <span>${t("pinCode")}</span>
        <span class="set-row-sub">${{ ru: "Защитите от чужих глаз", en: "Protect from others", ka: "სხვებისგან დასაცავად" }[L]}</span>
      </div>
      <label class="switch"><input type="checkbox" id="pinToggle" ${pinEnabled ? "checked" : ""}><span class="slider round"></span></label>
    </div>
    ${
      pinEnabled
        ? `<div class="set-row set-row-divider">
      <div class="set-row-ico">🔑</div>
      <div class="set-row-label">${t("pinChange")}</div>
      <button class="set-action-btn" id="changePinBtn">›</button>
    </div>`
        : ""
    }
    <div class="set-row set-row-divider" id="biometryCard">
      <div class="set-row-ico">👆</div>
      <div class="set-row-label set-row-label-sub">
        <span>${t("biometryTitle")}</span>
        <span class="set-row-sub" id="bioStatusText">${t("loading")}</span>
      </div>
      <label class="switch"><input type="checkbox" id="biometryToggle" ${biometryEnabled ? "checked" : ""}><span class="slider round"></span></label>
    </div>
  </div>

  <!-- ═══ ГОЛОС И ФУНКЦИИ ═══ -->
  <div class="set-section-title">${{ ru: "✨ Расширенные функции", en: "✨ Advanced", ka: "✨ გაფართ." }[L]}</div>
  <div class="set-card">
    <div class="set-row">
      <div class="set-row-ico">🎤</div>
      <div class="set-row-label set-row-label-sub">
        <span>${{ ru: "Голосовой ввод", en: "Voice input", ka: "ხმოვ. შეყ." }[L]}</span>
        <span class="set-row-sub">Chrome ${{ ru: "на Android", en: "on Android", ka: "Android-ზე" }[L]}</span>
      </div>
      <label class="switch"><input type="checkbox" id="showVoiceBtnToggle" ${localStorage.getItem("showVoiceBtn") !== "false" ? "checked" : ""}><span class="slider round"></span></label>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">🎯</div>
      <div class="set-row-label set-row-label-sub">
        <span>${{ ru: "Кнопка целей", en: "Goals button", ka: "მიზნების ღ." }[L]}</span>
        <span class="set-row-sub">${{ ru: "Плавающая кнопка", en: "Floating button", ka: "მცოც. ღილ." }[L]}</span>
      </div>
      <label class="switch"><input type="checkbox" id="showGoalsBtnToggle" ${localStorage.getItem("showGoalsBtn") !== "false" ? "checked" : ""}><span class="slider round"></span></label>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">🎤</div>
      <div class="set-row-label">${{ ru: "Использовать голос сейчас", en: "Use voice now", ka: "ხმა ახლა" }[L]}</div>
      <button class="set-action-btn" id="voiceDirectBtn">›</button>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">🎯</div>
      <div class="set-row-label">${{ ru: "Открыть цели", en: "Open goals", ka: "მიზნები" }[L]}</div>
      <button class="set-action-btn" id="goalsDirectBtn">›</button>
    </div>
  </div>

  <!-- ═══ ПРОФИЛИ ═══ -->
  <div class="set-section-title">${{ ru: "👤 Профили", en: "👤 Profiles", ka: "👤 პროფ." }[L]}</div>
  <div class="set-card">
    <div class="set-card-body" id="profilesBody">
      ${renderProfilesBody()}
      ${
        profiles.length < 10
          ? `<button class="set-full-btn set-full-btn-primary" id="addProfileBtn" style="margin-top:10px">${t("addProfile")}</button>`
          : `<div style="color:var(--text-muted);font-size:13px;margin-top:8px">${t("profilesMax")}</div>`
      }
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--cream-border)">
        <button class="set-full-btn" id="connectProfileBtn">🔗 ${t("connectProfile")}</button>
      </div>
    </div>
  </div>

  <!-- ═══ БЮДЖЕТЫ И ШАБЛОНЫ ═══ -->
  <div class="set-section-title" id="sec-budgets">${{ ru: "💰 Бюджеты", en: "💰 Budgets", ka: "💰 ბიუჯ." }[L]}</div>
  <div class="set-card">
    <div class="set-card-body" id="budgetsBody">${renderBudgetsBody()}</div>
    <button class="set-full-btn set-full-btn-primary" id="addBudgetBtn" style="margin:0 16px 14px">${t("addBudget")}</button>
  </div>
  <div class="set-section-title">${{ ru: "🔄 Повторяющиеся", en: "🔄 Recurring", ka: "🔄 განმეო." }[L]}</div>
  <div class="set-card">
    <div class="set-card-body" id="recurringBody">${renderRecurringBody()}</div>
    <button class="set-full-btn set-full-btn-primary" id="addRecurringBtn" style="margin:0 16px 14px">${t("addRecurring")}</button>
  </div>
  <div class="set-section-title">${{ ru: "📋 Шаблоны", en: "📋 Templates", ka: "📋 შაბლ." }[L]}</div>
  <div class="set-card">
    <div class="set-card-body" id="templatesBody">${renderTemplatesBody()}</div>
  </div>

  <!-- ═══ ДАННЫЕ ═══ -->
  <div class="set-section-title" id="sec-data">${{ ru: "💾 Данные", en: "💾 Data", ka: "💾 მონ." }[L]}</div>
  <div class="set-card">
    <div class="set-row">
      <div class="set-row-ico">🔄</div>
      <div class="set-row-label">${t("updateRates")}</div>
      <button class="set-action-btn" id="refreshRatesBtn">›</button>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">📤</div>
      <div class="set-row-label">${t("exportJSON")}</div>
      <button class="set-action-btn" id="exportJSONBtn">›</button>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">📥</div>
      <div class="set-row-label">${t("importJSON")}</div>
      <button class="set-action-btn" id="importJSONBtn">›</button>
    </div>
    <input type="file" id="importFileInput" accept=".json" style="display:none">
    <div class="set-row set-row-divider">
      <div class="set-row-ico">📊</div>
      <div class="set-row-label">${t("exportCSV")}</div>
      <button class="set-action-btn" id="exportCSVBtn">›</button>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">📄</div>
      <div class="set-row-label">${t("exportPDF")}</div>
      <button class="set-action-btn" id="exportPDFBtn">›</button>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">☁️</div>
      <div class="set-row-label">${t("cloudSave")}</div>
      <button class="set-action-btn" id="cloudSaveBtn">›</button>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">⬇️</div>
      <div class="set-row-label">${t("cloudLoad")}</div>
      <button class="set-action-btn" id="cloudLoadBtn">›</button>
    </div>
    <div class="set-row set-row-divider">
      <div class="set-row-ico">🔌</div>
      <div class="set-row-label">${{ ru: "Переподключить WebSocket", en: "Reconnect WebSocket", ka: "WebSocket" }[L]}</div>
      <button class="set-action-btn" id="reconnectWsBtn">›</button>
    </div>
  </div>

  <!-- ═══ НАПОМИНАНИЯ ═══ -->
  <div class="set-section-title">${t("reminders")}</div>
  <div class="set-card" style="padding:16px">
    <div style="border-radius:12px;padding:12px 14px;margin-bottom:14px;background:${
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
        ? "var(--income-pale)"
        : "var(--cream-dark)"
    };
      border:1.5px solid ${typeof Notification !== "undefined" && Notification.permission === "granted" ? "var(--income-color)" : "var(--cream-border)"};">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:22px;">${typeof Notification !== "undefined" && Notification.permission === "granted" ? "✅" : typeof Notification !== "undefined" && Notification.permission === "denied" ? "🚫" : "🔔"}</span>
        <span style="font-size:14px;font-weight:700;color:var(--text);">${typeof Notification !== "undefined" && Notification.permission === "granted" ? t("notifGranted") : typeof Notification !== "undefined" && Notification.permission === "denied" ? t("notifDenied") : t("notifDefault")}</span>
        ${typeof Notification !== "undefined" && Notification.permission !== "granted" ? `<button id="requestNotifBtn" class="btn-primary" style="margin-left:auto;padding:8px 14px;font-size:13px;">${t("notifRequest")}</button>` : ""}
      </div>
    </div>
    <div id="namedRemindersList">
      ${(() => {
        const list = JSON.parse(localStorage.getItem("namedReminders") || "[]");
        if (!list.length)
          return `<div style="font-size:13px;color:var(--text-muted);padding:8px 0 16px;">${t("noReminders")}</div>`;
        return list
          .map(
            (
              r,
              i,
            ) => `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:${r.fired ? "var(--cream-dark)" : "var(--income-pale)"};border:1.5px solid ${r.fired ? "var(--cream-border)" : "var(--income-color)"};border-radius:12px;margin-bottom:8px;">
          <div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(r.name || "🔔")}</div>
          <div style="font-size:11px;color:var(--text-muted);">${new Date(r.ts).toLocaleString(L === "en" ? "en-US" : L === "ka" ? "ka-GE" : "ru-RU")}</div></div>
          <span style="font-size:12px;color:${r.fired ? "var(--text-muted)" : "var(--income-color)"};font-weight:700;">${r.fired ? { ru: "✓ Готово", en: "✓ Done", ka: "✓ შეს." }[L] : { ru: "⏰ Ждёт", en: "⏰ Pending", ka: "⏰ ელ." }[L]}</span>
          <button class="named-reminder-del" data-idx="${i}" style="background:var(--expense-pale);border:none;border-radius:8px;width:28px;height:28px;color:var(--expense-color);cursor:pointer;font-size:14px;flex-shrink:0;">✕</button>
        </div>`,
          )
          .join("");
      })()}
    </div>
    <div style="background:var(--cream-dark);border-radius:14px;padding:14px;border:1.5px solid var(--cream-border);margin-top:4px">
      <div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:12px">➕ ${t("add")}</div>
      <div class="field-group" style="margin-bottom:10px"><label class="field-label">${t("reminderName")}</label>
        <input type="text" id="newReminderName" class="modal-input" placeholder="${t("reminderNamePlaceholder")}"></div>
      <div class="field-group" style="margin-bottom:12px"><label class="field-label">${t("reminderDateTime")}</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="hidden" id="newReminderDatetime" value="">
          <button type="button" id="reminderDateBtn" class="modal-input" style="flex:1;text-align:left;background:var(--cream-dark);border:2px solid var(--cream-border);border-radius:var(--radius-md);padding:12px 14px;cursor:pointer;font-family:inherit;font-size:15px;color:var(--text);">📅 <span id="reminderDateText">${t("chooseDate")}</span></button>
          <button type="button" id="reminderTimeBtn" class="modal-input" style="flex:1;text-align:left;background:var(--cream-dark);border:2px solid var(--cream-border);border-radius:var(--radius-md);padding:12px 14px;cursor:pointer;font-family:inherit;font-size:15px;color:var(--text);">🕒 <span id="reminderTimeText">${t("chooseTimeBtn")}</span></button>
          <input type="time" id="nativeTimeInput" class="modal-input" style="position:absolute;opacity:0;pointer-events:none;width:0;height:0;" value="09:00">
        </div></div>
      <div style="display:flex;gap:8px">
        <button id="addNamedReminderBtn" class="btn-primary" style="flex:1;padding:13px">⏰ ${t("scheduleReminder")}</button>
        <button id="testNotifBtn" class="btn-secondary" style="padding:13px;font-size:12px;white-space:nowrap">🔔 ${{ ru: "Тест", en: "Test", ka: "ტ." }[L]}</button>
      </div>
    </div>
    <!-- Интервальные напоминания -->
    <div style="margin-top:16px">
      <div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:10px">🔁 ${t("recurringShort")}</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[
          {
            val: "1h",
            label: { ru: "Каждый час", en: "Every hour", ka: "ყ.საათ." },
          },
          {
            val: "2h",
            label: { ru: "Каждые 2 часа", en: "Every 2h", ka: "ყ.2სთ." },
          },
          {
            val: "5h",
            label: { ru: "Каждые 5 часов", en: "Every 5h", ka: "ყ.5სთ." },
          },
          {
            val: "daily",
            label: { ru: "Каждый день", en: "Daily", ka: "ყოვ." },
          },
          {
            val: "every3days",
            label: { ru: "Каждые 3 дня", en: "Every 3 days", ka: "ყ.3დ." },
          },
          {
            val: "weekly",
            label: { ru: "Каждую неделю", en: "Weekly", ka: "ყ.კვ." },
          },
        ]
          .map(
            (
              opt,
            ) => `<label style="display:flex;align-items:center;gap:12px;padding:9px 12px;background:var(--card-bg);border:1.5px solid var(--cream-border);border-radius:10px;cursor:pointer;">
            <input type="checkbox" class="reminder-interval-checkbox" data-val="${opt.val}" ${reminderIntervals?.[opt.val] ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--primary);flex-shrink:0;">
            <span style="font-size:14px;font-weight:600;color:var(--text)">${opt.label[L] || opt.label.ru}</span>
          </label>`,
          )
          .join("")}
      </div>
    </div>
  </div>

  ${
    canContact
      ? `
  <div class="set-section-title">${t("supportTitle")}</div>
  <div class="set-card">
    <div class="set-row"><div class="set-row-ico">💬</div><div class="set-row-label">${t("supportTitle")}</div><button class="set-action-btn" id="openSupportBtn">›</button></div>
  </div>`
      : ``
  }

  <!-- ═══ ОПАСНАЯ ЗОНА ═══ -->
  <div class="set-section-title" style="color:#f87171">${t("dangerZone")}</div>
  <div class="set-card set-danger-card">
    <div class="set-row">
      <div class="set-row-ico">🗑</div>
      <div class="set-row-label" style="color:#f87171">${t("resetAll")}</div>
      <button class="set-action-btn set-action-danger" id="clearAllBtn">›</button>
    </div>
  </div>

  <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">${t("appFooterVersion")}</div>`;

  document.getElementById("mainContent").innerHTML = html;

  // ── Восстанавливаем значения select-ов ──
  const cs2 = document.getElementById("currencySelect");
  if (cs2) cs2.value = displayCurrency;
  const ts = document.getElementById("themeSelect");
  if (ts)
    ts.value = document.body.classList.contains("dark") ? "dark" : "light";
  const ls = document.getElementById("langSelect");
  if (ls) ls.value = currentLang;

  // ── Валюта ──
  cs2?.addEventListener("change", (e) => {
    displayCurrency = e.target.value;
    saveAll();
    updateTopBlocks();
    showToast(t("currencyChanged"));
  });

  // ── Тема (тёмная/светлая) ──
  ts?.addEventListener("change", (e) => {
    const isDark = e.target.value === "dark";
    if (isDark) {
      document.body.classList.add("dark");
      if (!COLOR_THEMES[colorTheme]?.dark) applyColorTheme("dark");
    } else {
      document.body.classList.remove("dark");
      if (COLOR_THEMES[colorTheme]?.dark) applyColorTheme("default");
    }
    localStorage.setItem("theme", e.target.value);
    showToast(t("themeChanged"));
  });

  // ── Язык ──
  ls?.addEventListener("change", (e) => setLanguage(e.target.value));

  // ── Свотчи тем ──
  document.querySelectorAll(".set-theme-sw").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyColorTheme(btn.dataset.theme);
      showToast(
        "🎨 " + (tObj("themeLabels")[btn.dataset.theme] || btn.dataset.theme),
      );
      setTimeout(() => renderSettings(), 300);
    });
  });

  // ── Сброс темы ──
  document.getElementById("resetThemeBtn")?.addEventListener("click", () => {
    applyColorTheme(
      document.body.classList.contains("dark") ? "dark" : "default",
    );
    showToast("🔄 " + t("resetThemeBtn"));
    setTimeout(() => renderSettings(), 300);
  });

  // ── Профиль ──
  document.getElementById("profileSwitchBtn")?.addEventListener("click", () => {
    document
      .getElementById("profilesBody")
      ?.scrollIntoView({ behavior: "smooth" });
  });

  // ── PIN ──
  document
    .getElementById("pinToggle")
    ?.addEventListener("change", async (e) => {
      if (e.target.checked) {
        const created = await openPinSetModal();
        if (!created) e.target.checked = false;
      } else {
        askConfirm(t("pinDisable"), async () => {
          pinHash = null;
          pinEnabled = false;
          saveAll();
          showToast(t("pinDisabled"));
          renderSettings();
        });
        e.target.checked = pinEnabled;
      }
    });
  document
    .getElementById("changePinBtn")
    ?.addEventListener("click", () => openPinSetModal(true));

  // ── Упрощённый режим ──
  document
    .getElementById("simpleModeToggle")
    ?.addEventListener("change", (e) => {
      applySimpleMode(e.target.checked);
      showToast(e.target.checked ? t("simpleModeOn") : t("simpleModeOff"));
      renderSettings();
    });

  // ── Анимации ──
  document
    .getElementById("animationsToggle")
    ?.addEventListener("change", (e) => {
      animationsEnabled = e.target.checked;
      localStorage.setItem("animationsEnabled", animationsEnabled);
      showToast(t("saved"));
    });

  // ── Вибрация ──
  document.getElementById("hapticToggle")?.addEventListener("change", (e) => {
    hapticEnabled = e.target.checked;
    localStorage.setItem("hapticEnabled", hapticEnabled);
    if (hapticEnabled) haptic("medium");
    showToast(t("saved"));
  });

  // ── Предложения ──
  document
    .getElementById("suggestionsToggle")
    ?.addEventListener("change", (e) => {
      suggestionsEnabled = e.target.checked;
      localStorage.setItem("suggestionsEnabled", suggestionsEnabled);
      showToast(
        suggestionsEnabled
          ? {
              ru: "Предложения включены",
              en: "Suggestions on",
              ka: "ჩართულია",
            }[currentLang]
          : {
              ru: "Предложения скрыты",
              en: "Suggestions off",
              ka: "გამორთულია",
            }[currentLang],
      );
    });

  // ── 12ч формат ──
  document
    .getElementById("time12hToggle")
    ?.addEventListener("change", function () {
      localStorage.setItem("timeFormat12h", this.checked ? "true" : "false");
      haptic("light");
      showToast(
        {
          ru: "Формат времени изменён",
          en: "Time format changed",
          ka: "დრ. ფ. შეიცვალა",
        }[currentLang],
        "success",
      );
    });

  // ── Голос ──
  document
    .getElementById("showVoiceBtnToggle")
    ?.addEventListener("change", function () {
      localStorage.setItem("showVoiceBtn", this.checked ? "true" : "false");
      addVoiceButton();
      haptic("light");
      showToast(t("saved"));
    });
  document.getElementById("voiceDirectBtn")?.addEventListener("click", () => {
    haptic("medium");
    startVoiceInput();
  });

  // ── Цели ──
  document
    .getElementById("showGoalsBtnToggle")
    ?.addEventListener("change", function () {
      localStorage.setItem("showGoalsBtn", this.checked ? "true" : "false");
      addGoalsNavButton();
      haptic("light");
      showToast(t("saved"));
    });
  document.getElementById("goalsDirectBtn")?.addEventListener("click", () => {
    haptic("medium");
    openGoalsModal();
  });

  // ── Размер шрифта ──
  document.querySelectorAll(".font-size-btn, .set-font-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyFontSize(btn.dataset.size);
      haptic("light");
      renderSettings();
    });
  });

  // ── Бюджеты ──
  document
    .getElementById("addBudgetBtn")
    ?.addEventListener("click", openAddBudgetModal);

  // ── Повторяющиеся ──
  document
    .getElementById("addRecurringBtn")
    ?.addEventListener("click", openAddRecurringModal);

  // ── Шаблоны ──
  document
    .getElementById("templatesBody")
    ?.querySelectorAll(".tpl-delete-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        askConfirm(
          t("deleteTemplate"),
          () => {
            removeUserTemplate(parseInt(btn.dataset.id));
            renderSettings();
            showToast(t("deleted"));
          },
          { icon: "🗑️" },
        );
      });
    });

  // ── Данные ──
  document
    .getElementById("refreshRatesBtn")
    ?.addEventListener("click", async () => {
      const rb = document.getElementById("refreshRatesBtn");
      if (rb) rb.textContent = t("loading");
      try {
        const rr = await fetch(
          "https://api.exchangerate-api.com/v4/latest/RUB",
        );
        const dd = await rr.json();
        for (const c of ["USD", "EUR", "GEL", "GBP", "KZT"])
          exchangeRates[c] = dd.rates[c] || exchangeRates[c];
        saveAll();
        updateTopBlocks();
        showToast(t("ratesUpdated"));
      } catch (e) {
        showToast(t("error"), "error");
      }
      if (rb) rb.textContent = "🔄 " + t("updateRates");
    });
  document
    .getElementById("reconnectWsBtn")
    ?.addEventListener("click", () => showToast(t("websocketReconnect")));
  document
    .getElementById("exportCSVBtn")
    ?.addEventListener("click", exportToCSV);
  document
    .getElementById("exportJSONBtn")
    ?.addEventListener("click", exportToJSON);
  document
    .getElementById("exportPDFBtn")
    ?.addEventListener("click", exportToPDF);
  document.getElementById("cloudSaveBtn")?.addEventListener("click", cloudSave);
  document.getElementById("cloudLoadBtn")?.addEventListener("click", cloudLoad);
  const ifiEl = document.getElementById("importFileInput");
  document
    .getElementById("importJSONBtn")
    ?.addEventListener("click", () => ifiEl?.click());
  ifiEl?.addEventListener("change", (e) => {
    const ff = e.target.files[0];
    if (ff) {
      importFromJSON(ff);
      ifiEl.value = "";
    }
  });

  // ── Очистить всё ──
  document.getElementById("clearAllBtn")?.addEventListener("click", () => {
    askConfirm(
      t("resetConfirmMsg"),
      async () => {
        transactions = [];
        startBalanceRub = 0;
        notebookPages = [];
        categories = JSON.parse(JSON.stringify(window.initialCategories));
        incomeCategories = {
          Зарплата: { subcats: [] },
          Подарок: { subcats: [] },
          Фриланс: { subcats: [] },
        };
        calcHistory = [];
        convHistory = [];
        userTemplates = [];
        frequentStats = {};
        categoryCustomizations = {};
        categoryBudgets = {};
        recurringOps = [];
        localStorage.removeItem("welcomeSeen");
        await clearIndexedDB();
        saveAll();
        showToast(t("allDataDeleted"));
        setTimeout(() => {
          setTab("home");
          updateTopBlocks();
        }, 500);
      },
      {
        icon: "⚠️",
        title: t("resetConfirmTitle"),
        yesText: {
          ru: "Удалить навсегда",
          en: "Delete forever",
          ka: "სამ. წაშლა",
        }[currentLang],
      },
    );
  });

  // ── Поддержка ──
  document
    .getElementById("openSupportBtn")
    ?.addEventListener("click", () => openSupportModal());

  // ── Профили ──
  const pbElNew = document.getElementById("profilesBody");
  if (pbElNew) {
    pbElNew
      .querySelectorAll("[data-switchpid]")
      .forEach((b) =>
        b.addEventListener("click", () => switchProfile(b.dataset.switchpid)),
      );
    pbElNew.querySelectorAll("[data-sharepid]").forEach((b) =>
      b.addEventListener("click", () => {
        const pp = profiles.find((x) => x.id === b.dataset.sharepid);
        if (pp) openShareModal(pp);
      }),
    );
    pbElNew.querySelectorAll("[data-renamepid]").forEach((b) =>
      b.addEventListener("click", () => {
        const pp = profiles.find((x) => x.id === b.dataset.renamepid);
        if (pp) openProfileEditModal(pp);
      }),
    );
    document
      .getElementById("addProfileBtn")
      ?.addEventListener("click", () => openProfileEditModal(null));
    document
      .getElementById("connectProfileBtn")
      ?.addEventListener("click", () => openConnectModal());
    document
      .getElementById("exitGuestModeBtn")
      ?.addEventListener("click", () => exitGuestMode());
    document
      .getElementById("backToLocalProfileBtn")
      ?.addEventListener("click", () => {
        let lp = profiles.find((p) => p.guestCreated);
        if (!lp) {
          lp = {
            id: "guest_local_" + Date.now(),
            name: "Мой профиль",
            emoji: "👤",
            color: "#a78bfa",
            role: "user",
            guestCreated: true,
          };
          profiles.push(lp);
          saveAll();
        }
        sharedAccessProfile = null;
        saveGlobal();
        switchProfile(lp.id);
        showToast(t("ownProfileToast"));
      });
    document
      .getElementById("backToMainProfileBtn")
      ?.addEventListener("click", () => {
        const mp = profiles.find((p) => p.id === "default");
        if (mp) switchProfile(mp.id);
        else showToast(t("noMainProfileFound"), "error");
      });
  }

  // ── Биометрия ──
  (async () => {
    if (!document.getElementById("biometryCard")) return;
    const avl = await isBiometryAvailable();
    const seEl = document.getElementById("bioStatusText");
    if (seEl) {
      seEl.textContent = avl
        ? t("biometrySupported")
        : t("biometryNotSupported");
      if (avl) seEl.style.color = "var(--income-color)";
    }
    const btEl = document.getElementById("biometryToggle");
    if (btEl) {
      if (!avl) {
        btEl.disabled = true;
        btEl.parentElement.style.opacity = "0.5";
      }
      btEl.addEventListener("change", async (e) => {
        if (e.target.checked) {
          if (!avl) {
            showToast(t("biometryNotSupported"), "error");
            e.target.checked = false;
            return;
          }
          if (location.protocol === "file:") {
            showToast(
              {
                ru: "Биометрия требует HTTPS. Запустите через сервер.",
                en: "Biometry needs HTTPS. Use a local server.",
                ka: "საჭ. HTTPS",
              }[currentLang],
              "error",
            );
            e.target.checked = false;
            return;
          }
          const okk = await biometryRegister();
          if (okk) {
            biometryEnabled = true;
            saveAll();
            showToast("✅ " + t("biometrySupported"));
            setTimeout(() => renderSettings(), 300);
          } else {
            showToast(
              {
                ru: "Ошибка — нужен HTTPS",
                en: "Error — HTTPS required",
                ka: "შეც. HTTPS",
              }[currentLang],
              "error",
            );
            e.target.checked = false;
          }
        } else {
          askConfirm(
            t("pinDisable"),
            () => {
              biometryEnabled = false;
              biometryCredId = null;
              saveAll();
              showToast(t("pinDisabled"));
              renderSettings();
            },
            { icon: "🫆" },
          );
          e.target.checked = biometryEnabled;
        }
      });
    }
    document.getElementById("biometryResetBtn")?.addEventListener("click", () =>
      askConfirm(
        t("delete") + "?",
        () => {
          biometryEnabled = false;
          biometryCredId = null;
          saveAll();
          showToast(t("deleted"));
          renderSettings();
        },
        { icon: "🗑️" },
      ),
    );
  })();

  // ── Уведомления ──
  document.getElementById("requestNotifBtn")?.addEventListener("click", () => {
    if ("Notification" in window)
      Notification.requestPermission().then(() => renderSettings());
  });
  document
    .getElementById("notifHelpBtn")
    ?.addEventListener("click", openNotificationHelpModal);
  document
    .getElementById("notifEnableBtn")
    ?.addEventListener("click", handleNotifBtnClick);

  // ── Интервальные напоминания ──
  document.querySelectorAll(".reminder-interval-checkbox").forEach((cb) => {
    cb.addEventListener("change", () => {
      if (!reminderIntervals) reminderIntervals = {};
      reminderIntervals[cb.dataset.val] = cb.checked;
      localStorage.setItem(
        "reminderIntervals",
        JSON.stringify(reminderIntervals),
      );
      showToast(t("saved"));
    });
  });

  attachCreatorHandlers();
}

function renderBudgetsBody() {
  if (!Object.keys(categoryBudgets).length)
    return `<div style="color:var(--text-muted);font-size:14px;padding:8px 0;">${t("budgetNoBudgets")}</div>`;
  const budgetPeriod = localStorage.getItem("budget_period") || "monthly";
  const now = new Date();
  let ms;
  if (budgetPeriod === "weekly") {
    const day = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0
    ms = new Date(now);
    ms.setDate(now.getDate() - day);
    ms.setHours(0, 0, 0, 0);
  } else if (budgetPeriod === "daily") {
    ms = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else {
    ms = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  const periodL = {
    monthly: { ru: "Месяц", en: "Month", ka: "თვე" },
    weekly: { ru: "Неделя", en: "Week", ka: "კვირა" },
    daily: { ru: "День", en: "Day", ka: "დღე" },
  };
  const pl = (periodL[budgetPeriod] || periodL.monthly)[currentLang];
  const periodHeader = `<div style="display:flex;gap:8px;margin-bottom:14px;background:var(--cream-dark);padding:4px;border-radius:var(--radius-sm);">
    ${["monthly", "weekly", "daily"].map((p) => `<button data-bp="${p}" style="flex:1;padding:8px 6px;border-radius:calc(var(--radius-sm) - 4px);border:none;font-size:12px;font-weight:800;cursor:pointer;transition:all 0.2s;background:${p === budgetPeriod ? "var(--primary)" : "transparent"};color:${p === budgetPeriod ? "white" : "var(--text-muted)"};">${(periodL[p] || {})[currentLang]}</button>`).join("")}
  </div>`;
  return (
    periodHeader +
    Object.entries(categoryBudgets)
      .map(([cat, limit]) => {
        const spent = transactions
          .filter(
            (tx) =>
              tx.type === "expense" &&
              tx.category === cat &&
              tx.date &&
              new Date(tx.date + "T00:00:00") >= ms,
          )
          .reduce((s, tx) => s + tx.amountRub, 0);
        const pct = Math.min(100, Math.round((spent / limit) * 100));
        const over = spent > limit;
        const cl = over
          ? "var(--expense-color)"
          : pct > 80
            ? "var(--gold)"
            : "var(--income-color)";
        return `<div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-weight:700;font-size:14px;">${getCategoryStyle(cat, "expense").icon} ${esc(cat)}</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:13px;font-weight:700;color:${cl};">${fmt(spent)} / ${fmt(limit)}</span>
          <button class="icon-btn delete budget-del-btn" data-cat="${esc(cat)}" style="width:28px;height:28px;font-size:14px;">✕</button>
        </div>
      </div>
      <div style="height:8px;background:var(--cream-dark);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cl};border-radius:99px;transition:width .8s;"></div></div>
      ${over ? `<div style="font-size:11px;color:var(--expense-color);font-weight:700;margin-top:2px;">${t("budgetOverLimit")}</div>` : pct >= 80 ? `<div style="font-size:11px;color:var(--gold);font-weight:700;margin-top:2px;">⚠️ ${t("budgetWarning80")} (${pct}%)</div>` : ""}
    </div>`;
      })
      .join("") +
    "<script>document.querySelectorAll('.budget-del-btn').forEach(b=>b.addEventListener('click',()=>{askConfirm(t('budgetDeleteConfirm'),()=>{delete categoryBudgets[b.dataset.cat];saveAll();renderSettings();},{icon:'🗑️'})}));document.querySelectorAll('[data-bp]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('budget_period',b.dataset.bp);renderSettings();}));<\/script>"
  );
}

function renderTemplatesBody() {
  if (!userTemplates.length)
    return `<div style="color:var(--text-muted);font-size:14px;">${t("noTemplates")}</div>`;
  return userTemplates
    .map((tpl) => {
      const icon = tpl.type === "expense" ? "💸" : "💰";
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--cream-border);">
      <span style="font-size:14px;font-weight:600;">${icon} ${esc(tpl.name)}</span>
      <button class="icon-btn delete tpl-delete-btn" data-id="${tpl.id}" style="width:30px;height:30px;font-size:14px;">🗑</button>
    </div>`;
    })
    .join("");
}

function renderRecurringBody() {
  if (!recurringOps.length)
    return `<div style="color:var(--text-muted);font-size:14px;padding:8px 0;">${t("recurringNone")}</div>`;
  const freqMap = {
    monthly: t("recurringMonthly"),
    weekly: t("recurringWeekly"),
    daily: t("recurringDaily"),
  };
  return recurringOps
    .map((op, i) => {
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--cream-border);">
      <div><div style="font-size:14px;font-weight:700;">${op.type === "expense" ? "💸" : "💰"} ${esc(op.category)} — ${fmt(op.amountRub)}</div><div style="font-size:12px;color:var(--text-muted);">${freqMap[op.freq] || op.freq}${op.freq === "monthly" ? " (" + op.day + " числа)" : ""}</div></div>
      <button class="icon-btn delete rec-del-btn" data-idx="${i}" style="width:30px;height:30px;font-size:14px;">🗑</button>
    </div>`;
    })
    .join("");
}

function openPinSetModal(isChange = false) {
  const html = `
    <div style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:16px;">${t("pinSet4")}</div>
    <div id="pinSetDots" style="display:flex;gap:12px;justify-content:center;margin-bottom:12px;">${[0, 1, 2, 3].map(() => `<div style="width:18px;height:18px;border-radius:50%;border:2px solid var(--primary);background:transparent;"></div>`).join("")}</div>
    <div id="pinSetError" style="color:var(--expense-color);text-align:center;font-size:13px;font-weight:700;min-height:18px;"></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px;">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => `<button class="pin-key" data-key="${k}" style="height:56px;border-radius:14px;border:1.5px solid var(--cream-border);background:var(--card-bg);font-size:20px;font-weight:700;cursor:pointer;font-family:inherit;color:var(--text);">${k}</button>`).join("")}
    </div>
    <div class="modal-actions" style="margin-top:16px;"><button class="btn-secondary" id="pinSetCancel">${t("cancel")}</button></div>`;
  const modal = createModal("pinSetModal", t("pinSet"), html);
  document.body.appendChild(modal);
  openModal("pinSetModal");
  let step = 1,
    firstPin = "",
    entered = "";
  const dots = modal.querySelectorAll("#pinSetDots div");
  const upd = () =>
    dots.forEach((d, i) => {
      d.style.background =
        i < entered.length ? "var(--primary)" : "transparent";
    });
  const setErr = (msg) => {
    const el = document.getElementById("pinSetError");
    if (el) el.textContent = msg;
  };
  modal.querySelectorAll(".pin-key").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const k = btn.dataset.key;
      if (k === "") return;
      if (k === "⌫") {
        entered = entered.slice(0, -1);
        upd();
        return;
      }
      if (entered.length >= 4) return;
      entered += k;
      upd();
      if (entered.length === 4) {
        if (step === 1) {
          firstPin = entered;
          entered = "";
          step = 2;
          modal.querySelector(".modal-header h2").textContent = t("pinConfirm");
          dots.forEach((d) => (d.style.background = "transparent"));
          setErr("");
        } else {
          if (entered === firstPin) {
            pinHash = await hashPin(entered);
            pinEnabled = true;
            saveAll();
            showToast(t("pinSaved"));
            closeModal("pinSetModal");
            renderSettings();
            resolve(true);
          } else {
            setErr(t("pinMismatch"));
            entered = "";
            step = 1;
            firstPin = "";
            dots.forEach((d) => (d.style.background = "transparent"));
            modal.querySelector(".modal-header h2").textContent = t("pinSet");
          }
        }
      }
    });
  });
  document.getElementById("pinSetCancel").addEventListener("click", () => {
    closeModal("pinSetModal");
    if (!pinEnabled) {
      document.getElementById("pinToggle").checked = false;
    }
    resolve(false);
  });
}

function openAddBudgetModal() {
  const cats = Object.keys(categories).filter((c) => !categoryBudgets[c]);
  if (!cats.length) {
    showToast(t("allCategoriesBudgeted"));
    return;
  }
  const html = `
    <div class="field-group"><label class="field-label">${t("budgetCategory")}</label><select id="budgetCatSel" class="modal-select"><option value="">${t("selectCategory")}</option>${cats.map((c) => `<option value="${c}">${getCategoryStyle(c, "expense").icon} ${esc(c)}</option>`).join("")}</select></div>
    <div class="field-group"><label class="field-label">${t("budgetLimit")} (${sym()})</label><input type="number" id="budgetLimitInput" class="modal-input" min="1" step="any" placeholder="5000" inputmode="decimal"></div>
    <div class="modal-actions"><button class="btn-secondary" id="cancelBudget">${t("cancel")}</button><button class="btn-primary" id="saveBudget">${t("save")}</button></div>`;
  const modal = createModal("addBudgetModal", t("addBudget"), html);
  document.body.appendChild(modal);
  openModal("addBudgetModal");
  document
    .getElementById("cancelBudget")
    .addEventListener("click", () => closeModal("addBudgetModal"));
  document.getElementById("saveBudget").addEventListener("click", () => {
    const cat = document.getElementById("budgetCatSel").value;
    const limit = parseFloat(document.getElementById("budgetLimitInput").value);
    if (!cat) {
      showToast(t("selectCategoryFirst"), "error");
      return;
    }
    if (isNaN(limit) || limit <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    categoryBudgets[cat] = toRub(limit);
    saveAll();
    closeModal("addBudgetModal");
    renderSettings();
    showToast(t("saved"));
  });
}

function openAddRecurringModal() {
  const eo =
    `<option value="">${t("selectCategory")}</option>` +
    Object.keys(categories)
      .map(
        (c) =>
          `<option value="${c}">${getCategoryStyle(c, "expense").icon} ${esc(c)}</option>`,
      )
      .join("");
  const io =
    `<option value="">${t("selectCategory")}</option>` +
    Object.keys(incomeCategories)
      .map(
        (c) =>
          `<option value="${c}">${getCategoryStyle(c, "income").icon} ${esc(c)}</option>`,
      )
      .join("");
  let rType = "expense";
  const html = `
    <div class="field-group"><label class="field-label">${t("type")}</label><div class="type-toggle"><button class="type-btn expense active" data-type="expense">${t("expenseType")}</button><button class="type-btn income" data-type="income">${t("incomeType")}</button></div></div>
    <div class="field-group"><label class="field-label" id="rCatLabel">${t("expCategory")}</label><select id="rCatSel" class="modal-select">${eo}</select></div>
    <div class="field-group"><label class="field-label">${t("amount")} (${sym()})</label><input type="number" id="rAmount" class="modal-input" min="0.01" step="any" inputmode="decimal"></div>
    <div class="field-group"><label class="field-label">${t("recurringFreq")}</label><select id="rFreq" class="modal-select"><option value="monthly">${t("recurringMonthly")}</option><option value="weekly">${t("recurringWeekly")}</option><option value="daily">${t("recurringDaily")}</option></select></div>
    <div class="field-group" id="rDayDiv"><label class="field-label">${t("recurringDay")}</label><input type="number" id="rDay" class="modal-input" min="1" max="28" value="1"></div>
    <div class="field-group"><label class="field-label">${t("note")}</label><input type="text" id="rNote" class="modal-input" placeholder="${t("noteHint")}"></div>
    <div class="modal-actions"><button class="btn-secondary" id="cancelRecurring">${t("cancel")}</button><button class="btn-primary" id="saveRecurring">${t("save")}</button></div>`;
  const modal = createModal("addRecurringModal", t("addRecurring"), html);
  document.body.appendChild(modal);
  openModal("addRecurringModal");
  modal.querySelectorAll(".type-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      rType = btn.dataset.type;
      modal
        .querySelectorAll(".type-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("rCatLabel").textContent =
        rType === "expense" ? t("expCategory") : t("incCategory");
      document.getElementById("rCatSel").innerHTML =
        rType === "expense" ? eo : io;
    }),
  );
  document.getElementById("rFreq").onchange = () => {
    document.getElementById("rDayDiv").style.display =
      document.getElementById("rFreq").value === "monthly" ? "block" : "none";
  };
  document
    .getElementById("cancelRecurring")
    .addEventListener("click", () => closeModal("addRecurringModal"));
  document.getElementById("saveRecurring").addEventListener("click", () => {
    const cat = document.getElementById("rCatSel").value;
    const amt = parseFloat(document.getElementById("rAmount").value);
    const freq = document.getElementById("rFreq").value;
    const day = parseInt(document.getElementById("rDay").value) || 1;
    const note = document.getElementById("rNote").value.trim();
    if (!cat) {
      showToast(t("selectCategoryFirst"), "error");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    recurringOps.push({
      type: rType,
      category: cat,
      amountRub: toRub(amt),
      freq,
      day,
      note,
      lastApplied: null,
    });
    saveAll();
    closeModal("addRecurringModal");
    renderSettings();
    showToast(t("saved"));
  });
}

// ============================================================
// ЭКСПОРТ / ИМПОРТ / PDF / ОБЛАКО
// ============================================================
function exportToJSON() {
  const data = {
    transactions,
    startBalanceRub,
    displayCurrency,
    exchangeRates,
    notebookPages,
    categories,
    incomeCategories,
    calcHistory,
    convHistory,
    userTemplates,
    frequentStats,
    categoryCustomizations,
    categoryBudgets,
    recurringOps,
    pinHash,
    pinEnabled,
    version: "2.2",
    exportDate: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `budget_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(t("jsonExported"));
}
function importFromJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const d = JSON.parse(e.target.result);
      if (!d.transactions || !d.categories) {
        showToast(t("invalidFormat"), "error");
        return;
      }
      askConfirm(
        `Импортировать? ${d.transactions?.length || 0} операций.`,
        () => {
          transactions = d.transactions || [];
          startBalanceRub = d.startBalanceRub ?? 70000;
          displayCurrency = d.displayCurrency || "GEL";
          if (d.exchangeRates) exchangeRates = d.exchangeRates;
          notebookPages = d.notebookPages || [];
          categories = d.categories || {};
          incomeCategories = d.incomeCategories || {};
          calcHistory = d.calcHistory || [];
          convHistory = d.convHistory || [];
          userTemplates = d.userTemplates || [];
          frequentStats = d.frequentStats || {};
          categoryCustomizations = d.categoryCustomizations || {};
          categoryBudgets = d.categoryBudgets || {};
          recurringOps = d.recurringOps || [];
          if (d.pinHash) {
            pinHash = d.pinHash;
            pinEnabled = d.pinEnabled || false;
          }
          syncStartBalanceTransaction();
          saveAll();
          updateTopBlocks();
          setTab("home");
          showToast(t("importedOk"));
        },
        { icon: "📥", title: "Импорт", yesText: "Заменить" },
      );
    } catch (e) {
      showToast(t("importError"), "error");
    }
  };
  reader.readAsText(file);
}
function exportToCSV() {
  if (!transactions.length) {
    showToast(t("noOperations").split("\n")[0], "error");
    return;
  }
  const hdr = [
    t("date"),
    t("type"),
    t("category"),
    t("subcategory"),
    t("amount"),
    t("note"),
  ];
  const rows = transactions.map((tx) => [
    tx.date || "",
    tx.type === "income" ? t("income") : t("expense"),
    tx.category || "",
    tx.subcategory || "",
    `${toDisp(tx.amountRub).toFixed(2)} ${sym()}`,
    tx.note || "",
  ]);
  const csv = [hdr, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `budget_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(t("exportSuccess"), "success");
}

function exportToPDF() {
  const now = new Date();
  const monthName = t("months")[now.getMonth()];
  const ptx = getTransactionsForPeriod("thisMonth");
  let inc = 0,
    exp = 0;
  ptx.forEach((tx) => {
    if (tx.type === "income") inc += tx.amountRub;
    else exp += tx.amountRub;
  });
  const topCats = {};
  ptx
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      topCats[tx.category] = (topCats[tx.category] || 0) + tx.amountRub;
    });
  const topList = Object.entries(topCats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("pdfTitle")}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1c1c1c;}h1{color:#2d6a4f;}table{width:100%;border-collapse:collapse;margin-top:20px;}th{background:#2d6a4f;color:white;padding:10px;}td{padding:8px;border-bottom:1px solid #eee;}tr:nth-child(even){background:#f9f9f9;}.summary{display:flex;gap:20px;margin:20px 0;}.card{flex:1;padding:16px;border-radius:12px;text-align:center;}.card.inc{background:#e8f5ed;}.card.exp{background:#fceae5;}.card.bal{background:#e8f0fe;}.card h2{margin:0;font-size:28px;}.card p{margin:4px 0;color:#666;}</style></head>
  <body><h1>${t("pdfTitle")} — ${monthName} ${now.getFullYear()}</h1>
  <div class="summary">
    <div class="card inc"><p>Доходы</p><h2>+${fmt(inc)}</h2></div>
    <div class="card exp"><p>Расходы</p><h2>-${fmt(exp)}</h2></div>
    <div class="card bal"><p>Баланс</p><h2>${fmt(inc - exp)}</h2></div>
  </div>
  <h2>Операции за ${monthName}</h2>
  <table><tr><th>Дата</th><th>Категория</th><th>Тип</th><th>Сумма</th><th>Заметка</th></tr>
  ${ptx
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map(
      (tx) =>
        `<tr><td>${fmtDate(tx.date)}</td><td>${esc(tx.category)}</td><td>${tx.type === "income" ? "📈 Доход" : "📉 Расход"}</td><td style="color:${tx.type === "income" ? "#1a7340" : "#c13515"};font-weight:700;">${tx.type === "income" ? "+" : "-"}${fmt(tx.amountRub)}</td><td>${esc(tx.note || "")}</td></tr>`,
    )
    .join("")}
  </table>
  <h2>Топ категорий расходов</h2>
  <table><tr><th>Категория</th><th>Сумма</th></tr>${topList.map(([c, a]) => `<tr><td>${esc(c)}</td><td>${fmt(a)}</td></tr>`).join("")}</table>
  <p style="margin-top:30px;color:#888;font-size:12px;">Сгенерировано: ${new Date().toLocaleString(currentLang)}</p></body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `budget_report_${now.toISOString().slice(0, 7)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(t("pdfSavedHtml"));
}

async function cloudSave() {
  const data = JSON.stringify({
    transactions,
    startBalanceRub,
    displayCurrency,
    exchangeRates,
    notebookPages,
    categories,
    incomeCategories,
    calcHistory,
    convHistory,
    userTemplates,
    frequentStats,
    categoryCustomizations,
    categoryBudgets,
    recurringOps,
    version: "2.2",
    exportDate: new Date().toISOString(),
  });
  const encoded = btoa(encodeURIComponent(data));
  const link = `data:application/json;base64,${encoded}`;
  const a = document.createElement("a");
  a.href = link;
  a.download = "budget_cloud_backup.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  try {
    await navigator.clipboard.writeText(link);
    showToast(t("cloudCopied"));
  } catch (e) {
    showToast(t("fileSaved"));
  }
}
function cloudLoad() {
  const html = `<div class="field-group"><label class="field-label">${t("cloudLoadHint")}</label><textarea id="cloudLinkInput" class="modal-textarea" rows="4" placeholder="data:application/json;base64,..."></textarea></div><div class="modal-actions"><button class="btn-secondary" id="clCancel">${t("cancel")}</button><button class="btn-primary" id="clLoad">${t("cloudLoad")}</button></div>`;
  const modal = createModal("cloudLoadModal", t("cloudBackup"), html);
  document.body.appendChild(modal);
  openModal("cloudLoadModal");
  document
    .getElementById("clCancel")
    .addEventListener("click", () => closeModal("cloudLoadModal"));
  document.getElementById("clLoad").addEventListener("click", () => {
    const link = document.getElementById("cloudLinkInput").value.trim();
    try {
      const b64 = link.replace("data:application/json;base64,", "");
      const json = decodeURIComponent(atob(b64));
      const d = JSON.parse(json);
      if (!d.transactions) {
        showToast(t("invalidFormat"), "error");
        return;
      }
      transactions = d.transactions || [];
      startBalanceRub = d.startBalanceRub ?? 70000;
      displayCurrency = d.displayCurrency || "GEL";
      if (d.exchangeRates) exchangeRates = d.exchangeRates;
      notebookPages = d.notebookPages || [];
      categories = d.categories || {};
      incomeCategories = d.incomeCategories || {};
      userTemplates = d.userTemplates || [];
      frequentStats = d.frequentStats || {};
      categoryCustomizations = d.categoryCustomizations || {};
      categoryBudgets = d.categoryBudgets || {};
      recurringOps = d.recurringOps || [];
      syncStartBalanceTransaction();
      saveAll();
      updateTopBlocks();
      closeModal("cloudLoadModal");
      setTab("home");
      showToast(t("cloudLoaded"));
    } catch (e) {
      showToast(t("cloudLoadError"), "error");
    }
  });
}

// ============================================================
// НАПОМИНАНИЯ
// ============================================================
// ── Schedule a named reminder with setTimeout (best-effort) ──
function scheduleNamedReminder(r) {
  const delay = r.tsMs - Date.now();
  if (delay <= 0 || delay > 7 * 24 * 3600 * 1000) return; // skip if past or >7 days
  setTimeout(() => {
    const list = JSON.parse(localStorage.getItem("namedReminders") || "[]");
    const item = list.find((x) => x.id === r.id);
    if (!item || item.fired) return;
    fireNamedReminder(item);
    item.fired = true;
    localStorage.setItem("namedReminders", JSON.stringify(list));
    if (currentTab === "settings") renderSettings();
  }, delay);
}

function fireNamedReminder(r) {
  const body =
    r.name ||
    {
      ru: "Не забудьте записать расходы!",
      en: "Log your expenses!",
      ka: "არ დაგავიწყდეთ ხარჯების ჩაწერა!",
    }[currentLang];

  // Надёжное локальное уведомление (липучее, с вибрацией и звуком)
  showStickyNotification("🔔 БюджетPRO", body, "named-" + r.id);

  showToast("🔔 " + body, "success", 5000);
  if (typeof haptic === "function") haptic("medium");
}

// Re-schedule any pending named reminders on page load
function rescheduleNamedReminders() {
  const list = JSON.parse(localStorage.getItem("namedReminders") || "[]");
  const now = Date.now();
  let changed = false;
  list.forEach((r) => {
    if (!r.fired) {
      if (r.ts <= now) {
        // Missed while page was closed - fire now
        fireNamedReminder(r);
        r.fired = true;
        changed = true;
      } else {
        scheduleNamedReminder(r);
      }
    }
  });
  if (changed) localStorage.setItem("namedReminders", JSON.stringify(list));
}
setTimeout(rescheduleNamedReminders, 1000);

function sendReminderNotification() {
  if (typeof Notification === "undefined") return;
  const canNotify = Notification.permission === "granted";
  const now = Date.now();

  // ── Проверка именованных напоминаний ──
  const list = JSON.parse(localStorage.getItem("namedReminders") || "[]");
  let changed = false;
  list.forEach((r) => {
    if (!r.fired && r.ts <= now) {
      fireNamedReminder(r); // fireNamedReminder теперь сама вызывает showStickyNotification
      r.fired = true;
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem("namedReminders", JSON.stringify(list));
    if (currentTab === "settings") renderSettings();
  }

  // ── Проверка интервальных напоминаний ──
  if (!remindersEnabled || !canNotify) return;
  for (const [interval, active] of Object.entries(reminderIntervals)) {
    if (!active) continue;
    const lastKey = `lastReminder_${interval}`;
    const last = localStorage.getItem(lastKey);
    const ms = getIntervalMs(interval);
    const should = !last || now - parseInt(last) >= ms;
    if (should) {
      showStickyNotification(
        t("appName"),
        t("remindersDesc"),
        "budget-reminder",
      );
      localStorage.setItem(lastKey, now);
    }
  }
}

// Подписка на push-уведомления (вызывается при инициализации)
async function subscribeUserToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("❌ Push-уведомления не поддерживаются");
    return null;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn("❌ VAPID public key is not configured");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    // Сохраняем подписку в localStorage, чтобы потом использовать при отправке
    localStorage.setItem("pushSubscription", JSON.stringify(subscription));
    console.log("✅ Пользователь подписан на push");
    return subscription;
  } catch (e) {
    console.warn("❌ Ошибка подписки на push:", e);
    return null;
  }
}

// Отправляет push через нашу облачную функцию (сервер)
async function sendPushViaServer(title, body, tag, vibrate) {
  const sub = JSON.parse(localStorage.getItem("pushSubscription"));
  if (!sub || !sub.endpoint) {
    console.warn("❌ Нет подписки");
    return false;
  }

  try {
    const response = await fetch(
      "https://military-apple.surge.sh/.netlify/functions/sendPush",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub,
          title: title,
          body: body,
          tag: tag || "budget-reminder",
          vibrate: vibrate || [200, 100, 200, 100, 200],
        }),
      },
    );
    if (response.ok) {
      console.log("📤 Push отправлен через сервер");
      return true;
    }
    return false;
  } catch (e) {
    console.warn("❌ Ошибка отправки push через сервер:", e);
    return false;
  }
}

// Универсальная функция для показа уведомлений (липкие, с вибрацией)
function showStickyNotification(title, body, tag) {
  const soundEnabled = localStorage.getItem("reminderSoundEnabled") !== "false";
  const vibrate = soundEnabled ? [200, 100, 200, 100, 200] : undefined;

  const options = {
    body: body,
    icon: "/favicon-96x96.png",
    tag: tag || "budget-reminder",
    requireInteraction: true,
    vibrate: vibrate,
    silent: !soundEnabled,
  };

  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) =>
      reg.showNotification(title, options),
    );
  } else if (Notification.permission === "granted") {
    new Notification(title, options);
  }
}

// Poll every 60 seconds — works even when setTimeout is killed on mobile background
let _globalReminderPoller = null;
function startReminderPoller() {
  if (_globalReminderPoller) return; // already running
  _globalReminderPoller = setInterval(sendReminderNotification, 60 * 1000);
  // Also check immediately
  setTimeout(sendReminderNotification, 500);
}

function startReminderTimer() {
  if (reminderTimer) clearInterval(reminderTimer);
  if (!remindersEnabled) return;
  // Legacy: keep for compatibility — main polling is in startReminderPoller
  reminderTimer = setInterval(sendReminderNotification, 5 * 60 * 1000);
  sendReminderNotification();
}
function stopReminderTimer() {
  if (reminderTimer) {
    clearInterval(reminderTimer);
    reminderTimer = null;
  }
}
function saveReminderSettings() {
  localStorage.setItem("remindersEnabled", remindersEnabled);
  localStorage.setItem("remindersInterval", remindersInterval);
}
function loadReminderSettings() {
  remindersEnabled = localStorage.getItem("remindersEnabled") === "true";
  const si = localStorage.getItem("remindersInterval");
  if (si && ["daily", "every3days", "weekly"].includes(si))
    remindersInterval = si;
  if (remindersEnabled) startReminderTimer();
}

// ============================================================
// СПРАВКА И ГАЙ
// ============================================================
function showHelpModal() {
  const modal = createModal(
    "helpModal",
    t("helpTitle"),
    `<div style="max-height:70vh;overflow-y:auto;">${t("helpContent")}</div>`,
  );
  document.body.appendChild(modal);
  openModal("helpModal");
}
((guideSteps = []), (curGuideStep = 0));
function showGuideStep(i) {
  if (i >= guideSteps.length) {
    finishGuide();
    return;
  }
  const s = guideSteps[i];
  const tgt = document.querySelector(s.element);
  if (!tgt) {
    console.warn("Guide: элемент не найден", s.element);
    showGuideStep(i + 1);
    return;
  }

  // Прокручиваем элемент в центр экрана с учётом шапки
  const headerOffset = 70; // высота фиксированной шапки (можно подкорректировать)
  const elementPosition = tgt.getBoundingClientRect().top + window.scrollY;
  const offsetPosition =
    elementPosition -
    headerOffset -
    (window.innerHeight / 2 - tgt.offsetHeight / 2);

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  // Даём время на прокрутку
  setTimeout(() => {
    const r = tgt.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) {
      console.warn("Guide: элемент не видим", s.element);
      showGuideStep(i + 1);
      return;
    }

    // Удаляем старые элементы гайда
    document
      .querySelectorAll(".guide-highlight, .guide-tooltip")
      .forEach((e) => e.remove());

    // Подсветка с затемнением вокруг
    const hi = document.createElement("div");
    hi.className = "guide-highlight";
    hi.style.left = r.left + "px";
    hi.style.top = r.top + "px";
    hi.style.width = r.width + "px";
    hi.style.height = r.height + "px";
    document.body.appendChild(hi);

    // Тултип с подсказкой
    const tip = document.createElement("div");
    tip.className = "guide-tooltip";
    tip.innerHTML = `
      <div class="guide-tooltip-title">${esc(s.title)}</div>
      <div class="guide-tooltip-desc">${esc(s.desc)}</div>
      <div class="guide-tooltip-actions">
        <button class="guide-btn-skip">${t("guideSkip")}</button>
        <button class="guide-btn-next">${i === guideSteps.length - 1 ? t("guideFinish") : t("guideNext")}</button>
      </div>
    `;
    document.body.appendChild(tip);

    // Позиционирование тултипа
    const tr = tip.getBoundingClientRect();
    let left = r.left + r.width / 2 - tr.width / 2;
    let top = r.bottom + 12;

    left = Math.max(12, Math.min(left, window.innerWidth - tr.width - 12));
    if (top + tr.height > window.innerHeight - 20) {
      top = r.top - tr.height - 12;
    }
    if (top < 12) {
      top = window.innerHeight / 2 - tr.height / 2;
    }

    tip.style.left = left + "px";
    tip.style.top = top + "px";

    const nextBtn = tip.querySelector(".guide-btn-next");
    const skipBtn = tip.querySelector(".guide-btn-skip");

    const cleanup = () => {
      hi.remove();
      tip.remove();
    };

    nextBtn.addEventListener("click", () => {
      cleanup();
      showGuideStep(i + 1);
    });
    skipBtn.addEventListener("click", () => {
      cleanup();
      finishGuide();
    });
  }, 300);
}
function finishGuide() {
  localStorage.setItem("guideShown", "true");
  document
    .querySelectorAll(".guide-overlay,.guide-highlight,.guide-tooltip")
    .forEach((e) => e.remove());
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ
// ============================================================
function openInputModal(title, label, defVal, onSave) {
  const html = `<div class="field-group"><label class="field-label">${esc(label)}</label><input type="text" id="inputModalVal" class="modal-input" value="${esc(defVal)}" autofocus></div><div class="modal-actions"><button class="btn-secondary" id="imCancel">${t("cancel")}</button><button class="btn-primary" id="imSave">${t("save")}</button></div>`;
  const modal = createModal("inputModal", title, html);
  document.body.appendChild(modal);
  openModal("inputModal");
  setTimeout(() => document.getElementById("inputModalVal")?.focus(), 300);
  document.getElementById("imSave").addEventListener("click", () => {
    const v = document.getElementById("inputModalVal").value.trim();
    closeModal("inputModal");
    onSave(v);
  });
  document
    .getElementById("imCancel")
    .addEventListener("click", () => closeModal("inputModal"));
  document.getElementById("inputModalVal").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("imSave").click();
  });
}
function createModal(id, title, bodyHtml) {
  document.getElementById(id)?.remove();
  const ov = document.createElement("div");
  ov.id = id;
  if (id === "addModal") {
    ov.className = "add-modal-host";
    ov.style.display = "none";
    ov.innerHTML = `<div class="more-overlay add-modal-overlay"></div><div class="more-sheet add-modal-sheet"><div class="more-handle"></div><div class="modal-header"><h2>${esc(title)}</h2><button class="modal-close">✕</button></div><div class="modal-body">${bodyHtml}</div></div>`;
    ov.querySelector(".modal-close").addEventListener("click", () =>
      closeModal(id),
    );
    ov.querySelector(".add-modal-overlay")?.addEventListener("click", () =>
      closeModal(id),
    );
    const sheet = ov.querySelector(".add-modal-sheet");
    const body = ov.querySelector(".modal-body");
    let startY = 0;
    let currentY = 0;
    let dragging = false;
    let dragIntent = false;

    const onStart = (e) => {
      const point = e.touches?.[0];
      if (!point || !sheet) return;
      const target = e.target;
      const fromCloseBtn = !!target.closest(".modal-close");
      const fromDragZone = !!target.closest(".more-handle, .modal-header");
      if (fromCloseBtn || !fromDragZone) {
        dragIntent = false;
        return;
      }
      startY = point.clientY;
      currentY = 0;
      dragging = false;
      dragIntent = true;
    };

    const onMove = (e) => {
      if (!dragIntent || !sheet) return;
      const point = e.touches?.[0];
      if (!point) return;
      const deltaY = point.clientY - startY;
      if (!dragging) {
        if (deltaY <= 12) return;
        dragging = true;
        sheet.classList.add("dragging");
        sheet.style.transition = "none";
        sheet.style.transform = "translateY(0)";
      }
      currentY = Math.max(0, deltaY);
      if (currentY > 0) {
        e.preventDefault();
        sheet.style.transform = `translateY(${currentY}px)`;
      }
    };

    const onEnd = () => {
      if (!sheet) return;
      const wasDragging = dragging;
      dragging = false;
      dragIntent = false;
      sheet.classList.remove("dragging");
      if (!wasDragging) {
        currentY = 0;
        return;
      }
      if (currentY > 110) {
        closeModal(id);
      } else {
        sheet.style.transition = "transform .22s ease";
        sheet.style.transform = "translateY(0)";
        setTimeout(() => {
          if (sheet) sheet.style.transition = "";
        }, 220);
      }
      currentY = 0;
      dragAllowed = false;
    };

    sheet?.addEventListener("touchstart", onStart, { passive: true });
    sheet?.addEventListener("touchmove", onMove, { passive: false });
    sheet?.addEventListener("touchend", onEnd, { passive: true });
    sheet?.addEventListener("touchcancel", onEnd, { passive: true });
    return ov;
  }
  ov.className = "modal-overlay";
  ov.innerHTML = `<div class="modal"><div class="modal-handle"></div><div class="modal-header"><h2>${esc(title)}</h2><button class="modal-close">✕</button></div><div class="modal-body">${bodyHtml}</div></div>`;
  ov.querySelector(".modal-close").addEventListener("click", () =>
    closeModal(id),
  );
  ov.addEventListener("click", (e) => {
    if (e.target === ov) closeModal(id);
  });
  return ov;
}
function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    if (id === "addModal") {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      m.style.display = "block";
      m.classList.remove("closing");
      m.classList.remove("open");
      m.classList.add("opening");
      void m.offsetHeight;
      const sheet = m.querySelector(".add-modal-sheet");
      const modalBody = m.querySelector(".modal-body");
      if (sheet) {
        sheet.classList.remove("dragging");
        sheet.style.transition = "";
        sheet.scrollTop = 0;
      }
      if (modalBody) {
        modalBody.scrollTop = 0;
        if (typeof modalBody.scrollTo === "function") {
          modalBody.scrollTo({ top: 0, behavior: "instant" });
        }
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          m.classList.add("open");
        });
        if (modalBody) {
          modalBody.scrollTop = 0;
          if (typeof modalBody.scrollTo === "function") {
            modalBody.scrollTo({ top: 0, behavior: "instant" });
          }
        }
      });
      setTimeout(() => {
        if (modalBody) {
          modalBody.scrollTop = 0;
          if (typeof modalBody.scrollTo === "function") {
            modalBody.scrollTo({ top: 0, behavior: "instant" });
          }
        }
      }, 80);
      setTimeout(() => {
        if (modalBody) {
          modalBody.scrollTop = 0;
          if (typeof modalBody.scrollTo === "function") {
            modalBody.scrollTo({ top: 0, behavior: "instant" });
          }
        }
        m.classList.remove("opening");
      }, 640);
    } else {
      m.classList.remove("closing");
      requestAnimationFrame(() => {
        m.classList.add("open");
      });
    }
    document.body.style.overflow = "hidden";
    traceApp("openModal", { id });
    traceLayoutSnapshot(`openModal:${id}`);
  }
}

function restoreHomeHeroIfNeeded() {
  if (currentTab !== "home" || simpleMode) return;
  const heroWrap = document.getElementById("heroCardWrap");
  if (!heroWrap) return;
  heroWrap.style.display = "";
  heroWrap.style.visibility = "visible";
  heroWrap.style.opacity = "1";
  updateHeroTrendText();
  forceHeroChipLayout(heroWrap);
  updateHeroChipLabels(heroWrap);
  updateHeroDebugOverlay();
}

function ensureHomeHeroStable(attempts = 6, delay = 120) {
  restoreHomeHeroIfNeeded();
  updateHeroDebugOverlay();
  if (attempts <= 1) return;
  setTimeout(() => ensureHomeHeroStable(attempts - 1, delay), delay);
}

function createHeroWrapNode() {
  const { balD, incD, expD, salD } = getTopBlockDisplayValues();
  const s = sym();
  const wrap = document.createElement("div");
  wrap.className = "hero-card-wrap";
  wrap.id = "heroCardWrap";
  wrap.innerHTML = `
    <div
      id="balanceCard"
      class="balance-card balance-card-wide"
      data-type="balance"
      role="button"
      tabindex="0"
    >
      <div class="hero-label" data-i18n="balance">${t("balance")}</div>
      <div class="hero-value" id="balanceValue">${balD.toFixed(2)} ${s}</div>
      <div class="hero-sub" id="heroTrend"></div>
      <div class="hero-chips">
        <div
          id="incomeCard"
          class="hero-chip hc-income"
          data-type="income"
          role="button"
          tabindex="0"
        >
          <div class="hc-label">
            <span class="hc-icon">📈</span>
            <span class="hc-label-text" id="incomeHeroLabel"></span>
          </div>
          <div class="hc-value" id="incomeValue">${incD.toFixed(2)} ${s}</div>
        </div>
        <div
          id="expenseCard"
          class="hero-chip hc-expense"
          data-type="expense"
          role="button"
          tabindex="0"
        >
          <div class="hc-label">
            <span class="hc-icon">📉</span>
            <span class="hc-label-text" id="expenseHeroLabel"></span>
          </div>
          <div class="hc-value" id="expenseValue">${expD.toFixed(2)} ${s}</div>
        </div>
        <div
          id="salaryCard"
          class="hero-chip hc-salary"
          data-type="salary"
          role="button"
          tabindex="0"
        >
          <div class="hc-label">
            <span class="hc-icon">💼</span>
            <span class="hc-label-text" id="salaryHeroLabel"></span>
          </div>
          <div class="hc-value" id="salaryValue">${salD.toFixed(2)} ${s}</div>
        </div>
      </div>
    </div>
  `;
  updateHeroTrendText();
  updateHeroChipLabels(wrap);
  return wrap;
}

function ensureHeroWrapAnchor() {
  const heroWrap = document.getElementById("heroCardWrap");
  heroWrapAnchor = document.getElementById("heroCardAnchor") || heroWrapAnchor;
  if (!heroWrapAnchor || !heroWrapAnchor.isConnected) {
    const header = document.querySelector(".app-header");
    const mainScroll = document.querySelector(".main-scroll");
    heroWrapAnchor = document.createElement("div");
    heroWrapAnchor.id = "heroCardAnchor";
    if (header && header.parentNode) {
      header.parentNode.insertBefore(
        heroWrapAnchor,
        mainScroll || header.nextSibling,
      );
    }
  }
  if (heroWrap) {
    if (heroWrapAnchor && heroWrap.parentNode === heroWrapAnchor.parentNode) {
      heroWrapAnchor.parentNode?.insertBefore(heroWrapAnchor, heroWrap);
    }
    return heroWrap;
  }
  const recreated = createHeroWrapNode();
  if (heroWrapAnchor?.parentNode) {
    heroWrapAnchor.parentNode.insertBefore(recreated, heroWrapAnchor.nextSibling);
  }
  return recreated;
}

function mountHeroIntoHome() {
  const heroWrap = ensureHeroWrapAnchor();
  const mainContent = document.getElementById("mainContent");
  if (!heroWrap || !mainContent) return;
  if (heroWrap.parentNode !== mainContent) {
    mainContent.insertBefore(heroWrap, mainContent.firstChild || null);
  }
}

function unmountHeroFromHome() {
  const heroWrap = ensureHeroWrapAnchor();
  if (!heroWrap || !heroWrapAnchor) return;
  if (heroWrap.parentNode !== heroWrapAnchor.parentNode) {
    heroWrapAnchor.parentNode?.insertBefore(
      heroWrap,
      heroWrapAnchor.nextSibling,
    );
  }
}

function ensureHeroWrapGuard() {
  const heroWrap = document.getElementById("heroCardWrap");
  if (!heroWrap) return;
  heroWrapObserver?.disconnect();
  heroWrapObserver = new MutationObserver(() => {
    if (currentTab !== "home" || simpleMode) return;
    const hiddenByStyle =
      heroWrap.style.display === "none" ||
      heroWrap.style.visibility === "hidden" ||
      heroWrap.style.opacity === "0";
    if (hiddenByStyle) {
      restoreHomeHeroIfNeeded();
    }
  });
  heroWrapObserver.observe(heroWrap, {
    attributes: true,
    attributeFilter: ["style", "class"],
  });
}

function updateHeroDebugOverlay() {
  if (localStorage.getItem("heroDebug") !== "1") {
    document.getElementById("heroDebugOverlay")?.remove();
    return;
  }
  let dbg = document.getElementById("heroDebugOverlay");
  if (!dbg) {
    dbg = document.createElement("div");
    dbg.id = "heroDebugOverlay";
    dbg.style.cssText =
      "position:fixed;left:8px;top:8px;z-index:20000;background:rgba(0,0,0,.82);color:#fff;padding:8px 10px;border-radius:10px;font:12px/1.35 monospace;max-width:calc(100vw - 16px);white-space:pre-wrap;pointer-events:none;";
    document.body.appendChild(dbg);
  }
  const heroWrap = document.getElementById("heroCardWrap");
  const parentId =
    heroWrap?.parentElement?.id ||
    heroWrap?.parentElement?.className ||
    "(none)";
  const rect =
    heroWrap && heroWrap.getBoundingClientRect
      ? heroWrap.getBoundingClientRect()
      : null;
  dbg.textContent =
    "tab=" +
    currentTab +
    " | simple=" +
    simpleMode +
    "\nhero=" +
    !!heroWrap +
    " | parent=" +
    parentId +
    "\ndisplay=" +
    (heroWrap?.style.display || "(empty)") +
    " | vis=" +
    (heroWrap?.style.visibility || "(empty)") +
    " | op=" +
    (heroWrap?.style.opacity || "(empty)") +
    "\nrect=" +
    (rect ? Math.round(rect.width) + "x" + Math.round(rect.height) : "none");
}

function traceApp(event, details = {}) {
  if (!APP_TRACE_ENABLED) return;
  const timestamp = new Date().toLocaleTimeString("en-GB", {
    hour12: false,
  });
  let detailText = "";
  try {
    detailText = Object.keys(details).length ? " " + JSON.stringify(details) : "";
  } catch (e) {
    detailText = " [unserializable]";
  }
  const line = `${timestamp} ${event}${detailText}`;
  console.log("[BPTRACE]", line);
  try {
    if (window.BudgetPROTrace && typeof window.BudgetPROTrace.log === "function") {
      window.BudgetPROTrace.log(line);
    }
  } catch (e) {}
  appTraceLines.push(line);
  if (appTraceLines.length > 12) appTraceLines.shift();

  if (!appTracePanel) {
    appTracePanel = document.createElement("div");
    appTracePanel.id = "appTracePanel";
    appTracePanel.style.cssText =
      "position:fixed;left:8px;right:8px;bottom:88px;z-index:20001;" +
      "background:rgba(0,0,0,.82);color:#fff;border-radius:12px;" +
      "padding:8px 10px;font:11px/1.35 monospace;max-height:180px;" +
      "overflow:auto;white-space:pre-wrap;pointer-events:none;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.35);";
    document.body.appendChild(appTracePanel);
  }
  appTracePanel.textContent = appTraceLines.join("\n");
}

function attachAppTraceObservers() {
  if (!APP_TRACE_ENABLED) return;
  const mainContent = document.getElementById("mainContent");
  if (mainContent) {
    appTraceMainObserver?.disconnect();
    appTraceMainObserver = new MutationObserver(() => {
      const heroWrap = document.getElementById("heroCardWrap");
      traceApp("mainContent-mutated", {
        heroExists: !!heroWrap,
        heroParent: heroWrap?.parentElement?.id || heroWrap?.parentElement?.className || null,
        childCount: mainContent.children.length,
      });
      attachAppTraceObservers();
    });
    appTraceMainObserver.observe(mainContent, { childList: true });
  }

  const heroWrap = document.getElementById("heroCardWrap");
  if (heroWrap) {
    appTraceHeroObserver?.disconnect();
    appTraceHeroObserver = new MutationObserver(() => {
      const rect = heroWrap.getBoundingClientRect?.();
      traceApp("hero-mutated", {
        display: heroWrap.style.display || "",
        visibility: heroWrap.style.visibility || "",
        opacity: heroWrap.style.opacity || "",
        parent: heroWrap.parentElement?.id || heroWrap.parentElement?.className || null,
        rect: rect ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : null,
      });
    });
    appTraceHeroObserver.observe(heroWrap, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }
}

function describeTraceTarget(target) {
  if (!target) return "unknown";
  const el = target.closest?.(
    "#fabBtn, #fabBtnSimple, .modal-close, .modal-overlay, .btn-primary, .btn-secondary, .nav-btn, .hero-chip, .balance-card-wide, .balance-row, #appLogoBtn",
  );
  if (!el) return null;
  return (
    el.id ||
    el.dataset?.tab ||
    el.dataset?.type ||
    el.className?.toString()?.split(" ").filter(Boolean).slice(0, 3).join(".") ||
    el.tagName
  );
}

function rectSummary(el) {
  if (!el || !el.getBoundingClientRect) return null;
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.x),
    y: Math.round(r.y),
    w: Math.round(r.width),
    h: Math.round(r.height),
  };
}

function elementState(id) {
  const el = document.getElementById(id);
  if (!el) return { exists: false };
  return {
    exists: true,
    parent:
      el.parentElement?.id ||
      el.parentElement?.className?.toString?.() ||
      null,
    display: el.style.display || "",
    visibility: el.style.visibility || "",
    opacity: el.style.opacity || "",
    rect: rectSummary(el),
  };
}

function traceLayoutSnapshot(reason) {
  if (!APP_TRACE_ENABLED) return;
  const mainContent = document.getElementById("mainContent");
  traceApp("layout-snapshot", {
    reason,
    tab: currentTab,
    simpleMode,
    mainContentChildren: mainContent?.children?.length ?? null,
    mainContentRect: rectSummary(mainContent),
    hero: elementState("heroCardWrap"),
    balance: elementState("balanceCard"),
    income: elementState("incomeCard"),
    expense: elementState("expenseCard"),
    salary: elementState("salaryCard"),
  });
}

function scheduleBootLayoutTracing() {
  if (!APP_TRACE_ENABLED) return;
  appBootTraceTimers.forEach((id) => clearTimeout(id));
  appBootTraceTimers = [];
  [0, 80, 180, 320, 600, 1000, 1600, 2400].forEach((delay) => {
    const timerId = setTimeout(
      () => traceLayoutSnapshot(`boot+${delay}ms`),
      delay,
    );
    appBootTraceTimers.push(timerId);
  });
}

function scheduleHomeRecoveryAfterAddCancel() {
  addModalRecoveryTimers.forEach((id) => clearTimeout(id));
  addModalRecoveryTimers = [];
  [60, 220, 520, 900].forEach((delay) => {
    const timerId = setTimeout(() => {
      if (document.getElementById("addModal")) return;
      if (currentTab !== "home" || simpleMode) return;
      renderHome();
      updateTopBlocks();
    }, delay);
    addModalRecoveryTimers.push(timerId);
  });
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    if (m.classList.contains("closing")) return;
    traceApp("closeModal-start", {
      id,
      addModalCommitted,
      currentTab,
      simpleMode,
    });
    const shouldRestoreHomeAfterAddCancel =
      id === "addModal" &&
      !addModalCommitted &&
      currentTab === "home" &&
      !simpleMode;
    if (id === "addModal") {
      const sheet = m.querySelector(".add-modal-sheet");
      addModalLastClosedAt = Date.now();
      m.classList.add("closing");
      if (sheet) sheet.classList.remove("dragging");
      setTimeout(() => {
        m.style.display = "none";
        m.remove();
      }, 500);
    } else {
      m.classList.remove("open");
      setTimeout(() => m.remove(), 350);
    }
    document.body.style.overflow = "";
    traceLayoutSnapshot(`closeModal:${id}`);
    updateHeroDebugOverlay();
    if (id === "addModal") addModalCommitted = false;
    setTimeout(() => ensureHomeHeroStable(), 20);
    if (shouldRestoreHomeAfterAddCancel) {
      traceApp("closeModal-recover-home", { id });
      scheduleHomeRecoveryAfterAddCancel();
    }
  }
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
// Проверка пин-кода при запуске
// 🪙 Монеты при доходе (появляются ПОСЛЕ закрытия модалки, 1.5с)
function showCoinAnimation() {
  if (!animationsEnabled) return;
  const fab = document.getElementById("fabBtn");
  const cx = fab
    ? fab.getBoundingClientRect().left + 28
    : window.innerWidth / 2;
  const cy = fab ? fab.getBoundingClientRect().top : window.innerHeight * 0.8;
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const coin = document.createElement("div");
      coin.textContent = ["🪙", "💰", "✨", "💵"][
        Math.floor(Math.random() * 4)
      ];
      coin.style.cssText =
        `position:fixed;left:${cx}px;top:${cy}px;font-size:${24 + Math.random() * 16}px;` +
        `pointer-events:none;z-index:9999;filter:drop-shadow(0 2px 8px rgba(0,0,0,.25));`;
      document.body.appendChild(coin);
      const dx = (Math.random() - 0.5) * 200,
        dy = -(80 + Math.random() * 180);
      coin.animate(
        [
          { transform: "translate(-50%,-50%) scale(0)", opacity: 0 },
          {
            transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy * 0.3}px)) scale(1.2)`,
            opacity: 1,
            offset: 0.3,
          },
          {
            transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.4)`,
            opacity: 0,
          },
        ],
        {
          duration: 1300 + Math.random() * 300,
          easing: "cubic-bezier(0,.9,.57,1)",
          fill: "forwards",
        },
      );
      setTimeout(() => coin.remove(), 1700);
    }, i * 80);
  }
}

// 💸 Деньги при расходе (появляются ПОСЛЕ закрытия модалки, 1.5с)
function showMoneyFlyEffect() {
  if (!animationsEnabled) return;
  const emojis = ["💸", "💳", "🧾", "💴", "🏧", "💵"];
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const sx = window.innerWidth / 2 + (Math.random() - 0.5) * 160;
      el.style.cssText =
        `position:fixed;left:${sx}px;top:${window.innerHeight * 0.6}px;` +
        `font-size:${24 + Math.random() * 20}px;pointer-events:none;z-index:9999;` +
        `filter:drop-shadow(0 2px 8px rgba(0,0,0,.3));`;
      document.body.appendChild(el);
      const dx = (Math.random() - 0.5) * 300,
        dy = -(100 + Math.random() * 200),
        rot = (Math.random() - 0.5) * 540;
      el.animate(
        [
          { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${dx}px,${dy}px) scale(.15) rotate(${rot}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1300 + Math.random() * 300,
          easing: "cubic-bezier(.2,.8,.4,1)",
          fill: "forwards",
        },
      );
      setTimeout(() => el.remove(), 1700);
    }, i * 70);
  }
}

// Stats auto-refresh
function startStatsAutoRefresh() {
  if (window._statsTimer) clearInterval(window._statsTimer);
  window._statsTimer = setInterval(() => {
    if (currentTab === "stats") {
      const sig =
        transactions.length +
        "," +
        transactions.reduce((s, tx) => s + tx.amountRub, 0).toFixed(0);
      if (sig !== window._lastSig) {
        window._lastSig = sig;
        renderStats();
      }
    }
  }, 2000);
}

function getIntervalMs(iv) {
  const map = {
    "30min": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "2h": 2 * 60 * 60 * 1000,
    "5h": 5 * 60 * 60 * 1000,
    daily: 24 * 60 * 60 * 1000,
    every3days: 3 * 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000,
  };
  return map[iv] || 24 * 60 * 60 * 1000;
}

async function updateExchangeRates() {
  // Запасные курсы на случай офлайна
  const FALLBACK_RATES = {
    USD: 0.011,
    EUR: 0.01,
    GEL: 0.031,
    GBP: 0.0088,
    KZT: 5.12,
    RUB: 1,
  };
  try {
    const response = await fetch(
      "https://api.exchangerate.host/latest?base=RUB",
    );
    const data = await response.json();
    if (data.success && data.rates) {
      for (const c of ["USD", "EUR", "GEL", "GBP", "KZT"]) {
        if (data.rates[c]) {
          exchangeRates[c] = parseFloat(data.rates[c]);
        }
      }
      // Сохраняем актуальные курсы для офлайн-использования
      localStorage.setItem(
        "cachedRates",
        JSON.stringify({ rates: exchangeRates, ts: Date.now() }),
      );
      saveAll();
      updateTopBlocks();
      console.log("💱 Курсы валют обновлены");
    }
  } catch (e) {
    console.warn("⚠️ Ошибка обновления курсов:", e);
  }
}

function applyTimeBasedTheme() {
  // Only apply if user hasn't manually set a theme override
  if (localStorage.getItem("themeManualOverride")) return;
  const h = new Date().getHours();
  const shouldBeDark = h >= 19 || h < 7;
  const isDark = document.body.classList.contains("dark");
  if (shouldBeDark !== isDark) {
    applyColorTheme(shouldBeDark ? "navy" : "default");
    const tb = document.getElementById("themeToggle");
    if (tb) tb.textContent = shouldBeDark ? "☀️" : "🌙";
  }
}
// Check every 5 minutes
setInterval(applyTimeBasedTheme, 5 * 60 * 1000);

function startDeferredBackgroundServices() {
  if (backgroundServicesStarted) return;
  backgroundServicesStarted = true;

  setTimeout(() => {
    updateExchangeRates();
    setInterval(updateExchangeRates, 3600000);
  }, 1200);

  setTimeout(() => {
    startReminderPoller();
  }, 1800);

  setTimeout(() => {
    startRealtimeListener();
  }, 2200);

  setTimeout(() => {
    warmMessageCaches().catch(() => {});
  }, 3200);

  setTimeout(addVoiceButton, 1400);
  setTimeout(addGoalsNavButton, 1600);
  setTimeout(startDeferredUiEnhancements, 2200);
}

function startDeferredUiEnhancements() {
  if (deferredUiStarted) return;
  deferredUiStarted = true;

  setTimeout(() => {
    injectCardHelpButtons();
    injectNavHelpButtons();
    updateSupportBadge();
    setInterval(updateSupportBadge, 15000);
  }, 0);

  setTimeout(() => {
    ensureSupportButton();
  }, 200);

  setTimeout(() => {
    checkRecurringNotifications();
  }, 800);

  setTimeout(() => {
    if (shouldShowOnboarding()) showOnboarding();
  }, 1200);

  setTimeout(() => {
    showBudgetCelebration();
  }, 2200);
}

function convertTo12(time24) {
  if (!time24) return "";
  let [h, m] = time24.split(":");
  h = parseInt(h, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

function init() {
  appInitDone = true;
  applyTranslations();
  updateTopBlocks();
  forceHeroChipLayout();
  updateHeroDebugOverlay();
  traceApp("init", { currentLang, simpleMode, currentTab });
  updateHeader();
  addHeaderButtons();
  document.documentElement.lang = currentLang;
  // Apply time-based theme before manual override check
  applyColorTheme(
    colorTheme || localStorage.getItem("colorTheme") || "default",
  );
  // After init, check time-based theme (respects existing setting)
  setTimeout(applyTimeBasedTheme, 200);
  applyFontSize(fontSize || "normal");
  applySimpleMode(simpleMode || localStorage.getItem("simpleMode") === "true");
  forceHeroChipLayout();
  updateHeroDebugOverlay();
  attachAppTraceObservers();
  const tb = document.getElementById("themeToggle");
  if (tb)
    tb.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  // ── HAPTIC EVERYWHERE ──
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => haptic("light"), { passive: true });
  });
  // Делегирование событий — работает с динамически рендеренными chips
  document.addEventListener("click", (e) => {
    const traceTarget = describeTraceTarget(e.target);
    if (traceTarget) traceApp("click", { target: traceTarget });
    const card = e.target.closest(
      ".summary-card, .hero-chip, .balance-card-wide",
    );
    if (!card) return;
    haptic("light");
    const type = card.dataset.type;
    if (type === "salary") {
      openSalaryModal();
      return;
    }
    if (type === "income" || type === "expense") {
      currentFilter = type;
      if (simpleMode) {
        // В упрощённом режиме — обновляем список и прокручиваем
        renderSimpleHome();
        setTimeout(() => {
          const el = document.querySelector(".sm-ops-list, .sm-empty");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          showToast(
            type === "income"
              ? t("toastIncomeFilter")
              : t("toastExpenseFilter"),
            "success",
          );
        }, 120);
      } else {
        if (currentTab !== "home") setTab("home");
        else {
          renderBalanceSummary();
          renderOpsList();
        }
        setTimeout(() => {
          const el =
            document.querySelector(".ops-list") ||
            document.getElementById("opsList");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          showToast(
            type === "income"
              ? t("toastIncomeFilter")
              : t("toastExpenseFilter"),
            "success",
          );
        }, 200);
      }
    } else {
      if (currentFilter !== null) {
        currentFilter = null;
        if (currentTab === "home") {
          if (simpleMode) renderSimpleHome();
          else renderOpsList();
        }
      } else if (currentTab !== "home") setTab("home");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(
      ".summary-card, .hero-chip, .balance-card-wide",
    );
    if (card) card.click();
  });
  document
    .getElementById("fabBtn")
    .addEventListener("click", () => openAddModal("expense"));
  // ── Инициализация push-уведомлений ──

  appBooting = false;
  setTab("home");
  startDeferredBackgroundServices();
  ensureHeroWrapGuard();
  setTimeout(() => ensureHomeHeroStable(8, 150), 120);

  // ── Обработчики обеих навигаций ──
  const fabBtnSimple = document.getElementById("fabBtnSimple");
  if (fabBtnSimple)
    fabBtnSimple.addEventListener("click", () => openAddModal("expense"));

  // Все кнопки с data-tab в обоих навах
  document
    .querySelectorAll(
      "#mainNav .nav-btn[data-tab], #simpleNav .nav-btn[data-tab]",
    )
    .forEach((btn) => {
      btn.addEventListener("click", () => setTab(btn.dataset.tab));
    });

  // ── Шторка "Ещё" ──
  function openMoreDrawer() {
    const drawer = document.getElementById("moreDrawer");
    if (!drawer) return;
    drawer.style.display = "block";
    // Локализация пунктов
    const labels = {
      tools: { ru: "Инструменты", en: "Tools", ka: "ინსტრ." },
      settings: { ru: "Настройки", en: "Settings", ka: "პარამ." },
      notebook: { ru: "Заметки", en: "Notes", ka: "ჩანაწ." },
      share: { ru: "Поделиться", en: "Share", ka: "გაზ." },
    };
    drawer.querySelectorAll("[data-i18n-more]").forEach((el) => {
      const key = el.dataset.i18nMore;
      if (labels[key])
        el.textContent = labels[key][currentLang] || labels[key].ru;
    });
    // Клики по пунктам меню
    drawer.querySelectorAll(".more-item[data-tab]").forEach((btn) => {
      btn.onclick = () => {
        closeMoreDrawer();
        setTab(btn.dataset.tab);
      };
    });
    document.getElementById("moreShareBtn")?.addEventListener("click", () => {
      closeMoreDrawer();
      const activeProf =
        profiles.find((p) => p.id === activeProfileId) || profiles[0];
      if (activeProf && typeof openShareModal === "function")
        openShareModal(activeProf);
      else
        showToast(t("profileNotFound"), "error");
    });
    // Закрытие по оверлею и свайпу вниз
    const overlay = document.getElementById("moreDrawerOverlay");
    overlay && (overlay.onclick = closeMoreDrawer);
    // Свайп вниз для закрытия
    const sheet = drawer.querySelector(".more-sheet");
    let startY = 0;
    sheet?.addEventListener(
      "touchstart",
      (e) => {
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );
    sheet?.addEventListener(
      "touchend",
      (e) => {
        if (e.changedTouches[0].clientY - startY > 60) closeMoreDrawer();
      },
      { passive: true },
    );
  }
  function closeMoreDrawer() {
    const drawer = document.getElementById("moreDrawer");
    if (drawer) {
      const sheet = drawer.querySelector(".more-sheet");
      if (sheet) {
        sheet.style.animation = "none";
        sheet.style.transform = "translateY(100%)";
        sheet.style.transition = "transform .25s ease";
      }
      setTimeout(() => {
        if (drawer) drawer.style.display = "none";
        if (sheet) {
          sheet.style.transform = "";
          sheet.style.transition = "";
          sheet.style.animation = "";
        }
      }, 240);
    }
  }
  window.openMoreDrawer = openMoreDrawer;
  window.closeMoreDrawer = closeMoreDrawer;

  document
    .getElementById("moreNavBtn")
    ?.addEventListener("click", openMoreDrawer);
  document
    .getElementById("moreNavBtnSimple")
    ?.addEventListener("click", openMoreDrawer);
  document
    .getElementById("settingsNavBtnSimple")
    ?.addEventListener("click", () => setTab("settings"));

  // ==== ПРОВЕРКА ФЛАГА НОВЫХ СООБЩЕНИЙ ПРИ ЗАГРУЗКЕ ====
  const checkSupportFlag = () => {
    if (
      localStorage.getItem("has_new_support_messages") === "true" &&
      isCreator()
    ) {
      setTimeout(() => {
        showToast("📬 " + t("newUserMessages"), "success", 3000);
        localStorage.removeItem("has_new_support_messages");
      }, 300);
    }
  };
  checkSupportFlag();
  window.addEventListener("pageshow", checkSupportFlag);

  // Обработчики удаления в настройках (делегирование)
  document.getElementById("mainContent").addEventListener("click", (e) => {
    if (e.target.classList.contains("budget-del-btn")) {
      const cat = e.target.dataset.cat;
      askConfirm(
        t("budgetDeleteConfirm"),
        () => {
          delete categoryBudgets[cat];
          saveAll();
          renderSettings();
        },
        { icon: "🗑️" },
      );
    } else if (e.target.classList.contains("rec-del-btn")) {
      const i = parseInt(e.target.dataset.idx);
      askConfirm(
        t("recurringDeleteConfirm"),
        () => {
          recurringOps.splice(i, 1);
          saveAll();
          renderSettings();
        },
        { icon: "🗑️" },
      );
    } else if (e.target.hasAttribute("data-deletepid")) {
      const pid = e.target.getAttribute("data-deletepid");
      const prof = profiles.find((p) => p.id === pid);
      if (!prof) return;
      askConfirm(
        t("profileDeleteConfirm"),
        () => {
          // Если удаляем активный профиль, переключаемся на другой
          if (pid === activeProfileId) {
            const other = profiles.find((p) => p.id !== pid);
            if (other) {
              switchProfile(other.id);
            } else {
              // Если других нет — создаём дефолтный профиль
              const defaultProf = {
                id: "default",
                name: "Я",
                emoji: "👤",
                color: "#2d6a4f",
              };
              profiles = [defaultProf];
              activeProfileId = "default";
              saveGlobal();
              loadProfileData("default");
              syncStartBalanceTransaction();
              setTab("home");
            }
          }
          // Удаляем данные профиля из localStorage
          localStorage.removeItem("budget_profile_" + pid);
          profiles = profiles.filter((p) => p.id !== pid);
          saveGlobal();
          renderSettings();
          showToast(t("deleted"));
        },
        { icon: "🗑️" },
      );
    }
  });
  // Проверка новых сообщений при возвращении на вкладку
  document.addEventListener("visibilitychange", () => {
    if (
      !document.hidden &&
      isCreator() &&
      localStorage.getItem("has_new_support_messages") === "true"
    ) {
      setTimeout(() => {
        showToast("📬 " + t("newUserMessages"), "success", 3000);
        localStorage.removeItem("has_new_support_messages");
      }, 300);
    }
  });
}

// Initialize offline indicator after app loads
setTimeout(updateOfflineBar, 500);

// ============================================================
// OFFLINE / ONLINE INDICATOR
// ============================================================
function updateOfflineBar() {
  const bar = document.getElementById("offlineBar");
  if (!bar) return;
  if (!navigator.onLine) {
    bar.textContent =
      "📴 " + (translations[currentLang]?.offlineMode || "Офлайн");
    bar.classList.add("visible");
  } else {
    bar.classList.remove("visible");
  }
}
window.addEventListener("offline", () => {
  updateOfflineBar();
});
window.addEventListener("online", () => {
  const bar = document.getElementById("offlineBar");
  if (bar) {
    bar.textContent =
      "✅ " + (translations[currentLang]?.onlineMode || "Снова онлайн");
    bar.classList.add("visible");
    setTimeout(() => bar.classList.remove("visible"), 2500);
  }
});
// Check on load
document.addEventListener("DOMContentLoaded", updateOfflineBar);

function applySimpleMode(on) {
  simpleMode = !!on;
  localStorage.setItem("simpleMode", simpleMode ? "true" : "false");
  document.body.classList.toggle("simple-mode", simpleMode);
  // Управляем видимостью hero-блока
  const heroWrap = document.getElementById("heroCardWrap");
  if (heroWrap) heroWrap.style.display = simpleMode ? "none" : "";
  // Переключаем навигацию
  const mainNav = document.getElementById("mainNav");
  const simpleNav = document.getElementById("simpleNav");
  if (mainNav) mainNav.style.display = simpleMode ? "none" : "";
  if (simpleNav) simpleNav.style.display = simpleMode ? "" : "none";
  // Inject simple mode CSS if not present
  if (simpleMode && !document.getElementById("simpleModeCSS")) {
    const st = document.createElement("style");
    st.id = "simpleModeCSS";
    st.textContent = `
      body.simple-mode { font-size: 18px !important; }
      body.simple-mode .card-value { font-size: 21px !important; font-weight: 900 !important; }
      body.simple-mode .card-label { font-size: 13px !important; }
      body.simple-mode .fab { width: 66px !important; height: 66px !important; }
      body.simple-mode .fab-icon { font-size: 30px !important; }
      body.simple-mode .nav-label { font-size: 11px !important; }
      body.simple-mode .op-category { font-size: 17px !important; }
      body.simple-mode .op-amount { font-size: 18px !important; }
      body.simple-mode .btn-primary, body.simple-mode .btn-secondary { font-size: 18px !important; padding: 16px !important; }
      body.simple-mode .modal-input, body.simple-mode .modal-select { font-size: 18px !important; }
    `;
    document.head.appendChild(st);
  } else if (!simpleMode) {
    document.getElementById("simpleModeCSS")?.remove();
  }
  updateHeroDebugOverlay();
  if (appBooting) return;
  if (currentTab === "home") renderHome();
  else setTab("home");
}
function applyFontSize(size) {
  fontSize = size || "normal";
  localStorage.setItem("fontSize", fontSize);
  const scales = { small: "13px", normal: "16px", large: "20px", xl: "24px" };
  const px = scales[fontSize] || "16px";
  // Remove old style
  document.getElementById("fontSizeStyle")?.remove();
  // Create new style with high specificity
  const st = document.createElement("style");
  st.id = "fontSizeStyle";
  st.textContent = `
    body, body * { font-size: ${px} !important; }
    body .card-value { font-size: calc(${px} * 1.05) !important; }
    body .app-logo { font-size: calc(${px} * 1.15) !important; }
    body .op-amount { font-size: calc(${px} * 1.05) !important; }
    body .stat-kpi-val { font-size: calc(${px} * 1.15) !important; }
    body .balance-row-value { font-size: calc(${px} * 1.0) !important; }
    body .modal-input, body .modal-select, body .modal-textarea { font-size: ${px} !important; }
    body .btn-primary, body .btn-secondary, body .btn-danger { font-size: ${px} !important; }
    body .nav-label { font-size: calc(${px} * 0.65) !important; }
    body .card-label { font-size: calc(${px} * 0.7) !important; }
    body .card-hint  { font-size: calc(${px} * 0.62) !important; }
    body .op-note, body .op-date-small { font-size: calc(${px} * 0.75) !important; }
    body .field-label { font-size: calc(${px} * 0.82) !important; }
    body .settings-card-title { font-size: calc(${px} * 1.06) !important; }
    body .settings-card-desc  { font-size: calc(${px} * 0.75) !important; }
    body .numpad-btn, body .calc-btn { font-size: calc(${px} * 1.25) !important; }
  `;
  document.head.appendChild(st);
}

function isCreator() {
  // If we're in a shared/guest session, NEVER consider as creator
  // regardless of what's stored in profiles
  if (sharedAccessProfile) return false;
  const prof = profiles.find((p) => p.id === activeProfileId);
  if (!prof || prof.role !== "owner") return false;
  // Extra check: shared profiles cannot be creator
  if (prof.isShared) return false;
  return true;
}
function getCreatorSettings() {
  return JSON.parse(localStorage.getItem("budgetpro_creator_settings") || "{}");
}

function renderCreatorPanel() {
  return "";
}

function attachCreatorHandlers() {}

function openProfileEditModal(prof) {
  const isNew = !prof;
  const profileColors = [
    "#2d6a4f",
    "#3b82f6",
    "#ec4899",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#14b8a6",
  ];
  const profileEmojis = [
    "👤",
    "👩",
    "👨",
    "👧",
    "👦",
    "👵",
    "👴",
    "👶",
    "🧑",
    "👩‍💼",
    "👨‍💼",
    "👩‍🎓",
    "👨‍🎓",
    "🧑‍💻",
    "💁",
    "🙋",
  ];
  const curColor =
    prof?.color || profileColors[profiles.length % profileColors.length];
  const curEmoji = prof?.emoji || "👤";
  const html = `
    <div class="field-group"><label class="field-label">${t("profileEmojiLabel")}</label>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
      ${profileEmojis.map((e) => `<button class="emoji-pick-btn" data-emoji="${e}" style="width:44px;height:44px;border-radius:12px;border:2px solid ${e === curEmoji ? "var(--primary)" : "var(--cream-border)"};background:${e === curEmoji ? "var(--primary-pale)" : "var(--cream-dark)"};font-size:22px;cursor:pointer;">${e}</button>`).join("")}
    </div></div>
    <div class="field-group"><label class="field-label">Цвет</label>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
      ${profileColors.map((c) => `<button class="color-pick-btn" data-color="${c}" style="width:36px;height:36px;border-radius:50%;border:3px solid ${c === curColor ? "var(--text)" : "transparent"};background:${c};cursor:pointer;"></button>`).join("")}
    </div></div>
    <div class="field-group"><label class="field-label">${t("profileNameLabel")}</label>
    <input type="text" id="profileNameInput" class="modal-input" value="${esc(prof?.name || "")}" placeholder="${t("profileNamePlaceholder")}" maxlength="20" autofocus></div>
    <div id="profilePreview" style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--cream-dark);border-radius:16px;margin-bottom:16px;">
      <div id="previewAvatar" style="width:48px;height:48px;border-radius:50%;background:${curColor};display:flex;align-items:center;justify-content:center;font-size:26px;">${curEmoji}</div>
      <div id="previewName" style="font-size:18px;font-weight:800;color:var(--text);">${esc(prof?.name || t("profileNew"))}</div>
    </div>
    <div class="modal-actions"><button class="btn-secondary" id="cancelProfileEdit">${t("cancel")}</button><button class="btn-primary" id="saveProfileEdit">💾 ${t("save")}</button></div>`;
  const modal = createModal(
    "profileEditModal",
    isNew ? t("addProfile") : t("profileRename"),
    html,
  );
  document.body.appendChild(modal);
  openModal("profileEditModal");
  let selEmoji = curEmoji,
    selColor = curColor;
  const updPreview = () => {
    const name =
      document.getElementById("profileNameInput")?.value || t("profileNew");
    const av = document.getElementById("previewAvatar"),
      pn = document.getElementById("previewName");
    if (av) {
      av.textContent = selEmoji;
      av.style.background = selColor;
    }
    if (pn) pn.textContent = name;
  };
  document
    .getElementById("profileNameInput")
    ?.addEventListener("input", updPreview);
  modal.querySelectorAll(".emoji-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selEmoji = btn.dataset.emoji;
      modal.querySelectorAll(".emoji-pick-btn").forEach((b) => {
        b.style.borderColor = "var(--cream-border)";
        b.style.background = "var(--cream-dark)";
      });
      btn.style.borderColor = "var(--primary)";
      btn.style.background = "var(--primary-pale)";
      updPreview();
    });
  });
  modal.querySelectorAll(".color-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selColor = btn.dataset.color;
      modal
        .querySelectorAll(".color-pick-btn")
        .forEach((b) => (b.style.borderColor = "transparent"));
      btn.style.borderColor = "var(--text)";
      updPreview();
    });
  });
  document
    .getElementById("cancelProfileEdit")
    ?.addEventListener("click", () => closeModal("profileEditModal"));
  document.getElementById("saveProfileEdit")?.addEventListener("click", () => {
    const name = document.getElementById("profileNameInput").value.trim();
    if (!name) {
      showToast(t("enterAmount"), "error");
      return;
    }
    if (isNew) {
      const newId = "profile_" + Date.now();
      profiles.push({
        id: newId,
        name,
        emoji: selEmoji,
        color: selColor,
        role: "user",
      });
      saveGlobal();
      closeModal("profileEditModal");
      renderSettings();
      showToast("✅ " + name);
    } else {
      prof.name = name;
      prof.emoji = selEmoji;
      prof.color = selColor;
      saveGlobal();
      closeModal("profileEditModal");
      renderSettings();
      showToast(t("saved"));
    }
  });
}

const DEFAULT_PERMS = {
  add: true,
  del: false,
  edit: false,
  stats: true,
  notes: true,
  budgets: false,
  cats: false,
  export: false,
  viewOwner: false,
};
function generateShareId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
const HARDCODED_APP_URL = "https://motserelia.github.io";
function getAppUrl() {
  // 1. User override in localStorage (explicit save wins, including empty = auto)
  const stored = localStorage.getItem("budgetpro_app_url");
  if (stored !== null && stored.trim()) return stored.trim();
  // If stored is empty string, fall through to auto-detect
  if (stored === null) {
    // Never saved — auto-set from current location
  }
  // 2. Auto-detect from current location (works on GitHub Pages / Netlify / etc.)
  if (
    window.location.protocol.startsWith("http") &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    const u =
      window.location.origin +
      window.location.pathname
        .replace(/\/[^\/]*\.[^\/]*$/, "/")
        .replace(/\/?$/, "/");
    localStorage.setItem("budgetpro_app_url", u);
    return u;
  }
  // 3. Hardcoded fallback for GitHub Pages
  return HARDCODED_APP_URL;
}
async function hashSharePwd(pwd) {
  if (!pwd) return null;
  const data = new TextEncoder().encode(pwd + "share_salt_2024");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}
async function generateShareLink(prof) {
  if (!prof.shareSettings?.shareId) return null;
  const ss = prof.shareSettings;
  const pkg = {
    v: 3,
    type: "share_link",
    shareId: ss.shareId,
    pname: prof.name,
    pemoji: prof.emoji || "👤",
    pcolor: prof.color || "#2d6a4f",
    perms: ss.perms || { ...DEFAULT_PERMS },
    hasPwd: !!ss.pwHash,
    pwHash: ss.pwHash || null,
    locked: ss.locked || false,
    viewOwner: ss.perms?.viewOwner === true,
    ts: new Date().toISOString(),
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(pkg))));
  const appUrl = getAppUrl();
  if (appUrl) {
    return appUrl.replace(/#.*$/, "") + "#share=" + encoded;
  }
  return {
    local: true,
    url: window.location.href.split("#")[0] + "#share=" + encoded,
    encoded,
    pkg,
  };
}
async function generateInviteHtmlFile(prof) {
  const link = await generateShareLink(prof);
  if (!link) return null;
  const encoded =
    typeof link === "string" ? link.split("#share=")[1] : link.encoded;
  const appUrl = getAppUrl() || window.location.href.split("#")[0];
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>БюджетPRO — Приглашение</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;margin:0;padding:20px;box-sizing:border-box;}.card{background:#fff;border-radius:24px;padding:24px;max-width:360px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.12)}.avatar{width:80px;height:80px;border-radius:50%;background:${prof.color || "#2d6a4f"};display:flex;align-items:center;justify-content:center;font-size:44px;margin:0 auto 20px}.btn{display:block;width:100%;padding:18px;background:${prof.color || "#2d6a4f"};color:#fff;border:none;border-radius:99px;font-size:18px;font-weight:800;cursor:pointer;text-decoration:none;margin-top:20px;font-family:inherit;}</style></head><body><div class="card"><div class="avatar">${prof.emoji || "👤"}</div><h2 style="font-size:22px;font-weight:900;margin:0 0 8px;">Вас приглашают!</h2><p style="color:#666;font-size:15px;margin:0 0 20px;">Профиль в БюджетPRO: «${(prof.name || "").replace(/</g, "&lt;")}»</p><a class="btn" href="${appUrl}#share=${encoded}">🚀 Открыть профиль</a></div></body></html>`;
}
async function openShareModal(prof) {
  if (!prof) {
    showToast(t("profileNotFound"), "error");
    return;
  }
  if (!prof.shareSettings)
    prof.shareSettings = {
      shareId: null,
      pwHash: null,
      perms: { ...DEFAULT_PERMS },
      locked: false,
    };
  const ss = prof.shareSettings;
  if (!ss.shareId) {
    ss.shareId = generateShareId();
    saveGlobal();
  }

  const L = {
    ru: {
      title: "Поделиться профилем",
      desc: "Другой пользователь подключится к этому профилю с другого устройства.",
      createLink: "🔗 Создать ссылку",
      creating: "⏳ Создаю ссылку...",
      ready: "✅ Ссылка готова! Отправьте в WhatsApp или Telegram",
      copy: "📋 Копировать",
      share: "📤 Поделиться",
      download: "📄 Скачать файл-приглашение",
      open: "🔓 Профиль открыт",
      locked: "🔒 Профиль заблокирован",
      lockDesc: "Никто не сможет подключиться пока заблокирован",
      perms: "⚙️ Разрешения для гостя",
      permAdd: "➕ Добавлять операции",
      permDel: "🗑 Удалять операции",
      permEdit: "✏️ Редактировать операции",
      permStats: "📊 Просматривать статистику",
      permNotes: "📓 Вести заметки",
      permBudgets: "💰 Управлять бюджетами",
      permCats: "🗂 Управлять категориями",
      permExport: "📤 Экспортировать данные",
      permView: "👁 Просмотр моего профиля",
      permViewDesc: "Гость сможет видеть ваши операции (переключившись)",
      pwLabel: "Пароль для входа (необязательно)",
      pwHint: "Оставьте пустым — без пароля",
      pwChange: "Сменить пароль",
      save: "💾 Сохранить",
      revoke: "🚫 Отозвать доступ",
      revokeConfirm: "Отозвать ссылку? Все гости потеряют доступ.",
      copied: "✅ Ссылка скопирована!",
      shareCode: "Код профиля",
    },
    en: {
      title: "Share profile",
      desc: "Another user will connect to this profile from another device.",
      createLink: "🔗 Create link",
      creating: "⏳ Creating link...",
      ready: "✅ Link ready! Send via WhatsApp or Telegram",
      copy: "📋 Copy",
      share: "📤 Share",
      download: "📄 Download invite file",
      open: "🔓 Profile is open",
      locked: "🔒 Profile locked",
      lockDesc: "No one can connect while locked",
      perms: "⚙️ Guest permissions",
      permAdd: "➕ Add transactions",
      permDel: "🗑 Delete transactions",
      permEdit: "✏️ Edit transactions",
      permStats: "📊 View statistics",
      permNotes: "📓 Keep notes",
      permBudgets: "💰 Manage budgets",
      permCats: "🗂 Manage categories",
      permExport: "📤 Export data",
      permView: "👁 View my profile",
      permViewDesc: "Guest can see your transactions (by switching)",
      pwLabel: "Password (optional)",
      pwHint: "Leave empty for no password",
      pwChange: "Change password",
      save: "💾 Save",
      revoke: "🚫 Revoke access",
      revokeConfirm: "Revoke link? All guests will lose access.",
      copied: "✅ Link copied!",
      shareCode: "Profile code",
    },
    ka: {
      title: "პროფილის გაზიარება",
      desc: "სხვა მომხმარებელი დაუკავშირდება ამ პროფილს სხვა მოწყობილობიდან.",
      createLink: "🔗 ბმულის შექმნა",
      creating: "⏳ ვქმნი ბმულს...",
      ready: "✅ ბმული მზადაა! გაუგზავნეთ WhatsApp-ით ან Telegram-ით",
      copy: "📋 კოპირება",
      share: "📤 გაზიარება",
      download: "📄 მოწვევის ფაილის გადმოტვირთვა",
      open: "🔓 პროფილი ღიაა",
      locked: "🔒 პროფილი დაბლოკილია",
      lockDesc: "არავინ ვერ დაუკავშირდება სანამ დაბლოკილია",
      perms: "⚙️ სტუმრის ნებართვები",
      permAdd: "➕ ოპერაციების დამატება",
      permDel: "🗑 ოპერაციების წაშლა",
      permEdit: "✏️ ოპერაციების რედაქტირება",
      permStats: "📊 სტატისტიკის ნახვა",
      permNotes: "📓 ჩანაწერები",
      permBudgets: "💰 ბიუჯეტების მართვა",
      permCats: "🗂 კატეგორიების მართვა",
      permExport: "📤 ექსპორტი",
      permView: "👁 ჩემი პროფილის ნახვა",
      permViewDesc: "სტუმარს შეუძლია თქვენი ოპერაციების ნახვა",
      pwLabel: "პაროლი (სურვილისამებრ)",
      pwHint: "დატოვეთ ცარიელი პაროლის გარეშე",
      pwChange: "პაროლის შეცვლა",
      save: "💾 შენახვა",
      revoke: "🚫 წვდომის გაუქმება",
      revokeConfirm: "გაუქმდეს ბმული? ყველა სტუმარი კარგავს წვდომას.",
      copied: "✅ ბმული დაკოპირდა!",
      shareCode: "პროფილის კოდი",
    },
  };
  const LL = L[currentLang] || L.ru;
  const perms = ss.perms || { ...DEFAULT_PERMS };
  const permRows = [
    { k: "add", l: LL.permAdd },
    { k: "del", l: LL.permDel },
    { k: "edit", l: LL.permEdit },
    { k: "stats", l: LL.permStats },
    { k: "notes", l: LL.permNotes },
    { k: "budgets", l: LL.permBudgets },
    { k: "cats", l: LL.permCats },
    { k: "export", l: LL.permExport },
  ];

  const html = `
    <!-- Profile avatar + name -->
    <div style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--cream-dark);border-radius:16px;margin-bottom:14px;">
      <div style="width:50px;height:50px;border-radius:50%;background:${prof.color || "#2d6a4f"};display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">${prof.emoji || "👤"}</div>
      <div><div style="font-size:17px;font-weight:900;color:var(--text);">${esc(prof.name)}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${LL.desc}</div></div>
    </div>

    <!-- Share code -->
    <div style="display:flex;align-items:center;gap:10px;background:var(--income-pale);border-radius:14px;padding:12px 14px;margin-bottom:14px;border:1.5px solid var(--income-color);">
      <div style="flex:1;"><div style="font-size:11px;font-weight:800;color:var(--income-color);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px;">${LL.shareCode}</div>
      <div style="font-family:monospace;font-size:22px;font-weight:900;letter-spacing:4px;color:var(--text);">${ss.shareId}</div></div>
      <div style="font-size:28px;">🔑</div>
    </div>

    <!-- Create link button -->
    <button class="btn-primary" id="createShareLinkBtn" style="width:100%;margin-bottom:10px;font-size:16px;padding:16px;">
      ${LL.createLink}
    </button>

    <!-- Link display area -->
    <div id="shareLinkDisplay" style="display:none;margin-bottom:14px;"></div>

    <!-- Lock toggle -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:${ss.locked ? "var(--expense-pale)" : "var(--cream-dark)"};border-radius:14px;border:1.5px solid ${ss.locked ? "var(--expense-color)" : "var(--cream-border)"};margin-bottom:14px;transition:all .2s;">
      <div>
        <div style="font-size:15px;font-weight:800;color:${ss.locked ? "var(--expense-color)" : "var(--text)"};">${ss.locked ? "🔒 " + LL.locked : "🔓 " + LL.open}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${LL.lockDesc}</div>
      </div>
      <label class="switch"><input type="checkbox" id="lockToggle" ${ss.locked ? "checked" : ""}><span class="slider round"></span></label>
    </div>

    <!-- Permissions accordion -->
    <details style="margin-bottom:14px;" ${ss.locked ? "" : "open"}>
      <summary style="font-size:15px;font-weight:800;cursor:pointer;padding:12px 14px;background:var(--cream-dark);border-radius:12px;list-style:none;display:flex;align-items:center;justify-content:space-between;">${LL.perms} <span>▾</span></summary>
      <div style="padding:12px;background:var(--cream-dark);border-radius:0 0 12px 12px;margin-top:2px;display:flex;flex-direction:column;gap:10px;">
        ${permRows
          .map(
            (r) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">${r.l}</span>
          <label class="switch" style="flex-shrink:0;"><input type="checkbox" class="perm-toggle" data-perm="${r.k}" ${perms[r.k] !== false ? "checked" : ""}><span class="slider round"></span></label>
        </div>`,
          )
          .join("")}
        <!-- View owner -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-top:8px;border-top:1px solid var(--cream-border);">
          <div><div style="font-size:14px;font-weight:600;color:var(--text);">${LL.permView}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${LL.permViewDesc}</div></div>
          <label class="switch" style="flex-shrink:0;"><input type="checkbox" class="perm-toggle" data-perm="viewOwner" ${perms.viewOwner ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        <!-- Password -->
        <div style="padding-top:8px;border-top:1px solid var(--cream-border);">
          <label style="font-size:13px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:6px;">${ss.pwHash ? LL.pwChange : LL.pwLabel}</label>
          <input type="password" id="sharePwdInput" class="modal-input" placeholder="${LL.pwHint}" autocomplete="new-password">
        </div>
        <button class="btn-primary" id="savePermsBtn" style="margin-top:4px;">${LL.save}</button>
      </div>
    </details>

    <!-- Revoke -->
    <button class="btn-danger" id="revokeShareBtn" style="width:100%;">🚫 ${LL.revoke}</button>
  `;

  const modal = createModal(
    "shareModal",
    `${prof.emoji || "👤"} ${esc(prof.name)} — ${LL.title}`,
    html,
  );
  document.body.appendChild(modal);
  openModal("shareModal");

  // Lock toggle
  document.getElementById("lockToggle")?.addEventListener("change", (e) => {
    ss.locked = e.target.checked;
    saveGlobal();
    closeModal("shareModal");
    setTimeout(() => openShareModal(prof), 250);
  });

  // Create link
  document
    .getElementById("createShareLinkBtn")
    ?.addEventListener("click", async () => {
      const btn = document.getElementById("createShareLinkBtn");
      btn.textContent = LL.creating;
      btn.disabled = true;
      const linkResult = await generateShareLink(prof);
      btn.textContent = LL.createLink;
      btn.disabled = false;
      if (!linkResult) {
        showToast(
          {
            ru: "Не удалось создать ссылку",
            en: "Failed to create link",
            ka: "ბმული ვერ შეიქმნა",
          }[currentLang],
          "error",
        );
        return;
      }
      const finalLink =
        typeof linkResult === "string" ? linkResult : linkResult.url;
      const isLocal = typeof linkResult === "object" && linkResult.local;
      const disp = document.getElementById("shareLinkDisplay");
      if (disp) {
        disp.style.display = "block";
        disp.innerHTML = `
        <div style="background:var(--primary-pale);border-radius:14px;padding:14px;border:1.5px solid rgba(45,106,79,.25);">
          <div style="font-size:13px;font-weight:800;color:var(--income-color);margin-bottom:8px;">✅ ${LL.ready}</div>
          ${isLocal ? `<div style="font-size:11px;color:var(--gold);background:var(--gold-pale);border-radius:8px;padding:8px 10px;margin-bottom:8px;">⚠️ ${{ ru: "Вы на локальном файле. Ссылка заработает только на Netlify!", en: "You're on a local file. Link only works on Netlify!", ka: "ლოკალური ფაილია. ბმული მხოლოდ Netlify-ზე იმუშავებს!" }[currentLang]}</div>` : ""}
          <div style="background:var(--cream-dark);border-radius:10px;padding:10px 12px;word-break:break-all;font-size:12px;color:var(--text);margin-bottom:10px;font-family:monospace;">${esc(finalLink.slice(0, 80))}${finalLink.length > 80 ? "…" : ""}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <button class="btn-primary" id="copyLinkBtn" style="padding:12px;font-size:13px;">📋 ${LL.copy}</button>
            <button class="btn-secondary" id="shareLinkBtn" style="padding:12px;font-size:13px;">📤 ${LL.share}</button>
          </div>
          <button class="btn-secondary" id="dlInviteBtn" style="width:100%;margin-top:8px;padding:12px;font-size:13px;">📄 ${LL.download}</button>
        </div>`;
        document
          .getElementById("copyLinkBtn")
          ?.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(finalLink);
              showToast(LL.copied);
              haptic("success");
              document.getElementById("copyLinkBtn").textContent =
                "✅ " + LL.copy;
            } catch (e) {
              prompt("📋 " + LL.copy + ":", finalLink);
            }
          });
        document
          .getElementById("shareLinkBtn")
          ?.addEventListener("click", async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title: "БюджетPRO — " + prof.name,
                  url: finalLink,
                });
              } catch (e) {}
            } else {
              try {
                await navigator.clipboard.writeText(finalLink);
                showToast(LL.copied);
              } catch (e) {
                prompt("", finalLink);
              }
            }
          });
        document
          .getElementById("dlInviteBtn")
          ?.addEventListener("click", async () => {
            const html2 = await generateInviteHtmlFile(prof);
            if (!html2) return;
            const a = document.createElement("a");
            a.href = URL.createObjectURL(
              new Blob([html2], { type: "text/html" }),
            );
            a.download = `invite_${prof.name || "profile"}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast(t("fileDownloaded"));
          });
      }
      haptic("success");
    });

  // Save permissions
  document
    .getElementById("savePermsBtn")
    ?.addEventListener("click", async () => {
      const np = {};
      document.querySelectorAll("#shareModal .perm-toggle").forEach((cb) => {
        np[cb.dataset.perm] = cb.checked;
      });
      ss.perms = np;
      const pwd = document.getElementById("sharePwdInput")?.value.trim();
      if (pwd) ss.pwHash = await hashSharePwd(pwd);
      saveGlobal();
      showToast(
        {
          ru: "Разрешения сохранены",
          en: "Permissions saved",
          ka: "ნებართვები შენახულია",
        }[currentLang],
      );
      haptic("success");
      closeModal("shareModal");
      setTimeout(() => openShareModal(prof), 250);
    });

  // Revoke
  document.getElementById("revokeShareBtn")?.addEventListener("click", () => {
    askConfirm(
      LL.revokeConfirm,
      () => {
        ss.shareId = null;
        ss.pwHash = null;
        ss.perms = { ...DEFAULT_PERMS };
        ss.locked = false;
        saveGlobal();
        closeModal("shareModal");
        renderSettings();
        showToast(
          { ru: "Доступ отозван", en: "Access revoked", ka: "წვდომა გაუქმდა" }[
            currentLang
          ],
        );
      },
      { icon: "🚫" },
    );
  });
}

function checkShareLink() {
  const hash = window.location.hash;
  if (!hash.startsWith("#share=")) return false;
  try {
    const encoded = hash.slice(7);
    const pkg = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    if (pkg.type !== "share_link" || !pkg.shareId) return false;
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    showShareWelcomeScreen(pkg);
    return true;
  } catch (e) {
    return false;
  }
}

async function bootApp() {
  appBooting = true;
  traceApp("boot-start", { currentTab, currentLang });
  traceLayoutSnapshot("boot:start");
  await loadAll();
  traceApp("boot-loadAll-done", {
    transactions: transactions.length,
    profiles: profiles.length,
    activeProfileId,
  });
  traceLayoutSnapshot("boot:loadAll-done");
  scheduleBootLayoutTracing();
  if (!checkShareLink()) {
    if ((pinEnabled && pinHash) || biometryEnabled) {
      showPinScreen(init);
    } else {
      init();
    }
  }
}

async function showShareWelcomeScreen(pkg) {
  // Detect language: use stored lang or browser lang
  const lang =
    localStorage.getItem("lang") ||
    (navigator.language || "ru").slice(0, 2) ||
    "ru";
  const LL = {
    ru: {
      guestMode: "👤 Гостевой режим",
      shareWelcome: "Вас приглашают в профиль",
      join: "Войти в профиль →",
      cancel: "Отмена",
      locked: "🔒 Профиль заблокирован владельцем",
      pwdPh: "Введите пароль",
      pwdErr: "Неверный пароль",
      loading: "⏳ Подключение...",
    },
    en: {
      guestMode: "👤 Guest mode",
      shareWelcome: "You are invited to a profile",
      join: "Enter profile →",
      cancel: "Cancel",
      locked: "🔒 Profile is locked by owner",
      pwdPh: "Enter password",
      pwdErr: "Wrong password",
      loading: "⏳ Connecting...",
    },
    ka: {
      guestMode: "👤 სტუმრის რეჟიმი",
      shareWelcome: "გიწვევენ პროფილში",
      join: "პროფილში შესვლა →",
      cancel: "გაუქმება",
      locked: "🔒 პროფილი დაბლოკილია მფლობელის მიერ",
      pwdPh: "შეიყვანეთ პაროლი",
      pwdErr: "არასწორი პაროლი",
      loading: "⏳ დაკავშირება...",
    },
  };
  const lc = LL[lang] || LL[currentLang] || LL.ru;
  const ov = document.createElement("div");
  ov.id = "shareWelcomeOverlay";
  ov.style.cssText =
    "position:fixed;inset:0;background:var(--cream);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:calc(var(--safe-top) + 24px) 24px calc(var(--safe-bottom) + 24px);animation:fadeIn 0.3s ease both;";
  const profileColor = pkg.pcolor || "#2d6a4f";

  ov.innerHTML = `
    <div style="width:88px;height:88px;border-radius:50%;background:${profileColor};display:flex;align-items:center;justify-content:center;font-size:48px;box-shadow:0 8px 32px ${profileColor}55;animation:pulse 2s infinite;">${pkg.pemoji || "👤"}</div>
    <div style="font-size:13px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;">${lc.guestMode}</div>
    <div style="font-size:22px;font-weight:900;text-align:center;">${lc.shareWelcome}</div>
    <div style="font-size:20px;font-weight:800;color:${profileColor};text-align:center;">«${esc(pkg.pname || "")}»</div>

    ${
      pkg.locked
        ? `
      <div style="font-size:16px;font-weight:800;color:var(--expense-color);text-align:center;">${lc.locked}</div>
      <button id="shareWelcomeCancel" style="background:var(--cream-dark);border:1.5px solid var(--cream-border);border-radius:99px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;">${lc.cancel}</button>
    `
        : `
      ${
        pkg.hasPwd
          ? `
        <div style="max-width:320px;width:100%;">
          <input type="password" id="shareLinkPwdIn" placeholder="${lc.pwdPh}" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid var(--cream-border);background:var(--card-bg);font-size:20px;text-align:center;letter-spacing:4px;font-family:inherit;outline:none;transition:border-color 0.2s;">
          <div id="sharePwdErrDiv" style="color:var(--expense-color);font-size:13px;text-align:center;margin-top:6px;min-height:18px;font-weight:700;"></div>
        </div>
      `
          : ""
      }
      <button id="joinProfileBtn" style="background:${profileColor};color:white;border:none;border-radius:99px;padding:18px 36px;font-size:18px;font-weight:900;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px ${profileColor}44;transition:all 0.2s;">${lc.join}</button>
      <button id="shareWelcomeCancel" style="background:var(--cream-dark);border:1.5px solid var(--cream-border);border-radius:99px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">${lc.cancel}</button>

      <!-- Language switcher on welcome screen -->
      <div style="display:flex;gap:8px;margin-top:4px;">
        ${["ru", "en", "ka"].map((l) => `<button class="sw-lang-btn" data-lang="${l}" style="width:36px;height:36px;border-radius:50%;border:2px solid ${l === lang ? "var(--primary)" : "var(--cream-border)"};background:${l === lang ? "var(--primary)" : "var(--cream-dark)"};color:${l === lang ? "white" : "var(--text-muted)"};cursor:pointer;font-size:16px;transition:all 0.2s;">${l === "ru" ? "🇷🇺" : l === "en" ? "🇬🇧" : "🇬🇪"}</button>`).join("")}
      </div>
    `
    }
  `;

  document.body.appendChild(ov);

  // Cancel buttons
  document.querySelectorAll("#shareWelcomeCancel").forEach((btn) => {
    btn.addEventListener("click", () => {
      ov.remove();
      init();
    });
  });

  // Language switch on welcome screen
  document.querySelectorAll(".sw-lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
      ov.remove();
      showShareWelcomeScreen(pkg);
    });
  });

  // Focus password input
  const pwdIn = document.getElementById("shareLinkPwdIn");
  if (pwdIn) setTimeout(() => pwdIn.focus(), 200);

  const joinBtn = document.getElementById("joinProfileBtn");
  if (!joinBtn) return;

  joinBtn.addEventListener("mouseenter", () => {
    joinBtn.style.transform = "scale(1.04) translateY(-2px)";
  });
  joinBtn.addEventListener("mouseleave", () => {
    joinBtn.style.transform = "";
  });

  joinBtn.addEventListener("click", async () => {
    if (pkg.hasPwd && pkg.pwHash) {
      const entered = pwdIn?.value || "";
      if (!entered) {
        document.getElementById("sharePwdErrDiv").textContent = lc.pwdPh;
        return;
      }
      const h = await hashSharePwd(entered);
      if (h !== pkg.pwHash) {
        document.getElementById("sharePwdErrDiv").textContent = lc.pwdErr;
        pwdIn.style.borderColor = "var(--expense-color)";
        setTimeout(() => (pwdIn.style.borderColor = ""), 1200);
        return;
      }
    }
    joinBtn.textContent = lc.loading;
    joinBtn.disabled = true;

    const newId = "shared_" + pkg.shareId;
    let prof = profiles.find((p) => p.id === newId);
    if (!prof) {
      prof = {
        id: newId,
        name: pkg.pname || "Shared",
        emoji: pkg.pemoji || "👤",
        color: pkg.pcolor || "#2563eb",
        isShared: true,
        shareCode: pkg.shareId,
        sharePerms: pkg.perms || { ...DEFAULT_PERMS },
      };
      profiles.push(prof);
    }
    // SECURITY: Force role to "guest" — never allow owner/creator role via share link
    prof.role = "guest";
    // Clear any creator settings from localStorage for this session context
    // (creator settings are device-local, not transferred via link)
    const empty = {
      transactions: [],
      startBalanceRub: 0,
      notebookPages: [],
      categories: JSON.parse(JSON.stringify(window.initialCategories || {})),
      incomeCategories: {
        Зарплата: { subcats: [] },
        Подарок: { subcats: [] },
        Фриланс: { subcats: [] },
      },
      calcHistory: [],
      convHistory: [],
      userTemplates: [],
      frequentStats: {},
      categoryCustomizations: {},
      categoryBudgets: {},
      recurringOps: [],
    };
    if (!localStorage.getItem("budget_profile_" + newId))
      localStorage.setItem("budget_profile_" + newId, JSON.stringify(empty));
    sharedAccessProfile = {
      profileId: newId,
      perms: pkg.perms || { ...DEFAULT_PERMS },
    };
    activeProfileId = newId;
    // Ensure no creator role leaks through
    profiles.forEach((p) => {
      if (p.id === newId) p.role = "guest";
    });
    saveGlobal();
    loadProfileData(newId);
    syncStartBalanceTransaction();
    ov.remove();
    init();
  showToast(`${t("savedMark")} ${t("guestModeActivated")}: ${pkg.pname}`);
  });
}

function exitGuestMode() {
  if (!sharedAccessProfile) return;

  // Ищем локальный профиль, созданный ранее для этого гостя
  let ownProfile = profiles.find((p) => p.guestCreated === true);
  if (!ownProfile) {
    // Создаём новый изолированный профиль для гостя
    const newId = "guest_local_" + Date.now();
    ownProfile = {
      id: newId,
      name: "Мой профиль",
      emoji: "👤",
      color: "#2d6a4f",
      isShared: false,
      guestCreated: true,
      role: "user",
    };
    profiles.push(ownProfile);
    // Инициализируем пустые данные для нового профиля
    localStorage.setItem(
      "budget_profile_" + newId,
      JSON.stringify({
        transactions: [],
        startBalanceRub: 0,
        notebookPages: [],
        categories: JSON.parse(JSON.stringify(window.initialCategories)),
        incomeCategories: {
          Зарплата: { subcats: [] },
          Подарок: { subcats: [] },
          Фриланс: { subcats: [] },
        },
        calcHistory: [],
        convHistory: [],
        userTemplates: [],
        frequentStats: {},
        categoryCustomizations: {},
        categoryBudgets: {},
        recurringOps: [],
      }),
    );
  }

  // Выходим из гостевого режима
  sharedAccessProfile = null;
  saveGlobal();

  // Переключаемся на собственный профиль гостя
  switchProfile(ownProfile.id);
  updateHeader();
  showToast(t("switchedToOwnProfile"));
}

function haptic(type = "light") {
  if (!hapticEnabled || !navigator.vibrate) return;
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30, 10, 30],
    success: [10, 5, 20],
  };
  navigator.vibrate(patterns[type] || patterns.light);
}

function openContactUrl(channel, contact, subject, body) {
  let url = "";
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  switch (channel) {
    case "email":
      url = `mailto:${contact}?subject=${encodedSubject}&body=${encodedBody}`;
      break;
    case "whatsapp":
      url = `https://wa.me/${contact.replace(/\D/g, "")}?text=${encodedSubject}%0A${encodedBody}`;
      break;
    case "viber":
      url = `viber://chat?number=${encodeURIComponent(contact.replace(/\D/g, ""))}`;
      break;
    case "telegram":
      url = `https://t.me/${contact.replace("@", "")}`;
      break;
    case "messenger":
      url = `https://m.me/${contact}`;
      break;
    case "sms":
      url = `sms:${contact}?body=${encodedSubject}%0A${encodedBody}`;
      break;
  }
  if (url) window.open(url, "_blank");
}

function openSupportModal() {
  // Always use the enhanced chat system
  if (typeof openEnhancedSupportModal === "function") {
    openEnhancedSupportModal();
    return;
  }
  const cs = getCreatorSettings();
  const canContact = cs.contactEnabled !== false;
  const preferPhone = cs.preferPhone === true;
  const PH1 = "", PH2 = "", EM = "";

  // === CREATOR ADMIN PANEL ===
  if (isCreator()) {
    const L_cr = {
      ru: "Управление обращениями",
      en: "Manage feedback",
      ka: "მართვა",
    };
    const L_how = {
      ru: "Как получать сообщения:",
      en: "How to receive messages:",
      ka: "შეტყობინების მიღება:",
    };
    const L_on = { ru: "Приём включён", en: "Enabled", ka: "ჩართულია" };
    const L_off = { ru: "Приём отключён", en: "Disabled", ka: "გამორთულია" };
    const L_can = {
      ru: "Пользователи могут писать вам",
      en: "Users can contact you",
      ka: "მომხმარებლები დაგიკავშირდებიან",
    };
    const L_save = { ru: "Сохранить", en: "Save", ka: "შენახვა" };
    const L_saved = { ru: "Сохранено", en: "Saved", ka: "შენახულია" };

    const channels = [
      { id: "email", name: "📧 Email", placeholder: "example@gmail.com" },
      { id: "whatsapp", name: "📱 WhatsApp", placeholder: "+1234567890" },
      { id: "viber", name: "📞 Viber", placeholder: "+1234567890" },
      { id: "telegram", name: "✈️ Telegram", placeholder: "@username" },
      {
        id: "messenger",
        name: "💬 Messenger",
        placeholder: "facebook_username",
      },
      { id: "sms", name: "📲 SMS", placeholder: "+1234567890" },
    ];
    const currentChannel = cs.preferredChannel || "email";
    const contacts = cs.contacts || { email: EM, whatsapp: PH1 };

    const html = `
      <div style="background:var(--gold-pale);border-radius:14px;padding:12px 14px;margin-bottom:16px;border-left:4px solid var(--gold);font-size:13px;font-weight:800;color:#b45309;">👑 ${L_cr[currentLang] || L_cr.ru}</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:12px;">${L_how[currentLang] || L_how.ru}</div>
      
      <!-- Выбор канала -->
      <div class="field-group">
        <label class="field-label">🌐 Предпочитаемый канал для ответа</label>
        <select id="prefChannelSelect" class="modal-select">
          ${channels.map((c) => `<option value="${c.id}" ${currentChannel === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
        </select>
      </div>
      
      <!-- Поле ввода контакта -->
      <div id="channelContactInputs" class="field-group"></div>
      
      <!-- Приём включён -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:${canContact ? "var(--income-pale)" : "var(--expense-pale)"};border-radius:14px;border:1.5px solid ${canContact ? "var(--income-color)" : "var(--expense-color)"};margin-bottom:16px;">
        <div>
          <div style="font-size:14px;font-weight:800;color:${canContact ? "var(--income-color)" : "var(--expense-color)"};">${canContact ? "✅ " + (L_on[currentLang] || L_on.ru) : "⛔ " + (L_off[currentLang] || L_off.ru)}</div>
          <div style="font-size:12px;color:var(--text-muted);">${L_can[currentLang] || L_can.ru}</div>
        </div>
        <label class="switch"><input type="checkbox" id="ceToggle" ${canContact ? "checked" : ""}><span class="slider round"></span></label>
      </div>

      <!-- Получать сообщения в приложении -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:var(--cream-dark);border-radius:14px;border:1.5px solid var(--cream-border);margin-bottom:16px;">
        <div>
          <div style="font-size:14px;font-weight:800;color:var(--text);">📲 Получать сообщения в приложении</div>
          <div style="font-size:12px;color:var(--text-muted);">Входящие будут видны только здесь</div>
        </div>
        <label class="switch"><input type="checkbox" id="inAppMessagesToggle" ${cs.inAppMessages ? "checked" : ""}><span class="slider round"></span></label>
      </div>

      <!-- URL приложения -->
      <div class="field-group">
        <label class="field-label">🔗 URL приложения (для ссылок)</label>
        <input type="text" id="appUrlInput" class="modal-input" value="${getAppUrl()}" placeholder="https://your-site.netlify.app">
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Без этого ссылки на шаринг могут не работать.</div>
      </div>

      <!-- Входящие сообщения -->
      <div style="margin-top:24px; border-top:2px solid var(--cream-border); padding-top:16px;">
        <div style="font-size:16px; font-weight:800; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
          <span>📬 Входящие сообщения</span>
          <span style="background:var(--primary); color:white; padding:2px 10px; border-radius:20px; font-size:13px;" id="msgCount"></span>
        </div>
        <div id="messagesList" style="max-height:300px; overflow-y:auto; border:1px solid var(--cream-border); border-radius:12px; padding:8px; background:var(--cream-dark);">
        </div>
      </div>

      <button class="btn-secondary" id="exitCreatorBtn" style="margin-bottom:12px; width:100%;">🚪 Выйти из режима создателя</button>

      <div class="modal-actions">
        <button class="btn-secondary" id="supCancel">${t("cancel")}</button>
        <button class="btn-primary" id="saveCC" style="background:var(--gold);color:white;">💾 ${L_save[currentLang] || L_save.ru}</button>
      </div>`;

    const modal = createModal(
      "supportModal",
      "👑 " + (L_cr[currentLang] || L_cr.ru),
      html,
    );
    document.body.appendChild(modal);
    openModal("supportModal");

    // Функция обновления поля контакта при смене канала
    const updateChannelInput = () => {
      const sel = document.getElementById("prefChannelSelect");
      const container = document.getElementById("channelContactInputs");
      if (!sel || !container) return;
      const channelId = sel.value;
      const channel = channels.find((c) => c.id === channelId);
      const value = contacts[channelId] || "";
      container.innerHTML = `
        <label class="field-label">Контакт для ${channel.name}</label>
        <input type="text" id="channelContactInput" class="modal-input" value="${esc(value)}" placeholder="${channel.placeholder}">
      `;
    };

    const prefSel = document.getElementById("prefChannelSelect");
    prefSel.addEventListener("change", updateChannelInput);
    updateChannelInput();

    document
      .getElementById("supCancel")
      .addEventListener("click", () => closeModal("supportModal"));

    document.getElementById("saveCC")?.addEventListener("click", () => {
      const prefChannel = prefSel.value;
      const en2 = document.getElementById("ceToggle")?.checked;
      const appUrl = document.getElementById("appUrlInput")?.value.trim() || "";
      const contactInput =
        document.getElementById("channelContactInput")?.value.trim() || "";
      const inAppMessages =
        document.getElementById("inAppMessagesToggle")?.checked || false;

      const newContacts = { ...contacts };
      if (contactInput) newContacts[prefChannel] = contactInput;

      if (appUrl) {
        localStorage.setItem("budgetpro_app_url", appUrl);
      } else {
        localStorage.removeItem("budgetpro_app_url");
      }

      localStorage.setItem(
        "budgetpro_creator_settings",
        JSON.stringify({
          ...cs,
          preferredChannel: prefChannel,
          contacts: newContacts,
          contactEnabled: en2,
          inAppMessages: inAppMessages,
        }),
      );
      closeModal("supportModal");
      showToast("✅ " + (L_saved[currentLang] || L_saved.ru));
      haptic("success");
    });

    document.getElementById("exitCreatorBtn")?.addEventListener("click", () => {
      const prof = profiles.find((p) => p.id === activeProfileId);
      if (prof) {
        prof.role = "user"; // снимаем роль owner
        saveGlobal();
        updateHeader();
      }
      closeModal("supportModal");
      showToast(t("creatorModeOff"));
      if (currentTab === "settings") renderSettings();
    });

    // Функция рендеринга сообщений
    function renderMessages() {
      const ownerData = JSON.parse(
        localStorage.getItem("budget_profile_" + activeProfileId) || "{}",
      );
      const msgs = ownerData.supportMessages || [];
      const listDiv = document.getElementById("messagesList");
      const countSpan = document.getElementById("msgCount");
      if (countSpan) countSpan.textContent = msgs.length;
      if (!listDiv) return;

      if (msgs.length === 0) {
        listDiv.innerHTML =
          '<div style="padding:16px; text-align:center; color:var(--text-muted);">Нет сообщений</div>';
        return;
      }

      listDiv.innerHTML = msgs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((msg) => {
          const date = new Date(msg.date).toLocaleString(currentLang);
          const repliedBadge = msg.replied ? "✅" : "🆕";
          return `<div style="background:var(--card-bg); border-radius:10px; padding:12px; margin-bottom:8px; border-left:4px solid ${msg.replied ? "var(--income-color)" : "var(--gold)"};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-weight:800;">${esc(msg.name)} ${repliedBadge}</span>
            <span style="font-size:12px; color:var(--text-muted);">${date}</span>
          </div>
                  <div style="font-size:13px; margin-bottom:4px;">
          <strong>${esc(msg.category)}</strong>
          ${msg.email ? "· 📧 " + esc(msg.email) : ""}
          ${msg.phone ? "· 📱 " + esc(msg.phone) : ""}
        </div>
          <div style="font-size:14px; margin-bottom:10px; white-space:pre-wrap;">${esc(msg.message)}</div>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary reply-btn" data-msgid="${msg.id}" style="padding:6px 12px; font-size:13px;">💬 Ответить</button>
            <button class="btn-secondary mark-replied-btn" data-msgid="${msg.id}" style="padding:6px 12px; font-size:13px;">✔ Отметить отвеченным</button>
            <button class="btn-secondary delete-msg-btn" data-msgid="${msg.id}" style="padding:6px 12px; font-size:13px; margin-left:auto;">🗑</button>
          </div>
        </div>`;
        })
        .join("");

      // Обработчики кнопок
      listDiv.querySelectorAll(".reply-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const msgId = btn.dataset.msgid;
          const msg = msgs.find((m) => m.id === msgId);
          if (!msg) return;

          const userContact = msg.phone || msg.email;
          if (!userContact) {
            showToast(t("noReplyContact"), "error");
            return;
          }

          // Показываем модальное окно для ввода ответа
          const replyHtml = `
            <div class="field-group">
              <label class="field-label">📝 Ваш ответ для ${esc(msg.name)}</label>
              <textarea id="replyMessageInput" class="modal-textarea" rows="4" placeholder="${t("replyTextPlaceholder")}"></textarea>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" id="cancelReplyBtn">${t("cancel")}</button>
              <button class="btn-primary" id="sendReplyBtn">📤 Отправить</button>
            </div>
          `;
          const replyModal = createModal(
            "replyModal",
            "Ответ пользователю",
            replyHtml,
          );
          document.body.appendChild(replyModal);
          openModal("replyModal");

          document
            .getElementById("sendReplyBtn")
            .addEventListener("click", () => {
              const replyText = document
                .getElementById("replyMessageInput")
                .value.trim();
              if (!replyText) {
                showToast(t("enterReplyText"), "error");
                return;
              }

              const cs = getCreatorSettings();
              let channel = "email";
              if (msg.phone) {
                channel = cs.preferredChannel || "whatsapp";
              }

              const subject = `Re: ${msg.category} (ответ от поддержки)`;
              const body = `Здравствуйте, ${msg.name}!\n\n${replyText}\n\n---\nВаше обращение:\n"${msg.message}"`;

              openContactUrl(channel, userContact, subject, body);
              msg.replied = true;
              localStorage.setItem(
                "budget_profile_" + activeProfileId,
                JSON.stringify(ownerData),
              );
              closeModal("replyModal");
              renderMessages();
              showToast(t("replySent"));
            });

          document
            .getElementById("cancelReplyBtn")
            .addEventListener("click", () => {
              closeModal("replyModal");
            });
        });
      });

      listDiv.querySelectorAll(".mark-replied-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const msgId = btn.dataset.msgid;
          const msg = msgs.find((m) => m.id === msgId);
          if (msg) {
            msg.replied = true;
          }
          localStorage.setItem(
            "budget_profile_" + activeProfileId,
            JSON.stringify(ownerData),
          );
          renderMessages();
        });
      });

      listDiv.querySelectorAll(".delete-msg-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const msgId = btn.dataset.msgid;
          ownerData.supportMessages = msgs.filter((m) => m.id !== msgId);
          localStorage.setItem(
            "budget_profile_" + activeProfileId,
            JSON.stringify(ownerData),
          );
          renderMessages();
        });
      });
    }

    window._renderMessages = renderMessages;
    renderMessages();
    return;
  }

  // === SUPPORT DISABLED ===
  if (canContact === false || cs.contactEnabled === false) {
    const L0 = {
      ru: "Поддержка временно недоступна",
      en: "Support temporarily unavailable",
      ka: "მხარდაჭერა მიუწვდომელია",
    };
    const modal = createModal(
      "supportModal",
      t("supportTitle"),
      `<div style="text-align:center;padding:32px 20px;"><div style="font-size:52px;margin-bottom:16px;">🔕</div><div style="font-size:18px;font-weight:900;">${L0[currentLang] || L0.ru}</div></div><button class="btn-secondary" id="supCancel" style="width:100%;">${t("cancel")}</button>`,
    );
    document.body.appendChild(modal);
    openModal("supportModal");
    document
      .getElementById("supCancel")
      ?.addEventListener("click", () => closeModal("supportModal"));
    return;
  }

  // === USER CONTACT FORM ===
  const LABS = {
    ru: {
      title: "Написать разработчику",
      hint: "Ваше сообщение получит создатель приложения и лично ответит вам.",
      name: "Ваше имя *",
      email: "Email для ответа",
      cat: "Тема *",
      msg: "Сообщение *",
      ph: "Опишите проблему или идею...",
      bug: "🐛 Ошибка в приложении",
      idea: "💡 Идея / предложение",
      help: "❓ Нужна помощь",
      other: "💬 Другое",
      req: "Заполните обязательные поля *",
      sent: "✅ Спасибо! Скоро ответим",
    },
    en: {
      title: "Contact developer",
      hint: "Your message will reach the app creator who will reply personally.",
      name: "Your name *",
      email: "Reply email",
      cat: "Subject *",
      msg: "Message *",
      ph: "Describe the issue or idea...",
      bug: "🐛 Bug report",
      idea: "💡 Idea / suggestion",
      help: "❓ Need help",
      other: "💬 Other",
      req: "Fill in required fields *",
      sent: "✅ Thanks! We'll reply soon",
    },
    ka: {
      title: "დეველოპერთან კონტაქტი",
      hint: "შეტყობინება მივა შემქმნელს, რომელიც პირადად გიპასუხებთ.",
      name: "თქვენი სახელი *",
      email: "Email პასუხისთვის",
      cat: "თემა *",
      msg: "შეტყობინება *",
      ph: "აღწერეთ პრობლემა ან იდეა...",
      bug: "🐛 შეცდომა",
      idea: "💡 იდეა",
      help: "❓ დახმარება",
      other: "💬 სხვა",
      req: "შეავსეთ ყველა ველი *",
      sent: "✅ გმადლობთ! მალე გიპასუხებთ",
    },
  };
  const L = LABS[currentLang] || LABS.ru;
  L.send = t("send");
  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:12px 14px;margin-bottom:14px;border-left:4px solid var(--primary);font-size:13px;line-height:1.6;color:var(--text-soft);">${L.hint}</div>
    <div class="field-group"><label class="field-label">${L.name}</label><input type="text" id="supName" class="modal-input" placeholder="${L.name.replace(" *", "")}"></div>
    <div class="field-group"><label class="field-label">${L.email}</label><input type="email" id="supEmail" class="modal-input" placeholder="${t("emailPlaceholder")}"></div>
        <div class="field-group"><label class="field-label">${t("supportPhoneLabel")}</label><input type="tel" id="supPhone" class="modal-input" placeholder="+995..."></div>
    <div class="field-group"><label class="field-label">${L.cat}</label>
      <select id="supCat" class="modal-select">
        <option value="">— ${L.cat.replace(" *", "")} —</option>
        <option value="bug">${L.bug}</option>
        <option value="idea">${L.idea}</option>
        <option value="help">${L.help}</option>
        <option value="other">${L.other}</option>
      </select></div>
    <div class="field-group"><label class="field-label">${L.msg}</label>
      <textarea id="supMsg" class="modal-textarea" rows="4" placeholder="${L.ph}"></textarea></div>
    <div id="supResult" style="display:none;padding:12px;background:var(--income-pale);border-radius:12px;margin-bottom:10px;font-weight:700;color:var(--income-color);text-align:center;"></div>
        <div style="margin-bottom:10px;">
      <button class="btn-primary" id="supSendBtn" style="width:100%;">📤 ${L.send || "Отправить"}</button>
    </div>
    <button class="btn-secondary" id="supCancel" style="width:100%;">${t("cancel")}</button>`;
  const modal = createModal("supportModal", L.title, html);
  document.body.appendChild(modal);
  openModal("supportModal");
  document
    .getElementById("supCancel")
    ?.addEventListener("click", () => closeModal("supportModal"));
  const getF = () => ({
    name: document.getElementById("supName")?.value.trim() || "",
    email: document.getElementById("supEmail")?.value.trim() || "",
    phone: document.getElementById("supPhone")?.value.trim() || "",
    cat: document.getElementById("supCat")?.value || "",
    msg: document.getElementById("supMsg")?.value.trim() || "",
  });
  const chk = (f) => {
    if (!f.name || !f.cat || !f.msg) {
      showToast(L.req, "error");
      return false;
    }
    return true;
  };
  const done = () => {
    const r2 = document.getElementById("supResult");
    if (r2) {
      r2.style.display = "block";
      r2.textContent = L.sent;
    }
    haptic("success");
    setTimeout(() => closeModal("supportModal"), 2500);
  };

  // ЕДИНСТВЕННЫЙ обработчик отправки
  // ЕДИНСТВЕННЫЙ обработчик отправки
  document.getElementById("supSendBtn")?.addEventListener("click", () => {
    const f = getF();
    if (!chk(f)) return;

    const cs = getCreatorSettings();
    if (!cs.contactEnabled) {
      showToast(t("supportDisabled"), "error");
      closeModal("supportModal");
      return;
    }

    // Если НЕ получать сообщения в приложении, просто делаем вид, что отправили
    if (!cs.inAppMessages) {
      done();
      return;
    }

    const ownerProfile = profiles.find((p) => p.role === "owner");
    if (!ownerProfile) {
      showToast(
        "Невозможно отправить сообщение: профиль владельца не найден",
        "error",
      );
      return;
    }

    const ownerKey = "budget_profile_" + ownerProfile.id;
    const ownerData = JSON.parse(localStorage.getItem(ownerKey) || "{}");
    const messages = ownerData.supportMessages || [];

    const newMsg = {
      id: Date.now() + Math.random().toString(36),
      name: f.name,
      email: f.email,
      phone: f.phone,
      category: f.cat,
      message: f.msg,
      date: new Date().toISOString(),
      replied: false,
      fromProfile: activeProfileId,
    };
    messages.push(newMsg);
    ownerData.supportMessages = messages;
    localStorage.setItem(ownerKey, JSON.stringify(ownerData));

    if (activeProfileId === ownerProfile.id) {
      showToast(`${t("newMessageFrom")} ${f.name}`, "success", 3000);
      if (window._renderMessages) window._renderMessages();
    } else {
      localStorage.setItem("has_new_support_messages", "true");
    }

    done();
  });
}

// ============================================================
// ТОЧКА ВХОДА
// ============================================================

// ── Notification button handler — module-level for reliable Chrome PWA ──
function updateNotifUI(enabled) {
  remindersEnabled = enabled;
  saveReminderSettings();
  const ridEl = document.getElementById("remindersIntervalDiv");
  if (ridEl) ridEl.style.display = enabled ? "block" : "none";
  const btn = document.getElementById("notifEnableBtn");
  if (btn) {
    const L = {
      ru: ["🔔 Включить напоминания", "🔕 Выключить напоминания"],
      en: ["🔔 Enable reminders", "🔕 Disable reminders"],
      ka: ["🔔 შეხსენებების ჩართვა", "🔕 შეხსენებების გამორთვა"],
    }[currentLang] || ["🔔 Enable", "🔕 Disable"];
    btn.textContent = enabled ? L[1] : L[0];
    btn.style.background = enabled ? "var(--expense-color)" : "";
    btn.disabled = false;
  }
  const statusEl = document.getElementById("notifStatusBlock");
  if (statusEl) {
    statusEl.style.background = enabled
      ? "var(--income-pale)"
      : "var(--cream-dark)";
    statusEl.style.borderColor = enabled
      ? "var(--income-color)"
      : "var(--cream-border)";
    const iconEl = statusEl.querySelector(".notif-icon");
    const titleEl = statusEl.querySelector("[data-notif-title]");
    if (iconEl) iconEl.textContent = enabled ? "🔔" : "🔕";
    if (titleEl)
      titleEl.textContent = enabled
        ? {
            ru: "Напоминания включены",
            en: "Reminders enabled",
            ka: "შეხსენებები ჩართულია",
          }[currentLang]
        : {
            ru: "Напоминания выключены",
            en: "Reminders disabled",
            ka: "შეხსენებები გამორთულია",
          }[currentLang];
  }
}

function handleNotifBtnClick() {
  if (!("Notification" in window)) {
    showToast(
      {
        ru: "Уведомления недоступны. Используйте Chrome на Android или компьютере.",
        en: "Notifications unavailable. Use Chrome on Android or desktop.",
        ka: "Chrome გამოიყენეთ Android-ზე ან კომპიუტერზე.",
      }[currentLang],
      "error",
    );
    return;
  }
  if (remindersEnabled) {
    stopReminderTimer();
    updateNotifUI(false);
    showToast(t("remindersDisabled"));
    return;
  }
  if (Notification.permission === "granted") {
    startReminderTimer();
    updateNotifUI(true);
    // больше не показываем тестовое уведомление
    showToast(t("remindersPermissionGranted"), "success");
    return;
  }
  if (Notification.permission === "denied") {
    openNotificationHelpModal();
    return;
  }
  // permission === "default" — запрашиваем разрешение
  const btn = document.getElementById("notifEnableBtn");
  if (btn) {
    btn.textContent = "⏳";
    btn.disabled = true;
  }

  Notification.requestPermission().then((p) => {
    if (p === "granted") {
      startReminderTimer();
      updateNotifUI(true);
      showToast(t("remindersPermissionGranted"), "success");
    } else if (p === "denied") {
      if (btn) {
        btn.disabled = false;
        btn.textContent =
          "🔔 " +
          {
            ru: "Включить напоминания",
            en: "Enable reminders",
            ka: "შეხსენებების ჩართვა",
          }[currentLang];
      }
      openNotificationHelpModal();
    } else {
      if (btn) {
        btn.disabled = false;
        btn.textContent =
          "🔔 " +
          {
            ru: "Включить напоминания",
            en: "Enable reminders",
            ka: "შეხსენებების ჩართვა",
          }[currentLang];
      }
      showToast(
        {
          ru: "Нажмите «Разрешить» в запросе и повторите",
          en: "Tap 'Allow' in the prompt then try again",
          ka: "'Allow' დააჭირეთ და კვლავ სცადეთ",
        }[currentLang],
        "error",
      );
    }
  });
}

function openNotificationHelpModal() {
  const lang = currentLang;
  const steps = {
    ru: [
      {
        browser: "Chrome / Android",
        steps:
          "1. Нажмите 🔒 в адресной строке\n2. Уведомления → Разрешить\n3. Перезагрузите страницу",
      },
      {
        browser: "Safari / iPhone",
        steps:
          "1. Настройки → Safari → Уведомления\n2. Найдите motserelia.github.io\n3. Включите уведомления",
      },
      {
        browser: "Firefox",
        steps: "1. Нажмите 🔒 → Разрешения\n2. Уведомления → Разрешить",
      },
    ],
    en: [
      {
        browser: "Chrome / Android",
        steps:
          "1. Tap 🔒 in address bar\n2. Notifications → Allow\n3. Reload the page",
      },
      {
        browser: "Safari / iPhone",
        steps:
          "1. Phone Settings → Safari → Notifications\n2. Find motserelia.github.io\n3. Enable notifications",
      },
      {
        browser: "Firefox",
        steps: "1. Tap 🔒 → Permissions\n2. Notifications → Allow",
      },
    ],
    ka: [
      {
        browser: "Chrome / Android",
        steps:
          "1. 🔒 მისამართის ველში\n2. შეტყობინებები → ნება\n3. გვერდის განახლება",
      },
      {
        browser: "Safari / iPhone",
        steps:
          "1. პარამეტრები → Safari → შეტყობინებები\n2. motserelia.github.io\n3. ჩართვა",
      },
      {
        browser: "Firefox",
        steps: "1. 🔒 → ნებართვები\n2. შეტყობინებები → ნება",
      },
    ],
  };
  const items = steps[lang] || steps.ru;
  const title = {
    ru: "🔔 Как включить уведомления",
    en: "🔔 How to enable notifications",
    ka: "🔔 შეტყობინებების ჩართვა",
  }[lang];
  const okL = { ru: "Понятно", en: "Got it", ka: "გასაგებია" }[lang];
  const html =
    "<div style='display:flex;flex-direction:column;gap:12px;'>" +
    items
      .map(
        (item, i) =>
          `<div style="background:${i === 0 ? "var(--primary-pale)" : "var(--cream-dark)"};border-radius:14px;padding:14px;border-left:4px solid ${i === 0 ? "var(--primary)" : "var(--cream-border)"};">` +
          `<div style="font-weight:800;font-size:14px;margin-bottom:6px;">${item.browser}</div>` +
          `<div style="font-size:13px;line-height:1.8;white-space:pre-line;">${item.steps}</div>` +
          `</div>`,
      )
      .join("") +
    `<button class="btn-primary" id="notifHelpOk" style="width:100%;">${okL}</button>` +
    "</div>";
  const modal = createModal("notifHelpModal", title, html);
  document.body.appendChild(modal);
  openModal("notifHelpModal");
  document
    .getElementById("notifHelpOk")
    ?.addEventListener("click", () => closeModal("notifHelpModal"));
}

bootApp();
setTimeout(updateOfflineBar, 600);

// 4-click logo → Creator login
let _logoClickCount = 0,
  _logoClickTimer = null;
document.getElementById("appLogoBtn").addEventListener("click", () => {
  _logoClickCount++;
  clearTimeout(_logoClickTimer);
  _logoClickTimer = setTimeout(() => {
    _logoClickCount = 0;
  }, 1200);
  if (_logoClickCount >= 4) {
    _logoClickCount = 0;
    clearTimeout(_logoClickTimer);
    const prof = profiles.find((p) => p.id === activeProfileId);
    if (isCreator()) {
      showCreatorExitModal(prof);
    } else {
      showCreatorLoginModal(prof);
    }
  }
});

if (customReminderTimestamp) {
  const remaining = customReminderTimestamp - Date.now();
  if (remaining > 0) {
    customReminderTimeout = setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(customReminderText || t("remindersDesc"));
      } else {
        showToast("🔔 " + (customReminderText || t("remindersDesc")));
      }
      customReminderDate = customReminderTime = customReminderText = "";
      customReminderTimestamp = null;
      [
        "customReminderDate",
        "customReminderTime",
        "customReminderText",
        "customReminderTimestamp",
      ].forEach((k) => localStorage.removeItem(k));
      customReminderTimeout = null;
      if (currentTab === "settings") renderSettings();
    }, remaining);
  } else {
    customReminderDate = customReminderTime = customReminderText = "";
    customReminderTimestamp = null;
    [
      "customReminderDate",
      "customReminderTime",
      "customReminderText",
      "customReminderTimestamp",
    ].forEach((k) => localStorage.removeItem(k));
  }
}

// ============================================================
// CREATOR LOGIN MODAL (4-click secret entry)
// ============================================================
function showCreatorLoginModal(prof) {
  const L = {
    ru: {
      title: "Вход для создателя",
      hint: "Нажмите на логотип 4 раза, затем введите секретный ключ",
      label: "Секретный ключ",
      ph: "Введите ключ...",
      btn: "Войти",
      wrong: "❌ Неверный ключ",
      tip: "Подсказка: ключ хранится у разработчика",
    },
    en: {
      title: "Creator Login",
      hint: "Tap the logo 4 times, then enter the secret key",
      label: "Secret key",
      ph: "Enter key...",
      btn: "Login",
      wrong: "❌ Wrong key",
      tip: "Hint: key is kept by the developer",
    },
    ka: {
      title: "შემქმნელის შესვლა",
      hint: "დააჭირეთ ლოგოს 4-ჯერ, შემდეგ შეიყვანეთ საიდუმლო გასაღები",
      label: "საიდუმლო გასაღები",
      ph: "შეიყვანეთ გასაღები...",
      btn: "შესვლა",
      wrong: "❌ არასწორი გასაღები",
      tip: "მინიშნება: გასაღები ინახება შემქმნელთან",
    },
  };
  const lc = L[currentLang] || L.ru;
  const overlay = document.createElement("div");
  overlay.id = "creatorLoginOverlay";
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);animation:fadeIn 0.2s ease both;";
  overlay.innerHTML = `
    <div style="background:var(--card-bg);border-radius:32px;padding:32px 28px;max-width:340px;width:90%;box-shadow:0 24px 80px rgba(0,0,0,0.4);animation:slideUpBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) both;border:2px solid var(--gold-border);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:56px;margin-bottom:12px;animation:pulse 2s infinite;">👑</div>
        <div style="font-size:20px;font-weight:900;color:var(--primary);">${lc.title}</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:8px;line-height:1.5;">${lc.hint}</div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:700;color:var(--text-soft);display:block;margin-bottom:8px;">${lc.label}</label>
        <div style="position:relative;">
          <input type="password" id="creatorKeyInput" class="modal-input" placeholder="${lc.ph}" style="width:100%;padding-right:48px;font-size:16px;letter-spacing:2px;" autocomplete="off">
          <button id="toggleKeyVisibility" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;font-size:20px;cursor:pointer;padding:4px;" title="${t("creatorToggleVisibility")}">👁</button>
        </div>
      </div>
      <div id="creatorLoginError" style="display:none;background:var(--expense-pale);color:var(--expense-color);padding:10px 14px;border-radius:12px;font-size:13px;font-weight:700;margin-bottom:12px;text-align:center;"></div>
      <div style="display:flex;gap:10px;">
        <button class="btn-secondary" id="creatorLoginCancel" style="flex:1;">${{ ru: "Отмена", en: "Cancel", ka: "გაუქმება" }[currentLang]}</button>
        <button class="btn-primary" id="creatorLoginBtn" style="flex:2;background:linear-gradient(135deg,var(--gold),#f59e0b);color:white;border:none;">${lc.btn} ✓</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:14px;">${lc.tip}</div>
    </div>`;
  document.body.appendChild(overlay);

  const input = document.getElementById("creatorKeyInput");
  input.focus();
  document
    .getElementById("toggleKeyVisibility")
    .addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  document
    .getElementById("creatorLoginCancel")
    .addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  const tryLogin = () => {
    const val = input.value.trim();
    if (!CREATOR_SECRET) {
      showToast(
        {
          ru: "⚠️ Режим создателя не настроен в публичной версии",
          en: "⚠️ Creator mode is not configured in the public version",
          ka: "⚠️ შემქმნელის რეჟიმი საჯარო ვერსიაში გამორთულია",
        }[currentLang],
        "warning",
      );
      return;
    }
    if (val === CREATOR_SECRET) {
      if (prof) prof.role = "owner";
      saveGlobal();
      updateHeader();
      overlay.remove();
      showToast(
        {
          ru: "👑 Режим создателя активирован!",
          en: "👑 Creator mode activated!",
          ka: "👑 შემქმნელის რეჟიმი ჩართულია!",
        }[currentLang],
      );
      haptic("success");
      if (currentTab === "settings") renderSettings();
      openSupportModal();
    } else {
      const errDiv = document.getElementById("creatorLoginError");
      errDiv.style.display = "block";
      errDiv.textContent = lc.wrong;
      input.style.borderColor = "var(--expense-color)";
      input.style.animation = "shake 0.4s ease";
      setTimeout(() => {
        input.style.borderColor = "";
        input.style.animation = "";
      }, 1000);
      haptic("heavy");
    }
  };
  document
    .getElementById("creatorLoginBtn")
    .addEventListener("click", tryLogin);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryLogin();
  });
}

function showCreatorExitModal(prof) {
  const L = {
    ru: { title: "Выйти из режима создателя?", yes: "Выйти", no: "Остаться" },
    en: { title: "Exit creator mode?", yes: "Exit", no: "Stay" },
    ka: { title: "გასვლა შემქმნელის რეჟიმიდან?", yes: "გასვლა", no: "დარჩენა" },
  };
  const lc = L[currentLang] || L.ru;
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);animation:fadeIn 0.2s ease both;";
  overlay.innerHTML = `<div style="background:var(--card-bg);border-radius:28px;padding:28px;max-width:300px;width:88%;text-align:center;animation:slideUpBounce 0.35s cubic-bezier(0.34,1.56,0.64,1) both;">
    <div style="font-size:48px;margin-bottom:12px;">👑</div>
    <div style="font-size:18px;font-weight:800;margin-bottom:20px;">${lc.title}</div>
    <div style="display:flex;gap:10px;">
      <button class="btn-secondary" id="exitCrNo" style="flex:1;">${lc.no}</button>
      <button class="btn-danger" id="exitCrYes" style="flex:1;">${lc.yes}</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  document
    .getElementById("exitCrNo")
    .addEventListener("click", () => overlay.remove());
  document.getElementById("exitCrYes").addEventListener("click", () => {
    if (prof) {
      prof.role = "user";
      saveGlobal();
      updateHeader();
    }
    overlay.remove();
    showToast(
      {
        ru: "👋 Режим создателя выключен",
        en: "👋 Creator mode off",
        ka: "👋 შემქმნელის რეჟიმი გამორთულია",
      }[currentLang],
    );
    if (currentTab === "settings") renderSettings();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// ============================================================
// SUPPORT BADGE — unread message counter on button
// ============================================================
function updateSupportBadge() {
  const badge = document.getElementById("supportBadge");
  if (!badge) return;
  // Count unread: creator sees unreplied msgs, user sees unreplied replies
  try {
    const ownerProf = profiles.find((p) => p.role === "owner");
    if (!ownerProf) {
      badge.style.display = "none";
      return;
    }
    const msgs = getAllMessages();
    let count = 0;
    if (isCreator()) {
      count = msgs.filter((m) => !m.readByCreator).length; // ALL unread, not just unreplied
    } else {
      count = msgs.filter(
        (m) =>
          m.fromProfile === activeProfileId &&
          m.creatorReply &&
          !m.replyReadByUser,
      ).length;
    }
    if (count > 0) {
      badge.style.display = "flex";
      badge.textContent = count > 9 ? "9+" : String(count);
    } else {
      badge.style.display = "none";
    }
  } catch (e) {
    badge.style.display = "none";
  }
}

// ============================================================
// ENHANCED CHAT SYSTEM v2 — полный рефакторинг
// ============================================================

// ---------- ШАБЛОНЫ: 3 категории для пользователя ----------
// [category]: "questions" | "statements" | "requests"
const USER_TEMPLATES = {
  ru: {
    questions: [
      "❓ Как добавить несколько профилей для семьи?",
      "❓ Как экспортировать данные в PDF?",
      "❓ Почему не работают напоминания?",
    ],
    statements: [
      "🐛 Нашёл ошибку: статистика не отображается правильно",
      "🐛 PIN-код не принимает правильный код",
      "🐛 Курсы валют не обновляются",
      "🐛 Приложение не сохраняет данные после перезагрузки",
    ],
    requests: [
      "💡 Предлагаю добавить виджет на экран телефона",
      "💡 Хотел бы экспорт в Excel (.xlsx)",
      "⭐ Хочу оставить положительный отзыв — приложение отличное!",
    ],
  },
  en: {
    questions: [
      "❓ How do I add multiple family profiles?",
      "❓ How do I export data to PDF?",
      "❓ Why aren't reminders working?",
    ],
    statements: [
      "🐛 Bug: statistics not displaying correctly",
      "🐛 PIN code not accepting the correct code",
      "🐛 Exchange rates not updating",
      "🐛 App not saving data after reload",
    ],
    requests: [
      "💡 Please add a phone home-screen widget",
      "💡 I'd like Excel (.xlsx) export",
      "⭐ I want to leave a positive review — great app!",
    ],
  },
  ka: {
    questions: [
      "❓ როგორ დავამატო ოჯახის მრავლობითი პროფილი?",
      "❓ როგორ გავიტანო მონაცემები PDF-ში?",
      "❓ რატომ არ მუშაობს შეხსენებები?",
    ],
    statements: [
      "🐛 შეცდომა: სტატისტიკა სწორად არ ჩანს",
      "🐛 PIN-კოდი არ იღებს სწორ კოდს",
      "🐛 ვალუტის კურსი არ განახლდება",
      "🐛 პროგრამა ვერ ინახავს მონაცემებს",
    ],
    requests: [
      "💡 გთხოვ დაამატე ვიჯეტი ეკრანზე",
      "💡 მინდა Excel (.xlsx) ექსპორტი",
      "⭐ მინდა დავტოვო პოზიტიური შეფასება — შესანიშნავი აპია!",
    ],
  },
};

// ---------- ШАБЛОНЫ: 3 категории для СОЗДАТЕЛЯ — привязаны к темам пользователя ----------
const CREATOR_TEMPLATES = {
  ru: {
    // Ответы на вопросы (совпадают с USER questions)
    answers: [
      "✅ Профили: Настройки → Профили → «+ Добавить профиль». Можно создать до 10.",
      "✅ Экспорт PDF: Настройки → Данные → «📄 Экспорт PDF». Файл сохранится на устройство.",
      "✅ Напоминания: убедитесь что разрешения для уведомлений включены в браузере/телефоне.",
    ],
    // Подтверждения / утверждения (ответы на statements-баги)
    confirmations: [
      "🔄 Спасибо! Ошибку со статистикой уже исправляем — выйдет в следующем обновлении.",
      "🔄 Проблема с PIN: попробуйте сбросить и установить заново в Настройки → Безопасность.",
      "🔄 Курсы обновляются только при наличии интернета. Нажмите «Обновить курсы» в настройках.",
      "🔄 Данные: убедитесь что браузер не в режиме «инкогнито» — он очищает localStorage.",
    ],
    // Ответы на просьбы / вопросы уточнения
    followups: [
      "💡 Отличная идея! Виджет запланирован на следующий квартал. Следите за обновлениями!",
      "💡 Excel-экспорт добавим в roadmap. Пока доступен CSV — он открывается в Excel.",
      "🙏 Спасибо за добрые слова! Это очень мотивирует. Поделитесь приложением с друзьями 🌿",
    ],
  },
  en: {
    answers: [
      "✅ Profiles: Settings → Profiles → '+ Add profile'. Up to 10 profiles.",
      "✅ PDF Export: Settings → Data → '📄 Export PDF'. The file saves to your device.",
      "✅ Reminders: make sure notification permissions are enabled in your browser/phone settings.",
    ],
    confirmations: [
      "🔄 Thanks! The statistics bug is being fixed — it will be in the next update.",
      "🔄 PIN issue: try resetting and setting again in Settings → Security.",
      "🔄 Rates update only with internet. Tap 'Update rates' in Settings → Data.",
      "🔄 Data: make sure you're not in Incognito/Private mode — it clears localStorage.",
    ],
    followups: [
      "💡 Great idea! A widget is planned for next quarter. Stay tuned for updates!",
      "💡 Excel export is on our roadmap. For now CSV is available — it opens in Excel.",
      "🙏 Thank you so much! This motivates us. Please share the app with friends 🌿",
    ],
  },
  ka: {
    answers: [
      "✅ პროფილები: პარამეტრები → პროფილები → '+ დამატება'. მაქს. 10 პროფილი.",
      "✅ PDF ექსპორტი: პარამეტრები → მონაცემები → '📄 PDF'. ფაილი ჩაიწერება მოწყობილობაზე.",
      "✅ შეხსენებები: შეამოწმეთ ბრაუზერ/ტელეფონის შეტყობინებების ნებართვები.",
    ],
    confirmations: [
      "🔄 გმადლობთ! სტატისტიკის შეცდომა სწორდება — შემდეგ განახლებაში გამოვა.",
      "🔄 PIN: სცადეთ გაუქმება და ხელახლა დაყენება პარამეტრებში.",
      "🔄 კურსი განახლდება ინტერნეტით. 'განახლება' ღილაკი — პარამეტრები → მონაცემები.",
      "🔄 მონაცემები: დარწმუნდით, რომ ბრაუზერი არ არის 'ინკოგნიტო' რეჟიმში.",
    ],
    followups: [
      "💡 შესანიშნავი! ვიჯეტი დაგეგმილია. გამოიწერეთ განახლებები!",
      "💡 Excel ექსპორტი გვაქვს გეგმაში. ახლა CSV ხელმისაწვდომია — Excel-ში იხსნება.",
      "🙏 გმადლობთ! ეს ძალიან გვამხნევებს. გაუზიარეთ მეგობრებს 🌿",
    ],
  },
};

function openEnhancedSupportModal() {
  const cs = getCreatorSettings();
  if (isCreator()) {
    openCreatorChatPanel();
    return;
  }
  // Default: contactEnabled is TRUE unless explicitly set to false
  if (cs.contactEnabled === false) {
    const L = {
      ru: "Поддержка временно недоступна",
      en: "Support temporarily unavailable",
      ka: "მხარდაჭერა მიუწვდომელია",
    };
    showToast(L[currentLang] || L.ru, "error");
    return;
  }
  openUserChatPanel();
}

// ================================================================
// USER CHAT PANEL
// ================================================================
function openUserChatPanel() {
  const ownerProf = profiles.find((p) => p.role === "owner");
  const ownerData = ownerProf
    ? JSON.parse(localStorage.getItem("budget_profile_" + ownerProf.id) || "{}")
    : {};
  // Use central message store
  const allMsgs = getAllMessages();
  const myMsgs = allMsgs.filter((m) => m.fromProfile === activeProfileId);
  const lang = currentLang;

  const L = {
    ru: {
      title: "💬 Чат с разработчиком",
      send: "Отправить",
      ph: "Напишите сообщение...",
      empty: "Начните диалог! Выберите шаблон ниже или напишите свой вопрос.",
      catQ: "❓ Вопросы",
      catS: "🐛 Проблемы",
      catR: "💡 Просьбы / Отзывы",
      you: "Вы",
      dev: "Разработчик Ираклий",
      status: "обычно отвечает в течение 24ч",
      sent: "✅ Сообщение отправлено!",
      noName: "Введите своё имя",
    },
    en: {
      title: "💬 Chat with developer",
      send: "Send",
      ph: "Type your message...",
      empty:
        "Start the chat! Choose a template below or write your own question.",
      catQ: "❓ Questions",
      catS: "🐛 Bug reports",
      catR: "💡 Requests / Reviews",
      you: "You",
      dev: "Developer Irakli",
      status: "usually responds within 24h",
      sent: "✅ Message sent!",
      noName: "Please enter your name",
    },
    ka: {
      title: "💬 შემქმნელთან ჩატი",
      send: "გაგზავნა",
      ph: "დაწერეთ შეტყობინება...",
      empty: "დაიწყეთ ჩატი! აირჩიეთ შაბლონი ან ჩაწერეთ კითხვა.",
      catQ: "❓ კითხვები",
      catS: "🐛 შეცდომები",
      catR: "💡 თხოვნები / შეფასება",
      you: "თქვენ",
      dev: "შემქმნელი ირაკლი",
      status: "ჩვეულებრივ პასუხობს 24სთ-ში",
      sent: "✅ გაიგზავნა!",
      noName: "შეიყვანეთ სახელი",
    },
  };
  const lc = L[lang] || L.ru;
  const tpl = USER_TEMPLATES[lang] || USER_TEMPLATES.ru;

  // Mark creator replies as read in central store
  // Mark creator replies as read for this user
  let changed = false;
  const centralMsgsRead = getAllMessages();
  centralMsgsRead.forEach((m) => {
    if (
      m.fromProfile === activeProfileId &&
      m.creatorReply &&
      !m.replyReadByUser
    ) {
      m.replyReadByUser = true;
      changed = true;
    }
  });
  if (changed) {
    saveAllMessages(centralMsgsRead);
    updateSupportBadge();
  }

  const makeTplGroup = (catLabel, items) =>
    `<div style="margin-bottom:10px;">
      <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;">${catLabel}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${items
          .map(
            (txt, i) =>
              `<button class="chat-tpl-btn" data-text="${txt.replace(/"/g, "&quot;")}"
            style="font-size:11px;padding:6px 11px;border-radius:20px;border:1.5px solid var(--cream-border);background:var(--cream-dark);cursor:pointer;transition:all 0.2s;text-align:left;max-width:100%;white-space:normal;line-height:1.4;">${txt}</button>`,
          )
          .join("")}
      </div>
    </div>`;

  const feedHtml =
    myMsgs.length === 0
      ? `<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:20px 10px;">${lc.empty}</div>`
      : myMsgs.map((m) => renderChatBubble(m, lc)).join("");

  const chatHtml = `
    <div style="display:flex;flex-direction:column;gap:0;">
      <!-- Developer info bar -->
      <div style="background:var(--primary-pale);border-radius:16px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px;border:1px solid rgba(45,106,79,0.15);">
        <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-light));display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:var(--shadow-sm);">👨‍💻</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:900;font-size:14px;color:var(--primary);">${lc.dev}</div>
          <div style="font-size:11px;color:var(--text-muted);">⏱ ${lc.status}</div>
        </div>
        <div id="userChatOnline" style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,0.25);flex-shrink:0;"></div>
      </div>

      <!-- Chat feed -->
      <div id="userChatFeed" style="max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;margin-bottom:14px;padding:2px 0;">
        ${feedHtml}
      </div>

      <!-- Name input -->
      <input type="text" id="chatUserName" class="modal-input" placeholder="${{ ru: "Ваше имя *", en: "Your name *", ka: "თქვენი სახელი *" }[lang]}" style="margin-bottom:10px;" value="${localStorage.getItem("chatUserName") || ""}">

      <!-- Templates accordion -->
      <details style="margin-bottom:10px;border-radius:14px;border:1.5px solid var(--cream-border);overflow:hidden;">
        <summary style="padding:10px 14px;font-size:12px;font-weight:800;color:var(--text-soft);cursor:pointer;background:var(--cream-dark);list-style:none;display:flex;align-items:center;gap:6px;">
          <span>📌 ${{ ru: "Шаблоны сообщений", en: "Message templates", ka: "შეტყობინების შაბლონები" }[lang]}</span>
          <span style="margin-left:auto;color:var(--text-muted);">▾</span>
        </summary>
        <div style="padding:12px 14px;background:var(--card-bg);">
          ${makeTplGroup(lc.catQ, tpl.questions)}
          ${makeTplGroup(lc.catS, tpl.statements)}
          ${makeTplGroup(lc.catR, tpl.requests)}
        </div>
      </details>

      <!-- Message input + send -->
      <div style="display:flex;gap:8px;align-items:flex-end;">
        <textarea id="chatMsgInput" class="modal-textarea" rows="3" placeholder="${lc.ph}" style="flex:1;resize:none;font-size:14px;padding:10px 14px;border-radius:16px;"></textarea>
        <button id="chatSendBtn" style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-med));color:white;border:none;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:var(--shadow-md);transition:all 0.2s;" title="${lc.send}">➤</button>
      </div>
    </div>`;

  const modal = createModal("userChatModal", lc.title, chatHtml);
  document.body.appendChild(modal);
  openModal("userChatModal");

  // Template click → fill textarea
  document.querySelectorAll(".chat-tpl-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const area = document.getElementById("chatMsgInput");
      if (area) {
        area.value = btn.dataset.text;
        area.focus();
      }
      document.querySelectorAll(".chat-tpl-btn").forEach((b) => {
        b.style.background = "var(--cream-dark)";
        b.style.borderColor = "var(--cream-border)";
      });
      btn.style.background = "var(--primary-pale)";
      btn.style.borderColor = "var(--primary)";
    });
  });

  // Send button
  const doSend = () => sendUserMessage(lc, ownerProf, ownerData, allMsgs);
  document.getElementById("chatSendBtn").addEventListener("click", doSend);
  document.getElementById("chatMsgInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  });

  const feed = document.getElementById("userChatFeed");
  if (feed) feed.scrollTop = feed.scrollHeight;
}

function renderChatBubble(m, lc) {
  const fmt = (d) =>
    new Date(d).toLocaleString(
      currentLang === "ka" ? "ka-GE" : currentLang === "en" ? "en-US" : "ru-RU",
      { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" },
    );
  let html = `
    <div style="display:flex;justify-content:flex-end;">
      <div style="max-width:85%;background:linear-gradient(135deg,var(--primary),var(--primary-med));color:white;padding:10px 14px;border-radius:18px 18px 4px 18px;box-shadow:var(--shadow-sm);">
        <div style="font-size:14px;line-height:1.5;">${esc(m.message)}</div>
        <div style="font-size:10px;opacity:0.7;margin-top:5px;text-align:right;">${fmt(m.date)} ${m.creatorReply ? "✓✓" : "✓"}</div>
      </div>
    </div>`;
  if (m.creatorReply) {
    html += `
    <div style="display:flex;gap:8px;align-items:flex-end;">
      <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#f59e0b);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">👨‍💻</div>
      <div style="max-width:85%;background:var(--card-bg);border:1.5px solid var(--cream-border);padding:10px 14px;border-radius:18px 18px 18px 4px;box-shadow:var(--shadow-sm);">
        <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:4px;">${lc ? lc.dev : "Разработчик"}</div>
        <div style="font-size:14px;line-height:1.5;color:var(--text);">${esc(m.creatorReply)}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${fmt(m.replyDate || m.date)}</div>
      </div>
    </div>`;
  }
  return html;
}

// ════════════════════════════════════════════════════════════
// CENTRAL MESSAGE STORE
// localStorage + storage events for real-time same-browser sync
// Telegram Bot API for cross-device notifications
// ════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════
// REAL-TIME MESSAGING — Firebase Realtime Database
// Free tier: 1GB, 10GB/month — sufficient for this app
// Works across ALL devices instantly, no server needed
// Setup: see creator panel → Telegram section for instructions
// ════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
// JSONBIN.IO RELAY — zero-config message transport
// Creator sets up once: get free API key from jsonbin.io
// Works across ALL devices without Firebase
// ════════════════════════════════════════════════════════════
function getJsonBinConfig() {
  // 🔐 Встроенные ключ и ID хранилища (переживут любую очистку)
  const hardcodedKey =
    "$2a$10$IVcMyd.xcPwrPtkX0ftMXOkfjWg1W6xm5V1bdkliA28d1FCIZHMA6";
  const hardcodedBinId = "69f63ad6aaba8821976356bd";

  try {
    const stored = JSON.parse(
      localStorage.getItem("budgetpro_jsonbin") || "{}",
    );
    // Если в localStorage есть более новый ключ – используем его, но ID всегда наш
    return {
      key: stored.key || hardcodedKey,
      binId: hardcodedBinId,
    };
  } catch (e) {
    return { key: hardcodedKey, binId: hardcodedBinId };
  }
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

async function jsonBinSaveMessages(msgs) {
  if (localStorage.getItem("jsonbin_disabled") === "true") {
    console.log("⛔ JSONBin синхронизация отключена пользователем");
    return;
  }
  const cfg = getJsonBinConfig();
  if (!cfg.key) return false;
  try {
    const binId = cfg.binId;
    if (binId) {
      // Update existing bin
      const r = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": cfg.key,
        },
        body: JSON.stringify({ messages: msgs, updated: Date.now() }),
      });
      return r.ok;
    } else {
      // Create new bin
      const r = await fetch("https://api.jsonbin.io/v3/b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": cfg.key,
          "X-Bin-Name": "BudgetPRO-Messages",
          "X-Bin-Private": "false",
        },
        body: JSON.stringify({ messages: msgs, updated: Date.now() }),
      });
      if (r.ok) {
        const data = await r.json();
        const newBinId = data.metadata?.id;
        if (newBinId) {
          const newCfg = { ...cfg, binId: newBinId };
          localStorage.setItem("budgetpro_jsonbin", JSON.stringify(newCfg));
          // Share bin ID with users via a known key
          localStorage.setItem("budgetpro_jsonbin_public_binid", newBinId);
          console.log("✅ JSONBin created:", newBinId);
        }
      }
      return r.ok;
    }
  } catch (e) {
    console.warn("JSONBin save:", e.message);
    return false;
  }
}

async function jsonBinSaveBackup(data) {
  if (localStorage.getItem("jsonbin_disabled") === "true") {
    console.log("⛔ JSONBin синхронизация отключена пользователем");
    return;
  }
  const cfg = getJsonBinConfig();
  if (!cfg.key || !cfg.binId) return;
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${cfg.binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": cfg.key,
      },
      body: JSON.stringify(data),
    });
    console.log("☁️ Данные сохранены в JSONBin");
  } catch (e) {
    console.warn("JSONBin backup failed:", e);
  }
}

async function jsonBinLoadBackup() {
  const cfg = getJsonBinConfig();
  if (!cfg.key || !cfg.binId) return null;
  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${cfg.binId}/latest`, {
      headers: { "X-Master-Key": cfg.key },
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.record;
  } catch (e) {
    return null;
  }
}

async function jsonBinLoadMessages() {
  if (location.protocol === "file:") return;
  const cfg = getJsonBinConfig();
  const binId =
    cfg.binId || localStorage.getItem("budgetpro_jsonbin_public_binid");
  if (!binId) return null;
  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: cfg.key ? { "X-Master-Key": cfg.key } : {},
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.record?.messages || null;
  } catch (e) {
    return null;
  }
}

// Poll JSONBin every 30 seconds when messages panel is open
let _jsonBinPoller = null;
function startJsonBinPoller() {
  // Не запускаем на file:// — CORS заблокирует все запросы
  if (location.protocol === "file:") return;
  if (_jsonBinPoller) return;
  _jsonBinPoller = setInterval(async () => {
    const msgs = await jsonBinLoadMessages();
    if (msgs) {
      try {
        localStorage.setItem(MSG_KEY, JSON.stringify(msgs));
      } catch (e) {}
      updateSupportBadge();
      refreshCreatorPanelIfOpen();
      refreshUserPanelIfOpen();
    }
  }, 30000);
}

const MSG_KEY = "budgetpro_messages"; // local fallback

// Firebase config — creator fills these in creator panel
function getFirebaseConfig() {
  try {
    return JSON.parse(localStorage.getItem("budgetpro_firebase") || "{}");
  } catch (e) {
    return {};
  }
}

let _fbDB = null; // Firebase database reference
let _fbListener = null; // Active listener

// Initialize Firebase if configured
async function initFirebase() {
  const cfg = getFirebaseConfig();
  if (!cfg.databaseURL || _fbDB) return !!_fbDB;
  try {
    if (!window.firebase) {
      // Load Firebase SDK dynamically
      await loadScript(
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
      );
      await loadScript(
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js",
      );
    }
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: cfg.apiKey || "demo",
        databaseURL: cfg.databaseURL,
        projectId: cfg.projectId || "budgetpro",
      });
    }
    _fbDB = firebase.database();
    console.log("✅ Firebase connected:", cfg.databaseURL);
    return true;
  } catch (e) {
    console.warn("Firebase init failed:", e.message);
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Start real-time listener for new messages
async function startRealtimeListener() {
  const ok = await initFirebase();
  if (!ok || _fbListener) return;
  try {
    const ref = _fbDB.ref("budgetpro_messages");
    _fbListener = ref.on("value", (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const msgs = Object.values(data).sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      // Save to localStorage as cache
      try {
        localStorage.setItem(MSG_KEY, JSON.stringify(msgs));
      } catch (e) {}
      updateSupportBadge();
      refreshCreatorPanelIfOpen();
      refreshUserPanelIfOpen();
    });
    console.log("✅ Real-time listener active");
  } catch (e) {
    console.warn("Listener failed:", e.message);
  }
}

async function warmMessageCaches() {
  const msgs = await jsonBinLoadMessages();
  if (msgs && msgs.length > 0) {
    const localMsgs = getAllMessages();
    // Merge: keep local + remote, deduplicate by id
    const idSet = new Set(localMsgs.map((m) => m.id));
    let changed = false;
    msgs.forEach((m) => {
      if (!idSet.has(m.id)) {
        localMsgs.push(m);
        changed = true;
      }
    });
    if (changed) {
      try {
        localStorage.setItem(MSG_KEY, JSON.stringify(localMsgs));
      } catch (e) {}
      updateSupportBadge();
    }
  }
  // Start polling if creator panel may open
  if (isCreator()) startJsonBinPoller();
}

// ── Local fallback (same device) ──────────────────────────────
let _msgChannel = null;
try {
  _msgChannel = new BroadcastChannel("budgetpro_channel");
  _msgChannel.onmessage = () => {
    updateSupportBadge();
    refreshCreatorPanelIfOpen();
    refreshUserPanelIfOpen();
  };
} catch (e) {}

// getAllMessages defined above

function saveAllMessages(msgs) {
  // SYNCHRONOUS localStorage save
  try {
    localStorage.setItem(MSG_KEY, JSON.stringify(msgs));
  } catch (e) {
    console.error("MSG save failed", e);
  }
  console.log(
    "[Messages] Saved",
    msgs.length,
    "messages to localStorage. Key:",
    MSG_KEY,
  );
  updateSupportBadge();
  refreshCreatorPanelIfOpen();
  refreshUserPanelIfOpen();
  try {
    _msgChannel?.postMessage({ type: "msg_update", ts: Date.now() });
  } catch (e) {}
  _saveToFirebase(msgs);
  // Also sync to JSONBin if configured
  const _jcfg = getJsonBinConfig();
  if (_jcfg.key) jsonBinSaveMessages(msgs).catch(() => {});
}

function getAllMessages() {
  try {
    const raw = localStorage.getItem(MSG_KEY);
    const msgs = JSON.parse(raw || "[]");
    return msgs;
  } catch (e) {
    return [];
  }
}
function _saveToFirebase(msgs) {
  const cfg = getFirebaseConfig();
  if (!cfg.databaseURL) return;
  initFirebase().then((ok) => {
    if (!ok || !_fbDB) return;
    try {
      const obj = {};
      msgs.forEach((m) => {
        obj[String(m.id).replace(/[.#$/\[\]]/g, "_")] = m;
      });
      _fbDB
        .ref("budgetpro_messages")
        .set(obj)
        .catch((e) => console.warn("FB write:", e.message));
    } catch (e) {
      console.warn("Firebase save failed:", e);
    }
  });
}

// storage event (other tab, same device, same browser)
window.addEventListener("storage", (e) => {
  if (e.key === MSG_KEY) {
    updateSupportBadge();
    refreshCreatorPanelIfOpen();
    refreshUserPanelIfOpen();
  }
});

// Polling fallback: every 5s
setInterval(() => {
  updateSupportBadge();
  refreshCreatorPanelIfOpen();
  refreshUserPanelIfOpen();
}, 5000);

// Refresh creator panel messages list without closing the modal
function refreshCreatorPanelIfOpen() {
  const list = document.getElementById("creatorMsgList");
  if (!list) return;

  const msgs = getAllMessages().sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  console.log(
    "[Messages] refreshCreatorPanel: total",
    msgs.length,
    "msgs in store",
  );
  const lang = currentLang;
  const lc = {
    ru: { empty: "Нет сообщений", new: "🆕", del: "🗑" },
    en: { empty: "No messages", new: "🆕", del: "🗑" },
    ka: { empty: "შეტყობინება არ არის", new: "🆕", del: "🗑" },
  }[lang] || { empty: "No messages", new: "🆕", del: "🗑" };

  const currentIds = new Set(
    [...list.querySelectorAll(".creator-msg-card")].map((c) => c.dataset.msgid),
  );
  const newMsgs = msgs.filter((m) => !currentIds.has(String(m.id)));
  console.log("[Messages] New cards to render:", newMsgs.length);

  if (newMsgs.length === 0) {
    // Update count even if no new msgs
    const countEl = document.getElementById("crMsgCount");
    if (countEl)
      countEl.textContent =
        msgs.length +
        " " +
        { ru: "сообщений", en: "messages", ka: "შეტყობინება" }[lang];
    return;
  }

  // Remove empty placeholder
  list.querySelector("[data-empty='1']")?.remove();
  list.querySelector("[data-empty]")?.remove();

  newMsgs.forEach((m) => {
    const dt = new Date(m.date).toLocaleString(
      lang === "ka" ? "ka-GE" : lang === "en" ? "en-US" : "ru-RU",
      { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
    );
    const card = document.createElement("div");
    card.className = "creator-msg-card";
    card.dataset.msgid = String(m.id);
    card.style.cssText =
      "background:var(--card-bg);border-radius:16px;padding:14px;border:2px solid var(--primary);box-shadow:0 2px 16px rgba(45,106,79,0.12);animation:fadeUp 0.35s ease both;margin-bottom:10px;";
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:38px;height:38px;border-radius:50%;background:var(--primary-pale);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">👤</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;font-size:14px;display:flex;align-items:center;gap:6px;">${esc(m.name)}<span style="background:var(--primary);color:white;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">${lc.new}</span></div>
          <div style="font-size:11px;color:var(--text-muted);">${dt}</div>
        </div>
        <button class="cr-del-inline" data-mid="${m.id}" style="background:none;border:none;font-size:16px;cursor:pointer;color:var(--text-muted);padding:6px;flex-shrink:0;">${lc.del}</button>
      </div>
      <div style="background:var(--cream-dark);border-radius:10px;padding:12px;font-size:14px;line-height:1.6;word-break:break-word;">${esc(m.message)}</div>
      ${m.creatorReply ? `<div style="margin-top:8px;border-left:3px solid var(--primary);padding:8px 12px;background:var(--primary-pale);border-radius:0 10px 10px 0;font-size:13px;word-break:break-word;">${esc(m.creatorReply)}</div>` : ""}
    `;
    list.insertBefore(card, list.firstChild);

    card.querySelector(".cr-del-inline")?.addEventListener("click", () => {
      const all = getAllMessages();
      saveAllMessages(all.filter((x) => String(x.id) !== String(m.id)));
      card.remove();
    });
  });

  // Update count
  const countEl = document.getElementById("crMsgCount");
  if (countEl)
    countEl.textContent =
      msgs.length +
      " " +
      { ru: "сообщений", en: "messages", ka: "შეტყობინება" }[lang];
}

// Refresh user chat feed with new replies from creator
function refreshUserPanelIfOpen() {
  const feed = document.getElementById("userChatFeed");
  if (!feed) return;
  const msgs = getAllMessages().filter(
    (m) => m.fromProfile === activeProfileId,
  );
  msgs.forEach((m) => {
    if (m.creatorReply && !m.replyReadByUser) {
      // Check if reply bubble already shown
      const existingReply = feed.querySelector(`[data-reply-for="${m.id}"]`);
      if (!existingReply) {
        const lang = currentLang;
        const devLabel = {
          ru: "Разработчик",
          en: "Developer",
          ka: "შემქმნელი",
        }[lang];
        const dt = new Date(m.replyDate || m.date).toLocaleString(
          lang === "ka" ? "ka-GE" : lang === "en" ? "en-US" : "ru-RU",
          { hour: "2-digit", minute: "2-digit" },
        );
        const bubble = document.createElement("div");
        bubble.dataset.replyFor = m.id;
        bubble.style.cssText =
          "display:flex;gap:8px;align-items:flex-end;animation:fadeUp 0.3s ease both;";
        bubble.innerHTML = `
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#f59e0b);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">👨‍💻</div>
          <div style="max-width:85%;background:var(--card-bg);border:1.5px solid var(--cream-border);padding:10px 14px;border-radius:18px 18px 18px 4px;box-shadow:var(--shadow-sm);">
            <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:4px;">${devLabel}</div>
            <div style="font-size:14px;line-height:1.5;color:var(--text);">${esc(m.creatorReply)}</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${dt}</div>
          </div>`;
        feed.appendChild(bubble);
        feed.scrollTop = feed.scrollHeight;
        // Mark as read
        m.replyReadByUser = true;
        const all = getAllMessages();
        const idx = all.findIndex((x) => x.id === m.id);
        if (idx >= 0) {
          all[idx].replyReadByUser = true;
          saveAllMessages(all);
        }
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────
// TELEGRAM BOT INTEGRATION — cross-device notifications
// ─────────────────────────────────────────────────────────────
function getTelegramConfig() {
  try {
    return JSON.parse(localStorage.getItem("budgetpro_telegram") || "{}");
  } catch (e) {
    return {};
  }
}

async function sendTelegramMessage(text) {
  const cfg = getTelegramConfig();
  if (!cfg.token || !cfg.chatId) return false;
  try {
    const r = await fetch(
      `https://api.telegram.org/bot${cfg.token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: cfg.chatId, text, parse_mode: "HTML" }),
      },
    );
    return r.ok;
  } catch (e) {
    return false;
  }
}
// ─────────────────────────────────────────────────────────────

function sendUserMessage(lc, ownerProf, ownerData, allMsgsDep) {
  // Block if creator disabled messages
  const _cs = getCreatorSettings();
  if (_cs.contactEnabled === false) {
    showToast(
      {
        ru: "Создатель временно отключил приём сообщений",
        en: "Creator has disabled messages temporarily",
        ka: "შემქმნელმა შეტყობინებები გამორთო",
      }[currentLang],
      "error",
    );
    return;
  }
  const nameEl = document.getElementById("chatUserName");
  const msgEl = document.getElementById("chatMsgInput");
  const name = nameEl?.value.trim() || "";
  const msg = msgEl?.value.trim() || "";
  if (!name) {
    showToast(lc.noName, "error");
    nameEl?.focus();
    return;
  }
  if (!msg) {
    showToast(
      {
        ru: "Введите сообщение",
        en: "Enter a message",
        ka: "შეიყვანეთ შეტყობინება",
      }[currentLang],
      "error",
    );
    return;
  }
  localStorage.setItem("chatUserName", name);

  const newMsg = {
    id: Date.now() + "_" + Math.random().toString(36).slice(2),
    name,
    message: msg,
    email: "",
    phone: "",
    category: "chat",
    date: new Date().toISOString(),
    replied: false,
    readByCreator: false,
    replyReadByUser: false,
    fromProfile: activeProfileId,
    fromProfileName:
      profiles.find((p) => p.id === activeProfileId)?.name || name,
    creatorReply: null,
    replyDate: null,
  };

  // Save to central message store
  const allMsgs = getAllMessages();
  allMsgs.push(newMsg);
  console.log(
    "[Messages] User sending message:",
    newMsg.message,
    "ID:",
    newMsg.id,
  );
  saveAllMessages(allMsgs);
  // Force immediate badge update
  setTimeout(updateSupportBadge, 100);

  // Also save in feed for immediate UI update
  const feed = document.getElementById("userChatFeed");
  if (feed) {
    feed.querySelector("[data-empty]")?.remove();
    feed.insertAdjacentHTML("beforeend", renderChatBubble(newMsg, lc));
    feed.scrollTop = feed.scrollHeight;
  }
  if (msgEl) msgEl.value = "";
  document.querySelectorAll(".chat-tpl-btn").forEach((b) => {
    b.style.background = "var(--cream-dark)";
    b.style.borderColor = "var(--cream-border)";
  });
  showToast(lc.sent, "success");
  haptic("success");
  // Send Telegram notification to creator (if configured)
  sendTelegramMessage(
    `📬 <b>БюджетPRO</b>\nОт: ${name}\nСообщение: ${msg}`,
  ).then((ok) => {
    if (ok) console.log("✅ Telegram notified");
  });
}

// ================================================================
// CREATOR CHAT PANEL — полноценный интерфейс ответов
// ================================================================
function openCreatorChatPanel() {
  const ownerData = JSON.parse(
    localStorage.getItem("budget_profile_" + activeProfileId) || "{}",
  );
  // Use central message store (single source of truth)
  const msgs = getAllMessages().sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  // Backwards compat: also check old profile-based messages
  const oldProfileMsgs = ownerData.supportMessages || [];
  if (oldProfileMsgs.length > 0) {
    const existingIds = new Set(msgs.map((m) => m.id));
    const merged = getAllMessages();
    oldProfileMsgs.forEach((m) => {
      if (!existingIds.has(m.id)) merged.push(m);
    });
    if (merged.length > msgs.length) {
      saveAllMessages(merged);
      msgs.splice(
        0,
        msgs.length,
        ...merged.sort((a, b) => new Date(b.date) - new Date(a.date)),
      );
    }
  }
  const lang = currentLang;
  const cs = getCreatorSettings();
  const unread = msgs.filter((m) => !m.readByCreator).length;
  if (unread > 0) {
    // Mark as read in localStorage directly - DON'T call saveAllMessages here
    // (it would trigger refreshCreatorPanelIfOpen on non-existent DOM)
    msgs.forEach((m) => {
      m.readByCreator = true;
    });
    try {
      localStorage.setItem(MSG_KEY, JSON.stringify(msgs));
    } catch (e) {}
  }
  updateSupportBadge();

  const TT = CREATOR_TEMPLATES[lang] || CREATOR_TEMPLATES.ru;
  const L = {
    ru: {
      title: "👑 Панель создателя",
      empty: "Нет входящих сообщений",
      del: "🗑",
      replyBtn: "💬 Ответить",
      editReply: "✏️ Изменить ответ",
      sendReply: "➤ Отправить ответ",
      cancelReply: "Отмена",
      replyPh: "Введите ответ...",
      catA: "✅ Ответы на вопросы",
      catC: "🔄 Подтверждения / Баги",
      catF: "💡 Просьбы / Отзывы",
      toggleLabel: "Приём сообщений",
      inAppLabel: "Сообщения в приложении",
      save: "💾 Сохранить настройки",
      exit: "🚪 Выйти из режима создателя",
      unreadBadge: "непрочитанных",
      new: "🆕",
    },
    en: {
      title: "👑 Creator Panel",
      empty: "No incoming messages",
      del: "🗑",
      replyBtn: "💬 Reply",
      editReply: "✏️ Edit reply",
      sendReply: "➤ Send reply",
      cancelReply: "Cancel",
      replyPh: "Type your reply...",
      catA: "✅ Answers to questions",
      catC: "🔄 Bug confirmations",
      catF: "💡 Requests / Reviews",
      toggleLabel: "Accept messages",
      inAppLabel: "In-app messages",
      save: "💾 Save settings",
      exit: "🚪 Exit creator mode",
      unreadBadge: "unread",
      new: "🆕",
    },
    ka: {
      title: "👑 შემქმნელის პანელი",
      empty: "შემოსული შეტყობინებები არ არის",
      del: "🗑",
      replyBtn: "💬 პასუხი",
      editReply: "✏️ შეცვლა",
      sendReply: "➤ გაგზავნა",
      cancelReply: "გაუქმება",
      replyPh: "ჩაწერეთ პასუხი...",
      catA: "✅ კითხვების პასუხები",
      catC: "🔄 შეცდომის დადასტურება",
      catF: "💡 თხოვნები / შეფასებები",
      toggleLabel: "შეტყობინებების მიღება",
      inAppLabel: "პროგრამაში შეტყობინება",
      save: "💾 შენახვა",
      exit: "🚪 რეჟიმიდან გასვლა",
      unreadBadge: "წაუკითხავი",
      new: "🆕",
    },
  };
  const lc = L[lang] || L.ru;

  const makeTplPills = (msgId, cat, items) =>
    `<div style="margin-bottom:8px;">
      <div style="font-size:10px;font-weight:800;color:var(--primary);margin-bottom:4px;letter-spacing:0.4px;">${cat}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;">
        ${items
          .map(
            (txt, i) =>
              `<button class="cr-tpl cr-tpl-${msgId}" data-text="${txt.replace(/"/g, "&quot;")}"
            style="font-size:10px;padding:4px 9px;border-radius:14px;border:1px solid var(--cream-border);background:var(--cream-dark);cursor:pointer;transition:all 0.15s;text-align:left;white-space:normal;line-height:1.4;">${txt}</button>`,
          )
          .join("")}
      </div>
    </div>`;

  const renderMsg = (m) => {
    const isNew = !m.readByCreator;
    const dt = new Date(m.date).toLocaleString(
      lang === "ka" ? "ka-GE" : lang === "en" ? "en-US" : "ru-RU",
      { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
    );
    const replyBoxId = `reply-box-${m.id}`;
    const taId = `reply-ta-${m.id}`;
    const sendBtnId = `reply-send-${m.id}`;
    const cancelId = `reply-cancel-${m.id}`;
    return `
      <div class="creator-msg-card" data-msgid="${m.id}" style="background:var(--card-bg);border-radius:18px;padding:16px;border:1.5px solid ${isNew ? "var(--primary)" : "var(--cream-border)"};box-shadow:${isNew ? "var(--shadow-md)" : "var(--shadow-sm)"};animation:fadeUp 0.3s ease both;">
        <!-- Header row -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:38px;height:38px;border-radius:50%;background:var(--primary-pale);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">👤</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:900;font-size:14px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              ${esc(m.name)}
              ${!m.replied && !m.readByCreator ? `<span style="background:var(--primary);color:white;padding:1px 7px;border-radius:10px;font-size:10px;">${lc.new}</span>` : ""}
            </div>
            <div style="font-size:11px;color:var(--text-muted);">${dt}</div>
          </div>
          <button class="cr-del-btn" data-msgid="${m.id}" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--text-muted);padding:4px;flex-shrink:0;">${lc.del}</button>
        </div>

        <!-- User message bubble -->
        <!-- JSONBin.io setup (easier alternative) -->
        <div style="background:var(--primary-pale);border-radius:12px;padding:14px;margin-bottom:14px;border-left:4px solid var(--primary);">
          <div style="font-weight:800;font-size:14px;margin-bottom:6px;">🪣 JSONBin.io — ${lang === "ru" ? "Простой вариант (рекомендуется)" : lang === "ka" ? "მარტივი ვარიანტი (რეკომენდებული)" : "Easy option (recommended)"}</div>
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:10px;">
            ${lang === "ru" ? "1. Зайдите на jsonbin.io → Зарегистрируйтесь бесплатно<br>2. API Keys → Create Access Key (выберите все права)<br>3. Вставьте ключ ниже и нажмите 💾" : lang === "ka" ? "1. jsonbin.io → უფასო რეგისტრაცია<br>2. API Keys → Create Access Key<br>3. ჩასვით გასაღები ქვემოთ" : "1. Go to jsonbin.io → Register free<br>2. API Keys → Create Access Key<br>3. Paste your key below"}
          </div>
          <div style="display:flex;gap:8px;">
            <input id="jbKeyInput" class="modal-input" type="text" style="flex:1;font-size:12px;"
              placeholder="${lang === "ru" ? "Ваш X-Master-Key из jsonbin.io" : lang === "ka" ? "X-Master-Key jsonbin.io-დან" : "Your X-Master-Key from jsonbin.io"}"
              value="${(() => {
                try {
                  return (
                    JSON.parse(
                      localStorage.getItem("budgetpro_jsonbin") || "{}",
                    ).key || ""
                  );
                } catch (e) {
                  return "";
                }
              })()}">
            <button id="jbSaveBtn" class="btn-primary" style="padding:12px 16px;font-size:13px;">💾</button>
          </div>
          <div id="jbStatus" style="font-size:11px;color:var(--text-muted);margin-top:6px;">
            ${(() => {
              try {
                const c = JSON.parse(
                  localStorage.getItem("budgetpro_jsonbin") || "{}",
                );
                return c.binId
                  ? "✅ Bin: " + c.binId
                  : c.key
                    ? lang === "ru"
                      ? "Ключ сохранён, bin создастся при первом сообщении"
                      : lang === "ka"
                        ? "გასაღები შენახულია"
                        : "Key saved, bin creates on first message"
                    : lang === "ru"
                      ? "Не настроено"
                      : lang === "ka"
                        ? "არ არის კონფიგურირებული"
                        : "Not configured";
              } catch (e) {
                return "";
              }
            })()}
          </div>
        </div>

        <div style="background:var(--cream-dark);border-radius:14px;padding:12px 14px;font-size:14px;line-height:1.6;margin-bottom:12px;">${esc(m.message)}</div>

        <!-- Existing reply (if any) -->
        ${
          m.creatorReply
            ? `
          <div class="cr-existing-reply-${m.id}" style="border-left:3px solid var(--primary);padding-left:12px;margin-bottom:10px;background:var(--primary-pale);border-radius:0 12px 12px 0;padding:10px 12px 10px 14px;">
            <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:4px;">${lang === "ru" ? "Ваш ответ:" : lang === "en" ? "Your reply:" : "თქვენი პასუხი:"}</div>
            <div style="font-size:13px;color:var(--text);">${esc(m.creatorReply)}</div>
          </div>`
            : ""
        }

        <!-- Reply button (opens reply box) -->
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="cr-reply-toggle btn-secondary" data-msgid="${m.id}" style="font-size:13px;padding:8px 16px;border-radius:20px;flex-shrink:0;">
            ${m.creatorReply ? lc.editReply : lc.replyBtn}
          </button>
          ${m.replied ? `<span style="font-size:11px;color:var(--income-color);font-weight:700;">✓ ${lang === "ru" ? "Отвечено" : lang === "en" ? "Replied" : "გაიგზავნა"}</span>` : ""}
        </div>

        <!-- REPLY BOX (hidden by default, opens on button click) -->
        <div id="${replyBoxId}" style="display:none;margin-top:12px;border-top:1px solid var(--cream-border);padding-top:12px;">
          <!-- Template categories -->
          <div style="margin-bottom:10px;">
            <div style="font-size:11px;font-weight:800;color:var(--text-muted);margin-bottom:8px;">📌 ${lang === "ru" ? "Шаблоны ответов" : lang === "en" ? "Reply templates" : "პასუხის შაბლონები"}:</div>
            ${makeTplPills(m.id, lc.catA, TT.answers)}
            ${makeTplPills(m.id, lc.catC, TT.confirmations)}
            ${makeTplPills(m.id, lc.catF, TT.followups)}
          </div>
          <!-- Textarea + send -->
          <div style="display:flex;gap:8px;align-items:flex-end;">
            <textarea id="${taId}" class="modal-textarea" rows="3" placeholder="${lc.replyPh}" style="flex:1;resize:none;font-size:13px;padding:10px 14px;border-radius:14px;"></textarea>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button id="${sendBtnId}" style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-med));color:white;border:none;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-md);transition:all 0.2s;" title="${lc.sendReply}">➤</button>
              <button id="${cancelId}" style="width:48px;height:48px;border-radius:50%;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:11px;cursor:pointer;color:var(--text-muted);">✕</button>
            </div>
          </div>
        </div>
      </div>`;
  };

  const html = `
    <!-- Settings -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div style="background:var(--gold-pale);border-radius:14px;padding:12px;border:1.5px solid var(--gold-border);display:flex;align-items:center;justify-content:space-between;">
        <div style="font-size:12px;font-weight:800;">${lc.toggleLabel}</div>
        <label class="switch"><input type="checkbox" id="csToggle" ${cs.contactEnabled ? "checked" : ""}><span class="slider"></span></label>
      </div>
      <div style="background:var(--cream-dark);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between;">
        <div style="font-size:12px;font-weight:800;">${lc.inAppLabel}</div>
        <label class="switch"><input type="checkbox" id="inAppToggle" ${cs.inAppMessages ? "checked" : ""}><span class="slider"></span></label>
      </div>
    </div>

    <!-- App URL field -->
    <div style="margin-bottom:12px;">
      <label style="font-size:12px;font-weight:800;color:var(--text-muted);display:block;margin-bottom:5px;">🔗 ${{ ru: "URL приложения для ссылок", en: "App URL for share links", ka: "აპის URL ბმულებისთვის" }[lang]}</label>
      <div style="display:flex;gap:8px;">
        <input type="url" id="creatorAppUrlInput" class="modal-input" value="${getAppUrl()}" placeholder="https://motserelia.github.io/" style="flex:1;font-size:13px;">
        <button id="saveCreatorUrl" style="padding:0 14px;border-radius:14px;background:var(--primary);color:white;border:none;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap;">💾</button>
      </div>
    </div>



        <!-- JSONBin.io setup (always visible) -->
    <div style="background:var(--primary-pale);border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid var(--primary);">
      <div style="font-weight:800;font-size:14px;margin-bottom:6px;">🪣 JSONBin.io — ${lang === "ru" ? "Простой вариант (рекомендуется)" : lang === "ka" ? "მარტივი ვარიანტი (რეკომენდებული)" : "Easy option (recommended)"}</div>
      <div style="font-size:12px;color:var(--text-soft);margin-bottom:10px;">
        ${lang === "ru" ? "1. Зайдите на jsonbin.io → Зарегистрируйтесь бесплатно<br>2. API Keys → Create Access Key (выберите все права)<br>3. Вставьте ключ ниже и нажмите 💾" : lang === "ka" ? "1. jsonbin.io → უფასო რეგისტრაცია<br>2. API Keys → Create Access Key<br>3. ჩასვით გასაღები ქვემოთ" : "1. Go to jsonbin.io → Register free<br>2. API Keys → Create Access Key<br>3. Paste your key below"}
      </div>
      <div style="display:flex;gap:8px;">
        <input id="jbKeyInput" class="modal-input" type="text" style="flex:1;font-size:12px;"
          placeholder="${lang === "ru" ? "Ваш X-Master-Key из jsonbin.io" : lang === "ka" ? "X-Master-Key jsonbin.io-დან" : "Your X-Master-Key from jsonbin.io"}"
          value="${(() => {
            try {
              return (
                JSON.parse(localStorage.getItem("budgetpro_jsonbin") || "{}")
                  .key || ""
              );
            } catch (e) {
              return "";
            }
          })()}">
        <button id="jbSaveBtn" class="btn-primary" style="padding:12px 16px;font-size:13px;">💾</button>
      </div>
      <div id="jbStatus" style="font-size:11px;color:var(--text-muted);margin-top:6px;">
        ${(() => {
          try {
            const c = JSON.parse(
              localStorage.getItem("budgetpro_jsonbin") || "{}",
            );
            return c.binId
              ? "✅ Bin: " + c.binId
              : c.key
                ? lang === "ru"
                  ? "Ключ сохранён, bin создастся при первом сохранении"
                  : lang === "ka"
                    ? "გასაღები შენახულია"
                    : "Key saved, bin will be created on first save"
                : lang === "ru"
                  ? "Не настроено"
                  : lang === "ka"
                    ? "არ არის კონფიგურირებული"
                    : "Not configured";
          } catch (e) {
            return "";
          }
        })()}
      </div>
    </div>

    <!-- Firebase Realtime Database — CROSS-DEVICE REAL-TIME SYNC -->
    <div style="background:var(--balance-pale);border-radius:14px;padding:12px 14px;margin-bottom:10px;border-left:4px solid #ea4335;">
      <div style="font-size:12px;font-weight:900;color:#ea4335;margin-bottom:8px;">🔥 Firebase — ${{ ru: "мгновенный чат с любого устройства (бесплатно!)", en: "instant chat from any device (free!)", ka: "მომენტური ჩატი ნებისმიერი მოწყობილობიდან (უფასო!)" }[lang]}</div>
      <div style="font-size:11px;color:var(--text-soft);margin-bottom:8px;line-height:1.6;background:var(--cream-dark);border-radius:10px;padding:8px 10px;">
        <b>${{ ru: "Как настроить (5 минут):", en: "Setup (5 min):", ka: "დაყენება (5 წთ):" }[lang]}</b><br>
        ${
          {
            ru: "1. console.firebase.google.com → Создать проект<br>2. Realtime Database → Создать → Тестовый режим<br>3. Скопируйте URL: <code>https://ВАШ-ПРОЕКТ.firebaseio.com</code><br>4. Вставьте ниже и нажмите 💾",
            en: "1. console.firebase.google.com → Create project<br>2. Realtime Database → Create → Test mode<br>3. Copy URL: <code>https://YOUR-PROJECT.firebaseio.com</code><br>4. Paste below and tap 💾",
            ka: "1. console.firebase.google.com → პროექტის შექმნა<br>2. Realtime Database → შექმნა → სატესტო რეჟიმი<br>3. URL კოპირება: <code>https://...</code><br>4. ჩასვით ქვემოთ და &#x1F4BE;",
          }[lang]
        }
      </div>
      <div style="display:flex;gap:6px;margin-bottom:6px;">
        <input type="url" id="fbUrlInput" class="modal-input" value="${getFirebaseConfig().databaseURL || ""}" placeholder="https://your-project-default-rtdb.firebaseio.com" style="font-size:11px;flex:1;">
        <button id="saveFbBtn" style="padding:8px 12px;border-radius:12px;background:#ea4335;color:white;border:none;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">💾</button>
        <button id="testFbBtn" style="padding:8px 10px;border-radius:12px;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🧪</button>
      </div>
      <div id="fbStatus" style="font-size:11px;color:var(--text-muted);min-height:16px;">${_fbDB ? "✅ " + { ru: "Firebase подключён", en: "Firebase connected", ka: "Firebase დაკავშირებულია" }[lang] : "⚠️ " + { ru: "Не настроен", en: "Not configured", ka: "არ არის კონფიგურირებული" }[lang]}</div>
    </div>

    <!-- Telegram Bot integration -->
    <div style="background:var(--cream-dark);border-radius:14px;padding:12px 14px;margin-bottom:14px;border-left:4px solid #2ca5e0;">
      <div style="font-size:12px;font-weight:800;color:#2ca5e0;margin-bottom:8px;">✈️ Telegram — ${{ ru: "push-уведомления (дополнительно)", en: "push notifications (optional)", ka: "push შეტყობინებები (სურვილისამებრ)" }[lang]}</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <input type="text" id="tgTokenInput" class="modal-input" value="${getTelegramConfig().token || ""}" placeholder="Bot token: 1234567890:AAF..." style="font-size:11px;">
        <div style="display:flex;gap:6px;">
          <input type="text" id="tgChatInput" class="modal-input" value="${getTelegramConfig().chatId || ""}" placeholder="Chat ID" style="font-size:11px;flex:1;">
          <button id="saveTgBtn" style="padding:8px 12px;border-radius:12px;background:#2ca5e0;color:white;border:none;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">💾</button>
          <button id="testTgBtn" style="padding:8px 10px;border-radius:12px;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🧪</button>
        </div>
      </div>
    </div>

    <!-- Stats bar -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
      <div id="crMsgCount" style="font-size:13px;font-weight:700;color:var(--text-muted);">${msgs.length} ${{ ru: "сообщений", en: "messages", ka: "შეტყობინება" }[lang]}</div>
      ${unread > 0 ? `<span style="background:var(--expense-color);color:white;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:800;">${unread} ${lc.unreadBadge}</span>` : `<span style="background:var(--income-pale);color:var(--income-color);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">✓ All read</span>`}
      <button id="crRefreshBtn" title="${{ ru: "Обновить", en: "Refresh", ka: "განახლება" }[lang]}" style="margin-left:auto;background:var(--cream-dark);border:1.5px solid var(--cream-border);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px;">🔄 ${{ ru: "Обновить", en: "Refresh", ka: "განახლება" }[lang]}</button>
    </div>
    <!-- Auto-refresh notice -->
    <div id="crAutoRefresh" style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">⚡ ${{ ru: "Автообновление каждые 4 секунды", en: "Auto-refresh every 4 seconds", ka: "ავტო-განახლება 4 წამში" }[lang]}</div>

    <!-- Messages list -->
    <div id="creatorMsgList" style="display:flex;flex-direction:column;gap:12px;max-height:55vh;overflow-y:auto;padding:2px 2px 2px 0;">
      ${
        msgs.length === 0
          ? `<div data-empty="1" style="text-align:center;padding:40px 20px;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:12px;">📭</div><div style="font-size:15px;font-weight:700;">${lc.empty}</div><div style="font-size:13px;margin-top:8px;color:var(--text-muted);">${{ ru: "Сообщения обновляются автоматически каждые 4 секунды", en: "Messages refresh automatically every 4 seconds", ka: "შეტყობინებები განახლდება ავტომატურად 4 წამში" }[lang]}</div></div>`
          : msgs.map(renderMsg).join("")
      }
    </div>

    <!-- Bottom actions -->
    <div style="display:flex;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid var(--cream-border);">
      <button class="btn-primary" id="saveCS" style="flex:1;">${lc.save}</button>
      <button class="btn-secondary" id="exitCrMode" style="flex:1;color:var(--expense-color);">${lc.exit}</button>
    </div>`;

  const modal = createModal("creatorChatModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("creatorChatModal");

  // Auto-refresh every 2 seconds while panel is open
  const _creatorAutoRefresh = setInterval(() => {
    const list2 = document.getElementById("creatorMsgList");
    if (!list2) {
      clearInterval(_creatorAutoRefresh);
      return;
    }
    const freshMsgs2 = getAllMessages().sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    const curIds2 = new Set(
      [...list2.querySelectorAll(".creator-msg-card")].map(
        (c) => c.dataset.msgid,
      ),
    );
    const newOnes = freshMsgs2.filter((m) => !curIds2.has(String(m.id)));
    if (newOnes.length > 0) {
      // New messages arrived — full re-render
      const cntEl = document.getElementById("crMsgCount");
      if (cntEl)
        cntEl.textContent =
          freshMsgs2.length +
          " " +
          { ru: "сообщений", en: "messages", ka: "შეტყობინება" }[lang];
      list2.innerHTML = freshMsgs2.map(renderMsg).join("");
      reattach();
    }
    updateSupportBadge();
  }, 2000);

  // Clean up interval when modal closes
  const origClose = window._closeCreatorModal;
  modal
    .querySelector(".modal-close")
    ?.addEventListener("click", () => clearInterval(_creatorAutoRefresh));

  // Save settings
  // Refresh messages in creator panel
  document.getElementById("crRefreshBtn")?.addEventListener("click", () => {
    const freshMsgs = getAllMessages().sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    const list = document.getElementById("creatorMsgList");
    const countEl = document.getElementById("crMsgCount");
    if (countEl)
      countEl.textContent =
        freshMsgs.length +
        " " +
        { ru: "сообщений", en: "messages", ka: "შეტყობინება" }[lang];
    if (list) {
      if (freshMsgs.length === 0) {
        list.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:12px;">📭</div><div style="font-size:15px;font-weight:700;">${lc.empty}</div></div>`;
      } else {
        list.innerHTML = freshMsgs.map(renderMsg).join("");
        reattach();
      }
    }
    showToast(
      { ru: "✅ Обновлено", en: "✅ Refreshed", ka: "✅ განახლდა" }[lang],
      "success",
    );
  });

  document.getElementById("saveCS")?.addEventListener("click", () => {
    const en = document.getElementById("csToggle")?.checked;
    const inApp = document.getElementById("inAppToggle")?.checked;
    localStorage.setItem(
      "budgetpro_creator_settings",
      JSON.stringify({ ...cs, contactEnabled: en, inAppMessages: inApp }),
    );
    showToast(
      {
        ru: "✅ Настройки сохранены",
        en: "✅ Settings saved",
        ka: "✅ შენახულია",
      }[lang],
      "success",
    );
    closeModal("creatorChatModal");
    updateSupportBadge();
  });

  // Exit creator mode
  document.getElementById("exitCrMode").addEventListener("click", () => {
    const prof = profiles.find((p) => p.id === activeProfileId);
    if (prof) {
      prof.role = "user";
      saveGlobal();
      updateHeader();
    }
    closeModal("creatorChatModal");
    showToast(
      {
        ru: "👋 Режим создателя выключен",
        en: "👋 Creator mode off",
        ka: "👋 გამორთულია",
      }[lang],
    );
    if (currentTab === "settings") renderSettings();
  });

  // Wire up per-message reply toggle, templates, send, delete
  const reattach = () => {
    // Save Firebase config
    document
      .getElementById("saveFbBtn")
      ?.addEventListener("click", async () => {
        const url = document.getElementById("fbUrlInput")?.value.trim() || "";
        if (url) {
          const cfg = { databaseURL: url };
          localStorage.setItem("budgetpro_firebase", JSON.stringify(cfg));
          _fbDB = null;
          _fbListener = null; // reset to force re-init
          const ok = await initFirebase();
          const statusEl = document.getElementById("fbStatus");
          if (ok) {
            if (statusEl)
              statusEl.textContent =
                "✅ " +
                {
                  ru: "Firebase подключён! Чат работает в реальном времени",
                  en: "Firebase connected! Chat works in real-time",
                  ka: "Firebase დაკავშირებულია! ჩატი მუშაობს",
                }[lang];
            startRealtimeListener();
            showToast(
              {
                ru: "🔥 Firebase настроен! Теперь сообщения доходят мгновенно",
                en: "🔥 Firebase ready! Messages now arrive instantly",
                ka: "🔥 Firebase მზადაა! შეტყობინებები მყისიერია",
              }[lang],
              "success",
            );
          } else {
            if (statusEl)
              statusEl.textContent =
                "❌ " +
                {
                  ru: "Ошибка. Проверьте URL",
                  en: "Error. Check the URL",
                  ka: "შეცდომა. URL შეამოწმეთ",
                }[lang];
            showToast(
              {
                ru: "❌ Не удалось подключить Firebase",
                en: "❌ Firebase connection failed",
                ka: "❌ Firebase კავშირი ვერ მოხერხდა",
              }[lang],
              "error",
            );
          }
        }
      });
    document
      .getElementById("testFbBtn")
      ?.addEventListener("click", async () => {
        const ok = await initFirebase();
        showToast(
          ok
            ? {
                ru: "✅ Firebase работает!",
                en: "✅ Firebase works!",
                ka: "✅ Firebase მუშაობს!",
              }[lang]
            : {
                ru: "❌ Firebase не подключён",
                en: "❌ Firebase not connected",
                ka: "❌ Firebase არ არის",
              }[lang],
          ok ? "success" : "error",
        );
      });

    // Save Telegram config
    document.getElementById("saveTgBtn")?.addEventListener("click", () => {
      const token = document.getElementById("tgTokenInput")?.value.trim() || "";
      const chatId = document.getElementById("tgChatInput")?.value.trim() || "";
      localStorage.setItem(
        "budgetpro_telegram",
        JSON.stringify({ token, chatId }),
      );
      showToast(
        {
          ru: "✅ Telegram настроен",
          en: "✅ Telegram configured",
          ka: "✅ Telegram კონფიგურირებულია",
        }[lang],
        "success",
      );
    });
    document
      .getElementById("testTgBtn")
      ?.addEventListener("click", async () => {
        const ok = await sendTelegramMessage(
          "🧪 БюджетPRO: тест / test / ტესტი ✅",
        );
        showToast(
          ok
            ? {
                ru: "✅ Telegram работает!",
                en: "✅ Telegram works!",
                ka: "✅ Telegram მუშაობს!",
              }[lang]
            : {
                ru: "❌ Проверьте токен и Chat ID",
                en: "❌ Check token and Chat ID",
                ka: "❌ შეამოწმეთ ტოკენი",
              }[lang],
          ok ? "success" : "error",
        );
      });
    // Save URL
    document.getElementById("saveCreatorUrl")?.addEventListener("click", () => {
      const rawVal = document.getElementById("creatorAppUrlInput")?.value || "";
      const urlVal = rawVal.trim();
      if (urlVal) {
        localStorage.setItem("budgetpro_app_url", urlVal);
        showToast(
          {
            ru: "✅ URL сохранён! Теперь все ссылки используют: " + urlVal,
            en: "✅ URL saved! All links now use: " + urlVal,
            ka: "✅ URL შენახულია: " + urlVal,
          }[lang],
          "success",
        );
      } else {
        // Save empty string explicitly so getAppUrl() doesn't auto-detect
        localStorage.setItem("budgetpro_app_url", "");
        showToast(
          {
            ru: "🗑 URL удалён — ссылки будут использовать адрес GitHub",
            en: "🗑 URL cleared — links will use auto-detected address",
            ka: "🗑 URL წაიშალა",
          }[lang],
        );
      }
    });
    // Delete
    document.querySelectorAll(".cr-del-btn").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.msgid;
        ownerData.supportMessages = (ownerData.supportMessages || []).filter(
          (m) => m.id !== id,
        );
        localStorage.setItem(
          "budget_profile_" + activeProfileId,
          JSON.stringify(ownerData),
        );
        btn.closest(".creator-msg-card")?.remove();
        showToast(
          "🗑 " + { ru: "Удалено", en: "Deleted", ka: "წაიშალა" }[lang],
        );
      };
    });

    // Reply toggle (show/hide reply box)
    document.querySelectorAll(".cr-reply-toggle").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.msgid;
        const box = document.getElementById("reply-box-" + id);
        if (!box) return;
        const isOpen = box.style.display !== "none";
        box.style.display = isOpen ? "none" : "block";
        if (!isOpen) {
          const ta = document.getElementById("reply-ta-" + id);
          // Use central store (not stale ownerData)
          const msgObj = getAllMessages().find((m) => m.id === id);
          if (ta && msgObj?.creatorReply && !ta.value)
            ta.value = msgObj.creatorReply;
          ta?.focus();
          box.scrollIntoView({ behavior: "smooth", block: "nearest" });
          // CRITICAL: rewire send/cancel now that box is visible
          setTimeout(() => reattach(), 50);
        }
      };
    });

    // Template pills → fill textarea
    document.querySelectorAll(".cr-tpl").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.className.match(/cr-tpl-([^\s]+)/)?.[1];
        if (!id) return;
        const ta = document.getElementById("reply-ta-" + id);
        if (ta) {
          ta.value = btn.dataset.text;
          ta.focus();
        }
        document.querySelectorAll(`.cr-tpl-${id}`).forEach((b) => {
          b.style.background = "var(--cream-dark)";
          b.style.borderColor = "var(--cream-border)";
        });
        btn.style.background = "var(--primary-pale)";
        btn.style.borderColor = "var(--primary)";
      };
    });

    // Send reply buttons
    document.querySelectorAll("[id^='reply-send-']").forEach((sendBtn) => {
      sendBtn.onclick = () => {
        const id = sendBtn.id.replace("reply-send-", "");
        const ta = document.getElementById("reply-ta-" + id);
        const replyText = ta?.value.trim() || "";
        if (!replyText) {
          showToast(
            {
              ru: "Введите текст ответа",
              en: "Enter reply text",
              ka: "შეიყვანეთ პასუხი",
            }[lang],
            "error",
          );
          return;
        }

        // Get message from central store (not ownerData which may be stale)
        const centralAll = getAllMessages();
        const centralIdx = centralAll.findIndex((m) => m.id === id);
        if (centralIdx < 0) {
          showToast(
            {
              ru: "Сообщение не найдено",
              en: "Message not found",
              ka: "შეტყობინება ვერ მოიძებნა",
            }[lang],
            "error",
          );
          return;
        }
        const msgObj = centralAll[centralIdx];
        msgObj.creatorReply = replyText;
        msgObj.replied = true;
        msgObj.replyDate = new Date().toISOString();
        msgObj.replyReadByUser = false;
        // Save back — this triggers real-time sync to user
        saveAllMessages(centralAll);

        // Update UI in place
        const box = document.getElementById("reply-box-" + id);
        if (box) box.style.display = "none";
        const card = document.querySelector(`[data-msgid="${id}"]`);
        if (card) {
          const existingDiv = card.querySelector(`.cr-existing-reply-${id}`);
          const newReplyHtml = `<div class="cr-existing-reply-${id}" style="border-left:3px solid var(--primary);margin-bottom:10px;background:var(--primary-pale);border-radius:0 12px 12px 0;padding:10px 12px 10px 14px;"><div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:4px;">${lang === "ru" ? "Ваш ответ:" : lang === "en" ? "Your reply:" : "თქვენი პასუხი:"}</div><div style="font-size:13px;color:var(--text);">${esc(replyText)}</div></div>`;
          if (existingDiv) existingDiv.outerHTML = newReplyHtml;
          else
            card
              .querySelector(".cr-reply-toggle")
              ?.insertAdjacentHTML("beforebegin", newReplyHtml);
          const toggleBtn2 = card.querySelector(".cr-reply-toggle");
          if (toggleBtn2) toggleBtn2.textContent = lc.editReply;
        }

        showToast(
          {
            ru: "✅ Ответ отправлен!",
            en: "✅ Reply sent!",
            ka: "✅ გაიგზავნა!",
          }[lang],
          "success",
        );
        haptic("success");
        updateSupportBadge();
        if (Notification.permission === "granted")
          new Notification(
            "💬 " +
              {
                ru: `Ответ для ${msgObj.name}`,
                en: `Reply for ${msgObj.name}`,
                ka: `პასუხი ${msgObj.name}-სთვის`,
              }[lang],
          );
      };
    });

    // Cancel buttons
    document.querySelectorAll("[id^='reply-cancel-']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.id.replace("reply-cancel-", "");
        const box = document.getElementById("reply-box-" + id);
        if (box) box.style.display = "none";
      };
    });

    // JSONBin save button
    document
      .getElementById("jbSaveBtn")
      ?.addEventListener("click", async () => {
        const key = (document.getElementById("jbKeyInput")?.value || "").trim();
        if (!key) {
          showToast(t("enterKey"), "error");
          return;
        }
        const cfg = { key };
        localStorage.setItem("budgetpro_jsonbin", JSON.stringify(cfg));
        showToast(
          lang === "ru"
            ? "✅ JSONBin ключ сохранён"
            : lang === "ka"
              ? "✅ გასაღები შენახულია"
              : "✅ JSONBin key saved",
        );
        startJsonBinPoller();
        const msgs = getAllMessages();
        const ok = await jsonBinSaveMessages(msgs);
        const cfg2 = JSON.parse(
          localStorage.getItem("budgetpro_jsonbin") || "{}",
        );
        const stEl = document.getElementById("jbStatus");
        if (stEl)
          stEl.textContent = ok
            ? "✅ Bin: " + (cfg2.binId || "created")
            : lang === "ru"
              ? "⚠️ Ошибка — проверьте ключ"
              : lang === "ka"
                ? "⚠️ შეცდომა"
                : "⚠️ Error — check your key";
      });
  };
  reattach();
}

// openSupportModal is already redirected at the function head above

// ============================================================
// HELP TOOLTIPS — question mark buttons
// ============================================================
const HELP_TIPS = {
  ru: {
    balance:
      "💰 Баланс — это разница между всеми вашими доходами и расходами плюс начальная сумма.",
    income:
      "📈 Доходы — все поступления денег: зарплата, фриланс, подарки и другие источники.",
    expense:
      "📉 Расходы — все ваши траты: продукты, транспорт, коммуналка и прочее.",
    salary:
      "💼 Начальная сумма — деньги, с которых вы начинаете учёт. Нажмите чтобы изменить.",
    add: "➕ Нажмите чтобы добавить новую операцию — доход или расход.",
    stats:
      "📊 Статистика показывает диаграммы расходов и доходов за выбранный период.",
    tools:
      "🧮 Инструменты: калькулятор и конвертер валют с актуальными курсами.",
    notebook:
      "📓 Блокнот — сохраняйте заметки, номера телефонов, планы и списки.",
    categories:
      "🗂 Категории — управляйте списком категорий расходов и доходов.",
    settings: "⚙️ Настройки: тема, язык, валюта, PIN-защита, экспорт данных.",
    datetime:
      "📅 Выберите дату и время для напоминания. Нажмите на поле чтобы открыть выбор.",
    reminder:
      "🔔 Напоминания помогут не забыть записать траты. Выберите удобный интервал.",
    budget: "💰 Бюджеты — установите лимит расходов по категории на месяц.",
    recurring:
      "🔄 Повторяющиеся операции добавляются автоматически (аренда, кредит и т.д.).",
    pin: "🔒 PIN-код защищает приложение от посторонних. Установите 4-значный код.",
    theme: "🎨 Выберите цветовую тему оформления из 6 вариантов.",
    currency: "💱 Выберите валюту для отображения сумм в интерфейсе.",
    export: "📤 Экспортируйте данные в CSV, JSON или PDF для архивирования.",
    profiles: "👥 Профили — отдельные бюджеты для каждого члена семьи.",
    share:
      "🔗 Поделитесь профилем с другим человеком — он получит доступ к вашим данным.",
    support:
      "💬 Напишите нам — создатель приложения лично ответит на ваш вопрос.",
  },
  en: {
    balance:
      "💰 Balance is the difference between all income and expenses plus your starting amount.",
    income:
      "📈 Income — all money received: salary, freelance, gifts and other sources.",
    expense:
      "📉 Expenses — all your spending: groceries, transport, utilities, etc.",
    salary:
      "💼 Starting amount — money you begin tracking from. Tap to change.",
    add: "➕ Tap to add a new transaction — income or expense.",
    stats:
      "📊 Statistics shows charts of expenses and income for the selected period.",
    tools: "🧮 Tools: calculator and currency converter with live rates.",
    notebook: "📓 Notebook — save notes, phone numbers, plans and lists.",
    categories: "🗂 Categories — manage your income and expense categories.",
    settings:
      "⚙️ Settings: theme, language, currency, PIN protection, data export.",
    datetime:
      "📅 Select a date and time for a reminder. Tap the field to open the picker.",
    reminder:
      "🔔 Reminders help you remember to log expenses. Choose a convenient interval.",
    budget: "💰 Budgets — set a monthly spending limit per category.",
    recurring:
      "🔄 Recurring transactions are added automatically (rent, loan, etc.).",
    pin: "🔒 PIN code protects the app from others. Set a 4-digit code.",
    theme: "🎨 Choose a color theme from 6 options.",
    currency: "💱 Choose the currency for displaying amounts in the interface.",
    export: "📤 Export data to CSV, JSON or PDF for archiving.",
    profiles: "👥 Profiles — separate budgets for each family member.",
    share: "🔗 Share your profile — another person gets access to your data.",
    support:
      "💬 Contact us — the app creator will personally answer your question.",
  },
  ka: {
    balance:
      "💰 ბალანსი — სხვაობა ყველა შემოსავალსა და ხარჯს შორის, პლუს საწყისი თანხა.",
    income:
      "📈 შემოსავალი — ყველა შემოსული თანხა: ხელფასი, ფრილანსი, საჩუქრები.",
    expense:
      "📉 ხარჯი — ყველა დახარჯული: საკვები, ტრანსპორტი, კომუნალური და სხვა.",
    salary:
      "💼 საწყისი თანხა — ფული, საიდანაც იწყება თვლა. შეეხეთ შესაცვლელად.",
    add: "➕ შეეხეთ ახალი ოპერაციის დასამატებლად — შემოსავალი ან ხარჯი.",
    stats: "📊 სტატისტიკა — ხარჯების და შემოსავლების დიაგრამები.",
    tools: "🧮 ხელსაწყოები: კალკულატორი და ვალუტის კონვერტერი.",
    notebook: "📓 ბლოკნოტი — ჩაიწერეთ შენიშვნები, ტელეფონები, გეგმები.",
    categories: "🗂 კატეგორიები — მართეთ ხარჯების და შემოსავლების სიები.",
    settings: "⚙️ პარამეტრები: თემა, ენა, ვალუტა, PIN-დაცვა, ექსპორტი.",
    datetime: "📅 აირჩიეთ თარიღი და დრო შეხსენებისთვის.",
    reminder: "🔔 შეხსენებები დაგეხმარება ხარჯების ჩაწერის დამახსოვრებაში.",
    budget: "💰 ბიუჯეტი — მიუთითეთ ყოველთვიური ლიმიტი კატეგორიაში.",
    recurring: "🔄 განმეორებადი ოპერაციები ავტომატურად დაემატება.",
    pin: "🔒 PIN-კოდი იცავს აპს გარეშე პირებისგან.",
    theme: "🎨 აირჩიეთ ფერის თემა 6 ვარიანტიდან.",
    currency: "💱 აირჩიეთ ვალუტა ინტერფეისში.",
    export: "📤 გაიტანეთ მონაცემები CSV, JSON ან PDF ფაილში.",
    profiles: "👥 პროფილები — ცალკე ბიუჯეტი ოჯახის თითოეული წევრისთვის.",
    share: "🔗 გაუზიარეთ პროფილი — სხვა ადამიანი მიიღებს წვდომას.",
    support: "💬 დაგვიკავშირდით — შემქმნელი პირადად გიპასუხებთ.",
  },
};

function showHelpTooltip(key, targetEl) {
  const tip = HELP_TIPS[currentLang]?.[key] || HELP_TIPS.ru?.[key] || "";
  if (!tip) return;

  // Remove existing
  document.querySelectorAll(".help-tooltip-popup").forEach((e) => e.remove());

  const rect = targetEl.getBoundingClientRect();
  const popup = document.createElement("div");
  popup.className = "help-tooltip-popup";
  popup.style.cssText = `position:fixed;z-index:99999;max-width:280px;background:var(--text);color:var(--cream);padding:12px 16px;border-radius:16px;font-size:13px;line-height:1.6;box-shadow:0 12px 40px rgba(0,0,0,0.4);animation:fadeUp 0.2s ease both;pointer-events:auto;`;
  popup.innerHTML = `<div>${tip}</div><div style="margin-top:8px;text-align:right;"><button style="background:rgba(255,255,255,0.2);border:none;color:white;padding:4px 12px;border-radius:20px;font-size:12px;cursor:pointer;" id="closeTipBtn">OK</button></div>`;

  // Position
  let top = rect.bottom + 8;
  let left = Math.max(10, rect.left - 80);
  if (top + 120 > window.innerHeight) top = rect.top - 120;
  if (left + 300 > window.innerWidth) left = window.innerWidth - 300;
  popup.style.top = top + "px";
  popup.style.left = left + "px";

  document.body.appendChild(popup);
  document
    .getElementById("closeTipBtn")
    ?.addEventListener("click", () => popup.remove());
  setTimeout(() => {
    if (popup.parentNode) popup.remove();
  }, 5000);
}

function createHelpBtn(key, small = false) {
  const btn = document.createElement("button");
  btn.className = "help-q-btn";
  btn.innerHTML = "?";
  btn.title =
    { ru: "Справка", en: "Help", ka: "დახმარება" }[currentLang] || "Help";
  btn.style.cssText = `width:${small ? 18 : 22}px;height:${small ? 18 : 22}px;border-radius:50%;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:${small ? 10 : 12}px;font-weight:900;color:var(--text-muted);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;vertical-align:middle;margin-left:4px;`;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    showHelpTooltip(key, btn);
  });
  btn.addEventListener("mouseenter", () => {
    btn.style.background = "var(--primary)";
    btn.style.color = "white";
    btn.style.borderColor = "var(--primary)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.background = "var(--cream-dark)";
    btn.style.color = "var(--text-muted)";
    btn.style.borderColor = "var(--cream-border)";
  });
  return btn;
}

// Inject help buttons on summary cards
function injectCardHelpButtons() {
  const keys = [
    { sel: ".balance-card .card-label", key: "balance" },
    { sel: ".income-card .card-label", key: "income" },
    { sel: ".expense-card .card-label", key: "expense" },
    { sel: ".salary-card .card-label", key: "salary" },
  ];
  keys.forEach(({ sel, key }) => {
    const el = document.querySelector(sel);
    if (el && !el.querySelector(".help-q-btn")) {
      el.appendChild(createHelpBtn(key, true));
    }
  });
}

// Inject nav help buttons
function injectNavHelpButtons() {
  const navMap = [
    { tab: "home", key: "balance" },
    { tab: "stats", key: "stats" },
    { tab: "tools", key: "tools" },
    { tab: "notebook", key: "notebook" },
    { tab: "categories", key: "categories" },
    { tab: "settings", key: "settings" },
  ];
  navMap.forEach(({ tab, key }) => {
    const btn = document.querySelector(
      `.nav-btn[data-tab="${tab}"] .nav-label`,
    );
    if (btn && !btn.querySelector(".help-q-btn")) {
      btn.appendChild(createHelpBtn(key, true));
    }
  });
}

// ============================================================
// FIX INACTIVE BUTTONS
// ============================================================
function openConnectModal() {
  const lang = currentLang;
  const INST = {
    ru: {
      title: "🔗 Подключиться к чужому профилю",
      what: "Что это такое?",
      whatDesc:
        "Эта функция позволяет войти в профиль другого человека (например, члена семьи) и видеть его данные или совместно вести бюджет.",
      howTitle: "Как получить ссылку?",
      steps: [
        "1️⃣ Попросите владельца профиля открыть приложение",
        "2️⃣ Он должен зайти в Настройки → Профили → нажать 🔗 рядом со своим профилем",
        "3️⃣ Нажать «🔗 Создать ссылку» и отправить её вам (WhatsApp, Telegram, email)",
        "4️⃣ Нажмите на ссылку — откроется экран приветствия, нажмите «Войти в профиль»",
        "─── ИЛИ через код ───",
        "5️⃣ Владелец копирует код доступа (8 букв/цифр) и отправляет вам",
        "6️⃣ Введите этот код в поле ниже и нажмите «Подключиться»",
      ],
      codeLabel: "Код доступа (8 символов)",
      codePh: "Например: AB12CD34",
      btn: "Подключиться",
      notFound:
        "❌ Профиль с таким кодом не найден. Проверьте код и попробуйте снова.",
      success: "✅ Успешно подключено!",
      tip: "💡 Ссылка быстрее и удобнее — просто нажать и войти без ввода кода!",
    },
    en: {
      title: "🔗 Connect to someone's profile",
      what: "What is this?",
      whatDesc:
        "This lets you join another person's profile (e.g. a family member) to view their data or manage the budget together.",
      howTitle: "How to get the link?",
      steps: [
        "1️⃣ Ask the profile owner to open the app",
        "2️⃣ They go to Settings → Profiles → tap 🔗 next to their profile",
        "3️⃣ Tap '🔗 Create link' and send it to you (WhatsApp, Telegram, email)",
        "4️⃣ Tap the link — a welcome screen appears, tap 'Enter profile'",
        "─── OR via code ───",
        "5️⃣ The owner copies the access code (8 characters) and sends it to you",
        "6️⃣ Enter the code below and tap 'Connect'",
      ],
      codeLabel: "Access code (8 characters)",
      codePh: "E.g.: AB12CD34",
      btn: "Connect",
      notFound: "❌ No profile found with this code. Check it and try again.",
      success: "✅ Connected successfully!",
      tip: "💡 A link is faster — just tap and enter without typing a code!",
    },
    ka: {
      title: "🔗 სხვის პროფილთან დაკავშირება",
      what: "რა არის ეს?",
      whatDesc:
        "ეს ფუნქცია საშუალებას გაძლევთ შეხვიდეთ სხვა პირის პროფილში (მაგ., ოჯახის წევრის) და ერთობლივად მართოთ ბიუჯეტი.",
      howTitle: "როგორ მივიღო ბმული?",
      steps: [
        "1️⃣ სთხოვეთ პროფილის მფლობელს გახსნას აპი",
        "2️⃣ პარამეტრები → პროფილები → 🔗 მის გვერდით",
        "3️⃣ '🔗 ბმულის შექმნა' → გამოგიგზავნოს (WhatsApp, Telegram, email)",
        "4️⃣ ბმულზე დაჭერა → 'პროფილში შესვლა'",
        "─── ან კოდით ───",
        "5️⃣ მფლობელი კოპირებს წვდომის კოდს (8 სიმბოლო) და გიგზავნის",
        "6️⃣ შეიყვანეთ კოდი ქვემოთ და დააჭირეთ 'დაკავშირება'",
      ],
      codeLabel: "წვდომის კოდი (8 სიმბოლო)",
      codePh: "მაგ.: AB12CD34",
      btn: "დაკავშირება",
      notFound: "❌ ამ კოდით პროფილი ვერ მოიძებნა. შეამოწმეთ კოდი.",
      success: "✅ წარმატებით დაუკავშირდი!",
      tip: "💡 ბმული უფრო სწრაფია — მხოლოდ ერთი დაჭერა, კოდის გარეშე!",
    },
  };
  const lc = INST[lang] || INST.ru;

  const html = `
    <!-- What is this -->
    <div style="background:var(--balance-pale);border-radius:14px;padding:14px;margin-bottom:14px;border-left:4px solid #2563eb;">
      <div style="font-weight:800;font-size:14px;color:#2563eb;margin-bottom:4px;">${lc.what}</div>
      <div style="font-size:13px;line-height:1.6;color:var(--text-soft);">${lc.whatDesc}</div>
    </div>

    <!-- Steps -->
    <div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:14px;border-left:4px solid var(--primary);">
      <div style="font-weight:800;font-size:14px;color:var(--primary);margin-bottom:10px;">${lc.howTitle}</div>
      <div style="display:flex;flex-direction:column;gap:7px;">
        ${lc.steps.map((s) => `<div style="font-size:12px;color:var(--text-soft);line-height:1.5;">${s.startsWith("───") ? `<div style="text-align:center;color:var(--text-muted);font-size:11px;margin:2px 0;">${s}</div>` : s}</div>`).join("")}
      </div>
    </div>

    <!-- Tip -->
    <div style="background:var(--gold-pale);border-radius:12px;padding:10px 14px;margin-bottom:14px;border-left:4px solid var(--gold);font-size:12px;color:var(--text-soft);">${lc.tip}</div>

    <!-- Code input -->
    <div class="field-group">
      <label class="field-label">${lc.codeLabel}</label>
      <input type="text" id="connectCodeInput" class="modal-input" placeholder="${lc.codePh}" style="font-size:20px;letter-spacing:4px;text-align:center;text-transform:uppercase;font-weight:800;" maxlength="12">
    </div>
    <div id="connectError" style="display:none;background:var(--expense-pale);color:var(--expense-color);padding:10px 14px;border-radius:12px;margin-bottom:10px;font-weight:700;font-size:13px;text-align:center;"></div>
    <div class="modal-actions">
      <button class="btn-secondary" id="connectCancel">${t("cancel")}</button>
      <button class="btn-primary" id="connectDoBtn">${lc.btn}</button>
    </div>`;

  const modal = createModal("connectModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("connectModal");

  const codeInput = document.getElementById("connectCodeInput");
  codeInput?.addEventListener("input", () => {
    codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  });

  document
    .getElementById("connectCancel")
    .addEventListener("click", () => closeModal("connectModal"));

  document.getElementById("connectDoBtn").addEventListener("click", () => {
    const code = codeInput?.value.trim().toUpperCase() || "";
    if (!code || code.length < 4) {
      showToast(lc.notFound, "error");
      return;
    }
    const foundProf = profiles.find((p) => {
      const ss =
        p.shareSettings ||
        JSON.parse(localStorage.getItem("shareSettings_" + p.id) || "{}");
      return ss.shareId === code || p.shareSettings?.shareId === code;
    });
    const errDiv = document.getElementById("connectError");
    if (!foundProf) {
      errDiv.style.display = "block";
      errDiv.textContent = lc.notFound;
      codeInput.style.borderColor = "var(--expense-color)";
      setTimeout(() => {
        errDiv.style.display = "none";
        codeInput.style.borderColor = "";
      }, 3000);
      return;
    }
    closeModal("connectModal");
    showToast(lc.success, "success");
    // Simulate share link entry
    const fakePkg = {
      v: 3,
      type: "share_link",
      shareId: code,
      pname: foundProf.name || "Profile",
      pemoji: foundProf.emoji || "👤",
      pcolor: foundProf.color || "#2d6a4f",
      perms: foundProf.shareSettings?.perms || { ...DEFAULT_PERMS },
      hasPwd: !!foundProf.shareSettings?.pwHash,
      pwHash: foundProf.shareSettings?.pwHash || null,
      locked: foundProf.shareSettings?.locked || false,
    };
    setTimeout(() => showShareWelcomeScreen(fakePkg), 300);
  });
}

// ============================================================
// DATETIME — иконка открывает пикер + красивые стили
// ============================================================
function injectDatetimeEnhancement() {
  if (document.getElementById("dtEnhanceStyle")) return;
  const style = document.createElement("style");
  style.id = "dtEnhanceStyle";
  style.textContent = `
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
    @keyframes slideUpBounce { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
    @keyframes badgePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
    @keyframes dtIconSpin { 0%{transform:scale(1)} 40%{transform:scale(1.4) rotate(-15deg)} 100%{transform:scale(1.25) rotate(-10deg)} }

    /* Label-wrapped datetime */
    label.custom-date-wrapper, label.custom-time-wrapper {
      display: flex !important; align-items: center !important;
      cursor: pointer !important;
      transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1) !important;
    }
    label.custom-date-wrapper:hover, label.custom-time-wrapper:hover {
      border-color: var(--primary) !important;
      background: var(--primary-pale) !important;
      transform: translateY(-2px) !important;
      box-shadow: var(--shadow-md) !important;
    }
    label.custom-date-wrapper:focus-within, label.custom-time-wrapper:focus-within {
      border-color: var(--primary) !important;
      background: var(--card-bg) !important;
      box-shadow: 0 0 0 4px rgba(45,106,79,0.18), var(--shadow-md) !important;
      transform: translateY(-2px) scale(1.01) !important;
    }
    label.custom-date-wrapper:hover .datetime-icon,
    label.custom-time-wrapper:hover .datetime-icon {
      transform: scale(1.25) rotate(-10deg) !important;
    }
    label.custom-date-wrapper:focus-within .datetime-icon,
    label.custom-time-wrapper:focus-within .datetime-icon {
      animation: dtIconSpin 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards !important;
    }
    /* div-based wrappers (fallback) */
    .custom-date-wrapper:not(label), .custom-time-wrapper:not(label) {
      cursor: pointer !important;
      transition: all 0.3s ease !important;
    }
    .custom-date-wrapper:not(label):focus-within, .custom-time-wrapper:not(label):focus-within {
      border-color: var(--primary) !important;
      box-shadow: 0 0 0 3px rgba(45,106,79,0.15) !important;
    }

    /* Support button */
    #headerSupportBtn { overflow: visible !important; }
    #supportBadge { animation: badgePulse 1.5s ease infinite; }

    /* Card interactions */
    .chat-tpl-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-sm); }
    .creator-msg-card { transition: all 0.2s ease; }
    .creator-msg-card:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
    .summary-card { transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1) !important; }
    .summary-card:hover { transform:translateY(-4px) scale(1.02) !important; }
    .nav-btn { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
    .nav-btn:active { transform:scale(0.88) !important; }
    .nav-btn.active .nav-icon { animation:bounce 0.4s cubic-bezier(0.34,1.56,0.64,1); }
    .fab { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
    .fab:hover { transform:scale(1.08) translateY(-2px) !important; }
    .fab:active { transform:scale(0.94) !important; }
    .header-btn, #headerGuideBtn, #headerHelpBtn, #headerLangBtn, #themeToggle, #headerSupportBtn {
      transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important;
    }
    .header-btn:hover, #headerGuideBtn:hover, #headerHelpBtn:hover, #headerLangBtn:hover, #themeToggle:hover, #headerSupportBtn:hover {
      transform: scale(1.1) !important; box-shadow: var(--shadow-md) !important;
    }
    .header-btn:active, #headerGuideBtn:active, #headerHelpBtn:active, #headerLangBtn:active, #themeToggle:active, #headerSupportBtn:active {
      transform: scale(0.88) rotate(-5deg) !important;
    }
    .op-item { transition: all 0.2s ease !important; }
    .op-item:hover { transform:translateX(3px) !important; box-shadow:var(--shadow-md) !important; }
    .btn-primary { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
    .btn-primary:active { transform:scale(0.95) !important; }
    .modal { animation: slideUpBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) both !important; }
  `;
  document.head.appendChild(style);
}
injectDatetimeEnhancement();

// ============================================================
// SUPPORT BUTTON + BADGE — всегда показываем, добавляем после init
// ============================================================
function ensureSupportButton() {
  const hdrActions = document.querySelector(".header-actions");
  if (!hdrActions) return;

  // Hide/show based on contactEnabled setting
  const _cs2 = getCreatorSettings();
  const existingBtn = document.getElementById("headerSupportBtn");
  if (_cs2.contactEnabled === false && !isCreator()) {
    // Creator disabled — hide button for users
    if (existingBtn) existingBtn.style.display = "none";
    return;
  }
  if (existingBtn) {
    existingBtn.style.display = "";
    updateSupportBadge();
    return;
  }
  const btn = document.createElement("button");
  btn.className = "header-btn";
  btn.id = "headerSupportBtn";
  btn.style.cssText = "position:relative;overflow:visible;";
  btn.innerHTML = `💬<span id="supportBadge" style="position:absolute;top:-5px;right:-5px;background:#e53e3e;color:white;border-radius:50%;min-width:19px;height:19px;font-size:10px;font-weight:900;display:none;align-items:center;justify-content:center;border:2px solid var(--cream);padding:0 3px;line-height:1;z-index:2;"></span>`;
  btn.title =
    { ru: "Поддержка", en: "Support", ka: "მხარდაჭერა" }[currentLang] ||
    "Support";
  btn.setAttribute("aria-label", btn.title);
  btn.addEventListener("click", () => openEnhancedSupportModal());
  // Insert before guide button so it's visible
  const guideBtn = document.getElementById("headerGuideBtn");
  if (guideBtn) hdrActions.insertBefore(btn, guideBtn);
  else hdrActions.insertBefore(btn, hdrActions.firstChild);
  updateSupportBadge();
  // Poll badge every 10s
  setInterval(updateSupportBadge, 10000);
}
// Also re-run when tab changes (init is called again)
const _origInit = typeof init === "function" ? init : null;
if (_origInit) {
  window._initHooked = true;
}

// ============================================================
// ██████  НОВЫЕ ФУНКЦИИ — БЛОК v3.0
// ============================================================

// ──────────────────────────────────────────────────────────────
// 1. ОНБОРДИНГ — экран приветствия для новых пользователей
// ──────────────────────────────────────────────────────────────
function shouldShowOnboarding() {
  return !localStorage.getItem("onboarding_done");
}

function showOnboarding() {
  if (!shouldShowOnboarding()) return;
  // Remove any existing overlay
  document.getElementById("onboardingOverlay")?.remove();

  const lang = currentLang;
  const slides = {
    ru: [
      {
        emoji: "🌿",
        title: "Добро пожаловать в БюджетPRO!",
        sub: "Личный финансовый трекер. Офлайн · Без регистрации · Бесплатно",
        color: "var(--primary)",
      },
      {
        emoji: "💸",
        title: "Записывайте расходы и доходы",
        sub: "Нажмите кнопку «+» внизу → выберите категорию → введите сумму. Готово!",
        color: "var(--expense-color)",
      },
      {
        emoji: "📊",
        title: "Смотрите статистику",
        sub: "Вкладка «Статистика» — диаграммы, тренды, прогноз на месяц.",
        color: "#2563eb",
      },
      {
        emoji: "🎯",
        title: "Ставьте бюджеты",
        sub: "Настройки → Бюджеты. Лимит по категории — приложение предупредит о превышении.",
        color: "var(--gold)",
      },
    ],
    en: [
      {
        emoji: "🌿",
        title: "Welcome to BudgetPRO!",
        sub: "Personal finance tracker. Offline · No registration · Free",
        color: "var(--primary)",
      },
      {
        emoji: "💸",
        title: "Track your income & expenses",
        sub: "Tap the «+» button at the bottom → choose category → enter amount. Done!",
        color: "var(--expense-color)",
      },
      {
        emoji: "📊",
        title: "View your statistics",
        sub: "The «Stats» tab — charts, trends, monthly forecast.",
        color: "#2563eb",
      },
      {
        emoji: "🎯",
        title: "Set spending budgets",
        sub: "Settings → Budgets. Set a limit per category — the app will warn you.",
        color: "var(--gold)",
      },
    ],
    ka: [
      {
        emoji: "🌿",
        title: "კეთილი იყოს თქვენი მობრძანება!",
        sub: "პირადი ფინანსური ტრეკერი. ოფლაინ · რეგისტრაციის გარეშე · უფასო",
        color: "var(--primary)",
      },
      {
        emoji: "💸",
        title: "ჩაიწერეთ ხარჯები და შემოსავლები",
        sub: "«+» ღილაკი ქვემოთ → კატეგორია → თანხა. მზადაა!",
        color: "var(--expense-color)",
      },
      {
        emoji: "📊",
        title: "ნახეთ სტატისტიკა",
        sub: "«სტატისტიკა» — დიაგრამები, ტრენდები, ყოველთვიური პროგნოზი.",
        color: "#2563eb",
      },
      {
        emoji: "🎯",
        title: "დაადგინეთ ბიუჯეტები",
        sub: "პარამეტრები → ბიუჯეტები. ლიმიტი კატეგორიაში — გაფრთხილება გადაჭარბებისას.",
        color: "var(--gold)",
      },
    ],
  };
  const sl = slides[lang] || slides.ru;
  let cur = 0;

  // Add keyframe styles
  if (!document.getElementById("obStyle")) {
    const st = document.createElement("style");
    st.id = "obStyle";
    st.textContent = [
      "@keyframes obBounce{from{transform:scale(0.4) translateY(20px);opacity:0}60%{transform:scale(1.08);opacity:1}to{transform:scale(1) translateY(0);opacity:1}}",
      "@keyframes obFadeOut{to{opacity:0;pointer-events:none}}",
      "@keyframes obSlideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}",
      ".ob-lang-btn{font-family:inherit;cursor:pointer;transition:all 0.2s;}",
      ".ob-lang-btn:hover{transform:scale(1.15);}",
      "#obNext{font-family:inherit;cursor:pointer;transition:transform 0.15s;}",
      "#obNext:active{transform:scale(0.96)!important;}",
      "#obSkip{font-family:inherit;cursor:pointer;}",
    ].join("");
    document.head.appendChild(st);
  }

  const ov = document.createElement("div");
  ov.id = "onboardingOverlay";
  // KEY FIX: overflow-y:auto so content never goes off-screen
  // No justify-content:space-between — use normal flow with padding
  ov.style.cssText = [
    "position:fixed;inset:0;z-index:99999;",
    "background:var(--cream);",
    "display:flex;flex-direction:column;",
    "overflow-y:auto;-webkit-overflow-scrolling:touch;",
    "padding:calc(var(--safe-top) + 12px) 24px calc(var(--safe-bottom) + 24px);",
    "animation:fadeIn 0.35s ease both;",
    "min-height:100vh;min-height:100dvh;",
  ].join("");

  function renderSlide() {
    const s = sl[cur];
    const dots = sl
      .map(
        (_, i) =>
          `<div style="width:${i === cur ? 28 : 8}px;height:8px;border-radius:99px;background:${i === cur ? "var(--primary)" : "var(--cream-border)"};transition:all 0.3s ease;flex-shrink:0;"></div>`,
      )
      .join("");
    const langBtns = ["ru", "en", "ka"]
      .map(
        (l) =>
          `<button class="ob-lang-btn" data-l="${l}" style="width:32px;height:32px;border-radius:50%;border:2px solid ${l === lang ? "var(--primary)" : "var(--cream-border)"};background:${l === lang ? "var(--primary)" : "var(--cream-dark)"};color:${l === lang ? "white" : "var(--text-muted)"};font-size:15px;">${l === "ru" ? "🇷🇺" : l === "en" ? "🇬🇧" : "🇬🇪"}</button>`,
      )
      .join("");

    ov.innerHTML = `
      <!-- Top bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;padding-bottom:8px;flex-shrink:0;">
        <div style="display:flex;gap:8px;align-items:center;">${langBtns}</div>
        <button id="obSkip" style="background:none;border:none;color:var(--text-muted);font-size:14px;font-weight:700;padding:8px 4px;min-width:60px;text-align:right;">
          ${{ ru: "Пропустить", en: "Skip", ka: "გამოტოვება" }[lang]}
        </button>
      </div>

      <!-- Main content — vertically centered, flexible -->
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px 0 16px;min-height:240px;">
        <div style="font-size:72px;line-height:1;margin-bottom:20px;animation:obBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both;">${s.emoji}</div>
        <div style="font-size:22px;font-weight:900;color:${s.color};line-height:1.3;margin-bottom:14px;max-width:290px;">${s.title}</div>
        <div style="font-size:14px;color:var(--text-soft);line-height:1.65;max-width:280px;">${s.sub}</div>
      </div>

      <!-- Bottom section — always at natural position, never off-screen -->
      <div style="flex-shrink:0;padding-bottom:16px;">
        <!-- Dots -->
        <div style="display:flex;justify-content:center;gap:8px;margin-bottom:20px;">${dots}</div>
        <!-- Next / Start button -->
        <button id="obNext" style="width:100%;padding:17px;border-radius:var(--radius-xl);background:${s.color};color:white;border:none;font-size:16px;font-weight:900;box-shadow:0 8px 24px ${s.color}33;margin-bottom:10px;">
          ${cur < sl.length - 1 ? { ru: "Далее →", en: "Next →", ka: "შემდეგი →" }[lang] : { ru: "Начать! 🚀", en: "Start! 🚀", ka: "დაწყება! 🚀" }[lang]}
        </button>
        <!-- Slide counter -->
        <div style="text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">${cur + 1} / ${sl.length}</div>
      </div>`;

    // Wire buttons — use querySelector within ov, not document.getElementById
    // to avoid conflicts with other page elements
    ov.querySelector("#obSkip").addEventListener("click", finishOnboarding);
    ov.querySelector("#obNext").addEventListener("click", () => {
      if (cur < sl.length - 1) {
        cur++;
        renderSlide();
      } else finishOnboarding();
    });
    ov.querySelectorAll(".ob-lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        try {
          setLanguage(btn.dataset.l);
        } catch (e) {}
        ov.remove();
        showOnboarding();
      });
    });
  }

  function finishOnboarding() {
    try {
      localStorage.setItem("onboarding_done", "1");
    } catch (e) {}
    ov.style.animation = "obFadeOut 0.25s ease forwards";
    setTimeout(() => {
      try {
        ov.remove();
      } catch (e) {}
    }, 280);
  }

  document.body.appendChild(ov);
  renderSlide();
}

// ──────────────────────────────────────────────────────────────
// 2. СВАЙП СНИЗУ ВВЕРХ — быстрое добавление операции
// ──────────────────────────────────────────────────────────────
(function initSwipeToAdd() {
  let startY = 0,
    startTime = 0;
  const THRESHOLD = 90; // px
  const MAX_DURATION = 350; // ms

  document.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      startY = touch.clientY;
      startTime = Date.now();
    },
    { passive: true },
  );

  document.addEventListener(
    "touchend",
    (e) => {
      const touch = e.changedTouches[0];
      const dy = startY - touch.clientY; // positive = swipe up
      const dt = Date.now() - startTime;
      // Only trigger from bottom 30% of screen, fast upward swipe
      if (
        dy > THRESHOLD &&
        dt < MAX_DURATION &&
        startY > window.innerHeight * 0.65
      ) {
        // Don't trigger if a modal is open or inside a scrollable area
        if (document.querySelector(".modal-overlay.open")) return;
        if (
          e.target.closest(".modal, .modal-overlay, .bottom-nav, #mainContent")
        )
          return;
        // Trigger FAB
        document.getElementById("fabBtn")?.click();
      }
    },
    { passive: true },
  );
})();

// ──────────────────────────────────────────────────────────────
// 3. ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ БОЛЬШОЙ СУММЫ (>5000)
// ──────────────────────────────────────────────────────────────
const _origDeleteOp = typeof deleteOp === "function" ? deleteOp : null;
function safeDeleteOp(idx) {
  const op = transactions[idx];
  if (!op) {
    if (_origDeleteOp) _origDeleteOp(idx);
    return;
  }
  const threshold = 5000; // in base currency
  if (Math.abs(op.amountRub) >= threshold) {
    const L = {
      ru: `Удалить операцию на ${fmt(op.amountRub)}?`,
      en: `Delete transaction for ${fmt(op.amountRub)}?`,
      ka: `წავშალოთ ${fmt(op.amountRub)}-ის ოპერაცია?`,
    };
    askConfirm(
      L[currentLang] || L.ru,
      () => {
        if (_origDeleteOp) _origDeleteOp(idx);
        else {
          const _dt5 = transactions[idx];
          transactions.splice(idx, 1);
          if (_dt5 && _dt5._initial) {
            startBalanceRub = 0;
            localStorage.removeItem("startBalanceRub");
          }
          saveAll();
          updateTopBlocks();
          if (currentTab === "home") renderHome();
          showToast(t("deleted"));
        }
      },
      { icon: "⚠️", yesText: t("confirmOkBtn") },
    );
  } else {
    if (_origDeleteOp) _origDeleteOp(idx);
  }
}

// ──────────────────────────────────────────────────────────────
// 4. СКАНИРОВАНИЕ ЧЕКОВ — камера + OCR через Tesseract.js
// ──────────────────────────────────────────────────────────────
function openReceiptScanner() {
  const lang = currentLang;
  const L = {
    ru: {
      title: "📸 Сканировать чек",
      hint: "Сфотографируйте чек — приложение попробует распознать сумму",
      scan: "Открыть камеру",
      result: "Распознанная сумма:",
      confirm: "Использовать",
      cancel: "Отмена",
      scanning: "Распознаю...",
      notFound: "Сумма не найдена. Введите вручную.",
      noCamera: "Камера недоступна",
    },
    en: {
      title: "📸 Scan receipt",
      hint: "Take a photo of a receipt — the app will try to recognize the amount",
      scan: "Open camera",
      result: "Detected amount:",
      confirm: "Use this",
      cancel: "Cancel",
      scanning: "Recognizing...",
      notFound: "Amount not found. Enter manually.",
      noCamera: "Camera unavailable",
    },
    ka: {
      title: "📸 ჩეკის სკანირება",
      hint: "სფოტოგრაფირეთ ჩეკი — პროგრამა ამოიცნობს თანხას",
      scan: "კამერის გახსნა",
      result: "ამოცნობილი თანხა:",
      confirm: "გამოყენება",
      cancel: "გაუქმება",
      scanning: "ამოცნობა...",
      notFound: "თანხა ვერ მოიძებნა.",
      noCamera: "კამერა მიუწვდომელია",
    },
  };
  const lc = L[lang] || L.ru;

  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);">
      <div style="font-weight:800;font-size:14px;color:var(--primary);margin-bottom:8px;">${lc.hint}</div>
      <div style="font-size:12px;color:var(--text-soft);line-height:1.7;">
        ${{ ru: "<b>Как пользоваться:</b><br>1. Нажмите «Открыть камеру»<br>2. Сфотографируйте чек или квитанцию<br>3. Приложение распознает итоговую сумму<br>4. Нажмите «Использовать» — откроется форма добавления расхода<br><br><b>Советы для лучшего результата:</b><br>• Хорошее освещение, без теней<br>• Держите телефон ровно над чеком<br>• Итоговая строка должна быть видна", en: "<b>How to use:</b><br>1. Tap 'Open camera'<br>2. Photo a receipt or bill<br>3. App detects the total amount<br>4. Tap 'Use this' — expense form opens<br><br><b>Tips for best results:</b><br>• Good lighting, no shadows<br>• Hold phone flat above receipt<br>• Total line must be visible", ka: "<b>გამოყენება:</b><br>1. 'კამერის გახსნა'<br>2. ფოტოგრაფირება<br>3. პროგრამა ამოიცნობს<br>4. 'გამოყენება' → ფორმა" }[currentLang]}
      </div>
    </div>
    <div id="scanArea" style="text-align:center;">
      <div style="width:100%;height:180px;background:var(--cream-dark);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;margin-bottom:16px;border:2px dashed var(--cream-border);position:relative;overflow:hidden;" id="scanPreview">
        <div style="text-align:center;color:var(--text-muted);">
          <div style="font-size:48px;margin-bottom:8px;">📷</div>
          <div style="font-size:13px;font-weight:700;">${lc.scan}</div>
        </div>
        <input type="file" id="receiptInput" accept="image/*" capture="environment" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">
      </div>
      <div id="scanStatus" style="font-size:14px;color:var(--text-muted);margin-bottom:12px;min-height:20px;"></div>
      <div id="scanResultArea" style="display:none;">
        <div style="font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:6px;">${lc.result}</div>
        <div id="scanAmount" style="font-size:32px;font-weight:900;color:var(--primary);margin-bottom:16px;"></div>
        <button class="btn-primary" id="useAmountBtn" style="width:100%;margin-bottom:10px;">${lc.confirm}</button>
      </div>
    </div>
    <button class="btn-secondary" id="scanCancel" style="width:100%;">${lc.cancel}</button>`;

  const modal = createModal("scanModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("scanModal");
  document
    .getElementById("scanCancel")
    .addEventListener("click", () => closeModal("scanModal"));

  document
    .getElementById("receiptInput")
    .addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      // Show preview
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const preview = document.getElementById("scanPreview");
        preview.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:contain;">
        <input type="file" id="receiptInput2" accept="image/*" capture="environment" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">`;

        const status = document.getElementById("scanStatus");
        status.textContent = lc.scanning;

        try {
          // Load Tesseract.js dynamically
          if (!window.Tesseract) {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.3/tesseract.min.js";
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }
          const result = await window.Tesseract.recognize(
            ev.target.result,
            "rus+eng",
            {},
          );
          const text = result.data.text;
          // Find largest number in text (likely the total)
          const numbers = [...text.matchAll(/[\d\s]+[.,]\d{1,2}/g)].map((m) =>
            parseFloat(m[0].replace(/\s/g, "").replace(",", ".")),
          );
          const biggest = numbers.length ? Math.max(...numbers) : null;

          if (biggest && biggest > 0) {
            status.textContent = "";
            document.getElementById("scanResultArea").style.display = "block";
            document.getElementById("scanAmount").textContent = fmt(
              biggest * (1 / exchangeRates[displayCurrency] || 1),
            );
            document.getElementById("useAmountBtn").onclick = () => {
              closeModal("scanModal");
              // Open add operation modal with pre-filled amount
              addType = "expense";
              openAddModal();
              setTimeout(() => {
                const amtInput = document.getElementById("addAmount");
                if (amtInput) amtInput.value = toDisp(biggest).toFixed(2);
              }, 400);
            };
          } else {
            status.textContent = lc.notFound;
          }
        } catch (err) {
          status.textContent = lc.notFound;
        }
      };
      reader.readAsDataURL(file);
    });
}

// ──────────────────────────────────────────────────────────────
// 5. ПРАВИЛО 50/30/20 — автоматическое распределение бюджета
// ──────────────────────────────────────────────────────────────
function openBudget503020Modal() {
  const lang = currentLang;
  const L = {
    ru: {
      title: "⚖️ Правило 50/30/20",
      what: "Что это такое?",
      whatDesc:
        "Правило Уоррена Баффета для личных финансов. Ваш доход делится на три части: 50% на нужды, 30% на желания, 20% на сбережения и инвестиции.",
      income: "Ваш ежемесячный доход",
      needsTitle: "🏠 50% — Нужды (обязательные расходы)",
      needsDesc: "Аренда, коммуналка, продукты, транспорт, кредиты",
      wantsTitle: "🎉 30% — Желания (развлечения)",
      wantsDesc: "Рестораны, одежда, путешествия, хобби",
      savingsTitle: "💰 20% — Сбережения",
      savingsDesc: "Резервный фонд, инвестиции, пенсионный счёт",
      calc: "Рассчитать",
      apply: "Применить как лимиты",
      applied: "✅ Лимиты применены в раздел «Бюджеты»",
      tip: "💡 Начните с 50/30/20 и корректируйте под себя. Главное — начать откладывать хоть что-то!",
      currency: "Валюта",
    },
    en: {
      title: "⚖️ 50/30/20 Rule",
      what: "What is this?",
      whatDesc:
        "Warren Buffett's personal finance rule. Your income is split: 50% for needs, 30% for wants, 20% for savings and investments.",
      income: "Your monthly income",
      needsTitle: "🏠 50% — Needs (mandatory)",
      needsDesc: "Rent, utilities, groceries, transport, loans",
      wantsTitle: "🎉 30% — Wants (entertainment)",
      wantsDesc: "Restaurants, clothes, travel, hobbies",
      savingsTitle: "💰 20% — Savings",
      savingsDesc: "Emergency fund, investments, retirement",
      calc: "Calculate",
      apply: "Apply as budget limits",
      applied: "✅ Limits applied to Budgets",
      tip: "💡 Start with 50/30/20 and adjust to your lifestyle. The key is to start saving something!",
      currency: "Currency",
    },
    ka: {
      title: "⚖️ 50/30/20 წესი",
      what: "რა არის ეს?",
      whatDesc:
        "უორენ ბაფეტის პირადი ფინანსების წესი. შემოსავლის 50% — საჭიროებები, 30% — სურვილები, 20% — დანაზოგები.",
      income: "თქვენი ყოველთვიური შემოსავალი",
      needsTitle: "🏠 50% — საჭიროებები",
      needsDesc: "ქირა, კომუნალური, საკვები, ტრანსპორტი, სესხები",
      wantsTitle: "🎉 30% — სურვილები",
      wantsDesc: "რესტორნები, ტანსაცმელი, მოგზაურობა, ჰობი",
      savingsTitle: "💰 20% — დანაზოგები",
      savingsDesc: "სარეზერვო ფონდი, ინვესტიციები",
      calc: "გამოანგარიშება",
      apply: "ლიმიტების გამოყენება",
      applied: "✅ ლიმიტები გამოყენებულია",
      tip: "💡 დაიწყეთ 50/30/20-ით და მოარგეთ თქვენს ცხოვრებას!",
      currency: "ვალუტა",
    },
  };
  const lc = L[lang] || L.ru;

  // Calculate current average income from transactions
  const incomeTransactions = transactions.filter(
    (t) => t.type === "income" && !t._initial,
  );
  const avgMonthlyIncome =
    incomeTransactions.length > 0
      ? incomeTransactions.reduce((s, t) => s + t.amountRub, 0) /
        Math.max(
          1,
          new Set(incomeTransactions.map((t) => (t.date || "").slice(0, 7)))
            .size,
        )
      : 0;
  const prefillIncome = toDisp(avgMonthlyIncome).toFixed(0);

  const html = `
    <div style="background:var(--balance-pale);border-radius:14px;padding:12px 14px;margin-bottom:14px;border-left:4px solid #2563eb;">
      <div style="font-weight:800;font-size:14px;color:#2563eb;margin-bottom:4px;">${lc.what}</div>
      <div style="font-size:13px;color:var(--text-soft);line-height:1.6;">${lc.whatDesc}</div>
    </div>

    <div class="field-group">
      <label class="field-label">${lc.income} (${sym()})</label>
      <input type="number" id="ruleIncome" class="modal-input" value="${prefillIncome}" min="0" step="1" placeholder="0" inputmode="numeric">
    </div>

    <div id="ruleResults" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:16px;">
        <div style="background:var(--expense-pale);border-radius:var(--radius-md);padding:14px;border-left:4px solid var(--expense-color);">
          <div style="font-weight:800;font-size:13px;margin-bottom:4px;">${lc.needsTitle}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${lc.needsDesc}</div>
          <div id="needs50" style="font-size:22px;font-weight:900;color:var(--expense-color);"></div>
        </div>
        <div style="background:var(--gold-pale);border-radius:var(--radius-md);padding:14px;border-left:4px solid var(--gold);">
          <div style="font-weight:800;font-size:13px;margin-bottom:4px;">${lc.wantsTitle}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${lc.wantsDesc}</div>
          <div id="wants30" style="font-size:22px;font-weight:900;color:var(--gold);"></div>
        </div>
        <div style="background:var(--income-pale);border-radius:var(--radius-md);padding:14px;border-left:4px solid var(--income-color);">
          <div style="font-weight:800;font-size:13px;margin-bottom:4px;">${lc.savingsTitle}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${lc.savingsDesc}</div>
          <div id="savings20" style="font-size:22px;font-weight:900;color:var(--income-color);"></div>
        </div>
      </div>
      <div style="background:var(--primary-pale);border-radius:12px;padding:12px;margin-bottom:14px;font-size:12px;color:var(--text-soft);line-height:1.5;">${lc.tip}</div>
      <button class="btn-primary" id="applyRuleBtn" style="width:100%;margin-bottom:10px;">${lc.apply}</button>
    </div>

    <button class="btn-primary" id="calcRuleBtn" style="width:100%;margin-bottom:10px;">${lc.calc} 📊</button>
    <button class="btn-secondary" id="closeRuleBtn" style="width:100%;">${t("cancel")}</button>`;

  const modal = createModal("rule503020Modal", lc.title, html);
  document.body.appendChild(modal);
  openModal("rule503020Modal");

  document
    .getElementById("closeRuleBtn")
    .addEventListener("click", () => closeModal("rule503020Modal"));

  const calcBtn = document.getElementById("calcRuleBtn");
  calcBtn.addEventListener("click", () => {
    const income = parseFloat(document.getElementById("ruleIncome").value) || 0;
    if (income <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    // Convert from display currency to RUB base
    const incomeRub =
      (income / (exchangeRates[displayCurrency] || 1)) * exchangeRates["RUB"];
    const needs = toDisp(incomeRub * 0.5).toFixed(2);
    const wants = toDisp(incomeRub * 0.3).toFixed(2);
    const savings = toDisp(incomeRub * 0.2).toFixed(2);
    document.getElementById("needs50").textContent = needs + " " + sym();
    document.getElementById("wants30").textContent = wants + " " + sym();
    document.getElementById("savings20").textContent = savings + " " + sym();
    document.getElementById("ruleResults").style.display = "block";
    calcBtn.style.display = "none";
    haptic("success");
  });

  document.getElementById("applyRuleBtn")?.addEventListener("click", () => {
    const income = parseFloat(document.getElementById("ruleIncome").value) || 0;
    const incomeRub =
      (income / (exchangeRates[displayCurrency] || 1)) * exchangeRates["RUB"];
    // Apply as category budgets (split into main expense categories)
    const needsCats = Object.keys(categories).slice(0, 3);
    const wantsCats = Object.keys(categories).slice(3);
    const needsBudget = (incomeRub * 0.5) / Math.max(1, needsCats.length);
    const wantsBudget = (incomeRub * 0.3) / Math.max(1, wantsCats.length);
    needsCats.forEach((c) => {
      categoryBudgets[c] = needsBudget;
    });
    wantsCats.forEach((c) => {
      categoryBudgets[c] = wantsBudget;
    });
    saveAll();
    closeModal("rule503020Modal");
    showToast(lc.applied, "success");
    haptic("success");
    if (currentTab === "settings") renderSettings();
  });
}

// ──────────────────────────────────────────────────────────────
// 6. PUSH-УВЕДОМЛЕНИЯ О ПОВТОРЯЮЩИХСЯ ПЛАТЕЖАХ
// ──────────────────────────────────────────────────────────────
function checkRecurringNotifications() {
  if (!recurringOps || !recurringOps.length) return;
  if (Notification.permission !== "granted") return;
  const today = new Date();
  const todayDay = today.getDate();
  const notifiedKey = "recurring_notified_" + today.toISOString().slice(0, 10);
  if (localStorage.getItem(notifiedKey)) return;

  const due = recurringOps.filter((op) => {
    if (!op.enabled) return false;
    if (op.freq === "monthly" && op.day === todayDay) return true;
    return false;
  });

  if (due.length > 0) {
    localStorage.setItem(notifiedKey, "1");
    const L = {
      ru: "повторяющийся платёж",
      en: "recurring payment",
      ka: "განმეორებადი გადახდა",
    };
    due.forEach((op) => {
      const title = "🔔 БюджетPRO";
      const body = `${L[currentLang]}: ${op.category} — ${fmt(op.amountRub)}`;
      try {
        new Notification(title, { body, icon: "/favicon-96x96.png" });
      } catch (e) {}
    });
  }
}
// ──────────────────────────────────────────────────────────────
// 7. ЭКСПОРТ В GOOGLE ТАБЛИЦЫ — инструкция + CSV-ready
// ──────────────────────────────────────────────────────────────
function openGoogleSheetsExport() {
  const lang = currentLang;
  const L = {
    ru: {
      title: "📊 Экспорт в Google Таблицы",
      step1: "Шаг 1: Скачайте CSV файл",
      step2: "Шаг 2: Откройте Google Таблицы",
      step3: "Шаг 3: Файл → Импорт → Загрузить файл → выберите скачанный CSV",
      step4: "Шаг 4: Разделитель: запятая (,) → Нажмите «Импортировать данные»",
      download: "⬇️ Скачать CSV для Google Таблиц",
      open: "🔗 Открыть Google Таблицы",
      tip: "💡 Google Таблицы бесплатны. После импорта вы можете строить диаграммы, фильтровать, делиться с семьёй.",
      cancel: "Закрыть",
    },
    en: {
      title: "📊 Export to Google Sheets",
      step1: "Step 1: Download CSV file",
      step2: "Step 2: Open Google Sheets",
      step3: "Step 3: File → Import → Upload file → select the CSV",
      step4: "Step 4: Separator: comma (,) → Click 'Import data'",
      download: "⬇️ Download CSV for Google Sheets",
      open: "🔗 Open Google Sheets",
      tip: "💡 Google Sheets is free. After importing you can build charts, filter, share with family.",
      cancel: "Close",
    },
    ka: {
      title: "📊 Google Sheets-ში ექსპორტი",
      step1: "ნაბიჯი 1: ჩამოტვირთეთ CSV",
      step2: "ნაბიჯი 2: გახსენით Google Sheets",
      step3: "ნაბიჯი 3: File → Import → Upload → CSV ფაილი",
      step4: "ნაბიჯი 4: გამყოფი: მძიმე (,) → Import data",
      download: "⬇️ CSV ჩამოტვირთვა",
      open: "🔗 Google Sheets-ის გახსნა",
      tip: "💡 Google Sheets უფასოა. იმპორტის შემდეგ შექმენით დიაგრამები.",
      cancel: "დახურვა",
    },
  };
  const lc = L[lang] || L.ru;

  const steps = [lc.step1, lc.step2, lc.step3, lc.step4];
  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);">
      ${lc.tip}
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
      ${steps.map((s, i) => `<div style="display:flex;align-items:flex-start;gap:10px;"><div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:white;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i + 1}</div><div style="font-size:13px;line-height:1.6;padding-top:4px;">${s}</div></div>`).join("")}
    </div>
    <button class="btn-primary" id="gsDownloadBtn" style="width:100%;margin-bottom:10px;">${lc.download}</button>
    <button class="btn-secondary" id="gsOpenBtn" style="width:100%;margin-bottom:10px;">${lc.open}</button>
    <button class="btn-secondary" id="gsClose" style="width:100%;">${lc.cancel}</button>`;

  const modal = createModal("gsModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("gsModal");

  document
    .getElementById("gsClose")
    .addEventListener("click", () => closeModal("gsModal"));
  document
    .getElementById("gsOpenBtn")
    .addEventListener("click", () =>
      window.open("https://sheets.google.com", "_blank"),
    );
  document.getElementById("gsDownloadBtn").addEventListener("click", () => {
    // Generate Google Sheets-optimized CSV (with BOM for correct encoding)
    const header = {
      ru: [
        "Дата",
        "Тип",
        "Категория",
        "Подкатегория",
        "Сумма (базовая)",
        "Сумма (отображ)",
        "Валюта",
        "Заметка",
      ],
      en: [
        "Date",
        "Type",
        "Category",
        "Subcategory",
        "Amount (base)",
        "Amount (display)",
        "Currency",
        "Note",
      ],
      ka: [
        "თარიღი",
        "ტიპი",
        "კატეგორია",
        "ქვეკატეგორია",
        "თანხა (ბაზა)",
        "თანხა (ჩვენება)",
        "ვალუტა",
        "შენიშვნა",
      ],
    };
    const h = header[lang] || header.ru;
    const typeL = {
      income: { ru: "Доход", en: "Income", ka: "შემოსავალი" },
      expense: { ru: "Расход", en: "Expense", ka: "ხარჯი" },
    };
    let csv = "\uFEFF" + h.join(",") + "\n";
    transactions
      .filter((t) => !t._initial)
      .forEach((tx) => {
        const dispAmt = toDisp(tx.amountRub).toFixed(2);
        csv +=
          [
            tx.date || "",
            (typeL[tx.type] || {})[lang] || tx.type,
            `"${(tx.category || "").replace(/"/g, '""')}"`,
            `"${(tx.subcategory || "").replace(/"/g, '""')}"`,
            tx.amountRub.toFixed(2),
            dispAmt,
            displayCurrency,
            `"${(tx.note || "").replace(/"/g, '""')}"`,
          ].join(",") + "\n";
      });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `BudgetPRO_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(t("exportSuccess"), "success");
  });
}

// ──────────────────────────────────────────────────────────────
// 8. ЕЖЕМЕСЯЧНЫЙ ОТЧЁТ НА EMAIL через EmailJS
// ──────────────────────────────────────────────────────────────
function openEmailReportModal() {
  const lang = currentLang;
  const L = {
    ru: {
      title: "📧 Отчёт на email",
      email: "Ваш email",
      send: "📤 Отправить отчёт",
      sent: "✅ Отчёт отправлен!",
      hint: "Краткий финансовый отчёт за текущий месяц. Используется EmailJS (бесплатно до 200 отправок/месяц).",
      noEmail: "Введите email",
      cancel: "Отмена",
      setup:
        "⚠️ Сначала настройте EmailJS в коде (serviceId, templateId, publicKey)",
      month: "Отчёт за",
      income: "Доходы:",
      expense: "Расходы:",
      balance: "Баланс:",
    },
    en: {
      title: "📧 Email report",
      email: "Your email",
      send: "📤 Send report",
      sent: "✅ Report sent!",
      hint: "Brief financial report for the current month. Uses EmailJS (free up to 200 sends/month).",
      noEmail: "Enter email",
      cancel: "Cancel",
      setup:
        "⚠️ Configure EmailJS in code first (serviceId, templateId, publicKey)",
      month: "Report for",
      income: "Income:",
      expense: "Expenses:",
      balance: "Balance:",
    },
    ka: {
      title: "📧 Email ანგარიში",
      email: "თქვენი email",
      send: "📤 ანგარიშის გაგზავნა",
      sent: "✅ გაიგზავნა!",
      hint: "მიმდინარე თვის ფინანსური ანგარიში. გამოყენება: EmailJS (200 შეტყობინება/თვე უფასო).",
      noEmail: "შეიყვანეთ email",
      cancel: "გაუქმება",
      setup: "⚠️ გთხოვთ დააყენოთ EmailJS",
      month: "ანგარიში:",
      income: "შემოსავალი:",
      expense: "ხარჯი:",
      balance: "ნაშთი:",
    },
  };
  const lc = L[lang] || L.ru;
  // Build report text
  const now = new Date();
  const monthName = t("months")[now.getMonth()] + " " + now.getFullYear();
  const monthStr = now.toISOString().slice(0, 7);
  const monthTx = transactions.filter((tx) =>
    (tx.date || "").startsWith(monthStr),
  );
  const inc = monthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amountRub, 0);
  const exp = monthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amountRub, 0);
  const bal = inc - exp;
  const reportText = `${lc.month} ${monthName}\n${lc.income} ${fmt(inc)}\n${lc.expense} ${fmt(exp)}\n${lc.balance} ${fmt(bal)}\n\n— БюджетPRO`;

  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:12px 14px;margin-bottom:14px;border-left:4px solid var(--primary);font-size:13px;line-height:1.6;">${lc.hint}</div>
    <div style="background:var(--cream-dark);border-radius:12px;padding:14px;margin-bottom:16px;font-size:13px;white-space:pre-line;font-family:monospace;line-height:1.8;">${reportText}</div>
    <div class="field-group"><label class="field-label">${lc.email}</label><input type="email" id="reportEmail" class="modal-input" placeholder="your@email.com"></div>
    <div style="background:var(--gold-pale);border-radius:12px;padding:10px 12px;margin-bottom:14px;font-size:11px;color:var(--text-muted);">${lc.setup}</div>
    <button class="btn-primary" id="sendReportBtn" style="width:100%;margin-bottom:10px;">${lc.send}</button>
    <button class="btn-secondary" id="closeReportBtn" style="width:100%;">${lc.cancel}</button>`;

  const modal = createModal("emailReportModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("emailReportModal");
  document
    .getElementById("closeReportBtn")
    .addEventListener("click", () => closeModal("emailReportModal"));
  document.getElementById("sendReportBtn").addEventListener("click", () => {
    const email = document.getElementById("reportEmail").value.trim();
    if (!email || !email.includes("@")) {
      showToast(lc.noEmail, "error");
      return;
    }
    // EmailJS integration — user needs to configure these values
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
      // Open mailto: as fallback
      const subject = encodeURIComponent(`БюджетPRO — ${monthName}`);
      const body = encodeURIComponent(reportText);
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      closeModal("emailReportModal");
      showToast(lc.sent, "success");
      return;
    }
    // Load EmailJS
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
      window.emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: email,
          report: reportText,
          month: monthName,
        })
        .then(() => {
          closeModal("emailReportModal");
          showToast(lc.sent, "success");
        })
        .catch(() => showToast(t("error"), "error"));
    };
    document.head.appendChild(s);
  });
}

// ──────────────────────────────────────────────────────────────
// WIRE: Добавить новые кнопки в Settings и Tools
// ──────────────────────────────────────────────────────────────
// Inject new buttons into Tools tab after it renders
const _origRenderTools = typeof renderTools === "function" ? renderTools : null;
function injectNewToolButtons() {
  const content = document.getElementById("mainContent");
  if (!content) return;
  // Remove stale block before re-inserting
  document.getElementById("newToolsBlock")?.remove();
  if (currentTab !== "tools") return;
  const lang = currentLang;
  const labels = {
    scanner: {
      ru: "📸 Сканировать чек",
      en: "📸 Scan receipt",
      ka: "📸 ჩეკის სკანირება",
    },
    rule: {
      ru: "⚖️ Правило 50/30/20",
      en: "⚖️ 50/30/20 Rule",
      ka: "⚖️ 50/30/20 წესი",
    },
    sheets: {
      ru: "📊 Экспорт в Google Таблицы",
      en: "📊 Google Sheets export",
      ka: "📊 Google Sheets-ი",
    },
    email: {
      ru: "📧 Отчёт на email",
      en: "📧 Email report",
      ka: "📧 Email ანგარიში",
    },
  };
  const block = document.createElement("div");
  block.id = "newToolsBlock";
  block.style.cssText =
    "padding:0 16px;margin-top:16px;display:flex;flex-direction:column;gap:10px;";
  block.innerHTML = `
    <div style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:8px;padding-bottom:8px;border-bottom:1.5px solid var(--cream-border);">✨ ${lang === "ru" ? "Новые инструменты" : lang === "en" ? "New tools" : "ახალი ხელსაწყოები"}</div>
    <button class="new-tool-btn" id="newScanBtn">
      <span class="ntb-icon">📸</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang === "ru" ? "Сканер чеков" : lang === "en" ? "Receipt Scanner" : "ჩეკის სკანერი"}</span>
        <span class="ntb-sub">${lang === "ru" ? "Сфотографируйте чек — сумма заполнится автоматически" : lang === "en" ? "Photo a receipt — amount fills automatically" : "ფოტო ჩეკი — თანხა ავტომატურად"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
    <button class="new-tool-btn" id="newRuleBtn">
      <span class="ntb-icon">⚖️</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang === "ru" ? "Правило 50/30/20" : lang === "en" ? "50/30/20 Rule" : "50/30/20 წესი"}</span>
        <span class="ntb-sub">${lang === "ru" ? "Умное распределение бюджета по Баффету" : lang === "en" ? "Smart budget split by Buffett" : "ბაფეტის ბიუჯეტის განაწილება"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
    <button class="new-tool-btn" id="newSheetsBtn">
      <span class="ntb-icon">📊</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang === "ru" ? "Google Таблицы" : lang === "en" ? "Google Sheets" : "Google Sheets"}</span>
        <span class="ntb-sub">${lang === "ru" ? "Экспорт всей истории в таблицу" : lang === "en" ? "Export full history to spreadsheet" : "ისტორიის ექსპორტი ცხრილში"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
    <button class="new-tool-btn" id="newEmailBtn">
      <span class="ntb-icon">📧</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang === "ru" ? "Отчёт на email" : lang === "en" ? "Email Report" : "Email ანგარიში"}</span>
        <span class="ntb-sub">${lang === "ru" ? "Ежемесячный финансовый отчёт на почту" : lang === "en" ? "Monthly financial report by email" : "ყოველთვიური ანგარიში"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
  `;
  content.appendChild(block);
  document
    .getElementById("newScanBtn")
    ?.addEventListener("click", openReceiptScanner);
  document
    .getElementById("newRuleBtn")
    ?.addEventListener("click", openBudget503020Modal);
  document
    .getElementById("newSheetsBtn")
    ?.addEventListener("click", openGoogleSheetsExport);
  document
    .getElementById("newEmailBtn")
    ?.addEventListener("click", openEmailReportModal);
}

// Hook into setTab to inject buttons when tools tab is shown
// Use a flag to avoid double-hooking
if (!window._toolsHookInstalled) {
  window._toolsHookInstalled = true;
  const _origSetTabForTools = window.setTab;
  window.setTab = function (tab) {
    if (_origSetTabForTools) _origSetTabForTools(tab);
    if (tab === "tools") setTimeout(injectNewToolButtons, 300);
    if (tab === "home")
      setTimeout(() => {
        if (shouldShowOnboarding()) showOnboarding();
      }, 100);
  };
}

// ██████████████████████████████████████████████████████████████
//  НОВЫЕ ФУНКЦИИ v4.0 — WOW-БЛОК
// ██████████████████████████████████████████████████████████████

// ═══════════════════════════════════════════════════════════════
// 🎬 1. SPLASH SCREEN
// ═══════════════════════════════════════════════════════════════
(function initSplashScreen() {
  // Don't show on every reload — only on first visit of session
  if (sessionStorage.getItem("splashShown")) return;
  sessionStorage.setItem("splashShown", "1");

  const splash = document.createElement("div");
  splash.id = "splashScreen";
  splash.style.cssText = [
    "position:fixed;inset:0;z-index:999999;",
    "background:linear-gradient(160deg,var(--primary) 0%,#1a4731 60%,#0f2318 100%);",
    "display:flex;flex-direction:column;align-items:center;justify-content:center;",
    "gap:16px;transition:opacity 0.5s ease, transform 0.5s ease;",
  ].join("");

  const style = document.createElement("style");
  style.textContent = `
    @keyframes splashLogo {
      0%   { transform: scale(0.3) rotate(-20deg); opacity: 0; }
      50%  { transform: scale(1.15) rotate(4deg);  opacity: 1; }
      100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
    }
    @keyframes splashText {
      0%   { transform: translateY(24px); opacity: 0; }
      100% { transform: translateY(0);    opacity: 1; }
    }
    @keyframes splashSub {
      0%   { opacity: 0; }
      100% { opacity: 0.7; }
    }
    @keyframes splashBar {
      0%   { width: 0%; }
      100% { width: 100%; }
    }
  `;
  document.head.appendChild(style);

  splash.innerHTML = `
    <div style="font-size:80px;line-height:1;animation:splashLogo 0.7s cubic-bezier(0.34,1.56,0.64,1) both;">🌿</div>
    <div style="font-size:32px;font-weight:900;color:white;letter-spacing:-1px;animation:splashText 0.5s 0.3s ease both;font-family:'Playfair Display',serif;">БюджетPRO</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.7);font-weight:600;animation:splashSub 0.5s 0.5s ease both;letter-spacing:0.5px;">Твой капитал — Твои правила</div>
    <div style="width:120px;height:3px;background:rgba(255,255,255,0.2);border-radius:99px;overflow:hidden;margin-top:12px;">
      <div style="height:100%;background:rgba(255,255,255,0.8);border-radius:99px;animation:splashBar 0.7s 0.1s ease both;"></div>
    </div>
  `;
  document.body.appendChild(splash);

  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.transform = "scale(1.05)";
    setTimeout(() => splash.remove(), 500);
  }, 900);
})();

// ═══════════════════════════════════════════════════════════════
// 🎉 2. CONFETTI / CELEBRATION SYSTEM
// ═══════════════════════════════════════════════════════════════
function showConfetti(opts = {}) {
  if (!animationsEnabled) return;
  const {
    x = window.innerWidth / 2,
    y = window.innerHeight / 2,
    count = 40,
    type = "confetti",
  } = opts;
  const emojis =
    type === "money"
      ? ["🪙", "💰", "💵", "✨", "💎"]
      : type === "goal"
        ? ["🎯", "⭐", "🏆", "🥇", "✨"]
        : ["🎊", "🎉", "✨", "🌟", "💫", "❤️", "🎈"];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const size = 18 + Math.random() * 22;
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${size}px;pointer-events:none;z-index:99999;user-select:none;`;
      document.body.appendChild(el);
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const dist = 80 + Math.random() * 200;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 100;
      el.animate(
        [
          {
            transform: "translate(-50%,-50%) scale(0) rotate(0deg)",
            opacity: 0,
          },
          {
            transform: `translate(calc(-50% + ${dx * 0.4}px),calc(-50% + ${dy * 0.3}px)) scale(1.3) rotate(${Math.random() * 360}deg)`,
            opacity: 1,
            offset: 0.25,
          },
          {
            transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.3) rotate(${Math.random() * 720}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 600,
          easing: "cubic-bezier(0,0.9,0.57,1)",
          fill: "forwards",
        },
      );
      setTimeout(() => el.remove(), 1700);
    }, i * 30);
  }
  haptic("success");
}

function showBudgetCelebration() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  if (now.getDate() !== lastDay) return;
  const over = Object.entries(categoryBudgets).some(([cat, limit]) => {
    const spent = transactions
      .filter(
        (tx) =>
          tx.type === "expense" &&
          tx.category === cat &&
          (tx.date || "").startsWith(now.toISOString().slice(0, 7)),
      )
      .reduce((s, tx) => s + tx.amountRub, 0);
    return spent > limit;
  });
  if (!over && Object.keys(categoryBudgets).length > 0) {
    const celebKey = "budgetCelebrated_" + now.toISOString().slice(0, 7);
    if (localStorage.getItem(celebKey)) return;
    localStorage.setItem(celebKey, "1");
    setTimeout(() => {
      showConfetti({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        count: 60,
        type: "confetti",
      });
      const L = {
        ru: "🎉 Поздравляем! Вы не превысили ни один бюджет в этом месяце!",
        en: "🎉 Congratulations! You didn't exceed any budget this month!",
        ka: "🎉 გილოცავთ! ამ თვეში ბიუჯეტი არ გადააჭარბეთ!",
      };
      showToast(L[currentLang] || L.ru, "success");
    }, 500);
  }
}

// ═══════════════════════════════════════════════════════════════
// 🎤 3. ГОЛОСОВОЙ ВВОД (Web Speech API)
// ═══════════════════════════════════════════════════════════════
function startVoiceInput() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    const L = {
      ru: "Голосовой ввод недоступен. Используйте Chrome на Android.",
      en: "Voice input not available. Use Chrome on Android.",
      ka: "ხმოვანი შეყვანა მიუწვდომელია. გამოიყენეთ Chrome.",
    };
    showToast(L[currentLang] || L.ru, "error");
    return;
  }
  const rec = new SpeechRecognition();
  rec.lang =
    currentLang === "en" ? "en-US" : currentLang === "ka" ? "ka-GE" : "ru-RU";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  // Show listening overlay
  const ov = document.createElement("div");
  ov.id = "voiceOverlay";
  ov.style.cssText =
    "position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;";
  ov.innerHTML = `
    <div style="font-size:80px;animation:voicePulse 1s ease infinite;">🎤</div>
    <div style="font-size:20px;font-weight:800;color:white;">${{ ru: "Говорите...", en: "Listening...", ka: "ილაპარაკეთ..." }[currentLang]}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.7);text-align:center;padding:0 24px;">${{ ru: "Например: «потратил 50 лари на продукты»", en: "E.g.: «spent 50 on groceries»", ka: "მაგ: «დავხარჯე 50 ლარი საყიდლებზე»" }[currentLang]}</div>
    <button id="voiceCancel" style="padding:12px 28px;border-radius:20px;background:rgba(255,255,255,0.2);color:white;border:1.5px solid rgba(255,255,255,0.4);font-size:15px;font-weight:700;cursor:pointer;">${t("cancel")}</button>
    <style>@keyframes voicePulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(255,100,100,0))}50%{transform:scale(1.1);filter:drop-shadow(0 0 20px rgba(255,100,100,0.6))}}</style>
  `;
  document.body.appendChild(ov);
  document.getElementById("voiceCancel").onclick = () => {
    rec.stop();
    ov.remove();
  };
  haptic("medium");

  rec.onresult = (event) => {
    ov.remove();
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("Voice:", text);
    haptic("success");
    parseVoiceInput(text);
  };
  rec.onerror = (e) => {
    ov.remove();
    const L = {
      ru: "Не удалось распознать. Попробуйте ещё раз.",
      en: "Couldn't recognize. Please try again.",
      ka: "ვერ ამოვიცანი. სცადეთ ხელახლა.",
    };
    showToast(L[currentLang] || L.ru, "error");
  };
  rec.onend = () => {
    const o = document.getElementById("voiceOverlay");
    if (o) o.remove();
  };
  rec.start();
}

function parseVoiceInput(text) {
  // Extract amount: look for numbers (including with decimals)
  const amountMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  const amount = amountMatch
    ? parseFloat(amountMatch[1].replace(",", "."))
    : null;

  // Detect type: income keywords
  const incomeWords = {
    ru: ["получил", "заработал", "пришло", "доход", "зарплата"],
    en: ["received", "earned", "income", "salary", "got"],
    ka: ["მივიღე", "შემოვიდა"],
  };
  const expenseWords = {
    ru: ["потратил", "купил", "заплатил", "расход", "потратила"],
    en: ["spent", "bought", "paid", "expense"],
    ka: ["დავხარჯე", "ვიყიდე", "გადავიხადე"],
  };
  const iWords = incomeWords[currentLang] || incomeWords.ru;
  const eWords = expenseWords[currentLang] || expenseWords.ru;
  const isIncome = iWords.some((w) => text.includes(w));
  const isExpense = eWords.some((w) => text.includes(w)) || !isIncome;

  // Find category from text
  let detectedCat = null;
  const catMap = {
    ru: {
      продукт: "Продукты",
      еда: "Продукты",
      магазин: "Продукты",
      транспорт: "Транспорт",
      метро: "Транспорт",
      автобус: "Транспорт",
      такси: "Транспорт",
      кафе: "Рестораны",
      ресторан: "Рестораны",
      кофе: "Кафе",
      аренда: "Коммуналка",
      квартира: "Коммуналка",
      коммунал: "Коммуналка",
      одежда: "Одежда",
      лекарство: "Здоровье",
      аптека: "Здоровье",
      интернет: "Коммуналка",
      телефон: "Телефон",
      бензин: "Транспорт",
    },
    en: {
      grocery: "Продукты",
      food: "Продукты",
      transport: "Транспорт",
      metro: "Транспорт",
      bus: "Транспорт",
      taxi: "Транспорт",
      coffee: "Кафе",
      restaurant: "Рестораны",
      rent: "Коммуналка",
      clothes: "Одежда",
      medicine: "Здоровье",
      pharmacy: "Здоровье",
      gas: "Транспорт",
    },
  };
  const cm = catMap[currentLang] || catMap.ru;
  for (const [word, cat] of Object.entries(cm)) {
    if (text.includes(word)) {
      detectedCat = cat;
      break;
    }
  }
  // Check actual category list
  if (!detectedCat) {
    for (const cat of Object.keys(categories)) {
      if (text.includes(cat.toLowerCase())) {
        detectedCat = cat;
        break;
      }
    }
  }

  // Show result modal
  const L = {
    ru: {
      found: "🎤 Распознано:",
      type: isIncome ? "Доход" : "Расход",
      amount: "Сумма:",
      cat: "Категория:",
      confirm: "✅ Добавить",
      edit: "✏️ Изменить",
      notFound: "Сумма не найдена. Попробуйте снова.",
    },
    en: {
      found: "🎤 Recognized:",
      type: isIncome ? "Income" : "Expense",
      amount: "Amount:",
      cat: "Category:",
      confirm: "✅ Add",
      edit: "✏️ Edit",
      notFound: "Amount not found. Try again.",
    },
    ka: {
      found: "🎤 ამოცნობილია:",
      type: isIncome ? "შემოსავალი" : "ხარჯი",
      amount: "თანხა:",
      cat: "კატეგორია:",
      confirm: "✅ დამატება",
      edit: "✏️ შეცვლა",
      notFound: "თანხა ვერ მოიძებნა.",
    },
  };
  const lc = L[currentLang] || L.ru;

  if (!amount) {
    showToast(lc.notFound, "error");
    return;
  }

  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:14px;border-left:4px solid var(--primary);">
      <div style="font-size:12px;font-weight:800;color:var(--text-muted);margin-bottom:4px;">${lc.found}</div>
      <div style="font-size:14px;line-height:1.6;">"${text}"</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div style="background:var(--cream-dark);border-radius:12px;padding:12px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:4px;">${lc.type}</div>
        <div style="font-size:16px;font-weight:900;color:${isIncome ? "var(--income-color)" : "var(--expense-color)"};">${lc.type}</div>
      </div>
      <div style="background:var(--cream-dark);border-radius:12px;padding:12px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:4px;">${lc.amount}</div>
        <div style="font-size:16px;font-weight:900;">${amount.toFixed(2)} ${sym()}</div>
      </div>
    </div>
    ${detectedCat ? `<div style="background:var(--cream-dark);border-radius:12px;padding:12px;margin-bottom:14px;"><div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:4px;">${lc.cat}</div><div style="font-size:15px;font-weight:800;">${detectedCat}</div></div>` : ""}
    <div style="display:flex;gap:10px;">
      <button class="btn-secondary" id="voiceEdit" style="flex:1;">${lc.edit}</button>
      <button class="btn-primary" id="voiceConfirm" style="flex:2;">${lc.confirm}</button>
    </div>`;

  const modal = createModal(
    "voiceModal",
    "🎤 " +
      (currentLang === "en"
        ? "Voice Input"
        : currentLang === "ka"
          ? "ხმოვანი შეყვანა"
          : "Голосовой ввод"),
    html,
  );
  document.body.appendChild(modal);
  openModal("voiceModal");

  document.getElementById("voiceEdit")?.addEventListener("click", () => {
    closeModal("voiceModal");
    addType = isIncome ? "income" : "expense";
    openAddModal();
    setTimeout(() => {
      const af = document.getElementById("addAmount");
      if (af && amount)
        af.value = toDisp(
          (amount / (exchangeRates[displayCurrency] || 1)) *
            exchangeRates["RUB"],
        ).toFixed(2);
    }, 300);
  });

  document.getElementById("voiceConfirm")?.addEventListener("click", () => {
    closeModal("voiceModal");
    const amtRub =
      (amount / (exchangeRates[displayCurrency] || 1)) * exchangeRates["RUB"];
    const newTx = {
      id: Date.now() + "_v",
      type: isIncome ? "income" : "expense",
      category:
        detectedCat ||
        (isIncome
          ? Object.keys(incomeCategories)[0]
          : Object.keys(categories)[0]),
      subcategory: "",
      amountRub: amtRub,
      date: new Date().toISOString().slice(0, 10),
      note: text,
      emoji: isIncome ? "💰" : "💸",
    };
    transactions.unshift(newTx);
    saveAll();
    updateTopBlocks();
    if (currentTab === "home") renderHome();
    showToast(
      currentLang === "en"
        ? "✅ Added by voice"
        : currentLang === "ka"
          ? "✅ ხმით დამატებულია"
          : "✅ Добавлено голосом",
      "success",
    );
    showCoinAnimation();
    haptic("success");
  });
}

// Add voice button to FAB area after init
function getFloatingBtnSetting(key) {
  return localStorage.getItem(key) !== "false"; // default ON
}

function addVoiceButton() {
  document.getElementById("voiceInputBtn")?.remove();
  if (!getFloatingBtnSetting("showVoiceBtn")) return;
  const voiceBtn = document.createElement("button");
  voiceBtn.id = "voiceInputBtn";
  voiceBtn.innerHTML = "🎤";
  voiceBtn.title =
    { ru: "Голосовой ввод", en: "Voice input", ka: "ხმოვანი შეყვანა" }[
      currentLang
    ] || "Voice";
  // Position: right side, above the nav bar, offset up so doesn't overlap FAB
  voiceBtn.style.cssText =
    "position:fixed;bottom:140px;right:14px;width:44px;height:44px;border-radius:50%;background:var(--primary-pale);border:2px solid var(--primary);font-size:20px;cursor:pointer;z-index:200;box-shadow:var(--shadow-md);display:flex;align-items:center;justify-content:center;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);";
  voiceBtn.addEventListener("click", () => {
    haptic("medium");
    startVoiceInput();
  });
  voiceBtn.addEventListener(
    "mouseenter",
    () => (voiceBtn.style.transform = "scale(1.12)"),
  );
  voiceBtn.addEventListener(
    "mouseleave",
    () => (voiceBtn.style.transform = ""),
  );
  document.body.appendChild(voiceBtn);
}

// ═══════════════════════════════════════════════════════════════
// 🧠 4. УМНЫЕ ПОДСКАЗКИ — анализ паттернов
// ═══════════════════════════════════════════════════════════════
function checkSmartSuggestions() {
  if (transactions.length < 5) return; // not enough data
  const today = new Date();
  const todayDay = today.getDay(); // 0=Sun, 1=Mon...
  const todayDate = today.getDate();
  const suggestionKey = "lastSmartSuggestion";
  const lastSug = localStorage.getItem(suggestionKey);
  if (lastSug === today.toISOString().slice(0, 10)) return; // already shown today

  // Pattern 1: Weekly spending pattern
  const dayStats = {};
  transactions
    .filter((tx) => tx.type === "expense" && tx.date)
    .forEach((tx) => {
      const d = new Date(tx.date + "T00:00").getDay();
      if (!dayStats[d]) dayStats[d] = { count: 0, total: 0, cats: {} };
      dayStats[d].count++;
      dayStats[d].total += tx.amountRub;
      const cat = tx.category || "other";
      dayStats[d].cats[cat] = (dayStats[d].cats[cat] || 0) + 1;
    });

  const todayStats = dayStats[todayDay];
  if (todayStats && todayStats.count >= 3) {
    const topCat = Object.entries(todayStats.cats).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];
    const dayNames = {
      ru: [
        "воскресенье",
        "понедельник",
        "вторник",
        "среду",
        "четверг",
        "пятницу",
        "субботу",
      ],
      en: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      ka: [
        "კვირას",
        "ორშაბათს",
        "სამშაბათს",
        "ოთხშაბათს",
        "ხუთშაბათს",
        "პარასკევს",
        "შაბათს",
      ],
    };
    const dayName = (dayNames[currentLang] || dayNames.ru)[todayDay];
    const L = {
      ru: `💡 Обычно по ${dayName} вы тратите на «${topCat}». Не забыли записать?`,
      en: `💡 You usually spend on «${topCat}» on ${dayName}. Forgot to record?`,
      ka: `💡 ჩვეულებრივ ${dayName} «${topCat}»-ს ხარჯავთ. დაავიწყდათ ჩაწერა?`,
    };
    localStorage.setItem(suggestionKey, today.toISOString().slice(0, 10));
    setTimeout(() => {
      showToast(L[currentLang] || L.ru, "info");
    }, 5000);
  }

  // Pattern 2: Unusual spending (>2x average day)
  const days30 = transactions.filter((tx) => {
    if (tx.type !== "expense" || !tx.date) return false;
    const d = new Date(tx.date + "T00:00");
    return today - d < 30 * 24 * 60 * 60 * 1000;
  });
  const avgDay = days30.reduce((s, tx) => s + tx.amountRub, 0) / 30;
  const todayTotal = transactions
    .filter(
      (tx) =>
        tx.type === "expense" &&
        (tx.date || "") === today.toISOString().slice(0, 10),
    )
    .reduce((s, tx) => s + tx.amountRub, 0);
  if (todayTotal > avgDay * 2.5 && todayTotal > 0 && avgDay > 0) {
    const L = {
      ru: `⚠️ Сегодня вы потратили ${fmt(todayTotal)} — это больше обычного!`,
      en: `⚠️ You spent ${fmt(todayTotal)} today — that's above average!`,
      ka: `⚠️ დღეს ${fmt(todayTotal)} დახარჯეთ — ეს ჩვეულებრივზე მეტია!`,
    };
    showToast(L[currentLang] || L.ru, "warning");
  }
}
setInterval(checkSmartSuggestions, 30 * 60 * 1000); // check every 30 min
setTimeout(checkSmartSuggestions, 8000); // and on load

// ═══════════════════════════════════════════════════════════════
// 🎯 5. ЦЕЛИ И МЕЧТЫ с прогресс-баром
// ═══════════════════════════════════════════════════════════════
function getGoals() {
  try {
    return JSON.parse(localStorage.getItem("budgetpro_goals") || "[]");
  } catch (e) {
    return [];
  }
}
function saveGoals(goals) {
  localStorage.setItem("budgetpro_goals", JSON.stringify(goals));
}

function openGoalsModal() {
  const lang = currentLang;
  const goals = getGoals();
  const L = {
    ru: {
      title: "🎯 Мои цели и мечты",
      add: "+ Добавить цель",
      name: "Название цели",
      target: "Цель (сумма)",
      saved: "Уже накоплено",
      noGoals: "Нет целей. Добавьте первую мечту!",
      del: "Удалить",
      edit: "Пополнить",
      addSaved: "Пополнить",
      close: "Закрыть",
      progress: "Прогресс",
      done: "🏆 Достигнута!",
    },
    en: {
      title: "🎯 My Goals & Dreams",
      add: "+ Add goal",
      name: "Goal name",
      target: "Target amount",
      saved: "Already saved",
      noGoals: "No goals yet. Add your first dream!",
      del: "Delete",
      edit: "Add savings",
      addSaved: "Add savings",
      close: "Close",
      progress: "Progress",
      done: "🏆 Achieved!",
    },
    ka: {
      title: "🎯 ჩემი მიზნები",
      add: "+ მიზნის დამატება",
      name: "მიზნის სახელი",
      target: "სამიზნე თანხა",
      saved: "დაზოგილია",
      noGoals: "მიზნები არ არის. დაამატეთ!",
      del: "წაშლა",
      edit: "შევსება",
      addSaved: "შევსება",
      close: "დახურვა",
      progress: "პროგრესი",
      done: "🏆 მიღწეულია!",
    },
  };
  const lc = L[lang] || L.ru;

  const renderGoalCards = (gs) =>
    gs.length === 0
      ? `<div style="text-align:center;padding:32px;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:12px;">🌟</div><div style="font-weight:700;">${lc.noGoals}</div></div>`
      : gs
          .map((g, i) => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
            const done = g.saved >= g.target;
            const color = done
              ? "var(--gold)"
              : pct > 70
                ? "var(--primary)"
                : pct > 40
                  ? "#2563eb"
                  : "var(--text-muted)";
            return `<div style="background:var(--card-bg);border-radius:18px;padding:16px;border:1.5px solid ${done ? "var(--gold)" : "var(--cream-border)"};margin-bottom:12px;${done ? "box-shadow:0 0 0 3px rgba(255,200,0,0.2);" : ""}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="font-size:28px;">${g.emoji || "🎯"}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:900;font-size:15px;color:var(--text);">${esc(g.name)}</div>
              <div style="font-size:12px;color:var(--text-muted);">${lc.progress}: ${pct}% ${done ? "• " + lc.done : ""}</div>
            </div>
            <button class="goal-del-btn" data-gi="${i}" style="background:none;border:none;font-size:16px;cursor:pointer;color:var(--text-muted);padding:4px;">🗑</button>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:8px;">
            <span style="color:var(--primary);">${fmt(g.saved)} ${lc.saved}</span>
            <span style="color:var(--text-muted);">${fmt(g.target)} ${t("goalTargetWord")}</span>
          </div>
          <div style="height:12px;background:var(--cream-dark);border-radius:99px;overflow:hidden;margin-bottom:12px;">
            <div style="height:100%;width:${pct}%;background:${done ? "linear-gradient(90deg,var(--gold),#f59e0b)" : "linear-gradient(90deg,var(--primary),var(--primary-med))"};border-radius:99px;transition:width 1s ease;"></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="goal-add-btn btn-primary" data-gi="${i}" style="flex:1;padding:10px;font-size:13px;">💰 ${lc.addSaved}</button>
            <button class="goal-sub-btn btn-secondary" data-gi="${i}" style="flex:0 0 44px;padding:10px;font-size:18px;font-weight:900;" title="${t("goalSubtract")}">−</button>
          </div>
        </div>`;
          })
          .join("");

  const GOAL_EMOJIS = [
    "🎯",
    "🏠",
    "🚗",
    "✈️",
    "💍",
    "📱",
    "💻",
    "🎓",
    "👶",
    "🏖️",
    "💰",
    "🏋️",
    "🎸",
    "📚",
    "🌟",
  ];
  const addForm = `
    <div style="background:var(--cream-dark);border-radius:16px;padding:14px;margin-bottom:16px;border:1.5px dashed var(--cream-border);">
      <div style="font-size:13px;font-weight:800;color:var(--text-muted);margin-bottom:10px;">${lc.add}</div>
      <div class="field-group" style="margin-bottom:8px;">
        <input id="goalName" class="modal-input" placeholder="${lc.name}" style="width:100%;" autocomplete="off">
      </div>
      <div style="margin-bottom:10px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:6px;">${t("iconLabel")}</div>
        <div id="goalEmojiPicker" style="display:flex;flex-wrap:wrap;gap:6px;">
          ${GOAL_EMOJIS.map((e, i) => `<button type="button" class="goal-emoji-opt" data-e="${e}" style="width:36px;height:36px;font-size:20px;border-radius:8px;border:2px solid ${i === 0 ? "var(--primary)" : "var(--cream-border)"};background:${i === 0 ? "var(--primary-pale)" : "var(--card-bg)"};cursor:pointer;display:flex;align-items:center;justify-content:center;">${e}</button>`).join("")}
        </div>
        <input type="hidden" id="goalEmoji" value="🎯">
      </div>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <input id="goalTarget" class="modal-input" type="number" placeholder="${lc.target} (${sym()})" step="0.01" min="1" style="flex:1;" inputmode="decimal">
        <input id="goalSaved" class="modal-input" type="number" placeholder="${lc.saved} (${sym()})" step="0.01" min="0" style="flex:1;" inputmode="decimal">
      </div>
      <button class="btn-primary" id="goalAddBtn" style="width:100%;padding:14px;font-size:15px;">${lc.add}</button>
    </div>`;

  const html = addForm + `<div id="goalsList">${renderGoalCards(goals)}</div>`;
  const modal = createModal("goalsModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("goalsModal");

  document.getElementById("goalAddBtn")?.addEventListener("click", () => {
    const name = document.getElementById("goalName")?.value.trim();
    const target = parseFloat(
      document.getElementById("goalTarget")?.value || "0",
    );
    const saved = parseFloat(
      document.getElementById("goalSaved")?.value || "0",
    );
    const emoji = document.getElementById("goalEmoji")?.value || "🎯";
    if (!name || target <= 0) {
      showToast(t("goalFillNameTarget"), "error");
      return;
    }
    const newGoal = {
      name,
      target:
        (target / exchangeRates[displayCurrency]) * exchangeRates["RUB"] ||
        target,
      saved:
        (saved / exchangeRates[displayCurrency]) * exchangeRates["RUB"] ||
        saved,
      emoji,
      created: new Date().toISOString(),
    };
    const gs = getGoals();
    gs.push(newGoal);
    saveGoals(gs);
    document.getElementById("goalsList").innerHTML = renderGoalCards(gs);
    document.getElementById("goalName").value = "";
    document.getElementById("goalTarget").value = "";
    document.getElementById("goalSaved").value = "";
    haptic("success");
    if (newGoal.saved >= newGoal.target)
      showConfetti({ count: 50, type: "goal" });
    reattachGoalBtns(gs);
  });
  reattachGoalBtns(goals);

  // Wire emoji picker
  document.querySelectorAll(".goal-emoji-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".goal-emoji-opt").forEach((b) => {
        b.style.borderColor = "var(--cream-border)";
        b.style.background = "var(--card-bg)";
      });
      btn.style.borderColor = "var(--primary)";
      btn.style.background = "var(--primary-pale)";
      const hidden = document.getElementById("goalEmoji");
      if (hidden) hidden.value = btn.dataset.e;
    });
  });

  function reattachGoalBtns(gs) {
    document.querySelectorAll(".goal-del-btn").forEach((btn) => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.gi);
        askConfirm(
          t("goalDeleteConfirm"),
          () => {
            gs.splice(i, 1);
            saveGoals(gs);
            document.getElementById("goalsList").innerHTML =
              renderGoalCards(gs);
            haptic("medium");
            reattachGoalBtns(gs);
          },
          { icon: "🎯" },
        );
      };
    });
    document.querySelectorAll(".goal-add-btn").forEach((btn) => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.gi);
        const amt = parseFloat(
          prompt(
            `${t("goalAddPromptPrefix")} "${gs[i].name}" (${sym()}):`,
          ) || "0",
        );
        if (amt > 0) {
          gs[i].saved +=
            (amt / (exchangeRates[displayCurrency] || 1)) *
            (exchangeRates["RUB"] || 1);
          saveGoals(gs);
          document.getElementById("goalsList").innerHTML = renderGoalCards(gs);
          if (gs[i].saved >= gs[i].target) {
            showConfetti({ count: 60, type: "goal" });
            showToast(
              t("goalAchieved"),
              "success",
            );
          }
          haptic("success");
          reattachGoalBtns(gs);
        }
      };
    });

    // ── Subtract from goal ────────────────────────────────
    document.querySelectorAll(".goal-sub-btn").forEach((btn) => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.gi);
        const g = gs[i];
        const label = `${t("goalSubtractPromptPrefix")} "${g.name}" (${sym()}): ${t("goalSubtractMax")} ${toDisp(g.saved).toFixed(2)}`;
        const raw = prompt(label) || "0";
        const amt = parseFloat(raw);
        if (isNaN(amt) || amt <= 0) return;
        const amtRub =
          (amt / (exchangeRates[displayCurrency] || 1)) *
          (exchangeRates["RUB"] || 1);
        g.saved = Math.max(0, g.saved - amtRub);
        saveGoals(gs);
        document.getElementById("goalsList").innerHTML = renderGoalCards(gs);
        haptic("medium");
        reattachGoalBtns(gs);
        showToast(`${t("amountSubtracted")}${amt.toFixed(2)} ${sym()}`);
      };
    });
  }
}

// Add Goals button to nav or tools
function addGoalsNavButton() {
  document.getElementById("goalsNavBtn")?.remove();
  if (!getFloatingBtnSetting("showGoalsBtn")) return;
  const btn = document.createElement("button");
  btn.id = "goalsNavBtn";
  btn.innerHTML = "🎯";
  btn.title =
    { ru: "Мои цели", en: "My Goals", ka: "მიზნები" }[currentLang] || "Goals";
  // Position: left side, above the nav bar, offset up
  btn.style.cssText =
    "position:fixed;bottom:140px;left:14px;width:44px;height:44px;border-radius:50%;background:var(--gold-pale);border:2px solid var(--gold);font-size:20px;cursor:pointer;z-index:200;box-shadow:var(--shadow-md);display:flex;align-items:center;justify-content:center;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);";
  btn.addEventListener("click", () => {
    haptic("medium");
    openGoalsModal();
  });
  btn.addEventListener(
    "mouseenter",
    () => (btn.style.transform = "scale(1.12)"),
  );
  btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  document.body.appendChild(btn);
}

// ═══════════════════════════════════════════════════════════════
// 📊 6. ФИНАНСОВЫЙ ИНСАЙТ НЕДЕЛИ
// ═══════════════════════════════════════════════════════════════
function checkWeeklyInsight() {
  const today = new Date();
  const isMonday = today.getDay() === 1;
  const insightKey =
    "weeklyInsight_" +
    today.toISOString().slice(0, 7) +
    "_w" +
    Math.floor(today.getDate() / 7);
  if (localStorage.getItem(insightKey)) return;
  if (!isMonday && !localStorage.getItem("debugInsight")) return;

  const now = today.getTime();
  const msWeek = 7 * 24 * 60 * 60 * 1000;
  const thisWeekTx = transactions.filter(
    (tx) =>
      tx.type === "expense" &&
      tx.date &&
      now - new Date(tx.date + "T00:00").getTime() < msWeek,
  );
  const prevWeekTx = transactions.filter(
    (tx) =>
      tx.type === "expense" &&
      tx.date &&
      now - new Date(tx.date + "T00:00").getTime() >= msWeek &&
      now - new Date(tx.date + "T00:00").getTime() < msWeek * 2,
  );
  if (thisWeekTx.length < 2 || prevWeekTx.length < 2) return;

  const thisTotal = thisWeekTx.reduce((s, tx) => s + tx.amountRub, 0);
  const prevTotal = prevWeekTx.reduce((s, tx) => s + tx.amountRub, 0);
  if (prevTotal === 0) return;
  const diff = Math.round(((prevTotal - thisTotal) / prevTotal) * 100);

  localStorage.setItem(insightKey, "1");
  setTimeout(() => {
    const insightEl = document.createElement("div");
    insightEl.id = "weeklyInsightCard";
    insightEl.style.cssText =
      "margin:12px 16px 0;border-radius:18px;padding:16px;background:linear-gradient(135deg,var(--primary) 0%,var(--primary-med) 100%);color:white;position:relative;animation:fadeUp 0.5s ease both;box-shadow:var(--shadow-md);";
    const positive = diff > 0;
    const L = {
      ru: positive
        ? `🎉 На прошлой неделе вы потратили на <b>${Math.abs(diff)}%</b> меньше, чем позапрошлой. Отличная работа!`
        : `📊 На прошлой неделе расходы выросли на <b>${Math.abs(diff)}%</b>. Попробуйте сократить необязательные траты.`,
      en: positive
        ? `🎉 Last week you spent <b>${Math.abs(diff)}%</b> less than the week before. Great job!`
        : `📊 Last week expenses rose by <b>${Math.abs(diff)}%</b>. Try to cut optional spending.`,
      ka: positive
        ? `🎉 გასულ კვირას <b>${Math.abs(diff)}%</b>-ით ნაკლები დახარჯეთ. მშვენიერია!`
        : `📊 გასულ კვირას ხარჯები <b>${Math.abs(diff)}%</b>-ით გაიზარდა.`,
    };
    insightEl.innerHTML = `
      <button id="dismissInsight" style="position:absolute;top:10px;right:12px;background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
      <div style="font-size:13px;line-height:1.6;">${L[currentLang] || L.ru}</div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;font-size:12px;opacity:0.8;">
        <span>${{ ru: "Прошлая неделя", en: "Last week", ka: "გასული კვირა" }[currentLang]}: ${fmt(thisTotal)}</span>
        <span>${{ ru: "Позапрошлая", en: "Week before", ka: "მანამდე" }[currentLang]}: ${fmt(prevTotal)}</span>
      </div>`;
    const mainContent = document.getElementById("mainContent");
    if (mainContent && mainContent.firstChild) {
      mainContent.insertBefore(insightEl, mainContent.firstChild);
    }
    document.getElementById("dismissInsight")?.addEventListener("click", () => {
      insightEl.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => insightEl.remove(), 300);
      haptic("light");
    });
    if (positive)
      setTimeout(
        () =>
          showConfetti({
            x: window.innerWidth / 2,
            y: 200,
            count: 30,
            type: "confetti",
          }),
        300,
      );
  }, 2000);
}
setTimeout(checkWeeklyInsight, 4000);

// ═══════════════════════════════════════════════════════════════
// 💑 7. ПАРТНЁРСКИЙ РЕЖИМ (Shared budget via Firebase)
// ═══════════════════════════════════════════════════════════════
function openPartnerMode() {
  const lang = currentLang;
  const L = {
    ru: {
      title: "💑 Партнёрский режим",
      desc: "Общий бюджет с партнёром в реальном времени через Firebase",
      firebaseReq: "⚠️ Сначала настройте Firebase в панели создателя",
      roomLabel: "Код комнаты",
      createRoom: "🆕 Создать комнату",
      joinRoom: "🔗 Войти в комнату",
      yourCode: "Ваш код комнаты:",
      shareCode: "Поделитесь этим кодом с партнёром",
      partnerJoined: "✅ Партнёр подключился!",
      waitPartner: "⏳ Ожидаем партнёра...",
      liveBalance: "💰 Общий баланс",
      liveTransactions: "📋 Общие операции",
      leaveRoom: "🚪 Выйти",
      addTx: "Добавить операцию",
      noFirebase:
        "Для партнёрского режима нужен Firebase. Настройте в панели создателя.",
      close: "Закрыть",
    },
    en: {
      title: "💑 Partner Mode",
      desc: "Shared real-time budget with your partner via Firebase",
      firebaseReq: "⚠️ Configure Firebase in creator panel first",
      roomLabel: "Room code",
      createRoom: "🆕 Create room",
      joinRoom: "🔗 Join room",
      yourCode: "Your room code:",
      shareCode: "Share this code with your partner",
      partnerJoined: "✅ Partner connected!",
      waitPartner: "⏳ Waiting for partner...",
      liveBalance: "💰 Shared balance",
      liveTransactions: "📋 Shared transactions",
      leaveRoom: "🚪 Leave room",
      addTx: "Add transaction",
      noFirebase: "Partner mode needs Firebase. Configure in creator panel.",
      close: "Close",
    },
    ka: {
      title: "💑 პარტნიორის რეჟიმი",
      desc: "საერთო ბიუჯეტი პარტნიორთან Firebase-ის გამოყენებით",
      firebaseReq: "⚠️ ჯერ Firebase-ის კონფიგურაცია გამოიყენეთ",
      roomLabel: "ოთახის კოდი",
      createRoom: "🆕 ოთახის შექმნა",
      joinRoom: "🔗 ოთახში შეერთება",
      yourCode: "თქვენი ოთახის კოდი:",
      shareCode: "გაუზიარეთ ეს კოდი პარტნიორს",
      partnerJoined: "✅ პარტნიორი დაუკავშირდა!",
      waitPartner: "⏳ ველოდებით...",
      liveBalance: "💰 საერთო ბალანსი",
      liveTransactions: "📋 საერთო ოპერაციები",
      leaveRoom: "🚪 გასვლა",
      addTx: "ოპერაციის დამატება",
      noFirebase: "Firebase-ის კონფიგურაცია სჭირდება.",
      close: "დახურვა",
    },
  };
  const lc = L[lang] || L.ru;

  if (!_fbDB) {
    const html = `<div style="background:var(--expense-pale);border-radius:14px;padding:16px;margin-bottom:16px;border-left:4px solid var(--expense-color);font-size:14px;line-height:1.6;">${lc.noFirebase}</div><button class="btn-secondary" id="partnerClose" style="width:100%;">${lc.close}</button>`;
    const m = createModal("partnerModal", lc.title, html);
    document.body.appendChild(m);
    openModal("partnerModal");
    document
      .getElementById("partnerClose")
      ?.addEventListener("click", () => closeModal("partnerModal"));
    return;
  }

  const savedRoom = localStorage.getItem("partnerRoomCode");
  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:12px 14px;margin-bottom:14px;font-size:13px;line-height:1.5;border-left:4px solid var(--primary);">${lc.desc}</div>
    ${
      savedRoom
        ? `
      <div style="text-align:center;margin-bottom:14px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:4px;">${lc.yourCode}</div>
        <div style="font-size:28px;font-weight:900;color:var(--primary);letter-spacing:4px;font-family:monospace;">${savedRoom}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${lc.shareCode}</div>
      </div>
      <div id="partnerStatus" style="text-align:center;font-size:13px;color:var(--text-muted);padding:12px;background:var(--cream-dark);border-radius:12px;margin-bottom:14px;">${lc.waitPartner}</div>
      <div id="sharedTxList" style="max-height:200px;overflow-y:auto;margin-bottom:14px;"></div>
      <button class="btn-primary" id="partnerAddTx" style="width:100%;margin-bottom:8px;">💸 ${lc.addTx}</button>
      <button class="btn-secondary" id="partnerLeave" style="width:100%;">🚪 ${lc.leaveRoom}</button>
    `
        : `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button class="btn-primary" id="createRoomBtn" style="width:100%;padding:16px;">${lc.createRoom}</button>
        <div style="text-align:center;color:var(--text-muted);font-size:13px;">— или —</div>
        <div style="display:flex;gap:8px;">
          <input id="joinRoomInput" class="modal-input" placeholder="${lc.roomLabel}" style="flex:1;font-size:18px;text-align:center;letter-spacing:2px;font-family:monospace;text-transform:uppercase;">
          <button class="btn-primary" id="joinRoomBtn" style="padding:0 16px;">${lc.joinRoom}</button>
        </div>
      </div>
    `
    }
  `;

  const modal = createModal("partnerModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("partnerModal");

  if (savedRoom) {
    // Listen for partner's transactions
    try {
      _fbDB
        .ref("partner_rooms/" + savedRoom + "/transactions")
        .on("value", (snap) => {
          const data = snap.val();
          const txList = document.getElementById("sharedTxList");
          const statusEl = document.getElementById("partnerStatus");
          if (!data) return;
          const txs = Object.values(data)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
          if (statusEl) statusEl.textContent = lc.partnerJoined;
          if (txList)
            txList.innerHTML = txs
              .map(
                (tx) =>
                  `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--cream-border);font-size:13px;"><span>${esc(tx.category || "?")} ${tx.who ? `(${esc(tx.who)})` : ""}</span><span style="color:${tx.type === "income" ? "var(--income-color)" : "var(--expense-color)"};">${tx.type === "income" ? "+" : "-"}${fmt(tx.amountRub)}</span></div>`,
              )
              .join("");
        });
    } catch (e) {}

    document.getElementById("partnerLeave")?.addEventListener("click", () => {
      localStorage.removeItem("partnerRoomCode");
      closeModal("partnerModal");
      showToast(
        {
          ru: "Вы вышли из комнаты",
          en: "Left the room",
          ka: "ოთახიდან გამოხვედით",
        }[lang],
      );
    });
    document.getElementById("partnerAddTx")?.addEventListener("click", () => {
      closeModal("partnerModal");
      openAddModal();
    });
  } else {
    const genCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById("createRoomBtn")?.addEventListener("click", () => {
      const code = genCode();
      localStorage.setItem("partnerRoomCode", code);
      closeModal("partnerModal");
      openPartnerMode();
    });
    document.getElementById("joinRoomBtn")?.addEventListener("click", () => {
      const code = (document.getElementById("joinRoomInput")?.value || "")
        .trim()
        .toUpperCase();
      if (code.length < 4) {
        showToast(
          {
            ru: "Введите код комнаты",
            en: "Enter room code",
            ka: "ჩაწერეთ კოდი",
          }[lang],
          "error",
        );
        return;
      }
      localStorage.setItem("partnerRoomCode", code);
      closeModal("partnerModal");
      openPartnerMode();
    });
  }
}

// Wire partner mode to shared transactions save
const _origSaveAll = saveAll;
saveAll = function () {
  _origSaveAll();
  const roomCode = localStorage.getItem("partnerRoomCode");
  if (roomCode && _fbDB) {
    const prof = profiles.find((p) => p.id === activeProfileId);
    const txToShare = {};
    transactions.slice(0, 50).forEach((tx, i) => {
      const key = tx.id || "tx_" + i;
      txToShare[key.replace(/\./g, "_")] = { ...tx, who: prof?.name || "?" };
    });
    try {
      _fbDB.ref("partner_rooms/" + roomCode + "/transactions").set(txToShare);
    } catch (e) {}
  }
};

// Add partner button to new tools block
const _origInjectTools = injectNewToolButtons;
injectNewToolButtons = function () {
  _origInjectTools();
  const block = document.getElementById("newToolsBlock");
  if (!block || document.getElementById("partnerModeBtn")) return;
  const lang = currentLang;
  const btn = document.createElement("button");
  btn.className = "new-tool-btn";
  btn.id = "partnerModeBtn";
  btn.innerHTML = `<span class="ntb-icon">💑</span><span class="ntb-text"><span class="ntb-title">${{ ru: "Партнёрский режим", en: "Partner Mode", ka: "პარტნიორის რეჟიმი" }[lang]}</span><span class="ntb-sub">${{ ru: "Общий бюджет с партнёром в реальном времени", en: "Shared real-time budget with partner", ka: "საერთო ბიუჯეტი პარტნიორთან" }[lang]}</span></span><span class="ntb-arrow">›</span>`;
  btn.addEventListener("click", () => {
    haptic("medium");
    openPartnerMode();
  });
  block.appendChild(btn);

  // Also add goals button
  if (!document.getElementById("goalsToolBtn")) {
    const gb = document.createElement("button");
    gb.className = "new-tool-btn";
    gb.id = "goalsToolBtn";
    gb.innerHTML = `<span class="ntb-icon">🎯</span><span class="ntb-text"><span class="ntb-title">${{ ru: "Мои цели", en: "My Goals", ka: "ჩემი მიზნები" }[lang]}</span><span class="ntb-sub">${{ ru: "Откладывайте на мечты с прогресс-баром", en: "Save for dreams with progress bar", ka: "დაზოგეთ ოცნებებისთვის" }[lang]}</span></span><span class="ntb-arrow">›</span>`;
    gb.addEventListener("click", () => {
      haptic("medium");
      openGoalsModal();
    });
    block.appendChild(gb);
  }
};

// ██████████████████████████████████████████████████████████████
// 🎓 СИСТЕМА ПОДСКАЗОК И ИНТЕРАКТИВНЫЙ ГИД
// ██████████████████████████████████████████████████████████████

// ── Tooltip на долгое нажатие / ПКМ ──────────────────────────
const TOOLTIPS = {
  ru: {
    // Навигация
    home: {
      icon: "🏠",
      title: "Главная",
      text: "Здесь отображается ваш баланс, история операций и быстрая сводка доходов и расходов.",
    },
    stats: {
      icon: "📊",
      title: "Статистика",
      text: "Диаграммы расходов по категориям, тренды и прогноз на следующий месяц. Нажмите чтобы увидеть куда уходят деньги.",
    },
    tools: {
      icon: "🧮",
      title: "Инструменты",
      text: "Калькулятор, конвертер валют, сканер чеков, экспорт данных и другие полезные функции.",
    },
    notebook: {
      icon: "📔",
      title: "Блокнот",
      text: "Личные заметки и записи которые не связаны с операциями. Храните здесь что угодно.",
    },
    settings: {
      icon: "⚙️",
      title: "Настройки",
      text: "Управление профилями, темы оформления, валюта, напоминания, бюджеты и многое другое.",
    },
    // Кнопки шапки
    headerSupportBtn: {
      icon: "💬",
      title: "Поддержка",
      text: "Напишите создателю приложения. Задайте вопрос, сообщите об ошибке или оставьте отзыв.",
    },
    headerGuideBtn: {
      icon: "📖",
      title: "Обучение",
      text: "Пошаговый тур по приложению. Нажмите чтобы узнать как пользоваться всеми функциями.",
    },
    headerLangBtn: {
      icon: "🌐",
      title: "Язык",
      text: "Переключение между тремя языками: Русский 🇷🇺, English 🇬🇧, ქართული 🇬🇪.",
    },
    themeToggle: {
      icon: "🎨",
      title: "Тема",
      text: "Переключение между светлой и тёмной темой. Или включите автоматическую смену по времени суток в настройках.",
    },
    appLogoBtn: {
      icon: "🌿",
      title: "БюджетPRO",
      text: "Нажмите 4 раза чтобы войти в режим создателя (только для создателя приложения).",
    },
    // Карточки
    balanceCard: {
      icon: "💎",
      title: "Баланс",
      text: "Текущий баланс = начальная сумма + доходы − расходы. Нажмите чтобы фильтровать историю.",
    },
    incomeCard: {
      icon: "📈",
      title: "Доходы",
      text: "Сумма всех поступлений за выбранный период. Нажмите чтобы показать только доходы в истории.",
    },
    expenseCard: {
      icon: "📉",
      title: "Расходы",
      text: "Сумма всех трат за выбранный период. Нажмите чтобы показать только расходы в истории.",
    },
    salaryCard: {
      icon: "💼",
      title: "Начальная сумма",
      text: "Деньги с которых вы начали учёт (наличные, сбережения). Нажмите чтобы изменить.",
    },
    // FAB
    fabBtn: {
      icon: "➕",
      title: "Добавить операцию",
      text: "Главная кнопка приложения! Нажмите чтобы добавить расход или доход. Также можно свайпнуть снизу вверх.",
    },
    // Плавающие кнопки
    voiceInputBtn: {
      icon: "🎤",
      title: "Голосовой ввод",
      text: "Скажите «потратил 50 лари на продукты» — приложение само добавит расход. Работает в Chrome.",
    },
    goalsNavBtn: {
      icon: "🎯",
      title: "Мои цели",
      text: "Накопления на мечты с прогресс-баром. Добавьте цель, пополняйте её и получите конфетти при достижении!",
    },
  },
  en: {
    home: {
      icon: "🏠",
      title: "Home",
      text: "Shows your balance, transaction history, and a quick income/expense summary.",
    },
    stats: {
      icon: "📊",
      title: "Stats",
      text: "Expense charts by category, trends, and monthly forecast. See where your money goes.",
    },
    tools: {
      icon: "🧮",
      title: "Tools",
      text: "Calculator, currency converter, receipt scanner, data export and other useful features.",
    },
    notebook: {
      icon: "📔",
      title: "Notebook",
      text: "Personal notes not linked to transactions. Store anything you want here.",
    },
    settings: {
      icon: "⚙️",
      title: "Settings",
      text: "Manage profiles, themes, currency, reminders, budgets and more.",
    },
    headerSupportBtn: {
      icon: "💬",
      title: "Support",
      text: "Write to the app creator. Ask a question, report a bug, or leave feedback.",
    },
    headerGuideBtn: {
      icon: "📖",
      title: "Guide",
      text: "Step-by-step tour of the app. Learn how to use all features.",
    },
    headerLangBtn: {
      icon: "🌐",
      title: "Language",
      text: "Switch between three languages: Russian 🇷🇺, English 🇬🇧, Georgian 🇬🇪.",
    },
    themeToggle: {
      icon: "🎨",
      title: "Theme",
      text: "Switch between light and dark theme. Or enable automatic time-based switching in Settings.",
    },
    appLogoBtn: {
      icon: "🌿",
      title: "BudgetPRO",
      text: "Tap 4 times to enter creator mode (only for the app creator).",
    },
    balanceCard: {
      icon: "💎",
      title: "Balance",
      text: "Current balance = starting amount + income − expenses. Tap to filter history.",
    },
    incomeCard: {
      icon: "📈",
      title: "Income",
      text: "Total income for selected period. Tap to show only income in history.",
    },
    expenseCard: {
      icon: "📉",
      title: "Expenses",
      text: "Total expenses for selected period. Tap to show only expenses in history.",
    },
    salaryCard: {
      icon: "💼",
      title: "Starting amount",
      text: "Money you started tracking from (cash, savings). Tap to change.",
    },
    fabBtn: {
      icon: "➕",
      title: "Add transaction",
      text: "The main app button! Tap to add an expense or income. Or swipe up from the bottom.",
    },
    voiceInputBtn: {
      icon: "🎤",
      title: "Voice input",
      text: "Say 'spent 50 on groceries' — app adds it automatically. Works in Chrome.",
    },
    goalsNavBtn: {
      icon: "🎯",
      title: "My Goals",
      text: "Save for dreams with a progress bar. Add a goal, fund it, get confetti on completion!",
    },
  },
  ka: {
    home: {
      icon: "🏠",
      title: "მთავარი",
      text: "ბალანსი, ოპერაციების ისტორია და შემოსავლების/ხარჯების მოკლე სახე.",
    },
    stats: {
      icon: "📊",
      title: "სტატისტიკა",
      text: "ხარჯების დიაგრამები კატეგორიების მიხედვით, ტრენდები და პროგნოზი.",
    },
    tools: {
      icon: "🧮",
      title: "ხელსაწყოები",
      text: "კალკულატორი, ვალუტის კონვერტერი, ჩეკის სკანერი და სხვა.",
    },
    notebook: {
      icon: "📔",
      title: "ბლოკნოტი",
      text: "პირადი ჩანაწერები, რომლებიც ოპერაციებთან კავშირში არ არის. შეინახეთ აქ რაც გინდათ.",
    },
    settings: {
      icon: "⚙️",
      title: "პარამეტრები",
      text: "პროფილები, თემები, ვალუტა, შეხსენებები, ბიუჯეტები.",
    },
    headerSupportBtn: {
      icon: "💬",
      title: "მხარდაჭერა",
      text: "დაუკავშირდით შემქმნელს. შეკითხვა, შეცდომა ან შეფასება.",
    },
    headerGuideBtn: {
      icon: "📖",
      title: "სახელმძღვანელო",
      text: "ნაბიჯ-ნაბიჯ ტური პროგრამაში.",
    },
    headerLangBtn: {
      icon: "🌐",
      title: "ენა",
      text: "სამ ენას შორის გადართვა: რუსული, ინგლისური, ქართული.",
    },
    themeToggle: {
      icon: "🎨",
      title: "თემა",
      text: "მსუბუქი და ბნელი თემის გადართვა.",
    },
    appLogoBtn: {
      icon: "🌿",
      title: "BudgetPRO",
      text: "დააჭირეთ 4-ჯერ, რომ შემქმნელის რეჟიმში შეხვიდეთ.",
    },
    fabBtn: {
      icon: "➕",
      title: "ოპერაციის დამატება",
      text: "მთავარი ღილაკი! დააჭირეთ ხარჯის ან შემოსავლის დასამატებლად.",
    },
    balanceCard: {
      icon: "💎",
      title: "ბალანსი",
      text: "მიმდინარე ბალანსი = საწყისი + შემოსავლები − ხარჯები.",
    },
    incomeCard: {
      icon: "📈",
      title: "შემოსავლები",
      text: "არჩეული პერიოდის ყველა შემოსავლის ჯამი. დააჭირეთ, რომ ისტორიაში მხოლოდ შემოსავლები ნახოთ.",
    },
    expenseCard: {
      icon: "📉",
      title: "ხარჯები",
      text: "არჩეული პერიოდის ყველა ხარჯის ჯამი. დააჭირეთ, რომ ისტორიაში მხოლოდ ხარჯები ნახოთ.",
    },
    salaryCard: {
      icon: "💼",
      title: "საწყისი თანხა",
      text: "ფული, რომლითაც აღრიცხვა დაიწყეთ. დააჭირეთ შესაცვლელად.",
    },
    voiceInputBtn: {
      icon: "🎤",
      title: "ხმოვანი შეყვანა",
      text: "თქვით, მაგალითად, „50 ლარი პროდუქტებზე“ და აპი ჩანაწერს თვითონ შექმნის. მუშაობს Chrome-ში.",
    },
    goalsNavBtn: {
      icon: "🎯",
      title: "ჩემი მიზნები",
      text: "დაზოგეთ სურვილებისთვის პროგრესის ზოლით. დაამატეთ მიზანი, შეავსეთ და მიღწევისას კონფეტი მიიღეთ!",
    },
  },
};

function showTooltip(elementId) {
  const lang = currentLang;
  const tips = TOOLTIPS[lang] || TOOLTIPS.ru;
  const tip = tips[elementId];
  if (!tip) return;

  // Remove existing tooltip
  document.getElementById("appTooltip")?.remove();

  const el = document.getElementById(elementId);
  if (!el) return;
  const rect = el.getBoundingClientRect();

  const ov = document.createElement("div");
  ov.id = "appTooltip";
  ov.style.cssText =
    "position:fixed;inset:0;z-index:99998;display:flex;align-items:flex-end;padding:20px;pointer-events:none;";

  const box = document.createElement("div");
  box.style.cssText =
    "background:var(--card-bg);border-radius:20px;padding:18px 20px;box-shadow:0 -4px 40px rgba(0,0,0,0.2);border:1.5px solid var(--cream-border);max-width:360px;width:100%;margin:auto;pointer-events:auto;animation:slideUpBounce 0.3s cubic-bezier(0.34,1.3,0.64,1) both;";
  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <div style="font-size:28px;flex-shrink:0;">${tip.icon}</div>
      <div style="font-weight:900;font-size:17px;flex:1;">${tip.title}</div>
      <button id="ttClose" style="background:var(--cream-dark);border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✕</button>
    </div>
    <div style="font-size:14px;line-height:1.65;color:var(--text-soft);">${tip.text}</div>
  `;

  ov.appendChild(box);
  document.body.appendChild(ov);

  box.querySelector("#ttClose").addEventListener("click", () => ov.remove());
  ov.addEventListener("click", (e) => {
    if (e.target === ov) ov.remove();
  });
  // Auto-close
  setTimeout(() => ov?.remove(), 6000);
}

function initTooltips() {
  const tooltipIds = Object.keys(TOOLTIPS.ru);
  tooltipIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    let pressTimer = null;
    // Long press on mobile
    el.addEventListener(
      "touchstart",
      (e) => {
        pressTimer = setTimeout(() => {
          e.preventDefault();
          showTooltip(id);
          haptic("medium");
        }, 600);
      },
      { passive: true },
    );
    el.addEventListener("touchend", () => clearTimeout(pressTimer));
    el.addEventListener("touchmove", () => clearTimeout(pressTimer));
    // Right-click on desktop
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showTooltip(id);
    });
  });

  // Add ? badges to nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const map = {
      home: "home",
      stats: "stats",
      tools: "tools",
      notebook: "notebook",
      settings: "settings",
    };
    const id = Object.keys(map).find(
      (k) => btn.dataset.tab === k || btn.id === k + "Btn",
    );
    if (!id) return;
    let pressTimer2 = null;
    btn.addEventListener(
      "touchstart",
      () => {
        pressTimer2 = setTimeout(() => showTooltip(id), 600);
      },
      { passive: true },
    );
    btn.addEventListener("touchend", () => clearTimeout(pressTimer2));
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showTooltip(id);
    });
  });
}
setTimeout(initTooltips, 1000);

// ══════════════════════════════════════════════════════════════
// 📚 ИНТЕРАКТИВНЫЙ ГИД — пошаговое обучение
// ══════════════════════════════════════════════════════════════
const GUIDE_TOPICS = {
  ru: [
    // ── ОСНОВЫ ───────────────────────────────────────────────────
    {
      id: "basics",
      icon: "🏠",
      title: "Основы приложения",
      steps: [
        {
          emoji: "👋",
          title: "Добро пожаловать!",
          nav: "home",
          text: "БюджетPRO — личный финансовый трекер. Помогает видеть куда уходят деньги и планировать бюджет. Давайте пройдёмся по всем функциям!",
        },
        {
          emoji: "💼",
          title: "Начальная сумма",
          nav: "home",
          action: "salaryCard",
          text: "Карточка «Нач. сумма» — введите сколько денег у вас есть сейчас (наличные + карта). Нажмите на неё чтобы изменить.",
        },
        {
          emoji: "💎",
          title: "Мой баланс",
          nav: "home",
          action: "balanceCard",
          text: "Карточка «Мой баланс» = начальная сумма + доходы − расходы. Обновляется автоматически после каждой операции.",
        },
        {
          emoji: "📋",
          title: "Карточки доходов и расходов",
          nav: "home",
          action: "incomeCard",
          text: "Карточки «Доходы» и «Расходы» показывают суммы за текущий период. Нажмите чтобы отфильтровать операции.",
        },
        {
          emoji: "📜",
          title: "История операций",
          nav: "home",
          scrollTo: ".ops-list",
          text: "Список всех ваших расходов и доходов. Нажмите на запись чтобы редактировать. Потяните влево чтобы удалить.",
        },
        {
          emoji: "➕",
          title: "Кнопка добавить (+)",
          nav: "home",
          action: "fabBtn",
          text: "Кнопка «+» добавляет новую операцию. Она закреплена над навигационной панелью — посмотрите в центр нижней части экрана.",
        },
      ],
    },
    // ── СТАТИСТИКА ────────────────────────────────────────────────
    {
      id: "stats",
      icon: "📊",
      title: "Статистика",
      steps: [
        {
          emoji: "📊",
          title: "Сводка месяца",
          nav: "stats",
          scrollTo: ".stat-status-card",
          text: "Статус месяца — в плюсе или в минусе, и насколько. Меняется цвет в зависимости от результата.",
        },
        {
          emoji: "🔢",
          title: "Ключевые показатели",
          nav: "stats",
          scrollTo: ".stat-kpi-grid",
          text: "Четыре числа: баланс, начальная сумма, доходы и расходы. Быстрый срез за выбранный период.",
        },
        {
          emoji: "🍩",
          title: "Диаграмма расходов",
          nav: "stats",
          scrollTo: ".stat-donut-card",
          text: "Круговая диаграмма — насколько расходы составляют от доходов. Чем меньше сектор, тем лучше.",
        },
        {
          emoji: "📅",
          title: "Переключение периода",
          nav: "stats",
          scrollTo: ".stats-period-btns",
          text: "Кнопки Неделя / Месяц / Год — переключают период для всей статистики на странице.",
        },
        {
          emoji: "📉",
          title: "Динамика по месяцам",
          nav: "stats",
          scrollTo: ".stat-chart-card",
          text: "Столбчатый график — доходы и расходы по месяцам. Видно как меняется финансовая картина.",
        },
        {
          emoji: "🥧",
          title: "Круговая по категориям",
          nav: "stats",
          scrollTo: ".pie-chart-card",
          text: "Диаграмма расходов по категориям — видно на что уходит больше всего денег.",
        },
        {
          emoji: "🏆",
          title: "Топ категорий",
          nav: "stats",
          scrollTo: ".stat-cats-card",
          text: "Рейтинг категорий с прогресс-барами. Быстро видно топ трат.",
        },
        {
          emoji: "🌡️",
          title: "Тепловая карта",
          nav: "stats",
          scrollTo: ".stat-heatmap-card",
          text: "Тепловая карта активности по дням — в какие дни вы тратили больше всего.",
        },
        {
          emoji: "💡",
          title: "Финансовые советы",
          nav: "stats",
          scrollTo: ".stat-tips-card",
          text: "Автоматические советы на основе анализа ваших трат. Обновляются каждую неделю.",
        },
      ],
    },
    // ── БЮДЖЕТЫ ──────────────────────────────────────────────────
    {
      id: "budget",
      icon: "🎯",
      title: "Бюджеты и лимиты",
      steps: [
        {
          emoji: "🎯",
          title: "Что такое бюджет?",
          nav: "settings",
          action: "budgetsBody",
          text: "Бюджет — ежемесячный лимит на категорию. Например «Рестораны — не более 200₾». Приложение предупреждает при превышении 80%.",
        },
        {
          emoji: "➕",
          title: "Добавить лимит",
          nav: "settings",
          action: "addBudgetBtn",
          text: "Нажмите «+ Добавить бюджет» — выберите категорию и введите лимит в месяц. Можно настроить любое количество категорий.",
        },
      ],
    },
    // ── НАПОМИНАНИЯ ──────────────────────────────────────────────
    {
      id: "reminders",
      icon: "🔔",
      title: "Напоминания",
      steps: [
        {
          emoji: "🔔",
          title: "Включить уведомления",
          nav: "settings",
          action: "notifEnableBtn",
          text: "Нажмите эту кнопку — браузер запросит разрешение. Обязательно нажмите «Разрешить» в диалоге!",
        },
        {
          emoji: "🧪",
          title: "Проверить уведомления",
          nav: "settings",
          action: "testNotifBtn",
          text: "Кнопка «Тест» — сразу отправляет тестовое уведомление. Убедитесь что они работают на вашем устройстве.",
        },
        {
          emoji: "📝",
          title: "Название напоминания",
          nav: "settings",
          action: "newReminderName",
          text: "Введите что нужно сделать — например «Записать расходы» или «Оплатить аренду».",
        },
        {
          emoji: "📅",
          title: "Дата и время",
          nav: "settings",
          action: "newReminderDatetime",
          text: "Выберите точный момент — нажмите на поле даты и времени. Можно выбрать сегодняшнюю дату для проверки.",
        },
        {
          emoji: "⏰",
          title: "Запланировать",
          nav: "settings",
          action: "addNamedReminderBtn",
          text: "Нажмите «Запланировать» — напоминание сохранится. Придёт в выбранное время даже если вы закрыли приложение.",
        },
        {
          emoji: "🔁",
          title: "Повторяющиеся напоминания",
          nav: "settings",
          scrollTo: ".reminder-interval-checkbox",
          text: "Отметьте галочкой интервал — каждый час, раз в день, раз в неделю. Такие напоминания приходят регулярно.",
        },
      ],
    },
    // ── ПРОФИЛИ ──────────────────────────────────────────────────
    {
      id: "profiles",
      icon: "👥",
      title: "Профили",
      steps: [
        {
          emoji: "👥",
          title: "Раздел Профили",
          nav: "settings",
          action: "profilesBody",
          text: "Несколько профилей — для разных людей или кошельков. У каждого свои операции, бюджеты и настройки.",
        },
        {
          emoji: "➕",
          title: "Добавить профиль",
          nav: "settings",
          action: "addProfileBtn",
          text: "Нажмите «Добавить профиль» — введите имя и выберите цвет. Переключайтесь между профилями в любое время.",
        },
      ],
    },
    // ── ЦЕЛИ ────────────────────────────────────────────────────
    {
      id: "goals",
      icon: "🌟",
      title: "Цели и мечты",
      steps: [
        {
          emoji: "🌟",
          title: "Кнопка целей 🎯",
          nav: "home",
          action: "goalsNavBtn",
          text: "Кнопка 🎯 слева внизу открывает ваши цели. Она появляется через секунду после загрузки. Если не видно — включите в Настройках → плавающие кнопки.",
        },
        {
          emoji: "➕",
          title: "Создать цель",
          nav: "home",
          action: "goalsNavBtn",
          text: "В окне целей нажмите «+ Добавить цель» — введите название, выберите иконку, укажите целевую сумму и сколько уже накоплено.",
        },
        {
          emoji: "💰",
          title: "Пополнить накопления",
          nav: "home",
          action: "goalsNavBtn",
          text: "Кнопка «💰 Пополнить» добавляет сумму к цели. Кнопка «−» убирает лишнее. Прогресс-бар обновляется сразу.",
        },
      ],
    },
    // ── ИНСТРУМЕНТЫ ──────────────────────────────────────────────
    {
      id: "tools",
      icon: "🛠️",
      title: "Инструменты",
      steps: [
        {
          emoji: "🧮",
          title: "Калькулятор",
          nav: "tools",
          action: "calcDisplay",
          text: "Встроенный калькулятор — считайте прямо в приложении. История вычислений сохраняется.",
        },
        {
          emoji: "💱",
          title: "Конвертер валют",
          nav: "tools",
          action: "convAmount",
          text: "Конвертируйте суммы между валютами — курсы обновляются автоматически.",
        },
        {
          emoji: "📦",
          title: "Другие инструменты",
          nav: "tools",
          scrollTo: ".tool-card",
          text: "Прокрутите вниз — здесь также экспорт данных, интеграции с Google Таблицами и другие функции.",
        },
      ],
    },
  ],
  en: [
    {
      id: "basics",
      icon: "🏠",
      title: "App basics",
      steps: [
        {
          emoji: "👋",
          title: "Welcome!",
          nav: "home",
          text: "BudgetPRO is a personal finance tracker. It helps you see where money goes and plan your budget. Let's walk through the main features.",
        },
        {
          emoji: "💼",
          title: "Starting amount",
          nav: "home",
          action: "salaryCard",
          text: "The starting amount card stores how much money you have right now. Tap it to change the value.",
        },
        {
          emoji: "💎",
          title: "My balance",
          nav: "home",
          action: "balanceCard",
          text: "Balance = starting amount + income − expenses. It updates automatically after every transaction.",
        },
        {
          emoji: "📋",
          title: "Income and expense cards",
          nav: "home",
          action: "incomeCard",
          text: "These cards show totals for the current period. Tap them to filter the transaction list.",
        },
        {
          emoji: "📜",
          title: "Transaction history",
          nav: "home",
          scrollTo: ".ops-list",
          text: "Here you see all expenses and income. Tap an item to edit it, or swipe left to delete.",
        },
        {
          emoji: "➕",
          title: "Add button (+)",
          nav: "home",
          action: "fabBtn",
          text: "This is the main action button. Tap it to add an expense or income. You can also swipe up from the bottom.",
        },
      ],
    },
    {
      id: "stats",
      icon: "📊",
      title: "Statistics",
      steps: [
        {
          emoji: "📊",
          title: "Monthly summary",
          nav: "stats",
          scrollTo: ".stat-status-card",
          text: "This card shows whether the month is positive or negative and changes color depending on the result.",
        },
        {
          emoji: "🔢",
          title: "Key metrics",
          nav: "stats",
          scrollTo: ".stat-kpi-grid",
          text: "A quick snapshot of balance, starting amount, income, and expenses for the selected period.",
        },
        {
          emoji: "🍩",
          title: "Expense ratio",
          nav: "stats",
          scrollTo: ".stat-donut-card",
          text: "The donut chart shows how large expenses are relative to income. Smaller is usually better.",
        },
        {
          emoji: "📅",
          title: "Period switch",
          nav: "stats",
          scrollTo: ".stats-period-btns",
          text: "Week / Month / Year switches the time range for the whole statistics page.",
        },
        {
          emoji: "📉",
          title: "Monthly trend",
          nav: "stats",
          scrollTo: ".stat-chart-card",
          text: "Bar charts compare income and expenses by month so you can see how your financial picture changes.",
        },
        {
          emoji: "🥧",
          title: "Category pie",
          nav: "stats",
          scrollTo: ".pie-chart-card",
          text: "This chart shows which categories take the biggest share of your spending.",
        },
        {
          emoji: "🏆",
          title: "Top categories",
          nav: "stats",
          scrollTo: ".stat-cats-card",
          text: "A ranking of categories with progress bars so you can instantly spot the biggest expenses.",
        },
        {
          emoji: "🌡️",
          title: "Heat map",
          nav: "stats",
          scrollTo: ".stat-heatmap-card",
          text: "The heat map shows on which days you were most financially active.",
        },
        {
          emoji: "💡",
          title: "Financial tips",
          nav: "stats",
          scrollTo: ".stat-tips-card",
          text: "Automatic tips based on spending analysis. They refresh every week.",
        },
      ],
    },
    {
      id: "budget",
      icon: "🎯",
      title: "Budgets and limits",
      steps: [
        {
          emoji: "🎯",
          title: "What is a budget?",
          nav: "settings",
          action: "budgetsBody",
          text: "A budget is a monthly limit for a category, for example Restaurants up to 200 GEL. The app warns you after 80%.",
        },
        {
          emoji: "➕",
          title: "Add a limit",
          nav: "settings",
          action: "addBudgetBtn",
          text: "Tap Add budget, choose a category, and set a monthly limit. You can do this for as many categories as you want.",
        },
      ],
    },
    {
      id: "reminders",
      icon: "🔔",
      title: "Reminders",
      steps: [
        {
          emoji: "🔔",
          title: "Enable notifications",
          nav: "settings",
          action: "notifEnableBtn",
          text: "Tap this button and let the browser request permission. Make sure to choose Allow.",
        },
        {
          emoji: "🧪",
          title: "Test notifications",
          nav: "settings",
          action: "testNotifBtn",
          text: "The test button sends a sample notification right away so you can confirm it works on your device.",
        },
        {
          emoji: "📝",
          title: "Reminder name",
          nav: "settings",
          action: "newReminderName",
          text: "Enter what should be done, for example Record expenses or Pay rent.",
        },
        {
          emoji: "📅",
          title: "Date and time",
          nav: "settings",
          action: "newReminderDatetime",
          text: "Choose the exact moment when the reminder should fire. You can even set today's date for testing.",
        },
        {
          emoji: "⏰",
          title: "Schedule it",
          nav: "settings",
          action: "addNamedReminderBtn",
          text: "Tap Schedule and the reminder will be saved. It can arrive even if the app is closed.",
        },
        {
          emoji: "🔁",
          title: "Recurring reminders",
          nav: "settings",
          scrollTo: ".reminder-interval-checkbox",
          text: "Enable an interval like hourly, daily, or weekly to receive repeated reminders automatically.",
        },
      ],
    },
    {
      id: "profiles",
      icon: "👥",
      title: "Profiles",
      steps: [
        {
          emoji: "👥",
          title: "Profiles section",
          nav: "settings",
          action: "profilesBody",
          text: "Use multiple profiles for different people or wallets. Each profile has its own transactions, budgets, and settings.",
        },
        {
          emoji: "➕",
          title: "Add profile",
          nav: "settings",
          action: "addProfileBtn",
          text: "Tap Add profile, enter a name, choose a color, and switch between profiles whenever you need.",
        },
      ],
    },
    {
      id: "goals",
      icon: "🌟",
      title: "Goals and dreams",
      steps: [
        {
          emoji: "🌟",
          title: "Goals button 🎯",
          nav: "home",
          action: "goalsNavBtn",
          text: "The goals button opens your savings goals. It appears a moment after load. If you do not see it, enable floating buttons in Settings.",
        },
        {
          emoji: "➕",
          title: "Create a goal",
          nav: "home",
          action: "goalsNavBtn",
          text: "Inside the goals window tap Add goal, enter a name, choose an icon, set the target amount, and how much is already saved.",
        },
        {
          emoji: "💰",
          title: "Add savings",
          nav: "home",
          action: "goalsNavBtn",
          text: "The money button adds savings to a goal, and the minus button subtracts some if needed. The progress bar updates instantly.",
        },
      ],
    },
    {
      id: "tools",
      icon: "🛠️",
      title: "Tools",
      steps: [
        {
          emoji: "🧮",
          title: "Calculator",
          nav: "tools",
          action: "calcDisplay",
          text: "Use the built-in calculator directly in the app. Your calculation history is saved.",
        },
        {
          emoji: "💱",
          title: "Currency converter",
          nav: "tools",
          action: "convAmount",
          text: "Convert sums between currencies with automatically updated exchange rates.",
        },
        {
          emoji: "📦",
          title: "More tools",
          nav: "tools",
          scrollTo: ".tool-card",
          text: "Scroll down for more features like export, Google Sheets integration, and other utilities.",
        },
      ],
    },
  ],
  ka: [
    {
      id: "basics",
      icon: "🏠",
      title: "აპის საფუძვლები",
      steps: [
        {
          emoji: "👋",
          title: "მოგესალმებით!",
          nav: "home",
          text: "BudgetPRO პირადი ფინანსების ტრეკერია. ის გეხმარებათ დაინახოთ, სად მიდის ფული და როგორ დაგეგმოთ ბიუჯეტი. მოდი, მთავარ ფუნქციებს ერთად გადავხედოთ.",
        },
        {
          emoji: "💼",
          title: "საწყისი თანხა",
          nav: "home",
          action: "salaryCard",
          text: "აქ ინახება ის თანხა, რაც ახლა გაქვთ. დააჭირეთ ბარათს, თუ მნიშვნელობის შეცვლა გსურთ.",
        },
        {
          emoji: "💎",
          title: "ჩემი ბალანსი",
          nav: "home",
          action: "balanceCard",
          text: "ბალანსი = საწყისი თანხა + შემოსავლები − ხარჯები. ყოველი ახალი ოპერაციის შემდეგ ავტომატურად ახლდება.",
        },
        {
          emoji: "📋",
          title: "შემოსავლის და ხარჯის ბარათები",
          nav: "home",
          action: "incomeCard",
          text: "ეს ბარათები აჩვენებს მიმდინარე პერიოდის ჯამებს. დააჭირეთ, რომ ოპერაციების სია გაფილტროთ.",
        },
        {
          emoji: "📜",
          title: "ოპერაციების ისტორია",
          nav: "home",
          scrollTo: ".ops-list",
          text: "აქ ჩანს ყველა თქვენი შემოსავალი და ხარჯი. ჩანაწერზე დაჭერა რედაქტირებისთვისაა, მარცხნივ გასმა კი წაშლისთვის.",
        },
        {
          emoji: "➕",
          title: "დამატების ღილაკი (+)",
          nav: "home",
          action: "fabBtn",
          text: "ეს არის მთავარი მოქმედების ღილაკი. დააჭირეთ ხარჯის ან შემოსავლის დასამატებლად. ასევე შეგიძლიათ ქვემოდან ზემოთ ასვაიფოთ.",
        },
      ],
    },
    {
      id: "stats",
      icon: "📊",
      title: "სტატისტიკა",
      steps: [
        {
          emoji: "📊",
          title: "თვიური შეჯამება",
          nav: "stats",
          scrollTo: ".stat-status-card",
          text: "ეს ბარათი გაჩვენებთ, თვე პლუსშია თუ მინუსში, და ფერს შედეგის მიხედვით ცვლის.",
        },
        {
          emoji: "🔢",
          title: "მთავარი მაჩვენებლები",
          nav: "stats",
          scrollTo: ".stat-kpi-grid",
          text: "სწრაფი სურათი: ბალანსი, საწყისი თანხა, შემოსავლები და ხარჯები არჩეული პერიოდისთვის.",
        },
        {
          emoji: "🍩",
          title: "ხარჯების წილი",
          nav: "stats",
          scrollTo: ".stat-donut-card",
          text: "დონატის დიაგრამა აჩვენებს, რამდენად დიდია ხარჯები შემოსავლებთან შედარებით.",
        },
        {
          emoji: "📅",
          title: "პერიოდის გადართვა",
          nav: "stats",
          scrollTo: ".stats-period-btns",
          text: "კვირა / თვე / წელი ცვლის დროის შუალედს სტატისტიკის მთელ გვერდზე.",
        },
        {
          emoji: "📉",
          title: "თვეების დინამიკა",
          nav: "stats",
          scrollTo: ".stat-chart-card",
          text: "სვეტოვანი გრაფიკი გაჩვენებთ, როგორ იცვლებოდა შემოსავლები და ხარჯები თვეების მიხედვით.",
        },
        {
          emoji: "🥧",
          title: "კატეგორიების დიაგრამა",
          nav: "stats",
          scrollTo: ".pie-chart-card",
          text: "აქ ჩანს, რომელი კატეგორიები იკავებს თქვენი ხარჯების ყველაზე დიდ ნაწილს.",
        },
        {
          emoji: "🏆",
          title: "ტოპ კატეგორიები",
          nav: "stats",
          scrollTo: ".stat-cats-card",
          text: "კატეგორიების რეიტინგი პროგრეს-ბარებით, რომ სწრაფად დაინახოთ ყველაზე დიდი ხარჯები.",
        },
        {
          emoji: "🌡️",
          title: "აქტივობის რუკა",
          nav: "stats",
          scrollTo: ".stat-heatmap-card",
          text: "ეს რუკა აჩვენებს, რომელ დღეებში იყავით ყველაზე აქტიური ფინანსურად.",
        },
        {
          emoji: "💡",
          title: "ფინანსური რჩევები",
          nav: "stats",
          scrollTo: ".stat-tips-card",
          text: "ავტომატური რჩევები თქვენი ხარჯების ანალიზის მიხედვით. ისინი ყოველ კვირას ახლდება.",
        },
      ],
    },
    {
      id: "budget",
      icon: "🎯",
      title: "ბიუჯეტები და ლიმიტები",
      steps: [
        {
          emoji: "🎯",
          title: "რა არის ბიუჯეტი?",
          nav: "settings",
          action: "budgetsBody",
          text: "ბიუჯეტი არის კატეგორიის თვიური ზღვარი, მაგალითად რესტორნები მაქსიმუმ 200 GEL. აპი 80%-ის შემდეგ გაფრთხილებთ.",
        },
        {
          emoji: "➕",
          title: "ლიმიტის დამატება",
          nav: "settings",
          action: "addBudgetBtn",
          text: "დააჭირეთ ბიუჯეტის დამატებას, აირჩიეთ კატეგორია და მიუთითეთ თვიური ზღვარი. კატეგორიების რაოდენობა შეზღუდული არ არის.",
        },
      ],
    },
    {
      id: "reminders",
      icon: "🔔",
      title: "შეხსენებები",
      steps: [
        {
          emoji: "🔔",
          title: "შეტყობინებების ჩართვა",
          nav: "settings",
          action: "notifEnableBtn",
          text: "დააჭირეთ ამ ღილაკს და ბრაუზერს ნებართვის მოთხოვნის საშუალება მიეცით. აუცილებლად აირჩიეთ Allow.",
        },
        {
          emoji: "🧪",
          title: "ტესტის გაშვება",
          nav: "settings",
          action: "testNotifBtn",
          text: "ტესტის ღილაკი მაშინვე აგზავნის სატესტო შეტყობინებას, რომ შეამოწმოთ მუშაობს თუ არა თქვენს მოწყობილობაზე.",
        },
        {
          emoji: "📝",
          title: "შეხსენების სახელი",
          nav: "settings",
          action: "newReminderName",
          text: "ჩაწერეთ რა უნდა გაკეთდეს, მაგალითად ხარჯების ჩაწერა ან ქირის გადახდა.",
        },
        {
          emoji: "📅",
          title: "თარიღი და დრო",
          nav: "settings",
          action: "newReminderDatetime",
          text: "აირჩიეთ ზუსტი დრო, როდის უნდა მოვიდეს შეხსენება. ტესტისთვის დღევანდელი დღეც შეგიძლიათ მიუთითოთ.",
        },
        {
          emoji: "⏰",
          title: "დაგეგმვა",
          nav: "settings",
          action: "addNamedReminderBtn",
          text: "დააჭირეთ დაგეგმვას და შეხსენება შეინახება. ის შეიძლება მაშინაც მოვიდეს, როცა აპი დახურულია.",
        },
        {
          emoji: "🔁",
          title: "განმეორებადი შეხსენებები",
          nav: "settings",
          scrollTo: ".reminder-interval-checkbox",
          text: "ჩართეთ ინტერვალი, როგორიცაა საათობრივი, ყოველდღიური ან ყოველკვირეული, რომ შეხსენება რეგულარულად მოვიდეს.",
        },
      ],
    },
    {
      id: "profiles",
      icon: "👥",
      title: "პროფილები",
      steps: [
        {
          emoji: "👥",
          title: "პროფილების განყოფილება",
          nav: "settings",
          action: "profilesBody",
          text: "რამდენიმე პროფილი გამოგადგებათ სხვადასხვა ადამიანისთვის ან საფულისთვის. თითოეულს საკუთარი ოპერაციები, ბიუჯეტები და პარამეტრები აქვს.",
        },
        {
          emoji: "➕",
          title: "პროფილის დამატება",
          nav: "settings",
          action: "addProfileBtn",
          text: "დააჭირეთ პროფილის დამატებას, შეიყვანეთ სახელი, აირჩიეთ ფერი და პროფილებს შორის თავისუფლად გადაერთეთ.",
        },
      ],
    },
    {
      id: "goals",
      icon: "🌟",
      title: "მიზნები და ოცნებები",
      steps: [
        {
          emoji: "🌟",
          title: "მიზნების ღილაკი 🎯",
          nav: "home",
          action: "goalsNavBtn",
          text: "მიზნების ღილაკი ხსნის თქვენს დაგროვების მიზნებს. ის ჩატვირთვიდან ცოტა ხანში ჩნდება. თუ ვერ ხედავთ, ჩართეთ მცურავი ღილაკები პარამეტრებში.",
        },
        {
          emoji: "➕",
          title: "მიზნის შექმნა",
          nav: "home",
          action: "goalsNavBtn",
          text: "მიზნების ფანჯარაში დააჭირეთ მიზნის დამატებას, შეიყვანეთ სახელი, აირჩიეთ ხატულა, მიუთითეთ სამიზნე თანხა და უკვე დაგროვილი თანხა.",
        },
        {
          emoji: "💰",
          title: "დანაზოგის დამატება",
          nav: "home",
          action: "goalsNavBtn",
          text: "ფულის ღილაკი თანხას ამატებს მიზანს, ხოლო მინუსი საჭიროების შემთხვევაში აკლებს. პროგრესის ზოლი მაშინვე ახლდება.",
        },
      ],
    },
    {
      id: "tools",
      icon: "🛠️",
      title: "ხელსაწყოები",
      steps: [
        {
          emoji: "🧮",
          title: "კალკულატორი",
          nav: "tools",
          action: "calcDisplay",
          text: "ჩაშენებული კალკულატორი პირდაპირ აპში. გამოთვლების ისტორია ინახება.",
        },
        {
          emoji: "💱",
          title: "ვალუტის კონვერტერი",
          nav: "tools",
          action: "convAmount",
          text: "გადააყვანეთ თანხები სხვადასხვა ვალუტას შორის ავტომატურად განახლებული კურსებით.",
        },
        {
          emoji: "📦",
          title: "სხვა ხელსაწყოები",
          nav: "tools",
          scrollTo: ".tool-card",
          text: "ქვევით ჩასქროლეთ ექსპორტის, Google Sheets ინტეგრაციის და სხვა სასარგებლო ფუნქციებისთვის.",
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════
// INTERACTIVE GUIDE v2 — fully rebuilt
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// INTERACTIVE GUIDE — полная замена
// Принцип: переключает вкладку → скроллит к элементу → подсвечивает outline
// Нет CSS-анимаций на карточке (не ломают JS transform)
// ════════════════════════════════════════════════════════════════
function openInteractiveGuide() {
  const lang = currentLang;
  const topics = GUIDE_TOPICS[lang] || GUIDE_TOPICS.ru;
  let topicIdx = null,
    stepIdx = 0,
    hlEl = null;

  // ── Styles ───────────────────────────────────────────────────
  const styleEl = document.createElement("style");
  styleEl.id = "gCSS";
  styleEl.textContent = `
    #gCard {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9100;
      background: var(--card-bg);
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -6px 32px rgba(0,0,0,.28);
      display: flex; flex-direction: column; max-height: 50vh;
      transform: translateY(100%); transition: transform .3s ease;
    }
    #gCard.gOpen { transform: translateY(0); }
    @keyframes gPulse {
      0%,100% { outline-color: #f59e0b; outline-offset: 4px; }
      50%      { outline-color: #fbbf24; outline-offset: 8px; }
    }
    .gHL {
      outline: 3px solid #f59e0b !important;
      outline-offset: 4px !important;
      z-index: 8990;
      animation: gPulse 1.4s ease-in-out infinite;
    }
  `;
  document.head.appendChild(styleEl);

  // ── Card element ──────────────────────────────────────────────
  const card = document.createElement("div");
  card.id = "gCard";
  document.body.appendChild(card);
  setTimeout(() => card.classList.add("gOpen"), 30);

  // ── Close ─────────────────────────────────────────────────────
  function close() {
    removeHL();
    card.classList.remove("gOpen");
    setTimeout(() => {
      card.remove();
      styleEl.remove();
    }, 320);
  }

  // ── Highlight ─────────────────────────────────────────────────
  function setHL(el) {
    removeHL();
    if (!el) return;
    hlEl = el;
    // Use a separate overlay ring so overflow:hidden on parent doesn't clip it
    const r = el.getBoundingClientRect();
    const pad = 6;
    const ring = document.createElement("div");
    ring.id = "gHLRing";
    ring.style.cssText = [
      "position:fixed;pointer-events:none;",
      "z-index:9090;border-radius:14px;",
      `left:${r.left - pad}px;top:${r.top - pad}px;`,
      `width:${r.width + pad * 2}px;height:${r.height + pad * 2}px;`,
      "border:3px solid #f59e0b;",
      "box-shadow:0 0 0 4px rgba(245,158,11,.2),0 0 20px 4px rgba(245,158,11,.15);",
      "animation:gPulse 1.4s ease-in-out infinite;",
    ].join("");
    document.body.appendChild(ring);
    // Update position on scroll
    const updatePos = () => {
      if (!document.getElementById("gHLRing")) return;
      const r2 = el.getBoundingClientRect();
      ring.style.left = r2.left - pad + "px";
      ring.style.top = r2.top - pad + "px";
      ring.style.width = r2.width + pad * 2 + "px";
      ring.style.height = r2.height + pad * 2 + "px";
    };
    window.addEventListener("scroll", updatePos, { passive: true });
    ring._removeScroll = () => window.removeEventListener("scroll", updatePos);
  }

  function removeHL() {
    if (hlEl) {
      hlEl.classList.remove("gHL");
      hlEl = null;
    }
    const ring = document.getElementById("gHLRing");
    if (ring) {
      ring._removeScroll?.();
      ring.remove();
    }
  }

  // ── Find target element ───────────────────────────────────────
  function findTarget(step) {
    if (step.action) {
      const e = document.getElementById(step.action);
      if (e) return e;
      // Try dynamic floating buttons
      if (step.action === "goalsNavBtn") {
        try {
          addGoalsNavButton();
        } catch (e) {}
      }
      if (step.action === "voiceInputBtn") {
        try {
          addVoiceButton();
        } catch (e) {}
      }
      const e2 = document.getElementById(step.action);
      if (e2) return e2;
    }
    if (step.scroll) {
      const e = document.getElementById(step.scroll);
      if (e) return e;
    }
    if (step.scrollTo) {
      const e = document.querySelector(step.scrollTo);
      if (e) return e;
    }
    return null;
  }

  // ── Scroll element into center of screen (above guide card) ────
  function scrollToEl(el) {
    if (!el) return;
    const cardH = (card.offsetHeight || 240) + 24;
    const viewH = window.innerHeight - cardH;
    const r = el.getBoundingClientRect();
    // Absolute position of element center
    const absCenter = window.scrollY + r.top + r.height / 2;
    // We want element center to be at viewH/2
    const targetScrollY = absCenter - viewH / 2;
    window.scrollTo({ top: Math.max(0, targetScrollY), behavior: "smooth" });
  }

  // ── Run a step ────────────────────────────────────────────────
  function runStep() {
    renderCard();
    removeHL();

    const step = topics[topicIdx].steps[stepIdx];

    function activate() {
      let tries = 0;
      function attempt() {
        const el = findTarget(step);
        if (el) {
          // For fixed-position elements (fab, nav buttons): shrink card so they're visible
          const style = window.getComputedStyle(el);
          const isFixed = style.position === "fixed";
          if (isFixed) {
            // Shrink guide card to top so fixed elements at bottom are visible
            card.style.maxHeight = "32vh";
            setTimeout(() => {
              card.style.maxHeight = "";
            }, 4000);
          } else {
            scrollToEl(el);
          }
          setTimeout(() => setHL(findTarget(step)), isFixed ? 100 : 700);
        } else if (++tries < 8) {
          setTimeout(attempt, 200);
        }
      }
      attempt();
    }

    if (step.nav && step.nav !== currentTab) {
      setTab(step.nav, () => setTimeout(activate, 400));
    } else {
      activate();
    }
  }

  // ── Render step card ──────────────────────────────────────────
  function renderCard() {
    const topic = topics[topicIdx];
    const step = topic.steps[stepIdx];
    const isLast = stepIdx === topic.steps.length - 1;
    const pct = Math.round(((stepIdx + 1) / topic.steps.length) * 100);
    const LL = {
      ru: {
        back: "← Темы",
        prev: "←",
        next: "Далее →",
        done: "Готово ✓",
        of: "/",
      },
      en: {
        back: "← Topics",
        prev: "←",
        next: "Next →",
        done: "Done ✓",
        of: "/",
      },
      ka: {
        back: "← თემები",
        prev: "←",
        next: "შემდეგი →",
        done: "მზადაა ✓",
        of: "/",
      },
    }[lang] || { back: "←", prev: "←", next: "Next →", done: "Done", of: "/" };

    card.innerHTML = `
      <div style="flex-shrink:0;padding:10px 16px 0;">
        <div style="width:36px;height:4px;background:var(--cream-border);border-radius:99px;margin:0 auto 10px;"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <button id="gBackBtn" style="background:none;border:none;font-size:12px;font-weight:700;
            color:var(--primary);cursor:pointer;padding:4px 0;">${LL.back}</button>
          <span style="font-size:11px;font-weight:700;color:var(--text-muted);">
            ${topic.icon} ${stepIdx + 1}${LL.of}${topic.steps.length}
          </span>
          <button id="gXBtn" style="background:var(--cream-dark);border:none;width:28px;height:28px;
            border-radius:50%;font-size:13px;cursor:pointer;color:var(--text-muted);">✕</button>
        </div>
        <div style="height:3px;background:var(--cream-dark);border-radius:99px;overflow:hidden;margin-bottom:0;">
          <div style="height:100%;width:${pct}%;background:var(--primary);border-radius:99px;transition:width .3s;"></div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:12px 16px 16px;">
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px;">
          <span style="font-size:32px;flex-shrink:0;line-height:1;">${step.emoji}</span>
          <div>
            <div style="font-size:15px;font-weight:900;color:var(--text);margin-bottom:4px;line-height:1.3;">${step.title}</div>
            <div style="font-size:13px;line-height:1.7;color:var(--text-soft);white-space:pre-line;">${step.text}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          ${stepIdx > 0 ? `<button id="gPrev" class="btn-secondary" style="flex:0 0 46px;padding:12px;font-size:16px;">${LL.prev}</button>` : ""}
          <button id="gNext" class="btn-primary" style="flex:1;padding:13px;font-size:14px;font-weight:800;">
            ${isLast ? LL.done : LL.next}
          </button>
        </div>
      </div>`;

    card.querySelector("#gXBtn").onclick = close;
    card.querySelector("#gBackBtn").onclick = () => {
      removeHL();
      topicIdx = null;
      renderTopics();
    };
    card.querySelector("#gPrev")?.addEventListener("click", () => {
      stepIdx--;
      runStep();
    });
    card.querySelector("#gNext").onclick = () => {
      if (isLast) {
        topicIdx = null;
        renderTopics();
      } else {
        stepIdx++;
        runStep();
      }
      removeHL();
    };
  }

  // ── Topic list ────────────────────────────────────────────────
  function renderTopics() {
    removeHL();
    const LL = {
      ru: {
        title: "📚 Интерактивный гид",
        sub: "Выберите тему",
        steps: "шагов",
      },
      en: {
        title: "📚 Interactive Guide",
        sub: "Choose a topic",
        steps: "steps",
      },
      ka: {
        title: "📚 ინტერაქტიური გიდი",
        sub: "აირჩიეთ თემა",
        steps: "ნაბიჯი",
      },
    }[lang] || { title: "📚 Guide", sub: "Choose", steps: "steps" };

    card.innerHTML = `
      <div style="flex-shrink:0;padding:10px 16px 0;">
        <div style="width:36px;height:4px;background:var(--cream-border);border-radius:99px;margin:0 auto 10px;"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;
          padding-bottom:10px;border-bottom:1.5px solid var(--cream-border);">
          <div>
            <div style="font-size:15px;font-weight:900;color:var(--text);">${LL.title}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${LL.sub}</div>
          </div>
          <button id="gX2" style="background:var(--cream-dark);border:none;width:30px;height:30px;
            border-radius:50%;font-size:14px;cursor:pointer;color:var(--text-muted);">✕</button>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:10px 14px 20px;display:flex;flex-direction:column;gap:8px;">
        ${topics
          .map(
            (tp, i) => `
          <button data-ti="${i}" style="display:flex;align-items:center;gap:12px;padding:12px 14px;
            background:var(--cream-dark);border:1.5px solid var(--cream-border);
            border-radius:14px;cursor:pointer;font-family:inherit;text-align:left;
            width:100%;transition:border-color .15s,background .15s;">
            <span style="font-size:24px;width:40px;height:40px;flex-shrink:0;
              background:var(--primary-pale);border-radius:10px;
              display:flex;align-items:center;justify-content:center;">${tp.icon}</span>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:800;font-size:14px;color:var(--text);">${tp.title}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">
                ${tp.steps.length} ${LL.steps}
              </div>
            </div>
            <span style="font-size:18px;color:var(--text-muted);">›</span>
          </button>`,
          )
          .join("")}
      </div>`;

    card.querySelector("#gX2").onclick = close;
    card.querySelectorAll("[data-ti]").forEach((btn) => {
      btn.onclick = () => {
        topicIdx = parseInt(btn.dataset.ti);
        stepIdx = 0;
        runStep();
      };
      btn.onmouseenter = () => (btn.style.borderColor = "var(--primary)");
      btn.onmouseleave = () => (btn.style.borderColor = "var(--cream-border)");
    });
  }

  renderTopics();
}

// Wire guide button in header
const _origStartGuide = typeof startGuide === "function" ? startGuide : null;
function startGuide() {
  openInteractiveGuide();
}

// Add guide to settings (already there via button, now also openable from here)
// Wire it globally
setTimeout(() => {
  initTooltips();
}, 1200);

// ══════════════════════════════════════════════════════════════
// LUXURY BACKGROUND — Animated ambient particles
// ══════════════════════════════════════════════════════════════
(function initLuxuryBackground() {
  const canvas =
    document.getElementById("luxBg") || document.createElement("canvas");
  if (!canvas.id) {
    canvas.id = "luxBg";
    canvas.style.cssText =
      "position:fixed;inset:0;z-index:-1;pointer-events:none;";
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d");
  let W,
    H,
    animId,
    t = 0;
  const isDark = () => document.body.classList.contains("dark");

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // ── AURORA CONFIG — тема-адаптивная ──────────────────────────
  // Цвета aurora меняются в зависимости от выбранной темы
  function getAuroraConfig() {
    const th = document.body.className.match(/theme-(\w+)/)?.[1] || "dark";
    const configs = {
      // Северное сияние (dark) — фиолетово-розово-бирюзовая
      dark: [
        {
          yBase: 0.68,
          amp: 0.1,
          freq: 1.4,
          speed: 0.38,
          phase: 0.0,
          r: 167,
          g: 139,
          b: 250,
          aD: 0.38,
          hD: 0.42,
        },
        {
          yBase: 0.76,
          amp: 0.07,
          freq: 1.9,
          speed: 0.52,
          phase: 1.1,
          r: 244,
          g: 114,
          b: 182,
          aD: 0.32,
          hD: 0.36,
        },
        {
          yBase: 0.83,
          amp: 0.05,
          freq: 2.3,
          speed: 0.44,
          phase: 2.2,
          r: 45,
          g: 212,
          b: 191,
          aD: 0.26,
          hD: 0.3,
        },
        {
          yBase: 0.9,
          amp: 0.04,
          freq: 2.8,
          speed: 0.6,
          phase: 3.5,
          r: 248,
          g: 113,
          b: 113,
          aD: 0.2,
          hD: 0.24,
        },
      ],
      // Полночный синий — синие волны
      navy: [
        {
          yBase: 0.66,
          amp: 0.11,
          freq: 1.3,
          speed: 0.35,
          phase: 0.0,
          r: 96,
          g: 165,
          b: 250,
          aD: 0.4,
          hD: 0.44,
        },
        {
          yBase: 0.75,
          amp: 0.08,
          freq: 1.8,
          speed: 0.5,
          phase: 1.3,
          r: 147,
          g: 197,
          b: 253,
          aD: 0.3,
          hD: 0.34,
        },
        {
          yBase: 0.83,
          amp: 0.05,
          freq: 2.2,
          speed: 0.42,
          phase: 2.4,
          r: 52,
          g: 211,
          b: 153,
          aD: 0.22,
          hD: 0.26,
        },
        {
          yBase: 0.9,
          amp: 0.04,
          freq: 2.7,
          speed: 0.58,
          phase: 3.8,
          r: 167,
          g: 139,
          b: 250,
          aD: 0.18,
          hD: 0.22,
        },
      ],
      // Золотое напыление — янтарно-золотые волны
      gold: [
        {
          yBase: 0.67,
          amp: 0.1,
          freq: 1.5,
          speed: 0.4,
          phase: 0.0,
          r: 251,
          g: 191,
          b: 36,
          aD: 0.36,
          hD: 0.4,
        },
        {
          yBase: 0.75,
          amp: 0.07,
          freq: 2.0,
          speed: 0.55,
          phase: 1.0,
          r: 249,
          g: 115,
          b: 22,
          aD: 0.3,
          hD: 0.34,
        },
        {
          yBase: 0.83,
          amp: 0.05,
          freq: 2.4,
          speed: 0.45,
          phase: 2.1,
          r: 253,
          g: 230,
          b: 138,
          aD: 0.24,
          hD: 0.28,
        },
        {
          yBase: 0.9,
          amp: 0.04,
          freq: 2.9,
          speed: 0.62,
          phase: 3.3,
          r: 252,
          g: 211,
          b: 77,
          aD: 0.18,
          hD: 0.22,
        },
      ],
    };
    return configs[th] || configs.dark;
  }
  const auroraConfig = getAuroraConfig();

  // Static stars (pre-computed positions)
  const STAR_COUNT = 90;
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    x: Math.sin(i * 137.508) * 0.5 + 0.5,
    y: (Math.cos(i * 97.319) * 0.5 + 0.5) * 0.65, // top 65%
    r: Math.random() * 1.3 + 0.3,
    a: Math.random() * 0.6 + 0.25,
    blink: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.025 + 0.008,
  }));

  // Bright feature stars
  const brightStars = [
    { x: 0.12, y: 0.08, r: 1.8 },
    { x: 0.55, y: 0.05, r: 2.1 },
    { x: 0.83, y: 0.12, r: 1.6 },
    { x: 0.28, y: 0.22, r: 1.4 },
    { x: 0.7, y: 0.18, r: 1.9 },
    { x: 0.42, y: 0.32, r: 1.3 },
  ];

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    const dark = isDark();

    // ── 1. Sky background ──
    if (dark) {
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#04020f");
      sky.addColorStop(0.55, "#060418");
      sky.addColorStop(0.78, "#0a0530");
      sky.addColorStop(1, "#120840");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
    } else {
      // ── DAY MODE: theme-aware backgrounds ──
      const themeMatch = document.body.className.match(/theme-(\w+)/);
      const dayTheme = themeMatch ? themeMatch[1] : "default";

      if (dayTheme === "white") {
        // ☀️ ЗОЛОТОЙ ЧАС — анимированный цикл рассвет↔закат
        // cycle: 0=рассвет(розово-оранжевый) → 0.5=полдень(тёплый белый) → 1=закат(алый)
        const cycle = (Math.sin(t * 0.0005) + 1) / 2; // медленный цикл 0..1

        // Небо меняет цвет
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        const sr = Math.round(255);
        const sg1 = Math.round(248 - cycle * 40);
        const sb1 = Math.round(240 - cycle * 100);
        sky.addColorStop(0, `rgb(${sr},${sg1},${sb1})`);
        sky.addColorStop(
          0.5,
          `rgb(255,${Math.round(243 - cycle * 30)},${Math.round(225 - cycle * 70)})`,
        );
        sky.addColorStop(
          1,
          `rgb(255,${Math.round(235 - cycle * 50)},${Math.round(195 - cycle * 90)})`,
        );
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Солнце — поднимается снизу-слева, садится снизу-справа
        const sunX = W * (0.1 + cycle * 0.8);
        const sunY = H * (0.92 - Math.sin(cycle * Math.PI) * 0.25);

        // Лучи с пульсацией
        for (let i = 0; i < 16; i++) {
          const baseAngle =
            cycle < 0.5
              ? -Math.PI * 0.15 + (i / 16) * Math.PI * 0.85 // рассвет: лучи вправо-вверх
              : -Math.PI * 0.7 + (i / 16) * Math.PI * 0.85; // закат: лучи влево-вверх
          const angle = baseAngle + Math.sin(t * 0.008 + i * 0.35) * 0.04;
          const pulseA =
            (0.028 + Math.sin(t * 0.012 + i) * 0.012) * (1 - (i / 16) * 0.45);
          const rg = ctx.createLinearGradient(
            sunX,
            sunY,
            sunX + Math.cos(angle) * W * 2,
            sunY + Math.sin(angle) * H * 1.5,
          );
          const rc = Math.round(255);
          const gc = Math.round(150 - cycle * 60);
          const bc = Math.round(50 - cycle * 40);
          rg.addColorStop(0, `rgba(${rc},${gc},${bc},${pulseA * 4.5})`);
          rg.addColorStop(0.2, `rgba(${rc},${gc},${bc},${pulseA})`);
          rg.addColorStop(1, "transparent");
          ctx.save();
          ctx.strokeStyle = rg;
          ctx.lineWidth = 20 + i * 8;
          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.lineTo(
            sunX + Math.cos(angle) * W * 2,
            sunY + Math.sin(angle) * H * 1.5,
          );
          ctx.stroke();
          ctx.restore();
        }

        // Ореол солнца
        const sunGlow = ctx.createRadialGradient(
          sunX,
          sunY,
          0,
          sunX,
          sunY,
          W * 0.7,
        );
        const gR = Math.round(255);
        const gG = Math.round(190 - cycle * 60);
        const gB = Math.round(70 - cycle * 60);
        sunGlow.addColorStop(
          0,
          `rgba(${gR},${gG},${gB},${0.4 + cycle * 0.15})`,
        );
        sunGlow.addColorStop(
          0.3,
          `rgba(${gR},${Math.round(gG * 0.7)},30,${0.18 + cycle * 0.1})`,
        );
        sunGlow.addColorStop(
          0.6,
          `rgba(236,72,${Math.round(153 * cycle)},${0.05 + cycle * 0.06})`,
        );
        sunGlow.addColorStop(1, "transparent");
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, W, H);

        // Розово-фиолетовый акцент — меняется со временем
        const accentX = cycle < 0.5 ? W * 0.88 : W * 0.12;
        const acc = ctx.createRadialGradient(
          accentX,
          H * 0.08,
          0,
          accentX,
          H * 0.08,
          W * 0.6,
        );
        acc.addColorStop(
          0,
          `rgba(${Math.round(251 - cycle * 50)},113,133,${0.1 + cycle * 0.08})`,
        );
        acc.addColorStop(0.5, `rgba(139,92,246,${0.05 + cycle * 0.04})`);
        acc.addColorStop(1, "transparent");
        ctx.fillStyle = acc;
        ctx.fillRect(0, 0, W, H);
      } else if (dayTheme === "sunset") {
        // 💫 ПРИЗМА — два источника: правый верх + левый низ
        ctx.fillStyle = "#fefeff";
        ctx.fillRect(0, 0, W, H);

        // Лёгкий белый градиент фона
        const bgG = ctx.createLinearGradient(0, 0, W, H);
        bgG.addColorStop(0, "#fff8ff");
        bgG.addColorStop(0.5, "#fefeff");
        bgG.addColorStop(1, "#f8f0ff");
        ctx.fillStyle = bgG;
        ctx.fillRect(0, 0, W, H);

        function drawPrism(srcX, srcY, startAngle, spread, len, flip) {
          var bands = [
            { h: 0, sp: 0.4, off: 0.0, hw: 38, a: 0.42 },
            { h: 30, sp: 0.5, off: 0.8, hw: 44, a: 0.4 },
            { h: 60, sp: 0.38, off: 1.5, hw: 42, a: 0.38 },
            { h: 120, sp: 0.44, off: 2.2, hw: 40, a: 0.36 },
            { h: 200, sp: 0.45, off: 2.8, hw: 46, a: 0.38 },
            { h: 260, sp: 0.35, off: 3.4, hw: 42, a: 0.36 },
            { h: 310, sp: 0.42, off: 4.0, hw: 44, a: 0.4 },
          ];
          bands.forEach(function (b, i) {
            var angle =
              startAngle +
              (flip ? -1 : 1) * (i - bands.length / 2) * spread +
              Math.sin(t * b.sp * 0.01 + b.off) * 0.035;
            var rg = ctx.createLinearGradient(
              srcX,
              srcY,
              srcX + Math.cos(angle) * len,
              srcY + Math.sin(angle) * len,
            );
            rg.addColorStop(0, "hsla(" + b.h + ",95%,60%," + b.a + ")");
            rg.addColorStop(
              0.15,
              "hsla(" + b.h + ",90%,62%," + b.a * 0.7 + ")",
            );
            rg.addColorStop(
              0.5,
              "hsla(" + b.h + ",85%,65%," + b.a * 0.35 + ")",
            );
            rg.addColorStop(1, "transparent");
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(
              srcX - Math.sin(angle) * b.hw,
              srcY + Math.cos(angle) * b.hw,
            );
            ctx.lineTo(
              srcX + Math.sin(angle) * b.hw,
              srcY - Math.cos(angle) * b.hw,
            );
            ctx.lineTo(
              srcX + Math.cos(angle) * len + Math.sin(angle) * b.hw * 4,
              srcY + Math.sin(angle) * len - Math.cos(angle) * b.hw * 4,
            );
            ctx.lineTo(
              srcX + Math.cos(angle) * len - Math.sin(angle) * b.hw * 4,
              srcY + Math.sin(angle) * len + Math.cos(angle) * b.hw * 4,
            );
            ctx.closePath();
            ctx.fillStyle = rg;
            ctx.fill();
            ctx.restore();
          });
          // Яркое ядро источника
          var cg = ctx.createRadialGradient(srcX, srcY, 0, srcX, srcY, 55);
          cg.addColorStop(0, "rgba(255,255,255,1.0)");
          cg.addColorStop(0.3, "rgba(255,248,235,0.7)");
          cg.addColorStop(1, "transparent");
          ctx.fillStyle = cg;
          ctx.fillRect(0, 0, W, H);
        }

        // Призма 1 — правый верх, лучи идут влево-вниз
        var px1 = W * 0.88 + Math.sin(t * 0.005) * W * 0.03;
        var py1 = H * 0.08 + Math.cos(t * 0.004) * H * 0.03;
        drawPrism(px1, py1, Math.PI * 0.62, 0.115, W * 1.9, false);

        // Призма 2 — левый низ, лучи идут вправо-вверх
        var px2 = W * 0.1 + Math.sin(t * 0.006 + 2) * W * 0.03;
        var py2 = H * 0.92 + Math.cos(t * 0.005 + 2) * H * 0.03;
        drawPrism(px2, py2, -Math.PI * 0.42, 0.11, W * 1.9, true);
      } else if (dayTheme === "ocean") {
        // 🌊 МОРСКАЯ ПЕНА
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, "#f0fdff");
        sky.addColorStop(0.45, "#e0f7fe");
        sky.addColorStop(1, "#b2ebf2");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);
        const sunG = ctx.createRadialGradient(
          W * 0.5,
          H * 0.08,
          0,
          W * 0.5,
          H * 0.08,
          W * 0.6,
        );
        sunG.addColorStop(0, "rgba(255,255,255,0.65)");
        sunG.addColorStop(0.4, "rgba(6,182,212,0.12)");
        sunG.addColorStop(1, "transparent");
        ctx.fillStyle = sunG;
        ctx.fillRect(0, 0, W, H);
        var oceanWaves = [
          {
            yB: 0.52,
            amp: 0.042,
            fr: 1.6,
            sp: 0.55,
            ph: 0,
            r: 6,
            g: 182,
            b: 212,
            aT: 0.3,
            aB: 0.46,
          },
          {
            yB: 0.62,
            amp: 0.036,
            fr: 2.0,
            sp: 0.75,
            ph: 1.2,
            r: 14,
            g: 165,
            b: 233,
            aT: 0.25,
            aB: 0.4,
          },
          {
            yB: 0.72,
            amp: 0.03,
            fr: 1.3,
            sp: 0.48,
            ph: 2.5,
            r: 56,
            g: 189,
            b: 248,
            aT: 0.2,
            aB: 0.34,
          },
          {
            yB: 0.82,
            amp: 0.024,
            fr: 2.4,
            sp: 0.88,
            ph: 3.7,
            r: 125,
            g: 211,
            b: 252,
            aT: 0.16,
            aB: 0.28,
          },
        ];
        var sec2 = t * 0.012;
        oceanWaves.forEach(function (w) {
          var pts = [];
          for (var i = 0; i <= W; i += 3) {
            var nx = i / W;
            var wy =
              Math.sin(nx * Math.PI * w.fr * 2 + sec2 * w.sp + w.ph) *
                w.amp *
                H +
              Math.sin(
                nx * Math.PI * w.fr * 3.1 + sec2 * w.sp * 0.7 + w.ph + 1,
              ) *
                w.amp *
                H *
                0.3;
            pts.push({ x: i, y: w.yB * H + wy });
          }
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, H);
          pts.forEach(function (p) {
            ctx.lineTo(p.x, p.y);
          });
          ctx.lineTo(W, H);
          ctx.closePath();
          var gr = ctx.createLinearGradient(0, w.yB * H - 60, 0, H);
          gr.addColorStop(0, "transparent");
          gr.addColorStop(
            0.3,
            "rgba(" + w.r + "," + w.g + "," + w.b + "," + w.aT + ")",
          );
          gr.addColorStop(
            1,
            "rgba(" + w.r + "," + w.g + "," + w.b + "," + w.aB + ")",
          );
          ctx.fillStyle = gr;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          pts.forEach(function (p) {
            ctx.lineTo(p.x, p.y);
          });
          ctx.strokeStyle = "rgba(255,255,255," + w.aT * 1.8 + ")";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        });
      } else {
        // 🌅 РАССВЕТ (default) — анимированный восход: солнце поднимается по дуге
        // Медленный дыхающий цикл: рассвет ↔ утро
        const breath = (Math.sin(t * 0.0004) + 1) / 2; // 0..1, очень медленно

        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(
          0,
          `rgb(255,${Math.round(248 - breath * 15)},${Math.round(242 - breath * 30)})`,
        );
        sky.addColorStop(
          0.35,
          `rgb(255,${Math.round(243 - breath * 20)},${Math.round(236 - breath * 40)})`,
        );
        sky.addColorStop(
          0.65,
          `rgb(255,${Math.round(240 - breath * 10)},${Math.round(247 - breath * 20)})`,
        );
        sky.addColorStop(
          1,
          `rgb(${Math.round(248 - breath * 8)},${Math.round(240 - breath * 15)},255)`,
        );
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Солнце медленно поднимается — от горизонта до 1/3 экрана
        const sunRiseY = H * (0.94 - breath * 0.28);
        const sunX = W * 0.12 + Math.sin(t * 0.003) * W * 0.02;

        // Оранжевое свечение снизу-слева
        const sg = ctx.createRadialGradient(
          sunX,
          sunRiseY,
          0,
          sunX,
          sunRiseY,
          W * 0.72,
        );
        sg.addColorStop(
          0,
          `rgba(255,${Math.round(140 - breath * 20)},${Math.round(60 - breath * 30)},${0.28 + breath * 0.1})`,
        );
        sg.addColorStop(0.3, `rgba(249,115,22,${0.14 + breath * 0.06})`);
        sg.addColorStop(0.6, `rgba(236,72,153,${0.07 + breath * 0.03})`);
        sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.fillRect(0, 0, W, H);

        // Несколько тонких лучей
        for (let i = 0; i < 8; i++) {
          const angle = -Math.PI * 0.05 + (i / 8) * Math.PI * 0.6;
          const a =
            (0.018 + Math.sin(t * 0.009 + i) * 0.008) * (1 - (i / 8) * 0.5);
          const rg2 = ctx.createLinearGradient(
            sunX,
            sunRiseY,
            sunX + Math.cos(angle) * W * 1.5,
            sunRiseY - Math.sin(angle) * H,
          );
          rg2.addColorStop(0, `rgba(255,160,80,${a * 4})`);
          rg2.addColorStop(0.3, `rgba(255,140,60,${a})`);
          rg2.addColorStop(1, "transparent");
          ctx.save();
          ctx.strokeStyle = rg2;
          ctx.lineWidth = 15 + i * 12;
          ctx.beginPath();
          ctx.moveTo(sunX, sunRiseY);
          ctx.lineTo(
            sunX + Math.cos(angle) * W * 1.5,
            sunRiseY - Math.sin(angle) * H,
          );
          ctx.stroke();
          ctx.restore();
        }

        // Лавандовый акцент сверху-справа — пульсирует
        const lr = ctx.createRadialGradient(
          W * 0.92,
          H * 0.05,
          0,
          W * 0.92,
          H * 0.05,
          W * 0.5,
        );
        lr.addColorStop(0, `rgba(139,92,246,${0.1 + breath * 0.04})`);
        lr.addColorStop(0.5, `rgba(236,72,153,${0.05 + breath * 0.02})`);
        lr.addColorStop(1, "transparent");
        ctx.fillStyle = lr;
        ctx.fillRect(0, 0, W, H);
      }
      t++;
      animId = requestAnimationFrame(drawFrame);
      return; // Day mode: no aurora/stars
    }

    // ── 2. Stars (dark only) ──
    stars.forEach((s) => {
      const alpha = s.a * (0.45 + Math.sin(t * s.speed + s.blink) * 0.55);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    // Bright stars with cross-flare
    brightStars.forEach((s) => {
      const a = 0.7 + Math.sin(t * 0.018 + s.x * 10) * 0.25;
      const g = ctx.createRadialGradient(
        s.x * W,
        s.y * H,
        0,
        s.x * W,
        s.y * H,
        s.r * 5,
      );
      g.addColorStop(0, `rgba(220,210,255,${a * 0.9})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── 3. Subtle glow above aurora horizon ──
    const glow = ctx.createLinearGradient(0, H * 0.5, 0, H * 0.72);
    glow.addColorStop(0, "transparent");
    glow.addColorStop(1, "rgba(100,60,200,0.08)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // ── 4. Aurora bands — dynamic per theme ──
    const currentBands = getAuroraConfig();
    currentBands.forEach((band, bi) => {
      const sec = t * 0.012;
      // Build wavy bottom edge
      const steps = Math.ceil(W / 3);
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        const nx = x / W;
        // Multi-frequency wave for organic look
        const wave =
          Math.sin(
            nx * Math.PI * band.freq * 2 + sec * band.speed + band.phase,
          ) *
            band.amp *
            H +
          Math.sin(
            nx * Math.PI * band.freq * 3.7 +
              sec * band.speed * 0.7 +
              band.phase +
              1,
          ) *
            band.amp *
            H *
            0.3 +
          Math.sin(
            nx * Math.PI * band.freq * 1.2 +
              sec * band.speed * 1.3 +
              band.phase +
              2,
          ) *
            band.amp *
            H *
            0.15;
        pts.push({ x, y: band.yBase * H + wave });
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(W, H);
      ctx.closePath();

      // Gradient: transparent top → color at wave → brighter at bottom
      const gradTop =
        pts.reduce((min, p) => Math.min(min, p.y), H) - band.amp * H * 1.2;
      const grad = ctx.createLinearGradient(0, gradTop, 0, H);
      grad.addColorStop(0, `rgba(${band.r},${band.g},${band.b},0)`);
      grad.addColorStop(
        0.25,
        `rgba(${band.r},${band.g},${band.b},${band.aD * 0.5})`,
      );
      grad.addColorStop(0.55, `rgba(${band.r},${band.g},${band.b},${band.aD})`);
      grad.addColorStop(1, `rgba(${band.r},${band.g},${band.b},${band.hD})`);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Luminous edge line along the wave
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.strokeStyle = `rgba(${band.r},${band.g},${band.b},${band.aD * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

    // ── 5. Shooting star (occasional) ──
    const shootPhase = (t * 0.006) % (Math.PI * 2);
    if (shootPhase < 0.3) {
      const prog = shootPhase / 0.3;
      const sx = W * (0.2 + prog * 0.55);
      const sy = H * (0.08 + prog * 0.18);
      const trail = 60;
      const sg = ctx.createLinearGradient(sx - trail, sy - trail * 0.4, sx, sy);
      sg.addColorStop(0, "transparent");
      sg.addColorStop(1, `rgba(220,210,255,${0.8 * (1 - prog)})`);
      ctx.strokeStyle = sg;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx - trail, sy - trail * 0.4);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }

    t++;
    animId = requestAnimationFrame(drawFrame);
  }

  drawFrame();

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      t = 0;
      drawFrame();
    }
  });
})();
