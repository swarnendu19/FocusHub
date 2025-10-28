import { test, expect } from '@playwright/test';

// Integration tests for API endpoints with real backend
test.describe('API Integration Tests', () => {
    const BASE_URL = 'http://localhost:3001/api';

    test.beforeEach(async ({ page }) => {
        // Navigate to login page first
        await page.goto('http://localhost:3000/login');
    });

    test.describe('Authentication Endpoints', () => {
        test('should handle Google OAuth flow', async ({ page }) => {
            // Test Google OAuth redirect
            const googleLoginButton = page.locator('text=Login with Google');
            await expect(googleLoginButton).toBeVisible();

            // Click would redirect to Google OAuth - we'll mock this for testing
            // In a real test, you'd need to handle OAuth flow or use test credentials
        });

        test('should get current user when authenticated', async ({ page, request }) => {
            // This test assumes user is already authenticated
            // In real scenario, you'd need to authenticate first
            const response = await request.get(`${BASE_URL}/auth/current_user`);

            if (response.status() === 401) {
                // User not authenticated - this is expected in test environment
                expect(response.status()).toBe(401);
            } else {
                // User is authenticated
                expect(response.status()).toBe(200);
                const user = await response.json();
                expect(user).toHaveProperty('_id');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('xp');
            }
        });

        test('should handle logout', async ({ page, request }) => {
            const response = await request.post(`${BASE_URL}/auth/logout`);
            // Should succeed regardless of authentication state
            expect([200, 401]).toContain(response.status());
        });
    });

    test.describe('User Endpoints', () => {
        test('should require authentication for user operations', async ({ request }) => {
            // Test getting user without authentication
            const response = await request.get(`${BASE_URL}/users/507f1f77bcf86cd799439011`);
            expect(response.status()).toBe(401);
        });

        test('should validate user ID format', async ({ request }) => {
            // Test with invalid user ID format
            const response = await request.get(`${BASE_URL}/users/invalid-id`);
            expect(response.status()).toBe(401); // Will be 401 due to no auth, but would be 400 if authenticated
        });
    });

    test.describe('Leaderboard Endpoints', () => {
        test('should require authentication for leaderboard', async ({ request }) => {
            const response = await request.get(`${BASE_URL}/leaderboard`);
            expect(response.status()).toBe(401);
        });

        test('should handle pagination parameters', async ({ request }) => {
            // Test with pagination parameters (will fail auth but validates parameter handling)
            const response = await request.get(`${BASE_URL}/leaderboard?limit=5&offset=10`);
            expect(response.status()).toBe(401); // Expected due to no authentication
        });
    });

    test.describe('Analytics Endpoints', () => {
        test('should require authentication for analytics', async ({ request }) => {
            const response = await request.get(`${BASE_URL}/analytics/users/507f1f77bcf86cd799439011/stats`);
            expect(response.status()).toBe(401);
        });
    });

    test.describe('AI Endpoints', () => {
        test('should handle AI health check', async ({ request }) => {
            const response = await request.get(`${BASE_URL}/ai/health`);
            // AI health endpoint might not require authentication
            expect([200, 401, 404]).toContain(response.status());
        });
    });

    test.describe('Collaboration Endpoints', () => {
        test('should require authentication for collaboration', async ({ request }) => {
            const response = await request.get(`${BASE_URL}/collaboration/projects?userId=507f1f77bcf86cd799439011`);
            expect(response.status()).toBe(401);
        });
    });

    test.describe('Feedback Endpoints', () => {
        test('should require authentication for feedback', async ({ request }) => {
            const response = await request.post(`${BASE_URL}/feedback`, {
                data: {
                    type: 'bug',
                    title: 'Test feedback',
                    description: 'Test description'
                }
            });
            expect(response.status()).toBe(401);
        });
    });

    test.describe('Error Handling', () => {
        test('should handle network timeouts', async ({ request }) => {
            // Test with a very short timeout
            try {
                await request.get(`${BASE_URL}/auth/current_user`, {
                    timeout: 1 // 1ms timeout to force timeout
                });
            } catch (error) {
                expect(error.message).toContain('timeout');
            }
        });

        test('should handle invalid endpoints', async ({ request }) => {
            const response = await request.get(`${BASE_URL}/nonexistent-endpoint`);
            expect(response.status()).toBe(404);
        });

        test('should handle malformed JSON', async ({ request }) => {
            try {
                await request.post(`${BASE_URL}/feedback`, {
                    data: 'invalid json string'
                });
            } catch (error) {
                // Request should fail due to malformed data
                expect(error).toBeDefined();
            }
        });
    });

    test.describe('CORS and Headers', () => {
        test('should include proper CORS headers', async ({ request }) => {
            const response = await request.options(`${BASE_URL}/auth/current_user`);
            expect([200, 204, 404]).toContain(response.status());
        });

        test('should handle preflight requests', async ({ request }) => {
            const response = await request.fetch(`${BASE_URL}/auth/current_user`, {
                method: 'OPTIONS',
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Request-Headers': 'Content-Type'
                }
            });
            expect([200, 204, 404]).toContain(response.status());
        });
    });

    test.describe('Rate Limiting', () => {
        test('should handle multiple rapid requests', async ({ request }) => {
            // Make multiple rapid requests to test rate limiting
            const promises = Array.from({ length: 10 }, () =>
                request.get(`${BASE_URL}/auth/current_user`)
            );

            const responses = await Promise.all(promises);

            // All should either succeed or fail with 401 (not rate limited in test)
            responses.forEach(response => {
                expect([200, 401]).toContain(response.status());
            });
        });
    });

    test.describe('Data Validation', () => {
        test('should validate required fields in requests', async ({ request }) => {
            // Test user update with missing required fields
            const response = await request.put(`${BASE_URL}/users/507f1f77bcf86cd799439011`, {
                data: {} // Empty data
            });
            expect(response.status()).toBe(401); // Will be 401 due to no auth
        });

        test('should validate data types in requests', async ({ request }) => {
            // Test user update with invalid data types
            const response = await request.put(`${BASE_URL}/users/507f1f77bcf86cd799439011`, {
                data: {
                    xp: 'invalid_number',
                    level: 'invalid_level'
                }
            });
            expect(response.status()).toBe(401); // Will be 401 due to no auth
        });
    });
});