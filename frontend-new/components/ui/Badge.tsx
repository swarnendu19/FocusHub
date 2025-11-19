/**
 * Badge Component
 *
 * Badge/tag component for status indicators and labels.
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C1C1C] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#1C1C1C] text-white dark:bg-white dark:text-[#1C1C1C]",
        secondary:
          "bg-[#FAFAFA] text-[#1C1C1C] border border-[#757373]/40 dark:bg-[#1C1C1C] dark:text-white dark:border-white/40",
        outline:
          "border-2 border-[#1C1C1C] text-[#1C1C1C] dark:border-white dark:text-white",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        error:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Icon to show before text
   */
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
