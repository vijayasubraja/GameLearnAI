import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Radar,
  Library,
  BarChart3,
  User,
  LogOut,
  Gamepad2,
} from 'lucide-react';
import { cn } from '../../lib/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/skills', label: 'Skills', icon: Radar },
  { to: '/scenarios', label: 'Scenarios', icon: Library },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
] as const;

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onNavigate?.();
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-subtle text-primary-text'
        : 'text-ink-mid hover:text-ink-high hover:bg-white/[0.05]'
    );

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r border-gl-border bg-gl-surface',
        className
      )}
    >
      {/* Brand */}
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 py-5 transition-opacity hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Gamepad2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold tracking-tight text-ink-high">
            GameLearn<span className="text-primary"> AI</span>
          </p>
          <p className="label-hud -mt-0.5">Learning Platform</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Primary">
        <ul className="space-y-1" role="list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} onClick={onNavigate} className={navClass} end>
                <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gl-border px-3 py-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-white/[0.03] px-3 py-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-[10px] font-bold text-primary-text">
            {(user?.username ?? 'U')[0].toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-ink-high">{user?.full_name || user?.username}</p>
            <p className="label-hud truncate">{user?.username}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-mid transition-colors hover:bg-danger-subtle hover:text-danger-text"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
};