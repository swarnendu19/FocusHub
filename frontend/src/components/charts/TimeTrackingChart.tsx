import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLineChart } from './AnimatedLineChart';
import { AnimatedBarChart } from './AnimatedBarChart';
import { AnimatedDonutChart } from './AnimatedDonutChart';

interface TimeEntry {
    date: string;
    hours: number;
    task?: string;
    project?: string;
}

interface TimeTrackingChartProps {
    data: TimeEntry[];
    chartType?: 'line' | 'bar' | 'donut';
    timeRange?: 'week' | 'month' | 'year';
    showComparison?: boolean;
    className?: string;
}

export function TimeTrackingChart({
    data,
    chartType = 'line',
    timeRange = 'week',
    showComparison = false,
    className = ''
}: TimeTrackingChartProps) {
    const [selectedRange, setSelectedRange] = useState(timeRange);
    const [selectedChart, setSelectedChart] = useState(chartType);

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Group data by the selected time range
        const groupedData = data.reduce((acc, entry) => {
            const date = new Date(entry.date);
            let key: string;

            switch (selectedRange) {
                case 'week':
                    // Group by day of week
                    key = date.toLocaleDateString('en-US', { weekday: 'short' });
                    break;
                case 'month':
                    // Group by day of month
                    key = date.getDate().toString();
                    break;
                case 'year':
                    // Group by month
                    key = date.toLocaleDateString('en-US', { month: 'short' });
                    break;
                default:
                    key = entry.date;
            }

            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += entry.hours;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(groupedData).map(([label, value]) => ({
            label,
            value,
            x: label,
            y: value
        }));
    }, [data, selectedRange]);

    const projectData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const projectHours = data.reduce((acc, entry) => {
            const project = entry.project || 'Unassigned';
            if (!acc[project]) {
                acc[project] = 0;
            }
            acc[project] += entry.hours;
            return acc;
        }, {} as Record<string, number>);

        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];

        return Object.entries(projectHours).map(([label, value], index) => ({
            label,
            value,
            color: colors[index % colors.length]
        }));
    }, [data]);

    const totalHours = useMemo(() => {
        return data.reduce((sum, entry) => sum + entry.hours, 0);
    }, [data]);

    const averageHours = useMemo(() => {
        return processedData.length > 0 ? totalHours / processedData.length : 0;
    }, [totalHours, processedData.length]);

    const renderChart = () => {
        switch (selectedChart) {
            case 'bar':
                return (
                    <AnimatedBarChart
                        data={processedData}
                        height={300}
                        showValues={true}
                        showLabels={true}
                        className="w-full"
                    />
                );
            case 'donut':
                return (
                    <div className="flex justify-center">
                        <AnimatedDonutChart
                            data={projectData}
                            size={300}
                            showLabels={true}
                            showLegend={true}
                            centerContent={
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-700">
                                        {totalHours.toFixed(1)}h
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Total Time
                                    </div>
                                </div>
                            }
                        />
                    </div>
                );
            default:
                return (
                    <AnimatedLineChart
                        data={processedData}
                        width={600}
                        height={300}
                        color="#3b82f6"
                        showDots={true}
                        showGrid={true}
                        showArea={true}
                        className="w-full"
                    />
                );
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Time Tracking Analytics</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Track your productivity over time
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                    {/* Time Range Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['week', 'month', 'year'].map((range) => (
                            <motion.button
                                key={range}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                    selectedRange === range
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                                onClick={() => setSelectedRange(range as typeof selectedRange)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </motion.button>
                        ))}
                    </div>

                    {/* Chart Type Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['line', 'bar', 'donut'].map((chart) => (
                            <motion.button
                                key={chart}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                    selectedChart === chart
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                                onClick={() => setSelectedChart(chart as typeof selectedChart)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {chart.charAt(0).toUpperCase() + chart.slice(1)}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <motion.div
                    className="bg-blue-50 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-2xl font-bold text-blue-600">
                        {totalHours.toFixed(1)}h
                    </div>
                    <div className="text-sm text-blue-600/70">Total Hours</div>
                </motion.div>

                <motion.div
                    className="bg-green-50 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="text-2xl font-bold text-green-600">
                        {averageHours.toFixed(1)}h
                    </div>
                    <div className="text-sm text-green-600/70">Average per {selectedRange.slice(0, -1)}</div>
                </motion.div>

                <motion.div
                    className="bg-purple-50 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-2xl font-bold text-purple-600">
                        {projectData.length}
                    </div>
                    <div className="text-sm text-purple-600/70">Active Projects</div>
                </motion.div>
            </div>

            {/* Chart */}
            <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedChart}-${selectedRange}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderChart()}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Comparison View */}
            {showComparison && (
                <motion.div
                    className="mt-8 pt-6 border-t border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Project Comparison
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatedBarChart
                            data={projectData}
                            height={200}
                            showValues={true}
                            showLabels={true}
                        />
                        <div className="space-y-2">
                            {projectData.map((project, index) => (
                                <motion.div
                                    key={project.label}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.9 }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: project.color }}
                                        />
                                        <span className="font-medium text-gray-700">
                                            {project.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">
                                            {project.value.toFixed(1)}h
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {((project.value / totalHours) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}