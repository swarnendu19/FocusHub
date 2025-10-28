import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimerHistory } from '../TimerHistory';
import { useTimerStore } from '@/stores/timerStore';
import type { TimeSession } from '@/types';

// Mock the timer store
vi.mock('@/stores/timerStore');

const mockSessions: TimeSession[] = [
    {
        id: 'session-1',
        startTime: new Date('2024-01-15T10:00:00'),
        endTime: new Date('2024-01-15T10:30:00'),
        duration: 1800000, // 30 minutes
        xpEarned: 30,
        description: 'Morning focus session',
    },
    {
        id: 'session-2',
        startTime: new Date('2024-01-15T14:00:00'),
        endTime: new Date('2024-01-15T15:30:00'),
        duration: 5400000, // 90 minutes
        xpEarned: 90,
        description: 'Afternoon deep work',
    },
    {
        id: 'session-3',
        startTime: new Date('2024-01-14T09:00:00'),
        endTime: new Date('2024-01-14T09:45:00'),
        duration: 2700000, // 45 minutes
        xpEarned: 45,
        description: 'Yesterday session',
    },
    {
        id: 'session-4',
        startTime: new Date('2024-01-08T16:00:00'),
        endTime: new Date('2024-01-08T16:25:00'),
        duration: 1500000, // 25 minutes
        xpEarned: 25,
        description: 'Last week session',
    },
];

const mockTimerStore = {
    sessions: mockSessions,
    deleteSession: vi.fn(),
    getTodaysSessions: vi.fn(() => mockSessions.slice(0, 2)), // First 2 sessions
    getWeeksSessions: vi.fn(() => mockSessions.slice(0, 3)), // First 3 sessions
};

describe('TimerHistory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useTimerStore as any).mockReturnValue(mockTimerStore);
        // Mock current date to 2024-01-15
        vi.setSystemTime(new Date('2024-01-15T15:00:00'));
    });

    it('renders empty state when no sessions exist', () => {
        const emptyTimerStore = {
            ...mockTimerStore,
            sessions: [],
            getTodaysSessions: vi.fn(() => []),
            getWeeksSessions: vi.fn(() => []),
        };
        (useTimerStore as any).mockReturnValue(emptyTimerStore);

        render(<TimerHistory />);

        expect(screen.getByText('No Sessions Yet')).toBeInTheDocument();
        expect(screen.getByText('Start your first timer session to see your history here!')).toBeInTheDocument();
    });

    it('renders session list with correct information', () => {
        render(<TimerHistory />);

        expect(screen.getByText('Timer History')).toBeInTheDocument();
        expect(screen.getByText('2 sessions')).toBeInTheDocument(); // Today's sessions

        // Check for session details
        expect(screen.getByText('Morning focus session')).toBeInTheDocument();
        expect(screen.getByText('Afternoon deep work')).toBeInTheDocument();
        expect(screen.getByText('+30 XP')).toBeInTheDocument();
        expect(screen.getByText('+90 XP')).toBeInTheDocument();
    });

    it('shows correct duration badges with appropriate colors', () => {
        render(<TimerHistory />);

        // 30 minutes should be yellow (15-30 min range)
        const thirtyMinBadge = screen.getByText('30m');
        expect(thirtyMinBadge.parentElement).toHaveClass('bg-yellow-100', 'text-yellow-800');

        // 90 minutes should be green (1+ hour)
        const ninetyMinBadge = screen.getByText('1h 30m');
        expect(ninetyMinBadge.parentElement).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('filters sessions by today correctly', () => {
        render(<TimerHistory />);

        // Default filter is 'today'
        expect(screen.getByText('Morning focus session')).toBeInTheDocument();
        expect(screen.getByText('Afternoon deep work')).toBeInTheDocument();
        expect(screen.queryByText('Yesterday session')).not.toBeInTheDocument();
    });

    it('filters sessions by week correctly', () => {
        render(<TimerHistory />);

        const weekButton = screen.getByText('week');
        fireEvent.click(weekButton);

        expect(screen.getByText('Morning focus session')).toBeInTheDocument();
        expect(screen.getByText('Afternoon deep work')).toBeInTheDocument();
        expect(screen.getByText('Yesterday session')).toBeInTheDocument();
        expect(screen.queryByText('Last week session')).not.toBeInTheDocument();
    });

    it('shows all sessions when all filter is selected', () => {
        render(<TimerHistory />);

        const allButton = screen.getByText('all');
        fireEvent.click(allButton);

        expect(screen.getByText('Morning focus session')).toBeInTheDocument();
        expect(screen.getByText('Afternoon deep work')).toBeInTheDocument();
        expect(screen.getByText('Yesterday session')).toBeInTheDocument();
        expect(screen.getByText('Last week session')).toBeInTheDocument();
    });

    it('deletes session when delete button is clicked', async () => {
        render(<TimerHistory />);

        // Hover over a session to show delete button
        const sessionElement = screen.getByText('Morning focus session').closest('.group');
        fireEvent.mouseEnter(sessionElement!);

        await waitFor(() => {
            const deleteButton = screen.getByRole('button', { name: '' }); // Delete button with trash icon
            fireEvent.click(deleteButton);
        });

        expect(mockTimerStore.deleteSession).toHaveBeenCalledWith('session-1');
    });

    it('shows today badge for today\'s sessions', () => {
        render(<TimerHistory />);

        // Should show "Today" badge for sessions from today
        const todayBadges = screen.getAllByText('Today');
        expect(todayBadges.length).toBe(2); // Two sessions from today
    });

    it('formats session times correctly', () => {
        render(<TimerHistory />);

        // Check for formatted date and time
        expect(screen.getByText('1/15/2024 at 10:00 AM')).toBeInTheDocument();
        expect(screen.getByText('1/15/2024 at 02:00 PM')).toBeInTheDocument();
    });

    it('shows expand/collapse functionality when there are more sessions than maxItems', () => {
        render(<TimerHistory maxItems={1} />);

        // Should show only 1 session initially
        expect(screen.getByText('Morning focus session')).toBeInTheDocument();
        expect(screen.queryByText('Afternoon deep work')).not.toBeInTheDocument();

        // Should show expand button
        expect(screen.getByText('Show 1 More')).toBeInTheDocument();

        // Click expand
        const expandButton = screen.getByText('Show 1 More');
        fireEvent.click(expandButton);

        // Should now show all sessions
        expect(screen.getByText('Afternoon deep work')).toBeInTheDocument();
        expect(screen.getByText('Show Less')).toBeInTheDocument();
    });

    it('does not show expand button when sessions count is within maxItems', () => {
        render(<TimerHistory maxItems={10} />);

        // Should not show expand/collapse button
        expect(screen.queryByText(/Show \d+ More/)).not.toBeInTheDocument();
        expect(screen.queryByText('Show Less')).not.toBeInTheDocument();
    });

    it('sorts sessions by start time in descending order', () => {
        render(<TimerHistory />);

        const sessionElements = screen.getAllByText(/focus session|deep work/);

        // Should show afternoon session first (more recent)
        expect(sessionElements[0]).toHaveTextContent('Afternoon deep work');
        expect(sessionElements[1]).toHaveTextContent('Morning focus session');
    });

    it('shows correct session count in header', () => {
        render(<TimerHistory />);

        // Default filter is 'today', should show 2 sessions
        expect(screen.getByText('2 sessions')).toBeInTheDocument();

        // Switch to week filter
        const weekButton = screen.getByText('week');
        fireEvent.click(weekButton);

        expect(screen.getByText('3 sessions')).toBeInTheDocument();

        // Switch to all filter
        const allButton = screen.getByText('all');
        fireEvent.click(allButton);

        expect(screen.getByText('4 sessions')).toBeInTheDocument();
    });

    it('handles sessions without descriptions gracefully', () => {
        const sessionsWithoutDescription = [
            {
                ...mockSessions[0],
                description: undefined,
            },
        ];

        const timerStoreWithoutDescription = {
            ...mockTimerStore,
            getTodaysSessions: vi.fn(() => sessionsWithoutDescription),
        };
        (useTimerStore as any).mockReturnValue(timerStoreWithoutDescription);

        render(<TimerHistory />);

        // Should still render the session without description
        expect(screen.getByText('30m')).toBeInTheDocument();
        expect(screen.getByText('+30 XP')).toBeInTheDocument();
    });

    it('applies correct hover effects', () => {
        render(<TimerHistory />);

        const sessionElement = screen.getByText('Morning focus session').closest('.group');
        expect(sessionElement).toHaveClass('group');

        // The delete button should have opacity-0 initially and opacity-100 on group hover
        const deleteButtonContainer = sessionElement?.querySelector('.opacity-0.group-hover\\:opacity-100');
        expect(deleteButtonContainer).toBeInTheDocument();
    });
});