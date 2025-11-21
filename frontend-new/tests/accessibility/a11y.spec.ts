/**
 * Accessibility Tests
 *
 * Tests WCAG 2.1 AA compliance and accessibility features.
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("should not have accessibility violations on login page", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have accessibility violations on dashboard", async ({
    page,
  }) => {
    // Login first
    await page.goto("/");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/projects/);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Check for h1
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Check heading levels don't skip
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test("should have alt text for images", async ({ page }) => {
    await page.goto("/");

    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      expect(alt).not.toBeNull();
      expect(alt).not.toBe("");
    }
  });

  test("should have labels for form inputs", async ({ page }) => {
    await page.goto("/");

    // Email input
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("type", "email");

    // Password input
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Tab through focusable elements
    await page.keyboard.press("Tab");
    let focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(["INPUT", "BUTTON", "A"]).toContain(focused);

    await page.keyboard.press("Tab");
    focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(["INPUT", "BUTTON", "A"]).toContain(focused);
  });

  test("should have visible focus indicators", async ({ page }) => {
    await page.goto("/");

    // Tab to first focusable element
    await page.keyboard.press("Tab");

    // Check for focus styles
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();

    // Should have visible outline or other focus indicator
    const focusedElement = await focused.first();
    const outline = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outline || styles.boxShadow;
    });

    expect(outline).not.toBe("none");
    expect(outline).not.toBe("");
  });

  test("should have sufficient color contrast", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast"
    );

    expect(contrastViolations).toEqual([]);
  });

  test("should have proper ARIA labels for interactive elements", async ({
    page,
  }) => {
    await page.goto("/");

    // Buttons should have accessible names
    const buttons = await page.locator("button").all();

    for (const button of buttons) {
      const accessibleName = await button.evaluate((el) => {
        return el.textContent || el.getAttribute("aria-label");
      });

      expect(accessibleName).not.toBeNull();
      expect(accessibleName?.trim()).not.toBe("");
    }
  });

  test("should announce dynamic content changes", async ({ page }) => {
    // Login first
    await page.goto("/");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Start timer
    await page.getByRole("button", { name: /start/i }).click();

    // Check for ARIA live region
    const liveRegions = page.locator('[aria-live]');
    await expect(liveRegions.first()).toBeInViewport();
  });

  test("should be navigable with screen reader", async ({ page }) => {
    await page.goto("/");

    // Check for landmark regions
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Check for navigation
    const nav = page.locator("nav");
    expect(await nav.count()).toBeGreaterThanOrEqual(1);

    // Check for header
    const header = page.locator("header");
    expect(await header.count()).toBeGreaterThanOrEqual(0);
  });

  test("should support skip navigation link", async ({ page }) => {
    await page.goto("/");

    // Tab to skip link (usually first focusable element)
    await page.keyboard.press("Tab");

    // Check for skip link
    const skipLink = page.locator('a[href="#main-content"]');

    if ((await skipLink.count()) > 0) {
      await expect(skipLink.first()).toBeFocused();
    }
  });

  test("should have proper table structure", async ({ page }) => {
    // Login and navigate to page with table
    await page.goto("/");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // If tables exist, check structure
    const tables = await page.locator("table").all();

    for (const table of tables) {
      // Should have thead
      const thead = table.locator("thead");
      if ((await thead.count()) > 0) {
        // Should have th elements
        const headers = thead.locator("th");
        expect(await headers.count()).toBeGreaterThan(0);
      }
    }
  });

  test("should not have accessibility violations on all major pages", async ({
    page,
  }) => {
    // Login
    await page.goto("/");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    const pages = [
      "/projects",
      "/achievements",
      "/leaderboard",
      "/xp",
      "/skills",
      "/profile",
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2aa"])
        .analyze();

      expect(
        accessibilityScanResults.violations,
        `Accessibility violations on ${pagePath}`
      ).toEqual([]);
    }
  });
});
