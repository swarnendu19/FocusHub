import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        x: 20,
        scale: 0.98
    },
    in: {
        opacity: 1,
        x: 0,
        scale: 1
    },
    out: {
        opacity: 0,
        x: -20,
        scale: 0.98
    }
};

const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate',
    duration: 0.3
};

export function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Alternative slide transition for specific use cases
export function SlidePageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    const slideVariants = {
        initial: {
            opacity: 0,
            x: 100
        },
        in: {
            opacity: 1,
            x: 0
        },
        out: {
            opacity: 0,
            x: -100
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={slideVariants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Fade transition for subtle page changes
export function FadePageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    const fadeVariants = {
        initial: {
            opacity: 0
        },
        in: {
            opacity: 1
        },
        out: {
            opacity: 0
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={fadeVariants}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}