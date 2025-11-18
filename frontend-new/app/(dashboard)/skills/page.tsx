/**
 * Skills Page
 *
 * Skill tree progression and unlocks.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | FocusHub",
  description: "Explore and upgrade your skill tree",
};

export default function SkillsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        Skills
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Skills page - Component to be migrated from Vite app
      </p>
    </div>
  );
}
