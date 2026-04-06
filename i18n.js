// i18n.js — полная интернационализация (русский, английский, грузинский)
const translations = {
  ru: {
    app_title_short: "Бюджет PRO",
    app_subtitle: "Твой капитал — твои правила",
    salary: "Зарплата",
    income: "Доходы",
    expense: "Расходы",
    balance: "Баланс",
    show_in: "Показать в:",
    refresh_rates: "Обновить курс",
    edit_salary: "Зарплата",
    quick_action: "Быстрое действие",
    new_operation: "Новая операция",
    quick_action_hint: "Нажмите, чтобы добавить доход или расход",
    home_hint:
      "Последние 5 операций. Нажмите + снизу, чтобы добавить доход/расход. Зарплата — установите начальный баланс.",
    last_operations_title: "Последние операции",
    clear_all: "Очистить все",
    show_all_ops: "Показать все операции →",
    operations_hint:
      "Поиск по дате (с / по), категории, типу. Кликните по операции для редактирования.",
    search_placeholder: "Категория, заметка...",
    from: "с",
    to: "по",
    all_types: "Все",
    income_type: "Доходы",
    expense_type: "Расходы",
    find: "Найти",
    reset: "Сброс",
    categories_hint:
      "Клик по названию категории — переименовать. Клик по подкатегории — изменить. Кнопки '+' для добавления подкатегорий.",
    add_category: "+ Добавить категорию",
    tools_hint:
      "Калькулятор и конвертер валют. История конвертации — полный просмотр и удаление.",
    calculator: "Калькулятор",
    converter: "Конвертер валют",
    history: "История",
    convert: "Перевести",
    notebook_hint:
      "Личный блокнот: создавайте страницы, редактируйте, удаляйте. Нажмите на карточку для редактирования.",
    new_page: "Новая страница",
    stats_hint:
      "Анализ доходов и расходов. Выберите период: день, неделя или месяц.",
    day_period: "День",
    week_period: "Неделя",
    month_period: "Месяц",
    reset_stats: "Сбросить статистику",
    expenses_legend: "Расходы",
    income_legend: "Доходы",
    nav_home: "Главная",
    nav_operations: "Операции",
    nav_categories: "Категории",
    nav_tools: "Инструменты",
    nav_notebook: "Блокнот",
    nav_stats: "Данные",
    fab_add: "＋",
    help_title: "Помощь и инструкция",
    add_operation: "Новая операция",
    type: "Тип",
    category: "Категория",
    add: "Добавить",
    delete: "Удалить",
    subcategory: "Подкатегория",
    amount: "Сумма",
    date: "Дата",
    note: "Заметка",
    edit_operation: "Редактировать операцию",
    save: "Сохранить",
    enter_subcategory_name: "Название",
    page: "Страница",
    enter_salary: "Введите зарплату",
    updated: "Обновлено",
    update_error: "Ошибка обновления курсов",
    confirm_delete: "Удалить операцию?",
    select_category: "Выберите категорию",
    enter_amount: "Введите сумму",
    not_specified: "не указано",
    both: "оба",
    add_subcat_income: "+ Доход",
    add_subcat_expense: "+ Расход",
    confirm_delete_category: "Удалить категорию '%s'?",
    confirm_delete_subcategory: "Удалить подкатегорию '%s'?",
    enter_new_category_name: "Введите новое название категории",
    category_exists: "Категория уже существует",
    subcategory_name_empty: "Название подкатегории не может быть пустым",
    subcategory_exists: "Подкатегория уже существует",
    no_history: "История пуста",
    error: "Ошибка",
    example: "Пример",
    example_content: "Здесь вы можете писать заметки...",
    no_pages: "Нет страниц",
    title_empty: "Введите название",
    page_exists: "Страница с названием '%s' уже существует",
    confirm_delete_page: "Удалить страницу?",
    today: "Сегодня",
    last_7_days: "Последние 7 дней",
    last_30_days: "Последние 30 дней",
    since: "с",
    since_beginning: "с начала",
    confirm_reset_stats:
      "Сбросить статистику? Все данные за период до сегодняшнего дня будут исключены.",
    stats_reset_message: "Статистика сброшена",
    confirm_clear_all: "Очистить все операции?",
    confirm_clear_conv_history: "Очистить всю историю конвертации?",
    confirm_clear_calc_history: "Очистить историю калькулятора?",
    fill_fields: "Заполните все поля",
    no_operations: "Нет операций",
    no_operations_criteria: "Нет операций по заданным критериям",
    enter_category_name: "Введите название категории",
    clear_all_history: "Очистить всё",
    // Помощь
    help_intro:
      "Добро пожаловать в Бюджет PRO! Это приложение поможет вам вести учёт доходов и расходов, управлять бюджетом, отслеживать статистику и многое другое.",
    help_features: "Основные возможности:",
    help_balance:
      "💰 Баланс: показывает вашу зарплату (начальный баланс), общие доходы, расходы и остаток. Вы можете сменить валюту отображения и обновить курсы валют.",
    help_operations:
      "📋 Операции: добавление, редактирование, удаление операций. Поиск по дате, категории, типу. Каждая операция может иметь подкатегорию и заметку.",
    help_categories:
      "🗂️ Категории: создавайте, переименовывайте, удаляйте категории и подкатегории. Клик по названию категории — переименовать, клик по подкатегории — изменить.",
    help_tools:
      "🧮 Инструменты: встроенный калькулятор с историей, конвертер валют с историей конвертаций.",
    help_notebook:
      "📓 Блокнот: создавайте текстовые страницы для заметок, редактируйте, удаляйте. Нажмите на карточку для редактирования.",
    help_stats:
      "📊 Статистика: анализ доходов и расходов за выбранный период (день, неделя, месяц). Круговая диаграмма показывает соотношение. Кнопка сброса статистики начинает отсчёт с текущей даты.",
    // Кастомный датапикер
    dp_months: [
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
    dp_days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
  en: {
    app_title_short: "Budget PRO",
    app_subtitle: "Your capital — your rules",
    salary: "Salary",
    income: "Income",
    expense: "Expenses",
    balance: "Balance",
    show_in: "Show in:",
    refresh_rates: "Refresh rates",
    edit_salary: "Salary",
    quick_action: "Quick action",
    new_operation: "New operation",
    quick_action_hint: "Click to add income or expense",
    home_hint:
      "Last 5 operations. Press + to add income/expense. Salary — set initial balance.",
    last_operations_title: "Last operations",
    clear_all: "Clear all",
    show_all_ops: "Show all operations →",
    operations_hint:
      "Search by date (from/to), category, type. Click on operation to edit.",
    search_placeholder: "Category, note...",
    from: "from",
    to: "to",
    all_types: "All",
    income_type: "Income",
    expense_type: "Expenses",
    find: "Find",
    reset: "Reset",
    categories_hint:
      "Click category name to rename. Click subcategory to edit. '+' buttons to add subcategories.",
    add_category: "+ Add category",
    tools_hint:
      "Calculator and currency converter. Conversion history — full view and delete.",
    calculator: "Calculator",
    converter: "Currency converter",
    history: "History",
    convert: "Convert",
    notebook_hint:
      "Personal notebook: create pages, edit, delete. Click on card to edit.",
    new_page: "New page",
    stats_hint:
      "Income and expense analysis. Select period: day, week or month.",
    day_period: "Day",
    week_period: "Week",
    month_period: "Month",
    reset_stats: "Reset stats",
    expenses_legend: "Expenses",
    income_legend: "Income",
    nav_home: "Home",
    nav_operations: "Operations",
    nav_categories: "Categories",
    nav_tools: "Tools",
    nav_notebook: "Notebook",
    nav_stats: "Data",
    fab_add: "＋",
    help_title: "Help & Instructions",
    add_operation: "New operation",
    type: "Type",
    category: "Category",
    add: "Add",
    delete: "Delete",
    subcategory: "Subcategory",
    amount: "Amount",
    date: "Date",
    note: "Note",
    edit_operation: "Edit operation",
    save: "Save",
    enter_subcategory_name: "Name",
    page: "Page",
    enter_salary: "Enter salary",
    updated: "Updated",
    update_error: "Rate update error",
    confirm_delete: "Delete operation?",
    select_category: "Select category",
    enter_amount: "Enter amount",
    not_specified: "not specified",
    both: "both",
    add_subcat_income: "+ Income",
    add_subcat_expense: "+ Expense",
    confirm_delete_category: "Delete category '%s'?",
    confirm_delete_subcategory: "Delete subcategory '%s'?",
    enter_new_category_name: "Enter new category name",
    category_exists: "Category already exists",
    subcategory_name_empty: "Subcategory name cannot be empty",
    subcategory_exists: "Subcategory already exists",
    no_history: "No history",
    error: "Error",
    example: "Example",
    example_content: "Here you can write notes...",
    no_pages: "No pages",
    title_empty: "Enter title",
    page_exists: "Page with title '%s' already exists",
    confirm_delete_page: "Delete page?",
    today: "Today",
    last_7_days: "Last 7 days",
    last_30_days: "Last 30 days",
    since: "since",
    since_beginning: "since beginning",
    confirm_reset_stats:
      "Reset statistics? All data before today will be excluded.",
    stats_reset_message: "Statistics reset",
    confirm_clear_all: "Clear all operations?",
    confirm_clear_conv_history: "Clear all conversion history?",
    confirm_clear_calc_history: "Clear calculator history?",
    fill_fields: "Fill all fields",
    no_operations: "No operations",
    no_operations_criteria: "No operations matching criteria",
    enter_category_name: "Enter category name",
    clear_all_history: "Clear all",
    // Help
    help_intro:
      "Welcome to Budget PRO! This app helps you track income and expenses, manage your budget, view statistics and more.",
    help_features: "Main features:",
    help_balance:
      "💰 Balance: shows your salary (initial balance), total income, expenses and remaining balance. You can change the display currency and update exchange rates.",
    help_operations:
      "📋 Operations: add, edit, delete operations. Search by date, category, type. Each operation can have a subcategory and a note.",
    help_categories:
      "🗂️ Categories: create, rename, delete categories and subcategories. Click category name to rename, click subcategory to edit.",
    help_tools:
      "🧮 Tools: built-in calculator with history, currency converter with conversion history.",
    help_notebook:
      "📓 Notebook: create text pages for notes, edit, delete. Click on card to edit.",
    help_stats:
      "📊 Statistics: analysis of income and expenses for the selected period (day, week, month). Pie chart shows the ratio. Reset statistics button starts counting from the current date.",
    // Custom datepicker
    dp_months: [
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
    dp_days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  },
  ka: {
    app_title_short: "ბიუჯეტი PRO",
    app_subtitle: "შენი კაპიტალი — შენი წესები",
    salary: "ხელფასი",
    income: "შემოსავალი",
    expense: "ხარჯი",
    balance: "ბალანსი",
    show_in: "ჩვენება:",
    refresh_rates: "კურსის განახლება",
    edit_salary: "ხელფასი",
    quick_action: "სწრაფი მოქმედება",
    new_operation: "ახალი ოპერაცია",
    quick_action_hint: "დააჭირეთ შემოსავლის ან ხარჯის დასამატებლად",
    home_hint:
      "ბოლო 5 ოპერაცია. დააჭირეთ + ქვემოთ შემოსავლის/ხარჯის დასამატებლად. ხელფასი — საწყისი ბალანსის დასაყენებლად.",
    last_operations_title: "ბოლო ოპერაციები",
    clear_all: "ყველას გასუფთავება",
    show_all_ops: "ყველა ოპერაციის ჩვენება →",
    operations_hint:
      "ძიება თარიღით (დან/მდე), კატეგორიით, ტიპით. დააჭირეთ ოპერაციას რედაქტირებისთვის.",
    search_placeholder: "კატეგორია, შენიშვნა...",
    from: "დან",
    to: "მდე",
    all_types: "ყველა",
    income_type: "შემოსავალი",
    expense_type: "ხარჯი",
    find: "ძებნა",
    reset: "გადატვირთვა",
    categories_hint:
      "დააჭირეთ კატეგორიის სახელს გადარქმევისთვის. დააჭირეთ ქვეკატეგორიას რედაქტირებისთვის. '+' ღილაკები ქვეკატეგორიების დასამატებლად.",
    add_category: "+ კატეგორიის დამატება",
    tools_hint:
      "კალკულატორი და ვალუტის კონვერტორი. კონვერტაციის ისტორია — სრული ხედვა და წაშლა.",
    calculator: "კალკულატორი",
    converter: "ვალუტის კონვერტორი",
    history: "ისტორია",
    convert: "კონვერტაცია",
    notebook_hint:
      "პირადი ბლოკნოტი: შექმენით გვერდები, რედაქტირება, წაშლა. დააჭირეთ ბარათს რედაქტირებისთვის.",
    new_page: "ახალი გვერდი",
    stats_hint:
      "შემოსავლებისა და ხარჯების ანალიზი. აირჩიეთ პერიოდი: დღე, კვირა ან თვე.",
    day_period: "დღე",
    week_period: "კვირა",
    month_period: "თვე",
    reset_stats: "სტატისტიკის გადატვირთვა",
    expenses_legend: "ხარჯები",
    income_legend: "შემოსავალი",
    nav_home: "მთავარი",
    nav_operations: "ოპერაციები",
    nav_categories: "კატეგორიები",
    nav_tools: "ინსტრუმენტები",
    nav_notebook: "ბლოკნოტი",
    nav_stats: "მონაცემები",
    fab_add: "＋",
    help_title: "დახმარება და ინსტრუქცია",
    add_operation: "ახალი ოპერაცია",
    type: "ტიპი",
    category: "კატეგორია",
    add: "დამატება",
    delete: "წაშლა",
    subcategory: "ქვეკატეგორია",
    amount: "თანხა",
    date: "თარიღი",
    note: "შენიშვნა",
    edit_operation: "ოპერაციის რედაქტირება",
    save: "შენახვა",
    enter_subcategory_name: "სახელი",
    page: "გვერდი",
    enter_salary: "შეიყვანეთ ხელფასი",
    updated: "განახლდა",
    update_error: "კურსის განახლების შეცდომა",
    confirm_delete: "წავშალოთ ოპერაცია?",
    select_category: "აირჩიეთ კატეგორია",
    enter_amount: "შეიყვანეთ თანხა",
    not_specified: "არ არის მითითებული",
    both: "ორივე",
    add_subcat_income: "+ შემოსავალი",
    add_subcat_expense: "+ ხარჯი",
    confirm_delete_category: "წავშალოთ კატეგორია '%s'?",
    confirm_delete_subcategory: "წავშალოთ ქვეკატეგორია '%s'?",
    enter_new_category_name: "შეიყვანეთ ახალი კატეგორიის სახელი",
    category_exists: "კატეგორია უკვე არსებობს",
    subcategory_name_empty: "ქვეკატეგორიის სახელი არ შეიძლება იყოს ცარიელი",
    subcategory_exists: "ქვეკატეგორია უკვე არსებობს",
    no_history: "ისტორია ცარიელია",
    error: "შეცდომა",
    example: "მაგალითი",
    example_content: "აქ შეგიძლიათ დაწეროთ შენიშვნები...",
    no_pages: "გვერდები არ არის",
    title_empty: "შეიყვანეთ სათაური",
    page_exists: "გვერდი სახელით '%s' უკვე არსებობს",
    confirm_delete_page: "წავშალოთ გვერდი?",
    today: "დღეს",
    last_7_days: "ბოლო 7 დღე",
    last_30_days: "ბოლო 30 დღე",
    since: "დან",
    since_beginning: "თავიდან",
    confirm_reset_stats:
      "გადავტვირთოთ სტატისტიკა? ყველა მონაცემი დღევანდელი დღის წინ გამოირიცხება.",
    stats_reset_message: "სტატისტიკა გადატვირთულია",
    confirm_clear_all: "წავშალოთ ყველა ოპერაცია?",
    confirm_clear_conv_history: "წავშალოთ კონვერტაციის მთელი ისტორია?",
    confirm_clear_calc_history: "წავშალოთ კალკულატორის ისტორია?",
    fill_fields: "შეავსეთ ყველა ველი",
    no_operations: "ოპერაციები არ არის",
    no_operations_criteria: "ოპერაციები არ მოიძებნა",
    enter_category_name: "შეიყვანეთ კატეგორიის სახელი",
    clear_all_history: "ყველას გასუფთავება",
    // Help
    help_intro:
      "მოგესალმებით ბიუჯეტი PRO-ში! ეს აპლიკაცია დაგეხმარებათ შემოსავლებისა და ხარჯების აღრიცხვაში, ბიუჯეტის მართვაში, სტატისტიკის თვალყურის დევნებაში და სხვა.",
    help_features: "ძირითადი შესაძლებლობები:",
    help_balance:
      "💰 ბალანსი: აჩვენებს თქვენს ხელფასს (საწყისი ბალანსი), მთლიან შემოსავალს, ხარჯებს და ნაშთს. შეგიძლიათ შეცვალოთ ჩვენების ვალუტა და განაახლოთ გაცვლითი კურსები.",
    help_operations:
      "📋 ოპერაციები: ოპერაციების დამატება, რედაქტირება, წაშლა. ძებნა თარიღით, კატეგორიით, ტიპით. თითოეულ ოპერაციას შეიძლება ჰქონდეს ქვეკატეგორია და შენიშვნა.",
    help_categories:
      "🗂️ კატეგორიები: შექმენით, გადაარქვით სახელი, წაშალეთ კატეგორიები და ქვეკატეგორიები. დააჭირეთ კატეგორიის სახელს გადარქმევისთვის, დააჭირეთ ქვეკატეგორიას რედაქტირებისთვის.",
    help_tools:
      "🧮 ინსტრუმენტები: ჩაშენებული კალკულატორი ისტორიით, ვალუტის კონვერტორი კონვერტაციის ისტორიით.",
    help_notebook:
      "📓 ბლოკნოტი: შექმენით ტექსტური გვერდები შენიშვნებისთვის, რედაქტირება, წაშლა. დააჭირეთ ბარათს რედაქტირებისთვის.",
    help_stats:
      "📊 სტატისტიკა: შემოსავლებისა და ხარჯების ანალიზი შერჩეული პერიოდისთვის (დღე, კვირა, თვე). წრიული დიაგრამა აჩვენებს თანაფარდობას. სტატისტიკის გადატვირთვის ღილაკი იწყებს ათვლას მიმდინარე თარიღიდან.",
    // კასტომური თარიღის პიკერი
    dp_months: [
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
    dp_days: ["ორშ", "სამშ", "ოთხშ", "ხუთშ", "პარ", "შაბ", "კვი"],
  },
};

let currentLang = localStorage.getItem("app_lang") || "ru";

function t(key) {
  return translations[currentLang]?.[key] || translations["ru"]?.[key] || key;
}

// ===================== КАСТОМНЫЙ ДАТАПИКЕР =====================
// Заменяет все <input type="date"> на кастомный пикер, реагирующий на язык

(function () {
  // Стили для кастомного пикера
  const style = document.createElement("style");
  style.textContent = `
    .dp-wrapper {
      position: relative;
      display: block;
      width: 100%;
    }
    .dp-input {
      width: 100%;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 12px 14px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 0.95rem;
      cursor: pointer;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .dp-input:hover {
      border-color: var(--border-hover);
    }
    .dp-input .dp-icon {
      opacity: 0.5;
      font-size: 1rem;
    }
    .dp-popup {
      position: fixed;
      z-index: 9999;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.25);
      padding: 16px;
      min-width: 280px;
      max-width: 320px;
      display: none;
      user-select: none;
    }
    .dp-popup.open {
      display: block;
      animation: dpFadeIn 0.15s ease;
    }
    @keyframes dpFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .dp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .dp-nav {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text-primary);
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s;
    }
    .dp-nav:hover { background: var(--border); }
    .dp-month-year {
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      color: var(--text-primary);
      flex: 1;
      text-align: center;
    }
    .dp-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 3px;
    }
    .dp-day-name {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-muted);
      text-align: center;
      padding: 4px 0;
    }
    .dp-cell {
      text-align: center;
      padding: 6px 2px;
      border-radius: 10px;
      font-size: 0.82rem;
      cursor: pointer;
      color: var(--text-primary);
      transition: background 0.12s, color 0.12s;
    }
    .dp-cell:hover:not(.dp-empty):not(.dp-selected) {
      background: var(--border);
    }
    .dp-cell.dp-other-month {
      color: var(--text-muted);
    }
    .dp-cell.dp-today {
      font-weight: 800;
      color: var(--accent);
    }
    .dp-cell.dp-selected {
      background: var(--accent);
      color: #fff;
      font-weight: 800;
    }
    .dp-cell.dp-empty { cursor: default; }
    .dp-footer {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .dp-btn-today, .dp-btn-clear {
      flex: 1;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 7px 0;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      color: var(--text-primary);
      transition: background 0.15s;
    }
    .dp-btn-today:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
    .dp-btn-clear:hover  { background: var(--red-bg); color: var(--red-text); border-color: var(--red); }
    /* Фильтровые инпуты даты в строке поиска */
    .filter-input.dp-active-input {
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Глобальный попап (один на всех)
  const popup = document.createElement("div");
  popup.className = "dp-popup";
  popup.id = "globalDatePicker";
  document.body.appendChild(popup);

  let activeInput = null; // скрытый <input type="date"> или псевдо-объект
  let activeDisplay = null; // кнопка-отображение
  let viewYear = null,
    viewMonth = null;

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function parseDate(str) {
    if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    const [y, m, d] = str.split("-").map(Number);
    return { y, m, d };
  }

  function formatDisplay(str) {
    const p = parseDate(str);
    if (!p) return "";
    const months =
      translations[currentLang]?.dp_months || translations.ru.dp_months;
    return `${p.d} ${months[p.m - 1]} ${p.y}`;
  }

  function getValue() {
    return activeInput ? activeInput.value : "";
  }

  function setValue(str) {
    if (!activeInput) return;
    activeInput.value = str;
    // Диспатчим change для прослушивателей
    activeInput.dispatchEvent(new Event("change", { bubbles: true }));
    activeInput.dispatchEvent(new Event("input", { bubbles: true }));
    // Обновляем отображение
    if (activeDisplay) {
      const span = activeDisplay.querySelector(".dp-text");
      if (span)
        span.textContent = str
          ? formatDisplay(str)
          : activeDisplay.dataset.placeholder || "";
    }
  }

  function renderPopup() {
    if (!viewYear || viewMonth == null) {
      const todayParsed = parseDate(todayStr());
      viewYear = todayParsed.y;
      viewMonth = todayParsed.m - 1; // 0-based
    }
    const months =
      translations[currentLang]?.dp_months || translations.ru.dp_months;
    const days = translations[currentLang]?.dp_days || translations.ru.dp_days;
    const today = parseDate(todayStr());
    const selStr = getValue();
    const sel = parseDate(selStr);

    // Первый день месяца (0=Вс..6=Сб), конвертируем в Пн=0
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7; // Пн = 0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    let cells = "";
    // Заголовок дней
    for (const d of days) {
      cells += `<div class="dp-day-name">${d}</div>`;
    }
    // Пустые ячейки до начала
    for (let i = 0; i < startOffset; i++) {
      cells += `<div class="dp-cell dp-empty"></div>`;
    }
    // Дни месяца
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        today &&
        today.y === viewYear &&
        today.m === viewMonth + 1 &&
        today.d === d;
      const isSel =
        sel && sel.y === viewYear && sel.m === viewMonth + 1 && sel.d === d;
      const cls = [
        "dp-cell",
        isToday ? "dp-today" : "",
        isSel ? "dp-selected" : "",
      ]
        .filter(Boolean)
        .join(" ");
      cells += `<div class="${cls}" data-day="${d}">${d}</div>`;
    }

    popup.innerHTML = `
      <div class="dp-header">
        <button class="dp-nav" id="dpPrevMonth">&#8249;</button>
        <div class="dp-month-year">${months[viewMonth]} ${viewYear}</div>
        <button class="dp-nav" id="dpNextMonth">&#8250;</button>
      </div>
      <div class="dp-grid">${cells}</div>
      <div class="dp-footer">
        <button class="dp-btn-today" id="dpTodayBtn">${today ? `${today.d} ${months[today.m - 1]}` : "Сегодня"}</button>
        <button class="dp-btn-clear" id="dpClearBtn">✕</button>
      </div>
    `;

    popup.querySelector("#dpPrevMonth").onclick = (e) => {
      e.stopPropagation();
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderPopup();
    };
    popup.querySelector("#dpNextMonth").onclick = (e) => {
      e.stopPropagation();
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderPopup();
    };
    popup.querySelector("#dpTodayBtn").onclick = (e) => {
      e.stopPropagation();
      setValue(todayStr());
      closePopup();
    };
    popup.querySelector("#dpClearBtn").onclick = (e) => {
      e.stopPropagation();
      setValue("");
      closePopup();
    };
    popup.querySelectorAll(".dp-cell[data-day]").forEach((cell) => {
      cell.onclick = (e) => {
        e.stopPropagation();
        const d = parseInt(cell.dataset.day);
        const mm = String(viewMonth + 1).padStart(2, "0");
        const dd = String(d).padStart(2, "0");
        setValue(`${viewYear}-${mm}-${dd}`);
        closePopup();
      };
    });
  }

  function openPopup(inputEl, displayEl) {
    activeInput = inputEl;
    activeDisplay = displayEl;

    const val = getValue();
    const parsed = parseDate(val);
    if (parsed) {
      viewYear = parsed.y;
      viewMonth = parsed.m - 1;
    } else {
      const t2 = parseDate(todayStr());
      viewYear = t2.y;
      viewMonth = t2.m - 1;
    }

    renderPopup();
    popup.classList.add("open");
    positionPopup(displayEl || inputEl);
  }

  function positionPopup(anchor) {
    const rect = anchor.getBoundingClientRect();
    const pw = 300,
      ph = 320;
    let top = rect.bottom + 6;
    let left = rect.left;

    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (left < 8) left = 8;
    if (top + ph > window.innerHeight - 8) top = rect.top - ph - 6;

    popup.style.top = top + "px";
    popup.style.left = left + "px";
    popup.style.width = Math.min(pw, window.innerWidth - 16) + "px";
  }

  function closePopup() {
    popup.classList.remove("open");
    activeInput = null;
    activeDisplay = null;
  }

  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !e.target.closest(".dp-input")) {
      closePopup();
    }
  });

  // ====== Инициализация: заменяем все <input type="date"> ======
  function initDatePicker(input) {
    if (input._dpInitialized) return;
    input._dpInitialized = true;

    // Скрываем нативный инпут
    input.style.display = "none";

    const wrapper = document.createElement("div");
    wrapper.className = "dp-wrapper";
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dp-input";
    // Определяем класс инпута для стилей
    if (input.classList.contains("modal-input"))
      btn.classList.add("modal-input");
    if (input.classList.contains("filter-input"))
      btn.classList.add("filter-input", "dp-active-input");

    const placeholder = input.placeholder || "";
    btn.dataset.placeholder = placeholder;
    btn.innerHTML = `<span class="dp-text">${input.value ? formatDisplay(input.value) : placeholder}</span><span class="dp-icon">📅</span>`;

    wrapper.appendChild(btn);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (popup.classList.contains("open") && activeInput === input) {
        closePopup();
      } else {
        openPopup(input, btn);
      }
    });

    // Обновляем отображение при программном изменении value
    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    );
    // Вместо переопределения — слушаем change/input
    input.addEventListener("_dpUpdate", () => {
      const span = btn.querySelector(".dp-text");
      if (span)
        span.textContent = input.value
          ? formatDisplay(input.value)
          : placeholder;
    });
  }

  // Патчим setValue, чтобы тоже диспатчил _dpUpdate
  const origSetValue = (window._dpSetValue = function (inputEl, str) {
    inputEl.value = str;
    inputEl.dispatchEvent(new Event("change", { bubbles: true }));
    inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    inputEl.dispatchEvent(new Event("_dpUpdate"));
  });

  // Инициализируем после загрузки DOM
  function initAll() {
    document.querySelectorAll('input[type="date"]').forEach(initDatePicker);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Экспортируем для вызова при смене языка (перерисовка открытого попапа)
  window._dpRefreshLang = function () {
    // Обновляем все отображения
    document.querySelectorAll('input[type="date"]').forEach((input) => {
      if (input._dpInitialized) {
        input.dispatchEvent(new Event("_dpUpdate"));
      }
    });
    // Если попап открыт — перерисовываем
    if (popup.classList.contains("open")) {
      renderPopup();
    }
  };
})();
// ===================== КОНЕЦ ДАТАПИКЕРА =====================

function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem("app_lang", lang);

    // Обновляем lang-атрибут документа
    const langMap = { ru: "ru", en: "en", ka: "ka" };
    document.documentElement.setAttribute("lang", langMap[lang] || "ru");

    // Обновляем активную кнопку языка
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    // Обновляем все data-i18n элементы
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.placeholder = t(key);
    });

    document.querySelectorAll("[data-i18n-opt]").forEach((opt) => {
      const key = opt.getAttribute("data-i18n-opt");
      if (key) opt.textContent = t(key);
    });

    // Обновляем датапикеры
    if (window._dpRefreshLang) window._dpRefreshLang();

    if (window.refreshAll) window.refreshAll();
    if (window.updateStats) window.updateStats(true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
});

window.t = t;
window.setLanguage = setLanguage;
