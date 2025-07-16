import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TimeSession } from '@/types';

interface TimerState {
    activeSession: TimeSession | null;
    isRunning: boolean;
    startTime: Date | null;
    elapsedTime: number;
    sessions: TimeSession[];

    // Actions
    startTimer: (projectId?: string, taskId?: string, description?: string) => void;
    stopTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    updateElapsedTime: () => void;
    addSession: (session: TimeSession) => void;
    clearSessions: () => void;
}

export const useTimerStore = create<TimerState>()(
    devtools(
        persist(
            (set, get) => ({
                activeSession: null,
                isRunning: false,
                startTime: null,
                elapsedTime: 0,
                sessions: [],

                startTimer: (projectId, taskId, description) => {
                    const now = new Date();
                    const session: TimeSession = {
                        id: crypto.randomUUID(),
                        projectId,
                        taskId,
                        startTime: now,
                        duration: 0,
                        description,
                        xpEarned: 0,
                    };

                    set({
                        activeSession: session,
                        isRunning: true,
                        startTime: now,
                        elapsedTime: 0,
                    });
                },

                stopTimer: () => {
                    const { activeSession, startTime, elapsedTime } = get();

                    if (activeSession && startTime) {
                        const endTime = new Date();
                        const totalDuration = elapsedTime + (endTime.getTime() - startTime.getTime());

                        const completedSession: TimeSession = {
                            ...activeSession,
                            endTime,
                            duration: totalDuration,
                            xpEarned: Math.floor(totalDuration / 60000), // 1 XP per minute
                        };

                        set((state) => ({
                            activeSession: null,
                            isRunning: false,
                            startTime: null,
                            elapsedTime: 0,
                            sessions: [...state.sessions, completedSession],
                        }));
                    }
                },

                pauseTimer: () => {
                    const { startTime, elapsedTime } = get();

                    if (startTime) {
                        const now = new Date();
                        const additionalTime = now.getTime() - startTime.getTime();

                        set({
                            isRunning: false,
                            startTime: null,
                            elapsedTime: elapsedTime + additionalTime,
                        });
                    }
                },

                resumeTimer: () => {
                    set({
                        isRunning: true,
                        startTime: new Date(),
                    });
                },

                updateElapsedTime: () => {
                    const { startTime, elapsedTime, isRunning } = get();

                    if (isRunning && startTime) {
                        const now = new Date();
                        // This is just for display purposes, actual elapsed time is calculated when pausing/stopping
                        // We could return the current elapsed time here if needed for display
                        return elapsedTime + (now.getTime() - startTime.getTime());
                    }
                    return elapsedTime;
                },

                addSession: (session) => {
                    set((state) => ({
                        sessions: [...state.sessions, session],
                    }));
                },

                clearSessions: () => set({ sessions: [] }),
            }),
            {
                name: 'timer-store',
                partialize: (state) => ({
                    activeSession: state.activeSession,
                    isRunning: state.isRunning,
                    startTime: state.startTime,
                    elapsedTime: state.elapsedTime,
                    sessions: state.sessions,
                }),
            }
        ),
        { name: 'TimerStore' }
    )
);