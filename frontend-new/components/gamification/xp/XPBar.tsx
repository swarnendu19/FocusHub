/**
 * XPBar Component
 *
 * Animated progress bar showing current XP and progress to next level.
 */

"use client";

import { cn } from "@/utils";
import { useAchievements } from "@/hooks";
import { Progress } from "@/components/ui";

interface XPBarProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Show level labels
   */
  showLabels?: boolean;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Show XP numbers
   */
  showNumbers?: boolean;
}

export function XPBar({
  className,
  showLabels = true,
  size = "md",
  showNumbers = true,
}: XPBarProps) {
  const { currentXP, currentLevel, xpToNextLevel, xpForCurrentLevel } =
    useAchievements();

  // Calculate progress percentage
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForLevel = xpToNextLevel - xpForCurrentLevel;
  const progressPercentage = (xpInCurrentLevel / xpNeededForLevel) * 100;

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Level & XP Info */}
      {showLabels && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-semibold text-[#1C1C1C] dark:text-white",
                textSizeClasses[size]
              )}
            >
              Level {currentLevel}
            </span>
            {showNumbers && (
              <span className={cn("text-[#757373]", textSizeClasses[size])}>
                {xpInCurrentLevel.toLocaleString()} /{" "}
                {xpNeededForLevel.toLocaleString()} XP
              </span>
            )}
          </div>
          <span className={cn("text-[#757373]", textSizeClasses[size])}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <Progress
        value={progressPercentage}
        className={cn(sizeClasses[size])}
        indicatorClassName="bg-gradient-to-r from-[#1C1C1C] to-[#757373] dark:from-white dark:to-[#FAFAFA] transition-all duration-500"
      />

      {/* Next Level Preview */}
      {showLabels && (
        <div className="flex items-center justify-end">
          <span className={cn("text-[#757373]", textSizeClasses[size])}>
            {(xpToNextLevel - currentXP).toLocaleString()} XP to Level{" "}
            {currentLevel + 1}
          </span>
        </div>
      )}
    </div>
  );
}
