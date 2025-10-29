import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Target, Zap, Circle } from 'lucide-react';
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

    const displayTime = Math.floor(currentTime / 1000);

    return (
        <motion.div className={`w-full ${className}`}>
            <Card className="p-8 bg-[#1C1C1C] border border-[#757373]/20 shadow-2xl overflow-hidden relative">
                {/* Subtle animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FAFAFA]/[0.02] to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-8">
                    {/* Timer Display */}
                    <div className="space-y-6 text-center">
                        {/* Status */}
                        <motion.div
                            className="flex items-center justify-center gap-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <AnimatePresence mode="wait">
                                {isRunning ? (
                                    <motion.div
                                        key="running"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <Circle className="w-2 h-2 fill-[#FAFAFA] text-[#FAFAFA]" />
                                        </motion.div>
                                        <span className="text-sm font-medium text-[#FAFAFA] tracking-wide uppercase">
                                            Focus Mode Active
                                        </span>
                                    </motion.div>
                                ) : isPaused ? (
                                    <motion.div
                                        key="paused"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Circle className="w-2 h-2 fill-[#757373] text-[#757373]" />
                                        <span className="text-sm font-medium text-[#757373] tracking-wide uppercase">
                                            Paused
                                        </span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Circle className="w-2 h-2 fill-[#757373]/50 text-[#757373]/50" />
                                        <span className="text-sm font-medium text-[#757373] tracking-wide uppercase">
                                            Ready to Focus
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Time Display */}
                        <motion.div
                            className="text-8xl font-bold font-mono tracking-tight text-[#FAFAFA]"
                            animate={isRunning ? {
                                textShadow: [
                                    '0 0 20px rgba(250, 250, 250, 0)',
                                    '0 0 30px rgba(250, 250, 250, 0.1)',
                                    '0 0 20px rgba(250, 250, 250, 0)',
                                ],
                            } : {}}
                            transition={{
                                duration: 2,
                                repeat: isRunning ? Infinity : 0,
                                ease: "easeInOut",
                            }}
                        >
                            {formatTimerDisplay(currentTime)}
                        </motion.div>

                        {/* Description */}
                        <AnimatePresence>
                            {activeSession?.description && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-[#757373] text-sm font-medium"
                                >
                                    {activeSession.description}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-3">
                        <AnimatePresence mode="wait">
                            {!activeSession ? (
                             <motion.div
                             key="start"
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 10 }}
                             transition={{ duration: 0.3 }}
                         >
                             <Button
                                 onClick={handleStart}
                                 size="lg"
                                 className="group relative overflow-hidden gap-4 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373]"
                             >
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                 <span className="relative flex items-center gap-2">
                                     <Play className="w-5 h-5" />
                                     Start Focus Session
                                 </span>
                             </Button>
                         </motion.div>
                            ) : (
                                <motion.div
                                    key="controls"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex gap-3"
                                >
                                    <Button
                                        onClick={handlePause}
                                        
                                        size="lg"
                                        className="gap-4 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1   hover:shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[2px_2px_0px_0px_#757373]"
                                    >
                                        {isRunning ? (
                                            <span className="flex items-center gap-2">
                                                <Pause className="w-4 h-4" />
                                                Pause
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Play className="w-4 h-4" />
                                                Resume
                                            </span>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={handleStop}
                                        size="lg"
                                        className="gap-4 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1  hover:shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[2px_2px_0px_0px_#757373]"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Square className="w-4 h-4" />
                                            Stop
                                        </span>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-8 pt-6 border-t border-[#757373]/10"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#757373]" />
                            <span className="text-sm text-[#757373]">Today</span>
                            <span className="text-sm font-semibold text-[#FAFAFA]">
                                {formatDurationShort(getTotalTimeToday())}
                            </span>
                        </div>

                        <div className="w-px h-4 bg-[#757373]/20" />

                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#757373]" />
                            <span className="text-sm text-[#757373]">Progress</span>
                            <span className="text-sm font-semibold text-[#FAFAFA]">
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
                                className="bg-[#FAFAFA]/5 border border-[#FAFAFA]/10 rounded-lg p-4"
                            >
                                {(() => {
                                    const activeTask = user.tasks.find(t => t.id === activeSession.taskId);
                                    return activeTask ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    activeTask.priority === 'high' ? 'bg-[#FAFAFA]' :
                                                    activeTask.priority === 'medium' ? 'bg-[#757373]' : 
                                                    'bg-[#757373]/50'
                                                }`} />
                                                <span className="text-sm font-medium text-[#FAFAFA]">
                                                    {activeTask.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAFAFA]/10 rounded">
                                                <Zap className="w-3 h-3 text-[#FAFAFA]" />
                                                <span className="text-xs font-semibold text-[#FAFAFA]">
                                                    {activeTask.xpReward} XP
                                                </span>
                                            </div>
                                        </div>
                                    ) : null;
                                })()}
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
                                className="border-t border-[#757373]/10 pt-6 space-y-4"
                            >
                                <p className="text-center text-sm text-[#757373]">
                                    Quick start with a task
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {user.tasks.slice(0, 3).map((task) => (
                                        <motion.button
                                            key={task.id}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => startTimer(undefined, task.id, `Working on: ${task.title}`)}
                                            className="group flex items-center gap-2 px-4 py-2.5 bg-[#FAFAFA]/5 hover:bg-[#FAFAFA]/10 border border-[#757373]/20 hover:border-[#FAFAFA]/30 rounded-lg transition-all duration-200"
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                task.priority === 'high' ? 'bg-[#FAFAFA]' :
                                                task.priority === 'medium' ? 'bg-[#757373]' : 
                                                'bg-[#757373]/50'
                                            }`} />
                                            <span className="text-sm font-medium text-[#FAFAFA] truncate max-w-32">
                                                {task.title}
                                            </span>
                                            <span className="text-xs text-[#757373] group-hover:text-[#FAFAFA] transition-colors">
                                                +{task.xpReward}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.div>
    );
}