import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AchievementProgressTracker } from '../AchievementProgressTracker';

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

vi.mock('@/components/ui/progress', () => ({
    Progress: ({ value, ...props }: any) => (
        <div data-testid="progress-bar" data-value={value} {...props}>
            Progress: {value}%
        </div>
    ),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Star: () => <div data-testid="star-icon">Star</div>,
    Zap: () => <div data-testid="zap-icon">Zap</div>,
    Target: () => <div data-testid="target-icon">Target</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
    Award: () => <div data-testid="award-icon">Award</div>,
}));

describe('AchievementProgressTracker', () => {
    const mockAchievements = [
        {
            id: 'task-machine',
            name: 'Task Machine',
            description: 'Complete 25 tasks total',
            icon: 'target',
            rarity: 'epic' as const,
            xpReward: 400,
            maxProgress: 25,
            progress: 15 // 60% progress
        },
        {
            id: 'consistency-king',
            name: 'Consistency King',
            description: 'Maintain a 30-day streak',
            icon: 'zap',
            rarity: 'epic' as const,
            xpReward: 750,
            maxProgress: 30,
            progress: 25 // 83% progress (near completion)
        },
        {
            id: 'first-timer',
            name: 'First Timer',
            description: 'Start your first time tracking session',
            icon: 'clock',
            rarity: 'common' as const,
            xpReward: 50,
            maxProgress: 1,
            progress: 1 // Already completed
        },
        {
            id: 'level-climber',
            name: 'Level Climber',
            description: 'Reach level 5',
            icon: 'star',
            rarity: 'rare' as const,
            xpReward: 250,
            maxProgress: 5,
            progress: 0 // No progress
        }
    ];

    const defaultProps = {
        achievements: mockAchievements,
        unlockedAchievements: ['first-timer']
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders achievement progress tracker with in-progress achievements', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        expect(screen.getByText('Achievement Progress')).toBeInTheDocument();
        expect(screen.getByText('Task Machine')).toBeInTheDocument();
        expect(screen.getByText('Consistency King')).toBeInTheDocument();
    });

    it('does not show completed achievements', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        // First Timer is completed, so it shouldn't appear
        expect(screen.queryByText('First Timer')).not.toBeInTheDocument();
    });

    it('does not show achievements with no progress', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        // Level Climber has no progress, so it shouldn't appear
        expect(screen.queryByText('Level Climber')).not.toBeInTheDocument();
    });

    it('shows "Almost there!" indicator for near-completion achievements', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        // Consistency King has 83% progress, should show near completion
        expect(screen.getByText('Almost there!')).toBeInTheDocument();
    });

    it('displays correct progress percentages', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        // Task Machine: 15/25 = 60%
        expect(screen.getByText('15/25')).toBeInTheDocument();
        expect(screen.getByText('60%')).toBeInTheDocument();

        // Consistency King: 25/30 = 83%
        expect(screen.getByText('25/30')).toBeInTheDocument();
        expect(screen.getByText('83%')).toBeInTheDocument();
    });

    it('shows estimated time to complete', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        expect(screen.getByText('10 more tasks')).toBeInTheDocument(); // Task Machine: 25 - 15 = 10
        expect(screen.getByText('5 more days')).toBeInTheDocument(); // Consistency King: 30 - 25 = 5
    });

    it('displays XP rewards correctly', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        expect(screen.getByText('+400')).toBeInTheDocument(); // Task Machine XP
        expect(screen.getByText('+750')).toBeInTheDocument(); // Consistency King XP
    });

    it('opens achievement detail modal when clicked', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        const taskMachineCard = screen.getByText('Task Machine').closest('div');
        if (taskMachineCard) {
            fireEvent.click(taskMachineCard);
        }

        // Modal should open with achievement details
        expect(screen.getAllByText('Task Machine')).toHaveLength(2); // One in list, one in modal
    });

    it('shows empty state when no achievements are in progress', () => {
        const emptyProps = {
            achievements: [
                {
                    id: 'completed-achievement',
                    name: 'Completed Achievement',
                    description: 'This is completed',
                    icon: 'trophy',
                    rarity: 'common' as const,
                    xpReward: 100,
                    maxProgress: 1,
                    progress: 1
                }
            ],
            unlockedAchievements: ['completed-achievement']
        };

        render(<AchievementProgressTracker {...emptyProps} />);

        expect(screen.getByText('No Achievements in Progress')).toBeInTheDocument();
        expect(screen.getByText('Complete more tasks to start working towards achievements!')).toBeInTheDocument();
    });

    it('sorts achievements by progress percentage descending', () => {
        render(<AchievementProgressTracker {...defaultProps} />);

        const achievementElements = screen.getAllByText(/\d+%/);
        const percentages = achievementElements.map(el => parseInt(el.textContent || '0'));

        // Should be sorted in descending order: 83%, 60%
        expect(percentages[0]).toBeGreaterThanOrEqual(percentages[1]);
    });

    it('applies custom className', () => {
        const { container } = render(<AchievementProgressTracker {...defaultProps} className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('limits display to 5 achievements and shows "View more" button', () => {
        const manyAchievements = Array.from({ length: 8 }, (_, i) => ({
            id: `achievement-${i}`,
            name: `Achievement ${i}`,
            description: `Description ${i}`,
            icon: 'target',
            rarity: 'common' as const,
            xpReward: 100,
            maxProgress: 10,
            progress: 5
        }));

        render(<AchievementProgressTracker achievements={manyAchievements} unlockedAchievements={[]} />);

        // Should show "View X more in progress" button
        expect(screen.getByText(/View \d+ more in progress/)).toBeInTheDocument();
    });
});