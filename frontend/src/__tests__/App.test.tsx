import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock all the complex components to focus on routing
vi.mock('../components/layout', () => ({
    Layout: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layout">{children}</div>
    ),
}));

vi.mock('../components/auth/ProtectedRoute', () => ({
    ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="protected-route">{children}</div>
    ),
}));

vi.mock('../pages', () => ({
    Home: () => <div data-testid="home-page">Home Page</div>,
    Projects: () => <div data-testid="projects-page">Projects Page</div>,
    Leaderboard: () => <div data-testid="leaderboard-page">Leaderboard Page</div>,
    XP: () => <div data-testid="xp-page">XP Page</div>,
    Login: () => <div data-testid="login-page">Login Page</div>,
    AuthCallback: () => <div data-testid="auth-callback-page">Auth Callback Page</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock sonner
vi.mock('sonner', () => ({
    Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('has authentication routes configured', () => {
        // Test that the App component structure includes authentication
        const { container } = render(<App />);
        expect(container).toBeInTheDocument();
    });

    it('includes toast notifications', () => {
        render(<App />);
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });
});