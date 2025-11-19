/**
 * Health Check Page
 *
 * System health status and diagnostics.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Check | FocusHub",
  description: "System health status",
};

export default function HealthCheckPage() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
        System Health Check
      </h1>
      <div className="space-y-2">
        <p className="text-green-600 dark:text-green-400">
          ✓ Next.js Application: Running
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Health check component to be migrated from Vite app
        </p>
      </div>
    </div>
  );
}
