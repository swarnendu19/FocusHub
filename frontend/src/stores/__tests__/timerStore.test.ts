import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTimerStore } from '../timerStore';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)
    }
});

describe('TimerStore', () => {
    beforeEach(() => {
        // Reset store state before each test
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
    });

    it('should initialize with default state', () => {
        const state = useTimerStore.getState();

        expect(state.activeSession).toBeNull();
        expect(state.isRunning).toBe(false);
        expect(state.isPaused).toBe(false);
        expect(state.startTime).toBeNull();
        expect(state.elapsedTime).toBe(0);
        expect(state.sessions).toEqual([]);
        expect(state.dailyGoal).toBe(480);
        expect(state.weeklyGoal).toBe(2400);
    });

    it('should start timer correctly', () => {
        const { startTimer } = useTimerStore.getState();

        startTimer('project-1', 'task-1', 'Test session');

        const state = useTimerStore.getState();
        expect(state.activeSession).not.toBeNull();
        expect(state.activeSession?.projectId).toBe('project-1');
        expect(state.activeSession?.taskId).toBe('task-1');
        expect(state.activeSession?.description).toBe('Test session');
        expect(state.isRunning).toBe(true);
        expect(state.isPaused).toBe(false);
        expect(state.startTime).toBeInstanceOf(Date);
        expect(state.elapsedTime).toBe(0);
    });

    it('should pause timer correctly', () => {
        const { startTimer, pauseTimer } = useTimerStore.getState();

        startTimer('project-1');

        // Simulate some elapsed time before pausing
        useTimerStore.setState({ elapsedTime: 30000 }); // 30 seconds

        pauseTimer();

        const state = useTimerStore.getState();
        expect(state.isRunning).toBe(false);
        expect(state.isPaused).toBe(true);
        expect(state.startTime).toBeNull();
        expect(state.elapsedTime).toBeGreaterThan(0);
    });

    it('should resume timer correctly', () => {
        const { startTimer, pauseTimer, resumeTimer } = useTimerStore.getState();

        startTimer('project-1');
        pauseTimer();
        resumeTimer();

        const state = useTimerStore.getState();
        expect(state.isRunning).toBe(true);
        expect(state.isPaused).toBe(false);
        expect(state.startTime).toBeInstanceOf(Date);
    });

    it('should stop timer and create session', () => {
        const { startTimer, stopTimer } = useTimerStore.getState();

        startTimer('project-1', 'task-1', 'Test session');

        // Simulate some elapsed time
        useTimerStore.setState({ elapsedTime: 60000 }); // 1 minute

        stopTimer();

        const state = useTimerStore.getState();
        expect(state.activeSession).toBeNull();
        expect(state.isRunning).toBe(false);
        expect(state.isPaused).toBe(false);
        expect(state.startTime).toBeNull();
        expect(state.elapsedTime).toBe(0);
        expect(state.sessions).toHaveLength(1);

        const session = state.sessions[0];
        expect(session.projectId).toBe('project-1');
        expect(session.taskId).toBe('task-1');
        expect(session.description).toBe('Test session');
        expect(session.endTime).toBeInstanceOf(Date);
        expect(session.xpEarned).toBeGreaterThan(0);
    });

    it('should set daily and weekly goals', () => {
        const { setDailyGoal, setWeeklyGoal } = useTimerStore.getState();

        setDailyGoal(360); // 6 hours
        setWeeklyGoal(1800); // 30 hours

        const state = useTimerStore.getState();
        expect(state.dailyGoal).toBe(360);
        expect(state.weeklyGoal).toBe(1800);
    });

    it('should calculate daily progress correctly', () => {
        const { setDailyGoal, updateDailyTime, getDailyProgress } = useTimerStore.getState();

        setDailyGoal(480); // 8 hours
        updateDailyTime(240); // 4 hours worked

        const progress = getDailyProgress();
        expect(progress).toBe(50); // 50% progress
    });

    it('should calculate weekly progress correctly', () => {
        const { setWeeklyGoal, updateWeeklyTime, getWeeklyProgress } = useTimerStore.getState();

        setWeeklyGoal(2400); // 40 hours
        updateWeeklyTime(1200); // 20 hours worked

        const progress = getWeeklyProgress();
        expect(progress).toBe(50); // 50% progress
    });

    it('should filter sessions by project', () => {
        const { addSession, getSessionsByProject } = useTimerStore.getState();

        const session1 = {
            id: '1',
            projectId: 'project-1',
            startTime: new Date(),
            duration: 60000,
            xpEarned: 1,
        };

        const session2 = {
            id: '2',
            projectId: 'project-2',
            startTime: new Date(),
            duration: 120000,
            xpEarned: 2,
        };

        addSession(session1);
        addSession(session2);

        const project1Sessions = getSessionsByProject('project-1');
        expect(project1Sessions).toHaveLength(1);
        expect(project1Sessions[0].id).toBe('1');
    });

    it('should filter sessions by task', () => {
        const { addSession, getSessionsByTask } = useTimerStore.getState();

        const session1 = {
            id: '1',
            taskId: 'task-1',
            startTime: new Date(),
            duration: 60000,
            xpEarned: 1,
        };

        const session2 = {
            id: '2',
            taskId: 'task-2',
            startTime: new Date(),
            duration: 120000,
            xpEarned: 2,
        };

        addSession(session1);
        addSession(session2);

        const task1Sessions = getSessionsByTask('task-1');
        expect(task1Sessions).toHaveLength(1);
        expect(task1Sessions[0].id).toBe('1');
    });

    it('should calculate average session length', () => {
        const { addSession, getAverageSessionLength } = useTimerStore.getState();

        addSession({
            id: '1',
            startTime: new Date(),
            duration: 60000, // 1 minute
            xpEarned: 1,
        });

        addSession({
            id: '2',
            startTime: new Date(),
            duration: 120000, // 2 minutes
            xpEarned: 2,
        });

        const averageLength = getAverageSessionLength();
        expect(averageLength).toBe(90000); // 1.5 minutes average
    });

    it('should update and delete sessions', () => {
        const { addSession, updateSession, deleteSession } = useTimerStore.getState();

        const session = {
            id: '1',
            startTime: new Date(),
            duration: 60000,
            xpEarned: 1,
            description: 'Original description',
        };

        addSession(session);

        // Update session
        updateSession('1', { description: 'Updated description' });

        let state = useTimerStore.getState();
        expect(state.sessions[0].description).toBe('Updated description');

        // Delete session
        deleteSession('1');

        state = useTimerStore.getState();
        expect(state.sessions).toHaveLength(0);
    });

    it('should clear all sessions', () => {
        const { addSession, clearSessions } = useTimerStore.getState();

        addSession({
            id: '1',
            startTime: new Date(),
            duration: 60000,
            xpEarned: 1,
        });

        addSession({
            id: '2',
            startTime: new Date(),
            duration: 120000,
            xpEarned: 2,
        });

        expect(useTimerStore.getState().sessions).toHaveLength(2);

        clearSessions();

        expect(useTimerStore.getState().sessions).toHaveLength(0);
    });
});