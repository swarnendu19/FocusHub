import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Star,
    Clock,
    Target,
    Trophy,
    Calendar,
    TrendingUp,
    Award,
    Flame,
    X,
    ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress';
import { api } from '@/services';
import { formatDurationShort, formatDate } from '@/utils/timeUtils';
import type { LeaderboardEntry, Achievement } from '@/types';

interface UserProfilePreviewProps {
    user: LeaderboardEntry;
    isOpen: boolean;
    onClose: () => void;
    onViewFullProfile?: (userId: string) => void;
}

interface UserStats {
    totalTime: number;
    sessionsCount: number;
    averageSessionTime: number;
    xpEarned: number;
    tasksCompleted: number;
    streakDays: number;
}

interface UserAchievements {
    achievements: Achievement[];
    totalCount: number;
}

export function UserProfilePreview({
    user,
    isOpen,
    onClose,
    onViewFullProfile
}: UserProfilePreviewProps) {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [userAchievements, setUserAchievements] = useState<UserAchievements | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && user) {
            fetchUserData();
        }
    }, [isOpen, user]);

    const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch user stats
            const statsResponse = await api.analytics.getUserStats(user.userId, {
                timeframe: 'monthly'
            });

            if (statsResponse.success && statsResponse.data) {
                setUserStats(statsResponse.data);
            }

            // Fetch user achievements
            const achievementsResponse = await api.achievements.getUserAchievements(user.userId);

            if (achievementsResponse.success && achievementsResponse.data) {
                setUserAchievements({
                    achievements: achievementsResponse.data.slice(0, 6), // Show only first 6
                    totalCount: achievementsResponse.data.length
                });
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            setError('Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (rank === 2) return 'text-gray-600 bg-gray-50 border-gray-200';
        if (rank === 3) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const getAchievementRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return 'text-purple-600 bg-purple-100';
            case 'epic': return 'text-indigo-600 bg-indigo-100';
            case 'rare': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <Card className="p-6 relative">
                            {/* Close Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10"
                            >
                                <X className="w-4 h-4" />
                            </Button>

                            {/* Header */}
                            <div className="flex items-start gap-4 mb-6">
                                {/* Avatar */}
                                <div className="relative">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    {/* Rank Badge */}
                                    <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold border ${getRankColor(user.rank)}`}>
                                        #{user.rank}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {user.username}
                                        </h2>
                                        {getRankIcon(user.rank)}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>Level {user.level}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="w-4 h-4 text-blue-500" />
                                            <span>{user.xp.toLocaleString()} XP</span>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-gray-900">
                                                {formatDurationShort(user.totalTime)}
                                            </div>
                                            <div className="text-xs text-gray-500">Total Time</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-gray-900">
                                                {user.tasksCompleted}
                                            </div>
                                            <div className="text-xs text-gray-500">Tasks Done</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-gray-900">
                                                {formatDurationShort(user.weeklyTime)}
                                            </div>
                                            <div className="text-xs text-gray-500">This Week</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="text-center py-8">
                                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-gray-600">Loading profile data...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="text-center py-8">
                                    <div className="text-red-500 text-4xl mb-2">⚠️</div>
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Detailed Stats */}
                            {!isLoading && !error && userStats && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Monthly Stats */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            This Month
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">
                                                    {userStats.sessionsCount}
                                                </div>
                                                <div className="text-xs text-gray-500">Sessions</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Target className="w-4 h-4 text-green-500" />
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">
                                                    {formatDurationShort(userStats.averageSessionTime)}
                                                </div>
                                                <div className="text-xs text-gray-500">Avg Session</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">
                                                    {userStats.xpEarned.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">XP Earned</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Flame className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">
                                                    {userStats.streakDays}
                                                </div>
                                                <div className="text-xs text-gray-500">Day Streak</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    {userAchievements && userAchievements.achievements.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Award className="w-5 h-5 text-purple-500" />
                                                Recent Achievements
                                                <Badge variant="secondary" className="text-xs">
                                                    {userAchievements.totalCount} total
                                                </Badge>
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {userAchievements.achievements.map((achievement) => (
                                                    <motion.div
                                                        key={achievement.id}
                                                        whileHover={{ scale: 1.05 }}
                                                        className="p-3 bg-gray-50 rounded-lg text-center"
                                                    >
                                                        <div className="text-2xl mb-2">{achievement.icon}</div>
                                                        <div className="font-semibold text-sm text-gray-900 mb-1">
                                                            {achievement.name}
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-xs ${getAchievementRarityColor(achievement.rarity)}`}
                                                        >
                                                            {achievement.rarity}
                                                        </Badge>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Progress Comparison */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            Progress Overview
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Level Progress</span>
                                                    <span className="text-gray-900 font-medium">
                                                        Level {user.level}
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    value={75} // This would be calculated based on XP to next level
                                                    className="h-2"
                                                    color="primary"
                                                    animated={true}
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Weekly Goal</span>
                                                    <span className="text-gray-900 font-medium">
                                                        {Math.round((user.weeklyTime / (40 * 3600000)) * 100)}%
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    value={Math.min((user.weeklyTime / (40 * 3600000)) * 100, 100)}
                                                    className="h-2"
                                                    color="success"
                                                    animated={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                                        {onViewFullProfile && (
                                            <Button
                                                onClick={() => onViewFullProfile(user.userId)}
                                                className="flex-1 flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View Full Profile
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={onClose}
                                            className="flex-1"
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}