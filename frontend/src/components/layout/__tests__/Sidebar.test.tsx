import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

const SidebarWithRouter = (props: any) => (
    <BrowserRouter>
        <Sidebar {...props} />
    </BrowserRouter>
);

describe('Sidebar', () => {
    it('renders navigation items when expanded', () => {
        render(<SidebarWithRouter isCollapsed={false} />);

        expect(screen.getByText('FocusHub')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Leaderboard')).toBeInTheDocument();
        expect(screen.getByText('XP & Achievements')).toBeInTheDocument();
    });

    it('hides text when collapsed', () => {
        render(<SidebarWithRouter isCollapsed={true} />);

        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
        expect(screen.queryByText('Projects')).not.toBeInTheDocument();
    });

    it('calls onToggle when toggle button is clicked', () => {
        const mockToggle = vi.fn();
        render(<SidebarWithRouter isCollapsed={false} onToggle={mockToggle} />);

        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('renders navigation links', () => {
        render(<SidebarWithRouter isCollapsed={false} />);

        // Check that navigation links exist
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        // Check for specific navigation items
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
    });
});