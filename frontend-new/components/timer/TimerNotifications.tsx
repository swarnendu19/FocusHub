/**
 * TimerNotifications Component
 *
 * Manages browser notifications for timer events.
 * Sends notifications when timer starts, stops, reaches milestones, etc.
 */

"use client";

import * as React from "react";
import { useTimer } from "@/hooks";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDuration } from "@/utils/format";

interface TimerNotificationsProps {
  /**
   * Enable notifications for timer start
   */
  notifyOnStart?: boolean;
  /**
   * Enable notifications for timer stop
   */
  notifyOnStop?: boolean;
  /**
   * Enable notifications for timer pause
   */
  notifyOnPause?: boolean;
  /**
   * Enable notifications for milestone achievements (every N minutes)
   */
  notifyOnMilestone?: boolean;
  /**
   * Milestone interval in minutes
   */
  milestoneInterval?: number;
}

/**
 * TimerNotifications component
 * Automatically sends browser notifications for timer events
 * This is a "headless" component - it doesn't render any UI
 */
export function TimerNotifications({
  notifyOnStart = true,
  notifyOnStop = true,
  notifyOnPause = false,
  notifyOnMilestone = true,
  milestoneInterval = 30,
}: TimerNotificationsProps) {
  const {
    timerState,
    currentTimer,
    elapsedTime,
  } = useTimer();

  const {
    showTimerNotification,
    requestPermission,
    isGranted,
    isSupported,
  } = useNotifications();

  const prevTimerState = React.useRef(timerState);
  const lastMilestoneSeconds = React.useRef(0);

  /**
   * Request notification permission on mount
   */
  React.useEffect(() => {
    if (isSupported && !isGranted) {
      requestPermission();
    }
  }, [isSupported, isGranted, requestPermission]);

  /**
   * Handle timer state changes
   */
  React.useEffect(() => {
    if (!isGranted) return;

    const prevState = prevTimerState.current;
    const currentState = timerState;

    // Timer started
    if (prevState === "idle" && currentState === "running" && notifyOnStart) {
      const title = "Timer Started";
      const body = currentTimer?.description
        ? `Working on: ${currentTimer.description}`
        : "Time tracking started";

      showTimerNotification(title, body);
    }

    // Timer stopped
    if (prevState !== "idle" && currentState === "idle" && notifyOnStop) {
      const duration = formatDuration(elapsedTime);
      const title = "Timer Stopped";
      const body = `Session completed: ${duration}`;

      showTimerNotification(title, body);
    }

    // Timer paused
    if (prevState === "running" && currentState === "paused" && notifyOnPause) {
      const duration = formatDuration(elapsedTime);
      const title = "Timer Paused";
      const body = `Current session: ${duration}`;

      showTimerNotification(title, body);
    }

    prevTimerState.current = currentState;
  }, [
    timerState,
    currentTimer,
    elapsedTime,
    isGranted,
    notifyOnStart,
    notifyOnStop,
    notifyOnPause,
    showTimerNotification,
  ]);

  /**
   * Handle milestone notifications
   */
  React.useEffect(() => {
    if (!isGranted || !notifyOnMilestone || timerState !== "running") {
      return;
    }

    const milestoneSeconds = milestoneInterval * 60;
    const currentMilestone = Math.floor(elapsedTime / milestoneSeconds);
    const lastMilestone = Math.floor(lastMilestoneSeconds.current / milestoneSeconds);

    // Check if we've reached a new milestone
    if (currentMilestone > lastMilestone && currentMilestone > 0) {
      const minutes = currentMilestone * milestoneInterval;
      const title = "Milestone Reached!";
      const body = `You've been working for ${minutes} minutes. Great job!`;

      showTimerNotification(title, body);
    }

    lastMilestoneSeconds.current = elapsedTime;
  }, [
    elapsedTime,
    timerState,
    isGranted,
    notifyOnMilestone,
    milestoneInterval,
    showTimerNotification,
  ]);

  /**
   * Reset milestone tracker when timer stops
   */
  React.useEffect(() => {
    if (timerState === "idle") {
      lastMilestoneSeconds.current = 0;
    }
  }, [timerState]);

  // This is a headless component - no UI
  return null;
}

/**
 * TimerNotificationsSettings Component
 * UI for managing timer notification preferences
 */
interface TimerNotificationsSettingsProps {
  className?: string;
  onSettingsChange?: (settings: {
    notifyOnStart: boolean;
    notifyOnStop: boolean;
    notifyOnPause: boolean;
    notifyOnMilestone: boolean;
    milestoneInterval: number;
  }) => void;
}

export function TimerNotificationsSettings({
  className,
  onSettingsChange,
}: TimerNotificationsSettingsProps) {
  const { requestPermission, isGranted, isDenied, isSupported } = useNotifications();

  const [settings, setSettings] = React.useState({
    notifyOnStart: true,
    notifyOnStop: true,
    notifyOnPause: false,
    notifyOnMilestone: true,
    milestoneInterval: 30,
  });

  const handleSettingChange = (key: string, value: boolean | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  if (!isSupported) {
    return (
      <div className={className}>
        <p className="text-sm text-[#757373]">
          Notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-[#1C1C1C] dark:text-white mb-2">
            Timer Notifications
          </h3>
          <p className="text-xs text-[#757373] mb-4">
            Get notified about your timer progress and milestones
          </p>
        </div>

        {/* Permission Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#1C1C1C]">
          <span className="text-sm text-[#1C1C1C] dark:text-white">
            Notification Permission
          </span>
          {isGranted ? (
            <span className="text-xs text-green-600 font-medium">Granted</span>
          ) : isDenied ? (
            <span className="text-xs text-red-600 font-medium">Denied</span>
          ) : (
            <button
              onClick={requestPermission}
              className="text-xs font-medium text-[#1C1C1C] dark:text-white underline"
            >
              Request
            </button>
          )}
        </div>

        {/* Settings - only show if permission granted */}
        {isGranted && (
          <>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#1C1C1C] dark:text-white">
                Notify on timer start
              </label>
              <input
                type="checkbox"
                checked={settings.notifyOnStart}
                onChange={(e) => handleSettingChange("notifyOnStart", e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-[#1C1C1C] dark:text-white">
                Notify on timer stop
              </label>
              <input
                type="checkbox"
                checked={settings.notifyOnStop}
                onChange={(e) => handleSettingChange("notifyOnStop", e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-[#1C1C1C] dark:text-white">
                Notify on timer pause
              </label>
              <input
                type="checkbox"
                checked={settings.notifyOnPause}
                onChange={(e) => handleSettingChange("notifyOnPause", e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-[#1C1C1C] dark:text-white">
                Notify on milestones
              </label>
              <input
                type="checkbox"
                checked={settings.notifyOnMilestone}
                onChange={(e) => handleSettingChange("notifyOnMilestone", e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            {settings.notifyOnMilestone && (
              <div className="flex items-center justify-between pl-4">
                <label className="text-sm text-[#757373]">
                  Milestone interval (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  step="5"
                  value={settings.milestoneInterval}
                  onChange={(e) =>
                    handleSettingChange("milestoneInterval", parseInt(e.target.value))
                  }
                  className="w-16 px-2 py-1 text-sm border-2 border-[#757373]/40 rounded"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
