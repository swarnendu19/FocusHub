/**
 * API Client
 *
 * Axios instance with interceptors for authentication, error handling, and retry logic.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
import { config } from "@/config";
import type { ApiError, ApiResponse } from "@/types";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const authData = localStorage.getItem("focushub_auth_token");
    if (!authData) return null;

    const parsed = JSON.parse(authData);
    return parsed.state?.token?.accessToken || null;
  } catch {
    return null;
  }
}

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors and transform responses
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        error: error.response?.data,
      });
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== "undefined") {
            // Clear auth data
            localStorage.removeItem("focushub_auth_token");

            // Redirect to login if not already there
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden:", data);
          break;

        case 404:
          // Not found
          console.error("Resource not found:", data);
          break;

        case 429:
          // Too many requests
          console.error("Rate limit exceeded:", data);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - might want to retry
          console.error("Server error:", data);
          break;

        default:
          console.error("API error:", data);
      }

      // Return structured error
      return Promise.reject({
        status,
        message: data?.error?.message || "An error occurred",
        code: data?.error?.code || "UNKNOWN_ERROR",
        details: data?.error?.details,
      });
    }

    // Network error or timeout
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        status: 0,
        message: "Request timeout",
        code: "TIMEOUT",
      });
    }

    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "Network error - please check your connection",
        code: "NETWORK_ERROR",
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Retry logic for failed requests
 */
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    // Only retry on network errors or 5xx server errors
    const shouldRetry =
      (error as any).code === "NETWORK_ERROR" ||
      (error as any).status >= 500;

    if (!shouldRetry) {
      throw error;
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Retry with exponential backoff
    return retryRequest(requestFn, retries - 1, delay * 2);
  }
}

/**
 * Generic API request wrapper
 */
export async function apiRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<ApiResponse<T>>(config);
  return response.data.data;
}

/**
 * GET request
 */
export async function get<T = any>(url: string, params?: any): Promise<T> {
  return apiRequest<T>({ method: "GET", url, params });
}

/**
 * POST request
 */
export async function post<T = any>(url: string, data?: any): Promise<T> {
  return apiRequest<T>({ method: "POST", url, data });
}

/**
 * PUT request
 */
export async function put<T = any>(url: string, data?: any): Promise<T> {
  return apiRequest<T>({ method: "PUT", url, data });
}

/**
 * PATCH request
 */
export async function patch<T = any>(url: string, data?: any): Promise<T> {
  return apiRequest<T>({ method: "PATCH", url, data });
}

/**
 * DELETE request
 */
export async function del<T = any>(url: string): Promise<T> {
  return apiRequest<T>({ method: "DELETE", url });
}

export default apiClient;
