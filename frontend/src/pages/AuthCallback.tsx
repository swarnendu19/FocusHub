import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores';
import { apiService } from '@/services';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function AuthCallback() {
    const [searchParams] = useSearchParams();
    const { login, setError, setLoading } = useUserStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [redirectPath, setRedirectPath] = useState('/');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                setLoading(true);

                // Check for error parameters from OAuth provider
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (error) {
                    throw new Error(errorDescription || `OAuth error: ${error}`);
                }

                // Get current user from backend (session should be established)
                const response = await apiService.auth.getCurrentUser();

                if (response.success && response.data) {
                    login(response.data);
                    setStatus('success');

                    // Check if there's a redirect path in localStorage
                    const savedRedirectPath = localStorage.getItem('auth_redirect_path');
                    if (savedRedirectPath) {
                        setRedirectPath(savedRedirectPath);
                        localStorage.removeItem('auth_redirect_path');
                    }

                    // Redirect after a short delay to show success animation
                    setTimeout(() => {
                        window.location.href = redirectPath;
                    }, 1500);
                } else {
                    throw new Error(response.error || 'Failed to get user information');
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
                setStatus('error');
                setLoading(false);
            }
        };

        handleAuthCallback();
    }, [searchParams, login, setError, setLoading, redirectPath]);

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="h-8 w-8 text-white" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                        <p className="text-gray-600 mt-2">You've been successfully logged in.</p>
                        <p className="text-sm text-gray-500 mt-1">Redirecting you to the app...</p>
                    </motion.div>

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mx-auto w-6 h-6"
                    >
                        <Loader2 className="h-6 w-6 text-green-500" />
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4 max-w-md mx-auto p-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
                    >
                        <XCircle className="h-8 w-8 text-white" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900">Authentication Failed</h1>
                        <p className="text-gray-600 mt-2">
                            We couldn't log you in. Please try again.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // Loading state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
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
                    <h1 className="text-xl font-semibold text-gray-900">Completing sign in...</h1>
                    <p className="text-gray-600 mt-1">Please wait while we set up your account.</p>
                </motion.div>
            </motion.div>
        </div>
    );
}