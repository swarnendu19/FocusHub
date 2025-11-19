/**
 * Projects Page
 *
 * Project management and task tracking.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | FocusHub",
  description: "Manage your projects and tasks",
};

export default function ProjectsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        Projects
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Projects page - Component to be migrated from Vite app
      </p>
    </div>
  );
}
