/**
 * FocusHub Service Worker
 *
 * Handles offline functionality, caching strategies, and background sync.
 */

const CACHE_NAME = 'focushub-v1';
const RUNTIME_CACHE = 'focushub-runtime-v1';
const API_CACHE = 'focushub-api-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/projects',
  '/achievements',
  '/leaderboard',
  '/xp',
  '/skills',
  '/profile',
];

// API routes to cache
const API_ROUTES = [
  '/api/timer',
  '/api/projects',
  '/api/achievements',
  '/api/user',
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log('[SW] Service worker installed successfully');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Failed to precache:', error);
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME &&
              cacheName !== RUNTIME_CACHE &&
              cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - handle network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - Network First, falling back to cache
  if (isApiRequest(url)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Static assets - Cache First, falling back to network
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Navigation requests - Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigations
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cached page or offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Default - Network First with cache fallback
  event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
});

/**
 * Network First Strategy
 * Try network first, fall back to cache if offline
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    // No cache available, return offline page for navigation
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }

    throw error;
  }
}

/**
 * Cache First Strategy
 * Check cache first, fall back to network
 */
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    console.log('[SW] Serving from cache:', request.url);
    return cachedResponse;
  }

  // Not in cache, fetch from network and cache
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    throw error;
  }
}

/**
 * Check if request is for API endpoint
 */
function isApiRequest(url) {
  return url.pathname.startsWith('/api/') ||
         API_ROUTES.some(route => url.pathname.startsWith(route));
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(url) {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.webp', '.avif', '.woff', '.woff2', '.ttf', '.eot'
  ];

  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Background Sync - sync timer data when online
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'sync-timer-data') {
    event.waitUntil(syncTimerData());
  }
});

/**
 * Sync timer data with server
 */
async function syncTimerData() {
  try {
    // Get pending timer data from IndexedDB or cache
    const pendingData = await getPendingTimerData();

    if (pendingData && pendingData.length > 0) {
      console.log('[SW] Syncing timer data:', pendingData.length, 'items');

      // Send to server
      const response = await fetch('/api/timer/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: pendingData }),
      });

      if (response.ok) {
        console.log('[SW] Timer data synced successfully');
        await clearPendingTimerData();
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync timer data:', error);
    throw error;
  }
}

/**
 * Get pending timer data (placeholder - implement with IndexedDB)
 */
async function getPendingTimerData() {
  // TODO: Implement with IndexedDB
  return [];
}

/**
 * Clear pending timer data (placeholder - implement with IndexedDB)
 */
async function clearPendingTimerData() {
  // TODO: Implement with IndexedDB
  return Promise.resolve();
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FocusHub';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    data: data,
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

/**
 * Message handler - communication with clients
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

console.log('[SW] Service worker script loaded');
