/* Master Display: GDR Tools - offline cache */
const CACHE = 'mdgdr-v1';
const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k)))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
