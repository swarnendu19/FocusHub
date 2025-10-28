import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Plus,
    Code,
    FileText,
    Bug,
    Lightbulb,
    Users,
    Settings,
    Clock,
    Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserStore } from '@/stores/userStore';
import type { Task } from '@/types';

interface TaskTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: 'development' | 'design' | 'management' | 'learning';
    estimatedTime: number; // in milliseconds
    xpReward: number;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    color: string;
}

const taskTemplates: TaskTemplate[] = [
    {
        id: 'code-review',
        name: 'Code Review',
        description: 'Review pull request and provide feedback',
        icon: <Code className="w-5 h-5" />,
        category: 'development',
        estimatedTime: 1800000, // 30 minutes
        xpReward: 75,
        priority: 'medium',
        tags: ['code-review', 'development', 'collaboration'],
        color: 'bg-blue-500'
    },
    {
        id: 'bug-fix',
        name: 'Bug Fix',
        description: 'Investigate and fix reported bug',
        icon: <Bug className="w-5 h-5" />,
        category: 'development',
        estimatedTime: 3600000, // 1 hour
        xpReward: 100,
        priority: 'high',
        tags: ['bug-fix', 'development', 'debugging'],
        color: 'bg-red-500'
    },
    {
        id: 'documentation',
        name: 'Write Documentation',
        description: 'Create or update project documentation',
        icon: <FileText className="w-5 h-5" />,
        category: 'management',
        estimatedTime: 2700000, // 45 minutes
        xpReward: 80,
        priority: 'medium',
        tags: ['documentation', 'writing', 'knowledge'],
        color: 'bg-green-500'
    },
    {
        id: 'feature-development',
        name: 'Feature Development',
        description: 'Implement new feature from requirements',
        icon: <Lightbulb className="w-5 h-5" />,
        category: 'development',
        estimatedTime: 7200000, // 2 hours
        xpReward: 200,
        priority: 'high',
        tags: ['feature', 'development', 'implementation'],
        color: 'bg-purple-500'
    },
    {
        id: 'team-meeting',
        name: 'Team Meeting',
        description: 'Attend team standup or planning meeting',
        icon: <Users className="w-5 h-5" />,
        category: 'management',
        estimatedTime: 1800000, // 30 minutes
        xpReward: 50,
        priority: 'medium',
        tags: ['meeting', 'collaboration', 'planning'],
        color: 'bg-orange-500'
    },
    {
        id: 'system-maintenance',
        name: 'System Maintenance',
        description: 'Perform routine system maintenance tasks',
        icon: <Settings className="w-5 h-5" />,
        category: 'management',
        estimatedTime: 3600000, // 1 hour
        xpReward: 90,
        priority: 'low',
        tags: ['maintenance', 'system', 'operations'],
        color: 'bg-gray-500'
    },
    {
        id: 'learning-research',
        name: 'Learning & Research',
        description: 'Research new technologies or learn new skills',
        icon: <Target className="w-5 h-5" />,
        category: 'learning',
        estimatedTime: 5400000, // 1.5 hours
        xpReward: 150,
        priority: 'medium',
        tags: ['learning', 'research', 'skill-development'],
        color: 'bg-indigo-500'
    }
];

export function TaskTemplates() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { addTask } = useUserStore();

    const categories = [
        { id: 'all', name: 'All Templates', count: taskTemplates.length },
        { id: 'development', name: 'Development', count: taskTemplates.filter(t => t.category === 'development').length },
        { id: 'design', name: 'Design', count: taskTemplates.filter(t => t.category === 'design').length },
        { id: 'management', name: 'Management', count: taskTemplates.filter(t => t.category === 'management').length },
        { id: 'learning', name: 'Learning', count: taskTemplates.filter(t => t.category === 'learning').length },
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? taskTemplates
        : taskTemplates.filter(template => template.category === selectedCategory);

    const handleCreateFromTemplate = (template: TaskTemplate) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: template.name,
            description: template.description,
            completed: false,
            createdAt: new Date(),
            timeSpent: 0,
            xpReward: template.xpReward,
            priority: template.priority,
            tags: template.tags,
            estimatedTime: template.estimatedTime,
        };

        addTask(newTask);
        setIsOpen(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                    <Layout className="w-4 h-4" />
                    Templates
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Layout className="w-5 h-5 text-blue-600" />
                        Task Templates
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Choose from pre-built task templates to quickly create common tasks
                    </p>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                                    }`}
                            >
                                {category.name}
                                <Badge
                                    variant="secondary"
                                    className="ml-2 text-xs"
                                >
                                    {category.count}
                                </Badge>
                            </motion.button>
                        ))}
                    </div>

                    {/* Templates Grid */}
                    <div className="max-h-96 overflow-y-auto pr-2">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <AnimatePresence mode="wait">
                                {filteredTemplates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        variants={itemVariants}
                                        layout
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)"
                                        }}
                                        className="group"
                                    >
                                        <Card className="p-4 cursor-pointer border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                                            <div className="space-y-3">
                                                {/* Template Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${template.color} text-white`}>
                                                            {template.icon}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                                {template.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {template.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Template Metadata */}
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${template.priority === 'high'
                                                            ? 'text-red-600 border-red-200 bg-red-50'
                                                            : template.priority === 'medium'
                                                                ? 'text-orange-600 border-orange-200 bg-orange-50'
                                                                : 'text-green-600 border-green-200 bg-green-50'
                                                            }`}
                                                    >
                                                        {template.priority === 'high' ? '🔥' : template.priority === 'medium' ? '⚡' : '🌱'} {template.priority}
                                                    </Badge>

                                                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {Math.floor(template.estimatedTime / 60000)}m
                                                    </Badge>

                                                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50">
                                                        <Target className="w-3 h-3 mr-1" />
                                                        {template.xpReward} XP
                                                    </Badge>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1">
                                                    {template.tags.slice(0, 3).map((tag, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs bg-gray-100 text-gray-600"
                                                        >
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                    {template.tags.length > 3 && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs bg-gray-100 text-gray-600"
                                                        >
                                                            +{template.tags.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Create Button */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <Button
                                                        onClick={() => handleCreateFromTemplate(template)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:scale-105"
                                                        size="sm"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Create Task
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Empty State */}
                    {filteredTemplates.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-8"
                        >
                            <div className="text-gray-400 text-4xl mb-4">📝</div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No templates found
                            </h3>
                            <p className="text-gray-500">
                                Try selecting a different category to see more templates.
                            </p>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}