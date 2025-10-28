import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Trophy, Star, Zap, Calendar, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/types';

interface AchievementModalProps {
    achievement: Achievement | null;
    isUnlocked: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export function AchievementModal({ achievement, isUnlocked, isOpen, onClose }: AchievementModalProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen && isUnlocked) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isUnlocked]);

    if (!achievement || !isOpen) return null;

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

    const getRarityBg = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common':
                return 'from-gray-50 to-gray-100';
            case 'rare':
                return 'from-blue-50 to-blue-100';
            case 'epic':
                return 'from-purple-50 to-purple-100';
            case 'legendary':
                return 'from-yellow-50 to-orange-100';
            default:
                return 'from-gray-50 to-gray-100';
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
            case 'clock':
                return Clock;
            case 'target':
                return Target;
            default:
                return Trophy;
        }
    };

    const IconComponent = getIcon(achievement.icon);
    const progress = achievement.progress || 0;
    const maxProgress = achievement.maxProgress || 100;
    const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 100;

    const modalContent = (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: 50 }}
                    transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Background Gradient */}
                    <div className={cn(
                        'absolute inset-0 opacity-10',
                        `bg-gradient-to-br ${getRarityBg(achievement.rarity)}`
                    )} />

                    {/* Content */}
                    <div className="relative p-8 text-center">
                        {/* Achievement Icon */}
                        <motion.div
                            className="flex justify-center mb-6"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                damping: 15,
                                stiffness: 200
                            }}
                        >
                            <div className="relative">
                                <motion.div
                                    className={cn(
                                        'p-6 rounded-full shadow-2xl',
                                        isUnlocked
                                            ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white`
                                            : 'bg-gray-300 text-gray-500'
                                    )}
                                    animate={{
                                        boxShadow: isUnlocked && showConfetti
                                            ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 20px rgba(59, 130, 246, 0)']
                                            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                    }}
                                    transition={{ duration: 1, repeat: showConfetti ? Infinity : 0 }}
                                >
                                    <IconComponent className="w-12 h-12" />
                                </motion.div>

                                {/* Sparkle Effects */}
                                {isUnlocked && showConfetti && (
                                    <>
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                                style={{
                                                    top: `${30 + Math.sin(i * 45 * Math.PI / 180) * 40}px`,
                                                    left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 40}px`,
                                                }}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    opacity: [0, 1, 0],
                                                    rotate: [0, 180, 360]
                                                }}
                                                transition={{
                                                    delay: i * 0.1,
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatDelay: 2
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Achievement Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            {/* Rarity Badge */}
                            <motion.div
                                className={cn(
                                    'inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide',
                                    isUnlocked
                                        ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
                                        : 'bg-gray-300 text-gray-600'
                                )}
                                animate={{ scale: showConfetti ? [1, 1.1, 1] : 1 }}
                                transition={{ duration: 0.5, repeat: showConfetti ? Infinity : 0 }}
                            >
                                {achievement.rarity}
                            </motion.div>

                            {/* Title */}
                            <h2 className={cn(
                                'text-2xl font-bold',
                                isUnlocked ? 'text-gray-900' : 'text-gray-500'
                            )}>
                                {achievement.name}
                            </h2>

                            {/* Description */}
                            <p className={cn(
                                'text-base leading-relaxed',
                                isUnlocked ? 'text-gray-600' : 'text-gray-400'
                            )}>
                                {achievement.description}
                            </p>

                            {/* XP Reward */}
                            <motion.div
                                className={cn(
                                    'inline-flex items-center space-x-2 px-4 py-2 rounded-full',
                                    isUnlocked
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-500'
                                )}
                                animate={{ scale: showConfetti ? [1, 1.05, 1] : 1 }}
                                transition={{ duration: 0.3, repeat: showConfetti ? Infinity : 0 }}
                            >
                                <Zap className="w-5 h-5" />
                                <span className="font-semibold">+{achievement.xpReward} XP</span>
                            </motion.div>

                            {/* Progress Section */}
                            {achievement.maxProgress && achievement.maxProgress > 1 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className={isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                                            Progress
                                        </span>
                                        <span className={isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                                            {progress}/{maxProgress}
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn(
                                                'h-full rounded-full',
                                                isUnlocked
                                                    ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                                                    : 'bg-gray-300'
                                            )}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                            transition={{ duration: 1.5, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Unlock Date */}
                            {isUnlocked && achievement.unlockedAt && (
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Unlocked on {achievement.unlockedAt.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}

                            {/* Status Message */}
                            <motion.div
                                className={cn(
                                    'text-lg font-semibold',
                                    isUnlocked ? 'text-green-600' : 'text-gray-500'
                                )}
                                animate={{ scale: showConfetti ? [1, 1.05, 1] : 1 }}
                                transition={{ duration: 0.4, repeat: showConfetti ? Infinity : 0 }}
                            >
                                {isUnlocked ? '🎉 Achievement Unlocked!' : '🔒 Not Yet Unlocked'}
                            </motion.div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8"
                        >
                            <Button
                                onClick={onClose}
                                className={cn(
                                    'w-full py-3 px-6 rounded-xl font-semibold text-lg',
                                    isUnlocked
                                        ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} hover:opacity-90 text-white`
                                        : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
                                )}
                            >
                                {isUnlocked ? 'Awesome!' : 'Keep Working!'}
                            </Button>
                        </motion.div>
                    </div>

                    {/* Confetti Effect */}
                    {showConfetti && isUnlocked && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={cn(
                                        'absolute w-2 h-2 rounded-full',
                                        i % 4 === 0 ? 'bg-yellow-400' :
                                            i % 4 === 1 ? 'bg-blue-400' :
                                                i % 4 === 2 ? 'bg-green-400' : 'bg-red-400'
                                    )}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: '-10px',
                                    }}
                                    initial={{ y: -10, opacity: 1, rotate: 0 }}
                                    animate={{
                                        y: 500,
                                        opacity: 0,
                                        rotate: 360,
                                        x: Math.random() * 200 - 100
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: Math.random() * 2,
                                        ease: 'easeOut'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}