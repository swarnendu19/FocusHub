
import { motion } from 'framer-motion';
import { Crown, Trophy, Medal, Star, Clock, Target, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDurationShort } from '@/utils/timeUtils';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardPodiumProps {
    topUsers: LeaderboardEntry[];
    currentUserId?: string;
    className?: string;
}

export function LeaderboardPodium({
    topUsers,
    currentUserId,
    className = ''
}: LeaderboardPodiumProps) {
    // Ensure we have exactly 3 users for the podium, fill with null if needed
    const podiumUsers = [
        topUsers.find(user => user.rank === 2) || null, // 2nd place (left)
        topUsers.find(user => user.rank === 1) || null, // 1st place (center)
        topUsers.find(user => user.rank === 3) || null, // 3rd place (right)
    ];

    const getPodiumHeight = (position: number) => {
        switch (position) {
            case 0: return 'h-32'; // 2nd place
            case 1: return 'h-40'; // 1st place (tallest)
            case 2: return 'h-24'; // 3rd place
            default: return 'h-24';
        }
    };

    const getPodiumIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-8 h-8 text-yellow-500" />;
            case 2:
                return <Trophy className="w-7 h-7 text-gray-400" />;
            case 3:
                return <Medal className="w-6 h-6 text-amber-600" />;
            default:
                return null;
        }
    };

    const getPodiumColors = (rank: number) => {
        switch (rank) {
            case 1:
                return {
                    bg: 'bg-gradient-to-t from-yellow-400 to-yellow-300',
                    border: 'border-yellow-500',
                    card: 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50'
                };
            case 2:
                return {
                    bg: 'bg-gradient-to-t from-gray-400 to-gray-300',
                    border: 'border-gray-500',
                    card: 'border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50'
                };
            case 3:
                return {
                    bg: 'bg-gradient-to-t from-amber-600 to-amber-500',
                    border: 'border-amber-700',
                    card: 'border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50'
                };
            default:
                return {
                    bg: 'bg-gray-200',
                    border: 'border-gray-300',
                    card: 'border border-gray-200'
                };
        }
    };

    if (topUsers.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-gray-400 text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Champions Yet
                </h3>
                <p className="text-gray-500">
                    Start tracking time to claim your spot on the podium!
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Podium Structure */}
            <div className="relative">
                {/* Podium Base */}
                <div className="flex items-end justify-center gap-4 mb-6">
                    {podiumUsers.map((user, index) => {
                        if (!user) {
                            return (
                                <div
                                    key={index}
                                    className={`w-24 ${getPodiumHeight(index)} bg-gray-100 border border-gray-200 rounded-t-lg flex items-center justify-center opacity-50`}
                                >
                                    <span className="text-gray-400 text-sm">Empty</span>
                                </div>
                            );
                        }

                        const colors = getPodiumColors(user.rank);

                        return (
                            <motion.div
                                key={user.userId}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                                className="flex flex-col items-center"
                            >
                                {/* User Card */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="mb-2"
                                >
                                    <Card className={`p-4 w-32 ${colors.card} ${user.userId === currentUserId ? 'ring-2 ring-blue-400' : ''
                                        }`}>
                                        <div className="text-center space-y-2">
                                            {/* Avatar */}
                                            <div className="relative">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="w-16 h-16 rounded-full mx-auto border-2 border-white shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-2 border-white shadow-lg">
                                                        <User className="w-8 h-8 text-gray-500" />
                                                    </div>
                                                )}

                                                {/* Rank Icon */}
                                                <div className="absolute -top-2 -right-2">
                                                    {getPodiumIcon(user.rank)}
                                                </div>
                                            </div>

                                            {/* Username */}
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm truncate">
                                                    {user.username}
                                                </h4>
                                                <p className="text-xs text-gray-600">
                                                    Level {user.level}
                                                </p>
                                                {user.userId === currentUserId && (
                                                    <Badge variant="secondary" className="text-xs mt-1">
                                                        You
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-500" />
                                                    <span className="font-semibold">
                                                        {user.xp.toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-center gap-1 text-gray-600">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatDurationShort(user.totalTime)}</span>
                                                </div>

                                                <div className="flex items-center justify-center gap-1 text-gray-600">
                                                    <Target className="w-3 h-3" />
                                                    <span>{user.tasksCompleted}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Podium Step */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                    className={`w-24 ${getPodiumHeight(index)} ${colors.bg} ${colors.border} border-2 border-t-0 rounded-b-lg flex items-center justify-center relative overflow-hidden`}
                                >
                                    {/* Rank Number */}
                                    <div className="text-white font-bold text-2xl drop-shadow-lg">
                                        {user.rank}
                                    </div>

                                    {/* Shine Effect */}
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{
                                            delay: 1 + index * 0.2,
                                            duration: 1,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    />
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Confetti Effect for Winner */}
                {podiumUsers[1] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
                    >
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    y: -20,
                                    x: 0,
                                    rotate: 0,
                                    opacity: 1
                                }}
                                animate={{
                                    y: 100,
                                    x: (Math.random() - 0.5) * 200,
                                    rotate: Math.random() * 360,
                                    opacity: 0
                                }}
                                transition={{
                                    duration: 2,
                                    delay: Math.random() * 0.5,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                }}
                                className={`absolute w-2 h-2 ${['bg-yellow-400', 'bg-blue-400', 'bg-red-400', 'bg-green-400'][i % 4]
                                    } rounded-full`}
                                style={{
                                    left: `${(Math.random() - 0.5) * 40}px`
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Achievement Highlights */}
            {topUsers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <Card className="p-4 text-center bg-yellow-50 border-yellow-200">
                        <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900">Most XP</h4>
                        <p className="text-sm text-gray-600">
                            {topUsers[0]?.xp.toLocaleString()} points
                        </p>
                    </Card>

                    <Card className="p-4 text-center bg-blue-50 border-blue-200">
                        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900">Most Time</h4>
                        <p className="text-sm text-gray-600">
                            {formatDurationShort(Math.max(...topUsers.map(u => u.totalTime)))}
                        </p>
                    </Card>

                    <Card className="p-4 text-center bg-green-50 border-green-200">
                        <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900">Most Tasks</h4>
                        <p className="text-sm text-gray-600">
                            {Math.max(...topUsers.map(u => u.tasksCompleted))} completed
                        </p>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}