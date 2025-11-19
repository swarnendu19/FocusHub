/**
 * XP Page
 *
 * Experience points tracking, level progression, and XP history.
 */

"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout";
import { XPBar, XPHistory, XPBreakdown, LevelUpModal } from "@/components/gamification/xp";
import { StatCard, TimeTrackingChart } from "@/components/visualizations";
import { useAchievements, useTimer } from "@/hooks";

export default function XPPage() {
  const { totalXP, currentLevel, xpHistory } = useAchievements();
  const { sessionHistory } = useTimer();
  const [showLevelUpModal, setShowLevelUpModal] = React.useState(false);

  // Calculate XP stats
  const stats = React.useMemo(() => {
    const today = new Date();
    const todayXP = xpHistory.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return (
        transactionDate.getDate() === today.getDate() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    }).reduce((sum, t) => sum + t.amount, 0);

    const thisWeekXP = xpHistory.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return transactionDate >= weekAgo;
    }).reduce((sum, t) => sum + t.amount, 0);

    const thisMonthXP = xpHistory.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return (
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    }).reduce((sum, t) => sum + t.amount, 0);

    const averagePerDay = xpHistory.length > 0
      ? Math.round(totalXP / Math.max(1, Math.ceil((Date.now() - new Date(xpHistory[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))))
      : 0;

    return { todayXP, thisWeekXP, thisMonthXP, averagePerDay };
  }, [xpHistory, totalXP]);

  // Prepare time tracking chart data
  const timeTrackingData = React.useMemo(() => {
    return sessionHistory.map((session) => ({
      date: new Date(session.startTime),
      duration: session.actualDuration || 0,
    }));
  }, [sessionHistory]);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] dark:text-white">
            Experience Points
          </h1>
          <p className="text-[#757373]">
            Track your XP gains and level progression
          </p>
        </div>

        {/* XP Bar */}
        <XPBar showLabels showNumbers size="lg" />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              </svg>
            }
            color="primary"
          />

          <StatCard
            label="Current Level"
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
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            }
            color="success"
          />

          <StatCard
            label="Today's XP"
            value={stats.todayXP}
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />

          <StatCard
            label="Average/Day"
            value={stats.averagePerDay}
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
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            }
          />
        </div>

        {/* Charts and Breakdown Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* XP Breakdown (2 columns) */}
          <div className="space-y-6 lg:col-span-2">
            <TimeTrackingChart
              data={timeTrackingData}
              title="XP Earning Activity"
              description="Your time tracking patterns over the week"
              defaultView="week"
            />

            <XPBreakdown period="week" />
          </div>

          {/* XP History Sidebar (1 column) */}
          <div>
            <XPHistory limit={10} />
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      <LevelUpModal
        open={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        newLevel={currentLevel}
        rewards={[
          "5 Skill Points",
          "New achievement unlocked",
          "10% XP boost for next level",
        ]}
      />
    </PageContainer>
  );
}
