import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Upload,
    FileText,
    Link,
    CheckCircle,
    AlertCircle,
    X,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserStore } from '@/stores/userStore';
import type { Task } from '@/types';

interface ImportSource {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    comingSoon?: boolean;
}

interface ImportedTaskPreview {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    estimatedTime?: number;
    xpReward: number;
    tags: string[];
}

export function TaskImport() {
    const [isOpen, setIsOpen] = useState(false);
    const [importMethod, setImportMethod] = useState<string>('');
    const [linkInput, setLinkInput] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [previewTasks, setPreviewTasks] = useState<ImportedTaskPreview[]>([]);
    const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const { addTask } = useUserStore();

    const importSources: ImportSource[] = [
        {
            id: 'link',
            name: 'Shareable Link',
            description: 'Import task from a shared link',
            icon: <Link className="w-5 h-5" />,
            color: 'bg-blue-500'
        },
        {
            id: 'json',
            name: 'JSON Data',
            description: 'Import tasks from JSON format',
            icon: <FileText className="w-5 h-5" />,
            color: 'bg-green-500'
        },
        {
            id: 'todoist',
            name: 'Todoist',
            description: 'Import tasks from Todoist',
            icon: <Download className="w-5 h-5" />,
            color: 'bg-red-500',
            comingSoon: true
        },
        {
            id: 'ticktick',
            name: 'TickTick',
            description: 'Import tasks from TickTick',
            icon: <Download className="w-5 h-5" />,
            color: 'bg-orange-500',
            comingSoon: true
        }
    ];

    const parseShareableLink = (url: string): ImportedTaskPreview | null => {
        try {
            const urlObj = new URL(url);
            if (urlObj.pathname !== '/import-task') {
                throw new Error('Invalid task link format');
            }

            const dataParam = urlObj.searchParams.get('data');
            if (!dataParam) {
                throw new Error('No task data found in link');
            }

            const taskData = JSON.parse(decodeURIComponent(dataParam));
            return {
                title: taskData.title || 'Imported Task',
                description: taskData.description,
                priority: taskData.priority || 'medium',
                estimatedTime: taskData.estimatedTime,
                xpReward: taskData.xpReward || 50,
                tags: taskData.tags || []
            };
        } catch (error) {
            console.error('Failed to parse shareable link:', error);
            return null;
        }
    };

    const parseJsonData = (jsonString: string): ImportedTaskPreview[] => {
        try {
            const data = JSON.parse(jsonString);
            const tasks = Array.isArray(data) ? data : [data];

            return tasks.map((task: any) => ({
                title: task.title || task.name || 'Imported Task',
                description: task.description || task.content,
                priority: task.priority || 'medium',
                estimatedTime: task.estimatedTime || task.duration,
                xpReward: task.xpReward || task.points || 50,
                tags: task.tags || task.labels || []
            }));
        } catch (error) {
            console.error('Failed to parse JSON data:', error);
            throw new Error('Invalid JSON format');
        }
    };

    const handleImportPreview = async () => {
        setImportStatus('loading');
        setErrorMessage('');

        try {
            let tasks: ImportedTaskPreview[] = [];

            if (importMethod === 'link') {
                if (!linkInput.trim()) {
                    throw new Error('Please enter a shareable link');
                }
                const task = parseShareableLink(linkInput.trim());
                if (!task) {
                    throw new Error('Invalid or corrupted task link');
                }
                tasks = [task];
            } else if (importMethod === 'json') {
                if (!jsonInput.trim()) {
                    throw new Error('Please enter JSON data');
                }
                tasks = parseJsonData(jsonInput.trim());
            }

            setPreviewTasks(tasks);
            setImportStatus('success');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Import failed');
            setImportStatus('error');
        }
    };

    const handleConfirmImport = () => {
        previewTasks.forEach(taskPreview => {
            const newTask: Task = {
                id: crypto.randomUUID(),
                title: taskPreview.title,
                description: taskPreview.description,
                completed: false,
                createdAt: new Date(),
                timeSpent: 0,
                xpReward: taskPreview.xpReward,
                priority: taskPreview.priority,
                tags: taskPreview.tags,
                estimatedTime: taskPreview.estimatedTime,
            };

            addTask(newTask);
        });

        // Reset state and close dialog
        setImportMethod('');
        setLinkInput('');
        setJsonInput('');
        setPreviewTasks([]);
        setImportStatus('idle');
        setIsOpen(false);
    };

    const resetImport = () => {
        setImportMethod('');
        setLinkInput('');
        setJsonInput('');
        setPreviewTasks([]);
        setImportStatus('idle');
        setErrorMessage('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                    <Upload className="w-4 h-4" />
                    Import
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Upload className="w-5 h-5 text-green-600" />
                        Import Tasks
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Import tasks from various sources or shared links
                    </p>
                </DialogHeader>

                <div className="space-y-6 max-h-96 overflow-y-auto">
                    {!importMethod && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h4 className="font-medium text-gray-900">Choose Import Source</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {importSources.map((source, index) => (
                                    <motion.div
                                        key={source.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: source.comingSoon ? 1 : 1.02 }}
                                        whileTap={{ scale: source.comingSoon ? 1 : 0.98 }}
                                    >
                                        <Card
                                            className={`p-4 border-2 border-gray-200 transition-all duration-200 ${source.comingSoon
                                                ? 'opacity-60 cursor-not-allowed'
                                                : 'cursor-pointer hover:border-green-300'
                                                }`}
                                            onClick={() => !source.comingSoon && setImportMethod(source.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${source.color} text-white`}>
                                                    {source.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="font-medium text-gray-900">
                                                            {source.name}
                                                        </h5>
                                                        {source.comingSoon && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Coming Soon
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {source.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {importMethod === 'link' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">Import from Shareable Link</h4>
                                <Button variant="ghost" size="sm" onClick={resetImport}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">
                                    Paste the shareable task link:
                                </label>
                                <input
                                    type="url"
                                    value={linkInput}
                                    onChange={(e) => setLinkInput(e.target.value)}
                                    placeholder="https://example.com/import-task?data=..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />

                                <Button
                                    onClick={handleImportPreview}
                                    disabled={!linkInput.trim() || importStatus === 'loading'}
                                    className="w-full"
                                >
                                    {importStatus === 'loading' ? 'Processing...' : 'Preview Task'}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {importMethod === 'json' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">Import from JSON Data</h4>
                                <Button variant="ghost" size="sm" onClick={resetImport}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">
                                    Paste JSON data:
                                </label>
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder='{"title": "My Task", "description": "Task description", "priority": "high", "xpReward": 100}'
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                                />

                                <Button
                                    onClick={handleImportPreview}
                                    disabled={!jsonInput.trim() || importStatus === 'loading'}
                                    className="w-full"
                                >
                                    {importStatus === 'loading' ? 'Processing...' : 'Preview Tasks'}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Error State */}
                    {importStatus === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 border border-red-200 rounded-lg"
                        >
                            <div className="flex items-center gap-2 text-red-700">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Import Failed</span>
                            </div>
                            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                        </motion.div>
                    )}

                    {/* Preview Tasks */}
                    {importStatus === 'success' && previewTasks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                    Preview ({previewTasks.length} task{previewTasks.length !== 1 ? 's' : ''})
                                </h4>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={resetImport}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleConfirmImport}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Import All
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {previewTasks.map((task, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="p-4 bg-green-50 border-2 border-green-200">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-900">
                                                            {task.title}
                                                        </h5>
                                                        {task.description && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${task.priority === 'high'
                                                            ? 'text-red-600 border-red-200 bg-red-50'
                                                            : task.priority === 'medium'
                                                                ? 'text-orange-600 border-orange-200 bg-orange-50'
                                                                : 'text-green-600 border-green-200 bg-green-50'
                                                            }`}
                                                    >
                                                        {task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '🌱'} {task.priority}
                                                    </Badge>

                                                    {task.estimatedTime && (
                                                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                                                            ⏱️ {Math.floor(task.estimatedTime / 60000)}m
                                                        </Badge>
                                                    )}

                                                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50">
                                                        ⭐ {task.xpReward} XP
                                                    </Badge>
                                                </div>

                                                {task.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {task.tags.map((tag, tagIndex) => (
                                                            <Badge
                                                                key={tagIndex}
                                                                variant="secondary"
                                                                className="text-xs bg-gray-100 text-gray-600"
                                                            >
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}