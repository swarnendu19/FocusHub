/**
 * useTimer Hook
 *
 * Custom hook for managing timer state and operations.
 * Provides timer controls, elapsed time tracking, and integration with backend API.
 */

"use client";

import { useEffect, useCallback, useRef } from "react";
import { useTimerStore } from "@/stores";
import { timerService } from "@/services";
import type { TimerSession, TimerState } from "@/types";
import { TIMER } from "@/config";

export function useTimer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get state from timer store
  const currentTimer = useTimerStore((state) => state.currentTimer);
  const timerState = useTimerStore((state) => state.timerState);
  const elapsedTime = useTimerStore((state) => state.elapsedTime);
  const sessionHistory = useTimerStore((state) => state.sessionHistory);
  const isLoading = useTimerStore((state) => state.isLoading);
  const error = useTimerStore((state) => state.error);

  // Get actions from timer store
  const setCurrentTimer = useTimerStore((state) => state.setCurrentTimer);
  const setTimerState = useTimerStore((state) => state.setTimerState);
  const setElapsedTime = useTimerStore((state) => state.setElapsedTime);
  const incrementElapsedTime = useTimerStore(
    (state) => state.incrementElapsedTime
  );
  const addToHistory = useTimerStore((state) => state.addToHistory);
  const setLoading = useTimerStore((state) => state.setLoading);
  const setError = useTimerStore((state) => state.setError);
  const clearTimer = useTimerStore((state) => state.clearTimer);

  /**
   * Start a new timer
   */
  const startTimer = useCallback(
    async (projectId?: string, taskId?: string, description?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await timerService.startTimer({
          projectId,
          taskId,
          description,
        });

        setCurrentTimer(response);
        setTimerState("running");
        setElapsedTime(0);

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start timer";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setCurrentTimer, setTimerState, setElapsedTime, setLoading, setError]
  );

  /**
   * Stop the current timer
   */
  const stopTimer = useCallback(async () => {
    if (!currentTimer) {
      throw new Error("No active timer to stop");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await timerService.stopTimer(currentTimer.id);

      // Add to history
      addToHistory(response);

      // Clear current timer
      clearTimer();

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stop timer";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTimer, addToHistory, clearTimer, setLoading, setError]);

  /**
   * Pause the current timer
   */
  const pauseTimer = useCallback(async () => {
    if (!currentTimer) {
      throw new Error("No active timer to pause");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await timerService.pauseTimer(currentTimer.id);

      setCurrentTimer(response);
      setTimerState("paused");

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to pause timer";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTimer, setCurrentTimer, setTimerState, setLoading, setError]);

  /**
   * Resume a paused timer
   */
  const resumeTimer = useCallback(async () => {
    if (!currentTimer) {
      throw new Error("No timer to resume");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await timerService.resumeTimer(currentTimer.id);

      setCurrentTimer(response);
      setTimerState("running");

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resume timer";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTimer, setCurrentTimer, setTimerState, setLoading, setError]);

  /**
   * Fetch timer history
   */
  const fetchHistory = useCallback(
    async (filters?: {
      startDate?: Date;
      endDate?: Date;
      projectId?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const history = await timerService.getHistory(filters);

        // Update store with history
        useTimerStore.setState({ sessionHistory: history });

        return history;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch history";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Fetch timer statistics
   */
  const fetchStatistics = useCallback(
    async (period: "day" | "week" | "month" | "year" = "week") => {
      try {
        setLoading(true);
        setError(null);

        const stats = await timerService.getStatistics(period);

        return stats;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch statistics";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Get active timer from server (for recovery)
   */
  const recoverActiveTimer = useCallback(async () => {
    try {
      const activeTimer = await timerService.getActiveTimer();

      if (activeTimer) {
        setCurrentTimer(activeTimer);
        setTimerState(activeTimer.status === "paused" ? "paused" : "running");

        // Calculate elapsed time based on start time
        const startTime = new Date(activeTimer.startTime).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
      }

      return activeTimer;
    } catch (err) {
      console.error("Failed to recover active timer:", err);
      return null;
    }
  }, [setCurrentTimer, setTimerState, setElapsedTime]);

  /**
   * Local timer increment (runs every second when timer is active)
   */
  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        incrementElapsedTime();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState, incrementElapsedTime]);

  /**
   * Recover active timer on mount
   */
  useEffect(() => {
    recoverActiveTimer();
  }, [recoverActiveTimer]);

  /**
   * Auto-save timer state periodically (every 30 seconds)
   */
  useEffect(() => {
    if (timerState === "running" && currentTimer) {
      const autoSaveInterval = setInterval(
        async () => {
          try {
            // Update timer on server with current elapsed time
            await timerService.updateTimer(currentTimer.id, {
              elapsedSeconds: elapsedTime,
            });
          } catch (err) {
            console.error("Auto-save failed:", err);
          }
        },
        TIMER.AUTO_SAVE_INTERVAL || 30000
      );

      return () => clearInterval(autoSaveInterval);
    }
  }, [timerState, currentTimer, elapsedTime]);

  /**
   * Computed values
   */
  const isRunning = timerState === "running";
  const isPaused = timerState === "paused";
  const isIdle = timerState === "idle";
  const hasActiveTimer = currentTimer !== null;

  // Format elapsed time
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return {
    // State
    currentTimer,
    timerState,
    elapsedTime,
    sessionHistory,
    isLoading,
    error,

    // Computed
    isRunning,
    isPaused,
    isIdle,
    hasActiveTimer,
    formattedTime,
    hours,
    minutes,
    seconds,

    // Actions
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    fetchHistory,
    fetchStatistics,
    recoverActiveTimer,
  };
}
