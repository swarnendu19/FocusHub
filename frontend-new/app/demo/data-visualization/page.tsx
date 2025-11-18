/**
 * Data Visualization Demo Page
 *
 * Public demo route for showcasing charts and analytics.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Visualization Demo | FocusHub",
  description: "Explore data visualization and analytics",
};

export default function DataVisualizationDemoPage() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        Data Visualization Demo
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Data visualization demo - Component to be migrated from Vite app
      </p>
    </div>
  );
}
