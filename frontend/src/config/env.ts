/**
 * Environment Configuration Management
 * 
 * Centralized configuration for environment variables with type safety and validation
 */

interface EnvironmentConfig {
    // API Configuration
    apiBaseUrl: string;
    apiTimeout: number;

    // Authentication
    googleClientId?: string;

    // Feature Flags
    enableAnalytics: boolean;
    enableAiFeatures: boolean;
    enableCollaboration: boolean;
    enableIntegrations: boolean;

    // Performance Monitoring
    enablePerformanceMonitoring: boolean;
    sentryDsn?: string;

    // Development Settings
    enableDebugMode: boolean;
    enableMockData: boolean;

    // PWA Settings
    pwaEnabled: boolean;
    pwaCacheDuration: number;
    vapidPublicKey?: string;

    // Analytics
    gaTrackingId?: string;
    hotjarId?: string;

    // Error Tracking
    enableErrorReporting: boolean;
    errorReportingEndpoint?: string;

    // Build Information
    appVersion: string;
    buildTime: string;
    isProduction: boolean;
}

// Helper function to parse boolean environment variables
const parseBoolean = (value: string | undefined, defaultValue: boolean = false): boolean => {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
};

// Helper function to parse number environment variables
const parseNumber = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

// Validate required environment variables
const validateRequiredEnvVars = () => {
    const required = ['VITE_API_BASE_URL'];
    const missing = required.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing);
        // In development, provide helpful error message
        if (import.meta.env.DEV) {
            console.error('Please check your .env.local file and ensure all required variables are set.');
            console.error('See .env.example for a template.');
        }
    }
};

// Validate environment configuration
validateRequiredEnvVars();

// Export typed environment configuration
export const env: EnvironmentConfig = {
    // API Configuration
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    apiTimeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 10000),

    // Authentication
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,

    // Feature Flags
    enableAnalytics: parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS, true),
    enableAiFeatures: parseBoolean(import.meta.env.VITE_ENABLE_AI_FEATURES, true),
    enableCollaboration: parseBoolean(import.meta.env.VITE_ENABLE_COLLABORATION, true),
    enableIntegrations: parseBoolean(import.meta.env.VITE_ENABLE_INTEGRATIONS, true),

    // Performance Monitoring
    enablePerformanceMonitoring: parseBoolean(import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING, false),
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,

    // Development Settings
    enableDebugMode: parseBoolean(import.meta.env.VITE_ENABLE_DEBUG_MODE, import.meta.env.DEV),
    enableMockData: parseBoolean(import.meta.env.VITE_ENABLE_MOCK_DATA, false),

    // PWA Settings
    pwaEnabled: parseBoolean(import.meta.env.VITE_PWA_ENABLED, true),
    pwaCacheDuration: parseNumber(import.meta.env.VITE_PWA_CACHE_DURATION, 86400000), // 24 hours
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,

    // Analytics
    gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
    hotjarId: import.meta.env.VITE_HOTJAR_ID,

    // Error Tracking
    enableErrorReporting: parseBoolean(import.meta.env.VITE_ENABLE_ERROR_REPORTING, !import.meta.env.DEV),
    errorReportingEndpoint: import.meta.env.VITE_ERROR_REPORTING_ENDPOINT,

    // Build Information (injected by Vite)
    appVersion: (globalThis as any).__APP_VERSION__ || '1.0.0',
    buildTime: (globalThis as any).__BUILD_TIME__ || new Date().toISOString(),
    isProduction: (globalThis as any).__PROD__ || import.meta.env.PROD,
};

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof Pick<EnvironmentConfig,
    'enableAnalytics' | 'enableAiFeatures' | 'enableCollaboration' | 'enableIntegrations'
>): boolean => {
    return env[feature];
};

// Development helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Debug logging (only in development)
if (isDevelopment && env.enableDebugMode) {
    console.group('🔧 Environment Configuration');
    console.log('API Base URL:', env.apiBaseUrl);
    console.log('Features:', {
        analytics: env.enableAnalytics,
        ai: env.enableAiFeatures,
        collaboration: env.enableCollaboration,
        integrations: env.enableIntegrations,
    });
    console.log('Build Info:', {
        version: env.appVersion,
        buildTime: env.buildTime,
        isProduction: env.isProduction,
    });
    console.groupEnd();
}

// Export individual configurations for specific use cases
export const apiConfig = {
    baseUrl: env.apiBaseUrl,
    timeout: env.apiTimeout,
} as const;

export const featureFlags = {
    analytics: env.enableAnalytics,
    aiFeatures: env.enableAiFeatures,
    collaboration: env.enableCollaboration,
    integrations: env.enableIntegrations,
} as const;

export const monitoringConfig = {
    performance: env.enablePerformanceMonitoring,
    errorReporting: env.enableErrorReporting,
    sentryDsn: env.sentryDsn,
    errorEndpoint: env.errorReportingEndpoint,
} as const;

export const analyticsConfig = {
    gaTrackingId: env.gaTrackingId,
    hotjarId: env.hotjarId,
} as const;