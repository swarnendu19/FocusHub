import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, Zap, Star, Crown, Target, Brain, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Skill } from '@/types';

interface SkillNodeProps {
    skill: Skill;
    isUnlocked: boolean;
    canUnlock: boolean;
    isAvailable: boolean;
    position: { x: number; y: number };
    onClick: () => void;
    onHover: (skillId: string | null) => void;
    scale: number;
}

export function SkillNode({
    skill,
    isUnlocked,
    canUnlock,
    isAvailable,
    position,
    onClick,
    onHover,
    scale
}: SkillNodeProps) {
    const [isHovered, setIsHovered] = useState(false);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'target':
                return Target;
            case 'brain':
                return Brain;
            case 'zap':
                return Zap;
            case 'flame':
                return Flame;
            case 'crown':
                return Crown;
            case 'star':
                return Star;
            default:
                return Target;
        }
    };

    const getCategoryColor = (categoryColor: string) => {
        switch (categoryColor) {
            case 'blue':
                return {
                    bg: 'bg-blue-500',
                    bgLight: 'bg-blue-100',
                    border: 'border-blue-300',
                    text: 'text-blue-600',
                    glow: 'shadow-blue-500/50'
                };
            case 'purple':
                return {
                    bg: 'bg-purple-500',
                    bgLight: 'bg-purple-100',
                    border: 'border-purple-300',
                    text: 'text-purple-600',
                    glow: 'shadow-purple-500/50'
                };
            case 'green':
                return {
                    bg: 'bg-green-500',
                    bgLight: 'bg-green-100',
                    border: 'border-green-300',
                    text: 'text-green-600',
                    glow: 'shadow-green-500/50'
                };
            case 'orange':
                return {
                    bg: 'bg-orange-500',
                    bgLight: 'bg-orange-100',
                    border: 'border-orange-300',
                    text: 'text-orange-600',
                    glow: 'shadow-orange-500/50'
                };
            case 'gold':
                return {
                    bg: 'bg-yellow-500',
                    bgLight: 'bg-yellow-100',
                    border: 'border-yellow-300',
                    text: 'text-yellow-600',
                    glow: 'shadow-yellow-500/50'
                };
            default:
                return {
                    bg: 'bg-gray-500',
                    bgLight: 'bg-gray-100',
                    border: 'border-gray-300',
                    text: 'text-gray-600',
                    glow: 'shadow-gray-500/50'
                };
        }
    };

    const IconComponent = getIcon(skill.category.icon);
    const colors = getCategoryColor(skill.category.color);

    const getNodeState = () => {
        if (isUnlocked) return 'unlocked';
        if (canUnlock) return 'available';
        if (isAvailable) return 'canUnlock';
        return 'locked';
    };

    const nodeState = getNodeState();

    const handleMouseEnter = () => {
        setIsHovered(true);
        onHover(skill.id);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        onHover(null);
    };

    return (
        <motion.div
            className="absolute cursor-pointer"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: skill.tier * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Glow Effect */}
            <AnimatePresence>
                {(isHovered || nodeState === 'available') && (
                    <motion.div
                        className={cn(
                            'absolute inset-0 rounded-full blur-lg',
                            nodeState === 'unlocked' ? colors.glow : 'shadow-blue-500/30'
                        )}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.6, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            boxShadow: `0 0 20px 10px ${nodeState === 'unlocked' ? 'currentColor' : '#3b82f6'
                                }`
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Main Node */}
            <motion.div
                className={cn(
                    'relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300',
                    {
                        // Unlocked state
                        [colors.bg]: nodeState === 'unlocked',
                        'text-white': nodeState === 'unlocked',
                        'shadow-lg': nodeState === 'unlocked',

                        // Available state (can unlock)
                        'bg-white': nodeState === 'available',
                        'border-blue-400': nodeState === 'available',
                        [colors.text]: nodeState === 'available',
                        'shadow-md': nodeState === 'available',

                        // Locked state
                        'bg-gray-200': nodeState === 'locked',
                        'border-gray-300': nodeState === 'locked',
                        'text-gray-400': nodeState === 'locked',

                        // Hover effects
                        'shadow-xl': isHovered,
                    }
                )}
                animate={{
                    borderColor: nodeState === 'available' ? '#60a5fa' : undefined,
                    boxShadow: nodeState === 'available'
                        ? '0 0 0 2px rgba(96, 165, 250, 0.3)'
                        : undefined
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Skill Icon */}
                <IconComponent className="w-8 h-8" />

                {/* Status Indicators */}
                <AnimatePresence>
                    {nodeState === 'unlocked' && (
                        <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                    )}

                    {nodeState === 'locked' && (
                        <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Lock className="w-3 h-3 text-white" />
                        </motion.div>
                    )}

                    {nodeState === 'available' && (
                        <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            exit={{ scale: 0 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <Zap className="w-3 h-3 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Tier Indicator */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className={cn(
                    'px-2 py-1 rounded-full text-xs font-bold',
                    nodeState === 'unlocked' ? `${colors.bg} text-white` : 'bg-gray-300 text-gray-600'
                )}>
                    T{skill.tier}
                </div>
            </div>

            {/* Cost Indicator */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className={cn(
                    'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
                    nodeState === 'unlocked'
                        ? 'bg-green-100 text-green-700'
                        : nodeState === 'available'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                )}>
                    <Zap className="w-3 h-3" />
                    <span>{skill.cost}</span>
                </div>
            </div>

            {/* Skill Name (on hover) */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                            {skill.name}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pulse Animation for Available Skills */}
            <AnimatePresence>
                {nodeState === 'available' && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-400"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}