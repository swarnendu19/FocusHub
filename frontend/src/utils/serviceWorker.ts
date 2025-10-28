/**
 * Service Worker registration and management utilities
 */

interface ServiceWorkerConfig {
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
    onError?: (error: Error) => void;
}

// Check if service workers are supported
export function isServiceWorkerSupported(): boolean {
    return 'serviceWorker' in navigator;
}

// Register service worker
export async function registerServiceWorker(config: ServiceWorkerConfig = {}): Promise<ServiceWorkerRegistration | null> {
    if (!isServiceWorkerSupported()) {
        console.warn('Service workers are not supported in this browser');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });

        console.log('Service Worker registered successfully:', registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New content is available
                        config.onUpdate?.(registration);
                    }
                });
            }
        });

        // Check for existing service worker
        if (registration.active) {
            config.onSuccess?.(registration);
        }

        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        config.onError?.(error as Error);
        return null;
    }
}

// Unregister service worker
export async function unregisterServiceWorker(): Promise<boolean> {
    if (!isServiceWorkerSupported()) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
            const result = await registration.unregister();
            console.log('Service Worker unregistered:', result);
            return result;
        }

        return false;
    } catch (error) {
        console.error('Service Worker unregistration failed:', error);
        return false;
    }
}

// Update service worker
export async function updateServiceWorker(): Promise<void> {
    if (!isServiceWorkerSupported()) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
            await registration.update();
            console.log('Service Worker update triggered');
        }
    } catch (error) {
        console.error('Service Worker update failed:', error);
    }
}

// Skip waiting and activate new service worker
export function skipWaitingAndActivate(): void {
    if (!isServiceWorkerSupported()) {
        return;
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page to use the new service worker
        window.location.reload();
    });

    // Send message to service worker to skip waiting
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
}

// Get service worker version
export async function getServiceWorkerVersion(): Promise<string | null> {
    if (!isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
        return null;
    }

    return new Promise((resolve) => {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (event) => {
            resolve(event.data.version || null);
        };

        navigator.serviceWorker.controller.postMessage(
            { type: 'GET_VERSION' },
            [messageChannel.port2]
        );

        // Timeout after 5 seconds
        setTimeout(() => resolve(null), 5000);
    });
}

// Check if app is running in standalone mode (PWA)
export function isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
}

// Check online status
export function isOnline(): boolean {
    return navigator.onLine;
}

// Add online/offline event listeners
export function addNetworkListeners(
    onOnline: () => void,
    onOffline: () => void
): () => void {
    const handleOnline = () => onOnline();
    const handleOffline = () => onOffline();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}

// Cache management utilities
export const cacheManager = {
    // Clear all caches
    async clearAll(): Promise<void> {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('All caches cleared');
        }
    },

    // Clear specific cache
    async clear(cacheName: string): Promise<boolean> {
        if ('caches' in window) {
            const result = await caches.delete(cacheName);
            console.log(`Cache ${cacheName} cleared:`, result);
            return result;
        }
        return false;
    },

    // Get cache size
    async getSize(): Promise<number> {
        if (!('caches' in window) || !('storage' in navigator) || !('estimate' in navigator.storage)) {
            return 0;
        }

        try {
            const estimate = await navigator.storage.estimate();
            return estimate.usage || 0;
        } catch (error) {
            console.error('Failed to get cache size:', error);
            return 0;
        }
    },

    // Check if URL is cached
    async isCached(url: string): Promise<boolean> {
        if ('caches' in window) {
            const response = await caches.match(url);
            return !!response;
        }
        return false;
    },
};

// Background sync utilities
export const backgroundSync = {
    // Register background sync
    async register(tag: string): Promise<void> {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register(tag);
                console.log('Background sync registered:', tag);
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
    },

    // Check if background sync is supported
    isSupported(): boolean {
        return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
    },
};

// Push notification utilities
export const pushNotifications = {
    // Check if push notifications are supported
    isSupported(): boolean {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    },

    // Request notification permission
    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    },

    // Subscribe to push notifications
    async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
        if (!this.isSupported()) {
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey,
            });

            console.log('Push subscription created:', subscription);
            return subscription;
        } catch (error) {
            console.error('Push subscription failed:', error);
            return null;
        }
    },

    // Unsubscribe from push notifications
    async unsubscribe(): Promise<boolean> {
        if (!this.isSupported()) {
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                const result = await subscription.unsubscribe();
                console.log('Push subscription removed:', result);
                return result;
            }

            return false;
        } catch (error) {
            console.error('Push unsubscription failed:', error);
            return false;
        }
    },
};

// Service worker utilities object
export const serviceWorkerUtils = {
    register: registerServiceWorker,
    unregister: unregisterServiceWorker,
    update: updateServiceWorker,
    skipWaitingAndActivate,
    getVersion: getServiceWorkerVersion,
    isSupported: isServiceWorkerSupported,
    isStandalone,
    isOnline,
    addNetworkListeners,
    cache: cacheManager,
    backgroundSync,
    pushNotifications,
};

export default serviceWorkerUtils;