import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout, SimpleLayout, FullScreenLayout } from '../Layout';

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
    });
});

describe('SimpleLayout', () => {
    it('renders simple layout without sidebar or header', () => {
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
    });
});

describe('FullScreenLayout', () => {
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
    });
});