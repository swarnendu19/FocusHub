# Design Document

## Overview

The gamified time tracking frontend will be built as a modern React application with TypeScript, featuring Duolingo-inspired animations and gamification elements. The application will provide an engaging, game-like experience for time tracking through four main pages: Home Dashboard, Project Management, Leaderboard, and XP/Achievement system. The design emphasizes smooth animations, visual feedback, and motivational elements to transform time tracking from a mundane task into an enjoyable activity.

## Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations and Framer Motion for complex animations
- **State Management**: Zustand for global state management
- **Routing**: React Router v6 for navigation
- **HTTP Client**: Axios for API communication
- **Animation Libraries**: 
  - Framer Motion for complex animations and page transitions
  - React Spring for micro-interactions
  - Lottie React for celebration animations
- **UI Components**: Custom component library with Headless UI for accessibility
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for animated data visualizations

### Application Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, cards, etc.)
│   ├── animations/      # Animation components and wrappers
│   └── layout/          # Layout components (header, sidebar, etc.)
├── pages/               # Main application pages
│   ├── Home/           # Dashboard page
│   ├── Projects/       # Project management page
│   ├── Leaderboard/    # Leaderboard and social features
│   └── XP/             # XP and achievements page
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Static assets (images, animations)
```

## Components and Interfaces

### Core UI Components

#### AnimatedButton Component
```typescript
interface AnimatedButtonProps {
  variant: 'primary' | 'secondary' | 'success' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  animation?: 'bounce' | 'pulse' | 'scale' | 'shake';
}
```

#### ProgressBar Component
```typescript
interface ProgressBarProps {
  progress: number; // 0-100
  animated: boolean;
  color: string;
  showLabel?: boolean;
  duration?: number;
  onComplete?: () => void;
}
```

#### GameCard Component
```typescript
interface GameCardProps {
  title: string;
  description?: string;
  progress?: number;
  xpReward?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  hoverAnimation?: boolean;
}
```

### Page Components

#### Home Dashboard
- **DailyProgress**: Circular progress indicators with animated fills
- **ActiveTimers**: Pulsing timer cards with start/stop animations
- **QuickStats**: Animated counter components showing daily/weekly stats
- **StreakCounter**: Flame animation for consecutive days
- **DailyQuests**: Quest cards with completion animations

#### Project Management
- **ProjectGrid**: Masonry layout with hover animations
- **ProjectCard**: Expandable cards with progress indicators
- **TimeTracker**: Large, prominent timer with smooth transitions
- **ProjectModal**: Slide-in modal for creating/editing projects
- **MilestoneTracker**: Achievement badges with unlock animations

#### Leaderboard
- **RankingList**: Animated list with position change transitions
- **UserProfile**: Expandable profile cards
- **CompetitionTimer**: Countdown timers for weekly/monthly competitions
- **AchievementBadges**: Collectible badges with rarity indicators

#### XP System
- **XPProgressBar**: Multi-level progress bar with overflow animations
- **LevelUpModal**: Full-screen celebration animation
- **AchievementGrid**: Grid of unlockable achievements
- **SkillTree**: Interactive skill progression system

## Data Models

### User Interface Models
```typescript
interface User {
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
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animations: 'full' | 'reduced' | 'none';
  notifications: boolean;
  soundEffects: boolean;
}

interface Project {
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

interface TimeSession {
  id: string;
  projectId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  description?: string;
  xpEarned: number;
}

interface Achievement {
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

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalTime: number;
  level: number;
  rank: number;
  previousRank?: number;
  weeklyTime: number;
  monthlyTime: number;
}
```

### Animation State Models
```typescript
interface AnimationState {
  isPlaying: boolean;
  duration: number;
  delay?: number;
  easing: string;
  onComplete?: () => void;
}

interface CelebrationConfig {
  type: 'levelUp' | 'achievement' | 'milestone' | 'streak';
  intensity: 'low' | 'medium' | 'high';
  duration: number;
  particles: boolean;
  sound: boolean;
}
```

## Error Handling

### Error Boundary Implementation
- Global error boundary for unhandled React errors
- API error handling with user-friendly messages
- Offline state detection and graceful degradation
- Retry mechanisms with exponential backoff

### User Feedback
- Toast notifications for success/error states
- Loading skeletons during data fetching
- Empty states with encouraging messages
- Error states with actionable recovery options

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Animation testing with mock timers
- State management testing with Zustand

### Integration Testing
- API integration tests with MSW (Mock Service Worker)
- User flow testing with Playwright
- Cross-browser compatibility testing
- Performance testing with Lighthouse

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation testing
- Color contrast validation
- Motion sensitivity compliance

## Animation Design System

### Animation Principles
1. **Purposeful**: Every animation serves a functional purpose
2. **Consistent**: Unified timing and easing across the application
3. **Performant**: Hardware-accelerated animations using transform and opacity
4. **Accessible**: Respects user's motion preferences
5. **Delightful**: Adds joy without being distracting

### Animation Categories

#### Micro-interactions
- Button hover states (scale: 1.05, duration: 150ms)
- Input focus animations (border glow, duration: 200ms)
- Loading spinners and progress indicators
- Tooltip appearances (fade + slide, duration: 200ms)

#### Page Transitions
- Route changes (slide transitions, duration: 300ms)
- Modal appearances (scale + fade, duration: 250ms)
- Drawer slides (translate, duration: 300ms)
- Tab switches (fade, duration: 200ms)

#### Gamification Animations
- XP gain notifications (bounce + fade, duration: 800ms)
- Level up celebrations (confetti + scale, duration: 2000ms)
- Achievement unlocks (pulse + glow, duration: 1000ms)
- Streak counters (flame flicker, continuous)

#### Data Visualizations
- Chart animations (staggered reveals, duration: 1000ms)
- Progress bar fills (ease-out, duration: 800ms)
- Counter animations (number counting, duration: 600ms)
- Leaderboard position changes (smooth transitions, duration: 500ms)

### Color Palette (Duolingo-inspired)
```css
:root {
  /* Primary Colors */
  --color-primary: #58CC02;      /* Duolingo Green */
  --color-primary-dark: #46A302;
  --color-primary-light: #89E219;
  
  /* Secondary Colors */
  --color-secondary: #1CB0F6;    /* Duolingo Blue */
  --color-accent: #FF9600;       /* Orange for achievements */
  --color-danger: #FF4B4B;       /* Red for errors */
  --color-warning: #FFC800;      /* Yellow for warnings */
  
  /* Neutral Colors */
  --color-gray-50: #F8FAFC;
  --color-gray-100: #F1F5F9;
  --color-gray-200: #E2E8F0;
  --color-gray-300: #CBD5E1;
  --color-gray-400: #94A3B8;
  --color-gray-500: #64748B;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1E293B;
  --color-gray-900: #0F172A;
  
  /* Gamification Colors */
  --color-xp: #FFD700;           /* Gold for XP */
  --color-streak: #FF6B35;       /* Orange-red for streaks */
  --color-achievement: #9333EA;   /* Purple for achievements */
}
```

### Responsive Design Strategy
- Mobile-first approach with progressive enhancement
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Touch-friendly interactions on mobile devices
- Adaptive animations based on device capabilities
- Optimized performance for lower-end devices

## Performance Optimization

### Code Splitting
- Route-based code splitting with React.lazy()
- Component-level splitting for heavy features
- Dynamic imports for animation libraries

### Animation Performance
- Use transform and opacity for smooth animations
- Implement will-change CSS property strategically
- Debounce scroll and resize event handlers
- Use requestAnimationFrame for custom animations

### State Management Optimization
- Selective subscriptions in Zustand stores
- Memoization of expensive calculations
- Lazy loading of non-critical data
- Efficient re-rendering with React.memo and useMemo

### Asset Optimization
- Lazy loading of images and animations
- WebP format for images with fallbacks
- SVG icons for scalability
- Compressed Lottie animations for celebrations