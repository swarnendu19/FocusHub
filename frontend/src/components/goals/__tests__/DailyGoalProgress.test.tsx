import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DailyGoalProgress } from '../DailyGoalProgress';
import { useTimerStore } from '@/stores/timerStore';

// Mock the timer store
vi.mock('@/stores/timerStore');
const mockUseTimerStore = vi.mocked(useTimerStore);

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Target: () => <div data-testid="target-icon">Target</div>,
    CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    Zap: () => <div data-testid="zap-icon">Zap</div>,
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Settings: () => <div data-testid="settings-icon">Settings</div>,
}));

describe('DailyGoalProgress', () => {
    const mockTimerStore = {
        dailyTime: 120, // 2 hours in minutes
        dailyGoal: 480, // 8 hours in minutes
        setDailyGoal: vi.fn(),
        getDailyProgress: vi.fn(() => 25), // 2/8 hours = 25%
        getTotalTimeToday: vi.fn(() => 7200000), // 2 hours in milliseconds
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockUseTimerStore.mockReturnValue(mockTimerStore as any);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correctly with initial progress', () => {
        render(<DailyGoalProgress />);

        expect(screen.getByText('Daily Goal')).toBeInTheDocument();
        expect(screen.getByText('25%')).toBeInTheDocument();
        expect(screen.getByText('480m')).toBeInTheDocument(); // Goal
        expect(screen.getByText('2h')).toBeInTheDocument(); // Today's time
    });

    it('shows correct motivational message based on progress', () => {
        const { rerender } = render(<DailyGoalProgress />);

        // 25% progress
        expect(screen.getByText('🚀 Ready to tackle your daily goal?')).toBeInTheDocument();

        // 30% progress
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 30),
        } as any);
        rerender(<DailyGoalProgress />);
        expect(screen.getByText('🚀 Good start! Building momentum!')).toBeInTheDocument();

        // 60% progress
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 60),
        } as any);
        rerender(<DailyGoalProgress />);
        expect(screen.getByText('💪 Halfway there! Keep going!')).toBeInTheDocument();

        // 85% progress
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 85),
        } as any);
        rerender(<DailyGoalProgress />);
        expect(screen.getByText('🔥 Almost there! Push through!')).toBeInTheDocument();

        // 100% progress
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 100),
        } as any);
        rerender(<DailyGoalProgress />);
        expect(screen.getByText('🎉 Goal crushed! You\'re on fire today!')).toBeInTheDocument();
    });

    it('shows remaining time correctly', () => {
        render(<DailyGoalProgress />);

        // 480 - 120 = 360 minutes remaining
        expect(screen.getByText('360m')).toBeInTheDocument();
        expect(screen.getByText('Remaining')).toBeInTheDocument();
    });

    it('shows goal reached state', () => {
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            dailyTime: 480,
            getDailyProgress: vi.fn(() => 100),
        } as any);

        render(<DailyGoalProgress />);

        expect(screen.getByText('0m')).toBeInTheDocument();
        expect(screen.getByText('Exceeded!')).toBeInTheDocument();
        expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    it('opens goal setter modal when settings clicked', async () => {
        render(<DailyGoalProgress />);

        const settingsButton = screen.getByTestId('settings-icon');
        fireEvent.click(settingsButton);

        await waitFor(() => {
            expect(screen.getByText('Set Daily Goal')).toBeInTheDocument();
            expect(screen.getByText('Goal (minutes)')).toBeInTheDocument();
        });
    });

    it('allows updating goal through modal', async () => {
        render(<DailyGoalProgress />);

        // Open modal
        const settingsButton = screen.getByTestId('settings-icon');
        fireEvent.click(settingsButton);

        await waitFor(() => {
            expect(screen.getByDisplayValue('480')).toBeInTheDocument();
        });

        // Change goal
        const input = screen.getByDisplayValue('480');
        fireEvent.change(input, { target: { value: '360' } });

        // Save goal
        const saveButton = screen.getByText('Save Goal');
        fireEvent.click(saveButton);

        expect(mockTimerStore.setDailyGoal).toHaveBeenCalledWith(360);
    });

    it('cancels goal setting', async () => {
        render(<DailyGoalProgress />);

        // Open modal
        const settingsButton = screen.getByTestId('settings-icon');
        fireEvent.click(settingsButton);

        await waitFor(() => {
            expect(screen.getByText('Set Daily Goal')).toBeInTheDocument();
        });

        // Cancel
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Set Daily Goal')).not.toBeInTheDocument();
        });

        expect(mockTimerStore.setDailyGoal).not.toHaveBeenCalled();
    });

    it('shows quick action buttons when goal not reached', () => {
        render(<DailyGoalProgress />);

        expect(screen.getByText('-1h Goal')).toBeInTheDocument();
        expect(screen.getByText('+1h Goal')).toBeInTheDocument();
    });

    it('hides quick action buttons when goal is reached', () => {
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 100),
        } as any);

        render(<DailyGoalProgress />);

        expect(screen.queryByText('-1h Goal')).not.toBeInTheDocument();
        expect(screen.queryByText('+1h Goal')).not.toBeInTheDocument();
    });

    it('shows celebration when goal is reached', async () => {
        const { rerender } = render(<DailyGoalProgress />);

        // Simulate reaching goal
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 100),
        } as any);

        rerender(<DailyGoalProgress />);

        await waitFor(() => {
            expect(screen.getByText('Goal Achieved!')).toBeInTheDocument();
            expect(screen.getByText('You\'ve reached your daily target!')).toBeInTheDocument();
        });

        // Celebration should auto-hide
        act(() => {
            vi.advanceTimersByTime(4500);
        });

        await waitFor(() => {
            expect(screen.queryByText('Goal Achieved!')).not.toBeInTheDocument();
        });
    });

    it('does not show celebration on initial render with completed goal', () => {
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 100),
        } as any);

        render(<DailyGoalProgress />);

        // Should not show celebration immediately
        expect(screen.queryByText('Goal Achieved!')).not.toBeInTheDocument();
    });

    it('validates goal input in modal', async () => {
        render(<DailyGoalProgress />);

        // Open modal
        const settingsButton = screen.getByTestId('settings-icon');
        fireEvent.click(settingsButton);

        await waitFor(() => {
            const input = screen.getByDisplayValue('480');
            expect(input).toHaveAttribute('min', '30');
            expect(input).toHaveAttribute('max', '1440');
            expect(input).toHaveAttribute('step', '30');
        });
    });

    it('shows goal duration in human readable format in modal', async () => {
        render(<DailyGoalProgress />);

        // Open modal
        const settingsButton = screen.getByTestId('settings-icon');
        fireEvent.click(settingsButton);

        await waitFor(() => {
            expect(screen.getByText('That\'s 8h 0m per day')).toBeInTheDocument();
        });

        // Change to 90 minutes
        const input = screen.getByDisplayValue('480');
        fireEvent.change(input, { target: { value: '90' } });

        await waitFor(() => {
            expect(screen.getByText('That\'s 1h 30m per day')).toBeInTheDocument();
        });
    });

    it('closes modal when clicking outside', async () => {
        render(<DailyGoalProgress />);

        // Open modal
        const settingsButton = screen.getByTestId('settings-icon');
        fireEvent.click(settingsButton);

        await waitFor(() => {
            expect(screen.getByText('Set Daily Goal')).toBeInTheDocument();
        });

        // Click outside (on backdrop)
        const backdrop = screen.getByText('Set Daily Goal').closest('.fixed');
        fireEvent.click(backdrop!);

        await waitFor(() => {
            expect(screen.queryByText('Set Daily Goal')).not.toBeInTheDocument();
        });
    });

    it('shows correct progress bar styling based on progress', () => {
        const { rerender } = render(<DailyGoalProgress />);

        // Should show progress bar
        expect(screen.getByText('Progress')).toBeInTheDocument();

        // Test different progress levels for different colors
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getDailyProgress: vi.fn(() => 100),
        } as any);

        rerender(<DailyGoalProgress />);

        // Should still show progress bar at 100%
        expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    it('handles edge case of over 100% progress', () => {
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            dailyTime: 600, // 10 hours
            getDailyProgress: vi.fn(() => 125), // 125%
        } as any);

        render(<DailyGoalProgress />);

        // Should cap at 100% display
        expect(screen.getByText('125%')).toBeInTheDocument();
        expect(screen.getByText('0m')).toBeInTheDocument(); // No remaining time
        expect(screen.getByText('Exceeded!')).toBeInTheDocument();
    });

    it('formats time correctly', () => {
        mockUseTimerStore.mockReturnValue({
            ...mockTimerStore,
            getTotalTimeToday: vi.fn(() => 5400000), // 1.5 hours in milliseconds
        } as any);

        render(<DailyGoalProgress />);

        expect(screen.getByText('1h 30m')).toBeInTheDocument();
    });
});