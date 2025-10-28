import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDeviceType, useBreakpoint } from '@/utils/responsive';
import { useReducedMotion, FocusManager, handleKeyboardNavigation } from '@/utils/accessibility';
import { AccessibleButton } from '@/components/ui/accessible-button';
import {
    Home,
    FolderOpen,
    Trophy,
    Target,
    BarChart3,
    User,
    Settings,
    Menu,
    X,
    Zap
} from 'lucide-react';

interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    description?: string;
}

const navigationItems: NavigationItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/',
        icon: Home,
        description: 'View your daily progress and active timers'
    },
    {
        id: 'projects',
        label: 'Projects',
        href: '/projects',
        icon: FolderOpen,
        description: 'Manage your tasks and projects'
    },
    {
        id: 'leaderboard',
        label: 'Leaderboard',
        href: '/leaderboard',
        icon: Trophy,
        description: 'See how you rank against others'
    },
    {
        id: 'achievements',
        label: 'Achievements',
        href: '/achievements',
        icon: Target,
        description: 'View your unlocked achievements'
    },
    {
        id: 'skills',
        label: 'Skills',
        href: '/skills',
        icon: Zap,
        description: 'Explore your skill tree progression'
    },
    {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        description: 'Analyze your productivity patterns'
    },
    {
        id: 'profile',
        label: 'Profile',
        href: '/profile',
        icon: User,
        description: 'Manage your profile and preferences'
    },
    {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: Settings,
        description: 'Configure app settings'
    },
];

interface ResponsiveNavigationProps {
    className?: string;
}

export function ResponsiveNavigation({ className }: ResponsiveNavigationProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();
    const deviceType = useDeviceType();
    const isDesktop = useBreakpoint('lg');
    const prefersReducedMotion = useReducedMotion();
    const mobileMenuRef = React.useRef<HTMLDivElement>(null);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle escape key to close mobile menu
    React.useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen]);

    // Focus trap for mobile menu
    React.useEffect(() => {
        if (isMobileMenuOpen && mobileMenuRef.current) {
            const cleanup = FocusManager.trapFocus(mobileMenuRef.current);
            return cleanup;
        }
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMobileMenuKeyDown = (event: React.KeyboardEvent) => {
        handleKeyboardNavigation(event, {
            onEscape: () => setIsMobileMenuOpen(false),
        });
    };

    // Animation variants
    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            x: '-100%',
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.3,
                ease: 'easeInOut',
            },
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.3,
                ease: 'easeInOut',
            },
        },
    };

    const overlayVariants = {
        closed: {
            opacity: 0,
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.2,
            },
        },
        open: {
            opacity: 1,
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.2,
            },
        },
    };

    const NavigationLink = ({ item }: { item: NavigationItem }) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        return (
            <Link
                to={item.href}
                className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                    !isActive && 'text-gray-700 dark:text-gray-300'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-describedby={`${item.id}-description`}
            >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                    <span
                        className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center"
                        aria-label={`${item.badge} notifications`}
                    >
                        {item.badge}
                    </span>
                )}
                <span id={`${item.id}-description`} className="sr-only">
                    {item.description}
                </span>
            </Link>
        );
    };

    // Desktop sidebar navigation
    if (isDesktop) {
        return (
            <nav
                className={cn(
                    'fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40',
                    'flex flex-col',
                    className
                )}
                aria-label="Main navigation"
            >
                {/* Logo/Brand */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        FocusHub
                    </h1>
                </div>

                {/* Navigation items */}
                <div className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2" role="list">
                        {navigationItems.map((item) => (
                            <li key={item.id}>
                                <NavigationLink item={item} />
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        );
    }

    // Mobile navigation
    return (
        <>
            {/* Mobile header with menu button */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
                <div className="flex items-center justify-between h-full px-4">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                        FocusHub
                    </h1>

                    <AccessibleButton
                        variant="ghost"
                        size="sm"
                        onClick={toggleMobileMenu}
                        ariaLabel={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        ariaExpanded={isMobileMenuOpen}
                        ariaHaspopup="true"
                        className="lg:hidden"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </AccessibleButton>
                </div>
            </header>

            {/* Mobile menu overlay and sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-40"
                            variants={overlayVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Mobile menu */}
                        <motion.nav
                            ref={mobileMenuRef}
                            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 flex flex-col"
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            onKeyDown={handleMobileMenuKeyDown}
                            aria-label="Mobile navigation"
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* Mobile menu header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Navigation
                                </h2>
                                <AccessibleButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    ariaLabel="Close navigation menu"
                                >
                                    <X className="h-6 w-6" aria-hidden="true" />
                                </AccessibleButton>
                            </div>

                            {/* Mobile navigation items */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <ul className="space-y-2" role="list">
                                    {navigationItems.map((item) => (
                                        <li key={item.id}>
                                            <NavigationLink item={item} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom navigation for mobile (alternative) */}
            {deviceType === 'mobile' && (
                <nav
                    className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40"
                    aria-label="Bottom navigation"
                >
                    <div className="flex justify-around py-2">
                        {navigationItems.slice(0, 5).map((item) => {
                            const isActive = location.pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.id}
                                    to={item.href}
                                    className={cn(
                                        'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                                        'focus:outline-none focus:ring-2 focus:ring-blue-500',
                                        isActive && 'text-blue-600 dark:text-blue-400',
                                        !isActive && 'text-gray-600 dark:text-gray-400'
                                    )}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={item.label}
                                >
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                    {item.badge && (
                                        <span
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[1rem] text-center"
                                            aria-label={`${item.badge} notifications`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </>
    );
}