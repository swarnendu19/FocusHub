import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScreenShakeProps {
    isActive: boolean;
    intensity?: 'low' | 'medium' | 'high';
    duration?: number;
    children: React.ReactNode;
    onComplete?: () => void;
}

export function ScreenShake({
    isActive,
    intensity = 'medium',
    duration = 500,
    children,
    onComplete
}: ScreenShakeProps) {
    const [isShaking, setIsShaking] = useState(false);

    const getIntensityConfig = (intensity: string) => {
        switch (intensity) {
            case 'low':
                return { amplitude: 2, frequency: 20 };
            case 'high':
                return { amplitude: 8, frequency: 30 };
            default:
                return { amplitude: 4, frequency: 25 };
        }
    };

    useEffect(() => {
        if (isActive && !isShaking) {
            setIsShaking(true);

            const timer = setTimeout(() => {
                setIsShaking(false);
                onComplete?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, isShaking, duration, onComplete]);

    const config = getIntensityConfig(intensity);

    const generateShakeKeyframes = () => {
        const keyframes: { x: number; y: number }[] = [];
        const steps = Math.floor(duration / (1000 / config.frequency));

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const dampening = 1 - progress; // Reduce intensity over time

            keyframes.push({
                x: (Math.random() - 0.5) * config.amplitude * dampening,
                y: (Math.random() - 0.5) * config.amplitude * dampening,
            });
        }

        // End at original position
        keyframes.push({ x: 0, y: 0 });

        return keyframes;
    };

    return (
        <motion.div
            animate={isShaking ? generateShakeKeyframes() : { x: 0, y: 0 }}
            transition={{
                duration: duration / 1000,
                ease: "easeOut",
                times: isShaking ? Array.from({ length: generateShakeKeyframes().length }, (_, i) => i / (generateShakeKeyframes().length - 1)) : [0, 1]
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}