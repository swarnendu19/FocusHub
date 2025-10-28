/**
 * Visual Regression Tests
 * 
 * Tests to ensure UI components render consistently across changes
 */

import { test, expect, TestUtils } from '../e2e/setup';

test.describe('Visual Regression Tests', () => {
    test.beforeEach(async ({ mockApiResponses }) => {
        // Ensure consistent API responses for visual tests
    });

    test.describe('Dashboard Components', () => {
        test('should render dashboard layout consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Wait for all content to load
            await utils.waitForStableElement('[data-testid="dashboard"]');
            await authenticatedPage.waitForTimeout(1000); // Wait for animations

            // Take full page screenshot
            await expect(authenticatedPage).toHaveScreenshot('dashboard-full.png', {
                fullPage: true,
                animations: 'disabled',
            });
        });

        test('should render timer component consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Focus on timer component
            const timerComponent = authenticatedPage.locator('[data-testid="timer-component"]');
            await expect(timerComponent).toBeVisible();

            // Screenshot timer in idle state
            await expect(timerComponent).toHaveScreenshot('timer-idle.png');

            // Start timer and screenshot active state
            await utils.startTimer();
            await authenticatedPage.waitForTimeout(500);
            await expect(timerComponent).toHaveScreenshot('timer-active.png');
        });

        test('should render progress indicators consistently', async ({ authenticatedPage }) => {
            const progressSection = authenticatedPage.locator('[data-testid="progress-section"]');
            await expect(progressSection).toBeVisible();

            await expect(progressSection).toHaveScreenshot('progress-indicators.png');
        });

        test('should render quick stats cards consistently', async ({ authenticatedPage }) => {
            const statsCards = authenticatedPage.locator('[data-testid="stats-cards"]');
            await expect(statsCards).toBeVisible();

            await expect(statsCards).toHaveScreenshot('stats-cards.png');
        });
    });

    test.describe('Task Management Components', () => {
        test('should render task grid consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('projects');
            await utils.waitForStableElement('[data-testid="task-grid"]');

            const taskGrid = authenticatedPage.locator('[data-testid="task-grid"]');
            await expect(taskGrid).toHaveScreenshot('task-grid.png');
        });

        test('should render task cards consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('projects');

            // Screenshot individual task card
            const taskCard = authenticatedPage.locator('[data-testid="task-card"]').first();
            await expect(taskCard).toHaveScreenshot('task-card.png');

            // Screenshot task card on hover
            await taskCard.hover();
            await authenticatedPage.waitForTimeout(300);
            await expect(taskCard).toHaveScreenshot('task-card-hover.png');
        });

        test('should render task creation modal consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('projects');
            await authenticatedPage.click('[data-testid="create-task-button"]');
            await utils.waitForStableElement('[data-testid="task-modal"]');

            const modal = authenticatedPage.locator('[data-testid="task-modal"]');
            await expect(modal).toHaveScreenshot('task-creation-modal.png');
        });
    });

    test.describe('Navigation Components', () => {
        test('should render desktop navigation consistently', async ({ authenticatedPage }) => {
            // Set desktop viewport
            await authenticatedPage.setViewportSize({ width: 1920, height: 1080 });

            const navigation = authenticatedPage.locator('[data-testid="desktop-navigation"]');
            await expect(navigation).toHaveScreenshot('desktop-navigation.png');
        });

        test('should render mobile navigation consistently', async ({ authenticatedPage }) => {
            // Set mobile viewport
            await authenticatedPage.setViewportSize({ width: 375, height: 667 });

            // Screenshot mobile header
            const mobileHeader = authenticatedPage.locator('[data-testid="mobile-header"]');
            await expect(mobileHeader).toHaveScreenshot('mobile-header.png');

            // Open mobile menu and screenshot
            await authenticatedPage.click('[data-testid="mobile-menu-button"]');
            await authenticatedPage.waitForTimeout(300);

            const mobileMenu = authenticatedPage.locator('[data-testid="mobile-menu"]');
            await expect(mobileMenu).toHaveScreenshot('mobile-menu.png');
        });

        test('should render bottom navigation consistently', async ({ authenticatedPage }) => {
            // Set mobile viewport
            await authenticatedPage.setViewportSize({ width: 375, height: 667 });

            const bottomNav = authenticatedPage.locator('[data-testid="bottom-navigation"]');
            await expect(bottomNav).toHaveScreenshot('bottom-navigation.png');
        });
    });

    test.describe('Leaderboard Components', () => {
        test('should render leaderboard table consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('leaderboard');
            await utils.waitForStableElement('[data-testid="leaderboard-table"]');

            const leaderboard = authenticatedPage.locator('[data-testid="leaderboard-table"]');
            await expect(leaderboard).toHaveScreenshot('leaderboard-table.png');
        });

        test('should render user profile preview consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('leaderboard');

            // Hover to show profile preview
            await authenticatedPage.hover('[data-testid="leaderboard-row"]:first-child [data-testid="user-name"]');
            await authenticatedPage.waitForTimeout(300);

            const profilePreview = authenticatedPage.locator('[data-testid="user-profile-preview"]');
            await expect(profilePreview).toHaveScreenshot('user-profile-preview.png');
        });
    });

    test.describe('Achievement Components', () => {
        test('should render achievement grid consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('achievements');
            await utils.waitForStableElement('[data-testid="achievement-grid"]');

            const achievementGrid = authenticatedPage.locator('[data-testid="achievement-grid"]');
            await expect(achievementGrid).toHaveScreenshot('achievement-grid.png');
        });

        test('should render achievement cards consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('achievements');

            // Screenshot unlocked achievement
            const unlockedAchievement = authenticatedPage.locator('[data-testid="achievement-card"][data-status="unlocked"]').first();
            await expect(unlockedAchievement).toHaveScreenshot('achievement-unlocked.png');

            // Screenshot locked achievement
            const lockedAchievement = authenticatedPage.locator('[data-testid="achievement-card"][data-status="locked"]').first();
            await expect(lockedAchievement).toHaveScreenshot('achievement-locked.png');
        });

        test('should render achievement modal consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('achievements');
            await authenticatedPage.click('[data-testid="achievement-card"]:first-child');
            await utils.waitForStableElement('[data-testid="achievement-modal"]');

            const modal = authenticatedPage.locator('[data-testid="achievement-modal"]');
            await expect(modal).toHaveScreenshot('achievement-modal.png');
        });
    });

    test.describe('Skills Components', () => {
        test('should render skill tree consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('skills');
            await utils.waitForStableElement('[data-testid="skill-tree"]');

            const skillTree = authenticatedPage.locator('[data-testid="skill-tree"]');
            await expect(skillTree).toHaveScreenshot('skill-tree.png');
        });

        test('should render skill nodes consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('skills');

            // Screenshot available skill node
            const availableSkill = authenticatedPage.locator('[data-testid="skill-node"][data-status="available"]').first();
            await expect(availableSkill).toHaveScreenshot('skill-node-available.png');

            // Screenshot unlocked skill node
            const unlockedSkill = authenticatedPage.locator('[data-testid="skill-node"][data-status="unlocked"]').first();
            await expect(unlockedSkill).toHaveScreenshot('skill-node-unlocked.png');

            // Screenshot locked skill node
            const lockedSkill = authenticatedPage.locator('[data-testid="skill-node"][data-status="locked"]').first();
            await expect(lockedSkill).toHaveScreenshot('skill-node-locked.png');
        });
    });

    test.describe('Form Components', () => {
        test('should render form inputs consistently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('projects');
            await authenticatedPage.click('[data-testid="create-task-button"]');
            await utils.waitForStableElement('[data-testid="task-modal"]');

            // Screenshot form inputs
            const formInputs = authenticatedPage.locator('[data-testid="task-form"]');
            await expect(formInputs).toHaveScreenshot('form-inputs.png');

            // Screenshot form with validation errors
            await authenticatedPage.click('[data-testid="save-task-button"]');
            await authenticatedPage.waitForTimeout(300);
            await expect(formInputs).toHaveScreenshot('form-inputs-error.png');
        });
    });

    test.describe('Loading States', () => {
        test('should render loading skeletons consistently', async ({ page }) => {
            // Mock slow API response
            await page.route('**/api/auth/current_user', async route => {
                await new Promise(resolve => setTimeout(resolve, 5000));
                await route.continue();
            });

            await page.goto('/');

            // Screenshot loading state
            const loadingSkeleton = page.locator('[data-testid="loading-skeleton"]');
            await expect(loadingSkeleton).toHaveScreenshot('loading-skeleton.png');
        });

        test('should render loading spinners consistently', async ({ authenticatedPage }) => {
            // Trigger loading state
            await authenticatedPage.click('[data-testid="refresh-button"]');

            const loadingSpinner = authenticatedPage.locator('[data-testid="loading-spinner"]');
            await expect(loadingSpinner).toHaveScreenshot('loading-spinner.png');
        });
    });

    test.describe('Error States', () => {
        test('should render error messages consistently', async ({ page }) => {
            // Mock API error
            await page.route('**/api/auth/current_user', route => {
                route.fulfill({ status: 500, body: 'Internal Server Error' });
            });

            await page.goto('/');

            const errorMessage = page.locator('[data-testid="error-message"]');
            await expect(errorMessage).toHaveScreenshot('error-message.png');
        });

        test('should render offline state consistently', async ({ authenticatedPage }) => {
            // Simulate offline
            await authenticatedPage.context().setOffline(true);
            await authenticatedPage.reload();

            const offlineMessage = authenticatedPage.locator('[data-testid="offline-message"]');
            await expect(offlineMessage).toHaveScreenshot('offline-message.png');
        });
    });

    test.describe('Responsive Design', () => {
        const viewports = [
            { width: 375, height: 667, name: 'mobile' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 1920, height: 1080, name: 'desktop' },
        ];

        for (const viewport of viewports) {
            test(`should render dashboard consistently on ${viewport.name}`, async ({ authenticatedPage }) => {
                await authenticatedPage.setViewportSize(viewport);
                await authenticatedPage.waitForTimeout(500);

                await expect(authenticatedPage).toHaveScreenshot(`dashboard-${viewport.name}.png`, {
                    fullPage: true,
                    animations: 'disabled',
                });
            });

            test(`should render projects page consistently on ${viewport.name}`, async ({ authenticatedPage }) => {
                const utils = new TestUtils(authenticatedPage);

                await authenticatedPage.setViewportSize(viewport);
                await utils.navigateTo('projects');
                await authenticatedPage.waitForTimeout(500);

                await expect(authenticatedPage).toHaveScreenshot(`projects-${viewport.name}.png`, {
                    fullPage: true,
                    animations: 'disabled',
                });
            });
        }
    });

    test.describe('Dark Mode', () => {
        test('should render components consistently in dark mode', async ({ authenticatedPage }) => {
            // Enable dark mode
            await authenticatedPage.emulateMedia({ colorScheme: 'dark' });
            await authenticatedPage.waitForTimeout(300);

            // Screenshot dashboard in dark mode
            await expect(authenticatedPage).toHaveScreenshot('dashboard-dark.png', {
                fullPage: true,
                animations: 'disabled',
            });
        });
    });

    test.describe('High Contrast Mode', () => {
        test('should render components consistently in high contrast mode', async ({ authenticatedPage }) => {
            // Enable high contrast mode
            await authenticatedPage.emulateMedia({ forcedColors: 'active' });
            await authenticatedPage.waitForTimeout(300);

            // Screenshot dashboard in high contrast mode
            await expect(authenticatedPage).toHaveScreenshot('dashboard-high-contrast.png', {
                fullPage: true,
                animations: 'disabled',
            });
        });
    });

    test.describe('Animation States', () => {
        test('should render celebration animations consistently', async ({ authenticatedPage }) => {
            // Trigger celebration animation
            await authenticatedPage.evaluate(() => {
                // Mock celebration trigger
                window.dispatchEvent(new CustomEvent('celebration', { detail: { type: 'levelUp' } }));
            });

            await authenticatedPage.waitForTimeout(1000);

            const celebration = authenticatedPage.locator('[data-testid="celebration-animation"]');
            await expect(celebration).toHaveScreenshot('celebration-animation.png');
        });

        test('should render progress animations consistently', async ({ authenticatedPage }) => {
            const progressBar = authenticatedPage.locator('[data-testid="xp-progress-bar"]');
            await expect(progressBar).toHaveScreenshot('progress-animation.png');
        });
    });
});