import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary, withErrorBoundary } from '../ErrorBoundary';

// Mock components and functions
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

// Component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return <div>No error</div>;
};

// Mock window.location
const mockLocation = {
    href: '',
    reload: vi.fn(),
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

describe('ErrorBoundary', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue('[]');
    });

    afterEach(() => {
        mockConsoleError.mockClear();
    });

    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>
        );

        expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('renders error UI when child component throws', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
        expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
    });

    it('logs error to console and localStorage', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(mockConsoleError).toHaveBeenCalledWith(
            'ErrorBoundary caught an error:',
            expect.any(Error),
            expect.any(Object)
        );

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'error_reports',
            expect.stringContaining('Test error message')
        );
    });

    it('calls custom onError handler when provided', () => {
        const onError = vi.fn();

        render(
            <ErrorBoundary onError={onError}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(onError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.any(Object)
        );
    });

    it('shows error details in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Error Details:')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
        expect(screen.getByText(/Error ID:/)).toBeInTheDocument();

        process.env.NODE_ENV = originalEnv;
    });

    it('hides error details in production mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.queryByText('Error Details:')).not.toBeInTheDocument();

        process.env.NODE_ENV = originalEnv;
    });

    it('resets error state when retry button is clicked', async () => {
        const { rerender } = render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /try again/i }));

        // Rerender with no error
        rerender(
            <ErrorBoundary>
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(screen.getByText('No error')).toBeInTheDocument();
        });
    });

    it('navigates to home when go home button is clicked', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /go home/i }));

        expect(mockLocation.href).toBe('/');
    });

    it('opens bug report when report button is clicked', () => {
        const mockOpen = vi.fn();
        window.open = mockOpen;

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /report this issue/i }));

        expect(mockOpen).toHaveBeenCalledWith(
            expect.stringContaining('/feedback?type=bug&error='),
            '_blank'
        );
    });

    it('renders custom fallback when provided', () => {
        const CustomFallback = <div>Custom error message</div>;

        render(
            <ErrorBoundary fallback={CustomFallback}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error message')).toBeInTheDocument();
        expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });

    it('handles localStorage errors gracefully', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
            throw new Error('localStorage error');
        });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Failed to store error report:',
            expect.any(Error)
        );
    });

    it('limits stored error reports to 10', () => {
        const existingErrors = Array.from({ length: 10 }, (_, i) => ({ id: i }));
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingErrors));

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'error_reports',
            expect.stringMatching(/^\[.*\]$/)
        );

        const storedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
        expect(storedData).toHaveLength(10);
    });
});

describe('withErrorBoundary HOC', () => {
    it('wraps component with ErrorBoundary', () => {
        const TestComponent = () => <div>Test Component</div>;
        const WrappedComponent = withErrorBoundary(TestComponent);

        render(<WrappedComponent />);

        expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('passes through props to wrapped component', () => {
        const TestComponent = ({ message }: { message: string }) => <div>{message}</div>;
        const WrappedComponent = withErrorBoundary(TestComponent);

        render(<WrappedComponent message="Hello World" />);

        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('catches errors in wrapped component', () => {
        const WrappedComponent = withErrorBoundary(ThrowError);

        render(<WrappedComponent shouldThrow={true} />);

        expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('sets correct display name', () => {
        const TestComponent = () => <div>Test</div>;
        TestComponent.displayName = 'TestComponent';

        const WrappedComponent = withErrorBoundary(TestComponent);

        expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)');
    });

    it('uses component name when displayName is not available', () => {
        function TestComponent() {
            return <div>Test</div>;
        }

        const WrappedComponent = withErrorBoundary(TestComponent);

        expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)');
    });
});