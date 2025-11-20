/**
 * Skills Page
 *
 * Skill tree visualization and progression tracking.
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
  Button,
  Badge,
  Progress,
} from "@/components/ui";

export default function SkillsPage() {
  const { skills, availableSkillPoints, isLoading } = useAchievements();

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalSkills = skills.length;
    const unlockedSkills = skills.filter((s) => s.unlocked).length;
    const maxedSkills = skills.filter(
      (s) => s.currentLevel === s.maxLevel
    ).length;
    const totalInvested = skills.reduce(
      (sum, s) => sum + s.currentLevel,
      0
    );

    return { totalSkills, unlockedSkills, maxedSkills, totalInvested };
  }, [skills]);

  // Group skills by category
  const skillsByCategory = React.useMemo(() => {
    const grouped: Record<string, typeof skills> = {};
    skills.forEach((skill) => {
      const category = skill.category || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });
    return grouped;
  }, [skills]);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1C1C1C] dark:text-white">
              Skill Tree
            </h1>
            <p className="text-[#757373]">
              Unlock and upgrade your skills with skill points
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-lg px-4 py-2">
              {availableSkillPoints} Skill Points Available
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total Skills"
            value={stats.totalSkills}
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
                <path d="M12 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                <path d="M12 12.5v7" />
              </svg>
            }
          />

          <StatCard
            label="Unlocked"
            value={stats.unlockedSkills}
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            }
            color="success"
          />

          <StatCard
            label="Maxed Out"
            value={stats.maxedSkills}
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
            color="primary"
          />

          <StatCard
            label="Points Invested"
            value={stats.totalInvested}
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
          />
        </div>

        {/* Skill Categories */}
        {isLoading ? (
          <Card>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
              </div>
            </CardContent>
          </Card>
        ) : Object.keys(skillsByCategory).length === 0 ? (
          <Card>
            <CardContent>
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
                  <path d="M12 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  <path d="M12 12.5v7" />
                </svg>
                <p className="text-sm text-[#757373]">
                  No skills available yet. Level up to unlock skills!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>
                    {categorySkills.filter((s) => s.unlocked).length} of{" "}
                    {categorySkills.length} skills unlocked
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categorySkills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        canUpgrade={availableSkillPoints > 0}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

interface SkillCardProps {
  skill: any;
  canUpgrade: boolean;
}

function SkillCard({ skill, canUpgrade }: SkillCardProps) {
  const isMaxed = skill.currentLevel === skill.maxLevel;
  const progressPercentage = (skill.currentLevel / skill.maxLevel) * 100;

  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${
        skill.unlocked
          ? "border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C]"
          : "border-[#757373]/40 bg-[#FAFAFA] dark:bg-[#1C1C1C]/30 opacity-60"
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-[#1C1C1C] dark:text-white">
              {skill.name}
            </h3>
            <p className="text-xs text-[#757373] mt-1">
              {skill.description}
            </p>
          </div>

          {isMaxed && (
            <Badge variant="default" className="text-xs">
              MAX
            </Badge>
          )}
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#757373]">Level</span>
            <span className="font-semibold text-[#1C1C1C] dark:text-white">
              {skill.currentLevel} / {skill.maxLevel}
            </span>
          </div>

          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!skill.unlocked ? (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              disabled={!canUpgrade}
            >
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Unlock (1 SP)
            </Button>
          ) : !isMaxed ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              disabled={!canUpgrade}
            >
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
                <path d="m18 15-6-6-6 6" />
              </svg>
              Upgrade (1 SP)
            </Button>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 py-2 text-sm text-[#757373]">
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
                className="h-4 w-4 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Maxed Out
            </div>
          )}
        </div>

        {/* Effects */}
        {skill.effects && skill.effects.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-[#757373]/40">
            {skill.effects.map((effect: string, index: number) => (
              <p key={index} className="text-xs text-[#757373]">
                • {effect}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
