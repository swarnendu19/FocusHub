import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
    return (
        <motion.div
            className={cn(
                'bg-gray-200 rounded-md',
                animate && 'animate-pulse',
                className
            )}
            {...(animate && {
                animate: {
                    opacity: [0.5, 1, 0.5],
                },
                transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                },
            })}
        />
    );
}

// Card skeleton for dashboard cards
export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('p-6 bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

// Project card skeleton
export function ProjectCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('p-6 bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    );
}

// Leaderboard row skeleton
export function LeaderboardRowSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200', className)}>
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
            <div className="text-right space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-6 w-6" />
        </div>
    );
}

// Dashboard skeleton layout
export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <Skeleton className="h-6 w-24 mb-4" />
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="flex-1">
                                        <Skeleton className="h-3 w-24 mb-1" />
                                        <Skeleton className="h-2 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Projects page skeleton
export function ProjectsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

// Leaderboard skeleton
export function LeaderboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-56" />
            </div>

            <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <LeaderboardRowSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

// Generic page skeleton
export function PageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}