/**
 * Global Test Setup
 * 
 * Runs before all tests to set up the testing environment
 */

import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
    console.log('🚀 Starting global test setup...');

    // Create necessary directories
    const authDir = path.join(__dirname, '../../playwright/.auth');
    const resultsDir = path.join(__dirname, '../../test-results');
    const screenshotsDir = path.join(__dirname, '../../test-results/screenshots');

    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Set up authenticated user session
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        console.log('📝 Setting up authenticated user session...');

        // Navigate to the application
        await page.goto(config.projects[0].use?.baseURL || 'http://localhost:5173');

        // Mock authentication by setting cookies/localStorage
        await page.evaluate(() => {
            // Set up mock authentication state
            localStorage.setItem('auth-token', 'mock-auth-token');
            localStorage.setItem('user-id', 'user-123');

            // Set session cookie
            document.cookie = 'session=mock-session-token; path=/; max-age=86400';
        });

        // Save authentication state
        await page.context().storageState({
            path: path.join(authDir, 'user.json')
        });

        console.log('✅ Authentication state saved');

        // Set up test data
        console.log('📊 Setting up test data...');

        // Create mock data files if needed
        const mockDataDir = path.join(__dirname, '../fixtures');
        if (!fs.existsSync(mockDataDir)) {
            fs.mkdirSync(mockDataDir, { recursive: true });
        }

        // Create mock user data
        const mockUserData = {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            picture: 'https://example.com/avatar.jpg',
            xp: 1250,
            level: 5,
            tasksCompleted: 42,
            unlockedBadges: ['first-timer', 'speed-demon'],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Complete project setup',
                    description: 'Set up the initial project structure',
                    completed: false,
                    timeSpent: 3600,
                    deadline: new Date(Date.now() + 86400000).toISOString(),
                },
                {
                    id: 'task-2',
                    title: 'Write documentation',
                    description: 'Document the API endpoints',
                    completed: true,
                    timeSpent: 7200,
                    deadline: new Date(Date.now() - 86400000).toISOString(),
                },
            ],
            completedTasks: [
                {
                    id: 'task-completed-1',
                    title: 'Initial setup',
                    description: 'Set up development environment',
                    completed: true,
                    timeSpent: 1800,
                    completedAt: new Date(Date.now() - 172800000).toISOString(),
                },
            ],
        };

        fs.writeFileSync(
            path.join(mockDataDir, 'user.json'),
            JSON.stringify(mockUserData, null, 2)
        );

        // Create mock leaderboard data
        const mockLeaderboardData = [
            {
                id: 'user-1',
                name: 'Alice Johnson',
                picture: 'https://example.com/alice.jpg',
                xp: 2500,
                level: 8,
                tasksCompleted: 75,
                rank: 1,
            },
            {
                id: 'user-123',
                name: 'Test User',
                picture: 'https://example.com/avatar.jpg',
                xp: 1250,
                level: 5,
                tasksCompleted: 42,
                rank: 2,
            },
            {
                id: 'user-3',
                name: 'Bob Smith',
                picture: 'https://example.com/bob.jpg',
                xp: 800,
                level: 3,
                tasksCompleted: 28,
                rank: 3,
            },
        ];

        fs.writeFileSync(
            path.join(mockDataDir, 'leaderboard.json'),
            JSON.stringify(mockLeaderboardData, null, 2)
        );

        // Create mock analytics data
        const mockAnalyticsData = {
            totalTimeTracked: 86400,
            averageSessionLength: 3600,
            mostProductiveHour: 14,
            weeklyProgress: [
                { day: 'Mon', hours: 6 },
                { day: 'Tue', hours: 8 },
                { day: 'Wed', hours: 7 },
                { day: 'Thu', hours: 9 },
                { day: 'Fri', hours: 5 },
                { day: 'Sat', hours: 3 },
                { day: 'Sun', hours: 2 },
            ],
        };

        fs.writeFileSync(
            path.join(mockDataDir, 'analytics.json'),
            JSON.stringify(mockAnalyticsData, null, 2)
        );

        console.log('✅ Test data created');

        // Set up environment variables for testing
        process.env.PLAYWRIGHT_TEST_MODE = 'true';
        process.env.MOCK_API_RESPONSES = 'true';

        console.log('🎯 Global setup completed successfully');

    } catch (error) {
        console.error('❌ Global setup failed:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

export default globalSetup;