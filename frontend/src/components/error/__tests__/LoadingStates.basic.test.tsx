import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import {
    LoadingSpinner,
    ErrorState,
    EmptyState,
    SuccessState,
} from '../LoadingStates';

describe('LoadingStates - Basic Tests', () => {
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
    });

    describe('ErrorState', () => {
        it('renders with default props', () => {
            render(<ErrorState />);

            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
            expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
        });

        it('renders with custom title and message', () => {
            render(
                <ErrorState
                    title="Custom Error"
                    message="This is a custom error message"
                />
            );

            expect(screen.getByText('Custom Error')).toBeInTheDocument();
            expect(screen.getByText('This is a custom error message')).toBeInTheDocument();
        });

        it('renders action button when provided', () => {
            const mockAction = vi.fn();
            render(
                <ErrorState
                    action={{ label: 'Retry', onClick: mockAction }}
                />
            );

            const button = screen.getByRole('button', { name: 'Retry' });
            expect(button).toBeInTheDocument();

            fireEvent.click(button);
            expect(mockAction).toHaveBeenCalled();
        });
    });

    describe('EmptyState', () => {
        it('renders with default props', () => {
            render(<EmptyState />);

            expect(screen.getByText('No data available')).toBeInTheDocument();
            expect(screen.getByText('There is nothing to show here yet.')).toBeInTheDocument();
        });

        it('renders action button when provided', () => {
            const mockAction = vi.fn();
            render(
                <EmptyState
                    action={{ label: 'Add Item', onClick: mockAction }}
                />
            );

            const button = screen.getByRole('button', { name: 'Add Item' });
            expect(button).toBeInTheDocument();

            fireEvent.click(button);
            expect(mockAction).toHaveBeenCalled();
        });
    });

    describe('SuccessState', () => {
        it('renders with default props', () => {
            render(<SuccessState />);

            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(screen.getByText('Operation completed successfully.')).toBeInTheDocument();
        });

        it('renders action button when provided', () => {
            const mockAction = vi.fn();
            render(
                <SuccessState
                    action={{ label: 'Continue', onClick: mockAction }}
                />
            );

            const button = screen.getByRole('button', { name: 'Continue' });
            expect(button).toBeInTheDocument();

            fireEvent.click(button);
            expect(mockAction).toHaveBeenCalled();
        });
    });
});