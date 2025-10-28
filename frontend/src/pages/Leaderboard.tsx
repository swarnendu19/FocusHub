import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeaderboardTable, LeaderboardFilters, LeaderboardPodium, CommunityAnalytics } from '@/components/leaderboard';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { useUserStore } from '@/stores/userStore';

export function Leaderboard() {
    const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time');
    const [showPodium, setShowPodium] = useState(true);

    const { entries, isLoading, getTotalUsers, getTopUsers } = useLeaderboardStore();
    const { user } = useUserStore();

    const topUsers = getTopUsers(3);
    const totalUsers = getTotalUsers();

    const handleRefresh = () => {
        // Refresh will be handled by the LeaderboardTable component
        window.location.reload();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Leaderboard
                    </h1>
                    <p className="text-gray-600">
                        See how you rank against other productive warriors!
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <Badge variant="outline" className="text-gray-600">
                            {totalUsers} competitors
                        </Badge>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <LeaderboardFilters
                selectedTimeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
                totalUsers={totalUsers}
            />

            {/* Toggle Podium View */}
            <div className="flex items-center gap-2">
                <Button
                    variant={showPodium ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPodium(!showPodium)}
                    className="flex items-center gap-2"
                >
                    <TrendingUp className="w-4 h-4" />
                    {showPodium ? 'Hide' : 'Show'} Podium
                </Button>
            </div>

            {/* Podium View */}
            {showPodium && topUsers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LeaderboardPodium
                        topUsers={topUsers}
                        currentUserId={user?.id}
                    />
                </motion.div>
            )}

            {/* Leaderboard Table */}
            <LeaderboardTable
                timeframe={selectedTimeframe}
                limit={50}
                showPagination={true}
            />

            {/* Stats Summary */}
            {!isLoading && entries.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200"
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {entries.reduce((sum, entry) => sum + entry.xp, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total XP Earned</div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {Math.round(entries.reduce((sum, entry) => sum + entry.totalTime, 0) / 3600000)}h
                        </div>
                        <div className="text-sm text-gray-600">Total Time Tracked</div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {entries.reduce((sum, entry) => sum + entry.tasksCompleted, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Tasks Completed</div>
                    </div>
                </motion.div>
            )}

            {/* Community Analytics */}
            <CommunityAnalytics />
        </motion.div>
    );
}