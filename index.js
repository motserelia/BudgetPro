const CREATOR_SECRET = "budgetpro_creator_irakli_2024";
let isCreatorMode = false;
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
    themeChanged: "Тема изменена",
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
<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:var(--primary);">🌿 БюджетPRO — Полная инструкция</h2>
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
    supportTitle: "💬 Поддержка",
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
    themeChanged: "Theme changed",
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
    themeLabels: {
      white: "⬜ Pure white",
      default: "🌿 Forest green",
      sunset: "🌅 Warm sunset",
      dark: "🌿 Green night",
      navy: "🌌 Midnight blue",
      gold: "✨ Gold accent",
    },
    themeDescs: {
      white: "Clean, minimalist",
      default: "Warm, natural",
      sunset: "Warm sunset",
      dark: "Dark green",
      navy: "Starry sky",
      gold: "Dark with gold accents",
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
    themeChanged: "თემა შეიცვალა",
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
      gold: "მუქი ოქროს აქცენტებით",
    },
  },
};

// ============================================================
// ТЕКУЩИЙ ЯЗЫК И ФУНКЦИИ ПЕРЕВОДА
// ============================================================
let currentLang = localStorage.getItem("lang") || "ru";

function t(k) {
  const v = translations[currentLang]?.[k];
  return v !== undefined ? v : k;
}
function tObj(k) {
  const v = translations[currentLang]?.[k];
  return v && typeof v === "object" ? v : {};
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
  updateHeader();
  updateTopBlocks();
  const lse = document.getElementById("langSelect");
  if (lse) lse.value = currentLang;
  setTab(currentTab);
  updateHeaderButtons();
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
      "--shadow-sm": "0 1px 8px rgba(15,23,42,0.08)",
      "--shadow-md": "0 4px 24px rgba(15,23,42,0.12)",
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
      "--cream": "#1c1c22",
      "--cream-dark": "#252530",
      "--cream-border": "#36364a",
      "--primary": "#c8952a",
      "--primary-med": "#d9a53c",
      "--primary-light": "#e8b84e",
      "--primary-pale": "#2a2418",
      "--gold": "#c8952a",
      "--gold-pale": "#221e14",
      "--gold-border": "#44381c",
      "--income-color": "#4ade80",
      "--income-pale": "#0f1e12",
      "--expense-color": "#f87171",
      "--expense-pale": "#1e0f0f",
      "--balance-pale": "#16162a",
      "--text": "#f0ece4",
      "--text-soft": "#c8c4b8",
      "--text-muted": "#888880",
      "--card-bg": "rgba(30,30,38,0.98)",
      "--shadow-sm": "0 2px 16px rgba(0,0,0,0.50)",
      "--shadow-md": "0 6px 32px rgba(0,0,0,0.62)",
      "--shadow-lg": "0 14px 56px rgba(0,0,0,0.72)",
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
  [
    "theme-white",
    "theme-default",
    "theme-sunset",
    "theme-dark",
    "theme-navy",
    "theme-gold",
    "dark",
  ].forEach((cls) => document.body.classList.remove(cls));
  if (theme.dark) document.body.classList.add("dark");
  document.body.classList.add("theme-" + colorTheme);
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
    inj("sunsetKf", "@keyframes sunsetGlow{0%,100%{opacity:.6}50%{opacity:1}}");
    const el = document.createElement("div");
    el.id = "themeAurora";
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(251,146,60,.08) 0%,transparent 70%);animation:sunsetGlow 5s ease-in-out infinite;";
    document.body.insertBefore(el, document.body.firstChild);
  }
  requestAnimationFrame(() => {
    const tc = document.querySelector(".top-cards");
    if (tc) {
      tc.style.display = "none";
      void tc.offsetHeight;
      tc.style.display = "";
    }
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
async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + "budget_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
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
      showToast("📬 У вас новые сообщения от пользователей", "success", 3000);
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
      showToast("📬 У вас новые сообщения от пользователей", "success");
      localStorage.removeItem("has_new_support_messages");
    }
  }, 100); // небольшая задержка, чтобы тост профиля не перебивал
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

  syncStartBalanceTransaction();
  applyRecurringOps();
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
    transactions[idx].note = t("initialCapital");
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
    if (!op.lastApplied) op.lastApplied = null;
    let shouldApply = false;
    if (op.freq === "monthly") {
      // Проверяем, нужно ли применить в этом месяце
      const targetDay = op.day || 1;
      const targetDate = new Date(now.getFullYear(), now.getMonth(), targetDay);
      const targetStr = targetDate.toISOString().slice(0, 10);
      if (
        now.getDate() >= targetDay &&
        op.lastApplied !== targetStr.slice(0, 7)
      ) {
        op.lastApplied = targetStr.slice(0, 7);
        shouldApply = true;
        // Добавляем операцию с датой targetStr
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
        shouldApply = true;
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
    const prof = profiles.find(p => p.id === activeProfileId);
    const userName = prof?.name || "";
    const hour = new Date().getHours();
    let greetEmoji = "🌿";
    let greetWord = "";
    if (currentLang === "ru") {
      if (hour >= 5 && hour < 12)  { greetWord = "Доброе утро"; greetEmoji = "🌅"; }
      else if (hour < 18)           { greetWord = "Добрый день"; greetEmoji = "☀️"; }
      else if (hour < 22)           { greetWord = "Добрый вечер"; greetEmoji = "🌆"; }
      else                          { greetWord = "Доброй ночи"; greetEmoji = "🌙"; }
    } else if (currentLang === "en") {
      if (hour >= 5 && hour < 12)  { greetWord = "Good morning"; greetEmoji = "🌅"; }
      else if (hour < 18)           { greetWord = "Good afternoon"; greetEmoji = "☀️"; }
      else if (hour < 22)           { greetWord = "Good evening"; greetEmoji = "🌆"; }
      else                          { greetWord = "Good night"; greetEmoji = "🌙"; }
    } else {
      if (hour >= 5 && hour < 12)  { greetWord = "დილა მშვიდობისა"; greetEmoji = "🌅"; }
      else if (hour < 18)           { greetWord = "მშვიდობისა"; greetEmoji = "☀️"; }
      else if (hour < 22)           { greetWord = "საღამო მშვიდობისა"; greetEmoji = "🌆"; }
      else                          { greetWord = "ღამე მშვიდობისა"; greetEmoji = "🌙"; }
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
          if (b) b.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
          showToast("🎨 " + t("themeChanged"));
          haptic("light");
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

// ============================================================
// ВКЛАДКИ
// ============================================================
function setTab(tab) {
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
  }, 160);
}

// ============================================================
// ГЛАВНАЯ
// ============================================================
function renderSimpleHome() {
  const mc = document.getElementById("mainContent");
  if (!mc) return;
  let inc = 0,
    exp = 0;
  // Убрали фильтр .filter((tx) => !tx._initial), чтобы начальная сумма включалась в баланс
  transactions.forEach((tx) => {
    if (tx.type === "income") inc += tx.amountRub;
    else exp += tx.amountRub;
  });
  const bal = inc - exp;
  const s = sym();
  const L = {
    ru: {
      bal: "💰 Баланс",
      inc: "📈 Доходы",
      exp: "📉 Расходы",
      addInc: "➕ Доход",
      addExp: "➖ Расход",
      rec: "📋 Последние операции",
      all: "📜 Вся история →",
      noOps: "Нет операций. Нажмите ➕ чтобы добавить",
    },
    en: {
      bal: "💰 Balance",
      inc: "📈 Income",
      exp: "📉 Expenses",
      addInc: "➕ Income",
      addExp: "➖ Expense",
      rec: "📋 Recent",
      all: "📜 All history →",
      noOps: "No operations yet. Tap ➕ to add",
    },
    ka: {
      bal: "💰 ბალანსი / ნაშთი",
      inc: "📈 შემოსავალი",
      exp: "📉 ხარჯები",
      addInc: "➕ შემოსავალი",
      addExp: "➖ ხარჯი",
      rec: "📋 ბოლო ოპერაციები",
      all: "📜 ყველა →",
      noOps: "ოპერაციები არ არის. დააჭირეთ ➕",
    },
  };
  const LL = L[currentLang] || L.ru;
  // Для списка последних операций по-прежнему исключаем начальную сумму
  const recent = [...transactions]
    .filter((tx) => !tx._initial)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 6);

  mc.innerHTML = `
    <div class="tab-anim">
      <!-- BIG BALANCE CARD -->
      <div style="background:${bal >= 0 ? "var(--income-pale)" : "var(--expense-pale)"};border:3px solid ${bal >= 0 ? "var(--income-color)" : "var(--expense-color)"};border-radius:24px;padding:24px 20px;text-align:center;margin-bottom:16px;box-shadow:0 4px 20px rgba(0,0,0,.08);">
        <div style="font-size:15px;font-weight:700;color:var(--text-muted);margin-bottom:6px;">${LL.bal}</div>
        <div style="font-size:42px;font-weight:900;color:${bal >= 0 ? "var(--income-color)" : "var(--expense-color)"};margin-bottom:12px;letter-spacing:-1px;">${bal >= 0 ? "+" : ""}${toDisp(bal).toFixed(2)} ${s}</div>
        <div style="display:flex;justify-content:center;gap:24px;">
          <div style="text-align:center;"><div style="font-size:12px;color:var(--text-muted);">${LL.inc}</div><div style="font-size:20px;font-weight:900;color:var(--income-color);">+${toDisp(inc).toFixed(2)} ${s}</div></div>
          <div style="width:1px;background:var(--cream-border);"></div>
          <div style="text-align:center;"><div style="font-size:12px;color:var(--text-muted);">${LL.exp}</div><div style="font-size:20px;font-weight:900;color:var(--expense-color);">-${toDisp(exp).toFixed(2)} ${s}</div></div>
        </div>
      </div>

      <!-- BIG ADD BUTTONS -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <button class="simple-add-btn" data-addtype="income" style="padding:22px 16px;background:var(--income-pale);border:3px solid var(--income-color);border-radius:20px;font-size:22px;font-weight:900;color:var(--income-color);cursor:pointer;font-family:inherit;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;">
          <span>➕</span><span style="font-size:14px;">${LL.addInc}</span>
        </button>
        <button class="simple-add-btn" data-addtype="expense" style="padding:22px 16px;background:var(--expense-pale);border:3px solid var(--expense-color);border-radius:20px;font-size:22px;font-weight:900;color:var(--expense-color);cursor:pointer;font-family:inherit;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;">
          <span>➖</span><span style="font-size:14px;">${LL.addExp}</span>
        </button>
      </div>

      <!-- TIPS -->
      <div style="background:var(--primary-pale);border-radius:14px;padding:12px 16px;margin-bottom:16px;border-left:4px solid var(--primary);display:flex;flex-direction:column;gap:6px;">
        <div style="font-size:13px;font-weight:700;color:var(--primary);">💡 ${{ ru: "Свайп влево = удалить операцию", en: "Swipe left = delete operation", ka: "მარცხნივ გადაფურცვლა = წაშლა" }[currentLang]}</div>
        <div style="font-size:13px;font-weight:700;color:var(--primary);">👆 ${{ ru: "Нажмите на операцию = редактировать", en: "Tap operation = edit", ka: "ოპერაციაზე დაჭერა = რედ." }[currentLang]}</div>
      </div>

      <!-- RECENT OPS -->
      <div style="font-size:18px;font-weight:800;color:var(--text);margin-bottom:12px;">${LL.rec}</div>
      <div id="simpleOpsContainer">
        ${
          recent.length
            ? recent
                .map((tx) => {
                  const style2 = getCategoryStyle(tx.category, tx.type);
                  const sign = tx.type === "income" ? "+" : "−";
                  const clr =
                    tx.type === "income"
                      ? "var(--income-color)"
                      : "var(--expense-color)";
                  const idx2 = transactions.indexOf(tx);
                  return `<div class="simple-op-item" data-idx="${idx2}" style="display:flex;align-items:center;gap:14px;padding:16px 14px;background:var(--card-bg);border-radius:18px;margin-bottom:10px;border:2px solid var(--cream-border);cursor:pointer;transition:all .2s;">
            <div style="width:50px;height:50px;border-radius:14px;background:${style2.color}20;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">${style2.icon}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:17px;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(tx.category)}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${fmtDate(tx.date)}${tx.note ? " · " + esc(tx.note.slice(0, 20)) : ""}</div>
            </div>
            <div style="font-size:20px;font-weight:900;color:${clr};flex-shrink:0;">${sign}${fmt(tx.amountRub)}</div>
          </div>`;
                })
                .join("")
            : `<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:16px;">📭 ${LL.noOps}</div>`
        }
      </div>
      ${recent.length ? `<button id="simpleViewAllBtn" style="width:100%;padding:16px;background:transparent;border:2px solid var(--cream-border);border-radius:16px;font-size:16px;font-weight:800;color:var(--primary);cursor:pointer;font-family:inherit;">${LL.all}</button>` : ""}
    </div>`;

  // Handlers
  mc.querySelectorAll(".simple-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openAddModal(btn.dataset.addtype);
    });
    btn.addEventListener(
      "touchstart",
      () => {
        btn.style.transform = "scale(.96)";
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
  mc.querySelectorAll(".simple-op-item").forEach((item) => {
    item.addEventListener("click", () =>
      openEditModal(parseInt(item.dataset.idx)),
    );
  });
  document
    .getElementById("simpleViewAllBtn")
    ?.addEventListener("click", showFullHistory);
}

function renderHome() {
  // Simple mode redirect
  if (simpleMode) {
    renderSimpleHome();
    return;
  }
  const sw = !localStorage.getItem("welcomeSeen") && transactions.length === 0;
  let html = "";
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
      ? `Найдено: ${filtered.length} из ${transactions.length}`
      : `${filtered.length} записей`;
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
      const sign = tx.type === "income" ? "+" : " −";
      const style = getCategoryStyle(tx.category, tx.type);
      let dcat = esc(tx.category);
      if (sq && tx.category.toLowerCase().includes(sq))
        dcat = `<span style="background:var(--gold-pale);border-radius:4px;padding:0 2px;">${esc(tx.category)}</span>`;
      html += `<div class="op-card" data-idx="${idx}" data-type="${tx.type}" style="border-left-color:${style.color};">
        <div class="op-emoji" style="background:${style.color}20;color:${style.color};">${style.icon}</div>
        <div class="op-info">
          <div class="op-category">${dcat}${tx.subcategory ? ` · <span style="font-weight:400;color:var(--text-muted)">${esc(tx.subcategory)}</span>` : ""}</div>
          ${tx.note ? `<div class="op-note">📝 ${esc(tx.note.substring(0, 50))}</div>` : ""}
          ${tx._recurring ? `<div class="op-note">🔄 повтор.</div>` : ""}
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
      askConfirm(
        t("confirmDelete"),
        () => {
          transactions.splice(parseInt(btn.dataset.idx), 1);
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
          aC.style.transform = "translateX(-100%)";
          aC.style.opacity = "0";
          aC.style.transition = "transform .3s,opacity .3s";
          setTimeout(() => {
            askConfirm(
              t("confirmDelete"),
              () => {
                transactions.splice(aI, 1);
                saveAll();
                updateTopBlocks();
                renderBalanceSummary();
                renderOpsList();
                showToast(t("deleted"));
              },
              { icon: "🗑️" },
            );
            if (aC) {
              aC.style.transform = "";
              aC.style.opacity = "1";
              aC.style.transition = "";
            }
            aC = null;
          }, 300);
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
        transactions.splice(editingOpIndex, 1);
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
      transactions[ei].note = t("initialCapital");
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
    updateTopBlocks();
    renderBalanceSummary();
    renderOpsList();
    closeModal("salaryModal");
    if (simpleMode) {
      renderHome();
    }
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
    <div class="field-group"><label class="field-label">Иконка</label><select id="editCatIcon" class="modal-select">${icons.map((i) => `<option value="${i}"${i === cur.icon ? " selected" : ""}>${i}</option>`).join("")}</select></div>
    <div class="field-group"><label class="field-label">Цвет</label><input type="color" id="editCatColor" class="modal-input" value="${cur.color}"></div>
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
// МОДАЛКА ДОБАВЛЕНИЯ
// ============================================================
function openAddModal(defaultType = "expense") {
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
    <div class="field-group"><label class="field-label">${t("type")}</label><div class="type-toggle"><button class="type-btn expense ${defaultType === "expense" ? "active" : ""}" data-type="expense">${t("expenseType")}</button><button class="type-btn income ${defaultType === "income" ? "active" : ""}" data-type="income">${t("incomeType")}</button></div></div>
    <div class="field-group"><label class="field-label" id="catLabel">${defaultType === "expense" ? t("expCategory") : t("incCategory")}</label><select id="addCategorySelect" class="modal-select">${defaultType === "expense" ? eo : io}</select></div>
    <div class="field-group" id="addSubcatDiv" style="display:none"><label class="field-label">${t("subcategory")}</label><select id="addSubcatSelect" class="modal-select"></select></div>
    <div class="field-group"><label class="field-label">${t("amount")} (${sym()})</label><input type="text" id="addAmount" class="modal-input" placeholder="0.00" inputmode="decimal" autofocus></div>
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

  // Начальная установка категорий
  document.getElementById("catLabel").textContent =
    addType === "expense" ? t("expCategory") : t("incCategory");
  document.getElementById("addCategorySelect").innerHTML =
    addType === "expense" ? eo : io;

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
      if (spent + toRub(amt) > limit) {
        if (!confirm(`⚠️ Превысит лимит бюджета (${fmt(limit)}). Продолжить?`))
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
        showToast("Сначала выберите категорию и сумму", "error");
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
      chartBars += `<div class="stat-chart-col"><div class="stat-chart-bars"><div class="stat-chart-bar inc" style="height:${iH}px" title="+${fmt(d.inc)}"></div><div class="stat-chart-bar exp" style="height:${eH}px" title="−${fmt(d.exp)}"></div></div><div class="stat-chart-label">${lbl}</div></div>`;
    });
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
    if (pd.length) {
      let cum = 0;
      const pc = ["#c13515", "#e8714e", "#f0a080", "#f5bfab", "#faddd3"];
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
    const incPc = ["#1a7340", "#2a8f55", "#52b788", "#74c69d", "#95d5b2"];
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
      heatHtml += `<div class="heatmap-cell"><div class="heatmap-bar" style="height:${Math.max(4, pct * 0.6)}px;background:rgba(193,53,21,${op});"></div><div class="heatmap-day">${wd[i]}</div><div class="heatmap-val">${avg > 0 ? fmt(avg) : ""}</div></div>`;
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
              borderColor: "#2563eb",
              backgroundColor: "rgba(37,99,235,0.05)",
              borderWidth: 3,
              pointBackgroundColor: "#2563eb",
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
    if (act === "=") {
      btn.classList.remove("op");
      btn.classList.add("equals");
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
  const cs = getCreatorSettings();
  const canContact = cs.contactEnabled !== false;
  const html = `
    <div class="settings-card">
      <div class="settings-card-title">${t("currency")}</div><div class="settings-card-desc">${t("explanationCurrency")}</div>
      <div class="settings-card-body"><select id="currencySelect" class="settings-select"><option value="RUB">🇷🇺 ${t("currRUB")}</option><option value="USD">🇺🇸 ${t("currUSD")}</option><option value="EUR">🇪🇺 ${t("currEUR")}</option><option value="GEL">🇬🇪 ${t("currGEL")}</option><option value="GBP">🇬🇧 ${t("currGBP")}</option><option value="KZT">🇰🇿 ${t("currKZT")}</option></select></div>
    </div>
    <div class="settings-card">
      <div class="settings-card-title">${t("theme")}</div><div class="settings-card-desc">${t("explanationTheme")}</div>
      <div class="settings-card-body"><select id="themeSelect" class="settings-select"><option value="light">${t("light")}</option><option value="dark">${t("dark")}</option></select></div>
    </div>
    <div class="settings-card">
      <div class="settings-card-title">${t("language")}</div><div class="settings-card-desc">${t("explanationLanguage")}</div>
      <div class="settings-card-body"><select id="langSelect" class="settings-select"><option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option><option value="ka">🇬🇪 ქართული</option></select></div>
    </div>
    <!-- ПИН-КОД -->
    <div class="settings-card">
      <div class="settings-card-title">${t("pinCode")}</div>
      <div class="settings-card-desc">Защитите приложение от чужих глаз</div>
      <div class="settings-card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span>${t("pinEnable")}</span>
          <label class="switch"><input type="checkbox" id="pinToggle" ${pinEnabled ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        ${pinEnabled ? `<button class="settings-btn primary" id="changePinBtn">${t("pinChange")}</button>` : ``}
      </div>
    </div>
    <!-- ЦВЕТОВЫЕ ТЕМЫ -->
    <div class="settings-card" style="border-left-color:#9b5de5;">
      <div class="settings-card-title">${t("themeCardTitle")}</div>
      <div class="settings-card-desc">${t("themeCardDesc")}</div>
      <div class="settings-card-body">
        <button class="settings-btn primary" id="resetThemeBtn" style="margin-bottom:14px;justify-content:center;">${t("resetThemeBtn")}</button>
        <div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px;">${t("themeDay")}</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${["white", "default", "sunset"]
            .map((k) => {
              const th = COLOR_THEMES[k];
              const isActive = colorTheme === k;
              const labels = tObj("themeLabels");
              const descs = tObj("themeDescs");
              const icons = { white: "⬜", default: "🌿", sunset: "🌅" };
              const accentColor =
                th.accent || th.vars["--primary"] || "#2d6a4f";
              return (
                "<button class='theme-swatch-btn' data-theme='" +
                k +
                "' style='display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:18px;border:2px solid " +
                (isActive ? accentColor : "var(--cream-border)") +
                ";background:" +
                (isActive ? "var(--primary-pale)" : "var(--cream-dark)") +
                ";cursor:pointer;font-family:inherit;text-align:left;width:100%;box-shadow:" +
                (isActive ? "0 4px 16px " + accentColor + "40" : "none") +
                ";'><div style='width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg," +
                accentColor +
                "," +
                (th.vars["--primary-med"] || accentColor) +
                ");flex-shrink:0;box-shadow:0 3px 10px " +
                accentColor +
                "50;display:flex;align-items:center;justify-content:center;font-size:16px;'>" +
                icons[k] +
                "</div><div style='flex:1;'><div style='font-size:15px;font-weight:800;color:var(--text);'>" +
                (labels[k] || th.label || k) +
                "</div><div style='font-size:12px;color:var(--text-muted);margin-top:2px;'>" +
                (descs[k] || "") +
                "</div></div>" +
                (isActive
                  ? "<div style='width:24px;height:24px;border-radius:50%;background:" +
                    accentColor +
                    ";display:flex;align-items:center;justify-content:center;font-size:13px;color:white;'>✓</div>"
                  : "") +
                "</button>"
              );
            })
            .join("")}
        </div>
        <div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px;margin:16px 0 10px;">${t("themeNight")}</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${["dark", "navy", "gold"]
            .map((k) => {
              const th = COLOR_THEMES[k];
              const isActive = colorTheme === k;
              const labels = tObj("themeLabels");
              const descs = tObj("themeDescs");
              const icons = { dark: "🌿", navy: "🌌", gold: "✨" };
              const accentColor =
                th.accent || th.vars["--primary"] || "#52b788";
              return (
                "<button class='theme-swatch-btn' data-theme='" +
                k +
                "' style='display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:18px;border:2px solid " +
                (isActive ? accentColor : "var(--cream-border)") +
                ";background:" +
                (isActive ? "var(--primary-pale)" : "var(--cream-dark)") +
                ";cursor:pointer;font-family:inherit;text-align:left;width:100%;box-shadow:" +
                (isActive ? "0 4px 16px " + accentColor + "50" : "none") +
                ";'><div style='width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg," +
                accentColor +
                "," +
                (th.vars["--primary-med"] || accentColor) +
                ");flex-shrink:0;box-shadow:0 3px 10px " +
                accentColor +
                "60;display:flex;align-items:center;justify-content:center;font-size:16px;'>" +
                icons[k] +
                "</div><div style='flex:1;'><div style='font-size:15px;font-weight:800;color:var(--text);'>" +
                (labels[k] || th.label || k) +
                "</div><div style='font-size:12px;color:var(--text-muted);margin-top:2px;'>" +
                (descs[k] || "") +
                "</div></div>" +
                (isActive
                  ? "<div style='width:24px;height:24px;border-radius:50%;background:" +
                    accentColor +
                    ";display:flex;align-items:center;justify-content:center;font-size:13px;color:" +
                    (k === "gold" ? "#1a0c00" : "white") +
                    "'>✓</div>"
                  : "") +
                "</button>"
              );
            })
            .join("")}
        </div>
      </div>
    </div>
    <!-- БИОМЕТРИЯ -->
    <div class="settings-card" id="biometryCard" style="border-left-color:#0ea5e9;">
      <div class="settings-card-title">${t("biometryTitle")}</div>
      <div class="settings-card-desc">${t("biometryDesc")}</div>
      <div class="settings-card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span style="font-size:15px;font-weight:600;">${t("biometryToggleLabel")}</span>
          <label class="switch"><input type="checkbox" id="biometryToggle" ${biometryEnabled ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        ${
          biometryEnabled
            ? `<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--income-pale);border-radius:12px;border:1px solid var(--income-color);"><span style="font-size:20px;">✅</span><span style="font-size:14px;font-weight:700;color:var(--income-color);">${t("biometrySupported")}</span></div><button class="settings-btn danger" id="biometryResetBtn" style="margin-top:10px;">🗑 ${t("pinDisable")}</button>`
            : `<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--cream-dark);border-radius:12px;"><span style="font-size:20px;" id="bioStatusIcon">🔍</span><span id="bioStatusText" style="font-size:14px;font-weight:600;color:var(--text-muted);">${t("loading")}</span></div>`
        }
      </div>
    </div>
    <!-- ПРОФИЛИ -->
    <div class="settings-card" style="border-left-color:#06b6d4;">
      <div class="settings-card-title">${t("profilesTitle")}</div>
      <div class="settings-card-desc">${t("profilesDesc")}</div>
      <div class="settings-card-body" id="profilesBody">
        ${renderProfilesBody()}
        ${
          profiles.length < 10
            ? `<button class="settings-btn primary" id="addProfileBtn" style="margin-top:12px;">${t("addProfile")}</button>`
            : `<div style="color:var(--text-muted);font-size:13px;margin-top:8px;">${t("profilesMax")}</div>`
        }
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--cream-border);">
          <button class="settings-btn primary" id="connectProfileBtn" style="background:var(--balance-pale);color:#2563eb;border-color:rgba(37,99,235,0.25);">🔗 ${t("connectProfile")}</button>
        </div>
      </div>
    </div>
    <!-- ДОСТУПНОСТЬ -->
    <div class="settings-card" style="border-left-color:#7c3aed;">
      <div class="settings-card-title">${t("accessibilityTitle")}</div>
      <div class="settings-card-desc">${t("accessibilityDesc")}</div>
      <div class="settings-card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--cream-border);">
          <div><div style="font-size:15px;font-weight:700;">${t("simpleMode")}</div><div style="font-size:12px;color:var(--text-muted);">${t("simpleModeDesc")}</div></div>
          <label class="switch"><input type="checkbox" id="simpleModeToggle" ${simpleMode ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        <div style="padding:12px 0;border-bottom:1px solid var(--cream-border);">
          <div style="font-size:15px;font-weight:700;margin-bottom:10px;">${t("fontSizeLabel")}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${["small", "normal", "large", "xl"].map((s) => `<button class="font-size-btn" data-size="${s}" style="flex:1;padding:8px;border-radius:12px;border:2px solid ${fontSize === s ? "var(--primary)" : "var(--cream-border)"};background:${fontSize === s ? "var(--primary-pale)" : "var(--cream-dark)"};font-size:${s === "small" ? "13px" : s === "normal" ? "15px" : s === "large" ? "18px" : "21px"};font-weight:700;cursor:pointer;font-family:inherit;color:var(--text);">${t("font" + s.charAt(0).toUpperCase() + s.slice(1))}</button>`).join("")}
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--cream-border);">
          <div style="font-size:15px;font-weight:700;">${t("animationsLabel")}</div>
          <label class="switch"><input type="checkbox" id="animationsToggle" ${animationsEnabled ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--cream-border);">
          <div style="font-size:15px;font-weight:700;">${t("hapticLabel")}</div>
          <label class="switch"><input type="checkbox" id="hapticToggle" ${hapticEnabled ? "checked" : ""}><span class="slider round"></span></label>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;">
          <div>
            <div style="font-size:15px;font-weight:700;">${{ ru: "📌 Быстрые предложения", en: "📌 Quick suggestions", ka: "📌 სწრაფი წინადადებები" }[currentLang]}</div>
            <div style="font-size:12px;color:var(--text-muted);">${{ ru: "Показывать шаблоны в форме добавления", en: "Show templates in add form", ka: "შაბლონები დამატების ფორმაში" }[currentLang]}</div>
          </div>
          <label class="switch"><input type="checkbox" id="suggestionsToggle" ${suggestionsEnabled ? "checked" : ""}><span class="slider round"></span></label>
        </div>
      </div>
    </div>
          ${
            canContact
              ? `
    <!-- ПОДДЕРЖКА -->
    <div class="settings-card" style="border-left-color:#0ea5e9;">
      <div class="settings-card-title">${t("supportTitle")}</div>
      <div class="settings-card-desc">${t("supportDesc")}</div>
      <div class="settings-card-body">
        <button class="settings-btn primary" id="openSupportBtn" style="background:#0ea5e9;color:white;justify-content:center;">💬 ${t("supportTitle")}</button>
      </div>
    </div>
    `
              : ""
          }
    <!-- БЮДЖЕТЫ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("budgets")}</div>
      <div class="settings-card-desc">Задайте лимиты трат по категориям на месяц</div>
      <div class="settings-card-body" id="budgetsBody">
        ${renderBudgetsBody()}
        <button class="settings-btn primary" id="addBudgetBtn" style="margin-top:10px;">${t("addBudget")}</button>
      </div>
    </div>
    <!-- ПОВТОРЯЮЩИЕСЯ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("recurring")}</div>
      <div class="settings-card-desc">Операции которые добавляются автоматически</div>
      <div class="settings-card-body" id="recurringBody">
        ${renderRecurringBody()}
        <button class="settings-btn primary" id="addRecurringBtn" style="margin-top:10px;">${t("addRecurring")}</button>
      </div>
    </div>
    <!-- ШАБЛОНЫ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("manageTemplates")}</div>
      <div class="settings-card-desc">Ваши сохранённые шаблоны операций</div>
      <div class="settings-card-body" id="templatesBody">${renderTemplatesBody()}</div>
    </div>
      <!-- ДАННЫЕ -->
    <div class="settings-card">
      <div class="settings-card-title">${t("data")}</div><div class="settings-card-desc">${t("explanationRates")}</div>
      <div class="settings-card-body">
        <button class="settings-btn primary" id="refreshRatesBtn">${t("updateRates")}</button>
        <button class="settings-btn primary" id="reconnectWsBtn" style="margin-top:8px;">🔌 Переподключить WebSocket</button>
        <button class="settings-btn primary" id="exportJSONBtn" style="margin-top:8px;">${t("exportJSON")}</button>
<button class="settings-btn primary" id="importJSONBtn" style="margin-top:8px;">${t("importJSON")}</button>
        <input type="file" id="importFileInput" accept=".json" style="display:none;">
        <button class="settings-btn primary" id="exportCSVBtn" style="margin-top:8px;">${t("exportCSV")}</button>
        <button class="settings-btn primary" id="exportPDFBtn" style="margin-top:8px;">${t("exportPDF")}</button>
        <button class="settings-btn primary" id="cloudSaveBtn" style="margin-top:8px;">${t("cloudSave")}</button>
        <button class="settings-btn primary" id="cloudLoadBtn" style="margin-top:8px;">${t("cloudLoad")}</button>
        <button class="settings-btn danger" id="clearAllBtn" style="margin-top:8px;">${t("resetAll")}</button>
      </div>
    </div>
    <!-- WOW FEATURES SETTINGS -->
    <div class="settings-card">
      <div class="settings-card-title">✨ ${ {ru:"Расширенные функции",en:"Advanced features",ka:"გაფართოებული ფუნქციები"}[currentLang] }</div>
      <div class="settings-card-desc">${ {ru:"Голосовой ввод, цели, плавающие кнопки",en:"Voice input, goals, floating buttons",ka:"ხმოვანი შეყვანა, მიზნები, მცოცავი ღილაკები"}[currentLang] }</div>
      <div class="settings-card-body">
        <!-- Voice input -->
        <div style="margin-bottom:14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div>
              <div style="font-weight:800;font-size:14px;">🎤 ${ {ru:"Голосовой ввод",en:"Voice input",ka:"ხმოვანი შეყვანა"}[currentLang] }</div>
              <div style="font-size:12px;color:var(--text-muted);">${ {ru:"Кнопка на экране (Chrome)",en:"On-screen button (Chrome)",ka:"ეკრანზე ღილაკი (Chrome)"}[currentLang] }</div>
            </div>
            <label class="switch"><input type="checkbox" id="showVoiceBtnToggle" ${localStorage.getItem("showVoiceBtn")!=="false"?"checked":""}><span class="slider round"></span></label>
          </div>
          <button class="settings-btn primary" id="voiceDirectBtn" style="width:100%;margin-top:4px;">🎤 ${ {ru:"Использовать голосовой ввод сейчас",en:"Use voice input now",ka:"ხმოვანი შეყვანის გამოყენება"}[currentLang] }</button>
        </div>
        <!-- Goals -->
        <div style="border-top:1px solid var(--cream-border);padding-top:14px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div>
              <div style="font-weight:800;font-size:14px;">🎯 ${ {ru:"Кнопка целей на экране",en:"Goals button on screen",ka:"მიზნების ღილაკი ეკრანზე"}[currentLang] }</div>
              <div style="font-size:12px;color:var(--text-muted);">${ {ru:"Плавающая кнопка для быстрого доступа",en:"Floating button for quick access",ka:"სწრაფი წვდომის ღილაკი"}[currentLang] }</div>
            </div>
            <label class="switch"><input type="checkbox" id="showGoalsBtnToggle" ${localStorage.getItem("showGoalsBtn")!=="false"?"checked":""}><span class="slider round"></span></label>
          </div>
          <button class="settings-btn primary" id="goalsDirectBtn" style="width:100%;margin-top:4px;">🎯 ${ {ru:"Открыть мои цели",en:"Open my goals",ka:"ჩემი მიზნების გახსნა"}[currentLang] }</button>
        </div>
        <!-- 12/24hr format -->
        <div style="border-top:1px solid var(--cream-border);padding-top:14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-weight:800;font-size:14px;">🕐 ${ {ru:"12-часовой формат времени",en:"12-hour time format",ka:"12-საათიანი ფორმატი"}[currentLang] }</div>
              <div style="font-size:12px;color:var(--text-muted);">${ {ru:"AM/PM вместо 24-часового",en:"AM/PM instead of 24-hour",ka:"AM/PM 24-საათიანის მაგივრად"}[currentLang] }</div>
            </div>
            <label class="switch"><input type="checkbox" id="time12hToggle" ${localStorage.getItem("timeFormat12h")==="true"?"checked":""}><span class="slider round"></span></label>
          </div>
        </div>
      </div>
    </div>

    <!-- REMINDERS -->
    <div class="settings-card">
      <div class="settings-card-title">${t("reminders")}</div>
      <div class="settings-card-desc">${t("remindersDesc")}</div>
      <div class="settings-card-body">
        <!-- Notification status block -->
        <div id="notifStatusBlock" style="border-radius:14px;padding:14px;margin-bottom:14px;background:${remindersEnabled ? "var(--income-pale)" : "var(--cream-dark)"};border:1.5px solid ${remindersEnabled ? "var(--income-color)" : "var(--cream-border)"};">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="font-size:28px;">${remindersEnabled ? "🔔" : "🔕"}</div>
            <div style="flex:1;">
              <div data-notif-title style="font-weight:800;font-size:14px;color:${remindersEnabled ? "var(--income-color)" : "var(--text)"};">${remindersEnabled ? {ru:"Напоминания включены",en:"Reminders enabled",ka:"შეხსენებები ჩართულია"}[currentLang] : {ru:"Напоминания выключены",en:"Reminders disabled",ka:"შეხსენებები გამორთულია"}[currentLang]}</div>
              <div style="font-size:12px;color:var(--text-muted);">${"Notification" in window ? Notification.permission === "granted" ? {ru:"✅ Разрешение получено",en:"✅ Permission granted",ka:"✅ ნებართვა მიღებულია"}[currentLang] : Notification.permission === "denied" ? {ru:"⛔ Заблокировано в браузере",en:"⛔ Blocked in browser",ka:"⛔ ბრაუზერში დაბლოკილია"}[currentLang] : {ru:"Нажмите кнопку чтобы разрешить",en:"Tap button to allow",ka:"ღილაკზე დააჭირეთ"}[currentLang] : {ru:"⚠️ Браузер не поддерживает",en:"⚠️ Browser not supported",ka:"⚠️ ბრაუზერი არ უჭერს მხარს"}[currentLang]}</div>
            </div>
          </div>
        </div>
        <!-- BUTTON approach — guaranteed user gesture on all mobile browsers -->
        <div style="display:flex;gap:8px;margin-bottom:16px;">
          <button id="notifEnableBtn" class="btn-primary" style="flex:1;padding:14px;font-size:14px;font-weight:800;"
            ${!("Notification" in window) || Notification.permission === "denied" ? "disabled style='opacity:0.5;'" : ""}>
            🔔 ${remindersEnabled ? {ru:"Выключить напоминания",en:"Disable reminders",ka:"შეხსენებების გამორთვა"}[currentLang] : {ru:"Включить напоминания",en:"Enable reminders",ka:"შეხსენებების ჩართვა"}[currentLang]}
          </button>
          ${Notification.permission === "denied" ? `<button id="notifHelpBtn" class="btn-secondary" style="padding:14px;font-size:13px;">❓ ${currentLang==="ru"?"Как разрешить":currentLang==="en"?"How to allow":"როგორ"}</button>` : ""}
        </div>
        <!-- Hidden checkbox for compatibility -->
        <input type="checkbox" id="remindersToggle" ${remindersEnabled ? "checked" : ""} style="display:none;">
        <div id="remindersIntervalDiv" style="display:${remindersEnabled ? "block" : "none"};">
          <div style="font-size:14px;font-weight:700;color:var(--text-muted);margin-bottom:12px;">🔔 Выберите интервалы напоминаний</div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;" id="reminderIntervalCheckboxes">
            ${[
              {
                val: "30min",
                label: {
                  ru: "Каждые 30 минут",
                  en: "Every 30 minutes",
                  ka: "ყოველ 30 წუთში",
                },
              },
              {
                val: "1h",
                label: {
                  ru: "Каждый час",
                  en: "Every hour",
                  ka: "ყოველ საათში",
                },
              },
              {
                val: "2h",
                label: {
                  ru: "Каждые 2 часа",
                  en: "Every 2 hours",
                  ka: "ყოველ 2 საათში",
                },
              },
              {
                val: "5h",
                label: {
                  ru: "Каждые 5 часов",
                  en: "Every 5 hours",
                  ka: "ყოველ 5 საათში",
                },
              },
              {
                val: "daily",
                label: { ru: "Каждый день", en: "Every day", ka: "ყოველდღე" },
              },
              {
                val: "every3days",
                label: {
                  ru: "Каждые 3 дня",
                  en: "Every 3 days",
                  ka: "ყოველ 3 დღეში",
                },
              },
              {
                val: "weekly",
                label: {
                  ru: "Каждую неделю",
                  en: "Every week",
                  ka: "ყოველ კვირას",
                },
              },
            ]
              .map((opt) => {
                const checked = reminderIntervals?.[opt.val] || false;
                return `<label style="display:flex;align-items:center;gap:12px;padding:8px 0;cursor:pointer;">
                <input type="checkbox" class="reminder-interval-checkbox" data-val="${opt.val}" ${checked ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--primary);">
                <span style="font-size:15px;font-weight:600;color:var(--text);">${opt.label[currentLang] || opt.label.ru}</span>
              </label>`;
              })
              .join("")}
          </div>
          
          <div style="margin:20px 0; border-top:1px dashed var(--cream-border);"></div>
          <div style="font-size:15px;font-weight:700;margin-bottom:12px;color:var(--text);">📅 Точная дата и время</div>
          
          <!-- DATETIME — JS-triggered native picker (no pointer events on input) -->
          <div style="display:flex;gap:12px;margin-bottom:4px;">

            <div id="dateCard" style="flex:1;background:var(--card-bg);border:2px solid var(--cream-border);border-radius:var(--radius-md);padding:14px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow-sm);transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);min-height:68px;-webkit-tap-highlight-color:transparent;user-select:none;">
              <div id="dtDateIcon" style="font-size:28px;flex-shrink:0;transition:transform 0.3s ease;pointer-events:none;">📅</div>
              <div style="flex:1;min-width:0;pointer-events:none;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px;">${ {ru:"Дата",en:"Date",ka:"თარიღი"}[currentLang] }</div>
                <div id="dateDisplay" style="font-size:14px;font-weight:700;line-height:1.3;color:${customReminderDate?"var(--text)":"var(--text-muted)"};">${ customReminderDate ? (() => { try { return new Date(customReminderDate+"T00:00").toLocaleDateString(currentLang==="en"?"en-US":currentLang==="ka"?"ka-GE":"ru-RU",{day:"numeric",month:"long",year:"numeric"}); } catch(e){ return customReminderDate; } })() : {ru:"Нажмите для выбора",en:"Tap to choose",ka:"დAAჭირეთ"}[currentLang] }</div>
              </div>
              <div style="font-size:18px;color:var(--primary);flex-shrink:0;pointer-events:none;font-weight:900;">›</div>
              <input type="date" id="reminderCustomDate" class="custom-date-input" value="${customReminderDate||""}" style="position:absolute;width:0;height:0;opacity:0;pointer-events:none;" aria-hidden="true" tabindex="-1">
            </div>

            <div id="timeCard" style="flex:1;background:var(--card-bg);border:2px solid var(--cream-border);border-radius:var(--radius-md);padding:14px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow-sm);transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);min-height:68px;-webkit-tap-highlight-color:transparent;user-select:none;">
              <div id="dtTimeIcon" style="font-size:28px;flex-shrink:0;transition:transform 0.3s ease;pointer-events:none;">⏰</div>
              <div style="flex:1;min-width:0;pointer-events:none;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px;">${ {ru:"Время",en:"Time",ka:"დრო"}[currentLang] }</div>
                <div id="timeDisplay" style="font-size:14px;font-weight:700;line-height:1.3;color:${customReminderTime?"var(--text)":"var(--text-muted)"};">${ customReminderTime||{ru:"Нажмите для выбора",en:"Tap to choose",ka:"დAAჭირეთ"}[currentLang] }</div>
              </div>
              <div style="font-size:18px;color:var(--primary);flex-shrink:0;pointer-events:none;font-weight:900;">›</div>
              <input type="time" id="reminderCustomTime" class="custom-time-input" value="${customReminderTime||""}" style="position:absolute;width:0;height:0;opacity:0;pointer-events:none;" aria-hidden="true" tabindex="-1">
            </div>

          </div>
          
          <div class="field-group">
            <label class="field-label">📝 Текст уведомления</label>
            <input type="text" id="reminderCustomText" class="modal-input" placeholder="${t("remindersDesc")}" value="${esc(customReminderText || "")}">
          </div>
          <div style="display:flex;gap:10px;margin-top:12px;">
            <button class="btn-primary" id="setCustomReminderBtn" style="flex:2;">⏰ Установить</button>
            <button class="btn-secondary" id="clearCustomReminderBtn" style="flex:1;">🗑 Сброс</button>
          </div>
          <div id="customReminderInfo" style="margin-top:12px;font-size:13px;color:var(--text-muted);">
            ${customReminderTimestamp ? `⏰ Запланировано: ${new Date(customReminderTimestamp).toLocaleString(currentLang)}` : "Нет активного напоминания"}
          </div>
        </div>
      </div>
    </div>
    <div style="text-align:center;padding:20px;color:var(--text-muted);">Мой Бюджет v2.2 · Офлайн 📴</div>`;
  document.getElementById("mainContent").innerHTML = html;

  // === DATETIME CARDS — 100% JS-driven, no pointer-events on input ===
  function setupDateTimeCards() {
    const langMap = { ru:"ru-RU", en:"en-US", ka:"ka-GE" };
    const loc = langMap[currentLang] || "ru-RU";
    const phDate = { ru:"Нажмите для выбора", en:"Tap to choose", ka:"დAAჭირეთ" }[currentLang];
    const phTime = { ru:"Нажмите для выбора", en:"Tap to choose", ka:"დAAჭირეთ" }[currentLang];

    function fmtDate(v) {
      if (!v) return phDate;
      try { return new Date(v + "T00:00").toLocaleDateString(loc, {day:"numeric",month:"long",year:"numeric"}); }
      catch(e) { return v; }
    }
    function fmtTime(v) { return v || phTime; }

    function activateCard(card, icon) {
      if (!card) return;
      card.style.borderColor = "var(--primary)";
      card.style.boxShadow = "0 0 0 4px rgba(45,106,79,0.2)";
      card.style.transform = "scale(1.02) translateY(-2px)";
      card.style.background = "var(--primary-pale)";
      if (icon) icon.style.transform = "scale(1.3) rotate(-15deg)";
    }
    function deactivateCard(card, icon) {
      if (!card) return;
      card.style.borderColor = "var(--cream-border)";
      card.style.boxShadow = "var(--shadow-sm)";
      card.style.transform = "";
      card.style.background = "var(--card-bg)";
      if (icon) icon.style.transform = "";
    }

    // Open a custom date/time picker modal — works on ALL browsers/devices
    function openPicker(type, card, icon) {
      activateCard(card, icon);
      const isDate = type === "date";
      const inp = document.getElementById(isDate ? "reminderCustomDate" : "reminderCustomTime");
      const disp = document.getElementById(isDate ? "dateDisplay" : "timeDisplay");

      // For date: show custom calendar modal
      // For time: show custom time wheel
      const pkL = {
        ru: { title: isDate ? "📅 Выберите дату" : "⏰ Выберите время", ok:"Выбрать", cancel:"Отмена" },
        en: { title: isDate ? "📅 Choose date" : "⏰ Choose time", ok:"Select", cancel:"Cancel" },
        ka: { title: isDate ? "📅 თარიღის არჩევა" : "⏰ დროის არჩევა", ok:"არჩევა", cancel:"გაუქმება" },
      };
      const lc = pkL[currentLang] || pkL.ru;

      const today = new Date();
      let selDate = inp?.value ? new Date(inp.value + "T00:00") : new Date();
      let selHour = inp?.value ? parseInt(inp.value.split(":")[0]) : today.getHours();
      let selMin  = inp?.value ? parseInt(inp.value.split(":")[1]) : 0;

      const pkOv = document.createElement("div");
      pkOv.id = "dtPickerOverlay";
      pkOv.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99998;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;";

      function renderPicker() {
        if (isDate) {
          const y = selDate.getFullYear(), m = selDate.getMonth();
          const firstDay = (new Date(y,m,1).getDay()+6)%7; // Mon=0
          const daysInMonth = new Date(y,m+1,0).getDate();
          const monthNames = t("months");
          const dayNames = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
          const dayNamesEn = ["Mo","Tu","We","Th","Fr","Sa","Su"];
          const dayNamesKa = ["ო","ს","ოთ","ხ","პ","შ","კ"]; // ორშ,სამ,ოთხ,ხუთ,პარ,შაბ,კვ
          const dn = currentLang==="en" ? dayNamesEn : currentLang==="ka" ? dayNamesKa : dayNames;
          let cells = "";
          for (let i=0; i<firstDay; i++) cells += `<div></div>`;
          for (let d=1; d<=daysInMonth; d++) {
            const isToday = d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
            const isSel = d===selDate.getDate()&&m===selDate.getMonth()&&y===selDate.getFullYear();
            cells += `<div class="pk-day" data-d="${d}" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;font-size:14px;font-weight:${isSel||isToday?"800":"400"};background:${isSel?"var(--primary)":"isToday"?"var(--primary-pale)":"transparent"};color:${isSel?"white":isToday?"var(--primary)":"var(--text)"};transition:all 0.15s;">${d}</div>`;
            cells = cells.replace('"isToday"?"var(--primary-pale)":"transparent"', isToday&&!isSel ? '"var(--primary-pale)"' : '"transparent"');
          }
          pkOv.innerHTML = `<div style="background:var(--card-bg);border-radius:24px 24px 0 0;width:100%;max-width:420px;padding:20px 16px 24px;box-shadow:0 -8px 40px rgba(0,0,0,0.2);animation:slideUpBounce 0.35s cubic-bezier(0.34,1.3,0.64,1) both;max-height:85vh;max-height:85dvh;overflow-y:auto;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <button id="pkCancel" style="padding:8px 14px;border-radius:20px;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:13px;font-weight:700;cursor:pointer;">${lc.cancel}</button>
              <div style="text-align:center;font-size:16px;font-weight:800;">${lc.title}</div>
              <button id="pkOk" style="padding:8px 14px;border-radius:20px;background:var(--primary);color:white;border:none;font-size:13px;font-weight:800;cursor:pointer;">${lc.ok}</button>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:0 4px;">
              <button id="pkPrevM" style="width:36px;height:36px;border-radius:50%;background:var(--cream-dark);border:none;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;">‹</button>
              <div style="font-size:15px;font-weight:800;">${monthNames[m]} ${y}</div>
              <button id="pkNextM" style="width:36px;height:36px;border-radius:50%;background:var(--cream-dark);border:none;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;">›</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:6px;">
              ${dn.map(d=>`<div style="text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);padding:3px 0;">${d}</div>`).join("")}
              ${cells}
            </div>
          </div>`;
        } else {
          // Time picker — all 60 minutes, 12/24hr toggle
          const use12h = localStorage.getItem("timeFormat12h") === "true";
          const hrs = use12h ? Array.from({length:12},(_,i)=>i===0?12:i) : Array.from({length:24},(_,i)=>i);
          const mins = Array.from({length:60},(_,i)=>i); // ALL 60 minutes
          const ampm = use12h ? (selHour < 12 ? "AM" : "PM") : null;
          const dispH = use12h ? (selHour % 12 === 0 ? 12 : selHour % 12) : selHour;
          const fmtDisp = use12h
            ? `${dispH}:${String(selMin).padStart(2,"0")} ${ampm}`
            : `${String(selHour).padStart(2,"0")}:${String(selMin).padStart(2,"0")}`;

          pkOv.innerHTML = `<div style="background:var(--card-bg);border-radius:24px 24px 0 0;width:100%;max-width:420px;padding:18px 14px 24px;box-shadow:0 -8px 40px rgba(0,0,0,0.2);animation:slideUpBounce 0.35s cubic-bezier(0.34,1.3,0.64,1) both;max-height:88vh;max-height:88dvh;overflow-y:auto;">
            <!-- Header row -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <button id="pkCancel" style="padding:8px 14px;border-radius:20px;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:13px;font-weight:700;cursor:pointer;">${lc.cancel}</button>
              <div style="text-align:center;font-size:15px;font-weight:800;">${lc.title}</div>
              <button id="pkOk" style="padding:8px 14px;border-radius:20px;background:var(--primary);color:white;border:none;font-size:13px;font-weight:800;cursor:pointer;">${lc.ok}</button>
            </div>
            <!-- 12/24hr toggle -->
            <div style="display:flex;justify-content:center;margin-bottom:14px;">
              <div style="display:flex;background:var(--cream-dark);border-radius:20px;padding:3px;gap:2px;">
                <button id="fmt24btn" style="padding:6px 16px;border-radius:17px;border:none;font-size:12px;font-weight:800;cursor:pointer;background:${!use12h?"var(--primary)":"transparent"};color:${!use12h?"white":"var(--text-muted)"};">24ч</button>
                <button id="fmt12btn" style="padding:6px 16px;border-radius:17px;border:none;font-size:12px;font-weight:800;cursor:pointer;background:${use12h?"var(--primary)":"transparent"};color:${use12h?"white":"var(--text-muted)"};">12ч AM/PM</button>
              </div>
            </div>
            <!-- Wheels -->
            <div style="display:flex;align-items:flex-start;justify-content:center;gap:8px;margin-bottom:14px;">
              <!-- Hours -->
              <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">${{ru:"Часы",en:"Hours",ka:"სთ"}[currentLang]}</div>
                <div style="height:168px;overflow-y:auto;width:62px;border-radius:16px;background:var(--cream-dark);padding:4px 0;scroll-snap-type:y mandatory;" id="hrWheel">
                  ${hrs.map(h=>{const isS=use12h?(h===dispH):(h===selHour);return`<div class="pk-hr" data-h="${h}" style="min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:17px;font-weight:${isS?"900":"400"};background:${isS?"var(--primary)":"transparent"};color:${isS?"white":"var(--text)"};width:54px;transition:all 0.12s;scroll-snap-align:center;">${String(h).padStart(2,"0")}</div>`;}).join("")}
                </div>
              </div>
              <div style="font-size:26px;font-weight:900;color:var(--primary);margin-top:46px;flex-shrink:0;">:</div>
              <!-- Minutes — ALL 60 -->
              <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">${{ru:"Минуты",en:"Min",ka:"წთ"}[currentLang]}</div>
                <div style="height:168px;overflow-y:auto;width:62px;border-radius:16px;background:var(--cream-dark);padding:4px 0;scroll-snap-type:y mandatory;" id="minWheel">
                  ${mins.map(mn=>`<div class="pk-min" data-m="${mn}" style="min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:17px;font-weight:${mn===selMin?"900":"400"};background:${mn===selMin?"var(--primary)":"transparent"};color:${mn===selMin?"white":"var(--text)"};width:54px;transition:all 0.12s;scroll-snap-align:center;">${String(mn).padStart(2,"0")}</div>`).join("")}
                </div>
              </div>
              <!-- AM/PM (12h only) -->
              ${use12h ? `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">AM/PM</div>
                <div style="height:168px;overflow-y:auto;width:62px;border-radius:16px;background:var(--cream-dark);padding:4px 0;scroll-snap-type:y mandatory;" id="ampmWheel">
                  <div class="pk-ampm" data-ap="AM" style="min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:15px;font-weight:${selHour<12?"900":"400"};background:${selHour<12?"var(--primary)":"transparent"};color:${selHour<12?"white":"var(--text)"};width:54px;transition:all 0.12s;scroll-snap-align:center;">AM</div>
                  <div class="pk-ampm" data-ap="PM" style="min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:15px;font-weight:${selHour>=12?"900":"400"};background:${selHour>=12?"var(--primary)":"transparent"};color:${selHour>=12?"white":"var(--text)"};width:54px;transition:all 0.12s;scroll-snap-align:center;">PM</div>
                </div>
              </div>` : ""}
            </div>
            <!-- Preview -->
            <div style="text-align:center;font-size:36px;font-weight:900;color:var(--primary);background:var(--primary-pale);border-radius:16px;padding:12px;letter-spacing:1px;">${fmtDisp}</div>
          </div>`;
          // Scroll to selected hour/min
          setTimeout(() => {
            const hw = document.getElementById("hrWheel");
            const mw = document.getElementById("minWheel");
            if (hw) { const sel = hw.querySelector(`[data-h="${selHour}"]`); if(sel) sel.scrollIntoView({block:"center"}); }
            if (mw) { const sel = mw.querySelector(`[data-m="${selMin}"]`); if(sel) sel.scrollIntoView({block:"center"}); }
          }, 100);
        }

        // Event handlers
        pkOv.querySelector("#pkCancel")?.addEventListener("click", () => { deactivateCard(card,icon); pkOv.remove(); });
        pkOv.addEventListener("click", e => { if (e.target===pkOv) { deactivateCard(card,icon); pkOv.remove(); } });
        pkOv.querySelector("#pkOk")?.addEventListener("click", () => {
          if (isDate) {
            const val = `${selDate.getFullYear()}-${String(selDate.getMonth()+1).padStart(2,"0")}-${String(selDate.getDate()).padStart(2,"0")}`;
            if (inp) inp.value = val;
            if (disp) { disp.textContent = selDate.toLocaleDateString(currentLang==="en"?"en-US":currentLang==="ka"?"ka-GE":"ru-RU",{day:"numeric",month:"long",year:"numeric"}); disp.style.color="var(--text)"; }
            customReminderDate = val;
          } else {
            const val24 = `${String(selHour).padStart(2,"0")}:${String(selMin).padStart(2,"0")}`;
            if (inp) inp.value = val24;
            // Display format based on preference
            const use12hDisp = localStorage.getItem("timeFormat12h") === "true";
            let dispVal = val24;
            if (use12hDisp) {
              const ampm2 = selHour < 12 ? "AM" : "PM";
              const h12 = selHour % 12 === 0 ? 12 : selHour % 12;
              dispVal = `${h12}:${String(selMin).padStart(2,"00")} ${ampm2}`;
            }
            if (disp) { disp.textContent = dispVal; disp.style.color="var(--text)"; }
            customReminderTime = val24; // always store 24h internally
          }
          deactivateCard(card,icon);
          pkOv.remove();
        });

        if (isDate) {
          pkOv.querySelectorAll(".pk-day").forEach(el => {
            el.addEventListener("click", () => {
              selDate = new Date(selDate.getFullYear(), selDate.getMonth(), parseInt(el.dataset.d));
              renderPicker();
            });
          });
          pkOv.querySelector("#pkPrevM")?.addEventListener("click", () => { selDate = new Date(selDate.getFullYear(), selDate.getMonth()-1, 1); renderPicker(); });
          pkOv.querySelector("#pkNextM")?.addEventListener("click", () => { selDate = new Date(selDate.getFullYear(), selDate.getMonth()+1, 1); renderPicker(); });
        } else {
          const use12hEvt = localStorage.getItem("timeFormat12h") === "true";
          // 12/24h toggle buttons
          pkOv.querySelector("#fmt24btn")?.addEventListener("click", () => {
            localStorage.setItem("timeFormat12h", "false");
            renderPicker();
          });
          pkOv.querySelector("#fmt12btn")?.addEventListener("click", () => {
            localStorage.setItem("timeFormat12h", "true");
            renderPicker();
          });
          pkOv.querySelectorAll(".pk-hr").forEach(el => {
            el.addEventListener("click", () => {
              if (use12hEvt) {
                // Convert 12h display to 24h internal
                const h12 = parseInt(el.dataset.h);
                const isPM = selHour >= 12;
                selHour = isPM ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
              } else {
                selHour = parseInt(el.dataset.h);
              }
              renderPicker();
            });
          });
          pkOv.querySelectorAll(".pk-min").forEach(el => {
            el.addEventListener("click", () => { selMin = parseInt(el.dataset.m); renderPicker(); });
          });
          pkOv.querySelectorAll(".pk-ampm").forEach(el => {
            el.addEventListener("click", () => {
              const isPM = el.dataset.ap === "PM";
              if (isPM && selHour < 12) selHour += 12;
              else if (!isPM && selHour >= 12) selHour -= 12;
              renderPicker();
            });
          });
        }
      }

      renderPicker();
      if (!document.getElementById("dtPickerOverlay")) document.body.appendChild(pkOv);
    }

    const dateInp = document.getElementById("reminderCustomDate");
    const timeInp = document.getElementById("reminderCustomTime");
    const dateCard = document.getElementById("dateCard");
    const timeCard = document.getElementById("timeCard");
    const dateDisp = document.getElementById("dateDisplay");
    const timeDisp = document.getElementById("timeDisplay");
    const dateIcon = document.getElementById("dtDateIcon");
    const timeIcon = document.getElementById("dtTimeIcon");

    if (dateCard && dateInp) {
      dateCard.addEventListener("click", () => openPicker("date", dateCard, dateIcon));
      dateCard.addEventListener("touchend", (e) => { e.preventDefault(); openPicker("date", dateCard, dateIcon); });
      dateInp.addEventListener("change", () => {
        if (dateDisp) { dateDisp.textContent = fmtDate(dateInp.value); dateDisp.style.color = dateInp.value ? "var(--text)" : "var(--text-muted)"; }
      });
      if (dateDisp && dateInp.value) { dateDisp.textContent = fmtDate(dateInp.value); dateDisp.style.color = "var(--text)"; }
    }
    if (timeCard && timeInp) {
      timeCard.addEventListener("click", () => openPicker("time", timeCard, timeIcon));
      timeCard.addEventListener("touchend", (e) => { e.preventDefault(); openPicker("time", timeCard, timeIcon); });
      timeInp.addEventListener("change", () => {
        if (timeDisp) { timeDisp.textContent = fmtTime(timeInp.value); timeDisp.style.color = timeInp.value ? "var(--text)" : "var(--text-muted)"; }
      });
      if (timeDisp && timeInp.value) { timeDisp.textContent = fmtTime(timeInp.value); timeDisp.style.color = "var(--text)"; }
    }
  }
  setupDateTimeCards();

  // === ОБРАБОТЧИКИ ЧЕКБОКСОВ ИНТЕРВАЛОВ ===
  document.querySelectorAll(".reminder-interval-checkbox").forEach((cb) => {
    cb.addEventListener("change", () => {
      const val = cb.dataset.val;
      reminderIntervals[val] = cb.checked;
      localStorage.setItem(
        "reminderIntervals",
        JSON.stringify(reminderIntervals),
      );
      haptic("light");
      // Обновляем список активных интервалов
      const activeListDiv = document.getElementById("activeRemindersList");
      if (activeListDiv) {
        const activeIntervals = Object.entries(reminderIntervals)
          .filter(([_, v]) => v)
          .map(([k]) => {
            const labels = {
              "30min": "30 мин",
              "1h": "1 час",
              "2h": "2 часа",
              "5h": "5 часов",
              daily: "1 день",
              every3days: "3 дня",
              weekly: "1 неделя",
            };
            return labels[k] || k;
          });
        activeListDiv.textContent = activeIntervals.length
          ? activeIntervals.join(", ")
          : "Нет активных интервалов";
      }
    });
  });

  // === ТОЧНОЕ НАПОМИНАНИЕ ===
  document
    .getElementById("setCustomReminderBtn")
    ?.addEventListener("click", () => {
      const date = document.getElementById("reminderCustomDate").value;
      const time = document.getElementById("reminderCustomTime").value;
      const text = document.getElementById("reminderCustomText").value.trim();
      if (!date || !time) {
        showToast("Выберите дату и время", "error");
        return;
      }
      const combined = date + "T" + time;
      const targetTime = new Date(combined).getTime();
      if (targetTime <= Date.now()) {
        showToast("Время должно быть в будущем", "error");
        return;
      }
      customReminderDate = date;
      customReminderTime = time;
      customReminderText = text;
      customReminderTimestamp = targetTime;
      localStorage.setItem("customReminderDate", date);
      localStorage.setItem("customReminderTime", time);
      localStorage.setItem("customReminderText", text);
      localStorage.setItem("customReminderTimestamp", targetTime);

      if (customReminderTimeout) clearTimeout(customReminderTimeout);
      customReminderTimeout = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(text || t("remindersDesc"));
        } else {
          showToast("🔔 " + (text || t("remindersDesc")));
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
        renderSettings();
      }, targetTime - Date.now());

      showToast("✅ Напоминание установлено");
      renderSettings();
      haptic("success");
    });

  document
    .getElementById("clearCustomReminderBtn")
    ?.addEventListener("click", () => {
      customReminderDate = customReminderTime = customReminderText = "";
      customReminderTimestamp = null;
      [
        "customReminderDate",
        "customReminderTime",
        "customReminderText",
        "customReminderTimestamp",
      ].forEach((k) => localStorage.removeItem(k));
      if (customReminderTimeout) {
        clearTimeout(customReminderTimeout);
        customReminderTimeout = null;
      }
      showToast("🗑 Напоминание удалено");
      renderSettings();
      haptic("light");
    });

  // Отображение активных интервалов
  const activeListDiv = document.getElementById("activeRemindersList");
  if (activeListDiv) {
    const activeIntervals = Object.entries(reminderIntervals)
      .filter(([_, v]) => v)
      .map(([k]) => {
        const labels = {
          "30min": "30 мин",
          "1h": "1 час",
          "2h": "2 часа",
          "5h": "5 часов",
          daily: "1 день",
          every3days: "3 дня",
          weekly: "1 неделя",
        };
        return labels[k] || k;
      });
    activeListDiv.textContent = activeIntervals.length
      ? activeIntervals.join(", ")
      : "Нет активных интервалов";
  }

  // Валюта
  document.getElementById("currencySelect").value = displayCurrency;
  document.getElementById("currencySelect").onchange = (e) => {
    displayCurrency = e.target.value;
    saveAll();
    updateTopBlocks();
    showToast(t("currencyChanged"));
  };
  // Тема
  document.getElementById("themeSelect").value =
    localStorage.getItem("theme") || "light";
  document.getElementById("themeSelect").onchange = (e) => {
    document.body.className = e.target.value;
    localStorage.setItem("theme", e.target.value);
    showToast(t("themeChanged"));
  };
  // Язык
  document.getElementById("langSelect").value = currentLang;
  document.getElementById("langSelect").onchange = (e) =>
    setLanguage(e.target.value);

  // Пин
  document.getElementById("pinToggle").addEventListener("change", async (e) => {
    if (e.target.checked) openPinSetModal();
    else {
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

  // Бюджеты
  document
    .getElementById("addBudgetBtn")
    .addEventListener("click", openAddBudgetModal);

  // Повторяющиеся
  document
    .getElementById("addRecurringBtn")
    .addEventListener("click", openAddRecurringModal);

  // Управление шаблонами — удаление
  document
    .getElementById("templatesBody")
    .querySelectorAll(".tpl-delete-btn")
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
    document.getElementById("refreshRatesBtn").textContent =
      "🔄 " + t("updateRates");
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

  // Напоминания
  const rt = document.getElementById("remindersToggle"),
    rid = document.getElementById("remindersIntervalDiv"),
    ris = document.getElementById("remindersIntervalSelect");
  // ── Notification enable/disable button (mobile-safe) ──
  document.getElementById("notifHelpBtn")?.addEventListener("click", openNotificationHelpModal);

  document.getElementById("notifEnableBtn")?.addEventListener("click", function() {
    // ── Update DOM in-place (no renderSettings() — avoids scroll reset) ──
    function updateNotifUI(enabled) {
      remindersEnabled = enabled;
      saveReminderSettings();
      // Update interval div visibility immediately
      const ridEl = document.getElementById("remindersIntervalDiv");
      if (ridEl) ridEl.style.display = enabled ? "block" : "none";
      // Update button text in-place
      const btn = document.getElementById("notifEnableBtn");
      if (btn) {
        const L = { ru:["Включить напоминания","Выключить напоминания"], en:["Enable reminders","Disable reminders"], ka:["შეხსენებების ჩართვა","შეხსენებების გამორთვა"] }[currentLang]||["Enable","Disable"];
        btn.textContent = "🔔 " + (enabled ? L[1] : L[0]);
        btn.style.background = enabled ? "var(--expense-color)" : "";
      }
      // Update status block
      const statusEl = document.getElementById("notifStatusBlock");
      if (statusEl) {
        statusEl.style.background = enabled ? "var(--income-pale)" : "var(--cream-dark)";
        statusEl.style.border = "1.5px solid " + (enabled ? "var(--income-color)" : "var(--cream-border)");
        const iconEl = statusEl.querySelector("div:first-child");
        if (iconEl) iconEl.textContent = enabled ? "🔔" : "🔕";
        const titleEl = statusEl.querySelector("[data-notif-title]");
        if (titleEl) titleEl.textContent = enabled ? {ru:"Напоминания включены",en:"Reminders enabled",ka:"შეხსენებები ჩართულია"}[currentLang] : {ru:"Напоминания выключены",en:"Reminders disabled",ka:"შეხსენებები გამორთულია"}[currentLang];
      }
    }

    if (!("Notification" in window)) {
      const L = {ru:"Используйте Chrome для уведомлений. Откройте сайт в Google Chrome.",en:"Use Chrome for notifications. Open the site in Google Chrome.",ka:"Chrome გამოიყენეთ. გახსენით Google Chrome-ში."};
      showToast(L[currentLang]||L.ru, "error");
      return;
    }
    // Toggle off
    if (remindersEnabled) {
      stopReminderTimer();
      updateNotifUI(false);
      showToast(t("remindersDisabled"));
      return;
    }
    // Already granted
    if (Notification.permission === "granted") {
      startReminderTimer();
      updateNotifUI(true);
      try { new Notification("🔔 БюджетPRO", { body: {ru:"Напоминания включены!",en:"Reminders enabled!",ka:"შეხსენებები ჩართულია!"}[currentLang]||"OK", icon:"/BudgetPro/favicon-96x96.png" }); } catch(e){}
      showToast(t("remindersPermissionGranted"), "success");
      return;
    }
    // Blocked
    if (Notification.permission === "denied") {
      openNotificationHelpModal();
      return;
    }
    // Show pending state on button
    const pendingBtn = document.getElementById("notifEnableBtn");
    if (pendingBtn) { pendingBtn.textContent = "⏳ " + {ru:"Ожидайте запроса...",en:"Waiting for prompt...",ka:"დაელოდეთ..."}[currentLang]; pendingBtn.disabled = true; }

    // Request permission — MUST be called synchronously from click handler
    // Use callback API first (broadest mobile support), fall back to Promise
    let requested = false;
    try {
      // Modern browsers return Promise
      const result = Notification.requestPermission();
      if (result && typeof result.then === "function") {
        requested = true;
        result.then(p => {
          if (pendingBtn) { pendingBtn.disabled = false; }
          if (p === "granted") {
            startReminderTimer();
            updateNotifUI(true);
            try { new Notification("🔔 БюджетPRO", { body: {ru:"Отлично! Напоминания работают.",en:"Great! Reminders are working.",ka:"მშვენიერია! შეხსენებები მუშაობს."}[currentLang], icon:"/BudgetPro/favicon-96x96.png" }); } catch(e){}
            showToast(t("remindersPermissionGranted"), "success");
          } else if (p === "denied") {
            openNotificationHelpModal();
          } else {
            showToast({ru:"Запрос отклонён. Попробуйте снова.",en:"Request dismissed. Try again.",ka:"უარყოფილია. სცადეთ ხელახლა."}[currentLang], "error");
            if (pendingBtn) { pendingBtn.textContent = "🔔 " + {ru:"Включить напоминания",en:"Enable reminders",ka:"შეხსენებების ჩართვა"}[currentLang]; }
          }
        }).catch(() => {
          if (pendingBtn) { pendingBtn.disabled = false; pendingBtn.textContent = "🔔 " + {ru:"Включить напоминания",en:"Enable reminders",ka:"შეხსენებების ჩართვა"}[currentLang]; }
          showToast({ru:"Ошибка. Обновите страницу и попробуйте снова.",en:"Error. Refresh the page and try again.",ka:"შეცდომა. გვერდი განაახლეთ."}[currentLang], "error");
        });
      }
    } catch(e) {}

    if (!requested) {
      // Older browsers — callback API
      try {
        Notification.requestPermission(function(p) {
          if (pendingBtn) pendingBtn.disabled = false;
          if (p === "granted") {
            startReminderTimer(); updateNotifUI(true);
            showToast(t("remindersPermissionGranted"), "success");
          } else {
            if (p === "denied") openNotificationHelpModal();
            if (pendingBtn) pendingBtn.textContent = "🔔 " + {ru:"Включить напоминания",en:"Enable reminders",ka:"შეხსენებების ჩართვა"}[currentLang];
          }
        });
      } catch(e2) {
        if (pendingBtn) { pendingBtn.disabled = false; pendingBtn.textContent = "🔔 " + {ru:"Включить напоминания",en:"Enable reminders",ka:"შეხსენებების ჩართვა"}[currentLang]; }
        showToast({ru:"Уведомления не поддерживаются",en:"Notifications not supported",ka:"შეტყობინებები მხარდაუჭერელია"}[currentLang], "error");
      }
    }
  });

  if (rt) {
    rt.addEventListener("change", function() {
      // CRITICAL: must be called synchronously from user gesture on mobile
      const checked = this.checked;

      function onPermGranted() {
        remindersEnabled = true;
        saveReminderSettings();
        startReminderTimer();
        if (rid) rid.style.display = "block";
        // Test notification
        try { new Notification("🔔 БюджетPRO", { body: { ru:"Уведомления включены!",en:"Notifications enabled!",ka:"შეტყობინებები ჩართულია!" }[currentLang]||"Notifications enabled!", icon:"/BudgetPro/favicon-96x96.png" }); } catch(e){}
        showToast(t("remindersPermissionGranted"), "success");
      }

      function onPermDenied(reason) {
        remindersEnabled = false;
        saveReminderSettings();
        rt.checked = false;
        if (rid) rid.style.display = "none";
        if (reason === "denied") {
          openNotificationHelpModal();
        } else {
          const L = {ru:"Нажмите «Разрешить» в запросе браузера",en:"Tap 'Allow' in the browser prompt",ka:"ბრაუზერის მოთხოვნაში 'Allow' დააჭირეთ"};
          showToast(L[currentLang]||L.ru, "error");
        }
      }

      if (!checked) {
        remindersEnabled = false;
        saveReminderSettings();
        stopReminderTimer();
        if (rid) rid.style.display = "none";
        showToast(t("remindersDisabled"));
        return;
      }

      // Check API support
      if (!("Notification" in window)) {
        const L = {ru:"Используйте Chrome для уведомлений",en:"Use Chrome for notifications",ka:"Chrome გამოიყენეთ შეტყობინებებისთვის"};
        showToast(L[currentLang]||L.ru, "error");
        rt.checked = false;
        return;
      }

      if (Notification.permission === "granted") {
        onPermGranted();
        return;
      }

      if (Notification.permission === "denied") {
        onPermDenied("denied");
        return;
      }

      // "default" — request permission DIRECTLY from user gesture (synchronous call)
      // This is the only way that works on mobile browsers
      try {
        const result = Notification.requestPermission();
        // If it returns a Promise (modern browsers)
        if (result && typeof result.then === "function") {
          result.then(p => {
            if (p === "granted") onPermGranted();
            else onPermDenied(p);
          }).catch(() => onPermDenied("error"));
        } else {
          // Old callback style (some mobile Safari)
          Notification.requestPermission(function(p) {
            if (p === "granted") onPermGranted();
            else onPermDenied(p);
          });
        }
      } catch(err) {
        // Absolute fallback — show button that user must tap
        rt.checked = false;
        const L = {ru:"Нажмите кнопку ниже для включения уведомлений",en:"Tap the button below to enable notifications",ka:"ქვემოთ ღილაკს დააჭირეთ"};
        showToast(L[currentLang]||L.ru, "info");
        // Show a standalone button that explicitly triggers permission
        const permBtn = document.createElement("button");
        permBtn.className = "btn-primary";
        permBtn.style.cssText = "position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:9999;padding:14px 28px;border-radius:24px;font-size:15px;font-weight:800;box-shadow:0 8px 24px rgba(45,106,79,0.4);white-space:nowrap;";
        permBtn.textContent = "🔔 " + ({ru:"Разрешить уведомления",en:"Allow Notifications",ka:"ნება მიეცი"}[currentLang]||"Allow Notifications");
        permBtn.addEventListener("click", () => {
          permBtn.remove();
          Notification.requestPermission().then(p => {
            if (p === "granted") { rt.checked = true; onPermGranted(); }
            else onPermDenied(p);
          });
        });
        document.body.appendChild(permBtn);
        setTimeout(() => permBtn.remove(), 8000);
      }
    });
  }
  if (ris) {
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
  // REMINDER INTERVAL BUTTONS
  // ============================================================
  document.querySelectorAll(".reminder-interval-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      remindersInterval = btn.dataset.val;
      saveReminderSettings();
      if (remindersEnabled) {
        stopReminderTimer();
        startReminderTimer();
      }
      renderSettings();
    });
  });

  // ============================================================
  // РАЗМЕР ШРИФТА
  // ============================================================
  document.querySelectorAll(".font-size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyFontSize(btn.dataset.size);
      haptic("light");
      renderSettings();
    });
  });

  // ============================================================
  // ДОСТУПНОСТЬ
  // ============================================================
  document
    .getElementById("simpleModeToggle")
    ?.addEventListener("change", (e) => {
      applySimpleMode(e.target.checked);
      showToast(e.target.checked ? t("simpleModeOn") : t("simpleModeOff"));
      renderSettings();
    });
  document
    .getElementById("animationsToggle")
    ?.addEventListener("change", (e) => {
      animationsEnabled = e.target.checked;
      localStorage.setItem("animationsEnabled", animationsEnabled);
      showToast(t("saved"));
    });
  document.getElementById("hapticToggle")?.addEventListener("change", (e) => {
    hapticEnabled = e.target.checked;
    localStorage.setItem("hapticEnabled", hapticEnabled);
    if (hapticEnabled) haptic("medium");
    showToast(t("saved"));
  });
  // ── Advanced features toggles ──
  document.getElementById("showVoiceBtnToggle")?.addEventListener("change", function() {
    localStorage.setItem("showVoiceBtn", this.checked ? "true" : "false");
    addVoiceButton();
    haptic("light");
    showToast(t("saved"));
  });
  document.getElementById("showGoalsBtnToggle")?.addEventListener("change", function() {
    localStorage.setItem("showGoalsBtn", this.checked ? "true" : "false");
    addGoalsNavButton();
    haptic("light");
    showToast(t("saved"));
  });
  document.getElementById("time12hToggle")?.addEventListener("change", function() {
    localStorage.setItem("timeFormat12h", this.checked ? "true" : "false");
    haptic("light");
    showToast({ru:"Формат времени изменён",en:"Time format changed",ka:"დროის ფორმატი შეიცვალა"}[currentLang], "success");
  });
  document.getElementById("voiceDirectBtn")?.addEventListener("click", () => {
    haptic("medium"); startVoiceInput();
  });
  document.getElementById("goalsDirectBtn")?.addEventListener("click", () => {
    haptic("medium"); openGoalsModal();
  });
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
  const supportBtn = document.getElementById("openSupportBtn");
  if (supportBtn) {
    supportBtn.onclick = () => openSupportModal();
  }

  // ============================================================
  // БИОМЕТРИЯ
  // ============================================================
  (async () => {
    if (!document.getElementById("biometryCard")) return;
    const avail = await isBiometryAvailable();
    const se = document.getElementById("bioStatusText");
    if (se) {
      se.textContent = avail
        ? t("biometrySupported")
        : t("biometryNotSupported");
      if (avail) se.style.color = "var(--income-color)";
    }
    const bt = document.getElementById("biometryToggle");
    if (bt) {
      if (!avail) {
        bt.disabled = true;
        bt.parentElement.style.opacity = "0.5";
      }
      bt.addEventListener("change", async (e) => {
        if (e.target.checked) {
          if (!avail) {
            showToast(t("biometryNotSupported"), "error");
            e.target.checked = false;
            return;
          }
          const ok = await biometryRegister();
          if (ok) {
            biometryEnabled = true;
            saveAll();
            showToast("✅ " + t("biometrySupported"));
            setTimeout(() => renderSettings(), 300);
          } else {
            showToast("Ошибка", "error");
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

  // ============================================================
  // ПРОФИЛИ
  // ============================================================
  const pbEl = document.getElementById("profilesBody");
  if (pbEl) {
    pbEl
      .querySelectorAll("[data-switchpid]")
      .forEach((b) =>
        b.addEventListener("click", () => switchProfile(b.dataset.switchpid)),
      );
    pbEl.querySelectorAll("[data-sharepid]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = profiles.find((x) => x.id === b.dataset.sharepid);
        if (p) openShareModal(p);
      }),
    );
    pbEl.querySelectorAll("[data-renamepid]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = profiles.find((x) => x.id === b.dataset.renamepid);
        if (p) openProfileEditModal(p);
      }),
    );
    document
      .getElementById("addProfileBtn")
      ?.addEventListener("click", () => openProfileEditModal(null));
    document
      .getElementById("connectProfileBtn")
      ?.addEventListener("click", () => openConnectModal());

    // Обработчик кнопки выхода из гостевого режима (для создателя)
    const exitGuestBtn = document.getElementById("exitGuestModeBtn");
    if (exitGuestBtn) {
      exitGuestBtn.addEventListener("click", () => {
        exitGuestMode();
      });
    }

    // Обработчик кнопки возврата в локальный профиль (для обычного гостя)
    const backBtn = document.getElementById("backToLocalProfileBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        // Находим локальный профиль гостя (guestCreated)
        let localProf = profiles.find((p) => p.guestCreated === true);
        if (!localProf) {
          // Создаём, если нет
          const newId = "guest_local_" + Date.now();
          localProf = {
            id: newId,
            name: "Мой профиль",
            emoji: "👤",
            color: "#2d6a4f",
            role: "user",
            guestCreated: true,
          };
          profiles.push(localProf);
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
        // Выходим из гостевого режима и переключаемся на локальный профиль
        sharedAccessProfile = null;
        saveGlobal();
        switchProfile(localProf.id);
        showToast("🏠 Вы в своём профиле");
      });
    }

    // Обработчик кнопки возврата в главный профиль (для создателя)
    const backToMainBtn = document.getElementById("backToMainProfileBtn");
    if (backToMainBtn) {
      backToMainBtn.addEventListener("click", () => {
        const mainProfile = profiles.find((p) => p.id === "default");
        if (mainProfile) {
          switchProfile(mainProfile.id);
        } else {
          showToast("Главный профиль не найден", "error");
        }
      });
    }
  }
  // Theme swatches
  document.querySelectorAll(".theme-swatch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyColorTheme(btn.dataset.theme);
      showToast(
        "🎨 " + (tObj("themeLabels")[btn.dataset.theme] || btn.dataset.theme),
      );
      setTimeout(() => renderSettings(), 300);
    });
  });
  document.getElementById("resetThemeBtn")?.addEventListener("click", () => {
    applyColorTheme("default");
    showToast("🔄 " + t("resetThemeBtn"));
    setTimeout(() => renderSettings(), 300);
  });

  // Reminder mode toggle
  document
    .getElementById("reminderModeToggle")
    ?.addEventListener("change", (e) => {
      reminderMode = e.target.checked ? "datetime" : "interval";
      localStorage.setItem("reminderMode", reminderMode);
      const im = document.getElementById("reminderIntervalMode");
      const dm = document.getElementById("reminderDatetimeMode");
      if (im) im.style.display = reminderMode === "interval" ? "block" : "none";
      if (dm) dm.style.display = reminderMode === "datetime" ? "block" : "none";
    });
  // Quick time presets
  document.querySelectorAll(".quick-time-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ti = document.getElementById("reminderTimeInput");
      if (ti) ti.value = btn.dataset.time;
    });
  });
  // Set datetime reminder
  document
    .getElementById("setReminderDatetimeBtn")
    ?.addEventListener("click", () => {
      const di = document.getElementById("reminderDateInput"),
        ti = document.getElementById("reminderTimeInput");
      if (!di?.value) {
        showToast(
          { ru: "Выберите дату", en: "Choose date", ka: "აირჩიეთ თარიღი" }[
            currentLang
          ],
          "error",
        );
        return;
      }
      const combined = di.value + "T" + (ti?.value || "09:00");
      const dt = new Date(combined),
        ms = dt.getTime() - Date.now();
      if (ms <= 0) {
        showToast(
          {
            ru: "Выберите будущее время",
            en: "Choose future time",
            ka: "მომავლის დრო",
          }[currentLang],
          "error",
        );
        return;
      }
      customReminderDatetime = combined;
      localStorage.setItem("customReminderDatetime", combined);
      if (reminderTimer) clearTimeout(reminderTimer);
      reminderTimer = setTimeout(() => {
        if (Notification?.permission === "granted") {
          new Notification(t("appName"), {
            body: t("remindersDesc"),
            icon: "/icon-192.png",
          });
        } else {
          showToast("🔔 " + t("remindersDesc"));
        }
        customReminderDatetime = "";
        localStorage.removeItem("customReminderDatetime");
        reminderTimer = null;
      }, ms);
      showToast(
        "⏰ " +
          dt.toLocaleString(
            currentLang === "ka"
              ? "ka-GE"
              : currentLang === "en"
                ? "en-US"
                : "ru-RU",
          ),
      );
      haptic("success");
      renderSettings();
    });
  // Clear datetime reminder
  document
    .getElementById("clearReminderDatetimeBtn")
    ?.addEventListener("click", () => {
      customReminderDatetime = "";
      localStorage.removeItem("customReminderDatetime");
      if (reminderTimer) {
        clearTimeout(reminderTimer);
        reminderTimer = null;
      }
      showToast(
        { ru: "Напоминание удалено", en: "Reminder cleared", ka: "წაიშალა" }[
          currentLang
        ],
      );
      renderSettings();
    });
  // Template edit + delete (by index)
  document
    .getElementById("templatesBody")
    ?.querySelectorAll("[data-edittplid]")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        openEditTemplateModal(parseInt(btn.dataset.edittplid)),
      );
    });
  document
    .getElementById("templatesBody")
    ?.querySelectorAll("[data-tplid]")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        askConfirm(
          t("deleteTemplate"),
          () => {
            userTemplates.splice(parseInt(btn.dataset.tplid), 1);
            saveAll();
            renderSettings();
            showToast(t("deleted"));
          },
          { icon: "🗑️" },
        ),
      );
    });
  document
    .getElementById("addTemplateBtn")
    ?.addEventListener("click", () => openAddModal());
  // Theme swatches (re-register after renderSettings)
  document.querySelectorAll(".theme-swatch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyColorTheme(btn.dataset.theme);
      const b = document.getElementById("themeToggle");
      if (b)
        b.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
      showToast("🎨 " + btn.dataset.theme);
      setTimeout(() => renderSettings(), 200);
    });
  });
  document.getElementById("resetThemeBtn")?.addEventListener("click", () => {
    _creatorTaps++;
    if (_creatorTapTimer) clearTimeout(_creatorTapTimer);
    _creatorTapTimer = setTimeout(() => {
      _creatorTaps = 0;
    }, 2500);
    if (_creatorTaps >= 7) {
      _creatorTaps = 0;
      const ov = document.createElement("div");
      ov.style.cssText =
        "position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);";
      ov.innerHTML = `<div style="background:var(--cream);border-radius:24px;padding:28px 24px;max-width:320px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4);animation:fadeUp .3s ease both;">
        <div style="font-size:42px;margin-bottom:12px;">🔐</div>
        <div style="font-size:18px;font-weight:900;color:var(--text);margin-bottom:6px;">Код создателя</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">Введите секретный промокод</div>
        <input type="password" id="_codeIn" style="width:100%;padding:13px;border-radius:12px;border:2px solid var(--cream-border);background:var(--cream-dark);font-size:18px;text-align:center;letter-spacing:4px;margin-bottom:10px;outline:none;font-family:inherit;" placeholder="••••••••" autofocus>
        <div id="_codeErr" style="color:var(--expense-color);font-size:13px;min-height:20px;margin-bottom:12px;"></div>
        <div style="display:flex;gap:10px;">
          <button onclick="this.closest('[style*=fixed]').remove();" style="flex:1;padding:13px;border-radius:12px;border:1.5px solid var(--cream-border);background:var(--cream-dark);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Отмена</button>
          <button id="_codeOk" style="flex:1;padding:13px;border-radius:12px;border:none;background:var(--gold);color:white;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;">👑 Войти</button>
        </div>
      </div>`;
      document.body.appendChild(ov);
      const inp = ov.querySelector("#_codeIn"),
        errEl = ov.querySelector("#_codeErr");
      const tryCode = () => {
        if (inp.value === CREATOR_SECRET) {
          localStorage.setItem("budgetpro_creator_key", CREATOR_SECRET);
          ov.remove();
          showToast("👑 Режим создателя активирован!");
          haptic("success");
          setTimeout(() => openSupportModal(), 400);
        } else {
          errEl.textContent = "❌ Неверный код";
          inp.value = "";
          inp.focus();
          haptic("heavy");
          setTimeout(() => (errEl.textContent = ""), 2000);
        }
      };
      ov.querySelector("#_codeOk").addEventListener("click", tryCode);
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") tryCode();
      });
    } else {
      applyColorTheme("default");
      const b = document.getElementById("themeToggle");
      if (b) b.textContent = "🌙";
      showToast("🔄 " + t("resetThemeBtn"));
      setTimeout(() => renderSettings(), 200);
    }
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
    ms = new Date(now); ms.setDate(now.getDate() - day); ms.setHours(0,0,0,0);
  } else if (budgetPeriod === "daily") {
    ms = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else {
    ms = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  const periodL = {
    monthly: { ru:"Месяц", en:"Month", ka:"თვე" },
    weekly:  { ru:"Неделя", en:"Week", ka:"კვირა" },
    daily:   { ru:"День", en:"Day", ka:"დღე" },
  };
  const pl = (periodL[budgetPeriod]||periodL.monthly)[currentLang];
  const periodHeader = `<div style="display:flex;gap:8px;margin-bottom:14px;background:var(--cream-dark);padding:4px;border-radius:var(--radius-sm);">
    ${["monthly","weekly","daily"].map(p => `<button data-bp="${p}" style="flex:1;padding:8px 6px;border-radius:calc(var(--radius-sm) - 4px);border:none;font-size:12px;font-weight:800;cursor:pointer;transition:all 0.2s;background:${p===budgetPeriod?"var(--primary)":"transparent"};color:${p===budgetPeriod?"white":"var(--text-muted)"};">${(periodL[p]||{})[currentLang]}</button>`).join("")}
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
      ${over ? `<div style="font-size:11px;color:var(--expense-color);font-weight:700;margin-top:2px;">${t("budgetOverLimit")}</div>` : ""}
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
  });
}

function openAddBudgetModal() {
  const cats = Object.keys(categories).filter((c) => !categoryBudgets[c]);
  if (!cats.length) {
    showToast("Все категории уже имеют бюджет");
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
  showToast("✅ JSON экспортирован");
}
function importFromJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const d = JSON.parse(e.target.result);
      if (!d.transactions || !d.categories) {
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
          if (d.pinHash) {
            pinHash = d.pinHash;
            pinEnabled = d.pinEnabled || false;
          }
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
  showToast("✅ PDF-отчёт сохранён как HTML (откройте и напечатайте)");
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
    showToast("✅ Файл сохранён");
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
      showToast("✅ Данные загружены из облака");
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
  const now = Date.now();
  for (const [interval, active] of Object.entries(reminderIntervals)) {
    if (!active) continue;
    const lastKey = `lastReminder_${interval}`;
    const last = localStorage.getItem(lastKey);
    let should = false;
    const ms = getIntervalMs(interval);
    if (!last) should = true;
    else if (now - parseInt(last) >= ms) should = true;
    if (should) {
      new Notification(t("appName"), {
        body: t("remindersDesc"),
        icon: "favicon-96x96.png",
        tag: "budget-reminder",
      });
      localStorage.setItem(lastKey, now);
    }
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
function startGuide() {
  guideSteps = t("guideSteps");
  if (!guideSteps?.length) return;

  // Переключаемся на главную вкладку
  setTab("home");

  // Ждём завершения рендеринга и прокручиваем вверх
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      curGuideStep = 0;
      showGuideStep(0);
    }, 300);
  }, 200);
}
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
  ov.className = "modal-overlay";
  ov.id = id;
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
    m.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove("open");
    setTimeout(() => m.remove(), 350);
    document.body.style.overflow = "";
  }
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
loadAll();

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

function init() {
  applyTranslations();
  updateTopBlocks();
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
  const tb = document.getElementById("themeToggle");
  if (tb)
    tb.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  // ── HAPTIC EVERYWHERE ──
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => haptic("light"), { passive: true });
  });
  document.querySelectorAll(".summary-card").forEach((card) => {
    card.addEventListener("click", () => {
      haptic("light");
      const type = card.dataset.type;
      if (type === "salary") {
        openSalaryModal();
        return;
      }
      if (type === "income" || type === "expense") {
        currentFilter = type;
        if (currentTab !== "home") setTab("home");
        else {
          renderBalanceSummary();
          renderOpsList();
        }
        setTimeout(() => {
          let el;
          if (simpleMode) {
            el = document.getElementById("simpleOpsContainer");
          } else {
            el =
              document.querySelector(".ops-list") ||
              document.getElementById("opsList");
          }
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          showToast(
            type === "income"
              ? t("toastIncomeFilter")
              : t("toastExpenseFilter"),
            "success",
          );
        }, 200);
      } else {
        if (currentFilter !== null) {
          currentFilter = null;
          if (currentTab === "home") renderOpsList();
        } else if (currentTab !== "home") setTab("home");
      }
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") card.click();
    });
  });
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => setTab(btn.dataset.tab)),
    );
  document.getElementById("fabBtn").addEventListener("click", openAddModal);
  setTab("home");

  // ==== ОБНОВЛЕНИЕ КУРСОВ ВАЛЮТ ====
  updateExchangeRates(); // обновить при запуске
  setInterval(updateExchangeRates, 3600000); // каждый час

  // ==== ПРОВЕРКА ФЛАГА НОВЫХ СООБЩЕНИЙ ПРИ ЗАГРУЗКЕ ====
  const checkSupportFlag = () => {
    if (
      localStorage.getItem("has_new_support_messages") === "true" &&
      isCreator()
    ) {
      setTimeout(() => {
        showToast("📬 У вас новые сообщения от пользователей", "success", 3000);
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
        showToast("📬 У вас новые сообщения от пользователей", "success", 3000);
        localStorage.removeItem("has_new_support_messages");
      }, 300);
    }
  });
}

if (pinEnabled && pinHash) {
  showPinScreen(init);
} else {
  init();
}

if (pinEnabled && pinHash) {
  showPinScreen(init);
} else {
  init();
}
function applySimpleMode(on) {
  simpleMode = !!on;
  localStorage.setItem("simpleMode", simpleMode ? "true" : "false");
  document.body.classList.toggle("simple-mode", simpleMode);
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
  if (currentTab === "home") renderHome();
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
const HARDCODED_APP_URL = "https://motserelia.github.io/BudgetPro/";
function getAppUrl() {
  // 1. User override in localStorage (explicit save wins, including empty = auto)
  const stored = localStorage.getItem("budgetpro_app_url");
  if (stored !== null && stored.trim()) return stored.trim();
  // If stored is empty string, fall through to auto-detect
  if (stored === null) {
    // Never saved — auto-set from current location
  }
  // 2. Auto-detect from current location (works on GitHub Pages / Netlify / etc.)
  if (window.location.protocol.startsWith("http") && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    const u = window.location.origin + window.location.pathname.replace(/\/[^\/]*\.[^\/]*$/, "/").replace(/\/?$/, "/");
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
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>БюджетPRO — Приглашение</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;margin:0;padding:20px;box-sizing:border-box;}.card{background:#fff;border-radius:24px;padding:32px 24px;max-width:360px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.12)}.avatar{width:80px;height:80px;border-radius:50%;background:${prof.color || "#2d6a4f"};display:flex;align-items:center;justify-content:center;font-size:44px;margin:0 auto 20px}.btn{display:block;width:100%;padding:18px;background:${prof.color || "#2d6a4f"};color:#fff;border:none;border-radius:99px;font-size:18px;font-weight:800;cursor:pointer;text-decoration:none;margin-top:20px;font-family:inherit;}</style></head><body><div class="card"><div class="avatar">${prof.emoji || "👤"}</div><h2 style="font-size:22px;font-weight:900;margin:0 0 8px;">Вас приглашают!</h2><p style="color:#666;font-size:15px;margin:0 0 20px;">Профиль в БюджетPRO: «${(prof.name || "").replace(/</g, "&lt;")}»</p><a class="btn" href="${appUrl}#share=${encoded}">🚀 Открыть профиль</a></div></body></html>`;
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
            showToast("📄 " + LL.download);
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
async function showShareWelcomeScreen(pkg) {
  // Detect language: use stored lang or browser lang
  const lang = localStorage.getItem("lang") || (navigator.language || "ru").slice(0,2) || "ru";
  const LL = {
    ru: { guestMode:"👤 Гостевой режим", shareWelcome:"Вас приглашают в профиль", join:"Войти в профиль →", cancel:"Отмена", locked:"🔒 Профиль заблокирован владельцем", pwdPh:"Введите пароль", pwdErr:"Неверный пароль", loading:"⏳ Подключение..." },
    en: { guestMode:"👤 Guest mode", shareWelcome:"You are invited to a profile", join:"Enter profile →", cancel:"Cancel", locked:"🔒 Profile is locked by owner", pwdPh:"Enter password", pwdErr:"Wrong password", loading:"⏳ Connecting..." },
    ka: { guestMode:"👤 სტუმრის რეჟიმი", shareWelcome:"გიწვევენ პროფილში", join:"პროფილში შესვლა →", cancel:"გაუქმება", locked:"🔒 პროფილი დაბლოკილია მფლობელის მიერ", pwdPh:"შეიყვანეთ პაროლი", pwdErr:"არასწორი პაროლი", loading:"⏳ დაკავშირება..." },
  };
  const lc = LL[lang] || LL[currentLang] || LL.ru;
  const ov = document.createElement("div");
  ov.id = "shareWelcomeOverlay";
  ov.style.cssText = "position:fixed;inset:0;background:var(--cream);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px 24px;animation:fadeIn 0.3s ease both;";
  const profileColor = pkg.pcolor || "#2d6a4f";

  ov.innerHTML = `
    <div style="width:88px;height:88px;border-radius:50%;background:${profileColor};display:flex;align-items:center;justify-content:center;font-size:48px;box-shadow:0 8px 32px ${profileColor}55;animation:pulse 2s infinite;">${pkg.pemoji || "👤"}</div>
    <div style="font-size:13px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;">${lc.guestMode}</div>
    <div style="font-size:22px;font-weight:900;text-align:center;">${lc.shareWelcome}</div>
    <div style="font-size:20px;font-weight:800;color:${profileColor};text-align:center;">«${esc(pkg.pname || "")}»</div>

    ${pkg.locked ? `
      <div style="font-size:16px;font-weight:800;color:var(--expense-color);text-align:center;">${lc.locked}</div>
      <button id="shareWelcomeCancel" style="background:var(--cream-dark);border:1.5px solid var(--cream-border);border-radius:99px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;">${lc.cancel}</button>
    ` : `
      ${pkg.hasPwd ? `
        <div style="max-width:320px;width:100%;">
          <input type="password" id="shareLinkPwdIn" placeholder="${lc.pwdPh}" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid var(--cream-border);background:var(--card-bg);font-size:20px;text-align:center;letter-spacing:4px;font-family:inherit;outline:none;transition:border-color 0.2s;">
          <div id="sharePwdErrDiv" style="color:var(--expense-color);font-size:13px;text-align:center;margin-top:6px;min-height:18px;font-weight:700;"></div>
        </div>
      ` : ""}
      <button id="joinProfileBtn" style="background:${profileColor};color:white;border:none;border-radius:99px;padding:18px 36px;font-size:18px;font-weight:900;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px ${profileColor}44;transition:all 0.2s;">${lc.join}</button>
      <button id="shareWelcomeCancel" style="background:var(--cream-dark);border:1.5px solid var(--cream-border);border-radius:99px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">${lc.cancel}</button>

      <!-- Language switcher on welcome screen -->
      <div style="display:flex;gap:8px;margin-top:4px;">
        ${["ru","en","ka"].map(l => `<button class="sw-lang-btn" data-lang="${l}" style="width:36px;height:36px;border-radius:50%;border:2px solid ${l===lang?"var(--primary)":"var(--cream-border)"};background:${l===lang?"var(--primary)":"var(--cream-dark)"};color:${l===lang?"white":"var(--text-muted)"};cursor:pointer;font-size:16px;transition:all 0.2s;">${l==="ru"?"🇷🇺":l==="en"?"🇬🇧":"🇬🇪"}</button>`).join("")}
      </div>
    `}
  `;

  document.body.appendChild(ov);

  // Cancel buttons
  document.querySelectorAll("#shareWelcomeCancel").forEach(btn => {
    btn.addEventListener("click", () => { ov.remove(); init(); });
  });

  // Language switch on welcome screen
  document.querySelectorAll(".sw-lang-btn").forEach(btn => {
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

  joinBtn.addEventListener("mouseenter", () => { joinBtn.style.transform = "scale(1.04) translateY(-2px)"; });
  joinBtn.addEventListener("mouseleave", () => { joinBtn.style.transform = ""; });

  joinBtn.addEventListener("click", async () => {
    if (pkg.hasPwd && pkg.pwHash) {
      const entered = pwdIn?.value || "";
      if (!entered) { document.getElementById("sharePwdErrDiv").textContent = lc.pwdPh; return; }
      const h = await hashSharePwd(entered);
      if (h !== pkg.pwHash) { document.getElementById("sharePwdErrDiv").textContent = lc.pwdErr; pwdIn.style.borderColor="var(--expense-color)"; setTimeout(()=>pwdIn.style.borderColor="",1200); return; }
    }
    joinBtn.textContent = lc.loading;
    joinBtn.disabled = true;

    const newId = "shared_" + pkg.shareId;
    let prof = profiles.find((p) => p.id === newId);
    if (!prof) {
      prof = { id: newId, name: pkg.pname || "Shared", emoji: pkg.pemoji || "👤", color: pkg.pcolor || "#2563eb", isShared: true, shareCode: pkg.shareId, sharePerms: pkg.perms || { ...DEFAULT_PERMS } };
      profiles.push(prof);
    }
    // SECURITY: Force role to "guest" — never allow owner/creator role via share link
    prof.role = "guest";
    // Clear any creator settings from localStorage for this session context
    // (creator settings are device-local, not transferred via link)
    const empty = { transactions:[], startBalanceRub:0, notebookPages:[], categories:JSON.parse(JSON.stringify(window.initialCategories||{})), incomeCategories:{Зарплата:{subcats:[]},Подарок:{subcats:[]},Фриланс:{subcats:[]}}, calcHistory:[], convHistory:[], userTemplates:[], frequentStats:{}, categoryCustomizations:{}, categoryBudgets:{}, recurringOps:[] };
    if (!localStorage.getItem("budget_profile_" + newId)) localStorage.setItem("budget_profile_" + newId, JSON.stringify(empty));
    sharedAccessProfile = { profileId: newId, perms: pkg.perms || { ...DEFAULT_PERMS } };
    activeProfileId = newId;
    // Ensure no creator role leaks through
    profiles.forEach(p => { if (p.id === newId) p.role = "guest"; });
    saveGlobal();
    loadProfileData(newId);
    syncStartBalanceTransaction();
    ov.remove();
    init();
    showToast("✅ " + (LL[currentLang]||LL.ru).guestMode + ": " + pkg.pname);
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
  showToast("👤 Вы перешли в свой профиль");
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
  if (typeof openEnhancedSupportModal === "function") { openEnhancedSupportModal(); return; }
  const cs = getCreatorSettings();
  const canContact = cs.contactEnabled !== false;
  const preferPhone = cs.preferPhone === true;
  const PH1 = "+995568748686",
    PH2 = "+995593218218",
    EM = "motserelia92@gmail.com";

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
      { id: "whatsapp", name: "📱 WhatsApp", placeholder: "+995568748686" },
      { id: "viber", name: "📞 Viber", placeholder: "+995568748686" },
      { id: "telegram", name: "✈️ Telegram", placeholder: "@username" },
      {
        id: "messenger",
        name: "💬 Messenger",
        placeholder: "facebook_username",
      },
      { id: "sms", name: "📲 SMS", placeholder: "+995568748686" },
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
      showToast("👋 Режим создателя выключен");
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
            showToast("Пользователь не указал контакт для ответа", "error");
            return;
          }

          // Показываем модальное окно для ввода ответа
          const replyHtml = `
            <div class="field-group">
              <label class="field-label">📝 Ваш ответ для ${esc(msg.name)}</label>
              <textarea id="replyMessageInput" class="modal-textarea" rows="4" placeholder="Введите текст ответа..."></textarea>
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
                showToast("Введите текст ответа", "error");
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
              showToast("✅ Ответ отправлен");
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
    <div class="field-group"><label class="field-label">${L.email}</label><input type="email" id="supEmail" class="modal-input" placeholder="email@example.com"></div>
        <div class="field-group"><label class="field-label">📱 Телефон (WhatsApp, Viber)</label><input type="tel" id="supPhone" class="modal-input" placeholder="+995..."></div>
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
      showToast("Приём сообщений временно отключён", "error");
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
      showToast(`📬 Новое сообщение от ${f.name}`, "success", 3000);
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


function openNotificationHelpModal() {
  const lang = currentLang;
  const steps = {
    ru: [
      { browser:"Chrome / Android", steps:"1. Нажмите 🔒 в адресной строке\n2. Уведомления → Разрешить\n3. Перезагрузите страницу" },
      { browser:"Safari / iPhone", steps:"1. Настройки → Safari → Уведомления\n2. Найдите motserelia.github.io\n3. Включите уведомления" },
      { browser:"Firefox", steps:"1. Нажмите 🔒 → Разрешения\n2. Уведомления → Разрешить" },
    ],
    en: [
      { browser:"Chrome / Android", steps:"1. Tap 🔒 in address bar\n2. Notifications → Allow\n3. Reload the page" },
      { browser:"Safari / iPhone", steps:"1. Phone Settings → Safari → Notifications\n2. Find motserelia.github.io\n3. Enable notifications" },
      { browser:"Firefox", steps:"1. Tap 🔒 → Permissions\n2. Notifications → Allow" },
    ],
    ka: [
      { browser:"Chrome / Android", steps:"1. 🔒 მისამართის ველში\n2. შეტყობინებები → ნება\n3. გვერდის განახლება" },
      { browser:"Safari / iPhone", steps:"1. პარამეტრები → Safari → შეტყობინებები\n2. motserelia.github.io\n3. ჩართვა" },
      { browser:"Firefox", steps:"1. 🔒 → ნებართვები\n2. შეტყობინებები → ნება" },
    ],
  };
  const items = steps[lang] || steps.ru;
  const title = {ru:"🔔 Как включить уведомления",en:"🔔 How to enable notifications",ka:"🔔 შეტყობინებების ჩართვა"}[lang];
  const okL = {ru:"Понятно",en:"Got it",ka:"გასაგებია"}[lang];
  const html = "<div style='display:flex;flex-direction:column;gap:12px;'>" +
    items.map((item, i) => `<div style="background:${i===0?"var(--primary-pale)":"var(--cream-dark)"};border-radius:14px;padding:14px;border-left:4px solid ${i===0?"var(--primary)":"var(--cream-border)"};">` +
      `<div style="font-weight:800;font-size:14px;margin-bottom:6px;">${item.browser}</div>` +
      `<div style="font-size:13px;line-height:1.8;white-space:pre-line;">${item.steps}</div>` +
    `</div>`).join("") +
    `<button class="btn-primary" id="notifHelpOk" style="width:100%;">${okL}</button>` +
  "</div>";
  const modal = createModal("notifHelpModal", title, html);
  document.body.appendChild(modal);
  openModal("notifHelpModal");
  document.getElementById("notifHelpOk")?.addEventListener("click", () => closeModal("notifHelpModal"));
}

if (!checkShareLink()) {
  if ((pinEnabled && pinHash) || biometryEnabled) {
    showPinScreen(init);
  } else {
    init();
  }
}

// 4-click logo → Creator login
let _logoClickCount = 0, _logoClickTimer = null;
document.getElementById("appLogoBtn").addEventListener("click", () => {
  _logoClickCount++;
  clearTimeout(_logoClickTimer);
  _logoClickTimer = setTimeout(() => { _logoClickCount = 0; }, 1200);
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
    ru: { title: "Вход для создателя", hint: "Нажмите на логотип 4 раза, затем введите секретный ключ", label: "Секретный ключ", ph: "Введите ключ...", btn: "Войти", wrong: "❌ Неверный ключ", tip: "Подсказка: ключ хранится у разработчика" },
    en: { title: "Creator Login", hint: "Tap the logo 4 times, then enter the secret key", label: "Secret key", ph: "Enter key...", btn: "Login", wrong: "❌ Wrong key", tip: "Hint: key is kept by the developer" },
    ka: { title: "შემქმნელის შესვლა", hint: "დააჭირეთ ლოგოს 4-ჯერ, შემდეგ შეიყვანეთ საიდუმლო გასაღები", label: "საიდუმლო გასაღები", ph: "შეიყვანეთ გასაღები...", btn: "შესვლა", wrong: "❌ არასწორი გასაღები", tip: "მინიშნება: გასაღები ინახება შემქმნელთან" },
  };
  const lc = L[currentLang] || L.ru;
  const overlay = document.createElement("div");
  overlay.id = "creatorLoginOverlay";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);animation:fadeIn 0.2s ease both;";
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
          <button id="toggleKeyVisibility" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;font-size:20px;cursor:pointer;padding:4px;" title="Показать/скрыть">👁</button>
        </div>
      </div>
      <div id="creatorLoginError" style="display:none;background:var(--expense-pale);color:var(--expense-color);padding:10px 14px;border-radius:12px;font-size:13px;font-weight:700;margin-bottom:12px;text-align:center;"></div>
      <div style="display:flex;gap:10px;">
        <button class="btn-secondary" id="creatorLoginCancel" style="flex:1;">${{ ru:"Отмена", en:"Cancel", ka:"გაუქმება" }[currentLang]}</button>
        <button class="btn-primary" id="creatorLoginBtn" style="flex:2;background:linear-gradient(135deg,var(--gold),#f59e0b);color:white;border:none;">${lc.btn} ✓</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:14px;">${lc.tip}</div>
    </div>`;
  document.body.appendChild(overlay);

  const input = document.getElementById("creatorKeyInput");
  input.focus();
  document.getElementById("toggleKeyVisibility").addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
  });
  document.getElementById("creatorLoginCancel").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

  const tryLogin = () => {
    const val = input.value.trim();
    if (val === CREATOR_SECRET) {
      if (prof) prof.role = "owner";
      saveGlobal(); updateHeader();
      overlay.remove();
      showToast({ ru:"👑 Режим создателя активирован!", en:"👑 Creator mode activated!", ka:"👑 შემქმნელის რეჟიმი ჩართულია!" }[currentLang]);
      haptic("success");
      if (currentTab === "settings") renderSettings();
      openSupportModal();
    } else {
      const errDiv = document.getElementById("creatorLoginError");
      errDiv.style.display = "block";
      errDiv.textContent = lc.wrong;
      input.style.borderColor = "var(--expense-color)";
      input.style.animation = "shake 0.4s ease";
      setTimeout(() => { input.style.borderColor = ""; input.style.animation = ""; }, 1000);
      haptic("heavy");
    }
  };
  document.getElementById("creatorLoginBtn").addEventListener("click", tryLogin);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryLogin(); });
}

function showCreatorExitModal(prof) {
  const L = {
    ru: { title:"Выйти из режима создателя?", yes:"Выйти", no:"Остаться" },
    en: { title:"Exit creator mode?", yes:"Exit", no:"Stay" },
    ka: { title:"გასვლა შემქმნელის რეჟიმიდან?", yes:"გასვლა", no:"დარჩენა" },
  };
  const lc = L[currentLang] || L.ru;
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);animation:fadeIn 0.2s ease both;";
  overlay.innerHTML = `<div style="background:var(--card-bg);border-radius:28px;padding:28px;max-width:300px;width:88%;text-align:center;animation:slideUpBounce 0.35s cubic-bezier(0.34,1.56,0.64,1) both;">
    <div style="font-size:48px;margin-bottom:12px;">👑</div>
    <div style="font-size:18px;font-weight:800;margin-bottom:20px;">${lc.title}</div>
    <div style="display:flex;gap:10px;">
      <button class="btn-secondary" id="exitCrNo" style="flex:1;">${lc.no}</button>
      <button class="btn-danger" id="exitCrYes" style="flex:1;">${lc.yes}</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  document.getElementById("exitCrNo").addEventListener("click", () => overlay.remove());
  document.getElementById("exitCrYes").addEventListener("click", () => {
    if (prof) { prof.role = "user"; saveGlobal(); updateHeader(); }
    overlay.remove();
    showToast({ ru:"👋 Режим создателя выключен", en:"👋 Creator mode off", ka:"👋 შემქმნელის რეჟიმი გამორთულია" }[currentLang]);
    if (currentTab === "settings") renderSettings();
  });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

// ============================================================
// SUPPORT BADGE — unread message counter on button
// ============================================================
function updateSupportBadge() {
  const badge = document.getElementById("supportBadge");
  if (!badge) return;
  // Count unread: creator sees unreplied msgs, user sees unreplied replies
  try {
    const ownerProf = profiles.find(p => p.role === "owner");
    if (!ownerProf) { badge.style.display = "none"; return; }
    const msgs = getAllMessages();
    let count = 0;
    if (isCreator()) {
      count = msgs.filter(m => !m.readByCreator).length; // ALL unread, not just unreplied
    } else {
      count = msgs.filter(m => m.fromProfile === activeProfileId && m.creatorReply && !m.replyReadByUser).length;
    }
    if (count > 0) {
      badge.style.display = "flex";
      badge.textContent = count > 9 ? "9+" : String(count);
    } else {
      badge.style.display = "none";
    }
  } catch(e) { badge.style.display = "none"; }
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
  if (isCreator()) { openCreatorChatPanel(); return; }
  // Default: contactEnabled is TRUE unless explicitly set to false
  if (cs.contactEnabled === false) {
    const L = { ru:"Поддержка временно недоступна", en:"Support temporarily unavailable", ka:"მხარდაჭერა მიუწვდომელია" };
    showToast(L[currentLang] || L.ru, "error"); return;
  }
  openUserChatPanel();
}

// ================================================================
// USER CHAT PANEL
// ================================================================
function openUserChatPanel() {
  const ownerProf = profiles.find(p => p.role === "owner");
  const ownerData = ownerProf ? JSON.parse(localStorage.getItem("budget_profile_" + ownerProf.id) || "{}") : {};
  // Use central message store
  const allMsgs = getAllMessages();
  const myMsgs = allMsgs.filter(m => m.fromProfile === activeProfileId);
  const lang = currentLang;

  const L = {
    ru: { title:"💬 Чат с разработчиком", send:"Отправить", ph:"Напишите сообщение...", empty:"Начните диалог! Выберите шаблон ниже или напишите свой вопрос.", catQ:"❓ Вопросы", catS:"🐛 Проблемы", catR:"💡 Просьбы / Отзывы", you:"Вы", dev:"Разработчик Ираклий", status:"обычно отвечает в течение 24ч", sent:"✅ Сообщение отправлено!", noName:"Введите своё имя" },
    en: { title:"💬 Chat with developer", send:"Send", ph:"Type your message...", empty:"Start the chat! Choose a template below or write your own question.", catQ:"❓ Questions", catS:"🐛 Bug reports", catR:"💡 Requests / Reviews", you:"You", dev:"Developer Irakli", status:"usually responds within 24h", sent:"✅ Message sent!", noName:"Please enter your name" },
    ka: { title:"💬 შემქმნელთან ჩატი", send:"გაგზავნა", ph:"დაწერეთ შეტყობინება...", empty:"დაიწყეთ ჩატი! აირჩიეთ შაბლონი ან ჩაწერეთ კითხვა.", catQ:"❓ კითხვები", catS:"🐛 შეცდომები", catR:"💡 თხოვნები / შეფასება", you:"თქვენ", dev:"შემქმნელი ირაკლი", status:"ჩვეულებრივ პასუხობს 24სთ-ში", sent:"✅ გაიგზავნა!", noName:"შეიყვანეთ სახელი" },
  };
  const lc = L[lang] || L.ru;
  const tpl = USER_TEMPLATES[lang] || USER_TEMPLATES.ru;

  // Mark creator replies as read in central store
  // Mark creator replies as read for this user
  let changed = false;
  const centralMsgsRead = getAllMessages();
  centralMsgsRead.forEach(m => {
    if (m.fromProfile === activeProfileId && m.creatorReply && !m.replyReadByUser) {
      m.replyReadByUser = true; changed = true;
    }
  });
  if (changed) { saveAllMessages(centralMsgsRead); updateSupportBadge(); }

  const makeTplGroup = (catLabel, items) =>
    `<div style="margin-bottom:10px;">
      <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;">${catLabel}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${items.map((txt, i) =>
          `<button class="chat-tpl-btn" data-text="${txt.replace(/"/g,'&quot;')}"
            style="font-size:11px;padding:6px 11px;border-radius:20px;border:1.5px solid var(--cream-border);background:var(--cream-dark);cursor:pointer;transition:all 0.2s;text-align:left;max-width:100%;white-space:normal;line-height:1.4;">${txt}</button>`
        ).join("")}
      </div>
    </div>`;

  const feedHtml = myMsgs.length === 0
    ? `<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:20px 10px;">${lc.empty}</div>`
    : myMsgs.map(m => renderChatBubble(m, lc)).join("");

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
      <input type="text" id="chatUserName" class="modal-input" placeholder="${{ ru:'Ваше имя *', en:'Your name *', ka:'თქვენი სახელი *' }[lang]}" style="margin-bottom:10px;" value="${localStorage.getItem('chatUserName') || ''}">

      <!-- Templates accordion -->
      <details style="margin-bottom:10px;border-radius:14px;border:1.5px solid var(--cream-border);overflow:hidden;">
        <summary style="padding:10px 14px;font-size:12px;font-weight:800;color:var(--text-soft);cursor:pointer;background:var(--cream-dark);list-style:none;display:flex;align-items:center;gap:6px;">
          <span>📌 ${{ ru:"Шаблоны сообщений", en:"Message templates", ka:"შეტყობინების შაბლონები" }[lang]}</span>
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
  document.querySelectorAll(".chat-tpl-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const area = document.getElementById("chatMsgInput");
      if (area) { area.value = btn.dataset.text; area.focus(); }
      document.querySelectorAll(".chat-tpl-btn").forEach(b => { b.style.background = "var(--cream-dark)"; b.style.borderColor = "var(--cream-border)"; });
      btn.style.background = "var(--primary-pale)";
      btn.style.borderColor = "var(--primary)";
    });
  });

  // Send button
  const doSend = () => sendUserMessage(lc, ownerProf, ownerData, allMsgs);
  document.getElementById("chatSendBtn").addEventListener("click", doSend);
  document.getElementById("chatMsgInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
  });

  const feed = document.getElementById("userChatFeed");
  if (feed) feed.scrollTop = feed.scrollHeight;
}

function renderChatBubble(m, lc) {
  const fmt = d => new Date(d).toLocaleString(currentLang === "ka" ? "ka-GE" : currentLang === "en" ? "en-US" : "ru-RU", { hour:"2-digit", minute:"2-digit", day:"numeric", month:"short" });
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

const MSG_KEY = "budgetpro_messages"; // local fallback

// Firebase config — creator fills these in creator panel
function getFirebaseConfig() {
  try { return JSON.parse(localStorage.getItem("budgetpro_firebase") || "{}"); }
  catch(e) { return {}; }
}

let _fbDB = null;       // Firebase database reference
let _fbListener = null; // Active listener

// Initialize Firebase if configured
async function initFirebase() {
  const cfg = getFirebaseConfig();
  if (!cfg.databaseURL || _fbDB) return !!_fbDB;
  try {
    if (!window.firebase) {
      // Load Firebase SDK dynamically
      await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js");
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
  } catch(e) {
    console.warn("Firebase init failed:", e.message);
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
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
      const msgs = Object.values(data).sort((a,b) => new Date(a.date) - new Date(b.date));
      // Save to localStorage as cache
      try { localStorage.setItem(MSG_KEY, JSON.stringify(msgs)); } catch(e) {}
      updateSupportBadge();
      refreshCreatorPanelIfOpen();
      refreshUserPanelIfOpen();
    });
    console.log("✅ Real-time listener active");
  } catch(e) {
    console.warn("Listener failed:", e.message);
  }
}

// Start listener when page loads
setTimeout(startRealtimeListener, 1000);

// ── Local fallback (same device) ──────────────────────────────
let _msgChannel = null;
try {
  _msgChannel = new BroadcastChannel("budgetpro_channel");
  _msgChannel.onmessage = () => {
    updateSupportBadge();
    refreshCreatorPanelIfOpen();
    refreshUserPanelIfOpen();
  };
} catch(e) {}

function getAllMessages() {
  try { return JSON.parse(localStorage.getItem(MSG_KEY) || "[]"); }
  catch(e) { return []; }
}

async function saveAllMessages(msgs) {
  // 1. Always save locally first (instant)
  try { localStorage.setItem(MSG_KEY, JSON.stringify(msgs)); } catch(e) {}
  updateSupportBadge();
  refreshCreatorPanelIfOpen();
  refreshUserPanelIfOpen();
  // Broadcast to same-browser tabs
  try { _msgChannel?.postMessage({ type: "msg_update" }); } catch(e) {}

  // 2. Save to Firebase (cross-device real-time)
  const ok = await initFirebase();
  if (ok && _fbDB) {
    try {
      const ref = _fbDB.ref("budgetpro_messages");
      // Write as object keyed by id
      const obj = {};
      msgs.forEach(m => { obj[m.id.replace(/\./g,"_")] = m; });
      await ref.set(obj);
    } catch(e) {
      console.warn("Firebase write failed:", e.message);
    }
  }
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
  const msgs = getAllMessages().sort((a,b) => new Date(b.date) - new Date(a.date));
  const lang = currentLang;
  const lc = {
    ru:{empty:"Нет сообщений",new:"🆕",del:"🗑"},
    en:{empty:"No messages",new:"🆕",del:"🗑"},
    ka:{empty:"შეტყობინება არ არის",new:"🆕",del:"🗑"}
  }[lang] || {empty:"No messages",new:"🆕",del:"🗑"};

  // Count actual message cards already shown
  const currentCards = list.querySelectorAll(".creator-msg-card");
  const currentIds = new Set([...currentCards].map(c => c.dataset.msgid));

  // Find new messages not yet shown
  const newMsgs = msgs.filter(m => !currentIds.has(m.id));
  if (newMsgs.length === 0) return; // Nothing new

  // Remove "empty" placeholder if present
  const emptyEl = list.querySelector("[data-empty='1']");
  if (emptyEl) emptyEl.remove();

  newMsgs.forEach(m => {
    const dt = new Date(m.date).toLocaleString(
      lang==="ka"?"ka-GE":lang==="en"?"en-US":"ru-RU",
      {day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}
    );
    const card = document.createElement("div");
    card.className = "creator-msg-card";
    card.dataset.msgid = m.id;
    card.style.cssText = "background:var(--card-bg);border-radius:18px;padding:16px;border:2px solid var(--primary);box-shadow:var(--shadow-md);animation:fadeUp 0.4s ease both;margin-bottom:12px;";
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--primary-pale);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">👤</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:900;font-size:14px;">${esc(m.name)} <span style="background:var(--primary);color:white;padding:1px 7px;border-radius:10px;font-size:10px;">${lc.new}</span></div>
          <div style="font-size:11px;color:var(--text-muted);">${dt}</div>
        </div>
        <button class="cr-del-inline" data-mid="${m.id}" style="background:none;border:none;font-size:16px;cursor:pointer;color:var(--text-muted);padding:4px;">${lc.del}</button>
      </div>
      <div style="background:var(--cream-dark);border-radius:12px;padding:12px;font-size:14px;line-height:1.6;word-break:break-word;">${esc(m.message)}</div>
      ${m.creatorReply ? `<div style="margin-top:10px;border-left:3px solid var(--primary);padding:8px 12px;background:var(--primary-pale);border-radius:0 12px 12px 0;font-size:13px;">${esc(m.creatorReply)}</div>` : ""}
    `;
    list.insertBefore(card, list.firstChild);

    card.querySelector(".cr-del-inline")?.addEventListener("click", () => {
      const all = getAllMessages();
      saveAllMessages(all.filter(x => x.id !== m.id));
      card.remove();
    });

    // Mark as read
    const all = getAllMessages();
    const idx = all.findIndex(x => x.id === m.id);
    if (idx >= 0 && !all[idx].readByCreator) {
      all[idx].readByCreator = true;
      saveAllMessages(all);
    }
  });

  // Update count
  const countEl = document.getElementById("crMsgCount");
  if (countEl) countEl.textContent = msgs.length + " " + {ru:"сообщений",en:"messages",ka:"შეტყობინება"}[lang];
}

// Refresh user chat feed with new replies from creator
function refreshUserPanelIfOpen() {
  const feed = document.getElementById("userChatFeed");
  if (!feed) return;
  const msgs = getAllMessages().filter(m => m.fromProfile === activeProfileId);
  msgs.forEach(m => {
    if (m.creatorReply && !m.replyReadByUser) {
      // Check if reply bubble already shown
      const existingReply = feed.querySelector(`[data-reply-for="${m.id}"]`);
      if (!existingReply) {
        const lang = currentLang;
        const devLabel = {ru:"Разработчик",en:"Developer",ka:"შემქმნელი"}[lang];
        const dt = new Date(m.replyDate||m.date).toLocaleString(lang==="ka"?"ka-GE":lang==="en"?"en-US":"ru-RU",{hour:"2-digit",minute:"2-digit"});
        const bubble = document.createElement("div");
        bubble.dataset.replyFor = m.id;
        bubble.style.cssText = "display:flex;gap:8px;align-items:flex-end;animation:fadeUp 0.3s ease both;";
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
        const idx = all.findIndex(x=>x.id===m.id);
        if (idx>=0) { all[idx].replyReadByUser = true; saveAllMessages(all); }
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────
// TELEGRAM BOT INTEGRATION — cross-device notifications
// ─────────────────────────────────────────────────────────────
function getTelegramConfig() {
  try { return JSON.parse(localStorage.getItem("budgetpro_telegram") || "{}"); }
  catch(e) { return {}; }
}

async function sendTelegramMessage(text) {
  const cfg = getTelegramConfig();
  if (!cfg.token || !cfg.chatId) return false;
  try {
    const r = await fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: cfg.chatId, text, parse_mode: "HTML" })
    });
    return r.ok;
  } catch(e) { return false; }
}
// ─────────────────────────────────────────────────────────────

function sendUserMessage(lc, ownerProf, ownerData, allMsgsDep) {
  // Block if creator disabled messages
  const _cs = getCreatorSettings();
  if (_cs.contactEnabled === false) {
    showToast({ ru:"Создатель временно отключил приём сообщений", en:"Creator has disabled messages temporarily", ka:"შემქმნელმა შეტყობინებები გამორთო" }[currentLang], "error");
    return;
  }
  const nameEl = document.getElementById("chatUserName");
  const msgEl  = document.getElementById("chatMsgInput");
  const name = nameEl?.value.trim() || "";
  const msg  = msgEl?.value.trim()  || "";
  if (!name) { showToast(lc.noName, "error"); nameEl?.focus(); return; }
  if (!msg)  { showToast({ ru:"Введите сообщение", en:"Enter a message", ka:"შეიყვანეთ შეტყობინება" }[currentLang], "error"); return; }
  localStorage.setItem("chatUserName", name);

  const newMsg = {
    id: Date.now()+"_"+Math.random().toString(36).slice(2),
    name, message: msg, email:"", phone:"", category:"chat",
    date: new Date().toISOString(),
    replied: false, readByCreator: false, replyReadByUser: false,
    fromProfile: activeProfileId,
    fromProfileName: profiles.find(p=>p.id===activeProfileId)?.name || name,
    creatorReply: null, replyDate: null,
  };

  // Single global store — always works on same device
  const allMsgs = getAllMessages();
  allMsgs.push(newMsg);
  saveAllMessages(allMsgs);

  // Also save in feed for immediate UI update
  const feed = document.getElementById("userChatFeed");
  if (feed) {
    feed.querySelector("[data-empty]")?.remove();
    feed.insertAdjacentHTML("beforeend", renderChatBubble(newMsg, lc));
    feed.scrollTop = feed.scrollHeight;
  }
  if (msgEl) msgEl.value = "";
  document.querySelectorAll(".chat-tpl-btn").forEach(b => { b.style.background="var(--cream-dark)"; b.style.borderColor="var(--cream-border)"; });
  showToast(lc.sent, "success");
  haptic("success");
  // Send Telegram notification to creator (if configured)
  sendTelegramMessage(`📬 <b>БюджетPRO</b>\nОт: ${name}\nСообщение: ${msg}`)
    .then(ok => { if (ok) console.log("✅ Telegram notified"); });
}

// ================================================================
// CREATOR CHAT PANEL — полноценный интерфейс ответов
// ================================================================
function openCreatorChatPanel() {
  const ownerData = JSON.parse(localStorage.getItem("budget_profile_" + activeProfileId) || "{}");
  // Use central message store (single source of truth)
  const msgs = getAllMessages().sort((a,b) => new Date(b.date) - new Date(a.date));
  // Backwards compat: also check old profile-based messages
  const oldProfileMsgs = ownerData.supportMessages || [];
  if (oldProfileMsgs.length > 0) {
    const existingIds = new Set(msgs.map(m=>m.id));
    const merged = getAllMessages();
    oldProfileMsgs.forEach(m => { if (!existingIds.has(m.id)) merged.push(m); });
    if (merged.length > msgs.length) { saveAllMessages(merged); msgs.splice(0, msgs.length, ...merged.sort((a,b)=>new Date(b.date)-new Date(a.date))); }
  }
  const lang = currentLang;
  const cs = getCreatorSettings();
  const unread = msgs.filter(m => !m.readByCreator).length;
  if (unread > 0) {
    // Mark all as read in central store
    msgs.forEach(m => { m.readByCreator = true; });
    saveAllMessages(msgs); // saves to localStorage + triggers real-time sync
  }
  updateSupportBadge();

  const TT = CREATOR_TEMPLATES[lang] || CREATOR_TEMPLATES.ru;
  const L = {
    ru: { title:"👑 Панель создателя", empty:"Нет входящих сообщений", del:"🗑", replyBtn:"💬 Ответить", editReply:"✏️ Изменить ответ", sendReply:"➤ Отправить ответ", cancelReply:"Отмена", replyPh:"Введите ответ...", catA:"✅ Ответы на вопросы", catC:"🔄 Подтверждения / Баги", catF:"💡 Просьбы / Отзывы", toggleLabel:"Приём сообщений", inAppLabel:"Сообщения в приложении", save:"💾 Сохранить настройки", exit:"🚪 Выйти из режима создателя", unreadBadge:"непрочитанных", new:"🆕" },
    en: { title:"👑 Creator Panel", empty:"No incoming messages", del:"🗑", replyBtn:"💬 Reply", editReply:"✏️ Edit reply", sendReply:"➤ Send reply", cancelReply:"Cancel", replyPh:"Type your reply...", catA:"✅ Answers to questions", catC:"🔄 Bug confirmations", catF:"💡 Requests / Reviews", toggleLabel:"Accept messages", inAppLabel:"In-app messages", save:"💾 Save settings", exit:"🚪 Exit creator mode", unreadBadge:"unread", new:"🆕" },
    ka: { title:"👑 შემქმნელის პანელი", empty:"შემოსული შეტყობინებები არ არის", del:"🗑", replyBtn:"💬 პასუხი", editReply:"✏️ შეცვლა", sendReply:"➤ გაგზავნა", cancelReply:"გაუქმება", replyPh:"ჩაწერეთ პასუხი...", catA:"✅ კითხვების პასუხები", catC:"🔄 შეცდომის დადასტურება", catF:"💡 თხოვნები / შეფასებები", toggleLabel:"შეტყობინებების მიღება", inAppLabel:"პროგრამაში შეტყობინება", save:"💾 შენახვა", exit:"🚪 რეჟიმიდან გასვლა", unreadBadge:"წაუკითხავი", new:"🆕" },
  };
  const lc = L[lang] || L.ru;

  const makeTplPills = (msgId, cat, items) =>
    `<div style="margin-bottom:8px;">
      <div style="font-size:10px;font-weight:800;color:var(--primary);margin-bottom:4px;letter-spacing:0.4px;">${cat}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;">
        ${items.map((txt,i) =>
          `<button class="cr-tpl cr-tpl-${msgId}" data-text="${txt.replace(/"/g,'&quot;')}"
            style="font-size:10px;padding:4px 9px;border-radius:14px;border:1px solid var(--cream-border);background:var(--cream-dark);cursor:pointer;transition:all 0.15s;text-align:left;white-space:normal;line-height:1.4;">${txt}</button>`
        ).join("")}
      </div>
    </div>`;

  const renderMsg = (m) => {
    const isNew = !m.readByCreator;
    const dt = new Date(m.date).toLocaleString(lang==="ka"?"ka-GE":lang==="en"?"en-US":"ru-RU",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
    const replyBoxId = `reply-box-${m.id}`;
    const taId       = `reply-ta-${m.id}`;
    const sendBtnId  = `reply-send-${m.id}`;
    const cancelId   = `reply-cancel-${m.id}`;
    return `
      <div class="creator-msg-card" data-msgid="${m.id}" style="background:var(--card-bg);border-radius:18px;padding:16px;border:1.5px solid ${isNew?"var(--primary)":"var(--cream-border)"};box-shadow:${isNew?"var(--shadow-md)":"var(--shadow-sm)"};animation:fadeUp 0.3s ease both;">
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
        <div style="background:var(--cream-dark);border-radius:14px;padding:12px 14px;font-size:14px;line-height:1.6;margin-bottom:12px;">${esc(m.message)}</div>

        <!-- Existing reply (if any) -->
        ${m.creatorReply ? `
          <div class="cr-existing-reply-${m.id}" style="border-left:3px solid var(--primary);padding-left:12px;margin-bottom:10px;background:var(--primary-pale);border-radius:0 12px 12px 0;padding:10px 12px 10px 14px;">
            <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:4px;">${lang==="ru"?"Ваш ответ:":lang==="en"?"Your reply:":"თქვენი პასუხი:"}</div>
            <div style="font-size:13px;color:var(--text);">${esc(m.creatorReply)}</div>
          </div>` : ""}

        <!-- Reply button (opens reply box) -->
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="cr-reply-toggle btn-secondary" data-msgid="${m.id}" style="font-size:13px;padding:8px 16px;border-radius:20px;flex-shrink:0;">
            ${m.creatorReply ? lc.editReply : lc.replyBtn}
          </button>
          ${m.replied ? `<span style="font-size:11px;color:var(--income-color);font-weight:700;">✓ ${ lang==="ru"?"Отвечено":lang==="en"?"Replied":"გაიგზავნა" }</span>` : ""}
        </div>

        <!-- REPLY BOX (hidden by default, opens on button click) -->
        <div id="${replyBoxId}" style="display:none;margin-top:12px;border-top:1px solid var(--cream-border);padding-top:12px;">
          <!-- Template categories -->
          <div style="margin-bottom:10px;">
            <div style="font-size:11px;font-weight:800;color:var(--text-muted);margin-bottom:8px;">📌 ${ lang==="ru"?"Шаблоны ответов":lang==="en"?"Reply templates":"პასუხის შაბლონები" }:</div>
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
        <label class="switch"><input type="checkbox" id="csToggle" ${cs.contactEnabled?"checked":""}><span class="slider"></span></label>
      </div>
      <div style="background:var(--cream-dark);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between;">
        <div style="font-size:12px;font-weight:800;">${lc.inAppLabel}</div>
        <label class="switch"><input type="checkbox" id="inAppToggle" ${cs.inAppMessages?"checked":""}><span class="slider"></span></label>
      </div>
    </div>

    <!-- App URL field -->
    <div style="margin-bottom:12px;">
      <label style="font-size:12px;font-weight:800;color:var(--text-muted);display:block;margin-bottom:5px;">🔗 ${ {ru:"URL приложения для ссылок",en:"App URL for share links",ka:"აპის URL ბმულებისთვის"}[lang] }</label>
      <div style="display:flex;gap:8px;">
        <input type="url" id="creatorAppUrlInput" class="modal-input" value="${getAppUrl()}" placeholder="https://motserelia.github.io/BudgetPro/" style="flex:1;font-size:13px;">
        <button id="saveCreatorUrl" style="padding:0 14px;border-radius:14px;background:var(--primary);color:white;border:none;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap;">💾</button>
      </div>
    </div>

    <!-- Firebase Realtime Database — CROSS-DEVICE REAL-TIME SYNC -->
    <div style="background:var(--balance-pale);border-radius:14px;padding:12px 14px;margin-bottom:10px;border-left:4px solid #ea4335;">
      <div style="font-size:12px;font-weight:900;color:#ea4335;margin-bottom:8px;">🔥 Firebase — ${ {ru:"мгновенный чат с любого устройства (бесплатно!)",en:"instant chat from any device (free!)",ka:"მომენტური ჩატი ნებისმიერი მოწყობილობიდან (უფასო!)"}[lang] }</div>
      <div style="font-size:11px;color:var(--text-soft);margin-bottom:8px;line-height:1.6;background:var(--cream-dark);border-radius:10px;padding:8px 10px;">
        <b>${{ru:"Как настроить (5 минут):",en:"Setup (5 min):",ka:"დაყენება (5 წთ):"}[lang]}</b><br>
        ${ {ru:"1. console.firebase.google.com → Создать проект<br>2. Realtime Database → Создать → Тестовый режим<br>3. Скопируйте URL: <code>https://ВАШ-ПРОЕКТ.firebaseio.com</code><br>4. Вставьте ниже и нажмите 💾",
            en:"1. console.firebase.google.com → Create project<br>2. Realtime Database → Create → Test mode<br>3. Copy URL: <code>https://YOUR-PROJECT.firebaseio.com</code><br>4. Paste below and tap 💾",
            ka:"1. console.firebase.google.com → პროექტის შექმნა<br>2. Realtime Database → შექმნა → სატესტო რეჟიმი<br>3. URL კოპირება: <code>https://...</code><br>4. ჩასვით ქვემოთ და &#x1F4BE;"}[lang] }
      </div>
      <div style="display:flex;gap:6px;margin-bottom:6px;">
        <input type="url" id="fbUrlInput" class="modal-input" value="${getFirebaseConfig().databaseURL||""}" placeholder="https://your-project-default-rtdb.firebaseio.com" style="font-size:11px;flex:1;">
        <button id="saveFbBtn" style="padding:8px 12px;border-radius:12px;background:#ea4335;color:white;border:none;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">💾</button>
        <button id="testFbBtn" style="padding:8px 10px;border-radius:12px;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🧪</button>
      </div>
      <div id="fbStatus" style="font-size:11px;color:var(--text-muted);min-height:16px;">${ _fbDB ? "✅ " + {ru:"Firebase подключён",en:"Firebase connected",ka:"Firebase დაკავშირებულია"}[lang] : "⚠️ " + {ru:"Не настроен",en:"Not configured",ka:"არ არის კონფიგურირებული"}[lang] }</div>
    </div>

    <!-- Telegram Bot integration -->
    <div style="background:var(--cream-dark);border-radius:14px;padding:12px 14px;margin-bottom:14px;border-left:4px solid #2ca5e0;">
      <div style="font-size:12px;font-weight:800;color:#2ca5e0;margin-bottom:8px;">✈️ Telegram — ${ {ru:"push-уведомления (дополнительно)",en:"push notifications (optional)",ka:"push შეტყობინებები (სურვილისამებრ)"}[lang] }</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <input type="text" id="tgTokenInput" class="modal-input" value="${getTelegramConfig().token||""}" placeholder="Bot token: 1234567890:AAF..." style="font-size:11px;">
        <div style="display:flex;gap:6px;">
          <input type="text" id="tgChatInput" class="modal-input" value="${getTelegramConfig().chatId||""}" placeholder="Chat ID" style="font-size:11px;flex:1;">
          <button id="saveTgBtn" style="padding:8px 12px;border-radius:12px;background:#2ca5e0;color:white;border:none;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">💾</button>
          <button id="testTgBtn" style="padding:8px 10px;border-radius:12px;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🧪</button>
        </div>
      </div>
    </div>

    <!-- Stats bar -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
      <div id="crMsgCount" style="font-size:13px;font-weight:700;color:var(--text-muted);">${msgs.length} ${ {ru:"сообщений",en:"messages",ka:"შეტყობინება"}[lang] }</div>
      ${unread > 0 ? `<span style="background:var(--expense-color);color:white;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:800;">${unread} ${lc.unreadBadge}</span>` : `<span style="background:var(--income-pale);color:var(--income-color);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">✓ All read</span>`}
      <button id="crRefreshBtn" title="${{ru:'Обновить',en:'Refresh',ka:'განახლება'}[lang]}" style="margin-left:auto;background:var(--cream-dark);border:1.5px solid var(--cream-border);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px;">🔄 ${{ru:"Обновить",en:"Refresh",ka:"განახლება"}[lang]}</button>
    </div>
    <!-- Auto-refresh notice -->
    <div id="crAutoRefresh" style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">⚡ ${ {ru:"Автообновление каждые 4 секунды",en:"Auto-refresh every 4 seconds",ka:"ავტო-განახლება 4 წამში"}[lang] }</div>

    <!-- Messages list -->
    <div id="creatorMsgList" style="display:flex;flex-direction:column;gap:12px;max-height:55vh;overflow-y:auto;padding:2px 2px 2px 0;">
      ${msgs.length === 0
        ? `<div data-empty="1" style="text-align:center;padding:40px 20px;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:12px;">📭</div><div style="font-size:15px;font-weight:700;">${lc.empty}</div><div style="font-size:13px;margin-top:8px;color:var(--text-muted);">${{ru:"Сообщения обновляются автоматически каждые 4 секунды",en:"Messages refresh automatically every 4 seconds",ka:"შეტყობინებები განახლდება ავტომატურად 4 წამში"}[lang]}</div></div>`
        : msgs.map(renderMsg).join("")}
    </div>

    <!-- Bottom actions -->
    <div style="display:flex;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid var(--cream-border);">
      <button class="btn-primary" id="saveCS" style="flex:1;">${lc.save}</button>
      <button class="btn-secondary" id="exitCrMode" style="flex:1;color:var(--expense-color);">${lc.exit}</button>
    </div>`;

  const modal = createModal("creatorChatModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("creatorChatModal");

  // Save settings
  // Refresh messages in creator panel
  document.getElementById("crRefreshBtn")?.addEventListener("click", () => {
    const freshMsgs = getAllMessages().sort((a,b) => new Date(b.date) - new Date(a.date));
    const list = document.getElementById("creatorMsgList");
    const countEl = document.getElementById("crMsgCount");
    if (countEl) countEl.textContent = freshMsgs.length + " " + {ru:"сообщений",en:"messages",ka:"შეტყობინება"}[lang];
    if (list) {
      if (freshMsgs.length === 0) {
        list.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:12px;">📭</div><div style="font-size:15px;font-weight:700;">${lc.empty}</div></div>`;
      } else {
        list.innerHTML = freshMsgs.map(renderMsg).join("");
        reattach();
      }
    }
    showToast({ru:"✅ Обновлено",en:"✅ Refreshed",ka:"✅ განახლდა"}[lang], "success");
  });

  document.getElementById("saveCS")?.addEventListener("click", () => {
    const en = document.getElementById("csToggle")?.checked;
    const inApp = document.getElementById("inAppToggle")?.checked;
    localStorage.setItem("budgetpro_creator_settings", JSON.stringify({ ...cs, contactEnabled:en, inAppMessages:inApp }));
    showToast({ ru:"✅ Настройки сохранены", en:"✅ Settings saved", ka:"✅ შენახულია" }[lang], "success");
    closeModal("creatorChatModal");
    updateSupportBadge();
  });

  // Exit creator mode
  document.getElementById("exitCrMode").addEventListener("click", () => {
    const prof = profiles.find(p => p.id === activeProfileId);
    if (prof) { prof.role="user"; saveGlobal(); updateHeader(); }
    closeModal("creatorChatModal");
    showToast({ ru:"👋 Режим создателя выключен", en:"👋 Creator mode off", ka:"👋 გამორთულია" }[lang]);
    if (currentTab==="settings") renderSettings();
  });

  // Wire up per-message reply toggle, templates, send, delete
  const reattach = () => {
    // Save Firebase config
    document.getElementById("saveFbBtn")?.addEventListener("click", async () => {
      const url = document.getElementById("fbUrlInput")?.value.trim() || "";
      if (url) {
        const cfg = { databaseURL: url };
        localStorage.setItem("budgetpro_firebase", JSON.stringify(cfg));
        _fbDB = null; _fbListener = null; // reset to force re-init
        const ok = await initFirebase();
        const statusEl = document.getElementById("fbStatus");
        if (ok) {
          if (statusEl) statusEl.textContent = "✅ " + {ru:"Firebase подключён! Чат работает в реальном времени",en:"Firebase connected! Chat works in real-time",ka:"Firebase დაკავშირებულია! ჩატი მუშაობს"}[lang];
          startRealtimeListener();
          showToast({ru:"🔥 Firebase настроен! Теперь сообщения доходят мгновенно",en:"🔥 Firebase ready! Messages now arrive instantly",ka:"🔥 Firebase მზადაა! შეტყობინებები მყისიერია"}[lang], "success");
        } else {
          if (statusEl) statusEl.textContent = "❌ " + {ru:"Ошибка. Проверьте URL",en:"Error. Check the URL",ka:"შეცდომა. URL შეამოწმეთ"}[lang];
          showToast({ru:"❌ Не удалось подключить Firebase",en:"❌ Firebase connection failed",ka:"❌ Firebase კავშირი ვერ მოხერხდა"}[lang], "error");
        }
      }
    });
    document.getElementById("testFbBtn")?.addEventListener("click", async () => {
      const ok = await initFirebase();
      showToast(ok ? {ru:"✅ Firebase работает!",en:"✅ Firebase works!",ka:"✅ Firebase მუშაობს!"}[lang] : {ru:"❌ Firebase не подключён",en:"❌ Firebase not connected",ka:"❌ Firebase არ არის"}[lang], ok ? "success" : "error");
    });

    // Save Telegram config
    document.getElementById("saveTgBtn")?.addEventListener("click", () => {
      const token = document.getElementById("tgTokenInput")?.value.trim() || "";
      const chatId = document.getElementById("tgChatInput")?.value.trim() || "";
      localStorage.setItem("budgetpro_telegram", JSON.stringify({ token, chatId }));
      showToast({ ru:"✅ Telegram настроен", en:"✅ Telegram configured", ka:"✅ Telegram კონფიგურირებულია" }[lang], "success");
    });
    document.getElementById("testTgBtn")?.addEventListener("click", async () => {
      const ok = await sendTelegramMessage("🧪 БюджетPRO: тест / test / ტესტი ✅");
      showToast(ok ? {ru:"✅ Telegram работает!",en:"✅ Telegram works!",ka:"✅ Telegram მუშაობს!"}[lang] : {ru:"❌ Проверьте токен и Chat ID",en:"❌ Check token and Chat ID",ka:"❌ შეამოწმეთ ტოკენი"}[lang], ok ? "success" : "error");
    });
    // Save URL
    document.getElementById("saveCreatorUrl")?.addEventListener("click", () => {
      const rawVal = document.getElementById("creatorAppUrlInput")?.value || "";
      const urlVal = rawVal.trim();
      if (urlVal) {
        localStorage.setItem("budgetpro_app_url", urlVal);
        showToast({ ru:"✅ URL сохранён! Теперь все ссылки используют: " + urlVal, en:"✅ URL saved! All links now use: " + urlVal, ka:"✅ URL შენახულია: " + urlVal }[lang], "success");
      } else {
        // Save empty string explicitly so getAppUrl() doesn't auto-detect
        localStorage.setItem("budgetpro_app_url", "");
        showToast({ ru:"🗑 URL удалён — ссылки будут использовать адрес GitHub", en:"🗑 URL cleared — links will use auto-detected address", ka:"🗑 URL წაიშალა" }[lang]);
      }
    });
    // Delete
    document.querySelectorAll(".cr-del-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.msgid;
        ownerData.supportMessages = (ownerData.supportMessages||[]).filter(m=>m.id!==id);
        localStorage.setItem("budget_profile_" + activeProfileId, JSON.stringify(ownerData));
        btn.closest(".creator-msg-card")?.remove();
        showToast("🗑 " + {ru:"Удалено",en:"Deleted",ka:"წაიშალა"}[lang]);
      };
    });

    // Reply toggle (show/hide reply box)
    document.querySelectorAll(".cr-reply-toggle").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.msgid;
        const box = document.getElementById("reply-box-" + id);
        if (!box) return;
        const isOpen = box.style.display !== "none";
        box.style.display = isOpen ? "none" : "block";
        if (!isOpen) {
          const ta = document.getElementById("reply-ta-" + id);
          const msgObj = (ownerData.supportMessages||[]).find(m=>m.id===id);
          if (ta && msgObj?.creatorReply && !ta.value) ta.value = msgObj.creatorReply;
          ta?.focus();
          box.scrollIntoView({ behavior:"smooth", block:"nearest" });
        }
      };
    });

    // Template pills → fill textarea
    document.querySelectorAll(".cr-tpl").forEach(btn => {
      btn.onclick = () => {
        const id = btn.className.match(/cr-tpl-([^\s]+)/)?.[1];
        if (!id) return;
        const ta = document.getElementById("reply-ta-" + id);
        if (ta) { ta.value = btn.dataset.text; ta.focus(); }
        document.querySelectorAll(`.cr-tpl-${id}`).forEach(b => { b.style.background="var(--cream-dark)"; b.style.borderColor="var(--cream-border)"; });
        btn.style.background = "var(--primary-pale)";
        btn.style.borderColor = "var(--primary)";
      };
    });

    // Send reply buttons
    document.querySelectorAll("[id^='reply-send-']").forEach(sendBtn => {
      sendBtn.onclick = () => {
        const id = sendBtn.id.replace("reply-send-","");
        const ta = document.getElementById("reply-ta-" + id);
        const replyText = ta?.value.trim() || "";
        if (!replyText) { showToast({ru:"Введите текст ответа",en:"Enter reply text",ka:"შეიყვანეთ პასუხი"}[lang],"error"); return; }

        // Get message from central store (not ownerData which may be stale)
        const centralAll = getAllMessages();
        const centralIdx = centralAll.findIndex(m => m.id === id);
        if (centralIdx < 0) {
          showToast({ru:"Сообщение не найдено",en:"Message not found",ka:"შეტყობინება ვერ მოიძებნა"}[lang],"error");
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
          const newReplyHtml = `<div class="cr-existing-reply-${id}" style="border-left:3px solid var(--primary);margin-bottom:10px;background:var(--primary-pale);border-radius:0 12px 12px 0;padding:10px 12px 10px 14px;"><div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:4px;">${lang==="ru"?"Ваш ответ:":lang==="en"?"Your reply:":"თქვენი პასუხი:"}</div><div style="font-size:13px;color:var(--text);">${esc(replyText)}</div></div>`;
          if (existingDiv) existingDiv.outerHTML = newReplyHtml;
          else card.querySelector(".cr-reply-toggle")?.insertAdjacentHTML("beforebegin", newReplyHtml);
          const toggleBtn2 = card.querySelector(".cr-reply-toggle");
          if (toggleBtn2) toggleBtn2.textContent = lc.editReply;
        }

        showToast({ru:"✅ Ответ отправлен!",en:"✅ Reply sent!",ka:"✅ გაიგზავნა!"}[lang],"success");
        haptic("success");
        updateSupportBadge();
        if (Notification.permission==="granted") new Notification("💬 " + {ru:`Ответ для ${msgObj.name}`,en:`Reply for ${msgObj.name}`,ka:`პასუხი ${msgObj.name}-სთვის`}[lang]);
      };
    });

    // Cancel buttons
    document.querySelectorAll("[id^='reply-cancel-']").forEach(btn => {
      btn.onclick = () => {
        const id = btn.id.replace("reply-cancel-","");
        const box = document.getElementById("reply-box-" + id);
        if (box) box.style.display = "none";
      };
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
    balance: "💰 Баланс — это разница между всеми вашими доходами и расходами плюс начальная сумма.",
    income: "📈 Доходы — все поступления денег: зарплата, фриланс, подарки и другие источники.",
    expense: "📉 Расходы — все ваши траты: продукты, транспорт, коммуналка и прочее.",
    salary: "💼 Начальная сумма — деньги, с которых вы начинаете учёт. Нажмите чтобы изменить.",
    add: "➕ Нажмите чтобы добавить новую операцию — доход или расход.",
    stats: "📊 Статистика показывает диаграммы расходов и доходов за выбранный период.",
    tools: "🧮 Инструменты: калькулятор и конвертер валют с актуальными курсами.",
    notebook: "📓 Блокнот — сохраняйте заметки, номера телефонов, планы и списки.",
    categories: "🗂 Категории — управляйте списком категорий расходов и доходов.",
    settings: "⚙️ Настройки: тема, язык, валюта, PIN-защита, экспорт данных.",
    datetime: "📅 Выберите дату и время для напоминания. Нажмите на поле чтобы открыть выбор.",
    reminder: "🔔 Напоминания помогут не забыть записать траты. Выберите удобный интервал.",
    budget: "💰 Бюджеты — установите лимит расходов по категории на месяц.",
    recurring: "🔄 Повторяющиеся операции добавляются автоматически (аренда, кредит и т.д.).",
    pin: "🔒 PIN-код защищает приложение от посторонних. Установите 4-значный код.",
    theme: "🎨 Выберите цветовую тему оформления из 6 вариантов.",
    currency: "💱 Выберите валюту для отображения сумм в интерфейсе.",
    export: "📤 Экспортируйте данные в CSV, JSON или PDF для архивирования.",
    profiles: "👥 Профили — отдельные бюджеты для каждого члена семьи.",
    share: "🔗 Поделитесь профилем с другим человеком — он получит доступ к вашим данным.",
    support: "💬 Напишите нам — создатель приложения лично ответит на ваш вопрос.",
  },
  en: {
    balance: "💰 Balance is the difference between all income and expenses plus your starting amount.",
    income: "📈 Income — all money received: salary, freelance, gifts and other sources.",
    expense: "📉 Expenses — all your spending: groceries, transport, utilities, etc.",
    salary: "💼 Starting amount — money you begin tracking from. Tap to change.",
    add: "➕ Tap to add a new transaction — income or expense.",
    stats: "📊 Statistics shows charts of expenses and income for the selected period.",
    tools: "🧮 Tools: calculator and currency converter with live rates.",
    notebook: "📓 Notebook — save notes, phone numbers, plans and lists.",
    categories: "🗂 Categories — manage your income and expense categories.",
    settings: "⚙️ Settings: theme, language, currency, PIN protection, data export.",
    datetime: "📅 Select a date and time for a reminder. Tap the field to open the picker.",
    reminder: "🔔 Reminders help you remember to log expenses. Choose a convenient interval.",
    budget: "💰 Budgets — set a monthly spending limit per category.",
    recurring: "🔄 Recurring transactions are added automatically (rent, loan, etc.).",
    pin: "🔒 PIN code protects the app from others. Set a 4-digit code.",
    theme: "🎨 Choose a color theme from 6 options.",
    currency: "💱 Choose the currency for displaying amounts in the interface.",
    export: "📤 Export data to CSV, JSON or PDF for archiving.",
    profiles: "👥 Profiles — separate budgets for each family member.",
    share: "🔗 Share your profile — another person gets access to your data.",
    support: "💬 Contact us — the app creator will personally answer your question.",
  },
  ka: {
    balance: "💰 ბალანსი — სხვაობა ყველა შემოსავალსა და ხარჯს შორის, პლუს საწყისი თანხა.",
    income: "📈 შემოსავალი — ყველა შემოსული თანხა: ხელფასი, ფრილანსი, საჩუქრები.",
    expense: "📉 ხარჯი — ყველა დახარჯული: საკვები, ტრანსპორტი, კომუნალური და სხვა.",
    salary: "💼 საწყისი თანხა — ფული, საიდანაც იწყება თვლა. შეეხეთ შესაცვლელად.",
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
  document.querySelectorAll(".help-tooltip-popup").forEach(e => e.remove());

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
  document.getElementById("closeTipBtn")?.addEventListener("click", () => popup.remove());
  setTimeout(() => { if (popup.parentNode) popup.remove(); }, 5000);
}

function createHelpBtn(key, small = false) {
  const btn = document.createElement("button");
  btn.className = "help-q-btn";
  btn.innerHTML = "?";
  btn.title = { ru:"Справка", en:"Help", ka:"დახმარება" }[currentLang] || "Help";
  btn.style.cssText = `width:${small?18:22}px;height:${small?18:22}px;border-radius:50%;background:var(--cream-dark);border:1.5px solid var(--cream-border);font-size:${small?10:12}px;font-weight:900;color:var(--text-muted);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;vertical-align:middle;margin-left:4px;`;
  btn.addEventListener("click", (e) => { e.stopPropagation(); showHelpTooltip(key, btn); });
  btn.addEventListener("mouseenter", () => { btn.style.background = "var(--primary)"; btn.style.color = "white"; btn.style.borderColor = "var(--primary)"; });
  btn.addEventListener("mouseleave", () => { btn.style.background = "var(--cream-dark)"; btn.style.color = "var(--text-muted)"; btn.style.borderColor = "var(--cream-border)"; });
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
    const btn = document.querySelector(`.nav-btn[data-tab="${tab}"] .nav-label`);
    if (btn && !btn.querySelector(".help-q-btn")) {
      btn.appendChild(createHelpBtn(key, true));
    }
  });
}

// Run injections after init
setTimeout(() => {
  injectCardHelpButtons();
  injectNavHelpButtons();
  updateSupportBadge();
  setInterval(updateSupportBadge, 15000);
}, 800);

// ============================================================
// FIX INACTIVE BUTTONS
// ============================================================
function openConnectModal() {
  const lang = currentLang;
  const INST = {
    ru: {
      title: "🔗 Подключиться к чужому профилю",
      what: "Что это такое?",
      whatDesc: "Эта функция позволяет войти в профиль другого человека (например, члена семьи) и видеть его данные или совместно вести бюджет.",
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
      notFound: "❌ Профиль с таким кодом не найден. Проверьте код и попробуйте снова.",
      success: "✅ Успешно подключено!",
      tip: "💡 Ссылка быстрее и удобнее — просто нажать и войти без ввода кода!",
    },
    en: {
      title: "🔗 Connect to someone's profile",
      what: "What is this?",
      whatDesc: "This lets you join another person's profile (e.g. a family member) to view their data or manage the budget together.",
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
      whatDesc: "ეს ფუნქცია საშუალებას გაძლევთ შეხვიდეთ სხვა პირის პროფილში (მაგ., ოჯახის წევრის) და ერთობლივად მართოთ ბიუჯეტი.",
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
        ${lc.steps.map(s => `<div style="font-size:12px;color:var(--text-soft);line-height:1.5;">${s.startsWith("───") ? `<div style="text-align:center;color:var(--text-muted);font-size:11px;margin:2px 0;">${s}</div>` : s}</div>`).join("")}
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
  codeInput?.addEventListener("input", () => { codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g,""); });

  document.getElementById("connectCancel").addEventListener("click", () => closeModal("connectModal"));

  document.getElementById("connectDoBtn").addEventListener("click", () => {
    const code = codeInput?.value.trim().toUpperCase() || "";
    if (!code || code.length < 4) { showToast(lc.notFound, "error"); return; }
    const foundProf = profiles.find(p => {
      const ss = p.shareSettings || JSON.parse(localStorage.getItem("shareSettings_" + p.id) || "{}");
      return ss.shareId === code || (p.shareSettings?.shareId === code);
    });
    const errDiv = document.getElementById("connectError");
    if (!foundProf) {
      errDiv.style.display = "block";
      errDiv.textContent = lc.notFound;
      codeInput.style.borderColor = "var(--expense-color)";
      setTimeout(() => { errDiv.style.display="none"; codeInput.style.borderColor=""; }, 3000);
      return;
    }
    closeModal("connectModal");
    showToast(lc.success, "success");
    // Simulate share link entry
    const fakePkg = { v:3, type:"share_link", shareId:code, pname:foundProf.name||"Profile", pemoji:foundProf.emoji||"👤", pcolor:foundProf.color||"#2d6a4f", perms:foundProf.shareSettings?.perms||{...DEFAULT_PERMS}, hasPwd:!!foundProf.shareSettings?.pwHash, pwHash:foundProf.shareSettings?.pwHash||null, locked:foundProf.shareSettings?.locked||false };
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
  btn.title = { ru:"Поддержка", en:"Support", ka:"მხარდაჭერა" }[currentLang] || "Support";
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
// Run after init renders the header
setTimeout(ensureSupportButton, 500);
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
      { emoji:"🌿", title:"Добро пожаловать в БюджетPRO!", sub:"Личный финансовый трекер. Офлайн · Без регистрации · Бесплатно", color:"var(--primary)" },
      { emoji:"💸", title:"Записывайте расходы и доходы", sub:"Нажмите кнопку «+» внизу → выберите категорию → введите сумму. Готово!", color:"var(--expense-color)" },
      { emoji:"📊", title:"Смотрите статистику", sub:"Вкладка «Статистика» — диаграммы, тренды, прогноз на месяц.", color:"#2563eb" },
      { emoji:"🎯", title:"Ставьте бюджеты", sub:"Настройки → Бюджеты. Лимит по категории — приложение предупредит о превышении.", color:"var(--gold)" },
    ],
    en: [
      { emoji:"🌿", title:"Welcome to BudgetPRO!", sub:"Personal finance tracker. Offline · No registration · Free", color:"var(--primary)" },
      { emoji:"💸", title:"Track your income & expenses", sub:"Tap the «+» button at the bottom → choose category → enter amount. Done!", color:"var(--expense-color)" },
      { emoji:"📊", title:"View your statistics", sub:"The «Stats» tab — charts, trends, monthly forecast.", color:"#2563eb" },
      { emoji:"🎯", title:"Set spending budgets", sub:"Settings → Budgets. Set a limit per category — the app will warn you.", color:"var(--gold)" },
    ],
    ka: [
      { emoji:"🌿", title:"კეთილი იყოს თქვენი მობრძანება!", sub:"პირადი ფინანსური ტრეკერი. ოფლაინ · რეგისტრაციის გარეშე · უფასო", color:"var(--primary)" },
      { emoji:"💸", title:"ჩაიწერეთ ხარჯები და შემოსავლები", sub:"«+» ღილაკი ქვემოთ → კატეგორია → თანხა. მზადაა!", color:"var(--expense-color)" },
      { emoji:"📊", title:"ნახეთ სტატისტიკა", sub:"«სტატისტიკა» — დიაგრამები, ტრენდები, ყოველთვიური პროგნოზი.", color:"#2563eb" },
      { emoji:"🎯", title:"დაადგინეთ ბიუჯეტები", sub:"პარამეტრები → ბიუჯეტები. ლიმიტი კატეგორიაში — გაფრთხილება გადაჭარბებისას.", color:"var(--gold)" },
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
    "padding:env(safe-area-inset-top,16px) 24px env(safe-area-inset-bottom,24px);",
    "animation:fadeIn 0.35s ease both;",
    "min-height:100vh;min-height:100dvh;",
  ].join("");

  function renderSlide() {
    const s = sl[cur];
    const dots = sl.map((_,i) => `<div style="width:${i===cur?28:8}px;height:8px;border-radius:99px;background:${i===cur?"var(--primary)":"var(--cream-border)"};transition:all 0.3s ease;flex-shrink:0;"></div>`).join("");
    const langBtns = ["ru","en","ka"].map(l => `<button class="ob-lang-btn" data-l="${l}" style="width:32px;height:32px;border-radius:50%;border:2px solid ${l===lang?"var(--primary)":"var(--cream-border)"};background:${l===lang?"var(--primary)":"var(--cream-dark)"};color:${l===lang?"white":"var(--text-muted)"};font-size:15px;">${l==="ru"?"🇷🇺":l==="en"?"🇬🇧":"🇬🇪"}</button>`).join("");

    ov.innerHTML = `
      <!-- Top bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;padding-bottom:8px;flex-shrink:0;">
        <div style="display:flex;gap:8px;align-items:center;">${langBtns}</div>
        <button id="obSkip" style="background:none;border:none;color:var(--text-muted);font-size:14px;font-weight:700;padding:8px 4px;min-width:60px;text-align:right;">
          ${{ru:"Пропустить",en:"Skip",ka:"გამოტოვება"}[lang]}
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
          ${cur < sl.length-1 ? {ru:"Далее →",en:"Next →",ka:"შემდეგი →"}[lang] : {ru:"Начать! 🚀",en:"Start! 🚀",ka:"დაწყება! 🚀"}[lang]}
        </button>
        <!-- Slide counter -->
        <div style="text-align:center;font-size:12px;color:var(--text-muted);font-weight:600;">${cur+1} / ${sl.length}</div>
      </div>`;

    // Wire buttons — use querySelector within ov, not document.getElementById
    // to avoid conflicts with other page elements
    ov.querySelector("#obSkip").addEventListener("click", finishOnboarding);
    ov.querySelector("#obNext").addEventListener("click", () => {
      if (cur < sl.length - 1) { cur++; renderSlide(); }
      else finishOnboarding();
    });
    ov.querySelectorAll(".ob-lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        try { setLanguage(btn.dataset.l); } catch(e) {}
        ov.remove();
        showOnboarding();
      });
    });
  }

  function finishOnboarding() {
    try { localStorage.setItem("onboarding_done", "1"); } catch(e) {}
    ov.style.animation = "obFadeOut 0.25s ease forwards";
    setTimeout(() => { try { ov.remove(); } catch(e) {} }, 280);
  }

  document.body.appendChild(ov);
  renderSlide();
}

// Show onboarding after first init
setTimeout(() => { if (shouldShowOnboarding()) showOnboarding(); }, 600);

// ──────────────────────────────────────────────────────────────
// 2. СВАЙП СНИЗУ ВВЕРХ — быстрое добавление операции
// ──────────────────────────────────────────────────────────────
(function initSwipeToAdd() {
  let startY = 0, startTime = 0;
  const THRESHOLD = 90; // px
  const MAX_DURATION = 350; // ms

  document.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startY = touch.clientY;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const dy = startY - touch.clientY; // positive = swipe up
    const dt = Date.now() - startTime;
    // Only trigger from bottom 30% of screen, fast upward swipe
    if (dy > THRESHOLD && dt < MAX_DURATION && startY > window.innerHeight * 0.65) {
      // Don't trigger if a modal is open or inside a scrollable area
      if (document.querySelector(".modal-overlay.open")) return;
      if (e.target.closest(".modal, .modal-overlay, .bottom-nav, #mainContent")) return;
      // Trigger FAB
      document.getElementById("fabBtn")?.click();
    }
  }, { passive: true });
})();

// ──────────────────────────────────────────────────────────────
// 3. ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ БОЛЬШОЙ СУММЫ (>5000)
// ──────────────────────────────────────────────────────────────
const _origDeleteOp = typeof deleteOp === "function" ? deleteOp : null;
function safeDeleteOp(idx) {
  const op = transactions[idx];
  if (!op) { if (_origDeleteOp) _origDeleteOp(idx); return; }
  const threshold = 5000; // in base currency
  if (Math.abs(op.amountRub) >= threshold) {
    const L = {
      ru: `Удалить операцию на ${fmt(op.amountRub)}?`,
      en: `Delete transaction for ${fmt(op.amountRub)}?`,
      ka: `წავშალოთ ${fmt(op.amountRub)}-ის ოპერაცია?`,
    };
    askConfirm(L[currentLang] || L.ru, () => {
      if (_origDeleteOp) _origDeleteOp(idx);
      else {
        transactions.splice(idx, 1);
        saveAll();
        updateTopBlocks();
        if (currentTab === "home") renderHome();
        showToast(t("deleted"));
      }
    }, { icon: "⚠️", yesText: t("confirmOkBtn") });
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
    ru: { title:"📸 Сканировать чек", hint:"Сфотографируйте чек — приложение попробует распознать сумму", scan:"Открыть камеру", result:"Распознанная сумма:", confirm:"Использовать", cancel:"Отмена", scanning:"Распознаю...", notFound:"Сумма не найдена. Введите вручную.", noCamera:"Камера недоступна" },
    en: { title:"📸 Scan receipt", hint:"Take a photo of a receipt — the app will try to recognize the amount", scan:"Open camera", result:"Detected amount:", confirm:"Use this", cancel:"Cancel", scanning:"Recognizing...", notFound:"Amount not found. Enter manually.", noCamera:"Camera unavailable" },
    ka: { title:"📸 ჩეკის სკანირება", hint:"სფოტოგრაფირეთ ჩეკი — პროგრამა ამოიცნობს თანხას", scan:"კამერის გახსნა", result:"ამოცნობილი თანხა:", confirm:"გამოყენება", cancel:"გაუქმება", scanning:"ამოცნობა...", notFound:"თანხა ვერ მოიძებნა.", noCamera:"კამერა მიუწვდომელია" },
  };
  const lc = L[lang] || L.ru;

  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);">
      <div style="font-weight:800;font-size:14px;color:var(--primary);margin-bottom:8px;">${lc.hint}</div>
      <div style="font-size:12px;color:var(--text-soft);line-height:1.7;">
        ${ {ru:"<b>Как пользоваться:</b><br>1. Нажмите «Открыть камеру»<br>2. Сфотографируйте чек или квитанцию<br>3. Приложение распознает итоговую сумму<br>4. Нажмите «Использовать» — откроется форма добавления расхода<br><br><b>Советы для лучшего результата:</b><br>• Хорошее освещение, без теней<br>• Держите телефон ровно над чеком<br>• Итоговая строка должна быть видна",en:"<b>How to use:</b><br>1. Tap 'Open camera'<br>2. Photo a receipt or bill<br>3. App detects the total amount<br>4. Tap 'Use this' — expense form opens<br><br><b>Tips for best results:</b><br>• Good lighting, no shadows<br>• Hold phone flat above receipt<br>• Total line must be visible",ka:"<b>გამოყენება:</b><br>1. 'კამერის გახსნა'<br>2. ფოტოგრაფირება<br>3. პროგრამა ამოიცნობს<br>4. 'გამოყენება' → ფორმა"}[currentLang] }
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
  document.getElementById("scanCancel").addEventListener("click", () => closeModal("scanModal"));

  document.getElementById("receiptInput").addEventListener("change", async (e) => {
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
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.3/tesseract.min.js";
            script.onload = resolve; script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        const result = await window.Tesseract.recognize(ev.target.result, "rus+eng", {});
        const text = result.data.text;
        // Find largest number in text (likely the total)
        const numbers = [...text.matchAll(/[\d\s]+[.,]\d{1,2}/g)].map(m => parseFloat(m[0].replace(/\s/g,"").replace(",",".")));
        const biggest = numbers.length ? Math.max(...numbers) : null;

        if (biggest && biggest > 0) {
          status.textContent = "";
          document.getElementById("scanResultArea").style.display = "block";
          document.getElementById("scanAmount").textContent = fmt(biggest * (1 / exchangeRates[displayCurrency] || 1));
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
      } catch(err) {
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
      title:"⚖️ Правило 50/30/20",
      what:"Что это такое?",
      whatDesc:"Правило Уоррена Баффета для личных финансов. Ваш доход делится на три части: 50% на нужды, 30% на желания, 20% на сбережения и инвестиции.",
      income:"Ваш ежемесячный доход",
      needsTitle:"🏠 50% — Нужды (обязательные расходы)",
      needsDesc:"Аренда, коммуналка, продукты, транспорт, кредиты",
      wantsTitle:"🎉 30% — Желания (развлечения)",
      wantsDesc:"Рестораны, одежда, путешествия, хобби",
      savingsTitle:"💰 20% — Сбережения",
      savingsDesc:"Резервный фонд, инвестиции, пенсионный счёт",
      calc:"Рассчитать",
      apply:"Применить как лимиты",
      applied:"✅ Лимиты применены в раздел «Бюджеты»",
      tip:"💡 Начните с 50/30/20 и корректируйте под себя. Главное — начать откладывать хоть что-то!",
      currency:"Валюта",
    },
    en: {
      title:"⚖️ 50/30/20 Rule",
      what:"What is this?",
      whatDesc:"Warren Buffett's personal finance rule. Your income is split: 50% for needs, 30% for wants, 20% for savings and investments.",
      income:"Your monthly income",
      needsTitle:"🏠 50% — Needs (mandatory)",
      needsDesc:"Rent, utilities, groceries, transport, loans",
      wantsTitle:"🎉 30% — Wants (entertainment)",
      wantsDesc:"Restaurants, clothes, travel, hobbies",
      savingsTitle:"💰 20% — Savings",
      savingsDesc:"Emergency fund, investments, retirement",
      calc:"Calculate",
      apply:"Apply as budget limits",
      applied:"✅ Limits applied to Budgets",
      tip:"💡 Start with 50/30/20 and adjust to your lifestyle. The key is to start saving something!",
      currency:"Currency",
    },
    ka: {
      title:"⚖️ 50/30/20 წესი",
      what:"რა არის ეს?",
      whatDesc:"უორენ ბაფეტის პირადი ფინანსების წესი. შემოსავლის 50% — საჭიროებები, 30% — სურვილები, 20% — დანაზოგები.",
      income:"თქვენი ყოველთვიური შემოსავალი",
      needsTitle:"🏠 50% — საჭიროებები",
      needsDesc:"ქირა, კომუნალური, საკვები, ტრანსპორტი, სესხები",
      wantsTitle:"🎉 30% — სურვილები",
      wantsDesc:"რესტორნები, ტანსაცმელი, მოგზაურობა, ჰობი",
      savingsTitle:"💰 20% — დანაზოგები",
      savingsDesc:"სარეზერვო ფონდი, ინვესტიციები",
      calc:"გამოანგარიშება",
      apply:"ლიმიტების გამოყენება",
      applied:"✅ ლიმიტები გამოყენებულია",
      tip:"💡 დაიწყეთ 50/30/20-ით და მოარგეთ თქვენს ცხოვრებას!",
      currency:"ვალუტა",
    },
  };
  const lc = L[lang] || L.ru;

  // Calculate current average income from transactions
  const incomeTransactions = transactions.filter(t => t.type === "income" && !t._initial);
  const avgMonthlyIncome = incomeTransactions.length > 0
    ? incomeTransactions.reduce((s,t) => s + t.amountRub, 0) / Math.max(1, new Set(incomeTransactions.map(t => (t.date||"").slice(0,7))).size)
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

  document.getElementById("closeRuleBtn").addEventListener("click", () => closeModal("rule503020Modal"));

  const calcBtn = document.getElementById("calcRuleBtn");
  calcBtn.addEventListener("click", () => {
    const income = parseFloat(document.getElementById("ruleIncome").value) || 0;
    if (income <= 0) { showToast(t("enterPositive"), "error"); return; }
    // Convert from display currency to RUB base
    const incomeRub = income / (exchangeRates[displayCurrency] || 1) * exchangeRates["RUB"];
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
    const incomeRub = income / (exchangeRates[displayCurrency] || 1) * exchangeRates["RUB"];
    // Apply as category budgets (split into main expense categories)
    const needsCats = Object.keys(categories).slice(0, 3);
    const wantsCats = Object.keys(categories).slice(3);
    const needsBudget = (incomeRub * 0.5) / Math.max(1, needsCats.length);
    const wantsBudget = (incomeRub * 0.3) / Math.max(1, wantsCats.length);
    needsCats.forEach(c => { categoryBudgets[c] = needsBudget; });
    wantsCats.forEach(c => { categoryBudgets[c] = wantsBudget; });
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
  const notifiedKey = "recurring_notified_" + today.toISOString().slice(0,10);
  if (localStorage.getItem(notifiedKey)) return;

  const due = recurringOps.filter(op => {
    if (!op.enabled) return false;
    if (op.freq === "monthly" && op.day === todayDay) return true;
    return false;
  });

  if (due.length > 0) {
    localStorage.setItem(notifiedKey, "1");
    const L = { ru:"повторяющийся платёж", en:"recurring payment", ka:"განმეორებადი გადახდა" };
    due.forEach(op => {
      const title = "🔔 БюджетPRO";
      const body = `${L[currentLang]}: ${op.category} — ${fmt(op.amountRub)}`;
      try { new Notification(title, { body, icon: "/favicon-96x96.png" }); } catch(e) {}
    });
  }
}
setTimeout(checkRecurringNotifications, 2000);

// ──────────────────────────────────────────────────────────────
// 7. ЭКСПОРТ В GOOGLE ТАБЛИЦЫ — инструкция + CSV-ready
// ──────────────────────────────────────────────────────────────
function openGoogleSheetsExport() {
  const lang = currentLang;
  const L = {
    ru: {
      title:"📊 Экспорт в Google Таблицы",
      step1:"Шаг 1: Скачайте CSV файл",
      step2:"Шаг 2: Откройте Google Таблицы",
      step3:'Шаг 3: Файл → Импорт → Загрузить файл → выберите скачанный CSV',
      step4:"Шаг 4: Разделитель: запятая (,) → Нажмите «Импортировать данные»",
      download:"⬇️ Скачать CSV для Google Таблиц",
      open:"🔗 Открыть Google Таблицы",
      tip:"💡 Google Таблицы бесплатны. После импорта вы можете строить диаграммы, фильтровать, делиться с семьёй.",
      cancel:"Закрыть",
    },
    en: {
      title:"📊 Export to Google Sheets",
      step1:"Step 1: Download CSV file",
      step2:"Step 2: Open Google Sheets",
      step3:"Step 3: File → Import → Upload file → select the CSV",
      step4:"Step 4: Separator: comma (,) → Click 'Import data'",
      download:"⬇️ Download CSV for Google Sheets",
      open:"🔗 Open Google Sheets",
      tip:"💡 Google Sheets is free. After importing you can build charts, filter, share with family.",
      cancel:"Close",
    },
    ka: {
      title:"📊 Google Sheets-ში ექსპორტი",
      step1:"ნაბიჯი 1: ჩამოტვირთეთ CSV",
      step2:"ნაბიჯი 2: გახსენით Google Sheets",
      step3:"ნაბიჯი 3: File → Import → Upload → CSV ფაილი",
      step4:"ნაბიჯი 4: გამყოფი: მძიმე (,) → Import data",
      download:"⬇️ CSV ჩამოტვირთვა",
      open:"🔗 Google Sheets-ის გახსნა",
      tip:"💡 Google Sheets უფასოა. იმპორტის შემდეგ შექმენით დიაგრამები.",
      cancel:"დახურვა",
    },
  };
  const lc = L[lang] || L.ru;

  const steps = [lc.step1, lc.step2, lc.step3, lc.step4];
  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:14px;margin-bottom:16px;border-left:4px solid var(--primary);">
      ${lc.tip}
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
      ${steps.map((s,i) => `<div style="display:flex;align-items:flex-start;gap:10px;"><div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:white;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</div><div style="font-size:13px;line-height:1.6;padding-top:4px;">${s}</div></div>`).join("")}
    </div>
    <button class="btn-primary" id="gsDownloadBtn" style="width:100%;margin-bottom:10px;">${lc.download}</button>
    <button class="btn-secondary" id="gsOpenBtn" style="width:100%;margin-bottom:10px;">${lc.open}</button>
    <button class="btn-secondary" id="gsClose" style="width:100%;">${lc.cancel}</button>`;

  const modal = createModal("gsModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("gsModal");

  document.getElementById("gsClose").addEventListener("click", () => closeModal("gsModal"));
  document.getElementById("gsOpenBtn").addEventListener("click", () => window.open("https://sheets.google.com", "_blank"));
  document.getElementById("gsDownloadBtn").addEventListener("click", () => {
    // Generate Google Sheets-optimized CSV (with BOM for correct encoding)
    const header = { ru:["Дата","Тип","Категория","Подкатегория","Сумма (базовая)","Сумма (отображ)","Валюта","Заметка"],
                     en:["Date","Type","Category","Subcategory","Amount (base)","Amount (display)","Currency","Note"],
                     ka:["თარიღი","ტიპი","კატეგორია","ქვეკატეგორია","თანხა (ბაზა)","თანხა (ჩვენება)","ვალუტა","შენიშვნა"] };
    const h = header[lang] || header.ru;
    const typeL = { income:{ ru:"Доход",en:"Income",ka:"შემოსავალი" }, expense:{ ru:"Расход",en:"Expense",ka:"ხარჯი" } };
    let csv = "\uFEFF" + h.join(",") + "\n";
    transactions.filter(t => !t._initial).forEach(tx => {
      const dispAmt = toDisp(tx.amountRub).toFixed(2);
      csv += [
        tx.date || "",
        (typeL[tx.type]||{})[lang] || tx.type,
        `"${(tx.category||"").replace(/"/g,'""')}"`,
        `"${(tx.subcategory||"").replace(/"/g,'""')}"`,
        tx.amountRub.toFixed(2),
        dispAmt,
        displayCurrency,
        `"${(tx.note||"").replace(/"/g,'""')}"`,
      ].join(",") + "\n";
    });
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `BudgetPRO_${new Date().toISOString().slice(0,10)}.csv`;
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
    ru: { title:"📧 Отчёт на email", email:"Ваш email", send:"📤 Отправить отчёт", sent:"✅ Отчёт отправлен!", hint:"Краткий финансовый отчёт за текущий месяц. Используется EmailJS (бесплатно до 200 отправок/месяц).", noEmail:"Введите email", cancel:"Отмена", setup:"⚠️ Сначала настройте EmailJS в коде (serviceId, templateId, publicKey)", month:"Отчёт за", income:"Доходы:", expense:"Расходы:", balance:"Баланс:" },
    en: { title:"📧 Email report", email:"Your email", send:"📤 Send report", sent:"✅ Report sent!", hint:"Brief financial report for the current month. Uses EmailJS (free up to 200 sends/month).", noEmail:"Enter email", cancel:"Cancel", setup:"⚠️ Configure EmailJS in code first (serviceId, templateId, publicKey)", month:"Report for", income:"Income:", expense:"Expenses:", balance:"Balance:" },
    ka: { title:"📧 Email ანგარიში", email:"თქვენი email", send:"📤 ანგარიშის გაგზავნა", sent:"✅ გაიგზავნა!", hint:"მიმდინარე თვის ფინანსური ანგარიში. გამოყენება: EmailJS (200 შეტყობინება/თვე უფასო).", noEmail:"შეიყვანეთ email", cancel:"გაუქმება", setup:"⚠️ გთხოვთ დააყენოთ EmailJS", month:"ანგარიში:", income:"შემოსავალი:", expense:"ხარჯი:", balance:"ნაშთი:" },
  };
  const lc = L[lang] || L.ru;
  // Build report text
  const now = new Date();
  const monthName = t("months")[now.getMonth()] + " " + now.getFullYear();
  const monthStr = now.toISOString().slice(0,7);
  const monthTx = transactions.filter(tx => (tx.date||"").startsWith(monthStr));
  const inc = monthTx.filter(t=>t.type==="income").reduce((s,t)=>s+t.amountRub,0);
  const exp = monthTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amountRub,0);
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
  document.getElementById("closeReportBtn").addEventListener("click", () => closeModal("emailReportModal"));
  document.getElementById("sendReportBtn").addEventListener("click", () => {
    const email = document.getElementById("reportEmail").value.trim();
    if (!email || !email.includes("@")) { showToast(lc.noEmail, "error"); return; }
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
      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email:email, report:reportText, month:monthName })
        .then(() => { closeModal("emailReportModal"); showToast(lc.sent, "success"); })
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
    scanner:{ ru:"📸 Сканировать чек", en:"📸 Scan receipt", ka:"📸 ჩეკის სკანირება" },
    rule:{ ru:"⚖️ Правило 50/30/20", en:"⚖️ 50/30/20 Rule", ka:"⚖️ 50/30/20 წესი" },
    sheets:{ ru:"📊 Экспорт в Google Таблицы", en:"📊 Google Sheets export", ka:"📊 Google Sheets-ი" },
    email:{ ru:"📧 Отчёт на email", en:"📧 Email report", ka:"📧 Email ანგარიში" },
  };
  const block = document.createElement("div");
  block.id = "newToolsBlock";
  block.style.cssText = "padding:0 16px;margin-top:16px;display:flex;flex-direction:column;gap:10px;";
  block.innerHTML = `
    <div style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:8px;padding-bottom:8px;border-bottom:1.5px solid var(--cream-border);">✨ ${lang==="ru"?"Новые инструменты":lang==="en"?"New tools":"ახალი ხელსაწყოები"}</div>
    <button class="new-tool-btn" id="newScanBtn">
      <span class="ntb-icon">📸</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang==="ru"?"Сканер чеков":lang==="en"?"Receipt Scanner":"ჩეკის სკანერი"}</span>
        <span class="ntb-sub">${lang==="ru"?"Сфотографируйте чек — сумма заполнится автоматически":lang==="en"?"Photo a receipt — amount fills automatically":"ფოტო ჩეკი — თანხა ავტომატურად"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
    <button class="new-tool-btn" id="newRuleBtn">
      <span class="ntb-icon">⚖️</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang==="ru"?"Правило 50/30/20":lang==="en"?"50/30/20 Rule":"50/30/20 წესი"}</span>
        <span class="ntb-sub">${lang==="ru"?"Умное распределение бюджета по Баффету":lang==="en"?"Smart budget split by Buffett":"ბაფეტის ბიუჯეტის განაწილება"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
    <button class="new-tool-btn" id="newSheetsBtn">
      <span class="ntb-icon">📊</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang==="ru"?"Google Таблицы":lang==="en"?"Google Sheets":"Google Sheets"}</span>
        <span class="ntb-sub">${lang==="ru"?"Экспорт всей истории в таблицу":lang==="en"?"Export full history to spreadsheet":"ისტორიის ექსპორტი ცხრილში"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
    <button class="new-tool-btn" id="newEmailBtn">
      <span class="ntb-icon">📧</span>
      <span class="ntb-text">
        <span class="ntb-title">${lang==="ru"?"Отчёт на email":lang==="en"?"Email Report":"Email ანგარიში"}</span>
        <span class="ntb-sub">${lang==="ru"?"Ежемесячный финансовый отчёт на почту":lang==="en"?"Monthly financial report by email":"ყოველთვიური ანგარიში"}</span>
      </span>
      <span class="ntb-arrow">›</span>
    </button>
  `;
  content.appendChild(block);
  document.getElementById("newScanBtn")?.addEventListener("click", openReceiptScanner);
  document.getElementById("newRuleBtn")?.addEventListener("click", openBudget503020Modal);
  document.getElementById("newSheetsBtn")?.addEventListener("click", openGoogleSheetsExport);
  document.getElementById("newEmailBtn")?.addEventListener("click", openEmailReportModal);
}

// Hook into setTab to inject buttons when tools tab is shown
// Use a flag to avoid double-hooking
if (!window._toolsHookInstalled) {
  window._toolsHookInstalled = true;
  const _origSetTabForTools = window.setTab;
  window.setTab = function(tab) {
    if (_origSetTabForTools) _origSetTabForTools(tab);
    if (tab === "tools") setTimeout(injectNewToolButtons, 300);
    if (tab === "home")   setTimeout(() => { if (shouldShowOnboarding()) showOnboarding(); }, 100);
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
  const { x = window.innerWidth / 2, y = window.innerHeight / 2, count = 40, type = "confetti" } = opts;
  const emojis = type === "money" ? ["🪙","💰","💵","✨","💎"] :
                 type === "goal"  ? ["🎯","⭐","🏆","🥇","✨"] :
                                    ["🎊","🎉","✨","🌟","💫","❤️","🎈"];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const size = 18 + Math.random() * 22;
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${size}px;pointer-events:none;z-index:99999;user-select:none;`;
      document.body.appendChild(el);
      const angle = (Math.random() * 360) * Math.PI / 180;
      const dist = 80 + Math.random() * 200;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 100;
      el.animate([
        { transform: "translate(-50%,-50%) scale(0) rotate(0deg)", opacity: 0 },
        { transform: `translate(calc(-50% + ${dx * 0.4}px),calc(-50% + ${dy * 0.3}px)) scale(1.3) rotate(${Math.random()*360}deg)`, opacity: 1, offset: 0.25 },
        { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.3) rotate(${Math.random()*720}deg)`, opacity: 0 },
      ], { duration: 1000 + Math.random() * 600, easing: "cubic-bezier(0,0.9,0.57,1)", fill: "forwards" });
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
    const spent = transactions.filter(tx => tx.type === "expense" && tx.category === cat && (tx.date||"").startsWith(now.toISOString().slice(0,7))).reduce((s,tx) => s + tx.amountRub, 0);
    return spent > limit;
  });
  if (!over && Object.keys(categoryBudgets).length > 0) {
    const celebKey = "budgetCelebrated_" + now.toISOString().slice(0,7);
    if (localStorage.getItem(celebKey)) return;
    localStorage.setItem(celebKey, "1");
    setTimeout(() => {
      showConfetti({ x: window.innerWidth/2, y: window.innerHeight/2, count: 60, type: "confetti" });
      const L = {ru:"🎉 Поздравляем! Вы не превысили ни один бюджет в этом месяце!",en:"🎉 Congratulations! You didn't exceed any budget this month!",ka:"🎉 გილოცავთ! ამ თვეში ბიუჯეტი არ გადააჭარბეთ!"};
      showToast(L[currentLang]||L.ru, "success");
    }, 500);
  }
}
setTimeout(showBudgetCelebration, 3000);

// ═══════════════════════════════════════════════════════════════
// 🎤 3. ГОЛОСОВОЙ ВВОД (Web Speech API)
// ═══════════════════════════════════════════════════════════════
function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    const L = {ru:"Голосовой ввод недоступен. Используйте Chrome на Android.",en:"Voice input not available. Use Chrome on Android.",ka:"ხმოვანი შეყვანა მიუწვდომელია. გამოიყენეთ Chrome."};
    showToast(L[currentLang]||L.ru, "error");
    return;
  }
  const rec = new SpeechRecognition();
  rec.lang = currentLang === "en" ? "en-US" : currentLang === "ka" ? "ka-GE" : "ru-RU";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  // Show listening overlay
  const ov = document.createElement("div");
  ov.id = "voiceOverlay";
  ov.style.cssText = "position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;";
  ov.innerHTML = `
    <div style="font-size:80px;animation:voicePulse 1s ease infinite;">🎤</div>
    <div style="font-size:20px;font-weight:800;color:white;">${{ru:"Говорите...",en:"Listening...",ka:"ილაპარაკეთ..."}[currentLang]}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.7);text-align:center;padding:0 24px;">${{ru:"Например: «потратил 50 лари на продукты»",en:"E.g.: «spent 50 on groceries»",ka:"მაგ: «დავხარჯე 50 ლარი საყიდლებზე»"}[currentLang]}</div>
    <button id="voiceCancel" style="padding:12px 28px;border-radius:20px;background:rgba(255,255,255,0.2);color:white;border:1.5px solid rgba(255,255,255,0.4);font-size:15px;font-weight:700;cursor:pointer;">${t("cancel")}</button>
    <style>@keyframes voicePulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(255,100,100,0))}50%{transform:scale(1.1);filter:drop-shadow(0 0 20px rgba(255,100,100,0.6))}}</style>
  `;
  document.body.appendChild(ov);
  document.getElementById("voiceCancel").onclick = () => { rec.stop(); ov.remove(); };
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
    const L = {ru:"Не удалось распознать. Попробуйте ещё раз.",en:"Couldn't recognize. Please try again.",ka:"ვერ ამოვიცანი. სცადეთ ხელახლა."};
    showToast(L[currentLang]||L.ru, "error");
  };
  rec.onend = () => { const o = document.getElementById("voiceOverlay"); if (o) o.remove(); };
  rec.start();
}

function parseVoiceInput(text) {
  // Extract amount: look for numbers (including with decimals)
  const amountMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(",", ".")) : null;

  // Detect type: income keywords
  const incomeWords = { ru:["получил","заработал","пришло","доход","зарплата"], en:["received","earned","income","salary","got"], ka:["მივიღე","შემოვიდა"] };
  const expenseWords = { ru:["потратил","купил","заплатил","расход","потратила"], en:["spent","bought","paid","expense"], ka:["დავხარჯე","ვიყიდე","გადავიხადე"] };
  const iWords = incomeWords[currentLang] || incomeWords.ru;
  const eWords = expenseWords[currentLang] || expenseWords.ru;
  const isIncome = iWords.some(w => text.includes(w));
  const isExpense = eWords.some(w => text.includes(w)) || !isIncome;

  // Find category from text
  let detectedCat = null;
  const catMap = {
    ru: { "продукт":"Продукты","еда":"Продукты","магазин":"Продукты","транспорт":"Транспорт","метро":"Транспорт","автобус":"Транспорт","такси":"Транспорт","кафе":"Рестораны","ресторан":"Рестораны","кофе":"Кафе","аренда":"Коммуналка","квартира":"Коммуналка","коммунал":"Коммуналка","одежда":"Одежда","лекарство":"Здоровье","аптека":"Здоровье","интернет":"Коммуналка","телефон":"Телефон","бензин":"Транспорт" },
    en: { "grocery":"Продукты","food":"Продукты","transport":"Транспорт","metro":"Транспорт","bus":"Транспорт","taxi":"Транспорт","coffee":"Кафе","restaurant":"Рестораны","rent":"Коммуналка","clothes":"Одежда","medicine":"Здоровье","pharmacy":"Здоровье","gas":"Транспорт" },
  };
  const cm = catMap[currentLang] || catMap.ru;
  for (const [word, cat] of Object.entries(cm)) {
    if (text.includes(word)) { detectedCat = cat; break; }
  }
  // Check actual category list
  if (!detectedCat) {
    for (const cat of Object.keys(categories)) {
      if (text.includes(cat.toLowerCase())) { detectedCat = cat; break; }
    }
  }

  // Show result modal
  const L = {
    ru: { found:"🎤 Распознано:", type:(isIncome?"Доход":"Расход"), amount:"Сумма:", cat:"Категория:", confirm:"✅ Добавить", edit:"✏️ Изменить", notFound:"Сумма не найдена. Попробуйте снова." },
    en: { found:"🎤 Recognized:", type:(isIncome?"Income":"Expense"), amount:"Amount:", cat:"Category:", confirm:"✅ Add", edit:"✏️ Edit", notFound:"Amount not found. Try again." },
    ka: { found:"🎤 ამოცნობილია:", type:(isIncome?"შემოსავალი":"ხარჯი"), amount:"თანხა:", cat:"კატეგორია:", confirm:"✅ დამატება", edit:"✏️ შეცვლა", notFound:"თანხა ვერ მოიძებნა." },
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
        <div style="font-size:16px;font-weight:900;color:${isIncome?"var(--income-color)":"var(--expense-color)"};">${lc.type}</div>
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

  const modal = createModal("voiceModal", "🎤 " + (currentLang==="en"?"Voice Input":currentLang==="ka"?"ხმოვანი შეყვანა":"Голосовой ввод"), html);
  document.body.appendChild(modal);
  openModal("voiceModal");

  document.getElementById("voiceEdit")?.addEventListener("click", () => {
    closeModal("voiceModal");
    addType = isIncome ? "income" : "expense";
    openAddModal();
    setTimeout(() => {
      const af = document.getElementById("addAmount");
      if (af && amount) af.value = toDisp(amount / (exchangeRates[displayCurrency]||1) * exchangeRates["RUB"]).toFixed(2);
    }, 300);
  });

  document.getElementById("voiceConfirm")?.addEventListener("click", () => {
    closeModal("voiceModal");
    const amtRub = amount / (exchangeRates[displayCurrency]||1) * exchangeRates["RUB"];
    const newTx = {
      id: Date.now()+"_v",
      type: isIncome ? "income" : "expense",
      category: detectedCat || (isIncome ? Object.keys(incomeCategories)[0] : Object.keys(categories)[0]),
      subcategory: "",
      amountRub: amtRub,
      date: new Date().toISOString().slice(0,10),
      note: text,
      emoji: isIncome ? "💰" : "💸",
    };
    transactions.unshift(newTx);
    saveAll();
    updateTopBlocks();
    if (currentTab === "home") renderHome();
    showToast((currentLang==="en"?"✅ Added by voice":currentLang==="ka"?"✅ ხმით დამატებულია":"✅ Добавлено голосом"), "success");
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
  voiceBtn.title = {ru:"Голосовой ввод",en:"Voice input",ka:"ხმოვანი შეყვანა"}[currentLang]||"Voice";
  // Position: right side, above the nav bar, offset up so doesn't overlap FAB
  voiceBtn.style.cssText = "position:fixed;bottom:140px;right:14px;width:44px;height:44px;border-radius:50%;background:var(--primary-pale);border:2px solid var(--primary);font-size:20px;cursor:pointer;z-index:200;box-shadow:var(--shadow-md);display:flex;align-items:center;justify-content:center;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);";
  voiceBtn.addEventListener("click", () => { haptic("medium"); startVoiceInput(); });
  voiceBtn.addEventListener("mouseenter", () => voiceBtn.style.transform = "scale(1.12)");
  voiceBtn.addEventListener("mouseleave", () => voiceBtn.style.transform = "");
  document.body.appendChild(voiceBtn);
}
setTimeout(addVoiceButton, 800);

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
  if (lastSug === today.toISOString().slice(0,10)) return; // already shown today

  // Pattern 1: Weekly spending pattern
  const dayStats = {};
  transactions.filter(tx => tx.type === "expense" && tx.date).forEach(tx => {
    const d = new Date(tx.date + "T00:00").getDay();
    if (!dayStats[d]) dayStats[d] = { count: 0, total: 0, cats: {} };
    dayStats[d].count++;
    dayStats[d].total += tx.amountRub;
    const cat = tx.category || "other";
    dayStats[d].cats[cat] = (dayStats[d].cats[cat] || 0) + 1;
  });

  const todayStats = dayStats[todayDay];
  if (todayStats && todayStats.count >= 3) {
    const topCat = Object.entries(todayStats.cats).sort((a,b) => b[1]-a[1])[0]?.[0];
    const dayNames = {ru:["воскресенье","понедельник","вторник","среду","четверг","пятницу","субботу"],en:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],ka:["კვირას","ორშაბათს","სამშაბათს","ოთხშაბათს","ხუთშაბათს","პარასკევს","შაბათს"]};
    const dayName = (dayNames[currentLang]||dayNames.ru)[todayDay];
    const L = {
      ru:`💡 Обычно по ${dayName} вы тратите на «${topCat}». Не забыли записать?`,
      en:`💡 You usually spend on «${topCat}» on ${dayName}. Forgot to record?`,
      ka:`💡 ჩვეულებრივ ${dayName} «${topCat}»-ს ხარჯავთ. დაავიწყდათ ჩაწერა?`,
    };
    localStorage.setItem(suggestionKey, today.toISOString().slice(0,10));
    setTimeout(() => {
      showToast(L[currentLang]||L.ru, "info");
    }, 5000);
  }

  // Pattern 2: Unusual spending (>2x average day)
  const days30 = transactions.filter(tx => {
    if (tx.type !== "expense" || !tx.date) return false;
    const d = new Date(tx.date + "T00:00");
    return (today - d) < 30 * 24 * 60 * 60 * 1000;
  });
  const avgDay = days30.reduce((s,tx) => s + tx.amountRub, 0) / 30;
  const todayTotal = transactions.filter(tx => tx.type === "expense" && (tx.date||"") === today.toISOString().slice(0,10)).reduce((s,tx) => s + tx.amountRub, 0);
  if (todayTotal > avgDay * 2.5 && todayTotal > 0 && avgDay > 0) {
    const L = {ru:`⚠️ Сегодня вы потратили ${fmt(todayTotal)} — это больше обычного!`,en:`⚠️ You spent ${fmt(todayTotal)} today — that's above average!`,ka:`⚠️ დღეს ${fmt(todayTotal)} დახარჯეთ — ეს ჩვეულებრივზე მეტია!`};
    showToast(L[currentLang]||L.ru, "warning");
  }
}
setInterval(checkSmartSuggestions, 30 * 60 * 1000); // check every 30 min
setTimeout(checkSmartSuggestions, 8000); // and on load

// ═══════════════════════════════════════════════════════════════
// 🎯 5. ЦЕЛИ И МЕЧТЫ с прогресс-баром
// ═══════════════════════════════════════════════════════════════
function getGoals() {
  try { return JSON.parse(localStorage.getItem("budgetpro_goals") || "[]"); }
  catch(e) { return []; }
}
function saveGoals(goals) {
  localStorage.setItem("budgetpro_goals", JSON.stringify(goals));
}

function openGoalsModal() {
  const lang = currentLang;
  const goals = getGoals();
  const L = {
    ru:{ title:"🎯 Мои цели и мечты", add:"+ Добавить цель", name:"Название цели", target:"Цель (сумма)", saved:"Уже накоплено", noGoals:"Нет целей. Добавьте первую мечту!", del:"Удалить", edit:"Пополнить", addSaved:"Пополнить", close:"Закрыть", progress:"Прогресс", done:"🏆 Достигнута!" },
    en:{ title:"🎯 My Goals & Dreams", add:"+ Add goal", name:"Goal name", target:"Target amount", saved:"Already saved", noGoals:"No goals yet. Add your first dream!", del:"Delete", edit:"Add savings", addSaved:"Add savings", close:"Close", progress:"Progress", done:"🏆 Achieved!" },
    ka:{ title:"🎯 ჩემი მიზნები", add:"+ მიზნის დამატება", name:"მიზნის სახელი", target:"სამიზნე თანხა", saved:"დაზოგილია", noGoals:"მიზნები არ არის. დაამატეთ!", del:"წაშლა", edit:"შევსება", addSaved:"შევსება", close:"დახურვა", progress:"პროგრესი", done:"🏆 მიღწეულია!" },
  };
  const lc = L[lang]||L.ru;

  const renderGoalCards = (gs) => gs.length === 0
    ? `<div style="text-align:center;padding:32px;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:12px;">🌟</div><div style="font-weight:700;">${lc.noGoals}</div></div>`
    : gs.map((g,i) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        const done = g.saved >= g.target;
        const color = done ? "var(--gold)" : pct > 70 ? "var(--primary)" : pct > 40 ? "#2563eb" : "var(--text-muted)";
        return `<div style="background:var(--card-bg);border-radius:18px;padding:16px;border:1.5px solid ${done?"var(--gold)":"var(--cream-border)"};margin-bottom:12px;${done?"box-shadow:0 0 0 3px rgba(255,200,0,0.2);":""}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="font-size:28px;">${g.emoji||"🎯"}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:900;font-size:15px;color:var(--text);">${esc(g.name)}</div>
              <div style="font-size:12px;color:var(--text-muted);">${lc.progress}: ${pct}% ${done?"• "+lc.done:""}</div>
            </div>
            <button class="goal-del-btn" data-gi="${i}" style="background:none;border:none;font-size:16px;cursor:pointer;color:var(--text-muted);padding:4px;">🗑</button>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:8px;">
            <span style="color:var(--primary);">${fmt(g.saved)} ${lc.saved}</span>
            <span style="color:var(--text-muted);">${fmt(g.target)} цель</span>
          </div>
          <div style="height:12px;background:var(--cream-dark);border-radius:99px;overflow:hidden;margin-bottom:12px;">
            <div style="height:100%;width:${pct}%;background:${done?"linear-gradient(90deg,var(--gold),#f59e0b)":"linear-gradient(90deg,var(--primary),var(--primary-med))"};border-radius:99px;transition:width 1s ease;"></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="goal-add-btn btn-primary" data-gi="${i}" style="flex:1;padding:10px;font-size:13px;">💰 ${lc.addSaved}</button>
          </div>
        </div>`;
      }).join("");

  const addForm = `
    <div style="background:var(--cream-dark);border-radius:16px;padding:14px;margin-bottom:16px;border:1.5px dashed var(--cream-border);">
      <div style="font-size:13px;font-weight:800;color:var(--text-muted);margin-bottom:10px;">${lc.add}</div>
      <div style="display:flex;gap:6px;margin-bottom:8px;">
        <input id="goalEmoji" class="modal-input" value="🎯" style="width:54px;font-size:20px;text-align:center;padding:10px;" maxlength="2">
        <input id="goalName" class="modal-input" placeholder="${lc.name}" style="flex:1;">
      </div>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <input id="goalTarget" class="modal-input" type="number" placeholder="${lc.target} (${sym()})" step="0.01" min="1" style="flex:1;">
        <input id="goalSaved" class="modal-input" type="number" placeholder="${lc.saved} (${sym()})" step="0.01" min="0" style="flex:1;">
      </div>
      <button class="btn-primary" id="goalAddBtn" style="width:100%;">${lc.add}</button>
    </div>`;

  const html = addForm + `<div id="goalsList">${renderGoalCards(goals)}</div>`;
  const modal = createModal("goalsModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("goalsModal");

  document.getElementById("goalAddBtn")?.addEventListener("click", () => {
    const name = document.getElementById("goalName")?.value.trim();
    const target = parseFloat(document.getElementById("goalTarget")?.value||"0");
    const saved = parseFloat(document.getElementById("goalSaved")?.value||"0");
    const emoji = document.getElementById("goalEmoji")?.value||"🎯";
    if (!name || target <= 0) { showToast(currentLang==="en"?"Fill name and target":currentLang==="ka"?"შეავსეთ სახელი და მიზანი":"Заполните название и цель","error"); return; }
    const newGoal = { name, target: target/exchangeRates[displayCurrency]*exchangeRates["RUB"]||target, saved: saved/exchangeRates[displayCurrency]*exchangeRates["RUB"]||saved, emoji, created: new Date().toISOString() };
    const gs = getGoals();
    gs.push(newGoal);
    saveGoals(gs);
    document.getElementById("goalsList").innerHTML = renderGoalCards(gs);
    document.getElementById("goalName").value = "";
    document.getElementById("goalTarget").value = "";
    document.getElementById("goalSaved").value = "";
    haptic("success");
    if (newGoal.saved >= newGoal.target) showConfetti({count:50,type:"goal"});
    reattachGoalBtns(gs);
  });
  reattachGoalBtns(goals);

  function reattachGoalBtns(gs) {
    document.querySelectorAll(".goal-del-btn").forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.gi);
        askConfirm(currentLang==="en"?"Delete this goal?":"Удалить цель?", () => {
          gs.splice(i,1); saveGoals(gs);
          document.getElementById("goalsList").innerHTML = renderGoalCards(gs);
          haptic("medium");
          reattachGoalBtns(gs);
        }, {icon:"🎯"});
      };
    });
    document.querySelectorAll(".goal-add-btn").forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.gi);
        const amt = parseFloat(prompt(currentLang==="en"?`Add to "${gs[i].name}" (${sym()}):`:currentLang==="ka"?`დაამატეთ "${gs[i].name}"-ს (${sym()}):`:  `Пополнить «${gs[i].name}» (${sym()}):`)||"0");
        if (amt > 0) {
          gs[i].saved += amt / (exchangeRates[displayCurrency]||1) * (exchangeRates["RUB"]||1);
          saveGoals(gs);
          document.getElementById("goalsList").innerHTML = renderGoalCards(gs);
          if (gs[i].saved >= gs[i].target) { showConfetti({count:60,type:"goal"}); showToast("🏆 " + (currentLang==="en"?"Goal achieved!":currentLang==="ka"?"მიზანი მიღწეულია!":"Цель достигнута!"), "success"); }
          haptic("success");
          reattachGoalBtns(gs);
        }
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
  btn.title = {ru:"Мои цели",en:"My Goals",ka:"მიზნები"}[currentLang]||"Goals";
  // Position: left side, above the nav bar, offset up
  btn.style.cssText = "position:fixed;bottom:140px;left:14px;width:44px;height:44px;border-radius:50%;background:var(--gold-pale);border:2px solid var(--gold);font-size:20px;cursor:pointer;z-index:200;box-shadow:var(--shadow-md);display:flex;align-items:center;justify-content:center;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);";
  btn.addEventListener("click", () => { haptic("medium"); openGoalsModal(); });
  btn.addEventListener("mouseenter", () => btn.style.transform = "scale(1.12)");
  btn.addEventListener("mouseleave", () => btn.style.transform = "");
  document.body.appendChild(btn);
}
setTimeout(addGoalsNavButton, 900);

// ═══════════════════════════════════════════════════════════════
// 📊 6. ФИНАНСОВЫЙ ИНСАЙТ НЕДЕЛИ
// ═══════════════════════════════════════════════════════════════
function checkWeeklyInsight() {
  const today = new Date();
  const isMonday = today.getDay() === 1;
  const insightKey = "weeklyInsight_" + today.toISOString().slice(0,7) + "_w" + Math.floor(today.getDate()/7);
  if (localStorage.getItem(insightKey)) return;
  if (!isMonday && !localStorage.getItem("debugInsight")) return;

  const now = today.getTime();
  const msWeek = 7 * 24 * 60 * 60 * 1000;
  const thisWeekTx = transactions.filter(tx => tx.type==="expense" && tx.date && (now - new Date(tx.date+"T00:00").getTime()) < msWeek);
  const prevWeekTx = transactions.filter(tx => tx.type==="expense" && tx.date && (now - new Date(tx.date+"T00:00").getTime()) >= msWeek && (now - new Date(tx.date+"T00:00").getTime()) < msWeek*2);
  if (thisWeekTx.length < 2 || prevWeekTx.length < 2) return;

  const thisTotal = thisWeekTx.reduce((s,tx) => s + tx.amountRub, 0);
  const prevTotal = prevWeekTx.reduce((s,tx) => s + tx.amountRub, 0);
  if (prevTotal === 0) return;
  const diff = Math.round(((prevTotal - thisTotal) / prevTotal) * 100);

  localStorage.setItem(insightKey, "1");
  setTimeout(() => {
    const insightEl = document.createElement("div");
    insightEl.id = "weeklyInsightCard";
    insightEl.style.cssText = "margin:12px 16px 0;border-radius:18px;padding:16px;background:linear-gradient(135deg,var(--primary) 0%,var(--primary-med) 100%);color:white;position:relative;animation:fadeUp 0.5s ease both;box-shadow:var(--shadow-md);";
    const positive = diff > 0;
    const L = {
      ru: positive ? `🎉 На прошлой неделе вы потратили на <b>${Math.abs(diff)}%</b> меньше, чем позапрошлой. Отличная работа!` : `📊 На прошлой неделе расходы выросли на <b>${Math.abs(diff)}%</b>. Попробуйте сократить необязательные траты.`,
      en: positive ? `🎉 Last week you spent <b>${Math.abs(diff)}%</b> less than the week before. Great job!` : `📊 Last week expenses rose by <b>${Math.abs(diff)}%</b>. Try to cut optional spending.`,
      ka: positive ? `🎉 გასულ კვირას <b>${Math.abs(diff)}%</b>-ით ნაკლები დახარჯეთ. მშვენიერია!` : `📊 გასულ კვირას ხარჯები <b>${Math.abs(diff)}%</b>-ით გაიზარდა.`,
    };
    insightEl.innerHTML = `
      <button id="dismissInsight" style="position:absolute;top:10px;right:12px;background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
      <div style="font-size:13px;line-height:1.6;">${L[currentLang]||L.ru}</div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;font-size:12px;opacity:0.8;">
        <span>${{ru:"Прошлая неделя",en:"Last week",ka:"გასული კვირა"}[currentLang]}: ${fmt(thisTotal)}</span>
        <span>${{ru:"Позапрошлая",en:"Week before",ka:"მანამდე"}[currentLang]}: ${fmt(prevTotal)}</span>
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
    if (positive) setTimeout(() => showConfetti({x:window.innerWidth/2,y:200,count:30,type:"confetti"}), 300);
  }, 2000);
}
setTimeout(checkWeeklyInsight, 4000);

// ═══════════════════════════════════════════════════════════════
// 💑 7. ПАРТНЁРСКИЙ РЕЖИМ (Shared budget via Firebase)
// ═══════════════════════════════════════════════════════════════
function openPartnerMode() {
  const lang = currentLang;
  const L = {
    ru: { title:"💑 Партнёрский режим", desc:"Общий бюджет с партнёром в реальном времени через Firebase", firebaseReq:"⚠️ Сначала настройте Firebase в панели создателя", roomLabel:"Код комнаты", createRoom:"🆕 Создать комнату", joinRoom:"🔗 Войти в комнату", yourCode:"Ваш код комнаты:", shareCode:"Поделитесь этим кодом с партнёром", partnerJoined:"✅ Партнёр подключился!", waitPartner:"⏳ Ожидаем партнёра...", liveBalance:"💰 Общий баланс", liveTransactions:"📋 Общие операции", leaveRoom:"🚪 Выйти", addTx:"Добавить операцию", noFirebase:"Для партнёрского режима нужен Firebase. Настройте в панели создателя.", close:"Закрыть" },
    en: { title:"💑 Partner Mode", desc:"Shared real-time budget with your partner via Firebase", firebaseReq:"⚠️ Configure Firebase in creator panel first", roomLabel:"Room code", createRoom:"🆕 Create room", joinRoom:"🔗 Join room", yourCode:"Your room code:", shareCode:"Share this code with your partner", partnerJoined:"✅ Partner connected!", waitPartner:"⏳ Waiting for partner...", liveBalance:"💰 Shared balance", liveTransactions:"📋 Shared transactions", leaveRoom:"🚪 Leave room", addTx:"Add transaction", noFirebase:"Partner mode needs Firebase. Configure in creator panel.", close:"Close" },
    ka: { title:"💑 პარტნიორის რეჟიმი", desc:"საერთო ბიუჯეტი პარტნიორთან Firebase-ის გამოყენებით", firebaseReq:"⚠️ ჯერ Firebase-ის კონფიგურაცია გამოიყენეთ", roomLabel:"ოთახის კოდი", createRoom:"🆕 ოთახის შექმნა", joinRoom:"🔗 ოთახში შეერთება", yourCode:"თქვენი ოთახის კოდი:", shareCode:"გაუზიარეთ ეს კოდი პარტნიორს", partnerJoined:"✅ პარტნიორი დაუკავშირდა!", waitPartner:"⏳ ველოდებით...", liveBalance:"💰 საერთო ბალანსი", liveTransactions:"📋 საერთო ოპერაციები", leaveRoom:"🚪 გასვლა", addTx:"ოპერაციის დამატება", noFirebase:"Firebase-ის კონფიგურაცია სჭირდება.", close:"დახურვა" },
  };
  const lc = L[lang]||L.ru;

  if (!_fbDB) {
    const html = `<div style="background:var(--expense-pale);border-radius:14px;padding:16px;margin-bottom:16px;border-left:4px solid var(--expense-color);font-size:14px;line-height:1.6;">${lc.noFirebase}</div><button class="btn-secondary" id="partnerClose" style="width:100%;">${lc.close}</button>`;
    const m = createModal("partnerModal", lc.title, html);
    document.body.appendChild(m);
    openModal("partnerModal");
    document.getElementById("partnerClose")?.addEventListener("click", () => closeModal("partnerModal"));
    return;
  }

  const savedRoom = localStorage.getItem("partnerRoomCode");
  const html = `
    <div style="background:var(--primary-pale);border-radius:14px;padding:12px 14px;margin-bottom:14px;font-size:13px;line-height:1.5;border-left:4px solid var(--primary);">${lc.desc}</div>
    ${savedRoom ? `
      <div style="text-align:center;margin-bottom:14px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:4px;">${lc.yourCode}</div>
        <div style="font-size:28px;font-weight:900;color:var(--primary);letter-spacing:4px;font-family:monospace;">${savedRoom}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${lc.shareCode}</div>
      </div>
      <div id="partnerStatus" style="text-align:center;font-size:13px;color:var(--text-muted);padding:12px;background:var(--cream-dark);border-radius:12px;margin-bottom:14px;">${lc.waitPartner}</div>
      <div id="sharedTxList" style="max-height:200px;overflow-y:auto;margin-bottom:14px;"></div>
      <button class="btn-primary" id="partnerAddTx" style="width:100%;margin-bottom:8px;">💸 ${lc.addTx}</button>
      <button class="btn-secondary" id="partnerLeave" style="width:100%;">🚪 ${lc.leaveRoom}</button>
    ` : `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button class="btn-primary" id="createRoomBtn" style="width:100%;padding:16px;">${lc.createRoom}</button>
        <div style="text-align:center;color:var(--text-muted);font-size:13px;">— или —</div>
        <div style="display:flex;gap:8px;">
          <input id="joinRoomInput" class="modal-input" placeholder="${lc.roomLabel}" style="flex:1;font-size:18px;text-align:center;letter-spacing:2px;font-family:monospace;text-transform:uppercase;">
          <button class="btn-primary" id="joinRoomBtn" style="padding:0 16px;">${lc.joinRoom}</button>
        </div>
      </div>
    `}
  `;

  const modal = createModal("partnerModal", lc.title, html);
  document.body.appendChild(modal);
  openModal("partnerModal");

  if (savedRoom) {
    // Listen for partner's transactions
    try {
      _fbDB.ref("partner_rooms/" + savedRoom + "/transactions").on("value", snap => {
        const data = snap.val();
        const txList = document.getElementById("sharedTxList");
        const statusEl = document.getElementById("partnerStatus");
        if (!data) return;
        const txs = Object.values(data).sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,10);
        if (statusEl) statusEl.textContent = lc.partnerJoined;
        if (txList) txList.innerHTML = txs.map(tx => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--cream-border);font-size:13px;"><span>${esc(tx.category||"?")} ${tx.who?`(${esc(tx.who)})`:""}</span><span style="color:${tx.type==="income"?"var(--income-color)":"var(--expense-color)"};">${tx.type==="income"?"+":"-"}${fmt(tx.amountRub)}</span></div>`).join("");
      });
    } catch(e) {}

    document.getElementById("partnerLeave")?.addEventListener("click", () => {
      localStorage.removeItem("partnerRoomCode");
      closeModal("partnerModal");
      showToast({ru:"Вы вышли из комнаты",en:"Left the room",ka:"ოთახიდან გამოხვედით"}[lang]);
    });
    document.getElementById("partnerAddTx")?.addEventListener("click", () => {
      closeModal("partnerModal");
      openAddModal();
    });
  } else {
    const genCode = () => Math.random().toString(36).substr(2,6).toUpperCase();
    document.getElementById("createRoomBtn")?.addEventListener("click", () => {
      const code = genCode();
      localStorage.setItem("partnerRoomCode", code);
      closeModal("partnerModal");
      openPartnerMode();
    });
    document.getElementById("joinRoomBtn")?.addEventListener("click", () => {
      const code = (document.getElementById("joinRoomInput")?.value||"").trim().toUpperCase();
      if (code.length < 4) { showToast({ru:"Введите код комнаты",en:"Enter room code",ka:"ჩაწერეთ კოდი"}[lang],"error"); return; }
      localStorage.setItem("partnerRoomCode", code);
      closeModal("partnerModal");
      openPartnerMode();
    });
  }
}

// Wire partner mode to shared transactions save
const _origSaveAll = saveAll;
saveAll = function() {
  _origSaveAll();
  const roomCode = localStorage.getItem("partnerRoomCode");
  if (roomCode && _fbDB) {
    const prof = profiles.find(p => p.id === activeProfileId);
    const txToShare = {};
    transactions.slice(0,50).forEach((tx,i) => {
      const key = tx.id || ("tx_"+i);
      txToShare[key.replace(/\./g,"_")] = { ...tx, who: prof?.name||"?" };
    });
    try { _fbDB.ref("partner_rooms/"+roomCode+"/transactions").set(txToShare); } catch(e) {}
  }
};

// Add partner button to new tools block
const _origInjectTools = injectNewToolButtons;
injectNewToolButtons = function() {
  _origInjectTools();
  const block = document.getElementById("newToolsBlock");
  if (!block || document.getElementById("partnerModeBtn")) return;
  const lang = currentLang;
  const btn = document.createElement("button");
  btn.className = "new-tool-btn";
  btn.id = "partnerModeBtn";
  btn.innerHTML = `<span class="ntb-icon">💑</span><span class="ntb-text"><span class="ntb-title">${{ru:"Партнёрский режим",en:"Partner Mode",ka:"პარტნიორის რეჟიმი"}[lang]}</span><span class="ntb-sub">${{ru:"Общий бюджет с партнёром в реальном времени",en:"Shared real-time budget with partner",ka:"საერთო ბიუჯეტი პარტნიორთან"}[lang]}</span></span><span class="ntb-arrow">›</span>`;
  btn.addEventListener("click", () => { haptic("medium"); openPartnerMode(); });
  block.appendChild(btn);

  // Also add goals button
  if (!document.getElementById("goalsToolBtn")) {
    const gb = document.createElement("button");
    gb.className = "new-tool-btn";
    gb.id = "goalsToolBtn";
    gb.innerHTML = `<span class="ntb-icon">🎯</span><span class="ntb-text"><span class="ntb-title">${{ru:"Мои цели",en:"My Goals",ka:"ჩემი მიზნები"}[lang]}</span><span class="ntb-sub">${{ru:"Откладывайте на мечты с прогресс-баром",en:"Save for dreams with progress bar",ka:"დაზოგეთ ოცნებებისთვის"}[lang]}</span></span><span class="ntb-arrow">›</span>`;
    gb.addEventListener("click", () => { haptic("medium"); openGoalsModal(); });
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
    "home":          { icon:"🏠", title:"Главная", text:"Здесь отображается ваш баланс, история операций и быстрая сводка доходов и расходов." },
    "stats":         { icon:"📊", title:"Статистика", text:"Диаграммы расходов по категориям, тренды и прогноз на следующий месяц. Нажмите чтобы увидеть куда уходят деньги." },
    "tools":         { icon:"🧮", title:"Инструменты", text:"Калькулятор, конвертер валют, сканер чеков, экспорт данных и другие полезные функции." },
    "notebook":      { icon:"📔", title:"Блокнот", text:"Личные заметки и записи которые не связаны с операциями. Храните здесь что угодно." },
    "settings":      { icon:"⚙️", title:"Настройки", text:"Управление профилями, темы оформления, валюта, напоминания, бюджеты и многое другое." },
    // Кнопки шапки
    "headerSupportBtn": { icon:"💬", title:"Поддержка", text:"Напишите создателю приложения. Задайте вопрос, сообщите об ошибке или оставьте отзыв." },
    "headerGuideBtn":   { icon:"📖", title:"Обучение", text:"Пошаговый тур по приложению. Нажмите чтобы узнать как пользоваться всеми функциями." },
    "headerLangBtn":    { icon:"🌐", title:"Язык", text:"Переключение между тремя языками: Русский 🇷🇺, English 🇬🇧, ქართული 🇬🇪." },
    "themeToggle":      { icon:"🎨", title:"Тема", text:"Переключение между светлой и тёмной темой. Или включите автоматическую смену по времени суток в настройках." },
    "appLogoBtn":       { icon:"🌿", title:"БюджетPRO", text:"Нажмите 4 раза чтобы войти в режим создателя (только для создателя приложения)." },
    // Карточки
    "balanceCard":   { icon:"💎", title:"Баланс", text:"Текущий баланс = начальная сумма + доходы − расходы. Нажмите чтобы фильтровать историю." },
    "incomeCard":    { icon:"📈", title:"Доходы", text:"Сумма всех поступлений за выбранный период. Нажмите чтобы показать только доходы в истории." },
    "expenseCard":   { icon:"📉", title:"Расходы", text:"Сумма всех трат за выбранный период. Нажмите чтобы показать только расходы в истории." },
    "salaryCard":    { icon:"💼", title:"Начальная сумма", text:"Деньги с которых вы начали учёт (наличные, сбережения). Нажмите чтобы изменить." },
    // FAB
    "fabBtn":        { icon:"➕", title:"Добавить операцию", text:"Главная кнопка приложения! Нажмите чтобы добавить расход или доход. Также можно свайпнуть снизу вверх." },
    // Плавающие кнопки
    "voiceInputBtn": { icon:"🎤", title:"Голосовой ввод", text:"Скажите «потратил 50 лари на продукты» — приложение само добавит расход. Работает в Chrome." },
    "goalsNavBtn":   { icon:"🎯", title:"Мои цели", text:"Накопления на мечты с прогресс-баром. Добавьте цель, пополняйте её и получите конфетти при достижении!" },
  },
  en: {
    "home":          { icon:"🏠", title:"Home", text:"Shows your balance, transaction history, and a quick income/expense summary." },
    "stats":         { icon:"📊", title:"Stats", text:"Expense charts by category, trends, and monthly forecast. See where your money goes." },
    "tools":         { icon:"🧮", title:"Tools", text:"Calculator, currency converter, receipt scanner, data export and other useful features." },
    "notebook":      { icon:"📔", title:"Notebook", text:"Personal notes not linked to transactions. Store anything you want here." },
    "settings":      { icon:"⚙️", title:"Settings", text:"Manage profiles, themes, currency, reminders, budgets and more." },
    "headerSupportBtn": { icon:"💬", title:"Support", text:"Write to the app creator. Ask a question, report a bug, or leave feedback." },
    "headerGuideBtn":   { icon:"📖", title:"Guide", text:"Step-by-step tour of the app. Learn how to use all features." },
    "headerLangBtn":    { icon:"🌐", title:"Language", text:"Switch between three languages: Russian 🇷🇺, English 🇬🇧, Georgian 🇬🇪." },
    "themeToggle":      { icon:"🎨", title:"Theme", text:"Switch between light and dark theme. Or enable automatic time-based switching in Settings." },
    "appLogoBtn":       { icon:"🌿", title:"BudgetPRO", text:"Tap 4 times to enter creator mode (only for the app creator)." },
    "balanceCard":   { icon:"💎", title:"Balance", text:"Current balance = starting amount + income − expenses. Tap to filter history." },
    "incomeCard":    { icon:"📈", title:"Income", text:"Total income for selected period. Tap to show only income in history." },
    "expenseCard":   { icon:"📉", title:"Expenses", text:"Total expenses for selected period. Tap to show only expenses in history." },
    "salaryCard":    { icon:"💼", title:"Starting amount", text:"Money you started tracking from (cash, savings). Tap to change." },
    "fabBtn":        { icon:"➕", title:"Add transaction", text:"The main app button! Tap to add an expense or income. Or swipe up from the bottom." },
    "voiceInputBtn": { icon:"🎤", title:"Voice input", text:"Say 'spent 50 on groceries' — app adds it automatically. Works in Chrome." },
    "goalsNavBtn":   { icon:"🎯", title:"My Goals", text:"Save for dreams with a progress bar. Add a goal, fund it, get confetti on completion!" },
  },
  ka: {
    "home":          { icon:"🏠", title:"მთავარი", text:"ბალანსი, ოპერაციების ისტორია და შემოსავლების/ხარჯების მოკლე სახე." },
    "stats":         { icon:"📊", title:"სტატისტიკა", text:"ხარჯების დიაგრამები კატეგორიების მიხედვით, ტრენდები და პროგნოზი." },
    "tools":         { icon:"🧮", title:"ხელსაწყოები", text:"კალკულატორი, ვალუტის კონვერტერი, ჩეკის სკანერი და სხვა." },
    "settings":      { icon:"⚙️", title:"პარამეტრები", text:"პროფილები, თემები, ვალუტა, შეხსენებები, ბიუჯეტები." },
    "headerSupportBtn": { icon:"💬", title:"მხარდაჭერა", text:"დაუკავშირდით შემქმნელს. შეკითხვა, შეცდომა ან შეფასება." },
    "headerGuideBtn":   { icon:"📖", title:"სახელმძღვანელო", text:"ნაბიჯ-ნაბიჯ ტური პროგრამაში." },
    "headerLangBtn":    { icon:"🌐", title:"ენა", text:"სამ ენას შორის გადართვა: რუსული, ინგლისური, ქართული." },
    "themeToggle":      { icon:"🎨", title:"თემა", text:"მსუბუქი და ბნელი თემის გადართვა." },
    "fabBtn":           { icon:"➕", title:"ოპერაციის დამატება", text:"მთავარი ღილაკი! დააჭირეთ ხარჯის ან შემოსავლის დასამატებლად." },
    "balanceCard":      { icon:"💎", title:"ბალანსი", text:"მიმდინარე ბალანსი = საწყისი + შემოსავლები − ხარჯები." },
  },
};

function showTooltip(elementId) {
  const lang = currentLang;
  const tips = (TOOLTIPS[lang] || TOOLTIPS.ru);
  const tip = tips[elementId];
  if (!tip) return;

  // Remove existing tooltip
  document.getElementById("appTooltip")?.remove();

  const el = document.getElementById(elementId);
  if (!el) return;
  const rect = el.getBoundingClientRect();

  const ov = document.createElement("div");
  ov.id = "appTooltip";
  ov.style.cssText = "position:fixed;inset:0;z-index:99998;display:flex;align-items:flex-end;padding:20px;pointer-events:none;";

  const box = document.createElement("div");
  box.style.cssText = "background:var(--card-bg);border-radius:20px;padding:18px 20px;box-shadow:0 -4px 40px rgba(0,0,0,0.2);border:1.5px solid var(--cream-border);max-width:360px;width:100%;margin:auto;pointer-events:auto;animation:slideUpBounce 0.3s cubic-bezier(0.34,1.3,0.64,1) both;";
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
  ov.addEventListener("click", e => { if (e.target === ov) ov.remove(); });
  // Auto-close
  setTimeout(() => ov?.remove(), 6000);
}

function initTooltips() {
  const tooltipIds = Object.keys(TOOLTIPS.ru);
  tooltipIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    let pressTimer = null;
    // Long press on mobile
    el.addEventListener("touchstart", e => {
      pressTimer = setTimeout(() => { e.preventDefault(); showTooltip(id); haptic("medium"); }, 600);
    }, { passive: true });
    el.addEventListener("touchend",  () => clearTimeout(pressTimer));
    el.addEventListener("touchmove", () => clearTimeout(pressTimer));
    // Right-click on desktop
    el.addEventListener("contextmenu", e => { e.preventDefault(); showTooltip(id); });
  });

  // Add ? badges to nav buttons
  document.querySelectorAll(".nav-btn").forEach(btn => {
    const map = { home:"home", stats:"stats", tools:"tools", notebook:"notebook", settings:"settings" };
    const id = Object.keys(map).find(k => btn.dataset.tab === k || btn.id === k+"Btn");
    if (!id) return;
    let pressTimer2 = null;
    btn.addEventListener("touchstart", () => { pressTimer2 = setTimeout(() => showTooltip(id), 600); }, { passive: true });
    btn.addEventListener("touchend",  () => clearTimeout(pressTimer2));
    btn.addEventListener("contextmenu", e => { e.preventDefault(); showTooltip(id); });
  });
}
setTimeout(initTooltips, 1000);

// ══════════════════════════════════════════════════════════════
// 📚 ИНТЕРАКТИВНЫЙ ГИД — пошаговое обучение
// ══════════════════════════════════════════════════════════════
const GUIDE_TOPICS = {
  ru: [
    {
      id: "basics",
      icon: "🏠",
      title: "Основы: как начать",
      steps: [
        { emoji:"👋", title:"Добро пожаловать!", text:"БюджетPRO — личный финансовый трекер. Помогает понять куда уходят деньги и планировать бюджет.", action:null },
        { emoji:"💼", title:"Шаг 1: Начальная сумма", text:"Нажмите на карточку «Нач. сумма» вверху → введите сумму наличных/сбережений с которых начинаете учёт.", action:"salaryCard" },
        { emoji:"➕", title:"Шаг 2: Добавьте первый расход", text:"Нажмите большую зелёную кнопку «+» внизу → выберите «Расход» → выберите категорию (например, Продукты) → введите сумму → нажмите «Добавить».", action:"fabBtn" },
        { emoji:"💰", title:"Шаг 3: Добавьте доход", text:"Нажмите «+» → выберите «Доход» → категорию «Зарплата» → введите сумму → «Добавить». Баланс автоматически пересчитается.", action:"fabBtn" },
        { emoji:"📊", title:"Шаг 4: Смотрите статистику", text:"Перейдите во вкладку «Статистика» — там диаграммы, тренды и прогноз. Чем больше данных, тем точнее анализ.", action:null },
      ]
    },
    {
      id: "budget",
      icon: "🎯",
      title: "Бюджеты и лимиты",
      steps: [
        { emoji:"🎯", title:"Что такое бюджет?", text:"Бюджет — это лимит трат на категорию в месяц. Например: «Рестораны — не более 200₾ в месяц».", action:null },
        { emoji:"⚙️", title:"Шаг 1: Откройте настройки", text:"Нажмите «⚙️ Настройки» в нижней навигации.", action:null },
        { emoji:"📋", title:"Шаг 2: Найдите раздел «Бюджеты»", text:"Прокрутите вниз до раздела «💰 Бюджеты». Нажмите «+ Добавить бюджет».", action:null },
        { emoji:"✍️", title:"Шаг 3: Установите лимит", text:"Выберите категорию (например, «Продукты»), введите лимит в месяц (например, 300₾). Нажмите «Сохранить».", action:null },
        { emoji:"🔔", title:"Результат", text:"Теперь когда вы добавляете расход в эту категорию, приложение показывает сколько лимита осталось. При превышении — предупреждение!", action:null },
      ]
    },
    {
      id: "profiles",
      icon: "👥",
      title: "Профили и семья",
      steps: [
        { emoji:"👥", title:"Зачем нужны профили?", text:"Профили позволяют вести отдельный учёт для каждого члена семьи. Папа, мама, дети — у каждого свой баланс.", action:null },
        { emoji:"⚙️", title:"Шаг 1: Откройте настройки", text:"Перейдите в «Настройки» → раздел «Профили».", action:null },
        { emoji:"➕", title:"Шаг 2: Добавьте профиль", text:"Нажмите «+ Добавить профиль» → введите имя → выберите цвет → нажмите «Сохранить».", action:null },
        { emoji:"🔄", title:"Шаг 3: Переключайтесь", text:"Нажмите на имя профиля вверху → выберите другой профиль. Все данные хранятся отдельно.", action:null },
        { emoji:"🔗", title:"Общий доступ", text:"В разделе профиля нажмите «Поделиться» — сгенерируется ссылка. Отправьте её члену семьи — они увидят общие данные.", action:null },
      ]
    },
    {
      id: "voice",
      icon: "🎤",
      title: "Голосовой ввод",
      steps: [
        { emoji:"🎤", title:"Что это?", text:"Голосовой ввод позволяет добавлять расходы голосом без касания экрана. Очень удобно когда руки заняты.", action:null },
        { emoji:"📱", title:"Требования", text:"Нужен браузер Google Chrome на Android или компьютере. Safari на iPhone не поддерживает эту функцию.", action:null },
        { emoji:"🔘", title:"Шаг 1: Найдите кнопку", text:"Зелёная кнопка 🎤 справа внизу над навигацией. Или: Настройки → Расширенные функции → «Использовать голосовой ввод».", action:"voiceInputBtn" },
        { emoji:"🗣️", title:"Шаг 2: Говорите", text:"Нажмите 🎤 → дождитесь «Говорите...» → скажите фразу.", action:null },
        { emoji:"✅", title:"Примеры фраз:", text:"• «Потратил 50 лари на продукты»\n• «Купил кофе за 8 лари»\n• «Заплатил за такси 15»\n• «Получил зарплату 1000»", action:null },
      ]
    },
    {
      id: "goals",
      icon: "🎯",
      title: "Цели и мечты",
      steps: [
        { emoji:"🌟", title:"Что такое цели?", text:"Раздел «Цели» позволяет откладывать деньги на конкретные мечты с наглядным прогресс-баром.", action:null },
        { emoji:"🔘", title:"Шаг 1: Откройте цели", text:"Жёлтая кнопка 🎯 слева внизу. Или: Настройки → Расширенные функции → «Открыть мои цели».", action:"goalsNavBtn" },
        { emoji:"➕", title:"Шаг 2: Создайте цель", text:"Введите emoji, название (например: «iPhone 15 🍎»), целевую сумму (например: 1200₾) и уже накопленную сумму.", action:null },
        { emoji:"💰", title:"Шаг 3: Пополняйте", text:"Нажмите «💰 Пополнить» рядом с целью → введите сумму которую откладываете.", action:null },
        { emoji:"🎊", title:"Достижение цели", text:"Когда накопленная сумма достигнет цели — приложение покажет конфетти и сообщение «Цель достигнута!» 🏆", action:null },
      ]
    },
    {
      id: "notifications",
      icon: "🔔",
      title: "Напоминания",
      steps: [
        { emoji:"🔔", title:"Что такое напоминания?", text:"Приложение будет присылать уведомления чтобы напоминать записывать расходы регулярно.", action:null },
        { emoji:"⚙️", title:"Шаг 1: Откройте настройки", text:"Перейдите в «⚙️ Настройки» → прокрутите до раздела «🔔 Напоминания».", action:null },
        { emoji:"🔘", title:"Шаг 2: Нажмите кнопку", text:"Нажмите большую кнопку «🔔 Включить напоминания». Браузер спросит разрешение — нажмите «Разрешить».", action:null },
        { emoji:"⏰", title:"Шаг 3: Выберите интервал", text:"Выберите как часто получать напоминания: каждые 30 минут, 1 час, раз в день и т.д.", action:null },
        { emoji:"📅", title:"Точное время", text:"Можно также установить конкретное время напоминания — нажмите на карточку 📅 или ⏰ и выберите дату/время.", action:null },
      ]
    },
    {
      id: "export",
      icon: "📊",
      title: "Экспорт данных",
      steps: [
        { emoji:"📊", title:"Экспорт данных", text:"Вы можете выгрузить все ваши операции в разные форматы для хранения или анализа.", action:null },
        { emoji:"🧮", title:"Шаг 1: Откройте Инструменты", text:"Перейдите во вкладку «Инструменты» в навигации.", action:null },
        { emoji:"📊", title:"Google Таблицы", text:"«📊 Google Таблицы» → скачайте CSV → откройте Google Sheets → Файл → Импорт. Все операции в таблице!", action:null },
        { emoji:"📧", title:"Отчёт на email", text:"«📧 Отчёт на email» → введите ваш email → получите ежемесячный отчёт о доходах и расходах.", action:null },
        { emoji:"⚙️", title:"Другие форматы", text:"Настройки → раздел «Данные»: экспорт в JSON (для переноса на другое устройство), CSV, PDF.", action:null },
      ]
    },
    {
      id: "themes",
      icon: "🎨",
      title: "Темы и внешний вид",
      steps: [
        { emoji:"🎨", title:"Настройка внешнего вида", text:"Приложение поддерживает 6 цветовых тем и тёмный режим для комфортного использования.", action:null },
        { emoji:"🌙", title:"Тёмный режим", text:"Нажмите кнопку 🌙 в верхнем правом углу. Или включите автоматическую смену по времени в Настройках.", action:"themeToggle" },
        { emoji:"🎨", title:"Цветовые темы", text:"Настройки → «Цветовая тема» → выберите из 6 вариантов: Лесной зелёный (по умолчанию), Белый, Золотой, Закат, Тёмно-синий, Золото на тёмном.", action:null },
        { emoji:"📝", title:"Размер шрифта", text:"Настройки → «Размер шрифта» → выберите: Маленький, Нормальный, Большой. Полезно для удобного чтения.", action:null },
        { emoji:"✨", title:"Простой режим", text:"Настройки → «Простой режим» — упрощённый интерфейс для тех кто хочет только записывать расходы без лишних деталей.", action:null },
      ]
    },
    {
      id: "newtools",
      icon: "✨",
      title: "Новые инструменты",
      nav: "tools",
      steps: [
        { emoji:"✨", title:"Новые инструменты", text:"Вкладка «🧮 Инструменты» → прокрутите вниз до блока «✨ Новые инструменты». Там 6 дополнительных функций которые делают приложение незаменимым!", action:null, nav:"tools" },
        { emoji:"📸", title:"Сканер чеков", text:"Сфотографируйте бумажный чек — приложение автоматически распознает итоговую сумму с помощью технологии OCR и предложит добавить её как расход. Не нужно вводить цифры вручную!", action:"newScanBtn", nav:"tools" },
        { emoji:"⚖️", title:"Правило 50/30/20", text:"Знаменитое правило финансов: 50% дохода — на необходимые расходы (еда, аренда), 30% — на желания (рестораны, развлечения), 20% — на сбережения. Кнопка «Рассчитать» автоматически установит лимиты!", action:"newRuleBtn", nav:"tools" },
        { emoji:"📊", title:"Google Таблицы", text:"Нажмите → скачайте CSV файл → откройте Google Таблицы на компьютере → Файл → Импорт → выберите файл. Все ваши операции появятся в красивой таблице!", action:"newSheetsBtn", nav:"tools" },
        { emoji:"📧", title:"Отчёт на email", text:"Введите ваш email и нажмите «Отправить» — получите красивый финансовый отчёт за текущий месяц: доходы, расходы, баланс.", action:"newEmailBtn", nav:"tools" },
        { emoji:"💑", title:"Партнёрский режим", text:"Создайте «комнату» → поделитесь кодом с партнёром → оба видите общий бюджет в реальном времени. Идеально для пар и семей! Требует настроенный Firebase.", action:"partnerModeBtn", nav:"tools" },
      ]
    },
  ],
  en: [
    { id:"basics", icon:"🏠", title:"Basics: Getting Started", steps:[
      { emoji:"👋", title:"Welcome to BudgetPRO!", text:"BudgetPRO is your personal finance tracker. It shows where your money goes and helps you plan a budget. No registration required — all data stored only on your device.", action:null },
      { emoji:"💼", title:"Step 1: Set your starting amount", text:"Tap the 'Starting amount' card at the top of the screen → enter how much cash or savings you currently have. This is your starting balance.", action:"salaryCard" },
      { emoji:"➕", title:"Step 2: Add your first expense", text:"Tap the big green «+» button at the bottom → choose 'Expense' → select a category (e.g. Groceries) → enter the amount → tap 'Add'.", action:"fabBtn" },
      { emoji:"💰", title:"Step 3: Add income", text:"Tap «+» → choose 'Income' → select 'Salary' → enter the amount → tap 'Add'. Your balance will update automatically.", action:"fabBtn" },
      { emoji:"📊", title:"Step 4: Check your stats", text:"Go to the 'Stats' tab in the bottom navigation — you'll see pie charts, spending trends and a monthly forecast. The more data you enter, the more accurate the analysis.", action:null },
    ]},
    { id:"budget", icon:"🎯", title:"Budgets & Spending Limits", steps:[
      { emoji:"🎯", title:"What is a budget?", text:"A budget is a monthly spending limit for a category. For example: 'Restaurants — no more than $200 per month'. The app warns you when you're getting close.", action:null },
      { emoji:"⚙️", title:"Step 1: Open Settings", text:"Tap '⚙️ Settings' in the bottom navigation bar.", action:null },
      { emoji:"📋", title:"Step 2: Find the Budgets section", text:"Scroll down to the '💰 Budgets' section. Tap '+ Add budget'.", action:null },
      { emoji:"✍️", title:"Step 3: Set your limit", text:"Choose a category (e.g. 'Groceries'), enter your monthly limit (e.g. $300), tap 'Save'.", action:null },
      { emoji:"🔔", title:"Result", text:"Now when you add an expense in that category, the app shows how much of the limit remains. If you exceed it — you get a warning!", action:null },
    ]},
    { id:"profiles", icon:"👥", title:"Profiles & Family", steps:[
      { emoji:"👥", title:"Why use profiles?", text:"Profiles let each family member have their own separate budget tracking. Dad, Mom, Kids — each with their own balance and history.", action:null },
      { emoji:"⚙️", title:"Step 1: Open Settings", text:"Go to 'Settings' → scroll to the 'Profiles' section.", action:null },
      { emoji:"➕", title:"Step 2: Add a profile", text:"Tap '+ Add profile' → enter a name → choose a color → tap 'Save'.", action:null },
      { emoji:"🔄", title:"Step 3: Switch between profiles", text:"Tap the profile name at the top → choose a different profile. All data is stored separately per profile.", action:null },
      { emoji:"🔗", title:"Shared access", text:"In the profile section tap 'Share' — a link is generated. Send it to a family member — they'll see the shared data in real time.", action:null },
    ]},
    { id:"voice", icon:"🎤", title:"Voice Input", steps:[
      { emoji:"🎤", title:"What is voice input?", text:"Voice input lets you add expenses just by speaking — no typing needed. Perfect when your hands are full.", action:null },
      { emoji:"📱", title:"Requirements", text:"You need Google Chrome on Android or desktop. Safari on iPhone does not support this feature yet.", action:null },
      { emoji:"🔘", title:"Step 1: Find the button", text:"Look for the green 🎤 button on the right side, just above the navigation bar. Or go to: Settings → Advanced features → 'Use voice input now'.", action:"voiceInputBtn" },
      { emoji:"🗣️", title:"Step 2: Speak clearly", text:"Tap 🎤 → wait for 'Listening...' → say your phrase naturally.", action:null },
      { emoji:"✅", title:"Example phrases:", text:"• 'Spent 50 on groceries'\n• 'Bought coffee for 8'\n• 'Paid 15 for a taxi'\n• 'Got salary 1000'\n• 'Received gift 200'", action:null },
    ]},
    { id:"goals", icon:"🌟", title:"Goals & Dreams", steps:[
      { emoji:"🌟", title:"What are goals?", text:"The Goals section lets you save money toward specific dreams — like a new phone, vacation, or car — with a visual progress bar.", action:null },
      { emoji:"🔘", title:"Step 1: Open goals", text:"Tap the yellow 🎯 button on the left side above the navigation. Or: Settings → Advanced features → 'Open my goals'.", action:"goalsNavBtn" },
      { emoji:"➕", title:"Step 2: Create a goal", text:"Enter an emoji, a goal name (e.g. 'iPhone 15 🍎'), the target amount (e.g. $1200), and how much you've already saved.", action:null },
      { emoji:"💰", title:"Step 3: Add savings", text:"Tap '💰 Add savings' next to your goal → enter the amount you're adding. The progress bar fills up!", action:null },
      { emoji:"🎊", title:"Goal achieved!", text:"When your savings reach the target — the app shows confetti and a 'Goal achieved!' message. 🏆 Share the moment!", action:null },
    ]},
    { id:"notifications", icon:"🔔", title:"Reminders & Notifications", steps:[
      { emoji:"🔔", title:"What are reminders?", text:"The app sends you notifications to remind you to record your expenses regularly — so you don't forget.", action:null },
      { emoji:"⚙️", title:"Step 1: Open Settings", text:"Go to '⚙️ Settings' in the bottom navigation → scroll down to the '🔔 Reminders' section.", action:null },
      { emoji:"🔘", title:"Step 2: Tap the button", text:"Tap the big '🔔 Enable reminders' button. Your browser will ask for permission — tap 'Allow'.", action:null },
      { emoji:"⏰", title:"Step 3: Choose frequency", text:"Select how often you want reminders: every 30 minutes, every hour, once a day, etc.", action:null },
      { emoji:"📅", title:"Exact time", text:"You can also set a specific date and time for a reminder — tap the 📅 or ⏰ card and pick your date/time.", action:null },
    ]},
    { id:"export", icon:"📊", title:"Exporting Your Data", steps:[
      { emoji:"📊", title:"Export your data", text:"You can export all your transactions in different formats for backup, sharing, or detailed analysis.", action:null },
      { emoji:"🧮", title:"Step 1: Open Tools", text:"Tap 'Tools' in the bottom navigation bar.", action:null },
      { emoji:"📊", title:"Google Sheets", text:"Tap '📊 Google Sheets export' → download the CSV file → open Google Sheets → File → Import. Your full history in a spreadsheet!", action:null },
      { emoji:"📧", title:"Email report", text:"Tap '📧 Email report' → enter your email → receive a monthly financial summary.", action:null },
      { emoji:"⚙️", title:"Other formats", text:"Settings → Data section: export as JSON (to transfer to another device), CSV, or PDF.", action:null },
    ]},
    { id:"themes", icon:"🎨", title:"Themes & Appearance", steps:[
      { emoji:"🎨", title:"Customize your look", text:"BudgetPRO supports 6 color themes and a dark mode for comfortable use in any lighting.", action:null },
      { emoji:"🌙", title:"Dark mode", text:"Tap the 🌙 button in the top right corner to toggle dark mode. Or enable automatic time-based switching in Settings.", action:"themeToggle" },
      { emoji:"🎨", title:"Color themes", text:"Settings → 'Color theme' → choose from 6 options: Forest Green (default), White, Gold, Sunset, Navy, Dark Gold.", action:null },
      { emoji:"📝", title:"Font size", text:"Settings → 'Font size' → choose Small, Normal, or Large. Useful for easy reading on any screen size.", action:null },
      { emoji:"✨", title:"Simple mode", text:"Settings → 'Simple mode' — a stripped-down interface for users who just want to record expenses without extra details.", action:null },
    ]},
    { id:"newtools", icon:"✨", title:"New Tools", nav:"tools", steps:[
      { emoji:"✨", title:"New Tools section", text:"Go to the '🧮 Tools' tab → scroll down to the '✨ New Tools' block. There are 6 extra features that make the app indispensable!", action:null, nav:"tools" },
      { emoji:"📸", title:"Receipt Scanner", text:"Take a photo of a paper receipt — the app automatically recognizes the total amount using OCR technology and offers to add it as an expense. No manual typing needed!", action:"newScanBtn", nav:"tools" },
      { emoji:"⚖️", title:"50/30/20 Rule", text:"The famous finance rule: 50% of income on needs (food, rent), 30% on wants (restaurants, entertainment), 20% on savings. The 'Calculate' button sets limits automatically!", action:"newRuleBtn", nav:"tools" },
      { emoji:"📊", title:"Google Sheets Export", text:"Tap → download the CSV file → open Google Sheets on your computer → File → Import → select the file. All your transactions appear in a beautiful spreadsheet!", action:"newSheetsBtn", nav:"tools" },
      { emoji:"📧", title:"Email Report", text:"Enter your email and tap 'Send' — receive a beautiful financial report for the current month: income, expenses, balance.", action:"newEmailBtn", nav:"tools" },
      { emoji:"💑", title:"Partner Mode", text:"Create a 'room' → share the code with your partner → both of you see the shared budget in real time. Perfect for couples and families! Requires Firebase setup.", action:"partnerModeBtn", nav:"tools" },
    ]},
  ],
  ka: [
    { id:"basics", icon:"🏠", title:"საფუძვლები: როგორ დაიწყოთ", steps:[
      { emoji:"👋", title:"კეთილი იყოს BudgetPRO-ში!", text:"BudgetPRO არის პირადი ფინანსური ტრეკერი. ის გეხმარებათ გაიგოთ სად მიდის ფული და დაგეგმოთ ბიუჯეტი. რეგისტრაცია არ არის საჭირო — ყველა მონაცემი ინახება მხოლოდ თქვენს მოწყობილობაზე.", action:null },
      { emoji:"💼", title:"ნაბიჯი 1: საწყისი თანხის დაყენება", text:"ეკრანის ზედა ნაწილში 'საწ. თანხა' ბარათს დააჭირეთ → შეიყვანეთ რამდენი ნაღდი ფული ან დანაზოგი გაქვთ ახლა. ეს იქნება თქვენი საწყისი ბალანსი.", action:"salaryCard" },
      { emoji:"➕", title:"ნაბიჯი 2: პირველი ხარჯის დამატება", text:"ქვემოთ დიდ მწვანე «+» ღილაკს დააჭირეთ → 'ხარჯი' → კატეგორია (მაგ. საყიდლები) → თანხა → 'დამატება'.", action:"fabBtn" },
      { emoji:"💰", title:"ნაბიჯი 3: შემოსავლის დამატება", text:"«+» → 'შემოსავალი' → 'ხელფასი' → თანხა → 'დამატება'. ბალანსი ავტომატურად განახლდება.", action:"fabBtn" },
      { emoji:"📊", title:"ნაბიჯი 4: სტატისტიკის ნახვა", text:"'სტატისტიკა' ჩანართზე გადადით — დიაგრამები, ტრენდები, თვიური პროგნოზი. რაც მეტი მონაცემი, მით ზუსტი ანალიზი.", action:null },
    ]},
    { id:"budget", icon:"🎯", title:"ბიუჯეტი და ლიმიტები", steps:[
      { emoji:"🎯", title:"რა არის ბიუჯეტი?", text:"ბიუჯეტი არის ყოველთვიური ხარჯვის ლიმიტი კატეგორიაში. მაგ.: 'რესტორნები — არა უმეტეს 200₾ თვეში'. პროგრამა გაფრთხილებს გადაჭარბებისას.", action:null },
      { emoji:"⚙️", title:"ნაბიჯი 1: პარამეტრების გახსნა", text:"'⚙️ პარამეტრები' ჩანართი ქვემოთ.", action:null },
      { emoji:"📋", title:"ნაბიჯი 2: 'ბიუჯეტების' განყოფილება", text:"გადაახვიეთ ქვემოთ '💰 ბიუჯეტები' განყოფილებამდე. '+ ბიუჯეტის დამატება' დააჭირეთ.", action:null },
      { emoji:"✍️", title:"ნაბიჯი 3: ლიმიტის დაყენება", text:"კატეგორია (მაგ. 'საყიდლები'), ყოველთვიური ლიმიტი (მაგ. 300₾), 'შენახვა'.", action:null },
      { emoji:"🔔", title:"შედეგი", text:"ახლა ამ კატეგორიაში ხარჯის დამატებისას პროგრამა გვიჩვენებს ლიმიტის ნაშთს. გადაჭარბებისას — გაფრთხილება!", action:null },
    ]},
    { id:"profiles", icon:"👥", title:"პროფილები და ოჯახი", steps:[
      { emoji:"👥", title:"რატომ გჭირდებათ პროფილები?", text:"პროფილები საშუალებას გაძლევთ ოჯახის თითოეული წევრისთვის ცალკე ბუღალტერია აწარმოოთ. მამა, დედა, შვილები — თითოეულს საკუთარი ბალანსი.", action:null },
      { emoji:"⚙️", title:"ნაბიჯი 1: პარამეტრების გახსნა", text:"'პარამეტრები' → 'პროფილები' განყოფილება.", action:null },
      { emoji:"➕", title:"ნაბიჯი 2: პროფილის დამატება", text:"'+ პროფილის დამატება' → სახელი → ფერი → 'შენახვა'.", action:null },
      { emoji:"🔄", title:"ნაბიჯი 3: პროფილებს შორის გადართვა", text:"ზევით პროფილის სახელზე დააჭირეთ → სხვა პროფილი. ყველა მონაცემი ცალ-ცალკე ინახება.", action:null },
      { emoji:"🔗", title:"საერთო წვდომა", text:"პროფილის განყოფილებაში 'გაზიარება' → ბმული გენერირდება. გაუგზავნეთ ოჯახის წევრს — ის ნახავს საერთო მონაცემებს.", action:null },
    ]},
    { id:"voice", icon:"🎤", title:"ხმოვანი შეყვანა", steps:[
      { emoji:"🎤", title:"რა არის ხმოვანი შეყვანა?", text:"ხმოვანი შეყვანა საშუალებას გაძლევთ ხარჯები ხმით დაამატოთ — ეკრანის შეხების გარეშე. ძალიან მოსახერხებელია როცა ხელები დაკავებულია.", action:null },
      { emoji:"📱", title:"მოთხოვნები", text:"საჭიროა Google Chrome ბრაუზერი Android-ზე ან კომპიუტერზე. iPhone-ზე Safari ამ ფუნქციას არ უჭერს მხარს.", action:null },
      { emoji:"🔘", title:"ნაბიჯი 1: ღილაკის პოვნა", text:"მწვანე 🎤 ღილაკი მარჯვნივ ქვემოთ, ნავიგაციის ზევით. ან: პარამეტრები → გაფართოებული ფუნქციები → 'ხმოვანი შეყვანის გამოყენება'.", action:"voiceInputBtn" },
      { emoji:"🗣️", title:"ნაბიჯი 2: ილაპარაკეთ", text:"🎤 დააჭირეთ → 'ილაპარაკეთ...' → თქვით თქვენი ფრაზა.", action:null },
      { emoji:"✅", title:"ფრაზების მაგალითები:", text:"• «50 ლარი დავხარჯე საყიდლებზე»\n• «ყავა ვიყიდე 8 ლარად»\n• «ტაქსი გადავიხადე 15»\n• «ხელფასი მივიღე 1000»", action:null },
    ]},
    { id:"goals", icon:"🌟", title:"მიზნები და ოცნებები", steps:[
      { emoji:"🌟", title:"რა არის მიზნები?", text:"'მიზნების' განყოფილება საშუალებას გაძლევთ ფული კონკრეტული ოცნებებისთვის დაზოგოთ — ვიზუალური პროგრეს-ბარით.", action:null },
      { emoji:"🔘", title:"ნაბიჯი 1: მიზნების გახსნა", text:"ყვითელი 🎯 ღილაკი მარცხნივ ქვემოთ. ან: პარამეტრები → გაფართოებული ფუნქციები → 'ჩემი მიზნების გახსნა'.", action:"goalsNavBtn" },
      { emoji:"➕", title:"ნაბიჯი 2: მიზნის შექმნა", text:"emoji, სახელი (მაგ. 'iPhone 15 🍎'), სამიზნე თანხა (მაგ. 1200₾), უკვე დაზოგილი თანხა.", action:null },
      { emoji:"💰", title:"ნაბიჯი 3: შევსება", text:"'💰 შევსება' → შეიყვანეთ თქვენ მიერ დამატებული თანხა. პროგრეს-ბარი ივსება!", action:null },
      { emoji:"🎊", title:"მიზნის მიღწევა!", text:"როცა დანაზოგი სამიზნეს მიაღწევს — პროგრამა კონფეტს აჩვენებს და 'მიზანი მიღწეულია!' 🏆", action:null },
    ]},
    { id:"notifications", icon:"🔔", title:"შეხსენებები", steps:[
      { emoji:"🔔", title:"რა არის შეხსენებები?", text:"პროგრამა გამოგიგზავნით შეტყობინებებს, რომ გაგახსენოთ ხარჯების რეგულარულად ჩაწერა.", action:null },
      { emoji:"⚙️", title:"ნაბიჯი 1: პარამეტრების გახსნა", text:"'⚙️ პარამეტრები' → ქვემოთ '🔔 შეხსენებები' განყოფილება.", action:null },
      { emoji:"🔘", title:"ნაბიჯი 2: ღილაკზე დაჭერა", text:"დიდ '🔔 შეხსენებების ჩართვა' ღილაკს დააჭირეთ. ბრაუზერი ნებართვას ითხოვს — 'Allow' დააჭირეთ.", action:null },
      { emoji:"⏰", title:"ნაბიჯი 3: ინტერვალის არჩევა", text:"აირჩიეთ რამდენად ხშირად გინდათ შეხსენებები: ყოველ 30 წუთში, ყოველ საათში, დღეში ერთხელ და ა.შ.", action:null },
      { emoji:"📅", title:"ზუსტი დრო", text:"შეგიძლიათ ასევე კონკრეტული დრო დააყენოთ — 📅 ან ⏰ ბარათს დააჭირეთ და თარიღი/დრო აირჩიეთ.", action:null },
    ]},
    { id:"export", icon:"📊", title:"მონაცემების ექსპორტი", steps:[
      { emoji:"📊", title:"მონაცემების ექსპორტი", text:"შეგიძლიათ ყველა ოპერაცია სხვადასხვა ფორმატში გამოიყვანოთ შენახვის ან ანალიზისთვის.", action:null },
      { emoji:"🧮", title:"ნაბიჯი 1: ხელსაწყოების გახსნა", text:"'ხელსაწყოები' ჩანართი ნავიგაციაში.", action:null },
      { emoji:"📊", title:"Google Sheets", text:"'📊 Google Sheets-ში ექსპორტი' → CSV-ის ჩამოტვირთვა → Google Sheets → ფაილი → იმპორტი. ყველა ოპერაცია ცხრილში!", action:null },
      { emoji:"📧", title:"Email ანგარიში", text:"'📧 Email ანგარიში' → email → მიიღეთ ყოველთვიური ფინანსური ანგარიში.", action:null },
      { emoji:"⚙️", title:"სხვა ფორმატები", text:"პარამეტრები → 'მონაცემები': JSON (სხვა მოწყობილობაზე გადასატანად), CSV, PDF.", action:null },
    ]},
    { id:"themes", icon:"🎨", title:"თემები და გარეგნობა", steps:[
      { emoji:"🎨", title:"გარეგნობის მორგება", text:"BudgetPRO-ს აქვს 6 ფერადი თემა და ბნელი რეჟიმი კომფორტული გამოყენებისთვის.", action:null },
      { emoji:"🌙", title:"ბნელი რეჟიმი", text:"ზედა მარჯვენა კუთხეში 🌙 ღილაკს დააჭირეთ. ან ჩართეთ ავტომატური გადართვა დროის მიხედვით პარამეტრებში.", action:"themeToggle" },
      { emoji:"🎨", title:"ფერადი თემები", text:"პარამეტრები → 'ფერადი თემა' → 6 ვარიანტიდან: ტყის მწვანე (ნაგულისხმევი), თეთრი, ოქროსფერი, მზის ჩასვლა, მუქი ლურჯი, მუქი ოქრო.", action:null },
      { emoji:"📝", title:"შრიფტის ზომა", text:"პარამეტრები → 'შრიფტის ზომა' → მცირე, ნორმალური ან დიდი. სასარგებლოა ნებისმიერ ეკრანზე კითხვისთვის.", action:null },
      { emoji:"✨", title:"მარტივი რეჟიმი", text:"პარამეტრები → 'მარტივი რეჟიმი' — გამარტივებული ინტერფეისი მათთვის ვისაც მხოლოდ ხარჯების ჩაწერა სჭირდება.", action:null },
    ]},
    { id:"newtools", icon:"✨", title:"ახალი ხელსაწყოები", nav:"tools", steps:[
      { emoji:"✨", title:"ახალი ხელსაწყოების განყოფილება", text:"'🧮 ხელსაწყოები' ჩანართი → გადაახვიეთ ქვემოთ '✨ ახალი ხელსაწყოები' ბლოკამდე. 6 დამატებითი ფუნქცია!", action:null, nav:"tools" },
      { emoji:"📸", title:"ჩეკის სკანერი", text:"ფოტოგრაფირეთ ქაღალდის ჩეკი — პროგრამა ავტომატურად ამოიცნობს ჯამს OCR ტექნოლოგიით და შესთავაზებს ხარჯის დამატებას. ხელით შეყვანა არ სჭირდება!", action:"newScanBtn", nav:"tools" },
      { emoji:"⚖️", title:"50/30/20 წესი", text:"ცნობილი ფინანსური წესი: შემოსავლის 50% — საჭიროებებზე, 30% — სურვილებზე, 20% — დანაზოგებზე. 'გამოანგარიშება' ღილაკი ავტომატურად ადგენს ლიმიტებს!", action:"newRuleBtn", nav:"tools" },
      { emoji:"📊", title:"Google Sheets-ის ექსპორტი", text:"ჩამოტვირთეთ CSV → Google Sheets → ფაილი → იმპორტი. ყველა ოპერაცია ლამაზ ცხრილში!", action:"newSheetsBtn", nav:"tools" },
      { emoji:"📧", title:"Email ანგარიში", text:"ჩაწერეთ email და დააჭირეთ 'გაგზავნა' — მიიღებთ ამ თვის ფინანსურ ანგარიშს: შემოსავლები, ხარჯები, ბალანსი.", action:"newEmailBtn", nav:"tools" },
      { emoji:"💑", title:"პარტნიორის რეჟიმი", text:"შექმენით 'ოთახი' → გაუზიარეთ კოდი პარტნიორს → ორივე ხედავთ საერთო ბიუჯეტს რეალურ დროში. Firebase-ის კონფიგურაცია საჭიროა.", action:"partnerModeBtn", nav:"tools" },
    ]},
  ],
};

function openInteractiveGuide() {
  const lang = currentLang;
  const topics = GUIDE_TOPICS[lang] || GUIDE_TOPICS.ru;

  let currentTopic = null;
  let currentStep = 0;

  const ov = document.createElement("div");
  ov.id = "guideOverlay";
  ov.style.cssText = "position:fixed;inset:0;z-index:99998;overflow-y:auto;background:var(--cream);animation:fadeIn 0.3s ease both;";

  function renderTopicList() {
    const L = {
      ru:{ title:"📚 Интерактивный гид", sub:"Выберите тему которую хотите изучить", close:"✕ Закрыть" },
      en:{ title:"📚 Interactive Guide", sub:"Choose the topic you want to learn", close:"✕ Close" },
      ka:{ title:"📚 ინტერაქტიული სახელმძღვანელო", sub:"აირჩიეთ სასწავლი თემა", close:"✕ დახურვა" },
    }[lang]||{title:"📚 Guide",sub:"Choose a topic",close:"✕ Close"};

    ov.innerHTML = `
      <div style="max-width:480px;margin:0 auto;padding:24px 20px 40px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:20px;font-weight:900;color:var(--text);">${L.title}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${L.sub}</div>
          </div>
          <button id="guideClose" style="background:var(--cream-dark);border:none;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:10px;">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${topics.map((t,i) => `<button class="guide-topic-btn" data-ti="${i}" style="display:flex;align-items:center;gap:14px;padding:16px;background:var(--card-bg);border:1.5px solid var(--cream-border);border-radius:18px;cursor:pointer;font-family:inherit;text-align:left;transition:all 0.2s;width:100%;">
            <div style="font-size:28px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:var(--primary-pale);border-radius:12px;flex-shrink:0;">${t.icon}</div>
            <div style="flex:1;">
              <div style="font-weight:800;font-size:15px;color:var(--text);">${t.title}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${t.steps.length} ${lang==="ru"?"шагов":lang==="en"?"steps":"ნაბიჯი"}</div>
            </div>
            <div style="font-size:20px;color:var(--text-muted);">›</div>
          </button>`).join("")}
        </div>
      </div>`;

    ov.querySelector("#guideClose")?.addEventListener("click", () => { clearSpotlight(); ov.remove(); });
    ov.querySelectorAll(".guide-topic-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentTopic = parseInt(btn.dataset.ti);
        currentStep = 0;
        renderStep();
      });
      btn.addEventListener("mouseenter", () => btn.style.transform = "translateY(-2px)");
      btn.addEventListener("mouseleave", () => btn.style.transform = "");
    });
  }

  function renderStep() {
    const topic = topics[currentTopic];
    const step = topic.steps[currentStep];
    const isLast = currentStep === topic.steps.length - 1;
    const L = {
      ru:{ back:"← Темы", prev:"← Назад", next:"Далее →", done:"✅ Понятно!", step:"Шаг", skip:"✕ Пропустить", show:"👆 Показать на экране" },
      en:{ back:"← Topics", prev:"← Back", next:"Next →", done:"✅ Got it!", step:"Step", skip:"✕ Skip guide", show:"👆 Show on screen" },
      ka:{ back:"← თემები", prev:"← უკან", next:"შემდეგი →", done:"✅ გასაგებია!", step:"ნაბიჯი", skip:"✕ გამოტოვება", show:"👆 ეკრანზე ჩვენება" },
    }[lang]||{back:"← Topics",prev:"← Back",next:"Next →",done:"✅ Got it!",step:"Step",skip:"✕ Skip",show:"👆 Show"};

    // Navigate to correct tab first, then highlight element
    if (step.nav && typeof setTab === "function") {
      setTab(step.nav);
      if (step.action) setTimeout(() => highlightElement(step.action), 600);
    } else if (step.action) {
      setTimeout(() => highlightElement(step.action), 250);
    }

    ov.innerHTML = `
      <div style="max-width:480px;margin:0 auto;padding:18px 16px 36px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <button id="guideBack" style="background:var(--cream-dark);border:1.5px solid var(--cream-border);border-radius:20px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;color:var(--text);">${L.back}</button>
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);">${topic.icon} ${L.step} ${currentStep+1}/${topic.steps.length}</div>
          <button id="guideSkip" style="background:none;border:none;color:var(--text-muted);font-size:12px;cursor:pointer;padding:8px;">${L.skip}</button>
        </div>
        <div style="height:5px;background:var(--cream-dark);border-radius:99px;overflow:hidden;margin-bottom:18px;">
          <div style="width:${Math.round(((currentStep+1)/topic.steps.length)*100)}%;height:100%;background:var(--primary);border-radius:99px;transition:width 0.35s ease;"></div>
        </div>
        <div style="font-size:11px;font-weight:800;color:var(--primary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">${topic.icon} ${topic.title}</div>
        <div style="background:var(--card-bg);border-radius:20px;padding:22px 18px;border:1.5px solid var(--cream-border);margin-bottom:16px;text-align:center;">
          <div style="font-size:52px;line-height:1;margin-bottom:12px;">${step.emoji}</div>
          <div style="font-size:17px;font-weight:900;color:var(--text);margin-bottom:10px;line-height:1.3;">${step.title}</div>
          <div style="font-size:13px;line-height:1.75;color:var(--text-soft);text-align:left;white-space:pre-line;">${step.text}</div>
          ${step.action ? `<button id="guideShowBtn" style="margin-top:14px;padding:10px 18px;border-radius:20px;background:var(--gold-pale);border:2px solid var(--gold);color:var(--text);font-size:13px;font-weight:800;cursor:pointer;">${L.show}</button>` : ""}
        </div>
        <div style="display:flex;gap:10px;">
          ${currentStep > 0 ? `<button id="guidePrev" class="btn-secondary" style="flex:1;padding:14px;">${L.prev}</button>` : ""}
          <button id="guideNext" class="btn-primary" style="flex:2;padding:14px;font-size:15px;font-weight:800;">${isLast ? L.done : L.next}</button>
        </div>
      </div>`;

    ov.querySelector("#guideBack")?.addEventListener("click", () => { clearSpotlight(); currentTopic = null; renderTopicList(); });
    ov.querySelector("#guideSkip")?.addEventListener("click", () => { clearSpotlight(); ov.remove(); haptic("light"); });
    ov.querySelector("#guidePrev")?.addEventListener("click", () => { currentStep--; renderStep(); haptic("light"); });
    ov.querySelector("#guideNext")?.addEventListener("click", () => {
      if (isLast) { clearSpotlight(); currentTopic = null; renderTopicList(); }
      else { currentStep++; renderStep(); }
      haptic("light");
    });
    ov.querySelector("#guideShowBtn")?.addEventListener("click", () => { highlightElement(step.action); haptic("medium"); });
  }

  // ── Spotlight system ──
  let spotlightEl = null;
  function clearSpotlight() {
    document.getElementById("guideBeacon")?.remove();
    if (spotlightEl) { spotlightEl.style.outline = ""; spotlightEl.style.outlineOffset = ""; spotlightEl = null; }
  }
  function highlightElement(id) {
    clearSpotlight();
    const el = document.getElementById(id);
    if (!el) return;
    spotlightEl = el;
    el.scrollIntoView({ behavior:"smooth", block:"center" });
    el.style.outline = "3px solid var(--gold)";
    el.style.outlineOffset = "4px";
    const beacon = document.createElement("div");
    beacon.id = "guideBeacon";
    const rect = el.getBoundingClientRect();
    beacon.style.cssText = `position:fixed;left:${rect.left+rect.width/2-18}px;top:${rect.top+rect.height/2-18}px;width:36px;height:36px;border-radius:50%;border:3px solid var(--gold);z-index:99997;pointer-events:none;background:rgba(212,167,60,0.2);animation:beaconPulse 1s ease infinite;`;
    if (!document.getElementById("beaconStyle")) { const s=document.createElement("style"); s.id="beaconStyle"; s.textContent="@keyframes beaconPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.7);opacity:0.2}}"; document.head.appendChild(s); }
    document.body.appendChild(beacon);
    setTimeout(clearSpotlight, 5000);
  }


  document.body.appendChild(ov);
  renderTopicList();
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
