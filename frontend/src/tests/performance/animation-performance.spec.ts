/**
 * Animation Performance Tests
 * 
 * Tests to ensure animations perform well and don't cause jank
 */

import { test, expect, TestUtils } from '../e2e/setup';

test.describe('Animation Performance Tests', () => {
    test.beforeEach(async ({ mockApiResponses }) => {
        // Ensure consistent API responses
    });

    test.describe('Frame Rate Monitoring', () => {
        test('should maintain 60fps during timer animations', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Start performance monitoring
            await authenticatedPage.evaluate(() => {
                (window as any).performanceData = {
                    frames: 0,
                    startTime: performance.now(),
                    frameDrops: 0,
                };

                function measureFrameRate() {
                    (window as any).performanceData.frames++;
                    const now = performance.now();
                    const elapsed = now - (window as any).performanceData.startTime;

                    if (elapsed >= 1000) {
                        const fps = ((window as any).performanceData.frames * 1000) / elapsed;
                        (window as any).performanceData.fps = fps;

                        if (fps < 55) {
                            (window as any).performanceData.frameDrops++;
                        }

                        // Reset for next measurement
                        (window as any).performanceData.frames = 0;
                        (window as any).performanceData.startTime = now;
                    }

                    requestAnimationFrame(measureFrameRate);
                }

                requestAnimationFrame(measureFrameRate);
            });

            // Start timer to trigger animations
            await utils.startTimer();

            // Let animations run for 5 seconds
            await authenticatedPage.waitForTimeout(5000);

            // Check performance data
            const performanceData = await authenticatedPage.evaluate(() => (window as any).performanceData);

            expect(performanceData.fps).toBeGreaterThan(55); // Should maintain near 60fps
            expect(performanceData.frameDrops).toBeLessThan(3); // Minimal frame drops allowed
        });

        test('should maintain performance during page transitions', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Monitor performance during navigation
            const performanceEntries: any[] = [];

            await authenticatedPage.evaluate(() => {
                const observer = new PerformanceObserver((list) => {
                    (window as any).performanceEntries = (window as any).performanceEntries || [];
                    (window as any).performanceEntries.push(...list.getEntries());
                });
                observer.observe({ entryTypes: ['measure', 'navigation'] });
            });

            // Navigate between pages rapidly
            const pages = ['projects', 'leaderboard', 'achievements', 'skills'] as const;

            for (const page of pages) {
                const startTime = Date.now();
                await utils.navigateTo(page);
                const endTime = Date.now();

                const navigationTime = endTime - startTime;
                expect(navigationTime).toBeLessThan(1000); // Should navigate within 1 second
            }

            // Check for long tasks
            const longTasks = await authenticatedPage.evaluate(() => {
                return (window as any).performanceEntries?.filter((entry: any) =>
                    entry.entryType === 'longtask' && entry.duration > 50
                ) || [];
            });

            expect(longTasks.length).toBeLessThan(5); // Minimal long tasks
        });
    });

    test.describe('Memory Usage', () => {
        test('should not leak memory during animations', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Get initial memory usage
            const initialMemory = await authenticatedPage.evaluate(() => {
                return (performance as any).memory ? {
                    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                    totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                } : null;
            });

            if (!initialMemory) {
                test.skip('Memory API not available');
                return;
            }

            // Start and stop timer multiple times to trigger animations
            for (let i = 0; i < 10; i++) {
                await utils.startTimer();
                await authenticatedPage.waitForTimeout(1000);
                await utils.stopTimer();
                await authenticatedPage.waitForTimeout(500);
            }

            // Force garbage collection if available
            await authenticatedPage.evaluate(() => {
                if ((window as any).gc) {
                    (window as any).gc();
                }
            });

            // Check final memory usage
            const finalMemory = await authenticatedPage.evaluate(() => {
                return (performance as any).memory ? {
                    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                    totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                } : null;
            });

            if (finalMemory) {
                const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
                const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;

                // Memory should not increase by more than 50%
                expect(memoryIncreasePercent).toBeLessThan(50);
            }
        });

        test('should clean up animation resources', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Monitor animation frame requests
            await authenticatedPage.evaluate(() => {
                (window as any).animationFrameCount = 0;
                const originalRAF = window.requestAnimationFrame;
                const originalCAF = window.cancelAnimationFrame;

                window.requestAnimationFrame = function (callback) {
                    (window as any).animationFrameCount++;
                    return originalRAF.call(window, callback);
                };

                window.cancelAnimationFrame = function (id) {
                    (window as any).animationFrameCount--;
                    return originalCAF.call(window, id);
                };
            });

            // Start animations
            await utils.startTimer();
            await authenticatedPage.waitForTimeout(2000);

            // Stop animations
            await utils.stopTimer();
            await authenticatedPage.waitForTimeout(1000);

            // Check that animation frames are cleaned up
            const animationFrameCount = await authenticatedPage.evaluate(() => (window as any).animationFrameCount);

            // Should have minimal active animation frames when idle
            expect(animationFrameCount).toBeLessThan(5);
        });
    });

    test.describe('CPU Usage', () => {
        test('should not cause excessive CPU usage during idle state', async ({ authenticatedPage }) => {
            // Let page settle
            await authenticatedPage.waitForTimeout(2000);

            // Monitor CPU usage through performance timeline
            await authenticatedPage.evaluate(() => {
                (window as any).cpuMeasurements = [];

                function measureCPU() {
                    const start = performance.now();

                    // Simulate some work to measure CPU responsiveness
                    let sum = 0;
                    for (let i = 0; i < 10000; i++) {
                        sum += Math.random();
                    }

                    const end = performance.now();
                    (window as any).cpuMeasurements.push(end - start);

                    if ((window as any).cpuMeasurements.length < 10) {
                        setTimeout(measureCPU, 100);
                    }
                }

                measureCPU();
            });

            // Wait for measurements
            await authenticatedPage.waitForTimeout(2000);

            const measurements = await authenticatedPage.evaluate(() => (window as any).cpuMeasurements);

            // Calculate average CPU time
            const avgCpuTime = measurements.reduce((a: number, b: number) => a + b, 0) / measurements.length;

            // Should complete work quickly when idle
            expect(avgCpuTime).toBeLessThan(5); // Less than 5ms for simple work
        });

        test('should handle multiple simultaneous animations efficiently', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to page with multiple animations
            await utils.navigateTo('achievements');

            // Trigger multiple animations simultaneously
            await authenticatedPage.evaluate(() => {
                // Simulate multiple achievement unlocks
                const events = ['achievement-unlock', 'xp-gain', 'level-up'];
                events.forEach(event => {
                    window.dispatchEvent(new CustomEvent(event, { detail: { animated: true } }));
                });
            });

            // Monitor performance during animations
            const startTime = Date.now();
            await authenticatedPage.waitForTimeout(3000);
            const endTime = Date.now();

            // Check that page remains responsive
            const responseTime = await authenticatedPage.evaluate(() => {
                const start = performance.now();
                document.body.style.opacity = '0.99';
                document.body.offsetHeight; // Force reflow
                document.body.style.opacity = '1';
                return performance.now() - start;
            });

            expect(responseTime).toBeLessThan(16); // Should complete within one frame (16ms)
        });
    });

    test.describe('Animation Smoothness', () => {
        test('should provide smooth progress bar animations', async ({ authenticatedPage }) => {
            // Monitor progress bar animation smoothness
            await authenticatedPage.evaluate(() => {
                (window as any).animationSamples = [];

                const progressBar = document.querySelector('[data-testid="xp-progress-bar"]');
                if (progressBar) {
                    const observer = new MutationObserver(() => {
                        const computedStyle = getComputedStyle(progressBar);
                        const width = parseFloat(computedStyle.width);
                        (window as any).animationSamples.push({
                            timestamp: performance.now(),
                            width: width,
                        });
                    });

                    observer.observe(progressBar, { attributes: true, attributeFilter: ['style'] });
                }
            });

            // Trigger progress animation
            await authenticatedPage.evaluate(() => {
                const progressBar = document.querySelector('[data-testid="xp-progress-bar"]') as HTMLElement;
                if (progressBar) {
                    progressBar.style.width = '75%';
                }
            });

            await authenticatedPage.waitForTimeout(1000);

            const samples = await authenticatedPage.evaluate(() => (window as any).animationSamples);

            if (samples && samples.length > 1) {
                // Check for smooth progression (no sudden jumps)
                for (let i = 1; i < samples.length; i++) {
                    const widthDiff = Math.abs(samples[i].width - samples[i - 1].width);
                    const timeDiff = samples[i].timestamp - samples[i - 1].timestamp;

                    if (timeDiff > 0) {
                        const velocity = widthDiff / timeDiff;
                        expect(velocity).toBeLessThan(10); // Reasonable animation velocity
                    }
                }
            }
        });

        test('should provide smooth scroll animations', async ({ authenticatedPage }) => {
            const utils = new TestUtils(authenticatedPage);

            // Navigate to page with scrollable content
            await utils.navigateTo('leaderboard');

            // Monitor scroll performance
            await authenticatedPage.evaluate(() => {
                (window as any).scrollSamples = [];

                function recordScroll() {
                    (window as any).scrollSamples.push({
                        timestamp: performance.now(),
                        scrollTop: window.scrollY,
                    });
                }

                window.addEventListener('scroll', recordScroll);
            });

            // Perform smooth scroll
            await authenticatedPage.evaluate(() => {
                window.scrollTo({ top: 500, behavior: 'smooth' });
            });

            await authenticatedPage.waitForTimeout(1000);

            const scrollSamples = await authenticatedPage.evaluate(() => (window as any).scrollSamples);

            if (scrollSamples && scrollSamples.length > 2) {
                // Check for smooth scrolling (consistent frame rate)
                const frameTimes = [];
                for (let i = 1; i < scrollSamples.length; i++) {
                    frameTimes.push(scrollSamples[i].timestamp - scrollSamples[i - 1].timestamp);
                }

                const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
                expect(avgFrameTime).toBeLessThan(20); // Should be close to 16.67ms (60fps)
            }
        });
    });

    test.describe('Reduced Motion Compliance', () => {
        test('should respect reduced motion preferences', async ({ authenticatedPage }) => {
            // Enable reduced motion
            await authenticatedPage.emulateMedia({ reducedMotion: 'reduce' });

            const utils = new TestUtils(authenticatedPage);

            // Start timer (should have minimal animation)
            await utils.startTimer();

            // Check that animations are reduced/disabled
            const animationDuration = await authenticatedPage.evaluate(() => {
                const timerElement = document.querySelector('[data-testid="timer-display"]');
                if (timerElement) {
                    const computedStyle = getComputedStyle(timerElement);
                    return computedStyle.animationDuration;
                }
                return null;
            });

            // Animation duration should be very short or none
            if (animationDuration) {
                const duration = parseFloat(animationDuration);
                expect(duration).toBeLessThan(0.1); // Less than 100ms
            }
        });

        test('should provide alternative feedback for reduced motion', async ({ authenticatedPage }) => {
            // Enable reduced motion
            await authenticatedPage.emulateMedia({ reducedMotion: 'reduce' });

            // Trigger an action that normally has animation
            await authenticatedPage.click('[data-testid="complete-task-button"]');

            // Should still provide feedback, just without animation
            await expect(authenticatedPage.locator('[data-testid="success-message"]')).toBeVisible();
        });
    });

    test.describe('Animation Accessibility', () => {
        test('should not cause seizures with flashing content', async ({ authenticatedPage }) => {
            // Monitor for rapid color changes that could cause seizures
            await authenticatedPage.evaluate(() => {
                (window as any).colorChanges = [];

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            const element = mutation.target as HTMLElement;
                            const style = getComputedStyle(element);
                            (window as any).colorChanges.push({
                                timestamp: performance.now(),
                                backgroundColor: style.backgroundColor,
                                color: style.color,
                            });
                        }
                    });
                });

                observer.observe(document.body, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['style', 'class']
                });
            });

            // Trigger various animations
            const utils = new TestUtils(authenticatedPage);
            await utils.startTimer();
            await authenticatedPage.waitForTimeout(2000);
            await utils.stopTimer();

            const colorChanges = await authenticatedPage.evaluate(() => (window as any).colorChanges);

            if (colorChanges && colorChanges.length > 1) {
                // Check for rapid flashing (more than 3 flashes per second)
                let rapidFlashes = 0;
                for (let i = 1; i < colorChanges.length; i++) {
                    const timeDiff = colorChanges[i].timestamp - colorChanges[i - 1].timestamp;
                    if (timeDiff < 333) { // Less than 333ms between changes
                        rapidFlashes++;
                    }
                }

                expect(rapidFlashes).toBeLessThan(colorChanges.length * 0.1); // Less than 10% rapid flashes
            }
        });
    });
});