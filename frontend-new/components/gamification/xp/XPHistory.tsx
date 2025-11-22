/**
 * XPHistory Component
 *
 * Displays a timeline of XP transactions and gains.
 * Shows source, amount, and timestamp for each XP event.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useAchievements } from "@/hooks";
import { formatDate } from "@/utils/format";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import type { XPTransaction } from "@/types";

interface XPHistoryProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Maximum number of transactions to display
   */
  limit?: number;
  /**
   * Show only specific source type
   */
  sourceFilter?: string;
}

export function XPHistory({ className, limit, sourceFilter }: XPHistoryProps) {
  const { xpHistory, isLoading } = useAchievements();

  // Filter and limit transactions
  const filteredHistory = React.useMemo(() => {
    let transactions = [...xpHistory];

    // Filter by source if specified
    if (sourceFilter) {
      transactions = transactions.filter((t) => t.source === sourceFilter);
    }

    // Sort by date (most recent first)
    transactions.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Limit results
    if (limit) {
      transactions = transactions.slice(0, limit);
    }

    return transactions;
  }, [xpHistory, sourceFilter, limit]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>XP History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredHistory.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>XP History</CardTitle>
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
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <p className="text-sm text-[#757373]">
              No XP transactions yet. Start tracking time to earn XP!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group transactions by date
  const groupedByDate = filteredHistory.reduce((groups, transaction) => {
    const date = formatDate(transaction.createdAt, "MMM DD, YYYY");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, XPTransaction[]>);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>XP History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, transactions]) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-[#757373]/40" />
                <span className="text-xs font-medium text-[#757373]">{date}</span>
                <div className="h-px flex-1 bg-[#757373]/40" />
              </div>

              {/* Transactions for this date */}
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <XPTransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface XPTransactionItemProps {
  transaction: XPTransaction;
}

function XPTransactionItem({ transaction }: XPTransactionItemProps) {
  const isPositive = transaction.amount > 0;

  // Get icon based on source
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "timer_complete":
      case "session_complete":
        return (
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
        );
      case "achievement_unlock":
        return (
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
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        );
      case "task_complete":
        return (
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
        );
      case "streak_bonus":
        return (
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
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        );
      default:
        return (
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
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-3 transition-colors hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]/50">
      {/* Left: Icon + Description */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            isPositive
              ? "bg-green-100 dark:bg-green-900/20 text-green-600"
              : "bg-red-100 dark:bg-red-900/20 text-red-600"
          )}
        >
          {getSourceIcon(transaction.source)}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-[#1C1C1C] dark:text-white">
            {transaction.description || formatSourceName(transaction.source)}
          </p>
          <p className="text-xs text-[#757373]">
            {new Date(transaction.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Right: XP Amount */}
      <Badge
        variant={isPositive ? "default" : "error"}
        className="text-sm font-semibold"
      >
        {isPositive ? "+" : ""}
        {transaction.amount} XP
      </Badge>
    </div>
  );
}

function formatSourceName(source: string): string {
  return source
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
