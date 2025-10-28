// API-specific types and interfaces

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface GoogleAuthResponse {
    redirectUrl: string;
}

export interface UserUpdateData {
    username?: string;
    email?: string;
    preferences?: {
        theme?: 'light' | 'dark' | 'auto';
        animations?: 'full' | 'reduced' | 'none';
        notifications?: boolean;
        soundEffects?: boolean;
    };
}

export interface LeaderboardParams {
    limit?: number;
    offset?: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

export interface AnalyticsParams {
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
}

export interface UserStats {
    totalTime: number;
    sessionsCount: number;
    averageSessionTime: number;
    xpEarned: number;
    tasksCompleted: number;
    streakDays: number;
}

export interface TimeDistribution {
    date: string;
    totalTime: number;
    sessionsCount: number;
}

export interface ProjectStats {
    projectId: string;
    projectName: string;
    totalTime: number;
    sessionsCount: number;
    percentage: number;
}

export interface GlobalStats {
    totalUsers: number;
    totalTime: number;
    totalSessions: number;
    averageSessionTime: number;
}

export interface AIInsight {
    type: string;
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
}

export interface AIInsightsResponse {
    insights: AIInsight[];
    generatedAt: string;
}

export interface AIChatRequest {
    message: string;
    context?: {
        userId: string;
        sessionData?: any;
    };
}

export interface AIChatResponse {
    response: string;
    suggestions?: string[];
    followUpQuestions?: string[];
}

export interface AIGoalPreferences {
    timeframe: 'daily' | 'weekly' | 'monthly';
    focus: 'time' | 'tasks' | 'xp';
}

export interface AIGoal {
    id: string;
    title: string;
    description: string;
    target: number;
    timeframe: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface CollaborationProject {
    id: string;
    name: string;
    description?: string;
    color: string;
    totalTime: number;
    isActive: boolean;
    createdAt: Date;
    milestones: any[];
    collaborators: Array<{
        userId: string;
        username: string;
        role: 'owner' | 'editor' | 'viewer';
        joinedAt: string;
    }>;
    isOwner: boolean;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    isPublic: boolean;
    collaborators?: Array<{
        userId: string;
        role: 'editor' | 'viewer';
    }>;
}

export interface ProjectActivity {
    id: string;
    userId: string;
    username: string;
    action: string;
    details: any;
    timestamp: string;
}

export interface FeedbackData {
    type: 'bug' | 'feature' | 'improvement' | 'other';
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
    attachments?: string[];
    userAgent?: string;
    url?: string;
}

export interface FeedbackResponse {
    id: string;
    status: 'submitted';
    ticketNumber: string;
}

export interface FeedbackItem {
    id: string;
    type: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    ticketNumber: string;
}

export interface FeedbackDetail extends FeedbackItem {
    description: string;
    priority: string;
    responses?: Array<{
        id: string;
        message: string;
        isStaff: boolean;
        createdAt: string;
    }>;
}

export interface SessionsParams {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
}

export interface AchievementProgress {
    achievementId: string;
    progress: number;
    maxProgress: number;
}

export interface AchievementCheckResponse {
    newAchievements: any[];
    updatedProgress: AchievementProgress[];
}

// Error types
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    details?: any;
}

// Request/Response wrapper types
export interface ApiRequestConfig {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

export interface ApiMetadata {
    requestId?: string;
    timestamp?: string;
    version?: string;
}