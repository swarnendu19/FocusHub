/**
 * Gamification Types
 *
 * Type definitions for XP, achievements, skill trees, and leaderboards.
 */

/**
 * Achievement category enumeration
 */
export enum AchievementCategory {
  TIME_TRACKING = "time-tracking",
  PRODUCTIVITY = "productivity",
  CONSISTENCY = "consistency",
  MILESTONES = "milestones",
  SOCIAL = "social",
  SPECIAL = "special",
}

/**
 * Achievement rarity
 */
export enum AchievementRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  xpReward: number;
  requirement: {
    type: string;
    value: number;
    unit?: string;
  };
  isSecret: boolean;
  order: number;
}

/**
 * User achievement progress
 */
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  progress: number; // 0-100
  isUnlocked: boolean;
  unlockedAt?: Date;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Skill category enumeration
 */
export enum SkillCategory {
  FOCUS = "focus",
  EFFICIENCY = "efficiency",
  ENDURANCE = "endurance",
  COLLABORATION = "collaboration",
  MASTERY = "mastery",
}

/**
 * Skill node in skill tree
 */
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  level: number;
  maxLevel: number;
  icon: string;
  xpCost: number;
  prerequisites: string[]; // skill node IDs
  effects: Array<{
    type: string;
    value: number;
    description: string;
  }>;
  position: {
    x: number;
    y: number;
  };
}

/**
 * User skill progress
 */
export interface UserSkill {
  id: string;
  userId: string;
  skillNodeId: string;
  skillNode: SkillNode;
  currentLevel: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  lastUpgradedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * XP transaction record
 */
export interface XPTransaction {
  id: string;
  userId: string;
  amount: number; // positive or negative
  source: string; // e.g., "session_completed", "achievement_unlocked"
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Level progression data
 */
export interface LevelProgression {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  progressPercentage: number; // 0-100
  totalXP: number;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  score: number; // could be XP, time tracked, etc.
  level: number;
  change: number; // position change from previous period
  isCurrentUser: boolean;
}

/**
 * Leaderboard time period
 */
export enum LeaderboardPeriod {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ALL_TIME = "all-time",
}

/**
 * Leaderboard type
 */
export enum LeaderboardType {
  XP = "xp",
  TIME_TRACKED = "time-tracked",
  SESSIONS_COMPLETED = "sessions-completed",
  ACHIEVEMENTS = "achievements",
  STREAK = "streak",
}

/**
 * Leaderboard data
 */
export interface Leaderboard {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  totalEntries: number;
  currentUserRank?: number;
  lastUpdated: Date;
}

/**
 * Daily challenge
 */
export interface DailyChallenge {
  id: string;
  date: Date;
  name: string;
  description: string;
  goal: {
    type: string;
    value: number;
    unit: string;
  };
  xpReward: number;
  completed: boolean;
  progress: number; // 0-100
  expiresAt: Date;
}

/**
 * Streak data
 */
export interface Streak {
  userId: string;
  currentStreak: number; // days
  longestStreak: number; // days
  lastActivityDate: Date;
  streakActive: boolean;
  freezesAvailable: number; // days user can miss without losing streak
  totalDaysActive: number;
}

/**
 * Badge (special achievements)
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  earnedBy: number; // number of users who earned it
  earnedDate?: Date;
}

/**
 * Type guard for unlocked achievement
 */
export function isAchievementUnlocked(achievement: UserAchievement): boolean {
  return achievement.isUnlocked && !!achievement.unlockedAt;
}

/**
 * Type guard for completed achievement
 */
export function isAchievementCompleted(achievement: UserAchievement): boolean {
  return achievement.progress >= 100;
}

/**
 * Type guard for unlocked skill
 */
export function isSkillUnlocked(skill: UserSkill): boolean {
  return skill.isUnlocked;
}

/**
 * Type guard for maxed skill
 */
export function isSkillMaxed(skill: UserSkill): boolean {
  return skill.currentLevel >= skill.skillNode.maxLevel;
}

/**
 * Type guard for active streak
 */
export function isStreakActive(streak: Streak): boolean {
  return streak.streakActive && streak.currentStreak > 0;
}

/**
 * Type aliases for hooks compatibility
 */
export type XPGain = XPTransaction;
export type Skill = SkillNode;

/**
 * Skill unlock payload for API requests
 */
export interface SkillUnlockPayload {
  skillNodeId: string;
  currentLevel?: number;
}
