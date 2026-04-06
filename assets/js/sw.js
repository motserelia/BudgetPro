const CACHE_NAME = "budgetpro-v4"; // новая версия
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
  // money.jpg удалён, так как его нет
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then(response => {
        return response || fetch(event.request);
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
