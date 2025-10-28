import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { toast } from 'sonner';
import {
    OfflineHandler,
    useOfflineContext,
    OfflineIndicator,
    withOfflineSupport
} from '../OfflineHandler';

// Mock dependencies
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

vi.mock('@/hooks/useServiceWorker', () => ({
    useOnlineStatus: vi.fn(),
}));

import { useOnlineStatus } from '@/hooks/useServiceWorker';

const mockUseOnlineStatus = useOnlineStatus as vi.MockedFunction<typeof useOnlineStatus>;

// Test components
const TestChild = () => <div>Test content</div>;

const ContextConsumer = () => {
    const { isOnline, wasOffline } = useOfflineContext();
    return (
        <div>
            <span data-testid="online-status">{isOnline ? 'online' : 'offline'}</span>
            <span data-testid="was-offline">{wasOffline ? 'was-offline' : 'never-offline'}</span>
        </div>
    );
};

describe('OfflineHandler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseOnlineStatus.mockReturnValue(true);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders children when online', () => {
        mockUseOnlineStatus.mockReturnValue(true);

        render(
            <OfflineHandler>
                <TestChild />
            </OfflineHandler>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('shows offline banner when going offline', async () => {
        const { rerender } = render(
            <OfflineHandler showBanner={true}>
                <TestChild />
            </OfflineHandler>
        );

        // Simulate going offline
        mockUseOnlineStatus.mockReturnValue(false);
        rerender(
            <OfflineHandler showBanner={true}>
                <TestChild />
            </OfflineHandler>
        );

        await waitFor(() => {
            expect(screen.getByTestId('offline-banner')).toBeInTheDocument();
            expect(screen.getByText(/You're offline/)).toBeInTheDocument();
        });

        expect(toast.error).toHaveBeenCalledWith(
            'You are now offline. Some features may be limited.',
            expect.objectContaining({ duration: 5000 })
        );
    });

    it('shows success toast when coming back online', async () => {
        // Start offline
        mockUseOnlineStatus.mockReturnValue(false);
        const { rerender } = render(
            <OfflineHandler>
                <TestChild />
            </OfflineHandler>
        );

        // Go online
        mockUseOnlineStatus.mockReturnValue(true);
        rerender(
            <OfflineHandler>
                <TestChild />
            </OfflineHandler>
        );

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                'You are back online!',
                expect.objectContaining({ duration: 3000 })
            );
        });
    });

    it('shows full offline screen when gracefulDegradation is false', () => {
        mockUseOnlineStatus.mockReturnValue(false);

        render(
            <OfflineHandler gracefulDegradation={false}>
                <TestChild />
            </OfflineHandler>
        );

        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
        expect(screen.getByText("You're offline")).toBeInTheDocument();
        expect(screen.getByText(/check your internet connection/)).toBeInTheDocument();
        expect(screen.queryByText('Test content')).not.toBeInTheDocument();
    });

    it('allows dismissing offline banner', async () => {
        mockUseOnlineStatus.mockReturnValue(false);

        render(
            <OfflineHandler showBanner={true}>
                <TestChild />
            </OfflineHandler>
        );

        await waitFor(() => {
            expect(screen.getByTestId('offline-banner')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));

        await waitFor(() => {
            expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument();
        });
    });

    it('provides offline context to children', () => {
        mockUseOnlineStatus.mockReturnValue(false);

        render(
            <OfflineHandler>
                <ContextConsumer />
            </OfflineHandler>
        );

        expect(screen.getByTestId('online-status')).toHaveTextContent('offline');
    });

    it('tracks wasOffline state correctly', async () => {
        // Start online
        mockUseOnlineStatus.mockReturnValue(true);
        const { rerender } = render(
            <OfflineHandler>
                <ContextConsumer />
            </OfflineHandler>
        );

        expect(screen.getByTestId('was-offline')).toHaveTextContent('never-offline');

        // Go offline
        mockUseOnlineStatus.mockReturnValue(false);
        rerender(
            <OfflineHandler>
                <ContextConsumer />
            </OfflineHandler>
        );

        await waitFor(() => {
            expect(screen.getByTestId('was-offline')).toHaveTextContent('was-offline');
        });

        // Go back online
        mockUseOnlineStatus.mockReturnValue(true);
        rerender(
            <OfflineHandler>
                <ContextConsumer />
            </OfflineHandler>
        );

        await waitFor(() => {
            expect(screen.getByTestId('was-offline')).toHaveTextContent('never-offline');
        });
    });

    it('handles try again button in full offline mode', () => {
        mockUseOnlineStatus.mockReturnValue(false);
        const mockReload = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: mockReload },
            writable: true,
        });

        render(
            <OfflineHandler gracefulDegradation={false}>
                <TestChild />
            </OfflineHandler>
        );

        fireEvent.click(screen.getByRole('button', { name: /try again/i }));

        expect(mockReload).toHaveBeenCalled();
    });

    it('handles go back button in full offline mode', () => {
        mockUseOnlineStatus.mockReturnValue(false);
        const mockBack = vi.fn();
        Object.defineProperty(window, 'history', {
            value: { back: mockBack },
            writable: true,
        });

        render(
            <OfflineHandler gracefulDegradation={false}>
                <TestChild />
            </OfflineHandler>
        );

        fireEvent.click(screen.getByRole('button', { name: /go back/i }));

        expect(mockBack).toHaveBeenCalled();
    });

    it('does not show banner when showBanner is false', async () => {
        const { rerender } = render(
            <OfflineHandler showBanner={false}>
                <TestChild />
            </OfflineHandler>
        );

        mockUseOnlineStatus.mockReturnValue(false);
        rerender(
            <OfflineHandler showBanner={false}>
                <TestChild />
            </OfflineHandler>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument();
        });
    });
});

describe('OfflineIndicator', () => {
    beforeEach(() => {
        mockUseOnlineStatus.mockReturnValue(true);
    });

    it('renders nothing when online', () => {
        render(
            <OfflineHandler>
                <OfflineIndicator />
            </OfflineHandler>
        );

        expect(screen.queryByText('Offline')).not.toBeInTheDocument();
    });

    it('renders offline indicator when offline', () => {
        mockUseOnlineStatus.mockReturnValue(false);

        render(
            <OfflineHandler>
                <OfflineIndicator />
            </OfflineHandler>
        );

        expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        mockUseOnlineStatus.mockReturnValue(false);

        render(
            <OfflineHandler>
                <OfflineIndicator className="custom-class" />
            </OfflineHandler>
        );

        const indicator = screen.getByText('Offline').parentElement;
        expect(indicator).toHaveClass('custom-class');
    });
});

describe('withOfflineSupport HOC', () => {
    const TestComponent = ({ message }: { message: string }) => <div>{message}</div>;
    const FallbackComponent = ({ message }: { message: string }) => <div>Offline: {message}</div>;

    beforeEach(() => {
        mockUseOnlineStatus.mockReturnValue(true);
    });

    it('renders original component when online', () => {
        const WrappedComponent = withOfflineSupport(TestComponent);

        render(
            <OfflineHandler>
                <WrappedComponent message="Hello" />
            </OfflineHandler>
        );

        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('renders fallback component when offline and fallback is provided', () => {
        mockUseOnlineStatus.mockReturnValue(false);
        const WrappedComponent = withOfflineSupport(TestComponent, {
            fallbackComponent: FallbackComponent,
        });

        render(
            <OfflineHandler>
                <WrappedComponent message="Hello" />
            </OfflineHandler>
        );

        expect(screen.getByText('Offline: Hello')).toBeInTheDocument();
        expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });

    it('renders original component when offline and no fallback provided', () => {
        mockUseOnlineStatus.mockReturnValue(false);
        const WrappedComponent = withOfflineSupport(TestComponent);

        render(
            <OfflineHandler>
                <WrappedComponent message="Hello" />
            </OfflineHandler>
        );

        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('sets correct display name', () => {
        TestComponent.displayName = 'TestComponent';
        const WrappedComponent = withOfflineSupport(TestComponent);

        expect(WrappedComponent.displayName).toBe('withOfflineSupport(TestComponent)');
    });

    it('uses component name when displayName is not available', () => {
        function NamedComponent() {
            return <div>Test</div>;
        }

        const WrappedComponent = withOfflineSupport(NamedComponent);

        expect(WrappedComponent.displayName).toBe('withOfflineSupport(NamedComponent)');
    });
});