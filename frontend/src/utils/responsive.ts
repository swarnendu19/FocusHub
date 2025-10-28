/**
 * Responsive Design Utilities
 * 
 * This utility provides tools for responsive design and device detection.
 */

import { useState, useEffect } from 'react';

// Breakpoint definitions (matching Tailwind CSS defaults)
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Device type detection
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function getDeviceType(width: number): DeviceType {
    if (width < breakpoints.md) return 'mobile';
    if (width < breakpoints.lg) return 'tablet';
    return 'desktop';
}

// Hook for current screen size
export function useScreenSize() {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}

// Hook for device type
export function useDeviceType(): DeviceType {
    const { width } = useScreenSize();
    return getDeviceType(width);
}

// Hook for breakpoint detection
export function useBreakpoint(breakpoint: Breakpoint): boolean {
    const { width } = useScreenSize();
    return width >= breakpoints[breakpoint];
}

// Hook for multiple breakpoints
export function useBreakpoints() {
    const { width } = useScreenSize();

    return {
        isSm: width >= breakpoints.sm,
        isMd: width >= breakpoints.md,
        isLg: width >= breakpoints.lg,
        isXl: width >= breakpoints.xl,
        is2Xl: width >= breakpoints['2xl'],
        current: Object.entries(breakpoints)
            .reverse()
            .find(([, value]) => width >= value)?.[0] as Breakpoint || 'sm',
    };
}

// Responsive value utility
export function useResponsiveValue<T>(values: {
    base: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
}): T {
    const breakpoints = useBreakpoints();

    if (breakpoints.is2Xl && values['2xl'] !== undefined) return values['2xl'];
    if (breakpoints.isXl && values.xl !== undefined) return values.xl;
    if (breakpoints.isLg && values.lg !== undefined) return values.lg;
    if (breakpoints.isMd && values.md !== undefined) return values.md;
    if (breakpoints.isSm && values.sm !== undefined) return values.sm;

    return values.base;
}

// Touch device detection
export function isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;

    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
}

// Hook for touch device detection
export function useIsTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(isTouchDevice());
    }, []);

    return isTouch;
}

// Orientation detection
export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
    const { width, height } = useScreenSize();
    return width > height ? 'landscape' : 'portrait';
}

// Safe area utilities for mobile devices
export function useSafeArea() {
    const [safeArea, setSafeArea] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateSafeArea = () => {
            const computedStyle = getComputedStyle(document.documentElement);

            setSafeArea({
                top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
                right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
                bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
                left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
            });
        };

        updateSafeArea();
        window.addEventListener('resize', updateSafeArea);
        window.addEventListener('orientationchange', updateSafeArea);

        return () => {
            window.removeEventListener('resize', updateSafeArea);
            window.removeEventListener('orientationchange', updateSafeArea);
        };
    }, []);

    return safeArea;
}

// Responsive grid utilities
export function getResponsiveColumns(deviceType: DeviceType): number {
    switch (deviceType) {
        case 'mobile':
            return 1;
        case 'tablet':
            return 2;
        case 'desktop':
            return 3;
        default:
            return 1;
    }
}

// Container query utilities (for modern browsers)
export function useContainerQuery(containerRef: React.RefObject<HTMLElement>) {
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [containerRef]);

    return containerSize;
}

// Responsive font size utility
export function getResponsiveFontSize(deviceType: DeviceType, baseSize: number): number {
    const multipliers = {
        mobile: 0.875,
        tablet: 1,
        desktop: 1.125,
    };

    return baseSize * multipliers[deviceType];
}

// Responsive spacing utility
export function getResponsiveSpacing(deviceType: DeviceType, baseSpacing: number): number {
    const multipliers = {
        mobile: 0.75,
        tablet: 1,
        desktop: 1.25,
    };

    return baseSpacing * multipliers[deviceType];
}

// Media query utilities for CSS-in-JS
export const mediaQueries = {
    sm: `@media (min-width: ${breakpoints.sm}px)`,
    md: `@media (min-width: ${breakpoints.md}px)`,
    lg: `@media (min-width: ${breakpoints.lg}px)`,
    xl: `@media (min-width: ${breakpoints.xl}px)`,
    '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,

    // Max-width queries
    maxSm: `@media (max-width: ${breakpoints.sm - 1}px)`,
    maxMd: `@media (max-width: ${breakpoints.md - 1}px)`,
    maxLg: `@media (max-width: ${breakpoints.lg - 1}px)`,
    maxXl: `@media (max-width: ${breakpoints.xl - 1}px)`,

    // Orientation queries
    portrait: '@media (orientation: portrait)',
    landscape: '@media (orientation: landscape)',

    // High DPI queries
    retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

    // Reduced motion query
    reducedMotion: '@media (prefers-reduced-motion: reduce)',

    // Dark mode query
    dark: '@media (prefers-color-scheme: dark)',

    // Touch device query
    touch: '@media (hover: none) and (pointer: coarse)',

    // Mouse device query
    mouse: '@media (hover: hover) and (pointer: fine)',
};

// Responsive image utilities
export function getResponsiveImageSizes(breakpoints: Record<Breakpoint, string>): string {
    return Object.entries(breakpoints)
        .map(([bp, size]) => `(min-width: ${breakpoints[bp as Breakpoint]}px) ${size}`)
        .join(', ');
}

// Viewport utilities
export function useViewportHeight(): number {
    const [vh, setVh] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateVh = () => {
            setVh(window.innerHeight * 0.01);
        };

        updateVh();
        window.addEventListener('resize', updateVh);
        window.addEventListener('orientationchange', updateVh);

        return () => {
            window.removeEventListener('resize', updateVh);
            window.removeEventListener('orientationchange', updateVh);
        };
    }, []);

    return vh;
}