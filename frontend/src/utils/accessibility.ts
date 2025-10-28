/**
 * Accessibility Utilities
 * 
 * This utility provides tools for improving accessibility across the application.
 */

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Create a hook for reduced motion preference
export function useReducedMotion(): boolean {
    const [prefersReduced, setPrefersReduced] = React.useState(prefersReducedMotion);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleChange = () => {
            setPrefersReduced(mediaQuery.matches);
        };

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersReduced;
}

// Accessible animation variants that respect reduced motion
export function getAccessibleAnimationVariants(
    normalVariants: any,
    reducedVariants?: any
) {
    const shouldReduce = prefersReducedMotion();

    if (shouldReduce && reducedVariants) {
        return reducedVariants;
    }

    if (shouldReduce) {
        // Create reduced motion versions of normal variants
        const reduced = { ...normalVariants };

        // Remove or reduce animations
        Object.keys(reduced).forEach(key => {
            if (reduced[key].transition) {
                reduced[key].transition = { duration: 0.01 };
            }
        });

        return reduced;
    }

    return normalVariants;
}

// Focus management utilities
export class FocusManager {
    private static focusStack: HTMLElement[] = [];

    static pushFocus(element: HTMLElement): void {
        const currentFocus = document.activeElement as HTMLElement;
        if (currentFocus) {
            this.focusStack.push(currentFocus);
        }
        element.focus();
    }

    static popFocus(): void {
        const previousFocus = this.focusStack.pop();
        if (previousFocus) {
            previousFocus.focus();
        }
    }

    static trapFocus(container: HTMLElement): () => void {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);

        // Focus the first element
        firstElement?.focus();

        // Return cleanup function
        return () => {
            container.removeEventListener('keydown', handleTabKey);
        };
    }
}

// Screen reader utilities
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Keyboard navigation utilities
export function handleKeyboardNavigation(
    event: React.KeyboardEvent,
    options: {
        onEnter?: () => void;
        onSpace?: () => void;
        onEscape?: () => void;
        onArrowUp?: () => void;
        onArrowDown?: () => void;
        onArrowLeft?: () => void;
        onArrowRight?: () => void;
    }
): void {
    switch (event.key) {
        case 'Enter':
            options.onEnter?.();
            break;
        case ' ':
            event.preventDefault(); // Prevent page scroll
            options.onSpace?.();
            break;
        case 'Escape':
            options.onEscape?.();
            break;
        case 'ArrowUp':
            event.preventDefault();
            options.onArrowUp?.();
            break;
        case 'ArrowDown':
            event.preventDefault();
            options.onArrowDown?.();
            break;
        case 'ArrowLeft':
            options.onArrowLeft?.();
            break;
        case 'ArrowRight':
            options.onArrowRight?.();
            break;
    }
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
    // Convert colors to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    // Calculate relative luminance
    const l1 = getRelativeLuminance(rgb1);
    const l2 = getRelativeLuminance(rgb2);

    // Calculate contrast ratio
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// ARIA utilities
export function generateId(prefix: string = 'id'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createAriaDescribedBy(ids: string[]): string {
    return ids.filter(Boolean).join(' ');
}

// Skip link component utility
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): React.ReactElement {
    return React.createElement('a', {
        href: `#${targetId}`,
        className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded',
        children: text
    });
}

// Import React for hooks
import React from 'react';