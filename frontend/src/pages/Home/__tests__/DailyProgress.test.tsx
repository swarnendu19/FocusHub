import { render, screen } from '@testing-library/react';
import { DailyProgress } from '../DailyProgress';
import { useTimerStore } from '@/stores/timerStore';
import { useUserStore } from '@/stores/userStore';

// Mock the stores
vi.mock('@/stores/timerStore');
vi.mock('@/stores/userStore');

const mockUseTimerStore = useTimerStore as any;
const mockUseUserStore = useUserStore as any;

describe('DailyProgress', () => {
    beforeEach(() => {
        mockUseTimerStore.mockReturnValue({
            getDailyProgress: vi.fn(() => 65),
            dailyTime: 120, // 2 hours
            dailyGoal: 480, // 8 hours
        } as any);

        mockUseUserStore.mockReturnValue({
            user: {
                id: '1',
                username: 'testuser',
                level: 5,
                currentXP: 250,
                xpToNextLevel: 750,
                streak: 7,
            },
        } as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders daily progress section', () => {
        render(<DailyProgress />);

        expect(screen.getByText('Daily Progress')).toBeInTheDocument();
        expect(screen.getByText('Daily Goal')).toBeInTheDocument();
        expect(screen.getByText('Current Streak')).toBeInTheDocument();
        expect(screen.getByText('Level Progress')).toBeInTheDocument();
    });

    it('displays correct daily time worked', () => {
        render(<DailyProgress />);

        expect(screen.getByText('2h 0m')).toBeInTheDocument();
        expect(screen.getByText('8h goal')).toBeInTheDocument();
    });

    it('displays current streak correctly', () => {
        render(<DailyProgress />);

        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByText('days')).toBeInTheDocument();
    });

    it('displays level information correctly', () => {
        render(<DailyProgress />);

        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('750 XP to next')).toBeInTheDocument();
    });

    it('renders progress bars for each metric', () => {
        render(<DailyProgress />);

        // Check that progress bars are rendered (they have specific classes)
        const progressBars = document.querySelectorAll('[class*="rounded-full"]');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('handles missing user data gracefully', () => {
        mockUseUserStore.mockReturnValue({
            user: null,
        } as any);

        render(<DailyProgress />);

        expect(screen.getByText('Daily Progress')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // Default level
        expect(screen.getByText('0')).toBeInTheDocument(); // Default streak
    });

    it('applies correct grid layout classes', () => {
        const { container } = render(<DailyProgress />);

        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toHaveClass('grid-cols-1');
        expect(gridContainer).toHaveClass('md:grid-cols-3');
    });
});