import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
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
    AnimatePresence: ({ children }: any) => children,
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => <div data-testid="navigate-to">{to}</div>,
        useLocation: vi.fn(),
    };
});

const mockUseUserStore = vi.mocked(useUserStore);
const mockApiService = vi.mocked(apiService);
const mockUseLocation = vi.mocked(useLocation);

const TestChild = () => <div data-testid="protected-content">Protected Content</div>;

const renderProtectedRoute = () => {
    return render(
        <BrowserRouter>
            <ProtectedRoute>
                <TestChild />
            </ProtectedRoute>
        </BrowserRouter>
    );
};

describe('ProtectedRoute Component', () => {
    const mockLocation = {
        pathname: '/dashboard',
        search: '?tab=overview',
    };

    const mockStoreState = {
        isAuthenticated: false,
        user: null,
        login: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        isLoading: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseUserStore.mockReturnValue(mockStoreState as any);
        mockUseLocation.mockReturnValue(mockLocation as any);

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: vi.fn(),
            },
            writable: true,
        });
    });

    it('shows loading state during initialization', () => {
        renderProtectedRoute();

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByText('Checking your authentication status')).toBeInTheDocument();
    });

    it('renders protected content when user is authenticated', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
        };

        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            isAuthenticated: true,
            user: mockUser,
        } as any);

        renderProtectedRoute();

        await waitFor(() => {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    it('redirects to login when user is not authenticated', async () => {
        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: false,
            error: 'Not authenticated',
        });

        renderProtectedRoute();

        await waitFor(() => {
            expect(screen.getByTestId('navigate-to')).toHaveTextContent('/login');
        });

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'auth_redirect_path',
            '/dashboard?tab=overview'
        );
    });

    it('authenticates user with valid session', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
        };

        // First call returns unauthenticated state, then after API call it should be authenticated
        let callCount = 0;
        mockUseUserStore.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return {
                    ...mockStoreState,
                    isAuthenticated: false,
                    user: null,
                } as any;
            }
            return {
                ...mockStoreState,
                isAuthenticated: true,
                user: mockUser,
            } as any;
        });

        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: true,
            data: mockUser,
        });

        renderProtectedRoute();

        await waitFor(() => {
            expect(mockStoreState.login).toHaveBeenCalledWith(mockUser);
        });

        // Re-render with authenticated state
        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            isAuthenticated: true,
            user: mockUser,
        } as any);

        renderProtectedRoute();

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('handles API errors during authentication check', async () => {
        mockApiService.auth.getCurrentUser.mockRejectedValue(new Error('Network error'));

        renderProtectedRoute();

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('Network error');
        });
    });

    it('skips API call when user is already authenticated', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
        };

        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            isAuthenticated: true,
            user: mockUser,
        } as any);

        renderProtectedRoute();

        // Should not call API if already authenticated
        expect(mockApiService.auth.getCurrentUser).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    it('shows loading state when store is loading', () => {
        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            isLoading: true,
        } as any);

        renderProtectedRoute();

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles successful authentication without user data', async () => {
        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: true,
            data: null,
        });

        renderProtectedRoute();

        await waitFor(() => {
            expect(screen.getByTestId('navigate-to')).toHaveTextContent('/login');
        });
    });

    it('saves current path including search params for redirect', async () => {
        mockApiService.auth.getCurrentUser.mockResolvedValue({
            success: false,
            error: 'Not authenticated',
        });

        renderProtectedRoute();

        await waitFor(() => {
            expect(window.localStorage.setItem).toHaveBeenCalledWith(
                'auth_redirect_path',
                '/dashboard?tab=overview'
            );
        });
    });
});