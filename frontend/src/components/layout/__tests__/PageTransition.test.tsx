import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageTransition, SlidePageTransition, FadePageTransition } from '../PageTransition';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

const TestComponent = ({ text }: { text: string }) => <div>{text}</div>;

const PageTransitionWithRouter = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PageTransition>{children}</PageTransition>} />
        </Routes>
    </BrowserRouter>
);

const SlidePageTransitionWithRouter = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<SlidePageTransition>{children}</SlidePageTransition>} />
        </Routes>
    </BrowserRouter>
);

const FadePageTransitionWithRouter = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FadePageTransition>{children}</FadePageTransition>} />
        </Routes>
    </BrowserRouter>
);

describe('PageTransition', () => {
    it('renders children content', () => {
        render(
            <PageTransitionWithRouter>
                <TestComponent text="Page Content" />
            </PageTransitionWithRouter>
        );

        expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('applies correct wrapper classes', () => {
        render(
            <PageTransitionWithRouter>
                <div data-testid="content">Content</div>
            </PageTransitionWithRouter>
        );

        const wrapper = screen.getByTestId('content').parentElement;
        expect(wrapper).toHaveClass('w-full', 'h-full');
    });

    it('handles multiple children', () => {
        render(
            <PageTransitionWithRouter>
                <div>First Child</div>
                <div>Second Child</div>
            </PageTransitionWithRouter>
        );

        expect(screen.getByText('First Child')).toBeInTheDocument();
        expect(screen.getByText('Second Child')).toBeInTheDocument();
    });
});

describe('SlidePageTransition', () => {
    it('renders children content with slide transition', () => {
        render(
            <SlidePageTransitionWithRouter>
                <TestComponent text="Slide Content" />
            </SlidePageTransitionWithRouter>
        );

        expect(screen.getByText('Slide Content')).toBeInTheDocument();
    });

    it('applies correct wrapper classes', () => {
        render(
            <SlidePageTransitionWithRouter>
                <div data-testid="slide-content">Content</div>
            </SlidePageTransitionWithRouter>
        );

        const wrapper = screen.getByTestId('slide-content').parentElement;
        expect(wrapper).toHaveClass('w-full', 'h-full');
    });
});

describe('FadePageTransition', () => {
    it('renders children content with fade transition', () => {
        render(
            <FadePageTransitionWithRouter>
                <TestComponent text="Fade Content" />
            </FadePageTransitionWithRouter>
        );

        expect(screen.getByText('Fade Content')).toBeInTheDocument();
    });

    it('applies correct wrapper classes', () => {
        render(
            <FadePageTransitionWithRouter>
                <div data-testid="fade-content">Content</div>
            </FadePageTransitionWithRouter>
        );

        const wrapper = screen.getByTestId('fade-content').parentElement;
        expect(wrapper).toHaveClass('w-full', 'h-full');
    });

    it('handles complex content structures', () => {
        render(
            <FadePageTransitionWithRouter>
                <div>
                    <h1>Title</h1>
                    <p>Description</p>
                    <button>Action</button>
                </div>
            </FadePageTransitionWithRouter>
        );

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
    });
});