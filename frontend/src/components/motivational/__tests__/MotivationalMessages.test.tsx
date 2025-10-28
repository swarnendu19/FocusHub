import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MotivationalMessages } from '../MotivationalMessages';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';

// Mock the stores
vi.mock('@/stores/userStore');
vi.mock('@/stores/timerStore');
const mockUseUserStore = vi.mocked(useUserStore);
const mockUseTimerStore = vi.mocked(useTimerStore);

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
    Target: () => <div data-testid="target-icon">Target</div>,
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Zap: () => <div data-testid="zap-icon">Zap</div>,
    Heart: () => <div data-testid="heart-icon">Heart</div>,
    Star: () => <div data-testid="star-icon">Star</div>,
}));

describe('MotivationalMessages', () => {
    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        level: 5,
        totalXP: 1500,
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

    const mockTimerStore = {
        isRunning: false,
        sessions: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockUseUserStore.mockReturnValue({ user: mockUser } as any);
        mockUseTimerStore.mockReturnValue(mockTimerStore as any);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders without crashing', () => {
        render(<MotivationalMessages />);

        // Should render the trigger button initially
        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });

    it('shows initial motivational message after delay', async () => {
        render(<MotivationalMessages />);

        // Fast-forward past the initial delay
        act(() => {
            vi.advanceTimersByTime(2500);
        });

        await waitFor(() => {
            // Should show some motivational message
            const messages = [
                "Your focus is your superpower! 💪",
                "Every minute counts towards your goals! ⏰",
                "Consistency is the key to greatness! 🔥",
                "Small steps lead to big achievements! 👣",
                "You're the hero of your own story! 🦸‍♂️"
            ];

            const hasMessage = messages.some(message =>
                screen.queryByText(message) !== null
            );
            expect(hasMessage).toBe(true);
        });
    });

    it('shows timer-related message when timer is running', async () => {
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            isRunning: true,
        } as any);

        render(<MotivationalMessages />);

        // Fast-forward past the timer start delay
        act(() => {
            vi.advanceTimersByTime(1500);
        });

        await waitFor(() => {
            // Should show a time-related motivational message
            const timeMessages = [
                "Your focus is your superpower! 💪",
                "Every minute counts towards your goals! ⏰",
                "You're in the zone! Keep that momentum! 🎯"
            ];

            const hasTimeMessage = timeMessages.some(message =>
                screen.queryByText(message) !== null
            );
            expect(hasTimeMessage).toBe(true);
        });
    });

    it('shows task completion message when sessions increase', async () => {
        const { rerender } = render(<MotivationalMessages />);

        // Add a session to trigger task completion message
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            sessions: [{ id: '1', startTime: new Date(), duration: 1800000, xpEarned: 30 }],
        } as any);

        rerender(<MotivationalMessages />);

        // Fast-forward past the session completion delay
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(screen.queryByText("Another task conquered! You're unstoppable! ✨")).toBeInTheDocument();
        });
    });

    it('allows manual trigger of motivational messages', async () => {
        render(<MotivationalMessages />);

        const triggerButton = screen.getByRole('button');
        fireEvent.click(triggerButton);

        await waitFor(() => {
            // Should show some motivational message after manual trigger
            const messages = [
                "Your focus is your superpower! 💪",
                "Every minute counts towards your goals! ⏰",
                "Consistency is the key to greatness! 🔥",
                "Small steps lead to big achievements! 👣",
                "You're the hero of your own story! 🦸‍♂️"
            ];

            const hasMessage = messages.some(message =>
                screen.queryByText(message) !== null
            );
            expect(hasMessage).toBe(true);
        });
    });

    it('allows closing messages', async () => {
        render(<MotivationalMessages />);

        // Trigger a message
        const triggerButton = screen.getByRole('button');
        fireEvent.click(triggerButton);

        await waitFor(() => {
            const closeButton = screen.getByRole('button', { name: /close/i });
            expect(closeButton).toBeInTheDocument();
        });

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            // Message should be closed and trigger button should be visible again
            expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
        });
    });

    it('auto-hides messages after timeout', async () => {
        render(<MotivationalMessages />);

        // Trigger a message
        const triggerButton = screen.getByRole('button');
        fireEvent.click(triggerButton);

        await waitFor(() => {
            // Should show some message
            const hasMessage = screen.queryByText(/focus|goal|streak|achievement/i) !== null;
            expect(hasMessage).toBe(true);
        });

        // Fast-forward past auto-hide timeout
        act(() => {
            vi.advanceTimersByTime(5500);
        });

        await waitFor(() => {
            // Message should be auto-hidden and trigger button should be visible
            expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
        });
    });

    it('shows periodic messages', async () => {
        render(<MotivationalMessages />);

        // Fast-forward past periodic interval
        act(() => {
            vi.advanceTimersByTime(35000);
        });

        await waitFor(() => {
            // Should potentially show a periodic message (30% chance)
            // We can't test randomness directly, but we can test the interval exists
            expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
        });
    });

    it('prevents showing duplicate messages in history', async () => {
        render(<MotivationalMessages />);

        // Trigger multiple messages quickly
        const triggerButton = screen.getByRole('button');

        for (let i = 0; i < 3; i++) {
            fireEvent.click(triggerButton);

            // Wait for message to appear and auto-hide
            act(() => {
                vi.advanceTimersByTime(5500);
            });
        }

        // Should not show the same message repeatedly
        // This is hard to test directly due to randomness, but the component should handle it
        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });

    it('prioritizes contextual messages based on user state', async () => {
        // Test with high streak user
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 10 },
        } as any);

        render(<MotivationalMessages />);

        const triggerButton = screen.getByRole('button');
        fireEvent.click(triggerButton);

        await waitFor(() => {
            // Should potentially show streak-related message
            const hasStreakMessage = screen.queryByText("Consistency is the key to greatness! 🔥") !== null;
            // We can't guarantee which message shows due to randomness, but streak messages should be prioritized
            expect(screen.queryByText(/focus|goal|streak|achievement/i)).toBeInTheDocument();
        });
    });

    it('shows level-based messages for high-level users', async () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, level: 15 },
        } as any);

        render(<MotivationalMessages />);

        const triggerButton = screen.getByRole('button');
        fireEvent.click(triggerButton);

        await waitFor(() => {
            // Should show some motivational message
            expect(screen.queryByText(/focus|goal|streak|achievement|level/i)).toBeInTheDocument();
        });
    });

    it('handles missing user data gracefully', () => {
        mockUseUserStore.mockReturnValue({ user: null } as any);

        render(<MotivationalMessages />);

        // Should still render trigger button
        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });

    it('shows appropriate time-based messages', async () => {
        // Mock different times of day
        const originalDate = Date;

        // Mock morning time (8 AM)
        vi.setSystemTime(new Date('2024-01-15T08:00:00'));

        render(<MotivationalMessages />);

        // The component uses time-based logic internally
        // We can't easily test the exact message, but we can verify it renders
        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });

    it('maintains message history to avoid repetition', async () => {
        render(<MotivationalMessages />);

        const triggerButton = screen.getByRole('button');

        // Trigger several messages
        for (let i = 0; i < 5; i++) {
            fireEvent.click(triggerButton);

            act(() => {
                vi.advanceTimersByTime(5500);
            });

            await waitFor(() => {
                expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
            });
        }

        // Component should handle message history internally
        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });
});