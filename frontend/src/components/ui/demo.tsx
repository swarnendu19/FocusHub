import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Button,
    ProgressBar,
    GameCard,
    Toast,
    ToastProvider,
    ToastViewport,
    ToastTitle,
    ToastDescription,
    Badge
} from './index'
import { Star, Target, Trophy, Zap, Play, Pause } from 'lucide-react'

export const UIComponentsDemo = () => {
    const [progress, setProgress] = useState(0)
    const [showToast, setShowToast] = useState(false)
    const [toastVariant, setToastVariant] = useState<'default' | 'success' | 'error' | 'warning' | 'xp' | 'achievement'>('default')

    const handleProgressIncrease = () => {
        setProgress(prev => Math.min(prev + 25, 100))
    }

    const handleShowToast = (variant: typeof toastVariant) => {
        setToastVariant(variant)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Duolingo-Style UI Components
                        </h1>
                        <p className="text-lg text-gray-600">
                            Interactive demo of our gamified UI component library
                        </p>
                    </motion.div>

                    {/* Buttons Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">Buttons</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="default">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Danger</Button>
                            <Button variant="super">Super ✨</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                            <Button variant="locked" disabled>Locked</Button>
                        </div>
                        <div className="flex gap-4">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon"><Star className="h-4 w-4" /></Button>
                        </div>
                    </motion.section>

                    {/* Progress Bars Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">Progress Bars</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-2">Interactive Progress ({progress}%)</p>
                                <ProgressBar
                                    value={progress}
                                    color="primary"
                                    showLabel={true}
                                    onComplete={() => handleShowToast('success')}
                                />
                                <Button
                                    onClick={handleProgressIncrease}
                                    className="mt-2"
                                    size="sm"
                                    disabled={progress >= 100}
                                >
                                    Increase Progress
                                </Button>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">XP Progress</p>
                                <ProgressBar value={75} color="xp" showLabel={true} />
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Streak Progress</p>
                                <ProgressBar value={60} color="streak" showLabel={true} />
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Different Sizes</p>
                                <div className="space-y-2">
                                    <ProgressBar value={40} size="sm" color="secondary" />
                                    <ProgressBar value={60} size="md" color="primary" />
                                    <ProgressBar value={80} size="lg" color="accent" />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Game Cards Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">Game Cards</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <GameCard
                                title="Daily Challenge"
                                description="Complete your daily coding challenge"
                                progress={75}
                                xpReward={100}
                                icon={<Target className="h-6 w-6" />}
                                color="primary"
                                onClick={() => handleShowToast('xp')}
                            />
                            <GameCard
                                title="Streak Master"
                                description="Maintain a 7-day streak"
                                isCompleted={true}
                                xpReward={250}
                                icon={<Trophy className="h-6 w-6" />}
                                color="streak"
                            />
                            <GameCard
                                title="Advanced Quest"
                                description="Unlock after reaching level 10"
                                isLocked={true}
                                xpReward={500}
                                icon={<Zap className="h-6 w-6" />}
                                color="xp"
                            />
                            <GameCard
                                title="Team Project"
                                description="Collaborate with others"
                                progress={30}
                                icon={<Star className="h-6 w-6" />}
                                color="secondary"
                                onClick={() => handleShowToast('default')}
                            >
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">Team</Badge>
                                    <Badge variant="secondary">Active</Badge>
                                </div>
                            </GameCard>
                        </div>
                    </motion.section>

                    {/* Toast Notifications Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">Toast Notifications</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => handleShowToast('default')}
                            >
                                Default Toast
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleShowToast('success')}
                            >
                                Success Toast
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleShowToast('error')}
                            >
                                Error Toast
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleShowToast('warning')}
                            >
                                Warning Toast
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleShowToast('xp')}
                            >
                                XP Toast
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleShowToast('achievement')}
                            >
                                Achievement Toast
                            </Button>
                        </div>
                    </motion.section>

                    {/* Animation Showcase */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">Animation Showcase</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                className="p-6 bg-white rounded-xl shadow-lg border-2 border-primary/20"
                                whileHover={{ scale: 1.05, rotateY: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <h3 className="font-bold text-lg mb-2">Hover Effects</h3>
                                <p className="text-gray-600">Hover over this card to see 3D transforms</p>
                            </motion.div>
                            <motion.div
                                className="p-6 bg-gradient-to-r from-xp/20 to-warning/20 rounded-xl shadow-lg border-2 border-xp/30"
                                animate={{
                                    boxShadow: [
                                        "0 0 5px rgba(255, 215, 0, 0.5)",
                                        "0 0 20px rgba(255, 215, 0, 0.8)",
                                        "0 0 5px rgba(255, 215, 0, 0.5)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <h3 className="font-bold text-lg mb-2">Glow Animation</h3>
                                <p className="text-gray-600">Continuous glow effect for special elements</p>
                            </motion.div>
                            <motion.div
                                className="p-6 bg-white rounded-xl shadow-lg border-2 border-secondary/20"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <h3 className="font-bold text-lg mb-2">Float Animation</h3>
                                <p className="text-gray-600">Gentle floating motion for visual interest</p>
                            </motion.div>
                        </div>
                    </motion.section>
                </div>

                {/* Toast Notifications */}
                {showToast && (
                    <Toast variant={toastVariant} open={showToast}>
                        <ToastTitle>
                            {toastVariant === 'success' && 'Success!'}
                            {toastVariant === 'error' && 'Error Occurred'}
                            {toastVariant === 'warning' && 'Warning'}
                            {toastVariant === 'xp' && 'XP Gained!'}
                            {toastVariant === 'achievement' && 'Achievement Unlocked!'}
                            {toastVariant === 'default' && 'Notification'}
                        </ToastTitle>
                        <ToastDescription>
                            {toastVariant === 'success' && 'Your action was completed successfully.'}
                            {toastVariant === 'error' && 'Something went wrong. Please try again.'}
                            {toastVariant === 'warning' && 'Please check your input and try again.'}
                            {toastVariant === 'xp' && 'You earned 100 XP points!'}
                            {toastVariant === 'achievement' && 'You unlocked a new achievement!'}
                            {toastVariant === 'default' && 'This is a default notification message.'}
                        </ToastDescription>
                    </Toast>
                )}
                <ToastViewport />
            </div>
        </ToastProvider>
    )
}