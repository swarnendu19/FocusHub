import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { XPProgressBar, LevelUpModal, XPHistory } from '@/components/xp';
import { AchievementPreview } from '@/components/achievements';
import { Card } from '@/components/ui/card';
import { Trophy, Target, Zap, Calendar, Award } from 'lucide-react';

export function XP() {
    const { user, getAchievements, getRecentAchievements, getAchievementStats } = useUserStore();
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [levelUpData, setLevelUpData] = useState<{
        newLevel: number;
        previousLevel: number;
        xpGained: number;
    } | null>(null);

    // Get achievement data
    const achievements = getAchievements();
    const recentAchievements = getRecentAchievements(3);
    const achievementStats = getAchievementStats();

    const handleLevelUp = (newLevel: number) => {
        if (user) {
            setLevelUpData({
                newLevel,
                previousLevel: newLevel - 1,
                xpGained: 1000 // This would be calculated based on actual XP gained
            });
            setShowLevelUpModal(true);
        }
    };

    const handleViewAllAchievements = () => {
        // This would navigate to a dedicated achievements page
        // For now, we'll just scroll to achievements section
        console.log('Navigate to achievements page');
    };

    if (!user) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center h-64"
            >
                <p className="text-gray-600">Please log in to view your XP progress.</p>
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
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    XP & Achievements
                </h1>
                <p className="text-gray-600">
                    Level up and unlock achievements for your productivity!
                </p>
            </div>

            {/* XP Progress Section */}
            <Card className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
                </div>
                <XPProgressBar onLevelUp={handleLevelUp} />
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Level Stats */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Trophy className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Current Level</h3>
                                <p className="text-sm text-gray-600">Your productivity rank</p>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            Level {user.level}
                        </div>
                        <p className="text-sm text-gray-600">
                            {user.xpToNextLevel.toLocaleString()} XP to next level
                        </p>
                    </Card>
                </motion.div>

                {/* Total XP Stats */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Zap className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Total XP</h3>
                                <p className="text-sm text-gray-600">Lifetime experience</p>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                            {user.totalXP.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">
                            Current level: {user.currentXP.toLocaleString()} XP
                        </p>
                    </Card>
                </motion.div>

                {/* Tasks Completed Stats */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Tasks Completed</h3>
                                <p className="text-sm text-gray-600">Productivity achievements</p>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {user.tasksCompleted.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">
                            Active tasks: {user.tasks.length}
                        </p>
                    </Card>
                </motion.div>
            </div>

            {/* Achievement Preview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <AchievementPreview
                    recentAchievements={recentAchievements}
                    totalAchievements={achievementStats.total}
                    unlockedCount={achievementStats.unlocked}
                    onViewAll={handleViewAllAchievements}
                />
            </motion.div>

            {/* XP History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <XPHistory />
            </motion.div>

            {/* Level Up Modal */}
            {levelUpData && (
                <LevelUpModal
                    isOpen={showLevelUpModal}
                    onClose={() => setShowLevelUpModal(false)}
                    newLevel={levelUpData.newLevel}
                    previousLevel={levelUpData.previousLevel}
                    xpGained={levelUpData.xpGained}
                />
            )}
        </motion.div>
    );
}