const CACHE_NAME = 'budgetpro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/index.css',
  '/assets/js/index.js',
  '/assets/images/money.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
