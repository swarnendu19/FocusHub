import React from 'react';
import { motion } from 'framer-motion';
import type { Skill, SkillConnection } from '@/types';

interface SkillConnectionsProps {
    connections: SkillConnection[];
    skills: Skill[];
    unlockedSkills: string[];
    hoveredSkill: string | null;
}

export function SkillConnections({
    connections,
    skills,
    unlockedSkills,
    hoveredSkill
}: SkillConnectionsProps) {
    const getSkillPosition = (skillId: string) => {
        const skill = skills.find(s => s.id === skillId);
        return skill ? skill.position : { x: 0, y: 0 };
    };

    const isConnectionActive = (connection: SkillConnection) => {
        return unlockedSkills.includes(connection.from) && unlockedSkills.includes(connection.to);
    };

    const isConnectionHighlighted = (connection: SkillConnection) => {
        return hoveredSkill === connection.from || hoveredSkill === connection.to;
    };

    const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        // Create a curved path for better visual appeal
        const midX = from.x + dx / 2;
        const midY = from.y + dy / 2;

        // Add some curve based on the distance
        const curve = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
        const controlX = midX + (dy > 0 ? curve : -curve);
        const controlY = midY + (dx > 0 ? -curve : curve);

        return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
    };

    const getConnectionColor = (connection: SkillConnection, isActive: boolean, isHighlighted: boolean) => {
        if (isHighlighted) {
            return connection.type === 'prerequisite' ? '#3b82f6' : '#10b981'; // Blue for prerequisite, green for synergy
        }
        if (isActive) {
            return connection.type === 'prerequisite' ? '#60a5fa' : '#34d399'; // Lighter blue/green when active
        }
        return '#d1d5db'; // Gray when inactive
    };

    return (
        <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
            <defs>
                {/* Arrow markers for different connection types */}
                <marker
                    id="prerequisite-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                </marker>
                <marker
                    id="synergy-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                </marker>
                <marker
                    id="inactive-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#d1d5db" />
                </marker>
            </defs>

            {connections.map((connection, index) => {
                const fromPos = getSkillPosition(connection.from);
                const toPos = getSkillPosition(connection.to);
                const isActive = isConnectionActive(connection);
                const isHighlighted = isConnectionHighlighted(connection);
                const path = getConnectionPath(fromPos, toPos);
                const color = getConnectionColor(connection, isActive, isHighlighted);

                return (
                    <motion.g key={`${connection.from}-${connection.to}`}>
                        {/* Connection Line */}
                        <motion.path
                            d={path}
                            stroke={color}
                            strokeWidth={isHighlighted ? 3 : isActive ? 2 : 1}
                            fill="none"
                            strokeDasharray={connection.type === 'synergy' ? '5,5' : 'none'}
                            markerEnd={
                                isActive || isHighlighted
                                    ? connection.type === 'prerequisite'
                                        ? 'url(#prerequisite-arrow)'
                                        : 'url(#synergy-arrow)'
                                    : 'url(#inactive-arrow)'
                            }
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: 1,
                                opacity: isHighlighted ? 1 : isActive ? 0.8 : 0.3
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.05,
                                pathLength: { duration: 0.8, ease: 'easeInOut' }
                            }}
                        />

                        {/* Animated Flow Effect for Active Connections */}
                        {isActive && (
                            <motion.circle
                                r="3"
                                fill={color}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: index * 0.2
                                }}
                            >
                                <animateMotion
                                    dur="2s"
                                    repeatCount="indefinite"
                                    path={path}
                                />
                            </motion.circle>
                        )}

                        {/* Connection Type Label (on hover) */}
                        {isHighlighted && (
                            <motion.g
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <rect
                                    x={(fromPos.x + toPos.x) / 2 - 30}
                                    y={(fromPos.y + toPos.y) / 2 - 10}
                                    width="60"
                                    height="20"
                                    rx="10"
                                    fill="rgba(0, 0, 0, 0.8)"
                                />
                                <text
                                    x={(fromPos.x + toPos.x) / 2}
                                    y={(fromPos.y + toPos.y) / 2 + 4}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="10"
                                    fontWeight="500"
                                >
                                    {connection.type === 'prerequisite' ? 'Required' : 'Synergy'}
                                </text>
                            </motion.g>
                        )}
                    </motion.g>
                );
            })}
        </svg>
    );
}