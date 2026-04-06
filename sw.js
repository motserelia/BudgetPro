const CACHE_NAME = "budgetpro-v3"; // увеличиваем версию
const urlsToCache = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/i18n.js",
  "/locales.js",
  "/manifest.json",
  "/favicon-96x96.png",
  "/favicon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png"
  // money.jpg – удалён, если файла нет; если есть – добавьте обратно
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error("Cache addAll error:", err))
  );
  // Активируем сразу, не дожидаясь закрытия вкладок
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Удаляем старые кэши
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  // Забираем контроль над страницами сразу
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Для навигационных запросов всегда отдаём index.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then(response => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Для остальных запросов: сначала кэш, потом сеть
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
