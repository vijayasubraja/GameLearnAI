import React from 'react';
import { cn } from '../../lib/cn';
import { Skeleton } from './Skeleton';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  className?: string;
}

const toneIcon: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'text-ink-mid bg-white/[0.05]',
  primary: 'text-primary-text bg-primary-subtle',
  success: 'text-success-text bg-success-subtle',
  warning: 'text-warning-text bg-warning-subtle',
  danger: 'text-danger-text bg-danger-subtle',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  tone = 'default',
  loading = false,
  className,
}) => {
  return (
    <div className={cn('panel rounded-xl p-4 sm:p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-hud">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-16" />
          ) : (
            <p className="mt-1.5 font-display text-2xl font-bold text-ink-high leading-none tabular-nums">{value}</p>
          )}
          {!loading && sublabel && <p className="mt-1.5 truncate text-xs text-ink-low">{sublabel}</p>}
        </div>
        {icon && (
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', toneIcon[tone])} aria-hidden>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};