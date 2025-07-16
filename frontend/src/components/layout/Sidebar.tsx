import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    FolderOpen,
    Trophy,
    Star,
    ChevronLeft,
    ChevronRight,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { Button } from '../ui/button';

const navigationItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'XP & Achievements', href: '/xp', icon: Star },
];

const bottomItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
    { name: 'Logout', href: '/logout', icon: LogOut },
];

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 80 }
    };

    const contentVariants = {
        expanded: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -20 }
    };

    return (
        <motion.aside
            variants={sidebarVariants}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            variants={contentVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            transition={{ duration: 0.2 }}
                            className="flex items-center space-x-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">FH</span>
                            </div>
                            <span className="font-bold text-lg text-gray-900">FocusHub</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="rounded-full p-2 hover:bg-gray-100"
                    >
                        {isCollapsed ? (
                            <ChevronRight size={16} className="text-gray-600" />
                        ) : (
                            <ChevronLeft size={16} className="text-gray-600" />
                        )}
                    </Button>
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} to={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => setHoveredItem(item.name)}
                                onHoverEnd={() => setHoveredItem(null)}
                                className="relative"
                            >
                                <div
                                    className={`
                    flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 relative
                    ${isActive
                                            ? 'bg-[#58CC02] text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }
                  `}
                                >
                                    <Icon size={20} className="flex-shrink-0" />

                                    <AnimatePresence mode="wait">
                                        {!isCollapsed && (
                                            <motion.span
                                                variants={contentVariants}
                                                initial="collapsed"
                                                animate="expanded"
                                                exit="collapsed"
                                                transition={{ duration: 0.2 }}
                                                className="font-medium truncate"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebarActiveTab"
                                            className="absolute right-2 w-2 h-2 bg-white rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </div>

                                {/* Tooltip for collapsed state */}
                                <AnimatePresence>
                                    {isCollapsed && hoveredItem === item.name && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50"
                                        >
                                            {item.name}
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                {bottomItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} to={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => setHoveredItem(item.name)}
                                onHoverEnd={() => setHoveredItem(null)}
                                className="relative"
                            >
                                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                                    <Icon size={18} className="flex-shrink-0" />

                                    <AnimatePresence mode="wait">
                                        {!isCollapsed && (
                                            <motion.span
                                                variants={contentVariants}
                                                initial="collapsed"
                                                animate="expanded"
                                                exit="collapsed"
                                                transition={{ duration: 0.2 }}
                                                className="font-medium text-sm truncate"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Tooltip for collapsed state */}
                                <AnimatePresence>
                                    {isCollapsed && hoveredItem === item.name && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50"
                                        >
                                            {item.name}
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.aside>
    );
}