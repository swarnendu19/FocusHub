/**
 * Hooks Barrel Export
 *
 * Central export point for all custom React hooks.
 */

// Core hooks
export { useAuth } from "./useAuth";
export { useTimer } from "./useTimer";
export { useProjects } from "./useProjects";
export { useAchievements } from "./useAchievements";

// Utility hooks
export { useNotifications } from "./useNotifications";
export type { NotificationOptions, NotificationPermission } from "./useNotifications";

export { useLocalStorage } from "./useLocalStorage";

export { useDebounce, useDebouncedCallback } from "./useDebounce";

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsDarkMode,
  usePrefersReducedMotion,
} from "./useMediaQuery";

export { useOnClickOutside } from "./useOnClickOutside";
