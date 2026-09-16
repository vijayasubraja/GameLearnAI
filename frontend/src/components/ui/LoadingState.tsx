import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ label = 'Loading…', className }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex items-center justify-center gap-3 py-16 text-ink-mid', className)}
    >
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export const InlineSpinner: React.FC<{ className?: string; label?: string }> = ({ className, label }) => (
  <span className={cn('inline-flex items-center gap-2 text-xs text-ink-mid', className)} role="status">
    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden />
    {label}
  </span>
);