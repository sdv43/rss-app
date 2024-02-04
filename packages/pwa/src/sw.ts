import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

self.addEventListener('push', (event) => {
  event.waitUntil(
    new Promise(async (resolve) => {
      const data = event.data?.json() as { message: string }

      await self.registration.showNotification('Reminder', {
        body: data.message,
      })

      resolve(true)
    })
  )
})
