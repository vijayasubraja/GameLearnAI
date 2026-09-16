import React from 'react';
import { cn } from '../../lib/cn';

type Tone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: Tone;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const toneFill: Record<Tone, string> = {
  default: 'bg-ink-mid',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const toneText: Record<Tone, string> = {
  default: 'text-ink-mid',
  primary: 'text-primary-text',
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  tone = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className,
}) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs text-ink-mid">{label ?? 'Progress'}</span>
          <span className={cn('text-xs font-semibold tabular-nums', toneText[tone])}>
            {Math.round(pct)}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={cn('w-full overflow-hidden rounded-full bg-white/[0.06]', size === 'sm' ? 'h-1.5' : 'h-2')}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out', toneFill[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};