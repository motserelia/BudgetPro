/* БюджетPRO — Service Worker v3.1 (Netlify edition) */

const CACHE_NAME = "budgetpro-v3.1";

const ASSETS = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/manifest.json",
  "/favicon-96x96.png",
  "/favicon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/money.jpg",
];

// Install: pre‑cache assets
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

// Fetch strategy: network‑first for external APIs, cache‑first for our own assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;

  // Network‑first: Firebase, external APIs
  const isExternal = url.hostname !== location.hostname;
  const isFirebase =
    url.hostname.includes("firebase") || url.hostname.includes("googleapis");
  if (isExternal || isFirebase) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request)),
    );
    return;
  }

  // Cache‑first for our own assets
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
            return caches.match("/index.html");
          }
        });
    }),
  );
});

// ── Push‑уведомление (через Web Push / VAPID) ──
self.addEventListener("push", (event) => {
  let data = {
    title: "БюджетPRO",
    body: "Напоминание",
    icon: "/favicon-96x96.png",
    tag: "budget-reminder",
    requireInteraction: true,
    vibrate: undefined,
  };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {}
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag || "budget-reminder",
    requireInteraction: true,
    actions: [
      { action: "open", title: "Открыть" },
      { action: "close", title: "Закрыть" },
    ],
    vibrate: data.vibrate,
    silent: !data.vibrate,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ── Клик по уведомлению ──
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "close") return;
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (
            client.url.includes(self.location.hostname) &&
            "focus" in client
          ) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow("/");
      }),
  );
});
