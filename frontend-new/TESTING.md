# Testing Guide

This document provides comprehensive information about the testing setup and best practices for FocusHub.

## Test Stack

- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Coverage**: Vitest Coverage (v8)
- **Accessibility**: axe-core + Playwright
- **Performance**: Lighthouse CI

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests once (CI mode)
bun run test:run

# Run tests with coverage
bun run test:coverage

# Run tests with UI
bun run test:ui
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
bun run test:e2e:headed

# Run specific test project
bun run test:visual          # Visual regression tests
bun run test:performance     # Performance tests
bun run test:accessibility   # Accessibility tests
bun run test:api             # API integration tests
```

### Code Quality

```bash
# Run ESLint
bun run lint

# Auto-fix ESLint issues
bun run lint:fix

# Run TypeScript type check
bun run type-check

# Run all tests (unit + e2e)
bun run test:all
```

### Performance Audits

```bash
# Run Lighthouse CI audit
bun run lighthouse

# Run Lighthouse with custom config
bun run lighthouse:desktop
```

## Writing Unit Tests

Unit tests should be co-located with the code they test using the `.test.ts` or `.test.tsx` suffix.

### Example Component Test

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Example Utility Test

```typescript
import { describe, it, expect } from "vitest";
import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it("should format seconds correctly", () => {
    expect(formatTime(3661)).toBe("1:01:01");
  });
});
```

## Writing E2E Tests

E2E tests should be placed in the `tests/e2e/` directory.

### Example E2E Test

```typescript
import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("should login successfully", async ({ page }) => {
    await page.goto("/login");

    await page.fill('[name="email"]', "user@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
  });
});
```

### Accessibility Testing

```typescript
import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test("should have no accessibility violations", async ({ page }) => {
  await page.goto("/");
  await injectAxe(page);
  await checkA11y(page);
});
```

### Visual Regression Testing

```typescript
import { test, expect } from "@playwright/test";

test("should match visual snapshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("homepage.png");
});
```

## Test Organization

```
tests/
├── e2e/                  # End-to-end tests
│   ├── home.spec.ts
│   ├── auth.spec.ts
│   └── timer.spec.ts
├── performance/          # Performance tests
│   └── core-vitals.spec.ts
├── accessibility/        # A11y tests
│   └── wcag.spec.ts
├── visual/              # Visual regression tests
│   └── components.spec.ts
├── api/                 # API integration tests
│   └── endpoints.spec.ts
└── setup.ts             # Test setup file
```

## Coverage Thresholds

The project maintains the following coverage thresholds:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

## Mocking

### Mocking Next.js Router

```typescript
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
}));
```

### Mocking API Calls

```typescript
import { vi } from "vitest";

vi.mock("@/services/api", () => ({
  fetchUser: vi.fn().mockResolvedValue({
    id: 1,
    name: "Test User",
  }),
}));
```

## Best Practices

### Unit Tests

1. **Test behavior, not implementation**
   - Focus on what the component does, not how it does it
   - Test user-visible behavior

2. **Use data-testid sparingly**
   - Prefer semantic queries (getByRole, getByText)
   - Use data-testid only when necessary

3. **Keep tests isolated**
   - Each test should be independent
   - Clean up after each test

4. **Mock external dependencies**
   - Mock API calls, timers, and browser APIs
   - Use vi.mock() for module mocks

### E2E Tests

1. **Test critical user journeys**
   - Authentication flows
   - Core features (timer, projects, achievements)
   - Payment flows (if applicable)

2. **Use page objects for reusability**
   ```typescript
   class LoginPage {
     constructor(private page: Page) {}

     async login(email: string, password: string) {
       await this.page.fill('[name="email"]', email);
       await this.page.fill('[name="password"]', password);
       await this.page.click('button[type="submit"]');
     }
   }
   ```

3. **Wait for elements properly**
   - Use waitForSelector, waitForLoadState
   - Avoid arbitrary timeouts

4. **Test on multiple browsers**
   - Chromium, Firefox, WebKit
   - Mobile viewports

## Continuous Integration

Tests run automatically on:
- Every pull request
- Main branch commits
- Before deployment

CI configuration checks:
- ✓ ESLint passes
- ✓ TypeScript compiles
- ✓ Unit tests pass
- ✓ E2E tests pass
- ✓ Coverage thresholds met
- ✓ No accessibility violations

## Debugging Tests

### Vitest

```bash
# Run with UI for debugging
bun run test:ui

# Run specific test file
bun run test utils/cn.test.ts

# Run specific test by name
bun run test -t "should format time"
```

### Playwright

```bash
# Run with UI for debugging
bun run test:e2e:ui

# Run in headed mode
bun run test:e2e:headed

# Debug specific test
bun run test:e2e --debug tests/e2e/home.spec.ts
```

## Useful Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)
