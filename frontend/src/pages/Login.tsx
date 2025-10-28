import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores';
import { apiService } from '@/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Chrome } from 'lucide-react';

export function Login() {
    const { isAuthenticated, setLoading, setError, isLoading, error } = useUserStore();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleGoogleLogin = async () => {
        try {
            setIsRedirecting(true);
            setLoading(true);
            setError(null);

            // Get Google OAuth redirect URL from backend
            const response = await apiService.auth.loginWithGoogle();

            if (response.success && response.data?.redirectUrl) {
                // Redirect to Google OAuth
                window.location.href = response.data.redirectUrl;
            } else {
                throw new Error(response.error || 'Failed to initiate Google login');
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError(err instanceof Error ? err.message : 'Failed to login with Google');
            setIsRedirecting(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                        >
                            <span className="text-2xl font-bold text-white">T</span>
                        </motion.div>

                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Welcome to TimeTracker
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                Track your time, level up your productivity
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                onClick={handleGoogleLogin}
                                disabled={isLoading || isRedirecting}
                                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md"
                                variant="outline"
                            >
                                {isLoading || isRedirecting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="mr-2"
                                    >
                                        <Loader2 className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <Chrome className="mr-2 h-5 w-5 text-blue-500" />
                                )}
                                {isRedirecting ? 'Redirecting...' : 'Continue with Google'}
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center text-sm text-gray-500"
                        >
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Animated background elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 100, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-xl"
                    />
                </div>
            </motion.div>
        </div>
    );
}