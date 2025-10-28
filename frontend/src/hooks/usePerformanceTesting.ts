import { useEffect, useRef, useState, useCallback } from 'react';
import { performanceTestUtils } from '@/utils/performanceTesting';

interface PerformanceTestState {
    isMonitoring: boolean;
    metrics: any;
    webVitals: any;
    componentMetrics: any[];
    report: any;
}

// Hook for performance testing
export function usePerformanceTesting(componentName?: string) {
    const [state, setState] = useState<PerformanceTestState>({
        isMonitoring: false,
        metrics: null,
        webVitals: null,
        componentMetrics: [],
        report: null,
    });

    const renderCount = useRef(0);
    const renderStartTime = useRef(0);

    // Start performance monitoring
    const startMonitoring = useCallback(() => {
        setState(prev => ({ ...prev, isMonitoring: true }));

        performanceTestUtils.startMonitoring((metrics) => {
            setState(prev => ({ ...prev, metrics }));
        });
    }, []);

    // Stop performance monitoring
    const stopMonitoring = useCallback(() => {
        setState(prev => ({ ...prev, isMonitoring: false }));
        performanceTestUtils.stopMonitoring();
    }, []);

    // Measure web vitals
    const measureWebVitals = useCallback(async () => {
        const vitals = await performanceTestUtils.measureWebVitals();
        setState(prev => ({ ...prev, webVitals: vitals }));
        return vitals;
    }, []);

    // Get performance report
    const getReport = useCallback(() => {
        const report = performanceTestUtils.getReport();
        setState(prev => ({ ...prev, report }));
        return report;
    }, []);

    // Test function performance
    const testFunction = useCallback(async (
        name: string,
        fn: () => any,
        iterations: number = 100
    ) => {
        return performanceTestUtils.testFunction(name, fn, iterations);
    }, []);

    // Test animation performance
    const testAnimation = useCallback(async (
        name: string,
        animationFn: () => void,
        duration: number = 1000
    ) => {
        return performanceTestUtils.testAnimation(name, animationFn, duration);
    }, []);

    // Track component renders
    useEffect(() => {
        if (componentName) {
            renderCount.current++;
            renderStartTime.current = performance.now();

            return () => {
                const renderTime = performance.now() - renderStartTime.current;
                performanceTestUtils.testComponentRender(componentName, () => {
                    // Render function placeholder
                });
            };
        }
    });

    // Auto-start monitoring in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            startMonitoring();

            return () => {
                stopMonitoring();
            };
        }
    }, [startMonitoring, stopMonitoring]);

    return {
        ...state,
        startMonitoring,
        stopMonitoring,
        measureWebVitals,
        getReport,
        testFunction,
        testAnimation,
        renderCount: renderCount.current,
    };
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
    const renderTimes = useRef<number[]>([]);
    const renderStart = useRef<number>(0);

    useEffect(() => {
        renderStart.current = performance.now();

        return () => {
            const renderTime = performance.now() - renderStart.current;
            renderTimes.current.push(renderTime);

            if (process.env.NODE_ENV === 'development') {
                console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
            }
        };
    });

    const getAverageRenderTime = useCallback(() => {
        if (renderTimes.current.length === 0) return 0;
        const sum = renderTimes.current.reduce((a, b) => a + b, 0);
        return sum / renderTimes.current.length;
    }, []);

    const getLastRenderTime = useCallback(() => {
        return renderTimes.current[renderTimes.current.length - 1] || 0;
    }, []);

    const getRenderCount = useCallback(() => {
        return renderTimes.current.length;
    }, []);

    return {
        getAverageRenderTime,
        getLastRenderTime,
        getRenderCount,
        renderTimes: renderTimes.current,
    };
}

// Hook for measuring animation performance
export function useAnimationPerformance() {
    const [fps, setFps] = useState<number>(60);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const frameCount = useRef(0);
    const lastFrameTime = useRef(0);
    const animationId = useRef<number>();

    const startMeasuring = useCallback((duration: number = 1000) => {
        setIsMonitoring(true);
        frameCount.current = 0;
        lastFrameTime.current = performance.now();
        const startTime = performance.now();

        const measureFrame = () => {
            const currentTime = performance.now();
            frameCount.current++;

            if (currentTime - startTime < duration) {
                animationId.current = requestAnimationFrame(measureFrame);
            } else {
                const totalTime = currentTime - startTime;
                const measuredFps = Math.round((frameCount.current * 1000) / totalTime);
                setFps(measuredFps);
                setIsMonitoring(false);
            }
        };

        animationId.current = requestAnimationFrame(measureFrame);
    }, []);

    const stopMeasuring = useCallback(() => {
        if (animationId.current) {
            cancelAnimationFrame(animationId.current);
        }
        setIsMonitoring(false);
    }, []);

    useEffect(() => {
        return () => {
            stopMeasuring();
        };
    }, [stopMeasuring]);

    return {
        fps,
        isMonitoring,
        frameCount: frameCount.current,
        startMeasuring,
        stopMeasuring,
    };
}

// Hook for memory usage monitoring
export function useMemoryMonitoring() {
    const [memoryUsage, setMemoryUsage] = useState<{
        used: number;
        total: number;
        limit: number;
    }>({ used: 0, total: 0, limit: 0 });

    const updateMemoryUsage = useCallback(() => {
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            setMemoryUsage({
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit,
            });
        }
    }, []);

    useEffect(() => {
        updateMemoryUsage();

        const interval = setInterval(updateMemoryUsage, 1000);

        return () => clearInterval(interval);
    }, [updateMemoryUsage]);

    const getMemoryUsagePercentage = useCallback(() => {
        if (memoryUsage.limit === 0) return 0;
        return (memoryUsage.used / memoryUsage.limit) * 100;
    }, [memoryUsage]);

    const formatBytes = useCallback((bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    return {
        memoryUsage,
        getMemoryUsagePercentage,
        formatBytes,
        updateMemoryUsage,
    };
}