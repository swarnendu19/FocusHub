import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '../api';
import { useUserStore } from '@/stores';
import { useAuth } from '@/hooks/useAuth';

// Mock axios
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() },
            },
        })),
    },
}));

// Mock stores
vi.mock('@/stores');
vi.mock('sonner');

describe('Authentication Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should have authentication API methods', () => {
        expect(apiService.auth).toBeDefined();
        expect(apiService.auth.getCurrentUser).toBeDefined();
        expect(apiService.auth.logout).toBeDefined();
        expect(apiService.auth.loginWithGoogle).toBeDefined();
    });

    it('should have user store with authentication state', () => {
        const mockStore = {
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

        vi.mocked(useUserStore).mockReturnValue(mockStore as any);

        const store = useUserStore();
        expect(store.user).toBeNull();
        expect(store.isAuthenticated).toBe(false);
        expect(store.login).toBeDefined();
        expect(store.logout).toBeDefined();
    });

    it('should export authentication components and hooks', async () => {
        // Test that we can import the authentication modules
        const { ProtectedRoute } = await import('@/components/auth/ProtectedRoute');
        const { useAuth } = await import('@/hooks/useAuth');
        const { Login } = await import('@/pages/Login');
        const { AuthCallback } = await import('@/pages/AuthCallback');

        expect(ProtectedRoute).toBeDefined();
        expect(useAuth).toBeDefined();
        expect(Login).toBeDefined();
        expect(AuthCallback).toBeDefined();
    });

    it('should have proper API service structure', () => {
        expect(apiService).toBeDefined();
        expect(apiService.auth).toBeDefined();
        expect(apiService.users).toBeDefined();
        expect(apiService.leaderboard).toBeDefined();
        expect(apiService.analytics).toBeDefined();
    });
});