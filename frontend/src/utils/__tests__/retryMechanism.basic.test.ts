import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RetryMechanism } from '../retryMechanism';

describe('RetryMechanism - Basic Tests', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

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
        vi.advanceTimersByTime(100);

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
        vi.advanceTimersByTime(100);
        vi.advanceTimersByTime(200); // Second retry with backoff

        await expect(executePromise).rejects.toThrow('Persistent failure');
        expect(operation).toHaveBeenCalledTimes(2);
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

        vi.advanceTimersByTime(100);

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