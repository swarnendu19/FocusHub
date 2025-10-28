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

<<<<<<< HEAD
// Mock framer-motion for testing
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: any) => (
            <div className={className} {...props}>{children}</div>
        )
    }
=======
// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, animate, transition, 'data-testid': testId, ...props }: any) => (
            <div className={className} data-testid={testId} {...props}>{children}</div>
        ),
    },
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
}));

describe('Skeleton', () => {
    it('renders with default classes', () => {
<<<<<<< HEAD
        const { container } = render(<Skeleton />);

        const skeleton = container.firstChild as HTMLElement;
=======
        render(<Skeleton data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
        expect(skeleton).toHaveClass('bg-gray-200', 'rounded-md');
    });

    it('applies custom className', () => {
<<<<<<< HEAD
        const { container } = render(<Skeleton className="custom-class" />);

        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).toHaveClass('custom-class');
    });

    it('applies animate class when animate is true', () => {
        const { container } = render(<Skeleton animate={true} />);

        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).toHaveClass('animate-pulse');
    });

    it('does not apply animate class when animate is false', () => {
        const { container } = render(<Skeleton animate={false} />);

        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).not.toHaveClass('animate-pulse');
    });

    it('combines custom className with default classes', () => {
        const { container } = render(<Skeleton className="h-4 w-24" />);

        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).toHaveClass('bg-gray-200', 'rounded-md', 'h-4', 'w-24');
    });
});

describe('CardSkeleton', () => {
    it('renders card structure with skeletons', () => {
        const { container } = render(<CardSkeleton />);

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass('p-6', 'bg-white', 'rounded-lg', 'border', 'border-gray-200', 'shadow-sm');

        // Should contain multiple skeleton elements
        const skeletons = container.querySelectorAll('.bg-gray-200');
        expect(skeletons.length).toBeGreaterThan(1);
    });

    it('applies custom className', () => {
        const { container } = render(<CardSkeleton className="custom-card" />);

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass('custom-card');
    });

    it('has proper card structure', () => {
        const { container } = render(<CardSkeleton />);

        // Should have space-y-4 for content spacing
        const contentArea = container.querySelector('.space-y-4');
        expect(contentArea).toBeInTheDocument();
=======
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
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});

describe('ProjectCardSkeleton', () => {
<<<<<<< HEAD
    it('renders project card structure', () => {
        const { container } = render(<ProjectCardSkeleton />);

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass('p-6', 'bg-white', 'rounded-lg');

        // Should have multiple skeleton elements for project data
        const skeletons = container.querySelectorAll('.bg-gray-200');
        expect(skeletons.length).toBeGreaterThan(3);
    });

    it('includes progress bar skeleton', () => {
        const { container } = render(<ProjectCardSkeleton />);

        // Should have a full-width skeleton for progress bar
        const progressSkeleton = container.querySelector('.w-full');
        expect(progressSkeleton).toBeInTheDocument();
    });

    it('includes circular skeletons for avatars/icons', () => {
        const { container } = render(<ProjectCardSkeleton />);

        const circularSkeletons = container.querySelectorAll('.rounded-full');
        expect(circularSkeletons.length).toBeGreaterThan(0);
=======
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
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});

describe('LeaderboardRowSkeleton', () => {
<<<<<<< HEAD
    it('renders leaderboard row structure', () => {
        const { container } = render(<LeaderboardRowSkeleton />);

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveClass('flex', 'items-center', 'space-x-4', 'p-4', 'bg-white', 'rounded-lg');
    });

    it('includes avatar skeleton', () => {
        const { container } = render(<LeaderboardRowSkeleton />);

        const avatarSkeletons = container.querySelectorAll('.rounded-full');
        expect(avatarSkeletons.length).toBeGreaterThan(0);
    });

    it('has proper spacing structure', () => {
        const { container } = render(<LeaderboardRowSkeleton />);

        const spacedContainer = container.querySelector('.space-x-4');
        expect(spacedContainer).toBeInTheDocument();
=======
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
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});

describe('DashboardSkeleton', () => {
<<<<<<< HEAD
    it('renders complete dashboard structure', () => {
        render(<DashboardSkeleton />);

        // Should render multiple card skeletons
        const cards = document.querySelectorAll('.bg-white.rounded-lg');
        expect(cards.length).toBeGreaterThan(3);
    });

    it('includes header skeleton', () => {
        const { container } = render(<DashboardSkeleton />);

        // Should have header area with title and subtitle skeletons
        const headerArea = container.querySelector('.space-y-2');
        expect(headerArea).toBeInTheDocument();
    });

    it('includes stats grid', () => {
        const { container } = render(<DashboardSkeleton />);

        // Should have grid layout for stats
        const statsGrid = container.querySelector('.grid');
        expect(statsGrid).toBeInTheDocument();
    });

    it('includes main content areas', () => {
        const { container } = render(<DashboardSkeleton />);

        // Should have multiple content sections
        const contentSections = container.querySelectorAll('.space-y-6');
        expect(contentSections.length).toBeGreaterThan(0);
    });
});

describe('ProjectsPageSkeleton', () => {
    it('renders projects page structure', () => {
        const { container } = render(<ProjectsPageSkeleton />);

        // Should have header with title and button
        const headerSection = container.querySelector('.flex.items-center.justify-between');
        expect(headerSection).toBeInTheDocument();
    });

    it('renders multiple project card skeletons', () => {
        const { container } = render(<ProjectsPageSkeleton />);

        // Should render 6 project cards
        const projectCards = container.querySelectorAll('.p-6.bg-white.rounded-lg');
        expect(projectCards.length).toBe(6);
    });

    it('has proper grid layout', () => {
        const { container } = render(<ProjectsPageSkeleton />);

        const grid = container.querySelector('.grid');
        expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
=======
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
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});

describe('LeaderboardSkeleton', () => {
<<<<<<< HEAD
    it('renders leaderboard structure', () => {
        const { container } = render(<LeaderboardSkeleton />);

        // Should have header section
        const headerSection = container.querySelector('.space-y-2');
        expect(headerSection).toBeInTheDocument();
    });

    it('renders multiple leaderboard row skeletons', () => {
        const { container } = render(<LeaderboardSkeleton />);

        // Should render 10 leaderboard rows
        const rows = container.querySelectorAll('.flex.items-center.space-x-4');
        expect(rows.length).toBe(10);
    });

    it('has proper spacing between rows', () => {
        const { container } = render(<LeaderboardSkeleton />);

        const rowsContainer = container.querySelector('.space-y-3');
=======
    it('renders leaderboard skeleton with header and rows', () => {
        render(<LeaderboardSkeleton />);

        // Should have main container
        const container = document.querySelector('.space-y-6');
        expect(container).toBeInTheDocument();

        // Should have rows container
        const rowsContainer = document.querySelector('.space-y-3');
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
        expect(rowsContainer).toBeInTheDocument();
    });
});

describe('PageSkeleton', () => {
<<<<<<< HEAD
    it('renders generic page structure', () => {
        const { container } = render(<PageSkeleton />);

        // Should have header section
        const headerSection = container.querySelector('.space-y-2');
        expect(headerSection).toBeInTheDocument();
    });

    it('renders multiple content sections', () => {
        const { container } = render(<PageSkeleton />);

        // Should render 3 content sections
        const contentSections = container.querySelectorAll('.bg-white.rounded-lg.border');
        expect(contentSections.length).toBe(3);
    });

    it('has varied skeleton widths for realistic appearance', () => {
        const { container } = render(<PageSkeleton />);

        // Should have skeletons with different widths
        const fullWidth = container.querySelector('.w-full');
        const threeQuarters = container.querySelector('.w-3\\/4');
        const half = container.querySelector('.w-1\\/2');

        expect(fullWidth).toBeInTheDocument();
        expect(threeQuarters).toBeInTheDocument();
        expect(half).toBeInTheDocument();
    });
});

describe('Skeleton Accessibility', () => {
    it('provides appropriate loading indication', () => {
        render(<DashboardSkeleton />);

        // Skeleton components should be recognizable as loading states
        const skeletons = document.querySelectorAll('.bg-gray-200');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('maintains proper semantic structure', () => {
        const { container } = render(<CardSkeleton />);

        // Should maintain card structure even in skeleton state
        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass('bg-white', 'rounded-lg');
    });

    it('does not interfere with screen readers', () => {
        const { container } = render(<Skeleton />);

        // Skeleton should not have interactive elements
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton.tagName).toBe('DIV');
        expect(skeleton.getAttribute('role')).toBeNull();
    });
});

describe('Skeleton Performance', () => {
    it('renders efficiently with multiple skeletons', () => {
        const renderStart = performance.now();
        render(<DashboardSkeleton />);
        const renderEnd = performance.now();

        // Should render quickly (less than 100ms for skeleton)
        expect(renderEnd - renderStart).toBeLessThan(100);
    });

    it('handles multiple skeleton types simultaneously', () => {
        render(
            <div>
                <CardSkeleton />
                <ProjectCardSkeleton />
                <LeaderboardRowSkeleton />
            </div>
        );

        // Should render all types without issues
        const skeletons = document.querySelectorAll('.bg-gray-200');
        expect(skeletons.length).toBeGreaterThan(5);
    });
});

describe('Skeleton Customization', () => {
    it('accepts and applies custom classes correctly', () => {
        const { container } = render(
            <CardSkeleton className="custom-spacing p-8 m-4" />
        );

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass('custom-spacing', 'p-8', 'm-4');
    });

    it('maintains base functionality with custom classes', () => {
        const { container } = render(
            <Skeleton className="h-8 w-32 bg-blue-200" />
        );

        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).toHaveClass('h-8', 'w-32', 'bg-blue-200', 'rounded-md');
=======
    it('renders generic page skeleton', () => {
        render(<PageSkeleton />);

        // Should have main container
        const container = document.querySelector('.space-y-6');
        expect(container).toBeInTheDocument();

        // Should have content sections
        const contentSections = document.querySelector('.space-y-4');
        expect(contentSections).toBeInTheDocument();
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});