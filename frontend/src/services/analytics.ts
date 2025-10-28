/**
 * Analytics Service
 * 
 * Centralized analytics tracking for user interactions and performance metrics
 */

import { env, analyticsConfig, monitoringConfig } from '@/config/env';

// Analytics event types
export interface AnalyticsEvent {
    name: string;
    category: 'user_interaction' | 'performance' | 'error' | 'feature_usage' | 'conversion';
    properties?: Record<string, any>;
    value?: number;
    userId?: string;
}

// Performance metrics
export interface PerformanceMetric {
    name: string;
    value: number;
    unit: 'ms' | 'bytes' | 'count' | 'percentage';
    category: 'load_time' | 'memory_usage' | 'network' | 'rendering';
    metadata?: Record<string, any>;
}

// Error tracking
export interface ErrorEvent {
    message: string;
    stack?: string;
    url: string;
    lineNumber?: number;
    columnNumber?: number;
    userId?: string;
    userAgent: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    context?: Record<string, any>;
}

class AnalyticsService {
    private isInitialized = false;
    private queue: AnalyticsEvent[] = [];
    private performanceObserver?: PerformanceObserver;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        if (!env.enableAnalytics || this.isInitialized) return;

        try {
            // Initialize Google Analytics if configured
            if (analyticsConfig.gaTrackingId) {
                await this.initializeGoogleAnalytics();
            }

            // Initialize Hotjar if configured
            if (analyticsConfig.hotjarId) {
                this.initializeHotjar();
            }

            // Initialize performance monitoring
            if (monitoringConfig.performance) {
                this.initializePerformanceMonitoring();
            }

            // Process queued events
            this.processQueue();

            this.isInitialized = true;
            console.log('📊 Analytics service initialized');
        } catch (error) {
            console.error('Failed to initialize analytics:', error);
        }
    }

    private async initializeGoogleAnalytics() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaTrackingId}`;
        document.head.appendChild(script);

        // Initialize gtag
        (window as any).dataLayer = (window as any).dataLayer || [];
        const gtag = (...args: any[]) => {
            (window as any).dataLayer.push(args);
        };
        (window as any).gtag = gtag;

        gtag('js', new Date());
        gtag('config', analyticsConfig.gaTrackingId, {
            page_title: document.title,
            page_location: window.location.href,
        });
    }

    private initializeHotjar() {
        const script = document.createElement('script');
        script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${analyticsConfig.hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
        document.head.appendChild(script);
    }

    private initializePerformanceMonitoring() {
        // Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            this.performanceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.trackPerformanceMetric({
                        name: entry.name,
                        value: entry.duration || (entry as any).value || 0,
                        unit: 'ms',
                        category: this.categorizePerformanceEntry(entry),
                        metadata: {
                            entryType: entry.entryType,
                            startTime: entry.startTime,
                        },
                    });
                }
            });

            // Observe different performance entry types
            try {
                this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
            } catch (error) {
                console.warn('Some performance metrics not supported:', error);
            }
        }

        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                const memory = (performance as any).memory;
                this.trackPerformanceMetric({
                    name: 'memory_usage',
                    value: memory.usedJSHeapSize,
                    unit: 'bytes',
                    category: 'memory_usage',
                    metadata: {
                        totalJSHeapSize: memory.totalJSHeapSize,
                        jsHeapSizeLimit: memory.jsHeapSizeLimit,
                    },
                });
            }, 30000); // Every 30 seconds
        }
    }

    private categorizePerformanceEntry(entry: PerformanceEntry): PerformanceMetric['category'] {
        if (entry.entryType === 'navigation') return 'load_time';
        if (entry.entryType === 'paint') return 'rendering';
        if (entry.entryType === 'largest-contentful-paint') return 'rendering';
        return 'network';
    }

    private processQueue() {
        while (this.queue.length > 0) {
            const event = this.queue.shift();
            if (event) {
                this.sendEvent(event);
            }
        }
    }

    private sendEvent(event: AnalyticsEvent) {
        if (!this.isInitialized) {
            this.queue.push(event);
            return;
        }

        try {
            // Send to Google Analytics
            if (analyticsConfig.gaTrackingId && (window as any).gtag) {
                (window as any).gtag('event', event.name, {
                    event_category: event.category,
                    event_label: event.properties?.label,
                    value: event.value,
                    custom_map: event.properties,
                });
            }

            // Send to custom analytics endpoint if configured
            if (env.enableAnalytics && env.apiBaseUrl) {
                fetch(`${env.apiBaseUrl}/analytics/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...event,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        userAgent: navigator.userAgent,
                    }),
                }).catch(error => {
                    console.warn('Failed to send analytics event:', error);
                });
            }
        } catch (error) {
            console.warn('Failed to track analytics event:', error);
        }
    }

    // Public API
    public track(event: AnalyticsEvent) {
        if (!env.enableAnalytics) return;
        this.sendEvent(event);
    }

    public trackPageView(path: string, title?: string) {
        this.track({
            name: 'page_view',
            category: 'user_interaction',
            properties: {
                page_path: path,
                page_title: title || document.title,
            },
        });
    }

    public trackUserAction(action: string, properties?: Record<string, any>) {
        this.track({
            name: action,
            category: 'user_interaction',
            properties,
        });
    }

    public trackFeatureUsage(feature: string, properties?: Record<string, any>) {
        this.track({
            name: `feature_${feature}`,
            category: 'feature_usage',
            properties,
        });
    }

    public trackConversion(event: string, value?: number, properties?: Record<string, any>) {
        this.track({
            name: event,
            category: 'conversion',
            value,
            properties,
        });
    }

    public trackPerformanceMetric(metric: PerformanceMetric) {
        if (!monitoringConfig.performance) return;

        this.track({
            name: `performance_${metric.name}`,
            category: 'performance',
            value: metric.value,
            properties: {
                unit: metric.unit,
                category: metric.category,
                ...metric.metadata,
            },
        });
    }

    public trackError(error: ErrorEvent) {
        if (!monitoringConfig.errorReporting) return;

        this.track({
            name: 'error_occurred',
            category: 'error',
            properties: {
                message: error.message,
                stack: error.stack,
                severity: error.severity,
                ...error.context,
            },
        });

        // Send to error reporting service
        if (monitoringConfig.errorEndpoint) {
            fetch(monitoringConfig.errorEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(error),
            }).catch(err => {
                console.warn('Failed to send error report:', err);
            });
        }
    }

    public setUserId(userId: string) {
        if (analyticsConfig.gaTrackingId && (window as any).gtag) {
            (window as any).gtag('config', analyticsConfig.gaTrackingId, {
                user_id: userId,
            });
        }
    }

    public setUserProperties(properties: Record<string, any>) {
        if (analyticsConfig.gaTrackingId && (window as any).gtag) {
            (window as any).gtag('set', properties);
        }
    }

    // Cleanup
    public destroy() {
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
        this.isInitialized = false;
        this.queue = [];
    }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// React hook for analytics
export const useAnalytics = () => {
    return {
        track: analytics.track.bind(analytics),
        trackPageView: analytics.trackPageView.bind(analytics),
        trackUserAction: analytics.trackUserAction.bind(analytics),
        trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
        trackConversion: analytics.trackConversion.bind(analytics),
        trackError: analytics.trackError.bind(analytics),
        setUserId: analytics.setUserId.bind(analytics),
        setUserProperties: analytics.setUserProperties.bind(analytics),
    };
};

// Global error handler
window.addEventListener('error', (event) => {
    analytics.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        userId: undefined, // Will be set by user store
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        severity: 'medium',
        context: {
            type: 'javascript_error',
        },
    });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        userId: undefined,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        severity: 'high',
        context: {
            type: 'unhandled_promise_rejection',
            reason: event.reason,
        },
    });
});