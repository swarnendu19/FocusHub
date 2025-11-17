# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **gamified time tracking application** built with Next.js 15+ and React 19. The app features XP systems, achievements, skill trees, leaderboards, and comprehensive analytics with a modern minimalist black/white design.

**Key Technologies:**

- Framework: Next.js 15+ with App Router and React 19
- Language: TypeScript with strict mode
- Styling: Tailwind CSS v4
- State Management: Zustand
- Animations: Framer Motion
- UI Components: Radix UI primitives
- Testing: Vitest (unit) + Playwright (e2e)
- Build Tool: Next.js with Turbopack

## Development Commands

### Essential Commands

```bash
# Development
bun  run dev                    # Start dev server (http://localhost:3000)
bun  run build                  # Production build
bun  run start                  # Start production server
bun  run type-check             # Run TypeScript type checking

# Testing
bun  run test                   # Run unit tests with Vitest
bun  run test:watch             # Run tests in watch mode
bun  run test:coverage          # Run tests with coverage report
bun  run test:e2e               # Run e2e tests with Playwright
bun  run test:e2e:ui            # Run e2e tests with Playwright UI
bun  run test:all               # Run all tests (unit + e2e)

# Specialized Testing
bun  run test:visual            # Visual regression tests
bun  run test:performance       # Performance tests
bun  run test:accessibility     # Accessibility tests (a11y)
bun  run test:api               # API integration tests

# Code Quality
bun  run lint                   # Run ESLint
bun  run lint:fix               # Auto-fix ESLint issues

# Build Analysis
bun  run build:analyze          # Build with bundle analyzer
bun  run lighthouse             # Run Lighthouse performance audit

# Utilities
bun  run clean                  # Clear .next and cache
bun  run clean:all              # Clear .next and node_modules
```

### Running Single Tests

```bash
# Vitest (unit tests)
bun  run test -- path/to/test.test.ts
bun  run test -- -t "test name pattern"

# Playwright (e2e tests)
bun  run test:e2e -- tests/e2e/specific.spec.ts
bun  run test:e2e -- --grep "test name pattern"
```

## Architecture

### Migration Status

This project was **migrated from Vite to Next.js 15+**. The codebase is currently in a transitional state:

- Core Next.js structure is in place (app/, public/, next.config.ts)
- Migration scaffolding exists: `stores/`, `services/`, `hooks/`, `types/`, `utils/`, `config/` directories have barrel files ready for content migration
- The actual components, stores, hooks, and business logic from the Vite version still need to be migrated into the Next.js structure

### Directory Structure

```
frontend-new/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components (to be migrated)
├── hooks/                 # Custom React hooks (to be migrated)
├── services/              # API services and business logic (to be migrated)
├── stores/                # Zustand state stores (to be migrated)
├── types/                 # TypeScript type definitions (to be migrated)
├── utils/                 # Utility functions (to be migrated)
├── config/                # Configuration files (to be migrated)
├── assets/                # Static assets (fonts, icons)
└── public/                # Public static files
```

### Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:

```typescript
@/*              // Root directory
@/components/*   // components/
@/app/*          // app/
@/hooks/*        // hooks/
@/services/*     // services/
@/stores/*       // stores/
@/types/*        // types/
@/utils/*        // utils/
@/assets/*       // assets/
@/config/*       // config/
```

Always use these aliases for imports instead of relative paths.

### Next.js Configuration Highlights

**Performance Optimizations** (`next.config.ts`):

- Package imports optimized for: framer-motion, Radix UI components, lucide-react
- Turbopack enabled with SVG support via @svgr/webpack
- Console logs removed in production builds
- Image optimization with WebP and AVIF formats
- Standalone output mode for Docker deployment

**Security Headers** configured:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

### Testing Architecture

**Vitest Configuration** (`vitest.config.ts`):

- Environment: jsdom for React component testing
- Setup file: `./src/tests/setup.ts`
- Coverage provider: v8
- Supports same path aliases as main app

**Playwright Configuration** (`playwright.config.ts`):

- E2E tests in `./tests/e2e/`
- Multiple test projects configured:
  - **chromium, firefox, webkit** - Browser testing
  - **Mobile Chrome, Mobile Safari** - Mobile testing
  - **performance** - Performance tests (`./tests/performance/`)
  - **accessibility** - A11y tests (`./tests/accessibility/`)
  - **visual-regression** - Visual tests (`./tests/visual/`)
  - **api-integration** - API tests (`./tests/api/`)
- Auto-starts dev server before tests
- Base URL: http://localhost:3000

### Environment Variables

**Client-side variables** (prefix with `NEXT_PUBLIC_`):

- `NEXT_PUBLIC_API_BASE_URL` - Backend API endpoint
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth
- Feature flags: `NEXT_PUBLIC_ENABLE_ANALYTICS`, `NEXT_PUBLIC_ENABLE_AI_FEATURES`, etc.
- PWA settings, analytics IDs, performance monitoring

**Server-side only** (no prefix):

- `DATABASE_URL` - Database connection
- `JWT_SECRET` - JWT signing secret

See `.env.example` for complete list. Copy to `.env.local` for local development.

### Key Architectural Patterns

**State Management:**

- Zustand stores will be the primary state management solution
- Store files should export typed hooks for components to consume
- Follow the pattern: create store → export typed selectors → use in components

**Component Patterns:**

- Use Radix UI primitives for accessible UI components
- Wrap Radix components with project-specific styling using Tailwind + CVA (class-variance-authority)
- Framer Motion for animations
- Components should be organized by feature or by shared/common

**Styling:**

- Tailwind CSS v4 utility-first approach
- Black and white minimalist design theme
- Dark mode support via Tailwind classes
- `tailwind-merge` (imported as `cn` utility) for conditional classes

**Font Setup:**

- Geist Sans and Geist Mono loaded via next/font/google
- CSS variables: `--font-geist-sans`, `--font-geist-mono`

## Development Workflow

### When Starting New Features

1. Check if feature needs new types in `types/`
2. Create or update Zustand stores in `stores/` if state management needed
3. Implement service layer in `services/` for API calls or business logic
4. Create custom hooks in `hooks/` for component logic reuse
5. Build UI components using Radix UI + Tailwind
6. Add unit tests with Vitest and e2e tests with Playwright

### TypeScript Configuration

- Strict mode enabled
- All unused locals and parameters flagged as errors
- No fallthrough cases in switch statements
- Module resolution: bundler (modern ESM approach)

### Before Committing

```bash
bun run type-check    # Ensure no TypeScript errors
bun  run lint          # Check for linting issues
bun  run test:run      # Run unit tests
```

## Important Notes

- **PWA Support**: App has offline functionality, consider service worker implications
- **Accessibility**: WCAG 2.1 AA compliance required, use semantic HTML and ARIA labels
- **Performance**: Bundle size matters, use dynamic imports for heavy components
- **Google OAuth**: Authentication flow integrated, requires client ID in env vars
- **Analytics**: Multiple analytics providers supported (GA, Hotjar), respect feature flags
- **Error Tracking**: Sentry integration available when enabled

## Gamification Features

The app includes:

- **XP System** - Points earned for time tracking activities
- **Achievements** - Unlockable badges and rewards
- **Skill Trees** - Progression system for different categories
- **Leaderboards** - Competitive rankings
- **Analytics Dashboard** - Data visualization for tracked time

When working on these features, maintain consistency with the gamification theme and ensure smooth animations using Framer Motion.

## Migration & Development Roadmap

This section tracks the migration from Vite to Next.js 15+ and ongoing development tasks.

### Core Infrastructure

- [x] 1. Verify Next.js 15+ project foundation

  - [x] Confirm Next.js 16.0.3 installation and configuration (latest version)
  - [x] Verify React 19.2.0 setup with proper TypeScript types
  - [x] Ensure app router structure is properly initialized
  - [x] Test basic development server and hot module replacement
  - [x] Fix Turbopack configuration deprecation warnings
  - [x] Configure TypeScript with strict mode and path aliases

- [x] 2. Configure Tailwind CSS v4 and preserve color theme

  - [x] Install and configure Tailwind CSS v4.1.17 for Next.js
  - [x] Create globals.css with exact color variables: #1C1C1C, #757373, #FFFFFF, #FAFAFA
  - [x] Set up PostCSS configuration for Tailwind processing
  - [x] Verify black/white minimalist design system is applied
  - [x] Add @theme inline configuration with semantic color mappings
  - [x] Configure dark mode support and accessibility features
  - [x] Create utils/cn.ts utility for Tailwind class merging

- [x] 3. Set up development and build tooling

  - [x] Configure ESLint for Next.js with TypeScript support
  - [x] Set up Vitest configuration adapted for Next.js project structure
  - [x] Configure Playwright for E2E testing with Next.js dev server
  - [x] Create bun scripts for development, build, test, and lint commands
  - [x] Add bundle analyzer and Lighthouse audit scripts
  - [x] Configure multiple Playwright test projects (chromium, firefox, webkit, mobile, performance, accessibility, visual-regression, api-integration)
  - [x] Create comprehensive TESTING.md documentation
  - [x] Write initial unit tests (utils/cn.test.ts with 8 tests)

- [x] 4. Migrate environment variables and configuration
  - [x] Convert all VITE* prefixed environment variables to NEXT_PUBLIC* format
  - [x] Create .env.local, .env.example, and .env.production files
  - [x] Implement environment configuration service compatible with Next.js (config/index.ts)
  - [x] Document all required environment variables
  - [x] Create config/env.ts for type-safe environment variable access
  - [x] Create config/constants.ts for application constants
  - [x] Add environment variable validation with validateEnv()
  - [x] Write comprehensive unit tests for configuration (16 tests)

### Type System & Utilities

- [x] 5. Migrate TypeScript type definitions

  - [x] Copy all type definitions from Vite version to types/ directory
  - [x] Create domain-specific type files (user.types.ts, timer.types.ts, gamification.types.ts, project.types.ts)
  - [x] Define API request/response types (api.types.ts)
  - [x] Set up shared utility types and type guards (common.types.ts)
  - [x] Ensure strict TypeScript compliance (all types passed type-check)
  - [x] Create types/index.ts barrel export for centralized type access

- [x] 6. Migrate utility functions
  - [x] Copy utility functions to utils/ directory
  - [x] Implement date/time helpers for timer functionality (datetime.ts with 30+ functions)
  - [x] Create formatting utilities (format.ts with 30+ functions for time, numbers, currency)
  - [x] Add validation utilities (validation.ts with 40+ validation functions)
  - [x] Create cn() utility for Tailwind class merging (already completed in task #2)
  - [x] Write comprehensive unit tests for all utility functions (77 tests across 4 test files)

### State Management & Services

- [ ] 7. Migrate Zustand stores

  - Copy and adapt timerStore with SSR hydration support
  - Migrate userStore for authentication state
  - Copy projectStore for project management
  - Migrate achievementStore for gamification tracking
  - Copy skillTreeStore for skill progression
  - Migrate leaderboardStore for social features
  - Ensure proper state persistence and recovery
  - Add TypeScript types for all store actions and selectors

- [ ] 8. Convert service layer and API integration

  - Migrate api.ts with axios configuration for Next.js env vars
  - Copy achievementService.ts for achievement management
  - Migrate analytics.ts for tracking integration
  - Copy authService.ts for Google OAuth flow
  - Migrate leaderboardService.ts for competitive features
  - Copy projectService.ts for project CRUD operations
  - Migrate skillTreeService.ts for progression system
  - Copy timerService.ts for time tracking backend calls
  - Ensure all API endpoints use NEXT*PUBLIC* environment variables

- [ ] 9. Migrate custom React hooks
  - Copy useTimer hook with proper client-side logic
  - Migrate useAuth hook for authentication state
  - Copy useNotifications hook for browser notifications
  - Migrate useKeyboardShortcuts hook for accessibility
  - Copy useLocalStorage hook with SSR safety
  - Migrate useDebounce and useThrottle performance hooks
  - Add 'use client' directives where necessary

### Routing & Navigation

- [ ] 10. Create Next.js app directory structure and routing

  - Set up app directory with page.tsx files for all existing routes
  - Create layout.tsx for root layout with proper HTML structure
  - Implement loading.tsx and error.tsx files for each route
  - Map all React Router routes to Next.js App Router file structure
  - Create nested layouts for authenticated sections

- [ ] 11. Implement authentication middleware
  - Create middleware.ts to replace ProtectedRoute component functionality
  - Implement route protection logic for authenticated and public routes
  - Handle authentication redirects and route guards
  - Add session validation logic

### Core Layout Components

- [ ] 12. Migrate core layout components
  - Convert Layout component to Next.js compatible format with 'use client' directive
  - Migrate ErrorBoundary to Next.js error.tsx and global-error.tsx pattern
  - Convert OfflineHandler component for client-side PWA functionality
  - Migrate Navigation/Sidebar components with proper routing
  - Copy Header/Footer components with responsive design

### UI Component Library

- [ ] 13. Migrate Radix UI component wrappers

  - Copy Button component with variants (primary, secondary, ghost, outline)
  - Migrate Card component with header, content, footer sections
  - Copy Dialog/Modal component for overlays
  - Migrate Dropdown component for menus
  - Copy Tabs component for navigation
  - Migrate Tooltip component for accessibility
  - Copy Progress component for loading states
  - Migrate Badge component for status indicators
  - Add 'use client' directives to all interactive components

- [ ] 14. Migrate form components
  - Copy Input component with validation states
  - Migrate TextArea component for long-form input
  - Copy Select/Combobox components for dropdowns
  - Migrate Checkbox and Radio components
  - Copy Switch/Toggle components
  - Migrate DatePicker for time-based inputs
  - Implement form validation with react-hook-form integration

### Animation & Visual Effects

- [ ] 15. Convert animation components with Framer Motion
  - Migrate CelebrationManager for achievement unlocks
  - Copy ConfettiSystem for visual celebrations
  - Migrate ParticleEffects for ambient animations
  - Copy AnimatedCounter for number transitions
  - Migrate PageTransition component for route changes
  - Copy ProgressBar with animated fills
  - Ensure all animations have proper client-side rendering
  - Add prefers-reduced-motion support

### Timer & Real-Time Features

- [ ] 16. Migrate timer and real-time features
  - Convert TimerNotifications component with browser notification API
  - Migrate TaskTimer component with state management integration
  - Copy TimerControls for start/stop/pause functionality
  - Migrate TimerDisplay with formatted time output
  - Copy TimerHistory component for past sessions
  - Ensure timer recovery and persistence works in Next.js environment
  - Implement timer background sync for PWA

### Gamification Components

- [ ] 17. Convert XP and progression system

  - Migrate XPBar component with animated progress
  - Copy XPHistory component for tracking gains
  - Migrate LevelUpModal for level progression celebrations
  - Copy XPBreakdown component for detailed statistics
  - Implement XP calculation and leveling logic

- [ ] 18. Migrate achievement system

  - Copy AchievementGrid for displaying all achievements
  - Migrate AchievementCard with unlock status
  - Copy AchievementModal for detailed achievement view
  - Migrate AchievementNotification for unlock celebrations
  - Copy AchievementProgress component for tracking
  - Implement achievement unlock logic and validation

- [ ] 19. Convert skill tree features

  - Migrate SkillTree component with node visualization
  - Copy SkillNode component with unlock states
  - Migrate SkillConnections for visual tree structure
  - Copy SkillModal for detailed skill information
  - Migrate SkillProgress component for tracking
  - Implement skill unlock logic and prerequisites

- [ ] 20. Migrate leaderboard and social features
  - Copy LeaderboardTable with rankings
  - Migrate LeaderboardFilters for time periods and categories
  - Copy UserRank component for current user position
  - Migrate SocialShare component for achievements
  - Copy FriendsList for social connections
  - Implement real-time leaderboard updates

### Data Visualization & Analytics

- [ ] 21. Migrate chart and data visualization components
  - Convert AnimatedBarChart with responsive design
  - Migrate TimeTrackingChart for daily/weekly/monthly views
  - Copy ProductivityChart for efficiency metrics
  - Migrate CategoryBreakdown for project distribution
  - Copy HeatMap for activity visualization
  - Migrate StatCard for key metrics display
  - Ensure proper client-side rendering for interactive charts
  - Test chart responsiveness on mobile devices

### Page Components

- [ ] 22. Convert authentication pages

  - Migrate Login page with Google OAuth integration
  - Copy AuthCallback page for OAuth flow completion
  - Migrate Register page (if applicable)
  - Copy ForgotPassword page (if applicable)
  - Ensure proper authentication flow in Next.js environment

- [ ] 23. Migrate dashboard and home page

  - Convert Home page with dashboard functionality
  - Copy QuickStats widget for overview metrics
  - Migrate RecentActivity component for activity feed
  - Copy ActiveTimers display
  - Migrate DailyGoals component for goal tracking
  - Implement proper data fetching with React Server Components where applicable

- [ ] 24. Convert project management pages

  - Migrate Projects page with project list
  - Copy ProjectCard component for project display
  - Migrate CreateProjectModal for new projects
  - Copy EditProjectModal for project updates
  - Migrate ProjectDetails page for individual projects
  - Copy ProjectStats component for project analytics
  - Implement CRUD operations for projects

- [ ] 25. Migrate gamification pages

  - Convert Skills page with skill tree interface
  - Migrate Achievements page with achievement grids
  - Copy XP page with history and statistics
  - Migrate Leaderboard page with social features and rankings

- [ ] 26. Convert profile and settings pages
  - Migrate Profile page with user information
  - Copy ProfileEditor for updating user data
  - Migrate Settings page with application preferences
  - Copy NotificationSettings for notification preferences
  - Migrate ThemeSettings for appearance customization
  - Copy AccountSettings for account management
  - Implement profile update functionality

### PWA & Offline Functionality

- [ ] 27. Set up PWA functionality
  - Create service worker for offline functionality
  - Implement PWA manifest with proper configuration
  - Add offline.html page for offline fallback
  - Configure caching strategies for API calls and static assets
  - Test offline functionality and cache invalidation
  - Add install prompt for PWA installation

### Performance & Optimization

- [ ] 28. Optimize images and assets

  - Replace all img tags with Next.js Image component
  - Optimize image loading with proper width, height, and priority settings
  - Configure next.config.ts for image optimization
  - Add loading="lazy" for below-the-fold images
  - Implement placeholder blur for image loading

- [ ] 29. Implement performance optimizations

  - Configure bundle optimization in next.config.ts
  - Set up font optimization with Next.js font loading
  - Implement proper code splitting and lazy loading
  - Use dynamic imports for heavy components (charts, animations)
  - Optimize package imports for framer-motion and Radix UI
  - Add proper caching headers for static assets

- [ ] 30. Implement SEO and meta tags
  - Add metadata to all page routes
  - Create proper OpenGraph tags for social sharing
  - Implement structured data where applicable
  - Add robots.txt and sitemap.xml
  - Configure next-seo or built-in metadata API

### Testing & Quality Assurance

- [ ] 31. Migrate and adapt unit test suites

  - Update all component tests for Next.js compatibility
  - Migrate store tests with proper mock setup
  - Copy service layer tests with API mocking
  - Migrate utility function tests
  - Ensure all existing test coverage is maintained
  - Run tests and fix any breaking changes

- [ ] 32. Create integration tests

  - Write integration tests for authentication flow
  - Test timer functionality end-to-end
  - Create tests for gamification features
  - Test data persistence and recovery
  - Verify state management integration

- [ ] 33. Set up E2E testing with Playwright

  - Update E2E tests for new URL structure and routing
  - Test critical user journeys (login, timer, projects)
  - Create tests for gamification flows
  - Test responsive design on mobile viewports
  - Add visual regression tests for key pages

- [ ] 34. Implement accessibility testing

  - Run axe-core audits on all pages
  - Test keyboard navigation throughout app
  - Verify screen reader compatibility
  - Test focus management in modals and dialogs
  - Ensure WCAG 2.1 AA compliance

- [ ] 35. Performance testing and monitoring
  - Run Lighthouse audits on all pages
  - Test Core Web Vitals (LCP, FID, CLS)
  - Benchmark against Vite version performance
  - Set up performance monitoring (optional)
  - Optimize based on audit results

### Production Readiness

- [ ] 36. Configure production build and deployment

  - Set up production build configuration with optimizations
  - Configure deployment settings for Next.js (Vercel/custom)
  - Test production build locally
  - Set up environment variables for production
  - Configure CI/CD pipeline (if applicable)

- [ ] 37. Security hardening

  - Implement security headers in next.config.ts
  - Add CSRF protection for forms
  - Implement rate limiting for API calls
  - Add input sanitization and validation
  - Configure Content Security Policy
  - Audit dependencies for vulnerabilities

- [ ] 38. Validate feature parity

  - Test all gamification features (XP, achievements, skill tree, leaderboard)
  - Verify timer functionality and real-time features
  - Validate all animations and celebration effects
  - Ensure responsive design on mobile and tablet
  - Test all CRUD operations (projects, tasks, settings)
  - Verify authentication and authorization flows
  - Test offline functionality and data sync

- [ ] 39. Cross-browser and cross-device testing
  - Test on Chrome, Firefox, Safari, Edge
  - Test on iOS Safari and Android Chrome
  - Verify responsive design breakpoints
  - Test PWA installation on mobile devices
  - Verify touch interactions and gestures

### Documentation & Handoff

- [ ] 40. Create migration documentation

  - Document all changes made during migration
  - Create setup and development instructions for Next.js version
  - Document any Next.js specific considerations and best practices
  - Update README.md with new tech stack and commands
  - Create deployment guide for production

- [ ] 41. Code cleanup and technical debt

  - Remove unused dependencies from package.json
  - Clean up commented-out code
  - Standardize code formatting across all files
  - Add JSDoc comments for complex functions
  - Refactor duplicated code into shared utilities

- [ ] 42. Final review and launch preparation
  - Conduct code review of all migrated components
  - Run full test suite (unit + integration + e2e)
  - Perform security audit
  - Test production build one final time
  - Create release notes for stakeholders
  - Plan rollout strategy and rollback procedure
