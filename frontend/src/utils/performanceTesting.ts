/**
 * Performance testing and benchmarking utilities
 */

interface PerformanceMetrics {
    renderTime: number;
    memoryUsage: number;
    fps: number;
    bundleSize: number;
    loadTime: number;
    interactionTime: number;
}

interface BenchmarkResult {
    name: string;
    duration: number;
    iterations: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
    memoryBefore: number;
    memoryAfter: number;
    memoryDelta: number;
}

interface ComponentPerformanceMetrics {
    componentName: string;
    renderCount: number;
    totalRenderTime: number;
    averageRenderTime: number;
    lastRenderTime: number;
    memoryUsage: number;
}

// Performance measurement utilities
export class PerformanceTester {
    private metrics: Map<string, number[]> = new Map();
    private componentMetrics: Map<string, ComponentPerformanceMetrics> = new Map();
    private observers: Map<string, PerformanceObserver> = new Map();

    // Measure function execution time
    async measureFunction<T>(
        name: string,
        fn: () => T | Promise<T>,
        iterations: number = 1
    ): Promise<BenchmarkResult> {
        const times: number[] = [];
        const memoryBefore = this.getMemoryUsage();

        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await fn();
            const end = performance.now();
            times.push(end - start);
        }

        const memoryAfter = this.getMemoryUsage();
        const totalTime = times.reduce((sum, time) => sum + time, 0);

        return {
            name,
            duration: totalTime,
            iterations,
            averageTime: totalTime / iterations,
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            memoryBefore,
            memoryAfter,
            memoryDelta: memoryAfter - memoryBefore,
        };
    }

    // Measure React component render performance
    measureComponentRender(componentName: string, renderFn: () => void): void {
        const start = performance.now();
        renderFn();
        const end = performance.now();
        const renderTime = end - start;

        const existing = this.componentMetrics.get(componentName);
        if (existing) {
            existing.renderCount++;
            existing.totalRenderTime += renderTime;
            existing.averageRenderTime = existing.totalRenderTime / existing.renderCount;
            existing.lastRenderTime = renderTime;
            existing.memoryUsage = this.getMemoryUsage();
        } else {
            this.componentMetrics.set(componentName, {
                componentName,
                renderCount: 1,
                totalRenderTime: renderTime,
                averageRenderTime: renderTime,
                lastRenderTime: renderTime,
                memoryUsage: this.getMemoryUsage(),
            });
        }
    }

    // Measure animation performance
    async measureAnimationPerformance(
        name: string,
        animationFn: () => void,
        duration: number = 1000
    ): Promise<{ fps: number; frameCount: number; droppedFrames: number }> {
        let frameCount = 0;
        let droppedFrames = 0;
        let lastFrameTime = performance.now();
        const startTime = performance.now();

        return new Promise((resolve) => {
            const measureFrame = () => {
                const currentTime = performance.now();
                const frameDelta = currentTime - lastFrameTime;

                frameCount++;

                // Consider frame dropped if it took longer than 16.67ms (60fps)
                if (frameDelta > 16.67) {
                    droppedFrames++;
                }

                lastFrameTime = currentTime;
                animationFn();

                if (currentTime - startTime < duration) {
                    requestAnimationFrame(measureFrame);
                } else {
                    const totalTime = currentTime - startTime;
                    const fps = Math.round((frameCount * 1000) / totalTime);

                    resolve({
                        fps,
                        frameCount,
                        droppedFrames,
                    });
                }
            };

            requestAnimationFrame(measureFrame);
        });
    }

    // Measure bundle size impact
    async measureBundleSize(): Promise<{ totalSize: number; gzippedSize: number }> {
        try {
            // This would typically be done during build time
            // For runtime, we can estimate based on loaded resources
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

            let totalSize = 0;
            resources.forEach(resource => {
                if (resource.transferSize) {
                    totalSize += resource.transferSize;
                }
            });

            return {
                totalSize,
                gzippedSize: totalSize * 0.3, // Rough estimate
            };
        } catch (error) {
            console.error('Failed to measure bundle size:', error);
            return { totalSize: 0, gzippedSize: 0 };
        }
    }

    // Measure page load performance
    measurePageLoad(): PerformanceMetrics {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
        const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

        return {
            renderTime: firstContentfulPaint,
            memoryUsage: this.getMemoryUsage(),
            fps: 60, // Default assumption
            bundleSize: 0, // Would need to be measured separately
            loadTime: navigation.loadEventEnd - navigation.navigationStart,
            interactionTime: firstPaint,
        };
    }

    // Start performance monitoring
    startMonitoring(metricsCallback?: (metrics: PerformanceMetrics) => void): void {
        // Monitor Long Tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.warn('Long task detected:', entry.duration, 'ms');
                });
            });

            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.set('longtask', longTaskObserver);
            } catch (error) {
                console.warn('Long task monitoring not supported');
            }

            // Monitor Layout Shifts
            const layoutShiftObserver = new PerformanceObserver((list) => {
                let cumulativeScore = 0;
                list.getEntries().forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        cumulativeScore += entry.value;
                    }
                });

                if (cumulativeScore > 0.1) {
                    console.warn('Layout shift detected:', cumulativeScore);
                }
            });

            try {
                layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('layout-shift', layoutShiftObserver);
            } catch (error) {
                console.warn('Layout shift monitoring not supported');
            }

            // Monitor Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });

            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.set('lcp', lcpObserver);
            } catch (error) {
                console.warn('LCP monitoring not supported');
            }
        }

        // Periodic metrics collection
        if (metricsCallback) {
            const collectMetrics = () => {
                const metrics = this.measurePageLoad();
                metricsCallback(metrics);
            };

            setInterval(collectMetrics, 5000); // Collect every 5 seconds
        }
    }

    // Stop performance monitoring
    stopMonitoring(): void {
        this.observers.forEach((observer) => {
            observer.disconnect();
        });
        this.observers.clear();
    }

    // Get memory usage
    private getMemoryUsage(): number {
        if ('memory' in performance) {
            return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
    }

    // Get component metrics
    getComponentMetrics(componentName?: string): ComponentPerformanceMetrics[] {
        if (componentName) {
            const metrics = this.componentMetrics.get(componentName);
            return metrics ? [metrics] : [];
        }

        return Array.from(this.componentMetrics.values());
    }

    // Clear metrics
    clearMetrics(): void {
        this.metrics.clear();
        this.componentMetrics.clear();
    }

    // Generate performance report
    generateReport(): {
        components: ComponentPerformanceMetrics[];
        totalMemoryUsage: number;
        slowestComponent: ComponentPerformanceMetrics | null;
        averageRenderTime: number;
    } {
        const components = this.getComponentMetrics();
        const totalMemoryUsage = this.getMemoryUsage();

        const slowestComponent = components.reduce((slowest, current) => {
            return !slowest || current.averageRenderTime > slowest.averageRenderTime
                ? current
                : slowest;
        }, null as ComponentPerformanceMetrics | null);

        const averageRenderTime = components.length > 0
            ? components.reduce((sum, comp) => sum + comp.averageRenderTime, 0) / components.length
            : 0;

        return {
            components,
            totalMemoryUsage,
            slowestComponent,
            averageRenderTime,
        };
    }
}

// Web Vitals measurement
export class WebVitalsMeasurer {
    private vitals: Map<string, number> = new Map();

    // Measure Core Web Vitals
    measureWebVitals(): Promise<{
        lcp: number; // Largest Contentful Paint
        fid: number; // First Input Delay
        cls: number; // Cumulative Layout Shift
        fcp: number; // First Contentful Paint
        ttfb: number; // Time to First Byte
    }> {
        return new Promise((resolve) => {
            const vitals = {
                lcp: 0,
                fid: 0,
                cls: 0,
                fcp: 0,
                ttfb: 0,
            };

            // Measure FCP
            const paintObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        vitals.fcp = entry.startTime;
                    }
                });
            });
            paintObserver.observe({ entryTypes: ['paint'] });

            // Measure LCP
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                vitals.lcp = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Measure CLS
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                vitals.cls = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // Measure FID
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry: any) => {
                    vitals.fid = entry.processingStart - entry.startTime;
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Measure TTFB
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            vitals.ttfb = navigation.responseStart - navigation.requestStart;

            // Resolve after a delay to collect metrics
            setTimeout(() => {
                paintObserver.disconnect();
                lcpObserver.disconnect();
                clsObserver.disconnect();
                fidObserver.disconnect();
                resolve(vitals);
            }, 3000);
        });
    }
}

// Create singleton instances
export const performanceTester = new PerformanceTester();
export const webVitalsMeasurer = new WebVitalsMeasurer();

// Utility functions
export const performanceTestUtils = {
    // Test component render performance
    testComponentRender: (componentName: string, renderFn: () => void) => {
        performanceTester.measureComponentRender(componentName, renderFn);
    },

    // Test function performance
    testFunction: async <T>(name: string, fn: () => T | Promise<T>, iterations: number = 100) => {
        return performanceTester.measureFunction(name, fn, iterations);
    },

    // Test animation performance
    testAnimation: async (name: string, animationFn: () => void, duration: number = 1000) => {
        return performanceTester.measureAnimationPerformance(name, animationFn, duration);
    },

    // Get performance report
    getReport: () => performanceTester.generateReport(),

    // Start monitoring
    startMonitoring: (callback?: (metrics: PerformanceMetrics) => void) => {
        performanceTester.startMonitoring(callback);
    },

    // Stop monitoring
    stopMonitoring: () => performanceTester.stopMonitoring(),

    // Measure web vitals
    measureWebVitals: () => webVitalsMeasurer.measureWebVitals(),
};

export default performanceTestUtils;