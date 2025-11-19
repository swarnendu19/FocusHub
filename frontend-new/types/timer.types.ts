/**
 * Timer Types
 *
 * Type definitions for timer functionality, sessions, and time tracking.
 */

/**
 * Timer status enumeration
 */
export enum TimerStatus {
  IDLE = "idle",
  RUNNING = "running",
  PAUSED = "paused",
  COMPLETED = "completed",
}

/**
 * Session type enumeration
 */
export enum SessionType {
  WORK = "work",
  SHORT_BREAK = "short_break",
  LONG_BREAK = "long_break",
  CUSTOM = "custom",
}

/**
 * Timer configuration
 */
export interface TimerConfig {
  workDuration: number; // in seconds
  shortBreakDuration: number; // in seconds
  longBreakDuration: number; // in seconds
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartNextSession: boolean;
}

/**
 * Timer state
 */
export interface TimerState {
  status: TimerStatus;
  sessionType: SessionType;
  currentTime: number; // remaining time in seconds
  totalTime: number; // total duration in seconds
  startTime: Date | null;
  endTime: Date | null;
  pausedAt: Date | null;
  sessionsCompleted: number;
  currentProject: string | null;
  currentTask: string | null;
}

/**
 * Timer session record
 */
export interface TimerSession {
  id: string;
  userId: string;
  sessionType: SessionType;
  duration: number; // actual duration in seconds
  plannedDuration: number; // planned duration in seconds
  actualDuration?: number; // Alias for duration
  pausedDuration?: number; // Time spent paused
  startTime: Date;
  endTime: Date | null;
  projectId?: string | null;
  taskId?: string | null;
  tags?: string[];
  notes?: string;
  description?: string | null; // Alias for notes
  xpEarned: number;
  completed: boolean;
  interrupted: boolean;
  interruptionCount: number;
  status?: string; // Timer status
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Time entry for manual tracking
 */
export interface TimeEntry {
  id: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  tags?: string[];
  billable: boolean;
  xpEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Timer session statistics
 */
export interface SessionStatistics {
  totalSessions: number;
  completedSessions: number;
  interruptedSessions: number;
  totalTimeTracked: number; // in seconds
  averageSessionDuration: number; // in seconds
  longestSession: number; // in seconds
  shortestSession: number; // in seconds
  totalWorkTime: number; // in seconds
  totalBreakTime: number; // in seconds
  completionRate: number; // percentage
  focusScore: number; // 0-100
}

/**
 * Daily time tracking summary
 */
export interface DailyTimeSummary {
  date: Date;
  totalTime: number; // in seconds
  workTime: number; // in seconds
  breakTime: number; // in seconds
  sessionsCompleted: number;
  projects: Array<{
    projectId: string;
    projectName: string;
    timeSpent: number; // in seconds
  }>;
  xpEarned: number;
  focusScore: number;
}

/**
 * Weekly time tracking summary
 */
export interface WeeklyTimeSummary {
  weekStart: Date;
  weekEnd: Date;
  totalTime: number; // in seconds
  dailySummaries: DailyTimeSummary[];
  topProjects: Array<{
    projectId: string;
    projectName: string;
    timeSpent: number;
    percentage: number;
  }>;
  averageDailyTime: number; // in seconds
  xpEarned: number;
  streak: number; // days
}

/**
 * Timer preset
 */
export interface TimerPreset {
  id: string;
  name: string;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  isDefault: boolean;
  userId: string;
}

/**
 * Timer notification settings
 */
export interface TimerNotificationSettings {
  enabled: boolean;
  sessionStart: boolean;
  sessionEnd: boolean;
  breakStart: boolean;
  breakEnd: boolean;
  milestone: boolean; // e.g., every 5 sessions
  soundEnabled: boolean;
  soundType: "bell" | "chime" | "ding" | "custom";
  volume: number; // 0-100
}

/**
 * Type guard for active timer
 */
export function isTimerActive(status: TimerStatus): boolean {
  return status === TimerStatus.RUNNING;
}

/**
 * Type guard for paused timer
 */
export function isTimerPaused(status: TimerStatus): boolean {
  return status === TimerStatus.PAUSED;
}

/**
 * Type guard for completed session
 */
export function isSessionCompleted(session: TimerSession): boolean {
  return session.completed && !session.interrupted;
}

/**
 * Type guard for work session
 */
export function isWorkSession(sessionType: SessionType): boolean {
  return sessionType === SessionType.WORK;
}

/**
 * Type guard for break session
 */
export function isBreakSession(sessionType: SessionType): boolean {
  return (
    sessionType === SessionType.SHORT_BREAK ||
    sessionType === SessionType.LONG_BREAK
  );
}
