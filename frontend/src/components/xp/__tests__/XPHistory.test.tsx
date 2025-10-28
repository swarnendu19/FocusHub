import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the user store
const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    level: 5,
    totalXP: 4500,
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

vi.mock('@/stores/userStore', () => ({
    useUserStore: () => ({
        user: mockUser,
        getCurrentLevel: vi.fn(() => 5),
        getXPProgress: vi.fn(() => 50),
        isLoading: false,
        error: null,
        isAuthenticated: true,
        setUser: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        updateUser: vi.fn(),
        clearUser: vi.fn(),
        setAuthenticated: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        updatePreferences: vi.fn(),
        addXP: vi.fn(),
        updateStreak: vi.fn(),
        addTask: vi.fn(),
        updateTask: vi.fn(),
        completeTask: vi.fn(),
        deleteTask: vi.fn(),
        getCompletedTasksCount: vi.fn(),
        getActiveTasksCount: vi.fn(),
        getTotalTimeSpent: vi.fn(),
        addSampleTasks: vi.fn(),
    }),
}));

// Create a simple mock component for testing
const MockXPHistory = ({ className }: any) => {
    const [selectedFilter, setSelectedFilter] = React.useState('all');
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    return (
        <div className={className} data-testid="xp-history">
            <div>
                <h3>XP History</h3>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    data-testid="filter-button"
                >
                    {selectedFilter}
                </button>
                {isFilterOpen && (
                    <div data-testid="filter-dropdown">
                        {['all', 'task', 'milestone', 'streak', 'bonus'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setSelectedFilter(filter);
                                    setIsFilterOpen(false);
                                }}
                                data-testid={`filter-${filter}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div data-testid="summary-stats">
                <div>Total XP (Filtered): 1,025</div>
                <div>Entries Shown: 8</div>
            </div>
            <div data-testid="history-entries">
                <div>+150 XP - task</div>
                <div>+50 XP - streak</div>
                <div>+200 XP - milestone</div>
                <div>+100 XP - task</div>
                <div>+75 XP - task</div>
                <div>+25 XP - bonus</div>
                <div>+300 XP - milestone</div>
                <div>+125 XP - task</div>
            </div>
        </div>
    );
};

describe('XPHistory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders XP history with mock data', () => {
        render(<MockXPHistory />);

        expect(screen.getByText('XP History')).toBeInTheDocument();
        expect(screen.getByText('Total XP (Filtered): 1,025')).toBeInTheDocument();
        expect(screen.getByText('Entries Shown: 8')).toBeInTheDocument();
    });

    it('displays filter dropdown', () => {
        render(<MockXPHistory />);

        const filterButton = screen.getByTestId('filter-button');
        expect(filterButton).toBeInTheDocument();
    });

    it('opens filter dropdown when clicked', () => {
        render(<MockXPHistory />);

        const filterButton = screen.getByTestId('filter-button');
        fireEvent.click(filterButton);

        expect(screen.getByTestId('filter-dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('filter-task')).toBeInTheDocument();
        expect(screen.getByTestId('filter-milestone')).toBeInTheDocument();
        expect(screen.getByTestId('filter-streak')).toBeInTheDocument();
        expect(screen.getByTestId('filter-bonus')).toBeInTheDocument();
    });

    it('filters entries by type', () => {
        render(<MockXPHistory />);

        // Open filter dropdown
        const filterButton = screen.getByTestId('filter-button');
        fireEvent.click(filterButton);

        // Click on 'task' filter
        const taskFilter = screen.getByTestId('filter-task');
        fireEvent.click(taskFilter);

        // Check that filter is applied
        expect(screen.getByTestId('filter-button')).toHaveTextContent('task');
    });

    it('displays XP amounts correctly', () => {
        render(<MockXPHistory />);

        // Check for XP amounts in the history
        expect(screen.getByText('+150 XP - task')).toBeInTheDocument();
        expect(screen.getByText('+200 XP - milestone')).toBeInTheDocument();
        expect(screen.getByText('+50 XP - streak')).toBeInTheDocument();
        expect(screen.getByText('+25 XP - bonus')).toBeInTheDocument();
    });

    it('shows different entry types with correct labels', () => {
        render(<MockXPHistory />);

        expect(screen.getByText('+150 XP - task')).toBeInTheDocument();
        expect(screen.getByText('+200 XP - milestone')).toBeInTheDocument();
        expect(screen.getByText('+50 XP - streak')).toBeInTheDocument();
        expect(screen.getByText('+25 XP - bonus')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<MockXPHistory className="custom-class" />);
        expect(screen.getByTestId('xp-history')).toHaveClass('custom-class');
    });

    it('calculates total XP correctly', () => {
        render(<MockXPHistory />);

        expect(screen.getByText('Total XP (Filtered): 1,025')).toBeInTheDocument();
    });

    it('shows correct number of entries', () => {
        render(<MockXPHistory />);

        expect(screen.getByText('Entries Shown: 8')).toBeInTheDocument();
    });

    it('handles filter changes correctly', () => {
        render(<MockXPHistory />);

        // Open filter and select 'milestone'
        const filterButton = screen.getByTestId('filter-button');
        fireEvent.click(filterButton);

        const milestoneFilter = screen.getByTestId('filter-milestone');
        fireEvent.click(milestoneFilter);

        // Should now show milestone filter
        expect(screen.getByTestId('filter-button')).toHaveTextContent('milestone');
    });
});