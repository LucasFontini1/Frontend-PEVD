/* PWA: somente arquivos estáticos públicos; nunca cachear API, autenticação ou pedidos. */
const CACHE_NAME = 'pevd-static-v1-20261122';
const PRECACHE = ['/offline.html', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-32.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim(),
  ]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin/') ||
      url.pathname.startsWith('/token/') || url.pathname.startsWith('/media/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      return await caches.match('/offline.html') || Response.error();
    }));
    return;
  }
  if (!url.pathname.startsWith('/assets/') && !url.pathname.startsWith('/icons/')) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  })));
});
