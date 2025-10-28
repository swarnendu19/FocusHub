import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Trophy, Star, Zap, Clock, Target, Calendar, Award } from 'lucide-react';
import type { Achievement } from '@/types';

interface AchievementTooltipProps {
    achievement: Achievement;
    isUnlocked: boolean;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export function AchievementTooltip({
    achievement,
    isUnlocked,
    children,
    position = 'top',
    delay = 500
}: AchievementTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;

                let x = 0;
                let y = 0;

                switch (position) {
                    case 'top':
                        x = rect.left + scrollX + rect.width / 2;
                        y = rect.top + scrollY - 10;
                        break;
                    case 'bottom':
                        x = rect.left + scrollX + rect.width / 2;
                        y = rect.bottom + scrollY + 10;
                        break;
                    case 'left':
                        x = rect.left + scrollX - 10;
                        y = rect.top + scrollY + rect.height / 2;
                        break;
                    case 'right':
                        x = rect.right + scrollX + 10;
                        y = rect.top + scrollY + rect.height / 2;
                        break;
                }

                setTooltipPosition({ x, y });
                setIsVisible(true);
            }
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
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
    const maxProgress = achievement.maxProgress || 1;
    const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'transform -translate-x-1/2 -translate-y-full';
            case 'bottom':
                return 'transform -translate-x-1/2';
            case 'left':
                return 'transform -translate-x-full -translate-y-1/2';
            case 'right':
                return 'transform -translate-y-1/2';
            default:
                return 'transform -translate-x-1/2 -translate-y-full';
        }
    };

    const getArrowClasses = () => {
        switch (position) {
            case 'top':
                return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
            case 'bottom':
                return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800';
            case 'left':
                return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800';
            case 'right':
                return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800';
            default:
                return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
        }
    };

    const tooltipContent = (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`fixed z-50 ${getPositionClasses()}`}
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-4 max-w-xs relative">
                        {/* Arrow */}
                        <div className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`} />

                        {/* Content */}
                        <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center space-x-2">
                                <div className={`p-1.5 rounded-full ${isUnlocked
                                        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}`
                                        : 'bg-gray-600'
                                    }`}>
                                    <IconComponent className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">
                                        {achievement.name}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isUnlocked
                                                ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
                                                : 'bg-gray-600 text-gray-300'
                                            }`}>
                                            {achievement.rarity}
                                        </span>
                                        <div className="flex items-center space-x-1 text-xs text-yellow-300">
                                            <Zap className="w-3 h-3" />
                                            <span>+{achievement.xpReward}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-300 leading-relaxed">
                                {achievement.description}
                            </p>

                            {/* Progress (if applicable) */}
                            {achievement.maxProgress && achievement.maxProgress > 1 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Progress</span>
                                        <span>{progress}/{maxProgress}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${isUnlocked
                                                    ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                                                    : 'bg-gray-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <div className="flex items-center justify-between text-xs">
                                <span className={`font-medium ${isUnlocked ? 'text-green-400' : 'text-gray-400'
                                    }`}>
                                    {isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                                </span>
                                {isUnlocked && achievement.unlockedAt && (
                                    <div className="flex items-center space-x-1 text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {achievement.unlockedAt.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block"
            >
                {children}
            </div>
            {createPortal(tooltipContent, document.body)}
        </>
    );
}