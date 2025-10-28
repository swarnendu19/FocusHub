import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Target, Zap, Star, Award, Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Achievement } from '@/types';

interface AchievementCategoriesProps {
    achievements: Achievement[];
    unlockedAchievements: string[];
    onCategorySelect: (category: string) => void;
    selectedCategory?: string;
    className?: string;
}

export type AchievementCategory = {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
};

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
    {
        id: 'all',
        name: 'All Achievements',
        description: 'View all available achievements',
        icon: Trophy,
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
    },
    {
        id: 'time-tracking',
        name: 'Time Tracking',
        description: 'Achievements for tracking time and maintaining focus',
        icon: Clock,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    {
        id: 'task-completion',
        name: 'Task Completion',
        description: 'Achievements for completing tasks and projects',
        icon: Target,
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
    {
        id: 'streaks',
        name: 'Consistency',
        description: 'Achievements for maintaining streaks and consistency',
        icon: Zap,
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
    },
    {
        id: 'experience',
        name: 'Experience',
        description: 'Achievements for gaining XP and leveling up',
        icon: Star,
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    },
    {
        id: 'special',
        name: 'Special',
        description: 'Unique and rare achievements',
        icon: Award,
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
    }
];

export function AchievementCategories({
    achievements,
    unlockedAchievements,
    onCategorySelect,
    selectedCategory = 'all',
    className
}: AchievementCategoriesProps) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const getCategoryStats = (categoryId: string) => {
        let categoryAchievements: Achievement[] = [];

        switch (categoryId) {
            case 'all':
                categoryAchievements = achievements;
                break;
            case 'time-tracking':
                categoryAchievements = achievements.filter(a =>
                    ['first-timer', 'hour-warrior', 'marathon-tracker', 'time-master', 'early-bird', 'night-owl'].includes(a.id)
                );
                break;
            case 'task-completion':
                categoryAchievements = achievements.filter(a =>
                    ['task-starter', 'productive-day', 'task-machine', 'completion-legend', 'weekend-warrior', 'perfectionist'].includes(a.id)
                );
                break;
            case 'streaks':
                categoryAchievements = achievements.filter(a =>
                    ['streak-starter', 'week-warrior', 'consistency-king', 'unstoppable-force'].includes(a.id)
                );
                break;
            case 'experience':
                categoryAchievements = achievements.filter(a =>
                    ['xp-collector', 'level-climber', 'experience-master', 'legendary-achiever'].includes(a.id)
                );
                break;
            case 'special':
                categoryAchievements = achievements.filter(a =>
                    a.rarity === 'legendary' || ['early-bird', 'night-owl', 'weekend-warrior', 'perfectionist'].includes(a.id)
                );
                break;
            default:
                categoryAchievements = achievements;
        }

        const total = categoryAchievements.length;
        const unlocked = categoryAchievements.filter(a => unlockedAchievements.includes(a.id)).length;
        const percentage = total > 0 ? (unlocked / total) * 100 : 0;

        return { total, unlocked, percentage };
    };

    return (
        <div className={className}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACHIEVEMENT_CATEGORIES.map((category, index) => {
                    const IconComponent = category.icon;
                    const stats = getCategoryStats(category.id);
                    const isSelected = selectedCategory === category.id;
                    const isHovered = hoveredCategory === category.id;

                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`p-4 cursor-pointer transition-all duration-300 ${isSelected
                                        ? `${category.bgColor} ${category.borderColor} border-2 shadow-lg`
                                        : 'hover:shadow-md border border-gray-200'
                                    }`}
                                onClick={() => onCategorySelect(category.id)}
                                onMouseEnter={() => setHoveredCategory(category.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <div className="flex items-start space-x-3">
                                    {/* Icon */}
                                    <motion.div
                                        className={`p-2 rounded-lg ${category.bgColor} ${category.borderColor} border`}
                                        animate={{
                                            scale: isHovered || isSelected ? 1.1 : 1,
                                            rotate: isHovered ? [0, -5, 5, 0] : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IconComponent className={`w-5 h-5 ${category.color}`} />
                                    </motion.div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-sm ${isSelected ? category.color : 'text-gray-900'}`}>
                                            {category.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                            {category.description}
                                        </p>

                                        {/* Progress */}
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>{stats.unlocked}/{stats.total}</span>
                                                <span>{Math.round(stats.percentage)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full ${isSelected
                                                            ? `bg-gradient-to-r ${category.color.replace('text-', 'from-').replace('-700', '-400')} to-${category.color.replace('text-', '').replace('-700', '-600')}`
                                                            : 'bg-gray-400'
                                                        }`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stats.percentage}%` }}
                                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Selection Indicator */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            className="absolute top-2 right-2"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${category.color.replace('text-', 'bg-').replace('-700', '-500')}`} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}