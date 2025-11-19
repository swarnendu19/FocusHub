/**
 * StatCard Component
 *
 * Card component for displaying key metrics and statistics.
 * Supports trends, comparisons, and animated number changes.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { Card, Badge } from "@/components/ui";
import { AnimatedCounter } from "@/components/animations";

interface StatCardProps {
  /**
   * Stat label/title
   */
  label: string;
  /**
   * Current value
   */
  value: number;
  /**
   * Previous value (for trend calculation)
   */
  previousValue?: number;
  /**
   * Icon element
   */
  icon?: React.ReactNode;
  /**
   * Value prefix (e.g., "$")
   */
  prefix?: string;
  /**
   * Value suffix (e.g., "XP", "%")
   */
  suffix?: string;
  /**
   * Number of decimal places
   */
  decimals?: number;
  /**
   * Show trend indicator
   */
  showTrend?: boolean;
  /**
   * Additional description
   */
  description?: string;
  /**
   * Color theme
   */
  color?: "default" | "primary" | "success" | "warning" | "danger";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Additional className
   */
  className?: string;
}

export function StatCard({
  label,
  value,
  previousValue,
  icon,
  prefix = "",
  suffix = "",
  decimals = 0,
  showTrend = true,
  description,
  color = "default",
  size = "md",
  className,
}: StatCardProps) {
  // Calculate trend
  const trend = React.useMemo(() => {
    if (!showTrend || previousValue === undefined || previousValue === 0) {
      return null;
    }

    const change = value - previousValue;
    const percentChange = (change / previousValue) * 100;

    return {
      change,
      percentChange,
      isPositive: change > 0,
      isNegative: change < 0,
    };
  }, [value, previousValue, showTrend]);

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const valueSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const iconSizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    default: "bg-[#1C1C1C] dark:bg-white text-white dark:text-[#1C1C1C]",
    primary: "bg-blue-600 dark:bg-blue-500 text-white",
    success: "bg-green-600 dark:bg-green-500 text-white",
    warning: "bg-yellow-600 dark:bg-yellow-500 text-white",
    danger: "bg-red-600 dark:bg-red-500 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(sizeClasses[size], className)}>
        <div className="flex items-start justify-between">
          {/* Left: Label and Value */}
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-[#757373]">{label}</p>

            <div className="flex items-baseline gap-2">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                decimals={decimals}
                className={cn(
                  "font-bold text-[#1C1C1C] dark:text-white",
                  valueSizeClasses[size]
                )}
              />

              {/* Trend Indicator */}
              {trend && (
                <Badge
                  variant={trend.isPositive ? "default" : "destructive"}
                  className="gap-1 text-xs"
                >
                  {trend.isPositive ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                  {Math.abs(trend.percentChange).toFixed(1)}%
                </Badge>
              )}
            </div>

            {description && (
              <p className="text-xs text-[#757373]">{description}</p>
            )}
          </div>

          {/* Right: Icon */}
          {icon && (
            <div
              className={cn(
                "flex items-center justify-center rounded-lg",
                iconSizeClasses[size],
                colorClasses[color]
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
