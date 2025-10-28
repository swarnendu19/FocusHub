import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TimerNotifications } from './components/timer';
import { CelebrationManager } from './components/animations';
import { ErrorBoundary, OfflineHandler, FullPageLoading } from './components/error';
import { useTimerStore } from './stores/timerStore';
import { useServiceWorker } from './hooks/useServiceWorker';
import { analytics } from './services/analytics';
import { errorTracking } from './services/errorTracking';
import { useUserStore } from './stores/userStore';
import { env } from './config/env';
import './App.css';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(module => ({ default: module.AuthCallback })));
const Home = lazy(() => import('./pages/Home/Home').then(module => ({ default: module.Home })));
const Projects = lazy(() => import('./pages/Projects').then(module => ({ default: module.Projects })));
const Leaderboard = lazy(() => import('./pages/Leaderboard').then(module => ({ default: module.Leaderboard })));
const XP = lazy(() => import('./pages/XP').then(module => ({ default: module.XP })));
const Skills = lazy(() => import('./pages/Skills').then(module => ({ default: module.Skills })));
const Achievements = lazy(() => import('./pages/Achievements').then(module => ({ default: module.Achievements })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const HealthCheck = lazy(() => import('./pages/health'));

// Demo pages
const DataVisualizationDemo = lazy(() => import('./components/charts/DataVisualizationDemo').then(module => ({ default: module.DataVisualizationDemo })));
const CelebrationDemo = lazy(() => import('./components/animations/CelebrationDemo').then(module => ({ default: module.CelebrationDemo })));

function App() {
  const { recoverTimer } = useTimerStore();
  const { register } = useServiceWorker();
  const { user } = useUserStore();

  // Initialize service worker
  useEffect(() => {
    if (env.pwaEnabled) {
      register();
    }
  }, [register]);

  // Recover timer state from localStorage
  useEffect(() => {
    recoverTimer();
  }, [recoverTimer]);

  // Set up analytics and error tracking
  useEffect(() => {
    // Track page views
    const handleRouteChange = () => {
      analytics.trackPageView(window.location.pathname);
    };

    // Initial page view
    handleRouteChange();

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    // Set user ID for analytics and error tracking if available
    if (user?.id) {
      analytics.setUserId(user.id);
      errorTracking.setUserId(user.id);
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [user?.id]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        errorTracking.captureError(error, errorInfo, 'high');
      }}
    >
      <OfflineHandler>
        <CelebrationManager>
          <Router>
            <div className="App">
              <Suspense fallback={<FullPageLoading />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/health" element={<HealthCheck />} />

                  {/* Demo routes */}
                  <Route path="/demo/achievements" element={<Achievements />} />
                  <Route path="/demo/data-visualization" element={<DataVisualizationDemo />} />
                  <Route path="/demo/celebrations" element={<CelebrationDemo />} />

                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout>
                        <Home />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <Layout>
                        <Projects />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/leaderboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <Leaderboard />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/xp" element={
                    <ProtectedRoute>
                      <Layout>
                        <XP />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/skills" element={
                    <ProtectedRoute>
                      <Layout>
                        <Skills />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  } />
                </Routes>
              </Suspense>

              {/* Global components */}
              <TimerNotifications />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  },
                }}
              />
            </div>
          </Router>
        </CelebrationManager>
      </OfflineHandler>
    </ErrorBoundary>
  );
}

export default App;