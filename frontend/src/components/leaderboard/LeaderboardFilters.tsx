
import { motion } from 'framer-motion';
import { Calendar, Clock, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeaderboardFiltersProps {
    selectedTimeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
    onTimeframeChange: (timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time') => void;
    totalUsers?: number;
    className?: string;
}

export function LeaderboardFilters({
    selectedTimeframe,
    onTimeframeChange,
    totalUsers = 0,
    className = ''
}: LeaderboardFiltersProps) {
    const timeframeOptions = [
        {
            id: 'daily' as const,
            label: 'Today',
            description: 'Daily rankings',
            icon: <Calendar className="w-4 h-4" />,
            color: 'text-blue-600'
        },
        {
            id: 'weekly' as const,
            label: 'This Week',
            description: 'Weekly rankings',
            icon: <Clock className="w-4 h-4" />,
            color: 'text-green-600'
        },
        {
            id: 'monthly' as const,
            label: 'This Month',
            description: 'Monthly rankings',
            icon: <TrendingUp className="w-4 h-4" />,
            color: 'text-purple-600'
        },
        {
            id: 'all-time' as const,
            label: 'All Time',
            description: 'Overall rankings',
            icon: <Trophy className="w-4 h-4" />,
            color: 'text-yellow-600'
        }
    ];

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Leaderboard Rankings
                    </h3>
                    <p className="text-sm text-gray-600">
                        Choose a timeframe to see how you stack up
                    </p>
                </div>

                {totalUsers > 0 && (
                    <Badge variant="outline" className="text-gray-600">
                        {totalUsers.toLocaleString()} competitors
                    </Badge>
                )}
            </div>

            {/* Timeframe Filters */}
            <div className="flex flex-wrap gap-2">
                {timeframeOptions.map((option, index) => (
                    <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Button
                            variant={selectedTimeframe === option.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => onTimeframeChange(option.id)}
                            className={`flex items-center gap-2 transition-all duration-200 ${selectedTimeframe === option.id
                                ? 'shadow-md scale-105'
                                : 'hover:scale-102'
                                }`}
                        >
                            <span className={selectedTimeframe === option.id ? 'text-white' : option.color}>
                                {option.icon}
                            </span>
                            <span>{option.label}</span>
                        </Button>
                    </motion.div>
                ))}
            </div>

            {/* Selected Timeframe Description */}
            <motion.div
                key={selectedTimeframe}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-gray-600"
            >
                {timeframeOptions.find(opt => opt.id === selectedTimeframe)?.description}
            </motion.div>
        </div>
    );
}