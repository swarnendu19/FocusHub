"use client";

/**
 * Dashboard Error Component
 *
 * Error boundary for dashboard pages.
 */

import { useEffect } from "react";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
          Dashboard Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error.message || "Failed to load dashboard"}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
