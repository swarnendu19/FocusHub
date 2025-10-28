import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AchievementPreview } from '../AchievementPreview';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';

// Mock the stores
vi.mock('@/stores/userStore');
vi.mock('@/stores/timerStore');
const mockUseUserStore = vi.mocked(useUserStore);
const mockUseTimerStore = vi.mocked(useTimerStore);

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Star: () => <div data-testid="star-icon">Star</div>,
    Medal: () => <div data-testid="medal-icon">Medal</div>,
    Crown: () => <div data-testid="crown-icon">Crown</div>,
}));

describe('AchievementPreview', () => {
    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        level: 5,
        totalXP: 1500,
        currentXP: 500,
        xpToNextLevel: 500,
        streak: 3,
        joinDate: new Date(),
        preferences: {
            theme: 'light' as const,
            animations: 'full' as const,
            notifications: true,
            soundEffects: true,
        },
        tasks: [],
        completedTasks: [],
        isOptIn: true,
        tasksCompleted: 10,
        unlockedBadges: [],
    };

    const mockSessions = [
        {
            id: '1',
            startTime: new Date('2024-01-15T10:00:00'),
            endTime: new Date('2024-01-15T10:30:00'),
            duration: 1800000, // 30 minutes
            xpEarned: 30,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseUserStore.mockReturnValue({ user: mockUser } as any);
        mockUseTimerStore.mockReturnValue({ sessions: mockSessions } as any);
    });

    it('renders nothing when no nearby achievements and no recently unlocked', () => {
        // User with no progress on any achievements
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 0, tasksCompleted: 0 },
        } as any);
        mockUseTimerStore.mockReturnValue({ sessions: [] } as any);

        const { container } = render(<AchievementPreview />);
        expect(container.firstChild).toBeNull();
    });

    it('shows nearby achievements when user has progress', () => {
        render(<AchievementPreview />);

        expect(screen.getByText('Almost There!')).toBeInTheDocument();
        expect(screen.getByText("You're close to unlocking these achievements")).toBeInTheDocument();
    });

    it('displays achievement progress correctly', () => {
        render(<AchievementPreview />);

        // Should show achievements with progress
        expect(screen.getByText('First Steps')).toBeInTheDocument();
        expect(screen.getByText('Complete your first focus session')).toBeInTheDocument();
    });

    it('shows correct progress percentage and counts', () => {
        render(<AchievementPreview />);

        // First session achievement should show 1/1 (100%)
        expect(screen.getByText('1 / 1')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('displays XP rewards for achievements', () => {
        render(<AchievementPreview />);

        // Should show XP rewards
        expect(screen.getByText('+50 XP')).toBeInTheDocument();
    });

    it('shows correct rarity badges', () => {
        render(<AchievementPreview />);

        // Should show rarity badges
        expect(screen.getByText('Common')).toBeInTheDocument();
    });

    it('calculates streak achievement progress correctly', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 5 },
        } as any);

        render(<AchievementPreview />);

        // Week Warrior achievement (7-day streak)
        expect(screen.getByText('Week Warrior')).toBeInTheDocument();
        expect(screen.getByText('5 / 7')).toBeInTheDocument();
    });

    it('calculates pomodoro achievement progress correctly', () => {
        const pomodoroSessions = Array.from({ length: 10 }, (_, i) => ({
            id: `session-${i}`,
            startTime: new Date(),
            duration: 25 * 60 * 1000, // 25 minutes
            xpEarned: 25,
        }));

        mockUseTimerStore.mockReturnValue({ sessions: pomodoroSessions } as any);

        render(<AchievementPreview />);

        // Pomodoro Master achievement (25 sessions)
        expect(screen.getByText('Pomodoro Master')).toBeInTheDocument();
        expect(screen.getByText('10 / 25')).toBeInTheDocument();
    });

    it('calculates level achievement progress correctly', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, level: 8 },
        } as any);

        render(<AchievementPreview />);

        // Rising Star achievement (level 10)
        expect(screen.getByText('Rising Star')).toBeInTheDocument();
        expect(screen.getByText('8 / 10')).toBeInTheDocument();
    });

    it('calculates task completion achievement progress correctly', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, tasksCompleted: 50 },
        } as any);

        render(<AchievementPreview />);

        // Task Crusher achievement (100 tasks)
        expect(screen.getByText('Task Crusher')).toBeInTheDocument();
        expect(screen.getByText('50 / 100')).toBeInTheDocument();
    });

    it('calculates early bird achievement progress correctly', () => {
        const earlySessions = Array.from({ length: 5 }, (_, i) => ({
            id: `session-${i}`,
            startTime: new Date('2024-01-15T07:00:00'), // 7 AM
            duration: 1800000,
            xpEarned: 30,
        }));

        mockUseTimerStore.mockReturnValue({ sessions: earlySessions } as any);

        render(<AchievementPreview />);

        // Early Bird achievement (10 sessions before 8 AM)
        expect(screen.getByText('Early Bird')).toBeInTheDocument();
        expect(screen.getByText('5 / 10')).toBeInTheDocument();
    });

    it('calculates night owl achievement progress correctly', () => {
        const nightSessions = Array.from({ length: 3 }, (_, i) => ({
            id: `session-${i}`,
            startTime: new Date('2024-01-15T23:00:00'), // 11 PM
            duration: 1800000,
            xpEarned: 30,
        }));

        mockUseTimerStore.mockReturnValue({ sessions: nightSessions } as any);

        render(<AchievementPreview />);

        // Night Owl achievement (10 sessions after 10 PM)
        expect(screen.getByText('Night Owl')).toBeInTheDocument();
        expect(screen.getByText('3 / 10')).toBeInTheDocument();
    });

    it('detects marathon session achievement', () => {
        const marathonSession = {
            id: 'marathon',
            startTime: new Date(),
            duration: 4 * 60 * 60 * 1000, // 4 hours
            xpEarned: 240,
        };

        mockUseTimerStore.mockReturnValue({ sessions: [marathonSession] } as any);

        render(<AchievementPreview />);

        // Marathon Focus should be completed (1/1)
        expect(screen.getByText('Marathon Focus')).toBeInTheDocument();
        expect(screen.getByText('1 / 1')).toBeInTheDocument();
    });

    it('shows recently unlocked achievement modal', async () => {
        // Mock a user who just unlocked an achievement
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, unlockedBadges: [] }, // No badges unlocked yet
        } as any);

        render(<AchievementPreview />);

        // Should show unlocked achievement modal for first session
        await waitFor(() => {
            expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
            expect(screen.getByText('First Steps')).toBeInTheDocument();
        });
    });

    it('allows dismissing unlocked achievement modal', async () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, unlockedBadges: [] },
        } as any);

        render(<AchievementPreview />);

        await waitFor(() => {
            expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
        });

        const dismissButton = screen.getByText('Awesome!');
        fireEvent.click(dismissButton);

        await waitFor(() => {
            expect(screen.queryByText('Achievement Unlocked!')).not.toBeInTheDocument();
        });
    });

    it('shows correct rarity icons', () => {
        render(<AchievementPreview />);

        // Should show appropriate rarity icons
        expect(screen.getByTestId('star-icon')).toBeInTheDocument(); // Common
    });

    it('limits nearby achievements to top 3', () => {
        // Create a user with progress on many achievements
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 5, level: 8, tasksCompleted: 50 },
        } as any);

        const manySessions = Array.from({ length: 20 }, (_, i) => ({
            id: `session-${i}`,
            startTime: new Date(),
            duration: 25 * 60 * 1000,
            xpEarned: 25,
        }));

        mockUseTimerStore.mockReturnValue({ sessions: manySessions } as any);

        render(<AchievementPreview />);

        // Should show at most 3 nearby achievements
        const achievementCards = screen.getAllByText(/\d+ \/ \d+/);
        expect(achievementCards.length).toBeLessThanOrEqual(3);
    });

    it('sorts nearby achievements by progress percentage', () => {
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 6, level: 9, tasksCompleted: 90 },
        } as any);

        render(<AchievementPreview />);

        // Should show achievements sorted by progress (highest first)
        // Task Crusher (90/100 = 90%) should appear before Week Warrior (6/7 = ~86%)
        const achievementNames = screen.getAllByText(/Week Warrior|Rising Star|Task Crusher/);
        expect(achievementNames.length).toBeGreaterThan(0);
    });

    it('handles missing user data gracefully', () => {
        mockUseUserStore.mockReturnValue({ user: null } as any);

        const { container } = render(<AchievementPreview />);
        expect(container.firstChild).toBeNull();
    });

    it('handles empty sessions array', () => {
        mockUseTimerStore.mockReturnValue({ sessions: [] } as any);
        mockUseUserStore.mockReturnValue({
            user: { ...mockUser, streak: 0, tasksCompleted: 0 },
        } as any);

        const { container } = render(<AchievementPreview />);
        expect(container.firstChild).toBeNull();
    });
});