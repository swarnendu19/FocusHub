import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:3001/api',
            withCredentials: true, // For session-based authentication
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                // Add any request modifications here
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                // Handle common errors here
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Generic GET method
    async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.get(url, { params });
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }
    }

    // Generic POST method
    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.post(url, data);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }
    }

    // Generic PUT method
    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.put(url, data);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }
    }

    // Generic DELETE method
    async delete<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.delete(url);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }
    }
}

export const apiService = new ApiService();
export default apiService;