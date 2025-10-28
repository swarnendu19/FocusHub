import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';
import { handleKeyboardNavigation, announceToScreenReader } from '@/utils/accessibility';
import { useReducedMotion } from '@/utils/accessibility';

interface AccessibleButtonProps extends ButtonProps {
    // Accessibility props
    ariaLabel?: string;
    ariaDescribedBy?: string;
    ariaExpanded?: boolean;
    ariaPressed?: boolean;
    ariaHaspopup?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

    // Loading state
    loading?: boolean;
    loadingText?: string;

    // Success feedback
    showSuccessFeedback?: boolean;
    successMessage?: string;

    // Keyboard navigation
    onEnterPress?: () => void;
    onSpacePress?: () => void;

    // Touch feedback
    hapticFeedback?: boolean;

    // Icon support
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    // Responsive sizing
    responsiveSize?: {
        mobile?: ButtonProps['size'];
        tablet?: ButtonProps['size'];
        desktop?: ButtonProps['size'];
    };
}

/**
 * AccessibleButton Component
 * 
 * An enhanced button component with comprehensive accessibility features:
 * - Full keyboard navigation support
 * - Screen reader announcements
 * - Loading states with proper ARIA attributes
 * - Success feedback
 * - Reduced motion support
 * - Touch feedback
 * - Responsive sizing
 */
export const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
    ({
        children,
        className,
        disabled,
        loading = false,
        loadingText = 'Loading...',
        showSuccessFeedback = false,
        successMessage = 'Action completed',
        ariaLabel,
        ariaDescribedBy,
        ariaExpanded,
        ariaPressed,
        ariaHaspopup,
        onEnterPress,
        onSpacePress,
        onClick,
        onKeyDown,
        hapticFeedback = false,
        leftIcon,
        rightIcon,
        responsiveSize,
        ...props
    }, ref) => {
        const [showSuccess, setShowSuccess] = React.useState(false);
        const prefersReducedMotion = useReducedMotion();

        // Handle click with success feedback
        const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
            if (loading || disabled) return;

            // Haptic feedback for mobile devices
            if (hapticFeedback && 'vibrate' in navigator) {
                navigator.vibrate(50);
            }

            onClick?.(event);

            // Show success feedback if enabled
            if (showSuccessFeedback) {
                setShowSuccess(true);
                announceToScreenReader(successMessage);

                setTimeout(() => {
                    setShowSuccess(false);
                }, 2000);
            }
        }, [loading, disabled, onClick, showSuccessFeedback, successMessage, hapticFeedback]);

        // Handle keyboard navigation
        const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
            handleKeyboardNavigation(event, {
                onEnter: onEnterPress || (() => handleClick(event as any)),
                onSpace: onSpacePress || (() => handleClick(event as any)),
            });

            onKeyDown?.(event);
        }, [onEnterPress, onSpacePress, handleClick, onKeyDown]);

        // Determine current size based on screen size
        const getCurrentSize = () => {
            if (!responsiveSize) return props.size;

            // This would need to be implemented with a responsive hook
            // For now, return default size
            return props.size;
        };

        // Loading spinner component
        const LoadingSpinner = () => (
            <svg
                className={cn(
                    'animate-spin h-4 w-4',
                    prefersReducedMotion && 'animate-none'
                )}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        );

        // Success checkmark component
        const SuccessIcon = () => (
            <svg
                className="h-4 w-4 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                />
            </svg>
        );

        const buttonContent = () => {
            if (loading) {
                return (
                    <>
                        <LoadingSpinner />
                        <span className="ml-2">{loadingText}</span>
                    </>
                );
            }

            if (showSuccess) {
                return (
                    <>
                        <SuccessIcon />
                        <span className="ml-2">{successMessage}</span>
                    </>
                );
            }

            return (
                <>
                    {leftIcon && <span className="mr-2" aria-hidden="true">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
                </>
            );
        };

        return (
            <Button
                ref={ref}
                className={cn(
                    // Focus styles for better accessibility
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    // Reduced motion support
                    prefersReducedMotion && 'transition-none',
                    // Success state styling
                    showSuccess && 'bg-green-500 hover:bg-green-600',
                    className
                )}
                disabled={disabled || loading}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                size={getCurrentSize()}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
                aria-haspopup={ariaHaspopup}
                aria-busy={loading}
                aria-live={showSuccessFeedback ? 'polite' : undefined}
                {...props}
            >
                {buttonContent()}
            </Button>
        );
    }
);

AccessibleButton.displayName = 'AccessibleButton';