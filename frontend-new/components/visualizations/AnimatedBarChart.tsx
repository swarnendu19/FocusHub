/**
 * AnimatedBarChart Component
 *
 * Animated bar chart component for visualizing data.
 * Uses Framer Motion for smooth bar animations.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  /**
   * Chart data
   */
  data: BarChartData[];
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart description
   */
  description?: string;
  /**
   * Show values on bars
   */
  showValues?: boolean;
  /**
   * Show grid lines
   */
  showGrid?: boolean;
  /**
   * Orientation
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Height of chart area (px)
   */
  height?: number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Value formatter
   */
  valueFormatter?: (value: number) => string;
}

export function AnimatedBarChart({
  data,
  title,
  description,
  showValues = true,
  showGrid = true,
  orientation = "vertical",
  height = 300,
  className,
  valueFormatter = (value) => value.toString(),
}: AnimatedBarChartProps) {
  const maxValue = React.useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const defaultColors = [
    "#1C1C1C",
    "#757373",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
  ];

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <div
          style={{ height: `${height}px` }}
          className="relative flex items-end gap-2"
        >
          {/* Grid Lines */}
          {showGrid && (
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-px w-full bg-[#757373]/20"
                />
              ))}
            </div>
          )}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const color = item.color || defaultColors[index % defaultColors.length];

            return (
              <div
                key={index}
                className="relative flex-1 flex flex-col items-center justify-end"
              >
                {/* Value Label (top) */}
                {showValues && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="mb-2 text-xs font-medium text-[#757373]"
                  >
                    {valueFormatter(item.value)}
                  </motion.div>
                )}

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="w-full rounded-t-lg relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                >
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="rounded-lg border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] px-3 py-2 text-xs font-medium text-[#1C1C1C] dark:text-white shadow-lg whitespace-nowrap">
                      {item.label}: {valueFormatter(item.value)}
                    </div>
                  </div>
                </motion.div>

                {/* Label (bottom) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="mt-2 text-xs font-medium text-[#757373] text-center truncate w-full"
                  title={item.label}
                >
                  {item.label}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Y-Axis Labels (optional) */}
        {showGrid && (
          <div className="mt-4 flex justify-between text-xs text-[#757373]">
            <span>0</span>
            <span>{valueFormatter(maxValue)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
