/**
 * XPBreakdown Component
 *
 * Shows detailed breakdown of XP sources and statistics.
 * Includes charts and analysis of XP earnings.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useAchievements } from "@/hooks";
import { formatXP, formatPercentage } from "@/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Progress,
} from "@/components/ui";

interface XPBreakdownProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Time period for breakdown
   */
  period?: "day" | "week" | "month" | "all";
}

export function XPBreakdown({
  className,
  period = "week",
}: XPBreakdownProps) {
  const { xpHistory, isLoading } = useAchievements();

  // Calculate XP breakdown by source
  const breakdown = React.useMemo(() => {
    // Filter by period if needed
    const now = new Date();
    const filteredHistory = xpHistory.filter((transaction) => {
      if (period === "all") return true;

      const transactionDate = new Date(transaction.createdAt);
      const diffTime = now.getTime() - transactionDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (period) {
        case "day":
          return diffDays <= 1;
        case "week":
          return diffDays <= 7;
        case "month":
          return diffDays <= 30;
        default:
          return true;
      }
    });

    // Group by source
    const sourceMap: Record<string, number> = {};
    filteredHistory.forEach((transaction) => {
      const source = transaction.source || "other";
      sourceMap[source] = (sourceMap[source] || 0) + transaction.amount;
    });

    // Calculate total for percentage
    const periodTotal = Object.values(sourceMap).reduce((sum, val) => sum + val, 0);

    // Convert to array and sort by amount
    const sources = Object.entries(sourceMap)
      .map(([source, amount]) => ({
        source,
        amount,
        percentage: periodTotal > 0 ? (amount / periodTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { sources, periodTotal };
  }, [xpHistory, period]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>XP Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (breakdown.sources.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>XP Breakdown</CardTitle>
          <CardDescription>
            See where your XP comes from
          </CardDescription>
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
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            <p className="text-sm text-[#757373]">
              No XP earned in this period yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>XP Breakdown</CardTitle>
        <CardDescription>
          {period === "all"
            ? "All-time XP sources"
            : `XP earned in the last ${period === "day" ? "24 hours" : period}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total XP for Period */}
        <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 bg-[#FAFAFA] dark:bg-[#1C1C1C]/50 p-4">
          <span className="text-sm font-medium text-[#1C1C1C] dark:text-white">
            Total XP ({getPeriodLabel(period)})
          </span>
          <span className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
            {formatXP(breakdown.periodTotal)}
          </span>
        </div>

        {/* Source Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
            By Source
          </h3>

          <div className="space-y-3">
            {breakdown.sources.map((source) => (
              <SourceBreakdownItem
                key={source.source}
                source={source.source}
                amount={source.amount}
                percentage={source.percentage}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 rounded-lg border-2 border-[#757373]/40 p-3">
            <p className="text-xs text-[#757373]">Top Source</p>
            <p className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
              {formatSourceName(breakdown.sources[0].source)}
            </p>
          </div>

          <div className="space-y-1 rounded-lg border-2 border-[#757373]/40 p-3">
            <p className="text-xs text-[#757373]">Transactions</p>
            <p className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
              {xpHistory.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SourceBreakdownItemProps {
  source: string;
  amount: number;
  percentage: number;
}

function SourceBreakdownItem({
  source,
  amount,
  percentage,
}: SourceBreakdownItemProps) {
  // Get color based on source type
  const getSourceColor = (src: string): string => {
    switch (src.toLowerCase()) {
      case "timer_complete":
      case "session_complete":
        return "bg-blue-500";
      case "achievement_unlock":
        return "bg-yellow-500";
      case "task_complete":
        return "bg-green-500";
      case "streak_bonus":
        return "bg-orange-500";
      default:
        return "bg-[#757373]";
    }
  };

  return (
    <div className="space-y-2">
      {/* Source Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn("h-3 w-3 rounded-full", getSourceColor(source))}
          />
          <span className="font-medium text-[#1C1C1C] dark:text-white">
            {formatSourceName(source)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#757373]">{formatPercentage(percentage)}</span>
          <span className="font-semibold text-[#1C1C1C] dark:text-white">
            +{amount} XP
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress
        value={percentage}
        className="h-2"
      />
    </div>
  );
}

function formatSourceName(source: string): string {
  return source
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getPeriodLabel(period: string): string {
  switch (period) {
    case "day":
      return "Today";
    case "week":
      return "This Week";
    case "month":
      return "This Month";
    case "all":
      return "All Time";
    default:
      return period;
  }
}
