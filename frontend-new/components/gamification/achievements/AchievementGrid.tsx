/**
 * AchievementGrid Component
 *
 * Displays all achievements in a responsive grid layout.
 * Supports filtering, sorting, and category organization.
 */

"use client";

import * as React from "react";
import { cn } from "@/utils";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { AchievementCard } from "./AchievementCard";
import { AchievementModal } from "./AchievementModal";
import type { UserAchievement } from "@/types";

interface AchievementGridProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Card size
   */
  cardSize?: "sm" | "md" | "lg";
  /**
   * Show filters
   */
  showFilters?: boolean;
}

type SortOption = "recent" | "name" | "rarity" | "progress";
type FilterOption = "all" | "unlocked" | "locked";

export function AchievementGrid({
  className,
  cardSize = "md",
  showFilters = true,
}: AchievementGridProps) {
  const { achievements, isLoading } = useAchievements();

  const [selectedAchievement, setSelectedAchievement] =
    React.useState<UserAchievement | null>(null);
  const [sortBy, setSortBy] = React.useState<SortOption>("recent");
  const [filterBy, setFilterBy] = React.useState<FilterOption>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    achievements.forEach((achievement) => {
      if (achievement.achievement.category) {
        cats.add(achievement.achievement.category);
      }
    });
    return ["all", ...Array.from(cats).sort()];
  }, [achievements]);

  // Filter and sort achievements
  const filteredAchievements = React.useMemo(() => {
    let filtered = [...achievements];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.achievement.category === selectedCategory);
    }

    // Filter by unlock status
    if (filterBy === "unlocked") {
      filtered = filtered.filter((a) => a.unlockedAt !== null);
    } else if (filterBy === "locked") {
      filtered = filtered.filter((a) => a.unlockedAt === null);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          if (a.unlockedAt && b.unlockedAt) {
            return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
          }
          if (a.unlockedAt) return -1;
          if (b.unlockedAt) return 1;
          return 0;

        case "name":
          return a.achievement.name.localeCompare(b.achievement.name);

        case "rarity":
          const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
          const aRarity = rarityOrder[a.achievement.rarity?.toLowerCase() as keyof typeof rarityOrder] ?? 0;
          const bRarity = rarityOrder[b.achievement.rarity?.toLowerCase() as keyof typeof rarityOrder] ?? 0;
          return bRarity - aRarity;

        case "progress":
          const aProgress = a.unlockedAt ? 100 : ((a.progress || 0) / (a.achievement.requirement.value || 100)) * 100;
          const bProgress = b.unlockedAt ? 100 : ((b.progress || 0) / (b.achievement.requirement.value || 100)) * 100;
          return bProgress - aProgress;

        default:
          return 0;
      }
    });

    return filtered;
  }, [achievements, selectedCategory, filterBy, sortBy]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter((a) => a.unlockedAt !== null).length;
    const locked = total - unlocked;
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return { total, unlocked, locked, percentage };
  }, [achievements]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            Unlock {stats.total} achievements by completing challenges and milestones
          </CardDescription>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 pt-4">
            <div className="space-y-1 text-center">
              <p className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                {stats.unlocked}
              </p>
              <p className="text-xs text-[#757373]">Unlocked</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                {stats.locked}
              </p>
              <p className="text-xs text-[#757373]">Locked</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                {stats.percentage}%
              </p>
              <p className="text-xs text-[#757373]">Complete</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-2xl font-bold text-[#1C1C1C] dark:text-white">
                {stats.total}
              </p>
              <p className="text-xs text-[#757373]">Total</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters */}
          {showFilters && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Filter Tabs */}
              <Tabs value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                  <TabsTrigger value="locked">Locked</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category Tabs */}
          {categories.length > 1 && (
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Achievement Grid */}
          {filteredAchievements.length === 0 ? (
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
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <p className="text-sm text-[#757373]">
                No achievements found with the selected filters
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                cardSize === "sm" && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                cardSize === "md" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                cardSize === "lg" && "grid-cols-1 md:grid-cols-2"
              )}
            >
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  size={cardSize}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Detail Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        open={selectedAchievement !== null}
        onClose={() => setSelectedAchievement(null)}
      />
    </>
  );
}
