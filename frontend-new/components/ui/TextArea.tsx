/**
 * TextArea Component
 *
 * Multi-line text input component for long-form content.
 * Supports autosizing, character limits, and validation states.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Character limit
   */
  maxLength?: number;
  /**
   * Show character count
   */
  showCount?: boolean;
  /**
   * Auto-resize height based on content
   */
  autoResize?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      error,
      maxLength,
      showCount = false,
      autoResize = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const [characterCount, setCharacterCount] = React.useState(
      props.value?.toString().length || props.defaultValue?.toString().length || 0
    );
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharacterCount(e.target.value.length);

      // Auto-resize logic
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }

      onChange?.(e);
    };

    React.useEffect(() => {
      // Initialize auto-resize on mount
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [autoResize]);

    return (
      <div className="relative w-full">
        <textarea
          ref={(el) => {
            textareaRef.current = el;
            if (typeof ref === "function") {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          }}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border-2 bg-white dark:bg-[#1C1C1C] px-3 py-2 text-base text-[#1C1C1C] dark:text-white ring-offset-white placeholder:text-[#757373] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-[#1C1C1C] resize-none",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[#757373]/40 focus-visible:ring-[#1C1C1C] dark:focus-visible:ring-white",
            autoResize && "overflow-hidden",
            className
          )}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {showCount && maxLength && (
          <div
            className={cn(
              "absolute bottom-2 right-2 text-xs",
              characterCount > maxLength * 0.9
                ? "text-red-600"
                : "text-[#757373]"
            )}
          >
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
