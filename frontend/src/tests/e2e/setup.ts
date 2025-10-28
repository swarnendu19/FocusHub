/**
 * End-to-End Testing Setup
 * 
 * Configuration and utilities for E2E testing with Playwright
 */

import { test as base, expect, Page, BrowserContext } from '@playwright/test';

// Extend the base test with custom fixtures
export const test = base.extend<{
    authenticatedPage: Page;
    mockApiResponses: void;
}>({
    // Fixture for authenticated user session
    authenticatedPage: async ({ page, context }, use) => {
        // Mock authentication state
        await context.addCookies([
            {
                name: 'session',
                value: 'mock-session-token',
                domain: 'localhost',
                path: '/',
                httpOnly: true,
                secure: false,
            },
        ]);

        // Navigate to the app
        await page.goto('/');

        // Wait for authentication to be processed
        await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 });

        await use(page);
    },

    // Fixture for mocking API responses
    mockApiResponses: async ({ page }, use) => {
        // Mock user data
        await page.route('**/api/auth/current_user', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'user-123',
                    name: 'Test User',
                    email: 'test@example.com',
                    picture: 'https://example.com/avatar.jpg',
                    xp: 1250,
                    level: 5,
                    tasksCompleted: 42,
                    unlockedBadges: ['first-timer', 'speed-demon'],
                    tasks: [
                        {
                            id: 'task-1',
                            title: 'Complete project setup',
                            description: 'Set up the initial project structure',
                            completed: false,
                            timeSpent: 3600,
                            deadline: new Date(Date.now() + 86400000).toISOString(),
                        },
                        {
                            id: 'task-2',
                            title: 'Write documentation',
                            description: 'Document the API endpoints',
                            completed: true,
                            timeSpent: 7200,
                            deadline: new Date(Date.now() - 86400000).toISOString(),
                        },
                    ],
                    completedTasks: [
                        {
                            id: 'task-completed-1',
                            title: 'Initial setup',
                            description: 'Set up development environment',
                            completed: true,
                            timeSpent: 1800,
                            completedAt: new Date(Date.now() - 172800000).toISOString(),
                        },
                    ],
                }),
            });
        });

        // Mock leaderboard data
        await page.route('**/api/leaderboard*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
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
                    {
                        id: 'user-3',
                        name: 'Bob Smith',
                        picture: 'https://example.com/bob.jpg',
                        xp: 800,
                        level: 3,
                        tasksCompleted: 28,
                        rank: 3,
                    },
                ]),
            });
        });

        // Mock analytics data
        await page.route('**/api/analytics*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
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
                }),
            });
        });

        await use();
    },
});

// Custom expect matchers
export { expect };

// Utility functions for E2E tests
export class TestUtils {
    constructor(private page: Page) { }

    // Wait for element to be visible and stable
    async waitForStableElement(selector: string, timeout = 5000) {
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
        await this.page.waitForTimeout(100); // Small delay for animations
    }

    // Take screenshot with consistent naming
    async takeScreenshot(name: string) {
        await this.page.screenshot({
            path: `test-results/screenshots/${name}.png`,
            fullPage: true,
        });
    }

    // Start timer and verify it's running
    async startTimer() {
        await this.page.click('[data-testid="start-timer-button"]');
        await this.waitForStableElement('[data-testid="active-timer"]');

        // Verify timer is actually running
        const timerText = await this.page.textContent('[data-testid="timer-display"]');
        expect(timerText).toMatch(/\d{2}:\d{2}:\d{2}/);
    }

    // Stop timer and verify it's stopped
    async stopTimer() {
        await this.page.click('[data-testid="stop-timer-button"]');
        await this.page.waitForSelector('[data-testid="active-timer"]', { state: 'hidden' });
    }

    // Create a new task
    async createTask(title: string, description?: string) {
        await this.page.click('[data-testid="create-task-button"]');
        await this.waitForStableElement('[data-testid="task-modal"]');

        await this.page.fill('[data-testid="task-title-input"]', title);
        if (description) {
            await this.page.fill('[data-testid="task-description-input"]', description);
        }

        await this.page.click('[data-testid="save-task-button"]');
        await this.page.waitForSelector('[data-testid="task-modal"]', { state: 'hidden' });
    }

    // Navigate to a specific page
    async navigateTo(page: 'dashboard' | 'projects' | 'leaderboard' | 'achievements' | 'skills' | 'profile') {
        const routes = {
            dashboard: '/',
            projects: '/projects',
            leaderboard: '/leaderboard',
            achievements: '/achievements',
            skills: '/skills',
            profile: '/profile',
        };

        await this.page.goto(routes[page]);
        await this.waitForStableElement(`[data-testid="${page}"]`);
    }

    // Check for accessibility violations
    async checkAccessibility() {
        // This would integrate with axe-playwright
        // For now, we'll do basic checks

        // Check for missing alt text on images
        const images = await this.page.locator('img').all();
        for (const img of images) {
            const alt = await img.getAttribute('alt');
            const role = await img.getAttribute('role');

            if (alt === null && role !== 'presentation') {
                throw new Error('Image missing alt text');
            }
        }

        // Check for proper heading hierarchy
        const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
        let previousLevel = 0;

        for (const heading of headings) {
            const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
            const currentLevel = parseInt(tagName.charAt(1));

            if (currentLevel > previousLevel + 1) {
                throw new Error(`Heading hierarchy violation: ${tagName} follows h${previousLevel}`);
            }

            previousLevel = currentLevel;
        }
    }

    // Performance monitoring
    async measurePageLoad() {
        const startTime = Date.now();
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
        const endTime = Date.now();

        return endTime - startTime;
    }

    // Check for console errors
    async checkConsoleErrors() {
        const errors: string[] = [];

        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        return errors;
    }

    // Simulate network conditions
    async simulateSlowNetwork() {
        const context = this.page.context();
        await context.route('**/*', async route => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
            await route.continue();
        });
    }

    // Test responsive behavior
    async testResponsive() {
        const viewports = [
            { width: 375, height: 667, name: 'mobile' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 1920, height: 1080, name: 'desktop' },
        ];

        const results = [];

        for (const viewport of viewports) {
            await this.page.setViewportSize(viewport);
            await this.page.waitForTimeout(500); // Wait for responsive changes

            const screenshot = await this.page.screenshot();
            results.push({
                viewport: viewport.name,
                screenshot,
                dimensions: viewport,
            });
        }

        return results;
    }
}

// Global test configuration
export const testConfig = {
    baseURL: 'http://localhost:5173',
    timeout: 30000,
    retries: 2,
    workers: 4,
};

// Mock data generators
export const mockData = {
    user: (overrides = {}) => ({
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://example.com/avatar.jpg',
        xp: 1250,
        level: 5,
        tasksCompleted: 42,
        unlockedBadges: ['first-timer'],
        ...overrides,
    }),

    task: (overrides = {}) => ({
        id: `task-${Date.now()}`,
        title: 'Test Task',
        description: 'A test task for E2E testing',
        completed: false,
        timeSpent: 0,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        ...overrides,
    }),

    leaderboardEntry: (overrides = {}) => ({
        id: `user-${Date.now()}`,
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
        xp: 1000,
        level: 4,
        tasksCompleted: 30,
        rank: 1,
        ...overrides,
    }),
};