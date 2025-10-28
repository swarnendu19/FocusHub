<<<<<<< HEAD
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
=======
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

const HeaderWithRouter = () => (
    <BrowserRouter>
        <Header />
    </BrowserRouter>
);

describe('Header', () => {
    it('renders logo and brand name', () => {
        render(<HeaderWithRouter />);

        expect(screen.getByText('FocusHub')).toBeInTheDocument();
        expect(screen.getByText('FH')).toBeInTheDocument();
    });

    it('renders desktop navigation items', () => {
        render(<HeaderWithRouter />);

        expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Projects').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Leaderboard').length).toBeGreaterThan(0);
        expect(screen.getAllByText('XP').length).toBeGreaterThan(0);
    });

    it('renders user profile button', () => {
        render(<HeaderWithRouter />);

        const buttons = screen.getAllByRole('button');
        const userButton = buttons.find(button =>
            button.querySelector('svg')?.classList.contains('lucide-user')
        );
        expect(userButton).toBeInTheDocument();
    });

    it('renders navigation links with correct hrefs', () => {
        render(<HeaderWithRouter />);

        const allLinks = screen.getAllByRole('link');

        // Find links by their href attributes
        const homeLinks = allLinks.filter(link => link.getAttribute('href') === '/');
        const projectsLinks = allLinks.filter(link => link.getAttribute('href') === '/projects');
        const leaderboardLinks = allLinks.filter(link => link.getAttribute('href') === '/leaderboard');
        const xpLinks = allLinks.filter(link => link.getAttribute('href') === '/xp');

        expect(homeLinks.length).toBeGreaterThan(0);
        expect(projectsLinks.length).toBeGreaterThan(0);
        expect(leaderboardLinks.length).toBeGreaterThan(0);
        expect(xpLinks.length).toBeGreaterThan(0);
    });

    it('toggles mobile menu functionality', () => {
        render(<HeaderWithRouter />);

        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(button =>
            button.querySelector('svg')?.classList.contains('lucide-menu') ||
            button.querySelector('svg')?.classList.contains('lucide-x')
        );

        expect(menuButton).toBeInTheDocument();

        if (menuButton) {
            fireEvent.click(menuButton);
            // Mobile navigation should be present after click
            const mobileNavItems = screen.getAllByText('Home');
            expect(mobileNavItems.length).toBeGreaterThan(1); // Desktop + Mobile
        }
    });
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
});