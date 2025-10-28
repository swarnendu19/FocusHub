import React from 'react';
import { motion } from 'framer-motion';
import { useSkillStore } from '@/stores/skillStore';
import { Star, Target, Shield, Zap, Trophy, CheckCircle } from 'lucide-react';
import { SkillBenefitType } from '@/types/skills';

interface SkillBenefitsSummaryProps {
    className?: string;
}

export function SkillBenefitsSummary({ className }: SkillBenefitsSummaryProps) {
    const { getSkillBenefitValue } = useSkillStore();

    const benefits = [
        {
            type: 'xp_multiplier' as SkillBenefitType,
            name: 'XP Multiplier',
            description: 'Bonus XP from all sources',
            icon: <Star className="w-5 h-5 text-yellow-500" />,
            color: 'bg-yellow-100 border-yellow-200',
            textColor: 'text-yellow-800'
        },
        {
            type: 'focus_duration' as SkillBenefitType,
            name: 'Focus Duration',
            description: 'Extended focus session time',
            icon: <Target className="w-5 h-5 text-blue-500" />,
            color: 'bg-blue-100 border-blue-200',
            textColor: 'text-blue-800'
        },
        {
            type: 'streak_protection' as SkillBenefitType,
            name: 'Streak Protection',
            description: 'Days of streak protection',
            icon: <Shield className="w-5 h-5 text-green-500" />,
            color: 'bg-green-100 border-green-200',
            textColor: 'text-green-800'
        },
        {
            type: 'bonus_xp' as SkillBenefitType,
            name: 'Bonus XP',
            description: 'Extra XP from specific actions',
            icon: <Zap className="w-5 h-5 text-purple-500" />,
            color: 'bg-purple-100 border-purple-200',
            textColor: 'text-purple-800'
        },
        {
            type: 'achievement_boost' as SkillBenefitType,
            name: 'Achievement Boost',
            description: 'Faster achievement progress',
            icon: <Trophy className="w-5 h-5 text-orange-500" />,
            color: 'bg-orange-100 border-orange-200',
            textColor: 'text-orange-800'
        },
        {
            type: 'task_efficiency' as SkillBenefitType,
            name: 'Task Efficiency',
            description: 'Improved task completion',
            icon: <CheckCircle className="w-5 h-5 text-indigo-500" />,
            color: 'bg-indigo-100 border-indigo-200',
            textColor: 'text-indigo-800'
        }
    ];

    return (
        <motion.div
            className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Active Skill Benefits</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit) => {
                    const value = getSkillBenefitValue(benefit.type);
                    const hasBonus = value > 0;

                    return (
                        <motion.div
                            key={benefit.type}
                            className={`p-3 rounded-lg border ${benefit.color} ${hasBonus ? 'opacity-100' : 'opacity-50'}`}
                            whileHover={hasBonus ? { scale: 1.02 } : {}}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {benefit.icon}
                                    <div>
                                        <h4 className={`text-sm font-semibold ${benefit.textColor}`}>
                                            {benefit.name}
                                        </h4>
                                        <p className="text-xs text-gray-600">{benefit.description}</p>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ${benefit.textColor}`}>
                                    {hasBonus ? `+${value}${benefit.type === 'streak_protection' ? '' : '%'}` : '0%'}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {benefits.every(benefit => getSkillBenefitValue(benefit.type) === 0) && (
                <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No active skill benefits yet. Unlock skills to gain bonuses!</p>
                </div>
            )}
        </motion.div>
    );
}