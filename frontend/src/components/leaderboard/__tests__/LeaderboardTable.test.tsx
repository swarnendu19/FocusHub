import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeaderboardTable } from '../LeaderboardTable';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { useUserStore } from '@/stores/userStore';
import { api } from '@/services';
import type { LeaderboardEntry } from '@/types';

// Mock the stores and API
vi.mock('@/stores/leaderboardStore');
vi.mock('@/stores/userStore');
vi.mock('@/services');

const mockLeaderboardEntries: LeaderboardEntry[] = [
    {
        userId: 'user-1',
        username: 'TopPlayer',
        avatar: 'https://example.com/avatar1.jpg',
        totalTime: 7200000, // 2 hours
        level: 10,
        rank: 1,
        previousRank: 2,
        weeklyTime: 3600000,
        monthlyTime: 14400000,
        xp: 2500,
        tasksCompleted: 25
    },
    {
        userId: 'user-2',
        username: 'SecondPlace',
        avatar: undefined,
        totalTime: 5400000, // 1.5 hours
        level: 8,
        rank: 2,
        previousRank: 1,
        weeklyTime: 2700000,
        monthlyTime: 10800000,
        xp: 2000,
        tasksCompleted: 20
    },
    {
        userId: 'user-3',
        username: 'ThirdPlace',
        avatar: 'https://example.com/avatar3.jpg',
        totalTime: 3600000, // 1 hour
        level: 6,
        rank: 3,
        weeklyTime: 1800000,
        monthlyTime: 7200000,
        xp: 1500,
        tasksCompleted: 15
    }
];

const mockUser = {
    id: 'user-2',
    username: 'SecondPlace',
    email: 'second@example.com',
    level: 8,
    totalXP: 2000,
    tasksCompleted: 20,
    avatar: undefined
};

const mockLeaderboardStore = {
    entries: mockLeaderboardEntries,
    currentUserEntry: mockLeaderboardEntries[1],
    isLoading: false,
    error: null,
    currentPage: 1,
    hasMore: false,
    setEntries: vi.fn(),
    setCurrentUserEntry: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    setCurrentPage: vi.fn(),
    setHasMore: vi.fn(),
    getUserRank: vi.fn((userId: string) => {
        const entry = mockLeaderboardEntries.find(e => e.userId === userId);
        return entry ? entry.rank : null;
    }),
    getRankChange: vi.fn((userId: string) => {
        const entry = mockLeaderboardEntries.find(e => e.userId === userId);
        if (!entry || entry.previousRank === undefined) return null;
        return entry.previousRank - entry.rank;
    })
};

const mockUserStore = {
    user: mockUser
};

const mockApi = {
    leaderboard: {
        get: vi.fn(),
        getUserRank: vi.fn()
    }
};

describe('LeaderboardTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useLeaderboardStore as any).mockReturnValue(mockLeaderboardStore);
        (useUserStore as any).mockReturnValue(mockUserStore);
        (api as any).leaderboard = mockApi.leaderboard;

        // Mock successful API response
        mockApi.leaderboard.get.mockResolvedValue({
            success: true,
            data: {
                data: mockLeaderboardEntries,
                total: 3,
                page: 1,
                limit: 50,
                hasMore: false
            }
        });
    });

    it('renders leaderboard entries correctly', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            expect(screen.getByText('TopPlayer')).toBeInTheDocument();
            expect(screen.getByText('SecondPlace')).toBeInTheDocument();
            expect(screen.getByText('ThirdPlace')).toBeInTheDocument();
        });
    });

    it('displays correct rank icons for top 3', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            // Crown for 1st place
            expect(screen.getByText('TopPlayer').closest('.space-y-3')).toBeInTheDocument();

            // Check for rank numbers
            expect(screen.getByText('#1')).toBeInTheDocument();
            expect(screen.getByText('#2')).toBeInTheDocument();
            expect(screen.getByText('#3')).toBeInTheDocument();
        });
    });

    it('shows rank change indicators', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            // TopPlayer moved up from rank 2 to 1 (+1)
            expect(screen.getByText('+1')).toBeInTheDocument();

            // SecondPlace moved down from rank 1 to 2 (-1)
            expect(screen.getByText('-1')).toBeInTheDocument();
        });
    });

    it('highlights current user entry', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            const userEntry = screen.getByText('SecondPlace').closest('div');
            expect(userEntry).toHaveClass('border-blue-300');
            expect(screen.getByText('You')).toBeInTheDocument();
        });
    });

    it('displays user stats correctly', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            expect(screen.getByText('2,500')).toBeInTheDocument(); // TopPlayer XP
            expect(screen.getByText('2h')).toBeInTheDocument(); // TopPlayer time
            expect(screen.getByText('25')).toBeInTheDocument(); // TopPlayer tasks
        });
    });

    it('shows progress bars for top 10 users', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            const progressBars = screen.getAllByRole('progressbar');
            expect(progressBars.length).toBeGreaterThan(0);
        });
    });

    it('handles loading state', () => {
        const loadingStore = { ...mockLeaderboardStore, isLoading: true };
        (useLeaderboardStore as any).mockReturnValue(loadingStore);

        render(<LeaderboardTable />);

        // Should show loading state (handled by the component's internal loading)
        expect(mockLeaderboardStore.setLoading).toHaveBeenCalled();
    });

    it('handles error state', () => {
        const errorStore = {
            ...mockLeaderboardStore,
            error: 'Failed to load leaderboard',
            entries: []
        };
        (useLeaderboardStore as any).mockReturnValue(errorStore);

        render(<LeaderboardTable />);

        expect(screen.getByText('Failed to Load Leaderboard')).toBeInTheDocument();
        expect(screen.getByText('Failed to load leaderboard')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('shows empty state when no entries', () => {
        const emptyStore = {
            ...mockLeaderboardStore,
            entries: [],
            isLoading: false
        };
        (useLeaderboardStore as any).mockReturnValue(emptyStore);

        render(<LeaderboardTable />);

        expect(screen.getByText('No Rankings Yet')).toBeInTheDocument();
        expect(screen.getByText('Be the first to start tracking time and climb the leaderboard!')).toBeInTheDocument();
    });

    it('displays current user position when not in top entries', async () => {
        const userNotInTopStore = {
            ...mockLeaderboardStore,
            currentUserEntry: {
                ...mockLeaderboardEntries[1],
                rank: 15 // User is ranked 15th
            }
        };
        (useLeaderboardStore as any).mockReturnValue(userNotInTopStore);

        render(<LeaderboardTable />);

        await waitFor(() => {
            expect(screen.getByText('Your Position')).toBeInTheDocument();
            expect(screen.getByText('#15')).toBeInTheDocument();
        });
    });

    it('handles load more functionality', async () => {
        const hasMoreStore = { ...mockLeaderboardStore, hasMore: true };
        (useLeaderboardStore as any).mockReturnValue(hasMoreStore);

        render(<LeaderboardTable showPagination={true} />);

        await waitFor(() => {
            const loadMoreButton = screen.getByText('Load More');
            expect(loadMoreButton).toBeInTheDocument();

            fireEvent.click(loadMoreButton);
            expect(mockApi.leaderboard.get).toHaveBeenCalledWith({
                limit: 50,
                offset: 50,
                timeframe: 'all-time'
            });
        });
    });

    it('fetches data with correct timeframe', async () => {
        render(<LeaderboardTable timeframe="weekly" />);

        await waitFor(() => {
            expect(mockApi.leaderboard.get).toHaveBeenCalledWith({
                limit: 50,
                offset: 0,
                timeframe: 'weekly'
            });
        });
    });

    it('handles API error gracefully', async () => {
        mockApi.leaderboard.get.mockRejectedValue(new Error('API Error'));

        render(<LeaderboardTable />);

        await waitFor(() => {
            expect(mockLeaderboardStore.setError).toHaveBeenCalledWith(
                'Failed to load leaderboard. Please try again.'
            );
        });
    });

    it('shows user avatars when available', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            const avatarImages = screen.getAllByRole('img');
            expect(avatarImages.length).toBeGreaterThan(0);

            // Check for placeholder when no avatar
            const userIcons = screen.getAllByTestId('user-icon') || [];
            expect(avatarImages.length + userIcons.length).toBeGreaterThan(0);
        });
    });

    it('applies correct styling for top 3 users', async () => {
        render(<LeaderboardTable />);

        await waitFor(() => {
            const topPlayerCard = screen.getByText('TopPlayer').closest('div');
            expect(topPlayerCard).toHaveClass('border-yellow-300');

            const secondPlaceCard = screen.getByText('SecondPlace').closest('div');
            expect(secondPlaceCard).toHaveClass('border-blue-300'); // Current user styling
        });
    });

    it('handles refresh functionality', async () => {
        const errorStore = {
            ...mockLeaderboardStore,
            error: 'Network error'
        };
        (useLeaderboardStore as any).mockReturnValue(errorStore);

        render(<LeaderboardTable />);

        const refreshButton = screen.getByText('Try Again');
        fireEvent.click(refreshButton);

        expect(mockApi.leaderboard.get).toHaveBeenCalled();
    });
});