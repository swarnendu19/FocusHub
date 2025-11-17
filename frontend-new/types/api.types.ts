/**
 * API Types
 *
 * Type definitions for API requests, responses, and errors.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    field?: string;
  };
  timestamp: Date;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  message?: string;
  timestamp: Date;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

/**
 * HTTP error codes
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Authentication API responses
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
  };
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresAt: string;
}

/**
 * Timer API responses
 */
export interface StartTimerResponse {
  sessionId: string;
  startTime: string;
  duration: number;
  sessionType: string;
}

export interface StopTimerResponse {
  sessionId: string;
  duration: number;
  xpEarned: number;
  completed: boolean;
}

/**
 * Project API responses
 */
export interface ProjectListResponse {
  projects: Array<{
    id: string;
    name: string;
    color: string;
    status: string;
    totalTimeTracked: number;
    taskCount: number;
  }>;
}

/**
 * Analytics API responses
 */
export interface AnalyticsSummaryResponse {
  totalTimeTracked: number;
  sessionsCompleted: number;
  currentStreak: number;
  xpEarned: number;
  level: number;
  topProjects: Array<{
    projectId: string;
    projectName: string;
    timeSpent: number;
    percentage: number;
  }>;
  dailyActivity: Array<{
    date: string;
    timeTracked: number;
    sessions: number;
  }>;
}

/**
 * Leaderboard API responses
 */
export interface LeaderboardResponse {
  entries: Array<{
    rank: number;
    userId: string;
    username: string;
    displayName: string;
    avatar?: string;
    score: number;
    level: number;
    change: number;
  }>;
  currentUserRank?: number;
  totalEntries: number;
}

/**
 * Achievement API responses
 */
export interface AchievementsResponse {
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    rarity: string;
    icon: string;
    progress: number;
    isUnlocked: boolean;
    unlockedAt?: string;
  }>;
  totalUnlocked: number;
  totalAchievements: number;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  success: boolean;
  file: {
    id: string;
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  };
}

/**
 * Type guard for successful API response
 */
export function isApiSuccess<T>(
  response: ApiResponse<T> | ApiError
): response is ApiResponse<T> {
  return response.success === true;
}

/**
 * Type guard for API error
 */
export function isApiError(
  response: ApiResponse<unknown> | ApiError
): response is ApiError {
  return response.success === false;
}

/**
 * Type guard for validation errors
 */
export function hasValidationErrors(error: ApiError): boolean {
  return (
    error.error.code === "VALIDATION_ERROR" &&
    Array.isArray(error.error.details)
  );
}
