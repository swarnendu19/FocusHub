import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Project, Task } from '@/types';

interface ProjectState {
    projects: Project[];
    activeProject: Project | null;
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    setActiveProject: (project: Project | null) => void;

    // Task actions
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    completeTask: (id: string) => void;

    // Utility actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Computed getters
    getProjectById: (id: string) => Project | undefined;
    getTasksByProject: (projectId: string) => Task[];
    getCompletedTasks: () => Task[];
    getActiveTasks: () => Task[];
    getTotalTimeSpent: () => number;
    getProjectProgress: (projectId: string) => number;
}

export const useProjectStore = create<ProjectState>()(
    devtools(
        persist(
            (set, get) => ({
                projects: [],
                activeProject: null,
                tasks: [],
                isLoading: false,
                error: null,

                setProjects: (projects) => set({ projects, error: null }),

                addProject: (project) => {
                    set((state) => ({
                        projects: [...state.projects, project],
                        error: null,
                    }));
                },

                updateProject: (id, updates) => {
                    set((state) => ({
                        projects: state.projects.map((project) =>
                            project.id === id ? { ...project, ...updates } : project
                        ),
                        activeProject: state.activeProject?.id === id
                            ? { ...state.activeProject, ...updates }
                            : state.activeProject,
                        error: null,
                    }));
                },

                deleteProject: (id) => {
                    set((state) => ({
                        projects: state.projects.filter((project) => project.id !== id),
                        activeProject: state.activeProject?.id === id ? null : state.activeProject,
                        error: null,
                    }));
                },

                setActiveProject: (project) => set({ activeProject: project }),

                setTasks: (tasks) => set({ tasks, error: null }),

                addTask: (task) => {
                    set((state) => ({
                        tasks: [...state.tasks, task],
                        error: null,
                    }));
                },

                updateTask: (id, updates) => {
                    set((state) => ({
                        tasks: state.tasks.map((task) =>
                            task.id === id ? { ...task, ...updates } : task
                        ),
                        error: null,
                    }));
                },

                deleteTask: (id) => {
                    set((state) => ({
                        tasks: state.tasks.filter((task) => task.id !== id),
                        error: null,
                    }));
                },

                completeTask: (id) => {
                    const now = new Date();
                    set((state) => ({
                        tasks: state.tasks.map((task) =>
                            task.id === id
                                ? { ...task, completed: true, completedAt: now }
                                : task
                        ),
                        error: null,
                    }));
                },

                setLoading: (isLoading) => set({ isLoading }),

                setError: (error) => set({ error, isLoading: false }),

                clearError: () => set({ error: null }),

                // Computed getters
                getProjectById: (id) => {
                    return get().projects.find((project) => project.id === id);
                },

                getTasksByProject: (projectId) => {
                    return get().tasks.filter((task) =>
                        // Assuming tasks have a projectId field (might need to add to types)
                        (task as any).projectId === projectId
                    );
                },

                getCompletedTasks: () => {
                    return get().tasks.filter((task) => task.completed);
                },

                getActiveTasks: () => {
                    return get().tasks.filter((task) => !task.completed);
                },

                getTotalTimeSpent: () => {
                    return get().tasks.reduce((total, task) => total + task.timeSpent, 0);
                },

                getProjectProgress: (projectId) => {
                    const project = get().getProjectById(projectId);
                    if (!project || !project.targetTime) return 0;

                    return Math.min((project.totalTime / project.targetTime) * 100, 100);
                },
            }),
            {
                name: 'project-store',
                partialize: (state) => ({
                    projects: state.projects,
                    activeProject: state.activeProject,
                    tasks: state.tasks,
                }),
            }
        ),
        { name: 'ProjectStore' }
    )
);