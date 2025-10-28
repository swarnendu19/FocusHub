import { useCallback } from 'react';
import { useUserStore } from '@/stores';
import { apiService } from '@/services';
import { toast } from 'sonner';

export function useAuth() {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout: logoutStore,
        setLoading,
        setError,
        clearUser
    } = useUserStore();

    const loginWithGoogle = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.auth.loginWithGoogle();

            if (response.success && response.data?.redirectUrl) {
                // Redirect to Google OAuth
                window.location.href = response.data.redirectUrl;
            } else {
                throw new Error(response.error || 'Failed to initiate Google login');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to login with Google';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        }
    }, [setLoading, setError]);

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Call backend logout endpoint
            const response = await apiService.auth.logout();

            if (response.success) {
                // Clear user data from store
                logoutStore();
                clearUser();

                // Clear any stored redirect path
                localStorage.removeItem('auth_redirect_path');

                // Redirect to login page
                window.location.href = '/login';

                toast.success('Successfully logged out');
            } else {
                throw new Error(response.error || 'Failed to logout');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, logoutStore, clearUser]);

    const refreshUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.auth.getCurrentUser();

            if (response.success && response.data) {
                login(response.data);
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to refresh user data');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user data';
            setError(errorMessage);

            // If refresh fails, user might need to re-authenticate
            if (err instanceof Error && err.message.includes('401')) {
                logoutStore();
                clearUser();
                window.location.href = '/login';
            }

            throw err;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, login, logoutStore, clearUser]);

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await apiService.auth.getCurrentUser();
            return response.success && !!response.data;
        } catch {
            return false;
        }
    }, []);

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        error,

        // Actions
        loginWithGoogle,
        logout,
        refreshUser,
        checkAuthStatus,

        // Computed values
        isLoggedIn: isAuthenticated && !!user,
        userLevel: user?.level || 1,
        userXP: user?.totalXP || 0,
        userStreak: user?.streak || 0,
    };
}