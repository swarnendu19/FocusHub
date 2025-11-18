/**
 * XP Page
 *
 * Experience points tracking and level progression.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XP | FocusHub",
  description: "Track your experience points and level progression",
};

export default function XPPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        XP Tracker
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        XP page - Component to be migrated from Vite app
      </p>
    </div>
  );
}
