import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AchievementTooltip } from '../AchievementTooltip';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock createPortal
vi.mock('react-dom', () => ({
    createPortal: (children: React.ReactNode) => children,
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Star: () => <div data-testid="star-icon">Star</div>,
    Zap: () => <div data-testid="zap-icon">Zap</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    Target: () => <div data-testid="target-icon">Target</div>,
    Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
}));

describe('AchievementTooltip', () => {
    const mockAchievement = {
        id: 'task-machine',
        name: 'Task Machine',
        description: 'Complete 25 tasks total',
        icon: 'target',
        rarity: 'epic' as const,
        xpReward: 400,
        maxProgress: 25,
        progress: 15,
        unlockedAt: new Date('2024-01-15')
    };

    const defaultProps = {
        achievement: mockAchievement,
        isUnlocked: true,
        children: <button>Hover me</button>
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders trigger element', () => {
        render(<AchievementTooltip {...defaultProps} />);
        expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('shows tooltip on mouse enter after delay', async () => {
        render(<AchievementTooltip {...defaultProps} delay={100} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);

        // Fast-forward time to trigger tooltip
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('Task Machine')).toBeInTheDocument();
            expect(screen.getByText('Complete 25 tasks total')).toBeInTheDocument();
        });
    });

    it('hides tooltip on mouse leave', async () => {
        render(<AchievementTooltip {...defaultProps} delay={100} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('Task Machine')).toBeInTheDocument();
        });

        fireEvent.mouseLeave(trigger);

        await waitFor(() => {
            expect(screen.queryByText('Task Machine')).not.toBeInTheDocument();
        });
    });

    it('displays achievement details correctly', async () => {
        render(<AchievementTooltip {...defaultProps} delay={100} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('Task Machine')).toBeInTheDocument();
            expect(screen.getByText('Complete 25 tasks total')).toBeInTheDocument();
            expect(screen.getByText('epic')).toBeInTheDocument();
            expect(screen.getByText('+400')).toBeInTheDocument();
            expect(screen.getByText('15/25')).toBeInTheDocument();
        });
    });

    it('shows unlocked status for unlocked achievements', async () => {
        render(<AchievementTooltip {...defaultProps} delay={100} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('✓ Unlocked')).toBeInTheDocument();
        });
    });

    it('shows locked status for locked achievements', async () => {
        render(<AchievementTooltip {...defaultProps} isUnlocked={false} delay={100} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('🔒 Locked')).toBeInTheDocument();
        });
    });

    it('displays progress bar for achievements with maxProgress > 1', async () => {
        render(<AchievementTooltip {...defaultProps} delay={100} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('Progress')).toBeInTheDocument();
            expect(screen.getByText('15/25')).toBeInTheDocument();
        });
    });

    it('does not show progress bar for single-step achievements', async () => {
        const singleStepAchievement = {
            ...mockAchievement,
            maxProgress: 1,
            progress: 1
        };

        render(
            <AchievementTooltip
                {...defaultProps}
                achievement={singleStepAchievement}
                delay={100}
            />
        );

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.queryByText('Progress')).not.toBeInTheDocument();
        });
    });

    it('shows unlock date for unlocked achievements', async () => {
        render(<AchievementTooltip {...defaultProps} delay={100} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('Jan 15')).toBeInTheDocument();
        });
    });

    it('handles different tooltip positions', async () => {
        const positions = ['top', 'bottom', 'left', 'right'] as const;

        for (const position of positions) {
            const { unmount } = render(
                <AchievementTooltip {...defaultProps} position={position} delay={100} />
            );

            const trigger = screen.getByText('Hover me');
            fireEvent.mouseEnter(trigger);
            vi.advanceTimersByTime(100);

            await waitFor(() => {
                expect(screen.getByText('Task Machine')).toBeInTheDocument();
            });

            unmount();
        }
    });

    it('cancels tooltip show on quick mouse leave', () => {
        render(<AchievementTooltip {...defaultProps} delay={500} />);

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);

        // Leave before delay completes
        vi.advanceTimersByTime(200);
        fireEvent.mouseLeave(trigger);

        // Complete the delay
        vi.advanceTimersByTime(300);

        // Tooltip should not appear
        expect(screen.queryByText('Task Machine')).not.toBeInTheDocument();
    });

    it('applies correct rarity styling', async () => {
        const legendaryAchievement = {
            ...mockAchievement,
            rarity: 'legendary' as const
        };

        render(
            <AchievementTooltip
                {...defaultProps}
                achievement={legendaryAchievement}
                delay={100}
            />
        );

        const trigger = screen.getByText('Hover me');
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(100);

        await waitFor(() => {
            expect(screen.getByText('legendary')).toBeInTheDocument();
        });
    });
});