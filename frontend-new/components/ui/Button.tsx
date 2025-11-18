/**
 * Button Component
 *
 * Versatile button component with multiple variants and sizes.
 * Supports icons, loading states, and full accessibility.
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#1C1C1C] text-white hover:bg-[#1C1C1C]/90 focus-visible:ring-[#1C1C1C] dark:bg-white dark:text-[#1C1C1C] dark:hover:bg-white/90 dark:focus-visible:ring-white",
        secondary:
          "bg-[#FAFAFA] text-[#1C1C1C] border-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white focus-visible:ring-[#1C1C1C] dark:bg-[#1C1C1C] dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#1C1C1C]",
        ghost:
          "hover:bg-[#FAFAFA] text-[#1C1C1C] focus-visible:ring-[#757373] dark:hover:bg-[#1C1C1C]/20 dark:text-white",
        outline:
          "border-2 border-[#757373] bg-transparent text-[#1C1C1C] hover:bg-[#FAFAFA] focus-visible:ring-[#757373] dark:text-white dark:hover:bg-[#1C1C1C]/20",
        link: "text-[#1C1C1C] underline-offset-4 hover:underline focus-visible:ring-[#1C1C1C] dark:text-white",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-13 px-7 text-lg",
        icon: "h-11 w-11",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Shows loading spinner and disables button
   */
  isLoading?: boolean;
  /**
   * Icon to show before children
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to show after children
   */
  rightIcon?: React.ReactNode;
  /**
   * Renders as a child component (for use with Next.js Link, etc.)
   */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
