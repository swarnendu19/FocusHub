import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/stores/timerStore';
import { formatDurationShort } from '@/utils/timeUtils';

interface DailyGoalProgressProps {
    className?: string;
}

export function DailyGoalProgress({ className = '' }: DailyGoalProgressProps) {
    const {
        dailyTime,
        dailyGoal,
        setDailyGoal,
        getDailyProgress,
        getTotalTimeToday,
    } = useTimerStore();

    const [showCelebration, setShowCelebration] = useState(false);
    const [previousProgress, setPreviousProgress] = useState(0);
    const [showGoalSetter, setShowGoalSetter] = useState(false);
    const [tempGoal, setTempGoal] = useState(dailyGoal);

    const progress = getDailyProgress();
    const totalTimeToday = getTotalTimeToday();
    const remainingTime = Math.max(0, dailyGoal - dailyTime);
    const isGoalReached = progress >= 100;

    // Trigger celebration when goal is reached
    useEffect(() => {
        if (progress >= 100 && previousProgress < 100) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 4000);
            return () => clearTimeout(timer);
        }
        setPreviousProgress(progress);
    }, [progress, previousProgress]);

    const getMotivationalMessage = () => {
        if (isGoalReached) {
            return "🎉 Goal crushed! You're on fire today!";
        } else if (progress >= 80) {
            return "🔥 Almost there! Push through!";
        } else if (progress >= 50) {
            return "💪 Halfway there! Keep going!";
        } else if (progress >= 25) {
            return "🚀 Good start! Building momentum!";
        } else {
            return "🎯 Ready to tackle your daily goal?";
        }
    };

    const getProgressColor = () => {
        if (isGoalReached) return 'from-green-400 to-emerald-500';
        if (progress >= 80) return 'from-orange-400 to-red-500';
        if (progress >= 50) return 'from-blue-400 to-purple-500';
        return 'from-gray-400 to-gray-500';
    };

    const handleGoalUpdate = () => {
        setDailyGoal(tempGoal);
        setShowGoalSetter(false);
    };

    const progressVariants = {
        initial: { width: 0 },
        animate: {
            width: `${Math.min(progress, 100)}%`,
            transition: {
                duration: 1.5,
                ease: 'easeOut',
            },
        },
    };

    const celebrationVariants = {
        initial: {
            opacity: 0,
            scale: 0.5,
            y: 20,
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.5,
            y: -20,
            transition: {
                duration: 0.3,
            },
        },
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <div className={`relative ${className}`}>
            <Card className={`p-6 ${isGoalReached ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            variants={isGoalReached ? pulseVariants : {}}
                            animate={isGoalReached ? 'animate' : ''}
                            className={`p-3 rounded-full ${isGoalReached
                                ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600'
                                : 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600'
                                }`}
                        >
                            {isGoalReached ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : (
                                <Target className="w-6 h-6" />
                            )}
                        </motion.div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Daily Goal
                            </h3>
                            <p className="text-sm text-gray-600">
                                {getMotivationalMessage()}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowGoalSetter(true)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress visualization */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            variants={progressVariants}
                            initial="initial"
                            animate="animate"
                            className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full relative`}
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                        </motion.div>

                        {/* Goal marker */}
                        {progress > 100 && (
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm"
                                style={{ left: '100%', transform: 'translateX(-50%)' }}
                            />
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatDurationShort(totalTimeToday)}
                            </div>
                            <div className="text-xs text-gray-500">Today</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {dailyGoal}m
                            </div>
                            <div className="text-xs text-gray-500">Goal</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${isGoalReached ? 'text-green-600' : 'text-orange-600'}`}>
                                {isGoalReached ? '0m' : `${remainingTime}m`}
                            </div>
                            <div className="text-xs text-gray-500">
                                {isGoalReached ? 'Exceeded!' : 'Remaining'}
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    {!isGoalReached && (
                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => setTempGoal(Math.max(30, dailyGoal - 60))}
                            >
                                -1h Goal
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => setTempGoal(dailyGoal + 60)}
                            >
                                +1h Goal
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Goal setter modal */}
            <AnimatePresence>
                {showGoalSetter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowGoalSetter(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Set Daily Goal
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Goal (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        min="30"
                                        max="1440"
                                        step="30"
                                        value={tempGoal}
                                        onChange={(e) => setTempGoal(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="text-sm text-gray-600">
                                    That's {Math.floor(tempGoal / 60)}h {tempGoal % 60}m per day
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowGoalSetter(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleGoalUpdate}
                                        className="flex-1"
                                    >
                                        Save Goal
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Celebration overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        variants={celebrationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-green-200">
                            <div className="text-center">
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: 'easeOut',
                                    }}
                                    className="text-4xl mb-3"
                                >
                                    🎯
                                </motion.div>
                                <div className="text-xl font-bold text-green-600 mb-1">
                                    Goal Achieved!
                                </div>
                                <div className="text-sm text-gray-600">
                                    You've reached your daily target!
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confetti particles for goal completion */}
            {showCelebration && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][i % 4],
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -100, -200],
                                x: [0, Math.random() * 100 - 50],
                                opacity: [1, 1, 0],
                                scale: [1, 0.5, 0],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 3,
                                delay: i * 0.1,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}