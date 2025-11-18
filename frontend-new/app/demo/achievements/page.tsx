/**
 * Achievements Demo Page
 *
 * Public demo route for showcasing achievement system.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements Demo | FocusHub",
  description: "Explore the achievement system",
};

export default function AchievementsDemoPage() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        Achievements Demo
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Achievements demo - Component to be migrated from Vite app
      </p>
    </div>
  );
}
