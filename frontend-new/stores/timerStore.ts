/**
 * Timer Store
 *
 * Zustand store for managing timer state with SSR hydration support.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS, TIMER } from "@/config";
import { TimerStatus, SessionType } from "@/types";
import type { TimerState } from "@/types";

interface TimerStore extends TimerState {
  // Actions
  startTimer: (duration: number, sessionType: SessionType, projectId?: string, taskId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setProject: (projectId: string | null) => void;
  setTask: (taskId: string | null) => void;
  completeSession: () => void;

  // Computed
  getProgress: () => number;
  isRunning: () => boolean;
  isPaused: () => boolean;
  isIdle: () => boolean;
}

const initialState: TimerState = {
  status: TimerStatus.IDLE,
  sessionType: SessionType.WORK,
  currentTime: TIMER.DEFAULT_WORK_DURATION,
  totalTime: TIMER.DEFAULT_WORK_DURATION,
  startTime: null,
  endTime: null,
  pausedAt: null,
  sessionsCompleted: 0,
  currentProject: null,
  currentTask: null,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startTimer: (duration, sessionType, projectId, taskId) => {
        const now = new Date();
        set({
          status: TimerStatus.RUNNING,
          sessionType,
          currentTime: duration,
          totalTime: duration,
          startTime: now,
          endTime: null,
          pausedAt: null,
          currentProject: projectId || null,
          currentTask: taskId || null,
        });
      },

      pauseTimer: () => {
        const state = get();
        if (state.status === TimerStatus.RUNNING) {
          set({
            status: TimerStatus.PAUSED,
            pausedAt: new Date(),
          });
        }
      },

      resumeTimer: () => {
        const state = get();
        if (state.status === TimerStatus.PAUSED) {
          set({
            status: TimerStatus.RUNNING,
            pausedAt: null,
          });
        }
      },

      stopTimer: () => {
        set({
          status: TimerStatus.IDLE,
          endTime: new Date(),
          startTime: null,
          pausedAt: null,
        });
      },

      resetTimer: () => {
        set({
          ...initialState,
          sessionsCompleted: get().sessionsCompleted,
        });
      },

      tick: () => {
        const state = get();
        if (state.status === TimerStatus.RUNNING && state.currentTime > 0) {
          set({ currentTime: state.currentTime - 1 });

          // Auto-complete when timer reaches 0
          if (state.currentTime - 1 <= 0) {
            get().completeSession();
          }
        }
      },

      setProject: (projectId) => {
        set({ currentProject: projectId });
      },

      setTask: (taskId) => {
        set({ currentTask: taskId });
      },

      completeSession: () => {
        const state = get();
        set({
          status: TimerStatus.COMPLETED,
          endTime: new Date(),
          currentTime: 0,
          sessionsCompleted: state.sessionsCompleted + 1,
        });
      },

      // Computed getters
      getProgress: () => {
        const state = get();
        if (state.totalTime === 0) return 0;
        return ((state.totalTime - state.currentTime) / state.totalTime) * 100;
      },

      isRunning: () => get().status === TimerStatus.RUNNING,
      isPaused: () => get().status === TimerStatus.PAUSED,
      isIdle: () => get().status === TimerStatus.IDLE,
    }),
    {
      name: STORAGE_KEYS.TIMER_STATE,
      storage: createJSONStorage(() => {
        // SSR-safe storage
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      // Serialize dates properly
      partialize: (state) => ({
        status: state.status,
        sessionType: state.sessionType,
        currentTime: state.currentTime,
        totalTime: state.totalTime,
        startTime: state.startTime?.toISOString(),
        endTime: state.endTime?.toISOString(),
        pausedAt: state.pausedAt?.toISOString(),
        sessionsCompleted: state.sessionsCompleted,
        currentProject: state.currentProject,
        currentTask: state.currentTask,
      }),
      // Deserialize dates from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.startTime = state.startTime ? new Date(state.startTime) : null;
          state.endTime = state.endTime ? new Date(state.endTime) : null;
          state.pausedAt = state.pausedAt ? new Date(state.pausedAt) : null;
        }
      },
    }
  )
);

// Selectors for optimal re-renders
export const selectTimerStatus = (state: TimerStore) => state.status;
export const selectCurrentTime = (state: TimerStore) => state.currentTime;
export const selectTotalTime = (state: TimerStore) => state.totalTime;
export const selectProgress = (state: TimerStore) => state.getProgress();
export const selectSessionType = (state: TimerStore) => state.sessionType;
export const selectIsRunning = (state: TimerStore) => state.isRunning();
