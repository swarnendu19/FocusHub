import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTimerStore } from '@/stores/timerStore';
import { formatDurationLong, formatDurationShort } from '@/utils/timeUtils';
import type { TimeSession } from '@/types';

interface TimerHistoryProps {
    className?: string;
    maxItems?: number;
}

export function TimerHistory({ className = '', maxItems = 10 }: TimerHistoryProps) {
    const { sessions, deleteSession, getTodaysSessions, getWeeksSessions } = useTimerStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [filter, setFilter] = useState<'all' | 'today' | 'week'>('today');

    const getFilteredSessions = () => {
        switch (filter) {
            case 'today':
                return getTodaysSessions();
            case 'week':
                return getWeeksSessions();
            default:
                return sessions;
        }
    };

    const filteredSessions = getFilteredSessions()
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        .slice(0, isExpanded ? undefined : maxItems);

    const totalSessions = getFilteredSessions().length;
    const hasMoreSessions = totalSessions > maxItems;

    const handleDelete = (sessionId: string) => {
        deleteSession(sessionId);
    };

    const getSessionBadgeColor = (session: TimeSession) => {
        const duration = session.duration;
        if (duration >= 3600000) return 'bg-green-100 text-green-800'; // 1+ hour
        if (duration >= 1800000) return 'bg-blue-100 text-blue-800'; // 30+ minutes
        if (duration >= 900000) return 'bg-yellow-100 text-yellow-800'; // 15+ minutes
        return 'bg-gray-100 text-gray-800'; // Less than 15 minutes
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
        },
        exit: {
            opacity: 0,
            x: 20,
            scale: 0.95,
            transition: { duration: 0.2 },
        },
    };

    if (filteredSessions.length === 0) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="text-center space-y-3">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-600">No Sessions Yet</h3>
                    <p className="text-gray-500">
                        Start your first timer session to see your history here!
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Timer History</h3>
                        <Badge variant="secondary" className="text-xs">
                            {totalSessions} sessions
                        </Badge>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {(['today', 'week', 'all'] as const).map((filterOption) => (
                            <Button
                                key={filterOption}
                                variant={filter === filterOption ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter(filterOption)}
                                className="text-xs capitalize"
                            >
                                {filterOption}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Sessions List */}
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredSessions.map((session) => (
                            <motion.div
                                key={session.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                                className="group"
                            >
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Duration Badge */}
                                        <Badge className={getSessionBadgeColor(session)}>
                                            {formatDurationShort(session.duration)}
                                        </Badge>

                                        {/* Session Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {new Date(session.startTime).toLocaleDateString()} at{' '}
                                                    {new Date(session.startTime).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                                {new Date(session.startTime).toDateString() === new Date().toDateString() && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Today
                                                    </Badge>
                                                )}
                                            </div>
                                            {session.description && (
                                                <p className="text-sm text-gray-700 truncate">
                                                    {session.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* XP Earned */}
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-green-600">
                                                +{session.xpEarned} XP
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatDurationLong(session.duration)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(session.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Expand/Collapse Button */}
                {hasMoreSessions && (
                    <motion.div
                        className="mt-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4 mr-2" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4 mr-2" />
                                    Show {totalSessions - maxItems} More
                                </>
                            )}
                        </Button>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
}