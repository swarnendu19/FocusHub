/**
 * Performance optimization utilities for animations and rendering
 */

// Hardware acceleration utilities
export const hardwareAcceleration = {
    // Force hardware acceleration for an element
    enable: (element: HTMLElement) => {
        element.style.transform = element.style.transform || 'translateZ(0)';
        element.style.willChange = 'transform, opacity';
    },

    // Remove hardware acceleration when not needed
    disable: (element: HTMLElement) => {
        element.style.willChange = 'auto';
    },

    // Optimize for animations
    optimizeForAnimation: (element: HTMLElement) => {
        element.style.willChange = 'transform, opacity';
        element.style.backfaceVisibility = 'hidden';
        element.style.perspective = '1000px';
    },
};

// Animation performance utilities
export const animationOptimization = {
    // Debounce animation triggers
    debounceAnimation: (callback: () => void, delay: number = 16) => {
        let timeoutId: NodeJS.Timeout;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(callback, delay);
        };
    },

    // Throttle scroll-based animations
    throttleScroll: (callback: (event: Event) => void, delay: number = 16) => {
        let isThrottled = false;
        return (event: Event) => {
            if (!isThrottled) {
                callback(event);
                isThrottled = true;
                setTimeout(() => {
                    isThrottled = false;
                }, delay);
            }
        };
    },

    // Request animation frame wrapper
    raf: (callback: () => void) => {
        return requestAnimationFrame(callback);
    },

    // Cancel animation frame
    cancelRaf: (id: number) => {
        cancelAnimationFrame(id);
    },
};

// Memory management utilities
export const memoryOptimization = {
    // Cleanup event listeners
    cleanupEventListeners: (element: HTMLElement, events: string[]) => {
        events.forEach(event => {
            element.removeEventListener(event, () => { });
        });
    },

    // Cleanup intersection observers
    cleanupObserver: (observer: IntersectionObserver) => {
        observer.disconnect();
    },

    // Cleanup timeouts and intervals
    cleanupTimers: (timers: (NodeJS.Timeout | number)[]) => {
        timers.forEach(timer => {
            if (typeof timer === 'number') {
                clearTimeout(timer);
                clearInterval(timer);
            } else {
                clearTimeout(timer);
            }
        });
    },
};

// Performance monitoring utilities
export const performanceMonitoring = {
    // Measure component render time
    measureRenderTime: (componentName: string, callback: () => void) => {
        const start = performance.now();
        callback();
        const end = performance.now();
        console.log(`${componentName} render time: ${end - start}ms`);
    },

    // Measure animation frame rate
    measureFPS: (duration: number = 1000): Promise<number> => {
        return new Promise((resolve) => {
            let frames = 0;
            const startTime = performance.now();

            const countFrame = () => {
                frames++;
                const currentTime = performance.now();

                if (currentTime - startTime < duration) {
                    requestAnimationFrame(countFrame);
                } else {
                    const fps = Math.round((frames * 1000) / (currentTime - startTime));
                    resolve(fps);
                }
            };

            requestAnimationFrame(countFrame);
        });
    },

    // Check if device supports hardware acceleration
    supportsHardwareAcceleration: (): boolean => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    },

    // Get device performance tier
    getPerformanceTier: (): 'low' | 'medium' | 'high' => {
        const memory = (navigator as any).deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;

        if (memory >= 8 && cores >= 8) return 'high';
        if (memory >= 4 && cores >= 4) return 'medium';
        return 'low';
    },
};

// Lazy loading utilities
export const lazyLoading = {
    // Create intersection observer for lazy loading
    createObserver: (
        callback: (entries: IntersectionObserverEntry[]) => void,
        options: IntersectionObserverInit = {}
    ): IntersectionObserver => {
        const defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1,
            ...options,
        };

        return new IntersectionObserver(callback, defaultOptions);
    },

    // Lazy load images
    lazyLoadImage: (img: HTMLImageElement, src: string) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        observer.observe(img);
        return observer;
    },

    // Preload critical images
    preloadImages: (urls: string[]): Promise<void[]> => {
        return Promise.all(
            urls.map(url => {
                return new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = reject;
                    img.src = url;
                });
            })
        );
    },
};

// Bundle size optimization utilities
export const bundleOptimization = {
    // Dynamic import with error handling
    dynamicImport: async <T>(importFn: () => Promise<T>): Promise<T | null> => {
        try {
            return await importFn();
        } catch (error) {
            console.error('Dynamic import failed:', error);
            return null;
        }
    },

    // Preload route chunks
    preloadRoute: (routePath: string) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = routePath;
        document.head.appendChild(link);
    },
};

// CSS optimization utilities
export const cssOptimization = {
    // Add critical CSS
    addCriticalCSS: (css: string) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    },

    // Remove unused CSS classes
    removeUnusedClasses: (element: HTMLElement, unusedClasses: string[]) => {
        unusedClasses.forEach(className => {
            element.classList.remove(className);
        });
    },

    // Optimize CSS animations
    optimizeCSSAnimation: (element: HTMLElement) => {
        element.style.animationFillMode = 'both';
        element.style.animationPlayState = 'running';
        element.style.transform = 'translateZ(0)'; // Force hardware acceleration
    },
};

// React-specific optimizations
export const reactOptimization = {
    // Memoization helper
    shouldComponentUpdate: (prevProps: any, nextProps: any, keys: string[]): boolean => {
        return keys.some(key => prevProps[key] !== nextProps[key]);
    },

    // Shallow compare for props
    shallowEqual: (obj1: any, obj2: any): boolean => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    },

    // Debounce state updates
    debounceStateUpdate: <T>(
        setState: React.Dispatch<React.SetStateAction<T>>,
        delay: number = 300
    ) => {
        let timeoutId: NodeJS.Timeout;
        return (value: T | ((prev: T) => T)) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setState(value);
            }, delay);
        };
    },
};

// Export all utilities
export const performanceUtils = {
    hardwareAcceleration,
    animationOptimization,
    memoryOptimization,
    performanceMonitoring,
    lazyLoading,
    bundleOptimization,
    cssOptimization,
    reactOptimization,
};

export default performanceUtils;