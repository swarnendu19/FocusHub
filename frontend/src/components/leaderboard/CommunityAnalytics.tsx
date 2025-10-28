import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Clock,
    Target,
    TrendingUp,
    Star,
    Calendar,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { api } from '@/services';
import { formatDurationShort } from '@/utils/timeUtils';

interface GlobalStats {
    totalUsers: number;
    totalTime: number;
    totalSessions: number;
    averageSessionTime: number;
}

interface CommunityAnalyticsProps {
    className?: string;
}

export function CommunityAnalytics({ className = '' }: CommunityAnalyticsProps) {
    const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    useEffect(() => {
        fetchGlobalStats();
    }, []);

    const fetchGlobalStats = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.analytics.getGlobalStats();

            if (response.success && response.data) {
                setGlobalStats(response.data);
            } else {
                setError('Failed to load community stats');
            }
        } catch (err) {
            console.error('Failed to fetch global stats:', err);
            setError('Failed to load community stats');
        } finally {
            setIsLoading(false);
        }
    };

    const getProductivityInsights = () => {
        if (!globalStats) return [];

        const avgHoursPerUser = globalStats.totalTime / globalStats.totalUsers / 3600000;
        const avgSessionsPerUser = globalStats.totalSessions / globalStats.totalUsers;

        return [
            {
                title: 'Community Productivity',
                value: `${avgHoursPerUser.toFixed(1)}h`,
                description: 'Average hours per user',
                icon: <Clock className="w-5 h-5 text-blue-500" />,
                trend: '+12%',
                positive: true
            },
            {
                title: 'Session Quality',
                value: formatDurationShort(globalStats.averageSessionTime),
                description: 'Average session length',
                icon: <Target className="w-5 h-5 text-green-500" />,
                trend: '+8%',
                positive: true
            },
            {
                title: 'Engagement Rate',
                value: `${avgSessionsPerUser.toFixed(1)}`,
                description: 'Sessions per user',
                icon: <Activity className="w-5 h-5 text-purple-500" />,
                trend: '+15%',
                positive: true
            }
        ];
    };

    if (isLoading) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={`p-6 text-center ${className}`}>
                <div className="text-red-500 text-4xl mb-2">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analytics Unavailable
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchGlobalStats} variant="outline" size="sm">
                    Try Again
                </Button>
            </Card>
        );
    }

    const insights = getProductivityInsights();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-500" />
                        Community Analytics
                    </h2>
                    <p className="text-gray-600">
                        See how our productive community is performing
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map((timeframe) => (
                        <Button
                            key={timeframe}
                            variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTimeframe(timeframe)}
                            className="capitalize"
                        >
                            {timeframe}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Global Stats Overview */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Community Overview
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                            {globalStats?.totalUsers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Active Users</div>
                        <div className="text-xs text-green-600 mt-1">+23 this week</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                            {Math.round((globalStats?.totalTime || 0) / 3600000).toLocaleString()}h
                        </div>
                        <div className="text-sm text-gray-600">Total Time</div>
                        <div className="text-xs text-green-600 mt-1">+1.2k hours</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                            {globalStats?.totalSessions.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Sessions</div>
                        <div className="text-xs text-green-600 mt-1">+156 today</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-1">
                            {formatDurationShort(globalStats?.averageSessionTime || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Avg Session</div>
                        <div className="text-xs text-green-600 mt-1">+5min</div>
                    </div>
                </div>
            </Card>

            {/* Productivity Insights */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Productivity Insights
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {insights.map((insight, index) => (
                        <motion.div
                            key={insight.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 rounded-lg p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                {insight.icon}
                                <Badge
                                    variant="secondary"
                                    className={`text-xs ${insight.positive
                                            ? 'text-green-700 bg-green-100'
                                            : 'text-red-700 bg-red-100'
                                        }`}
                                >
                                    {insight.trend}
                                </Badge>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {insight.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {insight.description}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Community Milestones */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Community Milestones
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">1,000 Users Milestone</div>
                                <div className="text-sm text-gray-600">Reached this week!</div>
                            </div>
                        </div>
                        <Badge className="bg-yellow-500 text-white">New!</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">100,000 Hours Tracked</div>
                                <div className="text-sm text-gray-600">Community achievement unlocked</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-blue-600">92%</div>
                            <ProgressBar value={92} className="w-20 h-2 mt-1" color="primary" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">1M Tasks Completed</div>
                                <div className="text-sm text-gray-600">Next milestone</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-600">67%</div>
                            <ProgressBar value={67} className="w-20 h-2 mt-1" color="secondary" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Activity Heatmap Preview */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Community Activity
                </h3>

                <div className="text-center py-8 text-gray-500">
                    <PieChart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Activity heatmap and detailed charts</p>
                    <p className="text-sm">Coming soon in full analytics dashboard</p>
                </div>
            </Card>
        </motion.div>
    );
}