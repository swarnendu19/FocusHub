import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserPreferences, Task } from '@/types';

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
                        const newTotalXP = currentUser.totalXP + amount;
                        const newCurrentXP = currentUser.currentXP + amount;

                        // Calculate level progression (assuming 1000 XP per level)
                        const newLevel = Math.floor(newTotalXP / 1000) + 1;
                        const xpForCurrentLevel = (newLevel - 1) * 1000;
                        const adjustedCurrentXP = newTotalXP - xpForCurrentLevel;
                        const xpToNextLevel = 1000 - adjustedCurrentXP;

                        set({
                            user: {
                                ...currentUser,
                                totalXP: newTotalXP,
                                currentXP: adjustedCurrentXP,
                                level: newLevel,
                                xpToNextLevel: xpToNextLevel,
                            }
                        });
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