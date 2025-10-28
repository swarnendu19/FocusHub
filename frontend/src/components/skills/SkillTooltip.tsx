import React from 'react';
import { motion } from 'framer-motion';
import { Skill, SkillBenefit } from '@/types/skills';
import { Button } from '@/components/ui/button';
import { useSkillStore } from '@/stores/skillStore';
import { Trophy, Target, Zap, Calendar, Shield, Award, Star, Activity, Repeat, TrendingUp, CheckCircle, Crown, X, ArrowUp } from 'lucide-react';

interface SkillTooltipProps {
    skill: Skill;
    onClose: () => void;
    onUpgrade: () => void;
    canUpgrade: boolean;
}

export function SkillTooltip({ skill, onClose, onUpgrade, canUpgrade }: SkillTooltipProps) {
    const { skillPoints } = useSkillStore();
    const isUnlocked = skill.level > 0;
    const isMaxLevel = skill.level >= skill.maxLevel;

    const getSkillIcon = (iconName: string) => {
        switch (iconName) {
            case 'trophy': return <Trophy className="w-6 h-6" />;
            case 'target': return <Target className="w-6 h-6" />;
            case 'zap': return <Zap className="w-6 h-6" />;
            case 'calendar': return <Calendar className="w-6 h-6" />;
            case 'shield': return <Shield className="w-6 h-6" />;
            case 'award': return <Award className="w-6 h-6" />;
            case 'star': return <Star className="w-6 h-6" />;
            case 'activity': return <Activity className="w-6 h-6" />;
            case 'repeat': return <Repeat className="w-6 h-6" />;
            case 'trending-up': return <TrendingUp className="w-6 h-6" />;
            case 'check-circle': return <CheckCircle className="w-6 h-6" />;
            case 'crown': return <Crown className="w-6 h-6" />;
            default: return <Trophy className="w-6 h-6" />;
        }
    };

    const getCategoryColor = (category: Skill['category']) => {
        switch (category) {
            case 'productivity':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-700',
                    border: 'border-green-200',
                    button: 'bg-green-600 hover:bg-green-700'
                };
            case 'focus':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-700',
                    border: 'border-blue-200',
                    button: 'bg-blue-600 hover:bg-blue-700'
                };
            case 'consistency':
                return {
                    bg: 'bg-orange-100',
                    text: 'text-orange-700',
                    border: 'border-orange-200',
                    button: 'bg-orange-600 hover:bg-orange-700'
                };
            case 'mastery':
                return {
                    bg: 'bg-purple-100',
                    text: 'text-purple-700',
                    border: 'border-purple-200',
                    button: 'bg-purple-600 hover:bg-purple-700'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    button: 'bg-gray-600 hover:bg-gray-700'
                };
        }
    };

    const getBenefitTypeIcon = (type: SkillBenefit['type']) => {
        switch (type) {
            case 'xp_multiplier': return <Star className="w-4 h-4" />;
            case 'focus_duration': return <Target className="w-4 h-4" />;
            case 'streak_protection': return <Shield className="w-4 h-4" />;
            case 'bonus_xp': return <Zap className="w-4 h-4" />;
            case 'achievement_boost': return <Trophy className="w-4 h-4" />;
            case 'task_efficiency': return <CheckCircle className="w-4 h-4" />;
            default: return <Star className="w-4 h-4" />;
        }
    };

    const colors = getCategoryColor(skill.category);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`p-4 ${colors.bg} ${colors.border} border-b flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-white ${colors.text}`}>
                            {getSkillIcon(skill.icon)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{skill.name}</h3>
                            <div className="flex items-center space-x-2">
                                <span className={`text-sm ${colors.text}`}>{skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}</span>
                                {isMaxLevel && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full border border-yellow-200">
                                        MAX LEVEL
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-gray-600 mb-4">{skill.description}</p>

                    {/* Level Progress */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Level Progress</span>
                            <span className="text-sm text-gray-500">{skill.level} / {skill.maxLevel}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${colors.button.replace('hover:bg-', 'bg-')}`}
                                style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h4>
                        <div className="space-y-2">
                            {skill.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                    <div className={`p-1 rounded-full ${colors.bg}`}>
                                        {getBenefitTypeIcon(benefit.type)}
                                    </div>
                                    <span className="text-gray-600">{benefit.description}</span>
                                    <span className="font-medium text-gray-900">
                                        +{benefit.value * (isUnlocked ? skill.level : 1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cost */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-700">Skill Point Cost</span>
                        <span className="text-sm font-bold text-gray-900">{skill.xpCost}</span>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        {isMaxLevel ? (
                            <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                                Maximum Level Reached
                            </Button>
                        ) : canUpgrade ? (
                            <Button
                                onClick={onUpgrade}
                                className={`${colors.button} text-white`}
                            >
                                <ArrowUp className="w-4 h-4 mr-1" />
                                Upgrade ({skill.xpCost} SP)
                            </Button>
                        ) : (
                            <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                                {skillPoints < skill.xpCost
                                    ? `Not Enough Skill Points (${skillPoints}/${skill.xpCost})`
                                    : 'Prerequisites Not Met'}
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}