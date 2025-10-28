import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ActiveTimer } from '../ActiveTimer';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';

// Mock the stores
vi.mock('@/stores/timerStore');
vi.mock('@/stores/userStore');

const mockTimerStore = {
    activeSession: null,
    isRunning: false,
    isPaused: false,
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    updateElapsedTime: vi.fn(() => 0),
    getTotalTimeToday: vi.fn(() => 0),
    getDailyProgress: vi.fn(() => 0),
    recoverTimer: vi.fn(),
};

const mockUserStore = {
    user: {
        id: '1',
        username: 'testuser',
        tasks: [
            {
                id: 'task-1',
                title: 'Test Task 1',
                xpReward: 100,
                priority: 'high',
            },
            {
                id: 'task-2',
                title: 'Test Task 2',
                xpReward: 50,
                priority: 'medium',
            },
        ],
    },
};

describe('ActiveTimer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (useTimerStore as any).mockReturnValue(mockTimerStore);
        (useUserStore as any).mockReturnValue(mockUserStore);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders initial state correctly', () => {
        render(<ActiveTimer />);

        expect(screen.getByText('Ready to Focus')).toBeInTheDocument();
        expect(screen.getByText('00:00')).toBeInTheDocument();
        expect(screen.getByText('Start Timer')).toBeInTheDocument();
    });

    it('calls recoverTimer on mount', () => {
        render(<ActiveTimer />);

        expect(mockTimerStore.recoverTimer).toHaveBeenCalledOnce();
    });

    it('starts timer when Start Timer button is clicked', () => {
        render(<ActiveTimer />);

        const startButton = screen.getByText('Start Timer');
        fireEvent.click(startButton);

        expect(mockTimerStore.startTimer).toHaveBeenCalledOnce();
    });

    it('shows active session controls when timer is running', () => {
        const runningTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1', description: 'Test session' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(runningTimerStore);

        render(<ActiveTimer />);

        expect(screen.getByText('Active Session')).toBeInTheDocument();
        expect(screen.getByText('Test session')).toBeInTheDocument();
        expect(screen.getByText('Pause')).toBeInTheDocument();
        expect(screen.getByText('Stop')).toBeInTheDocument();
    });

    it('shows resume button when timer is paused', () => {
        const pausedTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: false,
            isPaused: true,
        };
        (useTimerStore as any).mockReturnValue(pausedTimerStore);

        render(<ActiveTimer />);

        expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    it('pauses timer when Pause button is clicked', () => {
        const runningTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(runningTimerStore);

        render(<ActiveTimer />);

        const pauseButton = screen.getByText('Pause');
        fireEvent.click(pauseButton);

        expect(mockTimerStore.pauseTimer).toHaveBeenCalledOnce();
    });

    it('resumes timer when Resume button is clicked', () => {
        const pausedTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: false,
            isPaused: true,
        };
        (useTimerStore as any).mockReturnValue(pausedTimerStore);

        render(<ActiveTimer />);

        const resumeButton = screen.getByText('Resume');
        fireEvent.click(resumeButton);

        expect(mockTimerStore.resumeTimer).toHaveBeenCalledOnce();
    });

    it('stops timer when Stop button is clicked', () => {
        const runningTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(runningTimerStore);

        render(<ActiveTimer />);

        const stopButton = screen.getByText('Stop');
        fireEvent.click(stopButton);

        expect(mockTimerStore.stopTimer).toHaveBeenCalledOnce();
    });

    it('updates timer display every second when running', async () => {
        const runningTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: true,
            updateElapsedTime: vi.fn()
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(2000)
                .mockReturnValueOnce(3000),
        };
        (useTimerStore as any).mockReturnValue(runningTimerStore);

        render(<ActiveTimer />);

        // Fast-forward time
        vi.advanceTimersByTime(1000);
        await waitFor(() => {
            expect(runningTimerStore.updateElapsedTime).toHaveBeenCalled();
        });

        vi.advanceTimersByTime(1000);
        await waitFor(() => {
            expect(runningTimerStore.updateElapsedTime).toHaveBeenCalledTimes(2);
        });
    });

    it('shows daily progress stats', () => {
        const timerStoreWithStats = {
            ...mockTimerStore,
            getTotalTimeToday: vi.fn(() => 3600000), // 1 hour
            getDailyProgress: vi.fn(() => 50), // 50%
        };
        (useTimerStore as any).mockReturnValue(timerStoreWithStats);

        render(<ActiveTimer />);

        expect(screen.getByText('Today:')).toBeInTheDocument();
        expect(screen.getByText('1h')).toBeInTheDocument();
        expect(screen.getByText('Goal:')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('shows active task information when task is being timed', () => {
        const taskTimerStore = {
            ...mockTimerStore,
            activeSession: {
                id: 'session-1',
                taskId: 'task-1',
                description: 'Working on: Test Task 1'
            },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(taskTimerStore);

        render(<ActiveTimer />);

        expect(screen.getByText('Task')).toBeInTheDocument();
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument(); // XP reward
    });

    it('shows quick task selection when no active session', () => {
        render(<ActiveTimer />);

        expect(screen.getByText('Start a focused session on one of your tasks:')).toBeInTheDocument();
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('starts task-specific timer when quick task is selected', () => {
        render(<ActiveTimer />);

        const taskButton = screen.getByText('Test Task 1');
        fireEvent.click(taskButton);

        expect(mockTimerStore.startTimer).toHaveBeenCalledWith(
            undefined,
            'task-1',
            'Working on: Test Task 1'
        );
    });

    it('shows running animation when timer is active', () => {
        const runningTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(runningTimerStore);

        const { container } = render(<ActiveTimer />);

        // Check for running status indicator
        expect(screen.getByText('Recording...')).toBeInTheDocument();

        // Check for animated elements (green dot)
        const statusDot = container.querySelector('.bg-green-500');
        expect(statusDot).toBeInTheDocument();
    });

    it('shows paused status when timer is paused', () => {
        const pausedTimerStore = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: false,
            isPaused: true,
        };
        (useTimerStore as any).mockReturnValue(pausedTimerStore);

        render(<ActiveTimer />);

        expect(screen.getByText('Paused')).toBeInTheDocument();
    });

    it('formats time display correctly', () => {
        const timerStoreWithTime = {
            ...mockTimerStore,
            activeSession: { id: 'session-1' },
            isRunning: true,
            updateElapsedTime: vi.fn(() => 125000), // 2 minutes 5 seconds
        };
        (useTimerStore as any).mockReturnValue(timerStoreWithTime);

        render(<ActiveTimer />);

        // Fast-forward to trigger time update
        vi.advanceTimersByTime(1000);

        // Should show formatted time (02:05)
        expect(screen.getByText('02:05')).toBeInTheDocument();
    });

    it('handles user without tasks gracefully', () => {
        const userStoreWithoutTasks = {
            user: {
                id: '1',
                username: 'testuser',
                tasks: [],
            },
        };
        (useUserStore as any).mockReturnValue(userStoreWithoutTasks);

        render(<ActiveTimer />);

        // Should not show task selection section
        expect(screen.queryByText('Start a focused session on one of your tasks:')).not.toBeInTheDocument();
    });

    it('handles null user gracefully', () => {
        const userStoreWithNullUser = {
            user: null,
        };
        (useUserStore as any).mockReturnValue(userStoreWithNullUser);

        render(<ActiveTimer />);

        // Should still render basic timer functionality
        expect(screen.getByText('Start Timer')).toBeInTheDocument();
        expect(screen.queryByText('Start a focused session on one of your tasks:')).not.toBeInTheDocument();
    });
});