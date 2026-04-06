const CACHE_NAME = "budgetpro-v12";
const urlsToCache = [
  "/BudgetPro/index.html",
  "/BudgetPro/index.css",
  "/BudgetPro/index.js",
  "/BudgetPro/i18n.js",
  "/BudgetPro/locales.js",
  "/BudgetPro/manifest.json",
  "/BudgetPro/money.jpg",
  "/BudgetPro/favicon-96x96.png",
  "/BudgetPro/apple-touch-icon.png",
  "/BudgetPro/favicon.ico"
  // favicon.svg удалён, если его нет
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
  
  if (url.pathname.includes("/v4/latest/RUB")) {
    event.respondWith(fetch(request));
    return;
  }
  
  event.respondWith(
    caches.match(request).then(response => {
      if (response) return response;
      return fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      if (request.mode === "navigate") {
        return caches.match("/BudgetPro/index.html");
      }
      return new Response("Offline", { status: 404 });
    })
  );
});
