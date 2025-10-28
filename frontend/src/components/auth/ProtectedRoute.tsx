import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores';
import { apiService } from '@/services';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, user, login, setLoading, setError, isLoading } = useUserStore();
    const [isInitializing, setIsInitializing] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const initializeAuth = async () => {
            // If we already have a user and are authenticated, no need to check again
            if (isAuthenticated && user) {
                setIsInitializing(false);
                return;
            }

            // Development mode: Create a mock user for testing
            console.log('Environment check:', {
                isDev: import.meta.env.DEV,
                mode: import.meta.env.MODE,
                apiBaseUrl: import.meta.env.VITE_API_BASE_URL
            });

            if (import.meta.env.DEV) {
                console.log('Creating mock user for development...');
                const mockUser = {
                    id: 'dev-user-1',
                    username: 'DevUser',
                    email: 'dev@example.com',
                    avatar: undefined,
                    level: 5,
                    totalXP: 2500,
                    currentXP: 500,
                    xpToNextLevel: 500,
                    streak: 7,
                    joinDate: new Date(),
                    preferences: {
                        theme: 'light' as const,
                        animations: 'full' as const,
                        notifications: true,
                        soundEffects: true,
                    },
                    tasks: [],
                    completedTasks: [],
                    isOptIn: true,
                    tasksCompleted: 42,
                    unlockedBadges: ['first-task', 'week-streak'],
                    skillPoints: 10,
                    unlockedSkills: [],
                    skillBonuses: [],
                };

                console.log('Mock user created:', mockUser);
                login(mockUser);
                setIsInitializing(false);
                return;
            }

            try {
                setLoading(true);

                // Try to get current user from backend (check if session exists)
                const response = await apiService.auth.getCurrentUser();

                if (response.success && response.data) {
                    login(response.data);
                } else {
                    // No valid session, user needs to login
                    // Save current path for redirect after login
                    localStorage.setItem('auth_redirect_path', location.pathname + location.search);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err instanceof Error ? err.message : 'Authentication check failed');
            } finally {
                setLoading(false);
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, [isAuthenticated, user, login, setLoading, setError, location.pathname, location.search]);

    // Show loading spinner while initializing
    if (isInitializing || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mx-auto w-12 h-12"
                    >
                        <Loader2 className="h-12 w-12 text-blue-500" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
                        <p className="text-gray-600 mt-1">Checking your authentication status</p>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // Render protected content with animation
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}