import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Trophy, Zap, Filter, ChevronDown } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface XPHistoryEntry {
    id: string;
    date: Date;
    xpGained: number;
    reason: string;
    type: 'task' | 'milestone' | 'streak' | 'bonus';
    taskTitle?: string;
}

interface XPHistoryProps {
    className?: string;
}

export function XPHistory({ className }: XPHistoryProps) {
    const { user } = useUserStore();
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'task' | 'milestone' | 'streak' | 'bonus'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [visibleEntries, setVisibleEntries] = useState(10);

    // Generate mock XP history data (in a real app, this would come from the backend)
    const xpHistory = useMemo<XPHistoryEntry[]>(() => {
        if (!user) return [];

        const mockHistory: XPHistoryEntry[] = [
            {
                id: '1',
                date: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                xpGained: 150,
                reason: 'Task completed',
                type: 'task',
                taskTitle: 'Complete React Component'
            },
            {
                id: '2',
                date: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                xpGained: 50,
                reason: 'Daily streak bonus',
                type: 'streak'
            },
            {
                id: '3',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                xpGained: 200,
                reason: 'Milestone reached',
                type: 'milestone'
            },
            {
                id: '4',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // 1 day 2 hours ago
                xpGained: 100,
                reason: 'Task completed',
                type: 'task',
                taskTitle: 'Write API Documentation'
            },
            {
                id: '5',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                xpGained: 75,
                reason: 'Task completed',
                type: 'task',
                taskTitle: 'Fix CSS Layout Bug'
            },
            {
                id: '6',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000), // 2 days 4 hours ago
                xpGained: 25,
                reason: 'First task of the day bonus',
                type: 'bonus'
            },
            {
                id: '7',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                xpGained: 300,
                reason: 'Weekly milestone',
                type: 'milestone'
            },
            {
                id: '8',
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                xpGained: 125,
                reason: 'Task completed',
                type: 'task',
                taskTitle: 'Implement User Authentication'
            }
        ];

        return mockHistory;
    }, [user]);

    const filteredHistory = useMemo(() => {
        if (selectedFilter === 'all') return xpHistory;
        return xpHistory.filter(entry => entry.type === selectedFilter);
    }, [xpHistory, selectedFilter]);

    const getTypeIcon = (type: XPHistoryEntry['type']) => {
        switch (type) {
            case 'task':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'milestone':
                return <Trophy className="w-4 h-4 text-yellow-500" />;
            case 'streak':
                return <Zap className="w-4 h-4 text-orange-500" />;
            case 'bonus':
                return <Zap className="w-4 h-4 text-green-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getTypeColor = (type: XPHistoryEntry['type']) => {
        switch (type) {
            case 'task':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'milestone':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'streak':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'bonus':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks}w ago`;
    };

    const totalXPShown = filteredHistory.slice(0, visibleEntries).reduce((sum, entry) => sum + entry.xpGained, 0);

    if (!user) return null;

    return (
        <Card className={`p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">XP History</h3>
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="capitalize">{selectedFilter}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </Button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {['all', 'task', 'milestone', 'streak', 'bonus'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => {
                                            setSelectedFilter(filter as any);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg capitalize ${selectedFilter === filter ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Total XP (Filtered)</p>
                    <p className="text-2xl font-bold text-blue-600">{totalXPShown.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-gray-600 mb-1">Entries Shown</p>
                    <p className="text-2xl font-bold text-green-600">{Math.min(visibleEntries, filteredHistory.length)}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredHistory.slice(0, visibleEntries).map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Timeline Dot */}
                            <div className="flex-shrink-0 mt-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(entry.type)} border`}>
                                    {getTypeIcon(entry.type)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {entry.taskTitle || entry.reason}
                                    </h4>
                                    <motion.span
                                        className="text-lg font-bold text-green-600 flex items-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.05 + 0.2 }}
                                    >
                                        +{entry.xpGained}
                                    </motion.span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className={`px-2 py-1 rounded-full ${getTypeColor(entry.type)} capitalize`}>
                                        {entry.type}
                                    </span>
                                    <span>{formatTimeAgo(entry.date)}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Load More Button */}
            {visibleEntries < filteredHistory.length && (
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button
                        variant="outline"
                        onClick={() => setVisibleEntries(prev => prev + 10)}
                        className="w-full"
                    >
                        Load More ({filteredHistory.length - visibleEntries} remaining)
                    </Button>
                </motion.div>
            )}

            {/* Empty State */}
            {filteredHistory.length === 0 && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No XP history found</h4>
                    <p className="text-gray-600">
                        {selectedFilter === 'all'
                            ? "Start completing tasks to build your XP history!"
                            : `No ${selectedFilter} entries found. Try a different filter.`
                        }
                    </p>
                </motion.div>
            )}
        </Card>
    );
}