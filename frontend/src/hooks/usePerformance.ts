import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { performanceUtils } from '@/utils/performance';

/**
 * Hook for hardware acceleration optimization
 */
export function useHardwareAcceleration(enabled: boolean = true) {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        if (enabled) {
            performanceUtils.hardwareAcceleration.enable(element);
        } else {
            performanceUtils.hardwareAcceleration.disable(element);
        }

        return () => {
            if (element) {
                performanceUtils.hardwareAcceleration.disable(element);
            }
        };
    }, [enabled]);

    return elementRef;
}

/**
 * Hook for optimizing animations
 */
export function useAnimationOptimization() {
    const rafId = useRef<number>();

    const startAnimation = useCallback((callback: () => void) => {
        rafId.current = performanceUtils.animationOptimization.raf(callback);
    }, []);

    const stopAnimation = useCallback(() => {
        if (rafId.current) {
            performanceUtils.animationOptimization.cancelRaf(rafId.current);
        }
    }, []);

    useEffect(() => {
        return () => {
            stopAnimation();
        };
    }, [stopAnimation]);

    return { startAnimation, stopAnimation };
}

/**
 * Hook for lazy loading with intersection observer
 */
export function useLazyLoading(options?: IntersectionObserverInit) {
    const elementRef = useRef<HTMLElement>(null);
    const observerRef = useRef<IntersectionObserver>();
    const isVisible = useRef(false);

    const observe = useCallback((callback: () => void) => {
        if (!elementRef.current) return;

        observerRef.current = performanceUtils.lazyLoading.createObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isVisible.current) {
                        isVisible.current = true;
                        callback();
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            options
        );

        observerRef.current.observe(elementRef.current);
    }, [options]);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return { elementRef, observe };
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitoring(componentName: string) {
    const renderCount = useRef(0);
    const renderTimes = useRef<number[]>([]);

    useEffect(() => {
        renderCount.current += 1;
        const startTime = performance.now();

        return () => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            renderTimes.current.push(renderTime);

            if (process.env.NODE_ENV === 'development') {
                console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
            }
        };
    });

    const getAverageRenderTime = useCallback(() => {
        if (renderTimes.current.length === 0) return 0;
        const sum = renderTimes.current.reduce((a, b) => a + b, 0);
        return sum / renderTimes.current.length;
    }, []);

    return {
        renderCount: renderCount.current,
        getAverageRenderTime,
    };
}

/**
 * Hook for debounced state updates
 */
export function useDebouncedState<T>(
    initialValue: T,
    delay: number = 300
): [T, (value: T | ((prev: T) => T)) => void] {
    const [state, setState] = useState(initialValue);
    const debouncedSetState = useMemo(
        () => performanceUtils.reactOptimization.debounceStateUpdate(setState, delay),
        [delay]
    );

    return [state, debouncedSetState];
}

/**
 * Hook for throttled callbacks
 */
export function useThrottledCallback<T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 100
): T {
    const throttledCallback = useMemo(
        () => {
            let isThrottled = false;
            return ((...args: Parameters<T>) => {
                if (!isThrottled) {
                    callback(...args);
                    isThrottled = true;
                    setTimeout(() => {
                        isThrottled = false;
                    }, delay);
                }
            }) as T;
        },
        [callback, delay]
    );

    return throttledCallback;
}

/**
 * Hook for memory cleanup
 */
export function useMemoryCleanup() {
    const timers = useRef<(NodeJS.Timeout | number)[]>([]);
    const observers = useRef<IntersectionObserver[]>([]);
    const eventListeners = useRef<Array<{
        element: HTMLElement;
        event: string;
        handler: EventListener;
    }>>([]);

    const addTimer = useCallback((timer: NodeJS.Timeout | number) => {
        timers.current.push(timer);
    }, []);

    const addObserver = useCallback((observer: IntersectionObserver) => {
        observers.current.push(observer);
    }, []);

    const addEventListener = useCallback((
        element: HTMLElement,
        event: string,
        handler: EventListener
    ) => {
        element.addEventListener(event, handler);
        eventListeners.current.push({ element, event, handler });
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup timers
            performanceUtils.memoryOptimization.cleanupTimers(timers.current);

            // Cleanup observers
            observers.current.forEach(observer => {
                performanceUtils.memoryOptimization.cleanupObserver(observer);
            });

            // Cleanup event listeners
            eventListeners.current.forEach(({ element, event, handler }) => {
                element.removeEventListener(event, handler);
            });
        };
    }, []);

    return {
        addTimer,
        addObserver,
        addEventListener,
    };
}

/**
 * Hook for device performance detection
 */
export function useDevicePerformance() {
    const performanceTier = useMemo(() => {
        return performanceUtils.performanceMonitoring.getPerformanceTier();
    }, []);

    const supportsHardwareAcceleration = useMemo(() => {
        return performanceUtils.performanceMonitoring.supportsHardwareAcceleration();
    }, []);

    const shouldReduceAnimations = useMemo(() => {
        return performanceTier === 'low' || !supportsHardwareAcceleration;
    }, [performanceTier, supportsHardwareAcceleration]);

    return {
        performanceTier,
        supportsHardwareAcceleration,
        shouldReduceAnimations,
    };
}

/**
 * Hook for FPS monitoring
 */
export function useFPSMonitoring(enabled: boolean = false) {
    const [fps, setFps] = useState<number>(60);
    const monitoringRef = useRef<boolean>(false);

    useEffect(() => {
        if (!enabled || monitoringRef.current) return;

        monitoringRef.current = true;

        const measureFPS = async () => {
            const measuredFPS = await performanceUtils.performanceMonitoring.measureFPS(1000);
            setFps(measuredFPS);

            if (enabled && monitoringRef.current) {
                setTimeout(measureFPS, 2000); // Measure every 2 seconds
            }
        };

        measureFPS();

        return () => {
            monitoringRef.current = false;
        };
    }, [enabled]);

    return fps;
}