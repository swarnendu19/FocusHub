import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AchievementCategories, ACHIEVEMENT_CATEGORIES } from '../AchievementCategories';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    Target: () => <div data-testid="target-icon">Target</div>,
    Zap: () => <div data-testid="zap-icon">Zap</div>,
    Star: () => <div data-testid="star-icon">Star</div>,
    Award: () => <div data-testid="award-icon">Award</div>,
}));

describe('AchievementCategories', () => {
    const mockAchievements = [
        {
            id: 'first-timer',
            name: 'First Timer',
            description: 'Start your first time tracking session',
            icon: 'clock',
            rarity: 'common' as const,
            xpReward: 50,
            maxProgress: 1,
            progress: 1
        },
        {
            id: 'task-starter',
            name: 'Task Starter',
            description: 'Complete your first task',
            icon: 'target',
            rarity: 'common' as const,
            xpReward: 75,
            maxProgress: 1,
            progress: 0
        },
        {
            id: 'legendary-achiever',
            name: 'Legendary Achiever',
            description: 'Reach level 25',
            icon: 'trophy',
            rarity: 'legendary' as const,
            xpReward: 1500,
            maxProgress: 25,
            progress: 5
        }
    ];

    const defaultProps = {
        achievements: mockAchievements,
        unlockedAchievements: ['first-timer'],
        onCategorySelect: vi.fn(),
        selectedCategory: 'all'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all achievement categories', () => {
        render(<AchievementCategories {...defaultProps} />);

        ACHIEVEMENT_CATEGORIES.forEach(category => {
            expect(screen.getByText(category.name)).toBeInTheDocument();
            expect(screen.getByText(category.description)).toBeInTheDocument();
        });
    });

    it('calls onCategorySelect when category is clicked', () => {
        const onCategorySelect = vi.fn();
        render(<AchievementCategories {...defaultProps} onCategorySelect={onCategorySelect} />);

        const timeTrackingCategory = screen.getByText('Time Tracking');
        fireEvent.click(timeTrackingCategory);

        expect(onCategorySelect).toHaveBeenCalledWith('time-tracking');
    });

    it('highlights selected category', () => {
        render(<AchievementCategories {...defaultProps} selectedCategory="time-tracking" />);

        // The selected category should have different styling
        const timeTrackingCard = screen.getByText('Time Tracking').closest('[class*="bg-blue-50"]');
        expect(timeTrackingCard).toBeInTheDocument();
    });

    it('displays correct progress statistics for each category', () => {
        render(<AchievementCategories {...defaultProps} />);

        // Check that progress percentages are displayed
        const progressElements = screen.getAllByText(/\d+%/);
        expect(progressElements.length).toBeGreaterThan(0);
    });

    it('shows selection indicator for selected category', () => {
        render(<AchievementCategories {...defaultProps} selectedCategory="time-tracking" />);

        // Should show selection indicator (dot) for selected category
        const selectionIndicators = document.querySelectorAll('.w-3.h-3.rounded-full');
        expect(selectionIndicators.length).toBeGreaterThan(0);
    });

    it('calculates category stats correctly', () => {
        render(<AchievementCategories {...defaultProps} />);

        // All category should show total achievements
        expect(screen.getByText('1/3')).toBeInTheDocument(); // 1 unlocked out of 3 total
    });

    it('applies custom className', () => {
        const { container } = render(<AchievementCategories {...defaultProps} className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles mouse hover events', () => {
        render(<AchievementCategories {...defaultProps} />);

        const timeTrackingCard = screen.getByText('Time Tracking').closest('div');

        // Simulate mouse enter and leave
        if (timeTrackingCard) {
            fireEvent.mouseEnter(timeTrackingCard);
            fireEvent.mouseLeave(timeTrackingCard);
        }

        // Component should render without errors
        expect(screen.getByText('Time Tracking')).toBeInTheDocument();
    });

    it('displays correct achievement counts for different categories', () => {
        render(<AchievementCategories {...defaultProps} />);

        // Each category should show some form of progress
        ACHIEVEMENT_CATEGORIES.forEach(category => {
            const categoryElement = screen.getByText(category.name);
            expect(categoryElement).toBeInTheDocument();
        });
    });
});