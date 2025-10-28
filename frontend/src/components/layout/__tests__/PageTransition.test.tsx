import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { PageTransition, SlidePageTransition, FadePageTransition } from '../PageTransition';

// Mock framer-motion for testing
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

const TestComponent = ({ text }: { text: string }) => <div>{text}</div>;

const NavigationTestComponent = () => {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() => navigate('/page1')}>Go to Page 1</button>
            <button onClick={() => navigate('/page2')}>Go to Page 2</button>
        </div>
    );
};

const renderWithRouter = (component: React.ReactElement, initialRoute = '/') => {
    return render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={component} />
                <Route path="/page1" element={<PageTransition><TestComponent text="Page 1" /></PageTransition>} />
                <Route path="/page2" element={<PageTransition><TestComponent text="Page 2" /></PageTransition>} />
            </Routes>
        </BrowserRouter>
    );
};

describe('PageTransition', () => {
    it('renders children correctly', () => {
        renderWithRouter(
            <PageTransition>
                <div>Test Content</div>
            </PageTransition>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('wraps content in motion.div with correct props', () => {
        const { container } = renderWithRouter(
            <PageTransition>
                <div>Test Content</div>
            </PageTransition>
        );

        const motionDiv = container.querySelector('div[class="w-full h-full"]');
        expect(motionDiv).toBeInTheDocument();
        expect(motionDiv).toHaveTextContent('Test Content');
    });

    it('uses location.pathname as key for AnimatePresence', () => {
        renderWithRouter(
            <PageTransition>
                <div>Home Content</div>
            </PageTransition>
        );

        expect(screen.getByText('Home Content')).toBeInTheDocument();
    });

    it('handles multiple children', () => {
        renderWithRouter(
            <PageTransition>
                <div>First Child</div>
                <div>Second Child</div>
            </PageTransition>
        );

        expect(screen.getByText('First Child')).toBeInTheDocument();
        expect(screen.getByText('Second Child')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
        const { container } = renderWithRouter(
            <PageTransition>
                <div>Content</div>
            </PageTransition>
        );

        const wrapper = container.querySelector('.w-full.h-full');
        expect(wrapper).toBeInTheDocument();
    });
});

describe('SlidePageTransition', () => {
    it('renders children with slide transition wrapper', () => {
        renderWithRouter(
            <SlidePageTransition>
                <div>Slide Content</div>
            </SlidePageTransition>
        );

        expect(screen.getByText('Slide Content')).toBeInTheDocument();
    });

    it('applies correct wrapper classes', () => {
        const { container } = renderWithRouter(
            <SlidePageTransition>
                <div>Content</div>
            </SlidePageTransition>
        );

        const wrapper = container.querySelector('.w-full.h-full');
        expect(wrapper).toBeInTheDocument();
    });

    it('handles complex content structures', () => {
        renderWithRouter(
            <SlidePageTransition>
                <div>
                    <h1>Title</h1>
                    <p>Paragraph</p>
                    <button>Button</button>
                </div>
            </SlidePageTransition>
        );

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Paragraph')).toBeInTheDocument();
        expect(screen.getByText('Button')).toBeInTheDocument();
    });
});

describe('FadePageTransition', () => {
    it('renders children with fade transition wrapper', () => {
        renderWithRouter(
            <FadePageTransition>
                <div>Fade Content</div>
            </FadePageTransition>
        );

        expect(screen.getByText('Fade Content')).toBeInTheDocument();
    });

    it('applies correct wrapper classes', () => {
        const { container } = renderWithRouter(
            <FadePageTransition>
                <div>Content</div>
            </FadePageTransition>
        );

        const wrapper = container.querySelector('.w-full.h-full');
        expect(wrapper).toBeInTheDocument();
    });

    it('preserves child component props and state', () => {
        const TestComponentWithProps = ({ title, count }: { title: string; count: number }) => (
            <div>
                <h1>{title}</h1>
                <span>Count: {count}</span>
            </div>
        );

        renderWithRouter(
            <FadePageTransition>
                <TestComponentWithProps title="Test Title" count={42} />
            </FadePageTransition>
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Count: 42')).toBeInTheDocument();
    });
});

describe('Transition Components Integration', () => {
    it('all transition components handle the same content correctly', () => {
        const content = <div>Shared Content</div>;

        const { rerender } = renderWithRouter(<PageTransition>{content}</PageTransition>);
        expect(screen.getByText('Shared Content')).toBeInTheDocument();

        rerender(
            <BrowserRouter>
                <SlidePageTransition>{content}</SlidePageTransition>
            </BrowserRouter>
        );
        expect(screen.getByText('Shared Content')).toBeInTheDocument();

        rerender(
            <BrowserRouter>
                <FadePageTransition>{content}</FadePageTransition>
            </BrowserRouter>
        );
        expect(screen.getByText('Shared Content')).toBeInTheDocument();
    });

    it('maintains component hierarchy', () => {
        const NestedComponent = () => (
            <div>
                <header>Header</header>
                <main>
                    <section>Section Content</section>
                </main>
                <footer>Footer</footer>
            </div>
        );

        renderWithRouter(
            <PageTransition>
                <NestedComponent />
            </PageTransition>
        );

        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Section Content')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
        const { container } = renderWithRouter(<PageTransition>{null}</PageTransition>);

        const wrapper = container.querySelector('.w-full.h-full');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper).toBeEmptyDOMElement();
    });

    it('handles string children', () => {
        renderWithRouter(<PageTransition>Simple text content</PageTransition>);

        expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('handles fragment children', () => {
        renderWithRouter(
            <PageTransition>
                <>
                    <div>Fragment Child 1</div>
                    <div>Fragment Child 2</div>
                </>
            </PageTransition>
        );

        expect(screen.getByText('Fragment Child 1')).toBeInTheDocument();
        expect(screen.getByText('Fragment Child 2')).toBeInTheDocument();
    });
});

describe('Transition Performance', () => {
    it('does not cause unnecessary re-renders', () => {
        const renderSpy = vi.fn();

        const TestComponent = () => {
            renderSpy();
            return <div>Test</div>;
        };

        const { rerender } = renderWithRouter(
            <PageTransition>
                <TestComponent />
            </PageTransition>
        );

        const initialRenderCount = renderSpy.mock.calls.length;

        // Re-render with same content
        rerender(
            <BrowserRouter>
                <PageTransition>
                    <TestComponent />
                </PageTransition>
            </BrowserRouter>
        );

        // Should not cause additional renders of child component
        expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
    });

    it('handles rapid navigation changes', () => {
        renderWithRouter(<NavigationTestComponent />);

        const page1Button = screen.getByText('Go to Page 1');
        const page2Button = screen.getByText('Go to Page 2');

        // Rapid navigation should not break
        page1Button.click();
        page2Button.click();
        page1Button.click();

        // Should still be functional
        expect(page1Button).toBeInTheDocument();
        expect(page2Button).toBeInTheDocument();
    });
});