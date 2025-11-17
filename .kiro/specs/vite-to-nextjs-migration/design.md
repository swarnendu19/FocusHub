# Design Document

## Overview

This design document outlines the comprehensive migration strategy for converting the existing Vite React gamified time tracking application to Next.js 15+. The migration will preserve all existing functionality, maintain the modern minimalist design aesthetic, and leverage Next.js benefits including improved performance, SEO capabilities, and modern React features.

The current application is a sophisticated gamified time tracker with XP systems, achievements, skill trees, leaderboards, and comprehensive analytics. It uses React 19, TypeScript, Tailwind CSS v4, Framer Motion for animations, Zustand for state management, and includes PWA capabilities.

## Architecture

### Current Architecture (Vite)
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.0.4 with custom configuration
- **Routing**: React Router DOM 7.6.3 with lazy loading
- **State Management**: Zustand 5.0.6 stores
- **Styling**: Tailwind CSS 4.1.11 with custom theme
- **Animations**: Framer Motion 12.23.6
- **UI Components**: Radix UI primitives + custom components
- **API Layer**: Axios with custom service layer
- **Testing**: Vitest + Playwright + Testing Library
- **PWA**: Vite PWA plugin with service worker

### Target Architecture (Next.js)
- **Frontend Framework**: Next.js 15+ with React 19
- **Routing**: Next.js App Router with file-based routing
- **State Management**: Zustand stores (preserved)
- **Styling**: Tailwind CSS 4+ with Next.js integration
- **Animations**: Framer Motion (preserved)
- **UI Components**: Radix UI + custom components (preserved)
- **API Layer**: Next.js API routes + client-side services
- **Testing**: Vitest + Playwright (adapted for Next.js)
- **PWA**: Next.js PWA plugin or custom service worker

### Migration Strategy
1. **Incremental Migration**: Convert components and pages systematically
2. **Preserve State**: Maintain all Zustand stores and business logic
3. **Route Mapping**: Convert React Router routes to Next.js App Router
4. **Component Compatibility**: Ensure all components work with Next.js SSR/SSG
5. **Performance Optimization**: Leverage Next.js built-in optimizations

## Components and Interfaces

### Directory Structure Mapping

**Current Vite Structure → Next.js Structure**
```
frontend/src/                    → frontend-new/
├── components/                  → components/
│   ├── ui/                     → components/ui/
│   ├── animations/             → components/animations/
│   ├── achievements/           → components/achievements/
│   ├── charts/                 → components/charts/
│   ├── layout/                 → components/layout/
│   └── ...                     → components/.../
├── pages/                      → app/
│   ├── Home/                   → app/page.tsx
│   ├── Projects/               → app/projects/page.tsx
│   ├── Skills/                 → app/skills/page.tsx
│   ├── Achievements/           → app/achievements/page.tsx
│   ├── XP/                     → app/xp/page.tsx
│   ├── Leaderboard/            → app/leaderboard/page.tsx
│   ├── Profile/                → app/profile/page.tsx
│   ├── Login/                  → app/login/page.tsx
│   └── AuthCallback/           → app/auth/callback/page.tsx
├── hooks/                      → hooks/
├── services/                   → services/
├── stores/                     → stores/
├── types/                      → types/
├── utils/                      → utils/
└── config/                     → config/
```

### Component Conversion Strategy

**Client Components (require 'use client')**
- All interactive components with state, effects, or event handlers
- Animation components using Framer Motion
- Components using browser APIs (localStorage, window, etc.)
- Timer components and real-time features
- Achievement celebration components

**Server Components (default)**
- Static layout components
- Data display components without interactivity
- SEO-related components
- Initial page shells

### Key Component Categories

**1. Layout Components**
- `Layout`: Main application layout with navigation
- `ProtectedRoute`: Authentication wrapper (convert to middleware)
- `ErrorBoundary`: Error handling wrapper
- `OfflineHandler`: PWA offline detection

**2. Feature Components**
- `TimerNotifications`: Real-time timer alerts
- `CelebrationManager`: Achievement animations
- `TaskTimer`: Time tracking interface
- `SkillTree`: Interactive skill progression
- `AchievementGrid`: Achievement display and progress
- `DataVisualizationDemo`: Charts and analytics

**3. UI Components**
- Radix UI components (preserved)
- Custom button, card, dialog components
- Form components with validation
- Loading and skeleton components

## Data Models

### State Management (Zustand Stores)

**Preserved Stores:**
```typescript
// stores/timerStore.ts - Timer state and controls
interface TimerStore {
  isRunning: boolean;
  currentTime: number;
  currentTask: Task | null;
  startTimer: (task: Task) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  recoverTimer: () => void;
}

// stores/userStore.ts - User authentication and profile
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileData) => Promise<void>;
}

// stores/projectStore.ts - Project management
interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  createProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

// stores/leaderboardStore.ts - Social features
interface LeaderboardStore {
  leaderboard: LeaderboardEntry[];
  userRank: number;
  fetchLeaderboard: () => Promise<void>;
  updateUserStats: (stats: UserStats) => void;
}
```

### API Integration

**Service Layer Preservation:**
```typescript
// services/api.ts - Base API configuration
class ApiService {
  private baseURL: string;
  private timeout: number;
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');
  }
}

// services/achievementService.ts - Achievement logic
interface AchievementService {
  getAchievements(): Promise<Achievement[]>;
  unlockAchievement(id: string): Promise<void>;
  trackProgress(type: string, value: number): Promise<void>;
}
```

### Environment Variables Migration

**Vite → Next.js Environment Variables:**
```bash
# Current (Vite)
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=...
VITE_ENABLE_ANALYTICS=true

# Target (Next.js)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Error Handling

### Error Boundary Strategy

**Global Error Handling:**
```typescript
// app/global-error.tsx - Next.js global error boundary
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="error-container">
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}

// app/error.tsx - Page-level error boundary
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h2>Oops! Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Error Tracking Integration
- Preserve existing error tracking service
- Adapt for Next.js error boundaries
- Maintain error reporting to external services
- Add Next.js specific error context

## Testing Strategy

### Test Migration Plan

**Current Testing Setup:**
- Vitest for unit/integration tests
- Playwright for E2E tests
- Testing Library for component tests
- Jest-axe for accessibility tests

**Next.js Testing Adaptation:**
```typescript
// vitest.config.ts - Updated for Next.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './components'),
      '@/app': resolve(__dirname, './app'),
    },
  },
});

// playwright.config.ts - Updated for Next.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

### Test Categories to Migrate
1. **Component Tests**: Update imports and test utilities
2. **Integration Tests**: Adapt for Next.js routing
3. **E2E Tests**: Update for new URL structure
4. **Performance Tests**: Leverage Next.js metrics
5. **Accessibility Tests**: Preserve existing a11y tests

## Routing Migration

### React Router → Next.js App Router

**Route Mapping:**
```typescript
// Current React Router routes
const routes = [
  { path: '/', component: Home },
  { path: '/projects', component: Projects },
  { path: '/skills', component: Skills },
  { path: '/achievements', component: Achievements },
  { path: '/xp', component: XP },
  { path: '/leaderboard', component: Leaderboard },
  { path: '/profile', component: Profile },
  { path: '/login', component: Login },
  { path: '/auth/callback', component: AuthCallback },
  { path: '/demo/achievements', component: Achievements },
  { path: '/demo/data-visualization', component: DataVisualizationDemo },
  { path: '/demo/celebrations', component: CelebrationDemo },
];

// Next.js App Router structure
app/
├── page.tsx                    // Home (/)
├── projects/page.tsx           // Projects (/projects)
├── skills/page.tsx            // Skills (/skills)
├── achievements/page.tsx       // Achievements (/achievements)
├── xp/page.tsx                // XP (/xp)
├── leaderboard/page.tsx       // Leaderboard (/leaderboard)
├── profile/page.tsx           // Profile (/profile)
├── login/page.tsx             // Login (/login)
├── auth/callback/page.tsx     // Auth Callback (/auth/callback)
└── demo/
    ├── achievements/page.tsx   // Demo Achievements
    ├── data-visualization/page.tsx // Demo Data Viz
    └── celebrations/page.tsx   // Demo Celebrations
```

### Authentication Middleware
```typescript
// middleware.ts - Replace ProtectedRoute with Next.js middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isPublicPage = ['/health', '/demo'].some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Performance Optimization

### Next.js Optimizations

**1. Image Optimization**
```typescript
// Replace img tags with Next.js Image component
import Image from 'next/image';

// Before (Vite)
<img src="/achievement-badge.png" alt="Achievement" />

// After (Next.js)
<Image
  src="/achievement-badge.png"
  alt="Achievement"
  width={64}
  height={64}
  priority={false}
/>
```

**2. Font Optimization**
```typescript
// app/layout.tsx - Optimize font loading
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**3. Bundle Optimization**
```typescript
// next.config.ts - Performance configuration
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@radix-ui/react-dialog',
      'lucide-react',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
```

### PWA Migration

**Service Worker Strategy:**
```typescript
// public/sw.js - Preserve PWA functionality
const CACHE_NAME = 'time-tracker-v1';
const urlsToCache = [
  '/',
  '/projects',
  '/skills',
  '/achievements',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// app/layout.tsx - Register service worker
'use client';

useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

## Styling and Theme

### Tailwind CSS v4 Integration

**Configuration:**
```typescript
// tailwind.config.ts - Next.js compatible configuration
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1C1C1C',
        foreground: '#FFFFFF',
        secondary: '#757373',
        muted: '#FAFAFA',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

**CSS Variables:**
```css
/* app/globals.css - Preserve color theme */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #1C1C1C;
  --foreground: #FFFFFF;
  --secondary: #757373;
  --muted: #FAFAFA;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}
```

## Migration Phases

### Phase 1: Foundation Setup
- Initialize Next.js project structure
- Configure TypeScript and path aliases
- Set up Tailwind CSS v4
- Migrate environment variables

### Phase 2: Core Infrastructure
- Convert layout components
- Implement authentication middleware
- Set up error boundaries
- Configure testing framework

### Phase 3: Page Migration
- Convert static pages first
- Migrate interactive pages
- Implement routing
- Add loading and error states

### Phase 4: Feature Integration
- Migrate Zustand stores
- Convert service layer
- Implement PWA features
- Add performance optimizations

### Phase 5: Testing and Optimization
- Run comprehensive test suite
- Performance auditing
- Accessibility validation
- Production deployment preparation

## Risk Mitigation

### Potential Issues and Solutions

**1. SSR Compatibility**
- Issue: Client-only components breaking SSR
- Solution: Proper 'use client' directives and dynamic imports

**2. State Hydration**
- Issue: Zustand state mismatch between server and client
- Solution: Implement proper hydration patterns

**3. Animation Performance**
- Issue: Framer Motion SSR issues
- Solution: Use dynamic imports for animation components

**4. Bundle Size**
- Issue: Increased bundle size with Next.js
- Solution: Optimize imports and use Next.js tree shaking

**5. Environment Variables**
- Issue: VITE_ prefixed variables not working
- Solution: Systematic conversion to NEXT_PUBLIC_ prefix

This design provides a comprehensive roadmap for migrating the Vite React application to Next.js while preserving all functionality, maintaining the design aesthetic, and leveraging Next.js performance benefits.