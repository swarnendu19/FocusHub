import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Plus, Zap } from 'lucide-react';

interface XPGainNotificationProps {
    xpAmount: number;
    reason?: string;
    isVisible: boolean;
    onComplete?: () => void;
    position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

export function XPGainNotification({
    xpAmount,
    reason = 'Task completed',
    isVisible,
    onComplete,
    position = 'top-right'
}: XPGainNotificationProps) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                onComplete?.();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    if (!shouldRender) return null;

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const notificationContent = (
        <AnimatePresence>
            {shouldRender && (
                <motion.div
                    className={`fixed z-50 ${positionClasses[position]}`}
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 300
                    }}
                >
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg shadow-2xl border border-white/20 backdrop-blur-sm"
                        animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            times: [0, 0.5, 1],
                            ease: 'easeInOut'
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            {/* XP Icon */}
                            <motion.div
                                className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 1,
                                    ease: 'easeInOut'
                                }}
                            >
                                <Zap className="w-5 h-5 text-yellow-300" />
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <Plus className="w-4 h-4 text-green-300" />
                                    <motion.span
                                        className="text-xl font-bold"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {xpAmount} XP
                                    </motion.span>
                                </div>
                                <motion.p
                                    className="text-sm text-white/80 mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {reason}
                                </motion.p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.div
                                className="h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{
                                    delay: 0.8,
                                    duration: 2,
                                    ease: 'easeOut'
                                }}
                            />
                        </motion.div>

                        {/* Sparkle Effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                                    style={{
                                        left: `${20 + Math.random() * 60}%`,
                                        top: `${20 + Math.random() * 60}%`,
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                        x: [0, (Math.random() - 0.5) * 40],
                                        y: [0, (Math.random() - 0.5) * 40]
                                    }}
                                    transition={{
                                        delay: 0.5 + Math.random() * 1,
                                        duration: 1.5,
                                        ease: 'easeOut'
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(notificationContent, document.body);
}

// Hook for managing XP notifications
export function useXPNotification() {
    const [notification, setNotification] = useState<{
        xpAmount: number;
        reason: string;
        isVisible: boolean;
    }>({
        xpAmount: 0,
        reason: '',
        isVisible: false
    });

    const showXPGain = (xpAmount: number, reason: string = 'XP gained') => {
        setNotification({
            xpAmount,
            reason,
            isVisible: true
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    return {
        notification,
        showXPGain,
        hideNotification
    };
}