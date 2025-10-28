import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskSharing } from '../TaskSharing';
import type { Task } from '@/types';

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
    },
});

const mockTask: Task = {
    id: 'test-task-1',
    title: 'Test Task for Sharing',
    description: 'This is a test task that we want to share',
    completed: false,
    createdAt: new Date('2024-01-01'),
    timeSpent: 0,
    xpReward: 150,
    priority: 'high',
    tags: ['test', 'sharing', 'collaboration'],
    estimatedTime: 3600000, // 1 hour
};

describe('TaskSharing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock window.open
        vi.stubGlobal('open', vi.fn());
    });

    it('renders the share trigger button', () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        expect(shareButton).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
    });

    it('opens the sharing dialog when trigger is clicked', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('Share Task')).toBeInTheDocument();
            expect(screen.getByText('Share this task with your team or collaborators')).toBeInTheDocument();
        });
    });

    it('displays task preview correctly in dialog', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('Test Task for Sharing')).toBeInTheDocument();
            expect(screen.getByText('This is a test task that we want to share')).toBeInTheDocument();
            expect(screen.getByText('🔥 high')).toBeInTheDocument();
            expect(screen.getByText('60m')).toBeInTheDocument();
            expect(screen.getByText('150 XP')).toBeInTheDocument();
        });
    });

    it('displays task tags in preview', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('#test')).toBeInTheDocument();
            expect(screen.getByText('#sharing')).toBeInTheDocument();
            expect(screen.getByText('#collaboration')).toBeInTheDocument();
        });
    });

    it('displays share options', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('Copy Link')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Slack')).toBeInTheDocument();
            expect(screen.getByText('Team Members')).toBeInTheDocument();
        });
    });

    it('copies link to clipboard when Copy Link is clicked', async () => {
        const mockWriteText = vi.fn().mockResolvedValue(undefined);
        navigator.clipboard.writeText = mockWriteText;

        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            const copyLinkOption = screen.getByText('Copy Link');
            fireEvent.click(copyLinkOption);
        });

        expect(mockWriteText).toHaveBeenCalledWith(
            expect.stringContaining('/import-task?data=')
        );

        await waitFor(() => {
            expect(screen.getByText('Link copied to clipboard!')).toBeInTheDocument();
        });
    });

    it('opens email client when Email option is clicked', async () => {
        const mockOpen = vi.fn();
        window.open = mockOpen;

        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            const emailOption = screen.getByText('Email');
            fireEvent.click(emailOption);
        });

        expect(mockOpen).toHaveBeenCalledWith(
            expect.stringContaining('mailto:?subject=')
        );
    });

    it('shows coming soon message for Slack integration', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            const slackOption = screen.getByText('Slack');
            fireEvent.click(slackOption);
        });

        await waitFor(() => {
            expect(screen.getByText('Slack integration coming soon!')).toBeInTheDocument();
        });
    });

    it('shows coming soon message for team sharing', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            const teamOption = screen.getByText('Team Members');
            fireEvent.click(teamOption);
        });

        await waitFor(() => {
            expect(screen.getByText('Team sharing coming soon!')).toBeInTheDocument();
        });
    });

    it('displays shareable link input field', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('Shareable Link')).toBeInTheDocument();
            const linkInput = screen.getByDisplayValue(
                expect.stringContaining('/import-task?data=')
            );
            expect(linkInput).toBeInTheDocument();
            expect(linkInput).toHaveAttribute('readonly');
        });
    });

    it('handles task without description gracefully', async () => {
        const taskWithoutDescription = { ...mockTask, description: undefined };
        render(<TaskSharing task={taskWithoutDescription} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('No description provided')).toBeInTheDocument();
        });
    });

    it('handles task without estimated time gracefully', async () => {
        const taskWithoutTime = { ...mockTask, estimatedTime: undefined };
        render(<TaskSharing task={taskWithoutTime} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            // Should not show time badge
            expect(screen.queryByText(/\d+m/)).not.toBeInTheDocument();
        });
    });

    it('generates correct shareable link format', async () => {
        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            const linkInput = screen.getByDisplayValue(
                expect.stringContaining('/import-task?data=')
            ) as HTMLInputElement;

            const url = new URL(linkInput.value);
            expect(url.pathname).toBe('/import-task');
            expect(url.searchParams.has('data')).toBe(true);

            // Verify the data parameter contains task information
            const taskData = JSON.parse(decodeURIComponent(url.searchParams.get('data') || ''));
            expect(taskData.title).toBe(mockTask.title);
            expect(taskData.description).toBe(mockTask.description);
            expect(taskData.priority).toBe(mockTask.priority);
            expect(taskData.xpReward).toBe(mockTask.xpReward);
        });
    });

    it('shows success state after copying link', async () => {
        const mockWriteText = vi.fn().mockResolvedValue(undefined);
        navigator.clipboard.writeText = mockWriteText;

        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            const copyButton = screen.getAllByRole('button').find(btn =>
                btn.querySelector('svg') // Find button with copy icon
            );
            if (copyButton) fireEvent.click(copyButton);
        });

        await waitFor(() => {
            // Check icon changes to checkmark
            expect(screen.getByText('Link copied to clipboard!')).toBeInTheDocument();
        });
    });

    it('handles clipboard copy failure gracefully', async () => {
        const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard failed'));
        navigator.clipboard.writeText = mockWriteText;

        render(<TaskSharing task={mockTask} />);

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            const copyLinkOption = screen.getByText('Copy Link');
            fireEvent.click(copyLinkOption);
        });

        await waitFor(() => {
            expect(screen.getByText('Failed to copy link')).toBeInTheDocument();
        });
    });
});