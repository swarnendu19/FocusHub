import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardFilters } from '../LeaderboardFilters';

describe('LeaderboardFilters', () => {
    const mockOnTimeframeChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all timeframe options', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        expect(screen.getByText('Today')).toBeInTheDocument();
        expect(screen.getByText('This Week')).toBeInTheDocument();
        expect(screen.getByText('This Month')).toBeInTheDocument();
        expect(screen.getByText('All Time')).toBeInTheDocument();
    });

    it('highlights the selected timeframe', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="weekly"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        const weeklyButton = screen.getByText('This Week');
        expect(weeklyButton.closest('button')).toHaveClass('bg-blue-600'); // or whatever the selected class is
    });

    it('calls onTimeframeChange when a different timeframe is selected', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        const dailyButton = screen.getByText('Today');
        fireEvent.click(dailyButton);

        expect(mockOnTimeframeChange).toHaveBeenCalledWith('daily');
    });

    it('displays the header and description', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        expect(screen.getByText('Leaderboard Rankings')).toBeInTheDocument();
        expect(screen.getByText('Choose a timeframe to see how you stack up')).toBeInTheDocument();
    });

    it('shows total users count when provided', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
                totalUsers={150}
            />
        );

        expect(screen.getByText('150 competitors')).toBeInTheDocument();
    });

    it('does not show users count when not provided or zero', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
                totalUsers={0}
            />
        );

        expect(screen.queryByText('competitors')).not.toBeInTheDocument();
    });

    it('displays the correct description for selected timeframe', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="daily"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        expect(screen.getByText('Daily rankings')).toBeInTheDocument();
    });

    it('updates description when timeframe changes', () => {
        const { rerender } = render(
            <LeaderboardFilters
                selectedTimeframe="daily"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        expect(screen.getByText('Daily rankings')).toBeInTheDocument();

        rerender(
            <LeaderboardFilters
                selectedTimeframe="monthly"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        expect(screen.getByText('Monthly rankings')).toBeInTheDocument();
        expect(screen.queryByText('Daily rankings')).not.toBeInTheDocument();
    });

    it('shows correct icons for each timeframe', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        // Check that icons are present (they should be rendered as SVG elements)
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(4);

        // Each button should contain an icon (SVG)
        buttons.forEach(button => {
            const svg = button.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
    });

    it('applies correct styling to selected and unselected buttons', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="weekly"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        const weeklyButton = screen.getByText('This Week').closest('button');
        const dailyButton = screen.getByText('Today').closest('button');

        // Selected button should have different styling
        expect(weeklyButton).toHaveClass('bg-blue-600'); // Selected styling
        expect(dailyButton).not.toHaveClass('bg-blue-600'); // Unselected styling
    });

    it('handles large user counts with proper formatting', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
                totalUsers={1234567}
            />
        );

        expect(screen.getByText('1,234,567 competitors')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = render(
            <LeaderboardFilters
                selectedTimeframe="all-time"
                onTimeframeChange={mockOnTimeframeChange}
                className="custom-class"
            />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('maintains button state correctly when clicking the same timeframe', () => {
        render(
            <LeaderboardFilters
                selectedTimeframe="weekly"
                onTimeframeChange={mockOnTimeframeChange}
            />
        );

        const weeklyButton = screen.getByText('This Week');
        fireEvent.click(weeklyButton);

        expect(mockOnTimeframeChange).toHaveBeenCalledWith('weekly');
    });

    it('shows all timeframe descriptions correctly', () => {
        const timeframes: Array<{
            timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
            description: string;
        }> = [
                { timeframe: 'daily', description: 'Daily rankings' },
                { timeframe: 'weekly', description: 'Weekly rankings' },
                { timeframe: 'monthly', description: 'Monthly rankings' },
                { timeframe: 'all-time', description: 'Overall rankings' }
            ];

        timeframes.forEach(({ timeframe, description }) => {
            const { rerender } = render(
                <LeaderboardFilters
                    selectedTimeframe={timeframe}
                    onTimeframeChange={mockOnTimeframeChange}
                />
            );

            expect(screen.getByText(description)).toBeInTheDocument();
        });
    });
});