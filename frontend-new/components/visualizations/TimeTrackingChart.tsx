/**
 * TimeTrackingChart Component
 *
 * Specialized chart for visualizing time tracking data.
 * Shows daily, weekly, or monthly time distribution.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { formatDuration } from "@/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

export interface TimeTrackingData {
  date: Date;
  duration: number; // in seconds
  label?: string;
  project?: string;
}

interface TimeTrackingChartProps {
  /**
   * Time tracking data
   */
  data: TimeTrackingData[];
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart description
   */
  description?: string;
  /**
   * View mode
   */
  defaultView?: "day" | "week" | "month";
  /**
   * Show view selector
   */
  showViewSelector?: boolean;
  /**
   * Height of chart area (px)
   */
  height?: number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Target hours per day (for goal line)
   */
  targetHoursPerDay?: number;
}

export function TimeTrackingChart({
  data,
  title = "Time Tracking",
  description,
  defaultView = "week",
  showViewSelector = true,
  height = 300,
  className,
  targetHoursPerDay = 8,
}: TimeTrackingChartProps) {
  const [view, setView] = React.useState<"day" | "week" | "month">(defaultView);

  // Group data by view period
  const chartData = React.useMemo(() => {
    const grouped: Record<string, number> = {};
    const now = new Date();

    data.forEach((item) => {
      let key: string;

      switch (view) {
        case "day":
          // Group by hour
          key = new Date(item.date).getHours().toString().padStart(2, "0") + ":00";
          break;

        case "week":
          // Group by day of week
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          key = dayNames[new Date(item.date).getDay()];
          break;

        case "month":
          // Group by week number
          const weekNum = Math.ceil(new Date(item.date).getDate() / 7);
          key = `Week ${weekNum}`;
          break;

        default:
          key = item.date.toString();
      }

      grouped[key] = (grouped[key] || 0) + item.duration;
    });

    return Object.entries(grouped).map(([label, duration]) => ({
      label,
      duration,
    }));
  }, [data, view]);

  const maxDuration = React.useMemo(() => {
    return Math.max(...chartData.map((d) => d.duration), 1);
  }, [chartData]);

  const targetDuration = targetHoursPerDay * 3600; // Convert to seconds
  const targetLineHeight = (targetDuration / maxDuration) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          {showViewSelector && (
            <Tabs value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ height: `${height}px` }} className="relative">
          {/* Target Line */}
          {targetHoursPerDay > 0 && targetLineHeight <= 100 && (
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-green-500"
              style={{ bottom: `${targetLineHeight}%` }}
            >
              <span className="absolute right-0 -top-3 text-xs text-green-600">
                Goal: {targetHoursPerDay}h
              </span>
            </div>
          )}

          {/* Chart Bars */}
          <div className="flex h-full items-end gap-2">
            {chartData.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm text-[#757373]">
                No time tracked in this period
              </div>
            ) : (
              chartData.map((item, index) => {
                const barHeight = (item.duration / maxDuration) * 100;
                const hours = item.duration / 3600;
                const isAboveTarget = hours >= targetHoursPerDay;

                return (
                  <div
                    key={index}
                    className="relative flex flex-1 flex-col items-center justify-end group"
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="rounded-lg border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] px-3 py-2 text-xs font-medium text-[#1C1C1C] dark:text-white shadow-lg whitespace-nowrap">
                        {item.label}
                        <br />
                        {formatDuration(item.duration)}
                        <br />
                        ({hours.toFixed(1)}h)
                      </div>
                    </div>

                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}%` }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "w-full rounded-t-lg cursor-pointer transition-colors",
                        isAboveTarget
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-[#1C1C1C] dark:bg-white hover:opacity-80"
                      )}
                    />

                    {/* Label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      className="mt-2 text-xs font-medium text-[#757373] text-center truncate w-full"
                      title={item.label}
                    >
                      {item.label}
                    </motion.div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t-2 border-[#757373]/40 pt-4">
          <div className="text-center">
            <p className="text-xs text-[#757373]">Total Time</p>
            <p className="text-lg font-semibold text-[#1C1C1C] dark:text-white">
              {formatDuration(
                chartData.reduce((sum, item) => sum + item.duration, 0)
              )}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-[#757373]">Average</p>
            <p className="text-lg font-semibold text-[#1C1C1C] dark:text-white">
              {formatDuration(
                chartData.length > 0
                  ? chartData.reduce((sum, item) => sum + item.duration, 0) /
                      chartData.length
                  : 0
              )}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-[#757373]">Peak Day</p>
            <p className="text-lg font-semibold text-[#1C1C1C] dark:text-white">
              {formatDuration(maxDuration)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
