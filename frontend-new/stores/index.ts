/**
 * Stores Entry Point
 *
 * Centralized exports for all Zustand stores.
 */

// Timer store
export {
  useTimerStore,
  selectTimerStatus,
  selectCurrentTime,
  selectTotalTime,
  selectProgress,
  selectSessionType,
  selectIsRunning,
} from "./timerStore";

// User/Auth store
export {
  useUserStore,
  selectUser,
  selectIsAuthenticated,
  selectUserStats,
  selectUserPreferences,
  selectIsLoading as selectUserIsLoading,
  selectError as selectUserError,
  selectAccessToken,
} from "./userStore";

// Project store
export {
  useProjectStore,
  selectProjects,
  selectTasks,
  selectSelectedProject,
  selectSelectedTask,
  selectFilteredProjects,
  selectFilteredTasks,
  selectIsLoading as selectProjectIsLoading,
} from "./projectStore";

// Achievement/Gamification store
export {
  useAchievementStore,
  selectAchievements,
  selectUnlockedAchievements,
  selectSkills,
  selectLevelProgression,
  selectLeaderboard,
  selectDailyChallenges,
  selectStreak,
  selectIsLoading as selectAchievementIsLoading,
} from "./achievementStore";
