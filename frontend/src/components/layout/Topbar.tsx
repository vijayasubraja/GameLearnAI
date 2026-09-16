import React from 'react';
import { Menu, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface TopbarProps {
  onOpenSidebar: () => void;
  streakDays?: number;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar, streakDays }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-gl-border bg-gl-bg/80 px-4 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-mid transition-colors hover:bg-white/[0.06] hover:text-ink-high"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      {streakDays != null && streakDays > 0 && (
        <Badge tone="warning" size="sm" dot>
          <Flame className="inline-block h-3 w-3 -ml-0.5 mr-0.5 -mt-px" />
          {streakDays}d streak
        </Badge>
      )}

      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-subtle text-[10px] font-bold text-primary-text">
        {(user?.username ?? 'U')[0].toUpperCase()}
      </div>
    </header>
  );
};