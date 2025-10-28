import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    FolderOpen,
    Trophy,
    Star,
    Menu,
    X,
    User,
    LogOut,
    Settings,
    ChevronDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'XP', href: '/xp', icon: Star },
];

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout, isLoading } = useAuth();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        await logout();
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">FH</span>
                            </div>
                            <span className="font-bold text-xl text-gray-900">FocusHub</span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link key={item.name} to={item.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative"
                                    >
                                        <Button
                                            variant={isActive ? "default" : "ghost"}
                                            size="sm"
                                            className={`
                        flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200
                        ${isActive
                                                    ? 'bg-[#58CC02] text-white shadow-lg'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                }
                      `}
                                        >
                                            <Icon size={16} />
                                            <span className="font-medium">{item.name}</span>
                                        </Button>

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#58CC02] rounded-full"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Mobile Menu Button */}
                    <div className="flex items-center space-x-2">
                        {/* User Profile Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleUserMenu}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100"
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        {user?.username || 'User'}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={`text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </Button>
                            </motion.div>

                            {/* User Dropdown Menu */}
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                                    >
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                {user?.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center">
                                                        <span className="text-white font-bold">
                                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {user?.username || 'User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user?.email || 'user@example.com'}
                                                    </p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-xs text-[#58CC02] font-medium">
                                                            Level {user?.level || 1}
                                                        </span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-orange-500 font-medium">
                                                            {user?.totalXP || 0} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                            >
                                                <Settings size={16} />
                                                <span>Profile & Settings</span>
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50"
                                            >
                                                <LogOut size={16} />
                                                <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleMobileMenu}
                                    className="rounded-full p-2"
                                >
                                    {isMobileMenuOpen ? (
                                        <X size={20} className="text-gray-600" />
                                    ) : (
                                        <Menu size={20} className="text-gray-600" />
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <motion.div
                    initial={false}
                    animate={{
                        height: isMobileMenuOpen ? 'auto' : 0,
                        opacity: isMobileMenuOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="md:hidden overflow-hidden"
                >
                    <nav className="py-4 space-y-2">
                        {navigationItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive
                                                ? 'bg-[#58CC02] text-white shadow-md'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }
                    `}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </motion.div>
            </div>
        </header>
    );
}