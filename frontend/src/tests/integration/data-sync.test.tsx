import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';
import { api } from '@/services/api';

// Mock the API service
vi.mock('@/services/api', () => ({
    api: {
        auth: {
            getCurrentUser: vi.fn(),
        },
        users: {
            update: vi.fn(),
            getById: vi.fn(),
        },
        leaderboard: {
            get: vi.fn(),
        },
        analytics: {
            getUserStats: vi.fn(),
        },
    },
}));

describe('Data Synchronization Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset stores
        useUserStore.getState().reset?.();
        useTimerStore.getState().reset?.();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('User Store Synchronization', () => {
        it('should sync user data across components', async () => {
            const mockUser = {
                id: 'user-123',
                username: 'testuser',
                email: 'test@example.com',
                level: 5,
                totalXP: 1250,
                currentXP: 250,
                xpToNextLevel: 750,
                streak: 7,
                joinDate: new Date(),
                preferences: {
                    theme: 'light' as const,
                    animations: 'full' as const,
                    notifications: true,
                    soundEffects: true,
                },
                tasks: [],
                completedTasks: [],
                isOptIn: true,
                tasksCompleted: 42,
                unlockedBadges: ['first-timer'],
                skillPoints: 100,
                unlockedSkills: ['focus-master'],
                skillBonuses: [],
            };

            // Mock API response
            (api.auth.getCurrentUser as any).mockResolvedValue({
                success: true,
                data: mockUser,
            });

            const { result } = renderHook(() => useUserStore());

            // Simulate fetching user data
            await act(async () => {
                await result.current.fetchUser();
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.isLoading).toBe(false);
        });

        it('should handle user update synchronization', async () => {
            const { result } = renderHook(() => useUserStore());

            // Set initial user
            act(() => {
                result.current.setUser({
                    id: 'user-123',
                    username: 'testuser',
                    email: 'test@example.com',
                    level: 5,
                    totalXP: 1250,
                    currentXP: 250,
                    xpToNextLevel: 750,
                    streak: 7,
                    joinDate: new Date(),
                    preferences: {
                        theme: 'light' as const,
                        animations: 'full' as const,
                        notifications: true,
                        soundEffects: true,
                    },
                    tasks: [],
                    completedTasks: [],
                    isOptIn: true,
                    tasksCompleted: 42,
                    unlockedBadges: ['first-timer'],
                    skillPoints: 100,
                    unlockedSkills: ['focus-master'],
                    skillBonuses: [],
                });
            });

            // Mock API update response
            (api.users.update as any).mockResolvedValue({
                success: true,
                data: { message: 'User updated successfully' },
            });

            // Update user data
            await act(async () => {
                await result.current.updateUser({
                    totalXP: 1500,
                    level: 6,
                    tasksCompleted: 43,
                });
            });

            expect(api.users.update).toHaveBeenCalledWith('user-123', {
                totalXP: 1500,
                level: 6,
                tasksCompleted: 43,
            });
        });

        it('should handle authentication state changes', async () => {
            const { result } = renderHook(() => useUserStore());

            // Initially not authenticated
            expect(result.current.isAuthenticated).toBe(false);

            // Simulate login
            act(() => {
                result.current.setUser({
                    id: 'user-123',
                    username: 'testuser',
                    email: 'test@example.com',
                    level: 1,
                    totalXP: 0,
                    currentXP: 0,
                    xpToNextLevel: 100,
                    streak: 0,
                    joinDate: new Date(),
                    preferences: {
                        theme: 'light' as const,
                        animations: 'full' as const,
                        notifications: true,
                        soundEffects: true,
                    },
                    tasks: [],
                    completedTasks: [],
                    isOptIn: false,
                    tasksCompleted: 0,
                    unlockedBadges: [],
                    skillPoints: 0,
                    unlockedSkills: [],
                    skillBonuses: [],
                });
            });

            expect(result.current.isAuthenticated).toBe(true);

            // Simulate logout
            act(() => {
                result.current.logout();
            });

            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
        });
    });

    describe('Timer Store Synchronization', () => {
        it('should sync timer state across components', () => {
            const { result } = renderHook(() => useTimerStore());

            // Initially not active
            expect(result.current.isActive).toBe(false);
            expect(result.current.elapsedTime).toBe(0);

            // Start timer
            act(() => {
                result.current.start();
            });

            expect(result.current.isActive).toBe(true);
            expect(result.current.startTime).toBeDefined();

            // Stop timer
            act(() => {
                result.current.stop();
            });

            expect(result.current.isActive).toBe(false);
        });

        it('should persist timer state across page refreshes', () => {
            const { result } = renderHook(() => useTimerStore());

            // Mock localStorage
            const mockLocalStorage = {
                getItem: vi.fn(),
                setItem: vi.fn(),
                removeItem: vi.fn(),
            };
            Object.defineProperty(window, 'localStorage', {
                value: mockLocalStorage,
            });

            // Start timer
            act(() => {
                result.current.start();
            });

            // Simulate page refresh by calling recoverTimer
            act(() => {
                result.current.recoverTimer();
            });

            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('timer-state');
        });

        it('should handle task association with timer', () => {
            const { result } = renderHook(() => useTimerStore());

            const mockTask = {
                id: 'task-123',
                title: 'Test Task',
                description: 'A test task',
                completed: false,
                createdAt: new Date(),
                timeSpent: 0,
                xpReward: 50,
                priority: 'medium' as const,
                tags: ['work'],
            };

            // Set current task
            act(() => {
                result.current.setCurrentTask(mockTask);
            });

            expect(result.current.currentTask).toEqual(mockTask);

            // Start timer with task
            act(() => {
                result.current.start();
            });

            expect(result.current.isActive).toBe(true);
            expect(result.current.currentTask).toEqual(mockTask);
        });
    });

    describe('Cross-Store Synchronization', () => {
        it('should sync XP updates between user and timer stores', async () => {
            const userStore = renderHook(() => useUserStore());
            const timerStore = renderHook(() => useTimerStore());

            // Set initial user
            act(() => {
                userStore.result.current.setUser({
                    id: 'user-123',
                    username: 'testuser',
                    email: 'test@example.com',
                    level: 5,
                    totalXP: 1250,
                    currentXP: 250,
                    xpToNextLevel: 750,
                    streak: 7,
                    joinDate: new Date(),
                    preferences: {
                        theme: 'light' as const,
                        animations: 'full' as const,
                        notifications: true,
                        soundEffects: true,
                    },
                    tasks: [],
                    completedTasks: [],
                    isOptIn: true,
                    tasksCompleted: 42,
                    unlockedBadges: ['first-timer'],
                    skillPoints: 100,
                    unlockedSkills: ['focus-master'],
                    skillBonuses: [],
                });
            });

            // Mock API update
            (api.users.update as any).mockResolvedValue({
                success: true,
                data: { message: 'User updated successfully' },
            });

            // Simulate completing a task that gives XP
            const xpGained = 100;

            await act(async () => {
                await userStore.result.current.updateUser({
                    totalXP: userStore.result.current.user!.totalXP + xpGained,
                    currentXP: userStore.result.current.user!.currentXP + xpGained,
                });
            });

            expect(api.users.update).toHaveBeenCalledWith('user-123', {
                totalXP: 1350,
                currentXP: 350,
            });
        });

        it('should handle task completion across stores', () => {
            const userStore = renderHook(() => useUserStore());
            const timerStore = renderHook(() => useTimerStore());

            const mockTask = {
                id: 'task-123',
                title: 'Test Task',
                description: 'A test task',
                completed: false,
                createdAt: new Date(),
                timeSpent: 0,
                xpReward: 50,
                priority: 'medium' as const,
                tags: ['work'],
            };

            // Set user with task
            act(() => {
                userStore.result.current.setUser({
                    id: 'user-123',
                    username: 'testuser',
                    email: 'test@example.com',
                    level: 5,
                    totalXP: 1250,
                    currentXP: 250,
                    xpToNextLevel: 750,
                    streak: 7,
                    joinDate: new Date(),
                    preferences: {
                        theme: 'light' as const,
                        animations: 'full' as const,
                        notifications: true,
                        soundEffects: true,
                    },
                    tasks: [mockTask],
                    completedTasks: [],
                    isOptIn: true,
                    tasksCompleted: 42,
                    unlockedBadges: ['first-timer'],
                    skillPoints: 100,
                    unlockedSkills: ['focus-master'],
                    skillBonuses: [],
                });
            });

            // Set task in timer
            act(() => {
                timerStore.result.current.setCurrentTask(mockTask);
            });

            expect(timerStore.result.current.currentTask).toEqual(mockTask);
            expect(userStore.result.current.user?.tasks).toContain(mockTask);
        });
    });

    describe('Error Handling in Data Sync', () => {
        it('should handle API errors gracefully', async () => {
            const { result } = renderHook(() => useUserStore());

            // Mock API error
            (api.auth.getCurrentUser as any).mockResolvedValue({
                success: false,
                error: 'Network error',
                status: 500,
            });

            await act(async () => {
                await result.current.fetchUser();
            });

            expect(result.current.error).toBe('Network error');
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isAuthenticated).toBe(false);
        });

        it('should handle network timeouts', async () => {
            const { result } = renderHook(() => useUserStore());

            // Mock timeout error
            (api.auth.getCurrentUser as any).mockRejectedValue(new Error('Request timeout'));

            await act(async () => {
                try {
                    await result.current.fetchUser();
                } catch (error) {
                    // Error should be handled by the store
                }
            });

            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeDefined();
        });

        it('should handle offline scenarios', async () => {
            const { result } = renderHook(() => useUserStore());

            // Mock offline error
            (api.auth.getCurrentUser as any).mockRejectedValue(new Error('No internet connection'));

            // Mock navigator.onLine
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: false,
            });

            await act(async () => {
                try {
                    await result.current.fetchUser();
                } catch (error) {
                    // Error should be handled by the store
                }
            });

            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeDefined();
        });
    });

    describe('Real-time Data Updates', () => {
        it('should handle concurrent updates', async () => {
            const { result } = renderHook(() => useUserStore());

            // Set initial user
            act(() => {
                result.current.setUser({
                    id: 'user-123',
                    username: 'testuser',
                    email: 'test@example.com',
                    level: 5,
                    totalXP: 1250,
                    currentXP: 250,
                    xpToNextLevel: 750,
                    streak: 7,
                    joinDate: new Date(),
                    preferences: {
                        theme: 'light' as const,
                        animations: 'full' as const,
                        notifications: true,
                        soundEffects: true,
                    },
                    tasks: [],
                    completedTasks: [],
                    isOptIn: true,
                    tasksCompleted: 42,
                    unlockedBadges: ['first-timer'],
                    skillPoints: 100,
                    unlockedSkills: ['focus-master'],
                    skillBonuses: [],
                });
            });

            // Mock API responses
            (api.users.update as any).mockResolvedValue({
                success: true,
                data: { message: 'User updated successfully' },
            });

            // Simulate concurrent updates
            const updates = [
                { totalXP: 1300 },
                { totalXP: 1350 },
                { totalXP: 1400 },
            ];

            const promises = updates.map(update =>
                act(async () => {
                    await result.current.updateUser(update);
                })
            );

            await Promise.all(promises);

            // All updates should have been called
            expect(api.users.update).toHaveBeenCalledTimes(3);
        });
    });
});