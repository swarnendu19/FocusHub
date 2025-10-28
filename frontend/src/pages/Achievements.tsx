import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import {
    AchievementGrid,
    AchievementUnlockNotification,
    useAchievementNotification,
    AchievementCategories,
    AchievementProgressTracker
} from '@/components/achievements';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Award, Zap, Target, Clock, TrendingUp } from 'lucide-react';

export function Achievements() {
    const { user, getAchievements, getAchievementStats, unlockAchievement } = useUserStore();
    const { notification, showAchievementUnlock, hideNotification } = useAchievementNotification();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const achievements = getAchievements();
    const stats = getAchievementStats();
    const unlockedAchievements = user?.unlockedBadges || [];

    // Filter achievements based on selected category
    const filteredAchievements = React.useMemo(() => {
        if (selectedCategory === 'all') return achievements;

        const categoryMap: Record<string, string[]> = {
            'time-tracking': ['first-timer', 'hour-warrior', 'marathon-tracker', 'time-master', 'early-bird', 'night-owl'],
            'task-completion': ['task-starter', 'productive-day', 'task-machine', 'completion-legend', 'weekend-warrior', 'perfectionist'],
            'streaks': ['streak-starter', 'week-warrior', 'consistency-king', 'unstoppable-force'],
            'experience': ['xp-collector', 'level-climber', 'experience-master', 'legendary-achiever'],
            'special': achievements.filter(a => a.rarity === 'legendary' || ['early-bird', 'night-owl', 'weekend-warrior', 'perfectionist'].includes(a.id)).map(a => a.id)
        };

        return achievements.filter(achievement =>
            categoryMap[selectedCategory]?.includes(achievement.id) || false
        );
    }, [achievements, selectedCategory]);

    // Demo function to test achievement unlock
    const handleTestUnlock = () => {
        const lockedAchievements = achievements.filter(a => !unlockedAchievements.includes(a.id));
        if (lockedAchievements.length > 0) {
            const randomAchievement = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
            unlockAchievement(randomAchievement.id);
            showAchievementUnlock(randomAchievement);
        }
    };

    if (!user) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center h-64"
            >
                <p className="text-gray-600">Please log in to view your achievements.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Achievements
                    </h1>
                    <p className="text-gray-600">
                        Unlock badges and earn XP by completing productivity milestones!
                    </p>
                </div>

                {/* Demo Button - Remove in production */}
                <Button
                    onClick={handleTestUnlock}
                    variant="outline"
                    className="flex items-center space-x-2"
                >
                    <Trophy className="w-4 h-4" />
                    <span>Test Unlock</span>
                </Button>
            </div>

            {/* Achievement Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Trophy className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Total Progress</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                            {stats.unlocked}/{stats.total}
                        </div>
                        <div className="text-xs text-blue-600">
                            {Math.round(stats.completionPercentage)}% Complete
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">XP from Achievements</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-900">
                            {stats.totalXP.toLocaleString()}
                        </div>
                        <div className="text-xs text-yellow-600">
                            Bonus experience earned
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Star className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Rare+</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                            {stats.rarityStats.rare + stats.rarityStats.epic + stats.rarityStats.legendary}
                        </div>
                        <div className="text-xs text-purple-600">
                            Special achievements
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Legendary</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                            {stats.rarityStats.legendary}
                        </div>
                        <div className="text-xs text-green-600">
                            Ultimate achievements
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Achievement Progress Tracker */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <AchievementProgressTracker
                    achievements={achievements}
                    unlockedAchievements={unlockedAchievements}
                />
            </motion.div>

            {/* Achievement Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Target className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Achievement Categories</h3>
                    </div>
                    <AchievementCategories
                        achievements={achievements}
                        unlockedAchievements={unlockedAchievements}
                        onCategorySelect={setSelectedCategory}
                        selectedCategory={selectedCategory}
                    />
                </Card>
            </motion.div>

            {/* Rarity Breakdown */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Trophy className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{stats.rarityStats.common}</div>
                        <div className="text-sm text-gray-600">Common</div>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-blue-900">{stats.rarityStats.rare}</div>
                        <div className="text-sm text-blue-600">Rare</div>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Zap className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-lg font-bold text-purple-900">{stats.rarityStats.epic}</div>
                        <div className="text-sm text-purple-600">Epic</div>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="text-lg font-bold text-yellow-900">{stats.rarityStats.legendary}</div>
                        <div className="text-sm text-yellow-600">Legendary</div>
                    </div>
                </div>
            </Card>

            {/* Achievement Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <AchievementGrid
                    achievements={filteredAchievements}
                    unlockedAchievements={unlockedAchievements}
                />
            </motion.div>

            {/* Achievement Unlock Notification */}
            <AchievementUnlockNotification
                achievement={notification.achievement}
                isVisible={notification.isVisible}
                onComplete={hideNotification}
            />
        </motion.div>
    );
}