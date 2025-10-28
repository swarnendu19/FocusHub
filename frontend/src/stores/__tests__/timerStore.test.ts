import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTimerStore } from '../timerStore';
import type { TimeSession } from '@/types';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: vi.fn(() => 'mock-uuid'),
    },
});

describe('TimerStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        useTimerStore.setState({
            activeSession: null,
            isRunning: false,
            isPaused: false,
            startTime: null,
            elapsedTime: 0,
            sessions: [],
            dailyTime: 0,
            weeklyTime: 0,
            dailyGoal: 480,
            weeklyGoal: 2400,
        });
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Timer Controls', () => {
        it('starts timer correctly', () => {
            const { startTimer } = useTimerStore.getState();

            startTimer('project-1', 'task-1', 'Working on feature');

            const state = useTimerStore.getState();
            expect(state.isRunning).toBe(true);
            expect(state.isPaused).toBe(false);
            expect(state.activeSession).toMatchObject({
                id: 'mock-uuid',
                projectId: 'project-1',
                taskId: 'task-1',
                description: 'Working on feature',
                duration: 0,
                xpEarned: 0,
            });
            expect(state.startTime).toBeInstanceOf(Date);
        });

        it('starts timer without optional parameters', () => {
            const { startTimer } = useTimerStore.getState();

            startTimer();

            const state = useTimerStore.getState();
            expect(state.isRunning).toBe(true);
            expect(state.activeSession).toMatchObject({
                id: 'mock-uuid',
                projectId: undefined,
                taskId: undefined,
                description: undefined,
            });
        });

        it('pauses timer correctly', () => {
            const { startTimer, pauseTimer } = useTimerStore.getState();

            startTimer();

            // Advance time by 5 seconds
            vi.advanceTimersByTime(5000);

            pauseTimer();

            const state = useTimerStore.getState();
            expect(state.isRunning).toBe(false);
            expect(state.isPaused).toBe(true);
            expect(state.startTime).toBe(null);
            expect(state.elapsedTime).toBe(5000);
        });

        it('resumes timer correctly', () => {
            const { startTimer, pauseTimer, resumeTimer } = useTimerStore.getState();

            startTimer();
            vi.advanceTimersByTime(5000);
            pauseTimer();

            resumeTimer();

            const state = useTimerStore.getState();
            expect(state.isRunning).toBe(true);
            expect(state.isPaused).toBe(false);
            expect(state.startTime).toBeInstanceOf(Date);
            expect(state.elapsedTime).toBe(5000);
        });

        it('stops timer and creates session', () => {
            const { startTimer, stopTimer } = useTimerStore.getState();

            startTimer('project-1', 'task-1', 'Test session');

            // Advance time by 30 minutes
            vi.advanceTimersByTime(30 * 60 * 1000);

            stopTimer();

            const state = useTimerStore.getState();
            expect(state.activeSession).toBe(null);
            expect(state.isRunning).toBe(false);
            expect(state.isPaused).toBe(false);
            expect(state.startTime).toBe(null);
            expect(state.elapsedTime).toBe(0);
            expect(state.sessions).toHaveLength(1);

            const session = state.sessions[0];
            expect(session.duration).toBe(30 * 60 * 1000);
            expect(session.xpEarned).toBe(30); // 1 XP per minute
            expect(session.projectId).toBe('project-1');
            expect(session.taskId).toBe('task-1');
            expect(session.description).toBe('Test session');
        });

        it('updates elapsed time correctly', () => {
            const { startTimer, updateElapsedTime } = useTimerStore.getState();

            startTimer();

            // Advance time by 10 seconds
            vi.advanceTimersByTime(10000);

            const elapsedTime = updateElapsedTime();
            expect(elapsedTime).toBe(10000);
        });

        it('returns correct elapsed time when paused', () => {
            const { startTimer, pauseTimer, updateElapsedTime } = useTimerStore.getState();

            startTimer();
            vi.advanceTimersByTime(5000);
            pauseTimer();
            vi.advanceTimersByTime(5000); // This shouldn't count

            const elapsedTime = updateElapsedTime();
            expect(elapsedTime).toBe(5000);
        });
    });

    describe('Session Management', () => {
        it('adds session correctly', () => {
            const { addSession } = useTimerStore.getState();

            const session: TimeSession = {
                id: '1',
                startTime: new Date(),
                duration: 1800000,
                xpEarned: 30,
            };

            addSession(session);

            const state = useTimerStore.getState();
            expect(state.sessions).toContain(session);
        });

        it('deletes session correctly', () => {
            const { addSession, deleteSession } = useTimerStore.getState();

            const session: TimeSession = {
                id: '1',
                startTime: new Date(),
                duration: 1800000,
                xpEarned: 30,
            };

            addSession(session);
            deleteSession('1');

            const state = useTimerStore.getState();
            expect(state.sessions).not.toContain(session);
        });

        it('updates session correctly', () => {
            const { addSession, updateSession } = useTimerStore.getState();

            const session: TimeSession = {
                id: '1',
                startTime: new Date(),
                duration: 1800000,
                xpEarned: 30,
            };

            addSession(session);
            updateSession('1', { description: 'Updated description' });

            const state = useTimerStore.getState();
            const updatedSession = state.sessions.find(s => s.id === '1');
            expect(updatedSession?.description).toBe('Updated description');
        });

        it('clears all sessions', () => {
            const { addSession, clearSessions } = useTimerStore.getState();

            const session: TimeSession = {
                id: '1',
                startTime: new Date(),
                duration: 1800000,
                xpEarned: 30,
            };

            addSession(session);
            clearSessions();

            const state = useTimerStore.getState();
            expect(state.sessions).toHaveLength(0);
        });
    });

    describe('Analytics', () => {
        beforeEach(() => {
            const today = new Date('2024-01-15T10:00:00');
            const yesterday = new Date('2024-01-14T10:00:00');
            const lastWeek = new Date('2024-01-08T10:00:00');

            const sessions: TimeSession[] = [
                {
                    id: '1',
                    startTime: today,
                    duration: 1800000, // 30 minutes
                    xpEarned: 30,
                },
                {
                    id: '2',
                    startTime: today,
                    duration: 3600000, // 60 minutes
                    xpEarned: 60,
                },
                {
                    id: '3',
                    startTime: yesterday,
                    duration: 1200000, // 20 minutes
                    xpEarned: 20,
                },
                {
                    id: '4',
                    startTime: lastWeek,
                    duration: 900000, // 15 minutes
                    xpEarned: 15,
                },
            ];

            useTimerStore.setState({ sessions });
            vi.setSystemTime(new Date('2024-01-15T15:00:00'));
        });

        it('gets today\'s sessions correctly', () => {
            const { getTodaysSessions } = useTimerStore.getState();

            const todaysSessions = getTodaysSessions();
            expect(todaysSessions).toHaveLength(2);
            expect(todaysSessions.every(s => s.startTime.getDate() === 15)).toBe(true);
        });

        it('gets this week\'s sessions correctly', () => {
            const { getWeeksSessions } = useTimerStore.getState();

            const weeksSessions = getWeeksSessions();
            expect(weeksSessions).toHaveLength(3); // Today + yesterday, but not last week
        });

        it('calculates total time today correctly', () => {
            const { getTotalTimeToday } = useTimerStore.getState();

            const totalTime = getTotalTimeToday();
            expect(totalTime).toBe(5400000); // 30 + 60 minutes in milliseconds
        });

        it('calculates total time this week correctly', () => {
            const { getTotalTimeThisWeek } = useTimerStore.getState();

            const totalTime = getTotalTimeThisWeek();
            expect(totalTime).toBe(6600000); // 30 + 60 + 20 minutes in milliseconds
        });

        it('calculates average session length correctly', () => {
            const { getAverageSessionLength } = useTimerStore.getState();

            const avgLength = getAverageSessionLength();
            expect(avgLength).toBe(1950000); // (30+60+20+15)/4 * 60000
        });

        it('calculates daily progress correctly', () => {
            const { getDailyProgress } = useTimerStore.getState();

            useTimerStore.setState({ dailyTime: 240 }); // 4 hours in minutes

            const progress = getDailyProgress();
            expect(progress).toBe(50); // 4/8 hours = 50%
        });

        it('calculates weekly progress correctly', () => {
            const { getWeeklyProgress } = useTimerStore.getState();

            useTimerStore.setState({ weeklyTime: 1200 }); // 20 hours in minutes

            const progress = getWeeklyProgress();
            expect(progress).toBe(50); // 20/40 hours = 50%
        });

        it('caps progress at 100%', () => {
            const { getDailyProgress } = useTimerStore.getState();

            useTimerStore.setState({ dailyTime: 600 }); // 10 hours in minutes (more than 8 hour goal)

            const progress = getDailyProgress();
            expect(progress).toBe(100);
        });
    });

    describe('Goal Management', () => {
        it('sets daily goal correctly', () => {
            const { setDailyGoal } = useTimerStore.getState();

            setDailyGoal(360); // 6 hours

            const state = useTimerStore.getState();
            expect(state.dailyGoal).toBe(360);
        });

        it('sets weekly goal correctly', () => {
            const { setWeeklyGoal } = useTimerStore.getState();

            setWeeklyGoal(2000); // ~33 hours

            const state = useTimerStore.getState();
            expect(state.weeklyGoal).toBe(2000);
        });

        it('updates daily time correctly', () => {
            const { updateDailyTime } = useTimerStore.getState();

            updateDailyTime(120); // 2 hours

            const state = useTimerStore.getState();
            expect(state.dailyTime).toBe(120);
        });

        it('updates weekly time correctly', () => {
            const { updateWeeklyTime } = useTimerStore.getState();

            updateWeeklyTime(600); // 10 hours

            const state = useTimerStore.getState();
            expect(state.weeklyTime).toBe(600);
        });
    });

    describe('Filtering', () => {
        beforeEach(() => {
            const sessions: TimeSession[] = [
                {
                    id: '1',
                    projectId: 'project-1',
                    startTime: new Date(),
                    duration: 1800000,
                    xpEarned: 30,
                },
                {
                    id: '2',
                    projectId: 'project-2',
                    startTime: new Date(),
                    duration: 3600000,
                    xpEarned: 60,
                },
                {
                    id: '3',
                    taskId: 'task-1',
                    startTime: new Date(),
                    duration: 1200000,
                    xpEarned: 20,
                },
            ];

            useTimerStore.setState({ sessions });
        });

        it('gets sessions by project correctly', () => {
            const { getSessionsByProject } = useTimerStore.getState();

            const projectSessions = getSessionsByProject('project-1');
            expect(projectSessions).toHaveLength(1);
            expect(projectSessions[0].projectId).toBe('project-1');
        });

        it('gets sessions by task correctly', () => {
            const { getSessionsByTask } = useTimerStore.getState();

            const taskSessions = getSessionsByTask('task-1');
            expect(taskSessions).toHaveLength(1);
            expect(taskSessions[0].taskId).toBe('task-1');
        });
    });

    describe('Timer Recovery', () => {
        it('recovers running timer after page refresh', () => {
            const { recoverTimer } = useTimerStore.getState();
            
            // Simulate a timer that was running before page refresh
            const sessionStartTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
            const lastStartTime = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
            
            useTimerStore.setState({
                activeSession: {
                    id: 'recovery-session',
                    startTime: sessionStartTime,
                    duration: 0,
                    xpEarned: 0,
                },
                isRunning: true,
                isPaused: false,
                startTime: lastStartTime,
                elapsedTime: 5 * 60 * 1000, // 5 minutes already elapsed
            });

            recoverTimer();

            const state = useTimerStore.getState();
            expect(state.isRunning).toBe(true);
            expect(state.elapsedTime).toBe(10 * 60 * 1000); // Should include time since page refresh
            expect(state.startTime).toBeInstanceOf(Date);
        });

        it('recovers paused timer correctly', () => {
            const { recoverTimer } = useTimerStore.getState();
            
            const sessionStartTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
            
            useTimerStore.setState({
                activeSession: {
                    id: 'paused-session',
                    startTime: sessionStartTime,
                    duration: 0,
                    xpEarned: 0,
                },
                isRunning: false,
                isPaused: true,
                startTime: null,
                elapsedTime: 10 * 60 * 1000, // 10 minutes elapsed before pause
            });

            recoverTimer();

            const state = useTimerStore.getState();
            expect(state.isPaused).toBe(true);
            expect(state.isRunning).toBe(false);
            expect(state.elapsedTime).toBe(10 * 60 * 1000); // Should remain unchanged
            expect(state.startTime).toBe(null);
        });

        it('stops timer if session is too old (over 24 hours)', () => {
            const { recoverTimer, stopTimer } = useTimerStore.getState();
            
            // Mock stopTimer to track if it was called
            const stopTimerSpy = vi.fn();
            useTimerStore.setState({
                activeSession: {
                    id: 'old-session',
                    startTime: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
                    duration: 0,
                    xpEarned: 0,
                },
                isRunning: true,
                isPaused: false,
                startTime: new Date(Date.now() - 25 * 60 * 60 * 1000),
                elapsedTime: 0,
            });

            // Replace stopTimer with spy
            const originalStopTimer = useTimerStore.getState().stopTimer;
            useTimerStore.setState({ stopTimer: stopTimerSpy });

            recoverTimer();

            expect(stopTimerSpy).toHaveBeenCalled();
            
            // Restore original stopTimer
            useTimerStore.setState({ stopTimer: originalStopTimer });
        });

        it('does nothing when no active session exists', () => {
            const { recoverTimer } = useTimerStore.getState();
            
            useTimerStore.setState({
                activeSession: null,
                isRunning: false,
                isPaused: false,
                startTime: null,
                elapsedTime: 0,
            });

            const stateBefore = useTimerStore.getState();
            recoverTimer();
            const stateAfter = useTimerStore.getState();

            expect(stateAfter).toEqual(stateBefore);
        });

        it('handles edge case where startTime is null but timer is running', () => {
            const { recoverTimer } = useTimerStore.getState();
            
            useTimerStore.setState({
                activeSession: {
                    id: 'edge-case-session',
                    startTime: new Date(Date.now() - 5 * 60 * 1000),
                    duration: 0,
                    xpEarned: 0,
                },
                isRunning: true,
                isPaused: false,
                startTime: null, // Edge case: running but no startTime
                elapsedTime: 3 * 60 * 1000,
            });

            recoverTimer();

            const state = useTimerStore.getState();
            // Should handle gracefully without crashing
            expect(state.activeSession).toBeTruthy();
        });
    });
});