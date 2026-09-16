import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/cn';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We could not load this data. Please try again.',
  onRetry,
  retryLabel = 'Retry',
  className,
  compact = false,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center panel rounded-xl border-danger/30',
        compact ? 'p-6' : 'p-12',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-subtle">
        <AlertTriangle className="h-5 w-5 text-danger" aria-hidden />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink-high">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-ink-mid">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};