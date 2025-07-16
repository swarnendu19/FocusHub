import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../userStore';
import type { User, Task } from '@/types';

// Mock user data
const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'avatar.jpg',
    level: 1,
    totalXP: 0,
    currentXP: 0,
    xpToNextLevel: 1000,
    streak: 0,
    joinDate: new Date(),
    preferences: {
        theme: 'light',
        animations: 'full',
        notifications: true,
        soundEffects: true,
    },
    tasks: [],
    completedTasks: [],
    isOptIn: true,
    tasksCompleted: 0,
    unlockedBadges: [],
};

const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'A test task',
    completed: false,
    createdAt: new Date(),
    timeSpent: 0,
    xpReward: 50,
    priority: 'medium',
    tags: ['test'],
};

describe('UserStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useUserStore.getState().clearUser();
    });

    it('should initialize with default state', () => {
        const state = useUserStore.getState();

        expect(state.user).toBeNull();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('should set user correctly', () => {
        const { setUser } = useUserStore.getState();

        setUser(mockUser);

        const state = useUserStore.getState();
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should handle login correctly', () => {
        const { login } = useUserStore.getState();

        login(mockUser);

        const state = useUserStore.getState();
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.error).toBeNull();
        expect(state.isLoading).toBe(false);
    });

    it('should handle logout correctly', () => {
        const { login, logout } = useUserStore.getState();

        // First login
        login(mockUser);
        expect(useUserStore.getState().isAuthenticated).toBe(true);

        // Then logout
        logout();

        const state = useUserStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isLoading).toBe(false);
    });

    it('should update user preferences', () => {
        const { setUser, updatePreferences } = useUserStore.getState();

        setUser(mockUser);
        updatePreferences({ theme: 'dark', animations: 'reduced' });

        const state = useUserStore.getState();
        expect(state.user?.preferences.theme).toBe('dark');
        expect(state.user?.preferences.animations).toBe('reduced');
        expect(state.user?.preferences.notifications).toBe(true); // Should remain unchanged
    });

    it('should add XP and update level correctly', () => {
        const { setUser, addXP } = useUserStore.getState();

        setUser(mockUser);
        addXP(500);

        let state = useUserStore.getState();
        expect(state.user?.totalXP).toBe(500);
        expect(state.user?.currentXP).toBe(500);
        expect(state.user?.level).toBe(1);
        expect(state.user?.xpToNextLevel).toBe(500);

        // Add enough XP to level up
        addXP(600);

        state = useUserStore.getState();
        expect(state.user?.totalXP).toBe(1100);
        expect(state.user?.level).toBe(2);
        expect(state.user?.currentXP).toBe(100); // 1100 - 1000 (for level 2)
        expect(state.user?.xpToNextLevel).toBe(900);
    });

    it('should add tasks correctly', () => {
        const { setUser, addTask } = useUserStore.getState();

        setUser(mockUser);
        addTask(mockTask);

        const state = useUserStore.getState();
        expect(state.user?.tasks).toHaveLength(1);
        expect(state.user?.tasks[0]).toEqual(mockTask);
    });

    it('should complete tasks correctly', () => {
        const { setUser, addTask, completeTask } = useUserStore.getState();

        setUser(mockUser);
        addTask(mockTask);
        completeTask(mockTask.id, mockTask.xpReward);

        const state = useUserStore.getState();
        expect(state.user?.tasks).toHaveLength(0); // Task should be removed from active tasks
        expect(state.user?.completedTasks).toHaveLength(1); // Task should be in completed tasks
        expect(state.user?.tasksCompleted).toBe(1);
        expect(state.user?.totalXP).toBe(mockTask.xpReward); // XP should be added
    });

    it('should update tasks correctly', () => {
        const { setUser, addTask, updateTask } = useUserStore.getState();

        setUser(mockUser);
        addTask(mockTask);
        updateTask(mockTask.id, { title: 'Updated Task', priority: 'high' });

        const state = useUserStore.getState();
        expect(state.user?.tasks[0].title).toBe('Updated Task');
        expect(state.user?.tasks[0].priority).toBe('high');
        expect(state.user?.tasks[0].description).toBe(mockTask.description); // Should remain unchanged
    });

    it('should delete tasks correctly', () => {
        const { setUser, addTask, deleteTask } = useUserStore.getState();

        setUser(mockUser);
        addTask(mockTask);
        deleteTask(mockTask.id);

        const state = useUserStore.getState();
        expect(state.user?.tasks).toHaveLength(0);
    });

    it('should calculate XP progress correctly', () => {
        const { setUser, getXPProgress } = useUserStore.getState();

        const userWithXP = { ...mockUser, currentXP: 250, xpToNextLevel: 750 };
        setUser(userWithXP);

        const progress = getXPProgress();
        expect(progress).toBe(25); // 250 / (250 + 750) * 100 = 25%
    });

    it('should count completed and active tasks correctly', () => {
        const { setUser, getCompletedTasksCount, getActiveTasksCount } = useUserStore.getState();

        const userWithTasks = {
            ...mockUser,
            tasks: [mockTask], // mockTask has completed: false, so it's active
            completedTasks: [{ ...mockTask, id: '2', completed: true }],
        };
        setUser(userWithTasks);

        expect(getCompletedTasksCount()).toBe(1);
        expect(getActiveTasksCount()).toBe(1); // Active tasks are in the tasks array
    });
});