import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskTimer } from '../TaskTimer';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';
import type { Task } from '@/types';

// Mock the stores
vi.mock('@/stores/timerStore');
vi.mock('@/stores/userStore');

const mockTask: Task = {
    id: 'test-task-1',
    title: 'Test Task',
    description: 'This is a test task',
    completed: false,
    createdAt: new Date('2024-01-01'),
    timeSpent: 1800000, // 30 minutes
    xpReward: 100,
    priority: 'medium',
    tags: ['test', 'frontend'],
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    estimatedTime: 3600000, // 1 hour
};

const mockTimerStore = {
    activeSession: null,
    isRunning: false,
    isPaused: false,
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    updateElapsedTime: vi.fn(() => 0),
};

const mockUserStore = {
    updateTask: vi.fn(),
    addXP: vi.fn(),
};

describe('TaskTimer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useTimerStore as any).mockReturnValue(mockTimerStore);
        (useUserStore as any).mockReturnValue(mockUserStore);
    });

    it('renders task information correctly', () => {
        render(<TaskTimer task={mockTask} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('This is a test task')).toBeInTheDocument();
        expect(screen.getByText('100 XP')).toBeInTheDocument();
        expect(screen.getByText('30m logged')).toBeInTheDocument();
        expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('shows progress bar with correct percentage', () => {
        render(<TaskTimer task={mockTask} />);

        // 30 minutes out of 60 minutes estimated = 50%
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('displays deadline information correctly', () => {
        render(<TaskTimer task={mockTask} />);

        // Should show deadline badge (exact text depends on time formatting)
        expect(screen.getByText(/day/)).toBeInTheDocument();
    });

    it('shows overdue status for past deadline', () => {
        const overdueTask = {
            ...mockTask,
            deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        };

        render(<TaskTimer task={overdueTask} />);

        expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    it('starts timer when Start Task button is clicked', () => {
        render(<TaskTimer task={mockTask} />);

        const startButton = screen.getByText('Start Task');
        fireEvent.click(startButton);

        expect(mockTimerStore.startTimer).toHaveBeenCalledWith(
            undefined,
            'test-task-1',
            'Working on: Test Task'
        );
    });

    it('shows timer controls when task is active', () => {
        const activeTimerStore = {
            ...mockTimerStore,
            activeSession: { taskId: 'test-task-1' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(activeTimerStore);

        render(<TaskTimer task={mockTask} />);

        expect(screen.getByText('Pause')).toBeInTheDocument();
        expect(screen.getByText('Stop')).toBeInTheDocument();
        expect(screen.getByText('Current Session')).toBeInTheDocument();
    });

    it('pauses timer when Pause button is clicked', () => {
        const activeTimerStore = {
            ...mockTimerStore,
            activeSession: { taskId: 'test-task-1' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(activeTimerStore);

        render(<TaskTimer task={mockTask} />);

        const pauseButton = screen.getByText('Pause');
        fireEvent.click(pauseButton);

        expect(mockTimerStore.pauseTimer).toHaveBeenCalled();
    });

    it('resumes timer when Resume button is clicked', () => {
        const pausedTimerStore = {
            ...mockTimerStore,
            activeSession: { taskId: 'test-task-1' },
            isRunning: false,
            isPaused: true,
        };
        (useTimerStore as any).mockReturnValue(pausedTimerStore);

        render(<TaskTimer task={mockTask} />);

        const resumeButton = screen.getByText('Resume');
        fireEvent.click(resumeButton);

        expect(mockTimerStore.resumeTimer).toHaveBeenCalled();
    });

    it('stops timer and updates task when Stop button is clicked', () => {
        const activeTimerStore = {
            ...mockTimerStore,
            activeSession: { taskId: 'test-task-1' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(activeTimerStore);

        render(<TaskTimer task={mockTask} />);

        const stopButton = screen.getByText('Stop');
        fireEvent.click(stopButton);

        expect(mockTimerStore.stopTimer).toHaveBeenCalled();
        expect(mockUserStore.updateTask).toHaveBeenCalledWith('test-task-1', {
            timeSpent: expect.any(Number),
            lastWorkedOn: expect.any(Date),
        });
    });

    it('completes task and shows celebration modal', async () => {
        const onComplete = vi.fn();
        render(<TaskTimer task={mockTask} onComplete={onComplete} />);

        const completeButton = screen.getByText('Complete Task');
        fireEvent.click(completeButton);

        expect(mockUserStore.addXP).toHaveBeenCalledWith(100);
        expect(onComplete).toHaveBeenCalledWith('test-task-1', 100);

        // Check for celebration modal
        await waitFor(() => {
            expect(screen.getByText('Task Completed!')).toBeInTheDocument();
            expect(screen.getByText('+100 XP')).toBeInTheDocument();
        });
    });

    it('shows urgent styling for tasks due within 24 hours', () => {
        const urgentTask = {
            ...mockTask,
            deadline: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        };

        const { container } = render(<TaskTimer task={urgentTask} />);

        // Check for orange border styling (urgent)
        const card = container.querySelector('.border-orange-200');
        expect(card).toBeInTheDocument();
    });

    it('shows active styling when task is being timed', () => {
        const activeTimerStore = {
            ...mockTimerStore,
            activeSession: { taskId: 'test-task-1' },
            isRunning: true,
        };
        (useTimerStore as any).mockReturnValue(activeTimerStore);

        const { container } = render(<TaskTimer task={mockTask} />);

        // Check for green border styling (active)
        const card = container.querySelector('.border-green-200');
        expect(card).toBeInTheDocument();
    });

    it('displays correct priority styling and icon', () => {
        const highPriorityTask = { ...mockTask, priority: 'high' as const };
        render(<TaskTimer task={highPriorityTask} />);

        expect(screen.getByText('🔥 high')).toBeInTheDocument();

        const lowPriorityTask = { ...mockTask, priority: 'low' as const };
        render(<TaskTimer task={lowPriorityTask} />);

        expect(screen.getByText('🌱 low')).toBeInTheDocument();
    });

    it('handles task without deadline gracefully', () => {
        const taskWithoutDeadline = { ...mockTask, deadline: undefined };
        render(<TaskTimer task={taskWithoutDeadline} />);

        // Should not show deadline badge
        expect(screen.queryByText(/day/)).not.toBeInTheDocument();
        expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('handles task without estimated time using default', () => {
        const taskWithoutEstimate = { ...mockTask, estimatedTime: undefined };
        render(<TaskTimer task={taskWithoutEstimate} />);

        // Should use default 1 hour estimate
        // 30 minutes out of 60 minutes = 50%
        expect(screen.getByText('50%')).toBeInTheDocument();
    });
});