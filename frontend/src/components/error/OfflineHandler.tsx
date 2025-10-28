import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnlineStatus } from '@/hooks/useServiceWorker';
import { toast } from 'sonner';

interface OfflineHandlerProps {
    children: React.ReactNode;
    showBanner?: boolean;
    gracefulDegradation?: boolean;
}

export function OfflineHandler({
    children,
    showBanner = true,
    gracefulDegradation = true
}: OfflineHandlerProps) {
    const isOnline = useOnlineStatus();
    const [wasOffline, setWasOffline] = useState(false);
    const [showOfflineMessage, setShowOfflineMessage] = useState(false);

    useEffect(() => {
        if (!isOnline && !wasOffline) {
            setWasOffline(true);
            setShowOfflineMessage(true);
            toast.error('You are now offline. Some features may be limited.', {
                duration: 5000,
                icon: <WifiOff className="w-4 h-4" />,
            });
        } else if (isOnline && wasOffline) {
            setShowOfflineMessage(false);
            toast.success('You are back online!', {
                duration: 3000,
                icon: <Wifi className="w-4 h-4" />,
            });
            setWasOffline(false);
        }
    }, [isOnline, wasOffline]);

    const handleRetry = () => {
        window.location.reload();
    };

    if (!isOnline && !gracefulDegradation) {
        // Full offline screen
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
                    data-testid="offline-message"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <WifiOff className="w-8 h-8 text-gray-600" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-gray-900 mb-4"
                    >
                        You're offline
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 mb-6"
                    >
                        Please check your internet connection and try again. Some features may be available offline.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                    >
                        <Button
                            onClick={handleRetry}
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>

                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="w-full"
                        >
                            Go Back
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 p-4 bg-blue-50 rounded-lg"
                    >
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Offline Features Available:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>View cached data</li>
                                    <li>Continue active timers</li>
                                    <li>Browse achievements</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            {/* Offline Banner */}
            <AnimatePresence>
                {showBanner && showOfflineMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-3 shadow-lg"
                        data-testid="offline-banner"
                    >
                        <div className="flex items-center justify-center space-x-3">
                            <WifiOff className="w-5 h-5" />
                            <span className="font-medium">
                                You're offline. Some features may be limited.
                            </span>
                            <Button
                                onClick={() => setShowOfflineMessage(false)}
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-orange-600 ml-4"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content with offline context */}
            <div className={showOfflineMessage && showBanner ? 'pt-16' : ''}>
                <OfflineContext.Provider value={{ isOnline, wasOffline }}>
                    {children}
                </OfflineContext.Provider>
            </div>
        </>
    );
}

// Context for offline state
export const OfflineContext = React.createContext<{
    isOnline: boolean;
    wasOffline: boolean;
}>({
    isOnline: true,
    wasOffline: false,
});

// Hook to use offline context
export function useOfflineContext() {
    return React.useContext(OfflineContext);
}

// Component to show offline-specific UI
export function OfflineIndicator({ className = '' }: { className?: string }) {
    const { isOnline } = useOfflineContext();

    if (isOnline) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm ${className}`}
        >
            <WifiOff className="w-4 h-4" />
            <span>Offline</span>
        </motion.div>
    );
}

// Higher-order component for offline-aware components
export function withOfflineSupport<P extends object>(
    Component: React.ComponentType<P>,
    options: {
        showOfflineMessage?: boolean;
        fallbackComponent?: React.ComponentType<P>;
    } = {}
) {
    const WrappedComponent = (props: P) => {
        const { isOnline } = useOfflineContext();

        if (!isOnline && options.fallbackComponent) {
            const FallbackComponent = options.fallbackComponent;
            return <FallbackComponent {...props} />;
        }

        return <Component {...props} />;
    };

    WrappedComponent.displayName = `withOfflineSupport(${Component.displayName || Component.name})`;

    return WrappedComponent;
}