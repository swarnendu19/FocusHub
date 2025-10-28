import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';
import type { Achievement } from '@/types';

interface AchievementPreviewProps {
    recentAchievements?: Achievement[];
    totalAchievements?: number;
    unlockedCount?: number;
    onViewAll?: () => void;
    className?: string;
}

export function AchievementPreview({
    recentAchievements,
    totalAchievements,
    unlockedCount,
    onViewAll,
    className
}: AchievementPreviewProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { user, getRecentAchievements, getAchievementStats } = useUserStore();
    const navigate = useNavigate();

    // Use provided props or get from store
    const achievements = recentAchievements || (user ? getRecentAchievements(3) : []);
    const stats = user ? getAchievementStats() : { total: 0, unlocked: 0, totalXP: 0, rarityStats: {}, completionPercentage: 0 };
    const total = totalAchievements ?? stats.total;
    const unlocked = unlockedCount ?? stats.unlocked;
    const handleViewAll = onViewAll || (() => navigate('/achievements'));

    const completionPercentage = total > 0 ? (unlocked / total) * 100 : 0;

    // Don't render if no user
    if (!user) {
        return null;
    }

    const getRarityColor = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common':
                return 'text-gray-600 bg-gray-100';
            case 'rare':
                return 'text-blue-600 bg-blue-100';
            case 'epic':
                return 'text-purple-600 bg-purple-100';
            case 'legendary':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
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

    return (
        <Card className={`p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                        <p className="text-sm text-gray-600">
                            {unlocked} of {total} unlocked
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={handleViewAll}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round(completionPercentage)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Recent Achievements */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Unlocks</h4>

                {achievements.length === 0 ? (
                    <div className="text-center py-8">
                        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No achievements unlocked yet</p>
                        <p className="text-gray-400 text-xs mt-1">Complete tasks to earn your first achievement!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {achievements.slice(0, 3).map((achievement, index) => {
                            const IconComponent = getIcon(achievement.icon);

                            return (
                                <motion.div
                                    key={achievement.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    onHoverStart={() => setHoveredIndex(index)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {/* Achievement Icon */}
                                    <motion.div
                                        className={`p-2 rounded-full ${getRarityColor(achievement.rarity)}`}
                                        animate={{
                                            scale: hoveredIndex === index ? 1.1 : 1,
                                            rotate: hoveredIndex === index ? [0, -5, 5, 0] : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </motion.div>

                                    {/* Achievement Info */}
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-medium text-gray-900 truncate">
                                            {achievement.name}
                                        </h5>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRarityColor(achievement.rarity)}`}>
                                                {achievement.rarity}
                                            </span>
                                            <div className="flex items-center space-x-1 text-xs text-yellow-600">
                                                <Zap className="w-3 h-3" />
                                                <span>+{achievement.xpReward}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unlock Date */}
                                    {achievement.unlockedAt && (
                                        <div className="text-xs text-gray-500">
                                            {achievement.unlockedAt.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    )}

                                    {/* Sparkle Effect */}
                                    <AnimatePresence>
                                        {hoveredIndex === index && (
                                            <>
                                                {[...Array(3)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                                        style={{
                                                            top: `${30 + Math.random() * 40}%`,
                                                            left: `${20 + Math.random() * 60}%`,
                                                        }}
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{
                                                            scale: [0, 1, 0],
                                                            opacity: [0, 1, 0],
                                                            y: [0, -10, -20]
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            delay: i * 0.2,
                                                            ease: 'easeOut'
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* View All Button */}
            {achievements.length > 0 && (
                <motion.div
                    className="mt-4 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button
                        variant="outline"
                        onClick={handleViewAll}
                        className="w-full flex items-center justify-center space-x-2"
                    >
                        <Trophy className="w-4 h-4" />
                        <span>View All Achievements</span>
                    </Button>
                </motion.div>
            )}
        </Card>
    );
}