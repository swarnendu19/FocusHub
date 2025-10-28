/**
 * useAccessibility Hook
 * 
 * A comprehensive hook for managing accessibility preferences and features.
 */

import { useState, useEffect, useCallback } from 'react';
import { defaultAccessibilityConfig, AccessibilityConfig, accessibilityUtils } from '@/config/accessibility';

interface AccessibilityState {
    config: AccessibilityConfig;
    preferences: {
        reducedMotion: boolean;
        highContrast: boolean;
        darkMode: boolean;
        fontSize: number;
    };
    capabilities: {
        supportsReducedMotion: boolean;
        supportsHighContrast: boolean;
        supportsDarkMode: boolean;
        supportsForcedColors: boolean;
    };
}

export function useAccessibility() {
    const [state, setState] = useState<AccessibilityState>(() => {
        // Initialize with default values
        return {
            config: defaultAccessibilityConfig,
            preferences: {
                reducedMotion: false,
                highContrast: false,
                darkMode: false,
                fontSize: 16,
            },
            capabilities: {
                supportsReducedMotion: false,
                supportsHighContrast: false,
                supportsDarkMode: false,
                supportsForcedColors: false,
            },
        };
    });

    // Update preferences based on media queries
    const updatePreferences = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            preferences: {
                reducedMotion: accessibilityUtils.isReducedMotion(),
                highContrast: accessibilityUtils.isHighContrastMode(),
                darkMode: accessibilityUtils.isDarkMode(),
                fontSize: parseFloat(getComputedStyle(document.documentElement).fontSize),
            },
        }));
    }, []);

    // Check browser capabilities
    const checkCapabilities = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            capabilities: {
                supportsReducedMotion: 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').media !== 'not all',
                supportsHighContrast: 'matchMedia' in window && window.matchMedia('(prefers-contrast)').media !== 'not all',
                supportsDarkMode: 'matchMedia' in window && window.matchMedia('(prefers-color-scheme)').media !== 'not all',
                supportsForcedColors: 'matchMedia' in window && window.matchMedia('(forced-colors)').media !== 'not all',
            },
        }));
    }, []);

    // Set up media query listeners
    useEffect(() => {
        if (typeof window === 'undefined') return;

        checkCapabilities();
        updatePreferences();

        const mediaQueries = [
            window.matchMedia('(prefers-reduced-motion: reduce)'),
            window.matchMedia('(prefers-contrast: high)'),
            window.matchMedia('(prefers-color-scheme: dark)'),
            window.matchMedia('(forced-colors: active)'),
        ];

        const handleChange = () => {
            updatePreferences();
        };

        // Add listeners
        mediaQueries.forEach(mq => {
            if (mq.addEventListener) {
                mq.addEventListener('change', handleChange);
            } else {
                // Fallback for older browsers
                mq.addListener(handleChange);
            }
        });

        // Cleanup
        return () => {
            mediaQueries.forEach(mq => {
                if (mq.removeEventListener) {
                    mq.removeEventListener('change', handleChange);
                } else {
                    // Fallback for older browsers
                    mq.removeListener(handleChange);
                }
            });
        };
    }, [updatePreferences, checkCapabilities]);

    // Update configuration
    const updateConfig = useCallback((newConfig: Partial<AccessibilityConfig>) => {
        setState(prevState => ({
            ...prevState,
            config: {
                ...prevState.config,
                ...newConfig,
            },
        }));
    }, []);

    // Get animation duration based on preferences
    const getAnimationDuration = useCallback((type: 'short' | 'medium' | 'long') => {
        return accessibilityUtils.getAnimationDuration(type, state.config.respectReducedMotion);
    }, [state.config.respectReducedMotion]);

    // Get font size based on preferences
    const getFontSize = useCallback((baseSize: number) => {
        return accessibilityUtils.getFontSize(baseSize, state.config.respectFontSizePreferences);
    }, [state.config.respectFontSizePreferences]);

    // Announce message to screen readers
    const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        if (state.config.announceSuccessMessages || priority === 'assertive') {
            accessibilityUtils.announce(message, priority);
        }
    }, [state.config.announceSuccessMessages]);

    // Generate unique ID for ARIA relationships
    const generateId = useCallback((prefix?: string) => {
        return accessibilityUtils.generateId(prefix);
    }, []);

    // Create describedby string
    const createDescribedBy = useCallback((ids: (string | undefined)[]) => {
        return accessibilityUtils.createDescribedBy(ids);
    }, []);

    // Focus management utilities
    const focusUtils = {
        // Focus first focusable element in container
        focusFirst: (container: HTMLElement) => {
            const focusable = container.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as HTMLElement;
            focusable?.focus();
        },

        // Focus last focusable element in container
        focusLast: (container: HTMLElement) => {
            const focusable = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const lastFocusable = focusable[focusable.length - 1] as HTMLElement;
            lastFocusable?.focus();
        },

        // Trap focus within container
        trapFocus: (container: HTMLElement) => {
            if (!state.config.trapFocusInModals) return () => { };

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
            firstElement?.focus();

            // Return cleanup function
            return () => {
                container.removeEventListener('keydown', handleTabKey);
            };
        },
    };

    // Keyboard navigation utilities
    const keyboardUtils = {
        // Handle common keyboard patterns
        handleKeyNavigation: (
            event: React.KeyboardEvent,
            handlers: {
                onEnter?: () => void;
                onSpace?: () => void;
                onEscape?: () => void;
                onArrowUp?: () => void;
                onArrowDown?: () => void;
                onArrowLeft?: () => void;
                onArrowRight?: () => void;
                onHome?: () => void;
                onEnd?: () => void;
            }
        ) => {
            if (!state.config.enableKeyboardShortcuts) return;

            switch (event.key) {
                case 'Enter':
                    handlers.onEnter?.();
                    break;
                case ' ':
                    event.preventDefault();
                    handlers.onSpace?.();
                    break;
                case 'Escape':
                    handlers.onEscape?.();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    handlers.onArrowUp?.();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    handlers.onArrowDown?.();
                    break;
                case 'ArrowLeft':
                    handlers.onArrowLeft?.();
                    break;
                case 'ArrowRight':
                    handlers.onArrowRight?.();
                    break;
                case 'Home':
                    event.preventDefault();
                    handlers.onHome?.();
                    break;
                case 'End':
                    event.preventDefault();
                    handlers.onEnd?.();
                    break;
            }
        },
    };

    // Color and contrast utilities
    const colorUtils = {
        // Check if colors meet contrast requirements
        meetsContrastRequirement: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA') => {
            // This would need a proper color contrast calculation
            // For now, return true as a placeholder
            return true;
        },

        // Get appropriate colors for current mode
        getColors: () => ({
            text: state.preferences.darkMode ? '#ffffff' : '#000000',
            background: state.preferences.darkMode ? '#000000' : '#ffffff',
            primary: state.preferences.highContrast ? '#0000ff' : '#3b82f6',
            secondary: state.preferences.highContrast ? '#800080' : '#6b7280',
        }),
    };

    return {
        // State
        config: state.config,
        preferences: state.preferences,
        capabilities: state.capabilities,

        // Configuration
        updateConfig,

        // Utilities
        getAnimationDuration,
        getFontSize,
        announce,
        generateId,
        createDescribedBy,

        // Focus management
        focus: focusUtils,

        // Keyboard navigation
        keyboard: keyboardUtils,

        // Color and contrast
        color: colorUtils,

        // Convenience getters
        isReducedMotion: state.preferences.reducedMotion,
        isHighContrast: state.preferences.highContrast,
        isDarkMode: state.preferences.darkMode,
        fontSize: state.preferences.fontSize,
    };
}