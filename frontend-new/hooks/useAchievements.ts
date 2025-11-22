/**
 * useAchievements Hook
 *
 * Custom hook for managing gamification features including:
 * - Achievements and badges
 * - XP and leveling system
 * - Skill trees and progression
 * - Leaderboards and rankings
 * - Streaks and challenges
 */

"use client";

import { useCallback, useEffect } from "react";
import { useAchievementStore } from "@/stores";
import type {
  Achievement,
  UserAchievement,
  XPTransaction,
  SkillNode,
  UserSkill,
  LeaderboardEntry,
  AchievementCategory,
  AchievementRarity,
  SkillCategory,
} from "@/types";

export function useAchievements() {
  // Get state from achievement store
  const achievements = useAchievementStore((state) => state.achievements);
  const xpHistory = useAchievementStore((state) => state.xpHistory);
  const skills = useAchievementStore((state) => state.skills);
  const leaderboard = useAchievementStore((state) => state.leaderboard);
  const currentStreak = useAchievementStore((state) => state.currentStreak);
  const longestStreak = useAchievementStore((state) => state.longestStreak);
  const isLoading = useAchievementStore((state) => state.isLoading);
  const error = useAchievementStore((state) => state.error);

  // Get actions from achievement store
  const setAchievements = useAchievementStore(
    (state) => state.setAchievements
  );
  const unlockAchievement = useAchievementStore(
    (state) => state.unlockAchievement
  );
  const addXPGain = useAchievementStore((state) => state.addXPGain);
  const setSkills = useAchievementStore((state) => state.setSkills);
  const unlockSkill = useAchievementStore((state) => state.unlockSkill);
  const setLeaderboard = useAchievementStore((state) => state.setLeaderboard);
  const updateStreak = useAchievementStore((state) => state.updateStreak);
  const setLoading = useAchievementStore((state) => state.setLoading);
  const setError = useAchievementStore((state) => state.setError);

  /**
   * Fetch all achievements
   */
  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const achievementList = await achievementService.getAchievements();
      // setAchievements(achievementList);

      // Mock data for now
      const mockAchievements: Achievement[] = [
        {
          id: "1",
          title: "First Timer",
          description: "Start your first timer session",
          category: "timer",
          difficulty: "easy",
          xpReward: 10,
          unlocked: false,
          progress: 0,
          maxProgress: 1,
          icon: "timer",
          unlockedAt: null,
        },
        {
          id: "2",
          title: "Consistency Master",
          description: "Track time for 7 consecutive days",
          category: "streak",
          difficulty: "medium",
          xpReward: 50,
          unlocked: false,
          progress: 0,
          maxProgress: 7,
          icon: "flame",
          unlockedAt: null,
        },
      ];

      setAchievements(mockAchievements);

      return mockAchievements;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch achievements";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAchievements, setLoading, setError]);

  /**
   * Fetch XP history
   */
  const fetchXPHistory = useCallback(
    async (filters?: { startDate?: Date; endDate?: Date }) => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual API call
        // const history = await achievementService.getXPHistory(filters);
        // Store will automatically update via setter

        // Mock data for now
        const mockHistory: XPGain[] = [];

        useAchievementStore.setState({ xpHistory: mockHistory });

        return mockHistory;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch XP history";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Add XP for an action
   */
  const gainXP = useCallback(
    (amount: number, reason: string, source: string) => {
      const xpGain: XPGain = {
        id: Date.now().toString(),
        amount,
        reason,
        source,
        timestamp: new Date(),
      };

      addXPGain(xpGain);

      // TODO: Sync with backend
      // await achievementService.addXP(xpGain);

      return xpGain;
    },
    [addXPGain]
  );

  /**
   * Check and unlock achievements based on progress
   */
  const checkAchievements = useCallback(
    async (action: string, metadata?: Record<string, unknown>) => {
      try {
        // TODO: Call backend to check and unlock achievements
        // const unlockedAchievements = await achievementService.checkAchievements(action, metadata);

        // For now, just check locally
        const unlockedAchievements: Achievement[] = [];

        // Update store with unlocked achievements
        unlockedAchievements.forEach((achievement) => {
          unlockAchievement(achievement.id, new Date());
          gainXP(achievement.xpReward, `Unlocked: ${achievement.title}`, "achievement");
        });

        return unlockedAchievements;
      } catch (err) {
        console.error("Failed to check achievements:", err);
        return [];
      }
    },
    [unlockAchievement, gainXP]
  );

  /**
   * Fetch skill tree
   */
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const skillList = await achievementService.getSkills();
      // setSkills(skillList);

      // Mock data for now
      const mockSkills: Skill[] = [
        {
          id: "1",
          name: "Time Management",
          description: "Improve your time tracking efficiency",
          category: "productivity",
          level: 0,
          maxLevel: 5,
          unlocked: true,
          xpRequired: 100,
          currentXP: 0,
          icon: "clock",
          prerequisites: [],
        },
        {
          id: "2",
          name: "Focus Master",
          description: "Enhance your concentration abilities",
          category: "focus",
          level: 0,
          maxLevel: 5,
          unlocked: false,
          xpRequired: 150,
          currentXP: 0,
          icon: "target",
          prerequisites: ["1"],
        },
      ];

      setSkills(mockSkills);

      return mockSkills;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch skills";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setSkills, setLoading, setError]);

  /**
   * Unlock or level up a skill
   */
  const levelUpSkill = useCallback(
    async (skillId: string) => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Call backend API
        // const updatedSkill = await achievementService.unlockSkill(skillId);

        // Update store
        unlockSkill(skillId);

        // Mock: Gain XP for unlocking skill
        gainXP(20, "Leveled up skill", "skill");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to unlock skill";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [unlockSkill, gainXP, setLoading, setError]
  );

  /**
   * Fetch leaderboard
   */
  const fetchLeaderboard = useCallback(
    async (period: "day" | "week" | "month" | "all" = "week", limit = 50) => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual API call
        // const leaderboardData = await achievementService.getLeaderboard(period, limit);
        // setLeaderboard(leaderboardData);

        // Mock data for now
        const mockLeaderboard: LeaderboardEntry[] = [];

        setLeaderboard(mockLeaderboard);

        return mockLeaderboard;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch leaderboard";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLeaderboard, setLoading, setError]
  );

  /**
   * Update current streak
   */
  const updateCurrentStreak = useCallback(
    (days: number) => {
      updateStreak(days, longestStreak);

      // Check for streak achievements
      checkAchievements("streak_updated", { days });
    },
    [updateStreak, longestStreak, checkAchievements]
  );

  /**
   * Get unlocked achievements
   */
  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter((a) => a.isUnlocked);
  }, [achievements]);

  /**
   * Get locked achievements
   */
  const getLockedAchievements = useCallback(() => {
    return achievements.filter((a) => !a.isUnlocked);
  }, [achievements]);

  /**
   * Get achievements by category
   */
  const getAchievementsByCategory = useCallback(
    (category: string) => {
      return achievements.filter((a) => a.achievement.category === category);
    },
    [achievements]
  );

  /**
   * Get level progression data
   */
  const levelProgression = useAchievementStore((state) => state.levelProgression);

  /**
   * Get total XP
   */
  const getTotalXP = useCallback(() => {
    return levelProgression?.totalXP || 0;
  }, [levelProgression]);

  /**
   * Get current level
   */
  const getCurrentLevel = useCallback(() => {
    return levelProgression?.currentLevel || 1;
  }, [levelProgression]);

  /**
   * Get XP to next level
   */
  const getXPToNextLevel = useCallback(() => {
    return levelProgression?.xpToNextLevel || 0;
  }, [levelProgression]);

  /**
   * Get XP for current level (base XP needed to reach current level)
   */
  const getXPForCurrentLevel = useCallback(() => {
    return levelProgression?.xpForCurrentLevel || 0;
  }, [levelProgression]);

  /**
   * Get current XP within level
   */
  const getCurrentXP = useCallback(() => {
    return levelProgression?.currentXP || 0;
  }, [levelProgression]);

  /**
   * Get progress percentage to next level
   */
  const getProgressPercentage = useCallback(() => {
    return levelProgression?.progressPercentage || 0;
  }, [levelProgression]);

  /**
   * Auto-fetch data on mount
   */
  useEffect(() => {
    if (achievements.length === 0) {
      fetchAchievements();
    }
    if (skills.length === 0) {
      fetchSkills();
    }
  }, [fetchAchievements, fetchSkills, achievements.length, skills.length]);

  return {
    // State
    achievements,
    xpHistory,
    skills,
    leaderboard,
    currentStreak,
    longestStreak,
    isLoading,
    error,
    levelProgression,

    // Achievement actions
    fetchAchievements,
    checkAchievements,
    getUnlockedAchievements,
    getLockedAchievements,
    getAchievementsByCategory,

    // XP actions and getters
    fetchXPHistory,
    gainXP,
    getTotalXP,
    getCurrentLevel,
    getXPToNextLevel,
    getXPForCurrentLevel,
    getCurrentXP,
    getProgressPercentage,

    // Computed XP values (for convenience)
    totalXP: getTotalXP(),
    currentLevel: getCurrentLevel(),
    currentXP: getCurrentXP(),
    xpToNextLevel: getXPToNextLevel(),
    xpForCurrentLevel: getXPForCurrentLevel(),
    progressPercentage: getProgressPercentage(),

    // Skill actions
    fetchSkills,
    levelUpSkill,

    // Leaderboard actions
    fetchLeaderboard,

    // Streak actions
    updateCurrentStreak,
  };
}
