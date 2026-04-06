// i18n.js
let currentLang = localStorage.getItem("app_lang") || "ru";

// Глобальная функция перевода
function t(key, fallback) {
  if (typeof locales === "undefined") return fallback || key;
  return locales[currentLang] && locales[currentLang][key] !== undefined
    ? locales[currentLang][key]
    : fallback || key;
}
window.t = t;

// Контент модалки помощи по языкам
const helpContent = {
  ru: `
    <h3>🏠 Главный экран</h3>
    <p><strong>Карточки баланса:</strong> показывают зарплату, сумму доходов, расходов и остаток. Все суммы пересчитываются в выбранной валюте.</p>
    <p><strong>➕ Новая операция:</strong> нажмите <code>＋</code> внизу или «➕ Новая операция». Выберите тип, категорию, подкатегорию, введите сумму, дату и заметку.</p>
    <p><strong>Последние 5 операций:</strong> кликните по операции для редактирования. Крестик <code>✕</code> удаляет операцию.</p>
    <p><strong>🧹 Очистить все:</strong> удаляет все операции (появится подтверждение).</p>
    <p><strong>✏️ Зарплата:</strong> установите начальный баланс в текущей валюте.</p>
    <h3>📋 Операции</h3>
    <p>Поиск по тексту, датам и типу. Клик по карточке — редактирование.</p>
    <h3>🗂️ Категории</h3>
    <p>Клик по названию — переименовать. Кнопки <code>+</code> добавляют подкатегории. Клик по подкатегории — редактировать.</p>
    <h3>🧮 Инструменты</h3>
    <p><strong>Калькулятор:</strong> базовые операции с историей вычислений.</p>
    <p><strong>Конвертер:</strong> выберите валюты и сумму. Курсы обновляются кнопкой «🔄 Обновить курс».</p>
    <h3>📓 Блокнот</h3>
    <p>Создавайте, редактируйте и удаляйте текстовые страницы.</p>
    <h3>📊 Статистика</h3>
    <p>Круговая диаграмма за день, неделю или месяц. «Сбросить статистику» — обнуляет накопленные данные.</p>
    <p style="margin-top:20px;font-style:italic;text-align:center;">✨ Приятного использования! ✨</p>
  `,
  en: `
    <h3>🏠 Home Screen</h3>
    <p><strong>Balance cards:</strong> show salary, total income, expenses and balance. All amounts are recalculated in the selected currency.</p>
    <p><strong>➕ New transaction:</strong> press <code>＋</code> at the bottom or «➕ New transaction». Select type, category, subcategory, enter amount, date and note.</p>
    <p><strong>Last 5 transactions:</strong> click a transaction to edit. The <code>✕</code> button deletes it.</p>
    <p><strong>🧹 Clear all:</strong> deletes all transactions (confirmation required).</p>
    <p><strong>✏️ Salary:</strong> set the initial balance in the current currency.</p>
    <h3>📋 Transactions</h3>
    <p>Search by text, dates and type. Click a card to edit.</p>
    <h3>🗂️ Categories</h3>
    <p>Click a name to rename. <code>+</code> buttons add subcategories. Click a subcategory to edit.</p>
    <h3>🧮 Tools</h3>
    <p><strong>Calculator:</strong> basic operations with calculation history.</p>
    <p><strong>Converter:</strong> select currencies and amount. Rates update via «🔄 Update rates».</p>
    <h3>📓 Notebook</h3>
    <p>Create, edit and delete text pages.</p>
    <h3>📊 Statistics</h3>
    <p>Pie chart for day, week or month. «Reset statistics» clears accumulated data.</p>
    <p style="margin-top:20px;font-style:italic;text-align:center;">✨ Enjoy using the app! ✨</p>
  `,
  ka: `
    <h3>🏠 მთავარი ეკრანი</h3>
    <p><strong>ბალანსის ბარათები:</strong> აჩვენებს ხელფასს, შემოსავლებს, ხარჯებს და ნაშთს. ყველა თანხა გამოითვლება არჩეულ ვალუტაში.</p>
    <p><strong>➕ ახალი ოპერაცია:</strong> დააჭირეთ <code>＋</code> ქვემოთ ან «➕ ახალი ოპერაცია». აირჩიეთ ტიპი, კატეგორია, ქვეკატეგორია, შეიყვანეთ თანხა, თარიღი და შენიშვნა.</p>
    <p><strong>ბოლო 5 ოპერაცია:</strong> დააჭირეთ ოპერაციას რედაქტირებისთვის. <code>✕</code> წაშლის მას.</p>
    <p><strong>🧹 ყველას გასუფთავება:</strong> წაშლის ყველა ოპერაციას (დადასტურება საჭიროა).</p>
    <p><strong>✏️ ხელფასი:</strong> დააყენეთ საწყისი ბალანსი მიმდინარე ვალუტაში.</p>
    <h3>📋 ოპერაციები</h3>
    <p>ძებნა ტექსტით, თარიღებით და ტიპით. ბარათზე დაჭერა — რედაქტირება.</p>
    <h3>🗂️ კატეგორიები</h3>
    <p>სახელზე დაჭერა — გადარქმევა. <code>+</code> ღილაკები ამატებს ქვეკატეგორიებს.</p>
    <h3>🧮 ინსტრუმენტები</h3>
    <p><strong>კალკულატორი:</strong> ძირითადი ოპერაციები გამოთვლების ისტორიით.</p>
    <p><strong>გადამყვანი:</strong> აირჩიეთ ვალუტები და თანხა. კურსების განახლება «🔄 კურსების განახლება».</p>
    <h3>📓 ბლოკნოტი</h3>
    <p>შექმენით გვერდი ტექსტური ჩანიშვნებისთვის, თქვენ შეგიძლიათ გვერდების რედაქტირება, წაშლა. დააჭირეთ ბარათს რედაქტირებისთვის.</p>
    <h3>📊 სტატისტიკა</h3>
    <p>დიაგრამა დღის, კვირის ან თვის მიხედვით. «სტატისტიკის გადატვირთვა» — ნულდება დაგროვილი მონაცემები.</p>
    <p style="margin-top:20px;font-style:italic;text-align:center;">✨ გისურვებთ კომფორტულ და სასიამოვნო გამოყენებას! ✨</p>
  `,
};

function setLanguage(lang) {
  if (typeof locales === "undefined" || !locales[lang]) return;
  currentLang = lang;
  localStorage.setItem("app_lang", lang);
  document.documentElement.lang =
    lang === "ka" ? "ka" : lang === "en" ? "en" : "ru";

  // 1. Обычные элементы data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = locales[lang][key];
    if (val === undefined) return;
    el.innerHTML = val;
  });

  // 2. Плейсхолдеры data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = locales[lang][key];
    if (val !== undefined) el.placeholder = val;
  });

  // 3. Опции select: data-i18n-opt
  document.querySelectorAll("[data-i18n-opt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-opt");
    const val = locales[lang][key];
    if (val !== undefined) el.textContent = val;
  });

  // 4. Контент модалки помощи
  const helpBody = document.getElementById("helpModalBody");
  if (helpBody) {
    helpBody.innerHTML = helpContent[lang] || helpContent["ru"];
  }

  // 5. Активные кнопки языков
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    if (btn.getAttribute("data-lang") === lang) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  // 6. Обновить динамические данные приложения
  if (window._appReady) {
    if (window.refreshAll) window.refreshAll();
    if (window.updateStats) window.updateStats(false);
  }
}
window.setLanguage = setLanguage;

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.getAttribute("data-lang"));
    });
  });
  setLanguage(currentLang);
});
