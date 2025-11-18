/**
 * useNotifications Hook
 *
 * Custom hook for managing browser notifications.
 * Handles permission requests, notification display, and PWA notification support.
 */

"use client";

import { useState, useCallback, useEffect } from "react";

export type NotificationPermission = "default" | "granted" | "denied";

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  data?: unknown;
}

export function useNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  /**
   * Check if notifications are supported
   */
  useEffect(() => {
    setIsSupported("Notification" in window);

    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      throw new Error("Notifications are not supported in this browser");
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error("Failed to request notification permission:", err);
      throw err;
    }
  }, [isSupported]);

  /**
   * Show a notification
   */
  const showNotification = useCallback(
    async (options: NotificationOptions) => {
      if (!isSupported) {
        console.warn("Notifications are not supported");
        return null;
      }

      // Request permission if not granted
      if (permission === "default") {
        await requestPermission();
      }

      if (permission === "denied") {
        console.warn("Notification permission denied");
        return null;
      }

      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || "/icon-192.png",
          badge: options.badge || "/icon-192.png",
          tag: options.tag,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
          data: options.data,
        });

        return notification;
      } catch (err) {
        console.error("Failed to show notification:", err);
        return null;
      }
    },
    [isSupported, permission, requestPermission]
  );

  /**
   * Show a timer notification (common use case)
   */
  const showTimerNotification = useCallback(
    (title: string, body: string) => {
      return showNotification({
        title,
        body,
        icon: "/icon-192.png",
        tag: "timer",
        requireInteraction: true,
      });
    },
    [showNotification]
  );

  /**
   * Show an achievement notification
   */
  const showAchievementNotification = useCallback(
    (title: string, body: string) => {
      return showNotification({
        title,
        body,
        icon: "/icon-192.png",
        tag: "achievement",
        requireInteraction: false,
      });
    },
    [showNotification]
  );

  return {
    // State
    permission,
    isSupported,
    isGranted: permission === "granted",
    isDenied: permission === "denied",

    // Actions
    requestPermission,
    showNotification,
    showTimerNotification,
    showAchievementNotification,
  };
}
