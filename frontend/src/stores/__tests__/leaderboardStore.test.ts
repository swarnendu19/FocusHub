import { describe, it, expect, beforeEach } from 'vitest';
import { useLeaderboardStore } from '../leaderboardStore';
import type { LeaderboardEntry } from '@/types';

const mockLeaderboardEntries: LeaderboardEntry[] = [
    {
        userId: '1',
        username: 'user1',
        avatar: 'avatar1.jpg',
        totalTime: 7200000, // 2 hours
        level: 5,
        rank: 1,
        previousRank: 2,
        weeklyTime: 3600000, // 1 hour
        monthlyTime: 14400000, // 4 hours
        xp: 5000,
        tasksCompleted: 25,
    },
    {
        userId: '2',
        username: 'user2',
        avatar: 'avatar2.jpg',
        totalTime: 5400000, // 1.5 hours
        level: 4,
        rank: 2,
        previousRank: 1,
        weeklyTime: 1800000, // 0.5 hours
        monthlyTime: 10800000, // 3 hours
        xp: 4000,
        tasksCompleted: 20,
    },
    {
        userId: '3',
        username: 'user3',
        avatar: 'avatar3.jpg',
        totalTime: 3600000, // 1 hour
        level: 3,
        rank: 3,
        previousRank: 3,
        weeklyTime: 900000, // 0.25 hours
        monthlyTime: 7200000, // 2 hours
        xp: 3000,
        tasksCompleted: 15,
    },
];

describe('LeaderboardStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useLeaderboardStore.setState({
            entries: [],
            currentUserEntry: null,
            isLoading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,
            hasMore: false,
            timeframe: 'all-time',
            sortBy: 'xp',
            sortOrder: 'desc',
        });
    });

    it('should initialize with default state', () => {
        const state = useLeaderboardStore.getState();

        expect(state.entries).toEqual([]);
        expect(state.currentUserEntry).toBeNull();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.currentPage).toBe(1);
        expect(state.totalPages).toBe(1);
        expect(state.hasMore).toBe(false);
        expect(state.timeframe).toBe('all-time');
        expect(state.sortBy).toBe('xp');
        expect(state.sortOrder).toBe('desc');
    });

    it('should set entries correctly and sort by rank', () => {
        const { setEntries } = useLeaderboardStore.getState();

        // Pass entries in wrong order to test sorting
        const unsortedEntries = [mockLeaderboardEntries[2], mockLeaderboardEntries[0], mockLeaderboardEntries[1]];
        setEntries(unsortedEntries);

        const state = useLeaderboardStore.getState();
        expect(state.entries).toHaveLength(3);
        expect(state.entries[0].rank).toBe(1); // Should be sorted by rank
        expect(state.entries[1].rank).toBe(2);
        expect(state.entries[2].rank).toBe(3);
        expect(state.error).toBeNull();
    });

    it('should add entries without duplicates', () => {
        const { setEntries, addEntries } = useLeaderboardStore.getState();

        setEntries([mockLeaderboardEntries[0]]);

        // Try to add entries including a duplicate
        addEntries([mockLeaderboardEntries[0], mockLeaderboardEntries[1]]);

        const state = useLeaderboardStore.getState();
        expect(state.entries).toHaveLength(2); // Should not duplicate user1
        expect(state.entries.find(e => e.userId === '1')).toBeDefined();
        expect(state.entries.find(e => e.userId === '2')).toBeDefined();
    });

    it('should set and update current user entry', () => {
        const { setCurrentUserEntry, updateUserEntry } = useLeaderboardStore.getState();

        setCurrentUserEntry(mockLeaderboardEntries[0]);

        let state = useLeaderboardStore.getState();
        expect(state.currentUserEntry).toEqual(mockLeaderboardEntries[0]);

        // Update current user entry
        updateUserEntry('1', { rank: 5, xp: 6000 });

        state = useLeaderboardStore.getState();
        expect(state.currentUserEntry?.rank).toBe(5);
        expect(state.currentUserEntry?.xp).toBe(6000);
    });

    it('should update user entry in entries list', () => {
        const { setEntries, updateUserEntry } = useLeaderboardStore.getState();

        setEntries(mockLeaderboardEntries);
        updateUserEntry('2', { rank: 1, xp: 5500 });

        const state = useLeaderboardStore.getState();
        const updatedUser = state.entries.find(e => e.userId === '2');
        expect(updatedUser?.rank).toBe(1);
        expect(updatedUser?.xp).toBe(5500);
    });

    it('should manage pagination state', () => {
        const { setCurrentPage, setTotalPages, setHasMore } = useLeaderboardStore.getState();

        setCurrentPage(2);
        setTotalPages(5);
        setHasMore(true);

        const state = useLeaderboardStore.getState();
        expect(state.currentPage).toBe(2);
        expect(state.totalPages).toBe(5);
        expect(state.hasMore).toBe(true);
    });

    it('should manage filter and sort settings', () => {
        const { setTimeframe, setSortBy, setSortOrder } = useLeaderboardStore.getState();

        setTimeframe('weekly');
        setSortBy('time');
        setSortOrder('asc');

        const state = useLeaderboardStore.getState();
        expect(state.timeframe).toBe('weekly');
        expect(state.sortBy).toBe('time');
        expect(state.sortOrder).toBe('asc');
    });

    it('should get user rank correctly', () => {
        const { setEntries, getUserRank } = useLeaderboardStore.getState();

        setEntries(mockLeaderboardEntries);

        expect(getUserRank('1')).toBe(1);
        expect(getUserRank('2')).toBe(2);
        expect(getUserRank('999')).toBeNull(); // Non-existent user
    });

    it('should get top users correctly', () => {
        const { setEntries, getTopUsers } = useLeaderboardStore.getState();

        setEntries(mockLeaderboardEntries);

        const top2Users = getTopUsers(2);
        expect(top2Users).toHaveLength(2);
        expect(top2Users[0].rank).toBe(1);
        expect(top2Users[1].rank).toBe(2);
    });

    it('should get users around rank correctly', () => {
        const { setEntries, getUsersAroundRank } = useLeaderboardStore.getState();

        setEntries(mockLeaderboardEntries);

        const usersAroundRank2 = getUsersAroundRank(2, 1);
        expect(usersAroundRank2).toHaveLength(3); // Ranks 1, 2, 3
        expect(usersAroundRank2[0].rank).toBe(1);
        expect(usersAroundRank2[1].rank).toBe(2);
        expect(usersAroundRank2[2].rank).toBe(3);
    });

    it('should calculate rank change correctly', () => {
        const { setEntries, getRankChange } = useLeaderboardStore.getState();

        setEntries(mockLeaderboardEntries);

        expect(getRankChange('1')).toBe(1); // Moved up from rank 2 to 1
        expect(getRankChange('2')).toBe(-1); // Moved down from rank 1 to 2
        expect(getRankChange('3')).toBe(0); // No change
        expect(getRankChange('999')).toBeNull(); // Non-existent user
    });

    it('should calculate analytics correctly', () => {
        const { setEntries, getTotalUsers, getAverageXP, getAverageTime } = useLeaderboardStore.getState();

        setEntries(mockLeaderboardEntries);

        expect(getTotalUsers()).toBe(3);
        expect(getAverageXP()).toBe(4000); // (5000 + 4000 + 3000) / 3
        expect(getAverageTime()).toBe(5400000); // Average of total times
    });

    it('should handle loading and error states', () => {
        const { setLoading, setError, clearError } = useLeaderboardStore.getState();

        // Test loading
        setLoading(true);
        expect(useLeaderboardStore.getState().isLoading).toBe(true);

        // Test error
        setError('Test error');
        let state = useLeaderboardStore.getState();
        expect(state.error).toBe('Test error');
        expect(state.isLoading).toBe(false);

        // Test clear error
        clearError();
        state = useLeaderboardStore.getState();
        expect(state.error).toBeNull();
    });

    it('should clear leaderboard correctly', () => {
        const { setEntries, setCurrentUserEntry, setCurrentPage, clearLeaderboard } = useLeaderboardStore.getState();

        setEntries(mockLeaderboardEntries);
        setCurrentUserEntry(mockLeaderboardEntries[0]);
        setCurrentPage(3);

        clearLeaderboard();

        const state = useLeaderboardStore.getState();
        expect(state.entries).toEqual([]);
        expect(state.currentUserEntry).toBeNull();
        expect(state.currentPage).toBe(1);
        expect(state.totalPages).toBe(1);
        expect(state.hasMore).toBe(false);
    });
});