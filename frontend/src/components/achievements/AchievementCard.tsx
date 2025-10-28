import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Zap, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/types';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    className?: string;
    onClick?: () => void;
    showProgress?: boolean;
}

export function AchievementCard({ 
    achievement, 
    isUnlocked, 
    className, 
    onClick,
    showProgress = true 
}: AchievementCardProps) {
    const [isHovered, setIsHovered] = useState(false);

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

    const getRarityBorderColor = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common':
                return 'border-gray-300';
            case 'rare':
                return 'border-blue-300';
            case 'epic':
                return 'border-purple-300';
            case 'legendary':
                return 'border-yellow-300';
            default:
                return 'border-gray-300';
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
    const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

    return (
        <motion.div
            className={cn(
                'relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300',
                isUnlocked 
                    ? `bg-white shadow-lg hover:shadow-xl ${getRarityBorderColor(achievement.rarity)}` 
                    : 'bg-gray-100 border-gray-200 opacity-60',
                className
            )}
            whileHover={{ 
                scale: isUnlocked ? 1.05 : 1.02,
                y: isUnlocked ? -5 : -2
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            layout
        >
            {/* Rarity Glow Effect */}
            {isUnlocked && (
                <motion.div
                    className={cn(
                        'absolute inset-0 rounded-2xl opacity-20 blur-sm',
                        `bg-gradient-to-br ${getRarityColor(achievement.rarity)}`
                    )}
                    animate={{
                        opacity: isHovered ? 0.4 : 0.2,
                        scale: isHovered ? 1.02 : 1
                    }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Lock Overlay for Locked Achievements */}
            {!isUnlocked && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-gray-200/80 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Lock className="w-8 h-8 text-gray-500" />
                </motion.div>
            )}

            {/* Achievement Content */}
            <div className="relative z-10">
                {/* Icon and Rarity */}
                <div className="flex items-center justify-between mb-3">
                    <motion.div
                        className={cn(
                            'p-3 rounded-full',
                            isUnlocked 
                                ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white shadow-lg`
                                : 'bg-gray-300 text-gray-500'
                        )}
                        animate={{
                            rotate: isHovered && isUnlocked ? [0, -10, 10, 0] : 0,
                            scale: isHovered && isUnlocked ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <IconComponent className="w-6 h-6" />
                    </motion.div>

                    {/* Rarity Badge */}
                    <motion.div
                        className={cn(
                            'px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                            isUnlocked 
                                ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
                                : 'bg-gray-300 text-gray-600'
                        )}
                        animate={{
                            scale: isHovered ? 1.05 : 1
                        }}
                    >
                        {achievement.rarity}
                    </motion.div>
                </div>

                {/* Achievement Info */}
                <div className="space-y-2">
                    <h3 className={cn(
                        'font-bold text-lg leading-tight',
                        isUnlocked ? 'text-gray-900' : 'text-gray-500'
                    )}>
                        {achievement.name}
                    </h3>
                    
                    <p className={cn(
                        'text-sm leading-relaxed',
                        isUnlocked ? 'text-gray-600' : 'text-gray-400'
                    )}>
                        {achievement.description}
                    </p>

                    {/* XP Reward */}
                    <div className="flex items-center space-x-2">
                        <Zap className={cn(
                            'w-4 h-4',
                            isUnlocked ? 'text-yellow-500' : 'text-gray-400'
                        )} />
                        <span className={cn(
                            'text-sm font-semibold',
                            isUnlocked ? 'text-yellow-600' : 'text-gray-400'
                        )}>
                            +{achievement.xpReward} XP
                        </span>
                    </div>

                    {/* Progress Bar (if applicable) */}
                    {showProgress && achievement.maxProgress && achievement.maxProgress > 1 && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className={isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                                    Progress
                                </span>
                                <span className={isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                                    {progress}/{maxProgress}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className={cn(
                                        'h-full rounded-full',
                                        isUnlocked 
                                            ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                                            : 'bg-gray-300'
                                    )}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Unlock Date */}
                    {isUnlocked && achievement.unlockedAt && (
                        <div className="text-xs text-gray-500 mt-2">
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>

            {/* Sparkle Effects for Unlocked Achievements */}
            <AnimatePresence>
                {isUnlocked && isHovered && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                style={{
                                    top: `${20 + Math.random() * 60}%`,
                                    left: `${20 + Math.random() * 60}%`,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.2,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}