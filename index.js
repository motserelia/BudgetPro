/* ============================================================
   МОЙ БЮДЖЕТ — index.js
   Полная логика приложения с кастомным выбором даты
   ============================================================ */

// ============================================================
// МУЛЬТИЯЗЫЧНОСТЬ
// ============================================================
const translations = {
  ru: {
    // Название приложения
    appName: "🌿 Мой Бюджет",
    // Карточки сверху — БЕЗ эмодзи (иконки отдельно в HTML)
    balance: "Мой баланс",
    income: "Доходы",
    expense: "Расходы",
    salary: "Нач. сумма",
    // Нижнее меню — БЕЗ эмодзи (иконки отдельно в HTML)
    home: "Главная",
    stats: "Статистика",
    tools: "Инструменты",
    notebook: "Блокнот",
    categories: "Категории",
    settings: "Настройки",
    // Кнопки
    add: "Добавить",
    edit: "Изменить",
    delete: "Удалить",
    save: "Сохранить",
    cancel: "Отмена",
    // Форма добавления
    type: "Что добавить?",
    expenseType: "💸 Расход",
    incomeType: "💰 Доход",
    category: "Категория",
    subcategory: "Подкатегория",
    amount: "Сумма",
    date: "Дата",
    note: "Заметка",
    selectCategory: "— выберите категорию —",
    noSubcategory: "— без подкатегории —",
    // История
    allHistory: "📜 Вся история операций",
    historyHint: "Нажмите, чтобы увидеть все ваши записи за всё время",
    // Баланс
    editBalance: "Изменить начальную сумму",
    editSalaryHint: "👆 Нажмите, чтобы изменить",
    totalIncome: "📈 Всего доходов",
    totalExpense: "📉 Всего расходов",
    currentBalance: "💎 Текущий баланс",
    salary_label: "💼 Начальная сумма",
    // Пустой список
    noOperations:
      "Пока нет записей.\nНажмите зелёную кнопку «Добавить» внизу ↓",
    // Модалки операций
    newOperation: "Новая операция",
    editOperation: "Изменить запись",
    confirmDelete: "Удалить эту запись?",
    confirmDeleteAll: "Удалить ВСЕ записи?",
    enterAmount: "Введите сумму",
    enterPositive: "Сумма должна быть больше нуля",
    selectCategoryFirst: "Пожалуйста, выберите категорию",
    // Инструменты
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
    // Блокнот
    newPage: "Новая страница",
    pageTitle: "Название страницы",
    content: "Текст заметки",
    noPages: "Нет страниц.\nНажмите «Новая страница» выше",
    notebookHint:
      "Здесь храните важные заметки: номера телефонов, напоминания, планы трат.",
    // Категории
    addCategory: "Добавить категорию расходов",
    addIncomeCategory: "Добавить категорию доходов",
    deleteCategory: "Удалить категорию",
    addSubcategory: "Добавить подкатегорию",
    incomeCats: "💰 Категории доходов",
    expCatsTitle: "📉 Категории расходов",
    catHint:
      "Категории помогают группировать расходы и доходы. Нажмите на название категории, чтобы изменить его. Нажмите ✕ рядом с подкатегорией, чтобы удалить её.",
    newExpCatTitle: "Новая категория расходов",
    newIncCatTitle: "Новая категория доходов",
    editCatTitle: "Изменить название категории",
    editSubcatTitle: "Изменить подкатегорию",
    newSubcatTitle: "Новая подкатегория",
    catNameLabel: "Введите название:",
    newName: "Новое название:",
    inCategoryLabel: "В категории:",
    // Настройки
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
    // Валюты (полные названия)
    currRUB: "₽ Российский рубль",
    currUSD: "$ Доллар США",
    currEUR: "€ Евро",
    currGEL: "₾ Грузинский лари",
    currGBP: "£ Фунт стерлингов",
    currKZT: "₸ Казахстанский тенге",
    // Символы
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
    // Подсказки карточек
    cardHintBalance: "Сколько у вас сейчас",
    cardHintIncome: "Всего получено",
    cardHintExpense: "Всего потрачено",
    cardHintSalary: "👆 Нажмите чтобы изменить",
    // Aria-labels карточек
    ariaBalance: "Баланс — нажмите для подробностей",
    ariaIncome: "Доходы — нажмите для просмотра",
    ariaExpense: "Расходы — нажмите для просмотра",
    ariaSalary: "Начальная сумма — нажмите чтобы изменить",
    // История операций (над списком)
    recentOpsLabel: "📋 История доходов и расходов",
    recentOpsHint: "Нажмите на любую запись — чтобы изменить или удалить",
    // Добавление категории — модалка
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
    // Новые ключи
    salaryModalHint:
      "💡 Это начальная сумма — деньги, с которых вы начинаете учёт. Обычно это зарплата или сбережения.",
    catFieldDesc: "Название категории этой записи",
    toggleTheme: "Переключить тему",
    ariaNav: "Основное меню",
    ariaFab: "Добавить доход или расход",
    ariaNavHome: "Главная страница",
    ariaNavStats: "Статистика",
    ariaNavTools: "Инструменты",
    ariaNavNotebook: "Блокнот",
    ariaNavCategories: "Категории",
    ariaNavSettings: "Настройки",
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
    // Футер настроек
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
    // Дни недели и месяцы
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
  },
  en: {
    appName: "🌿 My Budget",
    balance: "My balance",
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
    category: "Category",
    subcategory: "Subcategory",
    amount: "Amount",
    date: "Date",
    note: "Note",
    selectCategory: "— select a category —",
    noSubcategory: "— no subcategory —",
    allHistory: "📜 Full transaction history",
    historyHint: "Tap to see all your records over all time",
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
    convHint: "Enter an amount, choose «from» and «to» — tap «Convert»",
    fromCurrency: "From currency",
    toCurrency: "To currency",
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
      "Categories help group expenses and income. Tap a category name to rename it. Tap ✕ next to a subcategory to remove it.",
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
    explanationTheme:
      "Light or dark background — choose what's easier on your eyes.",
    explanationLanguage: "Choose the app language.",
    explanationRates: "Download current exchange rates from the internet.",
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
      "Here you can record income and expenses. Tap the green «Add» button below to get started.",
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
    ariaBalance: "Balance — tap for details",
    ariaIncome: "Income — tap to view",
    ariaExpense: "Expenses — tap to view",
    ariaSalary: "Starting amount — tap to change",
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
      "💡 This is your starting amount — the money you begin tracking with. Usually your salary or savings.",
    catFieldDesc: "Name of the category for this record",
    toggleTheme: "Switch theme",
    ariaNav: "Main navigation",
    ariaFab: "Add income or expense",
    ariaNavHome: "Home page",
    ariaNavStats: "Statistics",
    ariaNavTools: "Tools",
    ariaNavNotebook: "Notebook",
    ariaNavCategories: "Categories",
    ariaNavSettings: "Settings",
    statsTransCount: "records",
    statsSaved: "💾 Saved",
    statsSavingsRate: "of income saved",
    statsHealthy: "✅ Budget is healthy — spending is less than income",
    statsWarning: "⚠️ Caution — expenses exceed income",
    statsBreakeven: "〰️ Expenses equal income",
    statsSpentOf: "spent of income",
    statsIncomeSection: "📈 Income breakdown",
    statsExpSection: "📉 Where the money goes",
    statsTotalOps: "Total records",
    appFooter:
      "My Budget v2.0 · Works offline 📴\nAll data is stored only on your device 🔒",
    historyEmpty: "History is empty",
    loading: "⏳ Loading...",
    ariaDeleteOp: "Delete record",
    ariaEditOp: "Edit",
    ariaDeleteOp2: "Delete",
    addOpTypeDesc: "Choose what you spent on or where income came from",
    incomeAdded: "✓ Income added!",
    expenseAdded: "✓ Expense added!",
    newNotebookTitle: "📝 New note",
    notebookPlaceholder: "Write here...",
    currencyChanged: "✓ Currency changed",
    themeChanged: "✓ Theme changed",
    resetConfirmMsg:
      "All records, notes and settings will be deleted. This cannot be undone.",
    proComingSoon: "🌟 Pro version coming soon!",
    themeLight: "☀️ Light theme",
    themeDark: "🌙 Dark theme",
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
  },
  ka: {
    appName: "🌿 ჩემი ბიუჯეტი",
    balance: "ჩემი ბალანსი",
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
    category: "კატეგორია",
    subcategory: "ქვეკატეგორია",
    amount: "თანხა",
    date: "თარიღი",
    note: "შენიშვნა",
    selectCategory: "— აირჩიეთ კატეგორია —",
    noSubcategory: "— ქვეკატეგორიის გარეშე —",
    allHistory: "📜 ოპერაციების სრული ისტორია",
    historyHint: "დააჭირეთ, რომ ნახოთ ყველა თქვენი ჩანაწერი",
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
    calcHint: "დააჭირეთ ციფრებს და ნიშნებს, როგორც ჩვეულებრივ კალკულატორზე",
    convHint:
      "შეიყვანეთ თანხა, აირჩიეთ «საიდან» და «სად» — დააჭირეთ «გადაყვანა»",
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
    noPages: "გვერდები არ არის.\nდააჭირეთ «ახალი გვერდი» ზემოთ",
    notebookHint:
      "შეინახეთ მნიშვნელოვანი ჩანაწერები: ტელეფონის ნომრები, შეხსენებები, ხარჯის გეგმები.",
    addCategory: "ხარჯის კატეგორიის დამატება",
    addIncomeCategory: "შემოსავლის კატეგორიის დამატება",
    deleteCategory: "კატეგორიის წაშლა",
    addSubcategory: "ქვეკატეგორიის დამატება",
    incomeCats: "💰 შემოსავლის კატეგორიები",
    expCatsTitle: "📉 ხარჯის კატეგორიები",
    catHint:
      "კატეგორიები გეხმარებათ ხარჯებისა და შემოსავლების დაჯგუფებაში. დააჭირეთ კატეგორიის სახელს მის შესაცვლელად. დააჭირეთ ✕ ქვეკატეგორიის გვერდით მის წასაშლელად.",
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
    explanationCurrency: "აირჩიეთ ვალუტა, რომელშიც გამოჩნდება ყველა თანხა.",
    explanationTheme: "ღია ან მუქი ფონი — აირჩიეთ რაც თვალს მოხდება.",
    explanationLanguage: "აპლიკაციის ენის არჩევა.",
    explanationRates: "ჩამოტვირთეთ ვალუტის კურსები ინტერნეტიდან.",
    explanationReset: "წაშალეთ ყველა მონაცემი და დაიწყეთ თავიდან.",
    explanationPro: "გაფართოებული ვერსია გრაფიკებითა და ექსპორტით.",
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
    welcomeText:
      "აქ შეგიძლიათ ჩაწეროთ შემოსავალი და ხარჯი. დააჭირეთ მწვანე «დამატება» ღილაკს დასაწყებად.",
    welcomeClose: "გასაგებია, ვიწყებთ!",
    expCategory: "ხარჯის კატეგორია",
    incCategory: "შემოსავლის კატეგორია",
    expSub: "ქვეკატეგორია (არასავალდებულო)",
    amountHint: "შეიყვანეთ ციფრი, მაგ: 150",
    dateHint: "ოპერაციის თარიღი",
    noteHint: "შეიძლება ცარიელი დარჩეს",
    addSubHint: "ქვეკატეგორია დაგეხმარება ხარჯის დაზუსტებაში (არასავალდებულო)",
    cardHintBalance: "რამდენი გაქვთ ახლა",
    cardHintIncome: "სულ მიღებული",
    cardHintExpense: "სულ დახარჯული",
    cardHintSalary: "👆 დააჭირეთ შესაცვლელად",
    ariaBalance: "ბალანსი — დააჭირეთ დეტალებისთვის",
    ariaIncome: "შემოსავალი — დააჭირეთ სანახავად",
    ariaExpense: "ხარჯი — დააჭირეთ სანახავად",
    ariaSalary: "საწყისი თანხა — დააჭირეთ შესაცვლელად",
    recentOpsLabel: "📋 შემოსავლებისა და ხარჯების ისტორია",
    recentOpsHint: "დააჭირეთ ნებისმიერ ჩანაწერს — შესაცვლელად ან წასაშლელად",
    addCatModalTitle: "კატეგორიის დამატება",
    catTypeLabel: "აირჩიეთ კატეგორიის ტიპი",
    catTypeExpenseTitle: "💸 ხარჯი",
    catTypeExpenseDesc:
      "შენაძენები, სერვისების გადახდა, კომუნალური და ნებისმიერი ხარჯი",
    catTypeIncomeTitle: "💰 შემოსავალი",
    catTypeIncomeDesc:
      "ხელფასი, პენსია, საჩუქრები, ფრილანსი და სხვა შემოსავლები",
    catNamePlaceholder: "მაგ: «ტრანსპორტი» ან «აფთიაქი»",
    noStatsYet: "დაამატეთ პირველი ჩანაწერები,\nსტატისტიკის სანახავად",
    salaryModalHint:
      "💡 ეს არის საწყისი თანხა — ფული, რომლითაც იწყებთ აღრიცხვას. ჩვეულებრივ ეს ხელფასი ან დანაზოგია.",
    catFieldDesc: "ამ ჩანაწერის კატეგორიის სახელი",
    toggleTheme: "თემის გადართვა",
    ariaNav: "მთავარი მენიუ",
    ariaFab: "შემოსავლის ან ხარჯის დამატება",
    ariaNavHome: "მთავარი გვერდი",
    ariaNavStats: "სტატისტიკა",
    ariaNavTools: "ინსტრუმენტები",
    ariaNavNotebook: "ბლოკნოტი",
    ariaNavCategories: "კატეგორიები",
    ariaNavSettings: "პარამეტრები",
    statsTransCount: "ჩანაწერი",
    statsSaved: "💾 დაზოგილია",
    statsSavingsRate: "შემოსავლიდან დაზოგილია",
    statsHealthy: "✅ ბიუჯეტი ნორმაშია — ხარჯი შემოსავალზე ნაკლებია",
    statsWarning: "⚠️ ყურადღება — ხარჯი შემოსავალს აღემატება",
    statsBreakeven: "〰️ ხარჯი შემოსავლის ტოლია",
    statsSpentOf: "შემოსავლიდან დახარჯულია",
    statsIncomeSection: "📈 შემოსავლების სტრუქტურა",
    statsExpSection: "📉 სად მიდის ფული",
    statsTotalOps: "სულ ჩანაწერი",
    appFooter:
      "ჩემი ბიუჯეტი v2.0 · მუშაობს ინტერნეტის გარეშე 📴\nყველა მონაცემი ინახება მხოლოდ თქვენს მოწყობილობაზე 🔒",
    historyEmpty: "ისტორია ცარიელია",
    loading: "⏳ იტვირთება...",
    ariaDeleteOp: "წაშლა",
    ariaEditOp: "შეცვლა",
    ariaDeleteOp2: "წაშლა",
    addOpTypeDesc: "აირჩიეთ, რაზე დახარჯეთ ან საიდან მოვიდა შემოსავალი",
    incomeAdded: "✓ შემოსავალი დამატებულია!",
    expenseAdded: "✓ ხარჯი დამატებულია!",
    newNotebookTitle: "📝 ახალი შენიშვნა",
    notebookPlaceholder: "დაწერეთ აქ...",
    currencyChanged: "✓ ვალუტა შეიცვალა",
    themeChanged: "✓ თემა შეიცვალა",
    resetConfirmMsg:
      "ყველა ჩანაწერი, შენიშვნა და პარამეტრი წაიშლება. ეს შეუქცევადია.",
    proComingSoon: "🌟 Pro-ვერსია მალე იქნება ხელმისაწვდომი!",
    themeLight: "☀️ ღია თემა",
    themeDark: "🌙 მუქი თემა",
    yesDeleteAll: "✓ დიახ, წავშალოთ ყველა",
    resetConfirmTitle: "ყველაფრის წაშლა?",
    defaultNotePage: "📝 შენიშვნა",
    calcError: "შეცდომა",
    confirmOkBtn: "✓ დიახ, წაშლა",
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
  },
};

let currentLang = localStorage.getItem("lang") || "ru";
function t(key) {
  return translations[currentLang]?.[key] || key;
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
  }
}
const localeMap = { ru: "ru-RU", en: "en-US", ka: "ka-GE" };

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key])
      el.textContent = translations[currentLang][key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (translations[currentLang][key])
      el.setAttribute("aria-label", translations[currentLang][key]);
  });
  const logo = document.querySelector(".app-logo");
  if (logo) logo.textContent = t("appName");
  const fabText = document.querySelector(".fab-text");
  if (fabText) fabText.textContent = t("add");
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.setAttribute("aria-label", t("toggleTheme"));
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
  overlay.classList.add("open");
  const cancelBtn = document.getElementById("confirmCancel");
  const okBtn = document.getElementById("confirmOk");
  const close = () => overlay.classList.remove("open");
  cancelBtn.onclick = close;
  okBtn.onclick = () => {
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
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
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
  const bal = startBalanceRub + inc - exp;
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
    content.querySelectorAll(".tab-anim-child").forEach((el, i) => {
      el.style.animationDelay = i * 0.06 + "s";
    });
  }, 160);
}

// ============================================================
// ГЛАВНАЯ
// ============================================================
let currentListType = "balance";

function renderHome() {
  const showWelcome =
    !localStorage.getItem("welcomeSeen") && transactions.length === 0;
  let html = "";

  if (showWelcome) {
    html += `<div class="welcome-tip tab-anim-child">
      <div class="welcome-tip-icon">👋</div>
      <div class="welcome-tip-text">
        <h3>${t("welcomeTitle")}</h3>
        <p>${t("welcomeText")}</p>
        <button class="welcome-tip-close" id="welcomeClose">${t("welcomeClose")}</button>
      </div>
    </div>`;
  }

  html += `
    <div class="history-btn-wrap tab-anim-child">
      <button class="history-btn" id="showAllHistoryBtn"> ${t("allHistory")}</button>
      <div class="history-btn-hint">💡 ${t("historyHint")}</div>
    </div>`;
  html += '<div id="opsList"></div>';

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

  let inc = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amountRub, 0);
  let exp = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amountRub, 0);
  let bal = startBalanceRub + inc - exp;

  let html = `<div class="balance-summary tab-anim-child">
    <div class="balance-row row-salary" id="salaryRowBtn" role="button" tabindex="0">
      <div class="balance-row-left">
        <span class="balance-row-dot dot-salary"></span>
        <span class="balance-row-label"> ${t("salary_label")}</span>
      </div>
      <div>
        <span class="balance-row-value">${fmt(startBalanceRub)}</span>
        <div class="balance-row-sub">${t("editSalaryHint")}</div>
      </div>
    </div>
    <div class="balance-row row-income">
      <div class="balance-row-left">
        <span class="balance-row-dot dot-income"></span>
        <span class="balance-row-label">${t("totalIncome")}</span>
      </div>
      <span class="balance-row-value income">+${fmt(inc)}</span>
    </div>
    <div class="balance-row row-expense">
      <div class="balance-row-left">
        <span class="balance-row-dot dot-expense"></span>
        <span class="balance-row-label">${t("totalExpense")}</span>
      </div>
      <span class="balance-row-value expense">−${fmt(exp)}</span>
    </div>
    <div class="balance-row row-balance">
      <div class="balance-row-left">
        <span class="balance-row-dot dot-balance"></span>
        <span class="balance-row-label">${t("currentBalance")}</span>
      </div>
      <span class="balance-row-value ${bal >= 0 ? "positive" : "negative"}">${fmt(bal)}</span>
    </div>
  </div>`;

  const recent = [...transactions]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 20);

  if (recent.length === 0) {
    html += `<div class="empty-block tab-anim-child">
      <div class="empty-emoji">💸</div>
      <p>${t("noOperations").replace("\n", "<br>")}</p>
      <p class="empty-hint">👇 ${t("add")}</p>
    </div>`;
  } else {
    html += `<div class="ops-section-header">
      <div class="ops-section-label">${t("recentOpsLabel")}</div>
      <div class="ops-section-hint">💡 ${t("recentOpsHint")}</div>
    </div>`;
    html += '<div class="ops-list">';
    recent.forEach((tx) => {
      const idx = transactions.indexOf(tx);
      const emoji = getOpEmoji(tx);
      const sign = tx.type === "income" ? "+" : "−";
      html += `<div class="op-card tab-anim-child" data-idx="${idx}" data-type="${tx.type}">
        <div class="op-emoji">${emoji}</div>
        <div class="op-info">
          <div class="op-category">${esc(tx.category)}${tx.subcategory ? ' · <span style="font-weight:400;color:var(--text-muted)">' + esc(tx.subcategory) + "</span>" : ""}</div>
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
    const idx = parseInt(card.dataset.idx);
    card.addEventListener("click", () => openEditModal(idx));
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
}

function getOpEmoji(tx) {
  const cat = (tx.category || "").toLowerCase();
  const emojiMap = {
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
  for (const [k, v] of Object.entries(emojiMap)) {
    if (cat.includes(k)) return v;
  }
  return tx.type === "income" ? "💰" : "💸";
}

// ============================================================
// ПОЛНАЯ ИСТОРИЯ
// ============================================================
function showFullHistory() {
  const allOps = [...transactions].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
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
        <button class="icon-btn edit"   data-idx="${realIdx}" aria-label="${t("ariaEditOp")}">✏️</button>
        <button class="icon-btn delete" data-idx="${realIdx}" aria-label="${t("ariaDeleteOp2")}">🗑</button>
      </div>
    </div>`;
  });
  listHTML += "</div>";
  listHTML += `<div style="margin-top:16px;"><button class="btn-danger" id="clearAllHistoryBtn" style="width:100%">🗑 ${t("clearAllOps")}</button></div>`;

  const modal = createModal("fullHistoryModal", t("allHistory"), listHTML);
  document.body.appendChild(modal);
  openModal("fullHistoryModal");

  modal.querySelectorAll(".icon-btn.edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      closeModal("fullHistoryModal");
      setTimeout(() => openEditModal(idx), 200);
    });
  });
  modal.querySelectorAll(".icon-btn.delete").forEach((btn) => {
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
    });
  });
  document
    .getElementById("clearAllHistoryBtn")
    ?.addEventListener("click", () => {
      askConfirm(
        t("confirmDeleteAll"),
        () => {
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
// КАСТОМНЫЙ DATEPICKER
// ============================================================
function openDatePicker(initialDate, onSelect) {
  const date = initialDate ? new Date(initialDate + "T12:00:00") : new Date();
  let viewYear = date.getFullYear();
  let viewMonth = date.getMonth();

  const months = t("months");
  const weekdays = t("weekdaysShort");

  function renderCalendar() {
    const firstDay = new Date(viewYear, viewMonth, 1);
    let startDay = firstDay.getDay(); // 0 = воскресенье
    startDay = startDay === 0 ? 6 : startDay - 1; // Пн = 0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    let daysHtml = "";
    for (let i = 0; i < startDay; i++) {
      daysHtml += `<div class="datepicker-day empty"></div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const currentDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isSelected = initialDate === currentDateStr;
      daysHtml += `<div class="datepicker-day${isSelected ? " selected" : ""}" data-date="${currentDateStr}">${d}</div>`;
    }

    const weekdaysHtml = weekdays
      .map((w) => `<div class="datepicker-weekday">${w}</div>`)
      .join("");

    return `
      <div class="datepicker-header">
        <button class="datepicker-nav" id="dpPrevMonth">←</button>
        <span class="datepicker-month">${months[viewMonth]} ${viewYear}</span>
        <button class="datepicker-nav" id="dpNextMonth">→</button>
      </div>
      <div class="datepicker-weekdays">${weekdaysHtml}</div>
      <div class="datepicker-days">${daysHtml}</div>
    `;
  }

  const modalHtml = `
    <div class="datepicker-content">
      <div id="datepickerCalendar">${renderCalendar()}</div>
      <div class="datepicker-actions">
        <button class="btn-secondary" id="dpCancel">${t("cancel")}</button>
      </div>
    </div>
  `;

  const modal = createModal("datepickerModal", t("pickDate"), modalHtml);
  document.body.appendChild(modal);
  openModal("datepickerModal");

  const calendarDiv = document.getElementById("datepickerCalendar");

  function updateCalendar() {
    calendarDiv.innerHTML = renderCalendar();
    attachDayEvents();
    document.getElementById("dpPrevMonth").addEventListener("click", () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      updateCalendar();
    });
    document.getElementById("dpNextMonth").addEventListener("click", () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      updateCalendar();
    });
  }

  function attachDayEvents() {
    calendarDiv
      .querySelectorAll(".datepicker-day[data-date]")
      .forEach((day) => {
        day.addEventListener("click", () => {
          const selectedDate = day.dataset.date;
          closeModal("datepickerModal");
          onSelect(selectedDate);
        });
      });
  }

  updateCalendar();

  document.getElementById("dpCancel").addEventListener("click", () => {
    closeModal("datepickerModal");
  });
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
      <div class="field-desc">${t("amountHint")}</div>
      <input type="number" id="editAmount" class="modal-input" step="any" min="0.01"
             value="${toDisp(op.amountRub).toFixed(2)}" placeholder="0.00" inputmode="decimal">
    </div>
    <div class="field-group">
      <label class="field-label">${t("date")}</label>
      <div class="field-desc">${t("dateHint")}</div>
      <div class="date-input-wrapper" id="editDateWrapper">
        <input type="text" id="editDateDisplay" class="modal-input" readonly value="${fmtDate(op.date || today())}">
        <input type="hidden" id="editDate" value="${op.date || today()}">
        <button type="button" class="datepicker-btn" id="editDateBtn">📅</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t("note")}</label>
      <div class="field-desc">${t("noteHint")}</div>
      <textarea id="editNote" class="modal-textarea" rows="2" placeholder="${t("noteHint")}">${esc(op.note || "")}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-danger" id="deleteItemBtn">🗑 ${t("delete")}</button>
      <button class="btn-primary" id="saveEditBtn">💾 ${t("save")}</button>
    </div>`;

  const modal = createModal("editModal", t("editOperation"), html);
  document.body.appendChild(modal);
  openModal("editModal");

  const editDateDisplay = document.getElementById("editDateDisplay");
  const editDateHidden = document.getElementById("editDate");
  document.getElementById("editDateBtn").addEventListener("click", () => {
    openDatePicker(editDateHidden.value, (newDate) => {
      editDateHidden.value = newDate;
      editDateDisplay.value = fmtDate(newDate);
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
    transactions[editingOpIndex].date = editDateHidden.value;
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
// МОДАЛКА ЗАРПЛАТЫ
// ============================================================
function openSalaryModal() {
  const html = `
    <div class="section-hint">${t("salaryModalHint")}</div>
    <div class="field-group">
      <label class="field-label">${t("salary_label")} (${sym()})</label>
      <div class="field-desc">${t("amountHint")}</div>
      <input type="number" id="salaryAmount" class="modal-input" step="any" min="0"
             value="${toDisp(startBalanceRub).toFixed(2)}" inputmode="decimal" autofocus>
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
  const allExpCats = Object.keys(categories);
  const catOptionsExp =
    `<option value="">${t("selectCategory")}</option>` +
    allExpCats.map((c) => `<option value="${c}">${c}</option>`).join("");
  const catOptionsInc =
    `<option value="">${t("selectCategory")}</option>` +
    Object.keys(incomeCategories)
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");

  const html = `
    <div class="field-group">
      <label class="field-label">${t("type")}</label>
      <div class="type-toggle">
        <button class="type-btn expense active" data-type="expense">${t("expenseType")}</button>
        <button class="type-btn income"         data-type="income">${t("incomeType")}</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label" id="catLabel">${t("expCategory")}</label>
      <div class="field-desc">${t("addOpTypeDesc")}</div>
      <select id="addCategorySelect" class="modal-select">${catOptionsExp}</select>
    </div>
    <div class="field-group" id="addSubcatDiv" style="display:none">
      <label class="field-label">${t("subcategory")}</label>
      <div class="field-desc">${t("addSubHint")}</div>
      <select id="addSubcatSelect" class="modal-select"></select>
    </div>
    <div class="field-group">
      <label class="field-label">${t("amount")} (${sym()})</label>
      <div class="field-desc">${t("amountHint")}</div>
      <input type="number" id="addAmount" class="modal-input" step="any" min="0.01"
             placeholder="0.00" inputmode="decimal" autofocus>
    </div>
    <div class="field-group">
      <label class="field-label">${t("date")}</label>
      <div class="field-desc">${t("dateHint")}</div>
      <div class="date-input-wrapper" id="addDateWrapper">
        <input type="text" id="addDateDisplay" class="modal-input" readonly value="${fmtDate(today())}">
        <input type="hidden" id="addDate" value="${today()}">
        <button type="button" class="datepicker-btn" id="addDateBtn">📅</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t("note")}</label>
      <div class="field-desc">${t("noteHint")}</div>
      <textarea id="addNote" class="modal-textarea" rows="2" placeholder="${t("noteHint")}"></textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-primary" id="saveAddBtn" style="font-size:18px">✓ ${t("add")}</button>
    </div>`;

  const modal = createModal("addModal", t("newOperation"), html);
  document.body.appendChild(modal);
  openModal("addModal");

  addType = "expense";

  const addDateDisplay = document.getElementById("addDateDisplay");
  const addDateHidden = document.getElementById("addDate");
  document.getElementById("addDateBtn").addEventListener("click", () => {
    openDatePicker(addDateHidden.value, (newDate) => {
      addDateHidden.value = newDate;
      addDateDisplay.value = fmtDate(newDate);
    });
  });

  modal.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addType = btn.dataset.type;
      modal
        .querySelectorAll(".type-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const catSelect = document.getElementById("addCategorySelect");
      const catLabel = document.getElementById("catLabel");
      catLabel.textContent =
        addType === "expense" ? t("expCategory") : t("incCategory");
      catSelect.innerHTML =
        addType === "expense" ? catOptionsExp : catOptionsInc;
      document.getElementById("addSubcatDiv").style.display = "none";
    });
  });

  document.getElementById("addCategorySelect").onchange = () => {
    const subDiv = document.getElementById("addSubcatDiv");
    const subSel = document.getElementById("addSubcatSelect");
    const cat = document.getElementById("addCategorySelect").value;
    let subcats = [];
    if (addType === "expense" && categories[cat])
      subcats = categories[cat].subcats;
    else if (addType === "income" && incomeCategories[cat])
      subcats = incomeCategories[cat].subcats;
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
    const date = addDateHidden.value;
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
// СТАТИСТИКА
// ============================================================
function renderStats() {
  let inc = 0,
    exp = 0;
  const catExp = {},
    catInc = {};
  for (const tx of transactions) {
    if (tx.type === "income") {
      inc += tx.amountRub;
      catInc[tx.category] = (catInc[tx.category] || 0) + tx.amountRub;
    } else {
      exp += tx.amountRub;
      catExp[tx.category] = (catExp[tx.category] || 0) + tx.amountRub;
    }
  }
  const bal = startBalanceRub + inc - exp;
  const totalIncome = startBalanceRub + inc;
  const spentPct =
    totalIncome > 0 ? Math.min(100, Math.round((exp / totalIncome) * 100)) : 0;
  const savedAmt = totalIncome - exp;
  const nInc = transactions.filter((t) => t.type === "income").length;
  const nExp = transactions.filter((t) => t.type === "expense").length;
  const topExp = Object.entries(catExp)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topInc = Object.entries(catInc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  let healthHTML = "";
  if (transactions.length > 0) {
    if (exp <= totalIncome * 0.85)
      healthHTML = `<div class="stats-health healthy">${t("statsHealthy")}</div>`;
    else if (exp <= totalIncome)
      healthHTML = `<div class="stats-health warning">${t("statsBreakeven")}</div>`;
    else
      healthHTML = `<div class="stats-health danger">${t("statsWarning")}</div>`;
  }

  let topExpHTML = "";
  topExp.forEach(([cat, amt]) => {
    const pct = exp > 0 ? Math.round((amt / exp) * 100) : 0;
    topExpHTML += `<div class="cat-stat-row">
      <div class="cat-stat-left">
        <span class="cat-stat-emoji">${getOpEmoji({ type: "expense", category: cat })}</span>
        <div style="flex:1; min-width:0;">
          <div class="cat-stat-name">${esc(cat)}</div>
          <div class="stat-bar-wrap"><div class="stat-bar expense" style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="cat-stat-right">
        <div class="cat-stat-amount expense">−${fmt(amt)}</div>
        <div class="cat-stat-pct">${pct}%</div>
      </div>
    </div>`;
  });

  let topIncHTML = "";
  topInc.forEach(([cat, amt]) => {
    const pct = inc > 0 ? Math.round((amt / inc) * 100) : 0;
    topIncHTML += `<div class="cat-stat-row">
      <div class="cat-stat-left">
        <span class="cat-stat-emoji">${getOpEmoji({ type: "income", category: cat })}</span>
        <div style="flex:1; min-width:0;">
          <div class="cat-stat-name">${esc(cat)}</div>
          <div class="stat-bar-wrap"><div class="stat-bar income" style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="cat-stat-right">
        <div class="cat-stat-amount income">+${fmt(amt)}</div>
        <div class="cat-stat-pct">${pct}%</div>
      </div>
    </div>`;
  });

  const html =
    transactions.length === 0
      ? `<div class="empty-block tab-anim"><div class="empty-emoji">📊</div><p>${t("noStatsYet").replace("\n", "<br>")}</p></div>`
      : `<div class="stats-grid tab-anim">
      <div class="stat-card stat-balance tab-anim-child">
        <div class="stats-main-inner">
          <div class="stats-donut-wrap">
            <div class="stats-donut" style="--exp-pct:${spentPct * 3.6}deg">
              <div class="stats-donut-hole">
                <div class="stats-donut-pct">${spentPct}%</div>
                <div class="stats-donut-label">${t("statsSpentOf")}</div>
              </div>
            </div>
            <div class="stats-donut-legend">
              <span class="stats-legend-dot income-dot"></span><span>${t("income")}</span>
              <span class="stats-legend-dot expense-dot"></span><span>${t("expense")}</span>
            </div>
          </div>
          <div class="stats-main-numbers">
            <div class="stat-main-row"><span>${t("currentBalance")}</span><span class="stat-main-val ${bal >= 0 ? "balance" : "expense"}">${fmt(bal)}</span></div>
            <div class="stat-main-row"><span>${t("salary_label")}</span><span class="stat-main-val">${fmt(startBalanceRub)}</span></div>
            <div class="stat-main-row"><span>${t("statsSaved")}</span><span class="stat-main-val ${savedAmt >= 0 ? "income" : "expense"}">${savedAmt >= 0 ? "+" : ""}${fmt(savedAmt)}</span></div>
            <div class="stat-main-row"><span>${t("statsTotalOps")}</span><span class="stat-main-val">${transactions.length} ${t("statsTransCount")}</span></div>
          </div>
        </div>
        ${healthHTML}
      </div>
      <div class="stats-two-col tab-anim-child">
        <div class="stat-card stat-income"><div class="stat-card-title">${t("totalIncome")}</div><div class="stat-card-value income">+${fmt(inc)}</div><div class="stat-card-sub">${nInc} ${t("statsTransCount")}</div></div>
        <div class="stat-card stat-expense"><div class="stat-card-title">${t("totalExpense")}</div><div class="stat-card-value expense">−${fmt(exp)}</div><div class="stat-card-sub">${nExp} ${t("statsTransCount")}</div></div>
      </div>
      ${topExp.length ? `<div class="stat-card stat-top-exp tab-anim-child"><div class="stat-card-title">${t("statsExpSection")}</div>${topExpHTML}</div>` : ""}
      ${topInc.length ? `<div class="stat-card stat-top-inc tab-anim-child"><div class="stat-card-title">${t("statsIncomeSection")}</div>${topIncHTML}</div>` : ""}
    </div>`;

  document.getElementById("mainContent").innerHTML = html;
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
    const resultEl = document.getElementById("convResult");
    resultEl.style.display = "block";
    resultEl.textContent = `${amt} ${from} = ${res.toFixed(4)} ${to}`;
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
  if (calcHistory.length === 0)
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
  if (convHistory.length === 0)
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
  const html = `
    <div class="section-hint tab-anim-child">💡 ${t("notebookHint")}</div>
    <button class="btn-primary tab-anim-child" id="newNotebookBtn" style="width:100%; margin-bottom:16px; padding:16px;">✚ ${t("newPage")}</button>
    <div id="notebookList" class="notebook-grid tab-anim"></div>`;
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
  if (notebookPages.length === 0) {
    container.innerHTML = `<div class="empty-block"><div class="empty-emoji">📓</div><p>${t("noPages").replace("\n", "<br>")}</p></div>`;
    return;
  }
  [...notebookPages].reverse().forEach((p) => {
    const div = document.createElement("div");
    div.className = "note-card tab-anim-child";
    div.innerHTML = `<div class="note-title">${esc(p.title)}</div><div class="note-date">📅 ${fmtDate(p.date)}</div><div class="note-preview">${esc(p.content.substring(0, 100))}${p.content.length > 100 ? "…" : ""}</div>`;
    div.addEventListener("click", () => openNotebookModal(p.id));
    container.appendChild(div);
  });
}

function openNotebookModal(id) {
  const page = notebookPages.find((p) => p.id === id);
  if (!page) return;
  editingNoteId = id;

  const html = `
    <div class="field-group">
      <label class="field-label">${t("pageTitle")}</label>
      <input type="text" id="nbTitle" class="modal-input" value="${esc(page.title)}" placeholder="${t("pageTitle")}">
    </div>
    <div class="field-group">
      <label class="field-label">${t("date")}</label>
      <div class="date-input-wrapper" id="nbDateWrapper">
        <input type="text" id="nbDateDisplay" class="modal-input" readonly value="${fmtDate(page.date)}">
        <input type="hidden" id="nbDate" value="${page.date}">
        <button type="button" class="datepicker-btn" id="nbDateBtn">📅</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t("content")}</label>
      <textarea id="nbContent" class="modal-textarea" rows="8" placeholder="${t("notebookPlaceholder")}">${esc(page.content)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-danger"  id="deleteNbBtn">🗑 ${t("delete")}</button>
      <button class="btn-primary" id="saveNbBtn">💾 ${t("save")}</button>
    </div>`;

  const modal = createModal("notebookModal", t("editNote"), html);
  document.body.appendChild(modal);
  openModal("notebookModal");

  const nbDateDisplay = document.getElementById("nbDateDisplay");
  const nbDateHidden = document.getElementById("nbDate");
  document.getElementById("nbDateBtn").addEventListener("click", () => {
    openDatePicker(nbDateHidden.value, (newDate) => {
      nbDateHidden.value = newDate;
      nbDateDisplay.value = fmtDate(newDate);
    });
  });

  document.getElementById("saveNbBtn").addEventListener("click", () => {
    const p = notebookPages.find((p) => p.id === editingNoteId);
    if (p) {
      p.title =
        document.getElementById("nbTitle").value.trim() || t("defaultNotePage");
      p.date = nbDateHidden.value;
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
  const html = `
    <div class="field-group">
      <label class="field-label">${t("catTypeLabel")}</label>
      <div class="cat-type-toggle">
        <button class="cat-type-btn expense ${defaultType === "expense" ? "active" : ""}" data-type="expense"><div class="cat-type-icon">💸</div><div class="cat-type-title">${t("catTypeExpenseTitle")}</div><div class="cat-type-desc">${t("catTypeExpenseDesc")}</div></button>
        <button class="cat-type-btn income ${defaultType === "income" ? "active" : ""}" data-type="income"><div class="cat-type-icon">💰</div><div class="cat-type-title">${t("catTypeIncomeTitle")}</div><div class="cat-type-desc">${t("catTypeIncomeDesc")}</div></button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t("catNameLabel")}</label>
      <input type="text" id="newCatName" class="modal-input" placeholder="${t("catNamePlaceholder")}" autofocus>
    </div>
    <div class="modal-actions">
      <button class="btn-secondary" id="addCatCancel">${t("cancel")}</button>
      <button class="btn-primary" id="addCatSave">✚ ${t("save")}</button>
    </div>`;
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
  let html = `
    <div class="section-hint tab-anim-child">💡 ${t("catHint")}</div>
    <button class="cat-unified-add-btn tab-anim-child" id="addCatUnifiedBtn"><span class="cat-unified-icon">✚</span><div><div class="cat-unified-title">${t("addCatModalTitle")}</div><div class="cat-unified-sub">${t("catTypeExpenseTitle")} · ${t("catTypeIncomeTitle")}</div></div></button>
    <div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("expCatsTitle")}</div></div><div id="categoriesList"></div></div>
    <div class="cat-section"><div class="cat-section-header"><div class="cat-section-title">${t("incomeCats")}</div></div><div id="incomeList"></div></div>`;
  document.getElementById("mainContent").innerHTML = html;
  document
    .getElementById("addCatUnifiedBtn")
    .addEventListener("click", () => openAddCategoryModal("expense"));

  const container = document.getElementById("categoriesList");
  for (const [cat, data] of Object.entries(categories)) {
    const div = document.createElement("div");
    div.className = "cat-item tab-anim-child";
    div.innerHTML = `<div class="cat-item-header"><div class="cat-item-name" data-cat="${esc(cat)}">📁 ${esc(cat)}</div><button class="icon-btn delete" data-delcat="${esc(cat)}">✕</button></div><div class="chips-row" id="chips-${esc(cat).replace(/\s/g, "_")}"></div><button class="cat-add-sub-btn add-sub" data-cat="${esc(cat)}">＋ ${t("addSubcategory")}</button>`;
    container.appendChild(div);
    const chips = document.getElementById(`chips-${cat.replace(/\s/g, "_")}`);
    data.subcats.forEach((sub) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `${esc(sub)} <button class="chip-del" data-cat="${esc(cat)}" data-sub="${esc(sub)}">✕</button>`;
      chip.addEventListener("click", (e) => {
        if (e.target.classList.contains("chip-del")) return;
        openInputModal(t("editSubcatTitle"), t("newName"), sub, (newName) => {
          if (newName?.trim()) {
            const idx = categories[cat].subcats.indexOf(sub);
            if (idx !== -1) {
              categories[cat].subcats[idx] = newName.trim();
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
            categories[cat].subcats = categories[cat].subcats.filter(
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
        if (newName?.trim() && !categories[newName]) {
          categories[newName] = categories[cat];
          delete categories[cat];
          saveAll();
          renderCategories();
        }
      });
    });
    div.querySelector("[data-delcat]").addEventListener("click", () => {
      askConfirm(
        `${t("delete")}: «${cat}»?`,
        () => {
          delete categories[cat];
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
            categories[cat].subcats.push(sub.trim());
            saveAll();
            renderCategories();
          }
        },
      );
    });
  }

  const incList = document.getElementById("incomeList");
  incList.innerHTML = "";
  for (const [cat, data] of Object.entries(incomeCategories)) {
    const div = document.createElement("div");
    div.className = "cat-item tab-anim-child";
    div.innerHTML = `<div class="cat-item-header"><div class="cat-item-name" data-cat="${esc(cat)}">📁 ${esc(cat)}</div><button class="icon-btn delete" data-delcat="${esc(cat)}">✕</button></div><div class="chips-row" id="chips-inc-${esc(cat).replace(/\s/g, "_")}"></div><button class="cat-add-sub-btn add-sub" data-cat="${esc(cat)}">＋ ${t("addSubcategory")}</button>`;
    incList.appendChild(div);
    const chips = document.getElementById(
      `chips-inc-${cat.replace(/\s/g, "_")}`,
    );
    data.subcats.forEach((sub) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `${esc(sub)} <button class="chip-del" data-cat="${esc(cat)}" data-sub="${esc(sub)}">✕</button>`;
      chip.addEventListener("click", (e) => {
        if (e.target.classList.contains("chip-del")) return;
        openInputModal(t("editSubcatTitle"), t("newName"), sub, (newName) => {
          if (newName?.trim()) {
            const idx = incomeCategories[cat].subcats.indexOf(sub);
            if (idx !== -1) {
              incomeCategories[cat].subcats[idx] = newName.trim();
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
            incomeCategories[cat].subcats = incomeCategories[
              cat
            ].subcats.filter((s) => s !== sub);
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
        if (newName?.trim() && !incomeCategories[newName]) {
          incomeCategories[newName] = incomeCategories[cat];
          delete incomeCategories[cat];
          saveAll();
          renderCategories();
        }
      });
    });
    div.querySelector("[data-delcat]").addEventListener("click", () => {
      askConfirm(
        `${t("delete")}: «${cat}»?`,
        () => {
          delete incomeCategories[cat];
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
            incomeCategories[cat].subcats.push(sub.trim());
            saveAll();
            renderCategories();
          }
        },
      );
    });
  }
}

// ============================================================
// НАСТРОЙКИ
// ============================================================
function renderSettings() {
  const html = `
    <div class="settings-card"><div class="settings-card-title">${t("currency")}</div><div class="settings-card-desc">${t("explanationCurrency")}</div><div class="settings-card-body"><select id="currencySelect" class="settings-select"><option value="RUB">🇷🇺 ${t("currRUB")}</option><option value="USD">🇺🇸 ${t("currUSD")}</option><option value="EUR">🇪🇺 ${t("currEUR")}</option><option value="GEL">🇬🇪 ${t("currGEL")}</option><option value="GBP">🇬🇧 ${t("currGBP")}</option><option value="KZT">🇰🇿 ${t("currKZT")}</option></select></div></div>
    <div class="settings-card"><div class="settings-card-title">${t("theme")}</div><div class="settings-card-desc">${t("explanationTheme")}</div><div class="settings-card-body"><select id="themeSelect" class="settings-select"><option value="light">${t("light")}</option><option value="dark">${t("dark")}</option></select></div></div>
    <div class="settings-card"><div class="settings-card-title">${t("language")}</div><div class="settings-card-desc">${t("explanationLanguage")}</div><div class="settings-card-body"><select id="langSelect" class="settings-select"><option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option><option value="ka">🇬🇪 ქართული</option></select></div></div>
    <div class="settings-card"><div class="settings-card-title">${t("data")}</div><div class="settings-card-desc">${t("explanationRates")}</div><div class="settings-card-body"><button class="settings-btn primary" id="refreshRatesBtn">${t("updateRates")}</button><button class="settings-btn danger" id="clearAllBtn">${t("resetAll")}</button></div></div>
    <div class="settings-card" style="border-color:var(--gold-border);"><div class="settings-card-title">🌟 Pro <span class="pro-badge">SOON</span></div><div class="settings-card-desc">${t("explanationPro")}</div><div class="settings-card-body"><button class="settings-btn pro" id="proVersionBtn">${t("proVersion")}</button></div></div>
    <div style="text-align:center;padding:20px;color:var(--text-muted);">${t("appFooter").replace("\n", "<br>")}</div>`;
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
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================
function openInputModal(title, label, defaultVal, onSave) {
  const html = `<div class="field-group"><label class="field-label">${esc(label)}</label><input type="text" id="inputModalVal" class="modal-input" value="${esc(defaultVal)}" placeholder="${esc(label)}" autofocus></div><div class="modal-actions"><button class="btn-secondary" id="inputModalCancel">${t("cancel")}</button><button class="btn-primary" id="inputModalSave">${t("save")}</button></div>`;
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
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
loadAll();
applyTranslations();
updateTopBlocks();
updateHeader();
document.documentElement.lang = currentLang;

const savedTheme = localStorage.getItem("theme") || "light";
document.body.className = savedTheme;
document.getElementById("themeToggle").textContent =
  savedTheme === "dark" ? "☀️" : "🌙";

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
    if (currentTab !== "home") setTab("home");
    currentListType = type;
    renderOpsList();
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
