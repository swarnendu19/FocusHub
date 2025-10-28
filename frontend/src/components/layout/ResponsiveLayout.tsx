import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDeviceType, useBreakpoint, useSafeArea } from '@/utils/responsive';
import { useReducedMotion } from '@/utils/accessibility';
import { ResponsiveNavigation } from './ResponsiveNavigation';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
    className?: string;
    showNavigation?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * ResponsiveLayout Component
 * 
 * A responsive layout wrapper that:
 * - Adapts to different screen sizes
 * - Handles safe areas on mobile devices
 * - Provides consistent spacing and navigation
 * - Supports reduced motion preferences
 */
export function ResponsiveLayout({
    children,
    className,
    showNavigation = true,
    maxWidth = 'full',
    padding = 'md',
}: ResponsiveLayoutProps) {
    const deviceType = useDeviceType();
    const isDesktop = useBreakpoint('lg');
    const safeArea = useSafeArea();
    const prefersReducedMotion = useReducedMotion();

    // Calculate layout dimensions
    const getLayoutStyles = () => {
        const styles: React.CSSProperties = {};

        // Add safe area padding for mobile devices
        if (deviceType === 'mobile') {
            styles.paddingTop = safeArea.top;
            styles.paddingBottom = safeArea.bottom;
            styles.paddingLeft = safeArea.left;
            styles.paddingRight = safeArea.right;
        }

        return styles;
    };

    // Get max width class
    const getMaxWidthClass = () => {
        const maxWidthClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
            full: 'max-w-full',
        };

        return maxWidthClasses[maxWidth];
    };

    // Get padding class
    const getPaddingClass = () => {
        const paddingClasses = {
            none: '',
            sm: 'p-2 sm:p-4',
            md: 'p-4 sm:p-6',
            lg: 'p-6 sm:p-8',
        };

        return paddingClasses[padding];
    };

    // Animation variants for page transitions
    const pageVariants = {
        initial: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 20,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.3,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : -20,
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.2,
                ease: 'easeIn',
            },
        },
    };

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
            style={getLayoutStyles()}
        >
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Skip to main content
            </a>

            {/* Navigation */}
            {showNavigation && <ResponsiveNavigation />}

            {/* Main content area */}
            <main
                id="main-content"
                className={cn(
                    'min-h-screen',
                    // Desktop layout with sidebar
                    isDesktop && showNavigation && 'ml-64',
                    // Mobile layout adjustments
                    !isDesktop && showNavigation && 'pt-16 pb-20',
                    // No navigation adjustments
                    !showNavigation && 'pt-0',
                    className
                )}
                role="main"
                aria-label="Main content"
            >
                <motion.div
                    className={cn(
                        'mx-auto',
                        getMaxWidthClass(),
                        getPaddingClass()
                    )}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}

// Responsive grid component
interface ResponsiveGridProps {
    children: React.ReactNode;
    className?: string;
    columns?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
    };
    gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({
    children,
    className,
    columns = { mobile: 1, tablet: 2, desktop: 3 },
    gap = 'md',
}: ResponsiveGridProps) {
    const deviceType = useDeviceType();

    const getGridColumns = () => {
        switch (deviceType) {
            case 'mobile':
                return columns.mobile || 1;
            case 'tablet':
                return columns.tablet || 2;
            case 'desktop':
                return columns.desktop || 3;
            default:
                return 1;
        }
    };

    const getGapClass = () => {
        const gapClasses = {
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
        };

        return gapClasses[gap];
    };

    return (
        <div
            className={cn(
                'grid',
                getGapClass(),
                className
            )}
            style={{
                gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </div>
    );
}

// Responsive container component
interface ResponsiveContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    center?: boolean;
}

export function ResponsiveContainer({
    children,
    className,
    size = 'lg',
    center = true,
}: ResponsiveContainerProps) {
    const getContainerClass = () => {
        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-4xl',
            xl: 'max-w-6xl',
            full: 'max-w-full',
        };

        return sizeClasses[size];
    };

    return (
        <div
            className={cn(
                'w-full',
                getContainerClass(),
                center && 'mx-auto',
                'px-4 sm:px-6 lg:px-8',
                className
            )}
        >
            {children}
        </div>
    );
}

// Responsive text component
interface ResponsiveTextProps {
    children: React.ReactNode;
    className?: string;
    size?: {
        mobile?: string;
        tablet?: string;
        desktop?: string;
    };
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: 'primary' | 'secondary' | 'muted';
}

export function ResponsiveText({
    children,
    className,
    size = {
        mobile: 'text-sm',
        tablet: 'text-base',
        desktop: 'text-lg',
    },
    weight = 'normal',
    color = 'primary',
}: ResponsiveTextProps) {
    const getWeightClass = () => {
        const weightClasses = {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
        };

        return weightClasses[weight];
    };

    const getColorClass = () => {
        const colorClasses = {
            primary: 'text-gray-900 dark:text-white',
            secondary: 'text-gray-700 dark:text-gray-300',
            muted: 'text-gray-500 dark:text-gray-400',
        };

        return colorClasses[color];
    };

    return (
        <span
            className={cn(
                size.mobile,
                `sm:${size.tablet}`,
                `lg:${size.desktop}`,
                getWeightClass(),
                getColorClass(),
                className
            )}
        >
            {children}
        </span>
    );
}