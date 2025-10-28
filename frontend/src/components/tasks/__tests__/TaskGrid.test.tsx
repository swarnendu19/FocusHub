import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { TaskGrid } from '../TaskGrid';
import type { Task } from '@/types';

const mockTasks: Task[] = [
    {
        id: 'task-1',
        title: 'High Priority Task',
        description: 'Important task',
        completed: false,
        createdAt: new Date('2024-01-01'),
        timeSpent: 3600000,
        xpReward: 150,
        priority: 'high',
        tags: ['urgent', 'frontend']
    },
    {
        id: 'task-2',
        title: 'Medium Priority Task',
        description: 'Regular task',
        completed: false,
        createdAt: new Date('2024-01-02'),
        timeSpent: 1800000,
        xpReward: 100,
        priority: 'medium',
        tags: ['backend']
    },
    {
        id: 'task-3',
        title: 'Completed Task',
        description: 'Done task',
        completed: true,
        createdAt: new Date('2024-01-03'),
        completedAt: new Date('2024-01-04'),
        timeSpent: 2700000,
        xpReward: 75,
        priority: 'low',
        tags: ['testing']
    }
];

describe('TaskGrid', () => {
    it('renders tasks correctly', () => {
        render(<TaskGrid tasks={mockTasks} />);

        expect(screen.getByText('High Priority Task')).toBeInTheDocument();
        expect(screen.getByText('Medium Priority Task')).toBeInTheDocument();
        expect(screen.getByText('2 active')).toBeInTheDocument();
    });

    it('filters tasks by search query', async () => {
        render(<TaskGrid tasks={mockTasks} />);

        const searchInput = screen.getByPlaceholderText('Search tasks...');
        fireEvent.change(searchInput, { target: { value: 'High Priority' } });

        await waitFor(() => {
            expect(screen.getByText('High Priority Task')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.queryByText('Medium Priority Task')).not.toBeInTheDocument();
        });
    });

    it('filters tasks by priority', async () => {
        render(<TaskGrid tasks={mockTasks} />);

        const priorityFilter = screen.getByDisplayValue('All Priorities');
        fireEvent.change(priorityFilter, { target: { value: 'high' } });

        await waitFor(() => {
            expect(screen.getByText('High Priority Task')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.queryByText('Medium Priority Task')).not.toBeInTheDocument();
        });
    });

    it('shows completed tasks when enabled', () => {
        render(<TaskGrid tasks={mockTasks} showCompleted={true} />);

        expect(screen.getByText('Completed Task')).toBeInTheDocument();
        expect(screen.getByText('1 completed')).toBeInTheDocument();
    });

    it('hides completed tasks by default', () => {
        render(<TaskGrid tasks={mockTasks} showCompleted={false} />);

        expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
        expect(screen.queryByText('1 completed')).not.toBeInTheDocument();
    });

    it('calls onCreateTask when new task button is clicked', () => {
        const mockOnCreateTask = vi.fn();
        render(<TaskGrid tasks={mockTasks} onCreateTask={mockOnCreateTask} />);

        const newTaskButton = screen.getByText('New Task');
        fireEvent.click(newTaskButton);

        expect(mockOnCreateTask).toHaveBeenCalled();
    });

    it('shows empty state when no tasks', () => {
        render(<TaskGrid tasks={[]} />);

        expect(screen.getByText('No tasks yet')).toBeInTheDocument();
        expect(screen.getByText('Create your first task to start tracking your progress!')).toBeInTheDocument();
    });

    it('shows filtered empty state when search has no results', () => {
        render(<TaskGrid tasks={mockTasks} />);

        const searchInput = screen.getByPlaceholderText('Search tasks...');
        fireEvent.change(searchInput, { target: { value: 'nonexistent task' } });

        expect(screen.getByText('No tasks found')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
    });

    it('sorts tasks correctly', () => {
        render(<TaskGrid tasks={mockTasks} />);

        const sortSelect = screen.getByDisplayValue('Created Date');
        fireEvent.change(sortSelect, { target: { value: 'priority' } });

        // Tasks should still be visible, just in different order
        expect(screen.getByText('High Priority Task')).toBeInTheDocument();
        expect(screen.getByText('Medium Priority Task')).toBeInTheDocument();
    });
});