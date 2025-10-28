import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Info, Lock, CheckCircle } from 'lucide-react';
import { SkillNode } from './SkillNode';
import { SkillModal } from './SkillModal';
import { SkillConnections } from './SkillConnections';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/userStore';
import { SkillTreeService } from '@/services/skillTreeService';
import type { Skill } from '@/types';

interface SkillTreeProps {
    className?: string;
    onSkillSelect?: (skill: Skill) => void;
}

export function SkillTree({ className }: SkillTreeProps) {
    const { user, unlockSkill, addSkillPoints } = useUserStore();
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'tree' | 'categories'>('tree');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const skillTree = SkillTreeService.getSkillTree();
    const stats = user ? SkillTreeService.getSkillTreeStats(user) : null;
    const availableSkills = user ? SkillTreeService.getAvailableSkills(user) : [];

    // Filter skills based on selected category
    const filteredSkills = selectedCategory === 'all'
        ? skillTree.skills
        : skillTree.skills.filter(skill => skill.category.id === selectedCategory);

    const handleSkillClick = (skill: Skill) => {
        setSelectedSkill(skill);
    };

    const handleUnlockSkill = (skillId: string) => {
        if (user && SkillTreeService.canUnlockSkill(skillId, user)) {
            unlockSkill(skillId);
            setSelectedSkill(null);
        }
    };

    const handleZoom = (delta: number) => {
        const newScale = Math.max(0.5, Math.min(2, scale + delta));
        setScale(newScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left mouse button
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        handleZoom(delta);
    };

    // Center the skill tree on mount
    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setPosition({
                x: rect.width / 2 - 400, // Center horizontally
                y: rect.height / 2 - 300  // Center vertically
            });
        }
    }, []);

    // Demo function to add skill points
    const handleAddSkillPoints = () => {
        addSkillPoints(5);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-600">Please log in to view your skill tree.</p>
            </div>
        );
    }

    return (
        <div className={`relative h-full ${className}`}>
            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Card className="p-3 bg-white/90 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold text-gray-900">
                                {user.skillPoints} Skill Points
                            </span>
                        </div>
                    </Card>

                    {stats && (
                        <Card className="p-3 bg-white/90 backdrop-blur-sm">
                            <div className="text-sm text-gray-600">
                                {stats.unlockedSkills}/{stats.totalSkills} Skills Unlocked
                                <div className="text-xs text-gray-500">
                                    {Math.round(stats.completionPercentage)}% Complete
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {/* Demo button - remove in production */}
                    <Button
                        onClick={handleAddSkillPoints}
                        variant="outline"
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Points
                    </Button>

                    {/* View Mode Toggle */}
                    <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('tree')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'tree'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Tree View
                        </button>
                        <button
                            onClick={() => setViewMode('categories')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'categories'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Categories
                        </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1">
                        <button
                            onClick={() => handleZoom(-0.2)}
                            className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            -
                        </button>
                        <span className="px-2 py-1 text-sm font-medium text-gray-600">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={() => handleZoom(0.2)}
                            className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filter (Categories View) */}
            {viewMode === 'categories' && (
                <div className="absolute top-20 left-4 z-10">
                    <Card className="p-3 bg-white/90 backdrop-blur-sm">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            {skillTree.categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                        ? `bg-${category.color}-500 text-white`
                                        : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* Skill Tree Canvas */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <motion.div
                    className="relative w-full h-full"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: '0 0'
                    }}
                    animate={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
                    }}
                    transition={{ type: 'tween', duration: 0.1 }}
                >
                    {/* Skill Connections */}
                    {viewMode === 'tree' && (
                        <SkillConnections
                            connections={skillTree.connections}
                            skills={filteredSkills}
                            unlockedSkills={user.unlockedSkills}
                            hoveredSkill={hoveredSkill}
                        />
                    )}

                    {/* Skill Nodes */}
                    <div className="relative">
                        {filteredSkills.map((skill, index) => (
                            <SkillNode
                                key={skill.id}
                                skill={skill}
                                isUnlocked={user.unlockedSkills.includes(skill.id)}
                                canUnlock={SkillTreeService.canUnlockSkill(skill.id, user)}
                                isAvailable={availableSkills.some(s => s.id === skill.id)}
                                position={viewMode === 'tree' ? skill.position : {
                                    x: (index % 4) * 200 + 100,
                                    y: Math.floor(index / 4) * 200 + 100
                                }}
                                onClick={() => handleSkillClick(skill)}
                                onHover={setHoveredSkill}
                                scale={scale}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Available Skills Notification */}
            <AnimatePresence>
                {availableSkills.length > 0 && (
                    <motion.div
                        className="absolute bottom-4 right-4 z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <Card className="p-4 bg-green-50 border-green-200">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-900">
                                        {availableSkills.length} skill{availableSkills.length !== 1 ? 's' : ''} available!
                                    </p>
                                    <p className="text-sm text-green-700">
                                        Click on highlighted skills to unlock them
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skill Detail Modal */}
            <SkillModal
                skill={selectedSkill}
                isOpen={!!selectedSkill}
                onClose={() => setSelectedSkill(null)}
                onUnlock={handleUnlockSkill}
                canUnlock={selectedSkill ? SkillTreeService.canUnlockSkill(selectedSkill.id, user) : false}
                isUnlocked={selectedSkill ? user.unlockedSkills.includes(selectedSkill.id) : false}
                userSkillPoints={user.skillPoints}
            />

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 z-10">
                <Card className="p-3 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Info className="w-4 h-4" />
                        <span>Drag to pan • Scroll to zoom • Click skills to view details</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}