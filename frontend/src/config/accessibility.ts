/**
 * Accessibility Configuration
 * 
 * Central configuration for accessibility features and settings.
 */

export interface AccessibilityConfig {
    // Reduced motion preferences
    respectReducedMotion: boolean;

    // Focus management
    focusRingVisible: boolean;
    focusRingColor: string;

    // Screen reader announcements
    announcePageChanges: boolean;
    announceFormErrors: boolean;
    announceSuccessMessages: boolean;

    // Keyboard navigation
    enableKeyboardShortcuts: boolean;
    trapFocusInModals: boolean;

    // Color and contrast
    highContrastMode: boolean;
    minimumContrastRatio: number;

    // Touch and interaction
    minimumTouchTargetSize: number;

    // Text and typography
    respectFontSizePreferences: boolean;
    minimumFontSize: number;

    // Animation preferences
    animationDuration: {
        short: number;
        medium: number;
        long: number;
    };
}

export const defaultAccessibilityConfig: AccessibilityConfig = {
    respectReducedMotion: true,
    focusRingVisible: true,
    focusRingColor: '#3b82f6',
    announcePageChanges: true,
    announceFormErrors: true,
    announceSuccessMessages: true,
    enableKeyboardShortcuts: true,
    trapFocusInModals: true,
    highContrastMode: false,
    minimumContrastRatio: 4.5, // WCAG AA standard
    minimumTouchTargetSize: 44, // 44px minimum for touch targets
    respectFontSizePreferences: true,
    minimumFontSize: 16,
    animationDuration: {
        short: 150,
        medium: 300,
        long: 500,
    },
};

// ARIA labels and descriptions
export const ariaLabels = {
    // Navigation
    mainNavigation: 'Main navigation',
    breadcrumb: 'Breadcrumb navigation',
    pagination: 'Pagination navigation',
    skipToContent: 'Skip to main content',

    // Actions
    close: 'Close',
    open: 'Open',
    expand: 'Expand',
    collapse: 'Collapse',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',

    // Status
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',

    // Timer specific
    startTimer: 'Start timer',
    stopTimer: 'Stop timer',
    pauseTimer: 'Pause timer',
    resumeTimer: 'Resume timer',

    // Project specific
    createProject: 'Create new project',
    editProject: 'Edit project',
    deleteProject: 'Delete project',

    // Achievement specific
    viewAchievement: 'View achievement details',
    unlockedAchievement: 'Achievement unlocked',

    // XP and levels
    currentXP: 'Current experience points',
    currentLevel: 'Current level',
    xpProgress: 'Experience points progress',

    // Leaderboard
    userRank: 'User rank',
    leaderboardPosition: 'Position on leaderboard',
};

// Screen reader messages
export const screenReaderMessages = {
    // Page changes
    pageLoaded: (pageName: string) => `${pageName} page loaded`,

    // Timer messages
    timerStarted: 'Timer started',
    timerStopped: 'Timer stopped',
    timerPaused: 'Timer paused',
    timerResumed: 'Timer resumed',

    // XP and achievements
    xpGained: (amount: number) => `You gained ${amount} experience points`,
    levelUp: (level: number) => `Congratulations! You reached level ${level}`,
    achievementUnlocked: (name: string) => `Achievement unlocked: ${name}`,

    // Form feedback
    formSubmitted: 'Form submitted successfully',
    formError: 'Please correct the errors in the form',
    fieldRequired: 'This field is required',

    // Data updates
    dataLoaded: 'Data loaded successfully',
    dataUpdated: 'Data updated successfully',
    dataError: 'Error loading data',

    // Navigation
    navigationOpened: 'Navigation menu opened',
    navigationClosed: 'Navigation menu closed',
};

// Keyboard shortcuts
export const keyboardShortcuts = {
    // Global shortcuts
    openNavigation: 'Alt+N',
    skipToContent: 'Alt+S',
    openSearch: 'Alt+/',

    // Timer shortcuts
    startStopTimer: 'Space',
    pauseTimer: 'P',

    // Navigation shortcuts
    goToDashboard: 'Alt+D',
    goToProjects: 'Alt+P',
    goToLeaderboard: 'Alt+L',
    goToAchievements: 'Alt+A',

    // Modal shortcuts
    closeModal: 'Escape',
    confirmAction: 'Enter',

    // List navigation
    nextItem: 'ArrowDown',
    previousItem: 'ArrowUp',
    firstItem: 'Home',
    lastItem: 'End',
};

// Color contrast ratios for different elements
export const contrastRatios = {
    // WCAG AA (minimum)
    normalText: 4.5,
    largeText: 3.0,

    // WCAG AAA (enhanced)
    normalTextAAA: 7.0,
    largeTextAAA: 4.5,

    // UI components
    graphicalObjects: 3.0,
    userInterfaceComponents: 3.0,
};

// Touch target sizes for different contexts
export const touchTargetSizes = {
    minimum: 44, // WCAG minimum
    recommended: 48, // Material Design recommendation
    comfortable: 56, // Comfortable for most users
};

// Animation durations based on user preferences
export const getAnimationDuration = (
    type: 'short' | 'medium' | 'long',
    respectReducedMotion: boolean = true
): number => {
    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 0.01; // Nearly instant for reduced motion
    }

    return defaultAccessibilityConfig.animationDuration[type];
};

// Font size utilities
export const getFontSize = (
    baseSize: number,
    respectUserPreferences: boolean = true
): number => {
    if (!respectUserPreferences) {
        return baseSize;
    }

    // Check for user's font size preferences
    const userFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const defaultFontSize = 16; // Default browser font size
    const scaleFactor = userFontSize / defaultFontSize;

    return Math.max(baseSize * scaleFactor, defaultAccessibilityConfig.minimumFontSize);
};

// High contrast mode detection
export const isHighContrastMode = (): boolean => {
    // Check for Windows High Contrast mode
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        return true;
    }

    // Check for forced colors (Windows High Contrast)
    if (window.matchMedia('(forced-colors: active)').matches) {
        return true;
    }

    return false;
};

// Dark mode detection
export const isDarkMode = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Reduced motion detection
export const isReducedMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Export utility functions for common accessibility tasks
export const accessibilityUtils = {
    getAnimationDuration,
    getFontSize,
    isHighContrastMode,
    isDarkMode,
    isReducedMotion,

    // Generate unique IDs for ARIA relationships
    generateId: (prefix: string = 'a11y'): string => {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Create ARIA describedby string from array of IDs
    createDescribedBy: (ids: (string | undefined)[]): string => {
        return ids.filter(Boolean).join(' ');
    },

    // Announce message to screen readers
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    },
};