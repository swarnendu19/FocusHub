/**
 * Playwright Configuration for E2E Testing
 * 
 * Configuration for end-to-end, visual regression, and cross-browser testing
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './src/tests',

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['github'], // GitHub Actions integration
    ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:5173',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',

        /* Take screenshot on failure */
        screenshot: 'only-on-failure',

        /* Record video on failure */
        video: 'retain-on-failure',

        /* Global timeout for each test */
        actionTimeout: 10000,

        /* Global timeout for navigation */
        navigationTimeout: 30000,
    },

    /* Configure projects for major browsers */
    projects: [
        // Setup project for authentication
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },

        // Desktop browsers
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Use prepared auth state
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // Mobile browsers
        {
            name: 'Mobile Chrome',
            use: {
                ...devices['Pixel 5'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        {
            name: 'Mobile Safari',
            use: {
                ...devices['iPhone 12'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // Tablet
        {
            name: 'Tablet',
            use: {
                ...devices['iPad Pro'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // Visual regression testing
        {
            name: 'visual-regression',
            testMatch: /.*visual.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
                // Disable animations for consistent screenshots
                reducedMotion: 'reduce',
            },
            dependencies: ['setup'],
        },

        // Performance testing
        {
            name: 'performance',
            testMatch: /.*performance.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
                // Enable performance monitoring
                launchOptions: {
                    args: ['--enable-precise-memory-info'],
                },
            },
            dependencies: ['setup'],
        },

        // Accessibility testing
        {
            name: 'accessibility',
            testMatch: /.*accessibility.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // Cross-browser compatibility
        {
            name: 'compatibility-chrome',
            testMatch: /.*compatibility.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        {
            name: 'compatibility-firefox',
            testMatch: /.*compatibility.*\.spec\.ts/,
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        {
            name: 'compatibility-safari',
            testMatch: /.*compatibility.*\.spec\.ts/,
            use: {
                ...devices['Desktop Safari'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // API integration testing
        {
            name: 'api-integration',
            testMatch: /.*api-integration.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                // No auth state needed for API tests
            },
        },
    ],

    /* Global setup and teardown */
    globalSetup: require.resolve('./src/tests/global-setup.ts'),
    globalTeardown: require.resolve('./src/tests/global-teardown.ts'),

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },

    /* Test timeout */
    timeout: 30000,

    /* Expect timeout */
    expect: {
        timeout: 5000,
        // Visual comparison threshold
        threshold: 0.2,
        // Animation handling
        toHaveScreenshot: {
            threshold: 0.2,
            animations: 'disabled',
        },
        toMatchSnapshot: {
            threshold: 0.2,
        },
    },

    /* Output directories */
    outputDir: 'test-results/',

    /* Metadata */
    metadata: {
        'test-environment': process.env.NODE_ENV || 'development',
        'base-url': 'http://localhost:5173',
        'browser-versions': {
            chromium: '119.0',
            firefox: '119.0',
            webkit: '17.0',
        },
    },
});