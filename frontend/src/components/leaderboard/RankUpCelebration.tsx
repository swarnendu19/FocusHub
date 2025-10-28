import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, Medal, Star, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RankUpCelebrationProps {
    isVisible: boolean;
    onClose: () => void;
    oldRank: number;
    newRank: number;
    username: string;
    avatar?: string;
    xpGained?: number;
    duration?: number;
}

export function RankUpCelebration({
    isVisible,
    onClose,
    oldRank,
    newRank,
    username,
    avatar,
    xpGained = 0,
    duration = 3000
}: RankUpCelebrationProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    useEffect(() => {
        if (isVisible) {
            setShowConfetti(true);

            // Generate confetti particles
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 0.5
            }));
            setParticles(newParticles);

            // Auto close after duration
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-12 h-12 text-yellow-500" />;
        if (rank === 2) return <Trophy className="w-12 h-12 text-gray-400" />;
        if (rank === 3) return <Medal className="w-12 h-12 text-amber-600" />;
        return <TrendingUp className="w-12 h-12 text-blue-500" />;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'from-yellow-400 to-yellow-600';
        if (rank === 2) return 'from-gray-300 to-gray-500';
        if (rank === 3) return 'from-amber-400 to-amber-600';
        return 'from-blue-400 to-blue-600';
    };

    const getRankText = (rank: number) => {
        if (rank === 1) return 'Champion!';
        if (rank === 2) return 'Runner-up!';
        if (rank === 3) return 'Third Place!';
        if (rank <= 10) return `Top ${rank}!`;
        return `Rank #${rank}`;
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Confetti Particles */}
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {particles.map((particle) => (
                                <motion.div
                                    key={particle.id}
                                    initial={{
                                        x: `${particle.x}vw`,
                                        y: '-10vh',
                                        rotate: 0,
                                        scale: 0
                                    }}
                                    animate={{
                                        y: '110vh',
                                        rotate: 360,
                                        scale: [0, 1, 1, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: particle.delay,
                                        ease: 'easeOut'
                                    }}
                                    className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
                                />
                            ))}
                        </div>
                    )}

                    {/* Main Celebration Card */}
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 10 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative"
                    >
                        <Card className="p-8 max-w-md mx-4 text-center relative overflow-hidden">
                            {/* Background Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${getRankColor(newRank)} opacity-10`} />

                            {/* Sparkle Effects */}
                            <div className="absolute top-4 right-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Sparkles className="w-6 h-6 text-yellow-500" />
                                </motion.div>
                            </div>
                            <div className="absolute top-4 left-4">
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Star className="w-5 h-5 text-pink-500" />
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Rank Up Animation */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="mb-6"
                                >
                                    {getRankIcon(newRank)}
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-3xl font-bold text-gray-900 mb-2"
                                >
                                    Rank Up!
                                </motion.h2>

                                {/* User Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center justify-center gap-3 mb-4"
                                >
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt={username}
                                            className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-gray-900">{username}</div>
                                        <div className="text-sm text-gray-600">
                                            {getRankText(newRank)}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Rank Change */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="mb-6"
                                >
                                    <div className="flex items-center justify-center gap-4 text-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">#{oldRank}</span>
                                        </div>
                                        <motion.div
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 1, repeat: 2 }}
                                        >
                                            <TrendingUp className="w-6 h-6 text-green-500" />
                                        </motion.div>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold bg-gradient-to-r ${getRankColor(newRank)} bg-clip-text text-transparent`}>
                                                #{newRank}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 mt-2">
                                        Moved up {oldRank - newRank} position{oldRank - newRank !== 1 ? 's' : ''}!
                                    </div>
                                </motion.div>

                                {/* XP Gained */}
                                {xpGained > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0 }}
                                        className="mb-6"
                                    >
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                                            <Star className="w-4 h-4 text-yellow-600" />
                                            <span className="text-yellow-800 font-semibold">
                                                +{xpGained} XP
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Close Button */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    <Button
                                        onClick={onClose}
                                        className={`bg-gradient-to-r ${getRankColor(newRank)} text-white hover:opacity-90 transition-opacity`}
                                    >
                                        Awesome!
                                    </Button>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}