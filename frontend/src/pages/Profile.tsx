import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress';
import {
    User,
    Settings,
    Trophy,
    Target,
    Clock,
    Star,
    Eye,
    EyeOff,
    Palette,
    Zap
} from 'lucide-react';

export function Profile() {
    const { user, updateUser, updatePreferences, isLoading, setLoading, setError } = useUserStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const [localPreferences, setLocalPreferences] = useState(user?.preferences || {
        theme: 'light' as const,
        animations: 'full' as const,
        notifications: true,
        soundEffects: true
    });

    // Animated counter hook
    const useAnimatedCounter = (end: number, duration: number = 1000) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let startTime: number;
            let animationFrame: number;

            const animate = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);

                setCount(Math.floor(progress * end));

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                }
            };

            animationFrame = requestAnimationFrame(animate);

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        }, [end, duration]);

        return count;
    };

    const animatedXP = useAnimatedCounter(user?.totalXP || 0);
    const animatedLevel = useAnimatedCounter(user?.level || 1);
    const animatedTasksCompleted = useAnimatedCounter(user?.tasksCompleted || 0);
    const animatedBadges = useAnimatedCounter(user?.unlockedBadges?.length || 0);

    const handleOptInToggle = async () => {
        if (!user) return;

        setIsUpdating(true);
        try {
            const response = await apiService.users.updateOptIn(user.id, !user.isOptIn);

            if (response.success && response.data) {
                updateUser({ isOptIn: response.data.isOptIn });
                toast.success(
                    response.data.isOptIn
                        ? 'You are now visible on the leaderboard!'
                        : 'You are now hidden from the leaderboard'
                );
            } else {
                throw new Error(response.error || 'Failed to update opt-in status');
            }
        } catch (error) {
            console.error('Error updating opt-in status:', error);
            toast.error('Failed to update leaderboard visibility');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePreferencesUpdate = async () => {
        if (!user) return;

        setIsUpdating(true);
        try {
            // Update local preferences immediately for better UX
            updatePreferences(localPreferences);

            // Update user data on server
            const response = await apiService.users.update(user.id, {
                preferences: localPreferences
            });

            if (response.success && response.data) {
                updateUser(response.data);
                toast.success('Preferences updated successfully!');
            } else {
                throw new Error(response.error || 'Failed to update preferences');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            toast.error('Failed to update preferences');
            // Revert local changes on error
            setLocalPreferences(user.preferences);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Profile & Settings
                </h1>
                <p className="text-gray-600">
                    Manage your profile information and customize your experience
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Information */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Your account details and public information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* User Avatar and Basic Info */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=58CC02&color=fff`}
                                        alt={user.username}
                                        className="w-16 h-16 rounded-full border-4 border-primary/20"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {animatedLevel}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{user.username}</h3>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-500">
                                        Member since {new Date(user.joinDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* XP Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Level Progress</span>
                                    <span className="text-sm text-gray-500">
                                        {user.currentXP} / {user.currentXP + user.xpToNextLevel} XP
                                    </span>
                                </div>
                                <ProgressBar
                                    value={(user.currentXP / (user.currentXP + user.xpToNextLevel)) * 100}
                                    animated={true}
                                    color="primary"
                                    size="sm"
                                />
                            </div>

                            {/* Leaderboard Visibility Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {user.isOptIn ? (
                                        <Eye className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">Leaderboard Visibility</p>
                                        <p className="text-sm text-gray-600">
                                            {user.isOptIn
                                                ? 'You are visible on the public leaderboard'
                                                : 'You are hidden from the public leaderboard'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant={user.isOptIn ? "secondary" : "default"}
                                    size="sm"
                                    onClick={handleOptInToggle}
                                    disabled={isUpdating}
                                >
                                    {user.isOptIn ? 'Hide' : 'Show'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Statistics */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{animatedXP.toLocaleString()}</div>
                                    <div className="text-sm text-blue-600">Total XP</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{animatedLevel}</div>
                                    <div className="text-sm text-green-600">Level</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{animatedTasksCompleted}</div>
                                    <div className="text-sm text-purple-600">Tasks Done</div>
                                </div>
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{animatedBadges}</div>
                                    <div className="text-sm text-orange-600">Badges</div>
                                </div>
                            </div>

                            {/* Streak */}
                            <div className="text-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <span className="text-2xl">🔥</span>
                                    <span className="text-2xl font-bold text-orange-600">{user.streak}</span>
                                </div>
                                <div className="text-sm text-orange-600 font-medium">Day Streak</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Preferences
                        </CardTitle>
                        <CardDescription>
                            Customize your app experience (settings are saved locally and synced to your account)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Theme Settings */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    <label className="text-sm font-medium text-gray-700">Theme</label>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['light', 'dark', 'auto'] as const).map((theme) => (
                                        <Button
                                            key={theme}
                                            variant={localPreferences.theme === theme ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setLocalPreferences(prev => ({ ...prev, theme }))}
                                            className="capitalize"
                                        >
                                            {theme}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Animation Settings */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    <label className="text-sm font-medium text-gray-700">Animations</label>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['full', 'reduced', 'none'] as const).map((animation) => (
                                        <Button
                                            key={animation}
                                            variant={localPreferences.animations === animation ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setLocalPreferences(prev => ({ ...prev, animations: animation }))}
                                            className="capitalize"
                                        >
                                            {animation}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Notification Settings */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Notifications</label>
                                <Button
                                    variant={localPreferences.notifications ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setLocalPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                                    className="w-full"
                                >
                                    {localPreferences.notifications ? 'Enabled' : 'Disabled'}
                                </Button>
                            </div>

                            {/* Sound Effects Settings */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Sound Effects</label>
                                <Button
                                    variant={localPreferences.soundEffects ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setLocalPreferences(prev => ({ ...prev, soundEffects: !prev.soundEffects }))}
                                    className="w-full"
                                >
                                    {localPreferences.soundEffects ? 'Enabled' : 'Disabled'}
                                </Button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                onClick={handlePreferencesUpdate}
                                disabled={isUpdating || JSON.stringify(localPreferences) === JSON.stringify(user.preferences)}
                                className="min-w-[120px]"
                            >
                                {isUpdating ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}