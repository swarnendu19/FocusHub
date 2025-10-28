import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthCallback } from '../AuthCallback';
import { useUserStore } from '@/stores';
import { apiService } from '@/services';

// Mock the stores and services
vi.mock('@/stores');
vi.mock('@/services');

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

const mockUseUserStore = vi.mocked(useUserStore);
const mockApiService = vi.mocked(apiService);

// Mock useSearchParams
const mockSearchParams = {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
};

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useSearchParams: () => [mockSearchParams],
    };
});

const renderAuthCallback = () => {
    return render(
        <BrowserRouter>
            <AuthCallback />
        </BrowserRouter>
    );
};

describe('AuthCallback Component', () => {
    const mockStoreState = {
        login: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseUserStore.mockReturnValue(mockStoreState as any);
        mockSearchParams.get.mockReturnValue(null);

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(),
                setItem: vi.fn(),
                removeItem: vi.fn(),
            },
            writable: true,
        });

        // Mock window.location.href
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });

        // Mock setTimeout
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows loading state initially', () => {
        renderAuthCallback();
        expect(screen.getByText('Completing sign in...')).toBeInTheDocument();
        expect(screen.getByText('Please wait while we set up your account.')).toBeInTheDocument();
    });

    it('handles successful authentication', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            level: 1,
            totalXP: 0,
        };

        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: true,
            data: mockUser,
        });

        renderAuthCallback();

        await waitFor(() => {
            expect(mockStoreState.login).toHaveBeenCalledWith(mockUser);
        });

        expect(screen.getByText('Welcome back!')).toBeInTheDocument();
        expect(screen.getByText("You've been successfully logged in.")).toBeInTheDocument();
    });

    it('handles OAuth error parameters', async () => {
        mockSearchParams.get.mockImplementation((key: string) => {
            if (key === 'error') return 'access_denied';
            if (key === 'error_description') return 'User denied access';
            return null;
        });

        renderAuthCallback();

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('User denied access');
        });

        expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
        expect(screen.getByText("We couldn't log you in. Please try again.")).toBeInTheDocument();
    });

    it('handles API failure during user fetch', async () => {
        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: false,
            error: 'Session expired',
        });

        renderAuthCallback();

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('Session expired');
        });

        expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
    });

    it('handles network errors', async () => {
        mockApiService.auth.getCurrentUser.mockRejectedValue(new Error('Network error'));

        renderAuthCallback();

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('Network error');
        });

        expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
    });

    it('uses saved redirect path from localStorage', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
        };

        const savedPath = '/projects';
        (window.localStorage.getItem as any).mockReturnValue(savedPath);

        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: true,
            data: mockUser,
        });

        renderAuthCallback();

        await waitFor(() => {
            expect(mockStoreState.login).toHaveBeenCalledWith(mockUser);
        });

        // Fast-forward timers to trigger redirect
        vi.advanceTimersByTime(1500);

        expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_redirect_path');
        expect(window.location.href).toBe(savedPath);
    });

    it('redirects to home when no saved path exists', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
        };

        (window.localStorage.getItem as any).mockReturnValue(null);

        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: true,
            data: mockUser,
        });

        renderAuthCallback();

        await waitFor(() => {
            expect(mockStoreState.login).toHaveBeenCalledWith(mockUser);
        });

        // Fast-forward timers to trigger redirect
        vi.advanceTimersByTime(1500);

        expect(window.location.href).toBe('/');
    });

    it('handles OAuth error without description', async () => {
        mockSearchParams.get.mockImplementation((key: string) => {
            if (key === 'error') return 'server_error';
            return null;
        });

        renderAuthCallback();

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('OAuth error: server_error');
        });
    });

    it('shows try again button on error', async () => {
        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: false,
            error: 'Authentication failed',
        });

        renderAuthCallback();

        await waitFor(() => {
            expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
        });

        const tryAgainButton = screen.getByRole('button', { name: /try again/i });
        expect(tryAgainButton).toBeInTheDocument();
    });
});