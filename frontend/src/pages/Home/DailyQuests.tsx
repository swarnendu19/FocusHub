import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameCard } from '@/components/ui/game-card';
import { Badge } from '@/components/ui/badge';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import {
    Target,
    Clock,
    Flame,
    Trophy,
    CheckCircle,
    Star,
    Zap,
    Award
} from 'lucide-react';

interface Quest {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    progress: number;
    maxProgress: number;
    xpReward: number;
    isCompleted: boolean;
    color: 'primary' | 'secondary' | 'accent' | 'xp' | 'streak';
    rarity: 'common' | 'rare' | 'epic';
}

function QuestCard({ quest, onComplete }: { quest: Quest; onComplete: (questId: string) => void }) {
    const Icon = quest.icon;
    const progressPercentage = (quest.progress / quest.maxProgress) * 100;

    const rarityColors = {
        common: 'border-gray-300 bg-gray-50',
        rare: 'border-blue-300 bg-blue-50',
        epic: 'border-purple-300 bg-purple-50'
    };

    const rarityBadges = {
        common: 'bg-gray-100 text-gray-700',
        rare: 'bg-blue-100 text-blue-700',
        epic: 'bg-purple-100 text-purple-700'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: -100 }}
            transition={{ duration: 0.3 }}
        >
            <GameCard
                title={quest.title}
                description={quest.description}
                progress={progressPercentage}
                xpReward={quest.xpReward}
                isCompleted={quest.isCompleted}
                onClick={() => !quest.isCompleted && onComplete(quest.id)}
                icon={<Icon className="w-6 h-6" />}
                color={quest.color}
                className={cn(
                    "transition-all duration-200",
                    rarityColors[quest.rarity],
                    quest.isCompleted && "opacity-75"
                )}
            >
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={rarityBadges[quest.rarity]}
                        >
                            {quest.rarity}
                        </Badge>
                        <span className="text-sm text-gray-600">
                            {quest.progress}/{quest.maxProgress}
                        </span>
                    </div>

                    {quest.isCompleted && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                        >
                            <CheckCircle className="w-5 h-5 text-primary" />
                        </motion.div>
                    )}
                </div>
            </GameCard>
        </motion.div>
    );
}

export function DailyQuests() {
    const { dailyTime, sessions, getDailyProgress } = useTimerStore();
    const { user, addXP } = useUserStore();
    const [completedQuests, setCompletedQuests] = React.useState<string[]>([]);

    // Generate daily quests based on user progress and current stats
    const generateDailyQuests = React.useCallback((): Quest[] => {
        const todaysSessions = sessions.filter(session => {
            const today = new Date();
            const sessionDate = new Date(session.startTime);
            return sessionDate.toDateString() === today.toDateString();
        });

        return [
            {
                id: 'daily-focus-1h',
                title: 'Focus Master',
                description: 'Complete 1 hour of focused work',
                icon: Clock,
                progress: Math.min(dailyTime, 60),
                maxProgress: 60,
                xpReward: 50,
                isCompleted: dailyTime >= 60 || completedQuests.includes('daily-focus-1h'),
                color: 'primary' as const,
                rarity: 'common' as const
            },
            {
                id: 'session-streak',
                title: 'Session Streak',
                description: 'Complete 3 focus sessions today',
                icon: Flame,
                progress: Math.min(todaysSessions.length, 3),
                maxProgress: 3,
                xpReward: 75,
                isCompleted: todaysSessions.length >= 3 || completedQuests.includes('session-streak'),
                color: 'streak' as const,
                rarity: 'rare' as const
            },
            {
                id: 'daily-goal',
                title: 'Goal Crusher',
                description: 'Reach your daily time goal',
                icon: Target,
                progress: Math.min(getDailyProgress(), 100),
                maxProgress: 100,
                xpReward: 100,
                isCompleted: getDailyProgress() >= 100 || completedQuests.includes('daily-goal'),
                color: 'accent' as const,
                rarity: 'epic' as const
            },
            {
                id: 'early-bird',
                title: 'Early Bird',
                description: 'Start your first session before 9 AM',
                icon: Star,
                progress: todaysSessions.some(session => {
                    const hour = new Date(session.startTime).getHours();
                    return hour < 9;
                }) ? 1 : 0,
                maxProgress: 1,
                xpReward: 25,
                isCompleted: todaysSessions.some(session => {
                    const hour = new Date(session.startTime).getHours();
                    return hour < 9;
                }) || completedQuests.includes('early-bird'),
                color: 'xp' as const,
                rarity: 'common' as const
            },
            {
                id: 'power-session',
                title: 'Power Session',
                description: 'Complete a 45+ minute session',
                icon: Zap,
                progress: todaysSessions.some(session => session.duration >= 45 * 60 * 1000) ? 1 : 0,
                maxProgress: 1,
                xpReward: 60,
                isCompleted: todaysSessions.some(session => session.duration >= 45 * 60 * 1000) || completedQuests.includes('power-session'),
                color: 'secondary' as const,
                rarity: 'rare' as const
            }
        ];
    }, [dailyTime, sessions, getDailyProgress, completedQuests]);

    const [quests, setQuests] = React.useState<Quest[]>(generateDailyQuests);

    // Update quests when dependencies change
    React.useEffect(() => {
        setQuests(generateDailyQuests());
    }, [generateDailyQuests]);

    const handleQuestComplete = (questId: string) => {
        const quest = quests.find(q => q.id === questId);
        if (quest && !quest.isCompleted && quest.progress >= quest.maxProgress) {
            setCompletedQuests(prev => [...prev, questId]);
            addXP(quest.xpReward);

            // Show celebration animation
            // This could trigger a toast or celebration effect
        }
    };

    const activeQuests = quests.filter(quest => !quest.isCompleted);
    const completedQuestsData = quests.filter(quest => quest.isCompleted);
    const totalXPAvailable = quests.reduce((sum, quest) => sum + quest.xpReward, 0);
    const earnedXP = completedQuestsData.reduce((sum, quest) => sum + quest.xpReward, 0);

    return (
        <div className="col-span-full">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-accent" />
                            Daily Quests
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xp border-xp">
                                {earnedXP}/{totalXPAvailable} XP
                            </Badge>
                            <Badge variant="default" className="bg-primary">
                                {completedQuestsData.length}/{quests.length} Complete
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Active Quests */}
                        {activeQuests.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Active Quests
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {activeQuests.map((quest) => (
                                            <QuestCard
                                                key={quest.id}
                                                quest={quest}
                                                onComplete={handleQuestComplete}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* Completed Quests */}
                        {completedQuestsData.length > 0 && (
                            <div>
                                <motion.h3
                                    className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Trophy className="w-4 h-4 text-primary" />
                                    Completed Today ({completedQuestsData.length})
                                </motion.h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {completedQuestsData.map((quest) => (
                                            <QuestCard
                                                key={quest.id}
                                                quest={quest}
                                                onComplete={handleQuestComplete}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {quests.length === 0 && (
                            <motion.div
                                className="text-center py-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">
                                    New quests will appear here daily!
                                </p>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}