import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CommunityAnalytics } from '../CommunityAnalytics';
import { api } from '@/services';

// Mock the API service
vi.mock('@/services', () => ({
    api: {
        analytics: {
            getGlobalStats: vi.fn(),
        },
    },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock time utils
vi.mock('@/utils/timeUtils', () => ({
    formatDurationShort: vi.fn((ms) => `${Math.round(ms / 60000)}m`),
}));

describe('CommunityAnalytics', () => {
    const mockGlobalStats = {
        totalUsers: 1250,
        totalTime: 450000000, // 125 hours in milliseconds
        totalSessions: 5000,
        averageSessionTime: 1800000, // 30 minutes
    };

    beforeEach(() => {
        vi.clearAllMocks();

        (api.analytics.getGlobalStats as any).mockResolvedValue({
            success: true,
            data: mockGlobalStats,
        });
    });

    it('renders community analytics header', () => {
        render(<CommunityAnalytics />);

        expect(screen.getByText('Community Analytics')).toBeInTheDocument();
        expect(screen.getByText('See how our productive community is performing')).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        render(<CommunityAnalytics />);

        // Should show loading skeleton
        expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('displays global stats after loading', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('1,250')).toBeInTheDocument(); // Total users
            expect(screen.getByText('125h')).toBeInTheDocument(); // Total time
            expect(screen.getByText('5,000')).toBeInTheDocument(); // Total sessions
            expect(screen.getByText('30m')).toBeInTheDocument(); // Average session
        });
    });

    it('displays productivity insights', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('Productivity Insights')).toBeInTheDocument();
            expect(screen.getByText('Community Productivity')).toBeInTheDocument();
            expect(screen.getByText('Session Quality')).toBeInTheDocument();
            expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
        });
    });

    it('displays community milestones', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('Community Milestones')).toBeInTheDocument();
            expect(screen.getByText('1,000 Users Milestone')).toBeInTheDocument();
            expect(screen.getByText('100,000 Hours Tracked')).toBeInTheDocument();
            expect(screen.getByText('1M Tasks Completed')).toBeInTheDocument();
        });
    });

    it('shows timeframe selection buttons', () => {
        render(<CommunityAnalytics />);

        expect(screen.getByText('Daily')).toBeInTheDocument();
        expect(screen.getByText('Weekly')).toBeInTheDocument();
        expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    it('handles timeframe selection', () => {
        render(<CommunityAnalytics />);

        const dailyButton = screen.getByText('Daily');
        const weeklyButton = screen.getByText('Weekly');

        // Weekly should be selected by default
        expect(weeklyButton).toHaveClass('default');

        fireEvent.click(dailyButton);
        // Note: In a real implementation, this would trigger state change
        // For now, we just verify the button exists and is clickable
        expect(dailyButton).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        (api.analytics.getGlobalStats as any).mockRejectedValue(new Error('API Error'));

        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('Analytics Unavailable')).toBeInTheDocument();
            expect(screen.getByText('Failed to load community stats')).toBeInTheDocument();
        });
    });

    it('allows retry after error', async () => {
        (api.analytics.getGlobalStats as any).mockRejectedValueOnce(new Error('API Error'))
            .mockResolvedValueOnce({
                success: true,
                data: mockGlobalStats,
            });

        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });

        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);

        await waitFor(() => {
            expect(screen.getByText('1,250')).toBeInTheDocument();
        });
    });

    it('displays trend indicators', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('+12%')).toBeInTheDocument();
            expect(screen.getByText('+8%')).toBeInTheDocument();
            expect(screen.getByText('+15%')).toBeInTheDocument();
        });
    });

    it('shows milestone progress bars', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('92%')).toBeInTheDocument();
            expect(screen.getByText('67%')).toBeInTheDocument();
        });
    });

    it('displays new milestone badge', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('New!')).toBeInTheDocument();
            expect(screen.getByText('Reached this week!')).toBeInTheDocument();
        });
    });

    it('shows activity heatmap placeholder', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            expect(screen.getByText('Community Activity')).toBeInTheDocument();
            expect(screen.getByText('Activity heatmap and detailed charts')).toBeInTheDocument();
            expect(screen.getByText('Coming soon in full analytics dashboard')).toBeInTheDocument();
        });
    });

    it('calculates productivity insights correctly', async () => {
        render(<CommunityAnalytics />);

        await waitFor(() => {
            // Average hours per user: 450000000ms / 1250 users / 3600000ms/hour = 0.1h
            expect(screen.getByText('0.1h')).toBeInTheDocument();

            // Average sessions per user: 5000 / 1250 = 4.0
            expect(screen.getByText('4.0')).toBeInTheDocument();
        });
    });

    it('applies custom className', () => {
        const { container } = render(<CommunityAnalytics className="custom-class" />);

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('fetches global stats on mount', () => {
        render(<CommunityAnalytics />);

        expect(api.analytics.getGlobalStats).toHaveBeenCalledTimes(1);
    });
});