import { render, screen } from '@testing-library/react';
import { DashboardLayout } from '../DashboardLayout';

describe('DashboardLayout', () => {
    it('renders children correctly', () => {
        render(
            <DashboardLayout>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </DashboardLayout>
        );

        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('applies correct grid classes', () => {
        const { container } = render(
            <DashboardLayout>
                <div>Test child</div>
            </DashboardLayout>
        );

        const gridContainer = container.firstChild as HTMLElement;
        expect(gridContainer).toHaveClass('grid');
        expect(gridContainer).toHaveClass('grid-cols-1');
        expect(gridContainer).toHaveClass('md:grid-cols-2');
        expect(gridContainer).toHaveClass('lg:grid-cols-3');
        expect(gridContainer).toHaveClass('xl:grid-cols-4');
    });

    it('applies custom className when provided', () => {
        const { container } = render(
            <DashboardLayout className="custom-class">
                <div>Test child</div>
            </DashboardLayout>
        );

        const gridContainer = container.firstChild as HTMLElement;
        expect(gridContainer).toHaveClass('custom-class');
    });

    it('renders with proper spacing and padding', () => {
        const { container } = render(
            <DashboardLayout>
                <div>Test child</div>
            </DashboardLayout>
        );

        const gridContainer = container.firstChild as HTMLElement;
        expect(gridContainer).toHaveClass('gap-6');
        expect(gridContainer).toHaveClass('p-6');
    });
});