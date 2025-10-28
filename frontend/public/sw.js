// Service Worker for offline functionality and caching

const CACHE_NAME = 'timetracker-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_CACHE_URLS = [
    '/',
    '/offline.html',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Ensure the service worker takes control immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response because it's a stream
                        const responseToCache = response.clone();

                        // Cache successful responses
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // Only cache GET requests
                                if (event.request.method === 'GET') {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return response;
                    })
                    .catch(() => {
                        // Network failed, try to serve offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }

                        // For other requests, return a generic offline response
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);

    if (event.tag === 'timer-sync') {
        event.waitUntil(syncTimerData());
    }

    if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalyticsData());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);

    const options = {
        body: event.data ? event.data.text() : 'Time to take a break!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Time Tracker', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);

    event.notification.close();

    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions for background sync
async function syncTimerData() {
    try {
        // Get pending timer data from IndexedDB
        const pendingData = await getPendingTimerData();

        if (pendingData.length > 0) {
            // Send to server
            const response = await fetch('/api/timer/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pendingData),
            });

            if (response.ok) {
                // Clear pending data
                await clearPendingTimerData();
                console.log('Timer data synced successfully');
            }
        }
    } catch (error) {
        console.error('Failed to sync timer data:', error);
    }
}

async function syncAnalyticsData() {
    try {
        // Get pending analytics data from IndexedDB
        const pendingData = await getPendingAnalyticsData();

        if (pendingData.length > 0) {
            // Send to server
            const response = await fetch('/api/analytics/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pendingData),
            });

            if (response.ok) {
                // Clear pending data
                await clearPendingAnalyticsData();
                console.log('Analytics data synced successfully');
            }
        }
    } catch (error) {
        console.error('Failed to sync analytics data:', error);
    }
}

// IndexedDB helpers (simplified - would need proper implementation)
async function getPendingTimerData() {
    // Implementation would use IndexedDB to get pending timer data
    return [];
}

async function clearPendingTimerData() {
    // Implementation would clear pending timer data from IndexedDB
}

async function getPendingAnalyticsData() {
    // Implementation would use IndexedDB to get pending analytics data
    return [];
}

async function clearPendingAnalyticsData() {
    // Implementation would clear pending analytics data from IndexedDB
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});