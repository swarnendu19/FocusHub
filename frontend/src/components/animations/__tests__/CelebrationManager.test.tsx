import { render, screen, waitFor, act } from '@testing-library/react';
import { CelebrationManager, useCelebration, celebrationUtils } from '../CelebrationManager';
import { useUserStore } from '@/stores/userStore';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock the stores
vi.mock('@/stores/userStore', () => ({
    useUserStore: vi.fn()
}));

// Mock the sound service
vi.mock('@/services/soundService', () => ({
    useSound: () => ({
        playSound: vi.fn(),
        setEnabled: vi.fn(),
        setMasterVolume: vi.fn(),
        isAudioEnabled: vi.fn().mockReturnValue(true)
    })
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock child components
vi.mock('../ConfettiSystem', () => ({
    ConfettiSystem: ({ isActive }: any) =>
        isActive ? <div data-testid="confetti-system">Confetti</div> : null
}));

vi.mock('../ParticleEffects', () => ({
    ParticleEffects: ({ isActive }: any) =>
        isActive ? <div data-testid="particle-effects">Particles</div> : null
}));

vi.mock('../ScreenShake', () => ({
    ScreenShake: ({ children }: any) => <div data-testid="screen-shake">{children}</div>
}));

describe('CelebrationManager', () => {
    const mockUser = {
        preferences: {
            animations: 'full' as const,
            soundEffects: true
        }
    };

    beforeEach(() => {
        vi.useFakeTimers();
        (useUserStore as any).mockReturnValue({ user: mockUser });

        // Clear any existing global celebrate function
        delete (window as any).celebrate;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
        delete (window as any).celebrate;
    });

    it('renders children without celebrations initially', () => {
        render(
            <CelebrationManager>
                <div data-testid="child">Test Content</div>
            </CelebrationManager>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByTestId('screen-shake')).toBeInTheDocument();
        expect(screen.queryByTestId('confetti-system')).not.toBeInTheDocument();
        expect(screen.queryByTestId('particle-effects')).not.toBeInTheDocument();
    });

    it('exposes global celebrate function', () => {
        render(
            <CelebrationManager>
                <div>Test</div>
            </CelebrationManager>
        );

        expect((window as any).celebrate).toBeInstanceOf(Function);
    });

    it('triggers celebrations through global function', async () => {
        render(
            <CelebrationManager>
                <div data-testid="child">Test Content</div>
            </CelebrationManager>
        );

        act(() => {
            (window as any).celebrate({
                type: 'xp-gain',
                intensity: 'medium',
                value: 50
            });
        });

        // Process the celebration queue
        act(() => {
            vi.advanceTimersByTime(100);
        });

        await waitFor(() => {
            expect(screen.getByTestId('particle-effects')).toBeInTheDocument();
        });
    });

    it('respects user animation preferences', async () => {
        (useUserStore as any).mockReturnValue({
            user: {
                ...mockUser,
                preferences: {
                    animations: 'none',
                    soundEffects: true
                }
            }
        });

        render(
            <CelebrationManager>
                <div data-testid="child">Test Content</div>
            </CelebrationManager>
        );

        act(() => {
            (window as any).celebrate({
                type: 'level-up',
                intensity: 'high'
            });
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        // Should not show celebrations when animations are disabled
        expect(screen.queryByTestId('confetti-system')).not.toBeInTheDocument();
        expect(screen.queryByTestId('particle-effects')).not.toBeInTheDocument();
    });

    it('reduces intensity for reduced animation preference', async () => {
        (useUserStore as any).mockReturnValue({
            user: {
                ...mockUser,
                preferences: {
                    animations: 'reduced',
                    soundEffects: true
                }
            }
        });

        render(
            <CelebrationManager>
                <div data-testid="child">Test Content</div>
            </CelebrationManager>
        );

        act(() => {
            (window as any).celebrate({
                type: 'level-up',
                intensity: 'high'
            });
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        // Should show celebrations but with reduced intensity
        await waitFor(() => {
            expect(screen.getByTestId('confetti-system')).toBeInTheDocument();
            expect(screen.getByTestId('particle-effects')).toBeInTheDocument();
        });
    });

    it('cleans up celebrations after duration', async () => {
        render(
            <CelebrationManager>
                <div data-testid="child">Test Content</div>
            </CelebrationManager>
        );

        act(() => {
            (window as any).celebrate({
                type: 'xp-gain',
                intensity: 'medium',
                duration: 1000
            });
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        await waitFor(() => {
            expect(screen.getByTestId('particle-effects')).toBeInTheDocument();
        });

        // Fast-forward past duration
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('particle-effects')).not.toBeInTheDocument();
        });
    });

    it('handles multiple simultaneous celebrations', async () => {
        render(
            <CelebrationManager>
                <div data-testid="child">Test Content</div>
            </CelebrationManager>
        );

        act(() => {
            (window as any).celebrate({ type: 'xp-gain', intensity: 'low' });
            (window as any).celebrate({ type: 'task-complete', intensity: 'medium' });
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        await waitFor(() => {
            const particleEffects = screen.getAllByTestId('particle-effects');
            expect(particleEffects).toHaveLength(2);
        });
    });
});

describe('useCelebration hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        delete (window as any).celebrate;
    });

    afterEach(() => {
        vi.useRealTimers();
        delete (window as any).celebrate;
    });

    it('returns celebrate function', () => {
        const { result } = renderHook(() => useCelebration());

        expect(result.current.celebrate).toBeInstanceOf(Function);
    });

    it('calls global celebrate function when available', () => {
        const mockCelebrate = vi.fn();
        (window as any).celebrate = mockCelebrate;

        const { result } = renderHook(() => useCelebration());

        const config = { type: 'xp-gain' as const, intensity: 'medium' as const };
        result.current.celebrate(config);

        expect(mockCelebrate).toHaveBeenCalledWith(config);
    });

    it('handles missing global celebrate function gracefully', () => {
        const { result } = renderHook(() => useCelebration());

        expect(() => {
            result.current.celebrate({ type: 'xp-gain', intensity: 'medium' });
        }).not.toThrow();
    });
});

describe('celebrationUtils', () => {
    it('creates correct XP gain celebration config', () => {
        const smallXP = celebrationUtils.xpGain(25);
        expect(smallXP.type).toBe('xp-gain');
        expect(smallXP.intensity).toBe('low');
        expect(smallXP.value).toBe(25);

        const largeXP = celebrationUtils.xpGain(150);
        expect(largeXP.intensity).toBe('high');
    });

    it('creates correct level up celebration config', () => {
        const levelUp = celebrationUtils.levelUp(5);
        expect(levelUp.type).toBe('level-up');
        expect(levelUp.intensity).toBe('high');
        expect(levelUp.value).toBe(5);
        expect(levelUp.duration).toBe(4000);
    });

    it('creates correct achievement unlock celebration config', () => {
        const common = celebrationUtils.achievementUnlock('Test', 'common');
        expect(common.type).toBe('achievement-unlock');
        expect(common.intensity).toBe('low');

        const legendary = celebrationUtils.achievementUnlock('Test', 'legendary');
        expect(legendary.intensity).toBe('high');
    });

    it('creates correct task complete celebration config', () => {
        const taskComplete = celebrationUtils.taskComplete('Test Task', 50);
        expect(taskComplete.type).toBe('task-complete');
        expect(taskComplete.intensity).toBe('medium');
        expect(taskComplete.value).toBe(50);
    });

    it('creates correct streak milestone celebration config', () => {
        const smallStreak = celebrationUtils.streakMilestone(5);
        expect(smallStreak.type).toBe('streak-milestone');
        expect(smallStreak.intensity).toBe('low');

        const largeStreak = celebrationUtils.streakMilestone(35);
        expect(largeStreak.intensity).toBe('high');
    });

    it('creates correct skill unlock celebration config', () => {
        const skillUnlock = celebrationUtils.skillUnlock('Test Skill');
        expect(skillUnlock.type).toBe('skill-unlock');
        expect(skillUnlock.intensity).toBe('medium');
        expect(skillUnlock.duration).toBe(2500);
    });
});