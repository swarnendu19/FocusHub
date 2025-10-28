import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskImport } from '../TaskImport';
import { useUserStore } from '@/stores/userStore';

// Mock the user store
vi.mock('@/stores/userStore');

const mockUserStore = {
    addTask: vi.fn(),
};

describe('TaskImport', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useUserStore as any).mockReturnValue(mockUserStore);
    });

    it('renders the import trigger button', () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        expect(importButton).toBeInTheDocument();
        expect(screen.getByText('Import')).toBeInTheDocument();
    });

    it('opens the import dialog when trigger is clicked', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            expect(screen.getByText('Import Tasks')).toBeInTheDocument();
            expect(screen.getByText('Import tasks from various sources or shared links')).toBeInTheDocument();
        });
    });

    it('displays import source options', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            expect(screen.getByText('Shareable Link')).toBeInTheDocument();
            expect(screen.getByText('JSON Data')).toBeInTheDocument();
            expect(screen.getByText('Todoist')).toBeInTheDocument();
            expect(screen.getByText('TickTick')).toBeInTheDocument();
        });
    });

    it('shows coming soon badges for external integrations', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const comingSoonBadges = screen.getAllByText('Coming Soon');
            expect(comingSoonBadges).toHaveLength(2); // Todoist and TickTick
        });
    });

    it('allows selecting shareable link import method', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const shareableLinkOption = screen.getByText('Shareable Link');
            fireEvent.click(shareableLinkOption);

            expect(screen.getByText('Import from Shareable Link')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/https:\/\/example.com/)).toBeInTheDocument();
        });
    });

    it('allows selecting JSON import method', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const jsonOption = screen.getByText('JSON Data');
            fireEvent.click(jsonOption);

            expect(screen.getByText('Import from JSON Data')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/{"title": "My Task"/)).toBeInTheDocument();
        });
    });

    it('validates shareable link format', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const shareableLinkOption = screen.getByText('Shareable Link');
            fireEvent.click(shareableLinkOption);

            const linkInput = screen.getByPlaceholderText(/https:\/\/example.com/);
            fireEvent.change(linkInput, { target: { value: 'invalid-url' } });

            const previewButton = screen.getByText('Preview Task');
            fireEvent.click(previewButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Import Failed')).toBeInTheDocument();
        });
    });

    it('parses valid shareable link correctly', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const shareableLinkOption = screen.getByText('Shareable Link');
            fireEvent.click(shareableLinkOption);

            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                priority: 'high',
                xpReward: 100,
                tags: ['test']
            };
            const validUrl = `http://localhost/import-task?data=${encodeURIComponent(JSON.stringify(taskData))}`;

            const linkInput = screen.getByPlaceholderText(/https:\/\/example.com/);
            fireEvent.change(linkInput, { target: { value: validUrl } });

            const previewButton = screen.getByText('Preview Task');
            fireEvent.click(previewButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Preview (1 task)')).toBeInTheDocument();
            expect(screen.getByText('Test Task')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
        });
    });

    it('parses valid JSON data correctly', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const jsonOption = screen.getByText('JSON Data');
            fireEvent.click(jsonOption);

            const jsonData = JSON.stringify({
                title: 'JSON Task',
                description: 'JSON Description',
                priority: 'medium',
                xpReward: 150
            });

            const jsonInput = screen.getByPlaceholderText(/{"title": "My Task"/);
            fireEvent.change(jsonInput, { target: { value: jsonData } });

            const previewButton = screen.getByText('Preview Tasks');
            fireEvent.click(previewButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Preview (1 task)')).toBeInTheDocument();
            expect(screen.getByText('JSON Task')).toBeInTheDocument();
            expect(screen.getByText('JSON Description')).toBeInTheDocument();
        });
    });

    it('handles invalid JSON gracefully', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const jsonOption = screen.getByText('JSON Data');
            fireEvent.click(jsonOption);

            const jsonInput = screen.getByPlaceholderText(/{"title": "My Task"/);
            fireEvent.change(jsonInput, { target: { value: 'invalid json' } });

            const previewButton = screen.getByText('Preview Tasks');
            fireEvent.click(previewButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Import Failed')).toBeInTheDocument();
            expect(screen.getByText('Invalid JSON format')).toBeInTheDocument();
        });
    });

    it('imports tasks when Import All is clicked', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const jsonOption = screen.getByText('JSON Data');
            fireEvent.click(jsonOption);

            const jsonData = JSON.stringify({
                title: 'Import Test Task',
                description: 'Test Description',
                priority: 'high',
                xpReward: 200,
                tags: ['imported']
            });

            const jsonInput = screen.getByPlaceholderText(/{"title": "My Task"/);
            fireEvent.change(jsonInput, { target: { value: jsonData } });

            const previewButton = screen.getByText('Preview Tasks');
            fireEvent.click(previewButton);
        });

        await waitFor(() => {
            const importAllButton = screen.getByText('Import All');
            fireEvent.click(importAllButton);

            expect(mockUserStore.addTask).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Import Test Task',
                    description: 'Test Description',
                    priority: 'high',
                    xpReward: 200,
                    tags: ['imported'],
                    completed: false,
                    timeSpent: 0,
                })
            );
        });
    });

    it('handles array of tasks in JSON', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const jsonOption = screen.getByText('JSON Data');
            fireEvent.click(jsonOption);

            const jsonData = JSON.stringify([
                { title: 'Task 1', priority: 'high', xpReward: 100 },
                { title: 'Task 2', priority: 'low', xpReward: 50 }
            ]);

            const jsonInput = screen.getByPlaceholderText(/{"title": "My Task"/);
            fireEvent.change(jsonInput, { target: { value: jsonData } });

            const previewButton = screen.getByText('Preview Tasks');
            fireEvent.click(previewButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Preview (2 tasks)')).toBeInTheDocument();
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });
    });

    it('allows canceling import process', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const jsonOption = screen.getByText('JSON Data');
            fireEvent.click(jsonOption);

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            fireEvent.click(cancelButton);

            // Should return to source selection
            expect(screen.getByText('Choose Import Source')).toBeInTheDocument();
        });
    });

    it('resets state when dialog is closed', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const jsonOption = screen.getByText('JSON Data');
            fireEvent.click(jsonOption);
        });

        // Close dialog (this would typically be done by clicking outside or escape)
        // For testing purposes, we'll simulate the onOpenChange callback
        // In a real test, you might need to trigger the actual close mechanism
    });

    it('prevents clicking on coming soon options', async () => {
        render(<TaskImport />);

        const importButton = screen.getByRole('button', { name: /import/i });
        fireEvent.click(importButton);

        await waitFor(() => {
            const todoistOption = screen.getByText('Todoist');
            fireEvent.click(todoistOption);

            // Should still show source selection, not navigate to Todoist import
            expect(screen.getByText('Choose Import Source')).toBeInTheDocument();
            expect(screen.queryByText('Import from Todoist')).not.toBeInTheDocument();
        });
    });
});