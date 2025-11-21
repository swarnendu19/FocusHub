/**
 * HeatMap Component
 *
 * Activity heatmap visualization (GitHub-style contribution graph).
 * Shows activity patterns over time with color intensity.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { formatDate } from "@/utils/format";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

export interface HeatMapData {
  date: Date;
  value: number;
  label?: string;
}

interface HeatMapProps {
  /**
   * Heatmap data
   */
  data: HeatMapData[];
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart description
   */
  description?: string;
  /**
   * Number of weeks to show
   */
  weeks?: number;
  /**
   * Cell size (px)
   */
  cellSize?: number;
  /**
   * Cell gap (px)
   */
  cellGap?: number;
  /**
   * Color scheme
   */
  colorScheme?: "default" | "green" | "blue" | "purple";
  /**
   * Additional className
   */
  className?: string;
  /**
   * Value formatter
   */
  valueFormatter?: (value: number) => string;
}

export function HeatMap({
  data,
  title = "Activity Heatmap",
  description,
  weeks = 26, // ~6 months
  cellSize = 12,
  cellGap = 3,
  colorScheme = "default",
  className,
  valueFormatter = (value) => `${value} sessions`,
}: HeatMapProps) {
  // Generate calendar grid
  const calendar = React.useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - weeks * 7);

    // Create map of dates to values
    const dataMap = new Map<string, number>();
    data.forEach((item) => {
      const key = formatDate(item.date, "YYYY-MM-DD");
      dataMap.set(key, item.value);
    });

    // Generate grid (weeks x 7 days)
    const grid: Array<Array<{ date: Date; value: number }>> = [];
    let currentDate = new Date(startDate);

    // Start from Sunday
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let week = 0; week < weeks; week++) {
      const weekData: Array<{ date: Date; value: number }> = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(currentDate);
        const key = formatDate(date, "YYYY-MM-DD");
        const value = dataMap.get(key) || 0;

        weekData.push({ date, value });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      grid.push(weekData);
    }

    return grid;
  }, [data, weeks]);

  // Calculate max value for color scaling
  const maxValue = React.useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  // Get color intensity based on value
  const getColorIntensity = (value: number): string => {
    if (value === 0) {
      return "bg-[#FAFAFA] dark:bg-[#1C1C1C]/20 border-[#757373]/20";
    }

    const intensity = Math.min(value / maxValue, 1);
    const level = Math.ceil(intensity * 4); // 4 levels

    const schemes = {
      default: [
        "bg-[#757373]/20",
        "bg-[#757373]/40",
        "bg-[#757373]/60",
        "bg-[#1C1C1C] dark:bg-white",
      ],
      green: [
        "bg-green-200 dark:bg-green-900/40",
        "bg-green-400 dark:bg-green-700/60",
        "bg-green-600 dark:bg-green-500/80",
        "bg-green-800 dark:bg-green-300",
      ],
      blue: [
        "bg-blue-200 dark:bg-blue-900/40",
        "bg-blue-400 dark:bg-blue-700/60",
        "bg-blue-600 dark:bg-blue-500/80",
        "bg-blue-800 dark:bg-blue-300",
      ],
      purple: [
        "bg-purple-200 dark:bg-purple-900/40",
        "bg-purple-400 dark:bg-purple-700/60",
        "bg-purple-600 dark:bg-purple-500/80",
        "bg-purple-800 dark:bg-purple-300",
      ],
    };

    return schemes[colorScheme][level - 1];
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1">
            {/* Day labels */}
            <div className="flex gap-1">
              <div style={{ width: `${cellSize * 2}px` }} className="flex flex-col justify-around text-xs text-[#757373]">
                {["Mon", "Wed", "Fri"].map((day, index) => (
                  <div key={day} className="h-3 flex items-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex" style={{ gap: `${cellGap}px` }}>
                {calendar.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col"
                    style={{ gap: `${cellGap}px` }}
                  >
                    {week.map((day, dayIndex) => {
                      const isToday =
                        formatDate(day.date, "YYYY-MM-DD") ===
                        formatDate(new Date(), "YYYY-MM-DD");

                      return (
                        <motion.div
                          key={dayIndex}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: (weekIndex * 7 + dayIndex) * 0.002,
                            duration: 0.2,
                          }}
                          className="group relative"
                        >
                          <div
                            className={cn(
                              "rounded-sm border-2 transition-all cursor-pointer hover:border-[#1C1C1C] dark:hover:border-white",
                              getColorIntensity(day.value),
                              isToday && "ring-2 ring-[#1C1C1C] dark:ring-white ring-offset-2"
                            )}
                            style={{
                              width: `${cellSize}px`,
                              height: `${cellSize}px`,
                            }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                              <div className="rounded-lg border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] px-3 py-2 text-xs font-medium text-[#1C1C1C] dark:text-white shadow-lg whitespace-nowrap">
                                {formatDate(day.date, "MMM DD, YYYY")}
                                <br />
                                {valueFormatter(day.value)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between text-xs text-[#757373]">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "rounded-sm border-2 border-[#757373]/20",
                      level === 0
                        ? "bg-[#FAFAFA] dark:bg-[#1C1C1C]/20"
                        : getColorIntensity((maxValue / 4) * level)
                    )}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t-2 border-[#757373]/40 pt-4">
          <div className="text-center">
            <p className="text-xs text-[#757373]">Total Days</p>
            <p className="text-lg font-semibold text-[#1C1C1C] dark:text-white">
              {data.length}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-[#757373]">Total Activity</p>
            <p className="text-lg font-semibold text-[#1C1C1C] dark:text-white">
              {data.reduce((sum, item) => sum + item.value, 0)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-[#757373]">Avg/Day</p>
            <p className="text-lg font-semibold text-[#1C1C1C] dark:text-white">
              {data.length > 0
                ? (
                    data.reduce((sum, item) => sum + item.value, 0) / data.length
                  ).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
