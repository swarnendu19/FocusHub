import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { toast } from 'sonner';
import { api } from '../api';

// Mock dependencies
vi.mock('axios');
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        warning: vi.fn(),
    },
}));

const mockedAxios = axios as any;
const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
    },
};

// Mock window.location
const mockLocation = {
    href: '',
};
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
    value: true,
    writable: true,
});

describe('ApiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockedAxios.create.mockReturnValue(mockAxiosInstance);
        navigator.onLine = true;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('initialization', () => {
        it('creates axios instance with correct config', () => {
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: 'http://localhost:3001/api',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });
        });

        it('sets up request and response interceptors', () => {
            expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
            expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
        });
    });

    describe('request interceptor', () => {
        it('adds metadata to request config', () => {
            const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
            const config = { url: '/test' };

            const result = requestInterceptor(config);

            expect(result.metadata).toBeDefined();
            expect(result.metadata.startTime).toBeTypeOf('number');
        });

        it('rejects when offline', () => {
            navigator.onLine = false;
            const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
            const config = { url: '/test' };

            expect(() => requestInterceptor(config)).rejects.toThrow('No internet connection');
        });
    });

    describe('response interceptor', () => {
        it('logs response time in development', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';

            const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => { });
            const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];

            const response = {
                config: {
                    method: 'get',
                    url: '/test',
                    metadata: { startTime: Date.now() - 100 },
                },
            };

            responseInterceptor(response);

            expect(mockConsoleLog).toHaveBeenCalledWith(
                expect.stringContaining('API GET /test:')
            );

            mockConsoleLog.mockRestore();
            process.env.NODE_ENV = originalEnv;
        });

        it('handles 401 errors by redirecting to login', () => {
            const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
            const error = {
                response: { status: 401 },
                config: { url: '/test' },
            };

            errorInterceptor(error);

            expect(toast.error).toHaveBeenCalledWith('Session expired. Please log in again.');

            // Check that redirect is scheduled
            vi.advanceTimersByTime(1000);
            expect(mockLocation.href).toBe('/login');
        });

        it('handles different error status codes', () => {
            const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

            // Test 403
            errorInterceptor({ response: { status: 403 }, config: { url: '/test' } });
            expect(toast.error).toHaveBeenCalledWith('You do not have permission to perform this action.');

            // Test 404
            errorInterceptor({ response: { status: 404 }, config: { url: '/test' } });
            expect(toast.error).toHaveBeenCalledWith('The requested resource was not found.');

            // Test 429
            errorInterceptor({ response: { status: 429 }, config: { url: '/test' } });
            expect(toast.error).toHaveBeenCalledWith('Too many requests. Please wait a moment and try again.');

            // Test 500
            errorInterceptor({ response: { status: 500 }, config: { url: '/test' } });
            expect(toast.error).toHaveBeenCalledWith('Server error. Please try again later.');
        });

        it('handles network errors', () => {
            const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
            navigator.onLine = false;

            const error = { config: { url: '/test' } }; // No response = network error

            errorInterceptor(error);

            expect(toast.error).toHaveBeenCalledWith('No internet connection. Please check your network.');
        });

        it('handles timeout errors', () => {
            const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

            const error = {
                code: 'ECONNABORTED',
                config: { url: '/test' }
            };

            errorInterceptor(error);

            expect(toast.error).toHaveBeenCalledWith('Request timed out. Please try again.');
        });
    });

    describe('HTTP methods with retry', () => {
        it('executes GET request successfully', async () => {
            const mockData = { id: 1, name: 'Test' };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await api.get('/test');

            expect(result).toEqual({
                success: true,
                data: mockData,
            });
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', { params: undefined });
        });

        it('executes POST request successfully', async () => {
            const mockData = { id: 1 };
            const postData = { name: 'Test' };
            mockAxiosInstance.post.mockResolvedValue({ data: mockData });

            const result = await api.post('/test', postData);

            expect(result).toEqual({
                success: true,
                data: mockData,
            });
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData);
        });

        it('executes PUT request successfully', async () => {
            const mockData = { id: 1, updated: true };
            const putData = { name: 'Updated' };
            mockAxiosInstance.put.mockResolvedValue({ data: mockData });

            const result = await api.put('/test/1', putData);

            expect(result).toEqual({
                success: true,
                data: mockData,
            });
            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', putData);
        });

        it('executes DELETE request successfully', async () => {
            const mockData = { deleted: true };
            mockAxiosInstance.delete.mockResolvedValue({ data: mockData });

            const result = await api.delete('/test/1');

            expect(result).toEqual({
                success: true,
                data: mockData,
            });
            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1');
        });

        it('retries on retryable errors', async () => {
            const error = { response: { status: 500, data: { message: 'Server Error' } } };
            mockAxiosInstance.get
                .mockRejectedValueOnce(error)
                .mockRejectedValueOnce(error)
                .mockResolvedValue({ data: { success: true } });

            const resultPromise = api.get('/test');

            // Fast-forward through retry delays
            await vi.advanceTimersByTimeAsync(1000);
            await vi.advanceTimersByTimeAsync(2000);

            const result = await resultPromise;

            expect(result).toEqual({
                success: true,
                data: { success: true },
            });
            expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
        });

        it('fails after max retries', async () => {
            const error = { response: { status: 500, data: { message: 'Server Error' } } };
            mockAxiosInstance.get.mockRejectedValue(error);

            const resultPromise = api.get('/test');

            // Fast-forward through all retry delays
            await vi.advanceTimersByTimeAsync(1000);
            await vi.advanceTimersByTimeAsync(2000);
            await vi.advanceTimersByTimeAsync(4000);

            const result = await resultPromise;

            expect(result).toEqual({
                success: false,
                error: 'Server Error',
                status: 500,
                retryable: true,
            });
            expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
        });

        it('does not retry on non-retryable errors', async () => {
            const error = { response: { status: 400, data: { message: 'Bad Request' } } };
            mockAxiosInstance.get.mockRejectedValue(error);

            const result = await api.get('/test');

            expect(result).toEqual({
                success: false,
                error: 'Bad Request',
                status: 400,
                retryable: false,
            });
            expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
        });

        it('uses critical retry mechanism when specified', async () => {
            const error = { response: { status: 500, data: { message: 'Server Error' } } };
            mockAxiosInstance.post.mockRejectedValue(error);

            const resultPromise = api.post('/critical', {}, true);

            // Critical retry mechanism has 5 attempts with different timing
            await vi.advanceTimersByTimeAsync(500);
            await vi.advanceTimersByTimeAsync(750);
            await vi.advanceTimersByTimeAsync(1125);
            await vi.advanceTimersByTimeAsync(1687);
            await vi.advanceTimersByTimeAsync(2531);

            const result = await resultPromise;

            expect(result.success).toBe(false);
            expect(mockAxiosInstance.post).toHaveBeenCalledTimes(5);
        });
    });

    describe('API endpoints', () => {
        it('calls auth endpoints correctly', async () => {
            mockAxiosInstance.get.mockResolvedValue({ data: { user: 'test' } });

            await api.auth.getCurrentUser();
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/current_user', { params: undefined });

            await api.auth.loginWithGoogle();
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/google', { params: undefined });
        });

        it('calls user endpoints correctly', async () => {
            mockAxiosInstance.get.mockResolvedValue({ data: { users: [] } });
            mockAxiosInstance.put.mockResolvedValue({ data: { user: 'updated' } });

            await api.users.getAll({ limit: 10 });
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', { params: { limit: 10 } });

            await api.users.update('123', { name: 'New Name' });
            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/123', { name: 'New Name' });
        });

        it('calls leaderboard endpoints correctly', async () => {
            mockAxiosInstance.get.mockResolvedValue({ data: { leaderboard: [] } });

            await api.leaderboard.get({ limit: 20, timeframe: 'weekly' });
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/leaderboard', {
                params: { limit: 20, timeframe: 'weekly' }
            });

            await api.leaderboard.getUserRank('123');
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/leaderboard/user/123/rank', { params: undefined });
        });
    });

    describe('error handling edge cases', () => {
        it('handles errors without response data', async () => {
            const error = { message: 'Network Error' };
            mockAxiosInstance.get.mockRejectedValue(error);

            const result = await api.get('/test');

            expect(result).toEqual({
                success: false,
                error: 'Network Error',
                status: undefined,
                retryable: true,
            });
        });

        it('handles errors without message', async () => {
            const error = { response: { status: 500, data: {} } };
            mockAxiosInstance.get.mockRejectedValue(error);

            const result = await api.get('/test');

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('correctly identifies retryable errors', async () => {
            const retryableStatuses = [500, 502, 503, 504, 408, 429];
            const nonRetryableStatuses = [400, 401, 403, 404, 422];

            for (const status of retryableStatuses) {
                const error = { response: { status, data: { message: 'Error' } } };
                mockAxiosInstance.get.mockRejectedValueOnce(error);

                const result = await api.get('/test');
                expect(result.retryable).toBe(true);
            }

            for (const status of nonRetryableStatuses) {
                const error = { response: { status, data: { message: 'Error' } } };
                mockAxiosInstance.get.mockRejectedValueOnce(error);

                const result = await api.get('/test');
                expect(result.retryable).toBe(false);
            }
        });
    });
});