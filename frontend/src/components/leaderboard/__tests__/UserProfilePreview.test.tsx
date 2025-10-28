import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UserProfilePreview } from '../UserProfilePreview';
import { api } from '@/services';
import type { LeaderboardEntry } from '@/types';

// Mock the API service
vi.mock('@/services', () => ({
    api: {
        analytics: {
            getUserStats: vi.fn(),
        },
        achievements: {
            getUserAchievements: vi.fn(),
        },
    },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock time utils
vi.mock('@/utils/timeUtils', () => ({
    formatDurationShort: vi.fn((ms) => `${Math.round(ms / 3600000)}h`),
    formatDate: vi.fn(() => 'Jan 1, 2024'),
}));

describe('UserProfilePreview', () => {
    const mockUser: LeaderboardEntry = {
        userId: 'user-1',
        username: 'TestUser',
        avatar: 'https://example.com/avatar.jpg',
        totalTime: 7200000, // 2 hours
        level: 5,
        rank: 3,
        weeklyTime: 3600000, // 1 hour
        monthlyTime: 14400000, // 4 hours
        xp: 1500,
        tasksCompleted: 25,
    };

    const defaultProps = {
        user: mockUser,
        isOpen: true,
        onClose: vi.fn(),
    };

    const mockUserStats = {
        totalTime: 7200000,
        sessionsCount: 15,
        averageSessionTime: 1800000, // 30 minutes
        xpEarned: 500,
        tasksCompleted: 25,
        streakDays: 7,
    };

    const mockAchievements = [
        {
            id: 'ach-1',
            name: 'First Steps',
            description: 'Complete your first task',
            icon: '🎯',
            rarity: 'common' as const,
            xpReward: 50,
        },
        {
            id: 'ach-2',
            name: 'Time Master',
            description: 'Track 10 hours',
            icon: '⏰',
            rarity: 'rare' as const,
            xpReward: 200,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default API responses
        (api.analytics.getUserStats as any).mockResolvedValue({
            success: true,
            data: mockUserStats,
        });

        (api.achievements.getUserAchievements as any).mockResolvedValue({
            success: true,
            data: mockAchievements,
        });
    });

    it('renders user profile when open', async () => {
        render(<UserProfilePreview {...defaultProps} />);

        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.getByText('Level 5')).toBeInTheDocument();
        expect(screen.getByText('#3')).toBeInTheDocument();
        expect(screen.getByText('1,500 XP')).toBeInTheDocument();

        // Wait for stats to load
        await waitFor(() => {
            expect(screen.getByText('This Month')).toBeInTheDocument();
        });
    });

    it('does not render when closed', () => {
        render(<UserProfilePreview {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('TestUser')).not.toBeInTheDocument();
    });

    it('displays loading state while fetching data', () => {
        render(<UserProfilePreview {...defaultProps} />);

        expect(screen.getByText('Loading profile data...')).toBeInTheDocument();
    });

    it('displays user stats after loading', async () => {
        render(<UserProfilePreview {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('15')).toBeInTheDocument(); // Sessions count
            expect(screen.getByText('500')).toBeInTheDocument(); // XP earned
            expect(screen.getByText('7')).toBeInTheDocument(); // Streak days
        });
    });

    it('displays user achievements', async () => {
        render(<UserProfilePreview {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
            expect(screen.getByText('First Steps')).toBeInTheDocument();
            expect(screen.getByText('Time Master')).toBeInTheDocument();
            expect(screen.getByText('2 total')).toBeInTheDocument();
        });
    });

    it('handles user without avatar', async () => {
        const userWithoutAvatar = { ...mockUser, avatar: undefined };
        render(<UserProfilePreview {...defaultProps} user={userWithoutAvatar} />);

        // Should show initials
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('displays correct rank styling for different positions', () => {
        // Test champion (rank 1)
        const championUser = { ...mockUser, rank: 1 };
        const { rerender } = render(
            <UserProfilePreview {...defaultProps} user={championUser} />
        );
        expect(screen.getByText('#1')).toBeInTheDocument();

        // Test runner-up (rank 2)
        const runnerUpUser = { ...mockUser, rank: 2 };
        rerender(<UserProfilePreview {...defaultProps} user={runnerUpUser} />);
        expect(screen.getByText('#2')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        (api.analytics.getUserStats as any).mockRejectedValue(new Error('API Error'));

        render(<UserProfilePreview {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load user data')).toBeInTheDocument();
        });
    });

    it('calls onClose when close button is clicked', () => {
        render(<UserProfilePreview {...defaultProps} />);

        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
        render(<UserProfilePreview {...defaultProps} />);

        const backdrop = screen.getByRole('button', { hidden: true });
        fireEvent.click(backdrop);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onViewFullProfile when provided', async () => {
        const onViewFullProfile = vi.fn();
        render(
            <UserProfilePreview
                {...defaultProps}
                onViewFullProfile={onViewFullProfile}
            />
        );

        await waitFor(() => {
            const viewProfileButton = screen.getByText('View Full Profile');
            fireEvent.click(viewProfileButton);
            expect(onViewFullProfile).toHaveBeenCalledWith('user-1');
        });
    });

    it('does not show view full profile button when callback not provided', async () => {
        render(<UserProfilePreview {...defaultProps} />);

        await waitFor(() => {
            expect(screen.queryByText('View Full Profile')).not.toBeInTheDocument();
        });
    });

    it('displays achievement rarity colors correctly', async () => {
        render(<UserProfilePreview {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('common')).toBeInTheDocument();
            expect(screen.getByText('rare')).toBeInTheDocument();
        });
    });

    it('prevents event propagation when clicking modal content', () => {
        const onClose = vi.fn();
        render(<UserProfilePreview {...defaultProps} onClose={onClose} />);

        const modalContent = screen.getByText('TestUser').closest('div');
        fireEvent.click(modalContent!);

        // Should not close when clicking modal content
        expect(onClose).not.toHaveBeenCalled();
    });

    it('fetches data when modal opens', () => {
        const { rerender } = render(
            <UserProfilePreview {...defaultProps} isOpen={false} />
        );

        expect(api.analytics.getUserStats).not.toHaveBeenCalled();

        rerender(<UserProfilePreview {...defaultProps} isOpen={true} />);

        expect(api.analytics.getUserStats).toHaveBeenCalledWith('user-1', {
            timeframe: 'monthly',
        });
        expect(api.achievements.getUserAchievements).toHaveBeenCalledWith('user-1');
    });
});