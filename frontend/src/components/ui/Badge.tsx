import React from 'react';
import { cn } from '../../lib/cn';

type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.06] text-ink-mid border-white/10',
  primary: 'bg-primary-subtle text-primary-text border-primary/30',
  success: 'bg-success-subtle text-success-text border-success/30',
  warning: 'bg-warning-subtle text-warning-text border-warning/30',
  danger: 'bg-danger-subtle text-danger-text border-danger/30',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

const dotTones: Record<BadgeTone, string> = {
  neutral: 'bg-ink-mid',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', size = 'sm', dot = false, className, children, ...rest }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium uppercase tracking-wider',
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotTones[tone])} aria-hidden />}
      {children}
    </span>
  );
};