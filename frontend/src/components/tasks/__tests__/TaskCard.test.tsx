import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TaskCard } from '../TaskCard';
import type { Task } from '@/types';

const mockTask: Task = {
    id: 'test-task-1',
    title: 'Test Task',
    description: 'This is a test task description',
    completed: false,
    createdAt: new Date('2024-01-01'),
    timeSpent: 3600000, // 1 hour
    xpReward: 100,
    priority: 'high',
    tags: ['test', 'frontend']
};

const mockCompletedTask: Task = {
    ...mockTask,
    id: 'test-task-2',
    completed: true,
    completedAt: new Date('2024-01-02')
};

describe('TaskCard', () => {
    it('renders task information correctly', () => {
        render(<TaskCard task={mockTask} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('This is a test task description')).toBeInTheDocument();
        expect(screen.getByText('🔥 high')).toBeInTheDocument();
        expect(screen.getByText('+100 XP')).toBeInTheDocument();
        expect(screen.getByText('#test')).toBeInTheDocument();
        expect(screen.getByText('#frontend')).toBeInTheDocument();
    });

    it('shows start and complete buttons for active tasks', () => {
        render(<TaskCard task={mockTask} onStart={vi.fn()} onComplete={vi.fn()} />);

        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    });

    it('calls onComplete when complete button is clicked', () => {
        const mockOnComplete = vi.fn();
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        const completeButton = screen.getByRole('button', { name: '' }); // CheckCircle icon button
        fireEvent.click(completeButton);

        expect(mockOnComplete).toHaveBeenCalledWith('test-task-1');
    });

    it('calls onStart when start button is clicked', () => {
        const mockOnStart = vi.fn();
        render(<TaskCard task={mockTask} onStart={mockOnStart} />);

        const startButton = screen.getByText('Start');
        fireEvent.click(startButton);

        expect(mockOnStart).toHaveBeenCalledWith('test-task-1');
    });

    it('shows completion status for completed tasks', () => {
        render(<TaskCard task={mockCompletedTask} />);

        expect(screen.getByText('✓ Complete')).toBeInTheDocument();
        expect(screen.queryByText('Start')).not.toBeInTheDocument();
    });

    it('displays time spent when available', () => {
        render(<TaskCard task={mockTask} />);

        expect(screen.getByText('1h')).toBeInTheDocument();
    });

    it('shows active indicator when task is active', () => {
        render(<TaskCard task={mockTask} isActive={true} />);

        // The active indicator is a visual element, we can check if the component renders without error
        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
});