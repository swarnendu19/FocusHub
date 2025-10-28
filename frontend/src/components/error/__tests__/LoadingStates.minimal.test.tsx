import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from '../LoadingStates';

describe('LoadingStates - Minimal Tests', () => {
    describe('LoadingSpinner', () => {
        it('renders with default props', () => {
            render(<LoadingSpinner />);

            // Check if spinner is rendered (look for the animate-spin class)
            const spinner = document.querySelector('.animate-spin');
            expect(spinner).toBeInTheDocument();
        });

        it('renders with text', () => {
            render(<LoadingSpinner text="Loading data..." />);

            expect(screen.getByText('Loading data...')).toBeInTheDocument();
        });

        it('applies size classes correctly', () => {
            const { rerender } = render(<LoadingSpinner size="sm" />);
            let spinner = document.querySelector('.animate-spin');
            expect(spinner).toHaveClass('w-4', 'h-4');

            rerender(<LoadingSpinner size="md" />);
            spinner = document.querySelector('.animate-spin');
            expect(spinner).toHaveClass('w-6', 'h-6');

            rerender(<LoadingSpinner size="lg" />);
            spinner = document.querySelector('.animate-spin');
            expect(spinner).toHaveClass('w-8', 'h-8');
        });

        it('applies color classes correctly', () => {
            const { rerender } = render(<LoadingSpinner color="primary" />);
            let spinner = document.querySelector('.animate-spin');
            expect(spinner).toHaveClass('text-primary');

            rerender(<LoadingSpinner color="secondary" />);
            spinner = document.querySelector('.animate-spin');
            expect(spinner).toHaveClass('text-secondary');

            rerender(<LoadingSpinner color="muted" />);
            spinner = document.querySelector('.animate-spin');
            expect(spinner).toHaveClass('text-muted-foreground');
        });
    });
});