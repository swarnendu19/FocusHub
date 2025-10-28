import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserPreferences, Task, Achievement } from '@/types';
import { AchievementService } from '@/services/achievementService';

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;

    // Authentication actions
    setAuthenticated: (authenticated: boolean) => void;
    login: (user: User) => void;
    logout: () => void;

    // User preferences
    updatePreferences: (preferences: Partial<UserPreferences>) => void;

    // XP and level management
    addXP: (amount: number) => void;
    updateStreak: (streak: number) => void;

    // Task management
    addTask: (task: Task) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    completeTask: (taskId: string, xpReward: number) => void;
    deleteTask: (taskId: string) => void;

    // Computed getters
    getCurrentLevel: () => number;
    getXPProgress: () => number;
    getCompletedTasksCount: () => number;
    getActiveTasksCount: () => number;
    getTotalTimeSpent: () => number;

    // Achievement management
    checkAchievements: () => Achievement[];
    unlockAchievement: (achievementId: string) => void;
    getAchievements: () => Achievement[];
    getRecentAchievements: (limit?: number) => Achievement[];
    getAchievementStats: () => {
        total: number;
        unlocked: number;
        totalXP: number;
        rarityStats: Record<string, number>;
        completionPercentage: number;
    };

    // Development helpers
    addSampleTasks: () => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isLoading: false,
                error: null,
                isAuthenticated: false,

                setUser: (user) => set({ user, error: null, isAuthenticated: !!user }),

                setLoading: (isLoading) => set({ isLoading }),

                setError: (error) => set({ error, isLoading: false }),

                updateUser: (updates) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({ user: { ...currentUser, ...updates } });
                    }
                },

                clearUser: () => set({
                    user: null,
                    error: null,
                    isLoading: false,
                    isAuthenticated: false
                }),

                // Authentication actions
                setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

                login: (user) => set({
                    user,
                    isAuthenticated: true,
                    error: null,
                    isLoading: false
                }),

                logout: () => set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                    isLoading: false
                }),

                // User preferences
                updatePreferences: (preferences) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: {
                                ...currentUser,
                                preferences: { ...currentUser.preferences, ...preferences }
                            }
                        });
                    }
                },

                // XP and level management
                addXP: (amount) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        const oldLevel = currentUser.level;
                        const newTotalXP = currentUser.totalXP + amount;

                        // Calculate level progression (assuming 1000 XP per level)
                        const newLevel = Math.floor(newTotalXP / 1000) + 1;
                        const xpForCurrentLevel = (newLevel - 1) * 1000;
                        const adjustedCurrentXP = newTotalXP - xpForCurrentLevel;
                        const xpToNextLevel = 1000 - adjustedCurrentXP;

                        // Calculate skill points gained from leveling up
                        const levelsGained = newLevel - oldLevel;
                        let skillPointsGained = levelsGained; // 1 skill point per level

                        // Bonus skill points from large XP gains (1 skill point per 500 XP)
                        skillPointsGained += Math.floor(amount / 500);

                        // Update skill points in user data
                        const newSkillPoints = currentUser.skillPoints + skillPointsGained;

                        set({
                            user: {
                                ...currentUser,
                                totalXP: newTotalXP,
                                currentXP: adjustedCurrentXP,
                                level: newLevel,
                                xpToNextLevel: xpToNextLevel,
                                skillPoints: newSkillPoints,
                            }
                        });

                        // Update skill store with new skill points if any were gained
                        if (skillPointsGained > 0) {
                            try {
                                const { useSkillStore } = require('./skillStore');
                                const skillStore = useSkillStore.getState();
                                skillStore.skillPoints = newSkillPoints;
                            } catch (error) {
                                console.warn('Could not update skill store:', error);
                            }
                        }

                        // Trigger celebrations
                        setTimeout(() => {
                            // XP gain celebration
                            if ((window as any).celebrate) {
                                (window as any).celebrate({
                                    type: 'xp-gain',
                                    intensity: amount > 100 ? 'high' : amount > 50 ? 'medium' : 'low',
                                    value: amount,
                                    message: `+${amount} XP`
                                });
                            }

                            // Level up celebration
                            if (levelsGained > 0) {
                                setTimeout(() => {
                                    if ((window as any).celebrate) {
                                        (window as any).celebrate({
                                            type: 'level-up',
                                            intensity: 'high',
                                            value: newLevel,
                                            message: `Level ${newLevel}!`,
                                            duration: 4000
                                        });
                                    }
                                }, 500); // Delay level up celebration slightly
                            }
                        }, 100); // Small delay to ensure DOM is ready
                    }
                },

                updateStreak: (streak) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({ user: { ...currentUser, streak } });
                    }
                },

                // Task management
                addTask: (task) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: {
                                ...currentUser,
                                tasks: [...currentUser.tasks, task]
                            }
                        });
                    }
                },

                updateTask: (taskId, updates) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: {
                                ...currentUser,
                                tasks: currentUser.tasks.map(task =>
                                    task.id === taskId ? { ...task, ...updates } : task
                                )
                            }
                        });
                    }
                },

                completeTask: (taskId, xpReward) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        const now = new Date();
                        const updatedTasks = currentUser.tasks.map(task =>
                            task.id === taskId
                                ? { ...task, completed: true, completedAt: now }
                                : task
                        );

                        const completedTask = updatedTasks.find(task => task.id === taskId);
                        const updatedCompletedTasks = completedTask
                            ? [...currentUser.completedTasks, completedTask]
                            : currentUser.completedTasks;

                        // Add XP for completing the task
                        get().addXP(xpReward);

                        set({
                            user: {
                                ...get().user!, // Get updated user after XP addition
                                tasks: updatedTasks.filter(task => task.id !== taskId),
                                completedTasks: updatedCompletedTasks,
                                tasksCompleted: currentUser.tasksCompleted + 1,
                            }
                        });
                    }
                },

                deleteTask: (taskId) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: {
                                ...currentUser,
                                tasks: currentUser.tasks.filter(task => task.id !== taskId)
                            }
                        });
                    }
                },

                // Computed getters
                getCurrentLevel: () => {
                    const user = get().user;
                    return user ? user.level : 1;
                },

                getXPProgress: () => {
                    const user = get().user;
                    if (!user) return 0;
                    return (user.currentXP / (user.currentXP + user.xpToNextLevel)) * 100;
                },

                getCompletedTasksCount: () => {
                    const user = get().user;
                    return user ? user.completedTasks.length : 0;
                },

                getActiveTasksCount: () => {
                    const user = get().user;
                    return user ? user.tasks.length : 0;
                },

                getTotalTimeSpent: () => {
                    const user = get().user;
                    if (!user) return 0;
                    return [...user.tasks, ...user.completedTasks]
                        .reduce((total, task) => total + task.timeSpent, 0);
                },

                // Achievement management
                checkAchievements: () => {
                    const currentUser = get().user;
                    if (!currentUser) return [];

                    return AchievementService.checkAchievements(currentUser);
                },

                unlockAchievement: (achievementId) => {
                    const currentUser = get().user;
                    if (currentUser && !currentUser.unlockedBadges.includes(achievementId)) {
                        set({
                            user: {
                                ...currentUser,
                                unlockedBadges: [...currentUser.unlockedBadges, achievementId]
                            }
                        });
                    }
                },

                getAchievements: () => {
                    const currentUser = get().user;
                    if (!currentUser) return [];

                    return AchievementService.getAchievementsWithProgress(currentUser);
                },

                getRecentAchievements: (limit = 5) => {
                    const currentUser = get().user;
                    if (!currentUser) return [];

                    return AchievementService.getRecentAchievements(currentUser, limit);
                },

                getAchievementStats: () => {
                    const currentUser = get().user;
                    if (!currentUser) {
                        return {
                            total: 0,
                            unlocked: 0,
                            totalXP: 0,
                            rarityStats: { common: 0, rare: 0, epic: 0, legendary: 0 },
                            completionPercentage: 0
                        };
                    }

                    return AchievementService.getAchievementStats(currentUser);
                },

                // Development helper - add sample tasks
                addSampleTasks: () => {
                    const sampleTasks: Task[] = [
                        {
                            id: 'task-1',
                            title: 'Complete React Component',
                            description: 'Build the user profile component with proper styling',
                            completed: false,
                            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                            timeSpent: 3600000, // 1 hour in ms
                            xpReward: 150,
                            priority: 'high',
                            tags: ['react', 'frontend', 'ui'],
                            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                            estimatedTime: 7200000, // 2 hours in ms
                        },
                        {
                            id: 'task-2',
                            title: 'Write API Documentation',
                            description: 'Document all REST endpoints for the user service',
                            completed: false,
                            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                            timeSpent: 1800000, // 30 minutes in ms
                            xpReward: 100,
                            priority: 'medium',
                            tags: ['documentation', 'api', 'backend'],
                            estimatedTime: 3600000, // 1 hour in ms
                        },
                        {
                            id: 'task-3',
                            title: 'Fix CSS Layout Bug',
                            description: 'Resolve the responsive layout issue on mobile devices',
                            completed: true,
                            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // completed 1 day ago
                            timeSpent: 2700000, // 45 minutes in ms
                            xpReward: 75,
                            priority: 'high',
                            tags: ['css', 'responsive', 'bugfix'],
                            estimatedTime: 3600000, // 1 hour in ms
                        },
                        {
                            id: 'task-4',
                            title: 'Update Dependencies',
                            description: 'Update all npm packages to latest versions',
                            completed: false,
                            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                            timeSpent: 0,
                            xpReward: 50,
                            priority: 'low',
                            tags: ['maintenance', 'npm', 'dependencies'],
                            estimatedTime: 1800000, // 30 minutes in ms
                        },
                        {
                            id: 'task-5',
                            title: 'Implement User Authentication',
                            description: 'Add login/logout functionality with JWT tokens',
                            completed: false,
                            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                            timeSpent: 5400000, // 1.5 hours in ms
                            xpReward: 200,
                            priority: 'high',
                            tags: ['auth', 'security', 'jwt', 'backend'],
                            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                            estimatedTime: 10800000, // 3 hours in ms
                        }
                    ];

                    const currentUser = get().user;
                    if (currentUser) {
                        const activeTasks = sampleTasks.filter(task => !task.completed);
                        const completedTasks = sampleTasks.filter(task => task.completed);

                        set({
                            user: {
                                ...currentUser,
                                tasks: [...currentUser.tasks, ...activeTasks],
                                completedTasks: [...currentUser.completedTasks, ...completedTasks]
                            }
                        });
                    }
                },
            }),
            {
                name: 'user-store',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                }),
            }
        ),
        { name: 'UserStore' }
    )
);