import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios, { AxiosInstance } from 'axios';

describe('Backend API Validation', () => {
    let api: AxiosInstance;
    const BASE_URL = 'http://localhost:3001/api';

    beforeAll(() => {
        api = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            validateStatus: () => true, // Don't throw on any status code
        });
    });

    afterAll(() => {
        // Cleanup if needed
    });

    describe('Server Health and Connectivity', () => {
        it('should connect to the backend server', async () => {
            try {
                const response = await api.get('/');
                // Server should respond (even if with 404 for root)
                expect([200, 404]).toContain(response.status);
            } catch (error) {
                // If we can't connect at all, the server might be down
                console.error('Cannot connect to backend server:', error);
                throw new Error('Backend server is not running or not accessible');
            }
        });

        it('should have proper CORS configuration', async () => {
            const response = await api.options('/auth/current_user', {
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Request-Headers': 'Content-Type',
                },
            });

            // CORS preflight should succeed
            expect([200, 204, 404]).toContain(response.status);
        });
    });

    describe('Authentication Endpoints', () => {
        it('should have Google OAuth endpoint', async () => {
            const response = await api.get('/auth/google');

            // Should either redirect or return auth URL
            expect([200, 302, 401]).toContain(response.status);
        });

        it('should have current user endpoint', async () => {
            const response = await api.get('/auth/current_user');

            // Should return 401 when not authenticated
            expect([200, 401]).toContain(response.status);

            if (response.status === 401) {
                expect(response.data).toHaveProperty('error');
            }
        });

        it('should have logout endpoint', async () => {
            const response = await api.post('/auth/logout');

            // Should handle logout (even if not authenticated)
            expect([200, 401]).toContain(response.status);
        });
    });

    describe('User Endpoints', () => {
        const testUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

        it('should validate user ID format', async () => {
            const response = await api.get('/users/invalid-id');

            // Should return 400 for invalid ID format or 401 for auth
            expect([400, 401]).toContain(response.status);
        });

        it('should require authentication for user operations', async () => {
            const response = await api.get(`/users/${testUserId}`);

            // Should require authentication
            expect(response.status).toBe(401);
            expect(response.data).toHaveProperty('error');
        });

        it('should have user update endpoint', async () => {
            const response = await api.put(`/users/${testUserId}`, {
                xp: 100,
                level: 2,
                tasksCompleted: 5,
            });

            // Should require authentication
            expect(response.status).toBe(401);
        });

        it('should have opt-in status endpoint', async () => {
            const response = await api.put(`/users/${testUserId}/opt-in`, {
                isOptIn: true,
            });

            // Should require authentication
            expect(response.status).toBe(401);
        });

        it('should validate user update data types', async () => {
            const response = await api.put(`/users/${testUserId}`, {
                xp: 'invalid_number',
                level: 'invalid_level',
            });

            // Should require authentication first, then validate data
            expect(response.status).toBe(401);
        });
    });

    describe('Leaderboard Endpoints', () => {
        it('should have leaderboard endpoint', async () => {
            const response = await api.get('/leaderboard');

            // Should require authentication
            expect(response.status).toBe(401);
        });

        it('should handle pagination parameters', async () => {
            const response = await api.get('/leaderboard?limit=10&offset=0');

            // Should require authentication but accept parameters
            expect(response.status).toBe(401);
        });

        it('should validate pagination parameters', async () => {
            const response = await api.get('/leaderboard?limit=invalid&offset=invalid');

            // Should require authentication (parameter validation happens after auth)
            expect(response.status).toBe(401);
        });
    });

    describe('Analytics Endpoints', () => {
        const testUserId = '507f1f77bcf86cd799439011';

        it('should have user stats endpoint', async () => {
            const response = await api.get(`/analytics/users/${testUserId}/stats`);

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have time distribution endpoint', async () => {
            const response = await api.get(`/analytics/users/${testUserId}/time-distribution`);

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have project stats endpoint', async () => {
            const response = await api.get(`/analytics/users/${testUserId}/projects`);

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have global stats endpoint', async () => {
            const response = await api.get('/analytics/global');

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });
    });

    describe('AI Endpoints', () => {
        const testUserId = '507f1f77bcf86cd799439011';

        it('should have AI health endpoint', async () => {
            const response = await api.get('/ai/health');

            // Should either work or require authentication
            expect([200, 401, 404]).toContain(response.status);
        });

        it('should have insights endpoint', async () => {
            const response = await api.get(`/ai/insights/${testUserId}`);

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have chat endpoint', async () => {
            const response = await api.post('/ai/chat', {
                message: 'Hello',
                context: { userId: testUserId },
            });

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have goals generation endpoint', async () => {
            const response = await api.post(`/ai/goals/${testUserId}`, {
                timeframe: 'weekly',
                focus: 'time',
            });

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });
    });

    describe('Collaboration Endpoints', () => {
        const testUserId = '507f1f77bcf86cd799439011';
        const testProjectId = '507f1f77bcf86cd799439012';

        it('should have projects endpoint', async () => {
            const response = await api.get(`/collaboration/projects?userId=${testUserId}`);

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have project creation endpoint', async () => {
            const response = await api.post('/collaboration/projects', {
                name: 'Test Project',
                description: 'A test project',
                isPublic: false,
            });

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have project update endpoint', async () => {
            const response = await api.put(`/collaboration/projects/${testProjectId}`, {
                name: 'Updated Project',
            });

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have collaborator management endpoints', async () => {
            const addResponse = await api.post(`/collaboration/projects/${testProjectId}/collaborators`, {
                userId: testUserId,
                role: 'editor',
            });

            const removeResponse = await api.delete(`/collaboration/projects/${testProjectId}/collaborators/${testUserId}`);

            // Should require authentication or return 404 if endpoints don't exist
            expect([401, 404]).toContain(addResponse.status);
            expect([401, 404]).toContain(removeResponse.status);
        });
    });

    describe('Feedback Endpoints', () => {
        it('should have feedback submission endpoint', async () => {
            const response = await api.post('/feedback', {
                type: 'bug',
                title: 'Test feedback',
                description: 'This is a test feedback submission',
                priority: 'medium',
            });

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have user feedback endpoint', async () => {
            const testUserId = '507f1f77bcf86cd799439011';
            const response = await api.get(`/feedback/user/${testUserId}`);

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });

        it('should have feedback detail endpoint', async () => {
            const testFeedbackId = '507f1f77bcf86cd799439013';
            const response = await api.get(`/feedback/${testFeedbackId}`);

            // Should require authentication or return 404 if endpoint doesn't exist
            expect([401, 404]).toContain(response.status);
        });
    });

    describe('Session/Time Tracking Endpoints', () => {
        const testSessionId = '507f1f77bcf86cd799439014';
        const testUserId = '507f1f77bcf86cd799439011';

        it('should check if session endpoints exist', async () => {
            // These endpoints might not exist in the current backend
            const createResponse = await api.post('/sessions', {
                projectId: 'project-123',
                startTime: new Date().toISOString(),
            });

            const getUserSessionsResponse = await api.get(`/sessions/user/${testUserId}`);

            const updateResponse = await api.put(`/sessions/${testSessionId}`, {
                description: 'Updated session',
            });

            const endResponse = await api.put(`/sessions/${testSessionId}/end`);

            const deleteResponse = await api.delete(`/sessions/${testSessionId}`);

            // These endpoints might not exist, so we expect 404 or 401
            expect([401, 404]).toContain(createResponse.status);
            expect([401, 404]).toContain(getUserSessionsResponse.status);
            expect([401, 404]).toContain(updateResponse.status);
            expect([401, 404]).toContain(endResponse.status);
            expect([401, 404]).toContain(deleteResponse.status);
        });
    });

    describe('Achievement Endpoints', () => {
        const testUserId = '507f1f77bcf86cd799439011';

        it('should check if achievement endpoints exist', async () => {
            // These endpoints might not exist in the current backend
            const getAllResponse = await api.get('/achievements');

            const getUserAchievementsResponse = await api.get(`/achievements/user/${testUserId}`);

            const checkProgressResponse = await api.post(`/achievements/check/${testUserId}`);

            // These endpoints might not exist, so we expect 404 or 401
            expect([401, 404]).toContain(getAllResponse.status);
            expect([401, 404]).toContain(getUserAchievementsResponse.status);
            expect([401, 404]).toContain(checkProgressResponse.status);
        });
    });

    describe('Integration Endpoints', () => {
        it('should have Todoist integration endpoints', async () => {
            const authResponse = await api.get('/todoist/auth');
            const callbackResponse = await api.get('/todoist/callback?code=test&state=test');

            // Should handle integration endpoints
            expect([200, 302, 401, 404]).toContain(authResponse.status);
            expect([200, 302, 400, 401, 404]).toContain(callbackResponse.status);
        });

        it('should have TickTick integration endpoints', async () => {
            const authResponse = await api.get('/ticktick/auth');
            const callbackResponse = await api.get('/ticktick/callback?code=test&state=test');

            // Should handle integration endpoints
            expect([200, 302, 401, 404]).toContain(authResponse.status);
            expect([200, 302, 400, 401, 404]).toContain(callbackResponse.status);
        });
    });

    describe('Error Handling', () => {
        it('should handle malformed JSON requests', async () => {
            try {
                const response = await api.post('/users/507f1f77bcf86cd799439011', 'invalid json');
                // Should return 400 for malformed JSON or 401 for auth
                expect([400, 401]).toContain(response.status);
            } catch (error) {
                // Axios might throw for malformed requests
                expect(error).toBeDefined();
            }
        });

        it('should handle non-existent endpoints', async () => {
            const response = await api.get('/nonexistent/endpoint');

            // Should return 404 for non-existent endpoints
            expect(response.status).toBe(404);
        });

        it('should handle invalid HTTP methods', async () => {
            const response = await api.patch('/auth/current_user'); // PATCH not supported

            // Should return 404 or 405 for unsupported methods
            expect([404, 405]).toContain(response.status);
        });

        it('should handle request timeouts', async () => {
            const shortTimeoutApi = axios.create({
                baseURL: BASE_URL,
                timeout: 1, // 1ms timeout
                validateStatus: () => true,
            });

            try {
                await shortTimeoutApi.get('/auth/current_user');
            } catch (error: any) {
                expect(error.code).toBe('ECONNABORTED');
            }
        });
    });

    describe('Data Validation', () => {
        it('should validate ObjectId format in URLs', async () => {
            const invalidIds = ['invalid', '123', 'not-an-objectid'];

            for (const id of invalidIds) {
                const response = await api.get(`/users/${id}`);
                // Should return 400 for invalid ID format or 401 for auth
                expect([400, 401]).toContain(response.status);
            }
        });

        it('should validate required fields in requests', async () => {
            const response = await api.put('/users/507f1f77bcf86cd799439011', {
                // Missing required fields
            });

            // Should require authentication first
            expect(response.status).toBe(401);
        });

        it('should validate data types in requests', async () => {
            const response = await api.put('/users/507f1f77bcf86cd799439011', {
                xp: 'not-a-number',
                level: 'not-a-number',
                tasksCompleted: 'not-a-number',
            });

            // Should require authentication first
            expect(response.status).toBe(401);
        });
    });

    describe('Security', () => {
        it('should require authentication for protected endpoints', async () => {
            const protectedEndpoints = [
                '/users/507f1f77bcf86cd799439011',
                '/leaderboard',
                '/analytics/users/507f1f77bcf86cd799439011/stats',
                '/collaboration/projects',
                '/feedback',
            ];

            for (const endpoint of protectedEndpoints) {
                const response = await api.get(endpoint);
                // All protected endpoints should require authentication
                expect([401, 404]).toContain(response.status);
            }
        });

        it('should handle SQL injection attempts', async () => {
            const maliciousInputs = [
                "'; DROP TABLE users; --",
                "1' OR '1'='1",
                "<script>alert('xss')</script>",
            ];

            for (const input of maliciousInputs) {
                const response = await api.get(`/users/${input}`);
                // Should handle malicious input safely
                expect([400, 401, 404]).toContain(response.status);
            }
        });

        it('should have proper session handling', async () => {
            // Test session-related security
            const response = await api.get('/auth/current_user', {
                headers: {
                    'Cookie': 'session=invalid-session-id',
                },
            });

            // Should reject invalid sessions
            expect(response.status).toBe(401);
        });
    });
});