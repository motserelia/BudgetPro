const CACHE_NAME = 'budgetpro-v1';
const urlsToCache = [
  '/BudgetPro/',
  '/BudgetPro/index.html',
  '/BudgetPro/assets/css/index.css',
  '/BudgetPro/assets/js/index.js',
  '/BudgetPro/assets/images/money.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
