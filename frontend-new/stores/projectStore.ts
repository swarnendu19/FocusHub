/**
 * Project Store
 *
 * Zustand store for managing projects and tasks.
 */

import { create } from "zustand";
import type { Project, Task, ProjectFilter, TaskFilter, Tag } from "@/types";

interface ProjectStore {
  // State
  projects: Project[];
  tasks: Task[];
  tags: Tag[];
  selectedProjectId: string | null;
  selectedProject: Project | null;
  selectedTaskId: string | null;
  projectFilter: ProjectFilter;
  taskFilter: TaskFilter;
  isLoading: boolean;
  error: string | null;

  // Project actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  removeProject: (id: string) => void; // Alias for deleteProject
  selectProject: (id: string | null) => void;
  setSelectedProject: (project: Project | null) => void;

  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  removeTask: (id: string) => void; // Alias for deleteTask
  selectTask: (id: string | null) => void;

  // Tag actions
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;

  // Filter actions
  setProjectFilter: (filter: Partial<ProjectFilter>) => void;
  setTaskFilter: (filter: Partial<TaskFilter>) => void;
  clearFilters: () => void;

  // Utility actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Computed
  getProjectById: (id: string) => Project | undefined;
  getTaskById: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getActiveProjects: () => Project[];
  getFilteredProjects: (filter?: ProjectFilter) => Project[];
  getFilteredTasks: (filter?: TaskFilter) => Task[];
}

const initialFilter: ProjectFilter = {
  status: undefined,
  tags: undefined,
  search: undefined,
  sortBy: "created",
  sortOrder: "desc",
};

const initialTaskFilter: TaskFilter = {
  projectId: undefined,
  status: undefined,
  priority: undefined,
  tags: undefined,
  search: undefined,
  sortBy: "created",
  sortOrder: "desc",
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  projects: [],
  tasks: [],
  tags: [],
  selectedProjectId: null,
  selectedProject: null,
  selectedTaskId: null,
  projectFilter: initialFilter,
  taskFilter: initialTaskFilter,
  isLoading: false,
  error: null,

  // Project actions
  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.projectId !== id),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
      selectedProject: state.selectedProjectId === id ? null : state.selectedProject,
    })),

  removeProject: (id) => {
    // Alias for deleteProject
    get().deleteProject(id);
  },

  selectProject: (id) => {
    const project = id ? get().getProjectById(id) : null;
    set({ selectedProjectId: id, selectedProject: project || null });
  },

  setSelectedProject: (project) => {
    set({
      selectedProject: project,
      selectedProjectId: project?.id || null,
    });
  },

  // Task actions
  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    })),

  removeTask: (id) => {
    // Alias for deleteTask
    get().deleteTask(id);
  },

  selectTask: (id) => set({ selectedTaskId: id }),

  // Tag actions
  setTags: (tags) => set({ tags }),

  addTag: (tag) =>
    set((state) => ({
      tags: [...state.tags, tag],
    })),

  // Filter actions
  setProjectFilter: (filter) =>
    set((state) => ({
      projectFilter: { ...state.projectFilter, ...filter },
    })),

  setTaskFilter: (filter) =>
    set((state) => ({
      taskFilter: { ...state.taskFilter, ...filter },
    })),

  clearFilters: () =>
    set({
      projectFilter: initialFilter,
      taskFilter: initialTaskFilter,
    }),

  // Utility actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),

  // Computed getters
  getProjectById: (id) => get().projects.find((p) => p.id === id),

  getTaskById: (id) => get().tasks.find((t) => t.id === id),

  getTasksByProject: (projectId) =>
    get().tasks.filter((t) => t.projectId === projectId),

  getActiveProjects: () =>
    get().projects.filter((p) => p.status === "active"),

  getFilteredProjects: (filter) => {
    const { projects, projectFilter } = get();
    const activeFilter = filter || projectFilter;
    let filtered = [...projects];

    // Filter by status
    if (activeFilter.status && activeFilter.status.length > 0) {
      filtered = filtered.filter((p) => activeFilter.status!.includes(p.status));
    }

    // Filter by tags
    if (activeFilter.tags && activeFilter.tags.length > 0) {
      filtered = filtered.filter((p) =>
        activeFilter.tags!.some((tag) => p.tags.includes(tag))
      );
    }

    // Filter by search
    if (activeFilter.search) {
      const search = activeFilter.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search)
      );
    }

    // Sort
    if (activeFilter.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[activeFilter.sortBy as keyof Project];
        const bValue = b[activeFilter.sortBy as keyof Project];

        if (!aValue || !bValue) return 0;
        if (aValue < bValue) return activeFilter.sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return activeFilter.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  },

  getFilteredTasks: (filter) => {
    const { tasks, taskFilter } = get();
    const activeFilter = filter || taskFilter;
    let filtered = [...tasks];

    // Filter by project
    if (activeFilter.projectId) {
      filtered = filtered.filter((t) => t.projectId === activeFilter.projectId);
    }

    // Filter by status
    if (activeFilter.status && activeFilter.status.length > 0) {
      filtered = filtered.filter((t) => activeFilter.status!.includes(t.status));
    }

    // Filter by priority
    if (activeFilter.priority && activeFilter.priority.length > 0) {
      filtered = filtered.filter((t) => activeFilter.priority!.includes(t.priority));
    }

    // Filter by tags
    if (activeFilter.tags && activeFilter.tags.length > 0) {
      filtered = filtered.filter((t) =>
        activeFilter.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    // Filter by search
    if (activeFilter.search) {
      const search = activeFilter.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
      );
    }

    // Sort
    if (activeFilter.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[activeFilter.sortBy as keyof Task];
        const bValue = b[activeFilter.sortBy as keyof Task];

        if (!aValue || !bValue) return 0;
        if (aValue < bValue) return activeFilter.sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return activeFilter.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  },
}));

// Selectors for optimal re-renders
export const selectProjects = (state: ProjectStore) => state.projects;
export const selectTasks = (state: ProjectStore) => state.tasks;
export const selectSelectedProject = (state: ProjectStore) => {
  if (!state.selectedProjectId) return null;
  return state.getProjectById(state.selectedProjectId);
};
export const selectSelectedTask = (state: ProjectStore) => {
  if (!state.selectedTaskId) return null;
  return state.getTaskById(state.selectedTaskId);
};
export const selectFilteredProjects = (state: ProjectStore) => state.getFilteredProjects();
export const selectFilteredTasks = (state: ProjectStore) => state.getFilteredTasks();
export const selectIsLoading = (state: ProjectStore) => state.isLoading;
