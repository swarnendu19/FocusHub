/**
 * Input Component
 *
 * Text input component with support for different states and icons.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Icon to show before input
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to show after input
   */
  rightIcon?: React.ReactNode;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message
   */
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      error,
      errorMessage,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#757373]">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg border-2 bg-white dark:bg-[#1C1C1C] px-3 py-2 text-base text-[#1C1C1C] dark:text-white",
              "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-[#757373]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:ring-offset-[#1C1C1C] dark:focus-visible:ring-white",
              error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#757373]/40",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-[#757373]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
