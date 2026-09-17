const CACHE = 'trace-runtime-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith('trace-runtime-') && key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const cacheable =
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    request.mode !== 'navigate' &&
    (request.destination === 'image' ||
      request.destination === 'font' ||
      request.destination === 'style' ||
      request.destination === 'script');

  if (!cacheable) return;

  const network = fetch(request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  });

  // Client bundles must never lag a deploy: an old script can change page
  // behavior even when the HTML is current. Cache is only the offline fallback.
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(network.catch(() => caches.match(request)));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      return network;
    }),
  );
});
