/**
 * TimerDisplay Component
 *
 * Displays the current timer with formatted time.
 * Shows hours, minutes, and seconds in a clear, large format.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useTimer } from "@/hooks";
import { Badge } from "@/components/ui";

interface TimerDisplayProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
}

export function TimerDisplay({ className, size = "md" }: TimerDisplayProps) {
  const { formattedTime, hours, minutes, seconds, timerState, currentTimer } =
    useTimer();

  const sizeClasses = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl",
  };

  const containerSizeClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* Timer Status Badge */}
      <div className="flex items-center gap-2">
        <Badge
          variant={
            timerState === "running"
              ? "default"
              : timerState === "paused"
              ? "secondary"
              : "outline"
          }
        >
          <div
            className={cn(
              "mr-2 h-2 w-2 rounded-full",
              timerState === "running" && "bg-green-500 animate-pulse",
              timerState === "paused" && "bg-yellow-500",
              timerState === "idle" && "bg-[#757373]"
            )}
          />
          {timerState === "running"
            ? "Running"
            : timerState === "paused"
            ? "Paused"
            : "Idle"}
        </Badge>

        {currentTimer?.projectId && (
          <Badge variant="outline">Project Timer</Badge>
        )}
      </div>

      {/* Time Display */}
      <div
        className={cn(
          "flex items-center",
          containerSizeClasses[size],
          className
        )}
      >
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "font-mono font-bold tabular-nums text-[#1C1C1C] dark:text-white",
              sizeClasses[size]
            )}
          >
            {hours.toString().padStart(2, "0")}
          </div>
          <span
            className={cn(
              "text-[#757373] uppercase font-medium",
              labelSizeClasses[size]
            )}
          >
            Hours
          </span>
        </div>

        {/* Separator */}
        <div
          className={cn(
            "font-mono font-bold text-[#757373]",
            sizeClasses[size]
          )}
        >
          :
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "font-mono font-bold tabular-nums text-[#1C1C1C] dark:text-white",
              sizeClasses[size]
            )}
          >
            {minutes.toString().padStart(2, "0")}
          </div>
          <span
            className={cn(
              "text-[#757373] uppercase font-medium",
              labelSizeClasses[size]
            )}
          >
            Minutes
          </span>
        </div>

        {/* Separator */}
        <div
          className={cn(
            "font-mono font-bold text-[#757373]",
            sizeClasses[size]
          )}
        >
          :
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "font-mono font-bold tabular-nums text-[#1C1C1C] dark:text-white",
              sizeClasses[size]
            )}
          >
            {seconds.toString().padStart(2, "0")}
          </div>
          <span
            className={cn(
              "text-[#757373] uppercase font-medium",
              labelSizeClasses[size]
            )}
          >
            Seconds
          </span>
        </div>
      </div>

      {/* Additional Info */}
      {currentTimer && (
        <div className="text-center">
          {currentTimer.description && (
            <p className="text-sm text-[#757373]">{currentTimer.description}</p>
          )}
          {currentTimer.startTime && (
            <p className="text-xs text-[#757373] mt-1">
              Started at{" "}
              {new Date(currentTimer.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
