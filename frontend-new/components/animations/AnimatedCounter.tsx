/**
 * AnimatedCounter Component
 *
 * Animated number counter using Framer Motion.
 * Smoothly animates number changes with customizable formatting.
 */

"use client";

import * as React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/utils";

interface AnimatedCounterProps {
  /**
   * Target value to count to
   */
  value: number;
  /**
   * Number of decimal places
   */
  decimals?: number;
  /**
   * Prefix (e.g., "$", "+")
   */
  prefix?: string;
  /**
   * Suffix (e.g., "XP", "%")
   */
  suffix?: string;
  /**
   * Animation duration in seconds
   */
  duration?: number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Use thousand separators
   */
  useGrouping?: boolean;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1,
  className,
  useGrouping = true,
}: AnimatedCounterProps) {
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    const formatted = useGrouping
      ? current.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : current.toFixed(decimals);

    return `${prefix}${formatted}${suffix}`;
  });

  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}
