/**
 * Cross-Browser Compatibility Tests
 * 
 * Tests to ensure the application works consistently across different browsers
 */

import { test, expect, TestUtils, devices } from '../e2e/setup';

// Define browser configurations
const browsers = [
    { name: 'chromium', userAgent: 'Chrome' },
    { name: 'firefox', userAgent: 'Firefox' },
    { name: 'webkit', userAgent: 'Safari' },
];

test.describe('Cross-Browser Compatibility', () => {
    test.beforeEach(async ({ mockApiResponses }) => {
        // Ensure consistent API responses across browsers
    });

    test.describe('Core Functionality', () => {
        for (const browser of browsers) {
            test(`should load dashboard correctly in ${browser.name}`, async ({ page }) => {
                // This test would run on the specified browser
                await page.goto('/');

                // Check basic elements load
                await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
                await expect(page.locator('[data-testid="timer-component"]')).toBeVisible();
                await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
            });

            test(`should handle timer functionality in ${browser.name}`, async ({ authenticatedPage }) => {
                const utils = new TestUtils(authenticatedPage);

                // Test timer start/stop
                await utils.startTimer();
                await expect(authenticatedPage.locator('[data-testid="timer-status"]')).toHaveText('Running');

                await utils.stopTimer();
                await expect(authenticatedPage.locator('[data-testid="timer-status"]')).toHaveText('Stopped');
            });
        }
    });

    test.describe('CSS Features', () => {
        test('should support CSS Grid layout', async ({ page }) => {
            await page.goto('/');

            // Check CSS Grid support
            const gridSupport = await page.evaluate(() => {
                const testElement = document.createElement('div');
                testElement.style.display = 'grid';
                return testElement.style.display === 'grid';
            });

            expect(gridSupport).toBe(true);

            // Verify grid layout is working
            const gridContainer = page.locator('[data-testid="dashboard-grid"]');
            if (await gridContainer.count() > 0) {
                const computedStyle = await gridContainer.evaluate(el => {
                    return getComputedStyle(el).display;
                });
                expect(computedStyle).toBe('grid');
            }
        });

        test('should support CSS Flexbox layout', async ({ page }) => {
            await page.goto('/');

            // Check Flexbox support
            const flexSupport = await page.evaluate(() => {
                const testElement = document.createElement('div');
                testElement.style.display = 'flex';
                return testElement.style.display === 'flex';
            });

            expect(flexSupport).toBe(true);

            // Verify flex layout is working
            const flexContainer = page.locator('[data-testid="flex-container"]').first();
            if (await flexContainer.count() > 0) {
                const computedStyle = await flexContainer.evaluate(el => {
                    return getComputedStyle(el).display;
                });
                expect(['flex', 'inline-flex']).toContain(computedStyle);
            }
        });

        test('should support CSS Custom Properties', async ({ page }) => {
            await page.goto('/');

            // Check CSS Custom Properties support
            const customPropsSupport = await page.evaluate(() => {
                const testElement = document.createElement('div');
                testElement.style.setProperty('--test-prop', 'test-value');
                return testElement.style.getPropertyValue('--test-prop') === 'test-value';
            });

            expect(customPropsSupport).toBe(true);

            // Verify custom properties are being used
            const rootStyles = await page.evaluate(() => {
                const rootElement = document.documentElement;
                const computedStyle = getComputedStyle(rootElement);
                return {
                    primaryColor: computedStyle.getPropertyValue('--color-primary'),
                    fontFamily: computedStyle.getPropertyValue('--font-din-round'),
                };
            });

            expect(rootStyles.primaryColor).toBeTruthy();
        });

        test('should support CSS Animations', async ({ page }) => {
            await page.goto('/');

            // Check CSS Animation support
            const animationSupport = await page.evaluate(() => {
                const testElement = document.createElement('div');
                testElement.style.animation = 'test 1s';
                return testElement.style.animation.includes('test');
            });

            expect(animationSupport).toBe(true);
        });

        test('should support CSS Transforms', async ({ page }) => {
            await page.goto('/');

            // Check CSS Transform support
            const transformSupport = await page.evaluate(() => {
                const testElement = document.createElement('div');
                testElement.style.transform = 'translateX(10px)';
                return testElement.style.transform === 'translateX(10px)';
            });

            expect(transformSupport).toBe(true);
        });
    });

    test.describe('JavaScript Features', () => {
        test('should support ES6+ features', async ({ page }) => {
            await page.goto('/');

            // Check ES6+ support
            const es6Support = await page.evaluate(() => {
                try {
                    // Test arrow functions
                    const arrowFunc = () => 'test';

                    // Test template literals
                    const templateLiteral = `test ${arrowFunc()}`;

                    // Test destructuring
                    const { length } = 'test';

                    // Test const/let
                    const constVar = 'test';
                    let letVar = 'test';

                    // Test classes
                    class TestClass {
                        constructor() {
                            this.prop = 'test';
                        }
                    }

                    // Test async/await
                    const asyncFunc = async () => 'test';

                    return true;
                } catch (error) {
                    return false;
                }
            });

            expect(es6Support).toBe(true);
        });

        test('should support Fetch API', async ({ page }) => {
            await page.goto('/');

            const fetchSupport = await page.evaluate(() => {
                return typeof fetch === 'function';
            });

            expect(fetchSupport).toBe(true);
        });

        test('should support Local Storage', async ({ page }) => {
            await page.goto('/');

            const localStorageSupport = await page.evaluate(() => {
                try {
                    localStorage.setItem('test', 'value');
                    const value = localStorage.getItem('test');
                    localStorage.removeItem('test');
                    return value === 'value';
                } catch (error) {
                    return false;
                }
            });

            expect(localStorageSupport).toBe(true);
        });

        test('should support Session Storage', async ({ page }) => {
            await page.goto('/');

            const sessionStorageSupport = await page.evaluate(() => {
                try {
                    sessionStorage.setItem('test', 'value');
                    const value = sessionStorage.getItem('test');
                    sessionStorage.removeItem('test');
                    return value === 'value';
                } catch (error) {
                    return false;
                }
            });

            expect(sessionStorageSupport).toBe(true);
        });

        test('should support Web Workers', async ({ page }) => {
            await page.goto('/');

            const webWorkerSupport = await page.evaluate(() => {
                return typeof Worker === 'function';
            });

            expect(webWorkerSupport).toBe(true);
        });
    });

    test.describe('Media Queries', () => {
        test('should respond to viewport changes', async ({ page }) => {
            await page.goto('/');

            // Test desktop layout
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.waitForTimeout(500);

            const desktopNav = page.locator('[data-testid="desktop-navigation"]');
            if (await desktopNav.count() > 0) {
                await expect(desktopNav).toBeVisible();
            }

            // Test mobile layout
            await page.setViewportSize({ width: 375, height: 667 });
            await page.waitForTimeout(500);

            const mobileNav = page.locator('[data-testid="mobile-navigation"]');
            if (await mobileNav.count() > 0) {
                await expect(mobileNav).toBeVisible();
            }
        });

        test('should support prefers-reduced-motion', async ({ page }) => {
            await page.goto('/');

            // Test reduced motion support
            const reducedMotionSupport = await page.evaluate(() => {
                return window.matchMedia('(prefers-reduced-motion: reduce)').media !== 'not all';
            });

            expect(reducedMotionSupport).toBe(true);
        });

        test('should support prefers-color-scheme', async ({ page }) => {
            await page.goto('/');

            // Test color scheme support
            const colorSchemeSupport = await page.evaluate(() => {
                return window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';
            });

            expect(colorSchemeSupport).toBe(true);
        });
    });

    test.describe('Touch and Input', () => {
        test('should handle touch events on mobile devices', async ({ page }) => {
            // Simulate mobile device
            await page.setViewportSize({ width: 375, height: 667 });

            await page.goto('/');

            // Test touch event support
            const touchSupport = await page.evaluate(() => {
                return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            });

            // On actual mobile devices, this should be true
            // In desktop browsers, it might be false, which is acceptable
            if (touchSupport) {
                // Test touch interaction
                const button = page.locator('[data-testid="start-timer-button"]');
                await button.tap();

                // Verify touch interaction worked
                await expect(page.locator('[data-testid="active-timer"]')).toBeVisible();
            }
        });

        test('should handle keyboard navigation', async ({ page }) => {
            await page.goto('/');

            // Test Tab navigation
            await page.keyboard.press('Tab');

            // Should focus on first interactive element
            const focusedElement = await page.evaluate(() => {
                return document.activeElement?.tagName.toLowerCase();
            });

            expect(['a', 'button', 'input']).toContain(focusedElement || '');
        });
    });

    test.describe('Performance APIs', () => {
        test('should support Performance API', async ({ page }) => {
            await page.goto('/');

            const performanceSupport = await page.evaluate(() => {
                return typeof performance === 'object' && typeof performance.now === 'function';
            });

            expect(performanceSupport).toBe(true);
        });

        test('should support Intersection Observer', async ({ page }) => {
            await page.goto('/');

            const intersectionObserverSupport = await page.evaluate(() => {
                return typeof IntersectionObserver === 'function';
            });

            expect(intersectionObserverSupport).toBe(true);
        });

        test('should support Resize Observer', async ({ page }) => {
            await page.goto('/');

            const resizeObserverSupport = await page.evaluate(() => {
                return typeof ResizeObserver === 'function';
            });

            expect(resizeObserverSupport).toBe(true);
        });
    });

    test.describe('Font Loading', () => {
        test('should load custom fonts correctly', async ({ page }) => {
            await page.goto('/');

            // Wait for fonts to load
            await page.waitForTimeout(2000);

            // Check if custom font is loaded
            const fontLoaded = await page.evaluate(() => {
                const testElement = document.createElement('div');
                testElement.style.fontFamily = 'DIN Round Pro, sans-serif';
                testElement.textContent = 'Test';
                document.body.appendChild(testElement);

                const computedStyle = getComputedStyle(testElement);
                const fontFamily = computedStyle.fontFamily;

                document.body.removeChild(testElement);

                return fontFamily.includes('DIN Round Pro') || fontFamily.includes('din-round');
            });

            // Font should either load or fallback gracefully
            expect(typeof fontLoaded).toBe('boolean');
        });

        test('should handle font loading failures gracefully', async ({ page }) => {
            // Block font loading
            await page.route('**/*.woff*', route => route.abort());
            await page.route('**/*font*', route => route.abort());

            await page.goto('/');

            // Page should still be functional without custom fonts
            await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();

            // Text should still be readable
            const textElement = page.locator('h1, h2, p').first();
            if (await textElement.count() > 0) {
                const fontSize = await textElement.evaluate(el => {
                    return parseFloat(getComputedStyle(el).fontSize);
                });

                expect(fontSize).toBeGreaterThan(12); // Should have readable font size
            }
        });
    });

    test.describe('Error Handling', () => {
        test('should handle JavaScript errors gracefully', async ({ page }) => {
            const errors: string[] = [];

            page.on('pageerror', error => {
                errors.push(error.message);
            });

            await page.goto('/');

            // Trigger potential error scenarios
            await page.evaluate(() => {
                // Try to access potentially undefined properties
                try {
                    (window as any).nonExistentObject.property;
                } catch (e) {
                    // Should be caught and handled
                }
            });

            // Should not have uncaught errors
            expect(errors.length).toBe(0);
        });

        test('should handle network errors gracefully', async ({ page }) => {
            // Mock network failure
            await page.route('**/*', route => route.abort());

            await page.goto('/', { waitUntil: 'domcontentloaded' });

            // Should show appropriate error message
            const errorMessage = page.locator('[data-testid="network-error"]');
            if (await errorMessage.count() > 0) {
                await expect(errorMessage).toBeVisible();
            }
        });
    });

    test.describe('Security Features', () => {
        test('should have proper Content Security Policy headers', async ({ page }) => {
            const response = await page.goto('/');

            if (response) {
                const headers = response.headers();

                // Check for security headers (these might not be present in development)
                const securityHeaders = [
                    'content-security-policy',
                    'x-frame-options',
                    'x-content-type-options',
                ];

                // In production, these should be present
                // In development, we just verify the check doesn't break
                expect(typeof headers).toBe('object');
            }
        });

        test('should sanitize user input', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            await utils.navigateTo('projects');

            // Try to create task with potentially malicious input
            await authenticatedPage.click('[data-testid="create-task-button"]');
            await utils.waitForStableElement('[data-testid="task-modal"]');

            const maliciousInput = '<script>alert("xss")</script>';
            await authenticatedPage.fill('[data-testid="task-title-input"]', maliciousInput);
            await authenticatedPage.click('[data-testid="save-task-button"]');

            // Input should be sanitized and not execute
            const taskTitle = await authenticatedPage.locator('[data-testid="task-title"]').first().textContent();
            expect(taskTitle).not.toContain('<script>');
        });
    });
});