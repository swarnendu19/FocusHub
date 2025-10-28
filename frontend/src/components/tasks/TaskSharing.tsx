import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Share2,
    Copy,
    Mail,
    MessageSquare,
    Users,
    Link,
    Check,
    X,
    Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Toast } from '@/components/ui/toast';
import type { Task } from '@/types';

interface TaskSharingProps {
    task: Task;
    className?: string;
}

interface ShareOption {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    action: () => void;
}

export function TaskSharing({ task, className = '' }: TaskSharingProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const generateShareableLink = () => {
        // In a real app, this would generate a proper shareable link
        const baseUrl = window.location.origin;
        const taskData = encodeURIComponent(JSON.stringify({
            title: task.title,
            description: task.description,
            priority: task.priority,
            tags: task.tags,
            estimatedTime: task.estimatedTime,
            xpReward: task.xpReward
        }));
        return `${baseUrl}/import-task?data=${taskData}`;
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedLink(true);
            setToastMessage('Link copied to clipboard!');
            setShowToast(true);
            setTimeout(() => {
                setCopiedLink(false);
                setShowToast(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            setToastMessage('Failed to copy link');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const shareOptions: ShareOption[] = [
        {
            id: 'copy-link',
            name: 'Copy Link',
            description: 'Copy shareable link to clipboard',
            icon: copiedLink ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
            color: copiedLink ? 'bg-green-500' : 'bg-blue-500',
            action: () => copyToClipboard(generateShareableLink())
        },
        {
            id: 'email',
            name: 'Email',
            description: 'Share via email',
            icon: <Mail className="w-5 h-5" />,
            color: 'bg-red-500',
            action: () => {
                const subject = encodeURIComponent(`Task: ${task.title}`);
                const body = encodeURIComponent(
                    `I'd like to share this task with you:\n\n` +
                    `Title: ${task.title}\n` +
                    `Description: ${task.description || 'No description'}\n` +
                    `Priority: ${task.priority}\n` +
                    `Estimated Time: ${task.estimatedTime ? Math.floor(task.estimatedTime / 60000) + ' minutes' : 'Not specified'}\n` +
                    `XP Reward: ${task.xpReward}\n\n` +
                    `Import this task: ${generateShareableLink()}`
                );
                window.open(`mailto:?subject=${subject}&body=${body}`);
            }
        },
        {
            id: 'slack',
            name: 'Slack',
            description: 'Share to Slack workspace',
            icon: <MessageSquare className="w-5 h-5" />,
            color: 'bg-purple-500',
            action: () => {
                const text = encodeURIComponent(
                    `📋 *${task.title}*\n` +
                    `${task.description || 'No description'}\n` +
                    `Priority: ${task.priority} | XP: ${task.xpReward}\n` +
                    `Import: ${generateShareableLink()}`
                );
                // This would integrate with Slack API in a real app
                setToastMessage('Slack integration coming soon!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            }
        },
        {
            id: 'team',
            name: 'Team Members',
            description: 'Share with team members',
            icon: <Users className="w-5 h-5" />,
            color: 'bg-orange-500',
            action: () => {
                // This would open a team member selection dialog
                setToastMessage('Team sharing coming soon!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            }
        }
    ];

    const taskSummary = {
        title: task.title,
        description: task.description || 'No description provided',
        priority: task.priority,
        estimatedTime: task.estimatedTime ? Math.floor(task.estimatedTime / 60000) : null,
        xpReward: task.xpReward,
        tags: task.tags
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-2 hover:scale-105 transition-transform duration-200 ${className}`}
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Share2 className="w-5 h-5 text-blue-600" />
                            Share Task
                        </DialogTitle>
                        <p className="text-sm text-gray-600">
                            Share this task with your team or collaborators
                        </p>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Task Preview */}
                        <Card className="p-4 bg-gray-50 border-2 border-gray-200">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {taskSummary.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {taskSummary.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${taskSummary.priority === 'high'
                                                ? 'text-red-600 border-red-200 bg-red-50'
                                                : taskSummary.priority === 'medium'
                                                    ? 'text-orange-600 border-orange-200 bg-orange-50'
                                                    : 'text-green-600 border-green-200 bg-green-50'
                                            }`}
                                    >
                                        {taskSummary.priority === 'high' ? '🔥' : taskSummary.priority === 'medium' ? '⚡' : '🌱'} {taskSummary.priority}
                                    </Badge>

                                    {taskSummary.estimatedTime && (
                                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                                            ⏱️ {taskSummary.estimatedTime}m
                                        </Badge>
                                    )}

                                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50">
                                        ⭐ {taskSummary.xpReward} XP
                                    </Badge>
                                </div>

                                {taskSummary.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {taskSummary.tags.map((tag, index) => (
                                            <Badge
                                                key={index}
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

                        {/* Share Options */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Share Options</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {shareOptions.map((option, index) => (
                                    <motion.div
                                        key={option.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Card
                                            className="p-4 cursor-pointer border-2 border-gray-200 hover:border-blue-300 transition-all duration-200"
                                            onClick={option.action}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${option.color} text-white`}>
                                                    {option.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900">
                                                        {option.name}
                                                    </h5>
                                                    <p className="text-sm text-gray-600">
                                                        {option.description}
                                                    </p>
                                                </div>
                                                <Send className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Shareable Link */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Shareable Link</h4>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                                <Link className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={generateShareableLink()}
                                    readOnly
                                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(generateShareableLink())}
                                    className="flex-shrink-0"
                                >
                                    {copiedLink ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Anyone with this link can import this task to their workspace
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-4 right-4 z-50"
                    >
                        <Toast
                            variant={copiedLink ? "success" : "default"}
                            className="shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                {copiedLink ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Share2 className="w-4 h-4" />
                                )}
                                <span>{toastMessage}</span>
                            </div>
                        </Toast>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}