import type { Achievement, User } from '@/types';

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
    // Time Tracking Achievements
    {
        id: 'first-timer',
        name: 'First Timer',
        description: 'Start your first time tracking session',
        icon: 'clock',
        rarity: 'common',
        xpReward: 50,
        maxProgress: 1
    },
    {
        id: 'hour-warrior',
        name: 'Hour Warrior',
        description: 'Track time for 1 hour in a single session',
        icon: 'clock',
        rarity: 'common',
        xpReward: 100,
        maxProgress: 1
    },
    {
        id: 'marathon-tracker',
        name: 'Marathon Tracker',
        description: 'Track time for 4 hours in a single session',
        icon: 'clock',
        rarity: 'rare',
        xpReward: 300,
        maxProgress: 1
    },
    {
        id: 'time-master',
        name: 'Time Master',
        description: 'Track time for 8 hours in a single session',
        icon: 'clock',
        rarity: 'epic',
        xpReward: 500,
        maxProgress: 1
    },

    // Task Completion Achievements
    {
        id: 'task-starter',
        name: 'Task Starter',
        description: 'Complete your first task',
        icon: 'target',
        rarity: 'common',
        xpReward: 75,
        maxProgress: 1
    },
    {
        id: 'productive-day',
        name: 'Productive Day',
        description: 'Complete 5 tasks in a single day',
        icon: 'target',
        rarity: 'rare',
        xpReward: 250,
        maxProgress: 5
    },
    {
        id: 'task-machine',
        name: 'Task Machine',
        description: 'Complete 25 tasks total',
        icon: 'target',
        rarity: 'epic',
        xpReward: 400,
        maxProgress: 25
    },
    {
        id: 'completion-legend',
        name: 'Completion Legend',
        description: 'Complete 100 tasks total',
        icon: 'trophy',
        rarity: 'legendary',
        xpReward: 1000,
        maxProgress: 100
    },

    // Streak Achievements
    {
        id: 'streak-starter',
        name: 'Streak Starter',
        description: 'Maintain a 3-day streak',
        icon: 'zap',
        rarity: 'common',
        xpReward: 100,
        maxProgress: 3
    },
    {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'zap',
        rarity: 'rare',
        xpReward: 300,
        maxProgress: 7
    },
    {
        id: 'consistency-king',
        name: 'Consistency King',
        description: 'Maintain a 30-day streak',
        icon: 'zap',
        rarity: 'epic',
        xpReward: 750,
        maxProgress: 30
    },
    {
        id: 'unstoppable-force',
        name: 'Unstoppable Force',
        description: 'Maintain a 100-day streak',
        icon: 'zap',
        rarity: 'legendary',
        xpReward: 2000,
        maxProgress: 100
    },

    // XP and Level Achievements
    {
        id: 'xp-collector',
        name: 'XP Collector',
        description: 'Earn 1,000 total XP',
        icon: 'star',
        rarity: 'common',
        xpReward: 100,
        maxProgress: 1000
    },
    {
        id: 'level-climber',
        name: 'Level Climber',
        description: 'Reach level 5',
        icon: 'star',
        rarity: 'rare',
        xpReward: 250,
        maxProgress: 5
    },
    {
        id: 'experience-master',
        name: 'Experience Master',
        description: 'Reach level 10',
        icon: 'star',
        rarity: 'epic',
        xpReward: 500,
        maxProgress: 10
    },
    {
        id: 'legendary-achiever',
        name: 'Legendary Achiever',
        description: 'Reach level 25',
        icon: 'trophy',
        rarity: 'legendary',
        xpReward: 1500,
        maxProgress: 25
    },

    // Special Achievements
    {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Start a task before 6 AM',
        icon: 'clock',
        rarity: 'rare',
        xpReward: 200,
        maxProgress: 1
    },
    {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Complete a task after 10 PM',
        icon: 'clock',
        rarity: 'rare',
        xpReward: 200,
        maxProgress: 1
    },
    {
        id: 'weekend-warrior',
        name: 'Weekend Warrior',
        description: 'Complete tasks on both Saturday and Sunday',
        icon: 'target',
        rarity: 'rare',
        xpReward: 300,
        maxProgress: 2
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete 10 tasks without missing a deadline',
        icon: 'star',
        rarity: 'epic',
        xpReward: 600,
        maxProgress: 10
    }
];

export class AchievementService {
    /**
     * Check if user has unlocked any new achievements
     */
    static checkAchievements(user: User, previousUser?: User): Achievement[] {
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
            // Skip if already unlocked
            if (user.unlockedBadges.includes(achievement.id)) {
                continue;
            }

            // Check if achievement should be unlocked
            if (this.shouldUnlockAchievement(achievement, user, previousUser)) {
                newlyUnlocked.push({
                    ...achievement,
                    unlockedAt: new Date(),
                    progress: achievement.maxProgress || 1
                });
            }
        }

        return newlyUnlocked;
    }

    /**
     * Get achievement progress for a specific achievement
     */
    static getAchievementProgress(achievement: Achievement, user: User): number {
        switch (achievement.id) {
            // Task completion achievements
            case 'task-starter':
                return Math.min(user.tasksCompleted, 1);
            case 'productive-day':
                // This would need daily task tracking - simplified for now
                return Math.min(user.tasksCompleted, 5);
            case 'task-machine':
                return Math.min(user.tasksCompleted, 25);
            case 'completion-legend':
                return Math.min(user.tasksCompleted, 100);

            // Streak achievements
            case 'streak-starter':
                return Math.min(user.streak, 3);
            case 'week-warrior':
                return Math.min(user.streak, 7);
            case 'consistency-king':
                return Math.min(user.streak, 30);
            case 'unstoppable-force':
                return Math.min(user.streak, 100);

            // XP and level achievements
            case 'xp-collector':
                return Math.min(user.totalXP, 1000);
            case 'level-climber':
                return Math.min(user.level, 5);
            case 'experience-master':
                return Math.min(user.level, 10);
            case 'legendary-achiever':
                return Math.min(user.level, 25);

            // Time tracking achievements (simplified - would need session data)
            case 'first-timer':
            case 'hour-warrior':
            case 'marathon-tracker':
            case 'time-master':
                return user.tasksCompleted > 0 ? 1 : 0;

            // Special achievements (simplified)
            case 'early-bird':
            case 'night-owl':
            case 'weekend-warrior':
            case 'perfectionist':
                return user.tasksCompleted >= 5 ? achievement.maxProgress || 1 : 0;

            default:
                return 0;
        }
    }

    /**
     * Get all achievements with current progress
     */
    static getAchievementsWithProgress(user: User): Achievement[] {
        return ACHIEVEMENTS.map(achievement => ({
            ...achievement,
            progress: this.getAchievementProgress(achievement, user),
            unlockedAt: user.unlockedBadges.includes(achievement.id)
                ? new Date() // In real app, this would be stored
                : undefined
        }));
    }

    /**
     * Get recently unlocked achievements
     */
    static getRecentAchievements(user: User, limit: number = 5): Achievement[] {
        return ACHIEVEMENTS
            .filter(achievement => user.unlockedBadges.includes(achievement.id))
            .map(achievement => ({
                ...achievement,
                unlockedAt: new Date() // In real app, this would be the actual unlock date
            }))
            .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
            .slice(0, limit);
    }

    /**
     * Check if a specific achievement should be unlocked
     */
    private static shouldUnlockAchievement(
        achievement: Achievement,
        user: User,
        previousUser?: User
    ): boolean {
        const progress = this.getAchievementProgress(achievement, user);
        const maxProgress = achievement.maxProgress || 1;

        return progress >= maxProgress;
    }

    /**
     * Calculate total XP from achievements
     */
    static getTotalAchievementXP(user: User): number {
        return ACHIEVEMENTS
            .filter(achievement => user.unlockedBadges.includes(achievement.id))
            .reduce((total, achievement) => total + achievement.xpReward, 0);
    }

    /**
     * Get achievement statistics
     */
    static getAchievementStats(user: User) {
        const total = ACHIEVEMENTS.length;
        const unlocked = user.unlockedBadges.length;
        const totalXP = this.getTotalAchievementXP(user);

        const rarityStats = {
            common: 0,
            rare: 0,
            epic: 0,
            legendary: 0
        };

        ACHIEVEMENTS
            .filter(achievement => user.unlockedBadges.includes(achievement.id))
            .forEach(achievement => {
                rarityStats[achievement.rarity]++;
            });

        return {
            total,
            unlocked,
            totalXP,
            rarityStats,
            completionPercentage: total > 0 ? (unlocked / total) * 100 : 0
        };
    }
}