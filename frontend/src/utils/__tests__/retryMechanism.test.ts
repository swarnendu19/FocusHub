import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'sonner';
import {
    RetryMechanism,
    createRetryMechanism,
    useRetryMechanism,
    withRetry
} from '../retryMechanism';
import { renderHook, act } from '@testing-library/react';

// Mock dependencies
vi.mock('sonner', () => ({
    toast: {
        warning: vi.fn(),
        error: vi.fn(),
        loading: vi.fn(),
    },
}));

// Mock console methods
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { });
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

describe('RetryMechanism', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        mockConsoleWarn.mockClear();
        mockConsoleError.mockClear();
    });

    describe('basic functionality', () => {
        it('executes operation successfully on first try', async () => {
            const retryMechanism = new RetryMechanism();
            const operation = vi.fn().mockResolvedValue('success');

            const result = await retryMechanism.execute(operation);

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(1);
        });

        it('retries on failure and succeeds', async () => {
            const retryMechanism = new RetryMechanism({ maxAttempts: 3, baseDelay: 100 });
            const operation = vi.fn()
                .mockRejectedValueOnce(new Error('First failure'))
                .mockResolvedValue('success');

            const executePromise = retryMechanism.execute(operation);

            // Fast-forward through the delay
            await act(async () => {
                vi.advanceTimersByTime(100);
            });

            const result = await executePromise;

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(2);
        });

        it('fails after max attempts', async () => {
            const retryMechanism = new RetryMechanism({ maxAttempts: 2, baseDelay: 100 });
            const error = new Error('Persistent failure');
            const operation = vi.fn().mockRejectedValue(error);

            const executePromise = retryMechanism.execute(operation);

            // Fast-forward through delays
            await act(async () => {
                vi.advanceTimersByTime(100);
                vi.advanceTimersByTime(200); // Second retry with backoff
            });

            await expect(executePromise).rejects.toThrow('Persistent failure');
            expect(operation).toHaveBeenCalledTimes(2);
        });

        it('respects retry condition', async () => {
            const retryMechanism = new RetryMechanism({
                maxAttempts: 3,
                retryCondition: (error) => error.message !== 'Do not retry',
            });

            const error = new Error('Do not retry');
            const operation = vi.fn().mockRejectedValue(error);

            await expect(retryMechanism.execute(operation)).rejects.toThrow('Do not retry');
            expect(operation).toHaveBeenCalledTimes(1);
        });

        it('uses exponential backoff', async () => {
            const retryMechanism = new RetryMechanism({
                maxAttempts: 3,
                baseDelay: 100,
                backoffFactor: 2,
            });

            const operation = vi.fn().mockRejectedValue(new Error('Failure'));
            const executePromise = retryMechanism.execute(operation);

            // First retry after 100ms
            await act(async () => {
                vi.advanceTimersByTime(100);
            });

            // Second retry after 200ms (100 * 2^1)
            await act(async () => {
                vi.advanceTimersByTime(200);
            });

            await expect(executePromise).rejects.toThrow('Failure');
            expect(operation).toHaveBeenCalledTimes(3);
        });

        it('respects max delay', async () => {
            const retryMechanism = new RetryMechanism({
                maxAttempts: 3,
                baseDelay: 1000,
                backoffFactor: 10,
                maxDelay: 2000,
            });

            const operation = vi.fn().mockRejectedValue(new Error('Failure'));
            const executePromise = retryMechanism.execute(operation);

            // First retry should be capped at maxDelay
            await act(async () => {
                vi.advanceTimersByTime(2000); // Should be capped at 2000ms, not 1000ms
            });

            // Second retry should also be capped
            await act(async () => {
                vi.advanceTimersByTime(2000);
            });

            await expect(executePromise).rejects.toThrow('Failure');
        });

        it('calls onRetry callback', async () => {
            const onRetry = vi.fn();
            const retryMechanism = new RetryMechanism({
                maxAttempts: 2,
                baseDelay: 100,
                onRetry,
            });

            const error = new Error('Failure');
            const operation = vi.fn().mockRejectedValue(error);
            const executePromise = retryMechanism.execute(operation);

            await act(async () => {
                vi.advanceTimersByTime(100);
            });

            await expect(executePromise).rejects.toThrow('Failure');
            expect(onRetry).toHaveBeenCalledWith(1, error);
        });

        it('calls onMaxAttemptsReached callback', async () => {
            const onMaxAttemptsReached = vi.fn();
            const retryMechanism = new RetryMechanism({
                maxAttempts: 1,
                onMaxAttemptsReached,
            });

            const error = new Error('Failure');
            const operation = vi.fn().mockRejectedValue(error);

            await expect(retryMechanism.execute(operation)).rejects.toThrow('Failure');
            expect(onMaxAttemptsReached).toHaveBeenCalledWith(error);
        });

        it('provides correct state information', () => {
            const retryMechanism = new RetryMechanism();

            const initialState = retryMechanism.getState();
            expect(initialState).toEqual({
                attempt: 0,
                isRetrying: false,
                lastError: null,
            });
        });

        it('resets state correctly', async () => {
            const retryMechanism = new RetryMechanism({ maxAttempts: 2, baseDelay: 100 });
            const operation = vi.fn().mockRejectedValue(new Error('Failure'));

            const executePromise = retryMechanism.execute(operation);

            await act(async () => {
                vi.advanceTimersByTime(100);
            });

            await expect(executePromise).rejects.toThrow('Failure');

            retryMechanism.reset();
            const state = retryMechanism.getState();

            expect(state).toEqual({
                attempt: 0,
                isRetrying: false,
                lastError: null,
            });
        });
    });

    describe('createRetryMechanism factory', () => {
        it('creates API retry mechanism with correct defaults', async () => {
            const retryMechanism = createRetryMechanism('api');
            const operation = vi.fn().mockRejectedValue(new Error('API Error'));

            const executePromise = retryMechanism.execute(operation);

            await act(async () => {
                vi.advanceTimersByTime(1000);
                vi.advanceTimersByTime(2000);
            });

            await expect(executePromise).rejects.toThrow('API Error');
            expect(operation).toHaveBeenCalledTimes(3); // maxAttempts: 3
            expect(mockConsoleWarn).toHaveBeenCalledWith(
                expect.stringContaining('API call failed, retrying'),
                'API Error'
            );
            expect(toast.error).toHaveBeenCalledWith(
                'Unable to connect to server. Please check your connection.',
                expect.objectContaining({ duration: 5000 })
            );
        });

        it('creates critical retry mechanism with correct defaults', async () => {
            const retryMechanism = createRetryMechanism('critical');
            const operation = vi.fn().mockRejectedValue(new Error('Critical Error'));

            const executePromise = retryMechanism.execute(operation);

            await act(async () => {
                vi.advanceTimersByTime(500);
                vi.advanceTimersByTime(750);
                vi.advanceTimersByTime(1125);
                vi.advanceTimersByTime(1687);
                vi.advanceTimersByTime(2531);
            });

            await expect(executePromise).rejects.toThrow('Critical Error');
            expect(operation).toHaveBeenCalledTimes(5); // maxAttempts: 5
            expect(toast.error).toHaveBeenCalledWith(
                'Critical operation failed. Please try again later.',
                expect.objectContaining({ duration: 10000 })
            );
        });

        it('creates background retry mechanism with correct defaults', async () => {
            const retryMechanism = createRetryMechanism('background');
            const operation = vi.fn().mockRejectedValue(new Error('Background Error'));

            const executePromise = retryMechanism.execute(operation);

            await act(async () => {
                vi.advanceTimersByTime(2000);
            });

            await expect(executePromise).rejects.toThrow('Background Error');
            expect(operation).toHaveBeenCalledTimes(2); // maxAttempts: 2
            // Background operations should fail silently
            expect(toast.error).not.toHaveBeenCalled();
        });

        it('allows custom options to override defaults', async () => {
            const retryMechanism = createRetryMechanism('api', { maxAttempts: 1 });
            const operation = vi.fn().mockRejectedValue(new Error('Custom Error'));

            await expect(retryMechanism.execute(operation)).rejects.toThrow('Custom Error');
            expect(operation).toHaveBeenCalledTimes(1);
        });
    });

    describe('withRetry wrapper', () => {
        it('wraps function with retry logic', async () => {
            const originalFn = vi.fn()
                .mockRejectedValueOnce(new Error('First failure'))
                .mockResolvedValue('success');

            const wrappedFn = withRetry(originalFn, { maxAttempts: 2, baseDelay: 100 });

            const executePromise = wrappedFn('arg1', 'arg2');

            await act(async () => {
                vi.advanceTimersByTime(100);
            });

            const result = await executePromise;

            expect(result).toBe('success');
            expect(originalFn).toHaveBeenCalledTimes(2);
            expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
        });

        it('preserves function signature', async () => {
            const originalFn = (a: string, b: number): Promise<string> =>
                Promise.resolve(`${a}-${b}`);

            const wrappedFn = withRetry(originalFn);
            const result = await wrappedFn('test', 123);

            expect(result).toBe('test-123');
        });
    });
});

describe('useRetryMechanism hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('provides execute function and state', () => {
        const { result } = renderHook(() => useRetryMechanism('api'));

        expect(result.current.execute).toBeInstanceOf(Function);
        expect(result.current.reset).toBeInstanceOf(Function);
        expect(result.current.state).toEqual({
            attempt: 0,
            isRetrying: false,
            lastError: null,
        });
        expect(result.current.isRetrying).toBe(false);
    });

    it('updates state during execution', async () => {
        const { result } = renderHook(() => useRetryMechanism('api'));
        const operation = vi.fn()
            .mockRejectedValueOnce(new Error('Failure'))
            .mockResolvedValue('success');

        act(() => {
            result.current.execute(operation);
        });

        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.state.attempt).toBeGreaterThan(0);
    });

    it('resets state when reset is called', async () => {
        const { result } = renderHook(() => useRetryMechanism('api'));
        const operation = vi.fn().mockRejectedValue(new Error('Failure'));

        act(() => {
            result.current.execute(operation).catch(() => { });
        });

        await act(async () => {
            vi.advanceTimersByTime(1000);
            vi.advanceTimersByTime(2000);
            vi.advanceTimersByTime(4000);
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.state).toEqual({
            attempt: 0,
            isRetrying: false,
            lastError: null,
        });
    });

    it('uses correct scenario defaults', () => {
        const { result: apiResult } = renderHook(() => useRetryMechanism('api'));
        const { result: criticalResult } = renderHook(() => useRetryMechanism('critical'));
        const { result: backgroundResult } = renderHook(() => useRetryMechanism('background'));

        // All should start with the same initial state
        const expectedState = {
            attempt: 0,
            isRetrying: false,
            lastError: null,
        };

        expect(apiResult.current.state).toEqual(expectedState);
        expect(criticalResult.current.state).toEqual(expectedState);
        expect(backgroundResult.current.state).toEqual(expectedState);
    });

    it('accepts custom options', async () => {
        const { result } = renderHook(() =>
            useRetryMechanism('api', { maxAttempts: 1 })
        );

        const operation = vi.fn().mockRejectedValue(new Error('Failure'));

        await act(async () => {
            try {
                await result.current.execute(operation);
            } catch (error) {
                // Expected to fail
            }
        });

        expect(operation).toHaveBeenCalledTimes(1);
    });
});