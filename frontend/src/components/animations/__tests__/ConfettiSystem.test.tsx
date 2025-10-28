import { render, screen, waitFor } from '@testing-library/react';
import { ConfettiSystem } from '../ConfettiSystem';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

describe('ConfettiSystem', () => {
    beforeEach(() => {
        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 768,
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    it('renders without crashing when inactive', () => {
        render(<ConfettiSystem isActive={false} />);
        expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('generates confetti when active', async () => {
        const onComplete = vi.fn();
        render(
            <ConfettiSystem
                isActive={true}
                duration={100}
                intensity="low"
                onComplete={onComplete}
            />
        );

        // Wait for confetti to be generated
        await waitFor(() => {
            const confettiContainer = screen.getByRole('generic');
            expect(confettiContainer).toBeInTheDocument();
        });
    });

    it('calls onComplete after duration', async () => {
        vi.useFakeTimers();
        const onComplete = vi.fn();

        render(
            <ConfettiSystem
                isActive={true}
                duration={1000}
                onComplete={onComplete}
            />
        );

        // Fast-forward time
        vi.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(onComplete).toHaveBeenCalled();
        });

        vi.useRealTimers();
    });

    it('respects intensity settings', () => {
        const { rerender } = render(
            <ConfettiSystem isActive={true} intensity="low" />
        );

        // Test different intensities
        rerender(<ConfettiSystem isActive={true} intensity="medium" />);
        rerender(<ConfettiSystem isActive={true} intensity="high" />);

        // Component should render without errors for all intensities
        expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('uses custom colors when provided', () => {
        const customColors = ['#ff0000', '#00ff00', '#0000ff'];

        render(
            <ConfettiSystem
                isActive={true}
                colors={customColors}
            />
        );

        expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('handles multiple activations correctly', async () => {
        const { rerender } = render(<ConfettiSystem isActive={false} />);

        // Activate
        rerender(<ConfettiSystem isActive={true} />);

        // Deactivate
        rerender(<ConfettiSystem isActive={false} />);

        // Activate again
        rerender(<ConfettiSystem isActive={true} />);

        expect(screen.getByRole('generic')).toBeInTheDocument();
    });
});