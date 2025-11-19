/**
 * TimerHistory Component
 *
 * Displays a list of past timer sessions with details.
 * Includes filtering, sorting, and pagination.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useTimer } from "@/hooks";
import { formatDuration, formatDate } from "@/utils/format";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import type { TimerSession } from "@/types";

interface TimerHistoryProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Maximum number of sessions to display
   */
  limit?: number;
  /**
   * Show only sessions for a specific project
   */
  projectId?: string;
}

export function TimerHistory({
  className,
  limit,
  projectId,
}: TimerHistoryProps) {
  const { sessionHistory, fetchHistory, isLoading } = useTimer();

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Filter sessions
  const filteredSessions = React.useMemo(() => {
    let sessions = [...sessionHistory];

    // Filter by project if specified
    if (projectId) {
      sessions = sessions.filter((s) => s.projectId === projectId);
    }

    // Sort by date (most recent first)
    sessions.sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      return dateB - dateA;
    });

    // Limit results
    if (limit) {
      sessions = sessions.slice(0, limit);
    }

    return sessions;
  }, [sessionHistory, projectId, limit]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Timer History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredSessions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Timer History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
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
              className="mb-4 h-12 w-12 text-[#757373]"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p className="text-sm text-[#757373]">
              No timer sessions yet. Start your first timer!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Timer History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <TimerSessionItem key={session.id} session={session} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TimerSessionItemProps {
  session: TimerSession;
}

function TimerSessionItem({ session }: TimerSessionItemProps) {
  const duration = session.actualDuration || 0;
  const xpEarned = session.xpEarned || 0;
  const completed = session.completed;

  return (
    <div className="flex items-start justify-between rounded-lg border-2 border-[#757373]/40 p-4 transition-colors hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]/50">
      {/* Left: Session Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          {completed ? (
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
              className="h-5 w-5 text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
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
              className="h-5 w-5 text-[#757373]"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          )}

          <span className="font-medium text-[#1C1C1C] dark:text-white">
            {session.description || "Untitled Session"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#757373]">
          <span>{formatDate(session.startTime, "MMM DD, YYYY")}</span>
          <span>•</span>
          <span>
            {new Date(session.startTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {session.endTime && (
            <>
              <span>-</span>
              <span>
                {new Date(session.endTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {session.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Right: Duration & XP */}
      <div className="ml-4 flex flex-col items-end gap-1">
        <span className="font-mono text-lg font-semibold text-[#1C1C1C] dark:text-white">
          {formatDuration(duration)}
        </span>
        {xpEarned > 0 && (
          <Badge variant="default" className="text-xs">
            +{xpEarned} XP
          </Badge>
        )}
      </div>
    </div>
  );
}
