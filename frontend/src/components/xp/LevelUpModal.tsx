import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Trophy, Star, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    newLevel: number;
    xpGained: number;
    previousLevel: number;
}

export function LevelUpModal({ isOpen, onClose, newLevel, xpGained, previousLevel }: LevelUpModalProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            // Auto-close after 5 seconds if user doesn't interact
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: 50 }}
                    transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-10" />

                    {/* Content */}
                    <div className="relative p-8 text-center">
                        {/* Trophy Animation */}
                        <motion.div
                            className="flex justify-center mb-6"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                damping: 15,
                                stiffness: 200
                            }}
                        >
                            <div className="relative">
                                <Trophy className="w-20 h-20 text-yellow-500" />
                                {/* Sparkle Effects */}
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute"
                                        style={{
                                            top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}px`,
                                            left: `${40 + Math.cos(i * 60 * Math.PI / 180) * 30}px`,
                                        }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            opacity: [0, 1, 0],
                                            rotate: [0, 180, 360]
                                        }}
                                        transition={{
                                            delay: 0.5 + i * 0.1,
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                    >
                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Level Up Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-6"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Level Up!
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Congratulations! You've reached a new level!
                            </p>

                            {/* Level Progression */}
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <motion.div
                                    className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full text-gray-600 font-bold text-xl"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 0.8, 1] }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    {previousLevel}
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <Star className="w-8 h-8 text-yellow-500" />
                                </motion.div>

                                <motion.div
                                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full text-white font-bold text-xl shadow-lg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{
                                        delay: 1,
                                        type: 'spring',
                                        damping: 15,
                                        stiffness: 200
                                    }}
                                >
                                    {newLevel}
                                </motion.div>
                            </div>

                            {/* XP Gained */}
                            <motion.div
                                className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 border border-blue-200"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                <p className="text-sm text-gray-600 mb-1">XP Gained</p>
                                <motion.p
                                    className="text-2xl font-bold text-blue-600"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.4 }}
                                >
                                    +{xpGained.toLocaleString()}
                                </motion.p>
                            </motion.div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 }}
                        >
                            <Button
                                onClick={onClose}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                            >
                                Continue Your Journey!
                            </Button>
                        </motion.div>
                    </div>

                    {/* Confetti Effect */}
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: '-10px',
                                    }}
                                    initial={{ y: -10, opacity: 1, rotate: 0 }}
                                    animate={{
                                        y: 400,
                                        opacity: 0,
                                        rotate: 360,
                                        x: Math.random() * 100 - 50
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: Math.random() * 2,
                                        ease: 'easeOut'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}