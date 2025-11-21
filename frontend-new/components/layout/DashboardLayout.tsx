/**
 * DashboardLayout Component
 *
 * Main layout wrapper for the authenticated dashboard pages.
 * Includes sidebar, header, and content area.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  /**
   * Children elements (page content)
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA] dark:bg-[#1C1C1C]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-[#1C1C1C]/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
            <Sidebar
              collapsed={false}
              onCollapsedChange={() => setMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto bg-[#FAFAFA] dark:bg-[#1C1C1C]",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
