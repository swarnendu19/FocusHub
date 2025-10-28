import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/userStore';

interface StreakCounterProps {
    className?: string;
}

export function StreakCounter({ className = '' }: StreakCounterProps) {
    const { user } = useUserStore();
    const [showCelebration, setShowCelebration] = useState(false);
    const [previousStreak, setPreviousStreak] = useState(0);

    const streak = user?.streak || 0;

    // Trigger celebration when streak increases
    useEffect(() => {
        if (streak > previousStreak && previousStreak > 0) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 3000);
            return () => clearTimeout(timer);
        }
        setPreviousStreak(streak);
    }, [streak, previousStreak]);

    const getStreakMessage = () => {
        if (streak === 0) return "Start your streak today!";
        if (streak === 1) return "Great start! Keep it going!";
        if (streak < 7) return "Building momentum!";
        if (streak < 30) return "You're on fire! 🔥";
        if (streak < 100) return "Incredible dedication!";
        return "Legendary streak! 🏆";
    };

    const getStreakColor = () => {
        if (streak === 0) return "text-gray-500";
        if (streak < 7) return "text-orange-500";
        if (streak < 30) return "text-red-500";
        return "text-purple-600";
    };

    const getFlameIntensity = () => {
        if (streak === 0) return 0;
        if (streak < 7) return 1;
        if (streak < 30) return 2;
        return 3;
    };

    const flameVariants = {
        idle: {
            scale: 1,
            rotate: 0,
            filter: 'brightness(1)',
        },
        burning: {
            scale: [1, 1.1, 1],
            rotate: [-2, 2, -2, 0],
            filter: [
                'brightness(1) hue-rotate(0deg)',
                'brightness(1.2) hue-rotate(10deg)',
                'brightness(1) hue-rotate(0deg)',
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
        celebration: {
            scale: [1, 1.5, 1.2, 1],
            rotate: [0, 360, 0],
            filter: [
                'brightness(1)',
                'brightness(2) hue-rotate(180deg)',
                'brightness(1.5) hue-rotate(90deg)',
                'brightness(1)',
            ],
            transition: {
                duration: 1.5,
                ease: 'easeOut',
            },
        },
    };

    const counterVariants = {
        initial: { scale: 1 },
        increment: {
            scale: [1, 1.3, 1],
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const celebrationVariants = {
        initial: { opacity: 0, scale: 0.5, y: 20 },
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

    return (
        <div className={`relative ${className}`}>
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            variants={flameVariants}
                            animate={
                                showCelebration
                                    ? 'celebration'
                                    : streak > 0
                                        ? 'burning'
                                        : 'idle'
                            }
                            className={`p-3 rounded-full bg-gradient-to-br from-orange-100 to-red-100 ${getStreakColor()}`}
                        >
                            <Flame className="w-6 h-6" />
                        </motion.div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Daily Streak
                            </h3>
                            <p className="text-sm text-gray-600">
                                {getStreakMessage()}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <motion.div
                            variants={counterVariants}
                            animate={showCelebration ? 'increment' : 'initial'}
                            className={`text-3xl font-bold ${getStreakColor()}`}
                        >
                            {streak}
                        </motion.div>
                        <div className="text-sm text-gray-500">
                            {streak === 1 ? 'day' : 'days'}
                        </div>
                    </div>
                </div>

                {/* Streak visualization */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>Next milestone: {Math.ceil((streak + 1) / 7) * 7} days</span>
                    </div>

                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min((streak % 7) / 7 * 100, 100)}%`
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>

                    {/* Streak milestones */}
                    <div className="flex justify-between text-xs text-gray-500">
                        <span className={streak >= 7 ? 'text-orange-600 font-medium' : ''}>
                            7 days
                        </span>
                        <span className={streak >= 30 ? 'text-red-600 font-medium' : ''}>
                            30 days
                        </span>
                        <span className={streak >= 100 ? 'text-purple-600 font-medium' : ''}>
                            100 days
                        </span>
                    </div>
                </div>

                {/* Flame particles for high streaks */}
                {streak >= 7 && (
                    <div className="absolute -top-2 -right-2 pointer-events-none">
                        {Array.from({ length: getFlameIntensity() }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-orange-400 rounded-full"
                                animate={{
                                    y: [-10, -30, -10],
                                    x: [0, Math.random() * 20 - 10, 0],
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2 + Math.random(),
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                    ease: 'easeOut',
                                }}
                                style={{
                                    left: `${i * 8}px`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </Card>

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
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
                            <div className="text-center">
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: 'easeOut',
                                    }}
                                    className="text-4xl mb-2"
                                >
                                    🔥
                                </motion.div>
                                <div className="text-lg font-bold text-orange-600">
                                    Streak Extended!
                                </div>
                                <div className="text-sm text-gray-600">
                                    {streak} days and counting!
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}