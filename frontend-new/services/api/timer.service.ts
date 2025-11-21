/**
 * Timer API Service
 *
 * API calls for timer operations and session management.
 */

import { get, post, put } from "./client";
import { API_ENDPOINTS } from "@/config";
import type {
  StartTimerResponse,
  StopTimerResponse,
  TimerSession,
  TimeEntry,
  SessionStatistics,
  DailyTimeSummary,
  WeeklyTimeSummary,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

/**
 * Start timer session
 */
export async function startTimer(data: {
  duration: number;
  sessionType: string;
  projectId?: string;
  taskId?: string;
}): Promise<StartTimerResponse> {
  return post<StartTimerResponse>(API_ENDPOINTS.TIMER.START, data);
}

/**
 * Stop timer session
 */
export async function stopTimer(sessionId: string): Promise<StopTimerResponse> {
  return post<StopTimerResponse>(API_ENDPOINTS.TIMER.STOP, { sessionId });
}

/**
 * Pause timer session
 */
export async function pauseTimer(sessionId: string): Promise<void> {
  return post<void>(API_ENDPOINTS.TIMER.PAUSE, { sessionId });
}

/**
 * Resume timer session
 */
export async function resumeTimer(sessionId: string): Promise<void> {
  return post<void>(API_ENDPOINTS.TIMER.RESUME, { sessionId });
}

/**
 * Get timer session history
 */
export async function getTimerHistory(params?: PaginationParams): Promise<PaginatedResponse<TimerSession>> {
  return get<PaginatedResponse<TimerSession>>(API_ENDPOINTS.TIMER.HISTORY, params);
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<TimerSession> {
  return get<TimerSession>(`/timer/sessions/${sessionId}`);
}

/**
 * Update session
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<TimerSession>
): Promise<TimerSession> {
  return put<TimerSession>(`/timer/sessions/${sessionId}`, updates);
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  return post<void>(`/timer/sessions/${sessionId}/delete`);
}

/**
 * Create manual time entry
 */
export async function createTimeEntry(data: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">): Promise<TimeEntry> {
  return post<TimeEntry>("/timer/entries", data);
}

/**
 * Get time entries
 */
export async function getTimeEntries(params?: PaginationParams): Promise<PaginatedResponse<TimeEntry>> {
  return get<PaginatedResponse<TimeEntry>>("/timer/entries", params);
}

/**
 * Update time entry
 */
export async function updateTimeEntry(
  entryId: string,
  updates: Partial<TimeEntry>
): Promise<TimeEntry> {
  return put<TimeEntry>(`/timer/entries/${entryId}`, updates);
}

/**
 * Delete time entry
 */
export async function deleteTimeEntry(entryId: string): Promise<void> {
  return post<void>(`/timer/entries/${entryId}/delete`);
}

/**
 * Get session statistics
 */
export async function getSessionStatistics(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<SessionStatistics> {
  return get<SessionStatistics>("/timer/statistics", params);
}

/**
 * Get daily time summary
 */
export async function getDailyTimeSummary(date: string): Promise<DailyTimeSummary> {
  return get<DailyTimeSummary>("/timer/summary/daily", { date });
}

/**
 * Get weekly time summary
 */
export async function getWeeklyTimeSummary(weekStart: string): Promise<WeeklyTimeSummary> {
  return get<WeeklyTimeSummary>("/timer/summary/weekly", { weekStart });
}

/**
 * Export time data
 */
export async function exportTimeData(params: {
  format: "csv" | "json" | "pdf";
  startDate: string;
  endDate: string;
}): Promise<Blob> {
  const response = await get<Blob>("/timer/export", params);
  return response;
}

/**
 * Get active timer session
 */
export async function getActiveTimer(): Promise<TimerSession | null> {
  try {
    return await get<TimerSession>("/timer/active");
  } catch (error) {
    // Return null if no active timer
    return null;
  }
}

/**
 * Hook-compatible aliases
 */
export const getHistory = getTimerHistory;
export const getStatistics = getSessionStatistics;
export const updateTimer = updateSession;
