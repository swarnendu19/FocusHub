import { env } from '../config/env';

interface ErrorContext {
    userId?: string;
    userAgent: string;
    url: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    additionalContext?: Record<string, any>;
}

interface ErrorInfo {
    componentStack?: string;
    errorBoundary?: boolean;
}

class ErrorTrackingService {
    private userId?: string;
    private isInitialized = false;

    constructor() {
        this.initialize();
    }

    private initialize() {
        if (!env.enableErrorReporting) {
            console.log('Error tracking disabled');
            return;
        }

        // Initialize error tracking service (e.g., Sentry)
        if (env.sentryDsn) {
            // Initialize Sentry here if needed
            console.log('Error tracking initialized');
        }

        // Global error handler
        window.addEventListener('error', (event) => {
            this.captureError(event.error, undefined, 'medium');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError(new Error(event.reason), undefined, 'high');
        });

        this.isInitialized = true;
    }

    setUserId(userId: string) {
        this.userId = userId;
    }

    captureError(
        error: Error,
        errorInfo?: ErrorInfo,
        severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    ) {
        if (!this.isInitialized || !env.enableErrorReporting) {
            console.error('Error captured:', error);
            return;
        }

        const context: ErrorContext = {
            userId: this.userId,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            severity,
            additionalContext: {
                componentStack: errorInfo?.componentStack,
                errorBoundary: errorInfo?.errorBoundary,
                message: error.message,
                stack: error.stack,
            },
        };

        // Log to console in development
        if (!env.isProduction) {
            console.error('Error tracked:', {
                error,
                context,
                errorInfo,
            });
        }

        // Send to error tracking service
        this.sendErrorToService(error, context);
    }

    captureMessage(
        message: string,
        severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
        additionalContext?: Record<string, any>
    ) {
        if (!this.isInitialized || !env.enableErrorReporting) {
            console.log('Message captured:', message);
            return;
        }

        const context: ErrorContext = {
            userId: this.userId,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            severity,
            additionalContext,
        };

        // Log to console in development
        if (!env.isProduction) {
            console.log('Message tracked:', { message, context });
        }

        // Send to error tracking service
        this.sendMessageToService(message, context);
    }

    private async sendErrorToService(error: Error, context: ErrorContext) {
        try {
            if (env.errorReportingEndpoint) {
                await fetch(env.errorReportingEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'error',
                        message: error.message,
                        stack: error.stack,
                        context,
                    }),
                });
            }
        } catch (sendError) {
            console.error('Failed to send error to tracking service:', sendError);
        }
    }

    private async sendMessageToService(message: string, context: ErrorContext) {
        try {
            if (env.errorReportingEndpoint) {
                await fetch(env.errorReportingEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'message',
                        message,
                        context,
                    }),
                });
            }
        } catch (sendError) {
            console.error('Failed to send message to tracking service:', sendError);
        }
    }

    // Performance monitoring
    capturePerformanceMetric(name: string, value: number, unit: string) {
        if (!this.isInitialized || !env.enablePerformanceMonitoring) {
            return;
        }

        const metric = {
            name,
            value,
            unit,
            timestamp: new Date().toISOString(),
            userId: this.userId,
            url: window.location.href,
        };

        // Log to console in development
        if (!env.isProduction) {
            console.log('Performance metric:', metric);
        }

        // Send to analytics service
        this.sendPerformanceMetric(metric);
    }

    private async sendPerformanceMetric(metric: any) {
        try {
            if (env.errorReportingEndpoint) {
                await fetch(env.errorReportingEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'performance',
                        metric,
                    }),
                });
            }
        } catch (error) {
            console.error('Failed to send performance metric:', error);
        }
    }
}

export const errorTracking = new ErrorTrackingService();