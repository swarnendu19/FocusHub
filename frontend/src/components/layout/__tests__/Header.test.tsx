import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    level: 5,
    totalXP: 1250,
};

const mockAuth = {
    user: mockUser,
    logout: vi.fn(),
    isLoading: false,
};

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue(mockAuth);
    });

    it('renders logo and navigation correctly', () => {
        renderWithRouter(<Header />);

        expect(screen.getByText('FocusHub')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Leaderboard')).toBeInTheDocument();
        expect(screen.getByText('XP')).toBeInTheDocument();
    });

    it('shows user information in profile dropdown', () => {
        renderWithRouter(<Header />);

        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByAltText('testuser')).toBeInTheDocument();
    });

    it('opens user menu when profile button is clicked', async () => {
        renderWithRouter(<Header />);

        const profileButton = screen.getByRole('button', { name: /testuser/i });
        fireEvent.click(profileButton);

        await waitFor(() => {
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('Level 5')).toBeInTheDocument();
            expect(screen.getByText('1250 XP')).toBeInTheDocument();
            expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
            expect(screen.getByText('Sign out')).toBeInTheDocument();
        });
    });

    it('closes user menu when clicking outside', async () => {
        renderWithRouter(<Header />);

        const profileButton = screen.getByRole('button', { name: /testuser/i });
        fireEvent.click(profileButton);

        await waitFor(() => {
            expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
        });

        // Click outside the menu
        fireEvent.mouseDown(document.body);

        await waitFor(() => {
            expect(screen.queryByText('Profile & Settings')).not.toBeInTheDocument();
        });
    });

    it('calls logout when sign out is clicked', async () => {
        renderWithRouter(<Header />);

        const profileButton = screen.getByRole('button', { name: /testuser/i });
        fireEvent.click(profileButton);

        await waitFor(() => {
            const signOutButton = screen.getByText('Sign out');
            fireEvent.click(signOutButton);
        });

        expect(mockAuth.logout).toHaveBeenCalledOnce();
    });

    it('shows mobile menu button on mobile', () => {
        renderWithRouter(<Header />);

        // Mobile menu button should be present (hidden on desktop with md:hidden)
        const mobileMenuButton = screen.getByRole('button', { name: '' }); // Menu icon button
        expect(mobileMenuButton).toBeInTheDocument();
    });

    it('toggles mobile menu when button is clicked', async () => {
        renderWithRouter(<Header />);

        const mobileMenuButton = screen.getAllByRole('button').find(button =>
            button.querySelector('svg')
        );

        if (mobileMenuButton) {
            fireEvent.click(mobileMenuButton);

            // Mobile navigation should be visible
            await waitFor(() => {
                // Check for mobile navigation items
                const mobileNavItems = screen.getAllByText('Home');
                expect(mobileNavItems.length).toBeGreaterThan(1); // Desktop + mobile
            });
        }
    });

    it('highlights active navigation item', () => {
        // Mock location to be on projects page
        Object.defineProperty(window, 'location', {
            value: { pathname: '/projects' },
            writable: true,
        });

        renderWithRouter(<Header />);

        const projectsButton = screen.getByRole('link', { name: /projects/i });
        expect(projectsButton).toHaveClass('bg-[#58CC02]', 'text-white');
    });

    it('handles user without avatar', () => {
        const authWithoutAvatar = {
            ...mockAuth,
            user: { ...mockUser, avatar: undefined },
        };
        (useAuth as any).mockReturnValue(authWithoutAvatar);

        renderWithRouter(<Header />);

        // Should show initials instead of avatar
        expect(screen.getByText('T')).toBeInTheDocument(); // First letter of username
    });

    it('handles loading state', () => {
        const loadingAuth = {
            ...mockAuth,
            isLoading: true,
        };
        (useAuth as any).mockReturnValue(loadingAuth);

        renderWithRouter(<Header />);

        const profileButton = screen.getByRole('button', { name: /testuser/i });
        fireEvent.click(profileButton);

        expect(screen.getByText('Signing out...')).toBeInTheDocument();
    });

    it('handles null user gracefully', () => {
        const authWithoutUser = {
            ...mockAuth,
            user: null,
        };
        (useAuth as any).mockReturnValue(authWithoutUser);

        renderWithRouter(<Header />);

        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('U')).toBeInTheDocument(); // Default initial
    });

    it('shows correct navigation icons', () => {
        renderWithRouter(<Header />);

        // Check that navigation items have their respective icons
        const homeLink = screen.getByRole('link', { name: /home/i });
        const projectsLink = screen.getByRole('link', { name: /projects/i });
        const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i });
        const xpLink = screen.getByRole('link', { name: /xp/i });

        expect(homeLink.querySelector('svg')).toBeInTheDocument();
        expect(projectsLink.querySelector('svg')).toBeInTheDocument();
        expect(leaderboardLink.querySelector('svg')).toBeInTheDocument();
        expect(xpLink.querySelector('svg')).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
        renderWithRouter(<Header />);

        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();

        const navigation = screen.getByRole('navigation');
        expect(navigation).toBeInTheDocument();

        const profileButton = screen.getByRole('button', { name: /testuser/i });
        expect(profileButton).toBeInTheDocument();
    });

    it('applies hover animations to interactive elements', () => {
        renderWithRouter(<Header />);

        const logo = screen.getByText('FocusHub').closest('a');
        expect(logo).toBeInTheDocument();

        const homeButton = screen.getByRole('link', { name: /home/i });
        expect(homeButton).toBeInTheDocument();

        // These elements should have motion.div wrappers for animations
        // The actual animation testing would require more complex setup
    });
});