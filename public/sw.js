const CACHE = 'bocas-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/icon-192.png', '/icon-512.png'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  if (!e.request.url.startsWith(self.location.origin)) return

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE).then((c) => c.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})

// Backup timer for when the app is backgrounded
self.addEventListener('message', (e) => {
  if (e.data?.type !== 'SCHEDULE_ORDER_NOTIFICATION') return
  const { delay, title, body, icon, badge, tag, vibrate, data } = e.data
  setTimeout(() => {
    self.registration.showNotification(title, { body, icon, badge, tag, vibrate, data, renotify: true })
  }, delay)
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.startsWith(self.location.origin))
      if (existing) return existing.focus()
      return self.clients.openWindow(e.notification.data?.url || '/')
    })
  )
})
