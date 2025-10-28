import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { XPProgressBar } from '../XPProgressBar';
import { useUserStore } from '@/stores/userStore';

// Mock the user store
vi.mock('@/stores/userStore');
const mockUseUserStore = vi.mocked(useUserStore);

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('XPProgressBar', () => {
    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        level: 5,
        totalXP: 4500,
        currentXP: 500,
        xpToNextLevel: 500,
        streak: 3,
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
        tasksCompleted: 10,
        unlockedBadges: [],
    };

    beforeEach(() => {
        mockUseUserStore.mockReturnValue({
            user: mockUser,
            getCurrentLevel: vi.fn(() => 5),
            getXPProgress: vi.fn(() => 50), // 50% progress
            isLoading: false,
            error: null,
            isAuthenticated: true,
            setUser: vi.fn(),
            setLoading: vi.fn(),
            setError: vi.fn(),
            updateUser: vi.fn(),
            clearUser: vi.fn(),
            setAuthenticated: vi.fn(),
            login: vi.fn(),
            logout: vi.fn(),
            updatePreferences: vi.fn(),
            addXP: vi.fn(),
            updateStreak: vi.fn(),
            addTask: vi.fn(),
            updateTask: vi.fn(),
            completeTask: vi.fn(),
            deleteTask: vi.fn(),
            getCompletedTasksCount: vi.fn(),
            getActiveTasksCount: vi.fn(),
            getTotalTimeSpent: vi.fn(),
            addSampleTasks: vi.fn(),
        });
    });

    it('renders XP progress bar with user data', () => {
        render(<XPProgressBar />);

        expect(screen.getByText('Level 5')).toBeInTheDocument();
        expect(screen.getByText(/500 \/ 1,000 XP/)).toBeInTheDocument();
        expect(screen.getByText(/Total XP: 4,500/)).toBeInTheDocument();
    });

    it('displays correct XP calculations', () => {
        render(<XPProgressBar />);

        // Check that XP for next level is calculated correctly
        expect(screen.getByText(/500 XP/)).toBeInTheDocument(); // XP needed for next level
    });

    it('calls onLevelUp when level increases', async () => {
        const onLevelUp = vi.fn();
        const { rerender } = render(<XPProgressBar onLevelUp={onLevelUp} />);

        // Simulate level up by changing the mock return value
        mockUseUserStore.mockReturnValue({
            ...mockUseUserStore(),
            getCurrentLevel: vi.fn(() => 6), // Level increased
        });

        rerender(<XPProgressBar onLevelUp={onLevelUp} />);

        await waitFor(() => {
            expect(onLevelUp).toHaveBeenCalledWith(6);
        });
    });

    it('renders without user data', () => {
        mockUseUserStore.mockReturnValue({
            ...mockUseUserStore(),
            user: null,
        });

        const { container } = render(<XPProgressBar />);
        expect(container.firstChild).toBeNull();
    });

    it('displays progress percentage correctly', () => {
        render(<XPProgressBar />);

        // Should show 50% progress based on mock data
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('shows overflow animation when enabled', () => {
        render(<XPProgressBar showOverflow={true} />);

        // Component should render without errors when overflow is enabled
        expect(screen.getByText('Level 5')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<XPProgressBar className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});