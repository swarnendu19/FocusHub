import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LeaderboardEntry, PaginatedResponse } from '@/types';

interface LeaderboardState {
    entries: LeaderboardEntry[];
    currentUserEntry: LeaderboardEntry | null;
    isLoading: boolean;
    error: string | null;

    // Pagination
    currentPage: number;
    totalPages: number;
    hasMore: boolean;

    // Filters and sorting
    timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
    sortBy: 'xp' | 'time' | 'tasks' | 'level';
    sortOrder: 'asc' | 'desc';

    // Actions
    setEntries: (entries: LeaderboardEntry[]) => void;
    addEntries: (entries: LeaderboardEntry[]) => void;
    setCurrentUserEntry: (entry: LeaderboardEntry | null) => void;
    updateUserEntry: (userId: string, updates: Partial<LeaderboardEntry>) => void;

    // Pagination actions
    setCurrentPage: (page: number) => void;
    setTotalPages: (pages: number) => void;
    setHasMore: (hasMore: boolean) => void;

    // Filter and sort actions
    setTimeframe: (timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time') => void;
    setSortBy: (sortBy: 'xp' | 'time' | 'tasks' | 'level') => void;
    setSortOrder: (order: 'asc' | 'desc') => void;

    // Utility actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    clearLeaderboard: () => void;

    // Computed getters
    getUserRank: (userId: string) => number | null;
    getTopUsers: (count: number) => LeaderboardEntry[];
    getUsersAroundRank: (rank: number, range: number) => LeaderboardEntry[];
    getRankChange: (userId: string) => number | null;

    // Analytics
    getTotalUsers: () => number;
    getAverageXP: () => number;
    getAverageTime: () => number;
}

export const useLeaderboardStore = create<LeaderboardState>()(
    devtools(
        (set, get) => ({
            entries: [],
            currentUserEntry: null,
            isLoading: false,
            error: null,

            // Pagination
            currentPage: 1,
            totalPages: 1,
            hasMore: false,

            // Filters and sorting
            timeframe: 'all-time',
            sortBy: 'xp',
            sortOrder: 'desc',

            setEntries: (entries) => {
                // Sort entries by rank
                const sortedEntries = entries.sort((a, b) => a.rank - b.rank);
                set({ entries: sortedEntries, error: null });
            },

            addEntries: (newEntries) => {
                set((state) => {
                    const existingIds = new Set(state.entries.map(entry => entry.userId));
                    const uniqueNewEntries = newEntries.filter(entry => !existingIds.has(entry.userId));
                    const allEntries = [...state.entries, ...uniqueNewEntries];

                    // Sort by rank
                    const sortedEntries = allEntries.sort((a, b) => a.rank - b.rank);

                    return { entries: sortedEntries, error: null };
                });
            },

            setCurrentUserEntry: (entry) => set({ currentUserEntry: entry }),

            updateUserEntry: (userId, updates) => {
                set((state) => ({
                    entries: state.entries.map((entry) =>
                        entry.userId === userId ? { ...entry, ...updates } : entry
                    ),
                    currentUserEntry: state.currentUserEntry?.userId === userId
                        ? { ...state.currentUserEntry, ...updates }
                        : state.currentUserEntry,
                    error: null,
                }));
            },

            // Pagination actions
            setCurrentPage: (page) => set({ currentPage: page }),
            setTotalPages: (pages) => set({ totalPages: pages }),
            setHasMore: (hasMore) => set({ hasMore }),

            // Filter and sort actions
            setTimeframe: (timeframe) => set({ timeframe }),
            setSortBy: (sortBy) => set({ sortBy }),
            setSortOrder: (order) => set({ sortOrder: order }),

            // Utility actions
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error, isLoading: false }),
            clearError: () => set({ error: null }),
            clearLeaderboard: () => set({
                entries: [],
                currentUserEntry: null,
                currentPage: 1,
                totalPages: 1,
                hasMore: false
            }),

            // Computed getters
            getUserRank: (userId) => {
                const entry = get().entries.find(entry => entry.userId === userId);
                return entry ? entry.rank : null;
            },

            getTopUsers: (count) => {
                return get().entries.slice(0, count);
            },

            getUsersAroundRank: (rank, range) => {
                const entries = get().entries;
                const startIndex = Math.max(0, rank - range - 1);
                const endIndex = Math.min(entries.length, rank + range);
                return entries.slice(startIndex, endIndex);
            },

            getRankChange: (userId) => {
                const entry = get().entries.find(entry => entry.userId === userId);
                if (!entry || entry.previousRank === undefined) return null;
                return entry.previousRank - entry.rank; // Positive = moved up, negative = moved down
            },

            // Analytics
            getTotalUsers: () => get().entries.length,

            getAverageXP: () => {
                const entries = get().entries;
                if (entries.length === 0) return 0;
                const totalXP = entries.reduce((sum, entry) => sum + entry.xp, 0);
                return Math.round(totalXP / entries.length);
            },

            getAverageTime: () => {
                const entries = get().entries;
                if (entries.length === 0) return 0;
                const totalTime = entries.reduce((sum, entry) => sum + entry.totalTime, 0);
                return Math.round(totalTime / entries.length);
            },
        }),
        { name: 'LeaderboardStore' }
    )
);