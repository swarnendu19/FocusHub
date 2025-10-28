import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import { createRetryMechanism, type RetryOptions } from '@/utils/retryMechanism';
import { toast } from 'sonner';
import type {
    ApiResponse,
    PaginatedResponse,
    User,
    LeaderboardEntry,
    Project,
    TimeSession,
    Achievement
} from '@/types';

class ApiService {
    private api: AxiosInstance;
    private retryMechanism = createRetryMechanism('api');
    private criticalRetryMechanism = createRetryMechanism('critical');

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:3001/api',
            withCredentials: true, // For session-based authentication
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                // Add request timestamp for debugging
                config.metadata = { startTime: Date.now() };

                // Add offline detection
                if (!navigator.onLine) {
                    return Promise.reject(new Error('No internet connection'));
                }

                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                // Log response time in development
                if (process.env.NODE_ENV === 'development' && response.config.metadata) {
                    const duration = Date.now() - response.config.metadata.startTime;
                    console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`);
                }
                return response;
            },
            (error: AxiosError) => {
                // Enhanced error handling
                this.handleApiError(error);
                return Promise.reject(error);
            }
        );
    }

    private handleApiError(error: AxiosError): void {
        const status = error.response?.status;
        const message = (error.response?.data as any)?.message || error.message;

        // Log error details
        console.error('API Error:', {
            status,
            message,
            url: error.config?.url,
            method: error.config?.method,
            timestamp: new Date().toISOString(),
        });

        // Handle specific error cases
        switch (status) {
            case 401:
                // Unauthorized - redirect to login
                toast.error('Session expired. Please log in again.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
                break;
            case 403:
                // Forbidden
                toast.error('You do not have permission to perform this action.');
                break;
            case 404:
                // Not found
                toast.error('The requested resource was not found.');
                break;
            case 429:
                // Rate limited
                toast.error('Too many requests. Please wait a moment and try again.');
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                // Server errors
                toast.error('Server error. Please try again later.');
                break;
            default:
                if (!navigator.onLine) {
                    toast.error('No internet connection. Please check your network.');
                } else if (error.code === 'ECONNABORTED') {
                    toast.error('Request timed out. Please try again.');
                }
        }
    }

    private async executeWithRetry<T>(
        operation: () => Promise<AxiosResponse<T>>,
        isCritical: boolean = false
    ): Promise<ApiResponse<T>> {
        const retryMechanism = isCritical ? this.criticalRetryMechanism : this.retryMechanism;

        try {
            const response = await retryMechanism.execute(operation);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                status: error.response?.status,
                retryable: this.isRetryableError(error),
            };
        }
    }

    private isRetryableError(error: any): boolean {
        if (!error.response) return true; // Network error
        const status = error.response.status;
        return status >= 500 || status === 408 || status === 429;
    }

    // Generic GET method
    async get<T>(url: string, params?: any, isCritical: boolean = false): Promise<ApiResponse<T>> {
        return this.executeWithRetry(() => this.api.get(url, { params }), isCritical);
    }

    // Generic POST method
    async post<T>(url: string, data?: any, isCritical: boolean = false): Promise<ApiResponse<T>> {
        return this.executeWithRetry(() => this.api.post(url, data), isCritical);
    }

    // Generic PUT method
    async put<T>(url: string, data?: any, isCritical: boolean = false): Promise<ApiResponse<T>> {
        return this.executeWithRetry(() => this.api.put(url, data), isCritical);
    }

    // Generic DELETE method
    async delete<T>(url: string, isCritical: boolean = false): Promise<ApiResponse<T>> {
        return this.executeWithRetry(() => this.api.delete(url), isCritical);
    }

    // Authentication API methods
    auth = {
        getCurrentUser: (): Promise<ApiResponse<User>> =>
            this.get<User>('/auth/current_user'),

        logout: (): Promise<ApiResponse<void>> =>
            this.post<void>('/auth/logout'),

        loginWithGoogle: (): Promise<ApiResponse<{ redirectUrl: string }>> =>
            this.get<{ redirectUrl: string }>('/auth/google'),
    };

    // User API methods
    users = {
        getAll: (params?: { limit?: number; offset?: number }): Promise<ApiResponse<PaginatedResponse<User>>> =>
            this.get<PaginatedResponse<User>>('/users', params),

        getById: (id: string): Promise<ApiResponse<User>> =>
            this.get<User>(`/users/${id}`),

        update: (id: string, data: Partial<User>): Promise<ApiResponse<User>> =>
            this.put<User>(`/users/${id}`, data),

        updateOptIn: (id: string, isOptIn: boolean): Promise<ApiResponse<User>> =>
            this.put<User>(`/users/${id}/opt-in`, { isOptIn }),

        delete: (id: string): Promise<ApiResponse<void>> =>
            this.delete<void>(`/users/${id}`),
    };

    // Leaderboard API methods
    leaderboard = {
        get: (params?: {
            limit?: number;
            offset?: number;
            timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time'
        }): Promise<ApiResponse<PaginatedResponse<LeaderboardEntry>>> =>
            this.get<PaginatedResponse<LeaderboardEntry>>('/leaderboard', params),

        getUserRank: (userId: string): Promise<ApiResponse<{ rank: number; totalUsers: number }>> =>
            this.get<{ rank: number; totalUsers: number }>(`/leaderboard/user/${userId}/rank`),
    };

    // Analytics API methods
    analytics = {
        getUserStats: (userId: string, params?: {
            timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly'
        }): Promise<ApiResponse<{
            totalTime: number;
            sessionsCount: number;
            averageSessionTime: number;
            xpEarned: number;
            tasksCompleted: number;
            streakDays: number;
        }>> =>
            this.get(`/analytics/users/${userId}/stats`, params),

        getTimeDistribution: (userId: string, params?: {
            timeframe?: 'daily' | 'weekly' | 'monthly'
        }): Promise<ApiResponse<Array<{
            date: string;
            totalTime: number;
            sessionsCount: number;
        }>>> =>
            this.get(`/analytics/users/${userId}/time-distribution`, params),

        getProjectStats: (userId: string): Promise<ApiResponse<Array<{
            projectId: string;
            projectName: string;
            totalTime: number;
            sessionsCount: number;
            percentage: number;
        }>>> =>
            this.get(`/analytics/users/${userId}/projects`),

        getGlobalStats: (): Promise<ApiResponse<{
            totalUsers: number;
            totalTime: number;
            totalSessions: number;
            averageSessionTime: number;
        }>> =>
            this.get('/analytics/global'),
    };

    // AI Insights API methods
    ai = {
        getInsights: (userId: string, params?: {
            type?: 'productivity' | 'patterns' | 'recommendations'
        }): Promise<ApiResponse<{
            insights: Array<{
                type: string;
                title: string;
                description: string;
                confidence: number;
                actionable: boolean;
            }>;
            generatedAt: string;
        }>> =>
            this.get(`/ai/insights/${userId}`, params),

        chat: (message: string, context?: {
            userId: string;
            sessionData?: any
        }): Promise<ApiResponse<{
            response: string;
            suggestions?: string[];
            followUpQuestions?: string[];
        }>> =>
            this.post('/ai/chat', { message, context }),

        generateGoals: (userId: string, preferences?: {
            timeframe: 'daily' | 'weekly' | 'monthly';
            focus: 'time' | 'tasks' | 'xp';
        }): Promise<ApiResponse<Array<{
            id: string;
            title: string;
            description: string;
            target: number;
            timeframe: string;
            difficulty: 'easy' | 'medium' | 'hard';
        }>>> =>
            this.post(`/ai/goals/${userId}`, preferences),
    };

    // Collaboration API methods
    collaboration = {
        getProjects: (userId: string): Promise<ApiResponse<Array<Project & {
            collaborators: Array<{
                userId: string;
                username: string;
                role: 'owner' | 'editor' | 'viewer';
                joinedAt: string;
            }>;
            isOwner: boolean;
        }>>> =>
            this.get(`/collaboration/projects?userId=${userId}`),

        createProject: (data: {
            name: string;
            description?: string;
            isPublic: boolean;
            collaborators?: Array<{
                userId: string;
                role: 'editor' | 'viewer';
            }>;
        }): Promise<ApiResponse<Project>> =>
            this.post('/collaboration/projects', data),

        updateProject: (projectId: string, data: Partial<Project>): Promise<ApiResponse<Project>> =>
            this.put(`/collaboration/projects/${projectId}`, data),

        addCollaborator: (projectId: string, data: {
            userId: string;
            role: 'editor' | 'viewer';
        }): Promise<ApiResponse<void>> =>
            this.post(`/collaboration/projects/${projectId}/collaborators`, data),

        removeCollaborator: (projectId: string, userId: string): Promise<ApiResponse<void>> =>
            this.delete(`/collaboration/projects/${projectId}/collaborators/${userId}`),

        leaveProject: (projectId: string): Promise<ApiResponse<void>> =>
            this.delete(`/collaboration/projects/${projectId}/leave`),

        getProjectActivity: (projectId: string, params?: {
            limit?: number;
            offset?: number;
        }): Promise<ApiResponse<Array<{
            id: string;
            userId: string;
            username: string;
            action: string;
            details: any;
            timestamp: string;
        }>>> =>
            this.get(`/collaboration/projects/${projectId}/activity`, params),
    };

    // Feedback API methods
    feedback = {
        submit: (data: {
            type: 'bug' | 'feature' | 'improvement' | 'other';
            title: string;
            description: string;
            priority?: 'low' | 'medium' | 'high';
            attachments?: string[];
            userAgent?: string;
            url?: string;
        }): Promise<ApiResponse<{
            id: string;
            status: 'submitted';
            ticketNumber: string;
        }>> =>
            this.post('/feedback', data),

        getUserFeedback: (userId: string, params?: {
            limit?: number;
            offset?: number;
            status?: 'open' | 'in-progress' | 'resolved' | 'closed';
        }): Promise<ApiResponse<PaginatedResponse<{
            id: string;
            type: string;
            title: string;
            status: string;
            createdAt: string;
            updatedAt: string;
            ticketNumber: string;
        }>>> =>
            this.get(`/feedback/user/${userId}`, params),

        getFeedbackById: (id: string): Promise<ApiResponse<{
            id: string;
            type: string;
            title: string;
            description: string;
            status: string;
            priority: string;
            createdAt: string;
            updatedAt: string;
            ticketNumber: string;
            responses?: Array<{
                id: string;
                message: string;
                isStaff: boolean;
                createdAt: string;
            }>;
        }>> =>
            this.get(`/feedback/${id}`),

        addResponse: (feedbackId: string, message: string): Promise<ApiResponse<void>> =>
            this.post(`/feedback/${feedbackId}/responses`, { message }),
    };

    // Time Sessions API methods (additional utility methods)
    sessions = {
        create: (data: Omit<TimeSession, 'id'>): Promise<ApiResponse<TimeSession>> =>
            this.post('/sessions', data),

        update: (id: string, data: Partial<TimeSession>): Promise<ApiResponse<TimeSession>> =>
            this.put(`/sessions/${id}`, data),

        end: (id: string): Promise<ApiResponse<TimeSession>> =>
            this.put(`/sessions/${id}/end`),

        getUserSessions: (userId: string, params?: {
            limit?: number;
            offset?: number;
            startDate?: string;
            endDate?: string;
        }): Promise<ApiResponse<PaginatedResponse<TimeSession>>> =>
            this.get(`/sessions/user/${userId}`, params),

        delete: (id: string): Promise<ApiResponse<void>> =>
            this.delete(`/sessions/${id}`),
    };

    // Achievements API methods (additional utility methods)
    achievements = {
        getAll: (): Promise<ApiResponse<Achievement[]>> =>
            this.get('/achievements'),

        getUserAchievements: (userId: string): Promise<ApiResponse<Achievement[]>> =>
            this.get(`/achievements/user/${userId}`),

        checkProgress: (userId: string): Promise<ApiResponse<{
            newAchievements: Achievement[];
            updatedProgress: Array<{
                achievementId: string;
                progress: number;
                maxProgress: number;
            }>;
        }>> =>
            this.post(`/achievements/check/${userId}`),
    };
}

export const api = new ApiService();
export const apiService = new ApiService();
export default api;