/**
 * DatePicker Component
 *
 * Date picker component with calendar interface.
 * Built with Radix UI Popover for accessibility.
 */

"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/utils";
import { Button } from "./Button";
import { Input } from "./Input";

export interface DatePickerProps {
  /**
   * Selected date value
   */
  value?: Date;
  /**
   * Callback when date changes
   */
  onChange?: (date: Date | undefined) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Custom className
   */
  className?: string;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select a date",
      disabled = false,
      minDate,
      maxDate,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
      value
    );
    const [currentMonth, setCurrentMonth] = React.useState(
      value || new Date()
    );

    // Format date for display
    const formatDate = (date: Date | undefined): string => {
      if (!date) return "";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // Get days in month
    const getDaysInMonth = (date: Date): number => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday)
    const getFirstDayOfMonth = (date: Date): number => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Generate calendar days
    const generateCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentMonth);
      const firstDay = getFirstDayOfMonth(currentMonth);
      const days: (number | null)[] = [];

      // Add empty cells for days before month starts
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      // Add days of month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    };

    // Handle date selection
    const handleDateSelect = (day: number) => {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      // Check if date is within bounds
      if (minDate && newDate < minDate) return;
      if (maxDate && newDate > maxDate) return;

      setSelectedDate(newDate);
      onChange?.(newDate);
      setIsOpen(false);
    };

    // Navigate months
    const previousMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    };

    const nextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    };

    // Check if day is selected
    const isDaySelected = (day: number): boolean => {
      if (!selectedDate) return false;
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()
      );
    };

    // Check if day is disabled
    const isDayDisabled = (day: number): boolean => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const days = generateCalendarDays();
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <div ref={ref} className={cn("relative", className)}>
            <Input
              value={formatDate(selectedDate)}
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              className="cursor-pointer"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757373]"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className={cn(
              "z-50 w-auto rounded-lg border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}
          >
            <div className="space-y-4">
              {/* Month navigation */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={previousMonth}
                  className="h-8 w-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>

                <div className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>

              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="flex h-8 w-8 items-center justify-center text-xs font-medium text-[#757373]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="h-8 w-8" />;
                  }

                  const isSelected = isDaySelected(day);
                  const isDisabled = isDayDisabled(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      disabled={isDisabled}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] dark:focus-visible:ring-white",
                        isSelected &&
                          "bg-[#1C1C1C] dark:bg-white text-white dark:text-[#1C1C1C] hover:bg-[#1C1C1C]/90 dark:hover:bg-white/90",
                        isDisabled &&
                          "cursor-not-allowed opacity-50 hover:bg-transparent",
                        !isSelected &&
                          !isDisabled &&
                          "text-[#1C1C1C] dark:text-white"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Today button */}
              <div className="flex justify-end pt-2 border-t border-[#757373]/40">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    setCurrentMonth(today);
                    setSelectedDate(today);
                    onChange?.(today);
                    setIsOpen(false);
                  }}
                >
                  Today
                </Button>
              </div>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
