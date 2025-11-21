/**
 * Authentication E2E Tests
 *
 * Tests user authentication flows including login, registration, and OAuth.
 */

import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display login page", async ({ page }) => {
    await expect(page).toHaveTitle(/FocusHub/);

    // Check for login form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    // Click submit without filling fields
    await page.getByRole("button", { name: /sign in/i }).click();

    // Check for validation messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill("invalid@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");

    // Submit form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Check for error message
    await expect(
      page.getByText(/invalid email or password/i)
    ).toBeVisible();
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    // Fill in valid credentials (mock)
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");

    // Submit form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test("should display Google OAuth button", async ({ page }) => {
    const googleButton = page.getByRole("button", { name: /google/i });
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });

  test("should navigate to registration page", async ({ page }) => {
    await page.getByRole("link", { name: /sign up/i }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByText(/create account/i)).toBeVisible();
  });

  test("should logout successfully", async ({ page }) => {
    // Login first
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Wait for dashboard
    await expect(page).toHaveURL(/\/projects/);

    // Click user menu
    await page.getByRole("button", { name: /profile/i }).click();

    // Click logout
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/\//);
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should persist session across page reloads", async ({ page }) => {
    // Login
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/projects/);

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByText(/projects/i)).toBeVisible();
  });

  test("should handle OAuth redirect flow", async ({ page, context }) => {
    // Click Google OAuth button
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("button", { name: /google/i }).click(),
    ]);

    // OAuth popup should open
    await expect(popup).toHaveURL(/accounts\.google\.com/);

    // Close popup (in real test, this would complete OAuth)
    await popup.close();
  });
});

test.describe("Protected Routes", () => {
  test("should redirect to login when accessing protected route", async ({
    page,
  }) => {
    await page.goto("/projects");

    // Should redirect to login
    await expect(page).toHaveURL(/\//);
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should allow access after authentication", async ({ page }) => {
    // Login first
    await page.goto("/");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Navigate to protected route
    await page.goto("/achievements");

    // Should have access
    await expect(page).toHaveURL(/\/achievements/);
    await expect(page.getByText(/achievements/i)).toBeVisible();
  });
});
