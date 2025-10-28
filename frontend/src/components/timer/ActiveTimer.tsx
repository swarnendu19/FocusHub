import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';
import { formatTimerDisplay, formatDurationShort } from '@/utils/timeUtils';

interface ActiveTimerProps {
    className?: string;
}

export function ActiveTimer({ className = '' }: ActiveTimerProps) {
    const {
        activeSession,
        isRunning,
        isPaused,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        updateElapsedTime,
        getTotalTimeToday,
        getDailyProgress,
        recoverTimer,
    } = useTimerStore();

    const { user } = useUserStore();
    const [currentTime, setCurrentTime] = useState(0);

    // Timer recovery on component mount
    useEffect(() => {
        recoverTimer();
    }, [recoverTimer]);

    // Update timer display every second
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning || isPaused) {
            interval = setInterval(() => {
                setCurrentTime(updateElapsedTime());
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, isPaused, updateElapsedTime]);

    const handleStart = () => {
        startTimer();
    };

    const handlePause = () => {
        if (isRunning) {
            pauseTimer();
        } else if (isPaused) {
            resumeTimer();
        }
    };

    const handleStop = () => {
        stopTimer();
        setCurrentTime(0);
    };

    const timerVariants = {
        idle: {
            scale: 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        running: {
            scale: [1, 1.02, 1],
            boxShadow: [
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '0 8px 25px -5px rgba(88, 204, 2, 0.3)',
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
        paused: {
            scale: 1,
            boxShadow: '0 4px 6px -1px rgba(255, 150, 0, 0.2)',
        },
    };

    const timeDisplayVariants = {
        idle: { color: '#64748B' },
        running: {
            color: '#58CC02',
            textShadow: '0 0 10px rgba(88, 204, 2, 0.3)',
        },
        paused: { color: '#FF9600' },
    };

    const getTimerState = () => {
        if (isRunning) return 'running';
        if (isPaused) return 'paused';
        return 'idle';
    };

    const displayTime = Math.floor(currentTime / 1000);

    return (
        <motion.div className={`w-full ${className}`}>
            <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-2">
                <motion.div
                    variants={timerVariants}
                    animate={getTimerState()}
                    className="text-center space-y-6"
                >
                    {/* Timer Display */}
                    <div className="space-y-2">
                        <motion.div
                            className="flex items-center justify-center gap-2 text-gray-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Clock className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {activeSession ? 'Active Session' : 'Ready to Focus'}
                            </span>
                        </motion.div>

                        <motion.div
                            variants={timeDisplayVariants}
                            animate={getTimerState()}
                            className="text-6xl font-bold font-mono tracking-tight"
                            transition={{ duration: 0.3 }}
                        >
                            {formatTimerDisplay(currentTime)}
                        </motion.div>

                        <AnimatePresence>
                            {activeSession?.description && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-gray-600 text-sm"
                                >
                                    {activeSession.description}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-4">
                        <AnimatePresence mode="wait">
                            {!activeSession ? (
                                <motion.div
                                    key="start"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Button
                                        onClick={handleStart}
                                        size="lg"
                                        className="bg-[--color-primary] hover:bg-[--color-primary-dark] text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <Play className="w-5 h-5 mr-2" />
                                        Start Timer
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="controls"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-3"
                                >
                                    <Button
                                        onClick={handlePause}
                                        variant="outline"
                                        size="lg"
                                        className="px-6 py-3 font-semibold border-2 hover:scale-105 transition-transform duration-200"
                                    >
                                        {isRunning ? (
                                            <>
                                                <Pause className="w-5 h-5 mr-2" />
                                                Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5 mr-2" />
                                                Resume
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={handleStop}
                                        variant="outline"
                                        size="lg"
                                        className="px-6 py-3 font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-105 transition-all duration-200"
                                    >
                                        <Square className="w-5 h-5 mr-2" />
                                        Stop
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Daily Progress Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-6 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">Today:</span>
                            <span className="font-semibold text-gray-900">
                                {formatDurationShort(getTotalTimeToday())}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">Goal:</span>
                            <span className="font-semibold text-gray-900">
                                {Math.round(getDailyProgress())}%
                            </span>
                        </div>
                    </motion.div>

                    {/* Active Task Info */}
                    <AnimatePresence>
                        {activeSession?.taskId && user && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                            >
                                {(() => {
                                    const activeTask = user.tasks.find(t => t.id === activeSession.taskId);
                                    return activeTask ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-blue-600 border-blue-300">
                                                    Task
                                                </Badge>
                                                <span className="text-sm font-medium text-blue-900">
                                                    {activeTask.title}
                                                </span>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                <Zap className="w-3 h-3 mr-1" />
                                                {activeTask.xpReward} XP
                                            </Badge>
                                        </div>
                                    ) : null;
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Indicator */}
                    <AnimatePresence>
                        {activeSession && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <motion.div
                                    className={`w-3 h-3 rounded-full ${isRunning
                                        ? 'bg-green-500'
                                        : isPaused
                                            ? 'bg-orange-500'
                                            : 'bg-gray-400'
                                        }`}
                                    animate={isRunning ? {
                                        scale: [1, 1.2, 1],
                                        opacity: [1, 0.7, 1],
                                    } : {}}
                                    transition={{
                                        duration: 1.5,
                                        repeat: isRunning ? Infinity : 0,
                                        ease: 'easeInOut',
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-600">
                                    {isRunning ? 'Recording...' : isPaused ? 'Paused' : 'Stopped'}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quick Task Selection */}
                    <AnimatePresence>
                        {!activeSession && user && user.tasks.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-gray-200 pt-4"
                            >
                                <div className="text-center space-y-3">
                                    <p className="text-sm text-gray-600">
                                        Start a focused session on one of your tasks:
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                                        {user.tasks.slice(0, 3).map((task) => (
                                            <motion.button
                                                key={task.id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => startTimer(undefined, task.id, `Working on: ${task.title}`)}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200"
                                            >
                                                <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                                    task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                                    }`} />
                                                <span className="truncate max-w-24">
                                                    {task.title}
                                                </span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {task.xpReward}
                                                </Badge>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </Card>
        </motion.div>
    );
}