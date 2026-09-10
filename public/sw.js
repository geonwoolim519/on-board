const CACHE = 'on-board-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(event.request)
        const cache = await caches.open(CACHE)
        cache.put(event.request, fresh.clone())
        return fresh
      } catch {
        const cached = await caches.match(event.request)
        if (cached) return cached
        if (event.request.mode === 'navigate') {
          return caches.match(new URL('./index.html', self.registration.scope))
        }
        throw new Error('offline')
      }
    })(),
  )
})
