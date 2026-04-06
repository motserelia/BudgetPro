const CACHE_NAME = "budgetpro-v7";
const urlsToCache = [
  "./",
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
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of urlsToCache) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log(`Cached: ${url}`);
          } else {
            console.warn(`Failed to cache ${url}: status ${response.status}`);
          }
        } catch (err) {
          console.warn(`Could not fetch ${url}:`, err);
        }
      }
    })()
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
      caches.match("./index.html").then(response => {
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
