import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page successfully", async ({ page }) => {
    await page.goto("/");

    // Check if the main heading is visible
    await expect(page.getByRole("heading", { name: /Welcome to FocusHub/i })).toBeVisible();
  });

  test("should display the color palette", async ({ page }) => {
    await page.goto("/");

    // Check if color palette section is visible
    await expect(page.getByRole("heading", { name: /Color Palette/i })).toBeVisible();

    // Verify all 4 colors are displayed
    await expect(page.getByText("#1C1C1C")).toBeVisible();
    await expect(page.getByText("#757373")).toBeVisible();
    await expect(page.getByText("#FFFFFF")).toBeVisible();
    await expect(page.getByText("#FAFAFA")).toBeVisible();
  });

  test("should display UI component examples", async ({ page }) => {
    await page.goto("/");

    // Check if UI components section is visible
    await expect(page.getByRole("heading", { name: /UI Components/i })).toBeVisible();

    // Verify buttons are present
    await expect(page.getByRole("button", { name: /Primary Button/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Secondary Button/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Muted Button/i })).toBeVisible();
  });

  test("should display gamification feature cards", async ({ page }) => {
    await page.goto("/");

    // Check if feature cards are visible
    await expect(page.getByText(/XP System/i)).toBeVisible();
    await expect(page.getByText(/Achievements/i)).toBeVisible();
    await expect(page.getByText(/Skill Trees/i)).toBeVisible();
  });

  test("should be accessible", async ({ page }) => {
    await page.goto("/");

    // Check for main landmark
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
  });

  test("should have correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FocusHub/);
  });
});
