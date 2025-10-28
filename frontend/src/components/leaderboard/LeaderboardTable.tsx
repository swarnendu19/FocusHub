import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Medal,
    TrendingUp,
    TrendingDown,
    Minus,
    Crown,
    Star,
    Clock,
    Target,
    User
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { useUserStore } from '@/stores/userStore';
import { api } from '@/services';
import { formatDurationShort } from '@/utils/timeUtils';
import { UserProfilePreview, RankUpCelebration } from '@/components/leaderboard';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
    limit?: number;
    showPagination?: boolean;
    className?: string;
}

export function LeaderboardTable({
    timeframe = 'all-time',
    limit = 50,
    showPagination = true,
    className = ''
}: LeaderboardTableProps) {
    const {
        entries,
        currentUserEntry,
        isLoading,
        error,
        currentPage,
        hasMore,
        setEntries,
        setCurrentUserEntry,
        setLoading,
        setError,
        setCurrentPage,
        setHasMore,
        getRankChange
    } = useLeaderboardStore();

    const { user } = useUserStore();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
    const [showProfilePreview, setShowProfilePreview] = useState(false);
    const [rankUpCelebration, setRankUpCelebration] = useState<{
        show: boolean;
        oldRank: number;
        newRank: number;
        user: LeaderboardEntry;
    } | null>(null);

    const fetchLeaderboard = async (page = 1, append = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.leaderboard.get({
                limit,
                offset: (page - 1) * limit,
                timeframe
            });

            if (response.success && response.data) {
                const leaderboardData = response.data;

                if (append) {
                    // Add new entries for pagination
                    const newEntries = leaderboardData.data.map((entry, index) => ({
                        ...entry,
                        rank: (page - 1) * limit + index + 1
                    }));
                    setEntries([...entries, ...newEntries]);
                } else {
                    // Replace entries for new fetch
                    const rankedEntries = leaderboardData.data.map((entry, index) => ({
                        ...entry,
                        rank: index + 1
                    }));
                    setEntries(rankedEntries);
                }

                setHasMore(leaderboardData.hasMore);
                setCurrentPage(page);

                // Find current user in the leaderboard
                if (user) {
                    const userEntry = leaderboardData.data.find(entry => entry.userId === user.id);
                    if (userEntry) {
                        setCurrentUserEntry({
                            ...userEntry,
                            rank: leaderboardData.data.indexOf(userEntry) + 1 + (page - 1) * limit
                        });
                    } else if (!append) {
                        // If user not in current page, fetch their rank separately
                        try {
                            const rankResponse = await api.leaderboard.getUserRank(user.id);
                            if (rankResponse.success && rankResponse.data) {
                                setCurrentUserEntry({
                                    userId: user.id,
                                    username: user.username,
                                    avatar: user.avatar,
                                    totalTime: 0, // Will be updated with actual data
                                    level: user.level,
                                    rank: rankResponse.data.rank,
                                    weeklyTime: 0,
                                    monthlyTime: 0,
                                    xp: user.totalXP,
                                    tasksCompleted: user.tasksCompleted
                                });
                            }
                        } catch (rankError) {
                            console.error('Failed to fetch user rank:', rankError);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
            setError('Failed to load leaderboard. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [timeframe]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchLeaderboard();
    };

    const handleLoadMore = async () => {
        if (!isLoading && hasMore) {
            await fetchLeaderboard(currentPage + 1, true);
        }
    };

    const handleUserClick = (entry: LeaderboardEntry) => {
        setSelectedUser(entry);
        setShowProfilePreview(true);
    };

    const handleCloseProfilePreview = () => {
        setShowProfilePreview(false);
        setSelectedUser(null);
    };

    const handleCloseCelebration = () => {
        setRankUpCelebration(null);
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-500" />;
            case 2:
                return <Trophy className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Medal className="w-6 h-6 text-amber-600" />;
            default:
                return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
        }
    };

    const getRankChangeIcon = (change: number | null) => {
        if (change === null || change === 0) {
            return <Minus className="w-4 h-4 text-gray-400" />;
        }
        if (change > 0) {
            return <TrendingUp className="w-4 h-4 text-green-500" />;
        }
        return <TrendingDown className="w-4 h-4 text-red-500" />;
    };

    const getRankChangeText = (change: number | null) => {
        if (change === null || change === 0) return 'No change';
        if (change > 0) return `+${change}`;
        return `${change}`;
    };

    const getCardClassName = (entry: LeaderboardEntry) => {
        const baseClass = "p-4 transition-all duration-300 hover:shadow-lg";

        if (entry.userId === user?.id) {
            return `${baseClass} border-2 border-blue-300 bg-blue-50`;
        }

        if (entry.rank <= 3) {
            const colors = {
                1: 'border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50',
                2: 'border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50',
                3: 'border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50'
            };
            return `${baseClass} ${colors[entry.rank as keyof typeof colors]}`;
        }

        return `${baseClass} border border-gray-200 hover:border-gray-300`;
    };

    if (error) {
        return (
            <Card className="p-8 text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to Load Leaderboard
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={handleRefresh} disabled={refreshing}>
                    {refreshing ? 'Refreshing...' : 'Try Again'}
                </Button>
            </Card>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Current User Highlight */}
            {currentUserEntry && currentUserEntry.rank > 10 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Your Position</h3>
                    <Card className="p-4 border-2 border-blue-300 bg-blue-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {getRankIcon(currentUserEntry.rank)}
                                    <div className="flex items-center gap-1">
                                        {getRankChangeIcon(getRankChange(currentUserEntry.userId))}
                                        <span className="text-xs text-gray-500">
                                            {getRankChangeText(getRankChange(currentUserEntry.userId))}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {currentUserEntry.avatar ? (
                                        <img
                                            src={currentUserEntry.avatar}
                                            alt={currentUserEntry.username}
                                            className="w-10 h-10 rounded-full border-2 border-blue-300"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {currentUserEntry.username}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Level {currentUserEntry.level}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">
                                        {currentUserEntry.xp.toLocaleString()}
                                    </div>
                                    <div className="text-gray-500">XP</div>
                                </div>

                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">
                                        {formatDurationShort(currentUserEntry.totalTime)}
                                    </div>
                                    <div className="text-gray-500">Time</div>
                                </div>

                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">
                                        {currentUserEntry.tasksCompleted}
                                    </div>
                                    <div className="text-gray-500">Tasks</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Leaderboard Entries */}
            <div className="space-y-3">
                <AnimatePresence>
                    {entries.map((entry, index) => (
                        <motion.div
                            key={entry.userId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <Card
                                className={`${getCardClassName(entry)} cursor-pointer`}
                                onClick={() => handleUserClick(entry)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Rank and Change Indicator */}
                                        <div className="flex items-center gap-2 min-w-[80px]">
                                            {getRankIcon(entry.rank)}
                                            <div className="flex items-center gap-1">
                                                {getRankChangeIcon(getRankChange(entry.userId))}
                                                <span className="text-xs text-gray-500">
                                                    {getRankChangeText(getRankChange(entry.userId))}
                                                </span>
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex items-center gap-3">
                                            {entry.avatar ? (
                                                <img
                                                    src={entry.avatar}
                                                    alt={entry.username}
                                                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="w-6 h-6 text-gray-500" />
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {entry.username}
                                                    </h4>
                                                    {entry.userId === user?.id && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            You
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Level {entry.level}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                {entry.xp.toLocaleString()}
                                            </div>
                                            <div className="text-gray-500">XP</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                {formatDurationShort(entry.totalTime)}
                                            </div>
                                            <div className="text-gray-500">Time</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                                                <Target className="w-4 h-4 text-green-500" />
                                                {entry.tasksCompleted}
                                            </div>
                                            <div className="text-gray-500">Tasks</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar for Top 10 */}
                                {entry.rank <= 10 && entries.length > 0 && (
                                    <div className="mt-3">
                                        <ProgressBar
                                            value={(entry.xp / Math.max(...entries.map(e => e.xp))) * 100}
                                            className="h-2"
                                            color="primary"
                                            animated={true}
                                        />
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Load More Button */}
            {showPagination && hasMore && (
                <div className="text-center pt-6">
                    <Button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        variant="outline"
                        className="px-8"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && entries.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="text-gray-400 text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Rankings Yet
                    </h3>
                    <p className="text-gray-500">
                        Be the first to start tracking time and climb the leaderboard!
                    </p>
                </motion.div>
            )}

            {/* User Profile Preview Modal */}
            {selectedUser && (
                <UserProfilePreview
                    user={selectedUser}
                    isOpen={showProfilePreview}
                    onClose={handleCloseProfilePreview}
                />
            )}

            {/* Rank Up Celebration Modal */}
            {rankUpCelebration && (
                <RankUpCelebration
                    isVisible={rankUpCelebration.show}
                    onClose={handleCloseCelebration}
                    oldRank={rankUpCelebration.oldRank}
                    newRank={rankUpCelebration.newRank}
                    username={rankUpCelebration.user.username}
                    avatar={rankUpCelebration.user.avatar}
                    xpGained={100} // This would come from the actual rank change data
                />
            )}
        </div>
    );
}