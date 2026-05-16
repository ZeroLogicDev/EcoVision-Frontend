import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import AppLayout from '@/components/layouts/AppLayout';
import AuthLayout from '@/components/layouts/AuthLayout';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

/* ─── Lazy-loaded pages ─── */
const Landing = lazy(() => import('@/pages/Landing'));
const Auth = lazy(() => import('@/pages/Auth'));
const AuthCallback = lazy(() => import('@/pages/Auth/AuthCallback'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Scanner = lazy(() => import('@/pages/Scanner'));
const History = lazy(() => import('@/pages/History'));
const Profile = lazy(() => import('@/pages/Profile'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public */}
          <Route path={ROUTES.LANDING} element={<Landing />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Auth />} />
            <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
          </Route>

          {/* Protected — wrapped in AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.SCANNER} element={<Scanner />} />
              <Route path={ROUTES.HISTORY} element={<History />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
