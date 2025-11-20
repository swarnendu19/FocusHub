/**
 * Leaderboard Page
 *
 * Global and friend leaderboards with rankings and statistics.
 */

"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout";
import { StatCard } from "@/components/visualizations";
import { useAchievements } from "@/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
} from "@/components/ui";

export default function LeaderboardPage() {
  const { leaderboard, totalXP, currentLevel } = useAchievements();
  const [view, setView] = React.useState<"global" | "friends">("global");

  // Find current user's rank
  const currentUserRank = React.useMemo(() => {
    const index = leaderboard.findIndex((entry) => entry.isCurrentUser);
    return index >= 0 ? index + 1 : null;
  }, [leaderboard]);

  // Get top 3 for podium
  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] dark:text-white">
            Leaderboard
          </h1>
          <p className="text-[#757373]">
            See how you rank against other users
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Your Rank"
            value={currentUserRank || 0}
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
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            }
            color="primary"
            description={currentUserRank ? `Out of ${leaderboard.length} users` : "Not ranked yet"}
          />

          <StatCard
            label="Your Level"
            value={currentLevel}
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
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              </svg>
            }
            color="success"
          />

          <StatCard
            label="Total XP"
            value={totalXP}
            suffix=" XP"
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
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            }
          />
        </div>

        {/* Leaderboard Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Rankings</CardTitle>
                <CardDescription>
                  Top performers this month
                </CardDescription>
              </div>

              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList>
                  <TabsTrigger value="global">Global</TabsTrigger>
                  <TabsTrigger value="friends">Friends</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent>
            {leaderboard.length === 0 ? (
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
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
                <p className="text-sm text-[#757373]">
                  No leaderboard data available yet
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top 3 Podium */}
                {topThree.length > 0 && (
                  <div className="flex items-end justify-center gap-4 pb-6 border-b-2 border-[#757373]/40">
                    {/* 2nd Place */}
                    {topThree[1] && (
                      <PodiumCard
                        entry={topThree[1]}
                        rank={2}
                        height="h-32"
                      />
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                      <PodiumCard
                        entry={topThree[0]}
                        rank={1}
                        height="h-40"
                      />
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                      <PodiumCard
                        entry={topThree[2]}
                        rank={3}
                        height="h-24"
                      />
                    )}
                  </div>
                )}

                {/* Remaining Rankings */}
                <div className="space-y-2">
                  {remaining.map((entry, index) => (
                    <LeaderboardRow
                      key={entry.userId}
                      entry={entry}
                      rank={index + 4}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

interface PodiumCardProps {
  entry: any;
  rank: number;
  height: string;
}

function PodiumCard({ entry, rank, height }: PodiumCardProps) {
  const colors = {
    1: "bg-yellow-400 text-white",
    2: "bg-gray-400 text-white",
    3: "bg-orange-400 text-white",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAFAFA] dark:bg-[#1C1C1C]/50 text-2xl font-bold">
        {entry.username?.charAt(0).toUpperCase() || "?"}
      </div>

      <div className="text-center">
        <p className="font-semibold text-[#1C1C1C] dark:text-white">
          {entry.username}
        </p>
        <p className="text-xs text-[#757373]">
          Level {entry.level} • {entry.xp.toLocaleString()} XP
        </p>
      </div>

      <div className={`flex ${height} w-24 flex-col items-center justify-center rounded-t-lg ${colors[rank as keyof typeof colors]}`}>
        <span className="text-3xl font-bold">{rank}</span>
      </div>
    </div>
  );
}

interface LeaderboardRowProps {
  entry: any;
  rank: number;
}

function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-colors ${
        entry.isCurrentUser
          ? "border-[#1C1C1C] dark:border-white bg-[#FAFAFA] dark:bg-[#1C1C1C]/50"
          : "border-[#757373]/40 hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]/30"
      }`}
    >
      {/* Rank */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#757373]/20 font-semibold text-[#1C1C1C] dark:text-white">
        {rank}
      </div>

      {/* Avatar */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1C1C1C] dark:bg-white text-lg font-bold text-white dark:text-[#1C1C1C]">
        {entry.username?.charAt(0).toUpperCase() || "?"}
      </div>

      {/* User Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[#1C1C1C] dark:text-white">
            {entry.username}
          </p>
          {entry.isCurrentUser && (
            <Badge variant="default" className="text-xs">
              You
            </Badge>
          )}
        </div>
        <p className="text-sm text-[#757373]">
          Level {entry.level} • {entry.achievements} achievements
        </p>
      </div>

      {/* XP */}
      <div className="text-right">
        <p className="text-lg font-bold text-[#1C1C1C] dark:text-white">
          {entry.xp.toLocaleString()}
        </p>
        <p className="text-xs text-[#757373]">XP</p>
      </div>
    </div>
  );
}
