/**
 * AchievementModal Component
 *
 * Detailed modal view for a single achievement.
 * Shows full description, requirements, rewards, and unlock history.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { formatDate } from "@/utils/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Progress,
  Badge,
  Button,
} from "@/components/ui";
import type { UserAchievement } from "@/types";

interface AchievementModalProps {
  /**
   * Achievement to display
   */
  achievement: UserAchievement | null;
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback when modal should close
   */
  onClose: () => void;
  /**
   * Additional className
   */
  className?: string;
}

export function AchievementModal({
  achievement,
  open,
  onClose,
  className,
}: AchievementModalProps) {
  if (!achievement) return null;

  const isUnlocked = achievement.unlockedAt !== null;
  const progress = achievement.progress || 0;
  const target = achievement.target || 100;
  const progressPercentage = (progress / target) * 100;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={cn("max-w-2xl", className)}>
        {/* Header */}
        <DialogHeader className="space-y-4">
          {/* Achievement Icon */}
          <div className="flex justify-center">
            <div
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full transition-transform",
                isUnlocked
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg"
                  : "bg-[#757373]/20"
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
                  className="h-12 w-12 text-white"
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
                  className="h-12 w-12 text-[#757373]"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <DialogTitle className="text-2xl">{achievement.name}</DialogTitle>
              {achievement.rarity && (
                <Badge
                  variant={isUnlocked ? "default" : "outline"}
                  className={getRarityColor(achievement.rarity)}
                >
                  {achievement.rarity}
                </Badge>
              )}
            </div>

            <DialogDescription className="text-base">
              {achievement.description}
            </DialogDescription>
          </div>

          {/* Status Badge */}
          {isUnlocked ? (
            <div className="flex justify-center">
              <Badge variant="default" className="gap-2">
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Unlocked
              </Badge>
            </div>
          ) : (
            <div className="flex justify-center">
              <Badge variant="outline" className="gap-2">
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
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Locked
              </Badge>
            </div>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 py-4">
          {/* Progress Section (for locked achievements) */}
          {!isUnlocked && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[#1C1C1C] dark:text-white">
                  Progress
                </span>
                <span className="text-[#757373]">
                  {progress} / {target}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-center text-sm text-[#757373]">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          )}

          {/* Unlock Date (for unlocked achievements) */}
          {isUnlocked && achievement.unlockedAt && (
            <div className="rounded-lg border-2 border-[#757373]/40 bg-[#FAFAFA] dark:bg-[#1C1C1C]/50 p-4 text-center">
              <p className="text-sm text-[#757373]">Unlocked on</p>
              <p className="text-lg font-semibold text-[#1C1C1C] dark:text-white">
                {formatDate(achievement.unlockedAt, "MMMM DD, YYYY")}
              </p>
            </div>
          )}

          {/* Requirements Section */}
          {achievement.requirements && achievement.requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
                Requirements
              </h3>
              <ul className="space-y-2">
                {achievement.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[#757373]"
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
                      className={cn(
                        "h-4 w-4 flex-shrink-0 mt-0.5",
                        isUnlocked ? "text-green-600" : "text-[#757373]"
                      )}
                    >
                      {isUnlocked ? (
                        <>
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </>
                      ) : (
                        <circle cx="12" cy="12" r="10" />
                      )}
                    </svg>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewards Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
              Rewards
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievement.xpReward && (
                <div className="rounded-lg border-2 border-[#757373]/40 p-3 text-center">
                  <p className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                    +{achievement.xpReward}
                  </p>
                  <p className="text-xs text-[#757373]">XP</p>
                </div>
              )}

              {achievement.skillPoints && (
                <div className="rounded-lg border-2 border-[#757373]/40 p-3 text-center">
                  <p className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                    +{achievement.skillPoints}
                  </p>
                  <p className="text-xs text-[#757373]">Skill Points</p>
                </div>
              )}
            </div>
          </div>

          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {achievement.category && (
              <Badge variant="outline" className="capitalize">
                {achievement.category}
              </Badge>
            )}
            {achievement.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 border-t-2 border-[#757373]/40 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!isUnlocked && (
            <Button disabled>
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
                className="mr-2 h-4 w-4"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {Math.round(progressPercentage)}% to Unlock
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
