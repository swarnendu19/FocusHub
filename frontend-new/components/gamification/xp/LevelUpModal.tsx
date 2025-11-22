/**
 * LevelUpModal Component
 *
 * Celebration modal displayed when user levels up.
 * Shows new level, rewards, and unlocked features.
 */

"use client";

import { cn } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/components/ui";

interface LevelUpModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback when modal should close
   */
  onClose: () => void;
  /**
   * New level reached
   */
  newLevel: number;
  /**
   * Rewards unlocked at this level
   */
  rewards?: string[];
  /**
   * Additional className
   */
  className?: string;
}

export function LevelUpModal({
  open,
  onClose,
  newLevel,
  rewards = [],
  className,
}: LevelUpModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={cn("max-w-md", className)}>
        {/* Celebration Animation Container */}
        <div className="relative">
          {/* Animated Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-[#1C1C1C] to-[#757373] blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative space-y-6 py-6">
            <DialogHeader className="space-y-4 text-center">
              {/* Level Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1C1C1C] to-[#757373] dark:from-white dark:to-[#FAFAFA] text-4xl font-bold text-white dark:text-[#1C1C1C] shadow-lg">
                    {newLevel}
                  </div>
                  {/* Sparkle effect */}
                  <div className="absolute -right-2 -top-2 animate-bounce">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-8 w-8 text-yellow-500"
                    >
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <DialogTitle className="text-3xl font-bold">
                  Level Up!
                </DialogTitle>
                <DialogDescription className="text-lg">
                  You've reached Level {newLevel}
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Rewards Section */}
            {rewards.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-center text-sm font-semibold text-[#1C1C1C] dark:text-white">
                  Unlocked Rewards
                </h3>
                <div className="space-y-2">
                  {rewards.map((reward, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg border-2 border-[#757373]/40 bg-[#FAFAFA] dark:bg-[#1C1C1C]/50 p-3"
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
                        className="h-5 w-5 flex-shrink-0 text-green-600"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span className="text-sm text-[#1C1C1C] dark:text-white">
                        {reward}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-[#757373]/40 p-3">
                <span className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                  +5
                </span>
                <span className="text-xs text-[#757373]">Skill Points</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-[#757373]/40 p-3">
                <span className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                  +1
                </span>
                <span className="text-xs text-[#757373]">Badge</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-[#757373]/40 p-3">
                <span className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                  +10%
                </span>
                <span className="text-xs text-[#757373]">XP Boost</span>
              </div>
            </div>

            <DialogFooter className="sm:justify-center">
              <Button onClick={onClose} size="lg" className="w-full sm:w-auto">
                Continue
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
