import React from 'react';
import { Outlet } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

/**
 * Public layout for unauthenticated pages (login, register).
 * Clean centered form — no chrome, no sidebar.
 */
export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gl-bg bg-gl-grid px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-ink-high">
            GameLearn<span className="text-primary"> AI</span>
          </span>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};