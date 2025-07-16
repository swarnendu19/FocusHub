// Utility functions for the gamified time tracker

/**
 * Format time duration in milliseconds to human readable format
 */
export const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
};

/**
 * Calculate XP needed for next level
 */
export const calculateXPForLevel = (level: number): number => {
    return level * 100 + (level - 1) * 50;
};

/**
 * Calculate current level from total XP
 */
export const calculateLevelFromXP = (totalXP: number): number => {
    let level = 1;
    let xpRequired = 0;

    while (xpRequired <= totalXP) {
        xpRequired += calculateXPForLevel(level);
        if (xpRequired <= totalXP) {
            level++;
        }
    }

    return level;
};

/**
 * Generate random color for projects
 */
export const generateProjectColor = (): string => {
    const colors = [
        '#58CC02', // Duolingo Green
        '#1CB0F6', // Duolingo Blue
        '#FF9600', // Orange
        '#FF4B4B', // Red
        '#FFC800', // Yellow
        '#9333EA', // Purple
        '#FF6B35', // Orange-red
        '#FFD700', // Gold
    ];

    return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};