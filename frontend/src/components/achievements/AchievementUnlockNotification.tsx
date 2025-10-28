import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Trophy, Star, Zap, X } from 'lucide-react';
import type { Achievement } from '@/types';

interface AchievementUnlockNotificationProps {
    achievement: Achievement | null;
    isVisible: boolean;
    onComplete?: () => void;
    position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
    autoClose?: boolean;
    duration?: number;
}

export function AchievementUnlockNotification({
    achievement,
    isVisible,
    onComplete,
    position = 'top-right',
    autoClose = true,
    duration = 5000
}: AchievementUnlockNotificationProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isVisible && achievement) {
            setShouldRender(true);
            setIsClosing(false);

            if (autoClose) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);
                return () => clearTimeout(timer);
            }
        }
    }, [isVisible, achievement, autoClose, duration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShouldRender(false);
            onComplete?.();
        }, 300);
    };

    if (!shouldRender || !achievement) return null;

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const getRarityColor = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common':
                return 'from-gray-400 to-gray-600';
            case 'rare':
                return 'from-blue-400 to-blue-600';
            case 'epic':
                return 'from-purple-400 to-purple-600';
            case 'legendary':
                return 'from-yellow-400 to-orange-500';
            default:
                return 'from-gray-400 to-gray-600';
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'trophy':
                return Trophy;
            case 'star':
                return Star;
            case 'zap':
                return Zap;
            default:
                return Trophy;
        }
    };

    const IconComponent = getIcon(achievement.icon);

    const notificationContent = (
        <AnimatePresence>
            {shouldRender && (
                <motion.div
                    className={`fixed z-50 ${positionClasses[position]} max-w-sm`}
                    initial={{ opacity: 0, scale: 0.5, y: position.includes('top') ? -20 : 20 }}
                    animate={{
                        opacity: isClosing ? 0 : 1,
                        scale: isClosing ? 0.5 : 1,
                        y: 0
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: position.includes('top') ? -20 : 20 }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 300
                    }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                        animate={{
                            boxShadow: [
                                '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                '0 25px 50px -12px rgba(59, 130, 246, 0.4)',
                                '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        {/* Header with gradient */}
                        <div className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} p-4 text-white relative overflow-hidden`}>
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Achievement Unlocked Text */}
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-lg font-bold mb-1">🎉 Achievement Unlocked!</h3>
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-sm font-medium uppercase tracking-wide">
                                        {achievement.rarity}
                                    </span>
                                    <div className="w-1 h-1 bg-white/60 rounded-full" />
                                    <div className="flex items-center space-x-1">
                                        <Zap className="w-3 h-3" />
                                        <span className="text-sm">+{achievement.xpReward} XP</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-10">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: Math.random() * 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex items-start space-x-3">
                                {/* Achievement Icon */}
                                <motion.div
                                    className={`p-3 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white shadow-lg flex-shrink-0`}
                                    animate={{
                                        rotate: [0, -5, 5, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <IconComponent className="w-6 h-6" />
                                </motion.div>

                                {/* Achievement Details */}
                                <div className="flex-1 min-w-0">
                                    <motion.h4
                                        className="text-lg font-bold text-gray-900 mb-1"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {achievement.name}
                                    </motion.h4>

                                    <motion.p
                                        className="text-sm text-gray-600 leading-relaxed"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {achievement.description}
                                    </motion.p>
                                </div>
                            </div>
                        </div>

                        {/* Progress indicator (auto-close) */}
                        {autoClose && (
                            <div className="h-1 bg-gray-200">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: duration / 1000, ease: 'linear' }}
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: `${20 + Math.random() * 60}%`,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                    y: [0, -30, -60],
                                    x: [(Math.random() - 0.5) * 40]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: Math.random() * 2,
                                    repeat: Infinity,
                                    ease: 'easeOut'
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(notificationContent, document.body);
}

// Hook for managing achievement unlock notifications
export function useAchievementNotification() {
    const [notification, setNotification] = useState<{
        achievement: Achievement | null;
        isVisible: boolean;
    }>({
        achievement: null,
        isVisible: false
    });

    const showAchievementUnlock = (achievement: Achievement) => {
        setNotification({
            achievement,
            isVisible: true
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    return {
        notification,
        showAchievementUnlock,
        hideNotification
    };
}