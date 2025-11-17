/**
 * Environment Variable Validation and Type-Safe Access
 *
 * This module provides type-safe access to environment variables with validation.
 * All environment variables are validated at build time and runtime.
 */

/**
 * Client-side environment variables (NEXT_PUBLIC_* prefix)
 * These are available in both server and client components
 */
export const clientEnv = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),

  // Authentication
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",

  // Feature Flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    aiFeatures: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === "true",
    collaboration: process.env.NEXT_PUBLIC_ENABLE_COLLABORATION === "true",
    integrations: process.env.NEXT_PUBLIC_ENABLE_INTEGRATIONS === "true",
  },

  // Performance Monitoring
  performance: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true",
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  },

  // Development Settings
  development: {
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === "true",
    mockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "false", // Default false for safety
  },

  // PWA Settings
  pwa: {
    enabled: process.env.NEXT_PUBLIC_PWA_ENABLED === "true",
    cacheDuration: parseInt(process.env.NEXT_PUBLIC_PWA_CACHE_DURATION || "86400000", 10),
  },

  // Analytics
  analytics: {
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || "",
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || "",
  },

  // Error Tracking
  errorTracking: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === "true",
    endpoint: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT || "",
  },

  // Build Configuration
  build: {
    analyze: process.env.ANALYZE === "true",
    sourcemap: process.env.NEXT_PUBLIC_BUILD_SOURCEMAP === "true",
  },
} as const;

/**
 * Server-side only environment variables (no NEXT_PUBLIC prefix)
 * These are only available in server components, API routes, and server actions
 *
 * WARNING: Never expose these on the client side!
 */
export const serverEnv = {
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
} as const;

/**
 * Environment variable validation
 * Runs at build time and throws if required variables are missing
 */
export function validateEnv(): void {
  const errors: string[] = [];

  // Only validate in production or when explicitly enabled
  const shouldValidate = process.env.NODE_ENV === "production" || process.env.VALIDATE_ENV === "true";

  if (!shouldValidate) {
    return;
  }

  // Required client-side variables
  if (!clientEnv.apiBaseUrl) {
    errors.push("NEXT_PUBLIC_API_BASE_URL is required");
  }

  // Required server-side variables (only validate on server)
  if (typeof window === "undefined") {
    if (!serverEnv.databaseUrl && process.env.NODE_ENV === "production") {
      errors.push("DATABASE_URL is required in production");
    }
    if (!serverEnv.jwtSecret && process.env.NODE_ENV === "production") {
      errors.push("JWT_SECRET is required in production");
    }
  }

  // Optional but recommended warnings
  if (!clientEnv.googleClientId && process.env.NODE_ENV === "production") {
    console.warn("⚠️  NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set - Google OAuth will not work");
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
  }
}

/**
 * Check if running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Check if running in production mode
 */
export const isProduction = process.env.NODE_ENV === "production";

/**
 * Check if running in test mode
 */
export const isTest = process.env.NODE_ENV === "test";

/**
 * Type-safe environment variable getter
 */
export function getEnv<T extends keyof typeof clientEnv>(key: T): (typeof clientEnv)[T] {
  return clientEnv[key];
}

/**
 * Type-safe server environment variable getter (server-side only)
 */
export function getServerEnv<T extends keyof typeof serverEnv>(key: T): (typeof serverEnv)[T] {
  if (typeof window !== "undefined") {
    throw new Error(`Attempted to access server environment variable "${key}" on the client side`);
  }
  return serverEnv[key];
}

// Export types for TypeScript autocomplete
export type ClientEnv = typeof clientEnv;
export type ServerEnv = typeof serverEnv;
