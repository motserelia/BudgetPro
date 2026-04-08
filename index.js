/* ============================================================
   МОЙ БЮДЖЕТ — index.js (исправленная версия)
   - Начальная сумма отображается в доходах
   - Клик по карточке "Доходы"/"Расходы" → фильтр + плавная прокрутка + тост
   - Добавлена анимированная круговая диаграмма в статистике
   ============================================================ */

// ============================================================
// МУЛЬТИЯЗЫЧНОСТЬ
// ============================================================
const translations = {
  ru: {
    appName: "🌿 Мой Бюджет",
    balance: "Мой баланс / Остаток",
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
    note: "Заметка",
    selectCategory: "— выберите категорию —",
    noSubcategory: "— без подкатегории —",
    allHistory: "📜 Вся история операций",
    historyHint: "Нажмите, чтобы увидеть все ваши записи за всё время",
    editBalance: "Изменить начальную сумму",
    editSalaryHint: "👆 Нажмите, чтобы изменить",
    totalIncome: "📈 Всего доходов",
    totalExpense: "📉 Всего расходов",
    currentBalance: "💎 Текущий баланс / Остаток",
    salary_label: "💼 Начальная сумма",
    noOperations:
      "Пока нет записей.\nНажмите зелёную кнопку «Добавить» внизу ↓",
    newOperation: "Новая операция",
    editOperation: "Изменить запись",
    confirmDelete: "Удалить эту запись?",
    confirmDeleteAll: "Удалить ВСЕ записи?",
    enterAmount: "Введите сумму",
    enterPositive: "Сумма должна быть больше нуля",
    selectCategoryFirst: "Пожалуйста, выберите категорию",
    calculator: "🧮 Калькулятор",
    converter: "💱 Конвертер валют",
    calcHint: "Нажимайте цифры и знаки, как на обычном калькуляторе",
    convHint: "Введите сумму, выберите «из» и «в» — нажмите «Перевести»",
    fromCurrency: "Из валюты",
    toCurrency: "В валюту",
    sumLabel: "Сумма",
    history: "История",
    clearHistory: "Очистить историю",
    convert: "Перевести",
    convertResult: "Результат",
    newPage: "Новая страница",
    pageTitle: "Название страницы",
    content: "Текст заметки",
    noPages: "Нет страниц.\nНажмите «Новая страница» выше",
    notebookHint:
      "Здесь храните важные заметки: номера телефонов, напоминания, планы трат.",
    addCategory: "Добавить категорию расходов",
    addIncomeCategory: "Добавить категорию доходов",
    deleteCategory: "Удалить категорию",
    addSubcategory: "Добавить подкатегорию",
    incomeCats: "💰 Категории доходов",
    expCatsTitle: "📉 Категории расходов",
    catHint:
      "Категории помогают группировать расходы и доходы. Нажмите на название категории, чтобы изменить его.",
    newExpCatTitle: "Новая категория расходов",
    newIncCatTitle: "Новая категория доходов",
    editCatTitle: "Изменить название категории",
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
    updateRates: "🔄 Обновить курсы валют",
    resetAll: "🗑️ Сбросить всё",
    proVersion: "🌟 Открыть Pro-версию",
    currency: "🌍 Показывать суммы в валюте",
    explanationCurrency: "В какой валюте показывать все суммы на экране.",
    explanationTheme: "Светлый или тёмный фон — выберите, что удобнее глазам.",
    explanationLanguage: "Выберите язык приложения.",
    explanationRates: "Загрузить свежие курсы валют из интернета.",
    explanationReset: "Удалить все данные и начать заново.",
    explanationPro: "Расширенная версия с графиками и экспортом данных.",
    currRUB: "₽ Российский рубль",
    currUSD: "$ Доллар США",
    currEUR: "€ Евро",
    currGEL: "₾ Грузинский лари",
    currGBP: "£ Фунт стерлингов",
    currKZT: "₸ Казахстанский тенге",
    rub: "₽",
    usd: "$",
    eur: "€",
    gel: "₾",
    gbp: "£",
    kzt: "₸",
    ok: "Понятно",
    error: "Ошибка",
    allOps: "Все операции",
    clearAllOps: "Удалить всю историю",
    editNote: "Редактировать",
    saved: "✓ Сохранено",
    deleted: "🗑 Удалено",
    ratesUpdated: "✓ Курсы обновлены",
    resetDone: "✓ Всё сброшено",
    welcomeTitle: "Добро пожаловать! 👋",
    welcomeText:
      "Здесь вы можете записывать доходы и расходы. Нажмите зелёную кнопку «Добавить» внизу, чтобы начать.",
    welcomeClose: "Понятно, начинаем!",
    expCategory: "Категория расходов",
    incCategory: "Категория доходов",
    expSub: "Подкатегория (необязательно)",
    amountHint: "Введите число, например: 150",
    dateHint: "Дата операции",
    noteHint: "Можно оставить пустым",
    addSubHint: "Подкатегория помогает уточнить трату (необязательно)",
    cardHintBalance: "Сколько у вас сейчас",
    cardHintIncome: "Всего получено",
    cardHintExpense: "Всего потрачено",
    cardHintSalary: "👆 Нажмите чтобы изменить",
    recentOpsLabel: "📋 История доходов и расходов",
    recentOpsHint: "Нажмите на любую запись — чтобы изменить или удалить",
    addCatModalTitle: "Добавить категорию",
    catTypeLabel: "Выберите тип категории",
    catTypeExpenseTitle: "💸 Расходы",
    catTypeExpenseDesc:
      "Покупки, оплата услуг, коммунальные платежи и любые траты",
    catTypeIncomeTitle: "💰 Доходы",
    catTypeIncomeDesc:
      "Зарплата, пенсия, подарки, фриланс и другие поступления",
    catNamePlaceholder: "Например: «Транспорт» или «Аптека»",
    noStatsYet: "Добавьте первые записи,\nчтобы увидеть статистику",
    salaryModalHint:
      "💡 Это начальная сумма — деньги, с которых вы начинаете учёт. Обычно это зарплата или сбережения.",
    catFieldDesc: "Название категории этой записи",
    statsTransCount: "записей",
    statsSaved: "💾 Сохранено",
    statsSavingsRate: "от доходов сохранено",
    statsHealthy: "✅ Бюджет в норме — расходы меньше доходов",
    statsWarning: "⚠️ Осторожно — расходы превышают доходы",
    statsBreakeven: "〰️ Расходы равны доходам",
    statsSpentOf: "потрачено из доходов",
    statsIncomeSection: "📈 Из чего состоят доходы",
    statsExpSection: "📉 На что уходят деньги",
    statsTotalOps: "Всего записей",
    appFooter:
      "Мой Бюджет v2.0 · Работает без интернета 📴\nВсе данные хранятся только на вашем устройстве 🔒",
    historyEmpty: "История пуста",
    loading: "⏳ Загрузка...",
    ariaDeleteOp: "Удалить запись",
    ariaEditOp: "Изменить",
    ariaDeleteOp2: "Удалить",
    addOpTypeDesc: "Выберите, на что потратили или откуда получили деньги",
    incomeAdded: "✓ Доход добавлен!",
    expenseAdded: "✓ Расход добавлен!",
    newNotebookTitle: "📝 Новая заметка",
    notebookPlaceholder: "Пишите здесь...",
    currencyChanged: "✓ Валюта изменена",
    themeChanged: "✓ Тема изменена",
    resetConfirmMsg:
      "Все записи, заметки и настройки будут удалены. Это нельзя отменить.",
    proComingSoon: "🌟 Pro-версия скоро будет доступна!",
    themeLight: "☀️ Светлая тема",
    themeDark: "🌙 Тёмная тема",
    yesDeleteAll: "✓ Да, удалить всё",
    resetConfirmTitle: "Сбросить всё?",
    defaultNotePage: "📝 Заметка",
    calcError: "Ошибка",
    confirmOkBtn: "✓ Да, удалить",
    toggleTheme: "Переключить тему",
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
    helpContent: `
<div style="font-family: inherit;">
  <h3>🌿 Добро пожаловать в «Мой Бюджет»!</h3>
  <p>Это приложение помогает вести учёт личных финансов — записывать доходы и расходы, анализировать траты, планировать бюджет. Все данные хранятся только на вашем устройстве и никуда не передаются.</p>

  <h4>📌 Главный экран</h4>
  <ul>
    <li><strong>Карточки сверху:</strong> показывают ваш текущий баланс, общую сумму доходов, расходов и начальную сумму (стартовый капитал). Нажмите на карточку «Начальная сумма», чтобы изменить её. Нажмите на «Доходы» или «Расходы» – увидите только операции этого типа.</li>
    <li><strong>Кнопка «📜 Вся история операций»</strong> – открывает полный список всех ваших записей с возможностью редактирования и удаления.</li>
    <li><strong>Список последних операций</strong> – вы видите до 50 последних записей. Каждую можно отредактировать (нажав на неё) или удалить (крестик справа).</li>
  </ul>

  <h4>➕ Добавление новой операции</h4>
  <p>Нажмите на зелёную круглую кнопку с плюсом внизу экрана. Выберите тип (расход или доход), категорию (и подкатегорию, если нужно), укажите сумму, дату и необязательную заметку. Нажмите «Добавить» – запись сохранится.</p>

  <h4>📊 Статистика</h4>
  <ul>
    <li><strong>Статус бюджета</strong> – оценка вашего финансового здоровья (хорошо, предупреждение, критично).</li>
    <li><strong>Ключевые показатели</strong> – баланс, начальная сумма, доходы, расходы.</li>
    <li><strong>Сбережения и соотношение</strong> – наглядный спидометр и круговая диаграмма.</li>
    <li><strong>Динамика по месяцам</strong> – столбчатый график доходов и расходов за последние 6 месяцев (только те месяцы, где есть операции).</li>
    <li><strong>Круговая диаграмма расходов</strong> – топ-5 категорий трат.</li>
    <li><strong>Детальный разбор по категориям</strong> – сколько и на что потрачено/получено, процент от общего объёма.</li>
    <li><strong>Советы по бюджету</strong> – персональные рекомендации на основе ваших данных.</li>
  </ul>

  <h4>🧮 Инструменты</h4>
  <ul>
    <li><strong>Калькулятор</strong> – простой калькулятор с историей вычислений.</li>
    <li><strong>Конвертер валют</strong> – пересчёт между рублями, долларами, евро, лари, фунтами, тенге. Курсы можно обновить в настройках.</li>
  </ul>

  <h4>📓 Блокнот</h4>
  <p>Храните важные заметки: планы, напоминания, списки покупок. Создавайте, редактируйте, удаляйте страницы.</p>

  <h4>🗂️ Категории</h4>
  <p>Управляйте категориями расходов и доходов. Добавляйте новые, переименовывайте, удаляйте. Также можно создавать подкатегории для более детальной группировки.</p>

  <h4>⚙️ Настройки</h4>
  <ul>
    <li><strong>Валюта</strong> – выберите, в какой валюте отображать суммы (рубли, доллары, евро, лари, фунты, тенге).</li>
    <li><strong>Тема</strong> – светлая или тёмная.</li>
    <li><strong>Язык</strong> – русский, английский, грузинский.</li>
    <li><strong>Обновить курсы валют</strong> – загрузить свежие курсы из интернета.</li>
    <li><strong>Сбросить всё</strong> – удалить все ваши данные и начать с чистого листа.</li>
  </ul>

  <h4>🎓 Интерактивный гайд</h4>
  <p>Если вы видите эту справку через кнопку «?», то для запуска пошагового тура с подсветкой элементов нажмите на соседнюю кнопку с иконкой 🎓. Гайд покажет вам основные элементы интерфейса.</p>

  <h4>💡 Полезные советы</h4>
  <ul>
    <li>Регулярно записывайте траты – так вы лучше контролируете бюджет.</li>
    <li>Используйте категории и подкатегории для удобного анализа.</li>
    <li>Следите за динамикой в статистике, чтобы видеть прогресс.</li>
    <li>Приложение работает полностью офлайн – интернет нужен только для обновления курсов валют.</li>
  </ul>
  <p style="margin-top: 12px;"><strong>🌿 Приятного использования!</strong></p>
</div>
`,
    guideNext: "Далее",
    guideSkip: "Пропустить",
    guideFinish: "Готово",
    guideSteps: [
      {
        element: ".top-cards",
        title: "Карточки сводки",
        desc: "Здесь отображается ваш баланс, доходы, расходы и начальная сумма.",
      },
      {
        element: ".fab",
        title: "Добавить операцию",
        desc: "Нажмите на эту зелёную кнопку, чтобы добавить новый доход или расход.",
      },
      {
        element: ".bottom-nav",
        title: "Навигация",
        desc: "Переключайтесь между разделами: Главная, Статистика, Инструменты, Блокнот, Категории, Настройки.",
      },
    ],
    statsBudgetStatus: "Статус бюджета",
    statsKeyMetrics: "Ключевые показатели",
    statsSavingsGauge: "💾 Сбережения",
    statsRatio: "⚖️ Соотношение",
    statsMonthlyDyn: "📅 Динамика по месяцам",
    statsExpCats: "📉 На что уходят деньги",
    statsIncCats: "📈 Источники дохода",
    statsTips: "🧠 Советы по бюджету",
    statsSummaryTable: "📋 Итого",
    statsStartAmt: "💼 Начальная сумма",
    statsTotalIncLabel: "📈 Всего доходов",
    statsTotalExpLabel: "📉 Всего расходов",
    statsBalanceLabel: "💎 Текущий остаток",
    statsTotalOpsLabel: "📁 Всего операций",
    statsSavingsLabel: "💾 Доля сбережений",
    statsRemaining: "Остаток",
    statsSaved2: "сберегается",
    statsSpentOf2: "трат",
    statsChartNote:
      "Высота столбца пропорциональна максимальной сумме за период",
    statsMoreCats: "ещё категорий",
    statsTipHighCat: "категория занимает % всех расходов — это много.",
    statsTipSaveLow:
      "Финансовые эксперты рекомендуют сберегать минимум 10% доходов.",
    statsTipNoIncome:
      "Добавьте источники дохода, чтобы видеть полную картину бюджета.",
    statsTipGoodSaving:
      "Отличный показатель! Подумайте об инвестировании части сбережений.",
    statsBudgetMinus: "Бюджет в минусе",
    statsBudgetMinusDesc: "Расходы превышают поступления на",
    statsBudgetGreat: "Отличный результат!",
    statsBudgetGreatDesc: "Вы сберегаете % от поступлений — так держать!",
    statsBudgetOk: "Бюджет в норме",
    statsBudgetOkDesc: "Расходы под контролем, сбережения: %",
    statsBudgetAlmost: "Почти в ноль",
    statsBudgetAlmostDesc:
      "Сберегается только % — постарайтесь сократить расходы",
    statsRec: "зап.",
    statsInc2: "дох.",
    statsExp2: "расх.",
  },
  en: {
    appName: "🌿 My Budget",
    balance: "My balance / Remaining",
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
    note: "Note",
    selectCategory: "— select a category —",
    noSubcategory: "— no subcategory —",
    allHistory: "📜 Full transaction history",
    historyHint: "Tap to see all your records",
    editBalance: "Edit starting amount",
    editSalaryHint: "👆 Tap to change",
    totalIncome: "📈 Total income",
    totalExpense: "📉 Total expenses",
    currentBalance: "💎 Current balance",
    salary_label: "💼 Starting amount",
    noOperations: "No records yet.\nTap the green «Add» button below ↓",
    newOperation: "New transaction",
    editOperation: "Edit record",
    confirmDelete: "Delete this record?",
    confirmDeleteAll: "Delete ALL records?",
    enterAmount: "Enter amount",
    enterPositive: "Amount must be greater than zero",
    selectCategoryFirst: "Please select a category first",
    calculator: "🧮 Calculator",
    converter: "💱 Currency converter",
    calcHint: "Press numbers and signs just like a regular calculator",
    convHint: "Enter an amount, choose from and to — tap Convert",
    fromCurrency: "From",
    toCurrency: "To",
    sumLabel: "Amount",
    history: "History",
    clearHistory: "Clear history",
    convert: "Convert",
    convertResult: "Result",
    newPage: "New page",
    pageTitle: "Page title",
    content: "Note text",
    noPages: "No pages.\nTap «New page» above",
    notebookHint:
      "Store important notes here: phone numbers, reminders, spending plans.",
    addCategory: "Add expense category",
    addIncomeCategory: "Add income category",
    deleteCategory: "Delete category",
    addSubcategory: "Add subcategory",
    incomeCats: "💰 Income categories",
    expCatsTitle: "📉 Expense categories",
    catHint:
      "Categories help group expenses and income. Tap a category name to rename it.",
    newExpCatTitle: "New expense category",
    newIncCatTitle: "New income category",
    editCatTitle: "Edit category name",
    editSubcatTitle: "Edit subcategory",
    newSubcatTitle: "New subcategory",
    catNameLabel: "Enter a name:",
    newName: "New name:",
    inCategoryLabel: "In category:",
    theme: "🎨 Appearance",
    light: "☀️ Light",
    dark: "🌙 Dark",
    language: "🌐 Language",
    data: "💾 Data",
    updateRates: "🔄 Update exchange rates",
    resetAll: "🗑️ Reset all data",
    proVersion: "🌟 Open Pro version",
    currency: "🌍 Show amounts in currency",
    explanationCurrency: "Choose in which currency to display all amounts.",
    explanationTheme: "Light or dark background.",
    explanationLanguage: "Choose the app language.",
    explanationRates: "Download current exchange rates.",
    explanationReset: "Delete all data and start fresh.",
    explanationPro: "Advanced version with charts and data export.",
    currRUB: "₽ Russian Ruble",
    currUSD: "$ US Dollar",
    currEUR: "€ Euro",
    currGEL: "₾ Georgian Lari",
    currGBP: "£ British Pound",
    currKZT: "₸ Kazakhstani Tenge",
    rub: "₽",
    usd: "$",
    eur: "€",
    gel: "₾",
    gbp: "£",
    kzt: "₸",
    ok: "OK",
    error: "Error",
    allOps: "All operations",
    clearAllOps: "Delete all history",
    editNote: "Edit",
    saved: "✓ Saved",
    deleted: "🗑 Deleted",
    ratesUpdated: "✓ Rates updated",
    resetDone: "✓ All reset",
    welcomeTitle: "Welcome! 👋",
    welcomeText:
      "Here you can record income and expenses. Tap the green «Add» button below.",
    welcomeClose: "Got it, let's start!",
    expCategory: "Expense category",
    incCategory: "Income category",
    expSub: "Subcategory (optional)",
    amountHint: "Enter a number, e.g. 150",
    dateHint: "Date of transaction",
    noteHint: "Can be left empty",
    addSubHint: "Subcategory helps clarify the expense (optional)",
    cardHintBalance: "How much you have now",
    cardHintIncome: "Total received",
    cardHintExpense: "Total spent",
    cardHintSalary: "👆 Tap to change",
    recentOpsLabel: "📋 Income and expense history",
    recentOpsHint: "Tap any record to edit or delete it",
    addCatModalTitle: "Add category",
    catTypeLabel: "Choose category type",
    catTypeExpenseTitle: "💸 Expenses",
    catTypeExpenseDesc: "Purchases, bills, utilities and any spending",
    catTypeIncomeTitle: "💰 Income",
    catTypeIncomeDesc: "Salary, pension, gifts, freelance and other earnings",
    catNamePlaceholder: "E.g. «Transport» or «Pharmacy»",
    noStatsYet: "Add your first records\nto see statistics",
    salaryModalHint:
      "💡 This is your starting amount — the money you begin tracking with.",
    catFieldDesc: "Name of the category for this record",
    statsTransCount: "records",
    statsSaved: "💾 Saved",
    statsSavingsRate: "of income saved",
    statsHealthy: "✅ Budget is healthy",
    statsWarning: "⚠️ Expenses exceed income",
    statsBreakeven: "〰️ Expenses equal income",
    statsSpentOf: "spent of income",
    statsIncomeSection: "📈 Income breakdown",
    statsExpSection: "📉 Where money goes",
    statsTotalOps: "Total records",
    appFooter:
      "My Budget v2.0 · Works offline 📴\nAll data stored on your device 🔒",
    historyEmpty: "History is empty",
    loading: "⏳ Loading...",
    ariaDeleteOp: "Delete",
    ariaEditOp: "Edit",
    ariaDeleteOp2: "Delete",
    addOpTypeDesc: "Choose what you spent on or where income came from",
    incomeAdded: "✓ Income added!",
    expenseAdded: "✓ Expense added!",
    newNotebookTitle: "📝 New note",
    notebookPlaceholder: "Write here...",
    currencyChanged: "✓ Currency changed",
    themeChanged: "✓ Theme changed",
    resetConfirmMsg: "All records, notes and settings will be deleted.",
    proComingSoon: "🌟 Pro version coming soon!",
    themeLight: "☀️ Light theme",
    themeDark: "🌙 Dark theme",
    yesDeleteAll: "✓ Yes, delete all",
    resetConfirmTitle: "Reset everything?",
    defaultNotePage: "📝 Note",
    calcError: "Error",
    confirmOkBtn: "✓ Yes, delete",
    toggleTheme: "Switch theme",
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
    helpContent: `
<div style="font-family: inherit;">
  <h3>🌿 Welcome to My Budget!</h3>
  <p>This app helps you track personal finances – record income and expenses, analyze spending, plan your budget. All data is stored only on your device and never leaves it.</p>

  <h4>📌 Home Screen</h4>
  <ul>
    <li><strong>Top cards:</strong> show your current balance, total income, total expenses, and starting amount (initial capital). Tap the “Starting amount” card to change it. Tap “Income” or “Expenses” to filter operations by type.</li>
    <li><strong>“📜 Full transaction history” button</strong> – opens a complete list of all your records with edit and delete options.</li>
    <li><strong>Recent operations list</strong> – you see up to 50 latest entries. Tap any record to edit it, or tap the cross to delete.</li>
  </ul>

  <h4>➕ Adding a new transaction</h4>
  <p>Tap the green round button with a plus sign at the bottom. Choose type (expense or income), category (and subcategory if needed), enter amount, date, and an optional note. Tap “Add” – the record is saved.</p>

  <h4>📊 Statistics</h4>
  <ul>
    <li><strong>Budget status</strong> – evaluation of your financial health (good, warning, critical).</li>
    <li><strong>Key metrics</strong> – balance, starting amount, income, expenses.</li>
    <li><strong>Savings & ratio</strong> – a speedometer gauge and a donut chart.</li>
    <li><strong>Monthly dynamics</strong> – bar chart of income and expenses for the last 6 months (only months with transactions).</li>
    <li><strong>Expense pie chart</strong> – top 5 spending categories.</li>
    <li><strong>Detailed category breakdown</strong> – how much spent/received in each category, percentage of total.</li>
    <li><strong>Budget tips</strong> – personalized recommendations based on your data.</li>
  </ul>

  <h4>🧮 Tools</h4>
  <ul>
    <li><strong>Calculator</strong> – simple calculator with history.</li>
    <li><strong>Currency converter</strong> – convert between rubles, dollars, euros, lari, pounds, tenge. Rates can be updated in settings.</li>
  </ul>

  <h4>📓 Notebook</h4>
  <p>Store important notes: plans, reminders, shopping lists. Create, edit, and delete pages.</p>

  <h4>🗂️ Categories</h4>
  <p>Manage expense and income categories. Add new, rename, delete. You can also create subcategories for more detailed grouping.</p>

  <h4>⚙️ Settings</h4>
  <ul>
    <li><strong>Currency</strong> – choose display currency (RUB, USD, EUR, GEL, GBP, KZT).</li>
    <li><strong>Theme</strong> – light or dark.</li>
    <li><strong>Language</strong> – Russian, English, Georgian.</li>
    <li><strong>Update exchange rates</strong> – fetch latest rates from the internet.</li>
    <li><strong>Reset all data</strong> – delete all your records and start fresh.</li>
  </ul>

  <h4>🎓 Interactive guide</h4>
  <p>If you see this help via the “?” button, to launch a step‑by‑step tour with element highlighting, press the adjacent button with the 🎓 icon. The guide will show you the main interface elements.</p>

  <h4>💡 Useful tips</h4>
  <ul>
    <li>Record your expenses regularly – it helps you stay in control.</li>
    <li>Use categories and subcategories for convenient analysis.</li>
    <li>Watch the monthly dynamics to see your progress.</li>
    <li>The app works completely offline – internet is only needed to update exchange rates.</li>
  </ul>
  <p style="margin-top: 12px;"><strong>🌿 Enjoy using My Budget!</strong></p>
</div>
`,
    guideNext: "Next",
    guideSkip: "Skip",
    guideFinish: "Finish",
    guideSteps: [
      {
        element: ".top-cards",
        title: "Summary Cards",
        desc: "See your balance, income, expenses, and starting amount.",
      },
      {
        element: ".fab",
        title: "Add Transaction",
        desc: "Tap this green button to add a new income or expense.",
      },
      {
        element: ".bottom-nav",
        title: "Navigation",
        desc: "Switch between sections.",
      },
    ],
    statsBudgetStatus: "Budget status",
    statsKeyMetrics: "Key metrics",
    statsSavingsGauge: "💾 Savings",
    statsRatio: "⚖️ Ratio",
    statsMonthlyDyn: "📅 Monthly dynamics",
    statsExpCats: "📉 Where money goes",
    statsIncCats: "📈 Income sources",
    statsTips: "🧠 Budget tips",
    statsSummaryTable: "📋 Summary",
    statsStartAmt: "💼 Starting amount",
    statsTotalIncLabel: "📈 Total income",
    statsTotalExpLabel: "📉 Total expenses",
    statsBalanceLabel: "💎 Current balance",
    statsTotalOpsLabel: "📁 Total records",
    statsSavingsLabel: "💾 Savings rate",
    statsRemaining: "Remaining",
    statsSaved2: "saved",
    statsSpentOf2: "spent",
    statsChartNote:
      "Bar height is proportional to the maximum amount in the period",
    statsMoreCats: "more categories",
    statsTipHighCat: "category takes up % of all expenses — that's a lot.",
    statsTipSaveLow:
      "Financial experts recommend saving at least 10% of income.",
    statsTipNoIncome: "Add income sources to see the full budget picture.",
    statsTipGoodSaving:
      "Great result! Consider investing part of your savings.",
    statsBudgetMinus: "Budget in deficit",
    statsBudgetMinusDesc: "Expenses exceed income by",
    statsBudgetGreat: "Excellent result!",
    statsBudgetGreatDesc: "You save % of income — keep it up!",
    statsBudgetOk: "Budget is healthy",
    statsBudgetOkDesc: "Expenses under control, savings: %",
    statsBudgetAlmost: "Almost break-even",
    statsBudgetAlmostDesc: "Only % saved — try to cut expenses",
    statsRec: "rec.",
    statsInc2: "inc.",
    statsExp2: "exp.",
  },
  ka: {
    appName: "🌿 ჩემი ბიუჯეტი",
    balance: "ჩემი ბალანსი / ნაშტი",
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
    edit: "შეცვლა",
    delete: "წაშლა",
    save: "შენახვა",
    cancel: "გაუქმება",
    type: "რა დავამატო?",
    expenseType: "💸 ხარჯი",
    incomeType: "💰 შემოსავალი",
    initialCapital: "საწყისი კაპიტალი",
    initialCategory: "საწყისი თანხა",
    toastIncomeFilter: "📈 თქვენი შემოსავალი",
    toastExpenseFilter: "📉 თქვენი ხარჯები",
    category: "კატეგორია",
    subcategory: "ქვეკატეგორია",
    amount: "თანხა",
    date: "თარიღი",
    note: "შენიშვნა",
    selectCategory: "— აირჩიეთ კატეგორია —",
    noSubcategory: "— ქვეკატეგორიის გარეშე —",
    allHistory: "📜 ოპერაციების სრული ისტორია",
    historyHint: "დააჭირეთ ყველა ჩანაწერის სანახავად",
    editBalance: "საწყისი თანხის შეცვლა",
    editSalaryHint: "👆 დააჭირეთ შესაცვლელად",
    totalIncome: "📈 სულ შემოსავალი",
    totalExpense: "📉 სულ ხარჯი",
    currentBalance: "💎 მიმდინარე ბალანსი",
    salary_label: "💼 საწყისი თანხა",
    noOperations: "ჩანაწერები არ არის.\nდააჭირეთ მწვანე «დამატება» ღილაკს ↓",
    newOperation: "ახალი ოპერაცია",
    editOperation: "ჩანაწერის შეცვლა",
    confirmDelete: "წაიშალოს ეს ჩანაწერი?",
    confirmDeleteAll: "წაიშალოს ყველა ჩანაწერი?",
    enterAmount: "შეიყვანეთ თანხა",
    enterPositive: "თანხა უნდა იყოს ნულზე მეტი",
    selectCategoryFirst: "გთხოვთ, აირჩიეთ კატეგორია",
    calculator: "🧮 კალკულატორი",
    converter: "💱 ვალუტის გადამყვანი",
    calcHint: "დააჭირეთ ციფრებს და ნიშნებს",
    convHint: "შეიყვანეთ თანხა და აირჩიეთ ვალუტა",
    fromCurrency: "საიდან",
    toCurrency: "სად",
    sumLabel: "თანხა",
    history: "ისტორია",
    clearHistory: "ისტორიის გასუფთავება",
    convert: "გადაყვანა",
    convertResult: "შედეგი",
    newPage: "ახალი გვერდი",
    pageTitle: "გვერდის სათაური",
    content: "შენიშვნის ტექსტი",
    noPages: "გვერდები არ არის.\nდააჭირეთ «ახალი გვერდი»",
    notebookHint: "შეინახეთ მნიშვნელოვანი ჩანაწერები.",
    addCategory: "ხარჯის კატეგორიის დამატება",
    addIncomeCategory: "შემოსავლის კატეგორიის დამატება",
    deleteCategory: "კატეგორიის წაშლა",
    addSubcategory: "ქვეკატეგორიის დამატება",
    incomeCats: "💰 შემოსავლის კატეგორიები",
    expCatsTitle: "📉 ხარჯის კატეგორიები",
    catHint: "კატეგორიები გეხმარებათ ხარჯებისა და შემოსავლების დაჯგუფებაში.",
    newExpCatTitle: "ახალი ხარჯის კატეგორია",
    newIncCatTitle: "ახალი შემოსავლის კატეგორია",
    editCatTitle: "კატეგორიის სახელის შეცვლა",
    editSubcatTitle: "ქვეკატეგორიის შეცვლა",
    newSubcatTitle: "ახალი ქვეკატეგორია",
    catNameLabel: "შეიყვანეთ სახელი:",
    newName: "ახალი სახელი:",
    inCategoryLabel: "კატეგორიაში:",
    theme: "🎨 გაფორმება",
    light: "☀️ ღია",
    dark: "🌙 მუქი",
    language: "🌐 ენა",
    data: "💾 მონაცემები",
    updateRates: "🔄 კურსის განახლება",
    resetAll: "🗑️ ყველაფრის წაშლა",
    proVersion: "🌟 Pro-ვერსიის გახსნა",
    currency: "🌍 თანხის ჩვენება ვალუტაში",
    explanationCurrency: "აირჩიეთ ვალუტა.",
    explanationTheme: "ღია ან მუქი ფონი.",
    explanationLanguage: "ენის არჩევა.",
    explanationRates: "კურსების ჩამოტვირთვა.",
    explanationReset: "ყველა მონაცემის წაშლა.",
    explanationPro: "გაფართოებული ვერსია.",
    currRUB: "₽ რუსული რუბლი",
    currUSD: "$ აშშ დოლარი",
    currEUR: "€ ევრო",
    currGEL: "₾ ქართული ლარი",
    currGBP: "£ ბრიტანული ფუნტი",
    currKZT: "₸ ყაზახური ტენგე",
    rub: "₽",
    usd: "$",
    eur: "€",
    gel: "₾",
    gbp: "£",
    kzt: "₸",
    ok: "კარგი",
    error: "შეცდომა",
    allOps: "ყველა ოპერაცია",
    clearAllOps: "ყველა ისტორიის წაშლა",
    editNote: "რედაქტირება",
    saved: "✓ შენახულია",
    deleted: "🗑 წაშლილია",
    ratesUpdated: "✓ კურსი განახლდა",
    resetDone: "✓ ყველაფერი წაიშალა",
    welcomeTitle: "კეთილი იყოს თქვენი მობრძანება! 👋",
    welcomeText: "დააჭირეთ მწვანე «დამატება» ღილაკს დასაწყებად.",
    welcomeClose: "გასაგებია, ვიწყებთ!",
    expCategory: "ხარჯის კატეგორია",
    incCategory: "შემოსავლის კატეგორია",
    expSub: "ქვეკატეგორია (არასავალდებულო)",
    amountHint: "შეიყვანეთ ციფრი, მაგ: 150",
    dateHint: "ოპერაციის თარიღი",
    noteHint: "შეიძლება ცარიელი დარჩეს",
    addSubHint: "ქვეკატეგორია დაგეხმარება ხარჯის დაზუსტებაში",
    cardHintBalance: "რამდენი გაქვთ ახლა",
    cardHintIncome: "სულ მიღებული",
    cardHintExpense: "სულ დახარჯული",
    cardHintSalary: "👆 დააჭირეთ შესაცვლელად",
    recentOpsLabel: "📋 შემოსავლებისა და ხარჯების ისტორია",
    recentOpsHint: "დააჭირეთ ჩანაწერს შესაცვლელად ან წასაშლელად",
    addCatModalTitle: "კატეგორიის დამატება",
    catTypeLabel: "აირჩიეთ კატეგორიის ტიპი",
    catTypeExpenseTitle: "💸 ხარჯი",
    catTypeExpenseDesc: "შენაძენები, სერვისების გადახდა და ნებისმიერი ხარჯი",
    catTypeIncomeTitle: "💰 შემოსავალი",
    catTypeIncomeDesc: "ხელფასი, პენსია, საჩუქრები და სხვა შემოსავლები",
    catNamePlaceholder: "მაგ: «ტრანსპორტი» ან «აფთიაქი»",
    noStatsYet: "დაამატეთ პირველი ჩანაწერები,\nსტატისტიკის სანახავად",
    salaryModalHint: "💡 ეს არის საწყისი თანხა.",
    catFieldDesc: "ამ ჩანაწერის კატეგორიის სახელი",
    statsTransCount: "ჩანაწერი",
    statsSaved: "💾 დაზოგილია",
    statsSavingsRate: "შემოსავლიდან დაზოგილია",
    statsHealthy: "✅ ბიუჯეტი ნორმაშია",
    statsWarning: "⚠️ ხარჯი შემოსავალს აღემატება",
    statsBreakeven: "〰️ ხარჯი შემოსავლის ტოლია",
    statsSpentOf: "შემოსავლიდან დახარჯულია",
    statsIncomeSection: "📈 შემოსავლების სტრუქტურა",
    statsExpSection: "📉 სად მიდის ფული",
    statsTotalOps: "სულ ჩანაწერი",
    appFooter:
      "ჩემი ბიუჯეტი v2.0 · ინტერნეტის გარეშე 📴\nმონაცემები მხოლოდ თქვენს მოწყობილობაზე 🔒",
    historyEmpty: "ისტორია ცარიელია",
    loading: "⏳ იტვირთება...",
    ariaDeleteOp: "წაშლა",
    ariaEditOp: "შეცვლა",
    ariaDeleteOp2: "წაშლა",
    addOpTypeDesc: "აირჩიეთ ტიპი",
    incomeAdded: "✓ შემოსავალი დამატებულია!",
    expenseAdded: "✓ ხარჯი დამატებულია!",
    newNotebookTitle: "📝 ახალი შენიშვნა",
    notebookPlaceholder: "დაწერეთ აქ...",
    currencyChanged: "✓ ვალუტა შეიცვალა",
    themeChanged: "✓ თემა შეიცვალა",
    resetConfirmMsg: "ყველა ჩანაწერი, შენიშვნა და პარამეტრი წაიშლება.",
    proComingSoon: "🌟 Pro-ვერსია მალე!",
    themeLight: "☀️ ღია თემა",
    themeDark: "🌙 მუქი თემა",
    yesDeleteAll: "✓ დიახ, წავშალოთ ყველა",
    resetConfirmTitle: "ყველაფრის წაშლა?",
    defaultNotePage: "📝 შენიშვნა",
    calcError: "შეცდომა",
    confirmOkBtn: "✓ დიახ, წაშლა",
    toggleTheme: "თემის გადართვა",
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
    pickDate: "აირჩიეთ თარიღი",
    helpTitle: "📘 როგორ გამოვიყენოთ",
    helpContent: `
<div style="font-family: inherit;">
  <h3>🌿 კეთილი იყოს თქვენი მობრძანება „ჩემი ბიუჯეტი“-ში!</h3>
  <p>ეს აპლიკაცია გეხმარებათ პირადი ფინანსების აღრიცხვაში – ჩაწეროთ შემოსავლები და ხარჯები, გააანალიზოთ ხარჯები, დაგეგმოთ ბიუჯეტი. ყველა მონაცემი ინახება მხოლოდ თქვენს მოწყობილობაზე და არსად გადაიცემა.</p>

  <h4>📌 მთავარი ეკრანი</h4>
  <ul>
    <li><strong>ზედა ბარათები:</strong> გაჩვენებთ მიმდინარე ნაშთს, მთლიან შემოსავალს, მთლიან ხარჯს და საწყის თანხას. „საწყისი თანხის“ ბარათზე დაჭერით შეგიძლიათ მისი შეცვლა. „შემოსავლებზე“ ან „ხარჯებზე“ დაჭერით – ნახავთ მხოლოდ ამ ტიპის ოპერაციებს.</li>
    <li><strong>ღილაკი „📜 ოპერაციების სრული ისტორია“</strong> – ხსნის ყველა ჩანაწერის სრულ სიას, რედაქტირებისა და წაშლის შესაძლებლობით.</li>
    <li><strong>ბოლო ოპერაციების სია</strong> – ნახავთ ბოლო 50 ჩანაწერს. ნებისმიერ ჩანაწერზე დაჭერით შეგიძლიათ მისი რედაქტირება, ან გვერდით ჯვარზე – წაშლა.</li>
  </ul>

  <h4>➕ ახალი ოპერაციის დამატება</h4>
  <p>დააჭირეთ მწვანე მრგვალ ღილაკს პლიუსით ეკრანის ქვედა ნაწილში. აირჩიეთ ტიპი (ხარჯი ან შემოსავალი), კატეგორია (და ქვეკატეგორია საჭიროების შემთხვევაში), შეიყვანეთ თანხა, თარიღი და სურვილისამებრ შენიშვნა. დააჭირეთ „დამატებას“ – ჩანაწერი შეინახება.</p>

  <h4>📊 სტატისტიკა</h4>
  <ul>
    <li><strong>ბიუჯეტის სტატუსი</strong> – თქვენი ფინანსური მდგომარეობის შეფასება (კარგი, გაფრთხილება, კრიტიკული).</li>
    <li><strong>ძირითადი მაჩვენებლები</strong> – ნაშთი, საწყისი თანხა, შემოსავალი, ხარჯი.</li>
    <li><strong>დანაზოგი და თანაფარდობა</strong> – სპიდომეტრი და წრიული დიაგრამა.</li>
    <li><strong>ყოველთვიური დინამიკა</strong> – შემოსავლებისა და ხარჯების სვეტოვანი დიაგრამა ბოლო 6 თვის განმავლობაში (მხოლოდ ის თვეები, სადაც ოპერაციებია).</li>
    <li><strong>ხარჯების წრიული დიაგრამა</strong> – ტოპ-5 კატეგორია.</li>
    <li><strong>კატეგორიების დეტალური ანალიზი</strong> – რამდენი დაიხარჯა/მიიღო თითოეულ კატეგორიაში, პროცენტი მთლიანთან შედარებით.</li>
    <li><strong>რჩევები ბიუჯეტისთვის</strong> – პერსონალური რეკომენდაციები თქვენი მონაცემების მიხედვით.</li>
  </ul>

  <h4>🧮 ინსტრუმენტები</h4>
  <ul>
    <li><strong>კალკულატორი</strong> – მარტივი კალკულატორი ისტორიით.</li>
    <li><strong>ვალუტის გადამყვანი</strong> – კონვერტაცია რუბლებს, დოლარებს, ევროს, ლარს, ფუნტებს, ტენგეს შორის. კურსების განახლება შეგიძლიათ პარამეტრებში.</li>
  </ul>

  <h4>📓 ბლოკნოტი</h4>
  <p>შეინახეთ მნიშვნელოვანი შენიშვნები: გეგმები, შეხსენებები, სავაჭრო სიები. შექმენით, დაარედაქტირეთ, წაშალეთ გვერდები.</p>

  <h4>🗂️ კატეგორიები</h4>
  <p>მართეთ ხარჯებისა და შემოსავლების კატეგორიები. დაამატეთ ახალი, გადაარქვით სახელი, წაშალეთ. ასევე შეგიძლიათ შექმნათ ქვეკატეგორიები უფრო დეტალური დაჯგუფებისთვის.</p>

  <h4>⚙️ პარამეტრები</h4>
  <ul>
    <li><strong>ვალუტა</strong> – აირჩიეთ, რომელ ვალუტაში იყოს ნაჩვენები თანხები (RUB, USD, EUR, GEL, GBP, KZT).</li>
    <li><strong>თემა</strong> – ღია ან მუქი.</li>
    <li><strong>ენა</strong> – ქართული, ინგლისური, რუსული.</li>
    <li><strong>ვალუტის კურსების განახლება</strong> – უახლესი კურსების ჩამოტვირთვა ინტერნეტიდან.</li>
    <li><strong>ყველა მონაცემის გადატვირთვა</strong> – წაშალოს ყველა თქვენი ჩანაწერი და დაიწყოს თავიდან.</li>
  </ul>

  <h4>🎓 ინტერაქტიული გიდი</h4>
  <p>თუ თქვენ ხედავთ ამ დახმარებას „?“ ღილაკით, ნაბიჯ-ნაბიჯ ტურის გასაშვებად ელემენტების მონიშვნით, დააჭირეთ მეზობელ ღილაკს 🎓 ხატულით. გიდი გაჩვენებთ ინტერფეისის ძირითად ელემენტებს.</p>

  <h4>💡 სასარგებლო რჩევები</h4>
  <ul>
    <li>რეგულარულად ჩაწერეთ ხარჯები – ეს გეხმარებათ კონტროლში.</li>
    <li>გამოიყენეთ კატეგორიები და ქვეკატეგორიები მოსახერხებელი ანალიზისთვის.</li>
    <li>თვალყური ადევნეთ ყოველთვიურ დინამიკას, რომ ნახოთ პროგრესი.</li>
    <li>აპლიკაცია მუშაობს სრულად ოფლაინ – ინტერნეტი საჭიროა მხოლოდ ვალუტის კურსების განახლებისთვის.</li>
  </ul>
  <p style="margin-top: 12px;"><strong>🌿 გისურვებთ სასიამოვნო გამოყენებას!</strong></p>
</div>
`,
    guideNext: "შემდეგი",
    guideSkip: "გამოტოვება",
    guideFinish: "დასრულება",
    guideSteps: [
      {
        element: ".top-cards",
        title: "შემაჯამებელი ბარათები",
        desc: "ბალანსი, შემოსავალი, ხარჯი და საწყისი თანხა.",
      },
      {
        element: ".fab",
        title: "ოპერაციის დამატება",
        desc: "მწვანე ღილაკი ახალი შემოსავლის ან ხარჯის დასამატებლად.",
      },
      {
        element: ".bottom-nav",
        title: "ნავიგაცია",
        desc: "გადაერთეთ სექციებს შორის.",
      },
    ],
    statsBudgetStatus: "ბიუჯეტის სტატუსი",
    statsKeyMetrics: "ძირითადი მაჩვენებლები",
    statsSavingsGauge: "💾 დანაზოგი",
    statsRatio: "⚖️ თანაფარდობა",
    statsMonthlyDyn: "📅 ყოველთვიური დინამიკა",
    statsExpCats: "📉 სად მიდის ფული",
    statsIncCats: "📈 შემოსავლის წყაროები",
    statsTips: "🧠 რჩევები",
    statsSummaryTable: "📋 ჯამი",
    statsStartAmt: "💼 საწყისი თანხა",
    statsTotalIncLabel: "📈 სულ შემოსავალი",
    statsTotalExpLabel: "📉 სულ ხარჯი",
    statsBalanceLabel: "💎 მიმდინარე ნაშთი",
    statsTotalOpsLabel: "📁 სულ ჩანაწერი",
    statsSavingsLabel: "💾 დანაზოგის წილი",
    statsRemaining: "ნაშთი",
    statsSaved2: "ინახება",
    statsSpentOf2: "ხარჯი",
    statsChartNote: "სვეტის სიმაღლე პროპორციულია მაქსიმალური თანხისა",
    statsMoreCats: "კიდევ კატეგორია",
    statsTipHighCat: "კატეგორია იკავებს % ყველა ხარჯს — ეს ბევრია.",
    statsTipSaveLow:
      "ფინანსური ექსპერტები გვირჩევენ შემოსავლის მინიმუმ 10%-ის დაზოგვას.",
    statsTipNoIncome:
      "დაამატეთ შემოსავლის წყაროები ბიუჯეტის სრული სურათისთვის.",
    statsTipGoodSaving:
      "შესანიშნავი შედეგი! განიხილეთ დანაზოგის ნაწილის ინვესტირება.",
    statsBudgetMinus: "ბიუჯეტი მინუსშია",
    statsBudgetMinusDesc: "ხარჯი აღემატება შემოსავალს",
    statsBudgetGreat: "შესანიშნავი შედეგი!",
    statsBudgetGreatDesc: "თქვენ ზოგავთ % — ასე გააგრძელეთ!",
    statsBudgetOk: "ბიუჯეტი ნორმაშია",
    statsBudgetOkDesc: "ხარჯები კონტროლდება, დანაზოგი: %",
    statsBudgetAlmost: "თითქმის ნულზე",
    statsBudgetAlmostDesc: "მხოლოდ % ინახება — შეეცადეთ შეამციროთ ხარჯები",
    statsRec: "ჩ.",
    statsInc2: "შემ.",
    statsExp2: "ხარ.",
  },
};

let currentLang = localStorage.getItem("lang") || "ru";
function t(key) {
  return translations[currentLang]?.[key] ?? key;
}
function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    applyTranslations();
    updateHeader();
    updateTopBlocks();
    setTab(currentTab);
    updateHeaderButtons();
  }
}
const localeMap = { ru: "ru-RU", en: "en-US", ka: "ka-GE" };

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key])
      el.textContent = translations[currentLang][key];
  });
  const logo = document.querySelector(".app-logo");
  if (logo) logo.textContent = t("appName");
  const fabText = document.querySelector(".fab-text");
  if (fabText) fabText.textContent = t("add");
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
let calcExpr = "";

let categories = {
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
let incomeCategories = {
  Зарплата: { subcats: [] },
  Подарок: { subcats: [] },
  Фриланс: { subcats: [] },
};
window.initialCategories = JSON.parse(JSON.stringify(categories));

// Фильтр для главной (доходы/расходы)
let currentFilter = null;

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
  return String(str || "").replace(
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

function saveAll() {
  localStorage.setItem(
    "budget_pro_full",
    JSON.stringify({
      transactions,
      startBalanceRub,
      displayCurrency,
      exchangeRates,
      notebookPages,
      categories,
      incomeCategories,
      calcHistory,
      convHistory,
    }),
  );
}

function loadAll() {
  const raw = localStorage.getItem("budget_pro_full");
  if (!raw) return;
  const d = JSON.parse(raw);
  transactions = d.transactions || [];
  startBalanceRub = d.startBalanceRub ?? 70000;
  displayCurrency = d.displayCurrency || "GEL";
  if (d.exchangeRates) exchangeRates = { ...exchangeRates, ...d.exchangeRates };
  if (d.notebookPages) notebookPages = d.notebookPages;
  if (d.categories) categories = d.categories;
  if (d.incomeCategories) {
    if (Array.isArray(d.incomeCategories)) {
      incomeCategories = {};
      d.incomeCategories.forEach((cat) => {
        incomeCategories[cat] = { subcats: [] };
      });
    } else {
      incomeCategories = d.incomeCategories;
    }
  }
  calcHistory = d.calcHistory || [];
  convHistory = d.convHistory || [];
  syncStartBalanceTransaction();
}

// Синхронизация начальной суммы с транзакцией "Начальная сумма" (с переводами)
function syncStartBalanceTransaction() {
  // Ищем существующую транзакцию "Начальная сумма"
  const existingIdx = transactions.findIndex(
    (tx) => tx.category === t("initialCategory") && tx.type === "income",
  );

  if (existingIdx !== -1) {
    // Если транзакция существует, обновляем её сумму и заметку
    transactions[existingIdx].amountRub = startBalanceRub;
    transactions[existingIdx].note = t("initialCapital");
  } else {
    // Если транзакции нет, создаём новую (только при первом запуске)
    if (startBalanceRub > 0) {
      transactions.push({
        type: "income",
        category: t("initialCategory"),
        subcategory: null,
        amountRub: startBalanceRub,
        date: "2000-01-01", // фиксированная дата, чтобы не мешалась
        note: t("initialCapital"),
      });
    }
  }

  // Сортировка транзакций по дате (необязательно)
  transactions.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}
// ============================================================
// TOAST
// ============================================================
let toastTimer = null;
function showToast(msg, type = "success") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast " + type;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

// ============================================================
// CONFIRM
// ============================================================
function askConfirm(
  msg,
  onYes,
  { icon = "⚠️", yesText = null, title = null } = {},
) {
  const overlay = document.getElementById("confirmOverlay");
  document.getElementById("confirmIcon").textContent = icon;
  document.getElementById("confirmTitle").textContent =
    title || t("confirmDelete");
  document.getElementById("confirmMsg").textContent = msg;
  document.getElementById("confirmOk").textContent =
    yesText || t("confirmOkBtn");

  // ПЕРЕВОД КНОПКИ ОТМЕНЫ
  const cancelBtn = document.getElementById("confirmCancel");
  if (cancelBtn) {
    cancelBtn.innerHTML = `✕ ${t("cancel")}`;
  }

  overlay.classList.add("open");
  const close = () => overlay.classList.remove("open");
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
  const dateEl = document.getElementById("headerDate");
  if (dateEl) {
    const locale = localeMap[currentLang] || currentLang;
    dateEl.textContent = new Date().toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
}

function addHeaderButtons() {
  const header = document.querySelector(".app-header");
  if (!header) return;

  // Кнопка гайда (уже есть в HTML)
  const guideBtn = document.getElementById("headerGuideBtn");
  if (guideBtn) {
    // Удаляем старые обработчики, клонируем и добавляем новый
    const newGuideBtn = guideBtn.cloneNode(true);
    guideBtn.parentNode.replaceChild(newGuideBtn, guideBtn);
    newGuideBtn.addEventListener("click", () => startGuide());
  }

  // Кнопка справки (уже есть в HTML)
  const helpBtn = document.getElementById("headerHelpBtn");
  if (helpBtn) {
    const newHelpBtn = helpBtn.cloneNode(true);
    helpBtn.parentNode.replaceChild(newHelpBtn, helpBtn);
    newHelpBtn.addEventListener("click", showHelpModal);
  }

  // Кнопка языка (уже есть в HTML)
  const langBtn = document.getElementById("headerLangBtn");
  if (langBtn) {
    const newLangBtn = langBtn.cloneNode(true);
    langBtn.parentNode.replaceChild(newLangBtn, langBtn);
    newLangBtn.addEventListener("click", () => {
      const langs = ["ru", "en", "ka"];
      setLanguage(langs[(langs.indexOf(currentLang) + 1) % langs.length]);
    });
  }

  updateHeaderButtons();
}

function updateHeaderButtons() {
  const langBtn = document.getElementById("headerLangBtn");
  if (langBtn)
    langBtn.textContent = { ru: "🇷🇺", en: "🇬🇧", ka: "🇬🇪" }[currentLang] || "🌐";
}

// ============================================================
// ОБНОВЛЕНИЕ КАРТОЧЕК
// ============================================================
function updateTopBlocks() {
  let inc = 0,
    exp = 0;
  for (let tx of transactions) {
    if (tx.type === "income") inc += tx.amountRub;
    else exp += tx.amountRub;
  }
  // Баланс = доходы - расходы (начальная сумма уже в доходах)
  const bal = inc - exp;
  const s = sym();
  document.getElementById("balanceValue").textContent =
    toDisp(bal).toFixed(2) + " " + s;
  document.getElementById("incomeValue").textContent =
    toDisp(inc).toFixed(2) + " " + s;
  document.getElementById("expenseValue").textContent =
    toDisp(exp).toFixed(2) + " " + s;
  document.getElementById("salaryValue").textContent =
    toDisp(startBalanceRub).toFixed(2) + " " + s;
}

// ============================================================
// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ============================================================
function setTab(tab) {
  currentTab = tab;
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add("active");
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
function renderHome() {
  const showWelcome =
    !localStorage.getItem("welcomeSeen") && transactions.length === 0;
  let html = "";
  if (showWelcome) {
    html += `<div class="welcome-tip">
      <div class="welcome-tip-icon">👋</div>
      <div class="welcome-tip-text">
        <h3>${t("welcomeTitle")}</h3>
        <p>${t("welcomeText")}</p>
        <button class="welcome-tip-close" id="welcomeClose">${t("welcomeClose")}</button>
      </div>
    </div>`;
  }
  html += `
    <div class="history-btn-wrap">
      <button class="history-btn" id="showAllHistoryBtn">${t("allHistory")}</button>
      <div class="history-btn-hint">💡 ${t("historyHint")}</div>
    </div>
    <div id="opsList"></div>`;
  document.getElementById("mainContent").innerHTML = html;
  document.getElementById("mainContent").classList.add("tab-anim");
  document
    .getElementById("showAllHistoryBtn")
    ?.addEventListener("click", showFullHistory);
  document.getElementById("welcomeClose")?.addEventListener("click", () => {
    localStorage.setItem("welcomeSeen", "1");
    renderHome();
  });
  renderOpsList();
}

function renderOpsList() {
  const container = document.getElementById("opsList");
  if (!container) return;

  let filtered = [...transactions];
  if (currentFilter === "income")
    filtered = filtered.filter((tx) => tx.type === "income");
  else if (currentFilter === "expense")
    filtered = filtered.filter((tx) => tx.type === "expense");

  let inc = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amountRub, 0);
  let exp = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amountRub, 0);
  let bal = startBalanceRub + inc - exp;

  let html = `<div class="balance-summary">
    <div class="balance-row row-salary" id="salaryRowBtn" role="button" tabindex="0">
      <div class="balance-row-left"><span class="balance-row-dot dot-salary"></span><span class="balance-row-label">${t("salary_label")}</span></div>
      <div><span class="balance-row-value">${fmt(startBalanceRub)}</span><div class="balance-row-sub">${t("editSalaryHint")}</div></div>
    </div>
    <div class="balance-row row-income">
      <div class="balance-row-left"><span class="balance-row-dot dot-income"></span><span class="balance-row-label">${t("totalIncome")}</span></div>
      <span class="balance-row-value income">+${fmt(inc)}</span>
    </div>
    <div class="balance-row row-expense">
      <div class="balance-row-left"><span class="balance-row-dot dot-expense"></span><span class="balance-row-label">${t("totalExpense")}</span></div>
      <span class="balance-row-value expense">−${fmt(exp)}</span>
    </div>
    <div class="balance-row row-balance">
      <div class="balance-row-left"><span class="balance-row-dot dot-balance"></span><span class="balance-row-label">${t("currentBalance")}</span></div>
      <span class="balance-row-value ${bal >= 0 ? "positive" : "negative"}">${fmt(bal)}</span>
    </div>
  </div>`;

  if (currentFilter) {
    html += `<div class="ops-section-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div class="ops-section-label">${currentFilter === "income" ? "📈 " + t("income") : "📉 " + t("expense")}</div>
      <button id="clearFilterBtn" class="btn-secondary" style="padding: 8px 14px; font-size: 13px;">✖ ${t("cancel")}</button>
    </div>`;
  } else {
    html += `<div class="ops-section-header"><div class="ops-section-label">${t("recentOpsLabel")}</div><div class="ops-section-hint">💡 ${t("recentOpsHint")}</div></div>`;
  }

  const recent = filtered
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 50);
  if (recent.length === 0) {
    html += `<div class="empty-block"><div class="empty-emoji">💸</div><p>${t("noOperations").replace("\n", "<br>")}</p></div>`;
  } else {
    html += '<div class="ops-list">';
    recent.forEach((tx) => {
      const idx = transactions.indexOf(tx);
      const sign = tx.type === "income" ? "+" : " −";
      html += `<div class="op-card" data-idx="${idx}" data-type="${tx.type}">
        <div class="op-emoji">${getOpEmoji(tx)}</div>
        <div class="op-info">
          <div class="op-category">${esc(tx.category)}${tx.subcategory ? ` · <span style="font-weight:400;color:var(--text-muted)">${esc(tx.subcategory)}</span>` : ""}</div>
          <div class="op-date">${fmtDate(tx.date)}</div>
          ${tx.note ? `<div class="op-note">📝 ${esc(tx.note.substring(0, 50))}</div>` : ""}
        </div>
        <div class="op-right">
          <div class="op-amount ${tx.type}">${sign}${fmt(tx.amountRub)}</div>
          <button class="op-delete" data-idx="${idx}" aria-label="${t("ariaDeleteOp")}">✕</button>
        </div>
      </div>`;
    });
    html += "</div>";
  }
  container.innerHTML = html;

  document
    .getElementById("salaryRowBtn")
    ?.addEventListener("click", openSalaryModal);
  document.getElementById("salaryRowBtn")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openSalaryModal();
  });
  container.querySelectorAll(".op-card").forEach((card) => {
    card.addEventListener("click", () =>
      openEditModal(parseInt(card.dataset.idx)),
    );
  });
  container.querySelectorAll(".op-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      askConfirm(
        t("confirmDelete"),
        () => {
          transactions.splice(idx, 1);
          saveAll();
          updateTopBlocks();
          renderOpsList();
          showToast(t("deleted"));
        },
        { icon: "🗑️" },
      );
    });
  });
  const clearBtn = document.getElementById("clearFilterBtn");
  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      currentFilter = null;
      renderOpsList();
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
    salary: "💼",
    gift: "🎁",
  };
  for (const [k, v] of Object.entries(map)) if (cat.includes(k)) return v;
  return tx.type === "income" ? "💰" : "💸";
}

// ============================================================
// ПОЛНАЯ ИСТОРИЯ (всегда показывает все операции)
// ============================================================
function showFullHistory() {
  // Всегда показываем все операции, игнорируем currentFilter
  let allOps = [...transactions];
  allOps.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (allOps.length === 0) {
    showToast(t("noOperations").split("\n")[0]);
    return;
  }
  let listHTML = '<div class="history-list">';
  allOps.forEach((op) => {
    const realIdx = transactions.indexOf(op);
    const sign = op.type === "income" ? "+" : "−";
    listHTML += `<div class="history-item">
      <div class="history-item-info">
        <div class="history-item-cat">${getOpEmoji(op)} ${esc(op.category)}${op.subcategory ? ` (${esc(op.subcategory)})` : ""}</div>
        <div class="history-item-meta">${fmtDate(op.date)}${op.note ? "  📝 " + esc(op.note.substring(0, 30)) : ""}</div>
      </div>
      <div class="history-item-amt ${op.type}">${sign}${fmt(op.amountRub)}</div>
      <div class="history-item-btns">
        <button class="icon-btn edit" data-idx="${realIdx}" aria-label="${t("ariaEditOp")}">✏️</button>
        <button class="icon-btn delete" data-idx="${realIdx}" aria-label="${t("ariaDeleteOp2")}">🗑</button>
      </div>
    </div>`;
  });
  listHTML += `</div><div style="margin-top:16px;"><button class="btn-danger" id="clearAllHistoryBtn" style="width:100%">🗑 ${t("clearAllOps")}</button></div>`;
  const modal = createModal("fullHistoryModal", t("allHistory"), listHTML);
  document.body.appendChild(modal);
  openModal("fullHistoryModal");

  modal.querySelectorAll(".icon-btn.edit").forEach((btn) =>
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      closeModal("fullHistoryModal");
      setTimeout(() => openEditModal(idx), 200);
    }),
  );

  modal.querySelectorAll(".icon-btn.delete").forEach((btn) =>
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      askConfirm(
        t("confirmDelete"),
        () => {
          transactions.splice(idx, 1);
          saveAll();
          updateTopBlocks();
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
          // Удаляем ВСЕ операции, независимо от фильтра
          transactions = [];
          saveAll();
          updateTopBlocks();
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
  let viewYear = date.getFullYear(),
    viewMonth = date.getMonth();
  const months = t("months"),
    weekdays = t("weekdaysShort");
  function renderCalendar() {
    const firstDay = new Date(viewYear, viewMonth, 1);
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    let daysHtml = "";
    for (let i = 0; i < startDay; i++)
      daysHtml += `<div class="datepicker-day empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      daysHtml += `<div class="datepicker-day${initialDate === ds ? " selected" : ""}" data-date="${ds}">${d}</div>`;
    }
    return `<div class="datepicker-header">
      <button class="datepicker-nav" id="dpPrevMonth">←</button>
      <span class="datepicker-month">${months[viewMonth]} ${viewYear}</span>
      <button class="datepicker-nav" id="dpNextMonth">→</button>
    </div>
    <div class="datepicker-weekdays">${weekdays.map((w) => `<div class="datepicker-weekday">${w}</div>`).join("")}</div>
    <div class="datepicker-days">${daysHtml}</div>`;
  }
  const modal = createModal(
    "datepickerModal",
    t("pickDate"),
    `<div class="datepicker-content"><div id="datepickerCalendar">${renderCalendar()}</div><div class="datepicker-actions"><button class="btn-secondary" id="dpCancel">${t("cancel")}</button></div></div>`,
  );
  document.body.appendChild(modal);
  openModal("datepickerModal");
  function update() {
    document.getElementById("datepickerCalendar").innerHTML = renderCalendar();
    attach();
    document.getElementById("dpPrevMonth").addEventListener("click", () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      update();
    });
    document.getElementById("dpNextMonth").addEventListener("click", () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      update();
    });
  }
  function attach() {
    document
      .querySelectorAll("#datepickerCalendar .datepicker-day[data-date]")
      .forEach((day) => {
        day.addEventListener("click", () => {
          closeModal("datepickerModal");
          onSelect(day.dataset.date);
        });
      });
  }
  update();
  document
    .getElementById("dpCancel")
    .addEventListener("click", () => closeModal("datepickerModal"));
}

// ============================================================
// МОДАЛКА РЕДАКТИРОВАНИЯ
// ============================================================
function openEditModal(idx) {
  const op = transactions[idx];
  if (!op) return;
  editingOpIndex = idx;
  const html = `
    <div class="field-group">
      <label class="field-label">${t("category")}</label>
      <div class="field-desc">${t("catFieldDesc")}</div>
      <input type="text" id="editCategory" class="modal-input" value="${esc(op.category)}" placeholder="${t("category")}">
    </div>
    <div class="field-group">
      <label class="field-label">${t("amount")} (${sym()})</label>
      <input type="number" id="editAmount" class="modal-input" step="any" min="0.01" value="${toDisp(op.amountRub).toFixed(2)}" inputmode="decimal">
    </div>
    <div class="field-group">
      <label class="field-label">${t("date")}</label>
      <div class="date-input-wrapper">
        <input type="text" id="editDateDisplay" class="modal-input" readonly value="${fmtDate(op.date || today())}">
        <input type="hidden" id="editDate" value="${op.date || today()}">
        <button type="button" class="datepicker-btn" id="editDateBtn">📅</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t("note")}</label>
      <textarea id="editNote" class="modal-textarea" rows="2" placeholder="${t("noteHint")}">${esc(op.note || "")}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-danger" id="deleteItemBtn">🗑 ${t("delete")}</button>
      <button class="btn-primary" id="saveEditBtn">💾 ${t("save")}</button>
    </div>`;
  const modal = createModal("editModal", t("editOperation"), html);
  document.body.appendChild(modal);
  openModal("editModal");
  document.getElementById("editDateBtn").addEventListener("click", () => {
    openDatePicker(document.getElementById("editDate").value, (d) => {
      document.getElementById("editDate").value = d;
      document.getElementById("editDateDisplay").value = fmtDate(d);
    });
  });
  document.getElementById("saveEditBtn")?.addEventListener("click", () => {
    const newAmt = parseFloat(document.getElementById("editAmount").value);
    if (isNaN(newAmt) || newAmt <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    transactions[editingOpIndex].category =
      document.getElementById("editCategory").value.trim() || "—";
    transactions[editingOpIndex].amountRub = toRub(newAmt);
    transactions[editingOpIndex].date =
      document.getElementById("editDate").value;
    transactions[editingOpIndex].note = document
      .getElementById("editNote")
      .value.trim();
    saveAll();
    updateTopBlocks();
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
        renderOpsList();
        closeModal("editModal");
        showToast(t("deleted"));
      },
      { icon: "🗑️" },
    );
  });
}

// ============================================================
// МОДАЛКА ЗАРПЛАТЫ (с синхронизацией транзакции)
// ============================================================
function openSalaryModal() {
  const html = `
    <div class="section-hint">${t("salaryModalHint")}</div>
    <div class="field-group">
      <label class="field-label">${t("salary_label")} (${sym()})</label>
      <input type="number" id="salaryAmount" class="modal-input" step="any" min="0" value="${toDisp(startBalanceRub).toFixed(2)}" inputmode="decimal" autofocus>
    </div>
    <div class="modal-actions">
      <button class="btn-primary" id="saveSalaryBtn">💾 ${t("save")}</button>
    </div>`;
  const modal = createModal("salaryModal", t("editBalance"), html);
  document.body.appendChild(modal);
  openModal("salaryModal");
  document.getElementById("saveSalaryBtn")?.addEventListener("click", () => {
    const val = parseFloat(document.getElementById("salaryAmount").value);
    if (isNaN(val) || val < 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    startBalanceRub = toRub(val);
    syncStartBalanceTransaction();
    saveAll();
    updateTopBlocks();
    if (currentTab === "home") renderOpsList();
    closeModal("salaryModal");
    showToast(t("saved"));
  });
}

// ============================================================
// МОДАЛКА ДОБАВЛЕНИЯ
// ============================================================
function openAddModal() {
  const expOpts =
    `<option value="">${t("selectCategory")}</option>` +
    Object.keys(categories)
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
  const incOpts =
    `<option value="">${t("selectCategory")}</option>` +
    Object.keys(incomeCategories)
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
  const html = `
    <div class="field-group">
      <label class="field-label">${t("type")}</label>
      <div class="type-toggle">
        <button class="type-btn expense active" data-type="expense">${t("expenseType")}</button>
        <button class="type-btn income" data-type="income">${t("incomeType")}</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label" id="catLabel">${t("expCategory")}</label>
      <div class="field-desc">${t("addOpTypeDesc")}</div>
      <select id="addCategorySelect" class="modal-select">${expOpts}</select>
    </div>
    <div class="field-group" id="addSubcatDiv" style="display:none">
      <label class="field-label">${t("subcategory")}</label>
      <div class="field-desc">${t("addSubHint")}</div>
      <select id="addSubcatSelect" class="modal-select"></select>
    </div>
    <div class="field-group">
      <label class="field-label">${t("amount")} (${sym()})</label>
      <input type="number" id="addAmount" class="modal-input" step="any" min="0.01" placeholder="0.00" inputmode="decimal" autofocus>
    </div>
    <div class="field-group">
      <label class="field-label">${t("date")}</label>
      <div class="date-input-wrapper">
        <input type="text" id="addDateDisplay" class="modal-input" readonly value="${fmtDate(today())}">
        <input type="hidden" id="addDate" value="${today()}">
        <button type="button" class="datepicker-btn" id="addDateBtn">📅</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t("note")}</label>
      <textarea id="addNote" class="modal-textarea" rows="2" placeholder="${t("noteHint")}"></textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-primary" id="saveAddBtn" style="font-size:18px">✓ ${t("add")}</button>
    </div>`;
  const modal = createModal("addModal", t("newOperation"), html);
  document.body.appendChild(modal);
  openModal("addModal");
  addType = "expense";
  document.getElementById("addDateBtn").addEventListener("click", () => {
    openDatePicker(document.getElementById("addDate").value, (d) => {
      document.getElementById("addDate").value = d;
      document.getElementById("addDateDisplay").value = fmtDate(d);
    });
  });
  modal.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addType = btn.dataset.type;
      modal
        .querySelectorAll(".type-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("catLabel").textContent =
        addType === "expense" ? t("expCategory") : t("incCategory");
      document.getElementById("addCategorySelect").innerHTML =
        addType === "expense" ? expOpts : incOpts;
      document.getElementById("addSubcatDiv").style.display = "none";
    });
  });
  document.getElementById("addCategorySelect").onchange = () => {
    const cat = document.getElementById("addCategorySelect").value;
    let subcats =
      addType === "expense"
        ? categories[cat]?.subcats || []
        : incomeCategories[cat]?.subcats || [];
    const subDiv = document.getElementById("addSubcatDiv");
    const subSel = document.getElementById("addSubcatSelect");
    if (subcats.length) {
      subSel.innerHTML =
        `<option value="">${t("noSubcategory")}</option>` +
        subcats.map((s) => `<option value="${s}">${s}</option>`).join("");
      subDiv.style.display = "block";
    } else {
      subDiv.style.display = "none";
    }
  };
  document.getElementById("saveAddBtn")?.addEventListener("click", () => {
    const cat = document.getElementById("addCategorySelect").value;
    const subcat = document.getElementById("addSubcatSelect")?.value || "";
    const amount = parseFloat(document.getElementById("addAmount").value);
    const date = document.getElementById("addDate").value;
    const note = document.getElementById("addNote").value.trim();
    if (!cat) {
      showToast(t("selectCategoryFirst"), "error");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      showToast(t("enterPositive"), "error");
      return;
    }
    transactions.push({
      type: addType,
      category: cat,
      subcategory: subcat || null,
      amountRub: toRub(amount),
      date,
      note: note || null,
    });
    saveAll();
    updateTopBlocks();
    renderOpsList();
    closeModal("addModal");
    showToast(addType === "income" ? t("incomeAdded") : t("expenseAdded"));
  });
}

// ============================================================
// СТАТИСТИКА — с круговой диаграммой
// ============================================================
function renderStats() {
  let inc = 0,
    exp = 0;
  const catExp = {},
    catInc = {},
    monthlyData = {};
  for (const tx of transactions) {
    const month = (tx.date || today()).slice(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { inc: 0, exp: 0 };
    if (tx.type === "income") {
      inc += tx.amountRub;
      catInc[tx.category] = (catInc[tx.category] || 0) + tx.amountRub;
      monthlyData[month].inc += tx.amountRub;
    } else {
      exp += tx.amountRub;
      catExp[tx.category] = (catExp[tx.category] || 0) + tx.amountRub;
      monthlyData[month].exp += tx.amountRub;
    }
  }
  const bal = startBalanceRub + inc - exp;
  const totalFlow = startBalanceRub + inc;
  const spentPct =
    totalFlow > 0 ? Math.min(100, Math.round((exp / totalFlow) * 100)) : 0;
  const savedAmt = totalFlow - exp;
  const savedPct =
    totalFlow > 0 ? Math.max(0, Math.round((savedAmt / totalFlow) * 100)) : 0;
  const nInc = transactions.filter((t) => t.type === "income").length;
  const nExp = transactions.filter((t) => t.type === "expense").length;
  const topExp = Object.entries(catExp)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const topInc = Object.entries(catInc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const allMonths = Object.keys(monthlyData).sort().slice(-6);
  const maxBar = Math.max(
    ...allMonths.map((m) => Math.max(monthlyData[m].inc, monthlyData[m].exp)),
    1,
  );

  if (transactions.length === 0) {
    document.getElementById("mainContent").innerHTML =
      `<div class="stats-empty-state"><div class="stats-empty-icon">📊</div><div class="stats-empty-title">${t("noStatsYet").split("\n")[0]}</div><div class="stats-empty-sub">${t("noStatsYet").split("\n")[1] || ""}</div></div>`;
    injectStatsStyles();
    return;
  }

  let sEmoji = "",
    sTitle = "",
    sDesc = "",
    sClass = "";
  if (exp > totalFlow) {
    sEmoji = "🚨";
    sTitle = t("statsBudgetMinus");
    sDesc = t("statsBudgetMinusDesc") + " " + fmt(exp - totalFlow);
    sClass = "danger";
  } else if (savedPct >= 30) {
    sEmoji = "🌟";
    sTitle = t("statsBudgetGreat");
    sDesc = t("statsBudgetGreatDesc").replace("%", savedPct + "%");
    sClass = "healthy";
  } else if (savedPct >= 10) {
    sEmoji = "✅";
    sTitle = t("statsBudgetOk");
    sDesc = t("statsBudgetOkDesc").replace("%", savedPct + "%");
    sClass = "healthy";
  } else {
    sEmoji = "⚠️";
    sTitle = t("statsBudgetAlmost");
    sDesc = t("statsBudgetAlmostDesc").replace("%", savedPct + "%");
    sClass = "warning";
  }

  const tips = [];
  if (topExp.length > 0) {
    const topCat = topExp[0],
      topPct = exp > 0 ? Math.round((topCat[1] / exp) * 100) : 0;
    if (topPct > 40)
      tips.push(`💡 «${topCat[0]}» — ${topPct}% ${t("statsTipHighCat")}`);
  }
  if (savedPct < 10 && transactions.length > 3)
    tips.push("💡 " + t("statsTipSaveLow"));
  if (nExp > 0 && nInc === 0) tips.push("💡 " + t("statsTipNoIncome"));
  if (savedPct >= 20) tips.push("💡 " + t("statsTipGoodSaving"));

  const gaugeColor =
    savedPct >= 20
      ? "var(--income-color)"
      : savedPct >= 10
        ? "var(--gold)"
        : "var(--expense-color)";
  const months = t("months");
  let chartBars = "";
  allMonths.forEach((m) => {
    const d = monthlyData[m];
    const incH = Math.round((toDisp(d.inc) / toDisp(maxBar)) * 64);
    const expH = Math.round((toDisp(d.exp) / toDisp(maxBar)) * 64);
    const [, monthNum] = m.split("-");
    const label = months[parseInt(monthNum) - 1]?.slice(0, 3) || m.slice(5);
    chartBars += `<div class="stat-chart-col"><div class="stat-chart-bars"><div class="stat-chart-bar inc" style="height:${incH}px" title="+${fmt(d.inc)}"></div><div class="stat-chart-bar exp" style="height:${expH}px" title="−${fmt(d.exp)}"></div></div><div class="stat-chart-label">${label}</div></div>`;
  });

  const COLORS_EXP = [
    "#c13515",
    "#d9461a",
    "#e8714e",
    "#f0a080",
    "#f5bfab",
    "#faddd3",
  ];
  let catExpRows = "";
  topExp.forEach(([cat, amt], i) => {
    const pct = exp > 0 ? Math.round((amt / exp) * 100) : 0;
    const color = COLORS_EXP[i] || COLORS_EXP[COLORS_EXP.length - 1];
    catExpRows += `<div class="stat-cat-row"><div class="stat-cat-dot" style="background:${color}"></div><div class="stat-cat-info"><div class="stat-cat-top"><span class="stat-cat-name">${getOpEmoji({ type: "expense", category: cat })} ${esc(cat)}</span><span class="stat-cat-amount" style="color:${color}">−${fmt(amt)}</span></div><div class="stat-cat-bar-wrap"><div class="stat-cat-bar" style="width:${pct}%;background:${color}"></div></div></div><div class="stat-cat-pct" style="color:${color}">${pct}%</div></div>`;
  });

  const COLORS_INC = ["#1a7340", "#2a8f55", "#52b788", "#74c69d"];
  let catIncRows = "";
  topInc.forEach(([cat, amt], i) => {
    const pct = inc > 0 ? Math.round((amt / inc) * 100) : 0;
    const color = COLORS_INC[i] || COLORS_INC[COLORS_INC.length - 1];
    catIncRows += `<div class="stat-cat-row"><div class="stat-cat-dot" style="background:${color}"></div><div class="stat-cat-info"><div class="stat-cat-top"><span class="stat-cat-name">${getOpEmoji({ type: "income", category: cat })} ${esc(cat)}</span><span class="stat-cat-amount" style="color:${color}">+${fmt(amt)}</span></div><div class="stat-cat-bar-wrap"><div class="stat-cat-bar" style="width:${pct}%;background:${color}"></div></div></div><div class="stat-cat-pct" style="color:${color}">${pct}%</div></div>`;
  });

  // Круговая диаграмма расходов (топ-5)
  const pieData = Object.entries(catExp)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const pieTotal = pieData.reduce((sum, [, amt]) => sum + amt, 0);
  let pieSvg = "";
  let legendHtml = "";
  if (pieData.length > 0) {
    let cumulative = 0;
    const colors = ["#c13515", "#e8714e", "#f0a080", "#f5bfab", "#faddd3"];
    pieData.forEach(([cat, amt], idx) => {
      const percent = (amt / pieTotal) * 100;
      const startAngle = cumulative * 3.6;
      const endAngle = (cumulative + percent) * 3.6;
      cumulative += percent;
      const largeArc = percent > 50 ? 1 : 0;
      const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180);
      const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180);
      const x2 = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180);
      const y2 = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180);
      const d = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
      pieSvg += `<path d="${d}" fill="${colors[idx]}" stroke="var(--card-bg)" stroke-width="1.5" class="pie-slice" style="animation: pieIn 0.8s ease forwards; animation-delay: ${idx * 0.1}s; opacity:0; transform-origin:50% 50%;"></path>`;
      legendHtml += `<div class="pie-legend-item"><div class="pie-legend-color" style="background:${colors[idx]}"></div><span class="pie-legend-name">${esc(cat)}</span><span class="pie-legend-value">${fmt(amt)} (${percent.toFixed(1)}%)</span></div>`;
    });
    if (!document.querySelector("#pieAnimStyle")) {
      const stylePie = document.createElement("style");
      stylePie.id = "pieAnimStyle";
      stylePie.textContent = `@keyframes pieIn { from { opacity:0; transform: scale(0.8); } to { opacity:1; transform: scale(1); } }`;
      document.head.appendChild(stylePie);
    }
  } else {
    const noStatsText = t("noStatsYet");
    // Разбиваем текст на строки (если в переводе есть \n, используем его, иначе разбиваем по запятой)
    let lines = noStatsText.split("\n");
    if (lines.length === 1 && noStatsText.length > 20) {
      // Если нет переноса, но текст длинный, разбиваем примерно посередине
      const mid = Math.floor(noStatsText.length / 2);
      let splitPoint = noStatsText.lastIndexOf(" ", mid);
      if (splitPoint === -1) splitPoint = mid;
      lines = [
        noStatsText.substring(0, splitPoint),
        noStatsText.substring(splitPoint + 1),
      ];
    }

    pieSvg = `<circle cx="50" cy="50" r="40" fill="var(--cream-dark)" stroke="var(--cream-border)"/>
    <text x="50" y="44" text-anchor="middle" fill="var(--text-muted)" font-size="6">${lines[0] || ""}</text>
    <text x="50" y="56" text-anchor="middle" fill="var(--text-muted)" font-size="6">${lines[1] || ""}</text>`;
    legendHtml = `<div class="pie-legend-item">${t("noStatsYet")}</div>`;
  }

  const html = `
  <div class="stats-v2">
    <div class="stat-status-card ${sClass}">
      <div class="stat-status-left"><div class="stat-status-emoji">${sEmoji}</div><div><div class="stat-status-title">${sTitle}</div><div class="stat-status-desc">${sDesc}</div></div></div>
      <div class="stat-status-count">${transactions.length}<span>${t("statsRec")}</span></div>
    </div>
    <div class="stat-kpi-grid">
      <div class="stat-kpi balance"><div class="stat-kpi-icon">💎</div><div class="stat-kpi-val ${bal >= 0 ? "pos" : "neg"}">${fmt(bal)}</div><div class="stat-kpi-label">${t("statsRemaining")}</div></div>
      <div class="stat-kpi start"><div class="stat-kpi-icon">💼</div><div class="stat-kpi-val">${fmt(startBalanceRub)}</div><div class="stat-kpi-label">${t("salary")}</div></div>
      <div class="stat-kpi income"><div class="stat-kpi-icon">📈</div><div class="stat-kpi-val inc">+${fmt(inc)}</div><div class="stat-kpi-label">${nInc} ${t("statsInc2")}</div></div>
      <div class="stat-kpi expense"><div class="stat-kpi-icon">📉</div><div class="stat-kpi-val exp">−${fmt(exp)}</div><div class="stat-kpi-label">${nExp} ${t("statsExp2")}</div></div>
    </div>
    <div class="stat-visual-row">
      <div class="stat-gauge-card"><div class="stat-section-label">${t("statsSavingsGauge")}</div>
        <div class="stat-gauge-wrap"><svg viewBox="0 0 160 95" class="stat-gauge-svg"><path d="M 18 88 A 62 62 0 0 1 142 88" fill="none" stroke="var(--cream-dark)" stroke-width="14" stroke-linecap="round"/><path d="M 18 88 A 62 62 0 0 1 142 88" fill="none" stroke="${gaugeColor}" stroke-width="14" stroke-linecap="round" stroke-dasharray="195" stroke-dashoffset="${195 - (savedPct / 100) * 195}" class="gauge-arc"/><text x="12" y="90" font-size="9" fill="var(--text-muted)" text-anchor="middle">0%</text><text x="80" y="22" font-size="9" fill="var(--text-muted)" text-anchor="middle">50%</text><text x="148" y="90" font-size="9" fill="var(--text-muted)" text-anchor="middle">100%</text></svg><div class="stat-gauge-center"><div class="stat-gauge-pct" style="color:${gaugeColor}">${savedPct}%</div><div class="stat-gauge-sub">${t("statsSaved2")}</div></div></div>
        <div class="stat-gauge-amount" style="color:${gaugeColor}">${savedAmt >= 0 ? "+" : ""}${fmt(savedAmt)}</div>
      </div>
      <div class="stat-donut-card"><div class="stat-section-label">${t("statsRatio")}</div>
        <div class="stat-donut2-wrap"><svg viewBox="0 0 100 100" class="stat-donut2-svg"><circle cx="50" cy="50" r="38" fill="none" stroke="var(--income-color)" stroke-width="18"/><circle cx="50" cy="50" r="38" fill="none" stroke="var(--expense-color)" stroke-width="18" stroke-dasharray="${spentPct * 2.388} ${(100 - spentPct) * 2.388}" stroke-dashoffset="0" transform="rotate(-90 50 50)" class="donut-arc"/></svg><div class="stat-donut2-center"><div class="stat-donut2-pct" style="color:var(--expense-color)">${spentPct}%</div><div class="stat-donut2-sub">${t("statsSpentOf2")}</div></div></div>
        <div class="stat-donut2-legend"><span class="stat-legend-dot" style="background:var(--income-color)"></span>${t("income")}<span class="stat-legend-dot" style="background:var(--expense-color);margin-left:8px"></span>${t("expense")}</div>
      </div>
    </div>
    ${allMonths.length > 1 ? `<div class="stat-chart-card"><div class="stat-section-label">${t("statsMonthlyDyn")}</div><div class="stat-chart-legend"><span class="stat-legend-dot" style="background:var(--income-color)"></span>${t("income")}<span class="stat-legend-dot" style="background:var(--expense-color);margin-left:12px"></span>${t("expense")}</div><div class="stat-chart-grid">${chartBars}</div><div class="stat-chart-note">${t("statsChartNote")}</div></div>` : ""}
    <!-- Круговая диаграмма расходов -->
    <div class="pie-chart-card">
      <div class="pie-chart-title">🍩 ${t("statsExpCats")} (топ-5)</div>
      <div class="pie-chart-wrapper">
        <div class="pie-svg-container"><svg viewBox="0 0 100 100" style="width:100%;height:100%;">${pieSvg}</svg></div>
        <div class="pie-legend">${legendHtml}</div>
      </div>
      <div class="pie-note">${t("statsMoreCats")}</div>
    </div>
    ${topExp.length ? `<div class="stat-cats-card"><div class="stat-section-label">${t("statsExpCats")}</div><div class="stat-cats-list">${catExpRows}</div>${topExp.length < Object.keys(catExp).length ? `<div class="stat-cats-more">+ ещё ${Object.keys(catExp).length - topExp.length} ${t("statsMoreCats")}</div>` : ""}</div>` : ""}
    ${topInc.length ? `<div class="stat-cats-card income-cats"><div class="stat-section-label">${t("statsIncCats")}</div><div class="stat-cats-list">${catIncRows}</div></div>` : ""}
    ${tips.length ? `<div class="stat-tips-card"><div class="stat-section-label">${t("statsTips")}</div>${tips.map((tip) => `<div class="stat-tip-item">${tip}</div>`).join("")}</div>` : ""}
    <div class="stat-summary-table">
      <div class="stat-section-label">${t("statsSummaryTable")}</div>
      <div class="stat-sum-row"><span class="stat-sum-label">${t("statsStartAmt")}</span><span class="stat-sum-val">${fmt(startBalanceRub)}</span></div>
      <div class="stat-sum-row inc-row"><span class="stat-sum-label">${t("statsTotalIncLabel")}</span><span class="stat-sum-val" style="color:var(--income-color)">+${fmt(inc)}</span></div>
      <div class="stat-sum-row exp-row"><span class="stat-sum-label">${t("statsTotalExpLabel")}</span><span class="stat-sum-val" style="color:var(--expense-color)">−${fmt(exp)}</span></div>
      <div class="stat-sum-row bal-row"><span class="stat-sum-label">${t("statsBalanceLabel")}</span><span class="stat-sum-val" style="color:${bal >= 0 ? "#2563eb" : "var(--expense-color)"};font-size:20px">${fmt(bal)}</span></div>
      <div class="stat-sum-row"><span class="stat-sum-label">${t("statsTotalOpsLabel")}</span><span class="stat-sum-val">${transactions.length}</span></div>
      <div class="stat-sum-row"><span class="stat-sum-label">${t("statsSavingsLabel")}</span><span class="stat-sum-val" style="color:${gaugeColor}">${savedPct}% (${fmt(Math.max(0, savedAmt))})</span></div>
    </div>
  </div>`;
  document.getElementById("mainContent").innerHTML = html;
  injectStatsStyles();
}

function injectStatsStyles() {
  if (document.getElementById("statsV2Styles")) return;
  const style = document.createElement("style");
  style.id = "statsV2Styles";
  style.textContent = `
  .stats-v2 { display:flex; flex-direction:column; gap:14px; animation:fadeUp 0.4s ease both; }
  .stats-empty-state { text-align:center; padding:60px 20px; }
  .stats-empty-icon  { font-size:64px; margin-bottom:16px; }
  .stats-empty-title { font-size:20px; font-weight:800; color:var(--text); margin-bottom:8px; }
  .stats-empty-sub   { font-size:15px; color:var(--text-muted); }
  .stat-status-card { border-radius:var(--radius-lg); padding:16px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; border:1.5px solid transparent; animation:fadeUp 0.3s ease both; }
  .stat-status-card.healthy { background:var(--income-pale); border-color:rgba(26,115,64,0.25); }
  .stat-status-card.warning { background:var(--gold-pale); border-color:var(--gold-border); }
  .stat-status-card.danger  { background:var(--expense-pale); border-color:rgba(193,53,21,0.25); }
  body.dark .stat-status-card.warning { background:var(--gold-pale); }
  .stat-status-left  { display:flex; align-items:center; gap:12px; }
  .stat-status-emoji { font-size:34px; line-height:1; flex-shrink:0; }
  .stat-status-title { font-size:17px; font-weight:800; color:var(--text); margin-bottom:2px; }
  .stat-status-desc  { font-size:13px; color:var(--text-soft); line-height:1.4; }
  .stat-status-count { font-size:28px; font-weight:900; color:var(--text-muted); text-align:right; flex-shrink:0; line-height:1; }
  .stat-status-count span { display:block; font-size:11px; font-weight:700; }
  .stat-section-label { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.7px; color:var(--text-muted); margin-bottom:12px; }
  .stat-kpi-grid { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:8px; animation:fadeUp 0.35s 0.05s ease both; }
  @media(max-width:480px) { .stat-kpi-grid { grid-template-columns:1fr 1fr; } }
  .stat-kpi { background:var(--card-bg); border-radius:var(--radius-md); padding:14px 10px; text-align:center; box-shadow:var(--shadow-sm); border:1.5px solid var(--cream-border); transition:var(--transition); }
  .stat-kpi:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
  .stat-kpi.balance { border-top:3px solid #2563eb; }
  .stat-kpi.income  { border-top:3px solid var(--income-color); }
  .stat-kpi.expense { border-top:3px solid var(--expense-color); }
  .stat-kpi.start   { border-top:3px solid var(--gold); }
  .stat-kpi-icon  { font-size:22px; margin-bottom:6px; }
  .stat-kpi-val   { font-size:clamp(12px,3vw,16px); font-weight:900; color:var(--text); line-height:1.1; word-break:break-all; }
  .stat-kpi-val.pos { color:#2563eb; }
  .stat-kpi-val.neg { color:var(--expense-color); }
  .stat-kpi-val.inc { color:var(--income-color); }
  .stat-kpi-val.exp { color:var(--expense-color); }
  .stat-kpi-label { font-size:11px; font-weight:700; color:var(--text-muted); margin-top:4px; }
  .stat-visual-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; animation:fadeUp 0.4s 0.08s ease both; }
  @media(max-width:360px) { .stat-visual-row { grid-template-columns:1fr; } }
  .stat-gauge-card, .stat-donut-card { background:var(--card-bg); border-radius:var(--radius-lg); padding:16px; box-shadow:var(--shadow-sm); border:1.5px solid var(--cream-border); }
  .stat-gauge-wrap   { position:relative; display:flex; justify-content:center; }
  .stat-gauge-svg    { width:100%; max-width:180px; overflow:visible; }
  .gauge-arc         { transition: stroke-dashoffset 1.3s cubic-bezier(0.34,1.3,0.64,1); }
  .stat-gauge-center { position:absolute; bottom:0; left:50%; transform:translateX(-50%); text-align:center; }
  .stat-gauge-pct    { font-size:22px; font-weight:900; line-height:1; }
  .stat-gauge-sub    { font-size:10px; color:var(--text-muted); font-weight:700; margin-top:2px; }
  .stat-gauge-amount { text-align:center; font-size:14px; font-weight:800; margin-top:6px; }
  .stat-donut2-wrap   { position:relative; width:86px; height:86px; margin:0 auto 8px; }
  .stat-donut2-svg    { width:86px; height:86px; }
  .donut-arc          { transition: stroke-dasharray 1s ease; }
  .stat-donut2-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .stat-donut2-pct    { font-size:18px; font-weight:900; line-height:1; }
  .stat-donut2-sub    { font-size:9px; color:var(--text-muted); font-weight:700; }
  .stat-donut2-legend { font-size:11px; font-weight:700; color:var(--text-muted); text-align:center; display:flex; align-items:center; justify-content:center; gap:4px; }
  .stat-legend-dot    { display:inline-block; width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .stat-chart-card { background:var(--card-bg); border-radius:var(--radius-lg); padding:16px; box-shadow:var(--shadow-sm); border:1.5px solid var(--cream-border); animation:fadeUp 0.4s 0.1s ease both; }
  .stat-chart-legend { display:flex; align-items:center; gap:4px; font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:12px; }
  .stat-chart-grid   { display:flex; align-items:flex-end; justify-content:space-around; gap:4px; height:80px; padding:0 4px; }
  .stat-chart-col    { flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; }
  .stat-chart-bars   { display:flex; align-items:flex-end; gap:2px; height:64px; }
  .stat-chart-bar    { width:13px; border-radius:4px 4px 0 0; min-height:3px; transition:height 0.8s cubic-bezier(0.34,1.3,0.64,1); }
  .stat-chart-bar.inc { background:var(--income-color); opacity:0.85; }
  .stat-chart-bar.exp { background:var(--expense-color); opacity:0.85; }
  .stat-chart-label  { font-size:9px; font-weight:700; color:var(--text-muted); margin-top:4px; white-space:nowrap; }
  .stat-chart-note   { font-size:11px; color:var(--text-muted); text-align:center; margin-top:10px; font-style:italic; }
  .stat-cats-card { background:var(--card-bg); border-radius:var(--radius-lg); padding:16px; box-shadow:var(--shadow-sm); border:1.5px solid var(--cream-border); border-left:5px solid var(--expense-color); animation:fadeUp 0.4s 0.12s ease both; }
  .stat-cats-card.income-cats { border-left-color:var(--income-color); }
  .stat-cats-list { display:flex; flex-direction:column; gap:14px; }
  .stat-cat-row   { display:flex; align-items:center; gap:10px; }
  .stat-cat-dot   { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .stat-cat-info  { flex:1; min-width:0; }
  .stat-cat-top   { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; gap:8px; }
  .stat-cat-name  { font-size:14px; font-weight:700; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; min-width:0; }
  .stat-cat-amount { font-size:14px; font-weight:900; white-space:nowrap; flex-shrink:0; }
  .stat-cat-bar-wrap { height:6px; background:var(--cream-dark); border-radius:99px; overflow:hidden; }
  .stat-cat-bar   { height:100%; border-radius:99px; transition:width 0.9s cubic-bezier(0.34,1.3,0.64,1); }
  .stat-cat-pct   { font-size:12px; font-weight:800; min-width:32px; text-align:right; flex-shrink:0; }
  .stat-cats-more { font-size:12px; color:var(--text-muted); text-align:center; margin-top:8px; font-style:italic; }
  .stat-tips-card { background:linear-gradient(135deg, var(--primary-pale), rgba(255,255,255,0.4)); border:1.5px solid rgba(64,145,108,0.3); border-radius:var(--radius-lg); padding:16px; animation:fadeUp 0.4s 0.14s ease both; }
  body.dark .stat-tips-card { background:linear-gradient(135deg, var(--primary-pale), rgba(0,0,0,0.1)); }
  .stat-tip-item { font-size:14px; color:var(--text-soft); line-height:1.5; padding:8px 0; border-bottom:1px solid var(--cream-border); }
  .stat-tip-item:last-child { border-bottom:none; padding-bottom:0; }
  .stat-summary-table { background:var(--card-bg); border-radius:var(--radius-lg); padding:16px; box-shadow:var(--shadow-sm); border:1.5px solid var(--cream-border); animation:fadeUp 0.4s 0.16s ease both; }
  .stat-sum-row { display:flex; justify-content:space-between; align-items:center; padding:10px 6px; border-bottom:1px solid var(--cream-border); gap:12px; }
  .stat-sum-row:last-child { border-bottom:none; }
  .stat-sum-row.bal-row { background:rgba(37,99,235,0.05); margin:0 -4px; padding:10px 10px; border-radius:8px; border-bottom:none; margin-top:4px; }
  .stat-sum-row.inc-row { background:rgba(26,115,64,0.04); margin:0 -4px; padding:10px 10px; border-radius:8px; border-bottom:none; }
  .stat-sum-row.exp-row { background:rgba(193,53,21,0.04); margin:0 -4px; padding:10px 10px; border-radius:8px; border-bottom:none; }
  .stat-sum-label { font-size:14px; color:var(--text-soft); font-weight:600; }
  .stat-sum-val   { font-size:16px; font-weight:900; color:var(--text); text-align:right; }
  .pie-chart-card { background:var(--card-bg); border-radius:var(--radius-lg); padding:16px; box-shadow:var(--shadow-sm); border:1.5px solid var(--cream-border); margin-top:8px; }
  .pie-chart-title { font-size:16px; font-weight:800; margin-bottom:16px; display:flex; align-items:center; gap:8px; color:var(--text); }
  .pie-chart-wrapper { display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:20px; }
  .pie-svg-container { flex-shrink:0; width:180px; height:180px; }
  .pie-legend { flex:1; min-width:150px; display:flex; flex-direction:column; gap:10px; }
  .pie-legend-item { display:flex; align-items:center; gap:10px; font-size:13px; font-weight:600; color:var(--text-soft); }
  .pie-legend-color { width:16px; height:16px; border-radius:4px; flex-shrink:0; }
  .pie-legend-name { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .pie-legend-value { font-weight:800; color:var(--text); }
  .pie-note { margin-top:12px; font-size:11px; color:var(--text-muted); text-align:center; font-style:italic; }
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
      <div class="tool-card-header">
        <div class="tool-card-title">${t("calculator")}</div>
        <button class="btn-secondary" id="showCalcHistoryBtn" style="padding:8px 14px;">📜 ${t("history")}</button>
      </div>
      <div class="section-hint">${t("calcHint")}</div>
      <div class="calc-display" id="calcDisplay">0</div>
      <div class="calc-grid" id="calcGrid"></div>
    </div>
    <div class="tool-card">
      <div class="tool-card-header">
        <div class="tool-card-title">${t("converter")}</div>
        <button class="btn-secondary" id="showConvHistoryBtn" style="padding:8px 14px;">📜 ${t("history")}</button>
      </div>
      <div class="section-hint">${t("convHint")}</div>
      <div class="field-group"><label class="field-label">${t("sumLabel")}</label><input type="number" id="convAmount" class="modal-input" value="100"></div>
      <div class="conv-row">
        <div><label>${t("fromCurrency")}</label><select id="convFrom" class="modal-select">${opts}</select></div>
        <div class="conv-arrow">→</div>
        <div><label>${t("toCurrency")}</label><select id="convTo" class="modal-select">${currencies.map((c, i) => `<option${i === 3 ? " selected" : ""}>${c}</option>`).join("")}</select></div>
      </div>
      <button class="btn-primary" id="convBtn" style="width:100%">${t("convert")}</button>
      <div id="convResult" style="display:none" class="conv-result"></div>
    </div>`;
  document.getElementById("mainContent").innerHTML = html;
  buildCalcGrid();
  document.getElementById("convBtn").addEventListener("click", () => {
    const amt = parseFloat(document.getElementById("convAmount").value);
    const from = document.getElementById("convFrom").value;
    const to = document.getElementById("convTo").value;
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
    ["+", "+"],
    ["+/−", "sign"],
    ["0", "0"],
    [".", "."],
    ["=", "="],
  ];
  grid.innerHTML = "";
  keys.forEach(([label, action]) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "calc-btn";
    if (action === "clear" || action === "back") btn.classList.add("clear");
    if (["/", "*", "-", "+", "%"].includes(action)) btn.classList.add("op");
    if (action === "=") {
      btn.classList.remove("op");
      btn.classList.add("equals");
    }
    btn.addEventListener("click", () => handleCalc(action));
    grid.appendChild(btn);
  });
}

function handleCalc(action) {
  if ([t("calcError"), "Error", "Ошибка"].includes(calcExpr)) calcExpr = "";
  if (action === "clear") calcExpr = "";
  else if (action === "back") calcExpr = calcExpr.slice(0, -1);
  else if (action === "sign")
    calcExpr = calcExpr.startsWith("-") ? calcExpr.slice(1) : "-" + calcExpr;
  else if (action === "=") {
    try {
      const res = Function('"use strict"; return (' + calcExpr + ")")();
      if (isFinite(res)) {
        calcHistory.unshift({
          expr: calcExpr,
          res,
          ts: new Date().toLocaleString(),
        });
        if (calcHistory.length > 50) calcHistory.pop();
        calcExpr = String(res);
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
    calcHistory.forEach((item, idx) => {
      html += `<div class="history-item"><div class="history-item-info"><div class="history-item-cat">${esc(item.expr)} = <strong>${item.res}</strong></div><div class="history-item-meta">${item.ts}</div></div><button class="icon-btn delete" data-idx="${idx}">✕</button></div>`;
    });
  html += `</div><div style="margin-top:16px;"><button class="btn-danger" id="clearCalcHist" style="width:100%">🗑 ${t("clearHistory")}</button></div>`;
  const modal = createModal("calcHistoryModal", t("history"), html);
  document.body.appendChild(modal);
  openModal("calcHistoryModal");
  modal.querySelectorAll(".icon-btn.delete").forEach((btn) =>
    btn.addEventListener("click", () => {
      calcHistory.splice(parseInt(btn.dataset.idx), 1);
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
    html += `<p style="padding:20px;color:var(--text-muted);">${t("historyEmpty")}</p>`;
  else
    convHistory.forEach((item, idx) => {
      html += `<div class="history-item"><div class="history-item-info"><div class="history-item-cat">${item.amt} ${item.from} → ${item.res.toFixed(4)} ${item.to}</div><div class="history-item-meta">${item.ts}</div></div><button class="icon-btn delete" data-idx="${idx}">✕</button></div>`;
    });
  html += `</div><div style="margin-top:16px;"><button class="btn-danger" id="clearConvHist" style="width:100%">🗑 ${t("clearHistory")}</button></div>`;
  const modal = createModal("convHistoryModal", t("history"), html);
  document.body.appendChild(modal);
  openModal("convHistoryModal");
  modal.querySelectorAll(".icon-btn.delete").forEach((btn) =>
    btn.addEventListener("click", () => {
      convHistory.splice(parseInt(btn.dataset.idx), 1);
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
    container.innerHTML = `<div class="empty-block"><div class="empty-emoji">📓</div><p>${t("noPages").replace("\n", "<br>")}</p></div>`;
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
  document.getElementById("nbDateBtn").addEventListener("click", () => {
    openDatePicker(document.getElementById("nbDate").value, (d) => {
      document.getElementById("nbDate").value = d;
      document.getElementById("nbDateDisplay").value = fmtDate(d);
    });
  });
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
function openAddCategoryModal(defaultType = "expense") {
  let selectedType = defaultType;
  const html = `<div class="field-group"><label class="field-label">${t("catTypeLabel")}</label><div class="cat-type-toggle"><button class="cat-type-btn expense ${defaultType === "expense" ? "active" : ""}" data-type="expense"><div class="cat-type-icon">💸</div><div class="cat-type-title">${t("catTypeExpenseTitle")}</div><div class="cat-type-desc">${t("catTypeExpenseDesc")}</div></button><button class="cat-type-btn income ${defaultType === "income" ? "active" : ""}" data-type="income"><div class="cat-type-icon">💰</div><div class="cat-type-title">${t("catTypeIncomeTitle")}</div><div class="cat-type-desc">${t("catTypeIncomeDesc")}</div></button></div></div><div class="field-group"><label class="field-label">${t("catNameLabel")}</label><input type="text" id="newCatName" class="modal-input" placeholder="${t("catNamePlaceholder")}" autofocus></div><div class="modal-actions"><button class="btn-secondary" id="addCatCancel">${t("cancel")}</button><button class="btn-primary" id="addCatSave">✚ ${t("save")}</button></div>`;
  const modal = createModal("addCatModal", t("addCatModalTitle"), html);
  document.body.appendChild(modal);
  openModal("addCatModal");
  modal.querySelectorAll(".cat-type-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      selectedType = btn.dataset.type;
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
    if (selectedType === "expense") {
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
  let html = `<div class="section-hint">💡 ${t("catHint")}</div><button class="cat-unified-add-btn" id="addCatUnifiedBtn"><span class="cat-unified-icon">✚</span><div><div class="cat-unified-title">${t("addCatModalTitle")}</div><div class="cat-unified-sub">${t("catTypeExpenseTitle")} · ${t("catTypeIncomeTitle")}</div></div></button><div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("expCatsTitle")}</div></div><div id="categoriesList"></div></div><div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("incomeCats")}</div></div><div id="incomeList"></div></div>`;
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
      div.innerHTML = `<div class="cat-item-header"><div class="cat-item-name">📁 ${esc(cat)}</div><button class="icon-btn delete" data-delcat="${esc(cat)}">✕</button></div><div class="chips-row" id="${safeId}"></div><button class="cat-add-sub-btn add-sub" data-cat="${esc(cat)}">＋ ${t("addSubcategory")}</button>`;
      container.appendChild(div);
      const chips = document.getElementById(safeId);
      data.subcats.forEach((sub) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = `${esc(sub)} <button class="chip-del" data-cat="${esc(cat)}" data-sub="${esc(sub)}">✕</button>`;
        chip.addEventListener("click", (e) => {
          if (e.target.classList.contains("chip-del")) return;
          openInputModal(t("editSubcatTitle"), t("newName"), sub, (newName) => {
            if (newName?.trim()) {
              const idx = catObj[cat].subcats.indexOf(sub);
              if (idx !== -1) {
                catObj[cat].subcats[idx] = newName.trim();
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
      div.querySelector(".cat-item-name").addEventListener("click", () => {
        openInputModal(t("editCatTitle"), t("newName"), cat, (newName) => {
          if (newName?.trim() && !catObj[newName]) {
            catObj[newName] = catObj[cat];
            delete catObj[cat];
            saveAll();
            renderCategories();
          }
        });
      });
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
// НАСТРОЙКИ
// ============================================================
function renderSettings() {
  const html = `<div class="settings-card"><div class="settings-card-title">${t("currency")}</div><div class="settings-card-desc">${t("explanationCurrency")}</div><div class="settings-card-body"><select id="currencySelect" class="settings-select"><option value="RUB">🇷🇺 ${t("currRUB")}</option><option value="USD">🇺🇸 ${t("currUSD")}</option><option value="EUR">🇪🇺 ${t("currEUR")}</option><option value="GEL">🇬🇪 ${t("currGEL")}</option><option value="GBP">🇬🇧 ${t("currGBP")}</option><option value="KZT">🇰🇿 ${t("currKZT")}</option></select></div></div><div class="settings-card"><div class="settings-card-title">${t("theme")}</div><div class="settings-card-desc">${t("explanationTheme")}</div><div class="settings-card-body"><select id="themeSelect" class="settings-select"><option value="light">${t("light")}</option><option value="dark">${t("dark")}</option></select></div></div><div class="settings-card"><div class="settings-card-title">${t("language")}</div><div class="settings-card-desc">${t("explanationLanguage")}</div><div class="settings-card-body"><select id="langSelect" class="settings-select"><option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option><option value="ka">🇬🇪 ქართული</option></select></div></div><div class="settings-card"><div class="settings-card-title">${t("data")}</div><div class="settings-card-desc">${t("explanationRates")}</div><div class="settings-card-body"><button class="settings-btn primary" id="refreshRatesBtn">${t("updateRates")}</button><button class="settings-btn danger" id="clearAllBtn" style="margin-top:8px">${t("resetAll")}</button></div></div><div class="settings-card" style="border-color:var(--gold-border);"><div class="settings-card-title">🌟 Pro <span class="pro-badge">SOON</span></div><div class="settings-card-desc">${t("explanationPro")}</div><div class="settings-card-body"><button class="settings-btn pro" id="proVersionBtn">${t("proVersion")}</button></div></div><div style="text-align:center;padding:20px;color:var(--text-muted);">${t("appFooter").replace("\n", "<br>")}</div>`;
  document.getElementById("mainContent").innerHTML = html;
  document.getElementById("currencySelect").value = displayCurrency;
  document.getElementById("currencySelect").onchange = (e) => {
    displayCurrency = e.target.value;
    saveAll();
    updateTopBlocks();
    if (currentTab === "home") renderOpsList();
    showToast(t("currencyChanged"));
  };
  const savedTheme = localStorage.getItem("theme") || "light";
  document.getElementById("themeSelect").value = savedTheme;
  document.getElementById("themeSelect").onchange = (e) => {
    document.body.className = e.target.value;
    localStorage.setItem("theme", e.target.value);
    showToast(t("themeChanged"));
  };
  document.getElementById("langSelect").value = currentLang;
  document.getElementById("langSelect").onchange = (e) =>
    setLanguage(e.target.value);
  document.getElementById("refreshRatesBtn").onclick = async () => {
    document.getElementById("refreshRatesBtn").textContent = t("loading");
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/RUB");
      const data = await res.json();
      for (const c of ["USD", "EUR", "GEL", "GBP", "KZT"])
        exchangeRates[c] = data.rates[c] || exchangeRates[c];
      saveAll();
      updateTopBlocks();
      showToast(t("ratesUpdated"));
    } catch (e) {
      showToast(t("error"), "error");
    }
    document.getElementById("refreshRatesBtn").textContent =
      "🔄 " + t("updateRates");
  };
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
        localStorage.removeItem("welcomeSeen");
        saveAll();
        updateTopBlocks();
        showToast(t("resetDone"));
        setTimeout(() => setTab("home"), 500);
      },
      { icon: "⚠️", title: t("resetConfirmTitle"), yesText: t("yesDeleteAll") },
    );
  };
  document.getElementById("proVersionBtn").onclick = () =>
    showToast(t("proComingSoon"));
}

// ============================================================
// ИНСТРУКЦИЯ
// ============================================================
function showHelpModal() {
  const modal = createModal(
    "helpModal",
    t("helpTitle"),
    `<div style="max-height:70vh;overflow-y:auto;padding-right:8px;">${t("helpContent")}</div>`,
  );
  document.body.appendChild(modal);
  openModal("helpModal");
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ
// ============================================================
function openInputModal(title, label, defaultVal, onSave) {
  const html = `<div class="field-group"><label class="field-label">${esc(label)}</label><input type="text" id="inputModalVal" class="modal-input" value="${esc(defaultVal)}" autofocus></div><div class="modal-actions"><button class="btn-secondary" id="inputModalCancel">${t("cancel")}</button><button class="btn-primary" id="inputModalSave">${t("save")}</button></div>`;
  const modal = createModal("inputModal", title, html);
  document.body.appendChild(modal);
  openModal("inputModal");
  setTimeout(() => document.getElementById("inputModalVal")?.focus(), 300);
  document.getElementById("inputModalSave").addEventListener("click", () => {
    const val = document.getElementById("inputModalVal").value.trim();
    closeModal("inputModal");
    onSave(val);
  });
  document
    .getElementById("inputModalCancel")
    .addEventListener("click", () => closeModal("inputModal"));
  document.getElementById("inputModalVal").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("inputModalSave").click();
  });
}

function createModal(id, title, bodyHtml) {
  document.getElementById(id)?.remove();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = id;
  overlay.innerHTML = `<div class="modal"><div class="modal-handle"></div><div class="modal-header"><h2>${esc(title)}</h2><button class="modal-close" aria-label="${t("cancel")}">✕</button></div><div class="modal-body">${bodyHtml}</div></div>`;
  overlay
    .querySelector(".modal-close")
    .addEventListener("click", () => closeModal(id));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(id);
  });
  return overlay;
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
// ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ КАРТОЧЕК
// ============================================================
loadAll();
applyTranslations();
updateTopBlocks();
updateHeader();
addHeaderButtons();
document.documentElement.lang = currentLang;

const savedThemeLocal = localStorage.getItem("theme") || "light";
document.body.className = savedThemeLocal;
document.getElementById("themeToggle").textContent =
  savedThemeLocal === "dark" ? "☀️" : "🌙";
document.getElementById("themeToggle").addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  document.body.className = isDark ? "light" : "dark";
  localStorage.setItem("theme", document.body.className);
  document.getElementById("themeToggle").textContent = isDark ? "🌙" : "☀️";
  showToast(isDark ? t("themeLight") : t("themeDark"));
});

document.querySelectorAll(".summary-card").forEach((card) => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    if (type === "salary") {
      openSalaryModal();
      return;
    }
    if (type === "income" || type === "expense") {
      currentFilter = type;
      if (currentTab !== "home") setTab("home");
      else renderOpsList();
      setTimeout(() => {
        const opsListEl =
          document.querySelector(".ops-list") ||
          document.getElementById("opsList");
        if (opsListEl)
          opsListEl.scrollIntoView({ behavior: "smooth", block: "start" });
        // Используем переводы
        showToast(
          type === "income" ? t("toastIncomeFilter") : t("toastExpenseFilter"),
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

// ============================================================
// ИНТЕРАКТИВНЫЙ ГАЙД (ТУР) С ПОДСВЕТКОЙ
// ============================================================
let currentGuideStep = 0;
let guideSteps = [];

function getGuideSteps() {
  return t("guideSteps");
}

function startGuide() {
  guideSteps = getGuideSteps();
  if (!guideSteps || guideSteps.length === 0) return;
  currentGuideStep = 0;
  showGuideStep(currentGuideStep);
}

function showGuideStep(stepIndex) {
  if (stepIndex >= guideSteps.length) {
    finishGuide();
    return;
  }
  const step = guideSteps[stepIndex];
  const targetElement = document.querySelector(step.element);
  if (!targetElement) {
    currentGuideStep++;
    showGuideStep(currentGuideStep);
    return;
  }

  // Удаляем старые элементы
  document
    .querySelectorAll(".guide-overlay, .guide-highlight, .guide-tooltip")
    .forEach((el) => el.remove());

  // Оверлей
  const overlay = document.createElement("div");
  overlay.className = "guide-overlay";
  document.body.appendChild(overlay);

  // Подсветка
  const rect = targetElement.getBoundingClientRect();
  const highlight = document.createElement("div");
  highlight.className = "guide-highlight";
  highlight.style.left = rect.left + "px";
  highlight.style.top = rect.top + "px";
  highlight.style.width = rect.width + "px";
  highlight.style.height = rect.height + "px";
  document.body.appendChild(highlight);

  // Подсказка
  const tooltip = document.createElement("div");
  tooltip.className = "guide-tooltip";
  tooltip.innerHTML = `
    <div class="guide-tooltip-title">${esc(step.title)}</div>
    <div class="guide-tooltip-desc">${esc(step.desc)}</div>
    <div class="guide-tooltip-actions">
      <button class="guide-btn-skip">${t("guideSkip")}</button>
      <button class="guide-btn-next">${stepIndex === guideSteps.length - 1 ? t("guideFinish") : t("guideNext")}</button>
    </div>
  `;
  document.body.appendChild(tooltip);

  // Позиционирование подсказки
  const tooltipRect = tooltip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.bottom + 10;
  if (top + tooltipRect.height > window.innerHeight) {
    top = rect.top - tooltipRect.height - 10;
  }
  left = Math.max(
    10,
    Math.min(left, window.innerWidth - tooltipRect.width - 10),
  );
  tooltip.style.left = left + "px";
  tooltip.style.top = top + "px";

  // Кнопки
  const nextBtn = tooltip.querySelector(".guide-btn-next");
  const skipBtn = tooltip.querySelector(".guide-btn-skip");
  const closeGuide = () => {
    overlay.remove();
    highlight.remove();
    tooltip.remove();
  };
  nextBtn.addEventListener("click", () => {
    closeGuide();
    currentGuideStep++;
    showGuideStep(currentGuideStep);
  });
  skipBtn.addEventListener("click", () => {
    closeGuide();
    finishGuide();
  });
}

function finishGuide() {
  localStorage.setItem("guideShown", "true");
  currentGuideStep = 0;
  document
    .querySelectorAll(".guide-overlay, .guide-highlight, .guide-tooltip")
    .forEach((el) => el.remove());
}

function showHelpWithGuide() {
  if (!localStorage.getItem("guideShown")) {
    startGuide();
  } else {
    showHelpModal();
  }
}

// Автозапуск при первом визите
setTimeout(() => {
  if (!localStorage.getItem("guideShown") && transactions.length === 0) {
    startGuide();
  }
}, 1000);

document
  .querySelectorAll(".nav-btn")
  .forEach((btn) =>
    btn.addEventListener("click", () => setTab(btn.dataset.tab)),
  );
document.getElementById("fabBtn").addEventListener("click", openAddModal);
setTab("home");
