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
});