import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceTesting, useMemoryMonitoring, useAnimationPerformance } from '@/hooks/usePerformanceTesting';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { Activity, Cpu, HardDrive, Wifi, WifiOff, Zap, X } from 'lucide-react';

interface PerformanceMonitorProps {
    enabled?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function PerformanceMonitor({
    enabled = process.env.NODE_ENV === 'development',
    position = 'bottom-right'
}: PerformanceMonitorProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'performance' | 'memory' | 'network' | 'vitals'>('performance');

    const performance = usePerformanceTesting();
    const memory = useMemoryMonitoring();
    const animation = useAnimationPerformance();
    const serviceWorker = useServiceWorker();

    const [webVitals, setWebVitals] = useState<any>(null);

    useEffect(() => {
        if (enabled && isExpanded) {
            performance.measureWebVitals().then(setWebVitals);
        }
    }, [enabled, isExpanded, performance]);

    if (!enabled) return null;

    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4';
            case 'top-right':
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            default:
                return 'bottom-4 right-4';
        }
    };

    const formatBytes = (bytes: number) => memory.formatBytes(bytes);
    const formatTime = (ms: number) => `${ms.toFixed(2)}ms`;

    return (
        <div className={`fixed ${getPositionClasses()} z-50`}>
            <AnimatePresence>
                {!isExpanded ? (
                    // Collapsed state - floating button
                    <motion.button
                        className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                        onClick={() => setIsExpanded(true)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Activity className="w-5 h-5" />
                    </motion.button>
                ) : (
                    // Expanded state - full monitor
                    <motion.div
                        className="bg-white border border-gray-200 rounded-lg shadow-xl w-80 max-h-96 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 text-sm">Performance Monitor</h3>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            {[
                                { id: 'performance', label: 'Perf', icon: Zap },
                                { id: 'memory', label: 'Memory', icon: HardDrive },
                                { id: 'network', label: 'Network', icon: serviceWorker.isOnline ? Wifi : WifiOff },
                                { id: 'vitals', label: 'Vitals', icon: Activity },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${activeTab === id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setActiveTab(id as any)}
                                >
                                    <div className="flex items-center justify-center space-x-1">
                                        <Icon className="w-3 h-3" />
                                        <span>{label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="p-3 max-h-64 overflow-y-auto">
                            {activeTab === 'performance' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-50 p-2 rounded">
                                            <div className="text-gray-600">FPS</div>
                                            <div className="font-semibold text-green-600">{animation.fps}</div>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <div className="text-gray-600">Renders</div>
                                            <div className="font-semibold">{performance.renderCount}</div>
                                        </div>
                                    </div>

                                    {performance.report && (
                                        <div>
                                            <div className="text-xs font-medium text-gray-700 mb-2">Components</div>
                                            <div className="space-y-1">
                                                {performance.report.components.slice(0, 3).map((comp: any) => (
                                                    <div key={comp.componentName} className="flex justify-between text-xs">
                                                        <span className="text-gray-600 truncate">{comp.componentName}</span>
                                                        <span className="font-mono">{formatTime(comp.averageRenderTime)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'memory' && (
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Used</span>
                                            <span className="font-mono">{formatBytes(memory.memoryUsage.used)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Total</span>
                                            <span className="font-mono">{formatBytes(memory.memoryUsage.total)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Limit</span>
                                            <span className="font-mono">{formatBytes(memory.memoryUsage.limit)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-600">Usage</span>
                                            <span className="font-mono">{memory.getMemoryUsagePercentage().toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(memory.getMemoryUsagePercentage(), 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'network' && (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        {serviceWorker.isOnline ? (
                                            <Wifi className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <WifiOff className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {serviceWorker.isOnline ? 'Online' : 'Offline'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Service Worker</span>
                                            <span className={serviceWorker.isRegistered ? 'text-green-600' : 'text-red-600'}>
                                                {serviceWorker.isRegistered ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cache Size</span>
                                            <span className="font-mono">{formatBytes(serviceWorker.cacheSize)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">PWA Mode</span>
                                            <span className={serviceWorker.isStandalone ? 'text-green-600' : 'text-gray-600'}>
                                                {serviceWorker.isStandalone ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vitals' && (
                                <div className="space-y-3">
                                    {webVitals ? (
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">LCP</span>
                                                <span className={`font-mono ${webVitals.lcp < 2500 ? 'text-green-600' : webVitals.lcp < 4000 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {formatTime(webVitals.lcp)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">FID</span>
                                                <span className={`font-mono ${webVitals.fid < 100 ? 'text-green-600' : webVitals.fid < 300 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {formatTime(webVitals.fid)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">CLS</span>
                                                <span className={`font-mono ${webVitals.cls < 0.1 ? 'text-green-600' : webVitals.cls < 0.25 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {webVitals.cls.toFixed(3)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">FCP</span>
                                                <span className={`font-mono ${webVitals.fcp < 1800 ? 'text-green-600' : webVitals.fcp < 3000 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {formatTime(webVitals.fcp)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">TTFB</span>
                                                <span className={`font-mono ${webVitals.ttfb < 800 ? 'text-green-600' : webVitals.ttfb < 1800 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {formatTime(webVitals.ttfb)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500 text-center py-4">
                                            Measuring Web Vitals...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Dev Mode</span>
                                <button
                                    onClick={() => performance.getReport()}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// HOC for wrapping components with performance monitoring
export function withPerformanceMonitoring<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    componentName: string
) {
    const PerformanceWrappedComponent = (props: P) => {
        const { renderCount } = usePerformanceTesting(componentName);

        useEffect(() => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`${componentName} rendered ${renderCount} times`);
            }
        }, [renderCount]);

        return <WrappedComponent {...props} />;
    };

    PerformanceWrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;

    return PerformanceWrappedComponent;
}