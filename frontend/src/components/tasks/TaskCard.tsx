import { motion } from 'framer-motion';
import { Clock, Calendar, Star, Play, CheckCircle, Circle } from 'lucide-react';
import { GameCard } from '@/components/ui/game-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskSharing } from './TaskSharing';
import { formatDurationShort } from '@/utils/timeUtils';
import { getTimeAgo } from '@/utils/time';
import type { Task } from '@/types';

interface TaskCardProps {
    task: Task;
    onComplete?: (taskId: string) => void;
    onStart?: (taskId: string) => void;
    onEdit?: (taskId: string) => void;
    isActive?: boolean;
    className?: string;
}

export function TaskCard({
    task,
    onComplete,
    onStart,
    onEdit,
    isActive = false,
    className
}: TaskCardProps) {
    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityIcon = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return '🔥';
            case 'medium':
                return '⚡';
            case 'low':
                return '🌱';
            default:
                return '📝';
        }
    };

    const handleComplete = () => {
        if (onComplete && !task.completed) {
            onComplete(task.id);
        }
    };

    const handleStart = () => {
        if (onStart && !task.completed) {
            onStart(task.id);
        }
    };

    return (
        <GameCard
            title={task.title}
            description={task.description}
            isCompleted={task.completed}
            xpReward={task.xpReward}
            onClick={onEdit ? () => onEdit(task.id) : undefined}
            hoverAnimation={!task.completed}
            className={className}
            icon={
                <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                    )}
                </motion.div>
            }
        >
            <div className="space-y-4">
                {/* Task metadata */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        className={getPriorityColor(task.priority)}
                        variant="outline"
                    >
                        {getPriorityIcon(task.priority)} {task.priority}
                    </Badge>

                    {task.timeSpent > 0 && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDurationShort(task.timeSpent)}
                        </Badge>
                    )}

                    <Badge variant="outline" className="text-gray-600 border-gray-200">
                        <Calendar className="w-3 h-3 mr-1" />
                        {getTimeAgo(task.createdAt)}
                    </Badge>
                </div>

                {/* Tags */}
                {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
                {!task.completed && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            variant="default"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStart();
                            }}
                            className="flex-1"
                            disabled={!onStart}
                        >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleComplete();
                            }}
                            disabled={!onComplete}
                        >
                            <CheckCircle className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Sharing button */}
                <div className="flex justify-end pt-2">
                    <TaskSharing
                        task={task}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* Completion info */}
                {task.completed && task.completedAt && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Completed {getTimeAgo(task.completedAt)}
                    </div>
                )}

                {/* Active indicator */}
                {isActive && (
                    <motion.div
                        className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
            </div>
        </GameCard>
    );
}