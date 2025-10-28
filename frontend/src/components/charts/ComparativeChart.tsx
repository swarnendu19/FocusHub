import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComparisonData {
    label: string;
    current: number;
    previous: number;
    color?: string;
    metadata?: any;
}

interface ComparativeChartProps {
    data: ComparisonData[];
    title?: string;
    subtitle?: string;
    showPercentageChange?: boolean;
    showTrend?: boolean;
    animationDelay?: number;
    onItemHover?: (item: ComparisonData | null) => void;
    className?: string;
}

export function ComparativeChart({
    data,
    title = 'Performance Comparison',
    subtitle = 'Current vs Previous Period',
    showPercentageChange = true,
    showTrend = true,
    animationDelay = 0.1,
    onItemHover,
    className = ''
}: ComparativeChartProps) {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    React.useEffect(() => {
        setIsVisible(true);
    }, []);

    const maxValue = useMemo(() => {
        return Math.max(...data.flatMap(item => [item.current, item.previous]));
    }, [data]);

    const getPercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const getTrendIcon = (change: number) => {
        if (change > 0) return '↗️';
        if (change < 0) return '↘️';
        return '➡️';
    };

    const getTrendColor = (change: number) => {
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getDefaultColor = (index: number) => {
        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];
        return colors[index % colors.length];
    };

    const handleItemHover = (index: number, item: ComparisonData) => {
        setHoveredItem(index);
        onItemHover?.(item);
    };

    const handleItemLeave = () => {
        setHoveredItem(null);
        onItemHover?.(null);
    };

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
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </motion.div>

            {/* Comparison Items */}
            <div className="space-y-4">
                {data.map((item, index) => {
                    const percentageChange = getPercentageChange(item.current, item.previous);
                    const isHovered = hoveredItem === index;
                    const color = item.color || getDefaultColor(index);

                    return (
                        <motion.div
                            key={item.label}
                            className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${isHovered
                                    ? 'border-blue-200 bg-blue-50'
                                    : 'border-gray-100 hover:border-gray-200'
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                            transition={{
                                duration: 0.5,
                                delay: index * animationDelay,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            onMouseEnter={() => handleItemHover(index, item)}
                            onMouseLeave={handleItemLeave}
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* Item Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                                </div>

                                {/* Trend Indicator */}
                                {showTrend && (
                                    <motion.div
                                        className={`flex items-center space-x-1 ${getTrendColor(percentageChange)}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                                        transition={{ duration: 0.3, delay: index * animationDelay + 0.3 }}
                                    >
                                        <span className="text-lg">{getTrendIcon(percentageChange)}</span>
                                        {showPercentageChange && (
                                            <span className="text-sm font-medium">
                                                {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
                                            </span>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-3">
                                {/* Current Period */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600">Current</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.current.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className="h-2 rounded-full"
                                            style={{ backgroundColor: color }}
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: isVisible ? `${(item.current / maxValue) * 100}%` : 0
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                delay: index * animationDelay + 0.2,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Previous Period */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600">Previous</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.previous.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className="h-2 rounded-full opacity-60"
                                            style={{ backgroundColor: color }}
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: isVisible ? `${(item.previous / maxValue) * 100}%` : 0
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                delay: index * animationDelay + 0.4,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Difference Indicator */}
                            <motion.div
                                className="mt-3 pt-3 border-t border-gray-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isVisible ? 1 : 0 }}
                                transition={{ duration: 0.3, delay: index * animationDelay + 0.6 }}
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Difference</span>
                                    <div className={`flex items-center space-x-1 ${getTrendColor(percentageChange)}`}>
                                        <span className="font-medium">
                                            {item.current - item.previous > 0 ? '+' : ''}
                                            {(item.current - item.previous).toLocaleString()}
                                        </span>
                                        {showPercentageChange && (
                                            <span className="text-xs">
                                                ({percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hover Effect Overlay */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        className="absolute inset-0 bg-blue-500 opacity-5 rounded-lg pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.05 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary */}
            <motion.div
                className="mt-6 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: data.length * animationDelay + 0.5 }}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {data.reduce((sum, item) => sum + item.current, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Current Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                            {data.reduce((sum, item) => sum + item.previous, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Previous Total</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}