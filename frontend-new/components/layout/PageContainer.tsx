/**
 * PageContainer Component
 *
 * Container component for page content with consistent padding and max-width.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";

interface PageContainerProps {
  /**
   * Children elements
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Remove default padding
   */
  noPadding?: boolean;
  /**
   * Full width (no max-width constraint)
   */
  fullWidth?: boolean;
}

export function PageContainer({
  children,
  className,
  noPadding = false,
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        !fullWidth && "container mx-auto",
        !noPadding && "px-4 py-6 lg:px-6 lg:py-8",
        className
      )}
    >
      {children}
    </div>
  );
}
