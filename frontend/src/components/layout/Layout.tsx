import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';

interface LayoutProps {
    children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Auto-collapse sidebar on mobile
            if (mobile) {
                setIsSidebarCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Layout with Sidebar */}
            <div className="hidden md:flex">
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                />

                <motion.main
                    animate={{
                        marginLeft: isSidebarCollapsed ? 80 : 280,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex-1 min-h-screen"
                >
                    <div className="p-6">
                        <PageTransition>
                            {children || <Outlet />}
                        </PageTransition>
                    </div>
                </motion.main>
            </div>

            {/* Mobile Layout with Header */}
            <div className="md:hidden">
                <Header />
                <main className="pt-4 pb-6 px-4">
                    <PageTransition>
                        {children || <Outlet />}
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}

// Alternative layout without sidebar (for auth pages, etc.)
export function SimpleLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                <PageTransition>
                    {children || <Outlet />}
                </PageTransition>
            </main>
        </div>
    );
}

// Full-screen layout (for modals, overlays, etc.)
export function FullScreenLayout({ children }: LayoutProps) {
    return (
        <div className="fixed inset-0 bg-gray-50 z-50">
            <PageTransition>
                {children || <Outlet />}
            </PageTransition>
        </div>
    );
}