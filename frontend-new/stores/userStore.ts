/**
 * User Store
 *
 * Zustand store for managing user authentication and profile state.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "@/config";
import type { User, AuthToken, UserStats, UserPreferences, AuthState } from "@/types";

interface UserStore extends AuthState {
  // User data
  stats: UserStats | null;
  preferences: UserPreferences | null;

  // Actions
  setUser: (user: Partial<User>, token: AuthToken | string) => void;
  updateUser: (updates: Partial<User>) => void;
  setStats: (stats: UserStats) => void;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  logout: () => void;
  clearUser: () => void; // Alias for logout
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Computed
  isLoggedIn: () => boolean;
  getAccessToken: () => string | null;
  hasValidToken: () => boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      stats: null,
      preferences: null,

      setUser: (user, token) => {
        // Handle both string token and AuthToken object
        const authToken: AuthToken = typeof token === 'string'
          ? {
              accessToken: token,
              refreshToken: '',
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              tokenType: 'Bearer',
            }
          : token;

        // Fill in required User fields if not provided
        const fullUser: User = {
          id: user.id || '',
          email: user.email || '',
          username: user.username || '',
          displayName: user.displayName || '',
          avatar: user.avatar,
          bio: user.bio,
          role: user.role || 'user' as any,
          authProvider: user.authProvider || 'email' as any,
          createdAt: user.createdAt || new Date(),
          updatedAt: user.updatedAt || new Date(),
          lastLoginAt: user.lastLoginAt,
        };

        set({
          user: fullUser,
          token: authToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      setStats: (stats) => {
        set({ stats });
      },

      setPreferences: (preferences) => {
        set({ preferences });
      },

      updatePreferences: (updates) => {
        const current = get().preferences;
        if (current) {
          set({
            preferences: { ...current, ...updates },
          });
        }
      },

      logout: () => {
        set({
          ...initialState,
          stats: null,
          preferences: null,
        });
      },

      clearUser: () => {
        // Alias for logout
        set({
          ...initialState,
          stats: null,
          preferences: null,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      // Computed getters
      isLoggedIn: () => {
        const state = get();
        return state.isAuthenticated && state.user !== null;
      },

      getAccessToken: () => {
        return get().token?.accessToken || null;
      },

      hasValidToken: () => {
        const token = get().token;
        if (!token) return false;

        const expiresAt = new Date(token.expiresAt);
        return expiresAt > new Date();
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      storage: createJSONStorage(() => {
        // SSR-safe storage
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      // Only persist essential auth data
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Deserialize dates from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert date strings back to Date objects
          if (state.user) {
            state.user.createdAt = state.user.createdAt ? new Date(state.user.createdAt) : new Date();
            state.user.updatedAt = state.user.updatedAt ? new Date(state.user.updatedAt) : new Date();
            if (state.user.lastLoginAt) {
              state.user.lastLoginAt = new Date(state.user.lastLoginAt);
            }
          }
          if (state.token?.expiresAt) {
            state.token.expiresAt = new Date(state.token.expiresAt);
          }

          // Token validation happens after hydration in the app
        }
      },
    }
  )
);

// Selectors for optimal re-renders
export const selectUser = (state: UserStore) => state.user;
export const selectIsAuthenticated = (state: UserStore) => state.isAuthenticated;
export const selectUserStats = (state: UserStore) => state.stats;
export const selectUserPreferences = (state: UserStore) => state.preferences;
export const selectIsLoading = (state: UserStore) => state.isLoading;
export const selectError = (state: UserStore) => state.error;
export const selectAccessToken = (state: UserStore) => state.getAccessToken();
