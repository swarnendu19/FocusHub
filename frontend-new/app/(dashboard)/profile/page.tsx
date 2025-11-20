/**
 * Profile Page
 *
 * User profile with settings, stats, and activity overview.
 */

"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout";
import { XPBar } from "@/components/gamification/xp";
import { StatCard, HeatMap } from "@/components/visualizations";
import { useAuth, useAchievements, useTimer } from "@/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";

export default function ProfilePage() {
  const { user } = useAuth();
  const { totalXP, currentLevel, achievements, currentStreak } = useAchievements();
  const { sessionHistory } = useTimer();

  const [isEditing, setIsEditing] = React.useState(false);

  // Calculate activity stats
  const stats = React.useMemo(() => {
    const totalSessions = sessionHistory.length;
    const totalTime = sessionHistory.reduce(
      (sum, s) => sum + (s.actualDuration || 0),
      0
    );
    const unlockedAchievements = achievements.filter((a) => a.unlockedAt !== null).length;

    return { totalSessions, totalTime, unlockedAchievements };
  }, [sessionHistory, achievements]);

  // Prepare heatmap data
  const heatmapData = React.useMemo(() => {
    const dataMap = new Map<string, number>();

    sessionHistory.forEach((session) => {
      const date = new Date(session.startTime);
      const dateKey = date.toISOString().split("T")[0];
      dataMap.set(dateKey, (dataMap.get(dateKey) || 0) + 1);
    });

    return Array.from(dataMap.entries()).map(([dateStr, value]) => ({
      date: new Date(dateStr),
      value,
    }));
  }, [sessionHistory]);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] dark:text-white">
            Profile
          </h1>
          <p className="text-[#757373]">
            Manage your profile and view your activity
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center gap-4 lg:w-1/3">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#1C1C1C] to-[#757373] dark:from-white dark:to-[#FAFAFA] text-5xl font-bold text-white dark:text-[#1C1C1C] shadow-lg">
                  {user?.email.charAt(0).toUpperCase() || "?"}
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                    {user?.email || "User"}
                  </h2>
                  <p className="text-sm text-[#757373]">
                    Member since {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Badge variant="default" className="text-sm">
                    Level {currentLevel}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {totalXP.toLocaleString()} XP
                  </Badge>
                </div>

                <Button
                  variant={isEditing ? "outline" : "primary"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {/* Stats & Progress */}
              <div className="flex-1 space-y-6">
                {/* XP Progress */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#1C1C1C] dark:text-white">
                    Level Progress
                  </h3>
                  <XPBar showLabels showNumbers />
                </div>

                {/* Quick Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                  <StatCard
                    label="Total Sessions"
                    value={stats.totalSessions}
                    size="sm"
                  />
                  <StatCard
                    label="Time Tracked"
                    value={Math.floor(stats.totalTime / 3600)}
                    suffix="h"
                    size="sm"
                  />
                  <StatCard
                    label="Achievements"
                    value={stats.unlockedAchievements}
                    size="sm"
                  />
                  <StatCard
                    label="Current Streak"
                    value={currentStreak}
                    suffix=" days"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <HeatMap
              data={heatmapData}
              title="Activity Heatmap"
              description="Your tracking activity over the past 6 months"
              weeks={26}
              colorScheme="green"
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and security
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Display Name (Optional)</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your display name"
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Password and authentication settings
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Password
                    </p>
                    <p className="text-sm text-[#757373]">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-[#757373]">
                      Not enabled
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Achievement Unlocks
                    </p>
                    <p className="text-sm text-[#757373]">
                      Get notified when you unlock achievements
                    </p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Level Up
                    </p>
                    <p className="text-sm text-[#757373]">
                      Celebrate when you reach a new level
                    </p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Timer Reminders
                    </p>
                    <p className="text-sm text-[#757373]">
                      Remind me to track my time
                    </p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Weekly Reports
                    </p>
                    <p className="text-sm text-[#757373]">
                      Receive weekly productivity summaries
                    </p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Theme
                    </p>
                    <p className="text-sm text-[#757373]">
                      Light or dark mode
                    </p>
                  </div>
                  <Badge variant="outline">System</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Animation Effects
                    </p>
                    <p className="text-sm text-[#757373]">
                      Confetti and celebration animations
                    </p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-[#757373]/40 p-4">
                  <div>
                    <p className="font-medium text-[#1C1C1C] dark:text-white">
                      Sound Effects
                    </p>
                    <p className="text-sm text-[#757373]">
                      Play sounds for achievements
                    </p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
