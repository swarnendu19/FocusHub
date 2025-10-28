import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import {
    LoadingSpinner,
    FullPageLoading,
    SkeletonCard,
    SkeletonList,
    SkeletonChart,
    ErrorState,
    EmptyState,
    SuccessState,
} from '../LoadingStates';

describe('LoadingSpinner', () => {
    it('renders with default props', () => {
        render(<LoadingSpinner />);

        const spinner = screen.getByRole('status', { hidden: true });
        expect(spinner).toBeInTheDocument();
    });

    it('renders with text', () => {
        render(<LoadingSpinner text="Loading data..." />);

        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
        const { rerender } = render(<LoadingSpinner size="sm" />);
        let spinner = screen.getByRole('status', { hidden: true });
        expect(spinner).toHaveClass('w-4', 'h-4');

        rerender(<LoadingSpinner size="md" />);
        spinner = screen.getByRole('status', { hidden: true });
        expect(spinner).toHaveClass('w-6', 'h-6');

        rerender(<LoadingSpinner size="lg" />);
        spinner = screen.getByRole('status', { hidden: true });
        expect(spinner).toHaveClass('w-8', 'h-8');
    });

    it('applies color classes correctly', () => {
        const { rerender } = render(<LoadingSpinner color="primary" />);
        let spinner = screen.getByRole('status', { hidden: true });
        expect(spinner).toHaveClass('text-primary');

        rerender(<LoadingSpinner color="secondary" />);
        spinner = screen.getByRole('status', { hidden: true });
        expect(spinner).toHaveClass('text-secondary');

        rerender(<LoadingSpinner color="muted" />);
        spinner = screen.getByRole('status', { hidden: true });
        expect(spinner).toHaveClass('text-muted-foreground');
    });

    it('applies custom className', () => {
        render(<LoadingSpinner className="custom-class" />);

        const container = screen.getByRole('status', { hidden: true }).parentElement;
        expect(container).toHaveClass('custom-class');
    });
});

describe('FullPageLoading', () => {
    it('renders with default message', () => {
        render(<FullPageLoading />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
        render(<FullPageLoading message="Loading dashboard..." />);

        expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('shows progress bar when showProgress is true', () => {
        render(<FullPageLoading showProgress={true} progress={50} />);

        expect(screen.getByText('50% complete')).toBeInTheDocument();
    });

    it('does not show progress bar by default', () => {
        render(<FullPageLoading />);

        expect(screen.queryByText(/% complete/)).not.toBeInTheDocument();
    });

    it('updates progress bar width', () => {
        render(<FullPageLoading showProgress={true} progress={75} />);

        expect(screen.getByText('75% complete')).toBeInTheDocument();
    });
});

describe('SkeletonCard', () => {
    it('renders skeleton card structure', () => {
        render(<SkeletonCard />);

        const skeleton = document.querySelector('.animate-pulse');
        expect(skeleton).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<SkeletonCard className="custom-skeleton" />);

        const skeleton = document.querySelector('.custom-skeleton');
        expect(skeleton).toBeInTheDocument();
    });
});

describe('SkeletonList', () => {
    it('renders default number of skeleton items', () => {
        render(<SkeletonList />);

        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons).toHaveLength(3);
    });

    it('renders custom number of skeleton items', () => {
        render(<SkeletonList count={5} />);

        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons).toHaveLength(5);
    });

    it('applies custom className', () => {
        render(<SkeletonList className="custom-list" />);

        const container = document.querySelector('.custom-list');
        expect(container).toBeInTheDocument();
    });
});

describe('SkeletonChart', () => {
    it('renders skeleton chart structure', () => {
        render(<SkeletonChart />);

        const skeleton = document.querySelector('.animate-pulse');
        expect(skeleton).toBeInTheDocument();
    });

    it('renders chart bars', () => {
        render(<SkeletonChart />);

        const bars = document.querySelectorAll('.bg-gray-300.rounded-t.flex-1');
        expect(bars).toHaveLength(7);
    });

    it('applies custom className', () => {
        render(<SkeletonChart className="custom-chart" />);

        const skeleton = document.querySelector('.custom-chart');
        expect(skeleton).toBeInTheDocument();
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

    it('renders secondary action button when provided', () => {
        const mockAction = vi.fn();
        const mockSecondaryAction = vi.fn();

        render(
            <ErrorState
                action={{ label: 'Retry', onClick: mockAction }}
                secondaryAction={{ label: 'Cancel', onClick: mockSecondaryAction }}
            />
        );

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        expect(retryButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);
        expect(mockSecondaryAction).toHaveBeenCalled();
    });

    it('renders different variants correctly', () => {
        const { rerender } = render(<ErrorState variant="error" />);
        expect(document.querySelector('.text-red-600')).toBeInTheDocument();

        rerender(<ErrorState variant="warning" />);
        expect(document.querySelector('.text-orange-600')).toBeInTheDocument();

        rerender(<ErrorState variant="info" />);
        expect(document.querySelector('.text-blue-600')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<ErrorState className="custom-error" />);

        const container = document.querySelector('.custom-error');
        expect(container).toBeInTheDocument();
    });
});

describe('EmptyState', () => {
    it('renders with default props', () => {
        render(<EmptyState />);

        expect(screen.getByText('No data available')).toBeInTheDocument();
        expect(screen.getByText('There is nothing to show here yet.')).toBeInTheDocument();
    });

    it('renders with custom title and message', () => {
        render(
            <EmptyState
                title="No Items Found"
                message="Try adding some items to get started"
            />
        );

        expect(screen.getByText('No Items Found')).toBeInTheDocument();
        expect(screen.getByText('Try adding some items to get started')).toBeInTheDocument();
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

    it('renders custom icon when provided', () => {
        const CustomIcon = ({ className }: { className?: string }) => (
            <div className={className} data-testid="custom-icon">Custom Icon</div>
        );

        render(<EmptyState icon={CustomIcon} />);

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<EmptyState className="custom-empty" />);

        const container = document.querySelector('.custom-empty');
        expect(container).toBeInTheDocument();
    });
});

describe('SuccessState', () => {
    it('renders with default props', () => {
        render(<SuccessState />);

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Operation completed successfully.')).toBeInTheDocument();
    });

    it('renders with custom title and message', () => {
        render(
            <SuccessState
                title="Task Completed"
                message="Your task has been completed successfully"
            />
        );

        expect(screen.getByText('Task Completed')).toBeInTheDocument();
        expect(screen.getByText('Your task has been completed successfully')).toBeInTheDocument();
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

    it('applies custom className', () => {
        render(<SuccessState className="custom-success" />);

        const container = document.querySelector('.custom-success');
        expect(container).toBeInTheDocument();
    });

    it('displays success icon', () => {
        render(<SuccessState />);

        const icon = document.querySelector('.text-green-600');
        expect(icon).toBeInTheDocument();
    });
});