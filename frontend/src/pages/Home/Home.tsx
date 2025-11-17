import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from './DashboardLayout';
import { DailyProgress } from './DailyProgress';
import { QuickStats } from './QuickStats';
import { DailyQuests } from './DailyQuests';
import { ActiveTimer, TimerHistory, TimerNotifications } from '@/components/timer';
import { StreakCounter } from '@/components/streak';
import { MotivationalMessages } from '@/components/motivational';
import { AchievementPreview } from '@/components/achievements';
import { DailyGoalProgress } from '@/components/goals';
import { useUserStore } from '@/stores/userStore';
    
export function Home() {
    const { user } = useUserStore();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className="space-y-5 p-6"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            {/* Header Section */}
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h1 className="text-3xl font-bold text-[#FAFAFA]">
                    {getGreeting()}{user?.username ? `, ${user.username}` : ''}! 👋
                </h1>
                <p className="text-[#FAFAFA]">
                    Ready to level up your productivity? Let's make today count!
                </p>
            </motion.div>

            {/* Active Timer - Prominent display */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <ActiveTimer />
            </motion.div>

            {/* Dashboard Grid */}
            <DashboardLayout>
                {/* Daily Progress - Takes up 2 columns on large screens */}
                <DailyProgress />

                {/* Quick Stats - 4 individual stat cards */}
                <QuickStats />
            </DashboardLayout>

            {/* Streak Counter and Daily Goal Progress - Side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <StreakCounter />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <DailyGoalProgress />
                </motion.div>
            </div>

            {/* Timer History and Daily Quests - Side by side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <TimerHistory maxItems={5} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                >
                    <DailyQuests />
                </motion.div>
            </div>

            {/* Achievement Preview - Full width */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
            >
                <AchievementPreview />
            </motion.div>

            {/* Motivational Messages - Fixed position overlay */}
            <MotivationalMessages />

            {/* Timer Notifications - Fixed position overlay */}
            <TimerNotifications />
        </motion.div>
    );
}