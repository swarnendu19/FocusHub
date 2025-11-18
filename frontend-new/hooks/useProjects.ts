/**
 * useProjects Hook
 *
 * Custom hook for managing projects, tasks, and tags.
 * Provides CRUD operations and state management for project-related data.
 */

"use client";

import { useCallback, useEffect } from "react";
import { useProjectStore } from "@/stores";
import { projectService } from "@/services";
import type {
  Project,
  Task,
  Tag,
  CreateProjectPayload,
  UpdateProjectPayload,
  CreateTaskPayload,
  UpdateTaskPayload,
  ProjectFilters,
  TaskFilters,
} from "@/types";

export function useProjects() {
  // Get state from project store
  const projects = useProjectStore((state) => state.projects);
  const tasks = useProjectStore((state) => state.tasks);
  const tags = useProjectStore((state) => state.tags);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const isLoading = useProjectStore((state) => state.isLoading);
  const error = useProjectStore((state) => state.error);

  // Get actions from project store
  const setProjects = useProjectStore((state) => state.setProjects);
  const addProject = useProjectStore((state) => state.addProject);
  const updateProjectInStore = useProjectStore((state) => state.updateProject);
  const removeProject = useProjectStore((state) => state.removeProject);
  const setTasks = useProjectStore((state) => state.setTasks);
  const addTask = useProjectStore((state) => state.addTask);
  const updateTaskInStore = useProjectStore((state) => state.updateTask);
  const removeTask = useProjectStore((state) => state.removeTask);
  const setTags = useProjectStore((state) => state.setTags);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );
  const setLoading = useProjectStore((state) => state.setLoading);
  const setError = useProjectStore((state) => state.setError);

  /**
   * Fetch all projects
   */
  const fetchProjects = useCallback(
    async (filters?: ProjectFilters) => {
      try {
        setLoading(true);
        setError(null);

        const projectList = await projectService.getAllProjects(filters);
        setProjects(projectList);

        return projectList;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch projects";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setProjects, setLoading, setError]
  );

  /**
   * Fetch a single project by ID
   */
  const fetchProject = useCallback(
    async (projectId: string) => {
      try {
        setLoading(true);
        setError(null);

        const project = await projectService.getProject(projectId);
        setSelectedProject(project);

        return project;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch project";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setSelectedProject, setLoading, setError]
  );

  /**
   * Create a new project
   */
  const createProject = useCallback(
    async (payload: CreateProjectPayload) => {
      try {
        setLoading(true);
        setError(null);

        const newProject = await projectService.createProject(payload);
        addProject(newProject);

        return newProject;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create project";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addProject, setLoading, setError]
  );

  /**
   * Update an existing project
   */
  const updateProject = useCallback(
    async (projectId: string, payload: UpdateProjectPayload) => {
      try {
        setLoading(true);
        setError(null);

        const updatedProject = await projectService.updateProject(
          projectId,
          payload
        );
        updateProjectInStore(projectId, updatedProject);

        return updatedProject;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update project";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateProjectInStore, setLoading, setError]
  );

  /**
   * Delete a project
   */
  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        setLoading(true);
        setError(null);

        await projectService.deleteProject(projectId);
        removeProject(projectId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete project";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [removeProject, setLoading, setError]
  );

  /**
   * Fetch tasks for a project
   */
  const fetchTasks = useCallback(
    async (projectId?: string, filters?: TaskFilters) => {
      try {
        setLoading(true);
        setError(null);

        const taskList = await projectService.getTasks(projectId, filters);
        setTasks(taskList);

        return taskList;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch tasks";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setTasks, setLoading, setError]
  );

  /**
   * Create a new task
   */
  const createTask = useCallback(
    async (payload: CreateTaskPayload) => {
      try {
        setLoading(true);
        setError(null);

        const newTask = await projectService.createTask(payload);
        addTask(newTask);

        return newTask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create task";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addTask, setLoading, setError]
  );

  /**
   * Update an existing task
   */
  const updateTask = useCallback(
    async (taskId: string, payload: UpdateTaskPayload) => {
      try {
        setLoading(true);
        setError(null);

        const updatedTask = await projectService.updateTask(taskId, payload);
        updateTaskInStore(taskId, updatedTask);

        return updatedTask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update task";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateTaskInStore, setLoading, setError]
  );

  /**
   * Delete a task
   */
  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        setLoading(true);
        setError(null);

        await projectService.deleteTask(taskId);
        removeTask(taskId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete task";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [removeTask, setLoading, setError]
  );

  /**
   * Fetch all tags
   */
  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const tagList = await projectService.getTags();
      setTags(tagList);

      return tagList;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tags";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setTags, setLoading, setError]);

  /**
   * Create a new tag
   */
  const createTag = useCallback(
    async (name: string, color?: string) => {
      try {
        setLoading(true);
        setError(null);

        const newTag = await projectService.createTag(name, color);

        // Refresh tags
        await fetchTags();

        return newTag;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create tag";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTags, setLoading, setError]
  );

  /**
   * Get filtered projects
   */
  const getFilteredProjects = useCallback(
    (filters: ProjectFilters) => {
      return useProjectStore.getState().getFilteredProjects(filters);
    },
    []
  );

  /**
   * Get filtered tasks
   */
  const getFilteredTasks = useCallback((filters: TaskFilters) => {
    return useProjectStore.getState().getFilteredTasks(filters);
  }, []);

  /**
   * Get tasks by project ID
   */
  const getTasksByProject = useCallback((projectId: string) => {
    return useProjectStore.getState().getTasksByProject(projectId);
  }, []);

  /**
   * Auto-fetch projects on mount
   */
  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [fetchProjects, projects.length]);

  /**
   * Auto-fetch tags on mount
   */
  useEffect(() => {
    if (tags.length === 0) {
      fetchTags();
    }
  }, [fetchTags, tags.length]);

  return {
    // State
    projects,
    tasks,
    tags,
    selectedProject,
    isLoading,
    error,

    // Project actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,

    // Task actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,

    // Tag actions
    fetchTags,
    createTag,

    // Helpers
    getFilteredProjects,
    getFilteredTasks,
    getTasksByProject,
    setSelectedProject,
  };
}
