import { render, screen } from '@testing-library/react';
import { Home } from '../Home';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';

// Mock the stores and components
vi.mock('@/stores/userStore');
vi.mock('@/stores/timerStore');
vi.mock('../DailyProgress', () => ({
    DailyProgress: () => <div data-testid="daily-progress">Daily Progress Component</div>
}));
vi.mock('../QuickStats', () => ({
    QuickStats: () => <div data-testid="quick-stats">Quick Stats Component</div>
}));
vi.mock('../DailyQuests', () => ({
    DailyQuests: () => <div data-testid="daily-quests">Daily Quests Component</div>
}));

const mockUseUserStore = useUserStore as any;
const mockUseTimerStore = useTimerStore as any;

describe('Home', () => {
    beforeEach(() => {
        // Mock current time to control greeting
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-01T10:00:00')); // 10 AM

        mockUseUserStore.mockReturnValue({
            user: {
                id: '1',
                username: 'TestUser',
                level: 5,
            },
        } as any);

        mockUseTimerStore.mockReturnValue({
            dailyTime: 120,
            getDailyProgress: vi.fn(() => 50),
        } as any);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('renders welcome message with username', () => {
        render(<Home />);

        expect(screen.getByText('Good morning, TestUser! 👋')).toBeInTheDocument();
    });

    it('renders welcome message without username when user is null', () => {
        mockUseUserStore.mockReturnValue({
            user: null,
        } as any);

        render(<Home />);

        expect(screen.getByText('Good morning! 👋')).toBeInTheDocument();
    });

    it('shows correct greeting based on time of day', () => {
        // Test afternoon greeting
        vi.setSystemTime(new Date('2024-01-01T14:00:00')); // 2 PM

        const { rerender } = render(<Home />);
        expect(screen.getByText('Good afternoon, TestUser! 👋')).toBeInTheDocument();

        // Test evening greeting
        vi.setSystemTime(new Date('2024-01-01T19:00:00')); // 7 PM

        rerender(<Home />);
        expect(screen.getByText('Good evening, TestUser! 👋')).toBeInTheDocument();
    });

    it('renders motivational subtitle', () => {
        render(<Home />);

        expect(screen.getByText('Ready to level up your productivity? Let\'s make today count!')).toBeInTheDocument();
    });

    it('renders all dashboard components', () => {
        render(<Home />);

        expect(screen.getByTestId('daily-progress')).toBeInTheDocument();
        expect(screen.getByTestId('quick-stats')).toBeInTheDocument();
        expect(screen.getByTestId('daily-quests')).toBeInTheDocument();
    });

    it('applies correct layout structure', () => {
        const { container } = render(<Home />);

        // Check for main container with proper spacing
        const mainContainer = container.querySelector('.space-y-6');
        expect(mainContainer).toBeInTheDocument();
        expect(mainContainer).toHaveClass('p-6');
    });

    it('has proper motion animations setup', () => {
        const { container } = render(<Home />);

        // Check that motion divs are present (they have specific attributes)
        const motionElements = container.querySelectorAll('[style*="transform"]');
        expect(motionElements.length).toBeGreaterThan(0);
    });

    it('handles missing user data gracefully', () => {
        mockUseUserStore.mockReturnValue({
            user: null,
        } as any);

        render(<Home />);

        // Should still render without crashing
        expect(screen.getByText('Good morning! 👋')).toBeInTheDocument();
        expect(screen.getByTestId('daily-progress')).toBeInTheDocument();
    });

    it('renders header section with proper styling', () => {
        const { container } = render(<Home />);

        const header = container.querySelector('h1');
        expect(header).toHaveClass('text-3xl');
        expect(header).toHaveClass('font-bold');
        expect(header).toHaveClass('text-gray-900');
    });
});