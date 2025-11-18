/**
 * Dashboard Layout
 *
 * Protected layout with navigation and sidebar for authenticated routes.
 * Will include:
 * - Header/Navigation bar
 * - Sidebar with menu items
 * - Main content area
 * - Footer
 */

import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* TODO: Add Navigation/Header component */}
      <div className="flex">
        {/* TODO: Add Sidebar component */}
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sidebar navigation to be added
            </p>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
