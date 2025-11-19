/**
 * Projects Page
 *
 * Main projects dashboard showing active projects, tasks, and timer.
 */

"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout";
import { TaskTimer, TimerHistory } from "@/components/timer";
import { StatCard } from "@/components/visualizations";
import { useProjects, useTimer } from "@/hooks";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects();
  const { sessionHistory } = useTimer();

  // Calculate stats
  const stats = React.useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const totalTasks = projects.reduce(
      (sum, p) => sum + (p.tasks?.length || 0),
      0
    );
    const completedTasks = projects.reduce(
      (sum, p) =>
        sum + (p.tasks?.filter((t) => t.status === "completed").length || 0),
      0
    );
    const todaysSessions = sessionHistory.filter((s) => {
      const today = new Date();
      const sessionDate = new Date(s.startTime);
      return (
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear()
      );
    }).length;

    return { activeProjects, totalTasks, completedTasks, todaysSessions };
  }, [projects, sessionHistory]);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1C1C1C] dark:text-white">
              Projects
            </h1>
            <p className="text-[#757373]">
              Manage your projects and track your time
            </p>
          </div>

          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Projects"
            value={stats.activeProjects}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            }
            color="primary"
          />

          <StatCard
            label="Total Tasks"
            value={stats.totalTasks}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            }
          />

          <StatCard
            label="Completed Tasks"
            value={stats.completedTasks}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            color="success"
          />

          <StatCard
            label="Today's Sessions"
            value={stats.todaysSessions}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timer Section (2 columns) */}
          <div className="space-y-6 lg:col-span-2">
            <TaskTimer />

            {/* Projects List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-4 h-16 w-16 text-[#757373]"
                    >
                      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      <rect width="20" height="14" x="2" y="6" rx="2" />
                    </svg>
                    <p className="mb-4 text-sm text-[#757373]">
                      No projects yet. Create your first project to get started!
                    </p>
                    <Button>Create Project</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4 transition-colors hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1C1C1C] dark:text-white">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-[#757373]">
                              {project.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              project.status === "active"
                                ? "default"
                                : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (1 column) */}
          <div className="space-y-6">
            <TimerHistory limit={5} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
