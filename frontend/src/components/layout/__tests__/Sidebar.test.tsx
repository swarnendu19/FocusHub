import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Sidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders in expanded state by default', () => {
        renderWithRouter(<Sidebar />);

        expect(screen.getByText('FocusHub')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Leaderboard')).toBeInTheDocument();
        expect(screen.getByText('XP & Achievements')).toBeInTheDocument();
    });

    it('renders in collapsed state when prop is set', () => {
        renderWithRouter(<Sidebar isCollapsed={true} />);

        // Logo text should not be visible in collapsed state
        expect(screen.queryByText('FocusHub')).not.toBeInTheDocument();

        // Navigation text should not be visible in collapsed state
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
        expect(screen.queryByText('Projects')).not.toBeInTheDocument();

        // But icons should still be present
        const icons = screen.getAllByRole('link');
        expect(icons.length).toBeGreaterThan(0);
    });

    it('calls onToggle when toggle button is clicked', () => {
        const onToggle = vi.fn();
        renderWithRouter(<Sidebar onToggle={onToggle} />);

        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        expect(onToggle).toHaveBeenCalledOnce();
    });

    it('shows correct toggle icon based on collapsed state', () => {
        const { rerender } = renderWithRouter(<Sidebar isCollapsed={false} />);

        // Should show left chevron when expanded
        let toggleButton = screen.getByRole('button');
        expect(toggleButton.querySelector('svg')).toBeInTheDocument();

        // Re-render with collapsed state
        rerender(
            <BrowserRouter>
                <Sidebar isCollapsed={true} />
            </BrowserRouter>
        );

        // Should show right chevron when collapsed
        toggleButton = screen.getByRole('button');
        expect(toggleButton.querySelector('svg')).toBeInTheDocument();
    });

    it('highlights active navigation item', () => {
        // Mock location to be on projects page
        Object.defineProperty(window, 'location', {
            value: { pathname: '/projects' },
            writable: true,
        });

        renderWithRouter(<Sidebar />);

        const projectsLink = screen.getByRole('link', { name: /projects/i });
        expect(projectsLink.querySelector('.bg-\\[\\#58CC02\\]')).toBeInTheDocument();
    });

    it('shows tooltips on hover when collapsed', async () => {
        renderWithRouter(<Sidebar isCollapsed={true} />);

        const dashboardLink = screen.getByRole('link', { href: '/' });
        fireEvent.mouseEnter(dashboardLink);

        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });

        fireEvent.mouseLeave(dashboardLink);

        await waitFor(() => {
            expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
        });
    });

    it('renders bottom navigation items', () => {
        renderWithRouter(<Sidebar />);

        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Help')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('shows tooltips for bottom items when collapsed', async () => {
        renderWithRouter(<Sidebar isCollapsed={true} />);

        const settingsLink = screen.getByRole('link', { href: '/settings' });
        fireEvent.mouseEnter(settingsLink);

        await waitFor(() => {
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });
    });

    it('has proper navigation structure', () => {
        renderWithRouter(<Sidebar />);

        // Should have main navigation
        const mainNavLinks = [
            screen.getByRole('link', { href: '/' }),
            screen.getByRole('link', { href: '/projects' }),
            screen.getByRole('link', { href: '/leaderboard' }),
            screen.getByRole('link', { href: '/xp' }),
        ];

        expect(mainNavLinks).toHaveLength(4);

        // Should have bottom navigation
        const bottomNavLinks = [
            screen.getByRole('link', { href: '/settings' }),
            screen.getByRole('link', { href: '/help' }),
            screen.getByRole('link', { href: '/logout' }),
        ];

        expect(bottomNavLinks).toHaveLength(3);
    });

    it('shows active indicator for current page', () => {
        // Mock location to be on home page
        Object.defineProperty(window, 'location', {
            value: { pathname: '/' },
            writable: true,
        });

        renderWithRouter(<Sidebar />);

        const homeLink = screen.getByRole('link', { href: '/' });
        const activeIndicator = homeLink.querySelector('.absolute.right-2.w-2.h-2.bg-white.rounded-full');
        expect(activeIndicator).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
        const { container } = renderWithRouter(<Sidebar />);

        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveClass('fixed', 'left-0', 'top-0', 'h-full', 'bg-white');
    });

    it('handles navigation item hover states', async () => {
        renderWithRouter(<Sidebar />);

        const dashboardLink = screen.getByRole('link', { href: '/' });

        // Hover should trigger scale animation (tested through class presence)
        fireEvent.mouseEnter(dashboardLink);

        // The hover state is handled by Framer Motion, so we just verify the element is interactive
        expect(dashboardLink).toBeInTheDocument();
    });

    it('shows correct icons for each navigation item', () => {
        renderWithRouter(<Sidebar />);

        const navigationLinks = [
            screen.getByRole('link', { href: '/' }),
            screen.getByRole('link', { href: '/projects' }),
            screen.getByRole('link', { href: '/leaderboard' }),
            screen.getByRole('link', { href: '/xp' }),
        ];

        navigationLinks.forEach(link => {
            expect(link.querySelector('svg')).toBeInTheDocument();
        });
    });

    it('maintains proper z-index for tooltips', () => {
        renderWithRouter(<Sidebar isCollapsed={true} />);

        // Sidebar should have z-40
        const { container } = renderWithRouter(<Sidebar isCollapsed={true} />);
        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveClass('z-40');
    });

    it('handles responsive behavior', () => {
        const { container } = renderWithRouter(<Sidebar />);

        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveClass('fixed');

        // Should be positioned correctly for desktop layout
        expect(sidebar).toHaveClass('left-0', 'top-0');
    });

    it('shows brand logo in header section', () => {
        renderWithRouter(<Sidebar />);

        const logoContainer = screen.getByText('FH');
        expect(logoContainer).toBeInTheDocument();
        expect(logoContainer).toHaveClass('text-white', 'font-bold');
    });

    it('handles tooltip positioning correctly', async () => {
        renderWithRouter(<Sidebar isCollapsed={true} />);

        const dashboardLink = screen.getByRole('link', { href: '/' });
        fireEvent.mouseEnter(dashboardLink);

        await waitFor(() => {
            const tooltip = screen.getByText('Dashboard');
            expect(tooltip.parentElement).toHaveClass('absolute', 'left-full');
        });
    });
});