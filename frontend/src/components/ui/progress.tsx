import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    animated?: boolean;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
};

const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
};

export function ProgressBar({
    value,
    max = 100,
    className = '',
    color = 'primary',
    animated = false,
    showLabel = false,
    size = 'md'
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={cn(
                'w-full bg-gray-200 rounded-full overflow-hidden',
                sizeClasses[size]
            )}>
                <motion.div
                    className={cn(
                        'h-full rounded-full transition-all duration-300',
                        colorClasses[color]
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        duration: animated ? 0.8 : 0.3,
                        ease: 'easeOut'
                    }}
                />
            </div>
        </div>
    );
}

export { ProgressBar as Progress };