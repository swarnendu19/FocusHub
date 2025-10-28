import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataPoint {
    label: string;
    value: number;
    color?: string;
    metadata?: any;
}

interface AnimatedBarChartProps {
    data: DataPoint[];
    height?: number;
    maxValue?: number;
    showValues?: boolean;
    showLabels?: boolean;
    animationDelay?: number;
    onBarHover?: (dataPoint: DataPoint | null) => void;
    onBarClick?: (dataPoint: DataPoint) => void;
    className?: string;
}

export function AnimatedBarChart({
    data,
    height = 200,
    maxValue,
    showValues = true,
    showLabels = true,
    animationDelay = 0.1,
    onBarHover,
    onBarClick,
    className = ''
}: AnimatedBarChartProps) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const calculatedMaxValue = maxValue || Math.max(...data.map(d => d.value)) || 1;
    const barWidth = Math.max(20, Math.min(60, (100 / data.length) - 2));

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const getBarColor = (index: number, dataPoint: DataPoint) => {
        if (dataPoint.color) return dataPoint.color;

        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];
        return colors[index % colors.length];
    };

    const handleBarHover = (index: number, dataPoint: DataPoint) => {
        setHoveredBar(index);
        onBarHover?.(dataPoint);
    };

    const handleBarLeave = () => {
        setHoveredBar(null);
        onBarHover?.(null);
    };

    return (
        <div className={`relative ${className}`} style={{ height: height + 60 }}>
            {/* Chart Container */}
            <div className="relative flex items-end justify-center space-x-1 px-4" style={{ height }}>
                <AnimatePresence>
                    {data.map((dataPoint, index) => {
                        const barHeight = (dataPoint.value / calculatedMaxValue) * height;
                        const isHovered = hoveredBar === index;

                        return (
                            <motion.div
                                key={`${dataPoint.label}-${index}`}
                                className="relative flex flex-col items-center cursor-pointer"
                                style={{ width: `${barWidth}px` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * animationDelay,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                onMouseEnter={() => handleBarHover(index, dataPoint)}
                                onMouseLeave={handleBarLeave}
                                onClick={() => onBarClick?.(dataPoint)}
                            >
                                {/* Value Label */}
                                {showValues && (
                                    <motion.div
                                        className="absolute -top-6 text-xs font-medium text-gray-600 whitespace-nowrap"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: isVisible ? 1 : 0,
                                            scale: isVisible ? 1 : 0.8,
                                            y: isHovered ? -4 : 0
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * animationDelay + 0.3
                                        }}
                                    >
                                        {dataPoint.value.toLocaleString()}
                                    </motion.div>
                                )}

                                {/* Bar */}
                                <motion.div
                                    className="relative rounded-t-md shadow-sm transition-all duration-200"
                                    style={{
                                        backgroundColor: getBarColor(index, dataPoint),
                                        width: '100%',
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: isVisible ? barHeight : 0,
                                        scale: isHovered ? 1.05 : 1,
                                        boxShadow: isHovered
                                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                    }}
                                    transition={{
                                        height: {
                                            duration: 0.8,
                                            delay: index * animationDelay + 0.2,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        },
                                        scale: { duration: 0.2 },
                                        boxShadow: { duration: 0.2 }
                                    }}
                                >
                                    {/* Gradient Overlay */}
                                    <div
                                        className="absolute inset-0 rounded-t-md opacity-20"
                                        style={{
                                            background: `linear-gradient(to top, transparent, white)`
                                        }}
                                    />

                                    {/* Hover Effect */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                className="absolute inset-0 rounded-t-md bg-white"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.2 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Labels */}
            {showLabels && (
                <div className="flex items-center justify-center space-x-1 mt-2 px-4">
                    {data.map((dataPoint, index) => (
                        <motion.div
                            key={`label-${dataPoint.label}-${index}`}
                            className="text-xs text-gray-500 text-center truncate"
                            style={{ width: `${barWidth}px` }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
                            transition={{
                                duration: 0.4,
                                delay: index * animationDelay + 0.5
                            }}
                        >
                            {dataPoint.label}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredBar !== null && (
                    <motion.div
                        className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
                        style={{
                            left: `${(hoveredBar + 0.5) * (100 / data.length)}%`,
                            bottom: height + 40,
                            transform: 'translateX(-50%)'
                        }}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="font-medium">{data[hoveredBar].label}</div>
                        <div className="text-gray-300">
                            Value: {data[hoveredBar].value.toLocaleString()}
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