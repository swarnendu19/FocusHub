/**
 * Checkbox Component
 *
 * Checkbox component built with Radix UI.
 */

"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded border-2 border-[#1C1C1C] dark:border-white ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#1C1C1C] data-[state=checked]:text-white dark:ring-offset-[#1C1C1C] dark:focus-visible:ring-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-[#1C1C1C]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
