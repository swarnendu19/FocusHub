/**
 * Dashboard Layout
 *
 * Protected layout with navigation and sidebar for authenticated routes.
 * Includes:
 * - Header/Navigation bar
 * - Sidebar with menu items
 * - Main content area
 */

import type { ReactNode } from "react";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/layout/DashboardLayout";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}
