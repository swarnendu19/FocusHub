/**
 * TimerControls Component
 *
 * Control buttons for starting, stopping, pausing, and resuming the timer.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useTimer } from "@/hooks";
import { Button } from "@/components/ui";

interface TimerControlsProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Project ID for new timer
   */
  projectId?: string;
  /**
   * Task ID for new timer
   */
  taskId?: string;
  /**
   * Description for new timer
   */
  description?: string;
  /**
   * Callback when timer starts
   */
  onStart?: () => void;
  /**
   * Callback when timer stops
   */
  onStop?: () => void;
  /**
   * Callback when timer pauses
   */
  onPause?: () => void;
  /**
   * Callback when timer resumes
   */
  onResume?: () => void;
}

export function TimerControls({
  className,
  size = "md",
  projectId,
  taskId,
  description,
  onStart,
  onStop,
  onPause,
  onResume,
}: TimerControlsProps) {
  const {
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    timerState,
    isLoading,
  } = useTimer();

  const handleStart = async () => {
    try {
      await startTimer(projectId, taskId, description);
      onStart?.();
    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  };

  const handleStop = async () => {
    try {
      await stopTimer();
      onStop?.();
    } catch (error) {
      console.error("Failed to stop timer:", error);
    }
  };

  const handlePause = async () => {
    try {
      await pauseTimer();
      onPause?.();
    } catch (error) {
      console.error("Failed to pause timer:", error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeTimer();
      onResume?.();
    } catch (error) {
      console.error("Failed to resume timer:", error);
    }
  };

  // Render different controls based on timer state
  if (timerState === "idle") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          onClick={handleStart}
          disabled={isLoading}
          isLoading={isLoading}
          size={size}
          className="flex-1"
        >
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
            className="mr-2 h-5 w-5"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start Timer
        </Button>
      </div>
    );
  }

  if (timerState === "running") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          onClick={handlePause}
          disabled={isLoading}
          variant="outline"
          size={size}
          className="flex-1"
        >
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
            className="mr-2 h-5 w-5"
          >
            <rect width="4" height="16" x="6" y="4" />
            <rect width="4" height="16" x="14" y="4" />
          </svg>
          Pause
        </Button>

        <Button
          onClick={handleStop}
          disabled={isLoading}
          variant="destructive"
          size={size}
          className="flex-1"
        >
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
            className="mr-2 h-5 w-5"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          </svg>
          Stop
        </Button>
      </div>
    );
  }

  if (timerState === "paused") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          onClick={handleResume}
          disabled={isLoading}
          size={size}
          className="flex-1"
        >
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
            className="mr-2 h-5 w-5"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Resume
        </Button>

        <Button
          onClick={handleStop}
          disabled={isLoading}
          variant="destructive"
          size={size}
          className="flex-1"
        >
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
            className="mr-2 h-5 w-5"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          </svg>
          Stop
        </Button>
      </div>
    );
  }

  return null;
}
