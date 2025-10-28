import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SkillTree, SkillPointsDisplay, SkillBenefitsSummary, SkillModal } from '@/components/skills';
import { CelebrationDemo } from '@/components/animations/CelebrationDemo';
import { useSkillStore } from '@/stores/skillStore';
import { Skill } from '@/types/skills';
import { Trophy, Target, Zap, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Skills() {
    const { skills, getUnlockedSkills, getSkillCategories } = useSkillStore();
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const unlockedSkills = getUnlockedSkills();
    const categories = getSkillCategories();

    const handleSkillSelect = (skill: Skill) => {
        setSelectedSkill(skill);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedSkill(null);
        setIsModalOpen(false);
    };

    const getCategoryStats = () => {
        return Object.entries(categories).map(([categoryId, category]) => {
            const categorySkills = Object.values(skills).filter(skill => skill.category === categoryId);
            const unlockedInCategory = categorySkills.filter(skill => skill.level > 0);

            return {
                id: categoryId,
                name: category.name,
                color: category.color,
                total: categorySkills.length,
                unlocked: unlockedInCategory.length,
                percentage: categorySkills.length > 0 ? (unlockedInCategory.length / categorySkills.length) * 100 : 0
            };
        });
    };

    const categoryStats = getCategoryStats();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Skill Tree</h1>
                            <p className="text-gray-600">Unlock skills to enhance your productivity and focus</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{unlockedSkills.length}</div>
                                <div className="text-sm text-gray-600">Skills Unlocked</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SkillPointsDisplay />

                    {categoryStats.map((category, index) => (
                        <motion.div
                            key={category.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>{category.unlocked} / {category.total}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: category.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${category.percentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Celebration Demo Section */}
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <CelebrationDemo />
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Skill Tree */}
                    <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <SkillTree
                            className="h-[700px]"
                            onSkillSelect={handleSkillSelect}
                        />
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <SkillBenefitsSummary />

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm text-gray-600">Total Skills</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{Object.keys(skills).length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-gray-600">Unlocked</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{unlockedSkills.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">Completion</span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {Math.round((unlockedSkills.length / Object.keys(skills).length) * 100)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Zap className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm text-gray-600">Categories</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{Object.keys(categories).length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 p-4">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tips</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Earn skill points by completing tasks and gaining XP</li>
                                <li>• Focus on one skill tree branch at a time</li>
                                <li>• Unlock prerequisite skills before advanced ones</li>
                                <li>• Skill benefits stack and compound over time</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Skill Modal */}
            <SkillModal
                skill={selectedSkill}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}