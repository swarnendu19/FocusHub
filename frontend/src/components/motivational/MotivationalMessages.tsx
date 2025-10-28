import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Trophy, Zap, Heart, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';

interface MotivationalMessage {
    id: string;
    text: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    trigger: 'time' | 'streak' | 'level' | 'task' | 'random';
}

const motivationalMessages: MotivationalMessage[] = [
    {
        id: 'focus-power',
        text: "Your focus is your superpower! 💪",
        icon: <Zap className="w-5 h-5" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        trigger: 'time'
    },
    {
        id: 'progress-daily',
        text: "Every minute counts towards your goals! ⏰",
        icon: <Target className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        trigger: 'time'
    },
    {
        id: 'streak-motivation',
        text: "Consistency is the key to greatness! 🔥",
        icon: <Sparkles className="w-5 h-5" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        trigger: 'streak'
    },
    {
        id: 'level-up',
        text: "You're leveling up your life! 🚀",
        icon: <Trophy className="w-5 h-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        trigger: 'level'
    },
    {
        id: 'task-complete',
        text: "Another task conquered! You're unstoppable! ✨",
        icon: <Star className="w-5 h-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        trigger: 'task'
    },
    {
        id: 'keep-going',
        text: "Small steps lead to big achievements! 👣",
        icon: <Heart className="w-5 h-5" />,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        trigger: 'random'
    },
    {
        id: 'focus-zone',
        text: "You're in the zone! Keep that momentum! 🎯",
        icon: <Target className="w-5 h-5" />,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        trigger: 'time'
    },
    {
        id: 'daily-hero',
        text: "You're the hero of your own story! 🦸‍♂️",
        icon: <Sparkles className="w-5 h-5" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        trigger: 'random'
    }
];

interface MotivationalMessagesProps {
    className?: string;
}

export function MotivationalMessages({ className = '' }: MotivationalMessagesProps) {
    const { user } = useUserStore();
    const { isRunning, sessions } = useTimerStore();
    const [currentMessage, setCurrentMessage] = useState<MotivationalMessage | null>(null);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);

    const getTimeBasedMessage = () => {
        const hour = new Date().getHours();
        if (hour < 9) {
            return "Early bird catches the worm! 🐦";
        } else if (hour < 12) {
            return "Morning productivity at its peak! ☀️";
        } else if (hour < 17) {
            return "Afternoon focus session activated! 💼";
        } else if (hour < 20) {
            return "Evening dedication pays off! 🌅";
        } else {
            return "Night owl mode: ON! 🦉";
        }
    };

    const getContextualMessage = (): MotivationalMessage => {
        const availableMessages = motivationalMessages.filter(
            msg => !messageHistory.includes(msg.id)
        );

        if (availableMessages.length === 0) {
            setMessageHistory([]);
            return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        }

        // Prioritize based on current context
        let contextMessages = availableMessages;

        if (isRunning) {
            contextMessages = availableMessages.filter(msg => msg.trigger === 'time');
        } else if (user?.streak && user.streak > 0) {
            contextMessages = availableMessages.filter(msg => msg.trigger === 'streak');
        } else if (user?.level && user.level > 1) {
            contextMessages = availableMessages.filter(msg => msg.trigger === 'level');
        }

        if (contextMessages.length === 0) {
            contextMessages = availableMessages.filter(msg => msg.trigger === 'random');
        }

        if (contextMessages.length === 0) {
            contextMessages = availableMessages;
        }

        return contextMessages[Math.floor(Math.random() * contextMessages.length)];
    };

    const showNewMessage = () => {
        const message = getContextualMessage();
        setCurrentMessage(message);
        setMessageHistory(prev => [...prev, message.id]);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            setCurrentMessage(null);
        }, 5000);
    };

    // Show message on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            showNewMessage();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Show message when timer starts
    useEffect(() => {
        if (isRunning) {
            const timer = setTimeout(() => {
                showNewMessage();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isRunning]);

    // Show message when user completes tasks (based on sessions)
    useEffect(() => {
        if (sessions.length > 0) {
            const timer = setTimeout(() => {
                const taskMessage = motivationalMessages.find(msg => msg.trigger === 'task');
                if (taskMessage && !messageHistory.includes(taskMessage.id)) {
                    setCurrentMessage(taskMessage);
                    setMessageHistory(prev => [...prev, taskMessage.id]);
                    setTimeout(() => setCurrentMessage(null), 5000);
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [sessions.length]);

    // Periodic motivational messages
    useEffect(() => {
        const interval = setInterval(() => {
            if (!currentMessage && Math.random() < 0.3) { // 30% chance every interval
                showNewMessage();
            }
        }, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, [currentMessage, messageHistory]);

    const messageVariants = {
        initial: {
            opacity: 0,
            y: 50,
            scale: 0.8,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            y: -50,
            scale: 0.8,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
    };

    const iconVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 20,
                delay: 0.2,
            },
        },
    };

    const sparkleVariants = {
        animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
            <AnimatePresence mode="wait">
                {currentMessage && (
                    <motion.div
                        variants={messageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="relative"
                    >
                        <Card className={`p-4 max-w-sm shadow-lg border-2 ${currentMessage.bgColor} border-opacity-50`}>
                            <div className="flex items-start gap-3">
                                <motion.div
                                    variants={iconVariants}
                                    initial="initial"
                                    animate="animate"
                                    className={`${currentMessage.color} flex-shrink-0 mt-0.5`}
                                >
                                    {currentMessage.icon}
                                </motion.div>

                                <div className="flex-1">
                                    <motion.p
                                        className="text-sm font-medium text-gray-800 leading-relaxed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {currentMessage.text}
                                    </motion.p>
                                </div>

                                <button
                                    onClick={() => setCurrentMessage(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Decorative sparkles */}
                            <div className="absolute -top-1 -right-1 pointer-events-none">
                                <motion.div
                                    variants={sparkleVariants}
                                    animate="animate"
                                    className="w-3 h-3 text-yellow-400"
                                >
                                    <Sparkles className="w-full h-full" />
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manual trigger button when no message is shown */}
            <AnimatePresence>
                {!currentMessage && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={showNewMessage}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Sparkles className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}