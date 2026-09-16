import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-gl-borderStrong px-6 py-12 text-center',
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05] text-ink-low">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink-high">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs leading-relaxed text-ink-mid">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};