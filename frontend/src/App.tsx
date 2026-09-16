import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { AuthLayout } from './components/layout/AuthLayout';
import { LoadingState } from './components/ui/LoadingState';

/* Public pages */
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);

/* Authenticated app pages (rendered inside AppShell) */
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const SkillsPage = lazy(() => import('./pages/SkillsPage').then((m) => ({ default: m.SkillsPage })));
const ScenariosPage = lazy(() =>
  import('./pages/ScenariosPage').then((m) => ({ default: m.ScenariosPage }))
);
const ScenarioBriefingPage = lazy(() =>
  import('./pages/ScenarioBriefingPage').then((m) => ({ default: m.ScenarioBriefingPage }))
);
const ProgressPage = lazy(() =>
  import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage }))
);
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const ResultsPage = lazy(() => import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage })));

/* Immersive simulation — rendered WITHOUT the app shell */
const SimulationPlayPage = lazy(() =>
  import('./pages/SimulationPlayPage').then((m) => ({ default: m.SimulationPlayPage }))
);

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gl-bg">
    <LoadingState label="Loading…" />
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected app shell */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/scenarios" element={<ScenariosPage />} />
              <Route path="/scenarios/:scenarioId" element={<ScenarioBriefingPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/results/:attemptId" element={<ResultsPage />} />
            </Route>

            {/* Immersive simulation — no app shell */}
            <Route
              path="/simulation/:scenarioId"
              element={
                <ProtectedRoute>
                  <SimulationPlayPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<FallbackRoute />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

const FallbackRoute: React.FC = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/dashboard' : '/'} replace />;
};

export default App;