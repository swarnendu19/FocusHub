import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Trophy, Zap } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { formatDurationShort } from '@/utils/timeUtils';

interface Notification {
    id: string;
    type: 'session_complete' | 'milestone' | 'streak' | 'xp_gained';
    title: string;
    message: string;
    icon: React.ReactNode;
    color: string;
    duration?: number;
}

export function TimerNotifications() {
    const { sessions } = useTimerStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastSessionCount, setLastSessionCount] = useState(sessions.length);

    useEffect(() => {
        // Check for new completed sessions
        if (sessions.length > lastSessionCount) {
            const newSession = sessions[sessions.length - 1];

            // Session completion notification
            const sessionNotification: Notification = {
                id: `session-${newSession.id}`,
                type: 'session_complete',
                title: 'Session Complete! 🎉',
                message: `Great work! You focused for ${formatDurationShort(newSession.duration)}`,
                icon: <CheckCircle className="w-5 h-5" />,
                color: 'bg-green-500',
                duration: 4000,
            };

            // XP gained notification
            const xpNotification: Notification = {
                id: `xp-${newSession.id}`,
                type: 'xp_gained',
                title: 'XP Earned! ⚡',
                message: `+${newSession.xpEarned} XP added to your total`,
                icon: <Zap className="w-5 h-5" />,
                color: 'bg-yellow-500',
                duration: 3000,
            };

            setNotifications(prev => [...prev, sessionNotification, xpNotification]);

            // Check for milestones
            const sessionDurationMinutes = Math.floor(newSession.duration / 60000);
            if (sessionDurationMinutes >= 60) {
                const milestoneNotification: Notification = {
                    id: `milestone-${newSession.id}`,
                    type: 'milestone',
                    title: 'Milestone Achieved! 🏆',
                    message: 'You completed a 1+ hour focus session!',
                    icon: <Trophy className="w-5 h-5" />,
                    color: 'bg-purple-500',
                    duration: 5000,
                };
                setNotifications(prev => [...prev, milestoneNotification]);
            } else if (sessionDurationMinutes >= 25) {
                const pomodoroNotification: Notification = {
                    id: `pomodoro-${newSession.id}`,
                    type: 'milestone',
                    title: 'Pomodoro Complete! 🍅',
                    message: 'You completed a 25+ minute focus session!',
                    icon: <Clock className="w-5 h-5" />,
                    color: 'bg-red-500',
                    duration: 4000,
                };
                setNotifications(prev => [...prev, pomodoroNotification]);
            }
        }

        setLastSessionCount(sessions.length);
    }, [sessions.length, lastSessionCount]);

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    useEffect(() => {
        // Auto-remove notifications after their duration
        notifications.forEach(notification => {
            if (notification.duration) {
                const timer = setTimeout(() => {
                    removeNotification(notification.id);
                }, notification.duration);

                return () => clearTimeout(timer);
            }
        });
    }, [notifications]);

    const notificationVariants = {
        initial: {
            opacity: 0,
            x: 300,
            scale: 0.8,
        },
        animate: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            },
        },
        exit: {
            opacity: 0,
            x: 300,
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

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        variants={notificationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                        className="pointer-events-auto"
                    >
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
                            <div className="flex items-start gap-3">
                                <motion.div
                                    variants={iconVariants}
                                    initial="initial"
                                    animate="animate"
                                    className={`${notification.color} text-white rounded-full p-2 flex-shrink-0`}
                                >
                                    {notification.icon}
                                </motion.div>

                                <div className="flex-1 min-w-0">
                                    <motion.h4
                                        className="text-sm font-semibold text-gray-900 mb-1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {notification.title}
                                    </motion.h4>
                                    <motion.p
                                        className="text-sm text-gray-600"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {notification.message}
                                    </motion.p>
                                </div>

                                <button
                                    onClick={() => removeNotification(notification.id)}
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

                            {/* Progress bar for auto-dismiss */}
                            {notification.duration && (
                                <motion.div
                                    className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <motion.div
                                        className={`h-full ${notification.color} opacity-60`}
                                        initial={{ width: '100%' }}
                                        animate={{ width: '0%' }}
                                        transition={{
                                            duration: notification.duration / 1000,
                                            ease: 'linear',
                                        }}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}