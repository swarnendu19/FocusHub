/**
 * Timer E2E Tests
 *
 * Tests timer functionality including starting, pausing, and completing sessions.
 */

import { test, expect } from "@playwright/test";

test.describe("Timer Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to projects page
    await page.goto("/");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/projects/);
  });

  test("should display timer component", async ({ page }) => {
    await expect(page.getByText(/timer/i)).toBeVisible();
    await expect(page.getByText(/00:00:00/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /start/i })).toBeVisible();
  });

  test("should start timer", async ({ page }) => {
    // Click start button
    await page.getByRole("button", { name: /start/i }).click();

    // Timer should be running
    await expect(page.getByText(/00:00:0[1-9]/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /stop/i })).toBeVisible();

    // Status badge should show "Running"
    await expect(page.getByText(/running/i)).toBeVisible();
  });

  test("should pause and resume timer", async ({ page }) => {
    // Start timer
    await page.getByRole("button", { name: /start/i }).click();

    // Wait a bit
    await page.waitForTimeout(2000);

    // Pause
    await page.getByRole("button", { name: /pause/i }).click();

    // Should show paused state
    await expect(page.getByText(/paused/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /resume/i })).toBeVisible();

    // Get time when paused
    const pausedTime = await page.textContent('[data-testid="timer-display"]');

    // Wait and ensure time doesn't change
    await page.waitForTimeout(1000);
    const stillPausedTime = await page.textContent(
      '[data-testid="timer-display"]'
    );

    expect(pausedTime).toBe(stillPausedTime);

    // Resume
    await page.getByRole("button", { name: /resume/i }).click();

    // Should be running again
    await expect(page.getByText(/running/i)).toBeVisible();
  });

  test("should stop timer and save session", async ({ page }) => {
    // Start timer
    await page.getByRole("button", { name: /start/i }).click();

    // Wait a bit
    await page.waitForTimeout(2000);

    // Stop
    await page.getByRole("button", { name: /stop/i }).click();

    // Should show success message
    await expect(page.getByText(/session saved/i)).toBeVisible();

    // Timer should reset
    await expect(page.getByText(/00:00:00/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /start/i })).toBeVisible();
  });

  test("should select project before starting timer", async ({ page }) => {
    // Open project dropdown
    await page.getByRole("combobox", { name: /select project/i }).click();

    // Select a project
    await page.getByRole("option", { name: /test project/i }).click();

    // Start timer
    await page.getByRole("button", { name: /start/i }).click();

    // Timer should be running with selected project
    await expect(page.getByText(/test project/i)).toBeVisible();
    await expect(page.getByText(/running/i)).toBeVisible();
  });

  test("should add description to timer session", async ({ page }) => {
    // Fill description
    await page
      .getByPlaceholder(/what are you working on/i)
      .fill("Testing timer functionality");

    // Start timer
    await page.getByRole("button", { name: /start/i }).click();

    // Wait and stop
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: /stop/i }).click();

    // Description should be visible in history
    await expect(page.getByText(/testing timer functionality/i)).toBeVisible();
  });

  test("should show timer history", async ({ page }) => {
    // Navigate to timer history section
    await expect(page.getByText(/recent sessions/i)).toBeVisible();

    // History should show previous sessions
    const historySessions = page.locator('[data-testid="timer-history-item"]');
    await expect(historySessions.first()).toBeVisible();
  });

  test("should earn XP when completing timer session", async ({ page }) => {
    // Get initial XP
    const initialXP = await page
      .locator('[data-testid="user-xp"]')
      .textContent();

    // Start and stop timer
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: /stop/i }).click();

    // Should show XP earned notification
    await expect(page.getByText(/\+.*XP/i)).toBeVisible();

    // XP should increase
    const newXP = await page.locator('[data-testid="user-xp"]').textContent();
    expect(parseInt(newXP!)).toBeGreaterThan(parseInt(initialXP!));
  });

  test("should update statistics after timer session", async ({ page }) => {
    // Get initial session count
    const initialSessions = await page
      .locator('[data-testid="total-sessions"]')
      .textContent();

    // Start and stop timer
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: /stop/i }).click();

    // Session count should increase
    await page.waitForTimeout(500);
    const newSessions = await page
      .locator('[data-testid="total-sessions"]')
      .textContent();

    expect(parseInt(newSessions!)).toBe(parseInt(initialSessions!) + 1);
  });

  test("should persist timer state across page reload", async ({ page }) => {
    // Start timer
    await page.getByRole("button", { name: /start/i }).click();

    // Wait a bit
    await page.waitForTimeout(2000);

    // Reload page
    await page.reload();

    // Timer should still be running
    await expect(page.getByText(/running/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();

    // Time should be close to 2 seconds (allow for reload time)
    const timerText = await page
      .locator('[data-testid="timer-display"]')
      .textContent();
    expect(timerText).toMatch(/00:00:0[2-9]/i);
  });
});

test.describe("Timer Shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
  });

  test("should start timer with keyboard shortcut", async ({ page }) => {
    // Press Ctrl+Space (or Cmd+Space on Mac)
    await page.keyboard.press("Control+Space");

    // Timer should start
    await expect(page.getByText(/running/i)).toBeVisible();
  });

  test("should stop timer with Escape key", async ({ page }) => {
    // Start timer
    await page.getByRole("button", { name: /start/i }).click();

    // Press Escape
    await page.keyboard.press("Escape");

    // Should show confirmation dialog
    await expect(page.getByText(/stop timer/i)).toBeVisible();

    // Confirm
    await page.getByRole("button", { name: /confirm/i }).click();

    // Timer should stop
    await expect(page.getByText(/00:00:00/i)).toBeVisible();
  });
});
