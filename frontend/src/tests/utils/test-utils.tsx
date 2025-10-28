/**
 * Test Utilities for Component Testing
 * 
 * Utilities and helpers for unit and integration testing of React components
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    },
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({
        start: vi.fn(),
        stop: vi.fn(),
        set: vi.fn(),
    }),
    useInView: () => [vi.fn(), true],
}));

// Mock Zustand stores
export const mockUserStore = {
    user: {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://example.com/avatar.jpg',
        xp: 1250,
        level: 5,
        tasksCompleted: 42,
        unlockedBadges: ['first-timer'],
        tasks: [],
        completedTasks: [],
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
    fetchUser: vi.fn(),
};

export const mockTimerStore = {
    isActive: false,
    startTime: null,
    elapsedTime: 0,
    currentTask: null,
    history: [],
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    reset: vi.fn(),
    setCurrentTask: vi.fn(),
};

export const mockLeaderboardStore = {
    leaderboard: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    fetchLeaderboard: vi.fn(),
    nextPage: vi.fn(),
    previousPage: vi.fn(),
};

// Mock hooks
export const mockUseAccessibility = () => ({
    config: {
        respectReducedMotion: true,
        focusRingVisible: true,
        announcePageChanges: true,
    },
    preferences: {
        reducedMotion: false,
        highContrast: false,
        darkMode: false,
        fontSize: 16,
    },
    isReducedMotion: false,
    isHighContrast: false,
    isDarkMode: false,
    announce: vi.fn(),
    generateId: () => 'test-id-123',
    getAnimationDuration: () => 300,
});

export const mockUseResponsive = () => ({
    deviceType: 'desktop' as const,
    isDesktop: true,
    isMobile: false,
    isTablet: false,
    screenSize: { width: 1920, height: 1080 },
    breakpoints: {
        isSm: true,
        isMd: true,
        isLg: true,
        isXl: true,
        is2Xl: true,
        current: 'xl' as const,
    },
});

// Test wrapper component
interface TestWrapperProps {
    children: React.ReactNode;
    initialEntries?: string[];
}

const TestWrapper: React.FC<TestWrapperProps> = ({
    children,
    initialEntries = ['/'],
}) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    initialEntries?: string[];
}

export function renderWithProviders(
    ui: ReactElement,
    options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
    const { initialEntries, ...renderOptions } = options;

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <TestWrapper initialEntries={initialEntries}>
            {children}
        </TestWrapper>
    );

    const result = render(ui, { wrapper: Wrapper, ...renderOptions });

    return {
        ...result,
        user: userEvent.setup(),
    };
}

// Mock API responses
export const mockApiResponses = {
    user: {
        success: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            picture: 'https://example.com/avatar.jpg',
            xp: 1250,
            level: 5,
            tasksCompleted: 42,
            unlockedBadges: ['first-timer'],
            tasks: [],
            completedTasks: [],
        },
        error: {
            status: 500,
            message: 'Internal Server Error',
        },
    },
    leaderboard: {
        success: [
            {
                id: 'user-1',
                name: 'Alice Johnson',
                picture: 'https://example.com/alice.jpg',
                xp: 2500,
                level: 8,
                tasksCompleted: 75,
                rank: 1,
            },
            {
                id: 'user-123',
                name: 'Test User',
                picture: 'https://example.com/avatar.jpg',
                xp: 1250,
                level: 5,
                tasksCompleted: 42,
                rank: 2,
            },
        ],
        error: {
            status: 500,
            message: 'Failed to fetch leaderboard',
        },
    },
    analytics: {
        success: {
            totalTimeTracked: 86400,
            averageSessionLength: 3600,
            mostProductiveHour: 14,
            weeklyProgress: [
                { day: 'Mon', hours: 6 },
                { day: 'Tue', hours: 8 },
                { day: 'Wed', hours: 7 },
                { day: 'Thu', hours: 9 },
                { day: 'Fri', hours: 5 },
                { day: 'Sat', hours: 3 },
                { day: 'Sun', hours: 2 },
            ],
        },
        error: {
            status: 500,
            message: 'Failed to fetch analytics',
        },
    },
};

// Test data generators
export const createMockUser = (overrides = {}) => ({
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    picture: 'https://example.com/avatar.jpg',
    xp: 1250,
    level: 5,
    tasksCompleted: 42,
    unlockedBadges: ['first-timer'],
    tasks: [],
    completedTasks: [],
    ...overrides,
});

export const createMockTask = (overrides = {}) => ({
    id: `task-${Date.now()}`,
    title: 'Test Task',
    description: 'A test task for unit testing',
    completed: false,
    timeSpent: 0,
    deadline: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides,
});

export const createMockAchievement = (overrides = {}) => ({
    id: `achievement-${Date.now()}`,
    name: 'Test Achievement',
    description: 'A test achievement for unit testing',
    icon: '🏆',
    unlocked: false,
    unlockedAt: null,
    progress: 0,
    maxProgress: 100,
    category: 'general',
    ...overrides,
});

// Custom matchers for testing
export const customMatchers = {
    toBeAccessible: (received: HTMLElement) => {
        // Basic accessibility checks
        const hasAriaLabel = received.hasAttribute('aria-label') || received.hasAttribute('aria-labelledby');
        const hasRole = received.hasAttribute('role') || received.tagName.toLowerCase() in ['button', 'a', 'input', 'select', 'textarea'];

        if (received.tagName.toLowerCase() === 'img') {
            const hasAlt = received.hasAttribute('alt');
            return {
                message: () => `Expected image to have alt attribute`,
                pass: hasAlt,
            };
        }

        if (received.tagName.toLowerCase() === 'button' || received.getAttribute('role') === 'button') {
            const isAccessible = hasAriaLabel || received.textContent?.trim();
            return {
                message: () => `Expected button to have accessible name`,
                pass: !!isAccessible,
            };
        }

        return {
            message: () => `Expected element to be accessible`,
            pass: hasRole,
        };
    },

    toHaveValidHtml: (received: HTMLElement) => {
        // Check for common HTML validation issues
        const issues = [];

        // Check for missing alt text on images
        const images = received.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.hasAttribute('alt') && img.getAttribute('role') !== 'presentation') {
                issues.push(`Image at index ${index} missing alt attribute`);
            }
        });

        // Check for proper heading hierarchy
        const headings = Array.from(received.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let previousLevel = 0;
        headings.forEach((heading, index) => {
            const currentLevel = parseInt(heading.tagName.charAt(1));
            if (currentLevel > previousLevel + 1) {
                issues.push(`Heading hierarchy violation at index ${index}: ${heading.tagName} follows h${previousLevel}`);
            }
            previousLevel = currentLevel;
        });

        return {
            message: () => `HTML validation issues: ${issues.join(', ')}`,
            pass: issues.length === 0,
        };
    },
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
};

export const measureMemoryUsage = () => {
    if ((performance as any).memory) {
        return {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        };
    }
    return null;
};

// Animation testing utilities
export const waitForAnimation = (duration = 300) => {
    return new Promise(resolve => setTimeout(resolve, duration));
};

export const mockIntersectionObserver = () => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    return mockIntersectionObserver;
};

export const mockResizeObserver = () => {
    const mockResizeObserver = vi.fn();
    mockResizeObserver.mockReturnValue({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
    });
    window.ResizeObserver = mockResizeObserver;
    return mockResizeObserver;
};

// Cleanup utilities
export const cleanup = () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Reset document title
    document.title = 'Test';

    // Remove any added event listeners
    window.removeEventListener = vi.fn();
    document.removeEventListener = vi.fn();
};

// Export everything for easy importing
export * from '@testing-library/react';
export { userEvent };
export { renderWithProviders as render };