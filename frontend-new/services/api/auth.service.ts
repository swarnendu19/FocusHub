/**
 * Authentication API Service
 *
 * API calls for user authentication and profile management.
 */

import { get, post, put, patch } from "./client";
import { API_ENDPOINTS } from "@/config";
import type {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  UserLoginCredentials,
  UserRegistration,
  UserProfileUpdate,
  PasswordChange,
  PasswordResetRequest,
  PasswordResetConfirmation,
  User,
  UserStats,
  UserPreferences,
} from "@/types";

/**
 * Login with email and password
 */
export async function login(credentials: UserLoginCredentials): Promise<LoginResponse> {
  return post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
}

/**
 * Register new user
 */
export async function register(data: UserRegistration): Promise<RegisterResponse> {
  return post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  return post<void>(API_ENDPOINTS.AUTH.LOGOUT);
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  return post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(token: string): Promise<LoginResponse> {
  return post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_AUTH, { token });
}

/**
 * Get current user profile
 */
export async function getUserProfile(): Promise<User> {
  return get<User>(API_ENDPOINTS.USER.PROFILE);
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: UserProfileUpdate): Promise<User> {
  return put<User>(API_ENDPOINTS.USER.PROFILE, updates);
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<UserStats> {
  return get<UserStats>(API_ENDPOINTS.USER.STATS);
}

/**
 * Get user preferences
 */
export async function getUserPreferences(): Promise<UserPreferences> {
  return get<UserPreferences>(API_ENDPOINTS.USER.PREFERENCES);
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  return patch<UserPreferences>(API_ENDPOINTS.USER.PREFERENCES, preferences);
}

/**
 * Change password
 */
export async function changePassword(data: PasswordChange): Promise<void> {
  return post<void>("/auth/change-password", data);
}

/**
 * Request password reset
 */
export async function requestPasswordReset(data: PasswordResetRequest): Promise<void> {
  return post<void>("/auth/forgot-password", data);
}

/**
 * Confirm password reset
 */
export async function confirmPasswordReset(data: PasswordResetConfirmation): Promise<void> {
  return post<void>("/auth/reset-password", data);
}

/**
 * Delete user account
 */
export async function deleteAccount(password: string): Promise<void> {
  return post<void>("/user/delete-account", { password });
}
