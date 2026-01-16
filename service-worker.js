const CACHE_NAME = 'coins-calculator-v1.0';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        './',
        './index.html',
        './styles/main.css',
        './scripts/calculator.js',
        './scripts/roll.js',
        './scripts/app.js',
        './manifest.json'
      ]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
