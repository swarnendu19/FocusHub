import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types';

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isLoading: false,
                error: null,

                setUser: (user) => set({ user, error: null }),

                setLoading: (isLoading) => set({ isLoading }),

                setError: (error) => set({ error, isLoading: false }),

                updateUser: (updates) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({ user: { ...currentUser, ...updates } });
                    }
                },

                clearUser: () => set({ user: null, error: null, isLoading: false }),
            }),
            {
                name: 'user-store',
                partialize: (state) => ({ user: state.user }), // Only persist user data
            }
        ),
        { name: 'UserStore' }
    )
);