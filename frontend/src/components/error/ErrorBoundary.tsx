import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: '',
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console and external service
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // Log to external error tracking service (e.g., Sentry)
        this.logErrorToService(error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
        // In a real app, you would send this to an error tracking service
        const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            errorId: this.state.errorId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
        };

        // For now, just log to console
        console.error('Error Report:', errorReport);

        // Store in localStorage for debugging
        try {
            const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
            existingErrors.push(errorReport);
            // Keep only last 10 errors
            if (existingErrors.length > 10) {
                existingErrors.splice(0, existingErrors.length - 10);
            }
            localStorage.setItem('error_reports', JSON.stringify(existingErrors));
        } catch (e) {
            console.error('Failed to store error report:', e);
        }
    };

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: '',
        });
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    private handleReportBug = () => {
        const errorDetails = {
            message: this.state.error?.message,
            stack: this.state.error?.stack,
            errorId: this.state.errorId,
        };

        // Open bug report with pre-filled error details
        const bugReportUrl = `/feedback?type=bug&error=${encodeURIComponent(JSON.stringify(errorDetails))}`;
        window.open(bugReportUrl, '_blank');
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-gray-900 mb-4"
                        >
                            Oops! Something went wrong
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-600 mb-6"
                        >
                            We encountered an unexpected error. Don't worry, we've been notified and are working on a fix.
                        </motion.p>

                        {process.env.NODE_ENV === 'development' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gray-100 rounded-lg p-4 mb-6 text-left"
                            >
                                <p className="text-sm font-medium text-gray-700 mb-2">Error Details:</p>
                                <p className="text-xs text-gray-600 font-mono break-all">
                                    {this.state.error?.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Error ID: {this.state.errorId}
                                </p>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <Button
                                onClick={this.handleRetry}
                                className="flex-1 bg-primary hover:bg-primary/90"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>

                            <Button
                                onClick={this.handleGoHome}
                                variant="outline"
                                className="flex-1"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-4"
                        >
                            <Button
                                onClick={this.handleReportBug}
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Bug className="w-4 h-4 mr-2" />
                                Report this issue
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
}