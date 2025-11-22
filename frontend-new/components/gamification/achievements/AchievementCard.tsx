/**
 * AchievementCard Component
 *
 * Individual achievement card showing icon, name, description, and progress.
 * Can be locked (not unlocked) or unlocked with completion details.
 */

"use client";

import { cn } from "@/utils";
import { formatDate } from "@/utils/format";
import { Badge, Progress } from "@/components/ui";
import type { UserAchievement } from "@/types";

interface AchievementCardProps {
  /**
   * Achievement data
   */
  achievement: UserAchievement;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
}

export function AchievementCard({
  achievement,
  onClick,
  className,
  size = "md",
}: AchievementCardProps) {
  const isUnlocked = achievement.unlockedAt !== null;
  const progress = achievement.progress || 0;
  const target = achievement.achievement.requirement.value || 100;
  const progressPercentage = (progress / target) * 100;

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const iconSizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg border-2 transition-all",
        isUnlocked
          ? "border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] hover:shadow-lg"
          : "border-[#757373]/40 bg-[#FAFAFA] dark:bg-[#1C1C1C]/30 opacity-60",
        onClick && "cursor-pointer",
        sizeClasses[size],
        className
      )}
    >
      {/* Unlock Animation Glow (for unlocked achievements) */}
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative space-y-3">
        {/* Header: Icon + Rarity */}
        <div className="flex items-start justify-between">
          {/* Achievement Icon */}
          <div
            className={cn(
              "flex items-center justify-center rounded-full text-4xl transition-transform group-hover:scale-110",
              isUnlocked
                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md"
                : "bg-[#757373]/20",
              iconSizeClasses[size]
            )}
          >
            {isUnlocked ? (
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
                className="h-8 w-8 text-white"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            ) : (
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
                className="h-8 w-8 text-[#757373]"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
          </div>

          {/* Rarity Badge */}
          {achievement.achievement.rarity && (
            <Badge
              variant={isUnlocked ? "default" : "outline"}
              className={cn(
                "text-xs",
                getRarityColor(achievement.achievement.rarity)
              )}
            >
              {achievement.achievement.rarity}
            </Badge>
          )}
        </div>

        {/* Achievement Info */}
        <div className="space-y-1">
          <h3
            className={cn(
              "font-semibold leading-tight",
              isUnlocked
                ? "text-[#1C1C1C] dark:text-white"
                : "text-[#757373]",
              textSizeClasses[size]
            )}
          >
            {achievement.achievement.name}
          </h3>
          <p
            className={cn(
              "text-[#757373] leading-snug",
              size === "sm" ? "text-xs" : "text-sm"
            )}
          >
            {achievement.achievement.description}
          </p>
        </div>

        {/* Progress or Unlock Date */}
        {isUnlocked ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#757373]">
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
                className="h-3 w-3"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>
                Unlocked on {formatDate(achievement.unlockedAt!, "MMM DD, YYYY")}
              </span>
            </div>

            {achievement.achievement.xpReward && (
              <Badge variant="outline" className="text-xs">
                +{achievement.achievement.xpReward} XP
              </Badge>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Progress Bar */}
            <Progress value={progressPercentage} className="h-2" />

            {/* Progress Text */}
            <div className="flex items-center justify-between text-xs text-[#757373]">
              <span>
                {progress} / {target}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-[#FAFAFA]/80 dark:bg-[#1C1C1C]/80 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-medium text-[#757373]">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
      )}
    </div>
  );
}

function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case "common":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
    case "uncommon":
      return "bg-green-500/20 text-green-700 dark:text-green-300";
    case "rare":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
    case "epic":
      return "bg-purple-500/20 text-purple-700 dark:text-purple-300";
    case "legendary":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
    default:
      return "";
  }
}
