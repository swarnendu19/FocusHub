import { toast } from 'sonner';

export interface RetryOptions {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    retryCondition?: (error: any) => boolean;
    onRetry?: (attempt: number, error: any) => void;
    onMaxAttemptsReached?: (error: any) => void;
}

export interface RetryState {
    attempt: number;
    isRetrying: boolean;
    lastError: any;
    nextRetryIn?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: (error: any) => {
        // Retry on network errors, 5xx errors, and timeout errors
        if (!error.response) return true; // Network error
        const status = error.response?.status;
        return status >= 500 || status === 408 || status === 429; // Server errors, timeout, rate limit
    },
    onRetry: () => { },
    onMaxAttemptsReached: () => { },
};

export class RetryMechanism {
    private options: Required<RetryOptions>;
    private state: RetryState = {
        attempt: 0,
        isRetrying: false,
        lastError: null,
    };

    constructor(options: RetryOptions = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    async execute<T>(operation: () => Promise<T>): Promise<T> {
        this.state.attempt = 0;
        this.state.isRetrying = false;
        this.state.lastError = null;

        while (this.state.attempt < this.options.maxAttempts) {
            try {
                this.state.attempt++;
                const result = await operation();

                // Reset state on success
                this.state = {
                    attempt: 0,
                    isRetrying: false,
                    lastError: null,
                };

                return result;
            } catch (error) {
                this.state.lastError = error;

                // Check if we should retry
                if (
                    this.state.attempt >= this.options.maxAttempts ||
                    !this.options.retryCondition(error)
                ) {
                    this.options.onMaxAttemptsReached(error);
                    throw error;
                }

                // Calculate delay with exponential backoff
                const delay = Math.min(
                    this.options.baseDelay * Math.pow(this.options.backoffFactor, this.state.attempt - 1),
                    this.options.maxDelay
                );

                this.state.isRetrying = true;
                this.state.nextRetryIn = delay;

                // Call retry callback
                this.options.onRetry(this.state.attempt, error);

                // Wait before retrying
                await this.delay(delay);
            }
        }

        // This should never be reached, but TypeScript requires it
        throw this.state.lastError;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getState(): RetryState {
        return { ...this.state };
    }

    reset(): void {
        this.state = {
            attempt: 0,
            isRetrying: false,
            lastError: null,
        };
    }
}

// Factory function for common retry scenarios
export function createRetryMechanism(scenario: 'api' | 'critical' | 'background', customOptions?: RetryOptions): RetryMechanism {
    const scenarios = {
        api: {
            maxAttempts: 3,
            baseDelay: 1000,
            maxDelay: 5000,
            backoffFactor: 2,
            onRetry: (attempt: number, error: any) => {
                console.warn(`API call failed, retrying (${attempt}/3)...`, error.message);
                if (attempt === 2) {
                    toast.warning('Connection issues detected. Retrying...', {
                        duration: 2000,
                    });
                }
            },
            onMaxAttemptsReached: (error: any) => {
                console.error('API call failed after all retries:', error);
                toast.error('Unable to connect to server. Please check your connection.', {
                    duration: 5000,
                });
            },
        },
        critical: {
            maxAttempts: 5,
            baseDelay: 500,
            maxDelay: 8000,
            backoffFactor: 1.5,
            onRetry: (attempt: number, error: any) => {
                console.warn(`Critical operation failed, retrying (${attempt}/5)...`, error.message);
                toast.loading(`Retrying... (${attempt}/5)`, {
                    duration: 1000,
                });
            },
            onMaxAttemptsReached: (error: any) => {
                console.error('Critical operation failed after all retries:', error);
                toast.error('Critical operation failed. Please try again later.', {
                    duration: 10000,
                });
            },
        },
        background: {
            maxAttempts: 2,
            baseDelay: 2000,
            maxDelay: 10000,
            backoffFactor: 3,
            onRetry: (attempt: number, error: any) => {
                console.warn(`Background operation failed, retrying (${attempt}/2)...`, error.message);
            },
            onMaxAttemptsReached: (error: any) => {
                console.error('Background operation failed after all retries:', error);
                // Silent failure for background operations
            },
        },
    };

    return new RetryMechanism({ ...scenarios[scenario], ...customOptions });
}

// Hook for using retry mechanism in React components
export function useRetryMechanism(scenario: 'api' | 'critical' | 'background' = 'api', options?: RetryOptions) {
    const retryMechanism = React.useMemo(
        () => createRetryMechanism(scenario, options),
        [scenario, options]
    );

    const [state, setState] = React.useState<RetryState>(retryMechanism.getState());

    const execute = React.useCallback(
        async <T>(operation: () => Promise<T>): Promise<T> => {
            try {
                setState(retryMechanism.getState());
                const result = await retryMechanism.execute(operation);
                setState(retryMechanism.getState());
                return result;
            } catch (error) {
                setState(retryMechanism.getState());
                throw error;
            }
        },
        [retryMechanism]
    );

    const reset = React.useCallback(() => {
        retryMechanism.reset();
        setState(retryMechanism.getState());
    }, [retryMechanism]);

    return {
        execute,
        reset,
        state,
        isRetrying: state.isRetrying,
    };
}

// Utility function to wrap API calls with retry logic
export function withRetry<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options?: RetryOptions
): T {
    const retryMechanism = new RetryMechanism(options);

    return ((...args: Parameters<T>) => {
        return retryMechanism.execute(() => fn(...args));
    }) as T;
}

// React import for the hook
import React from 'react';