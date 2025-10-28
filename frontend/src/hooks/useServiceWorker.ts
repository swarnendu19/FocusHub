import { useEffect, useState, useCallback } from 'react';
import { env } from '@/config/env';

interface ServiceWorkerState {
    isSupported: boolean;
    isRegistered: boolean;
    isOnline: boolean;
    registration: ServiceWorkerRegistration | null;
    updateAvailable: boolean;
}

export const useServiceWorker = () => {
    const [state, setState] = useState<ServiceWorkerState>({
        isSupported: 'serviceWorker' in navigator,
        isRegistered: false,
        isOnline: navigator.onLine,
        registration: null,
        updateAvailable: false,
    });

    // Register service worker
    const register = useCallback(async () => {
        if (!state.isSupported || !env.pwaEnabled) {
            console.log('Service Worker not supported or PWA disabled');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/',
            });

            setState(prev => ({
                ...prev,
                isRegistered: true,
                registration,
            }));

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            setState(prev => ({ ...prev, updateAvailable: true }));
                        }
                    });
                }
            });

            console.log('Service Worker registered successfully');
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }, [state.isSupported]);

    // Update service worker
    const update = useCallback(() => {
        if (state.registration) {
            state.registration.update();
        }
    }, [state.registration]);

    // Skip waiting and activate new service worker
    const skipWaiting = useCallback(() => {
        if (state.registration?.waiting) {
            state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            setState(prev => ({ ...prev, updateAvailable: false }));
        }
    }, [state.registration]);

    // Unregister service worker
    const unregister = useCallback(async () => {
        if (state.registration) {
            await state.registration.unregister();
            setState(prev => ({
                ...prev,
                isRegistered: false,
                registration: null,
                updateAvailable: false,
            }));
        }
    }, [state.registration]);

    // Listen for online/offline events
    useEffect(() => {
        const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
        const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Listen for service worker messages
    useEffect(() => {
        if (!state.isSupported) return;

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'SYNC_COMPLETE') {
                console.log(`Synced ${event.data.entriesSynced} offline entries`);
            }
        };

        navigator.serviceWorker.addEventListener('message', handleMessage);

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleMessage);
        };
    }, [state.isSupported]);

    return {
        ...state,
        register,
        update,
        skipWaiting,
        unregister,
    };
};

// Separate hook for online status
export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};