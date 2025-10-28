import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressCircleProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    showPercentage?: boolean;
    showLabel?: boolean;
    label?: string;
    animationDuration?: number;
    animationDelay?: number;
    className?: string;
    children?: React.ReactNode;
}

export function AnimatedProgressCircle({
    progress,
    size = 120,
    strokeWidth = 8,
    color = '#3b82f6',
    backgroundColor = '#e5e7eb',
    showPercentage = true,
    showLabel = false,
    label,
    animationDuration = 1.5,
    animationDelay = 0,
    className = '',
    children
}: AnimatedProgressCircleProps) {
    const [isVisible, setIsVisible] = useState(false);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, animationDelay * 1000);

        return () => clearTimeout(timer);
    }, [animationDelay]);

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {/* Background Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={backgroundColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="opacity-30"
                    />

                    {/* Progress Circle */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                            strokeDashoffset: isVisible ? strokeDashoffset : circumference
                        }}
                        transition={{
                            duration: animationDuration,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                    />

                    {/* Glow Effect */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth + 2}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        className="opacity-20"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                            strokeDashoffset: isVisible ? strokeDashoffset : circumference
                        }}
                        transition={{
                            duration: animationDuration,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: 0.1
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {children || (
                        <div className="text-center">
                            {showPercentage && (
                                <motion.div
                                    className="text-2xl font-bold"
                                    style={{ color }}
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
                                    {Math.round(progress)}%
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Label */}
            {showLabel && label && (
                <motion.div
                    className="mt-2 text-sm font-medium text-gray-600 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: isVisible ? 1 : 0,
                        y: isVisible ? 0 : 10
                    }}
                    transition={{
                        duration: 0.5,
                        delay: animationDuration * 0.7
                    }}
                >
                    {label}
                </motion.div>
            )}
        </div>
    );
}

// Multi-progress circle for comparing multiple values
interface MultiProgressData {
    value: number;
    color: string;
    label?: string;
}

interface AnimatedMultiProgressCircleProps {
    data: MultiProgressData[];
    size?: number;
    strokeWidth?: number;
    backgroundColor?: string;
    showLabels?: boolean;
    animationDuration?: number;
    animationDelay?: number;
    className?: string;
}

export function AnimatedMultiProgressCircle({
    data,
    size = 120,
    strokeWidth = 6,
    backgroundColor = '#e5e7eb',
    showLabels = true,
    animationDuration = 1.5,
    animationDelay = 0,
    className = ''
}: AnimatedMultiProgressCircleProps) {
    const [isVisible, setIsVisible] = useState(false);

    const radius = (size - strokeWidth * data.length) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, animationDelay * 1000);

        return () => clearTimeout(timer);
    }, [animationDelay]);

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {data.map((item, index) => {
                        const currentRadius = radius - (index * strokeWidth * 1.5);
                        const currentCircumference = currentRadius * 2 * Math.PI;
                        const strokeDasharray = currentCircumference;
                        const strokeDashoffset = currentCircumference - (item.value / 100) * currentCircumference;

                        return (
                            <g key={index}>
                                {/* Background Circle */}
                                <circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={currentRadius}
                                    stroke={backgroundColor}
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                    className="opacity-30"
                                />

                                {/* Progress Circle */}
                                <motion.circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={currentRadius}
                                    stroke={item.color}
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeDasharray={strokeDasharray}
                                    initial={{ strokeDashoffset: currentCircumference }}
                                    animate={{
                                        strokeDashoffset: isVisible ? strokeDashoffset : currentCircumference
                                    }}
                                    transition={{
                                        duration: animationDuration,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                        delay: index * 0.2
                                    }}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
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
                        <div className="text-lg font-bold text-gray-700">
                            {data.length}
                        </div>
                        <div className="text-xs text-gray-500">
                            Metrics
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Legend */}
            {showLabels && (
                <div className="mt-3 space-y-1">
                    {data.map((item, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center space-x-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                                opacity: isVisible ? 1 : 0,
                                x: isVisible ? 0 : -10
                            }}
                            transition={{
                                duration: 0.3,
                                delay: animationDuration * 0.7 + index * 0.1
                            }}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-600">
                                {item.label}: {Math.round(item.value)}%
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}