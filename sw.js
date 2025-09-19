// Service Worker for FurkAI PWA
const CACHE_NAME = 'furkai-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/design-system.css',
  '/css/components.css',
  '/css/modules.css',
  '/css/app.css',
  '/js/core/event-system.js',
  '/js/core/data-manager.js',
  '/js/core/module-manager.js',
  '/js/core/notification-manager.js',
  '/js/modules/yemek.js',
  '/js/modules/spor.js',
  '/js/modules/namaz.js',
  '/js/modules/ezber.js',
  '/js/modules/zincir.js',
  '/js/modules/todo.js',
  '/js/app.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then(fetchResponse => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            // Cache the response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for notifications
self.addEventListener('sync', event => {
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Handle notification scheduling
      handleNotificationSync()
    );
  }
});

// Push event for notifications
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'snooze') {
    // Handle snooze action
    event.waitUntil(
      scheduleSnoozeNotification(event.notification.data)
    );
  }
});

// Helper functions
async function handleNotificationSync() {
  // Get scheduled notifications from IndexedDB
  const notifications = await getScheduledNotifications();
  
  for (const notification of notifications) {
    if (shouldTriggerNotification(notification)) {
      await triggerNotification(notification);
    }
  }
}

async function getScheduledNotifications() {
  // Implementation depends on your data structure
  return [];
}

function shouldTriggerNotification(notification) {
  const now = new Date();
  const scheduledTime = new Date(notification.scheduledTime);
  return now >= scheduledTime;
}

async function triggerNotification(notification) {
  const options = {
    body: notification.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: notification.data,
    actions: [
      { action: 'open', title: 'Aç' },
      { action: 'snooze', title: 'Ertele' }
    ]
  };

  return self.registration.showNotification(notification.title, options);
}

async function scheduleSnoozeNotification(data) {
  // Schedule notification for 15 minutes later
  const snoozeTime = new Date(Date.now() + 15 * 60 * 1000);
  
  // Store snoozed notification in IndexedDB
  await storeScheduledNotification({
    ...data,
    scheduledTime: snoozeTime.toISOString(),
    title: data.title + ' (Ertelendi)'
  });
}
