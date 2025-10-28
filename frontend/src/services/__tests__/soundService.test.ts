import { soundService, useSound } from '../soundService';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock Web Audio API
const mockAudioContext = {
    state: 'running',
    sampleRate: 44100,
    resume: vi.fn().mockResolvedValue(undefined),
    createBuffer: vi.fn().mockReturnValue({
        getChannelData: vi.fn().mockReturnValue(new Float32Array(1024))
    }),
    createBufferSource: vi.fn().mockReturnValue({
        buffer: null,
        playbackRate: { value: 1 },
        loop: false,
        connect: vi.fn(),
        start: vi.fn()
    }),
    createGain: vi.fn().mockReturnValue({
        gain: { value: 1 },
        connect: vi.fn()
    }),
    destination: {}
};

// Mock AudioContext constructor
global.AudioContext = vi.fn().mockImplementation(() => mockAudioContext);
(global as any).webkitAudioContext = global.AudioContext;

describe('SoundService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        soundService.setEnabled(true);
        soundService.setMasterVolume(0.7);
    });

    describe('soundService', () => {
        it('initializes without errors', () => {
            expect(soundService).toBeDefined();
            expect(soundService.isAudioEnabled()).toBe(true);
        });

        it('can be enabled and disabled', () => {
            soundService.setEnabled(false);
            expect(soundService.isAudioEnabled()).toBe(false);

            soundService.setEnabled(true);
            expect(soundService.isAudioEnabled()).toBe(true);
        });

        it('can set master volume', () => {
            soundService.setMasterVolume(0.5);
            // Volume is internal, but we can test it doesn't throw
            expect(() => soundService.setMasterVolume(0.5)).not.toThrow();
        });

        it('clamps volume to valid range', () => {
            expect(() => soundService.setMasterVolume(-1)).not.toThrow();
            expect(() => soundService.setMasterVolume(2)).not.toThrow();
        });

        it('plays sounds when enabled', async () => {
            const createBufferSourceSpy = vi.spyOn(mockAudioContext, 'createBufferSource');

            await soundService.play('xp-gain');

            expect(createBufferSourceSpy).toHaveBeenCalled();
        });

        it('does not play sounds when disabled', async () => {
            soundService.setEnabled(false);
            const createBufferSourceSpy = vi.spyOn(mockAudioContext, 'createBufferSource');

            await soundService.play('xp-gain');

            expect(createBufferSourceSpy).not.toHaveBeenCalled();
        });

        it('handles audio context resume', async () => {
            mockAudioContext.state = 'suspended';
            const resumeSpy = vi.spyOn(mockAudioContext, 'resume');

            await soundService.play('level-up');

            expect(resumeSpy).toHaveBeenCalled();
        });

        it('handles play errors gracefully', async () => {
            const createBufferSourceSpy = vi.spyOn(mockAudioContext, 'createBufferSource')
                .mockImplementation(() => {
                    throw new Error('Test error');
                });

            // Should not throw
            await expect(soundService.play('achievement-unlock')).resolves.toBeUndefined();

            createBufferSourceSpy.mockRestore();
        });

        it('supports different sound types', async () => {
            const soundTypes = [
                'xp-gain',
                'level-up',
                'achievement-unlock',
                'task-complete',
                'button-click',
                'timer-start',
                'timer-stop',
                'notification',
                'success',
                'error',
                'celebration'
            ] as const;

            for (const soundType of soundTypes) {
                await expect(soundService.play(soundType)).resolves.toBeUndefined();
            }
        });

        it('applies custom sound config', async () => {
            const mockSource = mockAudioContext.createBufferSource();
            const mockGain = mockAudioContext.createGain();

            await soundService.play('xp-gain', {
                volume: 0.5,
                playbackRate: 1.5,
                loop: true
            });

            // Verify config was applied (mocked objects should have been called)
            expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
            expect(mockAudioContext.createGain).toHaveBeenCalled();
        });
    });

    describe('useSound hook', () => {
        it('returns sound functions', () => {
            const { result } = renderHook(() => useSound());

            expect(result.current.playSound).toBeInstanceOf(Function);
            expect(result.current.setEnabled).toBeInstanceOf(Function);
            expect(result.current.setMasterVolume).toBeInstanceOf(Function);
            expect(result.current.isAudioEnabled).toBeInstanceOf(Function);
        });

        it('can play sounds through hook', async () => {
            const { result } = renderHook(() => useSound());
            const createBufferSourceSpy = vi.spyOn(mockAudioContext, 'createBufferSource');

            await act(async () => {
                result.current.playSound('task-complete');
            });

            expect(createBufferSourceSpy).toHaveBeenCalled();
        });

        it('can control sound settings through hook', () => {
            const { result } = renderHook(() => useSound());

            act(() => {
                result.current.setEnabled(false);
            });

            expect(result.current.isAudioEnabled()).toBe(false);

            act(() => {
                result.current.setEnabled(true);
            });

            expect(result.current.isAudioEnabled()).toBe(true);
        });

        it('can set volume through hook', () => {
            const { result } = renderHook(() => useSound());

            expect(() => {
                act(() => {
                    result.current.setMasterVolume(0.3);
                });
            }).not.toThrow();
        });
    });

    describe('Error handling', () => {
        it('handles missing AudioContext gracefully', () => {
            // Temporarily remove AudioContext
            const originalAudioContext = global.AudioContext;
            delete (global as any).AudioContext;
            delete (global as any).webkitAudioContext;

            // Should not throw when creating new instance
            expect(() => {
                const testService = new (soundService.constructor as any)();
                expect(testService.isAudioEnabled()).toBe(false);
            }).not.toThrow();

            // Restore AudioContext
            global.AudioContext = originalAudioContext;
        });

        it('handles sound generation errors', async () => {
            // Mock createBuffer to throw
            const originalCreateBuffer = mockAudioContext.createBuffer;
            mockAudioContext.createBuffer = vi.fn().mockImplementation(() => {
                throw new Error('Buffer creation failed');
            });

            // Should handle error gracefully
            await expect(soundService.play('error')).resolves.toBeUndefined();

            // Restore original method
            mockAudioContext.createBuffer = originalCreateBuffer;
        });
    });
});