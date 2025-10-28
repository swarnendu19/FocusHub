import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Clock, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Achievement } from '@/types';

interface AchievementProgressTrackerProps {
    achievements: Achievement[];
    unlockedAchievements: string[];
    className?: string;
}

interface ProgressAchievement extends Achievement {
    progressPercentage: number;
    isNearCompletion: boolean;
    estimatedTimeToComplete?: string;
}

export function AchievementProgressTracker({
    achievements,
    unlockedAchievements,
    className
}: AchievementProgressTrackerProps) {
    const [inProgressAchievements, setInProgressAchievements] = useState<ProgressAchievement[]>([]);
    const [selectedAchievement, setSelectedAchievement] = useState<ProgressAchievement | null>(null);

    useEffect(() => {
        // Filter and process achievements that are in progress
        const progressAchievements = achievements
            .filter(achievement => {
                // Skip already unlocked achievements
                if (unlockedAchievements.includes(achievement.id)) return false;

                // Only show achievements with progress > 0
                const progress = achievement.progress || 0;
                const maxProgress = achievement.maxProgress || 1;
                return progress > 0 && progress < maxProgress;
            })
            .map(achievement => {
                const progress = achievement.progress || 0;
                const maxProgress = achievement.maxProgress || 1;
                const progressPercentage = (progress / maxProgress) * 100;
                const isNearCompletion = progressPercentage >= 75;

                return {
                    ...achievement,
                    progressPercentage,
                    isNearCompletion,
                    estimatedTimeToComplete: getEstimatedTime(achievement, progress, maxProgress)
                };
            })
            .sort((a, b) => b.progressPercentage - a.progressPercentage); // Sort by progress descending

        setInProgressAchievements(progressAchievements);
    }, [achievements, unlockedAchievements]);

    const getEstimatedTime = (achievement: Achievement, progress: number, maxProgress: number): string => {
        const remaining = maxProgress - progress;

        // Simple estimation based on achievement type
        switch (achievement.id) {
            case 'task-machine':
            case 'completion-legend':
                return `${remaining} more tasks`;
            case 'streak-starter':
            case 'week-warrior':
            case 'consistency-king':
            case 'unstoppable-force':
                return `${remaining} more days`;
            case 'xp-collector':
            case 'level-climber':
            case 'experience-master':
            case 'legendary-achiever':
                return remaining > 1000 ? `${Math.round(remaining / 1000)}k more XP` : `${remaining} more XP`;
            default:
                return `${remaining} more to go`;
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

    const getRarityColor = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common':
                return 'text-gray-600 bg-gray-100 border-gray-200';
            case 'rare':
                return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'epic':
                return 'text-purple-600 bg-purple-100 border-purple-200';
            case 'legendary':
                return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    if (inProgressAchievements.length === 0) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements in Progress</h3>
                    <p className="text-gray-600">Complete more tasks to start working towards achievements!</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className={`p-6 ${className}`}>
            <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Achievement Progress</h3>
                <span className="text-sm text-gray-500">({inProgressAchievements.length} in progress)</span>
            </div>

            <div className="space-y-4">
                {inProgressAchievements.slice(0, 5).map((achievement, index) => {
                    const IconComponent = getIcon(achievement.icon);
                    const rarityColors = getRarityColor(achievement.rarity);

                    return (
                        <motion.div
                            key={achievement.id}
                            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedAchievement(achievement)}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-start space-x-3">
                                {/* Achievement Icon */}
                                <motion.div
                                    className={`p-2 rounded-lg ${rarityColors} border flex-shrink-0`}
                                    animate={{
                                        scale: achievement.isNearCompletion ? [1, 1.1, 1] : 1
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: achievement.isNearCompletion ? Infinity : 0,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <IconComponent className="w-5 h-5" />
                                </motion.div>

                                {/* Achievement Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900 truncate">
                                            {achievement.name}
                                        </h4>
                                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                            {achievement.isNearCompletion && (
                                                <motion.div
                                                    className="flex items-center space-x-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full"
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    <Award className="w-3 h-3" />
                                                    <span>Almost there!</span>
                                                </motion.div>
                                            )}
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${rarityColors}`}>
                                                {achievement.rarity}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {achievement.description}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>
                                                {achievement.progress}/{achievement.maxProgress}
                                            </span>
                                            <span>{Math.round(achievement.progressPercentage)}%</span>
                                        </div>
                                        <Progress
                                            value={achievement.progressPercentage}
                                            className="h-2"
                                            color={achievement.isNearCompletion ? 'warning' : 'primary'}
                                            animated={achievement.isNearCompletion}
                                        />
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500">
                                                {achievement.estimatedTimeToComplete}
                                            </span>
                                            <div className="flex items-center space-x-1 text-yellow-600">
                                                <Zap className="w-3 h-3" />
                                                <span>+{achievement.xpReward} XP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Show More Button */}
            {inProgressAchievements.length > 5 && (
                <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View {inProgressAchievements.length - 5} more in progress
                    </button>
                </motion.div>
            )}

            {/* Achievement Detail Modal */}
            <AnimatePresence>
                {selectedAchievement && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedAchievement(null)}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className={`inline-flex p-4 rounded-full ${getRarityColor(selectedAchievement.rarity)} mb-4`}>
                                    {React.createElement(getIcon(selectedAchievement.icon), { className: "w-8 h-8" })}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {selectedAchievement.name}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {selectedAchievement.description}
                                </p>
                                <div className="space-y-3">
                                    <Progress
                                        value={selectedAchievement.progressPercentage}
                                        className="h-3"
                                        color={selectedAchievement.isNearCompletion ? 'warning' : 'primary'}
                                        animated={selectedAchievement.isNearCompletion}
                                        showLabel
                                    />
                                    <div className="text-sm text-gray-600">
                                        {selectedAchievement.estimatedTimeToComplete}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}