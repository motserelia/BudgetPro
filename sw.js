const CACHE_NAME = "budgetpro-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/i18n.js",
  "/manifest.json",
  "/money.jpg",
  "/favicon-96x96.png",
  "/favicon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
