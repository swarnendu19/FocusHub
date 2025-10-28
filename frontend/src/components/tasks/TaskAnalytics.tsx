import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Clock,
    Target,
    Calendar,
    Filter,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';
import { formatDurationShort } from '@/utils/timeUtils';
import { isToday, isThisWeek } from '@/utils/time';

interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    totalTimeSpent: number;
    averageTaskTime: number;
    totalXPEarned: number;
    completionRate: number;
}

interface PriorityStats {
    high: { total: number; completed: number; timeSpent: number };
    medium: { total: number; completed: number; timeSpent: number };
    low: { total: number; completed: number; timeSpent: number };
}

interface TimeframeStats {
    today: TaskStats;
    thisWeek: TaskStats;
    allTime: TaskStats;
}

type TimeframeFilter = 'today' | 'thisWeek' | 'allTime';

export function TaskAnalytics() {
    const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeFilter>('thisWeek');
    const { user } = useUserStore();
    const { sessions } = useTimerStore();

    const timeframeOptions = [
        { id: 'today' as const, label: 'Today', icon: <Calendar className="w-4 h-4" /> },
        { id: 'thisWeek' as const, label: 'This Week', icon: <Calendar className="w-4 h-4" /> },
        { id: 'allTime' as const, label: 'All Time', icon: <BarChart3 className="w-4 h-4" /> },
    ];

    const calculateTaskStats = (tasks: any[], timeframe: TimeframeFilter): TaskStats => {
        let filteredTasks = tasks;

        if (timeframe === 'today') {
            filteredTasks = tasks.filter(task => isToday(new Date(task.createdAt)));
        } else if (timeframe === 'thisWeek') {
            filteredTasks = tasks.filter(task => isThisWeek(new Date(task.createdAt)));
        }

        const completedTasks = filteredTasks.filter(task => task.completed);
        const totalTimeSpent = filteredTasks.reduce((sum, task) => sum + task.timeSpent, 0);
        const totalXPEarned = completedTasks.reduce((sum, task) => sum + task.xpReward, 0);

        return {
            totalTasks: filteredTasks.length,
            completedTasks: completedTasks.length,
            activeTasks: filteredTasks.length - completedTasks.length,
            totalTimeSpent,
            averageTaskTime: filteredTasks.length > 0 ? totalTimeSpent / filteredTasks.length : 0,
            totalXPEarned,
            completionRate: filteredTasks.length > 0 ? (completedTasks.length / filteredTasks.length) * 100 : 0,
        };
    };

    const calculatePriorityStats = (tasks: any[]): PriorityStats => {
        const stats: PriorityStats = {
            high: { total: 0, completed: 0, timeSpent: 0 },
            medium: { total: 0, completed: 0, timeSpent: 0 },
            low: { total: 0, completed: 0, timeSpent: 0 },
        };

        tasks.forEach(task => {
            const priority = task.priority as keyof PriorityStats;
            if (stats[priority]) {
                stats[priority].total++;
                stats[priority].timeSpent += task.timeSpent;
                if (task.completed) {
                    stats[priority].completed++;
                }
            }
        });

        return stats;
    };

    const allTasks = user ? [...user.tasks, ...user.completedTasks] : [];

    const timeframeStats: TimeframeStats = useMemo(() => ({
        today: calculateTaskStats(allTasks, 'today'),
        thisWeek: calculateTaskStats(allTasks, 'thisWeek'),
        allTime: calculateTaskStats(allTasks, 'allTime'),
    }), [allTasks]);

    const currentStats = timeframeStats[selectedTimeframe];
    const priorityStats = useMemo(() => calculatePriorityStats(allTasks), [allTasks]);

    const topTags = useMemo(() => {
        const tagCounts: Record<string, number> = {};
        allTasks.forEach(task => {
            task.tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tag, count]) => ({ tag, count }));
    }, [allTasks]);

    const StatCard = ({
        title,
        value,
        subtitle,
        icon,
        color = 'text-blue-600',
        delay = 0
    }: {
        title: string;
        value: string | number;
        subtitle?: string;
        icon: React.ReactNode;
        color?: string;
        delay?: number;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <motion.p
                            className="text-2xl font-bold text-gray-900 mt-1"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay + 0.2, type: "spring" }}
                        >
                            {value}
                        </motion.p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-100 ${color}`}>
                        {icon}
                    </div>
                </div>
            </Card>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Task Analytics
                    </h2>
                    <p className="text-gray-600">
                        Insights into your productivity and task completion patterns
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Timeframe:</span>
                <div className="flex gap-1">
                    {timeframeOptions.map((option) => (
                        <Button
                            key={option.id}
                            variant={selectedTimeframe === option.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTimeframe(option.id)}
                            className="flex items-center gap-2"
                        >
                            {option.icon}
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tasks"
                    value={currentStats.totalTasks}
                    subtitle={`${currentStats.activeTasks} active`}
                    icon={<Target className="w-6 h-6" />}
                    color="text-blue-600"
                    delay={0}
                />

                <StatCard
                    title="Completed"
                    value={currentStats.completedTasks}
                    subtitle={`${Math.round(currentStats.completionRate)}% completion rate`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="text-green-600"
                    delay={0.1}
                />

                <StatCard
                    title="Time Spent"
                    value={formatDurationShort(currentStats.totalTimeSpent)}
                    subtitle={`${formatDurationShort(currentStats.averageTaskTime)} avg per task`}
                    icon={<Clock className="w-6 h-6" />}
                    color="text-purple-600"
                    delay={0.2}
                />

                <StatCard
                    title="XP Earned"
                    value={currentStats.totalXPEarned}
                    subtitle="Experience points"
                    icon={<BarChart3 className="w-6 h-6" />}
                    color="text-yellow-600"
                    delay={0.3}
                />
            </div>

            {/* Priority Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Priority Breakdown</h3>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(priorityStats).map(([priority, stats], index) => {
                            const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                            const priorityColors = {
                                high: { bg: 'bg-red-100', text: 'text-red-700', progress: 'bg-red-500' },
                                medium: { bg: 'bg-orange-100', text: 'text-orange-700', progress: 'bg-orange-500' },
                                low: { bg: 'bg-green-100', text: 'text-green-700', progress: 'bg-green-500' },
                            };
                            const colors = priorityColors[priority as keyof typeof priorityColors];

                            return (
                                <motion.div
                                    key={priority}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge className={`${colors.bg} ${colors.text} border-0`}>
                                                {priority === 'high' ? '🔥' : priority === 'medium' ? '⚡' : '🌱'} {priority}
                                            </Badge>
                                            <span className="text-sm text-gray-600">
                                                {stats.completed}/{stats.total} completed
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-gray-900">
                                                {Math.round(completionRate)}%
                                            </span>
                                            <p className="text-xs text-gray-500">
                                                {formatDurationShort(stats.timeSpent)}
                                            </p>
                                        </div>
                                    </div>
                                    <ProgressBar
                                        value={completionRate}
                                        className="h-2"
                                        color="primary"
                                        animated={true}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>

            {/* Top Tags */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Most Used Tags</h3>
                    </div>

                    {topTags.length > 0 ? (
                        <div className="space-y-3">
                            {topTags.map(({ tag, count }, index) => (
                                <motion.div
                                    key={tag}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-sm">
                                            #{tag}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24">
                                            <ProgressBar
                                                value={(count / Math.max(...topTags.map(t => t.count))) * 100}
                                                className="h-2"
                                                color="secondary"
                                                animated={true}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 w-8 text-right">
                                            {count}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-4">🏷️</div>
                            <h4 className="text-lg font-semibold text-gray-600 mb-2">
                                No tags yet
                            </h4>
                            <p className="text-gray-500">
                                Start adding tags to your tasks to see analytics here
                            </p>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Empty State */}
            {currentStats.totalTasks === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No data for {timeframeOptions.find(opt => opt.id === selectedTimeframe)?.label}
                    </h3>
                    <p className="text-gray-500">
                        Create and complete some tasks to see your analytics here
                    </p>
                </motion.div>
            )}
        </div>
    );
}