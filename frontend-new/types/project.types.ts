/**
 * Project Types
 *
 * Type definitions for projects, tasks, and tags.
 */

/**
 * Project status enumeration
 */
export enum ProjectStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}

/**
 * Task priority enumeration
 */
export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

/**
 * Task status enumeration
 */
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * Project
 */
export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: ProjectStatus;
  tags: string[];
  totalTimeTracked: number; // in seconds
  estimatedTime?: number; // in seconds
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  completedAt?: Date;
}

/**
 * Task
 */
export interface Task {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  timeTracked: number; // in seconds
  estimatedTime?: number; // in seconds
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tag
 */
export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
  usageCount: number;
  createdAt: Date;
}

/**
 * Project statistics
 */
export interface ProjectStatistics {
  projectId: string;
  totalTimeTracked: number; // in seconds
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  averageTaskDuration: number; // in seconds
  completionRate: number; // percentage
  timeThisWeek: number; // in seconds
  timeThisMonth: number; // in seconds
  lastActivityAt?: Date;
  estimatedCompletion?: Date; // based on velocity
}

/**
 * Project with related data
 */
export interface ProjectWithDetails extends Project {
  tasks: Task[];
  statistics: ProjectStatistics;
}

/**
 * Task with project info
 */
export interface TaskWithProject extends Task {
  project: Project;
}

/**
 * Project filter options
 */
export interface ProjectFilter {
  status?: ProjectStatus[];
  tags?: string[];
  search?: string;
  sortBy?: "name" | "created" | "updated" | "timeTracked";
  sortOrder?: "asc" | "desc";
}

/**
 * Task filter options
 */
export interface TaskFilter {
  projectId?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  tags?: string[];
  search?: string;
  dueDateBefore?: Date;
  dueDateAfter?: Date;
  sortBy?: "title" | "created" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

/**
 * Project creation data
 */
export interface CreateProjectData {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  tags?: string[];
  estimatedTime?: number;
  deadline?: Date;
}

/**
 * Project update data
 */
export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: ProjectStatus;
  tags?: string[];
  estimatedTime?: number;
  deadline?: Date;
}

/**
 * Task creation data
 */
export interface CreateTaskData {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  tags?: string[];
  estimatedTime?: number;
  dueDate?: Date;
}

/**
 * Task update data
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  tags?: string[];
  estimatedTime?: number;
  dueDate?: Date;
}

/**
 * Type guard for active project
 */
export function isActiveProject(project: Project): boolean {
  return project.status === ProjectStatus.ACTIVE;
}

/**
 * Type guard for completed project
 */
export function isCompletedProject(project: Project): boolean {
  return project.status === ProjectStatus.COMPLETED && !!project.completedAt;
}

/**
 * Type guard for overdue task
 */
export function isOverdueTask(task: Task): boolean {
  if (!task.dueDate || task.status === TaskStatus.COMPLETED) {
    return false;
  }
  return new Date(task.dueDate) < new Date();
}

/**
 * Type guard for completed task
 */
export function isCompletedTask(task: Task): boolean {
  return task.status === TaskStatus.COMPLETED && !!task.completedAt;
}

/**
 * Type guard for high priority task
 */
export function isHighPriorityTask(task: Task): boolean {
  return task.priority === TaskPriority.HIGH || task.priority === TaskPriority.URGENT;
}
