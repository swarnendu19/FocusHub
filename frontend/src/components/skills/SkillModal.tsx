import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@/types/skills';
import { useSkillStore } from '@/stores/skillStore';
import { Button } from '@/components/ui/button';
import { X, ArrowUp, Star, Trophy, Target, Zap, Calendar, Shield, Award, Activity, Repeat, TrendingUp, CheckCircle, Crown } from 'lucide-react';

interface SkillModalProps {
    skill: Skill | null;
    isOpen: boolean;
    onClose: () => void;
}

export function SkillModal({ skill, isOpen, onClose }: SkillModalProps) {
    const { upgradeSkill, canUpgradeSkill, skillPoints } = useSkillStore();

    if (!skill) return null;

    const getSkillIcon = (iconName: string) => {
        switch (iconName) {
            case 'trophy': return <Trophy className="w-8 h-8" />;
            case 'target': return <Target className="w-8 h-8" />;
            case 'zap': return <Zap className="w-8 h-8" />;
            case 'calendar': return <Calendar className="w-8 h-8" />;
            case 'shield': return <Shield className="w-8 h-8" />;
            case 'award': return <Award className="w-8 h-8" />;
            case 'star': return <Star className="w-8 h-8" />;
            case 'activity': return <Activity className="w-8 h-8" />;
            case 'repeat': return <Repeat className="w-8 h-8" />;
            case 'trending-up': return <TrendingUp className="w-8 h-8" />;
            case 'check-circle': return <CheckCircle className="w-8 h-8" />;
            case 'crown': return <Crown className="w-8 h-8" />;
            default: return <Trophy className="w-8 h-8" />;
        }
    };

    const getCategoryColor = (category: Skill['category']) => {
        switch (category) {
            case 'productivity':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-700',
                    border: 'border-green-200',
                    button: 'bg-green-600 hover:bg-green-700',
                    gradient: 'from-green-400 to-emerald-500'
                };
            case 'focus':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-700',
                    border: 'border-blue-200',
                    button: 'bg-blue-600 hover:bg-blue-700',
                    gradient: 'from-blue-400 to-indigo-500'
                };
            case 'consistency':
                return {
                    bg: 'bg-orange-100',
                    text: 'text-orange-700',
                    border: 'border-orange-200',
                    button: 'bg-orange-600 hover:bg-orange-700',
                    gradient: 'from-orange-400 to-amber-500'
                };
            case 'mastery':
                return {
                    bg: 'bg-purple-100',
                    text: 'text-purple-700',
                    border: 'border-purple-200',
                    button: 'bg-purple-600 hover:bg-purple-700',
                    gradient: 'from-purple-400 to-fuchsia-500'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    button: 'bg-gray-600 hover:bg-gray-700',
                    gradient: 'from-gray-400 to-gray-500'
                };
        }
    };

    const colors = getCategoryColor(skill.category);
    const isUnlocked = skill.level > 0;
    const isMaxLevel = skill.level >= skill.maxLevel;
    const canUpgrade = canUpgradeSkill(skill.id);

    const handleUpgrade = () => {
        if (canUpgrade) {
            upgradeSkill(skill.id);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`p-6 ${colors.bg} ${colors.border} border-b`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full bg-gradient-to-br ${colors.gradient} text-white shadow-lg`}>
                                        {getSkillIcon(skill.icon)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{skill.name}</h2>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span className={`text-sm font-medium ${colors.text} capitalize`}>
                                                {skill.category}
                                            </span>
                                            {isMaxLevel && (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200 font-medium">
                                                    MAX LEVEL
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-600 mb-6 leading-relaxed">{skill.description}</p>

                            {/* Level Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">Level Progress</span>
                                    <span className="text-sm text-gray-500">{skill.level} / {skill.maxLevel}</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full bg-gradient-to-r ${colors.gradient}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                                <div className="space-y-3">
                                    {skill.benefits.map((benefit, index) => (
                                        <div key={index} className={`p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700 font-medium">{benefit.description}</span>
                                                <span className={`font-bold ${colors.text}`}>
                                                    +{benefit.value * (isUnlocked ? skill.level : 1)}%
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 capitalize">
                                                {benefit.type.replace('_', ' ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Prerequisites */}
                            {skill.requiredSkills.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                                    <div className="space-y-2">
                                        {skill.requiredSkills.map((reqSkillId) => {
                                            // You would need to get the skill name from the store
                                            return (
                                                <div key={reqSkillId} className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span>Skill: {reqSkillId.replace('-', ' ')}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Cost and Action */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-700">Cost:</span>
                                    <span className="text-lg font-bold text-gray-900">{skill.xpCost} SP</span>
                                </div>

                                {isMaxLevel ? (
                                    <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                                        Maximum Level Reached
                                    </Button>
                                ) : canUpgrade ? (
                                    <Button
                                        onClick={handleUpgrade}
                                        className={`${colors.button} text-white`}
                                    >
                                        <ArrowUp className="w-4 h-4 mr-2" />
                                        Upgrade Skill
                                    </Button>
                                ) : (
                                    <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                                        {skillPoints < skill.xpCost
                                            ? `Need ${skill.xpCost - skillPoints} more SP`
                                            : 'Prerequisites not met'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}