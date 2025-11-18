/**
 * Label Component
 *
 * Form label component for accessibility.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Required field indicator
   */
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-[#1C1C1C] dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };
