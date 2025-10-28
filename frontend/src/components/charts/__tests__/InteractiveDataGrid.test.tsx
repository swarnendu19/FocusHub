import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InteractiveDataGrid } from '../InteractiveDataGrid';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

describe('InteractiveDataGrid', () => {
    const mockData = [
        [
            { value: 10, label: 'Cell 1' },
            { value: 20, label: 'Cell 2' },
            { value: 30, label: 'Cell 3' }
        ],
        [
            { value: 15, label: 'Cell 4' },
            { value: 25, label: 'Cell 5' },
            { value: 35, label: 'Cell 6' }
        ],
        [
            { value: 5, label: 'Cell 7' },
            { value: 40, label: 'Cell 8' },
            { value: 45, label: 'Cell 9' }
        ]
    ];

    const rowLabels = ['Row 1', 'Row 2', 'Row 3'];
    const columnLabels = ['Col A', 'Col B', 'Col C'];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<InteractiveDataGrid data={mockData} />);

        expect(screen.getByText('Data Visualization')).toBeInTheDocument();
        expect(screen.getByText('Interactive data visualization with hover effects')).toBeInTheDocument();
    });

    it('displays all data cells', () => {
        render(<InteractiveDataGrid data={mockData} showValues={true} />);

        // Check that all values are displayed (using getAllByText for duplicates)
        mockData.flat().forEach(cell => {
            const elements = screen.getAllByText(cell.value.toString());
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    it('shows row and column labels when provided', () => {
        render(
            <InteractiveDataGrid
                data={mockData}
                rowLabels={rowLabels}
                columnLabels={columnLabels}
            />
        );

        rowLabels.forEach(label => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        columnLabels.forEach(label => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    it('hides values when showValues is false', () => {
        render(<InteractiveDataGrid data={mockData} showValues={false} />);

        // Values should not be visible in cells
        expect(screen.queryByText('10')).not.toBeInTheDocument();
        expect(screen.queryByText('20')).not.toBeInTheDocument();
    });

    it('handles cell hover interactions', async () => {
        const onCellHover = vi.fn();
        render(
            <InteractiveDataGrid
                data={mockData}
                onCellHover={onCellHover}
                showValues={true}
            />
        );

        const firstCell = screen.getByText('10');

        fireEvent.mouseEnter(firstCell);
        expect(onCellHover).toHaveBeenCalledWith(
            expect.objectContaining({
                value: mockData[0][0].value,
                label: mockData[0][0].label
            }),
            0,
            0
        );

        fireEvent.mouseLeave(firstCell);
        expect(onCellHover).toHaveBeenCalledWith(null, null, null);
    });

    it('handles cell click interactions', () => {
        const onCellClick = vi.fn();
        render(
            <InteractiveDataGrid
                data={mockData}
                onCellClick={onCellClick}
                showValues={true}
            />
        );

        const firstCell = screen.getByText('10');
        fireEvent.click(firstCell);

        expect(onCellClick).toHaveBeenCalledWith(
            expect.objectContaining({
                value: mockData[0][0].value,
                label: mockData[0][0].label
            }),
            0,
            0
        );
    });

    it('displays correct statistics', () => {
        render(<InteractiveDataGrid data={mockData} />);

        // Check for statistics labels
        expect(screen.getByText('Minimum')).toBeInTheDocument();
        expect(screen.getByText('Maximum')).toBeInTheDocument();
        expect(screen.getByText('Average')).toBeInTheDocument();

        // Check that statistics section exists
        const statsSection = screen.getByText('Minimum').closest('div');
        expect(statsSection).toBeInTheDocument();
    });

    it('applies different color scales', () => {
        const colorScales = ['blue', 'green', 'red', 'purple', 'gradient'] as const;

        colorScales.forEach(colorScale => {
            const { rerender } = render(
                <InteractiveDataGrid data={mockData} colorScale={colorScale} />
            );

            expect(screen.getByText('Data Visualization')).toBeInTheDocument();

            // Clean up for next iteration
            rerender(<div />);
        });
    });

    it('shows tooltips on hover when enabled', async () => {
        render(
            <InteractiveDataGrid
                data={mockData}
                rowLabels={rowLabels}
                columnLabels={columnLabels}
                showTooltips={true}
                showValues={true}
            />
        );

        const firstCell = screen.getByText('10');
        fireEvent.mouseEnter(firstCell);

        await waitFor(() => {
            expect(screen.getByText('Row 1 × Col A')).toBeInTheDocument();
            expect(screen.getByText('Value: 10')).toBeInTheDocument();
        });
    });

    it('hides tooltips when disabled', async () => {
        render(
            <InteractiveDataGrid
                data={mockData}
                rowLabels={rowLabels}
                columnLabels={columnLabels}
                showTooltips={false}
                showValues={true}
            />
        );

        const firstCell = screen.getByText('10');
        fireEvent.mouseEnter(firstCell);

        // Wait a bit to ensure tooltip doesn't appear
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(screen.queryByText('Row 1 × Col A')).not.toBeInTheDocument();
    });

    it('handles custom cell colors', () => {
        const dataWithColors = [
            [
                { value: 10, color: '#ff0000' },
                { value: 20, color: '#00ff00' }
            ]
        ];

        render(<InteractiveDataGrid data={dataWithColors} showValues={true} />);

        // Check that cells are rendered (values might appear in multiple places)
        const cells10 = screen.getAllByText('10');
        const cells20 = screen.getAllByText('20');
        expect(cells10.length).toBeGreaterThan(0);
        expect(cells20.length).toBeGreaterThan(0);
    });

    it('applies custom title', () => {
        render(<InteractiveDataGrid data={mockData} title="Custom Grid Title" />);

        expect(screen.getByText('Custom Grid Title')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <InteractiveDataGrid data={mockData} className="custom-class" />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles empty data gracefully', () => {
        render(<InteractiveDataGrid data={[]} />);

        expect(screen.getByText('Data Visualization')).toBeInTheDocument();
    });

    it('handles single cell data', () => {
        const singleCellData = [[{ value: 42, label: 'Single Cell' }]];

        render(<InteractiveDataGrid data={singleCellData} showValues={true} />);

        // Check that the value appears (might be in multiple places due to statistics)
        const cells42 = screen.getAllByText('42');
        expect(cells42.length).toBeGreaterThan(0);
    });

    it('handles uniform data values', () => {
        const uniformData = [
            [{ value: 10 }, { value: 10 }],
            [{ value: 10 }, { value: 10 }]
        ];

        render(<InteractiveDataGrid data={uniformData} />);

        // Should handle case where min === max
        expect(screen.getByText('Data Visualization')).toBeInTheDocument();
    });
});