/**
 * Leaderboard Page
 *
 * Competitive rankings and user comparisons.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | FocusHub",
  description: "View competitive rankings and compare progress",
};

export default function LeaderboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        Leaderboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Leaderboard page - Component to be migrated from Vite app
      </p>
    </div>
  );
}
