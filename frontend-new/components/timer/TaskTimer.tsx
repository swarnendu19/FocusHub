/**
 * TaskTimer Component
 *
 * Complete timer component that combines display, controls, and task selection.
 * Can be used standalone or embedded in project/task pages.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useTimer, useProjects } from "@/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  TextArea,
} from "@/components/ui";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";

interface TaskTimerProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Pre-selected project ID
   */
  defaultProjectId?: string;
  /**
   * Pre-selected task ID
   */
  defaultTaskId?: string;
  /**
   * Show project/task selector
   */
  showSelector?: boolean;
  /**
   * Compact mode (smaller display)
   */
  compact?: boolean;
}

export function TaskTimer({
  className,
  defaultProjectId,
  defaultTaskId,
  showSelector = true,
  compact = false,
}: TaskTimerProps) {
  const { timerState, currentTimer } = useTimer();
  const { projects } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = React.useState<
    string | undefined
  >(defaultProjectId || currentTimer?.projectId || undefined);

  const [selectedTaskId, setSelectedTaskId] = React.useState<
    string | undefined
  >(defaultTaskId || currentTimer?.taskId || undefined);

  const [description, setDescription] = React.useState(
    currentTimer?.description || ""
  );

  // Get tasks for selected project
  const selectedProject = React.useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const availableTasks = React.useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.tasks || [];
  }, [selectedProject]);

  // Update state when current timer changes
  React.useEffect(() => {
    if (currentTimer) {
      setSelectedProjectId(currentTimer.projectId || undefined);
      setSelectedTaskId(currentTimer.taskId || undefined);
      setDescription(currentTimer.description || "");
    }
  }, [currentTimer]);

  const isTimerActive = timerState !== "idle";

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{compact ? "Timer" : "Task Timer"}</CardTitle>
        {!compact && (
          <CardDescription>
            Track your time and earn XP for your productivity
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <TimerDisplay size={compact ? "sm" : "md"} />

        {/* Project & Task Selection */}
        {showSelector && !isTimerActive && (
          <div className="space-y-4">
            {/* Project Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C1C1C] dark:text-white">
                Project (Optional)
              </label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                disabled={isTimerActive}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Selector (only if project selected) */}
            {selectedProjectId && availableTasks.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1C1C1C] dark:text-white">
                  Task (Optional)
                </label>
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                  disabled={isTimerActive}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C1C1C] dark:text-white">
                Description (Optional)
              </label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                maxLength={200}
                showCount
                disabled={isTimerActive}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Timer Controls */}
        <TimerControls
          size={compact ? "sm" : "md"}
          projectId={selectedProjectId}
          taskId={selectedTaskId}
          description={description}
        />

        {/* Info Text */}
        {!compact && timerState === "idle" && (
          <p className="text-center text-xs text-[#757373]">
            Start tracking your time to earn XP and unlock achievements
          </p>
        )}
      </CardContent>
    </Card>
  );
}
