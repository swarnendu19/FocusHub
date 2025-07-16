// Core application types

export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    level: number;
    totalXP: number;
    currentXP: number;
    xpToNextLevel: number;
    streak: number;
    joinDate: Date;
    preferences: UserPreferences;
    tasks: Task[];
    completedTasks: Task[];
    isOptIn: boolean;
    tasksCompleted: number;
    unlockedBadges: string[];
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    animations: 'full' | 'reduced' | 'none';
    notifications: boolean;
    soundEffects: boolean;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    completedAt?: Date;
    timeSpent: number;
    xpReward: number;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    color: string;
    icon?: string;
    totalTime: number;
    targetTime?: number;
    isActive: boolean;
    createdAt: Date;
    lastWorkedOn?: Date;
    milestones: Milestone[];
}

export interface Milestone {
    id: string;
    name: string;
    description?: string;
    targetTime: number;
    completed: boolean;
    completedAt?: Date;
    xpReward: number;
}

export interface TimeSession {
    id: string;
    projectId?: string;
    taskId?: string;
    startTime: Date;
    endTime?: Date;
    duration: number;
    description?: string;
    xpEarned: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
    unlockedAt?: Date;
    progress?: number;
    maxProgress?: number;
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    avatar?: string;
    totalTime: number;
    level: number;
    rank: number;
    previousRank?: number;
    weeklyTime: number;
    monthlyTime: number;
    xp: number;
    tasksCompleted: number;
}

export interface AnimationState {
    isPlaying: boolean;
    duration: number;
    delay?: number;
    easing: string;
    onComplete?: () => void;
}

export interface CelebrationConfig {
    type: 'levelUp' | 'achievement' | 'milestone' | 'streak';
    intensity: 'low' | 'medium' | 'high';
    duration: number;
    particles: boolean;
    sound: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}