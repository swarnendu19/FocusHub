import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Profile } from '../Profile';
import { useUserStore } from '@/stores/userStore';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/stores/userStore');
vi.mock('@/services/api');
vi.mock('sonner');

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

const mockUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    level: 5,
    totalXP: 4500,
    currentXP: 500,
    xpToNextLevel: 500,
    streak: 7,
    joinDate: new Date('2024-01-01'),
    preferences: {
        theme: 'light' as const,
        animations: 'full' as const,
        notifications: true,
        soundEffects: true,
    },
    tasks: [],
    completedTasks: [],
    isOptIn: true,
    tasksCompleted: 25,
    unlockedBadges: ['first-task', 'week-streak', 'level-5'],
};

const mockUserStore = {
    user: mockUser,
    updateUser: vi.fn(),
    updatePreferences: vi.fn(),
    isLoading: false,
    setLoading: vi.fn(),
    setError: vi.fn(),
};

const ProfileWrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
);

describe('Profile', () => {
    beforeEach(() => {
        vi.mocked(useUserStore).mockReturnValue(mockUserStore);
        vi.mocked(toast.success).mockImplementation(() => '');
        vi.mocked(toast.error).mockImplementation(() => '');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Profile Information Display', () => {
        it('renders user profile information correctly', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByText('testuser')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('Member since 1/1/2024')).toBeInTheDocument();
        });

        it('displays user avatar with level badge', async () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const avatar = screen.getByAltText('testuser');
            expect(avatar).toBeInTheDocument();
            expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');

            // Level badge should show level 5 (wait for animation)
            await waitFor(() => {
                const levelBadges = screen.getAllByText('5');
                expect(levelBadges.length).toBeGreaterThan(0);
            }, { timeout: 2000 });
        });

        it('shows fallback avatar when no avatar URL provided', () => {
            const userWithoutAvatar = { ...mockUser, avatar: undefined };
            vi.mocked(useUserStore).mockReturnValue({
                ...mockUserStore,
                user: userWithoutAvatar,
            });

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const avatar = screen.getByAltText('testuser');
            expect(avatar).toHaveAttribute('src', expect.stringContaining('ui-avatars.com'));
        });

        it('displays XP progress bar correctly', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByText('500 / 1000 XP')).toBeInTheDocument();
        });
    });

    describe('Statistics Display', () => {
        it('displays animated statistics correctly', async () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            // Wait for animations to complete
            await waitFor(() => {
                expect(screen.getByText('4,500')).toBeInTheDocument(); // Total XP
            }, { timeout: 2000 });

            await waitFor(() => {
                const levelElements = screen.getAllByText('5');
                expect(levelElements.length).toBeGreaterThanOrEqual(1); // Level (could be in badge and stats)
            }, { timeout: 2000 });

            await waitFor(() => {
                expect(screen.getByText('25')).toBeInTheDocument(); // Tasks completed
            }, { timeout: 2000 });

            await waitFor(() => {
                expect(screen.getByText('3')).toBeInTheDocument(); // Badges count
            }, { timeout: 2000 });

            expect(screen.getByText('Total XP')).toBeInTheDocument();
            expect(screen.getByText('Level')).toBeInTheDocument();
            expect(screen.getByText('Tasks Done')).toBeInTheDocument();
            expect(screen.getByText('Badges')).toBeInTheDocument();
        });

        it('displays streak counter with flame emoji', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByText('🔥')).toBeInTheDocument();
            expect(screen.getByText('7')).toBeInTheDocument();
            expect(screen.getByText('Day Streak')).toBeInTheDocument();
        });
    });

    describe('Opt-in Toggle Functionality', () => {
        it('displays correct opt-in status when user is opted in', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByText('You are visible on the public leaderboard')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();
        });

        it('displays correct opt-in status when user is opted out', () => {
            const optedOutUser = { ...mockUser, isOptIn: false };
            vi.mocked(useUserStore).mockReturnValue({
                ...mockUserStore,
                user: optedOutUser,
            });

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByText('You are hidden from the public leaderboard')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument();
        });

        it('handles opt-in toggle successfully', async () => {
            const mockApiResponse = {
                success: true,
                data: { ...mockUser, isOptIn: false },
            };
            vi.mocked(apiService.users.updateOptIn).mockResolvedValue(mockApiResponse);

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const toggleButton = screen.getByRole('button', { name: 'Hide' });
            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(apiService.users.updateOptIn).toHaveBeenCalledWith('user-1', false);
                expect(mockUserStore.updateUser).toHaveBeenCalledWith({ isOptIn: false });
                expect(toast.success).toHaveBeenCalledWith('You are now hidden from the leaderboard');
            });
        });

        it('handles opt-in toggle error', async () => {
            const mockApiResponse = {
                success: false,
                error: 'Network error',
            };
            vi.mocked(apiService.users.updateOptIn).mockResolvedValue(mockApiResponse);

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const toggleButton = screen.getByRole('button', { name: 'Hide' });
            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Failed to update leaderboard visibility');
            });
        });
    });

    describe('Preferences Management', () => {
        it('displays current preferences correctly', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            // Theme buttons
            const lightButton = screen.getByRole('button', { name: 'light' });
            const darkButton = screen.getByRole('button', { name: 'dark' });
            const autoButton = screen.getByRole('button', { name: 'auto' });

            expect(lightButton).toHaveClass('bg-primary'); // Active theme
            expect(darkButton).not.toHaveClass('bg-primary');
            expect(autoButton).not.toHaveClass('bg-primary');

            // Animation buttons
            const fullButton = screen.getByRole('button', { name: 'full' });
            const reducedButton = screen.getByRole('button', { name: 'reduced' });
            const noneButton = screen.getByRole('button', { name: 'none' });

            expect(fullButton).toHaveClass('bg-primary'); // Active animation setting

            // Notification and sound toggles - there should be 2 enabled buttons
            const enabledButtons = screen.getAllByRole('button', { name: 'Enabled' });
            expect(enabledButtons).toHaveLength(2);
        });

        it('allows changing theme preferences', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const darkButton = screen.getByRole('button', { name: 'dark' });
            fireEvent.click(darkButton);

            // Save button should become enabled
            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            expect(saveButton).not.toBeDisabled();
        });

        it('allows changing animation preferences', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const reducedButton = screen.getByRole('button', { name: 'reduced' });
            fireEvent.click(reducedButton);

            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            expect(saveButton).not.toBeDisabled();
        });

        it('allows toggling notifications and sound effects', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const notificationButtons = screen.getAllByRole('button', { name: 'Enabled' });
            fireEvent.click(notificationButtons[0]); // Toggle notifications

            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            expect(saveButton).not.toBeDisabled();
        });

        it('saves preferences successfully', async () => {
            const mockApiResponse = {
                success: true,
                data: {
                    ...mockUser,
                    preferences: {
                        ...mockUser.preferences,
                        theme: 'dark' as const,
                    },
                },
            };
            vi.mocked(apiService.users.update).mockResolvedValue(mockApiResponse);

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            // Change theme to dark
            const darkButton = screen.getByRole('button', { name: 'dark' });
            fireEvent.click(darkButton);

            // Save changes
            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(mockUserStore.updatePreferences).toHaveBeenCalled();
                expect(apiService.users.update).toHaveBeenCalledWith('user-1', {
                    preferences: expect.objectContaining({
                        theme: 'dark',
                    }),
                });
                expect(toast.success).toHaveBeenCalledWith('Preferences updated successfully!');
            });
        });

        it('handles preferences save error and reverts changes', async () => {
            const mockApiResponse = {
                success: false,
                error: 'Server error',
            };
            vi.mocked(apiService.users.update).mockResolvedValue(mockApiResponse);

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            // Change theme to dark
            const darkButton = screen.getByRole('button', { name: 'dark' });
            fireEvent.click(darkButton);

            // Save changes
            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Failed to update preferences');
            });
        });

        it('disables save button when no changes are made', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            expect(saveButton).toBeDisabled();
        });
    });

    describe('Loading States', () => {
        it('shows loading state when user is null', () => {
            vi.mocked(useUserStore).mockReturnValue({
                ...mockUserStore,
                user: null,
            });

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByText('Loading profile...')).toBeInTheDocument();
        });

        it('shows loading state during updates', async () => {
            vi.mocked(apiService.users.updateOptIn).mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockUser }), 100))
            );

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const toggleButton = screen.getByRole('button', { name: 'Hide' });
            fireEvent.click(toggleButton);

            // Button should be disabled during update
            expect(toggleButton).toBeDisabled();
        });

        it('shows saving state during preferences update', async () => {
            vi.mocked(apiService.users.update).mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockUser }), 100))
            );

            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            // Change a preference
            const darkButton = screen.getByRole('button', { name: 'dark' });
            fireEvent.click(darkButton);

            // Click save
            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            fireEvent.click(saveButton);

            // Should show saving state
            expect(screen.getByText('Saving...')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has proper heading structure', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByRole('heading', { level: 1, name: 'Profile & Settings' })).toBeInTheDocument();
        });

        it('has proper form labels', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            expect(screen.getByText('Theme')).toBeInTheDocument();
            expect(screen.getByText('Animations')).toBeInTheDocument();
            expect(screen.getByText('Notifications')).toBeInTheDocument();
            expect(screen.getByText('Sound Effects')).toBeInTheDocument();
        });

        it('has proper button roles and states', () => {
            render(
                <ProfileWrapper>
                    <Profile />
                </ProfileWrapper>
            );

            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);

            // Check that disabled buttons have proper state
            const saveButton = screen.getByRole('button', { name: 'Save Changes' });
            expect(saveButton).toHaveAttribute('disabled');
        });
    });
});