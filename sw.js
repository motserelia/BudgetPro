/* БюджетPRO — Service Worker v3.0 */
/* Fixed for GitHub Pages subdirectory deployment */

const CACHE_NAME = "budgetpro-v3.0";
const BASE = "/BudgetPro"; // GitHub Pages base path

const ASSETS = [
  BASE + "/",
  BASE + "/index.html",
  BASE + "/index.css",
  BASE + "/index.js",
  BASE + "/manifest.json",
  BASE + "/favicon-96x96.png",
  BASE + "/favicon.svg",
  BASE + "/favicon.ico",
  BASE + "/apple-touch-icon.png",
  BASE + "/money.jpg",
];

// Install: pre-cache assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          ASSETS.map((url) =>
            cache.add(url).catch((e) => console.warn("Cache miss:", url, e)),
          ),
        ),
      ),
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch strategy: network-first for Firebase/API, cache-first for assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;

  // Network-first: Firebase, external APIs
  const isExternal = url.hostname !== location.hostname;
  const isFirebase =
    url.hostname.includes("firebase") || url.hostname.includes("googleapis");
  if (isExternal || isFirebase) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request)),
    );
    return;
  }

  // Cache-first for our own assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response?.status === 200 && response.type !== "opaque") {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return (
              caches.match(BASE + "/index.html") || caches.match("/index.html")
            );
          }
        });
    }),
  );
});
