import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskAnalytics } from '../TaskAnalytics';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';
import type { Task } from '@/types';

// Mock the stores
vi.mock('@/stores/userStore');
vi.mock('@/stores/timerStore');

const mockTasks: Task[] = [
    {
        id: 'task-1',
        title: 'High Priority Task',
        description: 'Important task',
        completed: true,
        createdAt: new Date('2024-01-01'),
        completedAt: new Date('2024-01-02'),
        timeSpent: 3600000, // 1 hour
        xpReward: 100,
        priority: 'high',
        tags: ['urgent', 'development'],
    },
    {
        id: 'task-2',
        title: 'Medium Priority Task',
        description: 'Regular task',
        completed: false,
        createdAt: new Date('2024-01-03'),
        timeSpent: 1800000, // 30 minutes
        xpReward: 75,
        priority: 'medium',
        tags: ['development', 'feature'],
    },
    {
        id: 'task-3',
        title: 'Low Priority Task',
        description: 'Low importance task',
        completed: true,
        createdAt: new Date('2024-01-04'),
        completedAt: new Date('2024-01-05'),
        timeSpent: 2700000, // 45 minutes
        xpReward: 50,
        priority: 'low',
        tags: ['maintenance'],
    },
];

const mockUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    level: 5,
    totalXP: 1000,
    currentXP: 250,
    xpToNextLevel: 750,
    streak: 7,
    joinDate: new Date('2024-01-01'),
    preferences: {
        theme: 'light' as const,
        animations: 'full' as const,
        notifications: true,
        soundEffects: true,
    },
    tasks: mockTasks.filter(t => !t.completed),
    completedTasks: mockTasks.filter(t => t.completed),
    isOptIn: true,
    tasksCompleted: 2,
    unlockedBadges: [],
};

const mockUserStore = {
    user: mockUser,
};

const mockTimerStore = {
    sessions: [],
};

describe('TaskAnalytics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useUserStore as any).mockReturnValue(mockUserStore);
        (useTimerStore as any).mockReturnValue(mockTimerStore);
    });

    it('renders analytics header correctly', () => {
        render(<TaskAnalytics />);

        expect(screen.getByText('Task Analytics')).toBeInTheDocument();
        expect(screen.getByText('Insights into your productivity and task completion patterns')).toBeInTheDocument();
    });

    it('displays timeframe filter options', () => {
        render(<TaskAnalytics />);

        expect(screen.getByText('Today')).toBeInTheDocument();
        expect(screen.getByText('This Week')).toBeInTheDocument();
        expect(screen.getByText('All Time')).toBeInTheDocument();
    });

    it('shows overview statistics cards', () => {
        render(<TaskAnalytics />);

        expect(screen.getByText('Total Tasks')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('Time Spent')).toBeInTheDocument();
        expect(screen.getByText('XP Earned')).toBeInTheDocument();
    });

    it('calculates and displays correct task statistics', () => {
        render(<TaskAnalytics />);

        // Should show total tasks (3)
        expect(screen.getByText('3')).toBeInTheDocument();

        // Should show completed tasks (2)
        expect(screen.getByText('2')).toBeInTheDocument();

        // Should show completion rate (67% = 2/3 * 100)
        expect(screen.getByText('67% completion rate')).toBeInTheDocument();

        // Should show total XP earned (150 = 100 + 50 from completed tasks)
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('displays priority breakdown section', () => {
        render(<TaskAnalytics />);

        expect(screen.getByText('Priority Breakdown')).toBeInTheDocument();
        expect(screen.getByText('🔥 high')).toBeInTheDocument();
        expect(screen.getByText('⚡ medium')).toBeInTheDocument();
        expect(screen.getByText('🌱 low')).toBeInTheDocument();
    });

    it('shows correct priority statistics', () => {
        render(<TaskAnalytics />);

        // High priority: 1 total, 1 completed = 100%
        expect(screen.getByText('1/1 completed')).toBeInTheDocument();

        // Medium priority: 1 total, 0 completed = 0%
        expect(screen.getByText('0/1 completed')).toBeInTheDocument();

        // Low priority: 1 total, 1 completed = 100%
        expect(screen.getByText('1/1 completed')).toBeInTheDocument();
    });

    it('displays most used tags section', () => {
        render(<TaskAnalytics />);

        expect(screen.getByText('Most Used Tags')).toBeInTheDocument();
        expect(screen.getByText('#development')).toBeInTheDocument();
        expect(screen.getByText('#urgent')).toBeInTheDocument();
        expect(screen.getByText('#feature')).toBeInTheDocument();
        expect(screen.getByText('#maintenance')).toBeInTheDocument();
    });

    it('changes timeframe when filter is clicked', () => {
        render(<TaskAnalytics />);

        const todayButton = screen.getByText('Today');
        fireEvent.click(todayButton);

        // The button should now be selected (different styling)
        expect(todayButton).toHaveClass('bg-blue-600'); // or whatever the selected class is
    });

    it('shows export button', () => {
        render(<TaskAnalytics />);

        expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('handles empty state when no tasks exist', () => {
        const emptyUserStore = {
            user: {
                ...mockUser,
                tasks: [],
                completedTasks: [],
            },
        };
        (useUserStore as any).mockReturnValue(emptyUserStore);

        render(<TaskAnalytics />);

        expect(screen.getByText('No data for This Week')).toBeInTheDocument();
        expect(screen.getByText('Create and complete some tasks to see your analytics here')).toBeInTheDocument();
    });

    it('handles empty tags state', () => {
        const noTagsUserStore = {
            user: {
                ...mockUser,
                tasks: mockTasks.map(task => ({ ...task, tags: [] })),
                completedTasks: [],
            },
        };
        (useUserStore as any).mockReturnValue(noTagsUserStore);

        render(<TaskAnalytics />);

        expect(screen.getByText('No tags yet')).toBeInTheDocument();
        expect(screen.getByText('Start adding tags to your tasks to see analytics here')).toBeInTheDocument();
    });

    it('calculates time spent correctly', () => {
        render(<TaskAnalytics />);

        // Total time: 1h + 30m + 45m = 2h 15m
        // Should display as "2h 15m" or similar format
        expect(screen.getByText(/2h/)).toBeInTheDocument();
    });

    it('shows correct average task time', () => {
        render(<TaskAnalytics />);

        // Average: (3600000 + 1800000 + 2700000) / 3 = 2700000ms = 45m
        expect(screen.getByText(/45m avg per task/)).toBeInTheDocument();
    });

    it('filters data by timeframe correctly', () => {
        // Mock dates to be within today
        const todayTasks = mockTasks.map(task => ({
            ...task,
            createdAt: new Date(), // Today
        }));

        const todayUserStore = {
            user: {
                ...mockUser,
                tasks: todayTasks.filter(t => !t.completed),
                completedTasks: todayTasks.filter(t => t.completed),
            },
        };
        (useUserStore as any).mockReturnValue(todayUserStore);

        render(<TaskAnalytics />);

        const todayButton = screen.getByText('Today');
        fireEvent.click(todayButton);

        // Should show today's data
        expect(screen.getByText('3')).toBeInTheDocument(); // Total tasks
    });

    it('handles user with no data gracefully', () => {
        const noUserStore = {
            user: null,
        };
        (useUserStore as any).mockReturnValue(noUserStore);

        render(<TaskAnalytics />);

        // Should show empty state
        expect(screen.getByText('No data for This Week')).toBeInTheDocument();
    });

    it('displays progress bars for priorities', () => {
        render(<TaskAnalytics />);

        // Should have progress bars for each priority level
        const progressBars = screen.getAllByRole('progressbar');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('shows tag usage counts', () => {
        render(<TaskAnalytics />);

        // 'development' appears in 2 tasks, should show count of 2
        expect(screen.getByText('2')).toBeInTheDocument();

        // Other tags appear once each, should show count of 1
        const oneCountElements = screen.getAllByText('1');
        expect(oneCountElements.length).toBeGreaterThan(0);
    });
});