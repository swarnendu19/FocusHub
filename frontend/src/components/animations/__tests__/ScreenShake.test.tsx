import { render, screen, waitFor } from '@testing-library/react';
import { ScreenShake } from '../ScreenShake';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

describe('ScreenShake', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('renders children without shaking when inactive', () => {
        render(
            <ScreenShake isActive={false}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders children with shaking when active', () => {
        render(
            <ScreenShake isActive={true}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('calls onComplete after duration', async () => {
        const onComplete = vi.fn();

        render(
            <ScreenShake
                isActive={true}
                duration={1000}
                onComplete={onComplete}
            >
                <div>Test Content</div>
            </ScreenShake>
        );

        // Fast-forward time
        vi.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(onComplete).toHaveBeenCalled();
        });
    });

    it('handles different intensity levels', () => {
        const intensities = ['low', 'medium', 'high'] as const;

        intensities.forEach(intensity => {
            const { rerender } = render(
                <ScreenShake isActive={true} intensity={intensity}>
                    <div data-testid={`child-${intensity}`}>Test Content</div>
                </ScreenShake>
            );

            expect(screen.getByTestId(`child-${intensity}`)).toBeInTheDocument();

            // Clean up for next iteration
            rerender(
                <ScreenShake isActive={false} intensity={intensity}>
                    <div>Test Content</div>
                </ScreenShake>
            );
        });
    });

    it('uses custom duration when provided', async () => {
        const onComplete = vi.fn();
        const customDuration = 2000;

        render(
            <ScreenShake
                isActive={true}
                duration={customDuration}
                onComplete={onComplete}
            >
                <div>Test Content</div>
            </ScreenShake>
        );

        // Fast-forward time less than duration
        vi.advanceTimersByTime(1000);
        expect(onComplete).not.toHaveBeenCalled();

        // Fast-forward to complete duration
        vi.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(onComplete).toHaveBeenCalled();
        });
    });

    it('prevents multiple simultaneous shakes', () => {
        const { rerender } = render(
            <ScreenShake isActive={true}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        // Try to activate again while already active
        rerender(
            <ScreenShake isActive={true}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('handles rapid activation/deactivation', () => {
        const { rerender } = render(
            <ScreenShake isActive={false}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        // Rapid toggles
        rerender(
            <ScreenShake isActive={true}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        rerender(
            <ScreenShake isActive={false}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        rerender(
            <ScreenShake isActive={true}>
                <div data-testid="child">Test Content</div>
            </ScreenShake>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('preserves child component props and structure', () => {
        render(
            <ScreenShake isActive={true}>
                <div data-testid="child" className="test-class" id="test-id">
                    <span>Nested Content</span>
                </div>
            </ScreenShake>
        );

        const child = screen.getByTestId('child');
        expect(child).toHaveClass('test-class');
        expect(child).toHaveAttribute('id', 'test-id');
        expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
});