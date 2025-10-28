import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    formatTime,
    formatDuration,
    formatDurationShort,
    msToMinutes,
    minutesToMs,
    getStartOfToday,
    getStartOfWeek,
    isToday,
    isThisWeek,
} from '../timeUtils';

describe('timeUtils', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Set a fixed date for consistent testing
        vi.setSystemTime(new Date('2024-01-15T15:30:00')); // Monday
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('formatTime', () => {
        it('formats seconds correctly (MM:SS)', () => {
            expect(formatTime(0)).toBe('00:00');
            expect(formatTime(30)).toBe('00:30');
            expect(formatTime(90)).toBe('01:30');
            expect(formatTime(3599)).toBe('59:59');
        });

        it('formats hours correctly (HH:MM:SS)', () => {
            expect(formatTime(3600)).toBe('01:00:00');
            expect(formatTime(3661)).toBe('01:01:01');
            expect(formatTime(7200)).toBe('02:00:00');
            expect(formatTime(36000)).toBe('10:00:00');
        });

        it('handles edge cases', () => {
            expect(formatTime(0)).toBe('00:00');
            expect(formatTime(1)).toBe('00:01');
            expect(formatTime(59)).toBe('00:59');
            expect(formatTime(60)).toBe('01:00');
        });
    });

    describe('formatDuration', () => {
        it('formats milliseconds to human readable format', () => {
            expect(formatDuration(0)).toBe('0s');
            expect(formatDuration(30000)).toBe('30s');
            expect(formatDuration(90000)).toBe('1m 30s');
            expect(formatDuration(3600000)).toBe('1h 0m 0s');
            expect(formatDuration(3661000)).toBe('1h 1m 1s');
        });

        it('handles minutes only', () => {
            expect(formatDuration(60000)).toBe('1m 0s');
            expect(formatDuration(300000)).toBe('5m 0s');
            expect(formatDuration(3540000)).toBe('59m 0s');
        });

        it('handles hours, minutes, and seconds', () => {
            expect(formatDuration(7323000)).toBe('2h 2m 3s');
            expect(formatDuration(36000000)).toBe('10h 0m 0s');
        });
    });

    describe('formatDurationShort', () => {
        it('formats milliseconds to short format', () => {
            expect(formatDurationShort(0)).toBe('0m');
            expect(formatDurationShort(30000)).toBe('0m');
            expect(formatDurationShort(60000)).toBe('1m');
            expect(formatDurationShort(90000)).toBe('1m');
            expect(formatDurationShort(3600000)).toBe('1h');
            expect(formatDurationShort(3660000)).toBe('1h 1m');
            expect(formatDurationShort(7200000)).toBe('2h');
        });

        it('handles edge cases', () => {
            expect(formatDurationShort(59999)).toBe('0m');
            expect(formatDurationShort(60000)).toBe('1m');
            expect(formatDurationShort(3599999)).toBe('59m');
            expect(formatDurationShort(3600000)).toBe('1h');
        });
    });

    describe('msToMinutes', () => {
        it('converts milliseconds to minutes correctly', () => {
            expect(msToMinutes(0)).toBe(0);
            expect(msToMinutes(60000)).toBe(1);
            expect(msToMinutes(90000)).toBe(1);
            expect(msToMinutes(120000)).toBe(2);
            expect(msToMinutes(3600000)).toBe(60);
        });

        it('floors the result', () => {
            expect(msToMinutes(59999)).toBe(0);
            expect(msToMinutes(119999)).toBe(1);
        });
    });

    describe('minutesToMs', () => {
        it('converts minutes to milliseconds correctly', () => {
            expect(minutesToMs(0)).toBe(0);
            expect(minutesToMs(1)).toBe(60000);
            expect(minutesToMs(2)).toBe(120000);
            expect(minutesToMs(60)).toBe(3600000);
        });

        it('handles decimal minutes', () => {
            expect(minutesToMs(0.5)).toBe(30000);
            expect(minutesToMs(1.5)).toBe(90000);
        });
    });

    describe('getStartOfToday', () => {
        it('returns start of current day', () => {
            const startOfToday = getStartOfToday();

            expect(startOfToday.getFullYear()).toBe(2024);
            expect(startOfToday.getMonth()).toBe(0); // January (0-indexed)
            expect(startOfToday.getDate()).toBe(15);
            expect(startOfToday.getHours()).toBe(0);
            expect(startOfToday.getMinutes()).toBe(0);
            expect(startOfToday.getSeconds()).toBe(0);
            expect(startOfToday.getMilliseconds()).toBe(0);
        });
    });

    describe('getStartOfWeek', () => {
        it('returns start of current week (Sunday)', () => {
            const startOfWeek = getStartOfWeek();

            expect(startOfWeek.getFullYear()).toBe(2024);
            expect(startOfWeek.getMonth()).toBe(0); // January
            expect(startOfWeek.getDate()).toBe(14); // Sunday before Monday 15th
            expect(startOfWeek.getDay()).toBe(0); // Sunday
            expect(startOfWeek.getHours()).toBe(0);
            expect(startOfWeek.getMinutes()).toBe(0);
            expect(startOfWeek.getSeconds()).toBe(0);
            expect(startOfWeek.getMilliseconds()).toBe(0);
        });

        it('handles when current day is Sunday', () => {
            vi.setSystemTime(new Date('2024-01-14T15:30:00')); // Sunday

            const startOfWeek = getStartOfWeek();
            expect(startOfWeek.getDate()).toBe(14);
            expect(startOfWeek.getDay()).toBe(0);
        });
    });

    describe('isToday', () => {
        it('returns true for today\'s date', () => {
            const today = new Date('2024-01-15T10:00:00');
            const todayEvening = new Date('2024-01-15T23:59:59');

            expect(isToday(today)).toBe(true);
            expect(isToday(todayEvening)).toBe(true);
        });

        it('returns false for other dates', () => {
            const yesterday = new Date('2024-01-14T15:30:00');
            const tomorrow = new Date('2024-01-16T15:30:00');
            const lastYear = new Date('2023-01-15T15:30:00');

            expect(isToday(yesterday)).toBe(false);
            expect(isToday(tomorrow)).toBe(false);
            expect(isToday(lastYear)).toBe(false);
        });
    });

    describe('isThisWeek', () => {
        it('returns true for dates in current week', () => {
            const sunday = new Date('2024-01-14T10:00:00'); // Start of week
            const monday = new Date('2024-01-15T10:00:00'); // Today
            const saturday = new Date('2024-01-20T10:00:00'); // End of week

            expect(isThisWeek(sunday)).toBe(true);
            expect(isThisWeek(monday)).toBe(true);
            expect(isThisWeek(saturday)).toBe(true);
        });

        it('returns false for dates outside current week', () => {
            const lastWeek = new Date('2024-01-13T10:00:00'); // Saturday before
            const nextWeek = new Date('2024-01-21T10:00:00'); // Sunday after
            const lastYear = new Date('2023-01-15T10:00:00');

            expect(isThisWeek(lastWeek)).toBe(false);
            expect(isThisWeek(nextWeek)).toBe(false);
            expect(isThisWeek(lastYear)).toBe(false);
        });

        it('handles edge cases correctly', () => {
            // Last second of Saturday (end of week)
            const endOfWeek = new Date('2024-01-20T23:59:59');
            // First second of next Sunday
            const startOfNextWeek = new Date('2024-01-21T00:00:00');

            expect(isThisWeek(endOfWeek)).toBe(true);
            expect(isThisWeek(startOfNextWeek)).toBe(false);
        });
    });

    describe('integration tests', () => {
        it('works correctly with different time zones', () => {
            // Test with a date that might cross timezone boundaries
            const date = new Date('2024-01-15T00:30:00');

            expect(isToday(date)).toBe(true);
            expect(isThisWeek(date)).toBe(true);
        });

        it('handles leap year correctly', () => {
            vi.setSystemTime(new Date('2024-02-29T15:30:00')); // Leap year

            const today = getStartOfToday();
            expect(today.getDate()).toBe(29);
            expect(today.getMonth()).toBe(1); // February

            const testDate = new Date('2024-02-29T10:00:00');
            expect(isToday(testDate)).toBe(true);
        });

        it('handles year boundaries correctly', () => {
            vi.setSystemTime(new Date('2024-01-01T15:30:00')); // New Year's Day

            const lastYear = new Date('2023-12-31T23:59:59');
            const thisYear = new Date('2024-01-01T00:00:01');

            expect(isToday(lastYear)).toBe(false);
            expect(isToday(thisYear)).toBe(true);
        });
    });
});