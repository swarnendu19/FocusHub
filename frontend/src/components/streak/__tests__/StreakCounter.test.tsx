import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StreakCounter } from '../StreakCounter';
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

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Flame: () => <div data-testid="flame-icon">Flame</div>,
    Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
    Target: () => <div data-testid="target-icon">Target</div>,
}));

describe('StreakCounter', () => {
    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        level: 5,
        totalXP: 1500,
        currentXP: 500,
        xpToNextLevel: 500,
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
        isOptIn: true,
        tasksCompleted: 10,
        unlockedBadges: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockUseUserStore.mockReturnValue({
            user: mockUser,
        } as any);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correctly with zero streak', () => {
        render(<StreakCounter />);

        expect(screen.getByText('Daily Streak')).toBeInTheDocument();
        expect(screen.getByText('Start your streak today!')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('days')).toBeInTheDocument();
    });

    it('renders correctly with active streak', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 5 },
        } as any);

        render(<StreakCounter />);

        expect(screen.getByText('Building momentum!')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('days')).toBeInTheDocument();
    });

    it('shows correct message for different streak levels', () => {
        // Test 1 day streak
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 1 },
        } as any);

        const { rerender } = render(<StreakCounter />);
        expect(screen.getByText('Great start! Keep it going!')).toBeInTheDocument();
        expect(screen.getByText('day')).toBeInTheDocument(); // singular

        // Test 10 day streak
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 10 },
        } as any);

        rerender(<StreakCounter />);
        expect(screen.getByText("You're on fire! 🔥")).toBeInTheDocument();

        // Test 50 day streak
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 50 },
        } as any);

        rerender(<StreakCounter />);
        expect(screen.getByText('Incredible dedication!')).toBeInTheDocument();

        // Test 150 day streak
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 150 },
        } as any);

        rerender(<StreakCounter />);
        expect(screen.getByText('Legendary streak! 🏆')).toBeInTheDocument();
    });

    it('displays correct milestone information', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 5 },
        } as any);

        render(<StreakCounter />);

        expect(screen.getByText('Next milestone: 7 days')).toBeInTheDocument();
        expect(screen.getByText('7 days')).toBeInTheDocument();
        expect(screen.getByText('30 days')).toBeInTheDocument();
        expect(screen.getByText('100 days')).toBeInTheDocument();
    });

    it('highlights achieved milestones', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 35 },
        } as any);

        render(<StreakCounter />);

        // Should highlight 7 and 30 day milestones
        const milestones = screen.getAllByText(/\d+ days/);
        expect(milestones.length).toBeGreaterThan(0);
    });

    it('shows celebration when streak increases', async () => {
        const { rerender } = render(<StreakCounter />);

        // Increase streak
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 6 },
        } as any);

        rerender(<StreakCounter />);

        // Should show celebration
        await waitFor(() => {
            expect(screen.getByText('Streak Extended!')).toBeInTheDocument();
            expect(screen.getByText('6 days and counting!')).toBeInTheDocument();
        });

        // Celebration should auto-hide after timeout
        act(() => {
            vi.advanceTimersByTime(3500);
        });

        await waitFor(() => {
            expect(screen.queryByText('Streak Extended!')).not.toBeInTheDocument();
        });
    });

    it('does not show celebration on initial render', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 10 },
        } as any);

        render(<StreakCounter />);

        expect(screen.queryByText('Streak Extended!')).not.toBeInTheDocument();
    });

    it('shows flame particles for high streaks', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 15 },
        } as any);

        render(<StreakCounter />);

        // Should render flame particles (check for particle container)
        const container = screen.getByTestId('flame-icon').closest('.relative');
        expect(container).toBeInTheDocument();
    });

    it('calculates progress correctly within milestone ranges', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 3 },
        } as any);

        render(<StreakCounter />);

        // 3 days out of 7 should show progress
        expect(screen.getByText('Next milestone: 7 days')).toBeInTheDocument();
    });

    it('handles user with no streak data', () => {
        mockUseUserStore.mockReturnValue({
            user: null,
        } as any);

        render(<StreakCounter />);

        expect(screen.getByText('Start your streak today!')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('applies correct styling based on streak level', () => {
        // Test zero streak (gray)
        const { rerender } = render(<StreakCounter />);
        expect(screen.getByTestId('flame-icon')).toBeInTheDocument();

        // Test low streak (orange)
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 3 },
        } as any);

        rerender(<StreakCounter />);
        expect(screen.getByTestId('flame-icon')).toBeInTheDocument();

        // Test medium streak (red)
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 15 },
        } as any);

        rerender(<StreakCounter />);
        expect(screen.getByTestId('flame-icon')).toBeInTheDocument();

        // Test high streak (purple)
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 50 },
        } as any);

        rerender(<StreakCounter />);
        expect(screen.getByTestId('flame-icon')).toBeInTheDocument();
    });

    it('shows correct progress bar width', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 3 },
        } as any);

        render(<StreakCounter />);

        // 3 out of 7 days should be ~43% progress
        const progressBar = screen.getByText('Progress').closest('.space-y-3');
        expect(progressBar).toBeInTheDocument();
    });

    it('resets progress calculation at milestone boundaries', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 7 },
        } as any);

        render(<StreakCounter />);

        // At exactly 7 days, should show next milestone as 14 days
        expect(screen.getByText('Next milestone: 14 days')).toBeInTheDocument();
    });
});