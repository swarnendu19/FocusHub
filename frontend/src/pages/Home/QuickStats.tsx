import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';
import { Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

function AnimatedCounter({ value, duration = 2, suffix = '', prefix = '' }: AnimatedCounterProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        const controls = animate(count, value, {
            duration,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(Math.round(latest))
        });

        return controls.stop;
    }, [count, value, duration]);

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {prefix}{displayValue}{suffix}
        </motion.span>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    suffix?: string;
    prefix?: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    suffix = '',
    prefix = '',
    subtitle,
    trend,
    trendValue
}: StatCardProps) {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className="p-3 rounded-full"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <Icon
                                className="w-6 h-6"
                                style={{ color }}
                            />
                        </div>
                        {trend && trendValue && (
                            <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' :
                                    trend === 'down' ? 'text-red-600' :
                                        'text-gray-600'
                                }`}>
                                <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''
                                    }`} />
                                {trendValue}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <motion.div
                            className="text-3xl font-bold text-gray-900"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <AnimatedCounter
                                value={value}
                                suffix={suffix}
                                prefix={prefix}
                                duration={1.5}
                            />
                        </motion.div>

                        <motion.h3
                            className="text-sm font-medium text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                        >
                            {title}
                        </motion.h3>

                        {subtitle && (
                            <motion.p
                                className="text-xs text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.3 }}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function QuickStats() {
    const { dailyTime, weeklyTime, sessions, getAverageSessionLength } = useTimerStore();
    const { user, getCompletedTasksCount } = useUserStore();

    const stats = [
        {
            title: 'Today\'s Focus',
            value: Math.floor(dailyTime / 60),
            suffix: 'h',
            icon: Clock,
            color: '#58CC02',
            subtitle: `${dailyTime % 60} minutes`,
            trend: 'up' as const,
            trendValue: '+12%'
        },
        {
            title: 'Tasks Completed',
            value: getCompletedTasksCount(),
            icon: CheckCircle,
            color: '#1CB0F6',
            subtitle: 'This week',
            trend: 'up' as const,
            trendValue: '+5'
        },
        {
            title: 'Current Level',
            value: user?.level || 1,
            icon: Star,
            color: '#FFD700',
            subtitle: `${user?.currentXP || 0} XP earned`,
            trend: 'neutral' as const
        },
        {
            title: 'Avg Session',
            value: Math.floor(getAverageSessionLength() / 60000) || 0,
            suffix: 'm',
            icon: TrendingUp,
            color: '#FF9600',
            subtitle: 'Focus duration',
            trend: 'up' as const,
            trendValue: '+3m'
        }
    ];

    return (
        <>
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                    }}
                >
                    <StatCard {...stat} />
                </motion.div>
            ))}
        </>
    );
}