import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    FolderOpen,
    Trophy,
    Star,
    Menu,
    X,
    User
} from 'lucide-react';
import { Button } from '../ui/button';

const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'XP', href: '/xp', icon: Star },
];

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

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
                        {/* User Profile Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="rounded-full p-2">
                                <User size={20} className="text-gray-600" />
                            </Button>
                        </motion.div>

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