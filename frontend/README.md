# Gamified Time Tracker Frontend

A React TypeScript application with Duolingo-inspired animations and gamification elements for time tracking.

## Project Structure

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

## Development

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- npm

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

### Backend Integration

The frontend is configured to proxy API requests to the backend server running on `http://localhost:3001`. Make sure the backend server is running when developing.

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/pages/*` → `./src/pages/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/services/*` → `./src/services/*`
- `@/stores/*` → `./src/stores/*`
- `@/types/*` → `./src/types/*`
- `@/utils/*` → `./src/utils/*`
- `@/assets/*` → `./src/assets/*`

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** (to be configured)
- **Framer Motion** (to be installed)
- **Zustand** for state management (to be installed)
- **React Router** for navigation (to be installed)
- **Axios** for API communication (to be installed)

## Next Steps

1. Install and configure shadcn/ui with Tailwind CSS
2. Set up development tools (ESLint, Prettier)
3. Install core dependencies (Framer Motion, Zustand, React Router, Axios)
4. Begin implementing UI components and pages