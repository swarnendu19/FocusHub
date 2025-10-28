import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimerNotifications } from '../TimerNotifications';
import { useTimerStore } from '@/stores/timerStore';
import type { TimeSession } from '@/types';

// Mock the timer store
vi.mock('@/stores/timerStore');

const mockSession: TimeSession = {
    id: 'session-1',
    startTime: new Date(),
    endTime: new Date(),
    duration: 1800000, // 30 minutes
    xpEarned: 30,
    description: 'Test session',
};

const mockLongSession: TimeSession = {
    id: 'session-2',
    startTime: new Date(),
    endTime: new Date(),
    duration: 3600000, // 60 minutes
    xpEarned: 60,
    description: 'Long session',
};

const mockPomodoroSession: TimeSession = {
    id: 'session-3',
    startTime: new Date(),
    endTime: new Date(),
    duration: 1500000, // 25 minutes
    xpEarned: 25,
    description: 'Pomodoro session',
};

describe('TimerNotifications', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders without notifications initially', () => {
        (useTimerStore as any).mockReturnValue({
            sessions: [],
        });

        const { container } = render(<TimerNotifications />);

        // Should not render any notifications
        expect(container.firstChild?.childNodes).toHaveLength(0);
    });

    it('shows session completion notification when new session is added', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Initially no sessions
        (useTimerStore as any).mockReturnValue({
            sessions: [],
        });
        rerender(<TimerNotifications />);

        // Add a new session
        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Session Complete! 🎉')).toBeInTheDocument();
            expect(screen.getByText('Great work! You focused for 30m')).toBeInTheDocument();
        });
    });

    it('shows XP gained notification when new session is added', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Initially no sessions
        (useTimerStore as any).mockReturnValue({
            sessions: [],
        });
        rerender(<TimerNotifications />);

        // Add a new session
        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('XP Earned! ⚡')).toBeInTheDocument();
            expect(screen.getByText('+30 XP added to your total')).toBeInTheDocument();
        });
    });

    it('shows milestone notification for 1+ hour sessions', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Initially no sessions
        (useTimerStore as any).mockReturnValue({
            sessions: [],
        });
        rerender(<TimerNotifications />);

        // Add a long session (1+ hour)
        (useTimerStore as any).mockReturnValue({
            sessions: [mockLongSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Milestone Achieved! 🏆')).toBeInTheDocument();
            expect(screen.getByText('You completed a 1+ hour focus session!')).toBeInTheDocument();
        });
    });

    it('shows pomodoro notification for 25+ minute sessions', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Initially no sessions
        (useTimerStore as any).mockReturnValue({
            sessions: [],
        });
        rerender(<TimerNotifications />);

        // Add a pomodoro session (25+ minutes)
        (useTimerStore as any).mockReturnValue({
            sessions: [mockPomodoroSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Pomodoro Complete! 🍅')).toBeInTheDocument();
            expect(screen.getByText('You completed a 25+ minute focus session!')).toBeInTheDocument();
        });
    });

    it('removes notification when close button is clicked', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Add a session to trigger notifications
        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Session Complete! 🎉')).toBeInTheDocument();
        });

        // Find and click the close button
        const closeButtons = screen.getAllByRole('button');
        const closeButton = closeButtons.find(button =>
            button.querySelector('svg')
        );

        if (closeButton) {
            fireEvent.click(closeButton);
        }

        await waitFor(() => {
            expect(screen.queryByText('Session Complete! 🎉')).not.toBeInTheDocument();
        });
    });

    it('auto-removes notifications after their duration', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Add a session to trigger notifications
        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Session Complete! 🎉')).toBeInTheDocument();
        });

        // Fast-forward time to trigger auto-removal (4 seconds for session notification)
        vi.advanceTimersByTime(4000);

        await waitFor(() => {
            expect(screen.queryByText('Session Complete! 🎉')).not.toBeInTheDocument();
        });
    });

    it('shows progress bar for auto-dismiss notifications', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Add a session to trigger notifications
        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Session Complete! 🎉')).toBeInTheDocument();
        });

        // Should show progress bar
        const progressBars = document.querySelectorAll('.h-1.bg-gray-200');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('handles multiple notifications correctly', async () => {
        const { rerender } = render(<TimerNotifications />);

        // Add multiple sessions
        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession, mockLongSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            // Should show notifications for both sessions
            expect(screen.getAllByText(/Session Complete!/)).toHaveLength(2);
            expect(screen.getAllByText(/XP Earned!/)).toHaveLength(2);
            // Should show milestone for the long session
            expect(screen.getByText('Milestone Achieved! 🏆')).toBeInTheDocument();
        });
    });

    it('does not show duplicate notifications for existing sessions', async () => {
        // Start with one session
        const { rerender } = render(<TimerNotifications />);
        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Session Complete! 🎉')).toBeInTheDocument();
        });

        // Re-render with the same session (should not create new notifications)
        rerender(<TimerNotifications />);

        // Should still only have one notification of each type
        expect(screen.getAllByText('Session Complete! 🎉')).toHaveLength(1);
        expect(screen.getAllByText('XP Earned! ⚡')).toHaveLength(1);
    });

    it('positions notifications in top-right corner', () => {
        const { container } = render(<TimerNotifications />);

        const notificationContainer = container.firstChild as HTMLElement;
        expect(notificationContainer).toHaveClass('fixed', 'top-4', 'right-4', 'z-50');
    });

    it('makes notifications non-interactive by default but clickable for close', async () => {
        const { rerender } = render(<TimerNotifications />);

        (useTimerStore as any).mockReturnValue({
            sessions: [mockSession],
        });
        rerender(<TimerNotifications />);

        await waitFor(() => {
            expect(screen.getByText('Session Complete! 🎉')).toBeInTheDocument();
        });

        const notificationContainer = document.querySelector('.pointer-events-none');
        expect(notificationContainer).toBeInTheDocument();

        const notification = document.querySelector('.pointer-events-auto');
        expect(notification).toBeInTheDocument();
    });
});