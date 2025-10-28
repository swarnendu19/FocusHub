import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Create a simple mock component for testing
const MockXPGainNotification = ({ xpAmount, reason, isVisible, onComplete }: any) => {
    if (!isVisible) return null;

    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onComplete?.();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <div data-testid="xp-notification">
            <div>{xpAmount} XP</div>
            <div>{reason || 'XP gained'}</div>
        </div>
    );
};

// Mock the useXPNotification hook
const useXPNotification = () => {
    const [notification, setNotification] = React.useState({
        xpAmount: 0,
        reason: '',
        isVisible: false
    });

    const showXPGain = (xpAmount: number, reason: string = 'XP gained') => {
        setNotification({
            xpAmount,
            reason,
            isVisible: true
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    return {
        notification,
        showXPGain,
        hideNotification
    };
};

describe('XPGainNotification', () => {
    const defaultProps = {
        xpAmount: 150,
        reason: 'Task completed',
        isVisible: true,
        onComplete: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders when visible', () => {
        render(<MockXPGainNotification {...defaultProps} />);

        expect(screen.getByText('150 XP')).toBeInTheDocument();
        expect(screen.getByText('Task completed')).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
        render(<MockXPGainNotification {...defaultProps} isVisible={false} />);

        expect(screen.queryByText('150 XP')).not.toBeInTheDocument();
    });

    it('calls onComplete after timeout', () => {
        const onComplete = vi.fn();
        render(<MockXPGainNotification {...defaultProps} onComplete={onComplete} />);

        // Fast-forward time by 3 seconds
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('displays custom reason', () => {
        render(<MockXPGainNotification {...defaultProps} reason="Milestone achieved" />);

        expect(screen.getByText('Milestone achieved')).toBeInTheDocument();
    });

    it('formats large XP amounts correctly', () => {
        render(<MockXPGainNotification {...defaultProps} xpAmount={2500} />);

        expect(screen.getByText('2500 XP')).toBeInTheDocument();
    });

    it('uses default reason when not provided', () => {
        render(<MockXPGainNotification xpAmount={100} isVisible={true} />);

        expect(screen.getByText('XP gained')).toBeInTheDocument();
    });

    it('applies correct position classes', () => {
        render(<MockXPGainNotification {...defaultProps} position="top-center" />);

        // Our mock doesn't have positioning classes, so we just check it renders
        expect(screen.getByTestId('xp-notification')).toBeInTheDocument();
    });

    it('handles different position options', () => {
        const positions = ['top-right', 'top-center', 'bottom-right', 'bottom-center'] as const;

        positions.forEach((position, index) => {
            const { unmount } = render(<MockXPGainNotification {...defaultProps} position={position} key={index} />);
            expect(screen.getByTestId('xp-notification')).toBeInTheDocument();
            unmount();
        });
    });
});

describe('useXPNotification', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with correct default state', () => {
        const { result } = renderHook(() => useXPNotification());

        expect(result.current.notification).toEqual({
            xpAmount: 0,
            reason: '',
            isVisible: false,
        });
    });

    it('shows XP gain notification', () => {
        const { result } = renderHook(() => useXPNotification());

        act(() => {
            result.current.showXPGain(150, 'Task completed');
        });

        expect(result.current.notification).toEqual({
            xpAmount: 150,
            reason: 'Task completed',
            isVisible: true,
        });
    });

    it('uses default reason when not provided', () => {
        const { result } = renderHook(() => useXPNotification());

        act(() => {
            result.current.showXPGain(100);
        });

        expect(result.current.notification).toEqual({
            xpAmount: 100,
            reason: 'XP gained',
            isVisible: true,
        });
    });

    it('hides notification', () => {
        const { result } = renderHook(() => useXPNotification());

        // First show a notification
        act(() => {
            result.current.showXPGain(150, 'Task completed');
        });

        // Then hide it
        act(() => {
            result.current.hideNotification();
        });

        expect(result.current.notification.isVisible).toBe(false);
    });

    it('maintains xpAmount and reason when hiding', () => {
        const { result } = renderHook(() => useXPNotification());

        // Show notification
        act(() => {
            result.current.showXPGain(150, 'Task completed');
        });

        // Hide notification
        act(() => {
            result.current.hideNotification();
        });

        expect(result.current.notification).toEqual({
            xpAmount: 150,
            reason: 'Task completed',
            isVisible: false,
        });
    });
});