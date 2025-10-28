import { describe, it, expect, vi } from 'vitest';
import { RetryMechanism } from '../retryMechanism';

describe('RetryMechanism - Simple Tests', () => {
    it('executes operation successfully on first try', async () => {
        const retryMechanism = new RetryMechanism();
        const operation = vi.fn().mockResolvedValue('success');

        const result = await retryMechanism.execute(operation);

        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledTimes(1);
    });

    it('provides correct initial state', () => {
        const retryMechanism = new RetryMechanism();

        const initialState = retryMechanism.getState();
        expect(initialState).toEqual({
            attempt: 0,
            isRetrying: false,
            lastError: null,
        });
    });

    it('resets state correctly', () => {
        const retryMechanism = new RetryMechanism();

        retryMechanism.reset();
        const state = retryMechanism.getState();

        expect(state).toEqual({
            attempt: 0,
            isRetrying: false,
            lastError: null,
        });
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
});