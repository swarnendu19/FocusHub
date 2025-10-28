import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Loading Spinner Component
export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'muted';
    text?: string;
    className?: string;
}

export function LoadingSpinner({
    size = 'md',
    color = 'primary',
    text,
    className = ''
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    const colorClasses = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        muted: 'text-muted-foreground',
    };

    return (
        <div className={`flex items-center justify-center space-x-2 ${className}`}>
            <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
            {text && (
                <span className={`text-sm ${colorClasses[color]}`}>
                    {text}
                </span>
            )}
        </div>
    );
}

// Full Page Loading Component
export interface FullPageLoadingProps {
    message?: string;
    showProgress?: boolean;
    progress?: number;
}

export function FullPageLoading({
    message = 'Loading...',
    showProgress = false,
    progress = 0
}: FullPageLoadingProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-semibold text-gray-900 mb-2"
                >
                    {message}
                </motion.h2>

                {showProgress && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-64 mx-auto"
                    >
                        <div className="bg-gray-200 rounded-full h-2 mb-2">
                            <motion.div
                                className="bg-primary h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

// Skeleton Loading Components
export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-gray-200 rounded-lg p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-2/3"></div>
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3, className = '' }: { count?: number; className?: string }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="animate-pulse flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-gray-200 rounded-lg p-6">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="flex items-end space-x-2 h-32">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-gray-300 rounded-t flex-1"
                            style={{ height: `${Math.random() * 80 + 20}%` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Error State Components
export interface ErrorStateProps {
    title?: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    variant?: 'error' | 'warning' | 'info';
}

export function ErrorState({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    action,
    secondaryAction,
    className = '',
    variant = 'error'
}: ErrorStateProps) {
    const variants = {
        error: {
            icon: XCircle,
            iconColor: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
        },
        warning: {
            icon: AlertCircle,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
        },
        info: {
            icon: AlertCircle,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
    };

    const config = variants[variant];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 text-center ${className}`}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
            >
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-gray-900 mb-2"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-4"
            >
                {message}
            </motion.p>

            {(action || secondaryAction) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    {action && (
                        <Button onClick={action.onClick} className="min-w-[120px]">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {action.label}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button
                            onClick={secondaryAction.onClick}
                            variant="outline"
                            className="min-w-[120px]"
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

// Empty State Component
export interface EmptyStateProps {
    title?: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
}

export function EmptyState({
    title = 'No data available',
    message = 'There is nothing to show here yet.',
    action,
    icon: Icon,
    className = ''
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`text-center py-12 ${className}`}
        >
            {Icon && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full"
                >
                    <Icon className="w-8 h-8 text-gray-400" />
                </motion.div>
            )}

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-gray-900 mb-2"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6 max-w-sm mx-auto"
            >
                {message}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button onClick={action.onClick}>
                        {action.label}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}

// Success State Component
export interface SuccessStateProps {
    title?: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function SuccessState({
    title = 'Success!',
    message = 'Operation completed successfully.',
    action,
    className = ''
}: SuccessStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
            >
                <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-gray-900 mb-2"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-4"
            >
                {message}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button onClick={action.onClick}>
                        {action.label}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}