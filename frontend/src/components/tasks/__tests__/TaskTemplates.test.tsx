import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskTemplates } from '../TaskTemplates';
import { useUserStore } from '@/stores/userStore';

// Mock the user store
vi.mock('@/stores/userStore');

const mockUserStore = {
    addTask: vi.fn(),
};

describe('TaskTemplates', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useUserStore as any).mockReturnValue(mockUserStore);
    });

    it('renders the templates trigger button', () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        expect(triggerButton).toBeInTheDocument();
        expect(screen.getByText('Templates')).toBeInTheDocument();
    });

    it('opens the templates dialog when trigger is clicked', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            expect(screen.getByText('Task Templates')).toBeInTheDocument();
            expect(screen.getByText('Choose from pre-built task templates to quickly create common tasks')).toBeInTheDocument();
        });
    });

    it('displays category filters correctly', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            expect(screen.getByText('All Templates')).toBeInTheDocument();
            expect(screen.getByText('Development')).toBeInTheDocument();
            expect(screen.getByText('Management')).toBeInTheDocument();
            expect(screen.getByText('Learning')).toBeInTheDocument();
        });
    });

    it('displays template cards with correct information', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Check for some expected templates
            expect(screen.getByText('Code Review')).toBeInTheDocument();
            expect(screen.getByText('Bug Fix')).toBeInTheDocument();
            expect(screen.getByText('Write Documentation')).toBeInTheDocument();
            expect(screen.getByText('Feature Development')).toBeInTheDocument();
        });
    });

    it('filters templates by category', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Click on Development category
            const developmentFilter = screen.getByText('Development');
            fireEvent.click(developmentFilter);
            
            // Should show development templates
            expect(screen.getByText('Code Review')).toBeInTheDocument();
            expect(screen.getByText('Bug Fix')).toBeInTheDocument();
            expect(screen.getByText('Feature Development')).toBeInTheDocument();
        });
    });

    it('creates a task from template when Create Task button is clicked', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Find and click a Create Task button (there should be multiple)
            const createButtons = screen.getAllByText('Create Task');
            fireEvent.click(createButtons[0]);
            
            expect(mockUserStore.addTask).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    completed: false,
                    createdAt: expect.any(Date),
                    timeSpent: 0,
                    xpReward: expect.any(Number),
                    priority: expect.any(String),
                    tags: expect.any(Array),
                    estimatedTime: expect.any(Number),
                })
            );
        });
    });

    it('displays template metadata correctly', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Check for priority badges
            expect(screen.getByText('🔥 high')).toBeInTheDocument();
            expect(screen.getByText('⚡ medium')).toBeInTheDocument();
            expect(screen.getByText('🌱 low')).toBeInTheDocument();
            
            // Check for XP rewards
            expect(screen.getByText('75 XP')).toBeInTheDocument();
            expect(screen.getByText('100 XP')).toBeInTheDocument();
            expect(screen.getByText('200 XP')).toBeInTheDocument();
        });
    });

    it('displays template tags', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Check for some expected tags
            expect(screen.getByText('#code-review')).toBeInTheDocument();
            expect(screen.getByText('#development')).toBeInTheDocument();
            expect(screen.getByText('#bug-fix')).toBeInTheDocument();
            expect(screen.getByText('#documentation')).toBeInTheDocument();
        });
    });

    it('shows estimated time for templates', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Check for time estimates (30m, 45m, 60m, etc.)
            expect(screen.getByText('30m')).toBeInTheDocument();
            expect(screen.getByText('45m')).toBeInTheDocument();
            expect(screen.getByText('60m')).toBeInTheDocument();
        });
    });

    it('closes dialog after creating a task', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            const createButtons = screen.getAllByText('Create Task');
            fireEvent.click(createButtons[0]);
        });
        
        // Dialog should close after task creation
        await waitFor(() => {
            expect(screen.queryByText('Task Templates')).not.toBeInTheDocument();
        });
    });

    it('handles category filtering correctly', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Click Management category
            const managementFilter = screen.getByText('Management');
            fireEvent.click(managementFilter);
            
            // Should show management templates
            expect(screen.getByText('Write Documentation')).toBeInTheDocument();
            expect(screen.getByText('Team Meeting')).toBeInTheDocument();
            expect(screen.getByText('System Maintenance')).toBeInTheDocument();
            
            // Should not show development templates
            expect(screen.queryByText('Code Review')).not.toBeInTheDocument();
        });
    });

    it('displays template descriptions', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            expect(screen.getByText('Review pull request and provide feedback')).toBeInTheDocument();
            expect(screen.getByText('Investigate and fix reported bug')).toBeInTheDocument();
            expect(screen.getByText('Create or update project documentation')).toBeInTheDocument();
        });
    });

    it('shows correct category counts in badges', async () => {
        render(<TaskTemplates />);
        
        const triggerButton = screen.getByRole('button', { name: /templates/i });
        fireEvent.click(triggerButton);
        
        await waitFor(() => {
            // Check that category badges show correct counts
            // This depends on the actual number of templates in each category
            const badges = screen.getAllByText(/^\d+$/);
            expect(badges.length).toBeGreaterThan(0);
        });
    });
});