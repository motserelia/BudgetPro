const CACHE_NAME = "budgetpro-v9";
const urlsToCache = [
  "./index.html",
  "./index.css",
  "./index.js",
  "./i18n.js",
  "./locales.js",
  "./manifest.json",
  "./money.jpg",
  "./favicon-96x96.png",
  "./apple-touch-icon.png",
  "./favicon.ico",
  "./favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.error("Cache addAll error:", err);
      });
    })
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
  const request = event.request;
  const url = new URL(request.url);

  // Не кэшируем запросы к API курсов валют (они всё равно не работают офлайн)
  if (url.pathname.includes("/v4/latest/RUB")) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then(networkResponse => {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Если нет сети и нет кэша, для навигации возвращаем index.html
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }
        return new Response("Ресурс не найден в офлайн-режиме", { status: 404 });
      });
    })
  );
});
