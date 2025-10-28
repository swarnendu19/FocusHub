/**
 * End-to-End Tests for Critical User Flows
 * 
 * Tests the main user journeys through the application
 */

import { test, expect, TestUtils } from './setup';

test.describe('Critical User Flows', () => {
    test.beforeEach(async ({ mockApiResponses }) => {
        // Ensure API mocks are set up for each test
    });

    test.describe('Authentication Flow', () => {
        test('should redirect unauthenticated users to login', async ({ page }) => {
            await page.goto('/');
            await expect(page).toHaveURL(/.*\/login/);

            // Check login page elements
            await expect(page.locator('[data-testid="login-page"]')).toBeVisible();
            await expect(page.locator('[data-testid="google-oauth-button"]')).toBeVisible();
        });

        test('should allow authenticated users to access dashboard', async ({ authenticatedPage }) => {
            await expect(authenticatedPage).toHaveURL('/');
            await expect(authenticatedPage.locator('[data-testid="dashboard"]')).toBeVisible();
        });

        test('should handle logout flow', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to profile and logout
            await utils.navigateTo('profile');
            await authenticatedPage.click('[data-testid="logout-button"]');

            // Should redirect to login
            await expect(authenticatedPage).toHaveURL(/.*\/login/);
        });
    });

    test.describe('Timer Functionality', () => {
        test('should start and stop timer successfully', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Start timer
            await utils.startTimer();

            // Verify timer is running
            await expect(authenticatedPage.locator('[data-testid="timer-status"]')).toHaveText('Running');

            // Wait a moment and check time has progressed
            await authenticatedPage.waitForTimeout(2000);
            const timerDisplay = authenticatedPage.locator('[data-testid="timer-display"]');
            await expect(timerDisplay).not.toHaveText('00:00:00');

            // Stop timer
            await utils.stopTimer();

            // Verify timer is stopped
            await expect(authenticatedPage.locator('[data-testid="timer-status"]')).toHaveText('Stopped');
        });

        test('should persist timer across page refreshes', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Start timer
            await utils.startTimer();

            // Refresh page
            await authenticatedPage.reload();
            await utils.waitForStableElement('[data-testid="dashboard"]');

            // Timer should still be running
            await expect(authenticatedPage.locator('[data-testid="active-timer"]')).toBeVisible();
            await expect(authenticatedPage.locator('[data-testid="timer-status"]')).toHaveText('Running');
        });

        test('should show timer notifications', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Start timer
            await utils.startTimer();

            // Check for notification
            await expect(authenticatedPage.locator('[data-testid="timer-notification"]')).toBeVisible();
            await expect(authenticatedPage.locator('[data-testid="timer-notification"]')).toContainText('Timer started');
        });
    });

    test.describe('Task Management Flow', () => {
        test('should create a new task', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to projects
            await utils.navigateTo('projects');

            // Create new task
            await utils.createTask('E2E Test Task', 'This is a test task created by E2E tests');

            // Verify task appears in list
            await expect(authenticatedPage.locator('[data-testid="task-list"]')).toContainText('E2E Test Task');
        });

        test('should edit an existing task', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to projects
            await utils.navigateTo('projects');

            // Click edit on first task
            await authenticatedPage.click('[data-testid="task-card"]:first-child [data-testid="edit-task-button"]');
            await utils.waitForStableElement('[data-testid="task-modal"]');

            // Update task title
            await authenticatedPage.fill('[data-testid="task-title-input"]', 'Updated Task Title');
            await authenticatedPage.click('[data-testid="save-task-button"]');

            // Verify task is updated
            await expect(authenticatedPage.locator('[data-testid="task-list"]')).toContainText('Updated Task Title');
        });

        test('should complete a task and gain XP', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to projects
            await utils.navigateTo('projects');

            // Get initial XP
            const initialXP = await authenticatedPage.locator('[data-testid="user-xp"]').textContent();

            // Complete first task
            await authenticatedPage.click('[data-testid="task-card"]:first-child [data-testid="complete-task-button"]');

            // Check for XP gain notification
            await expect(authenticatedPage.locator('[data-testid="xp-notification"]')).toBeVisible();

            // Verify XP has increased
            await expect(authenticatedPage.locator('[data-testid="user-xp"]')).not.toHaveText(initialXP || '');
        });

        test('should track time on a specific task', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to projects
            await utils.navigateTo('projects');

            // Start timer on specific task
            await authenticatedPage.click('[data-testid="task-card"]:first-child [data-testid="start-task-timer-button"]');

            // Verify task timer is active
            await expect(authenticatedPage.locator('[data-testid="task-timer-active"]')).toBeVisible();

            // Wait and stop timer
            await authenticatedPage.waitForTimeout(3000);
            await authenticatedPage.click('[data-testid="stop-task-timer-button"]');

            // Verify time was tracked
            const timeSpent = await authenticatedPage.locator('[data-testid="task-time-spent"]').textContent();
            expect(timeSpent).toMatch(/\d+:\d+/);
        });
    });

    test.describe('Navigation and UI Flow', () => {
        test('should navigate between all main pages', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            const pages = ['dashboard', 'projects', 'leaderboard', 'achievements', 'skills', 'profile'] as const;

            for (const page of pages) {
                await utils.navigateTo(page);
                await expect(authenticatedPage.locator(`[data-testid="${page}"]`)).toBeVisible();

                // Check page title
                const title = await authenticatedPage.title();
                expect(title).toContain('FocusHub');
            }
        });

        test('should show responsive navigation on mobile', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Set mobile viewport
            await authenticatedPage.setViewportSize({ width: 375, height: 667 });

            // Check mobile menu button is visible
            await expect(authenticatedPage.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

            // Open mobile menu
            await authenticatedPage.click('[data-testid="mobile-menu-button"]');
            await expect(authenticatedPage.locator('[data-testid="mobile-menu"]')).toBeVisible();

            // Navigate using mobile menu
            await authenticatedPage.click('[data-testid="mobile-menu"] [href="/projects"]');
            await utils.waitForStableElement('[data-testid="projects"]');
        });

        test('should handle keyboard navigation', async ({ authenticatedPage }) => {
            // Test Tab navigation
            await authenticatedPage.keyboard.press('Tab');

            // Should focus on skip link
            await expect(authenticatedPage.locator(':focus')).toHaveAttribute('href', '#main-content');

            // Continue tabbing through interactive elements
            await authenticatedPage.keyboard.press('Tab');
            await authenticatedPage.keyboard.press('Tab');

            // Test Enter key activation
            await authenticatedPage.keyboard.press('Enter');
        });
    });

    test.describe('Leaderboard and Social Features', () => {
        test('should display leaderboard with user rankings', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to leaderboard
            await utils.navigateTo('leaderboard');

            // Check leaderboard table
            await expect(authenticatedPage.locator('[data-testid="leaderboard-table"]')).toBeVisible();

            // Verify user rankings
            const rankings = authenticatedPage.locator('[data-testid="leaderboard-row"]');
            await expect(rankings).toHaveCount(3);

            // Check current user is highlighted
            await expect(authenticatedPage.locator('[data-testid="current-user-row"]')).toBeVisible();
        });

        test('should show user profile preview on hover', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to leaderboard
            await utils.navigateTo('leaderboard');

            // Hover over user name
            await authenticatedPage.hover('[data-testid="leaderboard-row"]:first-child [data-testid="user-name"]');

            // Check profile preview appears
            await expect(authenticatedPage.locator('[data-testid="user-profile-preview"]')).toBeVisible();
        });
    });

    test.describe('Achievement System', () => {
        test('should display achievement grid', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to achievements
            await utils.navigateTo('achievements');

            // Check achievement grid
            await expect(authenticatedPage.locator('[data-testid="achievement-grid"]')).toBeVisible();

            // Verify achievement cards
            const achievements = authenticatedPage.locator('[data-testid="achievement-card"]');
            await expect(achievements.first()).toBeVisible();
        });

        test('should show achievement details modal', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to achievements
            await utils.navigateTo('achievements');

            // Click on achievement
            await authenticatedPage.click('[data-testid="achievement-card"]:first-child');

            // Check modal appears
            await expect(authenticatedPage.locator('[data-testid="achievement-modal"]')).toBeVisible();

            // Close modal
            await authenticatedPage.keyboard.press('Escape');
            await expect(authenticatedPage.locator('[data-testid="achievement-modal"]')).not.toBeVisible();
        });
    });

    test.describe('XP and Level Progression', () => {
        test('should display XP progress bar', async ({ authenticatedPage }) => {
            // Check XP progress bar is visible
            await expect(authenticatedPage.locator('[data-testid="xp-progress-bar"]')).toBeVisible();

            // Verify current level display
            await expect(authenticatedPage.locator('[data-testid="current-level"]')).toContainText('5');
        });

        test('should show level up celebration', async ({ authenticatedPage }) => {
            // This would require mocking a level up scenario
            // For now, we'll test the static elements

            // Navigate to XP page
            const utils = new TestUtils(authenticatedPage);
            await utils.navigateTo('profile');

            // Check XP history
            await expect(authenticatedPage.locator('[data-testid="xp-history"]')).toBeVisible();
        });
    });

    test.describe('Skills and Progression', () => {
        test('should display skill tree', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to skills
            await utils.navigateTo('skills');

            // Check skill tree is visible
            await expect(authenticatedPage.locator('[data-testid="skill-tree"]')).toBeVisible();

            // Verify skill nodes
            const skillNodes = authenticatedPage.locator('[data-testid="skill-node"]');
            await expect(skillNodes.first()).toBeVisible();
        });

        test('should show skill details on click', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to skills
            await utils.navigateTo('skills');

            // Click on skill node
            await authenticatedPage.click('[data-testid="skill-node"]:first-child');

            // Check skill modal
            await expect(authenticatedPage.locator('[data-testid="skill-modal"]')).toBeVisible();
        });
    });

    test.describe('Error Handling', () => {
        test('should handle API errors gracefully', async ({ page }) => {
            // Mock API error
            await page.route('**/api/auth/current_user', route => {
                route.fulfill({ status: 500, body: 'Internal Server Error' });
            });

            await page.goto('/');

            // Should show error message
            await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
        });

        test('should handle network offline state', async ({ authenticatedPage }) => {
            // Simulate offline
            await authenticatedPage.context().setOffline(true);

            // Try to perform an action
            await authenticatedPage.click('[data-testid="refresh-button"]');

            // Should show offline message
            await expect(authenticatedPage.locator('[data-testid="offline-message"]')).toBeVisible();
        });
    });

    test.describe('Performance and Loading', () => {
        test('should load dashboard within acceptable time', async ({ page }) => {
            const utils = new TestUtils(page);

            const loadTime = await utils.measurePageLoad();
            expect(loadTime).toBeLessThan(3000); // 3 seconds max
        });

        test('should show loading states', async ({ page }) => {
            // Mock slow API response
            await page.route('**/api/auth/current_user', async route => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await route.continue();
            });

            await page.goto('/');

            // Should show loading spinner
            await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
        });
    });
});