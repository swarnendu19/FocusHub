/**
 * ConfettiSystem Component
 *
 * Celebratory confetti particle effect using Framer Motion.
 * Displays colorful animated particles for achievements and milestones.
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";

interface ConfettiSystemProps {
  /**
   * Whether confetti is active
   */
  active: boolean;
  /**
   * Number of confetti particles
   */
  particleCount?: number;
  /**
   * Duration in seconds
   */
  duration?: number;
  /**
   * Colors for confetti particles
   */
  colors?: string[];
  /**
   * Additional className
   */
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

export function ConfettiSystem({
  active,
  particleCount = 50,
  duration = 3,
  colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
  className,
}: ConfettiSystemProps) {
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    if (active) {
      // Generate random particles
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // Start position (%)
          y: -10, // Start above viewport
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 8 + Math.random() * 8, // 8-16px
          delay: Math.random() * 0.5, // Stagger animation
        });
      }
      setParticles(newParticles);

      // Clear particles after animation
      const timeout = setTimeout(() => {
        setParticles([]);
      }, (duration + 0.5) * 1000);

      return () => clearTimeout(timeout);
    }
  }, [active, particleCount, duration, colors]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 overflow-hidden",
        className
      )}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              rotate: particle.rotation,
              opacity: 1,
            }}
            animate={{
              x: `${particle.x + (Math.random() - 0.5) * 40}vw`, // Drift horizontally
              y: "110vh", // Fall past bottom
              rotate: particle.rotation + 360 * (Math.random() > 0.5 ? 1 : -1), // Spin
              opacity: [1, 1, 0], // Fade out at end
            }}
            transition={{
              duration: duration,
              delay: particle.delay,
              ease: "linear",
            }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
