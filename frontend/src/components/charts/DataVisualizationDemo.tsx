import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    TimeTrackingChart,
    AnimatedLineChart,
    AnimatedBarChart,
    AnimatedDonutChart,
    AnimatedProgressCircle,
    ComparativeChart,
    InteractiveDataGrid
} from './index';
import {
    BarChart3,
    LineChart,
    PieChart,
    Activity,
    TrendingUp,
    Grid3X3,
    RefreshCw
} from 'lucide-react';

export function DataVisualizationDemo() {
    const [activeDemo, setActiveDemo] = useState<string>('time-tracking');
    const [refreshKey, setRefreshKey] = useState(0);

    // Generate sample data
    const timeTrackingData = useMemo(() => [
        { date: '2024-01-01', hours: 8, task: 'Frontend Development', project: 'FocusHub' },
        { date: '2024-01-02', hours: 6, task: 'API Integration', project: 'FocusHub' },
        { date: '2024-01-03', hours: 7, task: 'UI Design', project: 'Portfolio' },
        { date: '2024-01-04', hours: 5, task: 'Testing', project: 'FocusHub' },
        { date: '2024-01-05', hours: 9, task: 'Documentation', project: 'Portfolio' },
        { date: '2024-01-06', hours: 4, task: 'Bug Fixes', project: 'FocusHub' },
        { date: '2024-01-07', hours: 8, task: 'Code Review', project: 'Portfolio' },
    ], []);

    const lineChartData = useMemo(() => [
        { x: 'Jan', y: 65, label: 'January' },
        { x: 'Feb', y: 78, label: 'February' },
        { x: 'Mar', y: 90, label: 'March' },
        { x: 'Apr', y: 81, label: 'April' },
        { x: 'May', y: 95, label: 'May' },
        { x: 'Jun', y: 88, label: 'June' },
        { x: 'Jul', y: 102, label: 'July' },
    ], []);

    const barChartData = useMemo(() => [
        { label: 'Tasks', value: 45, color: '#3b82f6' },
        { label: 'Projects', value: 12, color: '#10b981' },
        { label: 'Hours', value: 156, color: '#f59e0b' },
        { label: 'XP', value: 2340, color: '#ef4444' },
        { label: 'Achievements', value: 8, color: '#8b5cf6' },
    ], []);

    const donutChartData = useMemo(() => [
        { label: 'Development', value: 45, color: '#3b82f6' },
        { label: 'Design', value: 25, color: '#10b981' },
        { label: 'Testing', value: 15, color: '#f59e0b' },
        { label: 'Documentation', value: 10, color: '#ef4444' },
        { label: 'Meetings', value: 5, color: '#8b5cf6' },
    ], []);

    const comparativeData = useMemo(() => [
        { label: 'Daily Tasks', current: 8, previous: 6 },
        { label: 'Focus Hours', current: 7.5, previous: 6.2 },
        { label: 'XP Gained', current: 450, previous: 380 },
        { label: 'Streak Days', current: 12, previous: 8 },
        { label: 'Projects', current: 3, previous: 4 },
    ], []);

    const gridData = useMemo(() => [
        [
            { value: 85, label: 'Mon AM' },
            { value: 92, label: 'Mon PM' },
            { value: 78, label: 'Mon Eve' }
        ],
        [
            { value: 90, label: 'Tue AM' },
            { value: 88, label: 'Tue PM' },
            { value: 82, label: 'Tue Eve' }
        ],
        [
            { value: 75, label: 'Wed AM' },
            { value: 95, label: 'Wed PM' },
            { value: 89, label: 'Wed Eve' }
        ],
        [
            { value: 88, label: 'Thu AM' },
            { value: 91, label: 'Thu PM' },
            { value: 86, label: 'Thu Eve' }
        ],
        [
            { value: 93, label: 'Fri AM' },
            { value: 87, label: 'Fri PM' },
            { value: 79, label: 'Fri Eve' }
        ]
    ], []);

    const demos = [
        {
            id: 'time-tracking',
            title: 'Time Tracking Analytics',
            icon: <Activity className="w-5 h-5" />,
            description: 'Comprehensive time tracking with multiple chart types'
        },
        {
            id: 'line-chart',
            title: 'Animated Line Chart',
            icon: <LineChart className="w-5 h-5" />,
            description: 'Smooth line animations with interactive data points'
        },
        {
            id: 'bar-chart',
            title: 'Animated Bar Chart',
            icon: <BarChart3 className="w-5 h-5" />,
            description: 'Growing bars with hover effects and tooltips'
        },
        {
            id: 'donut-chart',
            title: 'Animated Donut Chart',
            icon: <PieChart className="w-5 h-5" />,
            description: 'Segmented progress with smooth transitions'
        },
        {
            id: 'comparative',
            title: 'Comparative Analysis',
            icon: <TrendingUp className="w-5 h-5" />,
            description: 'Side-by-side comparison with trend indicators'
        },
        {
            id: 'data-grid',
            title: 'Interactive Data Grid',
            icon: <Grid3X3 className="w-5 h-5" />,
            description: 'Heat map visualization with hover interactions'
        }
    ];

    const refreshData = () => {
        setRefreshKey(prev => prev + 1);
    };

    const renderDemo = () => {
        switch (activeDemo) {
            case 'time-tracking':
                return (
                    <TimeTrackingChart
                        key={refreshKey}
                        data={timeTrackingData}
                        showComparison={true}
                        className="w-full"
                    />
                );

            case 'line-chart':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Monthly Progress Trend
                        </h3>
                        <AnimatedLineChart
                            key={refreshKey}
                            data={lineChartData}
                            width={600}
                            height={300}
                            color="#3b82f6"
                            showDots={true}
                            showGrid={true}
                            showArea={true}
                        />
                    </div>
                );

            case 'bar-chart':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Performance Metrics
                        </h3>
                        <AnimatedBarChart
                            key={refreshKey}
                            data={barChartData}
                            height={300}
                            showValues={true}
                            showLabels={true}
                        />
                    </div>
                );

            case 'donut-chart':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Time Distribution
                        </h3>
                        <div className="flex justify-center">
                            <AnimatedDonutChart
                                key={refreshKey}
                                data={donutChartData}
                                size={300}
                                showLabels={true}
                                showLegend={true}
                                centerContent={
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-700">
                                            100h
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Total Time
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                );

            case 'comparative':
                return (
                    <ComparativeChart
                        key={refreshKey}
                        data={comparativeData}
                        title="Weekly Performance Comparison"
                        subtitle="This week vs last week"
                        showPercentageChange={true}
                        showTrend={true}
                    />
                );

            case 'data-grid':
                return (
                    <InteractiveDataGrid
                        key={refreshKey}
                        data={gridData}
                        rowLabels={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}
                        columnLabels={['Morning', 'Afternoon', 'Evening']}
                        title="Weekly Focus Intensity"
                        colorScale="gradient"
                        showValues={true}
                        showTooltips={true}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            className="p-6 bg-gray-50 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                📊 Data Visualization Demo
                            </h1>
                            <p className="text-gray-600">
                                Interactive charts and animations for time tracking analytics
                            </p>
                        </div>
                        <Button
                            onClick={refreshData}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </Button>
                    </div>
                </motion.div>

                {/* Demo Navigation */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {demos.map((demo, index) => (
                            <motion.button
                                key={demo.id}
                                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${activeDemo === demo.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                onClick={() => setActiveDemo(demo.id)}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className={`p-2 rounded-lg ${activeDemo === demo.id ? 'bg-blue-100' : 'bg-gray-100'
                                        }`}>
                                        {demo.icon}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">
                                        {demo.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {demo.description}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Demo Content */}
                <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {renderDemo()}
                </motion.div>

                {/* Progress Circles Demo */}
                <motion.div
                    className="mt-8 bg-white rounded-lg shadow-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Progress Indicators
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <AnimatedProgressCircle
                            key={`progress-1-${refreshKey}`}
                            progress={75}
                            size={120}
                            color="#3b82f6"
                            showPercentage={true}
                            showLabel={true}
                            label="Tasks Complete"
                        />
                        <AnimatedProgressCircle
                            key={`progress-2-${refreshKey}`}
                            progress={60}
                            size={120}
                            color="#10b981"
                            showPercentage={true}
                            showLabel={true}
                            label="Focus Time"
                        />
                        <AnimatedProgressCircle
                            key={`progress-3-${refreshKey}`}
                            progress={90}
                            size={120}
                            color="#f59e0b"
                            showPercentage={true}
                            showLabel={true}
                            label="Weekly Goal"
                        />
                        <AnimatedProgressCircle
                            key={`progress-4-${refreshKey}`}
                            progress={45}
                            size={120}
                            color="#ef4444"
                            showPercentage={true}
                            showLabel={true}
                            label="Streak Days"
                        />
                    </div>
                </motion.div>

                {/* Features List */}
                <motion.div
                    className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">
                        ✨ Animation Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <ul className="space-y-2">
                            <li>• <strong>Smooth Transitions:</strong> Framer Motion powered animations</li>
                            <li>• <strong>Interactive Hover:</strong> Dynamic tooltips and highlights</li>
                            <li>• <strong>Progressive Loading:</strong> Staggered element animations</li>
                            <li>• <strong>Data Binding:</strong> Real-time chart updates</li>
                        </ul>
                        <ul className="space-y-2">
                            <li>• <strong>Responsive Design:</strong> Mobile-friendly layouts</li>
                            <li>• <strong>Color Themes:</strong> Customizable color schemes</li>
                            <li>• <strong>Performance:</strong> Hardware-accelerated animations</li>
                            <li>• <strong>Accessibility:</strong> Reduced motion support</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}