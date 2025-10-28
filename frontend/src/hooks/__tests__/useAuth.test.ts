import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/stores';
import { apiService } from '@/services';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/stores');
vi.mock('@/services');
vi.mock('sonner');

const mockUseUserStore = vi.mocked(useUserStore);
const mockApiService = vi.mocked(apiService);
const mockToast = vi.mocked(toast);

describe('useAuth Hook', () => {
    const mockStoreState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearUser: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseUserStore.mockReturnValue(mockStoreState as any);

        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                removeItem: vi.fn(),
            },
            writable: true,
        });
    });

    it('returns correct initial state', () => {
        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.isLoggedIn).toBe(false);
        expect(result.current.userLevel).toBe(1);
        expect(result.current.userXP).toBe(0);
        expect(result.current.userStreak).toBe(0);
    });

    it('returns correct computed values when user is present', () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            level: 5,
            totalXP: 2500,
            streak: 7,
        };

        mockUseUserStore.mockReturnValue({
            ...mockStoreState,
            user: mockUser,
            isAuthenticated: true,
        } as any);

        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoggedIn).toBe(true);
        expect(result.current.userLevel).toBe(5);
        expect(result.current.userXP).toBe(2500);
        expect(result.current.userStreak).toBe(7);
    });

    describe('loginWithGoogle', () => {
        it('handles successful Google login', async () => {
            const mockResponse = {
                success: true,
                data: { redirectUrl: 'https://accounts.google.com/oauth/authorize?...' }
            };

            mockApiService.auth.loginWithGoogle.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                await result.current.loginWithGoogle();
            });

            expect(mockStoreState.setLoading).toHaveBeenCalledWith(true);
            expect(mockStoreState.setError).toHaveBeenCalledWith(null);
            expect(mockApiService.auth.loginWithGoogle).toHaveBeenCalled();
            expect(window.location.href).toBe(mockResponse.data.redirectUrl);
        });

        it('handles Google login failure', async () => {
            const mockResponse = {
                success: false,
                error: 'OAuth initialization failed'
            };

            mockApiService.auth.loginWithGoogle.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                await result.current.loginWithGoogle();
            });

            expect(mockStoreState.setError).toHaveBeenCalledWith('OAuth initialization failed');
            expect(mockToast.error).toHaveBeenCalledWith('OAuth initialization failed');
            expect(mockStoreState.setLoading).toHaveBeenCalledWith(false);
        });

        it('handles network errors during Google login', async () => {
            mockApiService.auth.loginWithGoogle.mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                await result.current.loginWithGoogle();
            });

            expect(mockStoreState.setError).toHaveBeenCalledWith('Network error');
            expect(mockToast.error).toHaveBeenCalledWith('Network error');
        });
    });

    describe('logout', () => {
        it('handles successful logout', async () => {
            const mockResponse = { success: true };
            mockApiService.auth.logout.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                await result.current.logout();
            });

            expect(mockStoreState.setLoading).toHaveBeenCalledWith(true);
            expect(mockStoreState.setError).toHaveBeenCalledWith(null);
            expect(mockApiService.auth.logout).toHaveBeenCalled();
            expect(mockStoreState.logout).toHaveBeenCalled();
            expect(mockStoreState.clearUser).toHaveBeenCalled();
            expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_redirect_path');
            expect(window.location.href).toBe('/login');
            expect(mockToast.success).toHaveBeenCalledWith('Successfully logged out');
        });

        it('handles logout failure', async () => {
            const mockResponse = {
                success: false,
                error: 'Logout failed'
            };

            mockApiService.auth.logout.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                await result.current.logout();
            });

            expect(mockStoreState.setError).toHaveBeenCalledWith('Logout failed');
            expect(mockToast.error).toHaveBeenCalledWith('Logout failed');
        });
    });

    describe('refreshUser', () => {
        it('handles successful user refresh', async () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
            };

            const mockResponse = {
                success: true,
                data: mockUser,
            };

            mockApiService.auth.getCurrentUser.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            let refreshedUser;
            await act(async () => {
                refreshedUser = await result.current.refreshUser();
            });

            expect(mockStoreState.setLoading).toHaveBeenCalledWith(true);
            expect(mockStoreState.setError).toHaveBeenCalledWith(null);
            expect(mockStoreState.login).toHaveBeenCalledWith(mockUser);
            expect(refreshedUser).toEqual(mockUser);
        });

        it('handles 401 error during refresh', async () => {
            const error = new Error('401 Unauthorized');
            mockApiService.auth.getCurrentUser.mockRejectedValue(error);

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                try {
                    await result.current.refreshUser();
                } catch (e) {
                    // Expected to throw
                }
            });

            expect(mockStoreState.logout).toHaveBeenCalled();
            expect(mockStoreState.clearUser).toHaveBeenCalled();
            expect(window.location.href).toBe('/login');
        });

        it('handles refresh failure', async () => {
            const mockResponse = {
                success: false,
                error: 'Session expired',
            };

            mockApiService.auth.getCurrentUser.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                try {
                    await result.current.refreshUser();
                } catch (e) {
                    // Expected to throw
                }
            });

            expect(mockStoreState.setError).toHaveBeenCalledWith('Session expired');
        });
    });

    describe('checkAuthStatus', () => {
        it('returns true for valid authentication', async () => {
            const mockResponse = {
                success: true,
                data: { id: '1', username: 'testuser' },
            };

            mockApiService.auth.getCurrentUser.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            let isAuthenticated;
            await act(async () => {
                isAuthenticated = await result.current.checkAuthStatus();
            });

            expect(isAuthenticated).toBe(true);
        });

        it('returns false for invalid authentication', async () => {
            const mockResponse = {
                success: false,
                error: 'Not authenticated',
            };

            mockApiService.auth.getCurrentUser.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth());

            let isAuthenticated;
            await act(async () => {
                isAuthenticated = await result.current.checkAuthStatus();
            });

            expect(isAuthenticated).toBe(false);
        });

        it('returns false on API error', async () => {
            mockApiService.auth.getCurrentUser.mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useAuth());

            let isAuthenticated;
            await act(async () => {
                isAuthenticated = await result.current.checkAuthStatus();
            });

            expect(isAuthenticated).toBe(false);
        });
    });
});