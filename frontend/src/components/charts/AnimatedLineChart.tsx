import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataPoint {
    x: number | string;
    y: number;
    label?: string;
    metadata?: any;
}

interface AnimatedLineChartProps {
    data: DataPoint[];
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
    showDots?: boolean;
    showGrid?: boolean;
    showArea?: boolean;
    animationDuration?: number;
    onPointHover?: (dataPoint: DataPoint | null, index: number | null) => void;
    className?: string;
}

export function AnimatedLineChart({
    data,
    width = 400,
    height = 200,
    color = '#3b82f6',
    strokeWidth = 2,
    showDots = true,
    showGrid = true,
    showArea = false,
    animationDuration = 1.5,
    onPointHover,
    className = ''
}: AnimatedLineChartProps) {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const { minY, maxY, minX, maxX, points, pathData, areaData } = useMemo(() => {
        if (data.length === 0) {
            return { minY: 0, maxY: 1, minX: 0, maxX: 1, points: [], pathData: '', areaData: '' };
        }

        const yValues = data.map(d => d.y);
        const xValues = data.map(d => typeof d.x === 'number' ? d.x : 0);

        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);

        // Add some padding to Y range
        const yRange = maxY - minY;
        const paddedMinY = minY - yRange * 0.1;
        const paddedMaxY = maxY + yRange * 0.1;

        const points = data.map((point, index) => {
            const x = typeof point.x === 'number'
                ? ((point.x - minX) / (maxX - minX)) * chartWidth + padding
                : (index / (data.length - 1)) * chartWidth + padding;
            const y = height - (((point.y - paddedMinY) / (paddedMaxY - paddedMinY)) * chartHeight + padding);

            return { x, y, originalPoint: point, index };
        });

        const pathData = points.reduce((path, point, index) => {
            const command = index === 0 ? 'M' : 'L';
            return `${path} ${command} ${point.x} ${point.y}`;
        }, '');

        const areaData = points.length > 0
            ? `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
            : '';

        return {
            minY: paddedMinY,
            maxY: paddedMaxY,
            minX,
            maxX,
            points,
            pathData,
            areaData
        };
    }, [data, chartWidth, chartHeight, height, padding]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePointHover = (index: number, point: DataPoint) => {
        setHoveredPoint(index);
        onPointHover?.(point, index);
    };

    const handlePointLeave = () => {
        setHoveredPoint(null);
        onPointHover?.(null, null);
    };

    const gridLines = useMemo(() => {
        const lines = [];
        const gridCount = 5;

        // Horizontal grid lines
        for (let i = 0; i <= gridCount; i++) {
            const y = padding + (i / gridCount) * chartHeight;
            const value = maxY - (i / gridCount) * (maxY - minY);
            lines.push({
                type: 'horizontal',
                x1: padding,
                y1: y,
                x2: width - padding,
                y2: y,
                value: value.toFixed(0)
            });
        }

        // Vertical grid lines
        for (let i = 0; i <= gridCount; i++) {
            const x = padding + (i / gridCount) * chartWidth;
            lines.push({
                type: 'vertical',
                x1: x,
                y1: padding,
                x2: x,
                y2: height - padding,
                value: ''
            });
        }

        return lines;
    }, [padding, chartWidth, chartHeight, width, height, minY, maxY]);

    return (
        <div className={`relative ${className}`}>
            <svg width={width} height={height} className="overflow-visible">
                {/* Grid */}
                {showGrid && (
                    <g className="opacity-20">
                        {gridLines.map((line, index) => (
                            <motion.line
                                key={index}
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                stroke="#6b7280"
                                strokeWidth={1}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isVisible ? 0.2 : 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            />
                        ))}
                    </g>
                )}

                {/* Grid Labels */}
                {showGrid && (
                    <g className="text-xs fill-gray-500">
                        {gridLines
                            .filter(line => line.type === 'horizontal')
                            .map((line, index) => (
                                <motion.text
                                    key={index}
                                    x={padding - 8}
                                    y={line.y1 + 4}
                                    textAnchor="end"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isVisible ? 1 : 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    {line.value}
                                </motion.text>
                            ))}
                    </g>
                )}

                {/* Area Fill */}
                {showArea && (
                    <motion.path
                        d={areaData}
                        fill={`url(#gradient-${color.replace('#', '')})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 0.3 : 0 }}
                        transition={{ duration: animationDuration, delay: 0.5 }}
                    />
                )}

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.1} />
                    </linearGradient>
                </defs>

                {/* Line Path */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: isVisible ? 1 : 0,
                        opacity: isVisible ? 1 : 0
                    }}
                    transition={{
                        pathLength: { duration: animationDuration, ease: "easeInOut" },
                        opacity: { duration: 0.3 }
                    }}
                />

                {/* Data Points */}
                {showDots && (
                    <g>
                        {points.map((point, index) => (
                            <motion.circle
                                key={index}
                                cx={point.x}
                                cy={point.y}
                                r={hoveredPoint === index ? 6 : 4}
                                fill={color}
                                stroke="white"
                                strokeWidth={2}
                                className="cursor-pointer"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: isVisible ? 1 : 0,
                                    opacity: isVisible ? 1 : 0
                                }}
                                transition={{
                                    duration: 0.3,
                                    delay: (index / points.length) * 0.5 + animationDuration * 0.7
                                }}
                                whileHover={{ scale: 1.2 }}
                                onMouseEnter={() => handlePointHover(index, point.originalPoint)}
                                onMouseLeave={handlePointLeave}
                            />
                        ))}
                    </g>
                )}

                {/* Hover Line */}
                <AnimatePresence>
                    {hoveredPoint !== null && points[hoveredPoint] && (
                        <motion.line
                            x1={points[hoveredPoint].x}
                            y1={padding}
                            x2={points[hoveredPoint].x}
                            y2={height - padding}
                            stroke={color}
                            strokeWidth={1}
                            strokeDasharray="4,4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredPoint !== null && points[hoveredPoint] && (
                    <motion.div
                        className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
                        style={{
                            left: points[hoveredPoint].x,
                            top: points[hoveredPoint].y - 10,
                            transform: 'translate(-50%, -100%)'
                        }}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="font-medium">
                            {points[hoveredPoint].originalPoint.label ||
                                `Point ${hoveredPoint + 1}`}
                        </div>
                        <div className="text-gray-300">
                            Value: {points[hoveredPoint].originalPoint.y.toLocaleString()}
                        </div>

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
        </div>
    );
}