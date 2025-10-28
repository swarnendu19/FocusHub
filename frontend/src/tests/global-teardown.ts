/**
 * Global Test Teardown
 * 
 * Runs after all tests to clean up the testing environment
 */

import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
    console.log('🧹 Starting global test teardown...');

    try {
        // Clean up temporary files
        const tempDirs = [
            path.join(__dirname, '../../playwright/.auth'),
            path.join(__dirname, '../fixtures'),
        ];

        for (const dir of tempDirs) {
            if (fs.existsSync(dir)) {
                fs.rmSync(dir, { recursive: true, force: true });
                console.log(`🗑️  Cleaned up ${dir}`);
            }
        }

        // Generate test report summary
        const resultsDir = path.join(__dirname, '../../test-results');
        if (fs.existsSync(resultsDir)) {
            const files = fs.readdirSync(resultsDir);
            const reportFiles = files.filter(file =>
                file.endsWith('.json') || file.endsWith('.xml') || file.endsWith('.html')
            );

            if (reportFiles.length > 0) {
                console.log('📊 Test reports generated:');
                reportFiles.forEach(file => {
                    console.log(`   - ${file}`);
                });
            }

            // Count screenshots
            const screenshotsDir = path.join(resultsDir, 'screenshots');
            if (fs.existsSync(screenshotsDir)) {
                const screenshots = fs.readdirSync(screenshotsDir);
                if (screenshots.length > 0) {
                    console.log(`📸 ${screenshots.length} screenshots captured`);
                }
            }
        }

        // Clean up environment variables
        delete process.env.PLAYWRIGHT_TEST_MODE;
        delete process.env.MOCK_API_RESPONSES;

        // Log test completion statistics
        const endTime = new Date();
        console.log(`⏰ Tests completed at: ${endTime.toISOString()}`);

        // Check for any remaining processes that need cleanup
        if (process.env.CI) {
            console.log('🔄 Running in CI environment - performing additional cleanup');

            // Force garbage collection if available
            if (global.gc) {
                global.gc();
                console.log('🗑️  Forced garbage collection');
            }
        }

        console.log('✅ Global teardown completed successfully');

    } catch (error) {
        console.error('❌ Global teardown failed:', error);
        // Don't throw error in teardown to avoid masking test failures
    }
}

export default globalTeardown;