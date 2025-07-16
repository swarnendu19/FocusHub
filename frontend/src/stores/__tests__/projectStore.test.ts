import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../projectStore';
import type { Project, Task } from '@/types';

const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    description: 'A test project',
    color: '#58CC02',
    icon: 'folder',
    totalTime: 0,
    targetTime: 3600000, // 1 hour in milliseconds
    isActive: true,
    createdAt: new Date(),
    milestones: [],
};

const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'A test task',
    completed: false,
    createdAt: new Date(),
    timeSpent: 0,
    xpReward: 50,
    priority: 'medium',
    tags: ['test'],
};

describe('ProjectStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useProjectStore.setState({
            projects: [],
            activeProject: null,
            tasks: [],
            isLoading: false,
            error: null,
        });
    });

    it('should initialize with default state', () => {
        const state = useProjectStore.getState();

        expect(state.projects).toEqual([]);
        expect(state.activeProject).toBeNull();
        expect(state.tasks).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
    });

    it('should set projects correctly', () => {
        const { setProjects } = useProjectStore.getState();
        const projects = [mockProject];

        setProjects(projects);

        const state = useProjectStore.getState();
        expect(state.projects).toEqual(projects);
        expect(state.error).toBeNull();
    });

    it('should add project correctly', () => {
        const { addProject } = useProjectStore.getState();

        addProject(mockProject);

        const state = useProjectStore.getState();
        expect(state.projects).toHaveLength(1);
        expect(state.projects[0]).toEqual(mockProject);
        expect(state.error).toBeNull();
    });

    it('should update project correctly', () => {
        const { addProject, updateProject } = useProjectStore.getState();

        addProject(mockProject);
        updateProject('1', { name: 'Updated Project', color: '#FF0000' });

        const state = useProjectStore.getState();
        expect(state.projects[0].name).toBe('Updated Project');
        expect(state.projects[0].color).toBe('#FF0000');
        expect(state.projects[0].description).toBe(mockProject.description); // Should remain unchanged
    });

    it('should delete project correctly', () => {
        const { addProject, deleteProject } = useProjectStore.getState();

        addProject(mockProject);
        deleteProject('1');

        const state = useProjectStore.getState();
        expect(state.projects).toHaveLength(0);
    });

    it('should set active project correctly', () => {
        const { setActiveProject } = useProjectStore.getState();

        setActiveProject(mockProject);

        const state = useProjectStore.getState();
        expect(state.activeProject).toEqual(mockProject);
    });

    it('should update active project when project is updated', () => {
        const { addProject, setActiveProject, updateProject } = useProjectStore.getState();

        addProject(mockProject);
        setActiveProject(mockProject);
        updateProject('1', { name: 'Updated Active Project' });

        const state = useProjectStore.getState();
        expect(state.activeProject?.name).toBe('Updated Active Project');
    });

    it('should clear active project when it is deleted', () => {
        const { addProject, setActiveProject, deleteProject } = useProjectStore.getState();

        addProject(mockProject);
        setActiveProject(mockProject);
        deleteProject('1');

        const state = useProjectStore.getState();
        expect(state.activeProject).toBeNull();
    });

    it('should manage tasks correctly', () => {
        const { addTask, updateTask, deleteTask, completeTask } = useProjectStore.getState();

        // Add task
        addTask(mockTask);
        let state = useProjectStore.getState();
        expect(state.tasks).toHaveLength(1);
        expect(state.tasks[0]).toEqual(mockTask);

        // Update task
        updateTask('1', { title: 'Updated Task', priority: 'high' });
        state = useProjectStore.getState();
        expect(state.tasks[0].title).toBe('Updated Task');
        expect(state.tasks[0].priority).toBe('high');

        // Complete task
        completeTask('1');
        state = useProjectStore.getState();
        expect(state.tasks[0].completed).toBe(true);
        expect(state.tasks[0].completedAt).toBeInstanceOf(Date);

        // Delete task
        deleteTask('1');
        state = useProjectStore.getState();
        expect(state.tasks).toHaveLength(0);
    });

    it('should get project by id correctly', () => {
        const { addProject, getProjectById } = useProjectStore.getState();

        addProject(mockProject);

        const foundProject = getProjectById('1');
        expect(foundProject).toEqual(mockProject);

        const notFoundProject = getProjectById('999');
        expect(notFoundProject).toBeUndefined();
    });

    it('should filter completed and active tasks', () => {
        const { addTask, completeTask, getCompletedTasks, getActiveTasks } = useProjectStore.getState();

        const task1 = { ...mockTask, id: '1' };
        const task2 = { ...mockTask, id: '2' };

        addTask(task1);
        addTask(task2);
        completeTask('1');

        const completedTasks = getCompletedTasks();
        const activeTasks = getActiveTasks();

        expect(completedTasks).toHaveLength(1);
        expect(completedTasks[0].id).toBe('1');
        expect(activeTasks).toHaveLength(1);
        expect(activeTasks[0].id).toBe('2');
    });

    it('should calculate total time spent', () => {
        const { addTask, getTotalTimeSpent } = useProjectStore.getState();

        const task1 = { ...mockTask, id: '1', timeSpent: 1800000 }; // 30 minutes
        const task2 = { ...mockTask, id: '2', timeSpent: 3600000 }; // 60 minutes

        addTask(task1);
        addTask(task2);

        const totalTime = getTotalTimeSpent();
        expect(totalTime).toBe(5400000); // 90 minutes total
    });

    it('should calculate project progress correctly', () => {
        const { addProject, getProjectProgress } = useProjectStore.getState();

        const projectWithProgress = {
            ...mockProject,
            totalTime: 1800000, // 30 minutes worked
            targetTime: 3600000, // 60 minutes target
        };

        addProject(projectWithProgress);

        const progress = getProjectProgress('1');
        expect(progress).toBe(50); // 50% progress
    });

    it('should handle project progress without target time', () => {
        const { addProject, getProjectProgress } = useProjectStore.getState();

        const projectWithoutTarget = {
            ...mockProject,
            targetTime: undefined,
        };

        addProject(projectWithoutTarget);

        const progress = getProjectProgress('1');
        expect(progress).toBe(0);
    });

    it('should handle loading and error states', () => {
        const { setLoading, setError, clearError } = useProjectStore.getState();

        // Test loading
        setLoading(true);
        expect(useProjectStore.getState().isLoading).toBe(true);

        // Test error
        setError('Test error');
        let state = useProjectStore.getState();
        expect(state.error).toBe('Test error');
        expect(state.isLoading).toBe(false);

        // Test clear error
        clearError();
        state = useProjectStore.getState();
        expect(state.error).toBeNull();
    });
});