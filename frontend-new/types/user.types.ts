/**
 * User Types
 *
 * Type definitions for user authentication, profiles, and preferences.
 */

/**
 * User role enumeration
 */
export enum UserRole {
  USER = "user",
  PREMIUM = "premium",
  ADMIN = "admin",
}

/**
 * Authentication provider types
 */
export enum AuthProvider {
  EMAIL = "email",
  GOOGLE = "google",
  GITHUB = "github",
}

/**
 * User profile data
 */
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  authProvider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

/**
 * User statistics
 */
export interface UserStats {
  totalTimeTracked: number; // in seconds
  totalSessions: number;
  currentStreak: number; // days
  longestStreak: number; // days
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  achievementsUnlocked: number;
  projectsCompleted: number;
  averageSessionDuration: number; // in seconds
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sessionReminders: boolean;
    achievementUnlocks: boolean;
    weeklyReports: boolean;
  };
  timer: {
    autoStartBreaks: boolean;
    autoStartNextSession: boolean;
    soundEnabled: boolean;
    soundVolume: number; // 0-100
    tickSoundEnabled: boolean;
  };
  privacy: {
    showOnLeaderboard: boolean;
    profileVisibility: "public" | "friends" | "private";
    shareStats: boolean;
  };
}

/**
 * User session/authentication token data
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  tokenType: "Bearer";
}

/**
 * User authentication state
 */
export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * User registration data
 */
export interface UserRegistration {
  email: string;
  password: string;
  username: string;
  displayName: string;
  acceptTerms: boolean;
}

/**
 * User login credentials
 */
export interface UserLoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  displayName?: string;
  avatar?: string;
  bio?: string;
  username?: string;
}

/**
 * Password change data
 */
export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Type guard to check if user is authenticated
 */
export function isAuthenticatedUser(user: User | null): user is User {
  return user !== null && !!user.id && !!user.email;
}

/**
 * Type guard to check if user is premium
 */
export function isPremiumUser(user: User | null): boolean {
  return user?.role === UserRole.PREMIUM || user?.role === UserRole.ADMIN;
}

/**
 * Type guard to check if user is admin
 */
export function isAdminUser(user: User | null): boolean {
  return user?.role === UserRole.ADMIN;
}
