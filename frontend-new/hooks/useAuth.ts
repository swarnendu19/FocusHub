/**
 * useAuth Hook
 *
 * Custom hook for managing authentication state and operations.
 * Provides access to user data, login/logout functionality, and auth status.
 */

"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores";
import { authService } from "@/services";
import type {
  LoginCredentials,
  RegisterCredentials,
  GoogleAuthPayload,
} from "@/types";

export function useAuth() {
  const router = useRouter();

  // Get state and actions from user store
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setLoading = useUserStore((state) => state.setLoading);
  const setError = useUserStore((state) => state.setError);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.login(credentials);

        // Set user data and token
        setUser(response.user, response.token);

        // Set auth cookie for middleware
        document.cookie = `auth_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

        // Redirect to dashboard
        const redirectUrl = new URLSearchParams(window.location.search).get(
          "redirect"
        );
        router.push(redirectUrl || "/projects");

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading, setError]
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.register(credentials);

        // Set user data and token
        setUser(response.user, response.token);

        // Set auth cookie for middleware
        document.cookie = `auth_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}`;

        // Redirect to dashboard
        router.push("/projects");

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading, setError]
  );

  /**
   * Login with Google OAuth
   */
  const loginWithGoogle = useCallback(
    async (payload: GoogleAuthPayload) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.googleAuth(payload.code);

        // Set user data and token
        setUser(response.user, response.token);

        // Set auth cookie for middleware
        document.cookie = `auth_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}`;

        // Redirect to dashboard
        const redirectUrl = new URLSearchParams(window.location.search).get(
          "redirect"
        );
        router.push(redirectUrl || "/projects");

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Google authentication failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading, setError]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Call logout API
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear user state
      clearUser();

      // Remove auth cookie
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect to login
      router.push("/login");

      setLoading(false);
    }
  }, [router, clearUser, setLoading]);

  /**
   * Refresh user profile
   */
  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await authService.getProfile();
      const currentToken = useUserStore.getState().token;

      if (currentToken) {
        setUser(userData, currentToken);
      }

      return userData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh profile";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(
    async (preferences: Record<string, unknown>) => {
      try {
        setLoading(true);
        setError(null);

        const updatedPrefs = await authService.updatePreferences(preferences as any);

        return updatedPrefs;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update preferences";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Check token validity on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      const token = useUserStore.getState().token;

      // If we have a token but no user, try to fetch profile
      if (token && !user) {
        try {
          await refreshProfile();
        } catch (err) {
          // Token is invalid, clear auth state
          clearUser();
          document.cookie =
            "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    };

    checkAuth();
  }, [user, refreshProfile, clearUser]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    loginWithGoogle,
    logout,
    refreshProfile,
    updatePreferences,
  };
}
