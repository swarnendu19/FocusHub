/**
 * Application Constants
 *
 * Centralized location for all application-wide constants.
 * These values are not environment-specific and are safe to commit.
 */

/**
 * Application metadata
 */
export const APP_NAME = "FocusHub";
export const APP_DESCRIPTION = "A gamified time tracking application with XP systems, achievements, and skill trees";
export const APP_VERSION = "0.1.0";

/**
 * Color palette (matches Tailwind theme)
 */
export const COLORS = {
  dark: "#1C1C1C",
  gray: "#757373",
  white: "#FFFFFF",
  light: "#FAFAFA",
} as const;

/**
 * Breakpoints (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Timer configuration
 */
export const TIMER = {
  DEFAULT_WORK_DURATION: 25 * 60, // 25 minutes in seconds
  DEFAULT_SHORT_BREAK: 5 * 60, // 5 minutes
  DEFAULT_LONG_BREAK: 15 * 60, // 15 minutes
  POMODORO_CYCLES_FOR_LONG_BREAK: 4,
  MIN_DURATION: 60, // 1 minute
  MAX_DURATION: 180 * 60, // 3 hours
  TICK_INTERVAL: 1000, // 1 second in milliseconds
} as const;

/**
 * XP and Gamification settings
 */
export const GAMIFICATION = {
  XP_PER_MINUTE: 10,
  XP_PER_COMPLETED_SESSION: 50,
  XP_PER_ACHIEVEMENT: 100,
  DAILY_STREAK_BONUS: 25,
  LEVEL_UP_BASE_XP: 1000,
  LEVEL_UP_MULTIPLIER: 1.5,
  MAX_LEVEL: 100,
} as const;

/**
 * Achievement categories
 */
export const ACHIEVEMENT_CATEGORIES = {
  TIME_TRACKING: "time-tracking",
  PRODUCTIVITY: "productivity",
  CONSISTENCY: "consistency",
  MILESTONES: "milestones",
  SOCIAL: "social",
  SPECIAL: "special",
} as const;

/**
 * Skill tree categories
 */
export const SKILL_CATEGORIES = {
  FOCUS: "focus",
  EFFICIENCY: "efficiency",
  ENDURANCE: "endurance",
  COLLABORATION: "collaboration",
  MASTERY: "mastery",
} as const;

/**
 * Project status options
 */
export const PROJECT_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

/**
 * Task priority levels
 */
export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

/**
 * Time format options
 */
export const TIME_FORMATS = {
  SHORT: "HH:mm",
  LONG: "HH:mm:ss",
  FULL: "MMM DD, YYYY HH:mm:ss",
  DATE_ONLY: "MMM DD, YYYY",
} as const;

/**
 * Chart colors for analytics
 */
export const CHART_COLORS = {
  primary: "#1C1C1C",
  secondary: "#757373",
  accent: "#FAFAFA",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "focushub_auth_token",
  REFRESH_TOKEN: "focushub_refresh_token",
  USER_PREFERENCES: "focushub_user_preferences",
  TIMER_STATE: "focushub_timer_state",
  THEME: "focushub_theme",
  ONBOARDING_COMPLETE: "focushub_onboarding_complete",
} as const;

/**
 * API endpoints (relative paths)
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    GOOGLE_AUTH: "/auth/google",
  },
  USER: {
    PROFILE: "/user/profile",
    PREFERENCES: "/user/preferences",
    STATS: "/user/stats",
    ACHIEVEMENTS: "/user/achievements",
  },
  TIMER: {
    START: "/timer/start",
    STOP: "/timer/stop",
    PAUSE: "/timer/pause",
    RESUME: "/timer/resume",
    HISTORY: "/timer/history",
  },
  PROJECTS: {
    LIST: "/projects",
    CREATE: "/projects",
    UPDATE: "/projects/:id",
    DELETE: "/projects/:id",
    STATS: "/projects/:id/stats",
  },
  LEADERBOARD: {
    GLOBAL: "/leaderboard/global",
    FRIENDS: "/leaderboard/friends",
    WEEKLY: "/leaderboard/weekly",
  },
  ANALYTICS: {
    SUMMARY: "/analytics/summary",
    DETAILED: "/analytics/detailed",
    EXPORT: "/analytics/export",
  },
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

/**
 * Date range presets for analytics
 */
export const DATE_RANGES = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  THIS_WEEK: "this_week",
  LAST_WEEK: "last_week",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  THIS_YEAR: "this_year",
  CUSTOM: "custom",
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

/**
 * File upload limits
 */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_FILE_TYPES: ["application/pdf", "text/plain", "text/csv"],
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PROJECT_NAME_MAX_LENGTH: 100,
  TASK_NAME_MAX_LENGTH: 200,
  BIO_MAX_LENGTH: 500,
} as const;

/**
 * Session timeout (in milliseconds)
 */
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Rate limiting
 */
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 60,
  LOGIN_ATTEMPTS_PER_HOUR: 5,
} as const;

/**
 * Feature flags (hardcoded, different from env feature flags)
 */
export const FEATURES = {
  BETA_FEATURES: false,
  EXPERIMENTAL_UI: false,
  MAINTENANCE_MODE: false,
} as const;

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
  GITHUB: "https://github.com/focushub",
  TWITTER: "https://twitter.com/focushub",
  DISCORD: "https://discord.gg/focushub",
  SUPPORT_EMAIL: "support@focushub.app",
} as const;

/**
 * PWA configuration
 */
export const PWA_CONFIG = {
  CACHE_VERSION: "v1",
  CACHE_NAMES: {
    STATIC: "focushub-static-v1",
    DYNAMIC: "focushub-dynamic-v1",
    IMAGES: "focushub-images-v1",
  },
  OFFLINE_ROUTE: "/offline",
} as const;

// Type exports for better TypeScript experience
export type Color = keyof typeof COLORS;
export type Breakpoint = keyof typeof BREAKPOINTS;
export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[keyof typeof ACHIEVEMENT_CATEGORIES];
export type SkillCategory = (typeof SKILL_CATEGORIES)[keyof typeof SKILL_CATEGORIES];
export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];
export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
export type DateRange = (typeof DATE_RANGES)[keyof typeof DATE_RANGES];
