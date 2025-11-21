/**
 * ParticleEffects Component
 *
 * Ambient particle effects for background animations.
 * Creates floating particles for a subtle, engaging visual effect.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { usePrefersReducedMotion } from "@/hooks";

interface ParticleEffectsProps {
  /**
   * Number of particles
   */
  particleCount?: number;
  /**
   * Particle color
   */
  color?: string;
  /**
   * Particle size range [min, max] in pixels
   */
  sizeRange?: [number, number];
  /**
   * Animation speed multiplier
   */
  speed?: number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Enable particles
   */
  enabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleEffects({
  particleCount = 20,
  color = "rgba(117, 115, 115, 0.3)",
  sizeRange = [2, 6],
  speed = 1,
  className,
  enabled = true,
}: ParticleEffectsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      setParticles([]);
      return;
    }

    // Generate random particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const [minSize, maxSize] = sizeRange;
      newParticles.push({
        id: i,
        x: Math.random() * 100, // Position (%)
        y: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        duration: (10 + Math.random() * 20) / speed, // 10-30s animation
        delay: Math.random() * 5, // Stagger start
      });
    }
    setParticles(newParticles);
  }, [enabled, particleCount, sizeRange, speed, prefersReducedMotion]);

  if (!enabled || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className
      )}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
          }}
          animate={{
            x: [
              `${particle.x}vw`,
              `${particle.x + (Math.random() - 0.5) * 20}vw`,
              `${particle.x}vw`,
            ],
            y: [
              `${particle.y}vh`,
              `${particle.y + (Math.random() - 0.5) * 20}vh`,
              `${particle.y}vh`,
            ],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            borderRadius: "50%",
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * FloatingElement Component
 *
 * Makes an element float with gentle motion.
 */
interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Animation intensity (0-1)
   */
  intensity?: number;
  /**
   * Animation duration in seconds
   */
  duration?: number;
}

export function FloatingElement({
  children,
  className,
  intensity = 0.5,
  duration = 3,
}: FloatingElementProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const distance = 10 * intensity;

  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
        rotate: [-2 * intensity, 2 * intensity, -2 * intensity],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * PulseEffect Component
 *
 * Adds a subtle pulse animation to an element.
 */
interface PulseEffectProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Pulse scale (1.0 = no scale, 1.1 = 10% larger)
   */
  scale?: number;
  /**
   * Animation duration in seconds
   */
  duration?: number;
}

export function PulseEffect({
  children,
  className,
  scale = 1.05,
  duration = 2,
}: PulseEffectProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
