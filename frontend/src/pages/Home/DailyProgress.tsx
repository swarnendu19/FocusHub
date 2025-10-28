import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';
import { Clock, Target, Flame, Trophy } from 'lucide-react';

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    children?: React.ReactNode;
}

function CircularProgress({
    progress,
    size = 120,
    strokeWidth = 8,
    color = '#58CC02',
    children
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{
                        duration: 1.5,
                        ease: "easeOut",
                        delay: 0.5
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

export function DailyProgress() {
    const { getDailyProgress, dailyTime, dailyGoal } = useTimerStore();
    const { user } = useUserStore();

    const dailyProgress = getDailyProgress();
    const hoursWorked = Math.floor(dailyTime / 60);
    const minutesWorked = dailyTime % 60;
    const dailyGoalHours = Math.floor(dailyGoal / 60);

    const progressItems = [
        {
            title: 'Daily Goal',
            progress: dailyProgress,
            icon: Target,
            color: '#58CC02',
            value: `${hoursWorked}h ${minutesWorked}m`,
            target: `${dailyGoalHours}h goal`,
            size: 'large' as const
        },
        {
            title: 'Current Streak',
            progress: Math.min((user?.streak || 0) * 10, 100),
            icon: Flame,
            color: '#FF6B35',
            value: `${user?.streak || 0}`,
            target: 'days',
            size: 'medium' as const
        },
        {
            title: 'Level Progress',
            progress: user ? (user.currentXP / (user.currentXP + user.xpToNextLevel)) * 100 : 0,
            icon: Trophy,
            color: '#FFD700',
            value: `${user?.level || 1}`,
            target: `${user?.xpToNextLevel || 0} XP to next`,
            size: 'medium' as const
        }
    ];

    return (
        <div className="col-span-full lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Daily Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {progressItems.map((item, index) => {
                            const Icon = item.icon;
                            const size = item.size === 'large' ? 140 : 100;

                            return (
                                <motion.div
                                    key={item.title}
                                    className="flex flex-col items-center text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.2,
                                        ease: "easeOut"
                                    }}
                                >
                                    <CircularProgress
                                        progress={item.progress}
                                        size={size}
                                        color={item.color}
                                    >
                                        <div className="flex flex-col items-center">
                                            <Icon
                                                className="w-6 h-6 mb-1"
                                                style={{ color: item.color }}
                                            />
                                            <motion.div
                                                className="text-lg font-bold text-gray-900"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1 + index * 0.2 }}
                                            >
                                                {item.value}
                                            </motion.div>
                                        </div>
                                    </CircularProgress>

                                    <div className="mt-3">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {item.target}
                                        </p>
                                        <motion.div
                                            className="mt-2"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: '100%' }}
                                            transition={{ delay: 1.5 + index * 0.2, duration: 0.8 }}
                                        >
                                            <ProgressBar
                                                value={item.progress}
                                                color={item.color === '#58CC02' ? 'primary' :
                                                    item.color === '#FF6B35' ? 'streak' : 'xp'}
                                                size="sm"
                                                animated={true}
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}