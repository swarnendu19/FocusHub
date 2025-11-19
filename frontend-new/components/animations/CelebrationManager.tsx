/**
 * CelebrationManager Component
 *
 * Orchestrates various celebration effects for achievements, level ups, and milestones.
 * Manages confetti, sound effects, and other celebratory animations.
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";
import { ConfettiSystem } from "./ConfettiSystem";
import { useNotifications } from "@/hooks";

export type CelebrationType =
  | "achievement_unlock"
  | "level_up"
  | "streak_milestone"
  | "xp_gain"
  | "task_complete";

interface CelebrationEvent {
  id: string;
  type: CelebrationType;
  title: string;
  message?: string;
  icon?: React.ReactNode;
  timestamp: number;
}

interface CelebrationManagerProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Enable sound effects (requires audio implementation)
   */
  enableSound?: boolean;
  /**
   * Enable confetti
   */
  enableConfetti?: boolean;
  /**
   * Enable floating notifications
   */
  enableNotifications?: boolean;
}

// Global celebration queue
let celebrationQueue: CelebrationEvent[] = [];
let listeners: Set<() => void> = new Set();

// Global API to trigger celebrations
export const triggerCelebration = (
  type: CelebrationType,
  title: string,
  message?: string,
  icon?: React.ReactNode
) => {
  const event: CelebrationEvent = {
    id: `${Date.now()}-${Math.random()}`,
    type,
    title,
    message,
    icon,
    timestamp: Date.now(),
  };

  celebrationQueue.push(event);
  listeners.forEach((listener) => listener());
};

export function CelebrationManager({
  className,
  enableSound = true,
  enableConfetti = true,
  enableNotifications = true,
}: CelebrationManagerProps) {
  const [activeEvents, setActiveEvents] = React.useState<CelebrationEvent[]>([]);
  const [confettiActive, setConfettiActive] = React.useState(false);
  const { notify } = useNotifications();

  // Subscribe to celebration events
  React.useEffect(() => {
    const checkQueue = () => {
      if (celebrationQueue.length > 0) {
        const events = [...celebrationQueue];
        celebrationQueue = [];
        setActiveEvents((prev) => [...prev, ...events]);

        // Process events
        events.forEach((event) => {
          // Show confetti for major celebrations
          if (
            enableConfetti &&
            (event.type === "achievement_unlock" || event.type === "level_up")
          ) {
            setConfettiActive(true);
            setTimeout(() => setConfettiActive(false), 3000);
          }

          // Show notification
          if (enableNotifications) {
            notify({
              title: event.title,
              message: event.message || "",
              type: "success",
              duration: 5000,
            });
          }

          // Play sound (placeholder - requires audio implementation)
          if (enableSound) {
            playSound(event.type);
          }

          // Auto-remove event after duration
          setTimeout(() => {
            setActiveEvents((prev) =>
              prev.filter((e) => e.id !== event.id)
            );
          }, 5000);
        });
      }
    };

    listeners.add(checkQueue);
    return () => {
      listeners.delete(checkQueue);
    };
  }, [enableConfetti, enableNotifications, enableSound, notify]);

  return (
    <>
      {/* Confetti System */}
      {enableConfetti && <ConfettiSystem active={confettiActive} />}

      {/* Floating Celebration Messages */}
      {enableNotifications && (
        <div
          className={cn(
            "pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-2",
            className
          )}
        >
          <AnimatePresence>
            {activeEvents.map((event) => (
              <CelebrationCard key={event.id} event={event} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

interface CelebrationCardProps {
  event: CelebrationEvent;
}

function CelebrationCard({ event }: CelebrationCardProps) {
  const getIcon = () => {
    if (event.icon) return event.icon;

    switch (event.type) {
      case "achievement_unlock":
        return (
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
            className="h-6 w-6"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        );

      case "level_up":
        return (
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
            className="h-6 w-6"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          </svg>
        );

      case "streak_milestone":
        return (
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
            className="h-6 w-6"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        );

      default:
        return (
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
            className="h-6 w-6"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="pointer-events-auto max-w-sm rounded-lg border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-white">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-[#1C1C1C] dark:text-white">
            {event.title}
          </h4>
          {event.message && (
            <p className="text-sm text-[#757373]">{event.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Placeholder sound function (requires audio implementation)
function playSound(type: CelebrationType) {
  // TODO: Implement sound effects
  // This would typically use the Web Audio API or an audio library
  console.log(`Playing sound for: ${type}`);
}
