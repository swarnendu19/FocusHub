import React, { useState, useCallback, useEffect } from 'react';
import { ConfettiSystem } from './ConfettiSystem';
import { ParticleEffects } from './ParticleEffects';
import { ScreenShake } from './ScreenShake';
import { useSound } from '@/services/soundService';
import { useUserStore } from '@/stores/userStore';

export type CelebrationType =
    | 'xp-gain'
    | 'level-up'
    | 'achievement-unlock'
    | 'task-complete'
    | 'streak-milestone'
    | 'skill-unlock'
    | 'major-achievement';

interface CelebrationConfig {
    type: CelebrationType;
    intensity: 'low' | 'medium' | 'high';
    position?: { x: number; y: number };
    message?: string;
    value?: number;
    duration?: number;
}

interface CelebrationState {
    showConfetti: boolean;
    showParticles: boolean;
    showScreenShake: boolean;
    particleType: string;
    confettiIntensity: 'low' | 'medium' | 'high';
    shakeIntensity: 'low' | 'medium' | 'high';
}

export function CelebrationManager({ children }: { children: React.ReactNode }) {
    const [celebrations, setCelebrations] = useState<Map<string, CelebrationState>>(new Map());
    const [celebrationQueue, setCelebrationQueue] = useState<CelebrationConfig[]>([]);
    const { playSound } = useSound();
    const { user } = useUserStore();

    const getCelebrationEffects = (config: CelebrationConfig): CelebrationState => {
        switch (config.type) {
            case 'xp-gain':
                return {
                    showConfetti: false,
                    showParticles: true,
                    showScreenShake: false,
                    particleType: 'xp-gain',
                    confettiIntensity: 'low',
                    shakeIntensity: 'low'
                };

            case 'level-up':
                return {
                    showConfetti: true,
                    showParticles: true,
                    showScreenShake: true,
                    particleType: 'level-up',
                    confettiIntensity: config.intensity,
                    shakeIntensity: config.intensity
                };

            case 'achievement-unlock':
                return {
                    showConfetti: true,
                    showParticles: true,
                    showScreenShake: config.intensity === 'high',
                    particleType: 'achievement',
                    confettiIntensity: config.intensity,
                    shakeIntensity: 'medium'
                };

            case 'task-complete':
                return {
                    showConfetti: false,
                    showParticles: true,
                    showScreenShake: false,
                    particleType: 'task-complete',
                    confettiIntensity: 'low',
                    shakeIntensity: 'low'
                };

            case 'streak-milestone':
                return {
                    showConfetti: true,
                    showParticles: true,
                    showScreenShake: config.intensity !== 'low',
                    particleType: 'achievement',
                    confettiIntensity: config.intensity,
                    shakeIntensity: config.intensity
                };

            case 'skill-unlock':
                return {
                    showConfetti: config.intensity !== 'low',
                    showParticles: true,
                    showScreenShake: false,
                    particleType: 'achievement',
                    confettiIntensity: config.intensity,
                    shakeIntensity: 'low'
                };

            case 'major-achievement':
                return {
                    showConfetti: true,
                    showParticles: true,
                    showScreenShake: true,
                    particleType: 'achievement',
                    confettiIntensity: 'high',
                    shakeIntensity: 'high'
                };

            default:
                return {
                    showConfetti: false,
                    showParticles: false,
                    showScreenShake: false,
                    particleType: 'xp-gain',
                    confettiIntensity: 'low',
                    shakeIntensity: 'low'
                };
        }
    };

    const getSoundType = (celebrationType: CelebrationType) => {
        switch (celebrationType) {
            case 'xp-gain': return 'xp-gain';
            case 'level-up': return 'level-up';
            case 'achievement-unlock': return 'achievement-unlock';
            case 'task-complete': return 'task-complete';
            case 'streak-milestone': return 'celebration';
            case 'skill-unlock': return 'success';
            case 'major-achievement': return 'celebration';
            default: return 'success';
        }
    };

    const triggerCelebration = useCallback((config: CelebrationConfig) => {
        // Check user preferences for animations
        if (user?.preferences?.animations === 'none') {
            return;
        }

        const celebrationId = `celebration-${Date.now()}-${Math.random()}`;
        const effects = getCelebrationEffects(config);

        // Reduce intensity if user prefers reduced animations
        if (user?.preferences?.animations === 'reduced') {
            effects.confettiIntensity = effects.confettiIntensity === 'high' ? 'medium' : 'low';
            effects.shakeIntensity = 'low';
            effects.showScreenShake = false;
        }

        setCelebrations(prev => new Map(prev.set(celebrationId, effects)));

        // Play sound effect
        if (user?.preferences?.soundEffects !== false) {
            playSound(getSoundType(config.type));
        }

        // Clean up after duration
        const duration = config.duration || 3000;
        setTimeout(() => {
            setCelebrations(prev => {
                const newMap = new Map(prev);
                newMap.delete(celebrationId);
                return newMap;
            });
        }, duration);
    }, [user?.preferences, playSound]);

    // Process celebration queue
    useEffect(() => {
        if (celebrationQueue.length > 0) {
            const [nextCelebration, ...remaining] = celebrationQueue;
            setCelebrationQueue(remaining);
            triggerCelebration(nextCelebration);
        }
    }, [celebrationQueue, triggerCelebration]);

    // Global celebration trigger function
    const celebrate = useCallback((config: CelebrationConfig) => {
        setCelebrationQueue(prev => [...prev, config]);
    }, []);

    // Expose celebrate function globally
    useEffect(() => {
        (window as any).celebrate = celebrate;
        return () => {
            delete (window as any).celebrate;
        };
    }, [celebrate]);

    // Determine if any screen shake is active
    const hasActiveScreenShake = Array.from(celebrations.values()).some(c => c.showScreenShake);
    const screenShakeIntensity = Array.from(celebrations.values())
        .filter(c => c.showScreenShake)
        .reduce((max, c) => {
            const intensityOrder = { low: 1, medium: 2, high: 3 };
            const currentMax = intensityOrder[max as keyof typeof intensityOrder] || 0;
            const newIntensity = intensityOrder[c.shakeIntensity];
            return newIntensity > currentMax ? c.shakeIntensity : max;
        }, 'low' as 'low' | 'medium' | 'high');

    return (
        <ScreenShake
            isActive={hasActiveScreenShake}
            intensity={screenShakeIntensity}
            duration={500}
        >
            {children}

            {/* Render all active celebrations */}
            {Array.from(celebrations.entries()).map(([id, state]) => (
                <React.Fragment key={id}>
                    {state.showConfetti && (
                        <ConfettiSystem
                            isActive={true}
                            intensity={state.confettiIntensity}
                            duration={2500}
                        />
                    )}

                    {state.showParticles && (
                        <ParticleEffects
                            isActive={true}
                            type={state.particleType as any}
                            intensity={state.confettiIntensity}
                        />
                    )}
                </React.Fragment>
            ))}
        </ScreenShake>
    );
}

// Hook for components to trigger celebrations
export function useCelebration() {
    const celebrate = useCallback((config: CelebrationConfig) => {
        if ((window as any).celebrate) {
            (window as any).celebrate(config);
        }
    }, []);

    return { celebrate };
}

// Utility functions for common celebrations
export const celebrationUtils = {
    xpGain: (amount: number, position?: { x: number; y: number }) => {
        const intensity = amount > 100 ? 'high' : amount > 50 ? 'medium' : 'low';
        return {
            type: 'xp-gain' as CelebrationType,
            intensity,
            position,
            value: amount,
            message: `+${amount} XP`
        };
    },

    levelUp: (newLevel: number) => ({
        type: 'level-up' as CelebrationType,
        intensity: 'high' as const,
        value: newLevel,
        message: `Level ${newLevel}!`,
        duration: 4000
    }),

    achievementUnlock: (achievementName: string, rarity: string) => {
        const intensity = rarity === 'legendary' ? 'high' : rarity === 'epic' ? 'medium' : 'low';
        return {
            type: 'achievement-unlock' as CelebrationType,
            intensity,
            message: `Achievement Unlocked: ${achievementName}`,
            duration: 3500
        };
    },

    taskComplete: (taskName: string, xpReward: number, position?: { x: number; y: number }) => ({
        type: 'task-complete' as CelebrationType,
        intensity: 'medium' as const,
        position,
        value: xpReward,
        message: `Task completed: ${taskName}`
    }),

    streakMilestone: (streakCount: number) => {
        const intensity = streakCount >= 30 ? 'high' : streakCount >= 10 ? 'medium' : 'low';
        return {
            type: 'streak-milestone' as CelebrationType,
            intensity,
            value: streakCount,
            message: `${streakCount} day streak!`,
            duration: 3000
        };
    },

    skillUnlock: (skillName: string) => ({
        type: 'skill-unlock' as CelebrationType,
        intensity: 'medium' as const,
        message: `Skill Unlocked: ${skillName}`,
        duration: 2500
    })
};