import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6",
                className
            )}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {React.Children.map(children, (child, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
                    className="w-full"
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}