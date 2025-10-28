// Main exports for the services module
export { apiService, default as api } from './api';
export * from './types';

// Import apiService to re-export methods
import { apiService } from './api';

// Re-export commonly used API methods for convenience
export const {
    auth,
    users,
    leaderboard,
    analytics,
    ai,
    collaboration,
    feedback,
    sessions,
    achievements,
} = apiService;

// Utility functions for common API operations
export const apiUtils = {
    // Check if response is successful
    isSuccess: <T>(response: { success: boolean; data?: T; error?: string }) => response.success,

    // Extract data from successful response
    getData: <T>(response: { success: boolean; data?: T; error?: string }): T | null =>
        response.success ? response.data || null : null,

    // Extract error from failed response
    getError: (response: { success: boolean; data?: any; error?: string }): string | null =>
        !response.success ? response.error || 'Unknown error occurred' : null,

    // Handle paginated responses
    getPaginatedData: <T>(response: {
        success: boolean;
        data?: {
            data: T[];
            total: number;
            page: number;
            limit: number;
            hasMore: boolean;
        };
        error?: string;
    }) => {
        if (!response.success || !response.data) {
            return {
                items: [] as T[],
                total: 0,
                page: 1,
                limit: 10,
                hasMore: false,
                error: response.error || 'Failed to fetch data',
            };
        }

        return {
            items: response.data.data,
            total: response.data.total,
            page: response.data.page,
            limit: response.data.limit,
            hasMore: response.data.hasMore,
            error: null,
        };
    },

    // Build query parameters for API calls
    buildParams: (params: Record<string, any>): Record<string, any> => {
        const cleanParams: Record<string, any> = {};

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                cleanParams[key] = value;
            }
        });

        return cleanParams;
    },

    // Format date for API calls
    formatDate: (date: Date): string => {
        return date.toISOString().split('T')[0];
    },

    // Format datetime for API calls
    formatDateTime: (date: Date): string => {
        return date.toISOString();
    },

    // Parse API date response
    parseDate: (dateString: string): Date => {
        return new Date(dateString);
    },

    // Handle API errors with user-friendly messages
    getErrorMessage: (error: any): string => {
        if (typeof error === 'string') return error;
        if (error?.response?.data?.message) return error.response.data.message;
        if (error?.message) return error.message;
        return 'An unexpected error occurred';
    },

    // Retry logic for failed requests
    withRetry: async <T>(
        apiCall: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 1000
    ): Promise<T> => {
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                lastError = error;

                if (attempt === maxRetries) {
                    throw error;
                }

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }

        throw lastError;
    },
};