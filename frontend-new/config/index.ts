/**
 * Configuration Entry Point
 *
 * Centralized configuration management for the FocusHub application.
 * This module exports all configuration, environment variables, and constants.
 *
 * Usage:
 * ```typescript
 * import { clientEnv, APP_NAME, TIMER } from '@/config';
 * ```
 */

// Import environment functions for internal use
import {
  validateEnv as envValidate,
  isDevelopment as envIsDevelopment,
  isProduction as envIsProduction,
} from "./env";

// Environment variables
export {
  clientEnv,
  serverEnv,
  validateEnv,
  isDevelopment,
  isProduction,
  isTest,
  getEnv,
  getServerEnv,
  type ClientEnv,
  type ServerEnv,
} from "./env";

// Application constants
export {
  // Application metadata
  APP_NAME,
  APP_DESCRIPTION,
  APP_VERSION,
  // Colors and styling
  COLORS,
  BREAKPOINTS,
  CHART_COLORS,
  // Timer configuration
  TIMER,
  // Gamification
  GAMIFICATION,
  ACHIEVEMENT_CATEGORIES,
  SKILL_CATEGORIES,
  // Project and task management
  PROJECT_STATUS,
  TASK_PRIORITY,
  // Time and date
  TIME_FORMATS,
  DATE_RANGES,
  // Storage
  STORAGE_KEYS,
  // API
  API_ENDPOINTS,
  // UI and UX
  ANIMATION_DURATION,
  NOTIFICATION_TYPES,
  // Pagination
  PAGINATION,
  // File uploads
  UPLOAD_LIMITS,
  // Validation
  VALIDATION,
  SESSION_TIMEOUT,
  RATE_LIMITS,
  // Features
  FEATURES,
  // Social
  SOCIAL_LINKS,
  // PWA
  PWA_CONFIG,
  // Type exports
  type Color,
  type Breakpoint,
  type AchievementCategory,
  type SkillCategory,
  type ProjectStatus,
  type TaskPriority,
  type NotificationType,
  type DateRange,
} from "./constants";

/**
 * Application configuration object
 * Combines environment variables and constants for easy access
 */
export const config = {
  app: {
    name: "FocusHub",
    version: "0.1.0",
    description: "A gamified time tracking application with XP systems, achievements, and skill trees",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),
  },
  auth: {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    aiFeatures: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === "true",
    collaboration: process.env.NEXT_PUBLIC_ENABLE_COLLABORATION === "true",
    integrations: process.env.NEXT_PUBLIC_ENABLE_INTEGRATIONS === "true",
  },
  performance: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true",
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  },
  development: {
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === "true",
    mockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "false",
  },
  pwa: {
    enabled: process.env.NEXT_PUBLIC_PWA_ENABLED === "true",
    cacheDuration: parseInt(process.env.NEXT_PUBLIC_PWA_CACHE_DURATION || "86400000", 10),
  },
  analytics: {
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || "",
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || "",
  },
  errorTracking: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === "true",
    endpoint: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT || "",
  },
} as const;

/**
 * Utility function to get API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = config.api.baseUrl;
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
}

/**
 * Utility function to replace URL parameters
 * Example: replaceUrlParams('/projects/:id', { id: '123' }) => '/projects/123'
 */
export function replaceUrlParams(url: string, params: Record<string, string | number>): string {
  let result = url;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
}

/**
 * Utility function to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature];
}

/**
 * Type guard for environment
 */
export function isServerSide(): boolean {
  return typeof window === "undefined";
}

export function isClientSide(): boolean {
  return typeof window !== "undefined";
}

/**
 * Configuration validation helper
 * Call this at the app initialization to ensure all required config is present
 */
export function initializeConfig(): void {
  try {
    envValidate();

    if (envIsDevelopment) {
      console.log("✅ FocusHub Configuration initialized");
      console.log("📦 Environment:", process.env.NODE_ENV);
      console.log("🔗 API Base URL:", config.api.baseUrl);
      console.log("🚀 Features enabled:", Object.entries(config.features).filter(([, v]) => v).map(([k]) => k));
    }
  } catch (error) {
    console.error("❌ Configuration validation failed:", error);
    if (envIsProduction) {
      throw error;
    }
  }
}

// Default export
export default config;
