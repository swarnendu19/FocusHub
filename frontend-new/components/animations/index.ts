/**
 * Animation Components Barrel Export
 *
 * Central export point for all animation components.
 */

// Core animations
export { AnimatedCounter } from "./AnimatedCounter";
export { ConfettiSystem } from "./ConfettiSystem";
export {
  CelebrationManager,
  triggerCelebration,
  type CelebrationType,
} from "./CelebrationManager";

// Page transitions
export {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "./PageTransition";

// Particle effects
export {
  ParticleEffects,
  FloatingElement,
  PulseEffect,
} from "./ParticleEffects";
