/**
 * Achievement Store
 *
 * Zustand store for managing gamification data (achievements, XP, skills, leaderboard).
 */

import { create } from "zustand";
import type {
  UserAchievement,
  UserSkill,
  LevelProgression,
  LeaderboardEntry,
  DailyChallenge,
  Streak,
} from "@/types";

interface AchievementStore {
  // State
  achievements: UserAchievement[];
  skills: UserSkill[];
  levelProgression: LevelProgression | null;
  leaderboard: LeaderboardEntry[];
  dailyChallenges: DailyChallenge[];
  streak: Streak | null;
  isLoading: boolean;
  error: string | null;

  // Achievement actions
  setAchievements: (achievements: UserAchievement[]) => void;
  updateAchievement: (id: string, updates: Partial<UserAchievement>) => void;
  unlockAchievement: (id: string) => void;
  claimAchievement: (id: string) => void;

  // Skill actions
  setSkills: (skills: UserSkill[]) => void;
  unlockSkill: (id: string) => void;
  upgradeSkill: (id: string) => void;

  // Level/XP actions
  setLevelProgression: (progression: LevelProgression) => void;
  addXP: (amount: number) => void;
  levelUp: () => void;

  // Leaderboard actions
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  updateLeaderboardEntry: (userId: string, updates: Partial<LeaderboardEntry>) => void;

  // Daily challenge actions
  setDailyChallenges: (challenges: DailyChallenge[]) => void;
  updateChallengeProgress: (id: string, progress: number) => void;
  completeChallenge: (id: string) => void;

  // Streak actions
  setStreak: (streak: Streak) => void;
  incrementStreak: () => void;
  breakStreak: () => void;
  useStreakFreeze: () => void;

  // Utility actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Computed
  getUnlockedAchievements: () => UserAchievement[];
  getLockedAchievements: () => UserAchievement[];
  getAchievementProgress: () => number;
  getUnlockedSkills: () => UserSkill[];
  getTotalXP: () => number;
  getCurrentLevel: () => number;
  getActiveChallenges: () => DailyChallenge[];
  getCompletedChallenges: () => DailyChallenge[];
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  // Initial state
  achievements: [],
  skills: [],
  levelProgression: null,
  leaderboard: [],
  dailyChallenges: [],
  streak: null,
  isLoading: false,
  error: null,

  // Achievement actions
  setAchievements: (achievements) => set({ achievements }),

  updateAchievement: (id, updates) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      ),
    })),

  unlockAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === id
          ? { ...a, isUnlocked: true, unlockedAt: new Date(), progress: 100 }
          : a
      ),
    })),

  claimAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === id ? { ...a, claimedAt: new Date() } : a
      ),
    })),

  // Skill actions
  setSkills: (skills) => set({ skills }),

  unlockSkill: (id) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s.id === id
          ? { ...s, isUnlocked: true, unlockedAt: new Date(), currentLevel: 1 }
          : s
      ),
    })),

  upgradeSkill: (id) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s.id === id && s.currentLevel < s.skillNode.maxLevel
          ? {
              ...s,
              currentLevel: s.currentLevel + 1,
              lastUpgradedAt: new Date(),
            }
          : s
      ),
    })),

  // Level/XP actions
  setLevelProgression: (progression) => set({ levelProgression: progression }),

  addXP: (amount) => {
    const current = get().levelProgression;
    if (!current) return;

    const newXP = current.currentXP + amount;
    const newTotalXP = current.totalXP + amount;

    // Check if leveled up
    if (newXP >= current.xpForNextLevel) {
      get().levelUp();
    } else {
      set({
        levelProgression: {
          ...current,
          currentXP: newXP,
          totalXP: newTotalXP,
          xpToNextLevel: current.xpForNextLevel - newXP,
          progressPercentage: (newXP / current.xpForNextLevel) * 100,
        },
      });
    }
  },

  levelUp: () => {
    const current = get().levelProgression;
    if (!current) return;

    const newLevel = current.currentLevel + 1;
    const xpForNewLevel = Math.floor(current.xpForNextLevel * 1.5); // 50% increase
    const overflow = current.currentXP - current.xpForNextLevel;

    set({
      levelProgression: {
        currentLevel: newLevel,
        currentXP: Math.max(0, overflow),
        xpForCurrentLevel: current.xpForNextLevel,
        xpForNextLevel: xpForNewLevel,
        xpToNextLevel: xpForNewLevel - Math.max(0, overflow),
        progressPercentage: Math.max(0, overflow) / xpForNewLevel * 100,
        totalXP: current.totalXP,
      },
    });
  },

  // Leaderboard actions
  setLeaderboard: (entries) => set({ leaderboard: entries }),

  updateLeaderboardEntry: (userId, updates) =>
    set((state) => ({
      leaderboard: state.leaderboard.map((e) =>
        e.userId === userId ? { ...e, ...updates } : e
      ),
    })),

  // Daily challenge actions
  setDailyChallenges: (challenges) => set({ dailyChallenges: challenges }),

  updateChallengeProgress: (id, progress) =>
    set((state) => ({
      dailyChallenges: state.dailyChallenges.map((c) =>
        c.id === id ? { ...c, progress: Math.min(100, progress) } : c
      ),
    })),

  completeChallenge: (id) =>
    set((state) => ({
      dailyChallenges: state.dailyChallenges.map((c) =>
        c.id === id ? { ...c, completed: true, progress: 100 } : c
      ),
    })),

  // Streak actions
  setStreak: (streak) => set({ streak }),

  incrementStreak: () => {
    const current = get().streak;
    if (!current) return;

    const newCurrent = current.currentStreak + 1;
    set({
      streak: {
        ...current,
        currentStreak: newCurrent,
        longestStreak: Math.max(newCurrent, current.longestStreak),
        lastActivityDate: new Date(),
        streakActive: true,
        totalDaysActive: current.totalDaysActive + 1,
      },
    });
  },

  breakStreak: () => {
    const current = get().streak;
    if (!current) return;

    set({
      streak: {
        ...current,
        currentStreak: 0,
        streakActive: false,
      },
    });
  },

  useStreakFreeze: () => {
    const current = get().streak;
    if (!current || current.freezesAvailable <= 0) return;

    set({
      streak: {
        ...current,
        freezesAvailable: current.freezesAvailable - 1,
      },
    });
  },

  // Utility actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),

  // Computed getters
  getUnlockedAchievements: () =>
    get().achievements.filter((a) => a.isUnlocked),

  getLockedAchievements: () =>
    get().achievements.filter((a) => !a.isUnlocked),

  getAchievementProgress: () => {
    const achievements = get().achievements;
    if (achievements.length === 0) return 0;

    const unlocked = achievements.filter((a) => a.isUnlocked).length;
    return (unlocked / achievements.length) * 100;
  },

  getUnlockedSkills: () =>
    get().skills.filter((s) => s.isUnlocked),

  getTotalXP: () => get().levelProgression?.totalXP || 0,

  getCurrentLevel: () => get().levelProgression?.currentLevel || 1,

  getActiveChallenges: () =>
    get().dailyChallenges.filter((c) => !c.completed && new Date(c.expiresAt) > new Date()),

  getCompletedChallenges: () =>
    get().dailyChallenges.filter((c) => c.completed),
}));

// Selectors for optimal re-renders
export const selectAchievements = (state: AchievementStore) => state.achievements;
export const selectUnlockedAchievements = (state: AchievementStore) => state.getUnlockedAchievements();
export const selectSkills = (state: AchievementStore) => state.skills;
export const selectLevelProgression = (state: AchievementStore) => state.levelProgression;
export const selectLeaderboard = (state: AchievementStore) => state.leaderboard;
export const selectDailyChallenges = (state: AchievementStore) => state.dailyChallenges;
export const selectStreak = (state: AchievementStore) => state.streak;
export const selectIsLoading = (state: AchievementStore) => state.isLoading;
