import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonutSegment {
    label: string;
    value: number;
    color: string;
    metadata?: any;
}

interface AnimatedDonutChartProps {
    data: DonutSegment[];
    size?: number;
    strokeWidth?: number;
    showLabels?: boolean;
    showValues?: boolean;
    showLegend?: boolean;
    animationDuration?: number;
    onSegmentHover?: (segment: DonutSegment | null) => void;
    onSegmentClick?: (segment: DonutSegment) => void;
    className?: string;
    centerContent?: React.ReactNode;
}

export function AnimatedDonutChart({
    data,
    size = 200,
    strokeWidth = 30,
    showLabels = true,
    showValues = true,
    showLegend = true,
    animationDuration = 1.5,
    onSegmentHover,
    onSegmentClick,
    className = '',
    centerContent
}: AnimatedDonutChartProps) {
    const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const total = data.reduce((sum, segment) => sum + segment.value, 0);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const segments = data.map((segment, index) => {
        const percentage = (segment.value / total) * 100;
        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

        // Calculate rotation for each segment
        const previousPercentages = data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 100, 0);
        const rotation = (previousPercentages / 100) * 360 - 90; // -90 to start from top

        return {
            ...segment,
            percentage,
            strokeDasharray,
            rotation,
            index
        };
    });

    const handleSegmentHover = (index: number, segment: DonutSegment) => {
        setHoveredSegment(index);
        onSegmentHover?.(segment);
    };

    const handleSegmentLeave = () => {
        setHoveredSegment(null);
        onSegmentHover?.(null);
    };

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform">
                    {/* Background Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#f3f4f6"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="opacity-50"
                    />

                    {/* Segments */}
                    {segments.map((segment, index) => (
                        <motion.circle
                            key={segment.label}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={segment.color}
                            strokeWidth={hoveredSegment === index ? strokeWidth + 4 : strokeWidth}
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={segment.strokeDasharray}
                            className="cursor-pointer transition-all duration-200"
                            style={{
                                transformOrigin: `${size / 2}px ${size / 2}px`,
                                transform: `rotate(${segment.rotation}deg)`,
                                filter: hoveredSegment === index ? 'brightness(1.1)' : 'none'
                            }}
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{
                                strokeDasharray: isVisible ? segment.strokeDasharray : `0 ${circumference}`
                            }}
                            transition={{
                                duration: animationDuration,
                                delay: index * 0.2,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            onMouseEnter={() => handleSegmentHover(index, segment)}
                            onMouseLeave={handleSegmentLeave}
                            onClick={() => onSegmentClick?.(segment)}
                        />
                    ))}

                    {/* Segment Labels */}
                    {showLabels && (
                        <g>
                            {segments.map((segment, index) => {
                                if (segment.percentage < 5) return null; // Don't show labels for very small segments

                                const angle = (segment.rotation + 90 + (segment.percentage / 100) * 360 / 2) * (Math.PI / 180);
                                const labelRadius = radius + strokeWidth / 2;
                                const x = size / 2 + Math.cos(angle) * labelRadius;
                                const y = size / 2 + Math.sin(angle) * labelRadius;

                                return (
                                    <motion.text
                                        key={`label-${segment.label}`}
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{
                                            opacity: isVisible ? 1 : 0,
                                            scale: isVisible ? 1 : 0.5
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: animationDuration * 0.7 + index * 0.1
                                        }}
                                    >
                                        {showValues ? `${Math.round(segment.percentage)}%` : segment.label}
                                    </motion.text>
                                );
                            })}
                        </g>
                    )}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {centerContent || (
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: isVisible ? 1 : 0,
                                scale: isVisible ? 1 : 0.5
                            }}
                            transition={{
                                duration: 0.5,
                                delay: animationDuration * 0.5
                            }}
                        >
                            <div className="text-2xl font-bold text-gray-700">
                                {total.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                                Total
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="mt-4 grid grid-cols-2 gap-2 max-w-xs">
                    {segments.map((segment, index) => (
                        <motion.div
                            key={segment.label}
                            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${hoveredSegment === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                                }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: isVisible ? 1 : 0,
                                y: isVisible ? 0 : 10
                            }}
                            transition={{
                                duration: 0.3,
                                delay: animationDuration * 0.8 + index * 0.1
                            }}
                            onMouseEnter={() => handleSegmentHover(index, segment)}
                            onMouseLeave={handleSegmentLeave}
                            onClick={() => onSegmentClick?.(segment)}
                        >
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-700 truncate">
                                    {segment.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {segment.value.toLocaleString()} ({Math.round(segment.percentage)}%)
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredSegment !== null && (
                    <motion.div
                        className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="font-medium">{segments[hoveredSegment].label}</div>
                        <div className="text-gray-300">
                            {segments[hoveredSegment].value.toLocaleString()} ({Math.round(segments[hoveredSegment].percentage)}%)
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}