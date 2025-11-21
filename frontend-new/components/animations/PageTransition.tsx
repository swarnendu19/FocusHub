/**
 * PageTransition Component
 *
 * Smooth page transition animations for route changes.
 * Wraps page content with enter/exit animations using Framer Motion.
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { usePrefersReducedMotion } from "@/hooks";

interface PageTransitionProps {
  /**
   * Children to animate
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Transition variant
   */
  variant?: "fade" | "slide" | "scale" | "none";
  /**
   * Animation duration in seconds
   */
  duration?: number;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

export function PageTransition({
  children,
  className,
  variant = "fade",
  duration = 0.3,
}: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use 'none' variant if user prefers reduced motion
  const effectiveVariant = prefersReducedMotion ? "none" : variant;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variants[effectiveVariant].initial}
        animate={variants[effectiveVariant].animate}
        exit={variants[effectiveVariant].exit}
        transition={{
          duration: prefersReducedMotion ? 0 : duration,
          ease: "easeInOut",
        }}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * FadeIn Component
 *
 * Simple fade-in animation for elements.
 */
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
}: FadeInProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              ...directionOffset[direction],
            }
      }
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Container
 *
 * Container for staggered children animations.
 */
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item
 *
 * Individual item within a StaggerContainer.
 */
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
