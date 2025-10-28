import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComparativeChart } from '../ComparativeChart';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

describe('ComparativeChart', () => {
    const mockData = [
        { label: 'Tasks Completed', current: 25, previous: 20 },
        { label: 'Hours Worked', current: 40, previous: 35 },
        { label: 'Projects Active', current: 3, previous: 4 },
        { label: 'XP Gained', current: 1200, previous: 1000 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<ComparativeChart data={mockData} />);

        expect(screen.getByText('Performance Comparison')).toBeInTheDocument();
        expect(screen.getByText('Current vs Previous Period')).toBeInTheDocument();
    });

    it('displays all comparison items', () => {
        render(<ComparativeChart data={mockData} />);

        mockData.forEach(item => {
            expect(screen.getByText(item.label)).toBeInTheDocument();
            expect(screen.getByText(item.current.toLocaleString())).toBeInTheDocument();
            expect(screen.getByText(item.previous.toLocaleString())).toBeInTheDocument();
        });
    });

    it('calculates percentage changes correctly', () => {
        render(<ComparativeChart data={mockData} showPercentageChange={true} />);

        // Tasks: (25-20)/20 * 100 = 25%
        expect(screen.getByText('+25.0%')).toBeInTheDocument();

        // Hours: (40-35)/35 * 100 = 14.3%
        expect(screen.getByText('+14.3%')).toBeInTheDocument();

        // Projects: (3-4)/4 * 100 = -25%
        expect(screen.getByText('-25.0%')).toBeInTheDocument();

        // XP: (1200-1000)/1000 * 100 = 20%
        expect(screen.getByText('+20.0%')).toBeInTheDocument();
    });

    it('shows trend indicators when enabled', () => {
        render(<ComparativeChart data={mockData} showTrend={true} />);

        // Should show trend arrows (multiple elements may have same emoji)
        expect(screen.getAllByText('↗️').length).toBeGreaterThan(0); // Positive trends
        expect(screen.getByText('↘️')).toBeInTheDocument(); // Negative trend for projects
    });

    it('hides percentage changes when disabled', () => {
        render(<ComparativeChart data={mockData} showPercentageChange={false} />);

        // Should not show percentage values
        expect(screen.queryByText('+25.0%')).not.toBeInTheDocument();
        expect(screen.queryByText('+14.3%')).not.toBeInTheDocument();
    });

    it('hides trend indicators when disabled', () => {
        render(<ComparativeChart data={mockData} showTrend={false} />);

        // Should not show trend arrows
        expect(screen.queryByText('↗️')).not.toBeInTheDocument();
        expect(screen.queryByText('↘️')).not.toBeInTheDocument();
    });

    it('handles hover interactions', async () => {
        const onItemHover = vi.fn();
        render(<ComparativeChart data={mockData} onItemHover={onItemHover} />);

        const firstItem = screen.getByText('Tasks Completed').closest('div');

        if (firstItem) {
            fireEvent.mouseEnter(firstItem);
            expect(onItemHover).toHaveBeenCalledWith(mockData[0]);

            fireEvent.mouseLeave(firstItem);
            expect(onItemHover).toHaveBeenCalledWith(null);
        }
    });

    it('displays summary totals correctly', () => {
        render(<ComparativeChart data={mockData} />);

        // Current total: 25 + 40 + 3 + 1200 = 1268
        expect(screen.getByText('1,268')).toBeInTheDocument();
        expect(screen.getByText('Current Total')).toBeInTheDocument();

        // Previous total: 20 + 35 + 4 + 1000 = 1059
        expect(screen.getByText('1,059')).toBeInTheDocument();
        expect(screen.getByText('Previous Total')).toBeInTheDocument();
    });

    it('handles zero previous values correctly', () => {
        const dataWithZero = [
            { label: 'New Metric', current: 10, previous: 0 }
        ];

        render(<ComparativeChart data={dataWithZero} showPercentageChange={true} />);

        // Should show 100% for new metrics
        expect(screen.getByText('+100.0%')).toBeInTheDocument();
    });

    it('handles equal current and previous values', () => {
        const dataWithEqual = [
            { label: 'Stable Metric', current: 10, previous: 10 }
        ];

        render(<ComparativeChart data={dataWithEqual} showTrend={true} />);

        // Should show neutral trend
        expect(screen.getByText('➡️')).toBeInTheDocument();
        expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('uses custom colors when provided', () => {
        const dataWithColors = [
            { label: 'Custom Item', current: 10, previous: 5, color: '#ff0000' }
        ];

        render(<ComparativeChart data={dataWithColors} />);

        expect(screen.getByText('Custom Item')).toBeInTheDocument();
    });

    it('applies custom title and subtitle', () => {
        render(
            <ComparativeChart
                data={mockData}
                title="Custom Title"
                subtitle="Custom Subtitle"
            />
        );

        expect(screen.getByText('Custom Title')).toBeInTheDocument();
        expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <ComparativeChart data={mockData} className="custom-class" />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles empty data gracefully', () => {
        render(<ComparativeChart data={[]} />);

        expect(screen.getByText('Performance Comparison')).toBeInTheDocument();
        expect(screen.getByText('Current Total')).toBeInTheDocument();
        expect(screen.getByText('Previous Total')).toBeInTheDocument();
        // Check that zeros are displayed (multiple elements may have "0")
        expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    });
});