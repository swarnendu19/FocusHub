import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
    id: string;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    size: number;
    color: string;
    life: number;
    maxLife: number;
    type: 'spark' | 'star' | 'plus' | 'circle';
}

interface ParticleEffectsProps {
    isActive: boolean;
    type?: 'xp-gain' | 'level-up' | 'achievement' | 'task-complete';
    position?: { x: number; y: number };
    intensity?: 'low' | 'medium' | 'high';
    onComplete?: () => void;
}

export function ParticleEffects({
    isActive,
    type = 'xp-gain',
    position,
    intensity = 'medium',
    onComplete
}: ParticleEffectsProps) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [animationId, setAnimationId] = useState<number | null>(null);

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'xp-gain':
                return {
                    colors: ['#4ade80', '#22c55e', '#16a34a', '#15803d'],
                    count: intensity === 'low' ? 8 : intensity === 'high' ? 20 : 12,
                    duration: 1500,
                    spread: 60,
                    particleType: 'plus' as const
                };
            case 'level-up':
                return {
                    colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309'],
                    count: intensity === 'low' ? 15 : intensity === 'high' ? 40 : 25,
                    duration: 2500,
                    spread: 120,
                    particleType: 'star' as const
                };
            case 'achievement':
                return {
                    colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
                    count: intensity === 'low' ? 12 : intensity === 'high' ? 30 : 18,
                    duration: 2000,
                    spread: 90,
                    particleType: 'spark' as const
                };
            case 'task-complete':
                return {
                    colors: ['#06b6d4', '#0891b2', '#0e7490', '#155e75'],
                    count: intensity === 'low' ? 6 : intensity === 'high' ? 15 : 10,
                    duration: 1200,
                    spread: 45,
                    particleType: 'circle' as const
                };
            default:
                return {
                    colors: ['#64748b', '#475569', '#334155', '#1e293b'],
                    count: 10,
                    duration: 1500,
                    spread: 60,
                    particleType: 'circle' as const
                };
        }
    };

    const createParticle = useCallback((index: number, config: any, startPos: { x: number; y: number }): Particle => {
        const angle = (index / config.count) * Math.PI * 2 + (Math.random() - 0.5) * config.spread * (Math.PI / 180);
        const velocity = Math.random() * 4 + 2;

        return {
            id: `particle-${index}-${Date.now()}`,
            x: startPos.x,
            y: startPos.y,
            velocityX: Math.cos(angle) * velocity,
            velocityY: Math.sin(angle) * velocity - Math.random() * 2,
            size: Math.random() * 6 + 3,
            color: config.colors[Math.floor(Math.random() * config.colors.length)],
            life: config.duration,
            maxLife: config.duration,
            type: config.particleType
        };
    }, []);

    const updateParticles = useCallback(() => {
        setParticles(prevParticles => {
            const updatedParticles = prevParticles
                .map(particle => ({
                    ...particle,
                    x: particle.x + particle.velocityX,
                    y: particle.y + particle.velocityY,
                    velocityY: particle.velocityY + 0.1, // Gravity
                    life: particle.life - 16 // Assuming 60fps
                }))
                .filter(particle => particle.life > 0);

            if (updatedParticles.length === 0 && prevParticles.length > 0) {
                onComplete?.();
            }

            return updatedParticles;
        });
    }, [onComplete]);

    const startParticles = useCallback(() => {
        if (!isActive) return;

        const config = getTypeConfig(type);
        const startPos = position || {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        const newParticles = Array.from({ length: config.count }, (_, i) =>
            createParticle(i, config, startPos)
        );

        setParticles(newParticles);
    }, [isActive, type, position, createParticle]);

    useEffect(() => {
        if (isActive) {
            startParticles();
        }
    }, [isActive, startParticles]);

    useEffect(() => {
        if (particles.length > 0) {
            const id = requestAnimationFrame(function animate() {
                updateParticles();
                if (particles.length > 0) {
                    setAnimationId(requestAnimationFrame(animate));
                }
            });
            setAnimationId(id);
        }

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [particles.length, updateParticles, animationId]);

    const getParticleComponent = (particle: Particle) => {
        const opacity = particle.life / particle.maxLife;
        const scale = Math.min(1, particle.life / (particle.maxLife * 0.3));

        const baseStyle = {
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity,
            transform: `scale(${scale})`,
        };

        switch (particle.type) {
            case 'star':
                return (
                    <div
                        className="absolute pointer-events-none"
                        style={baseStyle}
                    >
                        <svg viewBox="0 0 24 24" fill={particle.color} className="w-full h-full">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                );
            case 'plus':
                return (
                    <div
                        className="absolute pointer-events-none flex items-center justify-center font-bold text-lg"
                        style={{
                            ...baseStyle,
                            color: particle.color,
                            fontSize: particle.size,
                        }}
                    >
                        +
                    </div>
                );
            case 'spark':
                return (
                    <div
                        className="absolute pointer-events-none"
                        style={baseStyle}
                    >
                        <div
                            className="w-full h-full"
                            style={{
                                background: `linear-gradient(45deg, ${particle.color}, transparent)`,
                                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                            }}
                        />
                    </div>
                );
            default:
                return (
                    <div
                        className="absolute pointer-events-none rounded-full"
                        style={{
                            ...baseStyle,
                            backgroundColor: particle.color,
                        }}
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1, opacity: particle.life / particle.maxLife }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        {getParticleComponent(particle)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}