import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApi } from '../../hooks/useApi';
import { profileService } from '../../services/profileService';

/**
 * Protected authenticated application layout.
 * The 3D simulation screen renders outside this shell (no sidebar/topbar).
 */
export const AppShell: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: dashboard } = useApi(() => profileService.getDashboard(), { immediate: true });

  return (
    <div className="flex h-screen overflow-hidden bg-gl-bg">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 animate-slide-in-left lg:hidden">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} streakDays={dashboard?.learning_streak_days} />

        <main className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet context={{ dashboard }} />
          </div>
        </main>
      </div>
    </div>
  );
};