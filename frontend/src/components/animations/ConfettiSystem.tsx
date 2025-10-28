import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: string;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    velocityX: number;
    velocityY: number;
    rotationSpeed: number;
    shape: 'square' | 'circle' | 'triangle';
}

interface ConfettiSystemProps {
    isActive: boolean;
    duration?: number;
    intensity?: 'low' | 'medium' | 'high';
    colors?: string[];
    onComplete?: () => void;
}

export function ConfettiSystem({
    isActive,
    duration = 3000,
    intensity = 'medium',
    colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'],
    onComplete
}: ConfettiSystemProps) {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const getIntensityConfig = (intensity: string) => {
        switch (intensity) {
            case 'low':
                return { count: 30, spread: 60, force: 0.5 };
            case 'high':
                return { count: 100, spread: 120, force: 1.5 };
            default:
                return { count: 60, spread: 90, force: 1.0 };
        }
    };

    const createConfettiPiece = useCallback((index: number, config: any): ConfettiPiece => {
        const shapes: ConfettiPiece['shape'][] = ['square', 'circle', 'triangle'];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Create explosion pattern from center
        const angle = (index / config.count) * Math.PI * 2 + (Math.random() - 0.5) * config.spread * (Math.PI / 180);
        const velocity = (Math.random() * 8 + 4) * config.force;

        return {
            id: `confetti-${index}-${Date.now()}`,
            x: centerX + (Math.random() - 0.5) * 100,
            y: centerY + (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            velocityX: Math.cos(angle) * velocity,
            velocityY: Math.sin(angle) * velocity - Math.random() * 5,
            rotationSpeed: (Math.random() - 0.5) * 10,
            shape: shapes[Math.floor(Math.random() * shapes.length)]
        };
    }, [colors]);

    const startConfetti = useCallback(() => {
        if (!isActive || isAnimating) return;

        setIsAnimating(true);
        const config = getIntensityConfig(intensity);

        const newConfetti = Array.from({ length: config.count }, (_, i) =>
            createConfettiPiece(i, config)
        );

        setConfetti(newConfetti);

        // Clean up after duration
        setTimeout(() => {
            setConfetti([]);
            setIsAnimating(false);
            onComplete?.();
        }, duration);
    }, [isActive, isAnimating, intensity, duration, createConfettiPiece, onComplete]);

    useEffect(() => {
        if (isActive) {
            startConfetti();
        }
    }, [isActive, startConfetti]);

    const getShapeComponent = (piece: ConfettiPiece) => {
        const baseClasses = "absolute";
        const style = {
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
        };

        switch (piece.shape) {
            case 'circle':
                return <div className={`${baseClasses} rounded-full`} style={style} />;
            case 'triangle':
                return (
                    <div
                        className={baseClasses}
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: `${piece.size / 2}px solid transparent`,
                            borderRight: `${piece.size / 2}px solid transparent`,
                            borderBottom: `${piece.size}px solid ${piece.color}`,
                        }}
                    />
                );
            default:
                return <div className={baseClasses} style={style} />;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {confetti.map((piece) => (
                    <motion.div
                        key={piece.id}
                        className="absolute"
                        initial={{
                            x: piece.x,
                            y: piece.y,
                            rotate: piece.rotation,
                            opacity: 1,
                            scale: 1,
                        }}
                        animate={{
                            x: piece.x + piece.velocityX * 50,
                            y: piece.y + piece.velocityY * 50 + 500, // Gravity effect
                            rotate: piece.rotation + piece.rotationSpeed * 50,
                            opacity: 0,
                            scale: 0.5,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                        }}
                        transition={{
                            duration: duration / 1000,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    >
                        {getShapeComponent(piece)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}