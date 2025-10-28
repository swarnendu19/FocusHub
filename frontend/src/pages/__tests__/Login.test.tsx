import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../Login';
import { useUserStore } from '@/stores';
import { apiService } from '@/services';

// Mock the stores and services
vi.mock('@/stores');
vi.mock('@/services');

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

const mockUseUserStore = vi.mocked(useUserStore);
const mockApiService = vi.mocked(apiService);

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    const mockStoreState = {
        isAuthenticated: false,
        setLoading: vi.fn(),
        setError: vi.fn(),
        isLoading: false,
        error: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseUserStore.mockReturnValue(mockStoreState as any);
    });

    it('renders login page with Google OAuth button', () => {
        renderLogin();

        expect(screen.getByText('Welcome to TimeTracker')).toBeInTheDocument();
        expect(screen.getByText('Track your time, level up your productivity')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('redirects to home if user is already authenticated', () => {
        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            isAuthenticated: true,
        } as any);

        renderLogin();

        // Should not render login form if authenticated
        expect(screen.queryByText('Welcome to TimeTracker')).not.toBeInTheDocument();
    });

    it('handles Google login successfully', async () => {
        const mockResponse = {
            success: true,
            data: { redirectUrl: 'https://accounts.google.com/oauth/authorize?...' }
        };

        mockApiService.auth.loginWithGoogle.mockResolvedValue(mockResponse);

        // Mock window.location.href
        const originalLocation = window.location;
        delete (window as any).location;
        window.location = { ...originalLocation, href: '' };

        renderLogin();

        const googleButton = screen.getByRole('button', { name: /continue with google/i });
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(mockStoreState.setLoading).toHaveBeenCalledWith(true);
            expect(mockStoreState.setError).toHaveBeenCalledWith(null);
            expect(mockApiService.auth.loginWithGoogle).toHaveBeenCalled();
        });

        // Restore window.location
        window.location = originalLocation;
    });

    it('handles Google login failure', async () => {
        const mockResponse = {
            success: false,
            error: 'OAuth initialization failed'
        };

        mockApiService.auth.loginWithGoogle.mockResolvedValue(mockResponse);

        renderLogin();

        const googleButton = screen.getByRole('button', { name: /continue with google/i });
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('OAuth initialization failed');
            expect(mockStoreState.setLoading).toHaveBeenCalledWith(false);
        });
    });

    it('displays error message when there is an error', () => {
        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            error: 'Authentication failed',
        } as any);

        renderLogin();

        expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });

    it('shows loading state during authentication', () => {
        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            isLoading: true,
        } as any);

        renderLogin();

        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('handles API service exceptions', async () => {
        mockApiService.auth.loginWithGoogle.mockRejectedValue(new Error('Network error'));

        renderLogin();

        const googleButton = screen.getByRole('button', { name: /continue with google/i });
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('Network error');
            expect(mockStoreState.setLoading).toHaveBeenCalledWith(false);
        });
    });

    it('handles missing redirect URL in response', async () => {
        const mockResponse = {
            success: true,
            data: null
        };

        mockApiService.auth.loginWithGoogle.mockResolvedValue(mockResponse);

        renderLogin();

        const googleButton = screen.getByRole('button', { name: /continue with google/i });
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(mockStoreState.setError).toHaveBeenCalledWith('Failed to initiate Google login');
        });
    });
});