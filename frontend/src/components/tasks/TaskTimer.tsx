import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Target, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';
import { formatDurationShort } from '@/utils/timeUtils';
import { formatTime, getTimeAgo } from '@/utils/time';
import type { Task } from '@/types';

interface TaskTimerProps {
    task: Task;
    onComplete?: (taskId: string, xpReward: number) => void;
    className?: string;
}

export function TaskTimer({ task, onComplete, className = '' }: TaskTimerProps) {
    const {
        activeSession,
        isRunning,
        isPaused,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        updateElapsedTime,
    } = useTimerStore();

    const { updateTask, addXP } = useUserStore();
    const [currentTime, setCurrentTime] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    const isActiveTask = activeSession?.taskId === task.id;

    // Update timer display every second
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActiveTask && (isRunning || isPaused)) {
            interval = setInterval(() => {
                setCurrentTime(updateElapsedTime());
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActiveTask, isRunning, isPaused, updateElapsedTime]);

    const handleStart = () => {
        startTimer(undefined, task.id, `Working on: ${task.title}`);
    };

    const handlePause = () => {
        if (isRunning) {
            pauseTimer();
        } else if (isPaused) {
            resumeTimer();
        }
    };

    const handleStop = () => {
        if (activeSession && isActiveTask) {
            // Calculate time spent and update task
            const newTimeSpent = task.timeSpent + (currentTime || 0);

            updateTask(task.id, {
                timeSpent: newTimeSpent,
                lastWorkedOn: new Date()
            });

            stopTimer();
            setCurrentTime(0);
        }
    };

    const handleComplete = () => {
        if (isActiveTask) {
            handleStop();
        }

        // Award XP and complete task
        addXP(task.xpReward);

        if (onComplete) {
            onComplete(task.id, task.xpReward);
        }

        setShowCompletionModal(true);

        // Hide modal after celebration
        setTimeout(() => setShowCompletionModal(false), 3000);
    };

    // Calculate progress based on estimated time (if available)
    const estimatedTime = task.estimatedTime || 3600000; // Default 1 hour
    const totalTimeSpent = task.timeSpent + (isActiveTask ? currentTime : 0);
    const progress = Math.min((totalTimeSpent / estimatedTime) * 100, 100);

    // Check if task is overdue (if deadline exists)
    const isOverdue = task.deadline && new Date() > new Date(task.deadline);
    const isUrgent = task.deadline &&
        new Date(task.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000; // Less than 24 hours

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

    const getTimerState = () => {
        if (isActiveTask && isRunning) return 'running';
        if (isActiveTask && isPaused) return 'paused';
        return 'idle';
    };

    const displayTime = isActiveTask ? Math.floor(currentTime / 1000) : 0;

    return (
        <>
            <motion.div className={`w-full ${className}`}>
                <Card className={`p-6 border-2 transition-all duration-300 ${isActiveTask
                    ? 'border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg'
                    : isOverdue
                        ? 'border-red-200 bg-gradient-to-br from-red-50 to-white'
                        : isUrgent
                            ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-white'
                            : 'bg-gradient-to-br from-white to-gray-50 hover:shadow-md'
                    }`}>
                    <motion.div
                        variants={timerVariants}
                        animate={getTimerState()}
                        className="space-y-6"
                    >
                        {/* Task Header */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {task.title}
                                    </h3>
                                    {task.description && (
                                        <p className="text-sm text-gray-600">
                                            {task.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="text-yellow-600 border-yellow-200 bg-yellow-50"
                                    >
                                        <Target className="w-3 h-3 mr-1" />
                                        {task.xpReward} XP
                                    </Badge>

                                    {isActiveTask && (
                                        <motion.div
                                            className="w-3 h-3 bg-green-500 rounded-full"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [1, 0.7, 1]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Task metadata */}
                            <div className="flex flex-wrap gap-2">
                                {task.timeSpent > 0 && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDurationShort(task.timeSpent)} logged
                                    </Badge>
                                )}

                                {task.deadline && (
                                    <Badge
                                        variant="outline"
                                        className={
                                            isOverdue
                                                ? "text-red-600 border-red-200 bg-red-50"
                                                : isUrgent
                                                    ? "text-orange-600 border-orange-200 bg-orange-50"
                                                    : "text-gray-600 border-gray-200"
                                        }
                                    >
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {isOverdue ? 'Overdue' : getTimeAgo(task.deadline)}
                                    </Badge>
                                )}

                                <Badge
                                    variant="outline"
                                    className={`${task.priority === 'high'
                                        ? 'text-red-600 border-red-200 bg-red-50'
                                        : task.priority === 'medium'
                                            ? 'text-orange-600 border-orange-200 bg-orange-50'
                                            : 'text-green-600 border-green-200 bg-green-50'
                                        }`}
                                >
                                    {task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '🌱'} {task.priority}
                                </Badge>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <ProgressBar
                                value={progress}
                                color={progress >= 100 ? "xp" : "primary"}
                                animated={true}
                                showLabel={false}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{formatDurationShort(totalTimeSpent)}</span>
                                <span>{formatDurationShort(estimatedTime)} estimated</span>
                            </div>
                        </div>

                        {/* Timer Display */}
                        <AnimatePresence>
                            {isActiveTask && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-center space-y-4 py-4 border-t border-gray-200"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">Current Session</span>
                                        </div>

                                        <motion.div
                                            className={`text-4xl font-bold font-mono tracking-tight transition-colors duration-300 ${isRunning
                                                ? 'text-green-600'
                                                : isPaused
                                                    ? 'text-orange-600'
                                                    : 'text-gray-600'
                                                }`}
                                            animate={isRunning ? {
                                                textShadow: [
                                                    '0 0 0px rgba(88, 204, 2, 0)',
                                                    '0 0 10px rgba(88, 204, 2, 0.3)',
                                                    '0 0 0px rgba(88, 204, 2, 0)',
                                                ]
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {formatTime(displayTime * 1000)}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-center gap-3">
                            <AnimatePresence mode="wait">
                                {!isActiveTask ? (
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
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Start Task
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="controls"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex gap-2"
                                    >
                                        <Button
                                            onClick={handlePause}
                                            variant="outline"
                                            size="sm"
                                            className="px-4 py-2 font-semibold border-2 hover:scale-105 transition-transform duration-200"
                                        >
                                            {isRunning ? (
                                                <>
                                                    <Pause className="w-4 h-4 mr-1" />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-1" />
                                                    Resume
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            onClick={handleStop}
                                            variant="outline"
                                            size="sm"
                                            className="px-4 py-2 font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-105 transition-all duration-200"
                                        >
                                            <Square className="w-4 h-4 mr-1" />
                                            Stop
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                onClick={handleComplete}
                                variant="default"
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                disabled={task.completed}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete Task
                            </Button>
                        </div>
                    </motion.div>
                </Card>
            </motion.div>

            {/* Completion Celebration Modal */}
            <AnimatePresence>
                {showCompletionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowCompletionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 50 }}
                            className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Confetti Animation */}
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.2, 1.1, 1]
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: 3,
                                    ease: "easeInOut"
                                }}
                                className="text-6xl mb-4"
                            >
                                🎉
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-bold text-gray-900 mb-2"
                            >
                                Task Completed!
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-600 mb-4"
                            >
                                Great job! You've successfully completed <strong>{task.title}</strong>
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1, repeat: 2 }}
                                    className="text-yellow-600 text-2xl font-bold"
                                >
                                    +{task.xpReward} XP
                                </motion.div>
                                <p className="text-sm text-yellow-700 mt-1">Experience Points Earned!</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm text-gray-500"
                            >
                                Keep up the great work! 🚀
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}