 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskGrid, TaskTimer, TaskTemplates, TaskImport, TaskAnalytics, TaskSharing } from '@/components/tasks';
import { useUserStore } from '@/stores/userStore';
import { useTimerStore } from '@/stores/timerStore';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function Projects() {
    const { user, completeTask, addSampleTasks } = useUserStore();
    const { activeSession } = useTimerStore();
    const [showCompleted, setShowCompleted] = useState(false);
    const [activeView, setActiveView] = useState<'tasks' | 'timer' | 'analytics' | 'projects'>('tasks');
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const handleTaskComplete = (taskId: string) => {
        const task = user?.tasks.find(t => t.id === taskId);
        if (task) {
            completeTask(taskId, task.xpReward);
        }
    };

    const handleTaskStart = (taskId: string) => {
        setSelectedTaskId(taskId);
        setActiveView('timer');
    };

    const handleTaskEdit = (taskId: string) => {
        // TODO: Open task edit modal
        console.log('Editing task:', taskId);
    };

    const handleCreateTask = () => {
        // TODO: Open task creation modal
        console.log('Creating new task');
    };

    const allTasks = user ? [...user.tasks, ...(showCompleted ? user.completedTasks : [])] : [];

 
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
 
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Project Management
                    </h1>
                    <p className="text-gray-600">
                        Manage your tasks and projects like a game!
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-4">
                    <ToggleGroup
                        type="single"
                        value={activeView}
                        onValueChange={(value) => value && setActiveView(value as 'tasks' | 'timer' | 'analytics' | 'projects')}
                        className="bg-gray-100 p-1 rounded-lg"
                    >
                        <ToggleGroupItem value="tasks" className="px-4 py-2">
                            Tasks
                        </ToggleGroupItem>
                        <ToggleGroupItem value="timer" className="px-4 py-2">
                            Timer
                        </ToggleGroupItem>
                        <ToggleGroupItem value="analytics" className="px-4 py-2">
                            Analytics
                        </ToggleGroupItem>
                        <ToggleGroupItem value="projects" className="px-4 py-2">
                            Projects
                        </ToggleGroupItem>
                    </ToggleGroup>

                    {activeView === 'tasks' && (
                        <Button
                            variant={showCompleted ? 'default' : 'outline'}
                            onClick={() => setShowCompleted(!showCompleted)}
                            size="sm"
                        >
                            {showCompleted ? 'Hide' : 'Show'} Completed
                        </Button>
                    )}
                </div>
            </div>

            {/* Development helper - only show if no tasks exist */}
            {activeView === 'tasks' && allTasks.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-blue-800">Development Mode</h3>
                            <p className="text-sm text-blue-600">Add sample tasks to test the interface</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addSampleTasks}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                            Add Sample Tasks
                        </Button>
                    </div>
                </div>
            )}

            {/* Content */}
            {activeView === 'tasks' ? (
                <TaskGrid
                    tasks={allTasks}
                    onTaskComplete={handleTaskComplete}
                    onTaskStart={handleTaskStart}
                    onTaskEdit={handleTaskEdit}
                    onCreateTask={handleCreateTask}
                    activeTaskId={activeSession?.taskId}
                    showCompleted={showCompleted}
                />
            ) : activeView === 'timer' ? (
                <div className="space-y-6">
                    {/* Back to Tasks Button */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setActiveView('tasks')}
                            size="sm"
                        >
                            ← Back to Tasks
                        </Button>
                        {selectedTaskId && (
                            <p className="text-sm text-gray-600">
                                Focus mode for selected task
                            </p>
                        )}
                    </div>

                    {/* Task Timer View */}
                    {selectedTaskId ? (
                        (() => {
                            const selectedTask = user?.tasks.find(t => t.id === selectedTaskId);
                            return selectedTask ? (
                                <TaskTimer
                                    task={selectedTask}
                                    onComplete={handleTaskComplete}
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <div className="text-gray-400 text-6xl mb-4">❓</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        Task Not Found
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        The selected task could not be found.
                                    </p>
                                    <Button onClick={() => setActiveView('tasks')}>
                                        Return to Tasks
                                    </Button>
                                </motion.div>
                            );
                        })()
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <div className="text-gray-400 text-6xl mb-4">⏱️</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Select a Task to Start Timing
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Choose a task from your task list to begin focused work sessions.
                            </p>
                            <Button onClick={() => setActiveView('tasks')}>
                                View Tasks
                            </Button>
                        </motion.div>
                    )}

                    {/* Active Tasks for Quick Access */}
                    {user && user.tasks.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Quick Task Access
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {user.tasks.slice(0, 6).map((task) => (
                                    <motion.div
                                        key={task.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedTaskId === task.id
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                            }`}
                                        onClick={() => setSelectedTaskId(task.id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {task.title}
                                            </h4>
                                            <span className="text-xs text-yellow-600 font-medium">
                                                {task.xpReward} XP
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate mb-2">
                                            {task.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high'
                                                ? 'bg-red-100 text-red-700'
                                                : task.priority === 'medium'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {task.priority}
                                            </span>
                                            {task.timeSpent > 0 && (
                                                <span className="text-xs text-gray-500">
                                                    {Math.floor(task.timeSpent / 60000)}m logged
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : activeView === 'analytics' ? (
                <TaskAnalytics />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="text-gray-400 text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Projects Coming Soon
                    </h3>
                    <p className="text-gray-500">
                        Project management features will be available in the next update!
                    </p>
                </motion.div>
            )}
 
        </motion.div>
    );
}