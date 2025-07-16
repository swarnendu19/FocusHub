import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TimeSession } from '@/types';

interface TimerState {
    activeSession: TimeSession | null;
    isRunning: boolean;
    isPaused: boolean;
    startTime: Date | null;
    elapsedTime: number;
    sessions: TimeSession[];

    // Daily/Weekly stats
    dailyTime: number;
    weeklyTime: number;
    dailyGoal: number;
    weeklyGoal: number;

    // Actions
    startTimer: (projectId?: string, taskId?: string, description?: string) => void;
    stopTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    updateElapsedTime: () => number;
    addSession: (session: TimeSession) => void;
    clearSessions: () => void;

    // Goal management
    setDailyGoal: (minutes: number) => void;
    setWeeklyGoal: (minutes: number) => void;
    updateDailyTime: (minutes: number) => void;
    updateWeeklyTime: (minutes: number) => void;

    // Analytics
    getTodaysSessions: () => TimeSession[];
    getWeeksSessions: () => TimeSession[];
    getTotalTimeToday: () => number;
    getTotalTimeThisWeek: () => number;
    getAverageSessionLength: () => number;
    getDailyProgress: () => number;
    getWeeklyProgress: () => number;

    // Session management
    getSessionsByProject: (projectId: string) => TimeSession[];
    getSessionsByTask: (taskId: string) => TimeSession[];
    deleteSession: (sessionId: string) => void;
    updateSession: (sessionId: string, updates: Partial<TimeSession>) => void;
}

export const useTimerStore = create<TimerState>()(
    devtools(
        persist(
            (set, get) => ({
                activeSession: null,
                isRunning: false,
                isPaused: false,
                startTime: null,
                elapsedTime: 0,
                sessions: [],

                // Daily/Weekly stats
                dailyTime: 0,
                weeklyTime: 0,
                dailyGoal: 480, // 8 hours in minutes
                weeklyGoal: 2400, // 40 hours in minutes

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
                        isPaused: false,
                        startTime: now,
                        elapsedTime: 0,
                    });
                },

                stopTimer: () => {
                    const { activeSession, startTime, elapsedTime } = get();

                    if (activeSession && startTime) {
                        const endTime = new Date();
                        const totalDuration = elapsedTime + (endTime.getTime() - startTime.getTime());
                        const durationInMinutes = Math.floor(totalDuration / 60000);

                        const completedSession: TimeSession = {
                            ...activeSession,
                            endTime,
                            duration: totalDuration,
                            xpEarned: durationInMinutes, // 1 XP per minute
                        };

                        set((state) => ({
                            activeSession: null,
                            isRunning: false,
                            isPaused: false,
                            startTime: null,
                            elapsedTime: 0,
                            sessions: [...state.sessions, completedSession],
                            dailyTime: state.dailyTime + durationInMinutes,
                            weeklyTime: state.weeklyTime + durationInMinutes,
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
                            isPaused: true,
                            startTime: null,
                            elapsedTime: elapsedTime + additionalTime,
                        });
                    }
                },

                resumeTimer: () => {
                    set({
                        isRunning: true,
                        isPaused: false,
                        startTime: new Date(),
                    });
                },

                updateElapsedTime: () => {
                    const { startTime, elapsedTime, isRunning } = get();

                    if (isRunning && startTime) {
                        const now = new Date();
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

                // Goal management
                setDailyGoal: (minutes) => set({ dailyGoal: minutes }),
                setWeeklyGoal: (minutes) => set({ weeklyGoal: minutes }),
                updateDailyTime: (minutes) => set({ dailyTime: minutes }),
                updateWeeklyTime: (minutes) => set({ weeklyTime: minutes }),

                // Analytics
                getTodaysSessions: () => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    return get().sessions.filter(session => {
                        const sessionDate = new Date(session.startTime);
                        return sessionDate >= today && sessionDate < tomorrow;
                    });
                },

                getWeeksSessions: () => {
                    const now = new Date();
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);

                    return get().sessions.filter(session => {
                        const sessionDate = new Date(session.startTime);
                        return sessionDate >= startOfWeek;
                    });
                },

                getTotalTimeToday: () => {
                    const todaysSessions = get().getTodaysSessions();
                    return todaysSessions.reduce((total, session) => total + session.duration, 0);
                },

                getTotalTimeThisWeek: () => {
                    const weeksSessions = get().getWeeksSessions();
                    return weeksSessions.reduce((total, session) => total + session.duration, 0);
                },

                getAverageSessionLength: () => {
                    const sessions = get().sessions;
                    if (sessions.length === 0) return 0;
                    const totalDuration = sessions.reduce((total, session) => total + session.duration, 0);
                    return totalDuration / sessions.length;
                },

                getDailyProgress: () => {
                    const { dailyTime, dailyGoal } = get();
                    return Math.min((dailyTime / dailyGoal) * 100, 100);
                },

                getWeeklyProgress: () => {
                    const { weeklyTime, weeklyGoal } = get();
                    return Math.min((weeklyTime / weeklyGoal) * 100, 100);
                },

                // Session management
                getSessionsByProject: (projectId) => {
                    return get().sessions.filter(session => session.projectId === projectId);
                },

                getSessionsByTask: (taskId) => {
                    return get().sessions.filter(session => session.taskId === taskId);
                },

                deleteSession: (sessionId) => {
                    set((state) => ({
                        sessions: state.sessions.filter(session => session.id !== sessionId),
                    }));
                },

                updateSession: (sessionId, updates) => {
                    set((state) => ({
                        sessions: state.sessions.map(session =>
                            session.id === sessionId ? { ...session, ...updates } : session
                        ),
                    }));
                },
            }),
            {
                name: 'timer-store',
                partialize: (state) => ({
                    activeSession: state.activeSession,
                    isRunning: state.isRunning,
                    isPaused: state.isPaused,
                    startTime: state.startTime,
                    elapsedTime: state.elapsedTime,
                    sessions: state.sessions,
                    dailyTime: state.dailyTime,
                    weeklyTime: state.weeklyTime,
                    dailyGoal: state.dailyGoal,
                    weeklyGoal: state.weeklyGoal,
                }),
            }
        ),
        { name: 'TimerStore' }
    )
);