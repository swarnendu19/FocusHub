import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCelebration, celebrationUtils } from './CelebrationManager';
import { useSound } from '@/services/soundService';
import {
    Zap,
    Trophy,
    Star,
    CheckCircle,
    Target,
    Volume2,
    VolumeX,
    Sparkles,
    Award,
    TrendingUp
} from 'lucide-react';

export function CelebrationDemo() {
    const { celebrate } = useCelebration();
    const { playSound, setEnabled, isAudioEnabled } = useSound();
    const [soundEnabled, setSoundEnabled] = useState(isAudioEnabled());

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        setEnabled(newState);
    };

    const celebrationButtons = [
        {
            label: 'XP Gain (Small)',
            icon: <Zap className="w-4 h-4" />,
            color: 'bg-green-500 hover:bg-green-600',
            action: () => celebrate(celebrationUtils.xpGain(25))
        },
        {
            label: 'XP Gain (Large)',
            icon: <TrendingUp className="w-4 h-4" />,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => celebrate(celebrationUtils.xpGain(150))
        },
        {
            label: 'Level Up',
            icon: <Star className="w-4 h-4" />,
            color: 'bg-yellow-500 hover:bg-yellow-600',
            action: () => celebrate(celebrationUtils.levelUp(5))
        },
        {
            label: 'Achievement (Common)',
            icon: <Trophy className="w-4 h-4" />,
            color: 'bg-blue-500 hover:bg-blue-600',
            action: () => celebrate(celebrationUtils.achievementUnlock('First Task', 'common'))
        },
        {
            label: 'Achievement (Epic)',
            icon: <Award className="w-4 h-4" />,
            color: 'bg-purple-500 hover:bg-purple-600',
            action: () => celebrate(celebrationUtils.achievementUnlock('Master Achiever', 'epic'))
        },
        {
            label: 'Achievement (Legendary)',
            icon: <Sparkles className="w-4 h-4" />,
            color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
            action: () => celebrate(celebrationUtils.achievementUnlock('Legendary Master', 'legendary'))
        },
        {
            label: 'Task Complete',
            icon: <CheckCircle className="w-4 h-4" />,
            color: 'bg-cyan-500 hover:bg-cyan-600',
            action: () => celebrate(celebrationUtils.taskComplete('Important Task', 50))
        },
        {
            label: 'Streak Milestone',
            icon: <Target className="w-4 h-4" />,
            color: 'bg-orange-500 hover:bg-orange-600',
            action: () => celebrate(celebrationUtils.streakMilestone(10))
        },
        {
            label: 'Skill Unlock',
            icon: <Star className="w-4 h-4" />,
            color: 'bg-indigo-500 hover:bg-indigo-600',
            action: () => celebrate(celebrationUtils.skillUnlock('Focus Master'))
        },
        {
            label: 'Major Achievement',
            icon: <Trophy className="w-4 h-4" />,
            color: 'bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600',
            action: () => celebrate({
                type: 'major-achievement',
                intensity: 'high',
                message: 'Incredible Achievement!',
                duration: 5000
            })
        }
    ];

    const soundButtons = [
        { label: 'XP Gain', sound: 'xp-gain' as const },
        { label: 'Level Up', sound: 'level-up' as const },
        { label: 'Achievement', sound: 'achievement-unlock' as const },
        { label: 'Task Complete', sound: 'task-complete' as const },
        { label: 'Success', sound: 'success' as const },
        { label: 'Celebration', sound: 'celebration' as const },
    ];

    return (
        <motion.div
            className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Celebration System Demo</h2>
                <p className="text-gray-600">
                    Test all the celebration effects and animations. Click the buttons below to trigger different types of celebrations.
                </p>
            </div>

            {/* Sound Control */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Sound Effects</h3>
                        <p className="text-sm text-gray-600">Toggle sound effects on/off</p>
                    </div>
                    <Button
                        onClick={toggleSound}
                        variant={soundEnabled ? "default" : "outline"}
                        size="sm"
                        className="flex items-center space-x-2"
                    >
                        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        <span>{soundEnabled ? 'Enabled' : 'Disabled'}</span>
                    </Button>
                </div>
            </div>

            {/* Celebration Effects */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Celebration Effects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {celebrationButtons.map((button, index) => (
                        <motion.div
                            key={button.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Button
                                onClick={button.action}
                                className={`w-full ${button.color} text-white flex items-center justify-center space-x-2 py-3`}
                                variant="default"
                            >
                                {button.icon}
                                <span className="text-sm font-medium">{button.label}</span>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sound Effects Only */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sound Effects Only</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {soundButtons.map((button, index) => (
                        <motion.div
                            key={button.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Button
                                onClick={() => playSound(button.sound)}
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                disabled={!soundEnabled}
                            >
                                {button.label}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Confetti:</strong> Colorful particles that explode from the center</li>
                    <li>• <strong>Particle Effects:</strong> Themed particles based on celebration type</li>
                    <li>• <strong>Screen Shake:</strong> Subtle screen movement for dramatic effect</li>
                    <li>• <strong>Sound Effects:</strong> Procedurally generated audio feedback</li>
                    <li>• <strong>Intensity Levels:</strong> Low, medium, and high intensity variations</li>
                    <li>• <strong>Accessibility:</strong> Respects user preferences for reduced motion</li>
                </ul>
            </div>
        </motion.div>
    );
}