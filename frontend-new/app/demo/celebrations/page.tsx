/**
 * Celebrations Demo Page
 *
 * Public demo route for showcasing celebration animations.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Celebrations Demo | FocusHub",
  description: "Explore celebration animations and effects",
};

export default function CelebrationsDemoPage() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        Celebrations Demo
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Celebrations demo - Component to be migrated from Vite app
      </p>
    </div>
  );
}
