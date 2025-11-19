/**
 * Project API Service
 *
 * API calls for project and task management.
 */

import { get, post, put, del } from "./client";
import { API_ENDPOINTS, replaceUrlParams } from "@/config";
import type {
  Project,
  Task,
  Tag,
  ProjectStatistics,
  ProjectWithDetails,
  TaskWithProject,
  CreateProjectData,
  UpdateProjectData,
  CreateTaskData,
  UpdateTaskData,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

// ========== Projects ==========

/**
 * Get all projects
 */
export async function getProjects(params?: PaginationParams): Promise<PaginatedResponse<Project>> {
  return get<PaginatedResponse<Project>>(API_ENDPOINTS.PROJECTS.LIST, params);
}

/**
 * Get project by ID
 */
export async function getProject(projectId: string): Promise<Project> {
  const url = replaceUrlParams(API_ENDPOINTS.PROJECTS.UPDATE, { id: projectId });
  return get<Project>(url);
}

/**
 * Get project with details (tasks, statistics)
 */
export async function getProjectWithDetails(projectId: string): Promise<ProjectWithDetails> {
  return get<ProjectWithDetails>(`/projects/${projectId}/details`);
}

/**
 * Create new project
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
  return post<Project>(API_ENDPOINTS.PROJECTS.CREATE, data);
}

/**
 * Update project
 */
export async function updateProject(projectId: string, updates: UpdateProjectData): Promise<Project> {
  const url = replaceUrlParams(API_ENDPOINTS.PROJECTS.UPDATE, { id: projectId });
  return put<Project>(url, updates);
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string): Promise<void> {
  const url = replaceUrlParams(API_ENDPOINTS.PROJECTS.DELETE, { id: projectId });
  return del<void>(url);
}

/**
 * Get project statistics
 */
export async function getProjectStatistics(projectId: string): Promise<ProjectStatistics> {
  const url = replaceUrlParams(API_ENDPOINTS.PROJECTS.STATS, { id: projectId });
  return get<ProjectStatistics>(url);
}

/**
 * Archive project
 */
export async function archiveProject(projectId: string): Promise<Project> {
  return post<Project>(`/projects/${projectId}/archive`);
}

/**
 * Unarchive project
 */
export async function unarchiveProject(projectId: string): Promise<Project> {
  return post<Project>(`/projects/${projectId}/unarchive`);
}

// ========== Tasks ==========

/**
 * Get all tasks
 */
export async function getTasks(params?: PaginationParams & { projectId?: string }): Promise<PaginatedResponse<Task>> {
  return get<PaginatedResponse<Task>>("/tasks", params);
}

/**
 * Get task by ID
 */
export async function getTask(taskId: string): Promise<Task> {
  return get<Task>(`/tasks/${taskId}`);
}

/**
 * Get task with project info
 */
export async function getTaskWithProject(taskId: string): Promise<TaskWithProject> {
  return get<TaskWithProject>(`/tasks/${taskId}/with-project`);
}

/**
 * Create new task
 */
export async function createTask(data: CreateTaskData): Promise<Task> {
  return post<Task>("/tasks", data);
}

/**
 * Update task
 */
export async function updateTask(taskId: string, updates: UpdateTaskData): Promise<Task> {
  return put<Task>(`/tasks/${taskId}`, updates);
}

/**
 * Delete task
 */
export async function deleteTask(taskId: string): Promise<void> {
  return del<void>(`/tasks/${taskId}`);
}

/**
 * Complete task
 */
export async function completeTask(taskId: string): Promise<Task> {
  return post<Task>(`/tasks/${taskId}/complete`);
}

/**
 * Reopen task
 */
export async function reopenTask(taskId: string): Promise<Task> {
  return post<Task>(`/tasks/${taskId}/reopen`);
}

// ========== Tags ==========

/**
 * Get all tags
 */
export async function getTags(): Promise<Tag[]> {
  return get<Tag[]>("/tags");
}

/**
 * Create new tag
 */
export async function createTag(data: { name: string; color: string }): Promise<Tag> {
  return post<Tag>("/tags", data);
}

/**
 * Update tag
 */
export async function updateTag(tagId: string, updates: { name?: string; color?: string }): Promise<Tag> {
  return put<Tag>(`/tags/${tagId}`, updates);
}

/**
 * Delete tag
 */
export async function deleteTag(tagId: string): Promise<void> {
  return del<void>(`/tags/${tagId}`);
}

/**
 * Hook-compatible aliases
 */
export const getAllProjects = getProjects;

