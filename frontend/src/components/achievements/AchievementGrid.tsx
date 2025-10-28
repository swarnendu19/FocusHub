import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Trophy, Star, Zap, Award } from 'lucide-react';
import { AchievementCard } from './AchievementCard';
import { AchievementModal } from './AchievementModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Achievement } from '@/types';

interface AchievementGridProps {
    achievements: Achievement[];
    unlockedAchievements: string[];
    className?: string;
    onAchievementClick?: (achievement: Achievement) => void;
}

type FilterType = 'all' | 'unlocked' | 'locked' | 'common' | 'rare' | 'epic' | 'legendary';

export function AchievementGrid({
    achievements,
    unlockedAchievements,
    className,
    onAchievementClick
}: AchievementGridProps) {
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredAchievements = useMemo(() => {
        let filtered = achievements;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(achievement =>
                achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        switch (selectedFilter) {
            case 'unlocked':
                filtered = filtered.filter(achievement =>
                    unlockedAchievements.includes(achievement.id)
                );
                break;
            case 'locked':
                filtered = filtered.filter(achievement =>
                    !unlockedAchievements.includes(achievement.id)
                );
                break;
            case 'common':
            case 'rare':
            case 'epic':
            case 'legendary':
                filtered = filtered.filter(achievement =>
                    achievement.rarity === selectedFilter
                );
                break;
            default:
                // 'all' - no additional filtering
                break;
        }

        return filtered;
    }, [achievements, unlockedAchievements, selectedFilter, searchQuery]);

    const stats = useMemo(() => {
        const total = achievements.length;
        const unlocked = achievements.filter(a => unlockedAchievements.includes(a.id)).length;
        const totalXP = achievements
            .filter(a => unlockedAchievements.includes(a.id))
            .reduce((sum, a) => sum + a.xpReward, 0);

        const rarityStats = {
            common: achievements.filter(a => a.rarity === 'common' && unlockedAchievements.includes(a.id)).length,
            rare: achievements.filter(a => a.rarity === 'rare' && unlockedAchievements.includes(a.id)).length,
            epic: achievements.filter(a => a.rarity === 'epic' && unlockedAchievements.includes(a.id)).length,
            legendary: achievements.filter(a => a.rarity === 'legendary' && unlockedAchievements.includes(a.id)).length,
        };

        return { total, unlocked, totalXP, rarityStats };
    }, [achievements, unlockedAchievements]);

    const handleAchievementClick = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        onAchievementClick?.(achievement);
    };

    const filterOptions = [
        { value: 'all', label: 'All', icon: Trophy },
        { value: 'unlocked', label: 'Unlocked', icon: Star },
        { value: 'locked', label: 'Locked', icon: Award },
        { value: 'common', label: 'Common', icon: Trophy },
        { value: 'rare', label: 'Rare', icon: Trophy },
        { value: 'epic', label: 'Epic', icon: Trophy },
        { value: 'legendary', label: 'Legendary', icon: Trophy },
    ];

    return (
        <div className={className}>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Trophy className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Total</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                            {stats.unlocked}/{stats.total}
                        </div>
                        <div className="text-xs text-blue-600">
                            {Math.round((stats.unlocked / stats.total) * 100)}% Complete
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">XP Earned</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-900">
                            {stats.totalXP.toLocaleString()}
                        </div>
                        <div className="text-xs text-yellow-600">
                            From achievements
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Star className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Rare+</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                            {stats.rarityStats.rare + stats.rarityStats.epic + stats.rarityStats.legendary}
                        </div>
                        <div className="text-xs text-purple-600">
                            Special achievements
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Legendary</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                            {stats.rarityStats.legendary}
                        </div>
                        <div className="text-xs text-green-600">
                            Ultimate achievements
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search achievements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                    <Button
                        variant="outline"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="capitalize">{selectedFilter}</span>
                    </Button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {filterOptions.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSelectedFilter(option.value as FilterType);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2 ${selectedFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                }`}
                                        >
                                            <IconComponent className="w-4 h-4" />
                                            <span>{option.label}</span>
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Achievement Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                layout
            >
                <AnimatePresence mode="popLayout">
                    {filteredAchievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05
                            }}
                            layout
                        >
                            <AchievementCard
                                achievement={achievement}
                                isUnlocked={unlockedAchievements.includes(achievement.id)}
                                onClick={() => handleAchievementClick(achievement)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredAchievements.length === 0 && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No achievements found
                    </h3>
                    <p className="text-gray-600">
                        {searchQuery
                            ? `No achievements match "${searchQuery}"`
                            : `No ${selectedFilter} achievements available`
                        }
                    </p>
                    {(searchQuery || selectedFilter !== 'all') && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedFilter('all');
                            }}
                            className="mt-4"
                        >
                            Clear filters
                        </Button>
                    )}
                </motion.div>
            )}

            {/* Achievement Detail Modal */}
            <AchievementModal
                achievement={selectedAchievement}
                isUnlocked={selectedAchievement ? unlockedAchievements.includes(selectedAchievement.id) : false}
                isOpen={!!selectedAchievement}
                onClose={() => setSelectedAchievement(null)}
            />
        </div>
    );
}