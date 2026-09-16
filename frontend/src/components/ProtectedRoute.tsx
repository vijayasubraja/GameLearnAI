import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { InlineSpinner } from './ui/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Auth route guard — renders children if authenticated, otherwise
 * redirects to /login preserving the original location.
 * Keeps the existing pattern but uses the new inline spinner.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gl-bg">
        <div className="flex flex-col items-center gap-3">
          <InlineSpinner label="Authenticating session…" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};