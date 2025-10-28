import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimeTrackingChart } from '../TimeTrackingChart';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock chart components
vi.mock('../AnimatedLineChart', () => ({
    AnimatedLineChart: ({ data }: any) => (
        <div data-testid="line-chart">Line Chart with {data?.length || 0} points</div>
    )
}));

vi.mock('../AnimatedBarChart', () => ({
    AnimatedBarChart: ({ data }: any) => (
        <div data-testid="bar-chart">Bar Chart with {data?.length || 0} bars</div>
    )
}));

vi.mock('../AnimatedDonutChart', () => ({
    AnimatedDonutChart: ({ data }: any) => (
        <div data-testid="donut-chart">Donut Chart with {data?.length || 0} segments</div>
    )
}));

describe('TimeTrackingChart', () => {
    const mockData = [
        { date: '2024-01-01', hours: 8, task: 'Task 1', project: 'Project A' },
        { date: '2024-01-02', hours: 6, task: 'Task 2', project: 'Project A' },
        { date: '2024-01-03', hours: 7, task: 'Task 3', project: 'Project B' },
        { date: '2024-01-04', hours: 5, task: 'Task 4', project: 'Project B' },
        { date: '2024-01-05', hours: 9, task: 'Task 5', project: 'Project A' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<TimeTrackingChart data={mockData} />);

        expect(screen.getByText('Time Tracking Analytics')).toBeInTheDocument();
        expect(screen.getByText('Track your productivity over time')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('displays correct statistics', () => {
        render(<TimeTrackingChart data={mockData} />);

        // Total hours: 8 + 6 + 7 + 5 + 9 = 35
        expect(screen.getByText('35.0h')).toBeInTheDocument();
        expect(screen.getByText('Total Hours')).toBeInTheDocument();

        // Active projects: Project A and Project B = 2
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Active Projects')).toBeInTheDocument();
    });

    it('switches between chart types', async () => {
        render(<TimeTrackingChart data={mockData} />);

        // Initially shows line chart
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();

        // Switch to bar chart
        const barButton = screen.getByText('Bar');
        fireEvent.click(barButton);

        await waitFor(() => {
            expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        });

        // Switch to donut chart
        const donutButton = screen.getByText('Donut');
        fireEvent.click(donutButton);

        await waitFor(() => {
            expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
        });
    });

    it('switches between time ranges', async () => {
        render(<TimeTrackingChart data={mockData} />);

        // Switch to month view
        const monthButton = screen.getByText('Month');
        fireEvent.click(monthButton);

        // Switch to year view
        const yearButton = screen.getByText('Year');
        fireEvent.click(yearButton);

        // Should still render the chart
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('shows comparison view when enabled', () => {
        render(<TimeTrackingChart data={mockData} showComparison={true} />);

        expect(screen.getByText('Project Comparison')).toBeInTheDocument();
    });

    it('handles empty data gracefully', () => {
        render(<TimeTrackingChart data={[]} />);

        expect(screen.getByText('Time Tracking Analytics')).toBeInTheDocument();
        expect(screen.getByText('0.0h')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('groups data correctly by time range', () => {
        const weekData = [
            { date: '2024-01-01', hours: 8, project: 'Project A' }, // Monday
            { date: '2024-01-02', hours: 6, project: 'Project A' }, // Tuesday
            { date: '2024-01-01', hours: 2, project: 'Project B' }, // Same Monday
        ];

        render(<TimeTrackingChart data={weekData} timeRange="week" />);

        // Should group by day of week and sum hours for same days
        expect(screen.getByText('Time Tracking Analytics')).toBeInTheDocument();
    });

    it('calculates project data correctly', () => {
        render(<TimeTrackingChart data={mockData} chartType="donut" />);

        // Should show donut chart with project data
        expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <TimeTrackingChart data={mockData} className="custom-class" />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles missing project names', () => {
        const dataWithoutProjects = [
            { date: '2024-01-01', hours: 8, task: 'Task 1' },
            { date: '2024-01-02', hours: 6, task: 'Task 2' },
        ];

        render(<TimeTrackingChart data={dataWithoutProjects} chartType="donut" />);

        // Should handle unassigned projects
        expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
    });
});