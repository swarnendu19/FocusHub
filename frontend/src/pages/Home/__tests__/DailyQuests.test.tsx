import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DailyQuests } from '../DailyQuests';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';

// Mock the stores
vi.mock('@/stores/timerStore');
vi.mock('@/stores/userStore');

const mockUseTimerStore = useTimerStore as any;
const mockUseUserStore = useUserStore as any;

describe('DailyQuests', () => {
    const mockAddXP = vi.fn();

    beforeEach(() => {
        mockUseTimerStore.mockReturnValue({
            dailyTime: 45, // 45 minutes
            sessions: [
                {
                    id: '1',
                    startTime: new Date(),
                    duration: 30 * 60 * 1000, // 30 minutes
                },
                {
                    id: '2',
                    startTime: new Date(),
                    duration: 15 * 60 * 1000, // 15 minutes
                },
            ],
            getDailyProgress: vi.fn(() => 50),
        } as any);

        mockUseUserStore.mockReturnValue({
            user: {
                id: '1',
                username: 'testuser',
            },
            addXP: mockAddXP,
        } as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders daily quests section', () => {
        render(<DailyQuests />);

        expect(screen.getByText('Daily Quests')).toBeInTheDocument();
        expect(screen.getByText('Active Quests')).toBeInTheDocument();
    });

    it('displays quest cards with correct information', () => {
        render(<DailyQuests />);

        expect(screen.getByText('Focus Master')).toBeInTheDocument();
        expect(screen.getByText('Complete 1 hour of focused work')).toBeInTheDocument();
        expect(screen.getByText('Session Streak')).toBeInTheDocument();
        expect(screen.getByText('Complete 3 focus sessions today')).toBeInTheDocument();
    });

    it('shows correct progress for quests', () => {
        render(<DailyQuests />);

        // Focus Master quest: 45/60 minutes
        expect(screen.getByText('45/60')).toBeInTheDocument();

        // Session Streak quest: 2/3 sessions
        expect(screen.getByText('2/3')).toBeInTheDocument();
    });

    it('displays XP rewards correctly', () => {
        render(<DailyQuests />);

        expect(screen.getByText('+50 XP')).toBeInTheDocument();
        expect(screen.getByText('+75 XP')).toBeInTheDocument();
        expect(screen.getByText('+100 XP')).toBeInTheDocument();
    });

    it('shows quest rarity badges', () => {
        render(<DailyQuests />);

        expect(screen.getAllByText('common')).toHaveLength(2); // Early Bird and Focus Master are both common
        expect(screen.getAllByText('rare')).toHaveLength(2); // Session Streak and Power Session are both rare
        expect(screen.getByText('epic')).toBeInTheDocument(); // Goal Crusher is epic
    });

    it('handles quest completion', async () => {
        // Mock a completed quest scenario
        mockUseTimerStore.mockReturnValue({
            dailyTime: 60, // 1 hour - completes Focus Master quest
            sessions: [
                {
                    id: '1',
                    startTime: new Date(),
                    duration: 60 * 60 * 1000, // 60 minutes
                },
            ],
            getDailyProgress: vi.fn(() => 50),
        } as any);

        render(<DailyQuests />);

        // Find and click a completable quest
        const questCard = screen.getByText('Focus Master').closest('[role="button"]');
        if (questCard) {
            fireEvent.click(questCard);
        }

        // Should show completed section after completion
        await waitFor(() => {
            expect(screen.getByText(/Completed Today/)).toBeInTheDocument();
        });
    });

    it('displays total XP progress correctly', () => {
        render(<DailyQuests />);

        // Should show XP earned vs total available
        expect(screen.getByText(/\/310 XP/)).toBeInTheDocument(); // Total XP from all quests
        expect(screen.getByText(/\/5 Complete/)).toBeInTheDocument(); // Total quest count
    });

    it('shows early bird quest based on session time', () => {
        // Mock early morning session
        const earlyMorningSession = {
            id: '1',
            startTime: new Date('2024-01-01T08:00:00'), // 8 AM
            duration: 30 * 60 * 1000,
        };

        mockUseTimerStore.mockReturnValue({
            dailyTime: 30,
            sessions: [earlyMorningSession],
            getDailyProgress: vi.fn(() => 25),
        } as any);

        render(<DailyQuests />);

        expect(screen.getByText('Early Bird')).toBeInTheDocument();
        expect(screen.getByText('Start your first session before 9 AM')).toBeInTheDocument();
    });

    it('shows power session quest for long sessions', () => {
        // Mock a long session
        const longSession = {
            id: '1',
            startTime: new Date(),
            duration: 50 * 60 * 1000, // 50 minutes
        };

        mockUseTimerStore.mockReturnValue({
            dailyTime: 50,
            sessions: [longSession],
            getDailyProgress: vi.fn(() => 40),
        } as any);

        render(<DailyQuests />);

        expect(screen.getByText('Power Session')).toBeInTheDocument();
        expect(screen.getByText('Complete a 45+ minute session')).toBeInTheDocument();
    });

    it('handles empty quest state', () => {
        mockUseTimerStore.mockReturnValue({
            dailyTime: 0,
            sessions: [],
            getDailyProgress: vi.fn(() => 0),
        } as any);

        // Mock component to return no quests
        const { rerender } = render(<DailyQuests />);

        // Force re-render to trigger empty state
        rerender(<DailyQuests />);

        // Should still show the quests section
        expect(screen.getByText('Daily Quests')).toBeInTheDocument();
    });
});