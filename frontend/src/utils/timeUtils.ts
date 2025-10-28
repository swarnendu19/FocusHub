/**
 * Formats a duration in milliseconds to a short human-readable string
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted string like "2h 30m", "45m", "1h"
 */
export function formatDurationShort(milliseconds: number): string {
    if (milliseconds <= 0) return '0m';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        if (minutes > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${hours}h`;
    }

    return `${minutes}m`;
}

/**
 * Formats a duration in milliseconds to a detailed human-readable string
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted string like "2 hours 30 minutes", "45 minutes", "1 hour"
 */
export function formatDurationLong(milliseconds: number): string {
    if (milliseconds <= 0) return '0 minutes';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts: string[] = [];

    if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }

    return parts.join(' ');
}

/**
 * Formats a date to a human-readable string
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Formats a date to a relative time string (e.g., "2 days ago", "just now")
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return 'just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
        return formatDate(dateObj);
    }
}

/**
 * Converts milliseconds to hours as a decimal
 * @param milliseconds - Duration in milliseconds
 * @returns Hours as decimal (e.g., 1.5 for 1 hour 30 minutes)
 */
export function millisecondsToHours(milliseconds: number): number {
    return milliseconds / (1000 * 60 * 60);
}

/**
 * Converts hours to milliseconds
 * @param hours - Hours as decimal
 * @returns Duration in milliseconds
 */
export function hoursToMilliseconds(hours: number): number {
    return hours * 1000 * 60 * 60;
}

/**
 * Formats time for display in timer (HH:MM:SS)
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted time string like "01:23:45"
 */
export function formatTimerDisplay(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Gets the start of day for a given date
 * @param date - Date object or ISO string
 * @returns Date object set to start of day (00:00:00)
 */
export function getStartOfDay(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj;
}

/**
 * Gets the end of day for a given date
 * @param date - Date object or ISO string
 * @returns Date object set to end of day (23:59:59.999)
 */
export function getEndOfDay(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    dateObj.setHours(23, 59, 59, 999);
    return dateObj;
}

/**
 * Gets the start of week for a given date (Monday)
 * @param date - Date object or ISO string
 * @returns Date object set to start of week
 */
export function getStartOfWeek(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    const day = dateObj.getDay();
    const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const startOfWeek = new Date(dateObj.setDate(diff));
    return getStartOfDay(startOfWeek);
}

/**
 * Gets the start of month for a given date
 * @param date - Date object or ISO string
 * @returns Date object set to start of month
 */
export function getStartOfMonth(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
}