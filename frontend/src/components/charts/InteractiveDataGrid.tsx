import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataCell {
    value: number;
    label?: string;
    color?: string;
    metadata?: any;
}

interface InteractiveDataGridProps {
    data: DataCell[][];
    rowLabels?: string[];
    columnLabels?: string[];
    title?: string;
    colorScale?: 'blue' | 'green' | 'red' | 'purple' | 'gradient';
    showValues?: boolean;
    showTooltips?: boolean;
    animationDelay?: number;
    onCellHover?: (cell: DataCell | null, row: number | null, col: number | null) => void;
    onCellClick?: (cell: DataCell, row: number, col: number) => void;
    className?: string;
}

export function InteractiveDataGrid({
    data,
    rowLabels = [],
    columnLabels = [],
    title = 'Data Visualization',
    colorScale = 'blue',
    showValues = true,
    showTooltips = true,
    animationDelay = 0.05,
    onCellHover,
    onCellClick,
    className = ''
}: InteractiveDataGridProps) {
    const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    React.useEffect(() => {
        setIsVisible(true);
    }, []);

    const { minValue, maxValue, normalizedData } = useMemo(() => {
        const allValues = data.flat().map(cell => cell.value);
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const range = maxValue - minValue;

        const normalizedData = data.map(row =>
            row.map(cell => ({
                ...cell,
                normalized: range === 0 ? 0.5 : (cell.value - minValue) / range
            }))
        );

        return { minValue, maxValue, normalizedData };
    }, [data]);

    const getColorIntensity = (normalized: number) => {
        const intensity = Math.max(0.1, normalized);

        switch (colorScale) {
            case 'green':
                return `rgba(34, 197, 94, ${intensity})`;
            case 'red':
                return `rgba(239, 68, 68, ${intensity})`;
            case 'purple':
                return `rgba(139, 92, 246, ${intensity})`;
            case 'gradient':
                if (normalized < 0.33) return `rgba(34, 197, 94, ${intensity})`;
                if (normalized < 0.66) return `rgba(251, 191, 36, ${intensity})`;
                return `rgba(239, 68, 68, ${intensity})`;
            default:
                return `rgba(59, 130, 246, ${intensity})`;
        }
    };

    const handleCellHover = (row: number, col: number, cell: DataCell) => {
        setHoveredCell({ row, col });
        onCellHover?.(cell, row, col);
    };

    const handleCellLeave = () => {
        setHoveredCell(null);
        onCellHover?.(null, null, null);
    };

    const cellSize = Math.max(40, Math.min(80, 400 / Math.max(data.length, data[0]?.length || 1)));

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            {/* Header */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">
                        Interactive data visualization with hover effects
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: getColorIntensity(0.2) }} />
                            <span>Low ({minValue})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: getColorIntensity(1) }} />
                            <span>High ({maxValue})</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Data Grid */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Column Headers */}
                    {columnLabels.length > 0 && (
                        <div className="flex mb-2">
                            {/* Empty corner cell */}
                            <div style={{ width: cellSize, height: cellSize }} className="flex-shrink-0" />

                            {columnLabels.map((label, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0"
                                    style={{ width: cellSize, height: cellSize }}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <span className="transform -rotate-45 origin-center whitespace-nowrap">
                                        {label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Data Rows */}
                    {normalizedData.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex mb-1">
                            {/* Row Label */}
                            {rowLabels[rowIndex] && (
                                <motion.div
                                    className="flex items-center justify-end pr-2 text-xs font-medium text-gray-600 flex-shrink-0"
                                    style={{ width: cellSize, height: cellSize }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
                                    transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                                >
                                    {rowLabels[rowIndex]}
                                </motion.div>
                            )}

                            {/* Data Cells */}
                            {row.map((cell, colIndex) => {
                                const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
                                const isRowHovered = hoveredCell?.row === rowIndex;
                                const isColHovered = hoveredCell?.col === colIndex;

                                return (
                                    <motion.div
                                        key={colIndex}
                                        className={`relative flex items-center justify-center border border-gray-200 cursor-pointer transition-all duration-200 flex-shrink-0 ${isHovered
                                                ? 'border-gray-400 z-10'
                                                : isRowHovered || isColHovered
                                                    ? 'border-gray-300'
                                                    : 'border-gray-200'
                                            }`}
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                            backgroundColor: cell.color || getColorIntensity(cell.normalized),
                                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                            boxShadow: isHovered
                                                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                                                : 'none'
                                        }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: isVisible ? 1 : 0,
                                            scale: isVisible ? (isHovered ? 1.1 : 1) : 0.8
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: (rowIndex * row.length + colIndex) * animationDelay,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                        onMouseEnter={() => handleCellHover(rowIndex, colIndex, cell)}
                                        onMouseLeave={handleCellLeave}
                                        onClick={() => onCellClick?.(cell, rowIndex, colIndex)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {/* Cell Value */}
                                        {showValues && (
                                            <span
                                                className={`text-xs font-medium ${cell.normalized > 0.5 ? 'text-white' : 'text-gray-700'
                                                    }`}
                                            >
                                                {cell.value}
                                            </span>
                                        )}

                                        {/* Hover Highlight */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.div
                                                    className="absolute inset-0 bg-white opacity-20 pointer-events-none"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 0.2 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltips && hoveredCell && (
                    <motion.div
                        className="absolute z-20 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
                        style={{
                            left: (hoveredCell.col + 1) * cellSize + (rowLabels.length > 0 ? cellSize : 0),
                            top: (hoveredCell.row + 1) * cellSize + (columnLabels.length > 0 ? cellSize : 0) + 100,
                            transform: 'translate(-50%, -100%)'
                        }}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="font-medium">
                            {rowLabels[hoveredCell.row] && columnLabels[hoveredCell.col]
                                ? `${rowLabels[hoveredCell.row]} × ${columnLabels[hoveredCell.col]}`
                                : `Cell (${hoveredCell.row}, ${hoveredCell.col})`
                            }
                        </div>
                        <div className="text-gray-300">
                            Value: {normalizedData[hoveredCell.row][hoveredCell.col].value}
                        </div>
                        {normalizedData[hoveredCell.row][hoveredCell.col].label && (
                            <div className="text-gray-300">
                                {normalizedData[hoveredCell.row][hoveredCell.col].label}
                            </div>
                        )}

                        {/* Arrow */}
                        <div
                            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                            style={{
                                borderLeft: '4px solid transparent',
                                borderRight: '4px solid transparent',
                                borderTop: '4px solid #1f2937'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Statistics */}
            <motion.div
                className="mt-6 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-lg font-bold text-gray-900">{minValue}</div>
                        <div className="text-sm text-gray-600">Minimum</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900">
                            {((minValue + maxValue) / 2).toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Average</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900">{maxValue}</div>
                        <div className="text-sm text-gray-600">Maximum</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}