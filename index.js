/* БюджетPRO v2.3 — build:20260409-003 */
// ============================================================
// КАТЕГОРИИ (глобальные)
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
    appName: "🌿 БюджетPRO",
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
    light: "☀️ Светлая",
    dark: "🌙 Тёмная",
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
    permViewOwnerDesc:
      "Гость сможет видеть ваши операции и статистику (переключившись на ваш профиль)",
    sharePackageHint:
      "Этот файл содержит данные профиля. Отправьте его вместе с кодом.",
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
    shareCloudLinkHint:
      "Создаёт настоящую ссылку через облако — получатель просто нажимает",
    shareNoHosting: "Для ссылок нужен URL приложения",
    shareHostingStep1: "1. Откройте",
    shareHostingStep2: "2. Перетащите папку с приложением",
    shareHostingStep3: "3. Скопируйте URL → вставьте ниже",
    shareLinkReady: "✅ Ссылка готова! Отправьте её в WhatsApp/Telegram",
    shareLinkCreating: "⏳ Создаю ссылку...",
    shareLinkFail: "❌ Не удалось. Используйте файл-приглашение",
    shareOpenNetlify: "Открыть Netlify Drop",
    shareInviteFileHint:
      "HTML-файл. Отправьте его в WhatsApp/Telegram — получатель открывает файл в браузере и попадает в приложение",
    shareFileWarning:
      "⚠️ Ссылка работает только на вашем устройстве (файл локальный). Используйте «Скачать приглашение» для отправки другим.",
    shareOpenInApp: "Открыть в BudgetPRO",
    shareAppUrlLabel: "URL приложения (если размещено в интернете)",
    shareAppUrlHint: "Например: https://yourname.github.io/budgetpro/",
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
    connectProfile: "🔗 Подключиться к чужому профилю",
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
    searchFound: "Найдено",
    searchOf: "из",
    searchRecords: "записей",
    themeLabels: {
      white: "⬜ Чистый белый",
      default: "🌿 Лесной зелёный",
      sunset: "🌅 Тёплый закат",
      dark: "🌿 Зелёная ночь",
      navy: "🌌 Полночный синий",
      gold: "✨ Золотое напыление",
    },
    themeDescs: {
      white: "Чистый, минималистичный",
      default: "Тёплый, природный",
      sunset: "Тёплый закат",
      dark: "Тёмная зелень",
      navy: "Звёздное небо",
      gold: "Золотые акценты",
    },
    recurringFreqLabel: "Частота",
    versionFooter: "БюджетPRO v2.2 · Офлайн 📴",
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
    helpContent: `<div style="font-family:inherit;line-height:1.7;color:var(--text);">
<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:var(--primary);">🌿 БюджетPRO — полная инструкция</h2>

<div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);">
<b>💡 Главная идея:</b> Записывайте доходы и расходы, следите за бюджетом и делитесь профилем с семьёй — всё офлайн, без регистрации.
</div>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">➕ Добавление операции</h3>
<p>Нажмите <b>зелёную кнопку «+»</b> внизу. Выберите тип (Расход/Доход), категорию, введите сумму → «Добавить».</p>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🏠 Главная страница</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🔢 <b>4 карточки</b> — баланс, доходы, расходы, начальная сумма. Нажмите — фильтрует список.</li>
<li>👤 <b>Панель профиля</b> — вверху видно <i>чей профиль открыт</i> и кнопки переключения.</li>
<li>🔍 <b>Поиск</b> — по категории, сумме или заметке.</li>
<li>📅 <b>Фильтр</b> — сегодня / вчера / неделя / месяц / всё время.</li>
<li>👈 <b>Свайп влево</b> — мгновенное удаление с кнопкой «Отмена».</li>
<li>☝️ <b>Нажать на операцию</b> — открыть редактирование.</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">👥 Профили (несколько бюджетов)</h3>
<ul style="margin:8px 0 8px 16px;">
<li>До <b>10 независимых профилей</b> — у каждого своя история, категории и бюджеты.</li>
<li>Создать/переименовать/удалить профиль — Настройки → Профили.</li>
<li>Переключить — кнопки аватаров на главной странице.</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🔗 Доступ для другого человека</h3>
<ul style="margin:8px 0 8px 16px;">
<li>Настройки → Профили → кнопка 🔗 → <b>«Создать доступ»</b></li>
<li>Выставьте разрешения (что гость может делать, а что нет)</li>
<li>Нажмите <b>«Создать ссылку»</b> → ссылка копируется → отправьте в WhatsApp/Telegram</li>
<li>Гость открывает ссылку → попадает в <b>свой чистый профиль</b> (ваши данные он не видит)</li>
<li>Можно поставить <b>пароль</b> — без него гость не войдёт</li>
<li>Можно <b>заблокировать</b> профиль (переключатель 🔒) — гость увидит экран блокировки</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">👤 Гостевой режим и выход из него</h3>
<ul style="margin:8px 0 8px 16px;">
<li>На главной видно <b>синюю панель «Гостевой профиль»</b> — вы в гостевом режиме.</li>
<li>Нажмите кнопку <b>🚪 Выйти</b> на этой панели — вернётесь в свой профиль.</li>
<li>Или Настройки → там будет кнопка выхода из гостевого режима.</li>
<li>Разрешения показаны при входе по ссылке (зелёные ✅ = можно, красные ❌ = нельзя).</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">📊 Статистика</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🟢 Карточка статуса — подробное объяснение состояния бюджета</li>
<li>🍩 Диаграмма расходов по категориям</li>
<li>📈 График баланса по месяцам · 📊 Тренды · 🗓 Тепловая карта</li>
<li>💰 Прогресс бюджетов с предупреждением при превышении</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">⚙️ Настройки</h3>
<ul style="margin:8px 0 8px 16px;">
<li>💰 <b>Бюджеты</b> — лимит по категории на месяц</li>
<li>🔄 <b>Повторяющиеся операции</b> — аренда/кредит добавляется автоматически</li>
<li>⭐ <b>Шаблоны</b> — быстрое добавление частых операций</li>
<li>🔒 <b>Пин-код + биометрия</b> (Face ID/Touch ID)</li>
<li>🎨 <b>6 цветовых тем</b> — 3 дневных (белый, зелёный, закат) + 3 ночных (лес, синий, золото)</li>
<li>☁️ <b>Экспорт/импорт</b> — JSON, CSV, PDF, резервная копия</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🧮 Инструменты</h3>
<p>Калькулятор с историей · Конвертер валют (₽ $ € ₾ £) · Блокнот для заметок</p>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">💡 Советы</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🌙/☀️ — быстрое переключение темы (кнопка в шапке)</li>
<li>🌐 — смена языка (ru/en/ka)</li>
<li>📅 — при добавлении можно выбрать любую дату</li>
<li>Жёсткая перезагрузка <b>Ctrl+Shift+R</b> — если что-то не обновляется</li>
</ul>

<div style="background:var(--gold-pale);border-radius:14px;padding:14px;margin-top:16px;border-left:4px solid var(--gold);">
<b>🚀 Возможности:</b> Офлайн учёт · Статистика · Несколько профилей · Доступ по ссылке · Разрешения гостей · Пин+биометрия · 3 языка · 6 тем · Конвертер · Блокнот · Экспорт · Бэкап
</div>
</div>`,
    guideNext: "Далее",
    guideSkip: "Пропустить",
    guideFinish: "Готово",
    guideSteps: [
      {
        element: ".top-cards",
        title: "Карточки сводки",
        desc: "Баланс, доходы, расходы.",
      },
      {
        element: ".fab",
        title: "Добавить операцию",
        desc: "Зелёная кнопка для добавления.",
      },
      {
        element: ".bottom-nav",
        title: "Навигация",
        desc: "Переключение разделов.",
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
    // Фильтр по времени
    filterToday: "Сегодня",
    filterYesterday: "Вчера",
    filterTwoDaysAgo: "2 дня назад",
    filterThisWeek: "За неделю",
    filterThisMonth: "За месяц",
    filterAllTime: "Всё время",
    filterLabel: "Период:",
    // Бюджеты
    budgets: "💰 Бюджеты по категориям",
    addBudget: "+ Добавить бюджет",
    budgetLimit: "Лимит в месяц",
    budgetNoBudgets: "Бюджеты не заданы.",
    budgetOverLimit: "⚠️ Лимит превышен!",
    budgetDeleteConfirm: "Удалить бюджет?",
    // Повторяющиеся
    recurring: "🔄 Повторяющиеся операции",
    addRecurring: "+ Добавить",
    recurringMonthly: "Ежемесячно",
    recurringWeekly: "Еженедельно",
    recurringDaily: "Ежедневно",
    recurringNone: "Повторяющихся нет.",
    recurringApplied: "✓ Добавлено автоматически:",
    recurringDeleteConfirm: "Удалить?",
    // Пин-код
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
    // Тренд
    trendTitle: "📊 Тренд по категориям",
    trendVsLastMonth: "vs прошлый месяц",
    // Тепловая карта
    heatmapTitle: "🗓 Активность по дням недели",
    heatmapSubtitle: "Средние расходы",
    // PDF / облако
    exportPDF: "📄 Экспорт PDF",
    pdfTitle: "Финансовый отчёт",
    cloudBackup: "☁️ Резервное копирование",
    cloudSave: "☁️ Сохранить в облако",
    cloudLoad: "☁️ Загрузить из ссылки",
    cloudCopied: "✓ Ссылка скопирована",
    cloudLoadHint: "Вставьте резервную ссылку",
    // напоминания
    reminders: "🔔 Напоминания",
    remindersDesc: "Не забывайте записывать траты",
    remindersEnable: "Включить напоминания",
    remindersInterval: "Интервал",
    remindersDaily: "Каждый день",
    remindersEvery3Days: "Раз в 3 дня",
    remindersWeekly: "Раз в неделю",
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
    biometryTitle: "🫆 Биометрия",
    biometryDesc: "Face ID / Touch ID / отпечаток пальца",
    biometryToggleLabel: "Вход по биометрии",
    recurringDayLabel: "День месяца",
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
    light: "☀️ Light",
    dark: "🌙 Dark",
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
    permViewOwnerDesc:
      "Guest will be able to see your transactions and statistics (by switching to your profile)",

    sharePackageHint:
      "This file contains profile data. Send it together with the code.",
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
    shareCloudLinkHint:
      "Creates a real link via cloud — recipient just taps it",
    shareNoHosting: "App URL required for links",
    shareHostingStep1: "1. Open",
    shareHostingStep2: "2. Drag your app folder",
    shareHostingStep3: "3. Copy URL → paste below",
    shareLinkReady: "✅ Link ready! Send via WhatsApp/Telegram",
    shareLinkCreating: "⏳ Creating link...",
    shareLinkFail: "❌ Failed. Use invitation file instead",
    shareOpenNetlify: "Open Netlify Drop",
    shareInviteFileHint:
      "HTML file. Send via WhatsApp/Telegram — recipient opens it in browser and enters the app",
    shareFileWarning:
      "⚠️ The link only works on your device (local file). Use «Download invitation» to share with others.",
    shareOpenInApp: "Open in BudgetPRO",
    shareAppUrlLabel: "App URL (if hosted online)",
    shareAppUrlHint: "E.g.: https://yourname.github.io/budgetpro/",
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
    versionFooter: "BudgetPRO v2.2 · Offline 📴",
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
    helpContent: `<div style="font-family:inherit;line-height:1.7;color:var(--text);">
<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:var(--primary);">🌿 BudgetPRO — Full Guide</h2>

<div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);">
<b>💡 Main idea:</b> Track income and expenses, manage budgets, and share profiles with family — fully offline, no registration needed.
</div>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">➕ Adding a transaction</h3>
<p>Tap the <b>green «+» button</b> at the bottom. Choose type (Expense/Income), category, enter amount → «Add».</p>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🏠 Home screen</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🔢 <b>4 cards</b> — balance, income, expenses, starting amount. Tap to filter the list.</li>
<li>👤 <b>Profile bar</b> — shows <i>whose profile is open</i> and switch buttons at the top.</li>
<li>🔍 <b>Search</b> — by category, amount or note.</li>
<li>📅 <b>Filter</b> — today / yesterday / week / month / all time.</li>
<li>👈 <b>Swipe left</b> — instant delete with «Undo» button.</li>
<li>☝️ <b>Tap an operation</b> — open for editing.</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">👥 Profiles (multiple budgets)</h3>
<ul style="margin:8px 0 8px 16px;">
<li>Up to <b>10 independent profiles</b> — each has its own history, categories and budgets.</li>
<li>Create/rename/delete — Settings → Profiles.</li>
<li>Switch — avatar buttons on the home screen.</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🔗 Sharing access with someone</h3>
<ul style="margin:8px 0 8px 16px;">
<li>Settings → Profiles → 🔗 button → <b>«Create access»</b></li>
<li>Set permissions (what the guest can and cannot do)</li>
<li>Tap <b>«Create link»</b> → link is copied → send via WhatsApp/Telegram</li>
<li>Guest opens the link → gets their own <b>clean empty profile</b> (they cannot see your data)</li>
<li>You can set a <b>password</b> — guest cannot enter without it</li>
<li>You can <b>lock</b> the profile (🔒 toggle) — guest sees a lock screen</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">👤 Guest mode and how to exit</h3>
<ul style="margin:8px 0 8px 16px;">
<li>On home screen you'll see a <b>blue «Guest profile» bar</b> — you're in guest mode.</li>
<li>Tap <b>🚪 Exit</b> button on that bar — returns you to your own profile.</li>
<li>Or go to Settings → there will be an exit button.</li>
<li>Permissions are shown when you open the link (✅ green = allowed, ❌ red = not allowed).</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">📊 Statistics</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🟢 Status card — detailed budget health explanation</li>
<li>🍩 Category breakdown · 📈 Balance chart · 📊 Trends · 🗓 Heatmap</li>
<li>💰 Budget progress with warning on overspend</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">⚙️ Settings</h3>
<ul style="margin:8px 0 8px 16px;">
<li>💰 <b>Budgets</b> — monthly limit per category</li>
<li>🔄 <b>Recurring operations</b> — rent/loans added automatically</li>
<li>⭐ <b>Templates</b> — quick add for frequent operations</li>
<li>🔒 <b>PIN + biometry</b> (Face ID/Touch ID)</li>
<li>🎨 <b>6 color themes</b> — 3 day (white, green, sunset) + 3 night (forest, blue, gold)</li>
<li>☁️ <b>Export/import</b> — JSON, CSV, PDF, backup</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🧮 Tools</h3>
<p>Calculator with history · Currency converter (₽ $ € ₾ £) · Notebook for notes</p>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">💡 Tips</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🌙/☀️ — quick theme toggle (button in header)</li>
<li>🌐 — language switch (ru/en/ka)</li>
<li>📅 — you can choose any date when adding an operation</li>
<li>Hard reload <b>Ctrl+Shift+R</b> — if something doesn't update</li>
</ul>

<div style="background:var(--gold-pale);border-radius:14px;padding:14px;margin-top:16px;border-left:4px solid var(--gold);">
<b>🚀 Features:</b> Offline tracking · Statistics · Multi-profile · Link sharing · Guest permissions · PIN+biometry · 3 languages · 6 themes · Converter · Notebook · Export · Backup
</div>
</div>`,
    guideNext: "Next",
    guideSkip: "Skip",
    guideFinish: "Finish",
    guideSteps: [
      {
        element: ".top-cards",
        title: "Summary cards",
        desc: "Balance, income, expenses.",
      },
      {
        element: ".fab",
        title: "Add transaction",
        desc: "Green button to add.",
      },
      { element: ".bottom-nav", title: "Navigation", desc: "Switch sections." },
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
    biometryTitle: "🫆 Biometry",
    biometryDesc: "Face ID / Touch ID / Fingerprint",
    biometryToggleLabel: "Login with biometry",
    recurringDayLabel: "Day of month",
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
    statsTipSaveLow: "Experts recommend saving at least 10% of income.",
    statsTipNoIncome: "Add income sources for full picture.",
    statsTipGoodSaving: "Great! Consider investing part of savings.",
    statsMoreCats: "more",
  },
  ka: {
    appName: "🌿 ბიუჯეტPRO",
    slogan: "შენი კაპიტალი — შენი წესები",
    balance: "ბალანსი",
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
    light: "☀️ ღია",
    dark: "🌙 მუქი",
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
    shareCodeHint:
      "გაუგზავნეთ ეს კოდი მომხმარებელს WhatsApp-ით, Telegram-ით ან email-ით",
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
    permViewOwnerDesc:
      "სტუმარი შეძლებს თქვენი ოპერაციების და სტატისტიკის ნახვას (თქვენს პროფილზე გადართვით)",

    sharePackageHint:
      "ეს ფაილი შეიცავს პროფილის მონაცემებს. გაუგზავნეთ კოდთან ერთად.",
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
    shareCloudLinkHint:
      "ქმნის ნამდვილ ბმულს ღრუბლის მეშვეობით — მიმღები უბრალოდ აჭერს",
    shareNoHosting: "ბმულებისთვის საჭიროა აპლიკაციის URL",
    shareHostingStep1: "1. გახსენით",
    shareHostingStep2: "2. გადაიტანეთ აპლიკაციის საქაღალდე",
    shareHostingStep3: "3. დააკოპირეთ URL → ჩასვით ქვემოთ",
    shareLinkReady: "✅ ბმული მზადაა! გაუგზავნეთ WhatsApp/Telegram-ში",
    shareLinkCreating: "⏳ ბმული იქმნება...",
    shareLinkFail: "❌ ვერ მოხერხდა. გამოიყენეთ მოწვევის ფაილი",
    shareOpenNetlify: "Netlify Drop-ის გახსნა",
    shareInviteFileHint:
      "HTML ფაილი. გაუგზავნეთ WhatsApp/Telegram-ით — მიმღები ხსნის მას ბრაუზერში და ხვდება აპლიკაციაში",
    shareFileWarning:
      "⚠️ ბმული მუშაობს მხოლოდ თქვენს მოწყობილობაზე (ლოკალური ფაილი). გამოიყენეთ «მოწვევის გადმოწერა» სხვებისთვის გასაგზავნად.",
    shareOpenInApp: "BudgetPRO-ში გახსნა",
    shareAppUrlLabel: "აპლიკაციის URL (თუ ინტერნეტში განთავსებულია)",
    shareAppUrlHint: "მაგ: https://yourname.github.io/budgetpro/",
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
    themeLabels: {
      white: "⬜ სუფთა თეთრი",
      default: "🌿 ტყის მწვანე",
      sunset: "🌅 თბილი მზის ჩასვლა",
      dark: "🌿 მუქი ღამე",
      navy: "🌌 შუაღამის ლურჯი",
      gold: "✨ ოქროს ბზინვა",
    },
    themeDescs: {
      white: "სუფთა, მინიმალისტური",
      default: "თბილი, ბუნებრივი",
      sunset: "თბილი მზის ჩასვლა",
      dark: "მუქი მწვანე",
      navy: "ვარსკვლავიანი ცა",
      gold: "ოქროს აქცენტები",
    },
    recurringFreqLabel: "სიხშირე",
    versionFooter: "ბიუჯეტPRO v2.2 · ოფლაინ 📴",
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
    helpContent: `<div style="font-family:inherit;line-height:1.7;color:var(--text);">
<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:var(--primary);">🌿 ბიუჯეტPRO — სრული სახელმძღვანელო</h2>

<div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);">
<b>💡 მთავარი იდეა:</b> ჩაიწერეთ შემოსავლები და ხარჯები, მართეთ ბიუჯეტი, გაუზიარეთ პროფილი ოჯახს — ყველაფერი ოფლაინ, რეგისტრაციის გარეშე.
</div>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">➕ ოპერაციის დამატება</h3>
<p>დააჭირეთ <b>მწვანე «+» ღილაკს</b> ბოლოში. აირჩიეთ ტიპი (ხარჯი/შემოსავალი), კატეგორია, შეიყვანეთ თანხა → «დამატება».</p>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🏠 მთავარი გვერდი</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🔢 <b>4 ბარათი</b> — ბალანსი, შემოსავლები, ხარჯები, საწყისი თანხა. შეეხეთ — ფილტრავს სიას.</li>
<li>👤 <b>პროფილის ბარი</b> — ზემოთ ჩანს <i>ვის პროფილი გახსნილია</i> და გადართვის ღილაკები.</li>
<li>🔍 <b>ძიება</b> — კატეგორიით, თანხით ან შენიშვნით.</li>
<li>📅 <b>ფილტრი</b> — დღეს / გუშინ / კვირა / თვე / ყველა დრო.</li>
<li>👈 <b>მარცხნივ გადაწევა</b> — მყისიერი წაშლა «გაუქმება» ღილაკით.</li>
<li>☝️ <b>ოპერაციაზე შეხება</b> — გახსნა რედაქტირებისთვის.</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">👥 პროფილები (რამდენიმე ბიუჯეტი)</h3>
<ul style="margin:8px 0 8px 16px;">
<li>10-მდე <b>დამოუკიდებელი პროფილი</b> — თითოეულს თავისი ისტორია, კატეგორიები და ბიუჯეტი.</li>
<li>შექმნა/გადარქმევა/წაშლა — პარამეტრები → პროფილები.</li>
<li>გადართვა — ავატარის ღილაკები მთავარ გვერდზე.</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🔗 სხვისთვის წვდომის გაზიარება</h3>
<ul style="margin:8px 0 8px 16px;">
<li>პარამეტრები → პროფილები → 🔗 ღილაკი → <b>«წვდომის შექმნა»</b></li>
<li>დაადგინეთ ნებართვები (რა შეუძლია სტუმარს, რა — არ შეუძლია)</li>
<li>დააჭირეთ <b>«ბმულის შექმნა»</b> → ბმული კოპირდება → გაუგზავნეთ WhatsApp/Telegram-ით</li>
<li>სტუმარი ხსნის ბმულს → იღებს <b>სუფთა ცარიელ პროფილს</b> (თქვენი მონაცემები მას არ ჩანს)</li>
<li>შეგიძლიათ დაადგინოთ <b>პაროლი</b> — მის გარეშე სტუმარი ვერ შევა</li>
<li>შეგიძლიათ <b>დაბლოკოთ</b> პროფილი (🔒 გადამრთველი) — სტუმარი დაბლოკვის ეკრანს დაინახავს</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">👤 სტუმრის რეჟიმი და გასვლა</h3>
<ul style="margin:8px 0 8px 16px;">
<li>მთავარ გვერდზე ჩანს <b>ლურჯი «სტუმრის პროფილი» ბარი</b> — თქვენ სტუმრის რეჟიმში ხართ.</li>
<li>დააჭირეთ <b>🚪 გასვლა</b> ღილაკს ამ ბარზე — დაბრუნდებით საკუთარ პროფილში.</li>
<li>ან გადადით პარამეტრებში — იქ იქნება გასვლის ღილაკი.</li>
<li>ნებართვები ნაჩვენებია ბმულის გახსნისას (✅ მწვანე = შეიძლება, ❌ წითელი = არ შეიძლება).</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">📊 სტატისტიკა</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🟢 სტატუსის ბარათი — ბიუჯეტის მდგომარეობის დეტალური ახსნა</li>
<li>🍩 კატეგორიების დიაგრამა · 📈 ბალანსის გრაფიკი · 📊 ტრენდები · 🗓 სიცხის რუკა</li>
<li>💰 ბიუჯეტის პროგრესი გაფრთხილებით გადაჭარბებისას</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">⚙️ პარამეტრები</h3>
<ul style="margin:8px 0 8px 16px;">
<li>💰 <b>ბიუჯეტები</b> — ყოველთვიური ლიმიტი კატეგორიის მიხედვით</li>
<li>🔄 <b>განმეორებადი ოპერაციები</b> — ქირა/კრედიტი ავტომატურად ემატება</li>
<li>⭐ <b>შაბლონები</b> — ხშირი ოპერაციების სწრაფი დამატება</li>
<li>🔒 <b>PIN + ბიომეტრია</b> (Face ID/Touch ID)</li>
<li>🎨 <b>6 ფერის სქემა</b> — 3 დღისა (თეთრი, მწვანე, მზის ჩასვლა) + 3 ღამის (ტყე, ლურჯი, ოქრო)</li>
<li>☁️ <b>ექსპორტი/იმპორტი</b> — JSON, CSV, PDF, სარეზერვო კოპია</li>
</ul>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">🧮 ინსტრუმენტები</h3>
<p>კალკულატორი ისტორიით · ვალუტის კონვერტერი (₽ $ € ₾ £) · ბლოკნოტი შენიშვნებისთვის</p>

<h3 style="font-size:16px;font-weight:800;margin:16px 0 8px;">💡 რჩევები</h3>
<ul style="margin:8px 0 8px 16px;">
<li>🌙/☀️ — სწრაფი თემის გადართვა (ღილაკი სათაურში)</li>
<li>🌐 — ენის შეცვლა (ru/en/ka)</li>
<li>📅 — ოპერაციის დამატებისას შეგიძლიათ ნებისმიერი თარიღი აირჩიოთ</li>
<li>Ctrl+Shift+R — თუ რამე არ განახლდება</li>
</ul>

<div style="background:var(--gold-pale);border-radius:14px;padding:14px;margin-top:16px;border-left:4px solid var(--gold);">
<b>🚀 შესაძლებლობები:</b> ოფლაინ აღრიცხვა · სტატისტიკა · მრავალი პროფილი · ბმულით გაზიარება · სტუმრის ნებართვები · PIN+ბიომეტრია · 3 ენა · 6 თემა · კონვერტერი · ბლოკნოტი · ექსპორტი · ბეკაპი
</div>
</div>`,
    guideNext: "შემდეგი",
    guideSkip: "გამოტოვება",
    guideFinish: "დასრულება",
    guideSteps: [
      {
        element: ".top-cards",
        title: "ბარათები",
        desc: "ბალანსი, შემოსავალი, ხარჯი.",
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
    biometryTitle: "🫆 ბიომეტრია",
    biometryDesc: "Face ID / Touch ID / თითის ანაბეჭდი",
    biometryToggleLabel: "ბიომეტრიით შესვლა",
    recurringDayLabel: "თვის დღე",
    themeDescs: {
      white: "სუფთა, მინიმალისტური",
      default: "თბილი, ბუნებრივი",
      sunset: "თბილი მზის ჩასვლა",
      dark: "მუქი მწვანე",
      navy: "ვარსკვლავიანი ცა",
      gold: "ოქროს აქცენტები",
    },
    themeLabels: {
      white: "⬜ სუფთა თეთრი",
      default: "🌿 ტყის მწვანე",
      sunset: "🌅 თბილი მზის ჩასვლა",
      dark: "🌿 მუქი ღამე",
      navy: "🌌 შუაღამის ლურჯი",
      gold: "✨ ოქროს ბზინვა",
    },
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
  },
};

let currentLang = localStorage.getItem("lang") || "ru";
function t(k) {
  const v = translations[currentLang]?.[k];
  return v !== undefined ? v : k;
}
function tObj(k) {
  const v = translations[currentLang]?.[k];
  return v && typeof v === "object" ? v : {};
}

// Проверка разрешения: владелец имеет всё, гость — только то что разрешено
function perm(p) {
  if (!sharedAccessProfile) return true;
  return sharedAccessProfile.perms[p] !== false;
}

// Выход из гостевого режима (возврат к своему профилю)
function exitGuestMode() {
  sharedAccessProfile = null;
  // Находим первый НЕ-гостевой профиль
  const ownerProf = profiles.find((p) => !p.isShared);
  if (ownerProf) {
    activeProfileId = ownerProf.id;
    categories = JSON.parse(JSON.stringify(window.initialCategories));
    incomeCategories = {
      Зарплата: { subcats: [] },
      Подарок: { subcats: [] },
      Фриланс: { subcats: [] },
    };
    loadProfileData(ownerProf.id);
  } else {
    // Создаём дефолтный профиль если всё удалили
    const newProf = { id: "default", name: "Я", emoji: "👤", color: "#2d6a4f" };
    profiles.push(newProf);
    activeProfileId = "default";
    transactions = [];
    startBalanceRub = 0;
    notebookPages = [];
    categories = JSON.parse(JSON.stringify(window.initialCategories));
    incomeCategories = {
      Зарплата: { subcats: [] },
      Подарок: { subcats: [] },
      Фриланс: { subcats: [] },
    };
    categoryBudgets = {};
    recurringOps = [];
    userTemplates = [];
    frequentStats = {};
  }
  saveGlobal();
  syncStartBalanceTransaction();
  init();
  showToast("✅ " + t("exitGuestDone"));
}

// Авто-обнаружение застрявшего гостевого режима:
// если sharedAccessProfile установлен, но его профиль не существует — сбрасываем
function checkAndFixGuestMode() {
  if (!sharedAccessProfile) return;
  const guestProf = profiles.find(
    (p) => p.id === sharedAccessProfile.profileId,
  );
  if (!guestProf) {
    console.warn("Guest profile not found, resetting guest mode");
    sharedAccessProfile = null;
    saveGlobal();
  }
}

// Применить ограничения UI по всему приложению
function applyPermRestrictions() {
  const fab = document.getElementById("fabBtn");
  if (fab) fab.style.display = perm("add") ? "" : "none";
  // Скрыть кнопки удаления если нет прав
  document
    .querySelectorAll(".op-delete")
    .forEach((btn) => (btn.style.display = perm("del") ? "" : "none"));
  // Вкладки с ограничениями
  const statsBtn = document.querySelector('.nav-btn[data-tab="stats"]');
  if (statsBtn) statsBtn.style.opacity = perm("stats") ? "1" : "0.4";
  const notesBtn = document.querySelector('.nav-btn[data-tab="notebook"]');
  if (notesBtn) notesBtn.style.opacity = perm("notes") ? "1" : "0.4";
  const catsBtn = document.querySelector('.nav-btn[data-tab="categories"]');
  if (catsBtn) catsBtn.style.opacity = perm("cats") ? "1" : "0.4";
}

// Хеш пароля (простой, без сервера)
async function hashSharePwd(pwd) {
  if (!pwd) return null;
  const data = new TextEncoder().encode(pwd + "share_salt_2024");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}
function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  applyTranslations();
  updateHeader();
  updateTopBlocks();
  setTab(currentTab);
  updateHeaderButtons();
}
const localeMap = { ru: "ru-RU", en: "en-US", ka: "ka-GE" };
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (translations[currentLang][k])
      el.textContent = translations[currentLang][k];
  });
  const logo = document.querySelector(".app-logo");
  if (logo) logo.textContent = t("appName");
  const fab = document.querySelector(".fab-text");
  if (fab) fab.textContent = t("add");
  // Card hints
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

// ============================================================
// ДАННЫЕ
// ============================================================
let transactions = [];
let startBalanceRub = 70000;
let displayCurrency = "GEL";
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
let calcHistory = [];
let convHistory = [];
let currentFilter = null;
let remindersEnabled = false;
let remindersInterval = "daily";
let reminderTimer = null;
let categoryCustomizations = {};
let statsPeriod = "thisMonth";
let historyFilter = "allTime";
// Новые
let categoryBudgets = {};
let recurringOps = [];
let pinHash = null;
let pinEnabled = false;
let biometryEnabled = false;
let biometryCredId = null;
let colorTheme = "default";
let userTemplates = [];
let frequentStats = {};
// Профили
let profiles = []; // [{id,name,emoji,color,shareSettings:{...}}]
let activeProfileId = "default";
// Shared access: null = owner device; object = guest device with limited perms
let sharedAccessProfile = null; // {profileId,perms:{add,del,edit,stats,notes,budgets,cats,export},pwHash}

// ============================================================
// ИКОНКИ
// ============================================================
// ============================================================
// ИКОНКИ КАТЕГОРИЙ И ПОДКАТЕГОРИЙ
// ============================================================
const categoryIcons = {
  // Расходы
  Коммуналка: { icon: "💡", color: "#f59e0b" },
  Продукты: { icon: "🛒", color: "#10b981" },
  "Заём банка": { icon: "🏦", color: "#ef4444" },
  "Ежемесячные взносы": { icon: "📅", color: "#8b5cf6" },
  Транспорт: { icon: "🚌", color: "#3b82f6" },
  "Неожиданные траты": { icon: "⚡", color: "#f97316" },
  Еда: { icon: "🍽️", color: "#f59e0b" },
  Кафе: { icon: "☕", color: "#a16207" },
  Рестораны: { icon: "🍴", color: "#c2440a" },
  Одежда: { icon: "👗", color: "#ec4899" },
  Здоровье: { icon: "💊", color: "#22c55e" },
  Аптека: { icon: "💊", color: "#16a34a" },
  Спорт: { icon: "🏃", color: "#3b82f6" },
  Развлечения: { icon: "🎭", color: "#8b5cf6" },
  Путешествия: { icon: "✈️", color: "#06b6d4" },
  Образование: { icon: "📚", color: "#6366f1" },
  Животные: { icon: "🐾", color: "#f97316" },
  Красота: { icon: "💄", color: "#ec4899" },
  Техника: { icon: "📱", color: "#64748b" },
  Ремонт: { icon: "🔧", color: "#78716c" },
  Страховка: { icon: "🛡️", color: "#14b8a6" },
  Подписки: { icon: "📲", color: "#8b5cf6" },
  Подарки: { icon: "🎁", color: "#f43f5e" },
  Хобби: { icon: "🎨", color: "#7c3aed" },
  Бытовые: { icon: "🏠", color: "#84cc16" },
  Медицина: { icon: "🏥", color: "#22c55e" },
  Связь: { icon: "📡", color: "#0ea5e9" },
  // Доходы
  Зарплата: { icon: "💼", color: "#22c55e" },
  Подарок: { icon: "🎁", color: "#ec4899" },
  Фриланс: { icon: "💻", color: "#06b6d4" },
  Инвестиции: { icon: "📈", color: "#22c55e" },
  Пенсия: { icon: "👴", color: "#84cc16" },
  Аренда: { icon: "🏘️", color: "#f59e0b" },
  Дивиденды: { icon: "💹", color: "#10b981" },
  Кэшбек: { icon: "💳", color: "#6366f1" },
};

// Иконки подкатегорий — большой словарь по ключевым словам
const subcatIconMap = [
  // Коммуналка
  [
    "свет",
    "электр",
    "electric",
    "light",
    "energy",
    "ენერგია",
    "სინათლე",
    "ელექტრო",
    "💡",
  ],
  ["вода", "water", "წყალი", "🚿"],
  ["газ", "gas", "გაზი", "♨️"],
  ["интернет", "internet", "wifi", "ინტერნეტი", "📶"],
  ["телефон", "phone", "phone", "ტელეფონი", "📞"],
  ["мусор", "trash", "garbage", "ნარჩენი", "🗑️"],
  ["тепл", "heating", "გათბობა", "🔥"],
  ["кварплат", "rent", "house", "სახლი", "🏠"],
  // Продукты
  ["хлеб", "bread", "პური", "🍞"],
  ["молоко", "milk", "რძე", "🥛"],
  ["яйц", "egg", "კვერცხი", "🥚"],
  ["сыр", "cheese", "ყველი", "🧀"],
  ["мясо", "meat", "ხორცი", "🥩"],
  ["рыб", "fish", "თევზი", "🐟"],
  ["зелень", "greens", "зелёный", "vegetabl", "herb", "მწვანილი", "🥬"],
  ["овощ", "vegetabl", "ბოსტნეული", "🥦"],
  ["фрукт", "fruit", "ხილი", "🍎"],
  ["яблок", "apple", "ვაშლი", "🍏"],
  ["банан", "banana", "ბანანი", "🍌"],
  ["помидор", "tomato", "პომიდორი", "🍅"],
  ["огурец", "cucumb", "კიტრი", "🥒"],
  ["картофель", "картошк", "potato", "კარტოფილი", "🥔"],
  ["колбас", "sausage", "ძეხვი", "🌭"],
  ["курица", "chicken", "ქათამი", "🍗"],
  ["масло", "butter", "oil", "კარაქი", "🧈"],
  ["сахар", "sugar", "შაქარი", "🍬"],
  ["соль", "salt", "მარილი", "🧂"],
  ["крупа", "rice", "рис", "ბრინჯი", "🌾"],
  ["макарон", "pasta", "მაკარონი", "🍝"],
  ["кофе", "coffee", "ყავა", "☕"],
  ["чай", "tea", "ჩაი", "🍵"],
  ["вино", "wine", "ღვინო", "🍷"],
  ["пиво", "beer", "ლუდი", "🍺"],
  ["сок", "juice", "წვენი", "🧃"],
  ["вода", "water", "water", "წყალი", "💧"],
  ["торт", "cake", "ნამცხვარი", "🎂"],
  ["шоколад", "chocol", "შოკოლადი", "🍫"],
  ["мороженое", "ice cream", "ნაყინი", "🍦"],
  // Транспорт
  ["метро", "metro", "subway", "მეტრო", "🚇"],
  ["автобус", "bus", "ავტობუსი", "🚌"],
  ["маршрутк", "minibus", "marshrutk", "მარშრუტი", "🚐"],
  ["трамвай", "tram", "ტრამვაი", "🚋"],
  ["самолёт", "самолет", "flight", "airplane", "თვითმფრინავი", "✈️"],
  ["такси", "taxi", "ტაქსი", "🚕"],
  ["бензин", "fuel", "petrol", "benzin", "საწვავი", "⛽"],
  ["парковк", "parking", "პარკინგი", "🅿️"],
  ["поезд", "train", "მატარებელი", "🚂"],
  ["велосипед", "bike", "ველოსიპედი", "🚲"],
  // Банки/займы
  ["tbc", "tbc bank", "🏦"],
  ["sakartvelo", "საქართველო", "bank", "ბანკი", "🏛️"],
  ["кредит", "credit", "კრედიტი", "💳"],
  ["ипотека", "mortgage", "იპოთეკა", "🏠"],
  ["ломбард", "pawn", "ლომბარდი", "💍"],
  // Здоровье
  ["врач", "doctor", "лечение", "лекарств", "medicine", "ექიმი", "💊"],
  ["стоматолог", "dentist", "დენტისტი", "🦷"],
  ["анализ", "analysis", "test", "ანალიზი", "🔬"],
  ["аптека", "pharmacy", "apteka", "აფთიაქი", "💊"],
  ["больниц", "hospital", "hospital", "საავადმყოფო", "🏥"],
  ["спорт", "gym", "sport", "სპორტი", "🏋️"],
  ["витамин", "vitamin", "ვიტამინი", "💊"],
  // Одежда
  ["обув", "shoes", "ფეხსაცმელი", "👟"],
  ["рубашк", "shirt", "პერანგი", "👕"],
  ["пальто", "coat", "куртк", "jacket", "ქურთუკი", "🧥"],
  ["платье", "dress", "კაბა", "👗"],
  ["джинс", "jeans", "ჯინსი", "👖"],
  ["нижнее", "underwear", "ქვეთეთრეული", "🩲"],
  // Развлечения
  ["кино", "cinema", "movie", "კინო", "🎬"],
  ["театр", "theater", "theatre", "თეატრი", "🎭"],
  ["концерт", "concert", "კონცერტი", "🎵"],
  ["ресторан", "restaurant", "რესტორანი", "🍴"],
  ["кафе", "cafe", "coffee", "კაფე", "☕"],
  ["бар", "bar", "ბარი", "🍺"],
  ["игр", "game", "gaming", "თამაში", "🎮"],
  ["книг", "book", "წიგნი", "📚"],
  ["музыка", "music", "music", "მუსიკა", "🎶"],
  ["подписк", "subscript", "გამოწერა", "📲"],
  ["netflix", "netflix", "netflix", "📺"],
  ["spotify", "spotify", "spotify", "🎧"],
  // Образование
  ["школ", "school", "სკოლა", "🏫"],
  ["универ", "university", "college", "უნივერსიტეტი", "🎓"],
  ["курс", "course", "კურსი", "📖"],
  ["учебник", "textbook", "სახელმძღვანელო", "📘"],
  // Животные
  ["корм", "pet food", "food", "საკვები", "🐾"],
  ["ветеринар", "vet", "ვეტერინარი", "🐾"],
  ["кошка", "cat", "კატა", "🐱"],
  ["собак", "dog", "ძაღლი", "🐶"],
  // Зарплата/доход
  ["зарплат", "salary", "wage", "ხელფასი", "💰"],
  ["аванс", "advance", "ავანსი", "💵"],
  ["бонус", "bonus", "ბონუსი", "🎯"],
  ["премия", "premium", "prize", "პრემია", "🏆"],
  ["фриланс", "freelanc", "ფრილანსი", "💻"],
  ["инвестиц", "invest", "ინვესტიცია", "📈"],
  ["дивиденд", "dividend", "დივიდენდი", "💹"],
  ["аренд", "rent", "income", "ქირა", "🏘️"],
  // Общие
  ["страховк", "insurance", "დაზღვევა", "🛡️"],
  ["налог", "tax", "გადასახადი", "📋"],
  ["штраф", "fine", "penalty", "ჯარიმა", "🚫"],
  ["ремонт", "repair", "სარემონტო", "🔧"],
  ["быт", "household", "home", "სახლი", "🏠"],
];

// Получить иконку подкатегории по имени
function getSubcatIcon(subcat) {
  if (!subcat) return "";
  const s = subcat.toLowerCase();
  for (const entry of subcatIconMap) {
    const icon = entry[entry.length - 1];
    for (let i = 0; i < entry.length - 1; i++) {
      if (s.includes(entry[i].toLowerCase())) return icon;
    }
  }
  return "🔸";
}

function getCategoryStyle(cat, type) {
  if (categoryCustomizations?.[cat])
    return {
      icon: categoryCustomizations[cat].icon,
      color: categoryCustomizations[cat].color,
    };
  if (categoryIcons[cat])
    return { icon: categoryIcons[cat].icon, color: categoryIcons[cat].color };
  // Auto-detect by category name
  const cn = cat.toLowerCase();
  if (cn.includes("коммунал") || cn.includes("utility"))
    return { icon: "💡", color: "#f59e0b" };
  if (cn.includes("продукт") || cn.includes("grocery") || cn.includes("food"))
    return { icon: "🛒", color: "#10b981" };
  if (cn.includes("транспорт") || cn.includes("transport"))
    return { icon: "🚌", color: "#3b82f6" };
  if (cn.includes("здоровь") || cn.includes("health") || cn.includes("медиц"))
    return { icon: "💊", color: "#22c55e" };
  if (cn.includes("одежд") || cn.includes("clothes"))
    return { icon: "👗", color: "#ec4899" };
  if (
    cn.includes("кафе") ||
    cn.includes("ресторан") ||
    cn.includes("cafe") ||
    cn.includes("restaurant")
  )
    return { icon: "🍴", color: "#f59e0b" };
  if (cn.includes("банк") || cn.includes("bank") || cn.includes("кредит"))
    return { icon: "🏦", color: "#ef4444" };
  if (cn.includes("спорт") || cn.includes("sport") || cn.includes("gym"))
    return { icon: "🏃", color: "#3b82f6" };
  if (cn.includes("развлеч") || cn.includes("entertainment"))
    return { icon: "🎭", color: "#8b5cf6" };
  if (
    cn.includes("образован") ||
    cn.includes("education") ||
    cn.includes("учёб")
  )
    return { icon: "📚", color: "#6366f1" };
  if (cn.includes("путешеств") || cn.includes("travel"))
    return { icon: "✈️", color: "#06b6d4" };
  if (cn.includes("зарплат") || cn.includes("salary"))
    return { icon: "💼", color: "#22c55e" };
  if (cn.includes("подарок") || cn.includes("gift"))
    return { icon: "🎁", color: "#ec4899" };
  if (cn.includes("фриланс") || cn.includes("freelan"))
    return { icon: "💻", color: "#06b6d4" };
  if (cn.includes("инвестиц") || cn.includes("invest"))
    return { icon: "📈", color: "#22c55e" };
  return type === "income"
    ? { icon: "💰", color: "#22c55e" }
    : { icon: "💸", color: "#ef4444" };
}
function getOpEmoji(tx) {
  const style = getCategoryStyle(tx.category || "", tx.type || "expense");
  return style.icon;
}

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
function esc(s) {
  if (!s) return "";
  return String(s).replace(
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
function debounce(fn, ms) {
  let t;
  return function (...a) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, a), ms);
  };
}

// Хеш пин-кода
async function hashPin(pin) {
  const data = new TextEncoder().encode(pin + "budget_salt_2024");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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

// Фильтр истории по времени
function filterByTime(list, filter) {
  if (filter === "allTime") return list;
  const now = new Date();
  const todayStr = today();
  const d1 = new Date();
  d1.setDate(d1.getDate() - 1);
  const ystStr = d1.toISOString().slice(0, 10);
  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const tdaStr = d2.toISOString().slice(0, 10);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  if (filter === "today") return list.filter((tx) => tx.date === todayStr);
  if (filter === "yesterday") return list.filter((tx) => tx.date === ystStr);
  if (filter === "twoDaysAgo") return list.filter((tx) => tx.date === tdaStr);
  if (filter === "thisWeek")
    return list.filter(
      (tx) => tx.date && new Date(tx.date + "T00:00:00") >= weekAgo,
    );
  if (filter === "thisMonth")
    return list.filter(
      (tx) => tx.date && new Date(tx.date + "T00:00:00") >= monthStart,
    );
  return list;
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
// ШАБЛОНЫ
// ============================================================
function saveUserTemplates() {
  /* merged into saveAll */
}
function removeUserTemplate(id) {
  userTemplates = userTemplates.filter((tpl) => tpl.id !== id);
  saveAll();
}
function addUserTemplate(tpl) {
  userTemplates.push({ id: Date.now(), ...tpl });
  saveAll();
}
function saveFrequentStats() {
  /* merged into saveAll */
}
function updateFrequentStats(tx) {
  const k = `${tx.category}|${tx.amountRub}`;
  frequentStats[k] = (frequentStats[k] || 0) + 1; /* saveAll called by caller */
}
function getFrequentSuggestions(limit = 5) {
  return Object.entries(frequentStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => {
      const [cat, amt] = k.split("|");
      return { type: "auto", category: cat, amountRub: parseFloat(amt) };
    });
}

// Рендер предложений с кнопкой «✕» для удаления
function updateSuggestions() {
  const sl = document.getElementById("suggestionsList");
  if (!sl) return;
  const auto = getFrequentSuggestions(3);
  const manual = userTemplates.slice(0, 6);
  let html = "";
  if (auto.length) {
    html += `<div class="suggestions-subtitle">⚡ ${t("quickSuggestions")}</div>`;
    auto.forEach((s) => {
      // Ключ для удаления из frequentStats
      const autoKey = encodeURIComponent(`${s.category}|${s.amountRub}`);
      html += `<div class="suggestion-item-wrap">
        <button class="suggestion-item" data-type="auto" data-category="${esc(s.category)}" data-amount="${s.amountRub}">
          <span>📌 ${esc(s.category)} · ${fmt(s.amountRub)}</span>
        </button>
        <button class="suggestion-delete-btn" data-autokey="${autoKey}" title="${t("deleteTemplate")}">✕</button>
      </div>`;
    });
  }
  if (manual.length) {
    html += `<div class="suggestions-subtitle">⭐ ${t("yourTemplates")}</div>`;
    manual.forEach((tpl) => {
      const icon = tpl.type === "expense" ? "💸" : "💰";
      html += `<div class="suggestion-item-wrap">
        <button class="suggestion-item" data-type="manual" data-id="${tpl.id}" data-category="${esc(tpl.category)}" data-subcategory="${esc(tpl.subcategory || "")}" data-amount="${tpl.amountRub}" data-note="${esc(tpl.note || "")}" data-tpltype="${tpl.type}">
          <span>${icon} ${esc(tpl.name || tpl.category)} · ${fmt(tpl.amountRub)}</span>
        </button>
        <button class="suggestion-delete-btn" data-tplid="${tpl.id}" title="${t("deleteTemplate")}">✕</button>
      </div>`;
    });
  }
  if (!auto.length && !manual.length)
    html = `<div class="suggestions-empty" style="padding:12px;color:var(--text-muted);font-size:13px;">${t("noStatsYet").split("\n")[0]}</div>`;
  sl.innerHTML = html;

  // Применить шаблон при клике
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
          (tp) => tp.id === parseInt(btn.dataset.id),
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
        const cs = document.getElementById("addCategorySelect");
        if (cs) {
          cs.innerHTML = tpl.type === "expense" ? eo : io;
          cs.value = tpl.category;
          cs.dispatchEvent(new Event("change"));
        }
        if (tpl.subcategory)
          setTimeout(() => {
            const s = document.getElementById("addSubcatSelect");
            if (s) s.value = tpl.subcategory;
          }, 60);
        const af = document.getElementById("addAmount");
        if (af) af.value = toDisp(tpl.amountRub).toFixed(2);
        const an = document.getElementById("addNote");
        if (an && tpl.note) an.value = tpl.note;
      }
    });
  });

  // Удалить ✕ — и для auto (частые), и для manual (шаблоны)
  sl.querySelectorAll(".suggestion-delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (btn.dataset.tplid) {
        // Удаление сохранённого шаблона
        askConfirm(
          t("deleteTemplate"),
          () => {
            removeUserTemplate(parseInt(btn.dataset.tplid));
            updateSuggestions();
            showToast(t("deleted"));
          },
          { icon: "🗑️" },
        );
      } else if (btn.dataset.autokey) {
        // Удаление из статистики частых операций
        askConfirm(
          t("deleteTemplate"),
          () => {
            const key = decodeURIComponent(btn.dataset.autokey);
            delete frequentStats[key];
            saveAll();
            updateSuggestions();
            showToast(t("deleted"));
          },
          { icon: "🗑️" },
        );
      }
    });
  });
}

let calcExpr = "";

// ============================================================
// ЗАГРУЗКА / СОХРАНЕНИЕ
// ============================================================
// ============================================================
// ПРОФИЛИ — ключевые функции
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
    // Миграция: первый запуск — создаём дефолтный профиль
    profiles = [{ id: "default", name: "Я", emoji: "👤", color: "#2d6a4f" }];
    activeProfileId = "default";
    return;
  }
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
  colorTheme = g.colorTheme || localStorage.getItem("colorTheme") || "default";
  displayCurrency = g.displayCurrency || "GEL";
  if (g.exchangeRates) exchangeRates = { ...exchangeRates, ...g.exchangeRates };
  applyColorTheme(colorTheme);
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
    // Миграция старых данных в дефолтный профиль
    if (pid === "default") {
      const old = localStorage.getItem("budget_pro_full");
      if (old) {
        const d = JSON.parse(old);
        // перекладываем в профильное хранилище
        localStorage.setItem(key, JSON.stringify(d));
        // и читаем из него
        loadProfileDataFromObj(d);
        return;
      }
    }
    // Новый профиль — пустые данные
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
  loadProfileDataFromObj(JSON.parse(raw));
}
function loadProfileDataFromObj(d) {
  transactions = d.transactions || [];
  startBalanceRub = d.startBalanceRub ?? 0;
  if (d.notebookPages) notebookPages = d.notebookPages;
  if (d.categories) categories = d.categories;
  if (d.categoryCustomizations)
    categoryCustomizations = d.categoryCustomizations;
  if (d.incomeCategories) {
    if (Array.isArray(d.incomeCategories)) {
      incomeCategories = {};
      d.incomeCategories.forEach((c) => {
        incomeCategories[c] = { subcats: [] };
      });
    } else incomeCategories = d.incomeCategories;
  }
  calcHistory = d.calcHistory || [];
  convHistory = d.convHistory || [];
  userTemplates = d.userTemplates || [];
  frequentStats = d.frequentStats || {};
  categoryBudgets = d.categoryBudgets || {};
  recurringOps = d.recurringOps || [];
  categoryCustomizations = d.categoryCustomizations || {};
  transactions.forEach((tx) => {
    if (
      tx.category === "Начальная сумма" ||
      tx.category === "Starting amount" ||
      tx.category === "საწყისი თანხა"
    )
      tx._initial = true;
  });
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
    }),
  );
}

function switchProfile(pid) {
  // Если переключаемся на НЕ-гостевой профиль — выходим из гостевого режима
  const targetProf = profiles.find((p) => p.id === pid);
  if (targetProf && !targetProf.isShared && sharedAccessProfile) {
    sharedAccessProfile = null;
  }
  // Если переходим на гостевой профиль — восстанавливаем его разрешения
  if (targetProf && targetProf.isShared) {
    sharedAccessProfile = {
      profileId: pid,
      perms: targetProf.sharePerms || { ...DEFAULT_PERMS },
    };
  }
  // Сохраняем текущий профиль
  saveProfileData();
  activeProfileId = pid;
  // Загружаем новый профиль
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
}

function loadAll() {
  loadProfiles();
  loadProfileData(activeProfileId);
  syncStartBalanceTransaction();
  applyRecurringOps();
  checkAndFixGuestMode();
}
function saveAll() {
  saveProfileData();
  saveGlobal();
}
function syncStartBalanceTransaction() {
  const idx = transactions.findIndex(
    (tx) => tx._initial === true && tx.type === "income",
  );
  if (idx !== -1) {
    transactions[idx].amountRub = startBalanceRub;
  } else if (startBalanceRub > 0) {
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
    if (op.freq === "monthly") {
      const targetDay = op.day || 1;
      const targetDate = new Date(now.getFullYear(), now.getMonth(), targetDay);
      const targetStr = targetDate.toISOString().slice(0, 10);
      const monthKey = targetStr.slice(0, 7);
      if (now.getDate() >= targetDay && op.lastApplied !== monthKey) {
        op.lastApplied = monthKey;
        transactions.push({
          type: op.type,
          category: op.category,
          subcategory: op.subcategory || null,
          amountRub: op.amountRub,
          date: targetStr,
          note: (op.note || "") + " 🔄",
          _recurring: true,
        });
        applied++;
      }
    } else if (op.freq === "daily") {
      if (op.lastApplied !== todayStr) {
        op.lastApplied = todayStr;
        transactions.push({
          type: op.type,
          category: op.category,
          subcategory: op.subcategory || null,
          amountRub: op.amountRub,
          date: todayStr,
          note: (op.note || "") + " 🔄",
          _recurring: true,
        });
        applied++;
      }
    } else if (op.freq === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const lastDate = op.lastApplied
        ? new Date(op.lastApplied + "T00:00:00")
        : weekAgo;
      if (lastDate <= weekAgo) {
        op.lastApplied = todayStr;
        transactions.push({
          type: op.type,
          category: op.category,
          subcategory: op.subcategory || null,
          amountRub: op.amountRub,
          date: todayStr,
          note: (op.note || "") + " 🔄",
          _recurring: true,
        });
        applied++;
      }
    }
  });
  if (applied > 0) {
    transactions.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    saveAll();
    setTimeout(() => showToast(`${t("recurringApplied")} ${applied}`), 800);
  }
}

// ============================================================
// ЦВЕТОВЫЕ ТЕМЫ
// ============================================================
const COLOR_THEMES = {
  // ======================== ДНЕВНЫЕ ========================
  white: {
    label: "⬜ Чистый белый",
    dark: false,
    accent: "#4f46e5",
    vars: {
      "--cream": "#ffffff",
      "--cream-dark": "#f1f5f9",
      "--cream-border": "#cbd5e1",
      "--primary": "#4f46e5",
      "--primary-med": "#6366f1",
      "--primary-light": "#a5b4fc",
      "--primary-pale": "#eef2ff",
      "--gold": "#d97706",
      "--gold-pale": "#fffbeb",
      "--gold-border": "#fcd34d",
      "--income-color": "#059669",
      "--income-pale": "#ecfdf5",
      "--expense-color": "#dc2626",
      "--expense-pale": "#fef2f2",
      "--balance-pale": "#eff6ff",
      "--text": "#0f172a",
      "--text-soft": "#334155",
      "--text-muted": "#94a3b8",
      "--card-bg": "rgba(255,255,255,1.0)",
      "--shadow-sm":
        "0 1px 8px rgba(15,23,42,0.08),0 0 0 1px rgba(15,23,42,0.05)",
      "--shadow-md":
        "0 4px 24px rgba(15,23,42,0.12),0 1px 4px rgba(15,23,42,0.06)",
      "--shadow-lg": "0 12px 48px rgba(15,23,42,0.16)",
      "--radius-sm": "10px",
      "--radius-md": "18px",
      "--radius-lg": "26px",
      "--radius-xl": "38px",
    },
  },
  default: {
    label: "🌿 Лесной зелёный",
    dark: false,
    accent: "#2d6a4f",
    vars: {
      "--cream": "#faf8f2",
      "--cream-dark": "#f0ebe0",
      "--cream-border": "#e4ddd0",
      "--primary": "#2d6a4f",
      "--primary-med": "#40916c",
      "--primary-light": "#74c69d",
      "--primary-pale": "#eaf5ee",
      "--gold": "#d4860a",
      "--gold-pale": "#fef3d8",
      "--gold-border": "#f5d47a",
      "--income-color": "#1a7340",
      "--income-pale": "#e8f5ed",
      "--expense-color": "#c13515",
      "--expense-pale": "#fceae5",
      "--balance-pale": "#e8f0fe",
      "--text": "#1c1c1c",
      "--text-soft": "#4a4a4a",
      "--text-muted": "#888888",
      "--card-bg": "rgba(255,255,255,0.96)",
      "--shadow-sm": "0 2px 12px rgba(45,106,79,0.10)",
      "--shadow-md": "0 6px 28px rgba(45,106,79,0.14)",
      "--shadow-lg": "0 12px 48px rgba(45,106,79,0.18)",
      "--radius-sm": "14px",
      "--radius-md": "22px",
      "--radius-lg": "32px",
      "--radius-xl": "44px",
    },
  },
  sunset: {
    label: "🌅 Тёплый закат",
    dark: false,
    accent: "#c2440a",
    vars: {
      "--cream": "#fff8f0",
      "--cream-dark": "#fdecd8",
      "--cream-border": "#f8d4b0",
      "--primary": "#c2440a",
      "--primary-med": "#e0581a",
      "--primary-light": "#f59060",
      "--primary-pale": "#fff0e4",
      "--gold": "#e08c10",
      "--gold-pale": "#fff6dc",
      "--gold-border": "#f0cc60",
      "--income-color": "#1d7a40",
      "--income-pale": "#eaf6ef",
      "--expense-color": "#c41a0a",
      "--expense-pale": "#fdeae6",
      "--balance-pale": "#e8f0fe",
      "--text": "#1c0c04",
      "--text-soft": "#5a2c10",
      "--text-muted": "#b07040",
      "--card-bg": "rgba(255,253,248,0.97)",
      "--shadow-sm": "0 2px 14px rgba(194,68,10,0.12)",
      "--shadow-md": "0 6px 30px rgba(194,68,10,0.18)",
      "--shadow-lg": "0 14px 52px rgba(194,68,10,0.22)",
      "--radius-sm": "14px",
      "--radius-md": "22px",
      "--radius-lg": "32px",
      "--radius-xl": "44px",
    },
  },
  // ======================== НОЧНЫЕ ========================
  dark: {
    label: "🌿 Зелёная ночь",
    dark: true,
    accent: "#52b788",
    vars: {
      "--cream": "#141f1a",
      "--cream-dark": "#1c2c24",
      "--cream-border": "#2a3d30",
      "--primary": "#52b788",
      "--primary-med": "#74c69d",
      "--primary-light": "#95d5b2",
      "--primary-pale": "#162a1f",
      "--gold": "#d4a020",
      "--gold-pale": "#2a2010",
      "--gold-border": "#5a4010",
      "--income-color": "#52b788",
      "--income-pale": "#0f2218",
      "--expense-color": "#e07060",
      "--expense-pale": "#2a100a",
      "--balance-pale": "#101830",
      "--text": "#f0ece4",
      "--text-soft": "#b8c0b0",
      "--text-muted": "#728a78",
      "--card-bg": "rgba(28,44,36,0.97)",
      "--shadow-sm": "0 2px 14px rgba(0,0,0,0.35)",
      "--shadow-md": "0 6px 30px rgba(0,0,0,0.45)",
      "--shadow-lg": "0 12px 52px rgba(0,0,0,0.55)",
      "--radius-sm": "14px",
      "--radius-md": "22px",
      "--radius-lg": "32px",
      "--radius-xl": "44px",
    },
  },
  navy: {
    label: "🌌 Полночный синий",
    dark: true,
    accent: "#60a5fa",
    vars: {
      "--cream": "#060b14",
      "--cream-dark": "#0c1628",
      "--cream-border": "#1a2e50",
      "--primary": "#60a5fa",
      "--primary-med": "#93c5fd",
      "--primary-light": "#bfdbfe",
      "--primary-pale": "#0a1830",
      "--gold": "#fbbf24",
      "--gold-pale": "#1a1400",
      "--gold-border": "#3c2c00",
      "--income-color": "#34d399",
      "--income-pale": "#051812",
      "--expense-color": "#f87171",
      "--expense-pale": "#180606",
      "--balance-pale": "#06101e",
      "--text": "#e2ecff",
      "--text-soft": "#90b8e0",
      "--text-muted": "#406898",
      "--card-bg": "rgba(8,14,30,0.98)",
      "--shadow-sm": "0 2px 18px rgba(0,0,0,0.65)",
      "--shadow-md": "0 6px 38px rgba(0,0,0,0.78)",
      "--shadow-lg": "0 16px 64px rgba(0,0,0,0.88)",
      "--radius-sm": "14px",
      "--radius-md": "22px",
      "--radius-lg": "32px",
      "--radius-xl": "44px",
    },
  },
  gold: {
    label: "✨ Золотое напыление",
    dark: true,
    accent: "#f59e0b",
    vars: {
      "--cream": "#1a1a1e",
      "--cream-dark": "#24242c",
      "--cream-border": "#38383c",
      "--primary": "#f59e0b",
      "--primary-med": "#fbbf24",
      "--primary-light": "#fcd34d",
      "--primary-pale": "#2c2510",
      "--gold": "#f59e0b",
      "--gold-pale": "#2a2010",
      "--gold-border": "#504010",
      "--income-color": "#4ade80",
      "--income-pale": "#101a10",
      "--expense-color": "#fb7185",
      "--expense-pale": "#1e1018",
      "--balance-pale": "#18182a",
      "--text": "#f0ece4",
      "--text-soft": "#c8b890",
      "--text-muted": "#887860",
      "--card-bg": "rgba(26,26,30,0.98)",
      "--shadow-sm": "0 2px 18px rgba(0,0,0,0.55)",
      "--shadow-md": "0 6px 38px rgba(0,0,0,0.68)",
      "--shadow-lg": "0 16px 64px rgba(0,0,0,0.80)",
      "--radius-sm": "14px",
      "--radius-md": "22px",
      "--radius-lg": "32px",
      "--radius-xl": "44px",
    },
  },
};

function applyColorTheme(themeKey) {
  colorTheme = themeKey || "default";
  localStorage.setItem("colorTheme", colorTheme);
  const theme = COLOR_THEMES[colorTheme];
  if (!theme) return;

  // 1. Убираем все старые классы тем с body
  [
    "theme-white",
    "theme-default",
    "theme-sunset",
    "theme-dark",
    "theme-navy",
    "theme-gold",
    "dark",
  ].forEach((c) => document.body.classList.remove(c));

  // 2. Добавляем dark и класс темы
  if (theme.dark) document.body.classList.add("dark");
  document.body.classList.add("theme-" + colorTheme);

  // 3. КЛЮЧЕВОЙ ФИКСe: ставим переменные прямо на body.style
  //    — это перебивает любые .dark, .theme-x правила на body
  const bs = document.body.style;
  // Сначала сбрасываем старые инлайн-переменные
  const allVarKeys = [
    "--cream",
    "--cream-dark",
    "--cream-border",
    "--primary",
    "--primary-med",
    "--primary-light",
    "--primary-pale",
    "--gold",
    "--gold-pale",
    "--gold-border",
    "--income-color",
    "--income-pale",
    "--expense-color",
    "--expense-pale",
    "--balance-pale",
    "--text",
    "--text-soft",
    "--text-muted",
    "--card-bg",
    "--shadow-sm",
    "--shadow-md",
    "--shadow-lg",
    "--radius-sm",
    "--radius-md",
    "--radius-lg",
    "--radius-xl",
  ];
  allVarKeys.forEach((k) => bs.removeProperty(k));
  // Применяем новые
  Object.entries(theme.vars).forEach(([k, v]) => bs.setProperty(k, v));

  // 4. Убираем спецэффекты предыдущей темы
  document.getElementById("themeStars")?.remove();
  document.getElementById("themeShimmer")?.remove();
  document.getElementById("themeAurora")?.remove();

  // 5. Спецэффекты для ночных тем
  const injectStyle = (id, css) => {
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = css;
      document.head.appendChild(s);
    }
  };

  if (colorTheme === "navy") {
    injectStyle(
      "navyKf",
      "@keyframes starsFloat{0%{transform:translateY(0);}100%{transform:translateY(-60px);}}@keyframes starsTwinkle{0%,100%{opacity:.3;}50%{opacity:1;}}",
    );
    const el = document.createElement("canvas");
    el.id = "themeStars";
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.85;";
    document.body.insertBefore(el, document.body.firstChild);
    const ctx = el.getContext("2d");
    function drawStars() {
      el.width = window.innerWidth;
      el.height = window.innerHeight;
      ctx.clearRect(0, 0, el.width, el.height);
      const count = Math.floor((el.width * el.height) / 6000);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * el.width,
          y = Math.random() * el.height;
        const r = Math.random() * 1.5 + 0.3;
        const a = Math.random() * 0.8 + 0.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${180 + Math.random() * 75},${200 + Math.random() * 55},255,${a})`;
        ctx.fill();
      }
      // Туманность
      const g = ctx.createRadialGradient(
        el.width * 0.3,
        el.height * 0.2,
        0,
        el.width * 0.3,
        el.height * 0.2,
        el.width * 0.4,
      );
      g.addColorStop(0, "rgba(60,100,240,0.06)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, el.width, el.height);
    }
    drawStars();
    window.addEventListener("resize", drawStars, { once: true });
  }

  if (colorTheme === "gold") {
    injectStyle(
      "goldKf",
      "@keyframes goldFloat{0%{transform:translateY(0) rotate(0deg);opacity:0;}20%{opacity:1;}80%{opacity:.8;}100%{transform:translateY(-120px) rotate(360deg);opacity:0;}}@keyframes goldPulse{0%,100%{opacity:.4;}50%{opacity:.9;}}",
    );
    const el = document.createElement("div");
    el.id = "themeShimmer";
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;";
    // Градиентный фон
    el.innerHTML = `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 30% 20%,rgba(251,191,36,.09) 0%,transparent 70%),radial-gradient(ellipse 60% 50% at 75% 80%,rgba(245,158,11,.07) 0%,transparent 70%);animation:goldPulse 4s ease-in-out infinite;"></div>`;
    // Частицы
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      const sz = Math.random() * 4 + 2;
      const colors = [
        "rgba(251,191,36,.7)",
        "rgba(245,158,11,.8)",
        "rgba(253,224,71,.6)",
        "rgba(217,119,6,.9)",
      ];
      p.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 100}%;bottom:${Math.random() * 30 - 10}%;
        animation:goldFloat ${4 + Math.random() * 8}s ${Math.random() * 6}s ease-in infinite;
        box-shadow:0 0 ${sz * 3}px ${colors[0]};`;
      el.appendChild(p);
    }
    document.body.insertBefore(el, document.body.firstChild);
  }

  if (colorTheme === "sunset") {
    injectStyle(
      "sunsetKf",
      "@keyframes sunsetGlow{0%,100%{opacity:.6;}50%{opacity:1;}}",
    );
    const el = document.createElement("div");
    el.id = "themeAurora";
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(251,146,60,.08) 0%,transparent 70%),radial-gradient(ellipse 60% 40% at 80% 100%,rgba(217,119,6,.07) 0%,transparent 60%);animation:sunsetGlow 5s ease-in-out infinite;";
    document.body.insertBefore(el, document.body.firstChild);
  }

  localStorage.setItem("theme", theme.dark ? "dark" : "light");
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
    console.warn("Biometry register:", e);
    return null;
  }
}
async function biometryVerify() {
  if (!biometryCredId) return false;
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const rawId = Uint8Array.from(atob(biometryCredId), (c) => c.charCodeAt(0));
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
    console.warn("Biometry verify:", e);
    return false;
  }
}

// ============================================================
// ПИН-КОД
// ============================================================
function showPinScreen(onSuccess) {
  if (!pinEnabled && !biometryEnabled) {
    onSuccess();
    return;
  }
  const overlay = document.createElement("div");
  overlay.id = "pinScreen";
  overlay.style.cssText =
    "position:fixed;inset:0;background:var(--cream);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px;";
  const bioAvail = biometryEnabled && biometryCredId;
  overlay.innerHTML = `
    <div style="font-size:52px;">${bioAvail ? "🔐" : "🔒"}</div>
    <div style="font-size:20px;font-weight:800;color:var(--text);">${t("pinEnter")}</div>
    ${bioAvail ? `<button id="bioBtn" style="background:var(--primary);color:white;border:none;border-radius:99px;padding:14px 28px;font-size:17px;font-weight:800;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:8px;">🫆 Биометрия</button><div style="color:var(--text-muted);font-size:13px;">или введите пин-код</div>` : ""}
    <div id="pinDots" style="display:flex;gap:14px;">${[0, 1, 2, 3].map(() => `<div style="width:18px;height:18px;border-radius:50%;border:2px solid var(--primary);background:transparent;transition:.2s;"></div>`).join("")}</div>
    <div id="pinError" style="color:var(--expense-color);font-size:14px;font-weight:700;min-height:20px;"></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:280px;width:100%;">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => `<button class="pin-key" data-key="${k}" style="height:60px;border-radius:18px;border:1.5px solid var(--cream-border);background:var(--card-bg);font-size:24px;font-weight:700;cursor:pointer;font-family:inherit;color:var(--text);">${k}</button>`).join("")}
    </div>`;
  document.body.appendChild(overlay);
  // Биометрия
  if (bioAvail) {
    document.getElementById("bioBtn")?.addEventListener("click", async () => {
      const ok = await biometryVerify();
      if (ok) {
        overlay.remove();
        onSuccess();
      } else {
        document.getElementById("pinError").textContent = "Биометрия не прошла";
        setTimeout(() => {
          const e = document.getElementById("pinError");
          if (e) e.textContent = "";
        }, 2000);
      }
    });
    // Автозапуск биометрии через 500ms
    setTimeout(async () => {
      if (!document.getElementById("pinScreen")) return;
      const ok = await biometryVerify();
      if (ok) {
        overlay.remove();
        onSuccess();
      }
    }, 500);
  }
  let entered = "";
  const dots = overlay.querySelectorAll("#pinDots div");
  const updDots = () =>
    dots.forEach((d, i) => {
      d.style.background =
        i < entered.length ? "var(--primary)" : "transparent";
    });
  overlay.querySelectorAll(".pin-key").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const k = btn.dataset.key;
      if (k === "") return;
      if (k === "⌫") {
        entered = entered.slice(0, -1);
        updDots();
        return;
      }
      if (entered.length >= 4) return;
      entered += k;
      updDots();
      if (entered.length === 4) {
        if (pinHash) {
          const h = await hashPin(entered);
          if (h === pinHash) {
            overlay.remove();
            onSuccess();
          } else {
            document.getElementById("pinError").textContent = t("pinWrong");
            entered = "";
            updDots();
            setTimeout(() => {
              const e = document.getElementById("pinError");
              if (e) e.textContent = "";
            }, 1500);
          }
        } else {
          overlay.remove();
          onSuccess();
        }
      }
    });
  });
}

// ============================================================
// MODAL UTILITIES
// ============================================================
function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove("open");
    setTimeout(() => {
      if (m.parentNode) m.remove();
    }, 350);
    document.body.style.overflow = "";
  }
}

function createModal(id, title, bodyHtml) {
  document.getElementById(id)?.remove();
  const ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.id = id;
  ov.innerHTML = `<div class="modal"><div class="modal-handle"></div><div class="modal-header"><h2>${esc(title)}</h2><button class="modal-close">✕</button></div><div class="modal-body">${bodyHtml}</div></div>`;
  ov.querySelector(".modal-close").addEventListener("click", () =>
    closeModal(id),
  );
  ov.addEventListener("click", (e) => {
    if (e.target === ov) closeModal(id);
  });
  // Swipe down to close
  let startY = 0;
  const handle = ov.querySelector(".modal-handle");
  if (handle) {
    handle.addEventListener(
      "touchstart",
      (e) => {
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );
    handle.addEventListener(
      "touchmove",
      (e) => {
        const dy = e.touches[0].clientY - startY;
        if (dy > 60) closeModal(id);
      },
      { passive: true },
    );
  }
  return ov;
}

function openInputModal(title, label, defVal, onSave) {
  const html = `<div class="field-group"><label class="field-label">${esc(label)}</label><input type="text" id="inputModalVal" class="modal-input" value="${esc(defVal || "")}" placeholder="${esc(label)}"></div>
    <div class="modal-actions"><button class="btn-secondary" id="inputModalCancel">${t("cancel")}</button><button class="btn-primary" id="inputModalSave">${t("save")}</button></div>`;
  const modal = createModal("inputModal", title, html);
  document.body.appendChild(modal);
  openModal("inputModal");
  const inp = document.getElementById("inputModalVal");
  inp?.focus();
  inp?.select();
  document
    .getElementById("inputModalCancel")
    ?.addEventListener("click", () => closeModal("inputModal"));
  document.getElementById("inputModalSave")?.addEventListener("click", () => {
    const val = document.getElementById("inputModalVal")?.value || "";
    closeModal("inputModal");
    if (onSave) onSave(val);
  });
  inp?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("inputModalSave")?.click();
    }
  });
}

// ============================================================
// TOAST / CONFIRM
// ============================================================
let toastTimer = null;
function showToast(msg, type = "success") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.innerHTML = esc(msg);
  el.className = "toast " + type;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}
function showToastUndo(msg, onUndo) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.innerHTML = `${esc(msg)} <button onclick="window._undoCb&&window._undoCb()" style="background:rgba(255,255,255,0.25);border:none;border-radius:99px;padding:4px 12px;font-size:13px;font-weight:800;cursor:pointer;color:inherit;margin-left:8px;font-family:inherit;">↩ Отмена</button>`;
  el.className = "toast success";
  el.classList.add("show");
  window._undoCb = () => {
    el.classList.remove("show");
    clearTimeout(toastTimer);
    onUndo();
    window._undoCb = null;
  };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("show");
    window._undoCb = null;
  }, 3500);
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
  if (el)
    el.textContent = new Date().toLocaleDateString(
      localeMap[currentLang] || currentLang,
      { weekday: "long", day: "numeric", month: "long" },
    );
}
function addHeaderButtons() {
  ["headerGuideBtn", "headerHelpBtn", "headerLangBtn"].forEach((id) => {
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
  });
  updateHeaderButtons();
}
function updateHeaderButtons() {
  const lb = document.getElementById("headerLangBtn");
  if (lb)
    lb.textContent = { ru: "🇷🇺", en: "🇬🇧", ka: "🇬🇪" }[currentLang] || "🌐";
}
function updateTopBlocks() {
  let inc = 0,
    exp = 0;
  for (const tx of transactions) {
    if (tx.type === "income") inc += tx.amountRub;
    else exp += tx.amountRub;
  }
  const bal = inc - exp,
    s = sym();
  const setV = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  setV("balanceValue", toDisp(bal).toFixed(2) + " " + s);
  setV("incomeValue", toDisp(inc).toFixed(2) + " " + s);
  setV("expenseValue", toDisp(exp).toFixed(2) + " " + s);
  setV("salaryValue", toDisp(startBalanceRub).toFixed(2) + " " + s);
}

// Универсальное обновление главной страницы после любого изменения данных
function refreshAfterChange() {
  updateTopBlocks();
  if (currentTab === "home") {
    // Если DOM-элементы существуют — обновляем их напрямую
    if (document.getElementById("balanceSummaryContainer")) {
      renderBalanceSummary();
      renderOpsList();
    } else {
      // Иначе перерисовываем всю домашнюю страницу
      renderHome();
    }
  }
}

// ============================================================
// ВКЛАДКИ
// ============================================================
function setTab(tab) {
  // Проверка разрешений для гостевого режима
  if (sharedAccessProfile) {
    if (tab === "stats" && sharedAccessProfile && !perm("stats")) {
      showNoAccess();
      return;
    }
    if (tab === "notebook" && sharedAccessProfile && !perm("notes")) {
      showNoAccess();
      return;
    }
    if (tab === "categories" && sharedAccessProfile && !perm("cats")) {
      showNoAccess();
      return;
    }
  }
  currentTab = tab;
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector(`.nav-btn[data-tab="${tab}"]`)
    ?.classList.add("active");
  const content = document.getElementById("mainContent");
  content.style.opacity = "0";
  setTimeout(() => {
    switch (tab) {
      case "home":
        renderHome();
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
    content.style.opacity = "1";
    applyPermRestrictions();
  }, 160);
}

function showNoAccess() {
  const content = document.getElementById("mainContent");
  content.style.opacity = "0";
  setTimeout(() => {
    content.innerHTML = `<div style="text-align:center;padding:60px 24px;"><div style="font-size:64px;margin-bottom:16px;">🚫</div>
      <div style="font-size:22px;font-weight:800;color:var(--text);margin-bottom:10px;">${t("noAccess")}</div>
      <div style="font-size:16px;color:var(--text-muted);line-height:1.6;">${t("noAccessDesc")}</div></div>`;
    content.style.opacity = "1";
  }, 160);
}

// ============================================================
// ГЛАВНАЯ
// ============================================================
function renderHome() {
  const sw = !localStorage.getItem("welcomeSeen") && transactions.length === 0;
  let html = "";
  if (sw)
    html += `<div class="welcome-tip"><div class="welcome-tip-icon">👋</div><div class="welcome-tip-text"><h3>${t("welcomeTitle")}</h3><p>${t("welcomeText")}</p><button class="welcome-tip-close" id="welcomeClose">${t("welcomeClose")}</button></div></div>`;
  // Профиль-переключатель
  {
    const ap = profiles.find((p) => p.id === activeProfileId) || profiles[0];
    const isGuest = !!(
      sharedAccessProfile && sharedAccessProfile.profileId === activeProfileId
    );
    const canViewOwner = isGuest && perm("viewOwner");
    const ownerViewProfiles = isGuest
      ? profiles.filter(
          (p) =>
            p.isOwnerView &&
            p.shareCode ===
              profiles.find((g) => g.id === activeProfileId)?.shareCode,
        )
      : [];

    if (!isGuest) {
      // ВЛАДЕЛЕЦ: показываем всегда — кнопки переключения профилей
      const otherProfiles = profiles.filter(
        (p) => p.id !== activeProfileId && !p.isOwnerView,
      );
      if (
        profiles.filter((p) => !p.isOwnerView).length > 1 ||
        otherProfiles.length > 0
      ) {
        html += `<div id="profileSwitcherBar" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--primary-pale);border-radius:14px;margin-bottom:12px;border:1.5px solid rgba(64,145,108,0.25);">
          <div style="width:36px;height:36px;border-radius:50%;background:${ap?.color || "var(--primary)"};display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;">${ap?.emoji || "👤"}</div>
          <div style="flex:1;"><div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">${t("whosProfile")}</div>
          <div style="font-size:15px;font-weight:800;color:var(--text);">${esc(ap?.name || "")}</div></div>
          <div style="display:flex;gap:6px;">${otherProfiles.map((p) => `<button onclick="switchProfile('${p.id}')" style="width:32px;height:32px;border-radius:50%;border:2px solid var(--cream-border);background:${p.color || "var(--primary)"};font-size:15px;cursor:pointer;" title="${esc(p.name)}">${p.emoji || "👤"}</button>`).join("")}</div>
        </div>`;
      }
    } else if (canViewOwner && ownerViewProfiles.length > 0) {
      // ГОСТЬ с правом viewOwner: показываем кнопку переключения на профиль владельца
      html += `<div id="profileSwitcherBar" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(37,99,235,0.08);border-radius:14px;margin-bottom:12px;border:1.5px solid rgba(37,99,235,0.25);">
        <div style="width:36px;height:36px;border-radius:50%;background:${ap?.color || "var(--primary)"};display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;">${ap?.emoji || "👤"}</div>
        <div style="flex:1;"><div style="font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:.5px;">${t("guestProfile")}</div>
        <div style="font-size:15px;font-weight:800;color:var(--text);">${esc(ap?.name || "")}</div></div>
        <div style="display:flex;gap:6px;">${ownerViewProfiles.map((p) => `<button onclick="switchProfile('${p.id}')" style="padding:4px 10px;border-radius:99px;border:1.5px solid rgba(37,99,235,0.3);background:rgba(37,99,235,0.1);color:#2563eb;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;" title="${esc(p.name)}">👑 ${esc(p.name)}</button>`).join("")}</div>
      </div>`;
    }
    // ГОСТЬ без viewOwner: НЕ показываем никакой панели переключения — только свой профиль
  }
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

  // Поиск
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
    }
    if (csb) {
      csb.addEventListener("click", function () {
        if (sf) sf.value = "";
        this.style.display = "none";
        renderOpsList();
      });
    }
  }
  // Фильтр времени — обработчики
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
    .filter((tx) => tx.type === "income")
    .reduce((s, tx) => s + tx.amountRub, 0);
  const exp = filtered
    .filter((tx) => tx.type === "expense")
    .reduce((s, tx) => s + tx.amountRub, 0);
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
      ? `${t("searchFound") || "Найдено"}: ${filtered.length} ${t("searchOf") || "из"} ${transactions.length}`
      : `${filtered.length} ${t("searchRecords") || "записей"}`;
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
      ? `<div class="empty-block"><div class="empty-emoji">🔍</div><p>Ничего не найдено</p></div>`
      : `<div class="empty-block"><div class="empty-emoji">💸</div><p>${t("noOperations").replace("\n", "<br>")}</p></div>`;
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
      const sign = tx.type === "income" ? "+" : "−";
      const style = getCategoryStyle(tx.category, tx.type);
      const subcatIcon = tx.subcategory ? getSubcatIcon(tx.subcategory) : "";
      html += `<div class="op-card" data-idx="${idx}" data-type="${tx.type}" style="border-left-color:${style.color};">
        <div class="op-emoji" style="background:${style.color}20;color:${style.color};">${style.icon}</div>
        <div class="op-info">
          <div class="op-category">${esc(tx.category)}${tx.subcategory ? ` · <span style="font-weight:400;color:var(--text-muted)">${subcatIcon} ${esc(tx.subcategory)}</span>` : ""}</div>
          ${tx.note ? `<div class="op-note">📝 ${esc(tx.note.substring(0, 50))}</div>` : ""}
          ${tx._recurring ? `<div class="op-note" style="color:var(--primary);">🔄 авто</div>` : ""}
        </div>
        <div class="op-right">
          <div class="op-amount ${tx.type}">${sign}${fmt(tx.amountRub)}</div>
          <button class="op-delete" data-idx="${idx}" aria-label="${t("ariaDeleteOp")}">✕</button>
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
      if (!perm("del")) {
        showToast(t("noAccess"), "error");
        return;
      }
      askConfirm(
        t("confirmDelete"),
        () => {
          transactions.splice(parseInt(btn.dataset.idx), 1);
          saveAll();
          refreshAfterChange();
          showToast(t("deleted"));
        },
        { icon: "🗑️" },
      );
    });
  });
  document.getElementById("clearFilterBtn")?.addEventListener("click", () => {
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
    aI = null;
  container.querySelectorAll(".op-card").forEach((card) => {
    card.addEventListener(
      "touchstart",
      (e) => {
        sX = e.touches[0].clientX;
        sY = e.touches[0].clientY;
        aC = card;
        aI = parseInt(card.dataset.idx);
      },
      { passive: true },
    );
    card.addEventListener(
      "touchmove",
      (e) => {
        if (!aC) return;
        const dx = e.touches[0].clientX - sX,
          dy = e.touches[0].clientY - sY;
        if (Math.abs(dy) > Math.abs(dx)) {
          aC = null;
          return;
        }
        if (dx < 0) {
          aC.style.transform = `translateX(${Math.max(dx, -120)}px)`;
          aC.style.opacity = Math.max(0.4, 1 + dx / 240);
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
          // Direct delete with undo — стандартный мобильный UX
          const savedCard = aC;
          const savedIdx = aI;
          savedCard.style.transform = "translateX(-110%)";
          savedCard.style.opacity = "0";
          savedCard.style.transition =
            "transform .25s cubic-bezier(0.4,0,0.2,1),opacity .25s";
          const deletedTx = transactions[savedIdx];
          transactions.splice(savedIdx, 1);
          saveAll();
          updateTopBlocks();
          renderBalanceSummary();
          // Показываем тост с возможностью отмены
          showToastUndo(t("deleted"), () => {
            transactions.splice(savedIdx, 0, deletedTx);
            saveAll();
            refreshAfterChange();
          });
          setTimeout(() => renderOpsList(), 260);
          aC = null;
        } else {
          if (aC) {
            aC.style.transform = "";
            aC.style.opacity = "1";
          }
          aC = null;
        }
      },
      { passive: true },
    );
  });
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
          transactions.splice(parseInt(b.dataset.idx), 1);
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
  const date = initialDate ? new Date(initialDate + "T12:00:00") : new Date();
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

// ============================================================
// РЕДАКТИРОВАНИЕ ОПЕРАЦИИ
// ============================================================
function openEditModal(idx) {
  const op = transactions[idx];
  if (!op) return;
  if (!perm("edit")) {
    showToast(t("noAccess"), "error");
    return;
  }
  editingOpIndex = idx;
  const html = `<div class="field-group"><label class="field-label">${t("category")}</label><input type="text" id="editCategory" class="modal-input" value="${esc(op.category)}"></div><div class="field-group"><label class="field-label">${t("amount")} (${sym()})</label><input type="number" id="editAmount" class="modal-input" step="any" min="0.01" value="${toDisp(op.amountRub).toFixed(2)}" inputmode="decimal"></div><div class="field-group"><label class="field-label">${t("date")}</label><div class="date-input-wrapper"><input type="text" id="editDateDisplay" class="modal-input" readonly value="${fmtDate(op.date || today())}"><input type="hidden" id="editDate" value="${op.date || today()}"><button type="button" class="datepicker-btn" id="editDateBtn">📅</button></div></div><div class="field-group"><label class="field-label">${t("note")}</label><textarea id="editNote" class="modal-textarea" rows="2">${esc(op.note || "")}</textarea></div><div class="modal-actions"><button class="btn-danger" id="deleteItemBtn">🗑 ${t("delete")}</button><button class="btn-primary" id="saveEditBtn">💾 ${t("save")}</button></div>`;
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
    closeModal("editModal");
    setTimeout(() => refreshAfterChange(), 50);
    showToast(t("saved"));
  });
  document.getElementById("deleteItemBtn")?.addEventListener("click", () => {
    askConfirm(
      t("confirmDelete"),
      () => {
        transactions.splice(editingOpIndex, 1);
        saveAll();
        closeModal("editModal");
        setTimeout(() => refreshAfterChange(), 50);
        showToast(t("deleted"));
      },
      { icon: "🗑️" },
    );
  });
}

// ============================================================
// ЗАРПЛАТА
// ============================================================
function openSalaryModal() {
  const html = `<div class="section-hint">${t("salaryModalHint")}</div><div class="field-group"><label class="field-label">${t("salary_label")} (${sym()})</label><input type="number" id="salaryAmount" class="modal-input" step="any" min="0" value="${toDisp(startBalanceRub).toFixed(2)}" inputmode="decimal" autofocus></div><div class="modal-actions"><button class="btn-primary" id="saveSalaryBtn">💾 ${t("save")}</button></div>`;
  const modal = createModal("salaryModal", t("editBalance"), html);
  document.body.appendChild(modal);
  openModal("salaryModal");
  document.getElementById("saveSalaryBtn")?.addEventListener("click", () => {
    const v = parseFloat(document.getElementById("salaryAmount").value);
    if (isNaN(v) || v < 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    startBalanceRub = toRub(v);
    const ei = transactions.findIndex(
      (tx) => tx._initial === true && tx.type === "income",
    );
    if (ei !== -1) {
      transactions[ei].amountRub = startBalanceRub;
    } else
      transactions.push({
        type: "income",
        category: t("initialCategory"),
        subcategory: null,
        amountRub: startBalanceRub,
        date: today(),
        note: t("initialCapital"),
        _initial: true,
      });
    saveAll();
    closeModal("salaryModal");
    setTimeout(() => refreshAfterChange(), 50);
    showToast(t("saved"));
  });
}

// ============================================================
// ДОБАВЛЕНИЕ ОПЕРАЦИИ
// ============================================================
function openAddModal() {
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
    <div class="field-group"><label class="field-label">${t("type")}</label><div class="type-toggle"><button class="type-btn expense active" data-type="expense">${t("expenseType")}</button><button class="type-btn income" data-type="income">${t("incomeType")}</button></div></div>
    <div class="field-group"><label class="field-label" id="catLabel">${t("expCategory")}</label><select id="addCategorySelect" class="modal-select">${eo}</select></div>
    <div class="field-group" id="addSubcatDiv" style="display:none"><label class="field-label">${t("subcategory")}</label><select id="addSubcatSelect" class="modal-select"></select></div>
    <div class="field-group"><label class="field-label">${t("amount")} (${sym()})</label><input type="text" id="addAmount" class="modal-input" placeholder="0.00" inputmode="decimal" autofocus></div>
    <div class="quick-numpad">
      <div class="numpad-row"><button class="numpad-btn" data-numpad="1">1</button><button class="numpad-btn" data-numpad="2">2</button><button class="numpad-btn" data-numpad="3">3</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-numpad="4">4</button><button class="numpad-btn" data-numpad="5">5</button><button class="numpad-btn" data-numpad="6">6</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-numpad="7">7</button><button class="numpad-btn" data-numpad="8">8</button><button class="numpad-btn" data-numpad="9">9</button></div>
      <div class="numpad-row"><button class="numpad-btn" data-numpad="0">0</button><button class="numpad-btn" data-numpad=".">.</button><button class="numpad-btn clear" data-numpad="backspace">⌫</button></div>
      <div class="numpad-row"><button class="numpad-btn clear" data-numpad="clear" style="grid-column:span 3;">C</button></div>
    </div>
    <div id="suggestionsBlock" class="suggestions-block" style="margin-top:12px;"><div class="suggestions-title">${t("quickSuggestions")}</div><div id="suggestionsList" class="suggestions-list"></div></div>
    <div class="field-group"><label class="field-label">${t("date")}</label><div class="date-input-wrapper"><input type="text" id="addDateDisplay" class="modal-input" readonly value="${fmtDate(today())}"><input type="hidden" id="addDate" value="${today()}"><button class="datepicker-btn" id="addDateBtn">📅</button></div><div class="quick-dates"><button type="button" class="quick-date-btn" data-qd="today">${t("today")}</button><button type="button" class="quick-date-btn" data-qd="yesterday">${t("yesterday")}</button><button type="button" class="quick-date-btn" data-qd="startOfMonth">${t("startOfMonth")}</button></div></div>
    <div class="field-group"><label class="field-label">${t("note")}</label><textarea id="addNote" class="modal-textarea" rows="2" placeholder="${t("noteHint")}"></textarea></div>
    <div class="modal-actions" style="flex-wrap:wrap;gap:8px;"><button class="btn-secondary" id="saveAsTemplateBtn">⭐ ${t("saveAsTemplate")}</button><button class="btn-primary" id="saveAddBtn">✓ ${t("add")}</button></div>`;
  const modal = createModal("addModal", t("newOperation"), html);
  document.body.appendChild(modal);
  openModal("addModal");
  addType = "expense";

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
        sc
          .map((s) => `<option value="${s}">${getSubcatIcon(s)} ${s}</option>`)
          .join("");
      sd.style.display = "block";
    } else sd.style.display = "none";
  };
  document.getElementById("saveAddBtn")?.addEventListener("click", () => {
    const cat = document.getElementById("addCategorySelect").value;
    const sub = document.getElementById("addSubcatSelect")?.value || "";
    const amt = parseFloat(document.getElementById("addAmount").value);
    const date = document.getElementById("addDate").value;
    const note = document.getElementById("addNote").value.trim();
    if (!perm("add")) {
      showToast(t("noAccess"), "error");
      return;
    }
    if (!cat) {
      showToast(t("selectCategoryFirst"), "error");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    // Проверка бюджета
    if (addType === "expense" && categoryBudgets[cat]) {
      const now = new Date();
      const ms = new Date(now.getFullYear(), now.getMonth(), 1);
      const spent = transactions
        .filter(
          (tx) =>
            tx.type === "expense" &&
            tx.category === cat &&
            tx.date &&
            new Date(tx.date + "T00:00:00") >= ms,
        )
        .reduce((s, tx) => s + tx.amountRub, 0);
      if (spent + toRub(amt) > categoryBudgets[cat]) {
        if (
          !confirm(
            `⚠️ Превысит лимит бюджета (${fmt(categoryBudgets[cat])}). Продолжить?`,
          )
        )
          return;
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
    transactions.push(tx);
    updateFrequentStats(tx);
    saveAll();
    closeModal("addModal");
    setTimeout(() => refreshAfterChange(), 50);
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
        showToast("Сначала выберите категорию и сумму", "error");
        return;
      }
      addUserTemplate({
        name: `${cat} ${toDisp(toRub(amt)).toFixed(0)} ${sym()}`,
        type: addType,
        category: cat,
        subcategory: sub,
        amountRub: toRub(amt),
        note,
      });
      showToast("⭐ Шаблон сохранён");
      updateSuggestions();
    });
  updateSuggestions();
}

// ============================================================
// СТАТИСТИКА
// ============================================================
function renderStats() {
  const content = document.getElementById("mainContent");
  content.innerHTML = `<div class="stats-loading"><div class="spinner"></div><p>${t("loading")}</p></div>`;
  setTimeout(() => {
    if (!transactions.length) {
      content.innerHTML = `<div class="stats-empty-state"><div style="font-size:64px;">📊</div><div style="font-size:20px;font-weight:800;">${t("noStatsYet").split("\n")[0]}</div></div>`;
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
    let incAll = 0,
      expAll = 0;
    for (const tx of transactions) {
      if (tx.type === "income") incAll += tx.amountRub;
      else expAll += tx.amountRub;
    }
    const bal = incAll - expAll;
    const totalFlow = inc,
      savedAmt = totalFlow - exp,
      savedPct =
        totalFlow > 0
          ? Math.max(0, Math.round((savedAmt / totalFlow) * 100))
          : 0;
    const spentPct =
      totalFlow > 0 ? Math.min(100, Math.round((exp / totalFlow) * 100)) : 0;
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
    const allM = Object.keys(monthlyData)
      .filter((m) => monthlyData[m].inc > 0 || monthlyData[m].exp > 0)
      .sort()
      .slice(-6);
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
    // Детальные описания статуса бюджета
    const pctSpent = 100 - savedPct;
    if (exp > totalFlow && totalFlow > 0) {
      sE = "🚨";
      sT = t("statsBudgetMinus");
      sC = "danger";
      const over = exp - totalFlow;
      sD =
        {
          ru: `Вы потратили на ${fmt(over)} больше, чем получили. Расходы составили ${pctSpent}% от доходов. Попробуйте сократить необязательные траты.`,
          en: `You spent ${fmt(over)} more than earned. Expenses reached ${pctSpent}% of income. Try cutting optional spending.`,
          ka: `${fmt(over)}-ით მეტი დახარჯეთ, ვიდრე მიიღეთ. ხარჯები შემოსავლის ${pctSpent}% შეადგენს.`,
        }[currentLang] || "";
    } else if (savedPct >= 30) {
      sE = "🌟";
      sT = t("statsBudgetGreat");
      sC = "healthy";
      sD =
        {
          ru: `Вы сберегаете ${savedPct}% доходов — это отличный результат! Из каждых 100 ${sym()} вы откладываете ${savedPct} ${sym()}. Подумайте об инвестировании свободных средств.`,
          en: `You save ${savedPct}% of your income — excellent! For every 100 ${sym()} earned, you keep ${savedPct} ${sym()}. Consider investing your surplus.`,
          ka: `შემოსავლის ${savedPct}%-ს ზოგავთ — შესანიშნავი! ყოველი 100 ${sym()}-დან ${savedPct} ${sym()}-ს ინახავთ. განიხილეთ ინვესტირება.`,
        }[currentLang] || "";
    } else if (savedPct >= 10) {
      sE = "✅";
      sT = t("statsBudgetOk");
      sC = "healthy";
      sD =
        {
          ru: `Вы тратите ${pctSpent}% доходов и сберегаете ${savedPct}%. Бюджет под контролем! Чтобы улучшить показатель, попробуйте сократить расходы в топ-категориях.`,
          en: `You spend ${pctSpent}% of income and save ${savedPct}%. Budget is healthy! To improve, try reducing top expense categories.`,
          ka: `შემოსავლის ${pctSpent}%-ს ხარჯავთ, ${savedPct}%-ს ზოგავთ. ბიუჯეტი კარგადაა! გაუმჯობესებისთვის შეამცირეთ მთავარი ხარჯები.`,
        }[currentLang] || "";
    } else {
      sE = "⚠️";
      sT = t("statsBudgetAlmost");
      sC = "warning";
      sD =
        {
          ru: `Вы тратите ${pctSpent}% доходов — почти всё! Сберегается лишь ${savedPct}%. Рекомендуется откладывать минимум 10–20%. Проверьте список расходов — возможно, есть ненужные траты.`,
          en: `You spend ${pctSpent}% of income — almost everything! Only ${savedPct}% saved. Experts recommend saving 10–20%. Review your expenses for unnecessary spending.`,
          ka: `შემოსავლის ${pctSpent}%-ს ხარჯავთ — თითქმის ყველაფერს! მხოლოდ ${savedPct}% ინახება. 10–20%-ის დაზოგვაა რეკომენდებული.`,
        }[currentLang] || "";
    }
    const gC =
      savedPct >= 20
        ? "var(--income-color)"
        : savedPct >= 10
          ? "var(--gold)"
          : "var(--expense-color)";
    const months = t("months");
    // Бары
    let chartBars = "";
    allM.forEach((m) => {
      const d = monthlyData[m];
      const iH = Math.round((toDisp(d.inc) / toDisp(maxB)) * 64),
        eH = Math.round((toDisp(d.exp) / toDisp(maxB)) * 64);
      const [, mn] = m.split("-");
      const lbl = months[parseInt(mn) - 1]?.slice(0, 3) || m.slice(5);
      chartBars += `<div class="stat-chart-col"><div class="stat-chart-bars"><div class="stat-chart-bar inc" style="height:${iH}px"></div><div class="stat-chart-bar exp" style="height:${eH}px"></div></div><div class="stat-chart-label">${lbl}</div></div>`;
    });
    // Категории расходов
    const CE = [
      "#c13515",
      "#d9461a",
      "#e8714e",
      "#f0a080",
      "#f5bfab",
      "#faddd3",
    ];
    let ceR = "";
    topExp.forEach(([cat, amt], i) => {
      const p = exp > 0 ? Math.round((amt / exp) * 100) : 0,
        cl = CE[i] || CE[CE.length - 1];
      ceR += `<div class="stat-cat-row"><div class="stat-cat-dot" style="background:${cl}"></div><div class="stat-cat-info"><div class="stat-cat-top"><span class="stat-cat-name">${getOpEmoji({ type: "expense", category: cat })} ${esc(cat)}</span><span class="stat-cat-amount" style="color:${cl}">−${fmt(amt)}</span></div><div class="stat-cat-bar-wrap"><div class="stat-cat-bar" style="width:${p}%;background:${cl}"></div></div></div><div class="stat-cat-pct" style="color:${cl}">${p}%</div></div>`;
    });
    const CI = ["#1a7340", "#2a8f55", "#52b788", "#74c69d"];
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
    const pc = ["#c13515", "#e8714e", "#f0a080", "#f5bfab", "#faddd3"];
    if (pd.length) {
      let cum = 0;
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
        legHtml += `<div class="pie-legend-item"><div class="pie-legend-color" style="background:${cl}"></div><span class="pie-legend-name">${esc(cat)}</span><span class="pie-legend-value">${fmt(amt)}</span></div>`;
      });
    } else {
      pieSvg = `<circle cx="50" cy="50" r="40" fill="var(--cream-dark)"/>`;
      legHtml = `<div class="pie-legend-item">${t("noStatsYet").split("\n")[0]}</div>`;
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
    const dayT = [0, 0, 0, 0, 0, 0, 0],
      dayC = [0, 0, 0, 0, 0, 0, 0];
    transactions
      .filter((tx) => tx.type === "expense" && tx.date)
      .forEach((tx) => {
        let dow = new Date(tx.date + "T00:00:00").getDay();
        dow = dow === 0 ? 6 : dow - 1;
        dayT[dow] += tx.amountRub;
        dayC[dow]++;
      });
    const dayAvg = dayT.map((t, i) => (dayC[i] > 0 ? t / dayC[i] : 0));
    const maxDay = Math.max(...dayAvg) || 1;
    const wd = t("weekdaysShort");
    let heatHtml = `<div class="stat-heatmap-card"><div class="stat-section-label">${t("heatmapTitle")}</div><div class="stat-section-desc">${t("heatmapSubtitle")}</div><div class="heatmap-grid">`;
    dayAvg.forEach((avg, i) => {
      const pct = Math.round((avg / maxDay) * 100);
      const op = 0.15 + (pct / 100) * 0.85;
      heatHtml += `<div class="heatmap-cell"><div class="heatmap-bar" style="height:${Math.max(4, pct * 0.6)}px;background:rgba(193,53,21,${op});"></div><div class="heatmap-day">${wd[i]}</div><div class="heatmap-val">${avg > 0 ? toDisp(avg).toFixed(0) : "—"}</div></div>`;
    });
    heatHtml += "</div></div>";
    // Бюджеты в статистике
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
        budgetHtml += `<div class="budget-row"><div class="budget-header"><span class="budget-cat">${getCategoryStyle(cat, "expense").icon} ${esc(cat)}</span><span style="font-size:13px;font-weight:700;color:${cl};">${fmt(spent)} / ${fmt(limit)}</span></div><div class="budget-bar-wrap"><div class="budget-bar" style="width:${pct}%;background:${cl};"></div></div>${over ? `<div class="budget-over">${t("budgetOverLimit")}</div>` : ""}</div>`;
      });
      budgetHtml += "</div>";
    }
    // Сравнение
    const sma = Object.keys(monthlyData)
      .filter((m) => monthlyData[m].inc > 0 || monthlyData[m].exp > 0)
      .sort();
    let cmpHtml = "",
      fcHtml = "";
    if (sma.length >= 2) {
      const lmd = monthlyData[sma[sma.length - 1]],
        pmd = monthlyData[sma[sma.length - 2]];
      const ic = lmd.inc - pmd.inc,
        ec = lmd.exp - pmd.exp;
      const ip = pmd.inc ? Math.round((ic / pmd.inc) * 100) : 0,
        ep = pmd.exp ? Math.round((ec / pmd.exp) * 100) : 0;
      cmpHtml = `<div class="compare-card"><div class="compare-title">${t("compareTitle")}</div><div class="compare-row"><span>${ic >= 0 ? "📈" : "📉"} ${t("compareIncome")}</span><span class="${ic >= 0 ? "positive" : "negative"}">${ic >= 0 ? "+" : ""}${fmt(ic)} (${ip > 0 ? "+" : ""}${ip}%)</span></div><div class="compare-row"><span>${ec >= 0 ? "📈" : "📉"} ${t("compareExpense")}</span><span class="${ec <= 0 ? "positive" : "negative"}">${ec >= 0 ? "+" : ""}${fmt(ec)} (${ep > 0 ? "+" : ""}${ep}%)</span></div></div>`;
    }
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
    fcHtml = `<div class="forecast-card"><div class="forecast-title">${t("forecastTitle")}</div><div class="compare-row"><span>${t("forecastIncome")}</span><span class="positive">+${fmt(rI)}</span></div><div class="compare-row"><span>${t("forecastExpense")}</span><span class="negative">−${fmt(rE)}</span></div><div class="compare-row" style="font-weight:700;"><span>${t("forecastBalance")}</span><span class="${fB >= 0 ? "positive" : "negative"}">${fmt(fB)}</span></div><div style="font-size:11px;color:var(--text-muted);margin-top:8px;">${t("forecastNote")}</div></div>`;
    // Советы
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

    const html2 = `<div class="stats-v2">
      ${periodHtml}
      <div class="stat-status-card ${sC}"><div class="stat-status-left"><div class="stat-status-emoji">${sE}</div><div><div class="stat-status-title">${sT}</div><div class="stat-status-desc">${sD}</div></div></div><div class="stat-status-count">${ptx.length}<span>${t("statsRec")}</span></div></div>
      <div class="stat-kpi-grid">
        <div class="stat-kpi balance"><div class="stat-kpi-icon">💎</div><div class="stat-kpi-val ${bal >= 0 ? "pos" : "neg"}">${fmt(bal)}</div><div class="stat-kpi-label">${t("statsRemaining")}</div></div>
        <div class="stat-kpi start"><div class="stat-kpi-icon">💼</div><div class="stat-kpi-val">${fmt(startBalanceRub)}</div><div class="stat-kpi-label">${t("salary")}</div></div>
        <div class="stat-kpi income"><div class="stat-kpi-icon">📈</div><div class="stat-kpi-val inc">+${fmt(inc)}</div><div class="stat-kpi-label">${nInc} ${t("statsInc2")}</div></div>
        <div class="stat-kpi expense"><div class="stat-kpi-icon">📉</div><div class="stat-kpi-val exp">−${fmt(exp)}</div><div class="stat-kpi-label">${nExp} ${t("statsExp2")}</div></div>
      </div>
      <div class="stat-visual-row">
        <div class="stat-gauge-card"><div class="stat-section-label">${t("statsSavingsGauge")}</div><div class="stat-gauge-wrap"><svg viewBox="0 0 160 95" class="stat-gauge-svg"><path d="M 18 88 A 62 62 0 0 1 142 88" fill="none" stroke="var(--cream-dark)" stroke-width="14" stroke-linecap="round"/><path d="M 18 88 A 62 62 0 0 1 142 88" fill="none" stroke="${gC}" stroke-width="14" stroke-linecap="round" stroke-dasharray="195" stroke-dashoffset="${195 - (savedPct / 100) * 195}" class="gauge-arc"/></svg><div class="stat-gauge-center"><div class="stat-gauge-pct" style="color:${gC}">${savedPct}%</div><div class="stat-gauge-sub">${t("statsSaved2")}</div></div></div><div class="stat-gauge-amount" style="color:${gC}">${savedAmt >= 0 ? "+" : ""}${fmt(savedAmt)}</div></div>
        <div class="stat-donut-card"><div class="stat-section-label">${t("statsRatio")}</div><div class="stat-donut2-wrap"><svg viewBox="0 0 100 100" class="stat-donut2-svg"><circle cx="50" cy="50" r="38" fill="none" stroke="var(--income-color)" stroke-width="18"/><circle cx="50" cy="50" r="38" fill="none" stroke="var(--expense-color)" stroke-width="18" stroke-dasharray="${spentPct * 2.388} ${(100 - spentPct) * 2.388}" stroke-dashoffset="0" transform="rotate(-90 50 50)"/></svg><div class="stat-donut2-center"><div class="stat-donut2-pct" style="color:var(--expense-color)">${spentPct}%</div><div class="stat-donut2-sub">${t("statsSpentOf2")}</div></div></div></div>
      </div>
      ${budgetHtml}
      ${trendHtml}
      ${heatHtml}
      ${cmpHtml}${fcHtml}
      ${allM.length > 1 ? `<div class="stat-chart-card"><div class="stat-section-label">${t("statsMonthlyDyn")}</div><div class="stat-chart-legend"><span class="stat-legend-dot" style="background:var(--income-color)"></span>${t("income")}<span class="stat-legend-dot" style="background:var(--expense-color);margin-left:12px"></span>${t("expense")}</div><div class="stat-chart-grid">${chartBars}</div></div>` : ""}
      <div class="line-chart-card"><div class="line-chart-title">${t("lineChartTitle")}</div><div class="line-chart-container"><canvas id="balanceLineChart"></canvas></div><div class="line-chart-note">${t("lineChartExplanation")}</div></div>
      <div class="pie-chart-card"><div class="pie-chart-title">🍩 ${t("statsExpCats")} ${t("pieChartTop5")}</div><div class="pie-chart-wrapper"><div class="pie-svg-container"><svg viewBox="0 0 100 100" style="width:100%;height:100%;">${pieSvg}</svg></div><div class="pie-legend">${legHtml}</div></div></div>
      ${topExp.length ? `<div class="stat-cats-card"><div class="stat-section-label">${t("statsExpCats")}</div><div class="stat-cats-list">${ceR}</div></div>` : ""}
      ${topInc.length ? `<div class="stat-cats-card income-cats"><div class="stat-section-label">${t("statsIncCats")}</div><div class="stat-cats-list">${ciR}</div></div>` : ""}
      ${tips.length ? `<div class="stat-tips-card"><div class="stat-section-label">${t("statsTips")}</div>${tips.map((tip) => `<div class="stat-tip-item">${tip}</div>`).join("")}</div>` : ""}
      <div class="stat-summary-table"><div class="stat-section-label">${t("statsSummaryTable")}</div>
        <div class="stat-sum-row"><span>${t("statsStartAmt")}</span><span>${fmt(startBalanceRub)}</span></div>
        <div class="stat-sum-row inc-row"><span>${t("statsTotalIncLabel")}</span><span style="color:var(--income-color)">+${fmt(inc)}</span></div>
        <div class="stat-sum-row exp-row"><span>${t("statsTotalExpLabel")}</span><span style="color:var(--expense-color)">−${fmt(exp)}</span></div>
        <div class="stat-sum-row bal-row"><span>${t("statsBalanceLabel")}</span><span style="color:${bal >= 0 ? "#2563eb" : "var(--expense-color)"};font-size:18px">${fmt(bal)}</span></div>
        <div class="stat-sum-row"><span>${t("statsTotalOpsLabel")}</span><span>${ptx.length}</span></div>
        <div class="stat-sum-row"><span>${t("statsSavingsLabel")}</span><span style="color:${gC}">${savedPct}% (${fmt(Math.max(0, savedAmt))})</span></div>
      </div>
    </div>`;
    content.innerHTML = html2;
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
              label: t("balance"),
              data: values,
              borderColor: "#2563eb",
              backgroundColor: "rgba(37,99,235,0.05)",
              borderWidth: 3,
              pointBackgroundColor: "#2563eb",
              pointRadius: 5,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: "var(--cream-border)" },
              ticks: { callback: (v) => v.toFixed(0) + " " + sym() },
            },
            x: { grid: { display: false } },
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
  .stats-period-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--card-bg);border-radius:var(--radius-md);padding:12px 16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stats-period-label{font-size:13px;font-weight:700;color:var(--text-muted);white-space:nowrap;}
  .stats-period-btns{display:flex;gap:6px;flex-wrap:wrap;}
  .stats-period-btn{padding:8px 14px;border-radius:99px;border:1.5px solid var(--cream-border);background:var(--cream-dark);font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;transition:var(--transition);color:var(--text-soft);}
  .stats-period-btn.active{background:var(--primary);color:white;border-color:var(--primary);}
  .stat-status-card{border-radius:var(--radius-lg);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1.5px solid transparent;}
  .stat-status-card.healthy{background:var(--income-pale);border-color:rgba(26,115,64,0.25);}
  .stat-status-card.warning{background:var(--gold-pale);border-color:var(--gold-border);}
  .stat-status-card.danger{background:var(--expense-pale);border-color:rgba(193,53,21,0.25);}
  .stat-status-left{display:flex;align-items:center;gap:12px;}
  .stat-status-emoji{font-size:34px;flex-shrink:0;}
  .stat-status-title{font-size:17px;font-weight:800;color:var(--text);margin-bottom:2px;}
  .stat-status-desc{font-size:13px;color:var(--text-soft);}
  .stat-status-count{font-size:28px;font-weight:900;color:var(--text-muted);text-align:right;flex-shrink:0;}
  .stat-status-count span{display:block;font-size:11px;font-weight:700;}
  .stat-section-label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:var(--text-muted);margin-bottom:12px;}
  .stat-section-desc{font-size:12px;color:var(--text-muted);margin-bottom:10px;}
  .stat-kpi-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;}
  @media(max-width:480px){.stat-kpi-grid{grid-template-columns:1fr 1fr;}}
  .stat-kpi{background:var(--card-bg);border-radius:var(--radius-md);padding:14px 10px;text-align:center;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stat-kpi.balance{border-top:3px solid #2563eb;}.stat-kpi.income{border-top:3px solid var(--income-color);}
  .stat-kpi.expense{border-top:3px solid var(--expense-color);}.stat-kpi.start{border-top:3px solid var(--gold);}
  .stat-kpi-icon{font-size:22px;margin-bottom:6px;}
  .stat-kpi-val{font-size:clamp(11px,3vw,15px);font-weight:900;color:var(--text);word-break:break-all;}
  .stat-kpi-val.pos{color:#2563eb;}.stat-kpi-val.neg{color:var(--expense-color);}
  .stat-kpi-val.inc{color:var(--income-color);}.stat-kpi-val.exp{color:var(--expense-color);}
  .stat-kpi-label{font-size:11px;font-weight:700;color:var(--text-muted);margin-top:4px;}
  .stat-visual-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .stat-gauge-card,.stat-donut-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stat-gauge-wrap{position:relative;display:flex;justify-content:center;}
  .stat-gauge-svg{width:100%;max-width:180px;}
  .gauge-arc{transition:stroke-dashoffset 1.3s cubic-bezier(0.34,1.3,0.64,1);}
  .stat-gauge-center{position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;}
  .stat-gauge-pct{font-size:22px;font-weight:900;}
  .stat-gauge-sub{font-size:10px;color:var(--text-muted);font-weight:700;}
  .stat-gauge-amount{text-align:center;font-size:14px;font-weight:800;margin-top:6px;}
  .stat-donut2-wrap{position:relative;width:86px;height:86px;margin:0 auto 8px;}
  .stat-donut2-svg{width:86px;height:86px;}
  .stat-donut2-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .stat-donut2-pct{font-size:18px;font-weight:900;}
  .stat-donut2-sub{font-size:9px;color:var(--text-muted);font-weight:700;}
  .stat-chart-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stat-chart-legend{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:12px;}
  .stat-legend-dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .stat-chart-grid{display:flex;align-items:flex-end;justify-content:space-around;gap:4px;height:80px;}
  .stat-chart-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;}
  .stat-chart-bars{display:flex;align-items:flex-end;gap:2px;height:64px;}
  .stat-chart-bar{width:13px;border-radius:4px 4px 0 0;min-height:3px;transition:height .8s cubic-bezier(0.34,1.3,0.64,1);}
  .stat-chart-bar.inc{background:var(--income-color);opacity:.85;}
  .stat-chart-bar.exp{background:var(--expense-color);opacity:.85;}
  .stat-chart-label{font-size:9px;font-weight:700;color:var(--text-muted);margin-top:4px;}
  .stat-cats-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);border-left:5px solid var(--expense-color);}
  .stat-cats-card.income-cats{border-left-color:var(--income-color);}
  .stat-cats-list{display:flex;flex-direction:column;gap:14px;}
  .stat-cat-row{display:flex;align-items:center;gap:10px;}
  .stat-cat-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
  .stat-cat-info{flex:1;min-width:0;}
  .stat-cat-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;}
  .stat-cat-name{font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
  .stat-cat-amount{font-size:14px;font-weight:900;white-space:nowrap;}
  .stat-cat-bar-wrap{height:6px;background:var(--cream-dark);border-radius:99px;overflow:hidden;}
  .stat-cat-bar{height:100%;border-radius:99px;transition:width .9s cubic-bezier(0.34,1.3,0.64,1);}
  .stat-cat-pct{font-size:12px;font-weight:800;min-width:32px;text-align:right;}
  .stat-tips-card{background:linear-gradient(135deg,var(--primary-pale),rgba(255,255,255,.4));border:1.5px solid rgba(64,145,108,.3);border-radius:var(--radius-lg);padding:16px;}
  .stat-tip-item{font-size:14px;color:var(--text-soft);padding:8px 0;border-bottom:1px solid var(--cream-border);}
  .stat-tip-item:last-child{border-bottom:none;}
  .stat-summary-table{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .stat-sum-row{display:flex;justify-content:space-between;align-items:center;padding:10px 6px;border-bottom:1px solid var(--cream-border);font-size:14px;}
  .stat-sum-row:last-child{border-bottom:none;}
  .stat-sum-row.bal-row{background:rgba(37,99,235,.05);margin:0 -4px;padding:10px;border-radius:8px;border-bottom:none;}
  .stat-sum-row.inc-row,.stat-sum-row.exp-row{border-bottom:none;}
  .pie-chart-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .pie-chart-title{font-size:16px;font-weight:800;margin-bottom:16px;}
  .pie-chart-wrapper{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:20px;}
  .pie-svg-container{flex-shrink:0;width:160px;height:160px;}
  .pie-legend{flex:1;min-width:140px;display:flex;flex-direction:column;gap:8px;}
  .pie-legend-item{display:flex;align-items:center;gap:8px;font-size:13px;}
  .pie-legend-color{width:14px;height:14px;border-radius:4px;flex-shrink:0;}
  .pie-legend-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .pie-legend-value{font-weight:800;}
  .line-chart-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .line-chart-title{font-size:16px;font-weight:800;margin-bottom:16px;}
  .line-chart-container{position:relative;width:100%;height:200px;}
  .line-chart-note{margin-top:8px;font-size:11px;color:var(--text-muted);text-align:center;font-style:italic;}
  .compare-card,.forecast-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .compare-title,.forecast-title{font-size:14px;font-weight:800;margin-bottom:12px;}
  .compare-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cream-border);}
  .compare-row:last-child{border-bottom:none;}
  .positive{color:var(--income-color);font-weight:700;}.negative{color:var(--expense-color);font-weight:700;}
  .ops-date-group{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);padding:8px 4px 4px;border-bottom:1px solid var(--cream-border);}
  /* ТРЕНД */
  .stat-trend-section{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .trend-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cream-border);}
  .trend-row:last-child{border-bottom:none;}
  .trend-cat{font-size:14px;font-weight:700;}.trend-val{font-size:14px;font-weight:800;}
  /* ТЕПЛОВАЯ КАРТА */
  .stat-heatmap-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .heatmap-grid{display:flex;gap:6px;align-items:flex-end;justify-content:space-around;margin-top:12px;}
  .heatmap-cell{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;}
  .heatmap-bar{width:100%;border-radius:4px 4px 0 0;min-height:4px;}
  .heatmap-day{font-size:10px;font-weight:700;color:var(--text-muted);}
  .heatmap-val{font-size:9px;color:var(--text-muted);text-align:center;}
  /* БЮДЖЕТЫ */
  .stat-budgets-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-sm);border:1.5px solid var(--cream-border);}
  .budget-row{margin-bottom:14px;}.budget-row:last-child{margin-bottom:0;}
  .budget-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
  .budget-cat{font-size:14px;font-weight:700;}
  .budget-bar-wrap{height:8px;background:var(--cream-dark);border-radius:99px;overflow:hidden;}
  .budget-bar{height:100%;border-radius:99px;transition:width .8s ease;}
  .budget-over{font-size:12px;color:var(--expense-color);font-weight:700;margin-top:4px;}
  /* ФИЛЬТР ВРЕМЕНИ */
  .history-time-filter{display:flex;align-items:center;gap:8px;padding:8px 0 12px;overflow-x:auto;}
  .htf-label{font-size:12px;font-weight:700;color:var(--text-muted);white-space:nowrap;flex-shrink:0;}
  .htf-btns{display:flex;gap:6px;overflow-x:auto;}
  .htf-btn{padding:6px 12px;border-radius:99px;border:1.5px solid var(--cream-border);background:var(--cream-dark);font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;color:var(--text-soft);transition:var(--transition);}
  .htf-btn.active{background:var(--primary);color:white;border-color:var(--primary);}
  /* ШАБЛОНЫ С КНОПКОЙ УДАЛЕНИЯ */
  .suggestion-item-wrap{display:flex;align-items:center;gap:4px;width:100%;}
  .suggestion-item-wrap .suggestion-item{flex:1;}
  .suggestion-delete-btn{flex-shrink:0;width:28px;height:28px;border-radius:50%;background:var(--expense-pale);border:none;font-size:13px;cursor:pointer;color:var(--expense-color);display:flex;align-items:center;justify-content:center;transition:var(--transition);}
  .suggestion-delete-btn:hover{background:var(--expense-color);color:#fff;}
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
      <div class="tool-card-header"><div class="tool-card-title">${t("calculator")}</div><button class="btn-secondary" id="showCalcHistoryBtn" style="padding:8px 14px;">📜</button></div>
      <div class="section-hint">${t("calcHint")}</div>
      <div class="calc-display" id="calcDisplay">0</div><div class="calc-grid" id="calcGrid"></div>
    </div>
    <div class="tool-card">
      <div class="tool-card-header"><div class="tool-card-title">${t("converter")}</div><button class="btn-secondary" id="showConvHistoryBtn" style="padding:8px 14px;">📜</button></div>
      <div class="section-hint">${t("convHint")}</div>
      <div class="field-group"><label class="field-label">${t("sumLabel")}</label><input type="number" id="convAmount" class="modal-input" value="100"></div>
      <div class="conv-row"><div><label>${t("fromCurrency")}</label><select id="convFrom" class="modal-select">${opts}</select></div><div class="conv-arrow">→</div><div><label>${t("toCurrency")}</label><select id="convTo" class="modal-select">${currencies.map((c, i) => `<option${i === 3 ? " selected" : ""}>${c}</option>`).join("")}</select></div></div>
      <button class="btn-primary" id="convBtn" style="width:100%">${t("convert")}</button>
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
    btn.className = "calc-btn";
    if (act === "clear" || act === "back") btn.classList.add("clear");
    if (["/", "*", "-", "+", "%"].includes(act)) btn.classList.add("op");
    if (act === "=") btn.className = "calc-btn equals";
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
    "+-*/".includes(action) && calcExpr && "+-*/".includes(calcExpr.slice(-1))
      ? (calcExpr = calcExpr.slice(0, -1) + action)
      : (calcExpr += action);
  }
  document.getElementById("calcDisplay").textContent = calcExpr || "0";
}
function showCalcHistoryModal() {
  let html = '<div class="history-list">';
  if (!calcHistory.length)
    html += `<p style="padding:20px;color:var(--text-muted);">Пусто</p>`;
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
      calcHistory.splice(parseInt(b.dataset.idx), 1);
      saveAll();
      closeModal("calcHistoryModal");
      setTimeout(showCalcHistoryModal, 200);
    }),
  );
  document.getElementById("clearCalcHist").addEventListener("click", () => {
    calcHistory = [];
    saveAll();
    closeModal("calcHistoryModal");
  });
}
function showConvHistoryModal() {
  let html = '<div class="history-list">';
  if (!convHistory.length)
    html += `<p style="padding:20px;color:var(--text-muted);">Пусто</p>`;
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
      convHistory.splice(parseInt(b.dataset.idx), 1);
      saveAll();
      closeModal("convHistoryModal");
      setTimeout(showConvHistoryModal, 200);
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
  const modal = createModal("notebookModal", t("editNote") || "Заметка", html);
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
function renderCategories() {
  let html = `<div class="section-hint">💡 ${t("catHint")}</div><button class="cat-unified-add-btn" id="addCatUnifiedBtn"><span class="cat-unified-icon">✚</span><div><div class="cat-unified-title">${t("addCatModalTitle")}</div></div></button><div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("expCatsTitle")}</div></div><div id="categoriesList"></div></div><div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("incomeCats")}</div></div><div id="incomeList"></div></div>`;
  document.getElementById("mainContent").innerHTML = html;
  document
    .getElementById("addCatUnifiedBtn")
    .addEventListener("click", () => openAddCategoryModal());
  function buildCatList(container, catObj, isIncome) {
    container.innerHTML = "";
    for (const [cat, data] of Object.entries(catObj)) {
      const div = document.createElement("div");
      div.className = "cat-item";
      const safeId =
        "chips-" + (isIncome ? "inc-" : "") + cat.replace(/\W/g, "_");
      const style = getCategoryStyle(cat, isIncome ? "income" : "expense");
      div.innerHTML = `<div class="cat-item-header"><div class="cat-item-name">${style.icon} ${esc(cat)}</div><button class="icon-btn delete" data-delcat="${esc(cat)}">✕</button></div><div class="chips-row" id="${safeId}"></div><button class="cat-add-sub-btn add-sub" data-cat="${esc(cat)}">＋ ${t("addSubcategory")}</button>`;
      container.appendChild(div);
      const chips = document.getElementById(safeId);
      data.subcats.forEach((sub) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = `${getSubcatIcon(sub)} ${esc(sub)} <button class="chip-del" data-cat="${esc(cat)}" data-sub="${esc(sub)}">✕</button>`;
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
function openAddCategoryModal(defType = "expense") {
  let sel = defType;
  const html = `<div class="field-group"><label class="field-label">${t("catTypeLabel")}</label><div class="cat-type-toggle"><button class="cat-type-btn expense ${defType === "expense" ? "active" : ""}" data-type="expense"><div class="cat-type-icon">💸</div><div>${t("catTypeExpenseTitle")}</div></button><button class="cat-type-btn income ${defType === "income" ? "active" : ""}" data-type="income"><div class="cat-type-icon">💰</div><div>${t("catTypeIncomeTitle")}</div></button></div></div><div class="field-group"><label class="field-label">${t("catNameLabel")}</label><input type="text" id="newCatName" class="modal-input" placeholder="${t("catNamePlaceholder")}" autofocus></div><div class="modal-actions"><button class="btn-secondary" id="addCatCancel">${t("cancel")}</button><button class="btn-primary" id="addCatSave">✚ ${t("save")}</button></div>`;
  const modal = createModal("addCatModal", t("addCatModalTitle"), html);
  document.body.appendChild(modal);
  openModal("addCatModal");
  modal.querySelectorAll(".cat-type-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      sel = btn.dataset.type;
      modal
        .querySelectorAll(".cat-type-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
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
    "🏠",
    "💊",
    "📚",
    "⚽",
    "🎬",
    "🎮",
    "🐶",
    "👕",
    "🔧",
    "📌",
    "⭐",
    "❤️",
    "✨",
    "🏃",
    "🛍️",
    "🎓",
    "🧴",
    "🏥",
  ];
  const html = `<div class="field-group"><label>${t("catNameLabel")}</label><input type="text" id="editCatName" class="modal-input" value="${esc(cat)}"></div><div class="field-group"><label>Иконка</label><select id="editCatIcon" class="modal-select">${icons.map((i) => `<option value="${i}"${i === cur.icon ? " selected" : ""}>${i}</option>`).join("")}</select></div><div class="field-group"><label>Цвет</label><input type="color" id="editCatColor" class="modal-input" value="${cur.color || "#888888"}"></div><div class="modal-actions"><button class="btn-secondary" id="cancelEditCat">${t("cancel")}</button><button class="btn-primary" id="saveEditCat">${t("save")}</button></div>`;
  const modal = createModal("editCategoryModal", t("editCatTitle"), html);
  document.body.appendChild(modal);
  openModal("editCategoryModal");
  document
    .getElementById("cancelEditCat")
    .addEventListener("click", () => closeModal("editCategoryModal"));
  document.getElementById("saveEditCat").addEventListener("click", () => {
    const nn = document.getElementById("editCatName").value.trim(),
      ni = document.getElementById("editCatIcon").value,
      nc = document.getElementById("editCatColor").value;
    if (!nn) {
      showToast(t("enterAmount"), "error");
      return;
    }
    if (nn !== cat && catObj[nn]) {
      showToast("⚠️ Уже существует", "error");
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
// НАСТРОЙКИ
// ============================================================
function renderProfilesBody() {
  if (!profiles.length)
    profiles = [{ id: "default", name: "Я", emoji: "👤", color: "#2d6a4f" }];
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
    "🧑‍🍳",
    "🧑‍🎨",
  ];
  return profiles
    .map((p, i) => {
      const isActive = p.id === activeProfileId;
      // Вычисляем статистику профиля
      const pRaw = localStorage.getItem("budget_profile_" + p.id);
      let pTxCount = 0,
        pBalance = 0;
      if (pRaw) {
        const pd = JSON.parse(pRaw);
        pTxCount = (pd.transactions || []).length;
        const inc = (pd.transactions || [])
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amountRub, 0);
        const exp = (pd.transactions || [])
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amountRub, 0);
        pBalance = inc - exp;
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
      return `<div style="display:flex;align-items:center;gap:12px;padding:12px;margin-bottom:8px;background:${isActive ? "var(--primary-pale)" : "var(--cream-dark)"};border-radius:16px;border:2px solid ${isActive ? "var(--primary)" : "var(--cream-border)"};transition:all .2s;">
      <div style="width:44px;height:44px;border-radius:50%;background:${p.color || "#2d6a4f"};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 3px 10px ${p.color || "#2d6a4f"}40;">${p.emoji || "👤"}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:15px;font-weight:800;color:var(--text);">${esc(p.name)}${isActive ? ` <span style="font-size:11px;font-weight:700;color:var(--primary);background:var(--primary-pale);padding:2px 8px;border-radius:99px;">${t("profileActive")}</span>` : ""} ${p.shareSettings?.shareId ? (p.shareSettings?.locked ? ` <span style="font-size:11px;font-weight:700;color:var(--expense-color);background:var(--expense-pale);padding:2px 8px;border-radius:99px;">🔒</span>` : `<span style="font-size:11px;font-weight:700;color:var(--income-color);background:var(--income-pale);padding:2px 8px;border-radius:99px;">🔗</span>`) : ""}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${pTxCount} ${t("statsRec")} · ${fmt(pBalance)}</div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;">
        ${!isActive ? `<button class="icon-btn edit" data-switchpid="${p.id}" style="width:34px;height:34px;font-size:14px;" title="${t("profileSwitch")}">▶</button>` : ""}
        <button class="icon-btn edit" data-renamepid="${p.id}" style="width:34px;height:34px;font-size:14px;" title="${t("profileRename")}">✏️</button>
        <button class="icon-btn edit" data-sharepid="${p.id}" style="width:34px;height:34px;font-size:14px;background:${p.shareSettings?.shareId ? "var(--income-pale)" : "var(--primary-pale)"};color:${p.shareSettings?.shareId ? "var(--income-color)" : "var(--primary)"};" title="${t("shareTitle")}">🔗</button>
        ${profiles.length > 1 ? `<button class="icon-btn delete" data-deletepid="${p.id}" style="width:34px;height:34px;font-size:14px;" title="${t("profileDelete")}">🗑</button>` : ""}
      </div>
    </div>`;
    })
    .join("");
}

function renderSettings() {
  // Строим HTML тела бюджетов и повторяющихся динамически
  const now = new Date();
  const ms = new Date(now.getFullYear(), now.getMonth(), 1);
  // Бюджеты
  let budgetsHtml = "";
  if (!Object.keys(categoryBudgets).length) {
    budgetsHtml = `<div style="color:var(--text-muted);font-size:14px;padding:8px 0;">${t("budgetNoBudgets")}</div>`;
  } else {
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
      budgetsHtml += `<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><span style="font-weight:700;">${getCategoryStyle(cat, "expense").icon} ${esc(cat)}</span><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:13px;font-weight:700;color:${cl};">${fmt(spent)} / ${fmt(limit)}</span><button class="icon-btn delete" data-budgetcat="${esc(cat)}" style="width:26px;height:26px;font-size:13px;">✕</button></div></div><div style="height:8px;background:var(--cream-dark);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cl};border-radius:99px;"></div></div>${over ? `<div style="font-size:11px;color:var(--expense-color);font-weight:700;margin-top:2px;">${t("budgetOverLimit")}</div>` : ""}</div>`;
    });
  }
  // Повторяющиеся
  const freqMap = {
    monthly: t("recurringMonthly"),
    weekly: t("recurringWeekly"),
    daily: t("recurringDaily"),
  };
  let recurringHtml = "";
  if (!recurringOps.length) {
    recurringHtml = `<div style="color:var(--text-muted);font-size:14px;">${t("recurringNone")}</div>`;
  } else {
    recurringOps.forEach((op, i) => {
      recurringHtml += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--cream-border);"><div><div style="font-size:14px;font-weight:700;">${op.type === "expense" ? "💸" : "💰"} ${esc(op.category)} — ${fmt(op.amountRub)}</div><div style="font-size:12px;color:var(--text-muted);">${freqMap[op.freq] || op.freq}${op.freq === "monthly" ? " (" + op.day + " числа)" : ""}</div></div><button class="icon-btn delete" data-recidx="${i}" style="width:28px;height:28px;font-size:14px;">🗑</button></div>`;
    });
  }
  // Шаблоны
  let templatesHtml = "";
  if (!userTemplates.length) {
    templatesHtml = `<div style="color:var(--text-muted);font-size:14px;">${t("noTemplates")}</div>`;
  } else {
    userTemplates.forEach((tpl) => {
      const icon = tpl.type === "expense" ? "💸" : "💰";
      templatesHtml += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--cream-border);"><span style="font-size:14px;font-weight:600;">${icon} ${esc(tpl.name || tpl.category)} · ${fmt(tpl.amountRub)}</span><button class="icon-btn delete" data-tplid="${tpl.id}" style="width:28px;height:28px;font-size:14px;">🗑</button></div>`;
    });
  }

  const html = `
    ${
      sharedAccessProfile &&
      sharedAccessProfile.profileId === activeProfileId &&
      profiles.find((p) => !p.isShared && !p.isOwnerView)
        ? `
    <div style="padding:16px;background:rgba(37,99,235,0.1);border-radius:16px;margin-bottom:14px;border:1.5px solid rgba(37,99,235,0.3);display:flex;align-items:center;gap:12px;">
      <div style="font-size:28px;">👤</div>
      <div>
        <div style="font-weight:800;color:#2563eb;">${t("guestMode")}</div>
        <div style="font-size:13px;color:var(--text-muted);">${t("guestOf")} <b>${esc(profiles.find((p) => p.id === sharedAccessProfile.profileId)?.name || "?")}</b></div>
      </div>
    </div>`
        : ""
    }
    <div class="settings-card"><div class="settings-card-title">${t("currency")}</div><div class="settings-card-body"><select id="currencySelect" class="settings-select"><option value="RUB">🇷🇺 ${t("currRUB")}</option><option value="USD">🇺🇸 ${t("currUSD")}</option><option value="EUR">🇪🇺 ${t("currEUR")}</option><option value="GEL">🇬🇪 ${t("currGEL")}</option><option value="GBP">🇬🇧 ${t("currGBP")}</option><option value="KZT">🇰🇿 ${t("currKZT")}</option></select></div></div>
    <!-- ЦВЕТОВЫЕ ТЕМЫ -->
    <div class="settings-card" style="border-left-color:#9b5de5;">
      <div class="settings-card-title">${t("themeCardTitle")}</div>
      <div class="settings-card-desc">${t("themeCardDesc")}</div>
      <div class="settings-card-body">
        <button class="settings-btn primary" id="resetThemeBtn" style="margin-bottom:14px;justify-content:center;">${t("resetThemeBtn")}</button>
        <div style="margin-bottom:10px;font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px;">${t("themeDay")}</div>
        <div style="display:flex;flex-direction:column;gap:10px;" id="dayThemePicker">
          ${["white", "default", "sunset"]
            .map((k) => {
              const th = COLOR_THEMES[k];
              const isActive = colorTheme === k;
              return `<button class="theme-swatch-btn" data-theme="${k}" style="display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:18px;border:2px solid ${isActive ? th.accent : "var(--cream-border)"};background:${isActive ? "var(--primary-pale)" : "var(--cream-dark)"};cursor:pointer;font-family:inherit;transition:all .25s;text-align:left;width:100%;box-shadow:${isActive ? "0 4px 16px " + th.accent + "40" : "none"};"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${th.accent},${th.vars["--primary-med"] || th.accent});flex-shrink:0;box-shadow:0 3px 10px ${th.accent}50;display:flex;align-items:center;justify-content:center;font-size:16px;">${k === "white" ? "⬜" : k === "default" ? "🌿" : "🌅"}</div><div style="flex:1;"><div style="font-size:15px;font-weight:800;color:var(--text);">${tObj("themeLabels")[k] || th.label}</div><div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${tObj("themeDescs")[k] || ""}</div></div>${isActive ? `<div style="width:24px;height:24px;border-radius:50%;background:${th.accent};display:flex;align-items:center;justify-content:center;font-size:13px;color:white;">✓</div>` : ""}</button>`;
            })
            .join("")}
        </div>
        <div style="margin:16px 0 10px;font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px;">${t("themeNight")}</div>
        <div style="display:flex;flex-direction:column;gap:10px;" id="nightThemePicker">
          ${["dark", "navy", "gold"]
            .map((k) => {
              const th = COLOR_THEMES[k];
              const isActive = colorTheme === k;
              return `<button class="theme-swatch-btn" data-theme="${k}" style="display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:18px;border:2px solid ${isActive ? th.accent : "var(--cream-border)"};background:${isActive ? "var(--primary-pale)" : "var(--cream-dark)"};cursor:pointer;font-family:inherit;transition:all .25s;text-align:left;width:100%;box-shadow:${isActive ? "0 4px 16px " + th.accent + "50" : "none"};"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${th.accent},${th.vars["--primary-med"] || th.accent});flex-shrink:0;box-shadow:0 3px 10px ${th.accent}60;display:flex;align-items:center;justify-content:center;font-size:16px;">${k === "dark" ? "🌿" : k === "navy" ? "🌌" : "✨"}</div><div style="flex:1;"><div style="font-size:15px;font-weight:800;color:var(--text);">${tObj("themeLabels")[k] || th.label}</div><div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${tObj("themeDescs")[k] || ""}</div></div>${isActive ? `<div style="width:24px;height:24px;border-radius:50%;background:${th.accent};display:flex;align-items:center;justify-content:center;font-size:13px;color:${k === "gold" ? "#1a0c00" : "white"};">✓</div>` : ""}</button>`;
            })
            .join("")}
        </div>
      </div>
    </div>
    <div class="settings-card"><div class="settings-card-title">${t("language")}</div><div class="settings-card-body"><select id="langSelect" class="settings-select"><option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option><option value="ka">🇬🇪 ქართული</option></select></div></div>
    <!-- ПИН-КОД -->
    <div class="settings-card">
      <div class="settings-card-title">${t("pinCode")}</div>
      <div class="settings-card-desc">${t("pinProtect")}</div>
      <div class="settings-card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;"><span>${t("pinEnable")}</span><label class="switch"><input type="checkbox" id="pinToggle" ${pinEnabled ? "checked" : ""}><span class="slider round"></span></label></div>
        ${pinEnabled ? `<button class="settings-btn primary" id="changePinBtn">${t("pinChange")}</button>` : ""}
      </div>
    </div>
    <!-- БИОМЕТРИЯ -->
    <div class="settings-card" id="biometryCard" style="border-left-color:#0ea5e9;">
      <div class="settings-card-title">${t("biometryTitle")}</div>
      <div class="settings-card-desc" id="bioDesc">${t("biometryDesc")}</div>
      <div class="settings-card-body" id="biometryBody">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span style="font-size:15px;font-weight:600;">${t("biometryToggleLabel")}</span>
          <label class="switch"><input type="checkbox" id="biometryToggle" ${biometryEnabled ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        ${biometryEnabled ? `<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--income-pale);border-radius:12px;border:1px solid var(--income-color);"><span style="font-size:20px;">✅</span><span style="font-size:14px;font-weight:700;color:var(--income-color);">Биометрия настроена</span></div><button class="settings-btn danger" id="biometryResetBtn" style="margin-top:10px;">🗑 Отключить и удалить</button>` : `<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--cream-dark);border-radius:12px;" id="bioStatusBlock"><span style="font-size:20px;">🔍</span><span id="bioStatusText" style="font-size:14px;font-weight:600;color:var(--text-muted);">Проверка доступности...</span></div>`}
      </div>
    </div>
    <!-- БЮДЖЕТЫ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("budgets")}</div>
      <div class="settings-card-desc">${t("budgetDesc")}</div>
      <div class="settings-card-body" id="budgetsBody">
        ${budgetsHtml}
        <button class="settings-btn primary" id="addBudgetBtn" style="margin-top:10px;">${t("addBudget")}</button>
      </div>
    </div>
    <!-- ПОВТОРЯЮЩИЕСЯ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("recurring")}</div>
      <div class="settings-card-desc">${t("recurringDesc")}</div>
      <div class="settings-card-body" id="recurringBody">
        ${recurringHtml}
        <button class="settings-btn primary" id="addRecurringBtn" style="margin-top:10px;">${t("addRecurring")}</button>
      </div>
    </div>
    <!-- ШАБЛОНЫ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("manageTemplates")}</div>
      <div class="settings-card-body" id="templatesSettingsBody">${templatesHtml}</div>
    </div>
    <!-- ПРОФИЛИ -->
    <div class="settings-card" style="border-left-color:#06b6d4;">
      <div class="settings-card-title">${t("profilesTitle")}</div>
      <div class="settings-card-desc">${t("profilesDesc")}</div>
      <div class="settings-card-body" id="profilesBody">
        ${renderProfilesBody()}
        ${profiles.length < 10 ? `<button class="settings-btn primary" id="addProfileBtn" style="margin-top:12px;">${t("addProfile")}</button>` : `<div style="color:var(--text-muted);font-size:13px;margin-top:8px;">${t("profilesMax")}</div>`}
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--cream-border);">
        <button class="settings-btn primary" id="connectProfileBtn" style="background:var(--balance-pale);color:#2563eb;border-color:rgba(37,99,235,0.25);">
          🔗 ${t("connectProfile")}
        </button>
      </div>
      </div>
    </div>
    <!-- ДАННЫЕ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("data")}</div>
      <div class="settings-card-body">
        <button class="settings-btn primary" id="refreshRatesBtn">${t("updateRates")}</button>
        <button class="settings-btn primary" id="exportJSONBtn" style="margin-top:8px;">${t("exportJSON")}</button>
        <button class="settings-btn primary" data-receivesync="1" style="margin-top:8px;">${t("shareSyncReceive")} (${t("guestMode")})</button>
        <button class="settings-btn primary" id="importJSONBtn" style="margin-top:8px;">${t("importJSON")}</button>
        <input type="file" id="importFileInput" accept=".json" style="display:none;">
        <button class="settings-btn primary" id="exportCSVBtn" style="margin-top:8px;">${t("exportCSV")}</button>
        <button class="settings-btn primary" id="exportPDFBtn" style="margin-top:8px;">${t("exportPDF")}</button>
        <button class="settings-btn primary" id="cloudSaveBtn" style="margin-top:8px;">${t("cloudSave")}</button>
        <button class="settings-btn primary" id="cloudLoadBtn" style="margin-top:8px;">${t("cloudLoad")}</button>
        <button class="settings-btn danger" id="clearAllBtn" style="margin-top:8px;">${t("resetAll")}</button>
      </div>
    </div>
    <!-- НАПОМИНАНИЯ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("reminders")}</div>
      <div class="settings-card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;"><span>${t("remindersEnable")}</span><label class="switch"><input type="checkbox" id="remindersToggle" ${remindersEnabled ? "checked" : ""}><span class="slider round"></span></label></div>
        <div id="remindersIntervalDiv" style="display:${remindersEnabled ? "block" : "none"};"><label class="field-label">${t("remindersInterval")}</label><select id="remindersIntervalSelect" class="settings-select"><option value="daily" ${remindersInterval === "daily" ? "selected" : ""}>${t("remindersDaily")}</option><option value="every3days" ${remindersInterval === "every3days" ? "selected" : ""}>${t("remindersEvery3Days")}</option><option value="weekly" ${remindersInterval === "weekly" ? "selected" : ""}>${t("remindersWeekly")}</option></select></div>
      </div>
    </div>
    ${
      sharedAccessProfile
        ? `
    <div class="settings-card" style="border-left-color:#2563eb;">
      <div class="settings-card-title">🔄 ${t("syncTitle")}</div>
      <div class="settings-card-desc">${t("syncHint")}</div>
      <div class="settings-card-body">
        <button class="settings-btn primary" id="guestPushBtn" style="margin-bottom:8px;">${t("shareSyncSend")}</button>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${t("syncHint")}</div>
      </div>
    </div>`
        : ""
    }
    <div style="text-align:center;padding:20px;color:var(--text-muted);">${t("versionFooter")}</div>`;
  document.getElementById("mainContent").innerHTML = html;

  // Валюта
  document.getElementById("currencySelect").value = displayCurrency;
  document.getElementById("currencySelect").onchange = (e) => {
    displayCurrency = e.target.value;
    saveAll();
    updateTopBlocks();
    showToast(t("currencyChanged"));
  };
  // Язык
  document.getElementById("langSelect").value = currentLang;
  document.getElementById("langSelect").onchange = (e) =>
    setLanguage(e.target.value);

  // Пин
  document.getElementById("pinToggle").addEventListener("change", (e) => {
    if (e.target.checked) openPinSetModal();
    else {
      askConfirm(
        t("pinDisable"),
        () => {
          pinHash = null;
          pinEnabled = false;
          saveAll();
          showToast(t("pinDisabled"));
          renderSettings();
        },
        { icon: "🔒" },
      );
      e.target.checked = pinEnabled;
    }
  });
  document
    .getElementById("changePinBtn")
    ?.addEventListener("click", () => openPinSetModal(true));

  // ============================================================
  // ПРОФИЛИ — обработчики
  // ============================================================
  const profilesBody = document.getElementById("profilesBody");
  if (profilesBody) {
    // Переключение профиля
    profilesBody.querySelectorAll("[data-switchpid]").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchProfile(btn.dataset.switchpid);
      });
    });
    // Дать доступ
    profilesBody.querySelectorAll("[data-sharepid]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prof = profiles.find((p) => p.id === btn.dataset.sharepid);
        if (!prof) return;
        openShareModal(prof);
      });
    });

    // Переименование
    profilesBody.querySelectorAll("[data-renamepid]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prof = profiles.find((p) => p.id === btn.dataset.renamepid);
        if (!prof) return;
        openProfileEditModal(prof);
      });
    });
    // Удаление
    profilesBody.querySelectorAll("[data-deletepid]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prof = profiles.find((p) => p.id === btn.dataset.deletepid);
        if (!prof) return;
        askConfirm(
          t("profileDeleteConfirm"),
          () => {
            if (prof.id === activeProfileId) {
              const other = profiles.find((p) => p.id !== prof.id);
              if (other) switchProfile(other.id);
            }
            localStorage.removeItem("budget_profile_" + prof.id);
            profiles = profiles.filter((p) => p.id !== prof.id);
            saveGlobal();
            renderSettings();
            showToast(t("deleted"));
          },
          { icon: "🗑️" },
        );
      });
    });
    // Добавить профиль
    document
      .getElementById("connectProfileBtn")
      ?.addEventListener("click", () => {
        openConnectModal();
      });

    document.getElementById("addProfileBtn")?.addEventListener("click", () => {
      openProfileEditModal(null);
    });
  }

  // Сброс темы к дефолту
  document.getElementById("resetThemeBtn")?.addEventListener("click", () => {
    applyColorTheme("default");
    showToast("🔄 " + t("resetThemeBtn"));
    setTimeout(() => renderSettings(), 300);
  });

  // Цветовые темы — свотчи
  document.querySelectorAll(".theme-swatch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyColorTheme(btn.dataset.theme);
      showToast("🎨 Тема применена");
      setTimeout(() => renderSettings(), 300);
    });
  });

  // Биометрия — проверка доступности при загрузке страницы настроек
  (async () => {
    const avail = await isBiometryAvailable();
    const statusEl = document.getElementById("bioStatusText");
    const statusBlock = document.getElementById("bioStatusBlock");
    if (statusEl) {
      if (avail) {
        statusEl.textContent = t("biometrySupported");
        statusEl.style.color = "var(--income-color)";
        if (statusBlock)
          statusBlock.querySelector("span:first-child").textContent = "✅";
      } else {
        statusEl.textContent = t("biometryNotSupported");
        if (statusBlock)
          statusBlock.querySelector("span:first-child").textContent = "❌";
      }
    }
    const bioToggle = document.getElementById("biometryToggle");
    if (bioToggle) {
      if (!avail) {
        bioToggle.disabled = true;
        bioToggle.parentElement.style.opacity = "0.5";
      }
      bioToggle.addEventListener("change", async (e) => {
        if (e.target.checked) {
          if (!avail) {
            showToast("Биометрия недоступна", "error");
            e.target.checked = false;
            return;
          }
          showToast("⏳ Запрос биометрии...");
          const ok = await biometryRegister();
          if (ok) {
            biometryEnabled = true;
            saveAll();
            showToast("✅ Биометрия настроена");
            setTimeout(() => renderSettings(), 400);
          } else {
            showToast("❌ Не удалось настроить биометрию", "error");
            e.target.checked = false;
          }
        } else {
          askConfirm(
            "Отключить биометрию?",
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
    document
      .getElementById("biometryResetBtn")
      ?.addEventListener("click", () => {
        askConfirm(
          "Удалить биометрию?",
          () => {
            biometryEnabled = false;
            biometryCredId = null;
            saveAll();
            showToast("🗑 Биометрия удалена");
            renderSettings();
          },
          { icon: "🗑️" },
        );
      });
  })();

  // Удаление бюджетов
  document
    .getElementById("budgetsBody")
    .querySelectorAll("[data-budgetcat]")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        askConfirm(
          t("budgetDeleteConfirm"),
          () => {
            delete categoryBudgets[btn.dataset.budgetcat];
            saveAll();
            renderSettings();
          },
          { icon: "🗑️" },
        ),
      );
    });
  document
    .getElementById("addBudgetBtn")
    .addEventListener("click", openAddBudgetModal);

  // Удаление повторяющихся
  document
    .getElementById("recurringBody")
    .querySelectorAll("[data-recidx]")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        askConfirm(
          t("recurringDeleteConfirm"),
          () => {
            recurringOps.splice(parseInt(btn.dataset.recidx), 1);
            saveAll();
            renderSettings();
          },
          { icon: "🗑️" },
        ),
      );
    });
  document
    .getElementById("addRecurringBtn")
    .addEventListener("click", openAddRecurringModal);

  // Удаление шаблонов в настройках
  document
    .getElementById("templatesSettingsBody")
    .querySelectorAll("[data-tplid]")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        askConfirm(
          t("deleteTemplate"),
          () => {
            removeUserTemplate(parseInt(btn.dataset.tplid));
            renderSettings();
            showToast(t("deleted"));
          },
          { icon: "🗑️" },
        ),
      );
    });

  // Курсы
  document.getElementById("refreshRatesBtn").onclick = async () => {
    document.getElementById("refreshRatesBtn").textContent = t("loading");
    try {
      const r = await fetch("https://api.exchangerate-api.com/v4/latest/RUB");
      const d = await r.json();
      for (const c of ["USD", "EUR", "GEL", "GBP", "KZT"])
        exchangeRates[c] = d.rates[c] || exchangeRates[c];
      saveAll();
      updateTopBlocks();
      showToast(t("ratesUpdated"));
    } catch (e) {
      showToast(t("error"), "error");
    }
    document.getElementById("refreshRatesBtn").textContent = t("updateRates");
  };
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
  const ifi = document.getElementById("importFileInput");
  document
    .getElementById("importJSONBtn")
    ?.addEventListener("click", () => ifi.click());
  ifi?.addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) {
      importFromJSON(f);
      ifi.value = "";
    }
  });
  document.getElementById("clearAllBtn").onclick = () => {
    askConfirm(
      t("resetConfirmMsg"),
      () => {
        transactions = [];
        startBalanceRub = 70000;
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
        saveAll();
        updateTopBlocks();
        showToast(t("resetDone"));
        setTimeout(() => setTab("home"), 500);
      },
      { icon: "⚠️", title: t("resetConfirmTitle"), yesText: t("yesDeleteAll") },
    );
  };

  // Синхронизация (гость)
  document
    .getElementById("guestPushBtn")
    ?.addEventListener("click", () => guestPushChanges());

  // Owner — получить изменения от гостя (input file)
  document.querySelectorAll("[data-receivesync]").forEach((btn) => {
    const fi = document.createElement("input");
    fi.type = "file";
    fi.accept = ".json";
    fi.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (f) ownerReceiveChanges(f);
      fi.value = "";
    });
    btn.addEventListener("click", () => fi.click());
  });

  // Напоминания
  const rt = document.getElementById("remindersToggle"),
    rid = document.getElementById("remindersIntervalDiv"),
    ris = document.getElementById("remindersIntervalSelect");
  if (rt)
    rt.addEventListener("change", (e) => {
      remindersEnabled = e.target.checked;
      saveReminderSettings();
      if (remindersEnabled) {
        if (Notification.permission !== "granted") {
          Notification.requestPermission().then((p) => {
            if (p === "granted") {
              startReminderTimer();
              showToast(t("remindersPermissionGranted"));
            } else {
              showToast(t("remindersPermissionDenied"), "error");
              rt.checked = false;
              remindersEnabled = false;
              saveReminderSettings();
            }
          });
        } else {
          startReminderTimer();
          showToast(t("remindersPermissionGranted"));
        }
        rid.style.display = "block";
      } else {
        stopReminderTimer();
        rid.style.display = "none";
        showToast(t("remindersDisabled"));
      }
    });
  if (ris)
    ris.addEventListener("change", (e) => {
      remindersInterval = e.target.value;
      saveReminderSettings();
      if (remindersEnabled) {
        stopReminderTimer();
        startReminderTimer();
      }
      showToast(t("saved"));
    });
}

// ============================================================
// ПИН — УСТАНОВКА
// ============================================================

// ============================================================
// СИСТЕМА ОБЩЕГО ДОСТУПА К ПРОФИЛЯМ
// ============================================================

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

// Получить сохранённый URL приложения (если пользователь его указал)
function getAppUrl() {
  const saved = localStorage.getItem("budgetpro_app_url") || "";
  if (saved) return saved;
  // Автоопределение: если приложение открыто на https:// — используем этот URL
  if (window.location.protocol === "https:") {
    const autoUrl =
      window.location.origin +
      window.location.pathname.replace(/\/[^/]*$/, "/");
    localStorage.setItem("budgetpro_app_url", autoUrl);
    return autoUrl;
  }
  return "";
}

// Store share data in free cloud (multiple services as fallback)
async function storeShareCloud(pkg) {
  // Encode directly in URL - no external service, no CORS issues
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(pkg))));
    return "inline_" + encoded;
  } catch (e) {
    return null;
  }
}

async function fetchShareCloud(blobId) {
  if (!blobId) return null;
  // Inline encoded data
  if (blobId.startsWith("inline_")) {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(blobId.slice(7)))));
    } catch (e) {
      return null;
    }
  }
  // Legacy: try local storage
  if (blobId.startsWith("local_") || blobId.startsWith("share_")) {
    try {
      const encoded = localStorage.getItem("cloud_" + blobId);
      if (encoded) return JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {}
  }
  // No external services used
  return null;
}

async function generateShareLink(prof) {
  if (!prof.shareSettings?.shareId) return null;
  const ss = prof.shareSettings;
  // Данные включаются ТОЛЬКО если viewOwner=true — иначе гость видит только свой пустой профиль
  const viewOwner = ss.perms?.viewOwner === true;
  let ownerData = null;
  if (viewOwner) {
    const raw = JSON.parse(
      localStorage.getItem("budget_profile_" + prof.id) || "{}",
    );
    // Обрезаем для URL (последние 80 транзакций)
    ownerData = { ...raw };
    if (ownerData.transactions?.length > 80)
      ownerData.transactions = ownerData.transactions.slice(-80);
  }

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
    ownerData: ownerData, // null если viewOwner=false
    viewOwner: viewOwner,
    ts: new Date().toISOString(),
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(pkg))));
  const customUrl = getAppUrl();

  if (customUrl && customUrl.startsWith("http")) {
    // Используем пользовательский URL (размещение в интернете)
    const base = customUrl.replace(/#.*$/, "");
    return `${base}#share=${encoded}`;
  } else {
    // Локальный файл — ссылка будет только для текущего устройства
    const base = window.location.href.split("#")[0];
    return { local: true, url: `${base}#share=${encoded}`, encoded, pkg };
  }
}

// Генерация HTML-файла приглашения — работает БЕЗ сервера
// Получатель просто открывает файл в браузере
async function generateInviteHtmlFile(prof) {
  const linkResult = await generateShareLink(prof);
  if (!linkResult) return null;
  const encoded =
    typeof linkResult === "string"
      ? linkResult.split("#share=")[1]
      : linkResult.encoded;
  const pkg =
    typeof linkResult === "string"
      ? JSON.parse(decodeURIComponent(escape(atob(encoded))))
      : linkResult.pkg;
  const appUrl = getAppUrl() || window.location.href.split("#")[0];
  const color = pkg.pcolor || "#2d6a4f";

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>🎉 Вас приглашают в БюджетPRO</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#f0f4ff 0%,#fafff5 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .card{background:white;border-radius:28px;padding:32px 28px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.12)}
  .avatar{width:88px;height:88px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:46px;margin:0 auto 20px;box-shadow:0 8px 28px ${color}50}
  h1{font-size:22px;font-weight:900;color:#1a1a1a;margin-bottom:8px}
  .subtitle{font-size:15px;color:#888;margin-bottom:6px}
  .profile-name{font-size:26px;font-weight:900;color:${color};margin-bottom:24px}
  .perms{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:24px}
  .perm{font-size:12px;padding:4px 10px;border-radius:99px;font-weight:700}
  .perm.ok{background:#ecfdf5;color:#059669}
  .perm.no{background:#fef2f2;color:#dc2626}
  .btn{display:block;width:100%;padding:18px;border-radius:99px;border:none;font-size:18px;font-weight:800;cursor:pointer;transition:all .2s;text-decoration:none;margin-bottom:12px}
  .btn-main{background:${color};color:white;box-shadow:0 6px 20px ${color}40}
  .btn-main:hover{transform:translateY(-2px);box-shadow:0 10px 28px ${color}50}
  .btn-secondary{background:#f5f5f5;color:#666;font-size:15px;padding:14px}
  .info{font-size:12px;color:#aaa;margin-top:16px;line-height:1.6}
  .pwd-section{margin-bottom:20px}
  .pwd-input{width:100%;padding:14px;border:2px solid #e5e7eb;border-radius:14px;font-size:18px;text-align:center;letter-spacing:4px;outline:none;font-family:inherit}
  .pwd-input:focus{border-color:${color}}
  .pwd-label{font-size:13px;color:#888;margin-bottom:8px;font-weight:600}
  .pwd-err{color:#dc2626;font-size:13px;margin-top:8px;min-height:18px}
  .lang-bar{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
  .lang-btn{padding:4px 12px;border-radius:99px;border:1.5px solid #e5e7eb;background:#f9f9f9;font-size:12px;font-weight:700;cursor:pointer}
  .lang-btn.active{background:${color};color:white;border-color:${color}}
  @media(max-width:400px){.card{padding:24px 18px}.profile-name{font-size:22px}}
</style>
</head>
<body>
<div class="card">
  <div class="lang-bar">
    <button class="lang-btn active" onclick="setLang('ru')">🇷🇺 RU</button>
    <button class="lang-btn" onclick="setLang('en')">🇬🇧 EN</button>
    <button class="lang-btn" onclick="setLang('ka')">🇬🇪 KA</button>
  </div>
  <div class="avatar">${pkg.pemoji || "👤"}</div>
  <h1 id="title">👋 Вас приглашают!</h1>
  <div class="subtitle" id="subtitle">Профиль в приложении БюджетPRO</div>
  <div class="profile-name">«${(pkg.pname || "").replace(/</g, "&lt;")}»</div>
  ${pkg.hasPwd ? `<div class="pwd-section"><div class="pwd-label" id="pwdLabel">🔒 Введите пароль для входа</div><input type="password" id="pwdInput" class="pwd-input" placeholder="••••••••"><div class="pwd-err" id="pwdErr"></div></div>` : ""}
  <div class="perms" id="permsBlock"></div>
  <a class="btn btn-main" id="openBtn" href="#">${pkg.hasPwd ? "🔓 Войти" : "🚀 Открыть"}</a>
  <button class="btn btn-secondary" onclick="window.history.back()" id="cancelBtn">Отмена / Cancel</button>
  <div class="info" id="infoText">Нажмите кнопку выше — откроется БюджетPRO с вашим профилем</div>
</div>
<script>
const DATA="${encoded}";
const APP_URL="${appUrl}";
const PERMS=${JSON.stringify(pkg.perms || {})};
const PERM_LABELS={
  ru:{add:"Добавление",del:"Удаление",edit:"Редактирование",stats:"Статистика",notes:"Заметки",budgets:"Бюджеты",cats:"Категории",export:"Экспорт"},
  en:{add:"Adding",del:"Deleting",edit:"Editing",stats:"Statistics",notes:"Notes",budgets:"Budgets",cats:"Categories",export:"Export"},
  ka:{add:"დამატება",del:"წაშლა",edit:"რედაქტირება",stats:"სტატისტიკა",notes:"შენიშვნები",budgets:"ბიუჯეტები",cats:"კატეგორიები",export:"ექსპორტი"}
};
const STRINGS={
  ru:{title:"👋 Вас приглашают!",subtitle:"Профиль в БюджетPRO",pwd:"🔒 Введите пароль для входа",info:"Нажмите кнопку — откроется БюджетPRO с вашим профилем",open:"🚀 Открыть профиль",cancel:"Отмена"},
  en:{title:"👋 You're invited!",subtitle:"Profile in BudgetPRO",pwd:"🔒 Enter password to enter",info:"Tap the button — BudgetPRO will open with your profile",open:"🚀 Open profile",cancel:"Cancel"},
  ka:{title:"👋 გიწვევენ!",subtitle:"პროფილი BudgetPRO-ში",pwd:"🔒 შეიყვანეთ პაროლი",info:"დააჭირეთ ღილაკს — BudgetPRO გაიხსნება თქვენი პროფილით",open:"🚀 პროფილის გახსნა",cancel:"გაუქმება"}
};
let lang="ru";
function setLang(l){
  lang=l;
  document.querySelectorAll(".lang-btn").forEach(b=>{b.classList.toggle("active",b.textContent.includes(l.toUpperCase()))});
  const s=STRINGS[l];
  document.getElementById("title").textContent=s.title;
  document.getElementById("subtitle").textContent=s.subtitle;
  const pwdLabel=document.getElementById("pwdLabel");
  if(pwdLabel)pwdLabel.textContent=s.pwd;
  document.getElementById("openBtn").textContent=${pkg.hasPwd ? '"🔓 "+s.open' : '"🚀 "+s.open'};
  document.getElementById("cancelBtn").textContent=s.cancel;
  document.getElementById("infoText").textContent=s.info;
  // Rebuild perms
  const pb=document.getElementById("permsBlock");
  pb.innerHTML=Object.entries(PERMS).filter(([k])=>k!=="viewOwner"&&k!=="pwHash").map(([k,v])=>
    \`<span class="perm \${v?'ok':'no'}">\${v?"✅":"❌"} \${(PERM_LABELS[lang]||PERM_LABELS.ru)[k]||k}</span>\`
  ).join("");
}
setLang("ru");
document.getElementById("openBtn").addEventListener("click",async function(e){
  e.preventDefault();
  ${
    pkg.hasPwd
      ? `
  const pwd=document.getElementById("pwdInput").value.trim();
  if(!pwd){document.getElementById("pwdErr").textContent={ru:"Введите пароль",en:"Enter password",ka:"შეიყვანეთ პაროლი"}[lang];return;}
  // Verify password hash
  const data=new TextEncoder().encode(pwd+"share_salt_2024");
  const buf=await crypto.subtle.digest("SHA-256",data);
  const hash=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,16);
  const pkg=JSON.parse(decodeURIComponent(escape(atob(DATA))));
  if(hash!==pkg.pwHash){document.getElementById("pwdErr").textContent={ru:"Неверный пароль",en:"Wrong password",ka:"არასწორი პაროლი"}[lang];return;}
  `
      : ""
  }
  // Navigate to app with share data
  const url=APP_URL+"#share="+DATA;
  window.location.href=url;
});
</script>
</body>
</html>`;
  return html;
}

async function openShareModal(prof) {
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
  const appUrl = getAppUrl();
  const isLocked = ss.locked || false;

  const permRows = [
    { k: "add", label: t("permAdd") },
    { k: "del", label: t("permDelete") },
    { k: "edit", label: t("permEdit") },
    { k: "stats", label: t("permStats") },
    { k: "notes", label: t("permNotes") },
    { k: "budgets", label: t("permBudgets") },
    { k: "cats", label: t("permCats") },
    { k: "export", label: t("permExport") },
  ];
  const perms = ss.perms || { ...DEFAULT_PERMS };
  const viewOwnerPerm = perms.viewOwner || false;

  const html = `
    <!-- ПРОФИЛЬ -->
    <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--primary-pale);border-radius:14px;margin-bottom:16px;">
      <div style="width:48px;height:48px;border-radius:50%;background:${prof.color || "var(--primary)"};display:flex;align-items:center;justify-content:center;font-size:26px;">${prof.emoji || "👤"}</div>
      <div><div style="font-size:18px;font-weight:900;color:var(--text);">${esc(prof.name)}</div>
      <div style="font-size:13px;color:var(--text-muted);">${t("shareDesc")}</div></div>
    </div>

    <!-- ГЛАВНАЯ КНОПКА — ОТПРАВИТЬ ССЫЛКУ -->
    ${
      appUrl
        ? `
    <button class="btn-primary" id="sendLinkBtn" style="width:100%;font-size:18px;padding:20px;margin-bottom:12px;border-radius:18px;">
      🔗 ${t("shareCloudLink")}
    </button>
    <div id="cloudLinkResult" style="display:none;margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:var(--income-color);margin-bottom:8px;">${t("shareLinkReady")}</div>
      <div style="position:relative;background:var(--cream-dark);border-radius:12px;padding:12px 44px 12px 14px;">
        <a id="cloudLinkAnchor" href="#" target="_blank" style="font-size:14px;font-weight:700;color:#2563eb;word-break:break-all;text-decoration:underline;display:block;"></a>
        <button id="copyCloudLinkBtn" style="position:absolute;top:8px;right:8px;background:#2563eb;border:none;border-radius:8px;width:30px;height:30px;font-size:15px;cursor:pointer;color:white;">📋</button>
      </div>
    </div>`
        : `
    <div style="background:var(--gold-pale);border-radius:14px;padding:14px;margin-bottom:12px;border-left:3px solid var(--gold);">
      <div style="font-size:14px;font-weight:800;color:var(--gold);margin-bottom:8px;">⚡ ${t("shareNoHosting")}</div>
      <div style="font-size:12px;color:var(--text-soft);line-height:1.8;">
        1. <a href="https://app.netlify.com/drop" target="_blank" style="color:#2563eb;font-weight:800;">app.netlify.com/drop</a> — перетащите папку с приложением<br>
        2. Скопируйте URL → вставьте в поле ниже
      </div>
      <a href="https://app.netlify.com/drop" target="_blank" style="display:block;margin-top:10px;padding:10px;background:#2563eb;color:white;border-radius:10px;text-align:center;font-size:14px;font-weight:800;text-decoration:none;">🚀 Открыть Netlify Drop</a>
    </div>
    <input type="url" id="appUrlInput" class="modal-input" placeholder="https://your-app.netlify.app" style="margin-bottom:12px;">
    <button class="btn-primary" id="saveUrlBtn" style="width:100%;margin-bottom:12px;">💾 Сохранить URL и создать ссылку</button>`
    }

    <!-- Скачать файл-приглашение (альтернатива) -->
    <button class="btn-secondary" id="downloadInviteBtn" style="width:100%;margin-bottom:16px;">
      📄 ${t("shareInviteFile")}
    </button>

    <!-- БЛОКИРОВКА -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:${isLocked ? "var(--expense-pale)" : "var(--cream-dark)"};border-radius:14px;border:1.5px solid ${isLocked ? "var(--expense-color)" : "var(--cream-border)"};margin-bottom:16px;">
      <div>
        <div style="font-size:14px;font-weight:800;color:${isLocked ? "var(--expense-color)" : "var(--text)"};">${isLocked ? "🔒 " + t("shareLocked") : "🔓 " + t("shareProfileOpen")}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${t("shareLockDesc")}</div>
      </div>
      <label class="switch"><input type="checkbox" id="lockToggle" ${isLocked ? "checked" : ""}><span class="slider round"></span></label>
    </div>

    <!-- РАЗРЕШЕНИЯ (свёрнуто) -->
    <details style="margin-bottom:16px;">
      <summary style="font-size:14px;font-weight:800;color:var(--text-muted);cursor:pointer;padding:10px;background:var(--cream-dark);border-radius:10px;list-style:none;">
        ⚙️ ${t("sharePermissions")} ▾
      </summary>
      <div style="padding:12px;background:var(--cream-dark);border-radius:0 0 10px 10px;display:flex;flex-direction:column;gap:10px;margin-top:2px;">
        ${permRows
          .map(
            (r) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <span style="font-size:14px;font-weight:600;">${r.label}</span>
          <label class="switch" style="flex-shrink:0;"><input type="checkbox" class="perm-toggle" data-perm="${r.k}" ${perms[r.k] !== false ? "checked" : ""}><span class="slider round"></span></label>
        </div>`,
          )
          .join("")}
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-top:8px;border-top:1px solid var(--cream-border);">
          <div>
            <div style="font-size:14px;font-weight:800;">${t("permViewOwner")}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${t("permViewOwnerDesc")}</div>
          </div>
          <label class="switch" style="flex-shrink:0;"><input type="checkbox" id="viewOwnerToggle" ${viewOwnerPerm ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        <div style="margin-top:4px;">
          <label class="field-label">${ss.pwHash ? t("shareChangePassword") : t("sharePassword")}</label>
          <input type="password" id="sharePwdInput" class="modal-input" placeholder="${t("sharePasswordHint")}" autocomplete="new-password" style="margin-top:6px;">
          ${ss.pwHash ? `<button class="settings-btn danger" id="removePwdBtn" style="margin-top:6px;">${t("shareRemovePassword")}</button>` : ""}
        </div>
        <button class="btn-secondary" id="savePermsBtn" style="width:100%;">💾 ${t("save")}</button>
      </div>
    </details>

    <button class="btn-danger" id="revokeShareBtn" style="width:100%;">${t("shareRevoke")}</button>
  `;

  const modal = createModal(
    "shareModal",
    `${prof.emoji || "👤"} ${esc(prof.name)}`,
    html,
  );
  document.body.appendChild(modal);
  openModal("shareModal");

  // ---- Обработчики ----

  // Главная кнопка: создать и отправить ссылку через облако
  document
    .getElementById("sendLinkBtn")
    ?.addEventListener("click", async () => {
      const btn = document.getElementById("sendLinkBtn");
      // Проверяем URL поле (вдруг пользователь ввёл вручную)
      const urlInput = document.getElementById("appUrlInput");
      if (urlInput?.value.trim()) {
        localStorage.setItem("budgetpro_app_url", urlInput.value.trim());
      }
      const appUrl = getAppUrl();
      if (!appUrl) {
        showToast("⚠️ " + t("shareNoHosting"), "error");
        return;
      }

      btn.textContent = "⏳ " + t("shareLinkCreating");
      btn.disabled = true;

      // Строим пакет данных напрямую (без generateShareLink который возвращает сложный объект)
      const ss = prof.shareSettings;
      const viewOwner = ss.perms?.viewOwner === true;
      let ownerData = null;
      if (viewOwner) {
        const raw = JSON.parse(
          localStorage.getItem("budget_profile_" + prof.id) || "{}",
        );
        ownerData = { ...raw };
        if (ownerData.transactions?.length > 80)
          ownerData.transactions = ownerData.transactions.slice(-80);
      }
      const sharePkg = {
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
        ownerData: ownerData,
        viewOwner: viewOwner,
        ts: new Date().toISOString(),
      };

      // Загружаем в облако
      const blobId = await storeShareCloud(sharePkg);
      btn.textContent = "🔗 " + t("shareCloudLink");
      btn.disabled = false;

      if (!blobId) {
        showToast(t("shareLinkFail"), "error");
        return;
      }

      // Формируем готовую ссылку (#share= работает без внешних сервисов)
      const base = appUrl.replace(/\/$/, "").replace(/#.*$/, "");
      const finalLink =
        blobId && blobId.startsWith("inline_")
          ? `${base}#share=${blobId.slice(7)}`
          : `${base}#blob=${blobId}`;

      // Показываем результат
      const res = document.getElementById("cloudLinkResult");
      const anc = document.getElementById("cloudLinkAnchor");
      if (res) res.style.display = "block";
      if (anc) {
        anc.href = finalLink;
        anc.textContent = finalLink;
      }

      // Копируем в буфер
      try {
        await navigator.clipboard.writeText(finalLink);
        showToast(t("shareLinkCopied"));
      } catch (e) {}

      // Нативный шаринг (мобильные)
      if (navigator.share) {
        try {
          await navigator.share({
            title: `БюджетPRO — ${prof.name}`,
            text: t("shareWelcome") + " «" + prof.name + "»",
            url: finalLink,
          });
        } catch (e) {}
      }
    });

  // Сохранить URL
  document.getElementById("saveUrlBtn")?.addEventListener("click", async () => {
    const url = document.getElementById("appUrlInput")?.value.trim();
    if (!url) {
      showToast(t("enterAmount"), "error");
      return;
    }
    localStorage.setItem("budgetpro_app_url", url);
    showToast("✅ URL сохранён");
    closeModal("shareModal");
    setTimeout(() => openShareModal(prof), 300);
  });

  // Копировать ссылку
  document
    .getElementById("copyCloudLinkBtn")
    ?.addEventListener("click", async () => {
      const anc = document.getElementById("cloudLinkAnchor");
      if (!anc?.href) return;
      try {
        await navigator.clipboard.writeText(anc.href);
        showToast(t("shareLinkCopied"));
      } catch (e) {}
    });

  // Скачать HTML-файл
  document
    .getElementById("downloadInviteBtn")
    ?.addEventListener("click", async () => {
      const btn = document.getElementById("downloadInviteBtn");
      btn.textContent = "⏳ " + t("loading");
      const html = await generateInviteHtmlFile(prof);
      btn.textContent = "📄 " + t("shareInviteFile");
      if (!html) {
        showToast(t("error"), "error");
        return;
      }
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `invite_${(prof.name || "profile").replace(/\s/g, "_")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (navigator.share) {
        try {
          const f = new File([html], `invite_${prof.name}.html`, {
            type: "text/html",
          });
          if (navigator.canShare?.({ files: [f] }))
            await navigator.share({
              files: [f],
              title: `БюджетPRO — ${prof.name}`,
            });
        } catch (e) {}
      }
      showToast("📄 " + t("shareInviteFile"));
    });

  // Блокировка
  document.getElementById("lockToggle")?.addEventListener("change", (e) => {
    ss.locked = e.target.checked;
    saveGlobal();
    showToast(ss.locked ? "🔒 " + t("shareLocked") : "🔓 " + t("shareUnlock"));
  });

  // Убрать пароль
  document.getElementById("removePwdBtn")?.addEventListener("click", () => {
    ss.pwHash = null;
    saveGlobal();
    showToast(t("saved"));
    closeModal("shareModal");
    setTimeout(() => openShareModal(prof), 300);
  });

  // Сохранить разрешения и пароль
  document
    .getElementById("savePermsBtn")
    ?.addEventListener("click", async () => {
      const newPerms = {};
      document.querySelectorAll("#shareModal .perm-toggle").forEach((cb) => {
        newPerms[cb.dataset.perm] = cb.checked;
      });
      newPerms.viewOwner =
        document.getElementById("viewOwnerToggle")?.checked || false;
      ss.perms = newPerms;
      const pwd = document.getElementById("sharePwdInput")?.value.trim();
      if (pwd) ss.pwHash = await hashSharePwd(pwd);
      saveGlobal();
      showToast(t("saved"));
      closeModal("shareModal");
      setTimeout(() => openShareModal(prof), 300);
    });

  // Отозвать доступ
  document.getElementById("revokeShareBtn")?.addEventListener("click", () => {
    askConfirm(
      t("shareRevoke"),
      () => {
        ss.shareId = null;
        ss.pwHash = null;
        ss.perms = { ...DEFAULT_PERMS };
        ss.locked = false;
        saveGlobal();
        closeModal("shareModal");
        renderSettings();
        showToast(t("deleted"));
      },
      { icon: "🔗" },
    );
  });
}

// ============================================================
// SHARE LINK DETECTION & WELCOME SCREEN
// ============================================================
function checkShareLink() {
  const hash = window.location.hash;
  if (hash.startsWith("#share=")) {
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
      console.warn("Bad share link", e);
      return false;
    }
  }
  if (hash.startsWith("#blob=")) {
    const blobId = hash.slice(6);
    if (!blobId) return false;
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    const loading = document.createElement("div");
    loading.id = "shareLoadingScreen";
    loading.style.cssText =
      "position:fixed;inset:0;background:var(--cream);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;";
    loading.innerHTML = `<div style="font-size:48px;">⏳</div>
      <div style="font-size:18px;font-weight:800;color:var(--text);">Загрузка профиля...</div>
      <div style="font-size:14px;color:var(--text-muted);">Loading / ჩატვირთვა...</div>`;
    document.body.appendChild(loading);
    fetchShareCloud(blobId)
      .then((pkg) => {
        loading.remove();
        if (!pkg || pkg.type !== "share_link" || !pkg.shareId) {
          showToast("❌ Ссылка недействительна", "error");
          init();
          return;
        }
        showShareWelcomeScreen(pkg);
      })
      .catch(() => {
        loading.remove();
        init();
      });
    return true;
  }
  return false;
}

function buildWelcomeHTML(pkg) {
  const permsHTML = Object.entries(pkg.perms || {})
    .filter(([k]) => k !== "viewOwner" && k !== "pwHash")
    .map(
      ([k, v]) => `
    <span style="font-size:12px;padding:5px 12px;border-radius:99px;background:${v ? "var(--income-pale)" : "var(--expense-pale)"};color:${v ? "var(--income-color)" : "var(--expense-color)"};">
      ${v ? "✅" : "❌"} ${tObj("permLabels")[k] || k}
    </span>`,
    )
    .join("");
  return `
    <div style="position:absolute;top:16px;right:16px;display:flex;gap:6px;" id="welcomeLangBar">
      ${["ru", "en", "ka"].map((l) => `<button onclick="setWelcomeLang('${l}')" style="padding:5px 10px;border-radius:99px;border:1.5px solid var(--cream-border);background:${currentLang === l ? "var(--primary)" : "var(--cream-dark)"};color:${currentLang === l ? "white" : "var(--text-muted)"};font-size:12px;font-weight:700;cursor:pointer;">${{ ru: "🇷🇺 RU", en: "🇬🇧 EN", ka: "🇬🇪 KA" }[l]}</button>`).join("")}
    </div>
    <div style="width:80px;height:80px;border-radius:50%;background:${pkg.pcolor || "#2d6a4f"};display:flex;align-items:center;justify-content:center;font-size:42px;flex-shrink:0;box-shadow:0 8px 32px ${pkg.pcolor || "#2d6a4f"}50;">${pkg.pemoji || "👤"}</div>
    <div style="font-size:13px;font-weight:700;color:var(--text-muted);letter-spacing:.5px;text-transform:uppercase;">${t("guestMode")}</div>
    <div style="font-size:26px;font-weight:900;color:var(--text);text-align:center;line-height:1.2;">${t("shareWelcome")}</div>
    <div style="font-size:20px;font-weight:800;color:${pkg.pcolor || "var(--primary)"};text-align:center;">«${esc(pkg.pname || "")}»</div>
    ${
      pkg.hasPwd
        ? `
    <div style="max-width:340px;width:100%;">
      <div style="font-size:14px;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-align:center;">🔒 ${t("shareWelcomePwd")}</div>
      <input type="password" id="shareLinkPwd" class="modal-input" placeholder="••••••••" style="text-align:center;font-size:22px;letter-spacing:6px;">
      <div id="sharePwdErr" style="color:var(--expense-color);font-size:13px;text-align:center;margin-top:8px;min-height:18px;"></div>
    </div>`
        : ""
    }
    <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;width:100%;">
      <button id="joinShareBtn" style="padding:18px 24px;border-radius:99px;background:${pkg.pcolor || "#2d6a4f"};color:white;border:none;font-size:18px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 6px 24px ${pkg.pcolor || "#2d6a4f"}50;">
        ${t("shareWelcomeJoin")} →
      </button>
      <button id="skipShareBtn" style="padding:14px;border-radius:99px;background:var(--cream-dark);color:var(--text-muted);border:1.5px solid var(--cream-border);font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;">
        ${t("cancel")}
      </button>
    </div>
    ${permsHTML ? `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:380px;">${permsHTML}</div>` : ""}`;
}

function buildLockedHTML(pkg) {
  return `
    <div style="position:absolute;top:16px;right:16px;display:flex;gap:6px;">
      ${["ru", "en", "ka"].map((l) => `<button onclick="setWelcomeLang('${l}')" style="padding:5px 10px;border-radius:99px;border:1.5px solid var(--cream-border);background:${currentLang === l ? "var(--primary)" : "var(--cream-dark)"};color:${currentLang === l ? "white" : "var(--text-muted)"};font-size:12px;font-weight:700;cursor:pointer;">${{ ru: "🇷🇺 RU", en: "🇬🇧 EN", ka: "🇬🇪 KA" }[l]}</button>`).join("")}
    </div>
    <div style="font-size:64px;">🔒</div>
    <div style="font-size:22px;font-weight:900;color:var(--text);text-align:center;">${t("shareLocked")}</div>
    <div style="font-size:16px;color:var(--text-muted);text-align:center;max-width:280px;">${t("shareWelcomeLocked")}</div>
    <div style="max-width:320px;width:100%;padding:20px;background:var(--card-bg);border-radius:24px;box-shadow:var(--shadow-lg);text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">${pkg.pemoji || "👤"}</div>
      <div style="font-size:18px;font-weight:800;color:var(--text);">«${esc(pkg.pname || "")}»</div>
      <div style="font-size:14px;color:var(--text-muted);margin-top:8px;">${t("noAccessDesc")}</div>
    </div>`;
}

window.setWelcomeLang = function (lang) {
  setLanguage(lang);
  const ov = document.getElementById("shareWelcomeScreen");
  const _pkg = ov?._pkg;
  if (!ov || !_pkg) return;
  ov.innerHTML = _pkg.locked ? buildLockedHTML(_pkg) : buildWelcomeHTML(_pkg);
  attachWelcomeHandlers(ov, _pkg);
};

async function showShareWelcomeScreen(pkg) {
  const ov = document.createElement("div");
  ov.id = "shareWelcomeScreen";
  ov._pkg = pkg;
  ov.style.cssText =
    "position:fixed;inset:0;background:var(--cream);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px 24px;overflow-y:auto;";
  ov.innerHTML = pkg.locked ? buildLockedHTML(pkg) : buildWelcomeHTML(pkg);
  document.body.appendChild(ov);
  attachWelcomeHandlers(ov, pkg);
}

function attachWelcomeHandlers(ov, pkg) {
  document.getElementById("skipShareBtn")?.addEventListener("click", () => {
    ov.remove();
    init();
  });
  document
    .getElementById("joinShareBtn")
    ?.addEventListener("click", async () => {
      if (pkg.hasPwd && pkg.pwHash) {
        const entered = document.getElementById("shareLinkPwd")?.value || "";
        if (!entered) {
          document.getElementById("sharePwdErr").textContent = t("enterAmount");
          return;
        }
        const enteredHash = await hashSharePwd(entered);
        if (enteredHash !== pkg.pwHash) {
          document.getElementById("sharePwdErr").textContent = t("pinWrong");
          return;
        }
      }
      const newId = "shared_" + pkg.shareId;
      if (!profiles.find((p) => p.id === newId)) {
        profiles.push({
          id: newId,
          name: pkg.pname || "Shared",
          emoji: pkg.pemoji || "👤",
          color: pkg.pcolor || "#2563eb",
          isShared: true,
          shareCode: pkg.shareId,
          sharePerms: pkg.perms || { ...DEFAULT_PERMS },
        });
      }
      const emptyProfile = {
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
      localStorage.setItem(
        "budget_profile_" + newId,
        JSON.stringify(emptyProfile),
      );
      if (pkg.viewOwner && pkg.ownerData) {
        const ownerProfileId = "shared_owner_" + pkg.shareId;
        localStorage.setItem(
          "budget_profile_" + ownerProfileId,
          JSON.stringify(pkg.ownerData),
        );
        if (!profiles.find((p) => p.id === ownerProfileId)) {
          profiles.push({
            id: ownerProfileId,
            name: "👑 " + pkg.pname,
            emoji: pkg.pemoji || "👤",
            color: pkg.pcolor || "#2d6a4f",
            isShared: true,
            isOwnerView: true,
            shareCode: pkg.shareId,
            sharePerms: {
              add: false,
              del: false,
              edit: false,
              stats: true,
              notes: false,
              budgets: true,
              cats: false,
              export: false,
              viewOwner: false,
            },
          });
        }
      }
      sharedAccessProfile = {
        profileId: newId,
        perms: pkg.perms || { ...DEFAULT_PERMS },
      };
      activeProfileId = newId;
      saveGlobal();
      loadProfileData(newId);
      syncStartBalanceTransaction();
      ov.remove();
      init();
      applyPermRestrictions();
      showToast("✅ " + t("guestMode") + ": " + pkg.pname);
    });
}

// ============================================================
// INIT
// ============================================================
function init() {
  console.log(
    "БюджетPRO v2.3 loaded, lang:",
    currentLang,
    "shareTitle:",
    t("shareTitle"),
  );
  applyTranslations();
  updateTopBlocks();
  updateHeader();
  addHeaderButtons();
  document.documentElement.lang = currentLang;
  const savedTheme =
    colorTheme || localStorage.getItem("colorTheme") || "default";
  applyColorTheme(savedTheme);
  const thBtn = document.getElementById("themeToggle");
  if (thBtn) {
    const isDark = () => document.body.classList.contains("dark");
    thBtn.textContent = isDark() ? "☀️" : "🌙";
    thBtn.addEventListener("click", () => {
      if (isDark()) {
        applyColorTheme("default");
        thBtn.textContent = "🌙";
      } else {
        applyColorTheme("navy");
        thBtn.textContent = "☀️";
      }
      showToast("🎨 " + t("themeChanged"));
    });
  }
  document.querySelectorAll(".summary-card").forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;
      if (type === "salary") {
        openSalaryModal();
        return;
      }
      if (type === "income" || type === "expense") {
        currentFilter = type;
        const doScroll = () => {
          const el = document.getElementById("opsList");
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 180);
          }
          setTimeout(
            () =>
              showToast(
                type === "income"
                  ? t("toastIncomeFilter")
                  : t("toastExpenseFilter"),
              ),
            300,
          );
        };
        if (currentTab !== "home") {
          setTab("home");
          setTimeout(doScroll, 450);
        } else {
          renderBalanceSummary();
          renderOpsList();
          doScroll();
        }
      } else {
        if (currentFilter !== null) {
          currentFilter = null;
          if (currentTab === "home") renderOpsList();
        } else if (currentTab !== "home") setTab("home");
      }
    });
  });
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => setTab(btn.dataset.tab)),
    );
  document.getElementById("fabBtn")?.addEventListener("click", openAddModal);
  setTab("home");
  loadReminderSettings();
  applyPermRestrictions();
  setTimeout(() => {
    if (!localStorage.getItem("guideShown") && transactions.length === 0)
      startGuide();
  }, 1000);
}

// ============================================================
// GUIDE & REMINDERS
// ============================================================
let guideStepIndex = 0;

function startGuide() {
  // Simple onboarding guide - show first tip toast
  localStorage.setItem("guideShown", "1");
  setTimeout(() => {
    showToast("👆 " + t("editSalaryHint"));
  }, 500);
}

function loadReminderSettings() {
  remindersEnabled = localStorage.getItem("remindersEnabled") === "true";
  const si = localStorage.getItem("remindersInterval");
  if (si && ["daily", "every3", "weekly"].includes(si)) remindersInterval = si;
  if (remindersEnabled) scheduleReminder();
}

function scheduleReminder() {
  if (reminderTimer) clearInterval(reminderTimer);
  if (!remindersEnabled) return;
  const ms =
    { daily: 86400000, every3: 259200000, weekly: 604800000 }[
      remindersInterval
    ] || 86400000;
  reminderTimer = setInterval(() => {
    if (Notification?.permission === "granted") {
      new Notification("🌿 БюджетPRO", {
        body: t("noOperations").split("\n")[0],
      });
    }
  }, ms);
}

// ============================================================
// STARTUP — load data from localStorage
// ============================================================
loadAll();

// ============================================================
// ENTRY POINT
// ============================================================

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
    version: "2.2",
    exportDate: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `budget_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("✅ JSON экспортирован");
}
function importFromJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const d = JSON.parse(e.target.result);
      if (!d.transactions) {
        showToast("❌ Неверный формат", "error");
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
          syncStartBalanceTransaction();
          saveAll();
          updateTopBlocks();
          setTab("home");
          showToast("✅ Импортировано");
        },
        { icon: "📥", title: "Импорт", yesText: "Заменить" },
      );
    } catch (e) {
      showToast("❌ Ошибка", "error");
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
  showToast(t("exportSuccess"));
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
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("pdfTitle")}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1c1c1c;}h1{color:#2d6a4f;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#2d6a4f;color:white;padding:10px;}td{padding:8px;border-bottom:1px solid #eee;}tr:nth-child(even){background:#f9f9f9;}.cards{display:flex;gap:16px;margin:20px 0;}.card{flex:1;padding:16px;border-radius:12px;text-align:center;}.card.inc{background:#e8f5ed;}.card.exp{background:#fceae5;}.card.bal{background:#e8f0fe;}.card h2{margin:0;font-size:28px;}.card p{color:#666;}</style></head>
  <body><h1>${t("pdfTitle")} — ${monthName} ${now.getFullYear()}</h1>
  <div class="cards"><div class="card inc"><p>Доходы</p><h2>+${fmt(inc)}</h2></div><div class="card exp"><p>Расходы</p><h2>-${fmt(exp)}</h2></div><div class="card bal"><p>Баланс</p><h2>${fmt(inc - exp)}</h2></div></div>
  <h2>Операции</h2><table><tr><th>Дата</th><th>Категория</th><th>Тип</th><th>Сумма</th><th>Заметка</th></tr>
  ${ptx
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map(
      (tx) =>
        `<tr><td>${fmtDate(tx.date)}</td><td>${esc(tx.category)}</td><td>${tx.type === "income" ? "📈" : "📉"}</td><td style="color:${tx.type === "income" ? "#1a7340" : "#c13515"};font-weight:700;">${tx.type === "income" ? "+" : "-"}${fmt(tx.amountRub)}</td><td>${esc(tx.note || "")}</td></tr>`,
    )
    .join("")}
  </table><h2>Топ расходов</h2><table><tr><th>Категория</th><th>Сумма</th></tr>${topList.map(([c, a]) => `<tr><td>${esc(c)}</td><td>${fmt(a)}</td></tr>`).join("")}</table>
  <p style="color:#888;font-size:12px;margin-top:24px;">Сгенерировано: ${new Date().toLocaleString(currentLang)}</p></body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `budget_report_${now.toISOString().slice(0, 7)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("✅ Отчёт сохранён (откройте и напечатайте)");
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
    userTemplates,
    frequentStats,
    categoryCustomizations,
    categoryBudgets,
    recurringOps,
    version: "2.2",
    exportDate: new Date().toISOString(),
  });
  const encoded = btoa(unescape(encodeURIComponent(data)));
  const blob = new Blob([encoded], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "budget_cloud.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  try {
    await navigator.clipboard.writeText(encoded);
    showToast(t("cloudCopied"));
  } catch (e) {
    showToast("✅ Файл сохранён");
  }
}
function cloudLoad() {
  const html = `<div class="field-group"><label>${t("cloudLoadHint")}</label><textarea id="cloudInput" class="modal-textarea" rows="5" placeholder="Вставьте текст backup..."></textarea></div><div class="modal-actions"><button class="btn-secondary" id="clCancel">${t("cancel")}</button><button class="btn-primary" id="clLoad">${t("cloudLoad")}</button></div>`;
  const modal = createModal("cloudLoadModal", t("cloudBackup"), html);
  document.body.appendChild(modal);
  openModal("cloudLoadModal");
  document
    .getElementById("clCancel")
    .addEventListener("click", () => closeModal("cloudLoadModal"));
  document.getElementById("clLoad").addEventListener("click", () => {
    const txt = document.getElementById("cloudInput").value.trim();
    try {
      const json = decodeURIComponent(escape(atob(txt)));
      const d = JSON.parse(json);
      if (!d.transactions) {
        showToast("❌ Неверный формат", "error");
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
      showToast("✅ Данные восстановлены");
    } catch (e) {
      showToast("❌ Ошибка загрузки", "error");
    }
  });
}

// ============================================================
// НАПОМИНАНИЯ
// ============================================================
function sendReminderNotification() {
  if (!remindersEnabled || Notification.permission !== "granted") return;
  const now = new Date(),
    last = localStorage.getItem("lastReminderDate");
  let should = false;
  if (remindersInterval === "daily")
    should = !last || new Date(last).toDateString() !== now.toDateString();
  else if (remindersInterval === "every3days")
    should = !last || Math.floor((now - new Date(last)) / 86400000) >= 3;
  else if (remindersInterval === "weekly")
    should = !last || Math.floor((now - new Date(last)) / (86400000 * 7)) >= 1;
  if (should) {
    new Notification(t("appName"), {
      body: t("remindersDesc"),
      tag: "budget-reminder",
    });
    localStorage.setItem("lastReminderDate", now.toISOString());
  }
}
function startReminderTimer() {
  if (reminderTimer) clearInterval(reminderTimer);
  if (!remindersEnabled) return;
  reminderTimer = setInterval(sendReminderNotification, 6 * 60 * 60 * 1000);
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

// ============================================================
// СПРАВКА / ГАЙД
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
let guideSteps = [],
  curGuideStep = 0;
function showGuideStep(i) {
  if (i >= guideSteps.length) {
    finishGuide();
    return;
  }
  const s = guideSteps[i],
    tgt = document.querySelector(s.element);
  if (!tgt) {
    showGuideStep(i + 1);
    return;
  }
  document
    .querySelectorAll(".guide-overlay,.guide-highlight,.guide-tooltip")
    .forEach((e) => e.remove());
  const ov = document.createElement("div");
  ov.className = "guide-overlay";
  document.body.appendChild(ov);
  const r = tgt.getBoundingClientRect();
  const hi = document.createElement("div");
  hi.className = "guide-highlight";
  hi.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;`;
  document.body.appendChild(hi);
  const tip = document.createElement("div");
  tip.className = "guide-tooltip";
  tip.innerHTML = `<div class="guide-tooltip-title">${esc(s.title)}</div><div class="guide-tooltip-desc">${esc(s.desc)}</div><div class="guide-tooltip-actions"><button class="guide-btn-skip">${t("guideSkip")}</button><button class="guide-btn-next">${i === guideSteps.length - 1 ? t("guideFinish") : t("guideNext")}</button></div>`;
  document.body.appendChild(tip);
  const tr = tip.getBoundingClientRect();
  let left = Math.max(
      10,
      Math.min(
        r.left + r.width / 2 - tr.width / 2,
        window.innerWidth - tr.width - 10,
      ),
    ),
    top = r.bottom + 10;
  if (top + tr.height > window.innerHeight) top = r.top - tr.height - 10;
  tip.style.cssText += `left:${left}px;top:${top}px;`;
  const cl = () => {
    ov.remove();
    hi.remove();
    tip.remove();
  };
  tip.querySelector(".guide-btn-next").addEventListener("click", () => {
    cl();
    showGuideStep(i + 1);
  });
  tip.querySelector(".guide-btn-skip").addEventListener("click", () => {
    cl();
    finishGuide();
  });
}
function finishGuide() {
  localStorage.setItem("guideShown", "true");
  document
    .querySelectorAll(".guide-overlay,.guide-highlight,.guide-tooltip")
    .forEach((e) => e.remove());
}

// ============================================================
// ПИН — УСТАНОВКА
// ============================================================
function openPinSetModal(isChange = false) {
  const html = `<div style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:16px;">${t("pinSet4")}</div>
    <div id="pinSetDots" style="display:flex;gap:14px;justify-content:center;margin-bottom:12px;">${[0, 1, 2, 3].map(() => `<div style="width:18px;height:18px;border-radius:50%;border:2px solid var(--primary);background:transparent;transition:.2s;"></div>`).join("")}</div>
    <div id="pinSetError" style="color:var(--expense-color);text-align:center;font-size:13px;font-weight:700;min-height:18px;"></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px;">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => `<button class="pin-key" data-key="${k}" style="height:56px;border-radius:14px;border:1.5px solid var(--cream-border);background:var(--card-bg);font-size:20px;font-weight:700;cursor:pointer;font-family:inherit;color:var(--text);">${k}</button>`).join("")}</div>
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
    if (!pinEnabled && document.getElementById("pinToggle"))
      document.getElementById("pinToggle").checked = false;
  });
}

// ============================================================
// БЮДЖЕТЫ — ДОБАВЛЕНИЕ
// ============================================================
function openAddBudgetModal() {
  const cats = Object.keys(categories).filter((c) => !categoryBudgets[c]);
  if (!cats.length) {
    showToast("Все категории уже имеют бюджет");
    return;
  }
  const html = `<div class="field-group"><label class="field-label">${t("budgets")}</label><select id="budgetCatSel" class="modal-select"><option value="">${t("selectCategory")}</option>${cats.map((c) => `<option value="${c}">${getCategoryStyle(c, "expense").icon} ${esc(c)}</option>`).join("")}</select></div><div class="field-group"><label class="field-label">${t("budgetLimit")} (${sym()})</label><input type="number" id="budgetLimitInput" class="modal-input" min="1" step="any" placeholder="5000" inputmode="decimal"></div><div class="modal-actions"><button class="btn-secondary" id="cancelBudget">${t("cancel")}</button><button class="btn-primary" id="saveBudget">${t("save")}</button></div>`;
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

// ============================================================
// ПОВТОРЯЮЩИЕСЯ — ДОБАВЛЕНИЕ
// ============================================================
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
  const html = `<div class="field-group"><label>${t("type")}</label><div class="type-toggle"><button class="type-btn expense active" data-type="expense">${t("expenseType")}</button><button class="type-btn income" data-type="income">${t("incomeType")}</button></div></div><div class="field-group"><label id="rCatLabel">${t("expCategory")}</label><select id="rCatSel" class="modal-select">${eo}</select></div><div class="field-group"><label>${t("amount")} (${sym()})</label><input type="number" id="rAmount" class="modal-input" min="0.01" step="any" inputmode="decimal"></div><div class="field-group"><label>${t("recurringFreqLabel")}</label><select id="rFreq" class="modal-select"><option value="monthly">${t("recurringMonthly")}</option><option value="weekly">${t("recurringWeekly")}</option><option value="daily">${t("recurringDaily")}</option></select></div><div class="field-group" id="rDayDiv"><label>${t("recurringDayLabel")}</label><input type="number" id="rDay" class="modal-input" min="1" max="28" value="1"></div><div class="field-group"><label>${t("note")}</label><input type="text" id="rNote" class="modal-input" placeholder="${t("noteHint")}"></div><div class="modal-actions"><button class="btn-secondary" id="cancelRec">${t("cancel")}</button><button class="btn-primary" id="saveRec">${t("save")}</button></div>`;
  const modal = createModal("addRecModal", t("addRecurring"), html);
  document.body.appendChild(modal);
  openModal("addRecModal");
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
    .getElementById("cancelRec")
    .addEventListener("click", () => closeModal("addRecModal"));
  document.getElementById("saveRec").addEventListener("click", () => {
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
    closeModal("addRecModal");
    renderSettings();
    showToast(t("saved"));
  });
}

// ============================================================
// РЕДАКТИРОВАНИЕ / СОЗДАНИЕ ПРОФИЛЯ
// ============================================================
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
    "🧑‍🍳",
    "🧑‍🎨",
    "🧑‍⚕️",
    "🧑‍🏫",
  ];
  const curColor =
    prof?.color || profileColors[profiles.length % profileColors.length];
  const curEmoji = prof?.emoji || "👤";
  const html = `
    <div class="field-group">
      <label class="field-label">${t("profileEmojiLabel")}</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;" id="emojiPicker">
        ${profileEmojis.map((e) => `<button class="emoji-pick-btn" data-emoji="${e}" style="width:44px;height:44px;border-radius:12px;border:2px solid ${e === curEmoji ? "var(--primary)" : "var(--cream-border)"};background:${e === curEmoji ? "var(--primary-pale)" : "var(--cream-dark)"};font-size:22px;cursor:pointer;transition:.15s;">${e}</button>`).join("")}
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">Цвет</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;" id="colorPicker">
        ${profileColors.map((c) => `<button class="color-pick-btn" data-color="${c}" style="width:36px;height:36px;border-radius:50%;border:3px solid ${c === curColor ? "var(--text)" : "transparent"};background:${c};cursor:pointer;transition:.15s;"></button>`).join("")}
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t("profileNameLabel")}</label>
      <input type="text" id="profileNameInput" class="modal-input" value="${esc(prof?.name || "")}" placeholder="${t("profileNamePlaceholder")}" maxlength="20" autofocus>
    </div>
    <div id="profilePreview" style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--cream-dark);border-radius:16px;margin-bottom:16px;">
      <div id="previewAvatar" style="width:48px;height:48px;border-radius:50%;background:${curColor};display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 3px 12px ${curColor}50;">${curEmoji}</div>
      <div id="previewName" style="font-size:18px;font-weight:800;color:var(--text);">${esc(prof?.name || t("profileNew"))}</div>
    </div>
    <div class="modal-actions">
      <button class="btn-secondary" id="cancelProfileEdit">${t("cancel")}</button>
      <button class="btn-primary" id="saveProfileEdit">💾 ${t("save")}</button>
    </div>`;
  const modal = createModal(
    "profileEditModal",
    isNew ? t("addProfile") : t("profileRename"),
    html,
  );
  document.body.appendChild(modal);
  openModal("profileEditModal");
  let selectedEmoji = curEmoji,
    selectedColor = curColor;
  const updatePreview = () => {
    const name =
      document.getElementById("profileNameInput")?.value || t("profileNew");
    const av = document.getElementById("previewAvatar"),
      pn = document.getElementById("previewName");
    if (av) {
      av.textContent = selectedEmoji;
      av.style.background = selectedColor;
      av.style.boxShadow = `0 3px 12px ${selectedColor}50`;
    }
    if (pn) pn.textContent = name;
  };
  document
    .getElementById("profileNameInput")
    ?.addEventListener("input", updatePreview);
  modal.querySelectorAll(".emoji-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedEmoji = btn.dataset.emoji;
      modal.querySelectorAll(".emoji-pick-btn").forEach((b) => {
        b.style.borderColor = "var(--cream-border)";
        b.style.background = "var(--cream-dark)";
      });
      btn.style.borderColor = "var(--primary)";
      btn.style.background = "var(--primary-pale)";
      updatePreview();
    });
  });
  modal.querySelectorAll(".color-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedColor = btn.dataset.color;
      modal
        .querySelectorAll(".color-pick-btn")
        .forEach((b) => (b.style.borderColor = "transparent"));
      btn.style.borderColor = "var(--text)";
      updatePreview();
    });
  });
  document
    .getElementById("cancelProfileEdit")
    .addEventListener("click", () => closeModal("profileEditModal"));
  document.getElementById("saveProfileEdit").addEventListener("click", () => {
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
        emoji: selectedEmoji,
        color: selectedColor,
      });
      saveGlobal();
      closeModal("profileEditModal");
      renderSettings();
      showToast("✅ " + name + " " + t("saved"));
    } else {
      prof.name = name;
      prof.emoji = selectedEmoji;
      prof.color = selectedColor;
      saveGlobal();
      closeModal("profileEditModal");
      renderSettings();
      showToast(t("saved"));
    }
  });
}

if (!checkShareLink()) {
  if ((pinEnabled && pinHash) || biometryEnabled) {
    showPinScreen(init);
  } else {
    init();
  }
}
