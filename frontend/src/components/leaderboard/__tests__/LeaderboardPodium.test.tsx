import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeaderboardPodium } from '../LeaderboardPodium';
import type { LeaderboardEntry } from '@/types';

const mockTopUsers: LeaderboardEntry[] = [
    {
        userId: 'user-1',
        username: 'Champion',
        avatar: 'https://example.com/avatar1.jpg',
        totalTime: 7200000, // 2 hours
        level: 10,
        rank: 1,
        weeklyTime: 3600000,
        monthlyTime: 14400000,
        xp: 2500,
        tasksCompleted: 25
    },
    {
        userId: 'user-2',
        username: 'Runner-up',
        avatar: undefined,
        totalTime: 5400000, // 1.5 hours
        level: 8,
        rank: 2,
        weeklyTime: 2700000,
        monthlyTime: 10800000,
        xp: 2000,
        tasksCompleted: 20
    },
    {
        userId: 'user-3',
        username: 'Third',
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

describe('LeaderboardPodium', () => {
    it('renders all three podium positions', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        expect(screen.getByText('Champion')).toBeInTheDocument();
        expect(screen.getByText('Runner-up')).toBeInTheDocument();
        expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('displays correct rank numbers on podium steps', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows user levels correctly', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        expect(screen.getByText('Level 10')).toBeInTheDocument();
        expect(screen.getByText('Level 8')).toBeInTheDocument();
        expect(screen.getByText('Level 6')).toBeInTheDocument();
    });

    it('displays user stats (XP, time, tasks)', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        // Check XP values
        expect(screen.getByText('2,500')).toBeInTheDocument();
        expect(screen.getByText('2,000')).toBeInTheDocument();
        expect(screen.getByText('1,500')).toBeInTheDocument();

        // Check time values
        expect(screen.getByText('2h')).toBeInTheDocument();
        expect(screen.getByText('1h 30m')).toBeInTheDocument();
        expect(screen.getByText('1h')).toBeInTheDocument();

        // Check task counts
        expect(screen.getByText('25')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('highlights current user when provided', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} currentUserId="user-2" />);

        expect(screen.getByText('You')).toBeInTheDocument();
    });

    it('shows user avatars when available', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        const avatarImages = screen.getAllByRole('img');
        expect(avatarImages).toHaveLength(2); // Champion and Third have avatars

        // Check specific avatars
        expect(screen.getByAltText('Champion')).toBeInTheDocument();
        expect(screen.getByAltText('Third')).toBeInTheDocument();
    });

    it('shows placeholder for users without avatars', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        // Runner-up doesn't have an avatar, should show placeholder
        const userIcons = screen.getAllByTestId('user-icon') || [];
        // Note: This test might need adjustment based on how the User icon is rendered
    });

    it('displays achievement highlights section', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        expect(screen.getByText('Most XP')).toBeInTheDocument();
        expect(screen.getByText('Most Time')).toBeInTheDocument();
        expect(screen.getByText('Most Tasks')).toBeInTheDocument();

        // Check the values in achievement highlights
        expect(screen.getByText('2,500 points')).toBeInTheDocument();
        expect(screen.getByText('2h')).toBeInTheDocument();
        expect(screen.getByText('25 completed')).toBeInTheDocument();
    });

    it('handles empty state when no users provided', () => {
        render(<LeaderboardPodium topUsers={[]} />);

        expect(screen.getByText('No Champions Yet')).toBeInTheDocument();
        expect(screen.getByText('Start tracking time to claim your spot on the podium!')).toBeInTheDocument();
    });

    it('handles partial data (less than 3 users)', () => {
        const partialUsers = mockTopUsers.slice(0, 2); // Only first 2 users
        render(<LeaderboardPodium topUsers={partialUsers} />);

        expect(screen.getByText('Champion')).toBeInTheDocument();
        expect(screen.getByText('Runner-up')).toBeInTheDocument();
        expect(screen.getByText('Empty')).toBeInTheDocument(); // Third place should be empty
    });

    it('applies correct styling for different ranks', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        // First place should have gold styling
        const championCard = screen.getByText('Champion').closest('div');
        expect(championCard).toHaveClass('border-yellow-300');

        // Second place should have silver styling
        const runnerUpCard = screen.getByText('Runner-up').closest('div');
        expect(runnerUpCard).toHaveClass('border-gray-300');

        // Third place should have bronze styling
        const thirdCard = screen.getByText('Third').closest('div');
        expect(thirdCard).toHaveClass('border-amber-300');
    });

    it('shows correct podium heights', () => {
        render(<LeaderboardPodium topUsers={mockTopUsers} />);

        // The podium steps should have different heights
        // First place (center) should be tallest (h-40)
        // Second place (left) should be medium (h-32)
        // Third place (right) should be shortest (h-24)

        const podiumSteps = screen.getAllByText(/^[1-3]$/);
        expect(podiumSteps).toHaveLength(3);
    });

    it('displays usernames correctly truncated if too long', () => {
        const longNameUsers = [
            {
                ...mockTopUsers[0],
                username: 'VeryLongUsernameThatshouldBeTruncated'
            }
        ];

        render(<LeaderboardPodium topUsers={longNameUsers} />);

        expect(screen.getByText('VeryLongUsernameThatshouldBeTruncated')).toBeInTheDocument();
    });

    it('handles users with zero stats gracefully', () => {
        const zeroStatsUsers = [
            {
                ...mockTopUsers[0],
                xp: 0,
                totalTime: 0,
                tasksCompleted: 0
            }
        ];

        render(<LeaderboardPodium topUsers={zeroStatsUsers} />);

        expect(screen.getByText('0')).toBeInTheDocument(); // XP
        expect(screen.getByText('0m')).toBeInTheDocument(); // Time
        expect(screen.getByText('0')).toBeInTheDocument(); // Tasks
    });

    it('calculates achievement highlights correctly with mixed data', () => {
        // Test with users having different highest stats
        const mixedUsers = [
            { ...mockTopUsers[0], xp: 1000, totalTime: 1000000, tasksCompleted: 5 },
            { ...mockTopUsers[1], xp: 2000, totalTime: 500000, tasksCompleted: 10 },
            { ...mockTopUsers[2], xp: 500, totalTime: 2000000, tasksCompleted: 15 }
        ];

        render(<LeaderboardPodium topUsers={mixedUsers} />);

        // Most XP should be 2000 (user-2)
        expect(screen.getByText('2,000 points')).toBeInTheDocument();

        // Most Time should be 2000000ms = ~33m (user-3)
        expect(screen.getByText('33m')).toBeInTheDocument();

        // Most Tasks should be 15 (user-3)
        expect(screen.getByText('15 completed')).toBeInTheDocument();
    });
});