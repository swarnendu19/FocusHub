/**
 * Performance Debugger Component
 * 
 * Development tool for monitoring and debugging performance
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { env } from '@/config/env';

export function PerformanceDebugger() {
    const [metrics, setMetrics] = useState({
        fps: 0,
        memory: {
            used: 0,
            total: 0,
            limit: 0,
        },
        timing: {
            navigationStart: 0,
            loadEventEnd: 0,
            domComplete: 0,
            domInteractive: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
        },
        resources: {
            total: 0,
            js: 0,
            css: 0,
            img: 0,
            other: 0,
        },
    });

    const [isMonitoring, setIsMonitoring] = useState(false);
    const [frameCount, setFrameCount] = useState(0);

    // Only show in development or when debug mode is enabled
    if (!env.enableDebugMode && env.isProduction) {
        return null;
    }

    // Start/stop monitoring
    const toggleMonitoring = () => {
        setIsMonitoring(!isMonitoring);
    };

    // Collect performance metrics
    useEffect(() => {
        if (!isMonitoring) return;

        // Frame rate monitoring
        let frameId: number;
        let lastTime = performance.now();
        let frames = 0;

        const measureFrameRate = (timestamp: number) => {
            frames++;

            const elapsed = timestamp - lastTime;
            if (elapsed >= 1000) {
                const fps = Math.round((frames * 1000) / elapsed);
                setMetrics(prev => ({ ...prev, fps }));
                setFrameCount(prev => prev + frames);

                frames = 0;
                lastTime = timestamp;
            }

            frameId = requestAnimationFrame(measureFrameRate);
        };

        frameId = requestAnimationFrame(measureFrameRate);

        // Memory monitoring
        const updateMemory = () => {
            if ('memory' in performance) {
                const memory = (performance as any).memory;
                setMetrics(prev => ({
                    ...prev,
                    memory: {
                        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
                        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
                        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
                    },
                }));
            }
        };

        // Performance timing
        const updateTiming = () => {
            const timing = performance.timing;
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

            setMetrics(prev => ({
                ...prev,
                timing: {
                    navigationStart: timing.navigationStart,
                    loadEventEnd: timing.loadEventEnd - timing.navigationStart,
                    domComplete: timing.domComplete - timing.navigationStart,
                    domInteractive: timing.domInteractive - timing.navigationStart,
                    firstPaint: navigation?.loadEventEnd || 0,
                    firstContentfulPaint: navigation?.loadEventEnd || 0,
                },
            }));
        };

        // Resource monitoring
        const updateResources = () => {
            const resources = performance.getEntriesByType('resource');
            const counts = {
                total: resources.length,
                js: 0,
                css: 0,
                img: 0,
                other: 0,
            };

            resources.forEach((resource: any) => {
                if (resource.name.includes('.js')) counts.js++;
                else if (resource.name.includes('.css')) counts.css++;
                else if (resource.name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) counts.img++;
                else counts.other++;
            });

            setMetrics(prev => ({ ...prev, resources: counts }));
        };

        // Update all metrics
        updateMemory();
        updateTiming();
        updateResources();

        // Set up intervals
        const memoryInterval = setInterval(updateMemory, 1000);
        const resourceInterval = setInterval(updateResources, 5000);

        return () => {
            cancelAnimationFrame(frameId);
            clearInterval(memoryInterval);
            clearInterval(resourceInterval);
        };
    }, [isMonitoring]);

    // Clear performance marks and measures
    const clearPerformanceData = () => {
        try {
            performance.clearMarks();
            performance.clearMeasures();
            setFrameCount(0);
        } catch (error) {
            console.error('Failed to clear performance data:', error);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Performance Debugger</span>
                    <div className="flex gap-2">
                        <Badge variant={isMonitoring ? 'default' : 'outline'}>
                            {isMonitoring ? 'Monitoring' : 'Stopped'}
                        </Badge>
                        <Badge variant="secondary">
                            {metrics.fps} FPS
                        </Badge>
                    </div>
                </CardTitle>
                <CardDescription>
                    Real-time performance monitoring and debugging tools
                </CardDescription>
            </CardHeader>

            <Tabs defaultValue="realtime">
                <TabsList className="grid grid-cols-4 mx-4">
                    <TabsTrigger value="realtime">Real-time</TabsTrigger>
                    <TabsTrigger value="memory">Memory</TabsTrigger>
                    <TabsTrigger value="timing">Timing</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <CardContent>
                    <TabsContent value="realtime" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard
                                title="Frame Rate"
                                value={`${metrics.fps} FPS`}
                                description="Current frames per second"
                                status={metrics.fps >= 60 ? 'good' : metrics.fps >= 30 ? 'warning' : 'error'}
                            />
                            <MetricCard
                                title="Total Frames"
                                value={frameCount.toLocaleString()}
                                description="Frames rendered since monitoring started"
                                status="info"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Memory Usage</span>
                                <span>{metrics.memory.used}MB / {metrics.memory.total}MB</span>
                            </div>
                            <Progress
                                value={(metrics.memory.used / metrics.memory.total) * 100}
                                className="h-2"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="memory" className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <MetricCard
                                title="Used Heap"
                                value={`${metrics.memory.used}MB`}
                                description="Currently allocated memory"
                                status={metrics.memory.used / metrics.memory.limit > 0.8 ? 'error' : 'good'}
                            />
                            <MetricCard
                                title="Total Heap"
                                value={`${metrics.memory.total}MB`}
                                description="Total heap size"
                                status="info"
                            />
                            <MetricCard
                                title="Heap Limit"
                                value={`${metrics.memory.limit}MB`}
                                description="Maximum heap size"
                                status="info"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Memory Pressure</span>
                                <span>{Math.round((metrics.memory.used / metrics.memory.limit) * 100)}%</span>
                            </div>
                            <Progress
                                value={(metrics.memory.used / metrics.memory.limit) * 100}
                                className="h-2"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="timing" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard
                                title="DOM Interactive"
                                value={`${metrics.timing.domInteractive}ms`}
                                description="Time to DOM ready"
                                status={metrics.timing.domInteractive < 1000 ? 'good' : 'warning'}
                            />
                            <MetricCard
                                title="DOM Complete"
                                value={`${metrics.timing.domComplete}ms`}
                                description="Time to DOM complete"
                                status={metrics.timing.domComplete < 2000 ? 'good' : 'warning'}
                            />
                            <MetricCard
                                title="Load Event"
                                value={`${metrics.timing.loadEventEnd}ms`}
                                description="Time to load complete"
                                status={metrics.timing.loadEventEnd < 3000 ? 'good' : 'warning'}
                            />
                            <MetricCard
                                title="First Paint"
                                value={`${metrics.timing.firstPaint}ms`}
                                description="Time to first paint"
                                status={metrics.timing.firstPaint < 1000 ? 'good' : 'warning'}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard
                                title="Total Resources"
                                value={metrics.resources.total.toString()}
                                description="All loaded resources"
                                status="info"
                            />
                            <MetricCard
                                title="JavaScript Files"
                                value={metrics.resources.js.toString()}
                                description="Loaded JS files"
                                status={metrics.resources.js > 20 ? 'warning' : 'good'}
                            />
                            <MetricCard
                                title="CSS Files"
                                value={metrics.resources.css.toString()}
                                description="Loaded CSS files"
                                status={metrics.resources.css > 10 ? 'warning' : 'good'}
                            />
                            <MetricCard
                                title="Images"
                                value={metrics.resources.img.toString()}
                                description="Loaded images"
                                status="info"
                            />
                        </div>
                    </TabsContent>
                </CardContent>
            </Tabs>

            <CardFooter className="flex justify-between">
                <Button
                    variant={isMonitoring ? 'destructive' : 'default'}
                    onClick={toggleMonitoring}
                >
                    {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>

                <Button
                    variant="outline"
                    onClick={clearPerformanceData}
                >
                    Clear Data
                </Button>
            </CardFooter>
        </Card>
    );
}

function MetricCard({
    title,
    value,
    description,
    status
}: {
    title: string;
    value: string;
    description: string;
    status: 'good' | 'warning' | 'error' | 'info';
}) {
    const getStatusColor = () => {
        switch (status) {
            case 'good': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'error': return 'text-red-600';
            default: return 'text-blue-600';
        }
    };

    return (
        <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{title}</span>
                <Badge variant="outline" className={getStatusColor()}>
                    {status}
                </Badge>
            </div>
            <div className={`text-lg font-bold ${getStatusColor()}`}>
                {value}
            </div>
            <div className="text-xs text-muted-foreground">
                {description}
            </div>
        </div>
    );
}