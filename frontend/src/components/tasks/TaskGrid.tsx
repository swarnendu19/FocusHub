import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, SortAsc, SortDesc } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskTemplates } from './TaskTemplates';
import { TaskImport } from './TaskImport';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/types';

interface TaskGridProps {
    tasks: Task[];
    onTaskComplete?: (taskId: string) => void;
    onTaskStart?: (taskId: string) => void;
    onTaskEdit?: (taskId: string) => void;
    onCreateTask?: () => void;
    activeTaskId?: string;
    showCompleted?: boolean;
    className?: string;
}

type SortOption = 'created' | 'priority' | 'xp' | 'timeSpent';
type FilterOption = 'all' | 'high' | 'medium' | 'low';

export function TaskGrid({
    tasks,
    onTaskComplete,
    onTaskStart,
    onTaskEdit,
    onCreateTask,
    activeTaskId,
    showCompleted = false,
    className
}: TaskGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('created');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');

    // Filter and sort tasks
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            // Filter by completion status
            if (!showCompleted && task.completed) return false;

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    task.title.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query) ||
                    task.tags.some(tag => tag.toLowerCase().includes(query))
                );
            }

            return true;
        });

        // Filter by priority
        if (filterBy !== 'all') {
            filtered = filtered.filter(task => task.priority === filterBy);
        }

        // Sort tasks
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'created':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
                    break;
                case 'xp':
                    comparison = a.xpReward - b.xpReward;
                    break;
                case 'timeSpent':
                    comparison = a.timeSpent - b.timeSpent;
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [tasks, searchQuery, sortBy, sortOrder, filterBy, showCompleted]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const activeTasks = filteredAndSortedTasks.filter(task => !task.completed);
    const completedTasks = filteredAndSortedTasks.filter(task => task.completed);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header with controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Tasks
                    </h2>
                    <Badge variant="outline" className="text-gray-600">
                        {activeTasks.length} active
                    </Badge>
                    {showCompleted && completedTasks.length > 0 && (
                        <Badge variant="outline" className="text-green-600">
                            {completedTasks.length} completed
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {onCreateTask && (
                        <Button onClick={onCreateTask} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Task
                        </Button>
                    )}
                    <TaskTemplates />
                    <TaskImport />
                </div>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    {/* Priority filter */}
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="created">Created Date</option>
                        <option value="priority">Priority</option>
                        <option value="xp">XP Reward</option>
                        <option value="timeSpent">Time Spent</option>
                    </select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSortOrder}
                        className="px-3"
                    >
                        {sortOrder === 'asc' ? (
                            <SortAsc className="w-4 h-4" />
                        ) : (
                            <SortDesc className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Active Tasks */}
            {activeTasks.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Active Tasks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {activeTasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <TaskCard
                                        task={task}
                                        onComplete={onTaskComplete}
                                        onStart={onTaskStart}
                                        onEdit={onTaskEdit}
                                        isActive={task.id === activeTaskId}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Completed Tasks */}
            {showCompleted && completedTasks.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Completed Tasks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {completedTasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <TaskCard
                                        task={task}
                                        onEdit={onTaskEdit}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {filteredAndSortedTasks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {searchQuery || filterBy !== 'all' ? 'No tasks found' : 'No tasks yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchQuery || filterBy !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first task to start tracking your progress!'
                        }
                    </p>
                    {onCreateTask && !searchQuery && filterBy === 'all' && (
                        <Button onClick={onCreateTask} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Your First Task
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
}