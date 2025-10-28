import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/userStore';

interface XPProgressBarProps {
    className?: string;
    showOverflow?: boolean;
    onLevelUp?: (newLevel: number) => void;
}

export function XPProgressBar({ className, showOverflow = true, onLevelUp }: XPProgressBarProps) {
    const { user, getCurrentLevel, getXPProgress } = useUserStore();
    const [previousLevel, setPreviousLevel] = useState<number | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const currentLevel = getCurrentLevel();
    const xpProgress = getXPProgress();

    useEffect(() => {
        if (previousLevel !== null && currentLevel > previousLevel) {
            setIsOverflowing(true);
            onLevelUp?.(currentLevel);

            // Reset overflow animation after completion
            const timer = setTimeout(() => {
                setIsOverflowing(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
        setPreviousLevel(currentLevel);
    }, [currentLevel, previousLevel, onLevelUp]);

    if (!user) return null;

    const xpForCurrentLevel = (currentLevel - 1) * 1000;
    const xpForNextLevel = currentLevel * 1000;
    const currentXP = user.totalXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - user.totalXP;

    return (
        <div className={cn('w-full space-y-2', className)}>
            {/* Level and XP Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <motion.div
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full text-white font-bold text-lg shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {currentLevel}
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Level {currentLevel}</h3>
                        <p className="text-sm text-gray-600">
                            {currentXP.toLocaleString()} / {(xpForNextLevel - xpForCurrentLevel).toLocaleString()} XP
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Next Level</p>
                    <p className="text-lg font-semibold text-gray-900">{xpNeeded.toLocaleString()} XP</p>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    {/* Main Progress Bar */}
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut'
                        }}
                    >
                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        />
                    </motion.div>

                    {/* Overflow Animation */}
                    <AnimatePresence>
                        {isOverflowing && showOverflow && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                initial={{ width: '100%', opacity: 1 }}
                                animate={{
                                    width: '0%',
                                    opacity: 0
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1,
                                    ease: 'easeInOut'
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Progress Percentage */}
                <motion.div
                    className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg"
                    style={{ left: `${Math.min(xpProgress, 95)}%` }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {Math.round(xpProgress)}%
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                </motion.div>
            </div>

            {/* Total XP Display */}
            <div className="flex justify-center">
                <motion.div
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full border border-yellow-200"
                    whileHover={{ scale: 1.02 }}
                >
                    <span className="text-sm font-medium text-yellow-800">
                        Total XP: {user.totalXP.toLocaleString()}
                    </span>
                </motion.div>
            </div>
        </div>
    );
}