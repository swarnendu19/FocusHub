/**
 * Test Utilities
 *
 * Custom testing utilities and wrappers for component testing.
 */

import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";

/**
 * Custom render with providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock IntersectionObserver
 */
export function mockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve() {}
  } as any;
}

/**
 * Mock ResizeObserver
 */
export function mockResizeObserver() {
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

/**
 * Mock matchMedia
 */
export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create mock achievement
 */
export function createMockAchievement(overrides?: Partial<any>) {
  return {
    id: "test-achievement-1",
    name: "First Timer",
    description: "Complete your first timer session",
    icon: "trophy",
    rarity: "common",
    category: "timers",
    requirements: ["Complete 1 timer session"],
    rewards: { xp: 100, skillPoints: 1 },
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
    ...overrides,
  };
}

/**
 * Create mock user
 */
export function createMockUser(overrides?: Partial<any>) {
  return {
    id: "test-user-1",
    email: "test@example.com",
    createdAt: new Date().toISOString(),
    preferences: {
      theme: "system",
      notifications: true,
      soundEffects: false,
    },
    ...overrides,
  };
}

/**
 * Create mock project
 */
export function createMockProject(overrides?: Partial<any>) {
  return {
    id: "test-project-1",
    name: "Test Project",
    description: "A test project",
    color: "#1C1C1C",
    status: "active",
    tags: ["test"],
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock timer session
 */
export function createMockTimerSession(overrides?: Partial<any>) {
  return {
    id: "test-session-1",
    projectId: "test-project-1",
    taskId: null,
    description: "Test session",
    startTime: new Date().toISOString(),
    endTime: null,
    duration: 0,
    actualDuration: 0,
    status: "idle",
    ...overrides,
  };
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
