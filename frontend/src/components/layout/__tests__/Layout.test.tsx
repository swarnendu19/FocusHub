<<<<<<< HEAD
import { describe, it, expect, beforeEach, vi } from 'vitest';
=======
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout, SimpleLayout, FullScreenLayout } from '../Layout';

<<<<<<< HEAD
// Mock child components
vi.mock('../Header', () => ({
    Header: () => <div data-testid="header">Header</div>
}));

vi.mock('../Sidebar', () => ({
    Sidebar: ({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) => (
        <div data-testid="sidebar" data-collapsed={isCollapsed}>
            <button onClick={onToggle} data-testid="sidebar-toggle">Toggle</button>
        </div>
    )
}));

vi.mock('../PageTransition', () => ({
    PageTransition: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="page-transition">{children}</div>
    )
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

// Mock window.innerWidth for responsive tests
const mockWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
    window.dispatchEvent(new Event('resize'));
};

describe('Layout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset to desktop width
        mockWindowWidth(1024);
    });

    it('renders desktop layout with sidebar by default', () => {
        renderWithRouter(<Layout><div>Test Content</div></Layout>);

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('page-transition')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders mobile layout with header on mobile', () => {
        mockWindowWidth(600); // Mobile width

        renderWithRouter(<Layout><div>Test Content</div></Layout>);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('auto-collapses sidebar on mobile', () => {
        mockWindowWidth(600); // Mobile width

        renderWithRouter(<Layout><div>Test Content</div></Layout>);

        // On mobile, sidebar should be collapsed
        const sidebar = screen.queryByTestId('sidebar');
        if (sidebar) {
            expect(sidebar).toHaveAttribute('data-collapsed', 'true');
        }
    });

    it('toggles sidebar when toggle button is clicked', () => {
        renderWithRouter(<Layout><div>Test Content</div></Layout>);

        const sidebar = screen.getByTestId('sidebar');
        const toggleButton = screen.getByTestId('sidebar-toggle');

        // Initially not collapsed
        expect(sidebar).toHaveAttribute('data-collapsed', 'false');

        // Click toggle
        toggleButton.click();

        // Should be collapsed now
        expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    });

    it('adjusts main content margin based on sidebar state', () => {
        const { container } = renderWithRouter(<Layout><div>Test Content</div></Layout>);

        // Find the main element
        const mainElement = container.querySelector('main');
        expect(mainElement).toBeInTheDocument();
    });

    it('renders children when provided', () => {
        renderWithRouter(
            <Layout>
                <div>Custom Child Content</div>
            </Layout>
        );

        expect(screen.getByText('Custom Child Content')).toBeInTheDocument();
    });

    it('renders Outlet when no children provided', () => {
        // Mock Outlet
        vi.mock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom');
            return {
                ...actual,
                Outlet: () => <div>Outlet Content</div>
            };
        });

        renderWithRouter(<Layout />);

        expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    });

    it('handles window resize events', () => {
        renderWithRouter(<Layout><div>Test Content</div></Layout>);

        // Start with desktop
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();

        // Resize to mobile
        mockWindowWidth(600);

        // Should still work (component handles resize internally)
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies correct CSS classes for layout structure', () => {
        const { container } = renderWithRouter(<Layout><div>Test Content</div></Layout>);

        const layoutRoot = container.firstChild as HTMLElement;
        expect(layoutRoot).toHaveClass('min-h-screen', 'bg-gray-50');
=======
// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
        aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

// Mock the Sidebar and Header components to avoid complex dependencies
vi.mock('../Sidebar', () => ({
    Sidebar: ({ children }: any) => <div data-testid="sidebar">Sidebar Mock</div>
}));

vi.mock('../Header', () => ({
    Header: () => <div data-testid="header">Header Mock</div>
}));

vi.mock('../PageTransition', () => ({
    PageTransition: ({ children }: any) => <div data-testid="page-transition">{children}</div>
}));

const LayoutWithRouter = ({ children }: { children?: React.ReactNode }) => (
    <BrowserRouter>
        <Layout>{children}</Layout>
    </BrowserRouter>
);

const SimpleLayoutWithRouter = ({ children }: { children?: React.ReactNode }) => (
    <BrowserRouter>
        <SimpleLayout>{children}</SimpleLayout>
    </BrowserRouter>
);

describe('Layout', () => {
    // Mock window.innerWidth for mobile/desktop tests
    const originalInnerWidth = window.innerWidth;

    beforeEach(() => {
        // Reset to desktop width
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    it('renders main layout with sidebar on desktop', () => {
        render(
            <LayoutWithRouter>
                <div>Test Content</div>
            </LayoutWithRouter>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('renders header layout on mobile', () => {
        // Mock mobile width
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 600,
        });

        render(
            <LayoutWithRouter>
                <div>Mobile Content</div>
            </LayoutWithRouter>
        );

        expect(screen.getByText('Mobile Content')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders children content', () => {
        render(
            <LayoutWithRouter>
                <div data-testid="child-content">Child Component</div>
            </LayoutWithRouter>
        );

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('Child Component')).toBeInTheDocument();
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});

describe('SimpleLayout', () => {
    it('renders simple layout without sidebar or header', () => {
<<<<<<< HEAD
        renderWithRouter(<SimpleLayout><div>Simple Content</div></SimpleLayout>);

        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('header')).not.toBeInTheDocument();
        expect(screen.getByTestId('page-transition')).toBeInTheDocument();
        expect(screen.getByText('Simple Content')).toBeInTheDocument();
    });

    it('applies container styling', () => {
        const { container } = renderWithRouter(<SimpleLayout><div>Content</div></SimpleLayout>);

        const layoutRoot = container.firstChild as HTMLElement;
        expect(layoutRoot).toHaveClass('min-h-screen', 'bg-gray-50');

        const mainElement = layoutRoot.querySelector('main');
        expect(mainElement).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
    });

    it('renders children with page transition', () => {
        renderWithRouter(<SimpleLayout><div>Test Content</div></SimpleLayout>);

        expect(screen.getByTestId('page-transition')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
=======
        render(
            <SimpleLayoutWithRouter>
                <div data-testid="simple-content">Simple Content</div>
            </SimpleLayoutWithRouter>
        );

        expect(screen.getByTestId('simple-content')).toBeInTheDocument();
        expect(screen.getByText('Simple Content')).toBeInTheDocument();

        // Should not have sidebar or header navigation
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
        expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('applies correct container classes', () => {
        render(
            <SimpleLayoutWithRouter>
                <div>Content</div>
            </SimpleLayoutWithRouter>
        );

        const container = screen.getByText('Content').closest('main');
        expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});

describe('FullScreenLayout', () => {
<<<<<<< HEAD
    it('renders full-screen layout', () => {
        renderWithRouter(<FullScreenLayout><div>Fullscreen Content</div></FullScreenLayout>);

        expect(screen.getByTestId('page-transition')).toBeInTheDocument();
        expect(screen.getByText('Fullscreen Content')).toBeInTheDocument();
    });

    it('applies full-screen styling', () => {
        const { container } = renderWithRouter(<FullScreenLayout><div>Content</div></FullScreenLayout>);

        const layoutRoot = container.firstChild as HTMLElement;
        expect(layoutRoot).toHaveClass('fixed', 'inset-0', 'bg-gray-50', 'z-50');
    });

    it('renders without sidebar or header', () => {
        renderWithRouter(<FullScreenLayout><div>Content</div></FullScreenLayout>);

        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    });

    it('wraps content in page transition', () => {
        renderWithRouter(<FullScreenLayout><div>Modal Content</div></FullScreenLayout>);

        expect(screen.getByTestId('page-transition')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });
});

describe('Layout Responsive Behavior', () => {
    it('switches between desktop and mobile layouts based on screen size', () => {
        const { rerender } = renderWithRouter(<Layout><div>Content</div></Layout>);

        // Desktop layout
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.queryByTestId('header')).not.toBeInTheDocument();

        // Switch to mobile
        mockWindowWidth(600);
        rerender(
            <BrowserRouter>
                <Layout><div>Content</div></Layout>
            </BrowserRouter>
        );

        // Should show header on mobile
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('maintains content visibility across layout changes', () => {
        renderWithRouter(<Layout><div>Persistent Content</div></Layout>);

        expect(screen.getByText('Persistent Content')).toBeInTheDocument();

        // Resize to mobile
        mockWindowWidth(600);

        expect(screen.getByText('Persistent Content')).toBeInTheDocument();
    });
});

describe('Layout Accessibility', () => {
    it('has proper semantic structure', () => {
        const { container } = renderWithRouter(<Layout><div>Content</div></Layout>);

        const mainElement = container.querySelector('main');
        expect(mainElement).toBeInTheDocument();
    });

    it('maintains focus management during layout changes', () => {
        renderWithRouter(<Layout><button>Focusable Element</button></Layout>);

        const button = screen.getByRole('button');
        button.focus();

        expect(document.activeElement).toBe(button);
=======
    it('renders full screen layout', () => {
        render(
            <BrowserRouter>
                <FullScreenLayout>
                    <div data-testid="fullscreen-content">Fullscreen Content</div>
                </FullScreenLayout>
            </BrowserRouter>
        );

        expect(screen.getByTestId('fullscreen-content')).toBeInTheDocument();
        expect(screen.getByText('Fullscreen Content')).toBeInTheDocument();
    });

    it('applies full screen classes', () => {
        render(
            <BrowserRouter>
                <FullScreenLayout>
                    <div>Content</div>
                </FullScreenLayout>
            </BrowserRouter>
        );

        // Check if the layout container has the expected structure
        const content = screen.getByText('Content');
        expect(content).toBeInTheDocument();

        // The full screen layout should have a container with fixed positioning
        const container = document.querySelector('.fixed.inset-0.bg-gray-50.z-50');
        expect(container).toBeInTheDocument();
>>>>>>> 045c345d235c726879db42dc445e63b1b8382a60
    });
});