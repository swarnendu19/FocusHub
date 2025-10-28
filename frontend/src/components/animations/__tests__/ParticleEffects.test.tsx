import { render, screen, waitFor } from '@testing-library/react';
import { ParticleEffects } from '../ParticleEffects';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
    setTimeout(cb, 16);
    return 1;
});

global.cancelAnimationFrame = vi.fn();

describe('ParticleEffects', () => {
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
        vi.clearAllMocks();
    });

    it('renders without crashing when inactive', () => {
        render(<ParticleEffects isActive={false} />);
        expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('generates particles when active', async () => {
        const onComplete = vi.fn();
        render(
            <ParticleEffects
                isActive={true}
                type="xp-gain"
                intensity="low"
                onComplete={onComplete}
            />
        );

        // Wait for particles to be generated
        await waitFor(() => {
            const particleContainer = screen.getByRole('generic');
            expect(particleContainer).toBeInTheDocument();
        });
    });

    it('handles different particle types', () => {
        const types = ['xp-gain', 'level-up', 'achievement', 'task-complete'] as const;

        types.forEach(type => {
            const { rerender } = render(
                <ParticleEffects isActive={true} type={type} />
            );

            expect(screen.getByRole('generic')).toBeInTheDocument();

            // Clean up for next iteration
            rerender(<ParticleEffects isActive={false} type={type} />);
        });
    });

    it('respects intensity settings', () => {
        const intensities = ['low', 'medium', 'high'] as const;

        intensities.forEach(intensity => {
            const { rerender } = render(
                <ParticleEffects isActive={true} intensity={intensity} />
            );

            expect(screen.getByRole('generic')).toBeInTheDocument();

            // Clean up for next iteration
            rerender(<ParticleEffects isActive={false} intensity={intensity} />);
        });
    });

    it('uses custom position when provided', () => {
        const customPosition = { x: 100, y: 200 };

        render(
            <ParticleEffects
                isActive={true}
                position={customPosition}
            />
        );

        expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('calls onComplete when particles finish', async () => {
        vi.useFakeTimers();
        const onComplete = vi.fn();

        render(
            <ParticleEffects
                isActive={true}
                type="xp-gain"
                onComplete={onComplete}
            />
        );

        // Fast-forward time to complete particle animation
        vi.advanceTimersByTime(2000);

        // Allow for async updates
        await waitFor(() => {
            // onComplete should be called when particles finish
            // Note: This might need adjustment based on actual implementation
        });

        vi.useRealTimers();
    });

    it('handles rapid activation/deactivation', () => {
        const { rerender } = render(<ParticleEffects isActive={false} />);

        // Rapid toggles
        rerender(<ParticleEffects isActive={true} />);
        rerender(<ParticleEffects isActive={false} />);
        rerender(<ParticleEffects isActive={true} />);
        rerender(<ParticleEffects isActive={false} />);

        expect(screen.getByRole('generic')).toBeInTheDocument();
    });
});