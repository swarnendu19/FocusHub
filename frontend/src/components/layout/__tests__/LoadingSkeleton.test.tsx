import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Skeleton,
    CardSkeleton,
    ProjectCardSkeleton,
    LeaderboardRowSkeleton,
    DashboardSkeleton,
    ProjectsPageSkeleton,
    LeaderboardSkeleton,
    PageSkeleton
} from '../LoadingSkeleton';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, animate, transition, 'data-testid': testId, ...props }: any) => (
            <div className={className} data-testid={testId} {...props}>{children}</div>
        ),
    },
}));

describe('Skeleton', () => {
    it('renders with default classes', () => {
        render(<Skeleton data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('bg-gray-200', 'rounded-md');
    });

    it('applies custom className', () => {
        render(<Skeleton className="custom-class" data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('custom-class');
    });

    it('applies animate pulse class when animate is true', () => {
        render(<Skeleton animate={true} data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('animate-pulse');
    });

    it('does not apply animate pulse class when animate is false', () => {
        render(<Skeleton animate={false} data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).not.toHaveClass('animate-pulse');
    });
});

describe('CardSkeleton', () => {
    it('renders card skeleton structure', () => {
        render(<CardSkeleton />);

        // Should have card container
        const cardContainer = document.querySelector('.bg-white.rounded-lg.border');
        expect(cardContainer).toBeInTheDocument();
    });

    it('applies custom className to card container', () => {
        render(<CardSkeleton className="custom-card" />);

        const cardContainer = document.querySelector('.custom-card');
        expect(cardContainer).toBeInTheDocument();
    });
});

describe('ProjectCardSkeleton', () => {
    it('renders project card skeleton structure', () => {
        render(<ProjectCardSkeleton />);

        // Should have card container with proper styling
        const cardContainer = document.querySelector('.bg-white.rounded-lg.border');
        expect(cardContainer).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<ProjectCardSkeleton className="project-card" />);

        const cardContainer = document.querySelector('.project-card');
        expect(cardContainer).toBeInTheDocument();
    });
});

describe('LeaderboardRowSkeleton', () => {
    it('renders leaderboard row skeleton structure', () => {
        render(<LeaderboardRowSkeleton />);

        // Should have row container
        const rowContainer = document.querySelector('.flex.items-center.space-x-4');
        expect(rowContainer).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<LeaderboardRowSkeleton className="leaderboard-row" />);

        const rowContainer = document.querySelector('.leaderboard-row');
        expect(rowContainer).toBeInTheDocument();
    });
});

describe('DashboardSkeleton', () => {
    it('renders dashboard skeleton with header and stats cards', () => {
        render(<DashboardSkeleton />);

        // Should have main container
        const container = document.querySelector('.space-y-6');
        expect(container).toBeInTheDocument();

        // Should have grid for stats cards
        const statsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
        expect(statsGrid).toBeInTheDocument();
    });
});

describe('ProjectsPageSkeleton', () => {
    it('renders projects page skeleton with header and project grid', () => {
        render(<ProjectsPageSkeleton />);

        // Should have main container
        const container = document.querySelector('.space-y-6');
        expect(container).toBeInTheDocument();

        // Should have project grid
        const projectGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        expect(projectGrid).toBeInTheDocument();
    });
});

describe('LeaderboardSkeleton', () => {
    it('renders leaderboard skeleton with header and rows', () => {
        render(<LeaderboardSkeleton />);

        // Should have main container
        const container = document.querySelector('.space-y-6');
        expect(container).toBeInTheDocument();

        // Should have rows container
        const rowsContainer = document.querySelector('.space-y-3');
        expect(rowsContainer).toBeInTheDocument();
    });
});

describe('PageSkeleton', () => {
    it('renders generic page skeleton', () => {
        render(<PageSkeleton />);

        // Should have main container
        const container = document.querySelector('.space-y-6');
        expect(container).toBeInTheDocument();

        // Should have content sections
        const contentSections = document.querySelector('.space-y-4');
        expect(contentSections).toBeInTheDocument();
    });
});