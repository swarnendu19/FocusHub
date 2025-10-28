import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { env } from '../config/env';

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    version: string;
    services: {
        api: 'up' | 'down';
        database: 'up' | 'down';
        auth: 'up' | 'down';
    };
    performance: {
        responseTime: number;
        memoryUsage?: number;
    };
}

export default function HealthCheck() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch(`${env.apiBaseUrl}/health`);
                if (response.ok) {
                    const data = await response.json();
                    setHealth(data);
                } else {
                    setHealth({
                        status: 'unhealthy',
                        timestamp: new Date().toISOString(),
                        version: env.appVersion,
                        services: {
                            api: 'down',
                            database: 'down',
                            auth: 'down',
                        },
                        performance: {
                            responseTime: -1,
                        },
                    });
                }
            } catch (error) {
                setHealth({
                    status: 'unhealthy',
                    timestamp: new Date().toISOString(),
                    version: env.appVersion,
                    services: {
                        api: 'down',
                        database: 'down',
                        auth: 'down',
                    },
                    performance: {
                        responseTime: -1,
                    },
                });
            } finally {
                setLoading(false);
            }
        };

        checkHealth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Checking system health...</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
            case 'up':
                return 'text-green-600';
            case 'degraded':
                return 'text-yellow-600';
            case 'unhealthy':
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
            case 'up':
                return 'bg-green-100 text-green-800';
            case 'degraded':
                return 'bg-yellow-100 text-yellow-800';
            case 'unhealthy':
            case 'down':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">System Health</h1>
                    <p className="text-gray-600">Real-time status of FocusHub services</p>
                </div>

                {health && (
                    <div className="space-y-6">
                        {/* Overall Status */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Overall Status</h2>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-2xl font-bold ${getStatusColor(health.status)}`}>
                                            {health.status.toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(health.status)}`}>
                                            {health.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <p>Last checked: {new Date(health.timestamp).toLocaleString()}</p>
                                    <p>Version: {health.version}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Services Status */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(health.services).map(([service, status]) => (
                                    <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium capitalize">{service}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
                                            {status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Performance Metrics */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Performance</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-600">Response Time</div>
                                    <div className="text-2xl font-bold">
                                        {health.performance.responseTime >= 0
                                            ? `${health.performance.responseTime}ms`
                                            : 'N/A'
                                        }
                                    </div>
                                </div>
                                {health.performance.memoryUsage && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600">Memory Usage</div>
                                        <div className="text-2xl font-bold">
                                            {Math.round(health.performance.memoryUsage)}MB
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* System Information */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">System Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Environment:</span> {env.isProduction ? 'Production' : 'Development'}
                                </div>
                                <div>
                                    <span className="font-medium">Build Time:</span> {env.buildTime}
                                </div>
                                <div>
                                    <span className="font-medium">Analytics:</span> {env.enableAnalytics ? 'Enabled' : 'Disabled'}
                                </div>
                                <div>
                                    <span className="font-medium">PWA:</span> {env.pwaEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}