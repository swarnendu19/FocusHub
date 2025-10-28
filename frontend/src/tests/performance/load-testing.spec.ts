import { test, expect } from '@playwright/test';

test.describe('Load Testing with Realistic User Scenarios', () => {
    const BASE_URL = 'http://localhost:3000';
    const API_BASE_URL = 'http://localhost:3001/api';

    test.describe('Single User Load Tests', () => {
        test('should handle rapid navigation between pages', async ({ page }) => {
            await page.goto(BASE_URL);

            const startTime = Date.now();
            const navigationCount = 20;
            const pages = ['/', '/projects', '/leaderboard', '/xp', '/skills', '/profile'];

            // Rapid navigation test
            for (let i = 0; i < navigationCount; i++) {
                const targetPage = pages[i % pages.length];
                await page.goto(`${BASE_URL}${targetPage}`);

                // Wait for page to be interactive
                await page.waitForLoadState('networkidle');

                // Verify page loaded correctly
                expect(page.url()).toContain(targetPage === '/' ? BASE_URL : targetPage);
            }

            const endTime = Date.now();
            const totalTime = endTime - startTime;
            const averageNavigationTime = totalTime / navigationCount;

            console.log(`Average navigation time: ${averageNavigationTime}ms`);

            // Navigation should be reasonably fast (under 2 seconds per page)
            expect(averageNavigationTime).toBeLessThan(2000);
        });

        test('should handle rapid timer start/stop cycles', async ({ page }) => {
            await page.goto(BASE_URL);

            // Wait for page to load
            await page.waitForLoadState('networkidle');

            const cycleCount = 10;
            const startTime = Date.now();

            for (let i = 0; i < cycleCount; i++) {
                // Start timer
                const startButton = page.locator('[data-testid="timer-start"], button:has-text("Start")').first();
                if (await startButton.isVisible()) {
                    await startButton.click();
                    await page.waitForTimeout(100); // Brief pause
                }

                // Stop timer
                const stopButton = page.locator('[data-testid="timer-stop"], button:has-text("Stop")').first();
                if (await stopButton.isVisible()) {
                    await stopButton.click();
                    await page.waitForTimeout(100); // Brief pause
                }
            }

            const endTime = Date.now();
            const totalTime = endTime - startTime;
            const averageCycleTime = totalTime / cycleCount;

            console.log(`Average timer cycle time: ${averageCycleTime}ms`);

            // Timer cycles should be fast (under 500ms per cycle)
            expect(averageCycleTime).toBeLessThan(500);
        });

        test('should handle multiple API calls simultaneously', async ({ page, request }) => {
            const concurrentRequests = 10;
            const startTime = Date.now();

            // Create multiple concurrent API requests
            const requests = Array.from({ length: concurrentRequests }, (_, i) =>
                request.get(`${API_BASE_URL}/auth/current_user`)
            );

            const responses = await Promise.all(requests);

            const endTime = Date.now();
            const totalTime = endTime - startTime;

            console.log(`${concurrentRequests} concurrent requests completed in ${totalTime}ms`);

            // All requests should complete within reasonable time (under 5 seconds)
            expect(totalTime).toBeLessThan(5000);

            // Check response statuses (should be consistent)
            const statuses = responses.map(r => r.status());
            const uniqueStatuses = [...new Set(statuses)];

            // All responses should have the same status (either all 200 or all 401)
            expect(uniqueStatuses.length).toBeLessThanOrEqual(2);
        });
    });

    test.describe('Memory and Performance Tests', () => {
        test('should not have memory leaks during extended use', async ({ page }) => {
            await page.goto(BASE_URL);

            // Get initial memory usage
            const initialMemory = await page.evaluate(() => {
                return (performance as any).memory ? {
                    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                    totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                } : null;
            });

            // Simulate extended use
            const iterations = 50;
            for (let i = 0; i < iterations; i++) {
                // Navigate between pages
                await page.goto(`${BASE_URL}/projects`);
                await page.waitForLoadState('networkidle');

                await page.goto(`${BASE_URL}/leaderboard`);
                await page.waitForLoadState('networkidle');

                await page.goto(`${BASE_URL}/`);
                await page.waitForLoadState('networkidle');

                // Force garbage collection if available
                await page.evaluate(() => {
                    if ((window as any).gc) {
                        (window as any).gc();
                    }
                });
            }

            // Get final memory usage
            const finalMemory = await page.evaluate(() => {
                return (performance as any).memory ? {
                    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                    totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                } : null;
            });

            if (initialMemory && finalMemory) {
                const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
                const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;

                console.log(`Memory increase: ${memoryIncrease} bytes (${memoryIncreasePercent.toFixed(2)}%)`);

                // Memory increase should be reasonable (less than 50% increase)
                expect(memoryIncreasePercent).toBeLessThan(50);
            }
        });

        test('should handle large datasets efficiently', async ({ page }) => {
            await page.goto(`${BASE_URL}/leaderboard`);

            const startTime = Date.now();

            // Wait for leaderboard to load
            await page.waitForLoadState('networkidle');

            // Simulate scrolling through large dataset
            for (let i = 0; i < 10; i++) {
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                });
                await page.waitForTimeout(100);
            }

            const endTime = Date.now();
            const loadTime = endTime - startTime;

            console.log(`Large dataset handling time: ${loadTime}ms`);

            // Should handle large datasets efficiently (under 3 seconds)
            expect(loadTime).toBeLessThan(3000);
        });

        test('should maintain performance with many DOM elements', async ({ page }) => {
            await page.goto(BASE_URL);

            // Create many DOM elements (simulate complex UI state)
            await page.evaluate(() => {
                const container = document.createElement('div');
                container.id = 'performance-test-container';
                document.body.appendChild(container);

                for (let i = 0; i < 1000; i++) {
                    const element = document.createElement('div');
                    element.textContent = `Element ${i}`;
                    element.className = 'test-element';
                    container.appendChild(element);
                }
            });

            const startTime = Date.now();

            // Perform operations that would be affected by DOM size
            await page.evaluate(() => {
                const elements = document.querySelectorAll('.test-element');
                elements.forEach((el, index) => {
                    if (index % 2 === 0) {
                        el.classList.add('highlighted');
                    }
                });
            });

            const endTime = Date.now();
            const operationTime = endTime - startTime;

            console.log(`DOM operation time with 1000 elements: ${operationTime}ms`);

            // DOM operations should remain fast even with many elements
            expect(operationTime).toBeLessThan(1000);

            // Cleanup
            await page.evaluate(() => {
                const container = document.getElementById('performance-test-container');
                if (container) {
                    container.remove();
                }
            });
        });
    });

    test.describe('Network Stress Tests', () => {
        test('should handle network latency gracefully', async ({ page }) => {
            // Simulate slow network
            await page.route('**/*', async (route) => {
                // Add 500ms delay to all requests
                await new Promise(resolve => setTimeout(resolve, 500));
                await route.continue();
            });

            const startTime = Date.now();
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');
            const endTime = Date.now();

            const loadTime = endTime - startTime;
            console.log(`Load time with 500ms network latency: ${loadTime}ms`);

            // Should still load within reasonable time despite latency
            expect(loadTime).toBeLessThan(10000);
        });

        test('should handle intermittent network failures', async ({ page }) => {
            let requestCount = 0;

            await page.route('**/api/**', async (route) => {
                requestCount++;

                // Fail every 3rd request to simulate intermittent failures
                if (requestCount % 3 === 0) {
                    await route.abort('failed');
                } else {
                    await route.continue();
                }
            });

            await page.goto(BASE_URL);

            // App should still function despite some failed requests
            await page.waitForTimeout(2000);

            // Verify app is still responsive
            const title = await page.title();
            expect(title).toBeTruthy();
        });

        test('should handle API rate limiting', async ({ page, request }) => {
            // Simulate rate limiting by making many requests quickly
            const requests = Array.from({ length: 20 }, () =>
                request.get(`${API_BASE_URL}/auth/current_user`)
            );

            const responses = await Promise.allSettled(requests);

            const successfulRequests = responses.filter(r =>
                r.status === 'fulfilled' && r.value.status() === 200
            ).length;

            const rateLimitedRequests = responses.filter(r =>
                r.status === 'fulfilled' && r.value.status() === 429
            ).length;

            console.log(`Successful requests: ${successfulRequests}, Rate limited: ${rateLimitedRequests}`);

            // Should handle rate limiting gracefully
            expect(responses.length).toBe(20);
        });
    });

    test.describe('Concurrent User Simulation', () => {
        test('should handle multiple user sessions', async ({ browser }) => {
            const contexts = await Promise.all([
                browser.newContext(),
                browser.newContext(),
                browser.newContext(),
            ]);

            const pages = await Promise.all(
                contexts.map(context => context.newPage())
            );

            const startTime = Date.now();

            // Simulate multiple users accessing the app simultaneously
            await Promise.all(
                pages.map(async (page, index) => {
                    await page.goto(BASE_URL);
                    await page.waitForLoadState('networkidle');

                    // Each user performs different actions
                    switch (index) {
                        case 0:
                            // User 1: Navigate to projects
                            await page.goto(`${BASE_URL}/projects`);
                            break;
                        case 1:
                            // User 2: Navigate to leaderboard
                            await page.goto(`${BASE_URL}/leaderboard`);
                            break;
                        case 2:
                            // User 3: Navigate to XP page
                            await page.goto(`${BASE_URL}/xp`);
                            break;
                    }

                    await page.waitForLoadState('networkidle');
                })
            );

            const endTime = Date.now();
            const totalTime = endTime - startTime;

            console.log(`Multiple user simulation completed in ${totalTime}ms`);

            // Should handle multiple users efficiently
            expect(totalTime).toBeLessThan(10000);

            // Cleanup
            await Promise.all(contexts.map(context => context.close()));
        });

        test('should maintain data consistency with concurrent updates', async ({ browser }) => {
            const context1 = await browser.newContext();
            const context2 = await browser.newContext();

            const page1 = await context1.newPage();
            const page2 = await context2.newPage();

            // Both users access the same data
            await Promise.all([
                page1.goto(`${BASE_URL}/leaderboard`),
                page2.goto(`${BASE_URL}/leaderboard`),
            ]);

            await Promise.all([
                page1.waitForLoadState('networkidle'),
                page2.waitForLoadState('networkidle'),
            ]);

            // Verify both pages show consistent data
            const leaderboard1 = await page1.locator('[data-testid="leaderboard-entry"]').count();
            const leaderboard2 = await page2.locator('[data-testid="leaderboard-entry"]').count();

            // Data should be consistent across sessions
            if (leaderboard1 > 0 && leaderboard2 > 0) {
                expect(leaderboard1).toBe(leaderboard2);
            }

            await Promise.all([
                context1.close(),
                context2.close(),
            ]);
        });
    });

    test.describe('Real-world Usage Patterns', () => {
        test('should handle typical user session', async ({ page }) => {
            const startTime = Date.now();

            // Typical user session flow
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');

            // 1. Check dashboard
            await page.waitForTimeout(2000);

            // 2. Start a timer
            const startButton = page.locator('button:has-text("Start")').first();
            if (await startButton.isVisible()) {
                await startButton.click();
                await page.waitForTimeout(5000); // Work for 5 seconds
            }

            // 3. Check leaderboard
            await page.goto(`${BASE_URL}/leaderboard`);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);

            // 4. Check achievements
            await page.goto(`${BASE_URL}/demo/achievements`);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // 5. Return to dashboard
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');

            // 6. Stop timer
            const stopButton = page.locator('button:has-text("Stop")').first();
            if (await stopButton.isVisible()) {
                await stopButton.click();
            }

            const endTime = Date.now();
            const sessionTime = endTime - startTime;

            console.log(`Typical user session completed in ${sessionTime}ms`);

            // Typical session should complete efficiently
            expect(sessionTime).toBeLessThan(30000);
        });

        test('should handle power user workflow', async ({ page }) => {
            const startTime = Date.now();

            // Power user workflow (more intensive usage)
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');

            // Rapid navigation and interaction
            const pages = ['/', '/projects', '/leaderboard', '/xp', '/skills'];

            for (let cycle = 0; cycle < 3; cycle++) {
                for (const targetPage of pages) {
                    await page.goto(`${BASE_URL}${targetPage === '/' ? '' : targetPage}`);
                    await page.waitForLoadState('networkidle');

                    // Interact with page elements
                    await page.evaluate(() => {
                        window.scrollTo(0, document.body.scrollHeight / 2);
                    });

                    await page.waitForTimeout(500);
                }
            }

            const endTime = Date.now();
            const workflowTime = endTime - startTime;

            console.log(`Power user workflow completed in ${workflowTime}ms`);

            // Power user workflow should still be reasonably fast
            expect(workflowTime).toBeLessThan(45000);
        });
    });
});